"use client";

import React, { useCallback, useEffect, useState } from "react";
import { LogOut, PauseCircle, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import type { ParticipantResponseItem, PublicWorkshopSnapshot } from "@/content/types";
import { getSlideById, TOTAL_SECTIONS } from "@/content/slides";
import { useWorkshopSync } from "@/lib/realtime/client";
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

  const { snapshot, connectionMode, error, refresh } = useWorkshopSync({
    mode: "public",
    initialSnapshot,
    enabled: Boolean(participant),
  });

  const activeSnapshot = snapshot ?? initialSnapshot;
  const slide = getSlideById(activeSnapshot.state.currentSlideId);

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

  useEffect(() => {
    if (!participant) return;
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
  }, [
    participant,
    activeSnapshot.state.activeActivityKey,
    activeSnapshot.state.activityStatus,
    activeSnapshot.state.stateVersion,
  ]);

  useEffect(() => {
    if (!participant) return;
    const id = setInterval(() => {
      void fetch("/api/participant/heartbeat", { method: "POST" }).catch(() => undefined);
    }, 30000);
    return () => clearInterval(id);
  }, [participant]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
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
    await fetch("/api/participant/leave", { method: "POST" });
    setParticipant(null);
    setMyResponses([]);
  };

  if (!participant) {
    return (
      <div className="min-h-screen bg-[#0B1426] px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
              <Smartphone className="h-3.5 w-3.5 shrink-0" />
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
              arClassName="text-xl font-bold text-teal-800"
            />
            <BilingualBlock
              text={{
                fr: "Saisissez le code PIN communiqué dans la salle et votre prénom ou nom affiché. Aucun compte ni mot de passe requis.",
                ar: "أدخلوا رمز PIN المعلن في القاعة واسمكم المعروض. لا حاجة لأي حساب أو كلمة سر.",
              }}
              frClassName="text-xs sm:text-sm text-slate-600"
              arClassName="text-xs sm:text-sm text-slate-700"
            />
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <label className="block text-xs font-bold text-slate-700">
              <BilingualInline
                text={{
                  fr: "Code PIN de l'atelier",
                  ar: "رمز PIN للورشة",
                }}
              />
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="Ex. : 202604"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                dir="ltr"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono-code text-base tracking-widest text-slate-900 focus:border-teal-600 focus:outline-none"
              />
            </label>

            <label className="block text-xs font-bold text-slate-700">
              <BilingualInline
                text={{
                  fr: "Votre prénom ou nom affiché",
                  ar: "اسمكم الشخصي أو المعروض",
                }}
              />
              <input
                type="text"
                required
                minLength={2}
                maxLength={40}
                placeholder="Ex. : Khadija B. / خديجة ب."
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
              />
            </label>

            {joinError && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs font-semibold text-amber-900">
                {joinError}
              </div>
            )}

            <button
              type="submit"
              disabled={joining}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 shrink-0" />
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

          <div className="flex items-start gap-2 rounded-xl bg-ivory-100 p-3 text-[11px] text-slate-600">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
            <BilingualBlock
              text={{
                fr: "Aucune donnée d'élève, adresse e-mail ou numéro de téléphone n'est collecté.",
                ar: "لا يتم جمع أي معطيات للتلاميذ أو بريد إلكتروني أو رقم هاتف.",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1426] pb-12">
      <header className="no-print sticky top-0 z-30 border-b border-slate-800 bg-[#0B1426]/95 backdrop-blur px-4 py-3 text-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
              Section {activeSnapshot.state.currentSection} / {TOTAL_SECTIONS} ·{" "}
              <span dir="rtl" lang="ar" className="font-arabic">
                القسم {activeSnapshot.state.currentSection} / {TOTAL_SECTIONS}
              </span>{" "}
              · Connecté(e) : {participant.displayName}
            </p>
            <h1 className="font-display text-base font-bold">
              AI Teacher Lab · Mediouna ·{" "}
              <span dir="rtl" lang="ar" className="font-arabic text-sm text-cyan-200">
                مختبر المعلم
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <ConnectionBadge
              mode={connectionMode}
              demoMode={activeSnapshot.state.demoMode}
              compact
            />
            <button
              type="button"
              onClick={handleLeave}
              title="Quitter la session / مغادرة الجلسة"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                <BilingualInline text={{ fr: "Quitter", ar: "خروج" }} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 sm:px-5 pt-5 space-y-4">
        {error && (
          <div className="rounded-xl border border-amber-400/50 bg-amber-500/15 px-4 py-2.5 text-xs font-medium text-amber-100">
            {error}
          </div>
        )}

        {activeSnapshot.state.isPaused && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-400 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950">
            <PauseCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <BilingualBlock
              text={{
                fr: "Pause atelier : l'animateur a momentanément suspendu les soumissions. Échangeons en salle !",
                ar: "استراحة في الورشة: تم تعليق الإرسالات مؤقتاً من طرف المنشط لنتبادل النقاش في القاعة.",
              }}
            />
          </div>
        )}

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
          onSubmitted={refreshMe}
        />
      </main>
    </div>
  );
}
