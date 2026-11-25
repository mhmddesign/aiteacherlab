import { verifyPresenterSession } from "@/lib/auth/session";
import { getWorkshopPin } from "@/lib/env";
import { getWorkshopStore } from "@/lib/workshop/store";
import { PresenterShell } from "@/components/presenter/PresenterShell";

export const dynamic = "force-dynamic";

export default async function PresenterPage() {
  const presenter = await verifyPresenterSession().catch(() => null);
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
