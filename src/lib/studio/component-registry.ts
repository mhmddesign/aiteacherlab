import type { BilingualText } from "@/content/types";
import type { ComponentTypeId, SlideElement, SlideElementStyle } from "./document-schema";

export type ComponentCategory = "general" | "interactive" | "primary" | "code";

export interface ComponentRegistryEntry {
  type: ComponentTypeId;
  category: ComponentCategory;
  label: BilingualText;
  description: BilingualText;
  iconName: string;
  supportsParticipantRuntime: boolean;
  activityType?:
    | "poll"
    | "mcq_quiz"
    | "tf_quiz"
    | "short_answer"
    | "word_cloud"
    | "flashcards"
    | "matching"
    | "ordering"
    | "group_task"
    | "exit_ticket";
  defaultSize: { width: number; height: number };
  defaultStyle: SlideElementStyle;
  defaultBilingual: BilingualText;
  defaultConfig: Record<string, unknown>;
}

const DEFAULT_LIGHT_STYLE: SlideElementStyle = {
  backgroundColor: "#FFFFFF",
  textColor: "#0B1220",
  borderColor: "#E9E3D6",
  borderWidth: 2,
  borderRadius: 16,
  fontSize: 28,
  fontWeight: "normal",
  textAlign: "left",
  padding: 28,
};

const TRANSPARENT_STYLE: SlideElementStyle = {
  backgroundColor: "transparent",
  textColor: "#0B1220",
  borderColor: "transparent",
  borderWidth: 0,
  borderRadius: 12,
  fontSize: 32,
  fontWeight: "normal",
  textAlign: "left",
  padding: 16,
};

export const COMPONENT_REGISTRY: Record<
  Exclude<ComponentTypeId, "unknown-element">,
  ComponentRegistryEntry
