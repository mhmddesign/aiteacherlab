import React from "react";
import type { BilingualText } from "@/content/types";
import { BilingualInline } from "./Bilingual";

interface DarijaCalloutProps {
  title: BilingualText;
  fr: string;
  arabic: string;
  large?: boolean;
  canvas?: boolean;
}

export function DarijaCallout({
  title,
  fr,
  arabic,
  large = false,
  canvas = false,
}: DarijaCalloutProps) {
  if (canvas) {
    return (
      <div className="rounded-xl border border-ivory-200 bg-ivory-100 px-6 py-2.5 text-navy-900 space-y-1">
        <div className="text-[12px] font-bold uppercase tracking-wider text-teal-700">
          <BilingualInline text={title} />
        </div>

        <div className="grid grid-cols-2 gap-8 items-start">
          <p dir="ltr" lang="fr" className="text-[15px] leading-snug text-slate-700">
            {fr}
          </p>
          <p dir="rtl" lang="ar" className="font-arabic text-[17px] leading-snug text-navy-900 font-medium">
            {arabic}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-ivory-200 bg-ivory-100 text-navy-900 space-y-2 ${
        large ? "px-6 py-4" : "px-4 py-3"
      }`}
    >
      <div className="text-[12px] font-bold uppercase tracking-wider text-teal-700">
        <BilingualInline text={title} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <p
          dir="ltr"
          lang="fr"
          className={
            large
              ? "text-base leading-relaxed text-slate-800"
              : "text-xs sm:text-sm leading-relaxed text-slate-800"
          }
        >
          {fr}
        </p>
        <p
          dir="rtl"
          lang="ar"
          className={`font-arabic text-slate-900 ${
            large ? "text-xl leading-relaxed font-medium" : "text-sm sm:text-base leading-relaxed"
          }`}
        >
          {arabic}
        </p>
      </div>
    </div>
  );
}
