# Project State — AI Teacher Lab

- **Repository:** `https://github.com/mhmddesign/aiteacherlab`
- **Baseline Commit:** `5224ad59e6e063a09e9c73481e7675372bf530f1` (`fix(db): grant server service_role required table privileges`)
- **Active Branch:** `fix/presentation-first-instant-interactions`
- **Current Phase:** Phase 1 — True 16:9 Projector-Readable Keynote Canvas + Instant Interactions (Verified Locally; Pending Remote Vercel Preview Check)
- **Supabase Project:** `atuqqdjiqkuhykkgosnx` (`AI Teacher Lab v1`, `eu-west-1`, `ACTIVE_HEALTHY`)

## Phase 1 Summary & Verification Status
1. **Realtime Auth Fixed:** Switched browser Realtime client (`src/lib/supabase/browser.ts`, `src/lib/realtime/client.ts`) from `@supabase/ssr` `createBrowserClient` to `createClient(..., { accessToken })` + exponential-backoff reconnect, and eliminated cross-instance random-password races in `src/lib/realtime/server.ts`.
2. **SSR & API Critical Path + Click Feedback Fixed (`cbb8c53`):** Guarded `/presenter` SSR PIN hint behind verified facilitator session (`src/app/presenter/page.tsx`, `src/app/api/presenter/state/route.ts`), cached static workshop/activity lookups and parallelized `getPresenterSnapshot()` queries (`src/lib/workshop/supabase-store.ts`), hydrated snapshot on `/api/presenter/login`, added route loading fallbacks (`loading.tsx`), tactile active button feedback (`globals.css`), and loading spinners across route links, presenter actions, and participant widgets.
3. **Fixed `1920 × 1080` Responsive Canvas (`ed3db17`):** Added `SlideCanvas.tsx`, `PresentationViewport.tsx` (`ResizeObserver` uniform proportional scaling), and `usePresentationFullscreen.ts`.
4. **Actual 16:9 Projector-Readable Typography & Keynote Recomposition (Latest):**
   - Fixed flex shrink-lock on portrait transitions by positioning `[data-slide-frame="true"]` out-of-flow (`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` + `aspectRatio: "16 / 9"`) inside `PresentationViewport.tsx` and adding `min-w-0` to `PresenterShell.tsx` `<main>`.
   - Slimmed `/screen` external QR sidebar to `hidden 2xl:flex w-52` (`QrJoinPanel size={132}`) to maximize projected slide width while keeping it non-overlapping and hidden in fullscreen.
   - Rebuilt canvas mode typography across `SlideRenderer.tsx`, `LiveChart.tsx`, `QrJoinPanel.tsx`, and all 11 interactive widgets to projector-grade logical sizes (`66–76px` FR headings, `60–66px` AR headings, `26–36px` body/bullets, `124px` live numbers, large chart labels).
   - Recomposed dense slides into Apple Keynote visuals: Slide 14 (`s08-ecosystem`) 4-step process + 5-tool ribbon, Spotlight Question Stepper on Slides 5 & 8 (`QuizWidget`), full-bleed dark navy Closing Slide 21, and moved spoken Darija cues to Presenter Notes drawer while preserving simultaneous FR + AR on all 21 slides.
5. **Local Verification Passed (Exit Code `0`):** `typecheck`, `lint` (`0` errors, `0` warnings), `next build`, `verify-api.mjs`, `verify-e2e.mjs`, and `verify-canvas.mjs` (all 8 viewports `1920×1080`, `1600×900`, `1440×900`, `1366×768`, `1024×768`, `768×1024`, `390×844`, `844×390`, all 21 slides with `stageOverflowPx <= 4` and projector typography assertions, Fullscreen API + `Escape`, `/join` `16:9` preview, plus visual inspection of rendered Keynote & mobile PNGs).
