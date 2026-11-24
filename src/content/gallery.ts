import type { GalleryCategoryItem, GroupProjectGuide } from "./types";

export const GALLERY_CATEGORIES: GalleryCategoryItem[] = [
  {
    id: "cat-arabic-literacy",
    number: 1,
    title: "Alphabétisation arabe & reconnaissance des lettres",
    problem:
      "Les élèves de 1AEP–2AEP confondent souvent la forme des lettres selon leur position (début, milieu, fin) et les voyelles courtes.",
    gradeRange: "1AEP – 2AEP",
    subject: "Langue Arabe",
    learningObjective:
      "Reconnaître une lettre cible dans ses positions et lire des syllabes simples avec فتحة / ضمة / كسرة.",
    proposedFeatures: [
      "Affichage RTL grand format lisible du fond de la classe",
      "Sélecteur de lettre + voyelle courte interactive",
      "Mode hors ligne et zéro audio obligatoire",
    ],
    exampleInteraction:
      "L'enseignant sélectionne « ب » puis clique sur chaque voyelle pour faire lire la classe en chœur : بَ · بِ · بُ.",
    possibleImprovements: [
      "Ajouter les lettres proches (ت، ث، ن) en mode contraste visuel",
      "Exporter une bande d'entraînement imprimable",
    ],
    demoKey: "arabic-literacy",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-french-reading",
    number: 2,
    title: "Lecture & compréhension en français",
    problem:
      "Difficile d'animer une compréhension de texte interactive avec 35+ élèves sans photocopier de longs dossiers à chaque séance.",
    gradeRange: "3AEP – 6AEP",
    subject: "Français",
    learningObjective:
      "Prélever des informations explicites et implicites dans un texte court et justifier sa réponse.",
    proposedFeatures: [
      "Texte aéré projetable paragraphe par paragraphe",
      "5 QCM avec justification affichée à la demande",
      "Score collectif ou individuel sans compte élève",
    ],
    exampleInteraction:
      "La classe lit le récit au projecteur, vote à main levée pour chaque question puis découvre l'explication ciblée.",
    possibleImprovements: [
      "Surlignage automatique du passage justificatif dans le texte",
      "Banque de 3 textes adaptés par trimestre",
    ],
    demoKey: "french-reading",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-vocab-flashcards",
    number: 3,
    title: "Vocabulaire par flashcards Arabe / Français",
    problem:
      "Les élèves comprennent souvent une notion en arabe mais peinent à mémoriser son équivalent lexical en français (et inversement).",
    gradeRange: "2AEP – 5AEP",
    subject: "Bilingue AR / FR",
    learningObjective:
      "Mémoriser le lexique thématique de l'école, des nombres et des sciences dans les deux langues.",
    proposedFeatures: [
      "Cartes recto/verso (Français LTR ↔ Arabe RTL voyellé)",
      "Indice contextuel en phrase courte",
      "Bouton « Maîtrisé / À revoir » pour le rituel du matin",
    ],
    exampleInteraction:
      "En 5 minutes d'échauffement, l'enseignant affiche la face arabe, laisse les élèves formuler en français puis retourne la carte.",
    possibleImprovements: [
      "Extension optionnelle vers quelques mots usuels en Amazigh (Tifinagh) selon le besoin",
      "Jeu d'appariement rapide sur tablette partagée",
    ],
    demoKey: "vocab-flashcards",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-math-manipulatives",
    number: 4,
    title: "Manipulations mathématiques (droite, C/D/U, abaque, fractions)",
    problem:
      "Manque de matériel concret en quantité suffisante pour visualiser les centaines, dizaines, unités et fractions dans une classe nombreuse.",
    gradeRange: "1AEP – 5AEP",
    subject: "Mathématiques",
    learningObjective:
      "Associer une quantité visuelle (cubes, barres, parts) à son écriture chiffrée et sa décomposition.",
    proposedFeatures: [
      "Blocs interactifs C / D / U cliquables sur projecteur",
      "Visualiseur de fractions simples par partage équitable",
      "Droite numérique graduée réglable",
    ],
    exampleInteraction:
      "Un élève vient au PC de l'enseignant composer « 234 » avec 2 plaques de 100, 3 barres de 10 et 4 unités.",
    possibleImprovements: [
      "Mode défi chronométré sans pression négative",
      "Génération de vignettes à coller sur cahier",
    ],
    demoKey: "math-manipulatives",
    offlineReady: true,
    printFriendly: false,
  },
  {
    id: "cat-calculation",
    number: 5,
    title: "Entraînement interactif au calcul",
    problem:
      "Le calcul mental quotidien devient répétitif et s'adapte peu aux écarts de rapidité entre élèves.",
    gradeRange: "1AEP – 6AEP",
    subject: "Mathématiques",
    learningObjective:
      "Automatiser les tables d'addition, de soustraction et de multiplication avec feedback immédiat.",
    proposedFeatures: [
      "Générateur progressif d'opérations sans connexion",
      "Contrôle de la plage numérique par l'enseignant",
      "Correction étape par étape de la retenue",
    ],
    exampleInteraction:
      "L'enseignant choisit le palier « retenue sur dizaines », lance 5 calculs rapides et vérifie les ardoises.",
    possibleImprovements: [
      "Ajout de problèmes courts contextualisés",
      "Option d'impression de séries A/B anti-copie",
    ],
    demoKey: "math-manipulatives",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-remediation",
    number: 6,
    title: "Exercices différenciés & remédiation (3 parcours)",
    problem:
      "Dans une même classe de 35 élèves, certains maîtrisent déjà l'objectif tandis que d'autres ont besoin de consolider les prérequis (logique TaRL).",
    gradeRange: "2AEP – 6AEP",
    subject: "Français / Arabe / Maths",
    learningObjective:
      "Permettre à chaque élève de progresser sur une compétence ciblée selon son niveau réel : Base, Intermédiaire ou Défi.",
    proposedFeatures: [
      "Sélecteur enseignant Base / Intermédiaire / Défi",
      "Feedback explicatif immédiat sans sanction",
      "Aucune comparaison publique entre élèves",
    ],
    exampleInteraction:
      "Après un court diagnostic, l'enseignant projette successivement les consignes Base et Intermédiaire pendant que les avancés traitent le Défi.",
    possibleImprovements: [
      "Historique local de progression sur l'appareil de l'enseignant",
      "Fiches imprimables associées par palier",
    ],
    demoKey: "remediation-tarl",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-dictation",
    number: 7,
    title: "Dictée interactive & orthographe",
    problem:
      "Corriger 38 dictées prend un temps considérable et les élèves oublient vite les règles d'accord ou les lettres muettes.",
    gradeRange: "3AEP – 6AEP",
    subject: "Français / Arabe",
    learningObjective:
      "Identifier les graphies correctes et justifier les accords simples (genre, nombre, terminaisons).",
    proposedFeatures: [
      "Mode texte à trous orthographique projetable (sans audio obligatoire)",
      "Mise en évidence colorée des accords sujet-verbe",
      "Auto-correction guidée sur cahier",
    ],
    exampleInteraction:
      "L'enseignant dicte la phrase oralement puis affiche l'analyse pas à pas des terminaisons pour que chaque élève corrige au stylo vert.",
    possibleImprovements: [
      "Générateur de listes de mots hebdomadaires",
      "Version arabe pour التاء المربوطة والمبسوطة",
    ],
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-formative",
    number: 8,
    title: "Évaluation formative & tickets de sortie",
    problem:
      "On découvre parfois les incompréhensions des élèves trop tard, lors du contrôle sommatif mensuel.",
    gradeRange: "2AEP – 6AEP",
    subject: "Toutes disciplines",
    learningObjective:
      "Repérer en 5 minutes les erreurs fréquentes de la classe en fin de séance et adapter la leçon suivante.",
    proposedFeatures: [
      "5 questions diagnostiques ciblant des pièges typiques",
      "Compteur rapide (ardoises / vote classe) des erreurs fréquentes",
      "Résumé imprimable A4 de bilan de séance",
    ],
    exampleInteraction:
      "En fin de séance, l'enseignant saisit le nombre d'élèves en difficulté par question (ex. 12/32 sur la question 3) et imprime la note de remédiation.",
    possibleImprovements: [
      "Export CSV anonyme des taux de réussite par item",
      "Modèles prêts en arabe et en français",
    ],
    demoKey: "formative-assessment",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-printable-worksheets",
    number: 9,
    title: "Générateur de fiches d'exercices imprimables",
    problem:
      "De nombreuses classes n'ont pas de tablettes ou ont une connexion instable : le papier reste le support le plus universel.",
    gradeRange: "1AEP – 6AEP",
    subject: "Toutes disciplines",
    learningObjective:
      "Produire en 2 minutes une fiche A4 propre, lisible, économe en encre et adaptée à l'objectif du jour.",
    proposedFeatures: [
      "Personnalisation titre, niveau, date, consigne et 3 exercices",
      "Mise en page @media print sans menus ni couleurs sombres",
      "Corrigé enseignant séparé",
    ],
    exampleInteraction:
      "L'enseignant choisit niveau 3AEP, thème Maths, règle 5 exercices puis clique sur « Imprimer / PDF ».",
    possibleImprovements: [
      "Option 2 demi-pages par feuille A4 pour réduire le coût papier",
      "Modèles RTL arabe natif",
    ],
    demoKey: "printable-worksheet",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-group-maker",
    number: 10,
    title: "Organisation de la classe & groupes aléatoires",
    problem:
      "Former rapidement des îlots équilibrés de 4 ou 5 élèves sans favoritisme ni perte de temps.",
    gradeRange: "1AEP – 6AEP",
    subject: "Vie de classe / Transversal",
    learningObjective:
      "Structurer des travaux de groupes coopératifs en 10 secondes sans enregistrer de données personnelles.",
    proposedFeatures: [
      "Fonctionnement par numéros (Élève 1..36) ou prénoms éphémères non sauvegardés",
      "Choix de la taille des groupes et rotation des rôles",
      "Mode plein écran projecteur",
    ],
    exampleInteraction:
      "L'enseignant saisit « 32 élèves, groupes de 4 » → l'outil tire 8 îlots avec 1 rôle (Lecteur, Scribe, Rapporteur, Gardien du temps).",
    possibleImprovements: [
      "Minuteur visuel silencieux de 10 minutes intégré",
      "Bouton remélanger en un clic",
    ],
    demoKey: "group-maker",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-science-sim",
    number: 11,
    title: "Simulations simples d'Éveil Scientifique",
    problem:
      "Expliquer des phénomènes abstraits (cycle de l'eau, ombre et lumière, circuits simples) sans laboratoire équipé.",
    gradeRange: "3AEP – 6AEP",
    subject: "Éveil Scientifique (النشاط العلمي)",
    learningObjective:
      "Observer une relation cause-effet (ex. température ↔ état de l'eau) et formuler une hypothèse.",
    proposedFeatures: [
      "Schéma SVG interactif léger sans vidéo lourde",
      "Curseur de test d'hypothèse avant observation",
      "Lexique bilingue FR / AR des phénomènes",
    ],
    exampleInteraction:
      "Les élèves formulent une prédiction puis l'enseignant bouge le curseur sur le projecteur pour observer le résultat.",
    possibleImprovements: [
      "Mini-simulations : germination, tri des matériaux, phases de la lune",
      "Fiche d'observation imprimable",
    ],
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-teacher-prep",
    number: 12,
    title: "Outils de préparation & organisation enseignante",
    problem:
      "La planification hebdomadaire, les grilles d'observation et les notes de liaison prennent de précieuses soirées.",
    gradeRange: "1AEP – 6AEP",
    subject: "Préparation pédagogique",
    learningObjective:
      "Structurer une trame de séance ou une grille d'observation critériée à partir d'un objectif choisi par l'enseignant.",
    proposedFeatures: [
      "Assistant structuré (Niveau, Compétence, Durée, Supports)",
      "Mention systématique « Brouillon à valider »",
      "Export texte ou impression directe",
    ],
    exampleInteraction:
      "L'enseignant assemble sa demande dans le Prompt Builder puis copie la trame obtenue dans son cahier journal.",
    possibleImprovements: [
      "Bibliothèque partagée de prompts validés entre collègues de Mediouna",
      "Modèles adaptés aux classes à niveaux multiples",
    ],
    offlineReady: true,
    printFriendly: true,
  },
];

