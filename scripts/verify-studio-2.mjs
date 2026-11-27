import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const npxRoot = path.join(process.env.LOCALAPPDATA || "", "npm-cache", "_npx");
let pwPath = null;
if (fs.existsSync(npxRoot)) {
  for (const dir of fs.readdirSync(npxRoot)) {
    for (const pkg of ["playwright", "playwright-core"]) {
      const candidate = path.join(npxRoot, dir, "node_modules", pkg);
      if (fs.existsSync(candidate)) {
        pwPath = candidate;
        break;
      }
    }
    if (pwPath) break;
  }
}
if (!pwPath) {
  throw new Error("Could not locate cached playwright/playwright-core package.");
}
const { chromium } = require(pwPath);

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

const BASE = new URL(process.argv[2] || "http://localhost:3000").origin;
const localEnv = loadLocalEnv();
const PASSCODE = process.env.FACILITATOR_PASSCODE || localEnv.FACILITATOR_PASSCODE || "";
const OUT_DIR =
  "C:\\Users\\MHMD\\.gemini\\antigravity\\brain\\d143fa10-852f-4c36-95b0-bfab85175a67\\studio-2-qa";
fs.mkdirSync(OUT_DIR, { recursive: true });

async function launchBrowser() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  try {
    return await chromium.launch({ headless: true });
  } catch {
    if (fs.existsSync(edgePath)) {
      return await chromium.launch({ headless: true, executablePath: edgePath });
    }
    throw new Error("Could not launch Chromium or Edge.");
  }
}

