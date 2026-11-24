import { NextResponse } from "next/server";
import { verifyParticipantSession } from "@/lib/auth/session";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function POST() {
  try {
    const claims = await verifyParticipantSession();
    if (!claims) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    const store = getWorkshopStore();
    const participant = await store.getParticipantBySession(
      claims.participantId,
      claims.tokenHash
    );
    if (!participant) {
      return NextResponse.json({ error: "Session expirée." }, { status: 401 });
    }
    await store.touchHeartbeat(participant.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API /participant/heartbeat]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
