"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, Loader2, Lock, Sparkles } from "lucide-react";
import type {
  ActivityAggregate,
  ActivityStatus,
  ParticipantResponseItem,
} from "@/content/types";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
import { CopyPromptButton } from "@/components/ui/CopyPromptButton";

interface PromptBuilderWidgetProps {
  status: ActivityStatus;
  isPaused: boolean;
  aggregate: ActivityAggregate | null;
  myResponses?: ParticipantResponseItem[];
  canSubmit: boolean;
  onSubmitted?: (savedResponse?: ParticipantResponseItem) => void;
}

const GRADES = ["1AEP", "2AEP", "3AEP", "4AEP", "5AEP", "6AEP"];
const SUBJECTS = [
  { value: "Langue Arabe / اللغة العربية", fr: "Langue Arabe", ar: "اللغة العربية" },
  { value: "Français / اللغة الفرنسية", fr: "Français", ar: "اللغة الفرنسية" },
  { value: "Mathématiques / الرياضيات", fr: "Mathématiques", ar: "الرياضيات" },
  { value: "Éveil Scientifique / النشاط العلمي", fr: "Éveil Scientifique", ar: "النشاط العلمي" },
  { value: "Remédiation (TaRL) / الدعم التربوي", fr: "Remédiation (TaRL)", ar: "الدعم التربوي" },
];
const DIFFICULTIES = [
  { value: "Base / أساسي", label: "Base · أساسي" },
  { value: "Intermédiaire / متوسط", label: "Intermédiaire · متوسط" },
  { value: "Défi / تحدي", label: "Défi · تحدي" },
  {
    value: "3 niveaux progressifs / 3 مستويات متدرجة",
    label: "3 niveaux progressifs · 3 مستويات متدرجة",
  },
];
const TARGET_LANGUAGES = [
  { value: "fr", label: "Français · الفرنسية" },
  { value: "ar", label: "Arabe · العربية" },
  { value: "bilingual", label: "Bilingue (FR + AR) · ثنائي اللغة" },
] as const;

