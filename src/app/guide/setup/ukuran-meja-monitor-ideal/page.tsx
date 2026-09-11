"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ruler,
  ArrowLeft,
  LayoutGrid,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Monitor as MonitorIcon,
  Laptop,
  Cpu,
  Layers,
  ArrowRight,
  Info,
  ChevronRight,
} from "lucide-react";
import { IDEAL_DESK_MONITOR_SIZES } from "@/data/grayplasma-desk-peripherals";
import { SubpageNavbar } from "@/components/subpage-navbar";
import { Footer } from "@/components/footer";

export default function UkuranMejaMonitorIdealPage() {
  const [activeTab, setActiveTab] = useState<"24inch" | "27inch" | "calculator">("24inch");

  // Interactive Calculator State
  const [calcMonitorSize, setCalcMonitorSize] = useState<"24" | "27" | "dual-24" | "dual-27">("24");
  const [calcDevice, setCalcDevice] = useState<"pc-bottom" | "pc-top" | "laptop">("pc-top");

  const calculateRecommendation = () => {
    if (calcMonitorSize === "24") {
      if (calcDevice === "pc-bottom") return { min: "120 × 60 cm", ideal: "120 × 70 cm", notes: "PC di bawah meja menghemat banyak ruang lebar." };
      if (calcDevice === "pc-top") return { min: "120 × 60 cm", ideal: "140 × 70 cm", notes: "PC di atas meja butuh lebar minimal 140 cm agar mousepad leluasa." };
      return { min: "120 × 60 cm", ideal: "140 × 70 cm", notes: "Cocok untuk setup docking laptop + monitor 24\"." };
    }
    if (calcMonitorSize === "27") {
      if (calcDevice === "pc-bottom") return { min: "120 × 70 cm", ideal: "140 × 70 cm", notes: "Kedalaman 70 cm wajib untuk kenyamanan jarak pandang monitor 27\"." };
      if (calcDevice === "pc-top") return { min: "140 × 70 cm", ideal: "140 × 70 cm", notes: "Panjang 140 cm dan kedalaman 70 cm adalah sweetspot ideal." };
      return { min: "140 × 70 cm", ideal: "140 × 70 cm", notes: "Memberikan ruang ergonomis untuk laptop di samping monitor 27\"." };
    }
    if (calcMonitorSize === "dual-24") {
      if (calcDevice === "pc-bottom") return { min: "120 × 60 cm", ideal: "140 × 70 cm", notes: "Gunakan monitor arm dual clamp untuk menghemat ruang meja." };
      if (calcDevice === "pc-top") return { min: "140 × 60 cm", ideal: "160 × 70 cm", notes: "Dua monitor 24\" + casing PC di atas meja butuh meja panjang 160 cm." };
      return { min: "140 × 60 cm", ideal: "160 × 70 cm", notes: "Memberikan ruang leluasa untuk laptop + dual monitor." };
    }
    // Dual 27
    if (calcDevice === "pc-bottom") return { min: "140 × 70 cm", ideal: "160 × 70 cm", notes: "Setup dual 27\" butuh lebar meja minimal 160 cm agar sudut lengkung nyaman." };
    if (calcDevice === "pc-top") return { min: "140 × 70 cm", ideal: "160 × 70 cm (atau 180 × 80 cm)", notes: "Disarankan meja 160-180 cm atau pertimbangkan standing desk dual motor." };
    return { min: "140 × 70 cm", ideal: "160 × 70 cm", notes: "Setup produktivitas tinggi kreator & programmer." };
  };

  const calcResult = calculateRecommendation();

  return (
    <div className="min-h-screen bg-[#191919] text-[#e0e0e0] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Unified Subpage Navbar */}
      <SubpageNavbar
        breadcrumbs={[
          { label: "REKOMENDASI MEJA", href: "/catalog/desks", icon: <Layers className="w-3.5 h-3.5 text-zinc-400" /> },
          { label: "UKURAN MEJA & MONITOR IDEAL", icon: <Ruler className="w-3.5 h-3.5 text-zinc-400" /> },
        ]}
        backLink={{
          href: "/catalog/desks",
          label: "Ke Katalog Meja",
        }}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 flex-1 w-full">
        {/* Page Hero Title */}
        <div className="bg-[#202020] border border-[#2f2f2f] rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Ruler className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
              UKURAN MEJA DAN MONITOR YANG IDEAL
            </h1>
            <p className="text-sm sm:text-base text-[#9b9a97] leading-relaxed max-w-3xl">
              Ini panduan lengkap penyesuaian dimensi panjang & kedalaman meja kerja berdasarkan ukuran layar monitor (24" vs 27"), posisi penempatan casing PC, dan penggunaan laptop/dual monitor.
            </p>
          </div>

          {/* Interactive Navigation Mode Tabs */}
          <div className="flex items-center gap-2 pt-4 border-t border-[#2f2f2f] overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("24inch")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "24inch"
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-sm"
                  : "bg-[#191919] border border-[#2f2f2f] text-zinc-400 hover:text-white"
              }`}
            >
              <MonitorIcon className="w-4 h-4" />
              <span>Matriks 24 Inch</span>
            </button>
            <button
              onClick={() => setActiveTab("27inch")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "27inch"
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-sm"
                  : "bg-[#191919] border border-[#2f2f2f] text-zinc-400 hover:text-white"
              }`}
            >
              <MonitorIcon className="w-4 h-4" />
              <span>Matriks 27 Inch (Termasuk Secondary)</span>
            </button>
            <button
              onClick={() => setActiveTab("calculator")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "calculator"
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-sm"
                  : "bg-[#191919] border border-[#2f2f2f] text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Kalkulator Dimensi Meja</span>
            </button>
          </div>
        </div>

        {/* 1. VIEW TAB: GAMBARAN KASAR (24 INCH) */}
        {activeTab === "24inch" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>GAMBARAN KASAR (24 INCH)</span>
              </h2>
              <span className="text-xs text-[#9b9a97]">Data rekomendasi meja setup monitor 24"</span>
            </div>

            <div className="rounded-2xl border border-[#2f2f2f] bg-[#191919] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead className="bg-[#202020] text-[#9b9a97] uppercase text-[11px] font-bold tracking-wider border-b border-[#2f2f2f]">
                    <tr>
                      <th className="py-3 px-4 min-w-[160px] text-white">UKURAN MONITOR</th>
                      <th className="py-3 px-4 min-w-[220px]">DEVICE / SETUP</th>
                      <th className="py-3 px-4 min-w-[160px] font-mono text-zinc-300">UKURAN MEJA (MINIMUM, CM)</th>
                      <th className="py-3 px-4 min-w-[160px] font-mono text-emerald-400">UKURAN MEJA (IDEAL, CM)</th>
                      <th className="py-3 px-4 min-w-[140px]">BENTUK MEJA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262626]">
                    {IDEAL_DESK_MONITOR_SIZES.size24.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 === 0 ? "bg-[#191919]" : "bg-[#1d1d1d]"}>
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                          <span>{item.monitorSize}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.deviceSetup.split(",").map((dev, dIdx) => (
                              <span
                                key={dIdx}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  dev.includes("1 MONITOR") || dev.includes("2 MONITOR")
                                    ? "bg-[#1e3a8a]/40 text-blue-300 border border-blue-500/30"
                                    : dev.includes("LAPTOP")
                                    ? "bg-[#854d0e]/40 text-amber-300 border border-amber-500/30"
                                    : "bg-[#374151] text-zinc-200 border border-zinc-600"
                                }`}
                              >
                                {dev.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-300 font-semibold">
                          {item.minDeskSize}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold text-sm">
                          {item.idealDeskSize}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-[#202020] border border-zinc-700 text-zinc-300 text-[10px] font-bold">
                            {item.shape}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. VIEW TAB: GAMBARAN KASAR (27 INCH) */}
        {activeTab === "27inch" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>GAMBARAN KASAR (27 INCH, TERMASUK SECONDARY 24 INCH)</span>
              </h2>
              <span className="text-xs text-[#9b9a97]">Data rekomendasi meja setup monitor 27"</span>
            </div>

            <div className="rounded-2xl border border-[#2f2f2f] bg-[#191919] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead className="bg-[#202020] text-[#9b9a97] uppercase text-[11px] font-bold tracking-wider border-b border-[#2f2f2f]">
                    <tr>
                      <th className="py-3 px-4 min-w-[180px] text-white">UKURAN MONITOR</th>
                      <th className="py-3 px-4 min-w-[220px]">DEVICE / SETUP</th>
                      <th className="py-3 px-4 min-w-[160px] font-mono text-zinc-300">UKURAN MEJA (MINIMUM, CM)</th>
                      <th className="py-3 px-4 min-w-[160px] font-mono text-emerald-400">UKURAN MEJA (IDEAL, CM)</th>
                      <th className="py-3 px-4 min-w-[140px]">BENTUK MEJA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262626]">
                    {IDEAL_DESK_MONITOR_SIZES.size27.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 === 0 ? "bg-[#191919]" : "bg-[#1d1d1d]"}>
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                          <span>{item.monitorSize}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.deviceSetup.split(",").map((dev, dIdx) => (
                              <span
                                key={dIdx}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  dev.includes("1 MONITOR") || dev.includes("2 MONITOR")
                                    ? "bg-[#1e3a8a]/40 text-blue-300 border border-blue-500/30"
                                    : dev.includes("LAPTOP")
                                    ? "bg-[#854d0e]/40 text-amber-300 border border-amber-500/30"
                                    : "bg-[#374151] text-zinc-200 border border-zinc-600"
                                }`}
                              >
                                {dev.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-300 font-semibold">
                          {item.minDeskSize}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold text-sm">
                          {item.idealDeskSize}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-[#202020] border border-zinc-700 text-zinc-300 text-[10px] font-bold">
                            {item.shape}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. VIEW TAB: INTERACTIVE CALCULATOR */}
        {activeTab === "calculator" && (
          <div className="bg-[#202020] border border-[#2f2f2f] rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Pencari Ukuran Meja Ideal Interaktif</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#9b9a97]">
                Pilih konfigurasi monitor & penempatan PC Anda untuk langsung melihat rekomendasi dimensi meja yang pas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 1: Monitor Configuration */}
              <div className="space-y-3 bg-[#191919] p-5 rounded-2xl border border-[#2f2f2f]">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  1. Pilih Ukuran & Jumlah Monitor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "24", label: "Single 24 Inch", sub: "1 Layar 24\"" },
                    { id: "27", label: "Single 27 Inch", sub: "1 Layar 27\"" },
                    { id: "dual-24", label: "Dual 24 Inch", sub: "2 Layar 24\"" },
                    { id: "dual-27", label: "Dual 27 / Ultrawide", sub: "2 Layar 27\"" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setCalcMonitorSize(opt.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        calcMonitorSize === opt.id
                          ? "bg-emerald-500/20 border-emerald-500/50 text-white shadow-sm"
                          : "bg-[#202020] border-[#2f2f2f] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="block font-bold text-xs">{opt.label}</span>
                      <span className="text-[10px] text-zinc-500">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Device Placement */}
              <div className="space-y-3 bg-[#191919] p-5 rounded-2xl border border-[#2f2f2f]">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  2. Posisi Penempatan PC / Laptop
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "pc-top", label: "PC Di Atas Meja", icon: <MonitorIcon className="w-5 h-5 mx-auto" /> },
                    { id: "pc-bottom", label: "PC Di Bawah Meja", icon: <Layers className="w-5 h-5 mx-auto" /> },
                    { id: "laptop", label: "Laptop / Docking", icon: <Laptop className="w-5 h-5 mx-auto" /> },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setCalcDevice(opt.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        calcDevice === opt.id
                          ? "bg-amber-500/20 border-amber-500/50 text-white shadow-sm"
                          : "bg-[#202020] border-[#2f2f2f] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <div className="mb-1.5 flex justify-center text-zinc-300">{opt.icon}</div>
                      <span className="block font-bold text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation Result Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#172e21] to-[#121f18] border border-emerald-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Rekomendasi Dimensi Meja Anda:</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                  Bentuk: Non L-Shaped
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/30 space-y-1">
                  <span className="text-[11px] text-zinc-400 block">Ukuran Meja Minimum</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-zinc-200">
                    {calcResult.min}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/50 space-y-1">
                  <span className="text-[11px] text-emerald-300 font-bold block">
                    Ukuran Meja Paling Ideal (Direkomendasikan)
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                    {calcResult.ideal}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 italic pt-1 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-400 inline-block flex-shrink-0" />
                <span><strong className="font-semibold text-white">Catatan Ergonomi:</strong> {calcResult.notes}</span>
              </p>
            </div>
          </div>
        )}

        {/* 4. KNOWLEDGE & TIPS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-[#202020] border border-[#2f2f2f] space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Mengapa Kedalaman Meja (Lebar) 70 cm Sangat Krusial?</span>
            </div>
            <p className="text-xs text-[#9b9a97] leading-relaxed">
              Banyak meja murah hanya memiliki kedalaman 50-60 cm. Saat monitor diletakkan dengan stand bawaan, jarak mata ke layar menjadi terlalu dekat (&lt;50 cm), memicu mata cepat lelah dan pusing. Kedalaman 70 cm memberi jarak pandang sehat (60–75 cm) dan ruang luas untuk keyboard arm rest & deskmat.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#202020] border border-[#2f2f2f] space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ketebalan Daun Meja untuk Bracket Jepit</span>
            </div>
            <p className="text-xs text-[#9b9a97] leading-relaxed">
              Jika ingin menggunakan Monitor Arm Gas Spring (seperti Oximus P100e/P200e), pastikan ketebalan daun meja minimal **2.5 cm – 3.0 cm** berbahan Plywood/Multiplek HPL atau Kayu Solid. Hindari daun meja berbahan MDF serbuk kayu tipis 1.2 cm yang mudah pecah ketika dijepit.
            </p>
          </div>
        </div>

        {/* Bottom Banner to Catalog */}
        <div className="p-6 rounded-3xl bg-[#202020] border border-[#2f2f2f] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight">
              Siap Memilih Meja yang Tepat?
            </h3>
            <p className="text-xs text-[#9b9a97] mt-0.5">
              Lihat 10 rekomendasi daun meja custom, meja standar hollow, meja elektrik standing desk, hingga meja nakas.
            </p>
          </div>
          <Link
            href="/catalog/desks"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg whitespace-nowrap"
          >
            <span>Lihat Daftar Rekomendasi Meja</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
