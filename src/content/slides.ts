import type { SlideDefinition } from "./types";

export const SLIDES: SlideDefinition[] = [
  // SECTION 1 (0-5 min)
  {
    id: "s01-welcome",
    sectionNumber: 1,
    sectionTitle: "1. Introduction",
    timeRange: "0 – 2 min",
    durationMinutes: 2,
    title: "De l'IA à la création pédagogique",
    subtitle:
      "Atelier collaboratif d'échange entre collègues du primaire · Province de Mediouna · Centre de Digitalisation",
    kind: "welcome",
    keyPoints: [
      "Bienvenue chers collègues de la Province de Mediouna (1AEP–6AEP)",
      "Une rencontre entre pairs pour partager des pratiques concrètes",
      "Connectez votre téléphone ou ordinateur avec le code PIN de l'atelier",
    ],
    darijaNote: {
      title: "ترحيب بالزميلات والزملاء",
      arabic:
        "مرحبا بكم الزميلات والزملاء ديال إقليم مديونة. هاد اللقاء ماشي درس تقليدي، هو فضاء ديال التقاسم باش نكتاشفو كيفاش نخرجو من مجرد استعمال الذكاء الاصطناعي إلى صناعة أدوات رقمية بسيطة تنفعنا في القسم.",
    },
    techTerms: [
      {
        term: "AI Teacher Lab",
        explanation: "Notre espace interactif en direct pour tester, voter et co-construire.",
      },
    ],
    presenterNotes: {
      durationCue: "0:00 – 2:00",
      script:
        "Bonjour et bienvenue à toutes et à tous, chers collègues de la province de Mediouna. Je tiens à remercier le Directeur du Centre de Digitalisation pour sa confiance. Je suis enseignant au primaire public comme vous, et aujourd'hui nous sommes réunis entre pairs pour partager ce que j'ai testé concrètement en classe avec l'IA générative. Prenez votre téléphone ou votre ordinateur, scannez le QR code à l'écran ou allez sur le lien /join avec le code PIN affiché.",
      classroomExample:
        "Montrer en direct le compteur d'enseignants connectés qui augmente au fur et à mesure que la salle rejoint.",
      transition:
        "Une fois que la majorité de la salle est connectée, passons au cœur de notre intention pour ces deux heures.",
    },
  },
  {
    id: "s01-vision",
    sectionNumber: 1,
    sectionTitle: "1. Introduction",
    timeRange: "2 – 5 min",
    durationMinutes: 3,
    title: "Devenir créateurs de solutions pédagogiques",
    subtitle:
      "Passer du rôle de simple consommateur d'outils à celui d'enseignant concepteur adapté aux réalités de Mediouna",
    kind: "vision",
    keyPoints: [
      "L'IA générative comme assistant de préparation, jamais comme remplaçant de l'enseignant",
      "Adapter chaque ressource aux réalités réelles : effectifs, projecteur unique, papier ou hors ligne",
      "Objectif final : amorcer notre Galerie Collaborative Provinciale d'applications de Mediouna",
    ],
    darijaNote: {
      title: "الفكرة الأساسية",
      arabic:
        "الأستاذ(ة) كيبقى هو المايسترو في القسم. الذكاء الاصطناعي كيعاونّا نربحو الوقت، ولكن حنا اللي كنعرفو مستوى تلاميذنا في مديونة والوسائل اللي متوفرة عندنا.",
    },
    techTerms: [
      {
        term: "Prototype",
        explanation: "Une première version fonctionnelle simple d'une application, testable dès demain.",
      },
    ],
    presenterNotes: {
      durationCue: "2:00 – 5:00",
      script:
        "Notre ambition en 2 heures n'est pas de devenir informaticiens. Elle est double : d'abord, mieux formuler nos demandes pour obtenir des brouillons pédagogiques vraiment utiles en arabe, en français et en mathématiques (1AEP à 6AEP) ; ensuite, découvrir comment transformer une idée de classe en petite application web légère utilisable même avec une connexion instable ou un simple vidéoprojecteur.",
      classroomExample:
        "Citer le cas concret d'une classe de 36 élèves avec un seul projecteur et des ardoises : pas besoin de 36 tablettes pour rendre une séance interactive.",
      transition:
        "Avant de parler d'outils, partons de votre quotidien : qu'est-ce qui vous prend le plus d'énergie aujourd'hui ?",
    },
  },

  // SECTION 2 (5-12 min)
  {
    id: "s02-needs-poll",
    sectionNumber: 2,
    sectionTitle: "2. Besoins des enseignants",
    timeRange: "5 – 12 min",
    durationMinutes: 7,
    title: "Identifier nos priorités sur le terrain",
    subtitle: "Sondage en direct auprès des collègues présents dans la salle",
    kind: "poll",
    activityKey: "poll-needs",
    keyPoints: [
      "Quelle tâche pèse le plus lourd dans votre semaine d'enseignement ?",
      "Les résultats s'affichent en temps réel pour orienter nos exemples suivants",
    ],
    darijaNote: {
      title: "سؤال مباشر للجميع",
      arabic:
        "اختارو فالتيليفون ديالكم شنو الحاجة اللي كتشد ليكم أكبر وقت فالأسبوع. النتيجة غادي تبان مباشرة قدّامنا باش نركزو عليها.",
    },
    techTerms: [
      {
        term: "Live Poll",
        explanation: "Sondage synchrone dont les résultats agrégés se mettent à jour instantanément.",
      },
    ],
    presenterNotes: {
      durationCue: "5:00 – 12:00",
      script:
        "Chers collègues, ouvrez l'activité sur votre écran et choisissez l'aspect qui vous demande le plus de temps ou d'effort aujourd'hui. Je lance le sondage maintenant. Regardons ensemble ce qui ressort en priorité dans notre groupe de Mediouna : préparation, différenciation, évaluation, correction, administratif ou création d'activités interactives.",
      classroomExample:
        "Commenter les deux barres les plus hautes du graphique Recharts et souligner pourquoi la différenciation dans des classes hétérogènes revient souvent en tête.",
      transition:
        "Maintenant que nos besoins sont posés, voyons clairement ce qu'est l'IA générative et comment elle fonctionne sans jargon inutile.",
    },
  },

  // SECTION 3 (12-22 min)
  {
    id: "s03-concepts",
    sectionNumber: 3,
    sectionTitle: "3. Comprendre l'IA générative",
    timeRange: "12 – 17 min",
    durationMinutes: 5,
    title: "5 notions clés expliquées simplement",
    subtitle: "Sans théorie compliquée : des repères visuels pour comprendre ce qui se passe derrière l'écran",
    kind: "concepts",
    keyPoints: [
      "AI (Intelligence Artificielle) : domaine général de systèmes capables d'exécuter des tâches complexes",
      "Generative AI : branche de l'IA qui produit du nouveau contenu (texte, code, exercices)",
      "LLM (Large Language Model) : moteur statistique qui prédit les mots les plus probables",
      "Prompt : l'instruction précise que vous donnez à l'outil",
      "Hallucination : erreur affirmée avec assurance — d'où la validation obligatoire par l'enseignant",
    ],
    darijaNote: {
      title: "تبسيط المفاهيم",
      arabic:
        "الـ LLM ماشي موسوعة فيها حقائق مضمونة، هو بحال مساعد قرا بزاف ديال النصوص وكيخمن الكلمة المناسبة اللي جاية من بعد. يقدر يعطينا فكرة زوينة، ويقدر يألف معلومة غلط (Hallucination)، داكشي علاش خاصنا ديما نراجعو.",
    },
    techTerms: [
      { term: "LLM", explanation: "Large Language Model — modèle entraîné sur de vastes corpus textuels." },
      { term: "Prompt", explanation: "Consigne rédigée par l'utilisateur pour guider la génération." },
      { term: "Hallucination", explanation: "Production plausible dans la forme mais fausse dans le fond." },
    ],
    presenterNotes: {
      durationCue: "12:00 – 17:00",
      script:
        "Pas besoin de formules mathématiques pour comprendre un LLM. Imaginez une fonction d'auto-complétion géante qui a lu des milliards de phrases en français, en arabe et dans d'autres langues. Quand vous lui envoyez un Prompt, elle calcule la suite la plus probable. C'est pour cela qu'elle rédige très vite, mais c'est aussi pour cela qu'elle peut inventer une règle ou une date avec beaucoup d'aplomb : c'est une hallucination.",
      classroomExample:
        "Donner l'exemple d'une IA qui cite un numéro de page inventé d'un manuel marocain si on ne lui fournit pas l'extrait soi-même.",
      transition:
        "Vérifions tout de suite ces 5 repères avec un mini-quiz de 5 questions sur vos téléphones.",
    },
  },
  {
    id: "s03-quiz",
    sectionNumber: 3,
    sectionTitle: "3. Comprendre l'IA générative",
    timeRange: "17 – 22 min",
    durationMinutes: 5,
    title: "Quiz express : 5 repères sur les LLM",
    subtitle: "Répondez sur votre appareil puis observons les réponses et explications ensemble",
    kind: "quiz",
    activityKey: "quiz-genai",
    keyPoints: [
      "5 questions à choix multiples",
      "Rétroaction pédagogique affichée dès que nous révélons les réponses",
    ],
    darijaNote: {
      title: "تثبيت الفهم",
      arabic:
        "هاد 5 أسئلة غير باش نثبتو المفاهيم بيناتنا، ما كاين لا نقطة لا امتحان. من بعد غادي نكشفو التصحيح ونناقشوه مجموعين.",
    },
    techTerms: [
      { term: "Token", explanation: "Fragment de mot traité par le modèle lors de la prédiction." },
    ],
    presenterNotes: {
      durationCue: "17:00 – 22:00",
      script:
        "Ouvrons ce petit quiz de 5 questions pour fixer les idées. Prenez 2 à 3 minutes pour répondre tranquillement sur votre téléphone. Ensuite, je cliquerai sur « Révéler les réponses » pour afficher le pourcentage de réussite et commenter ensemble les explications.",
      classroomExample:
        "Insister lors du Reveal sur la question 4 : tout texte généré est un brouillon à valider par l'enseignant.",
      transition:
        "Maintenant que la mécanique est claire, entrons dans du très concret : 8 cas d'usage quotidiens du CP à la 6e année primaire (1AEP–6AEP).",
    },
  },

  // SECTION 4 (22-32 min)
  {
    id: "s04-use-cases",
    sectionNumber: 4,
    sectionTitle: "4. Cas d'usage concrets (1AEP–6AEP)",
    timeRange: "22 – 32 min",
    durationMinutes: 10,
    title: "Exemples réels pour le primaire marocain",
    subtitle:
      "Fiches, 3 niveaux (logique TaRL), lecture AR/FR, décomposition, remédiation et fiches imprimables",
    kind: "use-cases",
    keyPoints: [
      "Toujours fournir vous-même l'objectif, le niveau (1AEP–6AEP) et l'extrait si nécessaire",
      "Ne jamais revendiquer une conformité officielle automatique sans vérification",
      "Tout contenu généré est affiché comme « Brouillon à relire et valider »",
    ],
    darijaNote: {
      title: "أمثلة من واقع القسم",
      arabic:
        "تقدرو تصفحو هاد 8 ديال النماذج مباشرة فالتيليفون وتنسخو الـ Prompt. مهم بزاف نذكرو: أي نص كيعطيه الذكاء الاصطناعي راه غير مسودة (Brouillon) خاصنا نقراوها ونعدلوها على حساب تلاميذنا.",
    },
    techTerms: [
      {
        term: "TaRL (Teaching at the Right Level)",
        explanation:
          "Principe pédagogique consistant à adapter l'activité au niveau réel observé de l'élève plutôt qu'au seul niveau théorique.",
      },
    ],
    presenterNotes: {
      durationCue: "22:00 – 32:00",
      script:
        "Voici 8 situations concrètes tirées du primaire public marocain. Regardez comment, à chaque fois, c'est l'enseignant qui donne l'objectif d'apprentissage ou l'extrait du manuel : fiche de séance en 4AEP, 3 parcours gradués en calcul (inspirés du principe TaRL, quel que soit votre établissement), lecture arabe voyellée RTL en 2AEP, vocabulaire bilingue, décomposition C/D/U, remédiation sur confusions de sons, diagnostic fractions imprimable A4 et mot bilingue pour les parents.",
      classroomExample:
        "Ouvrir l'onglet 2 (3 niveaux) et l'onglet 3 (Lecture arabe RTL) pour montrer la qualité de mise en forme et l'avertissement de validation.",
      transition:
        "Puisque ces brouillons sont si rapides à produire, quelles précautions devons-nous garder à l'esprit avant de les amener en classe ?",
    },
  },

  // SECTION 5 (32-40 min)
  {
    id: "s05-pillars",
    sectionNumber: 5,
    sectionTitle: "5. IA responsable en classe",
    timeRange: "32 – 36 min",
    durationMinutes: 4,
    title: "6 garde-fous pour protéger nos élèves et notre métier",
    subtitle: "L'IA assiste l'enseignant ; elle ne remplace jamais le jugement professionnel",
    kind: "pillars",
    keyPoints: [
      "1. Hallucinations : vérifier systématiquement faits, calculs et voyellation arabe",
      "2. Validation pédagogique : contrôler l'adaptation à l'âge et au vécu des élèves",
      "3. Biais & stéréotypes : relire les prénoms, contextes familiaux et exemples culturels",
      "4. Confidentialité absolue : zéro nom d'élève, code Massar ou donnée personnelle",
      "5. Réalité matérielle : privilégier le léger, le projetable et l'imprimable",
      "6. Responsabilité : l'enseignant reste seul garant de la qualité didactique",
    ],
    darijaNote: {
      title: "أمان المعطيات والمسؤولية",
      arabic:
        "عمرنا ما ندخلو سميات التلاميذ أو مسار أو أي معلومات شخصية فشي موقع ذكاء اصطناعي. ديما نخدمو بأمثلة مجهولة (تلميذ أ، مجموعة 1) ونراجعو كل محتوى قبل ما يوصل للتلميذ.",
    },
    techTerms: [
      {
        term: "Privacy by Design",
        explanation: "Concevoir des outils qui ne collectent aucune donnée personnelle dès le départ.",
      },
    ],
    presenterNotes: {
      durationCue: "32:00 – 36:00",
      script:
        "Avant de passer à la pratique, posons 6 règles d'or non négociables dans nos écoles. La plus importante concerne la vie privée : jamais de noms d'élèves, ni de notes nominatives, ni de codes Massar dans un prompt. Deuxièmement, l'IA ne connaît pas le programme officiel marocain par magie : ne lui demandez pas de certifier la conformité, donnez-lui votre objectif exact et validez ensuite.",
      classroomExample:
        "Montrer comment remplacer « Rédige une appréciation pour Youssef B., 12/20, parents divorcés » par « Propose 3 formulations encourageantes pour un élève qui progresse en lecture orale ».",
      transition:
        "Testons votre réflexe sur 5 situations rapides Vrai ou Faux.",
    },
  },
  {
    id: "s05-true-false",
    sectionNumber: 5,
    sectionTitle: "5. IA responsable en classe",
    timeRange: "36 – 40 min",
    durationMinutes: 4,
    title: "Vrai ou Faux : Réflexes en école primaire",
    subtitle: "5 scénarios concrets pour ancrer les bonnes pratiques",
    kind: "quiz",
    activityKey: "quiz-responsible",
    keyPoints: [
      "5 affirmations rapides Vrai / Faux",
      "Discussion brève après révélation des explications",
    ],
    darijaNote: {
      title: "صحيح أم خطأ؟",
      arabic:
        "5 وضعيات سريعة من الحياة المدرسية: واش هاد التصرف صحيح ولا فيه مخاطرة على التلاميذ أو الجودة البيداغوجية؟",
    },
    techTerms: [
      { term: "Bias", explanation: "Tendance d'un modèle à reproduire des stéréotypes ou modèles culturels éloignés." },
    ],
    presenterNotes: {
      durationCue: "36:00 – 40:00",
      script:
        "Prenez 2 minutes pour répondre aux 5 affirmations Vrai ou Faux sur vos téléphones. Regardons ensuite les résultats et assurons-nous que tout le groupe est aligné sur la confidentialité et la vérification.",
      classroomExample:
        "Insister sur TF3 : ne jamais supposer qu'un outil connaît le programme marocain sans lui fournir la compétence ou l'extrait.",
      transition:
        "Nous savons maintenant quoi éviter. Apprenons à écrire des prompts vraiment efficaces dès le premier essai.",
    },
  },

  // SECTION 6 (40-54 min)
  {
    id: "s06-anatomy",
    sectionNumber: 6,
    sectionTitle: "6. Prompt Engineering",
    timeRange: "40 – 46 min",
    durationMinutes: 6,
    title: "Les 8 briques d'un Prompt pédagogique solide",
    subtitle: "Pourquoi un prompt précis transforme un brouillon vague en support exploitable",
    kind: "prompt-anatomy",
    keyPoints: [
      "Rôle · Contexte de classe · Tâche · Public (1AEP–6AEP)",
      "Objectif & compétence fournis · Contraintes matérielles · Format · Critères de qualité",
      "Comparaison directe : Prompt faible vs Prompt fort adapté au primaire marocain",
    ],
    darijaNote: {
      title: "مكونات الطلب الجيد",
      arabic:
        "إلى عطيتي سؤال عام بحال «عطيني تمرين»، النتيجة كتجي عامة. ولكن إلى حددتي المستوى، الهدف اللي بغيتي، مستوى التلاميذ والوسائل اللي عندك، كتربح بزاف ديال الوقت.",
    },
    techTerms: [
      { term: "Prompt Engineering", explanation: "L'art de structurer une consigne claire, contextuelle et vérifiable." },
    ],
    presenterNotes: {
      durationCue: "40:00 – 46:00",
      script:
        "Regardez la différence entre « Donne-moi un exercice de français » et notre prompt structuré en 8 briques. Plus vous précisez votre classe de Mediouna — effectif, niveau réel, objectif d'apprentissage, support projetable ou imprimable — moins vous avez de retouches à faire ensuite.",
      classroomExample:
        "Comparer côte à côte le prompt faible et le prompt fort 4AEP à l'écran.",
      transition:
        "À vous maintenant de construire un vrai prompt pour votre classe grâce au Prompt Builder interactif.",
    },
  },
  {
    id: "s06-builder",
    sectionNumber: 6,
    sectionTitle: "6. Prompt Engineering",
    timeRange: "46 – 54 min",
    durationMinutes: 8,
    title: "Atelier pratique : Votre Prompt Builder",
    subtitle:
      "Sélectionnez votre niveau (1AEP–6AEP), votre objectif et assemblez un prompt prêt à copier",
    kind: "prompt-builder",
    activityKey: "builder-prompt",
    keyPoints: [
      "Remplissez niveau, discipline, objectif, compétence, extrait (optionnel) et difficulté",
      "Copiez le prompt assemblé et partagez votre proposition avec la salle",
    ],
    darijaNote: {
      title: "تطبيق عملي مباشر",
      arabic:
        "عمّرو الخانات على حساب القسم والمادة ديالكم، غادي يتجمع ليكم Prompt مقاد جاهز للنسخ، وتقدرو تشاركوه باش يبان عند الزملاء على الشاشة.",
    },
    techTerms: [
      { term: "Output Format", explanation: "Structure exacte demandée (tableau, QCM, fiche A4, HTML)." },
    ],
    presenterNotes: {
      durationCue: "46:00 – 54:00",
      script:
        "Chers collègues, prenez 5 minutes pour remplir le Prompt Builder sur votre appareil avec une vraie leçon que vous préparez cette semaine : choisissez 1AEP à 6AEP, votre matière, votre objectif et la difficulté souhaitée. Cliquez sur « Assembler et envoyer » : votre prompt apparaît prêt à copier, et quelques exemples anonymisés s'affichent sur le projecteur pour qu'on s'inspire les uns des autres.",
      classroomExample:
        "Lire à voix haute 2 prompts partagés par des collègues dans le flux anonymisé.",
      transition:
        "Et si parfois vous ne savez même pas par où commencer pour décrire toutes ces contraintes ? Il existe une technique encore plus simple : le Méta-Prompting.",
    },
  },

  // SECTION 7 (54-64 min)
  {
    id: "s07-workflow",
    sectionNumber: 7,
    sectionTitle: "7. Le Méta-Prompting",
    timeRange: "54 – 59 min",
    durationMinutes: 5,
    title: "Demander à l'IA d'améliorer votre consigne d'abord",
    subtitle: "Idée brute → Manques → Questions de clarification → Prompt optimisé → Exécution → Validation",
    kind: "meta-prompt-flow",
    keyPoints: [
      "Ne rédigez plus seul un long prompt complexe dès le début",
      "Inversez les rôles : demandez à l'IA de vous poser 5 questions ciblées avant de produire",
      "Exemples complets prêts à copier en Français et en Arabe (RTL)",
    ],
    darijaNote: {
      title: "شنو هو الـ Méta-Prompting؟",
      arabic:
        "بدل ما تعصر راسك باش تكتب طلب طويل من الأول، قول للذكاء الاصطناعي: «بغيت نصاوب هاد النشاط، ولكن قبل ما تبدا، سولني 5 أسئلة على قسمي ومستوى التلاميذ». هو كيعاونك تبني الطلب المثالي.",
    },
    techTerms: [
      { term: "Meta-Prompting", explanation: "Utiliser l'IA pour co-concevoir et affiner l'instruction avant l'exécution." },
    ],
    presenterNotes: {
      durationCue: "54:00 – 59:00",
      script:
        "C'est sans doute la technique la plus libératrice pour les enseignants occupés. Quand vous avez juste une idée brute — par exemple « Je veux travailler les fractions avec mes 5AEP en difficulté » — demandez à l'IA d'identifier ce qu'il manque et de vous poser 5 questions courtes. En 30 secondes de réponses, le résultat devient dix fois plus juste.",
      classroomExample:
        "Montrer les deux cartes copiables en français et en arabe (RTL) sur l'écran.",
      transition:
        "Essayons tout de suite sur votre propre idée de classe.",
    },
  },
  {
    id: "s07-exercise",
    sectionNumber: 7,
    sectionTitle: "7. Le Méta-Prompting",
    timeRange: "59 – 64 min",
    durationMinutes: 5,
    title: "Exercice pratique : Transformez une idée brute",
    subtitle: "Générez votre méta-prompt en français ou en arabe et testez la démarche",
    kind: "meta-prompt-exercise",
    activityKey: "exercise-metaprompt",
    keyPoints: [
      "Saisissez une idée rapide de votre classe (1 à 2 phrases)",
      "Choisissez Français ou Arabe pour obtenir un méta-prompt prêt à l'emploi",
    ],
    darijaNote: {
      title: "جرب دابا فدقيقتين",
      arabic:
        "كتب غير فكرة بسيطة فسطر أو سطرين، واختار العربية أو الفرنسية. الأداة غادي تصاوب ليك Meta-Prompt واجد تقدر تستعملو هاد السيمانة.",
    },
    techTerms: [
      { term: "Clarification Loop", explanation: "Aller-retour rapide qui élimine les suppositions erronées de l'IA." },
    ],
    presenterNotes: {
      durationCue: "59:00 – 64:00",
      script:
        "Prenez 3 minutes pour écrire une idée brute de leçon ou de remédiation sur votre téléphone, en français ou en arabe, puis envoyez votre méta-prompt. Regardons la répartition des langues et quelques idées proposées par nos collègues.",
      classroomExample:
        "Commenter un exemple en arabe et un exemple en français affichés à l'écran.",
      transition:
        "Jusqu'ici, nous avons produit du texte et des fiches. Passons maintenant au niveau supérieur : créer de véritables petites applications pédagogiques.",
    },
  },

  // SECTION 8 (64-74 min)
  {
    id: "s08-web-trio",
    sectionNumber: 8,
    sectionTitle: "8. Créer une application avec l'IA",
    timeRange: "64 – 69 min",
    durationMinutes: 5,
    title: "HTML, CSS et JavaScript : le trio du navigateur",
    subtitle: "Comprendre visuellement comment une simple page web devient un outil de classe interactif",
    kind: "web-trio",
    keyPoints: [
      "HTML : la structure et le contenu (titre, question, boutons)",
      "CSS : la présentation et la lisibilité (grandes polices pour projecteur, mode RTL, impression A4)",
      "JavaScript : l'interactivité (vérifier la réponse, afficher le score, recommencer)",
    ],
    darijaNote: {
      title: "الفرق بين HTML و CSS و JS",
      arabic:
        "تخيلو القسم: الـ HTML هو البناية والسبورة والطاولات (المحتوى)، الـ CSS هو الصباغة والتنظيم والخط الواضح، والـ JavaScript هو الحركة والتفاعل ملي كتبرك على شي زر وكيحسب النتيجة.",
    },
    techTerms: [
      { term: "HTML / CSS / JS", explanation: "Les 3 langages standards lus gratuitement par tout navigateur, même hors ligne." },
    ],
    presenterNotes: {
      durationCue: "64:00 – 69:00",
      script:
        "Nul besoin d'apprendre à coder pendant des années. Une mini-application web tient souvent dans un seul fichier HTML/CSS/JavaScript que n'importe quel navigateur ouvre sans connexion Internet. Regardez notre démonstrateur interactif : je désactive le CSS, l'aspect redevient brut ; je désactive le JavaScript, les boutons ne réagissent plus.",
      classroomExample:
        "Cliquer tour à tour sur les interrupteurs HTML / CSS / JavaScript pour montrer l'effet immédiat devant la salle.",
      transition:
        "Clarifions maintenant une confusion fréquente entre outils de discussion, outils de création et vraie application déployée.",
    },
  },
  {
    id: "s08-ecosystem",
    sectionNumber: 8,
    sectionTitle: "8. Créer une application avec l'IA",
    timeRange: "69 – 74 min",
    durationMinutes: 5,
    title: "De l'idée à la classe : repères et 4 étapes clés",
    subtitle: "Distinguer ChatGPT, Google Antigravity, Web App, Prototype et Application déployée",
    kind: "ecosystem",
    keyPoints: [
      "1. Générer du contenu (texte/exercice) ≠ 2. Créer une app interactive ≠ 3. Utiliser en vraie classe ≠ 4. Évaluer l'impact réel sur les élèves",
      "ChatGPT : conversation et brouillons / Google Antigravity : studio d'ingénierie pour assembler et vérifier une vraie app",
      "Priorités Mediouna : léger, responsive, projetable, imprimable et utilisable hors ligne sans compte élève",
    ],
    darijaNote: {
      title: "4 مراحل مهمة",
      arabic:
        "كاين فرق كبير بين: 1) نصاوب نص بالذكاء الاصطناعي، 2) نصاوب تطبيق تفاعلي، 3) نخدم بيه وسط التلاميذ في القسم، و 4) نسول راسي واش فعلاً عاونهم يتعلمو.",
    },
    techTerms: [
      { term: "Web App", explanation: "Application accessible directement dans Chrome/Edge/Safari sans installation." },
      { term: "Deployed App", explanation: "Application publiée sur une URL publique (ex. Vercel) partageable par lien ou QR." },
    ],
    presenterNotes: {
      durationCue: "69:00 – 74:00",
      script:
        "Attention à ne pas confondre quatre réalités : générer un exercice en texte, créer une application interactive, l'utiliser avec de vrais élèves dans une classe de 35 personnes, et enfin vérifier si cet outil améliore vraiment l'apprentissage. À Mediouna, nos meilleures applications sont souvent les plus sobres : ouvrables en un clic au projecteur, sans compte élève, et avec une fiche imprimable en renfort.",
      classroomExample:
        "Montrer le tableau comparatif ChatGPT / Google Antigravity / Prototype HTML / App déployée.",
      transition:
        "Voyons tout de suite à quoi ressemble un prototype fonctionnel en action.",
    },
  },

  // SECTION 9 (74-82 min)
  {
    id: "s09-live-demo",
    sectionNumber: 9,
    sectionTitle: "9. Démonstration en direct",
    timeRange: "74 – 82 min",
    durationMinutes: 8,
    title: "Démonstration : Du Prompt au Prototype fonctionnel",
    subtitle: "Une mini-application de lecture & compréhension 4AEP entièrement fonctionnelle hors ligne",
    kind: "live-demo",
    keyPoints: [
      "Texte court contextualisé + 5 questions à choix multiples",
      "Feedback automatique explicatif + score final + bouton « Recommencer »",
      "Inspectez le prompt exact qui a permis de générer ce prototype",
    ],
    darijaNote: {
      title: "تطبيق حي قدامكم",
      arabic:
        "هاد التطبيق الصغير ديال القراءة والفهم خدام بدون أنترنيت أو حسابات للتلاميذ. تقدرو تجربوه فالتيليفون ديالكم وتشوفو الـ Prompt اللي تصاوب بيه.",
    },
    techTerms: [
      { term: "Prompt-to-Prototype", explanation: "Boucle itérative où l'on décrit le besoin pédagogique puis on teste et affine l'outil." },
    ],
    presenterNotes: {
      durationCue: "74:00 – 82:00",
      script:
        "Voici concrètement ce qu'un enseignant peut obtenir à partir d'un seul prompt bien structuré : une application de compréhension de lecture 4AEP. Testons-la ensemble sur le projecteur — faisons exprès une erreur sur une question pour voir le feedback pédagogique bienveillant, puis affichons « Voir le prompt source ».",
      classroomExample:
        "Jouer les 5 questions avec la salle, puis ouvrir le tiroir « Prompt → Prototype » pour montrer la simplicité de la consigne.",
      transition:
        "Ce prototype n'est qu'un exemple parmi tant d'autres. Explorons maintenant notre Galerie de 12 catégories avant de lancer les ateliers en groupes !",
    },
  },

  // SECTION 10 (82-107 min)
  {
    id: "s10-gallery",
    sectionNumber: 10,
    sectionTitle: "10. Galerie & Atelier en groupes",
    timeRange: "82 – 90 min",
    durationMinutes: 8,
    title: "Galerie d'applications pour l'école primaire publique",
    subtitle: "12 catégories ancrées dans nos classes + mini-applications interactives prêtes à tester",
    kind: "gallery",
    keyPoints: [
      "12 scénarios concrets : alphabétisation arabe, lecture FR, flashcards AR/FR, abaque C/D/U, remédiation 3 parcours, fiches A4, groupes...",
      "Plusieurs démonstrateurs fonctionnels utilisables hors ligne et imprimables",
      "Extension future possible vers l'Amazigh (Tifinagh) selon les besoins",
    ],
    darijaNote: {
      title: "معرض أفكار وتطبيقات مديونة",
      arabic:
        "تقدرو تجربو هنا عدة تطبيقات صغيرة خدامة مباشرة بحال القراءة بالعربية، البطاقات المزدوجة، المكعبات الحسابية C/D/U، ومولد الأوراق القابلة للطباعة.",
    },
    techTerms: [
      { term: "Offline-First", explanation: "Fonctionne dans le navigateur une fois la page chargée, même si le réseau coupe." },
    ],
    presenterNotes: {
      durationCue: "82:00 – 90:00",
      script:
        "Prenez quelques minutes pour parcourir cette galerie de 12 catégories pensées pour le primaire public : alphabétisation arabe RTL, flashcards bilingues, abaque C/D/U, parcours de remédiation, fiche A4 imprimable, tirage de groupes sans données personnelles... Essayez-en au moins deux directement sur votre écran !",
      classroomExample:
        "Lancer brièvement la démo « Manipulations Mathématiques (C/D/U) » puis « Générateur de fiche A4 imprimable » au projecteur.",
      transition:
        "Passons maintenant au moment central de cet atelier : 25 minutes en 4 groupes de 5 collègues pour concevoir vos propres prototypes.",
    },
  },
  {
    id: "s10-projects",
    sectionNumber: 10,
    sectionTitle: "10. Galerie & Atelier en groupes",
    timeRange: "90 – 103 min",
    durationMinutes: 13,
    title: "Atelier en groupes (4 groupes × 5 collègues · 25 min)",
    subtitle: "Cahier des charges guidé, personnalisable par niveau/discipline, avec prompts FR/AR et checklists",
    kind: "group-projects",
    keyPoints: [
      "Groupe 1 : Lecture & Compréhension (FR ou AR) · 5 questions · feedback",
      "Groupe 2 : Mathématiques Interactives · décomposition · valeur positionnelle",
      "Groupe 3 : Remédiation 3 parcours (Base / Intermédiaire / Défi — logique TaRL)",
      "Groupe 4 : Évaluation formative (5 Q) · erreurs fréquentes · résumé imprimable",
    ],
    darijaNote: {
      title: "العمل في مجموعات (25 دقيقة)",
      arabic:
        "كل مجموعة فيها 5 أساتذة كتخدم على نموذج أولي واحد (Prototype). تقدرو تبدلو المستوى أو المادة كيف بغيتو، وتستعملو الـ Prompt الجاهز بالعربية أو الفرنسية مع لائحة التحقق.",
    },
    techTerms: [
      { term: "MVP Prototype", explanation: "Version essentielle testable en 25 minutes, sans chercher la perfection graphique." },
    ],
    presenterNotes: {
      durationCue: "90:00 – 103:00",
      script:
        "Formons nos 4 groupes de 5 collègues. Chaque groupe reçoit une mission claire, réaliste en 25 minutes : vous créez un prototype testable, pas un produit fini ! Vous pouvez personnaliser le niveau (1AEP–6AEP), la matière ou la compétence directement dans votre fiche projet pour copier le prompt FR ou AR adapté, puis suivre la checklist de test avant la démo.",
      classroomExample:
        "Circuler entre les 4 tables pour aider chaque groupe à garder un périmètre simple (1 texte ou 5 questions max, zéro compte élève).",
      transition:
        "Avant les présentations, votons pour le projet qui répond au besoin le plus urgent de votre école.",
    },
  },
  {
    id: "s10-vote",
    sectionNumber: 10,
    sectionTitle: "10. Galerie & Atelier en groupes",
    timeRange: "103 – 107 min",
    durationMinutes: 4,
    title: "Vote : Quel projet testeriez-vous dès lundi ?",
    subtitle: "Vote en direct sur les 4 projets d'applications pédagogiques",
    kind: "poll",
    activityKey: "vote-project",
    keyPoints: [
      "Choisissez le projet qui correspond le mieux au besoin prioritaire de votre classe",
      "Résultats agrégés en direct à l'écran",
    ],
    darijaNote: {
      title: "تصويت سريع",
      arabic:
        "صوتو على التطبيق اللي كتشوفوه غادي ينفع التلاميذ ديالكم أكثر ابتداءً من هاد الأسبوع.",
    },
    techTerms: [
      { term: "Peer Feedback", explanation: "Évaluation collégiale entre praticiens sur l'utilité réelle en classe." },
    ],
    presenterNotes: {
      durationCue: "103:00 – 107:00",
      script:
        "Pendant que les groupes finalisent leurs tests, votons en direct : parmi les 4 types d'applications, lequel répond le plus immédiatement au besoin de votre classe ?",
      classroomExample:
        "Commenter les résultats pour introduire le passage des 4 groupes.",
      transition:
        "Place maintenant au Showcase : chaque groupe dispose de 2 minutes pour montrer son idée et son prototype.",
    },
  },

  // SECTION 11 (107-117 min)
  {
    id: "s11-showcase-vote",
    sectionNumber: 11,
    sectionTitle: "11. Présentations & Showcase",
    timeRange: "107 – 117 min",
    durationMinutes: 10,
    title: "Showcase des groupes & Galerie Provinciale",
    subtitle:
      "Chaque groupe présente son prototype (2 min) · Votes anonymisés dans 3 catégories + dépôt Galerie de Mediouna",
    kind: "showcase-vote",
    activityKey: "vote-showcase",
    keyPoints: [
      "Application la plus utile · Meilleure idée pédagogique · Solution la plus créative",
      "Les votes sont agrégés sans exposer de scores individuels",
      "Enregistrez votre prototype dans la Galerie Collaborative Provinciale de Mediouna (zéro donnée élève)",
    ],
    darijaNote: {
      title: "تقديم المشاريع والتصويت",
      arabic:
        "كل مجموعة كتقدم الفكرة والتجربة ديالها. من بعد كنصوتو على التطبيق الأكثر فائدة، أحسن فكرة بيداغوجية، وأكثر حل إبداعي. وتقدرو تضيفو التطبيق فالمعرض التشاركي لمديونة.",
    },
    techTerms: [
      { term: "Provincial App Gallery", explanation: "Répertoire collaboratif entre collègues de Mediouna, avec déclaration de confidentialité." },
    ],
    presenterNotes: {
      durationCue: "107:00 – 117:00",
      script:
        "Chaque groupe présente en 2 minutes : quel problème de classe vous avez ciblé, ce que votre prototype permet déjà de faire, et ce que vous amélioreriez ensuite. Collègues, utilisez votre téléphone pour voter dans les 3 catégories, puis invitez un rapporteur de chaque groupe à publier la fiche de son prototype dans notre Galerie Collaborative de Mediouna.",
      classroomExample:
        "Rappeler la case obligatoire de confidentialité : zéro donnée personnelle d'élève collectée.",
      transition:
        "Pour clore ces deux heures ensemble, prenons deux minutes pour votre engagement personnel de la semaine.",
    },
  },

  // SECTION 12 (117-120 min)
  {
    id: "s12-exit-ticket",
    sectionNumber: 12,
    sectionTitle: "12. Conclusion & Engagement",
    timeRange: "117 – 119 min",
    durationMinutes: 2,
    title: "Ticket de sortie : Votre premier pas cette semaine",
    subtitle: "Quelle est une chose concrète que vous allez essayer avec l'IA dans votre classe cette semaine ?",
    kind: "exit-ticket",
    activityKey: "exit-ticket",
    keyPoints: [
      "Choisissez un domaine d'action et écrivez votre engagement en une phrase",
      "Le mur collectif anonymisé s'affiche en direct pour inspirer toute la salle",
    ],
    darijaNote: {
      title: "خطوة عملية هاد الأسبوع",
      arabic:
        "شنو هي حاجة وحدة بسيطة وملموسة اللي غادي تجربوها هاد الأسبوع مع التلاميذ أو فالتحضير ديالكم؟",
    },
    techTerms: [
      { term: "Exit Ticket", explanation: "Bilan rapide en fin de séance pour ancrer le passage à l'action." },
    ],
    presenterNotes: {
      durationCue: "117:00 – 119:00",
      script:
        "Chers collègues, avant de nous quitter, écrivez en une phrase la chose concrète que vous allez tester dès cette semaine dans votre école. Vos engagements apparaissent de façon anonyme sur le mur collectif.",
      classroomExample:
        "Lire à haute voix 3 engagements concrets affichés sur le mur.",
      transition:
        "Terminons sur notre message commun pour la province de Mediouna.",
    },
  },
  {
    id: "s12-closing",
    sectionNumber: 12,
    sectionTitle: "12. Conclusion & Engagement",
    timeRange: "119 – 120 min",
    durationMinutes: 1,
    title: "Ensemble, bâtissons nos propres outils pédagogiques",
    subtitle: "Merci pour votre engagement · Centre de Digitalisation · Province de Mediouna",
    kind: "closing",
    keyPoints: [
      "1. Identifier un problème pédagogique réel",
      "2. L'exprimer en spécification claire · 3. Prototyper · 4. Tester · 5. Améliorer · 6. Partager entre collègues",
    ],
    darijaNote: {
      title: "كلمة الختام",
      arabic:
        "تبارك الله عليكم الزميلات والزملاء. القوة الحقيقية كاينة فالتعاون بيناتنا: ملي كل أستاذ كيجرب فكرة وكيتقاسمها، المدرسة العمومية فمديونة كلها كتربح.",
    },
    techTerms: [
      { term: "Open Sharing", explanation: "Partager prototypes, prompts et retours d'expérience entre collègues." },
    ],
    presenterNotes: {
      durationCue: "119:00 – 120:00",
      script:
        "Merci chaleureusement à vous tous pour votre énergie, votre sens critique et votre créativité. N'oubliez pas que vous pouvez continuer à consulter la galerie et vos prompts. Et retenons ensemble cette conviction : « Ne soyez pas seulement utilisateurs du numérique. Devenez créateurs de solutions pédagogiques. »",
      classroomExample:
        "Laisser la citation finale affichée sur le vidéoprojecteur pendant les échanges informels de sortie.",
      transition:
        "Fin de l'atelier — penser à utiliser l'option « Supprimer les données des participants » après export/bilan si souhaité.",
    },
  },
];

export const TOTAL_SECTIONS = 12;

export function getSlideById(id: string | null | undefined): SlideDefinition {
  if (!id) return SLIDES[0];
  return SLIDES.find((s) => s.id === id) ?? SLIDES[0];
}

export function getSlideIndex(id: string): number {
  const idx = SLIDES.findIndex((s) => s.id === id);
  return idx >= 0 ? idx : 0;
}

export function getSectionList(): Array<{
  sectionNumber: number;
  title: string;
  timeRange: string;
  firstSlideId: string;
}> {
  const map = new Map<
    number,
    { sectionNumber: number; title: string; timeRange: string; firstSlideId: string }
  >();
  for (const slide of SLIDES) {
    if (!map.has(slide.sectionNumber)) {
      map.set(slide.sectionNumber, {
        sectionNumber: slide.sectionNumber,
        title: slide.sectionTitle,
        timeRange: slide.timeRange,
        firstSlideId: slide.id,
      });
    }
  }
  return Array.from(map.values());
}
