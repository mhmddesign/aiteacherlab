# Architecture Technique & Sécurité

## 1. Vue d'ensemble

L'application repose sur **Next.js App Router** avec séparation stricte entre :
- Les **Route Handlers serveur** (`/api/participant/*`, `/api/presenter/*`, `/api/workshop/state`, `/api/realtime/token`, `/api/gallery/*`) qui détiennent seuls l'accès privilégié à PostgreSQL (`SUPABASE_SECRET_KEY`, jamais exposé au navigateur).
- Les **3 interfaces clientes** (`/join`, `/screen`, `/presenter`) qui reçoivent uniquement des états assainis et des agrégats statistiques.

## 2. Séparation des accès et authentification

- **Participants (`/join`) :** Saisie du `WORKSHOP_PIN` partagé + nom affiché (`2–40` caractères). Vérification en temps constant côté serveur (`crypto.timingSafeEqual`), création d'une ligne dans `participants` avec empreinte SHA-256 unique et émission d'un cookie `HttpOnly`, `Secure` (prod), `SameSite=Lax` signé via `jose` (`ai_lab_participant_session`).
- **Animateur (`/presenter`) :** Authentification par un secret distinct (`FACILITATOR_PASSCODE`) émettant le cookie `ai_lab_presenter_session`. Connaître le PIN participant ne permet jamais d'appeler `/api/presenter/*` ni d'obtenir le canal Realtime privé `presenter`.
- **Projecteur (`/screen`) :** Lecture seule d'état assaini (`/api/workshop/state`), zéro contrôle animateur, zéro nom individuel de participant.

## 3. Synchronisation temps réel & repli hors-connexion

1. **Canaux privés Supabase Realtime :**
   - `workshop:<id>:public` (`private: true`) : diffuse uniquement des signaux de changement d'état/agrégats.
   - `workshop:<id>:presenter` (`private: true`) : réservé à la console animateur via RLS sur `realtime.messages` + `public.realtime_channel_grants`.
   - Les diffusions serveur utilisent `channel.httpSend()` côté serveur (REST, sans fuite de connexions WebSocket sur Vercel).
2. **Repli adaptatif (Polling fallback) :** Si WebSocket/Realtime est indisponible sur le réseau de la salle, `useWorkshopSync` bascule automatiquement vers un rafraîchissement HTTP toutes les `2,5 s` avec indicateur visuel (`Temps réel` / `Synchro HTTP` / `Reconnexion`).
3. **Mode Démo vs Session Réelle :** Isolation stricte par colonne `is_demo` et bascule `workshop_state.demo_mode`. Aucune donnée simulée n'est jamais injectée en Session Réelle.
