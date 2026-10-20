"use client";

import React, { useState } from "react";
import { X, ShoppingBag, ExternalLink, ShieldCheck, Check, Copy, Info, Sparkles, Headphones } from "lucide-react";
import { PeripheralItem } from "@/data/grayplasma-desk-peripherals";
import { formatRupiah } from "@/lib/utils";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";

interface PeripheralSidePanelProps {
  peripheral: PeripheralItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PeripheralSidePanel({ peripheral, isOpen, onClose }: PeripheralSidePanelProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !peripheral) return null;

  const buyUrl = peripheral.shopeeUrl || peripheral.tokopediaUrl || peripheral.tiktokUrl;
  const platform = peripheral.shopeeUrl
    ? "Shopee"
    : peripheral.tokopediaUrl
    ? "Tokopedia"
    : peripheral.tiktokUrl
    ? "TikTok Shop"
    : "Toko Resmi";

  const handleCopyLink = () => {
    if (buyUrl) {
      navigator.clipboard.writeText(buyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Side Panel Drawer */}
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[580px] md:w-[640px] lg:w-[680px] bg-gp-ink-850 text-gp-ink-100 border-l border-gp-ink-700 shadow-2xl transition-colors duration-300 ease-out flex flex-col font-sans animate-in slide-in-from-right duration-300">
        {/* Top Control Bar */}
        <div className="h-14 px-5 sm:px-6 border-b border-gp-ink-700 flex items-center justify-between bg-gp-ink-800 flex-shrink-0 text-xs text-gp-ink-300">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-gp-ink-300" />
            <span className="font-bold text-white uppercase tracking-tight truncate max-w-[240px] sm:max-w-[320px]">
              {peripheral.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {buyUrl && (
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-tech-subtle"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Beli di {platform}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-gp-ink-750 hover:bg-gp-ink-700 text-gp-ink-300 hover:text-white transition-colors"
              title="Tutup (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Header Title */}
          <div className="space-y-3 pb-4 border-b border-gp-ink-700">
            <div className="p-2 rounded-lg bg-gp-ink-800 border border-gp-ink-700 w-fit">
              <Headphones className="w-6 h-6 text-gp-ink-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {peripheral.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {peripheral.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-gp-ink-700 text-gp-ink-200 border border-gp-ink-600">
                Brand: {peripheral.brand}
              </span>
              {peripheral.warranty && (
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Garansi {peripheral.warranty}</span>
                </span>
              )}
            </div>
          </div>

          {/* Properties Table (Notion Style) */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-gp-ink-800 border border-gp-ink-700/80 text-xs">
            <div className="grid grid-cols-12 gap-2 items-center py-1">
              <span className="col-span-5 text-gp-ink-400 font-medium">Tipe / Versi</span>
              <span className="col-span-7 font-mono font-bold text-white">
                {peripheral.versionDetail || peripheral.type || "-"}
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2 items-center py-1 border-t border-gp-ink-700/60 pt-2">
              <span className="col-span-5 text-gp-ink-400 font-medium">Rekomendasi Penggunaan</span>
              <span className="col-span-7 text-gp-ink-200">
                {peripheral.recommendedFor || "Semua Setup PC/Laptop"}
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2 items-center py-1 border-t border-gp-ink-700/60 pt-2">
              <span className="col-span-5 text-gp-ink-400 font-medium">Kisaran Harga</span>
              <div className="col-span-7 font-mono font-black text-cyan-400 text-base">
                {peripheral.price > 0 ? formatRupiah(peripheral.price) : "Cek Toko"}
              </div>
            </div>
          </div>

          {/* Verdict Box */}
          {peripheral.verdict && (
            <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-cyan-400 uppercase tracking-wider text-2xs">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Verdict Pengujian Lab GrayPlasma:</span>
              </div>
              <p className="leading-relaxed text-gp-ink-100">{peripheral.verdict}</p>
            </div>
          )}

          {/* Markdown Content / Catatan Tambahan */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gp-ink-800 border border-gp-ink-700/80 space-y-4">
            <h4 className="text-xs font-bold text-gp-ink-300 uppercase tracking-wider border-b border-gp-ink-700 pb-2">
              Catatan & Spesifikasi Lengkap
            </h4>
            {peripheral.notes ? (
              <NotionBlockRenderer content={peripheral.notes} />
            ) : (
              <p className="text-xs text-gp-ink-400 italic">Tidak ada catatan tambahan untuk aksesoris ini.</p>
            )}
          </div>

          {/* Marketplace Links */}
          <div className="p-4 rounded-2xl bg-gp-ink-800/60 border border-gp-ink-700 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-gp-ink-300 font-medium">Tersedia di Marketplace Resmi:</span>
            <div className="flex items-center gap-2">
              {peripheral.shopeeUrl && (
                <a
                  href={peripheral.shopeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-brand-shopee text-white font-bold hover:opacity-90 flex items-center gap-1"
                >
                  <span>Shopee</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {peripheral.tokopediaUrl && (
                <a
                  href={peripheral.tokopediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-brand-tokopedia-alt text-white font-bold hover:opacity-90 flex items-center gap-1"
                >
                  <span>Tokopedia</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {peripheral.tiktokUrl && (
                <a
                  href={peripheral.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-gp-ink-700 text-white font-bold hover:bg-gp-ink-600 flex items-center gap-1"
                >
                  <span>TikTok Shop</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
