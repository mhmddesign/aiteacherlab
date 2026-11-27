import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { extractClientIp } from "@/lib/auth/crypto";
import { verifyPresenterSession } from "@/lib/auth/session";
import {
  AiUnavailableError,
  checkAiRateLimit,
  isAiMockHeaderAllowed,
  runStructuredAi,
} from "@/lib/ai/provider";
import {
  aiGeneratedSlidesOutputSchema,
  aiGenerateDeckRequestSchema,
  aiOutlineRequestSchema,
  aiOutlineResponseSchema,
  compileAiSlidesToDeck,
} from "@/lib/ai/schemas";

export async function POST(request: NextRequest) {
  const presenter = await verifyPresenterSession();
  if (!presenter) {
    return NextResponse.json(
      { error: "Authentification formateur requise pour l'assistant IA." },
      { status: 401 }
    );
  }

  const ip = extractClientIp(request.headers);
  if (!checkAiRateLimit(`ai_gen:${ip}`)) {
    return NextResponse.json(
      { error: "Limite de requêtes IA atteinte. Patientez quelques minutes." },
      { status: 429 }
    );
  }

  const allowMock = isAiMockHeaderAllowed(request.headers.get("host"));
  const mockHeader = allowMock
    ? request.headers.get("x-studio-ai-mock")
    : null;

  try {
    const body = await request.json();

    if (body?.step === "outline") {
      const parsed = aiOutlineRequestSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Paramètres de plan IA invalides.", details: parsed.error.flatten() },
          { status: 400 }
        );
      }

      const { data: outline, meta } = await runStructuredAi({
        schema: aiOutlineResponseSchema,
        system:
          "Tu es un ingénieur pédagogique marocain expert bilingue Français (LTR) et Arabe (RTL) pour AI Teacher Lab. Tu génères toujours les deux langues simultanément, jamais une seule langue, sans données personnelles d'élèves.",
        prompt: `Génère un plan structuré en ${parsed.data.slideCount} diapositives pour le sujet : "${parsed.data.topic}". Public : ${parsed.data.audience}. Niveau : ${parsed.data.level}. Ton : ${parsed.data.tone}. Activités interactives incluses : ${parsed.data.includeInteractive}.`,
        signal: request.signal,
        allowMock,
        mockKind: mockHeader === "malformed" ? "malformed" : mockHeader ? "outline" : undefined,
        mockContext: { topic: parsed.data.topic, slideCount: parsed.data.slideCount },
      });

      return NextResponse.json({ outline, meta });
    }

    if (body?.step === "deck") {
      const parsed = aiGenerateDeckRequestSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Plan de présentation invalide.", details: parsed.error.flatten() },
          { status: 400 }
        );
      }

      const { data: generated, meta } = await runStructuredAi({
        schema: aiGeneratedSlidesOutputSchema,
        system:
          "Tu transformes un plan pédagogique bilingue en diapositives complètes FR (LTR) + AR (RTL) lisibles sur vidéoprojecteur, avec notes formateur FR, AR et Darija marocaine, sans données personnelles.",
        prompt: `Sujet : ${parsed.data.topic} (${parsed.data.level}). Plan validé : ${JSON.stringify(parsed.data.outline)}`,
        signal: request.signal,
        allowMock,
        mockKind: mockHeader === "malformed" ? "malformed" : mockHeader ? "deck" : undefined,
        mockContext: { outline: parsed.data.outline },
      });

      const document = compileAiSlidesToDeck({
        roomId: parsed.data.roomId,
        outline: parsed.data.outline,
        generated,
        themeId: parsed.data.themeId,
      });

      return NextResponse.json({ document, meta });
    }

    return NextResponse.json(
      { error: "Champ 'step' requis ('outline' ou 'deck')." },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof AiUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Sortie IA invalide rejetée par validation Zod.", details: error.flatten() },
        { status: 422 }
      );
    }
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Génération annulée." }, { status: 499 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur de génération IA." },
      { status: 500 }
    );
  }
}
