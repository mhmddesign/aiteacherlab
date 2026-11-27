import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import type { z } from "zod";
import {
  aiEditSlideOutputSchema,
  aiGeneratedSlidesOutputSchema,
  aiOutlineResponseSchema,
  type AiOutlineResponse,
} from "./schemas";

const DEFAULT_MODEL_ID = "gemini-2.5-flash";

// Lightweight server-side rate limiter (15 generations per 10 minutes per client)
const aiRateWindowMap = new Map<string, number[]>();

export function checkAiRateLimit(key: string, maxRequests = 15, windowMs = 600_000): boolean {
  const now = Date.now();
  const prev = aiRateWindowMap.get(key) ?? [];
  const active = prev.filter((ts) => now - ts < windowMs);
  if (active.length >= maxRequests) {
    aiRateWindowMap.set(key, active);
    return false;
  }
  active.push(now);
  aiRateWindowMap.set(key, active);
  return true;
}

export class AiUnavailableError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 503) {
    super(message);
    this.name = "AiUnavailableError";
    this.statusCode = statusCode;
  }
}

export interface AiGenerationMeta {
  modelId: string;
  mocked: boolean;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedUsd: number;
  };
}

function estimateCostUsd(inputTokens: number, outputTokens: number): number {
  // Gemini 2.5 Flash indicative API pricing (~$0.15/1M input, $0.60/1M output)
  const cost = (inputTokens / 1_000_000) * 0.15 + (outputTokens / 1_000_000) * 0.6;
  return Math.round(cost * 100000) / 100000;
}

function getServerApiKey(): string | null {
  const key =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    "";
  return key.length > 0 ? key : null;
}

export function isAiMockHeaderAllowed(hostHeader?: string | null): boolean {
  if (process.env.VERCEL || process.env.VERCEL_ENV) return false;
  if (process.env.NODE_ENV !== "production") return true;
  if (!hostHeader) return false;
  const host = hostHeader.split(":")[0]?.toLowerCase() ?? "";
  return host === "localhost" || host === "127.0.0.1";
}

function buildDeterministicOutlineMock(topic: string, slideCount: number): AiOutlineResponse {
  const count = Math.max(2, Math.min(15, slideCount));
  const widgets = [
    "bilingual-card",
    "live-poll",
    "number-line",
    "mcq-quiz",
    "fractions-lab",
    "tarl-tracks",
  ] as const;

  return {
    deckTitleFr: `Atelier : ${topic}`,
    deckTitleAr: `ورشة تطبيقية: ${topic}`,
    descriptionFr: `Séquence bilingue prête pour l'animation de classe sur ${topic}.`,
    descriptionAr: `تسلسل بيداغوجي ثنائي اللغة حول موضوع ${topic}.`,
    slides: Array.from({ length: count }, (_, idx) => ({
      slideNo: idx + 1,
      titleFr:
        idx === 0
          ? `Découvrir : ${topic}`
          : idx === count - 1
            ? "Bilan et mise en pratique"
            : `Étape ${idx + 1} · Manipulation et échange`,
      titleAr:
        idx === 0
          ? `استكشاف: ${topic}`
          : idx === count - 1
            ? "الخلاصة والتطبيق داخل القسم"
            : `المرحلة ${idx + 1} · مناولة وتفاعل`,
      goalFr: `Comprendre et pratiquer l'objectif ${idx + 1} avec la classe.`,
      goalAr: `فهم وتطبيق الهدف رقم ${idx + 1} مع المتعلمين.`,
      suggestedWidget: widgets[idx % widgets.length],
    })),
  };
}

function buildDeterministicSlidesMock(outline: AiOutlineResponse) {
  return {
    slides: outline.slides.map((item, idx) => ({
      titleFr: item.titleFr,
      titleAr: item.titleAr,
      subtitleFr: item.goalFr,
      subtitleAr: item.goalAr,
      bodyFr: `Activité structurée pour ${item.titleFr}. Aucune donnée d'élève requise.`,
      bodyAr: `نشاط منظم لمرحلة ${item.titleAr} دون استخدام أي معطيات شخصية.`,
      widgetType: (idx === 1 ? "live-poll" : idx === 2 ? "mcq-quiz" : "bilingual-card") as
        | "live-poll"
        | "mcq-quiz"
        | "bilingual-card",
      quizQuestionFr: idx === 2 ? `Question clé : ${item.titleFr}` : undefined,
      quizQuestionAr: idx === 2 ? `سؤال محوري: ${item.titleAr}` : undefined,
      notesFr: `Animation guidée (${idx + 1}/${outline.slides.length}) : laisser 3 minutes d'échange.`,
      notesAr: `تنشيط موجه: تخصيص 3 دقائق للمناقشة الجماعية.`,
      darijaFr: "Nbdaw b exemple bssit men l-qism qbel ma n-tabqo.",
      darijaAr: "نبداو بمثال بسيط من القسم قبل التطبيق.",
    })),
  };
}

