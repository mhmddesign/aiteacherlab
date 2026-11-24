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
      {/* Editorial Slide Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-[#F8F6F1] p-5 sm:p-7 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-white">
              {slide.sectionTitle}
            </span>
            <span className="rounded-full bg-teal-600/10 px-3 py-1 text-xs font-bold text-teal-800">
              {slide.timeRange}
            </span>
          </div>
          {slide.techTerms.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {slide.techTerms.map((t) => (
                <span
                  key={t.term}
                  title={t.explanation}
                  className="rounded-lg border border-cyan-300/60 bg-cyan-50 px-2.5 py-0.5 text-[11px] font-bold text-cyan-900"
                >
                  {t.term}
                </span>
              ))}
            </div>
          )}
        </div>

        <h2
          className={`font-display font-bold tracking-tight text-navy-900 ${
            isProjector
              ? "text-3xl sm:text-5xl leading-tight"
              : "text-2xl sm:text-3xl leading-snug"
          }`}
        >
          {slide.title}
        </h2>
        <p
          className={`mt-2 text-slate-600 ${
            isProjector ? "text-lg sm:text-2xl" : "text-sm sm:text-base"
          }`}
        >
          {slide.subtitle}
        </p>

        {/* Key Points */}
        {slide.keyPoints.length > 0 && (
          <ul
            className={`mt-4 grid gap-2 ${
              isProjector ? "sm:grid-cols-2 text-base sm:text-lg" : "sm:grid-cols-2 text-xs sm:text-sm"
            }`}
          >
            {slide.keyPoints.map((pt) => (
              <li
                key={pt}
                className="flex items-start gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-slate-800"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                <span>{pt}</span>
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
              <Users className="h-4 w-4" />
              <span>Atelier Provincial · Province de Mediouna</span>
            </div>
            <h3 className={`font-display font-bold text-navy-900 ${isProjector ? "text-3xl" : "text-xl"}`}>
              Rencontre d&apos;échange entre collègues du primaire
            </h3>
            <p className={isProjector ? "text-lg text-slate-700" : "text-sm text-slate-600"}>
              Organisée en collaboration avec le <strong>Centre de Digitalisation</strong> : partage
              de pratiques concrètes d&apos;IA générative, de Prompt Engineering et de création de
              mini-applications pédagogiques pour vos classes (1AEP–6AEP).
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
                <p className="text-xs font-semibold text-teal-800">Collègues connectés</p>
                <p className="mt-1 font-display text-3xl font-bold text-navy-900">
                  {connectedCount}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-ivory-50 p-4">
                <p className="text-xs font-semibold text-slate-600">Inscrits session</p>
                <p className="mt-1 font-display text-3xl font-bold text-navy-900">
                  {totalParticipants}
                </p>
              </div>
            </div>
          </div>

          {(showQrOverlay || mode !== "participant") && (
            <div className="lg:col-span-5">
              <QrJoinPanel size={isProjector ? 210 : 160} showPinHint={joinPinHint} />
            </div>
          )}
        </div>
      )}

      {slide.kind === "vision" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase text-slate-500">Hier · Usage passif</span>
            <h4 className="mt-1 text-lg font-bold text-slate-900">Consommateur d&apos;outils génériques</h4>
            <p className="mt-2 text-sm text-slate-600">
              Chercher des fiches toutes faites pensées pour d&apos;autres pays, souvent déconnectées
              de vos effectifs, de l&apos;arabe RTL ou des contraintes matérielles de l&apos;école.
            </p>
          </div>
          <div className="rounded-2xl border-2 border-teal-500 bg-teal-50/50 p-5 shadow-xs">
            <span className="text-xs font-bold uppercase text-teal-700">Aujourd&apos;hui · Pouvoir d&apos;agir</span>
            <h4 className="mt-1 text-lg font-bold text-navy-900">Créateur de solutions pédagogiques</h4>
            <p className="mt-2 text-sm text-slate-700">
              Partir d&apos;un besoin réel de votre classe à Mediouna, rédiger un cahier des charges clair,
              générer un outil léger (projetable, hors ligne ou imprimable) et le partager entre collègues.
            </p>
          </div>
        </div>
      )}

      {slide.kind === "concepts" && (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: Cpu, title: "AI", desc: "Systèmes capables d'exécuter des tâches associées à l'intelligence humaine." },
            { icon: Layers, title: "Generative AI", desc: "IA qui crée du nouveau contenu : textes, exercices, résumés ou code." },
            { icon: BookOpenCheck, title: "LLM", desc: "Modèle statistique qui prédit les mots les plus probables selon votre contexte." },
            { icon: ArrowRight, title: "Prompt", desc: "Votre consigne structurée (niveau, objectif, format, contraintes)." },
            { icon: AlertTriangle, title: "Hallucination", desc: "Erreur affirmée avec assurance : l'enseignant relit et valide toujours." },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <Icon className="h-5 w-5 text-teal-600" />
                <h4 className="mt-2 font-bold text-navy-900">{c.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{c.desc}</p>
              </div>
            );
          })}
        </div>
      )}

      {slide.kind === "pillars" && (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "1. Hallucinations", desc: "Vérifier dates, faits scientifiques, calculs et voyellation arabe." },
            { title: "2. Vérification", desc: "Relire tout brouillon avant impression ou projection devant la classe." },
            { title: "3. Adaptation à l'âge", desc: "Ajuster le vocabulaire aux réalités des élèves de 1AEP à 6AEP." },
            { title: "4. Biais culturels", desc: "Remplacer les exemples éloignés par un vécu local respectueux." },
            { title: "5. Confidentialité", desc: "Zéro nom d'élève, zéro code Massar, zéro donnée personnelle saisie." },
            { title: "6. Responsabilité", desc: "L'IA assiste ; le jugement pédagogique reste 100 % humain." },
          ].map((p) => (
            <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <h4 className="text-sm font-bold text-navy-900">{p.title}</h4>
              </div>
              <p className="mt-1.5 text-xs text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>
      )}

      {slide.kind === "prompt-anatomy" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
            <span className="text-xs font-bold uppercase text-amber-800">
              {WEAK_VS_STRONG_PROMPT.weak.label}
            </span>
            <p className="mt-2 rounded-xl bg-white p-3 font-mono-code text-xs text-slate-800 border border-amber-200">
              « {WEAK_VS_STRONG_PROMPT.weak.prompt} »
            </p>
            <ul className="mt-3 space-y-1 text-xs text-amber-950">
              {WEAK_VS_STRONG_PROMPT.weak.issues.map((i) => (
                <li key={i}>• {i}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-teal-300 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase text-teal-800">
                {WEAK_VS_STRONG_PROMPT.strong.label}
              </span>
              <CopyPromptButton text={WEAK_VS_STRONG_PROMPT.strong.prompt} label="Copier" />
            </div>
            <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-[#0B1426] p-3 font-mono-code text-[11px] leading-relaxed text-slate-100">
              {WEAK_VS_STRONG_PROMPT.strong.prompt}
            </pre>
            <ul className="mt-3 space-y-1 text-xs text-teal-900">
              {WEAK_VS_STRONG_PROMPT.strong.strengths.map((s) => (
                <li key={s}>✓ {s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {slide.kind === "meta-prompt-flow" && (
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {[
              "1. Idée brute",
              "2. Identifier les manques",
              "3. Questions de l'IA",
              "4. Prompt optimisé",
              "5. Exécution",
              "6. Validation humaine",
            ].map((step) => (
              <div
                key={step}
                className="rounded-xl border border-teal-200 bg-white px-3 py-2.5 text-center text-xs font-bold text-navy-900 shadow-xs"
              >
                {step}
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">
                  {META_PROMPT_EXAMPLES.fr.title}
                </h4>
                <CopyPromptButton text={META_PROMPT_EXAMPLES.fr.metaPrompt} label="Copier FR" />
              </div>
              <pre className="whitespace-pre-wrap rounded-xl bg-[#0B1426] p-3 font-mono-code text-[11px] text-slate-100">
                {META_PROMPT_EXAMPLES.fr.metaPrompt}
              </pre>
            </div>

            <div
              dir="rtl"
              lang="ar"
              className="font-arabic rounded-2xl border border-teal-200 bg-teal-50/50 p-4 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-teal-900">
                  {META_PROMPT_EXAMPLES.ar.title}
                </h4>
                <div dir="ltr">
                  <CopyPromptButton text={META_PROMPT_EXAMPLES.ar.metaPrompt} label="Copier AR" />
                </div>
              </div>
              <pre className="whitespace-pre-wrap rounded-xl bg-white p-3 font-arabic text-xs text-slate-900 border border-teal-200">
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
              { step: "Étape 1", title: "Générer du contenu", desc: "Produire un texte, des questions ou 3 niveaux d'exercices (brouillon)." },
              { step: "Étape 2", title: "Créer une application", desc: "Transformer ce besoin en interface interactive (HTML/CSS/JS)." },
              { step: "Étape 3", title: "Utiliser en vraie classe", desc: "Projeter, partager sur tablette ou imprimer en A4 avec vos élèves." },
              { step: "Étape 4", title: "Évaluer l'impact réel", desc: "Observer si l'outil aide véritablement les élèves à progresser." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-teal-200 bg-white p-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-teal-700">{s.step}</span>
                <h4 className="mt-1 text-sm font-bold text-navy-900">{s.title}</h4>
                <p className="mt-1 text-xs text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: "ChatGPT", role: "Assistant conversationnel pour rédiger brouillons, idées et premiers codes." },
              { name: "Google Antigravity", role: "Environnement de création d'applications structurées, testées et fiables." },
              { name: "Browser Web App", role: "Outil ouvert directement dans Chrome/Edge/Safari sans installation." },
              { name: "Prototype", role: "Première version testable en classe en 25 minutes pour valider l'idée." },
              { name: "Deployed App", role: "Application en ligne (ex. Vercel) partageable avec tout Mediouna par lien/QR." },
            ].map((e) => (
              <div key={e.name} className="rounded-xl border border-slate-200 bg-ivory-50 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-navy-900">
                  <Laptop className="h-3.5 w-3.5 text-cyan-600" />
                  <span>{e.name}</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{e.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {slide.kind === "closing" && (
        <div className="rounded-3xl border border-teal-400/40 bg-navy-900 p-7 sm:p-10 text-center text-white shadow-lg space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
            Province de Mediouna · Centre de Digitalisation
          </p>
          <blockquote className="mx-auto max-w-3xl font-display text-2xl sm:text-4xl font-bold leading-snug text-ivory-50">
            « Ne soyez pas seulement utilisateurs du numérique. Devenez créateurs de solutions pédagogiques. »
          </blockquote>
          <p className="mx-auto max-w-2xl text-sm text-slate-300">
            Identifier un problème → Écrire une spécification claire → Prototyper avec l&apos;IA →
            Tester en classe → Améliorer → Partager dans la Galerie Collaborative de Mediouna.
          </p>
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

      {/* Moroccan Darija Pedagogical Note */}
      <DarijaCallout
        title={slide.darijaNote.title}
        arabic={slide.darijaNote.arabic}
        large={isProjector}
      />
    </motion.div>
  );
}
