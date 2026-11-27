import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { BilingualText } from "@/content/types";
import { isSupabaseConfigured } from "@/lib/env";
import {
  deckDocumentV1Schema,
  normalizeDeckDocument,
  type DeckDocumentV1,
} from "./document-schema";
import {
  createDeckFromTemplate,
  importMarkdownToDeck,
  importMediounaDeckToDocument,
} from "./mediouna-importer";
import type { StudioElementLiveAggregate } from "@/components/studio/elements/InteractiveWidgets";

export interface StudioRoom {
  id: string;
  slug: string;
  title: BilingualText;
  subtitle: BilingualText;
  levelBadge: string;
  joinPin: string;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface StudioDeckRecord {
  id: string;
  roomId: string;
  title: BilingualText;
  description: BilingualText;
  currentRevisionNo: number;
  createdAt: string;
  updatedAt: string;
  document: DeckDocumentV1;
}

export interface StudioDeckRevision {
  id: string;
  deckId: string;
  revisionNo: number;
  summary: BilingualText;
  source: "manual" | "autosave" | "import" | "ai" | "restore";
  createdAt: string;
  document: DeckDocumentV1;
}

export interface StudioSessionRecord {
  id: string;
  roomId: string;
  deckId: string | null;
  title: BilingualText;
  joinPin: string;
  status: "draft" | "live" | "ended";
  currentSlideIndex: number;
  showResults: boolean;
  showQrOverlay: boolean;
  isPaused: boolean;
  frozenDocument: DeckDocumentV1;
  createdAt: string;
  updatedAt: string;
}

export interface StudioLiveResponseRecord {
  id: string;
  sessionId: string;
  slideId: string;
  elementId: string;
  activityType: string;
  participantKey: string;
  participantName: string;
  optionId?: string;
  text?: string;
  submittedAt: string;
}

export interface StudioResourceRecord {
  id: string;
  roomId: string;
  kind: "prompt" | "link" | "note" | "worksheet";
  title: BilingualText;
  content: BilingualText;
  url?: string;
  createdAt: string;
}

export interface StudioCustomComponentRecord {
  id: string;
  roomId?: string;
  title: BilingualText;
  html: string;
  css: string;
  js: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export class RevisionConflictError extends Error {
  currentRevisionNo: number;
  serverDocument: DeckDocumentV1;

  constructor(currentRevisionNo: number, serverDocument: DeckDocumentV1) {
    super(`Conflit de révision (serveur v${currentRevisionNo}) · تعارض في النسخة`);
    this.name = "RevisionConflictError";
    this.currentRevisionNo = currentRevisionNo;
    this.serverDocument = serverDocument;
  }
}

export class StudioNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StudioNotFoundError";
  }
}

interface LocalStudioDb {
  rooms: StudioRoom[];
  decks: StudioDeckRecord[];
  revisions: StudioDeckRevision[];
  sessions: StudioSessionRecord[];
  liveResponses: StudioLiveResponseRecord[];
  resources: StudioResourceRecord[];
  customComponents: StudioCustomComponentRecord[];
}

function nowIso(): string {
  return new Date().toISOString();
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

function getStorageFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "aiteacherlab-studio-store.json");
  }
  return path.join(process.cwd(), ".local-data", "studio-store.json");
}

function buildInitialSeed(): LocalStudioDb {
  const ts = nowIso();
  const mediounaRoomId = "mediouna-default";
  const mediounaDeckId = "deck-mediouna-21";
  const mediounaDoc = importMediounaDeckToDocument(mediounaRoomId, mediounaDeckId);

  return {
    rooms: [
      {
        id: mediounaRoomId,
        slug: "mediouna-workshop",
        title: {
          fr: "IA & Création Pédagogique · Mediouna",
          ar: "الذكاء الاصطناعي والإبداع البيداغوجي · مديونة",
        },
        subtitle: {
          fr: "Salle principale · Atelier bilingue complet (21 diapositives & activités)",
          ar: "القاعة الرئيسية · الورشة الثنائية اللغة الكاملة (21 شريحة وتفاعلات)",
        },
        levelBadge: "1AEP – 6AEP · Formation Officielle",
        joinPin: "4829",
        status: "active",
        createdAt: ts,
        updatedAt: ts,
      },
    ],
    decks: [
      {
        id: mediounaDeckId,
        roomId: mediounaRoomId,
        title: mediounaDoc.title,
        description: mediounaDoc.description,
        currentRevisionNo: 1,
        createdAt: ts,
        updatedAt: ts,
        document: mediounaDoc,
      },
    ],
    revisions: [
      {
        id: "rev-mediouna-1",
        deckId: mediounaDeckId,
        revisionNo: 1,
        summary: {
          fr: "Import initial de l'atelier Mediouna (21 slides)",
          ar: "الاستيراد الأولي لورشة مديونة (21 شريحة)",
        },
        source: "import",
        createdAt: ts,
        document: mediounaDoc,
      },
    ],
    sessions: [],
    liveResponses: [],
    resources: [
      {
        id: "res-mediouna-prompt-1",
        roomId: mediounaRoomId,
        kind: "prompt",
        title: {
          fr: "Modèle de Méta-Prompt pédagogique",
          ar: "نموذج الميتا-برومبت البيداغوجي",
        },
        content: {
          fr: "Agis comme un conseiller pédagogique marocain (1AEP–6AEP). Produis un support bilingue FR/AR sans données d'élèves.",
          ar: "تصرف كمرشد تربوي مغربي. أنشئ مورداً ثنائي اللغة بدون أي معطيات شخصية للتلاميذ.",
        },
        createdAt: ts,
      },
      {
        id: "res-mediouna-export-1",
        roomId: mediounaRoomId,
        kind: "worksheet",
        title: {
          fr: "Polycopié imprimable & Fiche Classe A4",
          ar: "المطبوع البيداغوجي وورقة القسم A4",
        },
        content: {
          fr: "Ouvrez l'aperçu /export/slides pour imprimer les 21 diapositives 16:9 ou les fiches élèves A4.",
          ar: "افتحوا معاينة التصدير لطباعة الشرائح بصيغة 16:9 أو أوراق العمل بصيغة A4.",
        },
        url: "/export/slides?deckId=deck-mediouna-21&mode=slides",
        createdAt: ts,
      },
    ],
    customComponents: [],
  };
}

let supabaseFallbackNeeded = false;

