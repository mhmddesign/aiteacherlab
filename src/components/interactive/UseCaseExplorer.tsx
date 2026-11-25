"use client";

import React, { useState } from "react";
import { AlertTriangle, BookOpen, CheckCircle2, Printer } from "lucide-react";
import { USE_CASES } from "@/content/use-cases";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
import { CopyPromptButton } from "@/components/ui/CopyPromptButton";

interface UseCaseExplorerProps {
  large?: boolean;
  canvas?: boolean;
}

export function UseCaseExplorer({ large = false, canvas = false }: UseCaseExplorerProps) {
  const [activeId, setActiveId] = useState(USE_CASES[0].id);
  const current = USE_CASES.find((u) => u.id === activeId) ?? USE_CASES[0];

  if (canvas) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-8 gap-2.5">
          {USE_CASES.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={`rounded-xl border-2 px-3 py-2.5 text-left transition cursor-pointer ${
                item.id === current.id
                  ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-400"
              }`}
            >
              <span
                className={`block font-mono-code text-[16px] font-bold ${
                  item.id === current.id ? "text-teal-100" : "text-teal-700"
                }`}
              >
                0{idx + 1}
              </span>
              <span className="block text-[18px] font-bold leading-tight truncate">
                {item.label.fr}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-7 h-[600px]">
          <div className="col-span-6 rounded-2xl bg-[#0B1220] p-7 text-slate-100 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-teal-500/20 px-4 py-1 text-[20px] font-bold text-teal-300">
                  {current.grade}
                </span>
                <span className="text-[20px] font-semibold text-slate-200">
                  <BilingualInline text={current.subject} />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CopyPromptButton text={current.promptFr} label="FR" labelAr="نسخ" />
                <CopyPromptButton text={current.promptAr} label="AR" labelAr="نسخ" />
              </div>
            </div>

            <div data-slide-body="true" className="space-y-3">
              <div className="flex items-center gap-2 text-[20px] font-bold uppercase tracking-wider text-cyan-300">
                <BookOpen className="h-5 w-5" />
                <BilingualInline text={{ fr: "Objectif & Prompt", ar: "الهدف والتوجيه" }} />
              </div>
              <BilingualBlock
                text={current.objective}
                frClassName="text-[26px] font-bold leading-snug text-white"
                arClassName="text-[28px] font-bold leading-snug text-teal-200"
              />
              <pre
                dir="ltr"
                lang="fr"
                className="whitespace-pre-wrap font-mono-code text-[20px] leading-relaxed text-slate-200 border-t border-slate-800 pt-3"
              >
                {current.promptFr}
              </pre>
            </div>
          </div>

          <div className="col-span-6 print-sheet rounded-2xl border-2 border-teal-200 bg-white p-7 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
              <BilingualBlock
                text={current.draftOutputTitle}
                frClassName="text-[24px] font-bold text-slate-900"
                arClassName="text-[24px] font-bold text-teal-800"
              />
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-[18px] font-bold text-amber-900">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Brouillon IA
                </span>
                {current.printable && (
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="no-print inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[18px] font-semibold text-slate-700 hover:border-teal-500 cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    A4
                  </button>
                )}
              </div>
            </div>

            <pre
              dir="ltr"
              lang="fr"
              className="whitespace-pre-wrap font-sans text-[22px] leading-relaxed text-slate-800"
            >
              {current.draftOutputFr}
            </pre>

            <div
              dir="rtl"
              lang="ar"
              className="font-arabic rounded-xl border border-teal-200 bg-[#FAF8F4] p-4 text-[24px] leading-relaxed text-slate-900"
            >
              <pre className="whitespace-pre-wrap font-arabic">{current.draftOutputAr}</pre>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-teal-50/70 px-4 py-3 text-slate-800 border border-teal-200">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal-700" />
              <BilingualBlock
                text={current.teacherCheck}
                className="flex-1"
                frClassName="text-[20px] font-medium"
                arClassName="text-[22px] font-medium text-teal-900"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <BilingualBlock
              text={item.label}
              frClassName="text-xs"
              arClassName={`text-[11px] ${item.id === current.id ? "text-teal-50" : "text-teal-800"}`}
            />
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-white">
              {current.grade}
            </span>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <BilingualInline text={current.subject} />
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CopyPromptButton
              text={current.promptFr}
              label="Copier prompt FR"
              labelAr="نسخ الفرنسي"
            />
            <CopyPromptButton
              text={current.promptAr}
              label="Copier prompt AR"
              labelAr="نسخ العربي"
            />
            {current.printable && (
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-teal-500 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <BilingualInline text={{ fr: "Imprimer", ar: "طباعة" }} />
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-700">
          <div>
            <p className="font-bold text-slate-900">
              Objectif fourni par l&apos;enseignant ·{" "}
              <span dir="rtl" lang="ar" className="font-arabic text-teal-800">
                الهدف التعلمي
              </span>
            </p>
            <BilingualBlock text={current.objective} className="mt-1" />
          </div>
          <div>
            <p className="font-bold text-slate-900">
              Compétence ciblée ·{" "}
              <span dir="rtl" lang="ar" className="font-arabic text-teal-800">
                الكفاية المستهدفة
              </span>
            </p>
            <BilingualBlock text={current.competency} className="mt-1" />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#0B1426] p-4 text-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              <BookOpen className="h-3.5 w-3.5" />
              <BilingualInline
                text={{
                  fr: "Prompts de l'enseignant",
                  ar: "التوجيهان المقترحان",
                }}
              />
            </div>
            <pre
              dir="ltr"
              lang="fr"
              className={`whitespace-pre-wrap font-mono-code leading-relaxed text-slate-100 ${
                large ? "text-xs sm:text-sm" : "text-xs"
              }`}
            >
              {current.promptFr}
            </pre>
            <div className="border-t border-slate-700/80 pt-3">
              <pre
                dir="rtl"
                lang="ar"
                className={`whitespace-pre-wrap font-arabic leading-relaxed text-cyan-100 ${
                  large ? "text-base" : "text-xs sm:text-sm"
                }`}
              >
                {current.promptAr}
              </pre>
            </div>
          </div>

          <div className="print-sheet rounded-xl border border-teal-200 bg-ivory-50 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <BilingualBlock
                text={current.draftOutputTitle}
                frClassName="text-xs font-bold text-slate-900"
                arClassName="text-xs font-bold text-teal-900"
              />
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                <BilingualInline
                  text={{
                    fr: "Brouillon IA à valider",
                    ar: "مسودة للمراجعة والاعتماد",
                  }}
                />
              </span>
            </div>

            <pre
              dir="ltr"
              lang="fr"
              className={`whitespace-pre-wrap font-sans leading-relaxed text-slate-800 ${
                large ? "text-base" : "text-xs sm:text-sm"
              }`}
            >
              {current.draftOutputFr}
            </pre>

            <div
              dir="rtl"
              lang="ar"
              className="font-arabic rounded-xl border border-teal-200 bg-white p-3.5 text-sm leading-relaxed text-slate-900"
            >
              <pre className="whitespace-pre-wrap font-arabic">{current.draftOutputAr}</pre>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-white p-2.5 text-xs text-slate-700 border border-slate-200">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
              <BilingualBlock
                text={current.teacherCheck}
                className="flex-1"
                frClassName="text-xs"
                arClassName="text-xs text-teal-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
