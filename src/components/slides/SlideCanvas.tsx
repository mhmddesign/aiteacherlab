"use client";

import React, { forwardRef } from "react";

export const SLIDE_LOGICAL_WIDTH = 1920;
export const SLIDE_LOGICAL_HEIGHT = 1080;

interface SlideCanvasProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Fixed 1920x1080 logical slide surface scaled uniformly by PresentationViewport.
 */
export const SlideCanvas = forwardRef<HTMLDivElement, SlideCanvasProps>(
  function SlideCanvas({ children, className = "" }, ref) {
    return (
      <div
        ref={ref}
        data-slide-canvas="true"
        style={{
          width: `${SLIDE_LOGICAL_WIDTH}px`,
          height: `${SLIDE_LOGICAL_HEIGHT}px`,
          transformOrigin: "top left",
        }}
        className={`absolute top-0 left-0 overflow-hidden bg-[#FAF8F4] text-[#0F172A] ${className}`}
      >
        {children}
      </div>
    );
  }
);
