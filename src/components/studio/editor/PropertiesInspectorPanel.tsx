"use client";

import React from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Trash2,
  Unlock,
} from "lucide-react";
import type { DeckSlide, SlideElement } from "@/lib/studio/document-schema";

interface PropertiesInspectorPanelProps {
  slide: DeckSlide;
  selectedElement: SlideElement | null;
  onUpdateSlide: (patch: Partial<DeckSlide>) => void;
  onUpdateElement: (elementId: string, patch: Partial<SlideElement>) => void;
  onDuplicateElement: (elementId: string) => void;
  onDeleteElement: (elementId: string) => void;
  onMoveLayer: (elementId: string, direction: "up" | "down") => void;
}

export function PropertiesInspectorPanel({
  slide,
  selectedElement,
  onUpdateSlide,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onMoveLayer,
}: PropertiesInspectorPanelProps) {
  const cfg = selectedElement?.config ?? {};

  return (
    <aside className="w-full lg:w-80 shrink-0 border-l border-[#E9E3D6] bg-white flex flex-col overflow-y-auto">
      <div className="border-b border-[#E9E3D6] px-4 py-3 bg-[#FAF8F4]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800">
          {selectedElement
            ? `Inspecteur · ${selectedElement.type}`
            : "Propriétés de la diapositive"}
        </h3>
        <p dir="rtl" lang="ar" className="font-arabic text-xs text-slate-600">
          {selectedElement ? "تعديل خصائص العنصر المحدد" : "إعدادات الشريحة وملاحظات المنشط"}
        </p>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {selectedElement ? (
          <>
            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                title="Monter d'un plan"
                onClick={() => onMoveLayer(selectedElement.id, "up")}
                className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Descendre d'un plan"
                onClick={() => onMoveLayer(selectedElement.id, "down")}
                className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Afficher / Masquer"
                onClick={() =>
                  onUpdateElement(selectedElement.id, { visible: !selectedElement.visible })
                }
                className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"
              >
                {selectedElement.visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4 text-amber-600" />
                )}
              </button>
              <button
                type="button"
                title="Verrouiller"
                onClick={() =>
                  onUpdateElement(selectedElement.id, { locked: !selectedElement.locked })
                }
                className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"
              >
                {selectedElement.locked ? (
                  <Lock className="h-4 w-4 text-amber-600" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                title="Dupliquer"
                onClick={() => onDuplicateElement(selectedElement.id)}
                className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Supprimer"
                data-delete-element="true"
                onClick={() => onDeleteElement(selectedElement.id)}
                className="ml-auto rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-700 hover:bg-rose-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Bilingual FR + AR Text Fields */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Texte Français (LTR)
                </label>
                <textarea
                  rows={2}
                  data-inspector-fr="true"
                  value={selectedElement.bilingual?.fr ?? ""}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      bilingual: {
                        fr: e.target.value,
                        ar: selectedElement.bilingual?.ar ?? "",
                      },
                    })
                  }
                  className="w-full rounded-xl border border-[#D9D0BE] bg-[#FAF8F4] px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  النص بالعربية (RTL)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  lang="ar"
                  data-inspector-ar="true"
                  value={selectedElement.bilingual?.ar ?? ""}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      bilingual: {
                        fr: selectedElement.bilingual?.fr ?? "",
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-[#D9D0BE] bg-[#FAF8F4] px-3 py-2 font-arabic text-xs"
                />
              </div>

              {(selectedElement.type === "bilingual-card" || selectedElement.type === "callout") && (
                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] font-bold uppercase text-slate-600">
                    Contenu détaillé (FR / AR)
                  </label>
                  <textarea
                    rows={2}
                    value={String(cfg.bodyFr ?? "")}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        config: { ...cfg, bodyFr: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-[#D9D0BE] bg-white px-2.5 py-1.5 text-xs"
                  />
                  <textarea
                    rows={2}
                    dir="rtl"
                    lang="ar"
                    value={String(cfg.bodyAr ?? "")}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        config: { ...cfg, bodyAr: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-[#D9D0BE] bg-white px-2.5 py-1.5 font-arabic text-xs"
                  />
                </div>
              )}

              {selectedElement.type === "image" && (
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    URL de l&apos;image
                  </label>
                  <input
                    type="text"
                    value={String(cfg.url ?? "/icon.svg")}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        config: { ...cfg, url: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-[#D9D0BE] bg-white px-2.5 py-1.5 text-xs font-mono"
                  />
                </div>
              )}
            </div>

            {/* Position & Geometry on 1920x1080 Canvas */}
            <div className="space-y-2 border-t border-slate-200 pt-3">
              <p className="text-[11px] font-bold uppercase text-slate-600">
                Position & Dimensions (1920×1080)
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="space-y-0.5">
                  <span className="text-slate-500">X</span>
                  <input
                    type="number"
                    data-inspector-x="true"
                    value={Math.round(selectedElement.x)}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, { x: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-slate-200 px-2 py-1 font-mono"
                  />
                </label>
                <label className="space-y-0.5">
                  <span className="text-slate-500">Y</span>
                  <input
                    type="number"
                    data-inspector-y="true"
                    value={Math.round(selectedElement.y)}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, { y: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-slate-200 px-2 py-1 font-mono"
                  />
                </label>
                <label className="space-y-0.5">
                  <span className="text-slate-500">Largeur (W)</span>
                  <input
                    type="number"
                    data-inspector-w="true"
                    value={Math.round(selectedElement.width)}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        width: Math.max(80, Number(e.target.value)),
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-2 py-1 font-mono"
                  />
                </label>
                <label className="space-y-0.5">
                  <span className="text-slate-500">Hauteur (H)</span>
                  <input
                    type="number"
                    data-inspector-h="true"
                    value={Math.round(selectedElement.height)}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        height: Math.max(40, Number(e.target.value)),
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-2 py-1 font-mono"
                  />
                </label>
              </div>
            </div>

            {/* Typography & Colors */}
            <div className="space-y-2 border-t border-slate-200 pt-3 text-xs">
              <p className="text-[11px] font-bold uppercase text-slate-600">Style visuel</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-0.5">
                  <span className="text-slate-500">Taille ({selectedElement.style.fontSize}px)</span>
                  <input
                    type="range"
                    min={16}
                    max={96}
                    value={selectedElement.style.fontSize}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        style: { ...selectedElement.style, fontSize: Number(e.target.value) },
                      })
                    }
                    className="w-full accent-teal-700"
                  />
                </label>
                <label className="space-y-0.5">
                  <span className="text-slate-500">Fond</span>
                  <input
                    type="color"
                    value={
                      selectedElement.style.backgroundColor.startsWith("#")
                        ? selectedElement.style.backgroundColor
                        : "#FFFFFF"
                    }
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        style: { ...selectedElement.style, backgroundColor: e.target.value },
                      })
                    }
                    className="h-8 w-full rounded border border-slate-200"
                  />
                </label>
              </div>
            </div>
          </>
        ) : (
          /* Slide-level Inspector */
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                Titre de la diapositive (FR)
              </label>
              <input
                type="text"
                data-slide-title-fr="true"
                value={slide.title.fr}
                onChange={(e) =>
                  onUpdateSlide({
                    title: { ...slide.title, fr: e.target.value },
                    legacySource: slide.legacySource
                      ? { ...slide.legacySource, edited: true }
                      : undefined,
                  })
                }
                className="w-full rounded-xl border border-[#D9D0BE] bg-[#FAF8F4] px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                عنوان الشريحة (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                lang="ar"
                data-slide-title-ar="true"
                value={slide.title.ar}
                onChange={(e) =>
                  onUpdateSlide({
                    title: { ...slide.title, ar: e.target.value },
                    legacySource: slide.legacySource
                      ? { ...slide.legacySource, edited: true }
                      : undefined,
                  })
                }
                className="w-full rounded-xl border border-[#D9D0BE] bg-[#FAF8F4] px-3 py-2 font-arabic text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Fond scène</label>
                <select
                  value={slide.background.color}
                  onChange={(e) =>
                    onUpdateSlide({
                      background: { ...slide.background, color: e.target.value },
                      layout: e.target.value === "#0B1220" ? "closing-dark" : slide.layout,
                    })
                  }
                  className="w-full rounded-lg border border-[#D9D0BE] bg-white px-2 py-1.5"
                >
                  <option value="#FAF8F4">Ivoire (#FAF8F4)</option>
                  <option value="#FFFFFF">Blanc pur (#FFFFFF)</option>
                  <option value="#0B1220">Nuit Navy (#0B1220)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Durée</label>
                <input
                  type="text"
                  value={slide.notes.durationCue}
                  onChange={(e) =>
                    onUpdateSlide({
                      notes: { ...slide.notes, durationCue: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border border-[#D9D0BE] bg-white px-2 py-1.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Always-accessible Speaker Notes FR / AR / Darija */}
        <div className="border-t border-[#E9E3D6] pt-4 space-y-2.5 text-xs">
          <p className="text-[11px] font-bold uppercase text-teal-800">
            Notes animateur (FR · AR · Darija)
          </p>
          <textarea
            rows={2}
            value={slide.notes.fr}
            onChange={(e) =>
              onUpdateSlide({ notes: { ...slide.notes, fr: e.target.value } })
            }
            placeholder="Note de conduite en français..."
            className="w-full rounded-lg border border-[#D9D0BE] bg-[#FAF8F4] px-2.5 py-1.5 text-xs"
          />
          <textarea
            rows={2}
            dir="rtl"
            lang="ar"
            value={slide.notes.ar}
            onChange={(e) =>
              onUpdateSlide({ notes: { ...slide.notes, ar: e.target.value } })
            }
            placeholder="ملاحظة التنشيط بالعربية..."
            className="w-full rounded-lg border border-[#D9D0BE] bg-[#FAF8F4] px-2.5 py-1.5 font-arabic text-xs"
          />
          <input
            type="text"
            value={slide.notes.darijaFr}
            onChange={(e) =>
              onUpdateSlide({ notes: { ...slide.notes, darijaFr: e.target.value } })
            }
            placeholder="Repère Darija..."
            className="w-full rounded-lg border border-[#D9D0BE] bg-[#FAF8F4] px-2.5 py-1.5 text-xs"
          />
        </div>
      </div>
    </aside>
  );
}
