# Studio 2.0 Database Migration Review

**Migration file:** `supabase/migrations/202611270001_studio_2_authoring_schema.sql`  
**Target Supabase project:** `atuqqdjiqkuhykkgosnx` (NOT yet applied to Production)

---

## 1. Safety & Impact Summary

- **100% additive:** Creates 7 new tables (`studio_rooms`, `studio_decks`, `studio_deck_revisions`, `studio_sessions`, `studio_live_responses`, `studio_resources`, `studio_custom_components`).
- **Zero destructive statements:** Does NOT drop, alter, truncate, or migrate any existing v1 table (`workshops`, `workshop_state`, `activities`, `participants`, `responses`, `gallery_contributions`, `rate_limits`, `realtime_channel_grants`).
- **Mediouna backward compatibility:** Existing `/`, `/presenter`, `/screen`, `/join`, and `/api/workshop/*` routes keep reading/writing the untouched v1 tables.
- **Row-Level Security:** RLS is explicitly enabled on all 7 new tables, matching v1 server-only `service_role` access so browser anon keys cannot read or mutate room drafts, facilitator pins, or participant responses.

---

## 2. Pre-Migration Checks

```sql
-- Verify existing v1 tables remain healthy before applying:
select tablename
from pg_tables
where schemaname = 'public'
order by tablename;

-- Confirm none of the Studio 2.0 table names collide:
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name like 'studio_%';
```

---

## 3. Post-Migration Verification Checks

```sql
-- Confirm all 7 Studio 2.0 tables exist with RLS enabled:
select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relname like 'studio_%'
order by relname;
```

Expected: 7 rows (`studio_custom_components`, `studio_deck_revisions`, `studio_decks`, `studio_live_responses`, `studio_resources`, `studio_rooms`, `studio_sessions`), each with `rls_enabled = true`.

---

## 4. Safe Rollback Script

Because the migration adds only isolated `studio_*` tables, rolling back leaves v1 data completely untouched:

```sql
drop table if exists public.studio_live_responses cascade;
drop table if exists public.studio_custom_components cascade;
drop table if exists public.studio_resources cascade;
drop table if exists public.studio_sessions cascade;
drop table if exists public.studio_deck_revisions cascade;
drop table if exists public.studio_decks cascade;
drop table if exists public.studio_rooms cascade;
```
