import { NextRequest, NextResponse } from "next/server";
import { verifyParticipantSession, verifyPresenterSession } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/env";
import { issueWorkshopRealtimeToken } from "@/lib/realtime/server";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function GET(req: NextRequest) {
  try {
    const scope = req.nextUrl.searchParams.get("scope") || "public";
    if (scope === "presenter") {
      const presenter = await verifyPresenterSession();
      if (!presenter) {
        return NextResponse.json(
          { error: "Canal animateur non autorisé. / قناة المنشط غير مصرح بها." },
          { status: 403 }
        );
      }
      if (!isSupabaseConfigured()) {
        return NextResponse.json({ pollingFallback: true });
      }
      const tokenData = await issueWorkshopRealtimeToken(presenter.workshopId, "presenter");
      return NextResponse.json(tokenData ?? { pollingFallback: true });
    }

    // Public scope: allow projector (/screen) and authenticated participants
    await verifyParticipantSession().catch(() => null);
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ pollingFallback: true });
    }
    const store = getWorkshopStore();
    const workshopId = await store.getWorkshopId();
    const tokenData = await issueWorkshopRealtimeToken(workshopId, "viewer");
    return NextResponse.json(tokenData ?? { pollingFallback: true });
  } catch (err) {
    console.error("[API /realtime/token]", err);
    return NextResponse.json({ pollingFallback: true });
  }
}
