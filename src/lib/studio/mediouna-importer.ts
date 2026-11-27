import { ACTIVITIES } from "@/content/activities";
import { SLIDES, getSectionList } from "@/content/slides";
import type { SlideDefinition } from "@/content/types";
import { createSlideElement } from "./component-registry";
import {
  LOGICAL_SLIDE_HEIGHT,
  LOGICAL_SLIDE_WIDTH,
  type DeckDocumentV1,
  type DeckSection,
  type DeckSlide,
  type SlideElement,
} from "./document-schema";

function buildElementsForLegacySlide(slide: SlideDefinition): SlideElement[] {
  const elements: SlideElement[] = [];

  // Heading element
  elements.push(
    createSlideElement("heading", {
      id: `${slide.id}-heading`,
      name: "Titre principal / العنوان الرئيسي",
      x: 112,
      y: 78,
      width: 1696,
      height: 170,
      zIndex: 1,
      bilingual: { ...slide.title },
    })
  );

  // Subtitle
  elements.push(
    createSlideElement("text", {
      id: `${slide.id}-subtitle`,
      name: "Sous-titre / العنوان الفرعي",
      x: 112,
      y: 256,
      width: 1696,
      height: 100,
      zIndex: 2,
      style: {
        backgroundColor: "transparent",
        textColor: "#334155",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 12,
        fontSize: 26,
        fontWeight: "normal",
        textAlign: "left",
        padding: 8,
      },
      bilingual: { ...slide.subtitle },
    })
  );

  const act = slide.activityKey ? ACTIVITIES[slide.activityKey] : undefined;
  if (act && (act.type === "poll" || act.type === "project_vote")) {
    elements.push(
      createSlideElement("live-poll", {
        id: `${slide.id}-activity`,
        name: act.title.fr,
        x: 112,
        y: 380,
        width: 1696,
        height: 580,
        zIndex: 3,
        bilingual: { ...act.instruction },
        config: {
          activityKey: act.key,
          options: (act.options ?? []).map((o) => ({
            id: o.id,
            fr: o.label.fr,
            ar: o.label.ar,
          })),
        },
      })
    );
  } else if (act && (act.type === "mcq_quiz" || act.type === "tf_quiz")) {
    const q0 = act.questions?.[0];
    elements.push(
      createSlideElement(act.type === "tf_quiz" ? "tf-quiz" : "mcq-quiz", {
        id: `${slide.id}-activity`,
        name: act.title.fr,
        x: 112,
        y: 380,
        width: 1696,
        height: 580,
        zIndex: 3,
        bilingual: q0 ? { ...q0.prompt } : { ...act.instruction },
        config: {
          activityKey: act.key,
          correctOptionId: q0?.correctOptionId ?? "a",
          explanationFr: q0?.explanation.fr ?? "",
          explanationAr: q0?.explanation.ar ?? "",
          options: (q0?.options ?? []).map((o) => ({
            id: o.id,
            fr: o.label.fr,
            ar: o.label.ar,
          })),
          questionsCount: act.questions?.length ?? 1,
        },
      })
    );
  } else if (act && act.type === "exit_ticket") {
    elements.push(
      createSlideElement("exit-ticket", {
        id: `${slide.id}-activity`,
        name: act.title.fr,
        x: 112,
        y: 380,
        width: 1696,
        height: 580,
        zIndex: 3,
        bilingual: { ...act.instruction },
        config: { activityKey: act.key },
      })
    );
  } else if (slide.keyPoints.length > 0) {
    elements.push(
      createSlideElement("list", {
        id: `${slide.id}-points`,
        name: "Points clés / النقاط الرئيسية",
        x: 112,
        y: 380,
        width: 1696,
        height: 430,
        zIndex: 3,
        bilingual: { fr: "Points clés", ar: "النقاط الأساسية" },
        config: {
          items: slide.keyPoints.map((kp) => ({ fr: kp.fr, ar: kp.ar })),
        },
      })
    );
  }

  // Darija callout
  elements.push(
    createSlideElement("callout", {
      id: `${slide.id}-darija`,
      name: slide.darijaNote.title.fr,
      x: 112,
      y: 840,
      width: 1696,
      height: 170,
      zIndex: 4,
      bilingual: { ...slide.darijaNote.title },
      config: {
        bodyFr: slide.darijaNote.fr,
        bodyAr: slide.darijaNote.arabic,
      },
    })
  );

  return elements;
}

