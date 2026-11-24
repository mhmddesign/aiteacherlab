# Schéma de Base de Données & Sécurité RLS

Les migrations se trouvent dans `supabase/migrations/` :
- `202611240001_initial_schema.sql`
- `202611240002_seed_workshop_and_demo.sql`

## Tables principales

1. `public.workshops` : métadonnées de l'atelier et empreinte SHA-256 du code PIN partagé (`join_pin_hash`).
2. `public.workshop_state` : état synchronisé en temps réel (`current_slide_id`, `current_section`, `active_activity_key`, `activity_status`, `show_results`, `show_qr_overlay`, `is_paused`, `demo_mode`, minuteur, `state_version`).
3. `public.activities` : les 8 activités persistées (`poll-needs`, `quiz-genai`, `quiz-responsible`, `builder-prompt`, `exercise-metaprompt`, `vote-project`, `vote-showcase`, `exit-ticket`) avec compteur `reset_generation`.
4. `public.participants` : uniquement `display_name`, `session_token_hash`, `is_demo`, `joined_at`, `last_seen_at` (zéro e-mail, zéro téléphone, zéro donnée élève).
5. `public.responses` : réponses liées à `(activity_id, participant_id, item_key)` avec contrainte d'unicité `UNIQUE (activity_id, participant_id, item_key)` empêchant les doublons. `is_correct` est calculé exclusivement côté serveur.
6. `public.gallery_contributions` : fiches de la Galerie Collaborative Provinciale de Mediouna, imposant `privacy_confirmed = true`.
7. `public.rate_limits` & RPC `public.check_rate_limit(...)` : limitation atomique de débit côté PostgreSQL.
8. `public.realtime_channel_grants` : autorisations par canal privé vérifiées par la politique RLS `SELECT` sur `realtime.messages`.

## Politique Row Level Security (RLS)

- RLS activé sur l'ensemble des tables `public.*` avec révocation des privilèges directs `anon` / `authenticated` (modèle *default-deny*).
- Toutes les écritures, agrégations et suppressions passent par les Route Handlers Next.js via `SUPABASE_SECRET_KEY`.
- Sur `realtime.messages` (où RLS est déjà actif par défaut dans Supabase), une politique `SELECT` vérifie que `auth.uid()` possède un droit explicite pour `realtime.topic()`. Aucune politique `INSERT` client n'est accordée.
