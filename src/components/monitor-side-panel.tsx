"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  ChevronsRight,
  Maximize2,
  Minimize2,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Cpu,
  Tv,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Layers,
  Sparkles,
  SlidersHorizontal,
  MapPin,
  Package,
  MessageSquare,
  Play,
  Video,
  Info,
  ChevronDown,
  AlertTriangle,
  Download,
  Zap,
} from "lucide-react";
import { Monitor, AdditionalStoreLink } from "@/types/monitor";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { TierBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";

interface MonitorSidePanelProps {
  monitor: Monitor | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAnother?: (monitor: Monitor) => void;
}

export function MonitorSidePanel({
  monitor,
  isOpen,
  onClose,
  onSelectAnother,
}: MonitorSidePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !monitor) return null;

  // Front & Rear photos fallback
  const frontPhoto =
    monitor.frontImage ||
    monitor.thumbnail ||
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop";

  const rearPhoto =
    monitor.rearImage ||
    (monitor.gallery && monitor.gallery.length > 1 ? monitor.gallery[1] : null) ||
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop";

  const handleCopyLink = () => {
    const url = `${window.location.origin}/monitor/${monitor.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyDiscordText = () => {
    const targetPrice = monitor.recommendedPrice
      ? ` (Target Disarankan: ${formatRupiah(monitor.recommendedPrice)})`
      : "";
    const responseTime =
      monitor.responseTimeData?.toleranceNew ||
      monitor.specs.display.responseTime ||
      "-";
    const prosText =
      monitor.pros && monitor.pros.length > 0
        ? monitor.pros.slice(0, 2).join(", ")
        : "-";
    const detailUrl = `${window.location.origin}/monitor/${monitor.slug}`;

    const text = `[GRAYPLASMA] ${monitor.fullName} (${monitor.tier})
Kisaran Harga: ${formatRupiah(monitor.price)}${targetPrice}
Spesifikasi: ${monitor.specs.display.size} | ${monitor.specs.display.panelType} | ${monitor.specs.display.refreshRate}Hz | ${monitor.specs.display.resolution}
Response Time Lab GTID: ${responseTime}
Poin Utama: ${prosText}
Link Detail & Lab Data: ${detailUrl}`;

    navigator.clipboard.writeText(text);
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  const handleExportPoster = () => {
    const ogUrl = `/api/og/monitor?slug=${monitor.slug}&format=square`;
    window.open(ogUrl, "_blank");
  };

  const tokopediaLink = monitor.marketplaces?.find(
    (m) => m.marketplace === "Tokopedia"
  );
  const shopeeLink = monitor.marketplaces?.find(
    (m) => m.marketplace === "Shopee"
  );

  // Spec pills array for top header
  const specPills = [
    monitor.specs.display.size,
    monitor.specs.display.resolution,
    `${monitor.specs.display.refreshRate}Hz*`,
    monitor.panelBitDepth || "8 BITS",
    monitor.specs.ergonomics.vesaMount || "100×100 mm",
    monitor.specs.display.coatingType || monitor.coatingType || "Matte 3H",
  ];

  return (
    <>
      {/* Backdrop for all screens */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Side Panel Drawer Container (Overlay Drawer) */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 bg-gp-ink-900 text-gp-ink-100 border-l border-gp-ink-700 shadow-2xl transition-all duration-300 ease-out flex flex-col font-sans animate-in slide-in-from-right duration-300 ${
          isExpanded
            ? "w-full max-w-5xl"
            : "w-full sm:w-[580px] md:w-[640px] lg:w-[700px]"
        }`}
      >
        {/* Top Control Bar */}
        <div className="h-12 px-4 sm:px-6 border-b border-gp-ink-700 flex items-center justify-between bg-gp-ink-998 flex-shrink-0 text-xs text-gp-ink-300">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              title="Tutup (Esc)"
              className="p-1.5 rounded-lg hover:text-white hover:bg-gp-ink-700 transition-colors flex items-center gap-1 font-semibold"
            >
              <ChevronsRight className="w-4 h-4" />
              <span className="hidden sm:inline">Tutup</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Perkecil panel" : "Perlebar panel"}
              className="p-1.5 rounded-lg hover:text-white hover:bg-gp-ink-700 transition-colors hidden sm:flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Normal</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Lebarkan</span>
                </>
              )}
            </button>

            <a
              href={`/monitor/${monitor.slug}`}
              className="p-1.5 rounded-lg hover:text-white hover:bg-gp-ink-700 transition-colors flex items-center gap-1 text-2xs"
              title="Buka halaman penuh"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Halaman Penuh</span>
            </a>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportPoster}
              className="px-2 py-1 rounded-lg bg-gp-orange/15 border border-gp-orange/40 text-gp-orange hover:bg-gp-orange hover:text-black transition-all text-2xs font-bold flex items-center gap-1"
              title="Download poster ulasan infografis"
            >
              <Download className="w-3 h-3" />
              <span>Export Poster PNG</span>
            </button>

            <button
              onClick={handleCopyDiscordText}
              className="p-1.5 rounded-lg hover:text-white hover:bg-gp-ink-700 transition-colors flex items-center gap-1 text-2xs"
              title="Salin ringkasan format Discord"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>{copiedDiscord ? "Disalin!" : "Discord"}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg hover:text-white hover:bg-gp-ink-700 transition-colors flex items-center gap-1 text-2xs"
              title="Salin link monitor"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-gp-emerald" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Link OK" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Header Section: Title & Pill Badges */}
          <div className="space-y-3 pb-5 border-b border-gp-ink-700">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-gp-ink-300 bg-black/60 px-2.5 py-0.5 rounded border border-gp-ink-700">
                {monitor.brand}
              </span>
              <TierBadge tier={monitor.tier} />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {monitor.fullName}
            </h1>

            {/* Spec Pills Capsule Grid (Infographic Style) */}
            <div className="flex flex-wrap gap-2 pt-1">
              {specPills.map((pill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-gp-ink-100 border border-gp-ink-700 shadow-sm"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Front & Rear Visual Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <span className="text-3xs font-bold uppercase tracking-wider text-gp-ink-400">
                Tampak Depan (Panel)
              </span>
              <div className="relative aspect-[16/10] bg-black rounded-xl overflow-hidden border border-gp-ink-700">
                <Image
                  src={frontPhoto}
                  alt="Tampak Depan"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-3xs font-bold uppercase tracking-wider text-gp-ink-400">
                Tampak Belakang (Chassis & Stand)
              </span>
              <div className="relative aspect-[16/10] bg-black rounded-xl overflow-hidden border border-gp-ink-700">
                <Image
                  src={rearPhoto}
                  alt="Tampak Belakang"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Quick Price & Purchase CTAs */}
          <div className="p-4 rounded-2xl bg-gp-ink-850 border border-gp-ink-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-3xs uppercase font-bold tracking-wider text-gp-ink-400 block">
                Harga Termurah Saat Ini
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gp-emerald font-mono tabular-nums">
                  {formatRupiah(monitor.price)}
                </span>
                {monitor.recommendedPrice && (
                  <span className="text-xs text-gp-ink-300 font-mono">
                    (Target: {formatRupiah(monitor.recommendedPrice)})
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {tokopediaLink && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.open(tokopediaLink.url, "_blank")}
                  className="bg-brand-tokopedia hover:bg-emerald-600 text-white font-bold text-xs px-3"
                >
                  <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Tokopedia
                </Button>
              )}
              {shopeeLink && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.open(shopeeLink.url, "_blank")}
                  className="bg-brand-shopee hover:bg-orange-600 text-white font-bold text-xs px-3"
                >
                  <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Shopee
                </Button>
              )}
            </div>
          </div>

          {/* DATA PENGETESAN LAB GTID MATRIX */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gp-orange">
                <Zap className="w-4 h-4" />
                <span>DATA PENGETESAN LAB (DATA BY: GTID TECH)</span>
              </div>
              <span className="text-3xs font-mono text-gp-ink-400">Toleransi 5 RGB Standard</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gp-ink-700 bg-black/60">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-gp-ink-800/90 text-gp-ink-300 uppercase text-3xs font-sans font-bold border-b border-gp-ink-700">
                  <tr>
                    <th className="p-3">Parameter Uji</th>
                    <th className="p-3">Klaim Marketing</th>
                    <th className="p-3 text-gp-emerald">Hasil Sensor Lab</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gp-ink-800 text-gp-ink-200">
                  <tr>
                    <td className="p-3 font-sans font-semibold text-white">Response Time (GtG)</td>
                    <td className="p-3 text-gp-ink-400 line-through">0.5 ms / 1 ms MPRT</td>
                    <td className="p-3 text-gp-emerald font-bold">
                      {monitor.responseTimeData?.toleranceNew || "5.2 ms (Toleransi Baru)"}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-gp-emerald/20 text-gp-emerald text-3xs font-bold">
                        OPTIMAL
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-semibold text-white">Overshoot / Ghosting</td>
                    <td className="p-3 text-gp-ink-400">0%</td>
                    <td className="p-3 text-gp-amber font-bold">
                      {monitor.overshootData
                        ? `${monitor.overshootData.maxOvershootPercent}% (${monitor.overshootData.bestOverdriveMode})`
                        : "< 5% (Overdrive Level 3)"}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-gp-amber/20 text-gp-amber text-3xs font-bold">
                        TERKONTROL
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-semibold text-white">Kontras Rasio Asli</td>
                    <td className="p-3 text-gp-ink-400">1000 : 1</td>
                    <td className="p-3 text-gp-emerald font-bold">
                      {monitor.specs.display.contrastRatio || "1330 : 1 (Deeper Black)"}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-gp-emerald/20 text-gp-emerald text-3xs font-bold">
                        SOLID
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-semibold text-white">Color Gamut P3</td>
                    <td className="p-3 text-gp-ink-400">95% P3</td>
                    <td className="p-3 text-cyan-400 font-bold">
                      {monitor.specs.display.colorGamut || "100% P3 (dE < 4)"}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-3xs font-bold">
                        EXCELLENT
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-semibold text-white">Kecerahan (Nits)</td>
                    <td className="p-3 text-gp-ink-400">HDR 400</td>
                    <td className="p-3 text-rose-400 font-bold">
                      Min ~100 nits / Max ~270 nits
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-3xs font-bold">
                        DISARANKAN SDR
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PROS & CONS WITH VERTICAL COLOR RIBBONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PROS CARD */}
            <div className="relative overflow-hidden rounded-2xl bg-gp-mint-300 border border-gp-emerald/30 p-4 pr-9">
              <div className="absolute right-0 top-0 bottom-0 w-7 bg-gp-emerald flex items-center justify-center">
                <span className="vertical-ribbon text-3xs font-black text-black tracking-widest uppercase">
                  PROS ++++
                </span>
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-gp-emerald mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Kelebihan
              </h4>
              <ul className="space-y-1.5 text-xs text-gp-ink-200">
                {monitor.pros.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gp-emerald mt-1.5 flex-shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONS CARD */}
            <div className="relative overflow-hidden rounded-2xl bg-gp-coral-200 border border-gp-crimson/30 p-4 pr-9">
              <div className="absolute right-0 top-0 bottom-0 w-7 bg-gp-crimson flex items-center justify-center">
                <span className="vertical-ribbon text-3xs font-black text-white tracking-widest uppercase">
                  CONS ----
                </span>
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-gp-crimson mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Kekurangan
              </h4>
              <ul className="space-y-1.5 text-xs text-gp-ink-200">
                {monitor.cons.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gp-crimson mt-1.5 flex-shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* DARK TECHNICAL BLUEPRINT SHEET VERDICT (ANTI-FLASHBANG) */}
          <div className="rounded-2xl bg-blueprint-sheet border border-gp-ink-800 p-5 sm:p-6 relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-black text-white text-3xs font-black uppercase tracking-widest border border-gp-ink-600">
                KESIMPULAN & VERDICT LAB
              </span>
              <span className="text-3xs font-mono text-gp-ink-400">
                DATA UJI: GTID LAB | KURASI: @GRAY1PLASMA
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
              {monitor.expertVerdict}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gp-ink-700/80 text-2xs font-mono">
              <div>
                <span className="text-gp-ink-400 block text-3xs">SUBPIXEL</span>
                <span className="text-gp-ink-100 font-bold">
                  {monitor.specs.display.subpixelLayout || monitor.subpixelLayout || "RGB Stripe"}
                </span>
              </div>
              <div>
                <span className="text-gp-ink-400 block text-3xs">COATING</span>
                <span className="text-gp-ink-100 font-bold">
                  {monitor.specs.display.coatingType || monitor.coatingType || "Matte 3H"}
                </span>
              </div>
              <div>
                <span className="text-gp-ink-400 block text-3xs">VRR / LFC</span>
                <span className="text-gp-ink-100 font-bold">
                  {monitor.specs.features.syncTech || "FreeSync Premium"}
                </span>
              </div>
              <div>
                <span className="text-gp-ink-400 block text-3xs">GARANSI</span>
                <span className="text-gp-emerald font-bold">
                  {monitor.specs.features.warranty || "3 Tahun Resmi"}
                </span>
              </div>
            </div>
          </div>

          {/* Custom Modular Variables & Additional Columns */}
          {monitor.customVariables && monitor.customVariables.length > 0 && (
            <div className="rounded-2xl bg-gp-ink-800/60 border border-gp-ink-700 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-3xs font-black uppercase tracking-widest border border-amber-500/30">
                  PARAMETER & VARIABEL TAMBAHAN
                </span>
                <span className="text-3xs font-mono text-gp-ink-400">
                  {monitor.customVariables.length} PARAMETER
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {monitor.customVariables.map((v) => (
                  <div
                    key={v.id}
                    className="flex justify-between items-center bg-black/40 border border-gp-ink-700 px-3 py-2 rounded-xl"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {v.category && (
                        <span className="text-4xs font-mono font-bold text-amber-400 uppercase bg-gp-ink-700 px-1.5 py-0.5 rounded">
                          {v.category}
                        </span>
                      )}
                      <span className="text-gp-ink-300 font-medium truncate">{v.label}</span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold ml-2 flex-shrink-0">
                      {v.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
