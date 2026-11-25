import Link from "next/link";
import { ArrowRight, Monitor, Presentation, Smartphone } from "lucide-react";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col justify-between px-6 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-3xl flex-1 flex flex-col justify-center space-y-10">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">
            <BilingualInline
              text={{
                fr: "Province de Mediouna · Centre de Digitalisation",
                ar: "إقليم مديونة · مركز الرقمنة",
              }}
            />
          </p>

          <div className="space-y-3">
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#FAF8F4] leading-[1.08]">
              AI Teacher Lab
            </h1>
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic text-2xl sm:text-4xl font-bold text-teal-300"
            >
              مختبر المعلم للذكاء الاصطناعي
            </p>
          </div>

          <div className="border-t border-slate-800 pt-5">
            <BilingualBlock
              text={{
                fr: "Atelier collaboratif de 2 heures pour les enseignantes et enseignants du primaire public (1AEP–6AEP).",
                ar: "ورشة تشاركية لمدة ساعتين لأستاذات وأساتذة التعليم الابتدائي العمومي (1AEP–6AEP).",
              }}
              frClassName="text-base sm:text-lg text-slate-300 leading-relaxed"
              arClassName="text-base sm:text-lg text-slate-300 leading-relaxed"
            />
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/presenter"
            className="group flex flex-col justify-between rounded-2xl bg-[#FAF8F4] p-6 sm:p-7 text-[#0F172A] shadow-xl transition hover:bg-white active:scale-[0.99]"
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-teal-800">
              <span className="inline-flex items-center gap-2">
                <Presentation className="h-4 w-4" />
                <span>/presenter</span>
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>

            <div className="mt-6">
              <BilingualBlock
                text={{
                  fr: "Ouvrir la présentation",
                  ar: "فتح العرض التقديمي",
                }}
                frClassName="font-display text-2xl font-bold text-slate-900"
                arClassName="text-xl font-bold text-teal-800"
              />
            </div>
          </Link>

          <Link
            href="/join"
            className="group flex flex-col justify-between rounded-2xl border border-teal-500/40 bg-[#111C33] p-6 sm:p-7 text-white transition hover:border-teal-400 hover:bg-[#152340] active:scale-[0.99]"
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-teal-300">
              <span className="inline-flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>/join</span>
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>

            <div className="mt-6">
              <BilingualBlock
                text={{
                  fr: "Rejoindre l'atelier",
                  ar: "الانضمام إلى الورشة",
                }}
                frClassName="font-display text-2xl font-bold text-[#FAF8F4]"
                arClassName="text-xl font-bold text-teal-300"
              />
            </div>
          </Link>
        </div>
      </div>

      <footer className="mx-auto w-full max-w-3xl border-t border-slate-800/80 pt-5 mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <span>12 sections · 21 diapositives · FR / AR</span>
        <Link
          href="/screen"
          className="inline-flex items-center gap-2 font-semibold text-slate-300 hover:text-teal-300 transition-colors"
        >
          <Monitor className="h-3.5 w-3.5" />
          <BilingualInline
            text={{
              fr: "Écran projecteur (/screen)",
              ar: "شاشة المسلاط (/screen)",
            }}
          />
        </Link>
      </footer>
    </div>
  );
}
