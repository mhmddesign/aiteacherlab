"use client";

import React, { useState } from "react";
import { CheckCircle2, HelpCircle, Lock, XCircle } from "lucide-react";
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
  onSubmitted?: () => void;
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
  onSubmitted,
}: QuizWidgetProps) {
  const activity = getActivityByKey(activityKey);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!activity || !activity.questions) return null;

  const isRevealed = status === "revealed";
  const isOpen = status === "open" && !isPaused;

  const handleAnswer = async (questionId: string, optionId: string) => {
    if (!canSubmit || !isOpen || pendingKey) return;
    if (myResponses.some((r) => r.itemKey === questionId)) return;

    setPendingKey(questionId);
    setError(null);
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
        setError(
          data.error ??
            "Impossible d'enregistrer cette réponse. / تعذر حفظ هذه الإجابة."
        );
        return;
      }
      onSubmitted?.();
    } catch {
      setError(
        "Problème réseau : veuillez réessayer pour enregistrer votre réponse. / مشكل في الشبكة: يرجى المحاولة مرة أخرى."
      );
    } finally {
      setPendingKey(null);
    }
  };

  const myCorrectCount = myResponses.filter((r) => r.isCorrect).length;

  return (
    <div className="space-y-4">
      {canSubmit && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold">
          <span className="text-slate-700">
            Progression : {myResponses.length} / {activity.questions.length} ·{" "}
            <span dir="rtl" lang="ar" className="font-arabic text-teal-800">
              التقدم: {myResponses.length} / {activity.questions.length}
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
            <span className="text-cyan-700">
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

      {error && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-900">
          {error}
        </div>
      )}

      <div className={`grid gap-4 ${large ? "lg:grid-cols-2" : ""}`}>
        {activity.questions.map((q, idx) => {
          const mine = myResponses.find((r) => r.itemKey === q.id);
          const tally = aggregate?.questionTallies?.find((t) => t.questionId === q.id);

          return (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="w-full space-y-1.5">
                  <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    Q{idx + 1} · س{idx + 1}
                  </span>
                  <BilingualBlock
                    text={q.prompt}
                    frClassName={`font-bold text-slate-900 ${large ? "text-lg leading-snug" : "text-sm leading-snug"}`}
                    arClassName={`font-bold text-teal-900 ${large ? "text-base leading-snug" : "text-sm leading-snug"}`}
                  />
                  {q.darijaHint && (
                    <p
                      dir="rtl"
                      lang="ar"
                      className="font-arabic text-xs font-medium text-cyan-800"
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
                  const isMine = mine?.selectedOption === opt.id;
                  const isCorrectOpt = isRevealed && tally?.correctOptionId === opt.id;
                  const optTally = tally?.options.find((o) => o.optionId === opt.id);

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={!canSubmit || !isOpen || Boolean(mine) || pendingKey === q.id}
                      onClick={() => handleAnswer(q.id, opt.id)}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-left transition ${
                        isCorrectOpt
                          ? "border-teal-600 bg-teal-50 text-teal-950 font-semibold"
                          : isMine
                            ? "border-cyan-600 bg-cyan-50 text-slate-950 font-semibold"
                            : "border-slate-200 bg-slate-50/70 text-slate-800 hover:border-teal-400"
                      } ${!canSubmit || !isOpen || Boolean(mine) ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                        <BilingualBlock
                          text={opt.label}
                          className="flex-1"
                          frClassName="text-xs sm:text-sm"
                          arClassName="text-xs sm:text-sm text-teal-900"
                        />
                        {(showResults || isRevealed || !canSubmit) && optTally && (
                          <span className="shrink-0 font-mono-code text-xs font-bold text-slate-600">
                            {optTally.count} ({optTally.percentage}%)
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

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
