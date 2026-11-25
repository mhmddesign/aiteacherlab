# AI Teacher Lab — Build & Verification Log

## Branch: `fix/presentation-first-instant-interactions`

### Commits
1. `0c58dc2` — Presentation-first `/presenter`, Supabase Realtime `accessToken` auth fix, optimistic navigation & per-item participant voting.
2. `cbb8c53` — `feat(ux): add instant click, spinner, and route loading feedback with parallel Supabase queries`
   - Route-level loading UI (`src/app/*/loading.tsx` + `RouteLoadingScreen.tsx`) and immediate click-pending links (`NavActionLink.tsx`).
   - Inline loading spinners across `ParticipantShell`, `PresenterShell`, `LivePollWidget`, `QuizWidget`, `PromptBuilderWidget`, `MetaPromptExercise`, `ShowcaseVotingWidget`, `ExitTicketWidget`, and smooth scroll reveal in `AppGalleryExplorer`.
   - Cached static `workshops` & `activities` metadata + `Promise.all` query parallelization in `src/lib/workshop/supabase-store.ts`, plus login snapshot hydration in `src/app/api/presenter/login/route.ts`.
3. `ed3db17` — `feat(ui): enforce fixed 16:9 responsive presentation canvas`
   - Added `SlideCanvas.tsx` (`1920 × 1080`), `PresentationViewport.tsx` (`ResizeObserver` uniform proportional scaling with zero React re-renders), and `usePresentationFullscreen.ts` (Fullscreen API + CSS fallback + Escape + scroll lock).
   - Converted `/presenter` and `/screen` to viewport-locked `100dvh` stages with external QR sidebar on `/screen`, discreet floating fullscreen nav controls on `/presenter`, and portrait-phone orientation hint.
4. Latest commit — `feat(ui): upgrade to projector-readable keynote typography, recomposed 16:9 slides and shrink-safe viewport`
   - Fixed flex shrink-lock on portrait transitions by positioning `[data-slide-frame="true"]` out-of-flow centered (`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` + `aspectRatio: "16 / 9"`) in `PresentationViewport.tsx` and adding `min-w-0` to `PresenterShell.tsx` `<main>`.
   - Slimmed `/screen` external QR sidebar to `hidden 2xl:flex w-52` (`QrJoinPanel size={132}`) to maximize projected slide width while keeping it non-overlapping and hidden in fullscreen.
   - Upgraded logical canvas typography across `SlideRenderer.tsx`, `LiveChart.tsx`, `QrJoinPanel.tsx`, and all 11 interactive widgets to projector-grade sizes (`66–76px` FR headings, `60–66px` AR headings, `26–36px` body/bullets, `124px` live counters, large chart labels).
   - Recomposed dense slides into Keynote-style visuals (Slide 14 4-step Ecosystem flow, Spotlight Question Stepper on Slides 5 & 8, full-bleed dark navy Closing Slide 21, zero-clip 12-card Gallery on Slide 16) and moved spoken Darija cues into the Presenter Notes drawer while preserving simultaneous FR + AR on all 21 slides.
   - Expanded `scripts/verify-canvas.mjs` to test all 8 viewports, measure effective rendered font sizes (`VIEWPORT_REPORT`), assert inner `stageOverflowPx <= 4` on all 21 slides, and support remote Vercel Preview verification (`--public-only`).

### Executed Verification Commands (All Passed, Exit Code `0`)
- `npm.cmd run typecheck` — `0` errors
- `npm.cmd run lint` — `0` errors, `0` warnings
- `npm.cmd run build` — `18` routes compiled cleanly
- `node scripts/verify-api.mjs http://localhost:3000` — passed
- `node scripts/verify-e2e.mjs http://localhost:3000` — passed (`optimisticNavLatencyMs: 121`, `optimisticAnswerLatencyMs: 88`, `meCallsAfterParticipantJoin: 0`)
- `node scripts/verify-canvas.mjs http://localhost:3000` — passed across all 8 viewports (`1920×1080`, `1600×900`, `1440×900`, `1366×768`, `1024×768`, `768×1024`, `390×844`, `844×390`), all 21 slides (`stageOverflowPx <= 4` + projector typography), native Fullscreen API (`1920×1080` fill + `Escape`), and `/join` `16:9` preview
