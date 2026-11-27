# Roadmap — AI Teacher Lab (`teacher-workshop-live`)

## Milestone v1.1 (Complete — Merged to `main` @ `1282cb1`)
- **Phase 1:** Presentation-First Architecture, Private Realtime Auth & Fixed `1920 × 1080` 16:9 Canvas
- **Phase 2:** Platform Stabilization, Mobile-First Landscape UX & Studio Multi-Room Foundation
- **Phase 3:** Accessible Navy / Ivory / Teal / Slate-Blue Design System & Multi-Format Favicon Deployment

---

## Milestone v2.0: AI Teacher Lab Studio 2.0 (Interactive Presentation Authoring Platform)

Branch: `feat/interactive-presentation-studio` (branched from `origin/main` @ `1282cb1`)

| Phase | Scope | Dependencies | Key Acceptance Criteria |
|---|---|---|---|
| **2.0-P0** | Architecture, Product Specs & Low-Fi Wireframes | None | 6 spec docs (`STUDIO_2_PRODUCT_REQUIREMENTS.md`, `PRESENTATION_EDITOR_ARCHITECTURE.md`, `PRESENTATION_DOCUMENT_SCHEMA.md`, `EDITOR_COMPONENT_REGISTRY.md`, `AI_PRESENTATION_GENERATION_DESIGN.md`, `PDF_EXPORT_DESIGN.md`), gaps from v1.1 proposals addressed. |
| **2.0-P1** | True 16:9 Presentation PDF + Independent A4 Classroom Handouts | P0 | Dedicated `/export/slides` print-preview & export route; 21-slide Mediouna deck exports as valid 21-page 16:9 PDF (`20in × 11.25in`); A4 portrait/landscape worksheets & 2-up/4-up handouts independent of presenter chrome. |
| **2.0-P2** | Versioned Native Presentation Document Model & Component Registry | P0 | Declarative Zod-validated `DeckDocumentV1` on `1920 × 1080` canvas; 30+ registered General, Interactive, Primary-School (1AEP–6AEP), and Sandboxed Code components; unknown-element safe placeholder. |
| **2.0-P3** | Deterministic Mediouna 21-Slide Importer & Parity | P2 | `importMediounaDeckToDocument()` preserves all 21 slides, 12 sections, 8 activities, FR/AR/Darija notes, and runtime parity without removing `src/content/slides.ts`. |
| **2.0-P4** | Additive Supabase Migration & Durable Server-Backed Store + APIs | P2 | Strictly additive `202611270001_studio_2_authoring_schema.sql` (not applied to Production) + `STUDIO_2_MIGRATION_REVIEW.md` with rollback SQL; `/api/studio/*` facilitator-gated CRUD, revision history, isolated live sessions. |
| **2.0-P5** | Full Visual Drag-and-Drop 16:9 Presentation Editor & Unified Live Runtime | P1, P2, P3, P4 | `/studio/rooms/[roomId]/decks/[deckId]/edit` with multi-select drag/resize/rotate/snap, inline FR+AR editing, undo/redo, debounced revision autosave + `409` conflict recovery, sandboxed HTML/CSS/JS `<iframe sandbox="allow-scripts">` execution, live session launch into `/presenter`, `/screen`, `/join`. |
| **2.0-P6** | AI Presentation Generator & Selected-Slide Assistant (AI SDK 6) | P2, P4, P5 | Server-side `generateText` + `Output.object({ schema })` (`@ai-sdk/google`), staged outline-before-deck wizard, non-destructive selected-slide AI diff preview, token/cost readout, cancellation, rate limiting. |
| **2.0-P7** | End-to-End QA, Security/Sandbox Tests, PDF Audit & Visual Verification | P1–P6 | `typecheck`, `lint`, `build`, existing suites (`verify-api`, `verify-e2e`, `verify-canvas`, `verify-studio-stability`, `verify-design-system`) + new `verify-pdf-export.mjs` & `verify-studio-2.mjs` all exit `0`. |
