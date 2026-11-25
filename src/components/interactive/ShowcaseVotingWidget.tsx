"use client";

import React, { useState } from "react";
import { Award, CheckCircle2, Loader2, Lock, PlusCircle, ShieldCheck } from "lucide-react";
import { getActivityByKey } from "@/content/activities";
import type {
  ActivityAggregate,
  ActivityStatus,
  ParticipantResponseItem,
} from "@/content/types";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
import { ShowcaseGroupedChart } from "@/components/ui/LiveChart";

interface ShowcaseVotingWidgetProps {
  status: ActivityStatus;
  showResults: boolean;
  isPaused: boolean;
  aggregate: ActivityAggregate | null;
  myResponses?: ParticipantResponseItem[];
  canSubmit: boolean;
  defaultContributorName?: string;
  onSubmitted?: (savedResponse?: ParticipantResponseItem) => void;
}

interface CategoryLocalVote {
  groupId: string;
  status: "saving" | "saved" | "error";
  error?: string;
}

export function ShowcaseVotingWidget({
  status,
  showResults,
  isPaused,
  aggregate,
  myResponses = [],
  canSubmit,
  defaultContributorName = "",
  onSubmitted,
}: ShowcaseVotingWidgetProps) {
  const activity = getActivityByKey("vote-showcase");
  const [localVotes, setLocalVotes] = useState<Record<string, CategoryLocalVote>>({});
  const [error, setError] = useState<string | null>(null);

  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [contributorName, setContributorName] = useState(defaultContributorName);
  const [appTitle, setAppTitle] = useState("");
  const [gradeRange, setGradeRange] = useState("4AEP");
  const [discipline, setDiscipline] = useState("Français / الفرنسية");
  const [language, setLanguage] = useState("Français (LTR) + Arabe (RTL)");
  const [learningObjective, setLearningObjective] = useState("");
  const [description, setDescription] = useState("");
  const [classroomInstructions, setClassroomInstructions] = useState("");
  const [appResource, setAppResource] = useState("");
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [contributing, setContributing] = useState(false);
  const [galleryMsg, setGalleryMsg] = useState<string | null>(null);

  if (!activity || !activity.categories || !activity.options) return null;

  const isOpen = status === "open" && !isPaused;

  const handleVote = async (categoryId: string, groupId: string) => {
    const existing = myResponses.find((r) => r.itemKey === categoryId);
    const cur = localVotes[categoryId];
    if (!canSubmit || !isOpen || existing || cur?.status === "saving") return;

    setLocalVotes((prev) => ({
      ...prev,
      [categoryId]: { groupId, status: "saving" },
    }));
    setError(null);
    try {
      const res = await fetch("/api/participant/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityKey: "vote-showcase",
          itemKey: categoryId,
          selectedOption: groupId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg =
          data.error ?? "Impossible d'enregistrer le vote. / تعذر حفظ التصويت.";
        setLocalVotes((prev) => ({
          ...prev,
          [categoryId]: { groupId, status: "error", error: msg },
        }));
        return;
      }
      setLocalVotes((prev) => ({
        ...prev,
        [categoryId]: { groupId, status: "saved" },
      }));
      onSubmitted?.(data.response as ParticipantResponseItem | undefined);
    } catch {
      setLocalVotes((prev) => ({
        ...prev,
        [categoryId]: {
          groupId,
          status: "error",
          error: "Erreur de connexion. Réessayez. / خطأ في الاتصال، حاولوا مجدداً.",
        },
      }));
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contributing) return;
    setContributing(true);
    setGalleryMsg(null);
    try {
      const res = await fetch("/api/gallery/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contributorName,
          appTitle,
          gradeRange,
          discipline,
          language,
          learningObjective,
          description,
          classroomInstructions,
          appResource,
          testedFeatures: [
            "Prototype testé en atelier / نموذج مختبر في الورشة",
            "Zéro compte élève / دون حساب تلميذ",
          ],
          privacyConfirmed,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGalleryMsg(
          data.error ?? "Impossible d'enregistrer votre fiche. / تعذر حفظ البطاقة."
        );
        return;
      }
      setGalleryMsg(
        "Merci ! Votre prototype est ajouté à la Galerie Provinciale de Mediouna. / شكراً لكم! تمت إضافة نموذجكم إلى المعرض الإقليمي لمديونة."
      );
      setAppTitle("");
      setLearningObjective("");
      setDescription("");
      setClassroomInstructions("");
      setAppResource("");
      setPrivacyConfirmed(false);
      onSubmitted?.();
    } catch {
      setGalleryMsg("Erreur réseau lors de l'envoi. / خطأ في الشبكة أثناء الإرسال.");
    } finally {
      setContributing(false);
    }
  };

  return (
    <div className="space-y-5">
      {canSubmit && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2 text-xs font-semibold">
            <BilingualBlock
              text={activity.instruction}
              frClassName="text-slate-700"
              arClassName="text-teal-900"
            />
            {!isOpen && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-800">
                <Lock className="h-3.5 w-3.5" />
                {isPaused ? (
                  <BilingualInline text={{ fr: "En pause", ar: "استراحة" }} />
                ) : (
                  <BilingualInline text={{ fr: "Votes fermés", ar: "التصويت مغلق" }} />
                )}
              </span>
            )}
          </div>

          {error && (
            <p className="rounded-xl bg-amber-50 px-4 py-2 text-xs font-medium text-amber-900">
              {error}
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            {activity.categories.map((cat) => {
              const mine = myResponses.find((r) => r.itemKey === cat.id);
              const localVote = localVotes[cat.id];
              const isSaving = !mine && localVote?.status === "saving";
              const isSaved = Boolean(mine) || localVote?.status === "saved";
              const chosenGroupId =
                mine?.selectedOption ??
                (isSaving || localVote?.status === "saved" ? localVote.groupId : undefined);
              return (
                <div key={cat.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-start gap-1.5">
                        <Award className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                        <BilingualBlock
                          text={cat.label}
                          frClassName="text-sm font-bold text-slate-900"
                          arClassName="text-xs font-bold text-teal-900"
                        />
                      </div>
                      <BilingualBlock
                        text={cat.description}
                        className="mt-1.5"
                        frClassName="text-xs text-slate-600"
                        arClassName="text-xs text-slate-600"
                      />
                    </div>
                    {isSaved && <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />}
                  </div>

                  {(isSaving || isSaved) && (
                    <p className="text-[11px] font-semibold text-teal-700" aria-live="polite">
                      {isSaving ? (
                        <BilingualInline text={{ fr: "Enregistrement...", ar: "جاري الحفظ..." }} />
                      ) : (
                        <BilingualInline text={{ fr: "Réponse enregistrée", ar: "تم حفظ الإجابة" }} />
                      )}
                    </p>
                  )}

                  <div className="space-y-2">
                    {activity.options!.map((opt) => {
                      const chosen = chosenGroupId === opt.id;
                      const locked = !isOpen || Boolean(mine) || isSaving;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          aria-pressed={chosen}
                          disabled={locked}
                          onClick={() => handleVote(cat.id, opt.id)}
                          className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all duration-150 active:scale-[0.99] ${
                            chosen
                              ? "border-teal-600 bg-teal-50 text-teal-950 ring-2 ring-teal-500/25"
                              : "border-slate-200 bg-slate-50 text-slate-800 hover:border-teal-400"
                          } ${locked ? "cursor-default" : "cursor-pointer"}`}
                        >
                          <BilingualBlock text={opt.label} className="flex-1" />
                          {chosen && (
                            isSaving ? (
                              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-teal-600" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
                            )
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!mine && localVote?.status === "error" && localVote.error && (
                    <div className="flex items-center justify-between gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-900">
                      <span>{localVote.error}</span>
                      {isOpen && (
                        <button
                          type="button"
                          onClick={() => handleVote(cat.id, localVote.groupId)}
                          className="rounded-lg bg-amber-600 px-2 py-0.5 font-bold text-white cursor-pointer"
                        >
                          <BilingualInline text={{ fr: "Réessayer", ar: "إعادة" }} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-teal-200 bg-ivory-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <BilingualBlock
                  text={{
                    fr: "Contribuer à la Galerie Collaborative Provinciale de Mediouna",
                    ar: "المساهمة في المعرض التعاوني الإقليمي لمديونة",
                  }}
                  frClassName="text-sm font-bold text-slate-900"
                  arClassName="text-xs font-bold text-teal-900"
                />
                <BilingualBlock
                  text={{
                    fr: "Documentez le prototype de votre groupe pour le partager avec les collègues de la province.",
                    ar: "وثّقوا نموذج مجموعتكم لتقاسمه مع زميلات وزملاء الإقليم.",
                  }}
                  frClassName="text-xs text-slate-600"
                  arClassName="text-xs text-slate-600"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowGalleryForm((s) => !s)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                {showGalleryForm ? (
                  <BilingualInline text={{ fr: "Fermer le formulaire", ar: "إغلاق الاستمارة" }} />
                ) : (
                  <BilingualInline text={{ fr: "Déposer un prototype", ar: "إيداع نموذج أولي" }} />
                )}
              </button>
            </div>

            {showGalleryForm && (
              <form onSubmit={handleContribute} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  required
                  placeholder="Nom(s) des collègues ou groupe / أسماء الزملاء أو المجموعة"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  required
                  placeholder="Titre de l'application pédagogique / عنوان التطبيق التربوي"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  required
                  placeholder="Niveau (ex: 3AEP–4AEP) / المستوى الدراسي"
                  value={gradeRange}
                  onChange={(e) => setGradeRange(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  required
                  placeholder="Discipline / المادة الدراسية"
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  required
                  placeholder="Langue (FR LTR / AR RTL / Bilingue) / اللغة"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  required
                  placeholder="Fichier HTML, lien ou support / رابط أو اسم الملف"
                  value={appResource}
                  onChange={(e) => setAppResource(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  required
                  placeholder="Objectif d'apprentissage / الهدف التعلمي"
                  value={learningObjective}
                  onChange={(e) => setLearningObjective(e.target.value)}
                  className="sm:col-span-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <textarea
                  required
                  rows={2}
                  placeholder="Description courte du prototype... / وصف موجز للنموذج..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <textarea
                  required
                  rows={2}
                  placeholder="Mode d'emploi en classe... / طريقة الاستعمال في القسم..."
                  value={classroomInstructions}
                  onChange={(e) => setClassroomInstructions(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <label className="sm:col-span-2 flex items-start gap-2 rounded-xl border border-teal-300 bg-white p-3 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyConfirmed}
                    onChange={(e) => setPrivacyConfirmed(e.target.checked)}
                    className="mt-0.5 accent-teal-600"
                  />
                  <BilingualBlock
                    text={{
                      fr: "Je certifie que ce prototype et cette fiche ne collectent aucune donnée personnelle d'élève.",
                      ar: "أشهد أن هذا النموذج وهذه البطاقة لا يجمعان أي معطيات شخصية للتلاميذ.",
                    }}
                  />
                </label>
                <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2">
                  {galleryMsg && (
                    <span className="text-xs font-semibold text-teal-800">{galleryMsg}</span>
                  )}
                  <button
                    type="submit"
                    disabled={contributing}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-70 cursor-pointer"
                  >
                    {contributing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    )}
                    <BilingualInline
                      text={{
                        fr: contributing ? "Publication..." : "Publier dans la Galerie Provinciale",
                        ar: contributing ? "جاري النشر..." : "نشر في المعرض الإقليمي",
                      }}
                    />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {(showResults || status === "revealed" || status === "closed" || !canSubmit) &&
        aggregate?.showcaseTallies && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <BilingualBlock
                text={{
                  fr: "Résultats agrégés du Showcase (votes anonymisés)",
                  ar: "النتائج التجميعية لعروض المجموعات (تصويت مجهول)",
                }}
                frClassName="text-sm font-bold text-slate-900"
                arClassName="text-xs font-bold text-teal-800"
              />
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {aggregate.totalRespondents} votant{aggregate.totalRespondents > 1 ? "s" : ""} ·{" "}
                <span className="font-arabic">{aggregate.totalRespondents} مصوت(ة)</span>
              </span>
            </div>
            <ShowcaseGroupedChart tallies={aggregate.showcaseTallies} />
          </div>
        )}
    </div>
  );
}
