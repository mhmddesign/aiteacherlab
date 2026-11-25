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

const localEnv = loadLocalEnv();
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const ARTIFACT_DIR =
  "C:\\Users\\MHMD\\.gemini\\antigravity\\brain\\d143fa10-852f-4c36-95b0-bfab85175a67";
const PIN = process.env.WORKSHOP_PIN || localEnv.WORKSHOP_PIN;
const PASSCODE = process.env.FACILITATOR_PASSCODE || localEnv.FACILITATOR_PASSCODE;
if (!PIN || !PASSCODE) {
  throw new Error("WORKSHOP_PIN and FACILITATOR_PASSCODE must be set in env or .env.local.");
}
const INVALID_PIN = PIN === "999999" ? "111111" : "999999";

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

async function openOutlineAndClick(presenter, pattern) {
  await presenter.getByRole("button", { name: /^Plan\s+الفهرس$/ }).click();
  await presenter.getByRole("button", { name: pattern }).first().click();
}

async function openToolsAndEnsureDemo(presenter, wantActive) {
  await presenter.getByRole("button", { name: /^Tableau de bord\s+الأدوات$/ }).click();
  const demoBtn = presenter.getByRole("button", { name: /Mode Démo/i });
  const currentlyActive = /\bACTIF\b/.test(await demoBtn.innerText());
  if (wantActive !== currentlyActive) {
    await demoBtn.click();
    await presenter.getByText(wantActive ? /^ACTIF$/ : /^INACTIF$/).waitFor({ timeout: 5000 });
  }
  await presenter.getByRole("button", { name: /Fermer les outils/ }).click();
}

