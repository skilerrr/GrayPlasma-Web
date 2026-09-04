"use client";

import React from "react";
import { ShoppingBag, ExternalLink, Sparkles, Ruler } from "lucide-react";
import { DeskItem } from "@/data/grayplasma-desk-peripherals";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DeskCardProps {
  desk: DeskItem;
  onSelectDesk?: (desk: DeskItem) => void;
}

export function DeskCard({ desk, onSelectDesk }: DeskCardProps) {
  const specPills = [
    desk.specs.dimensions,
    `Tebal: ${desk.specs.thickness}`,
    desk.specs.armSupport ? "Arm Support: YES" : "Arm Support: NO",
    desk.specs.material,
  ].filter(Boolean);

  return (
    <div
      onClick={() => {
        if (onSelectDesk) onSelectDesk(desk);
      }}
      className="group relative bg-[#0c0c10] hover:bg-[#111116] border-2 border-zinc-800 hover:border-amber-500/80 transition-all duration-200 rounded-lg p-4 sm:p-5 flex flex-col justify-between cursor-pointer shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_rgba(245,158,11,0.35)] hover:-translate-y-0.5"
    >
      {/* Top Header: Category & Type Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/40">
          [ {desk.category} ]
        </span>

        {desk.type && (
          <span className="text-[10px] font-mono font-semibold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            {desk.type}
          </span>
        )}
      </div>

      {/* Desk Title */}
      <div className="mb-2.5">
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug tracking-tight">
          {desk.name}
        </h3>
        {desk.description && (
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {desk.description}
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
              // ESTIMASI_BUDGET
            </span>
            <span className="text-base sm:text-lg font-black text-white tracking-tight tabular-nums font-mono">
              {desk.price > 0 ? formatRupiah(desk.price) : "Custom Size"}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (desk.shopeeUrl) {
                window.open(desk.shopeeUrl, "_blank", "noopener,noreferrer");
              }
            }}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 font-bold bg-[#ee4d2d] hover:bg-[#d43d1f] text-white rounded-md border border-orange-600 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all uppercase tracking-wider font-mono"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>[ BELI DI SHOPEE ]</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
