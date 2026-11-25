"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Award, Monitor } from "lucide-react";
import type {
  ActivityAggregate,
  ActivityStatus,
  ParticipantResponseItem,
  SlideDefinition,
} from "@/content/types";
import { META_PROMPT_EXAMPLES, WEAK_VS_STRONG_PROMPT } from "@/content/use-cases";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
import { CopyPromptButton } from "@/components/ui/CopyPromptButton";
import { DarijaCallout } from "@/components/ui/DarijaCallout";
import { QrJoinPanel } from "@/components/ui/QrJoinPanel";
import { AppGalleryExplorer } from "@/components/interactive/AppGalleryExplorer";
import { DemoQuizApp } from "@/components/interactive/DemoQuizApp";
import { ExitTicketWidget } from "@/components/interactive/ExitTicketWidget";
import { GroupProjectsBoard } from "@/components/interactive/GroupProjectsBoard";
import { LivePollWidget } from "@/components/interactive/LivePollWidget";
import { MetaPromptExercise } from "@/components/interactive/MetaPromptExercise";
import { PromptBuilderWidget } from "@/components/interactive/PromptBuilderWidget";
import { QuizWidget } from "@/components/interactive/QuizWidget";
import { ShowcaseVotingWidget } from "@/components/interactive/ShowcaseVotingWidget";
import { UseCaseExplorer } from "@/components/interactive/UseCaseExplorer";
import { WebTrioExplainer } from "@/components/interactive/WebTrioExplainer";

interface SlideRendererProps {
  slide: SlideDefinition;
  mode: "projector" | "presenter" | "participant";
  activityStatus: ActivityStatus;
  showResults: boolean;
  showQrOverlay: boolean;
  isPaused: boolean;
  aggregate: ActivityAggregate | null;
  connectedCount: number;
  totalParticipants: number;
  myResponses?: ParticipantResponseItem[];
  participantName?: string;
  joinPinHint?: string;
  onSubmitted?: (savedResponse?: ParticipantResponseItem) => void;
}

