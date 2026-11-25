"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicWorkshopSnapshot, PublicWorkshopState } from "@/content/types";
import { createRealtimeBrowserClient } from "@/lib/supabase/browser";

export type ConnectionMode = "realtime" | "polling" | "offline";

interface UseWorkshopSyncOptions {
  mode: "public" | "presenter";
  initialSnapshot?: PublicWorkshopSnapshot | null;
  pollIntervalMs?: number;
  enabled?: boolean;
  onSync?: (snapshot: PublicWorkshopSnapshot) => void;
}

interface RealtimeTokenPayload {
  topic?: string;
  token?: string;
  expiresAt?: number;
  pollingFallback?: boolean;
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
  const minStateVersionRef = useRef<number>(initialSnapshot?.state.stateVersion ?? 0);
  const tokenCacheRef = useRef<{ topic: string; token: string; expiresAt: number } | null>(null);

  useEffect(() => {
    onSyncRef.current = onSync;
  }, [onSync]);

  const applyLocalState = useCallback((patch: Partial<PublicWorkshopState>) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      const nextVersion = Math.max(prev.state.stateVersion, minStateVersionRef.current) + 1;
      minStateVersionRef.current = nextVersion;
      return {
        ...prev,
        state: {
          ...prev.state,
          ...patch,
          stateVersion: nextVersion,
        },
      };
    });
  }, []);

  const resetMinStateVersion = useCallback((version: number) => {
    minStateVersionRef.current = version;
  }, []);

  const applySnapshot = useCallback((nextSnapshot: PublicWorkshopSnapshot) => {
    minStateVersionRef.current = Math.max(
      minStateVersionRef.current,
      nextSnapshot.state.stateVersion
    );
    setSnapshot(nextSnapshot);
    setError(null);
  }, []);

  const fetchLatest = useCallback(
    async (options?: { forceState?: boolean }) => {
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
        setSnapshot((prev) => {
          const incomingVersion = data.state.stateVersion;
          if (!options?.forceState && prev && incomingVersion < minStateVersionRef.current) {
            // Preserve newer local optimistic slide/controls while updating live participant/aggregate metrics
            return {
              ...data,
              state: prev.state,
            };
          }
          minStateVersionRef.current = Math.max(minStateVersionRef.current, incomingVersion);
          return data;
        });
        setError(null);
        onSyncRef.current?.(data);
        return data;
      } catch {
        setConnectionMode((prev) => (prev === "realtime" ? "polling" : "offline"));
        setError(
          "Connexion instable — nouvelle tentative automatique en cours. / اتصال غير مستقر — جاري إعادة المحاولة تلقائياً."
        );
        return null;
      }
    },
    [mode]
  );

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let cleanupChannel: (() => void) | null = null;
    let retryDelayMs = 5000;

    const startPolling = (interval: number) => {
      if (pollTimer) clearInterval(pollTimer);
      pollTimer = setInterval(() => {
        if (active) void fetchLatest();
      }, interval);
    };

    const fetchRealtimeToken = async (): Promise<RealtimeTokenPayload | null> => {
      const cached = tokenCacheRef.current;
      if (cached && cached.expiresAt - Date.now() > 120_000) {
        return cached;
      }
      const res = await fetch(
        `/api/realtime/token?scope=${mode === "presenter" ? "presenter" : "public"}`,
        { cache: "no-store" }
      );
      if (!res.ok) return null;
      const data = (await res.json()) as RealtimeTokenPayload;
      if (data.topic && data.token) {
        tokenCacheRef.current = {
          topic: data.topic,
          token: data.token,
          expiresAt: data.expiresAt ?? Date.now() + 3000_000,
        };
        return tokenCacheRef.current;
      }
      return null;
    };

    const connectRealtime = async () => {
      if (!active) return;

      const scheduleRetry = () => {
        if (!active || retryTimer) return;
        const delay = retryDelayMs;
        retryDelayMs = Math.min(30_000, retryDelayMs * 2);
        retryTimer = setTimeout(() => {
          retryTimer = null;
          void connectRealtime();
        }, delay);
      };

      try {
        const tokenPayload = await fetchRealtimeToken();
        if (!active) return;
        if (!tokenPayload?.topic || !tokenPayload.token) {
          setConnectionMode("polling");
          startPolling(pollIntervalMs);
          return;
        }

        const supabase = createRealtimeBrowserClient(async () => {
          const fresh = await fetchRealtimeToken().catch(() => null);
          return fresh?.token ?? null;
        });

        if (!supabase) {
          setConnectionMode("polling");
          startPolling(pollIntervalMs);
          return;
        }

        await supabase.realtime.setAuth(tokenPayload.token);

        if (cleanupChannel) {
          cleanupChannel();
          cleanupChannel = null;
        }

        const channel = supabase
          .channel(tokenPayload.topic, { config: { private: true } })
          .on("broadcast", { event: "state_updated" }, () => {
            if (active) void fetchLatest({ forceState: true });
          })
          .on("broadcast", { event: "aggregate_updated" }, () => {
            if (active) void fetchLatest();
          })
          .on("broadcast", { event: "activity_reset" }, () => {
            if (active) void fetchLatest({ forceState: true });
          })
          .subscribe((status) => {
            if (!active) return;
            if (status === "SUBSCRIBED") {
              retryDelayMs = 5000;
              setConnectionMode("realtime");
              startPolling(12_000);
            } else if (
              status === "CHANNEL_ERROR" ||
              status === "TIMED_OUT" ||
              status === "CLOSED"
            ) {
              tokenCacheRef.current = null;
              setConnectionMode("polling");
              startPolling(pollIntervalMs);
              scheduleRetry();
            }
          });

        cleanupChannel = () => {
          void supabase.removeChannel(channel);
        };
      } catch {
        tokenCacheRef.current = null;
        setConnectionMode("polling");
        startPolling(pollIntervalMs);
        scheduleRetry();
      }
    };

    const init = async () => {
      const first = await fetchLatest();
      if (!active) return;
      if (!first) {
        setConnectionMode("polling");
        startPolling(pollIntervalMs);
        return;
      }
      startPolling(pollIntervalMs);
      void connectRealtime();
    };

    void init();

    return () => {
      active = false;
      if (pollTimer) clearInterval(pollTimer);
      if (retryTimer) clearTimeout(retryTimer);
      if (cleanupChannel) cleanupChannel();
    };
  }, [enabled, fetchLatest, mode, pollIntervalMs]);

  return {
    snapshot,
    connectionMode,
    error,
    refresh: fetchLatest,
    applyLocalState,
    applySnapshot,
    resetMinStateVersion,
  };
}
