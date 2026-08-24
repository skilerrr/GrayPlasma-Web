"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  ArrowUpDown,
  SearchX,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  Info,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Check,
  Tv,
  Zap,
  LayoutGrid,
  SunMedium,
  Headphones,
  FileText,
  PhoneCall,
  Send,
  SlidersHorizontal,
  ChevronRight,
  ArrowLeft,
  Layers,
  Flame,
  Award,
  HelpCircle,
  Clock,
  ArrowRight,
  Heart,
  QrCode,
  DollarSign,
  User,
  Coffee,
} from "lucide-react";
import {
  Monitor,
  FilterState,
  QuickFilterTab,
  TierRating,
} from "@/types/monitor";
import { MONITORS_DATA } from "@/data/monitors";
import {
  DESK_GUIDES,
  HDR_GUIDES,
  GRAYNOTES_LIST,
  CONSULTATION_DATA,
  AFTERSALES_DATA,
  ABOUT_NOTION_CONTENT,
  HOW_TO_READ_GLOSSARY,
  OLED_DEEP_DIVE,
} from "@/data/grayplasma-content";
import { Navbar, NavMenuKey } from "@/components/navbar";
import { FilterBar } from "@/components/filter-bar";
import { MonitorCard } from "@/components/monitor-card";
import { MonitorModal } from "@/components/monitor-modal";
import { NotionTableView } from "@/components/notion-table-view";
import { DeskPeripheralsView } from "@/components/desk-peripherals-view";
import { GPLogo } from "@/components/gp-logo";
import { Button } from "@/components/ui/button";

const INITIAL_FILTER_STATE: FilterState = {
  searchQuery: "",
  quickTab: "all",
  budgetRange: [0, 25000000],
  budgetPreset: null,
  panelTypes: [],
  refreshRates: [],
  screenSizes: [],
  resolutions: [],
  tiers: [],
  sortBy: "tier",
};

import { DatabaseService } from "@/lib/db-service";

