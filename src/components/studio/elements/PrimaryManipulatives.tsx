"use client";

import React, { useState } from "react";
import { Check, Minus, Plus, RotateCcw } from "lucide-react";
import type { SlideElement } from "@/lib/studio/document-schema";

interface PrimaryProps {
  element: SlideElement;
  interactive: boolean;
  printMode?: boolean;
}

const HARAKAT = [
  { key: "fatha", label: "ـَ", apply: (l: string) => `${l}َ` },
  { key: "kasra", label: "ـِ", apply: (l: string) => `${l}ِ` },
  { key: "damma", label: "ـُ", apply: (l: string) => `${l}ُ` },
  { key: "alif", label: "ـَا", apply: (l: string) => `${l}َا` },
  { key: "ya", label: "ـِي", apply: (l: string) => `${l}ِي` },
  { key: "waw", label: "ـُو", apply: (l: string) => `${l}ُو` },
];

export function PrimaryManipulativeView({
  element,
  interactive,
  printMode = false,
}: PrimaryProps) {
  const cfg = element.config ?? {};
  const titleFr = element.bilingual?.fr ?? "";
  const titleAr = element.bilingual?.ar ?? "";

  const [selectedLetterIdx, setSelectedLetterIdx] = useState(0);
  const [selectedHarakaIdx, setSelectedHarakaIdx] = useState(0);
  const [activeSyllableWord, setActiveSyllableWord] = useState(0);

  const initialLineCurrent = Number(cfg.current ?? 7);
  const [lineValue, setLineValue] = useState(Number.isFinite(initialLineCurrent) ? initialLineCurrent : 7);

  const [hundreds, setHundreds] = useState(Math.max(0, Math.min(9, Number(cfg.hundreds ?? 2))));
  const [tens, setTens] = useState(Math.max(0, Math.min(9, Number(cfg.tens ?? 4))));
  const [units, setUnits] = useState(Math.max(0, Math.min(9, Number(cfg.units ?? 5))));

  const [numerator, setNumerator] = useState(Math.max(0, Math.min(12, Number(cfg.numerator ?? 3))));
  const [denominator, setDenominator] = useState(Math.max(1, Math.min(12, Number(cfg.denominator ?? 4))));

  const [answerInput, setAnswerInput] = useState("");
  const [checkedOp, setCheckedOp] = useState<boolean | null>(null);

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2 mb-3">
      <h3 className="font-display font-bold text-[26px] text-[#0B1220]">{titleFr}</h3>
      <h4 dir="rtl" lang="ar" className="font-arabic font-bold text-[26px] text-teal-800">
        {titleAr}
      </h4>
    </div>
  );

  switch (element.type) {
    case "arabic-letters": {
      const letters = Array.isArray(cfg.letters)
        ? cfg.letters.map((x) => String(x))
        : ["ب", "ت", "س", "م", "ر"];
      const currentLetter = letters[selectedLetterIdx] ?? letters[0] ?? "ب";
      const haraka = HARAKAT[selectedHarakaIdx] ?? HARAKAT[0];
      return (
        <div className="h-full w-full flex flex-col justify-between">
          {header}
          <div className="flex flex-wrap items-center justify-between gap-4 flex-1">
            <div dir="rtl" className="flex flex-wrap gap-2.5">
              {letters.map((letter, idx) => (
                <button
                  key={`${letter}-${idx}`}
                  type="button"
                  disabled={!interactive || printMode}
                  onClick={() => setSelectedLetterIdx(idx)}
                  className={`h-16 w-16 rounded-2xl border-2 font-arabic text-[34px] font-bold transition ${
                    idx === selectedLetterIdx
                      ? "bg-teal-700 text-white border-teal-800 shadow"
                      : "bg-[#FAF8F4] text-[#0B1220] border-slate-300 hover:border-teal-600"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border-2 border-teal-700/30 bg-teal-50 px-10 py-4 text-center">
              <p className="text-[14px] uppercase tracking-wider font-bold text-teal-800">
                Syllabe · المقطع الصوتي
              </p>
              <p dir="rtl" lang="ar" className="font-arabic text-[72px] font-bold leading-tight text-[#0B1220]">
                {haraka.apply(currentLetter)}
              </p>
            </div>

            <div dir="rtl" className="flex flex-wrap gap-2">
              {HARAKAT.map((h, idx) => (
                <button
                  key={h.key}
                  type="button"
                  disabled={!interactive || printMode}
                  onClick={() => setSelectedHarakaIdx(idx)}
                  className={`rounded-xl border px-4 py-2 font-arabic text-[24px] font-bold ${
                    idx === selectedHarakaIdx
                      ? "bg-[#0B1220] text-[#2DD4BF] border-[#0B1220]"
                      : "bg-white text-[#0B1220] border-slate-300"
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case "french-reading": {
      const words = Array.isArray(cfg.words)
        ? cfg.words.map((x) => String(x))
        : ["ca-ma-rade", "é-cole", "jar-din", "bi-blio-thèque"];
      const current = words[activeSyllableWord] ?? words[0];
      const parts = current.split("-").filter(Boolean);
      const colors = ["bg-teal-100 text-teal-900 border-teal-300", "bg-amber-100 text-amber-900 border-amber-300", "bg-sky-100 text-sky-900 border-sky-300", "bg-rose-100 text-rose-900 border-rose-300"];
      return (
        <div className="h-full w-full flex flex-col justify-between">
          {header}
          <div className="flex flex-col items-center justify-center gap-5 flex-1">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {parts.map((part, i) => (
                <span
                  key={`${part}-${i}`}
                  className={`rounded-2xl border-2 px-6 py-3 text-[44px] font-bold ${colors[i % colors.length]}`}
                >
                  {part}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {words.map((w, idx) => (
                <button
                  key={`${w}-${idx}`}
                  type="button"
                  disabled={!interactive || printMode}
                  onClick={() => setActiveSyllableWord(idx)}
                  className={`rounded-xl border px-4 py-2 text-[20px] font-bold ${
                    idx === activeSyllableWord
                      ? "bg-[#0B1220] text-white border-[#0B1220]"
                      : "bg-[#FAF8F4] text-slate-800 border-slate-300"
                  }`}
                >
                  {w.replaceAll("-", "")}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case "number-line": {
      const min = Number.isFinite(Number(cfg.min)) ? Number(cfg.min) : 0;
      const max = Number.isFinite(Number(cfg.max)) ? Number(cfg.max) : 20;
      const safeMax = Math.max(min + 5, Math.min(min + 25, max));
      const ticks = Array.from({ length: safeMax - min + 1 }, (_, i) => min + i);
      return (
        <div className="h-full w-full flex flex-col justify-between">
          {header}
          <div className="space-y-4 my-auto">
            <div className="flex items-center justify-between gap-2">
              {ticks.map((tick) => (
                <button
                  key={tick}
                  type="button"
                  disabled={!interactive || printMode}
                  onClick={() => setLineValue(tick)}
                  className={`flex-1 rounded-lg py-2 text-center font-mono text-[18px] font-bold border transition ${
                    tick === lineValue
                      ? "bg-teal-700 text-white border-teal-800 scale-110 shadow"
                      : "bg-[#FAF8F4] text-slate-800 border-slate-300"
                  }`}
                >
                  {tick}
                </button>
              ))}
            </div>
            {!printMode && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[22px] font-bold text-teal-800">
                  Position actuelle · الموقع الحالي : <strong className="font-mono text-[28px]">{lineValue}</strong>
                </span>
                <div className="flex items-center gap-2">
                  {[-5, -1, 1, 5].map((delta) => (
                    <button
                      key={delta}
                      type="button"
                      disabled={!interactive}
                      onClick={() => setLineValue((v) => Math.max(min, Math.min(safeMax, v + delta)))}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-1.5 font-mono text-[18px] font-bold hover:border-teal-600"
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    case "abacus": {
      const total = hundreds * 100 + tens * 10 + units;
      const cols = [
        { labelFr: "Centaines (C)", labelAr: "المئات", value: hundreds, set: setHundreds, color: "bg-teal-700" },
        { labelFr: "Dizaines (D)", labelAr: "العشرات", value: tens, set: setTens, color: "bg-amber-600" },
        { labelFr: "Unités (U)", labelAr: "الوحدات", value: units, set: setUnits, color: "bg-slate-800" },
      ];
      return (
        <div className="h-full w-full flex flex-col justify-between">
          {header}
          <div className="grid grid-cols-3 gap-4 flex-1 items-center">
            {cols.map((c) => (
              <div key={c.labelFr} className="rounded-2xl border border-slate-200 bg-[#FAF8F4] p-3 text-center">
                <p className="text-[16px] font-bold text-slate-800">{c.labelFr}</p>
                <p dir="rtl" lang="ar" className="font-arabic text-[16px] text-teal-800 font-bold mb-2">
                  {c.labelAr}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 min-h-[56px] items-center">
                  {Array.from({ length: c.value }).map((_, idx) => (
                    <span key={idx} className={`h-5 w-5 rounded-full ${c.color}`} />
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={!interactive || printMode}
                    onClick={() => c.set((v) => Math.max(0, v - 1))}
                    className="rounded-lg border border-slate-300 bg-white p-1.5"
                    aria-label="Diminuer"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-mono text-[28px] font-bold">{c.value}</span>
                  <button
                    type="button"
                    disabled={!interactive || printMode}
                    onClick={() => c.set((v) => Math.min(9, v + 1))}
                    className="rounded-lg border border-slate-300 bg-white p-1.5"
                    aria-label="Augmenter"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center font-mono text-[26px] font-bold text-teal-800 mt-2">
            Total = {total}
          </p>
        </div>
      );
    }

    case "base10-blocks": {
      const target = Math.max(0, Math.min(999, Number(cfg.number ?? 345)));
      const h = Math.floor(target / 100);
      const t = Math.floor((target % 100) / 10);
      const u = target % 10;
      return (
        <div className="h-full w-full flex flex-col justify-between">
          {header}
          <div className="grid grid-cols-3 gap-4 flex-1 items-center">
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-center">
              <p className="text-[18px] font-bold text-teal-900">{h} × 100</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {Array.from({ length: h }).map((_, idx) => (
                  <div key={idx} className="h-12 w-12 rounded border border-teal-700 bg-teal-600/80" />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
              <p className="text-[18px] font-bold text-amber-900">{t} × 10</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {Array.from({ length: t }).map((_, idx) => (
                  <div key={idx} className="h-12 w-3 rounded border border-amber-700 bg-amber-500/80" />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 text-center">
              <p className="text-[18px] font-bold text-slate-900">{u} × 1</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {Array.from({ length: u }).map((_, idx) => (
                  <div key={idx} className="h-4 w-4 rounded border border-slate-700 bg-slate-700" />
                ))}
              </div>
            </div>
          </div>
          <p className="text-center font-mono text-[28px] font-bold text-[#0B1220] mt-2">
            {target} = {h * 100} + {t * 10} + {u}
          </p>
        </div>
      );
    }

    case "fractions-lab": {
      const safeNum = Math.min(numerator, denominator);
      return (
        <div className="h-full w-full flex flex-col justify-between">
          {header}
          <div className="flex flex-col justify-center gap-4 flex-1">
            <div className="flex h-16 w-full overflow-hidden rounded-xl border-2 border-[#0B1220]">
              {Array.from({ length: denominator }).map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 border-r last:border-r-0 border-slate-400 transition ${
                    idx < safeNum ? "bg-teal-600" : "bg-white"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[38px] font-bold text-[#0B1220]">
                {safeNum} / {denominator}
              </span>
              {!printMode && interactive && (
                <div className="flex items-center gap-4 text-[18px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Num:</span>
                    <button
                      type="button"
                      onClick={() => setNumerator((n) => Math.max(0, n - 1))}
                      className="rounded-lg border px-2.5 py-1 bg-white"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => setNumerator((n) => Math.min(denominator, n + 1))}
                      className="rounded-lg border px-2.5 py-1 bg-white"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Den:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDenominator((d) => {
                          const next = Math.max(2, d - 1);
                          setNumerator((n) => Math.min(n, next));
                          return next;
                        });
                      }}
                      className="rounded-lg border px-2.5 py-1 bg-white"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => setDenominator((d) => Math.min(12, d + 1))}
                      className="rounded-lg border px-2.5 py-1 bg-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    case "math-operations": {
      const left = Number(cfg.left ?? 248);
      const right = Number(cfg.right ?? 135);
      const op = String(cfg.operator ?? "+");
      const expected = op === "-" || op === "−" ? left - right : op === "×" || op === "*" ? left * right : left + right;
      return (
        <div className="h-full w-full flex flex-col justify-between">
          {header}
          <div className="flex items-center justify-center gap-10 flex-1">
            <div className="rounded-2xl border-2 border-slate-300 bg-[#FAF8F4] px-8 py-5 font-mono text-[38px] font-bold text-right leading-snug">
              <div>{left}</div>
              <div className="border-b-4 border-[#0B1220] pb-1">
                {op} {right}
              </div>
              <div className="pt-2 text-teal-800">{printMode ? "______" : checkedOp ? expected : "?"}</div>
            </div>
            {!printMode && (
              <div className="space-y-3">
                <input
                  type="number"
                  value={answerInput}
                  disabled={!interactive}
                  onChange={(e) => {
                    setAnswerInput(e.target.value);
                    setCheckedOp(null);
                  }}
                  placeholder="Réponse / الجواب"
                  className="w-44 rounded-xl border-2 border-slate-300 bg-white px-4 py-2 font-mono text-[26px]"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!interactive}
                    onClick={() => setCheckedOp(Number(answerInput) === expected)}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-[18px] font-bold text-white"
                  >
                    <Check className="h-4 w-4" />
                    <span>Vérifier · تحقق</span>
                  </button>
                  <button
                    type="button"
                    disabled={!interactive}
                    onClick={() => {
                      setAnswerInput("");
                      setCheckedOp(null);
                    }}
                    className="rounded-xl border border-slate-300 bg-white p-2"
                    aria-label="Reset"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
                {checkedOp !== null && (
                  <p className={`text-[18px] font-bold ${checkedOp ? "text-emerald-700" : "text-rose-700"}`}>
                    {checkedOp ? "Bravo ! إجابة صحيحة" : `Réessayez (${expected}) · حاول مجدداً`}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    case "tarl-tracks": {
      const tracks = Array.isArray(cfg.tracks)
        ? (cfg.tracks as Array<{ level?: string; taskFr?: string; taskAr?: string }>)
        : [];
      return (
        <div className="h-full w-full flex flex-col justify-between">
          {header}
          <div className="grid grid-cols-3 gap-4 flex-1 items-stretch">
            {tracks.map((tr, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-[#FAF8F4] p-4 flex flex-col justify-between">
                <span className="inline-block rounded-full bg-teal-700 text-white px-3 py-1 text-[16px] font-bold self-start">
                  {tr.level ?? `Niveau ${i + 1}`}
                </span>
                <p className="mt-3 text-[22px] font-semibold text-[#0B1220]">{tr.taskFr}</p>
                <p dir="rtl" lang="ar" className="font-arabic text-[22px] text-teal-900 mt-2">
                  {tr.taskAr}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "worksheet-generator": {
      const grade = String(cfg.grade ?? "4AEP");
      const itemsFr = Array.isArray(cfg.itemsFr) ? cfg.itemsFr.map(String) : [];
      const itemsAr = Array.isArray(cfg.itemsAr) ? cfg.itemsAr.map(String) : [];
      return (
        <div className="h-full w-full flex flex-col justify-between rounded-xl border-2 border-dashed border-slate-400 bg-white p-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <span className="rounded bg-[#0B1220] text-white px-2.5 py-0.5 text-[14px] font-bold mr-2">
                {grade}
              </span>
              <span className="font-display font-bold text-[24px]">{titleFr}</span>
            </div>
            <span dir="rtl" lang="ar" className="font-arabic font-bold text-[24px] text-teal-800">
              {titleAr}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6 py-3 flex-1">
            <ul className="space-y-2 text-[20px] text-[#0B1220]">
              {itemsFr.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <ul dir="rtl" lang="ar" className="font-arabic space-y-2 text-[22px] text-teal-950">
              {itemsAr.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="text-[14px] text-slate-500 border-t border-slate-200 pt-2">
            Nom / الاسم : ___________________________ · Date / التاريخ : ___________
          </p>
        </div>
      );
    }

    default:
      return null;
  }
}
