"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PauseCircle, ShieldCheck } from "lucide-react";
import type { StudioSessionRecord } from "@/lib/studio/studio-store";
import type { StudioElementLiveAggregate } from "@/components/studio/elements/InteractiveWidgets";
import { DeckSlideStage } from "@/components/studio/elements/DeckSlideStage";
import { ElementRenderer } from "@/components/studio/elements/ElementRenderer";
import { PresentationViewport } from "@/components/slides/PresentationViewport";

const MOBILE_INTERACTIVE_TYPES = new Set([
  "live-poll",
  "mcq-quiz",
  "tf-quiz",
  "short-answer",
  "word-cloud",
  "flashcards",
  "matching",
  "ordering",
  "group-task",
  "exit-ticket",
]);

interface StudioLiveParticipantShellProps {
  initialSession: StudioSessionRecord;
  initialAggregates: Record<string, StudioElementLiveAggregate>;
}

export function StudioLiveParticipantShell({
  initialSession,
  initialAggregates,
}: StudioLiveParticipantShellProps) {
  const [session, setSession] = useState(initialSession);
  const [aggregates, setAggregates] = useState(initialAggregates);
  const [joined, setJoined] = useState(false);
  const [pin, setPin] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [participantKey] = useState(
    () => `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
  );
  const [joinError, setJoinError] = useState<string | null>(null);
  const [mySubmitted, setMySubmitted] = useState<Record<string, { optionId?: string; text?: string }>>({});

  const slides = session.frozenDocument.slides;
  const activeSlide = slides[session.currentSlideIndex] ?? slides[0];

  const pollSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/studio/live?sessionId=${encodeURIComponent(session.id)}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json.session) setSession(json.session);
      if (json.aggregates) setAggregates(json.aggregates);
    } catch {
      // ignore offline jitter
    }
  }, [session.id]);

  useEffect(() => {
    if (!joined) return;
    const id = window.setInterval(() => void pollSession(), 2000);
    return () => window.clearInterval(id);
  }, [joined, pollSession]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setJoinError(null);
    if (pin.trim().length < 4 || displayName.trim().length < 2) {
      setJoinError("Code PIN (4 chiffres) et prénom requis · رمز PIN والاسم مطلوبان");
      return;
    }
    const res = await fetch("/api/studio/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify",
        sessionId: session.id,
        pin: pin.trim(),
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setJoinError(json.error ?? "Code PIN incorrect · رمز PIN غير صحيح");
      return;
    }
    setJoined(true);
    void pollSession();
  }

  async function handleSubmitLive(
    elementId: string,
    payload: { optionId?: string; text?: string; activityType: string }
  ) {
    setJoinError(null);
    const res = await fetch("/api/studio/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session.id,
        slideId: activeSlide?.id ?? "slide-1",
        elementId,
        activityType: payload.activityType,
        pin: pin.trim(),
        participantKey,
        participantName: displayName.trim(),
        optionId: payload.optionId,
        text: payload.text,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      if (res.status === 403) {
        setJoined(false);
      }
      setJoinError(json.error ?? "Envoi impossible.");
      return;
    }
    setMySubmitted((prev) => ({
      ...prev,
      [elementId]: { optionId: payload.optionId, text: payload.text },
    }));
    if (json.aggregates) setAggregates(json.aggregates);
  }

  if (!joined) {
    return (
      <main
        data-studio-live-join={session.id}
        className="min-h-screen bg-[#FAF8F4] text-[#0B1220] flex items-center justify-center p-4"
      >
        <form
          onSubmit={handleJoin}
          className="w-full max-w-md rounded-2xl border border-[#E9E3D6] bg-white p-6 shadow-md space-y-4"
        >
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-bold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              Session Live · جلسة مباشرة
            </span>
            <h1 className="font-display text-xl font-bold pt-1">{session.title.fr}</h1>
            <p dir="rtl" lang="ar" className="font-arabic text-sm font-semibold text-teal-800">
              {session.title.ar}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1">Code PIN · رمز PIN</label>
              <input
                type="text"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="ex: 4829"
                data-live-pin-input="true"
                className="w-full rounded-xl border border-[#D9D0BE] px-3.5 py-2.5 font-mono text-base"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Votre prénom · الاسم</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="ex: Salma"
                data-live-name-input="true"
                className="w-full rounded-xl border border-[#D9D0BE] px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          {joinError && (
            <p className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-bold text-rose-800">
              {joinError}
            </p>
          )}

          <button
            type="submit"
            data-live-join-btn="true"
            className="w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white hover:bg-teal-800"
          >
            Rejoindre la session · الانضمام
          </button>
        </form>
      </main>
    );
  }

  return (
    <div
      data-studio-live-participant={session.id}
      className="min-h-screen bg-[#FAF8F4] text-[#0B1220] flex flex-col"
    >
      <header className="border-b border-[#E9E3D6] bg-white px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold truncate">{session.title.fr}</p>
          <p className="text-xs text-slate-600">
            Connecté : <strong>{displayName}</strong> · Slide {session.currentSlideIndex + 1}/
            {slides.length}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 text-emerald-900 px-3 py-1 text-xs font-bold">
          Synchronisé
        </span>
      </header>

      {joinError && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-xs font-bold text-rose-800">
          {joinError}
        </div>
      )}

      {session.isPaused ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
          <PauseCircle className="h-12 w-12 text-amber-600" />
          <p className="font-bold text-lg">Présentation en pause par le formateur</p>
          <p dir="rtl" lang="ar" className="font-arabic text-base text-teal-800">
            تم إيقاف العرض مؤقتاً من طرف المنشط
          </p>
        </div>
      ) : (
        <main className="flex-1 p-3 md:p-6 flex flex-col items-center justify-start gap-4">
          {activeSlide && (
            <>
              <div className="w-full max-w-2xl rounded-2xl border border-[#E9E3D6] bg-white p-4 shadow-xs space-y-1">
                <h1 className="font-display font-bold text-base text-[#0B1220]">
                  {activeSlide.title.fr}
                </h1>
                <p dir="rtl" lang="ar" className="font-arabic text-sm font-bold text-teal-800">
                  {activeSlide.title.ar}
                </p>
              </div>

              {activeSlide.elements
                .filter((el) => el.visible && MOBILE_INTERACTIVE_TYPES.has(el.type))
                .map((el) => (
                  <div
                    key={el.id}
                    className="w-full max-w-2xl rounded-2xl border border-[#E9E3D6] bg-white p-4 shadow-sm"
                  >
                    <ElementRenderer
                      element={el}
                      mode="participant"
                      interactive={true}
                      showResults={session.showResults}
                      joinPath={`/join?sessionId=${encodeURIComponent(session.id)}`}
                      aggregate={aggregates[el.id] ?? null}
                      myOptionId={mySubmitted[el.id]?.optionId ?? null}
                      myText={mySubmitted[el.id]?.text ?? null}
                      onSubmitLive={handleSubmitLive}
                    />
                  </div>
                ))}

              <details
                open={
                  activeSlide.elements.filter(
                    (el) => el.visible && MOBILE_INTERACTIVE_TYPES.has(el.type)
                  ).length === 0
                }
                className="w-full max-w-3xl rounded-2xl border border-[#E9E3D6] bg-white p-3"
              >
                <summary className="cursor-pointer text-xs font-bold text-teal-800">
                  Aperçu diapositive 16:9 · معاينة الشريحة
                </summary>
                <div className="mt-3 w-full aspect-video">
                  <PresentationViewport>
                    <DeckSlideStage
                      slide={activeSlide}
                      theme={session.frozenDocument.theme}
                      mode="projector"
                      interactive={false}
                      showResults={session.showResults}
                      joinPath={`/join?sessionId=${encodeURIComponent(session.id)}`}
                      liveAggregatesByElement={aggregates}
                    />
                  </PresentationViewport>
                </div>
              </details>
            </>
          )}
          {Object.keys(mySubmitted).length > 0 && (
            <p className="mt-1 text-xs font-bold text-teal-800">
              Participation enregistrée sur {Object.keys(mySubmitted).length} activité(s).
            </p>
          )}
        </main>
      )}
    </div>
  );
}
