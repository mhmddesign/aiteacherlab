"use client";

import React, { useState } from "react";
import { CheckCircle2, Lock, Send } from "lucide-react";
import { getActivityByKey } from "@/content/activities";
import type {
  ActivityAggregate,
  ActivityStatus,
  ParticipantResponseItem,
} from "@/content/types";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
import { OptionBarChart } from "@/components/ui/LiveChart";

interface LivePollWidgetProps {
  activityKey: string;
  status: ActivityStatus;
  showResults: boolean;
  isPaused: boolean;
  aggregate: ActivityAggregate | null;
  myResponses?: ParticipantResponseItem[];
  canSubmit: boolean;
  large?: boolean;
  onSubmitted?: (savedResponse?: ParticipantResponseItem) => void;
}

export function LivePollWidget({
  activityKey,
  status,
  showResults,
  isPaused,
  aggregate,
  myResponses = [],
  canSubmit,
  large = false,
  onSubmitted,
}: LivePollWidgetProps) {
  const activity = getActivityByKey(activityKey);
  const existing = myResponses.find((r) => r.itemKey === "main");
  const [optimisticOption, setOptimisticOption] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastAttemptOption, setLastAttemptOption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const activeSelection = existing?.selectedOption ?? optimisticOption ?? "";

  if (!activity || !activity.options) return null;

  const isLocked = isPaused || status !== "open" || Boolean(existing);

  const handleSubmit = async (optionId: string) => {
    if (!canSubmit || isLocked || saveState === "saving") return;
    setOptimisticOption(optionId);
    setLastAttemptOption(optionId);
    setSaveState("saving");
    setError(null);
    try {
      const res = await fetch("/api/participant/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityKey,
          itemKey: "main",
          selectedOption: optionId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOptimisticOption(null);
        setSaveState("error");
        setError(
          data.error ??
            "Impossible d'envoyer votre vote. / تعذر إرسال تصويتكم."
        );
        return;
      }
      setSaveState("saved");
      onSubmitted?.(data.response as ParticipantResponseItem | undefined);
    } catch {
      setOptimisticOption(null);
      setSaveState("error");
      setError(
        "Connexion instable : votre réponse n'a pas pu être envoyée. / اتصال غير مستقر: تعذر إرسال إجابتكم."
      );
    }
  };

  const shouldShowChart =
    showResults || status === "revealed" || status === "closed" || !canSubmit;

  return (
    <div className="space-y-5">
      {canSubmit && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2 text-xs font-semibold">
            <BilingualBlock
              text={activity.instruction}
              frClassName="text-slate-700"
              arClassName="text-teal-900 text-xs"
            />
            <div className="flex flex-wrap items-center gap-1.5" aria-live="polite">
              {saveState === "saving" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-teal-800 transition-opacity">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <BilingualInline text={{ fr: "Enregistrement...", ar: "جاري الحفظ..." }} />
                </span>
              )}
              {(existing || saveState === "saved") && saveState !== "saving" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-teal-800">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <BilingualInline
                    text={{ fr: "Réponse enregistrée", ar: "تم حفظ الإجابة" }}
                  />
                </span>
              )}
              {status !== "open" || isPaused ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-800">
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                  {isPaused ? (
                    <BilingualInline text={{ fr: "Atelier en pause", ar: "الورشة في استراحة" }} />
                  ) : status === "closed" || status === "revealed" ? (
                    <BilingualInline text={{ fr: "Sondage clôturé", ar: "الاستطلاع مغلق" }} />
                  ) : (
                    <BilingualInline text={{ fr: "En attente d'ouverture", ar: "في انتظار الفتح" }} />
                  )}
                </span>
              ) : !existing && saveState !== "saving" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 text-cyan-800">
                  <Send className="h-3.5 w-3.5 shrink-0" />
                  <BilingualInline text={{ fr: "Ouvert aux votes", ar: "مفتوح للتصويت" }} />
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {activity.options.map((opt) => {
              const isChosen =
                activeSelection === opt.id &&
                (Boolean(existing) || saveState === "saving" || saveState === "saved");
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={isChosen}
                  disabled={isLocked || saveState === "saving"}
                  onClick={() => handleSubmit(opt.id)}
                  className={`flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all duration-150 active:scale-[0.99] ${
                    isChosen
                      ? "border-teal-600 bg-teal-50/90 text-teal-950 ring-2 ring-teal-500/30"
                      : "border-slate-200 bg-white text-slate-900 hover:border-teal-400 hover:bg-slate-50"
                  } ${isLocked ? "cursor-default opacity-85" : "cursor-pointer"}`}
                >
                  <div className="flex-1">
                    <BilingualBlock
                      text={opt.label}
                      frClassName="text-sm font-bold"
                      arClassName="text-sm font-bold text-teal-900"
                    />
                    {opt.description && (
                      <BilingualBlock
                        text={opt.description}
                        className="mt-1.5"
                        frClassName="text-xs text-slate-600"
                        arClassName="text-xs text-slate-600"
                      />
                    )}
                  </div>
                  {isChosen && (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                  )}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-900">
              <span>{error}</span>
              {lastAttemptOption && status === "open" && !isPaused && (
                <button
                  type="button"
                  onClick={() => handleSubmit(lastAttemptOption)}
                  className="rounded-lg bg-amber-600 px-3 py-1 font-bold text-white hover:bg-amber-700 cursor-pointer"
                >
                  <BilingualInline text={{ fr: "Réessayer", ar: "إعادة المحاولة" }} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {shouldShowChart && aggregate?.optionTallies && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className={`font-bold text-slate-900 ${large ? "text-xl" : "text-sm"}`}>
                Résultats en direct
              </h4>
              <p
                dir="rtl"
                lang="ar"
                className={`font-arabic font-bold text-teal-800 ${large ? "text-lg" : "text-xs"}`}
              >
                النتائج المباشرة
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {aggregate.totalRespondents} participant{aggregate.totalRespondents > 1 ? "s" : ""} ·{" "}
              <span dir="rtl" lang="ar" className="font-arabic">
                {aggregate.totalRespondents} مشارك(ة)
              </span>
            </span>
          </div>
          <OptionBarChart
            data={aggregate.optionTallies}
            height={large ? 360 : 280}
            large={large}
          />
        </div>
      )}
    </div>
  );
}
