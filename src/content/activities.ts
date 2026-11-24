import type { ActivityDefinition } from "./types";

export const ACTIVITIES: Record<string, ActivityDefinition> = {
  "poll-needs": {
    key: "poll-needs",
    sectionNumber: 2,
    type: "poll",
    title: "Votre défi prioritaire au quotidien",
    instruction:
      "Chers collègues, quel aspect de votre pratique au primaire vous demande aujourd'hui le plus de temps ou d'énergie ?",
    options: [
      {
        id: "prep",
        label: "Préparation des cours",
        shortLabel: "Préparation",
        description: "Fiches de séance, textes supports, progression.",
      },
      {
        id: "diff",
        label: "Différenciation pédagogique",
        shortLabel: "Différenciation",
        description: "Adapter les exercices aux différents rythmes des élèves.",
      },
      {
        id: "eval",
        label: "Évaluation des élèves",
        shortLabel: "Évaluation",
        description: "Diagnostics rapides, repérage des difficultés.",
      },
      {
        id: "corr",
        label: "Correction des exercices",
        shortLabel: "Correction",
        description: "Retours constructifs sur les cahiers et devoirs.",
      },
      {
        id: "admin",
        label: "Gestion administrative",
        shortLabel: "Administratif",
        description: "Comptes rendus, grilles, notes aux parents.",
      },
      {
        id: "interactive",
        label: "Création d'activités interactives",
        shortLabel: "Activités",
        description: "Jeux, quiz projetables, manipulations visuelles.",
      },
    ],
  },

  "quiz-genai": {
    key: "quiz-genai",
    sectionNumber: 3,
    type: "mcq_quiz",
    title: "Vérifions nos repères sur l'IA générative",
    instruction:
      "5 questions rapides pour consolider ensemble les notions clés avant de passer aux cas pratiques.",
    questions: [
      {
        id: "q1",
        prompt: "Comment fonctionne principalement un Grand Modèle de Langage (LLM) ?",
        darijaHint: "كيفاش كيخدم النموذج اللغوي الكبير؟",
        options: [
          { id: "a", label: "Il consulte une base de manuels scolaires marocains figés" },
          { id: "b", label: "Il prédit les mots les plus probables selon le contexte du prompt" },
          { id: "c", label: "Il comprend le monde humainement avec une conscience propre" },
        ],
        correctOptionId: "b",
        explanation:
          "Un LLM génère du texte mot après mot (tokens) par calcul de probabilité à partir de son entraînement. Il ne « comprend » pas comme un enseignant et ne vérifie pas automatiquement la vérité.",
      },
      {
        id: "q2",
        prompt: "Qu'appelle-t-on une « hallucination » en IA générative ?",
        darijaHint: "شنو كنعنيو بـ Hallucination؟",
        options: [
          { id: "a", label: "Une panne d'écran du vidéoprojecteur" },
          { id: "b", label: "Un refus de répondre pour raison de sécurité" },
          { id: "c", label: "Une réponse fausse ou inventée formulée avec beaucoup d'assurance" },
        ],
        correctOptionId: "c",
        explanation:
          "L'IA peut inventer une date, une règle ou une référence officielle de façon très convaincante. La relecture professionnelle de l'enseignant reste indispensable.",
      },
      {
        id: "q3",
        prompt: "Quel élément améliore le plus la pertinence d'une réponse pour une classe de 4AEP ?",
        options: [
          { id: "a", label: "Écrire un mot-clé très court sans préciser le niveau" },
          { id: "b", label: "Préciser le niveau, l'objectif, les contraintes et le format attendu" },
          { id: "c", label: "Ajouter trois points d'exclamation à la fin de la demande" },
        ],
        correctOptionId: "b",
        explanation:
          "Plus le contexte pédagogique (1AEP–6AEP, objectif précis, niveau réel des élèves, format) est explicite dans le prompt, plus le brouillon produit est exploitable.",
      },
      {
        id: "q4",
        prompt: "Quelle est la bonne posture face à un exercice produit par l'IA ?",
        options: [
          { id: "a", label: "Le considérer comme un brouillon de travail à relire, adapter et valider" },
          { id: "b", label: "L'imprimer directement sans lecture préalable pour gagner du temps" },
          { id: "c", label: "Considérer qu'il est automatiquement conforme au programme officiel" },
        ],
        correctOptionId: "a",
        explanation:
          "L'IA fournit une première ébauche rapide. C'est votre expertise didactique et votre connaissance de vos élèves de Mediouna qui valident et ajustent le support.",
      },
      {
        id: "q5",
        prompt: "Quelle différence distingue un simple texte généré d'une « application pédagogique » ?",
        options: [
          { id: "a", label: "Aucune, les deux s'affichent uniquement dans ChatGPT" },
          { id: "b", label: "Une application exige obligatoirement un compte payant pour chaque élève" },
          { id: "c", label: "Une application offre une interaction directe (boutons, feedback, score, manipulation)" },
        ],
        correctOptionId: "c",
        explanation:
          "Avec HTML, CSS et JavaScript générés par l'IA, on passe d'un texte statique à un petit outil interactif utilisable au projecteur ou sur tablette, même hors ligne.",
      },
    ],
  },

  "quiz-responsible": {
    key: "quiz-responsible",
    sectionNumber: 5,
    type: "tf_quiz",
    title: "Vrai ou Faux : Usage responsable au primaire",
    instruction:
      "Pour chaque situation réaliste en école primaire, indiquez si la pratique est juste ou risquée.",
    questions: [
      {
        id: "tf1",
        prompt:
          "On peut saisir les noms complets et résultats nominatifs des élèves dans un outil d'IA public pour générer leurs bulletins.",
        options: [
          { id: "true", label: "Vrai" },
          { id: "false", label: "Faux" },
        ],
        correctOptionId: "false",
        explanation:
          "Faux : il ne faut jamais saisir de données personnelles d'élèves (noms, codes Massar, photos, situations familiales) dans des outils publics. Travaillez toujours avec des profils anonymisés (Élève A, Niveau 1).",
      },
      {
        id: "tf2",
        prompt:
          "Avant de projeter un texte historique ou scientifique généré par l'IA en 5AEP ou 6AEP, l'enseignant doit en vérifier chaque fait et chiffre.",
        options: [
          { id: "true", label: "Vrai" },
          { id: "false", label: "Faux" },
        ],
        correctOptionId: "true",
        explanation:
          "Vrai : en raison des hallucinations possibles, la vérification factuelle et la vérification du niveau lexical relèvent de la responsabilité de l'enseignant.",
      },
      {
        id: "tf3",
        prompt:
          "Si l'IA affirme qu'une fiche respecte « le programme marocain officiel », on peut lui faire confiance sans consulter son manuel ou ses références.",
        options: [
          { id: "true", label: "Vrai" },
          { id: "false", label: "Faux" },
        ],
        correctOptionId: "false",
        explanation:
          "Faux : l'IA peut inventer ou confondre des programmes de différents pays. L'enseignant doit toujours fournir lui-même l'objectif, la compétence ou l'extrait du manuel.",
      },
      {
        id: "tf4",
        prompt:
          "Plus une application éducative demande de comptes élèves et de vidéos lourdes, plus elle est efficace dans nos classes à Mediouna.",
        options: [
          { id: "true", label: "Vrai" },
          { id: "false", label: "Faux" },
        ],
        correctOptionId: "false",
        explanation:
          "Faux : dans un contexte d'équipement variable et de connexion parfois instable, un outil léger, sans compte élève, utilisable au projecteur ou imprimable est bien plus fiable.",
      },
      {
        id: "tf5",
        prompt:
          "L'IA peut proposer 3 niveaux d'exercices pour soutenir l'hétérogénéité de la classe, mais c'est l'enseignant qui choisit la pertinence pédagogique.",
        options: [
          { id: "true", label: "Vrai" },
          { id: "false", label: "Faux" },
        ],
        correctOptionId: "true",
        explanation:
          "Vrai : l'IA accélère la préparation différenciée (par exemple selon une logique d'adaptation au niveau réel des élèves), mais le jugement pédagogique reste humain.",
      },
    ],
  },

  "builder-prompt": {
    key: "builder-prompt",
    sectionNumber: 6,
    type: "prompt_builder",
    title: "Prompt Builder · Contexte Primaire Marocain",
    instruction:
      "Renseignez les éléments pédagogiques de votre classe (1AEP–6AEP) pour assembler un prompt structuré prêt à copier.",
  },

  "exercise-metaprompt": {
    key: "exercise-metaprompt",
    sectionNumber: 7,
    type: "meta_prompt",
    title: "Exercice pratique : Méta-Prompt FR / AR",
    instruction:
      "Partez d'une idée brute de votre classe et générez un méta-prompt qui pousse l'IA à vous poser les bonnes questions avant de produire.",
  },

  "vote-project": {
    key: "vote-project",
    sectionNumber: 10,
    type: "project_vote",
    title: "Quel projet d'application vous parle le plus ?",
    instruction:
      "Votez pour le prototype de groupe que vous aimeriez tester en priorité dans votre classe.",
    options: [
      {
        id: "group1",
        label: "Groupe 1 · Lecture & Compréhension (FR/AR)",
        shortLabel: "G1 Lecture",
        description: "Texte court + 5 questions + correction & feedback.",
      },
      {
        id: "group2",
        label: "Groupe 2 · Mathématiques Interactives",
        shortLabel: "G2 Maths",
        description: "Décomposition, valeur positionnelle et calculs visuels.",
      },
      {
        id: "group3",
        label: "Groupe 3 · Remédiation 3 Parcours (TaRL)",
        shortLabel: "G3 Remédiation",
        description: "Base, Intermédiaire, Défi avec difficulté pilotée.",
      },
      {
        id: "group4",
        label: "Groupe 4 · Évaluation Formative & Imprimable",
        shortLabel: "G4 Évaluation",
        description: "5 questions + erreurs fréquentes + résumé imprimable.",
      },
    ],
  },

  "vote-showcase": {
    key: "vote-showcase",
    sectionNumber: 11,
    type: "showcase_vote",
    title: "Votes Showcase des 4 Groupes",
    instruction:
      "Après chaque présentation de groupe, attribuez vos coups de cœur dans les 3 catégories (votes agrégés et anonymisés).",
    options: [
      { id: "group1", label: "Groupe 1 · Lecture & Compréhension", shortLabel: "Groupe 1" },
      { id: "group2", label: "Groupe 2 · Maths Interactives", shortLabel: "Groupe 2" },
      { id: "group3", label: "Groupe 3 · Remédiation 3 Parcours", shortLabel: "Groupe 3" },
      { id: "group4", label: "Groupe 4 · Évaluation Formative", shortLabel: "Groupe 4" },
    ],
    categories: [
      {
        id: "most_useful",
        label: "Application la plus utile en classe",
        description: "Répond immédiatement à un besoin concret du primaire à Mediouna.",
      },
      {
        id: "best_pedagogy",
        label: "Meilleure idée pédagogique",
        description: "Clarté de l'objectif, progressivité et attention portée aux élèves.",
      },
      {
        id: "most_creative",
        label: "Solution la plus créative",
        description: "Ingéniosité dans l'interaction, le bilinguisme ou l'adaptation hors ligne.",
      },
    ],
  },

  "exit-ticket": {
    key: "exit-ticket",
    sectionNumber: 12,
    type: "exit_ticket",
    title: "Ticket de sortie · Engagement de la semaine",
    instruction:
      "Quelle est une chose concrète que vous allez essayer avec l'IA dans votre classe cette semaine ?",
    options: [
      { id: "prep", label: "Préparer une fiche ou un texte support", shortLabel: "Préparation" },
      { id: "diff", label: "Créer 3 niveaux d'exercices / remédiation", shortLabel: "Différenciation" },
      { id: "meta", label: "Utiliser le Méta-Prompt (FR ou AR)", shortLabel: "Méta-Prompt" },
      { id: "eval", label: "Concevoir une évaluation formative / fiche imprimable", shortLabel: "Évaluation" },
      { id: "app", label: "Prototyper et tester une mini-app en classe", shortLabel: "Mini-App" },
    ],
  },
};

export function getActivityByKey(key: string | null | undefined): ActivityDefinition | null {
  if (!key) return null;
  return ACTIVITIES[key] ?? null;
}
