# AI Teacher Lab Studio — Non-Destructive Supabase Migration Proposal

> **IMPORTANT — PROPOSAL ONLY (NOT APPLIED TO PRODUCTION)**  
> This migration has **NOT** been executed against production Supabase project `atuqqdjiqkuhykkgosnx` (`AI Teacher Lab v1`, `eu-west-1`).  
> It is designed to be **100% additive, backward-compatible, and zero-data-loss**, preserving the existing `mediouna-ai-teacher-lab` workshop (`5ee0df96-e5c5-48fb-ba7e-fa2debdcf198`), all 8 activities, all 18 demo participants, all 5 real participants, and all 314 responses intact.

---

## 1. Current Production Baseline (Verified Read-Only)

- **Project:** `atuqqdjiqkuhykkgosnx` (Postgres `17.12`, `ACTIVE_HEALTHY`)
- **Existing 8 Tables (all with `rls_enabled = true`, default-deny for `anon`/`authenticated`):**
  - `workshops` (1 row: `mediouna-ai-teacher-lab`)
  - `workshop_state` (1 row, `state_version = 179`)
  - `activities` (8 rows)
  - `participants` (23 rows: 18 demo + 5 real)
  - `responses` (314 rows)
  - `gallery_contributions`
  - `rate_limits`
  - `realtime_channel_grants`
- **Security Advisor Observations (2 non-blocking `WARN` items found during audit):**
  1. `public.has_realtime_channel_grant` (`SECURITY DEFINER`) is currently executable by `authenticated` / `public`; tighten `EXECUTE` privileges or pin `SET search_path = public, pg_temp`.
  2. Supabase Auth `leaked_password_protection` is disabled (low impact today since workshop auth uses signed cookies, recommended to enable before adding Supabase Auth accounts).

---

## 2. Additive Schema Design Principles

1. **Keep `workshops` as the canonical Room table** (or add room metadata columns directly onto `workshops`) rather than renaming tables and breaking existing queries or production deployments.
2. **Introduce `room_sessions`, `room_resources`, and `room_decks` as additive tables** linked by `workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE`.
3. **Add nullable `session_id` foreign keys** to `participants`, `responses`, and `workshop_state`, backfilling the existing Mediouna workshop into **Room #1 · Session #1** so zero historical records are lost.
4. **Preserve strict default-deny RLS** on every new table (all reads/writes via verified Next.js server API routes using `service_role`).

---

## 3. Proposed SQL Migration (`supabase/migrations/20261126_studio_multi_room.sql`)

