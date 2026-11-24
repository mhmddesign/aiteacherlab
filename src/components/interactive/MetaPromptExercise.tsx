"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, Lock, Send } from "lucide-react";
import type {
  ActivityAggregate,
  ActivityStatus,
  ParticipantResponseItem,
} from "@/content/types";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
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
  const [grade, setGrade] = useState("3AEP");
  const [preferredLang, setPreferredLang] = useState<"fr" | "ar">("fr");
  const [roughIdeaFr, setRoughIdeaFr] = useState(
    "Je veux une activité de remédiation pour mes élèves qui ont du mal avec les soustractions avec retenue."
  );
  const [roughIdeaAr, setRoughIdeaAr] = useState(
    "أريد نشاطاً علاجياً لتلاميذ المستوى الثالث لمساعدتهم على فهم الطرح بالاحتفاظ."
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatedMetaPromptFr = useMemo(
    () => `Tu es un conseiller pédagogique du primaire au Maroc.
Niveau ciblé : ${grade}.
Mon idée brute : ${roughIdeaFr}
Avant de générer le contenu ou le prototype :
1. Identifie les informations manquantes (niveau réel des élèves, équipement en classe, durée, format).
2. Pose-moi 5 questions courtes et ciblées.
3. Attends mes réponses avant de me proposer un brouillon à relire et valider.`,
    [grade, roughIdeaFr]
  );

  const generatedMetaPromptAr = useMemo(
    () => `أنت مستشار تربوي في التعليم الابتدائي المغربي.
المستوى المستهدف: ${grade}.
فكرتي الأولية: ${roughIdeaAr}
قبل أن تنشئ التمرين أو التطبيق:
1. حدد المعلومات الناقصة في طلبي (مستوى التلاميذ الفعلي، مدة الحصة، الوسائل المتاحة بالقسم أو الورق).
2. اطرح عليّ 5 أسئلة واضحة ومختصرة.
3. انتظر إجاباتي ثم اقترح مسودة مناسبة للمراجعة والتجريب.`,
    [grade, roughIdeaAr]
  );

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
          selectedOption: preferredLang,
          payload: {
            language: preferredLang,
            grade,
            roughIdea: preferredLang === "ar" ? roughIdeaAr : roughIdeaFr,
            metaPrompt:
              preferredLang === "ar" ? generatedMetaPromptAr : generatedMetaPromptFr,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ?? "Impossible d'envoyer l'exercice. / تعذر إرسال التمرين."
        );
        return;
      }
      onSubmitted?.();
    } catch {
      setError("Problème de connexion. Réessayez. / مشكل في الاتصال، أعيدوا المحاولة.");
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <BilingualBlock
              text={{
                fr: "Votre idée brute → Méta-Prompt (FR & AR)",
                ar: "فكرتكم الأولية ← الميتا-برومبت (فرنسية وعربية)",
              }}
              frClassName="text-sm font-bold text-slate-900"
              arClassName="text-xs font-bold text-teal-800"
            />
            {existing ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <BilingualInline text={{ fr: "Envoyé", ar: "تم الإرسال" }} />
              </span>
            ) : status !== "open" || isPaused ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                <Lock className="h-3.5 w-3.5" />
                <BilingualInline text={{ fr: "Fermé", ar: "مغلق" }} />
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <label className="font-semibold text-slate-700">
              Niveau · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">المستوى</span>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="ml-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800"
              >
                {["1AEP", "2AEP", "3AEP", "4AEP", "5AEP", "6AEP"].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>

            <label className="font-semibold text-slate-700">
              Langue principale partagée · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">اللغة المشاركة</span>
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value as "fr" | "ar")}
                className="ml-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800"
              >
                <option value="fr">Français · الفرنسية</option>
                <option value="ar">Arabe · العربية</option>
              </select>
            </label>
          </div>

          <label className="block text-xs font-semibold text-slate-700">
            Idée brute en Français
            <textarea
              dir="ltr"
              rows={2}
              value={roughIdeaFr}
              onChange={(e) => setRoughIdeaFr(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
            />
          </label>

          <label className="block text-xs font-semibold text-slate-700">
            <span dir="rtl" lang="ar" className="font-arabic block text-teal-900">
              الفكرة الأولية بالعربية
            </span>
            <textarea
              dir="rtl"
              lang="ar"
              rows={2}
              value={roughIdeaAr}
              onChange={(e) => setRoughIdeaAr(e.target.value)}
              className="font-arabic mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <CopyPromptButton
              text={generatedMetaPromptFr}
              label="Copier FR"
              labelAr="نسخ FR"
            />
            <CopyPromptButton
              text={generatedMetaPromptAr}
              label="Copier AR"
              labelAr="نسخ AR"
            />
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
                  <BilingualInline text={{ fr: "Partager", ar: "مشاركة" }} />
                )}
              </span>
            </button>
          </div>
        </form>
      )}

      <div className={`${canSubmit ? "lg:col-span-6" : "lg:col-span-12"} space-y-4`}>
        <div className="rounded-2xl border border-slate-800 bg-[#0B1426] p-4 text-slate-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Méta-prompt FR · الميتا-برومبت بالفرنسية
            </span>
            <CopyPromptButton text={generatedMetaPromptFr} label="Copier FR" labelAr="نسخ FR" />
          </div>
          <pre dir="ltr" className="font-mono-code whitespace-pre-wrap text-xs leading-relaxed text-slate-100">
            {generatedMetaPromptFr}
          </pre>

          <div className="border-t border-slate-700 pt-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span dir="rtl" lang="ar" className="font-arabic text-xs font-bold text-teal-300">
                الميتا-برومبت بالعربية
              </span>
              <CopyPromptButton text={generatedMetaPromptAr} label="Copier AR" labelAr="نسخ AR" />
            </div>
            <pre dir="rtl" lang="ar" className="font-arabic whitespace-pre-wrap text-sm leading-relaxed text-slate-100">
              {generatedMetaPromptAr}
            </pre>
          </div>
        </div>

        {aggregate?.optionTallies && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-2 flex items-center justify-between gap-2">
              <BilingualBlock
                text={{
                  fr: "Langues choisies par la salle",
                  ar: "اللغات المختارة في القاعة",
                }}
                frClassName="text-xs font-bold text-slate-800"
                arClassName="text-xs font-bold text-teal-800"
              />
              <span className="text-xs font-semibold text-teal-700">
                {aggregate.totalRespondents} · <span className="font-arabic">مشاركة</span>
              </span>
            </div>
            <OptionBarChart data={aggregate.optionTallies} height={150} />
          </div>
        )}
      </div>
    </div>
  );
}
