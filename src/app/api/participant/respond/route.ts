import { after, NextRequest, NextResponse } from "next/server";
import { extractClientIp } from "@/lib/auth/crypto";
import { verifyParticipantSession } from "@/lib/auth/session";
import { broadcastWorkshopEvent } from "@/lib/realtime/server";
import { participantResponseSchema } from "@/lib/validation/schemas";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function POST(req: NextRequest) {
  try {
    const claims = await verifyParticipantSession();
    if (!claims) {
      return NextResponse.json(
        { error: "Non authentifié. / غير مصادق عليه." },
        { status: 401 }
      );
    }

    const bodyPromise = req.json().catch(() => null);
    const store = getWorkshopStore();
    const ip = extractClientIp(req.headers);

    const [allowed, participant, body] = await Promise.all([
      store.checkRateLimit(`respond:${claims.participantId}:${ip}`, 60, 60),
      store.getParticipantBySession(claims.participantId, claims.tokenHash),
      bodyPromise,
    ]);

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "Trop de requêtes rapides. Patientez un instant. / طلبات سريعة متتالية، يرجى الانتظار لحظة.",
        },
        { status: 429 }
      );
    }

    if (!participant) {
      return NextResponse.json(
        { error: "Session invalide. / جلسة غير صالحة." },
        { status: 401 }
      );
    }

    const parsed = participantResponseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Réponse invalide. / إجابة غير صالحة.",
        },
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

    const workshopId = participant.workshopId;
    const activityKey = parsed.data.activityKey;
    after(async () => {
      await Promise.all([
        broadcastWorkshopEvent(workshopId, "public", "aggregate_updated", {
          activityKey,
        }),
        broadcastWorkshopEvent(workshopId, "presenter", "aggregate_updated", {
          activityKey,
        }),
      ]);
    });

    return NextResponse.json({ ok: true, response: result.response });
  } catch (err) {
    console.error("[API /participant/respond]", err);
    return NextResponse.json({ error: "Erreur serveur. / خطأ في الخادم." }, { status: 500 });
  }
}
