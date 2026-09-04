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
  Ruler,
} from "lucide-react";
import { QuickFilterTab } from "@/types/monitor";
import { Button } from "@/components/ui/button";
import { GPLogo } from "@/components/gp-logo";
import { CONSULTATION_DATA } from "@/data/grayplasma-content";
import { DatabaseService, GlobalSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/db-service";

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
  const [siteSettings, setSiteSettings] = useState<GlobalSiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    async function loadSettings() {
      try {
        const s = await DatabaseService.getSiteSettings();
        if (s) setSiteSettings(s);
      } catch (err) {
        console.error("Failed to load navbar site settings", err);
      }
    }
    loadSettings();
  }, []);

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
    <header className="sticky top-0 z-40 w-full bg-[#07070a]/95 backdrop-blur-xl border-b border-zinc-800 transition-all">
      {/* Top HUD Telemetry Strip */}
      <div className="w-full bg-[#050508] border-b border-zinc-800/80 px-4 py-1 text-[10px] font-mono text-zinc-500 hidden sm:flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>[SYS // GP_ONLINE]</span>
            </span>
            <span className="text-zinc-700 hidden md:inline">|</span>
            <span className="hidden md:inline text-zinc-400">DATABASE: GTID_LAB_TESTED</span>
            <span className="text-zinc-700 hidden lg:inline">|</span>
            <span className="hidden lg:inline text-zinc-400">CORE: METROPOLIS_TYPO</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400">
              REKOMENDASI: <strong className="text-white font-mono">{totalMonitorsCount}</strong> MODEL
            </span>
            <span className="text-zinc-700">•</span>
            <span className="text-cyan-400 font-semibold">[ LATENCY: &lt;15ms ]</span>
          </div>
        </div>
      </div>

      {/* Dynamic Announcement Ribbon */}
      {siteSettings.announcement?.isEnabled && siteSettings.announcement.text && (
        <div className="w-full bg-gradient-to-r from-emerald-950 via-zinc-950 to-emerald-950 border-b border-emerald-500/30 px-4 py-1.5 text-xs flex items-center justify-center gap-2.5 text-emerald-200">
          {siteSettings.announcement.badgeText && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] border border-emerald-500/40">
              [ {siteSettings.announcement.badgeText} ]
            </span>
          )}
          <span className="font-medium text-[11px] sm:text-xs">
            {siteSettings.announcement.text}
          </span>
          {siteSettings.announcement.linkUrl && (
            <Link
              href={siteSettings.announcement.linkUrl}
              className="text-emerald-400 hover:text-emerald-300 underline font-bold text-[11px] flex items-center gap-0.5 ml-1"
            >
              <span>{siteSettings.announcement.linkText || "Buka"}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Branding */}
          <div
            onClick={() => onMenuSelect("home")}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="p-1 rounded-lg bg-[#0d0d12] border border-zinc-700/80 shadow-[2px_2px_0px_#000] group-hover:border-emerald-500/80 transition-colors">
              <GPLogo className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  {siteSettings.brandName || "GRAYPLASMA"}<span className="text-emerald-400 font-mono">ID</span>
                </span>
                <Link
                  href="/guide/sdr/glossary"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 transition-colors hidden sm:inline-flex items-center gap-1 shadow-[2px_2px_0px_#000]"
                  title="Lihat Glosarium & Standar Pengujian GTID"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>[ GTID TESTED ]</span>
                </Link>
              </div>
              <p className="text-[11px] text-zinc-400 hidden lg:block font-medium">
                {siteSettings.brandTagline || "Katalog & Panduan Rekomendasi Monitor"}
              </p>
            </div>
          </div>

          {/* Nav Dropdown Menus (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0b0b0f] border border-zinc-700/80 rounded-lg p-1 shadow-[2px_2px_0px_#000]">
            {/* Beranda */}
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentKey === "home"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Beranda
            </Link>

            {/* Menu 1: Rekomendasi Monitor with Submenu */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "catalog" ? null : "catalog")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isCatalogActive
                    ? "bg-zinc-800 text-white shadow-sm border border-zinc-700 font-bold"
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
                  <Link
                    href="/catalog/desks"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-300 hover:text-white hover:bg-[#282828] transition-colors flex items-center justify-between group border-t border-[#2f2f2f] pt-2"
                  >
                    <div>
                      <span className="block font-semibold">🪑 Rekomendasi Meja + Kaki</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/catalog/desks</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">10 Meja</span>
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
                    href="/guide/setup/ukuran-meja-monitor-ideal"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#282828] transition-colors flex items-start gap-2 group"
                  >
                    <Ruler className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Ukuran Meja & Monitor Ideal (24" / 27")</span>
                      <span className="text-[10px] text-[#787774] font-mono group-hover:text-[#52ba69]">/guide/setup/ukuran-meja-monitor-ideal</span>
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
                className="w-full bg-[#08080c] border border-zinc-700/80 rounded-lg pl-9 pr-14 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 shadow-[2px_2px_0px_#000] transition-all"
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
                  <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-emerald-400 bg-[#141419] border border-zinc-700 px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#000]">
                    [ / ]
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
              className="lg:hidden flex items-center gap-1.5 border-zinc-700 bg-[#0d0d12] shadow-[2px_2px_0px_#000]"
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 hover:border-emerald-400 text-xs font-mono font-bold text-emerald-400 hover:bg-emerald-500 hover:text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>[ TANYA JOEL ]</span>
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
