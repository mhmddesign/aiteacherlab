-- AI Teacher Lab · Mediouna
-- Explicit server-side privileges for the application service_role.
-- RLS remains enabled on all public tables; anon/authenticated remain restricted.

GRANT USAGE ON SCHEMA public TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.workshops,
  public.workshop_state,
  public.activities,
  public.participants,
  public.responses,
  public.gallery_contributions,
  public.rate_limits,
  public.realtime_channel_grants
TO service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Preserve the same privileges for future tables/sequences created in public
-- by the migration owner (normally postgres).
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO service_role;

GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer)
  TO service_role;
