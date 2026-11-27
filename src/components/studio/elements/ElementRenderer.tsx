"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import type { SlideElement } from "@/lib/studio/document-schema";
import { QrJoinPanel } from "@/components/ui/QrJoinPanel";
import { CodeSandboxFrame } from "./CodeSandboxFrame";
import {
  InteractiveWidgetView,
  type StudioElementLiveAggregate,
} from "./InteractiveWidgets";
import { PrimaryManipulativeView } from "./PrimaryManipulatives";

export interface ElementRendererProps {
  element: SlideElement;
  mode: "editor" | "projector" | "presenter" | "participant" | "export";
  interactive?: boolean;
  showResults?: boolean;
  joinPath?: string;
  pinHint?: string;
  aggregate?: StudioElementLiveAggregate | null;
  myOptionId?: string | null;
  myText?: string | null;
  onApproveSandbox?: (elementId: string) => void;
  onSubmitLive?: (
    elementId: string,
    payload: { optionId?: string; text?: string; activityType: string }
  ) => Promise<void> | void;
}

function sanitizeImageSrc(raw: unknown): string {
  if (typeof raw !== "string") return "/icon.svg";
  const trimmed = raw.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^data:image\/(png|jpeg|jpg|webp|svg\+xml);base64,/i.test(trimmed)) return trimmed;
  return "/icon.svg";
}

const INTERACTIVE_TYPES = new Set([
  "live-poll",
  "mcq-quiz",
  "tf-quiz",
  "short-answer",
  "word-cloud",
  "flashcards",
  "matching",
  "ordering",
  "reveal-card",
  "countdown-timer",
  "group-task",
  "exit-ticket",
]);

const PRIMARY_TYPES = new Set([
  "arabic-letters",
  "french-reading",
  "number-line",
  "abacus",
  "base10-blocks",
  "fractions-lab",
  "math-operations",
  "tarl-tracks",
  "worksheet-generator",
]);

