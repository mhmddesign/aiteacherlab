"use client";

import React from "react";
import type {
  ActivityAggregate,
  ActivityStatus,
  ParticipantResponseItem,
} from "@/content/types";
import { getSlideById } from "@/content/slides";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import type { DeckSlide, DeckTheme } from "@/lib/studio/document-schema";
import { ElementRenderer } from "./ElementRenderer";
import type { StudioElementLiveAggregate } from "./InteractiveWidgets";

interface DeckSlideStageProps {
  slide: DeckSlide;
  theme?: DeckTheme;
  mode: "editor" | "projector" | "presenter" | "participant" | "export";
  interactive?: boolean;
  showResults?: boolean;
  showQrOverlay?: boolean;
  isPaused?: boolean;
  activityStatus?: ActivityStatus;
  legacyAggregate?: ActivityAggregate | null;
  connectedCount?: number;
  totalParticipants?: number;
  joinPath?: string;
  pinHint?: string;
  myResponses?: ParticipantResponseItem[];
  liveAggregatesByElement?: Record<string, StudioElementLiveAggregate>;
  selectedElementId?: string | null;
  onSelectElement?: (elementId: string) => void;
  onApproveSandbox?: (elementId: string) => void;
  onSubmitLive?: (
    elementId: string,
    payload: { optionId?: string; text?: string; activityType: string }
  ) => Promise<void> | void;
  onLegacySubmitted?: (saved?: ParticipantResponseItem) => void;
}

export function DeckSlideStage({
  slide,
  theme,
  mode,
  interactive = true,
  showResults = true,
  showQrOverlay = false,
  isPaused = false,
  activityStatus = "open",
  legacyAggregate = null,
  connectedCount = 0,
  totalParticipants = 0,
  joinPath = "/join",
  pinHint,
  myResponses,
  liveAggregatesByElement,
  selectedElementId,
  onSelectElement,
  onApproveSandbox,
  onSubmitLive,
  onLegacySubmitted,
}: DeckSlideStageProps) {
  // Preserve 100% visual identity of unedited Mediouna slides using SlideRenderer
  if (slide.legacySource && !slide.legacySource.edited && mode !== "editor") {
    const legacySlide = getSlideById(slide.legacySource.slideId);
    const rendererMode =
      mode === "participant"
        ? "participant"
        : mode === "presenter"
          ? "presenter"
          : "projector";

    return (
      <div className="relative h-full w-full overflow-hidden">
        <SlideRenderer
          slide={legacySlide}
          mode={rendererMode}
          activityStatus={activityStatus}
          showResults={showResults}
          showQrOverlay={showQrOverlay}
          isPaused={isPaused}
          aggregate={legacyAggregate}
          connectedCount={connectedCount}
          totalParticipants={totalParticipants}
          myResponses={myResponses}
          joinPinHint={pinHint}
          onSubmitted={onLegacySubmitted}
        />
      </div>
    );
  }

  const bg = slide.background?.color || theme?.stageBackground || "#FAF8F4";
  const isClosing = slide.layout === "closing-dark" || bg.toLowerCase() === "#0b1220";
  const sortedElements = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      data-deck-slide-stage={slide.id}
      style={{ backgroundColor: bg }}
      className={`relative h-full w-full overflow-hidden ${
        isClosing ? "text-[#FAF8F4]" : "text-[#0B1220]"
      }`}
    >
      {/* Top accent hairline */}
      <div
        className="absolute inset-x-0 top-0 h-2 pointer-events-none"
        style={{ backgroundColor: slide.background?.accentColor || theme?.accentTeal || "#0F766E" }}
      />

      {sortedElements.map((element) => {
        if (!element.visible && mode !== "editor") return null;
        const isSelected = mode === "editor" && selectedElementId === element.id;

        return (
          <div
            key={element.id}
            data-slide-element-id={element.id}
            data-slide-element-type={element.type}
            onClick={(e) => {
              if (mode === "editor" && onSelectElement) {
                e.stopPropagation();
                onSelectElement(element.id);
              }
            }}
            style={{
              position: "absolute",
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
              zIndex: element.zIndex + 10,
              opacity: element.visible ? 1 : 0.35,
            }}
            className={`transition-shadow ${
              isSelected ? "ring-4 ring-teal-500 ring-offset-2" : ""
            }`}
          >
            <ElementRenderer
              element={element}
              mode={mode}
              interactive={interactive}
              showResults={showResults}
              joinPath={joinPath}
              pinHint={pinHint}
              aggregate={liveAggregatesByElement?.[element.id] ?? null}
              onApproveSandbox={onApproveSandbox}
              onSubmitLive={onSubmitLive}
            />
          </div>
        );
      })}
    </div>
  );
}
