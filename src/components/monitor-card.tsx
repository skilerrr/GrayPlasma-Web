"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  ChevronDown,
  ShoppingBag,
  Info,
  Scale,
} from "lucide-react";
import { Monitor, MarketplaceLink } from "@/types/monitor";
import { TierBadge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";

interface MonitorCardProps {
  monitor: Monitor;
  onSelectMonitor: (monitor: Monitor) => void;
  onCompareToggle?: (monitor: Monitor) => void;
  isCompared?: boolean;
}

function cleanScreenSize(sizeStr?: string): string {
  if (!sizeStr) return "";
  const s = sizeStr.toUpperCase();
  if (s.includes("24.5") || s.includes("25")) return "24.5\"";
  if (s.includes("23.8") || s.includes("24")) return "23.8\"";
  if (s.includes("27")) return "27\"";
  if (s.includes("31.5") || s.includes("32")) return "32\"";
  if (s.includes("34")) return "34\"";
  if (s.includes("49")) return "49\"";
  return sizeStr.replace(/inch|inci/gi, "\"").trim();
}

function cleanResolution(resStr?: string): string {
  if (!resStr) return "";
  const r = resStr.toUpperCase();
  if (r.includes("1920") || r.includes("1080") || r.includes("FHD")) return "1080p FHD";
  if (r.includes("2560") || r.includes("1440") || r.includes("2K") || r.includes("QHD")) return "1440p 2K";
  if (r.includes("3840") || r.includes("2160") || r.includes("4K") || r.includes("UHD")) return "4K UHD";
  return resStr;
}

function cleanPanelType(panelStr?: string): string {
  if (!panelStr) return "";
  const p = panelStr.toUpperCase();
  if (p.includes("FAST IPS")) return "Fast IPS";
  if (p.includes("QD-OLED") || p.includes("QD OLED")) return "QD-OLED";
  if (p.includes("WOLED")) return "WOLED";
  if (p.includes("OLED")) return "OLED";
  if (p.includes("FAST VA") || p.includes("RAPID VA")) return "Fast VA";
  if (p.includes("VA")) return "VA";
  if (p.includes("IPS")) return "IPS";
  if (p.includes("TN")) return "TN";
  return panelStr;
}

export function MonitorCard({
  monitor,
  onSelectMonitor,
  onCompareToggle,
  isCompared = false,
}: MonitorCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Find lowest price marketplace or default first
  const sortedMarketplaces = [...(monitor.marketplaces || [])].sort(
    (a, b) => a.price - b.price
  );
  const bestDeal = sortedMarketplaces[0];

  const handleMarketplaceClick = (e: React.MouseEvent, link: MarketplaceLink) => {
    e.stopPropagation();
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCompareToggle) {
      onCompareToggle(monitor);
    }
  };

  // Clean, normalized spec chips without messy database text
  const size = cleanScreenSize(monitor.specs.display.size);
  const resolution = cleanResolution(monitor.specs.display.resolution);
  const refreshRate = `${monitor.specs.display.refreshRate}Hz`;
  const panel = cleanPanelType(monitor.specs.display.panelType);

  const specChips = [size, resolution, refreshRate, panel].filter(Boolean);

  return (
    <div
      onClick={() => onSelectMonitor(monitor)}
      className={`group relative bg-gp-ink-900 hover:bg-gp-ink-850 border transition-all duration-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:border-gp-ink-600 hover:-translate-y-0.5 ${
        isCompared
          ? "border-emerald-500/70 ring-1 ring-emerald-500/30"
          : "border-gp-ink-700/80"
      }`}
    >
      <div>
        {/* Top Header: Brand, Tier Badge & Compare Pin */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xs font-bold tracking-wider text-gp-ink-300 uppercase truncate">
              {monitor.brand}
            </span>
            <TierBadge tier={monitor.tier} />
          </div>

          {/* VS Pin Comparator Button */}
          {onCompareToggle && (
            <button
              type="button"
              onClick={handleCompareClick}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-medium transition-all shrink-0 ${
                isCompared
                  ? "bg-emerald-500 text-gp-ink-950 font-bold shadow-sm"
                  : "text-gp-ink-300 hover:text-gp-ink-100 bg-gp-ink-800/60 hover:bg-gp-ink-700 border border-gp-ink-700"
              }`}
              title={isCompared ? "Hapus dari komparasi" : "Bandingkan monitor ini"}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? "Terpilih" : "+VS"}</span>
            </button>
          )}
        </div>

        {/* Product Image Thumbnail - Clean framing without distracting corner clutter */}
        <div className="relative w-full aspect-[16/10] mb-3 bg-gp-ink-998 rounded-xl overflow-hidden border border-gp-ink-700/70 group-hover:border-gp-ink-600/70 transition-all flex items-center justify-center">
          <Image
            src={monitor.thumbnail}
            alt={monitor.fullName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />

          {/* Clean hover quick view */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gp-ink-800/90 border border-gp-ink-600/80 text-xs font-medium text-white shadow-lg">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lihat Spesifikasi</span>
            </span>
          </div>
        </div>

        {/* Monitor Name */}
        <div className="mb-2">
          <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
            {monitor.fullName}
          </h3>
        </div>

        {/* Clean Spec Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {specChips.map((chip, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-2xs font-medium text-gp-ink-200 bg-gp-ink-700/50 border border-gp-ink-700/80"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Price & Action Section */}
      <div className="pt-3 border-t border-gp-ink-700/70 flex flex-col gap-2.5 mt-auto">
        {/* Price Row */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xs text-gp-ink-400 font-medium block leading-none mb-1">
              Harga Terbaik
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight tabular-nums">
                {formatRupiah(monitor.price)}
              </span>
              {monitor.originalPrice && monitor.originalPrice > monitor.price && (
                <span className="text-xs text-gp-ink-400 line-through tabular-nums">
                  {formatRupiah(monitor.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="relative flex items-center gap-1.5">
          <a
            href={`/monitor/${monitor.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-gp-ink-800 border border-gp-ink-700 hover:border-gp-ink-600 text-gp-ink-300 hover:text-white transition-colors shrink-0"
            title="Buka Halaman Detail"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {bestDeal ? (
            <button
              type="button"
              onClick={(e) => handleMarketplaceClick(e, bestDeal)}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 px-3 font-semibold rounded-lg bg-orange-500 hover:bg-orange-400 text-gp-ink-950 transition-all shadow-sm active:translate-y-[1px]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Beli di {bestDeal.marketplace}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSelectMonitor(monitor)}
              className="flex-1 text-xs py-2 px-3 font-semibold rounded-lg bg-gp-ink-700 hover:bg-gp-ink-600 text-gp-ink-100 transition-colors"
            >
              Lihat Opsi Toko
            </button>
          )}

          {/* Multiple Marketplace Options Dropdown Toggle */}
          {monitor.marketplaces && monitor.marketplaces.length > 1 && (
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="h-8 w-8 rounded-lg bg-gp-ink-800 border border-gp-ink-700 hover:border-gp-ink-600 text-gp-ink-300 hover:text-white flex items-center justify-center transition-colors"
                title="Pilihan Marketplace Lain"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 bottom-full mb-2 w-60 bg-gp-ink-850 border border-gp-ink-700 rounded-xl p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-3xs font-semibold text-gp-ink-300 px-2.5 py-1 uppercase tracking-wider border-b border-gp-ink-700/80 mb-1">
                    Pilihan Toko
                  </div>
                  {sortedMarketplaces.map((link, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        handleMarketplaceClick(e, link);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-gp-ink-700/70 transition-colors flex items-center justify-between group/item"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white group-hover/item:text-emerald-400 flex items-center gap-1">
                          {link.marketplace}
                          {link.officialStore && (
                            <span className="text-4xs px-1 rounded bg-emerald-500/20 text-emerald-400 font-normal">
                              Official
                            </span>
                          )}
                        </span>
                        <span className="text-3xs text-gp-ink-400 truncate max-w-[120px]">
                          {link.storeName}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gp-ink-200 tabular-nums">
                        {formatRupiah(link.price)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
