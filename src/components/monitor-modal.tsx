"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Check,
  XCircle,
  TrendingDown,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ShoppingBag,
  Store,
  Clock,
  Tv,
  Maximize2,
  Share2,
} from "lucide-react";
import { Monitor, MarketplaceLink } from "@/types/monitor";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TierBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";

interface MonitorModalProps {
  monitor: Monitor | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MonitorModal({ monitor, isOpen, onClose }: MonitorModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!monitor) return null;

  const images = monitor.gallery && monitor.gallery.length > 0 ? monitor.gallery : [monitor.thumbnail];
  const activeImage = images[selectedImageIndex] || monitor.thumbnail;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleMarketplaceClick = (link: MarketplaceLink) => {
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onClose={onClose}
        className="max-w-4xl p-5 sm:p-7 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto pr-1 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gp-ink-700">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  {monitor.brand}
                </span>
                <TierBadge tier={monitor.tier} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {monitor.fullName}
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-300 hover:text-white hover:border-gp-ink-600 transition-colors text-xs flex items-center gap-1.5"
                title="Bagikan monitor ini"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedLink ? "Disalin!" : "Share"}</span>
              </button>
            </div>
          </div>

          {/* Top Main Section: Gallery & Quick Buy Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Gallery Column (7 cols) */}
            <div className="md:col-span-7 space-y-3">
              {/* Main Image View */}
              <div className="relative aspect-[16/10] bg-gp-ink-950 rounded-2xl overflow-hidden border border-gp-ink-700/90 shadow-inner">
                <Image
                  src={activeImage}
                  alt={monitor.fullName}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-colors duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-2xs font-extrabold bg-black/85 text-white border border-gp-ink-600 px-2.5 py-1 rounded-lg backdrop-blur-md">
                    {monitor.specs.display.size} • {monitor.specs.display.refreshRate}Hz
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImageIndex === idx
                          ? "border-emerald-400 scale-95 shadow-tech-subtle"
                          : "border-gp-ink-700 hover:border-gp-ink-500 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Summary Verdict Column (5 cols) */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-4 bg-gp-ink-950/60 border border-gp-ink-700/80 rounded-2xl p-4 sm:p-5">
              <div className="space-y-3">
                <span className="text-2xs uppercase font-bold tracking-wider text-gp-ink-300">
                  Ringkasan Harga & Penilaian
                </span>
                
                {/* Price Display */}
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {formatRupiah(monitor.price)}
                  </div>
                  {monitor.originalPrice && monitor.originalPrice > monitor.price && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gp-ink-400 line-through">
                        {formatRupiah(monitor.originalPrice)}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Hemat {formatRupiah(monitor.originalPrice - monitor.price)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Verdict Box */}
                <div className="p-3 rounded-xl bg-gp-ink-800/90 border border-gp-ink-700 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 uppercase tracking-wider text-3xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verdict Reviewer</span>
                  </div>
                  <p className="text-gp-ink-200 leading-relaxed">
                    {monitor.expertVerdict}
                  </p>
                </div>

                {/* Key Specs Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {monitor.quickSpecs.map((spec, i) => (
                    <Badge key={i} variant="spec">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Direct Marketplace Buy CTA */}
              <div className="space-y-2 pt-2 border-t border-gp-ink-700">
                <span className="text-3xs font-bold text-gp-ink-300 uppercase tracking-wider block">
                  Beli Langsung di Marketplace:
                </span>
                <div className="space-y-1.5">
                  {monitor.marketplaces.map((link, idx) => (
                    <Button
                      key={idx}
                      variant={idx === 0 ? "cyber" : "outline"}
                      size="sm"
                      onClick={() => handleMarketplaceClick(link)}
                      className="w-full flex items-center justify-between text-xs py-2 px-3 group"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="font-bold">{link.marketplace}</span>
                        {link.officialStore && (
                          <span className="text-4xs px-1 py-0.2 rounded bg-gp-ink-800 border border-gp-ink-600 text-gp-ink-200 font-normal">
                            Official Store
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold">
                          {formatRupiah(link.price)}
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pros & Cons Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pros */}
            <div className="bg-emerald-950/15 border border-emerald-900/40 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Check className="w-4 h-4" />
                <span>Kelebihan (Pros)</span>
              </div>
              <ul className="space-y-1.5">
                {monitor.pros.map((item, i) => (
                  <li key={i} className="text-xs text-gp-ink-200 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="bg-rose-950/15 border border-rose-900/40 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <XCircle className="w-4 h-4" />
                <span>Kekurangan (Cons)</span>
              </div>
              <ul className="space-y-1.5">
                {monitor.cons.map((item, i) => (
                  <li key={i} className="text-xs text-gp-ink-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="space-y-3 bg-gp-ink-998 border border-gp-ink-700/90 rounded-2xl p-5">
            <div className="flex items-center gap-2 border-b border-gp-ink-700 pb-3">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Tabel Spesifikasi Teknis Lengkap
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
              {/* Display Specs */}
              <div className="space-y-2">
                <h4 className="text-2xs font-bold uppercase text-gp-ink-300 tracking-wider">
                  Panel & Layar
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">Ukuran Layar</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.display.size}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">Resolusi Native</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.display.resolution}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">Tipe Panel</span>
                    <span className="text-emerald-400 font-medium">{monitor.specs.display.panelType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">Refresh Rate</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.display.refreshRate} Hz</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">Response Time</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.display.responseTime}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">Brightness (Kecerahan)</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.display.brightness}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">Kontras Rasio</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.display.contrastRatio}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">Color Gamut</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.display.colorGamut}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">HDR Support</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.display.hdr}</span>
                  </div>
                </div>
              </div>

              {/* Connectivity & Ergonomics */}
              <div className="space-y-2">
                <h4 className="text-2xs font-bold uppercase text-gp-ink-300 tracking-wider">
                  Konektivitas & Ergonomi
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">DisplayPort</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.connectivity.displayPort}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">HDMI Port</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.connectivity.hdmi}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">USB Type-C</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.connectivity.typeC || "Tidak Ada"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">VESA Wall Mount</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.ergonomics.vesaMount}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">Height Adjustment</span>
                    <span className="text-gp-ink-100 font-medium">
                      {monitor.specs.ergonomics.heightAdjustable
                        ? `Ya (${monitor.specs.ergonomics.heightRange || "Adjustable"})`
                        : "Tidak (Statis)"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">Pivot (Rotasi Vertikal)</span>
                    <span className="text-gp-ink-100 font-medium">
                      {monitor.specs.ergonomics.pivot ? "Ya (90°)" : "Tidak"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">Sync Technology</span>
                    <span className="text-gp-ink-100 font-medium">{monitor.specs.features.syncTech}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gp-ink-800">
                    <span className="text-gp-ink-400">Garansi Resmi</span>
                    <span className="text-emerald-400 font-medium">{monitor.specs.features.warranty}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price History Section */}
          {monitor.priceHistory && monitor.priceHistory.length > 0 && (
            <div className="space-y-3 bg-gp-ink-950/80 border border-gp-ink-700 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Riwayat Tren Harga
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {monitor.priceHistory.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-gp-ink-800/70 border border-gp-ink-700 text-center"
                  >
                    <span className="text-3xs text-gp-ink-400 block">{point.date}</span>
                    <span className="text-xs font-bold font-mono text-white">
                      {formatRupiah(point.price)}
                    </span>
                    {point.label && (
                      <span className="text-4xs text-emerald-400 font-semibold block mt-0.5">
                        {point.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
