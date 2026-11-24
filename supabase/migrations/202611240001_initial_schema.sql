-- AI Teacher Lab · Atelier Provincial de Mediouna
-- Initial PostgreSQL Schema, Strict RLS & Private Realtime Authorization

create extension if not exists pgcrypto;

-- 1. Workshops
create table if not exists public.workshops (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  join_pin_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Workshop Live State
create table if not exists public.workshop_state (
  workshop_id uuid primary key references public.workshops(id) on delete cascade,
  current_slide_id text not null default 's01-welcome',
  current_section integer not null default 1 check (current_section between 1 and 12),
  active_activity_key text,
  activity_status text not null default 'idle' check (activity_status in ('idle', 'open', 'closed', 'revealed')),
  show_results boolean not null default false,
  show_qr_overlay boolean not null default false,
  is_paused boolean not null default false,
  demo_mode boolean not null default false,
  timer_started_at timestamptz,
  timer_elapsed_seconds integer not null default 0 check (timer_elapsed_seconds >= 0),
  timer_running boolean not null default false,
  state_version bigint not null default 1,
  updated_at timestamptz not null default now()
);

-- 3. Activities (8 persisted live activities across the 12 sections)
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  activity_key text not null,
  section_number integer not null check (section_number between 1 and 12),
  activity_type text not null check (
    activity_type in (
      'poll',
      'mcq_quiz',
      'tf_quiz',
      'prompt_builder',
      'meta_prompt',
      'project_vote',
      'showcase_vote',
      'exit_ticket'
    )
  ),
  title text not null,
  reset_generation integer not null default 1,
  created_at timestamptz not null default now(),
  unique (workshop_id, activity_key)
);

-- 4. Participants (Display name + hashed individual session token only — ZERO pupil or personal PII)
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 2 and 40),
  session_token_hash text not null unique,
  is_demo boolean not null default false,
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

-- 5. Responses (Strict duplicate prevention per participant, activity, and item_key)
create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  item_key text not null default 'main',
  selected_option text,
  payload jsonb not null default '{}'::jsonb,
  is_correct boolean,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  unique (activity_id, participant_id, item_key)
);

-- 6. Provincial Mediouna Collaborative App Gallery Contributions
create table if not exists public.gallery_contributions (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  participant_id uuid references public.participants(id) on delete set null,
  contributor_name text not null check (char_length(trim(contributor_name)) between 2 and 60),
  app_title text not null check (char_length(trim(app_title)) between 3 and 100),
  grade_range text not null,
  discipline text not null,
  language text not null,
  learning_objective text not null,
  description text not null,
  classroom_instructions text not null,
  app_resource text not null,
  tested_features jsonb not null default '[]'::jsonb,
  privacy_confirmed boolean not null check (privacy_confirmed = true),
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

-- 7. Serverless Rate Limit Buckets
create table if not exists public.rate_limits (
  bucket_key text primary key,
  count integer not null default 1,
  window_start timestamptz not null default now()
);

-- 8. Private Realtime Channel Authorization Grants
create table if not exists public.realtime_channel_grants (
  user_id uuid not null,
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  topic text not null,
  role text not null check (role in ('viewer', 'presenter')),
  created_at timestamptz not null default now(),
  primary key (user_id, topic)
);

-- Indexes for fast classroom aggregations
create index if not exists idx_participants_workshop_active
  on public.participants (workshop_id, is_demo, last_seen_at desc);

create index if not exists idx_responses_workshop_activity
  on public.responses (workshop_id, activity_id, is_demo);

create index if not exists idx_responses_participant_activity
  on public.responses (participant_id, activity_id);

create index if not exists idx_gallery_workshop_demo
  on public.gallery_contributions (workshop_id, is_demo, created_at desc);

create index if not exists idx_realtime_grants_topic
  on public.realtime_channel_grants (user_id, topic);

-- Trigger for workshop_state.updated_at
create or replace function public.touch_workshop_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_workshop_state_updated_at on public.workshop_state;
create trigger trg_workshop_state_updated_at
  before update on public.workshop_state
  for each row
  execute function public.touch_workshop_state_updated_at();

-- Atomic rate-limit helper executed via server-only admin client
create or replace function public.check_rate_limit(
  p_bucket_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_window_start timestamptz;
  v_now timestamptz := now();
begin
  insert into public.rate_limits (bucket_key, count, window_start)
  values (p_bucket_key, 1, v_now)
  on conflict (bucket_key) do update
    set count = case
      when public.rate_limits.window_start + make_interval(secs => p_window_seconds) <= v_now then 1
      else public.rate_limits.count + 1
    end,
    window_start = case
      when public.rate_limits.window_start + make_interval(secs => p_window_seconds) <= v_now then v_now
      else public.rate_limits.window_start
    end
  returning count, window_start into v_count, v_window_start;

  return v_count <= p_limit;
end;
$$;

-- Strict Default-Deny Row Level Security on ALL public tables
-- All privileged queries and writes pass through authenticated Next.js Route Handlers
alter table public.workshops enable row level security;
alter table public.workshop_state enable row level security;
alter table public.activities enable row level security;
alter table public.participants enable row level security;
alter table public.responses enable row level security;
alter table public.gallery_contributions enable row level security;
alter table public.rate_limits enable row level security;
alter table public.realtime_channel_grants enable row level security;

revoke all on public.workshops from anon, authenticated;
revoke all on public.workshop_state from anon, authenticated;
revoke all on public.activities from anon, authenticated;
revoke all on public.participants from anon, authenticated;
revoke all on public.responses from anon, authenticated;
revoke all on public.gallery_contributions from anon, authenticated;
revoke all on public.rate_limits from anon, authenticated;
revoke all on public.realtime_channel_grants from anon, authenticated;

-- Private Realtime Channel Authorization on realtime.messages
-- Note: RLS on realtime.messages is already enabled by Supabase; do not alter that table.
drop policy if exists "Authorized workshop members can receive private broadcasts" on realtime.messages;
create policy "Authorized workshop members can receive private broadcasts"
  on realtime.messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.realtime_channel_grants g
      where g.user_id = (select auth.uid())
        and g.topic = realtime.topic()
    )
  );
