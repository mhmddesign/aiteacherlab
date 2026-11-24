import { NextRequest, NextResponse } from "next/server";
import { verifyPresenterSession } from "@/lib/auth/session";
import { broadcastWorkshopEvent } from "@/lib/realtime/server";
import { resetActivitySchema } from "@/lib/validation/schemas";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function POST(req: NextRequest) {
  try {
    const presenter = await verifyPresenterSession();
    if (!presenter) {
      return NextResponse.json(
        { error: "Accès réservé à l'animateur. / الولوج محصور في المنشط." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = resetActivitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Clé d'activité invalide. / مفتاح النشاط غير صالح." },
        { status: 400 }
      );
    }

    const store = getWorkshopStore();
    const updatedState = await store.resetActivity(parsed.data.activityKey);

    await Promise.all([
      broadcastWorkshopEvent(updatedState.workshopId, "public", "activity_reset", {
        activityKey: parsed.data.activityKey,
        stateVersion: updatedState.stateVersion,
      }),
      broadcastWorkshopEvent(updatedState.workshopId, "presenter", "activity_reset", {
        activityKey: parsed.data.activityKey,
        stateVersion: updatedState.stateVersion,
      }),
    ]);

    const snapshot = await store.getPresenterSnapshot();
    return NextResponse.json(snapshot);
  } catch (err) {
    console.error("[API /presenter/reset-activity]", err);
    return NextResponse.json({ error: "Erreur serveur. / خطأ في الخادم." }, { status: 500 });
  }
}