export function PromptBuilderWidget({
  status,
  isPaused,
  aggregate,
  myResponses = [],
  canSubmit,
  onSubmitted,
}: PromptBuilderWidgetProps) {
  const existing = myResponses.find((r) => r.itemKey === "main");
  const [grade, setGrade] = useState("4AEP");
  const [subject, setSubject] = useState(SUBJECTS[1].value);
  const [targetMaterialLang, setTargetMaterialLang] = useState<"fr" | "ar" | "bilingual">("bilingual");
  const [role, setRole] = useState("Enseignant(e) expérimenté(e) du primaire public au Maroc");
  const [objective, setObjective] = useState(
    "Identifier les actions principales dans un court récit du quotidien"
  );
  const [competency, setCompetency] = useState("Comprendre et reformuler un texte court");
  const [textbookExtract, setTextbookExtract] = useState("");
  const [learnerLevel, setLearnerLevel] = useState(
    "Classe hétérogène de 34 élèves (vidéoprojecteur + cahiers)"
  );
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[3].value);
  const [constraints, setConstraints] = useState(
    "Langage simple, zéro donnée personnelle d'élève, utilisable sur tableau ou fiche A4"
  );
  const [outputFormat, setOutputFormat] = useState(
    "Texte court + 5 questions graduées + corrigé enseignant à part"
  );
  const [qualityCriteria, setQualityCriteria] = useState(
    "Brouillon clair prêt à être relu, adapté et validé par l'enseignant"
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetLangFr =
    targetMaterialLang === "fr"
      ? "Français uniquement"
      : targetMaterialLang === "ar"
        ? "Arabe uniquement (avec vocalisation adaptée)"
        : "Bilingue Français et Arabe";
  const targetLangAr =
    targetMaterialLang === "fr"
      ? "اللغة الفرنسية فقط"
      : targetMaterialLang === "ar"
        ? "اللغة العربية فقط (مع الشكل المناسب)"
        : "ثنائي اللغة (الفرنسية والعربية)";

  const assembledPromptFr = useMemo(() => {
    const lines = [
      `Rôle : ${role}`,
      `Niveau & Discipline : ${grade} · ${subject}`,
      `Langue souhaitée pour le support pédagogique : ${targetLangFr}`,
      `Public & Contexte de classe : ${learnerLevel}`,
      `Objectif d'apprentissage (fourni par l'enseignant) : ${objective}`,
      `Compétence ciblée : ${competency}`,
      textbookExtract.trim()
        ? `Extrait de leçon / manuel fourni : ${textbookExtract.trim()}`
        : null,
      `Niveau de difficulté : ${difficulty}`,
      `Contraintes matérielles & éthiques : ${constraints}`,
      `Format de sortie : ${outputFormat}`,
      `Critères de qualité : ${qualityCriteria}`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [
    role,
    grade,
    subject,
    targetLangFr,
    learnerLevel,
    objective,
    competency,
    textbookExtract,
    difficulty,
    constraints,
    outputFormat,
    qualityCriteria,
  ]);

  const assembledPromptAr = useMemo(() => {
    const lines = [
      `الدور: ${role}`,
      `المستوى والمادة: ${grade} · ${subject}`,
      `اللغة المطلوبة للمورد البيداغوجي: ${targetLangAr}`,
      `الفئة المستهدفة وسياق القسم: ${learnerLevel}`,
      `الهدف التعلمي (المحدد من طرف الأستاذ/ة): ${objective}`,
      `الكفاية المستهدفة: ${competency}`,
      textbookExtract.trim()
        ? `مقتطف من الدرس أو المقرر: ${textbookExtract.trim()}`
        : null,
      `مستوى الصعوبة: ${difficulty}`,
      `الشروط المادية والأخلاقية: ${constraints}`,
      `صيغة المخرجات المطلوبة: ${outputFormat}`,
      `معايير الجودة والمراجعة: ${qualityCriteria}`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [
    role,
    grade,
    subject,
    targetLangAr,
    learnerLevel,
    objective,
    competency,
    textbookExtract,
    difficulty,
    constraints,
    outputFormat,
    qualityCriteria,
  ]);

  const isLocked = isPaused || status !== "open" || Boolean(existing);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isLocked || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/participant/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityKey: "builder-prompt",
          itemKey: "main",
          selectedOption: `${grade} · ${subject}`,
          payload: {
            grade,
            subject,
            targetMaterialLang,
            objective,
            competency,
            difficulty,
            assembledPrompt: `${assembledPromptFr}\n---\n${assembledPromptAr}`,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ??
            "Impossible de partager votre prompt. / تعذر مشاركة التوجيه."
        );
        return;
      }
      onSubmitted?.(data.response as ParticipantResponseItem | undefined);
    } catch {
      setError(
        "Erreur réseau lors de l'envoi. Votre prompt reste copiable ci-contre. / خطأ في الشبكة أثناء الإرسال، يمكنكم نسخ التوجيه."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      {canSubmit && (
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <BilingualBlock
              text={{
                fr: "Paramètres de votre classe (1AEP–6AEP)",
                ar: "إعدادات قسمكم الدراسي (1AEP–6AEP)",
              }}
              frClassName="text-sm font-bold text-slate-900"
              arClassName="text-xs font-bold text-teal-800"
            />
            {existing ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <BilingualInline text={{ fr: "Partagé avec la salle", ar: "تمت المشاركة مع القاعة" }} />
              </span>
            ) : status !== "open" || isPaused ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                <Lock className="h-3.5 w-3.5 shrink-0" />
                {isPaused ? (
                  <BilingualInline text={{ fr: "En pause", ar: "استراحة" }} />
                ) : (
                  <BilingualInline text={{ fr: "Envoi fermé (copie libre)", ar: "الإرسال مغلق (النسخ متاح)" }} />
                )}
              </span>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              <span>Niveau · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">المستوى</span></span>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold text-slate-700">
              <span>Discipline · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">المادة</span></span>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.fr} · {s.ar}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold text-slate-700">
              <span>Difficulté · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">الصعوبة</span></span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold text-slate-700">
              <span>Langue du support produit · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">لغة المورد المطلوب</span></span>
              <select
                value={targetMaterialLang}
                onChange={(e) => setTargetMaterialLang(e.target.value as "fr" | "ar" | "bilingual")}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                {TARGET_LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              <span>Objectif d&apos;apprentissage · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">الهدف التعلمي</span></span>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              <span>Compétence ciblée · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">الكفاية المستهدفة</span></span>
              <input
                type="text"
                value={competency}
                onChange={(e) => setCompetency(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              <span>Rôle attribué à l&apos;IA · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">دور الذكاء الاصطناعي</span></span>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              <span>Niveau réel & classe · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">مستوى التلاميذ والقسم</span></span>
              <input
                type="text"
                value={learnerLevel}
                onChange={(e) => setLearnerLevel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
          </div>

          <label className="block text-xs font-semibold text-slate-700">
            <span>Extrait de leçon ou du manuel (optionnel) · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">مقتطف من الدرس أو الكتاب (اختياري)</span></span>
            <textarea
              rows={2}
              value={textbookExtract}
              onChange={(e) => setTextbookExtract(e.target.value)}
              placeholder="Collez un court passage / الصقوا مقتطفاً قصيراً من الدرس..."
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              <span>Contraintes · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">الشروط والقيود</span></span>
              <input
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              <span>Format de sortie · <span dir="rtl" lang="ar" className="font-arabic text-teal-800">صيغة المخرجات</span></span>
              <input
                type="text"
                value={outputFormat}
                onChange={(e) => {
                  setOutputFormat(e.target.value);
                  setQualityCriteria("Brouillon clair prêt à relire et valider");
                }}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
          </div>

          {error && (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <CopyPromptButton
              text={assembledPromptFr}
              label="Copier FR"
              labelAr="نسخ الفرنسي"
            />
            <CopyPromptButton
              text={assembledPromptAr}
              label="Copier AR"
              labelAr="نسخ العربي"
            />
            <button
              type="submit"
              disabled={isLocked || submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
              )}
              <span>
                {submitting ? (
                  "Enregistrement... / جاري الحفظ..."
                ) : (
                  <BilingualInline
                    text={{ fr: "Partager avec l'atelier", ar: "مشاركة مع الورشة" }}
                  />
                )}
              </span>
            </button>
          </div>
        </form>
      )}

      <div className={`${canSubmit ? "lg:col-span-5" : "lg:col-span-12"} space-y-4`}>
        <div className="rounded-2xl border border-slate-800 bg-[#0B1426] p-4 text-slate-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Prompt assemblé (FR) · التوجيه المركّب
            </span>
            <CopyPromptButton text={assembledPromptFr} label="Copier FR" labelAr="نسخ FR" />
          </div>
          <pre dir="ltr" className="font-mono-code whitespace-pre-wrap text-xs leading-relaxed text-slate-100">
            {assembledPromptFr}
          </pre>

          <div className="border-t border-slate-700 pt-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span dir="rtl" lang="ar" className="font-arabic text-xs font-bold text-teal-300">
                التوجيه المركّب بالعربية (AR)
              </span>
              <CopyPromptButton text={assembledPromptAr} label="Copier AR" labelAr="نسخ AR" />
            </div>
            <pre dir="rtl" lang="ar" className="font-arabic whitespace-pre-wrap text-xs leading-relaxed text-slate-100">
              {assembledPromptAr}
            </pre>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="mb-3 flex items-center justify-between gap-2">
            <BilingualBlock
              text={{
                fr: "Prompts partagés dans la salle (anonymisés)",
                ar: "التوجيهات المشاركة في القاعة (مجهولة المصدر)",
              }}
              frClassName="text-xs font-bold uppercase tracking-wider text-slate-600"
              arClassName="text-xs font-bold text-teal-800"
            />
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-800">
              {aggregate?.totalRespondents ?? 0} · <span className="font-arabic">مشاركة</span>
            </span>
          </div>
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {aggregate?.recentSnippets && aggregate.recentSnippets.length > 0 ? (
              aggregate.recentSnippets.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-ivory-50 p-3 text-xs"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="font-bold text-teal-800">{item.label}</span>
                  </div>
                  {item.secondary && (
                    <p className="mb-1 font-medium text-slate-700">{item.secondary}</p>
                  )}
                  <p className="text-slate-600 line-clamp-3">{item.content}</p>
                </div>
              ))
            ) : (
              <BilingualBlock
                text={{
                  fr: "Les prompts partagés par les collègues s'afficheront ici en direct.",
                  ar: "ستظهر هنا التوجيهات التي يشاركها الزملاء مباشرة.",
                }}
                frClassName="text-xs text-slate-500"
                arClassName="text-xs text-slate-500"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
