"use client";

import React, { useRef, useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
import type { AiOutlineResponse } from "@/lib/ai/schemas";
import type { DeckDocumentV1 } from "@/lib/studio/document-schema";

interface AiDeckWizardModalProps {
  roomId: string;
  onClose: () => void;
  onCreatedDeck: (deckDocument: DeckDocumentV1) => Promise<void>;
}

export function AiDeckWizardModal({
  roomId,
  onClose,
  onCreatedDeck,
}: AiDeckWizardModalProps) {
  const [step, setStep] = useState<"prompt" | "outline" | "preview">("prompt");
  const [topic, setTopic] = useState("Les fractions simples en 4AEP");
  const [level, setLevel] = useState("4AEP · التعليم الابتدائي");
  const [slideCount, setSlideCount] = useState(5);
  const [tone, setTone] = useState<"pedagogical" | "workshop" | "institutional">("pedagogical");
  const [useDemoMock, setUseDemoMock] = useState(false);

  const [outline, setOutline] = useState<AiOutlineResponse | null>(null);
  const [generatedDeck, setGeneratedDeck] = useState<DeckDocumentV1 | null>(null);
  const [metaText, setMetaText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function requestOutline() {
    setError(null);
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (useDemoMock) headers["x-studio-ai-mock"] = "outline-valid";

      const res = await fetch("/api/studio/ai/generate", {
        method: "POST",
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          step: "outline",
          topic,
          level,
          slideCount,
          tone,
          includeInteractive: true,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Erreur lors de la génération du plan.");
        return;
      }
      setOutline(json.outline);
      if (json.meta) {
        setMetaText(
          `${json.meta.modelId} · ${json.meta.usage.totalTokens} tokens (~$${json.meta.usage.estimatedUsd})`
        );
      }
      setStep("outline");
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Génération interrompue ou impossible.");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  async function generateDeckFromOutline() {
    if (!outline) return;
    setError(null);
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (useDemoMock) headers["x-studio-ai-mock"] = "deck-valid";

      const res = await fetch("/api/studio/ai/generate", {
        method: "POST",
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          step: "deck",
          roomId,
          topic,
          level,
          themeId: "mediouna-editorial",
          outline,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Erreur lors de la génération des slides.");
        return;
      }
      setGeneratedDeck(json.document);
      if (json.meta) {
        setMetaText(
          `${json.meta.modelId} · ${json.meta.usage.totalTokens} tokens (~$${json.meta.usage.estimatedUsd})`
        );
      }
      setStep("preview");
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Génération interrompue.");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  return (
    <div
      data-ai-wizard-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-3xl rounded-2xl border border-[#E9E3D6] bg-[#FAF8F4] text-[#0B1220] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between gap-3 bg-[#0B1220] px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-teal-400" />
            <div>
              <h2 className="font-display font-bold text-lg">
                Assistant IA · Générer une présentation
              </h2>
              <p dir="rtl" lang="ar" className="font-arabic text-xs text-teal-200">
                المساعد الذكي لإعداد عرض بيداغوجي ثنائي اللغة (توجيه ← مخطط ← شرائح)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              abortRef.current?.abort();
              onClose();
            }}
            className="rounded-lg p-1.5 hover:bg-white/10"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {error}
            </div>
          )}

          {step === "prompt" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Sujet pédagogique ou thème de séance · موضوع العرض
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border border-[#D9D0BE] bg-white px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Niveau · المستوى</label>
                  <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-xl border border-[#D9D0BE] bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Diapositives ({slideCount})</label>
                  <input
                    type="range"
                    min={3}
                    max={12}
                    value={slideCount}
                    onChange={(e) => setSlideCount(Number(e.target.value))}
                    className="w-full accent-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Style · الأسلوب</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as typeof tone)}
                    className="w-full rounded-xl border border-[#D9D0BE] bg-white px-3 py-2 text-sm"
                  >
                    <option value="pedagogical">Classe / Primaire</option>
                    <option value="workshop">Atelier enseignants</option>
                    <option value="institutional">Institutionnel</option>
                  </select>
                </div>
              </div>

              {process.env.NODE_ENV !== "production" && (
                <label className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs text-teal-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useDemoMock}
                    onChange={(e) => setUseDemoMock(e.target.checked)}
                  />
                  <span>
                    Mode simulation locale sans clé Gemini (tests & démo hors-ligne)
                  </span>
                </label>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                {loading && (
                  <button
                    type="button"
                    onClick={() => abortRef.current?.abort()}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold"
                  >
                    Annuler · إلغاء
                  </button>
                )}
                <button
                  type="button"
                  disabled={loading || topic.trim().length < 3}
                  onClick={requestOutline}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>1. Générer le plan bilingue · اقتراح المخطط</span>
                </button>
              </div>
            </div>
          )}

          {step === "outline" && outline && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#E9E3D6] bg-white p-3.5 space-y-2">
                <p className="text-xs font-bold uppercase text-teal-800">
                  Titre & Plan proposés (modifiables avant génération)
                </p>
                <input
                  type="text"
                  value={outline.deckTitleFr}
                  onChange={(e) => setOutline({ ...outline, deckTitleFr: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold"
                />
                <input
                  type="text"
                  dir="rtl"
                  lang="ar"
                  value={outline.deckTitleAr}
                  onChange={(e) => setOutline({ ...outline, deckTitleAr: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 font-arabic text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                {outline.slides.map((s, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl border border-[#E9E3D6] bg-white p-3"
                  >
                    <input
                      type="text"
                      value={s.titleFr}
                      onChange={(e) => {
                        const next = [...outline.slides];
                        next[idx] = { ...next[idx], titleFr: e.target.value };
                        setOutline({ ...outline, slides: next });
                      }}
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-semibold"
                    />
                    <input
                      type="text"
                      dir="rtl"
                      lang="ar"
                      value={s.titleAr}
                      onChange={(e) => {
                        const next = [...outline.slides];
                        next[idx] = { ...next[idx], titleAr: e.target.value };
                        setOutline({ ...outline, slides: next });
                      }}
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 font-arabic text-sm font-semibold"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep("prompt")}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold"
                >
                  ← Retour
                </button>
                <div className="flex items-center gap-2">
                  {loading && (
                    <button
                      type="button"
                      onClick={() => abortRef.current?.abort()}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold"
                    >
                      Annuler · إلغاء
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={generateDeckFromOutline}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>2. Construire les diapositives · توليد الشرائح</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "preview" && generatedDeck && (
            <div className="space-y-4">
              <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-xs text-teal-950 flex flex-wrap items-center justify-between gap-2">
                <span>
                  Prêt à importer : <strong>{generatedDeck.slides.length} slides</strong>
                </span>
                {metaText && <span className="font-mono">{metaText}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                {generatedDeck.slides.map((s, idx) => (
                  <div key={s.id} className="rounded-xl border border-[#E9E3D6] bg-white p-3 space-y-1">
                    <span className="text-[11px] font-bold text-teal-800">Slide {idx + 1}</span>
                    <p className="text-sm font-bold">{s.title.fr}</p>
                    <p dir="rtl" lang="ar" className="font-arabic text-sm text-teal-900">
                      {s.title.ar}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep("outline")}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold"
                >
                  ← Modifier le plan
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await onCreatedDeck(generatedDeck);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="rounded-xl bg-[#0B1220] px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
                >
                  Créer & Ouvrir dans l&apos;éditeur · حفظ وفتح المحرر
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
