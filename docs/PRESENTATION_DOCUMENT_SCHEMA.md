# Native Presentation Document Schema (`PRESENTATION_DOCUMENT_SCHEMA.md`)

> **Implementation Module:** `src/lib/studio/document-schema.ts`  
> **Format Version:** `STUDIO_DOC_VERSION = 1` (Declarative JSON, Zod-validated, zero functions or JSX stored in DB)

---

## 1. Document Hierarchy

```text
DeckDocumentV1
 ├── schemaVersion: 1
 ├── id: string
 ├── roomId: string
 ├── title: { fr: string, ar: string }
 ├── description: { fr: string, ar: string }
 ├── canvasWidth: 1920
 ├── canvasHeight: 1080
 ├── theme: DeckTheme (palette + font tokens)
 ├── sections: DeckSection[]
 │     ├── id, number, title: { fr, ar }, timeRange: { fr, ar }
 └── slides: DeckSlide[]
       ├── id, order, sectionId, hidden, layout, transition
       ├── background: { color, accentColor? }
       ├── notes: { fr, ar, darijaFr, darijaAr, durationCue, classroomExampleFr, classroomExampleAr, discussionPromptFr, discussionPromptAr }
       ├── legacySource?: { slideId, slideKind, activityKey?, edited }
       └── elements: SlideElement[]
             ├── id, type (ComponentTypeId), name?
             ├── x, y, width, height, rotation, zIndex, visible, locked
             ├── style: { backgroundColor, textColor, borderColor, borderWidth, borderRadius, fontSize, fontWeight, textAlign, padding }
             ├── bilingual?: { fr: string, ar: string }
             └── config: Record<string, unknown> (component-specific declarative config)
```

---

## 2. Backward-Compatible Normalization & Fault Containment

- `parseDeckDocument(input)` runs Zod validation with strict coordinate clamps (`1920 × 1080` logical bounds, finite numbers).
- `normalizeDeckDocument(raw)` upgrades pre-v1 or partially malformed JSON structures without crashing:
  - Unknown `element.type` strings are preserved inside a safe `unknown-element` fallback carrying `{ originalType, rawConfig }` and rendered as an accessible recoverable placeholder in the Editor and Presenter (never throwing an uncaught React error).
- No executable code runs inside the main document; custom HTML/CSS/JS elements store `config: { html, css, js, heightPx, approved }` and execute ONLY inside an isolated `<iframe sandbox="allow-scripts">` when `approved === true`.

---

## 3. Room / Deck / Session Storage Contracts

| Entity | Backing Store (`supabase` when tables present / `.local-data/studio-store.json` local) | Concurrency & Security |
|---|---|---|
| `workshops` (Rooms) | `public.workshops` | Default-deny RLS; facilitator-gated API writes |
| `room_decks` | `public.room_decks` (`document_json`, `revision`) | Optimistic lock `expectedRevision` -> HTTP `409` on stale write |
| `deck_revisions` | `public.deck_revisions` (`label`, `document_json`) | Immutable restore snapshots (`source: 'autosave' \| 'manual' \| 'ai' \| 'restore' \| 'import'`) |
| `room_sessions` | `public.room_sessions` (`deck_snapshot`, `state`, `responses`) | Frozen `deck_snapshot` prevents mid-lesson deck edits from breaking a running cohort |
| `custom_components` | `public.custom_components` (`html`, `css`, `js`, `approved`) | Facilitator-owned reusable snippet library |
