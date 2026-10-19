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
      className="group relative bg-gp-ink-900 hover:bg-gp-ink-850 border border-gp-ink-700 hover:border-gp-ink-600 transition-colors duration-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer shadow-tech-card"
    >
      {/* Top Header: Category & Type Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-2xs font-bold tracking-wider text-amber-400 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
          {desk.category}
        </span>

        {desk.type && (
          <span className="text-2xs font-medium text-gp-ink-300 bg-gp-ink-800 px-2.5 py-0.5 rounded-full border border-gp-ink-700">
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
          <p className="text-xs text-gp-ink-300 line-clamp-2 mt-1 leading-relaxed">
            {desk.description}
          </p>
        )}
      </div>

      {/* Spec Pills Row */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {specPills.map((spec, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 rounded text-2xs font-medium text-gp-ink-200 bg-gp-ink-700/50 border border-gp-ink-700/80"
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
              Estimasi Harga
            </span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight tabular-nums">
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
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 font-semibold bg-brand-shopee hover:bg-brand-shopee-dark text-white rounded-lg transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Beli di Shopee</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
