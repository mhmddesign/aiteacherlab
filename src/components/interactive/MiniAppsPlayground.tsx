"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, Printer, RefreshCw, Shuffle } from "lucide-react";
import type { GalleryCategoryItem } from "@/content/types";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
import { DemoQuizApp } from "./DemoQuizApp";

type DemoKey = NonNullable<GalleryCategoryItem["demoKey"]>;

const ARABIC_LETTERS = [
  { letter: "ب", name: "الباء (Ba)", forms: ["بـ", "ـبـ", "ـب"] },
  { letter: "ت", name: "التاء (Ta)", forms: ["تـ", "ـتـ", "ـت"] },
  { letter: "س", name: "السين (Sin)", forms: ["سـ", "ـسـ", "ـس"] },
  { letter: "م", name: "الميم (Mim)", forms: ["مـ", "ـمـ", "ـم"] },
  { letter: "ل", name: "اللام (Lam)", forms: ["لـ", "ـلـ", "ـل"] },
];

const VOWELS = [
  { mark: "\u064E", labelAr: "فَتْحَة", labelFr: "Fatha (a)" },
  { mark: "\u064F", labelAr: "ضَمَّة", labelFr: "Damma (ou)" },
  { mark: "\u0650", labelAr: "كَسْرَة", labelFr: "Kasra (i)" },
  { mark: "ا", labelAr: "مَدّ بِالأَلِف", labelFr: "Madd Alif (aa)" },
];

const FLASHCARDS = [
  {
    fr: "Le tableau",
    ar: "السَّبُّورَةُ",
    sentenceFr: "L'élève écrit la date au tableau.",
    sentenceAr: "يكتب التلميذ التاريخ على السبورة.",
  },
  {
    fr: "Le cahier",
    ar: "الدَّفْتَرُ",
    sentenceFr: "J'ouvre mon cahier de mathématiques.",
    sentenceAr: "أفتح دفتر الرياضيات بنظام.",
  },
  {
    fr: "La fraction",
    ar: "الْكَسْرُ",
    sentenceFr: "Un demi (1/2) est une fraction simple.",
    sentenceAr: "النصف (1/2) كسر بسيط.",
  },
  {
    fr: "La graine",
    ar: "الْبَذْرَةُ",
    sentenceFr: "La graine germe grâce à l'eau.",
    sentenceAr: "تنبت البذرة بفضل الماء.",
  },
];

