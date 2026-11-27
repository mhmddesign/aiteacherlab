import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPresenterSession } from "@/lib/auth/session";
import { getStudioStore, StudioNotFoundError } from "@/lib/studio/studio-store";

const restoreSchema = z.object({
  action: z.literal("restore"),
  revisionNo: z.number().int().min(1),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ deckId: string }> }
) {
  const { deckId } = await context.params;
  const revisions = await getStudioStore().listRevisions(deckId);
  return NextResponse.json({
    revisions: revisions.map((r) => ({
      id: r.id,
      deckId: r.deckId,
      revisionNo: r.revisionNo,
      summary: r.summary,
      source: r.source,
      createdAt: r.createdAt,
      slideCount: r.document.slides.length,
    })),
  });
}

export async function POST(
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
    const parsed = restoreSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Numéro de révision invalide." }, { status: 400 });
    }

    const deck = await getStudioStore().restoreRevision(deckId, parsed.data.revisionNo);
    return NextResponse.json({ deck });
  } catch (error) {
    if (error instanceof StudioNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Restauration impossible." },
      { status: 500 }
    );
  }
}
