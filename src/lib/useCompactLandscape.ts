"use client";

import { useEffect, useState } from "react";

/**
 * Detects compact mobile landscape viewports (e.g. phones rotated to 844x390)
 * so presentation routes can automatically collapse top/bottom chrome into a
 * discreet tap-to-reveal overlay and maximize the 16:9 stage.
 */
export function useCompactLandscape() {
  const [isCompactLandscape, setIsCompactLandscape] = useState(false);

  useEffect(() => {
    const check = () => {
      const vw = window.visualViewport?.width ?? window.innerWidth;
      const vh = window.visualViewport?.height ?? window.innerHeight;
      setIsCompactLandscape(vw > vh && vh <= 500 && vw <= 1024);
    };

    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    window.visualViewport?.addEventListener("resize", check);

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
      window.visualViewport?.removeEventListener("resize", check);
    };
  }, []);

  return isCompactLandscape;
}
