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
      className={`flex flex-col items-center gap-3 rounded-2xl border p-4 text-center ${
        darkSurface
          ? "border-slate-700/70 bg-navy-800/90 text-white"
          : "border-slate-200 bg-white text-slate-900 shadow-sm"
      }`}
    >
      <div className="space-y-0.5 text-xs font-semibold text-teal-500">
        <div className="flex items-center justify-center gap-1.5 uppercase tracking-wider">
          <Smartphone className="h-4 w-4" />
          <span>Rejoindre l&apos;atelier (/join)</span>
        </div>
        <div dir="rtl" lang="ar" className="font-arabic text-xs font-semibold">
          الانضمام إلى الورشة (/join)
        </div>
      </div>

      <div className="rounded-xl bg-white p-2.5 shadow-xs">
        <QRCodeSVG
          value={joinUrl}
          size={size}
          bgColor="#ffffff"
          fgColor="#0b1426"
          level="M"
        />
      </div>

      <div className="space-y-1.5 w-full">
        <p dir="ltr" className="font-mono-code text-[11px] break-all opacity-90">
          {joinUrl}
        </p>
        {showPinHint ? (
          <div className="text-xs font-semibold text-amber-500 space-y-0.5">
            <p>
              Code PIN partagé : <span dir="ltr" className="font-mono-code">{showPinHint}</span>
            </p>
            <p dir="rtl" lang="ar" className="font-arabic">
              رمز PIN المشترك: <span dir="ltr" className="font-mono-code">{showPinHint}</span>
            </p>
          </div>
        ) : (
          <div className={`text-[11px] space-y-0.5 ${darkSurface ? "text-slate-300" : "text-slate-600"}`}>
            <p>Saisissez le code PIN communiqué et votre prénom.</p>
            <p dir="rtl" lang="ar" className="font-arabic">
              أدخلوا رمز PIN المعلن واسمكم للانضمام.
            </p>
          </div>
        )}
      </div>

      <CopyPromptButton text={joinUrl} label="Copier le lien /join" labelAr="نسخ رابط الورشة" />
    </div>
  );
}
