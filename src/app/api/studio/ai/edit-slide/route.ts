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
import { aiEditSlideOutputSchema, aiEditSlideRequestSchema } from "@/lib/ai/schemas";
import { createSlideElement } from "@/lib/studio/component-registry";
import { deckSlideSchema, type ComponentTypeId, type DeckSlide } from "@/lib/studio/document-schema";

export async function POST(request: NextRequest) {
  const presenter = await verifyPresenterSession();
  if (!presenter) {
    return NextResponse.json(
      { error: "Authentification formateur requise pour l'assistant IA." },
      { status: 401 }
    );
  }

  const ip = extractClientIp(request.headers);
  if (!checkAiRateLimit(`ai_edit:${ip}`)) {
    return NextResponse.json({ error: "Limite de requêtes IA atteinte." }, { status: 429 });
  }

  const allowMock = isAiMockHeaderAllowed(request.headers.get("host"));
  const mockHeader = allowMock
    ? request.headers.get("x-studio-ai-mock")
    : null;

  try {
    const body = await request.json();
    const parsedReq = aiEditSlideRequestSchema.safeParse(body);
    if (!parsedReq.success) {
      return NextResponse.json({ error: "Requête d'édition invalide." }, { status: 400 });
    }

    const slideParsed = deckSlideSchema.safeParse(parsedReq.data.slide);
    if (!slideParsed.success) {
      return NextResponse.json({ error: "Diapositive source invalide." }, { status: 400 });
    }

    const sourceSlide = slideParsed.data;
    const { data: editOutput, meta } = await runStructuredAi({
      schema: aiEditSlideOutputSchema,
      system:
        "Tu es un assistant pédagogique bilingue FR/AR pour AI Teacher Lab. Propose une amélioration précise et non destructive d'une seule diapositive 16:9.",
      prompt: `Action demandée : ${parsedReq.data.action}. Niveau cible : ${parsedReq.data.targetLevel ?? "1AEP-6AEP"}. Consigne additionnelle : ${parsedReq.data.instruction ?? "Aucune"}. Titre actuel FR: "${sourceSlide.title.fr}", AR: "${sourceSlide.title.ar}". Notes FR: "${sourceSlide.notes.fr}".`,
      signal: request.signal,
      allowMock,
      mockKind: mockHeader === "malformed" ? "malformed" : mockHeader ? "edit" : undefined,
      mockContext: { topic: sourceSlide.title.fr },
    });

    const nextElements = [...sourceSlide.elements];
    if (editOutput.addWidgetType !== "none") {
      const widgetType = editOutput.addWidgetType as Exclude<ComponentTypeId, "unknown-element">;
      const added = createSlideElement(widgetType, {
        x: 100,
        y: 520,
        width: 1720,
        height: 460,
        zIndex: nextElements.length + 2,
        bilingual:
          editOutput.widgetPromptFr && editOutput.widgetPromptAr
            ? { fr: editOutput.widgetPromptFr, ar: editOutput.widgetPromptAr }
            : undefined,
      });
      nextElements.push(added);
    }

    // Update main heading element if present
    const finalElements = nextElements.map((el) =>
      el.type === "heading"
        ? { ...el, bilingual: { fr: editOutput.titleFr, ar: editOutput.titleAr } }
        : el
    );

    const proposedSlide: DeckSlide = {
      ...sourceSlide,
      title: { fr: editOutput.titleFr, ar: editOutput.titleAr },
      subtitle: { fr: editOutput.subtitleFr, ar: editOutput.subtitleAr },
      notes: {
        ...sourceSlide.notes,
        fr: editOutput.notesFr || sourceSlide.notes.fr,
        ar: editOutput.notesAr || sourceSlide.notes.ar,
        darijaFr: editOutput.darijaFr || sourceSlide.notes.darijaFr,
        darijaAr: editOutput.darijaAr || sourceSlide.notes.darijaAr,
      },
      legacySource: sourceSlide.legacySource
        ? { ...sourceSlide.legacySource, edited: true }
        : undefined,
      elements: finalElements,
    };

    return NextResponse.json({
      summary: { fr: editOutput.summaryFr, ar: editOutput.summaryAr },
      proposedSlide,
      meta,
    });
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur assistant IA." },
      { status: 500 }
    );
  }
}
