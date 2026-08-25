"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  MessageCircle,
  ExternalLink,
  X,
  ShieldAlert,
  BookOpen,
  Layers,
  ChevronDown,
  LayoutGrid,
  SunMedium,
  Headphones,
  FileText,
  Heart,
  HelpCircle,
  Tv,
} from "lucide-react";
import { QuickFilterTab } from "@/types/monitor";
import { Button } from "@/components/ui/button";
import { GPLogo } from "@/components/gp-logo";
import { CONSULTATION_DATA } from "@/data/grayplasma-content";

export type NavMenuKey =
  | "catalog-all"
  | "catalog-1080p"
  | "catalog-1440p"
  | "catalog-4k"
  | "catalog-oled"
  | "aftersales-tier"
  | "desk-guide"
  | "hdr-guide"
  | "graynotes-all"
  | "faq"
  | "bandwidth-guide"
  | "feedback"
  | "glossary"
  | "about"
  | "support-donasi"
  | "consultation";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeQuickTab: QuickFilterTab;
  onQuickTabChange: (tab: QuickFilterTab) => void;
  onToggleMobileFilter: () => void;
  activeFilterCount: number;
  totalMonitorsCount: number;
  activeMenuKey: NavMenuKey | "home";
  onMenuSelect: (key: NavMenuKey | "home") => void;
}

