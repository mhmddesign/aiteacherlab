import { NextRequest, NextResponse } from "next/server";
import { verifyPresenterSession } from "@/lib/auth/session";
import { broadcastWorkshopEvent } from "@/lib/realtime/server";
import { purgeParticipantsSchema } from "@/lib/validation/schemas";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function DELETE(req: NextRequest) {
  try {
    const presenter = await verifyPresenterSession();
    if (!presenter) {
      return NextResponse.json(
        { error: "Accès réservé à l'animateur. / الولوج محصور في المنشط." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = purgeParticipantsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Veuillez taper SUPPRIMER pour confirmer l'effacement des données. / اكتبوا SUPPRIMER لتأكيد مسح المعطيات.",
        },
        { status: 400 }
      );
    }

    const store = getWorkshopStore();
    const updatedState = await store.purgeRealParticipants();

    await Promise.all([
      broadcastWorkshopEvent(updatedState.workshopId, "public", "state_updated", {
        reason: "purged",
        stateVersion: updatedState.stateVersion,
      }),
      broadcastWorkshopEvent(updatedState.workshopId, "presenter", "state_updated", {
        reason: "purged",
        stateVersion: updatedState.stateVersion,
      }),
    ]);

    const snapshot = await store.getPresenterSnapshot();
    return NextResponse.json(snapshot);
  } catch (err) {
    console.error("[API /presenter/participants]", err);
    return NextResponse.json({ error: "Erreur serveur. / خطأ في الخادم." }, { status: 500 });
  }
}
