"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
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
  const canSubmit = mode === "participant";
  const prefersReducedMotion = useReducedMotion();

  const slideBody = (
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
          frClassName={`font-display font-bold tracking-tight text-[#0F172A] ${
            isProjector
              ? "text-3xl sm:text-5xl leading-[1.12]"
              : "text-2xl sm:text-4xl leading-[1.16]"
          }`}
          arClassName={`font-bold text-teal-800 ${
            isProjector ? "text-2xl sm:text-3xl leading-snug" : "text-lg sm:text-2xl leading-snug"
          }`}
        />

        <BilingualBlock
          text={slide.subtitle}
          frClassName={`text-slate-600 max-w-4xl ${
            isProjector ? "text-lg sm:text-xl leading-relaxed" : "text-sm sm:text-base leading-relaxed"
          }`}
          arClassName={`text-slate-700 ${
            isProjector ? "text-base sm:text-xl leading-relaxed" : "text-sm sm:text-base leading-relaxed"
          }`}
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
                  frClassName={`font-medium text-slate-900 ${
                    isProjector ? "text-base" : "text-xs sm:text-sm"
                  }`}
                  arClassName={`text-teal-900 ${
                    isProjector ? "text-base" : "text-xs sm:text-sm"
                  }`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Distinct Slide Compositions per Content Type */}
      {slide.kind === "welcome" && (
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-800">
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
                frClassName={`font-display font-bold text-[#0F172A] ${isProjector ? "text-3xl" : "text-2xl"}`}
                arClassName={`font-bold text-teal-800 ${isProjector ? "text-2xl" : "text-lg"}`}
              />
              <BilingualBlock
                text={{
                  fr: "Organisée en collaboration avec le Centre de Digitalisation : pratiques d'IA générative, Prompt Engineering et création de mini-applications pour vos classes (1AEP–6AEP).",
                  ar: "بتنسيق مع مركز الرقمنة: ممارسات عملية في الذكاء الاصطناعي التوليدي، وهندسة التوجيهات، وبناء تطبيقات تعليمية مصغرة لأقسامنا (1AEP–6AEP).",
                }}
                frClassName={isProjector ? "text-lg text-slate-700 leading-relaxed" : "text-sm text-slate-600 leading-relaxed"}
                arClassName={isProjector ? "text-lg text-slate-700 leading-relaxed" : "text-sm text-slate-700 leading-relaxed"}
              />
            </div>

            <div className="flex flex-wrap gap-10 border-t border-slate-200 pt-5">
              <div>
                <p className="font-display text-4xl sm:text-5xl font-bold text-teal-700 tabular-nums">
                  {connectedCount}
                </p>
                <BilingualBlock
                  text={{ fr: "Collègues connectés", ar: "الزملاء المتصلون" }}
                  frClassName="mt-1 text-xs font-semibold text-slate-600"
                  arClassName="text-xs font-semibold text-teal-900"
                />
              </div>
              <div className="border-l border-slate-200 pl-10">
                <p className="font-display text-4xl sm:text-5xl font-bold text-slate-900 tabular-nums">
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

          {(showQrOverlay || mode !== "participant") && (
            <div className="lg:col-span-5">
              <QrJoinPanel size={isProjector ? 200 : 155} showPinHint={joinPinHint} />
            </div>
          )}
        </div>
      )}

      {slide.kind === "vision" && (
        <div className="grid gap-8 md:grid-cols-2 py-2">
          <div className="border-t-2 border-slate-300 pt-4 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              <BilingualInline text={{ fr: "Hier · Usage passif", ar: "بالأمس · استعمال سلبي" }} />
            </span>
            <BilingualBlock
              text={{
                fr: "Consommateur d'outils génériques",
                ar: "مجرد مستهلك لأدوات جاهزة وعامة",
              }}
              frClassName={`font-display font-bold text-slate-900 ${isProjector ? "text-2xl" : "text-xl"}`}
              arClassName={`font-bold text-slate-700 ${isProjector ? "text-xl" : "text-base"}`}
            />
            <BilingualBlock
              text={{
                fr: "Chercher des fiches toutes faites pensées pour d'autres pays, souvent déconnectées de vos effectifs, de l'arabe RTL ou des contraintes matérielles de l'école.",
                ar: "البحث عن جذاذات جاهزة مصممة لسياقات أخرى، بعيدة غالباً عن واقع أقسامنا واللغة العربية وإكراهات التجهيز.",
              }}
              frClassName="text-sm text-slate-600 leading-relaxed"
              arClassName="text-sm text-slate-700 leading-relaxed"
            />
          </div>

          <div className="border-t-2 border-teal-600 pt-4 space-y-2.5">
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
              frClassName={`font-display font-bold text-[#0F172A] ${isProjector ? "text-2xl" : "text-xl"}`}
              arClassName={`font-bold text-teal-800 ${isProjector ? "text-xl" : "text-base"}`}
            />
            <BilingualBlock
              text={{
                fr: "Partir d'un besoin réel de votre classe à Mediouna, rédiger un cahier des charges clair, générer un outil léger (projetable, hors ligne ou imprimable) et le partager entre collègues.",
                ar: "الانطلاق من حاجة حقيقية في قسمكم بمديونة، وصياغة توصيف واضح لإنتاج أداة خفيفة (للعرض أو الطباعة أو بدون إنترنت) وتقاسمها مع الزملاء.",
              }}
              frClassName="text-sm text-slate-700 leading-relaxed"
              arClassName="text-sm text-slate-800 leading-relaxed"
            />
          </div>
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
            <div
              key={c.code}
              className="grid gap-3 py-3.5 sm:grid-cols-12 sm:items-baseline"
            >
              <div className="sm:col-span-4 flex items-baseline gap-3">
                <span className="font-mono-code text-xs font-bold text-teal-700">{c.code}</span>
                <BilingualBlock
                  text={c.title}
                  frClassName="font-display text-base font-bold text-slate-900"
                  arClassName="text-sm font-bold text-teal-800"
                />
              </div>
              <div className="sm:col-span-8">
                <BilingualBlock
                  text={c.desc}
                  frClassName="text-xs sm:text-sm text-slate-700"
                  arClassName="text-xs sm:text-sm text-slate-800"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {slide.kind === "pillars" && (
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 pt-1">
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
            <div key={p.num} className="border-t-2 border-slate-200 pt-3 space-y-1.5">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-code text-xs font-bold text-teal-700">{p.num}</span>
                <BilingualBlock
                  text={p.title}
                  frClassName="text-sm font-bold text-slate-900"
                  arClassName="text-xs font-bold text-teal-800"
                />
              </div>
              <BilingualBlock
                text={p.desc}
                frClassName="text-xs text-slate-600 leading-relaxed"
                arClassName="text-xs text-slate-700 leading-relaxed"
              />
            </div>
          ))}
        </div>
      )}

      {slide.kind === "prompt-anatomy" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="border-t-2 border-amber-500 bg-amber-50/50 p-5 space-y-3">
            <BilingualBlock
              text={WEAK_VS_STRONG_PROMPT.weak.label}
              frClassName="text-xs font-bold uppercase tracking-wider text-amber-800"
              arClassName="text-xs font-bold text-amber-900"
            />
            <div className="border-l-2 border-amber-400 bg-white/90 px-3.5 py-2.5 space-y-1.5">
              <p dir="ltr" className="font-mono-code text-xs text-slate-800">
                « {WEAK_VS_STRONG_PROMPT.weak.promptFr} »
              </p>
              <p dir="rtl" lang="ar" className="font-arabic text-xs font-semibold text-amber-950">
                « {WEAK_VS_STRONG_PROMPT.weak.promptAr} »
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-950">
              {WEAK_VS_STRONG_PROMPT.weak.issues.map((i) => (
                <li key={i.fr}>
                  <BilingualBlock text={i} />
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t-2 border-teal-600 bg-white p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <BilingualBlock
                text={WEAK_VS_STRONG_PROMPT.strong.label}
                frClassName="text-xs font-bold uppercase tracking-wider text-teal-800"
                arClassName="text-xs font-bold text-teal-900"
              />
              <div className="flex gap-1.5">
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
            <pre
              dir="ltr"
              className="whitespace-pre-wrap rounded-xl bg-[#0B1220] p-3.5 font-mono-code text-[11px] leading-relaxed text-slate-100"
            >
              {WEAK_VS_STRONG_PROMPT.strong.promptFr}
            </pre>
            <pre
              dir="rtl"
              lang="ar"
              className="whitespace-pre-wrap rounded-xl bg-teal-50/70 p-3.5 font-arabic text-xs leading-relaxed text-slate-900 border border-teal-200"
            >
              {WEAK_VS_STRONG_PROMPT.strong.promptAr}
            </pre>
            <ul className="space-y-1.5 text-xs text-teal-900">
              {WEAK_VS_STRONG_PROMPT.strong.strengths.map((s) => (
                <li key={s.fr}>
                  <BilingualBlock text={s} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {slide.kind === "meta-prompt-flow" && (
        <div className="space-y-5">
          {/* Process Flow Diagram */}
          <div className="flex flex-wrap items-center gap-2 border-y border-slate-200 py-3">
            {[
              { n: "1", fr: "Idée brute", ar: "فكرة أولية" },
              { n: "2", fr: "Manques", ar: "تحديد النواقص" },
              { n: "3", fr: "5 questions IA", ar: "أسئلة توضيحية" },
              { n: "4", fr: "Prompt optimisé", ar: "توجيه محسّن" },
              { n: "5", fr: "Exécution", ar: "التنفيذ" },
              { n: "6", fr: "Validation humaine", ar: "الاعتماد" },
            ].map((step, i) => (
              <React.Fragment key={step.n}>
                <div className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 border border-slate-200">
                  <span className="font-mono-code text-[11px] font-bold text-teal-700">
                    {step.n}
                  </span>
                  <BilingualBlock
                    text={step}
                    frClassName="text-xs font-bold text-slate-900"
                    arClassName="text-[11px] font-semibold text-teal-800"
                  />
                </div>
                {i < 5 && (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <BilingualBlock
                  text={META_PROMPT_EXAMPLES.fr.title}
                  frClassName="text-xs font-bold text-slate-900"
                  arClassName="text-xs font-bold text-teal-800"
                />
                <CopyPromptButton
                  text={META_PROMPT_EXAMPLES.fr.metaPrompt}
                  label="Copier FR"
                  labelAr="نسخ FR"
                />
              </div>
              <pre
                dir="ltr"
                className="whitespace-pre-wrap rounded-xl bg-[#0B1220] p-4 font-mono-code text-[11px] leading-relaxed text-slate-100"
              >
                {META_PROMPT_EXAMPLES.fr.metaPrompt}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <BilingualBlock
                  text={META_PROMPT_EXAMPLES.ar.title}
                  frClassName="text-xs font-bold text-slate-900"
                  arClassName="text-xs font-bold text-teal-900"
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
                className="whitespace-pre-wrap rounded-xl bg-white p-4 font-arabic text-xs leading-relaxed text-slate-900 border border-teal-200"
              >
                {META_PROMPT_EXAMPLES.ar.metaPrompt}
              </pre>
            </div>
          </div>
        </div>
      )}

      {slide.kind === "ecosystem" && (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 border-t border-slate-200 pt-4">
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
              <div key={s.num} className="space-y-1.5">
                <span className="font-mono-code text-xs font-bold text-teal-700">{s.num}</span>
                <BilingualBlock
                  text={s.title}
                  frClassName="text-sm font-bold text-slate-900"
                  arClassName="text-xs font-bold text-teal-800"
                />
                <BilingualBlock
                  text={s.desc}
                  frClassName="text-xs text-slate-600 leading-relaxed"
                  arClassName="text-xs text-slate-700 leading-relaxed"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 border-t border-slate-200 pt-4">
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
              <div key={e.name} className="space-y-1">
                <p className="text-xs font-bold text-slate-900">{e.name}</p>
                <BilingualBlock
                  text={e.desc}
                  frClassName="text-xs text-slate-600"
                  arClassName="text-xs text-slate-700"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {slide.kind === "closing" && (
        <div className="rounded-2xl bg-[#0B1220] px-7 py-10 sm:px-12 sm:py-12 text-center text-white space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">
            Province de Mediouna · Centre de Digitalisation · إقليم مديونة · مركز الرقمنة
          </p>
          <blockquote
            dir="ltr"
            lang="fr"
            className="mx-auto max-w-3xl font-display text-2xl sm:text-4xl font-bold leading-snug text-[#FAF8F4]"
          >
            « Ne soyez pas seulement utilisateurs du numérique. Devenez créateurs de solutions pédagogiques. »
          </blockquote>
          <blockquote
            dir="rtl"
            lang="ar"
            className="font-arabic mx-auto max-w-3xl text-xl sm:text-3xl font-bold leading-relaxed text-teal-300"
          >
            « لا تكونوا مجرد مستعملين للتكنولوجيا الرقمية، بل كونوا صانعي حلول بيداغوجية. »
          </blockquote>
          <BilingualBlock
            text={{
              fr: "Identifier un problème → Écrire une spécification claire → Prototyper avec l'IA → Tester en classe → Améliorer → Partager dans la Galerie Collaborative de Mediouna.",
              ar: "تحديد الإشكال ← صياغة توصيف واضح ← بناء نموذج أولي ← التجريب في القسم ← التحسين ← التقاسم في المعرض التعاوني لمديونة.",
            }}
            className="mx-auto max-w-2xl border-t border-slate-800 pt-5"
            frClassName="text-sm text-slate-300"
            arClassName="text-sm text-teal-200"
          />
        </div>
      )}

      {/* Interactive Activity Mounts */}
      {slide.kind === "poll" && slide.activityKey && (
        <LivePollWidget
          activityKey={slide.activityKey}
          status={activityStatus}
          showResults={showResults}
          isPaused={isPaused}
          aggregate={aggregate}
          myResponses={myResponses}
          canSubmit={canSubmit}
          large={isProjector}
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
          large={isProjector}
          onSubmitted={onSubmitted}
        />
      )}

      {slide.kind === "use-cases" && <UseCaseExplorer large={isProjector} />}

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

      {slide.kind === "live-demo" && <DemoQuizApp large={isProjector} />}

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

      {/* Bilingual French + Moroccan Darija Pedagogical Note */}
      <DarijaCallout
        title={slide.darijaNote.title}
        fr={slide.darijaNote.fr}
        arabic={slide.darijaNote.arabic}
        large={isProjector}
      />
    </div>
  );

  return (
    <motion.article
      key={slide.id}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: "easeOut" }}
      className={`rounded-2xl bg-[#FAF8F4] text-[#0F172A] shadow-lg ${
        isProjector ? "p-7 sm:p-10" : "p-5 sm:p-8"
      }`}
    >
      {slideBody}
    </motion.article>
  );
}