/**
 * Deterministic converter preserving 100% of the canonical 21-slide Mediouna
 * workshop inside the versioned declarative DeckDocumentV1 schema.
 */
export function importMediounaDeckToDocument(
  roomId = "room-mediouna-primary",
  deckId = "deck-mediouna-canonical"
): DeckDocumentV1 {
  const sections: DeckSection[] = getSectionList().map((s) => ({
    id: `sec-${s.sectionNumber}`,
    number: s.sectionNumber,
    title: { ...s.title },
    timeRange: { ...s.timeRange },
  }));

  const slides: DeckSlide[] = SLIDES.map((s, idx) => ({
    id: s.id,
    order: idx,
    sectionId: `sec-${s.sectionNumber}`,
    title: { ...s.title },
    subtitle: { ...s.subtitle },
    layout: s.kind === "closing" ? "closing-dark" : s.activityKey ? "interactive-stage" : "freeform",
    hidden: false,
    transition: "fade",
    background: {
      color: s.kind === "closing" ? "#0B1220" : "#FAF8F4",
      accentColor: "#0F766E",
    },
    notes: {
      fr: s.presenterNotes.script.fr,
      ar: s.presenterNotes.script.ar,
      darijaFr: s.darijaNote.fr,
      darijaAr: s.darijaNote.arabic,
      durationCue: s.presenterNotes.durationCue,
      classroomExampleFr: s.presenterNotes.classroomExample.fr,
      classroomExampleAr: s.presenterNotes.classroomExample.ar,
      discussionPromptFr: s.presenterNotes.discussionPrompt.fr,
      discussionPromptAr: s.presenterNotes.discussionPrompt.ar,
    },
    legacySource: {
      slideId: s.id,
      slideKind: s.kind,
      activityKey: s.activityKey ?? null,
      edited: false,
    },
    elements: buildElementsForLegacySlide(s),
  }));

  return {
    schemaVersion: 1,
    id: deckId,
    roomId,
    title: {
      fr: "Atelier Mediouna : De l'IA à la création pédagogique (21 diapos)",
      ar: "ورشة مديونة: من الذكاء الاصطناعي إلى الإبداع البيداغوجي (21 شريحة)",
    },
    description: {
      fr: "Présentation complète importée fidèlement avec ses 12 sections, 8 activités synchronisées et notes en français, arabe et darija.",
      ar: "العرض الكامل المستورد بأمانة مع محاوره الـ12 وأنشطته الـ8 وملاحظات التقديم بالفرنسية والعربية والدارجة.",
    },
    canvasWidth: LOGICAL_SLIDE_WIDTH,
    canvasHeight: LOGICAL_SLIDE_HEIGHT,
    theme: {
      id: "mediouna-editorial",
      name: { fr: "Éditorial Mediouna", ar: "تحريري مديونة" },
      stageBackground: "#FAF8F4",
      primaryInk: "#0B1220",
      accentTeal: "#0F766E",
      highlightTeal: "#2DD4BF",
    },
    sections,
    slides,
  };
}

