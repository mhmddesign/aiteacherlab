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
const targetUrl = new URL(RAW_TARGET);
const BASE = targetUrl.origin;
const SHARE_AUTH_URL = targetUrl.search ? RAW_TARGET : null;
const PUBLIC_ONLY = args.includes("--public-only");
const localEnv = loadLocalEnv();
const PIN = process.env.WORKSHOP_PIN || localEnv.WORKSHOP_PIN || "";
const PASSCODE = process.env.FACILITATOR_PASSCODE || localEnv.FACILITATOR_PASSCODE || "";
const ARTIFACT_DIR =
  "C:\\Users\\MHMD\\.gemini\\antigravity\\brain\\d143fa10-852f-4c36-95b0-bfab85175a67";

const VIEWPORTS = [
  { name: "projector-1920", width: 1920, height: 1080 },
  { name: "desktop-1600", width: 1600, height: 900 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1366", width: 1366, height: 768 },
  { name: "tablet-landscape-1024", width: 1024, height: 768 },
  { name: "tablet-portrait-768", width: 768, height: 1024 },
  { name: "phone-portrait-390", width: 390, height: 844 },
  { name: "phone-landscape-844", width: 844, height: 390 },
];

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

async function measureCanvas(page) {
  await page.waitForSelector('[data-slide-frame="true"]', { timeout: 10000 });
  await page.waitForTimeout(180);
  return page.evaluate(() => {
    const frame = document.querySelector('[data-slide-frame="true"]');
    const canvas = document.querySelector('[data-slide-canvas="true"]');
    const hint = document.querySelector('[data-orientation-hint="true"]');
    const qrRegion = document.querySelector('[data-projector-qr-region="true"]');
    if (!frame || !canvas) return { error: "Missing slide frame or canvas" };

    const fr = frame.getBoundingClientRect();
    const cr = canvas.getBoundingClientRect();
    const scale = parseFloat(frame.dataset.scale || "") || fr.width / 1920;

    const h1 = canvas.querySelector('[data-slide-heading-fr="true"]');
    const h2 = canvas.querySelector('[data-slide-heading-ar="true"]');
    const bodyRoot = canvas.querySelector('[data-slide-body="true"]');
    const stageEl = canvas.querySelector('[data-slide-stage="true"]');
    const stageOverflowPx = stageEl ? Math.max(0, stageEl.scrollHeight - stageEl.clientHeight) : 0;

    const logicalFrHeadingPx = h1 ? parseFloat(window.getComputedStyle(h1).fontSize) : 0;
    const logicalArHeadingPx = h2 ? parseFloat(window.getComputedStyle(h2).fontSize) : 0;

    // Measure primary text elements inside bodyRoot (or canvas fallback)
    let logicalBodyPx = 0;
    if (bodyRoot) {
      const candidates = Array.from(bodyRoot.querySelectorAll("p, pre, span, div"));
      for (const el of candidates) {
        if (el.children.length === 0 && (el.textContent || "").trim().length >= 8) {
          const fsPx = parseFloat(window.getComputedStyle(el).fontSize);
          if (fsPx > logicalBodyPx) logicalBodyPx = fsPx;
        }
      }
      if (!logicalBodyPx) {
        logicalBodyPx = parseFloat(window.getComputedStyle(bodyRoot).fontSize) || 0;
      }
    }

    const hintStyle = hint ? window.getComputedStyle(hint) : null;
    const hintVisible = Boolean(hint && hintStyle && hintStyle.display !== "none");

    let qrOverlapsSlide = false;
    if (qrRegion) {
      const qrRect = qrRegion.getBoundingClientRect();
      if (qrRect.width > 0 && qrRect.height > 0) {
        qrOverlapsSlide = !(
          qrRect.right <= fr.left + 1 ||
          qrRect.left >= fr.right - 1 ||
          qrRect.bottom <= fr.top + 1 ||
          qrRect.top >= fr.bottom - 1
        );
      }
    }

    const frTextCount = Array.from(canvas.querySelectorAll('[lang="fr"]')).filter(
      (el) => (el.textContent || "").trim().length > 0
    ).length;
    const arTextCount = Array.from(canvas.querySelectorAll('[dir="rtl"][lang="ar"]')).filter(
      (el) => (el.textContent || "").trim().length > 0
    ).length;

    return {
      vw: window.innerWidth,
      vh: window.innerHeight,
      docScrollWidth: document.documentElement.scrollWidth,
      docScrollHeight: document.documentElement.scrollHeight,
      frameW: fr.width,
      frameH: fr.height,
      frameLeft: fr.left,
      frameTop: fr.top,
      frameRight: fr.right,
      frameBottom: fr.bottom,
      canvasRenderedW: cr.width,
      canvasRenderedH: cr.height,
      canvasLogicalScrollW: canvas.scrollWidth,
      canvasLogicalScrollH: canvas.scrollHeight,
      stageOverflowPx,
      scale,
      logicalFrHeadingPx,
      logicalArHeadingPx,
      logicalBodyPx,
      renderedFrHeadingPx: +(logicalFrHeadingPx * scale).toFixed(1),
      renderedArHeadingPx: +(logicalArHeadingPx * scale).toFixed(1),
      renderedBodyPx: +(logicalBodyPx * scale).toFixed(1),
      hintVisible,
      qrOverlapsSlide,
      frTextCount,
      arTextCount,
      fullscreenElementPresent: Boolean(document.fullscreenElement),
      headerPresent: Boolean(document.querySelector("header")),
    };
  });
}

function assertCanvasMetrics(label, m, opts = {}) {
  assert.ok(!m.error, `${label}: ${m.error}`);
  const targetRatio = 16 / 9;
  const actualRatio = m.frameW / m.frameH;
  const relDiff = Math.abs(actualRatio - targetRatio) / targetRatio;
  assert.ok(
    relDiff <= 0.005,
    `${label}: Aspect ratio ${actualRatio.toFixed(4)} deviates ${(relDiff * 100).toFixed(3)}% from 16:9`
  );
  const renderedRatio = m.canvasRenderedW / m.canvasRenderedH;
  const renderedDiff = Math.abs(renderedRatio - targetRatio) / targetRatio;
  assert.ok(
    renderedDiff <= 0.005,
    `${label}: Scaled canvas aspect ratio ${renderedRatio.toFixed(4)} distorted`
  );
  assert.ok(
    m.frameLeft >= -1 && m.frameTop >= -1 && m.frameRight <= m.vw + 1 && m.frameBottom <= m.vh + 1,
    `${label}: Slide clipped outside viewport vw=${m.vw} vh=${m.vh}, rect=[${m.frameLeft},${m.frameTop},${m.frameRight},${m.frameBottom}]`
  );
  assert.ok(
    m.docScrollWidth <= m.vw + 1,
    `${label}: Horizontal overflow (${m.docScrollWidth} > ${m.vw})`
  );
  assert.ok(
    m.docScrollHeight <= m.vh + 1,
    `${label}: Vertical page overflow (${m.docScrollHeight} > ${m.vh})`
  );
  assert.ok(
    m.canvasLogicalScrollW <= 1922 && m.canvasLogicalScrollH <= 1082,
    `${label}: Logical 1920x1080 canvas internal overflow scrollW=${m.canvasLogicalScrollW}, scrollH=${m.canvasLogicalScrollH}`
  );
  assert.ok(
    (m.stageOverflowPx || 0) <= 4,
    `${label}: Inner slide stage clipped vertically by ${m.stageOverflowPx}px`
  );
  assert.ok(m.frTextCount >= 1 && m.arTextCount >= 1, `${label}: Missing FR or AR content`);
  assert.equal(m.qrOverlapsSlide, false, `${label}: QR panel overlapped 16:9 slide`);

  // Enforce projector-readable logical typography scale (1920x1080)
  assert.ok(
    m.logicalFrHeadingPx >= 64,
    `${label}: FR logical heading too small (${m.logicalFrHeadingPx}px < 64px)`
  );
  assert.ok(
    m.logicalArHeadingPx >= 58,
    `${label}: AR logical heading too small (${m.logicalArHeadingPx}px < 58px)`
  );
  if (opts.minLogicalBodyPx) {
    assert.ok(
      m.logicalBodyPx >= opts.minLogicalBodyPx,
      `${label}: Logical body text too small (${m.logicalBodyPx}px < ${opts.minLogicalBodyPx}px)`
    );
  }

  if (opts.expectPortraitHint === true) {
    assert.equal(m.hintVisible, true, `${label}: Expected portrait rotate suggestion to be visible`);
  } else if (opts.expectPortraitHint === false) {
    assert.equal(m.hintVisible, false, `${label}: Expected portrait rotate suggestion to be hidden`);
  }
}

async function run() {
  console.log(`\n=== Verifying 16:9 Projector-Readable Canvas & Fullscreen (${BASE}, publicOnly=${PUBLIC_ONLY}) ===`);
  const browser = await launchBrowser();
  const ctxScreen = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const screen = await ctxScreen.newPage();

  const ctxPresenter = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const presenter = await ctxPresenter.newPage();

  const ctxParticipant = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const participant = await ctxParticipant.newPage();

  const errors = [];
  const viewportReport = [];
  for (const [name, p] of [
    ["screen", screen],
    ["presenter", presenter],
    ["participant", participant],
  ]) {
    p.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
  }

  try {
    // 1. Projector /screen across all 8 required viewports
    if (SHARE_AUTH_URL) {
      await screen.goto(SHARE_AUTH_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    }
    await screen.goto(`${BASE}/screen`, { waitUntil: "domcontentloaded", timeout: 30000 });
    for (const vp of VIEWPORTS) {
      await screen.setViewportSize({ width: vp.width, height: vp.height });
      const m = await measureCanvas(screen);
      assertCanvasMetrics(`/screen@${vp.name}`, m, {
        expectPortraitHint: vp.name === "phone-portrait-390",
      });
      viewportReport.push({
        route: "/screen",
        viewport: `${vp.width}x${vp.height}`,
        frame: `${Math.round(m.frameW)}x${Math.round(m.frameH)}`,
        ratio: +(m.frameW / m.frameH).toFixed(4),
        scale: +m.scale.toFixed(3),
        frHeadingPx: m.renderedFrHeadingPx,
        arHeadingPx: m.renderedArHeadingPx,
        bodyPx: m.renderedBodyPx,
        scroll: `${m.docScrollWidth}x${m.docScrollHeight}`,
      });
      if (vp.name === "phone-portrait-390") {
        await screen.screenshot({ path: path.join(ARTIFACT_DIR, "keynote_phone_390.png") });
      } else if (vp.name === "phone-landscape-844") {
        await screen.screenshot({ path: path.join(ARTIFACT_DIR, "keynote_phone_844.png") });
      }
    }
    console.log("✓ /screen verified across all 8 viewports (exact 16:9, zero overflow, projector typography)");

    // Fullscreen API verification on /screen at 1920x1080
    await screen.setViewportSize({ width: 1920, height: 1080 });
    await screen.getByRole("button", { name: /Plein écran/ }).click();
    await screen.waitForTimeout(300);
    const screenFs = await measureCanvas(screen);
    assert.equal(screenFs.fullscreenElementPresent, true, "/screen native document.fullscreenElement MUST be active");
    assert.equal(screenFs.headerPresent, false, "/screen header must hide in fullscreen");
    assertCanvasMetrics("/screen@fullscreen-1920x1080", screenFs, { expectPortraitHint: false });
    assert.ok(
      screenFs.frameW >= screenFs.vw * 0.99 && screenFs.frameH >= screenFs.vh * 0.99,
      `/screen 16:9 fullscreen should fill 1920x1080 (got ${screenFs.frameW}x${screenFs.frameH})`
    );
    await screen.keyboard.press("Escape");
    await screen.waitForTimeout(300);
    const screenExitFs = await measureCanvas(screen);
    assert.equal(screenExitFs.fullscreenElementPresent, false, "/screen Escape must exit native fullscreen");
    assert.equal(screenExitFs.headerPresent, true, "/screen header must restore after Escape");
    console.log("✓ /screen native Fullscreen API enter (1920x1080 fill) & Escape exit verified");

    if (!PUBLIC_ONLY) {
      assert.ok(PASSCODE && PIN, "WORKSHOP_PIN and FACILITATOR_PASSCODE required for full suite");

      // 2. Presenter login & all 8 viewports verification
      await presenter.goto(`${BASE}/presenter`, { waitUntil: "networkidle", timeout: 30000 });
      await presenter.getByPlaceholder("FACILITATOR_PASSCODE").fill(PASSCODE);
      await presenter.getByRole("button", { name: /Ouvrir le poste de contrôle/ }).click();
      await presenter.getByText(/AI Teacher Lab · Animateur/).waitFor({ timeout: 10000 });
      await presenter.keyboard.press("Home");
      await presenter.getByText(/Diapo 1\/21/).waitFor({ timeout: 5000 });

      for (const vp of VIEWPORTS) {
        await presenter.setViewportSize({ width: vp.width, height: vp.height });
        const m = await measureCanvas(presenter);
        assertCanvasMetrics(`/presenter@${vp.name}`, m, {
          expectPortraitHint: vp.name === "phone-portrait-390",
        });
      }
      console.log("✓ /presenter verified across all 8 viewports (exact 16:9, zero overflow)");

      // Presenter Fullscreen API + ArrowRight navigation + Escape exit
      await presenter.setViewportSize({ width: 1440, height: 900 });
      await presenter.getByRole("button", { name: /Plein écran/ }).click();
      await presenter.waitForTimeout(300);
      const presFs = await measureCanvas(presenter);
      assert.equal(presFs.fullscreenElementPresent, true, "/presenter native document.fullscreenElement MUST be active");
      assert.equal(presFs.headerPresent, false, "/presenter header must hide in fullscreen");
      assertCanvasMetrics("/presenter@fullscreen-1440x900", presFs, { expectPortraitHint: false });
      assert.ok(
        presFs.frameW >= presFs.vw * 0.99 || presFs.frameH >= presFs.vh * 0.99,
        "/presenter fullscreen should maximize slide canvas"
      );

      await presenter.keyboard.press("ArrowRight");
      await presenter.getByText(/Diapo 2\/21/).waitFor({ timeout: 3000 });
      await screen.getByText(/Diapo 2\/21/).waitFor({ timeout: 8000 });
      await presenter.keyboard.press("Escape");
      await presenter.waitForTimeout(300);
      const presExitFs = await measureCanvas(presenter);
      assert.equal(presExitFs.fullscreenElementPresent, false, "/presenter Escape must exit fullscreen");
      assert.equal(presExitFs.headerPresent, true, "/presenter header must restore after Escape");
      console.log("✓ /presenter native Fullscreen API, keyboard navigation & sync verified");

      // 3. Audit all 21 slides (1..21) + capture 7 required Keynote screenshots at 1920x1080
      await screen.setViewportSize({ width: 1920, height: 1080 });
      await presenter.keyboard.press("Home");
      await presenter.getByText(/Diapo 1\/21/).waitFor({ timeout: 5000 });
      await screen.getByText(/Diapo 1\/21/).waitFor({ timeout: 8000 });

      const conceptualSlides = new Set([1, 2, 3, 4, 5, 7, 8, 9, 11, 12, 14, 18, 19, 20, 21]);
      for (let i = 1; i <= 21; i++) {
        await presenter.getByText(new RegExp(`Diapo ${i}/21`)).waitFor({ timeout: 5000 });
        await screen.getByText(new RegExp(`Diapo ${i}/21`)).waitFor({ timeout: 8000 });

        const minBody = conceptualSlides.has(i) ? 26 : 21;
        const pm = await measureCanvas(presenter);
        const sm = await measureCanvas(screen);
        assertCanvasMetrics(`/presenter@slide-${i}`, pm, { minLogicalBodyPx: minBody });
        assertCanvasMetrics(`/screen@slide-${i}`, sm, { minLogicalBodyPx: minBody });

        if (i === 1) {
          await screen.screenshot({ path: path.join(ARTIFACT_DIR, "keynote_01_welcome.png") });
        } else if (i === 3) {
          await screen.screenshot({ path: path.join(ARTIFACT_DIR, "keynote_03_poll.png") });
        } else if (i === 4) {
          await screen.screenshot({ path: path.join(ARTIFACT_DIR, "keynote_04_concepts.png") });
        } else if (i === 5) {
          await screen.screenshot({ path: path.join(ARTIFACT_DIR, "keynote_05_quiz.png") });
        } else if (i === 14) {
          await screen.screenshot({ path: path.join(ARTIFACT_DIR, "keynote_14_ecosystem.png") });
        } else if (i === 15) {
          await screen.getByRole("button", { name: /Voir Prompt → Prototype/ }).click();
          const demoPromptMetrics = await measureCanvas(screen);
          assertCanvasMetrics("/screen@slide-15-prompt-open", demoPromptMetrics);
          await screen.getByRole("button", { name: /Masquer le prompt/ }).click();
        } else if (i === 16) {
          await screen.screenshot({ path: path.join(ARTIFACT_DIR, "keynote_16_gallery.png") });
          await screen.getByRole("button", { name: /Tester\s+تجريب/ }).first().click();
          const galleryOpenMetrics = await measureCanvas(screen);
          assertCanvasMetrics("/screen@slide-16-gallery-demo", galleryOpenMetrics);
          await screen.getByRole("button", { name: /Fermer la démo/ }).click();
        } else if (i === 21) {
          await screen.screenshot({ path: path.join(ARTIFACT_DIR, "keynote_21_closing.png") });
        }

        if (i < 21) {
          await presenter.getByRole("button", { name: /^Suivant\s+التالي$/ }).click();
        }
      }
      console.log("✓ All 21 slides verified at 1920x1080 logical canvas (projector typography + zero clipping)");

      // Return workshop back to Slide 1 for clean baseline
      await presenter.keyboard.press("Home");
      await presenter.getByText(/Diapo 1\/21/).waitFor({ timeout: 5000 });

      // 4. Participant /join responsive mobile + 16:9 slide preview check
      await participant.goto(`${BASE}/join`, { waitUntil: "networkidle", timeout: 30000 });
      await participant.getByPlaceholder("Ex. : 482915").fill(PIN);
      await participant.getByPlaceholder(/Ex\. : Khadija B\./).fill("Salma Canvas");
      await participant.getByRole("button", { name: /Entrer dans l'atelier/ }).click();
      await participant.getByText(/Connecté\(e\) : Salma Canvas/).waitFor({ timeout: 10000 });
      await participant.getByRole("button", { name: /Aperçu 16:9/ }).click();
      await participant.waitForSelector('[data-participant-slide-preview="true"] [data-slide-frame="true"]', {
        timeout: 5000,
      });
      await participant.waitForTimeout(200);
      const partStats = await participant.evaluate(() => {
        const frame = document.querySelector(
          '[data-participant-slide-preview="true"] [data-slide-frame="true"]'
        );
        const fr = frame ? frame.getBoundingClientRect() : null;
        return {
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          w: fr ? fr.width : 0,
          h: fr ? fr.height : 0,
        };
      });
      assert.ok(partStats.overflow <= 2, `/join mobile overflow: ${partStats.overflow}px`);
      const partRatio = partStats.w / partStats.h;
      const partDiff = Math.abs(partRatio - 16 / 9) / (16 / 9);
      assert.ok(partDiff <= 0.005, `/join preview aspect ratio off: ${partRatio.toFixed(4)}`);

      await participant.getByRole("button", { name: /Quitter|خروج/ }).click();
      await presenter.evaluate(async () => {
        await fetch("/api/presenter/participants", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmation: "SUPPRIMER" }),
        });
      });
      console.log("✓ /join mobile responsive UI + optional 16:9 slide preview verified");
    }

    assert.equal(errors.length, 0, `Page errors detected: ${errors.join(" | ")}`);
    console.log("VIEWPORT_REPORT:", JSON.stringify(viewportReport));
    console.log("ALL 16:9 PROJECTOR TYPOGRAPHY, ALL 21 SLIDES, 8 VIEWPORTS & FULLSCREEN ASSERTIONS PASSED!");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("CANVAS VERIFICATION FAILED:", err);
  process.exit(1);
});
