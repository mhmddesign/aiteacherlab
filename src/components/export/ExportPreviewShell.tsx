"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Grid2x2, Layout, Printer } from "lucide-react";
import type { DeckDocumentV1 } from "@/lib/studio/document-schema";
import { DeckSlideStage } from "@/components/studio/elements/DeckSlideStage";

export type ExportMode = "slides" | "handout-2" | "handout-4" | "worksheet";

interface ExportPreviewShellProps {
  deck: DeckDocumentV1;
  initialMode: ExportMode;
  joinPinHint?: string;
}

const MODES: Array<{ id: ExportMode; fr: string; ar: string; badge: string }> = [
  { id: "slides", fr: "Diapositives 16:9", ar: "شرائح 16:9 كاملة", badge: "1920×1080" },
  { id: "handout-2", fr: "Polycopié 2/page", ar: "نسخة التوزيع 2/صفحة", badge: "A4 Paysage" },
  { id: "handout-4", fr: "Grille 4/page", ar: "شبكة 4/صفحة", badge: "A4 Portrait" },
  { id: "worksheet", fr: "Fiche Classe A4", ar: "ورقة التمارين A4", badge: "A4 Élève/Formateur" },
];

export function ExportPreviewShell({
  deck,
  initialMode,
  joinPinHint = "4829",
}: ExportPreviewShellProps) {
  const [mode, setMode] = useState<ExportMode>(initialMode);
  const [includeHidden, setIncludeHidden] = useState(false);

  const slides = useMemo(() => {
    return deck.slides.filter((s) => includeHidden || !s.hidden);
  }, [deck.slides, includeHidden]);

  const pageCssRule = useMemo(() => {
    if (mode === "slides") {
      return `@media print { @page { size: 20in 11.25in; margin: 0; } }`;
    }
    if (mode === "handout-2") {
      return `@media print { @page { size: A4 landscape; margin: 10mm; } }`;
    }
    return `@media print { @page { size: A4 portrait; margin: 10mm; } }`;
  }, [mode]);

  const handoutPairs = useMemo(() => {
    const chunkSize = mode === "handout-2" ? 2 : 4;
    const chunks: Array<typeof slides> = [];
    for (let i = 0; i < slides.length; i += chunkSize) {
      chunks.push(slides.slice(i, i + chunkSize));
    }
    return chunks;
  }, [slides, mode]);

  return (
    <div data-export-mode={mode} className="min-h-screen bg-[#E9E3D6] text-[#0B1220] print:bg-white">
      <style dangerouslySetInnerHTML={{ __html: pageCssRule }} />

      {/* Control toolbar — hidden when printing/generating PDF */}
      <header className="no-print sticky top-0 z-40 border-b border-[#D9D0BE] bg-[#FAF8F4]/95 backdrop-blur px-4 py-3 shadow-sm">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E9E3D6] bg-white px-3 py-2 text-sm font-bold text-[#0B1220] hover:border-teal-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Studio</span>
            </Link>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-base md:text-lg truncate">
                Export & Impression · {deck.title.fr}
              </h1>
              <p dir="rtl" lang="ar" className="font-arabic text-xs md:text-sm text-teal-800 truncate">
                {deck.title.ar} · {slides.length} شريحة
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                data-export-tab={m.id}
                onClick={() => setMode(m.id)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                  mode === m.id
                    ? "bg-[#0B1220] text-white border-[#0B1220]"
                    : "bg-white text-[#0B1220] border-[#E9E3D6] hover:border-teal-600"
                }`}
              >
                {m.id === "slides" ? (
                  <Layout className="h-3.5 w-3.5" />
                ) : m.id === "handout-4" ? (
                  <Grid2x2 className="h-3.5 w-3.5" />
                ) : (
                  <FileText className="h-3.5 w-3.5" />
                )}
                <span>{m.fr}</span>
                <span className="hidden sm:inline opacity-75">({m.badge})</span>
              </button>
            ))}

            <label className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9E3D6] bg-white px-3 py-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={includeHidden}
                onChange={(e) => setIncludeHidden(e.target.checked)}
              />
              <span>Masquées</span>
            </label>

            <button
              type="button"
              onClick={() => window.print()}
              data-print-trigger="true"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-xs md:text-sm font-bold text-white shadow hover:bg-teal-800"
            >
              <Printer className="h-4 w-4" />
              <span>Enregistrer en PDF · طباعة PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mode 1: Exact 16:9 Presentation PDF (1920x1080 / 20in x 11.25in, 1 slide per page) */}
      {mode === "slides" && (
        <main className="mx-auto max-w-[1040px] px-4 py-8 space-y-6 print:max-w-none print:p-0 print:m-0 print:space-y-0">
          <style
            dangerouslySetInnerHTML={{
              __html: `@media print { .export-slide-scaler { zoom: 1 !important; transform: none !important; width: 1920px !important; height: 1080px !important; } }`,
            }}
          />
          {slides.map((slide, index) => (
            <section
              key={slide.id}
              data-export-slide-page={index + 1}
              className="export-slide-page relative mx-auto overflow-hidden rounded-2xl border border-[#D9D0BE] bg-[#FAF8F4] shadow-md aspect-video w-full print:rounded-none print:border-0 print:shadow-none print:w-[20in] print:h-[11.25in]"
            >
              <div
                className="export-slide-scaler origin-top-left"
                style={{
                  width: "1920px",
                  height: "1080px",
                  zoom: 0.52,
                }}
              >
                <DeckSlideStage
                  slide={slide}
                  theme={deck.theme}
                  mode="export"
                  interactive={false}
                  showResults={true}
                  pinHint={joinPinHint}
                />
              </div>
            </section>
          ))}
        </main>
      )}

      {/* Mode 2 & 3: Clean A4 Handouts (2 slides Landscape / 4 slides Portrait) */}
      {(mode === "handout-2" || mode === "handout-4") && (
        <main className="mx-auto max-w-5xl px-4 py-8 space-y-6 print:max-w-none print:p-0 print:m-0 print:space-y-0">
          {handoutPairs.map((group, pageIdx) => (
            <section
              key={pageIdx}
              data-export-a4-page={pageIdx + 1}
              className="export-a4-page rounded-2xl border border-[#D9D0BE] bg-white p-6 shadow-sm print:rounded-none print:border-0 print:shadow-none print:p-0"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4 text-xs text-slate-600">
                <span className="font-bold text-[#0B1220]">
                  {deck.title.fr} · Page {pageIdx + 1}
                </span>
                <span dir="rtl" lang="ar" className="font-arabic font-bold text-teal-800">
                  {deck.title.ar}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {group.map((slide) => {
                  const slidePos = deck.slides.findIndex((s) => s.id === slide.id) + 1;
                  return (
                    <article
                      key={slide.id}
                      className="rounded-xl border border-slate-300 bg-[#FAF8F4] p-3 flex flex-col gap-2"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <div
                          style={{
                            width: "1920px",
                            height: "1080px",
                            zoom: mode === "handout-2" ? 0.23 : 0.16,
                          }}
                        >
                          <DeckSlideStage
                            slide={slide}
                            theme={deck.theme}
                            mode="export"
                            interactive={false}
                            showResults={true}
                          />
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-2 font-bold text-[#0B1220]">
                          <span className="truncate">
                            #{slidePos}. {slide.title.fr}
                          </span>
                          <span className="text-teal-800 shrink-0">{slide.notes.durationCue}</span>
                        </div>
                        <p dir="rtl" lang="ar" className="font-arabic font-semibold text-teal-800 truncate">
                          {slide.title.ar}
                        </p>
                        {mode === "handout-2" && slide.notes.fr && (
                          <p className="text-[11px] text-slate-600 line-clamp-3">{slide.notes.fr}</p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </main>
      )}

      {/* Mode 4: Classroom Structured A4 Worksheet / Synthèse */}
      {mode === "worksheet" && (
        <main className="mx-auto max-w-4xl px-4 py-8 space-y-6 print:max-w-none print:p-0 print:m-0">
          <section className="export-a4-page print-sheet rounded-2xl bg-white p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b-2 border-[#0B1220] pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  AI Teacher Lab · Fiche Pédagogique Imprimable
                </p>
                <h2 className="font-display text-2xl font-bold text-[#0B1220] mt-1">
                  {deck.title.fr}
                </h2>
              </div>
              <div dir="rtl" lang="ar" className="text-right">
                <p className="font-arabic text-xs font-bold text-teal-700">مختبر المعلم · ورقة عمل</p>
                <h3 className="font-arabic text-xl font-bold text-[#0B1220] mt-1">
                  {deck.title.ar}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border border-slate-300 rounded-xl p-3 bg-[#FAF8F4]">
              <div>Établissement / المؤسسة : ________________________</div>
              <div>Nom / الاسم الكامل : _____________________________</div>
            </div>

            <div className="space-y-4">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="rounded-xl border border-slate-300 p-4 break-inside-avoid space-y-2"
                >
                  <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-1.5">
                    <h4 className="font-bold text-sm text-[#0B1220]">
                      {idx + 1}. {slide.title.fr}
                    </h4>
                    <h5 dir="rtl" lang="ar" className="font-arabic font-bold text-sm text-teal-800">
                      {slide.title.ar}
                    </h5>
                  </div>
                  {(slide.notes.fr || slide.notes.ar) && (
                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-700">
                      <p>{slide.notes.fr}</p>
                      <p dir="rtl" lang="ar" className="font-arabic text-right text-slate-800">
                        {slide.notes.ar}
                      </p>
                    </div>
                  )}
                  {(slide.notes.classroomExampleFr || slide.notes.discussionPromptFr) && (
                    <div className="rounded-lg bg-[#FAF8F4] px-3 py-2 text-xs text-teal-950">
                      <strong>Classe · القسم :</strong>{" "}
                      {slide.notes.classroomExampleFr || slide.notes.discussionPromptFr}
                    </div>
                  )}
                  <div className="pt-2 text-[11px] text-slate-400">
                    Notes personnelles / ملاحظات : _______________________________________________________
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