export function MiniAppDemoPanel({ demoKey }: { demoKey: DemoKey }) {
  const [letterIdx, setLetterIdx] = useState(0);
  const [vowelIdx, setVowelIdx] = useState(0);

  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [hundreds, setHundreds] = useState(2);
  const [tens, setTens] = useState(4);
  const [units, setUnits] = useState(3);
  const [targetNum, setTargetNum] = useState(243);

  const [track, setTrack] = useState<"base" | "inter" | "defi">("base");
  const [tarlFeedback, setTarlFeedback] = useState<{ fr: string; ar: string } | null>(null);

  const [qErrors, setQErrors] = useState<number[]>([2, 4, 14, 5, 3]);

  const [sheetTitle, setSheetTitle] = useState(
    "Fiche de calcul · Décomposition 3AEP / ورقة حساب · التفكيك (3AEP)"
  );
  const [sheetNote, setSheetNote] = useState(
    "Complète les décompositions puis vérifie. / أكمل التفكيك ثم تحقق."
  );

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
      <div className="space-y-4 rounded-2xl border border-teal-200 bg-ivory-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <BilingualBlock
            text={{
              fr: "Alphabétisation arabe & syllabes (1AEP–2AEP)",
              ar: "تطبيق القراءة والمقاطع (1AEP–2AEP)",
            }}
            frClassName="text-xs font-bold text-slate-900"
            arClassName="text-sm font-bold text-teal-900"
          />
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
            <BilingualInline
              text={{
                fr: "Hors ligne · Projecteur",
                ar: "بدون أنترنيت · للسبورة",
              }}
            />
          </span>
        </div>

        <div dir="rtl" lang="ar" className="font-arabic flex flex-wrap gap-2">
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
              key={v.labelAr}
              type="button"
              onClick={() => setVowelIdx(idx)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                idx === vowelIdx
                  ? "border-cyan-600 bg-cyan-600 text-white"
                  : "border-slate-300 bg-white text-slate-800"
              }`}
            >
              <span>{v.labelFr}</span> ·{" "}
              <span dir="rtl" lang="ar" className="font-arabic">
                {v.labelAr}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 items-center rounded-2xl bg-white p-5 border border-slate-200">
          <div className="text-center">
            <BilingualBlock
              text={{ fr: "Syllabe composée", ar: "المقطع الصوتي المركب" }}
              frClassName="text-xs text-slate-500"
              arClassName="text-xs text-teal-800"
            />
            <p dir="rtl" lang="ar" className="font-arabic mt-2 text-6xl font-bold text-navy-900">
              {syllable}
            </p>
          </div>
          <div dir="rtl" lang="ar" className="font-arabic space-y-2 text-sm text-right">
            <p className="font-bold text-teal-800">
              أشكال الحرف ({activeL.name}) / Formes de la lettre :
            </p>
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
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700">
          <span>
            Carte {cardIdx + 1} / {FLASHCARDS.length} ·{" "}
            <span dir="rtl" lang="ar" className="font-arabic text-teal-800">
              البطاقة {cardIdx + 1} / {FLASHCARDS.length}
            </span>
          </span>
          <BilingualInline
            text={{
              fr: "Cliquez pour retourner",
              ar: "انقروا لقلب البطاقة",
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="w-full rounded-2xl border border-teal-200 bg-white p-6 text-center shadow-xs hover:border-teal-500 cursor-pointer space-y-2"
        >
          {!flipped ? (
            <div dir="ltr" lang="fr">
              <p className="text-xs uppercase tracking-wider text-teal-700 font-bold">
                Face Français · الواجهة الفرنسية
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-navy-900">{card.fr}</p>
              <p className="mt-2 text-sm text-slate-600">{card.sentenceFr}</p>
            </div>
          ) : (
            <div dir="rtl" lang="ar" className="font-arabic">
              <p className="text-xs font-bold text-cyan-700">الواجهة العربية · Face Arabe</p>
              <p className="mt-2 text-4xl font-bold text-navy-900">{card.ar}</p>
              <p className="mt-2 text-sm text-slate-700">{card.sentenceAr}</p>
            </div>
          )}
        </button>

        <div className="flex justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              setFlipped(false);
              setCardIdx((i) => (i - 1 + FLASHCARDS.length) % FLASHCARDS.length);
            }}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <BilingualInline text={{ fr: "← Précédente", ar: "السابقة →" }} />
          </button>
          <button
            type="button"
            onClick={() => {
              setFlipped(false);
              setCardIdx((i) => (i + 1) % FLASHCARDS.length);
            }}
            className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white cursor-pointer"
          >
            <BilingualInline text={{ fr: "Suivante →", ar: "← الموالية" }} />
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
            <BilingualBlock
              text={{
                fr: "Défi C / D / U · Valeur positionnelle",
                ar: "تحدي المئات والعشرات والوحدات · القيمة المكانية",
              }}
              frClassName="text-xs font-bold uppercase text-teal-800"
              arClassName="text-xs font-bold text-teal-900"
            />
            <h5 className="text-lg font-bold text-slate-900 mt-1">
              Construisez / ركّبوا العدد :{" "}
              <span className="font-mono-code text-teal-700">{targetNum}</span>
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
            <BilingualInline text={{ fr: "Nouveau défi", ar: "تحدٍّ جديد" }} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              fr: "Centaines (100)",
              ar: "المئات (100)",
              val: hundreds,
              set: setHundreds,
              max: 5,
              color: "bg-navy-900 text-white",
            },
            {
              fr: "Dizaines (10)",
              ar: "العشرات (10)",
              val: tens,
              set: setTens,
              max: 9,
              color: "bg-teal-600 text-white",
            },
            {
              fr: "Unités (1)",
              ar: "الوحدات (1)",
              val: units,
              set: setUnits,
              max: 9,
              color: "bg-cyan-500 text-slate-950",
            },
          ].map((col) => (
            <div key={col.fr} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <BilingualBlock
                text={{ fr: col.fr, ar: col.ar }}
                frClassName="text-xs font-bold text-slate-700"
                arClassName="text-xs font-bold text-teal-800"
              />
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
          className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-bold ${
            isMatch
              ? "border-teal-600 bg-teal-50 text-teal-900"
              : "border-slate-200 bg-white text-slate-800"
          }`}
        >
          <span>
            Construction / التركيب : {hundreds * 100} + {tens * 10} + {units} = {currentVal}
          </span>
          {isMatch && (
            <span className="inline-flex items-center gap-1 text-teal-700">
              <CheckCircle2 className="h-4 w-4" />
              <BilingualInline text={{ fr: "Exact !", ar: "صحيح!" }} />
            </span>
          )}
        </div>
      </div>
    );
  }

  if (demoKey === "remediation-tarl") {
    const exercises = {
      base: {
        title: {
          fr: "Parcours Base · Addition sans retenue (< 50)",
          ar: "المسار الأساسي · الجمع بدون احتفاظ (< 50)",
        },
        prompt: { fr: "23 + 14 = ?", ar: "كم يساوي 23 + 14؟" },
        choices: ["37", "27", "47"],
        ok: "37",
        hint: {
          fr: "On additionne les unités (3 + 4 = 7) puis les dizaines (2 + 1 = 3).",
          ar: "نجمع الوحدات (3 + 4 = 7) ثم العشرات (2 + 1 = 3).",
        },
      },
      inter: {
        title: {
          fr: "Parcours Intermédiaire · Addition avec une retenue",
          ar: "المسار المتوسط · الجمع باحتفاظ واحد",
        },
        prompt: { fr: "48 + 25 = ?", ar: "كم يساوي 48 + 25؟" },
        choices: ["63", "73", "72"],
        ok: "73",
        hint: {
          fr: "8 + 5 = 13 → on écrit 3 et on retient 1 dizaine : 4 + 2 + 1 = 7.",
          ar: "8 + 5 = 13 ← نكتب 3 ونحتفظ بـ 1 عشرة: 4 + 2 + 1 = 7.",
        },
      },
      defi: {
        title: {
          fr: "Parcours Défi · Petit problème contextualisé",
          ar: "مسار التحدي · مسألة من المحيط المدرسي",
        },
        prompt: {
          fr: "La bibliothèque a 145 livres en arabe et 78 en français. Combien en tout ?",
          ar: "تضم مكتبة القسم 145 كتاباً بالعربية و78 بالفرنسية. ما مجموع الكتب؟",
        },
        choices: ["213", "223", "233"],
        ok: "223",
        hint: {
          fr: "145 + 78 = 223 livres.",
          ar: "145 + 78 = 223 كتاباً.",
        },
      },
    }[track];

    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-ivory-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <BilingualBlock
            text={{
              fr: "Remédiation 3 parcours (pilotée par l'enseignant)",
              ar: "الدعم بـ 3 مسارات (بتحكم من الأستاذ/ة)",
            }}
            frClassName="text-xs font-bold uppercase text-teal-800"
            arClassName="text-xs font-bold text-teal-900"
          />
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["base", "Base", "أساسي"],
                ["inter", "Intermédiaire", "متوسط"],
                ["defi", "Défi", "تحدي"],
              ] as const
            ).map(([id, fr, ar]) => (
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
                <BilingualInline text={{ fr, ar }} />
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 border border-slate-200 space-y-3">
          <BilingualBlock
            text={exercises.title}
            frClassName="text-xs font-semibold text-teal-700"
            arClassName="text-xs font-semibold text-teal-900"
          />
          <BilingualBlock
            text={exercises.prompt}
            frClassName="text-base font-bold text-slate-900"
            arClassName="text-sm font-bold text-slate-800"
          />
          <div className="flex flex-wrap gap-2">
            {exercises.choices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() =>
                  setTarlFeedback(
                    c === exercises.ok
                      ? {
                          fr: `Bravo ! ${exercises.hint.fr}`,
                          ar: `أحسنت! ${exercises.hint.ar}`,
                        }
                      : {
                          fr: `Pas tout à fait. Indice : ${exercises.hint.fr}`,
                          ar: `حاول مرة أخرى. تلميح: ${exercises.hint.ar}`,
                        }
                  )
                }
                className="rounded-xl border border-slate-300 bg-ivory-50 px-4 py-2 text-sm font-bold hover:border-teal-500 cursor-pointer"
              >
                {c}
              </button>
            ))}
          </div>
          {tarlFeedback && (
            <div className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-900">
              <BilingualBlock text={tarlFeedback} />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (demoKey === "formative-assessment") {
    const items = [
      { fr: "Q1 · Lire une fraction simple (1/2)", ar: "س1 · قراءة كسر بسيط (1/2)" },
      { fr: "Q2 · Identifier le dénominateur", ar: "س2 · تحديد المقام" },
      { fr: "Q3 · Parts égales obligatoires (piège)", ar: "س3 · شرط الأجزاء المتساوية" },
      { fr: "Q4 · Comparer 1/4 et 1/2", ar: "س4 · مقارنة 1/4 و 1/2" },
      { fr: "Q5 · Colorier 3/4 d'une bande", ar: "س5 · تلوين 3/4 من شريط" },
    ];
    return (
      <div className="print-sheet space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <BilingualBlock
              text={{
                fr: "Bilan collectif d'évaluation formative (5AEP · 32 élèves)",
                ar: "الحصيلة الجماعية للتقويم التكويني (5AEP · 32 تلميذاً)",
              }}
              frClassName="text-sm font-bold text-slate-900"
              arClassName="text-xs font-bold text-teal-800"
            />
            <BilingualBlock
              text={{
                fr: "Saisissez le nombre d'élèves en erreur par item (aucun nom d'élève).",
                ar: "أدخلوا عدد المتعثرين في كل سؤال (بدون أسماء التلاميذ).",
              }}
              frClassName="text-xs text-slate-600"
              arClassName="text-xs text-slate-600"
            />
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-3 py-2 text-xs font-bold text-white cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <BilingualInline text={{ fr: "Imprimer le bilan A4", ar: "طباعة الحصيلة A4" }} />
          </button>
        </div>

        <div className="space-y-2">
          {items.map((label, idx) => {
            const errs = qErrors[idx] ?? 0;
            const alert = errs >= 10;
            return (
              <div
                key={label.fr}
                className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
                  alert ? "border-amber-300 bg-amber-50/70" : "border-slate-200 bg-slate-50"
                }`}
              >
                <BilingualBlock
                  text={label}
                  frClassName="font-semibold text-slate-900"
                  arClassName="font-semibold text-teal-900"
                />
                <div className="flex items-center gap-2">
                  <span className={alert ? "font-bold text-amber-800" : "text-slate-600"}>
                    {errs} erreurs / خطأ {alert ? "· À reprendre · للمعالجة" : ""}
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
            <span>Titre de la fiche A4 · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">عنوان الورقة</span></span>
            <input
              type="text"
              value={sheetTitle}
              onChange={(e) => setSheetTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </label>
          <label className="text-xs font-semibold text-slate-700">
            <span>Consigne élève · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">التعليمة</span></span>
            <input
              type="text"
              value={sheetNote}
              onChange={(e) => setSheetNote(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </label>
        </div>

        <div className="print-sheet rounded-2xl border border-slate-300 bg-white p-6 text-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3">
            <div>
              <h5 className="text-base font-bold">{sheetTitle}</h5>
              <p className="text-xs text-slate-600">{sheetNote}</p>
            </div>
            <div className="text-right text-xs text-slate-600 space-y-0.5">
              <p>Nom / الاسم : ___________________</p>
              <p>Date / التاريخ : ____ / ____ / 2026</p>
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
              <BilingualInline text={{ fr: "Imprimer la fiche élève", ar: "طباعة بطاقة التلميذ" }} />
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
            <span>Élèves (numéros) · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">عدد التلاميذ</span> :</span>
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
            <span>Taille d&apos;îlot · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">حجم المجموعة</span> :</span>
            <select
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1"
            >
              {[3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} élèves / تلاميذ
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
          <BilingualInline text={{ fr: "Mélanger", ar: "توزيع عشوائي" }} />
        </button>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {generatedGroups.map((grp, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold text-teal-800">
              Îlot {i + 1} · <span dir="rtl" lang="ar" className="font-arabic">المجموعة {i + 1}</span>
            </p>
            <p className="mt-1 font-mono-code text-xs text-slate-700">
              #{grp.join(", #")}
            </p>
          </div>
        ))}
      </div>
      <BilingualBlock
        text={{
          fr: "Zéro donnée personnelle : fonctionnement anonyme par numéros de liste de classe.",
          ar: "صفر معطيات شخصية: اشتغال مجهول الهوية باستعمال أرقام اللائحة فقط.",
        }}
        frClassName="text-[11px] text-slate-600"
        arClassName="text-[11px] text-teal-800"
      />
    </div>
  );
}
