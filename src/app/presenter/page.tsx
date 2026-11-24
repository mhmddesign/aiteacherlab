import { verifyPresenterSession } from "@/lib/auth/session";
import { getWorkshopPin } from "@/lib/env";
import { getWorkshopStore } from "@/lib/workshop/store";
import { PresenterShell } from "@/components/presenter/PresenterShell";

export const dynamic = "force-dynamic";

export default async function PresenterPage() {
  const presenter = await verifyPresenterSession();
  const store = getWorkshopStore();
  const initialSnapshot = presenter ? await store.getPresenterSnapshot() : null;

  return (
    <PresenterShell
      initialAuthenticated={Boolean(presenter)}
      initialSnapshot={initialSnapshot}
      workshopPinHint={getWorkshopPin()}
    />
  );
}
