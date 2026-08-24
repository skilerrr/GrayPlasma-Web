"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  Wrench,
  Sparkles,
  Layers,
  ArrowRight,
  Maximize2,
  Tv,
} from "lucide-react";
import {
  DESK_DATABASE,
  PERIPHERALS_DATABASE,
  GIMMICK_MEJA_GAMING_CONTENT,
  CONSULTATION_RESULTS_DATABASE,
  DeskItem,
  PeripheralItem,
} from "@/data/grayplasma-desk-peripherals";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DeskPeripheralsView() {
  const [activeSubTab, setActiveSubTab] = useState<"meja" | "peripherals" | "gimmick" | "consultation-packages">("meja");

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-surface-dark border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Panduan Meja & Peripherals Setup</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Rekomendasi Meja, Bracket, & Peripherals Setup
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Kurasi meja kokoh tahan jepit monitor arm, gas spring bracket, lampu screenbar, dan paket racikan setup dari forum GrayPlasma.
            </p>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab("meja")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 flex items-center gap-2 ${
              activeSubTab === "meja"
                ? "bg-zinc-800 text-cyan-400 border border-cyan-500/40 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Daftar Meja Rekomendasi ({DESK_DATABASE.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab("peripherals")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 flex items-center gap-2 ${
              activeSubTab === "peripherals"
                ? "bg-zinc-800 text-emerald-400 border border-emerald-500/40 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Bracket Arm & Peripherals ({PERIPHERALS_DATABASE.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab("gimmick")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 flex items-center gap-2 ${
              activeSubTab === "gimmick"
                ? "bg-zinc-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Gimmick Meja Gaming</span>
          </button>
          <button
            onClick={() => setActiveSubTab("consultation-packages")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 flex items-center gap-2 ${
              activeSubTab === "consultation-packages"
                ? "bg-zinc-800 text-rose-400 border border-rose-500/40 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hasil Racikan Konsultasi ({CONSULTATION_RESULTS_DATABASE.length})</span>
          </button>
        </div>
      </div>

      {/* 1. VIEW: DAFTAR MEJA REKOMENDASI (TABEL WIDE NOTION) */}
      {activeSubTab === "meja" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
              Tabel Database Meja Pilihan (Kuat Jepit Monitor Arm)
            </h3>
            <span className="text-xs text-zinc-500">Geser ke samping untuk melihat detail spesifikasi</span>
          </div>

          <div className="relative rounded-2xl border border-zinc-800 bg-[#09090b] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
                <thead className="bg-[#121215] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800 sticky top-0 z-20">
                  <tr>
                    <th className="py-3 px-4 font-bold text-zinc-300 min-w-[240px]">NAMA PRODUK / MEJA</th>
                    <th className="py-3 px-3 font-bold min-w-[140px]">KATEGORI</th>
                    <th className="py-3 px-4 font-bold text-emerald-400 min-w-[130px]">KISARAN HARGA</th>
                    <th className="py-3 px-3 font-bold min-w-[180px]">MATERIAL & KETEBALAN</th>
                    <th className="py-3 px-3 font-bold min-w-[140px]">UKURAN DIMENSI</th>
                    <th className="py-3 px-3 font-bold text-center min-w-[110px]">ARM SUPPORT</th>
                    <th className="py-3 px-4 font-bold text-center min-w-[130px]">LINK SHOPEE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/80">
                  {DESK_DATABASE.map((d, idx) => (
                    <tr
                      key={d.id}
                      className={`hover:bg-zinc-900/60 transition-colors ${
                        idx % 2 === 0 ? "bg-black/40" : "bg-[#09090b]"
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-white block text-sm">{d.name}</span>
                          <span className="text-[11px] text-zinc-400 mt-0.5 block">{d.description}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]">
                          {d.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-xs">
                        {formatRupiah(d.price)}
                      </td>
                      <td className="py-3.5 px-3 text-zinc-300">
                        <div>{d.specs.material}</div>
                        <span className="text-[10px] text-emerald-400 font-semibold">Tebal: {d.specs.thickness}</span>
                      </td>
                      <td className="py-3.5 px-3 text-zinc-300 font-mono text-[11px]">
                        {d.specs.dimensions}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aman Jepit</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <a
                          href={d.shopeeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 hover:text-black text-amber-400 text-xs font-bold transition-all"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Beli di Shopee</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. VIEW: BRACKET ARM & PERIPHERALS */}
      {activeSubTab === "peripherals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
              Tabel Monitor Arm, Screenbar, & Aksesoris Meja Teruji
            </h3>
            <span className="text-xs text-zinc-500">Geser ke samping untuk melihat detail spesifikasi</span>
          </div>

          <div className="relative rounded-2xl border border-zinc-800 bg-[#09090b] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
                <thead className="bg-[#121215] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800 sticky top-0 z-20">
                  <tr>
                    <th className="py-3 px-4 font-bold text-zinc-300 min-w-[220px]">NAMA PRODUK</th>
                    <th className="py-3 px-3 font-bold min-w-[150px]">KATEGORI</th>
                    <th className="py-3 px-4 font-bold text-emerald-400 min-w-[120px]">HARGA</th>
                    <th className="py-3 px-3 font-bold min-w-[260px]">EVALUASI & VERDICT GRAYPLASMA</th>
                    <th className="py-3 px-3 font-bold min-w-[180px]">REKOMENDASI PENGGUNAAN</th>
                    <th className="py-3 px-4 font-bold text-center min-w-[130px]">BELI / SHOPEE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/80">
                  {PERIPHERALS_DATABASE.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-zinc-900/60 transition-colors ${
                        idx % 2 === 0 ? "bg-black/40" : "bg-[#09090b]"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-white text-sm">
                        {p.name}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-xs">
                        {formatRupiah(p.price)}
                      </td>
                      <td className="py-3.5 px-3 text-zinc-300 text-xs leading-relaxed">
                        <div>{p.verdict}</div>
                        <span className="text-[10px] text-zinc-500 mt-0.5 block">{p.notes}</span>
                      </td>
                      <td className="py-3.5 px-3 text-cyan-400 text-xs">
                        {p.recommendedFor}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <a
                          href={p.shopeeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 hover:text-black text-amber-400 text-xs font-bold transition-all"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Shopee</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. VIEW: GIMMICK MEJA GAMING (ANALYSIS ARTICLE) */}
      {activeSubTab === "gimmick" && (
        <div className="bg-surface-dark border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-zinc-800 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Edukasi Meja & Setup Ergonomi</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              {GIMMICK_MEJA_GAMING_CONTENT.title}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {GIMMICK_MEJA_GAMING_CONTENT.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GIMMICK_MEJA_GAMING_CONTENT.poinPenting.map((point, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 leading-relaxed space-y-2"
              >
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[11px]">
                    {idx + 1}
                  </span>
                  <span>Catatan Penting #{idx + 1}</span>
                </div>
                <p>{point}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
            <span>Mau konsultasi ukuran meja sebelum beli?</span>
            <Button
              variant="cyber"
              size="sm"
              onClick={() => setActiveSubTab("meja")}
              className="text-xs font-bold"
            >
              Lihat Daftar Meja yang Aman →
            </Button>
          </div>
        </div>
      )}

      {/* 4. VIEW: HASIL KONSULTASI FORUM DISCORD */}
      {activeSubTab === "consultation-packages" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
              Contoh Paket Racikan Setup Nyata dari Forum Konsultasi Discord GTID
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CONSULTATION_RESULTS_DATABASE.map((pack) => (
              <div
                key={pack.id}
                className="bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Budget {formatRupiah(pack.budget)}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white leading-snug">
                    {pack.title}
                  </h4>

                  <div className="space-y-1 text-xs text-zinc-400">
                    <div><strong>Target Penggunaan:</strong> {pack.needs}</div>
                    <div><strong>Spek PC / Laptop:</strong> {pack.specs}</div>
                  </div>

                  <div className="pt-2 border-t border-zinc-900">
                    <strong className="text-xs text-zinc-200 block mb-1.5">Rekomendasi Isi Paket:</strong>
                    <ul className="space-y-1.5">
                      {pack.recommendations.map((rec, i) => (
                        <li key={i} className="text-xs text-zinc-300 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
