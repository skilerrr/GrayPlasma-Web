"use client";

import React from "react";
import Image from "next/image";
import {
  Scale,
  X,
  Sparkles,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { Monitor } from "@/types/monitor";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TierBadge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";

interface MonitorComparatorTrayProps {
  pinnedMonitors: Monitor[];
  onRemovePin: (slugOrId: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MonitorComparatorTray({
  pinnedMonitors,
  onRemovePin,
  onClearAll,
  isOpen,
  onOpenChange,
}: MonitorComparatorTrayProps) {
  if (pinnedMonitors.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Compare Tray Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
        <div className="bg-gp-ink-998/95 backdrop-blur-md border border-gp-ink-600/80 rounded-2xl p-3 sm:p-3.5 shadow-tray-dock flex items-center justify-between gap-3">
          {/* Left: Indicator & Thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gp-emerald/10 border border-gp-emerald/30 text-gp-emerald text-xs font-black uppercase tracking-wider flex-shrink-0">
              <Scale className="w-3.5 h-3.5" />
              <span>VS ({pinnedMonitors.length}/3)</span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {pinnedMonitors.map((m) => (
                <div
                  key={m.id || m.slug}
                  className="relative group flex items-center gap-2 bg-gp-ink-800 border border-gp-ink-700 rounded-xl p-1.5 pr-2.5 transition-colors hover:border-gp-ink-500"
                >
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black flex-shrink-0">
                    <Image
                      src={m.thumbnail}
                      alt={m.fullName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xs font-bold text-white max-w-[90px] sm:max-w-[120px] truncate">
                      {m.model || m.fullName}
                    </span>
                    <span className="text-3xs text-gp-emerald font-mono font-bold">
                      {formatRupiah(m.price)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePin(m.slug || m.id);
                    }}
                    className="p-1 text-gp-ink-300 hover:text-rose-400 transition-colors"
                    title="Hapus"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onClearAll}
              className="text-2xs text-gp-ink-300 hover:text-white px-2 py-1 transition-colors"
            >
              Reset
            </button>
            <Button
              variant="cyber"
              size="sm"
              onClick={() => onOpenChange(true)}
              className="bg-emerald-500 text-gp-ink-950 font-bold hover:bg-emerald-400 text-xs px-3 sm:px-4 py-2 border border-emerald-400/50 shadow-sm"
            >
              Bandingkan Head-to-Head
            </Button>
          </div>
        </div>
      </div>

      {/* Head-to-Head Comparison Matrix Dialog */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          onClose={() => onOpenChange(false)}
          className="max-w-5xl p-5 sm:p-7 overflow-hidden flex flex-col max-h-[92vh] bg-gp-ink-998 border-gp-ink-700"
        >
          <div className="flex items-center justify-between pb-4 border-b border-gp-ink-700">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gp-emerald/10 border border-gp-emerald/30 text-gp-emerald">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Tabel Komparasi Head-to-Head Lab GTID
                </h2>
                <p className="text-xs text-gp-ink-300">
                  Perbandingan data pengujian sensor, response time, dan akurasi warna monitor.
                </p>
              </div>
            </div>

            <button
              onClick={onClearAll}
              className="text-xs text-gp-ink-300 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Pilihan</span>
            </button>
          </div>

          {/* Comparison Matrix Table Scrollable Container */}
          <div className="overflow-y-auto overflow-x-auto pr-1 space-y-6 pt-3 text-xs">
            {/* Monitor Cards Row Header */}
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${pinnedMonitors.length}, minmax(240px, 1fr))`,
              }}
            >
              {pinnedMonitors.map((m) => (
                <div
                  key={m.id}
                  className="bg-gp-ink-850 border border-gp-ink-700 rounded-2xl p-4 flex flex-col justify-between relative space-y-3"
                >
                  <button
                    onClick={() => onRemovePin(m.slug || m.id)}
                    className="absolute top-3 right-3 p-1 rounded-lg bg-black/60 text-gp-ink-300 hover:text-rose-400 border border-gp-ink-700 transition-colors"
                    title="Hapus monitor ini"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-2">
                    <TierBadge tier={m.tier} />
                    <div className="relative aspect-[16/10] bg-black rounded-xl overflow-hidden border border-gp-ink-800">
                      <Image
                        src={m.thumbnail}
                        alt={m.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-white text-sm line-clamp-2">
                      {m.fullName}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-gp-ink-700/80 flex items-center justify-between">
                    <div>
                      <span className="text-3xs text-gp-ink-400 uppercase block font-semibold">
                        Harga Termurah
                      </span>
                      <span className="text-base font-black text-gp-emerald font-mono tabular-nums">
                        {formatRupiah(m.price)}
                      </span>
                    </div>
                    <a
                      href={`/monitor/${m.slug}`}
                      className="p-2 rounded-lg bg-gp-ink-800 border border-gp-ink-700 hover:border-gp-ink-600 text-gp-ink-200 hover:text-white transition-colors"
                      title="Lihat ulasan lengkap"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Matrix Data Sections */}
            <div className="space-y-4 font-sans">
              {/* 1. Display & Panel Specifications */}
              <div className="rounded-2xl border border-gp-ink-700 overflow-hidden bg-gp-ink-950/60">
                <div className="bg-gp-ink-800/90 px-4 py-2 text-2xs font-black text-gp-ink-200 uppercase tracking-wider border-b border-gp-ink-700">
                  1. Spesifikasi Panel & Resolusi
                </div>
                <div className="divide-y divide-gp-ink-800">
                  <MatrixRow
                    label="Ukuran Layar"
                    values={pinnedMonitors.map((m) => m.specs.display.size)}
                  />
                  <MatrixRow
                    label="Resolusi Native"
                    values={pinnedMonitors.map((m) => m.specs.display.resolution)}
                    highlightBest
                  />
                  <MatrixRow
                    label="Tipe Panel"
                    values={pinnedMonitors.map((m) => m.specs.display.panelType)}
                  />
                  <MatrixRow
                    label="Refresh Rate"
                    values={pinnedMonitors.map((m) => `${m.specs.display.refreshRate} Hz`)}
                    highlightBest
                  />
                  <MatrixRow
                    label="Subpixel Layout"
                    values={pinnedMonitors.map(
                      (m) => m.specs.display.subpixelLayout || m.subpixelLayout || "RGB Stripe (Standar)"
                    )}
                  />
                  <MatrixRow
                    label="Coating Layar"
                    values={pinnedMonitors.map(
                      (m) => m.specs.display.coatingType || m.coatingType || "Matte 3H (Anti-Glare)"
                    )}
                  />
                </div>
              </div>

              {/* 2. GTID Lab Testing & Realita Data */}
              <div className="rounded-2xl border border-gp-ink-700 overflow-hidden bg-gp-ink-950/60">
                <div className="bg-gp-ink-800/90 px-4 py-2 text-2xs font-black text-gp-emerald uppercase tracking-wider border-b border-gp-ink-700 flex items-center justify-between">
                  <span>2. Data Pengujian Sensor Lab GTID</span>
                  <span className="text-3xs text-gp-ink-400 font-mono">Toleransi 5 RGB vs Klaim</span>
                </div>
                <div className="divide-y divide-gp-ink-800">
                  <MatrixRow
                    label="Response Time GtG (Lab)"
                    values={pinnedMonitors.map(
                      (m) => m.responseTimeData?.toleranceNew || m.specs.display.responseTime || "5.2 ms (Toleransi Baru)"
                    )}
                    highlightBest
                  />
                  <MatrixRow
                    label="Overshoot / Inverse Ghosting"
                    values={pinnedMonitors.map((m) =>
                      m.overshootData
                        ? `${m.overshootData.maxOvershootPercent}% (${m.overshootData.bestOverdriveMode})`
                        : "< 5% (Optimal)"
                    )}
                  />
                  <MatrixRow
                    label="Kontras Rasio Asli"
                    values={pinnedMonitors.map((m) => m.specs.display.contrastRatio || "1000:1")}
                    highlightBest
                  />
                  <MatrixRow
                    label="Color Gamut Coverage"
                    values={pinnedMonitors.map((m) => m.specs.display.colorGamut || "99% sRGB")}
                  />
                  <MatrixRow
                    label="Kecerahan (Nits Min / Max)"
                    values={pinnedMonitors.map((m) => m.specs.display.brightness || "~300 nits")}
                  />
                  <MatrixRow
                    label="Sync Tech & VRR Range"
                    values={pinnedMonitors.map((m) => m.specs.features.syncTech || "FreeSync Premium (48-240Hz)")}
                  />
                </div>
              </div>

              {/* 3. Ergonomics & Connectivity */}
              <div className="rounded-2xl border border-gp-ink-700 overflow-hidden bg-gp-ink-950/60">
                <div className="bg-gp-ink-800/90 px-4 py-2 text-2xs font-black text-gp-ink-200 uppercase tracking-wider border-b border-gp-ink-700">
                  3. Ergonomi, Port & Garansi
                </div>
                <div className="divide-y divide-gp-ink-800">
                  <MatrixRow
                    label="Height Adjustment"
                    values={pinnedMonitors.map((m) =>
                      m.specs.ergonomics.heightAdjustable ? "Ya (Adjustable)" : "Tidak (Statis / Tilt Only)"
                    )}
                  />
                  <MatrixRow
                    label="Pivot (Rotasi Vertikal)"
                    values={pinnedMonitors.map((m) => (m.specs.ergonomics.pivot ? "Ya (90°)" : "Tidak"))}
                  />
                  <MatrixRow
                    label="VESA Mount"
                    values={pinnedMonitors.map((m) => m.specs.ergonomics.vesaMount || "100 × 100 mm")}
                  />
                  <MatrixRow
                    label="Port Display"
                    values={pinnedMonitors.map(
                      (m) => `${m.specs.connectivity.displayPort}, ${m.specs.connectivity.hdmi}`
                    )}
                  />
                  <MatrixRow
                    label="Garansi Resmi"
                    values={pinnedMonitors.map((m) => m.specs.features.warranty || "3 Tahun Resmi")}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MatrixRow({
  label,
  values,
  highlightBest = false,
}: {
  label: string;
  values: string[];
  highlightBest?: boolean;
}) {
  return (
    <div className="grid grid-cols-12 px-4 py-2.5 items-center hover:bg-gp-ink-800/40 transition-colors">
      <div className="col-span-3 sm:col-span-3 text-2xs text-gp-ink-300 font-medium">
        {label}
      </div>
      <div
        className="col-span-9 sm:col-span-9 grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
        }}
      >
        {values.map((val, idx) => (
          <div
            key={idx}
            className={`text-xs font-semibold ${
              highlightBest && idx === 0 ? "text-gp-emerald font-bold" : "text-gp-ink-100"
            }`}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  );
}
