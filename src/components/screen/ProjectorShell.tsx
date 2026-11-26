"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Radio, Smartphone, Users } from "lucide-react";
import type { PublicWorkshopSnapshot } from "@/content/types";
import { getSlideById, getSlideIndex, SLIDES, TOTAL_SECTIONS } from "@/content/slides";
import { useWorkshopSync } from "@/lib/realtime/client";
import { useCompactLandscape } from "@/lib/useCompactLandscape";
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
  const isCompactLandscape = useCompactLandscape();
  const [overlayVisible, setOverlayVisible] = useState(true);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = snapshot ?? initialSnapshot;
  const slide = getSlideById(active.state.currentSlideId);
  const slideIdx = getSlideIndex(slide.id);
  const progressPct = Math.round(((slideIdx + 1) / SLIDES.length) * 100);
  const hideChrome = isFullscreen || isCompactLandscape;
  const showSideQr = !hideChrome && active.state.showQrOverlay && slide.kind !== "welcome";

  const pokeOverlay = useCallback(() => {
    setOverlayVisible(true);
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = setTimeout(() => {
      setOverlayVisible(false);
    }, 3200);
  }, []);

  useEffect(() => {
    if (!hideChrome) return;
    const initTimer = setTimeout(() => {
      pokeOverlay();
    }, 0);
    return () => {
      clearTimeout(initTimer);
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    };
  }, [hideChrome, pokeOverlay]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key.toLowerCase() === "f") {
        void toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleFullscreen]);

  return (
    <div
      data-compact-landscape={isCompactLandscape ? "true" : "false"}
      className="h-[100dvh] w-full overflow-hidden bg-[#060B16] text-white flex flex-col"
    >
      {/* Single-Row Non-Wrapping Projector Header (auto-collapses in fullscreen & phone landscape) */}
      {!hideChrome && (
        <header className="no-print safe-top shrink-0 border-b border-slate-800/80 bg-[#0B1220]">
          <div className="mx-auto flex h-12 sm:h-13 max-w-[1600px] items-center justify-between gap-2 px-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <span className="truncate font-display text-xs sm:text-sm font-bold text-white">
                AI Teacher Lab{" "}
                <span className="hidden sm:inline">· Mediouna · </span>
                <span dir="rtl" lang="ar" className="font-arabic text-teal-300">
                  مديونة
                </span>
              </span>
              <span className="text-slate-600 hidden lg:inline" aria-hidden="true">
                |
              </span>
              <span className="shrink-0 text-xs font-semibold text-slate-300 tabular-nums whitespace-nowrap">
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

            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 whitespace-nowrap tabular-nums">
                <Users className="h-3.5 w-3.5 text-teal-400 shrink-0" aria-hidden="true" />
                <span>
                  {active.connectedCount} collègues en ligne ·{" "}
                  <span dir="rtl" lang="ar" className="font-arabic text-teal-300">
                    {active.connectedCount} متصل(ة)
                  </span>
                </span>
              </span>

              <div className="hidden sm:flex">
                <ConnectionBadge
                  mode={connectionMode}
                  demoMode={active.state.demoMode}
                  compact
                />
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Plein écran / ملء الشاشة"
                className="inline-flex min-h-[36px] min-w-[36px] sm:min-h-[34px] items-center justify-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:border-teal-400 cursor-pointer whitespace-nowrap"
              >
                <Maximize2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="hidden md:inline">
                  <BilingualInline text={{ fr: "Plein écran", ar: "ملء الشاشة" }} />
                </span>
              </button>
            </div>
          </div>

          <div className="h-0.5 w-full bg-slate-900">
            <div
              className="h-full bg-teal-500 transition-[width] duration-200 ease-out"
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
          onPointerDown={hideChrome ? pokeOverlay : undefined}
          onMouseMove={hideChrome ? pokeOverlay : undefined}
          className={
            isCssFullscreen
              ? "fixed inset-0 z-50 h-[100dvh] w-screen bg-[#060B16] p-0 m-0 flex flex-col items-center justify-center overflow-hidden"
              : hideChrome
                ? "relative flex flex-1 min-h-0 min-w-0 h-full w-full bg-[#060B16] p-0 m-0 flex-col items-center justify-center overflow-hidden"
                : "relative flex flex-1 min-h-0 min-w-0 flex-col items-center justify-center overflow-hidden px-2 py-2 sm:px-5 sm:py-3"
          }
        >
          {!hideChrome && active.state.isPaused && (
            <div className="mb-2 shrink-0 flex items-center justify-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/15 px-4 py-1.5 text-xs sm:text-sm font-bold text-amber-200">
              <Radio className="h-4 w-4 shrink-0" aria-hidden="true" />
              <BilingualInline
                text={{
                  fr: "Atelier en pause · Échange collectif en cours",
                  ar: "الورشة في استراحة · نقاش جماعي جارٍ",
                }}
              />
            </div>
          )}

          <PresentationViewport rounded={!hideChrome}>
            <SlideRenderer
              slide={slide}
              mode="projector"
              activityStatus={active.state.activityStatus}
              showResults={active.state.showResults}
              showQrOverlay={hideChrome ? false : active.state.showQrOverlay}
              isPaused={active.state.isPaused}
              aggregate={active.aggregate}
              connectedCount={active.connectedCount}
              totalParticipants={active.totalParticipants}
            />
          </PresentationViewport>

          {!hideChrome && (
            <div
              data-orientation-hint="true"
              className="portrait-phone-hint mt-1.5 shrink-0 items-center gap-2 rounded-full border border-slate-700/80 bg-[#111C33]/90 px-3 py-1 text-[11px] text-slate-300"
            >
              <Smartphone className="h-3.5 w-3.5 text-teal-400 shrink-0" aria-hidden="true" />
              <BilingualInline
                text={{
                  fr: "Tournez l'appareil en paysage",
                  ar: "أدر الجهاز أفقياً لعرض أوضح",
                }}
              />
            </div>
          )}

          {/* Discreet auto-fading overlay in Compact Mobile Landscape or Fullscreen */}
          {hideChrome && (
            <div
              data-landscape-overlay="true"
              className={`no-print absolute bottom-3 right-3 z-30 flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-[#0B1220]/80 px-2.5 py-1 text-xs text-slate-200 backdrop-blur-md transition-opacity duration-200 ${
                overlayVisible ? "opacity-95" : "opacity-20 hover:opacity-95 focus-within:opacity-95"
              }`}
              style={{
                marginBottom: "env(safe-area-inset-bottom, 0px)",
                marginRight: "env(safe-area-inset-right, 0px)",
              }}
            >
              <span className="px-1.5 text-[11px] font-semibold tabular-nums">
                {slideIdx + 1}/{SLIDES.length}
              </span>
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={
                  isFullscreen
                    ? "Quitter le plein écran / إنهاء ملء الشاشة"
                    : "Plein écran / ملء الشاشة"
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-700/80 cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Dedicated Reserved External QR Sidebar (Outside Slide Canvas, Hidden in Fullscreen & Landscape Phone) */}
        {showSideQr && (
          <aside
            data-projector-qr-region="true"
            className="no-print hidden 2xl:flex w-52 shrink-0 flex-col justify-center border-l border-slate-800/80 bg-[#0B1220] px-3 py-3"
          >
            <QrJoinPanel size={132} darkSurface />
          </aside>
        )}
      </div>
    </div>
  );
}
