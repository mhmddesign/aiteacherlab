# Print & PDF Export Design (`PDF_EXPORT_DESIGN.md`)

> **Dedicated Export Route:** `/export/slides` ([page.tsx](file:///c:/Users/MHMD/Documents/Presentation/teacher-workshop-live/src/app/export/slides/page.tsx), [ExportPreviewShell.tsx](file:///c:/Users/MHMD/Documents/Presentation/teacher-workshop-live/src/components/export/ExportPreviewShell.tsx))  
> **Automated PDF Verification:** [verify-pdf-export.mjs](file:///c:/Users/MHMD/Documents/Presentation/teacher-workshop-live/scripts/verify-pdf-export.mjs)

---

## 1. Root Cause of Broken v1 Print Behaviour

`src/app/globals.css` defined a global `@page { size: A4; margin: 14mm; }` rule. Printing `/presenter` caused Chromium to paginate the `100dvh` dark presenter stage onto portrait A4 sheets, clipping the 16:9 canvas and leaking container geometry.

---

## 2. Two Separate Export Pipelines

| Pipeline | Mode Param | CSS `@page` Specification | Layout & Content Rules |
|---|---|---|---|
| **A. Presentation PDF (16:9)** | `mode=slides` (default) | `@page { size: 20in 11.25in; margin: 0; }` (`1920 × 1080px` at 96dpi) | 1 slide per PDF page (`break-after: page`), `print-color-adjust: exact`, complete `1920 × 1080` composition, FR+AR fonts preserved, optional QR card, zero presenter chrome/navigation. |
| **B1. A4 2-Up Landscape Handout** | `mode=handout-2` | `@page { size: A4 landscape; margin: 10mm; }` | 2 crisp 16:9 slide frames + bilingual note-taking lines per A4 landscape page. |
| **B2. A4 4-Up Portrait Handout** | `mode=handout-4` | `@page { size: A4 portrait; margin: 10mm; }` | 2×2 grid of slide thumbnails with slide titles & section headers for teacher binders. |
| **B3. A4 Classroom Worksheet** | `mode=worksheet` | `@page { size: A4 portrait; margin: 12mm; }` | Structured bilingual classroom handout (`1AEP–6AEP`): header, objectives, exercises extracted from interactive deck items (polls, quizzes, flashcards, manipulatives), student writing space, zero-PII footer. |

---

## 3. Print Preview & Automated PDF Assertion Guarantees

- `/export/slides` renders a true WYSIWYG Print Preview before triggering `window.print()`.
- `scripts/verify-pdf-export.mjs` invokes Chromium `page.pdf({ preferCSSPageSize: true, printBackground: true })` and inspects generated PDF bytes:
  1. Mediouna 21-slide 16:9 PDF contains **exact `21` pages**, each with `MediaBox` `1440 × 810 pt` (`16:9` ratio `1.7778`).
  2. A4 worksheet PDF contains exact **A4 portrait `MediaBox` (`~595 × 842 pt`)**.
  3. Zero blank pages, non-empty page streams, zero presenter UI controls included.
