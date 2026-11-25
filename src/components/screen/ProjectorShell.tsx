"use client";

import React, { useEffect, useRef } from "react";
import { Maximize2, Minimize2, Radio, Smartphone, Users } from "lucide-react";
import type { PublicWorkshopSnapshot } from "@/content/types";
import { getSlideById, getSlideIndex, SLIDES, TOTAL_SECTIONS } from "@/content/slides";
import { useWorkshopSync } from "@/lib/realtime/client";
import { usePresentationFullscreen } from "@/lib/usePresentationFullscreen";
import { PresentationViewport } from "@/components/slides/PresentationViewport";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import { BilingualInline } from "@/components/ui/Bilingual";
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
  const fullscreenWrapperRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, isCssFullscreen, toggleFullscreen } =
    usePresentationFullscreen(fullscreenWrapperRef);

  const active = snapshot ?? initialSnapshot;
  const slide = getSlideById(active.state.currentSlideId);
  const slideIdx = getSlideIndex(slide.id);
  const progressPct = Math.round(((slideIdx + 1) / SLIDES.length) * 100);
  const showSideQr = !isFullscreen && active.state.showQrOverlay && slide.kind !== "welcome";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f") {
        void toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleFullscreen]);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#060B16] text-white flex flex-col">
      {/* Slim Projector Header (hidden in fullscreen) */}
      {!isFullscreen && (
        <header className="no-print shrink-0 border-b border-slate-800/80 bg-[#0B1220]">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-3 py-1.5 sm:px-6 sm:py-2.5">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="font-display text-xs sm:text-sm font-bold text-white">
                AI Teacher Lab · Mediouna ·{" "}
                <span dir="rtl" lang="ar" className="font-arabic text-teal-300">
                  مديونة
                </span>
              </span>
              <span className="text-slate-600 hidden lg:inline" aria-hidden="true">
                |
              </span>
              <span className="text-xs font-semibold text-slate-300 tabular-nums">
                <span className="hidden lg:inline">
                  Section {active.state.currentSection}/{TOTAL_SECTIONS} ·{" "}
                </span>
                Diapo {slideIdx + 1}/{SLIDES.length}
                <span dir="rtl" lang="ar" className="font-arabic text-teal-300 hidden xl:inline">
                  {" "}
                  · الشريحة {slideIdx + 1}/{SLIDES.length}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200">
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
                aria-label="Plein écran / ملء الشاشة"
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
      )}

      {/* Main Projector Row: 16:9 Stage + Separate External QR Sidebar */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        <div
          ref={fullscreenWrapperRef}
          data-fullscreen-wrapper="true"
          className={
            isCssFullscreen
              ? "fixed inset-0 z-50 h-[100dvh] w-screen bg-[#060B16] p-0 m-0 flex flex-col items-center justify-center overflow-hidden"
              : isFullscreen
                ? "h-[100dvh] w-screen bg-[#060B16] p-0 m-0 flex flex-col items-center justify-center overflow-hidden"
                : "relative flex flex-1 min-h-0 min-w-0 flex-col items-center justify-center overflow-hidden px-2 py-2 sm:px-5 sm:py-3"
          }
        >
          {!isFullscreen && active.state.isPaused && (
            <div className="mb-2 shrink-0 flex items-center justify-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/15 px-4 py-1.5 text-xs sm:text-sm font-bold text-amber-200">
              <Radio className="h-4 w-4 shrink-0" />
              <BilingualInline
                text={{
                  fr: "Atelier en pause · Échange collectif en cours",
                  ar: "الورشة في استراحة · نقاش جماعي جارٍ",
                }}
              />
            </div>
          )}

          <PresentationViewport rounded={!isFullscreen}>
            <SlideRenderer
              slide={slide}
              mode="projector"
              activityStatus={active.state.activityStatus}
              showResults={active.state.showResults}
              showQrOverlay={isFullscreen ? false : active.state.showQrOverlay}
              isPaused={active.state.isPaused}
              aggregate={active.aggregate}
              connectedCount={active.connectedCount}
              totalParticipants={active.totalParticipants}
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
        </div>

        {/* Dedicated Reserved External QR Sidebar (Outside Slide Canvas, Hidden in Fullscreen) */}
        {showSideQr && (
          <aside
            data-projector-qr-region="true"
            className="no-print hidden xl:flex w-64 shrink-0 flex-col justify-center border-l border-slate-800/80 bg-[#0B1220] px-4 py-4"
          >
            <QrJoinPanel size={150} darkSurface />
          </aside>
        )}
      </div>
    </div>
  );
}
