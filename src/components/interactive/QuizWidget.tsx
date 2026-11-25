"use client";

import React, { useState } from "react";
import { CheckCircle2, HelpCircle, Loader2, Lock, XCircle } from "lucide-react";
import { getActivityByKey } from "@/content/activities";
import type {
  ActivityAggregate,
  ActivityStatus,
  ParticipantResponseItem,
} from "@/content/types";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";

interface QuizWidgetProps {
  activityKey: string;
  status: ActivityStatus;
  showResults: boolean;
  isPaused: boolean;
  aggregate: ActivityAggregate | null;
  myResponses?: ParticipantResponseItem[];
  canSubmit: boolean;
  large?: boolean;
  canvas?: boolean;
  onSubmitted?: (savedResponse?: ParticipantResponseItem) => void;
}

interface QuestionLocalState {
  optionId: string;
  status: "saving" | "saved" | "error";
  error?: string;
}

export function QuizWidget({
  activityKey,
  status,
  showResults,
  isPaused,
  aggregate,
  myResponses = [],
  canSubmit,
  large = false,
  canvas = false,
  onSubmitted,
}: QuizWidgetProps) {
  const activity = getActivityByKey(activityKey);
  const [localByQuestion, setLocalByQuestion] = useState<Record<string, QuestionLocalState>>({});
  const [focusIdx, setFocusIdx] = useState(0);

  if (!activity || !activity.questions) return null;

  const isRevealed = status === "revealed";
  const isOpen = status === "open" && !isPaused;

  const handleAnswer = async (questionId: string, optionId: string) => {
    const existing = myResponses.find((r) => r.itemKey === questionId);
    const currentLocal = localByQuestion[questionId];
    if (!canSubmit || !isOpen || existing || currentLocal?.status === "saving") return;

    setLocalByQuestion((prev) => ({
      ...prev,
      [questionId]: { optionId, status: "saving" },
    }));

    try {
      const res = await fetch("/api/participant/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityKey,
          itemKey: questionId,
          selectedOption: optionId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLocalByQuestion((prev) => ({
          ...prev,
          [questionId]: {
            optionId,
            status: "error",
            error:
              data.error ??
              "Impossible d'enregistrer cette réponse. / تعذر حفظ هذه الإجابة.",
          },
        }));
        return;
      }
      setLocalByQuestion((prev) => ({
        ...prev,
        [questionId]: { optionId, status: "saved" },
      }));
      onSubmitted?.(data.response as ParticipantResponseItem | undefined);
    } catch {
      setLocalByQuestion((prev) => ({
        ...prev,
        [questionId]: {
          optionId,
          status: "error",
          error:
            "Problème réseau : veuillez réessayer. / مشكل في الشبكة: يرجى المحاولة مرة أخرى.",
        },
      }));
    }
  };

  const answeredCount = new Set([
    ...myResponses.map((r) => r.itemKey),
    ...Object.entries(localByQuestion)
      .filter(([, s]) => s.status === "saving" || s.status === "saved")
      .map(([k]) => k),
  ]).size;
  const myCorrectCount = myResponses.filter((r) => r.isCorrect).length;

  if (canvas && !canSubmit) {
    const activeIdx = Math.min(focusIdx, activity.questions.length - 1);
    const q = activity.questions[activeIdx];
    const tally = aggregate?.questionTallies?.find((t) => t.questionId === q.id);
    const isTwoOpt = q.options.length === 2;

    return (
      <div className="space-y-4">
        {/* Projector Question Selector Tabs */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {activity.questions.map((item, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFocusIdx(idx)}
                  className={`rounded-2xl px-6 py-2 text-[22px] font-bold transition cursor-pointer ${
                    isActive
                      ? "bg-[#0F766E] text-white shadow-md ring-2 ring-teal-300"
                      : "border-2 border-slate-200 bg-white text-slate-700 hover:border-teal-500"
                  }`}
                >
                  Q{idx + 1} · <span className="font-arabic">س{idx + 1}</span>
                </button>
              );
            })}
          </div>

          <span className="rounded-full bg-slate-100 px-5 py-2 text-[22px] font-bold text-slate-700 tabular-nums">
            {aggregate?.totalRespondents ?? 0} participants ·{" "}
            <span dir="rtl" lang="ar" className="font-arabic text-teal-800">
              {aggregate?.totalRespondents ?? 0} مشارك(ة)
            </span>
          </span>
        </div>

        {/* High-Impact Classroom Spotlight Question */}
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="space-y-1.5">
            <BilingualBlock
              text={q.prompt}
              frClassName="font-display text-[36px] font-bold leading-[1.15] text-[#0F172A]"
              arClassName="text-[34px] font-bold leading-[1.3] text-teal-800"
            />
          </div>

          <div
            data-slide-body="true"
            className={isTwoOpt ? "grid grid-cols-2 gap-6 pt-1" : "space-y-3"}
          >
            {q.options.map((opt) => {
              const isCorrectOpt = isRevealed && tally?.correctOptionId === opt.id;
              const optTally = tally?.options.find((o) => o.optionId === opt.id);
              return (
                <div
                  key={opt.id}
                  className={`rounded-2xl border-2 px-6 py-3 flex items-center justify-between gap-6 ${
                    isCorrectOpt
                      ? "border-teal-600 bg-teal-50 text-teal-950 font-bold"
                      : "border-slate-200 bg-[#FAF8F4] text-slate-900"
                  }`}
                >
                  <BilingualBlock
                    text={opt.label}
                    className="flex-1 min-w-0"
                    frClassName="text-[26px] font-semibold leading-snug"
                    arClassName="text-[28px] font-semibold leading-snug text-teal-900"
                  />
                  {optTally && (
                    <span className="font-mono-code text-[28px] font-bold text-slate-800 shrink-0 tabular-nums">
                      {optTally.count} ({optTally.percentage}%)
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {isRevealed && tally?.explanation && (
            <div className="flex items-start gap-4 rounded-2xl border-2 border-teal-200 bg-teal-50/80 px-5 py-3 text-slate-900">
              <HelpCircle className="mt-1 h-6 w-6 shrink-0 text-teal-700" />
              <BilingualBlock
                text={tally.explanation}
                className="flex-1"
                frClassName="text-[22px] leading-snug font-medium"
                arClassName="text-[24px] leading-snug text-teal-950 font-medium"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canSubmit && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold">
          <span className="text-slate-700">
            Progression : {answeredCount} / {activity.questions.length} ·{" "}
            <span dir="rtl" lang="ar" className="font-arabic text-teal-800">
              التقدم: {answeredCount} / {activity.questions.length}
            </span>
          </span>
          {isRevealed ? (
            <span className="text-teal-700">
              Réponses révélées · Votre score : {myCorrectCount} / {activity.questions.length} ·{" "}
              <span dir="rtl" lang="ar" className="font-arabic">
                تم كشف التصحيح · نتيجتكم: {myCorrectCount} / {activity.questions.length}
              </span>
            </span>
          ) : isOpen ? (
            <span className="text-teal-700">
              <BilingualInline
                text={{
                  fr: "Répondez question par question",
                  ar: "أجيبوا سؤالاً بسؤال",
                }}
              />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-700">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              {isPaused ? (
                <BilingualInline text={{ fr: "Atelier en pause", ar: "الورشة في استراحة" }} />
              ) : (
                <BilingualInline text={{ fr: "Quiz verrouillé", ar: "الرائز مغلق" }} />
              )}
            </span>
          )}
        </div>
      )}

      <div className={`grid gap-4 ${large ? "lg:grid-cols-2" : ""}`}>
        {activity.questions.map((q, idx) => {
          const mine = myResponses.find((r) => r.itemKey === q.id);
          const localState = localByQuestion[q.id];
          const isSaving = !mine && localState?.status === "saving";
          const isSaved = Boolean(mine) || localState?.status === "saved";
          const hasError = !mine && localState?.status === "error";
          const chosenOptionId = mine?.selectedOption ?? (isSaving || localState?.status === "saved" ? localState?.optionId : undefined);
          const tally = aggregate?.questionTallies?.find((t) => t.questionId === q.id);
          const questionLocked = !canSubmit || !isOpen || Boolean(mine) || isSaving;

          return (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="w-full space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                      Q{idx + 1} · س{idx + 1}
                    </span>
                    {canSubmit && (
                      <span className="text-[11px] font-semibold" aria-live="polite">
                        {isSaving ? (
                          <span className="text-teal-700">
                            <BilingualInline text={{ fr: "Enregistrement...", ar: "جاري الحفظ..." }} />
                          </span>
                        ) : isSaved && !isRevealed ? (
                          <span className="inline-flex items-center gap-1 text-teal-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <BilingualInline text={{ fr: "Réponse enregistrée", ar: "تم حفظ الإجابة" }} />
                          </span>
                        ) : null}
                      </span>
                    )}
                  </div>
                  <BilingualBlock
                    text={q.prompt}
                    frClassName={`font-bold text-slate-900 ${large ? "text-lg leading-snug" : "text-sm leading-snug"}`}
                    arClassName={`font-bold text-teal-900 ${large ? "text-base leading-snug" : "text-sm leading-snug"}`}
                  />
                  {q.darijaHint && (
                    <p
                      dir="rtl"
                      lang="ar"
                      className="font-arabic text-xs font-medium text-teal-800"
                    >
                      {q.darijaHint}
                    </p>
                  )}
                </div>
                {isRevealed && mine && (
                  <span className="shrink-0">
                    {mine.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-amber-600" />
                    )}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isMine = chosenOptionId === opt.id;
                  const isCorrectOpt = isRevealed && tally?.correctOptionId === opt.id;
                  const optTally = tally?.options.find((o) => o.optionId === opt.id);

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      aria-pressed={isMine}
                      disabled={questionLocked}
                      onClick={() => handleAnswer(q.id, opt.id)}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-left transition-all duration-150 active:scale-[0.99] ${
                        isCorrectOpt
                          ? "border-teal-600 bg-teal-50 text-teal-950 font-semibold"
                          : isMine
                            ? "border-teal-600 bg-teal-50/90 text-slate-950 font-semibold ring-2 ring-teal-500/25"
                            : "border-slate-200 bg-slate-50/70 text-slate-800 hover:border-teal-400"
                      } ${questionLocked ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                        <BilingualBlock
                          text={opt.label}
                          className="flex-1"
                          frClassName="text-xs sm:text-sm"
                          arClassName="text-xs sm:text-sm text-teal-900"
                        />
                        <div className="flex items-center gap-2 shrink-0">
                          {isMine && !isRevealed && (
                            isSaving ? (
                              <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-teal-600" />
                            )
                          )}
                          {(showResults || isRevealed || !canSubmit) && optTally && (
                            <span className="font-mono-code text-xs font-bold text-slate-600">
                              {optTally.count} ({optTally.percentage}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {hasError && localState?.error && (
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                  <span>{localState.error}</span>
                  {isOpen && (
                    <button
                      type="button"
                      onClick={() => handleAnswer(q.id, localState.optionId)}
                      className="rounded-lg bg-amber-600 px-2.5 py-1 font-bold text-white hover:bg-amber-700 cursor-pointer"
                    >
                      <BilingualInline text={{ fr: "Réessayer", ar: "إعادة المحاولة" }} />
                    </button>
                  )}
                </div>
              )}

              {isRevealed && tally?.explanation && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-teal-200 bg-teal-50/70 p-3 text-xs text-slate-800">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                  <BilingualBlock
                    text={tally.explanation}
                    className="flex-1"
                    frClassName="text-xs"
                    arClassName="text-xs text-teal-950"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
