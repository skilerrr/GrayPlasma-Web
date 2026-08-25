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
} from "lucide-react";
import { Monitor, MarketplaceLink } from "@/types/monitor";
import { TierBadge, Badge } from "@/components/ui/badge";
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
  const sortedMarketplaces = [...monitor.marketplaces].sort(
    (a, b) => a.price - b.price
  );
  const bestDeal = sortedMarketplaces[0];

  const handleMarketplaceClick = (e: React.MouseEvent, link: MarketplaceLink) => {
    e.stopPropagation();
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={() => onSelectMonitor(monitor)}
      className="group relative bg-surface-dark/95 hover:bg-surface-elevated border border-zinc-800/80 hover:border-zinc-700/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-card-hover cursor-pointer"
    >
      {/* Top Header: Brand & Tier Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-extrabold tracking-widest text-zinc-400 uppercase bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800">
          {monitor.brand}
        </span>
        <TierBadge tier={monitor.tier} />
      </div>

      {/* Product Image Thumbnail */}
      <div className="relative w-full aspect-[16/10] mb-4 bg-zinc-950/80 rounded-xl overflow-hidden border border-zinc-900 flex items-center justify-center group-hover:border-zinc-800 transition-colors">
        <Image
          src={monitor.thumbnail}
          alt={monitor.fullName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Ambient Dark Gradient on bottom of thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700 text-xs font-semibold text-white shadow-lg">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            Quick View Spek
          </span>
        </div>

        {/* Refresh rate tag badge in corner of image */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-black/80 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
            <Zap className="w-2.5 h-2.5" />
            {monitor.specs.display.refreshRate}Hz
          </span>
        </div>
      </div>

      {/* Monitor Name */}
      <div className="mb-3">
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
          {monitor.fullName}
        </h3>
      </div>

      {/* Quick Specs Pills Row */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {monitor.quickSpecs.map((spec, idx) => (
          <Badge key={idx} variant="spec">
            {spec}
          </Badge>
        ))}
      </div>

      {/* Expert Short Verdict Box */}
      <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-2.5 sm:p-3 mb-4">
        <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          <span>Verdict Reviewer</span>
        </div>
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {monitor.expertVerdict}
        </p>
      </div>

      {/* Price & Action Section */}
      <div className="pt-3 border-t border-zinc-900/90 flex flex-col gap-2.5">
        {/* Lowest Price Tag */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 block">
              Harga Termurah
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-white tracking-tight">
                {formatRupiah(monitor.price)}
              </span>
              {monitor.originalPrice && monitor.originalPrice > monitor.price && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatRupiah(monitor.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {bestDeal?.storeName && (
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {bestDeal.storeName}
            </span>
          )}
        </div>

        {/* Marketplace CTA Actions */}
        <div className="relative flex items-center gap-2">
          <a
            href={`/monitor/${monitor.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
            title="Buka Halaman Produk"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {bestDeal ? (
            <Button
              variant="cyber"
              size="sm"
              onClick={(e) => handleMarketplaceClick(e, bestDeal)}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 font-bold group/btn"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Beli di {bestDeal.marketplace}</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="flex-1 text-xs"
            >
              Lihat Opsi Toko
            </Button>
          )}

          {/* Multiple Marketplace Options Dropdown Toggle */}
          {monitor.marketplaces.length > 1 && (
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
                  className="absolute right-0 bottom-full mb-2 w-56 bg-surface-dark border border-zinc-800 rounded-xl p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150"
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
                        <span className="text-xs font-semibold text-white group-hover/item:text-emerald-400 flex items-center gap-1">
                          {link.marketplace}
                          {link.officialStore && (
                            <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-400 font-normal">
                              Official
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                          {link.storeName}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-300">
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