export function createDeckFromTemplate(
  templateKey: string,
  titleFr: string,
  titleAr: string,
  roomId: string,
  deckId = `deck-${Date.now().toString(36)}`
): DeckDocumentV1 {
  if (templateKey === "mediouna-import") {
    const imported = importMediounaDeckToDocument(roomId, deckId);
    return {
      ...imported,
      title: { fr: titleFr || imported.title.fr, ar: titleAr || imported.title.ar },
    };
  }

  const baseSlides: DeckSlide[] = [
    {
      id: `slide-${Date.now().toString(36)}-1`,
      order: 0,
      sectionId: "sec-1",
      title: { fr: titleFr || "Nouvelle présentation", ar: titleAr || "عرض تقديمي جديد" },
      subtitle: {
        fr: "Présentation interactive bilingue 16:9",
        ar: "عرض تفاعلي ثنائي اللغة 16:9",
      },
      layout: "title-hero",
      hidden: false,
      transition: "fade",
      background: { color: "#FAF8F4", accentColor: "#0F766E" },
      notes: {
        fr: "Accueillir les participants et présenter l'objectif principal de la séance.",
        ar: "الترحيب بالمشاركين وتقديم الهدف الرئيسي للحصة.",
        darijaFr: "",
        darijaAr: "",
        durationCue: "0 – 3 min",
        classroomExampleFr: "",
        classroomExampleAr: "",
        discussionPromptFr: "",
        discussionPromptAr: "",
      },
      elements: [
        createSlideElement("heading", {
          id: `el-h-${Date.now().toString(36)}`,
          x: 112,
          y: 120,
          width: 1400,
          height: 190,
          bilingual: {
            fr: titleFr || "Nouvelle présentation",
            ar: titleAr || "عرض تقديمي جديد",
          },
        }),
        createSlideElement("bilingual-card", {
          id: `el-card-${Date.now().toString(36)}`,
          x: 112,
          y: 360,
          width: 1080,
          height: 360,
          bilingual: {
            fr: "Objectif pédagogique",
            ar: "الهدف البيداغوجي",
          },
          config: {
            bodyFr: "Double-cliquez ou utilisez la bibliothèque de composants à gauche pour enrichir cette diapositive.",
            bodyAr: "انقروا لتعديل النص أو أضيفوا مكونات تفاعلية من مكتبة العناصر.",
          },
        }),
        createSlideElement("qr-join", {
          id: `el-qr-${Date.now().toString(36)}`,
          x: 1280,
          y: 300,
          width: 500,
          height: 520,
        }),
      ],
    },
  ];

  if (
    templateKey === "quiz-arena" ||
    templateKey === "workshop-bilingual" ||
    templateKey === "teacher-training" ||
    templateKey === "quiz-session" ||
    templateKey === "primary-lesson"
  ) {
    baseSlides.push({
      id: `slide-${Date.now().toString(36)}-2`,
      order: 1,
      sectionId: "sec-1",
      title: { fr: "Sondage d'ouverture", ar: "استطلاع البداية" },
      subtitle: { fr: "Vote en direct sur /join", ar: "تصويت مباشر عبر الهاتف" },
      layout: "interactive-stage",
      hidden: false,
      transition: "fade",
      background: { color: "#FAF8F4", accentColor: "#0F766E" },
      notes: {
        fr: "Ouvrir le sondage depuis les contrôles de séance.",
        ar: "فتح الاستطلاع من لوحة تحكم المنشط.",
        darijaFr: "",
        darijaAr: "",
        durationCue: "3 – 8 min",
        classroomExampleFr: "",
        classroomExampleAr: "",
        discussionPromptFr: "",
        discussionPromptAr: "",
      },
      elements: [
        createSlideElement("heading", {
          id: `el-h2-${Date.now().toString(36)}`,
          x: 112,
          y: 72,
          width: 1696,
          height: 150,
          bilingual: { fr: "Sondage d'ouverture", ar: "استطلاع البداية" },
        }),
        createSlideElement("live-poll", {
          id: `el-poll-${Date.now().toString(36)}`,
          x: 112,
          y: 250,
          width: 1696,
          height: 620,
        }),
      ],
    });
  }

  return {
    schemaVersion: 1,
    id: deckId,
    roomId,
    title: { fr: titleFr || "Nouvelle présentation", ar: titleAr || "عرض تقديمي جديد" },
    description: {
      fr: `Créée depuis le modèle ${templateKey}`,
      ar: `تم إنشاؤها انطلاقاً من نموذج ${templateKey}`,
    },
    canvasWidth: LOGICAL_SLIDE_WIDTH,
    canvasHeight: LOGICAL_SLIDE_HEIGHT,
    theme: {
      id: "mediouna-editorial",
      name: { fr: "Éditorial Mediouna", ar: "تحريري مديونة" },
      stageBackground: "#FAF8F4",
      primaryInk: "#0B1220",
      accentTeal: "#0F766E",
      highlightTeal: "#2DD4BF",
    },
    sections: [
      {
        id: "sec-1",
        number: 1,
        title: { fr: "1. Introduction & Activités", ar: "1. التقديم والأنشطة" },
        timeRange: { fr: "0 – 15 min", ar: "0 – 15 د" },
      },
    ],
    slides: baseSlides,
  };
}

