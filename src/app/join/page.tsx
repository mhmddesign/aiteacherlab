import Link from "next/link";
import { verifyParticipantSession } from "@/lib/auth/session";
import { getWorkshopStore } from "@/lib/workshop/store";
import { getStudioStore } from "@/lib/studio/studio-store";
import type { ParticipantResponseItem } from "@/content/types";
import { ParticipantShell } from "@/components/participant/ParticipantShell";
import { StudioLiveParticipantShell } from "@/components/studio/live/StudioLiveParticipantShell";

export const dynamic = "force-dynamic";

interface JoinPageProps {
  searchParams: Promise<{ sessionId?: string }>;
}

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const { sessionId } = await searchParams;

  if (sessionId) {
    const studioStore = getStudioStore();
    const studioSession = await studioStore.getSession(sessionId);
    if (!studioSession) {
      return (
        <main className="min-h-screen bg-[#FAF8F4] text-[#0B1220] flex items-center justify-center p-6">
          <div className="max-w-md rounded-2xl border border-[#E9E3D6] bg-white p-6 text-center space-y-3">
            <h1 className="font-display text-xl font-bold">Session Live introuvable</h1>
            <p dir="rtl" lang="ar" className="font-arabic text-sm text-teal-800">
              تعذر العثور على هذه الجلسة التفاعلية.
            </p>
            <Link
              href="/join"
              className="inline-block rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white"
            >
              Atelier Mediouna par défaut
            </Link>
          </div>
        </main>
      );
    }
    const aggregates = await studioStore.getSessionAggregates(studioSession.id);
    return (
      <StudioLiveParticipantShell
        initialSession={studioSession}
        initialAggregates={aggregates}
      />
    );
  }

  const store = getWorkshopStore();
  const snapshot = await store.getPublicSnapshot();
  const claims = await verifyParticipantSession();

  let participant: { id: string; displayName: string } | null = null;
  let myResponses: ParticipantResponseItem[] = [];

  if (claims) {
    const found = await store.getParticipantBySession(
      claims.participantId,
      claims.tokenHash
    );
    if (found) {
      participant = { id: found.id, displayName: found.displayName };
      if (snapshot.state.activeActivityKey) {
        myResponses = await store.getParticipantResponses(
          found.id,
          snapshot.state.activeActivityKey
        );
      }
    }
  }

  return (
    <ParticipantShell
      initialParticipant={participant}
      initialSnapshot={snapshot}
      initialResponses={myResponses}
    />
  );
}
