import Link from "next/link";
import { ArrowRight, BookOpen, Monitor, Presentation, ShieldCheck, Smartphone, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B1426] text-white flex flex-col justify-between px-4 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-300">
              Province de Mediouna · Centre de Digitalisation
            </span>
            <h1 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight text-ivory-50">
              AI Teacher Lab
            </h1>
            <p className="mt-1.5 text-sm sm:text-lg text-slate-300">
              De l&apos;IA à la création pédagogique · Atelier collaboratif pour les enseignantes et enseignants du primaire
            </p>
          </div>
        </header>

        <div
          dir="rtl"
          lang="ar"
          className="font-arabic rounded-2xl border border-teal-500/30 bg-navy-800/80 p-5 text-slate-100"
        >
          <p className="text-base sm:text-lg leading-relaxed">
            مرحبا بالزميلات والزملاء أستاذات وأساتذة التعليم الابتدائي بإقليم مديونة. هذا الفضاء التفاعلي مخصص لتقاسم التجارب، بناء التوجيهات التربوية (Prompts)، وتطوير تطبيقات تعليمية بسيطة تلائم أقسامنا.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-12">
          <Link
            href="/join"
            className="md:col-span-7 group rounded-3xl border border-teal-400/50 bg-[#F8F6F1] p-7 text-slate-900 shadow-xl transition hover:border-teal-500"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-3.5 py-1 text-xs font-bold text-white">
                <Smartphone className="h-3.5 w-3.5" />
                Interface Participants
              </span>
              <ArrowRight className="h-5 w-5 text-teal-700 transition group-hover:translate-x-1" />
            </div>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-navy-900">
              Rejoindre l&apos;atelier en direct
            </h2>
            <p className="mt-2 text-sm text-slate-700">
              Entrez avec le code PIN partagé et votre prénom pour participer aux sondages, quiz, Prompt Builder, galerie d&apos;applications et votes de groupes.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white">
              <span>Accéder à /join</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          <div className="md:col-span-5 grid gap-4">
            <Link
              href="/screen"
              className="group rounded-2xl border border-slate-700 bg-navy-800/90 p-5 transition hover:border-cyan-400"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                  <Monitor className="h-4 w-4" />
                  Affichage Vidéoprojecteur
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-cyan-300" />
              </div>
              <h3 className="mt-2 font-display text-xl font-bold text-white">
                Écran de projection (/screen)
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Affichage grand format pour la salle : diapositives, graphiques animés et QR code.
              </p>
            </Link>

            <Link
              href="/presenter"
              className="group rounded-2xl border border-slate-700 bg-navy-800/90 p-5 transition hover:border-amber-400"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <Presentation className="h-4 w-4" />
                  Accès Animateur Protégé
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-300" />
              </div>
              <h3 className="mt-2 font-display text-xl font-bold text-white">
                Console de pilotage (/presenter)
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Navigation, notes de script, gestion des activités, Mode Démo et statistiques.
              </p>
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-navy-800/50 px-4 py-3">
            <Users className="h-4 w-4 text-teal-400 shrink-0" />
            <span>Session de 120 minutes · ~20 collègues du primaire (1AEP–6AEP)</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-navy-800/50 px-4 py-3">
            <BookOpen className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>Contenu bilingue Français / Arabe (RTL) & exemples hors ligne</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-navy-800/50 px-4 py-3">
            <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
            <span>Zéro donnée personnelle d&apos;élève · Zéro compte requis</span>
          </div>
        </div>
      </div>

      <footer className="mx-auto mt-10 w-full max-w-5xl border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
        « Ne soyez pas seulement utilisateurs du numérique. Devenez créateurs de solutions pédagogiques. »
      </footer>
    </div>
  );
}
