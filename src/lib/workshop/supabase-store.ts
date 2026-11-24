import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ACTIVITIES } from "@/content/activities";
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
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  computeAggregate,
  gradeResponse,
  summarizeSubmission,
  type RawResponseRow,
} from "./aggregator";

function mustAdmin(): SupabaseClient {
  const client = getSupabaseAdminClient();
  if (!client) {
    throw new Error("Supabase admin client is not configured.");
  }
  return client;
}

interface WorkshopRecord {
  id: string;
  slug: string;
  title: string;
  join_pin_hash: string;
}

async function getWorkshopAndState(): Promise<{
  workshop: WorkshopRecord;
  state: PublicWorkshopState;
}> {
  const admin = mustAdmin();
  const slug = getWorkshopSlug();
  const { data: workshop, error: wErr } = await admin
    .from("workshops")
    .select("id, slug, title, join_pin_hash")
    .eq("slug", slug)
    .single();

  if (wErr || !workshop) {
    throw new Error(
      `Workshop '${slug}' introuvable dans Supabase. Vérifiez l'exécution des migrations SQL. / الورشة غير موجودة في قاعدة البيانات.`
    );
  }

  const { data: st, error: sErr } = await admin
    .from("workshop_state")
    .select("*")
    .eq("workshop_id", workshop.id)
    .single();

  if (sErr || !st) {
    throw new Error(
      "État workshop_state introuvable dans Supabase. / حالة الورشة غير موجودة في قاعدة البيانات."
    );
  }

  return {
    workshop: workshop as WorkshopRecord,
    state: {
      workshopId: workshop.id,
      workshopTitle: workshop.title,
      currentSlideId: st.current_slide_id,
      currentSection: st.current_section,
      activeActivityKey: st.active_activity_key,
      activityStatus: st.activity_status,
      showResults: st.show_results,
      showQrOverlay: st.show_qr_overlay,
      isPaused: st.is_paused,
      demoMode: st.demo_mode,
      timerStartedAt: st.timer_started_at,
      timerElapsedSeconds: st.timer_elapsed_seconds,
      timerRunning: st.timer_running,
      stateVersion: Number(st.state_version ?? 1),
      updatedAt: st.updated_at,
    },
  };
}

