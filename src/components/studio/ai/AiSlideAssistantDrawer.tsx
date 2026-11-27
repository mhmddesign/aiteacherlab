"use client";

import React, { useState } from "react";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import type { DeckSlide } from "@/lib/studio/document-schema";

interface AiSlideAssistantDrawerProps {
  slide: DeckSlide;
  onClose: () => void;
  onApplyProposedSlide: (nextSlide: DeckSlide, summaryFr: string) => void;
}

export function AiSlideAssistantDrawer({
  slide,
  onClose,
  onApplyProposedSlide,
}: AiSlideAssistantDrawerProps) {
  const [action, setAction] = useState<
    "bilingual-improve" | "clarify-level" | "add-quiz" | "add-manipulative" | "speaker-notes" | "custom"
  >("bilingual-improve");
  const [instruction, setInstruction] = useState("");
  const [targetLevel, setTargetLevel] = useState("4AEP");
  const [useDemoMock, setUseDemoMock] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposal, setProposal] = useState<{
    proposedSlide: DeckSlide;
    summary: { fr: string; ar: string };
    metaText: string;
  } | null>(null);

  async function requestSuggestion() {
    setError(null);
    setLoading(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (useDemoMock) headers["x-studio-ai-mock"] = "edit-valid";

      const res = await fetch("/api/studio/ai/edit-slide", {
        method: "POST",
        headers,
        body: JSON.stringify({
          slide,
          action,
          instruction,
          targetLevel,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Impossible de générer une proposition.");
        return;
      }
      setProposal({
        proposedSlide: json.proposedSlide,
        summary: json.summary,
        metaText: json.meta
          ? `${json.meta.modelId} · ${json.meta.usage.totalTokens} tokens`
          : "",
      });
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-[#D9D0BE] bg-[#FAF8F4] shadow-2xl flex flex-col">
      <div className="flex items-center justify-between bg-[#0B1220] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-400" />
          <span className="font-bold text-sm">Assistant IA — Slide sélectionnée</span>
        </div>
        <button type="button" onClick={onClose} className="rounded p-1 hover:bg-white/10">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1 text-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-slate-600">Action rapide</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as typeof action)}
            className="w-full rounded-xl border border-[#D9D0BE] bg-white px-3 py-2 text-sm"
          >
            <option value="bilingual-improve">Améliorer la clarté bilingue FR + AR</option>
            <option value="clarify-level">Adapter au niveau primaire (1AEP–6AEP)</option>
            <option value="add-quiz">Générer un quiz QCM lié à cette slide</option>
            <option value="add-manipulative">Ajouter un outil primaire (Fractions / Droite)</option>
            <option value="speaker-notes">Rédiger notes animateur FR + AR + Darija</option>
            <option value="custom">Instruction personnalisée</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold">Niveau</label>
            <input
              type="text"
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
              className="w-full rounded-lg border border-[#D9D0BE] bg-white px-2.5 py-1.5 text-xs"
            />
          </div>
          {process.env.NODE_ENV !== "production" && (
            <label className="flex items-center gap-1.5 text-xs pt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={useDemoMock}
                onChange={(e) => setUseDemoMock(e.target.checked)}
              />
              <span>Simulation locale</span>
            </label>
          )}
        </div>

        <textarea
          rows={2}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Précision optionnelle (ex: ajouter un exemple marocain)..."
          className="w-full rounded-xl border border-[#D9D0BE] bg-white px-3 py-2 text-xs"
        />

        <button
          type="button"
          disabled={loading}
          onClick={requestSuggestion}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 font-bold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Prévisualiser la modification · معاينة التعديل</span>
        </button>

        {error && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">
            {error}
          </div>
        )}

        {proposal && (
          <div className="space-y-3 rounded-xl border-2 border-teal-600/40 bg-white p-3.5">
            <div className="border-b border-slate-200 pb-2">
              <p className="font-bold text-teal-800 text-xs">{proposal.summary.fr}</p>
              <p dir="rtl" lang="ar" className="font-arabic text-xs text-teal-900">
                {proposal.summary.ar}
              </p>
              {proposal.metaText && (
                <p className="font-mono text-[11px] text-slate-500 mt-1">{proposal.metaText}</p>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-slate-500 line-through">Avant : {slide.title.fr}</p>
              <p className="font-bold text-emerald-800">Après : {proposal.proposedSlide.title.fr}</p>
              <p dir="rtl" lang="ar" className="font-arabic font-bold text-teal-900">
                {proposal.proposedSlide.title.ar}
              </p>
              <p className="text-slate-600">
                Éléments : {slide.elements.length} → {proposal.proposedSlide.elements.length}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onApplyProposedSlide(proposal.proposedSlide, proposal.summary.fr);
                  onClose();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white"
              >
                <Check className="h-4 w-4" />
                <span>Appliquer · تطبيق</span>
              </button>
              <button
                type="button"
                onClick={() => setProposal(null)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold"
              >
                Rejeter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
