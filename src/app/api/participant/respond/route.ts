import { NextRequest, NextResponse } from "next/server";
import { extractClientIp } from "@/lib/auth/crypto";
import { verifyParticipantSession } from "@/lib/auth/session";
import { broadcastWorkshopEvent } from "@/lib/realtime/server";
import { participantResponseSchema } from "@/lib/validation/schemas";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function POST(req: NextRequest) {
  try {
    const claims = await verifyParticipantSession();
    if (!claims) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const store = getWorkshopStore();
    const ip = extractClientIp(req.headers);
    const allowed = await store.checkRateLimit(
      `respond:${claims.participantId}:${ip}`,
      60,
      60
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes rapides. Patientez un instant." },
        { status: 429 }
      );
    }

    const participant = await store.getParticipantBySession(
      claims.participantId,
      claims.tokenHash
    );
    if (!participant) {
      return NextResponse.json({ error: "Session invalide." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = participantResponseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Réponse invalide." },
        { status: 400 }
      );
    }

    const result = await store.submitParticipantResponse({
      participantId: participant.id,
      activityKey: parsed.data.activityKey,
      itemKey: parsed.data.itemKey,
      selectedOption: parsed.data.selectedOption,
      payload: parsed.data.payload,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    await Promise.all([
      broadcastWorkshopEvent(participant.workshopId, "public", "aggregate_updated", {
        activityKey: parsed.data.activityKey,
      }),
      broadcastWorkshopEvent(participant.workshopId, "presenter", "aggregate_updated", {
        activityKey: parsed.data.activityKey,
      }),
    ]);

    return NextResponse.json({ ok: true, response: result.response });
  } catch (err) {
    console.error("[API /participant/respond]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
