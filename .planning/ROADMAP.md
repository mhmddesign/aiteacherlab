# Roadmap — AI Teacher Lab (`teacher-workshop-live`)

## Milestone v1.1: Presentation-First Redesign & Instant Live Sync

### Phase 1: Presentation-First Architecture, Realtime Repair & Instant Optimistic Interactions
- **Goal:** Fix live Supabase Private Realtime auth (`Synchro HTTP` -> `Temps réel`), harden SSR & API critical paths (`after()`), refactor `/presenter` into a keynote-first workspace with ordered optimistic navigation, eliminate participant response latency with immediate local feedback + rollback, and enforce a fixed `1920 × 1080` 16:9 projector-readable canvas.
- **Status:** Complete (merged to `main` @ `064311a`)
- **Branch:** `fix/presentation-first-instant-interactions`

### Phase 2: Platform Stabilization, Mobile-First UX & Multi-Room Studio Foundation
- **Goal:** Eliminate double-click/snap-back and refetch storms, stabilize `ConnectionBadge` with debounced 5-state sync, add automatic compact landscape chrome collapse on mobile phones, and introduce the `/studio` multi-room workspace + non-destructive migration proposal.
- **Status:** Complete (`feat/studio-platform-stability-ux` @ `88b1f1b`)
- **Branch:** `feat/studio-platform-stability-ux`

### Phase 3: Complete Design System Refinement, Brand Application & Favicon Deployment
- **Goal:** Centralize semantic Navy / Ivory / Teal / Slate-Blue design tokens in `globals.css`, enforce WCAG 2.2 AA contrast across all interactive surfaces and semantic states, refine `/studio`, `/`, `/presenter`, `/screen`, `/join` and interactive widgets into a coherent hybrid editorial design language, and deploy `icon.svg`, `favicon.ico`, and `apple-icon.png` with full 12-screen visual QA.
- **Status:** In Progress
- **Branch:** `feat/studio-platform-stability-ux`
