import type { UseCaseItem } from "./types";

export const USE_CASES: UseCaseItem[] = [
  {
    id: "lesson-plan",
    label: "1. Fiche de séance",
    grade: "4AEP",
    subject: "Français · Lecture / Langue",
    objective: "Identifier et utiliser les indicateurs de temps dans un court récit.",
    competency: "Produire et comprendre un récit simple structuré chronologiquement.",
    promptLanguage: "fr",
    prompt: `Rôle : Conseiller pédagogique du primaire au Maroc.
Niveau : 4AEP (élèves âgés de 9-10 ans).
Discipline : Français.
Objectif d'apprentissage fourni par l'enseignant : Identifier les indicateurs de temps (d'abord, ensuite, enfin) dans un texte court de 6 lignes.
Contraintes : Vocabulaire accessible, classe à effectif de 34 élèves avec un seul vidéoprojecteur et des cahiers. Aucune donnée personnelle.
Format : Fiche de séance en 35 minutes (Mise en situation, Découverte, Application en binômes, Trace écrite au tableau).`,
    draftOutputTitle: "Trame de séance 4AEP (35 min)",
    draftOutputBody: `1. Mise en situation (5 min) : Écrire au tableau 3 phrases mélangées sur le trajet vers l'école. Demander oralement comment remettre l'histoire dans l'ordre.
2. Découverte (10 min) : Projeter ou lire le mini-texte « Le matin de Salma » et surligner D'abord, Ensuite, Enfin.
3. Application guidée (12 min) : En binômes sur ardoise/cahier, compléter 3 phrases avec le bon connecteur.
4. Trace écrite courte (8 min) : Règle de 2 lignes copiée par les élèves + 1 phrase personnelle.`,
    teacherCheck:
      "Vérifier que les mots choisis figurent déjà dans le lexique travaillé en classe durant l'unité en cours.",
  },
  {
    id: "three-levels",
    label: "2. 3 niveaux (TaRL)",
    grade: "3AEP",
    subject: "Mathématiques · Calcul",
    objective: "Effectuer des additions avec et sans retenue selon le niveau réel de l'élève.",
    competency: "Calculer des sommes jusqu'à 999 avec compréhension de la retenue.",
    promptLanguage: "fr",
    prompt: `Rôle : Enseignant du primaire pratiquant la pédagogie différenciée (principe TaRL : partir du niveau réel de l'élève).
Niveau : 3AEP.
Objectif : Additionner deux nombres à 2 ou 3 chiffres.
Tâche : Génère exactement 3 parcours d'exercices progressifs sur le même objectif :
- Parcours Base (consolidation sans retenue, nombres < 100)
- Parcours Intermédiaire (une retenue sur les unités)
- Parcours Défi (deux retenues + 1 petit problème contextualisé à Mediouna : marché, cahiers de classe).
Format : Clair, copiable sur fiche ou tableau, avec corrigé séparé.`,
    draftOutputTitle: "Exercices gradués en 3 parcours",
    draftOutputBody: `• Parcours Base : 24 + 13 = ___ | 41 + 27 = ___ | 52 + 36 = ___
• Parcours Intermédiaire : 38 + 25 = ___ | 147 + 36 = ___ | 264 + 118 = ___
• Parcours Défi : 378 + 245 = ___ | Problème : La coopérative scolaire achète 185 cahiers bleus et 148 cahiers rouges. Combien de cahiers y a-t-il en tout ?`,
    teacherCheck:
      "Adapter les nombres selon l'évaluation diagnostique rapide de vos élèves en début de semaine.",
    printable: true,
  },
  {
    id: "arabic-reading",
    label: "3. Lecture arabe (RTL)",
    grade: "2AEP",
    subject: "اللغة العربية · القراءة",
    objective: "تمييز وقراءة الكلمات التي تتضمن الحركات القصيرة والطويلة (المد بالألف والواو).",
    competency: "فك الرموز القرائية وفهم جمل قصيرة مألوفة.",
    promptLanguage: "ar",
    prompt: `الدور: أستاذ(ة) التعليم الابتدائي بالمغرب.
المستوى: الثاني ابتدائي (2AEP).
الهدف التعلمي: قراءة وفهم نص قصير من 4 جمل يركز على التمييز بين الفتحة والمد بالألف.
الشروط: لغة واضحة، مشكولة شكلاً تاماً، مناسبة لبيئة التلميذ القروية وشبه الحضرية، مع 3 أسئلة فهم بسيطة قابلة للكتابة على السبورة أو الطباعة.`,
    draftOutputTitle: "نص قرائي مشكول + أسئلة فهم (2AEP)",
    draftOutputBody: "انظر النموذج العربي أسفله — جاهز للنسخ والمراجعة التربوية.",
    arabicSample: `النَّصُّ:
فِي الصَّبَاحِ، ذَهَبَ سَامِي مَعَ أُخْتِهِ سَلْمَى إِلَى الْمَدْرَسَةِ.
حَمَلَ سَامِي كِتَابًا جَدِيدًا وَقَلَمًا أَزْرَقَ.
فِي السَّاحَةِ، قَرَأَ الأَطْفَالُ كَلِمَاتٍ جَمِيلَةً عَلَى السَّبُّورَةِ.

أَسْئِلَةُ الْفَهْمِ:
1. إِلَى أَيْنَ ذَهَبَ سَامِي وَسَلْمَى؟
2. مَاذَا حَمَلَ سَامِي فِي مِحْفَظَتِهِ؟
3. استخرج من النص كلمتين بهما مد بالألف (مثل: الصَّبَاحِ، كِتَابًا).`,
    teacherCheck:
      "التأكد من ضبط الشكل التام للحروف قبل عرضه على السبورة أو طباعته للتلاميذ.",
    printable: true,
  },
  {
    id: "vocab-bilingual",
    label: "4. Vocabulaire AR/FR",
    grade: "3AEP–4AEP",
    subject: "Français / Arabe · Lexique",
    objective: "Associer le vocabulaire de la classe et de l'environnement proche en français et en arabe.",
    competency: "Enrichir le lexique oral et écrit par correspondance bilingue.",
    promptLanguage: "bilingual",
    prompt: `Rôle : Enseignant du primaire bilingue.
Niveau : 3AEP / 4AEP.
Thème : Les fournitures et l'espace de la classe.
Tâche : Crée 6 paires de mots français / arabe voyellé (تشكيل) avec une phrase courte en français pour chaque mot et une question de réemploi.`,
    draftOutputTitle: "Mini-lexique bilingue prêt pour flashcards",
    draftOutputBody: `1. Le tableau — السَّبُّورَةُ → « L'enseignant écrit la date au tableau. »
2. Le cahier — الدَّفْتَرُ → « J'ouvre mon cahier proprement. »
3. La règle — الْمِسْطَرَةُ → « Je trace un trait droit avec la règle. »
4. La bibliothèque — الْمَكْتَبَةُ → « Nous empruntons un album à la bibliothèque. »`,
    arabicSample: `تطبيق سريع في القسم: يرفع التلميذ البطاقة العربية عندما يسمع الكلمة الفرنسية، ثم يقرأ الجملة بصوت مسموع.`,
    teacherCheck:
      "Vérifier l'exactitude des voyelles arabes et la prononciation orale en début de séance.",
  },
  {
    id: "math-decomposition",
    label: "5. Décomposition maths",
    grade: "3AEP",
    subject: "Mathématiques · Numération",
    objective: "Décomposer un nombre à 3 chiffres sous forme additive et par rang (C / D / U).",
    competency: "Maîtriser la valeur positionnelle des chiffres dans un nombre entier.",
    promptLanguage: "fr",
    prompt: `Rôle : Enseignant de mathématiques au primaire marocain.
Niveau : 3AEP.
Objectif : Décomposer les nombres de 100 à 999 en centaines, dizaines et unités.
Tâche : Propose une progression visuelle en 4 exemples (tableau C | D | U) puis 5 exercices gradués où l'élève passe de l'écriture chiffrée à la décomposition et inversement.`,
    draftOutputTitle: "Atelier décomposition C / D / U",
    draftOutputBody: `Exemple modèle : 347 = 3 centaines + 4 dizaines + 7 unités = 300 + 40 + 7
Exercices guidés :
1) 254 = ___ + ___ + ___
2) 508 = ___ centaines + ___ dizaines + ___ unités (piège du zéro !)
3) Retrouve le nombre : 400 + 60 + 9 = ___`,
    teacherCheck:
      "Insister sur le rôle du zéro intercalaire (ex. 508) qui génère souvent des erreurs chez les élèves.",
    printable: true,
  },
  {
    id: "remediation",
    label: "6. Remédiation",
    grade: "2AEP–5AEP",
    subject: "Soutien scolaire / Fondamentaux",
    objective: "Corriger la confusion fréquente entre b/d ou p/q en lecture française (ou ب/ت/ث en arabe).",
    competency: "Automatiser la discrimination visuelle et phonologique.",
    promptLanguage: "fr",
    prompt: `Rôle : Enseignant animateur d'atelier de remédiation (soutien ciblé).
Public : Petit groupe de 6 élèves de 3AEP ayant encore des confusions entre b et d.
Contraintes : Séance courte de 15 minutes sans matériel informatique individuel (ardoises + tableau).
Format : 1) Repère visuel mnémotechnique simple, 2) 8 syllabes contrastées à lire, 3) 4 mots à entourer sur ardoise.`,
    draftOutputTitle: "Micro-séance remédiation b / d (15 min)",
    draftOutputBody: `• Astuce visuelle : « b » regarde vers la droite comme le ventre de « ballon » ; « d » a le dos tourné comme « dos ».
• Syllabes flash au tableau : ba – da / bi – di / bou – dou / bra – dra.
• Jeu d'ardoise : Dictée flash de 4 syllabes, levée collective d'ardoises, correction immédiate bienveillante.`,
    teacherCheck:
      "Observer quels élèves hésitent encore après 10 minutes pour ajuster le groupe de la séance suivante.",
  },
  {
    id: "formative-print",
    label: "7. Éval & fiche A4",
    grade: "5AEP",
    subject: "Mathématiques · Fractions",
    objective: "Vérifier la compréhension des fractions simples avant d'aborder l'addition de fractions.",
    competency: "Représenter, lire et comparer des fractions simples (1/2, 1/4, 3/4).",
    promptLanguage: "fr",
    prompt: `Rôle : Enseignant de 5AEP.
Objectif : Évaluation formative rapide (5 questions en 8 minutes) sur les fractions simples.
Tâche : Crée 4 QCM conçus pour révéler les erreurs typiques (confondre numérateur et dénominateur, oublier l'égalité des parts) + 1 question de dessin à partager sur papier A4.`,
    draftOutputTitle: "Mini-diagnostic Fractions (5 questions)",
    draftOutputBody: `Q1. Une barre de chocolat a 4 parts égales. Sara mange 1 part. Quelle fraction reste-t-il ? (A: 1/4 · B: 3/4 · C: 4/3)
Q2. Si un gâteau est coupé en 3 parts INÉGALES, une part représente-t-elle exactement 1/3 ? (Oui / Non et pourquoi ?)
→ Diagnostic rapide : Si l'élève répond 1/4 à Q1, travailler la lecture attentive de la consigne ; si Oui à Q2, renforcer la notion de partage équitable.`,
    teacherCheck:
      "Imprimer 2 fiches par page A4 pour économiser le papier ou projeter les 4 QCM au tableau.",
    printable: true,
  },
  {
    id: "admin-projection",
    label: "8. Admin & classe",
    grade: "1AEP–6AEP",
    subject: "Organisation & Communication",
    objective: "Rédiger un mot clair pour les familles sur l'organisation du soutien scolaire sans jargon.",
    competency: "Communiquer efficacement avec les parents en arabe et en français.",
    promptLanguage: "bilingual",
    prompt: `Rôle : Enseignant d'école primaire publique à Mediouna.
Tâche : Rédige un court mot d'information bilingue (français simple + arabe) à coller dans le cahier de liaison pour inviter les parents à encourager 10 minutes de lecture à la maison chaque soir. Ton chaleureux et respectueux, sans termes techniques.`,
    draftOutputTitle: "Mot cahier de liaison bilingue",
    draftOutputBody: `Chers parents, afin d'aider votre enfant à progresser en lecture, nous vous invitons à partager avec lui/elle 10 minutes de lecture à voix haute chaque soir. Votre encouragement quotidien fait toute la différence. Merci pour votre collaboration.`,
    arabicSample: `أمهات وآباء التلاميذ الأعزاء، لدعم تقدم أبنائكم في القراءة، ندعوكم لتخصيص 10 دقائق يومياً بالمنزل للقراءة بصوت مسموع وتشجيعهم. مشاركتكم اليومية تصنع فرقاً كبيراً. شكراً لتعاونكم.`,
    teacherCheck:
      "Relire et adapter les horaires ou modalités propres à votre établissement avant impression.",
    printable: true,
  },
];

