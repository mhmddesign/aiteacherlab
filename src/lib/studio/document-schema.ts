import { z } from "zod";
import type { BilingualText } from "@/content/types";

export const STUDIO_DOC_VERSION = 1 as const;
export const LOGICAL_SLIDE_WIDTH = 1920 as const;
export const LOGICAL_SLIDE_HEIGHT = 1080 as const;

export const bilingualTextSchema = z.object({
  fr: z.string(),
  ar: z.string(),
});

export const COMPONENT_TYPE_IDS = [
  // General content
  "heading",
  "text",
  "bilingual-card",
  "callout",
  "image",
  "shape",
  "divider",
  "list",
  "table",
  "chart",
  "timeline",
  "diagram",
  "qr-join",
  // Interactive live & engagement
  "live-poll",
  "mcq-quiz",
  "tf-quiz",
  "short-answer",
  "word-cloud",
  "flashcards",
  "matching",
  "ordering",
  "reveal-card",
  "countdown-timer",
  "group-task",
  "exit-ticket",
  // Primary-school 1AEP–6AEP
  "arabic-letters",
  "french-reading",
  "number-line",
  "abacus",
  "base10-blocks",
  "fractions-lab",
  "math-operations",
  "tarl-tracks",
  "worksheet-generator",
  // Advanced sandboxed code
  "code-sandbox",
  // Safe fallback for unrecognized future/malformed elements
  "unknown-element",
] as const;

export type ComponentTypeId = (typeof COMPONENT_TYPE_IDS)[number];

export const elementStyleSchema = z.object({
  backgroundColor: z.string().default("transparent"),
  textColor: z.string().default("#0B1220"),
  borderColor: z.string().default("transparent"),
  borderWidth: z.number().min(0).max(24).default(0),
  borderRadius: z.number().min(0).max(999).default(16),
  fontSize: z.number().min(14).max(160).default(28),
  fontWeight: z.enum(["normal", "semibold", "bold"]).default("normal"),
  textAlign: z.enum(["left", "center", "right"]).default("left"),
  padding: z.number().min(0).max(120).default(24),
});

export type SlideElementStyle = z.infer<typeof elementStyleSchema>;

export const slideElementSchema = z.object({
  id: z.string().min(1),
  type: z.enum(COMPONENT_TYPE_IDS),
  name: z.string().optional(),
  x: z.number().min(-400).max(LOGICAL_SLIDE_WIDTH).default(96),
  y: z.number().min(-400).max(LOGICAL_SLIDE_HEIGHT).default(220),
  width: z.number().min(40).max(LOGICAL_SLIDE_WIDTH + 400).default(800),
  height: z.number().min(20).max(LOGICAL_SLIDE_HEIGHT + 400).default(240),
  rotation: z.number().min(-360).max(360).default(0),
  zIndex: z.number().int().min(0).max(500).default(1),
  visible: z.boolean().default(true),
  locked: z.boolean().default(false),
  style: elementStyleSchema.default({
    backgroundColor: "transparent",
    textColor: "#0B1220",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 16,
    fontSize: 28,
    fontWeight: "normal",
    textAlign: "left",
    padding: 24,
  }),
  bilingual: bilingualTextSchema.optional(),
  config: z.record(z.string(), z.unknown()).default({}),
});

export type SlideElement = z.infer<typeof slideElementSchema>;

export const slideNotesSchema = z.object({
  fr: z.string().default(""),
  ar: z.string().default(""),
  darijaFr: z.string().default(""),
  darijaAr: z.string().default(""),
  durationCue: z.string().default("3 min"),
  classroomExampleFr: z.string().default(""),
  classroomExampleAr: z.string().default(""),
  discussionPromptFr: z.string().default(""),
  discussionPromptAr: z.string().default(""),
});

export type DeckSlideNotes = z.infer<typeof slideNotesSchema>;

