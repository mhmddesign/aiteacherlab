import React from "react";
import type { Metadata } from "next";
import { getStudioStore } from "@/lib/studio/studio-store";
import { importMediounaDeckToDocument } from "@/lib/studio/mediouna-importer";
import {
  ExportPreviewShell,
  type ExportMode,
} from "@/components/export/ExportPreviewShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Export PDF 16:9 & Fiches A4 — AI Teacher Lab",
  description:
    "Aperçu et export PDF haute fidélité (Diapositives 16:9 sans découpe et fiches de classe A4) pour les ateliers AI Teacher Lab.",
};

interface ExportPageProps {
  searchParams: Promise<{
    deckId?: string;
    mode?: string;
  }>;
}

const VALID_MODES = new Set<ExportMode>(["slides", "handout-2", "handout-4", "worksheet"]);

export default async function ExportSlidesPage({ searchParams }: ExportPageProps) {
  const params = await searchParams;
  const requestedMode = (params.mode ?? "slides") as ExportMode;
  const initialMode: ExportMode = VALID_MODES.has(requestedMode) ? requestedMode : "slides";

  const store = getStudioStore();
  let deckRecord = params.deckId ? await store.getDeck(params.deckId) : null;
  if (!deckRecord) {
    deckRecord = await store.getDeck("deck-mediouna-21");
  }

  const document =
    deckRecord?.document ??
    importMediounaDeckToDocument("mediouna-default", "deck-mediouna-21");

  const room = deckRecord ? await store.getRoom(deckRecord.roomId) : null;

  return (
    <ExportPreviewShell
      deck={document}
      initialMode={initialMode}
      joinPinHint={room?.joinPin ?? "4829"}
    />
  );
}
