"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Lock,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Printer,
  QrCode,
} from "lucide-react";
import type {
  StudioSessionRecord,
} from "@/lib/studio/studio-store";
import type { StudioElementLiveAggregate } from "@/components/studio/elements/InteractiveWidgets";
import { PresentationViewport } from "@/components/slides/PresentationViewport";
import { DeckSlideStage } from "@/components/studio/elements/DeckSlideStage";
import { QrJoinPanel } from "@/components/ui/QrJoinPanel";
import { usePresentationFullscreen } from "@/lib/usePresentationFullscreen";

interface StudioLivePresenterShellProps {
  initialSession: StudioSessionRecord;
  initialAggregates: Record<string, StudioElementLiveAggregate>;
  initialAuthenticated: boolean;
}

export function StudioLivePresenterShell({
  initialSession,
  initialAggregates,
  initialAuthenticated,
}: StudioLivePresenterShellProps) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const [session, setSession] = useState<StudioSessionRecord>(initialSession);
  const [aggregates, setAggregates] = useState(initialAggregates);
  const [busy, setBusy] = useState(false);

  const fullscreenRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, isCssFullscreen, toggleFullscreen } =
    usePresentationFullscreen(fullscreenRef);

  const slides = session.frozenDocument.slides;
  const activeSlide = slides[session.currentSlideIndex] ?? slides[0];

  const refreshLive = useCallback(async () => {
    try {
      const res = await fetch(`/api/studio/live?sessionId=${encodeURIComponent(session.id)}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json.session) setSession(json.session);
      if (json.aggregates) setAggregates(json.aggregates);
    } catch {
      // ignore transient network errors
    }
  }, [session.id]);

  useEffect(() => {
    const id = window.setInterval(() => {
      void refreshLive();
    }, 2000);
    return () => window.clearInterval(id);
  }, [refreshLive]);

  async function patchControl(patch: Record<string, unknown>) {
    setBusy(true);
    try {
      const res = await fetch("/api/studio/live", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, ...patch }),
      });
      const json = await res.json();
      if (res.ok && json.session) {
        setSession(json.session);
      }
    } finally {
      setBusy(false);
    }
  }

  async function loginPresenter(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/presenter/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    const json = await res.json();
    if (!res.ok) {
      setLoginError(json.error ?? "Code invalide.");
      return;
    }
    setAuthenticated(true);
    void refreshLive();
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center p-6">
        <form
          onSubmit={loginPresenter}
          className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <Lock className="h-4 w-4" />
            <span>Session Studio Live · {session.title.fr}</span>
          </div>
          <p dir="rtl" lang="ar" className="font-arabic text-sm text-slate-300">
            أدخلوا رمز المنشط للتحكم في هذه الجلسة المباشرة: {session.title.ar}
          </p>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Code animateur"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white"
          />
          {loginError && <p className="text-xs font-bold text-rose-400">{loginError}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white"
          >
            Ouvrir la régie Live
          </button>
        </form>
      </main>
    );
  }

  return (
    <div
      ref={fullscreenRef}
      data-studio-live-presenter={session.id}
      className="h-screen w-screen overflow-hidden flex flex-col bg-[#0B1220] text-white"
    >
      <header className="shrink-0 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 bg-[#0F172A]">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={
              session.deckId
                ? `/studio/rooms/${encodeURIComponent(session.roomId)}/decks/${encodeURIComponent(session.deckId)}/edit`
                : "/studio"
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Éditeur</span>
          </Link>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">
              {session.title.fr} · PIN <span className="font-mono text-teal-300">{session.joinPin}</span>
            </p>
            <p dir="rtl" lang="ar" className="font-arabic text-xs text-slate-400 truncate">
              {session.title.ar} · الشريحة {session.currentSlideIndex + 1} / {slides.length}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy || session.currentSlideIndex <= 0}
            onClick={() => patchControl({ currentSlideIndex: session.currentSlideIndex - 1 })}
            data-live-prev="true"
            className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4 inline" /> Préc.
          </button>
          <button
            type="button"
            disabled={busy || session.currentSlideIndex >= slides.length - 1}
            onClick={() => patchControl({ currentSlideIndex: session.currentSlideIndex + 1 })}
            data-live-next="true"
            className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold disabled:opacity-40"
          >
            Suiv. <ChevronRight className="h-4 w-4 inline" />
          </button>

          <button
            type="button"
            onClick={() => patchControl({ showResults: !session.showResults })}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${
              session.showResults ? "bg-emerald-600 text-white" : "bg-white/10 text-slate-200"
            }`}
          >
            <Eye className="h-3.5 w-3.5 inline mr-1" />
            Résultats
          </button>

          <button
            type="button"
            onClick={() => patchControl({ showQrOverlay: !session.showQrOverlay })}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${
              session.showQrOverlay ? "bg-amber-500 text-[#0B1220]" : "bg-white/10 text-slate-200"
            }`}
          >
            <QrCode className="h-3.5 w-3.5 inline mr-1" />
            QR
          </button>

          <button
            type="button"
            onClick={() => patchControl({ isPaused: !session.isPaused })}
            className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold"
          >
            {session.isPaused ? <Play className="h-3.5 w-3.5 inline" /> : <Pause className="h-3.5 w-3.5 inline" />}
          </button>

          <Link
            href={`/screen?sessionId=${encodeURIComponent(session.id)}`}
            target="_blank"
            className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold hover:bg-white/20"
          >
            <ExternalLink className="h-3.5 w-3.5 inline mr-1" />
            Projecteur
          </Link>

          <Link
            href={`/join?sessionId=${encodeURIComponent(session.id)}`}
            target="_blank"
            className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold hover:bg-white/20"
          >
            /join
          </Link>

          {session.deckId && (
            <Link
              href={`/export/slides?deckId=${encodeURIComponent(session.deckId)}&mode=slides`}
              target="_blank"
              className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold hover:bg-white/20"
            >
              <Printer className="h-3.5 w-3.5 inline mr-1" />
              PDF
            </Link>
          )}

          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20"
            aria-label="Plein écran"
          >
            {isFullscreen || isCssFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
        <div className="flex-1 min-w-0 min-h-0 relative">
          <PresentationViewport className="h-full w-full">
            {activeSlide && (
              <DeckSlideStage
                slide={activeSlide}
                theme={session.frozenDocument.theme}
                mode="presenter"
                interactive={true}
                showResults={session.showResults}
                showQrOverlay={session.showQrOverlay}
                isPaused={session.isPaused}
                joinPath={`/join?sessionId=${encodeURIComponent(session.id)}`}
                pinHint={session.joinPin}
                liveAggregatesByElement={aggregates}
              />
            )}
          </PresentationViewport>
        </div>

        <aside className="w-full lg:w-80 shrink-0 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 flex flex-col gap-4 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Notes Formateur (FR / AR)
            </h3>
            <p className="mt-1.5 text-xs text-slate-200 leading-relaxed">
              {activeSlide?.notes.fr || "Aucune note française pour cette diapositive."}
            </p>
            <p dir="rtl" lang="ar" className="mt-2 font-arabic text-xs text-teal-200 leading-relaxed">
              {activeSlide?.notes.ar}
            </p>
            {activeSlide?.notes.darijaFr && (
              <p className="mt-2 rounded-lg bg-slate-800 px-2.5 py-1.5 text-[11px] text-amber-200">
                Darija : {activeSlide.notes.darijaFr}
              </p>
            )}
          </div>

          <QrJoinPanel
            size={140}
            darkSurface={true}
            showPinHint={session.joinPin}
            joinPath={`/join?sessionId=${encodeURIComponent(session.id)}`}
          />
        </aside>
      </div>
    </div>
  );
}
