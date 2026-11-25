import React from "react";
import { Loader2 } from "lucide-react";
import { BilingualBlock } from "@/components/ui/Bilingual";

export function RouteLoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col">
      <div className="h-1 w-full bg-slate-900 overflow-hidden">
        <div className="h-full w-1/3 bg-teal-400 animate-pulse" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
        <BilingualBlock
          text={{
            fr: "Chargement de l'atelier...",
            ar: "جاري تحميل الورشة...",
          }}
          frClassName="text-sm font-semibold text-slate-200"
          arClassName="text-sm font-semibold text-teal-300"
        />
      </div>
    </div>
  );
}
