"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicWorkshopSnapshot, PublicWorkshopState } from "@/content/types";
import { createRealtimeBrowserClient } from "@/lib/supabase/browser";

export type ConnectionMode =
  | "connecting"
  | "realtime"
  | "polling"
  | "reconnecting"
  | "offline";

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

interface StateBroadcastPayload {
  payload?: {
    stateVersion?: number;
    state?: PublicWorkshopState;
  };
  stateVersion?: number;
  state?: PublicWorkshopState;
}

export function useWorkshopSync({
  mode,
  initialSnapshot = null,
  pollIntervalMs = 3000,
  enabled = true,
  onSync,
}: UseWorkshopSyncOptions) {
  const [snapshot, setSnapshot] = useState<PublicWorkshopSnapshot | null>(initialSnapshot);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>("connecting");
  const [error, setError] = useState<string | null>(null);

  const onSyncRef = useRef(onSync);
  // Authoritative monotonic version guard: never allow an older server response to overwrite newer state
  const minStateVersionRef = useRef<number>(initialSnapshot?.state.stateVersion ?? 0);
  const tokenCacheRef = useRef<{ topic: string; token: string; expiresAt: number } | null>(null);
  const inFlightRef = useRef<Promise<PublicWorkshopSnapshot | null> | null>(null);
  const consecutiveFailuresRef = useRef<number>(0);
  const isRealtimeSubscribedRef = useRef<boolean>(false);

  useEffect(() => {
    onSyncRef.current = onSync;
  }, [onSync]);

  /**
   * Optimistically patch local UI state before server confirmation.
   * Advances the local monotonic floor so in-flight polls cannot snap back.
   */
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

  /**
   * Commit authoritative server state directly (e.g. from PATCH response or Realtime payload)
   * WITHOUT artificially incrementing stateVersion ahead of the server.
   */
  const commitServerState = useCallback((serverState: PublicWorkshopState, force = false) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      if (!force && serverState.stateVersion < minStateVersionRef.current) {
        return prev;
      }
      minStateVersionRef.current = force
        ? serverState.stateVersion
        : Math.max(minStateVersionRef.current, serverState.stateVersion);
      return {
        ...prev,
        state: serverState,
      };
    });
    setError(null);
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

  /**
   * Deduplicated snapshot fetch. Prevents overlapping requests and debounces
   * transient single-request blips so connection status never flickers.
   */
  const fetchLatest = useCallback(
    async (options?: { forceState?: boolean }): Promise<PublicWorkshopSnapshot | null> => {
      if (inFlightRef.current && !options?.forceState) {
        return inFlightRef.current;
      }

      const task = (async (): Promise<PublicWorkshopSnapshot | null> => {
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
          consecutiveFailuresRef.current = 0;

          setSnapshot((prev) => {
            const incomingVersion = data.state.stateVersion;
            if (!options?.forceState && prev && incomingVersion < minStateVersionRef.current) {
              // Keep newer local optimistic state while refreshing live counts/aggregates
              return {
                ...data,
                state: prev.state,
              };
            }
            minStateVersionRef.current = options?.forceState
              ? incomingVersion
              : Math.max(minStateVersionRef.current, incomingVersion);
            return data;
          });

          setError(null);
          setConnectionMode((prev) => {
            if (isRealtimeSubscribedRef.current) return "realtime";
            if (prev === "offline" || prev === "reconnecting" || prev === "connecting") {
              return "polling";
            }
            return prev;
          });
          onSyncRef.current?.(data);
          return data;
        } catch {
          consecutiveFailuresRef.current += 1;
          const offlineNow = typeof navigator !== "undefined" && navigator.onLine === false;
          if (offlineNow) {
            setConnectionMode("offline");
            setError(
              "Hors ligne — reconnexion automatique dès le retour du réseau. / غير متصل — ستتم إعادة الاتصال تلقائياً."
            );
          } else if (consecutiveFailuresRef.current >= 2) {
            // Debounce transient single-request hiccups so the badge stays calm
            setConnectionMode(isRealtimeSubscribedRef.current ? "reconnecting" : "reconnecting");
            setError(
              "Connexion instable — nouvelle tentative automatique en cours. / اتصال غير مستقر — جاري إعادة المحاولة تلقائياً."
            );
          }
          return null;
        } finally {
          inFlightRef.current = null;
        }
      })();

      inFlightRef.current = task;
      return task;
    },
    [mode]
  );

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    let pollTimeout: ReturnType<typeof setTimeout> | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let aggregateDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    let cleanupChannel: (() => void) | null = null;
    let retryDelayMs = 5000;
    let currentIntervalMs = pollIntervalMs;

    const clearPoll = () => {
      if (pollTimeout) {
        clearTimeout(pollTimeout);
        pollTimeout = null;
      }
    };

    // Non-overlapping visibility-aware polling loop
    const scheduleNextPoll = (delayMs?: number) => {
      clearPoll();
      if (!active) return;
      const wait = delayMs ?? currentIntervalMs;
      pollTimeout = setTimeout(async () => {
        if (!active) return;
        const hidden = typeof document !== "undefined" && document.visibilityState === "hidden";
        if (!hidden) {
          await fetchLatest();
        }
        if (active) {
          scheduleNextPoll(hidden ? Math.max(currentIntervalMs * 2, 10_000) : currentIntervalMs);
        }
      }, wait);
    };

    const setPollRate = (intervalMs: number) => {
      currentIntervalMs = intervalMs;
      scheduleNextPoll(intervalMs);
    };

    const scheduleAggregateRefresh = () => {
      if (aggregateDebounceTimer) clearTimeout(aggregateDebounceTimer);
      aggregateDebounceTimer = setTimeout(() => {
        aggregateDebounceTimer = null;
        if (active) void fetchLatest();
      }, 220);
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
          expiresAt: data.expiresAt ?? Date.now() + 3_000_000,
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
          isRealtimeSubscribedRef.current = false;
          setConnectionMode("polling");
          setPollRate(pollIntervalMs);
          return;
        }

        const supabase = createRealtimeBrowserClient(async () => {
          const fresh = await fetchRealtimeToken().catch(() => null);
          return fresh?.token ?? null;
        });

        if (!supabase) {
          isRealtimeSubscribedRef.current = false;
          setConnectionMode("polling");
          setPollRate(pollIntervalMs);
          return;
        }

        await supabase.realtime.setAuth(tokenPayload.token);

        if (cleanupChannel) {
          cleanupChannel();
          cleanupChannel = null;
        }

        const channel = supabase
          .channel(tokenPayload.topic, { config: { private: true } })
          .on("broadcast", { event: "state_updated" }, (msg: StateBroadcastPayload) => {
            if (!active) return;
            const body = msg?.payload ?? msg;
            if (body?.state && typeof body.state.stateVersion === "number") {
              commitServerState(body.state, false);
              // Only refresh aggregates when entering an activity slide or revealing results
              if (body.state.activeActivityKey) {
                scheduleAggregateRefresh();
              }
            } else {
              scheduleAggregateRefresh();
            }
          })
          .on("broadcast", { event: "aggregate_updated" }, () => {
            if (active) scheduleAggregateRefresh();
          })
          .on("broadcast", { event: "activity_reset" }, () => {
            if (active) void fetchLatest({ forceState: true });
          })
          .subscribe((status) => {
            if (!active) return;
            if (status === "SUBSCRIBED") {
              retryDelayMs = 5000;
              isRealtimeSubscribedRef.current = true;
              setConnectionMode("realtime");
              // Keep a calm 20s heartbeat safety-net while Realtime is subscribed
              setPollRate(20_000);
            } else if (
              status === "CHANNEL_ERROR" ||
              status === "TIMED_OUT" ||
              status === "CLOSED"
            ) {
              isRealtimeSubscribedRef.current = false;
              tokenCacheRef.current = null;
              setConnectionMode((prev) => (prev === "offline" ? "offline" : "polling"));
              setPollRate(pollIntervalMs);
              scheduleRetry();
            }
          });

        cleanupChannel = () => {
          isRealtimeSubscribedRef.current = false;
          void supabase.removeChannel(channel);
        };
      } catch {
        isRealtimeSubscribedRef.current = false;
        tokenCacheRef.current = null;
        setConnectionMode((prev) => (prev === "offline" ? "offline" : "polling"));
        setPollRate(pollIntervalMs);
        scheduleRetry();
      }
    };

    const onOnline = () => {
      if (!active) return;
      consecutiveFailuresRef.current = 0;
      setConnectionMode("reconnecting");
      void fetchLatest().then(() => {
        if (active && !isRealtimeSubscribedRef.current) {
          void connectRealtime();
        }
      });
    };

    const onOffline = () => {
      if (!active) return;
      isRealtimeSubscribedRef.current = false;
      setConnectionMode("offline");
    };

    const onVisibility = () => {
      if (!active) return;
      if (document.visibilityState === "visible") {
        void fetchLatest();
      }
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    document.addEventListener("visibilitychange", onVisibility);

    const init = async () => {
      // Avoid redundant initial fetch when SSR already hydrated a fresh snapshot
      if (!initialSnapshot) {
        await fetchLatest();
      }
      if (!active) return;
      scheduleNextPoll(pollIntervalMs);
      void connectRealtime();
    };

    void init();

    return () => {
      active = false;
      clearPoll();
      if (retryTimer) clearTimeout(retryTimer);
      if (aggregateDebounceTimer) clearTimeout(aggregateDebounceTimer);
      if (cleanupChannel) cleanupChannel();
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [commitServerState, enabled, fetchLatest, initialSnapshot, mode, pollIntervalMs]);

  return {
    snapshot,
    connectionMode,
    error,
    refresh: fetchLatest,
    applyLocalState,
    commitServerState,
    applySnapshot,
    resetMinStateVersion,
  };
}
