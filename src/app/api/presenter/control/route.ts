import { NextRequest, NextResponse } from "next/server";
import { getSlideById } from "@/content/slides";
import { verifyPresenterSession } from "@/lib/auth/session";
import { broadcastWorkshopEvent } from "@/lib/realtime/server";
import { presenterControlSchema } from "@/lib/validation/schemas";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function PATCH(req: NextRequest) {
  try {
    const presenter = await verifyPresenterSession();
    if (!presenter) {
      return NextResponse.json(
        { error: "Accès réservé à l'animateur. / الولوج محصور في المنشط." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = presenterControlSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Commande invalide. / أمر غير صالح.",
        },
        { status: 400 }
      );
    }

    const patch = { ...parsed.data };
    if (patch.currentSlideId && patch.currentSection === undefined) {
      const slide = getSlideById(patch.currentSlideId);
      patch.currentSection = slide.sectionNumber;
      if (patch.activeActivityKey === undefined) {
        patch.activeActivityKey = slide.activityKey ?? null;
      }
      if (patch.activityStatus === undefined) {
        patch.activityStatus = slide.activityKey ? "open" : "idle";
      }
      if (patch.showResults === undefined) {
        patch.showResults = false;
      }
    }

    const store = getWorkshopStore();
    const updatedState = await store.updatePresenterControl(patch);

    await Promise.all([
      broadcastWorkshopEvent(updatedState.workshopId, "public", "state_updated", {
        stateVersion: updatedState.stateVersion,
      }),
      broadcastWorkshopEvent(updatedState.workshopId, "presenter", "state_updated", {
        stateVersion: updatedState.stateVersion,
      }),
    ]);

    const snapshot = await store.getPresenterSnapshot();
    return NextResponse.json(snapshot);
  } catch (err) {
    console.error("[API /presenter/control]", err);
    return NextResponse.json({ error: "Erreur serveur. / خطأ في الخادم." }, { status: 500 });
  }
}
