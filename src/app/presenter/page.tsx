import Link from "next/link";
import { verifyPresenterSession } from "@/lib/auth/session";
import { getWorkshopPin } from "@/lib/env";
import { getWorkshopStore } from "@/lib/workshop/store";
import { getStudioStore } from "@/lib/studio/studio-store";
import { PresenterShell } from "@/components/presenter/PresenterShell";
import { StudioLivePresenterShell } from "@/components/studio/live/StudioLivePresenterShell";

export const dynamic = "force-dynamic";

interface PresenterPageProps {
  searchParams: Promise<{ sessionId?: string }>;
}

export default async function PresenterPage({ searchParams }: PresenterPageProps) {
  const { sessionId } = await searchParams;
  const presenter = await verifyPresenterSession().catch(() => null);

  if (sessionId) {
    const studioStore = getStudioStore();
    const studioSession = await studioStore.getSession(sessionId);
    if (!studioSession) {
      return (
        <main className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center p-6">
          <div className="max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center space-y-3">
            <h1 className="font-display text-xl font-bold">Session Studio introuvable</h1>
            <p dir="rtl" lang="ar" className="font-arabic text-sm text-slate-300">
              تعذر العثور على هذه الجلسة المباشرة.
            </p>
            <Link
              href="/studio"
              className="inline-block rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white"
            >
              Retour au Studio
            </Link>
          </div>
        </main>
      );
    }

    const aggregates = await studioStore.getSessionAggregates(studioSession.id);
    return (
      <StudioLivePresenterShell
        initialSession={studioSession}
        initialAggregates={aggregates}
        initialAuthenticated={Boolean(presenter)}
      />
    );
  }

  let initialSnapshot = null;
  let workshopPinHint: string | undefined;

  if (presenter) {
    try {
      const store = getWorkshopStore();
      initialSnapshot = await store.getPresenterSnapshot();
      workshopPinHint = getWorkshopPin();
    } catch (err) {
      console.error("[PresenterPage SSR]", err);
    }
  }

  return (
    <PresenterShell
      initialAuthenticated={Boolean(presenter && initialSnapshot)}
      initialSnapshot={initialSnapshot}
      workshopPinHint={workshopPinHint}
    />
  );
}
