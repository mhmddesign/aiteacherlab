import "server-only";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { ACTIVITIES } from "@/content/activities";
import {
  DEMO_GALLERY_CONTRIBUTIONS,
  DEMO_SUBMISSIONS_BY_ACTIVITY,
  DEMO_TEACHER_NAMES,
  getDemoAggregate,
} from "@/content/demo-snapshot";
import type {
  GalleryContributionRecord,
  ParticipantResponseItem,
  PresenterSnapshot,
  PresenterSubmissionRow,
  PublicWorkshopSnapshot,
  PublicWorkshopState,
} from "@/content/types";
import { randomTokenHex, safeEqualStrings, sha256Hex } from "@/lib/auth/crypto";
import { getWorkshopPin, getWorkshopSlug } from "@/lib/env";
import {
  computeAggregate,
  gradeResponse,
  summarizeSubmission,
  type RawResponseRow,
} from "./aggregator";

interface LocalParticipant {
  id: string;
  workshopId: string;
  displayName: string;
  sessionTokenHash: string;
  isDemo: boolean;
  joinedAt: string;
  lastSeenAt: string;
}

interface LocalResponse extends RawResponseRow {
  workshopId: string;
  activityKey: string;
  isDemo: boolean;
}

interface LocalDb {
  workshopId: string;
  slug: string;
  title: string;
  state: PublicWorkshopState;
  resetGenerations: Record<string, number>;
  participants: LocalParticipant[];
  responses: LocalResponse[];
  galleryContributions: GalleryContributionRecord[];
}

const DATA_DIR = path.join(process.cwd(), ".local-data");
const DATA_FILE = path.join(DATA_DIR, "workshop-store.json");
const rateLimitMap = new Map<string, { count: number; windowStartMs: number }>();

function createInitialLocalDb(): LocalDb {
  const workshopId = "11111111-1111-4111-8111-111111111111";
  const now = new Date().toISOString();
  const resetGenerations: Record<string, number> = {};
  for (const key of Object.keys(ACTIVITIES)) {
    resetGenerations[key] = 1;
  }
  return {
    workshopId,
    slug: getWorkshopSlug(),
    title: "AI Teacher Lab · Atelier Provincial de Mediouna",
    state: {
      workshopId,
      workshopTitle: "AI Teacher Lab · Atelier Provincial de Mediouna",
      currentSlideId: "s01-welcome",
      currentSection: 1,
      activeActivityKey: null,
      activityStatus: "idle",
      showResults: false,
      showQrOverlay: true,
      isPaused: false,
      demoMode: false,
      timerStartedAt: null,
      timerElapsedSeconds: 0,
      timerRunning: false,
      stateVersion: 1,
      updatedAt: now,
    },
    resetGenerations,
    participants: [],
    responses: [],
    galleryContributions: [],
  };
}

function readDb(): LocalDb {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const init = createInitialLocalDb();
      writeDb(init);
      return init;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw) as LocalDb;
  } catch {
    const init = createInitialLocalDb();
    writeDb(init);
    return init;
  }
}

function writeDb(db: LocalDb): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.warn("[LocalStore] Write failed:", err);
  }
}

