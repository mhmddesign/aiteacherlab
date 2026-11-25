import "server-only";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import {
  getSessionSecret,
  getSupabasePublishableKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type RealtimeScope = "public" | "presenter";

export function getWorkshopTopic(workshopId: string, scope: RealtimeScope): string {
  return `workshop:${workshopId}:${scope}`;
}

interface CachedGrantToken {
  accessToken: string;
  expiresAtMs: number;
}

const tokenCache = new Map<string, CachedGrantToken>();
const grantsVerified = new Set<string>();

function deriveRealtimeUserPassword(email: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(`realtime-user:${email}`)
    .digest("hex");
}

export async function broadcastWorkshopEvent(
  workshopId: string,
  scope: RealtimeScope,
  event: string,
  payload: Record<string, unknown>
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const admin = getSupabaseAdminClient();
  if (!admin) return;

  const topic = getWorkshopTopic(workshopId, scope);
  const channel = admin.channel(topic, {
    config: { private: true },
  });

  try {
    await channel.httpSend(event, payload);
  } catch (err) {
    console.warn(`[Realtime] httpSend failed for ${topic}:`, err);
  } finally {
    await admin.removeChannel(channel).catch(() => undefined);
  }
}

export async function issueWorkshopRealtimeToken(
  workshopId: string,
  role: "viewer" | "presenter"
): Promise<{
  topic: string;
  token: string;
  expiresAt: number;
} | null> {
  const url = getSupabaseUrl();
  const pubKey = getSupabasePublishableKey();
  const admin = getSupabaseAdminClient();
  if (!url || !pubKey || !admin) {
    return null;
  }

  const scope: RealtimeScope = role === "presenter" ? "presenter" : "public";
  const topic = getWorkshopTopic(workshopId, scope);
  const cacheKey = `${workshopId}:${role}`;
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiresAtMs - Date.now() > 120_000) {
    return {
      topic,
      token: cached.accessToken,
      expiresAt: cached.expiresAtMs,
    };
  }

  try {
    const email = `rt-${role}-${workshopId.slice(0, 8)}@mediouna-workshop.local`;
    const password = deriveRealtimeUserPassword(email);

    const tempClient = createClient(url, pubKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Fast path: sign in directly with deterministic password derived from SESSION_SECRET
    const { data: fastSign, error: fastErr } = await tempClient.auth.signInWithPassword({
      email,
      password,
    });

    let session = fastSign?.session ?? null;
    let userId = fastSign?.user?.id ?? null;

    if (fastErr || !session || !userId) {
      // Cold provision or password rotation path
      const { data: existingList } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 100,
      });
      userId = existingList?.users?.find((u) => u.email === email)?.id ?? null;

      if (!userId) {
        const { data: created, error: createErr } = await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { workshopId, rtRole: role },
        });
        if (createErr || !created?.user) {
          return null;
        }
        userId = created.user.id;
      } else {
        await admin.auth.admin.updateUserById(userId, { password });
      }

      const { data: retrySign, error: retryErr } = await tempClient.auth.signInWithPassword({
        email,
        password,
      });
      if (retryErr || !retrySign.session) {
        return null;
      }
      session = retrySign.session;
      grantsVerified.delete(cacheKey);
    }

    if (!grantsVerified.has(cacheKey) && userId) {
      const grants: Array<{ user_id: string; workshop_id: string; topic: string; role: string }> = [
        {
          user_id: userId,
          workshop_id: workshopId,
          topic: getWorkshopTopic(workshopId, "public"),
          role,
        },
      ];
      if (role === "presenter") {
        grants.push({
          user_id: userId,
          workshop_id: workshopId,
          topic: getWorkshopTopic(workshopId, "presenter"),
          role,
        });
      }

      const { error: grantErr } = await admin.from("realtime_channel_grants").upsert(grants, {
        onConflict: "user_id,topic",
      });
      if (!grantErr) {
        grantsVerified.add(cacheKey);
      }
    }

    const expiresAtMs = (session.expires_at ?? Math.floor(Date.now() / 1000) + 3600) * 1000;
    tokenCache.set(cacheKey, {
      accessToken: session.access_token,
      expiresAtMs,
    });

    return {
      topic,
      token: session.access_token,
      expiresAt: expiresAtMs,
    };
  } catch (err) {
    console.warn("[Realtime] Token issuance error:", err);
    return null;
  }
}
