"use client";

import React from "react";
import { Radio, RefreshCw, WifiOff } from "lucide-react";
import type { ConnectionMode } from "@/lib/realtime/client";

interface ConnectionBadgeProps {
  mode: ConnectionMode;
  demoMode: boolean;
  compact?: boolean;
}

export function ConnectionBadge({
  mode,
  demoMode,
  compact = false,
}: ConnectionBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          demoMode
            ? "border border-amber-400/50 bg-amber-500/15 text-amber-300"
            : "border border-teal-400/40 bg-teal-500/15 text-teal-200"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            demoMode ? "bg-amber-400" : "bg-teal-400"
          }`}
        />
        {demoMode
          ? compact
            ? "MODE DÉMO"
            : "MODE DÉMO · Données simulées"
          : compact
            ? "SESSION RÉELLE"
            : "SESSION RÉELLE · Mediouna"}
      </span>

      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
          mode === "realtime"
            ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-200"
            : mode === "polling"
              ? "border-slate-500/40 bg-slate-800/70 text-slate-200"
              : "border-amber-500/40 bg-amber-500/15 text-amber-200"
        }`}
      >
        {mode === "realtime" ? (
          <>
            <Radio className="h-3 w-3 text-cyan-300" />
            <span>Temps réel</span>
          </>
        ) : mode === "polling" ? (
          <>
            <RefreshCw className="h-3 w-3 text-teal-300" />
            <span>Synchro HTTP</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3 text-amber-300" />
            <span>Reconnexion...</span>
          </>
        )}
      </span>
    </div>
  );
}
