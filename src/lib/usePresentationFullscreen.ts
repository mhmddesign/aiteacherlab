"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

interface FullscreenDoc extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
}

interface FullscreenEl extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

function getFullscreenElement(): Element | null {
  if (typeof document === "undefined") return null;
  const doc = document as FullscreenDoc;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

/**
 * Manages native Fullscreen API with seamless CSS fullscreen fallback,
 * Escape key handling, and body scroll locking.
 */
export function usePresentationFullscreen(targetRef: RefObject<HTMLElement | null>) {
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isCssFullscreen, setIsCssFullscreen] = useState(false);

  const isFullscreen = isNativeFullscreen || isCssFullscreen;

  useEffect(() => {
    const onChange = () => {
      const active = Boolean(getFullscreenElement());
      setIsNativeFullscreen(active);
      if (!active) {
        setIsCssFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const enterFullscreen = useCallback(async () => {
    const el = (targetRef.current ?? document.documentElement) as FullscreenEl | null;
    if (!el) return;

    if (typeof el.requestFullscreen === "function") {
      try {
        await el.requestFullscreen();
        setIsNativeFullscreen(Boolean(getFullscreenElement()));
        return;
      } catch {
        // Fallback to CSS fullscreen when native request is blocked or unsupported
      }
    } else if (typeof el.webkitRequestFullscreen === "function") {
      try {
        await el.webkitRequestFullscreen();
        setIsNativeFullscreen(Boolean(getFullscreenElement()));
        return;
      } catch {
        // Fallback to CSS fullscreen
      }
    }

    setIsCssFullscreen(true);
  }, [targetRef]);

  const exitFullscreen = useCallback(async () => {
    const doc = document as FullscreenDoc;
    if (doc.fullscreenElement && typeof doc.exitFullscreen === "function") {
      await doc.exitFullscreen().catch(() => undefined);
    } else if (
      doc.webkitFullscreenElement &&
      typeof doc.webkitExitFullscreen === "function"
    ) {
      await Promise.resolve(doc.webkitExitFullscreen()).catch(() => undefined);
    }
    setIsNativeFullscreen(false);
    setIsCssFullscreen(false);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen, isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        void exitFullscreen();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exitFullscreen, isFullscreen]);

  useEffect(() => {
    if (!isCssFullscreen) return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isCssFullscreen]);

  return {
    isFullscreen,
    isNativeFullscreen,
    isCssFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
