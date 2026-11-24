import "server-only";
import { isSupabaseConfigured } from "@/lib/env";
import { localStore } from "./local-store";
import { supabaseStore } from "./supabase-store";

export function getWorkshopStore() {
  if (isSupabaseConfigured()) {
    return supabaseStore;
  }
  if (process.env.VERCEL === "1" || process.env.VERCEL_ENV === "production") {
    throw new Error(
      "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY) must be configured on Vercel. Local filesystem fallback is disabled in deployed environments."
    );
  }
  return localStore;
}
