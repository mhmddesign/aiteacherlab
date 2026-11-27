import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPresenterSession } from "@/lib/auth/session";
import { getStudioStore } from "@/lib/studio/studio-store";

const createResourceSchema = z.object({
  kind: z.enum(["prompt", "link", "note", "worksheet"]),
  title: z.object({
    fr: z.string().trim().min(1).max(160),
    ar: z.string().trim().min(1).max(160),
  }),
  content: z.object({
    fr: z.string().trim().max(4000).default(""),
    ar: z.string().trim().max(4000).default(""),
  }),
  url: z
    .string()
    .trim()
    .max(500)
    .refine(
      (val) => !val || val.startsWith("/") || /^https?:\/\//i.test(val),
      "URL invalide (http/https ou chemin interne uniquement)"
    )
    .optional(),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await context.params;
  const resources = await getStudioStore().listResources(roomId);
  return NextResponse.json({ resources });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const presenter = await verifyPresenterSession();
  if (!presenter) {
    return NextResponse.json({ error: "Authentification formateur requise." }, { status: 401 });
  }

  const { roomId } = await context.params;
  try {
    const json = await request.json();
    const parsed = createResourceSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Ressource invalide." }, { status: 400 });
    }
    const resource = await getStudioStore().createResource({
      roomId,
      kind: parsed.data.kind,
      title: parsed.data.title,
      content: parsed.data.content,
      url: parsed.data.url,
    });
    return NextResponse.json({ resource }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ajout de ressource impossible." },
      { status: 500 }
    );
  }
}
