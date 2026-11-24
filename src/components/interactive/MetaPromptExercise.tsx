"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, Lock, Send } from "lucide-react";
import type {
  ActivityAggregate,
  ActivityStatus,
  ParticipantResponseItem,
} from "@/content/types";
import { CopyPromptButton } from "@/components/ui/CopyPromptButton";
import { OptionBarChart } from "@/components/ui/LiveChart";

interface MetaPromptExerciseProps {
  status: ActivityStatus;
  isPaused: boolean;
  aggregate: ActivityAggregate | null;
  myResponses?: ParticipantResponseItem[];
  canSubmit: boolean;
  onSubmitted?: () => void;
}

export function MetaPromptExercise({
  status,
  isPaused,
  aggregate,
  myResponses = [],
  canSubmit,
  onSubmitted,
}: MetaPromptExerciseProps) {
  const existing = myResponses.find((r) => r.itemKey === "main");
  const [language, setLanguage] = useState<"fr" | "ar">("fr");
  const [grade, setGrade] = useState("3AEP");
  const [roughIdea, setRoughIdea] = useState(
    "Je veux une activité de remédiation pour mes élèves qui ont du mal avec les soustractions avec retenue."
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatedMetaPrompt = useMemo(() => {
    if (language === "ar") {
      return `أنت مستشار تربوي في التعليم الابتدائي المغربي.
المستوى المستهدف: ${grade}.
فكرتي الأولية: ${roughIdea}
قبل أن تنشئ التمرين أو التطبيق:
1. حدد المعلومات الناقصة في طلبي (مستوى التلاميذ الفعلي، مدة الحصة، الوسائل المتاحة بالقسم أو الورق).
2. اطرح عليّ 5 أسئلة واضحة ومختصرة.
3. انتظر إجاباتي ثم اقترح مسودة مناسبة للمراجعة والتجريب.`;
    }
    return `Tu es un conseiller pédagogique du primaire au Maroc.
Niveau ciblé : ${grade}.
Mon idée brute : ${roughIdea}
Avant de générer le contenu ou le prototype :
1. Identifie les informations manquantes (niveau réel des élèves, équipement en classe, durée, format).
2. Pose-moi 5 questions courtes et ciblées.
3. Attends mes réponses avant de me proposer un brouillon à relire et valider.`;
  }, [language, grade, roughIdea]);

  const isLocked = isPaused || status !== "open" || Boolean(existing);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isLocked || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/participant/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityKey: "exercise-metaprompt",
          itemKey: "main",
          selectedOption: language,
          payload: {
            language,
            grade,
            roughIdea,
            metaPrompt: generatedMetaPrompt,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Impossible d'envoyer l'exercice.");
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
    <div className="grid gap-5 lg:grid-cols-12">
      {canSubmit && (
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs"
        >
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900">
              Votre idée brute → Méta-Prompt
            </h4>
            {existing ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Envoyé
              </span>
            ) : status !== "open" || isPaused ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                <Lock className="h-3.5 w-3.5" />
                Fermé
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setLanguage("fr");
                setRoughIdea(
                  "Je veux une activité de remédiation pour mes élèves qui ont du mal avec les soustractions avec retenue."
                );
              }}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                language === "fr"
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              Français (LTR)
            </button>
            <button
              type="button"
              onClick={() => {
                setLanguage("ar");
                setRoughIdea(
                  "أريد نشاطاً علاجياً لتلاميذ المستوى الثالث لمساعدتهم على فهم الطرح بالاحتفاظ."
                );
              }}
              className={`font-arabic rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                language === "ar"
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              العربية (RTL)
            </button>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800"
            >
              {["1AEP", "2AEP", "3AEP", "4AEP", "5AEP", "6AEP"].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <textarea
            dir={language === "ar" ? "rtl" : "ltr"}
            rows={3}
            value={roughIdea}
            onChange={(e) => setRoughIdea(e.target.value)}
            className={`w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 ${
              language === "ar" ? "font-arabic text-sm" : ""
            }`}
          />

          {error && (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <CopyPromptButton text={generatedMetaPrompt} label="Copier le méta-prompt" />
            <button
              type="submit"
              disabled={isLocked || submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? "Envoi..." : "Partager"}</span>
            </button>
          </div>
        </form>
      )}

      <div className={`${canSubmit ? "lg:col-span-6" : "lg:col-span-12"} space-y-4`}>
        <div className="rounded-2xl border border-slate-800 bg-[#0B1426] p-4 text-slate-100">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Méta-prompt généré
            </span>
            <CopyPromptButton text={generatedMetaPrompt} label="Copier" />
          </div>
          <pre
            dir={language === "ar" ? "rtl" : "ltr"}
            className={`whitespace-pre-wrap leading-relaxed text-slate-100 ${
              language === "ar" ? "font-arabic text-sm" : "font-mono-code text-xs"
            }`}
          >
            {generatedMetaPrompt}
          </pre>
        </div>

        {aggregate?.optionTallies && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Langues choisies par la salle
              </span>
              <span className="text-xs font-semibold text-teal-700">
                {aggregate.totalRespondents} partages
              </span>
            </div>
            <OptionBarChart data={aggregate.optionTallies} height={135} />
          </div>
        )}
      </div>
    </div>
  );
}
