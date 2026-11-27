# UI-SPEC — Phase 3: Design System, Brand Application & Favicon

- **Phase:** 03-design-system
- **Branch:** `feat/studio-platform-stability-ux`
- **Aesthetic Direction:** Hybrid Editorial Educational Studio (academic, clear, structured; deep navy shell + warm ivory content surfaces + brand teal actions + slate-blue secondary accents).

## 1. Surface Modes
| Route | Role | Mode | Primary Background | Primary Action |
|---|---|---|---|---|
| `/` | Gateway | Persuade / Editorial | `navy-950` (`#060B16`) | `bg-ivory-50 text-navy-900` (`/presenter`) + `bg-navy-800 text-ivory-50` (`/join`) |
| `/studio` | Multi-Room Studio | Operate | `navy-950` + `navy-900` workspace | `bg-teal-bright text-navy-900` (`10.06:1`) |
| `/presenter` | Live Console | Operate + 16:9 Stage | `navy-950` + `navy-900` chrome | `bg-teal-bright text-navy-900` (`Suivant · التالي`) |
| `/screen` | Projector | Experience (16:9 Stage) | `navy-950` | Minimal discreet fullscreen toggle only |
| `/join` | Participant Companion | Operate (Mobile-First) | `ivory-50` / `white` cards on `navy-950` | `bg-teal-700 text-white` (`5.47:1`) |

## 2. Hard Contrast Rules (WCAG 2.2 AA)
- **Light surfaces (`ivory-50` / `white`):** Primary buttons & important teal text MUST use `teal-700` (`#0F766E`, `5.16:1` on ivory, `5.47:1` on white). **Ban** `bg-teal-600 text-white` (`3.74:1`) and `text-teal-600` on small text.
- **Dark surfaces (`navy-950` / `navy-900` / `navy-800`):** Highlighted text/accents use `teal-bright` (`#2DD4BF`, `10.06:1` on `navy-900`); primary dark-surface buttons use `bg-teal-bright text-navy-900` (`10.06:1`) or `bg-teal-700 text-white` (`5.47:1`).
- **Semantic states (never color alone — icon + FR/AR label):**
  - Success: `#166534` on `#DCFCE7` (`6.49:1`)
  - Warning: `#92400E` on `#FEF3C7` (`6.37:1`)
  - Error: `#B42318` on `#FEF2F2` (`6.01:1`)
  - Info: `#1D4ED8` on `#EFF6FF` (`6.16:1`)

## 3. Craft & Layout Guardrails
- No multi-stop gradient hero banners or glassmorphism decoration on Studio/Landing.
- No one-sided `border-l-4` bars on rounded boxes (`DarijaCallout` uses full clean border + `ivory-100` fill).
- Single-layer elevation: border OR shadow, never both.
- Restrained radii: `8px` (`rounded-lg`) compact controls, `12px` (`rounded-xl`) buttons/inputs/rows, `16px` (`rounded-2xl`) panels/modals, `rounded-full` pills only.
- Simultaneous FR (`dir="ltr" lang="fr"`) + AR (`dir="rtl" lang="ar"`) on every control, label, and card; `<bdi>` isolation on inline pairs; zero language toggle.
- Favicon assets: `src/app/icon.svg`, `src/app/favicon.ico` (16/32/48), `src/app/apple-icon.png` (180×180), served via Next.js App Router metadata conventions without duplicate `<link>` declarations.
