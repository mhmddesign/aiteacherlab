"use client";

import React, { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  CopyPlus,
  ExternalLink,
  FileText,
  FolderOpen,
  LayoutGrid,
  MonitorPlay,
  Pencil,
  Plus,
  Presentation,
  Printer,
  Settings,
  ShieldCheck,
  Sparkles,
  Unlock,
  Upload,
  Users,
  X,
} from "lucide-react";
import { ACTIVITIES } from "@/content/activities";
import { SLIDES, getSectionList } from "@/content/slides";
import type { PublicWorkshopSnapshot } from "@/content/types";
import type {
  StudioDeckRecord,
  StudioResourceRecord,
  StudioRoom,
  StudioSessionRecord,
} from "@/lib/studio/studio-store";
import type { DeckDocumentV1 } from "@/lib/studio/document-schema";
import { BilingualBlock } from "@/components/ui/Bilingual";
import { AiDeckWizardModal } from "@/components/studio/ai/AiDeckWizardModal";

export interface StudioWorkspaceInitialData {
  authenticated: boolean;
  storageInfo: { mode: string; migrationPending: boolean };
  rooms: StudioRoom[];
  decksByRoom: Record<string, StudioDeckRecord[]>;
  sessions: Array<{
    id: string;
    roomId: string;
    deckId: string | null;
    title: { fr: string; ar: string };
    joinPin: string;
    status: StudioSessionRecord["status"];
    currentSlideIndex: number;
    slideCount: number;
    createdAt: string;
    updatedAt: string;
  }>;
  resourcesByRoom: Record<string, StudioResourceRecord[]>;
}

interface StudioWorkspaceShellProps {
  initialSnapshot: PublicWorkshopSnapshot | null;
  initialStudioData: StudioWorkspaceInitialData;
}

type RoomTabKey =
  | "overview"
  | "presentation"
  | "resources"
  | "activities"
  | "participants"
  | "settings";

const STORAGE_KEY = "aiteacherlab_studio_draft_rooms_v1";
const STORAGE_EVENT = "aiteacherlab-studio-drafts-changed";

function subscribeDraftRooms(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
}

function getDraftRoomsRaw(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || "[]";
  } catch {
    return "[]";
  }
}

function getServerDraftRoomsRaw(): string {
  return "[]";
}

const ROOM_TABS: Array<{
  key: RoomTabKey;
  fr: string;
  ar: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: "overview", fr: "Vue d'ensemble", ar: "نظرة عامة", icon: LayoutGrid },
  { key: "presentation", fr: "Présentation", ar: "العروض", icon: Presentation },
  { key: "resources", fr: "Ressources", ar: "الموارد", icon: FolderOpen },
  { key: "activities", fr: "Activités", ar: "الأنشطة", icon: Activity },
  { key: "participants", fr: "Participants", ar: "المشاركون", icon: Users },
  { key: "settings", fr: "Paramètres", ar: "الإعدادات", icon: Settings },
];

