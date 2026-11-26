"use client";

import React, { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Check,
  Copy,
  CopyPlus,
  ExternalLink,
  FolderOpen,
  Layers,
  LayoutGrid,
  Monitor,
  Play,
  Plus,
  Presentation,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { ACTIVITIES } from "@/content/activities";
import { GALLERY_CATEGORIES } from "@/content/gallery";
import { SLIDES, getSectionList } from "@/content/slides";
import {
  MEDIOUNA_ROOM_RESOURCES,
  STUDIO_TEMPLATES,
  type StudioRoomRecord,
  type StudioRoomStatus,
} from "@/content/studio-templates";
import type { PublicWorkshopSnapshot } from "@/content/types";
import { BilingualBlock, BilingualInline } from "@/components/ui/Bilingual";

interface StudioWorkspaceShellProps {
  initialSnapshot: PublicWorkshopSnapshot | null;
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
  { key: "presentation", fr: "Présentation", ar: "العرض", icon: Presentation },
  { key: "resources", fr: "Ressources", ar: "الموارد", icon: FolderOpen },
  { key: "activities", fr: "Activités", ar: "الأنشطة", icon: Activity },
  { key: "participants", fr: "Participants", ar: "المشاركون", icon: Users },
  { key: "settings", fr: "Paramètres", ar: "الإعدادات", icon: Settings },
];

const STATUS_BADGE: Record<
  StudioRoomStatus,
  { fr: string; ar: string; className: string }
> = {
  live: {
    fr: "En direct",
    ar: "مباشر",
    className: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
  },
  ready: {
    fr: "Prête",
    ar: "جاهزة",
    className: "border-teal-400/40 bg-teal-500/15 text-teal-200",
  },
  draft: {
    fr: "Brouillon Studio",
    ar: "مسودة استوديو",
    className: "border-amber-400/40 bg-amber-500/15 text-amber-200",
  },
  archived: {
    fr: "Archivée",
    ar: "مؤرشفة",
    className: "border-slate-500/40 bg-slate-700/40 text-slate-300",
  },
};

function slugifyRoom(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 42);
  return base || `studio-room-${Date.now().toString().slice(-4)}`;
}

