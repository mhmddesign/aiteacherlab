import React from "react";
import type { BilingualText } from "@/content/types";

interface BilingualBlockProps {
  text: BilingualText;
  className?: string;
  frClassName?: string;
  arClassName?: string;
  as?: "div" | "span";
}

export function BilingualBlock({
  text,
  className = "",
  frClassName = "",
  arClassName = "",
  as = "div",
}: BilingualBlockProps) {
  const Tag = as;
  return (
    <Tag className={`space-y-0.5 ${className}`}>
      <span dir="ltr" lang="fr" className={`block ${frClassName}`}>
        {text.fr}
      </span>
      <span
        dir="rtl"
        lang="ar"
        className={`font-arabic block leading-relaxed ${arClassName}`}
      >
        {text.ar}
      </span>
    </Tag>
  );
}

export function BilingualPair({
  fr,
  ar,
  className = "",
  frClassName = "",
  arClassName = "",
  as = "div",
}: BilingualText & {
  className?: string;
  frClassName?: string;
  arClassName?: string;
  as?: "div" | "span";
}) {
  return (
    <BilingualBlock
      text={{ fr, ar }}
      className={className}
      frClassName={frClassName}
      arClassName={arClassName}
      as={as}
    />
  );
}

export function BilingualInline({
  text,
  className = "",
  separator = " · ",
}: {
  text: BilingualText;
  className?: string;
  separator?: string;
}) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 ${className}`}>
      <bdi dir="ltr" lang="fr">
        {text.fr}
      </bdi>
      <span aria-hidden="true" className="opacity-60">
        {separator.trim()}
      </span>
      <bdi dir="rtl" lang="ar" className="font-arabic">
        {text.ar}
      </bdi>
    </span>
  );
}

export function BilingualButtonLabel({
  fr,
  ar,
  className = "",
  arClassName = "text-[11px] opacity-90",
}: BilingualText & {
  className?: string;
  arClassName?: string;
}) {
  return (
    <span className={`inline-flex flex-col items-center text-center leading-tight ${className}`}>
      <span dir="ltr" lang="fr">
        {fr}
      </span>
      <span dir="rtl" lang="ar" className={`font-arabic ${arClassName}`}>
        {ar}
      </span>
    </span>
  );
}

export function BilingualSplit({
  text,
  className = "",
  frClassName = "",
  arClassName = "",
}: {
  text: BilingualText;
  className?: string;
  frClassName?: string;
  arClassName?: string;
}) {
  return (
    <div className={`grid gap-3 md:grid-cols-2 ${className}`}>
      <p dir="ltr" lang="fr" className={`leading-relaxed ${frClassName}`}>
        {text.fr}
      </p>
      <p
        dir="rtl"
        lang="ar"
        className={`font-arabic leading-relaxed text-right ${arClassName}`}
      >
        {text.ar}
      </p>
    </div>
  );
}
