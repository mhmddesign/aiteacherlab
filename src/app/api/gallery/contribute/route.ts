import { NextRequest, NextResponse } from "next/server";
import { extractClientIp } from "@/lib/auth/crypto";
import { verifyParticipantSession, verifyPresenterSession } from "@/lib/auth/session";
import { broadcastWorkshopEvent } from "@/lib/realtime/server";
import { galleryContributionSchema } from "@/lib/validation/schemas";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function POST(req: NextRequest) {
  try {
    const participantClaims = await verifyParticipantSession();
    const presenterClaims = await verifyPresenterSession();

    if (!participantClaims && !presenterClaims) {
      return NextResponse.json(
        {
          error:
            "Connectez-vous à l'atelier pour publier dans la galerie. / اتصلوا بالورشة للنشر في المعرض.",
        },
        { status: 401 }
      );
    }

    const store = getWorkshopStore();
    const ip = extractClientIp(req.headers);
    const allowed = await store.checkRateLimit(`gallery:${ip}`, 15, 300);
    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "Trop de publications rapprochées. Veuillez patienter. / عدد كبير من المنشورات المتتالية، يرجى الانتظار.",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = galleryContributionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Formulaire incomplet. / الاستمارة غير مكتملة.",
        },
        { status: 400 }
      );
    }

    const record = await store.addGalleryContribution({
      participantId: participantClaims?.participantId ?? null,
      contributorName: parsed.data.contributorName,
      appTitle: parsed.data.appTitle,
      gradeRange: parsed.data.gradeRange,
      discipline: parsed.data.discipline,
      language: parsed.data.language,
      learningObjective: parsed.data.learningObjective,
      description: parsed.data.description,
      classroomInstructions: parsed.data.classroomInstructions,
      appResource: parsed.data.appResource,
      testedFeatures: parsed.data.testedFeatures,
      privacyConfirmed: true,
    });

    const workshopId = await store.getWorkshopId();
    await Promise.all([
      broadcastWorkshopEvent(workshopId, "public", "aggregate_updated", {
        reason: "gallery_added",
      }),
      broadcastWorkshopEvent(workshopId, "presenter", "aggregate_updated", {
        reason: "gallery_added",
      }),
    ]);

    return NextResponse.json({ ok: true, contribution: record }, { status: 201 });
  } catch (err) {
    console.error("[API /gallery/contribute]", err);
    return NextResponse.json({ error: "Erreur serveur. / خطأ في الخادم." }, { status: 500 });
  }
}
