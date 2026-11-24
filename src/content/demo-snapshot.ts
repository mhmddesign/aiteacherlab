import type {
  ActivityAggregate,
  GalleryContributionRecord,
  PresenterSubmissionRow,
} from "./types";
import { ACTIVITIES } from "./activities";

export const DEMO_TEACHER_NAMES = [
  "Khadija B.",
  "Youssef E.",
  "Fatima Z.",
  "Rachid M.",
  "Amina H.",
  "Hassan K.",
  "Nadia S.",
  "Karim T.",
  "Salma R.",
  "Omar L.",
  "Latifa N.",
  "Abdellah C.",
  "Siham A.",
  "Mustapha D.",
  "Hanane F.",
  "Brahim O.",
  "Meryem G.",
  "Tariq J.",
];

export const DEMO_GALLERY_CONTRIBUTIONS: GalleryContributionRecord[] = [
  {
    id: "demo-gal-1",
    contributorName: "Khadija B. (Démo)",
    appTitle: "Lecteur Progressif 4AEP",
    gradeRange: "4AEP",
    discipline: "Français",
    language: "Français (LTR)",
    learningObjective:
      "Lire un court récit du quotidien et répondre à 5 questions de compréhension.",
    description:
      "Mini-application légère projetable en classe avec texte aéré, 5 questions à choix multiples et explications immédiates.",
    classroomInstructions:
      "Projeter le texte 5 minutes, faire voter la classe à main levée puis afficher la correction commentée.",
    appResource: "Prototype intégré · Section 9 (/screen)",
    testedFeatures: ["Mode hors ligne", "Feedback immédiat", "Affichage projecteur"],
    privacyConfirmed: true,
    isDemo: true,
    createdAt: "2026-11-24T10:15:00.000Z",
  },
  {
    id: "demo-gal-2",
    contributorName: "Youssef E. (Démo)",
    appTitle: "Abaque & Décomposition C/D/U",
    gradeRange: "2AEP–4AEP",
    discipline: "Mathématiques",
    language: "Bilingue FR/AR",
    learningObjective:
      "Comprendre la valeur positionnelle (centaines, dizaines, unités) par manipulation visuelle.",
    description:
      "Outil interactif sans connexion permettant de manipuler des barres et carrés sur vidéoprojecteur ou tablette partagée.",
    classroomInstructions:
      "Inviter un élève au tableau pour construire le nombre demandé puis vérifier en collectif.",
    appResource: "Prototype intégré · Galerie Section 10",
    testedFeatures: ["Manipulation visuelle", "3 niveaux progressifs", "Zéro compte élève"],
    privacyConfirmed: true,
    isDemo: true,
    createdAt: "2026-11-24T10:30:00.000Z",
  },
  {
    id: "demo-gal-3",
    contributorName: "Amina H. (Démo)",
    appTitle: "Cartes Syllabes & Sons (TaRL)",
    gradeRange: "1AEP–3AEP",
    discipline: "Langue Arabe",
    language: "Arabe (RTL)",
    learningObjective:
      "Consolider la reconnaissance des voyelles courtes (فتحة، ضمة، كسرة) en début de remédiation.",
    description:
      "Cartes interactives droite-à-gauche grand format pour rituel de 10 minutes en début de séance.",
    classroomInstructions:
      "Lire collectivement puis faire passer les groupes selon leur niveau (Base / Intermédiaire / Défi).",
    appResource: "Prototype intégré · Galerie Section 10",
    testedFeatures: ["Support RTL arabe", "Lisible au fond de la classe", "Imprimable"],
    privacyConfirmed: true,
    isDemo: true,
    createdAt: "2026-11-24T10:45:00.000Z",
  },
];