export const WEAK_VS_STRONG_PROMPT = {
  weak: {
    label: "Prompt faible (trop vague)",
    prompt: "Donne-moi un exercice de français pour le primaire.",
    issues: [
      "Aucun niveau précisé (1AEP ou 6AEP ?)",
      "Aucun objectif d'apprentissage ni compétence ciblée",
      "Ne tient pas compte de la classe (effectif, supports disponibles)",
      "Format flou : risque d'un texte trop long ou inadapté",
    ],
  },
  strong: {
    label: "Prompt fort (prêt pour la classe à Mediouna)",
    prompt: `Rôle : Enseignant expérimenté du primaire marocain.
Contexte : Classe de 4AEP à Mediouna, 36 élèves, vidéoprojecteur + cahiers, niveau hétérogène.
Objectif fourni : Identifier le sujet et le verbe dans une phrase simple au présent.
Compétence : Analyser et construire des phrases simples correctes.
Tâche : Crée 1 mini-texte de 5 phrases sur la vie scolaire puis 6 phrases d'application graduées en 3 niveaux (Base, Intermédiaire, Défi).
Contraintes : Vocabulaire simple, phrases de 6 à 9 mots maximum, aucune donnée personnelle, ton encourageant.
Format : Texte projetable + exercices en 3 blocs + corrigé enseignant à part.
Critères de qualité : Consignes brèves, pas d'ambiguïté grammaticale, prêt à relire et valider par l'enseignant.`,
    strengths: [
      "Niveau (4AEP) et réalité matérielle explicites",
      "Objectif d'apprentissage et compétence fournis par l'enseignant",
      "Différenciation claire en 3 niveaux (Base / Intermédiaire / Défi)",
      "Format directement projetable ou imprimable + mention de validation",
    ],
  },
};