export const deckSlideSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(0),
  sectionId: z.string().min(1),
  title: bilingualTextSchema,
  subtitle: bilingualTextSchema.default({ fr: "", ar: "" }),
  layout: z
    .enum([
      "freeform",
      "title-hero",
      "two-column",
      "interactive-stage",
      "bilingual-split",
      "closing-dark",
    ])
    .default("freeform"),
  hidden: z.boolean().default(false),
  transition: z.enum(["none", "fade", "slide"]).default("fade"),
  background: z
    .object({
      color: z.string().default("#FAF8F4"),
      accentColor: z.string().default("#0F766E"),
    })
    .default({ color: "#FAF8F4", accentColor: "#0F766E" }),
  notes: slideNotesSchema.default({
    fr: "",
    ar: "",
    darijaFr: "",
    darijaAr: "",
    durationCue: "3 min",
    classroomExampleFr: "",
    classroomExampleAr: "",
    discussionPromptFr: "",
    discussionPromptAr: "",
  }),
  legacySource: z
    .object({
      slideId: z.string(),
      slideKind: z.string(),
      activityKey: z.string().nullable().optional(),
      edited: z.boolean().default(false),
    })
    .optional(),
  elements: z.array(slideElementSchema).default([]),
});

export type DeckSlide = z.infer<typeof deckSlideSchema>;

export const deckSectionSchema = z.object({
  id: z.string().min(1),
  number: z.number().int().min(1),
  title: bilingualTextSchema,
  timeRange: bilingualTextSchema.default({ fr: "5 min", ar: "5 د" }),
});

export type DeckSection = z.infer<typeof deckSectionSchema>;

export const deckThemeSchema = z.object({
  id: z.enum(["mediouna-editorial", "midnight-studio", "ivory-classic"]).default("mediouna-editorial"),
  name: bilingualTextSchema.default({
    fr: "Éditorial Mediouna",
    ar: "تحريري مديونة",
  }),
  stageBackground: z.string().default("#FAF8F4"),
  primaryInk: z.string().default("#0B1220"),
  accentTeal: z.string().default("#0F766E"),
  highlightTeal: z.string().default("#2DD4BF"),
});

export type DeckTheme = z.infer<typeof deckThemeSchema>;

export const deckDocumentV1Schema = z.object({
  schemaVersion: z.literal(1).default(1),
  id: z.string().min(1),
  roomId: z.string().min(1),
  title: bilingualTextSchema,
  description: bilingualTextSchema.default({ fr: "", ar: "" }),
  canvasWidth: z.literal(LOGICAL_SLIDE_WIDTH).default(LOGICAL_SLIDE_WIDTH),
  canvasHeight: z.literal(LOGICAL_SLIDE_HEIGHT).default(LOGICAL_SLIDE_HEIGHT),
  theme: deckThemeSchema.default({
    id: "mediouna-editorial",
    name: { fr: "Éditorial Mediouna", ar: "تحريري مديونة" },
    stageBackground: "#FAF8F4",
    primaryInk: "#0B1220",
    accentTeal: "#0F766E",
    highlightTeal: "#2DD4BF",
  }),
  sections: z.array(deckSectionSchema).min(1),
  slides: z.array(deckSlideSchema).min(1),
});

export type DeckDocumentV1 = z.infer<typeof deckDocumentV1Schema>;

const VALID_TYPE_SET = new Set<string>(COMPONENT_TYPE_IDS);

/**
 * Safely normalizes arbitrary/older deck payloads and isolates unknown or
 * malformed element definitions into recoverable `unknown-element` placeholders
 * so the editor and presenter never crash on unexpected JSON.
 */
