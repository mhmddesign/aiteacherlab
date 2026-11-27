import { z } from "zod";
import { createSlideElement } from "@/lib/studio/component-registry";
import {
  LOGICAL_SLIDE_HEIGHT,
  LOGICAL_SLIDE_WIDTH,
  STUDIO_DOC_VERSION,
  type ComponentTypeId,
  type DeckDocumentV1,
  type DeckSlide,
} from "@/lib/studio/document-schema";

export const aiOutlineRequestSchema = z.object({
  step: z.literal("outline"),
  topic: z.string().trim().min(3).max(400),
  audience: z.string().trim().max(160).default("Enseignants du primaire · أساتذة التعليم الابتدائي"),
  level: z.string().trim().max(80).default("1AEP – 6AEP"),
  slideCount: z.number().int().min(3).max(15).default(6),
  tone: z.enum(["pedagogical", "workshop", "institutional"]).default("pedagogical"),
  includeInteractive: z.boolean().default(true),
});

export const aiOutlineSlideItemSchema = z.object({
  slideNo: z.number().int().min(1).max(30),
  titleFr: z.string().trim().min(2).max(140),
  titleAr: z.string().trim().min(2).max(140),
  goalFr: z.string().trim().min(2).max(240),
  goalAr: z.string().trim().min(2).max(240),
  suggestedWidget: z
    .enum([
      "bilingual-card",
      "list",
      "table",
      "timeline",
      "diagram",
      "live-poll",
      "mcq-quiz",
      "tf-quiz",
      "flashcards",
      "number-line",
      "fractions-lab",
      "arabic-letters",
      "tarl-tracks",
    ])
    .default("bilingual-card"),
});

export const aiOutlineResponseSchema = z.object({
  deckTitleFr: z.string().trim().min(2).max(160),
  deckTitleAr: z.string().trim().min(2).max(160),
  descriptionFr: z.string().trim().max(320),
  descriptionAr: z.string().trim().max(320),
  slides: z.array(aiOutlineSlideItemSchema).min(2).max(15),
});

export type AiOutlineResponse = z.infer<typeof aiOutlineResponseSchema>;

export const aiGenerateDeckRequestSchema = z.object({
  step: z.literal("deck"),
  roomId: z.string().min(1),
  topic: z.string().trim().min(3).max(400),
  level: z.string().trim().max(80).default("1AEP – 6AEP"),
  themeId: z
    .enum(["mediouna-editorial", "midnight-studio", "ivory-classic"])
    .default("mediouna-editorial"),
  outline: aiOutlineResponseSchema,
});

export const aiGeneratedSlidesOutputSchema = z.object({
  slides: z
    .array(
      z.object({
        titleFr: z.string().trim().min(2).max(140),
        titleAr: z.string().trim().min(2).max(140),
        subtitleFr: z.string().trim().max(180).default(""),
        subtitleAr: z.string().trim().max(180).default(""),
        bodyFr: z.string().trim().min(4).max(500),
        bodyAr: z.string().trim().min(4).max(500),
        widgetType: z
          .enum([
            "bilingual-card",
            "list",
            "callout",
            "live-poll",
            "mcq-quiz",
            "tf-quiz",
            "flashcards",
            "tarl-tracks",
            "number-line",
            "fractions-lab",
            "arabic-letters",
          ])
          .default("bilingual-card"),
        quizQuestionFr: z.string().max(200).optional(),
        quizQuestionAr: z.string().max(200).optional(),
        notesFr: z.string().max(400).default(""),
        notesAr: z.string().max(400).default(""),
        darijaFr: z.string().max(300).default(""),
        darijaAr: z.string().max(300).default(""),
      })
    )
    .min(2)
    .max(15),
});

export const aiEditSlideRequestSchema = z.object({
  slide: z.any(),
  action: z.enum([
    "bilingual-improve",
    "clarify-level",
    "add-quiz",
    "add-manipulative",
    "speaker-notes",
    "custom",
  ]),
  instruction: z.string().max(500).optional(),
  targetLevel: z.string().max(60).optional(),
});

export const aiEditSlideOutputSchema = z.object({
  summaryFr: z.string().trim().min(2).max(200),
  summaryAr: z.string().trim().min(2).max(200),
  titleFr: z.string().trim().min(2).max(140),
  titleAr: z.string().trim().min(2).max(140),
  subtitleFr: z.string().trim().max(200).default(""),
  subtitleAr: z.string().trim().max(200).default(""),
  notesFr: z.string().trim().max(500).default(""),
  notesAr: z.string().trim().max(500).default(""),
  darijaFr: z.string().trim().max(400).default(""),
  darijaAr: z.string().trim().max(400).default(""),
  addWidgetType: z
    .enum(["none", "mcq-quiz", "live-poll", "tf-quiz", "callout", "number-line", "fractions-lab"])
    .default("none"),
  widgetPromptFr: z.string().max(200).optional(),
  widgetPromptAr: z.string().max(200).optional(),
});

