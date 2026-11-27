# AI Presentation Generation & Editing Design (`AI_PRESENTATION_GENERATION_DESIGN.md`)

> **Server Modules:** `src/lib/ai/provider.ts`, `src/app/api/studio/ai/generate/route.ts`, `src/app/api/studio/ai/edit-slide/route.ts`  
> **UI Modules:** `src/components/studio/ai/AiDeckWizardModal.tsx`, `src/components/studio/ai/AiSlideAssistantDrawer.tsx`

---

## 1. Provider Abstraction & AI SDK 6 Integration

- **Installed Packages:** `ai` (v6+) + `@ai-sdk/google` (first configured adapter; provider interface allows adding OpenAI / Anthropic without altering API contracts or UI).
- **Strict AI SDK 6 Pattern:** Uses `generateText` with `output: Output.object({ schema })` + Zod schemas (never deprecated `generateObject` / `streamObject`).
- **Server-Only Credentials & Billing Honesty:**
  - Uses server-side `GOOGLE_GENERATIVE_AI_API_KEY` (never exposed to browser code and never stored in plaintext in Supabase).
  - Documentation & UI explicitly clarify that Google AI Pro consumer subscriptions do **not** include Gemini Developer API quota; a dedicated API key and per-token API billing apply.
  - BYOK (Bring Your Own Key) encrypted vault design is planned post-v2.0 (AES-GCM envelope encryption per workspace owner) and intentionally deferred from unencrypted DB columns.

---

## 2. Two Staged Authoring Workflows

1. **Staged AI Deck Wizard (`POST /api/studio/ai/generate`):**
   - Collects 12 structured brief inputs: presentation purpose, audience, grade level (`1AEP–6AEP`), subject, learning objectives, duration (`min`), target slide count (`3..20` hard cap), FR+AR bilingual emphasis, visual theme, required interactive/primary components, source notes/extracts, and detail depth.
   - **Stage 1 (`stage: "outline"`):** Generates an editable bilingual section + slide outline first; teacher approves, edits, reorders, or removes slides before full content generation.
   - **Stage 2 (`stage: "deck"`):** Generates typed `DeckSlide` items constrained strictly to valid `COMPONENT_REGISTRY` component types, speaker notes (FR/AR/Darija), timing cues, and live poll/quiz configs. Validates output through Zod BEFORE returning to UI; **never** auto-saves an unreviewed deck.
2. **Selected-Slide AI Assistant (`POST /api/studio/ai/edit-slide`):**
   - Takes selected slide + deck title context + teacher command (e.g., `"Simplifier pour la 3AEP"`, `"Ajouter un QCM sur ce contenu"`, `"Convertir en parcours TaRL à 3 niveaux"`).
   - Returns structured slide diff/operations preview (`notes`, `elements[]`, `title`, `explanation`). Teacher inspects preview and clicks **Appliquer à la diapo / تطبيق على الشريحة** or **Ignorer** — never overwrites the whole deck.

---

## 3. Security, Cost, Cancellation & Deterministic Testing
- Facilitator session required (`verifyPresenterSession()`); participant tokens receive `403`.
- Request payload capped (`32 KB` brief), slide count capped (`20` max), abort timeout (`30s`) wired to browser `AbortController` (**Annuler la génération** button).
- Token usage (`inputTokens`, `outputTokens`, `totalTokens`) and estimated cost returned when reported by provider.
- Deterministic test hook (`x-studio-ai-mock`) permitted strictly when `NODE_ENV !== "production"` or `STUDIO_AI_ALLOW_MOCK === "1"` so CI verifies schema rejection, preview-before-save, and cancellation without paid API spend.
