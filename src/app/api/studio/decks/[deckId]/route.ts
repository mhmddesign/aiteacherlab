import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPresenterSession } from "@/lib/auth/session";
import { deckDocumentV1Schema } from "@/lib/studio/document-schema";
import {
  getStudioStore,
  RevisionConflictError,
  StudioNotFoundError,
} from "@/lib/studio/studio-store";

const patchDeckSchema = z.object({
  expectedRevision: z.number().int().min(1),
  document: deckDocumentV1Schema,
  summary: z
    .object({
      fr: z.string().trim().max(200),
      ar: z.string().trim().max(200),
    })
    .optional(),
  source: z.enum(["manual", "autosave", "import", "ai", "restore"]).optional(),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ deckId: string }> }
) {
  const { deckId } = await context.params;
  const deck = await getStudioStore().getDeck(deckId);
  if (!deck) {
    return NextResponse.json({ error: "Présentation introuvable." }, { status: 404 });
  }
  return NextResponse.json({ deck });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ deckId: string }> }
) {
  const presenter = await verifyPresenterSession();
  if (!presenter) {
    return NextResponse.json({ error: "Authentification formateur requise." }, { status: 401 });
  }

  const { deckId } = await context.params;
  try {
    const json = await request.json();
    const parsed = patchDeckSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Document invalide.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await getStudioStore().saveDeckRevision({
      deckId,
      expectedRevision: parsed.data.expectedRevision,
      document: parsed.data.document,
      summary: parsed.data.summary,
      source: parsed.data.source ?? "manual",
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof RevisionConflictError) {
      return NextResponse.json(
        {
          error: error.message,
          currentRevisionNo: error.currentRevisionNo,
          serverDocument: error.serverDocument,
        },
        { status: 409 }
      );
    }
    if (error instanceof StudioNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Enregistrement impossible." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ deckId: string }> }
) {
  const presenter = await verifyPresenterSession();
  if (!presenter) {
    return NextResponse.json({ error: "Authentification formateur requise." }, { status: 401 });
  }

  const { deckId } = await context.params;
  try {
    await getStudioStore().deleteDeck(deckId);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Suppression impossible." },
      { status: 400 }
    );
  }
}
