import React from "react";

interface DarijaCalloutProps {
  title: string;
  arabic: string;
  large?: boolean;
}

export function DarijaCallout({ title, arabic, large = false }: DarijaCalloutProps) {
  return (
    <div
      dir="rtl"
      lang="ar"
      className={`font-arabic rounded-2xl border border-teal-500/25 bg-teal-50/80 text-slate-900 shadow-xs ${
        large ? "p-6" : "p-4"
      }`}
    >
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold tracking-wide text-teal-800">
        <span className="inline-block h-2 w-2 rounded-full bg-teal-600" />
        <span>{title}</span>
      </div>
      <p className={large ? "text-xl leading-relaxed font-medium" : "text-base leading-relaxed"}>
        {arabic}
      </p>
    </div>
  );
}
