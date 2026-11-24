"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, Printer, RefreshCw, Shuffle } from "lucide-react";
import type { GalleryCategoryItem } from "@/content/types";
import { DemoQuizApp } from "./DemoQuizApp";

type DemoKey = NonNullable<GalleryCategoryItem["demoKey"]>;

const ARABIC_LETTERS = [
  { letter: "ب", name: "الباء", forms: ["بـ", "ـبـ", "ـب"] },
  { letter: "ت", name: "التاء", forms: ["تـ", "ـتـ", "ـت"] },
  { letter: "س", name: "السين", forms: ["سـ", "ـسـ", "ـس"] },
  { letter: "م", name: "الميم", forms: ["مـ", "ـمـ", "ـم"] },
  { letter: "ل", name: "اللام", forms: ["لـ", "ـلـ", "ـل"] },
];

const VOWELS = [
  { mark: "\u064E", label: "فَتْحَة" },
  { mark: "\u064F", label: "ضَمَّة" },
  { mark: "\u0650", label: "كَسْرَة" },
  { mark: "ا", label: "مَدّ بِالأَلِف" },
];

const FLASHCARDS = [
  { fr: "Le tableau", ar: "السَّبُّورَةُ", sentence: "L'élève écrit la date au tableau." },
  { fr: "Le cahier", ar: "الدَّفْتَرُ", sentence: "J'ouvre mon cahier de mathématiques." },
  { fr: "La fraction", ar: "الْكَسْرُ", sentence: "Un demi (1/2) est une fraction simple." },
  { fr: "La graine", ar: "الْبَذْرَةُ", sentence: "La graine germe grâce à l'eau." },
];

