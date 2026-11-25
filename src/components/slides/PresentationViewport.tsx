"use client";

import React, { useLayoutEffect, useRef } from "react";
import {
  SLIDE_LOGICAL_HEIGHT,
  SLIDE_LOGICAL_WIDTH,
  SlideCanvas,
} from "./SlideCanvas";

interface PresentationViewportProps {
  children: React.ReactNode;
  className?: string;
  rounded?: boolean;
  interactive?: boolean;
}

/**
 * Proportionally scales a fixed 1920x1080 SlideCanvas to fill the maximum
 * 16:9 area inside its parent container without distortion, cropping, or
 * resize-driven React re-renders.
 */
export function PresentationViewport({
  children,
  className = "",
  rounded = true,
  interactive = true,
}: PresentationViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!container || !frame || !canvas) return;

    let rafId = 0;

    const updateScale = () => {
      const rect = container.getBoundingClientRect();
      const cs = window.getComputedStyle(container);
      const padX =
        (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      const padY =
        (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);

      const availableWidth = Math.max(0, rect.width - padX);
      const availableHeight = Math.max(0, rect.height - padY);
      if (availableWidth <= 0 || availableHeight <= 0) return;

      const scale = Math.max(
        0.05,
        Math.min(
          availableWidth / SLIDE_LOGICAL_WIDTH,
          availableHeight / SLIDE_LOGICAL_HEIGHT
        )
      );
      const renderedWidth = SLIDE_LOGICAL_WIDTH * scale;
      const renderedHeight = SLIDE_LOGICAL_HEIGHT * scale;

      frame.style.width = `${renderedWidth}px`;
      frame.style.height = `${renderedHeight}px`;
      frame.dataset.scale = scale.toFixed(6);
      canvas.style.transform = `scale(${scale})`;
    };

    const scheduleUpdate = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScale);
    };

    updateScale();

    const ro = new ResizeObserver(scheduleUpdate);
    ro.observe(container);

    window.addEventListener("resize", scheduleUpdate);
    window.visualViewport?.addEventListener("resize", scheduleUpdate);
    document.addEventListener("fullscreenchange", scheduleUpdate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      window.visualViewport?.removeEventListener("resize", scheduleUpdate);
      document.removeEventListener("fullscreenchange", scheduleUpdate);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-presentation-viewport="true"
      className={`relative flex-1 min-h-0 min-w-0 w-full h-full overflow-hidden ${className}`}
    >
      <div
        ref={frameRef}
        data-slide-frame="true"
        style={{ aspectRatio: "16 / 9" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-2xl ${
          rounded ? "rounded-xl ring-1 ring-white/10" : ""
        } ${interactive ? "" : "pointer-events-none select-none"}`}
      >
        <SlideCanvas ref={canvasRef}>{children}</SlideCanvas>
      </div>
    </div>
  );
}
