"use client";

import React, { useState } from "react";
import { CheckCircle2, Lock, MessageSquareHeart, Send } from "lucide-react";
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
  onSubmitted?: () => void;
}

export function ExitTicketWidget({
  status,
  showResults,
  isPaused,
  aggregate,
  myResponses = [],
  canSubmit,
  onSubmitted,
}: ExitTicketWidgetProps) {
  const activity = getActivityByKey("exit-ticket");
  const existing = myResponses.find((r) => r.itemKey === "main");
  const [category, setCategory] = useState(
    existing?.selectedOption ?? activity?.options?.[0]?.id ?? "diff"
  );
  const [commitment, setCommitment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!activity || !activity.options) return null;

  const isLocked = isPaused || status !== "open" || Boolean(existing);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isLocked || submitting) return;
    if (commitment.trim().length < 5) {
      setError(
        "Écrivez au moins une courte phrase (5 caractères min.). / اكتبوا جملة قصيرة على الأقل (5 أحرف)."
      );
      return;
    }
    setSubmitting(true);
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
            commitment: commitment.trim(),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ??
            "Impossible d'envoyer votre ticket de sortie. / تعذر إرسال تذكرة الخروج."
        );
        return;
      }
      onSubmitted?.();
    } catch {
      setError("Problème de connexion. Réessayez. / مشكل في الاتصال، حاولوا مجدداً.");
    } finally {
      setSubmitting(false);
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
            {existing ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <BilingualInline text={{ fr: "Engagement enregistré", ar: "تم تسجيل الالتزام" }} />
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
            value={
              existing && typeof existing.payload.commitment === "string"
                ? existing.payload.commitment
                : commitment
            }
            onChange={(e) => setCommitment(e.target.value)}
            placeholder="Ex. : Préparer 3 fiches graduées en lecture 4AEP... / مثال: إعداد 3 بطاقات متدرجة للقراءة..."
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900"
          />

          {error && (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              {error}
            </p>
          )}

          {!existing && (
            <button
              type="submit"
              disabled={isLocked || submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>
                {submitting ? (
                  "Envoi... / إرسال..."
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
        <div className="grid gap-4 lg:grid-cols-12">
          {aggregate.optionTallies && (
            <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <BilingualBlock
                text={{
                  fr: "Axes choisis cette semaine",
                  ar: "المجالات المختارة هذا الأسبوع",
                }}
                className="mb-2"
                frClassName="text-sm font-bold text-slate-900"
                arClassName="text-xs font-bold text-teal-800"
              />
              <OptionBarChart data={aggregate.optionTallies} height={270} />
            </div>
          )}

          <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <h4 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-slate-900">
              <MessageSquareHeart className="h-4 w-4 text-teal-600 shrink-0" />
              <BilingualInline
                text={{
                  fr: "Mur d'engagements de Mediouna (anonyme)",
                  ar: "جدار التزامات مديونة (مجهول الهوية)",
                }}
              />
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {aggregate.recentSnippets && aggregate.recentSnippets.length > 0 ? (
                aggregate.recentSnippets.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-teal-100 bg-ivory-50 px-3.5 py-2.5 text-xs text-slate-800"
                  >
                    <span className="mr-2 inline-block rounded-md bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white">
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
                  frClassName="text-xs text-slate-500"
                  arClassName="text-xs text-slate-500"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
