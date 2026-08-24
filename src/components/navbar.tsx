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
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 hidden sm:inline-block">
                  GTID TESTED
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden lg:block">
                Katalog & Panduan Rekomendasi Monitor
              </p>
            </div>
          </div>

          {/* Nav Dropdown Menus (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-950/90 border border-zinc-800 rounded-xl p-1">
            {/* Beranda */}
            <button
              onClick={() => onMenuSelect("home")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentKey === "home"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Beranda
            </button>

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
                <div className="absolute top-full left-0 mt-2 w-56 bg-surface-dark border border-zinc-800 rounded-xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[10px] font-bold text-zinc-500 px-2.5 py-1 uppercase tracking-wider">
                    Pilihan Kategori
                  </div>
                  <button
                    onClick={() => {
                      onMenuSelect("catalog-all");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center justify-between"
                  >
                    <span>Semua Monitor</span>
                    <span className="text-[10px] text-zinc-500">{totalMonitorsCount}</span>
                  </button>
                  <button
                    onClick={() => {
                      onMenuSelect("catalog-1080p");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    1080p (FHD Budget & Esport)
                  </button>
                  <button
                    onClick={() => {
                      onMenuSelect("catalog-1440p");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    1440p (2K Sweetspot)
                  </button>
                  <button
                    onClick={() => {
                      onMenuSelect("catalog-oled");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    OLED & Flagship Tier
                  </button>
                  <button
                    onClick={() => {
                      onMenuSelect("catalog-4k");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    4K UHD & Creator Special
                  </button>
                </div>
              )}
            </div>

            {/* Menu 2: Aftersales */}
            <button
              onClick={() => onMenuSelect("aftersales-tier")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isAftersalesActive
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Aftersales</span>
            </button>

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
                <div className="absolute top-full right-0 mt-2 w-64 bg-surface-dark border border-zinc-800 rounded-xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      onMenuSelect("glossary");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>How to Read GTID Glossary</span>
                  </button>
                  <button
                    onClick={() => {
                      onMenuSelect("about");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
                    <span>Tentang Website Ini & Penulis</span>
                  </button>
                  <button
                    onClick={() => {
                      onMenuSelect("desk-guide");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                    <span>Rekomendasi Meja & Arm</span>
                  </button>
                  <button
                    onClick={() => {
                      onMenuSelect("hdr-guide");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2"
                  >
                    <SunMedium className="w-3.5 h-3.5 text-rose-400" />
                    <span>True HDR vs Fake HDR 400</span>
                  </button>
                  <button
                    onClick={() => {
                      onMenuSelect("graynotes-all");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>GrayNotes (DP, Ghosting, dll.)</span>
                  </button>
                  <button
                    onClick={() => {
                      onMenuSelect("support-donasi");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2 border-t border-zinc-800 mt-1 pt-1"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>Support & Donasi Penulis</span>
                  </button>
                  <button
                    onClick={() => {
                      onMenuSelect("consultation");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-2"
                  >
                    <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Konsultasi WA / Discord</span>
                  </button>
                  <Link
                    href="/admin"
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:bg-zinc-900 transition-colors flex items-center gap-2 border-t border-zinc-800 mt-1 pt-1.5"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Admin Panel (CMS & Supabase)</span>
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

          {/* Right Action: WhatsApp Consultation & Admin Link */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-400 hover:text-white transition-all"
            >
              <span>Admin</span>
            </Link>

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
          <button
            onClick={() => onMenuSelect("home")}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              currentKey === "home" ? "bg-zinc-800 text-white" : "text-zinc-400"
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onMenuSelect("catalog-all")}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              currentKey === "catalog-all" ? "bg-zinc-800 text-white" : "text-zinc-400"
            }`}
          >
            Semua ({totalMonitorsCount})
          </button>
          <button
            onClick={() => onMenuSelect("catalog-1080p")}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              currentKey === "catalog-1080p" ? "bg-zinc-800 text-white" : "text-zinc-400"
            }`}
          >
            1080p
          </button>
          <button
            onClick={() => onMenuSelect("catalog-1440p")}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              currentKey === "catalog-1440p" ? "bg-zinc-800 text-white" : "text-zinc-400"
            }`}
          >
            1440p
          </button>
          <button
            onClick={() => onMenuSelect("catalog-oled")}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              currentKey === "catalog-oled" ? "bg-zinc-800 text-white" : "text-zinc-400"
            }`}
          >
            OLED
          </button>
          <button
            onClick={() => onMenuSelect("glossary")}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              currentKey === "glossary" ? "bg-zinc-800 text-white" : "text-zinc-400"
            }`}
          >
            Glosarium
          </button>
          <button
            onClick={() => onMenuSelect("about")}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              currentKey === "about" ? "bg-zinc-800 text-white" : "text-zinc-400"
            }`}
          >
            Tentang
          </button>
          <button
            onClick={() => onMenuSelect("support-donasi")}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              currentKey === "support-donasi" ? "bg-zinc-800 text-white" : "text-zinc-400"
            }`}
          >
            Donasi
          </button>
        </div>
      </div>
    </header>
  );
}
