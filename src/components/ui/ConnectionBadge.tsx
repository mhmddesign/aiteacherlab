"use client";

import React from "react";
import { Loader2, Radio, RefreshCw, WifiOff } from "lucide-react";
import type { ConnectionMode } from "@/lib/realtime/client";

interface ConnectionBadgeProps {
  mode: ConnectionMode;
  demoMode: boolean;
  compact?: boolean;
}

const MODE_META: Record<
  ConnectionMode,
  {
    fr: string;
    ar: string;
    tone: string;
    icon: "radio" | "refresh" | "spin" | "offline";
  }
> = {
  connecting: {
    fr: "Connexion",
    ar: "اتصال",
    tone: "border-navy-700 bg-navy-800 text-ivory-50",
    icon: "spin",
  },
  realtime: {
    fr: "Temps réel",
    ar: "مباشر",
    tone: "border-teal-bright/40 bg-navy-800 text-teal-bright",
    icon: "radio",
  },
  polling: {
    fr: "Synchro HTTP",
    ar: "مزامنة HTTP",
    tone: "border-slate-blue/70 bg-navy-800 text-ivory-50",
    icon: "refresh",
  },
  reconnecting: {
    fr: "Reconnexion",
    ar: "إعادة اتصال",
    tone: "border-amber-400/50 bg-amber-950/60 text-amber-200",
    icon: "spin",
  },
  offline: {
    fr: "Hors ligne",
    ar: "غير متصل",
    tone: "border-red-400/60 bg-red-950/60 text-red-200",
    icon: "offline",
  },
};

export const ConnectionBadge = React.memo(function ConnectionBadge({
  mode,
  demoMode,
  compact = false,
}: ConnectionBadgeProps) {
  const meta = MODE_META[mode];

  return (
    <div
      data-connection-badge="true"
      data-connection-mode={mode}
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap"
      aria-live="polite"
    >
      {/* Reserved fixed-height Mode Pill (never wraps, never shifts header height) */}
      <span
        className={`inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold whitespace-nowrap transition-colors duration-150 ${
          demoMode
            ? "border border-amber-400/50 bg-amber-950/60 text-amber-200"
            : "border border-teal-bright/40 bg-navy-800 text-teal-bright"
        }`}
      >
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
            demoMode ? "bg-amber-300" : "bg-teal-bright"
          }`}
        />
        {demoMode ? (
          compact ? (
            <>
              <span>DÉMO</span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span dir="rtl" lang="ar" className="font-arabic leading-none">
                تجريبي
              </span>
            </>
          ) : (
            <>
              <span>MODE DÉMO · Données simulées</span>
              <span aria-hidden="true" className="opacity-50">|</span>
              <span dir="rtl" lang="ar" className="font-arabic leading-none">
                الوضع التجريبي
              </span>
            </>
          )
        ) : compact ? (
          <>
            <span>RÉEL</span>
            <span aria-hidden="true" className="opacity-50">·</span>
            <span dir="rtl" lang="ar" className="font-arabic leading-none">
              حقيقي
            </span>
          </>
        ) : (
          <>
            <span>SESSION RÉELLE · Mediouna</span>
            <span aria-hidden="true" className="opacity-50">|</span>
            <span dir="rtl" lang="ar" className="font-arabic leading-none">
              جلسة حقيقية
            </span>
          </>
        )}
      </span>

      {/* Reserved fixed-min-width Connection Status Pill (zero layout jump on transition) */}
      <span
        className={`inline-flex h-7 min-w-[136px] shrink-0 items-center justify-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 ${meta.tone}`}
      >
        {meta.icon === "radio" ? (
          <Radio className="h-3 w-3 shrink-0 text-teal-bright" aria-hidden="true" />
        ) : meta.icon === "refresh" ? (
          <RefreshCw className="h-3 w-3 shrink-0 text-teal-bright" aria-hidden="true" />
        ) : meta.icon === "spin" ? (
          <Loader2 className="h-3 w-3 shrink-0 animate-spin text-amber-300" aria-hidden="true" />
        ) : (
          <WifiOff className="h-3 w-3 shrink-0 text-red-300" aria-hidden="true" />
        )}
        <span>{meta.fr}</span>
        <span aria-hidden="true" className="opacity-50">·</span>
        <span dir="rtl" lang="ar" className="font-arabic leading-none">
          {meta.ar}
        </span>
      </span>
    </div>
  );
});