export function compileAiSlidesToDeck(params: {
  roomId: string;
  outline: AiOutlineResponse;
  generated: z.infer<typeof aiGeneratedSlidesOutputSchema>;
  themeId: "mediouna-editorial" | "midnight-studio" | "ivory-classic";
}): DeckDocumentV1 {
  const { roomId, outline, generated, themeId } = params;
  const stageBg =
    themeId === "midnight-studio"
      ? "#0B1220"
      : themeId === "ivory-classic"
        ? "#FFFFFF"
        : "#FAF8F4";

  const slides: DeckSlide[] = generated.slides.map((item, idx) => {
    const widgetType: Exclude<ComponentTypeId, "unknown-element"> =
      item.widgetType === "mcq-quiz" ||
      item.widgetType === "live-poll" ||
      item.widgetType === "tf-quiz" ||
      item.widgetType === "flashcards" ||
      item.widgetType === "tarl-tracks" ||
      item.widgetType === "number-line" ||
      item.widgetType === "fractions-lab" ||
      item.widgetType === "arabic-letters" ||
      item.widgetType === "list" ||
      item.widgetType === "callout"
        ? item.widgetType
        : "bilingual-card";

    const headingEl = createSlideElement("heading", {
      id: `ai-h-${idx + 1}`,
      x: 84,
      y: 52,
      width: 1752,
      height: 170,
      zIndex: 1,
      style: {
        backgroundColor: "transparent",
        textColor: themeId === "midnight-studio" ? "#FAF8F4" : "#0B1220",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 12,
        fontSize: 58,
        fontWeight: "bold",
        textAlign: "left",
        padding: 12,
      },
      bilingual: { fr: item.titleFr, ar: item.titleAr },
    });

    const summaryCard = createSlideElement("callout", {
      id: `ai-body-${idx + 1}`,
      x: 84,
      y: 256,
      width: 1752,
      height: 220,
      zIndex: 2,
      bilingual: {
        fr: item.subtitleFr || item.titleFr,
        ar: item.subtitleAr || item.titleAr,
      },
      config: {
        bodyFr: item.bodyFr,
        bodyAr: item.bodyAr,
      },
    });

    const primaryWidget = createSlideElement(widgetType, {
      id: `ai-widget-${idx + 1}`,
      x: 84,
      y: 510,
      width: 1752,
      height: 490,
      zIndex: 3,
      bilingual:
        item.quizQuestionFr && item.quizQuestionAr
          ? { fr: item.quizQuestionFr, ar: item.quizQuestionAr }
          : undefined,
    });

    return {
      id: `ai-slide-${idx + 1}`,
      order: idx,
      sectionId: `sec-${Math.floor(idx / 2) + 1}`,
      title: { fr: item.titleFr, ar: item.titleAr },
      subtitle: { fr: item.subtitleFr, ar: item.subtitleAr },
      layout: idx === 0 ? "title-hero" : "interactive-stage",
      hidden: false,
      transition: "fade",
      background: { color: stageBg, accentColor: "#0F766E" },
      notes: {
        fr: item.notesFr,
        ar: item.notesAr,
        darijaFr: item.darijaFr,
        darijaAr: item.darijaAr,
        durationCue: "5 min",
        classroomExampleFr: "",
        classroomExampleAr: "",
        discussionPromptFr: "",
        discussionPromptAr: "",
      },
      elements: [headingEl, summaryCard, primaryWidget],
    };
  });

  return {
    schemaVersion: STUDIO_DOC_VERSION,
    id: `deck-ai-${Date.now().toString(36)}`,
    roomId,
    title: { fr: outline.deckTitleFr, ar: outline.deckTitleAr },
    description: { fr: outline.descriptionFr, ar: outline.descriptionAr },
    canvasWidth: LOGICAL_SLIDE_WIDTH,
    canvasHeight: LOGICAL_SLIDE_HEIGHT,
    theme: {
      id: themeId,
      name: { fr: "Éditorial Studio AI", ar: "تصميم استوديو الذكاء الاصطناعي" },
      stageBackground: stageBg,
      primaryInk: themeId === "midnight-studio" ? "#FAF8F4" : "#0B1220",
      accentTeal: "#0F766E",
      highlightTeal: "#2DD4BF",
    },
    sections: [
      {
        id: "sec-1",
        number: 1,
        title: { fr: outline.deckTitleFr, ar: outline.deckTitleAr },
        timeRange: { fr: `${slides.length * 5} min`, ar: `${slides.length * 5} د` },
      },
    ],
    slides,
  };
}