export function MiniAppDemoPanel({ demoKey }: { demoKey: DemoKey }) {
  // 1. Arabic literacy state
  const [letterIdx, setLetterIdx] = useState(0);
  const [vowelIdx, setVowelIdx] = useState(0);

  // 2. Flashcard state
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // 3. Math C/D/U state
  const [hundreds, setHundreds] = useState(2);
  const [tens, setTens] = useState(4);
  const [units, setUnits] = useState(3);
  const [targetNum, setTargetNum] = useState(243);

  // 4. Remediation TaRL state
  const [track, setTrack] = useState<"base" | "inter" | "defi">("base");
  const [tarlFeedback, setTarlFeedback] = useState<string | null>(null);

  // 5. Formative assessment state
  const [qErrors, setQErrors] = useState<number[]>([2, 4, 14, 5, 3]);

  // 6. Printable worksheet state
  const [sheetTitle, setSheetTitle] = useState("Fiche de calcul · Décomposition 3AEP");
  const [sheetNote, setSheetNote] = useState("Consigne : Complète les décompositions puis vérifie avec ta règle.");

  // 7. Group maker state
  const [studentCount, setStudentCount] = useState(24);
  const [groupSize, setGroupSize] = useState(4);
  const [seed, setSeed] = useState(1);

  const generatedGroups = useMemo(() => {
    const arr = Array.from({ length: studentCount }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (i * 7 + seed * 13) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const groups: number[][] = [];
    for (let i = 0; i < arr.length; i += groupSize) {
      groups.push(arr.slice(i, i + groupSize));
    }
    return groups;
  }, [studentCount, groupSize, seed]);

  if (demoKey === "french-reading") {
    return <DemoQuizApp />;
  }

  if (demoKey === "arabic-literacy") {
    const activeL = ARABIC_LETTERS[letterIdx];
    const activeV = VOWELS[vowelIdx];
    const syllable = `${activeL.letter}${activeV.mark}`;
    return (
      <div dir="rtl" lang="ar" className="font-arabic space-y-4 rounded-2xl border border-teal-200 bg-ivory-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-bold text-teal-900">
            تطبيق القراءة والمقاطع (1AEP–2AEP)
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
            بدون أنترنيت · للسبورة التفاعلية
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ARABIC_LETTERS.map((item, idx) => (
            <button
              key={item.letter}
              type="button"
              onClick={() => setLetterIdx(idx)}
              className={`rounded-xl border px-4 py-2 text-xl font-bold cursor-pointer ${
                idx === letterIdx
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-300 bg-white text-slate-900"
              }`}
            >
              {item.letter}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {VOWELS.map((v, idx) => (
            <button
              key={v.label}
              type="button"
              onClick={() => setVowelIdx(idx)}
              className={`rounded-xl border px-3 py-1.5 text-sm font-semibold cursor-pointer ${
                idx === vowelIdx
                  ? "border-cyan-600 bg-cyan-600 text-white"
                  : "border-slate-300 bg-white text-slate-800"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 items-center rounded-2xl bg-white p-5 border border-slate-200">
          <div className="text-center">
            <p className="text-xs text-slate-500">المقطع الصوتي المركب</p>
            <p className="mt-2 text-6xl font-bold text-navy-900">{syllable}</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-bold text-teal-800">أشكال الحرف ({activeL.name}) :</p>
            <div className="flex justify-around rounded-xl bg-ivory-100 p-3 text-2xl font-bold text-slate-900">
              <span>{activeL.forms[0]}</span>
              <span>{activeL.forms[1]}</span>
              <span>{activeL.forms[2]}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (demoKey === "vocab-flashcards") {
    const card = FLASHCARDS[cardIdx];
    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-ivory-50 p-5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Carte {cardIdx + 1} / {FLASHCARDS.length}</span>
          <span>Cliquez sur la carte pour retourner</span>
        </div>
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="w-full rounded-2xl border border-teal-200 bg-white p-7 text-center shadow-xs hover:border-teal-500 cursor-pointer"
        >
          {!flipped ? (
            <div>
              <p className="text-xs uppercase tracking-wider text-teal-700 font-bold">Français (LTR)</p>
              <p className="mt-2 font-display text-3xl font-bold text-navy-900">{card.fr}</p>
              <p className="mt-2 text-sm text-slate-600">{card.sentence}</p>
            </div>
          ) : (
            <div dir="rtl" lang="ar" className="font-arabic">
              <p className="text-xs font-bold text-cyan-700">العربية (RTL)</p>
              <p className="mt-2 text-4xl font-bold text-navy-900">{card.ar}</p>
            </div>
          )}
        </button>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => {
              setFlipped(false);
              setCardIdx((i) => (i - 1 + FLASHCARDS.length) % FLASHCARDS.length);
            }}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            ← Précédente
          </button>
          <button
            type="button"
            onClick={() => {
              setFlipped(false);
              setCardIdx((i) => (i + 1) % FLASHCARDS.length);
            }}
            className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white cursor-pointer"
          >
            Suivante →
          </button>
        </div>
      </div>
    );
  }

  if (demoKey === "math-manipulatives") {
    const currentVal = hundreds * 100 + tens * 10 + units;
    const isMatch = currentVal === targetNum;
    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-ivory-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase text-teal-800">
              Défi C / D / U · Valeur positionnelle
            </span>
            <h5 className="text-lg font-bold text-slate-900">
              Construisez le nombre : <span className="font-mono-code text-teal-700">{targetNum}</span>
            </h5>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = [125, 308, 412, 243][Math.floor(Math.random() * 4)];
              setTargetNum(next);
              setHundreds(0);
              setTens(0);
              setUnits(0);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Nouveau défi
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Centaines (100)", val: hundreds, set: setHundreds, max: 5, color: "bg-navy-900 text-white" },
            { label: "Dizaines (10)", val: tens, set: setTens, max: 9, color: "bg-teal-600 text-white" },
            { label: "Unités (1)", val: units, set: setUnits, max: 9, color: "bg-cyan-500 text-slate-950" },
          ].map((col) => (
            <div key={col.label} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-xs font-bold text-slate-700">{col.label}</p>
              <p className="my-2 font-mono-code text-2xl font-bold text-slate-900">{col.val}</p>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => col.set((v) => Math.max(0, v - 1))}
                  className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold cursor-pointer"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => col.set((v) => Math.min(col.max, v + 1))}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer ${col.color}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold ${
            isMatch
              ? "border-teal-600 bg-teal-50 text-teal-900"
              : "border-slate-200 bg-white text-slate-800"
          }`}
        >
          <span>
            Votre construction : {hundreds * 100} + {tens * 10} + {units} = {currentVal}
          </span>
          {isMatch && (
            <span className="inline-flex items-center gap-1 text-teal-700">
              <CheckCircle2 className="h-4 w-4" /> Exact !
            </span>
          )}
        </div>
      </div>
    );
  }

  if (demoKey === "remediation-tarl") {
    const exercises = {
      base: {
        title: "Parcours Base · Addition sans retenue (< 50)",
        prompt: "23 + 14 = ?",
        choices: ["37", "27", "47"],
        ok: "37",
        hint: "On additionne les unités (3 + 4 = 7) puis les dizaines (2 + 1 = 3).",
      },
      inter: {
        title: "Parcours Intermédiaire · Addition avec une retenue",
        prompt: "48 + 25 = ?",
        choices: ["63", "73", "72"],
        ok: "73",
        hint: "8 + 5 = 13 → on écrit 3 et on retient 1 dizaine : 4 + 2 + 1 = 7.",
      },
      defi: {
        title: "Parcours Défi · Petit problème contextualisé",
        prompt: "La bibliothèque a 145 livres en arabe et 78 en français. Combien en tout ?",
        choices: ["213", "223", "233"],
        ok: "223",
        hint: "145 + 78 = 223 livres.",
      },
    }[track];

    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-ivory-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase text-teal-800">
            Remédiation 3 parcours (difficulté pilotée par l&apos;enseignant)
          </span>
          <div className="flex gap-1.5">
            {(
              [
                ["base", "Base"],
                ["inter", "Intermédiaire"],
                ["defi", "Défi"],
              ] as const
            ).map(([id, lbl]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTrack(id);
                  setTarlFeedback(null);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
                  track === id
                    ? "bg-navy-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 border border-slate-200 space-y-3">
          <p className="text-xs font-semibold text-teal-700">{exercises.title}</p>
          <p className="text-base font-bold text-slate-900">{exercises.prompt}</p>
          <div className="flex flex-wrap gap-2">
            {exercises.choices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() =>
                  setTarlFeedback(
                    c === exercises.ok
                      ? `Bravo ! ${exercises.hint}`
                      : `Pas tout à fait. Indice : ${exercises.hint}`
                  )
                }
                className="rounded-xl border border-slate-300 bg-ivory-50 px-4 py-2 text-sm font-bold hover:border-teal-500 cursor-pointer"
              >
                {c}
              </button>
            ))}
          </div>
          {tarlFeedback && (
            <p className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-900">
              {tarlFeedback}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (demoKey === "formative-assessment") {
    const items = [
      "Q1 · Lire une fraction simple (1/2)",
      "Q2 · Identifier le dénominateur",
      "Q3 · Parts égales obligatoires (piège)",
      "Q4 · Comparer 1/4 et 1/2",
      "Q5 · Colorier 3/4 d'une bande",
    ];
    return (
      <div className="print-sheet space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h5 className="text-sm font-bold text-slate-900">
              Bilan collectif d&apos;évaluation formative (5AEP · 32 élèves)
            </h5>
            <p className="text-xs text-slate-600">
              Saisissez le nombre d&apos;élèves en erreur par item (aucun nom d&apos;élève).
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-3 py-2 text-xs font-bold text-white cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            Imprimer le bilan A4
          </button>
        </div>

        <div className="space-y-2">
          {items.map((label, idx) => {
            const errs = qErrors[idx] ?? 0;
            const alert = errs >= 10;
            return (
              <div
                key={label}
                className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
                  alert ? "border-amber-300 bg-amber-50/70" : "border-slate-200 bg-slate-50"
                }`}
              >
                <span className="font-semibold text-slate-900">{label}</span>
                <div className="flex items-center gap-2">
                  <span className={alert ? "font-bold text-amber-800" : "text-slate-600"}>
                    {errs} erreurs {alert ? "· À reprendre demain" : ""}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={errs}
                    onChange={(e) => {
                      const next = [...qErrors];
                      next[idx] = Math.max(0, Number(e.target.value) || 0);
                      setQErrors(next);
                    }}
                    className="no-print w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-center font-mono-code"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (demoKey === "printable-worksheet") {
    return (
      <div className="space-y-4">
        <div className="no-print grid gap-3 sm:grid-cols-2 rounded-xl border border-slate-200 bg-ivory-50 p-4">
          <label className="text-xs font-semibold text-slate-700">
            Titre de la fiche A4
            <input
              type="text"
              value={sheetTitle}
              onChange={(e) => setSheetTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </label>
          <label className="text-xs font-semibold text-slate-700">
            Consigne élève
            <input
              type="text"
              value={sheetNote}
              onChange={(e) => setSheetNote(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </label>
        </div>

        <div className="print-sheet rounded-2xl border border-slate-300 bg-white p-6 text-slate-900">
          <div className="flex items-center justify-between border-b border-slate-300 pb-3">
            <div>
              <h5 className="text-base font-bold">{sheetTitle}</h5>
              <p className="text-xs text-slate-600">{sheetNote}</p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p>Nom : ___________________</p>
              <p>Date : ____ / ____ / 2026</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-lg border border-slate-200 p-3">1) 245 = ____ + ____ + ____</div>
            <div className="rounded-lg border border-slate-200 p-3">2) 508 = ____ + ____ + ____</div>
            <div className="rounded-lg border border-slate-200 p-3">3) 300 + 70 + 4 = ________</div>
            <div className="rounded-lg border border-slate-200 p-3">4) 600 + 9 = ________</div>
          </div>
          <div className="no-print mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Imprimer la fiche élève
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Group maker
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-ivory-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <label className="flex items-center gap-2">
            Élèves (par numéros) :
            <input
              type="number"
              min={6}
              max={45}
              value={studentCount}
              onChange={(e) => setStudentCount(Math.max(6, Math.min(45, Number(e.target.value) || 24)))}
              className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1"
            />
          </label>
          <label className="flex items-center gap-2">
            Taille d&apos;îlot :
            <select
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1"
            >
              {[3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} élèves
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Mélanger
        </button>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {generatedGroups.map((grp, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold text-teal-800">Îlot {i + 1}</p>
            <p className="mt-1 font-mono-code text-xs text-slate-700">
              Élèves : {grp.join(", ")}
            </p>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-600">
        Zéro donnée personnelle : fonctionnement anonyme par numéros de liste de classe.
      </p>
    </div>
  );
}
