import { Loader2 } from "lucide-react";

export default function StudioLoading() {
  return (
    <div className="min-h-[100dvh] bg-navy-950 text-ivory-50 flex flex-col items-center justify-center gap-3 px-4">
      <Loader2 className="h-7 w-7 animate-spin text-teal-bright" />
      <p className="text-sm font-semibold text-ivory-50">
        Chargement du Studio Multi-Salles...
      </p>
      <p dir="rtl" lang="ar" className="font-arabic text-sm text-teal-bright">
        جاري تحميل استوديو القاعات...
      </p>
    </div>
  );
}
