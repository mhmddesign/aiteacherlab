# Architecture Technique & Sécurité

## 1. Vue d'ensemble

L'application repose sur **Next.js App Router** avec séparation stricte entre :
- Les **Route Handlers serveur** (`/api/participant/*`, `/api/presenter/*`, `/api/workshop/state`, `/api/realtime/token`, `/api/gallery/*`) qui détiennent seuls l'accès privilégié à PostgreSQL (`SUPABASE_SECRET_KEY`, jamais exposé au navigateur).
- Les **3 interfaces clientes** (`/join`, `/screen`, `/presenter`) qui reçoivent uniquement des états assainis et des agrégats statistiques.

## 2. Interface bilingue simultanée et séparation des accès

- **Bilinguisme simultané FR/AR (`src/components/ui/Bilingual.tsx`) :** le modèle `BilingualText` (`{ fr, ar }`) rend systématiquement le français (`dir="ltr" lang="fr"`) et l'arabe (`dir="rtl" lang="ar"`, `IBM Plex Sans Arabic`) côte à côte ou empilés sans aucun sélecteur de langue.
- **Participants (`/join`) :** Saisie du `WORKSHOP_PIN` partagé + nom affiché (`2–40` caractères). Vérification stricte et en temps constant contre la variable serveur `WORKSHOP_PIN` (`crypto.timingSafeEqual`), création d'une ligne dans `participants` avec empreinte SHA-256 unique et émission d'un cookie `HttpOnly`, `Secure` (HTTPS/Vercel), `SameSite=Lax` signé via `jose` (`ai_lab_participant_session`).
- **Animateur (`/presenter`) :** Authentification par un secret distinct (`FACILITATOR_PASSCODE`) émettant le cookie `ai_lab_presenter_session`. Connaître le PIN participant ne permet jamais d'appeler `/api/presenter/*` ni d'obtenir le canal Realtime privé `presenter`. Aucun secret ni code PIN n'est codé en dur dans le code applicatif.
- **Projecteur (`/screen`) :** Lecture seule d'état assaini (`/api/workshop/state`), zéro contrôle animateur, zéro nom individuel de participant.
- **Garde-fou Vercel / Production (`src/lib/workshop/store.ts`) :** si `VERCEL=1` ou `VERCEL_ENV=production` et que Supabase n'est pas configuré, le serveur lève une erreur explicite plutôt que d'utiliser le repli local `.local-data/` sur un système de fichiers éphémère.

## 3. Synchronisation temps réel & repli hors-connexion

1. **Canaux privés Supabase Realtime :**
   - `workshop:<id>:public` (`private: true`) : diffuse uniquement des signaux de changement d'état/agrégats.
   - `workshop:<id>:presenter` (`private: true`) : réservé à la console animateur via RLS sur `realtime.messages` + `public.realtime_channel_grants`.
   - Les diffusions serveur utilisent `channel.httpSend()` côté serveur (REST, sans fuite de connexions WebSocket sur Vercel).
2. **Repli adaptatif (Polling fallback) :** Si WebSocket/Realtime est indisponible sur le réseau de la salle, `useWorkshopSync` bascule automatiquement vers un rafraîchissement HTTP toutes les `2,5 s` avec indicateur visuel (`Temps réel` / `Synchro HTTP` / `Reconnexion`).
3. **Mode Démo vs Session Réelle :** Isolation stricte par colonne `is_demo` et bascule `workshop_state.demo_mode`. Aucune donnée simulée n'est jamais injectée en Session Réelle.
