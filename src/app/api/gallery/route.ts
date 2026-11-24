import { NextResponse } from "next/server";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function GET() {
  try {
    const store = getWorkshopStore();
    const pub = await store.getPublicSnapshot();
    const contributions = await store.listGalleryContributions(pub.state.demoMode);
    return NextResponse.json({
      demoMode: pub.state.demoMode,
      contributions,
    });
  } catch (err) {
    console.error("[API /gallery]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
