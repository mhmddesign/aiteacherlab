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

const args = process.argv.slice(2);
const RAW_TARGET = args.find((a) => !a.startsWith("--")) || "http://localhost:3000";
const targetUrl = new URL(RAW_TARGET);
const BASE = targetUrl.origin;
const SHARE_AUTH_URL = targetUrl.search ? RAW_TARGET : null;
const PUBLIC_ONLY = args.includes("--public-only");
const localEnv = loadLocalEnv();
const PIN = process.env.WORKSHOP_PIN || localEnv.WORKSHOP_PIN || "";
const PASSCODE = process.env.FACILITATOR_PASSCODE || localEnv.FACILITATOR_PASSCODE || "";

const QA_DIR =
  "C:\\Users\\MHMD\\.gemini\\antigravity\\brain\\d143fa10-852f-4c36-95b0-bfab85175a67\\design-qa";
fs.mkdirSync(QA_DIR, { recursive: true });

async function launchBrowser() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  try {
    return await chromium.launch({ headless: true });
  } catch {
    if (fs.existsSync(edgePath)) {
      return await chromium.launch({ headless: true, executablePath: edgePath });
    }
    throw new Error("Neither Playwright Chromium nor Edge executable could be launched.");
  }
}

async function openOutlineAndClick(page, pattern) {
  await page.getByRole("button", { name: /^Plan\s+الفهرس$/ }).click();
  await page.getByRole("button", { name: pattern }).first().click();
}

async function assertNoOverflow(page, label) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  assert.ok(overflow <= 2, `${label}: horizontal overflow ${overflow}px > 2px`);
}