export function SlideRenderer({
  slide,
  mode,
  activityStatus,
  showResults,
  showQrOverlay,
  isPaused,
  aggregate,
  connectedCount,
  totalParticipants,
  myResponses = [],
  participantName,
  joinPinHint,
  onSubmitted,
}: SlideRendererProps) {
  const isProjector = mode === "projector";
  const isCanvas = mode !== "participant";
  const canSubmit = mode === "participant";
  const prefersReducedMotion = useReducedMotion();

  if (isCanvas) {
    return (
      <motion.article
        key={slide.id}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: "easeOut" }}
        className="h-full w-full flex flex-col justify-between gap-3.5 overflow-hidden bg-[#FAF8F4] text-[#0F172A] px-[64px] pt-[36px] pb-[28px]"
      >
        {/* Fixed 16:9 Canvas Header */}
        <div className="shrink-0 space-y-2 border-b border-slate-200/90 pb-3.5">
          <div className="flex items-center justify-between gap-4 text-[14px]">
            <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-teal-800">
              <BilingualInline text={slide.sectionTitle} />
              <span aria-hidden="true" className="text-slate-300">
                /
              </span>
              <span className="text-slate-500">
                <BilingualInline text={slide.timeRange} />
              </span>
            </div>

            {slide.techTerms.length > 0 && (
              <div className="flex items-center gap-3">
                {slide.techTerms.map((t) => (
                  <span
                    key={t.term}
                    title={`${t.explanation.fr} | ${t.explanation.ar}`}
                    className="border-b border-dotted border-teal-600/60 pb-0.5 text-[13px] font-semibold text-slate-600"
                  >
                    {t.term}
                  </span>
                ))}
              </div>
            )}
          </div>

          <BilingualBlock
            text={slide.title}
            frClassName="font-display text-[38px] font-bold leading-[1.12] tracking-tight text-[#0F172A]"
            arClassName="text-[28px] font-bold leading-[1.28] text-teal-800"
          />

          <div className="grid grid-cols-2 gap-8 items-start">
            <p dir="ltr" lang="fr" className="text-[16px] leading-snug text-slate-600">
              {slide.subtitle.fr}
            </p>
            <p dir="rtl" lang="ar" className="font-arabic text-[17px] leading-snug text-slate-700">
              {slide.subtitle.ar}
            </p>
          </div>
        </div>

        {/* Centered 16:9 Canvas Stage Body */}
        <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
          {slide.kind === "welcome" && (
            <div className="grid grid-cols-12 gap-10 items-center">
              <div className="col-span-7 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[13px] font-bold uppercase tracking-widest text-teal-800">
                    <BilingualInline
                      text={{
                        fr: "Atelier Provincial · Province de Mediouna",
                        ar: "الورشة الإقليمية · إقليم مديونة",
                      }}
                    />
                  </p>
                  <BilingualBlock
                    text={{
                      fr: "Rencontre d'échange entre collègues du primaire",
                      ar: "لقاء تقاسم الخبرات بين أستاذات وأساتذة الابتدائي",
                    }}
                    frClassName="font-display text-[28px] font-bold text-[#0F172A] leading-tight"
                    arClassName="text-[22px] font-bold text-teal-800 leading-snug"
                  />
                  <BilingualBlock
                    text={{
                      fr: "Organisée en collaboration avec le Centre de Digitalisation : pratiques d'IA générative, Prompt Engineering et création de mini-applications pour vos classes (1AEP–6AEP).",
                      ar: "بتنسيق مع مركز الرقمنة: ممارسات عملية في الذكاء الاصطناعي التوليدي، وهندسة التوجيهات، وبناء تطبيقات تعليمية مصغرة لأقسامنا (1AEP–6AEP).",
                    }}
                    frClassName="text-[16px] text-slate-600 leading-relaxed"
                    arClassName="text-[17px] text-slate-700 leading-relaxed"
                  />
                </div>

                {slide.keyPoints.length > 0 && (
                  <ul className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-3.5">
                    {slide.keyPoints.map((pt, i) => (
                      <li
                        key={pt.fr}
                        className="flex items-start gap-2.5 border-l-2 border-teal-600/60 pl-3"
                      >
                        <span className="font-mono-code text-[13px] font-bold text-teal-700 pt-0.5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <BilingualBlock
                          text={pt}
                          className="flex-1"
                          frClassName="text-[13px] font-semibold text-slate-900 leading-snug"
                          arClassName="text-[13px] text-teal-900 leading-snug"
                        />
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center gap-12 border-t border-slate-200 pt-4">
                  <div>
                    <p className="font-display text-[48px] leading-none font-bold text-teal-700 tabular-nums">
                      {connectedCount}
                    </p>
                    <BilingualBlock
                      text={{ fr: "Collègues connectés", ar: "الزملاء المتصلون" }}
                      frClassName="mt-1 text-[13px] font-semibold text-slate-600"
                      arClassName="text-[13px] font-semibold text-teal-900"
                    />
                  </div>
                  <div className="border-l border-slate-200 pl-12">
                    <p className="font-display text-[48px] leading-none font-bold text-slate-900 tabular-nums">
                      {totalParticipants}
                    </p>
                    <BilingualBlock
                      text={{ fr: "Inscrits session", ar: "المسجلون في الجلسة" }}
                      frClassName="mt-1 text-[13px] font-semibold text-slate-600"
                      arClassName="text-[13px] font-semibold text-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-5">
                {showQrOverlay ? (
                  <QrJoinPanel size={200} showPinHint={joinPinHint} />
                ) : (
                  <div className="rounded-3xl bg-[#0B1220] p-8 text-white space-y-5 shadow-lg">
                    <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3.5 py-1 text-[12px] font-bold text-teal-300">
                      <Monitor className="h-4 w-4" />
                      <span>12 Sections · 21 Diapositives · 1AEP–6AEP</span>
                    </div>
                    <BilingualBlock
                      text={{
                        fr: "AI Teacher Lab · Mediouna",
                        ar: "مختبر المعلم للذكاء الاصطناعي · إقليم مديونة",
                      }}
                      frClassName="font-display text-[30px] font-bold text-white"
                      arClassName="text-[24px] font-bold text-teal-300"
                    />
                    <BilingualBlock
                      text={{
                        fr: "Centre de Digitalisation · Session interactive synchrone.",
                        ar: "مركز الرقمنة · لقاء تفاعلي مباشر مع الأستاذات والأساتذة.",
                      }}
                      frClassName="text-[15px] text-slate-300"
                      arClassName="text-[16px] text-slate-200"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {slide.kind === "vision" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-10">
                <div className="border-t-2 border-slate-300 pt-5 space-y-3">
                  <span className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
                    <BilingualInline text={{ fr: "Hier · Usage passif", ar: "بالأمس · استعمال سلبي" }} />
                  </span>
                  <BilingualBlock
                    text={{
                      fr: "Consommateur d'outils génériques",
                      ar: "مجرد مستهلك لأدوات جاهزة وعامة",
                    }}
                    frClassName="font-display text-[28px] font-bold text-slate-900"
                    arClassName="text-[22px] font-bold text-slate-700"
                  />
                  <BilingualBlock
                    text={{
                      fr: "Chercher des fiches toutes faites pensées pour d'autres pays, souvent déconnectées de vos effectifs, de l'arabe RTL ou des contraintes matérielles de l'école.",
                      ar: "البحث عن جذاذات جاهزة مصممة لسياقات أخرى، بعيدة غالباً عن واقع أقسامنا واللغة العربية وإكراهات التجهيز.",
                    }}
                    frClassName="text-[17px] text-slate-600 leading-relaxed"
                    arClassName="text-[18px] text-slate-700 leading-relaxed"
                  />
                </div>

                <div className="border-t-2 border-teal-600 pt-5 space-y-3">
                  <span className="text-[13px] font-bold uppercase tracking-wider text-teal-700">
                    <BilingualInline
                      text={{ fr: "Aujourd'hui · Pouvoir d'agir", ar: "اليوم · المبادرة والإبداع" }}
                    />
                  </span>
                  <BilingualBlock
                    text={{
                      fr: "Créateur de solutions pédagogiques",
                      ar: "مبدع(ة) لحلول بيداغوجية ملائمة",
                    }}
                    frClassName="font-display text-[28px] font-bold text-[#0F172A]"
                    arClassName="text-[22px] font-bold text-teal-800"
                  />
                  <BilingualBlock
                    text={{
                      fr: "Partir d'un besoin réel de votre classe à Mediouna, rédiger un cahier des charges clair, générer un outil léger (projetable, hors ligne ou imprimable) et le partager entre collègues.",
                      ar: "الانطلاق من حاجة حقيقية في قسمكم بمديونة، وصياغة توصيف واضح لإنتاج أداة خفيفة (للعرض أو الطباعة أو بدون إنترنت) وتقاسمها مع الزملاء.",
                    }}
                    frClassName="text-[17px] text-slate-700 leading-relaxed"
                    arClassName="text-[18px] text-slate-800 leading-relaxed"
                  />
                </div>
              </div>

              {slide.keyPoints.length > 0 && (
                <ul className="grid grid-cols-3 gap-6 border-t border-slate-200 pt-5">
                  {slide.keyPoints.map((pt, i) => (
                    <li
                      key={pt.fr}
                      className="flex items-start gap-3 border-l-2 border-teal-600/50 pl-3.5"
                    >
                      <span className="font-mono-code text-[14px] font-bold text-teal-700 pt-0.5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <BilingualBlock
                        text={pt}
                        className="flex-1"
                        frClassName="text-[15px] font-semibold text-slate-900 leading-snug"
                        arClassName="text-[15px] text-teal-900 leading-snug"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {slide.kind === "concepts" && (
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {[
                {
                  code: "01",
                  title: { fr: "AI", ar: "الذكاء الاصطناعي" },
                  desc: {
                    fr: "Systèmes capables d'exécuter des tâches associées à l'intelligence humaine.",
                    ar: "أنظمة تنجز مهام مرتبطة بالذكاء البشري.",
                  },
                },
                {
                  code: "02",
                  title: { fr: "Generative AI", ar: "الذكاء الاصطناعي التوليدي" },
                  desc: {
                    fr: "IA qui crée du nouveau contenu : textes, exercices, résumés ou code.",
                    ar: "ينتج محتوى جديداً: نصوصاً، تمارين، ملخصات أو برمجة.",
                  },
                },
                {
                  code: "03",
                  title: { fr: "LLM", ar: "النموذج اللغوي الكبير" },
                  desc: {
                    fr: "Modèle statistique qui prédit les mots les plus probables selon votre contexte.",
                    ar: "نموذج إحصائي يتنبأ بالكلمات الأكثر احتمالاً حسب السياق.",
                  },
                },
                {
                  code: "04",
                  title: { fr: "Prompt", ar: "التوجيه (Prompt)" },
                  desc: {
                    fr: "Votre consigne structurée (niveau, objectif, format, contraintes).",
                    ar: "تعليمتكم المنظمة (المستوى، الهدف، الصيغة، الشروط).",
                  },
                },
                {
                  code: "05",
                  title: { fr: "Hallucination", ar: "الهلوسة المعرفية" },
                  desc: {
                    fr: "Erreur affirmée avec assurance : l'enseignant relit et valide toujours.",
                    ar: "خطأ يُقدَّم بثقة كبيرة: لذا يراجع الأستاذ(ة) ويعتمد دائماً.",
                  },
                },
              ].map((c) => (
                <div key={c.code} className="grid grid-cols-12 gap-6 py-4 items-center">
                  <div className="col-span-4 flex items-baseline gap-3">
                    <span className="font-mono-code text-[15px] font-bold text-teal-700 shrink-0">
                      {c.code}
                    </span>
                    <BilingualBlock
                      text={c.title}
                      frClassName="font-display text-[22px] font-bold text-slate-900"
                      arClassName="text-[19px] font-bold text-teal-800"
                    />
                  </div>
                  <div className="col-span-8 grid grid-cols-2 gap-6 items-start">
                    <p dir="ltr" lang="fr" className="text-[16px] leading-snug text-slate-700">
                      {c.desc.fr}
                    </p>
                    <p dir="rtl" lang="ar" className="font-arabic text-[17px] leading-snug text-slate-800">
                      {c.desc.ar}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {slide.kind === "pillars" && (
            <div className="grid grid-cols-3 gap-x-10 gap-y-7">
              {[
                {
                  num: "01",
                  title: { fr: "Hallucinations", ar: "الهلوسات" },
                  desc: {
                    fr: "Vérifier dates, faits scientifiques, calculs et voyellation arabe.",
                    ar: "التحقق من التواريخ والوقائع العلمية والحسابات والشكل التام.",
                  },
                },
                {
                  num: "02",
                  title: { fr: "Vérification", ar: "المراجعة والتحقق" },
                  desc: {
                    fr: "Relire tout brouillon avant impression ou projection devant la classe.",
                    ar: "قراءة كل مسودة وتعديلها قبل الطباعة أو العرض أمام التلاميذ.",
                  },
                },
                {
                  num: "03",
                  title: { fr: "Adaptation à l'âge", ar: "الملاءمة للسن" },
                  desc: {
                    fr: "Ajuster le vocabulaire aux réalités des élèves de 1AEP à 6AEP.",
                    ar: "ضبط المعجم حسب مستوى تلاميذ الأول إلى السادس ابتدائي.",
                  },
                },
                {
                  num: "04",
                  title: { fr: "Biais culturels", ar: "التحيز الثقافي" },
                  desc: {
                    fr: "Remplacer les exemples éloignés par un vécu local respectueux.",
                    ar: "تعويض الأمثلة البعيدة بوضعيات من المحيط المغربي المحترم.",
                  },
                },
                {
                  num: "05",
                  title: { fr: "Confidentialité", ar: "حماية الخصوصية" },
                  desc: {
                    fr: "Zéro nom d'élève, zéro code Massar, zéro donnée personnelle saisie.",
                    ar: "صفر اسم تلميذ، صفر رمز مسار، وصفر معطى شخصي.",
                  },
                },
                {
                  num: "06",
                  title: { fr: "Responsabilité", ar: "المسؤولية التربوية" },
                  desc: {
                    fr: "L'IA assiste ; le jugement pédagogique reste 100 % humain.",
                    ar: "الذكاء الاصطناعي مساعد فقط؛ والحكم البيداغوجي يظل إنسانياً 100%.",
                  },
                },
              ].map((p) => (
                <div key={p.num} className="border-t-2 border-slate-200 pt-4 space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-code text-[15px] font-bold text-teal-700">{p.num}</span>
                    <BilingualBlock
                      text={p.title}
                      frClassName="text-[22px] font-bold text-slate-900"
                      arClassName="text-[19px] font-bold text-teal-800"
                    />
                  </div>
                  <BilingualBlock
                    text={p.desc}
                    frClassName="text-[16px] text-slate-600 leading-relaxed"
                    arClassName="text-[17px] text-slate-700 leading-relaxed"
                  />
                </div>
              ))}
            </div>
          )}

          {slide.kind === "prompt-anatomy" && (
            <div className="grid grid-cols-12 gap-7 items-stretch">
              <div className="col-span-5 border-t-2 border-amber-500 bg-amber-50/60 p-5 space-y-3.5 flex flex-col justify-between rounded-b-xl">
                <div className="space-y-3">
                  <BilingualBlock
                    text={WEAK_VS_STRONG_PROMPT.weak.label}
                    frClassName="text-[14px] font-bold uppercase tracking-wider text-amber-800"
                    arClassName="text-[14px] font-bold text-amber-900"
                  />
                  <div className="border-l-2 border-amber-400 bg-white/95 px-4 py-3 space-y-2 rounded-r-lg">
                    <p dir="ltr" className="font-mono-code text-[14px] text-slate-800">
                      « {WEAK_VS_STRONG_PROMPT.weak.promptFr} »
                    </p>
                    <p dir="rtl" lang="ar" className="font-arabic text-[15px] font-semibold text-amber-950">
                      « {WEAK_VS_STRONG_PROMPT.weak.promptAr} »
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-[14px] text-amber-950">
                  {WEAK_VS_STRONG_PROMPT.weak.issues.map((i) => (
                    <li key={i.fr}>
                      <BilingualBlock text={i} frClassName="text-[14px]" arClassName="text-[14px]" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-7 border-t-2 border-teal-600 bg-white p-5 space-y-3 rounded-b-xl shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <BilingualBlock
                    text={WEAK_VS_STRONG_PROMPT.strong.label}
                    frClassName="text-[14px] font-bold uppercase tracking-wider text-teal-800"
                    arClassName="text-[14px] font-bold text-teal-900"
                  />
                  <div className="flex gap-2">
                    <CopyPromptButton
                      text={WEAK_VS_STRONG_PROMPT.strong.promptFr}
                      label="Copier FR"
                      labelAr="نسخ FR"
                    />
                    <CopyPromptButton
                      text={WEAK_VS_STRONG_PROMPT.strong.promptAr}
                      label="Copier AR"
                      labelAr="نسخ AR"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <pre
                    dir="ltr"
                    className="whitespace-pre-wrap rounded-xl bg-[#0B1220] p-3.5 font-mono-code text-[12px] leading-relaxed text-slate-100 max-h-[340px] overflow-y-auto"
                  >
                    {WEAK_VS_STRONG_PROMPT.strong.promptFr}
                  </pre>
                  <pre
                    dir="rtl"
                    lang="ar"
                    className="whitespace-pre-wrap rounded-xl bg-teal-50/70 p-3.5 font-arabic text-[13px] leading-relaxed text-slate-900 border border-teal-200 max-h-[340px] overflow-y-auto"
                  >
                    {WEAK_VS_STRONG_PROMPT.strong.promptAr}
                  </pre>
                </div>

                <ul className="grid grid-cols-2 gap-x-5 gap-y-1 text-[13px] text-teal-900 border-t border-slate-100 pt-2.5">
                  {WEAK_VS_STRONG_PROMPT.strong.strengths.map((s) => (
                    <li key={s.fr}>
                      <BilingualBlock text={s} frClassName="text-[12px]" arClassName="text-[12px]" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {slide.kind === "meta-prompt-flow" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2 border-y border-slate-200 py-3">
                {[
                  { n: "1", fr: "Idée brute", ar: "فكرة أولية" },
                  { n: "2", fr: "Manques", ar: "تحديد النواقص" },
                  { n: "3", fr: "5 questions IA", ar: "أسئلة توضيحية" },
                  { n: "4", fr: "Prompt optimisé", ar: "توجيه محسّن" },
                  { n: "5", fr: "Exécution", ar: "التنفيذ" },
                  { n: "6", fr: "Validation humaine", ar: "الاعتماد" },
                ].map((step, i) => (
                  <React.Fragment key={step.n}>
                    <div className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2 border border-slate-200">
                      <span className="font-mono-code text-[13px] font-bold text-teal-700">
                        {step.n}
                      </span>
                      <BilingualBlock
                        text={step}
                        frClassName="text-[14px] font-bold text-slate-900"
                        arClassName="text-[13px] font-semibold text-teal-800"
                      />
                    </div>
                    {i < 5 && <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />}
                  </React.Fragment>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <BilingualBlock
                      text={META_PROMPT_EXAMPLES.fr.title}
                      frClassName="text-[14px] font-bold text-slate-900"
                      arClassName="text-[14px] font-bold text-teal-800"
                    />
                    <CopyPromptButton
                      text={META_PROMPT_EXAMPLES.fr.metaPrompt}
                      label="Copier FR"
                      labelAr="نسخ FR"
                    />
                  </div>
                  <pre
                    dir="ltr"
                    className="whitespace-pre-wrap rounded-xl bg-[#0B1220] p-4 font-mono-code text-[13px] leading-relaxed text-slate-100 max-h-[370px] overflow-y-auto"
                  >
                    {META_PROMPT_EXAMPLES.fr.metaPrompt}
                  </pre>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <BilingualBlock
                      text={META_PROMPT_EXAMPLES.ar.title}
                      frClassName="text-[14px] font-bold text-slate-900"
                      arClassName="text-[14px] font-bold text-teal-900"
                    />
                    <CopyPromptButton
                      text={META_PROMPT_EXAMPLES.ar.metaPrompt}
                      label="Copier AR"
                      labelAr="نسخ AR"
                    />
                  </div>
                  <pre
                    dir="rtl"
                    lang="ar"
                    className="whitespace-pre-wrap rounded-xl bg-white p-4 font-arabic text-[14px] leading-relaxed text-slate-900 border border-teal-200 max-h-[370px] overflow-y-auto"
                  >
                    {META_PROMPT_EXAMPLES.ar.metaPrompt}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {slide.kind === "ecosystem" && (
            <div className="space-y-7">
              <div className="grid grid-cols-4 gap-7 border-t border-slate-200 pt-5">
                {[
                  {
                    num: "01",
                    title: { fr: "Générer du contenu", ar: "إنتاج محتوى تربوي" },
                    desc: {
                      fr: "Produire un texte, des questions ou 3 niveaux d'exercices (brouillon).",
                      ar: "توليد نص أو أسئلة أو 3 مستويات تمارين (مسودة).",
                    },
                  },
                  {
                    num: "02",
                    title: { fr: "Créer une application", ar: "إنشاء تطبيق تفاعلي" },
                    desc: {
                      fr: "Transformer ce besoin en interface interactive (HTML/CSS/JS).",
                      ar: "تحويل الحاجة إلى واجهة تفاعلية بـ HTML/CSS/JS.",
                    },
                  },
                  {
                    num: "03",
                    title: { fr: "Utiliser en vraie classe", ar: "الاستعمال الفعلي في القسم" },
                    desc: {
                      fr: "Projeter, partager sur tablette ou imprimer en A4 avec vos élèves.",
                      ar: "العرض بالمسلاط أو اللوحة المشتركة أو الطباعة A4.",
                    },
                  },
                  {
                    num: "04",
                    title: { fr: "Évaluer l'impact réel", ar: "تقويم الأثر التعلمي" },
                    desc: {
                      fr: "Observer si l'outil aide véritablement les élèves à progresser.",
                      ar: "التحقق مما إذا كانت الأداة تساعد التلاميذ فعلاً على التقدم.",
                    },
                  },
                ].map((s) => (
                  <div key={s.num} className="space-y-2">
                    <span className="font-mono-code text-[15px] font-bold text-teal-700">{s.num}</span>
                    <BilingualBlock
                      text={s.title}
                      frClassName="text-[20px] font-bold text-slate-900"
                      arClassName="text-[17px] font-bold text-teal-800"
                    />
                    <BilingualBlock
                      text={s.desc}
                      frClassName="text-[15px] text-slate-600 leading-relaxed"
                      arClassName="text-[16px] text-slate-700 leading-relaxed"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-6 border-t border-slate-200 pt-5">
                {[
                  {
                    name: "ChatGPT",
                    desc: {
                      fr: "Rédiger brouillons, idées et premiers codes.",
                      ar: "صياغة المسودات والأفكار والشيفرات الأولية.",
                    },
                  },
                  {
                    name: "Google Antigravity",
                    desc: {
                      fr: "Structurer et tester des applications fiables.",
                      ar: "بناء واختبار تطبيقات منظمة وموثوقة.",
                    },
                  },
                  {
                    name: "Browser Web App",
                    desc: {
                      fr: "Ouvert dans le navigateur sans installation.",
                      ar: "يُفتح مباشرة في المتصفح دون تثبيت.",
                    },
                  },
                  {
                    name: "Prototype",
                    desc: {
                      fr: "Testable en 25 min pour valider l'idée.",
                      ar: "نسخة أولية قابلة للتجريب خلال 25 دقيقة.",
                    },
                  },
                  {
                    name: "Deployed App",
                    desc: {
                      fr: "Partageable avec tout Mediouna par lien/QR.",
                      ar: "منشور للمشاركة بالرابط أو رمز QR.",
                    },
                  },
                ].map((e) => (
                  <div key={e.name} className="space-y-1.5 rounded-xl bg-white border border-slate-200 p-4">
                    <p className="text-[16px] font-bold text-slate-900">{e.name}</p>
                    <BilingualBlock
                      text={e.desc}
                      frClassName="text-[14px] text-slate-600 leading-snug"
                      arClassName="text-[15px] text-slate-700 leading-snug"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.kind === "closing" && (
            <div className="h-full flex flex-col justify-center items-center rounded-3xl bg-[#0B1220] px-16 py-10 text-center text-white space-y-6">
              <p className="text-[14px] font-bold uppercase tracking-[0.22em] text-teal-400">
                Province de Mediouna · Centre de Digitalisation · إقليم مديونة · مركز الرقمنة
              </p>
              <blockquote
                dir="ltr"
                lang="fr"
                className="mx-auto max-w-5xl font-display text-[42px] font-bold leading-[1.2] text-[#FAF8F4]"
              >
                « Ne soyez pas seulement utilisateurs du numérique. Devenez créateurs de solutions pédagogiques. »
              </blockquote>
              <blockquote
                dir="rtl"
                lang="ar"
                className="font-arabic mx-auto max-w-5xl text-[34px] font-bold leading-[1.45] text-teal-300"
              >
                « لا تكونوا مجرد مستعملين للتكنولوجيا الرقمية، بل كونوا صانعي حلول بيداغوجية. »
              </blockquote>
              <BilingualBlock
                text={{
                  fr: "Identifier un problème → Écrire une spécification claire → Prototyper avec l'IA → Tester en classe → Améliorer → Partager dans la Galerie Collaborative de Mediouna.",
                  ar: "تحديد الإشكال ← صياغة توصيف واضح ← بناء نموذج أولي ← التجريب في القسم ← التحسين ← التقاسم في المعرض التعاوني لمديونة.",
                }}
                className="mx-auto max-w-4xl border-t border-slate-800 pt-5"
                frClassName="text-[16px] text-slate-300"
                arClassName="text-[17px] text-teal-200"
              />
            </div>
          )}

          {slide.kind === "poll" && slide.activityKey && (
            <div className="grid grid-cols-12 gap-8 items-center">
              <div className="col-span-4 space-y-4">
                {slide.keyPoints.map((pt, i) => (
                  <div
                    key={pt.fr}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <span className="font-mono-code text-[15px] font-bold text-teal-700 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <BilingualBlock
                      text={pt}
                      className="flex-1"
                      frClassName="text-[15px] font-semibold text-slate-900"
                      arClassName="text-[15px] text-teal-900"
                    />
                  </div>
                ))}
              </div>
              <div className="col-span-8">
                <LivePollWidget
                  activityKey={slide.activityKey}
                  status={activityStatus}
                  showResults={showResults}
                  isPaused={isPaused}
                  aggregate={aggregate}
                  myResponses={myResponses}
                  canSubmit={canSubmit}
                  large
                  canvas
                  onSubmitted={onSubmitted}
                />
              </div>
            </div>
          )}

          {slide.kind === "quiz" && slide.activityKey && (
            <QuizWidget
              activityKey={slide.activityKey}
              status={activityStatus}
              showResults={showResults}
              isPaused={isPaused}
              aggregate={aggregate}
              myResponses={myResponses}
              canSubmit={canSubmit}
              large={isProjector}
              canvas
              onSubmitted={onSubmitted}
            />
          )}

          {slide.kind === "use-cases" && <UseCaseExplorer large={isProjector} canvas />}

          {slide.kind === "prompt-builder" && (
            <PromptBuilderWidget
              status={activityStatus}
              isPaused={isPaused}
              aggregate={aggregate}
              myResponses={myResponses}
              canSubmit={canSubmit}
              canvas
              onSubmitted={onSubmitted}
            />
          )}

          {slide.kind === "meta-prompt-exercise" && (
            <MetaPromptExercise
              status={activityStatus}
              isPaused={isPaused}
              aggregate={aggregate}
              myResponses={myResponses}
              canSubmit={canSubmit}
              canvas
              onSubmitted={onSubmitted}
            />
          )}

          {slide.kind === "web-trio" && <WebTrioExplainer canvas />}

          {slide.kind === "live-demo" && <DemoQuizApp large={isProjector} canvas />}

          {slide.kind === "gallery" && <AppGalleryExplorer canvas />}

          {slide.kind === "group-projects" && <GroupProjectsBoard canvas />}

          {slide.kind === "showcase-vote" && (
            <div className="grid grid-cols-12 gap-8 items-center">
              <div className="col-span-4 space-y-3">
                {slide.keyPoints.map((pt, i) => (
                  <div
                    key={pt.fr}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5"
                  >
                    <Award className="mt-0.5 h-5 w-5 text-teal-700 shrink-0" />
                    <BilingualBlock
                      text={pt}
                      className="flex-1"
                      frClassName="text-[14px] font-semibold text-slate-900"
                      arClassName="text-[14px] text-teal-900"
                    />
                    <span className="font-mono-code text-[12px] font-bold text-slate-400">
                      0{i + 1}
                    </span>
                  </div>
                ))}
              </div>
              <div className="col-span-8">
                <ShowcaseVotingWidget
                  status={activityStatus}
                  showResults={showResults}
                  isPaused={isPaused}
                  aggregate={aggregate}
                  myResponses={myResponses}
                  canSubmit={canSubmit}
                  defaultContributorName={participantName}
                  canvas
                  onSubmitted={onSubmitted}
                />
              </div>
            </div>
          )}

          {slide.kind === "exit-ticket" && (
            <ExitTicketWidget
              status={activityStatus}
              showResults={showResults}
              isPaused={isPaused}
              aggregate={aggregate}
              myResponses={myResponses}
              canSubmit={canSubmit}
              canvas
              onSubmitted={onSubmitted}
            />
          )}
        </div>

        {/* Fixed 16:9 Canvas Darija Footer */}
        <div className="shrink-0">
          <DarijaCallout
            title={slide.darijaNote.title}
            fr={slide.darijaNote.fr}
            arabic={slide.darijaNote.arabic}
            canvas
          />
        </div>
      </motion.article>
    );
  }

  // Mobile-first Participant Layout (/join)
  return (
    <motion.article
      key={slide.id}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: "easeOut" }}
      className="rounded-2xl bg-[#FAF8F4] text-[#0F172A] shadow-lg p-5 sm:p-8"
    >
      <div className="space-y-6">
        {/* Editorial Bilingual Slide Stage Header */}
        <div className="space-y-4 border-b border-slate-200/90 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2 font-semibold uppercase tracking-wider text-teal-800">
              <BilingualInline text={slide.sectionTitle} />
              <span aria-hidden="true" className="text-slate-300">
                /
              </span>
              <span className="text-slate-500">
                <BilingualInline text={slide.timeRange} />
              </span>
            </div>

            {slide.techTerms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {slide.techTerms.map((t) => (
                  <span
                    key={t.term}
                    title={`${t.explanation.fr} | ${t.explanation.ar}`}
                    className="border-b border-dotted border-teal-600/60 pb-0.5 text-[11px] font-semibold text-slate-600"
                  >
                    {t.term}
                  </span>
                ))}
              </div>
            )}
          </div>

          <BilingualBlock
            text={slide.title}
            frClassName="font-display font-bold tracking-tight text-[#0F172A] text-2xl sm:text-4xl leading-[1.16]"
            arClassName="font-bold text-teal-800 text-lg sm:text-2xl leading-snug"
          />

          <BilingualBlock
            text={slide.subtitle}
            frClassName="text-slate-600 max-w-4xl text-sm sm:text-base leading-relaxed"
            arClassName="text-slate-700 text-sm sm:text-base leading-relaxed"
          />

          {slide.keyPoints.length > 0 && (
            <ul
              className={`grid gap-x-8 gap-y-3 pt-2 ${
                slide.keyPoints.length > 2 ? "sm:grid-cols-2" : "sm:grid-cols-1 max-w-3xl"
              }`}
            >
              {slide.keyPoints.map((pt, i) => (
                <li
                  key={pt.fr}
                  className="flex items-start gap-3 border-l-2 border-teal-600/50 pl-3.5"
                >
                  <span className="font-mono-code text-xs font-bold text-teal-700 pt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <BilingualBlock
                    text={pt}
                    className="flex-1"
                    frClassName="font-medium text-slate-900 text-xs sm:text-sm"
                    arClassName="text-teal-900 text-xs sm:text-sm"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {slide.kind === "welcome" && (
          <div className="space-y-5">
            <BilingualBlock
              text={{
                fr: "Rencontre d'échange entre collègues du primaire",
                ar: "لقاء تقاسم الخبرات بين أستاذات وأساتذة الابتدائي",
              }}
              frClassName="font-display font-bold text-[#0F172A] text-xl"
              arClassName="font-bold text-teal-800 text-lg"
            />
            <div className="flex flex-wrap gap-8 border-t border-slate-200 pt-4">
              <div>
                <p className="font-display text-3xl font-bold text-teal-700 tabular-nums">
                  {connectedCount}
                </p>
                <BilingualBlock
                  text={{ fr: "Collègues connectés", ar: "الزملاء المتصلون" }}
                  frClassName="mt-1 text-xs font-semibold text-slate-600"
                  arClassName="text-xs font-semibold text-teal-900"
                />
              </div>
              <div className="border-l border-slate-200 pl-8">
                <p className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                  {totalParticipants}
                </p>
                <BilingualBlock
                  text={{ fr: "Inscrits session", ar: "المسجلون في الجلسة" }}
                  frClassName="mt-1 text-xs font-semibold text-slate-600"
                  arClassName="text-xs font-semibold text-slate-700"
                />
              </div>
            </div>
          </div>
        )}

        {slide.kind === "vision" && (
          <div className="grid gap-6 md:grid-cols-2 py-2">
            <div className="border-t-2 border-slate-300 pt-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                <BilingualInline text={{ fr: "Hier · Usage passif", ar: "بالأمس · استعمال سلبي" }} />
              </span>
              <BilingualBlock
                text={{
                  fr: "Consommateur d'outils génériques",
                  ar: "مجرد مستهلك لأدوات جاهزة وعامة",
                }}
                frClassName="font-display font-bold text-slate-900 text-xl"
                arClassName="font-bold text-slate-700 text-base"
              />
            </div>
            <div className="border-t-2 border-teal-600 pt-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                <BilingualInline
                  text={{ fr: "Aujourd'hui · Pouvoir d'agir", ar: "اليوم · المبادرة والإبداع" }}
                />
              </span>
              <BilingualBlock
                text={{
                  fr: "Créateur de solutions pédagogiques",
                  ar: "مبدع(ة) لحلول بيداغوجية ملائمة",
                }}
                frClassName="font-display font-bold text-[#0F172A] text-xl"
                arClassName="font-bold text-teal-800 text-base"
              />
            </div>
          </div>
        )}

        {slide.kind === "closing" && (
          <div className="rounded-2xl bg-[#0B1220] px-6 py-8 text-center text-white space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">
              Province de Mediouna · Centre de Digitalisation · إقليم مديونة · مركز الرقمنة
            </p>
            <blockquote dir="ltr" lang="fr" className="font-display text-2xl font-bold text-[#FAF8F4]">
              « Ne soyez pas seulement utilisateurs du numérique. Devenez créateurs de solutions pédagogiques. »
            </blockquote>
            <blockquote dir="rtl" lang="ar" className="font-arabic text-xl font-bold text-teal-300">
              « لا تكونوا مجرد مستعملين للتكنولوجيا الرقمية، بل كونوا صانعي حلول بيداغوجية. »
            </blockquote>
          </div>
        )}

        {slide.kind === "poll" && slide.activityKey && (
          <LivePollWidget
            activityKey={slide.activityKey}
            status={activityStatus}
            showResults={showResults}
            isPaused={isPaused}
            aggregate={aggregate}
            myResponses={myResponses}
            canSubmit={canSubmit}
            onSubmitted={onSubmitted}
          />
        )}

        {slide.kind === "quiz" && slide.activityKey && (
          <QuizWidget
            activityKey={slide.activityKey}
            status={activityStatus}
            showResults={showResults}
            isPaused={isPaused}
            aggregate={aggregate}
            myResponses={myResponses}
            canSubmit={canSubmit}
            onSubmitted={onSubmitted}
          />
        )}

        {slide.kind === "use-cases" && <UseCaseExplorer />}

        {slide.kind === "prompt-builder" && (
          <PromptBuilderWidget
            status={activityStatus}
            isPaused={isPaused}
            aggregate={aggregate}
            myResponses={myResponses}
            canSubmit={canSubmit}
            onSubmitted={onSubmitted}
          />
        )}

        {slide.kind === "meta-prompt-exercise" && (
          <MetaPromptExercise
            status={activityStatus}
            isPaused={isPaused}
            aggregate={aggregate}
            myResponses={myResponses}
            canSubmit={canSubmit}
            onSubmitted={onSubmitted}
          />
        )}

        {slide.kind === "web-trio" && <WebTrioExplainer />}
        {slide.kind === "live-demo" && <DemoQuizApp />}
        {slide.kind === "gallery" && <AppGalleryExplorer />}
        {slide.kind === "group-projects" && <GroupProjectsBoard />}

        {slide.kind === "showcase-vote" && (
          <ShowcaseVotingWidget
            status={activityStatus}
            showResults={showResults}
            isPaused={isPaused}
            aggregate={aggregate}
            myResponses={myResponses}
            canSubmit={canSubmit}
            defaultContributorName={participantName}
            onSubmitted={onSubmitted}
          />
        )}

        {slide.kind === "exit-ticket" && (
          <ExitTicketWidget
            status={activityStatus}
            showResults={showResults}
            isPaused={isPaused}
            aggregate={aggregate}
            myResponses={myResponses}
            canSubmit={canSubmit}
            onSubmitted={onSubmitted}
          />
        )}

        <DarijaCallout
          title={slide.darijaNote.title}
          fr={slide.darijaNote.fr}
          arabic={slide.darijaNote.arabic}
        />
      </div>
    </motion.article>
  );
}
