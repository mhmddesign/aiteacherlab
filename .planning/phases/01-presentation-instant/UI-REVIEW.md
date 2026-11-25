# UI Design Review — Apple Design Principles Applied to Web

Reviewed against `.agents/skills/apple-design/references/hig/`: `layout.md`, `typography.md`, `color.md`, `feedback.md`, `motion.md`, `right-to-left.md`, plus the Design Craft lens.

## Strengths Kept
- High-contrast warm ivory slide stage (`#FAF8F4` / `#F8F6F1`) paired with deep navy outer chrome (`#0B1426` -> `#0B1220`), `Fraunces` editorial display serif, `Plus Jakarta Sans` UI sans, and `IBM Plex Sans Arabic`.
- Strict `dir="rtl" lang="ar"` separation for Arabic script blocks alongside `dir="ltr"` French.

## High-Priority Findings to Address in Phase 1 Redesign
1. **Visual Hierarchy & Focus (`layout.md › Visual hierarchy`, `layout.md › Progressive disclosure`):** `/presenter` previously dedicated ~50% of horizontal width to a permanent left navigation rail + right notes/QR column, leaving only `lg:col-span-6` for the slide itself. Refactoring to a full-bleed center slide stage with on-demand drawers (`Plan`, `Notes`, `Outils`) restores visual priority to the slide.
2. **Anti-Template Craft (`SKILL.md › Lens 3`):** Slides (`welcome`, `vision`, `concepts`, `pillars`, `prompt-anatomy`, `meta-prompt-flow`, `ecosystem`) and `/` currently repeat identical rounded white `rounded-2xl border bg-white` boxes. Replace them with composition-specific editorial structures: open keynote header with hairline metadata, numbered index grid with dividers (`concepts`), typographic rule-topped grid (`pillars`), asymmetrical stark comparison (`prompt-anatomy`), connected horizontal process diagram (`meta-prompt-flow`), and a minimal `/` gateway.
3. **Immediate Interaction Feedback (`feedback.md › Best practices`, `motion.md › Providing feedback`):** `QuizWidget` (`pendingKey`) and `ShowcaseVotingWidget` blocked sibling items and failed to highlight the selected choice immediately before server confirmation. Switch to per-item optimistic selection + checkmark + `Enregistrement... / جاري الحفظ...` -> `Réponse enregistrée / تم حفظ الإجابة`, with clean rollback and retry on network error.
4. **Reduced Motion & Optical Balance (`motion.md`, `right-to-left.md › Controls`):** Honor `prefers-reduced-motion` (`useReducedMotion()` + CSS media query) and keep Arabic typography slightly larger/leading-generous (`line-height: 1.75`) so Arabic headings visually balance Latin uppercase/serif proportions without cramped stacking.
5. **Color Restraint (`color.md › Best practices`):** Reserve accent teal (`#0F766E`) strictly for primary progression (`Suivant`, active slide progress hairline, selected states) and amber (`#D97706`) strictly for pause/demo/warnings, reducing pill and border noise.
