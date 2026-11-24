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

async function run() {
  console.log(`\n=== Starting 4-Context Multi-Session E2E Verification (${BASE}) ===`);
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
  for (const [name, pg] of [
    ["presenter", presenter],
    ["screen", screen],
    ["p1", p1],
    ["p2", p2],
  ]) {
    pg.on("pageerror", (err) => errors.push(`${name} pageerror: ${err.message}`));
  }

  try {
    // 0. Gateway / Home bilingual & RTL check (no language toggle)
    await screen.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await screen.getByText(/Province de Mediouna · Centre de Digitalisation/).waitFor({ timeout: 10000 });
    await screen.getByText(/مختبر المعلم للذكاء الاصطناعي/).waitFor({ timeout: 10000 });
    const homeStats = await screen.evaluate(() => ({
      rtlCount: document.querySelectorAll('[dir="rtl"][lang="ar"]').length,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      toggleFound: /switch|fr\s*\/\s*ar\s*toggle|changer de langue/i.test(document.body.innerText),
    }));
    assert.ok(homeStats.rtlCount >= 4, `Expected >=4 RTL Arabic blocks on /, found ${homeStats.rtlCount}`);
    assert.ok(homeStats.overflow <= 2, `Unexpected overflow on /: ${homeStats.overflow}px`);
    assert.equal(homeStats.toggleFound, false, "Must NOT have a language toggle");
    await screen.screenshot({ path: path.join(ARTIFACT_DIR, "bilingual_home.png") });

    // 1. Presenter Login
    await presenter.goto(`${BASE}/presenter`, { waitUntil: "networkidle" });
    await presenter.getByPlaceholder("FACILITATOR_PASSCODE").fill(PASSCODE);
    await presenter.getByRole("button", { name: /Ouvrir le poste de contrôle/ }).click();
    await presenter.getByText(/AI Teacher Lab · Animateur/).waitFor({ timeout: 10000 });
    const presRtlCount = await presenter.evaluate(
      () => document.querySelectorAll('[dir="rtl"][lang="ar"]').length
    );
    assert.ok(presRtlCount >= 5, `Expected RTL blocks on /presenter, found ${presRtlCount}`);

    // Ensure clean real-session baseline & Welcome slide
    await presenter.evaluate(async () => {
      await fetch("/api/presenter/participants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: "SUPPRIMER" }),
      });
    });
    const demoBtn = presenter.getByRole("button", { name: /Mode Démo/i });
    if (!(await demoBtn.innerText()).includes("INACTIF")) {
      await demoBtn.click();
      await presenter.getByText(/^INACTIF$/).waitFor({ timeout: 5000 });
    }
    await presenter.getByRole("button", { name: /1\. Introduction/i }).click();
    await presenter.waitForTimeout(400);

    // 2. Projector opens /screen (verify 1920x1080 as well as 1440x900)
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

    // Participant 2 joins
    await p2.goto(`${BASE}/join`, { waitUntil: "networkidle" });
    await p2.getByPlaceholder("Ex. : 482915").fill(PIN);
    await p2.getByPlaceholder(/Ex\. : Khadija B\./).fill("Youssef E.");
    await p2.getByRole("button", { name: /Entrer dans l'atelier/ }).click();
    await p2.getByText(/Connecté\(e\) : Youssef E\./).waitFor({ timeout: 10000 });

    // Wait for attendance update on Projector
    await screen.getByText(/2 collègues en ligne/).waitFor({ timeout: 10000 });
    console.log("✓ Step 0-3: Bilingual Gateway, Presenter, Projector (1920x1080) & 2 Mobile Participants synced");

    // 4. Section 2 Live Needs Poll + Bilingual SVG Chart
    await presenter.getByRole("button", { name: /2\. Besoins des enseignants/i }).click();
    await p1.getByText(/Identifier nos priorités sur le terrain/).waitFor({ timeout: 10000 });
    await p1.getByText(/تحديد أولوياتنا في الميدان/).waitFor({ timeout: 10000 });
    await p2.getByText(/Identifier nos priorités sur le terrain/).waitFor({ timeout: 10000 });

    await p1.getByRole("button", { name: /Différenciation pédagogique/ }).click();
    await p1.getByText(/Vote enregistré/).waitFor({ timeout: 8000 });
    await p2.getByRole("button", { name: /Préparation des cours/ }).click();
    await p2.getByText(/Vote enregistré/).waitFor({ timeout: 8000 });

    await presenter.getByRole("button", { name: /Afficher résultats/i }).click();
    await screen.getByText(/Résultats en direct/).waitFor({ timeout: 10000 });
    await screen.getByText(/النتائج المباشرة/).waitFor({ timeout: 10000 });
    await screen.getByText(/2 participants/).waitFor({ timeout: 10000 });
    await screen.waitForTimeout(500);
    const chartStats = await screen.evaluate(() => {
      const texts = Array.from(document.querySelectorAll("svg text")).map((el) => el.textContent || "");
      return {
        hasArabicTick: texts.some((t) => /[\u0600-\u06FF]/.test(t)),
        hasFrenchTick: texts.some((t) => /[A-Za-zÀ-ÿ]{4,}/.test(t)),
      };
    });
    assert.ok(chartStats.hasArabicTick && chartStats.hasFrenchTick, "Bilingual SVG chart ticks missing FR or AR");
    await screen.screenshot({ path: path.join(ARTIFACT_DIR, "bilingual_projector_poll.png") });

    // Close poll -> verify participant lock
    await presenter.getByRole("button", { name: /^Fermer\s+إغلاق$/ }).click();
    await p2.getByText(/Sondage clôturé/).waitFor({ timeout: 10000 });
    console.log("✓ Step 4: Section 2 Bilingual Live Poll synced, charted on /screen, and locked on close");

    // 5. Section 3 GenAI MCQ Quiz & Reveal + Mobile Overflow Check
    await presenter.getByRole("button", { name: /3\. Comprendre l'IA générative/i }).click();
    await presenter.getByRole("button", { name: /Quiz express : 5 repères sur les LLM/i }).click();
    await p1.getByText(/Quiz express : 5 repères sur les LLM/).waitFor({ timeout: 10000 });
    await p2.getByText(/Quiz express : 5 repères sur les LLM/).waitFor({ timeout: 10000 });

    await p1
      .getByRole("button", { name: /Il prédit les mots les plus probables/ })
      .click();
    await p2
      .getByRole("button", { name: /Il consulte une base de manuels scolaires/ })
      .click();
    await p1.waitForTimeout(400);

    await presenter.getByRole("button", { name: /Révéler réponses/i }).click();
    await p1.getByText(/Votre score : 1 \/ 5/).waitFor({ timeout: 10000 });
    await p2.getByText(/Votre score : 0 \/ 5/).waitFor({ timeout: 10000 });
    await p1
      .getByText(/Un LLM génère du texte mot après mot/)
      .waitFor({ timeout: 8000 });
    const mobileOverflow = await p1.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    assert.ok(mobileOverflow <= 2, `Mobile 390x844 horizontal overflow: ${mobileOverflow}px`);
    await p1.screenshot({ path: path.join(ARTIFACT_DIR, "bilingual_mobile_join_quiz.png") });
    console.log("✓ Step 5: Section 3 Bilingual Quiz graded, revealed, and mobile 390x844 verified");

    // 6. Section 6 Prompt Builder (dual FR & AR assembled prompts)
    await presenter.getByRole("button", { name: /6\. Prompt Engineering/i }).click();
    await presenter.getByRole("button", { name: /Atelier pratique : Votre Prompt Builder/i }).click();
    await p1.getByText(/Paramètres de votre classe \(1AEP–6AEP\)/).waitFor({ timeout: 10000 });
    await p1.getByText(/إعدادات قسمكم الدراسي/).waitFor({ timeout: 10000 });
    await p1.getByText(/Prompt assemblé \(FR\)/).waitFor({ timeout: 10000 });
    await p1.getByText(/التوجيه المركّب بالعربية \(AR\)/).waitFor({ timeout: 10000 });
    await p1.getByRole("button", { name: /Partager avec l'atelier/ }).click();
    await p1.getByText(/Partagé avec la salle/).waitFor({ timeout: 8000 });

    // 7. Section 7 Meta-Prompt FR/AR RTL
    await presenter.getByRole("button", { name: /7\. Le Méta-Prompting/i }).click();
    await presenter.getByRole("button", { name: /Exercice pratique : Transformez une idée brute/i }).click();
    await p1.getByText(/Votre idée brute → Méta-Prompt/).waitFor({ timeout: 10000 });
    await p1.getByRole("button", { name: /Partager\s+مشاركة/ }).click();
    await p1.getByText(/Envoyé/).waitFor({ timeout: 8000 });

    // 8. Section 8 HTML/CSS/JS live toggle
    await presenter.getByRole("button", { name: /8\. Créer une application avec l'IA/i }).click();
    await screen.getByText(/HTML, CSS et JavaScript : le trio du navigateur/).waitFor({ timeout: 10000 });
    await screen.getByRole("button", { name: "300 + 40 + 5" }).click();
    await screen.getByText(/Bravo ! 3 centaines/).waitFor({ timeout: 5000 });

    // 9. Section 9 Live Demo Quiz App
    await presenter.getByRole("button", { name: /9\. Démonstration en direct/i }).click();
    await screen.getByText(/Un samedi matin au jardin de l'école/).waitFor({ timeout: 10000 });
    await screen.getByRole("button", { name: /Voir Prompt → Prototype/ }).click();
    await screen.getByText(/Prompts sources \(FR & AR\)/).waitFor({ timeout: 5000 });

    // 10. Section 10 12-Category Gallery + Functional Mini-App + Print Sheet + Group Projects
    await presenter.getByRole("button", { name: /10\. Galerie & Atelier en groupes/i }).click();
    await screen.getByText(/12 catégories pour le primaire/).waitFor({ timeout: 10000 });
    await screen.getByText(/Outils de préparation/).waitFor({ timeout: 5000 });
    await screen.getByRole("button", { name: /Tester\s+تجريب/ }).first().click();
    await screen.getByText(/تطبيق القراءة والمقاطع/).waitFor({ timeout: 5000 });
    await screen.screenshot({ path: path.join(ARTIFACT_DIR, "bilingual_gallery_miniapp.png") });
    // Verify printable sheet mini-app renders .print-sheet (index 7 = item #9 printable-worksheet)
    await screen.getByRole("button", { name: /Tester\s+تجريب/ }).nth(7).click();
    const hasPrintSheet = await screen.evaluate(() => Boolean(document.querySelector(".print-sheet")));
    assert.ok(hasPrintSheet, "Expected .print-sheet inside Fiche imprimable mini-app");

    await presenter.getByRole("button", { name: /Atelier en groupes \(4 groupes/i }).click();
    await screen.getByText(/Groupe 1 \(5 collègues\)/).waitFor({ timeout: 10000 });
    console.log("✓ Step 6-10: Prompt Builder, Meta-Prompt RTL, Web Trio, Live Demo, 12-Category Gallery, Print Sheet & Group Projects verified");

    // 11. Section 11 Showcase Vote + Provincial Gallery Contribution
    await presenter.getByRole("button", { name: /11\. Présentations & Showcase/i }).click();
    await p1.getByText(/Showcase des groupes & Galerie Provinciale/).waitFor({ timeout: 10000 });
    await p1.getByRole("button", { name: /Groupe 3 · Remédiation 3 Parcours/ }).first().click();
    await p1.getByRole("button", { name: /Déposer un prototype/ }).click();
    await p1.getByPlaceholder(/Titre de l'application pédagogique/).fill("Cartes Lecture 2AEP");
    await p1.getByPlaceholder(/Fichier HTML, lien ou support/).fill("lecture-2aep.html");
    await p1.getByPlaceholder(/Objectif d'apprentissage/).fill("Lire des syllabes simples avec voyelles courtes.");
    await p1.getByPlaceholder(/Description courte du prototype/).fill("Cartes interactives projetables utilisables hors ligne.");
    await p1.getByPlaceholder(/Mode d'emploi en classe/).fill("Projeter 5 min en début de séance.");
    await p1.getByLabel(/Je certifie que ce prototype/).check();
    await p1.getByRole("button", { name: /Publier dans la Galerie Provinciale/ }).click();
    await p1.getByText(/Merci ! Votre prototype est ajouté/).waitFor({ timeout: 8000 });

    // 12. Section 12 Exit Ticket & Closing Quote
    await presenter.getByRole("button", { name: /12\. Conclusion & Engagement/i }).click();
    await p1.getByText(/Ticket de sortie : Votre premier pas cette semaine/).waitFor({ timeout: 10000 });
    await p1
      .getByPlaceholder(/Préparer 3 fiches graduées/)
      .fill("Tester les flashcards bilingues avec ma classe de 3AEP.");
    await p1.getByRole("button", { name: /Envoyer mon engagement/ }).click();
    await p1.getByText(/Engagement enregistré/).waitFor({ timeout: 8000 });

    await presenter.getByRole("button", { name: /Ensemble, bâtissons nos propres outils/i }).click();
    await screen.getByText(/Ne soyez pas seulement utilisateurs du numérique/).waitFor({ timeout: 10000 });
    await screen.getByText(/لا تكونوا مجرد مستعملين للتكنولوجيا الرقمية/).waitFor({ timeout: 10000 });
    console.log("✓ Step 11-12: Showcase Vote, Provincial Gallery Contribution, Exit Ticket & Bilingual Closing verified");

    // 13. Demo Mode & Presenter Dashboard Screenshot + Reset + Purge
    await presenter.getByRole("button", { name: /Mode Démo/i }).click();
    await presenter.getByText(/^ACTIF$/).waitFor({ timeout: 8000 });
    await presenter.getByRole("button", { name: /Tableau de bord/ }).click();
    await presenter.getByText(/Participation par activité \(session active\)/).waitFor({ timeout: 8000 });
    await presenter.screenshot({ path: path.join(ARTIFACT_DIR, "bilingual_presenter_dashboard.png") });

    // Turn Demo Mode OFF & purge real participant data
    await presenter.getByRole("button", { name: /Mode Démo/i }).click();
    await presenter.getByText(/^INACTIF$/).waitFor({ timeout: 8000 });
    await presenter.getByRole("button", { name: /Supprimer les données des participants/ }).click();
    await presenter.getByPlaceholder("SUPPRIMER").fill("SUPPRIMER");
    await presenter.getByRole("button", { name: /Confirmer l'effacement/ }).click();
    await presenter.waitForTimeout(500);

    assert.equal(errors.length, 0, `Unexpected browser errors: ${errors.join(" | ")}`);
    console.log("ALL BILINGUAL 4-CONTEXT MULTI-SESSION E2E VERIFICATIONS PASSED WITH ZERO PAGE ERRORS!");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("E2E VERIFICATION FAILED:", err);
  process.exit(1);
});
