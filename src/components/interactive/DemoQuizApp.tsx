"use client";

import React, { useState } from "react";
import { BookOpen, CheckCircle2, Code2, RotateCcw, WifiOff, XCircle } from "lucide-react";
import { DEMO_QUIZ_QUESTIONS, DEMO_QUIZ_TEXT } from "@/content/use-cases";
import { CopyPromptButton } from "@/components/ui/CopyPromptButton";

export function DemoQuizApp({ large = false }: { large?: boolean }) {
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
            <BookOpen className="h-3.5 w-3.5 text-cyan-300" />
            {DEMO_QUIZ_TEXT.grade}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            <WifiOff className="h-3.5 w-3.5" />
            Fonctionne hors ligne · Zéro compte élève
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowPrompt((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-teal-500 cursor-pointer"
        >
          <Code2 className="h-3.5 w-3.5 text-teal-700" />
          <span>{showPrompt ? "Masquer le prompt" : "Voir Prompt → Prototype"}</span>
        </button>
      </div>

      {showPrompt && (
        <div className="rounded-2xl border border-slate-800 bg-[#0B1426] p-4 text-slate-100">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Prompt source ayant généré ce prototype
            </span>
            <CopyPromptButton text={DEMO_QUIZ_TEXT.sourcePrompt} label="Copier le prompt" />
          </div>
          <pre className="font-mono-code whitespace-pre-wrap text-xs leading-relaxed">
            {DEMO_QUIZ_TEXT.sourcePrompt}
          </pre>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-ivory-50 p-5 shadow-xs">
          <h4 className={`font-display font-bold text-slate-900 ${large ? "text-2xl" : "text-lg"}`}>
            {DEMO_QUIZ_TEXT.title}
          </h4>
          <div className="mt-3 space-y-3">
            {DEMO_QUIZ_TEXT.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className={`leading-relaxed text-slate-800 ${
                  large ? "text-lg" : "text-sm"
                }`}
              >
                {p}
              </p>
            ))}
          </div>
          <p className="mt-4 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
            Support d&apos;exemple validable et modifiable librement par l&apos;enseignant.
          </p>
        </div>

        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          {!finished ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-teal-700">
                  Question {currentIdx + 1} / {DEMO_QUIZ_QUESTIONS.length}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-800">
                  Score : {score} / {DEMO_QUIZ_QUESTIONS.length}
                </span>
              </div>

              <h5 className={`font-bold text-slate-900 ${large ? "text-xl" : "text-base"}`}>
                {q.question}
              </h5>

              <div className="space-y-2.5">
                {q.options.map((opt, idx) => {
                  const answered = selectedIdx !== null;
                  const isSelected = selectedIdx === idx;
                  const isCorrect = idx === q.correctIndex;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={answered}
                      onClick={() => handleSelect(idx)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                        answered
                          ? isCorrect
                            ? "border-teal-600 bg-teal-50 font-semibold text-teal-950"
                            : isSelected
                              ? "border-amber-600 bg-amber-50 text-amber-950"
                              : "border-slate-200 bg-slate-50 text-slate-500"
                          : "border-slate-200 bg-white text-slate-900 hover:border-teal-500 cursor-pointer"
                      } ${large ? "text-base" : "text-sm"}`}
                    >
                      <span>{opt}</span>
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
                  <p>
                    <strong>Explication :</strong> {q.explanation}
                  </p>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white hover:bg-navy-800 cursor-pointer"
                  >
                    {currentIdx + 1 >= DEMO_QUIZ_QUESTIONS.length
                      ? "Voir le bilan final"
                      : "Question suivante →"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="rounded-full bg-teal-50 px-5 py-2 text-sm font-bold text-teal-800">
                Bilan de la lecture
              </div>
              <p className="font-display text-4xl font-bold text-navy-900">
                {score} / {DEMO_QUIZ_QUESTIONS.length}
              </p>
              <p className="max-w-sm text-sm text-slate-600">
                {score >= 4
                  ? "Excellente compréhension du récit !"
                  : "Bon essai ! Relisons ensemble les passages clés du texte."}
              </p>
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Recommencer</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
