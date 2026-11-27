# Presentation Editor Architecture (`PRESENTATION_EDITOR_ARCHITECTURE.md`)

> **Route:** `/studio/rooms/[roomId]/decks/[deckId]/edit`  
> **Primary Presenter/Projector/Participant Live Hook:** `/presenter?sessionId=...`, `/screen?sessionId=...`, `/join?sessionId=...`

---

## 1. Architecture Boundaries (Clean Separation of Concerns)

1. **Document State Store (In-Memory Reducer / Undo Stack + Server Revision Sync):**
   - Authoritative model: `DeckDocumentV1` (`slides[]`, `sections[]`, `theme`, `canvasWidth: 1920`, `canvasHeight: 1080`).
   - Past/future stacks (`undoStack`, `redoStack`, max `40` snapshots) record pure immutable JSON snapshots whenever slides/elements change.
   - Drag/resize interactions update local state on `pointermove` via `requestAnimationFrame` without pushing intermediate frames onto the Undo stack or network — committing one undo entry & marking dirty on `pointerup`.
2. **Version-Aware Autosave & Crash Recovery:**
   - **Save States:** `"saved" | "unsaved" | "saving" | "offline" | "error" | "conflict"`.
   - Every local mutation schedules a `1500ms` debounced `PATCH /api/studio/decks/[deckId]` carrying `{ document, titleFr, titleAr, expectedRevision, isAutosave: true }`.
   - Simultaneously writes an emergency recovery envelope (`{ revision, updatedAt, document }`) into `sessionStorage` / `localStorage` keyed by `deckId`; if a newer local crash draft exists on mount, prompts one-click **Restaurer le brouillon / استعادة المسودة**.
   - If server returns HTTP `409 Revision Conflict`, editor transitions to `"conflict"` and surfaces **Recharger version serveur** vs **Forcer l'enregistrement**.
   - Never loses edits on route exit: registers `beforeunload` warning when dirty + flushes save via explicit `Enregistrer / حفظ`.
3. **16:9 Authoring Stage (`1920 × 1080` Coordinate Space):**
   - `EditorCanvasStage` computes uniform viewport scale (or explicit zoom `Fit` / `50%` / `75%` / `100%`) using `ResizeObserver`, converting pointer pixel deltas directly into logical canvas coordinates (`deltaLogicalX = deltaClientX / scale`).
   - Supports grid toggle (`20px` snap), smart center-axis alignment guides (`x = 960`, `y = 540`), multi-selection (`Shift+Click`), 8-point resize handles, rotation (`-180°..180°`), z-order front/back, lock/unlock, double-click inline bilingual editing, and full keyboard alternatives (`Arrow` / `Shift+Arrow` nudge, `Ctrl/Cmd+Z`, `Ctrl/Cmd+Y`, `Ctrl/Cmd+D`, `Delete`/`Backspace`).
4. **Unified Rendering & Live Session Bridge:**
   - **Editor, Preview, Presenter, Projector, PDF Export** all consume the shared `<DeckSlideStage />` renderer on `1920 × 1080`.
   - For imported Mediouna slides without edits (`slide.legacySource` intact), `<DeckSlideStage />` delegates cleanly to `SlideRenderer` so visual output has 100% parity while allowing immediate detachment (`detachLegacy` on edit) when a teacher customizes an element visually!
   - Launching **Présenter Live** creates an immutable snapshot inside `room_sessions` and opens `/presenter?sessionId=<id>`, synchronizing with `/screen?sessionId=<id>` and `/join?sessionId=<id>` via `/api/studio/live`.
