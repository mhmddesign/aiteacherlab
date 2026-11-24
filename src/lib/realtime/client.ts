"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicWorkshopSnapshot } from "@/content/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export type ConnectionMode = "realtime" | "polling" | "offline";

interface UseWorkshopSyncOptions {
  mode: "public" | "presenter";
  initialSnapshot?: PublicWorkshopSnapshot | null;
  pollIntervalMs?: number;
  enabled?: boolean;
  onSync?: (snapshot: PublicWorkshopSnapshot) => void;
}

export function useWorkshopSync({
  mode,
  initialSnapshot = null,
  pollIntervalMs = 2500,
  enabled = true,
  onSync,
}: UseWorkshopSyncOptions) {
  const [snapshot, setSnapshot] = useState<PublicWorkshopSnapshot | null>(initialSnapshot);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>("polling");
  const [error, setError] = useState<string | null>(null);
  const onSyncRef = useRef(onSync);
  useEffect(() => {
    onSyncRef.current = onSync;
  }, [onSync]);

  const fetchLatest = useCallback(async () => {
    try {
      const endpoint = mode === "presenter" ? "/api/presenter/state" : "/api/workshop/state";
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          return null;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as PublicWorkshopSnapshot;
      setSnapshot(data);
      setError(null);
      onSyncRef.current?.(data);
      return data;
    } catch {
      setConnectionMode((prev) => (prev === "realtime" ? "polling" : "offline"));
      setError("Connexion instable — nouvelle tentative automatique en cours.");
      return null;
    }
  }, [mode]);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let cleanupRealtime: (() => void) | null = null;

    const startPolling = (interval: number) => {
      if (pollTimer) clearInterval(pollTimer);
      pollTimer = setInterval(() => {
        if (active) void fetchLatest();
      }, interval);
    };

    const init = async () => {
      const first = await fetchLatest();
      if (!active) return;

      const supabase = getSupabaseBrowserClient();
      if (!supabase || !first) {
        setConnectionMode("polling");
        startPolling(pollIntervalMs);
        return;
      }

      try {
        const tokenRes = await fetch(
          `/api/realtime/token?scope=${mode === "presenter" ? "presenter" : "public"}`,
          { cache: "no-store" }
        );
        if (!tokenRes.ok) {
          setConnectionMode("polling");
          startPolling(pollIntervalMs);
          return;
        }
        const tokenData = (await tokenRes.json()) as {
          topic?: string;
          token?: string;
        };
        if (!tokenData.topic || !tokenData.token) {
          setConnectionMode("polling");
          startPolling(pollIntervalMs);
          return;
        }

        await supabase.realtime.setAuth(tokenData.token);
        const channel = supabase
          .channel(tokenData.topic, { config: { private: true } })
          .on("broadcast", { event: "state_updated" }, () => {
            if (active) void fetchLatest();
          })
          .on("broadcast", { event: "aggregate_updated" }, () => {
            if (active) void fetchLatest();
          })
          .on("broadcast", { event: "activity_reset" }, () => {
            if (active) void fetchLatest();
          })
          .subscribe((status) => {
            if (!active) return;
            if (status === "SUBSCRIBED") {
              setConnectionMode("realtime");
              // Low-frequency safety check even while Realtime is healthy
              startPolling(12000);
            } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
              setConnectionMode("polling");
              startPolling(pollIntervalMs);
            }
          });

        cleanupRealtime = () => {
          void supabase.removeChannel(channel);
        };
      } catch {
        setConnectionMode("polling");
        startPolling(pollIntervalMs);
      }
    };

    void init();

    return () => {
      active = false;
      if (pollTimer) clearInterval(pollTimer);
      if (cleanupRealtime) cleanupRealtime();
    };
  }, [enabled, fetchLatest, mode, pollIntervalMs]);

  return {
    snapshot,
    connectionMode,
    error,
    refresh: fetchLatest,
  };
}
