import "server-only";
import { isSupabaseConfigured } from "@/lib/env";
import { localStore } from "./local-store";
import { supabaseStore } from "./supabase-store";

export function getWorkshopStore() {
  return isSupabaseConfigured() ? supabaseStore : localStore;
}
