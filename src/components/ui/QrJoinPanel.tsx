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

  const isLarge = size >= 220;

  return (
    <div
      className={`flex flex-col items-center rounded-2xl border text-center ${
        isLarge ? "gap-4 p-6" : "gap-3 p-4"
      } ${
        darkSurface
          ? "border-navy-700 bg-navy-800 text-ivory-50"
          : "border-ivory-200 bg-white text-navy-900"
      }`}
    >
      <div
        className={`space-y-0.5 font-bold ${
          darkSurface ? "text-teal-bright" : "text-teal-700"
        } ${isLarge ? "text-[20px]" : "text-xs"}`}
      >
        <div className="flex items-center justify-center gap-2 uppercase tracking-wider">
          <Smartphone className={isLarge ? "h-5 w-5" : "h-4 w-4"} aria-hidden="true" />
          <span>Rejoindre l&apos;atelier (/join)</span>
        </div>
        <div dir="rtl" lang="ar" className={`font-arabic font-bold ${isLarge ? "text-[22px]" : "text-xs"}`}>
          الانضمام إلى الورشة (/join)
        </div>
      </div>

      <div className="rounded-xl border border-ivory-200 bg-white p-3">
        <QRCodeSVG
          value={joinUrl}
          size={size}
          bgColor="#ffffff"
          fgColor="#0B1220"
          level="M"
        />
      </div>

      <div className="space-y-1.5 w-full">
        <p dir="ltr" className={`font-mono-code break-all opacity-90 ${isLarge ? "text-[18px] font-semibold" : "text-[11px]"}`}>
          {joinUrl}
        </p>
        {showPinHint ? (
          <div
            className={`font-bold space-y-0.5 ${
              darkSurface ? "text-amber-300" : "text-status-warning"
            } ${isLarge ? "text-[22px]" : "text-xs"}`}
          >
            <p>
              Code PIN partagé : <span dir="ltr" className="font-mono-code">{showPinHint}</span>
            </p>
            <p dir="rtl" lang="ar" className="font-arabic">
              رمز PIN المشترك: <span dir="ltr" className="font-mono-code">{showPinHint}</span>
            </p>
          </div>
        ) : (
          <div className={`space-y-0.5 ${isLarge ? "text-[19px]" : "text-[11px]"} ${darkSurface ? "text-slate-300" : "text-slate-600"}`}>
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
