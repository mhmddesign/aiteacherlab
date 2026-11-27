"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  LogOut,
  MonitorPlay,
  PauseCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { ParticipantResponseItem, PublicWorkshopSnapshot } from "@/content/types";
import { getSlideById, TOTAL_SECTIONS } from "@/content/slides";
import { useWorkshopSync } from "@/lib/realtime/client";
import { PresentationViewport } from "@/components/slides/PresentationViewport";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
import { ConnectionBadge } from "@/components/ui/ConnectionBadge";

interface ParticipantShellProps {
  initialParticipant: { id: string; displayName: string } | null;
  initialSnapshot: PublicWorkshopSnapshot;
  initialResponses: ParticipantResponseItem[];
}

export function ParticipantShell({
  initialParticipant,
  initialSnapshot,
  initialResponses,
}: ParticipantShellProps) {
  const [participant, setParticipant] = useState(initialParticipant);
  const [myResponses, setMyResponses] = useState<ParticipantResponseItem[]>(initialResponses);
  const [pin, setPin] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showSlidePreview, setShowSlidePreview] = useState(false);

  const { snapshot, connectionMode, error, refresh } = useWorkshopSync({
    mode: "public",
    initialSnapshot,
    enabled: Boolean(participant),
  });

  const activeSnapshot = snapshot ?? initialSnapshot;
  const slide = getSlideById(activeSnapshot.state.currentSlideId);
  const participantId = participant?.id ?? null;
  const activeActivityKey = activeSnapshot.state.activeActivityKey;
  const isActivityRevealed = activeSnapshot.state.activityStatus === "revealed";
  const lastFetchedKeyRef = useRef<string | null>(null);

  const refreshMe = useCallback(async () => {
    try {
      const res = await fetch("/api/participant/me", { cache: "no-store" });
      if (res.status === 401) {
        setParticipant(null);
        setMyResponses([]);
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      if (data.myResponses) setMyResponses(data.myResponses);
      await refresh();
    } catch {
      // Handled gracefully by connection banner
    }
  }, [refresh]);

  const handleResponseSaved = useCallback(
    (saved?: ParticipantResponseItem) => {
      if (saved) {
        setMyResponses((prev) => [
          ...prev.filter((item) => item.itemKey !== saved.itemKey),
          saved,
        ]);
        return;
      }
      void refreshMe();
    },
    [refreshMe]
  );

  // Only refetch /api/participant/me when switching activity or revealing grading (0 refetches on ordinary votes!)
  useEffect(() => {
    if (!participantId) {
      lastFetchedKeyRef.current = null;
      return;
    }
    const fetchSig = `${participantId}:${activeActivityKey ?? "none"}:${isActivityRevealed}`;
    if (lastFetchedKeyRef.current === fetchSig) return;
    lastFetchedKeyRef.current = fetchSig;

    let active = true;
    fetch("/api/participant/me", { cache: "no-store" })
      .then(async (res) => {
        if (!active) return;
        if (res.status === 401) {
          setParticipant(null);
          setMyResponses([]);
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        if (active && data.myResponses) {
          setMyResponses(data.myResponses);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [participantId, activeActivityKey, isActivityRevealed]);

  useEffect(() => {
    if (!participant) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        void fetch("/api/participant/heartbeat", { method: "POST" }).catch(() => undefined);
      }
    }, 30_000);
    return () => clearInterval(id);
  }, [participant]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joining) return;
    setJoinError(null);
    setJoining(true);
    try {
      const res = await fetch("/api/participant/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, displayName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setJoinError(
          data.error ??
            "Impossible de rejoindre l'atelier. / تعذر الانضمام إلى الورشة."
        );
        return;
      }
      setParticipant(data.participant);
      await refreshMe();
    } catch {
      setJoinError(
        "Erreur réseau. Vérifiez votre connexion Wi-Fi. / خطأ في الشبكة، تحققوا من الاتصال."
      );
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (leaving) return;
    setLeaving(true);
    try {
      await fetch("/api/participant/leave", { method: "POST" });
      setParticipant(null);
      setMyResponses([]);
    } finally {
      setLeaving(false);
    }
  };

  if (!participant) {
    return (
      <main
        data-surface="light"
        className="min-h-[100dvh] bg-navy-950 safe-top safe-bottom px-4 py-8 flex items-center justify-center"
      >
        <div className="w-full max-w-md rounded-2xl border border-ivory-200 bg-ivory-50 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="space-y-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-700/20 bg-ivory-100 px-3 py-1 text-xs font-bold text-teal-700">
              <Smartphone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <BilingualInline
                text={{
                  fr: "Atelier Provincial de Mediouna",
                  ar: "الورشة الإقليمية بمديونة",
                }}
              />
            </span>
            <BilingualBlock
              text={{
                fr: "Rejoindre AI Teacher Lab",
                ar: "الانضمام إلى مختبر المعلم",
              }}
              frClassName="font-display text-2xl font-bold text-navy-900"
              arClassName="text-xl font-bold text-teal-700"
            />
            <BilingualBlock
              text={{
                fr: "Saisissez le code PIN communiqué dans la salle et votre prénom affiché. Aucun compte requis.",
                ar: "أدخلوا رمز PIN المعلن في القاعة واسمكم المعروض. لا حاجة لأي حساب.",
              }}
              frClassName="text-sm text-slate-700 leading-relaxed"
              arClassName="text-sm text-slate-700 leading-relaxed"
            />
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="join-pin" className="block text-xs font-bold text-navy-900 mb-1.5">
                <BilingualInline
                  text={{
                    fr: "Code PIN de l'atelier",
                    ar: "رمز PIN للورشة",
                  }}
                />
              </label>
              <input
                id="join-pin"
                type="text"
                inputMode="numeric"
                required
                autoComplete="off"
                placeholder="Ex. : 482915"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                dir="ltr"
                className="w-full min-h-[48px] rounded-xl border border-slate-400 bg-white px-4 py-2.5 font-mono-code text-base tracking-widest text-navy-900 focus:border-teal-700 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="join-name" className="block text-xs font-bold text-navy-900 mb-1.5">
                <BilingualInline
                  text={{
                    fr: "Votre prénom ou nom affiché",
                    ar: "اسمكم الشخصي أو المعروض",
                  }}
                />
              </label>
              <input
                id="join-name"
                type="text"
                required
                minLength={2}
                maxLength={40}
                placeholder="Ex. : Khadija B. / خديجة ب."
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-slate-400 bg-white px-4 py-2.5 text-base text-navy-900 focus:border-teal-700 focus:outline-none"
              />
            </div>

            {joinError && (
              <div
                role="alert"
                className="rounded-xl border border-red-800/20 bg-status-error-bg px-3.5 py-2.5 text-xs font-semibold text-status-error"
              >
                {joinError}
              </div>
            )}

            <button
              type="submit"
              disabled={joining}
              aria-busy={joining}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white hover:bg-[#0D655E] disabled:opacity-75 cursor-pointer"
            >
              {joining ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              {joining ? (
                <span>Connexion... · جاري الدخول...</span>
              ) : (
                <BilingualInline
                  text={{
                    fr: "Entrer dans l'atelier",
                    ar: "الدخول إلى الورشة",
                  }}
                />
              )}
            </button>
          </form>

          <div className="flex items-start gap-2.5 rounded-xl bg-ivory-100 p-3 text-xs text-slate-600">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
            <BilingualBlock
              text={{
                fr: "Aucune donnée d'élève, adresse e-mail ou numéro de téléphone n'est collecté.",
                ar: "لا يتم جمع أي معطيات للتلاميذ أو بريد إلكتروني أو رقم هاتف.",
              }}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-[#060B16] safe-bottom pb-10">
      {/* Compact Single-Row Mobile-First Sticky Header (zero multi-row bloat) */}
      <header className="no-print safe-top sticky top-0 z-30 border-b border-slate-800/90 bg-[#0B1220]/95 backdrop-blur-md text-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-2 px-3 sm:px-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 truncate">
              <span className="tabular-nums shrink-0">
                {activeSnapshot.state.currentSection}/{TOTAL_SECTIONS}
              </span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span className="truncate">Connecté(e) : {participant.displayName}</span>
            </div>
            <h1 className="truncate font-display text-sm sm:text-base font-bold leading-tight">
              AI Teacher Lab{" "}
              <span dir="rtl" lang="ar" className="font-arabic text-xs sm:text-sm text-teal-300">
                · مختبر المعلم
              </span>
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden md:flex">
              <ConnectionBadge
                mode={connectionMode}
                demoMode={activeSnapshot.state.demoMode}
                compact
              />
            </div>

            <button
              type="button"
              onClick={() => setShowSlidePreview((s) => !s)}
              aria-pressed={showSlidePreview}
              aria-label="Aperçu 16:9 / معاينة الشريحة"
              className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap ${
                showSlidePreview
                  ? "border-teal-400 bg-teal-600 text-white"
                  : "border-slate-700 bg-[#111C33] text-slate-200 hover:border-teal-400"
              }`}
            >
              <MonitorPlay className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">
                <BilingualInline text={{ fr: "Aperçu 16:9", ar: "معاينة" }} />
              </span>
              <span className="sm:hidden text-[11px]">16:9</span>
            </button>

            <button
              type="button"
              disabled={leaving}
              aria-busy={leaving}
              onClick={handleLeave}
              aria-label="Quitter la session / مغادرة الجلسة"
              title="Quitter la session / مغادرة الجلسة"
              className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-[#111C33] px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 disabled:opacity-60 cursor-pointer"
            >
              {leaving ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                <BilingualInline
                  text={{
                    fr: leaving ? "Sortie..." : "Quitter",
                    ar: leaving ? "خروج..." : "خروج",
                  }}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile-only ultra-slim status strip (fixed 28px height, zero shift!) */}
        <div className="flex md:hidden items-center justify-between border-t border-slate-800/70 bg-[#060B16]/80 px-3 py-1">
          <ConnectionBadge
            mode={connectionMode}
            demoMode={activeSnapshot.state.demoMode}
            compact
          />
        </div>
      </header>

      <main data-surface="light" className="mx-auto max-w-4xl px-3 sm:px-5 pt-4 space-y-4">
        {error && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl border border-amber-800/20 bg-status-warning-bg px-4 py-2.5 text-xs font-semibold text-status-warning"
          >
            {error}
          </div>
        )}

        {activeSnapshot.state.isPaused && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-800/20 bg-status-warning-bg px-4 py-3 text-sm font-semibold text-status-warning">
            <PauseCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <BilingualBlock
              text={{
                fr: "Pause atelier : l'animateur a momentanément suspendu les soumissions. Échangeons en salle !",
                ar: "استراحة في الورشة: تم تعليق الإرسالات مؤقتاً من طرف المنشط لنتبادل النقاش في القاعة.",
              }}
            />
          </div>
        )}

        {showSlidePreview && (
          <div
            data-participant-slide-preview="true"
            className="animate-stage-enter w-full aspect-video rounded-xl overflow-hidden border border-slate-700/80 bg-[#060B16] shadow-lg"
          >
            <PresentationViewport interactive={false} rounded={false}>
              <SlideRenderer
                slide={slide}
                mode="projector"
                activityStatus={activeSnapshot.state.activityStatus}
                showResults={activeSnapshot.state.showResults}
                showQrOverlay={false}
                isPaused={activeSnapshot.state.isPaused}
                aggregate={activeSnapshot.aggregate}
                connectedCount={activeSnapshot.connectedCount}
                totalParticipants={activeSnapshot.totalParticipants}
              />
            </PresentationViewport>
          </div>
        )}

        <div className="animate-stage-enter">
          <SlideRenderer
            slide={slide}
            mode="participant"
            activityStatus={activeSnapshot.state.activityStatus}
            showResults={activeSnapshot.state.showResults}
            showQrOverlay={activeSnapshot.state.showQrOverlay}
            isPaused={activeSnapshot.state.isPaused}
            aggregate={activeSnapshot.aggregate}
            connectedCount={activeSnapshot.connectedCount}
            totalParticipants={activeSnapshot.totalParticipants}
            myResponses={myResponses}
            participantName={participant.displayName}
            onSubmitted={handleResponseSaved}
          />
        </div>
      </main>
    </div>
  );
}
