"use client";

import React from "react";
import { X, ShoppingBag, ExternalLink, Info, Check, Copy, Layers } from "lucide-react";
import { DeskItem } from "@/data/grayplasma-desk-peripherals";
import { formatRupiah } from "@/lib/utils";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";

interface DeskSidePanelProps {
  desk: DeskItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeskSidePanel({ desk, isOpen, onClose }: DeskSidePanelProps) {
  const [copiedLink, setCopiedLink] = React.useState(false);

  if (!isOpen || !desk) return null;

  const getTagColor = (tag: string) => {
    const t = tag.toUpperCase();
    if (t.includes("DAUN MEJA")) return "bg-gp-ember-300 text-gp-ember-100 border-gp-ember-100/30";
    if (t.includes("HOLLOW")) return "bg-gp-ink-700 text-gp-ink-200 border-gp-ink-600";
    if (t.includes("ELEKTRIK")) return "bg-gp-mint-600 text-gp-mint-50 border-gp-mint-50/30";
    if (t.includes("LACI") || t.includes("NAKAS")) return "bg-indigo-900 text-indigo-300 border-indigo-300/30";
    if (t.includes("TACOSHEET") || t.includes("PLYWOOD")) return "bg-gp-coral-600 text-gp-coral-50 border-gp-coral-50/30";
    return "bg-gp-sky-500 text-blue-300 border-blue-500/30";
  };

  const handleCopyLink = () => {
    if (desk.shopeeUrl) {
      navigator.clipboard.writeText(desk.shopeeUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Side Panel Drawer */}
      <aside
        className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[580px] md:w-[640px] lg:w-[680px] bg-gp-ink-850 text-gp-ink-100 border-l border-gp-ink-700 shadow-2xl transition-all duration-300 ease-out flex flex-col font-sans animate-in slide-in-from-right duration-300"
      >
        {/* Top Control Bar */}
        <div className="h-14 px-5 sm:px-6 border-b border-gp-ink-700 flex items-center justify-between bg-gp-ink-800 flex-shrink-0 text-xs text-gp-ink-300">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪑</span>
            <span className="font-bold text-white uppercase tracking-tight truncate max-w-[240px] sm:max-w-[320px]">
              {desk.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {desk.shopeeUrl && (
              <a
                href={desk.shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-brand-shopee/15 hover:bg-brand-shopee border border-brand-shopee/40 text-brand-shopee hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shopee</span>
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

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Header Title */}
          <div className="space-y-3 pb-4 border-b border-gp-ink-700">
            <div className="p-2 rounded-lg bg-gp-ink-800 border border-gp-ink-700 w-fit">
              <Layers className="w-6 h-6 text-gp-ink-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {desk.name}
            </h2>
            {desk.description && (
              <p className="text-xs text-gp-ink-300 leading-relaxed">
                {desk.description}
              </p>
            )}
          </div>

          {/* Properties Table (Notion Style) */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-gp-ink-800 border border-gp-ink-700/80 text-xs">
            {/* L-Shaped Type */}
            <div className="grid grid-cols-12 gap-2 items-center py-1">
              <span className="col-span-5 text-gp-ink-400 font-medium">Bentuk / Tipe</span>
              <div className="col-span-7">
                <span className="px-2.5 py-0.5 rounded-md text-2xs font-bold bg-gp-ink-800 text-gp-ink-100 border border-gp-ink-700">
                  {desk.type || "NON L SHAPED"}
                </span>
              </div>
            </div>

            {/* Catatan Status */}
            <div className="grid grid-cols-12 gap-2 items-center py-1">
              <span className="col-span-5 text-gp-ink-400 font-medium">Status Catatan</span>
              <div className="col-span-7">
                <span className="px-2.5 py-0.5 rounded-md text-2xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {desk.catatanBadge || "ADA (DISARANKAN MEMBACA NYA)"}
                </span>
              </div>
            </div>

            {/* Kategori Tags */}
            <div className="grid grid-cols-12 gap-2 items-start py-1">
              <span className="col-span-5 text-gp-ink-400 font-medium pt-0.5">Kategori</span>
              <div className="col-span-7 flex flex-wrap gap-1.5">
                {(desk.keterangan || [desk.category]).map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-0.5 rounded-md text-3xs font-bold border uppercase tracking-wider ${getTagColor(
                      tag
                    )}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Kisaran Harga */}
            <div className="grid grid-cols-12 gap-2 items-center py-1 border-t border-gp-ink-700/60 pt-2">
              <span className="col-span-5 text-gp-ink-400 font-medium">Kisaran Harga</span>
              <div className="col-span-7 font-mono font-black text-emerald-400 text-base">
                {desk.price > 0 ? formatRupiah(desk.price) : "Custom Size / Pilihan"}
              </div>
            </div>

            {/* Specs Breakdown */}
            {desk.specs && (
              <div className="grid grid-cols-12 gap-2 items-center py-1 border-t border-gp-ink-700/60 pt-2">
                <span className="col-span-5 text-gp-ink-400 font-medium">Dimensi & Bahan</span>
                <div className="col-span-7 text-gp-ink-200 font-mono text-2xs space-y-0.5">
                  <div><strong>Dimensi:</strong> {desk.specs.dimensions}</div>
                  <div><strong>Bahan:</strong> {desk.specs.material}</div>
                  <div><strong>Tebal:</strong> {desk.specs.thickness}</div>
                  <div><strong>Support Arm:</strong> {desk.specs.armSupport ? "[YA - KUAT JEPIT]" : "[PERLU PLAT PROTEKTOR]"}</div>
                </div>
              </div>
            )}

            {/* Custom Variables / Parameters */}
            {desk.customVariables && desk.customVariables.length > 0 && (
              <div className="grid grid-cols-12 gap-2 items-start py-2 border-t border-gp-ink-700/60 pt-2">
                <span className="col-span-5 text-gp-ink-400 font-medium">Variabel Tambahan</span>
                <div className="col-span-7 space-y-1.5">
                  {desk.customVariables.map((v) => (
                    <div
                      key={v.id}
                      className="flex justify-between items-center bg-black/40 border border-gp-ink-700 px-2.5 py-1 rounded-lg text-xs"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        {v.category && (
                          <span className="text-4xs font-mono font-bold text-amber-400 uppercase bg-gp-ink-700 px-1 rounded">
                            {v.category}
                          </span>
                        )}
                        <span className="text-gp-ink-300 font-medium truncate">{v.label}</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold ml-2">
                        {v.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Full Markdown Guide Content */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gp-ink-800 border border-gp-ink-700/80 space-y-4">
            {desk.markdownContent ? (
              <NotionBlockRenderer content={desk.markdownContent} />
            ) : desk.notes ? (
              <div className="space-y-2 text-xs text-gp-ink-200">
                <h4 className="font-bold text-white text-sm">Catatan Meja:</h4>
                <p className="leading-relaxed">{desk.notes}</p>
              </div>
            ) : (
              <p className="text-xs text-gp-ink-400 italic">Tidak ada catatan tambahan untuk model meja ini.</p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
