"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createRealtimeBrowserClient(
  getAccessToken: () => Promise<string | null>
): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).trim();

  if (!url || !key || url.includes("your-project-ref") || key.includes("replace_me")) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    accessToken: getAccessToken,
  });
}
