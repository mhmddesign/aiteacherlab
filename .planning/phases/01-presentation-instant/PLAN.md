# Phase 1 Execution Plan

1. **Fix Supabase Private Realtime + Server Auth + `after()` Critical Paths**
   - `src/lib/supabase/browser.ts`, `src/lib/realtime/client.ts`, `src/lib/realtime/server.ts`
   - `src/app/presenter/page.tsx`, `src/content/types.ts`, `src/lib/workshop/supabase-store.ts`, `src/lib/workshop/local-store.ts`
   - `src/app/api/participant/respond/route.ts`, `src/app/api/participant/join/route.ts`, `src/app/api/presenter/control/route.ts`
2. **Instant Optimistic Participant Interactions + Rollback**
   - `src/components/participant/ParticipantShell.tsx`
   - `src/components/interactive/LivePollWidget.tsx`, `QuizWidget.tsx`, `ShowcaseVotingWidget.tsx`, `PromptBuilderWidget.tsx`, `MetaPromptExercise.tsx`, `ExitTicketWidget.tsx`
3. **Presentation-First `/presenter`, Clean `/screen`, Minimal `/`, & Editorial Slide Compositions**
   - `src/app/globals.css`, `src/app/page.tsx`
   - `src/components/presenter/PresenterShell.tsx`, `src/components/screen/ProjectorShell.tsx`
   - `src/components/slides/SlideRenderer.tsx`, `src/components/ui/DarijaCallout.tsx`, `src/components/ui/LiveChart.tsx`
4. **Performance Instrumentation, Multi-Viewport Browser Verification & Ship**
   - Update & run `scripts/verify-e2e.mjs` + `scripts/verify-api.mjs` + `typecheck` + `lint` + `build`
   - Record real metrics in `.planning/phases/01-presentation-instant/VERIFICATION.md` and `docs/BUILD_LOG.md`
   - Commit cleanly and push `fix/presentation-first-instant-interactions` to `origin`.
