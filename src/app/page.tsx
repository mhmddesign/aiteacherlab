import { Monitor, Presentation, Smartphone } from "lucide-react";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
import { NavActionLink } from "@/components/ui/NavActionLink";

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
          <NavActionLink
            href="/presenter"
            routeLabel="/presenter"
            icon={<Presentation className="h-4 w-4" />}
            titleFr="Ouvrir la présentation"
            titleAr="فتح العرض التقديمي"
            variant="primary"
          />

          <NavActionLink
            href="/join"
            routeLabel="/join"
            icon={<Smartphone className="h-4 w-4" />}
            titleFr="Rejoindre l'atelier"
            titleAr="الانضمام إلى الورشة"
            variant="secondary"
          />
        </div>
      </div>

      <footer className="mx-auto w-full max-w-3xl border-t border-slate-800/80 pt-5 mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <span>12 sections · 21 diapositives · FR / AR</span>
        <NavActionLink
          href="/screen"
          routeLabel="/screen"
          icon={<Monitor className="h-3.5 w-3.5" />}
          titleFr="Écran projecteur (/screen)"
          titleAr="شاشة المسلاط (/screen)"
          variant="footer"
        />
      </footer>
    </div>
  );
}
