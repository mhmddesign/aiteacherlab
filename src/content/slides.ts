import { bi, type BilingualText, type SlideDefinition } from "./types";

export const SLIDES: SlideDefinition[] = [
  // SECTION 1 (0-5 min)
  {
    id: "s01-welcome",
    sectionNumber: 1,
    sectionTitle: bi("1. Introduction", "1. التقديم"),
    timeRange: bi("0 – 2 min", "0 – 2 د"),
    durationMinutes: 2,
    title: bi(
      "De l'IA à la création pédagogique",
      "من الذكاء الاصطناعي إلى الإبداع البيداغوجي"
    ),
    subtitle: bi(
      "Atelier collaboratif d'échange entre collègues du primaire · Province de Mediouna · Centre de Digitalisation",
      "ورشة تشاركية لتقاسم التجارب بين أستاذات وأساتذة الابتدائي · إقليم مديونة · مركز الرقمنة"
    ),
    kind: "welcome",
    keyPoints: [
      bi(
        "Bienvenue chers collègues de la Province de Mediouna (1AEP–6AEP)",
        "مرحباً بزميلاتنا وزملائنا بإقليم مديونة (المستويات 1AEP–6AEP)"
      ),
      bi(
        "Une rencontre entre pairs pour partager des pratiques concrètes",
        "لقاء بين الزملاء لتبادل الممارسات الميدانية الملموسة"
      ),
      bi(
        "Connectez votre téléphone ou ordinateur avec le code PIN de l'atelier",
        "اتصلوا عبر هواتفكم أو حواسيبكم باستعمال رمز PIN الخاص بالورشة"
      ),
    ],
    darijaNote: {
      title: bi("Mot d'accueil (Darija)", "ترحيب بالزميلات والزملاء (بالدارجة)"),
      fr: "Bienvenue chers collègues de Mediouna. Cette rencontre n'est pas un cours magistral : c'est un espace d'échange entre pairs pour passer de la simple utilisation de l'IA à la création d'outils utiles en classe.",
      arabic:
        "مرحبا بكم الزميلات والزملاء ديال إقليم مديونة. هاد اللقاء ماشي درس تقليدي، هو فضاء ديال التقاسم باش نكتاشفو كيفاش نخرجو من مجرد استعمال الذكاء الاصطناعي إلى صناعة أدوات رقمية بسيطة تنفعنا في القسم.",
    },
    techTerms: [
      {
        term: "AI Teacher Lab",
        explanation: bi(
          "Notre espace interactif en direct pour tester, voter et co-construire.",
          "فضاؤنا التفاعلي المباشر للتجريب والتصويت والبناء المشترك."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "0:00 – 2:00",
      script: bi(
        "Bonjour et bienvenue à toutes et à tous, chers collègues de la province de Mediouna. Je tiens à remercier le Directeur du Centre de Digitalisation pour sa confiance. Je suis enseignant au primaire public comme vous, et aujourd'hui nous sommes réunis entre pairs pour partager ce que j'ai testé concrètement en classe avec l'IA générative. Prenez votre téléphone ou votre ordinateur, scannez le QR code à l'écran ou allez sur /join avec le code PIN affiché.",
        "مرحباً بكم جميعاً زميلاتي وزملائي بإقليم مديونة. أشكر مدير مركز الرقمنة على ثقته. أنا أستاذ بالتعليم الابتدائي العمومي مثلكم، ونجتمع اليوم في لقاء تشاركي لتقاسم ما جربته فعلياً في القسم مع الذكاء الاصطناعي التوليدي. تفضلوا بمسح رمز QR أو الدخول إلى /join عبر رمز PIN المعروض."
      ),
      classroomExample: bi(
        "Montrer en direct le compteur d'enseignants connectés qui augmente au fur et à mesure que la salle rejoint.",
        "إبراز عداد الزملاء المتصلين وهو يرتفع مباشرة مع التحاق القاعة."
      ),
      transition: bi(
        "Une fois que la majorité de la salle est connectée, passons au cœur de notre intention pour ces deux heures.",
        "بعد التحاق أغلب الحاضرين، ننتقل إلى جوهر هدفنا في هذه الساعتين."
      ),
      discussionPrompt: bi(
        "Avez-vous déjà testé un outil d'IA pour préparer une séance ou un exercice ?",
        "هل سبق لكم تجربة أداة ذكاء اصطناعي لتحضير حصة أو تمرين؟"
      ),
    },
  },
  {
    id: "s01-vision",
    sectionNumber: 1,
    sectionTitle: bi("1. Introduction", "1. التقديم"),
    timeRange: bi("2 – 5 min", "2 – 5 د"),
    durationMinutes: 3,
    title: bi(
      "Devenir créateurs de solutions pédagogiques",
      "أن نصبح مبدعين لحلول بيداغوجية"
    ),
    subtitle: bi(
      "Passer du rôle de simple consommateur d'outils à celui d'enseignant concepteur adapté aux réalités de Mediouna",
      "الانتقال من مجرد مستهلك للأدوات الجاهزة إلى أستاذ(ة) مصمم(ة) لحلول تلائم واقع مديونة"
    ),
    kind: "vision",
    keyPoints: [
      bi(
        "L'IA générative comme assistant de préparation, jamais comme remplaçant de l'enseignant",
        "الذكاء الاصطناعي التوليدي مساعد في التحضير ولا يعوّض أبداً الأستاذ(ة)"
      ),
      bi(
        "Adapter chaque ressource aux réalités réelles : effectifs, projecteur unique, papier ou hors ligne",
        "تكييف كل مورد مع واقع القسم: الاكتظاظ، مسلاط واحد، الورق أو العمل بدون إنترنت"
      ),
      bi(
        "Objectif final : amorcer notre Galerie Collaborative Provinciale d'applications de Mediouna",
        "الهدف الختامي: إطلاق المعرض التعاوني الإقليمي لتطبيقات أساتذة مديونة"
      ),
    ],
    darijaNote: {
      title: bi("L'idée clé (Darija)", "الفكرة الأساسية (بالدارجة)"),
      fr: "L'enseignant(e) reste le chef d'orchestre de la classe : l'IA nous aide à gagner du temps, mais c'est nous qui connaissons nos élèves à Mediouna.",
      arabic:
        "الأستاذ(ة) كيبقى هو المايسترو في القسم. الذكاء الاصطناعي كيعاونّا نربحو الوقت، ولكن حنا اللي كنعرفو مستوى تلاميذنا في مديونة والوسائل اللي متوفرة عندنا.",
    },
    techTerms: [
      {
        term: "Prototype",
        explanation: bi(
          "Une première version fonctionnelle simple d'une application, testable dès demain.",
          "نسخة أولية بسيطة وقابلة للتشغيل من التطبيق يمكن تجريبها غداً في القسم."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "2:00 – 5:00",
      script: bi(
        "Notre ambition en 2 heures n'est pas de devenir informaticiens. Elle est double : mieux formuler nos demandes pour obtenir des brouillons utiles en arabe, français et maths (1AEP–6AEP), et transformer une idée de classe en mini-application web légère utilisable même hors ligne ou sur un seul projecteur.",
        "طموحنا خلال ساعتين ليس أن نصبح مبرمجين، بل هدفان عمليان: صياغة طلبات دقيقة للحصول على مسودات مفيدة في العربية والفرنسية والرياضيات (1AEP–6AEP)، وتحويل فكرة صفية إلى تطبيق ويب خفيف يعمل حتى بدون إنترنت."
      ),
      classroomExample: bi(
        "Citer le cas concret d'une classe de 36 élèves avec un seul projecteur et des ardoises : pas besoin de 36 tablettes pour rendre une séance interactive.",
        "ضرب مثال بقسم من 36 تلميذاً مع مسلاط واحد وألواح: لا نحتاج 36 لوحة رقمية لجعل الحصة تفاعلية."
      ),
      transition: bi(
        "Avant de parler d'outils, partons de votre quotidien : qu'est-ce qui vous prend le plus d'énergie aujourd'hui ?",
        "قبل الحديث عن الأدوات، لننطلق من واقعكم اليومي: ما أكثر مهمة تستنزف جهدكم حالياً؟"
      ),
      discussionPrompt: bi(
        "Quelle contrainte matérielle rencontre-t-on le plus dans nos écoles ?",
        "ما الإكراه المادي الأكثر حضوراً في مدارسنا؟"
      ),
    },
  },

  // SECTION 2 (5-12 min)
  {
    id: "s02-needs-poll",
    sectionNumber: 2,
    sectionTitle: bi("2. Besoins des enseignants", "2. حاجيات الأستاذات والأساتذة"),
    timeRange: bi("5 – 12 min", "5 – 12 د"),
    durationMinutes: 7,
    title: bi(
      "Identifier nos priorités sur le terrain",
      "تحديد أولوياتنا في الميدان"
    ),
    subtitle: bi(
      "Sondage en direct auprès des collègues présents dans la salle",
      "استطلاع رأي مباشر بين الزميلات والزملاء الحاضرين في القاعة"
    ),
    kind: "poll",
    activityKey: "poll-needs",
    keyPoints: [
      bi(
        "Quelle tâche pèse le plus lourd dans votre semaine d'enseignement ?",
        "ما المهمة التي تثقل أسبوعكم الدراسي أكثر من غيرها؟"
      ),
      bi(
        "Les résultats s'affichent en temps réel pour orienter nos exemples suivants",
        "تظهر النتائج مباشرة لتوجيه أمثلتنا التطبيقية الموالية"
      ),
    ],
    darijaNote: {
      title: bi("Question directe (Darija)", "سؤال مباشر للجميع (بالدارجة)"),
      fr: "Choisissez sur votre téléphone ce qui vous prend le plus de temps dans la semaine : le résultat s'affiche en direct devant nous.",
      arabic:
        "اختارو فالتيليفون ديالكم شنو الحاجة اللي كتشد ليكم أكبر وقت فالأسبوع. النتيجة غادي تبان مباشرة قدّامنا باش نركزو عليها.",
    },
    techTerms: [
      {
        term: "Live Poll",
        explanation: bi(
          "Sondage synchrone dont les résultats agrégés se mettent à jour instantanément.",
          "استطلاع متزامن تتحدث نتائجه التجميعية فورياً أمام الجميع."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "5:00 – 12:00",
      script: bi(
        "Chers collègues, ouvrez l'activité sur votre écran et choisissez l'aspect qui vous demande le plus de temps ou d'effort aujourd'hui. Regardons ensemble ce qui ressort en priorité dans notre groupe de Mediouna.",
        "زميلاتي وزملائي، اختاروا على هواتفكم الجانب الذي يأخذ منكم أكبر وقت أو جهد اليوم، ولنلاحظ معاً الأولويات التي تبرز داخل مجموعتنا في مديونة."
      ),
      classroomExample: bi(
        "Commenter les deux barres les plus hautes du graphique et souligner pourquoi la différenciation revient souvent en tête.",
        "التعليق على الشريطين الأعلى في المبيان وربطهما بالتفريق البيداغوجي في الأقسام المتعددة المستويات."
      ),
      transition: bi(
        "Maintenant que nos besoins sont posés, voyons clairement ce qu'est l'IA générative sans jargon inutile.",
        "بعد تحديد حاجياتنا، لنفهم بوضوح ما هو الذكاء الاصطناعي التوليدي دون تعقيد."
      ),
      discussionPrompt: bi(
        "Pourquoi cette tâche précise prend-elle autant de temps au primaire ?",
        "لماذا تستغرق هذه المهمة بالذات كل هذا الوقت في الابتدائي؟"
      ),
    },
  },

  // SECTION 3 (12-22 min)
  {
    id: "s03-concepts",
    sectionNumber: 3,
    sectionTitle: bi("3. Comprendre l'IA générative", "3. فهم الذكاء الاصطناعي التوليدي"),
    timeRange: bi("12 – 17 min", "12 – 17 د"),
    durationMinutes: 5,
    title: bi(
      "5 notions clés expliquées simplement",
      "5 مفاهيم أساسية مشروحة ببساطة"
    ),
    subtitle: bi(
      "Sans théorie compliquée : des repères visuels pour comprendre ce qui se passe derrière l'écran",
      "دون نظريات معقدة: معالم بصرية لفهم ما يجري خلف الشاشة"
    ),
    kind: "concepts",
    keyPoints: [
      bi(
        "AI (Intelligence Artificielle) : systèmes capables d'exécuter des tâches complexes",
        "AI (الذكاء الاصطناعي): أنظمة قادرة على إنجاز مهام مرتبطة بالذكاء البشري"
      ),
      bi(
        "Generative AI : branche de l'IA qui produit du nouveau contenu (texte, code, exercices)",
        "Generative AI (الذكاء الاصطناعي التوليدي): فرع ينتج محتوى جديداً (نصوص، تمارين، شيفرة)"
      ),
      bi(
        "LLM (Large Language Model) : moteur statistique qui prédit les mots les plus probables",
        "LLM (النموذج اللغوي الكبير): محرك إحصائي يتنبأ بالكلمات الأكثر احتمالاً حسب السياق"
      ),
      bi(
        "Prompt : l'instruction précise que vous donnez à l'outil",
        "Prompt (التوجيه): التعليمات الدقيقة التي نوجهها للأداة"
      ),
      bi(
        "Hallucination : erreur affirmée avec assurance — d'où la validation obligatoire par l'enseignant",
        "Hallucination (الهلوسة): خطأ يُصاغ بأسلوب واثق — لذا يجب اعتماد الأستاذ(ة) دائماً"
      ),
    ],
    darijaNote: {
      title: bi("Simplification des notions (Darija)", "تبسيط المفاهيم (بالدارجة)"),
      fr: "Un LLM n'est pas une encyclopédie garantie : c'est un assistant qui devine le mot suivant le plus probable. Il faut donc toujours relire.",
      arabic:
        "الـ LLM ماشي موسوعة فيها حقائق مضمونة، هو بحال مساعد قرا بزاف ديال النصوص وكيخمن الكلمة المناسبة اللي جاية من بعد. يقدر يعطينا فكرة زوينة، ويقدر يألف معلومة غلط (Hallucination)، داكشي علاش خاصنا ديما نراجعو.",
    },
    techTerms: [
      {
        term: "LLM",
        explanation: bi(
          "Large Language Model — modèle entraîné sur de vastes corpus textuels.",
          "نموذج لغوي كبير مُدرَّب على كميات ضخمة من النصوص."
        ),
      },
      {
        term: "Prompt",
        explanation: bi(
          "Consigne rédigée par l'utilisateur pour guider la génération.",
          "التوجيه المكتوب من المستعمل لتأطير عملية التوليد."
        ),
      },
      {
        term: "Hallucination",
        explanation: bi(
          "Production plausible dans la forme mais fausse dans le fond.",
          "محتوى يبدو مقنعاً في شكله لكنه غير صحيح في مضمونه."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "12:00 – 17:00",
      script: bi(
        "Pas besoin de formules mathématiques pour comprendre un LLM. Imaginez une auto-complétion géante qui calcule les mots les plus probables en français et en arabe. C'est rapide, mais cela peut inventer une règle ou une référence avec beaucoup d'aplomb : c'est l'hallucination.",
        "لا نحتاج لمعادلات رياضية لفهم الـ LLM. تخيلوه كإكمال تلقائي ضخم يحسب الكلمات الأكثر احتمالاً بالعربية والفرنسية، ولذلك قد يختلق أحياناً معلومة بثقة زائدة وهي ظاهرة الهلوسة."
      ),
      classroomExample: bi(
        "Citer le cas d'une IA qui invente un numéro de page d'un manuel si on ne lui fournit pas l'extrait soi-même.",
        "تقديم مثال باختلاق رقم صفحة في كتاب مدرسي إذا لم نزوّده بالمقتطف بأنفسنا."
      ),
      transition: bi(
        "Vérifions ces 5 repères avec un mini-quiz de 5 questions sur vos téléphones.",
        "لنتحقق من هذه المعالم الخمسة عبر رائز سريع من 5 أسئلة على هواتفكم."
      ),
      discussionPrompt: bi(
        "Avez-vous déjà vu une IA inventer une réponse fausse mais très convaincante ?",
        "هل سبق أن لاحظتم إجابة خاطئة من الذكاء الاصطناعي لكنها تبدو مقنعة؟"
      ),
    },
  },
  {
    id: "s03-quiz",
    sectionNumber: 3,
    sectionTitle: bi("3. Comprendre l'IA générative", "3. فهم الذكاء الاصطناعي التوليدي"),
    timeRange: bi("17 – 22 min", "17 – 22 د"),
    durationMinutes: 5,
    title: bi(
      "Quiz express : 5 repères sur les LLM",
      "رائز سريع: 5 معالم حول النماذج اللغوية الكبيرة"
    ),
    subtitle: bi(
      "Répondez sur votre appareil puis observons les réponses et explications ensemble",
      "أجيبوا عبر أجهزتكم ثم نناقش الإجابات والتفسيرات جماعياً"
    ),
    kind: "quiz",
    activityKey: "quiz-genai",
    keyPoints: [
      bi("5 questions à choix multiples", "5 أسئلة اختيار من متعدد"),
      bi(
        "Rétroaction pédagogique affichée dès la révélation des réponses",
        "تغذية راجعة بيداغوجية تظهر فور كشف الإجابات"
      ),
    ],
    darijaNote: {
      title: bi("Consolider la compréhension (Darija)", "تثبيت الفهم (بالدارجة)"),
      fr: "Ces 5 questions servent juste à ancrer nos repères ensemble — pas de note ni d'examen.",
      arabic:
        "هاد 5 أسئلة غير باش نثبتو المفاهيم بيناتنا، ما كاين لا نقطة لا امتحان. من بعد غادي نكشفو التصحيح ونناقشوه مجموعين.",
    },
    techTerms: [
      {
        term: "Token",
        explanation: bi(
          "Fragment de mot traité par le modèle lors de la prédiction.",
          "جزء من كلمة يعالجه النموذج اللغوي أثناء التنبؤ."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "17:00 – 22:00",
      script: bi(
        "Prenez 2 à 3 minutes pour répondre aux 5 questions sur votre téléphone, puis nous révélerons les réponses et commenterons les explications.",
        "خذوا دقيقتين إلى ثلاث دقائق للإجابة عن الأسئلة الخمسة، ثم سنكشف التصحيح ونعلق على التفسيرات معاً."
      ),
      classroomExample: bi(
        "Insister sur Q4 : tout texte généré est un brouillon à relire et valider.",
        "التأكيد في السؤال 4 على أن كل محتوى مولّد هو مسودة للمراجعة والاعتماد."
      ),
      transition: bi(
        "Passons maintenant au concret : 8 cas d'usage quotidiens de la 1AEP à la 6AEP.",
        "لننتقل الآن إلى الميدان: 8 حالات تطبيقية يومية من الأول إلى السادس ابتدائي."
      ),
      discussionPrompt: bi(
        "Laquelle des 5 notions vous semble la plus importante à expliquer aux collègues ?",
        "أي مفهوم من الخمسة ترونه الأهم لشرحه للزملاء؟"
      ),
    },
  },

  // SECTION 4 (22-32 min)
  {
    id: "s04-use-cases",
    sectionNumber: 4,
    sectionTitle: bi("4. Cas d'usage concrets (1AEP–6AEP)", "4. حالات تطبيقية ملموسة (1AEP–6AEP)"),
    timeRange: bi("22 – 32 min", "22 – 32 د"),
    durationMinutes: 10,
    title: bi(
      "Exemples réels pour le primaire marocain",
      "أمثلة واقعية للتعليم الابتدائي المغربي"
    ),
    subtitle: bi(
      "Fiches, 3 niveaux (logique TaRL), lecture AR/FR, décomposition, remédiation et fiches imprimables",
      "جذاذات، 3 مستويات (منطق TaRL)، قراءة عربية/فرنسية، تفكيك الأعداد، دعم وأوراق للطباعة"
    ),
    kind: "use-cases",
    keyPoints: [
      bi(
        "Toujours fournir vous-même l'objectif, le niveau (1AEP–6AEP) et l'extrait si nécessaire",
        "تزويد الهدف والمستوى (1AEP–6AEP) ومقتطف الدرس من طرف الأستاذ(ة) دائماً"
      ),
      bi(
        "Ne jamais revendiquer une conformité officielle automatique sans vérification",
        "عدم افتراض المطابقة الرسمية التلقائية دون مراجعة المرجع"
      ),
      bi(
        "Tout contenu généré est affiché comme « Brouillon à relire et valider »",
        "كل محتوى مولّد يُعرض كـ «مسودة للقراءة والتكييف والاعتماد»"
      ),
    ],
    darijaNote: {
      title: bi("Exemples tirés du terrain (Darija)", "أمثلة من واقع القسم (بالدارجة)"),
      fr: "Parcourez ces 8 modèles et copiez les prompts : tout résultat d'IA reste un brouillon à adapter à vos élèves.",
      arabic:
        "تقدرو تصفحو هاد 8 ديال النماذج مباشرة فالتيليفون وتنسخو الـ Prompt. مهم بزاف نذكرو: أي نص كيعطيه الذكاء الاصطناعي راه غير مسودة (Brouillon) خاصنا نقراوها ونعدلوها على حساب تلاميذنا.",
    },
    techTerms: [
      {
        term: "TaRL (Teaching at the Right Level)",
        explanation: bi(
          "Principe pédagogique consistant à adapter l'activité au niveau réel observé de l'élève.",
          "مبدأ بيداغوجي يقوم على ملاءمة النشاط مع المستوى الفعلي المرصود لدى المتعلم."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "22:00 – 32:00",
      script: bi(
        "Voici 8 situations concrètes du primaire public marocain. Notez que c'est toujours l'enseignant qui fournit l'objectif ou l'extrait : fiche de séance, 3 niveaux TaRL, lecture arabe RTL voyellée, lexique AR/FR, décomposition C/D/U, remédiation, diagnostic fractions et mot bilingue aux parents.",
        "إليكم 8 وضعيات من التعليم الابتدائي العمومي المغربي. لاحظوا أن الأستاذ(ة) هو من يحدد الهدف دائماً: جذاذة، 3 مستويات TaRL، نص عربي مشكول، معجم ثنائي، تفكيك م/ع/و، دعم، تشخيص الكسور، ومراسلة الأسر."
      ),
      classroomExample: bi(
        "Ouvrir l'onglet 2 (3 niveaux) et l'onglet 3 (Lecture arabe RTL) pour montrer les versions FR et AR côte à côte.",
        "فتح التبويب 2 (3 مستويات) والتبويب 3 (القراءة العربية) لعرض الصيغتين معاً."
      ),
      transition: bi(
        "Puisque ces brouillons sont rapides à produire, quelles précautions garder avant d'entrer en classe ?",
        "بما أن إنتاج هذه المسودات سريع، ما الضوابط التي يجب التمسك بها قبل دخول القسم؟"
      ),
      discussionPrompt: bi(
        "Lequel de ces 8 modèles répond à un besoin de votre semaine prochaine ?",
        "أي نموذج من هذه النماذج الثمانية يناسب حصتكم الأسبوع المقبل؟"
      ),
    },
  },

  // SECTION 5 (32-40 min)
  {
    id: "s05-pillars",
    sectionNumber: 5,
    sectionTitle: bi("5. IA responsable en classe", "5. الذكاء الاصطناعي المسؤول في القسم"),
    timeRange: bi("32 – 36 min", "32 – 36 د"),
    durationMinutes: 4,
    title: bi(
      "6 garde-fous pour protéger nos élèves et notre métier",
      "6 ضوابط لحماية تلاميذنا ومهنتنا"
    ),
    subtitle: bi(
      "L'IA assiste l'enseignant ; elle ne remplace jamais le jugement professionnel",
      "الذكاء الاصطناعي يدعم الأستاذ(ة) ولا يعوّض أبداً التقدير المهني البيداغوجي"
    ),
    kind: "pillars",
    keyPoints: [
      bi(
        "1. Hallucinations : vérifier systématiquement faits, calculs et voyellation arabe",
        "1. الهلوسات: التحقق المنهجي من المعلومات والحسابات والشكل التام"
      ),
      bi(
        "2. Validation pédagogique : contrôler l'adaptation à l'âge et au vécu des élèves",
        "2. الاعتماد البيداغوجي: مراقبة الملاءمة لسن المتعلمين وبيئتهم"
      ),
      bi(
        "3. Biais & stéréotypes : relire les prénoms, contextes familiaux et exemples culturels",
        "3. التحيز والصور النمطية: مراجعة الأسماء والسياقات الثقافية والأسرية"
      ),
      bi(
        "4. Confidentialité absolue : zéro nom d'élève, code Massar ou donnée personnelle",
        "4. الخصوصية المطلقة: صفر اسم تلميذ، صفر رمز مسار، وصفر معطى شخصي"
      ),
      bi(
        "5. Réalité matérielle : privilégier le léger, le projetable et l'imprimable",
        "5. الواقع المادي: تفضيل الأدوات الخفيفة والصالحة للعرض والطباعة"
      ),
      bi(
        "6. Responsabilité : l'enseignant reste seul garant de la qualité didactique",
        "6. المسؤولية: يظل الأستاذ(ة) الضامن الوحيد للجودة الديداكتيكية"
      ),
    ],
    darijaNote: {
      title: bi("Sécurité et responsabilité (Darija)", "أمان المعطيات والمسؤولية (بالدارجة)"),
      fr: "Ne saisissez jamais de noms d'élèves ni de codes Massar : utilisez des profils anonymes et relisez tout avant la classe.",
      arabic:
        "عمرنا ما ندخلو سميات التلاميذ أو مسار أو أي معلومات شخصية فشي موقع ذكاء اصطناعي. ديما نخدمو بأمثلة مجهولة (تلميذ أ، مجموعة 1) ونراجعو كل محتوى قبل ما يوصل للتلميذ.",
    },
    techTerms: [
      {
        term: "Privacy by Design",
        explanation: bi(
          "Concevoir des outils qui ne collectent aucune donnée personnelle dès le départ.",
          "تصميم أدوات لا تجمع أي بيانات شخصية منذ البداية."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "32:00 – 36:00",
      script: bi(
        "Posons 6 règles d'or non négociables : confidentialité totale (zéro nom d'élève ni code Massar), vérification des faits et de la voyellation, et maintien du jugement pédagogique humain.",
        "لنثبّت 6 قواعد ذهبية: السرية التامة (صفر اسم تلميذ أو رقم مسار)، التحقق من الوقائع والشكل، والحفاظ على التقدير البيداغوجي للأستاذ(ة)."
      ),
      classroomExample: bi(
        "Remplacer un nom réel d'élève par « profil A qui progresse en lecture orale ».",
        "استبدال اسم التلميذ الحقيقي بصيغة مجهولة «متعلم يتقدم في القراءة الجهرية»."
      ),
      transition: bi(
        "Testons vos réflexes sur 5 affirmations rapides Vrai ou Faux.",
        "لنختبر ردود فعلنا مع 5 عبارات سريعة: صحيح أم خطأ."
      ),
      discussionPrompt: bi(
        "Comment anonymiser facilement une situation de classe avant d'écrire un prompt ?",
        "كيف نحوّل وضعية صفية إلى صيغة مجهولة قبل كتابة التوجيه؟"
      ),
    },
  },
  {
    id: "s05-true-false",
    sectionNumber: 5,
    sectionTitle: bi("5. IA responsable en classe", "5. الذكاء الاصطناعي المسؤول في القسم"),
    timeRange: bi("36 – 40 min", "36 – 40 د"),
    durationMinutes: 4,
    title: bi(
      "Vrai ou Faux : Réflexes en école primaire",
      "صحيح أم خطأ: ممارسات مسؤولة بالمدرسة الابتدائية"
    ),
    subtitle: bi(
      "5 scénarios concrets pour ancrer les bonnes pratiques",
      "5 وضعيات ميدانية لترسيخ الممارسات السليمة"
    ),
    kind: "quiz",
    activityKey: "quiz-responsible",
    keyPoints: [
      bi("5 affirmations rapides Vrai / Faux", "5 عبارات سريعة (صحيح / خطأ)"),
      bi(
        "Discussion brève après révélation des explications",
        "نقاش مقتضب بعد كشف التفسيرات"
      ),
    ],
    darijaNote: {
      title: bi("Vrai ou Faux (Darija)", "صحيح أم خطأ؟ (بالدارجة)"),
      fr: "5 situations rapides du quotidien scolaire : pratique sûre ou risquée ?",
      arabic:
        "5 وضعيات سريعة من الحياة المدرسية: واش هاد التصرف صحيح ولا فيه مخاطرة على التلاميذ أو الجودة البيداغوجية؟",
    },
    techTerms: [
      {
        term: "Bias",
        explanation: bi(
          "Tendance d'un modèle à reproduire des stéréotypes ou modèles culturels éloignés.",
          "ميل النموذج لإعادة إنتاج قوالب نمطية أو سياقات بعيدة عن بيئة التلميذ."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "36:00 – 40:00",
      script: bi(
        "Prenez 2 minutes pour répondre aux 5 affirmations Vrai ou Faux puis commentons ensemble.",
        "خذوا دقيقتين للإجابة عن العبارات الخمس ثم نناقشها معاً."
      ),
      classroomExample: bi(
        "Insister sur TF3 : ne jamais supposer qu'un outil connaît le programme marocain sans lui fournir l'objectif.",
        "التشديد على العبارة 3: يجب تزويد الأداة بالهدف أو المقتطف دائماً."
      ),
      transition: bi(
        "Apprenons maintenant à rédiger des prompts solides dès le premier essai.",
        "لنتعلم الآن صياغة توجيهات (Prompts) متينة منذ المحاولة الأولى."
      ),
      discussionPrompt: bi(
        "Quelle règle de prudence allez-vous partager dans votre établissement ?",
        "ما قاعدة الحيطة التي ستتقاسمونها في مدرستكم؟"
      ),
    },
  },

  // SECTION 6 (40-54 min)
  {
    id: "s06-anatomy",
    sectionNumber: 6,
    sectionTitle: bi("6. Prompt Engineering", "6. هندسة التوجيهات (Prompt Engineering)"),
    timeRange: bi("40 – 46 min", "40 – 46 د"),
    durationMinutes: 6,
    title: bi(
      "Les 8 briques d'un Prompt pédagogique solide",
      "اللبنات الثماني لتوجيه بيداغوجي محكم"
    ),
    subtitle: bi(
      "Pourquoi un prompt précis transforme un brouillon vague en support exploitable",
      "لماذا يحوّل التوجيه الدقيق مسودة عامة إلى دعامة قابلة للاستثمار الفعلي"
    ),
    kind: "prompt-anatomy",
    keyPoints: [
      bi(
        "Rôle · Contexte de classe · Tâche · Public (1AEP–6AEP)",
        "الدور · سياق القسم · المهمة · الفئة المستهدفة (1AEP–6AEP)"
      ),
      bi(
        "Objectif & compétence fournis · Contraintes matérielles · Format · Critères de qualité",
        "الهدف والكفاية · الشروط المادية · الشكل المطلوب · معايير الجودة"
      ),
      bi(
        "Comparaison directe : Prompt faible vs Prompt fort adapté au primaire marocain",
        "مقارنة مباشرة: توجيه ضعيف مقابل توجيه قوي ملائم للابتدائي المغربي"
      ),
    ],
    darijaNote: {
      title: bi("Les composants d'un bon prompt (Darija)", "مكونات الطلب الجيد (بالدارجة)"),
      fr: "Une question trop générale donne un résultat général. En précisant niveau, objectif et moyens de la classe, vous gagnez un temps précieux.",
      arabic:
        "إلى عطيتي سؤال عام بحال «عطيني تمرين»، النتيجة كتجي عامة. ولكن إلى حددتي المستوى، الهدف اللي بغيتي، مستوى التلاميذ والوسائل اللي عندك، كتربح بزاف ديال الوقت.",
    },
    techTerms: [
      {
        term: "Prompt Engineering",
        explanation: bi(
          "L'art de structurer une consigne claire, contextuelle et vérifiable.",
          "فن هيكلة تعليمة واضحة ومؤطرة وقابلة للتحقق."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "40:00 – 46:00",
      script: bi(
        "Comparons côte à côte le prompt faible « Donne-moi un exercice » et le prompt structuré en 8 briques adapté à une classe de 4AEP à Mediouna.",
        "لنقارن جنباً إلى جنب بين توجيه ضعيف وتوجيه مهيكل من 8 عناصر لقسم الرابع ابتدائي بمديونة."
      ),
      classroomExample: bi(
        "Montrer comment l'ajout de la contrainte « projetable / 3 niveaux » change immédiatement la structure obtenue.",
        "إبراز كيف يغير شرط «3 مستويات / قابل للعرض» جودة النتيجة فوراً."
      ),
      transition: bi(
        "À vous maintenant de construire votre propre prompt avec le Prompt Builder.",
        "الآن دوركم لبناء توجيهكم الخاص عبر أداة Prompt Builder."
      ),
      discussionPrompt: bi(
        "Quel élément oublie-t-on le plus souvent quand on écrit vite à l'IA ?",
        "ما العنصر الذي ننساه غالباً عندما نكتب للذكاء الاصطناعي بسرعة؟"
      ),
    },
  },
  {
    id: "s06-builder",
    sectionNumber: 6,
    sectionTitle: bi("6. Prompt Engineering", "6. هندسة التوجيهات (Prompt Engineering)"),
    timeRange: bi("46 – 54 min", "46 – 54 د"),
    durationMinutes: 8,
    title: bi(
      "Atelier pratique : Votre Prompt Builder",
      "ورشة تطبيقية: مُنشئ التوجيهات الخاص بكم"
    ),
    subtitle: bi(
      "Sélectionnez votre niveau (1AEP–6AEP), la langue cible et assemblez vos prompts FR et AR",
      "اختاروا المستوى (1AEP–6AEP) ولغة المورد، ثم ركّبوا التوجيهين بالفرنسية والعربية للنسخ"
    ),
    kind: "prompt-builder",
    activityKey: "builder-prompt",
    keyPoints: [
      bi(
        "Renseignez niveau, discipline, objectif, compétence, extrait (optionnel) et langue du support",
        "حددوا المستوى، المادة، الهدف، الكفاية، المقتطف (اختياري)، ولغة الدعامة"
      ),
      bi(
        "Copiez librement le prompt FR ou AR assemblé et partagez-le avec la salle",
        "انسخوا التوجيه الفرنسي أو العربي وشاركوه مع الزملاء في القاعة"
      ),
    ],
    darijaNote: {
      title: bi("Pratique en direct (Darija)", "تطبيق عملي مباشر (بالدارجة)"),
      fr: "Remplissez les champs selon votre classe : vous obtenez votre prompt en français et en arabe prêts à copier.",
      arabic:
        "عمّرو الخانات على حساب القسم والمادة ديالكم، غادي يتجمع ليكم Prompt مقاد جاهز للنسخ، وتقدرو تشاركوه باش يبان عند الزملاء على الشاشة.",
    },
    techTerms: [
      {
        term: "Output Format",
        explanation: bi(
          "Structure exacte demandée (tableau, QCM, fiche A4, HTML).",
          "البنية المطلوبة للمخرجات (جدول، اختيار متعدد، ورقة A4، HTML)."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "46:00 – 54:00",
      script: bi(
        "Prenez 5 minutes pour remplir le Prompt Builder avec une vraie séance de votre semaine. Vous choisissez si le support doit être en français, en arabe ou bilingue, et vous copiez le prompt correspondant.",
        "خذوا 5 دقائق لملء Prompt Builder بدرس حقيقي من أسبوعكم. يمكنكم تحديد لغة الدعامة المطلوبة ونسخ التوجيه المناسب."
      ),
      classroomExample: bi(
        "Lire à voix haute deux propositions anonymisées reçues dans le flux de la salle.",
        "قراءة نموذجين مجهولي الهوية من مشاركات الزملاء في القاعة."
      ),
      transition: bi(
        "Et si on ne sait pas par où commencer ? Découvrons le Méta-Prompting.",
        "وماذا لو لم نعرف من أين نبدأ الصياغة؟ لنكتشف الميتا-برومبت (Meta-Prompting)."
      ),
      discussionPrompt: bi(
        "Comment ce modèle structuré change-t-il votre temps de préparation ?",
        "كيف يغير هذا النموذج المهيكل من سرعة تحضيركم للدروس؟"
      ),
    },
  },

  // SECTION 7 (54-64 min)
  {
    id: "s07-workflow",
    sectionNumber: 7,
    sectionTitle: bi("7. Le Méta-Prompting", "7. الميتا-برومبت (Meta-Prompting)"),
    timeRange: bi("54 – 59 min", "54 – 59 د"),
    durationMinutes: 5,
    title: bi(
      "Demander à l'IA d'améliorer votre consigne d'abord",
      "الطلب من الذكاء الاصطناعي تحسين تعليمتك أولاً"
    ),
    subtitle: bi(
      "Idée brute → Manques → Questions de clarification → Prompt optimisé → Exécution → Validation",
      "فكرة أولية ← رصد النواقص ← أسئلة توضيحية ← توجيه محسن ← تنفيذ ← مراجعة واعتماد"
    ),
    kind: "meta-prompt-flow",
    keyPoints: [
      bi(
        "Ne rédigez plus seul un long prompt complexe dès le début",
        "لا تكتب وحدك توجيهاً طويلاً ومعقداً من البداية"
      ),
      bi(
        "Inversez les rôles : demandez à l'IA de vous poser 5 questions ciblées avant de produire",
        "اعكس الأدوار: اطلب من الذكاء الاصطناعي طرح 5 أسئلة دقيقة قبل الإنتاج"
      ),
      bi(
        "Exemples complets prêts à copier en Français et en Arabe (RTL)",
        "نماذج كاملة جاهزة للنسخ بالفرنسية والعربية (RTL)"
      ),
    ],
    darijaNote: {
      title: bi("Qu'est-ce que le Meta-Prompting ? (Darija)", "شنو هو الـ Méta-Prompting؟ (بالدارجة)"),
      fr: "Au lieu de tout formuler seul, dites à l'IA : pose-moi d'abord 5 questions sur ma classe avant de générer l'activité.",
      arabic:
        "بدل ما تعصر راسك باش تكتب طلب طويل من الأول، قول للذكاء الاصطناعي: «بغيت نصاوب هاد النشاط، ولكن قبل ما تبدا، سولني 5 أسئلة على قسمي ومستوى التلاميذ». هو كيعاونك تبني الطلب المثالي.",
    },
    techTerms: [
      {
        term: "Meta-Prompting",
        explanation: bi(
          "Utiliser l'IA pour co-concevoir et affiner l'instruction avant l'exécution.",
          "توظيف الذكاء الاصطناعي لصياغة وتحسين التوجيه قبل بدء التنفيذ."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "54:00 – 59:00",
      script: bi(
        "Quand on n'a qu'une idée brute, on demande à l'IA d'identifier ce qu'il manque et de poser 5 questions courtes. En 30 secondes de réponses, le résultat devient nettement plus adapté.",
        "عندما تكون لدينا فكرة أولية فقط، نطلب من الذكاء الاصطناعي تحديد النواقص وطرح 5 أسئلة قصيرة؛ وخلال 30 ثانية تصبح النتيجة أدق بكثير."
      ),
      classroomExample: bi(
        "Montrer côte à côte les cartes Méta-Prompt en français et en arabe.",
        "عرض بطاقتي الميتا-برومبت بالفرنسية والعربية معاً."
      ),
      transition: bi(
        "Testons cette démarche sur une idée de votre propre classe.",
        "لنجرب هذه المقاربة مباشرة على فكرة من قسمكم."
      ),
      discussionPrompt: bi(
        "En quoi les questions posées par l'IA vous aident-elles à clarifier votre objectif ?",
        "كيف تساعدكم الأسئلة التوضيحية على تدقيق هدفكم البيداغوجي؟"
      ),
    },
  },
  {
    id: "s07-exercise",
    sectionNumber: 7,
    sectionTitle: bi("7. Le Méta-Prompting", "7. الميتا-برومبت (Meta-Prompting)"),
    timeRange: bi("59 – 64 min", "59 – 64 د"),
    durationMinutes: 5,
    title: bi(
      "Exercice pratique : Transformez une idée brute",
      "تمرين تطبيقي: حوّلوا فكرة أولية إلى ميتا-برومبت"
    ),
    subtitle: bi(
      "Générez simultanément vos méta-prompts en français et en arabe et partagez votre essai",
      "أنشئوا الميتا-برومبت بالفرنسية والعربية معاً وشاركوا تجربتكم"
    ),
    kind: "meta-prompt-exercise",
    activityKey: "exercise-metaprompt",
    keyPoints: [
      bi(
        "Saisissez une idée rapide de votre classe (1 à 2 phrases)",
        "اكتبوا فكرة سريعة من قسمكم (جملة أو جملتين)"
      ),
      bi(
        "Copiez la version française ou arabe prête pour votre séance",
        "انسخوا الصيغة الفرنسية أو العربية الجاهزة لحصتكم"
      ),
    ],
    darijaNote: {
      title: bi("Essayez en 2 minutes (Darija)", "جرب دابا فدقيقتين (بالدارجة)"),
      fr: "Écrivez une simple idée en deux lignes et obtenez tout de suite un méta-prompt prêt pour cette semaine.",
      arabic:
        "كتب غير فكرة بسيطة فسطر أو سطرين، وغادي تصاوب ليك الأداة Meta-Prompt واجد تقدر تستعملو هاد السيمانة.",
    },
    techTerms: [
      {
        term: "Clarification Loop",
        explanation: bi(
          "Aller-retour rapide qui élimine les suppositions erronées de l'IA.",
          "حوار توضيحي سريع يزيل الافتراضات الخاطئة للذكاء الاصطناعي."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "59:00 – 64:00",
      script: bi(
        "Prenez 3 minutes pour saisir votre idée brute et partager votre méta-prompt. Observons la répartition et quelques idées de la salle.",
        "خذوا 3 دقائق لكتابة فكرتكم الأولية ومشاركة الميتا-برومبت، ولنطّلع على مشاركات القاعة."
      ),
      classroomExample: bi(
        "Lire un exemple arabe et un exemple français envoyés par les collègues.",
        "قراءة نموذج عربي ونموذج فرنسي أرسلهما الزملاء."
      ),
      transition: bi(
        "Passons maintenant à la création de véritables petites applications pédagogiques.",
        "لننتقل الآن إلى إنشاء تطبيقات بيداغوجية تفاعلية مصغرة."
      ),
      discussionPrompt: bi(
        "Dans quelle discipline le méta-prompting vous fera-t-il gagner le plus de temps ?",
        "في أي مادة دراسية سيوفر لكم الميتا-برومبت أكبر وقت؟"
      ),
    },
  },

  // SECTION 8 (64-74 min)
  {
    id: "s08-web-trio",
    sectionNumber: 8,
    sectionTitle: bi("8. Créer une application avec l'IA", "8. بناء تطبيق تعليمي بالذكاء الاصطناعي"),
    timeRange: bi("64 – 69 min", "64 – 69 د"),
    durationMinutes: 5,
    title: bi(
      "HTML, CSS et JavaScript : le trio du navigateur",
      "HTML وCSS وJavaScript: ثلاثي المتصفح"
    ),
    subtitle: bi(
      "Comprendre visuellement comment une simple page web devient un outil de classe interactif",
      "فهم بصري لكيفية تحوّل صفحة ويب بسيطة إلى أداة صفية تفاعلية"
    ),
    kind: "web-trio",
    keyPoints: [
      bi(
        "HTML : la structure et le contenu (titre, question, boutons)",
        "HTML: البنية والمحتوى (العنوان، السؤال، الأزرار)"
      ),
      bi(
        "CSS : la présentation et la lisibilité (grandes polices, RTL, impression A4)",
        "CSS: التنسيق والوضوح (خط كبير للمسلاط، RTL، طباعة A4)"
      ),
      bi(
        "JavaScript : l'interactivité (vérifier la réponse, score, recommencer)",
        "JavaScript: التفاعلية (التحقق من الجواب، حساب النتيجة، الإعادة)"
      ),
    ],
    darijaNote: {
      title: bi("HTML / CSS / JS simplement (Darija)", "الفرق بين HTML و CSS و JS (بالدارجة)"),
      fr: "Imaginez la classe : HTML c'est les murs et les tables, CSS c'est la peinture et l'organisation, JavaScript c'est l'action quand on clique.",
      arabic:
        "تخيلو القسم: الـ HTML هو البناية والسبورة والطاولات (المحتوى)، الـ CSS هو الصباغة والتنظيم والخط الواضح، والـ JavaScript هو الحركة والتفاعل ملي كتبرك على شي زر وكيحسب النتيجة.",
    },
    techTerms: [
      {
        term: "HTML / CSS / JS",
        explanation: bi(
          "Les 3 langages standards lus gratuitement par tout navigateur, même hors ligne.",
          "اللغات القياسية الثلاث التي يقرؤها أي متصفح مجاناً وحتى بدون إنترنت."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "64:00 – 69:00",
      script: bi(
        "Une mini-application tient souvent dans une seule page HTML/CSS/JS ouverte sans connexion. Regardez en direct l'effet lorsqu'on active ou désactive le CSS et le JavaScript.",
        "غالباً ما يكفي ملف واحد HTML/CSS/JS يعمل بدون إنترنت في المتصفح. لاحظوا مباشرة تأثير تفعيل أو تعطيل CSS وJavaScript."
      ),
      classroomExample: bi(
        "Basculer les cases CSS et JavaScript devant la salle pour montrer concrètement le rôle de chaque couche.",
        "تبديل خانتي CSS وJavaScript أمام القاعة لإظهار دور كل طبقة عملياً."
      ),
      transition: bi(
        "Clarifions maintenant la différence entre texte généré, prototype et application déployée.",
        "لنوضح الآن الفرق بين توليد المحتوى وبناء نموذج أولي ونشر تطبيق."
      ),
      discussionPrompt: bi(
        "Saviez-vous qu'un seul fichier HTML peut fonctionner sur un ordinateur de classe sans Wi-Fi ?",
        "هل كنتم تعلمون أن ملف HTML واحداً يمكن أن يشتغل في القسم بدون أنترنيت؟"
      ),
    },
  },
  {
    id: "s08-ecosystem",
    sectionNumber: 8,
    sectionTitle: bi("8. Créer une application avec l'IA", "8. بناء تطبيق تعليمي بالذكاء الاصطناعي"),
    timeRange: bi("69 – 74 min", "69 – 74 د"),
    durationMinutes: 5,
    title: bi(
      "De l'idée à la classe : repères et 4 étapes clés",
      "من الفكرة إلى القسم: معالم و4 مراحل أساسية"
    ),
    subtitle: bi(
      "Distinguer ChatGPT, Google Antigravity, Web App, Prototype et Application déployée",
      "التمييز بين ChatGPT وGoogle Antigravity وتطبيق الويب والنموذج الأولي والتطبيق المنشور"
    ),
    kind: "ecosystem",
    keyPoints: [
      bi(
        "1. Générer du contenu ≠ 2. Créer une app ≠ 3. Utiliser en vraie classe ≠ 4. Évaluer l'impact sur les élèves",
        "1. إنتاج محتوى ≠ 2. بناء تطبيق ≠ 3. الاستعمال الفعلي في القسم ≠ 4. تقويم أثره على التعلم"
      ),
      bi(
        "ChatGPT (conversation) vs Google Antigravity (studio d'ingénierie d'applications)",
        "ChatGPT (حوار ومسودات) مقابل Google Antigravity (بيئة لبناء التطبيقات وفحصها)"
      ),
      bi(
        "Priorités Mediouna : léger, responsive, projetable, imprimable et sans compte élève",
        "أولويات مديونة: خفيف، متجاوب، قابل للعرض والطباعة، ودون حسابات للتلاميذ"
      ),
    ],
    darijaNote: {
      title: bi("4 étapes essentielles (Darija)", "4 مراحل مهمة (بالدارجة)"),
      fr: "Générer un exercice, créer une application, l'utiliser avec 35 élèves puis vérifier si elle les aide vraiment sont 4 étapes distinctes.",
      arabic:
        "كاين فرق كبير بين: 1) نصاوب نص بالذكاء الاصطناعي، 2) نصاوب تطبيق تفاعلي، 3) نخدم بيه وسط التلاميذ في القسم، و 4) نسول راسي واش فعلاً عاونهم يتعلمو.",
    },
    techTerms: [
      {
        term: "Web App",
        explanation: bi(
          "Application accessible directement dans le navigateur sans installation.",
          "تطبيق يشتغل مباشرة في المتصفح دون تثبيت."
        ),
      },
      {
        term: "Deployed App",
        explanation: bi(
          "Application publiée sur une URL publique partageable par lien ou QR.",
          "تطبيق منشور على رابط عمومي قابل للمشاركة بالرابط أو رمز QR."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "69:00 – 74:00",
      script: bi(
        "Distinguons bien les 4 étapes entre générer un texte et évaluer l'impact pédagogique réel en classe, ainsi que les outils adaptés aux réalités matérielles de Mediouna.",
        "لنميّز بوضوح بين المراحل الأربع من إنتاج النص إلى تقويم الأثر التعلمي الحقيقي في القسم، مع مراعاة التجهيز الواقعي في مديونة."
      ),
      classroomExample: bi(
        "Comparer ChatGPT (brouillons rapides) et Google Antigravity (structurer et tester une application complète).",
        "مقارنة ChatGPT (مسودات سريعة) بـ Google Antigravity (بناء واختبار تطبيق متكامل)."
      ),
      transition: bi(
        "Voyons tout de suite un prototype fonctionnel en action.",
        "لنعاين الآن نموذجاً أولياً يشتغل مباشرة أمامنا."
      ),
      discussionPrompt: bi(
        "Comment vérifier simplement si une application aide vraiment les élèves à comprendre ?",
        "كيف نتحقق ببساطة من أن التطبيق ساعد التلاميذ فعلاً على الفهم؟"
      ),
    },
  },

  // SECTION 9 (74-82 min)
  {
    id: "s09-live-demo",
    sectionNumber: 9,
    sectionTitle: bi("9. Démonstration en direct", "9. عرض تطبيقي مباشر"),
    timeRange: bi("74 – 82 min", "74 – 82 د"),
    durationMinutes: 8,
    title: bi(
      "Démonstration : Du Prompt au Prototype fonctionnel",
      "عرض حي: من التوجيه (Prompt) إلى نموذج أولي شغّال"
    ),
    subtitle: bi(
      "Une mini-application de lecture & compréhension 4AEP entièrement fonctionnelle hors ligne",
      "تطبيق مصغر للقراءة والفهم (4AEP) يشتغل بالكامل بدون إنترنت"
    ),
    kind: "live-demo",
    keyPoints: [
      bi(
        "Texte court contextualisé + 5 questions à choix multiples",
        "نص قصير من محيط التلميذ + 5 أسئلة اختيار من متعدد"
      ),
      bi(
        "Feedback automatique explicatif + score final + bouton « Recommencer »",
        "تغذية راجعة مفسرة تلقائياً + نتيجة نهائية + زر «إعادة المحاولة»"
      ),
      bi(
        "Inspectez les prompts exacts (FR & AR) qui ont permis de générer ce prototype",
        "اطّلعوا على التوجيهين الدقيقين (فرنسية وعربية) اللذين أنشآ هذا النموذج"
      ),
    ],
    darijaNote: {
      title: bi("Application en direct (Darija)", "تطبيق حي قدامكم (بالدارجة)"),
      fr: "Cette mini-application fonctionne sans Internet ni compte élève ; essayez-la et consultez le prompt source.",
      arabic:
        "هاد التطبيق الصغير ديال القراءة والفهم خدام بدون أنترنيت أو حسابات للتلاميذ. تقدرو تجربوه فالتيليفون ديالكم وتشوفو الـ Prompt اللي تصاوب بيه.",
    },
    techTerms: [
      {
        term: "Prompt-to-Prototype",
        explanation: bi(
          "Boucle itérative où l'on décrit le besoin pédagogique puis on teste et affine l'outil.",
          "مسار تكراري نصف فيه الحاجة التربوية ثم نجرب الأداة ونحسّنها."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "74:00 – 82:00",
      script: bi(
        "Jouons ensemble cette mini-application 4AEP, faisons une erreur volontaire pour observer le feedback pédagogique, puis ouvrons « Voir Prompt → Prototype ».",
        "لنجرب معاً هذا التطبيق المصغر للمستوى الرابع، ولنختر جواباً خاطئاً عمداً لملاحظة التفسير التربوي ثم نفتح زر التوجيه المصدري."
      ),
      classroomExample: bi(
        "Montrer le bouton Recommencer et expliquer qu'un enseignant peut changer le texte en une minute.",
        "إبراز زر الإعادة وشرح إمكانية استبدال النص خلال دقيقة واحدة."
      ),
      transition: bi(
        "Explorons maintenant notre Galerie de 12 catégories avant l'atelier en groupes.",
        "لنستكشف الآن معرض الـ 12 فئة قبل الانطلاق في ورشة المجموعات."
      ),
      discussionPrompt: bi(
        "Que changeriez-vous dans ce prototype pour l'adapter à votre classe ?",
        "ما التعديل الذي تقترحونه لملاءمة هذا النموذج مع قسمكم؟"
      ),
    },
  },

  // SECTION 10 (82-107 min)
  {
    id: "s10-gallery",
    sectionNumber: 10,
    sectionTitle: bi("10. Galerie & Atelier en groupes", "10. المعرض وورشة المجموعات"),
    timeRange: bi("82 – 90 min", "82 – 90 د"),
    durationMinutes: 8,
    title: bi(
      "Galerie d'applications pour l'école primaire publique",
      "معرض تطبيقات للمدرسة الابتدائية العمومية"
    ),
    subtitle: bi(
      "12 catégories ancrées dans nos classes + mini-applications interactives prêtes à tester",
      "12 فئة من واقع أقسامنا + تطبيقات مصغرة تفاعلية جاهزة للتجريب"
    ),
    kind: "gallery",
    keyPoints: [
      bi(
        "12 scénarios concrets : alphabétisation arabe, lecture FR, flashcards AR/FR, abaque C/D/U, remédiation 3 parcours, fiches A4, groupes...",
        "12 سيناريو عملياً: القراءة العربية، الفرنسية، بطاقات AR/FR، معداد م/ع/و، الدعم بـ 3 مسارات، أوراق A4، المجموعات..."
      ),
      bi(
        "Plusieurs démonstrateurs fonctionnels utilisables hors ligne et imprimables",
        "عدة نماذج شغّالة بدون إنترنت وقابلة للطباعة"
      ),
      bi(
        "Extension future possible vers l'Amazigh (Tifinagh) selon les besoins des classes",
        "إمكانية التوسع مستقبلاً إلى الأمازيغية (تيفيناغ) حسب حاجيات الأقسام"
      ),
    ],
    darijaNote: {
      title: bi("Galerie de Mediouna (Darija)", "معرض أفكار وتطبيقات مديونة (بالدارجة)"),
      fr: "Testez ici plusieurs mini-applications concrètes : lecture arabe, flashcards, blocs C/D/U, fiches A4 imprimables.",
      arabic:
        "تقدرو تجربو هنا عدة تطبيقات صغيرة خدامة مباشرة بحال القراءة بالعربية، البطاقات المزدوجة، المكعبات الحسابية C/D/U، ومولد الأوراق القابلة للطباعة.",
    },
    techTerms: [
      {
        term: "Offline-First",
        explanation: bi(
          "Fonctionne dans le navigateur une fois chargé, même si le réseau coupe.",
          "يشتغل في المتصفح حتى عند انقطاع الشبكة."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "82:00 – 90:00",
      script: bi(
        "Parcourez ces 12 catégories et testez quelques mini-applications fonctionnelles directement sur votre écran avant de former nos 4 groupes.",
        "تصفحوا هذه الفئات الـ 12 وجربوا بعض التطبيقات المصغرة مباشرة قبل توزيع المجموعات الأربع."
      ),
      classroomExample: bi(
        "Lancer la démo « Manipulations Mathématiques (C/D/U) » puis « Fiche imprimable A4 ».",
        "تشغيل نموذج «مناولات الرياضيات» ثم «مولد الورقة القابلة للطباعة A4»."
      ),
      transition: bi(
        "Passons maintenant aux 25 minutes d'atelier collaboratif en 4 groupes de 5 collègues.",
        "ننتقل الآن إلى 25 دقيقة من العمل التشاركي في 4 مجموعات من 5 زملاء."
      ),
      discussionPrompt: bi(
        "Quelle catégorie manque encore et mériterait d'être ajoutée par vos collègues ?",
        "ما الفئة الإضافية التي تقترحون إضافتها إلى هذا المعرض؟"
      ),
    },
  },
  {
    id: "s10-projects",
    sectionNumber: 10,
    sectionTitle: bi("10. Galerie & Atelier en groupes", "10. المعرض وورشة المجموعات"),
    timeRange: bi("90 – 103 min", "90 – 103 د"),
    durationMinutes: 13,
    title: bi(
      "Atelier en groupes (4 groupes × 5 collègues · 25 min)",
      "ورشة المجموعات (4 مجموعات × 5 زملاء · 25 دقيقة)"
    ),
    subtitle: bi(
      "Cahier des charges guidé, personnalisable par niveau/discipline, avec prompts FR/AR et checklists",
      "دفتر تحملات موجه وقابل للتخصيص حسب المستوى والمادة، مع توجيهات FR/AR ولوائح التحقق"
    ),
    kind: "group-projects",
    keyPoints: [
      bi(
        "Groupe 1 : Lecture & Compréhension (FR ou AR) · 5 questions · feedback",
        "المجموعة 1: القراءة والفهم (فرنسية أو عربية) · 5 أسئلة · تغذية راجعة"
      ),
      bi(
        "Groupe 2 : Mathématiques Interactives · décomposition · valeur positionnelle",
        "المجموعة 2: الرياضيات التفاعلية · التفكيك · القيمة المكانية"
      ),
      bi(
        "Groupe 3 : Remédiation 3 parcours (Base / Intermédiaire / Défi — logique TaRL)",
        "المجموعة 3: الدعم بـ 3 مسارات (أساسي / متوسط / تحدي — منطق TaRL)"
      ),
      bi(
        "Groupe 4 : Évaluation formative (5 Q) · erreurs fréquentes · résumé imprimable",
        "المجموعة 4: التقويم التكويني (5 أسئلة) · الأخطاء الشائعة · ملخص للطباعة"
      ),
    ],
    darijaNote: {
      title: bi("Travail en groupes (Darija)", "العمل في مجموعات (بالدارجة)"),
      fr: "Chaque groupe de 5 collègues construit un prototype simple et testable en 25 minutes, en personnalisant le niveau et la matière.",
      arabic:
        "كل مجموعة فيها 5 أساتذة كتخدم على نموذج أولي واحد (Prototype). تقدرو تبدلو المستوى أو المادة كيف بغيتو، وتستعملو الـ Prompt الجاهز بالعربية أو الفرنسية مع لائحة التحقق.",
    },
    techTerms: [
      {
        term: "MVP Prototype",
        explanation: bi(
          "Version essentielle testable en 25 minutes, sans chercher la perfection graphique.",
          "نسخة أساسية قابلة للتجريب خلال 25 دقيقة دون البحث عن الكمال الجمالي."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "90:00 – 103:00",
      script: bi(
        "Formons nos 4 groupes de 5 collègues. Rappel : nous concevons des prototypes testables en 25 minutes, pas des produits finis. Personnalisez niveau/matière/compétence et cochez la checklist.",
        "لنشكّل 4 مجموعات من 5 زملاء. نصمم نماذج أولية قابلة للاختبار في 25 دقيقة وليس منتجات نهائية. خصصوا المستوى والمادة واستعملوا لوائح التحقق."
      ),
      classroomExample: bi(
        "Aider chaque groupe à garder un périmètre réaliste : 1 court texte ou 5 questions max, zéro compte élève.",
        "مرافقة المجموعات للحفاظ على نطاق واقعي: نص قصير أو 5 أسئلة كحد أقصى."
      ),
      transition: bi(
        "Avant les présentations, votons pour le projet qui répond au besoin le plus urgent de votre école.",
        "قبل العروض، لنصوّت للمشروع الذي يلبي الحاجة الأكثر إلحاحاً في مدارسنا."
      ),
      discussionPrompt: bi(
        "Quel test minimum devez-vous valider avant la démonstration de 2 minutes ?",
        "ما الاختبار الأساسي الذي يجب التحقق منه قبل العرض؟"
      ),
    },
  },
  {
    id: "s10-vote",
    sectionNumber: 10,
    sectionTitle: bi("10. Galerie & Atelier en groupes", "10. المعرض وورشة المجموعات"),
    timeRange: bi("103 – 107 min", "103 – 107 د"),
    durationMinutes: 4,
    title: bi(
      "Vote : Quel projet testeriez-vous dès lundi ?",
      "تصويت: أي مشروع ستجربونه في القسم ابتداءً من الاثنين؟"
    ),
    subtitle: bi(
      "Vote en direct sur les 4 projets d'applications pédagogiques",
      "تصويت مباشر على مشاريع التطبيقات البيداغوجية الأربعة"
    ),
    kind: "poll",
    activityKey: "vote-project",
    keyPoints: [
      bi(
        "Choisissez le projet qui correspond le mieux au besoin prioritaire de votre classe",
        "اختاروا المشروع الأقرب إلى الأولوية الحالية لقسمكم"
      ),
      bi(
        "Résultats agrégés en direct à l'écran",
        "النتائج التجميعية مباشرة على الشاشة"
      ),
    ],
    darijaNote: {
      title: bi("Vote rapide (Darija)", "تصويت سريع (بالدارجة)"),
      fr: "Votez pour l'application qui aiderait le plus vos élèves dès cette semaine.",
      arabic:
        "صوتو على التطبيق اللي كتشوفوه غادي ينفع التلاميذ ديالكم أكثر ابتداءً من هاد الأسبوع.",
    },
    techTerms: [
      {
        term: "Peer Feedback",
        explanation: bi(
          "Évaluation collégiale entre praticiens sur l'utilité réelle en classe.",
          "تغذية راجعة بين الزملاء الممارسين حول الفائدة الميدانية."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "103:00 – 107:00",
      script: bi(
        "Votons en direct parmi les 4 projets : lequel répond le plus immédiatement à votre classe ?",
        "لنصوّت مباشرة على المشاريع الأربعة لنرى أيها يخدم أقسامكم أكثر."
      ),
      classroomExample: bi(
        "Commenter les préférences avant d'inviter le Groupe 1 à présenter.",
        "التعليق على النتائج قبل دعوة المجموعة 1 للتقديم."
      ),
      transition: bi(
        "Place au Showcase : 2 minutes par groupe pour présenter idée et prototype.",
        "ننتقل الآن إلى عرض المجموعات (Showcase): دقيقتان لكل مجموعة."
      ),
      discussionPrompt: bi(
        "Qu'est-ce qui explique votre vote pour ce projet ?",
        "ما السبب وراء اختياركم لهذا المشروع؟"
      ),
    },
  },

  // SECTION 11 (107-117 min)
  {
    id: "s11-showcase-vote",
    sectionNumber: 11,
    sectionTitle: bi("11. Présentations & Showcase", "11. العروض والمشاركة (Showcase)"),
    timeRange: bi("107 – 117 min", "107 – 117 د"),
    durationMinutes: 10,
    title: bi(
      "Showcase des groupes & Galerie Provinciale",
      "عرض المجموعات والمعرض الإقليمي التعاوني"
    ),
    subtitle: bi(
      "Chaque groupe présente son prototype (2 min) · Votes anonymisés dans 3 catégories + dépôt Galerie de Mediouna",
      "تقديم كل مجموعة لنموذجها (دقيقتان) · تصويت مجهول في 3 فئات + إيداع في معرض مديونة"
    ),
    kind: "showcase-vote",
    activityKey: "vote-showcase",
    keyPoints: [
      bi(
        "Application la plus utile · Meilleure idée pédagogique · Solution la plus créative",
        "التطبيق الأكثر فائدة · أفضل فكرة بيداغوجية · الحل الأكثر إبداعاً"
      ),
      bi(
        "Les votes sont agrégés sans exposer de scores individuels",
        "تُجمع الأصوات بشكل إجمالي دون إظهار نقاط فردية"
      ),
      bi(
        "Enregistrez votre prototype dans la Galerie Collaborative Provinciale de Mediouna (zéro donnée élève)",
        "سجّلوا نموذجكم في المعرض التعاوني الإقليمي لمديونة (بدون أي معطيات للتلاميذ)"
      ),
    ],
    darijaNote: {
      title: bi("Présentations & votes (Darija)", "تقديم المشاريع والتصويت (بالدارجة)"),
      fr: "Chaque groupe présente son idée et son prototype, puis nous votons et publions nos fiches sans données d'élèves.",
      arabic:
        "كل مجموعة كتقدم الفكرة والتجربة ديالها. من بعد كنصوتو على التطبيق الأكثر فائدة، أحسن فكرة بيداغوجية، وأكثر حل إبداعي. وتقدرو تضيفو التطبيق فالمعرض التشاركي لمديونة.",
    },
    techTerms: [
      {
        term: "Provincial App Gallery",
        explanation: bi(
          "Répertoire collaboratif entre collègues de Mediouna, avec déclaration de confidentialité.",
          "دليل تعاوني بين أساتذة مديونة مع التزام صريح بعدم جمع بيانات التلاميذ."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "107:00 – 117:00",
      script: bi(
        "Chaque groupe dispose de 2 minutes. Collègues, votez dans les 3 catégories puis invitez un rapporteur par groupe à déposer la fiche dans la Galerie Provinciale de Mediouna.",
        "دقيقتان لكل مجموعة، ثم نصوّت في الفئات الثلاث وندعو مقرراً من كل مجموعة لنشر بطاقة النموذج في المعرض الإقليمي."
      ),
      classroomExample: bi(
        "Rappeler la case obligatoire confirmant l'absence totale de données personnelles d'élèves.",
        "التذكير بخانة التأكيد الإجبارية لغياب أي معطيات شخصية للتلاميذ."
      ),
      transition: bi(
        "Terminons ces deux heures avec votre engagement personnel de la semaine.",
        "لنختم هذه الورشة بالتزامكم العملي لهذا الأسبوع."
      ),
      discussionPrompt: bi(
        "Quelle amélioration simple ajouteriez-vous après les retours des collègues ?",
        "ما التحسين البسيط الذي ستضيفونه بعد ملاحظات الزملاء؟"
      ),
    },
  },

  // SECTION 12 (117-120 min)
  {
    id: "s12-exit-ticket",
    sectionNumber: 12,
    sectionTitle: bi("12. Conclusion & Engagement", "12. الخاتمة والالتزام العملي"),
    timeRange: bi("117 – 119 min", "117 – 119 د"),
    durationMinutes: 2,
    title: bi(
      "Ticket de sortie : Votre premier pas cette semaine",
      "تذكرة الخروج: خطوتكم الأولى هذا الأسبوع"
    ),
    subtitle: bi(
      "Quelle est une chose concrète que vous allez essayer avec l'IA dans votre classe cette semaine ?",
      "ما الشيء الملموس الواحد الذي ستجربونه بالذكاء الاصطناعي في قسمكم هذا الأسبوع؟"
    ),
    kind: "exit-ticket",
    activityKey: "exit-ticket",
    keyPoints: [
      bi(
        "Choisissez un domaine d'action et écrivez votre engagement en une phrase",
        "اختاروا مجالاً للعمل واكتبوا التزامكم في جملة واحدة"
      ),
      bi(
        "Le mur collectif anonymisé s'affiche en direct pour inspirer toute la salle",
        "يعرض الجدار التشاركي المجهول جميع الالتزامات لإلهام القاعة"
      ),
    ],
    darijaNote: {
      title: bi("Premier pas concret (Darija)", "خطوة عملية هاد الأسبوع (بالدارجة)"),
      fr: "Partagez en une phrase ce que vous allez tester cette semaine avec vos élèves ou dans vos préparations.",
      arabic:
        "شنو هي حاجة وحدة بسيطة وملموسة اللي غادي تجربوها هاد الأسبوع مع التلاميذ أو فالتحضير ديالكم؟",
    },
    techTerms: [
      {
        term: "Exit Ticket",
        explanation: bi(
          "Bilan rapide en fin de séance pour ancrer le passage à l'action.",
          "حصيلة سريعة في نهاية اللقاء لترسيخ الانتقال إلى التطبيق الفعلي."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "117:00 – 119:00",
      script: bi(
        "Écrivez en une phrase la chose concrète que vous allez tester dès cette semaine dans votre école.",
        "اكتبوا في جملة واحدة الخطوة الملموسة التي ستجربونها هذا الأسبوع في مدارسكم."
      ),
      classroomExample: bi(
        "Lire à voix haute trois engagements affichés sur le mur collectif.",
        "قراءة ثلاثة التزامات منشورة على الجدار التشاركي."
      ),
      transition: bi(
        "Clôturons sur notre message commun pour la province de Mediouna.",
        "لنختم برسالتنا المشتركة لإقليم مديونة."
      ),
      discussionPrompt: bi(
        "De quoi avez-vous besoin pour rester en lien après l'atelier ?",
        "ما الذي تحتاجونه لمواصلة التقاسم بعد هذه الورشة؟"
      ),
    },
  },
  {
    id: "s12-closing",
    sectionNumber: 12,
    sectionTitle: bi("12. Conclusion & Engagement", "12. الخاتمة والالتزام العملي"),
    timeRange: bi("119 – 120 min", "119 – 120 د"),
    durationMinutes: 1,
    title: bi(
      "Ensemble, bâtissons nos propres outils pédagogiques",
      "معاً، نبني أدواتنا البيداغوجية بأنفسنا"
    ),
    subtitle: bi(
      "Merci pour votre engagement · Centre de Digitalisation · Province de Mediouna",
      "شكراً لتفاعلكم والتزامكم · مركز الرقمنة · إقليم مديونة"
    ),
    kind: "closing",
    keyPoints: [
      bi(
        "1. Identifier un problème pédagogique réel",
        "1. تحديد إشكال بيداغوجي واقعي من القسم"
      ),
      bi(
        "2. Spécifier · 3. Prototyper · 4. Tester · 5. Améliorer · 6. Partager entre collègues",
        "2. توصيف دقيق · 3. نموذج أولي · 4. تجريب · 5. تحسين · 6. تقاسم بين الزملاء"
      ),
    ],
    darijaNote: {
      title: bi("Mot de la fin (Darija)", "كلمة الختام (بالدارجة)"),
      fr: "Merci chaleureusement à toutes et à tous : quand chaque enseignant teste et partage avec ses collègues, toute l'école publique à Mediouna y gagne.",
      arabic:
        "تبارك الله عليكم الزميلات والزملاء. القوة الحقيقية كاينة فالتعاون بيناتنا: ملي كل أستاذ كيجرب فكرة وكيتقاسمها، المدرسة العمومية فمديونة كلها كتربح.",
    },
    techTerms: [
      {
        term: "Open Sharing",
        explanation: bi(
          "Partager prototypes, prompts et retours d'expérience entre collègues.",
          "تقاسم النماذج الأولية والتوجيهات والتجارب بين الزملاء."
        ),
      },
    ],
    presenterNotes: {
      durationCue: "119:00 – 120:00",
      script: bi(
        "Merci pour votre énergie et votre créativité. Retenons : « Ne soyez pas seulement utilisateurs du numérique. Devenez créateurs de solutions pédagogiques. »",
        "شكراً على تفاعلكم وإبداعكم، ولنستحضر دائماً: «لا تكونوا مجرد مستعملين للتكنولوجيا الرقمية، بل كونوا صانعي حلول بيداغوجية.»"
      ),
      classroomExample: bi(
        "Laisser la citation finale projetée pendant les échanges de clôture.",
        "إبقاء القولة الختامية معروضة على الشاشة أثناء النقاشات الختامية."
      ),
      transition: bi(
        "Fin de l'atelier — penser à effacer les données participants si souhaité après bilan.",
        "نهاية الورشة — تذكير بخيار مسح معطيات المشاركين بعد استخلاص الحصيلة."
      ),
      discussionPrompt: bi(
        "Quel prochain mini-atelier aimeriez-vous organiser entre écoles ?",
        "ما الورشة المصغرة المقبلة التي ترغبون في تنظيمها بين المؤسسات؟"
      ),
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
  title: BilingualText;
  timeRange: BilingualText;
  firstSlideId: string;
}> {
  const map = new Map<
    number,
    {
      sectionNumber: number;
      title: BilingualText;
      timeRange: BilingualText;
      firstSlideId: string;
    }
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
