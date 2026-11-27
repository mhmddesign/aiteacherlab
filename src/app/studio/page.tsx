import type { Metadata } from "next";
import { getWorkshopStore } from "@/lib/workshop/store";
import { StudioWorkspaceShell } from "@/components/studio/StudioWorkspaceShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Teacher Lab · Studio Multi-Salles · استوديو القاعات",
  description:
    "Espace permanent de préparation et de gestion de salles de formation bilingues FR + AR.",
};

export default async function StudioPage() {
  let initialSnapshot = null;
  try {
    const store = getWorkshopStore();
    initialSnapshot = await store.getPublicSnapshot();
  } catch (err) {
    console.error("[StudioPage SSR]", err);
  }

  return <StudioWorkspaceShell initialSnapshot={initialSnapshot} />;
}
