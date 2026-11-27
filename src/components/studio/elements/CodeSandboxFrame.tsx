"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Code2, RotateCcw, ShieldCheck } from "lucide-react";

interface CodeSandboxFrameProps {
  elementId: string;
  titleFr: string;
  titleAr: string;
  html: string;
  css: string;
  js: string;
  approved: boolean;
  interactive?: boolean;
  printMode?: boolean;
  onApprove?: () => void;
}

const MAX_SANDBOX_BYTES = 32 * 1024;

export function CodeSandboxFrame({
  elementId,
  titleFr,
  titleAr,
  html,
  css,
  js,
  approved,
  interactive = true,
  printMode = false,
  onApprove,
}: CodeSandboxFrameProps) {
  const [userApproved, setUserApproved] = useState(false);
  const [runNonce, setRunNonce] = useState(0);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const effectiveApproved = approved || userApproved;

  const byteSize = useMemo(() => {
    try {
      return new TextEncoder().encode(html + css + js).length;
    } catch {
      return html.length + css.length + js.length;
    }
  }, [html, css, js]);

  const overLimit = byteSize > MAX_SANDBOX_BYTES;

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as
        | { source?: string; elementId?: string; kind?: string; message?: string }
        | null
        | undefined;
      if (!data || data.source !== "aiteacherlab-sandbox" || data.elementId !== elementId) {
        return;
      }
      if (data.kind === "error") {
        setRuntimeError(data.message ?? "Erreur d'exécution isolée / خطأ داخل البيئة المعزولة");
      } else if (data.kind === "ready") {
        setRuntimeError(null);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [elementId]);

  const srcDoc = useMemo(() => {
    if (!effectiveApproved || overLimit) return "";
    const safeCss = css.replace(/<\/style/gi, "<\\/style");
    const safeJs = js.replace(/<\/script/gi, "<\\/script");
    const safeElementId = JSON.stringify(elementId);

    return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none';" />
  <style>${safeCss}</style>
</head>
<body>
  ${html}
  <script>
    (function(){
      var eid = ${safeElementId};
      window.onerror = function(msg){
        try {
          window.parent.postMessage({ source: "aiteacherlab-sandbox", elementId: eid, kind: "error", message: String(msg) }, "*");
        } catch(e) {}
        return false;
      };
      try {
        ${safeJs}
        window.parent.postMessage({ source: "aiteacherlab-sandbox", elementId: eid, kind: "ready" }, "*");
      } catch(err) {
        try {
          window.parent.postMessage({ source: "aiteacherlab-sandbox", elementId: eid, kind: "error", message: err && err.message ? err.message : String(err) }, "*");
        } catch(e) {}
      }
    })();
  </script>
</body>
</html>`;
  }, [effectiveApproved, overLimit, css, js, html, elementId]);

  if (printMode) {
    return (
      <div className="h-full w-full flex flex-col justify-between rounded-xl border-2 border-teal-700/40 bg-[#F4F0E8] p-5 text-[#0B1220]">
        <div className="flex items-center justify-between gap-4 border-b border-slate-300 pb-3">
          <div className="flex items-center gap-2 font-bold text-teal-800">
            <Code2 className="h-5 w-5" />
            <span>Composant interactif HTML/CSS/JS</span>
          </div>
          <span dir="rtl" lang="ar" className="font-arabic font-bold text-teal-800">
            مكون برمجي تفاعلي
          </span>
        </div>
        <div className="py-4 space-y-2">
          <p className="font-bold text-[26px]">{titleFr}</p>
          <p dir="rtl" lang="ar" className="font-arabic font-bold text-[24px] text-teal-900">
            {titleAr}
          </p>
        </div>
        <p className="text-[18px] text-slate-600">
          Exécutable en mode présentation en direct · قابل للتشغيل أثناء العرض المباشر
        </p>
      </div>
    );
  }

  if (overLimit) {
    return (
      <div
        data-sandbox-status="oversize"
        className="h-full w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-rose-300 bg-rose-50 p-6 text-center text-rose-900"
      >
        <AlertTriangle className="h-8 w-8 text-rose-600" />
        <p className="font-bold text-[22px]">
          Taille maximale dépassée ({Math.round(byteSize / 1024)} KB / 32 KB)
        </p>
        <p dir="rtl" lang="ar" className="font-arabic text-[20px]">
          تجاوز المكون الحجم الأقصى المسموح به (32 كيلوبايت).
        </p>
      </div>
    );
  }

  if (!effectiveApproved) {
    return (
      <div
        data-sandbox-status="pending-approval"
        className="h-full w-full flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-6 text-center text-slate-900"
      >
        <ShieldCheck className="h-9 w-9 text-amber-700" />
        <div className="space-y-1">
          <p className="font-bold text-[24px]">
            Code personnalisé en attente de validation ({Math.round(byteSize)} o)
          </p>
          <p dir="rtl" lang="ar" className="font-arabic text-[22px] text-amber-900">
            مكون برمجي مخصص في انتظار المصادقة قبل التشغيل داخل بيئة معزولة
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setUserApproved(true);
            onApprove?.();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-[20px] font-bold text-white shadow hover:bg-teal-800"
        >
          <CheckCircle2 className="h-5 w-5" />
          <span>Approuver et exécuter · اعتماد وتشغيل</span>
        </button>
      </div>
    );
  }

  return (
    <div
      data-sandbox-container={elementId}
      className="relative h-full w-full flex flex-col rounded-xl overflow-hidden border border-teal-700/25 bg-white"
    >
      <div className="flex items-center justify-between gap-2 bg-[#0B1220] px-3 py-1.5 text-[14px] text-slate-200 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
          <span className="truncate font-semibold">{titleFr}</span>
          <span className="text-slate-400">·</span>
          <span dir="rtl" lang="ar" className="font-arabic truncate text-teal-200">
            {titleAr}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setRuntimeError(null);
            setRunNonce((n) => n + 1);
          }}
          title="Réinitialiser / إعادة التشغيل"
          className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[12px] text-white hover:bg-white/20"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {runtimeError && (
        <div
          data-sandbox-error="true"
          className="bg-amber-50 border-b border-amber-200 px-3 py-1 text-[13px] text-amber-900 shrink-0"
        >
          Sandbox notice: {runtimeError}
        </div>
      )}

      <iframe
        key={`${elementId}-${runNonce}`}
        title={titleFr || "Sandboxed Code Component"}
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
        srcDoc={srcDoc}
        data-sandbox-iframe="true"
        className={`w-full flex-1 border-0 bg-white ${
          interactive ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />
    </div>
  );
}
