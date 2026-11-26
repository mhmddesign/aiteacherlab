import { Layers, Monitor, Presentation, Smartphone } from "lucide-react";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";
import { NavActionLink } from "@/components/ui/NavActionLink";

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] bg-navy-950 text-ivory-50 safe-top safe-bottom flex flex-col justify-between px-5 py-8 sm:px-6 sm:py-14">
      <main className="mx-auto w-full max-w-3xl flex-1 flex flex-col justify-center space-y-8 sm:space-y-10">
        <header className="space-y-4 sm:space-y-5">
          <div className="flex items-center gap-3">
            <img
              src="/icon.svg"
              alt=""
              aria-hidden="true"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg shrink-0"
            />
            <p className="text-xs font-semibold tracking-wide text-teal-bright">
              <BilingualInline
                text={{
                  fr: "Province de Mediouna · Centre de Digitalisation",
                  ar: "إقليم مديونة · مركز الرقمنة",
                }}
              />
            </p>
          </div>

          <div className="space-y-2.5">
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-ivory-50 leading-[1.06]">
              AI Teacher Lab
            </h1>
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic text-2xl sm:text-4xl font-bold text-teal-bright"
            >
              مختبر المعلم للذكاء الاصطناعي
            </p>
          </div>

          <div className="border-t border-navy-700 pt-5">
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

        <nav aria-label="Accès principal / الولوج الرئيسي" className="grid gap-4 sm:grid-cols-2">
          <NavActionLink
            href="/presenter"
            routeLabel="/presenter"
            icon={<Presentation className="h-4 w-4" aria-hidden="true" />}
            titleFr="Ouvrir la présentation"
            titleAr="فتح العرض التقديمي"
            variant="primary"
          />

          <NavActionLink
            href="/join"
            routeLabel="/join"
            icon={<Smartphone className="h-4 w-4" aria-hidden="true" />}
            titleFr="Rejoindre l'atelier"
            titleAr="الانضمام إلى الورشة"
            variant="secondary"
          />
        </nav>
      </main>

      <footer className="mx-auto w-full max-w-3xl border-t border-navy-700/80 pt-4 mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <span>12 sections · 21 diapositives · FR / AR</span>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <NavActionLink
            href="/studio"
            routeLabel="/studio"
            icon={<Layers className="h-3.5 w-3.5" aria-hidden="true" />}
            titleFr="Studio & Salles (/studio)"
            titleAr="الأستوديو والقاعات"
            variant="footer"
          />
          <NavActionLink
            href="/screen"
            routeLabel="/screen"
            icon={<Monitor className="h-3.5 w-3.5" aria-hidden="true" />}
            titleFr="Écran projecteur (/screen)"
            titleAr="شاشة المسلاط (/screen)"
            variant="footer"
          />
        </div>
      </footer>
    </div>
  );
}
