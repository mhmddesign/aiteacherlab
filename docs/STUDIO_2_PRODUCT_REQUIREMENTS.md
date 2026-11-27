# Studio 2.0 — Product Requirements Document (`STUDIO_2_PRODUCT_REQUIREMENTS.md`)

> **Status:** Authoring Specification (Milestone v2.0, branch `feat/interactive-presentation-studio`)  
> **Target Product:** AI Teacher Lab Studio (`https://lab.mhmd.studio` / Next.js + React + Supabase + Vercel)

---

## 1. Confirmed v1.x Limitations & Audit Findings

1. **Prototype Persistence Only:** `StudioWorkspaceShell.tsx` saved new/duplicated draft rooms only to browser `localStorage` under key `aiteacherlab_studio_draft_rooms_v1`. Clearing storage or switching devices lost drafted rooms.
2. **Static Presentation Tab:** `/studio` Presentation tab rendered a read-only section list from hard-coded `SLIDES` (`src/content/slides.ts`) without slide CRUD, canvas editing, component insertion, or AI generation.
3. **Broken Slide Print/PDF Export:** Global `src/app/globals.css` forced `@page { size: A4; margin: 14mm; }` and only hid `.no-print`, causing Chrome print on `/presenter` to clip 16:9 slides across A4 portrait pages with dark application margins.
4. **Proposals Were Not Migrations:** `docs/STUDIO_MIGRATION_PROPOSAL.md` and `docs/STUDIO_MULTI_ROOM_ARCHITECTURE.md` lacked `room_decks` / `deck_revisions` / `custom_components` separation (`Room -> Deck -> Frozen Session Snapshot -> Participants/Responses`) and lacked conflict detection or storage cleanup rules.

---

## 2. Core User Flows & Non-Negotiable Constraints

1. **Simultaneous Bilingual FR (LTR) + AR (RTL):** Every editor panel, toolbar, property inspector, slide component, AI prompt wizard, print sheet, and participant widget displays French and Arabic simultaneously without any language toggle.
2. **100% Mediouna Continuity:** Existing `/`, `/presenter`, `/screen`, `/join` (without query parameters) and Production database rows (`mediouna-ai-teacher-lab`, 8 activities, 5 real participants, 18 demo participants, 314 responses) remain untouched and fully functional.
3. **Domain Model Hierarchy:**
   - **Room (`workshops`):** Persistent container owning title (FR+AR), template, PIN policy, resources, decks, and sessions.
   - **Deck (`room_decks`):** Versioned declarative `DeckDocumentV1` JSON (`1920 × 1080` logical canvas) belonging to a Room, backed by named & auto-saved `deck_revisions`.
   - **Session (`room_sessions`):** One live execution of a Room + pinned Deck snapshot (`deckSnapshot`), isolating `participants`, `responses`, `active_slide_id`, `activity_status`, and aggregates across cohorts.
4. **8 Content Creation / Import Entry Paths:** Blank deck, Pedagogical template, Duplicate existing deck, Import canonical 21-slide Mediouna deck, Generate with AI (staged outline -> deck), Import native Studio JSON, Author HTML/CSS/JS custom component, Import Markdown outline.
5. **Dual Export:** 16:9 full-bleed 1-slide-per-page Presentation PDF + independent A4 classroom worksheets & 2-up/4-up handouts.

---

## 3. Low-Fidelity UI Wireframes (All 8 Studio Views)

