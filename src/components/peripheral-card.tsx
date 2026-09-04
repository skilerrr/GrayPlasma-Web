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
      className="group relative bg-[#0c0c10] hover:bg-[#111116] border-2 border-zinc-800 hover:border-blue-500/80 transition-all duration-200 rounded-lg p-4 sm:p-5 flex flex-col justify-between cursor-pointer shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_rgba(59,130,246,0.35)] hover:-translate-y-0.5"
    >
      {/* Top Header: Brand & Category Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/40">
          [ {item.category} ]
        </span>

        {item.brand && (
          <span className="text-[10px] font-mono font-semibold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-wider">
            {item.brand}
          </span>
        )}
      </div>

      {/* Item Title */}
      <div className="mb-2.5">
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug tracking-tight">
          {item.name}
        </h3>
        {item.verdict && (
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {item.verdict}
          </p>
        )}
      </div>

      {/* Spec Pills Row */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {specPills.map((spec, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-black/60 text-zinc-300 border border-zinc-800 group-hover:border-zinc-700 transition-colors"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Price & Action Section */}
      <div className="pt-2.5 border-t border-zinc-800 flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[9px] uppercase font-mono font-semibold tracking-wider text-zinc-500 block">
              // HARGA_TERMURAH
            </span>
            <span className="text-base sm:text-lg font-black text-white tracking-tight tabular-nums font-mono">
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
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 font-bold text-white rounded-md border shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all uppercase tracking-wider font-mono ${
                storePlatform === "Shopee"
                  ? "bg-[#ee4d2d] hover:bg-[#d43d1f] border-orange-600"
                  : storePlatform === "Tokopedia"
                  ? "bg-[#00aa5b] hover:bg-[#008f4c] border-emerald-600"
                  : "bg-zinc-800 hover:bg-zinc-700 border-zinc-600"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>[ BELI DI {storePlatform.toUpperCase()} ]</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="flex-1 text-xs font-mono uppercase tracking-wider bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-md"
            >
              [ CEK DETAIL ]
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
