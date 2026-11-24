"use client";

import React, { useEffect, useState } from "react";
import { Globe, PlayCircle, Printer, ShieldCheck, WifiOff, X } from "lucide-react";
import { GALLERY_CATEGORIES } from "@/content/gallery";
import type { GalleryCategoryItem, GalleryContributionRecord } from "@/content/types";
import { MiniAppDemoPanel } from "./MiniAppsPlayground";

export function AppGalleryExplorer() {
  const [selectedDemo, setSelectedDemo] = useState<GalleryCategoryItem | null>(null);
  const [tab, setTab] = useState<"catalog" | "provincial">("catalog");
  const [contributions, setContributions] = useState<GalleryContributionRecord[]>([]);

  useEffect(() => {
    fetch("/api/gallery", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.contributions) setContributions(d.contributions);
      })
      .catch(() => undefined);
  }, [tab]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("catalog")}
            className={`rounded-xl px-4 py-2 text-xs font-bold cursor-pointer ${
              tab === "catalog"
                ? "bg-navy-900 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            12 catégories pour le primaire
          </button>
          <button
            type="button"
            onClick={() => setTab("provincial")}
            className={`rounded-xl px-4 py-2 text-xs font-bold cursor-pointer ${
              tab === "provincial"
                ? "bg-teal-600 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            Galerie Collaborative de Mediouna ({contributions.length})
          </button>
        </div>
        <span className="text-xs text-slate-600">
          Extension future possible : Amazigh (Tifinagh) selon les besoins des classes.
        </span>
      </div>

      {selectedDemo?.demoKey && (
        <div className="rounded-2xl border-2 border-teal-500 bg-white p-5 shadow-md">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase text-teal-700">
                Démonstrateur fonctionnel · {selectedDemo.gradeRange}
              </span>
              <h4 className="text-base font-bold text-slate-900">{selectedDemo.title}</h4>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDemo(null)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              Fermer la démo
            </button>
          </div>
          <MiniAppDemoPanel demoKey={selectedDemo.demoKey} />
        </div>
      )}

      {tab === "catalog" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {GALLERY_CATEGORIES.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-xs font-bold text-white">
                    {item.number}
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-teal-800">
                      {item.gradeRange}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                      {item.subject}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Problème :</strong> {item.problem}
                </p>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Objectif :</strong> {item.learningObjective}
                </p>

                <ul className="space-y-1 text-[11px] text-slate-700">
                  {item.proposedFeatures.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>

                <div className="rounded-xl bg-ivory-50 p-2.5 text-[11px] text-slate-700 border border-slate-200/70">
                  <strong>Interaction :</strong> {item.exampleInteraction}
                </div>
                <p className="text-[11px] text-slate-500">
                  <strong>Pistes :</strong> {item.possibleImprovements.join(" · ")}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  {item.offlineReady && (
                    <span className="inline-flex items-center gap-1">
                      <WifiOff className="h-3 w-3 text-teal-600" /> Hors ligne
                    </span>
                  )}
                  {item.printFriendly && (
                    <span className="inline-flex items-center gap-1">
                      <Printer className="h-3 w-3 text-slate-600" /> A4
                    </span>
                  )}
                </div>
                {item.demoKey ? (
                  <button
                    type="button"
                    onClick={() => setSelectedDemo(item)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 cursor-pointer"
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                    Tester
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">Fiche modèle</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {contributions.length === 0 ? (
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
              Aucune contribution enregistrée pour cette session réelle pour l&apos;instant. Les prototypes partagés en Section 11 apparaîtront ici.
            </div>
          ) : (
            contributions.map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-navy-900 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {c.gradeRange} · {c.discipline}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> Zéro donnée élève
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{c.appTitle}</h4>
                <p className="text-xs text-slate-600">{c.description}</p>
                <p className="text-xs text-slate-700">
                  <strong>Objectif :</strong> {c.learningObjective}
                </p>
                <p className="text-xs text-slate-600">
                  <strong>En classe :</strong> {c.classroomInstructions}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                  <span>Proposé par {c.contributorName}</span>
                  <span className="inline-flex items-center gap-1">
                    <Globe className="h-3 w-3" /> {c.language}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
