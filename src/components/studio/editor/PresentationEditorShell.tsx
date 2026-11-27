"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Code2,
  CopyPlus,
  Download,
  History,
  Layers,
  LayoutGrid,
  Lock,
  MonitorPlay,
  Plus,
  Printer,
  Redo2,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import type {
  ComponentTypeId,
  DeckDocumentV1,
  DeckSlide,
  SlideElement,
} from "@/lib/studio/document-schema";
import {
  COMPONENT_LIST,
  createSlideElement,
  type ComponentCategory,
} from "@/lib/studio/component-registry";
import type { StudioDeckRecord } from "@/lib/studio/studio-store";
import { AiSlideAssistantDrawer } from "@/components/studio/ai/AiSlideAssistantDrawer";
import { CodeStudioModal } from "./CodeStudioModal";
import { EditorCanvasStage } from "./EditorCanvasStage";
import { PropertiesInspectorPanel } from "./PropertiesInspectorPanel";

interface PresentationEditorShellProps {
  initialDeck: StudioDeckRecord;
  roomTitleFr: string;
  roomTitleAr: string;
  initialAuthenticated: boolean;
}

interface RevisionSummary {
  id: string;
  revisionNo: number;
  summary: { fr: string; ar: string };
  source: string;
  createdAt: string;
  slideCount: number;
}

const CATEGORY_LABELS: Array<{ id: ComponentCategory | "all"; fr: string; ar: string }> = [
  { id: "all", fr: "Tous (35)", ar: "الكل" },
  { id: "general", fr: "Général", ar: "عام" },
  { id: "interactive", fr: "Interactifs", ar: "تفاعلي" },
  { id: "primary", fr: "Primaire", ar: "ابتدائي" },
  { id: "code", fr: "Code", ar: "كود" },
];

