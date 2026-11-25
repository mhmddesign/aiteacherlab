# AI Teacher Lab — Build & Verification Log

## Branch: `fix/presentation-first-instant-interactions`

### Recent Commits
1. `0c58dc2` — Presentation-first `/presenter`, Supabase Realtime `accessToken` auth fix, optimistic navigation & per-item participant voting.
2. `cbb8c53` — `feat(ux): add instant click, spinner, and route loading feedback with parallel Supabase queries`
   - Route-level loading UI (`src/app/*/loading.tsx` + `RouteLoadingScreen.tsx`) and immediate click-pending links (`NavActionLink.tsx`).
   - Inline loading spinners across `ParticipantShell`, `PresenterShell`, `LivePollWidget`, `QuizWidget`, `PromptBuilderWidget`, `MetaPromptExercise`, `ShowcaseVotingWidget`, `ExitTicketWidget`, and smooth scroll reveal in `AppGalleryExplorer`.
   - Cached static `workshops` & `activities` metadata + `Promise.all` query parallelization in `src/lib/workshop/supabase-store.ts`, plus login snapshot hydration in `src/app/api/presenter/login/route.ts`.
3. Current commit — `feat(ui): enforce fixed 16:9 responsive presentation canvas`
   - Added `SlideCanvas.tsx` (`1920 × 1080`), `PresentationViewport.tsx` (`ResizeObserver` uniform proportional scaling with zero React re-renders), and `usePresentationFullscreen.ts` (Fullscreen API + CSS fallback + Escape + scroll lock).
   - Converted `/presenter` and `/screen` to viewport-locked `100dvh` Keynote/PowerPoint-style stages with separate non-overlapping QR sidebar on `/screen`, discreet floating fullscreen nav controls on `/presenter`, slide-only fullscreen on `/screen`, and portrait-phone orientation suggestion.
   - Refactored `SlideRenderer.tsx` and all 11 interactive components + `DarijaCallout.tsx` / `LiveChart.tsx` so all 21 slides share an invariant bilingual `1920 × 1080` layout while keeping `/join` mobile-first (plus an optional `Aperçu 16:9` slide preview).
   - Fixed `/screen` mobile header wrapping so narrow phone viewports (`390×844`, `844×390`) display status controls without overlap.

### Executed Verification Commands (All Passed, Exit Code `0`)
- `npm.cmd run typecheck` — `0` errors
- `npm.cmd run lint` — `0` errors, `0` warnings
- `npm.cmd run build` — `18` routes compiled cleanly
- `node scripts/verify-api.mjs http://localhost:3000` — passed
- `node scripts/verify-e2e.mjs http://localhost:3000` — passed (`optimisticNavLatencyMs: 231`, `optimisticAnswerLatencyMs: 112`, `meCallsAfterParticipantJoin: 0`)
- `node scripts/verify-canvas.mjs http://localhost:3000` — passed across all 7 viewports, all 21 slides, native Fullscreen API, and `/join` 16:9 preview
