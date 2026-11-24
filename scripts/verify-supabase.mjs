/**
 * Live Supabase RLS & Schema Verification Script
 * Run after populating .env.local and executing supabase/migrations/*.sql:
 *   node --env-file=.env.local scripts/verify-supabase.mjs
 */

import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const pubKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !pubKey || !secretKey || url.includes("your-project-ref")) {
  console.error("Missing real Supabase environment variables in .env.local.");
  process.exit(1);
}

const anon = createClient(url, pubKey, { auth: { persistSession: false } });
const admin = createClient(url, secretKey, { auth: { persistSession: false } });

async function run() {
  console.log("=== Verifying Supabase Schema & RLS ===");

  // 1. Anon client MUST be denied direct read on participants and responses
  const { data: anonParticipants, error: pErr } = await anon
    .from("participants")
    .select("*");
  assert.ok(
    pErr || !anonParticipants || anonParticipants.length === 0,
    "Anon client must NOT be able to read participants table directly"
  );

  const { data: anonResponses, error: rErr } = await anon
    .from("responses")
    .select("*");
  assert.ok(
    rErr || !anonResponses || anonResponses.length === 0,
    "Anon client must NOT be able to read responses table directly"
  );

  // 2. Admin client sees seeded workshop and 8 activities
  const { data: workshop, error: wErr } = await admin
    .from("workshops")
    .select("id, slug")
    .eq("slug", process.env.WORKSHOP_SLUG || "mediouna-ai-teacher-lab")
    .single();
  assert.ifError(wErr);
  assert.ok(workshop?.id, "Seeded workshop must exist");

  const { count: actCount } = await admin
    .from("activities")
    .select("id", { count: "exact", head: true })
    .eq("workshop_id", workshop.id);
  assert.equal(actCount, 8, "Expected 8 seeded activities");

  console.log("SUPABASE RLS & SCHEMA VERIFICATION PASSED!");
}

run().catch((err) => {
  console.error("SUPABASE VERIFICATION FAILED:", err);
  process.exit(1);
});
