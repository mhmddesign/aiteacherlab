"use client";

import React, { useState } from "react";
import { Code2, Layers, Paintbrush, Play } from "lucide-react";

export function WebTrioExplainer() {
  const [hasCss, setHasCss] = useState(true);
  const [hasJs, setHasJs] = useState(true);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handlePick = (isCorrect: boolean) => {
    if (!hasJs) return;
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback("Bravo ! 3 centaines + 4 dizaines + 5 unités = 345.");
    } else {
      setFeedback("Indice : regarde bien le chiffre des dizaines (4 dizaines = 40).");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="lg:col-span-5 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900">
          Expérimentez en direct le rôle de chaque brique
        </h4>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-teal-700" />
              <span className="text-xs font-bold text-slate-900">1. HTML (Structure)</span>
            </div>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-900">
              Toujours actif
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Le texte de la question et les boutons bruts. Sans CSS ni JS, c&apos;est une page brute mais lisible.
          </p>
        </div>

        <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 hover:border-cyan-400">
          <div>
            <div className="flex items-center gap-2">
              <Paintbrush className="h-4 w-4 text-cyan-600" />
              <span className="text-xs font-bold text-slate-900">2. CSS (Lisibilité & Style)</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Couleurs, grande taille lisible au projecteur, espacement tactile et mode RTL.
            </p>
          </div>
          <input
            type="checkbox"
            checked={hasCss}
            onChange={(e) => setHasCss(e.target.checked)}
            className="mt-1 h-4 w-4 accent-teal-600"
          />
        </label>

        <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 hover:border-amber-400">
          <div>
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-900">3. JavaScript (Interactivité)</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Vérifie la réponse de l&apos;élève, met à jour le score et affiche l&apos;explication.
            </p>
          </div>
          <input
            type="checkbox"
            checked={hasJs}
            onChange={(e) => {
              setHasJs(e.target.checked);
              if (!e.target.checked) setFeedback(null);
            }}
            className="mt-1 h-4 w-4 accent-amber-600"
          />
        </label>
      </div>

      <div className="lg:col-span-7">
        <div
          className={
            hasCss
              ? "rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all"
              : "border border-black bg-white p-2 font-serif text-black"
          }
        >
          <div className={hasCss ? "mb-4 flex items-center justify-between" : "mb-2"}>
            <span
              className={
                hasCss
                  ? "inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800"
                  : "text-xs underline"
              }
            >
              <Layers className={hasCss ? "h-3.5 w-3.5" : "hidden"} />
              Mini-carte 3AEP · Mathématiques
            </span>
            <span className={hasCss ? "text-xs font-bold text-slate-700" : "ml-4 text-xs"}>
              Score : {score}
            </span>
          </div>

          <h4 className={hasCss ? "text-lg font-bold text-slate-900 mb-3" : "text-base mb-2"}>
            Quelle décomposition correspond au nombre 345 ?
          </h4>

          <div className={hasCss ? "grid gap-2.5 sm:grid-cols-3" : "flex flex-col gap-1 items-start"}>
            {[
              { label: "300 + 40 + 5", ok: true },
              { label: "300 + 50 + 4", ok: false },
              { label: "30 + 40 + 5", ok: false },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => handlePick(opt.ok)}
                className={
                  hasCss
                    ? "rounded-xl border border-slate-300 bg-ivory-50 px-4 py-3 text-sm font-bold text-slate-900 hover:border-teal-500 hover:bg-teal-50 cursor-pointer"
                    : "border border-gray-500 bg-gray-200 px-2 py-0.5 text-sm"
                }
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!hasJs && (
            <p className="mt-3 text-xs italic text-amber-700">
              (JavaScript désactivé : les boutons s&apos;affichent mais ne déclenchent aucune action !)
            </p>
          )}

          {hasJs && feedback && (
            <div
              className={
                hasCss
                  ? "mt-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-xs font-semibold text-teal-900"
                  : "mt-2 text-xs font-bold"
              }
            >
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