### 3.1 Studio Home & Room Overview (`/studio`)
```text
+------------------------------------------------------------------------+
| [<-] [Logo] AI Teacher Lab · Studio       [+ Nouvelle salle] [Sign In] |
+----------------------+-------------------------------------------------+
| MES SALLES (N)       | SALLES & ATELIERS — Room Title (FR / AR)        |
| > [LIVE] Mediouna #1 | [Dupliquer] [Nouvelle présentation] [Présenter] |
|   [READY] Maths 4AEP | [Vue] [Présentations] [Ressources] [Sessions]   |
|                      +-------------------------------------------------+
| MODÈLES RAPIDES (5)  | DECKS IN THIS ROOM                              |
| - Atelier Bilingue   | - Atelier Mediouna (21 diapos · Rev 3) [Éditer] |
| - Briefing 16:9      |   [Présenter Live] [PDF 16:9] [Fiches A4]       |
| - Quiz Arena         | - [+ Vierge] [+ Importer Mediouna] [+ IA] [+ MD] |
+----------------------+-------------------------------------------------+
```

### 3.2 Visual Presentation Editor (`/studio/rooms/[roomId]/decks/[deckId]/edit`)
```text
+------------------------------------------------------------------------------+
| [<-Studio] [Title FR/AR inline] [SaveStatus] [Undo][Redo] [+Slide][Code][AI] |
|                                          [PDF 16:9][A4][Aperçu][Présenter >] |
+----------------+---------------------------------------+---------------------+
| LEFT PANEL     | CENTER STAGE (1920 x 1080 Fixed 16:9) | RIGHT INSPECTOR     |
| [Diapos|Comp|  |   +-------------------------------+   | When Slide Active:  |
| Calques|Mise]  |   | [Grid][Snap][Zoom:Fit/75/100%]|   | - Section & Layout  |
|                |   |                               |   | - Background Color  |
| 1. Intro [v][x]|   |   [ Heading Element ]         |   | - Transition & Cue  |
| 2. Poll  [v][x]|   |   [ Interactive Poll/Widget ] |   | - Notes FR / AR /   |
| 3. Quiz  [v][x]|   |   (Drag, 8x Resize, Rotate)   |   |   Darija (Private)  |
|                |   +-------------------------------+   | When Elem Active:   |
|                | [Align L/C/R] [Dup] [Lock] [Layer]    | - FR/AR Copy, Font, |
| [+ Ajouter]    | [X/Y/W/H px coordinates]              |   Color, Component  |
+----------------+---------------------------------------+---------------------+
```

### 3.3 Component Library, AI Wizard, Code Studio & Print Preview Modals
```text
[Component Library]      [AI Generation Wizard]        [Code Studio Sandbox]       [Export Preview /export/slides]
Search FR/AR             Step 1: Brief (Grade 1-6AEP,  Tabs: [HTML][CSS][JS]       Mode: [PDF 16:9][2/p A4][4/p A4][Fiche A4]
- Général (13)             Subject, Slides<=20, Opts)  Security Banner:            Toggle: [x] Afficher QR [x] Notes
- Interactif Live (12)   Step 2: Editable Outline      CSP + sandbox="allow-scripts" -> Exact CSS @page preview frames
- Primaire 1-6AEP (9)    Step 3: Generate Deck + Cost  [Aperçu Sandbox] [Approuver]   -> [Imprimer / Enregistrer en PDF]
- Code HTML/JS (1)       [Accepter] [Annuler] [Regén]  [Insérer dans la diapo]
```

---

## 4. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Accidentally altering live Mediouna workshop | Default `/presenter`, `/screen`, `/join` routes keep legacy snapshot path intact unless `?sessionId=<id>` is explicitly passed; SQL migration is additive-only and NOT run on Production. |
| Concurrent edit overwrite | Versioned `expectedRevision` optimistic concurrency returns HTTP `409` with side-by-side reload/overwrite choice + local draft cache. |
| XSS via HTML/CSS/JS component | Rendered strictly inside `<iframe sandbox="allow-scripts" referrerPolicy="no-referrer">` WITHOUT `allow-same-origin`, CSP `connect-src 'none'`, explicit user approval gate. |
| Browser print clipping slides | Dedicated `/export/slides` route dynamically injects exact `@page { size: 20in 11.25in; margin: 0; }` for 16:9 PDF, independent from `@page { size: A4; }` handouts. |
