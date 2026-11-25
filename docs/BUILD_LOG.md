# Build Log & Verification Evidence — AI Teacher Lab (Mediouna)

## Milestones réalisés

1. **Architecture & Configuration (`Next.js 16.4.6` App Router, TypeScript, Tailwind CSS v4) :**
   - Palette éditoriale Navy (`#0B1426`) / Warm Ivory (`#F8F6F1`) / Teal (`#0D9488`) / Cyan (`#06B6D4`) / Amber (`#D97706`).
   - Polices : `Fraunces`, `Plus Jakarta Sans`, `IBM Plex Sans Arabic` (RTL), `JetBrains Mono`.
   - Feuille d'impression `@media print` (`.print-sheet`, `.no-print`) pour fiches A4 et bilans d'évaluation formative.
2. **Base de données Supabase & Sécurité (`supabase/migrations/`) :**
   - Tables `workshops`, `workshop_state`, `activities`, `participants`, `responses`, `gallery_contributions`, `rate_limits`, `realtime_channel_grants`.
   - RLS activé par défaut (*default-deny*) sur toutes les tables `public.*`, politique `SELECT` privée sur `realtime.messages` via `realtime_channel_grants`, fonction atomique `check_rate_limit`, contrainte anti-doublon `UNIQUE (activity_id, participant_id, item_key)`.
   - Jeu de données **Mode Démo** isolé (`is_demo = true`) avec 18 profils de collègues simulés et 3 fiches Galerie de démonstration.
3. **Contenu Pédagogique & Contexte Mediouna (`src/content/`) :**
   - 12 sections (120 minutes, 21 diapositives) en français avec notes en darija marocaine (`dir="rtl"` en caractères arabes) et glossaire technique en anglais.
   - Ton collégial entre pairs du primaire public marocain (1AEP–6AEP), distinction explicite entre l'outil adulte d'atelier et les mini-apps élèves, mention « Brouillon IA à valider » sans inventer de standards officiels non fournis.
   - Galerie de 12 catégories avec 7+ démonstrateurs interactifs fonctionnels hors ligne / imprimables et 4 projets de groupe guidés (25 min) personnalisables avec prompts FR/AR et checklists.
4. **Interfaces & Temps Réel (`src/app/`, `src/components/`, `src/lib/`) :**
   - `/join` (mobile-first), `/screen` (projecteur grand format), `/presenter` (protégé, raccourcis clavier, script complet, minuteur 120 min, Mode Démo, purge post-atelier).
   - Canaux privés Supabase Realtime + repli adaptatif HTTP polling (`2,5 s`).

## Résultats des vérifications exécutées

| Vérification | Commande | Résultat observé |
| :--- | :--- | :--- |
| TypeScript strict | `npx.cmd tsc --noEmit` | **Succès** (0 erreur) |
| ESLint | `npm.cmd run lint` (`eslint src`) | **Succès** (0 erreur, 0 avertissement) |
| Build de production | `npm.cmd run build` | **Succès** (`Next.js 16.4.6`, 18/18 routes compilées) |
| Suite sécurité & API | `node scripts/verify-api.mjs http://localhost:3000` | **Succès** : blocage non authentifié (`401`), PIN invalide (`401`), isolation participant/animateur (`401`/`403`), soumission + anti-doublon (`409`), zéro PII dans `/api/workshop/state`, activité fermée bloquée (`409`), correction quiz côté serveur, refus galerie sans déclaration confidentialité (`400`), réinitialisation, purge (`SUPPRIMER`), rate-limit (`429`). |
| Test navigateur 4 contextes | `node scripts/verify-e2e.mjs http://localhost:3000` | **Succès** (0 `pageerror`) : synchronisation en direct entre `/presenter` (`1440×900`), `/screen` (`1440×900`) et 2 sessions mobiles `/join` (`390×844`) de la Section 1 à la Section 12, incluant RTL arabe, mini-app galerie, contribution Galerie Provinciale, Mode Démo (`18` participants) et purge finale. |

## Extension Bilingue Simultanée (Français + Arabe)

