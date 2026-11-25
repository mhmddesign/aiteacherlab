"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Award, Monitor } from "lucide-react";
import type {
  ActivityAggregate,
  ActivityStatus,
  BilingualText,
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

const CANVAS_HEADLINES: Record<string, BilingualText> = {
  "s01-welcome": {
    fr: "De l'IA à la création pédagogique",
    ar: "من الذكاء الاصطناعي إلى الإبداع البيداغوجي",
  },
  "s01-vision": {
    fr: "Devenir créateurs pédagogiques",
    ar: "أن نصبح صانعي حلول بيداغوجية",
  },
  "s02-needs-poll": {
    fr: "Identifier nos priorités sur le terrain",
    ar: "تحديد أولوياتنا في الميدان",
  },
  "s03-concepts": {
    fr: "5 notions clés expliquées simplement",
    ar: "5 مفاهيم أساسية مشروحة ببساطة",
  },
  "s03-quiz": {
    fr: "Quiz express : 5 repères sur les LLM",
    ar: "رائز سريع: 5 معالم حول الـ LLM",
  },
  "s04-use-cases": {
    fr: "Exemples réels pour le primaire",
    ar: "أمثلة واقعية للتعليم الابتدائي",
  },
  "s05-pillars": {
    fr: "6 garde-fous pour l'IA en classe",
    ar: "6 ضوابط للذكاء الاصطناعي في القسم",
  },
  "s05-true-false": {
    fr: "Vrai ou Faux : Réflexes en classe",
    ar: "صحيح أم خطأ: ممارسات مسؤولة",
  },
  "s06-anatomy": {
    fr: "Prompt faible vs Prompt solide",
    ar: "توجيه ضعيف مقابل توجيه محكم",
  },
  "s06-builder": {
    fr: "Atelier : Votre Prompt Builder",
    ar: "ورشة: مُنشئ التوجيهات",
  },
  "s07-workflow": {
    fr: "Le Méta-Prompting en 6 étapes",
    ar: "الميتا-برومبت في 6 خطوات",
  },
  "s07-exercise": {
    fr: "Exercice : Transformez une idée brute",
    ar: "تمرين: حوّلوا فكرة أولية",
  },
  "s08-web-trio": {
    fr: "HTML, CSS et JavaScript : le trio du navigateur",
    ar: "HTML وCSS وJavaScript: ثلاثي المتصفح",
  },
  "s08-ecosystem": {
    fr: "De l'idée à la classe : 4 étapes",
    ar: "من الفكرة إلى القسم: 4 مراحل",
  },
  "s09-live-demo": {
    fr: "Démonstration : Prompt → Prototype",
    ar: "عرض حي: من التوجيه إلى نموذج شغّال",
  },
  "s10-gallery": {
    fr: "Galerie d'applications du primaire",
    ar: "معرض تطبيقات التعليم الابتدائي",
  },
  "s10-projects": {
    fr: "Atelier en groupes · 4 × 5 collègues",
    ar: "ورشة المجموعات · 25 دقيقة",
  },
  "s10-vote": {
    fr: "Quel projet tester dès lundi ?",
    ar: "أي مشروع ستجربونه يوم الاثنين؟",
  },
  "s11-showcase-vote": {
    fr: "Showcase & Galerie Provinciale",
    ar: "عرض المجموعات والمعرض الإقليمي",
  },
  "s12-exit-ticket": {
    fr: "Votre premier pas cette semaine",
    ar: "خطوتكم الأولى هذا الأسبوع",
  },
};

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
    // Full-bleed keynote hero closing slide
    if (slide.kind === "closing") {
      return (
        <motion.article
          key={slide.id}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: "easeOut" }}
          className="h-full w-full flex flex-col justify-between overflow-hidden bg-[#0B1220] text-white px-[96px] py-[68px]"
        >
          <div className="flex items-center justify-between text-[20px] font-bold uppercase tracking-[0.2em] text-teal-400">
            <span>Province de Mediouna · Centre de Digitalisation</span>
            <span dir="rtl" lang="ar" className="font-arabic tracking-normal text-[24px]">
              إقليم مديونة · مركز الرقمنة
            </span>
          </div>

          <div className="space-y-10 text-center">
            <h1
              data-slide-heading-fr="true"
              dir="ltr"
              lang="fr"
              className="mx-auto max-w-[1620px] font-display text-[76px] font-bold leading-[1.14] text-[#FAF8F4]"
            >
              « Ne soyez pas seulement utilisateurs du numérique. Devenez créateurs de solutions pédagogiques. »
            </h1>
            <h2
              data-slide-heading-ar="true"
              dir="rtl"
              lang="ar"
              className="font-arabic mx-auto max-w-[1620px] text-[64px] font-bold leading-[1.35] text-teal-300"
            >
              « لا تكونوا مجرد مستعملين للتكنولوجيا الرقمية، بل كونوا صانعي حلول بيداغوجية. »
            </h2>
          </div>

          <div
            data-slide-body="true"
            className="border-t border-slate-800 pt-7 grid grid-cols-2 gap-10 items-center"
          >
            <p dir="ltr" lang="fr" className="text-[28px] font-medium text-slate-300 leading-snug">
              Identifier → Spécifier → Prototyper → Tester → Améliorer → Partager
            </p>
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic text-[32px] font-medium text-teal-200 leading-snug"
            >
              تحديد ← توصيف ← نموذج أولي ← تجريب ← تحسين ← تقاسم
            </p>
          </div>
        </motion.article>
      );
    }

    const headline = CANVAS_HEADLINES[slide.id] ?? slide.title;
    const isLongFrTitle = headline.fr.length > 42;

    return (
      <motion.article
        key={slide.id}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: "easeOut" }}
        className="h-full w-full flex flex-col justify-between gap-5 overflow-hidden bg-[#FAF8F4] text-[#0F172A] px-[76px] pt-[38px] pb-[32px]"
      >
        {/* Projector-First Keynote Header */}
        <div className="shrink-0 space-y-2 border-b-2 border-slate-200/90 pb-4">
          <div className="flex items-center justify-between gap-6 text-[20px]">
            <div className="flex items-center gap-3 font-bold uppercase tracking-wider text-teal-800">
              <BilingualInline text={slide.sectionTitle} />
              <span aria-hidden="true" className="text-slate-300">
                /
              </span>
              <span className="text-slate-500">
                <BilingualInline text={slide.timeRange} />
              </span>
            </div>

            {slide.techTerms.length > 0 && (
              <div className="flex items-center gap-4">
                {slide.techTerms.slice(0, 2).map((t) => (
                  <span
                    key={t.term}
                    title={`${t.explanation.fr} | ${t.explanation.ar}`}
                    className="rounded-full bg-teal-50 px-4 py-1 text-[18px] font-bold text-teal-900 border border-teal-200/80"
                  >
                    {t.term}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h1
              data-slide-heading-fr="true"
              dir="ltr"
              lang="fr"
              className={`font-display font-bold tracking-tight text-[#0F172A] leading-[1.06] ${
                isLongFrTitle ? "text-[66px]" : "text-[76px]"
              }`}
            >
              {headline.fr}
            </h1>
            <h2
              data-slide-heading-ar="true"
              dir="rtl"
              lang="ar"
              className={`font-arabic font-bold text-teal-800 leading-[1.22] ${
                isLongFrTitle ? "text-[60px]" : "text-[66px]"
              }`}
            >
              {headline.ar}
            </h2>
          </div>
        </div>

        {/* Spacious Keynote Content Stage (~730px height) */}
        <div
          data-slide-stage="true"
          className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden"
        >
          {slide.kind === "welcome" && (
            <div className="grid grid-cols-12 gap-12 items-center">
              <div className="col-span-7 space-y-8">
                <div data-slide-body="true" className="space-y-3">
                  <p className="text-[22px] font-bold uppercase tracking-widest text-teal-800">
                    <BilingualInline
                      text={{
                        fr: "Province de Mediouna · Centre de Digitalisation",
                        ar: "إقليم مديونة · مركز الرقمنة",
                      }}
                    />
                  </p>
                  <p dir="ltr" lang="fr" className="text-[34px] font-medium text-slate-700 leading-snug">
                    Rencontre d&apos;échange entre collègues du primaire (1AEP–6AEP) : IA générative, Prompt Engineering &amp; création d&apos;outils de classe.
                  </p>
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-arabic text-[36px] font-medium text-slate-800 leading-snug"
                  >
                    لقاء تشاركي بين أستاذات وأساتذة الابتدائي (1AEP–6AEP): الذكاء الاصطناعي التوليدي، هندسة التوجيهات، وبناء أدوات للقسم.
                  </p>
                </div>

                <div className="flex items-center gap-16 border-t-2 border-slate-200 pt-7">
                  <div>
                    <p className="font-display text-[124px] leading-none font-bold text-teal-700 tabular-nums">
                      {connectedCount}
                    </p>
                    <BilingualBlock
                      text={{ fr: "Collègues connectés", ar: "الزملاء المتصلون" }}
                      className="mt-2"
                      frClassName="text-[28px] font-bold text-slate-700"
                      arClassName="text-[30px] font-bold text-teal-900"
                    />
                  </div>
                  <div className="border-l-2 border-slate-200 pl-16">
                    <p className="font-display text-[124px] leading-none font-bold text-slate-900 tabular-nums">
                      {totalParticipants}
                    </p>
                    <BilingualBlock
                      text={{ fr: "Inscrits session", ar: "المسجلون في الجلسة" }}
                      className="mt-2"
                      frClassName="text-[28px] font-bold text-slate-700"
                      arClassName="text-[30px] font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-5">
                {showQrOverlay ? (
                  <QrJoinPanel size={280} showPinHint={joinPinHint} />
                ) : (
                  <div className="rounded-3xl bg-[#0B1220] p-10 text-white space-y-6 shadow-xl">
                    <div className="inline-flex items-center gap-3 rounded-full bg-teal-500/20 px-5 py-2 text-[22px] font-bold text-teal-300">
                      <Monitor className="h-6 w-6" />
                      <span>12 Sections · 21 Diapos · 1AEP–6AEP</span>
                    </div>
                    <BilingualBlock
                      text={{
                        fr: "AI Teacher Lab · Mediouna",
                        ar: "مختبر المعلم · إقليم مديونة",
                      }}
                      frClassName="font-display text-[48px] font-bold text-white leading-tight"
                      arClassName="text-[42px] font-bold text-teal-300 leading-snug"
                    />
                    <BilingualBlock
                      text={{
                        fr: "Session interactive synchrone",
                        ar: "ورشة تفاعلية مباشرة",
                      }}
                      frClassName="text-[28px] text-slate-300"
                      arClassName="text-[30px] text-slate-200"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {slide.kind === "vision" && (
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-14">
                <div className="border-t-4 border-slate-300 pt-7 space-y-4">
                  <span className="text-[22px] font-bold uppercase tracking-widest text-slate-500">
                    <BilingualInline text={{ fr: "Hier · Usage passif", ar: "بالأمس · استعمال سلبي" }} />
                  </span>
                  <BilingualBlock
                    text={{
                      fr: "Consommateur d'outils génériques",
                      ar: "مستهلك لأدوات جاهزة وعامة",
                    }}
                    frClassName="font-display text-[48px] font-bold text-slate-900 leading-tight"
                    arClassName="text-[44px] font-bold text-slate-700 leading-snug"
                  />
                  <BilingualBlock
                    text={{
                      fr: "Fiches conçues ailleurs, éloignées de nos effectifs et de nos moyens.",
                      ar: "جذاذات جاهزة بعيدة عن واقع أقسامنا واللغة العربية وتجهيزات المدرسة.",
                    }}
                    frClassName="text-[32px] text-slate-600 leading-snug"
                    arClassName="text-[34px] text-slate-700 leading-snug"
                  />
                </div>

                <div data-slide-body="true" className="border-t-4 border-teal-600 pt-7 space-y-4">
                  <span className="text-[22px] font-bold uppercase tracking-widest text-teal-700">
                    <BilingualInline
                      text={{ fr: "Aujourd'hui · Pouvoir d'agir", ar: "اليوم · المبادرة والإبداع" }}
                    />
                  </span>
                  <BilingualBlock
                    text={{
                      fr: "Créateur de solutions pédagogiques",
                      ar: "صانع حلول بيداغوجية ملائمة",
                    }}
                    frClassName="font-display text-[48px] font-bold text-[#0F172A] leading-tight"
                    arClassName="text-[44px] font-bold text-teal-800 leading-snug"
                  />
                  <BilingualBlock
                    text={{
                      fr: "Outils légers, projetables, hors ligne ou imprimables — partagés à Mediouna.",
                      ar: "أدوات خفيفة للعرض أو الطباعة أو بدون إنترنت، نتقاسمها في مديونة.",
                    }}
                    frClassName="text-[32px] text-slate-800 leading-snug font-medium"
                    arClassName="text-[34px] text-slate-900 leading-snug font-medium"
                  />
                </div>
              </div>

              <div className="border-t-2 border-slate-200 pt-6 grid grid-cols-2 gap-10 items-center">
                <p dir="ltr" lang="fr" className="text-[28px] font-semibold text-teal-900">
                  L&apos;IA assiste la préparation — l&apos;enseignant reste le chef d&apos;orchestre.
                </p>
                <p dir="rtl" lang="ar" className="font-arabic text-[32px] font-semibold text-teal-900">
                  الذكاء الاصطناعي مساعد في التحضير — والأستاذ(ة) يبقى محور القسم.
                </p>
              </div>
            </div>
          )}

          {slide.kind === "concepts" && (
            <div data-slide-body="true" className="divide-y-2 divide-slate-200 border-y-2 border-slate-200">
              {[
                {
                  code: "01",
                  title: { fr: "AI", ar: "الذكاء الاصطناعي" },
                  desc: {
                    fr: "Systèmes capables d'exécuter des tâches complexes.",
                    ar: "أنظمة تنجز مهام مرتبطة بالذكاء البشري.",
                  },
                },
                {
                  code: "02",
                  title: { fr: "Generative AI", ar: "التوليدي" },
                  desc: {
                    fr: "Produit du nouveau contenu : texte, exercices, code.",
                    ar: "ينتج محتوى جديداً: نصوصاً، تمارين، أو برمجة.",
                  },
                },
                {
                  code: "03",
                  title: { fr: "LLM", ar: "النموذج اللغوي" },
                  desc: {
                    fr: "Prédit les mots les plus probables selon le contexte.",
                    ar: "يتنبأ بالكلمات الأكثر احتمالاً حسب السياق.",
                  },
                },
                {
                  code: "04",
                  title: { fr: "Prompt", ar: "التوجيه" },
                  desc: {
                    fr: "Instruction précise donnée par l'enseignant.",
                    ar: "التعليمات الدقيقة التي نوجهها للأداة.",
                  },
                },
                {
                  code: "05",
                  title: { fr: "Hallucination", ar: "الهلوسة" },
                  desc: {
                    fr: "Erreur affirmée avec assurance : toujours relire.",
                    ar: "خطأ بثقة زائدة: المراجعة البشرية إلزامية.",
                  },
                },
              ].map((c) => (
                <div key={c.code} className="grid grid-cols-12 gap-6 py-4 items-center">
                  <div className="col-span-4 flex items-center gap-5">
                    <span className="font-mono-code text-[34px] font-bold text-teal-700 shrink-0">
                      {c.code}
                    </span>
                    <BilingualBlock
                      text={c.title}
                      frClassName="font-display text-[32px] font-bold text-slate-900 leading-none"
                      arClassName="text-[28px] font-bold text-teal-800 leading-snug"
                    />
                  </div>
                  <p dir="ltr" lang="fr" className="col-span-4 text-[28px] leading-snug text-slate-800 font-medium">
                    {c.desc.fr}
                  </p>
                  <p
                    dir="rtl"
                    lang="ar"
                    className="col-span-4 font-arabic text-[30px] leading-snug text-slate-900 font-medium"
                  >
                    {c.desc.ar}
                  </p>
                </div>
              ))}
            </div>
          )}

          {slide.kind === "pillars" && (
            <div data-slide-body="true" className="grid grid-cols-3 gap-x-12 gap-y-10">
              {[
                {
                  num: "01",
                  title: { fr: "Hallucinations", ar: "الهلوسات" },
                  desc: {
                    fr: "Vérifier faits, calculs et voyellation.",
                    ar: "التحقق من الوقائع والحساب والشكل.",
                  },
                },
                {
                  num: "02",
                  title: { fr: "Validation", ar: "الاعتماد البيداغوجي" },
                  desc: {
                    fr: "Relire avant impression ou projection.",
                    ar: "قراءة كل مسودة قبل العرض أو الطباعة.",
                  },
                },
                {
                  num: "03",
                  title: { fr: "Niveau & âge", ar: "الملاءمة للسن" },
                  desc: {
                    fr: "Adapter au réel de 1AEP à 6AEP.",
                    ar: "ضبط المعجم لمستوى 1AEP–6AEP.",
                  },
                },
                {
                  num: "04",
                  title: { fr: "Biais culturels", ar: "التحيز الثقافي" },
                  desc: {
                    fr: "Ancrer dans le vécu marocain.",
                    ar: "تكييف الأمثلة مع المحيط المغربي.",
                  },
                },
                {
                  num: "05",
                  title: { fr: "Confidentialité", ar: "الخصوصية" },
                  desc: {
                    fr: "Zéro nom d'élève, zéro code Massar.",
                    ar: "صفر اسم تلميذ وصفر رمز مسار.",
                  },
                },
                {
                  num: "06",
                  title: { fr: "Responsabilité", ar: "المسؤولية" },
                  desc: {
                    fr: "Jugement pédagogique 100 % humain.",
                    ar: "القرار البيداغوجي إنساني 100%.",
                  },
                },
              ].map((p) => (
                <div key={p.num} className="border-t-4 border-teal-600/70 pt-5 space-y-2.5">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono-code text-[34px] font-bold text-teal-700">{p.num}</span>
                    <BilingualBlock
                      text={p.title}
                      frClassName="font-display text-[34px] font-bold text-slate-900 leading-tight"
                      arClassName="text-[30px] font-bold text-teal-800 leading-snug"
                    />
                  </div>
                  <BilingualBlock
                    text={p.desc}
                    frClassName="text-[28px] text-slate-700 leading-snug"
                    arClassName="text-[30px] text-slate-800 leading-snug"
                  />
                </div>
              ))}
            </div>
          )}

          {slide.kind === "prompt-anatomy" && (
            <div className="grid grid-cols-12 gap-10 items-stretch">
              <div className="col-span-5 border-t-4 border-amber-500 bg-amber-50/75 p-8 rounded-b-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="block text-[24px] font-bold uppercase tracking-wider text-amber-800">
                    Prompt faible · <span className="font-arabic">توجيه ضعيف</span>
                  </span>
                  <div className="border-l-4 border-amber-500 bg-white px-6 py-5 rounded-r-xl space-y-3">
                    <p dir="ltr" className="font-mono-code text-[30px] font-bold text-slate-900 leading-snug">
                      « {WEAK_VS_STRONG_PROMPT.weak.promptFr} »
                    </p>
                    <p dir="rtl" lang="ar" className="font-arabic text-[32px] font-bold text-amber-950 leading-snug">
                      « {WEAK_VS_STRONG_PROMPT.weak.promptAr} »
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p dir="ltr" lang="fr" className="text-[28px] font-semibold text-amber-950">
                    Sans niveau · Sans objectif · Sans format
                  </p>
                  <p dir="rtl" lang="ar" className="font-arabic text-[30px] font-semibold text-amber-950">
                    بدون مستوى · بدون هدف · بدون صيغة
                  </p>
                </div>
              </div>

              <div
                data-slide-body="true"
                className="col-span-7 border-t-4 border-teal-500 bg-[#0B1220] text-white p-8 rounded-b-2xl flex flex-col justify-between space-y-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[24px] font-bold uppercase tracking-wider text-teal-300">
                    8 briques d&apos;un Prompt solide · <span className="font-arabic">8 لبنات</span>
                  </span>
                  <div className="flex gap-2.5">
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

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { n: "01", fr: "Rôle de l'IA", ar: "الدور" },
                    { n: "02", fr: "Niveau (1AEP–6AEP)", ar: "المستوى" },
                    { n: "03", fr: "Objectif précis", ar: "الهدف التعلمي" },
                    { n: "04", fr: "Compétence ciblée", ar: "الكفاية" },
                    { n: "05", fr: "Public & effectif", ar: "سياق القسم" },
                    { n: "06", fr: "Contraintes réelles", ar: "الشروط المادية" },
                    { n: "07", fr: "Format de sortie", ar: "صيغة المخرجات" },
                    { n: "08", fr: "Critères & validation", ar: "المراجعة والاعتماد" },
                  ].map((b) => (
                    <div key={b.n} className="flex items-center gap-4 border-b border-slate-800 pb-2.5">
                      <span className="font-mono-code text-[26px] font-bold text-teal-400">
                        {b.n}
                      </span>
                      <BilingualBlock
                        text={b}
                        frClassName="text-[26px] font-bold text-white leading-tight"
                        arClassName="text-[26px] font-semibold text-teal-200 leading-tight"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {slide.kind === "meta-prompt-flow" && (
            <div className="space-y-9">
              {/* 6-Step Visual Flow */}
              <div className="grid grid-cols-6 gap-4 items-stretch">
                {[
                  { n: "1", fr: "Idée brute", ar: "فكرة أولية" },
                  { n: "2", fr: "Manques", ar: "النواقص" },
                  { n: "3", fr: "5 questions", ar: "5 أسئلة" },
                  { n: "4", fr: "Prompt fort", ar: "توجيه قوي" },
                  { n: "5", fr: "Exécution", ar: "التنفيذ" },
                  { n: "6", fr: "Validation", ar: "الاعتماد" },
                ].map((step, i) => (
                  <div
                    key={step.n}
                    className="relative rounded-2xl border-2 border-slate-200 bg-white p-5 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-code text-[42px] leading-none font-bold text-teal-700">
                        {step.n}
                      </span>
                      {i < 5 && <ArrowRight className="h-6 w-6 text-slate-400" />}
                    </div>
                    <BilingualBlock
                      text={step}
                      className="mt-4"
                      frClassName="text-[26px] font-bold text-slate-900 leading-tight"
                      arClassName="text-[26px] font-bold text-teal-800 leading-snug"
                    />
                  </div>
                ))}
              </div>

              {/* Core Ready-to-Use Bilingual Formula */}
              <div data-slide-body="true" className="grid grid-cols-2 gap-8">
                <div className="rounded-2xl bg-[#0B1220] p-7 text-white space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[20px] font-bold uppercase tracking-wider text-teal-300">
                      Formule Méta-Prompt (FR)
                    </span>
                    <CopyPromptButton
                      text={META_PROMPT_EXAMPLES.fr.metaPrompt}
                      label="Copier FR"
                      labelAr="نسخ FR"
                    />
                  </div>
                  <p dir="ltr" lang="fr" className="text-[30px] leading-snug font-medium text-slate-100">
                    « Avant de générer : identifie les informations manquantes, pose-moi 5 questions courtes sur ma classe, puis attends mes réponses. »
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-teal-200 bg-white p-7 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span dir="rtl" lang="ar" className="font-arabic text-[24px] font-bold text-teal-800">
                      صيغة الميتا-برومبت (AR)
                    </span>
                    <CopyPromptButton
                      text={META_PROMPT_EXAMPLES.ar.metaPrompt}
                      label="Copier AR"
                      labelAr="نسخ AR"
                    />
                  </div>
                  <p dir="rtl" lang="ar" className="font-arabic text-[34px] leading-snug font-semibold text-slate-900">
                    « قبل التوليد: حدد المعلومات الناقصة، اطرح عليّ 5 أسئلة قصيرة حول قسمي، ثم انتظر إجاباتي. »
                  </p>
                </div>
              </div>
            </div>
          )}

          {slide.kind === "ecosystem" && (
            <div className="space-y-12">
              {/* 4 Large Process Steps */}
              <div data-slide-body="true" className="grid grid-cols-4 gap-10">
                {[
                  {
                    num: "01",
                    title: { fr: "Contenu", ar: "إنتاج محتوى" },
                    desc: {
                      fr: "Textes, QCM & 3 niveaux.",
                      ar: "نصوص وتمارين متدرجة.",
                    },
                  },
                  {
                    num: "02",
                    title: { fr: "Application", ar: "بناء تطبيق" },
                    desc: {
                      fr: "Interface HTML/CSS/JS.",
                      ar: "واجهة تفاعلية خفيفة.",
                    },
                  },
                  {
                    num: "03",
                    title: { fr: "En classe", ar: "في القسم" },
                    desc: {
                      fr: "Projecteur, hors ligne ou A4.",
                      ar: "مسلاط، بدون إنترنت أو A4.",
                    },
                  },
                  {
                    num: "04",
                    title: { fr: "Impact réel", ar: "الأثر التعلمي" },
                    desc: {
                      fr: "Mesurer les progrès élèves.",
                      ar: "التحقق من تعلم التلاميذ.",
                    },
                  },
                ].map((s) => (
                  <div key={s.num} className="border-t-4 border-teal-600 pt-5 space-y-3">
                    <span className="font-mono-code text-[58px] leading-none font-bold text-teal-700 block">
                      {s.num}
                    </span>
                    <BilingualBlock
                      text={s.title}
                      frClassName="font-display text-[36px] font-bold text-slate-900 leading-tight"
                      arClassName="text-[34px] font-bold text-teal-800 leading-snug"
                    />
                    <BilingualBlock
                      text={s.desc}
                      frClassName="text-[28px] text-slate-600 leading-snug"
                      arClassName="text-[30px] text-slate-700 leading-snug"
                    />
                  </div>
                ))}
              </div>

              {/* Clean 5-Tool Landscape Ribbon */}
              <div className="grid grid-cols-5 gap-6 border-t-2 border-slate-200 pt-8">
                {[
                  { name: "ChatGPT", fr: "Idées & brouillons", ar: "أفكار ومسودات" },
                  { name: "Antigravity", fr: "Apps fiables", ar: "بناء التطبيقات" },
                  { name: "Web App", fr: "Sans installation", ar: "في المتصفح" },
                  { name: "Prototype", fr: "Testable en 25 min", ar: "تجريب سريع" },
                  { name: "Déployée", fr: "Lien / QR Mediouna", ar: "مشاركة بالرابط" },
                ].map((e) => (
                  <div key={e.name} className="space-y-1.5">
                    <p className="text-[28px] font-bold text-[#0F172A]">{e.name}</p>
                    <p dir="ltr" lang="fr" className="text-[22px] text-slate-600">
                      {e.fr}
                    </p>
                    <p dir="rtl" lang="ar" className="font-arabic text-[24px] text-teal-800 font-medium">
                      {e.ar}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.kind === "poll" && slide.activityKey && (
            <div className="grid grid-cols-12 gap-10 items-center">
              <div data-slide-body="true" className="col-span-4 space-y-6">
                <div>
                  <p className="font-display text-[124px] leading-none font-bold text-teal-700 tabular-nums">
                    {aggregate?.totalRespondents ?? 0}
                  </p>
                  <BilingualBlock
                    text={{ fr: "Votes reçus", ar: "الأصوات المسجلة" }}
                    className="mt-2"
                    frClassName="text-[28px] font-bold text-slate-700"
                    arClassName="text-[30px] font-bold text-teal-900"
                  />
                </div>
                <BilingualBlock
                  text={
                    slide.keyPoints[0] ?? {
                      fr: "Votez sur votre téléphone en direct.",
                      ar: "صوّتوا مباشرة عبر هواتفكم.",
                    }
                  }
                  frClassName="text-[30px] font-semibold text-slate-800 leading-snug"
                  arClassName="text-[32px] font-semibold text-teal-900 leading-snug"
                />
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
            <div className="grid grid-cols-12 gap-10 items-center">
              <div data-slide-body="true" className="col-span-4 space-y-6">
                {[
                  { fr: "Plus utile en classe", ar: "الأكثر فائدة في القسم" },
                  { fr: "Meilleure pédagogie", ar: "أفضل فكرة بيداغوجية" },
                  { fr: "Plus créative", ar: "الحل الأكثر إبداعاً" },
                ].map((cat) => (
                  <div key={cat.fr} className="flex items-start gap-4 border-l-4 border-teal-600 pl-5">
                    <Award className="mt-1 h-8 w-8 text-teal-700 shrink-0" />
                    <BilingualBlock
                      text={cat}
                      frClassName="text-[30px] font-bold text-slate-900 leading-tight"
                      arClassName="text-[30px] font-bold text-teal-800 leading-snug"
                    />
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
