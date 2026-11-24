"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  LayoutDashboard,
  Lock,
  LogOut,
  Maximize2,
  Pause,
  Play,
  Presentation,
  QrCode,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import { getActivityByKey } from "@/content/activities";
import {
  getSectionList,
  getSlideById,
  getSlideIndex,
  SLIDES,
  TOTAL_SECTIONS,
} from "@/content/slides";
import type { PresenterSnapshot } from "@/content/types";
import { useWorkshopSync } from "@/lib/realtime/client";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import { ConnectionBadge } from "@/components/ui/ConnectionBadge";
import { QrJoinPanel } from "@/components/ui/QrJoinPanel";

interface PresenterShellProps {
  initialAuthenticated: boolean;
  initialSnapshot: PresenterSnapshot | null;
  workshopPinHint: string;
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
  const [viewMode, setViewMode] = useState<"presentation" | "dashboard">("presentation");
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeText, setPurgeText] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const { snapshot, connectionMode, refresh } = useWorkshopSync({
    mode: "presenter",
    initialSnapshot,
    enabled: authenticated,
  });

  const active = (snapshot as PresenterSnapshot | null) ?? initialSnapshot;

  // Live ticking 120-minute timer (only updates interval tick)
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

  const sendControl = useCallback(
    async (patch: Record<string, unknown>) => {
      if (actionBusy) return;
      setActionBusy(true);
      try {
        const res = await fetch("/api/presenter/control", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (res.status === 401) {
          setAuthenticated(false);
          return;
        }
        await refresh();
      } finally {
        setActionBusy(false);
      }
    },
    [actionBusy, refresh]
  );

  const currentSlide = getSlideById(active?.state.currentSlideId);
  const currentIdx = getSlideIndex(currentSlide.id);

  const goPrev = useCallback(() => {
    if (currentIdx > 0) {
      void sendControl({ currentSlideId: SLIDES[currentIdx - 1].id });
    }
  }, [currentIdx, sendControl]);

  const goNext = useCallback(() => {
    if (currentIdx < SLIDES.length - 1) {
      void sendControl({ currentSlideId: SLIDES[currentIdx + 1].id });
    }
  }, [currentIdx, sendControl]);

  // Keyboard shortcuts for smooth live facilitation
  useEffect(() => {
    if (!authenticated) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key.toLowerCase() === "p" && active) {
        void sendControl({ isPaused: !active.state.isPaused });
      } else if (e.key.toLowerCase() === "q" && active) {
        void sendControl({ showQrOverlay: !active.state.showQrOverlay });
      } else if (e.key.toLowerCase() === "r" && active?.state.activeActivityKey) {
        void sendControl({ activityStatus: "revealed", showResults: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authenticated, active, goNext, goPrev, sendControl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/presenter/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoginError(data.error ?? "Accès refusé.");
      return;
    }
    setAuthenticated(true);
    await refresh();
  };

  const handleLogout = async () => {
    await fetch("/api/presenter/logout", { method: "POST" });
    setAuthenticated(false);
  };

  const handleResetActivity = async () => {
    if (!active?.state.activeActivityKey) return;
    setActionBusy(true);
    try {
      await fetch("/api/presenter/reset-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityKey: active.state.activeActivityKey }),
      });
      await refresh();
    } finally {
      setActionBusy(false);
    }
  };

  const handlePurge = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/presenter/participants", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation: purgeText }),
    });
    if (res.ok) {
      setShowPurgeModal(false);
      setPurgeText("");
      await refresh();
    }
  };

  if (!authenticated || !active) {
    return (
      <div className="min-h-screen bg-[#0B1426] px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-white p-8 shadow-2xl space-y-5">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-cyan-300">
              <Lock className="h-3.5 w-3.5" />
              Espace Animateur Protégé
            </span>
            <h1 className="font-display text-2xl font-bold text-navy-900">
              Console de pilotage · Mediouna
            </h1>
            <p className="text-xs text-slate-600">
              Réservé au facilitateur de l&apos;atelier. Ce code est distinct du PIN partagé avec les participants.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block text-xs font-bold text-slate-700">
              Code d&apos;accès animateur
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Saisissez FACILITATOR_PASSCODE"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
              />
            </label>
            {loginError && (
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-navy-900 px-4 py-3 text-sm font-bold text-white hover:bg-navy-800 cursor-pointer"
            >
              Ouvrir le poste de contrôle
            </button>
          </form>
        </div>
      </div>
    );
  }

  const sections = getSectionList();
  const activeActivityDef = getActivityByKey(active.state.activeActivityKey);

  return (
    <div className="min-h-screen bg-[#0B1426] text-white flex flex-col">
      {/* Top Control Header */}
      <header className="no-print border-b border-slate-800 bg-[#0B1426] px-4 py-3">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-base font-bold text-white">
              AI Teacher Lab · Animateur
            </span>
            <ConnectionBadge mode={connectionMode} demoMode={active.state.demoMode} />
          </div>

          {/* View Switcher + Timer + Projector Link */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-slate-700 bg-navy-800 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("presentation")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
                  viewMode === "presentation" ? "bg-teal-600 text-white" : "text-slate-300"
                }`}
              >
                <Presentation className="h-3.5 w-3.5" />
                Présentation
              </button>
              <button
                type="button"
                onClick={() => setViewMode("dashboard")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
                  viewMode === "dashboard" ? "bg-teal-600 text-white" : "text-slate-300"
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Tableau de bord
              </button>
            </div>

            {/* Live 120-min timer */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-navy-800 px-3 py-1.5 text-xs">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-mono-code font-bold">{formatSeconds(displaySeconds)}</span>
              <span className="text-slate-400">/ 120:00</span>
              <button
                type="button"
                onClick={() =>
                  sendControl({ timerAction: active.state.timerRunning ? "pause" : "start" })
                }
                className="ml-1 rounded bg-slate-700 px-1.5 py-0.5 text-[11px] hover:bg-teal-600 cursor-pointer"
              >
                {active.state.timerRunning ? "Pause" : "Démarrer"}
              </button>
              <button
                type="button"
                onClick={() => sendControl({ timerAction: "reset" })}
                className="rounded bg-slate-700 px-1.5 py-0.5 text-[11px] hover:bg-slate-600 cursor-pointer"
              >
                00:00
              </button>
            </div>

            <Link
              href="/screen"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-200 hover:bg-cyan-500/20"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ouvrir /screen
            </Link>

            <button
              type="button"
              onClick={() => document.documentElement.requestFullscreen().catch(() => undefined)}
              className="rounded-xl border border-slate-700 p-2 text-slate-300 hover:text-white cursor-pointer"
              title="Plein écran"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-700 p-2 text-slate-300 hover:text-white cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Presenter Workspace */}
      <div className="mx-auto w-full max-w-[1440px] flex-1 grid gap-5 p-4 lg:grid-cols-12">
        {/* Left Navigation Rail (12 Sections) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-navy-800/80 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">
                Section {active.state.currentSection} / {TOTAL_SECTIONS}
              </span>
              <span className="text-cyan-300">
                Diapo {currentIdx + 1}/{SLIDES.length}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentIdx === 0 || actionBusy}
                onClick={goPrev}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-700 bg-navy-900 py-2 text-xs font-bold hover:border-cyan-400 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </button>
              <button
                type="button"
                disabled={currentIdx === SLIDES.length - 1 || actionBusy}
                onClick={goNext}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-teal-600 py-2 text-xs font-bold text-white hover:bg-teal-500 disabled:opacity-40 cursor-pointer"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
              {sections.map((sec) => {
                const isCurrent = sec.sectionNumber === active.state.currentSection;
                return (
                  <button
                    key={sec.sectionNumber}
                    type="button"
                    onClick={() => sendControl({ currentSlideId: sec.firstSlideId })}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition cursor-pointer ${
                      isCurrent
                        ? "bg-teal-600 font-bold text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span className="truncate">{sec.title}</span>
                    <span className="ml-2 shrink-0 text-[10px] opacity-80">{sec.timeRange}</span>
                  </button>
                );
              })}
            </div>

            {/* Slides inside current section */}
            <div className="border-t border-slate-700 pt-2.5 space-y-1">
              <p className="text-[11px] font-bold uppercase text-slate-400">
                Diapositives de la section
              </p>
              {SLIDES.filter((s) => s.sectionNumber === active.state.currentSection).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => sendControl({ currentSlideId: s.id })}
                  className={`block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-xs cursor-pointer ${
                    s.id === currentSlide.id
                      ? "bg-cyan-500/20 font-bold text-cyan-200 border border-cyan-500/40"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Live Attendance & Mode Switch */}
          <div className="rounded-2xl border border-slate-800 bg-navy-800/80 p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-navy-900 p-2.5">
                <p className="text-[10px] text-slate-400">En ligne</p>
                <p className="text-lg font-bold text-cyan-300">{active.connectedCount}</p>
              </div>
              <div className="rounded-xl bg-navy-900 p-2.5">
                <p className="text-[10px] text-slate-400">Inscrits</p>
                <p className="text-lg font-bold text-white">{active.totalParticipants}</p>
              </div>
              <div className="rounded-xl bg-navy-900 p-2.5">
                <p className="text-[10px] text-slate-400">Taux rép.</p>
                <p className="text-lg font-bold text-teal-400">{active.responseRate}%</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => sendControl({ demoMode: !active.state.demoMode })}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                active.state.demoMode
                  ? "border-amber-400 bg-amber-500/20 text-amber-200"
                  : "border-slate-700 bg-navy-900 text-slate-200"
              }`}
            >
              <span>Mode Démo (secours salle)</span>
              <span>{active.state.demoMode ? "ACTIF" : "INACTIF"}</span>
            </button>

            <button
              type="button"
              onClick={() => sendControl({ showQrOverlay: !active.state.showQrOverlay })}
              className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-navy-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400 cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5">
                <QrCode className="h-3.5 w-3.5 text-cyan-300" />
                Afficher QR sur /screen
              </span>
              <span>{active.state.showQrOverlay ? "OUI" : "NON"}</span>
            </button>

            <button
              type="button"
              onClick={() => sendControl({ isPaused: !active.state.isPaused })}
              className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer ${
                active.state.isPaused
                  ? "bg-amber-500 text-slate-950"
                  : "border border-slate-700 bg-navy-900 text-slate-200 hover:border-amber-400"
              }`}
            >
              {active.state.isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              <span>{active.state.isPaused ? "Reprendre l'atelier" : "Mettre en pause"}</span>
            </button>
          </div>
        </aside>

        {/* Center Main Stage */}
        <section className="lg:col-span-6 space-y-4">
          {/* Activity Control Bar */}
          {activeActivityDef && (
            <div className="rounded-2xl border border-teal-500/40 bg-navy-800 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase text-cyan-300">
                    Activité synchronisée : {activeActivityDef.title}
                  </span>
                  <p className="text-xs text-slate-300">
                    Statut : <strong className="text-white uppercase">{active.state.activityStatus}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => sendControl({ activityStatus: "open" })}
                    className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-500 cursor-pointer"
                  >
                    Ouvrir / Rouvrir
                  </button>
                  <button
                    type="button"
                    onClick={() => sendControl({ activityStatus: "closed", showResults: true })}
                    className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-600 cursor-pointer"
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      sendControl({ showResults: !active.state.showResults })
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/50 px-3 py-1.5 text-xs font-bold text-cyan-200 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {active.state.showResults ? "Masquer résultats" : "Afficher résultats"}
                  </button>
                  {(activeActivityDef.type === "mcq_quiz" ||
                    activeActivityDef.type === "tf_quiz") && (
                    <button
                      type="button"
                      onClick={() =>
                        sendControl({ activityStatus: "revealed", showResults: true })
                      }
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-500 cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Révéler réponses
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetActivity}
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 px-2.5 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/20 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          )}

          {viewMode === "presentation" ? (
            <SlideRenderer
              slide={currentSlide}
              mode="presenter"
              activityStatus={active.state.activityStatus}
              showResults={active.state.showResults}
              showQrOverlay={active.state.showQrOverlay}
              isPaused={active.state.isPaused}
              aggregate={active.aggregate}
              connectedCount={active.connectedCount}
              totalParticipants={active.totalParticipants}
              joinPinHint={workshopPinHint}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                  <BarChart3 className="h-4 w-4 text-teal-700" />
                  Participation par activité (session active)
                </h3>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {Object.entries(active.activityCounts).map(([key, count]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-ivory-50 px-3.5 py-2.5 text-xs"
                    >
                      <span className="font-semibold text-slate-800">
                        {getActivityByKey(key)?.title ?? key}
                      </span>
                      <span className="font-mono-code font-bold text-teal-800">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                  <Users className="h-4 w-4 text-cyan-700" />
                  Dernières soumissions (anonymisées)
                </h3>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {active.recentSubmissions.length > 0 ? (
                    active.recentSubmissions.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      >
                        <span className="text-slate-800">{s.summary}</span>
                        {s.isCorrect !== null && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              s.isCorrect
                                ? "bg-teal-100 text-teal-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {s.isCorrect ? "Correct" : "À discuter"}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">
                      Aucune soumission pour le moment dans ce mode.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-200">
                  <ShieldAlert className="h-4 w-4" />
                  Protection des données après l&apos;événement
                </div>
                <p className="text-xs text-slate-300">
                  Supprime tous les noms affichés et réponses réelles des participants tout en
                  conservant la structure et le Mode Démo intact.
                </p>
                <button
                  type="button"
                  onClick={() => setShowPurgeModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-500 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Supprimer les données des participants
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Right Presenter Notes & QR Panel */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-navy-800/90 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Notes de l&apos;animateur (Script)
              </h3>
              <span className="rounded bg-navy-900 px-2 py-0.5 font-mono-code text-[11px] text-amber-300">
                {currentSlide.presenterNotes.durationCue}
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-200">
              <p className="rounded-xl bg-navy-900/90 p-3 border border-slate-700/70">
                {currentSlide.presenterNotes.script}
              </p>

              <div>
                <p className="font-bold text-teal-300 mb-1">Exemple pratique à citer :</p>
                <p className="text-slate-300">{currentSlide.presenterNotes.classroomExample}</p>
              </div>

              <div>
                <p className="font-bold text-amber-300 mb-1">Transition :</p>
                <p className="text-slate-300">{currentSlide.presenterNotes.transition}</p>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-2.5 text-[11px] text-slate-400">
              Raccourcis clavier : ← / → diapos · P pause · Q QR · R révéler
            </div>
          </div>

          <QrJoinPanel size={135} darkSurface showPinHint={workshopPinHint} />
        </aside>
      </div>

      {/* Confirmation Modal for Post-Workshop Purge */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form
            onSubmit={handlePurge}
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-white p-6 text-slate-900 space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900">
              Confirmer la suppression des données réelles
            </h3>
            <p className="text-xs text-slate-600">
              Cette action efface définitivement les participants réels et leurs réponses pour cette
              session. Tapez <strong>SUPPRIMER</strong> pour confirmer.
            </p>
            <input
              type="text"
              required
              value={purgeText}
              onChange={(e) => setPurgeText(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono-code"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPurgeModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={purgeText !== "SUPPRIMER"}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
              >
                Confirmer l&apos;effacement
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