export function normalizeDeckDocument(
  raw: unknown,
  fallbackMeta?: { id?: string; roomId?: string; title?: BilingualText }
): DeckDocumentV1 {
  const input = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const rawSlides = Array.isArray(input.slides) ? input.slides : [];

  const sanitizedSlides = rawSlides.map((s, sIdx) => {
    const slideObj = (typeof s === "object" && s !== null ? s : {}) as Record<string, unknown>;
    const rawElements = Array.isArray(slideObj.elements) ? slideObj.elements : [];

    const sanitizedElements = rawElements.map((el, eIdx) => {
      const elObj = (typeof el === "object" && el !== null ? el : {}) as Record<string, unknown>;
      const rawType = typeof elObj.type === "string" ? elObj.type : "unknown-element";
      const safeType: ComponentTypeId = VALID_TYPE_SET.has(rawType)
        ? (rawType as ComponentTypeId)
        : "unknown-element";

      const candidate = {
        ...elObj,
        id: typeof elObj.id === "string" && elObj.id ? elObj.id : `el-${sIdx}-${eIdx}`,
        type: safeType,
        config:
          safeType === "unknown-element" && rawType !== "unknown-element"
            ? { originalType: rawType, rawConfig: elObj.config ?? {} }
            : typeof elObj.config === "object" && elObj.config !== null
              ? elObj.config
              : {},
      };

      const parsedEl = slideElementSchema.safeParse(candidate);
      if (parsedEl.success) return parsedEl.data;

      return slideElementSchema.parse({
        id: candidate.id,
        type: "unknown-element",
        x: 96,
        y: 240,
        width: 640,
        height: 180,
        config: { originalType: rawType, error: parsedEl.error.issues[0]?.message ?? "Invalid element" },
      });
    });

    return {
      ...slideObj,
      id: typeof slideObj.id === "string" && slideObj.id ? slideObj.id : `slide-${sIdx + 1}`,
      order: typeof slideObj.order === "number" ? slideObj.order : sIdx,
      sectionId:
        typeof slideObj.sectionId === "string" && slideObj.sectionId
          ? slideObj.sectionId
          : "sec-1",
      title:
        typeof slideObj.title === "object" && slideObj.title !== null
          ? slideObj.title
          : { fr: `Diapositive ${sIdx + 1}`, ar: `الشريحة ${sIdx + 1}` },
      elements: sanitizedElements,
    };
  });

  const normalizedCandidate = {
    ...input,
    schemaVersion: 1,
    canvasWidth: LOGICAL_SLIDE_WIDTH,
    canvasHeight: LOGICAL_SLIDE_HEIGHT,
    id:
      typeof input.id === "string" && input.id
        ? input.id
        : fallbackMeta?.id ?? `deck-${Date.now()}`,
    roomId:
      typeof input.roomId === "string" && input.roomId
        ? input.roomId
        : fallbackMeta?.roomId ?? "room-mediouna-primary",
    title:
      typeof input.title === "object" && input.title !== null
        ? input.title
        : fallbackMeta?.title ?? {
            fr: "Présentation sans titre",
            ar: "عرض تقديمي بدون عنوان",
          },
    sections:
      Array.isArray(input.sections) && input.sections.length > 0
        ? input.sections
        : [
            {
              id: "sec-1",
              number: 1,
              title: { fr: "1. Introduction", ar: "1. التقديم" },
              timeRange: { fr: "0 – 10 min", ar: "0 – 10 د" },
            },
          ],
    slides:
      sanitizedSlides.length > 0
        ? sanitizedSlides
        : [
            {
              id: "slide-1",
              order: 0,
              sectionId: "sec-1",
              title: { fr: "Nouvelle diapositive", ar: "شريحة جديدة" },
              subtitle: { fr: "Sous-titre", ar: "عنوان فرعي" },
              elements: [],
            },
          ],
  };

  return deckDocumentV1Schema.parse(normalizedCandidate);
}

export function clampToLogicalCanvas(
  rect: { x: number; y: number; width: number; height: number }
) {
  const width = Math.max(40, Math.min(LOGICAL_SLIDE_WIDTH, Math.round(rect.width)));
  const height = Math.max(20, Math.min(LOGICAL_SLIDE_HEIGHT, Math.round(rect.height)));
  const x = Math.max(-200, Math.min(LOGICAL_SLIDE_WIDTH - 40, Math.round(rect.x)));
  const y = Math.max(-200, Math.min(LOGICAL_SLIDE_HEIGHT - 20, Math.round(rect.y)));
  return { x, y, width, height };
}
