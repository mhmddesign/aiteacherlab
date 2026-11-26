"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Lock, MessageSquareHeart, Send } from "lucide-react";
import { getActivityByKey } from "@/content/activities";
import type {
  ActivityAggregate,
  ActivityStatus,
  ParticipantResponseItem,
} from "@/content/types";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
import { OptionBarChart } from "@/components/ui/LiveChart";

interface ExitTicketWidgetProps {
  status: ActivityStatus;
  showResults: boolean;
  isPaused: boolean;
  aggregate: ActivityAggregate | null;
  myResponses?: ParticipantResponseItem[];
  canSubmit: boolean;
  canvas?: boolean;
  onSubmitted?: (savedResponse?: ParticipantResponseItem) => void;
}

export function ExitTicketWidget({
  status,
  showResults,
  isPaused,
  aggregate,
  myResponses = [],
  canSubmit,
  canvas = false,
  onSubmitted,
}: ExitTicketWidgetProps) {
  const activity = getActivityByKey("exit-ticket");
  const existing = myResponses.find((r) => r.itemKey === "main");
  const [category, setCategory] = useState(
    existing?.selectedOption ?? activity?.options?.[0]?.id ?? "diff"
  );
  const [commitment, setCommitment] = useState("");
  const [optimisticSaved, setOptimisticSaved] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!activity || !activity.options) return null;

  const isLocked =
    isPaused ||
    status !== "open" ||
    Boolean(existing) ||
    saveState === "saving" ||
    saveState === "saved";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isLocked) return;
    const trimmed = commitment.trim();
    if (trimmed.length < 5) {
      setError(
        "Écrivez au moins une courte phrase (5 caractères min.). / اكتبوا جملة قصيرة على الأقل (5 أحرف)."
      );
      return;
    }
    setOptimisticSaved(trimmed);
    setSaveState("saving");
    setError(null);
    try {
      const res = await fetch("/api/participant/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityKey: "exit-ticket",
          itemKey: "main",
          selectedOption: category,
          payload: {
            category,
            commitment: trimmed,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOptimisticSaved(null);
        setSaveState("error");
        setError(
          data.error ??
            "Impossible d'envoyer votre ticket de sortie. / تعذر إرسال تذكرة الخروج."
        );
        return;
      }
      setSaveState("saved");
      onSubmitted?.(data.response as ParticipantResponseItem | undefined);
    } catch {
      setOptimisticSaved(null);
      setSaveState("error");
      setError("Problème de connexion. Réessayez. / مشكل في الاتصال، حاولوا مجدداً.");
    }
  };

  return (
    <div className="space-y-5">
      {canSubmit && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <BilingualBlock
              text={activity.instruction}
              frClassName="text-sm font-bold text-slate-900"
              arClassName="text-xs font-bold text-teal-800"
            />
            {existing || saveState === "saved" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800" aria-live="polite">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <BilingualInline text={{ fr: "Engagement enregistré", ar: "تم تسجيل الالتزام" }} />
              </span>
            ) : saveState === "saving" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800" aria-live="polite">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <BilingualInline text={{ fr: "Enregistrement...", ar: "جاري الحفظ..." }} />
              </span>
            ) : status !== "open" || isPaused ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                <Lock className="h-3.5 w-3.5" />
                {isPaused ? (
                  <BilingualInline text={{ fr: "En pause", ar: "استراحة" }} />
                ) : (
                  <BilingualInline text={{ fr: "Fermé", ar: "مغلق" }} />
                )}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {activity.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={isLocked}
                onClick={() => setCategory(opt.id)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  category === opt.id
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                <BilingualBlock
                  text={opt.label}
                  frClassName="text-xs"
                  arClassName={`text-[11px] ${category === opt.id ? "text-teal-50" : "text-teal-800"}`}
                />
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            disabled={isLocked}
            aria-label="Votre engagement cette semaine / التزامكم هذا الأسبوع"
            value={
              existing && typeof existing.payload.commitment === "string"
                ? existing.payload.commitment
                : optimisticSaved ?? commitment
            }
            onChange={(e) => setCommitment(e.target.value)}
            placeholder="Ex. : Préparer 3 fiches graduées en lecture 4AEP... / مثال: إعداد 3 بطاقات متدرجة للقراءة..."
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-base sm:text-sm text-slate-900"
          />

          {error && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              <span>{error}</span>
              {status === "open" && !isPaused && (
                <button
                  type="submit"
                  className="rounded-lg bg-amber-600 px-3 py-1 font-bold text-white hover:bg-amber-700 cursor-pointer"
                >
                  <BilingualInline text={{ fr: "Réessayer", ar: "إعادة المحاولة" }} />
                </button>
              )}
            </div>
          )}

          {!existing && saveState !== "saved" && (
            <button
              type="submit"
              disabled={isLocked}
              aria-busy={saveState === "saving"}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
            >
              {saveState === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
              <span>
                {saveState === "saving" ? (
                  "Enregistrement... / جاري الحفظ..."
                ) : (
                  <BilingualInline
                    text={{ fr: "Envoyer mon engagement", ar: "إرسال التزامي" }}
                  />
                )}
              </span>
            </button>
          )}
        </form>
      )}

      {(showResults || status === "revealed" || status === "closed" || !canSubmit) && aggregate && (
        <div className={canvas ? "grid grid-cols-12 gap-8 items-stretch" : "grid gap-4 lg:grid-cols-12"}>
          {aggregate.optionTallies && (
            <div
              className={`${
                canvas ? "col-span-6 p-7" : "lg:col-span-6 p-4"
              } rounded-2xl border-2 border-slate-200 bg-white shadow-xs`}
            >
              <BilingualBlock
                text={{
                  fr: "Axes choisis cette semaine",
                  ar: "المجالات المختارة هذا الأسبوع",
                }}
                className="mb-3"
                frClassName={canvas ? "text-[28px] font-bold text-slate-900" : "text-sm font-bold text-slate-900"}
                arClassName={canvas ? "text-[26px] font-bold text-teal-800" : "text-xs font-bold text-teal-800"}
              />
              <OptionBarChart
                data={aggregate.optionTallies}
                height={canvas ? 470 : 270}
                large={canvas}
                fixedHeight={canvas}
              />
            </div>
          )}

          <div
            data-slide-body="true"
            className={`${
              canvas ? "col-span-6 p-7" : "lg:col-span-6 p-4"
            } rounded-2xl border-2 border-slate-200 bg-white shadow-xs flex flex-col`}
          >
            <h4
              className={`mb-4 flex items-center gap-2 font-bold text-slate-900 ${
                canvas ? "text-[26px]" : "text-sm"
              }`}
            >
              <MessageSquareHeart className={`${canvas ? "h-7 w-7" : "h-4 w-4"} text-teal-600 shrink-0`} />
              <BilingualInline
                text={{
                  fr: "Mur d'engagements de Mediouna",
                  ar: "جدار التزامات مديونة",
                }}
              />
            </h4>
            <div
              className={`space-y-3 overflow-y-auto pr-1 ${
                canvas ? "max-h-[470px]" : "max-h-64"
              }`}
            >
              {aggregate.recentSnippets && aggregate.recentSnippets.length > 0 ? (
                aggregate.recentSnippets.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl border border-teal-100 bg-ivory-50 text-slate-800 ${
                      canvas ? "px-5 py-4 text-[28px] leading-snug" : "px-3.5 py-2.5 text-xs"
                    }`}
                  >
                    <span
                      className={`mr-2 inline-block rounded-md bg-teal-600 font-bold text-white ${
                        canvas ? "px-3.5 py-1 text-[20px]" : "px-2 py-0.5 text-[10px]"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span>{item.content}</span>
                  </div>
                ))
              ) : (
                <BilingualBlock
                  text={{
                    fr: "Les engagements des collègues apparaîtront ici en direct.",
                    ar: "ستظهر هنا التزامات الزملاء مباشرة.",
                  }}
                  frClassName={canvas ? "text-[28px] text-slate-600" : "text-xs text-slate-500"}
                  arClassName={canvas ? "text-[30px] text-slate-700" : "text-xs text-slate-500"}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