/**
 * Parses a Markdown outline (# Slide Title / - bullet) into a bilingual DeckDocumentV1.
 */
export function importMarkdownToDeck(
  markdown: string,
  titleFr: string,
  titleAr: string,
  roomId: string,
  deckId = `deck-md-${Date.now().toString(36)}`
): DeckDocumentV1 {
  const blocks = markdown
    .split(/^#\s+/m)
    .map((b) => b.trim())
    .filter(Boolean)
    .slice(0, 20);

  if (blocks.length === 0) {
    return createDeckFromTemplate("blank", titleFr, titleAr, roomId, deckId);
  }

  const slides: DeckSlide[] = blocks.map((block, idx) => {
    const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const rawHeading = lines[0] || `Diapositive ${idx + 1}`;
    const [hFr, hAr] = rawHeading.split("|").map((x) => x.trim());
    const bullets = lines.slice(1).map((l) => l.replace(/^[-*]\s*/, "").trim());

    const items = (bullets.length > 0 ? bullets : ["Point à développer"]).map((b) => {
      const [bFr, bAr] = b.split("|").map((x) => x.trim());
      return { fr: bFr || b, ar: bAr || bFr || "نقطة للنقاش" };
    });

    return {
      id: `md-slide-${idx + 1}`,
      order: idx,
      sectionId: "sec-1",
      title: { fr: hFr || rawHeading, ar: hAr || `الشريحة ${idx + 1}` },
      subtitle: { fr: "", ar: "" },
      layout: "freeform",
      hidden: false,
      transition: "fade",
      background: { color: "#FAF8F4", accentColor: "#0F766E" },
      notes: {
        fr: "",
        ar: "",
        darijaFr: "",
        darijaAr: "",
        durationCue: "3 min",
        classroomExampleFr: "",
        classroomExampleAr: "",
        discussionPromptFr: "",
        discussionPromptAr: "",
      },
      elements: [
        createSlideElement("heading", {
          id: `md-h-${idx + 1}`,
          x: 112,
          y: 90,
          width: 1696,
          height: 170,
          bilingual: { fr: hFr || rawHeading, ar: hAr || `الشريحة ${idx + 1}` },
        }),
        createSlideElement("list", {
          id: `md-l-${idx + 1}`,
          x: 112,
          y: 310,
          width: 1696,
          height: 580,
          bilingual: { fr: "Contenu", ar: "المحتوى" },
          config: { items },
        }),
      ],
    };
  });

  return {
    schemaVersion: 1,
    id: deckId,
    roomId,
    title: { fr: titleFr || "Présentation Markdown", ar: titleAr || "عرض مستورد من Markdown" },
    description: {
      fr: "Importé depuis un plan Markdown",
      ar: "مستورد من مخطط Markdown",
    },
    canvasWidth: LOGICAL_SLIDE_WIDTH,
    canvasHeight: LOGICAL_SLIDE_HEIGHT,
    theme: {
      id: "mediouna-editorial",
      name: { fr: "Éditorial Mediouna", ar: "تحريري مديونة" },
      stageBackground: "#FAF8F4",
      primaryInk: "#0B1220",
      accentTeal: "#0F766E",
      highlightTeal: "#2DD4BF",
    },
    sections: [
      {
        id: "sec-1",
        number: 1,
        title: { fr: "1. Plan importé", ar: "1. المحاور المستوردة" },
        timeRange: { fr: `0 – ${slides.length * 3} min`, ar: `0 – ${slides.length * 3} د` },
      },
    ],
    slides,
  };
}