export const DEMO_SUBMISSIONS_BY_ACTIVITY: Record<string, PresenterSubmissionRow[]> = {
  "poll-needs": [
    {
      id: "ds-1",
      activityKey: "poll-needs",
      itemKey: "main",
      selectedOption: "diff",
      isCorrect: null,
      summary: "Différenciation pédagogique",
      createdAt: "2026-11-24T09:10:00.000Z",
    },
    {
      id: "ds-2",
      activityKey: "poll-needs",
      itemKey: "main",
      selectedOption: "prep",
      isCorrect: null,
      summary: "Préparation des cours",
      createdAt: "2026-11-24T09:11:00.000Z",
    },
  ],
  "builder-prompt": [
    {
      id: "ds-pb-1",
      activityKey: "builder-prompt",
      itemKey: "main",
      selectedOption: "4AEP · Français",
      isCorrect: null,
      summary: "4AEP · Français — Compréhension d'un court récit (3 niveaux)",
      createdAt: "2026-11-24T09:42:00.000Z",
    },
    {
      id: "ds-pb-2",
      activityKey: "builder-prompt",
      itemKey: "main",
      selectedOption: "3AEP · Mathématiques",
      isCorrect: null,
      summary: "3AEP · Mathématiques — Décomposition C/D/U avec manipulation",
      createdAt: "2026-11-24T09:44:00.000Z",
    },
  ],
  "exercise-metaprompt": [
    {
      id: "ds-mp-1",
      activityKey: "exercise-metaprompt",
      itemKey: "main",
      selectedOption: "fr",
      isCorrect: null,
      summary: "Méta-prompt FR : Lecture 2AEP avec questions de cadrage",
      createdAt: "2026-11-24T09:58:00.000Z",
    },
    {
      id: "ds-mp-2",
      activityKey: "exercise-metaprompt",
      itemKey: "main",
      selectedOption: "ar",
      isCorrect: null,
      summary: "ميتا-برومبت بالعربية: علاج صعوبات القراءة والتمييز بين الحروف (2AEP)",
      createdAt: "2026-11-24T10:01:00.000Z",
    },
  ],
  "exit-ticket": [
    {
      id: "ds-ex-1",
      activityKey: "exit-ticket",
      itemKey: "main",
      selectedOption: "diff",
      isCorrect: null,
      summary: "Créer 3 fiches graduées (Base / Intermédiaire / Défi) pour ma séance de lecture en 4AEP.",
      createdAt: "2026-11-24T11:55:00.000Z",
    },
    {
      id: "ds-ex-2",
      activityKey: "exit-ticket",
      itemKey: "main",
      selectedOption: "app",
      isCorrect: null,
      summary: "Projeter le générateur de décomposition des nombres sur le tableau de 3AEP dès lundi.",
      createdAt: "2026-11-24T11:56:00.000Z",
    },
    {
      id: "ds-ex-3",
      activityKey: "exit-ticket",
      itemKey: "main",
      selectedOption: "meta",
      isCorrect: null,
      summary: "Utiliser le méta-prompt en arabe pour préparer mes séances de remédiation en décodage.",
      createdAt: "2026-11-24T11:57:00.000Z",
    },
    {
      id: "ds-ex-4",
      activityKey: "exit-ticket",
      itemKey: "main",
      selectedOption: "eval",
      isCorrect: null,
      summary: "Tester un ticket de sortie imprimable de 5 questions sur les fractions en 5AEP.",
      createdAt: "2026-11-24T11:58:00.000Z",
    },
  ],
};

