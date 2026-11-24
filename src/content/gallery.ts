import { bi, type GalleryCategoryItem, type GroupProjectGuide } from "./types";

export const GALLERY_CATEGORIES: GalleryCategoryItem[] = [
  {
    id: "cat-arabic-literacy",
    number: 1,
    title: bi(
      "Alphabétisation arabe & reconnaissance des lettres",
      "محو الأمية القرائية بالعربية وتعرّف الحروف"
    ),
    problem: bi(
      "Les élèves de 1AEP–2AEP confondent souvent la forme des lettres selon leur position (début, milieu, fin) et les voyelles courtes.",
      "يخلط تلاميذ الأول والثاني ابتدائي غالباً بين أشكال الحروف حسب موقعها (البداية، الوسط، النهاية) والحركات القصيرة."
    ),
    gradeRange: "1AEP – 2AEP",
    subject: bi("Langue Arabe", "اللغة العربية"),
    learningObjective: bi(
      "Reconnaître une lettre cible dans ses positions et lire des syllabes simples avec فتحة / ضمة / كسرة.",
      "تعرّف الحرف المستهدف في مختلف مواضعه وقراءة مقاطع بسيطة بالحركات القصيرة والمدود."
    ),
    proposedFeatures: [
      bi(
        "Affichage RTL grand format lisible du fond de la classe",
        "عرض من اليمين إلى اليسار بحجم كبير مقروء من آخر القسم"
      ),
      bi(
        "Sélecteur de lettre + voyelle courte interactive",
        "اختيار تفاعلي للحرف مع الحركات القصيرة والمد"
      ),
      bi(
        "Mode hors ligne et zéro audio obligatoire",
        "يعمل بدون إنترنت ولا يشترط الصوت"
      ),
    ],
    exampleInteraction: bi(
      "L'enseignant sélectionne « ب » puis clique sur chaque voyelle pour faire lire la classe en chœur : بَ · بِ · بُ.",
      "يختار الأستاذ(ة) حرف «ب» ثم ينقر على كل حركة لقراءة المقاطع جماعياً: بَ · بِ · بُ."
    ),
    possibleImprovements: [
      bi(
        "Ajouter les lettres proches (ت، ث، ن) en mode contraste visuel",
        "إضافة الحروف المتشابهة (ت، ث، ن) مع تمييز بصري"
      ),
      bi(
        "Exporter une bande d'entraînement imprimable",
        "تصدير شريط تدريب قابل للطباعة"
      ),
    ],
    demoKey: "arabic-literacy",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-french-reading",
    number: 2,
    title: bi(
      "Lecture & compréhension en français",
      "القراءة والفهم باللغة الفرنسية"
    ),
    problem: bi(
      "Difficile d'animer une compréhension de texte interactive avec 35+ élèves sans photocopier de longs dossiers à chaque séance.",
      "يصعب تنشيط فهم المقروء بشكل تفاعلي مع أكثر من 35 تلميذاً دون نسخ أوراق كثيرة في كل حصة."
    ),
    gradeRange: "3AEP – 6AEP",
    subject: bi("Français", "اللغة الفرنسية"),
    learningObjective: bi(
      "Prélever des informations explicites et implicites dans un texte court et justifier sa réponse.",
      "استخراج معلومات صريحة وضمنية من نص قصير وتبرير الإجابة."
    ),
    proposedFeatures: [
      bi(
        "Texte aéré projetable paragraphe par paragraphe",
        "نص مريح بصرياً قابل للعرض فقرة بفقرة"
      ),
      bi(
        "5 QCM avec justification affichée à la demande",
        "5 أسئلة اختيار من متعدد مع عرض التبرير عند الطلب"
      ),
      bi(
        "Score collectif ou individuel sans compte élève",
        "نتيجة جماعية أو فردية دون حسابات للتلاميذ"
      ),
    ],
    exampleInteraction: bi(
      "La classe lit le récit au projecteur, vote à main levée pour chaque question puis découvre l'explication ciblée.",
      "يقرأ القسم النص على المسلاط، ويصوّت التلاميذ برفع الأيدي ثم يظهر التفسير المركز."
    ),
    possibleImprovements: [
      bi(
        "Surlignage automatique du passage justificatif dans le texte",
        "تظليل الفقرة الدالة على الجواب تلقائياً داخل النص"
      ),
      bi("Banque de 3 textes adaptés par trimestre", "رصيد من 3 نصوص ملائمة لكل أسدوس"),
    ],
    demoKey: "french-reading",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-vocab-flashcards",
    number: 3,
    title: bi(
      "Vocabulaire par flashcards Arabe / Français",
      "تعلّم المفردات ببطاقات العربية / الفرنسية"
    ),
    problem: bi(
      "Les élèves comprennent souvent une notion en arabe mais peinent à mémoriser son équivalent lexical en français (et inversement).",
      "يفهم التلاميذ المفهوم بالعربية غالباً لكنهم يجدون صعوبة في تذكّر مقابله بالفرنسية (والعكس)."
    ),
    gradeRange: "2AEP – 5AEP",
    subject: bi("Bilingue AR / FR", "ثنائي اللغة عربية / فرنسية"),
    learningObjective: bi(
      "Mémoriser le lexique thématique de l'école, des nombres et des sciences dans les deux langues.",
      "حفظ معجم المدرسة والأعداد والعلوم باللغتين."
    ),
    proposedFeatures: [
      bi(
        "Cartes recto/verso (Français LTR ↔ Arabe RTL voyellé)",
        "بطاقات بوجهين (فرنسية LTR ↔ عربية RTL مشكولة)"
      ),
      bi("Indice contextuel en phrase courte", "قرينة سياقية في جملة قصيرة"),
      bi(
        "Bouton « Maîtrisé / À revoir » pour le rituel du matin",
        "زر «متمكّن / للمراجعة» لطقوس بداية الحصة"
      ),
    ],
    exampleInteraction: bi(
      "En 5 minutes d'échauffement, l'enseignant affiche la face arabe, laisse les élèves formuler en français puis retourne la carte.",
      "خلال 5 دقائق تمهيدية، يعرض الأستاذ(ة) الوجه العربي ليعبّر التلاميذ بالفرنسية ثم يقلب البطاقة."
    ),
    possibleImprovements: [
      bi(
        "Extension optionnelle vers quelques mots usuels en Amazigh (Tifinagh) selon le besoin",
        "إمكانية التوسع اختيارياً نحو كلمات أمازيغية (تيفيناغ) عند الحاجة"
      ),
      bi("Jeu d'appariement rapide sur tablette partagée", "لعبة مطابقة سريعة على لوحة مشتركة"),
    ],
    demoKey: "vocab-flashcards",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-math-manipulatives",
    number: 4,
    title: bi(
      "Manipulations mathématiques (droite, C/D/U, abaque, fractions)",
      "مناولات الرياضيات (المستقيم العددي، م/ع/و، المعداد، الكسور)"
    ),
    problem: bi(
      "Manque de matériel concret en quantité suffisante pour visualiser les centaines, dizaines, unités et fractions dans une classe nombreuse.",
      "نقص الوسائل الملموسة الكافية لتجسيد المئات والعشرات والوحدات والكسور في قسم مكتظ."
    ),
    gradeRange: "1AEP – 5AEP",
    subject: bi("Mathématiques", "الرياضيات"),
    learningObjective: bi(
      "Associer une quantité visuelle (cubes, barres, parts) à son écriture chiffrée et sa décomposition.",
      "ربط الكمية البصرية (مربعات، قضبان، أجزاء) بكتابتها الرقمية وتفكيكها."
    ),
    proposedFeatures: [
      bi(
        "Blocs interactifs C / D / U cliquables sur projecteur",
        "مكعبات مئات/عشرات/وحدات تفاعلية بالنقر على الشاشة"
      ),
      bi(
        "Visualiseur de fractions simples par partage équitable",
        "مُجسّد للكسور البسيطة بالتقسيم المتساوي"
      ),
      bi("Droite numérique graduée réglable", "مستقيم عددي مدرج قابل للضبط"),
    ],
    exampleInteraction: bi(
      "Un élève vient au PC de l'enseignant composer « 234 » avec 2 plaques de 100, 3 barres de 10 et 4 unités.",
      "يصعد تلميذ لتركيب العدد «234» باستعمال صفيحتي مئة و3 قضبان عشرة و4 وحدات."
    ),
    possibleImprovements: [
      bi("Mode défi chronométré sans pression négative", "تحدٍّ مضبوط بالزمن دون ضغط سلبي"),
      bi("Génération de vignettes à coller sur cahier", "إنتاج قصاصات للّصق في الدفتر"),
    ],
    demoKey: "math-manipulatives",
    offlineReady: true,
    printFriendly: false,
  },
  {
    id: "cat-calculation",
    number: 5,
    title: bi(
      "Entraînement interactif au calcul",
      "التدريب التفاعلي على الحساب"
    ),
    problem: bi(
      "Le calcul mental quotidien devient répétitif et s'adapte peu aux écarts de rapidité entre élèves.",
      "يصير الحساب الذهني اليومي روتينياً وقليل التكيف مع تفاوت السرعة بين المتعلمين."
    ),
    gradeRange: "1AEP – 6AEP",
    subject: bi("Mathématiques", "الرياضيات"),
    learningObjective: bi(
      "Automatiser les tables d'addition, de soustraction et de multiplication avec feedback immédiat.",
      "ترسيخ جداول الجمع والطرح والضرب مع تغذية راجعة فورية."
    ),
    proposedFeatures: [
      bi("Générateur progressif d'opérations sans connexion", "مولد متدرج للعمليات بدون إنترنت"),
      bi("Contrôle de la plage numérique par l'enseignant", "ضبط مجال الأعداد من طرف الأستاذ(ة)"),
      bi("Correction étape par étape de la retenue", "تصحيح الاحتفاظ خطوة بخطوة"),
    ],
    exampleInteraction: bi(
      "L'enseignant choisit le palier « retenue sur dizaines », lance 5 calculs rapides et vérifie les ardoises.",
      "يختار الأستاذ(ة) مستوى «الاحتفاظ في العشرات»، يطلق 5 عمليات سريعة ويتحقق من الألواح."
    ),
    possibleImprovements: [
      bi("Ajout de problèmes courts contextualisés", "إضافة مسائل قصيرة من المحيط المعيش"),
      bi("Option d'impression de séries A/B anti-copie", "طباعة نموذجين أ/ب للتقويم"),
    ],
    demoKey: "math-manipulatives",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-remediation",
    number: 6,
    title: bi(
      "Exercices différenciés & remédiation (3 parcours)",
      "تمارين فارقية ودعم تربوي (3 مسارات)"
    ),
    problem: bi(
      "Dans une même classe de 35 élèves, certains maîtrisent déjà l'objectif tandis que d'autres ont besoin de consolider les prérequis (logique TaRL).",
      "في قسم واحد من 35 تلميذاً، يتمكن البعض من الهدف بينما يحتاج آخرون لتثبيت المكتسبات القبلية (منطق TaRL)."
    ),
    gradeRange: "2AEP – 6AEP",
    subject: bi("Français / Arabe / Maths", "الفرنسية / العربية / الرياضيات"),
    learningObjective: bi(
      "Permettre à chaque élève de progresser sur une compétence ciblée selon son niveau réel : Base, Intermédiaire ou Défi.",
      "تمكين كل متعلم من التقدم في كفاية محددة وفق مستواه الفعلي: أساسي، متوسط، أو تحدي."
    ),
    proposedFeatures: [
      bi("Sélecteur enseignant Base / Intermédiaire / Défi", "تحكم الأستاذ(ة) في المسار: أساسي / متوسط / تحدي"),
      bi("Feedback explicatif immédiat sans sanction", "تغذية راجعة مفسرة ومشجعة فوراً"),
      bi("Aucune comparaison publique entre élèves", "دون أي مقارنة علنية بين التلاميذ"),
    ],
    exampleInteraction: bi(
      "Après un court diagnostic, l'enseignant projette successivement les consignes Base et Intermédiaire pendant que les avancés traitent le Défi.",
      "بعد تشخيص سريع، يعرض الأستاذ(ة) تعليمات المسار الأساسي والمتوسط بينما ينجز المتقدمون مسار التحدي."
    ),
    possibleImprovements: [
      bi(
        "Historique local de progression sur l'appareil de l'enseignant",
        "تتبع محلي للتقدم على جهاز الأستاذ(ة)"
      ),
      bi("Fiches imprimables associées par palier", "أوراق مطبوعة مرافقة لكل مسار"),
    ],
    demoKey: "remediation-tarl",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-dictation",
    number: 7,
    title: bi(
      "Dictée interactive & orthographe",
      "الإملاء التفاعلي والرسم الإملائي"
    ),
    problem: bi(
      "Corriger 38 dictées prend un temps considérable et les élèves oublient vite les règles d'accord ou les lettres muettes.",
      "يستغرق تصحيح 38 إملاءً وقتاً طويلاً وسرعان ما ينسى التلاميذ قواعد التوافق أو التاء المربوطة."
    ),
    gradeRange: "3AEP – 6AEP",
    subject: bi("Français / Arabe", "الفرنسية / العربية"),
    learningObjective: bi(
      "Identifier les graphies correctes et justifier les accords simples (genre, nombre, terminaisons).",
      "تحديد الرسم الصحيح وتبرير التوافقات البسيطة والتاءات."
    ),
    proposedFeatures: [
      bi(
        "Mode texte à trous orthographique projetable (sans audio obligatoire)",
        "نص بملء الفراغات الإملائية للعرض (لا يتطلب صوتاً)"
      ),
      bi(
        "Mise en évidence colorée des accords sujet-verbe",
        "تلوين دلالي للعلاقة بين الفاعل والفعل"
      ),
      bi("Auto-correction guidée sur cahier", "تصحيح ذاتي موجه على الدفتر"),
    ],
    exampleInteraction: bi(
      "L'enseignant dicte la phrase oralement puis affiche l'analyse pas à pas des terminaisons pour que chaque élève corrige au stylo vert.",
      "يملي الأستاذ(ة) الجملة شفهياً ثم يعرض تحليل النهايات خطوة بخطوة ليصحح كل تلميذ بالقلم الأخضر."
    ),
    possibleImprovements: [
      bi("Générateur de listes de mots hebdomadaires", "مولد لوائح كلمات أسبوعية"),
      bi(
        "Version arabe pour التاء المربوطة والمبسوطة",
        "نسخة عربية خاصة بالتاء المربوطة والمبسوطة والهمزة"
      ),
    ],
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-formative",
    number: 8,
    title: bi(
      "Évaluation formative & tickets de sortie",
      "التقويم التكويني وتذاكر الخروج"
    ),
    problem: bi(
      "On découvre parfois les incompréhensions des élèves trop tard, lors du contrôle sommatif mensuel.",
      "أحياناً نكتشف تعثرات التلاميذ متأخراً عند المراقبة المستمرة الشهرية."
    ),
    gradeRange: "2AEP – 6AEP",
    subject: bi("Toutes disciplines", "جميع المواد"),
    learningObjective: bi(
      "Repérer en 5 minutes les erreurs fréquentes de la classe en fin de séance et adapter la leçon suivante.",
      "رصد الأخطاء الشائعة في القسم خلال 5 دقائق نهاية الحصة وتكييف الدرس الموالي."
    ),
    proposedFeatures: [
      bi(
        "5 questions diagnostiques ciblant des pièges typiques",
        "5 أسئلة تشخيصية تستهدف الأخطاء النمطية"
      ),
      bi(
        "Compteur rapide (ardoises / vote classe) des erreurs fréquentes",
        "عداد سريع لتكرار الأخطاء دون أسماء تلاميذ"
      ),
      bi("Résumé imprimable A4 de bilan de séance", "ملخص قابل للطباعة A4 لحصيلة الحصة"),
    ],
    exampleInteraction: bi(
      "En fin de séance, l'enseignant saisit le nombre d'élèves en difficulté par question (ex. 12/32 sur Q3) et imprime la note de remédiation.",
      "في نهاية الحصة، يدخل الأستاذ(ة) عدد المتعثرين في كل سؤال (مثلاً 12/32 في س3) ويطبع بطاقة الدعم."
    ),
    possibleImprovements: [
      bi("Export CSV anonyme des taux de réussite par item", "تصدير نسب النجاح المجهولة حسب كل سؤال"),
      bi("Modèles prêts en arabe et en français", "نماذج جاهزة بالعربية والفرنسية"),
    ],
    demoKey: "formative-assessment",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-printable-worksheets",
    number: 9,
    title: bi(
      "Générateur de fiches d'exercices imprimables",
      "مولد أوراق التمارين القابلة للطباعة"
    ),
    problem: bi(
      "De nombreuses classes n'ont pas de tablettes ou ont une connexion instable : le papier reste le support le plus universel.",
      "كثير من الأقسام لا تتوفر على لوحات رقمية أو تفتقر لاتصال مستقر: يبقى الورق الدعامة الأكثر شمولاً."
    ),
    gradeRange: "1AEP – 6AEP",
    subject: bi("Toutes disciplines", "جميع المواد"),
    learningObjective: bi(
      "Produire en 2 minutes une fiche A4 propre, lisible, économe en encre et adaptée à l'objectif du jour.",
      "إنتاج ورقة A4 نظيفة ومقروءة ومقتصدة للحبر خلال دقيقتين وفق هدف اليوم."
    ),
    proposedFeatures: [
      bi(
        "Personnalisation titre, niveau, date, consigne et exercices",
        "تخصيص العنوان والمستوى والتاريخ والتعليمة والتمارين"
      ),
      bi(
        "Mise en page @media print sans menus ni couleurs sombres",
        "تنسيق طباعة نظيف بدون قوائم أو خلفيات داكنة"
      ),
      bi("Corrigé enseignant séparé", "تصحيح منفصل للأستاذ(ة)"),
    ],
    exampleInteraction: bi(
      "L'enseignant choisit niveau 3AEP, thème Maths, règle les exercices puis clique sur « Imprimer / PDF ».",
      "يختار الأستاذ(ة) المستوى الثالث، موضوع الرياضيات، ثم ينقر على «طباعة / PDF»."
    ),
    possibleImprovements: [
      bi(
        "Option 2 demi-pages par feuille A4 pour réduire le coût papier",
        "خيار بطاقتين في صفحة A4 لتقليص استهلاك الورق"
      ),
      bi("Modèles RTL arabe natif", "نماذج عربية أصيلة من اليمين إلى اليسار"),
    ],
    demoKey: "printable-worksheet",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-group-maker",
    number: 10,
    title: bi(
      "Organisation de la classe & groupes aléatoires",
      "تنظيم القسم وتكوين المجموعات العشوائية"
    ),
    problem: bi(
      "Former rapidement des îlots équilibrés de 4 ou 5 élèves sans favoritisme ni perte de temps.",
      "تكوين مجموعات عمل متوازنة من 4 أو 5 تلاميذ بسرعة ودون تحيز أو ضياع للوقت."
    ),
    gradeRange: "1AEP – 6AEP",
    subject: bi("Vie de classe / Transversal", "الحياة المدرسية / عمل تعاوني"),
    learningObjective: bi(
      "Structurer des travaux de groupes coopératifs en 10 secondes sans enregistrer de données personnelles.",
      "تنظيم ورشات العمل التعاوني في 10 ثوانٍ دون حفظ أي معطيات شخصية."
    ),
    proposedFeatures: [
      bi(
        "Fonctionnement par numéros (Élève 1..36) sans données personnelles",
        "العمل بأرقام اللوائح (تلميذ 1..36) دون بيانات شخصية"
      ),
      bi(
        "Choix de la taille des groupes et rotation des rôles",
        "تحديد عدد أفراد المجموعة وتوزيع الأدوار"
      ),
      bi("Mode plein écran projecteur", "وضع ملء الشاشة للمسلاط العاكس"),
    ],
    exampleInteraction: bi(
      "L'enseignant saisit « 24 élèves, groupes de 4 » → l'outil tire des îlots équilibrés en un clic.",
      "يدخل الأستاذ(ة) «24 تلميذاً، مجموعات من 4» فتظهر المجموعات فوراً بنقرة واحدة."
    ),
    possibleImprovements: [
      bi("Minuteur visuel silencieux de 10 minutes intégré", "مؤقت بصري صامت مدمج لـ 10 دقائق"),
      bi("Bouton remélanger en un clic", "زر إعادة الخلط بنقرة واحدة"),
    ],
    demoKey: "group-maker",
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-science-sim",
    number: 11,
    title: bi(
      "Simulations simples d'Éveil Scientifique",
      "محاكاة مبسطة للنشاط العلمي"
    ),
    problem: bi(
      "Expliquer des phénomènes abstraits (cycle de l'eau, ombre et lumière, circuits simples) sans laboratoire équipé.",
      "تفسير ظواهر علمية (دورة الماء، الظل والضوء، الدارة الكهربائية) دون مختبر مجهز."
    ),
    gradeRange: "3AEP – 6AEP",
    subject: bi("Éveil Scientifique", "النشاط العلمي"),
    learningObjective: bi(
      "Observer une relation cause-effet (ex. température ↔ état de l'eau) et formuler une hypothèse.",
      "ملاحظة علاقة السبب والنتيجة (مثل الحرارة وحالات الماء) وصياغة فرضية."
    ),
    proposedFeatures: [
      bi("Schéma SVG interactif léger sans vidéo lourde", "رسم تفاعلي خفيف SVG بدون فيديو ثقيل"),
      bi("Curseur de test d'hypothèse avant observation", "منزلق لاختبار الفرضية قبل الملاحظة"),
      bi("Lexique bilingue FR / AR des phénomènes", "معجم ثنائي اللغة للظواهر العلمية"),
    ],
    exampleInteraction: bi(
      "Les élèves formulent une prédiction puis l'enseignant bouge le curseur sur le projecteur pour observer le résultat.",
      "يصوغ التلاميذ توقعاً ثم يحرك الأستاذ(ة) المؤشر على الشاشة لملاحظة النتيجة."
    ),
    possibleImprovements: [
      bi("Mini-simulations : germination, tri des matériaux, phases de la lune", "نماذج: الإنبات، فرز المواد، أطوار القمر"),
      bi("Fiche d'observation imprimable", "بطاقة ملاحظة قابلة للطباعة"),
    ],
    offlineReady: true,
    printFriendly: true,
  },
  {
    id: "cat-teacher-prep",
    number: 12,
    title: bi(
      "Outils de préparation & organisation enseignante",
      "أدوات التحضير والتنظيم البيداغوجي للأستاذ(ة)"
    ),
    problem: bi(
      "La planification hebdomadaire, les grilles d'observation et les notes de liaison prennent de précieuses soirées.",
      "يأخذ التخطيط الأسبوعي وشبكات الملاحظة ومذكرات التواصل وقتاً طويلاً خارج ساعات القسم."
    ),
    gradeRange: "1AEP – 6AEP",
    subject: bi("Préparation pédagogique", "التحضير والتدبير التربوي"),
    learningObjective: bi(
      "Structurer une trame de séance ou une grille d'observation critériée à partir d'un objectif choisi par l'enseignant.",
      "هيكلة خطاطة حصة أو شبكة ملاحظة بمعايير انطلاقاً من هدف يحدده الأستاذ(ة)."
    ),
    proposedFeatures: [
      bi(
        "Assistant structuré (Niveau, Compétence, Durée, Supports)",
        "مساعد منظم (المستوى، الكفاية، المدة، الدعامات)"
      ),
      bi(
        "Mention systématique « Brouillon à valider »",
        "تذكير دائم بأنها «مسودة للمراجعة والاعتماد»"
      ),
      bi("Export texte ou impression directe", "نسخ النص أو طباعته مباشرة"),
    ],
    exampleInteraction: bi(
      "L'enseignant assemble sa demande dans le Prompt Builder puis copie la trame obtenue dans son cahier journal.",
      "يركّب الأستاذ(ة) طلبه في Prompt Builder ثم ينسخ الخطاطة إلى دفتر التحضير."
    ),
    possibleImprovements: [
      bi(
        "Bibliothèque partagée de prompts validés entre collègues de Mediouna",
        "مكتبة مشتركة للتوجيهات المعتمدة بين زملاء مديونة"
      ),
      bi(
        "Modèles adaptés aux classes à niveaux multiples",
        "نماذج ملائمة للأقسام متعددة المستويات"
      ),
    ],
    offlineReady: true,
    printFriendly: true,
  },
];

