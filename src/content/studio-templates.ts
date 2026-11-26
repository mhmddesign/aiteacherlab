import type { BilingualText } from "./types";

export type StudioRoomStatus = "live" | "ready" | "draft" | "archived";

export interface StudioTemplate {
  key: string;
  badge: BilingualText;
  title: BilingualText;
  description: BilingualText;
  estimatedMinutes: number;
  defaultSlidesCount: number;
  defaultActivitiesCount: number;
  recommendedFor: BilingualText;
}

export interface StudioResourceItem {
  id: string;
  kind: "presentation" | "gallery" | "prompt_pack" | "group_brief" | "guide";
  title: BilingualText;
  description: BilingualText;
  href?: string;
  countLabel?: BilingualText;
}

export interface StudioRoomRecord {
  id: string;
  slug: string;
  isLivePrimary: boolean;
  status: StudioRoomStatus;
  templateKey: string;
  title: BilingualText;
  subtitle: BilingualText;
  description: BilingualText;
  slidesCount: number;
  activitiesCount: number;
  resourcesCount: number;
  connectedCount: number;
  totalParticipants: number;
  sessionsCount: number;
  updatedLabel: BilingualText;
  pinProtected: boolean;
}

export const STUDIO_TEMPLATES: StudioTemplate[] = [
  {
    key: "workshop-bilingual",
    badge: { fr: "Modèle complet", ar: "نموذج متكامل" },
    title: {
      fr: "Atelier Enseignants Bilingue (FR + AR)",
      ar: "ورشة تكوينية ثنائية اللغة للأساتذة",
    },
    description: {
      fr: "Diapositives 16:9, sondages en direct, quiz diagnostique, Prompt Builder, travaux de groupes et bilan.",
      ar: "شرائح 16:9، استطلاعات مباشرة، اختبار تشخيصي، منشئ التوجيهات، ورشات المجموعات وتقييم ختامي.",
    },
    estimatedMinutes: 180,
    defaultSlidesCount: 21,
    defaultActivitiesCount: 8,
    recommendedFor: {
      fr: "Formations provinciales & journées pédagogiques",
      ar: "التكوينات الإقليمية والأيام التربوية",
    },
  },
  {
    key: "presentation-deck",
    badge: { fr: "Présentation", ar: "عرض تقديمي" },
    title: {
      fr: "Présentation Institutionnelle 16:9",
      ar: "عرض مؤسساتي تفاعلي 16:9",
    },
    description: {
      fr: "Support de conférence fixe 16:9 avec notes animateur, affichage projecteur et sondage éclair en fin de séance.",
      ar: "عرض تقديمي ثابت 16:9 مع ملاحظات المنشط وشاشة العرض واستطلاع سريع في ختام اللقاء.",
    },
    estimatedMinutes: 45,
    defaultSlidesCount: 12,
    defaultActivitiesCount: 2,
    recommendedFor: {
      fr: "Direction provinciale, inspecteurs & partenaires",
      ar: "المديرية الإقليمية، المفتشون والشركاء",
    },
  },
  {
    key: "quiz-arena",
    badge: { fr: "Évaluation", ar: "تقويم مباشر" },
    title: {
      fr: "Session Quiz & Sondages en Direct",
      ar: "جلسة اختبارات واستطلاعات مباشرة",
    },
    description: {
      fr: "Enchaînement rapide de questions QCM, Vrai/Faux et nuages d'idées avec révélation synchronisée sur grand écran.",
      ar: "سلسلة سريعة من أسئلة الاختيار من متعدد وصحيح/خطأ مع كشف النتائج بشكل متزامن على الشاشة.",
    },
    estimatedMinutes: 30,
    defaultSlidesCount: 8,
    defaultActivitiesCount: 5,
    recommendedFor: {
      fr: "Animations de classe & diagnostics rapides",
      ar: "تنشيط القسم والتشخيص التربوي السريع",
    },
  },
  {
    key: "app-studio-lab",
    badge: { fr: "Création", ar: "مختبر الإبداع" },
    title: {
      fr: "Laboratoire d'Applications Pédagogiques",
      ar: "مختبر إنشاء التطبيقات التربوية",
    },
    description: {
      fr: "Catalogue de 12 catégories d'applications, 4 briefs de groupes, vote Showcase et Galerie collaborative.",
      ar: "دليل 12 فئة من التطبيقات التربوية، 4 مشاريع للمجموعات، تصويت العروض ومعرض تعاوني.",
    },
    estimatedMinutes: 120,
    defaultSlidesCount: 14,
    defaultActivitiesCount: 4,
    recommendedFor: {
      fr: "Ateliers pratiques de prototypage sans code",
      ar: "ورشات عملية لتطوير النماذج الأولية دون برمجة",
    },
  },
  {
    key: "seminar-hub",
    badge: { fr: "Ressources", ar: "مركز موارد" },
    title: {
      fr: "Séminaire & Bibliothèque de Ressources",
      ar: "ندوة ومكتبة موارد تربوية",
    },
    description: {
      fr: "Espace persistant pour centraliser guides pédagogiques, fiches de prompts, liens vérifiés et suivi post-atelier.",
      ar: "فضاء دائم لتجميع الأدلة التربوية، بطاقات التوجيهات، الروابط الموثوقة وتتبع ما بعد الورشة.",
    },
    estimatedMinutes: 60,
    defaultSlidesCount: 6,
    defaultActivitiesCount: 2,
    recommendedFor: {
      fr: "Communautés de pratique & équipes d'école",
      ar: "مجتمعات الممارسة وفرق المؤسسات التعليمية",
    },
  },
];