export async function runStructuredAi<T extends z.ZodTypeAny>(params: {
  schema: T;
  system: string;
  prompt: string;
  signal?: AbortSignal;
  allowMock?: boolean;
  mockKind?: "outline" | "deck" | "edit" | "malformed";
  mockContext?: { topic?: string; slideCount?: number; outline?: AiOutlineResponse };
}): Promise<{ data: z.infer<T>; meta: AiGenerationMeta }> {
  const { schema, system, prompt, signal, allowMock, mockKind, mockContext } = params;

  if (mockKind && allowMock) {
    if (mockKind === "malformed") {
      // Pass invalid shape deliberately through schema.parse to verify malformed output rejection
      const invalidRaw = { invalidStructure: true, slides: "not-an-array" };
      const parsed = schema.parse(invalidRaw);
      return {
        data: parsed,
        meta: {
          modelId: "mock-validator",
          mocked: true,
          usage: { inputTokens: 120, outputTokens: 80, totalTokens: 200, estimatedUsd: 0 },
        },
      };
    }

    if (mockKind === "outline") {
      const mockObj = buildDeterministicOutlineMock(
        mockContext?.topic ?? "Les fractions en 4AEP",
        mockContext?.slideCount ?? 4
      );
      const parsed = aiOutlineResponseSchema.parse(mockObj);
      return {
        data: schema.parse(parsed),
        meta: {
          modelId: `${DEFAULT_MODEL_ID} (mock)`,
          mocked: true,
          usage: { inputTokens: 420, outputTokens: 310, totalTokens: 730, estimatedUsd: 0 },
        },
      };
    }

    if (mockKind === "deck" && mockContext?.outline) {
      const mockSlides = buildDeterministicSlidesMock(mockContext.outline);
      const parsed = aiGeneratedSlidesOutputSchema.parse(mockSlides);
      return {
        data: schema.parse(parsed),
        meta: {
          modelId: `${DEFAULT_MODEL_ID} (mock)`,
          mocked: true,
          usage: { inputTokens: 680, outputTokens: 920, totalTokens: 1600, estimatedUsd: 0 },
        },
      };
    }

    if (mockKind === "edit") {
      const editMock = aiEditSlideOutputSchema.parse({
        summaryFr: "Clarté bilingue FR/AR améliorée et ajout d'un quiz vérifiable",
        summaryAr: "تحسين الصياغة الثنائية اللغة مع إضافة سؤال تفاعلي",
        titleFr: `${mockContext?.topic ?? "Séance"} — Version clarifiée`,
        titleAr: `${mockContext?.topic ?? "الحصة"} — نسخة واضحة ومبسطة`,
        subtitleFr: "Consigne courte adaptée au projetable 16:9",
        subtitleAr: "تعليمة موجزة ومناسبة للعرض الجماعي",
        notesFr: "Poser d'abord la question à l'oral puis ouvrir le vote 60 secondes.",
        notesAr: "طرح السؤال شفهياً أولاً ثم فتح التصويت لمدة دقيقة.",
        darijaFr: "N-sawlo t-talamid b Darija bach kolchi y-fhem qbel l-vote.",
        darijaAr: "نسولو الأساتذة أو التلاميذ بالدارجة باش كلشي يفهم قبل التصويت.",
        addWidgetType: "mcq-quiz",
        widgetPromptFr: "Quel réflexe adopter avant d'utiliser un support en classe ?",
        widgetPromptAr: "ما الخطوة الأساسية قبل استعمال أي مورد داخل القسم؟",
      });
      return {
        data: schema.parse(editMock),
        meta: {
          modelId: `${DEFAULT_MODEL_ID} (mock)`,
          mocked: true,
          usage: { inputTokens: 350, outputTokens: 290, totalTokens: 640, estimatedUsd: 0 },
        },
      };
    }
  }

  const apiKey = getServerApiKey();
  if (!apiKey) {
    throw new AiUnavailableError(
      "Clé Gemini (GOOGLE_GENERATIVE_AI_API_KEY) non configurée sur le serveur · مفتاح Gemini غير مُعدّ على الخادم",
      503
    );
  }

  const modelId = process.env.STUDIO_AI_MODEL?.trim() || DEFAULT_MODEL_ID;
  const google = createGoogleGenerativeAI({ apiKey });

  const timeoutSignal = AbortSignal.timeout(30_000);
  const combinedSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  const result = await generateText({
    model: google(modelId),
    system,
    prompt,
    output: Output.object({ schema }),
    abortSignal: combinedSignal,
    maxOutputTokens: 4096,
    temperature: 0.4,
  });

  const validated = schema.parse(result.output);
  const inputTokens = result.usage?.inputTokens ?? 0;
  const outputTokens = result.usage?.outputTokens ?? 0;
  const totalTokens = result.usage?.totalTokens ?? inputTokens + outputTokens;

  return {
    data: validated,
    meta: {
      modelId,
      mocked: false,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedUsd: estimateCostUsd(inputTokens, outputTokens),
      },
    },
  };
}
