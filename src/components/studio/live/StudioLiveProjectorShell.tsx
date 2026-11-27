"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import type { StudioSessionRecord } from "@/lib/studio/studio-store";
import type { StudioElementLiveAggregate } from "@/components/studio/elements/InteractiveWidgets";
import { PresentationViewport } from "@/components/slides/PresentationViewport";
import { DeckSlideStage } from "@/components/studio/elements/DeckSlideStage";
import { QrJoinPanel } from "@/components/ui/QrJoinPanel";
import { usePresentationFullscreen } from "@/lib/usePresentationFullscreen";

interface StudioLiveProjectorShellProps {
  initialSession: StudioSessionRecord;
  initialAggregates: Record<string, StudioElementLiveAggregate>;
}

export function StudioLiveProjectorShell({
  initialSession,
  initialAggregates,
}: StudioLiveProjectorShellProps) {
  const [session, setSession] = useState(initialSession);
  const [aggregates, setAggregates] = useState(initialAggregates);
  const fullscreenRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, isCssFullscreen, toggleFullscreen } =
    usePresentationFullscreen(fullscreenRef);

  const slides = session.frozenDocument.slides;
  const activeSlide = slides[session.currentSlideIndex] ?? slides[0];

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/studio/live?sessionId=${encodeURIComponent(session.id)}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json.session) setSession(json.session);
      if (json.aggregates) setAggregates(json.aggregates);
    } catch {
      // ignore transient error
    }
  }, [session.id]);

  useEffect(() => {
    const id = window.setInterval(() => void refresh(), 2000);
    return () => window.clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.repeat && e.key.toLowerCase() === "f") {
        void toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleFullscreen]);

  return (
    <div
      ref={fullscreenRef}
      data-studio-live-projector={session.id}
      className="h-screen w-screen overflow-hidden flex flex-col bg-[#0B1220] text-white"
    >
      <div className="flex-1 min-h-0 flex gap-4 p-4">
        <div className="flex-1 min-w-0 min-h-0 relative">
          <PresentationViewport className="h-full w-full">
            {activeSlide && (
              <DeckSlideStage
                slide={activeSlide}
                theme={session.frozenDocument.theme}
                mode="projector"
                interactive={false}
                showResults={session.showResults}
                showQrOverlay={session.showQrOverlay}
                isPaused={session.isPaused}
                joinPath={`/join?sessionId=${encodeURIComponent(session.id)}`}
                liveAggregatesByElement={aggregates}
              />
            )}
          </PresentationViewport>

          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label="Plein écran"
            className="absolute top-3 right-3 z-40 rounded-xl bg-black/55 p-2 text-white hover:bg-black/80"
          >
            {isFullscreen || isCssFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </button>
        </div>

        {session.showQrOverlay && (
          <aside className="hidden lg:flex w-72 shrink-0 flex-col justify-center">
            <QrJoinPanel
              size={180}
              darkSurface={true}
              joinPath={`/join?sessionId=${encodeURIComponent(session.id)}`}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
