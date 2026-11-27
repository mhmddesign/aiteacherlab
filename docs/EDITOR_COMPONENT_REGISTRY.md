# Editor Component Registry (`EDITOR_COMPONENT_REGISTRY.md`)

> **Implementation Modules:** `src/lib/studio/component-registry.ts`, `src/components/studio/elements/ElementRenderer.tsx`, `src/components/studio/elements/CodeSandboxFrame.tsx`

---

## 1. Registration Contract
Every component registered in `COMPONENT_REGISTRY` declares:
- `type`: stable slug ID (validated by Zod)
- `category`: `"general" | "interactive" | "primary" | "code"`
- `label`: simultaneous `{ fr, ar }`
- `description`: simultaneous `{ fr, ar }`
- `defaultSize`: `{ width, height }` on the `1920 × 1080` canvas
- `supportsParticipantRuntime`: boolean (whether `/join` renders an interactive submission UI for live sessions)
- `activityType`: optional live activity binding (`"poll" | "mcq_quiz" | "tf_quiz" | "short_answer" | "word_cloud" | "flashcards" | "matching" | "ordering" | "exit_ticket" | "group_task"`)
- `defaultBilingual` & `defaultConfig`

---

## 2. Full Component Catalog (35 Native Types)

### A. General Layout & Content (13)
1. `heading` — Titre éditorial FR/AR (`Fraunces` + `IBM Plex Sans Arabic`)
2. `text` — Paragraphe / Bloc de texte bilingue
3. `bilingual-card` — Carte structurée FR (LTR) + AR (RTL)
4. `callout` — Encadré pédagogique / Darija
5. `image` — Image ou illustration avec texte alternatif FR/AR
6. `shape` — Forme géométrique (rectangle, badge, panneau accent)
7. `divider` — Séparateur horizontal ou vertical
8. `list` — Liste ordonnée / à puces bilingue
9. `table` — Tableau comparatif structuré FR/AR
10. `chart` — Graphique en barres / données classe (SVG pur imprimable)
11. `timeline` — Frise chronologique / Séquence pédagogique
12. `diagram` — Diagramme d'étapes / Flux conceptuel (3–6 étapes)
13. `qr-join` — Carte d'accès QR + lien + code PIN session

### B. Interactive Live & Classroom Engagement (12)
14. `live-poll` — Sondage en direct (options configurables + agrégat temps réel)
15. `mcq-quiz` — Quiz QCM (options, bonne réponse serveur, explication FR/AR)
16. `tf-quiz` — Quiz Vrai / Faux bilingue avec justification
17. `short-answer` — Réponse courte collectée anonymement en session
18. `word-cloud` — Nuage de mots / idées en direct des participants
19. `flashcards` — Cartes mémoire recto-verso interactives (FR/AR)
20. `matching` — Association par paires interactive
21. `ordering` — Remise en ordre d'étapes / séquences
22. `reveal-card` — Zone Révéler / Masquer (corrigé progressif au tableau)
23. `countdown-timer` — Minuteur de classe réglable (Démarrer / Pause / Réinitialiser)
24. `group-task` — Consigne d'atelier en groupes + durée + livrable
25. `exit-ticket` — Ticket de sortie / Bilan de fin de séance

### C. Moroccan Primary School Teaching (1AEP–6AEP) (9)
26. `arabic-letters` — Plateau lettres arabes & Harakat (`بَ بِ بُ بْ` interactif RTL)
27. `french-reading` — Lecture syllabique & compréhension français (LTR)
28. `number-line` — Droite numérique interactive (bornes et sauts configurables)
29. `abacus` — Boulier compteur C / D / U (centaines, dizaines, unités)
30. `base10-blocks` — Matériel Base 10 (plaques 100, barres 10, cubes 1)
31. `fractions-lab` — Visualiseur de fractions (numérateur / dénominateur interactifs)
32. `math-operations` — Poser une addition / soustraction / multiplication guidée
33. `tarl-tracks` — Parcours différenciés TaRL (3 niveaux : Consolidé, En cours, Soutien)
34. `worksheet-generator` — Fiche d'exercices prête à imprimer en A4

### D. Advanced Authored Code (1)
35. `code-sandbox` — Mini-application HTML/CSS/JavaScript exécutée dans `<iframe sandbox="allow-scripts">`
