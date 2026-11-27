"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  LOGICAL_SLIDE_HEIGHT,
  LOGICAL_SLIDE_WIDTH,
  clampToLogicalCanvas,
  type DeckSlide,
  type DeckTheme,
} from "@/lib/studio/document-schema";
import { ElementRenderer } from "@/components/studio/elements/ElementRenderer";

interface EditorCanvasStageProps {
  slide: DeckSlide;
  theme: DeckTheme;
  selectedElementId: string | null;
  snapToGrid: boolean;
  onSelectElement: (elementId: string | null) => void;
  onChangeElementGeometry: (
    elementId: string,
    rect: { x: number; y: number; width: number; height: number }
  ) => void;
  onApproveSandbox: (elementId: string) => void;
  onDetachLegacySlide?: () => void;
}

export function EditorCanvasStage({
  slide,
  theme,
  selectedElementId,
  snapToGrid,
  onSelectElement,
  onChangeElementGeometry,
  onApproveSandbox,
  onDetachLegacySlide,
}: EditorCanvasStageProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const suppressDeselectRef = useRef(false);
  const [scale, setScale] = useState(0.5);
  const [activeGuide, setActiveGuide] = useState<{ cx: boolean; cy: boolean }>({
    cx: false,
    cy: false,
  });

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    function measure() {
      const node = hostRef.current;
      if (!node) return;
      const w = Math.max(320, node.clientWidth - 32);
      const h = Math.max(200, node.clientHeight - 32);
      setScale(Math.min(w / LOGICAL_SLIDE_WIDTH, h / LOGICAL_SLIDE_HEIGHT));
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function startPointerMove(e: React.PointerEvent, elementId: string) {
    const el = slide.elements.find((item) => item.id === elementId);
    if (!el || el.locked) return;
    e.stopPropagation();
    e.preventDefault();
    onSelectElement(elementId);

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const origX = el.x;
    const origY = el.y;
    let moved = false;

    function onMove(ev: PointerEvent) {
      moved = true;
      const dx = (ev.clientX - startClientX) / Math.max(0.15, scale);
      const dy = (ev.clientY - startClientY) / Math.max(0.15, scale);
      let nextX = origX + dx;
      let nextY = origY + dy;

      if (snapToGrid) {
        nextX = Math.round(nextX / 8) * 8;
        nextY = Math.round(nextY / 8) * 8;
      }

      const centerX = nextX + el!.width / 2;
      const centerY = nextY + el!.height / 2;
      const snapCx = Math.abs(centerX - LOGICAL_SLIDE_WIDTH / 2) < 18;
      const snapCy = Math.abs(centerY - LOGICAL_SLIDE_HEIGHT / 2) < 18;

      if (snapCx) nextX = LOGICAL_SLIDE_WIDTH / 2 - el!.width / 2;
      if (snapCy) nextY = LOGICAL_SLIDE_HEIGHT / 2 - el!.height / 2;
      setActiveGuide({ cx: snapCx, cy: snapCy });

      const clamped = clampToLogicalCanvas({
        x: nextX,
        y: nextY,
        width: el!.width,
        height: el!.height,
      });
      onChangeElementGeometry(elementId, clamped);
    }

    function onUp() {
      if (moved) {
        suppressDeselectRef.current = true;
        window.setTimeout(() => {
          suppressDeselectRef.current = false;
        }, 50);
      }
      setActiveGuide({ cx: false, cy: false });
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function startPointerResize(e: React.PointerEvent, elementId: string) {
    const el = slide.elements.find((item) => item.id === elementId);
    if (!el || el.locked) return;
    e.stopPropagation();
    e.preventDefault();

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const origW = el.width;
    const origH = el.height;
    let moved = false;

    function onMove(ev: PointerEvent) {
      moved = true;
      const dw = (ev.clientX - startClientX) / Math.max(0.15, scale);
      const dh = (ev.clientY - startClientY) / Math.max(0.15, scale);
      let nextW = Math.max(120, origW + dw);
      let nextH = Math.max(60, origH + dh);
      if (snapToGrid) {
        nextW = Math.round(nextW / 8) * 8;
        nextH = Math.round(nextH / 8) * 8;
      }
      const clamped = clampToLogicalCanvas({
        x: el!.x,
        y: el!.y,
        width: nextW,
        height: nextH,
      });
      onChangeElementGeometry(elementId, clamped);
    }

    function onUp() {
      if (moved) {
        suppressDeselectRef.current = true;
        window.setTimeout(() => {
          suppressDeselectRef.current = false;
        }, 50);
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  const scaledW = Math.round(LOGICAL_SLIDE_WIDTH * scale);
  const scaledH = Math.round(LOGICAL_SLIDE_HEIGHT * scale);
  const bg = slide.background.color || theme.stageBackground || "#FAF8F4";
  const sortedElements = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={hostRef}
      onClick={() => {
        if (suppressDeselectRef.current) return;
        onSelectElement(null);
      }}
      className="relative flex-1 min-w-0 min-h-0 flex flex-col items-center justify-center bg-[#E4DDD0] p-4 overflow-hidden select-none"
    >
      {slide.legacySource && !slide.legacySource.edited && onDetachLegacySlide && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mb-2 flex items-center gap-3 rounded-xl border border-teal-700/30 bg-[#FAF8F4] px-3 py-1.5 text-xs shadow-xs"
        >
          <span className="font-semibold text-teal-900">
            Slide Mediouna importée : glissez ou éditez n&apos;importe quel bloc pour la personnaliser.
          </span>
          <button
            type="button"
            onClick={onDetachLegacySlide}
            className="rounded-lg bg-teal-700 px-2.5 py-1 font-bold text-white"
          >
            Passer en édition libre
          </button>
        </div>
      )}

      {/* Exact 16:9 Scaled Outer Frame */}
      <div
        data-editor-canvas-frame="true"
        style={{ width: `${scaledW}px`, height: `${scaledH}px` }}
        className="relative overflow-hidden rounded-xl border-2 border-[#C7BFA9] bg-white shadow-xl"
      >
        <div
          data-editor-logical-canvas="true"
          style={{
            width: `${LOGICAL_SLIDE_WIDTH}px`,
            height: `${LOGICAL_SLIDE_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            backgroundColor: bg,
          }}
          className="relative overflow-hidden"
        >
          <div
            className="absolute inset-x-0 top-0 h-2 pointer-events-none"
            style={{ backgroundColor: slide.background.accentColor || "#0F766E" }}
          />

          {/* Snap Center Alignment Guides */}
          {activeGuide.cx && (
            <div className="absolute inset-y-0 left-1/2 w-[2px] bg-teal-500 z-[999] pointer-events-none" />
          )}
          {activeGuide.cy && (
            <div className="absolute inset-x-0 top-1/2 h-[2px] bg-teal-500 z-[999] pointer-events-none" />
          )}

          {sortedElements.map((element) => {
            const isSelected = selectedElementId === element.id;
            return (
              <div
                key={element.id}
                data-editor-element={element.id}
                onPointerDown={(e) => startPointerMove(e, element.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement(element.id);
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
                className={`group cursor-move ${
                  isSelected
                    ? "ring-4 ring-teal-600 ring-offset-2"
                    : "hover:ring-2 hover:ring-teal-500/50"
                }`}
              >
                <div className="h-full w-full pointer-events-none">
                  <ElementRenderer
                    element={element}
                    mode="editor"
                    interactive={false}
                    onApproveSandbox={onApproveSandbox}
                  />
                </div>

                {isSelected && !element.locked && (
                  <div
                    role="button"
                    aria-label="Redimensionner"
                    data-resize-handle={element.id}
                    onPointerDown={(e) => startPointerResize(e, element.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -bottom-3 -right-3 h-7 w-7 rounded-full border-2 border-white bg-teal-700 shadow-md cursor-nwse-resize"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