- **Affichage simultané sans sélecteur de langue (`src/components/ui/Bilingual.tsx`, `src/content/types.ts`) :** introduction du type `BilingualText` (`{ fr, ar }`) et des composants `BilingualBlock`, `BilingualPair`, `BilingualInline` et `BilingualSplit`. Chaque élément de l'interface affiche simultanément sa version française (`dir="ltr" lang="fr"`) et sa version arabe (`dir="rtl" lang="ar"` avec `IBM Plex Sans Arabic`).
- **Couverture complète :**
  - Les 12 sections, 21 diapositives et notes complètes de l'animateur ([slides.ts](file:///c:/Users/MHMD/Documents/Presentation/teacher-workshop-live/src/content/slides.ts)).
  - Les 8 activités synchronisées, sondages, QCM, Vrai/Faux, votes et billets de sortie ([activities.ts](file:///c:/Users/MHMD/Documents/Presentation/teacher-workshop-live/src/content/activities.ts)).
  - Les 8 cas d'usage `1AEP–6AEP`, comparatif faible/fort, exemples de méta-prompting et texte/quiz de démonstration ([use-cases.ts](file:///c:/Users/MHMD/Documents/Presentation/teacher-workshop-live/src/content/use-cases.ts)).
  - Les 12 catégories de la galerie, 7+ mini-apps fonctionnelles et 4 projets de groupe ([gallery.ts](file:///c:/Users/MHMD/Documents/Presentation/teacher-workshop-live/src/content/gallery.ts), [MiniAppsPlayground.tsx](file:///c:/Users/MHMD/Documents/Presentation/teacher-workshop-live/src/components/interactive/MiniAppsPlayground.tsx)).
  - Graphiques Recharts bilingues SVG à 2 lignes (`BilingualYAxisTick` dans [LiveChart.tsx](file:///c:/Users/MHMD/Documents/Presentation/teacher-workshop-live/src/components/ui/LiveChart.tsx)), messages d'erreur API/validation bilingues (`FR / AR`), mode Démo et modales de réinitialisation/purge.
- **Exceptions intentionnelles non traduites :** URLs, identifiants techniques de code (`HTML`, `CSS`, `JavaScript`, `FACILITATOR_PASSCODE`, `API`), code PIN, jeton de confirmation `SUPPRIMER`, ainsi que les noms saisis par les participants et leurs textes libres.
- **Vérification bilingue finale observée (`2026-11-24`) :**
  - `npm.cmd run typecheck` : **Succès** (0 erreur).
  - `npm.cmd run lint` (`eslint src`) : **Succès** (0 erreur).
  - `npm.cmd run build` : **Succès** (`Next.js 16.4.6`, 18/18 routes compilées).
  - `node scripts/verify-api.mjs http://localhost:3000` : **Succès** (`ALL API SECURITY & WORKFLOW ASSERTIONS PASSED!`).
  - `node scripts/verify-e2e.mjs http://localhost:3000` : **Succès** (`ALL BILINGUAL 4-CONTEXT MULTI-SESSION E2E VERIFICATIONS PASSED WITH ZERO PAGE ERRORS!`), vérifiant l'absence de bascule de langue, les blocs `dir="rtl" lang="ar"`, les libellés SVG FR+AR du graphique Recharts, l'affichage projecteur `1920×1080`, zéro débordement horizontal sur mobile `390×844` et l'emprise `.print-sheet` d'impression A4.

> **Note sur la vérification Supabase distante :** le script `scripts/verify-supabase.mjs` est prêt à être exécuté dès que les clés réelles de votre projet Supabase dédié seront ajoutées dans `.env.local` et que les migrations `202611240001` / `202611240002` auront été appliquées.

## Nettoyage Sécurité, Rotation & Préparation GitHub / Vercel Preview (`2026-11-24`)

- **Audit & Rotation locale :**
  - Vérification de `.gitignore` : `.env.local` (via `.env.*` avec exception `!.env.example`) et `.local-data/` restent strictement ignorés et n'ont jamais été suivis dans l'historique Git (`0daab37` et commits précédents propres).
  - Rotation locale cryptographique effectuée dans `.env.local` (sans exposition de valeurs) pour `SESSION_SECRET`, `WORKSHOP_PIN` et `FACILITATOR_PASSCODE`. Les clés Supabase dans `.env.local` restent vides en attente du projet Supabase dédié (séparé de MUTALAA).
  - Suppression complète des anciennes valeurs par défaut/exemples dans `.env.example`, `src/lib/env.ts`, `src/lib/workshop/supabase-store.ts`, `supabase/migrations/202611240002_seed_workshop_and_demo.sql`, `src/components/participant/ParticipantShell.tsx`, `scripts/verify-api.mjs` et `scripts/verify-e2e.mjs`.
  - Ajout d'un garde-fou dans `src/lib/workshop/store.ts` interdisant le basculement sur `localStore` lorsque `VERCEL=1` ou `VERCEL_ENV=production` et ajout de `"engines": { "node": ">=20.9.0 <25.0.0" }` dans `package.json`.
- **Vérification post-durcissement observée :**
  - `npm.cmd run typecheck` : **Succès** (`0` erreur).
  - `npm.cmd run lint` : **Succès** (`0` erreur, `0` avertissement).
  - `npm.cmd run build` : **Succès** (`Next.js 16.4.6`, `18/18` routes compilées).
  - Scan statique des fichiers suivis : `ZERO SECRET LEAKS IN REPO`.
  - `node scripts/verify-api.mjs http://localhost:3000` : **Succès** (`ALL API SECURITY & WORKFLOW ASSERTIONS PASSED!`).
  - `node scripts/verify-e2e.mjs http://localhost:3000` : **Succès** (`ALL BILINGUAL 4-CONTEXT MULTI-SESSION E2E VERIFICATIONS PASSED WITH ZERO PAGE ERRORS!`).
  - `node --env-file=.env.local scripts/verify-supabase.mjs` : **Non exécuté** (clés Supabase absentes de `.env.local`, projet dédié non encore créé/relié).

## Refonte « Présentation d'abord », Interactions Instantanées & Correction Realtime (`2026-11-25`)

- **Diagnostic Supabase & Realtime (`atuqqdjiqkuhykkgosnx`) :**
  - Vérification via MCP Supabase que les privilèges `service_role` (`5224ad5`), les 8 tables publiques et `has_realtime_channel_grant` sont actifs.
  - Cause réelle de l'affichage `Synchro HTTP` identifiée dans `realtime_logs` : `createBrowserClient` (`@supabase/ssr`) imposait un callback `accessToken` lisant `auth.getSession()` (`null`), écrasant `realtime.setAuth()` par la clé `anon` (`Unauthorized: You do not have permissions to read from this Channel topic`).
  - Correctif : client navigateur dédié `createRealtimeBrowserClient(getAccessToken)` (`src/lib/supabase/browser.ts`), cache token + reconnexion exponentielle automatique (`src/lib/realtime/client.ts`) et mot de passe déterministe HMAC dans `src/lib/realtime/server.ts`.
- **Latence critique & SSR (`/presenter`, API) :**
  - Diffusions Realtime déplacées hors chemin critique avec `after()` de `next/server` dans `/api/participant/respond`, `/api/participant/join` et `/api/presenter/control` (retour minimal `{ ok, state }`).
  - `/presenter` SSR n'expose plus `workshopPinHint` avant authentification (`src/app/presenter/page.tsx`).
- **Interface centrée sur la présentation & UI optimiste :**
  - Page d'accueil `/` allégée (2 actions principales + lien `/screen`), `/presenter` recentré sur la diapositive avec tiroirs à la demande (`Plan`, `Notes`, `Tableau de bord`), raccourcis clavier complets (`←`/`→`/`Espace`/`PageUp`/`PageDown`/`Home`/`End`/`O`/`N`/`F`/`P`/`Q`/`R`), file ordonnée de navigation (`currentIdxRef`) et compositions éditoriales (`SlideRenderer.tsx`, `@media (prefers-reduced-motion: reduce)`).
  - Réactions instantanées optimistes + annulation en cas d'erreur avec bouton **Réessayer** sur tous les widgets participants et suppression des rechargements `/api/participant/me` après réponse.
- **Vérifications observées (`fix/presentation-first-instant-interactions`) :**
  - `npm.cmd run typecheck` & `npm.cmd run lint` : **Succès** (`0` erreur).
  - `npm.cmd run build` : **Succès** (`Next.js 16.4.6`, `18/18` routes).
  - `node scripts/verify-api.mjs http://localhost:3000` : **Succès**.
  - `node scripts/verify-e2e.mjs http://localhost:3000` : **Succès** sur `1440×900`, `1366×768`, `1920×1080` et `390×844` — latence locale clic réponse `86 ms`, clic navigation `123 ms`, `PATCH /api/presenter/control` `7–36 ms`, `POST /api/participant/respond` `15–42 ms`, `0` appel `/api/participant/me` supplémentaire pendant le vote, convergence 5× `ArrowRight` et rollback réseau vérifiés.
