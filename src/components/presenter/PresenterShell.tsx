"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  ListOrdered,
  Loader2,
  Lock,
  LogOut,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  QrCode,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  Smartphone,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { getActivityByKey } from "@/content/activities";
import {
  getSectionList,
  getSlideById,
  getSlideIndex,
  SLIDES,
  TOTAL_SECTIONS,
} from "@/content/slides";
import type { PresenterSnapshot, PublicWorkshopState } from "@/content/types";
import { useWorkshopSync } from "@/lib/realtime/client";
import { usePresentationFullscreen } from "@/lib/usePresentationFullscreen";
import { PresentationViewport } from "@/components/slides/PresentationViewport";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
import { ConnectionBadge } from "@/components/ui/ConnectionBadge";
import { QrJoinPanel } from "@/components/ui/QrJoinPanel";

interface PresenterShellProps {
  initialAuthenticated: boolean;
  initialSnapshot: PresenterSnapshot | null;
  workshopPinHint?: string;
}

function formatSeconds(totalSec: number): string {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function PresenterShell({
  initialAuthenticated,
  initialSnapshot,
  workshopPinHint,
}: PresenterShellProps) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [purging, setPurging] = useState(false);
  const [openingScreen, setOpeningScreen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [drawer, setDrawer] = useState<"none" | "outline" | "notes" | "tools">("none");
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeText, setPurgeText] = useState("");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const fullscreenWrapperRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, isCssFullscreen, toggleFullscreen } =
    usePresentationFullscreen(fullscreenWrapperRef);

  const {
    snapshot,
    connectionMode,
    refresh,
    applySnapshot,
    applyLocalState,
    resetMinStateVersion,
  } = useWorkshopSync({
    mode: "presenter",
    initialSnapshot,
    enabled: authenticated,
  });

  const active = (snapshot as PresenterSnapshot | null) ?? initialSnapshot;
  const resolvedPinHint = active?.workshopPinHint ?? workshopPinHint;

  // Ordered, non-blocking patch queue that coalesces rapid slide presses cleanly
  const queueRef = useRef<Array<Record<string, unknown>>>([]);
  const drainingRef = useRef(false);
  const currentSlide = getSlideById(active?.state.currentSlideId);
  const currentIdx = getSlideIndex(currentSlide.id);
  const currentIdxRef = useRef(currentIdx);
  useEffect(() => {
    if (!drainingRef.current && queueRef.current.length === 0) {
      currentIdxRef.current = currentIdx;
    }
  }, [currentIdx]);

  const isTimerRunning = Boolean(active?.state.timerRunning);
  useEffect(() => {
    if (!isTimerRunning) return;
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isTimerRunning]);

  const displaySeconds = !active
    ? 0
    : active.state.timerElapsedSeconds +
      (active.state.timerRunning && active.state.timerStartedAt
        ? Math.max(
            0,
            Math.floor((nowMs - new Date(active.state.timerStartedAt).getTime()) / 1000)
          )
        : 0);

  const drainQueue = useCallback(async () => {
    if (drainingRef.current) return;
    drainingRef.current = true;
    setSyncing(true);
    try {
      while (queueRef.current.length > 0) {
        // Coalesce consecutive navigation-only patches so rapid clicks flush directly to final slide
        const nextPatch = { ...queueRef.current.shift()! };
        while (
          queueRef.current.length > 0 &&
          typeof nextPatch.currentSlideId === "string" &&
          typeof queueRef.current[0].currentSlideId === "string" &&
          Object.keys(nextPatch).length === 1 &&
          Object.keys(queueRef.current[0]).length === 1
        ) {
          Object.assign(nextPatch, queueRef.current.shift()!);
        }

        const res = await fetch("/api/presenter/control", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextPatch),
        });

        if (res.status === 401) {
          queueRef.current = [];
          setAuthenticated(false);
          return;
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setSyncError(
            errData.error ??
              "Échec de synchronisation avec le serveur. / فشل المزامنة مع الخادم."
          );
          await refresh({ forceState: true });
          return;
        }

        const payload = (await res.json()) as { ok?: boolean; state?: PublicWorkshopState };
        setSyncError(null);

        if (queueRef.current.length === 0 && payload.state) {
          resetMinStateVersion(payload.state.stateVersion);
          applyLocalState(payload.state);
          currentIdxRef.current = getSlideIndex(payload.state.currentSlideId);
          // Refresh aggregates in background without forcing old slide state over rapid keypresses
          if (
            nextPatch.demoMode !== undefined ||
            nextPatch.activityStatus !== undefined ||
            nextPatch.showResults !== undefined ||
            (nextPatch.currentSlideId && getSlideById(String(nextPatch.currentSlideId)).activityKey)
          ) {
            void refresh();
          }
        }
      }
    } catch {
      setSyncError(
        "Connexion instable lors de l'envoi. / اتصال غير مستقر أثناء الإرسال."
      );
      await refresh({ forceState: true });
    } finally {
      drainingRef.current = false;
      setSyncing(false);
    }
  }, [applyLocalState, refresh, resetMinStateVersion]);

  const sendControl = useCallback(
    (patch: Record<string, unknown>) => {
      // Immediate optimistic local update (next frame)
      const localPatch: Partial<PublicWorkshopState> = {
        ...(patch as Partial<PublicWorkshopState>),
      };
      if (typeof patch.currentSlideId === "string") {
        const target = getSlideById(patch.currentSlideId);
        currentIdxRef.current = getSlideIndex(target.id);
        localPatch.currentSlideId = target.id;
        localPatch.currentSection = target.sectionNumber;
        if (patch.activeActivityKey === undefined) {
          localPatch.activeActivityKey = target.activityKey ?? null;
        }
        if (patch.activityStatus === undefined) {
          localPatch.activityStatus = target.activityKey ? "open" : "idle";
        }
        if (patch.showResults === undefined) {
          localPatch.showResults = false;
        }
      }
      applyLocalState(localPatch);
      setSyncError(null);
      queueRef.current.push(patch);
      void drainQueue();
    },
    [applyLocalState, drainQueue]
  );

  const goToIndex = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(SLIDES.length - 1, idx));
      if (clamped === currentIdxRef.current) return;
      currentIdxRef.current = clamped;
      sendControl({ currentSlideId: SLIDES[clamped].id });
    },
    [sendControl]
  );

  const goPrev = useCallback(() => {
    if (currentIdxRef.current > 0) goToIndex(currentIdxRef.current - 1);
  }, [goToIndex]);

  const goNext = useCallback(() => {
    if (currentIdxRef.current < SLIDES.length - 1) goToIndex(currentIdxRef.current + 1);
  }, [goToIndex]);

  useEffect(() => {
    if (!authenticated || showPurgeModal) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el?.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToIndex(SLIDES.length - 1);
      } else if (e.key === "Escape") {
        setDrawer("none");
      } else if (e.key.toLowerCase() === "o") {
        setDrawer((d) => (d === "outline" ? "none" : "outline"));
      } else if (e.key.toLowerCase() === "n") {
        setDrawer((d) => (d === "notes" ? "none" : "notes"));
      } else if (e.key.toLowerCase() === "f") {
        void toggleFullscreen();
      } else if (e.key.toLowerCase() === "p" && active) {
        sendControl({ isPaused: !active.state.isPaused });
      } else if (e.key.toLowerCase() === "q" && active) {
        sendControl({ showQrOverlay: !active.state.showQrOverlay });
      } else if (e.key.toLowerCase() === "r" && active?.state.activeActivityKey) {
        sendControl({ activityStatus: "revealed", showResults: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authenticated, active, goNext, goPrev, goToIndex, sendControl, showPurgeModal, toggleFullscreen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loggingIn) return;
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await fetch("/api/presenter/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error ?? "Accès refusé. / تم رفض الولوج.");
        return;
      }
      if (data.snapshot) {
        applySnapshot(data.snapshot);
        setAuthenticated(true);
      } else {
        setAuthenticated(true);
        await refresh({ forceState: true });
      }
    } catch {
      setLoginError(
        "Erreur de connexion. Veuillez réessayer. / خطأ في الاتصال. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/presenter/logout", { method: "POST" });
      setAuthenticated(false);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleResetActivity = async () => {
    if (!active?.state.activeActivityKey || resetting) return;
    setResetting(true);
    try {
      await fetch("/api/presenter/reset-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityKey: active.state.activeActivityKey }),
      });
      await refresh({ forceState: true });
    } finally {
      setResetting(false);
    }
  };

  const handlePurge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (purging) return;
    setPurging(true);
    try {
      const res = await fetch("/api/presenter/participants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: purgeText }),
      });
      if (res.ok) {
        setShowPurgeModal(false);
        setPurgeText("");
        await refresh({ forceState: true });
      }
    } finally {
      setPurging(false);
    }
  };

  if (!authenticated || !active) {
    return (
      <div className="min-h-screen bg-[#0B1220] px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-[#FAF8F4] p-8 shadow-2xl space-y-5">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <BilingualInline
                text={{
                  fr: "Espace Animateur Protégé",
                  ar: "فضاء المنشط المحمي",
                }}
              />
            </span>
            <BilingualBlock
              text={{
                fr: "Présentation · Mediouna",
                ar: "العرض التقديمي · مديونة",
              }}
              frClassName="font-display text-2xl font-bold text-slate-900"
              arClassName="text-lg font-bold text-teal-800"
            />
            <BilingualBlock
              text={{
                fr: "Réservé au facilitateur de l'atelier. Ce code est distinct du PIN partagé avec les participants.",
                ar: "خاص بمنشط الورشة فقط، ويختلف عن رمز PIN المشترك مع المشاركين.",
              }}
              frClassName="text-xs text-slate-600"
              arClassName="text-xs text-slate-700"
            />
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block text-xs font-bold text-slate-700">
              <BilingualInline
                text={{
                  fr: "Code d'accès animateur",
                  ar: "رمز دخول المنشط",
                }}
              />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="FACILITATOR_PASSCODE"
                dir="ltr"
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
              />
            </label>
            {loginError && (
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              aria-busy={loggingIn}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-bold text-white hover:bg-[#0D655E] disabled:opacity-75 cursor-pointer"
            >
              {loggingIn && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
              <BilingualInline
                text={
                  loggingIn
                    ? {
                        fr: "Connexion...",
                        ar: "جاري الاتصال...",
                      }
                    : {
                        fr: "Ouvrir le poste de contrôle",
                        ar: "فتح مركز التحكم",
                      }
                }
              />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const sections = getSectionList();
  const activeActivityDef = getActivityByKey(active.state.activeActivityKey);
  const progressPct = Math.round(((currentIdx + 1) / SLIDES.length) * 100);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#060B16] text-white flex flex-col">
      {/* Slim Presentation-First Top Bar (Hidden in Fullscreen) */}
      {!isFullscreen && (
        <header className="no-print shrink-0 z-30 border-b border-slate-800/80 bg-[#0B1220]/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-display text-xs sm:text-sm font-bold text-white">
                AI Teacher Lab · Animateur ·{" "}
                <span dir="rtl" lang="ar" className="font-arabic text-teal-300">
                  المنشط
                </span>
              </span>
              <span className="text-xs font-semibold text-slate-300 tabular-nums">
                Diapo {currentIdx + 1}/{SLIDES.length}
              </span>
              <ConnectionBadge
                mode={connectionMode}
                demoMode={active.state.demoMode}
                compact
              />
              {syncing && (
                <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/40 bg-teal-500/15 px-2 py-0.5 text-[11px] font-semibold text-teal-200">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <BilingualInline text={{ fr: "Synchro...", ar: "مزامنة..." }} />
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-[#111C33] px-2 py-1 text-xs">
                <Clock className="h-3.5 w-3.5 text-teal-300" />
                <span className="font-mono-code font-bold tabular-nums">
                  {formatSeconds(displaySeconds)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    sendControl({ timerAction: active.state.timerRunning ? "pause" : "start" })
                  }
                  className="ml-1 rounded px-1.5 py-0.5 text-[11px] bg-slate-700 hover:bg-teal-600 cursor-pointer"
                >
                  {active.state.timerRunning ? "Pause" : "Start"}
                </button>
                <button
                  type="button"
                  onClick={() => sendControl({ timerAction: "reset" })}
                  className="rounded px-1.5 py-0.5 text-[11px] bg-slate-800 hover:bg-slate-700 cursor-pointer"
                >
                  00:00
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDrawer((d) => (d === "outline" ? "none" : "outline"))}
                className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] sm:text-xs font-semibold cursor-pointer ${
                  drawer === "outline"
                    ? "border-teal-500 bg-teal-600 text-white"
                    : "border-slate-700 bg-[#111C33] text-slate-200 hover:border-teal-400"
                }`}
              >
                <ListOrdered className="h-3.5 w-3.5 shrink-0" />
                <BilingualInline text={{ fr: "Plan", ar: "الفهرس" }} />
              </button>

              <button
                type="button"
                onClick={() => setDrawer((d) => (d === "notes" ? "none" : "notes"))}
                className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] sm:text-xs font-semibold cursor-pointer ${
                  drawer === "notes"
                    ? "border-teal-500 bg-teal-600 text-white"
                    : "border-slate-700 bg-[#111C33] text-slate-200 hover:border-teal-400"
                }`}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <BilingualInline text={{ fr: "Notes", ar: "ملاحظات" }} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setDrawer((d) => {
                    const next = d === "tools" ? "none" : "tools";
                    if (next === "tools") void refresh({ forceState: true });
                    return next;
                  });
                }}
                className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] sm:text-xs font-semibold cursor-pointer ${
                  drawer === "tools"
                    ? "border-teal-500 bg-teal-600 text-white"
                    : "border-slate-700 bg-[#111C33] text-slate-200 hover:border-teal-400"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
                <BilingualInline text={{ fr: "Tableau de bord", ar: "الأدوات" }} />
              </button>

              <Link
                href="/screen"
                target="_blank"
                onClick={() => {
                  setOpeningScreen(true);
                  window.setTimeout(() => setOpeningScreen(false), 1200);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-teal-500/40 bg-teal-500/10 px-2 py-1 text-[11px] sm:text-xs font-bold text-teal-200 hover:bg-teal-500/20"
              >
                {openingScreen ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                ) : (
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                )}
                <BilingualInline
                  text={
                    openingScreen
                      ? { fr: "Ouverture...", ar: "جاري الفتح..." }
                      : { fr: "/screen", ar: "العرض" }
                  }
                />
              </Link>

              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Plein écran / ملء الشاشة"
                title="Plein écran (F) / ملء الشاشة"
                className="rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-busy={loggingOut}
                aria-label="Déconnexion / تسجيل الخروج"
                title="Déconnexion / تسجيل الخروج"
                className="rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:text-white disabled:opacity-60 cursor-pointer"
              >
                {loggingOut ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Animated Presentation Progress Hairline */}
          <div className="h-1 w-full bg-slate-900">
            <div
              className="h-full bg-teal-500 transition-all duration-200"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </header>
      )}

      {/* Compact Sync Error & Contextual Activity Bar (Outside 16:9 Slide Canvas) */}
      {!isFullscreen && syncError && (
        <div className="shrink-0 mx-auto w-full max-w-[1600px] px-3 pt-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-400/50 bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-100">
            <span className="inline-flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-300 shrink-0" />
              {syncError}
            </span>
            <button
              type="button"
              onClick={() => {
                setSyncError(null);
                void refresh({ forceState: true });
              }}
              className="rounded-lg bg-amber-600 px-2.5 py-1 text-xs font-bold text-white cursor-pointer"
            >
              <BilingualInline text={{ fr: "Resynchroniser", ar: "إعادة المزامنة" }} />
            </button>
          </div>
        </div>
      )}

      {!isFullscreen && activeActivityDef && (
        <div className="shrink-0 mx-auto w-full max-w-[1600px] px-2.5 sm:px-4 pt-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-[#111C33] px-3 py-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <BilingualBlock
                text={activeActivityDef.title}
                frClassName="font-bold text-white hidden sm:block"
                arClassName="font-semibold text-teal-300 hidden md:block"
              />
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono-code text-[11px] uppercase text-slate-200">
                {active.state.activityStatus}
              </span>
              <span className="text-slate-300 tabular-nums">
                {active.connectedCount} / {active.totalParticipants} ({active.responseRate}%)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                aria-pressed={active.state.activityStatus === "open"}
                onClick={() => sendControl({ activityStatus: "open" })}
                className={`rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-bold text-white cursor-pointer transition ${
                  active.state.activityStatus === "open"
                    ? "bg-teal-500 ring-2 ring-teal-300 shadow-sm"
                    : "bg-teal-600/85 hover:bg-teal-500"
                }`}
              >
                <BilingualInline text={{ fr: "Ouvrir / Rouvrir", ar: "فتح / إعادة فتح" }} />
              </button>
              <button
                type="button"
                aria-pressed={active.state.activityStatus === "closed"}
                onClick={() => sendControl({ activityStatus: "closed", showResults: true })}
                className={`rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-bold text-white cursor-pointer transition ${
                  active.state.activityStatus === "closed"
                    ? "bg-slate-600 ring-2 ring-slate-300 shadow-sm"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                <BilingualInline text={{ fr: "Fermer", ar: "إغلاق" }} />
              </button>
              <button
                type="button"
                aria-pressed={active.state.showResults}
                onClick={() => sendControl({ showResults: !active.state.showResults })}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] sm:text-xs font-bold cursor-pointer transition ${
                  active.state.showResults
                    ? "border-teal-300 bg-teal-500/25 text-white ring-1 ring-teal-300/60"
                    : "border-teal-500/50 text-teal-200 hover:bg-teal-500/15"
                }`}
              >
                <Eye className="h-3.5 w-3.5 shrink-0" />
                {active.state.showResults ? (
                  <BilingualInline text={{ fr: "Masquer résultats", ar: "إخفاء النتائج" }} />
                ) : (
                  <BilingualInline text={{ fr: "Afficher résultats", ar: "عرض النتائج" }} />
                )}
              </button>
              {(activeActivityDef.type === "mcq_quiz" ||
                activeActivityDef.type === "tf_quiz") && (
                <button
                  type="button"
                  aria-pressed={active.state.activityStatus === "revealed"}
                  onClick={() =>
                    sendControl({ activityStatus: "revealed", showResults: true })
                  }
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-bold text-white cursor-pointer transition ${
                    active.state.activityStatus === "revealed"
                      ? "bg-amber-500 ring-2 ring-amber-300 shadow-sm"
                      : "bg-amber-600 hover:bg-amber-500"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <BilingualInline text={{ fr: "Révéler réponses", ar: "كشف الإجابات" }} />
                </button>
              )}
              <button
                type="button"
                disabled={resetting}
                aria-busy={resetting}
                onClick={handleResetActivity}
                className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 px-2 py-1 text-[11px] sm:text-xs font-semibold text-amber-200 hover:bg-amber-500/20 disabled:opacity-60 cursor-pointer"
              >
                {resetting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                )}
                <BilingualInline
                  text={
                    resetting
                      ? { fr: "Réinitialisation...", ar: "إعادة الضبط..." }
                      : { fr: "Réinitialiser", ar: "إعادة ضبط" }
                  }
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Centered Fixed 16:9 Presentation Stage + Fullscreen Target */}
      <main
        ref={fullscreenWrapperRef}
        data-fullscreen-wrapper="true"
        className={
          isCssFullscreen
            ? "fixed inset-0 z-50 h-[100dvh] w-screen bg-[#060B16] p-0 m-0 flex flex-col items-center justify-center overflow-hidden"
            : isFullscreen
              ? "h-[100dvh] w-screen bg-[#060B16] p-0 m-0 flex flex-col items-center justify-center overflow-hidden"
              : "relative flex flex-1 min-h-0 min-w-0 w-full flex-col items-center justify-center overflow-hidden px-2 py-2 sm:px-5 sm:py-3"
        }
      >
        <PresentationViewport rounded={!isFullscreen}>
          <SlideRenderer
            slide={currentSlide}
            mode="presenter"
            activityStatus={active.state.activityStatus}
            showResults={active.state.showResults}
            showQrOverlay={isFullscreen ? false : active.state.showQrOverlay}
            isPaused={active.state.isPaused}
            aggregate={active.aggregate}
            connectedCount={active.connectedCount}
            totalParticipants={active.totalParticipants}
            joinPinHint={resolvedPinHint}
          />
        </PresentationViewport>

        {!isFullscreen && (
          <div
            data-orientation-hint="true"
            className="portrait-phone-hint mt-1.5 shrink-0 items-center gap-2 rounded-full border border-slate-700/80 bg-[#111C33]/90 px-3 py-1 text-[11px] text-slate-300"
          >
            <Smartphone className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            <BilingualInline
              text={{
                fr: "Tournez l'appareil en paysage",
                ar: "أدر الجهاز أفقياً لعرض أوضح",
              }}
            />
          </div>
        )}

        {/* Discreet Floating Presenter Controls in Fullscreen Mode */}
        {isFullscreen && (
          <div
            data-fullscreen-controls="true"
            className="no-print absolute bottom-3 right-3 z-30 flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-[#0B1220]/75 px-2.5 py-1.5 text-xs text-slate-200 backdrop-blur-md opacity-55 hover:opacity-100 focus-within:opacity-100 transition-opacity"
          >
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={goPrev}
              aria-label="Précédent / السابق"
              className="rounded-full p-1 hover:bg-slate-700/80 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-1.5 text-[11px] font-semibold tabular-nums text-slate-200">
              Diapo {currentIdx + 1}/{SLIDES.length}
            </span>
            <button
              type="button"
              disabled={currentIdx === SLIDES.length - 1}
              onClick={goNext}
              aria-label="Suivant / التالي"
              className="rounded-full p-1 hover:bg-slate-700/80 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="h-3.5 w-px bg-slate-700" aria-hidden="true" />
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Quitter le plein écran / إنهاء ملء الشاشة"
              title="Esc"
              className="rounded-full p-1 hover:bg-slate-700/80 cursor-pointer"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>

      {/* Bottom Presentation Navigation Bar (Hidden in Fullscreen) */}
      {!isFullscreen && (
        <footer className="no-print shrink-0 z-20 border-t border-slate-800/80 bg-[#0B1220]/95 backdrop-blur px-3 py-1.5 sm:px-5 sm:py-2.5">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={goPrev}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-[#111C33] px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-200 hover:border-teal-400 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <BilingualInline text={{ fr: "Précédent", ar: "السابق" }} />
            </button>

            <div className="text-center text-xs text-slate-400 hidden sm:block">
              Section {active.state.currentSection} / {TOTAL_SECTIONS} · Diapo{" "}
              <strong className="text-white">{currentIdx + 1}</strong> / {SLIDES.length}
            </div>

            <button
              type="button"
              disabled={currentIdx === SLIDES.length - 1}
              onClick={goNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#0D655E] disabled:opacity-40 cursor-pointer"
            >
              <BilingualInline text={{ fr: "Suivant", ar: "التالي" }} />
              <ChevronRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        </footer>
      )}

      {/* On-Demand Outline Drawer (Hidden by Default) */}
      {drawer === "outline" && (
        <div className="fixed inset-0 z-40 flex justify-start bg-black/55 backdrop-blur-[1px]">
          <div className="w-full max-w-md bg-[#0B1220] border-r border-slate-800 h-full overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <BilingualBlock
                text={{
                  fr: "Plan de la présentation (12 sections)",
                  ar: "فهرس العرض التقديمي (12 محوراً)",
                }}
                frClassName="text-sm font-bold text-white"
                arClassName="text-xs font-bold text-teal-300"
              />
              <button
                type="button"
                onClick={() => setDrawer("none")}
                aria-label="Fermer le plan / إغلاق الفهرس"
                className="rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {sections.map((sec) => {
                const sectionSlides = SLIDES.filter(
                  (s) => s.sectionNumber === sec.sectionNumber
                );
                const isCurrentSec = sec.sectionNumber === active.state.currentSection;
                return (
                  <div key={sec.sectionNumber} className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        sendControl({ currentSlideId: sec.firstSlideId });
                        setDrawer("none");
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs cursor-pointer ${
                        isCurrentSec
                          ? "bg-teal-600 font-bold text-white"
                          : "bg-[#111C33] text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      <BilingualBlock
                        text={sec.title}
                        arClassName={`text-[11px] ${
                          isCurrentSec ? "text-teal-50" : "text-teal-300"
                        }`}
                      />
                      <span className="text-[11px] opacity-80 shrink-0">
                        {sec.timeRange.fr}
                      </span>
                    </button>

                    <div className="pl-3 space-y-1">
                      {sectionSlides.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            sendControl({ currentSlideId: s.id });
                            setDrawer("none");
                          }}
                          className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs cursor-pointer ${
                            s.id === currentSlide.id
                              ? "border border-teal-400 bg-teal-950/60 text-white font-semibold"
                              : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                          }`}
                        >
                          <BilingualBlock
                            text={s.title}
                            arClassName="text-[11px] text-teal-300"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex-1" onClick={() => setDrawer("none")} />
        </div>
      )}

      {/* Collapsible Presenter Notes Drawer */}
      {drawer === "notes" && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/55 backdrop-blur-[1px]">
          <div className="flex-1" onClick={() => setDrawer("none")} />
          <aside className="w-full max-w-md bg-[#0B1220] border-l border-slate-800 h-full overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <BilingualBlock
                  text={{
                    fr: "Notes de l'animateur (Script)",
                    ar: "ملاحظات المنشط (نص التقديم)",
                  }}
                  frClassName="text-sm font-bold text-white"
                  arClassName="text-xs font-bold text-teal-300"
                />
                <span className="font-mono-code text-[11px] text-amber-300">
                  {currentSlide.presenterNotes.durationCue}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawer("none")}
                aria-label="Fermer les notes / إغلاق الملاحظات"
                className="rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl bg-[#111C33] p-4 border border-slate-800 text-xs leading-relaxed">
              <BilingualBlock
                text={currentSlide.presenterNotes.script}
                frClassName="text-slate-100"
                arClassName="text-teal-200"
              />
            </div>

            <div className="rounded-xl border border-teal-500/30 bg-teal-950/30 p-3.5 text-xs space-y-1.5">
              <BilingualBlock
                text={currentSlide.darijaNote.title}
                frClassName="font-bold text-teal-300"
                arClassName="font-bold text-teal-200"
              />
              <p dir="ltr" lang="fr" className="text-slate-200 leading-relaxed">
                {currentSlide.darijaNote.fr}
              </p>
              <p dir="rtl" lang="ar" className="font-arabic text-sm text-teal-100 leading-relaxed">
                {currentSlide.darijaNote.arabic}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-teal-300">
                Exemple · <span className="font-arabic">مثال تطبيقي</span>
              </p>
              <BilingualBlock
                text={currentSlide.presenterNotes.classroomExample}
                frClassName="text-slate-300"
                arClassName="text-slate-200"
              />
            </div>

            {currentSlide.presenterNotes.discussionPrompt && (
              <div className="space-y-2 text-xs">
                <p className="font-bold text-amber-300">
                  Discussion · <span className="font-arabic">سؤال للنقاش</span>
                </p>
                <BilingualBlock
                  text={currentSlide.presenterNotes.discussionPrompt}
                  frClassName="text-slate-200"
                  arClassName="text-amber-100"
                />
              </div>
            )}

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-400">
                Transition · <span className="font-arabic">الانتقال</span>
              </p>
              <BilingualBlock
                text={currentSlide.presenterNotes.transition}
                frClassName="text-slate-300"
                arClassName="text-slate-200"
              />
            </div>

            <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 space-y-1">
              <p>Raccourcis : ← / → / Espace · Home / End · O plan · N notes · F plein écran · P pause · Q QR · R révéler</p>
              <p dir="rtl" lang="ar" className="font-arabic">
                اختصارات: ← / → / مسافة للتنقل · O الفهرس · N الملاحظات · F ملء الشاشة · P استراحة · Q رمز QR · R كشف التصحيح
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Secondary Tools & Dashboard Drawer */}
      {drawer === "tools" && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/55 backdrop-blur-[1px]">
          <div className="flex-1" onClick={() => setDrawer("none")} />
          <aside className="w-full max-w-xl bg-[#0B1220] border-l border-slate-800 h-full overflow-y-auto p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <BilingualBlock
                text={{
                  fr: "Tableau de bord & Outils atelier",
                  ar: "لوحة القيادة وأدوات الورشة",
                }}
                frClassName="text-base font-bold text-white"
                arClassName="text-xs font-bold text-teal-300"
              />
              <button
                type="button"
                onClick={() => setDrawer("none")}
                aria-label="Fermer les outils / إغلاق الأدوات"
                className="rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Live Attendance Metrics */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded-xl bg-[#111C33] p-3">
                <p className="text-[11px] text-slate-400">
                  En ligne · <span className="font-arabic">متصل</span>
                </p>
                <p className="text-xl font-bold text-white tabular-nums">
                  {active.connectedCount}
                </p>
              </div>
              <div className="rounded-xl bg-[#111C33] p-3">
                <p className="text-[11px] text-slate-400">
                  Inscrits · <span className="font-arabic">مسجل</span>
                </p>
                <p className="text-xl font-bold text-white tabular-nums">
                  {active.totalParticipants}
                </p>
              </div>
              <div className="rounded-xl bg-[#111C33] p-3">
                <p className="text-[11px] text-slate-400">
                  Taux · <span className="font-arabic">نسبة</span>
                </p>
                <p className="text-xl font-bold text-teal-400 tabular-nums">
                  {active.responseRate}%
                </p>
              </div>
            </div>

            {/* Quick Room Controls */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => sendControl({ demoMode: !active.state.demoMode })}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold cursor-pointer ${
                  active.state.demoMode
                    ? "border-amber-400 bg-amber-500/20 text-amber-200"
                    : "border-slate-700 bg-[#111C33] text-slate-200"
                }`}
              >
                <BilingualBlock
                  text={{
                    fr: "Mode Démo (secours salle)",
                    ar: "الوضع التجريبي (احتياط)",
                  }}
                  className="text-left"
                  arClassName="text-[11px] opacity-85"
                />
                <span>{active.state.demoMode ? "ACTIF" : "INACTIF"}</span>
              </button>

              <button
                type="button"
                onClick={() => sendControl({ showQrOverlay: !active.state.showQrOverlay })}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-700 bg-[#111C33] px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:border-teal-400 cursor-pointer"
              >
                <span className="inline-flex items-center gap-2 text-left">
                  <QrCode className="h-4 w-4 text-teal-300 shrink-0" />
                  <BilingualBlock
                    text={{
                      fr: "Afficher QR sur /screen",
                      ar: "عرض رمز QR على الشاشة",
                    }}
                    arClassName="text-[11px] opacity-85"
                  />
                </span>
                <span>{active.state.showQrOverlay ? "OUI · نعم" : "NON · لا"}</span>
              </button>

              <button
                type="button"
                onClick={() => sendControl({ isPaused: !active.state.isPaused })}
                className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold cursor-pointer ${
                  active.state.isPaused
                    ? "bg-amber-500 text-slate-950"
                    : "border border-slate-700 bg-[#111C33] text-slate-200 hover:border-amber-400"
                }`}
              >
                {active.state.isPaused ? (
                  <>
                    <Play className="h-3.5 w-3.5 shrink-0" />
                    <BilingualInline
                      text={{ fr: "Reprendre l'atelier", ar: "استئناف الورشة" }}
                    />
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5 shrink-0" />
                    <BilingualInline
                      text={{ fr: "Mettre en pause", ar: "إيقاف مؤقت" }}
                    />
                  </>
                )}
              </button>
            </div>

            {/* Activity Breakdown */}
            <div className="rounded-xl bg-[#FAF8F4] p-4 text-slate-900 space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-bold">
                <BarChart3 className="h-4 w-4 text-teal-700 shrink-0" />
                <BilingualInline
                  text={{
                    fr: "Participation par activité (session active)",
                    ar: "نسبة المشاركة حسب كل نشاط",
                  }}
                />
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(active.activityCounts).map(([key, count]) => {
                  const act = getActivityByKey(key);
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                    >
                      {act ? (
                        <BilingualBlock
                          text={act.title}
                          frClassName="font-semibold text-slate-800"
                          arClassName="text-[11px] font-semibold text-teal-800"
                        />
                      ) : (
                        <span className="font-semibold text-slate-800">{key}</span>
                      )}
                      <span className="font-mono-code font-bold text-teal-800 shrink-0">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="rounded-xl bg-[#FAF8F4] p-4 text-slate-900 space-y-2.5">
              <h3 className="flex items-center gap-2 text-xs font-bold">
                <Users className="h-4 w-4 text-teal-700 shrink-0" />
                <BilingualInline
                  text={{
                    fr: "Dernières soumissions (anonymisées)",
                    ar: "آخر المشاركات المرسلة (مجهولة الهوية)",
                  }}
                />
              </h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {active.recentSubmissions.length > 0 ? (
                  active.recentSubmissions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
                    >
                      <span className="text-slate-800">{s.summary}</span>
                      {s.isCorrect !== null && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                            s.isCorrect
                              ? "bg-teal-100 text-teal-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {s.isCorrect ? "Correct · صحيح" : "À discuter · للنقاش"}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <BilingualBlock
                    text={{
                      fr: "Aucune soumission pour le moment dans ce mode.",
                      ar: "لا توجد مشاركات حالياً في هذا الوضع.",
                    }}
                    frClassName="text-xs text-slate-500"
                    arClassName="text-xs text-slate-500"
                  />
                )}
              </div>
            </div>

            <QrJoinPanel size={130} darkSurface showPinHint={resolvedPinHint} />

            {/* Purge Controls */}
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <BilingualInline
                  text={{
                    fr: "Protection des données après l'événement",
                    ar: "حماية المعطيات بعد انتهاء الورشة",
                  }}
                />
              </div>
              <BilingualBlock
                text={{
                  fr: "Supprime tous les noms affichés et réponses réelles des participants tout en conservant la structure et le Mode Démo intact.",
                  ar: "يمسح جميع الأسماء المعروضة وإجابات المشاركين الحقيقية مع الإبقاء على البنية والوضع التجريبي.",
                }}
                frClassName="text-xs text-slate-300"
                arClassName="text-xs text-amber-100"
              />
              <button
                type="button"
                onClick={() => setShowPurgeModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-500 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 shrink-0" />
                <BilingualInline
                  text={{
                    fr: "Supprimer les données des participants",
                    ar: "مسح معطيات المشاركين",
                  }}
                />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Confirmation Modal for Post-Workshop Purge */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form
            onSubmit={handlePurge}
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-white p-6 text-slate-900 space-y-4"
          >
            <BilingualBlock
              text={{
                fr: "Confirmer la suppression des données réelles",
                ar: "تأكيد مسح المعطيات الحقيقية للمشاركين",
              }}
              frClassName="text-lg font-bold text-slate-900"
              arClassName="text-base font-bold text-amber-800"
            />
            <BilingualBlock
              text={{
                fr: "Cette action efface définitivement les participants réels et leurs réponses pour cette session. Tapez SUPPRIMER pour confirmer.",
                ar: "يمسح هذا الإجراء نهائياً بيانات المشاركين الحقيقيين وإجاباتهم في هذه الجلسة. اكتبوا SUPPRIMER للتأكيد.",
              }}
              frClassName="text-xs text-slate-600"
              arClassName="text-xs text-slate-700"
            />
            <input
              type="text"
              required
              value={purgeText}
              onChange={(e) => setPurgeText(e.target.value)}
              placeholder="SUPPRIMER"
              dir="ltr"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono-code"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPurgeModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                <BilingualInline text={{ fr: "Annuler", ar: "إلغاء" }} />
              </button>
              <button
                type="submit"
                disabled={purgeText !== "SUPPRIMER" || purging}
                aria-busy={purging}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
              >
                {purging && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
                <BilingualInline
                  text={
                    purging
                      ? { fr: "Effacement...", ar: "جاري المسح..." }
                      : { fr: "Confirmer l'effacement", ar: "تأكيد المسح" }
                  }
                />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
