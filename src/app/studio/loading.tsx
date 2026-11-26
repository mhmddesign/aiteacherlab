import { Loader2 } from "lucide-react";

export default function StudioLoading() {
  return (
    <div className="min-h-[100dvh] bg-[#060B16] text-white flex flex-col items-center justify-center gap-3 px-4">
      <Loader2 className="h-7 w-7 animate-spin text-teal-400" />
      <p className="text-sm font-semibold text-slate-200">
        Chargement du Studio Multi-Salles...
      </p>
      <p dir="rtl" lang="ar" className="font-arabic text-sm text-teal-300">
        جاري تحميل استوديو القاعات...
      </p>
    </div>
  );
}
