import { NextResponse } from "next/server";
import { PARTICIPANT_COOKIE, verifyParticipantSession } from "@/lib/auth/session";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function GET() {
  try {
    const claims = await verifyParticipantSession();
    if (!claims) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const store = getWorkshopStore();
    const participant = await store.getParticipantBySession(
      claims.participantId,
      claims.tokenHash
    );
    if (!participant) {
      const res = NextResponse.json({ authenticated: false }, { status: 401 });
      res.cookies.delete(PARTICIPANT_COOKIE);
      return res;
    }

    const snapshot = await store.getPublicSnapshot();
    const myResponses = snapshot.state.activeActivityKey
      ? await store.getParticipantResponses(
          participant.id,
          snapshot.state.activeActivityKey
        )
      : [];

    return NextResponse.json({
      authenticated: true,
      participant: {
        id: participant.id,
        displayName: participant.displayName,
      },
      snapshot,
      myResponses,
    });
  } catch (err) {
    console.error("[API /participant/me]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
