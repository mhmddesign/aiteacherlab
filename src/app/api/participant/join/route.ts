import { NextRequest, NextResponse } from "next/server";
import { extractClientIp } from "@/lib/auth/crypto";
import {
  cookieOptions,
  PARTICIPANT_COOKIE,
  signParticipantCookie,
} from "@/lib/auth/session";
import { broadcastWorkshopEvent } from "@/lib/realtime/server";
import { joinWorkshopSchema } from "@/lib/validation/schemas";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function POST(req: NextRequest) {
  try {
    const store = getWorkshopStore();
    const ip = extractClientIp(req.headers);
    const allowed = await store.checkRateLimit(`join:${ip}`, 20, 300);
    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "Trop de tentatives. Veuillez patienter quelques minutes. / محاولات كثيرة، يرجى الانتظار بضع دقائق.",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = joinWorkshopSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Données invalides. / معطيات غير صالحة.",
        },
        { status: 400 }
      );
    }

    const res = await store.joinParticipant(parsed.data.pin, parsed.data.displayName);
    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: res.status });
    }

    const jwt = await signParticipantCookie({
      participantId: res.participantId,
      workshopId: res.workshopId,
      displayName: res.displayName,
      tokenHash: res.tokenHash,
    });

    await Promise.all([
      broadcastWorkshopEvent(res.workshopId, "public", "aggregate_updated", {
        reason: "participant_joined",
      }),
      broadcastWorkshopEvent(res.workshopId, "presenter", "aggregate_updated", {
        reason: "participant_joined",
      }),
    ]);

    const response = NextResponse.json({
      participant: {
        id: res.participantId,
        displayName: res.displayName,
      },
    });
    response.cookies.set(PARTICIPANT_COOKIE, jwt, cookieOptions());
    return response;
  } catch (err) {
    console.error("[API /participant/join]", err);
    return NextResponse.json(
      {
        error:
          "Erreur interne lors de la connexion à l'atelier. / خطأ داخلي أثناء الانضمام إلى الورشة.",
      },
      { status: 500 }
    );
  }
}