export function ElementRenderer({
  element,
  mode,
  interactive = true,
  showResults = true,
  joinPath = "/join",
  pinHint,
  aggregate,
  myOptionId,
  myText,
  onApproveSandbox,
  onSubmitLive,
}: ElementRendererProps) {
  const s = element.style;
  const cfg = element.config ?? {};
  const fr = element.bilingual?.fr ?? "";
  const ar = element.bilingual?.ar ?? "";
  const isPrint = mode === "export";

  const wrapperStyle: React.CSSProperties = {
    backgroundColor: s.backgroundColor,
    color: s.textColor,
    borderColor: s.borderColor,
    borderWidth: `${s.borderWidth}px`,
    borderStyle: s.borderWidth > 0 ? "solid" : "none",
    borderRadius: `${s.borderRadius}px`,
    padding: `${s.padding}px`,
    fontSize: `${s.fontSize}px`,
    fontWeight: s.fontWeight === "bold" ? 700 : s.fontWeight === "semibold" ? 600 : 400,
    textAlign: s.textAlign,
  };

  if (element.type === "unknown-element") {
    return (
      <div
        style={wrapperStyle}
        data-element-fallback="unknown-element"
        className="h-full w-full flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/90 text-amber-950 p-6 text-center"
      >
        <AlertTriangle className="h-8 w-8 text-amber-700" />
        <p className="font-bold text-[22px]">
          Élément récupéré / مكون غير معروف ({String(cfg.originalType ?? "inconnu")})
        </p>
        <p className="text-[16px] text-amber-900">
          Vous pouvez conserver, modifier ou supprimer ce bloc sans perte de données.
        </p>
      </div>
    );
  }

  if (element.type === "code-sandbox") {
    return (
      <div style={wrapperStyle} className="h-full w-full overflow-hidden">
        <CodeSandboxFrame
          elementId={element.id}
          titleFr={fr || "Composant HTML/CSS/JS"}
          titleAr={ar || "مكون برمجي"}
          html={typeof cfg.html === "string" ? cfg.html : ""}
          css={typeof cfg.css === "string" ? cfg.css : ""}
          js={typeof cfg.js === "string" ? cfg.js : ""}
          approved={Boolean(cfg.approved)}
          interactive={interactive}
          printMode={isPrint}
          onApprove={() => onApproveSandbox?.(element.id)}
        />
      </div>
    );
  }

  if (INTERACTIVE_TYPES.has(element.type)) {
    return (
      <div style={wrapperStyle} className="h-full w-full overflow-hidden">
        <InteractiveWidgetView
          key={element.id}
          element={element}
          mode={mode}
          interactive={interactive}
          showResults={showResults}
          aggregate={aggregate}
          myOptionId={myOptionId}
          myText={myText}
          onSubmitLive={onSubmitLive}
        />
      </div>
    );
  }

  if (PRIMARY_TYPES.has(element.type)) {
    return (
      <div style={wrapperStyle} className="h-full w-full overflow-hidden">
        <PrimaryManipulativeView
          key={element.id}
          element={element}
          interactive={interactive}
          printMode={isPrint}
        />
      </div>
    );
  }

  // General 13 components
  switch (element.type) {
    case "heading":
      return (
        <div style={wrapperStyle} className="h-full w-full flex flex-col justify-center gap-1.5 overflow-hidden">
          {fr && (
            <h2
              dir="ltr"
              lang="fr"
              style={{ fontSize: `${s.fontSize}px` }}
              className="font-display font-bold leading-[1.08] tracking-tight"
            >
              {fr}
            </h2>
          )}
          {ar && (
            <h3
              dir="rtl"
              lang="ar"
              style={{ fontSize: `${Math.max(24, Math.round(s.fontSize * 0.88))}px` }}
              className="font-arabic font-bold leading-[1.24] text-teal-800"
            >
              {ar}
            </h3>
          )}
        </div>
      );

    case "text":
      return (
        <div style={wrapperStyle} className="h-full w-full flex flex-col justify-center gap-3 overflow-hidden">
          {fr && (
            <p dir="ltr" lang="fr" className="leading-snug">
              {fr}
            </p>
          )}
          {ar && (
            <p dir="rtl" lang="ar" className="font-arabic leading-relaxed text-teal-900">
              {ar}
            </p>
          )}
        </div>
      );

    case "bilingual-card":
    case "callout":
      return (
        <div style={wrapperStyle} className="h-full w-full flex flex-col justify-between gap-3 overflow-hidden">
          <div className="space-y-1">
            {fr && (
              <h3 dir="ltr" lang="fr" className="font-display font-bold text-[1.05em] leading-snug">
                {fr}
              </h3>
            )}
            {ar && (
              <h4 dir="rtl" lang="ar" className="font-arabic font-bold text-[1.05em] text-teal-800 leading-snug">
                {ar}
              </h4>
            )}
          </div>
          {(cfg.bodyFr || cfg.bodyAr) ? (
            <div className="space-y-1.5 text-[0.82em] opacity-90">
              {typeof cfg.bodyFr === "string" && cfg.bodyFr && (
                <p dir="ltr" lang="fr" className="leading-snug">
                  {cfg.bodyFr}
                </p>
              )}
              {typeof cfg.bodyAr === "string" && cfg.bodyAr && (
                <p dir="rtl" lang="ar" className="font-arabic leading-relaxed">
                  {cfg.bodyAr}
                </p>
              )}
            </div>
          ) : null}
        </div>
      );

    case "image": {
      const src = sanitizeImageSrc(cfg.url);
      const fit = cfg.fit === "cover" ? "object-cover" : "object-contain";
      return (
        <div style={wrapperStyle} className="h-full w-full flex flex-col justify-between gap-2 overflow-hidden">
          <div className="flex-1 min-h-0 flex items-center justify-center rounded-xl bg-slate-100/60 overflow-hidden p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={String(cfg.altFr ?? fr ?? "Image")}
              className={`max-h-full max-w-full ${fit}`}
            />
          </div>
          {(fr || ar) && (
            <div className="flex items-center justify-between gap-4 text-[20px]">
              <span className="font-semibold truncate">{fr}</span>
              <span dir="rtl" lang="ar" className="font-arabic font-semibold text-teal-800 truncate">
                {ar}
              </span>
            </div>
          )}
        </div>
      );
    }

    case "shape":
      return (
        <div style={wrapperStyle} className="h-full w-full flex flex-col items-center justify-center gap-2 text-center">
          {fr && <p className="font-display font-bold leading-tight">{fr}</p>}
          {ar && (
            <p dir="rtl" lang="ar" className="font-arabic font-bold opacity-95">
              {ar}
            </p>
          )}
        </div>
      );

    case "divider":
      return (
        <div className="h-full w-full flex items-center">
          <div
            style={{
              height: `${Math.max(2, Number(cfg.thickness ?? 3))}px`,
              backgroundColor: String(cfg.color ?? s.borderColor ?? "#CBD5E1"),
            }}
            className="w-full rounded-full"
          />
        </div>
      );

    case "list": {
      const items = Array.isArray(cfg.items)
        ? (cfg.items as Array<{ fr?: string; ar?: string }>)
        : [];
      return (
        <div style={wrapperStyle} className="h-full w-full flex flex-col justify-between gap-3 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-display font-bold">{fr}</h3>
            <h4 dir="rtl" lang="ar" className="font-arabic font-bold text-teal-800">
              {ar}
            </h4>
          </div>
          <ol className="space-y-2.5 flex-1">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start justify-between gap-4 rounded-xl bg-[#FAF8F4] border border-slate-200 px-4 py-2"
              >
                <span className="font-semibold text-[0.88em]">
                  <strong className="text-teal-800 mr-2">0{idx + 1}.</strong>
                  {item.fr}
                </span>
                <span dir="rtl" lang="ar" className="font-arabic text-[0.92em] text-teal-900">
                  {item.ar}
                </span>
              </li>
            ))}
          </ol>
        </div>
      );
    }

    case "table": {
      const headers = Array.isArray(cfg.headers)
        ? (cfg.headers as Array<{ fr?: string; ar?: string }>)
        : [];
      const rows = Array.isArray(cfg.rows) ? (cfg.rows as string[][]) : [];
      return (
        <div style={wrapperStyle} className="h-full w-full flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold">{fr}</h3>
            <h4 dir="rtl" lang="ar" className="font-arabic font-bold text-teal-800">
              {ar}
            </h4>
          </div>
          <div className="flex-1 overflow-hidden rounded-xl border border-slate-300">
            <table className="w-full h-full border-collapse text-left">
              <thead className="bg-[#0B1220] text-white">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="px-4 py-2.5 text-[20px] font-bold">
                      <span>{h.fr}</span>{" "}
                      {h.ar ? (
                        <span dir="rtl" className="font-arabic text-teal-300 font-normal ml-2">
                          · {h.ar}
                        </span>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className="border-t border-slate-200 even:bg-[#FAF8F4]">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2.5 text-[20px] text-[#0B1220]">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    case "chart": {
      const series = Array.isArray(cfg.series)
        ? (cfg.series as Array<{ labelFr?: string; value?: number }>)
        : [];
      const maxVal = Math.max(1, ...series.map((item) => Number(item.value ?? 0)));
      return (
        <div style={wrapperStyle} className="h-full w-full flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-display font-bold">{fr}</h3>
            <h4 dir="rtl" lang="ar" className="font-arabic font-bold text-teal-800">
              {ar}
            </h4>
          </div>
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {series.map((item, idx) => {
              const val = Number(item.value ?? 0);
              const pct = Math.round((val / maxVal) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[20px] font-bold">
                    <span>{item.labelFr}</span>
                    <span className="font-mono text-teal-800">{val}</span>
                  </div>
                  <div className="h-7 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-teal-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "timeline": {
      const steps = Array.isArray(cfg.steps)
        ? (cfg.steps as Array<{ time?: string; fr?: string; ar?: string }>)
        : [];
      return (
        <div style={wrapperStyle} className="h-full w-full flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold">{fr}</h3>
            <h4 dir="rtl" lang="ar" className="font-arabic font-bold text-teal-800">
              {ar}
            </h4>
          </div>
          <div className="grid gap-4 flex-1 items-stretch" style={{ gridTemplateColumns: `repeat(${Math.max(1, steps.length)}, minmax(0, 1fr))` }}>
            {steps.map((step, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-[#FAF8F4] p-4 flex flex-col justify-between">
                <span className="font-mono text-[16px] font-bold text-teal-800">{step.time}</span>
                <p className="text-[22px] font-bold text-[#0B1220]">{step.fr}</p>
                <p dir="rtl" lang="ar" className="font-arabic text-[22px] text-teal-900">
                  {step.ar}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "diagram": {
      const nodes = Array.isArray(cfg.nodes)
        ? (cfg.nodes as Array<{ n?: string; fr?: string; ar?: string }>)
        : [];
      return (
        <div style={wrapperStyle} className="h-full w-full flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold">{fr}</h3>
            <h4 dir="rtl" lang="ar" className="font-arabic font-bold text-teal-800">
              {ar}
            </h4>
          </div>
          <div className="flex items-center justify-between gap-4 flex-1">
            {nodes.map((node, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-1 h-full max-h-[210px] rounded-2xl border-2 border-teal-700/30 bg-[#0B1220] text-white p-4 flex flex-col justify-between">
                  <span className="font-mono text-[20px] font-bold text-teal-300">{node.n ?? `0${idx + 1}`}</span>
                  <p className="text-[22px] font-bold">{node.fr}</p>
                  <p dir="rtl" lang="ar" className="font-arabic text-[22px] text-teal-200">
                    {node.ar}
                  </p>
                </div>
                {idx < nodes.length - 1 && (
                  <span className="font-bold text-[34px] text-teal-700 shrink-0">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    }

    case "qr-join":
      return (
        <div className="h-full w-full flex items-center justify-center">
          <QrJoinPanel size={230} showPinHint={pinHint} joinPath={joinPath} />
        </div>
      );

    default:
      return null;
  }
}
