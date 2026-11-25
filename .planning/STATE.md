# Project State — AI Teacher Lab

- **Repository:** `https://github.com/mhmddesign/aiteacherlab`
- **Baseline Commit:** `5224ad59e6e063a09e9c73481e7675372bf530f1` (`fix(db): grant server service_role required table privileges`)
- **Active Branch:** `fix/presentation-first-instant-interactions`
- **Current Phase:** Phase 1 — Fixed 16:9 Presentation Canvas + Instant Click Feedback (Verified Locally, Ready for Vercel Preview Verification)
- **Supabase Project:** `atuqqdjiqkuhykkgosnx` (`AI Teacher Lab v1`, `eu-west-1`, `ACTIVE_HEALTHY`)

## Phase 1 Summary & Verification Status
1. **Realtime Auth Fixed:** Switched browser Realtime client (`src/lib/supabase/browser.ts`, `src/lib/realtime/client.ts`) from `@supabase/ssr` `createBrowserClient` to `createClient(..., { accessToken })` + exponential-backoff reconnect, and eliminated cross-instance random-password races in `src/lib/realtime/server.ts`.
2. **SSR & API Critical Path + Click Feedback Fixed:** Guarded `/presenter` SSR PIN hint behind verified facilitator session (`src/app/presenter/page.tsx`, `src/app/api/presenter/state/route.ts`), cached static workshop/activity lookups and parallelized `getPresenterSnapshot()` queries (`src/lib/workshop/supabase-store.ts`), hydrated snapshot on `/api/presenter/login`, added route loading fallbacks (`loading.tsx`), tactile active button feedback (`globals.css`), and loading spinners across route links, presenter actions, and participant widgets (`cbb8c53`).
3. **Fixed 16:9 Responsive Presentation Canvas (`1920 × 1080`):**
   - Created `src/components/slides/SlideCanvas.tsx` (`1920 × 1080`), `src/components/slides/PresentationViewport.tsx` (CSS `transform: scale(...)` + reserved bounding box via `ResizeObserver` with zero resize React re-renders), and `src/lib/usePresentationFullscreen.ts` (Fullscreen API + CSS fallback + Escape handling).
   - Refactored `SlideRenderer.tsx` and all interactive widgets (`QuizWidget`, `LivePollWidget`, `UseCaseExplorer`, `PromptBuilderWidget`, `MetaPromptExercise`, `WebTrioExplainer`, `DemoQuizApp`, `AppGalleryExplorer`, `GroupProjectsBoard`, `ShowcaseVotingWidget`, `ExitTicketWidget`, `DarijaCallout`) with non-breakpoint fixed `1920 × 1080` canvas compositions across all 21 slides while preserving mobile-first `/join` UI + optional `16:9` slide preview.
   - Separated external `/screen` QR sidebar outside `PresentationViewport` and hid headers/sidebars/QR overlays in fullscreen mode; added discreet portrait-phone landscape suggestion (`Tournez l'appareil en paysage · أدر الجهاز أفقياً لعرض أوضح`).
4. **Local Verification Passed:** `typecheck`, `lint` (`0` errors, `0` warnings), `next build`, `verify-api.mjs`, `verify-e2e.mjs`, and `verify-canvas.mjs` (all 7 viewports `2560×1440`, `1920×1080`, `1440×900`, `1366×768`, `768×1024`, `390×844`, `844×390`, all 21 slides, Fullscreen API + `Escape`, `/join` `16:9` preview) all exited `0`.