async function run() {
  console.log(`\n=== Starting 4-Context Presentation-First E2E Verification (${BASE}) ===`);
  const browser = await launchBrowser();

  const ctxPresenter = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const ctxScreen = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const ctxP1 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const ctxP2 = await browser.newContext({ viewport: { width: 390, height: 844 } });

  const presenter = await ctxPresenter.newPage();
  const screen = await ctxScreen.newPage();
  const p1 = await ctxP1.newPage();
  const p2 = await ctxP2.newPage();

  const errors = [];
  const metrics = {
    presenterPatchDurationsMs: [],
    participantRespondDurationsMs: [],
    meCallsAfterParticipantJoin: 0,
    optimisticNavLatencyMs: null,
    optimisticAnswerLatencyMs: null,
  };

  for (const [name, pg] of [
    ["presenter", presenter],
    ["screen", screen],
    ["p1", p1],
    ["p2", p2],
  ]) {
    pg.on("pageerror", (err) => errors.push(`${name} pageerror: ${err.message}`));
  }

  presenter.on("requestfinished", async (req) => {
    if (req.url().includes("/api/presenter/control") && req.method() === "PATCH") {
      const timing = req.timing();
      if (timing.responseEnd > 0) {
        metrics.presenterPatchDurationsMs.push(Math.round(timing.responseEnd));
      }
    }
  });

  p1.on("requestfinished", async (req) => {
    if (req.url().includes("/api/participant/respond") && req.method() === "POST") {
      const timing = req.timing();
      if (timing.responseEnd > 0) {
        metrics.participantRespondDurationsMs.push(Math.round(timing.responseEnd));
      }
    }
  });

  try {
    // 0. Minimal Gateway / Home check
    await screen.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await screen.getByText(/Province de Mediouna · Centre de Digitalisation/).waitFor({ timeout: 10000 });
    await screen.getByText(/مختبر المعلم للذكاء الاصطناعي/).waitFor({ timeout: 10000 });
    await screen.getByRole("link", { name: /Ouvrir la présentation/ }).waitFor({ timeout: 5000 });
    await screen.getByRole("link", { name: /Rejoindre l'atelier/ }).waitFor({ timeout: 5000 });
    const homeStats = await screen.evaluate(() => ({
      rtlCount: document.querySelectorAll('[dir="rtl"][lang="ar"]').length,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      toggleFound: /switch|fr\s*\/\s*ar\s*toggle|changer de langue/i.test(document.body.innerText),
    }));
    assert.ok(homeStats.rtlCount >= 4, `Expected >=4 RTL blocks on /, found ${homeStats.rtlCount}`);
    assert.ok(homeStats.overflow <= 2, `Overflow on /: ${homeStats.overflow}px`);
    assert.equal(homeStats.toggleFound, false, "Must NOT have a language toggle");
    await screen.screenshot({ path: path.join(ARTIFACT_DIR, "redesign_home.png") });

    // 1. Presenter Login + Presentation-First Layout + Laptop 1366x768 & Desktop 1440x900
    await presenter.goto(`${BASE}/presenter`, { waitUntil: "networkidle" });
    await presenter.getByPlaceholder("FACILITATOR_PASSCODE").fill(PASSCODE);
    await presenter.getByRole("button", { name: /Ouvrir le poste de contrôle/ }).click();
    await presenter.getByText(/AI Teacher Lab · Animateur/).waitFor({ timeout: 10000 });

    // Confirm outline drawer is hidden by default
    const outlineHiddenByDefault = !(await presenter
      .getByText(/Plan de la présentation/)
      .isVisible()
      .catch(() => false));
    assert.equal(outlineHiddenByDefault, true, "Outline drawer MUST be hidden by default");

    // Clean baseline participants & ensure Demo Mode OFF
    await presenter.evaluate(async () => {
      await fetch("/api/presenter/participants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: "SUPPRIMER" }),
      });
    });
    await presenter.reload({ waitUntil: "networkidle" });
    await openToolsAndEnsureDemo(presenter, false);
    await openOutlineAndClick(presenter, /1\. Introduction/i);

    // Measure optimistic slide click latency & test 1366x768 laptop overflow
    await presenter.setViewportSize({ width: 1366, height: 768 });
    const laptopOverflow = await presenter.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    assert.ok(laptopOverflow <= 2, `Laptop 1366x768 /presenter overflow: ${laptopOverflow}px`);
    await presenter.setViewportSize({ width: 1440, height: 900 });

    const navStart = Date.now();
    await presenter.getByRole("button", { name: /^Suivant\s+التالي$/ }).click();
    await presenter.getByText(/Diapo 2\/21/).waitFor({ timeout: 2000 });
    metrics.optimisticNavLatencyMs = Date.now() - navStart;
    assert.ok(
      metrics.optimisticNavLatencyMs < 300,
      `Optimistic slide navigation took too long: ${metrics.optimisticNavLatencyMs}ms`
    );

    // Rapid 5x ArrowRight burst -> converges to slide 7, then Home -> returns to slide 1
    for (let i = 0; i < 5; i++) {
      await presenter.keyboard.press("ArrowRight");
      await presenter.waitForTimeout(25);
    }
    await presenter.getByText(/Diapo 7\/21/).waitFor({ timeout: 5000 });
    await presenter.keyboard.press("Home");
    await presenter.getByText(/Diapo 1\/21/).waitFor({ timeout: 5000 });
    await presenter.waitForTimeout(400);
    await presenter.screenshot({ path: path.join(ARTIFACT_DIR, "redesign_presenter.png") });

    // 2. Projector opens /screen at 1920x1080
    await screen.setViewportSize({ width: 1920, height: 1080 });
    await screen.goto(`${BASE}/screen`, { waitUntil: "networkidle" });
    await screen.getByText(/De l'IA à la création pédagogique/).waitFor({ timeout: 10000 });
    await screen.getByText(/من الذكاء الاصطناعي إلى الإبداع البيداغوجي/).waitFor({ timeout: 10000 });
    const proj1080Overflow = await screen.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    assert.ok(proj1080Overflow <= 2, `1920x1080 /screen overflow: ${proj1080Overflow}px`);

    // 3. Participant 1 tries Invalid PIN -> error, then valid PIN
    await p1.goto(`${BASE}/join`, { waitUntil: "networkidle" });
    await p1.getByPlaceholder("Ex. : 482915").fill(INVALID_PIN);
    await p1.getByPlaceholder(/Ex\. : Khadija B\./).fill("Khadija B.");
    await p1.getByRole("button", { name: /Entrer dans l'atelier/ }).click();
    await p1.getByText(/Code PIN de l'atelier incorrect\./).waitFor({ timeout: 8000 });

    await p1.getByPlaceholder("Ex. : 482915").fill(PIN);
    await p1.getByRole("button", { name: /Entrer dans l'atelier/ }).click();
    await p1.getByText(/Connecté\(e\) : Khadija B\./).waitFor({ timeout: 10000 });

    await p2.goto(`${BASE}/join`, { waitUntil: "networkidle" });
    await p2.getByPlaceholder("Ex. : 482915").fill(PIN);
    await p2.getByPlaceholder(/Ex\. : Khadija B\./).fill("Youssef E.");
    await p2.getByRole("button", { name: /Entrer dans l'atelier/ }).click();
    await p2.getByText(/Connecté\(e\) : Youssef E\./).waitFor({ timeout: 10000 });

    await screen.getByText(/2 collègues en ligne/).waitFor({ timeout: 10000 });
    console.log("✓ Step 0-3: Presentation-First Presenter, Rapid Keys, Projector & Participants synced");

    // 4. Section 2 Live Needs Poll + Failure Rollback + Instant Optimistic Feedback
    await openOutlineAndClick(presenter, /2\. Besoins des enseignants/i);
    await p1.getByText(/Identifier nos priorités sur le terrain/).waitFor({ timeout: 10000 });
    await p2.getByText(/Identifier nos priorités sur le terrain/).waitFor({ timeout: 10000 });

    // Track /api/participant/me calls during active poll/quiz submission
    let meCallsDuringVote = 0;
    const meListener = (req) => {
      if (req.url().includes("/api/participant/me")) meCallsDuringVote++;
    };
    p1.on("request", meListener);

    // Test simulated network failure -> rollback -> retry -> instant local feedback
    await p1.route("**/api/participant/respond", (route) => route.abort("failed"));
    await p1.getByRole("button", { name: /Différenciation pédagogique/ }).click();
    await p1.getByRole("button", { name: /Réessayer/ }).waitFor({ timeout: 5000 });
    await p1.unroute("**/api/participant/respond");

    const answerStart = Date.now();
    await p1.getByRole("button", { name: /Réessayer/ }).click();
    await p1
      .locator('button[aria-pressed="true"]', { hasText: /Différenciation pédagogique/ })
      .waitFor({ timeout: 2000 });
    metrics.optimisticAnswerLatencyMs = Date.now() - answerStart;
    await p1.getByText(/Réponse enregistrée/).waitFor({ timeout: 8000 });

    await p2.getByRole("button", { name: /Préparation des cours/ }).click();
    await p2.getByText(/Réponse enregistrée/).waitFor({ timeout: 8000 });

    assert.equal(
      meCallsDuringVote,
      0,
      `Expected 0 /api/participant/me refetches on ordinary vote, got ${meCallsDuringVote}`
    );
    p1.off("request", meListener);

    await presenter.getByRole("button", { name: /Afficher résultats/i }).click();
    await screen.getByText(/Résultats en direct/).waitFor({ timeout: 10000 });
    await screen.getByText(/2 participants/).waitFor({ timeout: 10000 });
    await screen.waitForTimeout(450);
    const chartStats = await screen.evaluate(() => {
      const texts = Array.from(document.querySelectorAll("svg text")).map((el) => el.textContent || "");
      return {
        hasArabicTick: texts.some((t) => /[\u0600-\u06FF]/.test(t)),
        hasFrenchTick: texts.some((t) => /[A-Za-zÀ-ÿ]{4,}/.test(t)),
      };
    });
    assert.ok(chartStats.hasArabicTick && chartStats.hasFrenchTick, "Bilingual SVG ticks missing FR or AR");
    await screen.screenshot({ path: path.join(ARTIFACT_DIR, "redesign_projector_poll.png") });

    await presenter.getByRole("button", { name: /^Fermer\s+إغلاق$/ }).click();
    await p2.getByText(/Sondage clôturé/).waitFor({ timeout: 10000 });
    console.log("✓ Step 4: Instant Poll, Rollback+Retry, Zero Extra Refetch & Projector Chart verified");

    // 5. Section 3 GenAI MCQ Quiz (rapid sibling answers + reveal + 390x844 check)
    await openOutlineAndClick(presenter, /Quiz express : 5 repères sur les LLM/i);
    await p1.getByText(/Quiz express : 5 repères sur les LLM/).waitFor({ timeout: 10000 });
    await p2.getByText(/Quiz express : 5 repères sur les LLM/).waitFor({ timeout: 10000 });

    await p1.getByRole("button", { name: /Il prédit les mots les plus probables/ }).click();
    // Immediately answer Q2 without waiting for Q1 save to finish
    await p1.getByRole("button", { name: /Une réponse fausse ou inventée formulée avec beaucoup d'assurance/ }).click();
    await p2.getByRole("button", { name: /Il consulte une base de manuels scolaires/ }).click();
    await p1.waitForTimeout(400);

    await presenter.getByRole("button", { name: /Révéler réponses/i }).click();
    await p1.getByText(/Votre score : 2 \/ 5/).waitFor({ timeout: 10000 });
    await p2.getByText(/Votre score : 0 \/ 5/).waitFor({ timeout: 10000 });
    const mobileOverflow = await p1.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    assert.ok(mobileOverflow <= 2, `Mobile 390x844 horizontal overflow: ${mobileOverflow}px`);
    await p1.screenshot({ path: path.join(ARTIFACT_DIR, "redesign_mobile_quiz.png") });
    console.log("✓ Step 5: Parallel Quiz Answers, Server Reveal & 390x844 Mobile Layout verified");

    // 6. Section 6 Prompt Builder
    await openOutlineAndClick(presenter, /Atelier pratique : Votre Prompt Builder/i);
    await p1.getByText(/Paramètres de votre classe \(1AEP–6AEP\)/).waitFor({ timeout: 10000 });
    await p1.getByRole("button", { name: /Partager avec l'atelier/ }).click();
    await p1.getByText(/Partagé avec la salle/).waitFor({ timeout: 8000 });

    // 7. Section 7 Meta-Prompt FR/AR RTL
    await openOutlineAndClick(presenter, /Exercice pratique : Transformez une idée brute/i);
    await p1.getByText(/Votre idée brute → Méta-Prompt/).waitFor({ timeout: 10000 });
    await p1.getByRole("button", { name: /Partager\s+مشاركة/ }).click();
    await p1.getByText(/Envoyé/).waitFor({ timeout: 8000 });

    // 8. Section 8 Web Trio
    await openOutlineAndClick(presenter, /8\. Créer une application avec l'IA/i);
    await screen.getByText(/HTML, CSS et JavaScript : le trio du navigateur/).waitFor({ timeout: 10000 });
    await screen.getByRole("button", { name: "300 + 40 + 5" }).click();
    await screen.getByText(/Bravo ! 3 centaines/).waitFor({ timeout: 5000 });

    // 9. Section 9 Live Demo
    await openOutlineAndClick(presenter, /9\. Démonstration en direct/i);
    await screen.getByText(/Un samedi matin au jardin de l'école/).waitFor({ timeout: 10000 });
    await screen.getByRole("button", { name: /Voir Prompt → Prototype/ }).click();
    await screen.getByText(/Prompts sources \(FR & AR\)/).waitFor({ timeout: 5000 });

    // 10. Section 10 12-Category Gallery & Group Projects
    await openOutlineAndClick(presenter, /10\. Galerie & Atelier en groupes/i);
    await screen.getByText(/12 catégories pour le primaire/).waitFor({ timeout: 10000 });
    await screen.getByRole("button", { name: /Tester\s+تجريب/ }).first().click();
    await screen.getByText(/تطبيق القراءة والمقاطع/).waitFor({ timeout: 5000 });
    await screen.getByRole("button", { name: /Tester\s+تجريب/ }).nth(7).click();
    const hasPrintSheet = await screen.evaluate(() => Boolean(document.querySelector(".print-sheet")));
    assert.ok(hasPrintSheet, "Expected .print-sheet inside Fiche imprimable mini-app");

    await openOutlineAndClick(presenter, /Atelier en groupes \(4 groupes/i);
    await screen.getByText(/Groupe 1 \(5 collègues\)/).waitFor({ timeout: 10000 });

    // 11. Section 11 Showcase Vote
    await openOutlineAndClick(presenter, /11\. Présentations & Showcase/i);
    await p1.getByText(/Showcase des groupes & Galerie Provinciale/).waitFor({ timeout: 10000 });
    await p1.getByRole("button", { name: /Groupe 3 · Remédiation 3 Parcours/ }).first().click();
    await p1.getByText(/Réponse enregistrée/).first().waitFor({ timeout: 8000 });

    // 12. Section 12 Exit Ticket & Closing
    await openOutlineAndClick(presenter, /12\. Conclusion & Engagement/i);
    await p1.getByText(/Ticket de sortie : Votre premier pas cette semaine/).waitFor({ timeout: 10000 });
    await p1
      .getByPlaceholder(/Préparer 3 fiches graduées/)
      .fill("Tester les flashcards bilingues avec ma classe de 3AEP.");
    await p1.getByRole("button", { name: /Envoyer mon engagement/ }).click();
    await p1.getByText(/Engagement enregistré/).waitFor({ timeout: 8000 });

    await openOutlineAndClick(presenter, /Ensemble, bâtissons nos propres outils/i);
    await screen.getByText(/Ne soyez pas seulement utilisateurs du numérique/).waitFor({ timeout: 10000 });
    await screen.getByText(/لا تكونوا مجرد مستعملين للتكنولوجيا الرقمية/).waitFor({ timeout: 10000 });
    console.log("✓ Step 6-12: Prompt Builder, Meta-Prompt, Web Trio, Gallery, Showcase, Exit Ticket & Closing verified");

    // 13. Tools Drawer Demo Mode & Purge
    await openToolsAndEnsureDemo(presenter, true);
    await openToolsAndEnsureDemo(presenter, false);
    await presenter.getByRole("button", { name: /^Tableau de bord\s+الأدوات$/ }).click();
    await presenter.getByRole("button", { name: /Supprimer les données des participants/ }).click();
    await presenter.getByPlaceholder("SUPPRIMER").fill("SUPPRIMER");
    await presenter.getByRole("button", { name: /Confirmer l'effacement/ }).click();
    await presenter.waitForTimeout(400);

    assert.equal(errors.length, 0, `Unexpected browser errors: ${errors.join(" | ")}`);
    console.log("METRICS:", JSON.stringify(metrics));
    console.log("ALL PRESENTATION-FIRST & INSTANT INTERACTION E2E VERIFICATIONS PASSED!");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("E2E VERIFICATION FAILED:", err);
  process.exit(1);
});