function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured() || supabaseFallbackNeeded) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

function isMissingStudioTableError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: string }).code;
  const msg = String((err as { message?: string }).message ?? "");
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    msg.includes("Could not find the table") ||
    msg.includes("does not exist")
  );
}

class LocalFileStudioBackend {
  private readDb(): LocalStudioDb {
    const filePath = getStorageFilePath();
    try {
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        const initial = buildInitialSeed();
        fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), "utf8");
        return initial;
      }
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as Partial<LocalStudioDb>;
      if (!Array.isArray(parsed.rooms) || parsed.rooms.length === 0) {
        const seeded = buildInitialSeed();
        fs.writeFileSync(filePath, JSON.stringify(seeded, null, 2), "utf8");
        return seeded;
      }
      return {
        rooms: parsed.rooms ?? [],
        decks: parsed.decks ?? [],
        revisions: parsed.revisions ?? [],
        sessions: parsed.sessions ?? [],
        liveResponses: parsed.liveResponses ?? [],
        resources: parsed.resources ?? [],
        customComponents: parsed.customComponents ?? [],
      };
    } catch {
      return buildInitialSeed();
    }
  }

  private writeDb(db: LocalStudioDb): void {
    const filePath = getStorageFilePath();
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), "utf8");
  }

  listRooms(): StudioRoom[] {
    return this.readDb().rooms;
  }

  getRoom(roomId: string): StudioRoom | null {
    return this.readDb().rooms.find((r) => r.id === roomId || r.slug === roomId) ?? null;
  }

  createRoom(input: {
    title: BilingualText;
    subtitle?: BilingualText;
    levelBadge?: string;
    joinPin?: string;
  }): StudioRoom {
    const db = this.readDb();
    const ts = nowIso();
    const id = makeId("room");
    const baseSlug = input.title.fr
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 28) || "atelier";
    const room: StudioRoom = {
      id,
      slug: `${baseSlug}-${id.slice(-4)}`,
      title: input.title,
      subtitle: input.subtitle ?? {
        fr: "Salle d'atelier interactive préparée dans Studio 2.0",
        ar: "قاعة ورشة تفاعلية محضرة في الاستوديو 2.0",
      },
      levelBadge: input.levelBadge?.trim() || "1AEP – 6AEP",
      joinPin: (input.joinPin?.replace(/\D/g, "").slice(0, 6) || "4829"),
      status: "active",
      createdAt: ts,
      updatedAt: ts,
    };
    db.rooms.push(room);
    this.writeDb(db);
    return room;
  }

  updateRoom(
    roomId: string,
    patch: Partial<{ title: BilingualText; subtitle: BilingualText; levelBadge: string; joinPin: string; status: "active" | "archived" }>
  ): StudioRoom {
    const db = this.readDb();
    const room = db.rooms.find((r) => r.id === roomId);
    if (!room) throw new StudioNotFoundError("Room not found");
    if (patch.title) room.title = patch.title;
    if (patch.subtitle) room.subtitle = patch.subtitle;
    if (patch.levelBadge !== undefined) room.levelBadge = patch.levelBadge;
    if (patch.joinPin !== undefined) room.joinPin = patch.joinPin;
    if (patch.status) room.status = patch.status;
    room.updatedAt = nowIso();
    this.writeDb(db);
    return room;
  }

  deleteRoom(roomId: string): void {
    const db = this.readDb();
    if (roomId === "mediouna-default") {
      throw new Error("La salle Mediouna officielle ne peut pas être supprimée.");
    }
    db.rooms = db.rooms.filter((r) => r.id !== roomId);
    const removedDeckIds = new Set(db.decks.filter((d) => d.roomId === roomId).map((d) => d.id));
    db.decks = db.decks.filter((d) => d.roomId !== roomId);
    db.revisions = db.revisions.filter((rev) => !removedDeckIds.has(rev.deckId));
    db.sessions = db.sessions.filter((s) => s.roomId !== roomId);
    db.resources = db.resources.filter((res) => res.roomId !== roomId);
    this.writeDb(db);
  }

  listDecksByRoom(roomId: string): StudioDeckRecord[] {
    return this.readDb().decks.filter((d) => d.roomId === roomId);
  }

  getDeck(deckId: string): StudioDeckRecord | null {
    return this.readDb().decks.find((d) => d.id === deckId) ?? null;
  }

  createDeck(input: {
    roomId: string;
    mode: "blank" | "template" | "duplicate" | "mediouna" | "ai" | "json" | "markdown";
    title: BilingualText;
    templateKey?: "primary-lesson" | "teacher-training" | "quiz-session" | "blank";
    sourceDeckId?: string;
    markdown?: string;
    rawDocument?: unknown;
    aiDocument?: DeckDocumentV1;
  }): StudioDeckRecord {
    const db = this.readDb();
    const room = db.rooms.find((r) => r.id === input.roomId);
    if (!room) throw new StudioNotFoundError("Target room not found");

    const deckId = makeId("deck");
    let doc: DeckDocumentV1;

    if (input.mode === "mediouna") {
      doc = importMediounaDeckToDocument(room.id, deckId);
    } else if (input.mode === "duplicate" && input.sourceDeckId) {
      const source = db.decks.find((d) => d.id === input.sourceDeckId);
      if (!source) throw new StudioNotFoundError("Source deck not found");
      doc = normalizeDeckDocument(
        {
          ...source.document,
          id: deckId,
          roomId: room.id,
          title: input.title,
        },
        { id: deckId, roomId: room.id, title: input.title }
      );
    } else if (input.mode === "json" && input.rawDocument) {
      doc = normalizeDeckDocument(input.rawDocument, {
        id: deckId,
        roomId: room.id,
        title: input.title,
      });
    } else if (input.mode === "ai" && input.aiDocument) {
      doc = normalizeDeckDocument(input.aiDocument, {
        id: deckId,
        roomId: room.id,
        title: input.title,
      });
    } else if (input.mode === "markdown") {
      doc = importMarkdownToDeck(
        input.markdown ?? "",
        input.title.fr,
        input.title.ar,
        room.id,
        deckId
      );
    } else {
      const tpl = input.mode === "blank" ? "blank" : input.templateKey ?? "primary-lesson";
      doc = createDeckFromTemplate(tpl, input.title.fr, input.title.ar, room.id, deckId);
    }

    const ts = nowIso();
    const record: StudioDeckRecord = {
      id: deckId,
      roomId: room.id,
      title: doc.title,
      description: doc.description,
      currentRevisionNo: 1,
      createdAt: ts,
      updatedAt: ts,
      document: doc,
    };

    db.decks.push(record);
    db.revisions.push({
      id: makeId("rev"),
      deckId,
      revisionNo: 1,
      summary: {
        fr: `Création (${input.mode})`,
        ar: `إنشاء العرض (${input.mode})`,
      },
      source: input.mode === "ai" ? "ai" : input.mode === "mediouna" || input.mode === "json" || input.mode === "markdown" ? "import" : "manual",
      createdAt: ts,
      document: doc,
    });
    this.writeDb(db);
    return record;
  }

  saveDeckRevision(input: {
    deckId: string;
    expectedRevision: number;
    document: DeckDocumentV1;
    summary?: BilingualText;
    source?: "manual" | "autosave" | "import" | "ai" | "restore";
  }): { deck: StudioDeckRecord; revision: StudioDeckRevision } {
    const db = this.readDb();
    const idx = db.decks.findIndex((d) => d.id === input.deckId);
    if (idx === -1) throw new StudioNotFoundError("Deck not found");

    const current = db.decks[idx];
    if (current.currentRevisionNo !== input.expectedRevision) {
      throw new RevisionConflictError(current.currentRevisionNo, current.document);
    }

    const validated = deckDocumentV1Schema.parse({
      ...input.document,
      id: current.id,
      roomId: current.roomId,
    });

    const nextRev = current.currentRevisionNo + 1;
    const ts = nowIso();

    const updatedDeck: StudioDeckRecord = {
      ...current,
      title: validated.title,
      description: validated.description,
      currentRevisionNo: nextRev,
      updatedAt: ts,
      document: validated,
    };

    const revision: StudioDeckRevision = {
      id: makeId("rev"),
      deckId: current.id,
      revisionNo: nextRev,
      summary: input.summary ?? {
        fr: `Enregistrement v${nextRev}`,
        ar: `حفظ النسخة v${nextRev}`,
      },
      source: input.source ?? "manual",
      createdAt: ts,
      document: validated,
    };

    db.decks[idx] = updatedDeck;
    db.revisions.push(revision);
    // Keep up to 40 recent revisions per deck to keep JSON tidy
    const revForDeck = db.revisions.filter((r) => r.deckId === current.id);
    if (revForDeck.length > 40) {
      const dropIds = new Set(revForDeck.slice(0, revForDeck.length - 40).map((r) => r.id));
      db.revisions = db.revisions.filter((r) => !dropIds.has(r.id));
    }

    this.writeDb(db);
    return { deck: updatedDeck, revision };
  }

  deleteDeck(deckId: string): void {
    const db = this.readDb();
    if (deckId === "deck-mediouna-21") {
      throw new Error("Le support Mediouna officiel est protégé contre la suppression.");
    }
    db.decks = db.decks.filter((d) => d.id !== deckId);
    db.revisions = db.revisions.filter((r) => r.deckId !== deckId);
    this.writeDb(db);
  }

  listRevisions(deckId: string): StudioDeckRevision[] {
    return this.readDb()
      .revisions.filter((r) => r.deckId === deckId)
      .sort((a, b) => b.revisionNo - a.revisionNo);
  }

  restoreRevision(deckId: string, revisionNo: number): StudioDeckRecord {
    const db = this.readDb();
    const deck = db.decks.find((d) => d.id === deckId);
    if (!deck) throw new StudioNotFoundError("Deck not found");
    const targetRev = db.revisions.find(
      (r) => r.deckId === deckId && r.revisionNo === revisionNo
    );
    if (!targetRev) throw new StudioNotFoundError("Revision not found");

    return this.saveDeckRevision({
      deckId,
      expectedRevision: deck.currentRevisionNo,
      document: targetRev.document,
      summary: {
        fr: `Restauration de la révision v${revisionNo}`,
        ar: `استعادة النسخة v${revisionNo}`,
      },
      source: "restore",
    }).deck;
  }

  listSessionsByRoom(roomId?: string): StudioSessionRecord[] {
    const all = this.readDb().sessions;
    return roomId ? all.filter((s) => s.roomId === roomId) : all;
  }

  getSession(sessionId: string): StudioSessionRecord | null {
    return this.readDb().sessions.find((s) => s.id === sessionId) ?? null;
  }

  createSession(input: {
    roomId: string;
    deckId: string;
    title?: BilingualText;
    joinPin?: string;
  }): StudioSessionRecord {
    const db = this.readDb();
    const room = db.rooms.find((r) => r.id === input.roomId);
    if (!room) throw new StudioNotFoundError("Room not found");
    const deck = db.decks.find((d) => d.id === input.deckId);
    if (!deck) throw new StudioNotFoundError("Deck not found");

    const ts = nowIso();
    const session: StudioSessionRecord = {
      id: makeId("sess"),
      roomId: room.id,
      deckId: deck.id,
      title: input.title ?? deck.title,
      joinPin: input.joinPin?.replace(/\D/g, "").slice(0, 6) || room.joinPin || "4829",
      status: "live",
      currentSlideIndex: 0,
      showResults: true,
      showQrOverlay: false,
      isPaused: false,
      frozenDocument: structuredClone(deck.document),
      createdAt: ts,
      updatedAt: ts,
    };
    db.sessions.push(session);
    this.writeDb(db);
    return session;
  }

  updateSessionControl(
    sessionId: string,
    patch: Partial<{
      currentSlideIndex: number;
      showResults: boolean;
      showQrOverlay: boolean;
      isPaused: boolean;
      status: "draft" | "live" | "ended";
    }>
  ): StudioSessionRecord {
    const db = this.readDb();
    const session = db.sessions.find((s) => s.id === sessionId);
    if (!session) throw new StudioNotFoundError("Session not found");
    const maxIdx = Math.max(0, session.frozenDocument.slides.length - 1);
    if (patch.currentSlideIndex !== undefined) {
      session.currentSlideIndex = Math.max(0, Math.min(maxIdx, patch.currentSlideIndex));
    }
    if (patch.showResults !== undefined) session.showResults = patch.showResults;
    if (patch.showQrOverlay !== undefined) session.showQrOverlay = patch.showQrOverlay;
    if (patch.isPaused !== undefined) session.isPaused = patch.isPaused;
    if (patch.status !== undefined) session.status = patch.status;
    session.updatedAt = nowIso();
    this.writeDb(db);
    return session;
  }

  submitLiveResponse(input: {
    sessionId: string;
    slideId: string;
    elementId: string;
    activityType: string;
    participantKey: string;
    participantName: string;
    optionId?: string;
    text?: string;
  }): StudioLiveResponseRecord {
    const db = this.readDb();
    const session = db.sessions.find((s) => s.id === input.sessionId);
    if (!session) throw new StudioNotFoundError("Session not found");

    const ts = nowIso();
    const existingIdx = db.liveResponses.findIndex(
      (r) =>
        r.sessionId === input.sessionId &&
        r.elementId === input.elementId &&
        r.participantKey === input.participantKey
    );

    const record: StudioLiveResponseRecord = {
      id: existingIdx >= 0 ? db.liveResponses[existingIdx].id : makeId("resp"),
      sessionId: input.sessionId,
      slideId: input.slideId,
      elementId: input.elementId,
      activityType: input.activityType,
      participantKey: input.participantKey,
      participantName: input.participantName.trim().slice(0, 60) || "Participant",
      optionId: input.optionId,
      text: input.text?.trim().slice(0, 280),
      submittedAt: ts,
    };

    if (existingIdx >= 0) {
      db.liveResponses[existingIdx] = record;
    } else {
      db.liveResponses.push(record);
    }

    this.writeDb(db);
    return record;
  }

  getSessionAggregates(sessionId: string): Record<string, StudioElementLiveAggregate> {
    const db = this.readDb();
    const items = db.liveResponses.filter((r) => r.sessionId === sessionId);
    const grouped: Record<string, StudioElementLiveAggregate> = {};

    for (const item of items) {
      if (!grouped[item.elementId]) {
        grouped[item.elementId] = {
          elementId: item.elementId,
          total: 0,
          counts: {},
          entries: [],
        };
      }
      const bucket = grouped[item.elementId];
      bucket.total += 1;
      if (item.optionId) {
        bucket.counts![item.optionId] = (bucket.counts![item.optionId] ?? 0) + 1;
      }
      bucket.entries!.unshift({
        id: item.id,
        participantName: item.participantName,
        optionId: item.optionId,
        text: item.text,
        submittedAt: item.submittedAt,
      });
    }

    return grouped;
  }

  listResources(roomId: string): StudioResourceRecord[] {
    return this.readDb().resources.filter((r) => r.roomId === roomId);
  }

  createResource(input: {
    roomId: string;
    kind: "prompt" | "link" | "note" | "worksheet";
    title: BilingualText;
    content: BilingualText;
    url?: string;
  }): StudioResourceRecord {
    const db = this.readDb();
    const res: StudioResourceRecord = {
      id: makeId("res"),
      roomId: input.roomId,
      kind: input.kind,
      title: input.title,
      content: input.content,
      url: input.url?.trim() || undefined,
      createdAt: nowIso(),
    };
    db.resources.push(res);
    this.writeDb(db);
    return res;
  }

  listCustomComponents(roomId?: string): StudioCustomComponentRecord[] {
    const all = this.readDb().customComponents;
    return roomId ? all.filter((c) => !c.roomId || c.roomId === roomId) : all;
  }

  saveCustomComponent(input: {
    roomId?: string;
    title: BilingualText;
    html: string;
    css: string;
    js: string;
    approved: boolean;
  }): StudioCustomComponentRecord {
    const db = this.readDb();
    const ts = nowIso();
    const item: StudioCustomComponentRecord = {
      id: makeId("comp"),
      roomId: input.roomId,
      title: input.title,
      html: input.html,
      css: input.css,
      js: input.js,
      approved: input.approved,
      createdAt: ts,
      updatedAt: ts,
    };
    db.customComponents.push(item);
    this.writeDb(db);
    return item;
  }
}

