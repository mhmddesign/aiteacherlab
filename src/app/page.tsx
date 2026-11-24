import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Monitor,
  Presentation,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B1426] text-white flex flex-col justify-between px-4 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-5">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-300">
              <BilingualInline
                text={{
                  fr: "Province de Mediouna · Centre de Digitalisation",
                  ar: "إقليم مديونة · مركز الرقمنة",
                }}
              />
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-ivory-50">
              AI Teacher Lab ·{" "}
              <span dir="rtl" lang="ar" className="font-arabic text-2xl sm:text-4xl text-cyan-200">
                مختبر المعلم للذكاء الاصطناعي
              </span>
            </h1>
            <BilingualBlock
              text={{
                fr: "De l'IA à la création pédagogique · Atelier collaboratif pour les enseignantes et enseignants du primaire",
                ar: "من الذكاء الاصطناعي إلى الإبداع البيداغوجي · ورشة تشاركية لأستاذات وأساتذة التعليم الابتدائي",
              }}
              frClassName="text-sm sm:text-lg text-slate-300"
              arClassName="text-sm sm:text-base text-teal-200"
            />
          </div>
        </header>

        <div className="rounded-2xl border border-teal-500/30 bg-navy-800/80 p-5 text-slate-100 grid gap-3 md:grid-cols-2">
          <p dir="ltr" lang="fr" className="text-sm sm:text-base leading-relaxed text-slate-200">
            Bienvenue chers collègues du primaire public de la Province de Mediouna. Cet espace
            interactif bilingue est dédié au partage d&apos;expérience, à la structuration de prompts
            et à la création de mini-applications pédagogiques adaptées à nos classes.
          </p>
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-base sm:text-lg leading-relaxed text-teal-100"
          >
            مرحبا بالزميلات والزملاء أستاذات وأساتذة التعليم الابتدائي بإقليم مديونة. هذا الفضاء
            التفاعلي مخصص لتقاسم التجارب، بناء التوجيهات التربوية (Prompts)، وتطوير تطبيقات تعليمية
            بسيطة تلائم أقسامنا.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-12">
          <Link
            href="/join"
            className="md:col-span-7 group rounded-3xl border border-teal-400/50 bg-[#F8F6F1] p-7 text-slate-900 shadow-xl transition hover:border-teal-500 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-3.5 py-1 text-xs font-bold text-white">
                  <Smartphone className="h-3.5 w-3.5 shrink-0" />
                  <BilingualInline
                    text={{ fr: "Interface Participants", ar: "واجهة المشاركين" }}
                  />
                </span>
                <ArrowRight className="h-5 w-5 text-teal-700 transition group-hover:translate-x-1" />
              </div>

              <BilingualBlock
                text={{
                  fr: "Rejoindre l'atelier en direct",
                  ar: "الانضمام إلى الورشة مباشرة",
                }}
                className="mt-4"
                frClassName="font-display text-2xl sm:text-3xl font-bold text-navy-900"
                arClassName="text-xl sm:text-2xl font-bold text-teal-800"
              />

              <BilingualBlock
                text={{
                  fr: "Entrez avec le code PIN partagé et votre prénom pour participer aux sondages, quiz, Prompt Builder, galerie d'applications et votes de groupes.",
                  ar: "ادخلوا عبر رمز PIN المشترك واسمكم للمشاركة في الاستطلاعات، الروائز، مُنشئ التوجيهات، معرض التطبيقات وتصويت المجموعات.",
                }}
                className="mt-2"
                frClassName="text-sm text-slate-700"
                arClassName="text-sm text-slate-700"
              />
            </div>

            <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white">
              <BilingualInline text={{ fr: "Accéder à /join", ar: "الدخول إلى /join" }} />
              <ArrowRight className="h-4 w-4 shrink-0" />
            </div>
          </Link>

          <div className="md:col-span-5 grid gap-4">
            <Link
              href="/screen"
              className="group rounded-2xl border border-slate-700 bg-navy-800/90 p-5 transition hover:border-cyan-400 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                  <Monitor className="h-4 w-4 shrink-0" />
                  <BilingualInline
                    text={{ fr: "Affichage Vidéoprojecteur", ar: "شاشة العرض الجماعي" }}
                  />
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-cyan-300" />
              </div>
              <BilingualBlock
                text={{
                  fr: "Écran de projection (/screen)",
                  ar: "واجهة المسلاط العاكس (/screen)",
                }}
                frClassName="font-display text-xl font-bold text-white"
                arClassName="text-base font-bold text-cyan-200"
              />
              <BilingualBlock
                text={{
                  fr: "Affichage grand format pour la salle : diapositives, graphiques animés et QR code.",
                  ar: "عرض بخط كبير للقاعة: الشرائح، المبيانات المباشرة ورمز QR.",
                }}
                frClassName="text-xs text-slate-300"
                arClassName="text-xs text-slate-300"
              />
            </Link>

            <Link
              href="/presenter"
              className="group rounded-2xl border border-slate-700 bg-navy-800/90 p-5 transition hover:border-amber-400 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <Presentation className="h-4 w-4 shrink-0" />
                  <BilingualInline
                    text={{ fr: "Accès Animateur Protégé", ar: "ولوج المنشط المحمي" }}
                  />
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-300" />
              </div>
              <BilingualBlock
                text={{
                  fr: "Console de pilotage (/presenter)",
                  ar: "لوحة القيادة والتحكم (/presenter)",
                }}
                frClassName="font-display text-xl font-bold text-white"
                arClassName="text-base font-bold text-amber-200"
              />
              <BilingualBlock
                text={{
                  fr: "Navigation, notes de script, gestion des activités, Mode Démo et statistiques.",
                  ar: "التنقل، نص التقديم، تسيير الأنشطة، الوضع التجريبي والإحصائيات.",
                }}
                frClassName="text-xs text-slate-300"
                arClassName="text-xs text-slate-300"
              />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 text-xs text-slate-300">
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-navy-800/50 px-4 py-3">
            <Users className="mt-0.5 h-4 w-4 text-teal-400 shrink-0" />
            <BilingualBlock
              text={{
                fr: "Session de 120 minutes · ~20 collègues (1AEP–6AEP)",
                ar: "حصة من 120 دقيقة · حوالي 20 زميلاً (1AEP–6AEP)",
              }}
            />
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-navy-800/50 px-4 py-3">
            <BookOpen className="mt-0.5 h-4 w-4 text-cyan-400 shrink-0" />
            <BilingualBlock
              text={{
                fr: "Interface bilingue FR/AR (RTL) & exemples hors ligne",
                ar: "واجهة ثنائية اللغة فرنسية/عربية ونماذج بدون إنترنت",
              }}
            />
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-navy-800/50 px-4 py-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-teal-400 shrink-0" />
            <BilingualBlock
              text={{
                fr: "Zéro donnée personnelle d'élève · Zéro compte requis",
                ar: "صفر معطيات شخصية للتلاميذ · بدون حسابات",
              }}
            />
          </div>
        </div>
      </div>

      <footer className="mx-auto mt-10 w-full max-w-5xl border-t border-slate-800 pt-4 text-center text-xs text-slate-400 space-y-1">
        <p dir="ltr" lang="fr">
          « Ne soyez pas seulement utilisateurs du numérique. Devenez créateurs de solutions pédagogiques. »
        </p>
        <p dir="rtl" lang="ar" className="font-arabic text-cyan-200">
          « لا تكونوا مجرد مستعملين للتكنولوجيا الرقمية، بل كونوا صانعي حلول بيداغوجية. »
        </p>
      </footer>
    </div>
  );
}
