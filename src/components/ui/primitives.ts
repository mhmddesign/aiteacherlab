/**
 * Shared token-driven UI class presets for AI Teacher Lab.
 * All foreground/background combinations meet WCAG 2.2 AA (>= 4.5:1 normal text).
 */

export const uiButton = {
  /** Dark surface primary CTA: Navy-900 ink on Teal-Bright (#2DD4BF) = 10.06:1 */
  primaryDark:
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-teal-bright px-4 py-2 text-xs sm:text-sm font-bold text-navy-900 hover:bg-[#5EEAD4] disabled:opacity-50 cursor-pointer transition",
  /** Light surface primary CTA: White ink on Teal-700 (#0F766E) = 5.47:1 */
  primaryLight:
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#0D655E] disabled:opacity-50 cursor-pointer transition",
  /** Dark surface secondary button */
  secondaryDark:
    "inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-navy-700 bg-navy-800 px-3.5 py-2 text-xs font-semibold text-ivory-50 hover:border-teal-bright disabled:opacity-50 cursor-pointer transition",
  /** Light surface secondary button */
  secondaryLight:
    "inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-slate-400 bg-white px-3.5 py-2 text-xs font-semibold text-navy-900 hover:border-teal-700 disabled:opacity-50 cursor-pointer transition",
} as const;

export const uiInput = {
  /** Light surface input/select/textarea: >= 3:1 control border + 16px mobile text */
  light:
    "min-h-[44px] w-full rounded-xl border border-slate-400 bg-white px-3.5 py-2 text-base sm:text-sm text-navy-900 placeholder:text-slate-500 focus:border-teal-700 focus:outline-none",
  /** Dark surface input/select/textarea */
  dark:
    "min-h-[44px] w-full rounded-xl border border-navy-700 bg-navy-800 px-3.5 py-2 text-base sm:text-sm text-ivory-50 placeholder:text-slate-400 focus:border-teal-bright focus:outline-none",
} as const;

export const uiSemantic = {
  success: "border border-emerald-700/20 bg-status-success-bg text-status-success",
  warning: "border border-amber-800/20 bg-status-warning-bg text-status-warning",
  error: "border border-red-800/20 bg-status-error-bg text-status-error",
  info: "border border-blue-700/20 bg-status-info-bg text-status-info",
} as const;
