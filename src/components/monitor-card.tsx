"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  ChevronDown,
  ShoppingBag,
  Info,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  Scale,
  Sparkles,
} from "lucide-react";
import { Monitor, MarketplaceLink } from "@/types/monitor";
import { TierBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";

interface MonitorCardProps {
  monitor: Monitor;
  onSelectMonitor: (monitor: Monitor) => void;
  onCompareToggle?: (monitor: Monitor) => void;
  isCompared?: boolean;
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

  // Structured spec pills derived from monitor data or fallback
  const specPills = [
    monitor.specs.display.size,
    monitor.specs.display.resolution,
    `${monitor.specs.display.refreshRate}Hz`,
    monitor.specs.display.panelType,
    monitor.specs.display.coatingType || monitor.coatingType || null,
  ].filter(Boolean);

  return (
    <div
      onClick={() => onSelectMonitor(monitor)}
      className={`group relative bg-[#09090d] hover:bg-[#0e0e14] border-2 transition-all duration-200 rounded-lg p-4 sm:p-5 flex flex-col justify-between cursor-pointer shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_rgba(0,230,118,0.35)] hover:-translate-y-0.5 ${
        isCompared
          ? "border-emerald-400 shadow-[0_0_20px_rgba(0,230,118,0.2)] ring-1 ring-emerald-500/50"
          : "border-zinc-800 hover:border-emerald-500/80"
      }`}
    >
      {/* Top Header: Brand, Tier Badge & VS Comparator Pin Button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-300 uppercase bg-black px-2 py-0.5 rounded border border-zinc-700 shadow-[1px_1px_0px_#000]">
            [ {monitor.brand} ]
          </span>
          <TierBadge tier={monitor.tier} />
        </div>

        {/* VS Pin Comparator Button */}
        {onCompareToggle && (
          <button
            type="button"
            onClick={handleCompareClick}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all shadow-[1px_1px_0px_#000] ${
              isCompared
                ? "bg-emerald-400 text-black font-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500"
            }`}
            title={isCompared ? "Hapus dari komparasi" : "Pin untuk bandingkan"}
          >
            <Scale className="w-3 h-3" />
            <span>{isCompared ? "[PINNED]" : "[+VS]"}</span>
          </button>
        )}
      </div>

      {/* Product Image Thumbnail with Tech Grid Ambient */}
      <div className="relative w-full aspect-[16/10] mb-3.5 bg-black rounded-md overflow-hidden border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
        <Image
          src={monitor.thumbnail}
          alt={monitor.fullName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Ambient Dark Gradient on bottom of thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-600 text-xs font-mono font-bold text-white shadow-[2px_2px_0px_#000]">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>[ QUICK_VIEW_SPEK ]</span>
          </span>
        </div>

        {/* Refresh rate tag badge in bottom-left corner */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-black/90 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded shadow-[1px_1px_0px_#000]">
            <Zap className="w-2.5 h-2.5" />
            {monitor.specs.display.refreshRate}Hz
          </span>
        </div>

        {/* Deeper Black / Contrast ratio tag if high contrast */}
        {monitor.specs.display.contrastRatio && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-black/90 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded shadow-[1px_1px_0px_#000]">
              {monitor.specs.display.contrastRatio}
            </span>
          </div>
        )}
      </div>

      {/* Monitor Name */}
      <div className="mb-2.5">
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug tracking-tight">
          {monitor.fullName}
        </h3>
      </div>

      {/* Spec Pills Row */}
      <div className="flex flex-wrap gap-1 mb-3">
        {specPills.map((spec, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-black/60 text-zinc-300 border border-zinc-800 group-hover:border-zinc-700 transition-colors"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Price & Action Section */}
      <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
        {/* Lowest Price Tag */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-zinc-500 block">
              // HARGA_TERMURAH
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-white tracking-tight tabular-nums font-mono">
                {formatRupiah(monitor.price)}
              </span>
              {monitor.originalPrice && monitor.originalPrice > monitor.price && (
                <span className="text-xs text-zinc-500 line-through tabular-nums font-mono">
                  {formatRupiah(monitor.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Marketplace CTA Actions */}
        <div className="relative flex items-center gap-1.5">
          <a
            href={`/monitor/${monitor.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white transition-colors shadow-[1px_1px_0px_#000]"
            title="Buka Detail Monitor"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {bestDeal ? (
            <Button
              variant="cyber"
              size="sm"
              onClick={(e) => handleMarketplaceClick(e, bestDeal)}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 font-mono font-bold group/btn bg-emerald-500 text-black hover:bg-emerald-400 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>BELI DI {bestDeal.marketplace.toUpperCase()}</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="flex-1 text-xs font-semibold"
            >
              Lihat Opsi Toko
            </Button>
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
                className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                title="Pilih Marketplace Lain"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 bottom-full mb-2 w-60 bg-surface-dark border border-zinc-800 rounded-xl p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-[10px] font-bold text-zinc-400 px-2.5 py-1 uppercase tracking-wider border-b border-zinc-800/80 mb-1">
                    Pilihan Toko & Marketplace
                  </div>
                  {sortedMarketplaces.map((link, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        handleMarketplaceClick(e, link);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-zinc-900 transition-colors flex items-center justify-between group/item"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white group-hover/item:text-gp-emerald flex items-center gap-1">
                          {link.marketplace}
                          {link.officialStore && (
                            <span className="text-[9px] px-1 rounded bg-gp-emerald/20 text-gp-emerald font-normal">
                              Official
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                          {link.storeName}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-300 tabular-nums">
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
