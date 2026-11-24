"use client";

import React from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Cpu,
  Laptop,
  Layers,
  ShieldCheck,
  Users,
} from "lucide-react";
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
  onSubmitted?: () => void;
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

  return (
    <motion.div
      key={slide.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Editorial Bilingual Slide Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-[#F8F6F1] p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-white">
              <BilingualInline text={slide.sectionTitle} />
            </span>
            <span className="rounded-full bg-teal-600/10 px-3 py-1 text-xs font-bold text-teal-800">
              <BilingualInline text={slide.timeRange} />
            </span>
          </div>
          {slide.techTerms.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {slide.techTerms.map((t) => (
                <span
                  key={t.term}
                  title={`${t.explanation.fr} | ${t.explanation.ar}`}
                  className="rounded-lg border border-cyan-300/60 bg-cyan-50 px-2.5 py-0.5 text-[11px] font-bold text-cyan-900"
                >
                  {t.term}
                </span>
              ))}
            </div>
          )}
        </div>

        <BilingualBlock
          text={slide.title}
          frClassName={`font-display font-bold tracking-tight text-navy-900 ${
            isProjector
              ? "text-3xl sm:text-5xl leading-tight"
              : "text-2xl sm:text-3xl leading-snug"
          }`}
          arClassName={`font-bold text-teal-900 ${
            isProjector ? "text-xl sm:text-3xl leading-snug" : "text-lg sm:text-xl leading-snug"
          }`}
        />

        <BilingualBlock
          text={slide.subtitle}
          frClassName={`text-slate-600 ${isProjector ? "text-lg sm:text-xl" : "text-sm sm:text-base"}`}
          arClassName={`text-slate-700 ${isProjector ? "text-base sm:text-lg" : "text-xs sm:text-sm"}`}
        />

        {slide.keyPoints.length > 0 && (
          <ul
            className={`grid gap-2.5 ${
              isProjector ? "sm:grid-cols-2 text-base" : "sm:grid-cols-2 text-xs sm:text-sm"
            }`}
          >
            {slide.keyPoints.map((pt) => (
              <li
                key={pt.fr}
                className="flex items-start gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-slate-800"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                <BilingualBlock
                  text={pt}
                  className="flex-1"
                  frClassName="font-medium text-slate-900"
                  arClassName="text-teal-900"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Specialized Slide Visuals & Functional Interactive Body */}
      {slide.kind === "welcome" && (
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
              <Users className="h-4 w-4 shrink-0" />
              <BilingualInline
                text={{
                  fr: "Atelier Provincial · Province de Mediouna",
                  ar: "الورشة الإقليمية · إقليم مديونة",
                }}
              />
            </div>

            <BilingualBlock
              text={{
                fr: "Rencontre d'échange entre collègues du primaire",
                ar: "لقاء تقاسم الخبرات بين أستاذات وأساتذة الابتدائي",
              }}
              frClassName={`font-display font-bold text-navy-900 ${isProjector ? "text-3xl" : "text-xl"}`}
              arClassName={`font-bold text-teal-900 ${isProjector ? "text-2xl" : "text-lg"}`}
            />

            <BilingualBlock
              text={{
                fr: "Organisée en collaboration avec le Centre de Digitalisation : partage de pratiques concrètes d'IA générative, de Prompt Engineering et de création de mini-applications pédagogiques pour vos classes (1AEP–6AEP).",
                ar: "بتنسيق مع مركز الرقمنة: تقاسم ممارسات عملية في الذكاء الاصطناعي التوليدي، وهندسة التوجيهات، وبناء تطبيقات تعليمية مصغرة لأقسامنا (1AEP–6AEP).",
              }}
              frClassName={isProjector ? "text-lg text-slate-700" : "text-sm text-slate-600"}
              arClassName={isProjector ? "text-base text-slate-700" : "text-sm text-slate-700"}
            />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
                <BilingualBlock
                  text={{ fr: "Collègues connectés", ar: "الزملاء المتصلون" }}
                  frClassName="text-xs font-semibold text-teal-800"
                  arClassName="text-xs font-semibold text-teal-900"
                />
                <p className="mt-1 font-display text-3xl font-bold text-navy-900">
                  {connectedCount}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-ivory-50 p-4">
                <BilingualBlock
                  text={{ fr: "Inscrits session", ar: "المسجلون في الجلسة" }}
                  frClassName="text-xs font-semibold text-slate-600"
                  arClassName="text-xs font-semibold text-slate-700"
                />
                <p className="mt-1 font-display text-3xl font-bold text-navy-900">
                  {totalParticipants}
                </p>
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
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500">
              <BilingualInline text={{ fr: "Hier · Usage passif", ar: "بالأمس · استعمال سلبي" }} />
            </span>
            <BilingualBlock
              text={{
                fr: "Consommateur d'outils génériques",
                ar: "مجرد مستهلك لأدوات جاهزة وعامة",
              }}
              frClassName="text-lg font-bold text-slate-900"
              arClassName="text-base font-bold text-slate-800"
            />
            <BilingualBlock
              text={{
                fr: "Chercher des fiches toutes faites pensées pour d'autres pays, souvent déconnectées de vos effectifs, de l'arabe RTL ou des contraintes matérielles de l'école.",
                ar: "البحث عن جذاذات جاهزة مصممة لسياقات أخرى، بعيدة غالباً عن واقع أقسامنا واللغة العربية وإكراهات التجهيز.",
              }}
              frClassName="text-sm text-slate-600"
              arClassName="text-sm text-slate-700"
            />
          </div>

          <div className="rounded-2xl border-2 border-teal-500 bg-teal-50/50 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase text-teal-700">
              <BilingualInline
                text={{ fr: "Aujourd'hui · Pouvoir d'agir", ar: "اليوم · المبادرة والإبداع" }}
              />
            </span>
            <BilingualBlock
              text={{
                fr: "Créateur de solutions pédagogiques",
                ar: "مبدع(ة) لحلول بيداغوجية ملائمة",
              }}
              frClassName="text-lg font-bold text-navy-900"
              arClassName="text-base font-bold text-teal-900"
            />
            <BilingualBlock
              text={{
                fr: "Partir d'un besoin réel de votre classe à Mediouna, rédiger un cahier des charges clair, générer un outil léger (projetable, hors ligne ou imprimable) et le partager entre collègues.",
                ar: "الانطلاق من حاجة حقيقية في قسمكم بمديونة، وصياغة توصيف واضح لإنتاج أداة خفيفة (للعرض أو الطباعة أو بدون إنترنت) وتقاسمها مع الزملاء.",
              }}
              frClassName="text-sm text-slate-700"
              arClassName="text-sm text-slate-800"
            />
          </div>
        </div>
      )}

      {slide.kind === "concepts" && (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              icon: Cpu,
              title: { fr: "AI", ar: "الذكاء الاصطناعي" },
              desc: {
                fr: "Systèmes capables d'exécuter des tâches associées à l'intelligence humaine.",
                ar: "أنظمة تنجز مهام مرتبطة بالذكاء البشري.",
              },
            },
            {
              icon: Layers,
              title: { fr: "Generative AI", ar: "الذكاء الاصطناعي التوليدي" },
              desc: {
                fr: "IA qui crée du nouveau contenu : textes, exercices, résumés ou code.",
                ar: "ينتج محتوى جديداً: نصوصاً، تمارين، ملخصات أو برمجة.",
              },
            },
            {
              icon: BookOpenCheck,
              title: { fr: "LLM", ar: "النموذج اللغوي الكبير" },
              desc: {
                fr: "Modèle statistique qui prédit les mots les plus probables selon votre contexte.",
                ar: "نموذج إحصائي يتنبأ بالكلمات الأكثر احتمالاً حسب السياق.",
              },
            },
            {
              icon: ArrowRight,
              title: { fr: "Prompt", ar: "التوجيه (Prompt)" },
              desc: {
                fr: "Votre consigne structurée (niveau, objectif, format, contraintes).",
                ar: "تعليمتكم المنظمة (المستوى، الهدف، الصيغة، الشروط).",
              },
            },
            {
              icon: AlertTriangle,
              title: { fr: "Hallucination", ar: "الهلوسة المعرفية" },
              desc: {
                fr: "Erreur affirmée avec assurance : l'enseignant relit et valide toujours.",
                ar: "خطأ يُقدَّم بثقة كبيرة: لذا يراجع الأستاذ(ة) ويعتمد دائماً.",
              },
            },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title.fr} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1.5">
                <Icon className="h-5 w-5 text-teal-600" />
                <BilingualBlock
                  text={c.title}
                  frClassName="font-bold text-navy-900"
                  arClassName="text-xs font-bold text-teal-800"
                />
                <BilingualBlock
                  text={c.desc}
                  frClassName="text-xs leading-relaxed text-slate-600"
                  arClassName="text-xs leading-relaxed text-slate-700"
                />
              </div>
            );
          })}
        </div>
      )}

      {slide.kind === "pillars" && (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: { fr: "1. Hallucinations", ar: "1. الهلوسات" },
              desc: {
                fr: "Vérifier dates, faits scientifiques, calculs et voyellation arabe.",
                ar: "التحقق من التواريخ والوقائع العلمية والحسابات والشكل التام.",
              },
            },
            {
              title: { fr: "2. Vérification", ar: "2. المراجعة والتحقق" },
              desc: {
                fr: "Relire tout brouillon avant impression ou projection devant la classe.",
                ar: "قراءة كل مسودة وتعديلها قبل الطباعة أو العرض أمام التلاميذ.",
              },
            },
            {
              title: { fr: "3. Adaptation à l'âge", ar: "3. الملاءمة للسن" },
              desc: {
                fr: "Ajuster le vocabulaire aux réalités des élèves de 1AEP à 6AEP.",
                ar: "ضبط المعجم حسب مستوى تلاميذ الأول إلى السادس ابتدائي.",
              },
            },
            {
              title: { fr: "4. Biais culturels", ar: "4. التحيز الثقافي" },
              desc: {
                fr: "Remplacer les exemples éloignés par un vécu local respectueux.",
                ar: "تعويض الأمثلة البعيدة بوضعيات من المحيط المغربي المحترم.",
              },
            },
            {
              title: { fr: "5. Confidentialité", ar: "5. حماية الخصوصية" },
              desc: {
                fr: "Zéro nom d'élève, zéro code Massar, zéro donnée personnelle saisie.",
                ar: "صفر اسم تلميذ، صفر رمز مسار، وصفر معطى شخصي.",
              },
            },
            {
              title: { fr: "6. Responsabilité", ar: "6. المسؤولية التربوية" },
              desc: {
                fr: "L'IA assiste ; le jugement pédagogique reste 100 % humain.",
                ar: "الذكاء الاصطناعي مساعد فقط؛ والحكم البيداغوجي يظل إنسانياً 100%.",
              },
            },
          ].map((p) => (
            <div key={p.title.fr} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1.5">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                <BilingualBlock
                  text={p.title}
                  frClassName="text-sm font-bold text-navy-900"
                  arClassName="text-xs font-bold text-teal-800"
                />
              </div>
              <BilingualBlock
                text={p.desc}
                frClassName="text-xs text-slate-600"
                arClassName="text-xs text-slate-700"
              />
            </div>
          ))}
        </div>
      )}

      {slide.kind === "prompt-anatomy" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 space-y-3">
            <BilingualBlock
              text={WEAK_VS_STRONG_PROMPT.weak.label}
              frClassName="text-xs font-bold uppercase text-amber-800"
              arClassName="text-xs font-bold text-amber-900"
            />
            <div className="rounded-xl bg-white p-3 border border-amber-200 space-y-1.5">
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

          <div className="rounded-2xl border border-teal-300 bg-white p-5 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <BilingualBlock
                text={WEAK_VS_STRONG_PROMPT.strong.label}
                frClassName="text-xs font-bold uppercase text-teal-800"
                arClassName="text-xs font-bold text-teal-900"
              />
              <div className="flex gap-1.5">
                <CopyPromptButton text={WEAK_VS_STRONG_PROMPT.strong.promptFr} label="Copier FR" labelAr="نسخ FR" />
                <CopyPromptButton text={WEAK_VS_STRONG_PROMPT.strong.promptAr} label="Copier AR" labelAr="نسخ AR" />
              </div>
            </div>
            <pre dir="ltr" className="whitespace-pre-wrap rounded-xl bg-[#0B1426] p-3 font-mono-code text-[11px] leading-relaxed text-slate-100">
              {WEAK_VS_STRONG_PROMPT.strong.promptFr}
            </pre>
            <pre dir="rtl" lang="ar" className="whitespace-pre-wrap rounded-xl bg-teal-50 p-3 font-arabic text-xs leading-relaxed text-slate-900 border border-teal-200">
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
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { fr: "1. Idée brute", ar: "1. فكرة أولية" },
              { fr: "2. Identifier les manques", ar: "2. تحديد النواقص" },
              { fr: "3. Questions de l'IA", ar: "3. أسئلة توضيحية" },
              { fr: "4. Prompt optimisé", ar: "4. توجيه محسّن" },
              { fr: "5. Exécution", ar: "5. التنفيذ" },
              { fr: "6. Validation humaine", ar: "6. المراجعة والاعتماد" },
            ].map((step) => (
              <div
                key={step.fr}
                className="rounded-xl border border-teal-200 bg-white px-3 py-2.5 text-center text-xs font-bold text-navy-900 shadow-xs"
              >
                <BilingualBlock
                  text={step}
                  frClassName="text-xs font-bold"
                  arClassName="text-[11px] font-bold text-teal-800"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <BilingualBlock
                  text={META_PROMPT_EXAMPLES.fr.title}
                  frClassName="text-xs font-bold text-slate-900"
                  arClassName="text-xs font-bold text-teal-800"
                />
                <CopyPromptButton text={META_PROMPT_EXAMPLES.fr.metaPrompt} label="Copier FR" labelAr="نسخ FR" />
              </div>
              <pre dir="ltr" className="whitespace-pre-wrap rounded-xl bg-[#0B1426] p-3 font-mono-code text-[11px] text-slate-100">
                {META_PROMPT_EXAMPLES.fr.metaPrompt}
              </pre>
            </div>

            <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 shadow-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <BilingualBlock
                  text={META_PROMPT_EXAMPLES.ar.title}
                  frClassName="text-xs font-bold text-slate-900"
                  arClassName="text-xs font-bold text-teal-900"
                />
                <CopyPromptButton text={META_PROMPT_EXAMPLES.ar.metaPrompt} label="Copier AR" labelAr="نسخ AR" />
              </div>
              <pre
                dir="rtl"
                lang="ar"
                className="whitespace-pre-wrap rounded-xl bg-white p-3 font-arabic text-xs text-slate-900 border border-teal-200"
              >
                {META_PROMPT_EXAMPLES.ar.metaPrompt}
              </pre>
            </div>
          </div>
        </div>
      )}

      {slide.kind === "ecosystem" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: { fr: "Étape 1", ar: "المرحلة 1" },
                title: { fr: "Générer du contenu", ar: "إنتاج محتوى تربوي" },
                desc: {
                  fr: "Produire un texte, des questions ou 3 niveaux d'exercices (brouillon).",
                  ar: "توليد نص أو أسئلة أو 3 مستويات تمارين (مسودة).",
                },
              },
              {
                step: { fr: "Étape 2", ar: "المرحلة 2" },
                title: { fr: "Créer une application", ar: "إنشاء تطبيق تفاعلي" },
                desc: {
                  fr: "Transformer ce besoin en interface interactive (HTML/CSS/JS).",
                  ar: "تحويل الحاجة إلى واجهة تفاعلية بـ HTML/CSS/JS.",
                },
              },
              {
                step: { fr: "Étape 3", ar: "المرحلة 3" },
                title: { fr: "Utiliser en vraie classe", ar: "الاستعمال الفعلي في القسم" },
                desc: {
                  fr: "Projeter, partager sur tablette ou imprimer en A4 avec vos élèves.",
                  ar: "العرض بالمسلاط أو اللوحة المشتركة أو الطباعة A4.",
                },
              },
              {
                step: { fr: "Étape 4", ar: "المرحلة 4" },
                title: { fr: "Évaluer l'impact réel", ar: "تقويم الأثر التعلمي" },
                desc: {
                  fr: "Observer si l'outil aide véritablement les élèves à progresser.",
                  ar: "التحقق مما إذا كانت الأداة تساعد التلاميذ فعلاً على التقدم.",
                },
              },
            ].map((s) => (
              <div key={s.step.fr} className="rounded-2xl border border-teal-200 bg-white p-4 shadow-xs space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-teal-700">
                  <BilingualInline text={s.step} />
                </span>
                <BilingualBlock
                  text={s.title}
                  frClassName="text-sm font-bold text-navy-900"
                  arClassName="text-xs font-bold text-teal-900"
                />
                <BilingualBlock
                  text={s.desc}
                  frClassName="text-xs text-slate-600"
                  arClassName="text-xs text-slate-700"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                name: "ChatGPT",
                desc: {
                  fr: "Assistant conversationnel pour rédiger brouillons, idées et premiers codes.",
                  ar: "مساعد حواري لصياغة المسودات والأفكار والشيفرات الأولية.",
                },
              },
              {
                name: "Google Antigravity",
                desc: {
                  fr: "Environnement de création d'applications structurées, testées et fiables.",
                  ar: "بيئة هندسية لبناء تطبيقات منظمة ومختبرة وموثوقة.",
                },
              },
              {
                name: "Browser Web App",
                desc: {
                  fr: "Outil ouvert directement dans Chrome/Edge/Safari sans installation.",
                  ar: "تطبيق يُفتح مباشرة في المتصفح دون تثبيت.",
                },
              },
              {
                name: "Prototype",
                desc: {
                  fr: "Première version testable en classe en 25 minutes pour valider l'idée.",
                  ar: "نسخة أولية قابلة للتجريب في القسم خلال 25 دقيقة.",
                },
              },
              {
                name: "Deployed App",
                desc: {
                  fr: "Application en ligne (ex. Vercel) partageable avec tout Mediouna par lien/QR.",
                  ar: "تطبيق منشور على الإنترنت قابل للمشاركة بالرابط أو رمز QR.",
                },
              },
            ].map((e) => (
              <div key={e.name} className="rounded-xl border border-slate-200 bg-ivory-50 p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-navy-900">
                  <Laptop className="h-3.5 w-3.5 text-cyan-600" />
                  <span>{e.name}</span>
                </div>
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
        <div className="rounded-3xl border border-teal-400/40 bg-navy-900 p-7 sm:p-10 text-center text-white shadow-lg space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
            Province de Mediouna · Centre de Digitalisation · إقليم مديونة · مركز الرقمنة
          </p>
          <blockquote dir="ltr" lang="fr" className="mx-auto max-w-3xl font-display text-2xl sm:text-4xl font-bold leading-snug text-ivory-50">
            « Ne soyez pas seulement utilisateurs du numérique. Devenez créateurs de solutions pédagogiques. »
          </blockquote>
          <blockquote dir="rtl" lang="ar" className="font-arabic mx-auto max-w-3xl text-xl sm:text-3xl font-bold leading-relaxed text-cyan-200">
            « لا تكونوا مجرد مستعملين للتكنولوجيا الرقمية، بل كونوا صانعي حلول بيداغوجية. »
          </blockquote>
          <BilingualBlock
            text={{
              fr: "Identifier un problème → Écrire une spécification claire → Prototyper avec l'IA → Tester en classe → Améliorer → Partager dans la Galerie Collaborative de Mediouna.",
              ar: "تحديد الإشكال ← صياغة توصيف واضح ← بناء نموذج أولي ← التجريب في القسم ← التحسين ← التقاسم في المعرض التعاوني لمديونة.",
            }}
            className="mx-auto max-w-2xl"
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
    </motion.div>
  );
}
