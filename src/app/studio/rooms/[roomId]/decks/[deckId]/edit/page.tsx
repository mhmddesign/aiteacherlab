import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { verifyPresenterSession } from "@/lib/auth/session";
import { getStudioStore } from "@/lib/studio/studio-store";
import { PresentationEditorShell } from "@/components/studio/editor/PresentationEditorShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Éditeur de Présentation 16:9 — AI Teacher Lab Studio",
};

interface EditDeckPageProps {
  params: Promise<{ roomId: string; deckId: string }>;
}

export default async function EditDeckPage({ params }: EditDeckPageProps) {
  const { roomId, deckId } = await params;
  const store = getStudioStore();
  const [deck, room, presenter] = await Promise.all([
    store.getDeck(deckId),
    store.getRoom(roomId),
    verifyPresenterSession(),
  ]);

  if (!deck) {
    return (
      <main className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-[#E9E3D6] bg-white p-6 text-center space-y-3">
          <h1 className="font-display text-xl font-bold text-[#0B1220]">
            Présentation introuvable
          </h1>
          <p dir="rtl" lang="ar" className="font-arabic text-sm text-slate-600">
            تعذر العثور على العرض المطلوب.
          </p>
          <Link
            href="/studio"
            className="inline-block rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white"
          >
            Retour au Studio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <PresentationEditorShell
      initialDeck={deck}
      roomTitleFr={room?.title.fr ?? "Salle Studio"}
      roomTitleAr={room?.title.ar ?? "قاعة الاستوديو"}
      initialAuthenticated={Boolean(presenter)}
    />
  );
}
