import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPresenterSession } from "@/lib/auth/session";
import { getStudioStore } from "@/lib/studio/studio-store";

const MAX_BYTES = 32 * 1024;

const saveComponentSchema = z.object({
  roomId: z.string().optional(),
  title: z.object({
    fr: z.string().trim().min(1).max(140),
    ar: z.string().trim().min(1).max(140),
  }),
  html: z.string().max(MAX_BYTES),
  css: z.string().max(MAX_BYTES).default(""),
  js: z.string().max(MAX_BYTES).default(""),
  approved: z.boolean().default(false),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const roomId = url.searchParams.get("roomId") ?? undefined;
  const components = await getStudioStore().listCustomComponents(roomId);
  return NextResponse.json({ components });
}

export async function POST(request: Request) {
  const presenter = await verifyPresenterSession();
  if (!presenter) {
    return NextResponse.json({ error: "Authentification formateur requise." }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = saveComponentSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Composant code invalide." }, { status: 400 });
    }

    const combinedBytes = new TextEncoder().encode(
      parsed.data.html + parsed.data.css + parsed.data.js
    ).length;
    if (combinedBytes > MAX_BYTES) {
      return NextResponse.json(
        { error: "Taille combinée supérieure à 32 KB." },
        { status: 400 }
      );
    }

    const component = await getStudioStore().saveCustomComponent(parsed.data);
    return NextResponse.json({ component }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Enregistrement impossible." },
      { status: 500 }
    );
  }
}