> = {
  heading: {
    type: "heading",
    category: "general",
    label: { fr: "Titre bilingue", ar: "عنوان ثنائي اللغة" },
    description: { fr: "Grand titre Fraunces + Arabe RTL", ar: "عنوان رئيسي بالفرنسية والعربية" },
    iconName: "Heading",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1400, height: 180 },
    defaultStyle: { ...TRANSPARENT_STYLE, fontSize: 58, fontWeight: "bold" },
    defaultBilingual: {
      fr: "Titre de la diapositive",
      ar: "عنوان الشريحة الرئيسية",
    },
    defaultConfig: { variant: "display" },
  },
  text: {
    type: "text",
    category: "general",
    label: { fr: "Texte bilingue", ar: "نص ثنائي اللغة" },
    description: { fr: "Paragraphe FR (LTR) + AR (RTL)", ar: "فقرة بالفرنسية والعربية" },
    iconName: "Type",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1200, height: 220 },
    defaultStyle: { ...TRANSPARENT_STYLE, fontSize: 30 },
    defaultBilingual: {
      fr: "Expliquez une notion claire et actionnable pour la classe.",
      ar: "اشرحوا فكرة واضحة وقابلة للتطبيق داخل القسم.",
    },
    defaultConfig: {},
  },
  "bilingual-card": {
    type: "bilingual-card",
    category: "general",
    label: { fr: "Carte bilingue", ar: "بطاقة ثنائية" },
    description: { fr: "Bloc structuré avec titre et détail", ar: "بطاقة منظمة مع عنوان وشرح" },
    iconName: "LayoutTemplate",
    supportsParticipantRuntime: false,
    defaultSize: { width: 820, height: 320 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 28 },
    defaultBilingual: {
      fr: "Point clé pédagogique",
      ar: "نقطة بيداغوجية أساسية",
    },
    defaultConfig: {
      bodyFr: "Détail pratique utilisable dès demain en classe.",
      bodyAr: "تفصيل عملي قابل للتوظيف مباشرة في القسم.",
    },
  },
  callout: {
    type: "callout",
    category: "general",
    label: { fr: "Encadré repère / Darija", ar: "إطار توضيحي" },
    description: { fr: "Encadré ivoire avec repère concret", ar: "إطار بارز للملاحظات الميدانية" },
    iconName: "MessageSquareQuote",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1400, height: 210 },
    defaultStyle: {
      ...DEFAULT_LIGHT_STYLE,
      backgroundColor: "#F4F0E8",
      borderColor: "#0F766E",
      fontSize: 26,
    },
    defaultBilingual: {
      fr: "À retenir en classe",
      ar: "خلاصة للتطبيق في القسم",
    },
    defaultConfig: {
      bodyFr: "Toujours relire et adapter au niveau réel des élèves.",
      bodyAr: "المراجعة البشرية وملاءمة المستوى ضرورية دائماً.",
    },
  },
  image: {
    type: "image",
    category: "general",
    label: { fr: "Image / Schéma", ar: "صورة / رسم" },
    description: { fr: "Image avec légende bilingue", ar: "صورة مع وصف ثنائي اللغة" },
    iconName: "Image",
    supportsParticipantRuntime: false,
    defaultSize: { width: 760, height: 440 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, padding: 12 },
    defaultBilingual: { fr: "Illustration de séance", ar: "صورة توضيحية للحصة" },
    defaultConfig: { url: "/icon.svg", altFr: "AI Teacher Lab", altAr: "مختبر المعلم", fit: "contain" },
  },
  shape: {
    type: "shape",
    category: "general",
    label: { fr: "Panneau / Forme", ar: "شكل هندسي" },
    description: { fr: "Panneau navy ou teal structurant", ar: "خلفية هندسية لتنظيم العناصر" },
    iconName: "Square",
    supportsParticipantRuntime: false,
    defaultSize: { width: 640, height: 280 },
    defaultStyle: {
      ...DEFAULT_LIGHT_STYLE,
      backgroundColor: "#0B1220",
      textColor: "#FAF8F4",
      borderColor: "#14B8A6",
      fontSize: 32,
      fontWeight: "bold",
    },
    defaultBilingual: { fr: "Bloc structuré", ar: "كتلة منظمة" },
    defaultConfig: { shape: "rounded" },
  },
  divider: {
    type: "divider",
    category: "general",
    label: { fr: "Séparateur", ar: "خط فاصل" },
    description: { fr: "Ligne horizontale éditoriale", ar: "خط فاصل أنيق بين الفقرات" },
    iconName: "Minus",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1400, height: 32 },
    defaultStyle: { ...TRANSPARENT_STYLE, borderColor: "#E9E3D6", padding: 0 },
    defaultBilingual: { fr: "", ar: "" },
    defaultConfig: { color: "#CBD5E1", thickness: 3 },
  },
  list: {
    type: "list",
    category: "general",
    label: { fr: "Liste bilingue", ar: "لائحة نقطية" },
    description: { fr: "3 points numérotés FR + AR", ar: "نقاط مرقمة بالفرنسية والعربية" },
    iconName: "ListOrdered",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1200, height: 380 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 28 },
    defaultBilingual: { fr: "Points essentiels", ar: "النقاط الأساسية" },
    defaultConfig: {
      items: [
        { fr: "Observer la situation de classe", ar: "ملاحظة وضعية القسم" },
        { fr: "Tester avec les élèves", ar: "التجريب مع التلاميذ" },
        { fr: "Ajuster et partager", ar: "التعديل والتقاسم" },
      ],
    },
  },
  table: {
    type: "table",
    category: "general",
    label: { fr: "Tableau comparatif", ar: "جدول مقارن" },
    description: { fr: "Tableau 2×3 propre et lisible", ar: "جدول واضح للمقارنة والتصنيف" },
    iconName: "Table",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1320, height: 420 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 24 },
    defaultBilingual: { fr: "Tableau comparatif", ar: "جدول المقارنة" },
    defaultConfig: {
      headers: [
        { fr: "Élément", ar: "العنصر" },
        { fr: "Avant", ar: "قبل" },
        { fr: "Avec l'outil", ar: "مع الأداة" },
      ],
      rows: [
        ["Préparation / التحضير", "45 min", "12 min"],
        ["Différenciation / التفريق", "1 fiche", "3 parcours"],
      ],
    },
  },
  chart: {
    type: "chart",
    category: "general",
    label: { fr: "Graphique en barres", ar: "مبيان بالأعمدة" },
    description: { fr: "Visualisation SVG native imprimable", ar: "مبيان متجهي واضح للعرض والطباعة" },
    iconName: "BarChart3",
    supportsParticipantRuntime: false,
    defaultSize: { width: 920, height: 460 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 24 },
    defaultBilingual: { fr: "Répartition observée", ar: "توزيع المعطيات" },
    defaultConfig: {
      series: [
        { labelFr: "Lecture · القراءة", value: 42 },
        { labelFr: "Calcul · الحساب", value: 36 },
        { labelFr: "Sciences · النشاط العلمي", value: 22 },
      ],
    },
  },
  timeline: {
    type: "timeline",
    category: "general",
    label: { fr: "Frise chronologique", ar: "خط زمني" },
    description: { fr: "Séquence de séance étape par étape", ar: "تسلسل الحصة مرحلة بمرحلة" },
    iconName: "GitCommitHorizontal",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1600, height: 340 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 24 },
    defaultBilingual: { fr: "Déroulement de la séance", ar: "سير الحصة" },
    defaultConfig: {
      steps: [
        { time: "0–10m", fr: "Découverte", ar: "الاستكشاف" },
        { time: "10–25m", fr: "Manipulation", ar: "المناولة" },
        { time: "25–40m", fr: "Entraînement", ar: "التدريب" },
        { time: "40–50m", fr: "Bilan", ar: "التقويم" },
      ],
    },
  },
  diagram: {
    type: "diagram",
    category: "general",
    label: { fr: "Diagramme d'étapes", ar: "مخطط المراحل" },
    description: { fr: "Flux visuel à 4 étapes", ar: "مخطط انسيابي من 4 مراحل" },
    iconName: "Workflow",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1640, height: 360 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 26 },
    defaultBilingual: { fr: "Processus pédagogique", ar: "السيرورة البيداغوجية" },
    defaultConfig: {
      nodes: [
        { n: "01", fr: "Objectif", ar: "الهدف" },
        { n: "02", fr: "Prompt / Idée", ar: "التوجيه" },
        { n: "03", fr: "Prototype", ar: "النموذج" },
        { n: "04", fr: "Validation classe", ar: "الاعتماد" },
      ],
    },
  },
  "qr-join": {
    type: "qr-join",
    category: "general",
    label: { fr: "Carte QR Participation", ar: "بطاقة رمز QR" },
    description: { fr: "QR + code PIN de la session", ar: "رمز QR ورمز الدخول المباشر" },
    iconName: "QrCode",
    supportsParticipantRuntime: false,
    defaultSize: { width: 460, height: 500 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, padding: 24 },
    defaultBilingual: { fr: "Rejoindre /join", ar: "الانضمام عبر /join" },
    defaultConfig: { showPin: true },
  },

  // B. Interactive Live Components
  "live-poll": {
    type: "live-poll",
    category: "interactive",
    label: { fr: "Sondage en direct", ar: "استطلاع رأي مباشر" },
    description: { fr: "Vote temps réel sur téléphones + résultats", ar: "تصويت فوري للمشاركين مع رسم النتائج" },
    iconName: "BarChart2",
    supportsParticipantRuntime: true,
    activityType: "poll",
    defaultSize: { width: 1460, height: 560 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 28 },
    defaultBilingual: {
      fr: "Quel est votre besoin prioritaire cette semaine ?",
      ar: "ما هي أولويتكم التربوية لهذا الأسبوع؟",
    },
    defaultConfig: {
      activityKey: "",
      options: [
        { id: "opt1", fr: "Préparation des séances", ar: "تحضير الحصص" },
        { id: "opt2", fr: "Différenciation TaRL", ar: "الدعم التربوي" },
        { id: "opt3", fr: "Évaluation formative", ar: "التقويم التكويني" },
      ],
    },
  },
  "mcq-quiz": {
    type: "mcq-quiz",
    category: "interactive",
    label: { fr: "Quiz QCM interactif", ar: "اختبار من متعدد" },
    description: { fr: "Question QCM avec bonne réponse et révélation", ar: "سؤال مع كشف الإجابة الصحيحة والتعليل" },
    iconName: "CheckSquare",
    supportsParticipantRuntime: true,
    activityType: "mcq_quiz",
    defaultSize: { width: 1500, height: 560 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 28 },
    defaultBilingual: {
      fr: "Quelle action garantit l'éthique en classe ?",
      ar: "ما الإجراء الذي يضمن أخلاقيات الاستعمال بالقسم؟",
    },
    defaultConfig: {
      activityKey: "",
      correctOptionId: "b",
      explanationFr: "Ne jamais saisir de noms ou données d'élèves dans un outil externe.",
      explanationAr: "يمنع إدخال أسماء أو معطيات التلاميذ في أي أداة خارجية.",
      options: [
        { id: "a", fr: "Publier la liste des notes", ar: "نشر لائحة النقط" },
        { id: "b", fr: "Anonymiser & relire chaque support", ar: "إخفاء الهوية ومراجعة المورد" },
        { id: "c", fr: "Distribuer sans relire", ar: "التوزيع دون مراجعة" },
      ],
    },
  },
  "tf-quiz": {
    type: "tf-quiz",
    category: "interactive",
    label: { fr: "Quiz Vrai / Faux", ar: "اختبار صحيح / خطأ" },
    description: { fr: "Affirmation Vrai/Faux bilingue avec explication", ar: "سؤال صحيح/خطأ مع تبرير بيداغوجي" },
    iconName: "ToggleLeft",
    supportsParticipantRuntime: true,
    activityType: "tf_quiz",
    defaultSize: { width: 1400, height: 480 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 30 },
    defaultBilingual: {
      fr: "Un enseignant doit toujours valider le contenu avant utilisation.",
      ar: "يجب على الأستاذ(ة) دائماً التحقق من المحتوى قبل الاستعمال.",
    },
    defaultConfig: {
      activityKey: "",
      correctOptionId: "true",
      explanationFr: "Oui : le jugement pédagogique humain reste souverain.",
      explanationAr: "نعم، القرار البيداغوجي يظل مسؤولية الأستاذ(ة).",
      options: [
        { id: "true", fr: "Vrai", ar: "صحيح" },
        { id: "false", fr: "Faux", ar: "خطأ" },
      ],
    },
  },
  "short-answer": {
    type: "short-answer",
    category: "interactive",
    label: { fr: "Réponse courte live", ar: "إجابة قصيرة مباشرة" },
    description: { fr: "Collecte de phrases anonymisées en salle", ar: "تجميع إجابات قصيرة من القاعة" },
    iconName: "MessageSquare",
    supportsParticipantRuntime: true,
    activityType: "short_answer",
    defaultSize: { width: 1400, height: 500 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 28 },
    defaultBilingual: {
      fr: "Partagez une idée concrète pour votre prochaine séance",
      ar: "شاركوا فكرة عملية لحصتكم المقبلة",
    },
    defaultConfig: { activityKey: "", placeholderFr: "Votre idée...", placeholderAr: "فكرتكم..." },
  },
  "word-cloud": {
    type: "word-cloud",
    category: "interactive",
    label: { fr: "Nuage de mots", ar: "سحابة الكلمات" },
    description: { fr: "Mots clés envoyés en direct par la salle", ar: "كلمات مفتاحية يرسلها المشاركون مباشرة" },
    iconName: "Cloud",
    supportsParticipantRuntime: true,
    activityType: "word_cloud",
    defaultSize: { width: 1440, height: 520 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 28 },
    defaultBilingual: {
      fr: "Un mot qui résume votre priorité pédagogique",
      ar: "كلمة واحدة تلخص أولويتكم التربوية",
    },
    defaultConfig: {
      activityKey: "",
      seedWords: ["Différenciation", "التفريق", "Lecture", "القراءة", "Autonomie", "الاستقلالية"],
    },
  },
  flashcards: {
    type: "flashcards",
    category: "interactive",
    label: { fr: "Cartes mémoire (Flashcards)", ar: "بطاقات المراجعة" },
    description: { fr: "Cartes cliquables recto FR / verso AR", ar: "بطاقات تفاعلية بالوجهين فرنسي وعربي" },
    iconName: "Layers",
    supportsParticipantRuntime: true,
    activityType: "flashcards",
    defaultSize: { width: 1280, height: 480 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 32 },
    defaultBilingual: { fr: "Vocabulaire bilingue", ar: "رصيد لغوي تفاعلي" },
    defaultConfig: {
      cards: [
        { frontFr: "Le cahier", frontAr: "الدفتر", hintFr: "Outil d'écriture", hintAr: "أداة للكتابة" },
        { frontFr: "La bibliothèque", frontAr: "المكتبة", hintFr: "Lieu de lecture", hintAr: "فضاء للقراءة" },
        { frontFr: "La géométrie", frontAr: "الهندسة", hintFr: "Mesures et figures", hintAr: "الأشكال والقياسات" },
      ],
    },
  },
  matching: {
    type: "matching",
    category: "interactive",
    label: { fr: "Activité d'association", ar: "نشاط الربط" },
    description: { fr: "Associer chaque notion à son équivalent", ar: "الربط بين المفهوم ومقابله الصحيح" },
    iconName: "Link2",
    supportsParticipantRuntime: true,
    activityType: "matching",
    defaultSize: { width: 1400, height: 500 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 26 },
    defaultBilingual: { fr: "Associer les paires", ar: "ربط الأزواج المتطابقة" },
    defaultConfig: {
      pairs: [
        { left: "Addition · الجمع", right: "45 + 15 = 60" },
        { left: "Soustraction · الطرح", right: "90 − 25 = 65" },
        { left: "Multiplication · الضرب", right: "6 × 7 = 42" },
      ],
    },
  },
  ordering: {
    type: "ordering",
    category: "interactive",
    label: { fr: "Remise en ordre", ar: "ترتيب المراحل" },
    description: { fr: "Ordonner des étapes sur scène ou /join", ar: "ترتيب الخطوات بشكل متسلسل" },
    iconName: "ArrowUpDown",
    supportsParticipantRuntime: true,
    activityType: "ordering",
    defaultSize: { width: 1360, height: 480 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 26 },
    defaultBilingual: { fr: "Ordonner la démarche", ar: "رتبوا مراحل النشاط" },
    defaultConfig: {
      items: [
        { id: "s1", fr: "1. Lire la consigne", ar: "1. قراءة التعليمة" },
        { id: "s2", fr: "2. Chercher sur ardoise", ar: "2. البحث على اللوحة" },
        { id: "s3", fr: "3. Valider ensemble", ar: "3. التصحيح الجماعي" },
      ],
    },
  },
  "reveal-card": {
    type: "reveal-card",
    category: "interactive",
    label: { fr: "Révéler / Masquer", ar: "إظهار / إخفاء الجواب" },
    description: { fr: "Cache le corrigé jusqu'au clic enseignant", ar: "يخفي الحل حتى ينقر الأستاذ(ة)" },
    iconName: "Eye",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1200, height: 340 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, backgroundColor: "#FAF8F4", fontSize: 28 },
    defaultBilingual: {
      fr: "Question : Quel est le périmètre d'un carré de 6 cm ?",
      ar: "السؤال: ما محيط مربع طول ضلعه 6 سنتيمترات؟",
    },
    defaultConfig: {
      answerFr: "Corrigé : P = 6 × 4 = 24 cm",
      answerAr: "الجواب: المحيط = 6 × 4 = 24 سم",
    },
  },
  "countdown-timer": {
    type: "countdown-timer",
    category: "interactive",
    label: { fr: "Minuteur de classe", ar: "مؤقت القسم" },
    description: { fr: "Chronomètre autonome Démarrer / Pause", ar: "عداد زمني تفاعلي لأنشطة القسم" },
    iconName: "Timer",
    supportsParticipantRuntime: false,
    defaultSize: { width: 580, height: 300 },
    defaultStyle: {
      ...DEFAULT_LIGHT_STYLE,
      backgroundColor: "#0B1220",
      textColor: "#FAF8F4",
      borderColor: "#2DD4BF",
      fontSize: 48,
      fontWeight: "bold",
    },
    defaultBilingual: { fr: "Temps d'atelier", ar: "مدة النشاط" },
    defaultConfig: { initialSeconds: 300 },
  },
  "group-task": {
    type: "group-task",
    category: "interactive",
    label: { fr: "Consigne de groupe", ar: "مهمة المجموعات" },
    description: { fr: "Mission + durée + livrable attendu", ar: "تعليمة العمل الجماعي والمنتج المنتظر" },
    iconName: "Users",
    supportsParticipantRuntime: true,
    activityType: "group_task",
    defaultSize: { width: 1400, height: 420 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 26 },
    defaultBilingual: {
      fr: "Travail en binômes ou groupes (15 min)",
      ar: "عمل بالمجموعات أو ثنائيات (15 دقيقة)",
    },
    defaultConfig: {
      deliverableFr: "Un exemple testable sur 1 écran",
      deliverableAr: "نموذج قابل للتجريب على شاشة واحدة",
    },
  },
  "exit-ticket": {
    type: "exit-ticket",
    category: "interactive",
    label: { fr: "Ticket de sortie", ar: "تذكرة الخروج" },
    description: { fr: "Engagement de fin de séance synchronisé", ar: "التزام نهاية الحصة متزامن مع القاعة" },
    iconName: "MessageSquareHeart",
    supportsParticipantRuntime: true,
    activityType: "exit_ticket",
    defaultSize: { width: 1500, height: 500 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 26 },
    defaultBilingual: {
      fr: "Votre premier pas concret cette semaine",
      ar: "خطوتكم العملية الأولى هذا الأسبوع",
    },
    defaultConfig: { activityKey: "" },
  },

  // C. Moroccan Primary School 1AEP–6AEP
  "arabic-letters": {
    type: "arabic-letters",
    category: "primary",
    label: { fr: "Lettres Arabes & Harakat", ar: "الحروف العربية والحركات" },
    description: { fr: "Interactif 1AEP–2AEP (بَ · بِ · بُ)", ar: "تفاعل قرائي بالحركات والمدود" },
    iconName: "Languages",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1260, height: 460 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 34 },
    defaultBilingual: { fr: "Syllabes & Harakat (1AEP–2AEP)", ar: "القراءة المقطعية والحركات" },
    defaultConfig: { letters: ["ب", "ت", "س", "م", "ر"] },
  },
  "french-reading": {
    type: "french-reading",
    category: "primary",
    label: { fr: "Lecture syllabique FR", ar: "القراءة المقطعية بالفرنسية" },
    description: { fr: "Segmentation syllabique interactive", ar: "تقطيع المقاطع الصوتية بالفرنسية" },
    iconName: "BookOpen",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1260, height: 440 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 32 },
    defaultBilingual: { fr: "Découpage syllabique", ar: "تقطيع الكلمات إلى مقاطع" },
    defaultConfig: { words: ["ca-ma-rade", "é-cole", "jar-din", "bi-blio-thèque"] },
  },
  "number-line": {
    type: "number-line",
    category: "primary",
    label: { fr: "Droite numérique", ar: "المستقيم العددي" },
    description: { fr: "Sauts interactifs (+1, +10, −1)", ar: "تنقل تفاعلي على المستقيم العددي" },
    iconName: "Ruler",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1460, height: 340 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 28 },
    defaultBilingual: { fr: "Droite numérique (0 – 20)", ar: "المستقيم العددي" },
    defaultConfig: { min: 0, max: 20, current: 7 },
  },
  abacus: {
    type: "abacus",
    category: "primary",
    label: { fr: "Boulier C / D / U", ar: "المعداد (م / ع / و)" },
    description: { fr: "Centaines, dizaines et unités manipulables", ar: "تمثيل المئات والعشرات والوحدات" },
    iconName: "Sliders",
    supportsParticipantRuntime: false,
    defaultSize: { width: 920, height: 440 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 28 },
    defaultBilingual: { fr: "Boulier de numération", ar: "معداد الترقيم" },
    defaultConfig: { hundreds: 2, tens: 4, units: 5 },
  },
  "base10-blocks": {
    type: "base10-blocks",
    category: "primary",
    label: { fr: "Blocs Base 10", ar: "مكعبات الأساس 10" },
    description: { fr: "Plaques 100, barres 10 et cubes unités", ar: "صفائح 100 وقضبان 10 ومكعبات 1" },
    iconName: "Boxes",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1120, height: 440 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 28 },
    defaultBilingual: { fr: "Décomposition Base 10", ar: "تفكيك الأعداد بالأساس 10" },
    defaultConfig: { number: 345 },
  },
  "fractions-lab": {
    type: "fractions-lab",
    category: "primary",
    label: { fr: "Visualiseur de Fractions", ar: "مختبر الكسور" },
    description: { fr: "Barre et disque fractionnés réglables", ar: "تمثيل بصري قابل للتعديل للكسور" },
    iconName: "PieChart",
    supportsParticipantRuntime: false,
    defaultSize: { width: 980, height: 420 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 28 },
    defaultBilingual: { fr: "Comprendre les fractions", ar: "فهم الكسور البسيطة" },
    defaultConfig: { numerator: 3, denominator: 4 },
  },
  "math-operations": {
    type: "math-operations",
    category: "primary",
    label: { fr: "Opérations posées (+ − ×)", ar: "العمليات الحسابية العمودية" },
    description: { fr: "Calcul interactif guidé avec vérification", ar: "إنجاز العمليات الحسابية مع التصحيح" },
    iconName: "Calculator",
    supportsParticipantRuntime: false,
    defaultSize: { width: 780, height: 440 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 32 },
    defaultBilingual: { fr: "Calcul posé", ar: "الحساب العمودي" },
    defaultConfig: { left: 248, operator: "+", right: 135 },
  },
  "tarl-tracks": {
    type: "tarl-tracks",
    category: "primary",
    label: { fr: "Parcours différenciés TaRL", ar: "مسارات الدعم TaRL" },
    description: { fr: "3 niveaux gradués prêts pour la classe", ar: "3 مسارات متدرجة حسب تعثرات التلاميذ" },
    iconName: "GitBranch",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1580, height: 480 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 24 },
    defaultBilingual: { fr: "3 Parcours de remédiation", ar: "3 مسارات للدعم التربوي" },
    defaultConfig: {
      tracks: [
        { level: "Niveau 1 · دعم أساسي", taskFr: "Lire 10 mots usuels", taskAr: "قراءة 10 كلمات مألوفة" },
        { level: "Niveau 2 · تثبيت", taskFr: "Compléter 4 phrases simples", taskAr: "إتمام 4 جمل بسيطة" },
        { level: "Niveau 3 · إغناء", taskFr: "Rédiger un court paragraphe", taskAr: "كتابة فقرة قصيرة" },
      ],
    },
  },
  "worksheet-generator": {
    type: "worksheet-generator",
    category: "primary",
    label: { fr: "Fiche imprimable A4", ar: "ورقة عمل للطباعة A4" },
    description: { fr: "Bloc structuré optimisé pour l'impression A4", ar: "مكون مهيأ للطباعة على ورق A4" },
    iconName: "Printer",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1200, height: 480 },
    defaultStyle: { ...DEFAULT_LIGHT_STYLE, fontSize: 24 },
    defaultBilingual: { fr: "Fiche d'entraînement A4", ar: "ورقة تمارين للطباعة" },
    defaultConfig: {
      grade: "4AEP",
      itemsFr: ["1. Calcule : 340 + 55 = _____", "2. Entoure les verbes au présent."],
      itemsAr: ["1. أنجز العملية: 340 + 55 = _____", "2. رتب الكلمات لتكوين جملة مفيدة."],
    },
  },

  // D. Custom Sandboxed Code
  "code-sandbox": {
    type: "code-sandbox",
    category: "code",
    label: { fr: "Composant Code HTML/CSS/JS", ar: "مكون برمجي معزول" },
    description: {
      fr: "Mini-app HTML/CSS/JS dans un bac à sable isolé",
      ar: "تطبيق مصغر HTML/CSS/JS داخل بيئة معزولة وآمنة",
    },
    iconName: "Code2",
    supportsParticipantRuntime: false,
    defaultSize: { width: 1280, height: 540 },
    defaultStyle: {
      ...DEFAULT_LIGHT_STYLE,
      backgroundColor: "#FFFFFF",
      borderColor: "#0F766E",
      padding: 16,
    },
    defaultBilingual: {
      fr: "Mini-application interactive HTML/CSS/JS",
      ar: "تطبيق تفاعلي مصغر بلغة الويب",
    },
    defaultConfig: {
      html: `<div class="box">\n  <h2>Compteur de classe · عداد القسم</h2>\n  <p id="val">0</p>\n  <button id="btn">+1</button>\n</div>`,
      css: `body{font-family:system-ui,sans-serif;margin:0;padding:16px;background:#faf8f4;color:#0b1220;display:flex;align-items:center;justify-content:center;min-height:85vh}\n.box{text-align:center;background:#fff;border:2px solid #0f766e;border-radius:16px;padding:24px 40px}\n#val{font-size:48px;font-weight:700;color:#0f766e;margin:12px 0}\nbutton{background:#0f766e;color:#fff;border:0;border-radius:10px;padding:10px 24px;font-size:18px;font-weight:700;cursor:pointer}`,
      js: `let c=0;const v=document.getElementById('val');document.getElementById('btn').addEventListener('click',()=>{c++;v.textContent=String(c);});`,
      approved: true,
    },
  },
};

export const COMPONENT_LIST = Object.values(COMPONENT_REGISTRY);

export function createSlideElement(
  type: Exclude<ComponentTypeId, "unknown-element">,
  overrides?: Partial<SlideElement>
): SlideElement {
  const def = COMPONENT_REGISTRY[type];
  return {
    id: `el-${type}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    name: def.label.fr,
    x: 120,
    y: 260,
    width: def.defaultSize.width,
    height: def.defaultSize.height,
    rotation: 0,
    zIndex: 10,
    visible: true,
    locked: false,
    style: structuredClone(def.defaultStyle),
    bilingual: structuredClone(def.defaultBilingual),
    config: structuredClone(def.defaultConfig),
    ...overrides,
  };
}