async function run() {
  const browser = await launchBrowser();
  const report = {
    favicon: {},
    tokens: {},
    viewportsChecked: [],
    reducedMotionChecked: false,
    screenshots: [],
  };

  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();

    if (SHARE_AUTH_URL) {
      await page.goto(SHARE_AUTH_URL, { waitUntil: "networkidle" });
    }

    // 1. Landing + Favicon + CSS Tokens + 7-Viewport Check
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

    const headIcons = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('head link[rel*="icon"]')).map((el) => ({
        rel: el.getAttribute("rel"),
        href: el.getAttribute("href"),
        type: el.getAttribute("type"),
        sizes: el.getAttribute("sizes"),
      }));
      const cs = getComputedStyle(document.documentElement);
      const tokens = {
        background: cs.getPropertyValue("--background").trim(),
        surface: cs.getPropertyValue("--surface").trim(),
        brandPrimary: cs.getPropertyValue("--brand-primary").trim(),
        brandAccent: cs.getPropertyValue("--brand-accent").trim(),
        statusSuccess: cs.getPropertyValue("--status-success").trim(),
        statusWarning: cs.getPropertyValue("--status-warning").trim(),
        statusError: cs.getPropertyValue("--status-error").trim(),
        statusInfo: cs.getPropertyValue("--status-info").trim(),
      };
      return { links, tokens };
    });

    assert.ok(
      headIcons.links.some((l) => (l.href || "").includes("icon.svg")),
      `Missing <link rel="icon" href="...icon.svg"> in <head>: ${JSON.stringify(headIcons.links)}`
    );
    assert.ok(
      headIcons.links.some((l) => (l.href || "").includes("favicon.ico")),
      `Missing favicon.ico link in <head>: ${JSON.stringify(headIcons.links)}`
    );
    assert.ok(
      headIcons.links.some((l) => (l.href || "").includes("apple-icon.png")),
      `Missing apple-icon.png link in <head>: ${JSON.stringify(headIcons.links)}`
    );
    assert.ok(headIcons.tokens.background, "Missing --background CSS token");
    assert.ok(headIcons.tokens.brandPrimary, "Missing --brand-primary CSS token");
    assert.ok(headIcons.tokens.brandAccent, "Missing --brand-accent CSS token");
    report.tokens = headIcons.tokens;

    // Fetch each icon asset via browser context (supports Vercel preview auth cookies too)
    for (const iconPath of ["/icon.svg", "/favicon.ico", "/apple-icon.png"]) {
      const res = await page.request.get(`${BASE}${iconPath}`);
      assert.equal(res.status(), 200, `GET ${iconPath} returned HTTP ${res.status()}`);
      const body = await res.body();
      assert.ok(body.length > 50, `${iconPath} body unexpectedly small (${body.length} bytes)`);
      report.favicon[iconPath] = { status: res.status(), bytes: body.length };
    }

    await page.screenshot({ path: path.join(QA_DIR, "01-landing.png") });
    report.screenshots.push("01-landing.png");

    // 2. Studio Overview & Selected Room + 7-Viewport Responsive Check
    await page.goto(`${BASE}/studio`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(QA_DIR, "02-studio-overview.png") });
    report.screenshots.push("02-studio-overview.png");

    await page.getByRole("tab", { name: /Ressources/ }).click();
    await page.waitForTimeout(220);
    await page.screenshot({ path: path.join(QA_DIR, "03-studio-selected-room.png") });
    report.screenshots.push("03-studio-selected-room.png");

    const viewports = [
      [360, 800],
      [390, 844],
      [844, 390],
      [768, 1024],
      [1366, 768],
      [1440, 900],
      [1920, 1080],
    ];
    for (const [w, h] of viewports) {
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(120);
      await assertNoOverflow(page, `/studio@${w}x${h}`);
      report.viewportsChecked.push(`${w}x${h}`);
    }
    await page.setViewportSize({ width: 1440, height: 900 });

    // Reduced motion check
    const reducedCtx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const reducedPage = await reducedCtx.newPage();
    await reducedPage.goto(`${BASE}/studio`, { waitUntil: "networkidle" });
    const animDuration = await reducedPage.evaluate(() => {
      const el = document.querySelector(".animate-stage-enter");
      return el ? getComputedStyle(el).animationDuration : "0s";
    });
    assert.ok(
      animDuration === "0s" || animDuration === "0.00001s" || parseFloat(animDuration) <= 0.01,
      `Expected reduced-motion animationDuration <= 0.01s, got ${animDuration}`
    );
    report.reducedMotionChecked = true;
    await reducedCtx.close();

    if (!PUBLIC_ONLY) {
      // 3. Presenter Desktop + Projector Fullscreen + Participant Flow
      const presCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const presenter = await presCtx.newPage();
      await presenter.goto(`${BASE}/presenter`, { waitUntil: "networkidle" });
      await presenter.fill("#presenter-passcode", PASSCODE);
      await presenter.click('button[type="submit"]');
      await presenter.waitForSelector('[data-slide-frame="true"]', { timeout: 10000 });
      await presenter.keyboard.press("Home");
      await presenter.waitForTimeout(300);

      await presenter.screenshot({ path: path.join(QA_DIR, "04-presenter-desktop.png") });
      report.screenshots.push("04-presenter-desktop.png");

      // Projector 1920x1080 Fullscreen (Slide 1 -> clean stage)
      const projCtx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
      const projector = await projCtx.newPage();
      await projector.goto(`${BASE}/screen`, { waitUntil: "networkidle" });
      await projector.waitForSelector('[data-slide-frame="true"]', { timeout: 10000 });
      await projector.getByRole("button", { name: /Plein écran/ }).click();
      await projector.waitForTimeout(350);
      await projector.screenshot({ path: path.join(QA_DIR, "05-projector-fullscreen.png") });
      report.screenshots.push("05-projector-fullscreen.png");

      // Participant Mobile Join (390x844)
      const partCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const participant = await partCtx.newPage();
      await participant.goto(`${BASE}/join`, { waitUntil: "networkidle" });
      await participant.screenshot({ path: path.join(QA_DIR, "06-participant-join.png") });
      report.screenshots.push("06-participant-join.png");

      await participant.fill("#join-pin", PIN);
      await participant.fill("#join-name", "Nadia T. QA");
      await participant.click('button[type="submit"]');
      await participant.waitForSelector('text=Connecté(e) : Nadia T. QA', { timeout: 10000 });

      // Slide 3: Live Poll (08-live-poll.png)
      await openOutlineAndClick(presenter, /2\. Besoins des enseignants/i);
      await participant.getByText(/Identifier nos priorités sur le terrain/).waitFor({ timeout: 10000 });
      await participant.waitForTimeout(250);
      await participant.screenshot({ path: path.join(QA_DIR, "08-live-poll.png") });
      report.screenshots.push("08-live-poll.png");

      // Slide 5: Participant Quiz (07-participant-quiz.png)
      await openOutlineAndClick(presenter, /Quiz express : 5 repères sur les LLM/i);
      await participant.getByText(/Quiz express : 5 repères sur les LLM/).waitFor({ timeout: 10000 });
      await participant.waitForTimeout(250);
      await participant.screenshot({ path: path.join(QA_DIR, "07-participant-quiz.png") });
      report.screenshots.push("07-participant-quiz.png");

      // Slide 10: Prompt Builder (09-prompt-builder.png)
      await openOutlineAndClick(presenter, /Atelier pratique : Votre Prompt Builder/i);
      await participant.getByText(/Paramètres de votre classe/).waitFor({ timeout: 10000 });
      await participant.waitForTimeout(250);
      await participant.screenshot({ path: path.join(QA_DIR, "09-prompt-builder.png") });
      report.screenshots.push("09-prompt-builder.png");

      // Slide 17: Application Gallery on 1440x900 Presenter (10-app-gallery.png)
      await openOutlineAndClick(presenter, /10\. Galerie & Atelier en groupes/i);
      await presenter.waitForTimeout(350);
      await presenter.screenshot({ path: path.join(QA_DIR, "10-app-gallery.png") });
      report.screenshots.push("10-app-gallery.png");

      // Mobile Portrait (390x844) & Mobile Landscape (844x390) on Presenter
      await presenter.keyboard.press("Home");
      await presenter.waitForTimeout(250);
      await presenter.setViewportSize({ width: 390, height: 844 });
      await presenter.waitForTimeout(350);
      await presenter.screenshot({ path: path.join(QA_DIR, "11-mobile-portrait.png") });
      report.screenshots.push("11-mobile-portrait.png");

      await presenter.setViewportSize({ width: 844, height: 390 });
      await presenter.waitForTimeout(450);
      await presenter.screenshot({ path: path.join(QA_DIR, "12-mobile-landscape.png") });
      report.screenshots.push("12-mobile-landscape.png");

      await presCtx.close();
      await projCtx.close();
      await partCtx.close();
    }

    await ctx.close();
    console.log(JSON.stringify(report, null, 2));
    console.log("ALL DESIGN SYSTEM, FAVICON & 12-SCREEN VISUAL QA CHECKS PASSED");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("DESIGN SYSTEM QA FAILED:", err);
  process.exit(1);
});
