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
const BASE = (args.find((a) => !a.startsWith("--")) || "http://localhost:3000").replace(/\/$/, "");
const PUBLIC_ONLY = args.includes("--public-only");
const localEnv = loadLocalEnv();
const PIN = process.env.WORKSHOP_PIN || localEnv.WORKSHOP_PIN || "";
const PASSCODE = process.env.FACILITATOR_PASSCODE || localEnv.FACILITATOR_PASSCODE || "";
const ARTIFACT_DIR =
  "C:\\Users\\MHMD\\.gemini\\antigravity\\brain\\d143fa10-852f-4c36-95b0-bfab85175a67";

const VIEWPORTS = [
  { name: "desktop-2560", width: 2560, height: 1440 },
  { name: "projector-1920", width: 1920, height: 1080 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1366", width: 1366, height: 768 },
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
  assert.ok(m.frTextCount >= 1 && m.arTextCount >= 1, `${label}: Missing FR or AR content`);
  assert.equal(m.qrOverlapsSlide, false, `${label}: QR panel overlapped 16:9 slide`);

  if (opts.expectPortraitHint === true) {
    assert.equal(m.hintVisible, true, `${label}: Expected portrait rotate suggestion to be visible`);
  } else if (opts.expectPortraitHint === false) {
    assert.equal(m.hintVisible, false, `${label}: Expected portrait rotate suggestion to be hidden`);
  }
}

async function run() {
  console.log(`\n=== Verifying 16:9 Presentation Canvas & Fullscreen (${BASE}, publicOnly=${PUBLIC_ONLY}) ===`);
  const browser = await launchBrowser();
  const ctxScreen = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const screen = await ctxScreen.newPage();

  const ctxPresenter = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const presenter = await ctxPresenter.newPage();

  const ctxParticipant = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const participant = await ctxParticipant.newPage();

  const errors = [];
  for (const [name, p] of [
    ["screen", screen],
    ["presenter", presenter],
    ["participant", participant],
  ]) {
    p.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
  }

  try {
    // 1. Projector /screen across all 7 required viewports
    await screen.goto(`${BASE}/screen`, { waitUntil: "networkidle" });
    for (const vp of VIEWPORTS) {
      await screen.setViewportSize({ width: vp.width, height: vp.height });
      const m = await measureCanvas(screen);
      assertCanvasMetrics(`/screen@${vp.name}`, m, {
        expectPortraitHint: vp.name === "phone-portrait-390",
      });
      if (vp.name === "phone-portrait-390") {
        await screen.screenshot({ path: path.join(ARTIFACT_DIR, "canvas_phone_portrait_390.png") });
      } else if (vp.name === "phone-landscape-844") {
        await screen.screenshot({ path: path.join(ARTIFACT_DIR, "canvas_phone_landscape_844.png") });
      }
    }
    console.log("✓ /screen verified across all 7 viewports (exact 16:9, zero overflow)");

    // Fullscreen API verification on /screen at 1920x1080
    await screen.setViewportSize({ width: 1920, height: 1080 });
    await screen.getByRole("button", { name: /Plein écran/ }).click();
    await screen.waitForTimeout(300);
    const screenFs = await measureCanvas(screen);
    assert.equal(screenFs.fullscreenElementPresent, true, "/screen native document.fullscreenElement MUST be active");
    assert.equal(screenFs.headerPresent, false, "/screen header must hide in fullscreen");
    assertCanvasMetrics("/screen@fullscreen-1920x1080", screenFs, { expectPortraitHint: false });
    assert.ok(
      screenFs.frameW >= screenFs.vw * 0.99 || screenFs.frameH >= screenFs.vh * 0.99,
      `/screen fullscreen should maximize viewport (frame=${screenFs.frameW}x${screenFs.frameH}, vp=${screenFs.vw}x${screenFs.vh})`
    );
    await screen.keyboard.press("Escape");
    await screen.waitForTimeout(300);
    const screenExitFs = await measureCanvas(screen);
    assert.equal(screenExitFs.fullscreenElementPresent, false, "/screen Escape must exit native fullscreen");
    assert.equal(screenExitFs.headerPresent, true, "/screen header must restore after Escape");
    console.log("✓ /screen native Fullscreen API enter, slide maximize, and Escape exit verified");

    if (!PUBLIC_ONLY) {
      assert.ok(PASSCODE && PIN, "WORKSHOP_PIN and FACILITATOR_PASSCODE required for full suite");

      // 2. Presenter login & 7 viewports verification
      await presenter.goto(`${BASE}/presenter`, { waitUntil: "networkidle" });
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
        if (vp.name === "desktop-1440") {
          await presenter.screenshot({ path: path.join(ARTIFACT_DIR, "canvas_desktop_1440.png") });
        }
      }
      console.log("✓ /presenter verified across all 7 viewports (exact 16:9, zero overflow)");

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

      // Check non-welcome slide with QR active on /screen has non-overlapping external QR sidebar
      const screenQrMetrics = await measureCanvas(screen);
      assertCanvasMetrics("/screen@slide2-with-qr", screenQrMetrics);

      // 3. Audit all 21 slides (1..21) for zero logical canvas overflow on both /presenter and /screen
      await presenter.keyboard.press("Home");
      await presenter.getByText(/Diapo 1\/21/).waitFor({ timeout: 5000 });
      await screen.getByText(/Diapo 1\/21/).waitFor({ timeout: 8000 });

      for (let i = 1; i <= 21; i++) {
        await presenter.getByText(new RegExp(`Diapo ${i}/21`)).waitFor({ timeout: 5000 });
        await screen.getByText(new RegExp(`Diapo ${i}/21`)).waitFor({ timeout: 8000 });

        const pm = await measureCanvas(presenter);
        const sm = await measureCanvas(screen);
        assertCanvasMetrics(`/presenter@slide-${i}`, pm);
        assertCanvasMetrics(`/screen@slide-${i}`, sm);

        // Check interactive overlays inside s09-live-demo (15) & s10-gallery (16)
        if (i === 15) {
          await screen.getByRole("button", { name: /Voir Prompt → Prototype/ }).click();
          const demoPromptMetrics = await measureCanvas(screen);
          assertCanvasMetrics("/screen@slide-15-prompt-open", demoPromptMetrics);
          await screen.getByRole("button", { name: /Masquer le prompt/ }).click();
        } else if (i === 16) {
          await screen.getByRole("button", { name: /Tester\s+تجريب/ }).first().click();
          const galleryOpenMetrics = await measureCanvas(screen);
          assertCanvasMetrics("/screen@slide-16-gallery-demo", galleryOpenMetrics);
          await screen.screenshot({ path: path.join(ARTIFACT_DIR, "canvas_gallery_1080.png") });
          await screen.getByRole("button", { name: /Fermer la démo/ }).click();
        } else if (i === 21) {
          await screen.screenshot({ path: path.join(ARTIFACT_DIR, "canvas_projector_1080_closing.png") });
        }

        if (i < 21) {
          await presenter.getByRole("button", { name: /^Suivant\s+التالي$/ }).click();
        }
      }
      console.log("✓ All 21 slides verified at 1920x1080 logical canvas (zero clipping/overflow)");

      // Return workshop back to Slide 1 for clean baseline
      await presenter.keyboard.press("Home");
      await presenter.getByText(/Diapo 1\/21/).waitFor({ timeout: 5000 });

      // 4. Participant /join responsive mobile + 16:9 slide preview check
      await participant.goto(`${BASE}/join`, { waitUntil: "networkidle" });
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
    console.log("ALL 16:9 CANVAS, ALL 21 SLIDES, VIEWPORTS & FULLSCREEN ASSERTIONS PASSED!");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("CANVAS VERIFICATION FAILED:", err);
  process.exit(1);
});