export const GROUP_PROJECTS: GroupProjectGuide[] = [
  {
    id: "group1",
    groupLabel: "Groupe 1 (5 collègues)",
    title: "Application de Lecture & Compréhension (FR ou AR)",
    subtitle: "Texte court · 5 questions · Correction automatique · Score & feedback",
    defaultGrade: "4AEP",
    defaultSubject: "Français (LTR) ou Arabe (RTL)",
    defaultCompetency: "Comprendre un texte narratif court et justifier ses réponses",
    problemSolved:
      "Permettre une séance de lecture interactive au vidéoprojecteur ou sur tablette partagée sans photocopies lourdes.",
    expectedOutcome:
      "Un prototype fonctionnel en une page affichant 1 court texte (avec appui RTL si arabe), 5 QCM, un bouton de validation avec explication immédiate et un score final recommençable.",
    requiredFeatures: [
      "Texte court lisible à 6 mètres sur projecteur",
      "5 questions à choix multiples progressives",
      "Correction automatique + explication courte par question",
      "Score final + bouton « Recommencer »",
      "Zéro compte élève et fonctionnement 100 % navigateur (hors ligne)",
    ],
    learningObjectives: [
      "Identifier les personnages, le lieu et les actions clés",
      "Justifier une réponse en s'appuyant sur un indice du texte",
    ],
    techSpec: [
      "1 fichier HTML autonome (ou composant React léger) sans appels API",
      "Données des 5 questions stockées dans un tableau JS facile à modifier par l'enseignant",
      "Prise en charge dir='rtl' pour l'arabe et dir='ltr' pour le français",
    ],
    testingChecklist: [
      "Le texte est lisible sans zoom excessif sur smartphone et projecteur",
      "Une bonne réponse affiche un feedback positif + explication",
      "Une erreur affiche la bonne réponse sans bloquer la progression",
      "Le bouton Recommencer remet bien le score à 0",
    ],
    demoChecklist: [
      "Présenter en 2 minutes le problème de classe résolu",
      "Montrer une réponse correcte puis une erreur volontaire",
      "Indiquer comment un collègue peut remplacer le texte en 30 secondes",
    ],
  },
  {
    id: "group2",
    groupLabel: "Groupe 2 (5 collègues)",
    title: "Mathématiques Interactives & Manipulation",
    subtitle: "Décomposition · Valeur positionnelle · Calculs simples · Progression",
    defaultGrade: "3AEP",
    defaultSubject: "Mathématiques",
    defaultCompetency: "Décomposer et recomposer des nombres jusqu'à 999 avec support visuel",
    problemSolved:
      "Rendre visibles les centaines, dizaines et unités devant toute la classe quand on manque de matériel de manipulation.",
    expectedOutcome:
      "Un atelier visuel où l'élève ou l'enseignant clique sur des blocs C / D / U pour construire un nombre, passer 3 niveaux de difficulté et vérifier instantanément.",
    requiredFeatures: [
      "Représentation visuelle claire des centaines, dizaines, unités",
      "Mode décomposition (nombre → C + D + U) et calcul simple",
      "Sélecteur de difficulté progressive (2 chiffres → 3 chiffres avec zéro)",
      "Correction visuelle immédiate et bouton Nouveau défi",
    ],
    learningObjectives: [
      "Distinguer chiffre des dizaines et nombre de dizaines",
      "Passer de la manipulation visuelle à l'écriture additive",
    ],
    techSpec: [
      "Blocs SVG ou HTML CSS légers (aucune image externe requise)",
      "Générateur aléatoire borné selon le palier choisi par l'enseignant",
      "Boutons larges adaptés au doigt (tactile) et à la souris",
    ],
    testingChecklist: [
      "Le compteur visuel correspond exactement au nombre affiché",
      "Le cas du zéro (ex. 305) fonctionne correctement",
      "Les 3 niveaux de difficulté modifient bien la taille des nombres",
    ],
    demoChecklist: [
      "Faire manipuler un nombre à 3 chiffres avec zéro intercalaire",
      "Montrer le passage du niveau Base au niveau avancé",
      "Expliquer l'usage concret au vidéoprojecteur avec ardoises",
    ],
  },
  {
    id: "group3",
    groupLabel: "Groupe 3 (5 collègues)",
    title: "Application de Remédiation à 3 Parcours (TaRL)",
    subtitle: "1 compétence ciblée · Base, Intermédiaire, Défi · Difficulté pilotée",
    defaultGrade: "3AEP–5AEP",
    defaultSubject: "Soutien · Lecture ou Calcul",
    defaultCompetency: "Consolider une compétence fondamentale selon le niveau réel de chaque élève",
    problemSolved:
      "Gérer efficacement l'hétérogénéité des acquis en atelier de soutien sans stigmatiser les élèves les plus fragiles.",
    expectedOutcome:
      "Une mini-application centrée sur une compétence unique, offrant 3 parcours (Base, Intermédiaire, Défi) pilotés par l'enseignant avec feedback immédiat.",
    requiredFeatures: [
      "Choix explicite de la compétence ciblée en haut d'écran",
      "3 onglets/parcours : Base, Intermédiaire, Défi",
      "Exercices courts avec retour immédiat encourageant",
      "Contrôle de la difficulté réservé à l'enseignant (pas de score punitif)",
    ],
    learningObjectives: [
      "Faire réussir chaque élève dès son palier de départ",
      "Permettre le passage progressif vers le palier supérieur",
    ],
    techSpec: [
      "Objet JS structuré par palier : { base: [...], intermediaire: [...], defi: [...] }",
      "Transitions fluides et messages d'encouragement bienveillants",
      "Option impression A4 des exercices du palier actif",
    ],
    testingChecklist: [
      "Les 3 parcours proposent des exercices réellement gradués",
      "Le feedback explique comment réussir plutôt que de sanctionner",
      "Aucun nom d'élève ni classement public n'est affiché",
    ],
    demoChecklist: [
      "Nommer la compétence choisie par votre groupe",
      "Comparer un exercice du parcours Base et du parcours Défi",
      "Expliquer comment organiser 3 groupes en classe avec cet outil",
    ],
  },
  {
    id: "group4",
    groupLabel: "Groupe 4 (5 collègues)",
    title: "Évaluation Formative & Bilan Imprimable",
    subtitle: "5 questions · Feedback instantané · Erreurs fréquentes · Résumé A4",
    defaultGrade: "5AEP",
    defaultSubject: "Mathématiques ou Français",
    defaultCompetency: "Diagnostiquer rapidement la compréhension en fin de séance",
    problemSolved:
      "Repérer immédiatement quelles notions posent problème à la majorité de la classe et garder une trace imprimable pour préparer la remédiation.",
    expectedOutcome:
      "Un mini-quiz de 5 questions avec affichage des scores agrégés de la classe, identification des erreurs fréquentes et un résumé prêt à imprimer (@media print).",
    requiredFeatures: [
      "5 questions ciblant chacune un distracteur / erreur fréquente précise",
      "Saisie rapide des réponses collectives ou test élève avec feedback",
      "Bloc « Erreurs fréquentes repérées » avec piste de remédiation",
      "Bouton « Imprimer le résumé » optimisé A4",
    ],
    learningObjectives: [
      "Transformer l'erreur en information pédagogique exploitable dès le lendemain",
      "Documenter le bilan de séance sans collecter de données personnelles d'élèves",
    ],
    techSpec: [
      "Chaque option erronée est taguée avec le type d'erreur (ex. confusion unité/dizaine)",
      "Tableau récapitulatif anonymisé des résultats par question",
      "Feuille de style @media print propre (noir sur blanc)",
    ],
    testingChecklist: [
      "Les 5 questions identifient clairement une erreur typique",
      "Les compteurs agrégés se mettent à jour sans nom d'élève",
      "L'aperçu avant impression produit une feuille A4 lisible et propre",
    ],
    demoChecklist: [
      "Simuler quelques réponses de classe montrant une erreur majoritaire sur Q3",
      "Montrer le diagnostic généré automatiquement",
      "Afficher l'aperçu imprimable du résumé",
    ],
  },
];

