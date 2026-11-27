import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPresenterSession } from "@/lib/auth/session";
import { getStudioStore, StudioNotFoundError } from "@/lib/studio/studio-store";

const patchRoomSchema = z.object({
  title: z
    .object({
      fr: z.string().trim().min(2).max(140),
      ar: z.string().trim().min(2).max(140),
    })
    .optional(),
  subtitle: z
    .object({
      fr: z.string().trim().max(240),
      ar: z.string().trim().max(240),
    })
    .optional(),
  levelBadge: z.string().trim().max(80).optional(),
  joinPin: z.string().trim().regex(/^\d{4,6}$/).optional(),
  status: z.enum(["active", "archived"]).optional(),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await context.params;
  const store = getStudioStore();
  const presenter = await verifyPresenterSession();
  const room = await store.getRoom(roomId);
  if (!room) {
    return NextResponse.json({ error: "Salle introuvable." }, { status: 404 });
  }

  const [decks, sessions, resources] = await Promise.all([
    store.listDecksByRoom(room.id),
    store.listSessionsByRoom(room.id),
    store.listResources(room.id),
  ]);

  return NextResponse.json({
    authenticated: Boolean(presenter),
    room: {
      ...room,
      joinPin: presenter ? room.joinPin : "••••",
    },
    decks,
    sessions,
    resources,
  });
}

export async function PATCH(
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
    const parsed = patchRoomSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }
    const room = await getStudioStore().updateRoom(roomId, parsed.data);
    return NextResponse.json({ room });
  } catch (error) {
    if (error instanceof StudioNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Mise à jour impossible." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const presenter = await verifyPresenterSession();
  if (!presenter) {
    return NextResponse.json({ error: "Authentification formateur requise." }, { status: 401 });
  }

  const { roomId } = await context.params;
  try {
    await getStudioStore().deleteRoom(roomId);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Suppression impossible." },
      { status: 400 }
    );
  }
}
