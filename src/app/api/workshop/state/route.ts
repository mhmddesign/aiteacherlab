import { NextResponse } from "next/server";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function GET() {
  try {
    const store = getWorkshopStore();
    const snapshot = await store.getPublicSnapshot();
    return NextResponse.json(snapshot);
  } catch (err) {
    console.error("[API /workshop/state]", err);
    return NextResponse.json(
      {
        error:
          "Impossible de charger l'état de l'atelier. / تعذر تحميل وضعية الورشة.",
      },
      { status: 500 }
    );
  }
}
