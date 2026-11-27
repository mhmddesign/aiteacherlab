import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPresenterSession } from "@/lib/auth/session";
import { getStudioStore, StudioNotFoundError } from "@/lib/studio/studio-store";

const patchSessionSchema = z.object({
  sessionId: z.string().min(1),
  currentSlideIndex: z.number().int().min(0).optional(),
  showResults: z.boolean().optional(),
  showQrOverlay: z.boolean().optional(),
  isPaused: z.boolean().optional(),
  status: z.enum(["draft", "live", "ended"]).optional(),
});

const verifyPinSchema = z.object({
  action: z.literal("verify"),
  sessionId: z.string().min(1),
  pin: z.string().trim().min(4).max(6),
});

const submitLiveSchema = z.object({
  sessionId: z.string().min(1),
  slideId: z.string().min(1),
  elementId: z.string().min(1),
  activityType: z.string().min(1).max(40),
  pin: z.string().trim().min(4).max(6),
  participantKey: z.string().trim().min(2).max(80),
  participantName: z.string().trim().min(1).max(60),
  optionId: z.string().max(80).optional(),
  text: z.string().max(280).optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "Paramètre sessionId manquant." }, { status: 400 });
  }

  const store = getStudioStore();
  const presenter = await verifyPresenterSession();
  const session = await store.getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  const aggregates = await store.getSessionAggregates(sessionId);
  const safeDoc = presenter
    ? session.frozenDocument
    : {
        ...session.frozenDocument,
        slides: session.frozenDocument.slides.map((s) => ({
          ...s,
          notes: {
            fr: "",
            ar: "",
            darijaFr: "",
            darijaAr: "",
            durationCue: s.notes.durationCue,
            classroomExampleFr: "",
            classroomExampleAr: "",
            discussionPromptFr: "",
            discussionPromptAr: "",
          },
        })),
      };

  return NextResponse.json({
    authenticated: Boolean(presenter),
    session: {
      id: session.id,
      roomId: session.roomId,
      deckId: session.deckId,
      title: session.title,
      joinPin: presenter ? session.joinPin : undefined,
      status: session.status,
      currentSlideIndex: session.currentSlideIndex,
      showResults: session.showResults,
      showQrOverlay: session.showQrOverlay,
      isPaused: session.isPaused,
      frozenDocument: safeDoc,
      updatedAt: session.updatedAt,
    },
    aggregates,
  });
}

export async function PATCH(request: Request) {
  const presenter = await verifyPresenterSession();
  if (!presenter) {
    return NextResponse.json({ error: "Authentification formateur requise." }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = patchSessionSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Contrôle session invalide." }, { status: 400 });
    }

    const { sessionId, ...patch } = parsed.data;
    const session = await getStudioStore().updateSessionControl(sessionId, patch);
    return NextResponse.json({ session });
  } catch (error) {
    if (error instanceof StudioNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Mise à jour impossible." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const store = getStudioStore();

    if (json?.action === "verify") {
      const verified = verifyPinSchema.safeParse(json);
      if (!verified.success) {
        return NextResponse.json({ error: "Code PIN invalide." }, { status: 400 });
      }
      const sess = await store.getSession(verified.data.sessionId);
      if (!sess) {
        return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
      }
      if (sess.status !== "live") {
        return NextResponse.json({ error: "Cette session n'est plus ouverte." }, { status: 403 });
      }
      if (verified.data.pin !== sess.joinPin) {
        return NextResponse.json({ error: "Code PIN de session incorrect." }, { status: 403 });
      }
      return NextResponse.json({ ok: true });
    }

    const parsed = submitLiveSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Réponse invalide." }, { status: 400 });
    }

    const session = await store.getSession(parsed.data.sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
    }
    if (session.status !== "live") {
      return NextResponse.json({ error: "Cette session n'est plus ouverte." }, { status: 403 });
    }

    const presenter = await verifyPresenterSession();
    if (!presenter && parsed.data.pin !== session.joinPin) {
      return NextResponse.json({ error: "Code PIN de session incorrect." }, { status: 403 });
    }

    const saved = await store.submitLiveResponse({
      sessionId: session.id,
      slideId: parsed.data.slideId,
      elementId: parsed.data.elementId,
      activityType: parsed.data.activityType,
      participantKey: parsed.data.participantKey,
      participantName: parsed.data.participantName,
      optionId: parsed.data.optionId,
      text: parsed.data.text,
    });
    const aggregates = await store.getSessionAggregates(session.id);

    return NextResponse.json({ saved, aggregates }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Envoi impossible." },
      { status: 500 }
    );
  }
}
