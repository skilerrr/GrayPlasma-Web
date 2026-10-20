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
  Wrench,
} from "lucide-react";
import { QuickFilterTab } from "@/types/monitor";
import { Button } from "@/components/ui/button";
import { GPLogo } from "@/components/gp-logo";
import { CONSULTATION_DATA } from "@/data/grayplasma-content";
import { DatabaseService, GlobalSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/db-service";
import { AnnouncementBar } from "@/components/announcement-bar";

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
  const [showChairs, setShowChairs] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [s, hp] = await Promise.all([
          DatabaseService.getSiteSettings(),
          DatabaseService.getHomepageSettings(),
        ]);
        if (s) setSiteSettings(s);
        if (hp?.sectionVisibility) {
          setShowChairs(Boolean(hp.sectionVisibility.showChairs));
        }
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
    <header className="sticky top-0 z-40 w-full bg-gp-ink-950/95 backdrop-blur-xl border-b border-gp-ink-700 transition-colors">
      <AnnouncementBar settings={siteSettings?.announcement} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Branding */}
          <div
            onClick={() => onMenuSelect("home")}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none flex-shrink-0 min-w-0"
          >
            <div className="p-1 rounded-lg bg-gp-ink-900 border border-gp-ink-700 group-hover:border-gp-ink-600 transition-colors">
              <GPLogo className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <div className="hidden xs:block min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase truncate">
                  {(siteSettings.brandName || "GRAYPLASMA ID").replace(/\s*ID$/i, "")}{" "}
                  <span className="text-orange-500 font-mono">ID</span>
                </span>
              </div>
              <p className="text-2xs text-gp-ink-300 hidden lg:block font-medium">
                {siteSettings.brandTagline || "Database Pengujian & Kurasi Monitor Independen"}
              </p>
            </div>
          </div>

          {/* Nav Dropdown Menus (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-gp-ink-900 border border-gp-ink-700 rounded-lg p-1 shrink-0">
            {/* Beranda */}
            <Link
              href="/"
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                currentKey === "home"
                  ? "bg-gp-ink-700 text-white shadow-sm border border-gp-ink-600 font-bold"
                  : "text-gp-ink-300 hover:text-gp-ink-100"
              }`}
            >
              Beranda
            </Link>

            {/* Menu 1: Rekomendasi Monitor & Meja */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "catalog" ? null : "catalog")}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isCatalogActive
                    ? "bg-gp-ink-700 text-white shadow-sm border border-gp-ink-600 font-bold"
                    : "text-gp-ink-300 hover:text-gp-ink-100"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rekomendasi</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === "catalog" ? "rotate-180" : ""}`} />
              </button>

              {openDropdown === "catalog" && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-gp-ink-750 border border-gp-ink-650 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-1">
                  <div className="text-3xs font-bold text-gp-ink-400 px-2 py-1 uppercase tracking-wider">
                    Katalog Rekomendasi
                  </div>
                  <Link
                    href="/catalog/all"
                    onClick={() => {
                      onMenuSelect("catalog-all");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700/80 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                        <Tv className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-semibold text-gp-ink-100 group-hover:text-white">Rekomendasi Monitor</span>
                        <span className="text-3xs text-gp-ink-400">Semua model hasil kurasi & tes lab</span>
                      </div>
                    </div>
                    <span className="text-3xs text-gp-ink-300 font-mono bg-gp-ink-800 px-1.5 py-0.5 rounded border border-gp-ink-700">
                      {totalMonitorsCount}
                    </span>
                  </Link>

                  <Link
                    href="/catalog/desks"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700/80 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-orange-500/10 text-orange-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-semibold text-gp-ink-100 group-hover:text-white">Rekomendasi Meja + Kaki</span>
                        <span className="text-3xs text-gp-ink-400">Daun meja, standing desk, & arm</span>
                      </div>
                    </div>
                    <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold">
                      10 Meja
                    </span>
                  </Link>

                  <Link
                    href="/catalog/arms-brackets"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700/80 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-semibold text-gp-ink-100 group-hover:text-white">Arm & Bracket Monitor</span>
                        <span className="text-3xs text-gp-ink-400">Gas spring arm & mount adapter</span>
                      </div>
                    </div>
                    <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                      Arm & Mount
                    </span>
                  </Link>

                  <Link
                    href="/catalog/accessories"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700/80 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-semibold text-gp-ink-100 group-hover:text-white">Aksesoris Setup</span>
                        <span className="text-3xs text-gp-ink-400">Screenbar, kabel, & cable mgmt</span>
                      </div>
                    </div>
                    <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold">
                      Aksesoris
                    </span>
                  </Link>

                  {showChairs && (
                    <Link
                      href="/catalog/chairs"
                      onClick={() => setOpenDropdown(null)}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700/80 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded bg-purple-500/10 text-purple-400">
                          <span className="text-xs">🪑</span>
                        </div>
                        <div>
                          <span className="block font-semibold text-gp-ink-100 group-hover:text-white">Kursi Ergonomis</span>
                          <span className="text-3xs text-gp-ink-400">Kurasi mesh lumbar & gas lift</span>
                        </div>
                      </div>
                      <span className="text-4xs font-mono px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold">
                        DRAFT
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Menu 2: Aftersales with Submenu */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "aftersales" ? null : "aftersales")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isAftersalesActive
                    ? "bg-gp-ink-700 text-white shadow-sm"
                    : "text-gp-ink-300 hover:text-gp-ink-100"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Aftersales</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === "aftersales" ? "rotate-180" : ""}`} />
              </button>

              {openDropdown === "aftersales" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gp-ink-750 border border-gp-ink-650 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-1">
                  <div className="text-3xs font-bold text-gp-ink-400 px-2 py-1 uppercase tracking-wider">
                    Aftersales & Garansi Brand
                  </div>
                  <Link
                    href="/guide/brand/aftersales-rma"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors block group"
                  >
                    <span className="block font-semibold">Aftersales Brand Tier List</span>
                    <span className="text-3xs text-gp-ink-400 font-mono group-hover:text-gp-mint">/guide/brand/aftersales-rma</span>
                  </Link>
                  <Link
                    href="/guide/brand/odm-layak-dibeli"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors block group"
                  >
                    <span className="block font-semibold">Brand ODM Monitor Layak Dibeli?</span>
                    <span className="text-3xs text-gp-ink-400 font-mono group-hover:text-gp-mint">/guide/brand/odm-layak-dibeli</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Menu 3: Panduan & Sub-pages */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "more" ? null : "more")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isMoreActive
                    ? "bg-gp-ink-700 text-white shadow-sm"
                    : "text-gp-ink-300 hover:text-gp-ink-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Panduan & Info</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === "more" ? "rotate-180" : ""}`} />
              </button>

              {openDropdown === "more" && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-gp-ink-750 border border-gp-ink-650 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 max-h-[80vh] overflow-y-auto space-y-1">
                  <div className="text-3xs font-bold text-gp-ink-400 px-2.5 py-1 uppercase tracking-wider">
                    Panduan & Edukasi (/guide/...)
                  </div>
                  <Link
                    href="/guide/faq"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors flex items-start gap-2 group"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">QnA & FAQ Section</span>
                      <span className="text-3xs text-gp-ink-400 font-mono group-hover:text-gp-mint">/guide/faq</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/sdr/glossary"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors flex items-start gap-2 group"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">How to Read GrayPlasma Glossary</span>
                      <span className="text-3xs text-gp-ink-400 font-mono group-hover:text-gp-mint">/guide/sdr/glossary</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/display/bandwidth-dp-hdmi"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors flex items-start gap-2 group"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Bandwidth DP 1.4 vs HDMI 2.1</span>
                      <span className="text-3xs text-gp-ink-400 font-mono group-hover:text-gp-mint">/guide/display/bandwidth-dp-hdmi</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/setup/ukuran-meja-monitor-ideal"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors flex items-start gap-2 group"
                  >
                    <Ruler className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Ukuran Meja & Monitor Ideal (24" / 27")</span>
                      <span className="text-3xs text-gp-ink-400 font-mono group-hover:text-gp-mint">/guide/setup/ukuran-meja-monitor-ideal</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/setup/meja-ergonomi"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors flex items-start gap-2 group"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Rekomendasi Meja & Monitor Arm</span>
                      <span className="text-3xs text-gp-ink-400 font-mono group-hover:text-gp-mint">/guide/setup/meja-ergonomi</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/oled/perawatan-burn-in"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors flex items-start gap-2 group"
                  >
                    <SunMedium className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Panduan Lengkap OLED & Burn-in</span>
                      <span className="text-3xs text-gp-ink-400 font-mono group-hover:text-gp-mint">/guide/oled/perawatan-burn-in</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/warna/akurasi-d65-p3"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors flex items-start gap-2 group"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">D65-P3 Undersaturated Guide</span>
                      <span className="text-3xs text-gp-ink-400 font-mono group-hover:text-gp-mint">/guide/warna/akurasi-d65-p3</span>
                    </div>
                  </Link>

                  <div className="text-3xs font-bold text-gp-ink-400 px-2.5 py-1 uppercase tracking-wider border-t border-gp-ink-650 mt-1 pt-1">
                    Komunitas & Penulis
                  </div>
                  <Link
                    href="/guide/about/tentang-penulis"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors flex items-start gap-2 group"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Tentang Website & Penulis</span>
                      <span className="text-3xs text-gp-ink-400 font-mono group-hover:text-gp-mint">/guide/about/tentang-penulis</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/support/donasi-penulis"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors flex items-start gap-2 group"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Support & Donasi Penulis</span>
                      <span className="text-3xs text-gp-ink-400 font-mono group-hover:text-gp-mint">/guide/support/donasi-penulis</span>
                    </div>
                  </Link>
                  <Link
                    href="/guide/consultation/konsultasi-joel-gray"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors flex items-start gap-2 group"
                  >
                    <Headphones className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-semibold">Konsultasi WA / Discord</span>
                      <span className="text-3xs text-gp-ink-400 font-mono group-hover:text-gp-mint">/guide/consultation/konsultasi-joel-gray</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Instant Search Bar */}
          <div className="flex-1 min-w-0 max-w-xs sm:max-w-md mx-1 sm:mx-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gp-ink-400 group-focus-within:text-emerald-400 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari monitor..."
                className="w-full bg-gp-ink-950 border border-gp-ink-700 rounded-lg pl-9 pr-14 py-2 text-xs sm:text-sm text-white placeholder-gp-ink-400 focus:outline-none focus:border-gp-ink-500 transition-colors"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1 pointer-events-none">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSearchChange("");
                    }}
                    className="pointer-events-auto text-gp-ink-400 hover:text-white p-1 rounded hover:bg-gp-ink-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center text-3xs font-mono text-gp-ink-300 bg-gp-ink-800 border border-gp-ink-700 px-1.5 py-0.5 rounded">
                    [ / ]
                  </kbd>
                )}
              </div>
            </div>
          </div>

          {/* Right Action: WhatsApp Consultation */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleMobileFilter}
              className="lg:hidden flex items-center gap-1.5 border-gp-ink-700 bg-gp-ink-900"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-black font-bold text-3xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <a
              href={siteSettings.consultation?.whatsappUrl || CONSULTATION_DATA.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:border-orange-400 text-xs font-semibold text-orange-400 hover:bg-orange-500 hover:text-gp-ink-950 active:translate-y-[1px] transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Tanya Joel</span>
            </a>
          </div>
        </div>

        {/* Mobile Horizontal Menu Bar — scroll-x + fade di tepi kanan biar
            user tahu masih ada tab berikutnya (sebelumnya kepotong diam-diam) */}
        <div className="relative lg:hidden">
          <div className="flex items-center gap-2 py-2 border-t border-gp-ink-800 overflow-x-auto no-scrollbar scroll-smooth">
          <MobileNavLink href="/" label="Beranda" active={currentKey === "home"} />
          <MobileNavLink
            href="/guide/brand/aftersales-rma"
            label="Aftersales"
            active={isAftersalesActive}
          />
          <MobileNavLink
            href="/guide/setup/meja-ergonomi"
            label="Meja & Setup"
            active={currentKey === "desk-guide" || currentKey === "hdr-guide"}
          />
          <MobileNavLink href="/guide/faq" label="QnA & FAQ" active={currentKey === "faq"} />
          <MobileNavLink
            href="/guide/display/bandwidth-dp-hdmi"
            label="Bandwidth"
            active={currentKey === "bandwidth-guide"}
          />
          <MobileNavLink
            href="/guide/oled/perawatan-burn-in"
            label="OLED Care"
            active={false}
          />
          <MobileNavLink
            href="/guide/sdr/glossary"
            label="Glosarium"
            active={currentKey === "glossary"}
          />
          <MobileNavLink
            href="/guide/about/tentang-penulis"
            label="Tentang"
            active={currentKey === "about"}
          />
          <MobileNavLink
            href="/guide/support/donasi-penulis"
            label="Donasi"
            active={currentKey === "support-donasi"}
          />
          </div>
          {/* Fade hint di tepi kanan (pointer-events-none, 0 layout cost) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-gp-ink-950 via-gp-ink-950/80 to-transparent"
          />
        </div>
      </div>
    </header>
  );
}

/**
 * Item menu baris horizontal di mobile.
 * Semua item pakai aturan yang sama: aktif -> surface terang + teks putih,
 * non-aktif -> teks netral. Tidak ada warna aksen hardcoded per item.
 */
function MobileNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
        active ? "bg-gp-ink-700 text-white" : "text-gp-ink-300 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}
