"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronsRight,
  Maximize2,
  Minimize2,
  Share2,
  Check,
  ExternalLink,
  MessageSquare,
  Clock,
  Phone,
  Layers,
  Globe,
  MapPin,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import { NotionBoardCard } from "@/components/notion-kanban-board";
import { CONSULTATION_DATA } from "@/data/grayplasma-content";

interface NotionAftersalesSidePanelProps {
  card: NotionBoardCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NotionAftersalesSidePanel({
  card,
  isOpen,
  onClose,
}: NotionAftersalesSidePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  const handleCopyDiscord = () => {
    const text = `[GRAYPLASMA AFTERSALES] ${card.title}
Kualitas: ${card.tags.map((t) => t.label).join(", ")}
Sistem: ${card.sistemKlaim || "Standard Distributor"}
Info: ${typeof window !== "undefined" ? window.location.href : ""}`;
    navigator.clipboard.writeText(text);
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  const handleCopyUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <>
      {/* Backdrop for Mobile */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Notion Side Panel Drawer Container */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 bg-[#191919] border-l border-[#2f2f2f] shadow-2xl transition-all duration-200 ease-out flex flex-col font-sans ${
          isExpanded
            ? "w-full max-w-5xl"
            : "w-full sm:w-[580px] md:w-[620px] lg:w-[580px] xl:w-[640px]"
        }`}
      >
        {/* Top Notion Control Bar */}
        <div className="h-12 px-4 sm:px-6 border-b border-[#2a2a2a] flex items-center justify-between bg-[#191919] flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              title="Tutup side panel (Esc)"
              className="p-1 rounded text-[#9b9a97] hover:text-white hover:bg-[#2c2c2c] transition-colors flex items-center gap-1 text-xs"
            >
              <ChevronsRight className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Perkecil panel" : "Perlebar panel"}
              className="p-1 rounded text-[#9b9a97] hover:text-white hover:bg-[#2c2c2c] transition-colors hidden sm:flex items-center gap-1 text-xs"
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Normal</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDiscord}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 border ${
                copiedDiscord
                  ? "bg-[#203c2b] text-[#52ba69] border-[#52ba69]/40"
                  : "bg-[#252525] border-[#333333] text-[#d4d4d4] hover:text-white hover:bg-[#2c2c2c]"
              }`}
            >
              {copiedDiscord ? <Check className="w-3.5 h-3.5 text-[#52ba69]" /> : <Share2 className="w-3.5 h-3.5 text-[#58a6ff]" />}
              <span>{copiedDiscord ? "Tersalin!" : "Copy Details"}</span>
            </button>

            <button
              onClick={handleCopyUrl}
              className="p-1.5 rounded text-[#9b9a97] hover:text-white hover:bg-[#2c2c2c] transition-colors text-xs"
              title="Salin Link"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-[#52ba69]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#9b9a97] hover:text-white hover:bg-[#2c2c2c] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Notion Content Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-6 text-[#d4d4d4] text-xs leading-relaxed">
          {/* Notion Page Icon & Title */}
          <div className="space-y-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 w-fit">
              <ShieldAlert className="w-6 h-6 text-zinc-300" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#ffffff] tracking-tight">
              {card.title}
            </h1>
          </div>

          {/* Notion Property Table */}
          <div className="space-y-2 py-3 border-y border-[#2a2a2a] text-xs">
            {/* Created Date */}
            <div className="grid grid-cols-12 gap-2 items-center py-1">
              <div className="col-span-4 text-[#9b9a97] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Created</span>
              </div>
              <div className="col-span-8 text-[#e0e0e0] font-medium">
                {card.createdDate || "September 29, 2025 8:03 PM"}
              </div>
            </div>

            {/* Kualitas Tags */}
            <div className="grid grid-cols-12 gap-2 items-center py-1">
              <div className="col-span-4 text-[#9b9a97] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Kualitas (?)</span>
              </div>
              <div className="col-span-8 flex flex-wrap gap-1.5">
                {card.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.color === "green"
                        ? "bg-[#203c2b] text-[#52ba69]"
                        : t.color === "orange"
                        ? "bg-[#442c1d] text-[#e07936]"
                        : t.color === "blue"
                        ? "bg-[#1d354a] text-[#4d97d9]"
                        : "bg-[#2f2f2f] text-[#9b9a97]"
                    }`}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div className="grid grid-cols-12 gap-2 items-center py-1">
              <div className="col-span-4 text-[#9b9a97] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>Phone Number</span>
              </div>
              <div className="col-span-8 text-[#9b9a97]">
                {card.phoneNumber || "Empty"}
              </div>
            </div>

            {/* Sistem Klaim */}
            <div className="grid grid-cols-12 gap-2 items-center py-1">
              <div className="col-span-4 text-[#9b9a97] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Sistem</span>
              </div>
              <div className="col-span-8">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1d354a] text-[#4d97d9]">
                  {card.sistemKlaim || "GANTI BARU"}
                </span>
              </div>
            </div>

            {/* Website Contact */}
            <div className="grid grid-cols-12 gap-2 items-center py-1">
              <div className="col-span-4 text-[#9b9a97] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>WEBSITE CONTACT</span>
              </div>
              <div className="col-span-8 truncate">
                {card.contactUrl ? (
                  <a
                    href={card.contactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#58a6ff] hover:underline flex items-center gap-1 truncate"
                  >
                    <span className="truncate">{card.contactUrl}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                ) : (
                  <span className="text-[#9b9a97]">Empty</span>
                )}
              </div>
            </div>

            {/* Website Location */}
            <div className="grid grid-cols-12 gap-2 items-center py-1">
              <div className="col-span-4 text-[#9b9a97] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>WEBSITE LOCATION</span>
              </div>
              <div className="col-span-8 text-[#9b9a97]">Empty</div>
            </div>
          </div>

          {/* Section Main Content */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold text-[#ffffff] tracking-wide uppercase">
              {card.deepDiveTitle || `KUALITAS AFTERSALES ${card.title.toUpperCase()}`}
            </h2>

            {/* PROS Notion Header Banner Bar (Exact match to Image 2) */}
            <div className="space-y-2">
              <div className="w-full py-1.5 px-3 rounded bg-[#193222] border border-[#203c2b] text-[#52ba69] font-bold text-xs tracking-wider">
                PROS
              </div>
              <ul className="space-y-2 pl-2 text-xs text-[#d4d4d4]">
                {(card.pros && card.pros.length > 0
                  ? card.pros
                  : [
                      "Tergolong Cepat, sekitar kurang dari seminggu proses Claim nya (Melalui Service Center)",
                      "Jaringan service center resmi tersedia di kota-kota besar Indonesia",
                    ]
                ).map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#9b9a97] mt-0.5">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONS Notion Header Banner Bar (Exact match to Image 2) */}
            <div className="space-y-2 pt-2">
              <div className="w-full py-1.5 px-3 rounded bg-[#371e20] border border-[#492224] text-[#eb5757] font-bold text-xs tracking-wider">
                CONS
              </div>
              <ul className="space-y-2 pl-2 text-xs text-[#d4d4d4]">
                {(card.cons && card.cons.length > 0
                  ? card.cons
                  : [
                      "Disarankan menyimpan kelengkapan seperti Dus, Sterofoam di dalam dus, Buku Manual. Karena di beberapa kasus, diperlukan hal itu",
                      "Menurut pandangan Penulis: Aftersales tergolong bagus dikarenakan sering dikritik (di-roasting) GTID, karena selain Produk Monitor, Aftersales tergolong Kurang",
                      "Karena alasan di atas, penulis sedikit ragu mengenai masa depan Aftersales, dan sebaiknya waspada terhadap aftersales 1-3 tahun kedepan",
                      "Ada berpotensi tidak dapat full refund jika pemakaian lebih dari 1 Tahun dan jika unit pengganti nya tidak ada",
                    ]
                ).map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#9b9a97] mt-0.5">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Discord Link & Disclaimer Note */}
            <div className="pt-4 space-y-2 text-[11px] text-[#9b9a97] border-t border-[#2a2a2a]">
              <a
                href={card.discordUrl || CONSULTATION_DATA.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#58a6ff] hover:underline block truncate"
              >
                {card.discordUrl || CONSULTATION_DATA.discordUrl}
              </a>
              <p className="leading-relaxed">
                Pelabelan penurunan kualitas Aftersales, jika terjadi lebih dari 5 kasus, akan dikategorikan ke dalam Kurang baik.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
