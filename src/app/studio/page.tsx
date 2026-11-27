import type { Metadata } from "next";
import { verifyPresenterSession } from "@/lib/auth/session";
import { getWorkshopStore } from "@/lib/workshop/store";
import { getStudioStore } from "@/lib/studio/studio-store";
import { StudioWorkspaceShell } from "@/components/studio/StudioWorkspaceShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Teacher Lab · Studio 2.0 · استوديو العروض التفاعلية",
  description:
    "Plateforme bilingue FR + AR d'édition de présentations 16:9, composants pédagogiques et animation Live multi-salles.",
};

export default async function StudioPage() {
  const [presenter, initialSnapshot] = await Promise.all([
    verifyPresenterSession().catch(() => null),
    getWorkshopStore()
      .getPublicSnapshot()
      .catch((err) => {
        console.error("[StudioPage SSR workshop]", err);
        return null;
      }),
  ]);

  const store = getStudioStore();
  const [storageInfo, rooms, allSessions] = await Promise.all([
    store.getStorageInfo(),
    store.listRooms(),
    store.listSessionsByRoom(),
  ]);

  const decksByRoom: Record<string, Awaited<ReturnType<typeof store.listDecksByRoom>>> = {};
  const resourcesByRoom: Record<string, Awaited<ReturnType<typeof store.listResources>>> = {};

  await Promise.all(
    rooms.map(async (room) => {
      decksByRoom[room.id] = await store.listDecksByRoom(room.id);
      resourcesByRoom[room.id] = await store.listResources(room.id);
    })
  );

  const safeRooms = rooms.map((r) => ({
    ...r,
    joinPin: presenter ? r.joinPin : "••••",
  }));

  const safeSessions = allSessions.map((s) => ({
    id: s.id,
    roomId: s.roomId,
    deckId: s.deckId,
    title: s.title,
    joinPin: presenter ? s.joinPin : "••••",
    status: s.status,
    currentSlideIndex: s.currentSlideIndex,
    slideCount: s.frozenDocument.slides.length,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));

  return (
    <StudioWorkspaceShell
      initialSnapshot={initialSnapshot}
      initialStudioData={{
        authenticated: Boolean(presenter),
        storageInfo,
        rooms: safeRooms,
        decksByRoom,
        sessions: safeSessions,
        resourcesByRoom,
      }}
    />
  );
}
