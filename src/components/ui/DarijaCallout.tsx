import React from "react";
import type { BilingualText } from "@/content/types";
import { BilingualInline } from "./Bilingual";

interface DarijaCalloutProps {
  title: BilingualText;
  fr: string;
  arabic: string;
  large?: boolean;
}

export function DarijaCallout({ title, fr, arabic, large = false }: DarijaCalloutProps) {
  return (
    <div
      className={`rounded-2xl border border-teal-500/25 bg-teal-50/85 text-slate-900 shadow-xs space-y-2.5 ${
        large ? "p-6" : "p-4"
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-teal-900">
        <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-teal-600" />
        <BilingualInline text={title} />
      </div>

      <div className="grid gap-3 md:grid-cols-2 md:items-start">
        <p
          dir="ltr"
          lang="fr"
          className={large ? "text-base leading-relaxed text-slate-800" : "text-xs sm:text-sm leading-relaxed text-slate-800"}
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