export const META_PROMPT_EXAMPLES = {
  fr: {
    title: "Exemple en Français (Méta-Prompt)",
    roughIdea:
      "Je veux préparer une activité de mathématiques sur les fractions pour mes élèves de 5AEP qui bloquent encore.",
    metaPrompt: `Tu es un conseiller pédagogique spécialisé dans l'enseignement primaire marocain.
Je veux créer une activité de remédiation sur les fractions simples pour une classe de 5AEP.
Avant de générer l'activité ou le code :
1. Identifie les informations manquantes dans ma demande (niveau réel des élèves, équipement en classe, durée, format souhaité).
2. Pose-moi 5 questions courtes et précises.
3. Attends mes réponses avant de proposer un plan d'activité ou un prototype prêt à tester.`,
  },
  ar: {
    title: "نموذج باللغة العربية (Méta-Prompt)",
    roughIdea:
      "أريد إعداد نشاط قرائي تفاعلي لتلاميذ المستوى الثاني ابتدائي الذين يخلطون بين بعض الحروف المتشابهة.",
    metaPrompt: `أنت خبير بيداغوجي في التعليم الابتدائي المغربي.
أريد تصميم نشاط علاجي تفاعلي للقراءة لتلاميذ المستوى الثاني ابتدائي (2AEP).
قبل أن تنتج المحتوى أو الكود:
1. حدد المعلومات الناقصة في طلبي (الحروف المستهدفة، مستوى التلاميذ الفعلي، الوسائل المتوفرة في القسم: سبورة، مسلاط عاكس، أو أوراق مطبوعة).
2. اطرح عليّ 5 أسئلة دقيقة ومختصرة.
3. انتظر إجاباتي ثم اقترح نسخة أولية بسيطة ومناسبة لقسمي لمراجعتها وتجريبها.`,
  },
};

