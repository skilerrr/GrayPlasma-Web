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
} from "lucide-react";
import { Monitor, AdditionalStoreLink } from "@/types/monitor";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";
import { YouTubeEmbed } from "@/components/youtube-embed";
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
    const targetPrice = monitor.recommendedPrice ? ` (Target: ${formatRupiah(monitor.recommendedPrice)})` : "";
    const responseTime = monitor.responseTimeData?.toleranceNew || monitor.specs.display.responseTime || "-";
    const prosText = monitor.pros && monitor.pros.length > 0 ? monitor.pros.slice(0, 2).join(", ") : "-";
    const detailUrl = `${window.location.origin}/monitor/${monitor.slug}`;

    const text = `[GRAYPLASMA] ${monitor.fullName} (${monitor.tier})
Kisaran Harga: ${formatRupiah(monitor.price)}${targetPrice}
Spesifikasi: ${monitor.specs.display.size} | ${monitor.specs.display.panelType} | ${monitor.specs.display.refreshRate}Hz | ${monitor.specs.display.resolution}
Response Time: ${responseTime}
Poin Utama: ${prosText}
Link Detail: ${detailUrl}`;

    navigator.clipboard.writeText(text);
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  const tokopediaLink = monitor.marketplaces?.find((m) => m.marketplace === "Tokopedia");
  const shopeeLink = monitor.marketplaces?.find((m) => m.marketplace === "Shopee");

  const responseTolerances = [
    monitor.responseTimeData?.toleranceNew || "Toleransi Baru",
    monitor.responseTimeData?.toleranceOld || "Toleransi Lama",
  ].filter(Boolean);

  return (
    <>
      {/* Backdrop for Mobile */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Side Panel Drawer Container (Notion Side-Peek Layout) */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 bg-[#191919] text-[#d4d4d4] border-l border-[#2f2f2f] shadow-2xl transition-all duration-300 ease-out flex flex-col font-sans ${
          isExpanded
            ? "w-full max-w-5xl"
            : "w-full sm:w-[600px] md:w-[680px] lg:w-[620px] xl:w-[680px]"
        }`}
      >
        {/* Top Notion Control Bar */}
        <div className="h-12 px-4 sm:px-6 border-b border-[#2a2a2a] flex items-center justify-between bg-[#191919] flex-shrink-0 text-xs text-[#9b9a97]">
          {/* Left Action Buttons: Collapse >>, Expand, Open Full Page */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              title="Tutup (Esc)"
              className="p-1.5 rounded hover:text-white hover:bg-[#252525] transition-colors flex items-center gap-1 font-semibold"
            >
              <ChevronsRight className="w-4 h-4" />
              <span className="hidden sm:inline">Tutup</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Perkecil panel" : "Perlebar panel"}
              className="p-1.5 rounded hover:text-white hover:bg-[#252525] transition-colors hidden sm:flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Normal</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Lebar</span>
                </>
              )}
            </button>

            <a
              href={`/monitor/${monitor.slug}`}
              className="p-1.5 rounded hover:text-white hover:bg-[#252525] transition-colors flex items-center gap-1"
              title="Buka Halaman Penuh"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Full Page</span>
            </a>
          </div>

          {/* Right Action Buttons: Copy Link & Discord Callback */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDiscordText}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 border ${
                copiedDiscord
                  ? "bg-[#203c2b] text-[#52ba69] border-[#52ba69]/40"
                  : "bg-[#252525] border-[#333333] text-[#d4d4d4] hover:text-white hover:bg-[#2c2c2c]"
              }`}
            >
              {copiedDiscord ? <Check className="w-3.5 h-3.5 text-[#52ba69]" /> : <Copy className="w-3.5 h-3.5 text-[#58a6ff]" />}
              <span className="hidden sm:inline">{copiedDiscord ? "Tersalin!" : "Copy Details"}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded bg-[#252525] border border-[#333333] hover:text-white hover:bg-[#2c2c2c] transition-colors"
              title="Salin Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#52ba69]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
          {/* Header Title & Icon */}
          <div className="space-y-2">
            <div className="text-3xl">🖥️</div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {monitor.fullName}
            </h1>
          </div>

          {/* ========================================================================= */}
          {/* NOTION PROPERTY TABLE (EXACT MATCH TO USER SCREENSHOT)                    */}
          {/* ========================================================================= */}
          <div className="space-y-2 text-xs border-y border-[#2a2a2a] py-3 text-[#9b9a97]">
            {/* 1. Data Response Time */}
            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-4 text-[#787774] font-medium">Data Response Time</span>
              <div className="col-span-8 flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#203c2b] text-[#52ba69] font-medium text-[11px]">
                  Toleransi Baru
                </span>
                <span className="px-2 py-0.5 rounded bg-[#442224] text-[#eb5757] font-medium text-[11px]">
                  Toleransi Lama
                </span>
              </div>
            </div>

            {/* 2. Date Created */}
            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-4 text-[#787774] font-medium">Date Created</span>
              <span className="col-span-8 text-[#d4d4d4] font-mono text-[11px]">
                {monitor.createdAt || "February 24, 2025 12:24"}
              </span>
            </div>

            {/* 3. LINK TIKTOKSHOP */}
            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-4 text-[#787774] font-medium">LINK TIKTOKSHOP</span>
              <span className="col-span-8 text-[#787774] italic text-[11px]">Empty</span>
            </div>

            {/* 4. Last Updated */}
            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-4 text-[#787774] font-medium">Last Updated</span>
              <span className="col-span-8 text-[#d4d4d4] font-mono text-[11px]">
                June 24, 2025
              </span>
            </div>

            {/* 5. Link Shopee */}
            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-4 text-[#787774] font-medium">Link Shopee</span>
              <div className="col-span-8">
                {shopeeLink ? (
                  <a
                    href={shopeeLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#58a6ff] hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                  >
                    <span>{shopeeLink.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[#787774] italic text-[11px]">Empty</span>
                )}
              </div>
            </div>

            {/* 6. LINK TOKOPEDIA */}
            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-4 text-[#787774] font-medium">LINK TOKOPEDIA</span>
              <div className="col-span-8">
                {tokopediaLink ? (
                  <a
                    href={tokopediaLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#58a6ff] hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                  >
                    <span>{tokopediaLink.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[#787774] italic text-[11px]">Empty</span>
                )}
              </div>
            </div>

            {/* 7. STATUS */}
            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-4 text-[#787774] font-medium">STATUS</span>
              <div className="col-span-8">
                <span className="px-2 py-0.5 rounded bg-[#203c2b] text-[#52ba69] font-bold text-[11px]">
                  {monitor.tier}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION FOTO MONITOR: SIDE-BY-SIDE FRONT & REAR PHOTO GALLERY             */}
          {/* ========================================================================= */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] text-[#787774] uppercase tracking-wider font-semibold">
              <span>Section Foto Monitor (Tampak Depan & Belakang)</span>
              <span className="text-[10px] text-[#58a6ff]">2 Sudut Foto</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Photo 1: Front Angle with Screen Wallpaper */}
              <div
                className="group relative aspect-[4/3] rounded-xl bg-[#202020] border border-[#2f2f2f] hover:border-[#3f3f3f] overflow-hidden transition-all cursor-pointer shadow-sm"
                onClick={() => setSelectedPhoto(frontPhoto)}
              >
                <Image
                  src={frontPhoto}
                  alt={`${monitor.fullName} - Tampak Depan`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  Depan
                </div>
              </div>

              {/* Photo 2: Rear Chassis Angle with Stand */}
              <div
                className="group relative aspect-[4/3] rounded-xl bg-[#202020] border border-[#2f2f2f] hover:border-[#3f3f3f] overflow-hidden transition-all cursor-pointer shadow-sm"
                onClick={() => setSelectedPhoto(rearPhoto)}
              >
                <Image
                  src={rearPhoto}
                  alt={`${monitor.fullName} - Tampak Belakang`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  Belakang
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VERDICT / WARNING SUBTITLE                                                */}
          {/* ========================================================================= */}
          {monitor.statusReason ? (
            <div className="p-3.5 rounded-xl bg-[#371e20] border border-[#492224] text-[#eb5757] font-bold text-xs uppercase tracking-wide">
              {monitor.statusReason}
            </div>
          ) : monitor.tier === "PASS" ? (
            <div className="p-3.5 rounded-xl bg-[#371e20] border border-[#492224] text-[#eb5757] font-bold text-xs uppercase tracking-wide">
              TIDAK DISARANKAN LAGI KARENA BANYAK KASUS BERGARIS + DISCONTINUE
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-[#193222] border border-[#203c2b] text-[#52ba69] font-bold text-xs uppercase tracking-wide">
              REKOMENDASI TERBAIK KELAS {monitor.specs.display.resolution} {monitor.specs.display.refreshRate}Hz
            </div>
          )}

          {/* ========================================================================= */}
          {/* PENDAHULUAN & REVIEW NARRATIVE                                            */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-1">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Pendahuluan
            </h2>

            <p className="text-xs sm:text-sm text-[#d4d4d4] leading-relaxed">
              {monitor.introduction ||
                monitor.deepDiveDescription ||
                `${monitor.fullName} merupakan monitor ${monitor.specs.display.size}, ${monitor.specs.display.panelType} ${monitor.specs.display.refreshRate}Hz yang sangat kompetitif di kisaran harga ${formatRupiah(monitor.price)} di pasar Indonesia. Memiliki tuning overdrive yang matang dari pengujian laboratorium GTID Tech.`}
            </p>

            {/* YouTube Embed Card with On-Click Player */}
            <div className="pt-2">
              <YouTubeEmbed
                url={monitor.gtidReviewUrl}
                title={`Review & Ulasan Pengujian GTID: ${monitor.fullName}`}
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PROS & CONS (NOTION BANNER BARS)                                          */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-2">
            {/* PROS */}
            <div className="space-y-2">
              <div className="w-full py-1.5 px-3 rounded bg-[#193222] border border-[#203c2b] text-[#52ba69] font-bold text-xs tracking-wider uppercase">
                PROS
              </div>
              <ul className="space-y-1.5 pl-2 text-xs text-[#d4d4d4]">
                {monitor.pros.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#52ba69] mt-0.5">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONS */}
            <div className="space-y-2 pt-2">
              <div className="w-full py-1.5 px-3 rounded bg-[#371e20] border border-[#492224] text-[#eb5757] font-bold text-xs tracking-wider uppercase">
                CONS
              </div>
              <ul className="space-y-1.5 pl-2 text-xs text-[#d4d4d4]">
                {monitor.cons.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#eb5757] mt-0.5">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* KELENGKAPAN BOX & ACCESSORIES                                             */}
          {/* ========================================================================= */}
          {monitor.accessoriesIncluded && monitor.accessoriesIncluded.length > 0 && (
            <div className="p-4 rounded-xl bg-[#202020] border border-[#2f2f2f] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white font-bold">
                <Package className="w-4 h-4 text-[#58a6ff]" />
                <span>Kelengkapan Dalam Dus:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[#b4b4b4]">
                {monitor.accessoriesIncluded.map((acc, i) => (
                  <li key={i}>{acc}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Specifications Toggle */}
          <details className="group border border-[#2a2a2a] rounded-xl p-4 bg-[#202020] text-xs">
            <summary className="font-bold text-white cursor-pointer flex items-center justify-between">
              <span>📋 Spesifikasi Teknis Lengkap</span>
              <ChevronDown className="w-4 h-4 text-[#9b9a97] group-open:rotate-180 transition-transform" />
            </summary>
            <div className="grid grid-cols-2 gap-2.5 pt-4 text-xs text-[#d4d4d4]">
              <div className="p-2.5 rounded bg-[#191919] border border-[#2a2a2a]">
                <strong className="text-[#9b9a97] block text-[10px] uppercase">Ukuran Layar:</strong>
                <span className="font-semibold text-white">{monitor.specs.display.size}</span>
              </div>
              <div className="p-2.5 rounded bg-[#191919] border border-[#2a2a2a]">
                <strong className="text-[#9b9a97] block text-[10px] uppercase">Resolusi:</strong>
                <span className="font-semibold text-white">{monitor.specs.display.resolution}</span>
              </div>
              <div className="p-2.5 rounded bg-[#191919] border border-[#2a2a2a]">
                <strong className="text-[#9b9a97] block text-[10px] uppercase">Tipe Panel:</strong>
                <span className="font-semibold text-white">{monitor.specs.display.panelType}</span>
              </div>
              <div className="p-2.5 rounded bg-[#191919] border border-[#2a2a2a]">
                <strong className="text-[#9b9a97] block text-[10px] uppercase">Refresh Rate:</strong>
                <span className="font-semibold text-white">{monitor.specs.display.refreshRate}Hz</span>
              </div>
              <div className="p-2.5 rounded bg-[#191919] border border-[#2a2a2a]">
                <strong className="text-[#9b9a97] block text-[10px] uppercase">VESA Mount:</strong>
                <span className="font-semibold text-white">{monitor.specs.ergonomics.vesaMount}</span>
              </div>
              <div className="p-2.5 rounded bg-[#191919] border border-[#2a2a2a]">
                <strong className="text-[#9b9a97] block text-[10px] uppercase">Garansi Brand:</strong>
                <span className="font-semibold text-white">{monitor.specs.features.warranty}</span>
              </div>
            </div>
          </details>
        </div>
      </aside>

      {/* Lightbox Photo Preview Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-[600px]">
            <Image
              src={selectedPhoto}
              alt="Preview Full Photo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