export function buildGroupPromptFr(
  project: GroupProjectGuide,
  grade: string,
  subject: string,
  competency: string
): string {
  return `Rôle : Développeur web et conseiller pédagogique du primaire marocain.
Contexte : École publique à Mediouna (équipement variable : vidéoprojecteur ou smartphone/tablette partagée, connexion parfois instable, zéro compte élève).
Projet du groupe : ${project.title}
Niveau ciblé : ${grade}
Discipline : ${subject}
Compétence ciblée (fournie par l'enseignant) : ${competency}

Tâche : Crée un prototype léger en une seule page HTML/CSS/JavaScript autonome (sans appel API ni bibliothèque externe lourde) qui implémente :
${project.requiredFeatures.map((f) => `- ${f}`).join("\n")}

Contraintes strictes :
- Interface épurée, très lisible au tableau/projecteur et responsive sur smartphone.
- Aucune donnée personnelle d'élève collectée ou stockée.
- Contenu présenté comme brouillon modifiable facilement par l'enseignant.
- Code commenté en français pour que je puisse adapter les exercices rapidement.`;
}

export function buildGroupPromptAr(
  project: GroupProjectGuide,
  grade: string,
  subject: string,
  competency: string
): string {
  return `الدور: مطور ويب ومستشار تربوي للتعليم الابتدائي بالمغرب.
السياق: مدرسة عمومية بإقليم مديونة (مسلاط عاكس في القسم أو لوحة إلكترونية مشتركة، إنترنت غير مستقر أحياناً، بدون حسابات للتلاميذ).
المشروع: ${project.title}
المستوى المستهدف: ${grade}
المادة: ${subject}
الكفاية المستهدفة: ${competency}

المطلوب: أنشئ نموذجاً أولياً (Prototype) خفيفاً في صفحة ويب واحدة (HTML/CSS/JavaScript) يعمل بدون إنترنت وبواجهة عربية واضحة من اليمين إلى اليسار (RTL)، ويتضمن:
${project.requiredFeatures.map((f) => `- ${f}`).join("\n")}

شروط أساسية:
- خط كبير وواضح للقراءة من آخر القسم.
- عدم جمع أو تخزين أي معطيات شخصية للتلاميذ.
- هيكلة سهلة تتيح للأستاذ(ة) تعديل التمارين أو النص خلال دقائق.`;
}
