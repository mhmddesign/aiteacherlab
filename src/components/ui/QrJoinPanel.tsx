"use client";

import React, { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone } from "lucide-react";
import { CopyPromptButton } from "./CopyPromptButton";

interface QrJoinPanelProps {
  size?: number;
  darkSurface?: boolean;
  showPinHint?: string;
}

export function QrJoinPanel({
  size = 180,
  darkSurface = false,
  showPinHint,
}: QrJoinPanelProps) {
  const joinUrl = useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (typeof window !== "undefined") {
      return `${window.location.origin}/join`;
    }
    if (envUrl) {
      return `${envUrl.replace(/\/$/, "")}/join`;
    }
    return "http://localhost:3000/join";
  }, []);

  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-2xl border p-5 text-center ${
        darkSurface
          ? "border-slate-700/70 bg-navy-800/90 text-white"
          : "border-slate-200 bg-white text-slate-900 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600">
        <Smartphone className="h-4 w-4" />
        <span>Rejoindre l&apos;atelier (/join)</span>
      </div>

      <div className="rounded-xl bg-white p-3 shadow-xs">
        <QRCodeSVG
          value={joinUrl}
          size={size}
          bgColor="#ffffff"
          fgColor="#0b1426"
          level="M"
        />
      </div>

      <div className="space-y-1">
        <p className="font-mono-code text-xs break-all opacity-90">{joinUrl}</p>
        {showPinHint ? (
          <p className="text-xs font-semibold text-amber-600">
            Code PIN partagé : <span className="font-mono-code">{showPinHint}</span>
          </p>
        ) : (
          <p className={`text-xs ${darkSurface ? "text-slate-300" : "text-slate-600"}`}>
            Saisissez le code PIN communiqué dans la salle et votre prénom.
          </p>
        )}
      </div>

      <CopyPromptButton text={joinUrl} label="Copier le lien /join" />
    </div>
  );
}
