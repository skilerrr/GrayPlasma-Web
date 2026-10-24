"use client";

import React, { useState } from "react";
import { Plus, X, Check, AlertTriangle, AlignLeft, List, ThumbsUp, ThumbsDown } from "lucide-react";

interface ProsConsManagerProps {
  pros: string[];
  cons: string[];
  onChangePros: (newPros: string[]) => void;
  onChangeCons: (newCons: string[]) => void;
  title?: string;
}

export function ProsConsManager({
  pros = [],
  cons = [],
  onChangePros,
  onChangeCons,
  title = "Kelebihan & Kekurangan (Pros & Cons)",
}: ProsConsManagerProps) {
  const safePros = Array.isArray(pros) ? pros : [];
  const safeCons = Array.isArray(cons) ? cons : [];

  const [newPro, setNewPro] = useState("");
  const [newCon, setNewCon] = useState("");
  const [mode, setMode] = useState<"chips" | "bulk">("chips");

  // Bulk textarea state
  const [bulkPros, setBulkPros] = useState(safePros.join("\n"));
  const [bulkCons, setBulkCons] = useState(safeCons.join("\n"));

  const handleAddPro = () => {
    const val = newPro.trim();
    if (!val) return;
    onChangePros([...safePros, val]);
    setNewPro("");
  };

  const handleAddCon = () => {
    const val = newCon.trim();
    if (!val) return;
    onChangeCons([...safeCons, val]);
    setNewCon("");
  };

  const handleRemovePro = (idx: number) => {
    const next = [...safePros];
    next.splice(idx, 1);
    onChangePros(next);
  };

  const handleRemoveCon = (idx: number) => {
    const next = [...safeCons];
    next.splice(idx, 1);
    onChangeCons(next);
  };

  const handleApplyBulk = () => {
    const pList = bulkPros
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const cList = bulkCons
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    onChangePros(pList);
    onChangeCons(cList);
    setMode("chips");
  };

  const handleSwitchToBulk = () => {
    setBulkPros(safePros.join("\n"));
    setBulkCons(safeCons.join("\n"));
    setMode("bulk");
  };

  return (
    <div className="rounded-xl border border-gp-ink-700 bg-gp-ink-900/90 p-4 space-y-4">
      {/* Header with Mode Switcher */}
      <div className="flex items-center justify-between pb-2 border-b border-gp-ink-750">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white tracking-tight uppercase font-mono">
            {title}
          </span>
          <span className="text-3xs font-mono px-2 py-0.5 rounded bg-gp-ink-800 text-gp-ink-300 border border-gp-ink-700">
            {safePros.length} Plus • {safeCons.length} Minus
          </span>
        </div>

        <div className="flex items-center gap-1 bg-gp-ink-800 p-0.5 rounded-lg border border-gp-ink-700">
          <button
            type="button"
            onClick={() => setMode("chips")}
            className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-1 transition-colors ${
              mode === "chips"
                ? "bg-gp-ink-700 text-white shadow-sm"
                : "text-gp-ink-400 hover:text-white"
            }`}
            title="Mode visual chips"
          >
            <List className="w-3 h-3" />
            <span>Chips</span>
          </button>
          <button
            type="button"
            onClick={handleSwitchToBulk}
            className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-1 transition-colors ${
              mode === "bulk"
                ? "bg-gp-ink-700 text-white shadow-sm"
                : "text-gp-ink-400 hover:text-white"
            }`}
            title="Paste banyak baris sekaligus"
          >
            <AlignLeft className="w-3 h-3" />
            <span>Teks Baris</span>
          </button>
        </div>
      </div>

      {mode === "chips" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. PROS (KELEBIHAN) */}
          <div className="space-y-2.5 p-3 rounded-xl bg-gp-ink-950/70 border border-hue-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-hue-emerald-400 flex items-center gap-1.5 font-mono">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>KELEBIHAN (PROS)</span>
              </span>
              <span className="text-3xs text-gp-ink-400">{safePros.length} item</span>
            </div>

            {/* Quick Add Input */}
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newPro}
                onChange={(e) => setNewPro(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddPro();
                  }
                }}
                placeholder="Tambah kelebihan... (tekan Enter)"
                className="flex-1 bg-gp-ink-850 border border-gp-ink-650 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gp-ink-500 focus:outline-none focus:border-hue-emerald-400"
              />
              <button
                type="button"
                onClick={handleAddPro}
                className="p-1.5 rounded-lg bg-hue-emerald-500 text-black hover:bg-hue-emerald-400 font-bold transition-colors"
                title="Tambah Pro"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Chips List */}
            <div className="space-y-1.5 min-h-[60px] max-h-[220px] overflow-y-auto pr-1">
              {safePros.length === 0 ? (
                <div className="text-3xs text-gp-ink-500 italic py-3 text-center">
                  Belum ada catatan kelebihan.
                </div>
              ) : (
                safePros.map((p, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start justify-between gap-2 p-2 rounded-lg bg-gp-ink-850 border border-hue-emerald-500/25 hover:border-hue-emerald-500/50 transition-colors text-xs text-white"
                  >
                    <div className="flex items-start gap-1.5 min-w-0">
                      <span className="w-4 h-4 rounded-full bg-hue-emerald-500/20 text-hue-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-3xs font-bold">
                        ✓
                      </span>
                      <span className="leading-snug break-words">{p}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePro(idx)}
                      className="p-1 rounded text-gp-ink-400 hover:text-hue-rose-400 hover:bg-gp-ink-750 transition-colors shrink-0"
                      title="Hapus"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. CONS (KEKURANGAN) */}
          <div className="space-y-2.5 p-3 rounded-xl bg-gp-ink-950/70 border border-hue-rose-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-hue-rose-400 flex items-center gap-1.5 font-mono">
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>KEKURANGAN (CONS)</span>
              </span>
              <span className="text-3xs text-gp-ink-400">{safeCons.length} item</span>
            </div>

            {/* Quick Add Input */}
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newCon}
                onChange={(e) => setNewCon(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCon();
                  }
                }}
                placeholder="Tambah kekurangan... (tekan Enter)"
                className="flex-1 bg-gp-ink-850 border border-gp-ink-650 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gp-ink-500 focus:outline-none focus:border-hue-rose-400"
              />
              <button
                type="button"
                onClick={handleAddCon}
                className="p-1.5 rounded-lg bg-hue-rose-500 text-white hover:bg-hue-rose-400 font-bold transition-colors"
                title="Tambah Con"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Chips List */}
            <div className="space-y-1.5 min-h-[60px] max-h-[220px] overflow-y-auto pr-1">
              {safeCons.length === 0 ? (
                <div className="text-3xs text-gp-ink-500 italic py-3 text-center">
                  Belum ada catatan kekurangan.
                </div>
              ) : (
                safeCons.map((c, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start justify-between gap-2 p-2 rounded-lg bg-gp-ink-850 border border-hue-rose-500/25 hover:border-hue-rose-500/50 transition-colors text-xs text-white"
                  >
                    <div className="flex items-start gap-1.5 min-w-0">
                      <span className="w-4 h-4 rounded-full bg-hue-rose-500/20 text-hue-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-3xs font-bold">
                        ✕
                      </span>
                      <span className="leading-snug break-words">{c}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCon(idx)}
                      className="p-1 rounded text-gp-ink-400 hover:text-hue-rose-400 hover:bg-gp-ink-750 transition-colors shrink-0"
                      title="Hapus"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Bulk Multiline Textarea Mode */
        <div className="space-y-3 p-3 rounded-xl bg-gp-ink-950/80 border border-gp-ink-700">
          <p className="text-2xs text-gp-ink-300">
            Paste daftar poin kelebihan dan kekurangan per baris (1 baris = 1 poin):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-3xs font-mono font-bold text-hue-emerald-400">
                PROS (1 per baris)
              </span>
              <textarea
                rows={5}
                value={bulkPros}
                onChange={(e) => setBulkPros(e.target.value)}
                placeholder="Contoh:&#10;Panel Fast IPS 180Hz&#10;Akurasi warna tinggi Delta E < 2&#10;Garansi 3 Tahun"
                className="w-full bg-gp-ink-850 border border-gp-ink-650 rounded-lg p-2.5 text-xs text-white placeholder-gp-ink-500 font-sans focus:outline-none focus:border-hue-emerald-400"
              />
            </div>
            <div className="space-y-1">
              <span className="text-3xs font-mono font-bold text-hue-rose-400">
                CONS (1 per baris)
              </span>
              <textarea
                rows={5}
                value={bulkCons}
                onChange={(e) => setBulkCons(e.target.value)}
                placeholder="Contoh:&#10;Stand bawaan tilt only&#10;Tidak ada speaker internal&#10;Kabel bawaan HDMI 1.4"
                className="w-full bg-gp-ink-850 border border-gp-ink-650 rounded-lg p-2.5 text-xs text-white placeholder-gp-ink-500 font-sans focus:outline-none focus:border-hue-rose-400"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gp-ink-750">
            <button
              type="button"
              onClick={() => setMode("chips")}
              className="px-3 py-1.5 rounded-lg text-xs text-gp-ink-300 hover:text-white"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApplyBulk}
              className="px-3.5 py-1.5 rounded-lg bg-hue-emerald-500 text-black text-xs font-bold hover:bg-hue-emerald-400 transition-colors"
            >
              Terapkan Baris Teks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