export function getDemoAggregate(
  activityKey: string,
  includeAnswers: boolean
): ActivityAggregate | null {
  const def = ACTIVITIES[activityKey];
  if (!def) return null;

  if (activityKey === "poll-needs") {
    const counts: Record<string, number> = {
      prep: 4,
      diff: 6,
      eval: 2,
      corr: 2,
      admin: 1,
      interactive: 3,
    };
    const total = 18;
    return {
      activityKey,
      resetGeneration: 1,
      totalRespondents: total,
      totalSubmissions: total,
      optionTallies: (def.options ?? []).map((opt) => ({
        optionId: opt.id,
        label: opt.label,
        shortLabel: opt.shortLabel,
        count: counts[opt.id] ?? 0,
        percentage: Math.round(((counts[opt.id] ?? 0) / total) * 100),
      })),
    };
  }

  if (activityKey === "vote-project") {
    const counts: Record<string, number> = {
      group1: 4,
      group2: 4,
      group3: 6,
      group4: 4,
    };
    const total = 18;
    return {
      activityKey,
      resetGeneration: 1,
      totalRespondents: total,
      totalSubmissions: total,
      optionTallies: (def.options ?? []).map((opt) => ({
        optionId: opt.id,
        label: opt.label,
        shortLabel: opt.shortLabel,
        count: counts[opt.id] ?? 0,
        percentage: Math.round(((counts[opt.id] ?? 0) / total) * 100),
      })),
    };
  }

  if (activityKey === "quiz-genai" || activityKey === "quiz-responsible") {
    const total = 18;
    return {
      activityKey,
      resetGeneration: 1,
      totalRespondents: total,
      totalSubmissions: total * (def.questions?.length ?? 5),
      questionTallies: (def.questions ?? []).map((q, idx) => {
        const correctCount = 14 + (idx % 3);
        const wrongCount = total - correctCount;
        return {
          questionId: q.id,
          prompt: q.prompt,
          totalResponses: total,
          correctCount,
          correctOptionId: includeAnswers ? q.correctOptionId : null,
          explanation: includeAnswers ? q.explanation : null,
          options: q.options.map((opt, oIdx) => {
            const c =
              opt.id === q.correctOptionId
                ? correctCount
                : oIdx === 0 || (q.correctOptionId === q.options[0].id && oIdx === 1)
                  ? wrongCount
                  : 0;
            return {
              optionId: opt.id,
              label: opt.label,
              shortLabel: opt.label.slice(0, 26),
              count: c,
              percentage: Math.round((c / total) * 100),
            };
          }),
        };
      }),
    };
  }

  if (activityKey === "builder-prompt") {
    return {
      activityKey,
      resetGeneration: 1,
      totalRespondents: 15,
      totalSubmissions: 15,
      recentSnippets: [
        {
          id: "dpb-1",
          label: "4AEP · Français",
          content:
            "Rôle : Conseiller pédagogique primaire. Tâche : Mini-récit de 8 lignes + 5 questions graduées (Base / Intermédiaire / Défi).",
          secondary: "Objectif : Comprendre la chronologie d'un récit",
          createdAt: "2026-11-24T09:42:00.000Z",
        },
        {
          id: "dpb-2",
          label: "3AEP · Mathématiques",
          content:
            "Rôle : Enseignant du primaire. Tâche : 6 exercices de décomposition C/D/U avec manipulation visuelle et fiche imprimable.",
          secondary: "Objectif : Décomposer les nombres à 3 chiffres",
          createdAt: "2026-11-24T09:44:00.000Z",
        },
        {
          id: "dpb-3",
          label: "2AEP · اللغة العربية",
          content:
            "الدور: أستاذ التعليم الابتدائي. المهمة: نص قرائي قصير مشكول مع 3 أسئلة فهم وتدريب على الحركات القصيرة.",
          secondary: "الهدف: التمييز بين الفتحة والمد بالألف",
          createdAt: "2026-11-24T09:46:00.000Z",
        },
      ],
    };
  }

  if (activityKey === "exercise-metaprompt") {
    return {
      activityKey,
      resetGeneration: 1,
      totalRespondents: 14,
      totalSubmissions: 14,
      optionTallies: [
        { optionId: "fr", label: "Méta-prompt en Français", shortLabel: "Français", count: 8, percentage: 57 },
        { optionId: "ar", label: "Méta-prompt en Arabe", shortLabel: "العربية", count: 6, percentage: 43 },
      ],
      recentSnippets: [
        {
          id: "dmp-1",
          label: "Français · 5AEP",
          content:
            "Avant de générer l'exercice sur les fractions, pose-moi 5 questions sur le niveau réel de ma classe et le matériel disponible.",
          createdAt: "2026-11-24T09:58:00.000Z",
        },
        {
          id: "dmp-2",
          label: "العربية · 2AEP",
          content:
            "قبل إنتاج النشاط القرائي، اطرح علي 5 أسئلة حول الحروف المستهدفة والمدة الزمنية ووسائل العرض في القسم.",
          createdAt: "2026-11-24T10:01:00.000Z",
        },
      ],
    };
  }

  if (activityKey === "vote-showcase") {
    const total = 18;
    const dists: Record<string, Record<string, number>> = {
      most_useful: { group1: 5, group2: 4, group3: 6, group4: 3 },
      best_pedagogy: { group1: 3, group2: 3, group3: 7, group4: 5 },
      most_creative: { group1: 4, group2: 6, group3: 3, group4: 5 },
    };
    return {
      activityKey,
      resetGeneration: 1,
      totalRespondents: total,
      totalSubmissions: total * 3,
      showcaseTallies: (def.categories ?? []).map((cat) => ({
        categoryId: cat.id,
        categoryLabel: cat.label,
        totalVotes: total,
        options: (def.options ?? []).map((opt) => {
          const count = dists[cat.id]?.[opt.id] ?? 0;
          return {
            optionId: opt.id,
            label: opt.label,
            shortLabel: opt.shortLabel,
            count,
            percentage: Math.round((count / total) * 100),
          };
        }),
      })),
    };
  }

  if (activityKey === "exit-ticket") {
    const counts: Record<string, number> = {
      prep: 3,
      diff: 6,
      meta: 3,
      eval: 2,
      app: 4,
    };
    const total = 18;
    return {
      activityKey,
      resetGeneration: 1,
      totalRespondents: total,
      totalSubmissions: total,
      optionTallies: (def.options ?? []).map((opt) => ({
        optionId: opt.id,
        label: opt.label,
        shortLabel: opt.shortLabel,
        count: counts[opt.id] ?? 0,
        percentage: Math.round(((counts[opt.id] ?? 0) / total) * 100),
      })),
      recentSnippets: (DEMO_SUBMISSIONS_BY_ACTIVITY["exit-ticket"] ?? []).map((s) => ({
        id: s.id,
        label: s.selectedOption ?? "Engagement",
        content: s.summary,
        createdAt: s.createdAt,
      })),
    };
  }

  return null;
}