const localBackend = new LocalFileStudioBackend();

export interface StudioStore {
  getStorageInfo(): Promise<{ mode: "supabase" | "local_file" | "supabase_unmigrated_fallback"; migrationPending: boolean }>;
  listRooms(): Promise<StudioRoom[]>;
  getRoom(roomId: string): Promise<StudioRoom | null>;
  createRoom(input: { title: BilingualText; subtitle?: BilingualText; levelBadge?: string; joinPin?: string }): Promise<StudioRoom>;
  updateRoom(roomId: string, patch: Partial<{ title: BilingualText; subtitle: BilingualText; levelBadge: string; joinPin: string; status: "active" | "archived" }>): Promise<StudioRoom>;
  deleteRoom(roomId: string): Promise<void>;
  listDecksByRoom(roomId: string): Promise<StudioDeckRecord[]>;
  getDeck(deckId: string): Promise<StudioDeckRecord | null>;
  createDeck(input: Parameters<LocalFileStudioBackend["createDeck"]>[0]): Promise<StudioDeckRecord>;
  saveDeckRevision(input: Parameters<LocalFileStudioBackend["saveDeckRevision"]>[0]): Promise<{ deck: StudioDeckRecord; revision: StudioDeckRevision }>;
  deleteDeck(deckId: string): Promise<void>;
  listRevisions(deckId: string): Promise<StudioDeckRevision[]>;
  restoreRevision(deckId: string, revisionNo: number): Promise<StudioDeckRecord>;
  listSessionsByRoom(roomId?: string): Promise<StudioSessionRecord[]>;
  getSession(sessionId: string): Promise<StudioSessionRecord | null>;
  createSession(input: Parameters<LocalFileStudioBackend["createSession"]>[0]): Promise<StudioSessionRecord>;
  updateSessionControl(sessionId: string, patch: Parameters<LocalFileStudioBackend["updateSessionControl"]>[1]): Promise<StudioSessionRecord>;
  submitLiveResponse(input: Parameters<LocalFileStudioBackend["submitLiveResponse"]>[0]): Promise<StudioLiveResponseRecord>;
  getSessionAggregates(sessionId: string): Promise<Record<string, StudioElementLiveAggregate>>;
  listResources(roomId: string): Promise<StudioResourceRecord[]>;
  createResource(input: Parameters<LocalFileStudioBackend["createResource"]>[0]): Promise<StudioResourceRecord>;
  listCustomComponents(roomId?: string): Promise<StudioCustomComponentRecord[]>;
  saveCustomComponent(input: Parameters<LocalFileStudioBackend["saveCustomComponent"]>[0]): Promise<StudioCustomComponentRecord>;
}