export default function CatalogPage() {
  const [monitorsData, setMonitorsData] = useState<Monitor[]>(MONITORS_DATA);
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuKey, setActiveMenuKey] = useState<NavMenuKey | "home">("home");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  useEffect(() => {
    async function loadData() {
      try {
        const loaded = await DatabaseService.getMonitors();
        setMonitorsData(loaded);
      } catch (e) {
        console.error("Failed to load dynamic monitors", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle menu selection
  const handleMenuSelect = (key: NavMenuKey | "home") => {
    setActiveMenuKey(key);
    if (key === "catalog-1080p") {
      setFilterState((prev) => ({ ...prev, resolutions: ["FHD (1080p)"], panelTypes: [] }));
    } else if (key === "catalog-1440p") {
      setFilterState((prev) => ({ ...prev, resolutions: ["2K (1440p)"], panelTypes: [] }));
    } else if (key === "catalog-4k") {
      setFilterState((prev) => ({ ...prev, resolutions: ["4K (2160p)"], panelTypes: [] }));
    } else if (key === "catalog-oled") {
      setFilterState((prev) => ({ ...prev, panelTypes: ["OLED"], resolutions: [] }));
    } else if (key === "catalog-all") {
      setFilterState((prev) => ({ ...prev, resolutions: [], panelTypes: [] }));
    }
  };

  const handleQuickTabChange = (tab: QuickFilterTab) => {
    setFilterState((prev) => {
      if (tab === "all") {
        return { ...prev, quickTab: "all", tiers: [], panelTypes: [], budgetPreset: null, budgetRange: [0, 25000000] };
      }
      if (tab === "s-tier") {
        return { ...prev, quickTab: "s-tier", tiers: ["S-TIER"], budgetPreset: null, budgetRange: [0, 25000000] };
      }
      if (tab === "budget") {
        return { ...prev, quickTab: "budget", budgetPreset: "under-1.5m", budgetRange: [0, 2000000], tiers: [] };
      }
      if (tab === "esport") {
        return { ...prev, quickTab: "esport", refreshRates: ["240Hz+"], tiers: [] };
      }
      if (tab === "productivity") {
        return { ...prev, quickTab: "productivity", resolutions: ["2K (1440p)"], tiers: [] };
      }
      if (tab === "oled") {
        return { ...prev, quickTab: "oled", panelTypes: ["OLED"], tiers: [] };
      }
      return { ...prev, quickTab: tab };
    });
  };

  const handleResetFilters = () => {
    setFilterState(INITIAL_FILTER_STATE);
  };

  // Filter & sort
  const filteredMonitors = useMemo(() => {
    return monitorsData.filter((item) => {
      // 1. Search Query
      if (filterState.searchQuery.trim()) {
        const query = filterState.searchQuery.toLowerCase();
        const searchableText = `${item.fullName} ${item.brand} ${item.model} ${item.specs.display.panelType} ${item.specs.display.refreshRate}Hz ${item.tags.join(" ")} ${item.tier}`.toLowerCase();
        if (!searchableText.includes(query)) return false;
      }

      // 2. Budget Range
      if (item.price > filterState.budgetRange[1]) return false;

      // 3. Panel Types
      if (filterState.panelTypes.length > 0) {
        const hasMatchingPanel = filterState.panelTypes.some((p) =>
          item.specs.display.panelType.toLowerCase().includes(p.toLowerCase())
        );
        if (!hasMatchingPanel) return false;
      }

      // 4. Refresh Rates
      if (filterState.refreshRates.length > 0) {
        const rate = item.specs.display.refreshRate;
        const matchesRate = filterState.refreshRates.some((opt) => {
          if (opt === "100Hz") return rate <= 100;
          if (opt === "144Hz") return rate === 144;
          if (opt === "165Hz–180Hz") return rate >= 165 && rate <= 180;
          if (opt === "240Hz+") return rate >= 240;
          return false;
        });
        if (!matchesRate) return false;
      }

      // 5. Screen Sizes
      if (filterState.screenSizes.length > 0) {
        const sizeStr = item.specs.display.size.toLowerCase();
        const matchesSize = filterState.screenSizes.some((opt) => {
          if (opt === "24\"") return sizeStr.includes("23.") || sizeStr.includes("24");
          if (opt === "27\"") return sizeStr.includes("26.") || sizeStr.includes("27");
          if (opt === "32\"") return sizeStr.includes("32");
          if (opt === "Ultrawide") return sizeStr.includes("ultrawide") || sizeStr.includes("34");
          return false;
        });
        if (!matchesSize) return false;
      }

      // 6. Resolutions
      if (filterState.resolutions.length > 0) {
        const resStr = item.specs.display.resolution.toLowerCase();
        const matchesRes = filterState.resolutions.some((opt) => {
          if (opt === "FHD (1080p)") return resStr.includes("1080") || resStr.includes("fhd");
          if (opt === "2K (1440p)") return resStr.includes("1440") || resStr.includes("2k");
          if (opt === "4K (2160p)") return resStr.includes("2160") || resStr.includes("4k");
          return false;
        });
        if (!matchesRes) return false;
      }

      // 7. Tiers
      if (filterState.tiers.length > 0) {
        if (!filterState.tiers.includes(item.tier)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === "price-asc") return a.price - b.price;
      if (filterState.sortBy === "price-desc") return b.price - a.price;
      if (filterState.sortBy === "refresh-desc") return b.specs.display.refreshRate - a.specs.display.refreshRate;
      if (filterState.sortBy === "tier") {
        const tierWeights: Record<TierRating, number> = {
          "S-TIER": 4,
          "BEST VALUE": 3,
          "RECOMMENDED": 2,
          "PASS": 1,
        };
        return (tierWeights[b.tier] || 0) - (tierWeights[a.tier] || 0);
      }
      return 0;
    });
  }, [filterState, monitorsData]);

  // Featured top picks
  const featuredMonitors = useMemo(() => {
    return monitorsData.filter((m) => m.tier === "S-TIER" || m.tier === "BEST VALUE").slice(0, 6);
  }, [monitorsData]);

  const activeFilterCount =
    (filterState.panelTypes.length > 0 ? 1 : 0) +
    (filterState.refreshRates.length > 0 ? 1 : 0) +
    (filterState.screenSizes.length > 0 ? 1 : 0) +
    (filterState.resolutions.length > 0 ? 1 : 0) +
    (filterState.tiers.length > 0 ? 1 : 0) +
    (filterState.budgetPreset !== null || filterState.budgetRange[1] < 25000000 ? 1 : 0);

  const isCatalog = activeMenuKey.startsWith("catalog");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-emerald-500 selection:text-black font-sans">
      {/* Sticky Header */}
      <Navbar
        searchQuery={filterState.searchQuery}
        onSearchChange={(query) => {
          setFilterState((prev) => ({ ...prev, searchQuery: query }));
          if (query && activeMenuKey === "home") {
            setActiveMenuKey("catalog-all");
          }
        }}
        activeQuickTab={filterState.quickTab}
        onQuickTabChange={handleQuickTabChange}
        onToggleMobileFilter={() => setIsMobileDrawerOpen(true)}
        activeFilterCount={activeFilterCount}
        totalMonitorsCount={monitorsData.length}
        activeMenuKey={activeMenuKey}
        onMenuSelect={handleMenuSelect}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* Full-width Notion Cover Banner (Exact match to Image 1) */}
        <section className="relative w-full rounded-3xl overflow-hidden border border-zinc-800/90 mb-8 bg-[#09090b]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a20_1px,transparent_1px),linear-gradient(to_bottom,#1a1a20_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:44px_44px] pointer-events-none opacity-85" />
          
          <div className="relative z-10 py-12 sm:py-16 md:py-20 px-6 flex flex-col items-center justify-center text-center">
            {/* Ghost WELCOME watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span className="text-zinc-800/40 sm:text-zinc-800/60 font-black tracking-tight text-6xl sm:text-8xl md:text-9xl uppercase transform scale-110">
                WELCOME
              </span>
            </div>

            {/* Foreground Title */}
            <div className="relative z-20 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-zinc-700 text-[11px] font-bold tracking-widest text-zinc-300 uppercase shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>GRAYPLASMAID • REKOMENDASI MONITOR</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight max-w-4xl drop-shadow-md">
                GRAYPLASMA • MONITOR UNAFFORDABLE
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Database Pengujian & Kurasi Monitor Independen kolaborasi Joel Gray (@gray1plasma) x GlaciK dengan data pengetesan GTID Tech.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* VIEW: NOTION-STYLE HOMEPAGE                                               */}
        {/* ========================================================================= */}
        {activeMenuKey === "home" && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* Notion Header & Icon Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div className="flex items-center gap-4">
                <GPLogo className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    GRAYPLASMAID - REKOMENDASI MONITOR
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Database Rekomendasi Monitor oleh Joel Gray x GlaciK berdasarkan data pengetesan GTID Tech.
                  </p>
                </div>
              </div>

              {/* Consultation WA & Discord CTA */}
              <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
                <a
                  href={CONSULTATION_DATA.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-colors shadow-neon-emerald"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Konsultasi WA</span>
                </a>
                <a
                  href={CONSULTATION_DATA.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold text-xs hover:bg-zinc-800 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Discord GTID</span>
                </a>
              </div>
            </div>

            {/* Notion Callout Box: Disclaimer */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 flex items-start gap-3.5 shadow-lg">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  Catatan Penting / Disclaimer GrayPlasma
                </h4>
                <p className="text-zinc-300 leading-relaxed">
                  {CONSULTATION_DATA.disclaimer}
                </p>
              </div>
            </div>

            {/* Support Penulis & Donasi Callout from Notion */}
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-dark border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Support & Donasi Penulis</h4>
                  <p className="text-xs text-zinc-400">
                    Bisa support melalui QRIS, Saweria, atau berbelanja menggunakan Link Affiliate yang tersedia.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMenuSelect("support-donasi")}
                className="text-xs font-bold flex-shrink-0"
              >
                <span>Lihat QRIS & Donasi →</span>
              </Button>
            </div>

            {/* Main Notion Page Hub: Sub-page Directories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Daftar Halaman & Sub-Page Notion</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Rekomendasi Monitor Hub */}
                <div
                  onClick={() => handleMenuSelect("catalog-all")}
                  className="group bg-surface-dark border border-zinc-800 hover:border-emerald-500/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-card-hover flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <Tv className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                          Rekomendasi Monitor ({monitorsData.length} Model Teruji)
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Daftar kurasi monitor gaming & kerja dengan data pengujian response time GTID Tech, filter multi-kriteria, dan link Shopee / Tokopedia.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-4 mt-2 border-t border-zinc-900" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleMenuSelect("catalog-1080p")}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-300 border border-zinc-800 transition-colors"
                    >
                      1080p (FHD)
                    </button>
                    <button
                      onClick={() => handleMenuSelect("catalog-1440p")}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-300 border border-zinc-800 transition-colors"
                    >
                      1440p (2K Sweetspot)
                    </button>
                    <button
                      onClick={() => handleMenuSelect("catalog-oled")}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-300 border border-zinc-800 transition-colors"
                    >
                      OLED & 360Hz
                    </button>
                    <button
                      onClick={() => handleMenuSelect("catalog-4k")}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-300 border border-zinc-800 transition-colors"
                    >
                      4K Creator
                    </button>
                  </div>
                </div>

                {/* 2. Glossary Guide */}
                <div
                  onClick={() => handleMenuSelect("glossary")}
                  className="group bg-surface-dark border border-zinc-800 hover:border-cyan-500/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-card-hover flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          How to Read GTID Glossary (SDR)
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Panduan lengkap membaca metrik Delta E ITP (deITP), akurasi OSD sRGB/DCI-P3, contrast ratio, dan rumus Response Time Ideal vs Refresh Rate.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-2 border-t border-zinc-900 text-xs text-cyan-400 font-semibold">
                    <span>Baca Panduan Glosarium Lengkap →</span>
                  </div>
                </div>

                {/* 3. About Notion Page */}
                <div
                  onClick={() => handleMenuSelect("about")}
                  className="group bg-surface-dark border border-zinc-800 hover:border-violet-500/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-card-hover flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                          Tentang Website Ini & Penulis (Joel Gray)
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Latar belakang pembuatan website, cerita gap year penulis Joel Gray (@gray1plasma), serta kolaborasi dengan @GlaciK & GTID Tech.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-2 border-t border-zinc-900 text-xs text-violet-400 font-semibold">
                    <span>Baca Kisah & Latar Belakang →</span>
                  </div>
                </div>

                {/* 4. Aftersales Brand Hub */}
                <div
                  onClick={() => handleMenuSelect("aftersales-tier")}
                  className="group bg-surface-dark border border-zinc-800 hover:border-amber-500/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-card-hover flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                          Aftersales & Garansi Brand di Indonesia
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Tinjauan jujur kualitas layanan purna jual distributor (Dell ProSupport Onsite, LG, Asus, ViewSonic, Xiaomi, MSI, serta catatan RMA AOC).
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-2 border-t border-zinc-900 text-xs text-amber-400 font-semibold">
                    <span>Lihat Tier List Distributor →</span>
                  </div>
                </div>

                {/* 5. Rekomendasi Meja & Setup */}
                <div
                  onClick={() => handleMenuSelect("desk-guide")}
                  className="group bg-surface-dark border border-zinc-800 hover:border-cyan-500/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-card-hover flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <LayoutGrid className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          Rekomendasi Meja & Gimmick Meja Gaming
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Panduan kedalaman meja (50cm, 60cm, 70-80cm) vs ukuran layar ideal dan rekomendasi gas spring monitor arm VESA.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-2 border-t border-zinc-900 text-xs text-cyan-400 font-semibold">
                    <span>Lihat Panduan Ergonomi Meja →</span>
                  </div>
                </div>

                {/* 6. True HDR vs Fake HDR 400 */}
                <div
                  onClick={() => handleMenuSelect("hdr-guide")}
                  className="group bg-surface-dark border border-zinc-800 hover:border-rose-500/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-card-hover flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                          <SunMedium className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                          Monitor HDR (True HDR vs Fake HDR 400)
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Edukasi mengapa DisplayHDR 400 di panel IPS standar tanpa local dimming adalah gimik marketing & daftar monitor True HDR sejati.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-2 border-t border-zinc-900 text-xs text-rose-400 font-semibold">
                    <span>Pelajari Perbedaan HDR →</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notion Database Table Section directly on Homepage (Tabel demi tabel yang panjang ke samping) */}
            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <Tv className="w-5 h-5 text-emerald-400" />
                    <span>Database Rekomendasi Monitor (Tabel Interaktif Notion)</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Tabel lengkap seluruh model dengan spesifikasi display, data response time GTID, stand capability, VESA mount, dan link pembelian Shopee. Geser ke samping untuk melihat seluruh kolom.
                  </p>
                </div>

                <Button
                  variant="cyber"
                  size="sm"
                  onClick={() => handleMenuSelect("catalog-all")}
                  className="self-start sm:self-auto text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Buka Mode Filter Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Full-width interactive horizontal scrollable Notion Table */}
              <NotionTableView
                monitors={monitorsData}
                onSelectMonitor={(m) => setSelectedMonitor(m)}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: TENTANG WEBSITE INI & PENULIS (ABOUT NOTION PAGE)                    */}
        {/* ========================================================================= */}
        {activeMenuKey === "about" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama Notion</span>
              </button>
              <span className="text-xs text-zinc-500">Tentang Penulis</span>
            </div>

            <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-zinc-800 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold">
                  <User className="w-3.5 h-3.5" />
                  <span>Profil & Cerita Penulis</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  {ABOUT_NOTION_CONTENT.title}
                </h2>
                <p className="text-xs text-zinc-400">{ABOUT_NOTION_CONTENT.subtitle}</p>
              </div>

              {/* Part 1: Latar Belakang */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-emerald-400 uppercase tracking-wider">
                  PART 1 | LATAR BELAKANG
                </h3>
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed space-y-3">
                  <h4 className="font-bold text-white">1.1 WEBSITE GRAYPLASMA</h4>
                  <p>{ABOUT_NOTION_CONTENT.latarBelakang}</p>
                </div>
              </div>

              {/* Part 2: Penulis Joel Gray */}
              <div className="space-y-3">
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed space-y-3">
                  <h4 className="font-bold text-white">1.2 PENULIS (Joel Gray / El)</h4>
                  <p>{ABOUT_NOTION_CONTENT.biodataPenulis}</p>
                </div>
              </div>

              {/* Collaborators Box */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs flex items-center justify-between">
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold">Hasil Kerjasama:</span>
                  <span className="font-bold text-white">@GrayPlasma (Penulis) & @GlaciK • Data GTID Tech</span>
                </div>
                <a
                  href={CONSULTATION_DATA.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>YouTube GTID</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: HOW TO READ GTID GLOSSARY                                           */}
        {/* ========================================================================= */}
        {activeMenuKey === "glossary" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama Notion</span>
              </button>
              <span className="text-xs text-zinc-500">How to Read Glossary</span>
            </div>

            <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-zinc-800 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Data Pengetesan GTID</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  {HOW_TO_READ_GLOSSARY.title}
                </h2>
                <p className="text-xs text-zinc-400">{HOW_TO_READ_GLOSSARY.subtitle}</p>
              </div>

              {/* Sections */}
              <div className="space-y-5">
                {HOW_TO_READ_GLOSSARY.sections.map((sec, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                      {sec.title}
                    </h3>
                    <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                      {sec.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Case Study Box */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                  Contoh Studi Kasus: Skyworth H27G30Q & Acer EK251Q Ebi
                </h3>
                <div className="text-xs text-zinc-300 leading-relaxed space-y-2">
                  <p>
                    - <strong>Skyworth H27G30Q:</strong> Pada glosarium tertulis OSD sRGB 4.87 deITP, namun di video review 5.75 deITP karena kolom tersebut diisi preset Rec.709.
                  </p>
                  <p>
                    - <strong>Acer EK251Q Ebi:</strong> Data sRGB akurat tapi tidak nyaman dipakai harian karena fitur Ultra Sharpness dipaksa selalu On.
                  </p>
                  <p className="text-emerald-400 font-bold pt-1">
                    Solusi: Selalu tanyakan ke Joel Gray sebelum checkout agar tidak salah memilih!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: SUPPORT & DONASI PENULIS                                             */}
        {/* ========================================================================= */}
        {activeMenuKey === "support-donasi" && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama Notion</span>
              </button>
              <span className="text-xs text-zinc-500">Support & Donasi</span>
            </div>

            <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Support & Donasi Penulis
                </h2>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Jika panduan dan kurasi monitor ini membantu Anda dalam memilih monitor idaman, Anda dapat memberikan apresiasi melalui QRIS / Saweria.
                </p>
              </div>

              {/* QRIS Placeholder Container */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-sm mx-auto space-y-4">
                <div className="w-48 h-48 bg-zinc-900 border border-zinc-700 rounded-xl mx-auto flex flex-col items-center justify-center text-center p-4">
                  <QrCode className="w-16 h-16 text-emerald-400 mb-2" />
                  <span className="text-xs font-bold text-white">QRIS All Payment</span>
                  <span className="text-[10px] text-zinc-500">Gopay / OVO / Dana / BCA</span>
                </div>
                <div className="text-xs text-zinc-300">
                  <strong>Saweria GrayPlasma:</strong> saweria.co/grayplasma
                </div>
              </div>

              {/* Business Inquiries */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 max-w-md mx-auto">
                <strong className="text-white block mb-1">Business Inquiries & Konsultasi:</strong>
                <span>WhatsApp: {CONSULTATION_DATA.whatsapp} (a.n Joel Gray)</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: MONITOR CATALOG VIEW (When a category is clicked)                   */}
        {/* ========================================================================= */}
        {isCatalog && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb back to Home */}
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama Notion</span>
              </button>

              <span className="text-xs text-zinc-500">
                {activeMenuKey === "catalog-1080p" && "Kategori: 1080p (FHD)"}
                {activeMenuKey === "catalog-1440p" && "Kategori: 1440p (2K)"}
                {activeMenuKey === "catalog-oled" && "Kategori: OLED & Flagship"}
                {activeMenuKey === "catalog-4k" && "Kategori: 4K UHD"}
                {activeMenuKey === "catalog-all" && "Semua Rekomendasi"}
              </span>
            </div>

            <div className="flex gap-8 items-start">
              <FilterBar
                filterState={filterState}
                onFilterChange={setFilterState}
                onResetFilters={handleResetFilters}
                isMobileDrawerOpen={isMobileDrawerOpen}
                onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
                totalFilteredCount={filteredMonitors.length}
              />

              <section className="flex-1 w-full min-w-0">
                {/* Results Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-surface-dark border border-zinc-800 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">
                      Menampilkan {filteredMonitors.length} Model Monitor
                    </span>
                    {filterState.searchQuery && (
                      <span className="text-xs text-zinc-400">
                        untuk &ldquo;<span className="text-emerald-400">{filterState.searchQuery}</span>&rdquo;
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5">
                      <button
                        onClick={() => setViewMode("table")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          viewMode === "table"
                            ? "bg-zinc-800 text-emerald-400 shadow-sm"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        📋 Tabel Notion
                      </button>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          viewMode === "grid"
                            ? "bg-zinc-800 text-emerald-400 shadow-sm"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        🔲 Kartu Grid
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                      <select
                        value={filterState.sortBy}
                        onChange={(e) =>
                          setFilterState((prev) => ({
                            ...prev,
                            sortBy: e.target.value as FilterState["sortBy"],
                          }))
                        }
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="tier">Tier Rekomendasi</option>
                        <option value="price-asc">Harga Termurah</option>
                        <option value="price-desc">Harga Tertinggi</option>
                        <option value="refresh-desc">Refresh Rate Tertinggi</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* View Content (Table or Grid) */}
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div
                        key={n}
                        className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-4 animate-pulse"
                      >
                        <div className="w-full aspect-[16/10] bg-zinc-900 rounded-xl" />
                        <div className="w-3/4 h-5 bg-zinc-900 rounded" />
                        <div className="w-full h-9 bg-zinc-900 rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : filteredMonitors.length > 0 ? (
                  viewMode === "table" ? (
                    <NotionTableView
                      monitors={filteredMonitors}
                      onSelectMonitor={(m) => setSelectedMonitor(m)}
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {filteredMonitors.map((monitor) => (
                        <MonitorCard
                          key={monitor.id}
                          monitor={monitor}
                          onSelectMonitor={(m) => setSelectedMonitor(m)}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="bg-surface-dark border border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 my-6">
                    <SearchX className="w-10 h-10 text-zinc-500" />
                    <div className="space-y-1 max-w-sm">
                      <h3 className="text-base font-bold text-white uppercase tracking-wider">
                        Tidak Ditemukan Monitor yang Cocok
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Coba sesuaikan filter atau reset kata kunci pencarian.
                      </p>
                    </div>
                    <Button
                      variant="cyber"
                      size="sm"
                      onClick={handleResetFilters}
                      className="flex items-center gap-2 text-xs font-bold mt-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filter</span>
                    </Button>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: AFTERSALES BRAND TIER LIST                                          */}
        {/* ========================================================================= */}
        {activeMenuKey === "aftersales-tier" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama Notion</span>
              </button>
              <span className="text-xs text-zinc-500">Aftersales & Garansi Brand</span>
            </div>

            <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  Tinjauan Kualitas Aftersales & Garansi Brand Monitor di Indonesia
                </h2>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                Catatan jujur berdasarkan rekam jejak garansi distributor, kecepatan perbaikan, ketersediaan suku cadang, dan kemudahan klaim di Indonesia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {AFTERSALES_DATA.map((brand, idx) => (
                <div
                  key={idx}
                  className={`bg-zinc-950/90 border rounded-2xl p-5 space-y-3 transition-all ${
                    brand.rating === "S"
                      ? "border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : brand.rating === "A"
                      ? "border-cyan-500/40"
                      : brand.rating === "WARNING"
                      ? "border-rose-500/50 bg-rose-950/10"
                      : "border-zinc-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white">{brand.brand}</h3>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            brand.rating === "S"
                              ? "bg-emerald-500 text-black"
                              : brand.rating === "A"
                              ? "bg-cyan-500 text-black"
                              : brand.rating === "WARNING"
                              ? "bg-rose-500 text-white font-bold"
                              : "bg-zinc-800 text-zinc-200"
                          }`}
                        >
                          Tier {brand.rating}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        Distributor: {brand.distributor} • Garansi: {brand.warrantyPeriod}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                        brand.status === "Sangat Direkomendasikan"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : brand.status === "Bagus & Aman"
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                          : brand.status === "Perlu Perhatian / Lama"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800"
                      }`}
                    >
                      {brand.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                    {brand.summary}
                  </p>

                  <ul className="space-y-1.5 pt-1">
                    {brand.points.map((pt, i) => (
                      <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: REKOMENDASI MEJA, SETUP, & PERIPHERALS                              */}
        {/* ========================================================================= */}
        {activeMenuKey === "desk-guide" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama Notion</span>
              </button>
              <span className="text-xs text-zinc-500">Panduan Meja & Peripherals</span>
            </div>

            {/* Ergonomic Depth Guide Cards */}
            <div className="space-y-4">
              <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <LayoutGrid className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">
                    Panduan Ukuran Meja vs Ukuran Monitor (Ergonomi Jarak Pandang)
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                  Banyak orang salah membeli monitor 27 atau 32 inci pada meja berkedalaman sempit (50cm) sehingga mata cepat lelah dan leher pegal. Berikut panduan perhitungannya:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {DESK_GUIDES.map((guide, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        {guide.recommendedSizes}
                      </span>
                      <h3 className="text-base font-black text-white">{guide.deskDepth}</h3>
                      <div className="text-xs text-zinc-400">
                        <strong>Jarak Pandang Ideal:</strong> {guide.viewingDistance}
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                        {guide.notes}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-900 text-xs text-zinc-400">
                      <strong className="text-zinc-200 block mb-1">Rekomendasi Arm:</strong>
                      <span>{guide.monitorArmRecommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Desk & Peripherals Database Tables (Notion Collection) */}
            <DeskPeripheralsView />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: TRUE HDR VS FAKE HDR 400                                            */}
        {/* ========================================================================= */}
        {activeMenuKey === "hdr-guide" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama Notion</span>
              </button>
              <span className="text-xs text-zinc-500">Monitor HDR Guide</span>
            </div>

            <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-2">
                <SunMedium className="w-5 h-5 text-rose-400" />
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  Edukasi Monitor HDR: True HDR vs Fake DisplayHDR 400
                </h2>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                Banyak monitor murah mencantumkan label &ldquo;HDR10&rdquo; atau &ldquo;DisplayHDR 400&rdquo; sebagai gimik marketing. Tanpa teknologi Local Dimming atau panel OLED, menyalakan HDR di Windows justru merusak akurasi warna.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {HDR_GUIDES.map((hdr, idx) => (
                <div
                  key={idx}
                  className={`bg-zinc-950 border rounded-2xl p-5 space-y-4 flex flex-col justify-between ${
                    hdr.tier === "TRUE HDR"
                      ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : hdr.tier === "DECENT HDR"
                      ? "border-amber-500/40"
                      : "border-zinc-800"
                  }`}
                >
                  <div className="space-y-3">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        hdr.tier === "TRUE HDR"
                          ? "bg-emerald-500 text-black"
                          : hdr.tier === "DECENT HDR"
                          ? "bg-amber-500 text-black"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {hdr.tier}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug">{hdr.requirements}</h3>
                    
                    <div className="space-y-1.5 text-xs text-zinc-400">
                      <div><strong>Peak Brightness:</strong> {hdr.peakBrightness}</div>
                      <div><strong>Dimming Zones:</strong> {hdr.dimmingZones}</div>
                      <div><strong>Kontras:</strong> {hdr.contrastRatio}</div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                      {hdr.verdict}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-900 text-xs">
                    <strong className="text-zinc-400 block mb-1">Contoh Monitor:</strong>
                    <div className="space-y-1">
                      {hdr.models.map((m, i) => (
                        <div key={i} className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                          <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: GRAYNOTES & PANDUAN TEKNIS                                          */}
        {/* ========================================================================= */}
        {activeMenuKey === "graynotes-all" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama Notion</span>
              </button>
              <span className="text-xs text-zinc-500">GrayNotes Teknis</span>
            </div>

            <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  GrayNotes: Catatan Teknis & Pengujian Monitor
                </h2>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                Rangkuman materi penting seputar port DisplayPort vs HDMI, cara membaca response time GTID, proteksi OLED, dan kebijakan klaim dead pixel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {GRAYNOTES_LIST.map((note) => (
                <div key={note.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      {note.category}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white">{note.title}</h3>
                  
                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                    {note.summary}
                  </p>

                  <ul className="space-y-1.5">
                    {note.details.map((d, idx) => (
                      <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  {note.warning && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      {note.warning}
                    </div>
                  )}

                  <div className="pt-2 border-t border-zinc-900 text-xs text-emerald-400">
                    <strong>Rekomendasi:</strong> {note.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: KONSULTASI & KONTAK                                                 */}
        {/* ========================================================================= */}
        {activeMenuKey === "consultation" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama Notion</span>
              </button>
              <span className="text-xs text-zinc-500">Kontak & Konsultasi</span>
            </div>

            <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6 sm:p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <Headphones className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Konsultasi Rekomendasi Monitor (Joel Gray)
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Bingung memilih monitor yang cocok untuk spesifikasi PC, ukuran meja, dan anggaran Anda? Hubungi langsung via WhatsApp atau Discord.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* WhatsApp */}
              <a
                href={CONSULTATION_DATA.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/60 hover:bg-zinc-900 transition-all text-center space-y-2 group"
              >
                <PhoneCall className="w-6 h-6 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-white">WhatsApp Langsung</h3>
                <p className="text-xs text-zinc-400 font-mono">{CONSULTATION_DATA.whatsapp}</p>
                <span className="text-[11px] font-bold text-emerald-400 block pt-1">Chat Sekarang →</span>
              </a>

              {/* TikTok */}
              <a
                href={CONSULTATION_DATA.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-rose-500/60 hover:bg-zinc-900 transition-all text-center space-y-2 group"
              >
                <Send className="w-6 h-6 text-rose-400 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-white">TikTok</h3>
                <p className="text-xs text-zinc-400">{CONSULTATION_DATA.tiktok}</p>
                <span className="text-[11px] font-bold text-rose-400 block pt-1">Follow & Tanya di Live →</span>
              </a>

              {/* Discord */}
              <a
                href={CONSULTATION_DATA.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/60 hover:bg-zinc-900 transition-all text-center space-y-2 group"
              >
                <MessageSquare className="w-6 h-6 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-white">Discord Community</h3>
                <p className="text-xs text-zinc-400">GTID Tech & GrayPlasma</p>
                <span className="text-[11px] font-bold text-cyan-400 block pt-1">Join Server →</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Quick View Detail Modal Dialog */}
      <MonitorModal
        monitor={selectedMonitor}
        isOpen={Boolean(selectedMonitor)}
        onClose={() => setSelectedMonitor(null)}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-10 mt-16 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wider">
              GRAYPLASMA<span className="text-emerald-400">ID</span>
            </span>
            <span>— Kolaborasi Data Rekomendasi Monitor & GTID Tech</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Daftar independen. Hak cipta materi ulasan milik GrayPlasma & GTID Tech.
          </p>
        </div>
      </footer>
    </div>
  );
}
