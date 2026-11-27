# Project State — AI Teacher Lab Studio 2.0

- **Repository:** `https://github.com/mhmddesign/aiteacherlab`
- **Production Base (`origin/main`):** `1282cb1` (PR #1 merged)
- **Active Branch:** `feat/interactive-presentation-studio`
- **Active Milestone:** Studio 2.0 — Interactive Presentation Authoring Platform
- **Supabase Production (`atuqqdjiqkuhykkgosnx`):** Untouched (zero migrations executed; Mediouna workshop `mediouna-ai-teacher-lab` & 314 responses preserved).

## Confirmed Baseline Limitations Identified in Phase 0 Audit
1. `StudioWorkspaceShell.tsx` previously stored draft rooms only in browser `localStorage` (`aiteacherlab_studio_draft_rooms_v1`).
2. Existing Presentation tab displayed a static read-only inventory from `src/content/slides.ts` (`getSectionList()`).
3. `src/app/globals.css` `@media print` forced global `@page { size: A4; margin: 14mm; }`, clipping `/presenter` into A4 portrait pages.
4. No declarative deck JSON document schema, revision history, drag-and-drop canvas editor, component registry, AI SDK 6 generator, or isolated HTML/CSS/JS sandbox existed yet.
