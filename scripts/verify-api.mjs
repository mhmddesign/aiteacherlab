/**
 * API Security, RLS Separation, Duplicate Prevention & State Flow Verification
 * Usage: node scripts/verify-api.mjs [baseUrl]
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function loadLocalEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const out = {};
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq > 0) out[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return out;
}

const localEnv = loadLocalEnv();
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const PIN = process.env.WORKSHOP_PIN || localEnv.WORKSHOP_PIN;
const PASSCODE = process.env.FACILITATOR_PASSCODE || localEnv.FACILITATOR_PASSCODE;

if (!PIN || !PASSCODE) {
  throw new Error("WORKSHOP_PIN and FACILITATOR_PASSCODE must be set in env or .env.local.");
}

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    redirect: "manual",
    ...opts,
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  return { status: res.status, json, setCookies, headers: res.headers };
}

function extractCookieHeader(setCookies) {
  return setCookies
    .map((c) => c.split(";")[0])
    .filter(Boolean)
    .join("; ");
}

async function run() {
  console.log(`\n=== Verifying AI Teacher Lab APIs at ${BASE} ===`);

  // 1. Unauthenticated presenter endpoints MUST fail
  const unauthState = await req("/api/presenter/state");
  assert.equal(unauthState.status, 401, "Unauthenticated /api/presenter/state must return 401");

  const unauthControl = await req("/api/presenter/control", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentSlideId: "s02-needs-poll" }),
  });
  assert.equal(unauthControl.status, 401, "Unauthenticated /api/presenter/control must return 401");

  // 2. Invalid workshop PIN must fail with 401
  const badPin = await req("/api/participant/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: "000000", displayName: "Testeur" }),
  });
  assert.equal(badPin.status, 401, "Invalid PIN must return 401");

  // 3. Valid join issues HttpOnly participant cookie
  const joinRes = await req("/api/participant/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: PIN, displayName: "Khadija Test" }),
  });
  assert.equal(joinRes.status, 200, `Valid join must succeed, got ${JSON.stringify(joinRes.json)}`);
  const participantCookie = extractCookieHeader(joinRes.setCookies);
  assert.ok(participantCookie.includes("ai_lab_participant_session="), "Participant session cookie missing");

  // 4. Participant CANNOT access presenter routes or presenter realtime scope
  const pTryingPresenter = await req("/api/presenter/state", {
    headers: { Cookie: participantCookie },
  });
  assert.equal(pTryingPresenter.status, 401, "Participant cookie must NOT grant presenter access");

  const pTryingRt = await req("/api/realtime/token?scope=presenter", {
    headers: { Cookie: participantCookie },
  });
  assert.equal(pTryingRt.status, 403, "Participant must NOT obtain presenter Realtime token");

  // 5. Presenter login succeeds
  const presLogin = await req("/api/presenter/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passcode: PASSCODE }),
  });
  assert.equal(presLogin.status, 200, "Presenter login must succeed");
  const presenterCookie = extractCookieHeader(presLogin.setCookies);
  assert.ok(presenterCookie.includes("ai_lab_presenter_session="), "Presenter cookie missing");

  // 6. Presenter navigates to Section 2 Poll and opens it
  const openPoll = await req("/api/presenter/control", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: presenterCookie },
    body: JSON.stringify({
      currentSlideId: "s02-needs-poll",
      activeActivityKey: "poll-needs",
      activityStatus: "open",
      demoMode: false,
      isPaused: false,
    }),
  });
  assert.equal(openPoll.status, 200, "Presenter control must succeed");

  // 7. Participant submits poll vote -> succeeds; duplicate -> 409
  const vote1 = await req("/api/participant/respond", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: participantCookie },
    body: JSON.stringify({
      activityKey: "poll-needs",
      itemKey: "main",
      selectedOption: "diff",
    }),
  });
  assert.equal(vote1.status, 200, "First poll vote must succeed");

  const dupVote = await req("/api/participant/respond", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: participantCookie },
    body: JSON.stringify({
      activityKey: "poll-needs",
      itemKey: "main",
      selectedOption: "prep",
    }),
  });
  assert.equal(dupVote.status, 409, "Duplicate poll vote must be rejected with 409");

  // 8. Public workshop state NEVER leaks participant names or tokens
  const pubState = await req("/api/workshop/state");
  assert.equal(pubState.status, 200);
  const serialized = JSON.stringify(pubState.json);
  assert.ok(!serialized.includes("Khadija Test"), "Public state must NOT leak participant display names");
  assert.ok(!serialized.includes("sessionToken"), "Public state must NOT leak session tokens");

  // 9. Closed activity blocks submission
  await req("/api/presenter/control", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: presenterCookie },
    body: JSON.stringify({ activityStatus: "closed" }),
  });

  const join2 = await req("/api/participant/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: PIN, displayName: "Youssef Test" }),
  });
  const p2Cookie = extractCookieHeader(join2.setCookies);

  const blockedVote = await req("/api/participant/respond", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: p2Cookie },
    body: JSON.stringify({
      activityKey: "poll-needs",
      itemKey: "main",
      selectedOption: "prep",
    }),
  });
  assert.equal(blockedVote.status, 409, "Closed activity must reject submissions with 409");

  // 10. Server-side Quiz grading & reveal
  await req("/api/presenter/control", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: presenterCookie },
    body: JSON.stringify({
      currentSlideId: "s03-quiz",
      activeActivityKey: "quiz-genai",
      activityStatus: "open",
    }),
  });

  const qRight = await req("/api/participant/respond", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: participantCookie },
    body: JSON.stringify({ activityKey: "quiz-genai", itemKey: "q1", selectedOption: "b" }),
  });
  assert.equal(qRight.status, 200);
  assert.equal(qRight.json.response.isCorrect, true, "Server must grade q1='b' as correct");

  const qWrong = await req("/api/participant/respond", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: p2Cookie },
    body: JSON.stringify({ activityKey: "quiz-genai", itemKey: "q1", selectedOption: "a" }),
  });
  assert.equal(qWrong.status, 200);
  assert.equal(qWrong.json.response.isCorrect, false, "Server must grade q1='a' as incorrect");

  // 11. Gallery contribution requires privacyConfirmed: true
  const badGal = await req("/api/gallery/contribute", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: participantCookie },
    body: JSON.stringify({
      contributorName: "Khadija Test",
      appTitle: "Test App",
      gradeRange: "4AEP",
      discipline: "Français",
      language: "Français (LTR)",
      learningObjective: "Objectif de test en classe",
      description: "Description de test pour la galerie",
      classroomInstructions: "Projeter en classe",
      appResource: "demo.html",
      testedFeatures: ["Hors ligne"],
      privacyConfirmed: false,
    }),
  });
  assert.equal(badGal.status, 400, "Gallery contribution without privacy confirmation must be rejected");

  // 12. Reset activity & Purge participant data
  const resetRes = await req("/api/presenter/reset-activity", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: presenterCookie },
    body: JSON.stringify({ activityKey: "poll-needs" }),
  });
  assert.equal(resetRes.status, 200, "Activity reset must succeed");

  const purgeRes = await req("/api/presenter/participants", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Cookie: presenterCookie },
    body: JSON.stringify({ confirmation: "SUPPRIMER" }),
  });
  assert.equal(purgeRes.status, 200, "Participant purge must succeed");
  assert.equal(purgeRes.json.totalParticipants, 0, "Real participants must be 0 after purge");

  // 13. Rate limiting enforcement on repeated bad presenter logins from isolated test IP
  let rateLimited = false;
  for (let i = 0; i < 12; i++) {
    const attempt = await req("/api/presenter/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.99.99.99",
      },
      body: JSON.stringify({ passcode: "WRONG-PASSCODE" }),
    });
    if (attempt.status === 429) {
      rateLimited = true;
      break;
    }
  }
  assert.ok(rateLimited, "Rate limiting must trigger 429 after 10 bad presenter logins");

  console.log("ALL API SECURITY & WORKFLOW ASSERTIONS PASSED!");
}

run().catch((err) => {
  console.error("VERIFICATION FAILED:", err);
  process.exit(1);
});
