"use client";

import React from "react";
import { ShoppingBag, ExternalLink, ShieldCheck, Tag } from "lucide-react";
import { PeripheralItem } from "@/data/grayplasma-desk-peripherals";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PeripheralCardProps {
  item: PeripheralItem;
  onSelectItem?: (item: PeripheralItem) => void;
}

export function PeripheralCard({ item, onSelectItem }: PeripheralCardProps) {
  const specPills = [
    item.brand,
    item.type,
    item.warranty ? `Garansi: ${item.warranty}` : null,
    item.versionDetail ? `Tipe: ${item.versionDetail}` : null,
    item.recommendedFor ? `Untuk: ${item.recommendedFor}` : null,
  ].filter(Boolean);

  const purchaseUrl = item.shopeeUrl || item.tokopediaUrl || item.tiktokUrl;
  const storePlatform = item.shopeeUrl
    ? "Shopee"
    : item.tokopediaUrl
    ? "Tokopedia"
    : item.tiktokUrl
    ? "TikTok Shop"
    : "Online Store";

  return (
    <div
      onClick={() => {
        if (onSelectItem) onSelectItem(item);
      }}
      className="group relative bg-gp-ink-900 hover:bg-gp-ink-850 border border-gp-ink-700 hover:border-gp-ink-600 transition-all duration-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer shadow-tech-card hover:-translate-y-0.5"
    >
      {/* Top Header: Brand & Category Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-2xs font-bold tracking-wider text-gp-ink-200 uppercase bg-gp-ink-800 px-2.5 py-0.5 rounded-full border border-gp-ink-700">
          {item.category}
        </span>

        {item.brand && (
          <span className="text-2xs font-medium text-gp-ink-300 bg-gp-ink-950 px-2.5 py-0.5 rounded-full border border-gp-ink-700 uppercase tracking-wider">
            {item.brand}
          </span>
        )}
      </div>

      {/* Item Title */}
      <div className="mb-2.5">
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug tracking-tight">
          {item.name}
        </h3>
        {item.verdict && (
          <p className="text-xs text-gp-ink-300 line-clamp-2 mt-1 leading-relaxed">
            {item.verdict}
          </p>
        )}
      </div>

      {/* Spec Pills Row */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {specPills.map((spec, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 rounded-md text-2xs font-medium text-gp-ink-200 bg-gp-ink-700/50 border border-gp-ink-700/80"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Price & Action Section */}
      <div className="pt-2.5 border-t border-gp-ink-700/70 flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xs text-gp-ink-400 font-medium block leading-none mb-1">
              Harga Terbaik
            </span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight tabular-nums">
              {item.price > 0 ? formatRupiah(item.price) : "Cek Marketplace"}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-1.5">
          {purchaseUrl ? (
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(purchaseUrl, "_blank", "noopener,noreferrer");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 font-semibold text-gp-ink-950 rounded-lg transition-all ${
                storePlatform === "Shopee"
                  ? "bg-orange-500 hover:bg-orange-400 text-gp-ink-950"
                  : storePlatform === "Tokopedia"
                  ? "bg-emerald-500 hover:bg-emerald-400 text-gp-ink-950"
                  : "bg-gp-ink-700 hover:bg-gp-ink-600 text-white"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Beli di {storePlatform}</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="flex-1 text-xs font-mono uppercase tracking-wider bg-gp-ink-800 text-gp-ink-300 border border-gp-ink-700 rounded-md"
            >
              [ CEK DETAIL ]
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
