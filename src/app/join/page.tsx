import { verifyParticipantSession } from "@/lib/auth/session";
import { getWorkshopStore } from "@/lib/workshop/store";
import type { ParticipantResponseItem } from "@/content/types";
import { ParticipantShell } from "@/components/participant/ParticipantShell";

export const dynamic = "force-dynamic";

export default async function JoinPage() {
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
