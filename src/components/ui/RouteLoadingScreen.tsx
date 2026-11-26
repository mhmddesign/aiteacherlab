import React from "react";
import { Loader2 } from "lucide-react";
import { BilingualBlock } from "@/components/ui/Bilingual";

export function RouteLoadingScreen() {
  return (
    <div className="min-h-screen bg-navy-950 text-ivory-50 flex flex-col">
      <div className="h-1 w-full bg-navy-900 overflow-hidden">
        <div className="h-full w-1/3 bg-teal-bright animate-pulse" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-bright" />
        <BilingualBlock
          text={{
            fr: "Chargement de l'atelier...",
            ar: "جاري تحميل الورشة...",
          }}
          frClassName="text-sm font-semibold text-ivory-50"
          arClassName="text-sm font-semibold text-teal-bright"
        />
      </div>
    </div>
  );
}
