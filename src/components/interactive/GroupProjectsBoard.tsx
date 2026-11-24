"use client";

import React, { useState } from "react";
import { CheckSquare, ClipboardList, Users } from "lucide-react";
import {
  buildGroupPromptAr,
  buildGroupPromptFr,
  GROUP_PROJECTS,
} from "@/content/gallery";
import { CopyPromptButton } from "@/components/ui/CopyPromptButton";

export function GroupProjectsBoard() {
  const [selectedId, setSelectedId] = useState<string>(GROUP_PROJECTS[0].id);
  const project = GROUP_PROJECTS.find((g) => g.id === selectedId) ?? GROUP_PROJECTS[0];

  const [customGrade, setCustomGrade] = useState(project.defaultGrade);
  const [customSubject, setCustomSubject] = useState(project.defaultSubject);
  const [customCompetency, setCustomCompetency] = useState(project.defaultCompetency);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const selectGroup = (id: string) => {
    const next = GROUP_PROJECTS.find((g) => g.id === id) ?? GROUP_PROJECTS[0];
    setSelectedId(id);
    setCustomGrade(next.defaultGrade);
    setCustomSubject(next.defaultSubject);
    setCustomCompetency(next.defaultCompetency);
  };

  const frPrompt = buildGroupPromptFr(project, customGrade, customSubject, customCompetency);
  const arPrompt = buildGroupPromptAr(project, customGrade, customSubject, customCompetency);

  return (
    <div className="space-y-4">
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {GROUP_PROJECTS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => selectGroup(g.id)}
            className={`rounded-2xl border p-3.5 text-left transition cursor-pointer ${
              g.id === project.id
                ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-900 hover:border-teal-400"
            }`}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider opacity-85">
              <Users className="h-3.5 w-3.5" />
              <span>{g.groupLabel}</span>
            </div>
            <p className="mt-1 text-sm font-bold leading-snug">{g.title}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200">
              Prototype réalisable en 25 min · Objectif testable, pas produit fini
            </span>
            <h4 className="mt-2 font-display text-xl font-bold text-slate-900">
              {project.title}
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">{project.expectedOutcome}</p>
          </div>
        </div>

        {/* Customization bar */}
        <div className="grid gap-3 sm:grid-cols-3 rounded-xl border border-teal-200 bg-ivory-50 p-4">
          <label className="text-xs font-semibold text-slate-800">
            Adapter le niveau (1AEP–6AEP)
            <input
              type="text"
              value={customGrade}
              onChange={(e) => setCustomGrade(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs"
            />
          </label>
          <label className="text-xs font-semibold text-slate-800">
            Adapter la discipline
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs"
            />
          </label>
          <label className="text-xs font-semibold text-slate-800">
            Adapter la compétence ciblée
            <input
              type="text"
              value={customCompetency}
              onChange={(e) => setCustomCompetency(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs"
            />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-[#0B1426] p-4 text-slate-100">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-cyan-300">
                Prompt réutilisable · Français
              </span>
              <CopyPromptButton text={frPrompt} label="Copier FR" />
            </div>
            <pre className="font-mono-code whitespace-pre-wrap text-[11px] leading-relaxed">
              {frPrompt}
            </pre>
          </div>

          <div
            dir="rtl"
            lang="ar"
            className="font-arabic rounded-xl border border-teal-300 bg-teal-50/60 p-4 text-slate-900"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900">
                نموذج Prompt جاهز · العربية
              </span>
              <div dir="ltr">
                <CopyPromptButton text={arPrompt} label="Copier AR" />
              </div>
            </div>
            <pre className="font-arabic whitespace-pre-wrap text-xs leading-relaxed">
              {arPrompt}
            </pre>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h5 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <ClipboardList className="h-4 w-4 text-teal-700" />
              Spécification technique simple
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {project.techSpec.map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h5 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <CheckSquare className="h-4 w-4 text-cyan-700" />
              Checklist de test
            </h5>
            <div className="space-y-1.5">
              {project.testingChecklist.map((item) => {
                const k = `${project.id}:test:${item}`;
                return (
                  <label key={k} className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(checkedItems[k])}
                      onChange={(e) =>
                        setCheckedItems((prev) => ({ ...prev, [k]: e.target.checked }))
                      }
                      className="mt-0.5 accent-teal-600"
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h5 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <CheckSquare className="h-4 w-4 text-amber-600" />
              Checklist de démonstration (2 min)
            </h5>
            <div className="space-y-1.5">
              {project.demoChecklist.map((item) => {
                const k = `${project.id}:demo:${item}`;
                return (
                  <label key={k} className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(checkedItems[k])}
                      onChange={(e) =>
                        setCheckedItems((prev) => ({ ...prev, [k]: e.target.checked }))
                      }
                      className="mt-0.5 accent-amber-600"
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
