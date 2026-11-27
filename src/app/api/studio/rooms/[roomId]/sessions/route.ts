import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPresenterSession } from "@/lib/auth/session";
import { getStudioStore, StudioNotFoundError } from "@/lib/studio/studio-store";

const createSessionSchema = z.object({
  deckId: z.string().min(1),
  title: z
    .object({
      fr: z.string().trim().min(1).max(160),
      ar: z.string().trim().min(1).max(160),
    })
    .optional(),
  joinPin: z.string().trim().regex(/^\d{4,6}$/).optional(),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await context.params;
  const presenter = await verifyPresenterSession();
  const sessions = await getStudioStore().listSessionsByRoom(roomId);
  return NextResponse.json({
    sessions: sessions.map((s) => ({
      ...s,
      joinPin: presenter ? s.joinPin : "••••",
    })),
  });
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
    const parsed = createSessionSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Paramètres de session invalides." }, { status: 400 });
    }
    const session = await getStudioStore().createSession({
      roomId,
      deckId: parsed.data.deckId,
      title: parsed.data.title,
      joinPin: parsed.data.joinPin,
    });
    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    if (error instanceof StudioNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lancement de session impossible." },
      { status: 500 }
    );
  }
}
