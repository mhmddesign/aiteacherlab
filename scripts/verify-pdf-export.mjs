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

const BASE = new URL(process.argv[2] || "http://localhost:3000").origin;
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

function inspectPdfBuffer(buf) {
  const text = buf.toString("latin1");
  const pageMatches = text.match(/\/Type\s*\/Page\b(?!s)/g) || [];
  const mediaBoxMatch = text.match(/\/MediaBox\s*\[\s*([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s*\]/);
  const mediaBox = mediaBoxMatch
    ? [
        Number(mediaBoxMatch[1]),
        Number(mediaBoxMatch[2]),
        Number(mediaBoxMatch[3]),
        Number(mediaBoxMatch[4]),
      ]
    : null;
  return {
    bytes: buf.length,
    pageCount: pageMatches.length,
    mediaBoxPt: mediaBox,
    widthPt: mediaBox ? Math.round((mediaBox[2] - mediaBox[0]) * 10) / 10 : 0,
    heightPt: mediaBox ? Math.round((mediaBox[3] - mediaBox[1]) * 10) / 10 : 0,
  };
}

async function run() {
  const browser = await launchBrowser();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();

    // 1. Export Slides (16:9 Presentation PDF, exact 21 pages)
    await page.goto(`${BASE}/export/slides?deckId=deck-mediouna-21&mode=slides`, {
      waitUntil: "networkidle",
    });

    const domSlidePages = await page.locator("[data-export-slide-page]").count();
    assert.equal(domSlidePages, 21, `Expected 21 slide pages on /export/slides, got ${domSlidePages}`);

    await page.screenshot({ path: path.join(OUT_DIR, "01-export-preview-16x9.png") });

    const slidesPdfPath = path.join(OUT_DIR, "mediouna-16x9.pdf");
    const slidesPdfBuf = await page.pdf({
      path: slidesPdfPath,
      preferCSSPageSize: true,
      printBackground: true,
    });
    const slidesMeta = inspectPdfBuffer(slidesPdfBuf);
    assert.equal(
      slidesMeta.pageCount,
      21,
      `Expected 21 pages in 16:9 presentation PDF, got ${slidesMeta.pageCount}`
    );
    const ratio = slidesMeta.widthPt / Math.max(1, slidesMeta.heightPt);
    assert.ok(
      Math.abs(ratio - 16 / 9) < 0.03,
      `Expected 16:9 MediaBox (~1440x810pt), got ${slidesMeta.widthPt}x${slidesMeta.heightPt} (ratio ${ratio})`
    );

    // 2. Classroom Worksheet Mode (A4 Portrait)
    await page.goto(`${BASE}/export/slides?deckId=deck-mediouna-21&mode=worksheet`, {
      waitUntil: "networkidle",
    });
    const worksheetPdfPath = path.join(OUT_DIR, "mediouna-worksheet-a4.pdf");
    const worksheetBuf = await page.pdf({
      path: worksheetPdfPath,
      preferCSSPageSize: true,
      printBackground: true,
    });
    const worksheetMeta = inspectPdfBuffer(worksheetBuf);
    assert.ok(worksheetMeta.pageCount >= 1, "Worksheet PDF must contain at least 1 page");
    assert.ok(
      worksheetMeta.widthPt >= 580 && worksheetMeta.widthPt <= 615 && worksheetMeta.heightPt >= 820,
      `Expected A4 portrait MediaBox (~595x842pt), got ${worksheetMeta.widthPt}x${worksheetMeta.heightPt}`
    );

    console.log(
      JSON.stringify(
        {
          ok: true,
          slides16x9Pdf: slidesMeta,
          worksheetA4Pdf: worksheetMeta,
        },
        null,
        2
      )
    );
    await ctx.close();
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
