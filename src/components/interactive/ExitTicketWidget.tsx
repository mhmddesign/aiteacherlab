"use client";

import React, { useState } from "react";
import { CheckCircle2, Lock, MessageSquareHeart, Send } from "lucide-react";
import { getActivityByKey } from "@/content/activities";
import type {
  ActivityAggregate,
  ActivityStatus,
  ParticipantResponseItem,
} from "@/content/types";
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
      setError("Écrivez au moins une courte phrase (5 caractères min.).");
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
        setError(data.error ?? "Impossible d'envoyer votre ticket de sortie.");
        return;
      }
      onSubmitted?.();
    } catch {
      setError("Problème de connexion. Réessayez.");
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900">{activity.instruction}</h4>
            {existing ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Engagement enregistré
              </span>
            ) : status !== "open" || isPaused ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                <Lock className="h-3.5 w-3.5" />
                {isPaused ? "En pause" : "Fermé"}
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
                {opt.label}
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
            placeholder="Ex. : Préparer 3 fiches graduées en lecture 4AEP pour ma séance de jeudi..."
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
              <span>{submitting ? "Envoi..." : "Envoyer mon engagement"}</span>
            </button>
          )}
        </form>
      )}

      {(showResults || status === "revealed" || status === "closed" || !canSubmit) && aggregate && (
        <div className="grid gap-4 lg:grid-cols-12">
          {aggregate.optionTallies && (
            <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <h4 className="mb-2 text-sm font-bold text-slate-900">
                Axes choisis cette semaine
              </h4>
              <OptionBarChart data={aggregate.optionTallies} height={240} />
            </div>
          )}

          <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <h4 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-slate-900">
              <MessageSquareHeart className="h-4 w-4 text-teal-600" />
              Mur d&apos;engagements de Mediouna (anonyme)
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
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
                <p className="text-xs text-slate-500">
                  Les engagements des collègues apparaîtront ici en direct.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