export const MEDIOUNA_ROOM_RESOURCES: StudioResourceItem[] = [
  {
    id: "res-slides",
    kind: "presentation",
    title: {
      fr: "Jeu complet de 21 diapositives bilingues (16:9)",
      ar: "مجموعة كاملة من 21 شريحة ثنائية اللغة (16:9)",
    },
    description: {
      fr: "12 sections chronométrées avec notes de script FR/AR et exemples en contexte marocain.",
      ar: "12 محوراً مؤقتاً مع نص التقديم بالفرنسية والعربية وأمثلة من القسم المغربي.",
    },
    href: "/presenter",
    countLabel: { fr: "21 diapos", ar: "21 شريحة" },
  },
  {
    id: "res-gallery",
    kind: "gallery",
    title: {
      fr: "Galerie de 12 catégories d'applications pédagogiques",
      ar: "معرض 12 فئة من التطبيقات التربوية",
    },
    description: {
      fr: "Cartes prêtes à l'emploi pour le primaire (1AEP–6AEP) : lecture, maths, TaRL, sciences et remédiation.",
      ar: "بطاقات جاهزة للتعليم الابتدائي (1AEP–6AEP): القراءة، الرياضيات، الدعم التربوي والنشاط العلمي.",
    },
    href: "/screen",
    countLabel: { fr: "12 catégories", ar: "12 فئة" },
  },
  {
    id: "res-groups",
    kind: "group_brief",
    title: {
      fr: "4 briefs de projets collaboratifs (Groupes A à D)",
      ar: "4 مشاريع تطبيقية للمجموعات (من أ إلى د)",
    },
    description: {
      fr: "Cahiers des charges guidés pour prototyper une mini-application HTML autonome sans données d'élèves.",
      ar: "دفاتر تحملات موجهة لإنجاز تطبيق تعليمي مصغر يعمل دون جمع معطيات التلاميذ.",
    },
    href: "/join",
    countLabel: { fr: "4 groupes", ar: "4 مجموعات" },
  },
  {
    id: "res-prompts",
    kind: "prompt_pack",
    title: {
      fr: "Prompt Builder & Exercice Méta-Prompt bilingues",
      ar: "منشئ التوجيهات وتمرين الميتا-برومبت الثنائي",
    },
    description: {
      fr: "Outils interactifs avec copie en un clic (FR et AR) et partage anonymisé en direct.",
      ar: "أدوات تفاعلية للنسخ بنقرة واحدة (فرنسية وعربية) والمشاركة المباشرة دون كشف الهوية.",
    },
    href: "/join",
    countLabel: { fr: "2 ateliers", ar: "ورشتان" },
  },
  {
    id: "res-arch",
    kind: "guide",
    title: {
      fr: "Charte Confidentialité & Zéro Donnée Élève",
      ar: "ميثاق الخصوصية وحماية معطيات التلاميذ",
    },
    description: {
      fr: "Règles d'éthique IA intégrées à la salle : aucun nom d'élève, vérification humaine systématique.",
      ar: "قواعد أخلاقيات الذكاء الاصطناعي المدمجة في القاعة: لا لبيانات التلاميذ، ومراجعة الأستاذ دائماً.",
    },
    countLabel: { fr: "Conformité", ar: "التزام" },
  },
];