export const supabaseStore = {
  async getWorkshopId(): Promise<string> {
    const { workshop } = await getWorkshopAndState();
    return workshop.id;
  },

  async checkRateLimit(
    bucketKey: string,
    limit: number,
    windowSeconds: number
  ): Promise<boolean> {
    const admin = mustAdmin();
    const { data, error } = await admin.rpc("check_rate_limit", {
      p_bucket_key: bucketKey,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      console.warn("[Supabase] check_rate_limit error:", error.message);
      return true;
    }
    return Boolean(data);
  },

  async joinParticipant(pin: string, displayName: string) {
    const { workshop } = await getWorkshopAndState();
    const envPin = getWorkshopPin();
    const pinHash = sha256Hex(pin.trim());
    const envPinHash = sha256Hex(envPin);

    // Verify strictly against the server-side WORKSHOP_PIN environment variable
    if (!safeEqualStrings(pinHash, envPinHash)) {
      return {
        ok: false as const,
        status: 401,
        error: "Code PIN de l'atelier incorrect. / رمز PIN الخاص بالورشة غير صحيح.",
      };
    }

    const admin = mustAdmin();
    const rawToken = randomTokenHex(24);
    const tokenHash = sha256Hex(rawToken);
    const now = new Date().toISOString();

    const { data, error } = await admin
      .from("participants")
      .insert({
        workshop_id: workshop.id,
        display_name: displayName.trim(),
        session_token_hash: tokenHash,
        is_demo: false,
        joined_at: now,
        last_seen_at: now,
      })
      .select("id, display_name")
      .single();

    if (error || !data) {
      return {
        ok: false as const,
        status: 500,
        error: "Impossible d'enregistrer votre session. / تعذر تسجيل جلستكم.",
      };
    }

    return {
      ok: true as const,
      participantId: data.id as string,
      workshopId: workshop.id,
      displayName: data.display_name as string,
      tokenHash,
    };
  },

  async getParticipantBySession(participantId: string, tokenHash: string) {
    const admin = mustAdmin();
    const { data } = await admin
      .from("participants")
      .select("id, workshop_id, display_name, session_token_hash, is_demo, joined_at, last_seen_at")
      .eq("id", participantId)
      .eq("session_token_hash", tokenHash)
      .eq("is_demo", false)
      .maybeSingle();

    if (!data) return null;
    return {
      id: data.id as string,
      workshopId: data.workshop_id as string,
      displayName: data.display_name as string,
      sessionTokenHash: data.session_token_hash as string,
      isDemo: Boolean(data.is_demo),
      joinedAt: data.joined_at as string,
      lastSeenAt: data.last_seen_at as string,
    };
  },

  async touchHeartbeat(participantId: string) {
    const admin = mustAdmin();
    await admin
      .from("participants")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", participantId)
      .eq("is_demo", false);
  },

  async getPublicSnapshot(): Promise<PublicWorkshopSnapshot> {
    const admin = mustAdmin();
    const { workshop, state } = await getWorkshopAndState();
    const isDemo = state.demoMode;
    const cutoffIso = new Date(Date.now() - 90_000).toISOString();

    const [{ count: totalParticipants }, { count: connectedCount }, { count: galleryCount }] =
      await Promise.all([
        admin
          .from("participants")
          .select("id", { count: "exact", head: true })
          .eq("workshop_id", workshop.id)
          .eq("is_demo", isDemo),
        isDemo
          ? admin
              .from("participants")
              .select("id", { count: "exact", head: true })
              .eq("workshop_id", workshop.id)
              .eq("is_demo", true)
          : admin
              .from("participants")
              .select("id", { count: "exact", head: true })
              .eq("workshop_id", workshop.id)
              .eq("is_demo", false)
              .gte("last_seen_at", cutoffIso),
        admin
          .from("gallery_contributions")
          .select("id", { count: "exact", head: true })
          .eq("workshop_id", workshop.id)
          .eq("is_demo", isDemo),
      ]);

    let aggregate = null;
    if (state.activeActivityKey) {
      const { data: act } = await admin
        .from("activities")
        .select("id, reset_generation")
        .eq("workshop_id", workshop.id)
        .eq("activity_key", state.activeActivityKey)
        .maybeSingle();

      if (act) {
        const { data: respRows } = await admin
          .from("responses")
          .select("id, participant_id, item_key, selected_option, payload, is_correct, created_at")
          .eq("workshop_id", workshop.id)
          .eq("activity_id", act.id)
          .eq("is_demo", isDemo);

        aggregate = computeAggregate(
          state.activeActivityKey,
          act.reset_generation ?? 1,
          (respRows ?? []) as RawResponseRow[],
          state.activityStatus === "revealed"
        );
      }
    }

    const total = totalParticipants ?? 0;
    const respondents = aggregate?.totalRespondents ?? 0;

    return {
      state,
      connectedCount: connectedCount ?? 0,
      totalParticipants: total,
      responseRate: total > 0 ? Math.min(100, Math.round((respondents / total) * 100)) : 0,
      aggregate,
      galleryContributionsCount: galleryCount ?? 0,
    };
  },

  async getPresenterSnapshot(): Promise<PresenterSnapshot> {
    const admin = mustAdmin();
    const pub = await this.getPublicSnapshot();
    const isDemo = pub.state.demoMode;

    const { data: activities } = await admin
      .from("activities")
      .select("id, activity_key")
      .eq("workshop_id", pub.state.workshopId);

    const idToKey = new Map<string, string>();
    const keyToId = new Map<string, string>();
    for (const a of activities ?? []) {
      idToKey.set(a.id, a.activity_key);
      keyToId.set(a.activity_key, a.id);
    }

    const { data: allResp } = await admin
      .from("responses")
      .select("id, activity_id, participant_id, item_key, selected_option, payload, is_correct, created_at")
      .eq("workshop_id", pub.state.workshopId)
      .eq("is_demo", isDemo)
      .order("created_at", { ascending: false })
      .limit(400);

    const activityCounts: Record<string, number> = {};
    for (const key of Object.keys(ACTIVITIES)) {
      const actId = keyToId.get(key);
      const set = new Set(
        (allResp ?? [])
          .filter((r) => r.activity_id === actId)
          .map((r) => r.participant_id)
      );
      activityCounts[key] = set.size;
    }

    const activeActId = pub.state.activeActivityKey
      ? keyToId.get(pub.state.activeActivityKey)
      : null;

    const recentSubmissions: PresenterSubmissionRow[] = (allResp ?? [])
      .filter((r) => (!activeActId ? true : r.activity_id === activeActId))
      .slice(0, 20)
      .map((r) => {
        const key = idToKey.get(r.activity_id) ?? "unknown";
        return {
          id: r.id,
          activityKey: key,
          itemKey: r.item_key,
          selectedOption: r.selected_option,
          isCorrect: r.is_correct,
          summary: summarizeSubmission(
            key,
            r.item_key,
            r.selected_option,
            (r.payload ?? {}) as Record<string, unknown>
          ),
          createdAt: r.created_at,
        };
      });

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
    const admin = mustAdmin();
    const { workshop } = await getWorkshopAndState();
    const { data: act } = await admin
      .from("activities")
      .select("id")
      .eq("workshop_id", workshop.id)
      .eq("activity_key", activityKey)
      .maybeSingle();

    if (!act) return [];
    const { data } = await admin
      .from("responses")
      .select("item_key, selected_option, payload, is_correct, created_at")
      .eq("activity_id", act.id)
      .eq("participant_id", participantId)
      .eq("is_demo", false);

    return (data ?? []).map((r) => ({
      itemKey: r.item_key,
      selectedOption: r.selected_option,
      payload: (r.payload ?? {}) as Record<string, unknown>,
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
    const admin = mustAdmin();
    const { workshop, state } = await getWorkshopAndState();

    if (state.isPaused) {
      return {
        ok: false as const,
        status: 409,
        error: "L'atelier est actuellement en pause par l'animateur. / تم إيقاف الورشة مؤقتاً من طرف المنشط.",
      };
    }
    if (
      state.activeActivityKey !== input.activityKey ||
      state.activityStatus !== "open"
    ) {
      return {
        ok: false as const,
        status: 409,
        error: "Cette activité n'est pas ouverte aux réponses pour le moment. / هذا النشاط غير مفتوح للإجابات حالياً.",
      };
    }

    const { data: act } = await admin
      .from("activities")
      .select("id")
      .eq("workshop_id", workshop.id)
      .eq("activity_key", input.activityKey)
      .maybeSingle();

    if (!act) {
      return {
        ok: false as const,
        status: 404,
        error: "Activité introuvable. / النشاط غير موجود.",
      };
    }

    const isCorrect = gradeResponse(
      input.activityKey,
      input.itemKey,
      input.selectedOption
    );

    const { data: inserted, error } = await admin
      .from("responses")
      .insert({
        workshop_id: workshop.id,
        activity_id: act.id,
        participant_id: input.participantId,
        item_key: input.itemKey,
        selected_option: input.selectedOption ?? null,
        payload: input.payload ?? {},
        is_correct: isCorrect,
        is_demo: false,
      })
      .select("item_key, selected_option, payload, is_correct, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return {
          ok: false as const,
          status: 409,
          error: "Vous avez déjà soumis une réponse pour cet élément. / لقد سبق لكم إرسال إجابة لهذا العنصر.",
        };
      }
      return {
        ok: false as const,
        status: 500,
        error: "Erreur lors de l'enregistrement de la réponse. / خطأ أثناء حفظ الإجابة.",
      };
    }

    await admin
      .from("participants")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", input.participantId);

    return {
      ok: true as const,
      response: {
        itemKey: inserted.item_key,
        selectedOption: inserted.selected_option,
        payload: (inserted.payload ?? {}) as Record<string, unknown>,
        isCorrect: inserted.is_correct,
        createdAt: inserted.created_at,
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
    const admin = mustAdmin();
    const { workshop, state } = await getWorkshopAndState();
    const now = new Date().toISOString();

    const updatePayload: Record<string, unknown> = {
      state_version: state.stateVersion + 1,
    };

    if (patch.currentSlideId !== undefined)
      updatePayload.current_slide_id = patch.currentSlideId;
    if (patch.currentSection !== undefined)
      updatePayload.current_section = patch.currentSection;
    if (patch.activeActivityKey !== undefined)
      updatePayload.active_activity_key = patch.activeActivityKey;
    if (patch.activityStatus !== undefined)
      updatePayload.activity_status = patch.activityStatus;
    if (patch.showResults !== undefined)
      updatePayload.show_results = patch.showResults;
    if (patch.showQrOverlay !== undefined)
      updatePayload.show_qr_overlay = patch.showQrOverlay;
    if (patch.isPaused !== undefined) updatePayload.is_paused = patch.isPaused;
    if (patch.demoMode !== undefined) updatePayload.demo_mode = patch.demoMode;

    if (patch.timerAction === "start" && !state.timerRunning) {
      updatePayload.timer_running = true;
      updatePayload.timer_started_at = now;
    } else if (patch.timerAction === "pause" && state.timerRunning) {
      const elapsed = state.timerStartedAt
        ? Math.max(0, Math.floor((Date.now() - new Date(state.timerStartedAt).getTime()) / 1000))
        : 0;
      updatePayload.timer_elapsed_seconds = state.timerElapsedSeconds + elapsed;
      updatePayload.timer_started_at = null;
      updatePayload.timer_running = false;
    } else if (patch.timerAction === "reset") {
      updatePayload.timer_elapsed_seconds = 0;
      updatePayload.timer_started_at = state.timerRunning ? now : null;
    }

    await admin
      .from("workshop_state")
      .update(updatePayload)
      .eq("workshop_id", workshop.id);

    const refreshed = await getWorkshopAndState();
    return refreshed.state;
  },

  async resetActivity(activityKey: string): Promise<PublicWorkshopState> {
    const admin = mustAdmin();
    const { workshop, state } = await getWorkshopAndState();

    const { data: act } = await admin
      .from("activities")
      .select("id, reset_generation")
      .eq("workshop_id", workshop.id)
      .eq("activity_key", activityKey)
      .maybeSingle();

    if (act) {
      await admin
        .from("responses")
        .delete()
        .eq("workshop_id", workshop.id)
        .eq("activity_id", act.id)
        .eq("is_demo", false);

      await admin
        .from("activities")
        .update({ reset_generation: (act.reset_generation ?? 1) + 1 })
        .eq("id", act.id);
    }

    const stateUpdate: Record<string, unknown> = {
      state_version: state.stateVersion + 1,
    };
    if (state.activeActivityKey === activityKey) {
      stateUpdate.activity_status = "open";
      stateUpdate.show_results = false;
    }

    await admin
      .from("workshop_state")
      .update(stateUpdate)
      .eq("workshop_id", workshop.id);

    return (await getWorkshopAndState()).state;
  },

  async purgeRealParticipants(): Promise<PublicWorkshopState> {
    const admin = mustAdmin();
    const { workshop, state } = await getWorkshopAndState();

    await admin
      .from("responses")
      .delete()
      .eq("workshop_id", workshop.id)
      .eq("is_demo", false);

    await admin
      .from("gallery_contributions")
      .delete()
      .eq("workshop_id", workshop.id)
      .eq("is_demo", false);

    await admin
      .from("participants")
      .delete()
      .eq("workshop_id", workshop.id)
      .eq("is_demo", false);

    await admin
      .from("workshop_state")
      .update({
        current_slide_id: "s01-welcome",
        current_section: 1,
        active_activity_key: null,
        activity_status: "idle",
        show_results: false,
        is_paused: false,
        state_version: state.stateVersion + 1,
      })
      .eq("workshop_id", workshop.id);

    return (await getWorkshopAndState()).state;
  },

  async listGalleryContributions(demoMode: boolean): Promise<GalleryContributionRecord[]> {
    const admin = mustAdmin();
    const { workshop } = await getWorkshopAndState();
    const { data } = await admin
      .from("gallery_contributions")
      .select("*")
      .eq("workshop_id", workshop.id)
      .eq("is_demo", demoMode)
      .order("created_at", { ascending: false });

    return (data ?? []).map((row) => ({
      id: row.id,
      contributorName: row.contributor_name,
      appTitle: row.app_title,
      gradeRange: row.grade_range,
      discipline: row.discipline,
      language: row.language,
      learningObjective: row.learning_objective,
      description: row.description,
      classroomInstructions: row.classroom_instructions,
      appResource: row.app_resource,
      testedFeatures: Array.isArray(row.tested_features) ? row.tested_features : [],
      privacyConfirmed: Boolean(row.privacy_confirmed),
      isDemo: Boolean(row.is_demo),
      createdAt: row.created_at,
    }));
  },

  async addGalleryContribution(
    input: Omit<GalleryContributionRecord, "id" | "isDemo" | "createdAt"> & {
      participantId: string | null;
    }
  ): Promise<GalleryContributionRecord> {
    const admin = mustAdmin();
    const { workshop, state } = await getWorkshopAndState();

    const { data, error } = await admin
      .from("gallery_contributions")
      .insert({
        workshop_id: workshop.id,
        participant_id: input.participantId,
        contributor_name: input.contributorName,
        app_title: input.appTitle,
        grade_range: input.gradeRange,
        discipline: input.discipline,
        language: input.language,
        learning_objective: input.learningObjective,
        description: input.description,
        classroom_instructions: input.classroomInstructions,
        app_resource: input.appResource,
        tested_features: input.testedFeatures,
        privacy_confirmed: true,
        is_demo: state.demoMode,
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(
        "Impossible d'enregistrer la contribution dans la galerie. / تعذر حفظ المساهمة في المعرض."
      );
    }

    return {
      id: data.id,
      contributorName: data.contributor_name,
      appTitle: data.app_title,
      gradeRange: data.grade_range,
      discipline: data.discipline,
      language: data.language,
      learningObjective: data.learning_objective,
      description: data.description,
      classroomInstructions: data.classroom_instructions,
      appResource: data.app_resource,
      testedFeatures: Array.isArray(data.tested_features) ? data.tested_features : [],
      privacyConfirmed: Boolean(data.privacy_confirmed),
      isDemo: Boolean(data.is_demo),
      createdAt: data.created_at,
    };
  },
};
