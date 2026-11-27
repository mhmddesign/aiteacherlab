import Link from "next/link";
import { getWorkshopStore } from "@/lib/workshop/store";
import { getStudioStore } from "@/lib/studio/studio-store";
import { ProjectorShell } from "@/components/screen/ProjectorShell";
import { StudioLiveProjectorShell } from "@/components/studio/live/StudioLiveProjectorShell";

export const dynamic = "force-dynamic";

interface ScreenPageProps {
  searchParams: Promise<{ sessionId?: string }>;
}

export default async function ScreenPage({ searchParams }: ScreenPageProps) {
  const { sessionId } = await searchParams;

  if (sessionId) {
    const studioStore = getStudioStore();
    const studioSession = await studioStore.getSession(sessionId);
    if (!studioSession) {
      return (
        <main className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center p-6">
          <div className="max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center space-y-3">
            <h1 className="font-display text-xl font-bold">Écran session introuvable</h1>
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
      <StudioLiveProjectorShell
        initialSession={studioSession}
        initialAggregates={aggregates}
      />
    );
  }

  const store = getWorkshopStore();
  const snapshot = await store.getPublicSnapshot();

  return <ProjectorShell initialSnapshot={snapshot} />;
}
