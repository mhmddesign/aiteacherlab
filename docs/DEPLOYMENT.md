# Guide de Déploiement (Supabase + Vercel Preview & Production)

## 1. Configuration Supabase

1. Créez un projet Supabase dédié pour `teacher-workshop-live` (séparé de tout autre projet).
2. Ouvrez l'**SQL Editor** de Supabase et exécutez dans l'ordre :
   - `supabase/migrations/202611240001_initial_schema.sql`
   - `supabase/migrations/202611240002_seed_workshop_and_demo.sql`
3. Vérifiez dans **Authentication / API Keys** :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (ou `ANON_KEY`)
   - `SUPABASE_SECRET_KEY` (ou `SERVICE_ROLE_KEY`, **strictement serveur**)

## 2. Variables d'environnement (`.env.local` & Vercel Project Settings)

Configurez ces variables dans `.env.local` en local et dans **Vercel → Project Settings → Environment Variables** (séparément pour *Preview* et *Production* ; ne commitez jamais `.env.local`) :

| Variable | Portée | Rôle |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Serveur | URL de votre projet Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client & Serveur | Clé publique (liée à RLS) |
| `SUPABASE_SECRET_KEY` | **Serveur uniquement** | Clé secrète admin pour les Route Handlers |
| `SESSION_SECRET` | **Serveur uniquement** | Chaîne aléatoire (32+ caractères) pour signer les cookies `HttpOnly` |
| `WORKSHOP_PIN` | **Serveur uniquement** | Code PIN partagé avec les collègues sur `/join` |
| `FACILITATOR_PASSCODE` | **Serveur uniquement** | Mot de passe privé de l'animateur sur `/presenter` |
| `NEXT_PUBLIC_APP_URL` | Client & Serveur | URL publique de déploiement pour le QR code |
| `WORKSHOP_SLUG` | Serveur | `mediouna-ai-teacher-lab` |

## 3. Vérification Supabase avant atelier

```bash
node --env-file=.env.local scripts/verify-supabase.mjs
```

## 4. Déploiement Preview puis Production sur Vercel

1. Confirmez d'abord le dépôt GitHub cible (`teacher-workshop-live`) puis poussez la branche `main`.
2. Connectez le dépôt dans Vercel et déployez d'abord un environnement **Preview**.
3. Testez `/presenter`, `/screen` et `/join` sur mobile (QR code + PIN + sondage + Mode Démo).
4. Après validation, promouvez vers **Production**.

## 5. Nettoyage des données après l'atelier

Depuis `/presenter` → **Tableau de bord** → **Supprimer les données des participants** (taper `SUPPRIMER`), toutes les lignes réelles (`is_demo = false`) de `participants`, `responses` et `gallery_contributions` sont effacées proprement tout en conservant l'atelier prêt pour une prochaine session.