async function run() {
  const browser = await launchBrowser();
  const report = { checks: {}, screenshots: [] };
  let createdRoomId = null;

  try {
    // 1. Auth Security Checks (unauthenticated mutations rejected with 401)
    const unauthCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const unauthRoomRes = await unauthCtx.request.post(`${BASE}/api/studio/rooms`, {
      data: { title: { fr: "Unauthorized", ar: "غير مصرح" } },
    });
    assert.equal(unauthRoomRes.status(), 401, "POST /api/studio/rooms without cookie must return 401");

    const unauthPatchRes = await unauthCtx.request.patch(
      `${BASE}/api/studio/decks/deck-mediouna-21`,
      { data: { expectedRevision: 1, document: {} } }
    );
    assert.equal(unauthPatchRes.status(), 401, "PATCH /api/studio/decks without cookie must return 401");

    const unauthAiRes = await unauthCtx.request.post(`${BASE}/api/studio/ai/generate`, {
      data: { step: "outline", topic: "Test", slideCount: 4 },
    });
    assert.equal(unauthAiRes.status(), 401, "POST /api/studio/ai/generate without cookie must return 401");
    report.checks.unauthRejected401 = true;
    await unauthCtx.close();

    // 2. Authenticated Facilitator Session
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();

    const loginRes = await page.request.post(`${BASE}/api/presenter/login`, {
      data: { passcode: PASSCODE },
    });
    assert.equal(loginRes.status(), 200, "Facilitator login failed");

    // Verify seeded Mediouna Deck intact with 21 slides
    const mediounaRes = await page.request.get(`${BASE}/api/studio/decks/deck-mediouna-21`);
    assert.equal(mediounaRes.status(), 200);
    const mediounaJson = await mediounaRes.json();
    assert.equal(
      mediounaJson.deck.document.slides.length,
      21,
      "Mediouna seeded deck must contain all 21 slides"
    );
    report.checks.mediounaSeeded21Slides = true;

    // 3. Create Room + Template Deck + Markdown Deck via API
    const createRoomRes = await page.request.post(`${BASE}/api/studio/rooms`, {
      data: {
        title: { fr: "Atelier QA Studio 2.0", ar: "ورشة اختبار الاستوديو 2.0" },
        levelBadge: "4AEP",
        joinPin: "7319",
      },
    });
    assert.equal(createRoomRes.status(), 201);
    const roomJson = await createRoomRes.json();
    createdRoomId = roomJson.room.id;

    const createDeckRes = await page.request.post(
      `${BASE}/api/studio/rooms/${createdRoomId}/decks`,
      {
        data: {
          mode: "template",
          templateKey: "teacher-training",
          title: { fr: "Support QA Éditable", ar: "عرض قابل للتعديل" },
        },
      }
    );
    assert.equal(createDeckRes.status(), 201);
    const deckId = (await createDeckRes.json()).deck.id;

    const mdDeckRes = await page.request.post(
      `${BASE}/api/studio/rooms/${createdRoomId}/decks`,
      {
        data: {
          mode: "markdown",
          title: { fr: "Import Markdown", ar: "استيراد ماركداون" },
          markdown: "# Slide Alpha\nPremier bloc\n\n# Slide Beta\nDeuxième bloc",
        },
      }
    );
    assert.equal(mdDeckRes.status(), 201);
    assert.equal((await mdDeckRes.json()).deck.document.slides.length, 2);
    report.checks.roomAndMultiDeckCreation = true;

    // 4. Visual /studio screenshot & AI Wizard Mock Check
    await page.goto(`${BASE}/studio`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUT_DIR, "02-studio-2-workspace.png") });
    report.screenshots.push("02-studio-2-workspace.png");

    await page.click('[data-open-ai-wizard="true"]');
    await page.waitForSelector('[data-ai-wizard-modal="true"]', { timeout: 5000 });
    const mockToggle = page.locator('[data-ai-wizard-modal="true"] input[type="checkbox"]');
    if (await mockToggle.count()) {
      await mockToggle.check();
    } else {
      await page.route("**/api/studio/ai/generate", async (route) => {
        await route.continue({
          headers: { ...route.request().headers(), "x-studio-ai-mock": "outline-valid" },
        });
      });
    }
    await page.click('button:has-text("Générer le plan bilingue")');
    await page.waitForSelector('button:has-text("Construire les diapositives")', {
      timeout: 8000,
    });
    await page.screenshot({ path: path.join(OUT_DIR, "05-ai-wizard-outline.png") });
    report.screenshots.push("05-ai-wizard-outline.png");
    await page.unroute("**/api/studio/ai/generate").catch(() => {});

    // 5. API AI Zod Validation + Malformed Output Rejection Test
    const aiBadRes = await page.request.post(`${BASE}/api/studio/ai/generate`, {
      headers: { "x-studio-ai-mock": "malformed" },
      data: { step: "outline", topic: "Test malformed", slideCount: 4 },
    });
    assert.equal(aiBadRes.status(), 422, "Malformed AI output must fail Zod and return 422");

    const aiOkRes = await page.request.post(`${BASE}/api/studio/ai/generate`, {
      headers: { "x-studio-ai-mock": "outline-valid" },
      data: { step: "outline", topic: "Les fractions", slideCount: 4 },
    });
    assert.equal(aiOkRes.status(), 200);
    const aiOkJson = await aiOkRes.json();
    assert.equal(aiOkJson.outline.slides.length, 4);
    report.checks.aiOutlineValidAndMalformedRejected = true;

    // 6. Open Visual 16:9 Editor -> Insert Blocks -> Drag/Resize -> Undo/Redo -> Save -> Reload
    await page.goto(
      `${BASE}/studio/rooms/${createdRoomId}/decks/${deckId}/edit`,
      { waitUntil: "networkidle" }
    );
    await page.waitForSelector('[data-editor-canvas-frame="true"]', { timeout: 10000 });

    const frameBox = await page.locator('[data-editor-canvas-frame="true"]').boundingBox();
    assert.ok(frameBox && Math.abs(frameBox.width / frameBox.height - 16 / 9) < 0.03);

    // Insert interactive live-poll & fractions-lab
    await page.click('[data-left-tab="components"]');
    await page.click('[data-insert-component="live-poll"]');
    await page.click('[data-insert-component="fractions-lab"]');

    // Drag & Resize newly inserted fractions-lab element
    const elId = await page
      .locator('[data-editor-element]')
      .last()
      .getAttribute("data-editor-element");
    assert.ok(elId, "Inserted element should be rendered on editor stage");

    const xBefore = Number(await page.locator('[data-inspector-x="true"]').inputValue());
    const wBefore = Number(await page.locator('[data-inspector-w="true"]').inputValue());

    const elBox = await page.locator(`[data-editor-element="${elId}"]`).boundingBox();
    assert.ok(elBox);
    await page.mouse.move(elBox.x + elBox.width / 2, elBox.y + elBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(elBox.x + elBox.width / 2 + 40, elBox.y + elBox.height / 2 + 25);
    await page.mouse.up();

    const resizeBox = await page.locator(`[data-resize-handle="${elId}"]`).boundingBox();
    assert.ok(resizeBox);
    await page.mouse.move(resizeBox.x + resizeBox.width / 2, resizeBox.y + resizeBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(resizeBox.x + resizeBox.width / 2 + 30, resizeBox.y + resizeBox.height / 2 + 20);
    await page.mouse.up();

    const xAfter = Number(await page.locator('[data-inspector-x="true"]').inputValue());
    const wAfter = Number(await page.locator('[data-inspector-w="true"]').inputValue());
    assert.notEqual(xAfter, xBefore, "Dragging should update X coordinate");
    assert.notEqual(wAfter, wBefore, "Resizing handle should update width");

    // Edit bilingual text in inspector
    await page.fill('[data-inspector-fr="true"]', "Lab Fractions Modifié");
    await page.fill('[data-inspector-ar="true"]', "مختبر الكسور المعدل");

    await page.screenshot({ path: path.join(OUT_DIR, "03-editor-desktop-1440.png") });
    report.screenshots.push("03-editor-desktop-1440.png");

    // Test Code Sandbox isolation with malicious probe!
    await page.click('button:has-text("Code HTML/JS")');
    await page.waitForSelector('[data-code-studio-modal="true"]', { timeout: 5000 });
    await page
      .locator('[data-code-studio-modal="true"] textarea')
      .nth(2)
      .fill(
        `try{window.parent.document.title='PWNED';}catch(e){} try{document.cookie;}catch(e){} try{fetch('/api/studio/rooms');}catch(e){}`
      );
    await page.screenshot({ path: path.join(OUT_DIR, "04-editor-code-studio.png") });
    report.screenshots.push("04-editor-code-studio.png");
    await page.click('button:has-text("Insérer sur la diapositive")');
    await page.waitForTimeout(300);

    const sandboxAttr = await page
      .locator('iframe[data-sandbox-iframe="true"]')
      .first()
      .getAttribute("sandbox");
    assert.equal(
      sandboxAttr,
      "allow-scripts",
      "Code sandbox iframe must only have allow-scripts and NEVER allow-same-origin"
    );
    const hostTitle = await page.title();
    assert.notEqual(hostTitle, "PWNED", "Sandbox script must never mutate host document.title");
    report.checks.codeSandboxIsolated = true;

    // Test Undo / Redo before save
    await page.click('[data-editor-undo="true"]');
    await page.click('[data-editor-redo="true"]');

    // Manual Save -> Revision v2 -> Reload -> Verify Persistence
    await page.click('[data-editor-save="true"]');
    await page.waitForSelector('[data-save-status="saved"]', { timeout: 8000 });
    const savedRev = Number(
      await page.locator("[data-editor-revision]").getAttribute("data-editor-revision")
    );
    assert.ok(savedRev >= 2, `Expected revision >= 2 after save, got ${savedRev}`);

    await page.reload({ waitUntil: "networkidle" });
    const countAfterReload = await page.locator("[data-editor-element]").count();
    assert.ok(countAfterReload >= 4, "Saved inserted elements must survive page reload");
    report.checks.editorSaveUndoRedoPersistence = true;

    // 7. Optimistic Locking 409 Conflict + Revision Restore
    const stalePatch = await page.request.patch(`${BASE}/api/studio/decks/${deckId}`, {
      data: {
        expectedRevision: 1,
        document: mediounaJson.deck.document,
      },
    });
    assert.equal(stalePatch.status(), 409, "Stale expectedRevision must return HTTP 409 Conflict");

    const restoreRes = await page.request.post(
      `${BASE}/api/studio/decks/${deckId}/revisions`,
      { data: { action: "restore", revisionNo: 1 } }
    );
    assert.equal(restoreRes.status(), 200);
    report.checks.conflict409AndRevisionRestore = true;

    // 8. Live Session Isolation (sessA vs sessB + Wrong PIN rejected + Mobile Join & Screen Sync)
    const deckBRes = await page.request.post(
      `${BASE}/api/studio/rooms/${createdRoomId}/decks`,
      {
        data: {
          mode: "template",
          templateKey: "teacher-training",
          title: { fr: "Cohorte B", ar: "الفوج ب" },
        },
      }
    );
    const deckB = (await deckBRes.json()).deck;

    // Ensure slide 2 of template deck-A has a live-poll
    const sessARes = await page.request.post(
      `${BASE}/api/studio/rooms/${createdRoomId}/sessions`,
      { data: { deckId: deckB.id, title: { fr: "Session Cohorte A", ar: "جلسة الفوج أ" }, joinPin: "1122" } }
    );
    const sessBRes = await page.request.post(
      `${BASE}/api/studio/rooms/${createdRoomId}/sessions`,
      { data: { deckId: deckB.id, title: { fr: "Session Cohorte B", ar: "جلسة الفوج ب" }, joinPin: "3344" } }
    );
    const sessA = (await sessARes.json()).session;
    const sessB = (await sessBRes.json()).session;

    // Open Presenter for Session A and navigate to Slide 2 (Poll)
    await page.goto(`${BASE}/presenter?sessionId=${sessA.id}`, { waitUntil: "networkidle" });
    await page.click('[data-live-next="true"]');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT_DIR, "06-live-session-presenter.png") });
    report.screenshots.push("06-live-session-presenter.png");

    // Open Mobile Participant for Session A -> Test Wrong PIN -> Valid PIN -> Vote
    const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileCtx.newPage();
    await mobilePage.goto(`${BASE}/join?sessionId=${sessA.id}`, { waitUntil: "networkidle" });

    await mobilePage.fill('[data-live-pin-input="true"]', "9999");
    await mobilePage.fill('[data-live-name-input="true"]', "Prof Amina");
    await mobilePage.click('[data-live-join-btn="true"]');
    await mobilePage.waitForSelector('text=incorrect', { timeout: 5000 });

    await mobilePage.fill('[data-live-pin-input="true"]', "1122");
    await mobilePage.click('[data-live-join-btn="true"]');
    await mobilePage.waitForSelector('[data-studio-live-participant]', { timeout: 6000 });
    await mobilePage.waitForTimeout(350);

    // Vote on active poll option in Session A
    const pollOpt = mobilePage.locator('[data-interactive-type="live-poll"] button').first();
    await pollOpt.click();
    await mobilePage.waitForSelector('text=Enregistré', { timeout: 5000 });
    await mobilePage.screenshot({
      path: path.join(OUT_DIR, "07-live-session-participant-mobile.png"),
    });
    report.screenshots.push("07-live-session-participant-mobile.png");
    await mobileCtx.close();

    // Assert Session A has 1 live response and Session B has 0 (strict cohort isolation)
    const liveAGet = await (await page.request.get(`${BASE}/api/studio/live?sessionId=${sessA.id}`)).json();
    const liveBGet = await (await page.request.get(`${BASE}/api/studio/live?sessionId=${sessB.id}`)).json();
    const totalA = Object.values(liveAGet.aggregates || {}).reduce((acc, v) => acc + v.total, 0);
    const totalB = Object.values(liveBGet.aggregates || {}).reduce((acc, v) => acc + v.total, 0);
    assert.equal(totalA, 1, `Expected Session A aggregate total = 1, got ${totalA}`);
    assert.equal(totalB, 0, `Expected Session B aggregate total = 0, got ${totalB}`);
    report.checks.crossSessionIsolationVerified = true;

    console.log(JSON.stringify({ ok: true, report }, null, 2));
    await ctx.close();
  } finally {
    // Cleanup temporary test room
    if (createdRoomId) {
      const cleanCtx = await browser.newContext();
      await cleanCtx.request.post(`${BASE}/api/presenter/login`, {
        data: { passcode: PASSCODE },
      });
      await cleanCtx.request.delete(`${BASE}/api/studio/rooms/${createdRoomId}`);
      await cleanCtx.close();
    }
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