async function probeSupabaseStudioTables(): Promise<"supabase" | "supabase_unmigrated_fallback" | "local_file"> {
  if (!isSupabaseConfigured()) return "local_file";
  if (supabaseFallbackNeeded) return "supabase_unmigrated_fallback";
  const client = getSupabaseAdmin();
  if (!client) return "supabase_unmigrated_fallback";
  const { error } = await client.from("studio_rooms").select("id").limit(1);
  if (error && isMissingStudioTableError(error)) {
    supabaseFallbackNeeded = true;
    return "supabase_unmigrated_fallback";
  }
  return error ? "supabase_unmigrated_fallback" : "supabase";
}

async function withSupabaseOrFallback<T>(
  supabaseFn: (client: SupabaseClient) => Promise<T>,
  localFn: () => T
): Promise<T> {
  const client = getSupabaseAdmin();
  if (!client) return localFn();
  try {
    return await supabaseFn(client);
  } catch (err) {
    if (isMissingStudioTableError(err)) {
      supabaseFallbackNeeded = true;
      return localFn();
    }
    throw err;
  }
}

async function ensureSeededSupabase(client: SupabaseClient): Promise<void> {
  const { data } = await client.from("studio_rooms").select("id").eq("id", "mediouna-default").maybeSingle();
  if (data) return;

  const seed = buildInitialSeed();
  const room = seed.rooms[0];
  const deck = seed.decks[0];
  const rev = seed.revisions[0];

  const roomRes = await client.from("studio_rooms").upsert({
    id: room.id,
    slug: room.slug,
    title_fr: room.title.fr,
    title_ar: room.title.ar,
    subtitle_fr: room.subtitle.fr,
    subtitle_ar: room.subtitle.ar,
    level_badge: room.levelBadge,
    join_pin: room.joinPin,
    status: room.status,
  });
  if (roomRes.error) throw roomRes.error;

  await client.from("studio_decks").upsert({
    id: deck.id,
    room_id: deck.roomId,
    title_fr: deck.title.fr,
    title_ar: deck.title.ar,
    current_revision_no: deck.currentRevisionNo,
    document: deck.document,
  });

  await client.from("studio_deck_revisions").upsert({
    id: rev.id,
    deck_id: rev.deckId,
    revision_no: rev.revisionNo,
    summary_fr: rev.summary.fr,
    summary_ar: rev.summary.ar,
    source: rev.source,
    document: rev.document,
  });

  for (const res of seed.resources) {
    await client.from("studio_resources").upsert({
      id: res.id,
      room_id: res.roomId,
      kind: res.kind,
      title_fr: res.title.fr,
      title_ar: res.title.ar,
      content_fr: res.content.fr,
      content_ar: res.content.ar,
      url: res.url ?? null,
    });
  }
}

