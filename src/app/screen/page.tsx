import { getWorkshopStore } from "@/lib/workshop/store";
import { ProjectorShell } from "@/components/screen/ProjectorShell";

export const dynamic = "force-dynamic";

export default async function ScreenPage() {
  const store = getWorkshopStore();
  const snapshot = await store.getPublicSnapshot();

  return <ProjectorShell initialSnapshot={snapshot} />;
}