export const localStore = {
  async getWorkshopId(): Promise<string> {
    return readDb().workshopId;
  },

  async checkRateLimit(
    bucketKey: string,
    limit: number,
    windowSeconds: number
  ): Promise<boolean> {
    const now = Date.now();
    const entry = rateLimitMap.get(bucketKey);
    if (!entry || entry.windowStartMs + windowSeconds * 1000 <= now) {
      rateLimitMap.set(bucketKey, { count: 1, windowStartMs: now });
      return true;
    }
    entry.count += 1;
    rateLimitMap.set(bucketKey, entry);
    return entry.count <= limit;
  },

  async joinParticipant(pin: string, displayName: string) {
    const expectedPin = getWorkshopPin();
    if (!safeEqualStrings(pin.trim(), expectedPin)) {
      return { ok: false as const, status: 401, error: "Code PIN de l'atelier incorrect." };
    }
    const db = readDb();
    const rawToken = randomTokenHex(24);
    const tokenHash = sha256Hex(rawToken);
    const now = new Date().toISOString();
    const participant: LocalParticipant = {
      id: crypto.randomUUID(),
      workshopId: db.workshopId,
      displayName: displayName.trim(),
      sessionTokenHash: tokenHash,
      isDemo: false,
      joinedAt: now,
      lastSeenAt: now,
    };
    db.participants.push(participant);
    writeDb(db);
    return {
      ok: true as const,
      participantId: participant.id,
      workshopId: db.workshopId,
      displayName: participant.displayName,
      tokenHash,
    };
  },

  async getParticipantBySession(participantId: string, tokenHash: string) {
    const db = readDb();
    const p = db.participants.find(
      (x) => x.id === participantId && x.sessionTokenHash === tokenHash && !x.isDemo
    );
    return p ?? null;
  },

  async touchHeartbeat(participantId: string) {
    const db = readDb();
    const p = db.participants.find((x) => x.id === participantId);
    if (p) {
      p.lastSeenAt = new Date().toISOString();
      writeDb(db);
    }
  },

  async getPublicSnapshot(): Promise<PublicWorkshopSnapshot> {
    const db = readDb();
    const state = db.state;
    const isDemo = state.demoMode;
    const activeKey = state.activeActivityKey;
    const includeAnswers = state.activityStatus === "revealed";

    if (isDemo) {
      const aggregate = activeKey ? getDemoAggregate(activeKey, includeAnswers) : null;
      const total = DEMO_TEACHER_NAMES.length;
      const respondents = aggregate?.totalRespondents ?? total;
      return {
        state,
        connectedCount: total,
        totalParticipants: total,
        responseRate: total > 0 ? Math.min(100, Math.round((respondents / total) * 100)) : 0,
        aggregate,
        galleryContributionsCount:
          DEMO_GALLERY_CONTRIBUTIONS.length +
          db.galleryContributions.filter((g) => g.isDemo).length,
      };
    }

    const realParticipants = db.participants.filter((p) => !p.isDemo);
    const cutoff = Date.now() - 90_000;
    const connectedCount = realParticipants.filter(
      (p) => new Date(p.lastSeenAt).getTime() >= cutoff
    ).length;

    let aggregate = null;
    if (activeKey) {
      const rows = db.responses.filter((r) => r.activityKey === activeKey && !r.isDemo);
      aggregate = computeAggregate(
        activeKey,
        db.resetGenerations[activeKey] ?? 1,
        rows,
        includeAnswers
      );
    }

    const total = realParticipants.length;
    const respondents = aggregate?.totalRespondents ?? 0;
    return {
      state,
      connectedCount,
      totalParticipants: total,
      responseRate: total > 0 ? Math.min(100, Math.round((respondents / total) * 100)) : 0,
      aggregate,
      galleryContributionsCount: db.galleryContributions.filter((g) => !g.isDemo).length,
    };
  },

  async getPresenterSnapshot(): Promise<PresenterSnapshot> {
    const pub = await this.getPublicSnapshot();
    const db = readDb();

    if (pub.state.demoMode) {
      const activityCounts: Record<string, number> = {};
      for (const key of Object.keys(ACTIVITIES)) {
        activityCounts[key] = getDemoAggregate(key, true)?.totalRespondents ?? 0;
      }
      const activeList = pub.state.activeActivityKey
        ? DEMO_SUBMISSIONS_BY_ACTIVITY[pub.state.activeActivityKey] ?? []
        : [];
      return {
        ...pub,
        recentSubmissions: activeList,
        activityCounts,
      };
    }

    const realResponses = db.responses.filter((r) => !r.isDemo);
    const activityCounts: Record<string, number> = {};
    for (const key of Object.keys(ACTIVITIES)) {
      const respondents = new Set(
        realResponses.filter((r) => r.activityKey === key).map((r) => r.participant_id)
      );
      activityCounts[key] = respondents.size;
    }

    const scoped = pub.state.activeActivityKey
      ? realResponses.filter((r) => r.activityKey === pub.state.activeActivityKey)
      : realResponses;

    const recentSubmissions: PresenterSubmissionRow[] = scoped
      .slice(-20)
      .reverse()
      .map((r) => ({
        id: r.id,
        activityKey: r.activityKey,
        itemKey: r.item_key,
        selectedOption: r.selected_option,
        isCorrect: r.is_correct,
        summary: summarizeSubmission(
          r.activityKey,
          r.item_key,
          r.selected_option,
          r.payload
        ),
        createdAt: r.created_at,
      }));

    return {
      ...pub,
      recentSubmissions,
      activityCounts,
    };
  },

  async getParticipantResponses(
    participantId: string,
    activityKey: string
  ): Promise<ParticipantResponseItem[]> {
    const db = readDb();
    return db.responses
      .filter(
        (r) =>
          r.participant_id === participantId &&
          r.activityKey === activityKey &&
          !r.isDemo
      )
      .map((r) => ({
        itemKey: r.item_key,
        selectedOption: r.selected_option,
        payload: r.payload,
        isCorrect: r.is_correct,
        createdAt: r.created_at,
      }));
  },

  async submitParticipantResponse(input: {
    participantId: string;
    activityKey: string;
    itemKey: string;
    selectedOption?: string;
    payload?: Record<string, unknown>;
  }) {
    const db = readDb();
    if (db.state.isPaused) {
      return {
        ok: false as const,
        status: 409,
        error: "L'atelier est actuellement en pause par l'animateur.",
      };
    }
    if (
      db.state.activeActivityKey !== input.activityKey ||
      db.state.activityStatus !== "open"
    ) {
      return {
        ok: false as const,
        status: 409,
        error: "Cette activité n'est pas ouverte aux réponses pour le moment.",
      };
    }

    const duplicate = db.responses.find(
      (r) =>
        r.activityKey === input.activityKey &&
        r.participant_id === input.participantId &&
        r.item_key === input.itemKey &&
        !r.isDemo
    );
    if (duplicate) {
      return {
        ok: false as const,
        status: 409,
        error: "Vous avez déjà soumis une réponse pour cet élément.",
      };
    }

    const isCorrect = gradeResponse(
      input.activityKey,
      input.itemKey,
      input.selectedOption
    );
    const now = new Date().toISOString();
    const row: LocalResponse = {
      id: crypto.randomUUID(),
      workshopId: db.workshopId,
      activityKey: input.activityKey,
      participant_id: input.participantId,
      item_key: input.itemKey,
      selected_option: input.selectedOption ?? null,
      payload: input.payload ?? {},
      is_correct: isCorrect,
      isDemo: false,
      created_at: now,
    };
    db.responses.push(row);
    const p = db.participants.find((x) => x.id === input.participantId);
    if (p) p.lastSeenAt = now;
    writeDb(db);

    return {
      ok: true as const,
      response: {
        itemKey: row.item_key,
        selectedOption: row.selected_option,
        payload: row.payload,
        isCorrect: row.is_correct,
        createdAt: row.created_at,
      },
    };
  },

  async updatePresenterControl(patch: {
    currentSlideId?: string;
    currentSection?: number;
    activeActivityKey?: string | null;
    activityStatus?: PublicWorkshopState["activityStatus"];
    showResults?: boolean;
    showQrOverlay?: boolean;
    isPaused?: boolean;
    demoMode?: boolean;
    timerAction?: "start" | "pause" | "reset";
  }): Promise<PublicWorkshopState> {
    const db = readDb();
    const s = db.state;
    const now = new Date().toISOString();

    if (patch.currentSlideId !== undefined) s.currentSlideId = patch.currentSlideId;
    if (patch.currentSection !== undefined) s.currentSection = patch.currentSection;
    if (patch.activeActivityKey !== undefined) s.activeActivityKey = patch.activeActivityKey;
    if (patch.activityStatus !== undefined) s.activityStatus = patch.activityStatus;
    if (patch.showResults !== undefined) s.showResults = patch.showResults;
    if (patch.showQrOverlay !== undefined) s.showQrOverlay = patch.showQrOverlay;
    if (patch.isPaused !== undefined) s.isPaused = patch.isPaused;
    if (patch.demoMode !== undefined) s.demoMode = patch.demoMode;

    if (patch.timerAction === "start" && !s.timerRunning) {
      s.timerRunning = true;
      s.timerStartedAt = now;
    } else if (patch.timerAction === "pause" && s.timerRunning) {
      const elapsed = s.timerStartedAt
        ? Math.max(0, Math.floor((Date.now() - new Date(s.timerStartedAt).getTime()) / 1000))
        : 0;
      s.timerElapsedSeconds += elapsed;
      s.timerStartedAt = null;
      s.timerRunning = false;
    } else if (patch.timerAction === "reset") {
      s.timerElapsedSeconds = 0;
      s.timerStartedAt = s.timerRunning ? now : null;
    }

    s.stateVersion += 1;
    s.updatedAt = now;
    writeDb(db);
    return s;
  },

  async resetActivity(activityKey: string): Promise<PublicWorkshopState> {
    const db = readDb();
    db.responses = db.responses.filter(
      (r) => !(r.activityKey === activityKey && !r.isDemo)
    );
    db.resetGenerations[activityKey] = (db.resetGenerations[activityKey] ?? 1) + 1;
    if (db.state.activeActivityKey === activityKey) {
      db.state.activityStatus = "open";
      db.state.showResults = false;
    }
    db.state.stateVersion += 1;
    db.state.updatedAt = new Date().toISOString();
    writeDb(db);
    return db.state;
  },

  async purgeRealParticipants(): Promise<PublicWorkshopState> {
    const db = readDb();
    db.responses = db.responses.filter((r) => r.isDemo);
    db.participants = db.participants.filter((p) => p.isDemo);
    db.galleryContributions = db.galleryContributions.filter((g) => g.isDemo);
    db.state.currentSlideId = "s01-welcome";
    db.state.currentSection = 1;
    db.state.activeActivityKey = null;
    db.state.activityStatus = "idle";
    db.state.showResults = false;
    db.state.isPaused = false;
    db.state.stateVersion += 1;
    db.state.updatedAt = new Date().toISOString();
    writeDb(db);
    return db.state;
  },

  async listGalleryContributions(demoMode: boolean): Promise<GalleryContributionRecord[]> {
    const db = readDb();
    if (demoMode) {
      return [
        ...db.galleryContributions.filter((g) => g.isDemo),
        ...DEMO_GALLERY_CONTRIBUTIONS,
      ];
    }
    return db.galleryContributions.filter((g) => !g.isDemo).reverse();
  },

  async addGalleryContribution(
    input: Omit<GalleryContributionRecord, "id" | "isDemo" | "createdAt"> & {
      participantId: string | null;
    }
  ): Promise<GalleryContributionRecord> {
    const db = readDb();
    const record: GalleryContributionRecord = {
      id: crypto.randomUUID(),
      contributorName: input.contributorName,
      appTitle: input.appTitle,
      gradeRange: input.gradeRange,
      discipline: input.discipline,
      language: input.language,
      learningObjective: input.learningObjective,
      description: input.description,
      classroomInstructions: input.classroomInstructions,
      appResource: input.appResource,
      testedFeatures: input.testedFeatures,
      privacyConfirmed: true,
      isDemo: db.state.demoMode,
      createdAt: new Date().toISOString(),
    };
    db.galleryContributions.push(record);
    writeDb(db);
    return record;
  },
};
