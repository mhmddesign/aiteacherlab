import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPresenterSession } from "@/lib/auth/session";
import { getStudioStore } from "@/lib/studio/studio-store";

const createRoomSchema = z.object({
  title: z.object({
    fr: z.string().trim().min(2).max(140),
    ar: z.string().trim().min(2).max(140),
  }),
  subtitle: z
    .object({
      fr: z.string().trim().max(240).default(""),
      ar: z.string().trim().max(240).default(""),
    })
    .optional(),
  levelBadge: z.string().trim().max(80).optional(),
  joinPin: z.string().trim().regex(/^\d{4,6}$/).optional(),
});

export async function GET() {
  try {
    const store = getStudioStore();
    const presenter = await verifyPresenterSession();
    const [storageInfo, rooms, allSessions, customComponents] = await Promise.all([
      store.getStorageInfo(),
      store.listRooms(),
      store.listSessionsByRoom(),
      store.listCustomComponents(),
    ]);

    const decksByRoom: Record<string, Awaited<ReturnType<typeof store.listDecksByRoom>>> = {};
    const resourcesByRoom: Record<string, Awaited<ReturnType<typeof store.listResources>>> = {};

    await Promise.all(
      rooms.map(async (room) => {
        decksByRoom[room.id] = await store.listDecksByRoom(room.id);
        resourcesByRoom[room.id] = await store.listResources(room.id);
      })
    );

    // Strip presenter joinPin from unauthenticated public overview responses
    const safeRooms = rooms.map((room) => ({
      ...room,
      joinPin: presenter ? room.joinPin : "••••",
    }));

    const safeSessions = allSessions.map((sess) => ({
      id: sess.id,
      roomId: sess.roomId,
      deckId: sess.deckId,
      title: sess.title,
      joinPin: presenter ? sess.joinPin : "••••",
      status: sess.status,
      currentSlideIndex: sess.currentSlideIndex,
      slideCount: sess.frozenDocument.slides.length,
      createdAt: sess.createdAt,
      updatedAt: sess.updatedAt,
    }));

    return NextResponse.json({
      authenticated: Boolean(presenter),
      storageInfo,
      rooms: safeRooms,
      decksByRoom,
      sessions: safeSessions,
      resourcesByRoom,
      customComponents,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur Studio rooms." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const presenter = await verifyPresenterSession();
  if (!presenter) {
    return NextResponse.json(
      { error: "Authentification formateur requise pour créer une salle." },
      { status: 401 }
    );
  }

  try {
    const json = await request.json();
    const parsed = createRoomSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données de salle invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const room = await getStudioStore().createRoom(parsed.data);
    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Création de salle impossible." },
      { status: 500 }
    );
  }
}
