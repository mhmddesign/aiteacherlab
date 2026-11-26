# AI Teacher Lab — Design System & Brand Guidelines

> **Version:** 1.1 (Phase 3 Design System Refinement)  
> **Scope:** Unified semantic design tokens, WCAG 2.2 AA contrast verification, typography, spacing, radii, interaction states, motion, bilingual composition, and brand favicon assets across `/`, `/studio`, `/presenter`, `/screen`, and `/join`.

---

## 1. Brand Colour System & Semantic Tokens

All tokens are defined centrally in [globals.css](file:///c:/Users/MHMD/Documents/Presentation/teacher-workshop-live/src/app/globals.css) (`@theme inline` + `:root`) and shared component primitives in [primitives.ts](file:///c:/Users/MHMD/Documents/Presentation/teacher-workshop-live/src/components/ui/primitives.ts).

### Core Palette

| Group | Token | Hex | Role |
|---|---|---|---|
| **Dark Environment** | `navy-950` / `--background` | `#060B16` | Application canvas, projector surround, Studio outer background |
| | `navy-900` / `--surface-inverse` | `#0B1220` | Navigation headers, Studio workspace container, Presenter chrome, dark code blocks |
| | `navy-800` / `--surface-elevated` | `#111C33` | Elevated dark cards, drawers, interactive dark controls |
| | `navy-700` / `--border-subtle-dark` | `#1A2A4A` | Structural borders and hairline dividers on dark surfaces |
| **Light Environment** | `ivory-50` / `--surface` | `#FAF8F4` | 16:9 presentation slide stage, primary light forms (`/join`, login) |
| | `ivory-100` / `--surface-subtle` | `#F4F0E8` | Callout blocks (`DarijaCallout`), inset light panels, table headers |
| | `ivory-200` / `--border-subtle` | `#E9E3D6` | Subtle dividers and borders on warm ivory surfaces |
| | `white` / `--surface-card` | `#FFFFFF` | Interactive widget containers, form fields, chart cards |
| **Brand Teal** | `teal-700` / `--brand-primary` | `#0F766E` | Primary buttons on light surfaces, important teal text on light backgrounds |
| | `teal-600` | `#0D9488` | Large graphical accents, decorative borders, progress bars (never small text with white) |
| | `teal-500` | `#14B8A6` | Progress hairline, active indicators, graphical strokes |
| | `teal-bright` / `--brand-accent` | `#2DD4BF` | Primary CTA fills (with `#0B1220` ink) and highlighted text/focus rings on dark surfaces |
| **Secondary Accent** | `slate-blue` / `--accent-slate` | `#315B85` | Supporting badges, secondary navigation, diagrams |
| **Semantic States** | `--status-success` / `--status-success-bg` | `#166534` / `#DCFCE7` | Saved confirmations, correct quiz answers, active/ready states |
| | `--status-warning` / `--status-warning-bg` | `#92400E` / `#FEF3C7` | Paused workshop, closed activity, Demo Mode notice, PIN hints |
| | `--status-error` / `--status-error-bg` | `#B42318` / `#FEF2F2` | Validation errors, network failures, auth rejections |
| | `--status-info` / `--status-info-bg` | `#1D4ED8` / `#EFF6FF` | Open activity prompt, neutral live information |

### Computed WCAG 2.2 AA Contrast Ratios

| Foreground / Background Pair | Ratio | WCAG 2.2 AA Verdict |
|---|---|---|
| `navy-900` (`#0B1220`) on `ivory-50` (`#FAF8F4`) | **17.65:1** | Pass (Normal & Large) |
| `slate-700` (`#334155`) on `ivory-50` (`#FAF8F4`) | **9.76:1** | Pass (Normal & Large) |
| `teal-700` (`#0F766E`) on `ivory-50` (`#FAF8F4`) | **5.16:1** | Pass (Normal & Large) |
| `white` (`#FFFFFF`) on `teal-700` (`#0F766E`) | **5.47:1** | Pass (Normal & Large) |
| `navy-900` (`#0B1220`) on `teal-bright` (`#2DD4BF`) | **10.06:1** | Pass (Normal & Large) |
| `teal-bright` (`#2DD4BF`) on `navy-900` (`#0B1220`) | **10.06:1** | Pass (Normal & Large) |
| `teal-bright` (`#2DD4BF`) on `navy-950` (`#060B16`) | **10.57:1** | Pass (Normal & Large) |
| `ivory-50` (`#FAF8F4`) on `navy-900` (`#0B1220`) | **17.65:1** | Pass (Normal & Large) |
| `slate-300` (`#CBD5E1`) on `navy-900` (`#0B1220`) | **12.61:1** | Pass (Normal & Large) |
| `slate-blue` (`#315B85`) on `ivory-50` (`#FAF8F4`) | **6.68:1** | Pass (Normal & Large) |
| Success (`#166534` on `#DCFCE7`) | **6.49:1** | Pass (Normal & Large) |
| Warning (`#92400E` on `#FEF3C7`) | **6.37:1** | Pass (Normal & Large) |
| Error (`#B42318` on `#FEF2F2`) | **6.01:1** | Pass (Normal & Large) |
| Info (`#1D4ED8` on `#EFF6FF`) | **6.16:1** | Pass (Normal & Large) |
| Focus ring `teal-bright` on `navy-900` / `teal-700` on `ivory-50` | **10.06:1 / 5.16:1** | Pass (≥ 3:1 UI component) |

> **Explicit Rule:** Never use `white` on `teal-600` (`#0D9488`, `3.74:1`) for normal text or buttons. Use `teal-700` (`5.47:1`) on light surfaces and `teal-bright` with `navy-900` text (`10.06:1`) on dark surfaces.

---

## 2. Typography & Bilingual Composition

- **Fraunces (`--font-display`):** Editorial titles, landing headline, Studio room title, slide display headings.
- **Plus Jakarta Sans (`--font-sans`):** French UI controls, body copy, navigation, form labels (`dir="ltr" lang="fr"`).
- **IBM Plex Sans Arabic (`--font-arabic`):** Arabic headings, body copy, labels, callouts (`dir="rtl" lang="ar"`, `line-height: 1.75`).
- **JetBrains Mono (`--font-mono`):** PINs, URLs, timers, prompt code previews, tabular metrics (`tabular-nums`).

### Bilingual Rendering Rules
1. French and Arabic are **always** displayed simultaneously across every page, card, tab, badge, and control — **never** add a language switcher.
2. Wrap inline mixed-direction pairs with `<bdi dir="ltr" lang="fr">` and `<bdi dir="rtl" lang="ar">` (`BilingualInline`) so numbers, routes (`/studio`, `/screen`), and punctuation never reorder in RTL.
3. On narrow phone screens (`360px–390px`), stack or wrap bilingual labels cleanly rather than shrinking text below `12px` (`16px` minimum on mobile inputs to prevent iOS auto-zoom).

---

## 3. Spacing, Radii & Elevation

- **Spacing Rhythm:** `4px` / `8px` grid (`gap-2` = 8px within groups, `gap-4`/`gap-6` = 16–24px between groups).
- **Restrained Radius Scale:**
  - `8px` (`rounded-lg`): compact toolbar icon buttons, keyboard chips, inline tags.
  - `12px` (`rounded-xl`): primary/secondary buttons, form inputs, list rows, callouts.
  - `16px` (`rounded-2xl`): primary cards, Studio workspace panels, dialogs.
  - `9999px` (`rounded-full`): status pills only.
- **Single-Layer Elevation:** Declare elevation once — either a crisp `1px` border (`border-navy-700` / `border-ivory-200`) **or** a soft offset shadow (`shadow-xl` on modals/slides), never a heavy shadow under a faint border.

---

## 4. Interaction States & Motion

- **Required States:** Every interactive control defines Default, Hover, `:focus-visible` (`2px solid` ring with `2px` offset), Active (`scale(0.975)`), Disabled (`opacity-50 cursor-default`), Loading (`aria-busy` + spinner), Success, and Error (explicit recovery action).
- **Touch Targets:** Minimum `44 × 44px` on mobile controls and form fields.
- **Motion Timing:** `100–150ms` immediate press feedback; `160–220ms` `cubic-bezier(0.16, 1, 0.3, 1)` for stage/tab/drawer/modal entrances (`transform` + `opacity` only).
- **`prefers-reduced-motion`:** Eliminates spatial translation while preserving opacity and state/color confirmation so users still receive clear feedback.

---

## 5. Brand Assets & Favicon

- **Primary Vector Mark:** [icon.svg](file:///c:/Users/MHMD/Documents/Presentation/teacher-workshop-live/src/app/icon.svg) (Navy `#0B1220`/`#060B16` container, Ivory `#FAF8F4` 16:9 stage, open-book classroom horizon, `#2DD4BF → #0F766E` 4-point AI spark, dual FR/AR accent bars).
- **Multi-Size Deliverables:** `src/app/icon.svg` (scalable SVG), `src/app/favicon.ico` (16×16, 32×32, 48×48), `src/app/apple-icon.png` (180×180) — served natively via Next.js App Router file conventions.
