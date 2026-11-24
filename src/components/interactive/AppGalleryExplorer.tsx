"use client";

import React, { useEffect, useState } from "react";
import { Globe, PlayCircle, Printer, ShieldCheck, WifiOff, X } from "lucide-react";
import { GALLERY_CATEGORIES } from "@/content/gallery";
import type { GalleryCategoryItem, GalleryContributionRecord } from "@/content/types";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
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
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("catalog")}
            className={`rounded-xl px-4 py-2 text-xs font-bold cursor-pointer ${
              tab === "catalog"
                ? "bg-navy-900 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            <BilingualInline
              text={{
                fr: "12 catégories pour le primaire",
                ar: "12 فئة للتعليم الابتدائي",
              }}
            />
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
            <BilingualInline
              text={{
                fr: `Galerie Collaborative de Mediouna (${contributions.length})`,
                ar: `المعرض التعاوني لمديونة (${contributions.length})`,
              }}
            />
          </button>
        </div>
        <BilingualBlock
          text={{
            fr: "Extension future possible : Amazigh (Tifinagh) selon les besoins des classes.",
            ar: "امتداد مستقبلي ممكن: الأمازيغية (تيفيناغ) حسب حاجيات الأقسام.",
          }}
          frClassName="text-xs text-slate-600"
          arClassName="text-xs text-teal-800"
        />
      </div>

      {selectedDemo?.demoKey && (
        <div className="rounded-2xl border-2 border-teal-500 bg-white p-5 shadow-md">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase text-teal-700">
                Démonstrateur fonctionnel · نموذج تطبيقي شغّال · {selectedDemo.gradeRange}
              </span>
              <BilingualBlock
                text={selectedDemo.title}
                frClassName="text-base font-bold text-slate-900"
                arClassName="text-sm font-bold text-teal-900"
              />
            </div>
            <button
              type="button"
              onClick={() => setSelectedDemo(null)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <BilingualInline text={{ fr: "Fermer la démo", ar: "إغلاق العرض" }} />
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
                      <BilingualInline text={item.subject} />
                    </span>
                  </div>
                </div>

                <BilingualBlock
                  text={item.title}
                  frClassName="text-sm font-bold text-slate-900"
                  arClassName="text-sm font-bold text-teal-900"
                />

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">
                    Problème · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">الإشكال</span>
                  </p>
                  <BilingualBlock text={item.problem} />
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">
                    Objectif · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">الهدف</span>
                  </p>
                  <BilingualBlock text={item.learningObjective} />
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-700">
                  {item.proposedFeatures.map((f) => (
                    <li key={f.fr} className="rounded-lg bg-slate-50 px-2.5 py-1.5">
                      <BilingualBlock text={f} />
                    </li>
                  ))}
                </ul>

                <div className="rounded-xl bg-ivory-50 p-2.5 text-[11px] text-slate-700 border border-slate-200/70 space-y-1">
                  <p className="font-bold text-slate-900">
                    Exemple d&apos;interaction · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">مثال للتفاعل</span>
                  </p>
                  <BilingualBlock text={item.exampleInteraction} />
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <p className="font-bold text-slate-700">
                    Améliorations possibles · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">تحسينات مقترحة</span>
                  </p>
                  {item.possibleImprovements.map((imp) => (
                    <BilingualBlock key={imp.fr} text={imp} />
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  {item.offlineReady && (
                    <span className="inline-flex items-center gap-1">
                      <WifiOff className="h-3 w-3 text-teal-600" />
                      <BilingualInline text={{ fr: "Hors ligne", ar: "بدون إنترنت" }} />
                    </span>
                  )}
                  {item.printFriendly && (
                    <span className="inline-flex items-center gap-1">
                      <Printer className="h-3 w-3 text-slate-600" />
                      A4
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
                    <BilingualInline text={{ fr: "Tester", ar: "تجريب" }} />
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">
                    <BilingualInline text={{ fr: "Fiche modèle", ar: "بطاقة نموذجية" }} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {contributions.length === 0 ? (
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
              <BilingualBlock
                text={{
                  fr: "Aucune contribution enregistrée pour cette session réelle pour l'instant. Les prototypes partagés en Section 11 apparaîtront ici.",
                  ar: "لا توجد أي مساهمة مسجلة في هذه الجلسة الحقيقية حتى الآن. ستظهر النماذج المشاركة في القسم 11 هنا.",
                }}
              />
            </div>
          ) : (
            contributions.map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-navy-900 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {c.gradeRange} · {c.discipline}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <BilingualInline text={{ fr: "Zéro donnée élève", ar: "دون معطيات تلاميذ" }} />
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{c.appTitle}</h4>
                <p className="text-xs text-slate-600">{c.description}</p>
                <p className="text-xs text-slate-700">
                  <strong>Objectif / الهدف :</strong> {c.learningObjective}
                </p>
                <p className="text-xs text-slate-600">
                  <strong>En classe / في القسم :</strong> {c.classroomInstructions}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                  <span>Proposé par / من اقتراح : {c.contributorName}</span>
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