export const DEMO_QUIZ_QUESTIONS = [
  {
    id: "dq1",
    question: "Pourquoi Karim et sa sœur Salma se lèvent-ils tôt le samedi matin ?",
    options: [
      "Pour partir en voyage à Agadir",
      "Pour aider leur grand-père à préparer des plants au jardin de l'école",
      "Pour passer un examen de mathématiques",
    ],
    correctIndex: 1,
    explanation:
      "Dans le deuxième phrase du texte : ils retrouvent l'association et le jardinier pour planter des menthes et des oliviers dans la cour de l'école.",
  },
  {
    id: "dq2",
    question: "Que prennent-ils dans leur petit panier avant de partir ?",
    options: [
      "Des cahiers, des règles et des dictionnaires",
      "Deux arrosoirs légers et des étiquettes écrites en arabe et en français",
      "Un ordinateur portable et une caméra",
    ],
    correctIndex: 1,
    explanation:
      "Le texte mentionne explicitement deux petits arrosoirs et des étiquettes bilingues pour identifier chaque plante.",
  },
  {
    id: "dq3",
    question: "Quel mot du texte a le même sens que « arroser doucement » ?",
    options: ["Verser en pluie fine", "Courir rapidement", "Couper les feuilles"],
    correctIndex: 0,
    explanation:
      "« Verser en pluie fine » décrit un arrosage délicat qui n'abîme pas les jeunes pousses.",
  },
  {
    id: "dq4",
    question: "Combien d'espèces différentes ont-ils plantées avec leurs camarades ?",
    options: ["Deux espèces", "Trois espèces (menthe, basilic et un jeune olivier)", "Dix espèces"],
    correctIndex: 1,
    explanation:
      "Le paragraphe cite trois variétés : la menthe verte, le basilic et un jeune olivier.",
  },
  {
    id: "dq5",
    question: "Quelle est l'idée principale de ce texte ?",
    options: [
      "La coopération des élèves pour embellir et prendre soin de l'école",
      "La recette traditionnelle du thé à la menthe",
      "Une histoire fantastique dans l'espace",
    ],
    correctIndex: 0,
    explanation:
      "Tout le texte met en valeur l'entraide, l'observation du vivant et la fierté partagée à l'école.",
  },
];

