# Guide de Déploiement (Supabase dédié + GitHub + Vercel Preview & Production)

> **Important :** ce projet doit utiliser un **projet Supabase dédié**, totalement séparé de MUTALAA ou de tout autre projet existant. N'exécutez jamais les migrations sur une base partagée sans vérification préalable.

---

## 1. Configuration du projet Supabase dédié

1. Créez un nouveau projet Supabase dédié à `teacher-workshop-live` (AI Teacher Lab · Mediouna).
2. Ouvrez le **SQL Editor** dans le tableau de bord Supabase et exécutez dans l'ordre exact :
   1. `supabase/migrations/202611240001_initial_schema.sql`
   2. `supabase/migrations/202611240002_seed_workshop_and_demo.sql`
3. Dans **Project Settings → API Keys**, récupérez :
   - URL du projet (`NEXT_PUBLIC_SUPABASE_URL`)
   - Clé publique (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Clé secrète administrateur (**strictement serveur** : `SUPABASE_SECRET_KEY` ou `SUPABASE_SERVICE_ROLE_KEY`)
4. Vérifiez que **Realtime** est activé sur le projet (canaux privés `workshop:<id>:public` et `workshop:<id>:presenter` protégés par la politique RLS sur `realtime.messages`).

---

## 2. Variables d'environnement requises (`.env.local` & Vercel Project Settings)

Ne commitez **jamais** `.env.local`. En local, utilisez `.env.example` comme référence et conservez vos secrets hors Git. Sur Vercel, configurez ces **8 variables** dans **Project Settings → Environment Variables** (d'abord sur l'environnement **Preview**, puis sur **Production** après validation) :

| Variable | Portée | Obligatoire en déploiement | Rôle |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Serveur | Oui | URL du projet Supabase dédié |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` *(ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`)* | Client & Serveur | Oui | Clé publique navigateur (limitée par RLS *default-deny*) |
| `SUPABASE_SECRET_KEY` *(ou `SUPABASE_SERVICE_ROLE_KEY`)* | **Serveur uniquement** | Oui | Clé administrateur utilisée uniquement dans les Route Handlers et scripts serveur |
| `SESSION_SECRET` | **Serveur uniquement** | Oui | Secret aléatoire (32+ caractères) signant les cookies `HttpOnly` via `jose` |
| `WORKSHOP_PIN` | **Serveur uniquement** | Oui | Code PIN partagé avec les collègues sur `/join` (jamais codé en dur) |
| `FACILITATOR_PASSCODE` | **Serveur uniquement** | Oui | Code d'accès secret de l'animateur sur `/presenter` |
| `NEXT_PUBLIC_APP_URL` | Client & Serveur | Recommandée | URL publique cible utilisée pour le QR code (repli automatique sur `VERCEL_URL` en Preview) |
| `WORKSHOP_SLUG` | Serveur | Oui (`mediouna-ai-teacher-lab`) | Identifiant logique de l'atelier dans `public.workshops` |

> **Protection contre le repli local en production :** dès que `VERCEL=1` ou `VERCEL_ENV=production`, `getWorkshopStore()` désactive le magasin local `.local-data/` et exige la présence des variables Supabase.

---

## 3. Vérification Supabase en ligne avant déploiement

Une fois `.env.local` renseigné avec les clés de votre projet Supabase dédié :

```bash
node --env-file=.env.local scripts/verify-supabase.mjs
```

Ce script confirme que le client anonyme (`ANON` / `PUBLISHABLE`) est bloqué par RLS sur `participants` et `responses`, et que le client serveur (`SECRET` / `SERVICE_ROLE`) retrouve l'atelier et ses 8 activités.

---

## 4. Synchronisation GitHub

1. Créez un dépôt vide sur votre compte ou organisation GitHub (ex. `teacher-workshop-live`).
2. Liez le dépôt local et poussez la branche `main` (sans `--force`) :

```bash
git remote add origin https://github.com/<VOTRE_COMPTE_OU_ORG>/<NOM_DEPOT>.git
git push -u origin main
```

---

## 5. Déploiement Vercel Preview (sans promouvoir en Production)

- **Runtime Node.js :** `>=20.9.0 <25.0.0` (déclaré dans `package.json`).
- **Build command :** `npm run build` (`vercel.json` avec `"framework": "nextjs"`).
- **Procédure Preview :**
  1. Importez le dépôt GitHub dans Vercel.
  2. Configurez les 8 variables d'environnement avec la portée **Preview** (uniquement Preview dans un premier temps).
  3. Lancez un déploiement **Preview** (ou poussez une branche dédiée / Pull Request vers GitHub).
  4. Vérifiez sur l'URL Preview : `/`, `/screen`, `/presenter`, `/join` sur smartphone (QR code, PIN, sondage, quiz, Prompt Builder, Mode Démo).
  5. Ne promouvez en **Production** qu'après validation complète de la Preview.

---

## 6. Nettoyage après atelier

Depuis `/presenter` → **Tableau de bord** → **Supprimer les données des participants** (confirmation exacte `SUPPRIMER`), toutes les lignes réelles (`is_demo = false`) de `participants`, `responses` et `gallery_contributions` sont effacées proprement tout en gardant le Mode Démo intact.
