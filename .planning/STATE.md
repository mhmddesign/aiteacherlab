# Project State — AI Teacher Lab

- **Repository:** `https://github.com/mhmddesign/aiteacherlab`
- **Baseline Commit:** `5224ad59e6e063a09e9c73481e7675372bf530f1` (`fix(db): grant server service_role required table privileges`)
- **Active Branch:** `fix/presentation-first-instant-interactions`
- **Current Phase:** Phase 1 — Implemented & Locally Verified (ready for Vercel Preview verification)
- **Supabase Project:** `atuqqdjiqkuhykkgosnx` (`AI Teacher Lab v1`, `eu-west-1`, `ACTIVE_HEALTHY`)

## Phase 1 Summary & Verification Status
1. **Realtime Auth Fixed:** Switched browser Realtime client (`src/lib/supabase/browser.ts`, `src/lib/realtime/client.ts`) from `@supabase/ssr` `createBrowserClient` to `createClient(..., { accessToken })` + exponential-backoff reconnect, and eliminated cross-instance random-password races in `src/lib/realtime/server.ts`.
2. **SSR & API Critical Path Fixed:** Guarded `/presenter` SSR PIN hint behind verified facilitator session (`src/app/presenter/page.tsx`, `src/app/api/presenter/state/route.ts`), parallelized participant auth/rate-limit queries, moved Realtime broadcasts into Next.js `after()`, and eliminated heavy snapshot re-queries from `PATCH /api/presenter/control`.
3. **Presentation-First UX & Instant Optimistic UI:** Minimal `/` gateway, presentation-first `/presenter` stage with hidden-by-default Outline (`Plan`) & on-demand `Notes` / `Tableau de bord` drawers + coalescing optimistic navigation queue (`currentIdxRef`), editorial slide layouts (`SlideRenderer.tsx`), per-item optimistic selection + rollback/retry across participant widgets, and zero `/api/participant/me` refetches after answers.
4. **Local Verification Passed:** `typecheck`, `lint`, `next build`, `verify-api.mjs`, and 4-context `verify-e2e.mjs` (Desktop `1440×900`, Laptop `1366×768`, Projector `1920×1080`, Mobile `390×844`) all exited `0`. Remote Vercel Preview browser verification awaits GitHub branch Preview build.