export const DEMO_QUIZ_TEXT = {
  title: "Un samedi matin au jardin de l'école",
  grade: "4AEP · Compréhension de l'écrit",
  paragraphs: [
    "Ce samedi matin, le soleil brille doucement sur la cour de l'école à Mediouna. Karim et sa sœur Salma arrivent tôt avec deux arrosoirs légers et des étiquettes préparées en arabe et en français.",
    "Avec leurs camarades et leur enseignante, ils retrouvent le jardinier pour planter trois variétés : de la menthe verte, du basilic et un jeune olivier. Salma creuse avec précaution pendant que Karim verse l'eau en pluie fine pour ne pas abîmer les racines.",
    "À midi, chaque classe accroche son étiquette bilingue et s'engage à arroser le carré vert toute la semaine. Tous repartent fiers d'avoir transformé un coin de terre en petite classe de sciences à ciel ouvert.",
  ],
  sourcePrompt: `Rôle : Enseignant de 4AEP au Maroc.
Objectif : Évaluer la compréhension littérale et inférentielle d'un court récit.
Tâche : Crée une mini-application HTML/CSS/JS autonome (utilisable hors ligne au vidéoprojecteur) affichant un texte de 3 courts paragraphes sur la vie scolaire au Maroc, suivi de 5 QCM avec correction immédiate, explication pédagogique, score final et bouton « Recommencer ».
Contraintes : Grande lisibilité (tableau/projecteur), zéro compte élève, zéro appel réseau externe.`,
};
