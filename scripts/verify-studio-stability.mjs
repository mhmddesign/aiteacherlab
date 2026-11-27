import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const npxRoot = path.join(process.env.LOCALAPPDATA || "", "npm-cache", "_npx");
let pwPath = null;
if (fs.existsSync(npxRoot)) {
  for (const dir of fs.readdirSync(npxRoot)) {
    const candidate = path.join(npxRoot, dir, "node_modules", "playwright");
    if (fs.existsSync(candidate)) {
      pwPath = candidate;
      break;
    }
    const coreCandidate = path.join(npxRoot, dir, "node_modules", "playwright-core");
    if (fs.existsSync(coreCandidate)) {
      pwPath = coreCandidate;
      break;
    }
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
const BASE = new URL(RAW_TARGET).origin;
const localEnv = loadLocalEnv();
const PIN = process.env.WORKSHOP_PIN || localEnv.WORKSHOP_PIN || "";
const PASSCODE = process.env.FACILITATOR_PASSCODE || localEnv.FACILITATOR_PASSCODE || "";
const SCREENSHOT_DIR =
  "C:\\Users\\MHMD\\.gemini\\antigravity\\brain\\d143fa10-852f-4c36-95b0-bfab85175a67\\studio-ux";

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

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

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return Math.round(sorted[idx] * 10) / 10;
}

async function checkAccessibilityAndOverflow(page, label) {
  const audit = await page.evaluate(() => {
    const overflowX = document.documentElement.scrollWidth - window.innerWidth;
    const hasRtlAr = Boolean(document.querySelector('[dir="rtl"][lang="ar"]'));
    const hasMain = Boolean(document.querySelector("main"));
    const unlabeledInputs = Array.from(
      document.querySelectorAll("input:not([type=hidden]), textarea, select")
    ).filter((el) => {
      const id = el.getAttribute("id");
      const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
      const wrapped = Boolean(el.closest("label"));
      const linked = id ? Boolean(document.querySelector(`label[for="${CSS.escape(id)}"]`)) : false;
      return !aria && !wrapped && !linked;
    }).length;

    const unlabeledIconButtons = Array.from(document.querySelectorAll("button")).filter((btn) => {
      const text = (btn.textContent || "").trim();
      const aria = btn.getAttribute("aria-label") || btn.getAttribute("aria-labelledby");
      return text.length === 0 && !aria;
    }).length;

    return { overflowX, hasRtlAr, hasMain, unlabeledInputs, unlabeledIconButtons };
  });

  assert.ok(
    audit.overflowX <= 2,
    `${label}: horizontal overflow ${audit.overflowX}px > 2px`
  );
  assert.ok(audit.hasRtlAr, `${label}: missing simultaneous Arabic RTL content`);
  assert.ok(audit.hasMain, `${label}: missing semantic <main> landmark`);
  assert.equal(audit.unlabeledInputs, 0, `${label}: found unlabeled form inputs`);
  assert.equal(audit.unlabeledIconButtons, 0, `${label}: found unlabeled icon buttons`);
  return audit;
}

async function run() {
  const browser = await launchBrowser();
  const report = {
    inBrowserUiFeedbackMs: [],
    playwrightClickToPaintMs: [],
    serverPatchMs: [],
    checks: {},
    screenshots: [],
  };

  try {
    // 1. Desktop Presenter + Projector + Latency + Anti-Double-Click + Space-on-Button + Badge Stability
    const presenterCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const presenterPage = await presenterCtx.newPage();
    const projectorCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const projectorPage = await projectorCtx.newPage();

    const patchDurations = [];
    presenterPage.on("response", async (res) => {
      if (res.url().includes("/api/presenter/control") && res.request().method() === "PATCH") {
        const timing = res.request().timing();
        if (timing && timing.responseEnd > 0) {
          patchDurations.push(Math.max(1, timing.responseEnd - timing.requestStart));
        }
      }
    });

    await presenterPage.goto(`${BASE}/presenter`, { waitUntil: "networkidle" });
    await checkAccessibilityAndOverflow(presenterPage, "presenter-login-desktop");

    // Authenticate Presenter
    await presenterPage.fill("#presenter-passcode", PASSCODE);
    await presenterPage.click('button[type="submit"]');
    await presenterPage.waitForSelector('[data-slide-frame="true"]', { timeout: 10000 });
    await presenterPage.waitForTimeout(300);

    // Reset to Slide 1 via Home key
    await presenterPage.keyboard.press("Home");
    await presenterPage.waitForTimeout(350);
    assert.ok(
      (await presenterPage.textContent("header")).includes("Diapo 1/21"),
      "Presenter should start on Diapo 1/21"
    );

    // Measure header & connection badge height stability across navigation
    const headerHeightBefore = await presenterPage.evaluate(() => {
      const h = document.querySelector("header");
      const b = document.querySelector('[data-connection-badge="true"]');
      return {
        headerH: h ? Math.round(h.getBoundingClientRect().height) : 0,
        badgeH: b ? Math.round(b.getBoundingClientRect().height) : 0,
      };
    });

    // Measure single-click Next latency (both in-browser DOM feedback & Playwright click-to-paint) 5 times
    for (let i = 0; i < 5; i++) {
      const expectedSlide = i + 2;
      // Install one-shot in-browser timer that measures click -> DOM mutation inside the page
      const browserDeltaPromise = presenterPage.evaluate((targetSlide) => {
        return new Promise((resolve) => {
          const header = document.querySelector("header");
          const btn = Array.from(document.querySelectorAll("footer button")).find((b) =>
            (b.textContent || "").includes("Suivant")
          );
          if (!header || !btn) return resolve(-1);
          let clickT0 = 0;
          const onPointerDown = () => {
            clickT0 = performance.now();
          };
          btn.addEventListener("click", onPointerDown, { once: true, capture: true });
          const obs = new MutationObserver(() => {
            if ((header.textContent || "").includes(`Diapo ${targetSlide}/21`)) {
              const dt = clickT0 ? performance.now() - clickT0 : 0;
              obs.disconnect();
              requestAnimationFrame(() => resolve(Math.round(dt * 10) / 10));
            }
          });
          obs.observe(header, { childList: true, subtree: true, characterData: true });
          setTimeout(() => {
            obs.disconnect();
            resolve(-1);
          }, 3000);
        });
      }, expectedSlide);

      const t0 = performance.now();
      await presenterPage.locator('footer button:has-text("Suivant")').click();
      await presenterPage.waitForFunction(
        (n) => (document.querySelector("header")?.textContent || "").includes(`Diapo ${n}/21`),
        expectedSlide,
        { timeout: 3000 }
      );
      const pwDt = performance.now() - t0;
      const browserDt = await browserDeltaPromise;
      if (browserDt >= 0) report.inBrowserUiFeedbackMs.push(browserDt);
      report.playwrightClickToPaintMs.push(Math.round(pwDt * 10) / 10);
      await presenterPage.waitForTimeout(120);
    }

    // Space-on-focused-button single-step test!
    // Focus "Suivant" button, press Space -> must advance ONLY 1 slide (from 6 -> 7, NOT 6 -> 8!)
    const nextBtn = presenterPage.locator('footer button:has-text("Suivant")');
    await nextBtn.focus();
    await presenterPage.keyboard.press("Space");
    await presenterPage.waitForTimeout(450);
    const afterSpaceText = await presenterPage.textContent("header");
    assert.ok(
      afterSpaceText.includes("Diapo 7/21"),
      `Space on focused Suivant button should advance exactly 1 slide to 7/21, got: ${afterSpaceText}`
    );
    report.checks.spaceOnFocusedButtonSingleStep = true;

    // Rapid 4-press ArrowRight -> must settle exactly at Diapo 11/21 with zero snap-back
    for (let i = 0; i < 4; i++) {
      await presenterPage.keyboard.press("ArrowRight");
      await presenterPage.waitForTimeout(30);
    }
    await presenterPage.waitForTimeout(900);
    const afterRapidText = await presenterPage.textContent("header");
    assert.ok(
      afterRapidText.includes("Diapo 11/21"),
      `Rapid 4x ArrowRight should land cleanly on Diapo 11/21 without snap-back, got: ${afterRapidText}`
    );
    report.checks.rapidNavigationNoSnapBack = true;

    // Verify header & connection badge did NOT jump vertically
    const headerHeightAfter = await presenterPage.evaluate(() => {
      const h = document.querySelector("header");
      const b = document.querySelector('[data-connection-badge="true"]');
      return {
        headerH: h ? Math.round(h.getBoundingClientRect().height) : 0,
        badgeH: b ? Math.round(b.getBoundingClientRect().height) : 0,
      };
    });
    assert.equal(headerHeightBefore.headerH, headerHeightAfter.headerH, "Header height shifted");
    assert.equal(headerHeightBefore.badgeH, headerHeightAfter.badgeH, "ConnectionBadge height shifted");
    report.checks.zeroHeaderLayoutShift = headerHeightBefore;

    // Open Projector and verify synced to Diapo 11/21
    await projectorPage.goto(`${BASE}/screen`, { waitUntil: "networkidle" });
    await projectorPage.waitForSelector('[data-slide-frame="true"]', { timeout: 10000 });
    await projectorPage.waitForFunction(
      () => (document.querySelector("header")?.textContent || "").includes("11/21"),
      null,
      { timeout: 6000 }
    );
    report.checks.projectorSyncedToPresenter = true;

    // Take Desktop Screenshots (1440x900)
    await presenterPage.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop-presenter.png") });
    await projectorPage.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop-screen.png") });
    report.screenshots.push("desktop-presenter.png", "desktop-screen.png");

    // 2. Test Offline / Online Recovery & ConnectionBadge Stability
    await projectorCtx.setOffline(true);
    await projectorPage.evaluate(() => window.dispatchEvent(new Event("offline")));
    await projectorPage.waitForFunction(
      () =>
        document
          .querySelector('[data-connection-badge="true"]')
          ?.getAttribute("data-connection-mode") === "offline",
      null,
      { timeout: 4000 }
    );
    await projectorCtx.setOffline(false);
    await projectorPage.evaluate(() => window.dispatchEvent(new Event("online")));
    await projectorPage.waitForFunction(
      () => {
        const m = document
          .querySelector('[data-connection-badge="true"]')
          ?.getAttribute("data-connection-mode");
        return m === "polling" || m === "realtime";
      },
      null,
      { timeout: 6000 }
    );
    report.checks.offlineOnlineRecovery = true;

    // 3. Mobile Portrait -> Landscape Rotation & Compact Landscape Auto-Collapse Test!
    // Move Presenter to Slide 3 (Poll) first for participant test later, then test rotation
    await presenterPage.setViewportSize({ width: 390, height: 844 });
    await presenterPage.waitForTimeout(350);
    await checkAccessibilityAndOverflow(presenterPage, "presenter-mobile-portrait-390");
    await presenterPage.screenshot({
      path: path.join(SCREENSHOT_DIR, "mobile-portrait-presenter.png"),
    });
    report.screenshots.push("mobile-portrait-presenter.png");

    const portraitMetrics = await presenterPage.evaluate(() => {
      const header = document.querySelector("header");
      const frame = document.querySelector('[data-slide-frame="true"]');
      return {
        hasHeader: Boolean(header),
        headerHeight: header ? Math.round(header.getBoundingClientRect().height) : 0,
        frameWidth: frame ? Math.round(frame.getBoundingClientRect().width) : 0,
        frameHeight: frame ? Math.round(frame.getBoundingClientRect().height) : 0,
      };
    });
    assert.ok(portraitMetrics.headerHeight <= 60, `Mobile portrait header wrapped: ${portraitMetrics.headerHeight}px`);

    // Rotate to Phone Landscape (844x390) -> Header & Footer must auto-collapse!
    await presenterPage.setViewportSize({ width: 844, height: 390 });
    await presenterPage.waitForTimeout(450);
    const landscapeMetrics = await presenterPage.evaluate(() => {
      const root = document.querySelector('[data-compact-landscape="true"]');
      const header = document.querySelector("header");
      const footer = document.querySelector("footer");
      const overlay = document.querySelector('[data-landscape-overlay="true"]');
      const frame = document.querySelector('[data-slide-frame="true"]');
      const r = frame ? frame.getBoundingClientRect() : { width: 0, height: 0 };
      return {
        compactFlag: Boolean(root),
        headerHidden: !header,
        footerHidden: !footer,
        hasOverlay: Boolean(overlay),
        frameWidth: Math.round(r.width),
        frameHeight: Math.round(r.height),
        aspect: r.height ? Math.round((r.width / r.height) * 1000) / 1000 : 0,
        heightCoveragePct: Math.round((r.height / window.innerHeight) * 100),
      };
    });
    assert.ok(landscapeMetrics.compactFlag, "Presenter did not enter compact landscape mode");
    assert.ok(landscapeMetrics.headerHidden, "Header should auto-collapse in compact phone landscape");
    assert.ok(landscapeMetrics.footerHidden, "Footer should auto-collapse in compact phone landscape");
    assert.ok(landscapeMetrics.hasOverlay, "Floating landscape overlay controls should be present");
    assert.ok(
      landscapeMetrics.heightCoveragePct >= 95,
      `Landscape 16:9 stage should fill height (>=95%), got ${landscapeMetrics.heightCoveragePct}%`
    );
    await presenterPage.screenshot({
      path: path.join(SCREENSHOT_DIR, "mobile-landscape-presenter.png"),
    });
    report.screenshots.push("mobile-landscape-presenter.png");
    report.checks.presenterRotationPortraitToLandscape = {
      portraitMetrics,
      landscapeMetrics,
    };

    // Projector Mobile Landscape (844x390)
    await projectorPage.setViewportSize({ width: 844, height: 390 });
    await projectorPage.waitForTimeout(400);
    const screenLandscape = await projectorPage.evaluate(() => {
      const header = document.querySelector("header");
      const frame = document.querySelector('[data-slide-frame="true"]');
      const r = frame ? frame.getBoundingClientRect() : { width: 0, height: 0 };
      return {
        headerHidden: !header,
        frameWidth: Math.round(r.width),
        frameHeight: Math.round(r.height),
        heightCoveragePct: Math.round((r.height / window.innerHeight) * 100),
      };
    });
    assert.ok(screenLandscape.headerHidden, "Projector header should auto-collapse in phone landscape");
    assert.ok(screenLandscape.heightCoveragePct >= 95, "Projector landscape height coverage < 95%");
    await projectorPage.screenshot({
      path: path.join(SCREENSHOT_DIR, "mobile-landscape-screen.png"),
    });
    report.screenshots.push("mobile-landscape-screen.png");
    report.checks.projectorCompactLandscape = screenLandscape;

    // 4. Participant Mobile Portrait (390x844 & 360x800) + Optimistic Poll + Rollback/Retry + Double-Click Guard
    await presenterPage.setViewportSize({ width: 1440, height: 900 });
    await presenterPage.keyboard.press("Home");
    await presenterPage.waitForTimeout(250);
    // Navigate to Slide 3 (poll-needs)
    await presenterPage.keyboard.press("ArrowRight");
    await presenterPage.keyboard.press("ArrowRight");
    await presenterPage.waitForTimeout(600);

    const participantCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const participantPage = await participantCtx.newPage();

    await participantPage.goto(`${BASE}/join`, { waitUntil: "networkidle" });
    await checkAccessibilityAndOverflow(participantPage, "join-mobile-390");
    await participantPage.screenshot({
      path: path.join(SCREENSHOT_DIR, "mobile-portrait-join.png"),
    });
    report.screenshots.push("mobile-portrait-join.png");

    await participantPage.fill("#join-pin", PIN);
    await participantPage.fill("#join-name", "Prof. QA Studio");
    await participantPage.click('button[type="submit"]');
    await participantPage.waitForSelector('button:has-text("Préparation des cours")', {
      timeout: 10000,
    });
    await checkAccessibilityAndOverflow(participantPage, "participant-live-390");

    // Simulate network failure on first vote -> verify rollback & Retry button!
    let abortOnce = true;
    await participantPage.route("**/api/participant/respond", async (route) => {
      if (abortOnce) {
        abortOnce = false;
        await route.abort("failed");
      } else {
        await route.continue();
      }
    });

    await participantPage.click('button:has-text("Préparation des cours")');
    await participantPage.waitForSelector('button:has-text("Réessayer")', { timeout: 5000 });
    report.checks.optimisticPollRollbackAndRetryUI = true;

    // Click Retry -> succeeds and locks option (anti-double-submit!)
    await participantPage.click('button:has-text("Réessayer")');
    await participantPage.waitForSelector('text=Réponse enregistrée', { timeout: 5000 });
    const btnDisabledAfterSave = await participantPage
      .locator('button:has-text("Différenciation pédagogique")')
      .isDisabled();
    assert.ok(btnDisabledAfterSave, "Poll options must lock after save to prevent duplicate submission");
    report.checks.pollLockedAfterSave = true;

    await participantPage.screenshot({
      path: path.join(SCREENSHOT_DIR, "mobile-portrait-participant-poll.png"),
    });
    report.screenshots.push("mobile-portrait-participant-poll.png");

    // Verify 360x800 narrow Android phone
    await participantPage.setViewportSize({ width: 360, height: 800 });
    await participantPage.waitForTimeout(200);
    await checkAccessibilityAndOverflow(participantPage, "participant-mobile-360");

    // 5. Studio Multi-Room Workspace (/studio) + Landing (/) on Desktop & Mobile
    const studioCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const studioPage = await studioCtx.newPage();

    await studioPage.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await checkAccessibilityAndOverflow(studioPage, "landing-desktop");
    await studioPage.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop-landing.png") });
    report.screenshots.push("desktop-landing.png");

    await studioPage.goto(`${BASE}/studio`, { waitUntil: "networkidle" });
    await checkAccessibilityAndOverflow(studioPage, "studio-desktop");
    await studioPage.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop-studio.png") });
    report.screenshots.push("desktop-studio.png");

    // Create a draft room in Studio & verify tabs
    await studioPage.click('[data-testid="studio-new-room-btn"]');
    await studioPage.fill("#studio-title-fr", "Atelier Maths & IA — Mediouna");
    await studioPage.fill("#studio-title-ar", "ورشة الرياضيات والذكاء الاصطناعي — مديونة");
    await studioPage.click('button[type="submit"]:has-text("Créer la salle")');
    await studioPage.waitForSelector('text=Atelier Maths & IA — Mediouna', { timeout: 4000 });

    // Switch through tabs
    await studioPage.click('[role="tab"]:has-text("Présentation")');
    await studioPage.click('[role="tab"]:has-text("Ressources")');
    await studioPage.click('[role="tab"]:has-text("Activités")');
    report.checks.studioMultiRoomAndTabs = true;

    // Mobile portrait Studio (390x844)
    await studioPage.setViewportSize({ width: 390, height: 844 });
    await studioPage.waitForTimeout(250);
    await checkAccessibilityAndOverflow(studioPage, "studio-mobile-390");
    await studioPage.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile-portrait-studio.png") });
    report.screenshots.push("mobile-portrait-studio.png");

    // Reset Presenter back to Slide 1 cleanly
    await presenterPage.keyboard.press("Home");
    await presenterPage.waitForTimeout(400);

    report.serverPatchMs = patchDurations.map((v) => Math.round(v * 10) / 10);
    const summary = {
      inBrowserUiFeedbackP50Ms: percentile(report.inBrowserUiFeedbackMs, 50),
      inBrowserUiFeedbackP95Ms: percentile(report.inBrowserUiFeedbackMs, 95),
      playwrightClickToPaintP50Ms: percentile(report.playwrightClickToPaintMs, 50),
      playwrightClickToPaintP95Ms: percentile(report.playwrightClickToPaintMs, 95),
      serverPatchP50Ms: percentile(report.serverPatchMs, 50),
      serverPatchP95Ms: percentile(report.serverPatchMs, 95),
      samplesInBrowserMs: report.inBrowserUiFeedbackMs,
      samplesPlaywrightMs: report.playwrightClickToPaintMs,
      samplesServerMs: report.serverPatchMs,
      checks: report.checks,
      screenshotsDir: SCREENSHOT_DIR,
      screenshots: report.screenshots,
    };

    assert.ok(
      summary.inBrowserUiFeedbackP95Ms < 80,
      `In-browser UI feedback p95 should be < 80ms, got ${summary.inBrowserUiFeedbackP95Ms}ms`
    );
    assert.ok(
      summary.playwrightClickToPaintP95Ms < 350,
      `Playwright click-to-paint p95 should be < 350ms, got ${summary.playwrightClickToPaintP95Ms}ms`
    );

    console.log(JSON.stringify(summary, null, 2));
    console.log("ALL STUDIO STABILITY, MOBILE, REALTIME & WCAG CHECKS PASSED");

    await presenterCtx.close();
    await projectorCtx.close();
    await participantCtx.close();
    await studioCtx.close();
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