export function StudioWorkspaceShell({
  initialSnapshot,
  initialStudioData,
}: StudioWorkspaceShellProps) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(initialStudioData.authenticated);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [showAuthBox, setShowAuthBox] = useState(false);

  const [rooms, setRooms] = useState<StudioRoom[]>(initialStudioData.rooms);
  const [decksByRoom, setDecksByRoom] = useState(initialStudioData.decksByRoom);
  const [sessions, setSessions] = useState(initialStudioData.sessions);
  const [resourcesByRoom, setResourcesByRoom] = useState(initialStudioData.resourcesByRoom);

  const rawDrafts = useSyncExternalStore(
    subscribeDraftRooms,
    getDraftRoomsRaw,
    getServerDraftRoomsRaw
  );
  const localDraftRooms = useMemo(() => {
    try {
      const parsed = JSON.parse(rawDrafts);
      return Array.isArray(parsed) ? (parsed as StudioRoom[]) : [];
    } catch {
      return [];
    }
  }, [rawDrafts]);

  const allRooms = useMemo(() => [...rooms, ...localDraftRooms], [rooms, localDraftRooms]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    allRooms[0]?.id ?? "mediouna-default"
  );
  const [activeTab, setActiveTab] = useState<RoomTabKey>("overview");

  // New Room modal
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newTitleFr, setNewTitleFr] = useState("");
  const [newTitleAr, setNewTitleAr] = useState("");
  const [newSubtitleFr, setNewSubtitleFr] = useState("");
  const [newLevelBadge, setNewLevelBadge] = useState("1AEP – 6AEP");
  const [newPin, setNewPin] = useState("4829");

  // Deck creation modal / wizards
  const [showCreateDeckModal, setShowCreateDeckModal] = useState(false);
  const [createDeckMode, setCreateDeckMode] = useState<
    "blank" | "template" | "duplicate" | "mediouna" | "json" | "markdown"
  >("template");
  const [deckTitleFr, setDeckTitleFr] = useState("Nouvelle présentation interactive");
  const [deckTitleAr, setDeckTitleAr] = useState("عرض تفاعلي جديد");
  const [deckTemplateKey, setDeckTemplateKey] = useState<
    "primary-lesson" | "teacher-training" | "quiz-session"
  >("primary-lesson");
  const [deckDuplicateId, setDeckDuplicateId] = useState("");
  const [deckMarkdown, setDeckMarkdown] = useState(
    "# Découverte des fractions\nComprendre 1/2 et 1/4 en classe de 4AEP\n\n# Exercice interactif\nIdentifier la fraction colorée sur l'écran"
  );
  const [deckJsonText, setDeckJsonText] = useState("");
  const [showAiWizard, setShowAiWizard] = useState(false);

  // Resource creation state
  const [resTitleFr, setResTitleFr] = useState("");
  const [resTitleAr, setResTitleAr] = useState("");
  const [resContentFr, setResContentFr] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resKind, setResKind] = useState<"prompt" | "link" | "note" | "worksheet">("note");

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState(false);

  const selectedRoom = allRooms.find((r) => r.id === selectedRoomId) ?? allRooms[0];
  const isLocalDraftRoom = Boolean(
    localDraftRooms.find((r) => r.id === selectedRoom?.id)
  );
  const roomDecks = decksByRoom[selectedRoom?.id ?? ""] ?? [];
  const roomResources = resourcesByRoom[selectedRoom?.id ?? ""] ?? [];
  const roomSessions = sessions.filter((s) => s.roomId === selectedRoom?.id);
  const sections = useMemo(() => getSectionList(), []);

  async function refreshStudioFromServer() {
    const res = await fetch("/api/studio/rooms", { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    setAuthenticated(Boolean(json.authenticated));
    setRooms(json.rooms ?? []);
    setDecksByRoom(json.decksByRoom ?? {});
    setSessions(json.sessions ?? []);
    setResourcesByRoom(json.resourcesByRoom ?? {});
  }

  async function handleFacilitatorUnlock(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    const res = await fetch("/api/presenter/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    const json = await res.json();
    if (!res.ok) {
      setAuthError(json.error ?? "Code animateur incorrect.");
      return;
    }
    setPasscode("");
    setShowAuthBox(false);
    await refreshStudioFromServer();
    setStatusMessage("Accès formateur activé · تم تفعيل صلاحية المنشط");
  }

  async function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitleFr.trim() || !newTitleAr.trim()) return;

    if (authenticated) {
      setBusyAction(true);
      try {
        const res = await fetch("/api/studio/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: { fr: newTitleFr.trim(), ar: newTitleAr.trim() },
            subtitle: { fr: newSubtitleFr.trim(), ar: newTitleAr.trim() },
            levelBadge: newLevelBadge.trim(),
            joinPin: newPin.trim() || "4829",
          }),
        });
        const json = await res.json();
        if (res.ok && json.room) {
          await refreshStudioFromServer();
          setSelectedRoomId(json.room.id);
          setStatusMessage(`Salle créée sur le serveur : ${json.room.title.fr}`);
        } else {
          setStatusMessage(json.error ?? "Erreur création salle.");
        }
      } finally {
        setBusyAction(false);
      }
    } else {
      // Unauthenticated visitor preview draft preserved locally (never mutates server!)
      const draftId = `draft-${Date.now().toString(36)}`;
      const draft: StudioRoom = {
        id: draftId,
        slug: draftId,
        title: { fr: newTitleFr.trim(), ar: newTitleAr.trim() },
        subtitle: {
          fr: newSubtitleFr.trim() || "Brouillon local (connectez-vous pour publier en Live)",
          ar: "مسودة محلية — يرجى تسجيل الدخول للنشر المباشر",
        },
        levelBadge: newLevelBadge.trim(),
        joinPin: newPin.trim() || "4829",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const next = [...localDraftRooms, draft];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(STORAGE_EVENT));
      setSelectedRoomId(draftId);
      setStatusMessage("Brouillon local créé · مسودة محلية (déverrouillez pour publier sur le serveur)");
    }

    setShowNewRoomModal(false);
    setNewTitleFr("");
    setNewTitleAr("");
    setNewSubtitleFr("");
  }

  async function createDeckInSelectedRoom(payload: {
    mode: "blank" | "template" | "duplicate" | "mediouna" | "ai" | "json" | "markdown";
    title: { fr: string; ar: string };
    templateKey?: "primary-lesson" | "teacher-training" | "quiz-session";
    sourceDeckId?: string;
    markdown?: string;
    rawDocument?: unknown;
    aiDocument?: DeckDocumentV1;
  }) {
    if (!authenticated) {
      setShowAuthBox(true);
      setStatusMessage("Déverrouillez l'accès formateur pour créer un support éditable.");
      return;
    }
    setBusyAction(true);
    try {
      const res = await fetch(
        `/api/studio/rooms/${encodeURIComponent(selectedRoom.id)}/decks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        setStatusMessage(json.error ?? "Impossible de créer la présentation.");
        return;
      }
      await refreshStudioFromServer();
      setShowCreateDeckModal(false);
      setShowAiWizard(false);
      router.push(
        `/studio/rooms/${encodeURIComponent(selectedRoom.id)}/decks/${encodeURIComponent(json.deck.id)}/edit`
      );
    } finally {
      setBusyAction(false);
    }
  }

  async function launchLiveForDeck(deckId: string) {
    if (!authenticated) {
      setShowAuthBox(true);
      setStatusMessage("Déverrouillez l'accès formateur pour démarrer une session Live.");
      return;
    }
    setBusyAction(true);
    try {
      const res = await fetch(
        `/api/studio/rooms/${encodeURIComponent(selectedRoom.id)}/sessions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deckId }),
        }
      );
      const json = await res.json();
      if (res.ok && json.session) {
        router.push(`/presenter?sessionId=${encodeURIComponent(json.session.id)}`);
      } else {
        setStatusMessage(json.error ?? "Lancement impossible.");
      }
    } finally {
      setBusyAction(false);
    }
  }

  async function handleAddResource(e: React.FormEvent) {
    e.preventDefault();
    if (!authenticated) {
      setShowAuthBox(true);
      return;
    }
    if (!resTitleFr.trim()) return;
    setBusyAction(true);
    try {
      const res = await fetch(
        `/api/studio/rooms/${encodeURIComponent(selectedRoom.id)}/resources`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: resKind,
            title: {
              fr: resTitleFr.trim(),
              ar: resTitleAr.trim() || resTitleFr.trim(),
            },
            content: { fr: resContentFr.trim(), ar: resContentFr.trim() },
            url: resUrl.trim() || undefined,
          }),
        }
      );
      if (res.ok) {
        setResTitleFr("");
        setResTitleAr("");
        setResContentFr("");
        setResUrl("");
        await refreshStudioFromServer();
        setStatusMessage("Ressource ajoutée · تمت إضافة المورد");
      }
    } finally {
      setBusyAction(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#0B1220]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#E9E3D6] bg-[#0B1220] text-[#FAF8F4] px-4 py-3">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Accueil</span>
            </Link>
            <div className="min-w-0">
              <h1 className="font-display text-base md:text-lg font-bold truncate">
                AI Teacher Lab · Studio 2.0
              </h1>
              <p dir="rtl" lang="ar" className="font-arabic text-xs text-teal-300 truncate">
                استوديو إعداد وتسيير العروض والورشات التفاعلية
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {initialStudioData.storageInfo.migrationPending && (
              <span className="rounded-full bg-amber-500/20 border border-amber-400/40 px-3 py-1 text-[11px] font-semibold text-amber-200">
                Tables Supabase en attente de migration
              </span>
            )}

            {authenticated ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Formateur connecté · وضع المنشط</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuthBox((v) => !v)}
                data-studio-unlock-btn="true"
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-[#0B1220] hover:bg-amber-400"
              >
                <Unlock className="h-3.5 w-3.5" />
                <span>Déverrouiller formateur · دخول المنشط</span>
              </button>
            )}

            <button
              type="button"
              data-testid="studio-new-room-btn"
              onClick={() => setShowNewRoomModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-500"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle salle · قاعة جديدة</span>
            </button>
          </div>
        </div>

        {showAuthBox && !authenticated && (
          <form
            onSubmit={handleFacilitatorUnlock}
            className="mx-auto max-w-7xl mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2"
          >
            <label htmlFor="studio-passcode" className="text-xs font-semibold text-teal-200">
              Code animateur · رمز المنشط :
            </label>
            <input
              id="studio-passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
            />
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-white"
            >
              Valider
            </button>
            {authError && <span className="text-xs text-rose-400 font-bold">{authError}</span>}
          </form>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {statusMessage && (
          <div className="rounded-xl border border-teal-300 bg-teal-50 px-4 py-2.5 text-xs font-semibold text-teal-950 flex items-center justify-between gap-3">
            <span>{statusMessage}</span>
            <button type="button" onClick={() => setStatusMessage(null)} aria-label="Fermer le message">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Room Sidebar Selector */}
          <aside className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-teal-800">
                Salles & Ateliers ({allRooms.length})
              </h2>
              <span dir="rtl" lang="ar" className="font-arabic text-xs font-bold text-teal-800">
                القاعات والورشات
              </span>
            </div>

            <div className="space-y-2.5">
              {allRooms.map((room) => {
                const isSelected = room.id === selectedRoom?.id;
                const countDecks = (decksByRoom[room.id] ?? []).length;
                const isDraft = localDraftRooms.some((d) => d.id === room.id);
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`w-full text-left rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-teal-700 bg-white shadow-md ring-2 ring-teal-700/15"
                        : "border-[#E9E3D6] bg-white/80 hover:border-teal-600/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="rounded-full bg-[#F4F0E8] px-2.5 py-0.5 text-[11px] font-bold text-teal-900">
                        {isDraft ? "Brouillon local" : room.levelBadge}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {isDraft ? "Local" : `${countDecks} deck(s)`}
                      </span>
                    </div>
                    <p className="font-display font-bold text-sm text-[#0B1220]">
                      {room.title.fr}
                    </p>
                    <p dir="rtl" lang="ar" className="font-arabic text-xs font-semibold text-teal-800 mt-0.5">
                      {room.title.ar}
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Selected Room Detail Workspace */}
          {selectedRoom && (
            <section className="lg:col-span-8 space-y-5 min-w-0">
              {/* Room Hero Card */}
              <div className="rounded-2xl border border-[#E9E3D6] bg-white p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-[11px] font-bold">
                        Active · نشطة
                      </span>
                      <span className="text-xs font-mono text-slate-600">
                        PIN : {selectedRoom.joinPin}
                      </span>
                    </div>
                    <h2 className="font-display text-xl md:text-2xl font-bold text-[#0B1220]">
                      {selectedRoom.title.fr}
                    </h2>
                    <p dir="rtl" lang="ar" className="font-arabic text-base font-bold text-teal-800">
                      {selectedRoom.title.ar}
                    </p>
                  </div>

                  {selectedRoom.id === "mediouna-default" && (
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="/presenter"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B1220] px-3.5 py-2 text-xs font-bold text-white"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Régie Mediouna</span>
                      </Link>
                      <Link
                        href="/export/slides?deckId=deck-mediouna-21&mode=slides"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-teal-700 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-900"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>PDF 16:9</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Accessible Role=Tab Navigation */}
                <div
                  role="tablist"
                  aria-label="Onglets de la salle Studio"
                  className="flex flex-wrap gap-1.5 border-t border-[#E9E3D6] pt-3"
                >
                  {ROOM_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveTab(tab.key)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                          active
                            ? "bg-[#0B1220] text-white"
                            : "bg-[#FAF8F4] text-slate-700 border border-[#E9E3D6] hover:border-teal-600"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.fr}</span>
                        <span className="font-arabic opacity-80 hidden sm:inline">
                          · {tab.ar}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TAB: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-stage-enter">
                  <div className="rounded-2xl border border-[#E9E3D6] bg-white p-4 space-y-1">
                    <p className="text-xs font-bold uppercase text-slate-500">Présentations</p>
                    <p className="text-2xl font-bold text-[#0B1220]">{roomDecks.length}</p>
                    <p dir="rtl" lang="ar" className="font-arabic text-xs text-teal-800">
                      العروض المحفوظة القابلة للتعديل
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#E9E3D6] bg-white p-4 space-y-1">
                    <p className="text-xs font-bold uppercase text-slate-500">Sessions Live</p>
                    <p className="text-2xl font-bold text-teal-800">{roomSessions.length}</p>
                    <p dir="rtl" lang="ar" className="font-arabic text-xs text-slate-600">
                      جلسات البث التفاعلي المباشر
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#E9E3D6] bg-white p-4 space-y-1">
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Participants actifs (Mediouna)
                    </p>
                    <p className="text-2xl font-bold text-[#0B1220]">
                      {initialSnapshot?.totalParticipants ?? 0}
                    </p>
                    <p dir="rtl" lang="ar" className="font-arabic text-xs text-slate-600">
                      المشاركون المتفاعلون
                    </p>
                  </div>

                  {/* Quick Authoring Launchpad */}
                  <div className="md:col-span-3 rounded-2xl border border-[#E9E3D6] bg-white p-5 space-y-3">
                    <BilingualBlock
                      text={{
                        fr: "Créer ou importer une présentation interactive",
                        ar: "إنشاء أو استيراد عرض تقديمي تفاعلي ثنائي اللغة",
                      }}
                      frClassName="font-display text-base font-bold"
                      arClassName="text-sm font-semibold text-teal-800"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setCreateDeckMode("blank");
                          setShowCreateDeckModal(true);
                        }}
                        className="rounded-xl border border-[#E9E3D6] bg-[#FAF8F4] p-3 text-left font-bold hover:border-teal-700"
                      >
                        <Plus className="h-4 w-4 text-teal-700 mb-1" />
                        Présentation vierge
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCreateDeckMode("template");
                          setShowCreateDeckModal(true);
                        }}
                        className="rounded-xl border border-[#E9E3D6] bg-[#FAF8F4] p-3 text-left font-bold hover:border-teal-700"
                      >
                        <LayoutGrid className="h-4 w-4 text-teal-700 mb-1" />
                        Modèle 1AEP–6AEP
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAiWizard(true)}
                        data-open-ai-wizard="true"
                        className="rounded-xl border border-teal-300 bg-teal-50 p-3 text-left font-bold text-teal-950 hover:border-teal-700"
                      >
                        <Sparkles className="h-4 w-4 text-teal-700 mb-1" />
                        Générer avec l&apos;IA
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCreateDeckMode("mediouna");
                          setShowCreateDeckModal(true);
                        }}
                        className="rounded-xl border border-[#E9E3D6] bg-[#FAF8F4] p-3 text-left font-bold hover:border-teal-700"
                      >
                        <CopyPlus className="h-4 w-4 text-teal-700 mb-1" />
                        Importer Mediouna (21)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PRESENTATION DECKS & 8 AUTHORING ENTRY PATHS */}
              {activeTab === "presentation" && (
                <div className="space-y-4 animate-stage-enter">
                  {!isLocalDraftRoom && (
                    <div className="rounded-2xl border border-[#E9E3D6] bg-white p-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase text-teal-800">
                        Créer / Importer un support ({roomDecks.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAiWizard(true)}
                          className="inline-flex items-center gap-1 rounded-xl bg-teal-700 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Assistant IA</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCreateDeckMode("template");
                            setShowCreateDeckModal(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl border border-[#D9D0BE] bg-[#FAF8F4] px-3 py-1.5 text-xs font-bold"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Modèle / Vierge</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCreateDeckMode("markdown");
                            setShowCreateDeckModal(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl border border-[#D9D0BE] bg-[#FAF8F4] px-3 py-1.5 text-xs font-bold"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <span>Markdown / JSON</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {roomDecks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {roomDecks.map((deck) => (
                        <article
                          key={deck.id}
                          className="rounded-2xl border border-[#E9E3D6] bg-white p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="rounded-full bg-teal-50 border border-teal-200 px-2.5 py-0.5 font-mono font-bold text-teal-900">
                                v{deck.currentRevisionNo} · {deck.document.slides.length} slides
                              </span>
                            </div>
                            <h3 className="font-display font-bold text-base text-[#0B1220]">
                              {deck.title.fr}
                            </h3>
                            <p dir="rtl" lang="ar" className="font-arabic text-sm font-semibold text-teal-800">
                              {deck.title.ar}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/studio/rooms/${encodeURIComponent(selectedRoom.id)}/decks/${encodeURIComponent(deck.id)}/edit`}
                              data-edit-deck={deck.id}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B1220] px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-800"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span>Éditer · تحرير</span>
                            </Link>
                            <button
                              type="button"
                              disabled={busyAction}
                              onClick={() => launchLiveForDeck(deck.id)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-800"
                            >
                              <MonitorPlay className="h-3.5 w-3.5" />
                              <span>Présenter Live</span>
                            </button>
                            <Link
                              href={`/export/slides?deckId=${encodeURIComponent(deck.id)}&mode=slides`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F4] px-3 py-2 text-xs font-bold"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              <span>PDF 16:9</span>
                            </Link>
                            <Link
                              href={`/export/slides?deckId=${encodeURIComponent(deck.id)}&mode=worksheet`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F4] px-3 py-2 text-xs font-bold"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>Fiche A4</span>
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#D9D0BE] bg-white p-6 text-center space-y-2">
                      <p className="text-sm font-bold">
                        {isLocalDraftRoom
                          ? "Brouillon local sans présentation serveur."
                          : "Aucune présentation dans cette salle."}
                      </p>
                      <p className="text-xs text-slate-600">
                        Plan du programme Mediouna disponible ({SLIDES.length} diapositives,{" "}
                        {sections.length} sections) ou créez votre propre support bilingue.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: RESOURCES */}
              {activeTab === "resources" && (
                <div className="space-y-4 animate-stage-enter">
                  <div className="rounded-2xl border border-[#E9E3D6] bg-white p-5 space-y-3">
                    <h3 className="font-display font-bold text-base">
                      Ressources & Fiches de la salle · موارد القاعة
                    </h3>
                    <div className="space-y-2">
                      {roomResources.map((res) => (
                        <div
                          key={res.id}
                          className="rounded-xl border border-[#E9E3D6] bg-[#FAF8F4] p-3.5 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div>
                            <p className="font-bold text-sm">{res.title.fr}</p>
                            <p dir="rtl" lang="ar" className="font-arabic text-xs text-teal-800">
                              {res.title.ar}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">{res.content.fr}</p>
                          </div>
                          {res.url && (
                            <Link
                              href={res.url}
                              className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-bold text-white"
                            >
                              Ouvrir
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {!isLocalDraftRoom && (
                    <form
                      onSubmit={handleAddResource}
                      className="rounded-2xl border border-[#E9E3D6] bg-white p-5 space-y-3"
                    >
                      <h4 className="font-bold text-sm">Ajouter une ressource</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <label className="text-xs font-semibold">
                          Type
                          <select
                            value={resKind}
                            onChange={(e) => setResKind(e.target.value as typeof resKind)}
                            className="mt-1 w-full rounded-lg border border-[#D9D0BE] px-2.5 py-2 text-xs"
                          >
                            <option value="note">Note</option>
                            <option value="prompt">Méta-Prompt</option>
                            <option value="worksheet">Fiche A4</option>
                            <option value="link">Lien</option>
                          </select>
                        </label>
                        <label className="text-xs font-semibold">
                          Titre FR
                          <input
                            type="text"
                            value={resTitleFr}
                            onChange={(e) => setResTitleFr(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-[#D9D0BE] px-2.5 py-2 text-xs"
                          />
                        </label>
                        <label className="text-xs font-semibold">
                          العنوان AR
                          <input
                            type="text"
                            dir="rtl"
                            value={resTitleAr}
                            onChange={(e) => setResTitleAr(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-[#D9D0BE] px-2.5 py-2 font-arabic text-xs"
                          />
                        </label>
                      </div>
                      <label className="block text-xs font-semibold">
                        Contenu / Consigne
                        <textarea
                          rows={2}
                          value={resContentFr}
                          onChange={(e) => setResContentFr(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-[#D9D0BE] px-2.5 py-2 text-xs"
                        />
                      </label>
                      <label className="block text-xs font-semibold">
                        URL optionnelle
                        <input
                          type="text"
                          value={resUrl}
                          onChange={(e) => setResUrl(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-[#D9D0BE] px-2.5 py-2 text-xs"
                        />
                      </label>
                      <button
                        type="submit"
                        disabled={busyAction}
                        className="rounded-xl bg-[#0B1220] px-4 py-2 text-xs font-bold text-white"
                      >
                        Ajouter à la salle
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB: ACTIVITIES */}
              {activeTab === "activities" && (
                <div className="rounded-2xl border border-[#E9E3D6] bg-white p-5 space-y-3 animate-stage-enter">
                  <h3 className="font-display font-bold text-base">
                    Activités interactives synchronisées · الأنشطة التفاعلية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.values(ACTIVITIES).map((act) => (
                      <div
                        key={act.key}
                        className="rounded-xl border border-[#E9E3D6] bg-[#FAF8F4] p-3.5 space-y-1"
                      >
                        <span className="text-[11px] font-bold uppercase text-teal-800">
                          {act.type}
                        </span>
                        <p className="font-bold text-sm">{act.title.fr}</p>
                        <p dir="rtl" lang="ar" className="font-arabic text-xs text-teal-900">
                          {act.title.ar}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: PARTICIPANTS / SESSIONS */}
              {activeTab === "participants" && (
                <div className="rounded-2xl border border-[#E9E3D6] bg-white p-5 space-y-3 animate-stage-enter">
                  <h3 className="font-display font-bold text-base">
                    Sessions Live & Connexions · جلسات المشاركة
                  </h3>
                  {roomSessions.length > 0 ? (
                    <div className="space-y-2">
                      {roomSessions.map((sess) => (
                        <div
                          key={sess.id}
                          className="rounded-xl border border-[#E9E3D6] bg-[#FAF8F4] p-3.5 flex flex-wrap items-center justify-between gap-2"
                        >
                          <div>
                            <p className="font-bold text-sm">{sess.title.fr}</p>
                            <p className="text-xs text-slate-600">
                              Slide {sess.currentSlideIndex + 1}/{sess.slideCount} · PIN{" "}
                              <span className="font-mono">{sess.joinPin}</span>
                            </p>
                          </div>
                          <div className="flex gap-2 text-xs">
                            <Link
                              href={`/presenter?sessionId=${encodeURIComponent(sess.id)}`}
                              className="rounded-lg bg-[#0B1220] px-3 py-1.5 font-bold text-white"
                            >
                              Régie
                            </Link>
                            <Link
                              href={`/screen?sessionId=${encodeURIComponent(sess.id)}`}
                              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-bold"
                            >
                              Projecteur
                            </Link>
                            <Link
                              href={`/join?sessionId=${encodeURIComponent(sess.id)}`}
                              className="rounded-lg bg-teal-700 px-3 py-1.5 font-bold text-white"
                            >
                              /join
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600">
                      Aucune session Studio 2.0 encore lancée pour cette salle. Cliquez sur « Présenter Live » depuis l&apos;onglet Présentation.
                    </p>
                  )}
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === "settings" && (
                <div className="rounded-2xl border border-[#E9E3D6] bg-white p-5 space-y-3 text-xs animate-stage-enter">
                  <h3 className="font-display font-bold text-base">
                    Paramètres de salle · إعدادات القاعة
                  </h3>
                  <p>
                    Identifiant : <code className="font-mono">{selectedRoom.id}</code>
                  </p>
                  <p>
                    Badge niveau : <strong>{selectedRoom.levelBadge}</strong>
                  </p>
                  <p>
                    Mode stockage serveur :{" "}
                    <code className="font-mono">{initialStudioData.storageInfo.mode}</code>
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Modal: Create New Room */}
      {showNewRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <form
            onSubmit={handleCreateRoom}
            className="w-full max-w-lg rounded-2xl border border-[#E9E3D6] bg-white p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                Nouvelle salle Studio · قاعة جديدة
              </h2>
              <button
                type="button"
                onClick={() => setShowNewRoomModal(false)}
                aria-label="Fermer la fenêtre"
                className="rounded p-1 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label htmlFor="studio-title-fr" className="block text-xs font-bold mb-1">
                Titre en Français *
              </label>
              <input
                id="studio-title-fr"
                type="text"
                required
                value={newTitleFr}
                onChange={(e) => setNewTitleFr(e.target.value)}
                placeholder="ex: Atelier Lecture & IA — 3AEP"
                className="w-full rounded-xl border border-[#D9D0BE] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="studio-title-ar" className="block text-xs font-bold mb-1">
                العنوان بالعربية *
              </label>
              <input
                id="studio-title-ar"
                type="text"
                required
                dir="rtl"
                lang="ar"
                value={newTitleAr}
                onChange={(e) => setNewTitleAr(e.target.value)}
                placeholder="مثال: ورشة القراءة التفاعلية"
                className="w-full rounded-xl border border-[#D9D0BE] px-3 py-2 font-arabic text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="studio-level" className="block text-xs font-bold mb-1">
                  Public / Niveau
                </label>
                <input
                  id="studio-level"
                  type="text"
                  value={newLevelBadge}
                  onChange={(e) => setNewLevelBadge(e.target.value)}
                  className="w-full rounded-xl border border-[#D9D0BE] px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label htmlFor="studio-pin" className="block text-xs font-bold mb-1">
                  Code PIN Live
                </label>
                <input
                  id="studio-pin"
                  type="text"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full rounded-xl border border-[#D9D0BE] px-3 py-2 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label htmlFor="studio-sub-fr" className="block text-xs font-bold mb-1">
                Sous-titre optionnel
              </label>
              <input
                id="studio-sub-fr"
                type="text"
                value={newSubtitleFr}
                onChange={(e) => setNewSubtitleFr(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0BE] px-3 py-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewRoomModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={busyAction}
                className="rounded-xl bg-teal-700 px-5 py-2 text-xs font-bold text-white"
              >
                Créer la salle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Create / Import Deck */}
      {showCreateDeckModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[#E9E3D6] bg-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                Nouvelle présentation dans « {selectedRoom?.title.fr} »
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateDeckModal(false)}
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              {(
                [
                  { id: "template", label: "Modèle" },
                  { id: "blank", label: "Vierge" },
                  { id: "mediouna", label: "Import Mediouna" },
                  { id: "duplicate", label: "Dupliquer" },
                  { id: "markdown", label: "Markdown" },
                  { id: "json", label: "JSON Studio" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCreateDeckMode(m.id)}
                  className={`rounded-lg px-3 py-1.5 font-bold border ${
                    createDeckMode === m.id
                      ? "bg-[#0B1220] text-white border-[#0B1220]"
                      : "bg-[#FAF8F4] text-slate-700 border-[#E9E3D6]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-xs font-bold">
                Titre FR
                <input
                  type="text"
                  value={deckTitleFr}
                  onChange={(e) => setDeckTitleFr(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D9D0BE] px-3 py-2 text-xs"
                />
              </label>
              <label className="text-xs font-bold">
                العنوان AR
                <input
                  type="text"
                  dir="rtl"
                  lang="ar"
                  value={deckTitleAr}
                  onChange={(e) => setDeckTitleAr(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D9D0BE] px-3 py-2 font-arabic text-xs"
                />
              </label>
            </div>

            {createDeckMode === "template" && (
              <label className="block text-xs font-bold">
                Modèle prêt à l&apos;emploi
                <select
                  value={deckTemplateKey}
                  onChange={(e) =>
                    setDeckTemplateKey(e.target.value as typeof deckTemplateKey)
                  }
                  className="mt-1 w-full rounded-xl border border-[#D9D0BE] px-3 py-2 text-xs"
                >
                  <option value="primary-lesson">Leçon Primaire (1AEP–6AEP)</option>
                  <option value="teacher-training">Atelier Enseignants (Bilingue + Vote)</option>
                  <option value="quiz-session">Quiz Évaluation Formative</option>
                </select>
              </label>
            )}

            {createDeckMode === "duplicate" && (
              <label className="block text-xs font-bold">
                Présentation source
                <select
                  value={deckDuplicateId || roomDecks[0]?.id || "deck-mediouna-21"}
                  onChange={(e) => setDeckDuplicateId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D9D0BE] px-3 py-2 text-xs"
                >
                  <option value="deck-mediouna-21">Mediouna Officiel (21 slides)</option>
                  {roomDecks.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title.fr}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {createDeckMode === "markdown" && (
              <label className="block text-xs font-bold">
                Texte Markdown (# = titre de slide)
                <textarea
                  rows={5}
                  value={deckMarkdown}
                  onChange={(e) => setDeckMarkdown(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D9D0BE] p-3 font-mono text-xs"
                />
              </label>
            )}

            {createDeckMode === "json" && (
              <label className="block text-xs font-bold">
                Coller le JSON DeckDocumentV1
                <textarea
                  rows={5}
                  value={deckJsonText}
                  onChange={(e) => setDeckJsonText(e.target.value)}
                  placeholder='{"schemaVersion":1,...}'
                  className="mt-1 w-full rounded-xl border border-[#D9D0BE] p-3 font-mono text-xs"
                />
              </label>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateDeckModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={busyAction}
                onClick={() => {
                  let rawDocument: unknown;
                  if (createDeckMode === "json") {
                    try {
                      rawDocument = JSON.parse(deckJsonText);
                    } catch {
                      setStatusMessage("JSON invalide.");
                      return;
                    }
                  }
                  void createDeckInSelectedRoom({
                    mode: createDeckMode,
                    title: { fr: deckTitleFr, ar: deckTitleAr },
                    templateKey: deckTemplateKey,
                    sourceDeckId:
                      deckDuplicateId || roomDecks[0]?.id || "deck-mediouna-21",
                    markdown: deckMarkdown,
                    rawDocument,
                  });
                }}
                className="rounded-xl bg-teal-700 px-5 py-2 text-xs font-bold text-white"
              >
                Créer & Éditer · إنشاء وتحرير
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: AI Deck Wizard */}
      {showAiWizard && selectedRoom && (
        <AiDeckWizardModal
          roomId={selectedRoom.id}
          onClose={() => setShowAiWizard(false)}
          onCreatedDeck={async (aiDoc) => {
            await createDeckInSelectedRoom({
              mode: "ai",
              title: aiDoc.title,
              aiDocument: aiDoc,
            });
          }}
        />
      )}
    </div>
  );
}
