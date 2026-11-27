"use client";

import React, { useState } from "react";
import { Code2, Plus, Save, ShieldAlert, X } from "lucide-react";
import { CodeSandboxFrame } from "@/components/studio/elements/CodeSandboxFrame";

interface CodeStudioModalProps {
  roomId: string;
  onClose: () => void;
  onInsertElement: (payload: {
    titleFr: string;
    titleAr: string;
    html: string;
    css: string;
    js: string;
    approved: boolean;
  }) => void;
}

const STARTER_PRESETS = [
  {
    nameFr: "Compteur de points de groupe",
    nameAr: "عداد نقاط المجموعات",
    html: `<div class="wrap">\n  <div class="card"><h3>Groupe A · المجموعة أ</h3><p id="a">0</p><button onclick="inc('a')">+1</button></div>\n  <div class="card"><h3>Groupe B · المجموعة ب</h3><p id="b">0</p><button onclick="inc('b')">+1</button></div>\n</div>`,
    css: `body{margin:0;padding:16px;font-family:system-ui;background:#faf8f4;color:#0b1220}.wrap{display:grid;grid-template-columns:1fr 1fr;gap:16px}.card{background:#fff;border:2px solid #0f766e;border-radius:14px;padding:18px;text-align:center}p{font-size:44px;font-weight:800;margin:8px 0;color:#0f766e}button{background:#0b1220;color:#fff;border:0;border-radius:10px;padding:10px 22px;font-size:16px;font-weight:700;cursor:pointer}`,
    js: `function inc(id){const el=document.getElementById(id);el.textContent=String(Number(el.textContent)+1);}`,
  },
  {
    nameFr: "Générateur table de multiplication",
    nameAr: "مُنتج جدول الضرب التفاعلي",
    html: `<div class="box"><h3>Table · جدول <span id="t">6</span></h3><button onclick="next()">Autre exercice · تمرين جديد</button><p id="q">6 × 4 = ?</p><button class="ans" onclick="reveal()">Réponse · الجواب</button><p id="r"></p></div>`,
    css: `body{margin:0;padding:18px;font-family:system-ui;background:#faf8f4;color:#0b1220}.box{background:#fff;border:2px solid #0f766e;border-radius:14px;padding:20px;text-align:center}#q{font-size:38px;font-weight:800;margin:12px 0}#r{font-size:28px;font-weight:700;color:#0f766e;min-height:36px}button{background:#0f766e;color:#fff;border:0;border-radius:10px;padding:10px 18px;font-weight:700;cursor:pointer;margin:4px}.ans{background:#0b1220}`,
    js: `let a=6,b=4;function next(){a=2+Math.floor(Math.random()*8);b=2+Math.floor(Math.random()*8);document.getElementById('t').textContent=a;document.getElementById('q').textContent=a+' × '+b+' = ?';document.getElementById('r').textContent='';}function reveal(){document.getElementById('r').textContent='= '+(a*b);}`,
  },
];

export function CodeStudioModal({
  roomId,
  onClose,
  onInsertElement,
}: CodeStudioModalProps) {
  const [titleFr, setTitleFr] = useState("Mini-outil pédagogique interactif");
  const [titleAr, setTitleAr] = useState("أداة بيداغوجية تفاعلية مصغرة");
  const [html, setHtml] = useState(STARTER_PRESETS[0].html);
  const [css, setCss] = useState(STARTER_PRESETS[0].css);
  const [js, setJs] = useState(STARTER_PRESETS[0].js);
  const [approved, setApproved] = useState(true);
  const [savingToLib, setSavingToLib] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const byteCount = new TextEncoder().encode(html + css + js).length;
  const overLimit = byteCount > 32 * 1024;

  async function saveToLibrary() {
    setSavingToLib(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/studio/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          title: { fr: titleFr, ar: titleAr },
          html,
          css,
          js,
          approved,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatusMsg(json.error ?? "Sauvegarde refusée.");
      } else {
        setStatusMsg("Enregistré dans la bibliothèque de la salle · تم الحفظ في مكتبة القاعة");
      }
    } finally {
      setSavingToLib(false);
    }
  }

  return (
    <div
      data-code-studio-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-6xl rounded-2xl border border-[#E9E3D6] bg-[#FAF8F4] text-[#0B1220] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between bg-[#0B1220] px-5 py-3.5 text-white">
          <div className="flex items-center gap-2.5">
            <Code2 className="h-5 w-5 text-teal-400" />
            <div>
              <h2 className="font-display font-bold text-base">
                Studio Code HTML / CSS / JS (Sandbox isolé)
              </h2>
              <p dir="rtl" lang="ar" className="font-arabic text-xs text-teal-200">
                بيئة برمجية معزولة وآمنة لإنشاء أنشطة تفاعلية مخصصة
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-y-auto flex-1">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {STARTER_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setTitleFr(preset.nameFr);
                    setTitleAr(preset.nameAr);
                    setHtml(preset.html);
                    setCss(preset.css);
                    setJs(preset.js);
                  }}
                  className="rounded-lg border border-teal-700/30 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-900"
                >
                  Modèle : {preset.nameFr}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                placeholder="Titre FR"
                className="rounded-lg border border-[#D9D0BE] bg-white px-3 py-1.5 text-xs font-bold"
              />
              <input
                type="text"
                dir="rtl"
                lang="ar"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="العنوان بالعربية"
                className="rounded-lg border border-[#D9D0BE] bg-white px-3 py-1.5 font-arabic text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold">HTML</label>
              <textarea
                rows={4}
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0BE] bg-[#0B1220] text-teal-100 font-mono text-xs p-2.5"
              />
            </div>

            <div>
              <label className="text-xs font-bold">CSS</label>
              <textarea
                rows={3}
                value={css}
                onChange={(e) => setCss(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0BE] bg-[#0B1220] text-amber-100 font-mono text-xs p-2.5"
              />
            </div>

            <div>
              <label className="text-xs font-bold">JavaScript (sandbox sans réseau)</label>
              <textarea
                rows={4}
                value={js}
                onChange={(e) => setJs(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0BE] bg-[#0B1220] text-sky-100 font-mono text-xs p-2.5"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className={overLimit ? "text-rose-700 font-bold" : "text-slate-600"}>
                Taille : {byteCount} / 32768 octets
              </span>
              <label className="inline-flex items-center gap-1.5 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={approved}
                  onChange={(e) => setApproved(e.target.checked)}
                />
                <span>Code vérifié et autorisé</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-950 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0" />
              <span>
                Exécution isolée dans <code>iframe sandbox=&quot;allow-scripts&quot;</code> sans accès cookies, stockage ni réseau externe.
              </span>
            </div>

            <div className="flex-1 min-h-[340px]">
              <CodeSandboxFrame
                elementId="code-studio-preview"
                titleFr={titleFr}
                titleAr={titleAr}
                html={html}
                css={css}
                js={js}
                approved={approved}
              />
            </div>

            {statusMsg && (
              <p className="rounded-lg bg-teal-50 border border-teal-200 px-3 py-2 text-xs font-semibold text-teal-900">
                {statusMsg}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                disabled={savingToLib || overLimit}
                onClick={saveToLibrary}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9D0BE] bg-white px-4 py-2 text-xs font-bold"
              >
                <Save className="h-4 w-4" />
                <span>Sauver en bibliothèque</span>
              </button>
              <button
                type="button"
                disabled={overLimit}
                onClick={() => {
                  onInsertElement({ titleFr, titleAr, html, css, js, approved });
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Insérer sur la diapositive · إدراج في الشريحة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