export function getStudioStore(): StudioStore {
  return {
    async getStorageInfo() {
      const mode = await probeSupabaseStudioTables();
      return {
        mode,
        migrationPending: mode === "supabase_unmigrated_fallback",
      };
    },

    async listRooms() {
      return withSupabaseOrFallback(async (client) => {
        await ensureSeededSupabase(client);
        const { data, error } = await client
          .from("studio_rooms")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;
        return (data ?? []).map((r) => ({
          id: r.id,
          slug: r.slug,
          title: { fr: r.title_fr, ar: r.title_ar },
          subtitle: { fr: r.subtitle_fr, ar: r.subtitle_ar },
          levelBadge: r.level_badge,
          joinPin: r.join_pin,
          status: r.status,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }));
      }, () => localBackend.listRooms());
    },

    async getRoom(roomId) {
      return withSupabaseOrFallback(async (client) => {
        await ensureSeededSupabase(client);
        const byId = await client
          .from("studio_rooms")
          .select("*")
          .eq("id", roomId)
          .maybeSingle();
        if (byId.error) throw byId.error;
        let data = byId.data;
        if (!data) {
          const bySlug = await client
            .from("studio_rooms")
            .select("*")
            .eq("slug", roomId)
            .maybeSingle();
          if (bySlug.error) throw bySlug.error;
          data = bySlug.data;
        }
        if (!data) return null;
        return {
          id: data.id,
          slug: data.slug,
          title: { fr: data.title_fr, ar: data.title_ar },
          subtitle: { fr: data.subtitle_fr, ar: data.subtitle_ar },
          levelBadge: data.level_badge,
          joinPin: data.join_pin,
          status: data.status,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }, () => localBackend.getRoom(roomId));
    },

    async createRoom(input) {
      return withSupabaseOrFallback(async (client) => {
        await ensureSeededSupabase(client);
        const id = makeId("room");
        const baseSlug =
          input.title.fr
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 28) || "atelier";
        const row = {
          id,
          slug: `${baseSlug}-${id.slice(-4)}`,
          title_fr: input.title.fr,
          title_ar: input.title.ar,
          subtitle_fr: input.subtitle?.fr ?? "Salle d'atelier interactive Studio 2.0",
          subtitle_ar: input.subtitle?.ar ?? "قاعة ورشة تفاعلية في الاستوديو 2.0",
          level_badge: input.levelBadge?.trim() || "1AEP – 6AEP",
          join_pin: input.joinPin?.replace(/\D/g, "").slice(0, 6) || "4829",
          status: "active" as const,
        };
        const { data, error } = await client.from("studio_rooms").insert(row).select("*").single();
        if (error) throw error;
        return {
          id: data.id,
          slug: data.slug,
          title: { fr: data.title_fr, ar: data.title_ar },
          subtitle: { fr: data.subtitle_fr, ar: data.subtitle_ar },
          levelBadge: data.level_badge,
          joinPin: data.join_pin,
          status: data.status,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }, () => localBackend.createRoom(input));
    },

    async updateRoom(roomId, patch) {
      return withSupabaseOrFallback(async (client) => {
        const updatePayload: Record<string, unknown> = { updated_at: nowIso() };
        if (patch.title) {
          updatePayload.title_fr = patch.title.fr;
          updatePayload.title_ar = patch.title.ar;
        }
        if (patch.subtitle) {
          updatePayload.subtitle_fr = patch.subtitle.fr;
          updatePayload.subtitle_ar = patch.subtitle.ar;
        }
        if (patch.levelBadge !== undefined) updatePayload.level_badge = patch.levelBadge;
        if (patch.joinPin !== undefined) updatePayload.join_pin = patch.joinPin;
        if (patch.status !== undefined) updatePayload.status = patch.status;
        const { data, error } = await client
          .from("studio_rooms")
          .update(updatePayload)
          .eq("id", roomId)
          .select("*")
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new StudioNotFoundError("Room not found");
        return {
          id: data.id,
          slug: data.slug,
          title: { fr: data.title_fr, ar: data.title_ar },
          subtitle: { fr: data.subtitle_fr, ar: data.subtitle_ar },
          levelBadge: data.level_badge,
          joinPin: data.join_pin,
          status: data.status,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }, () => localBackend.updateRoom(roomId, patch));
    },

    async deleteRoom(roomId) {
      if (roomId === "mediouna-default") {
        throw new Error("La salle Mediouna officielle ne peut pas être supprimée.");
      }
      return withSupabaseOrFallback(async (client) => {
        const { error } = await client.from("studio_rooms").delete().eq("id", roomId);
        if (error) throw error;
      }, () => localBackend.deleteRoom(roomId));
    },

    async listDecksByRoom(roomId) {
      return withSupabaseOrFallback(async (client) => {
        await ensureSeededSupabase(client);
        const { data, error } = await client
          .from("studio_decks")
          .select("*")
          .eq("room_id", roomId)
          .order("updated_at", { ascending: false });
        if (error) throw error;
        return (data ?? []).map((d) => {
          const doc = normalizeDeckDocument(d.document, { id: d.id, roomId: d.room_id });
          return {
            id: d.id,
            roomId: d.room_id,
            title: { fr: d.title_fr, ar: d.title_ar },
            description: doc.description,
            currentRevisionNo: d.current_revision_no,
            createdAt: d.created_at,
            updatedAt: d.updated_at,
            document: doc,
          };
        });
      }, () => localBackend.listDecksByRoom(roomId));
    },

    async getDeck(deckId) {
      return withSupabaseOrFallback(async (client) => {
        await ensureSeededSupabase(client);
        const { data, error } = await client
          .from("studio_decks")
          .select("*")
          .eq("id", deckId)
          .maybeSingle();
        if (error) throw error;
        if (!data) return null;
        const doc = normalizeDeckDocument(data.document, { id: data.id, roomId: data.room_id });
        return {
          id: data.id,
          roomId: data.room_id,
          title: { fr: data.title_fr, ar: data.title_ar },
          description: doc.description,
          currentRevisionNo: data.current_revision_no,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          document: doc,
        };
      }, () => localBackend.getDeck(deckId));
    },

    async createDeck(input) {
      return withSupabaseOrFallback(async (client) => {
        await ensureSeededSupabase(client);
        const deckId = makeId("deck");
        let doc: DeckDocumentV1;
        if (input.mode === "mediouna") {
          doc = importMediounaDeckToDocument(input.roomId, deckId);
        } else if (input.mode === "duplicate" && input.sourceDeckId) {
          const { data: src } = await client.from("studio_decks").select("*").eq("id", input.sourceDeckId).maybeSingle();
          if (!src) throw new StudioNotFoundError("Source deck not found");
          doc = normalizeDeckDocument({ ...(src.document as object), id: deckId, roomId: input.roomId, title: input.title });
        } else if (input.mode === "json" && input.rawDocument) {
          doc = normalizeDeckDocument(input.rawDocument, { id: deckId, roomId: input.roomId, title: input.title });
        } else if (input.mode === "ai" && input.aiDocument) {
          doc = normalizeDeckDocument(input.aiDocument, { id: deckId, roomId: input.roomId, title: input.title });
        } else if (input.mode === "markdown") {
          doc = importMarkdownToDeck(input.markdown ?? "", input.title.fr, input.title.ar, input.roomId, deckId);
        } else {
          doc = createDeckFromTemplate(
            input.mode === "blank" ? "blank" : input.templateKey ?? "primary-lesson",
            input.title.fr,
            input.title.ar,
            input.roomId,
            deckId
          );
        }
        const { data, error } = await client
          .from("studio_decks")
          .insert({
            id: deckId,
            room_id: input.roomId,
            title_fr: doc.title.fr,
            title_ar: doc.title.ar,
            current_revision_no: 1,
            document: doc,
          })
          .select("*")
          .single();
        if (error) throw error;
        await client.from("studio_deck_revisions").insert({
          id: makeId("rev"),
          deck_id: deckId,
          revision_no: 1,
          summary_fr: `Création (${input.mode})`,
          summary_ar: `إنشاء العرض (${input.mode})`,
          source: input.mode === "ai" ? "ai" : "manual",
          document: doc,
        });
        return {
          id: data.id,
          roomId: data.room_id,
          title: { fr: data.title_fr, ar: data.title_ar },
          description: doc.description,
          currentRevisionNo: data.current_revision_no,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          document: doc,
        };
      }, () => localBackend.createDeck(input));
    },

    async saveDeckRevision(input) {
      return withSupabaseOrFallback(async (client) => {
        const { data: current, error: fetchErr } = await client
          .from("studio_decks")
          .select("*")
          .eq("id", input.deckId)
          .maybeSingle();
        if (fetchErr) throw fetchErr;
        if (!current) throw new StudioNotFoundError("Deck not found");

        const currentDoc = normalizeDeckDocument(current.document, { id: current.id, roomId: current.room_id });
        if (current.current_revision_no !== input.expectedRevision) {
          throw new RevisionConflictError(current.current_revision_no, currentDoc);
        }

        const validated = deckDocumentV1Schema.parse({
          ...input.document,
          id: current.id,
          roomId: current.room_id,
        });
        const nextRev = current.current_revision_no + 1;
        const ts = nowIso();

        const { data: updated, error: updErr } = await client
          .from("studio_decks")
          .update({
            title_fr: validated.title.fr,
            title_ar: validated.title.ar,
            current_revision_no: nextRev,
            document: validated,
            updated_at: ts,
          })
          .eq("id", current.id)
          .eq("current_revision_no", input.expectedRevision)
          .select("*")
          .maybeSingle();
        if (updErr) throw updErr;
        if (!updated) throw new RevisionConflictError(current.current_revision_no, currentDoc);

        const revId = makeId("rev");
        const revRow = {
          id: revId,
          deck_id: current.id,
          revision_no: nextRev,
          summary_fr: input.summary?.fr ?? `Enregistrement v${nextRev}`,
          summary_ar: input.summary?.ar ?? `حفظ النسخة v${nextRev}`,
          source: input.source ?? "manual",
          document: validated,
        };
        await client.from("studio_deck_revisions").insert(revRow);

        return {
          deck: {
            id: updated.id,
            roomId: updated.room_id,
            title: { fr: updated.title_fr, ar: updated.title_ar },
            description: validated.description,
            currentRevisionNo: updated.current_revision_no,
            createdAt: updated.created_at,
            updatedAt: updated.updated_at,
            document: validated,
          },
          revision: {
            id: revId,
            deckId: current.id,
            revisionNo: nextRev,
            summary: { fr: revRow.summary_fr, ar: revRow.summary_ar },
            source: input.source ?? "manual",
            createdAt: ts,
            document: validated,
          },
        };
      }, () => localBackend.saveDeckRevision(input));
    },

    async deleteDeck(deckId) {
      if (deckId === "deck-mediouna-21") {
        throw new Error("Le support Mediouna officiel est protégé contre la suppression.");
      }
      return withSupabaseOrFallback(async (client) => {
        const { error } = await client.from("studio_decks").delete().eq("id", deckId);
        if (error) throw error;
      }, () => localBackend.deleteDeck(deckId));
    },

    async listRevisions(deckId) {
      return withSupabaseOrFallback(async (client) => {
        const { data, error } = await client
          .from("studio_deck_revisions")
          .select("*")
          .eq("deck_id", deckId)
          .order("revision_no", { ascending: false })
          .limit(30);
        if (error) throw error;
        return (data ?? []).map((r) => ({
          id: r.id,
          deckId: r.deck_id,
          revisionNo: r.revision_no,
          summary: { fr: r.summary_fr, ar: r.summary_ar },
          source: r.source,
          createdAt: r.created_at,
          document: normalizeDeckDocument(r.document, { id: r.deck_id }),
        }));
      }, () => localBackend.listRevisions(deckId));
    },

    async restoreRevision(deckId, revisionNo) {
      return withSupabaseOrFallback(async () => {
        const deck = await this.getDeck(deckId);
        if (!deck) throw new StudioNotFoundError("Deck not found");
        const revs = await this.listRevisions(deckId);
        const found = revs.find((r) => r.revisionNo === revisionNo);
        if (!found) throw new StudioNotFoundError("Revision not found");
        return (
          await this.saveDeckRevision({
            deckId,
            expectedRevision: deck.currentRevisionNo,
            document: found.document,
            summary: {
              fr: `Restauration de la révision v${revisionNo}`,
              ar: `استعادة النسخة v${revisionNo}`,
            },
            source: "restore",
          })
        ).deck;
      }, () => localBackend.restoreRevision(deckId, revisionNo));
    },

    async listSessionsByRoom(roomId) {
      return withSupabaseOrFallback(async (client) => {
        let query = client.from("studio_sessions").select("*").order("created_at", { ascending: false });
        if (roomId) query = query.eq("room_id", roomId);
        const { data, error } = await query;
        if (error) throw error;
        return (data ?? []).map((s) => ({
          id: s.id,
          roomId: s.room_id,
          deckId: s.deck_id,
          title: { fr: s.title_fr, ar: s.title_ar },
          joinPin: s.join_pin,
          status: s.status,
          currentSlideIndex: s.current_slide_index,
          showResults: s.show_results,
          showQrOverlay: s.show_qr_overlay,
          isPaused: s.is_paused,
          frozenDocument: normalizeDeckDocument(s.frozen_document, { id: s.deck_id ?? s.id, roomId: s.room_id }),
          createdAt: s.created_at,
          updatedAt: s.updated_at,
        }));
      }, () => localBackend.listSessionsByRoom(roomId));
    },

    async getSession(sessionId) {
      return withSupabaseOrFallback(async (client) => {
        const { data, error } = await client
          .from("studio_sessions")
          .select("*")
          .eq("id", sessionId)
          .maybeSingle();
        if (error) throw error;
        if (!data) return null;
        return {
          id: data.id,
          roomId: data.room_id,
          deckId: data.deck_id,
          title: { fr: data.title_fr, ar: data.title_ar },
          joinPin: data.join_pin,
          status: data.status,
          currentSlideIndex: data.current_slide_index,
          showResults: data.show_results,
          showQrOverlay: data.show_qr_overlay,
          isPaused: data.is_paused,
          frozenDocument: normalizeDeckDocument(data.frozen_document, { id: data.deck_id ?? data.id, roomId: data.room_id }),
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }, () => localBackend.getSession(sessionId));
    },

    async createSession(input) {
      return withSupabaseOrFallback(async (client) => {
        const room = await this.getRoom(input.roomId);
        if (!room) throw new StudioNotFoundError("Room not found");
        const deck = await this.getDeck(input.deckId);
        if (!deck) throw new StudioNotFoundError("Deck not found");
        const id = makeId("sess");
        const frozen = structuredClone(deck.document);
        const row = {
          id,
          room_id: room.id,
          deck_id: deck.id,
          title_fr: input.title?.fr ?? deck.title.fr,
          title_ar: input.title?.ar ?? deck.title.ar,
          join_pin: input.joinPin?.replace(/\D/g, "").slice(0, 6) || room.joinPin || "4829",
          status: "live" as const,
          current_slide_index: 0,
          show_results: true,
          show_qr_overlay: false,
          is_paused: false,
          frozen_document: frozen,
        };
        const { data, error } = await client.from("studio_sessions").insert(row).select("*").single();
        if (error) throw error;
        return {
          id: data.id,
          roomId: data.room_id,
          deckId: data.deck_id,
          title: { fr: data.title_fr, ar: data.title_ar },
          joinPin: data.join_pin,
          status: data.status,
          currentSlideIndex: data.current_slide_index,
          showResults: data.show_results,
          showQrOverlay: data.show_qr_overlay,
          isPaused: data.is_paused,
          frozenDocument: frozen,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }, () => localBackend.createSession(input));
    },

    async updateSessionControl(sessionId, patch) {
      return withSupabaseOrFallback(async (client) => {
        const existing = await this.getSession(sessionId);
        if (!existing) throw new StudioNotFoundError("Session not found");
        const maxIdx = Math.max(0, existing.frozenDocument.slides.length - 1);
        const upd: Record<string, unknown> = { updated_at: nowIso() };
        if (patch.currentSlideIndex !== undefined) {
          upd.current_slide_index = Math.max(0, Math.min(maxIdx, patch.currentSlideIndex));
        }
        if (patch.showResults !== undefined) upd.show_results = patch.showResults;
        if (patch.showQrOverlay !== undefined) upd.show_qr_overlay = patch.showQrOverlay;
        if (patch.isPaused !== undefined) upd.is_paused = patch.isPaused;
        if (patch.status !== undefined) upd.status = patch.status;
        const { data, error } = await client
          .from("studio_sessions")
          .update(upd)
          .eq("id", sessionId)
          .select("*")
          .single();
        if (error) throw error;
        return {
          ...existing,
          status: data.status,
          currentSlideIndex: data.current_slide_index,
          showResults: data.show_results,
          showQrOverlay: data.show_qr_overlay,
          isPaused: data.is_paused,
          updatedAt: data.updated_at,
        };
      }, () => localBackend.updateSessionControl(sessionId, patch));
    },

    async submitLiveResponse(input) {
      return withSupabaseOrFallback(async (client) => {
        const ts = nowIso();
        const row = {
          id: makeId("resp"),
          session_id: input.sessionId,
          slide_id: input.slideId,
          element_id: input.elementId,
          activity_type: input.activityType,
          participant_key: input.participantKey,
          participant_name: input.participantName.trim().slice(0, 60) || "Participant",
          payload: { optionId: input.optionId, text: input.text?.trim().slice(0, 280) },
          updated_at: ts,
        };
        const { data, error } = await client
          .from("studio_live_responses")
          .upsert(row, { onConflict: "session_id,element_id,participant_key" })
          .select("*")
          .single();
        if (error) throw error;
        const payload = (data.payload ?? {}) as { optionId?: string; text?: string };
        return {
          id: data.id,
          sessionId: data.session_id,
          slideId: data.slide_id,
          elementId: data.element_id,
          activityType: data.activity_type,
          participantKey: data.participant_key,
          participantName: data.participant_name,
          optionId: payload.optionId,
          text: payload.text,
          submittedAt: data.updated_at,
        };
      }, () => localBackend.submitLiveResponse(input));
    },

    async getSessionAggregates(sessionId) {
      return withSupabaseOrFallback(async (client) => {
        const { data, error } = await client
          .from("studio_live_responses")
          .select("*")
          .eq("session_id", sessionId)
          .order("updated_at", { ascending: false });
        if (error) throw error;
        const grouped: Record<string, StudioElementLiveAggregate> = {};
        for (const item of data ?? []) {
          if (!grouped[item.element_id]) {
            grouped[item.element_id] = { elementId: item.element_id, total: 0, counts: {}, entries: [] };
          }
          const payload = (item.payload ?? {}) as { optionId?: string; text?: string };
          const bucket = grouped[item.element_id];
          bucket.total += 1;
          if (payload.optionId) {
            bucket.counts![payload.optionId] = (bucket.counts![payload.optionId] ?? 0) + 1;
          }
          bucket.entries!.push({
            id: item.id,
            participantName: item.participant_name,
            optionId: payload.optionId,
            text: payload.text,
            submittedAt: item.updated_at,
          });
        }
        return grouped;
      }, () => localBackend.getSessionAggregates(sessionId));
    },

    async listResources(roomId) {
      return withSupabaseOrFallback(async (client) => {
        await ensureSeededSupabase(client);
        const { data, error } = await client
          .from("studio_resources")
          .select("*")
          .eq("room_id", roomId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data ?? []).map((r) => ({
          id: r.id,
          roomId: r.room_id,
          kind: r.kind,
          title: { fr: r.title_fr, ar: r.title_ar },
          content: { fr: r.content_fr, ar: r.content_ar },
          url: r.url ?? undefined,
          createdAt: r.created_at,
        }));
      }, () => localBackend.listResources(roomId));
    },

    async createResource(input) {
      return withSupabaseOrFallback(async (client) => {
        const id = makeId("res");
        const { data, error } = await client
          .from("studio_resources")
          .insert({
            id,
            room_id: input.roomId,
            kind: input.kind,
            title_fr: input.title.fr,
            title_ar: input.title.ar,
            content_fr: input.content.fr,
            content_ar: input.content.ar,
            url: input.url?.trim() || null,
          })
          .select("*")
          .single();
        if (error) throw error;
        return {
          id: data.id,
          roomId: data.room_id,
          kind: data.kind,
          title: { fr: data.title_fr, ar: data.title_ar },
          content: { fr: data.content_fr, ar: data.content_ar },
          url: data.url ?? undefined,
          createdAt: data.created_at,
        };
      }, () => localBackend.createResource(input));
    },

    async listCustomComponents(roomId) {
      return withSupabaseOrFallback(async (client) => {
        let query = client.from("studio_custom_components").select("*").order("updated_at", { ascending: false });
        if (roomId) query = query.or(`room_id.is.null,room_id.eq.${roomId}`);
        const { data, error } = await query;
        if (error) throw error;
        return (data ?? []).map((c) => ({
          id: c.id,
          roomId: c.room_id ?? undefined,
          title: { fr: c.title_fr, ar: c.title_ar },
          html: c.html,
          css: c.css,
          js: c.js,
          approved: c.approved,
          createdAt: c.created_at,
          updatedAt: c.updated_at,
        }));
      }, () => localBackend.listCustomComponents(roomId));
    },

    async saveCustomComponent(input) {
      return withSupabaseOrFallback(async (client) => {
        const id = makeId("comp");
        const { data, error } = await client
          .from("studio_custom_components")
          .insert({
            id,
            room_id: input.roomId ?? null,
            title_fr: input.title.fr,
            title_ar: input.title.ar,
            html: input.html,
            css: input.css,
            js: input.js,
            approved: input.approved,
          })
          .select("*")
          .single();
        if (error) throw error;
        return {
          id: data.id,
          roomId: data.room_id ?? undefined,
          title: { fr: data.title_fr, ar: data.title_ar },
          html: data.html,
          css: data.css,
          js: data.js,
          approved: data.approved,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }, () => localBackend.saveCustomComponent(input));
    },
  };
}
