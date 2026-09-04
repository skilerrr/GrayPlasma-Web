"use client";

import React from "react";
import { X, ShoppingBag, ExternalLink, Info, Check, Copy } from "lucide-react";
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
    if (t.includes("DAUN MEJA")) return "bg-[#3d2b1f] text-[#f59e0b] border-[#f59e0b]/30";
    if (t.includes("HOLLOW")) return "bg-[#27272a] text-[#d4d4d8] border-zinc-700";
    if (t.includes("ELEKTRIK")) return "bg-[#143322] text-[#34d399] border-[#34d399]/30";
    if (t.includes("LACI") || t.includes("NAKAS")) return "bg-[#312e81] text-[#a5b4fc] border-[#a5b4fc]/30";
    if (t.includes("TACOSHEET") || t.includes("PLYWOOD")) return "bg-[#3f2020] text-[#fca5a5] border-[#fca5a5]/30";
    return "bg-[#1e293b] text-[#93c5fd] border-blue-500/30";
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
        className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[580px] md:w-[640px] lg:w-[680px] bg-[#121216] text-zinc-200 border-l border-zinc-800 shadow-2xl transition-all duration-300 ease-out flex flex-col font-sans animate-in slide-in-from-right duration-300"
      >
        {/* Top Control Bar */}
        <div className="h-14 px-5 sm:px-6 border-b border-zinc-800 flex items-center justify-between bg-[#18181f] flex-shrink-0 text-xs text-zinc-400">
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
                className="px-3 py-1.5 rounded-xl bg-[#ee4d2d]/15 hover:bg-[#ee4d2d] border border-[#ee4d2d]/40 text-[#ee4d2d] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shopee</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#202025] hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Tutup (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Header Title */}
          <div className="space-y-3 pb-4 border-b border-zinc-800">
            <div className="text-3xl">📄</div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {desk.name}
            </h2>
            {desk.description && (
              <p className="text-xs text-zinc-400 leading-relaxed">
                {desk.description}
              </p>
            )}
          </div>

          {/* Properties Table (Notion Style) */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-[#18181f] border border-zinc-800/80 text-xs">
            {/* L-Shaped Type */}
            <div className="grid grid-cols-12 gap-2 items-center py-1">
              <span className="col-span-5 text-zinc-500 font-medium">Bentuk / Tipe</span>
              <div className="col-span-7">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-zinc-900 text-zinc-200 border border-zinc-800">
                  {desk.type || "NON L SHAPED"}
                </span>
              </div>
            </div>

            {/* Catatan Status */}
            <div className="grid grid-cols-12 gap-2 items-center py-1">
              <span className="col-span-5 text-zinc-500 font-medium">Status Catatan</span>
              <div className="col-span-7">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {desk.catatanBadge || "ADA (DISARANKAN MEMBACA NYA)"}
                </span>
              </div>
            </div>

            {/* Kategori Tags */}
            <div className="grid grid-cols-12 gap-2 items-start py-1">
              <span className="col-span-5 text-zinc-500 font-medium pt-0.5">Kategori</span>
              <div className="col-span-7 flex flex-wrap gap-1.5">
                {(desk.keterangan || [desk.category]).map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getTagColor(
                      tag
                    )}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Kisaran Harga */}
            <div className="grid grid-cols-12 gap-2 items-center py-1 border-t border-zinc-800/60 pt-2">
              <span className="col-span-5 text-zinc-500 font-medium">Kisaran Harga</span>
              <div className="col-span-7 font-mono font-black text-emerald-400 text-base">
                {desk.price > 0 ? formatRupiah(desk.price) : "Custom Size / Pilihan"}
              </div>
            </div>

            {/* Specs Breakdown */}
            {desk.specs && (
              <div className="grid grid-cols-12 gap-2 items-center py-1 border-t border-zinc-800/60 pt-2">
                <span className="col-span-5 text-zinc-500 font-medium">Dimensi & Bahan</span>
                <div className="col-span-7 text-zinc-300 font-mono text-[11px] space-y-0.5">
                  <div><strong>Dimensi:</strong> {desk.specs.dimensions}</div>
                  <div><strong>Bahan:</strong> {desk.specs.material}</div>
                  <div><strong>Tebal:</strong> {desk.specs.thickness}</div>
                  <div><strong>Support Arm:</strong> {desk.specs.armSupport ? "✅ YA (Kuat Jepit)" : "⚠️ Perlu Protektor"}</div>
                </div>
              </div>
            )}

            {/* Custom Variables / Parameters */}
            {desk.customVariables && desk.customVariables.length > 0 && (
              <div className="grid grid-cols-12 gap-2 items-start py-2 border-t border-zinc-800/60 pt-2">
                <span className="col-span-5 text-zinc-500 font-medium">Variabel Tambahan</span>
                <div className="col-span-7 space-y-1.5">
                  {desk.customVariables.map((v) => (
                    <div
                      key={v.id}
                      className="flex justify-between items-center bg-black/40 border border-zinc-800 px-2.5 py-1 rounded-lg text-xs"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        {v.category && (
                          <span className="text-[9px] font-mono font-bold text-amber-400 uppercase bg-zinc-800 px-1 rounded">
                            {v.category}
                          </span>
                        )}
                        <span className="text-zinc-400 font-medium truncate">{v.label}</span>
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
          <div className="p-5 sm:p-6 rounded-2xl bg-[#18181f] border border-zinc-800/80 space-y-4">
            {desk.markdownContent ? (
              <NotionBlockRenderer content={desk.markdownContent} />
            ) : desk.notes ? (
              <div className="space-y-2 text-xs text-zinc-300">
                <h4 className="font-bold text-white text-sm">Catatan Meja:</h4>
                <p className="leading-relaxed">{desk.notes}</p>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">Tidak ada catatan tambahan untuk model meja ini.</p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
