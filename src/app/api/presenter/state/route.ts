import { NextResponse } from "next/server";
import { verifyPresenterSession } from "@/lib/auth/session";
import { getWorkshopStore } from "@/lib/workshop/store";

export async function GET() {
  try {
    const presenter = await verifyPresenterSession();
    if (!presenter) {
      return NextResponse.json({ error: "Accès réservé à l'animateur." }, { status: 401 });
    }
    const store = getWorkshopStore();
    const snapshot = await store.getPresenterSnapshot();
    return NextResponse.json(snapshot);
  } catch (err) {
    console.error("[API /presenter/state]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
