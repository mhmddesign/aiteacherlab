import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPresenterSession } from "@/lib/auth/session";
import { deckDocumentV1Schema } from "@/lib/studio/document-schema";
import { getStudioStore, StudioNotFoundError } from "@/lib/studio/studio-store";

const createDeckSchema = z.object({
  mode: z.enum(["blank", "template", "duplicate", "mediouna", "ai", "json", "markdown"]),
  title: z.object({
    fr: z.string().trim().min(1).max(180),
    ar: z.string().trim().min(1).max(180),
  }),
  templateKey: z.enum(["primary-lesson", "teacher-training", "quiz-session", "blank"]).optional(),
  sourceDeckId: z.string().optional(),
  markdown: z.string().max(100000).optional(),
  rawDocument: z.unknown().optional(),
  aiDocument: deckDocumentV1Schema.optional(),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await context.params;
  const decks = await getStudioStore().listDecksByRoom(roomId);
  return NextResponse.json({ decks });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const presenter = await verifyPresenterSession();
  if (!presenter) {
    return NextResponse.json({ error: "Authentification formateur requise." }, { status: 401 });
  }

  const { roomId } = await context.params;
  try {
    const json = await request.json();
    const parsed = createDeckSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres de création invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const deck = await getStudioStore().createDeck({
      roomId,
      mode: parsed.data.mode,
      title: parsed.data.title,
      templateKey: parsed.data.templateKey,
      sourceDeckId: parsed.data.sourceDeckId,
      markdown: parsed.data.markdown,
      rawDocument: parsed.data.rawDocument,
      aiDocument: parsed.data.aiDocument,
    });

    return NextResponse.json({ deck }, { status: 201 });
  } catch (error) {
    if (error instanceof StudioNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Création de présentation impossible." },
      { status: 500 }
    );
  }
}
