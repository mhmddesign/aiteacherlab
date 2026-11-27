-- AI Teacher Lab Studio 2.0 Additive Authoring & Session Schema
-- Non-destructive migration: preserves all existing v1 workshop tables unchanged.

create table if not exists public.studio_rooms (
  id text primary key,
  slug text not null unique,
  title_fr text not null,
  title_ar text not null,
  subtitle_fr text not null default '',
  subtitle_ar text not null default '',
  level_badge text not null default '1AEP – 6AEP · Formation',
  join_pin text not null default '4829',
  status text not null default 'active' check (status in ('active', 'archived')),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_decks (
  id text primary key,
  room_id text not null references public.studio_rooms(id) on delete cascade,
  title_fr text not null,
  title_ar text not null,
  current_revision_no integer not null default 1,
  document jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_studio_decks_room_id on public.studio_decks(room_id);

create table if not exists public.studio_deck_revisions (
  id text primary key,
  deck_id text not null references public.studio_decks(id) on delete cascade,
  revision_no integer not null,
  summary_fr text not null default '',
  summary_ar text not null default '',
  source text not null default 'manual' check (source in ('manual', 'autosave', 'import', 'ai', 'restore')),
  document jsonb not null,
  created_at timestamptz not null default now(),
  unique(deck_id, revision_no)
);

create index if not exists idx_studio_deck_revisions_deck on public.studio_deck_revisions(deck_id, revision_no desc);

create table if not exists public.studio_sessions (
  id text primary key,
  room_id text not null references public.studio_rooms(id) on delete cascade,
  deck_id text references public.studio_decks(id) on delete set null,
  title_fr text not null,
  title_ar text not null,
  join_pin text not null default '4829',
  status text not null default 'live' check (status in ('draft', 'live', 'ended')),
  current_slide_index integer not null default 0,
  show_results boolean not null default false,
  show_qr_overlay boolean not null default false,
  is_paused boolean not null default false,
  frozen_document jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_studio_sessions_room_id on public.studio_sessions(room_id);

create table if not exists public.studio_live_responses (
  id text primary key,
  session_id text not null references public.studio_sessions(id) on delete cascade,
  slide_id text not null,
  element_id text not null,
  activity_type text not null,
  participant_key text not null,
  participant_name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(session_id, element_id, participant_key)
);

create index if not exists idx_studio_live_responses_session_el
  on public.studio_live_responses(session_id, element_id);

create table if not exists public.studio_resources (
  id text primary key,
  room_id text not null references public.studio_rooms(id) on delete cascade,
  kind text not null default 'prompt' check (kind in ('prompt', 'link', 'note', 'worksheet')),
  title_fr text not null,
  title_ar text not null,
  content_fr text not null default '',
  content_ar text not null default '',
  url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_studio_resources_room_id on public.studio_resources(room_id);

create table if not exists public.studio_custom_components (
  id text primary key,
  room_id text references public.studio_rooms(id) on delete set null,
  title_fr text not null,
  title_ar text not null,
  html text not null,
  css text not null default '',
  js text not null default '',
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS across all Studio 2.0 tables (server-side access only via service_role)
alter table public.studio_rooms enable row level security;
alter table public.studio_decks enable row level security;
alter table public.studio_deck_revisions enable row level security;
alter table public.studio_sessions enable row level security;
alter table public.studio_live_responses enable row level security;
alter table public.studio_resources enable row level security;
alter table public.studio_custom_components enable row level security;
