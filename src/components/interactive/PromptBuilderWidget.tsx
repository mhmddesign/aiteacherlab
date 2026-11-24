"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import type {
  ActivityAggregate,
  ActivityStatus,
  ParticipantResponseItem,
} from "@/content/types";
import { CopyPromptButton } from "@/components/ui/CopyPromptButton";

interface PromptBuilderWidgetProps {
  status: ActivityStatus;
  isPaused: boolean;
  aggregate: ActivityAggregate | null;
  myResponses?: ParticipantResponseItem[];
  canSubmit: boolean;
  onSubmitted?: () => void;
}

const GRADES = ["1AEP", "2AEP", "3AEP", "4AEP", "5AEP", "6AEP"];
const SUBJECTS = [
  "Langue Arabe",
  "Français",
  "Mathématiques",
  "Éveil Scientifique",
  "Remédiation / TaRL",
];
const DIFFICULTIES = ["Base", "Intermédiaire", "Défi", "3 niveaux progressifs"];

export function PromptBuilderWidget({
  status,
  isPaused,
  aggregate,
  myResponses = [],
  canSubmit,
  onSubmitted,
}: PromptBuilderWidgetProps) {
  const existing = myResponses.find((r) => r.itemKey === "main");
  const [grade, setGrade] = useState("4AEP");
  const [subject, setSubject] = useState("Français");
  const [role, setRole] = useState("Enseignant(e) expérimenté(e) du primaire public au Maroc");
  const [objective, setObjective] = useState(
    "Identifier les actions principales dans un court récit du quotidien"
  );
  const [competency, setCompetency] = useState("Comprendre et reformuler un texte court");
  const [textbookExtract, setTextbookExtract] = useState("");
  const [learnerLevel, setLearnerLevel] = useState(
    "Classe hétérogène de 34 élèves (vidéoprojecteur + cahiers)"
  );
  const [difficulty, setDifficulty] = useState("3 niveaux progressifs");
  const [constraints, setConstraints] = useState(
    "Langage simple, zéro donnée personnelle d'élève, utilisable sur tableau ou fiche A4"
  );
  const [outputFormat, setOutputFormat] = useState(
    "Texte court + 5 questions graduées + corrigé enseignant à part"
  );
  const [qualityCriteria, setQualityCriteria] = useState(
    "Brouillon clair prêt à être relu, adapté et validé par l'enseignant"
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assembledPrompt = useMemo(() => {
    const lines = [
      `Rôle : ${role}`,
      `Niveau & Discipline : ${grade} · ${subject}`,
      `Public & Contexte de classe : ${learnerLevel}`,
      `Objectif d'apprentissage (fourni par l'enseignant) : ${objective}`,
      `Compétence ciblée : ${competency}`,
      textbookExtract.trim()
        ? `Extrait de leçon / manuel fourni : ${textbookExtract.trim()}`
        : null,
      `Niveau de difficulté : ${difficulty}`,
      `Contraintes matérielles & éthiques : ${constraints}`,
      `Format de sortie : ${outputFormat}`,
      `Critères de qualité : ${qualityCriteria}`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [
    role,
    grade,
    subject,
    learnerLevel,
    objective,
    competency,
    textbookExtract,
    difficulty,
    constraints,
    outputFormat,
    qualityCriteria,
  ]);

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
          activityKey: "builder-prompt",
          itemKey: "main",
          selectedOption: `${grade} · ${subject}`,
          payload: {
            grade,
            subject,
            objective,
            competency,
            difficulty,
            assembledPrompt,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Impossible de partager votre prompt.");
        return;
      }
      onSubmitted?.();
    } catch {
      setError("Erreur réseau lors de l'envoi. Votre prompt reste copiable ci-contre.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      {canSubmit && (
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">
              Paramètres de votre classe (1AEP–6AEP)
            </h4>
            {existing ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Partagé avec la salle
              </span>
            ) : status !== "open" || isPaused ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                <Lock className="h-3.5 w-3.5" />
                {isPaused ? "En pause" : "Envoi fermé (copie libre)"}
              </span>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-xs font-semibold text-slate-700">
              Niveau
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold text-slate-700">
              Discipline
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold text-slate-700">
              Difficulté
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              Objectif d&apos;apprentissage
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Compétence ciblée
              <input
                type="text"
                value={competency}
                onChange={(e) => setCompetency(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              Rôle attribué à l&apos;IA
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Niveau réel des élèves & classe
              <input
                type="text"
                value={learnerLevel}
                onChange={(e) => setLearnerLevel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
          </div>

          <label className="block text-xs font-semibold text-slate-700">
            Extrait de leçon ou du manuel (optionnel)
            <textarea
              rows={2}
              value={textbookExtract}
              onChange={(e) => setTextbookExtract(e.target.value)}
              placeholder="Collez ici un court paragraphe ou une consigne de votre manuel si besoin..."
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              Contraintes
              <input
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Format de sortie & Critères
              <input
                type="text"
                value={outputFormat}
                onChange={(e) => {
                  setOutputFormat(e.target.value);
                  setQualityCriteria("Brouillon clair prêt à relire et valider");
                }}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
          </div>

          {error && (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <CopyPromptButton text={assembledPrompt} label="Copier le prompt assemblé" />
            <button
              type="submit"
              disabled={isLocked || submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{submitting ? "Envoi..." : "Partager avec l'atelier"}</span>
            </button>
          </div>
        </form>
      )}

      <div className={`${canSubmit ? "lg:col-span-5" : "lg:col-span-12"} space-y-4`}>
        <div className="rounded-2xl border border-slate-800 bg-[#0B1426] p-4 text-slate-100">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Prompt assemblé (prêt à copier)
            </span>
            <CopyPromptButton text={assembledPrompt} label="Copier" />
          </div>
          <pre className="font-mono-code whitespace-pre-wrap text-xs leading-relaxed text-slate-100">
            {assembledPrompt}
          </pre>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Prompts partagés dans la salle (anonymisés)
            </h4>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-800">
              {aggregate?.totalRespondents ?? 0} créés
            </span>
          </div>
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {aggregate?.recentSnippets && aggregate.recentSnippets.length > 0 ? (
              aggregate.recentSnippets.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-ivory-50 p-3 text-xs"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="font-bold text-teal-800">{item.label}</span>
                  </div>
                  {item.secondary && (
                    <p className="mb-1 font-medium text-slate-700">{item.secondary}</p>
                  )}
                  <p className="text-slate-600 line-clamp-3">{item.content}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">
                Les prompts partagés par les collègues s&apos;afficheront ici en direct.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
