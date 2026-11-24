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
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
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
      setLoginError(data.error ?? "Accès refusé. / تم رفض الولوج.");
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
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-cyan-300">
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
                fr: "Console de pilotage · Mediouna",
                ar: "لوحة القيادة والتحكم · مديونة",
              }}
              frClassName="font-display text-2xl font-bold text-navy-900"
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
              <BilingualInline
                text={{
                  fr: "Ouvrir le poste de contrôle",
                  ar: "فتح مركز التحكم",
                }}
              />
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
              AI Teacher Lab · Animateur ·{" "}
              <span dir="rtl" lang="ar" className="font-arabic text-sm text-cyan-200">
                المنشط
              </span>
            </span>
            <ConnectionBadge mode={connectionMode} demoMode={active.state.demoMode} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-slate-700 bg-navy-800 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("presentation")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
                  viewMode === "presentation" ? "bg-teal-600 text-white" : "text-slate-300"
                }`}
              >
                <Presentation className="h-3.5 w-3.5 shrink-0" />
                <BilingualInline text={{ fr: "Présentation", ar: "العرض" }} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("dashboard")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
                  viewMode === "dashboard" ? "bg-teal-600 text-white" : "text-slate-300"
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                <BilingualInline text={{ fr: "Tableau de bord", ar: "لوحة القيادة" }} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-navy-800 px-3 py-1.5 text-xs">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-mono-code font-bold">{formatSeconds(displaySeconds)}</span>
              <span className="text-slate-400">/ 120:00</span>
              <button
                type="button"
                onClick={() =>
                  sendControl({ timerAction: active.state.timerRunning ? "pause" : "start" })
                }
                className="ml-1 rounded bg-slate-700 px-2 py-0.5 text-[11px] hover:bg-teal-600 cursor-pointer"
              >
                {active.state.timerRunning ? "Pause · إيقاف" : "Démarrer · ابدأ"}
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
              <BilingualInline text={{ fr: "Ouvrir /screen", ar: "شاشة العرض" }} />
            </Link>

            <button
              type="button"
              onClick={() => document.documentElement.requestFullscreen().catch(() => undefined)}
              className="rounded-xl border border-slate-700 p-2 text-slate-300 hover:text-white cursor-pointer"
              title="Plein écran / ملء الشاشة"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-700 p-2 text-slate-300 hover:text-white cursor-pointer"
              title="Déconnexion / تسجيل الخروج"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Presenter Workspace */}
      <div className="mx-auto w-full max-w-[1440px] flex-1 grid gap-5 p-4 lg:grid-cols-12">
        {/* Left Navigation Rail */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-navy-800/80 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">
                Section {active.state.currentSection} / {TOTAL_SECTIONS} ·{" "}
                <span dir="rtl" lang="ar" className="font-arabic text-teal-300">
                  المحور {active.state.currentSection}
                </span>
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
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <BilingualInline text={{ fr: "Précédent", ar: "السابق" }} />
              </button>
              <button
                type="button"
                disabled={currentIdx === SLIDES.length - 1 || actionBusy}
                onClick={goNext}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-teal-600 py-2 text-xs font-bold text-white hover:bg-teal-500 disabled:opacity-40 cursor-pointer"
              >
                <BilingualInline text={{ fr: "Suivant", ar: "التالي" }} />
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
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
                    <BilingualBlock
                      text={sec.title}
                      className="min-w-0 flex-1"
                      frClassName="truncate"
                      arClassName={`truncate text-[11px] ${isCurrent ? "text-teal-50" : "text-cyan-200/80"}`}
                    />
                    <span className="ml-2 shrink-0 text-[10px] opacity-80">
                      {sec.timeRange.fr}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-700 pt-2.5 space-y-1">
              <p className="text-[11px] font-bold uppercase text-slate-400">
                Diapositives · <span className="font-arabic">شرائح المحور</span>
              </p>
              {SLIDES.filter((s) => s.sectionNumber === active.state.currentSection).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => sendControl({ currentSlideId: s.id })}
                  className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-xs cursor-pointer ${
                    s.id === currentSlide.id
                      ? "bg-cyan-500/20 font-bold text-cyan-200 border border-cyan-500/40"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <BilingualBlock
                    text={s.title}
                    frClassName="truncate"
                    arClassName="truncate text-[11px] opacity-90"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Live Attendance & Mode Switch */}
          <div className="rounded-2xl border border-slate-800 bg-navy-800/80 p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-navy-900 p-2.5">
                <p className="text-[10px] text-slate-400">
                  En ligne · <span className="font-arabic">متصل</span>
                </p>
                <p className="text-lg font-bold text-cyan-300">{active.connectedCount}</p>
              </div>
              <div className="rounded-xl bg-navy-900 p-2.5">
                <p className="text-[10px] text-slate-400">
                  Inscrits · <span className="font-arabic">مسجل</span>
                </p>
                <p className="text-lg font-bold text-white">{active.totalParticipants}</p>
              </div>
              <div className="rounded-xl bg-navy-900 p-2.5">
                <p className="text-[10px] text-slate-400">
                  Taux · <span className="font-arabic">نسبة</span>
                </p>
                <p className="text-lg font-bold text-teal-400">{active.responseRate}%</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => sendControl({ demoMode: !active.state.demoMode })}
              className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                active.state.demoMode
                  ? "border-amber-400 bg-amber-500/20 text-amber-200"
                  : "border-slate-700 bg-navy-900 text-slate-200"
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
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-700 bg-navy-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400 cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5 text-left">
                <QrCode className="h-3.5 w-3.5 text-cyan-300 shrink-0" />
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
              className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer ${
                active.state.isPaused
                  ? "bg-amber-500 text-slate-950"
                  : "border border-slate-700 bg-navy-900 text-slate-200 hover:border-amber-400"
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
        </aside>

        {/* Center Main Stage */}
        <section className="lg:col-span-6 space-y-4">
          {activeActivityDef && (
            <div className="rounded-2xl border border-teal-500/40 bg-navy-800 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase text-cyan-300">
                    Activité synchronisée · نشاط متزامن
                  </span>
                  <BilingualBlock
                    text={activeActivityDef.title}
                    frClassName="text-xs font-bold text-white"
                    arClassName="text-xs font-bold text-cyan-200"
                  />
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Statut / الحالة :{" "}
                    <strong className="text-white uppercase">{active.state.activityStatus}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => sendControl({ activityStatus: "open" })}
                    className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-500 cursor-pointer"
                  >
                    <BilingualInline text={{ fr: "Ouvrir / Rouvrir", ar: "فتح / إعادة فتح" }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => sendControl({ activityStatus: "closed", showResults: true })}
                    className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-600 cursor-pointer"
                  >
                    <BilingualInline text={{ fr: "Fermer", ar: "إغلاق" }} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      sendControl({ showResults: !active.state.showResults })
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/50 px-3 py-1.5 text-xs font-bold text-cyan-200 cursor-pointer"
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
                      onClick={() =>
                        sendControl({ activityStatus: "revealed", showResults: true })
                      }
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-500 cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <BilingualInline text={{ fr: "Révéler réponses", ar: "كشف الإجابات" }} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetActivity}
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 px-2.5 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/20 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                    <BilingualInline text={{ fr: "Réinitialiser", ar: "إعادة ضبط" }} />
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
                  <BarChart3 className="h-4 w-4 text-teal-700 shrink-0" />
                  <BilingualInline
                    text={{
                      fr: "Participation par activité (session active)",
                      ar: "نسبة المشاركة حسب كل نشاط",
                    }}
                  />
                </h3>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {Object.entries(active.activityCounts).map(([key, count]) => {
                    const act = getActivityByKey(key);
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-ivory-50 px-3.5 py-2.5 text-xs"
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

              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                  <Users className="h-4 w-4 text-cyan-700 shrink-0" />
                  <BilingualInline
                    text={{
                      fr: "Dernières soumissions (anonymisées)",
                      ar: "آخر المشاركات المرسلة (مجهولة الهوية)",
                    }}
                  />
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

              <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-200">
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
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-500 cursor-pointer"
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
            </div>
          )}
        </section>

        {/* Right Bilingual Presenter Notes & QR Panel */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-navy-800/90 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <BilingualBlock
                text={{
                  fr: "Notes de l'animateur (Script)",
                  ar: "ملاحظات المنشط (نص التقديم)",
                }}
                frClassName="text-xs font-bold uppercase tracking-wider text-cyan-300"
                arClassName="text-xs font-bold text-teal-300"
              />
              <span className="rounded bg-navy-900 px-2 py-0.5 font-mono-code text-[11px] text-amber-300 shrink-0">
                {currentSlide.presenterNotes.durationCue}
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-200">
              <div className="rounded-xl bg-navy-900/90 p-3 border border-slate-700/70 space-y-2">
                <BilingualBlock
                  text={currentSlide.presenterNotes.script}
                  frClassName="text-slate-100"
                  arClassName="text-cyan-100"
                />
              </div>

              <div>
                <p className="font-bold text-teal-300 mb-1">
                  Exemple pratique · <span className="font-arabic">مثال تطبيقي</span> :
                </p>
                <BilingualBlock
                  text={currentSlide.presenterNotes.classroomExample}
                  frClassName="text-slate-300"
                  arClassName="text-slate-200"
                />
              </div>

              <div>
                <p className="font-bold text-amber-300 mb-1">
                  Discussion · <span className="font-arabic">سؤال للنقاش</span> :
                </p>
                <BilingualBlock
                  text={currentSlide.presenterNotes.discussionPrompt}
                  frClassName="text-slate-300"
                  arClassName="text-slate-200"
                />
              </div>

              <div>
                <p className="font-bold text-cyan-300 mb-1">
                  Transition · <span className="font-arabic">الانتقال</span> :
                </p>
                <BilingualBlock
                  text={currentSlide.presenterNotes.transition}
                  frClassName="text-slate-300"
                  arClassName="text-slate-200"
                />
              </div>
            </div>

            <div className="border-t border-slate-700 pt-2.5 text-[11px] text-slate-400 space-y-0.5">
              <p>Raccourcis : ← / → diapos · P pause · Q QR · R révéler</p>
              <p dir="rtl" lang="ar" className="font-arabic text-slate-400">
                اختصارات لوحة المفاتيح: ← / → للتنقل · P استراحة · Q رمز QR · R كشف التصحيح
              </p>
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
                disabled={purgeText !== "SUPPRIMER"}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
              >
                <BilingualInline
                  text={{ fr: "Confirmer l'effacement", ar: "تأكيد المسح" }}
                />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
