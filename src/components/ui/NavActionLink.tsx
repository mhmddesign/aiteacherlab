"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";

interface NavActionLinkProps {
  href: string;
  routeLabel: string;
  icon: React.ReactNode;
  titleFr: string;
  titleAr: string;
  variant: "primary" | "secondary" | "footer";
}

export function NavActionLink({
  href,
  routeLabel,
  icon,
  titleFr,
  titleAr,
  variant,
}: NavActionLinkProps) {
  const [pending, setPending] = useState(false);
  const clickedRef = useRef(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    // Prevent duplicate route pushes from double-clicking
    if (clickedRef.current) {
      e.preventDefault();
      return;
    }
    clickedRef.current = true;
    setPending(true);
    window.setTimeout(() => {
      clickedRef.current = false;
      setPending(false);
    }, 6000);
  };

  if (variant === "footer") {
    return (
      <>
        {pending && (
          <div
            aria-hidden="true"
            className="fixed top-0 inset-x-0 z-50 h-0.5 bg-teal-400 animate-pulse"
          />
        )}
        <Link
          href={href}
          onClick={handleClick}
          aria-busy={pending}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2.5 font-semibold transition-colors duration-100 active:scale-[0.98] ${
            pending ? "text-teal-300" : "text-slate-300 hover:text-teal-300"
          }`}
        >
          {pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-300 shrink-0" aria-hidden="true" />
          ) : (
            icon
          )}
          <BilingualInline
            text={{
              fr: pending ? "Ouverture..." : titleFr,
              ar: pending ? "جاري الفتح..." : titleAr,
            }}
          />
        </Link>
      </>
    );
  }

  const isPrimary = variant === "primary";

  return (
    <>
      {pending && (
        <div
          aria-hidden="true"
          className="fixed top-0 inset-x-0 z-50 h-0.5 bg-teal-400 animate-pulse"
        />
      )}
      <Link
        href={href}
        onClick={handleClick}
        aria-busy={pending}
        className={`group flex min-h-[128px] flex-col justify-between rounded-2xl p-5 sm:p-7 transition-all duration-120 active:scale-[0.985] ${
          isPrimary
            ? "bg-[#FAF8F4] text-[#0F172A] shadow-xl hover:bg-white"
            : "border border-teal-500/35 bg-[#111C33] text-white hover:border-teal-400 hover:bg-[#152340]"
        } ${pending ? "ring-2 ring-teal-400 opacity-95" : ""}`}
      >
        <div
          className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider ${
            isPrimary ? "text-teal-800" : "text-teal-300"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {icon}
            <span>{routeLabel}</span>
          </span>
          {pending ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Ouverture...</span>
            </span>
          ) : (
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1"
            />
          )}
        </div>

        <div className="mt-5">
          <BilingualBlock
            text={{
              fr: pending ? "Ouverture..." : titleFr,
              ar: pending ? "جاري الفتح..." : titleAr,
            }}
            frClassName={`font-display text-xl sm:text-2xl font-bold ${
              isPrimary ? "text-slate-900" : "text-[#FAF8F4]"
            }`}
            arClassName={`text-lg sm:text-xl font-bold ${
              isPrimary ? "text-teal-800" : "text-teal-300"
            }`}
          />
        </div>
      </Link>
    </>
  );
}
