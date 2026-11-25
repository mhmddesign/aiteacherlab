# Phase 1 Context — Decisions & Scope

## Authoritative Product Decisions
1. **Presentation-First Facilitator Workspace (`/presenter`):**
   - The active slide stage dominates the desktop/laptop viewport (`1440×900`, `1366×768`).
   - Minimal top bar (workshop title, slide counter, connection status, compact timer, `/screen` launcher, fullscreen, plus drawer toggles for **Plan / الفهرس**, **Notes / ملاحظات**, and **Outils / أدوات**).
   - Outline drawer (`Plan`) and secondary Admin/Dashboard panel (`Outils`) are **hidden by default** so slides never compete with a heavy sidebar or SaaS dashboard.
   - Discreet `Précédent` and prominent `Suivant` controls + contextual activity controls + complete keyboard shortcuts (`ArrowLeft`, `ArrowRight`, `Space`, `PageUp`, `PageDown`, `Home`, `End`, `O`, `N`, `F`, `P`, `Q`, `R`), suppressed inside editable fields.
2. **Clean Separation of Concerns:**
   - `/`: Minimal keynote gateway (`Ouvrir la présentation / فتح العرض`, `Rejoindre l'atelier / الانضمام إلى الورشة`, discreet `/screen` link).
   - `/presenter`: Facilitator presentation & controls.
   - `/screen`: Clean projector canvas (`1920×1080`) with zero admin clutter.
   - `/join`: Responsive mobile participant view (`390×844`) with instant local selection feedback.
3. **Instant Optimistic Synchronization & Critical Paths:**
   - Presenter slide navigation & participant answer selection reflect locally on the next browser frame (`<100ms`), never waiting on Supabase or Realtime broadcasts.
   - Rapid presenter navigation uses an ordered coalescing queue + monotonic `stateVersion` reconciliation.
   - API routes offload `broadcastWorkshopEvent` into Next.js `after()`.
4. **Preserve:** 12 sections, 21 slides, simultaneous French LTR + Arabic RTL (no toggle), Supabase schema & data, PINs, and server-side security.
