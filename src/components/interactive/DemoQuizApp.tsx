"use client";

import React, { useState } from "react";
import { BookOpen, CheckCircle2, Code2, RotateCcw, WifiOff, XCircle } from "lucide-react";
import { DEMO_QUIZ_QUESTIONS, DEMO_QUIZ_TEXT } from "@/content/use-cases";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
import { CopyPromptButton } from "@/components/ui/CopyPromptButton";

export function DemoQuizApp({
  large = false,
  canvas = false,
}: {
  large?: boolean;
  canvas?: boolean;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const q = DEMO_QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    if (idx === q.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= DEMO_QUIZ_QUESTIONS.length) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedIdx(null);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-white">
            <BookOpen className="h-3.5 w-3.5 text-cyan-300 shrink-0" />
            <BilingualInline text={DEMO_QUIZ_TEXT.grade} />
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            <WifiOff className="h-3.5 w-3.5 shrink-0" />
            <BilingualInline
              text={{
                fr: "Hors ligne · Zéro compte élève",
                ar: "بدون إنترنت · دون حساب تلميذ",
              }}
            />
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowPrompt((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-teal-500 cursor-pointer"
        >
          <Code2 className="h-3.5 w-3.5 text-teal-700 shrink-0" />
          {showPrompt ? (
            <BilingualInline
              text={{ fr: "Masquer le prompt", ar: "إخفاء التوجيه" }}
            />
          ) : (
            <BilingualInline
              text={{ fr: "Voir Prompt → Prototype", ar: "عرض التوجيه ← النموذج" }}
            />
          )}
        </button>
      </div>

      {showPrompt && (
        <div
          className={`rounded-2xl border border-slate-800 bg-[#0B1426] p-4 text-slate-100 space-y-3 ${
            canvas ? "h-[520px] overflow-y-auto" : ""
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Prompts sources (FR & AR) · التوجيهات المصدرية
            </span>
            <div className="flex flex-wrap gap-2">
              <CopyPromptButton text={DEMO_QUIZ_TEXT.sourcePromptFr} label="Copier FR" labelAr="نسخ FR" />
              <CopyPromptButton text={DEMO_QUIZ_TEXT.sourcePromptAr} label="Copier AR" labelAr="نسخ AR" />
            </div>
          </div>
          <div className={canvas ? "grid grid-cols-2 gap-5" : "space-y-3"}>
            <pre dir="ltr" className="font-mono-code whitespace-pre-wrap text-[13px] leading-relaxed">
              {DEMO_QUIZ_TEXT.sourcePromptFr}
            </pre>
            <pre
              dir="rtl"
              lang="ar"
              className={`font-arabic whitespace-pre-wrap text-[14px] leading-relaxed text-cyan-100 ${
                canvas ? "border-l border-slate-700 pl-5" : "border-t border-slate-700 pt-3"
              }`}
            >
              {DEMO_QUIZ_TEXT.sourcePromptAr}
            </pre>
          </div>
        </div>
      )}

      {!(canvas && showPrompt) && (
        <div className={canvas ? "grid grid-cols-12 gap-6 items-stretch" : "grid gap-5 lg:grid-cols-12"}>
          <div
            className={`${
              canvas ? "col-span-6 h-[520px] overflow-y-auto" : "lg:col-span-6"
            } rounded-2xl border border-slate-200 bg-ivory-50 p-5 shadow-xs space-y-3.5`}
          >
            <BilingualBlock
              text={DEMO_QUIZ_TEXT.title}
              frClassName={`font-display font-bold text-slate-900 ${large ? "text-xl" : "text-lg"}`}
              arClassName={`font-bold text-teal-900 ${large ? "text-lg" : "text-base"}`}
            />

            <div className="space-y-2" dir="ltr" lang="fr">
              {DEMO_QUIZ_TEXT.paragraphsFr.map((p, idx) => (
                <p key={idx} className={`leading-relaxed text-slate-800 ${large ? "text-[14px]" : "text-sm"}`}>
                  {p}
                </p>
              ))}
            </div>

            <div
              dir="rtl"
              lang="ar"
              className="font-arabic space-y-2 rounded-xl border border-teal-200/80 bg-white p-3.5"
            >
              {DEMO_QUIZ_TEXT.paragraphsAr.map((p, idx) => (
                <p key={idx} className={`leading-relaxed text-slate-900 ${large ? "text-[14px]" : "text-sm"}`}>
                  {p}
                </p>
              ))}
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-900">
              <BilingualBlock
                text={{
                  fr: "Support d'exemple validable et modifiable librement par l'enseignant.",
                  ar: "نموذج تجريبي قابل للمراجعة والتعديل بحرية من طرف الأستاذ(ة).",
                }}
              />
            </div>
          </div>

          <div
            className={`${
              canvas ? "col-span-6 h-[520px] overflow-y-auto" : "lg:col-span-6"
            } rounded-2xl border border-slate-200 bg-white p-5 shadow-xs`}
          >
          {!finished ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                <span className="text-teal-700">
                  Question {currentIdx + 1} / {DEMO_QUIZ_QUESTIONS.length} ·{" "}
                  <span dir="rtl" lang="ar" className="font-arabic">
                    السؤال {currentIdx + 1} / {DEMO_QUIZ_QUESTIONS.length}
                  </span>
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-800">
                  Score / النتيجة : {score} / {DEMO_QUIZ_QUESTIONS.length}
                </span>
              </div>

              <BilingualBlock
                text={q.question}
                frClassName={`font-bold text-slate-900 ${large ? "text-xl" : "text-base"}`}
                arClassName={`font-bold text-teal-900 ${large ? "text-lg" : "text-sm"}`}
              />

              <div className="space-y-2.5">
                {q.options.map((opt, idx) => {
                  const answered = selectedIdx !== null;
                  const isSelected = selectedIdx === idx;
                  const isCorrect = idx === q.correctIndex;
                  return (
                    <button
                      key={opt.fr}
                      type="button"
                      disabled={answered}
                      onClick={() => handleSelect(idx)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition ${
                        answered
                          ? isCorrect
                            ? "border-teal-600 bg-teal-50 font-semibold text-teal-950"
                            : isSelected
                              ? "border-amber-600 bg-amber-50 text-amber-950"
                              : "border-slate-200 bg-slate-50 text-slate-500"
                          : "border-slate-200 bg-white text-slate-900 hover:border-teal-500 cursor-pointer"
                      }`}
                    >
                      <BilingualBlock
                        text={opt}
                        className="flex-1"
                        frClassName={large ? "text-base" : "text-sm"}
                        arClassName={large ? "text-sm text-teal-900" : "text-xs sm:text-sm text-teal-900"}
                      />
                      {answered && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" />
                      )}
                      {answered && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 shrink-0 text-amber-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedIdx !== null && (
                <div className="space-y-3 rounded-xl border border-teal-200 bg-teal-50/70 p-3.5 text-xs sm:text-sm text-slate-800">
                  <BilingualBlock
                    text={q.explanation}
                    frClassName="text-xs sm:text-sm"
                    arClassName="text-xs sm:text-sm text-teal-950"
                  />
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white hover:bg-navy-800 cursor-pointer"
                  >
                    {currentIdx + 1 >= DEMO_QUIZ_QUESTIONS.length ? (
                      <BilingualInline
                        text={{ fr: "Voir le bilan final", ar: "عرض الحصيلة النهائية" }}
                      />
                    ) : (
                      <BilingualInline
                        text={{ fr: "Question suivante →", ar: "السؤال الموالي ←" }}
                      />
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="rounded-full bg-teal-50 px-5 py-2 text-sm font-bold text-teal-800">
                <BilingualInline
                  text={{ fr: "Bilan de la lecture", ar: "حصيلة القراءة والفهم" }}
                />
              </div>
              <p className="font-display text-4xl font-bold text-navy-900">
                {score} / {DEMO_QUIZ_QUESTIONS.length}
              </p>
              <BilingualBlock
                text={
                  score >= 4
                    ? {
                        fr: "Excellente compréhension du récit !",
                        ar: "فهم ممتاز للنص السردي!",
                      }
                    : {
                        fr: "Bon essai ! Relisons ensemble les passages clés du texte.",
                        ar: "محاولة طيبة! لنعد معاً قراءة المقاطع الأساسية في النص.",
                      }
                }
                className="max-w-sm"
                frClassName="text-sm text-slate-600"
                arClassName="text-sm text-teal-900"
              />
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 shrink-0" />
                <BilingualInline text={{ fr: "Recommencer", ar: "إعادة المحاولة" }} />
              </button>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
