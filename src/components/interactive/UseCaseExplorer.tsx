"use client";

import React, { useState } from "react";
import { AlertTriangle, BookOpen, CheckCircle2, Printer } from "lucide-react";
import { USE_CASES } from "@/content/use-cases";
import { CopyPromptButton } from "@/components/ui/CopyPromptButton";

interface UseCaseExplorerProps {
  large?: boolean;
}

export function UseCaseExplorer({ large = false }: UseCaseExplorerProps) {
  const [activeId, setActiveId] = useState(USE_CASES[0].id);
  const current = USE_CASES.find((u) => u.id === activeId) ?? USE_CASES[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {USE_CASES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${
              item.id === current.id
                ? "border-teal-600 bg-teal-600 text-white shadow-xs"
                : "border-slate-200 bg-white text-slate-700 hover:border-teal-400"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-white">
              {current.grade}
            </span>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              {current.subject}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CopyPromptButton text={current.prompt} label="Copier le prompt" />
            {current.printable && (
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-teal-500 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Imprimer</span>
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
          <p>
            <strong className="text-slate-900">Objectif fourni par l&apos;enseignant :</strong>{" "}
            {current.objective}
          </p>
          <p className="mt-1">
            <strong className="text-slate-900">Compétence ciblée :</strong>{" "}
            {current.competency}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#0B1426] p-4 text-slate-100">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Prompt rédigé par l&apos;enseignant</span>
            </div>
            <pre
              dir={current.promptLanguage === "ar" ? "rtl" : "ltr"}
              className={`whitespace-pre-wrap leading-relaxed text-slate-100 ${
                current.promptLanguage === "ar" ? "font-arabic text-sm" : "font-mono-code text-xs"
              } ${large ? "text-sm" : ""}`}
            >
              {current.prompt}
            </pre>
          </div>

          <div className="print-sheet rounded-xl border border-teal-200 bg-ivory-50 p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900">
                {current.draftOutputTitle}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">
                <AlertTriangle className="h-3 w-3" />
                Brouillon IA à valider
              </span>
            </div>

            <pre
              className={`whitespace-pre-wrap font-sans leading-relaxed text-slate-800 ${
                large ? "text-base" : "text-xs sm:text-sm"
              }`}
            >
              {current.draftOutputBody}
            </pre>

            {current.arabicSample && (
              <div
                dir="rtl"
                lang="ar"
                className="font-arabic mt-3 rounded-xl border border-teal-200 bg-white p-3.5 text-sm leading-relaxed text-slate-900"
              >
                <pre className="whitespace-pre-wrap font-arabic">{current.arabicSample}</pre>
              </div>
            )}

            <div className="mt-3 flex items-start gap-2 rounded-lg bg-white p-2.5 text-xs text-slate-700 border border-slate-200">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
              <span>
                <strong>Vérification enseignant :</strong> {current.teacherCheck}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
