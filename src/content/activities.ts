import { bi, type ActivityDefinition } from "./types";

export const ACTIVITIES: Record<string, ActivityDefinition> = {
  "poll-needs": {
    key: "poll-needs",
    sectionNumber: 2,
    type: "poll",
    title: bi(
      "Votre défi prioritaire au quotidien",
      "التحدي الأولوي في ممارستكم اليومية"
    ),
    instruction: bi(
      "Chers collègues, quel aspect de votre pratique au primaire vous demande aujourd'hui le plus de temps ou d'énergie ?",
      "زميلاتي وزملائي، ما الجانب من عملكم في التعليم الابتدائي الذي يأخذ منكم حالياً أكبر قدر من الوقت أو الجهد؟"
    ),
    options: [
      {
        id: "prep",
        label: bi("Préparation des cours", "تحضير الدروس والجذاذات"),
        shortLabel: bi("Préparation", "التحضير"),
        description: bi(
          "Fiches de séance, textes supports, progression.",
          "جذاذات الحصص، النصوص الداعمة، وتدرج التعلمات."
        ),
      },
      {
        id: "diff",
        label: bi("Différenciation pédagogique", "التفريق البيداغوجي"),
        shortLabel: bi("Différenciation", "التفريق"),
        description: bi(
          "Adapter les exercices aux différents rythmes des élèves.",
          "تكييف التمارين حسب وتيرة ومستوى كل متعلم."
        ),
      },
      {
        id: "eval",
        label: bi("Évaluation des élèves", "تقويم المتعلمين"),
        shortLabel: bi("Évaluation", "التقويم"),
        description: bi(
          "Diagnostics rapides, repérage des difficultés.",
          "روائز تشخيصية سريعة ورصد التعثرات."
        ),
      },
      {
        id: "corr",
        label: bi("Correction des exercices", "تصحيح التمارين"),
        shortLabel: bi("Correction", "التصحيح"),
        description: bi(
          "Retours constructifs sur les cahiers et devoirs.",
          "تغذية راجعة بناءة على الدفاتر والواجبات."
        ),
      },
      {
        id: "admin",
        label: bi("Gestion administrative", "التدبير الإداري"),
        shortLabel: bi("Administratif", "الإداري"),
        description: bi(
          "Comptes rendus, grilles, notes aux parents.",
          "المحاضر، شبكات التتبع، ومراسلات الأسر."
        ),
      },
      {
        id: "interactive",
        label: bi("Création d'activités interactives", "إعداد أنشطة تفاعلية"),
        shortLabel: bi("Activités", "الأنشطة"),
        description: bi(
          "Jeux, quiz projetables, manipulations visuelles.",
          "ألعاب تربوية، روائز للعرض، ومناولات بصرية."
        ),
      },
    ],
  },

  "quiz-genai": {
    key: "quiz-genai",
    sectionNumber: 3,
    type: "mcq_quiz",
    title: bi(
      "Vérifions nos repères sur l'IA générative",
      "نتحقق من معالمنا حول الذكاء الاصطناعي التوليدي"
    ),
    instruction: bi(
      "5 questions rapides pour consolider ensemble les notions clés avant de passer aux cas pratiques.",
      "5 أسئلة سريعة لتثبيت المفاهيم الأساسية معاً قبل الانتقال إلى الحالات التطبيقية."
    ),
    questions: [
      {
        id: "q1",
        prompt: bi(
          "Comment fonctionne principalement un Grand Modèle de Langage (LLM) ?",
          "كيف يشتغل النموذج اللغوي الكبير (LLM) بالأساس؟"
        ),
        darijaHint: "كيفاش كيخدم النموذج اللغوي الكبير؟",
        options: [
          {
            id: "a",
            label: bi(
              "Il consulte une base de manuels scolaires marocains figés",
              "يبحث في قاعدة ثابتة من الكتب المدرسية المغربية"
            ),
          },
          {
            id: "b",
            label: bi(
              "Il prédit les mots les plus probables selon le contexte du prompt",
              "يتنبأ بالكلمات الأكثر احتمالاً حسب سياق التوجيه (Prompt)"
            ),
          },
          {
            id: "c",
            label: bi(
              "Il comprend le monde humainement avec une conscience propre",
              "يفهم العالم بوعي ذاتي مثل الإنسان"
            ),
          },
        ],
        correctOptionId: "b",
        explanation: bi(
          "Un LLM génère du texte mot après mot (tokens) par calcul de probabilité à partir de son entraînement. Il ne « comprend » pas comme un enseignant et ne vérifie pas automatiquement la vérité.",
          "ينتج النموذج اللغوي الكبير النص كلمة تلو الأخرى (Tokens) عبر حساب الاحتمالات انطلاقاً من تدريبه. إنه لا «يفهم» كالأستاذ(ة) ولا يتحقق تلقائياً من صحة المعلومات."
        ),
      },
      {
        id: "q2",
        prompt: bi(
          "Qu'appelle-t-on une « hallucination » en IA générative ?",
          "ماذا نقصد بمصطلح «الهلوسة» (Hallucination) في الذكاء الاصطناعي التوليدي؟"
        ),
        darijaHint: "شنو كنعنيو بـ Hallucination؟",
        options: [
          {
            id: "a",
            label: bi("Une panne d'écran du vidéoprojecteur", "عطب تقني في شاشة المسلاط العاكس"),
          },
          {
            id: "b",
            label: bi(
              "Un refus de répondre pour raison de sécurité",
              "رفض الإجابة لأسباب تتعلق بالسلامة"
            ),
          },
          {
            id: "c",
            label: bi(
              "Une réponse fausse ou inventée formulée avec beaucoup d'assurance",
              "إجابة خاطئة أو مختلقة تُصاغ بثقة وأسلوب مقنع"
            ),
          },
        ],
        correctOptionId: "c",
        explanation: bi(
          "L'IA peut inventer une date, une règle ou une référence officielle de façon très convaincante. La relecture professionnelle de l'enseignant reste indispensable.",
          "قد يختلق الذكاء الاصطناعي تاريخاً أو قاعدة أو مرجعاً رسمياً بأسلوب مقنع جداً؛ لذا تبقى المراجعة المهنية للأستاذ(ة) ضرورية دائماً."
        ),
      },
      {
        id: "q3",
        prompt: bi(
          "Quel élément améliore le plus la pertinence d'une réponse pour une classe de 4AEP ?",
          "ما العنصر الذي يحسّن أكثر جودة وملاءمة الإجابة لقسم الرابع ابتدائي (4AEP)؟"
        ),
        options: [
          {
            id: "a",
            label: bi(
              "Écrire un mot-clé très court sans préciser le niveau",
              "كتابة كلمة مفتاحية قصيرة جداً دون تحديد المستوى"
            ),
          },
          {
            id: "b",
            label: bi(
              "Préciser le niveau, l'objectif, les contraintes et le format attendu",
              "تحديد المستوى، والهدف التعلمي، والشروط، والشكل المطلوب"
            ),
          },
          {
            id: "c",
            label: bi(
              "Ajouter trois points d'exclamation à la fin de la demande",
              "إضافة ثلاث علامات تعجب في نهاية الطلب"
            ),
          },
        ],
        correctOptionId: "b",
        explanation: bi(
          "Plus le contexte pédagogique (1AEP–6AEP, objectif précis, niveau réel des élèves, format) est explicite dans le prompt, plus le brouillon produit est exploitable.",
          "كلما كان السياق التربوي (1AEP–6AEP، الهدف الدقيق، المستوى الفعلي للتلاميذ، الصيغة) واضحاً في التوجيه، كانت المسودة المنتجة أكثر ملاءمة للاستثمار."
        ),
      },
      {
        id: "q4",
        prompt: bi(
          "Quelle est la bonne posture face à un exercice produit par l'IA ?",
          "ما الموقف التربوي السليم تجاه تمرين أنتجه الذكاء الاصطناعي؟"
        ),
        options: [
          {
            id: "a",
            label: bi(
              "Le considérer comme un brouillon de travail à relire, adapter et valider",
              "اعتباره مسودة عمل تجب قراءتها وتكييفها واعتمادها من طرف الأستاذ(ة)"
            ),
          },
          {
            id: "b",
            label: bi(
              "L'imprimer directement sans lecture préalable pour gagner du temps",
              "طباعته مباشرة دون مراجعة لربح الوقت"
            ),
          },
          {
            id: "c",
            label: bi(
              "Considérer qu'il est automatiquement conforme au programme officiel",
              "الافتراض أنه مطابق تلقائياً للمنهاج الرسمي"
            ),
          },
        ],
        correctOptionId: "a",
        explanation: bi(
          "L'IA fournit une première ébauche rapide. C'est votre expertise didactique et votre connaissance de vos élèves de Mediouna qui valident et ajustent le support.",
          "يقدم الذكاء الاصطناعي مسودة أولية سريعة، لكن خبرتكم الديداكتيكية ومعرفتكم بتلاميذكم في مديونة هي التي تعتمد وتكيّف الدعامة التربوية."
        ),
      },
      {
        id: "q5",
        prompt: bi(
          "Quelle différence distingue un simple texte généré d'une « application pédagogique » ?",
          "ما الفرق بين نص بسيط مولّد بالذكاء الاصطناعي و«تطبيق بيداغوجي»؟"
        ),
        options: [
          {
            id: "a",
            label: bi(
              "Aucune, les deux s'affichent uniquement dans ChatGPT",
              "لا فرق، كلاهما يُعرض داخل ChatGPT فقط"
            ),
          },
          {
            id: "b",
            label: bi(
              "Une application exige obligatoirement un compte payant pour chaque élève",
              "يتطلب التطبيق بالضرورة حساباً مدفوعاً لكل تلميذ"
            ),
          },
          {
            id: "c",
            label: bi(
              "Une application offre une interaction directe (boutons, feedback, score, manipulation)",
              "يوفر التطبيق تفاعلاً مباشراً (أزرار، تغذية راجعة، نتيجة، مناولة بصرية)"
            ),
          },
        ],
        correctOptionId: "c",
        explanation: bi(
          "Avec HTML, CSS et JavaScript générés par l'IA, on passe d'un texte statique à un petit outil interactif utilisable au projecteur ou sur tablette, même hors ligne.",
          "باستعمال HTML وCSS وJavaScript التي ينشئها الذكاء الاصطناعي، ننتقل من نص جامد إلى أداة تفاعلية صغيرة قابلة للاستعمال على المسلاط أو اللوحة حتى بدون إنترنت."
        ),
      },
    ],
  },

  "quiz-responsible": {
    key: "quiz-responsible",
    sectionNumber: 5,
    type: "tf_quiz",
    title: bi(
      "Vrai ou Faux : Usage responsable au primaire",
      "صحيح أم خطأ: الاستعمال المسؤول في التعليم الابتدائي"
    ),
    instruction: bi(
      "Pour chaque situation réaliste en école primaire, indiquez si la pratique est juste ou risquée.",
      "لكل وضعية واقعية من المدرسة الابتدائية، حددوا ما إذا كانت الممارسة سليمة أم محفوفة بالمخاطر."
    ),
    questions: [
      {
        id: "tf1",
        prompt: bi(
          "On peut saisir les noms complets et résultats nominatifs des élèves dans un outil d'IA public pour générer leurs bulletins.",
          "يمكن إدخال الأسماء الكاملة للتلاميذ ونتائجهم الاسمية في أداة ذكاء اصطناعي عمومية لإعداد بياناتهم."
        ),
        options: [
          { id: "true", label: bi("Vrai", "صحيح") },
          { id: "false", label: bi("Faux", "خطأ") },
        ],
        correctOptionId: "false",
        explanation: bi(
          "Faux : il ne faut jamais saisir de données personnelles d'élèves (noms, codes Massar, photos, situations familiales) dans des outils publics. Travaillez toujours avec des profils anonymisés (Élève A, Niveau 1).",
          "خطأ: يجب عدم إدخال أي معطيات شخصية للتلاميذ (الأسماء، أرقام مسار، الصور، الوضعيات الأسرية) في أدوات عمومية. استعملوا دائماً معطيات مجهولة (تلميذ أ، مستوى 1)."
        ),
      },
      {
        id: "tf2",
        prompt: bi(
          "Avant de projeter un texte historique ou scientifique généré par l'IA en 5AEP ou 6AEP, l'enseignant doit en vérifier chaque fait et chiffre.",
          "قبل عرض نص تاريخي أو علمي مولّد بالذكاء الاصطناعي في الخامس أو السادس ابتدائي، يجب على الأستاذ(ة) التحقق من كل معلومة ورقم."
        ),
        options: [
          { id: "true", label: bi("Vrai", "صحيح") },
          { id: "false", label: bi("Faux", "خطأ") },
        ],
        correctOptionId: "true",
        explanation: bi(
          "Vrai : en raison des hallucinations possibles, la vérification factuelle et la vérification du niveau lexical relèvent de la responsabilité de l'enseignant.",
          "صحيح: بسبب احتمال الهلوسات، يقع التحقق من الوقائع وملاءمة المعجم على عاتق الأستاذ(ة)."
        ),
      },
      {
        id: "tf3",
        prompt: bi(
          "Si l'IA affirme qu'une fiche respecte « le programme marocain officiel », on peut lui faire confiance sans consulter son manuel ou ses références.",
          "إذا أكد الذكاء الاصطناعي أن الجذاذة تحترم «المنهاج المغربي الرسمي»، يمكن الوثوق به دون مراجعة المقرر أو المراجع."
        ),
        options: [
          { id: "true", label: bi("Vrai", "صحيح") },
          { id: "false", label: bi("Faux", "خطأ") },
        ],
        correctOptionId: "false",
        explanation: bi(
          "Faux : l'IA peut inventer ou confondre des programmes de différents pays. L'enseignant doit toujours fournir lui-même l'objectif, la compétence ou l'extrait du manuel.",
          "خطأ: قد يختلق الذكاء الاصطناعي أو يخلط بين برامج دول مختلفة. يجب أن يزوّده الأستاذ(ة) دائماً بالهدف أو الكفاية أو مقتطف الدرس."
        ),
      },
      {
        id: "tf4",
        prompt: bi(
          "Plus une application éducative demande de comptes élèves et de vidéos lourdes, plus elle est efficace dans nos classes à Mediouna.",
          "كلما تطلب التطبيق التربوي حسابات للتلاميذ وفيديوهات ثقيلة، كان أكثر فعالية في أقسامنا بمديونة."
        ),
        options: [
          { id: "true", label: bi("Vrai", "صحيح") },
          { id: "false", label: bi("Faux", "خطأ") },
        ],
        correctOptionId: "false",
        explanation: bi(
          "Faux : dans un contexte d'équipement variable et de connexion parfois instable, un outil léger, sans compte élève, utilisable au projecteur ou imprimable est bien plus fiable.",
          "خطأ: في سياق تجهيز متفاوت واتصال غير مستقر أحياناً، تكون الأداة الخفيفة دون حساب تلميذ، والصالحة للعرض أو الطباعة، أكثر موثوقية."
        ),
      },
      {
        id: "tf5",
        prompt: bi(
          "L'IA peut proposer 3 niveaux d'exercices pour soutenir l'hétérogénéité de la classe, mais c'est l'enseignant qui choisit la pertinence pédagogique.",
          "يمكن للذكاء الاصطناعي اقتراح 3 مستويات من التمارين لمراعاة الفروق الفردية، لكن الأستاذ(ة) هو من يقرر الملاءمة البيداغوجية."
        ),
        options: [
          { id: "true", label: bi("Vrai", "صحيح") },
          { id: "false", label: bi("Faux", "خطأ") },
        ],
        correctOptionId: "true",
        explanation: bi(
          "Vrai : l'IA accélère la préparation différenciée (par exemple selon une logique d'adaptation au niveau réel des élèves), mais le jugement pédagogique reste humain.",
          "صحيح: يسرّع الذكاء الاصطناعي إعداد التمارين المتدرجة (وفق منطق الملاءمة مع المستوى الفعلي للمتعلم)، لكن التقدير البيداغوجي يظل إنسانياً."
        ),
      },
    ],
  },

  "builder-prompt": {
    key: "builder-prompt",
    sectionNumber: 6,
    type: "prompt_builder",
    title: bi(
      "Prompt Builder · Contexte Primaire Marocain",
      "مُنشئ التوجيهات (Prompt Builder) · سياق الابتدائي المغربي"
    ),
    instruction: bi(
      "Renseignez les éléments pédagogiques de votre classe (1AEP–6AEP) pour assembler un prompt structuré en français et en arabe, prêt à copier.",
      "املؤوا العناصر البيداغوجية لقسمكم (1AEP–6AEP) لتجميع توجيه منظم بالفرنسية والعربية جاهز للنسخ."
    ),
  },

  "exercise-metaprompt": {
    key: "exercise-metaprompt",
    sectionNumber: 7,
    type: "meta_prompt",
    title: bi(
      "Exercice pratique : Méta-Prompt FR / AR",
      "تمرين تطبيقي: الميتا-برومبت (فرنسية / عربية)"
    ),
    instruction: bi(
      "Partez d'une idée brute de votre classe et générez un méta-prompt qui pousse l'IA à vous poser les bonnes questions avant de produire.",
      "انطلقوا من فكرة أولية من قسمكم وأنشئوا ميتا-برومبت يدفع الذكاء الاصطناعي لطرح الأسئلة الدقيقة قبل الإنتاج."
    ),
  },

  "vote-project": {
    key: "vote-project",
    sectionNumber: 10,
    type: "project_vote",
    title: bi(
      "Quel projet d'application vous parle le plus ?",
      "أي مشروع تطبيق يلامس حاجتكم أكثر؟"
    ),
    instruction: bi(
      "Votez pour le prototype de groupe que vous aimeriez tester en priorité dans votre classe.",
      "صوّتوا للنموذج الأولي الذي ترغبون في تجريبه أولاً داخل قسمكم."
    ),
    options: [
      {
        id: "group1",
        label: bi(
          "Groupe 1 · Lecture & Compréhension (FR/AR)",
          "المجموعة 1 · القراءة والفهم (فرنسية/عربية)"
        ),
        shortLabel: bi("G1 Lecture", "م1 القراءة"),
        description: bi(
          "Texte court + 5 questions + correction & feedback.",
          "نص قصير + 5 أسئلة + تصحيح فوري وتغذية راجعة."
        ),
      },
      {
        id: "group2",
        label: bi(
          "Groupe 2 · Mathématiques Interactives",
          "المجموعة 2 · الرياضيات التفاعلية"
        ),
        shortLabel: bi("G2 Maths", "م2 الرياضيات"),
        description: bi(
          "Décomposition, valeur positionnelle et calculs visuels.",
          "التفكيك، القيمة المكانية، وحسابات بصرية."
        ),
      },
      {
        id: "group3",
        label: bi(
          "Groupe 3 · Remédiation 3 Parcours (TaRL)",
          "المجموعة 3 · الدعم بـ 3 مسارات (TaRL)"
        ),
        shortLabel: bi("G3 Remédiation", "م3 الدعم"),
        description: bi(
          "Base, Intermédiaire, Défi avec difficulté pilotée.",
          "أساسي، متوسط، تحدي بصعوبة يتحكم فيها الأستاذ(ة)."
        ),
      },
      {
        id: "group4",
        label: bi(
          "Groupe 4 · Évaluation Formative & Imprimable",
          "المجموعة 4 · التقويم التكويني القابل للطباعة"
        ),
        shortLabel: bi("G4 Évaluation", "م4 التقويم"),
        description: bi(
          "5 questions + erreurs fréquentes + résumé imprimable.",
          "5 أسئلة + الأخطاء الشائعة + ملخص للطباعة A4."
        ),
      },
    ],
  },

  "vote-showcase": {
    key: "vote-showcase",
    sectionNumber: 11,
    type: "showcase_vote",
    title: bi(
      "Votes Showcase des 4 Groupes",
      "تصويت عرض المجموعات الأربع (Showcase)"
    ),
    instruction: bi(
      "Après chaque présentation de groupe, attribuez vos coups de cœur dans les 3 catégories (votes agrégés et anonymisés).",
      "بعد تقديم كل مجموعة، اختاروا التطبيق المفضل في الفئات الثلاث (تصويت تجميعي ومجهول)."
    ),
    options: [
      {
        id: "group1",
        label: bi("Groupe 1 · Lecture & Compréhension", "المجموعة 1 · القراءة والفهم"),
        shortLabel: bi("Groupe 1", "المجموعة 1"),
      },
      {
        id: "group2",
        label: bi("Groupe 2 · Maths Interactives", "المجموعة 2 · الرياضيات التفاعلية"),
        shortLabel: bi("Groupe 2", "المجموعة 2"),
      },
      {
        id: "group3",
        label: bi("Groupe 3 · Remédiation 3 Parcours", "المجموعة 3 · الدعم بـ 3 مسارات"),
        shortLabel: bi("Groupe 3", "المجموعة 3"),
      },
      {
        id: "group4",
        label: bi("Groupe 4 · Évaluation Formative", "المجموعة 4 · التقويم التكويني"),
        shortLabel: bi("Groupe 4", "المجموعة 4"),
      },
    ],
    categories: [
      {
        id: "most_useful",
        label: bi("Application la plus utile en classe", "التطبيق الأكثر فائدة في القسم"),
        description: bi(
          "Répond immédiatement à un besoin concret du primaire à Mediouna.",
          "يستجيب فوراً لحاجة ملموسة في التعليم الابتدائي بمديونة."
        ),
      },
      {
        id: "best_pedagogy",
        label: bi("Meilleure idée pédagogique", "أفضل فكرة بيداغوجية"),
        description: bi(
          "Clarté de l'objectif, progressivité et attention portée aux élèves.",
          "وضوح الهدف، التدرج، والاهتمام بحاجات المتعلمين."
        ),
      },
      {
        id: "most_creative",
        label: bi("Solution la plus créative", "الحل الأكثر إبداعاً"),
        description: bi(
          "Ingéniosité dans l'interaction, le bilinguisme ou l'adaptation hors ligne.",
          "ابتكار في التفاعل، ثنائية اللغة، أو العمل بدون إنترنت."
        ),
      },
    ],
  },

  "exit-ticket": {
    key: "exit-ticket",
    sectionNumber: 12,
    type: "exit_ticket",
    title: bi(
      "Ticket de sortie · Engagement de la semaine",
      "تذكرة الخروج · التزام هذا الأسبوع"
    ),
    instruction: bi(
      "Quelle est une chose concrète que vous allez essayer avec l'IA dans votre classe cette semaine ?",
      "ما الشيء الملموس الواحد الذي ستجربونه باستعمال الذكاء الاصطناعي في قسمكم هذا الأسبوع؟"
    ),
    options: [
      {
        id: "prep",
        label: bi("Préparer une fiche ou un texte support", "إعداد جذاذة أو نص داعم"),
        shortLabel: bi("Préparation", "التحضير"),
      },
      {
        id: "diff",
        label: bi("Créer 3 niveaux d'exercices / remédiation", "إعداد 3 مستويات للتمارين أو الدعم"),
        shortLabel: bi("Différenciation", "التفريق"),
      },
      {
        id: "meta",
        label: bi("Utiliser le Méta-Prompt (FR ou AR)", "استعمال الميتا-برومبت (فرنسية أو عربية)"),
        shortLabel: bi("Méta-Prompt", "الميتا-برومبت"),
      },
      {
        id: "eval",
        label: bi("Concevoir une évaluation formative / fiche imprimable", "تصميم تقويم تكويني أو ورقة للطباعة"),
        shortLabel: bi("Évaluation", "التقويم"),
      },
      {
        id: "app",
        label: bi("Prototyper et tester une mini-app en classe", "تصميم وتجريب تطبيق مصغر في القسم"),
        shortLabel: bi("Mini-App", "تطبيق مصغر"),
      },
    ],
  },
};

export function getActivityByKey(key: string | null | undefined): ActivityDefinition | null {
  if (!key) return null;
  return ACTIVITIES[key] ?? null;
}