export const GROUP_PROJECTS: GroupProjectGuide[] = [
  {
    id: "group1",
    groupLabel: bi("Groupe 1 (5 collègues)", "المجموعة 1 (5 زملاء)"),
    title: bi(
      "Application de Lecture & Compréhension (FR ou AR)",
      "تطبيق القراءة والفهم (فرنسية أو عربية)"
    ),
    subtitle: bi(
      "Texte court · 5 questions · Correction automatique · Score & feedback",
      "نص قصير · 5 أسئلة · تصحيح تلقائي · نتيجة وتغذية راجعة"
    ),
    defaultGrade: "4AEP",
    defaultSubject: bi("Français (LTR) ou Arabe (RTL)", "الفرنسية (LTR) أو العربية (RTL)"),
    defaultCompetency: bi(
      "Comprendre un texte narratif court et justifier ses réponses",
      "فهم نص سردي قصير وتبرير الإجابات"
    ),
    problemSolved: bi(
      "Permettre une séance de lecture interactive au vidéoprojecteur ou sur tablette partagée sans photocopies lourdes.",
      "تمكين حصة قراءة تفاعلية عبر المسلاط العاكس أو اللوحة المشتركة دون نسخ أوراق كثيرة."
    ),
    expectedOutcome: bi(
      "Un prototype fonctionnel en une page affichant 1 court texte (avec appui RTL si arabe), 5 QCM, un bouton de validation avec explication immédiate et un score final recommençable.",
      "نموذج أولي عملي في صفحة واحدة يعرض نصاً قصيراً (بدعم RTL للعربية)، و5 أسئلة اختيار من متعدد، وتصحيحاً فورياً بالتفسير، ونتيجة نهائية قابلة للإعادة."
    ),
    requiredFeatures: [
      bi("Texte court lisible à 6 mètres sur projecteur", "نص قصير مقروء على مسافة 6 أمتار على المسلاط"),
      bi("5 questions à choix multiples progressives", "5 أسئلة اختيار من متعدد متدرجة"),
      bi("Correction automatique + explication courte par question", "تصحيح تلقائي + تفسير موجز لكل سؤال"),
      bi("Score final + bouton « Recommencer »", "النتيجة النهائية + زر «إعادة المحاولة»"),
      bi("Zéro compte élève et fonctionnement 100 % navigateur (hors ligne)", "بدون حساب تلميذ ويعمل 100% في المتصفح (بدون إنترنت)"),
    ],
    learningObjectives: [
      bi("Identifier les personnages, le lieu et les actions clés", "تحديد الشخصيات والمكان والأحداث الرئيسية"),
      bi("Justifier une réponse en s'appuyant sur un indice du texte", "تبرير الإجابة بالاستناد إلى مؤشر من النص"),
    ],
    techSpec: [
      bi("1 fichier HTML autonome (ou composant React léger) sans appels API", "ملف HTML مستقل (أو مكون خفيف) بدون استدعاءات خارجية"),
      bi("Données des 5 questions stockées dans un tableau JS facile à modifier par l'enseignant", "تخزين الأسئلة في مصفوفة JS يسهل على الأستاذ(ة) تعديلها"),
      bi("Prise en charge dir='rtl' pour l'arabe et dir='ltr' pour le français", "دعم الاتجاه RTL للعربية وLTR للفرنسية"),
    ],
    testingChecklist: [
      bi("Le texte est lisible sans zoom excessif sur smartphone et projecteur", "النص مقروء بوضوح على الهاتف والمسلاط دون تكبير مفرط"),
      bi("Une bonne réponse affiche un feedback positif + explication", "الإجابة الصحيحة تعرض تغذية راجعة إيجابية مع التفسير"),
      bi("Une erreur affiche la bonne réponse sans bloquer la progression", "الخطأ يظهر الجواب الصحيح دون تعطيل التقدم"),
      bi("Le bouton Recommencer remet bien le score à 0", "زر الإعادة يرجع النتيجة إلى الصفر"),
    ],
    demoChecklist: [
      bi("Présenter en 2 minutes le problème de classe résolu", "تقديم الإشكال الصفي المعالَج في دقيقتين"),
      bi("Montrer une réponse correcte puis une erreur volontaire", "إظهار إجابة صحيحة ثم خطأ تجريبي لرؤية التفسير"),
      bi("Indiquer comment un collègue peut remplacer le texte en 30 secondes", "توضيح كيف يمكن لزميل(ة) تغيير النص في 30 ثانية"),
    ],
  },
  {
    id: "group2",
    groupLabel: bi("Groupe 2 (5 collègues)", "المجموعة 2 (5 زملاء)"),
    title: bi(
      "Mathématiques Interactives & Manipulation",
      "الرياضيات التفاعلية والمناولة البصرية"
    ),
    subtitle: bi(
      "Décomposition · Valeur positionnelle · Calculs simples · Progression",
      "التفكيك · القيمة المكانية · حسابات بسيطة · صعوبة متدرجة"
    ),
    defaultGrade: "3AEP",
    defaultSubject: bi("Mathématiques", "الرياضيات"),
    defaultCompetency: bi(
      "Décomposer et recomposer des nombres jusqu'à 999 avec support visuel",
      "تفكيك وتركيب الأعداد إلى حدود 999 بدعم بصري"
    ),
    problemSolved: bi(
      "Rendre visibles les centaines, dizaines et unités devant toute la classe quand on manque de matériel de manipulation.",
      "جعل المئات والعشرات والوحدات مرئية أمام جميع التلاميذ عند نقص وسائل المناولة الملموسة."
    ),
    expectedOutcome: bi(
      "Un atelier visuel où l'élève ou l'enseignant clique sur des blocs C / D / U pour construire un nombre, passer 3 niveaux de difficulté et vérifier instantanément.",
      "ورشة بصرية ينقر فيها التلميذ أو الأستاذ(ة) على مكعبات المئات/العشرات/الوحدات لتركيب العدد والمرور عبر 3 مستويات مع تحقق فوري."
    ),
    requiredFeatures: [
      bi("Représentation visuelle claire des centaines, dizaines, unités", "تمثيل بصري واضح للمئات والعشرات والوحدات"),
      bi("Mode décomposition (nombre → C + D + U) et calcul simple", "وضع التفكيك والكتابة الجمعية وحساب بسيط"),
      bi("Sélecteur de difficulté progressive (2 chiffres → 3 chiffres avec zéro)", "مختار صعوبة متدرجة (رقمان ← 3 أرقام مع الصفر)"),
      bi("Correction visuelle immédiate et bouton Nouveau défi", "تصحيح بصري فوري وزر تحدٍّ جديد"),
    ],
    learningObjectives: [
      bi("Distinguer chiffre des dizaines et nombre de dizaines", "التمييز بين رقم العشرات وعدد العشرات"),
      bi("Passer de la manipulation visuelle à l'écriture additive", "الانتقال من المناولة البصرية إلى الكتابة الجمعية"),
    ],
    techSpec: [
      bi("Blocs SVG ou HTML CSS légers (aucune image externe requise)", "مربعات SVG أو CSS خفيفة دون صور خارجية"),
      bi("Générateur aléatoire borné selon le palier choisi par l'enseignant", "مولد أعداد مضبوط حسب المستوى المختار"),
      bi("Boutons larges adaptés au doigt (tactile) et à la souris", "أزرار كبيرة ملائمة للمس والفأرة"),
    ],
    testingChecklist: [
      bi("Le compteur visuel correspond exactement au nombre affiché", "العداد البصري يطابق العدد المعروض بدقة"),
      bi("Le cas du zéro (ex. 305) fonctionne correctement", "حالة الصفر الوسيط (مثل 305) تشتغل بشكل سليم"),
      bi("Les 3 niveaux de difficulté modifient bien la taille des nombres", "مستويات الصعوبة الثلاثة تغيّر نطاق الأعداد فعلياً"),
    ],
    demoChecklist: [
      bi("Faire manipuler un nombre à 3 chiffres avec zéro intercalaire", "تطبيق مناولة لعدد من 3 أرقام يتضمن صفراً وسيطاً"),
      bi("Montrer le passage du niveau Base au niveau avancé", "إظهار الانتقال من المستوى الأساسي إلى المتقدم"),
      bi("Expliquer l'usage concret au vidéoprojecteur avec ardoises", "شرح الاستعمال العملي بالمسلاط مع ألواح التلاميذ"),
    ],
  },
  {
    id: "group3",
    groupLabel: bi("Groupe 3 (5 collègues)", "المجموعة 3 (5 زملاء)"),
    title: bi(
      "Application de Remédiation à 3 Parcours (TaRL)",
      "تطبيق الدعم التربوي بـ 3 مسارات (TaRL)"
    ),
    subtitle: bi(
      "1 compétence ciblée · Base, Intermédiaire, Défi · Difficulté pilotée",
      "كفاية محددة واحدة · أساسي، متوسط، تحدي · صعوبة يتحكم فيها الأستاذ(ة)"
    ),
    defaultGrade: "3AEP–5AEP",
    defaultSubject: bi("Soutien · Lecture ou Calcul", "الدعم · القراءة أو الحساب"),
    defaultCompetency: bi(
      "Consolider une compétence fondamentale selon le niveau réel de chaque élève",
      "ترسيخ كفاية أساسية حسب المستوى الفعلي لكل متعلم"
    ),
    problemSolved: bi(
      "Gérer efficacement l'hétérogénéité des acquis en atelier de soutien sans stigmatiser les élèves les plus fragiles.",
      "تدبير تفاوت المكتسبات في حصص الدعم بفعالية دون وصم المتعلمين المتعثرين."
    ),
    expectedOutcome: bi(
      "Une mini-application centrée sur une compétence unique, offrant 3 parcours (Base, Intermédiaire, Défi) pilotés par l'enseignant avec feedback immédiat.",
      "تطبيق مصغر يركز على كفاية واحدة، يوفر 3 مسارات (أساسي، متوسط، تحدي) بقيادة الأستاذ(ة) وتغذية راجعة فورية."
    ),
    requiredFeatures: [
      bi("Choix explicite de la compétence ciblée en haut d'écran", "عرض الكفاية المستهدفة بوضوح أعلى الشاشة"),
      bi("3 onglets/parcours : Base, Intermédiaire, Défi", "3 مسارات واضحة: أساسي، متوسط، تحدي"),
      bi("Exercices courts avec retour immédiat encourageant", "تمارين قصيرة بتغذية راجعة فورية مشجعة"),
      bi("Contrôle de la difficulté réservé à l'enseignant (pas de score punitif)", "تحكم الأستاذ(ة) في المستوى دون تنقيط محبط"),
    ],
    learningObjectives: [
      bi("Faire réussir chaque élève dès son palier de départ", "إنجاح كل تلميذ انطلاقاً من عتبة مستواه الحقيقي"),
      bi("Permettre le passage progressif vers le palier supérieur", "تيسير الانتقال التدريجي نحو المستوى الأعلى"),
    ],
    techSpec: [
      bi("Objet JS structuré par palier : { base, intermediaire, defi }", "بنية بيانات JS مقسمة حسب المسار الثلاثي"),
      bi("Transitions fluides et messages d'encouragement bienveillants", "انتقالات سلسة ورسائل تشجيعية إيجابية"),
      bi("Option impression A4 des exercices du palier actif", "خيار طباعة A4 لتمارين المسار المختار"),
    ],
    testingChecklist: [
      bi("Les 3 parcours proposent des exercices réellement gradués", "المسارات الثلاثة تقدم تمارين متدرجة فعلاً"),
      bi("Le feedback explique comment réussir plutôt que de sanctionner", "التغذية الراجعة تشرح طريقة الحل بدل العقاب"),
      bi("Aucun nom d'élève ni classement public n'est affiché", "لا يُعرض أي اسم تلميذ أو ترتيب علني"),
    ],
    demoChecklist: [
      bi("Nommer la compétence choisie par votre groupe", "تحديد الكفاية التي اختارتها مجموعتكم"),
      bi("Comparer un exercice du parcours Base et du parcours Défi", "مقارنة تمرين من المسار الأساسي مع مسار التحدي"),
      bi("Expliquer comment organiser 3 groupes en classe avec cet outil", "شرح كيفية تدبير 3 مجموعات داخل القسم بهذه الأداة"),
    ],
  },
  {
    id: "group4",
    groupLabel: bi("Groupe 4 (5 collègues)", "المجموعة 4 (5 زملاء)"),
    title: bi(
      "Évaluation Formative & Bilan Imprimable",
      "التقويم التكويني والحصيلة القابلة للطباعة"
    ),
    subtitle: bi(
      "5 questions · Feedback instantané · Erreurs fréquentes · Résumé A4",
      "5 أسئلة · تغذية فورية · رصد الأخطاء الشائعة · ملخص A4 للطباعة"
    ),
    defaultGrade: "5AEP",
    defaultSubject: bi("Mathématiques ou Français", "الرياضيات أو اللغة الفرنسية"),
    defaultCompetency: bi(
      "Diagnostiquer rapidement la compréhension en fin de séance",
      "تشخيص الفهم بسرعة في نهاية الحصة"
    ),
    problemSolved: bi(
      "Repérer immédiatement quelles notions posent problème à la majorité de la classe et garder une trace imprimable pour préparer la remédiation.",
      "رصد المفاهيم التي تعيق أغلبية القسم فوراً والاحتفاظ بأثر مطبوع لتحضير حصة الدعم."
    ),
    expectedOutcome: bi(
      "Un mini-quiz de 5 questions avec affichage des scores agrégés de la classe, identification des erreurs fréquentes et un résumé prêt à imprimer (@media print).",
      "رائز من 5 أسئلة مع عرض النتائج التجميعية للقسم وتحديد الأخطاء الشائعة وملخص جاهز للطباعة A4."
    ),
    requiredFeatures: [
      bi("5 questions ciblant chacune un distracteur / erreur fréquente précise", "5 أسئلة يستهدف كل منها خطأً شائعاً محدداً"),
      bi("Saisie rapide des réponses collectives ou test élève avec feedback", "إدخال سريع للإجابات الجماعية أو تجربة التلميذ بتغذية فورية"),
      bi("Bloc « Erreurs fréquentes repérées » avec piste de remédiation", "خانة «الأخطاء الشائعة المرصودة» مع اقتراح المعالجة"),
      bi("Bouton « Imprimer le résumé » optimisé A4", "زر «طباعة الملخص» مهيأ لورقة A4"),
    ],
    learningObjectives: [
      bi("Transformer l'erreur en information pédagogique exploitable dès le lendemain", "تحويل الخطأ إلى مؤشر بيداغوجي يستثمر في الحصة الموالية"),
      bi("Documenter le bilan de séance sans collecter de données personnelles d'élèves", "توثيق حصيلة الحصة دون جمع أي معطيات شخصية للتلاميذ"),
    ],
    techSpec: [
      bi("Chaque option erronée est taguée avec le type d'erreur", "ربط كل خيار خاطئ بنوع التعثر البيداغوجي"),
      bi("Tableau récapitulatif anonymisé des résultats par question", "جدول ملخص مجهول للنتائج حسب كل سؤال"),
      bi("Feuille de style @media print propre (noir sur blanc)", "تنسيق طباعة نظيف بالأبيض والأسود"),
    ],
    testingChecklist: [
      bi("Les 5 questions identifient clairement une erreur typique", "الأسئلة الخمسة تحدد بوضوح خطأً نموذجياً"),
      bi("Les compteurs agrégés se mettent à jour sans nom d'élève", "العدادات التجميعية تتحدث دون أي اسم تلميذ"),
      bi("L'aperçu avant impression produit une feuille A4 lisible et propre", "معاينة الطباعة تنتج ورقة A4 نظيفة ومقروءة"),
    ],
    demoChecklist: [
      bi("Simuler quelques réponses de classe montrant une erreur majoritaire sur Q3", "محاكاة إجابات القسم التي تظهر خطأً متكرراً في س3"),
      bi("Montrer le diagnostic généré automatiquement", "عرض التشخيص التلقائي الناتج"),
      bi("Afficher l'aperçu imprimable du résumé", "عرض معاينة الملخص القابل للطباعة"),
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
Projet du groupe : ${project.title.fr}
Niveau ciblé : ${grade}
Discipline : ${subject}
Compétence ciblée (fournie par l'enseignant) : ${competency}

Tâche : Crée un prototype léger en une seule page HTML/CSS/JavaScript autonome (sans appel API ni bibliothèque externe lourde) qui implémente :
${project.requiredFeatures.map((f) => `- ${f.fr}`).join("\n")}

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
المشروع: ${project.title.ar}
المستوى المستهدف: ${grade}
المادة: ${subject}
الكفاية المستهدفة: ${competency}

المطلوب: أنشئ نموذجاً أولياً (Prototype) خفيفاً في صفحة ويب واحدة (HTML/CSS/JavaScript) يعمل بدون إنترنت وبواجهة عربية واضحة من اليمين إلى اليسار (RTL)، ويتضمن:
${project.requiredFeatures.map((f) => `- ${f.ar}`).join("\n")}

شروط أساسية:
- خط كبير وواضح للقراءة من آخر القسم.
- عدم جمع أو تخزين أي معطيات شخصية للتلاميذ.
- هيكلة سهلة تتيح للأستاذ(ة) تعديل التمارين أو النص خلال دقائق.`;
}
