"use client";

import React, { useState } from "react";
import { Award, CheckCircle2, Lock, PlusCircle, ShieldCheck } from "lucide-react";
import { getActivityByKey } from "@/content/activities";
import type {
  ActivityAggregate,
  ActivityStatus,
  ParticipantResponseItem,
} from "@/content/types";
import { ShowcaseGroupedChart } from "@/components/ui/LiveChart";

interface ShowcaseVotingWidgetProps {
  status: ActivityStatus;
  showResults: boolean;
  isPaused: boolean;
  aggregate: ActivityAggregate | null;
  myResponses?: ParticipantResponseItem[];
  canSubmit: boolean;
  defaultContributorName?: string;
  onSubmitted?: () => void;
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
  const [submittingKey, setSubmittingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Provincial gallery contribution drawer
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [contributorName, setContributorName] = useState(defaultContributorName);
  const [appTitle, setAppTitle] = useState("");
  const [gradeRange, setGradeRange] = useState("4AEP");
  const [discipline, setDiscipline] = useState("Français");
  const [language, setLanguage] = useState("Français (LTR)");
  const [learningObjective, setLearningObjective] = useState("");
  const [description, setDescription] = useState("");
  const [classroomInstructions, setClassroomInstructions] = useState("");
  const [appResource, setAppResource] = useState("");
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [galleryMsg, setGalleryMsg] = useState<string | null>(null);

  if (!activity || !activity.categories || !activity.options) return null;

  const isOpen = status === "open" && !isPaused;

  const handleVote = async (categoryId: string, groupId: string) => {
    if (!canSubmit || !isOpen || submittingKey) return;
    if (myResponses.some((r) => r.itemKey === categoryId)) return;

    setSubmittingKey(categoryId);
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
        setError(data.error ?? "Impossible d'enregistrer le vote.");
        return;
      }
      onSubmitted?.();
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setSubmittingKey(null);
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
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
          testedFeatures: ["Prototype testé en atelier", "Zéro compte élève"],
          privacyConfirmed,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGalleryMsg(data.error ?? "Impossible d'enregistrer votre fiche.");
        return;
      }
      setGalleryMsg("Merci ! Votre prototype est ajouté à la Galerie Provinciale de Mediouna.");
      setAppTitle("");
      setLearningObjective("");
      setDescription("");
      setClassroomInstructions("");
      setAppResource("");
      setPrivacyConfirmed(false);
      onSubmitted?.();
    } catch {
      setGalleryMsg("Erreur réseau lors de l'envoi.");
    }
  };

  return (
    <div className="space-y-5">
      {canSubmit && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
            <span className="text-slate-700">{activity.instruction}</span>
            {!isOpen && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-800">
                <Lock className="h-3.5 w-3.5" />
                {isPaused ? "En pause" : "Votes fermés"}
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
              return (
                <div key={cat.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-teal-600" />
                        {cat.label}
                      </h4>
                      <p className="mt-1 text-xs text-slate-600">{cat.description}</p>
                    </div>
                    {mine && <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />}
                  </div>

                  <div className="space-y-2">
                    {activity.options!.map((opt) => {
                      const chosen = mine?.selectedOption === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={!isOpen || Boolean(mine) || submittingKey === cat.id}
                          onClick={() => handleVote(cat.id, opt.id)}
                          className={`w-full rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                            chosen
                              ? "border-teal-600 bg-teal-50 text-teal-950"
                              : "border-slate-200 bg-slate-50 text-slate-800 hover:border-teal-400"
                          } ${!isOpen || Boolean(mine) ? "cursor-default" : "cursor-pointer"}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-teal-200 bg-ivory-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Contribuer à la Galerie Collaborative Provinciale de Mediouna
                </h4>
                <p className="text-xs text-slate-600">
                  Documentez le prototype de votre groupe pour le partager avec les collègues de la province.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGalleryForm((s) => !s)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>{showGalleryForm ? "Fermer le formulaire" : "Déposer un prototype"}</span>
              </button>
            </div>

            {showGalleryForm && (
              <form onSubmit={handleContribute} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  required
                  placeholder="Nom(s) des collègues ou numéro de groupe"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  required
                  placeholder="Titre de l'application pédagogique"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  required
                  placeholder="Niveau (ex: 3AEP–4AEP)"
                  value={gradeRange}
                  onChange={(e) => setGradeRange(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  required
                  placeholder="Discipline (ex: Mathématiques)"
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  required
                  placeholder="Langue (Français LTR / Arabe RTL / Bilingue)"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  required
                  placeholder="Fichier HTML, lien ou description du support"
                  value={appResource}
                  onChange={(e) => setAppResource(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  required
                  placeholder="Objectif d'apprentissage fourni par l'enseignant"
                  value={learningObjective}
                  onChange={(e) => setLearningObjective(e.target.value)}
                  className="sm:col-span-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <textarea
                  required
                  rows={2}
                  placeholder="Description courte du prototype..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <textarea
                  required
                  rows={2}
                  placeholder="Mode d'emploi en classe (projecteur, groupes, papier)..."
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
                  <span>
                    <ShieldCheck className="mr-1 inline h-4 w-4 text-teal-700" />
                    Je certifie que ce prototype et cette fiche ne collectent aucune donnée personnelle d&apos;élève.
                  </span>
                </label>
                <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2">
                  {galleryMsg && (
                    <span className="text-xs font-semibold text-teal-800">{galleryMsg}</span>
                  )}
                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 cursor-pointer"
                  >
                    Publier dans la Galerie Provinciale
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
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                Résultats agrégés du Showcase (votes anonymisés)
              </h4>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {aggregate.totalRespondents} votant{aggregate.totalRespondents > 1 ? "s" : ""}
              </span>
            </div>
            <ShowcaseGroupedChart tallies={aggregate.showcaseTallies} />
          </div>
        )}
    </div>
  );
}