export function Navbar({
  searchQuery,
  onSearchChange,
  activeQuickTab,
  onQuickTabChange,
  onToggleMobileFilter,
  activeFilterCount,
  totalMonitorsCount,
  activeMenuKey,
  onMenuSelect,
}: NavbarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [openDropdown, setOpenDropdown] = useState<"catalog" | "aftersales" | "more" | null>(null);

  useEffect(() => {
    const handleDocumentClick = () => setOpenDropdown(null);
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" && document.activeElement !== searchInputRef.current) ||
        (e.key === "k" && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentKey = activeMenuKey || "home";
  const isCatalogActive = currentKey.startsWith("catalog");
  const isAftersalesActive = currentKey.startsWith("aftersales");
  const isMoreActive =
    currentKey === "desk-guide" ||
    currentKey === "hdr-guide" ||
    currentKey === "graynotes-all" ||
    currentKey === "faq" ||
    currentKey === "bandwidth-guide" ||
    currentKey === "feedback" ||
    currentKey === "glossary" ||
    currentKey === "about" ||
    currentKey === "support-donasi" ||
    currentKey === "consultation";

  return (
    <header className="sticky top-0 z-40 w-full bg-black/92 backdrop-blur-xl border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Branding */}
          <div
            onClick={() => onMenuSelect("home")}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <GPLogo className="w-9 h-9 sm:w-10 sm:h-10" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  GRAYPLASMA<span className="text-emerald-400">ID</span>
                </span>
                <Link
                  href="/guide/sdr/glossary"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 transition-colors hidden sm:inline-flex items-center gap-1 shadow-sm"
                  title="Lihat Glosarium & Standar Pengujian GTID"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>GTID TESTED</span>
                </Link>
              </div>
              <p className="text-[11px] text-zinc-400 hidden lg:block">
                Katalog & Panduan Rekomendasi Monitor
              </p>
            </div>
          </div>

          {/* Nav Dropdown Menus (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-950/90 border border-zinc-800 rounded-xl p-1">
            {/* Beranda */}
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentKey === "home"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Beranda
            </Link>

            {/* Menu 1: Rekomendasi Monitor with Submenu */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "catalog" ? null : "catalog")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isCatalogActive
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rekomendasi</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === "catalog" ? "rotate-180" : ""}`} />
              </button>

              {openDropdown === "catalog" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#202020] border border-[#2f2f2f] rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-1">
                  <div className="text-[10px] font-bold text-[#787774] px-2 py-1 uppercase tracking-wider">
                    Pilihan Kategori Rekomendasi
                  </div>
                  <Link
                    href="/catalog/all"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="block font-semibold">Semua Monitor</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/catalog/all</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">{totalMonitorsCount}</span>
                  </Link>
                  <Link
                    href="/catalog/1080p"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="block font-semibold">1080p (FHD Budget & Esport)</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/catalog/1080p</span>
                    </div>
                  </Link>
                  <Link
                    href="/catalog/1440p"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="block font-semibold">1440p (2K Sweetspot)</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/catalog/1440p</span>
                    </div>
                  </Link>
                  <Link
                    href="/catalog/oled"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="block font-semibold">OLED & Flagship Tier</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/catalog/oled</span>
                    </div>
                  </Link>
                  <Link
                    href="/catalog/4k"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="block font-semibold">4K UHD & Creator Special</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/catalog/4k</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Menu 2: Aftersales with Submenu */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "aftersales" ? null : "aftersales")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isAftersalesActive
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Aftersales</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === "aftersales" ? "rotate-180" : ""}`} />
              </button>

              {openDropdown === "aftersales" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#202020] border border-[#2f2f2f] rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-1">
                  <div className="text-[10px] font-bold text-[#787774] px-2 py-1 uppercase tracking-wider">
                    Aftersales & Garansi Brand
                  </div>
                  <Link
                    href="/guide/brand/aftersales-rma"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors block group"
                  >
                    <span className="block font-semibold">Aftersales Brand Tier List</span>
                    <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/guide/brand/aftersales-rma</span>
                  </Link>
                  <Link
                    href="/guide/brand/odm-layak-dibeli"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors block group"
                  >
                    <span className="block font-semibold">Brand ODM Monitor Layak Dibeli?</span>
                    <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/guide/brand/odm-layak-dibeli</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Menu 3: Panduan & Sub-pages */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "more" ? null : "more")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isMoreActive
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Panduan & Info</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === "more" ? "rotate-180" : ""}`} />
              </button>

              {openDropdown === "more" && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-[#202020] border border-[#2f2f2f] rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 max-h-[80vh] overflow-y-auto space-y-1">
                  <div className="text-[10px] font-bold text-[#787774] px-2.5 py-1 uppercase tracking-wider">
                    Panduan & Edukasi (/guide/...)
                  </div>
                  <Link
                    href="/guide/faq"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-start gap-2 group"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">QnA & FAQ Section</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/guide/faq</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/sdr/glossary"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-start gap-2 group"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">How to Read GTID Glossary</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/guide/sdr/glossary</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/display/bandwidth-dp-hdmi"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-start gap-2 group"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Bandwidth DP 1.4 vs HDMI 2.1</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/guide/display/bandwidth-dp-hdmi</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/setup/meja-ergonomi"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-start gap-2 group"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Rekomendasi Meja & Monitor Arm</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/guide/setup/meja-ergonomi</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/oled/perawatan-burn-in"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-start gap-2 group"
                  >
                    <SunMedium className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Panduan Lengkap OLED & Burn-in</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/guide/oled/perawatan-burn-in</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/warna/akurasi-d65-p3"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-start gap-2 group"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">D65-P3 Undersaturated Guide</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/guide/warna/akurasi-d65-p3</span>
                    </div>
                  </Link>

                  <div className="text-[10px] font-bold text-[#787774] px-2.5 py-1 uppercase tracking-wider border-t border-[#2f2f2f] mt-1 pt-1">
                    Komunitas & Penulis
                  </div>
                  <Link
                    href="/guide/about/tentang-penulis"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-start gap-2 group"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Tentang Website & Penulis</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/guide/about/tentang-penulis</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/support/donasi-penulis"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-start gap-2 group"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Support & Donasi Penulis</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/guide/support/donasi-penulis</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/consultation/konsultasi-joel-gray"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-start gap-2 group"
                  >
                    <Headphones className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Konsultasi WA / Discord</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/guide/consultation/konsultasi-joel-gray</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Instant Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari monitor (contoh: 24G4, G24i, OLED, 1440p)..."
                className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl pl-9 pr-14 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1 pointer-events-none">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSearchChange("");
                    }}
                    className="pointer-events-auto text-zinc-500 hover:text-white p-1 rounded hover:bg-zinc-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                    Ctrl K
                  </kbd>
                )}
              </div>
            </div>
          </div>

          {/* Right Action: WhatsApp Consultation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleMobileFilter}
              className="lg:hidden flex items-center gap-1.5 border-zinc-800 bg-zinc-950"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-black font-bold text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <a
              href={CONSULTATION_DATA.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Tanya Joel</span>
            </a>
          </div>
        </div>

        {/* Mobile Horizontal Menu Bar */}
        <div className="flex md:hidden items-center gap-2 py-2 border-t border-zinc-900 overflow-x-auto no-scrollbar">
          <Link
            href="/"
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              currentKey === "home" ? "bg-zinc-800 text-white" : "text-zinc-400"
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/guide/brand/aftersales-rma"
            className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#193222] text-[#52ba69] border border-[#203c2b]"
          >
            Aftersales
          </Link>
          <Link
            href="/guide/setup/meja-ergonomi"
            className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1d354a] text-[#58a6ff] border border-[#2383e2]/40"
          >
            Meja & Setup
          </Link>
          <Link
            href="/guide/faq"
            className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#442c1d] text-[#e07936] border border-[#ff9f43]/40"
          >
            QnA & FAQ
          </Link>
          <Link
            href="/guide/display/bandwidth-dp-hdmi"
            className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Bandwidth
          </Link>
          <Link
            href="/guide/oled/perawatan-burn-in"
            className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white"
          >
            OLED Care
          </Link>
          <Link
            href="/guide/sdr/glossary"
            className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Glosarium
          </Link>
          <Link
            href="/guide/about/tentang-penulis"
            className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Tentang
          </Link>
          <Link
            href="/guide/support/donasi-penulis"
            className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Donasi
          </Link>
        </div>
      </div>
    </header>
  );
}
