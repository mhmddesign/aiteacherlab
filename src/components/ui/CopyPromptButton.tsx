"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyPromptButtonProps {
  text: string;
  label?: string;
  labelAr?: string;
  copiedLabel?: string;
  copiedLabelAr?: string;
  className?: string;
}

export function CopyPromptButton({
  text,
  label = "Copier",
  labelAr = "نسخ",
  copiedLabel = "Copié !",
  copiedLabelAr = "تم النسخ!",
  className = "",
}: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex min-h-[38px] items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
        copied
          ? "border-teal-700 bg-teal-700 text-white"
          : "border-slate-400 bg-white text-navy-900 hover:border-teal-700 hover:text-teal-700"
      } ${className}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
      <span className="inline-flex flex-wrap items-center gap-x-1.5">
        <span dir="ltr" lang="fr">
          {copied ? copiedLabel : label}
        </span>
        <span aria-hidden="true" className="opacity-60">
          ·
        </span>
        <span dir="rtl" lang="ar" className="font-arabic">
          {copied ? copiedLabelAr : labelAr}
        </span>
      </span>
    </button>
  );
}
