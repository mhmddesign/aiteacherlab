"use client";

import React, { useEffect, useState } from "react";
import { Maximize2, Minimize2, Radio, Users } from "lucide-react";
import type { PublicWorkshopSnapshot } from "@/content/types";
import { getSlideById, getSlideIndex, SLIDES, TOTAL_SECTIONS } from "@/content/slides";
import { useWorkshopSync } from "@/lib/realtime/client";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import { ConnectionBadge } from "@/components/ui/ConnectionBadge";
import { QrJoinPanel } from "@/components/ui/QrJoinPanel";

interface ProjectorShellProps {
  initialSnapshot: PublicWorkshopSnapshot;
}

export function ProjectorShell({ initialSnapshot }: ProjectorShellProps) {
  const { snapshot, connectionMode } = useWorkshopSync({
    mode: "public",
    initialSnapshot,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const active = snapshot ?? initialSnapshot;
  const slide = getSlideById(active.state.currentSlideId);
  const slideIdx = getSlideIndex(slide.id);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => undefined);
    } else {
      await document.exitFullscreen().catch(() => undefined);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1426] text-white flex flex-col">
      {/* Projector Top Bar */}
      <header className="no-print border-b border-slate-800/80 bg-[#0B1426] px-6 py-3.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              AI Teacher Lab · Mediouna
            </span>
            <span className="text-sm font-semibold text-slate-300">
              Section {active.state.currentSection} / {TOTAL_SECTIONS} · Diapo {slideIdx + 1} /{" "}
              {SLIDES.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-navy-800 px-3.5 py-1.5 text-xs font-bold text-slate-100">
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              {active.connectedCount} collègues en ligne
            </span>
            <ConnectionBadge
              mode={connectionMode}
              demoMode={active.state.demoMode}
              compact
            />
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-navy-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-400 cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span>Quitter</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Plein écran</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section Progress Strip */}
        <div className="mx-auto mt-3 max-w-7xl">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${Math.round(((slideIdx + 1) / SLIDES.length) * 100)}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Projector Stage */}
      <main
        className={`mx-auto w-full max-w-7xl flex-1 px-6 py-6 relative ${
          active.state.showQrOverlay && slide.kind !== "welcome" ? "xl:pr-60" : ""
        }`}
      >
        {active.state.isPaused && (
          <div className="mb-5 flex items-center justify-center gap-3 rounded-2xl border border-amber-400 bg-amber-500/15 px-6 py-3 text-base font-bold text-amber-200">
            <Radio className="h-5 w-5" />
            <span>Atelier en pause · Échange collectif en cours</span>
          </div>
        )}

        <SlideRenderer
          slide={slide}
          mode="projector"
          activityStatus={active.state.activityStatus}
          showResults={active.state.showResults}
          showQrOverlay={active.state.showQrOverlay}
          isPaused={active.state.isPaused}
          aggregate={active.aggregate}
          connectedCount={active.connectedCount}
          totalParticipants={active.totalParticipants}
        />

        {/* Floating QR corner overlay when toggled by Presenter (outside welcome slide which already shows QR) */}
        {active.state.showQrOverlay && slide.kind !== "welcome" && (
          <div className="no-print fixed bottom-5 right-5 z-40 hidden xl:block w-56 shadow-2xl">
            <QrJoinPanel size={135} darkSurface />
          </div>
        )}
      </main>
    </div>
  );
}