```sql
-- ============================================================================
-- AI Teacher Lab Studio — Additive Multi-Room & Session Isolation Migration
-- STATUS: PROPOSAL ONLY — Review & test on a Supabase Branch before Production
-- ============================================================================

BEGIN;

-- 1. Extend existing `workshops` table into persistent Studio Rooms
ALTER TABLE public.workshops
  ADD COLUMN IF NOT EXISTS template_key TEXT NOT NULL DEFAULT 'workshop-bilingual',
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'live'
    CHECK (status IN ('draft', 'ready', 'live', 'archived')),
  ADD COLUMN IF NOT EXISTS description_fr TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_ar TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS room_pin_hash TEXT,
  ADD COLUMN IF NOT EXISTS facilitator_passcode_hash TEXT,
  ADD COLUMN IF NOT EXISTS is_default_room BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Mark existing Mediouna workshop as Room #1 (default room)
UPDATE public.workshops
SET
  template_key = 'workshop-bilingual',
  status = 'live',
  is_default_room = TRUE,
  description_fr = 'Atelier interactif d''innovation pédagogique et IA pour les enseignants du primaire — Province de Mediouna.',
  description_ar = 'ورشة تفاعلية للابتكار التربوي والذكاء الاصطناعي لأساتذة التعليم الابتدائي — إقليم مديونة.'
WHERE slug = 'mediouna-ai-teacher-lab';

-- 2. Isolated Live Sessions per Room (allows running N cohorts per Room)
CREATE TABLE IF NOT EXISTS public.room_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  label_fr TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'live'
    CHECK (status IN ('scheduled', 'live', 'ended', 'archived')),
  join_pin_override TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  summary_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_room_sessions_workshop_status
  ON public.room_sessions (workshop_id, status, created_at DESC);

-- Ensure at most one active 'live' session per room at a time
CREATE UNIQUE INDEX IF NOT EXISTS uq_room_sessions_one_live_per_room
  ON public.room_sessions (workshop_id)
  WHERE status = 'live';

-- 3. Persistent Room Resources (files, links, guides, prototypes)
CREATE TABLE IF NOT EXISTS public.room_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('link', 'pdf', 'html_app', 'prompt_pack', 'image', 'slide_deck')),
  title_fr TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_fr TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  url TEXT,
  storage_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible_to_participants BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_room_resources_workshop_order
  ON public.room_resources (workshop_id, sort_order, created_at);

-- 4. Room Presentation Deck Overrides (enables custom slide decks per Room)
CREATE TABLE IF NOT EXISTS public.room_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  slide_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  section_number INTEGER NOT NULL DEFAULT 1,
  layout_type TEXT NOT NULL DEFAULT 'content',
  content_json JSONB NOT NULL,
  presenter_notes_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workshop_id, slide_key)
);

-- 5. Link existing state, participants, and responses to room_sessions (nullable & backward-compatible)
ALTER TABLE public.workshop_state
  ADD COLUMN IF NOT EXISTS active_session_id UUID REFERENCES public.room_sessions(id) ON DELETE SET NULL;

ALTER TABLE public.participants
  ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES public.room_sessions(id) ON DELETE SET NULL;

ALTER TABLE public.responses
  ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES public.room_sessions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_participants_session ON public.participants (session_id);
CREATE INDEX IF NOT EXISTS idx_responses_session ON public.responses (session_id);

-- 6. Zero-Data-Loss Backfill: attach existing Mediouna data to Session #1
DO $$
DECLARE
  v_workshop_id UUID;
  v_session_id UUID;
BEGIN
  SELECT id INTO v_workshop_id
  FROM public.workshops
  WHERE slug = 'mediouna-ai-teacher-lab'
  LIMIT 1;

  IF v_workshop_id IS NOT NULL THEN
    SELECT id INTO v_session_id
    FROM public.room_sessions
    WHERE workshop_id = v_workshop_id AND status = 'live'
    LIMIT 1;

    IF v_session_id IS NULL THEN
      INSERT INTO public.room_sessions (workshop_id, label_fr, label_ar, status)
      VALUES (
        v_workshop_id,
        'Session principale — Mediouna (Cohorte 1)',
        'الجلسة الرئيسية — مديونة (الفوج 1)',
        'live'
      )
      RETURNING id INTO v_session_id;
    END IF;

    UPDATE public.workshop_state
    SET active_session_id = v_session_id
    WHERE workshop_id = v_workshop_id AND active_session_id IS NULL;

    UPDATE public.participants
    SET session_id = v_session_id
    WHERE workshop_id = v_workshop_id AND session_id IS NULL;

    UPDATE public.responses
    SET session_id = v_session_id
    WHERE workshop_id = v_workshop_id AND session_id IS NULL;
  END IF;
END $$;

-- 7. Strict Default-Deny RLS on all new tables
ALTER TABLE public.room_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_slides ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.room_sessions FROM anon, authenticated;
REVOKE ALL ON public.room_resources FROM anon, authenticated;
REVOKE ALL ON public.room_slides FROM anon, authenticated;

GRANT ALL ON public.room_sessions TO service_role;
GRANT ALL ON public.room_resources TO service_role;
GRANT ALL ON public.room_slides TO service_role;

-- 8. Hardening for Security Advisor warning on has_realtime_channel_grant
-- Ensure search_path is pinned safely without breaking Realtime topic authorization.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc
    WHERE proname = 'has_realtime_channel_grant'
      AND pronamespace = 'public'::regnamespace
  ) THEN
    ALTER FUNCTION public.has_realtime_channel_grant(TEXT)
      SET search_path = public, pg_temp;
  END IF;
END $$;

COMMIT;
```

---

## 4. Supabase Storage Bucket Plan (Future File Uploads)

When facilitators upload PDFs, handouts, or custom slide assets to a Room's **Resources** tab:

- **Bucket:** `studio-room-resources` (`public = false`, max file size `15 MB`, allowed MIME types: `application/pdf`, `image/png`, `image/jpeg`, `image/webp`, `text/html`, `text/markdown`).
- **Path Convention:** `<workshop_id>/<resource_id>/<sanitized_filename>`.
- **Access Pattern:** Upload via authenticated Facilitator API route (`service_role` signed upload URL); participants receive short-lived (`15 min`) signed download URLs only for resources marked `visible_to_participants = true` inside their verified room session.

---

## 5. Safe Rollout Checklist (When Approved)

1. Create a Supabase Preview Branch (`create_branch`) and run the SQL migration above.
2. Verify row counts before and after backfill (`workshops = 1`, `activities = 8`, `participants = 23`, `responses = 314`, `room_sessions = 1`).
3. Verify existing `/api/workshop/state`, `/api/presenter/control`, `/api/participant/join`, and `/api/realtime/token` routes pass `scripts/verify-api.mjs` and `scripts/verify-e2e.mjs` with zero regressions.
4. Enable `preview`-scoped environment variables on Vercel and validate `/studio` CRUD routes on a Vercel Preview deployment.
5. Only after sign-off, apply migration to Production (`atuqqdjiqkuhykkgosnx`) and promote the release.
