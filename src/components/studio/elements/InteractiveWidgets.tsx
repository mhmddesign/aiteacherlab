"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  Send,
  Users,
} from "lucide-react";
import type { SlideElement } from "@/lib/studio/document-schema";

export interface StudioElementLiveAggregate {
  elementId: string;
  total: number;
  counts?: Record<string, number>;
  entries?: Array<{
    id: string;
    participantName: string;
    text?: string;
    optionId?: string;
    submittedAt: string;
  }>;
}

interface InteractiveWidgetProps {
  element: SlideElement;
  mode: "editor" | "projector" | "presenter" | "participant" | "export";
  interactive: boolean;
  showResults?: boolean;
  aggregate?: StudioElementLiveAggregate | null;
  myOptionId?: string | null;
  myText?: string | null;
  onSubmitLive?: (
    elementId: string,
    payload: { optionId?: string; text?: string; activityType: string }
  ) => Promise<void> | void;
}

interface OptionDef {
  id: string;
  fr: string;
  ar: string;
}

export function InteractiveWidgetView({
  element,
  mode,
  interactive,
  showResults = true,
  aggregate,
  myOptionId,
  myText,
  onSubmitLive,
}: InteractiveWidgetProps) {
  const cfg = element.config ?? {};
  const promptFr = element.bilingual?.fr ?? "";
  const promptAr = element.bilingual?.ar ?? "";
  const isPrint = mode === "export";

  const [selectedOption, setSelectedOption] = useState<string>(myOptionId ?? "");
  const [textDraft, setTextDraft] = useState<string>(myText ?? "");
  const [submittedNote, setSubmittedNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Flashcards state
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Reveal card state
  const [revealed, setRevealed] = useState(false);

  // Countdown timer state
  const initialSec = Math.max(10, Math.min(3600, Number(cfg.initialSeconds ?? 300)));
  const [secondsLeft, setSecondsLeft] = useState(initialSec);
  const [running, setRunning] = useState(false);

  // Matching / ordering local interactive state
  const rawOrderItems = Array.isArray(cfg.items)
    ? (cfg.items as Array<{ id?: string; fr?: string; ar?: string }>)
    : [];
  const [orderItems, setOrderItems] = useState(rawOrderItems);
  const [selectedLeftIdx, setSelectedLeftIdx] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const counts = aggregate?.counts ?? {};
  const total = aggregate?.total ?? 0;

  async function handleOptionPick(optionId: string, activityType: string) {
    if (!interactive || isPrint) return;
    setSelectedOption(optionId);
    setSubmittedNote(null);
    if (onSubmitLive) {
      setBusy(true);
      try {
        await onSubmitLive(element.id, { optionId, activityType });
        setSubmittedNote("Enregistré · تم التسجيل");
      } finally {
        setBusy(false);
      }
    } else {
      setSubmittedNote("Aperçu enregistré · تم الحفظ للمعاينة");
    }
  }

  async function handleTextSend(activityType: string) {
    if (!interactive || isPrint || !textDraft.trim()) return;
    setSubmittedNote(null);
    if (onSubmitLive) {
      setBusy(true);
      try {
        await onSubmitLive(element.id, { text: textDraft.trim(), activityType });
        setSubmittedNote("Envoyé · تم الإرسال");
        setTextDraft("");
      } finally {
        setBusy(false);
      }
    } else {
      setSubmittedNote("Aperçu enregistré · تم الحفظ للمعاينة");
    }
  }

  const promptHeader = (
    <div className="space-y-1 border-b border-slate-200 pb-3 mb-3">
      <p className="font-display font-bold text-[28px] leading-tight text-[#0B1220]">{promptFr}</p>
      <p dir="rtl" lang="ar" className="font-arabic font-bold text-[26px] leading-snug text-teal-800">
        {promptAr}
      </p>
    </div>
  );

  if (element.type === "live-poll" || element.type === "mcq-quiz" || element.type === "tf-quiz") {
    const options = Array.isArray(cfg.options) ? (cfg.options as OptionDef[]) : [];
    const correctOptionId = typeof cfg.correctOptionId === "string" ? cfg.correctOptionId : undefined;
    const isQuiz = element.type !== "live-poll";
    const actType = element.type === "live-poll" ? "poll" : element.type === "tf-quiz" ? "tf_quiz" : "mcq_quiz";

    return (
      <div className="h-full w-full flex flex-col justify-between" data-interactive-type={element.type}>
        {promptHeader}
        <div className="space-y-2.5 flex-1 overflow-hidden">
          {options.map((opt) => {
            const count = counts[opt.id] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isPicked = selectedOption === opt.id;
            const isCorrect = Boolean(isQuiz && showResults && correctOptionId === opt.id);

            return (
              <button
                key={opt.id}
                type="button"
                disabled={!interactive || isPrint || busy}
                onClick={() => handleOptionPick(opt.id, actType)}
                className={`relative w-full overflow-hidden rounded-xl border-2 px-4 py-3 text-left transition ${
                  isCorrect
                    ? "border-emerald-600 bg-emerald-50"
                    : isPicked
                      ? "border-teal-700 bg-teal-50"
                      : "border-slate-200 bg-[#FAF8F4] hover:border-teal-600/60"
                }`}
              >
                {showResults && total > 0 && (
                  <div
                    className="absolute inset-y-0 left-0 bg-teal-600/12 pointer-events-none"
                    style={{ width: `${pct}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[22px] font-semibold text-[#0B1220]">{opt.fr}</p>
                    <p dir="rtl" lang="ar" className="font-arabic text-[22px] text-teal-900">
                      {opt.ar}
                    </p>
                  </div>
                  {showResults && (
                    <span className="shrink-0 font-mono text-[20px] font-bold text-teal-900">
                      {count} ({pct}%)
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-[16px]">
          <span className="font-semibold text-slate-600">
            Réponses · الإجابات : <strong>{total}</strong>
          </span>
          {submittedNote && <span className="font-bold text-teal-700">{submittedNote}</span>}
          {isQuiz && showResults && (cfg.explanationFr || cfg.explanationAr) ? (
            <div className="w-full rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-[16px] text-emerald-950 flex items-center justify-between gap-4">
              <span>{String(cfg.explanationFr ?? "")}</span>
              <span dir="rtl" lang="ar" className="font-arabic font-semibold">
                {String(cfg.explanationAr ?? "")}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (element.type === "short-answer" || element.type === "exit-ticket") {
    const entries = aggregate?.entries ?? [];
    const actType = element.type === "exit-ticket" ? "exit_ticket" : "short_answer";
    return (
      <div className="h-full w-full flex flex-col justify-between" data-interactive-type={element.type}>
        {promptHeader}
        {mode === "participant" || (interactive && !isPrint && entries.length === 0) ? (
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <textarea
              rows={3}
              value={textDraft}
              onChange={(e) => setTextDraft(e.target.value)}
              placeholder={`${String(cfg.placeholderFr ?? "Votre réponse...")} · ${String(cfg.placeholderAr ?? "إجابتكم...")}`}
              className="w-full rounded-xl border-2 border-slate-300 bg-white p-3 text-[20px] focus:border-teal-700 focus:outline-none"
            />
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={busy || !textDraft.trim()}
                onClick={() => handleTextSend(actType)}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-[18px] font-bold text-white disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>Envoyer · إرسال</span>
              </button>
              {submittedNote && <span className="text-[16px] font-bold text-teal-700">{submittedNote}</span>}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden space-y-2">
            {entries.length === 0 ? (
              <p className="text-[20px] text-slate-500 italic">
                En attente des réponses des participants… · في انتظار مشاركات القاعة...
              </p>
            ) : (
              entries.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-[#FAF8F4] px-4 py-2.5 flex items-center justify-between gap-4"
                >
                  <p className="text-[20px] text-[#0B1220] truncate">{item.text}</p>
                  <span className="shrink-0 rounded-full bg-teal-100 px-3 py-0.5 text-[14px] font-bold text-teal-900">
                    {item.participantName}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  if (element.type === "word-cloud") {
    const seedWords = Array.isArray(cfg.seedWords) ? cfg.seedWords.map(String) : [];
    const liveWords = (aggregate?.entries ?? []).map((e) => e.text ?? "").filter(Boolean);
    const freqMap = new Map<string, number>();
    seedWords.forEach((w) => freqMap.set(w, (freqMap.get(w) ?? 0) + 1));
    liveWords.forEach((w) => freqMap.set(w, (freqMap.get(w) ?? 0) + 2));

    const words = Array.from(freqMap.entries());
    return (
      <div className="h-full w-full flex flex-col justify-between" data-interactive-type="word-cloud">
        {promptHeader}
        <div className="flex flex-wrap items-center justify-center gap-3 flex-1 py-2">
          {words.map(([word, weight], idx) => (
            <span
              key={`${word}-${idx}`}
              style={{ fontSize: `${Math.min(44, 20 + weight * 6)}px` }}
              className={`rounded-full px-4 py-1.5 font-bold border ${
                idx % 2 === 0
                  ? "bg-teal-50 text-teal-900 border-teal-200"
                  : "bg-[#F4F0E8] text-[#0B1220] border-slate-300"
              }`}
            >
              {word}
            </span>
          ))}
        </div>
        {mode === "participant" && interactive && !isPrint && (
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={textDraft}
              onChange={(e) => setTextDraft(e.target.value)}
              placeholder="Un mot · كلمة واحدة"
              className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-[18px]"
            />
            <button
              type="button"
              onClick={() => handleTextSend("word_cloud")}
              className="rounded-xl bg-teal-700 px-4 py-2 text-[18px] font-bold text-white"
            >
              Ajouter
            </button>
          </div>
        )}
      </div>
    );
  }

  if (element.type === "flashcards") {
    const cards = Array.isArray(cfg.cards)
      ? (cfg.cards as Array<{ frontFr?: string; frontAr?: string; hintFr?: string; hintAr?: string }>)
      : [];
    const card = cards[cardIdx] ?? cards[0];
    return (
      <div className="h-full w-full flex flex-col justify-between" data-interactive-type="flashcards">
        {promptHeader}
        {card ? (
          <button
            type="button"
            disabled={!interactive || isPrint}
            onClick={() => setFlipped((f) => !f)}
            className="flex-1 rounded-2xl border-2 border-teal-700/35 bg-[#FAF8F4] p-6 text-center flex flex-col items-center justify-center gap-2 hover:border-teal-700 transition"
          >
            <span className="text-[14px] uppercase tracking-wider font-bold text-teal-800">
              {flipped ? "Indice / Explication · التوضيح" : "Recto (cliquer pour retourner) · الوجه الأمامي"}
            </span>
            <p className="font-display text-[40px] font-bold text-[#0B1220]">
              {flipped ? card.hintFr : card.frontFr}
            </p>
            <p dir="rtl" lang="ar" className="font-arabic text-[36px] font-bold text-teal-800">
              {flipped ? card.hintAr : card.frontAr}
            </p>
          </button>
        ) : null}
        {cards.length > 1 && !isPrint && (
          <div className="mt-3 flex items-center justify-between text-[18px]">
            <button
              type="button"
              disabled={!interactive}
              onClick={() => {
                setFlipped(false);
                setCardIdx((i) => (i - 1 + cards.length) % cards.length);
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-1.5 font-bold"
            >
              ← Précédente
            </button>
            <span className="font-mono font-bold">
              {cardIdx + 1} / {cards.length}
            </span>
            <button
              type="button"
              disabled={!interactive}
              onClick={() => {
                setFlipped(false);
                setCardIdx((i) => (i + 1) % cards.length);
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-1.5 font-bold"
            >
              Suivante →
            </button>
          </div>
        )}
      </div>
    );
  }

  if (element.type === "matching") {
    const pairs = Array.isArray(cfg.pairs)
      ? (cfg.pairs as Array<{ left?: string; right?: string }>)
      : [];
    const rightItems = [...pairs.map((p, idx) => ({ idx, text: p.right ?? "" }))].sort((a, b) =>
      a.text.localeCompare(b.text)
    );

    return (
      <div className="h-full w-full flex flex-col justify-between" data-interactive-type="matching">
        {promptHeader}
        <div className="grid grid-cols-2 gap-6 flex-1 items-center">
          <div className="space-y-2.5">
            {pairs.map((pair, idx) => (
              <button
                key={idx}
                type="button"
                disabled={!interactive || isPrint}
                onClick={() => setSelectedLeftIdx(idx)}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left text-[20px] font-bold ${
                  matchedPairs[idx] === idx
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                    : selectedLeftIdx === idx
                      ? "border-teal-700 bg-teal-50"
                      : "border-slate-300 bg-white"
                }`}
              >
                {pair.left}
              </button>
            ))}
          </div>
          <div className="space-y-2.5">
            {rightItems.map((item) => {
              const isMatched = Object.entries(matchedPairs).some(
                ([leftK, rightK]) => Number(leftK) === item.idx && rightK === item.idx
              );
              return (
                <button
                  key={item.idx}
                  type="button"
                  disabled={!interactive || isPrint || selectedLeftIdx === null}
                  onClick={() => {
                    if (selectedLeftIdx === null) return;
                    setMatchedPairs((prev) => ({ ...prev, [selectedLeftIdx]: item.idx }));
                    setSelectedLeftIdx(null);
                  }}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left text-[20px] font-bold ${
                    isMatched
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                      : "border-slate-300 bg-[#FAF8F4]"
                  }`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (element.type === "ordering") {
    return (
      <div className="h-full w-full flex flex-col justify-between" data-interactive-type="ordering">
        {promptHeader}
        <div className="space-y-2.5 flex-1">
          {orderItems.map((item, idx) => (
            <div
              key={item.id ?? idx}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-300 bg-[#FAF8F4] px-4 py-2.5"
            >
              <div className="flex-1 flex items-center justify-between gap-4">
                <span className="text-[22px] font-bold text-[#0B1220]">{item.fr}</span>
                <span dir="rtl" lang="ar" className="font-arabic text-[22px] font-bold text-teal-900">
                  {item.ar}
                </span>
              </div>
              {interactive && !isPrint && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => {
                      if (idx === 0) return;
                      const next = [...orderItems];
                      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                      setOrderItems(next);
                    }}
                    className="rounded border border-slate-300 bg-white p-1.5 disabled:opacity-40"
                    aria-label="Monter"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === orderItems.length - 1}
                    onClick={() => {
                      if (idx === orderItems.length - 1) return;
                      const next = [...orderItems];
                      [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                      setOrderItems(next);
                    }}
                    className="rounded border border-slate-300 bg-white p-1.5 disabled:opacity-40"
                    aria-label="Descendre"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (element.type === "reveal-card") {
    return (
      <div className="h-full w-full flex flex-col justify-between" data-interactive-type="reveal-card">
        {promptHeader}
        <div className="flex items-center justify-between gap-4 flex-1">
          {revealed ? (
            <div className="w-full rounded-xl border-2 border-emerald-600 bg-emerald-50 p-4 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[26px] font-bold text-emerald-950">{String(cfg.answerFr ?? "")}</p>
              <p dir="rtl" lang="ar" className="font-arabic text-[26px] font-bold text-emerald-900">
                {String(cfg.answerAr ?? "")}
              </p>
            </div>
          ) : (
            <div className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white/70 p-4 text-center text-[22px] text-slate-500">
              Corrigé masqué · الإجابة مخفية حتى النقر
            </div>
          )}
        </div>
        {!isPrint && (
          <button
            type="button"
            disabled={!interactive}
            onClick={() => setRevealed((r) => !r)}
            className="mt-2 self-start inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-[18px] font-bold text-white"
          >
            {revealed ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            <span>{revealed ? "Masquer · إخفاء" : "Révéler la réponse · إظهار الجواب"}</span>
          </button>
        )}
      </div>
    );
  }

  if (element.type === "countdown-timer") {
    const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const secs = String(secondsLeft % 60).padStart(2, "0");
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-[22px] font-bold uppercase tracking-wider text-teal-300">
          {promptFr} · <span dir="rtl" className="font-arabic">{promptAr}</span>
        </p>
        <p className="font-mono text-[76px] font-bold leading-none tracking-tight text-white">
          {mins}:{secs}
        </p>
        {!isPrint && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!interactive}
              onClick={() => setRunning((r) => !r)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 px-4 py-2 text-[16px] font-bold text-[#0B1220]"
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{running ? "Pause" : "Démarrer"}</span>
            </button>
            <button
              type="button"
              disabled={!interactive}
              onClick={() => {
                setRunning(false);
                setSecondsLeft(initialSec);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-[16px] font-bold text-white"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (element.type === "group-task") {
    return (
      <div className="h-full w-full flex flex-col justify-between" data-interactive-type="group-task">
        {promptHeader}
        <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-4 flex flex-wrap items-center justify-between gap-4 flex-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-[16px] uppercase">
              <Users className="h-4 w-4" />
              <span>Livrable attendu</span>
            </div>
            <p className="text-[24px] font-bold text-[#0B1220]">{String(cfg.deliverableFr ?? "")}</p>
          </div>
          <p dir="rtl" lang="ar" className="font-arabic text-[24px] font-bold text-teal-900">
            {String(cfg.deliverableAr ?? "")}
          </p>
        </div>
        {mode === "participant" && interactive && !isPrint && (
          <button
            type="button"
            onClick={() => handleOptionPick("ready", "group_task")}
            className="mt-3 self-start inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2 text-[18px] font-bold text-white"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>Notre groupe est prêt · مجموعتنا جاهزة</span>
          </button>
        )}
      </div>
    );
  }

  return null;
}