export function PresentationEditorShell({
  initialDeck,
  roomTitleFr,
  roomTitleAr,
  initialAuthenticated,
}: PresentationEditorShellProps) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [unlockPasscode, setUnlockPasscode] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);

  const [doc, setDoc] = useState<DeckDocumentV1>(initialDeck.document);
  const [revisionNo, setRevisionNo] = useState<number>(initialDeck.currentRevisionNo);
  const [past, setPast] = useState<DeckDocumentV1[]>([]);
  const [future, setFuture] = useState<DeckDocumentV1[]>([]);

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [leftTab, setLeftTab] = useState<"slides" | "components" | "layers">("slides");
  const [compCategory, setCompCategory] = useState<ComponentCategory | "all">("all");
  const [compSearch, setCompSearch] = useState("");
  const [snapToGrid, setSnapToGrid] = useState(true);

  const [saveState, setSaveState] = useState<
    "saved" | "dirty" | "saving" | "conflict" | "error"
  >("saved");
  const [conflictServerDoc, setConflictServerDoc] = useState<{
    revisionNo: number;
    document: DeckDocumentV1;
  } | null>(null);

  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showRevisions, setShowRevisions] = useState(false);
  const [revisions, setRevisions] = useState<RevisionSummary[]>([]);
  const [launchingLive, setLaunchingLive] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const draftKey = `aiteacherlab_editor_draft_${initialDeck.id}`;
  const docRef = useRef(doc);
  const revRef = useRef(revisionNo);

  useEffect(() => {
    docRef.current = doc;
    revRef.current = revisionNo;
  }, [doc, revisionNo]);

  const activeSlide = doc.slides[activeSlideIdx] ?? doc.slides[0];
  const selectedElement = useMemo(
    () => activeSlide?.elements.find((e) => e.id === selectedElementId) ?? null,
    [activeSlide, selectedElementId]
  );

  // Read crash recovery draft without setting state inside useEffect
  const [recoverableDraft, setRecoverableDraft] = useState<DeckDocumentV1 | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = window.localStorage.getItem(
        `aiteacherlab_editor_draft_${initialDeck.id}`
      );
      if (saved) {
        const parsed = JSON.parse(saved) as { revisionNo: number; document: DeckDocumentV1 };
        if (parsed?.document?.slides && parsed.revisionNo >= initialDeck.currentRevisionNo) {
          if (JSON.stringify(parsed.document) !== JSON.stringify(initialDeck.document)) {
            return parsed.document;
          }
        }
      }
    } catch {
      // ignore localStorage parse issues
    }
    return null;
  });

  const commitDocument = useCallback(
    (updater: (prev: DeckDocumentV1) => DeckDocumentV1) => {
      setDoc((prev) => {
        const next = updater(prev);
        setPast((p) => [...p.slice(-39), prev]);
        setFuture([]);
        setSaveState("dirty");
        try {
          window.localStorage.setItem(
            draftKey,
            JSON.stringify({ revisionNo: revRef.current, document: next })
          );
        } catch {
          // ignore
        }
        return next;
      });
    },
    [draftKey]
  );

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const previous = p[p.length - 1];
      setFuture((f) => [docRef.current, ...f]);
      setDoc(previous);
      setSaveState("dirty");
      return p.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      setPast((p) => [...p, docRef.current]);
      setDoc(next);
      setSaveState("dirty");
      return f.slice(1);
    });
  }, []);

  const saveToServer = useCallback(
    async (
      source: "manual" | "autosave" | "ai" = "manual",
      overrideExpectedRev?: number,
      summaryFr?: string
    ) => {
      if (!authenticated) return;
      setSaveState("saving");
      try {
        const res = await fetch(`/api/studio/decks/${initialDeck.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedRevision: overrideExpectedRev ?? revRef.current,
            document: docRef.current,
            source,
            summary: summaryFr
              ? { fr: summaryFr, ar: summaryFr }
              : source === "autosave"
                ? { fr: "Sauvegarde automatique", ar: "حفظ تلقائي" }
                : { fr: "Enregistrement manuel", ar: "حفظ يدوي" },
          }),
        });
        const json = await res.json();
        if (res.status === 409) {
          setSaveState("conflict");
          setConflictServerDoc({
            revisionNo: json.currentRevisionNo,
            document: json.serverDocument,
          });
          return;
        }
        if (res.status === 401) {
          setAuthenticated(false);
          setSaveState("dirty");
          return;
        }
        if (!res.ok) {
          setSaveState("error");
          setToast(json.error ?? "Échec de l'enregistrement.");
          return;
        }
        setRevisionNo(json.deck.currentRevisionNo);
        setSaveState("saved");
        setConflictServerDoc(null);
        try {
          window.localStorage.removeItem(draftKey);
        } catch {
          // ignore
        }
      } catch {
        setSaveState("error");
      }
    },
    [authenticated, draftKey, initialDeck.id]
  );

  // Debounced autosave while editing
  useEffect(() => {
    if (saveState !== "dirty" || !authenticated) return;
    const timer = window.setTimeout(() => {
      void saveToServer("autosave");
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [saveState, authenticated, saveToServer, doc]);

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S, Delete)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void saveToServer("manual");
        return;
      }
      if (inInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      } else if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
        e.preventDefault();
        commitDocument((prev) => ({
          ...prev,
          slides: prev.slides.map((s, idx) =>
            idx === activeSlideIdx
              ? {
                  ...s,
                  legacySource: s.legacySource ? { ...s.legacySource, edited: true } : undefined,
                  elements: s.elements.filter((el) => el.id !== selectedElementId),
                }
              : s
          ),
        }));
        setSelectedElementId(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeSlideIdx, commitDocument, redo, saveToServer, selectedElementId, undo]);

  async function handleUnlock() {
    setUnlockError(null);
    const res = await fetch("/api/presenter/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: unlockPasscode }),
    });
    const json = await res.json();
    if (!res.ok) {
      setUnlockError(json.error ?? "Code invalide.");
      return;
    }
    setAuthenticated(true);
    setToast("Mode formateur déverrouillé · تم فتح وضع التحرير");
  }

  function updateActiveSlide(patch: Partial<DeckSlide>) {
    commitDocument((prev) => ({
      ...prev,
      slides: prev.slides.map((s, idx) =>
        idx === activeSlideIdx
          ? {
              ...s,
              ...patch,
              legacySource:
                patch.legacySource !== undefined
                  ? patch.legacySource
                  : s.legacySource
                    ? { ...s.legacySource, edited: true }
                    : undefined,
            }
          : s
      ),
    }));
  }

  function addComponentToSlide(
    type: Exclude<ComponentTypeId, "unknown-element">,
    customOverrides?: Partial<SlideElement>
  ) {
    const newEl = createSlideElement(type, {
      x: 160 + ((activeSlide.elements.length * 40) % 240),
      y: 260 + ((activeSlide.elements.length * 36) % 200),
      zIndex: activeSlide.elements.length + 1,
      ...customOverrides,
    });
    commitDocument((prev) => ({
      ...prev,
      slides: prev.slides.map((s, idx) =>
        idx === activeSlideIdx
          ? {
              ...s,
              legacySource: s.legacySource ? { ...s.legacySource, edited: true } : undefined,
              elements: [...s.elements, newEl],
            }
          : s
      ),
    }));
    setSelectedElementId(newEl.id);
    setToast(`Ajouté : ${type}`);
  }

  function addNewSlide() {
    const newSlideId = `slide-${Date.now().toString(36)}`;
    const newSlide: DeckSlide = {
      id: newSlideId,
      order: doc.slides.length,
      sectionId: doc.sections[0]?.id ?? "sec-1",
      title: { fr: `Nouvelle diapositive ${doc.slides.length + 1}`, ar: `شريحة جديدة ${doc.slides.length + 1}` },
      subtitle: { fr: "", ar: "" },
      layout: "freeform",
      hidden: false,
      transition: "fade",
      background: { color: "#FAF8F4", accentColor: "#0F766E" },
      notes: {
        fr: "",
        ar: "",
        darijaFr: "",
        darijaAr: "",
        durationCue: "3 min",
        classroomExampleFr: "",
        classroomExampleAr: "",
        discussionPromptFr: "",
        discussionPromptAr: "",
      },
      elements: [
        createSlideElement("heading", {
          x: 84,
          y: 64,
          width: 1752,
          height: 170,
          zIndex: 1,
          bilingual: {
            fr: `Titre de la diapositive ${doc.slides.length + 1}`,
            ar: `عنوان الشريحة ${doc.slides.length + 1}`,
          },
        }),
        createSlideElement("bilingual-card", {
          x: 84,
          y: 280,
          width: 1752,
          height: 360,
          zIndex: 2,
        }),
      ],
    };

    commitDocument((prev) => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
    setActiveSlideIdx(doc.slides.length);
    setSelectedElementId(null);
  }

  function duplicateActiveSlide() {
    if (!activeSlide) return;
    const copy: DeckSlide = {
      ...structuredClone(activeSlide),
      id: `slide-${Date.now().toString(36)}`,
      title: { fr: `${activeSlide.title.fr} (copie)`, ar: `${activeSlide.title.ar} (نسخة)` },
      legacySource: activeSlide.legacySource ? { ...activeSlide.legacySource, edited: true } : undefined,
      elements: activeSlide.elements.map((el, i) => ({
        ...structuredClone(el),
        id: `${el.id}-copy-${i}`,
      })),
    };
    const nextSlides = [...doc.slides];
    nextSlides.splice(activeSlideIdx + 1, 0, copy);
    commitDocument((prev) => ({
      ...prev,
      slides: nextSlides.map((s, idx) => ({ ...s, order: idx })),
    }));
    setActiveSlideIdx(activeSlideIdx + 1);
  }

  function moveSlide(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= doc.slides.length) return;
    const next = [...doc.slides];
    [next[index], next[target]] = [next[target], next[index]];
    commitDocument((prev) => ({
      ...prev,
      slides: next.map((s, idx) => ({ ...s, order: idx })),
    }));
    setActiveSlideIdx(target);
  }

  function deleteSlide(index: number) {
    if (doc.slides.length <= 1) return;
    const next = doc.slides.filter((_, i) => i !== index).map((s, idx) => ({ ...s, order: idx }));
    commitDocument((prev) => ({ ...prev, slides: next }));
    setActiveSlideIdx(Math.max(0, Math.min(index, next.length - 1)));
    setSelectedElementId(null);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function loadRevisions() {
    setShowRevisions(true);
    const res = await fetch(`/api/studio/decks/${initialDeck.id}/revisions`);
    const json = await res.json();
    if (res.ok) setRevisions(json.revisions ?? []);
  }

  async function restoreRevision(revNo: number) {
    const res = await fetch(`/api/studio/decks/${initialDeck.id}/revisions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "restore", revisionNo: revNo }),
    });
    const json = await res.json();
    if (res.ok && json.deck) {
      setDoc(json.deck.document);
      setRevisionNo(json.deck.currentRevisionNo);
      setPast([]);
      setFuture([]);
      setSaveState("saved");
      setShowRevisions(false);
      setToast(`Révision v${revNo} restaurée.`);
    }
  }

  async function launchLiveSession() {
    setLaunchingLive(true);
    try {
      await saveToServer("manual");
      const res = await fetch(`/api/studio/rooms/${initialDeck.roomId}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckId: initialDeck.id, title: doc.title }),
      });
      const json = await res.json();
      if (!res.ok) {
        setToast(json.error ?? "Impossible de démarrer la session.");
        return;
      }
      router.push(`/presenter?sessionId=${encodeURIComponent(json.session.id)}`);
    } finally {
      setLaunchingLive(false);
    }
  }

  const filteredComponents = useMemo(() => {
    const q = compSearch.trim().toLowerCase();
    return COMPONENT_LIST.filter((c) => {
      if (compCategory !== "all" && c.category !== compCategory) return false;
      if (!q) return true;
      return (
        c.label.fr.toLowerCase().includes(q) ||
        c.label.ar.includes(q) ||
        c.description.fr.toLowerCase().includes(q) ||
        c.type.includes(q)
      );
    });
  }, [compCategory, compSearch]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#FAF8F4] text-[#0B1220]">
      {/* Top Studio Editor Toolbar */}
      <header className="shrink-0 border-b border-[#D9D0BE] bg-[#0B1220] text-white px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href={`/studio?room=${encodeURIComponent(initialDeck.roomId)}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Studio</span>
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={doc.title.fr}
                onChange={(e) =>
                  commitDocument((prev) => ({
                    ...prev,
                    title: { ...prev.title, fr: e.target.value },
                  }))
                }
                aria-label="Titre de présentation FR"
                className="bg-transparent border-b border-transparent focus:border-teal-400 focus:outline-none text-sm font-bold text-white max-w-[260px] truncate"
              />
              <span
                data-editor-revision={revisionNo}
                className="rounded-full bg-teal-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-teal-300"
              >
                v{revisionNo}
              </span>
              <span
                data-save-status={saveState}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  saveState === "saved"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : saveState === "saving"
                      ? "bg-sky-500/20 text-sky-200"
                      : saveState === "conflict" || saveState === "error"
                        ? "bg-rose-500/30 text-rose-200"
                        : "bg-amber-500/25 text-amber-200"
                }`}
              >
                {saveState === "saved"
                  ? "Enregistré"
                  : saveState === "saving"
                    ? "Sauvegarde..."
                    : saveState === "conflict"
                      ? "Conflit"
                      : saveState === "error"
                        ? "Erreur"
                        : "Modifié"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {roomTitleFr} · <span className="font-arabic">{roomTitleAr}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            disabled={past.length === 0}
            onClick={undo}
            data-editor-undo="true"
            title="Annuler (Ctrl+Z)"
            aria-label="Annuler"
            className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20 disabled:opacity-35"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={future.length === 0}
            onClick={redo}
            data-editor-redo="true"
            title="Rétablir (Ctrl+Y)"
            aria-label="Rétablir"
            className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20 disabled:opacity-35"
          >
            <Redo2 className="h-4 w-4" />
          </button>

          <label className="hidden md:inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] cursor-pointer">
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={(e) => setSnapToGrid(e.target.checked)}
            />
            <span>Grille 8px</span>
          </label>

          <button
            type="button"
            onClick={() => setShowAiDrawer(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600/30 border border-teal-400/40 px-2.5 py-1.5 text-xs font-bold text-teal-200 hover:bg-teal-600/50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Assistant IA</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCodeModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold hover:bg-white/20"
          >
            <Code2 className="h-3.5 w-3.5 text-teal-300" />
            <span>Code HTML/JS</span>
          </button>

          <button
            type="button"
            onClick={loadRevisions}
            className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold hover:bg-white/20"
          >
            <History className="h-3.5 w-3.5" />
            <span>Versions</span>
          </button>

          <button
            type="button"
            onClick={exportJson}
            title="Exporter JSON Studio"
            className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1.5 text-xs font-bold hover:bg-white/20"
          >
            <Download className="h-3.5 w-3.5" />
          </button>

          <Link
            href={`/export/slides?deckId=${encodeURIComponent(initialDeck.id)}&mode=slides`}
            target="_blank"
            className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold hover:bg-white/20"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>PDF 16:9</span>
          </Link>

          <button
            type="button"
            onClick={() => saveToServer("manual")}
            data-editor-save="true"
            disabled={!authenticated || saveState === "saving"}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-500 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Enregistrer</span>
          </button>

          <button
            type="button"
            disabled={!authenticated || launchingLive}
            onClick={launchLiveSession}
            data-launch-live-btn="true"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-[#0B1220] hover:bg-amber-400 disabled:opacity-50"
          >
            <MonitorPlay className="h-3.5 w-3.5" />
            <span>Lancer Live</span>
          </button>
        </div>
      </header>

      {/* Banners: Facilitator Unlock, Crash Recovery, Revision Conflict */}
      {!authenticated && (
        <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-amber-950 flex items-center gap-1.5">
            <Lock className="h-4 w-4" />
            Déverrouillez l&apos;accès formateur pour enregistrer vos modifications sur le serveur et lancer des sessions Live.
          </span>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={unlockPasscode}
              onChange={(e) => setUnlockPasscode(e.target.value)}
              placeholder="Code animateur"
              className="rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs"
            />
            <button
              type="button"
              onClick={handleUnlock}
              className="rounded-lg bg-amber-700 px-3 py-1 font-bold text-white"
            >
              Déverrouiller
            </button>
            {unlockError && <span className="text-rose-700 font-bold">{unlockError}</span>}
          </div>
        </div>
      )}

      {recoverableDraft && (
        <div className="shrink-0 bg-sky-50 border-b border-sky-200 px-4 py-2 flex items-center justify-between gap-2 text-xs text-sky-950">
          <span>Brouillon local non sauvegardé détecté. Voulez-vous le restaurer ?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDoc(recoverableDraft);
                setRecoverableDraft(null);
                setSaveState("dirty");
              }}
              className="rounded-lg bg-sky-700 px-3 py-1 font-bold text-white"
            >
              Restaurer le brouillon
            </button>
            <button
              type="button"
              onClick={() => {
                setRecoverableDraft(null);
                window.localStorage.removeItem(draftKey);
              }}
              className="rounded-lg border border-sky-300 bg-white px-2.5 py-1 font-bold"
            >
              Ignorer
            </button>
          </div>
        </div>
      )}

      {saveState === "conflict" && conflictServerDoc && (
        <div
          data-conflict-banner="true"
          className="shrink-0 bg-rose-50 border-b border-rose-300 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-rose-950"
        >
          <span className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            Conflit détecté : une version plus récente (v{conflictServerDoc.revisionNo}) existe sur le serveur.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDoc(conflictServerDoc.document);
                setRevisionNo(conflictServerDoc.revisionNo);
                setSaveState("saved");
                setConflictServerDoc(null);
              }}
              className="rounded-lg border border-rose-300 bg-white px-3 py-1 font-bold"
            >
              Charger la version serveur
            </button>
            <button
              type="button"
              onClick={() => {
                setRevisionNo(conflictServerDoc.revisionNo);
                void saveToServer("manual", conflictServerDoc.revisionNo, "Résolution de conflit");
              }}
              className="rounded-lg bg-rose-700 px-3 py-1 font-bold text-white"
            >
              Écraser avec ma version
            </button>
          </div>
        </div>
      )}

      {/* Main 3-Column Authoring Workspace */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Rail: Slides / Component Library / Layers */}
        <aside className="w-full lg:w-72 shrink-0 border-r border-[#E9E3D6] bg-white flex flex-col min-h-0">
          <div className="grid grid-cols-3 border-b border-[#E9E3D6] bg-[#FAF8F4] text-xs font-bold">
            <button
              type="button"
              onClick={() => setLeftTab("slides")}
              data-left-tab="slides"
              className={`py-2.5 flex items-center justify-center gap-1 border-b-2 ${
                leftTab === "slides"
                  ? "border-teal-700 text-teal-800 bg-white"
                  : "border-transparent text-slate-600"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Slides ({doc.slides.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setLeftTab("components")}
              data-left-tab="components"
              className={`py-2.5 flex items-center justify-center gap-1 border-b-2 ${
                leftTab === "components"
                  ? "border-teal-700 text-teal-800 bg-white"
                  : "border-transparent text-slate-600"
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Blocs</span>
            </button>
            <button
              type="button"
              onClick={() => setLeftTab("layers")}
              data-left-tab="layers"
              className={`py-2.5 flex items-center justify-center gap-1 border-b-2 ${
                leftTab === "layers"
                  ? "border-teal-700 text-teal-800 bg-white"
                  : "border-transparent text-slate-600"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Calques</span>
            </button>
          </div>

          {leftTab === "slides" && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={addNewSlide}
                  data-add-slide="true"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-3 py-2 text-xs font-bold text-white hover:bg-teal-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Nouvelle slide</span>
                </button>
                <button
                  type="button"
                  onClick={duplicateActiveSlide}
                  title="Dupliquer cette slide"
                  className="rounded-xl border border-[#D9D0BE] bg-[#FAF8F4] p-2 hover:border-teal-600"
                >
                  <CopyPlus className="h-4 w-4" />
                </button>
              </div>

              {doc.slides.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveSlideIdx(idx);
                    setSelectedElementId(null);
                  }}
                  data-slide-thumb={idx}
                  className={`group rounded-xl border p-2.5 cursor-pointer transition space-y-1 ${
                    idx === activeSlideIdx
                      ? "border-teal-700 bg-teal-50/70 shadow-xs"
                      : "border-[#E9E3D6] bg-[#FAF8F4] hover:border-teal-600/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
                    <span className="text-teal-800">
                      #{idx + 1} {s.hidden ? "(Masquée)" : ""}
                    </span>
                    <div className="flex items-center gap-0.5 opacity-80">
                      <button
                        type="button"
                        aria-label="Monter la diapositive"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSlide(idx, -1);
                        }}
                        className="rounded p-0.5 hover:bg-white"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        aria-label="Descendre la diapositive"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSlide(idx, 1);
                        }}
                        className="rounded p-0.5 hover:bg-white"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      {doc.slides.length > 1 && (
                        <button
                          type="button"
                          aria-label="Supprimer la diapositive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSlide(idx);
                          }}
                          className="rounded p-0.5 text-rose-600 hover:bg-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs font-bold truncate">{s.title.fr}</p>
                  <p dir="rtl" lang="ar" className="font-arabic text-[11px] text-slate-600 truncate">
                    {s.title.ar}
                  </p>
                </div>
              ))}
            </div>
          )}

          {leftTab === "components" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-2.5 space-y-2 border-b border-[#E9E3D6]">
                <input
                  type="text"
                  value={compSearch}
                  onChange={(e) => setCompSearch(e.target.value)}
                  placeholder="Rechercher un bloc (quiz, abacus, TaRL...)"
                  className="w-full rounded-lg border border-[#D9D0BE] bg-[#FAF8F4] px-2.5 py-1.5 text-xs"
                />
                <div className="flex flex-wrap gap-1">
                  {CATEGORY_LABELS.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCompCategory(cat.id)}
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        compCategory === cat.id
                          ? "bg-[#0B1220] text-white"
                          : "bg-[#FAF8F4] text-slate-700 border border-[#E9E3D6]"
                      }`}
                    >
                      {cat.fr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                {filteredComponents.map((comp) => (
                  <button
                    key={comp.type}
                    type="button"
                    data-insert-component={comp.type}
                    onClick={() => {
                      if (comp.type === "code-sandbox") {
                        setShowCodeModal(true);
                      } else {
                        addComponentToSlide(
                          comp.type as Exclude<ComponentTypeId, "unknown-element">
                        );
                      }
                    }}
                    className="w-full text-left rounded-xl border border-[#E9E3D6] bg-[#FAF8F4] p-2.5 hover:border-teal-700 hover:bg-teal-50/40 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#0B1220]">{comp.label.fr}</span>
                      <span className="text-[10px] uppercase font-bold text-teal-800">
                        {comp.category}
                      </span>
                    </div>
                    <p dir="rtl" lang="ar" className="font-arabic text-[11px] text-teal-900">
                      {comp.label.ar}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{comp.description.fr}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {leftTab === "layers" && activeSlide && (
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {[...activeSlide.elements]
                .sort((a, b) => b.zIndex - a.zIndex)
                .map((el) => (
                  <button
                    key={el.id}
                    type="button"
                    onClick={() => setSelectedElementId(el.id)}
                    className={`w-full text-left rounded-xl border px-3 py-2 text-xs flex items-center justify-between ${
                      selectedElementId === el.id
                        ? "border-teal-700 bg-teal-50 font-bold"
                        : "border-[#E9E3D6] bg-[#FAF8F4]"
                    }`}
                  >
                    <span className="truncate">
                      {el.type} {el.bilingual?.fr ? `· ${el.bilingual.fr}` : ""}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">z{el.zIndex}</span>
                  </button>
                ))}
            </div>
          )}
        </aside>

        {/* Center 16:9 Canvas Stage */}
        {activeSlide && (
          <EditorCanvasStage
            slide={activeSlide}
            theme={doc.theme}
            selectedElementId={selectedElementId}
            snapToGrid={snapToGrid}
            onSelectElement={setSelectedElementId}
            onChangeElementGeometry={(elementId, rect) => {
              commitDocument((prev) => ({
                ...prev,
                slides: prev.slides.map((s, idx) =>
                  idx === activeSlideIdx
                    ? {
                        ...s,
                        legacySource: s.legacySource
                          ? { ...s.legacySource, edited: true }
                          : undefined,
                        elements: s.elements.map((el) =>
                          el.id === elementId ? { ...el, ...rect } : el
                        ),
                      }
                    : s
                ),
              }));
            }}
            onApproveSandbox={(elementId) => {
              commitDocument((prev) => ({
                ...prev,
                slides: prev.slides.map((s, idx) =>
                  idx === activeSlideIdx
                    ? {
                        ...s,
                        elements: s.elements.map((el) =>
                          el.id === elementId
                            ? { ...el, config: { ...el.config, approved: true } }
                            : el
                        ),
                      }
                    : s
                ),
              }));
            }}
            onDetachLegacySlide={() =>
              updateActiveSlide({
                legacySource: activeSlide.legacySource
                  ? { ...activeSlide.legacySource, edited: true }
                  : undefined,
              })
            }
          />
        )}

        {/* Right Inspector & Speaker Notes */}
        {activeSlide && (
          <PropertiesInspectorPanel
            slide={activeSlide}
            selectedElement={selectedElement}
            onUpdateSlide={updateActiveSlide}
            onUpdateElement={(elementId, patch) => {
              commitDocument((prev) => ({
                ...prev,
                slides: prev.slides.map((s, idx) =>
                  idx === activeSlideIdx
                    ? {
                        ...s,
                        legacySource: s.legacySource
                          ? { ...s.legacySource, edited: true }
                          : undefined,
                        elements: s.elements.map((el) =>
                          el.id === elementId ? { ...el, ...patch } : el
                        ),
                      }
                    : s
                ),
              }));
            }}
            onDuplicateElement={(elementId) => {
              const src = activeSlide.elements.find((e) => e.id === elementId);
              if (!src) return;
              const copy: SlideElement = {
                ...structuredClone(src),
                id: `el-copy-${Date.now().toString(36)}`,
                x: Math.min(1600, src.x + 36),
                y: Math.min(900, src.y + 36),
                zIndex: activeSlide.elements.length + 1,
              };
              commitDocument((prev) => ({
                ...prev,
                slides: prev.slides.map((s, idx) =>
                  idx === activeSlideIdx
                    ? {
                        ...s,
                        elements: [...s.elements, copy],
                      }
                    : s
                ),
              }));
              setSelectedElementId(copy.id);
            }}
            onDeleteElement={(elementId) => {
              commitDocument((prev) => ({
                ...prev,
                slides: prev.slides.map((s, idx) =>
                  idx === activeSlideIdx
                    ? {
                        ...s,
                        elements: s.elements.filter((el) => el.id !== elementId),
                      }
                    : s
                ),
              }));
              setSelectedElementId(null);
            }}
            onMoveLayer={(elementId, direction) => {
              commitDocument((prev) => ({
                ...prev,
                slides: prev.slides.map((s, idx) =>
                  idx === activeSlideIdx
                    ? {
                        ...s,
                        elements: s.elements.map((el) =>
                          el.id === elementId
                            ? {
                                ...el,
                                zIndex: Math.max(
                                  0,
                                  el.zIndex + (direction === "up" ? 1 : -1)
                                ),
                              }
                            : el
                        ),
                      }
                    : s
                ),
              }));
            }}
          />
        )}
      </div>

      {/* Drawers & Modals */}
      {showAiDrawer && activeSlide && (
        <AiSlideAssistantDrawer
          slide={activeSlide}
          onClose={() => setShowAiDrawer(false)}
          onApplyProposedSlide={(nextSlide, summaryFr) => {
            commitDocument((prev) => ({
              ...prev,
              slides: prev.slides.map((s, idx) => (idx === activeSlideIdx ? nextSlide : s)),
            }));
            setToast(`IA appliquée : ${summaryFr}`);
          }}
        />
      )}

      {showCodeModal && (
        <CodeStudioModal
          roomId={initialDeck.roomId}
          onClose={() => setShowCodeModal(false)}
          onInsertElement={({ titleFr, titleAr, html, css, js, approved }) => {
            addComponentToSlide("code-sandbox", {
              bilingual: { fr: titleFr, ar: titleAr },
              config: { html, css, js, approved },
            });
          }}
        />
      )}

      {showRevisions && (
        <div
          data-revisions-drawer="true"
          className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-[#D9D0BE] bg-[#FAF8F4] shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between bg-[#0B1220] px-4 py-3 text-white">
            <span className="font-bold text-sm">Historique des révisions</span>
            <button
              type="button"
              aria-label="Fermer l'historique"
              onClick={() => setShowRevisions(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
            {revisions.map((rev) => (
              <div
                key={rev.id}
                className="rounded-xl border border-[#E9E3D6] bg-white p-3 flex items-center justify-between gap-2"
              >
                <div>
                  <p className="font-bold text-xs">
                    v{rev.revisionNo} · {rev.summary.fr}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {rev.source} · {rev.slideCount} slides
                  </p>
                </div>
                {rev.revisionNo !== revisionNo && (
                  <button
                    type="button"
                    onClick={() => restoreRevision(rev.revisionNo)}
                    className="inline-flex items-center gap-1 rounded-lg border border-teal-700 px-2.5 py-1 text-xs font-bold text-teal-800 hover:bg-teal-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Restaurer</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#0B1220] px-4 py-2 text-xs font-bold text-white shadow-lg flex items-center gap-3">
          <span>{toast}</span>
          <button type="button" onClick={() => setToast(null)} className="text-teal-300">
            OK
          </button>
        </div>
      )}
    </div>
  );
}
