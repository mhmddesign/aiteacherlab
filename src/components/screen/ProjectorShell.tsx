"use client";

import React, { useEffect, useState } from "react";
import { Maximize2, Minimize2, Radio, Users } from "lucide-react";
import type { PublicWorkshopSnapshot } from "@/content/types";
import { getSlideById, getSlideIndex, SLIDES, TOTAL_SECTIONS } from "@/content/slides";
import { useWorkshopSync } from "@/lib/realtime/client";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
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
  const progressPct = Math.round(((slideIdx + 1) / SLIDES.length) * 100);

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
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col">
      {/* Slim Projector Header */}
      <header className="no-print border-b border-slate-800/80 bg-[#0B1220]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-sm font-bold text-white">
              AI Teacher Lab · Mediouna ·{" "}
              <span dir="rtl" lang="ar" className="font-arabic text-teal-300">
                مديونة
              </span>
            </span>
            <span className="text-slate-600" aria-hidden="true">
              |
            </span>
            <span className="text-xs font-semibold text-slate-300 tabular-nums">
              Section {active.state.currentSection}/{TOTAL_SECTIONS} · Diapo {slideIdx + 1}/
              {SLIDES.length} ·{" "}
              <span dir="rtl" lang="ar" className="font-arabic text-teal-300">
                الشريحة {slideIdx + 1} / {SLIDES.length}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Users className="h-3.5 w-3.5 text-teal-400 shrink-0" />
              <span>
                {active.connectedCount} collègues en ligne ·{" "}
                <span dir="rtl" lang="ar" className="font-arabic text-teal-300">
                  {active.connectedCount} متصل(ة)
                </span>
              </span>
            </span>
            <ConnectionBadge
              mode={connectionMode}
              demoMode={active.state.demoMode}
              compact
            />
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:border-teal-400 cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <BilingualInline text={{ fr: "Quitter", ar: "إنهاء" }} />
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  <BilingualInline text={{ fr: "Plein écran", ar: "ملء الشاشة" }} />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="h-1 w-full bg-slate-900">
          <div
            className="h-full bg-teal-500 transition-all duration-200"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Main Projector Stage */}
      <main
        className={`mx-auto w-full max-w-7xl flex-1 px-6 py-6 relative ${
          active.state.showQrOverlay && slide.kind !== "welcome" ? "xl:pr-64" : ""
        }`}
      >
        {active.state.isPaused && (
          <div className="mb-5 flex items-center justify-center gap-3 rounded-xl border border-amber-500/50 bg-amber-500/15 px-6 py-3 text-base font-bold text-amber-200">
            <Radio className="h-5 w-5 shrink-0" />
            <BilingualBlock
              text={{
                fr: "Atelier en pause · Échange collectif en cours",
                ar: "الورشة في استراحة · نقاش جماعي جارٍ في القاعة",
              }}
            />
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

        {active.state.showQrOverlay && slide.kind !== "welcome" && (
          <div className="no-print fixed bottom-5 right-5 z-40 hidden xl:block w-56 shadow-2xl">
            <QrJoinPanel size={135} darkSurface />
          </div>
        )}
      </main>
    </div>
  );
}