export function StudioWorkspaceShell({
  initialSnapshot,
}: StudioWorkspaceShellProps) {
  const activityList = useMemo(() => Object.values(ACTIVITIES), []);
  const sectionList = useMemo(() => getSectionList(), []);

  const primaryRoom = useMemo<StudioRoomRecord>(
    () => ({
      id: initialSnapshot?.state.workshopId ?? "room-mediouna-primary",
      slug: "mediouna-ai-teacher-lab",
      isLivePrimary: true,
      status: "live",
      templateKey: "workshop-bilingual",
      title: {
        fr:
          initialSnapshot?.state.workshopTitle ||
          "L'IA comme Partenaire d'Innovation Pédagogique",
        ar: "الذكاء الاصطناعي كشريك في الابتكار التربوي",
      },
      subtitle: {
        fr: "Salle #1 · Province de Mediouna · Centre de Digitalisation",
        ar: "القاعة 1 · إقليم مديونة · مركز الرقمنة",
      },
      description: {
        fr: "Atelier interactif complet synchronisant Animateur, Projecteur 16:9 et Participants mobiles avec Mode Démo et sauvegarde temps réel.",
        ar: "ورشة تفاعلية متكاملة تزامن المنشط وشاشة العرض 16:9 والمشاركين عبر الهاتف مع الوضع التجريبي والمزامنة الفورية.",
      },
      slidesCount: SLIDES.length,
      activitiesCount: activityList.length,
      resourcesCount: MEDIOUNA_ROOM_RESOURCES.length,
      connectedCount: initialSnapshot?.connectedCount ?? 0,
      totalParticipants: initialSnapshot?.totalParticipants ?? 0,
      sessionsCount: 1,
      updatedLabel: {
        fr: "Session active synchronisée",
        ar: "جلسة نشطة ومتزامنة",
      },
      pinProtected: true,
    }),
    [activityList.length, initialSnapshot]
  );

  const rawDrafts = useSyncExternalStore(
    subscribeDraftRooms,
    getDraftRoomsRaw,
    getServerDraftRoomsRaw
  );
  const draftRooms = useMemo<StudioRoomRecord[]>(() => {
    try {
      const parsed = JSON.parse(rawDrafts) as StudioRoomRecord[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [rawDrafts]);

  const [selectedRoomId, setSelectedRoomId] = useState<string>(primaryRoom.id);
  const [activeTab, setActiveTab] = useState<RoomTabKey>("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(
    STUDIO_TEMPLATES[0].key
  );
  const [newTitleFr, setNewTitleFr] = useState("");
  const [newTitleAr, setNewTitleAr] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const persistDrafts = (next: StudioRoomRecord[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch {
      // Ignore storage quota errors
    }
  };

  const rooms = useMemo(
    () => [primaryRoom, ...draftRooms],
    [primaryRoom, draftRooms]
  );

  const selectedRoom =
    rooms.find((r) => r.id === selectedRoomId) ?? primaryRoom;

  const handleCopyLink = async (id: string, path: string) => {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setStatusNotice(url);
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const tpl =
      STUDIO_TEMPLATES.find((t) => t.key === selectedTemplateKey) ??
      STUDIO_TEMPLATES[0];
    const titleFr = newTitleFr.trim() || tpl.title.fr;
    const titleAr = newTitleAr.trim() || tpl.title.ar;
    const created: StudioRoomRecord = {
      id: `studio-draft-${Date.now()}`,
      slug: slugifyRoom(titleFr),
      isLivePrimary: false,
      status: "draft",
      templateKey: tpl.key,
      title: { fr: titleFr, ar: titleAr },
      subtitle: {
        fr: `Modèle : ${tpl.badge.fr}`,
        ar: `النموذج: ${tpl.badge.ar}`,
      },
      description: tpl.description,
      slidesCount: tpl.defaultSlidesCount,
      activitiesCount: tpl.defaultActivitiesCount,
      resourcesCount: 3,
      connectedCount: 0,
      totalParticipants: 0,
      sessionsCount: 0,
      updatedLabel: {
        fr: "Brouillon local · Prêt pour migration DB",
        ar: "مسودة محلية · جاهزة للترحيل لقاعدة البيانات",
      },
      pinProtected: true,
    };

    const next = [created, ...draftRooms];
    persistDrafts(next);
    setSelectedRoomId(created.id);
    setActiveTab("overview");
    setNewTitleFr("");
    setNewTitleAr("");
    setShowCreateModal(false);
    setStatusNotice(
      "Nouvelle salle préparée dans le Studio (aperçu local). / تم إعداد قاعة جديدة في الاستوديو (معاينة محلية)."
    );
  };

  const handleDuplicateRoom = (room: StudioRoomRecord) => {
    const copy: StudioRoomRecord = {
      ...room,
      id: `studio-copy-${Date.now()}`,
      slug: `${room.slug}-copie`,
      isLivePrimary: false,
      status: "ready",
      title: {
        fr: `${room.title.fr} (Copie)`,
        ar: `${room.title.ar} (نسخة)`,
      },
      connectedCount: 0,
      totalParticipants: 0,
      sessionsCount: 0,
      updatedLabel: {
        fr: "Dupliquée depuis le Studio",
        ar: "تم استنساخها داخل الاستوديو",
      },
    };
    const next = [copy, ...draftRooms];
    persistDrafts(next);
    setSelectedRoomId(copy.id);
    setStatusNotice(
      "Salle dupliquée avec succès. / تم استنساخ القاعة بنجاح."
    );
  };

  return (
    <div className="min-h-[100dvh] bg-[#060B16] text-slate-100 flex flex-col">
      {/* Sticky Single-Row Studio Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0B1220]/95 backdrop-blur safe-top">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <Link
              href="/"
              aria-label="Accueil / الرئيسية"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700/80 bg-[#111C33] text-slate-300 hover:border-teal-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <p className="font-display text-sm sm:text-base font-bold text-white truncate">
                AI Teacher Lab · Studio{" "}
                <span
                  dir="rtl"
                  lang="ar"
                  className="font-arabic text-teal-300 font-semibold"
                >
                  استوديو القاعات
                </span>
              </p>
              <p className="hidden sm:block text-[11px] text-slate-400 truncate">
                Espace multi-salles persistant · فضاء دائم لإدارة الورشات والعروض
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              data-testid="studio-new-room-btn"
              className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#0D655E] cursor-pointer transition active:scale-[0.98] whitespace-nowrap"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <BilingualInline
                text={{ fr: "Nouvelle salle", ar: "قاعة جديدة" }}
              />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-5 sm:px-6 sm:py-7 space-y-6 safe-bottom">
        {/* Studio Architecture Notice Banner */}
        <section className="rounded-2xl border border-teal-500/25 bg-gradient-to-br from-[#0F2438] via-[#0E192D] to-[#0A1222] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/35 bg-teal-500/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-teal-200">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <BilingualInline
                  text={{
                    fr: "Studio Numérique Permanent · Province de Mediouna",
                    ar: "الاستوديو الرقمي الدائم · إقليم مديونة",
                  }}
                />
              </span>
              <BilingualBlock
                text={{
                  fr: "Préparez vos salles, lancez vos présentations 16:9 et conservez les résultats de chaque cohorte.",
                  ar: "أعدّوا قاعاتكم، أطلقوا عروضكم 16:9 واحتفظوا بنتائج كل فوج بشكل مستقل وآمن.",
                }}
                frClassName="text-sm sm:text-base font-semibold text-white"
                arClassName="text-sm font-semibold text-teal-200"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href="/presenter"
                className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white hover:bg-[#0D655E] transition active:scale-[0.98]"
              >
                <Play className="h-3.5 w-3.5 shrink-0" />
                <BilingualInline
                  text={{ fr: "Lancer Salle #1", ar: "تشغيل القاعة 1" }}
                />
              </Link>
              <Link
                href="/screen"
                className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-[#111C33] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-teal-400 transition active:scale-[0.98]"
              >
                <Monitor className="h-3.5 w-3.5 shrink-0 text-teal-300" />
                <BilingualInline text={{ fr: "Projecteur", ar: "شاشة العرض" }} />
              </Link>
            </div>
          </div>
        </section>

        {statusNotice && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-between gap-3 rounded-xl border border-teal-500/35 bg-teal-950/50 px-4 py-2.5 text-xs font-medium text-teal-100"
          >
            <span>{statusNotice}</span>
            <button
              type="button"
              onClick={() => setStatusNotice(null)}
              aria-label="Fermer / إغلاق"
              className="rounded-lg p-1 text-teal-200 hover:bg-teal-900 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Main Studio Grid: Room Sidebar + 6-Tab Room Workspace */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Left Column: Persistent Rooms Directory */}
          <aside className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <BilingualBlock
                text={{
                  fr: `Mes salles (${rooms.length})`,
                  ar: `قاعاتي (${rooms.length})`,
                }}
                frClassName="text-xs font-bold uppercase tracking-wider text-slate-400"
                arClassName="text-xs font-bold text-teal-300"
              />
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="text-xs font-semibold text-teal-300 hover:text-teal-200 cursor-pointer"
              >
                + <BilingualInline text={{ fr: "Modèles", ar: "النماذج" }} />
              </button>
            </div>

            <div className="space-y-2.5">
              {rooms.map((room) => {
                const selected = room.id === selectedRoom.id;
                const badge = STATUS_BADGE[room.status];
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedRoomId(room.id)}
                    aria-pressed={selected}
                    className={`w-full rounded-2xl border p-4 text-left transition cursor-pointer ${
                      selected
                        ? "border-teal-400 bg-[#11203B] shadow-lg ring-1 ring-teal-400/40"
                        : "border-slate-800 bg-[#0D1628] hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}
                      >
                        <BilingualInline text={{ fr: badge.fr, ar: badge.ar }} />
                      </span>
                      <span className="font-mono-code text-[11px] text-slate-400">
                        {room.slidesCount} diapos · {room.activitiesCount} act.
                      </span>
                    </div>
                    <BilingualBlock
                      text={room.title}
                      frClassName="text-sm font-bold text-white leading-snug"
                      arClassName="text-xs font-bold text-teal-300 mt-0.5 leading-snug"
                    />
                    <p className="mt-2 text-[11px] text-slate-400">
                      <BilingualInline text={room.updatedLabel} />
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Templates Quick Strip */}
            <div className="rounded-2xl border border-slate-800 bg-[#0B1220] p-4 space-y-2.5">
              <BilingualBlock
                text={{
                  fr: "Modèles rapides (5 blueprints)",
                  ar: "نماذج سريعة جاهزة (5 قوالب)",
                }}
                frClassName="text-xs font-bold text-white"
                arClassName="text-xs font-bold text-teal-300"
              />
              <div className="space-y-1.5">
                {STUDIO_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.key}
                    type="button"
                    onClick={() => {
                      setSelectedTemplateKey(tpl.key);
                      setShowCreateModal(true);
                    }}
                    className="min-h-[42px] flex w-full items-center justify-between gap-2 rounded-xl border border-slate-800 bg-[#111C33]/80 px-3 py-2 text-left text-xs hover:border-teal-400/60 cursor-pointer"
                  >
                    <BilingualBlock
                      text={tpl.title}
                      frClassName="font-semibold text-slate-200"
                      arClassName="text-[11px] text-teal-300"
                    />
                    <span className="shrink-0 font-mono-code text-[11px] text-slate-400">
                      {tpl.estimatedMinutes}m
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Column: Selected Room 6-Tab Inspector */}
          <section className="lg:col-span-8 rounded-2xl border border-slate-800 bg-[#0D1628] overflow-hidden shadow-2xl">
            {/* Room Header */}
            <div className="border-b border-slate-800 bg-[#0B1220] p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${STATUS_BADGE[selectedRoom.status].className}`}
                    >
                      <BilingualInline
                        text={{
                          fr: STATUS_BADGE[selectedRoom.status].fr,
                          ar: STATUS_BADGE[selectedRoom.status].ar,
                        }}
                      />
                    </span>
                    <span className="font-mono-code text-xs text-slate-400">
                      /{selectedRoom.slug}
                    </span>
                  </div>
                  <BilingualBlock
                    text={selectedRoom.title}
                    frClassName="font-display text-lg sm:text-xl font-bold text-white"
                    arClassName="text-base sm:text-lg font-bold text-teal-300"
                  />
                  <BilingualBlock
                    text={selectedRoom.subtitle}
                    frClassName="text-xs text-slate-400"
                    arClassName="text-xs text-slate-400"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDuplicateRoom(selectedRoom)}
                    className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-[#111C33] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-teal-400 cursor-pointer"
                  >
                    <CopyPlus className="h-3.5 w-3.5 text-teal-300" />
                    <BilingualInline text={{ fr: "Dupliquer", ar: "استنساخ" }} />
                  </button>
                  {selectedRoom.isLivePrimary && (
                    <Link
                      href="/presenter"
                      className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0D655E] transition active:scale-[0.98]"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <BilingualInline text={{ fr: "Présenter", ar: "تقديم" }} />
                    </Link>
                  )}
                </div>
              </div>

              {/* Horizontally Scrollable 6-Tab Bar */}
              <div
                role="tablist"
                aria-label="Onglets de la salle / تبويبات القاعة"
                className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1"
              >
                {ROOM_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab.key)}
                      className={`min-h-[42px] shrink-0 inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
                        isActive
                          ? "border-teal-400 bg-teal-500/20 text-white"
                          : "border-slate-800 bg-[#111C33]/70 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-teal-300" />
                      <BilingualInline text={{ fr: tab.fr, ar: tab.ar }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Tab Panel */}
            <div className="p-4 sm:p-6 space-y-5">
              {activeTab === "overview" && (
                <div className="space-y-5">
                  <BilingualBlock
                    text={selectedRoom.description}
                    frClassName="text-sm leading-relaxed text-slate-200"
                    arClassName="text-sm leading-relaxed text-teal-200"
                  />

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-slate-800 bg-[#111C33] p-3.5">
                      <p className="text-[11px] text-slate-400">
                        Diapositives · <span className="font-arabic">الشرائح</span>
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-white tabular-nums">
                        {selectedRoom.slidesCount}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-[#111C33] p-3.5">
                      <p className="text-[11px] text-slate-400">
                        Activités · <span className="font-arabic">الأنشطة</span>
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-white tabular-nums">
                        {selectedRoom.activitiesCount}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-[#111C33] p-3.5">
                      <p className="text-[11px] text-slate-400">
                        Connectés · <span className="font-arabic">متصلون</span>
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-teal-300 tabular-nums">
                        {selectedRoom.connectedCount}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-[#111C33] p-3.5">
                      <p className="text-[11px] text-slate-400">
                        Inscrits · <span className="font-arabic">مسجلون</span>
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-white tabular-nums">
                        {selectedRoom.totalParticipants}
                      </p>
                    </div>
                  </div>

                  {/* Quick Launch Surfaces */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        id: "presenter",
                        href: "/presenter",
                        icon: Presentation,
                        fr: "Console Animateur",
                        ar: "لوحة المنشط",
                      },
                      {
                        id: "screen",
                        href: "/screen",
                        icon: Monitor,
                        fr: "Écran Projecteur 16:9",
                        ar: "شاشة العرض 16:9",
                      },
                      {
                        id: "join",
                        href: "/join",
                        icon: Smartphone,
                        fr: "Vue Participant",
                        ar: "واجهة المشارك",
                      },
                    ].map((surface) => {
                      const Icon = surface.icon;
                      const isCopied = copiedId === surface.id;
                      return (
                        <div
                          key={surface.id}
                          className="rounded-xl border border-slate-800 bg-[#0B1220] p-3.5 flex flex-col justify-between gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-teal-300 shrink-0" />
                            <BilingualBlock
                              text={{ fr: surface.fr, ar: surface.ar }}
                              frClassName="text-xs font-bold text-white"
                              arClassName="text-[11px] font-semibold text-teal-300"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={surface.href}
                              className="min-h-[38px] flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-teal-600/90 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-teal-500"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>{surface.href}</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyLink(surface.id, surface.href)
                              }
                              aria-label={`Copier ${surface.href} / نسخ الرابط`}
                              className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-slate-700 bg-[#111C33] text-slate-300 hover:text-white cursor-pointer"
                            >
                              {isCopied ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "presentation" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <BilingualBlock
                      text={{
                        fr: `Plan 16:9 (${sectionList.length} sections · ${SLIDES.length} diapositives)`,
                        ar: `مخطط العرض 16:9 (${sectionList.length} محوراً · ${SLIDES.length} شريحة)`,
                      }}
                      frClassName="text-sm font-bold text-white"
                      arClassName="text-xs font-bold text-teal-300"
                    />
                    <Link
                      href="/presenter"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-500"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <BilingualInline
                        text={{ fr: "Ouvrir le lecteur 16:9", ar: "فتح عارض 16:9" }}
                      />
                    </Link>
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {sectionList.map((sec) => (
                      <div
                        key={sec.sectionNumber}
                        className="rounded-xl border border-slate-800 bg-[#111C33]/80 p-3 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono-code text-teal-300">
                          <span>Section {sec.sectionNumber}</span>
                          <span>{sec.timeRange.fr}</span>
                        </div>
                        <BilingualBlock
                          text={sec.title}
                          frClassName="text-xs font-bold text-white"
                          arClassName="text-xs text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    {MEDIOUNA_ROOM_RESOURCES.map((res) => (
                      <div
                        key={res.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#111C33]/80 p-3.5"
                      >
                        <div className="space-y-1 flex-1 min-w-[200px]">
                          <BilingualBlock
                            text={res.title}
                            frClassName="text-sm font-bold text-white"
                            arClassName="text-xs font-bold text-teal-300"
                          />
                          <BilingualBlock
                            text={res.description}
                            frClassName="text-xs text-slate-400"
                            arClassName="text-xs text-slate-400"
                          />
                        </div>
                        {res.countLabel && (
                          <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-[11px] font-bold text-teal-200">
                            <BilingualInline text={res.countLabel} />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                      <Layers className="h-4 w-4" />
                      <BilingualInline
                        text={{
                          fr: `Galerie pédagogique intégrée (${GALLERY_CATEGORIES.length} catégories)`,
                          ar: `المعرض التربوي المدمج (${GALLERY_CATEGORIES.length} فئة)`,
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {GALLERY_CATEGORIES.map((cat) => (
                        <span
                          key={cat.id}
                          className="rounded-lg border border-slate-800 bg-[#111C33] px-2.5 py-1 text-[11px] text-slate-200"
                        >
                          {cat.number}. {cat.title.fr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "activities" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {activityList.map((act) => (
                    <div
                      key={act.key}
                      className="rounded-xl border border-slate-800 bg-[#111C33]/80 p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-slate-800 px-2 py-0.5 font-mono-code text-[10px] uppercase text-teal-300">
                          {act.type}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Section {act.sectionNumber}
                        </span>
                      </div>
                      <BilingualBlock
                        text={act.title}
                        frClassName="text-xs font-bold text-white"
                        arClassName="text-xs font-semibold text-teal-300"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "participants" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-800 bg-[#111C33] p-4 space-y-2">
                    <BilingualBlock
                      text={{
                        fr: "Isolation des sessions par cohorte",
                        ar: "عزل الجلسات والنتائج حسب كل فوج",
                      }}
                      frClassName="text-sm font-bold text-white"
                      arClassName="text-xs font-bold text-teal-300"
                    />
                    <BilingualBlock
                      text={{
                        fr: "Chaque salle peut lancer plusieurs sessions indépendantes. Les participants rejoignent sans compte personnel via QR + PIN, avec séparation stricte Mode Démo / Mode Réel.",
                        ar: "يمكن لكل قاعة إطلاق عدة جلسات مستقلة. ينضم المشاركون دون إنشاء حساب عبر رمز QR ورمز PIN مع فصل تام بين الوضع التجريبي والوضع الحقيقي.",
                      }}
                      frClassName="text-xs leading-relaxed text-slate-300"
                      arClassName="text-xs leading-relaxed text-slate-300"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/presenter"
                      className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white hover:bg-[#0D655E] transition active:scale-[0.98]"
                    >
                      <Users className="h-4 w-4" />
                      <BilingualInline
                        text={{
                          fr: "Gérer les participants en direct",
                          ar: "تدبير المشاركين مباشرة",
                        }}
                      />
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-teal-500/30 bg-teal-950/25 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-200">
                      <ShieldCheck className="h-4 w-4 shrink-0" />
                      <BilingualInline
                        text={{
                          fr: "Architecture multi-salles additive & non destructive",
                          ar: "بنية متعددة القاعات إضافية وآمنة دون مساس بالبيانات",
                        }}
                      />
                    </div>
                    <BilingualBlock
                      text={{
                        fr: "La Salle #1 (mediouna-ai-teacher-lab) reste connectée à la base Supabase de production en lecture/écriture. Les nouvelles salles brouillons créées ici sont stockées localement en aperçu Studio jusqu'à validation de la migration SQL additive (docs/STUDIO_MIGRATION_PROPOSAL.md).",
                        ar: "تظل القاعة 1 مرتبطة بقاعدة البيانات الحية. أما القاعات التجريبية الجديدة المنشأة هنا فتُحفظ محلياً كمعاينة للاستوديو إلى حين اعتماد ترحيل قاعدة البيانات الإضافي.",
                      }}
                      frClassName="text-xs leading-relaxed text-slate-300"
                      arClassName="text-xs leading-relaxed text-teal-100/90"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-[#111C33] p-3.5 space-y-1">
                      <p className="text-slate-400">
                        Identifiant salle · <span className="font-arabic">معرف القاعة</span>
                      </p>
                      <p className="font-mono-code font-bold text-white">
                        {selectedRoom.slug}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-[#111C33] p-3.5 space-y-1">
                      <p className="text-slate-400">
                        Affichage bilingue · <span className="font-arabic">العرض الثنائي</span>
                      </p>
                      <p className="font-semibold text-teal-300">
                        FR (LTR) + AR (RTL) simultané · متزامن دائماً
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Créer une nouvelle salle Studio / إنشاء قاعة جديدة"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
        >
          <form
            onSubmit={handleCreateRoom}
            className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0B1220] p-5 sm:p-6 text-white shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <BilingualBlock
                text={{
                  fr: "Créer une salle dans AI Teacher Lab Studio",
                  ar: "إنشاء قاعة جديدة في استوديو AI Teacher Lab",
                }}
                frClassName="text-base font-bold text-white"
                arClassName="text-sm font-bold text-teal-300"
              />
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                aria-label="Fermer / إغلاق"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="studio-template"
                className="block text-xs font-bold text-slate-300"
              >
                <BilingualInline
                  text={{ fr: "Choisir un modèle", ar: "اختر نموذج القاعة" }}
                />
              </label>
              <select
                id="studio-template"
                value={selectedTemplateKey}
                onChange={(e) => setSelectedTemplateKey(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-slate-700 bg-[#111C33] px-3 py-2 text-sm text-white"
              >
                {STUDIO_TEMPLATES.map((tpl) => (
                  <option key={tpl.key} value={tpl.key}>
                    {tpl.title.fr} · {tpl.title.ar}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="studio-title-fr"
                className="block text-xs font-bold text-slate-300"
              >
                Titre en Français (LTR)
              </label>
              <input
                id="studio-title-fr"
                type="text"
                dir="ltr"
                value={newTitleFr}
                onChange={(e) => setNewTitleFr(e.target.value)}
                placeholder="Ex : Atelier Évaluation & IA — Cycle Primaire"
                className="min-h-[44px] w-full rounded-xl border border-slate-700 bg-[#111C33] px-3.5 py-2 text-base sm:text-sm text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="studio-title-ar"
                className="block text-xs font-bold text-teal-300 font-arabic"
                dir="rtl"
                lang="ar"
              >
                العنوان بالعربية (RTL)
              </label>
              <input
                id="studio-title-ar"
                type="text"
                dir="rtl"
                lang="ar"
                value={newTitleAr}
                onChange={(e) => setNewTitleAr(e.target.value)}
                placeholder="مثال: ورشة التقويم والذكاء الاصطناعي — السلك الابتدائي"
                className="font-arabic min-h-[44px] w-full rounded-xl border border-slate-700 bg-[#111C33] px-3.5 py-2 text-base sm:text-sm text-white placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="min-h-[42px] rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
              >
                <BilingualInline text={{ fr: "Annuler", ar: "إلغاء" }} />
              </button>
              <button
                type="submit"
                className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white hover:bg-[#0D655E] cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <BilingualInline
                  text={{ fr: "Créer la salle", ar: "إنشاء القاعة" }}
                />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
