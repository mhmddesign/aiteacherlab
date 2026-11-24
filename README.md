# AI Teacher Lab · Atelier Provincial de Mediouna

Plateforme interactive en direct conçue pour un atelier collaboratif de **2 heures** réunissant environ **20 enseignantes et enseignants du primaire public (1AEP–6AEP)** de la **Province de Mediouna (Région Casablanca-Settat)**, en partenariat avec le **Centre de Digitalisation**.

> *« Ne soyez pas seulement utilisateurs du numérique. Devenez créateurs de solutions pédagogiques. »*

---

## Trois interfaces synchronisées en temps réel

| Route | Rôle | Description |
| :--- | :--- | :--- |
| `/` | Portail d'accueil | Choix rapide de l'interface (Participants, Projection, Animateur). |
| `/join` | **Mode Participant** (mobile-first) | Accès par code PIN partagé + prénom affiché (sans e-mail ni mot de passe). Sondages, quiz, Prompt Builder, Méta-Prompt FR/AR, Galerie, votes de groupes et ticket de sortie. |
| `/screen` | **Mode Projecteur** (salle) | Affichage grand format haute lisibilité, graphiques Recharts en direct, QR code activable, zéro contrôle animateur et zéro donnée personnelle. |
| `/presenter` | **Mode Animateur** (protégé) | Console de pilotage avec code d'accès séparé : navigation clavier/sections, minuteur 120 min, script complet FR/Darija, ouverture/fermeture/révélation/réinitialisation des activités, Mode Démo isolé et suppression des données post-atelier. |

## Stack technique

- **Next.js 16 (App Router)** · **React 19** · **TypeScript** · **Tailwind CSS v4**
- **Supabase PostgreSQL** (RLS strict sur toutes les tables) & **Supabase Realtime** (canaux privés + repli adaptatif HTTP polling)
- **Motion**, **Recharts**, **Lucide React**, **Zod**, **Jose** (cookies `HttpOnly`), **QRCode.react**
- **Déploiement cible :** Vercel · **Zéro dépendance à une API d'IA payante**

## Démarrage rapide en local

```bash
cp .env.example .env.local
npm.cmd install
npm.cmd run dev
```

1. Ouvrez `http://localhost:3000`.
2. Pour `/join`, utilisez le `WORKSHOP_PIN` défini dans `.env.local` (par défaut en dev : `202604`).
3. Pour `/presenter`, utilisez le `FACILITATOR_PASSCODE` défini dans `.env.local` (par défaut en dev : `MEDIOUNA-ADMIN-2026`).

Sans variables Supabase configurées, l'application bascule automatiquement sur un magasin local persistant (`.local-data/workshop-store.json`) pour le développement et les tests, puis utilise **Supabase PostgreSQL + Realtime** dès que `.env.local` ou les variables Vercel sont renseignées.

## Documentation complète

- [Contexte & Cahier des charges (`docs/PROJECT_BRIEF.md`)](docs/PROJECT_BRIEF.md)
- [Architecture technique & sécurité (`docs/ARCHITECTURE.md`)](docs/ARCHITECTURE.md)
- [Schéma de base de données & RLS (`docs/DATABASE_SCHEMA.md`)](docs/DATABASE_SCHEMA.md)
- [Guide de déploiement Supabase & Vercel (`docs/DEPLOYMENT.md`)](docs/DEPLOYMENT.md)
- [Journal de construction & vérifications (`docs/BUILD_LOG.md`)](docs/BUILD_LOG.md)
