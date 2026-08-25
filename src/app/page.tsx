"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
  ShoppingBag,
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
  FAQ_LIST,
  BANDWIDTH_GUIDANCES,
  BRANDS_TO_AVOID_DATA,
  BRAND_ODM_GUIDE,
} from "@/data/grayplasma-content";
import { PERIPHERALS_DATABASE } from "@/data/grayplasma-desk-peripherals";
import { formatRupiah } from "@/lib/utils";
import { Navbar, NavMenuKey } from "@/components/navbar";
import { FilterBar } from "@/components/filter-bar";
import { MonitorCard } from "@/components/monitor-card";
import { MonitorModal } from "@/components/monitor-modal";
import { MonitorSidePanel } from "@/components/monitor-side-panel";
import { NotionTableView } from "@/components/notion-table-view";
import { NotionKanbanBoard, NotionBoardCard } from "@/components/notion-kanban-board";
import { NotionAftersalesSidePanel } from "@/components/notion-aftersales-side-panel";
import {
  NOTION_AFTERSALES_COLUMNS,
  NOTION_AFTERSALES_CARDS,
} from "@/data/notion-aftersales-board-data";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";
import { DeskPeripheralsView } from "@/components/desk-peripherals-view";
import { GPLogo } from "@/components/gp-logo";
import { Footer } from "@/components/footer";
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
  const [bannerSettings, setBannerSettings] = useState<any>({
    homeBannerUrl: "",
    homeBannerTitle: "Katalog & Database Rekomendasi Monitor",
    homeBannerSubtitle: "Kurasi monitor independen kolaborasi Joel Gray (@gray1plasma) x GlaciK dengan pengujian laboratorium GTID Tech.",
  });
  const [selectedAftersalesCard, setSelectedAftersalesCard] = useState<NotionBoardCard | null>(null);
  const [isAftersalesPanelOpen, setIsAftersalesPanelOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedMonitors, loadedBanners] = await Promise.all([
          DatabaseService.getMonitors(),
          DatabaseService.getBannerSettings(),
        ]);
        setMonitorsData(loadedMonitors);
        if (loadedBanners) setBannerSettings(loadedBanners);
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

      {/* Main Content with dynamic rearrangement when Side-Peek Drawer opens */}
      <main className={`transition-all duration-300 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-8 ${
        selectedMonitor ? "lg:mr-[620px] xl:mr-[680px] lg:max-w-[calc(100vw-640px)] xl:max-w-[calc(100vw-700px)]" : "max-w-7xl mx-auto"
      }`}>        {/* ========================================================================= */}
        {/* SECTION 1: AUTHENTIC NOTION HERO COVER & TITLE BLOCK                      */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          {/* Notion Hero Cover Banner */}
          <div className="relative w-full h-48 sm:h-64 rounded-3xl overflow-hidden border border-[#2f2f2f] bg-[#202020] shadow-2xl">
            <Image
              src={
                bannerSettings.homeBannerUrl ||
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop"
              }
              alt="GrayPlasma Banner"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#191919] via-transparent to-transparent" />
          </div>

          {/* Notion Page Icon & Header */}
          <div className="space-y-4 -mt-14 relative z-10 px-2 sm:px-4">
            <div className="text-5xl sm:text-6xl p-2 rounded-2xl bg-[#191919] border border-[#2a2a2a] w-fit shadow-xl">
              🖥️
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#ffffff] tracking-tight">
                GRAYPLASMAID - REKOMENDASI MONITOR
              </h1>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#787774]">
                AKAN DILENGKAPI
              </p>
            </div>

            {/* Notion Callout / Catatan Disclaimer Box (Exact match to Notion) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#202020] border border-[#2f2f2f] text-xs text-[#d4d4d4] space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-amber-400 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>CATATAN PENTING :</span>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-[#b4b4b4] leading-relaxed">
                <li>
                  <strong className="text-white">SELURUH LIST YANG ADA DI WEB INI PERLU DITANYAKAN KEMBALI KEPADA PENULIS</strong>, dikarenakan perlu mempertimbangkan aspek spesifikasi PC Desktop / Laptop, ukuran meja, dan kebutuhan Anda.
                </li>
                <li>
                  Mulai 15 Agustus 2026, link Tokopedia dan TikTok Shop akan dialihkan jika terjadi error. Jika butuh link khusus, silakan DM Discord GrayPlasma atau WhatsApp <strong className="text-[#52ba69]">0851-7979-4019</strong> a/n Joel Gray.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: AUTHENTIC NOTION SUB-PAGES HIERARCHY GRID                      */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          {/* GROUP 1: REKOMENDASI MONITOR BERDASARKAN KATEGORI & RESOLUSI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
              <span>🌟</span>
              <span>1. REKOMENDASI MONITOR PILIHAN UTAMA</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  title: "REKOMENDASI MONITOR 1080P (FHD BUDGET)",
                  desc: "Katalog pilihan 1080p Fast IPS budget & esport 180Hz+",
                  path: "/guide/1080p",
                  icon: "🖥️",
                  color: "hover:border-[#52ba69] text-[#52ba69]",
                },
                {
                  title: "REKOMENDASI MONITOR 1440P (2K SWEETSPOT)",
                  desc: "Pilihan monitor 2K 144Hz - 240Hz visual tajam",
                  path: "/guide/1440p",
                  icon: "🖥️",
                  color: "hover:border-[#58a6ff] text-[#58a6ff]",
                },
                {
                  title: "REKOMENDASI MONITOR 4K UHD & CREATOR",
                  desc: "Monitor resolusi tinggi untuk productivity & visual",
                  path: "/guide/4k",
                  icon: "🖥️",
                  color: "hover:border-[#ff9f43] text-[#ff9f43]",
                },
                {
                  title: "REKOMENDASI MONITOR OLED & FLAGSHIP",
                  desc: "Panel QD-OLED & WOLED contrast tanpa tanding",
                  path: "/guide/oled",
                  icon: "✨",
                  color: "hover:border-[#d157eb] text-[#d157eb]",
                },
              ].map((card, idx) => (
                <Link
                  key={idx}
                  href={card.path}
                  className={`p-3.5 rounded-2xl bg-[#202020] border border-[#2f2f2f] transition-all space-y-1.5 group block shadow-sm ${card.color}`}
                >
                  <div className="flex items-center gap-2 font-bold text-white text-xs group-hover:text-white">
                    <span>{card.icon}</span>
                    <span className="truncate">{card.title}</span>
                  </div>
                  <p className="text-[11px] text-[#9b9a97] line-clamp-2 leading-relaxed">
                    {card.desc}
                  </p>
                  <span className="text-[10px] font-mono text-[#787774] block pt-0.5 group-hover:underline">
                    {card.path} →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* GROUP 2: EVALUASI BRAND & AFTERSALES */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
              <span>🛡️</span>
              <span>2. EVALUASI BRAND & AFTERSALES (OEM / ODM LIST)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/guide/brand/aftersales-rma"
                className="p-4 rounded-2xl bg-[#202020] border border-[#2f2f2f] hover:border-[#52ba69] transition-all space-y-2 group block shadow-sm"
              >
                <div className="flex items-center gap-2 font-bold text-white text-xs group-hover:text-[#52ba69]">
                  <span>🛡️</span>
                  <span>LIST AFTERSALES (BRAND MONITOR OEM)</span>
                </div>
                <p className="text-[11px] text-[#9b9a97] leading-relaxed">
                  Database komprehensif sistem klaim garansi, track record RMA distributor resmi, dan tiering brand di Indonesia.
                </p>
                <span className="text-[10px] text-[#787774] font-mono block group-hover:text-[#52ba69]">
                  /guide/brand/aftersales-rma →
                </span>
              </Link>

              <Link
                href="/guide/brand/odm-layak-dibeli"
                className="p-4 rounded-2xl bg-[#202020] border border-[#2f2f2f] hover:border-amber-400 transition-all space-y-2 group block shadow-sm"
              >
                <div className="flex items-center gap-2 font-bold text-white text-xs group-hover:border-amber-400">
                  <span>⚠️</span>
                  <span>LIST BRAND MONITOR ODM / OEM LAYAK BELI</span>
                </div>
                <p className="text-[11px] text-[#9b9a97] leading-relaxed">
                  Panduan membeli monitor rebadge/ODM (KTC, Titan Army, Xiaomi, Skyworth) dengan risiko minimal dan garansi jelas.
                </p>
                <span className="text-[10px] text-[#787774] font-mono block group-hover:text-amber-400">
                  /guide/brand/odm-layak-dibeli →
                </span>
              </Link>
            </div>
          </div>

          {/* GROUP 3: GLOSARIUM GTID & KALIBRASI WARNA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
              <span>🎨</span>
              <span>3. GLOSARIUM & PANDUAN KALIBRASI WARNA (GTID TECH)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  title: "HOW TO READ GTID GLOSSARY",
                  desc: "Cara membaca skor deITP, Delta E, gamut, dan response time.",
                  path: "/guide/sdr/glossary",
                  icon: "📄",
                },
                {
                  title: "AKURASI D65-P3 VS UNDERSATURATED",
                  desc: "Mengapa monitor Delta E rendah bisa kurang warna di Rec.2020.",
                  path: "/guide/warna/akurasi-d65-p3",
                  icon: "🎯",
                },
                {
                  title: "BANDWIDTH DP VS HDMI 2.0 / 2.1",
                  desc: "Panduan kabel agar monitor tembus refresh rate maksimal tanpa kompresi.",
                  path: "/guide/display/bandwidth-dp-hdmi",
                  icon: "🔌",
                },
                {
                  title: "PERAWATAN MONITOR OLED",
                  desc: "Tips pencegahan burn-in, pixel cleaning, dan kebiasaan pemakaian.",
                  path: "/guide/oled/perawatan-burn-in",
                  icon: "✨",
                },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.path}
                  className="p-3.5 rounded-2xl bg-[#202020] border border-[#2f2f2f] hover:border-[#58a6ff] transition-all space-y-1.5 group block shadow-sm"
                >
                  <div className="flex items-center gap-2 font-bold text-white text-xs group-hover:text-[#58a6ff]">
                    <span>{item.icon}</span>
                    <span className="truncate">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-[#9b9a97] line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                  <span className="text-[10px] font-mono text-[#787774] block pt-0.5 group-hover:underline">
                    {item.path} →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* GROUP 4: QNA & GRAYNOTES */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
              <span>❓</span>
              <span>4. QNA & GRAYNOTES (PERTANYAAN SERING DIAJUKAN)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  title: "Build Quality Panel & Ketahanan",
                  desc: "Penjelasan umur panel dan dead-lines.",
                  path: "/guide/faq/build-quality-panel",
                },
                {
                  title: "Menentukan Monitor Ideal",
                  desc: "3 faktor utama sebelum checkout monitor.",
                  path: "/guide/faq/menentukan-monitor-ideal",
                },
                {
                  title: "Luasan vs Akurasi Warna",
                  desc: "Mengapa 100% sRGB belum tentu akurat.",
                  path: "/guide/faq/luasan-vs-akurasi-warna",
                },
                {
                  title: "IPS vs VA vs TN di 2026",
                  desc: "Perbandingan teknologi panel modern.",
                  path: "/guide/faq/ips-vs-va-vs-tn",
                },
                {
                  title: "Ikut PO Skyworth Apakah Worth-It?",
                  desc: "Kelebihan dan estimasi waktu PO.",
                  path: "/guide/faq/skyworth-po",
                },
                {
                  title: "Beli Monitor Online Aman",
                  desc: "SOP unboxing dan proteksi asuransi kurir.",
                  path: "/guide/faq/beli-monitor-online-aman",
                },
              ].map((faq, fIdx) => (
                <Link
                  key={fIdx}
                  href={faq.path}
                  className="p-3 rounded-xl bg-[#202020] border border-[#2f2f2f] hover:border-[#ff9f43] transition-all space-y-1 group block shadow-sm"
                >
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs group-hover:text-[#ff9f43]">
                    <span>❓</span>
                    <span className="truncate">{faq.title}</span>
                  </div>
                  <p className="text-[11px] text-[#9b9a97] truncate">{faq.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* GROUP 5: SETUP MEJA, AUTHOR & CONSULTATION */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              href="/guide/setup/meja-ergonomi"
              className="p-4 rounded-2xl bg-[#202020] border border-[#2f2f2f] hover:border-[#58a6ff] transition-all space-y-2 group block shadow-sm"
            >
              <div className="flex items-center gap-2 font-bold text-white text-xs group-hover:text-[#58a6ff]">
                <span>🪑</span>
                <span>Panduan Meja & Ergonomi</span>
              </div>
              <p className="text-[11px] text-[#9b9a97] leading-relaxed">
                Ukuran kedalaman meja vs inch monitor & rekomendasi gas spring arm.
              </p>
            </Link>

            <Link
              href="/guide/about"
              className="p-4 rounded-2xl bg-[#202020] border border-[#2f2f2f] hover:border-[#52ba69] transition-all space-y-2 group block shadow-sm"
            >
              <div className="flex items-center gap-2 font-bold text-white text-xs group-hover:text-[#52ba69]">
                <span>👤</span>
                <span>Tentang Penulis (Joel Gray)</span>
              </div>
              <p className="text-[11px] text-[#9b9a97] leading-relaxed">
                Biodata, latar belakang kurasi independen, dan komitmen evaluasi monitor.
              </p>
            </Link>

            <Link
              href="/guide/consultation"
              className="p-4 rounded-2xl bg-[#202020] border border-[#2f2f2f] hover:border-[#d157eb] transition-all space-y-2 group block shadow-sm"
            >
              <div className="flex items-center gap-2 font-bold text-white text-xs group-hover:text-[#d157eb]">
                <span>🎧</span>
                <span>Konsultasi & Support</span>
              </div>
              <p className="text-[11px] text-[#9b9a97] leading-relaxed">
                Konsultasi pemilihan monitor via Discord GTID / WA dan dukungan donasi.
              </p>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: DATABASE REKOMENDASI MONITOR (DILETAKKAN DI BAGIAN BAWAH)      */}
        {/* ========================================================================= */}
        {(activeMenuKey === "home" || isCatalog) && (
          <section className="space-y-6 pt-10 border-t border-[#2a2a2a] animate-in fade-in duration-200">
            {/* Database Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🖥️</span>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
                    DATABASE REKOMENDASI MONITOR LENGKAP
                  </h2>
                </div>
                <p className="text-xs text-[#9b9a97]">
                  Tabel interaktif pengujian GTID Tech. Gunakan filter di sisi kiri atau pilih mode tampilan tabel/harga/ukuran di bawah.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#202020] border border-[#2f2f2f] text-xs font-mono text-[#52ba69] font-bold">
                  {filteredMonitors.length} Model Ditampilkan
                </span>
              </div>
            </div>

            {/* Core 2-Column Database Layout: Left FilterBar + Right NotionTableView */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Left Sidebar Filter Section (Permanent & Never Hidden) */}
              <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                <FilterBar
                  filterState={filterState}
                  onFilterChange={setFilterState}
                  onResetFilters={handleResetFilters}
                  isMobileDrawerOpen={isMobileDrawerOpen}
                  onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
                  totalFilteredCount={filteredMonitors.length}
                />
              </div>

              {/* Right Main Database Table & Views */}
              <div className="flex-1 w-full min-w-0 space-y-6">
                <NotionTableView
                  monitors={filteredMonitors}
                  selectedMonitorId={selectedMonitor?.id}
                  onSelectMonitor={(m) => setSelectedMonitor(m)}
                />
              </div>
            </div>
          </section>
        )}


        {/* ========================================================================= */}
        {/* VIEW: LIST AFTERSALES (AUTHENTIC NOTION KANBAN BOARD)                     */}
        {/* ========================================================================= */}
        {activeMenuKey === "aftersales-tier" && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-[#202020] border border-[#2f2f2f] rounded-xl px-4 py-2.5 text-xs text-[#9b9a97]">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </button>
              <span className="text-[#e0e0e0] font-medium">
                🖥️ LIST AFTERSALES (BRAND MONITOR OEM)
              </span>
            </div>

            {/* Notion Header & Icon Block */}
            <div className="space-y-4 pt-2">
              <div className="text-4xl">🖥️</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#ffffff] tracking-tight">
                LIST AFTERSALES (BRAND MONITOR OEM)
              </h1>

              {/* Subtitle / Catatan Section (Exact match to Image 2) */}
              <div className="space-y-2 text-xs text-[#9b9a97]">
                <p className="font-semibold uppercase tracking-wider text-[#787774]">
                  AKAN DILENGKAPI
                </p>
                <div className="space-y-1">
                  <span className="font-bold text-[#d4d4d4] uppercase">CATATAN :</span>
                  <ul className="list-disc pl-5 space-y-1 text-[#b4b4b4]">
                    <li>
                      PENULIS TIDAK BERTANGGUNG JAWAB JIKA BRAND ANDA TERSINGGUNG DENGAN TULISAN DIBAWAH
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Authentic Notion Kanban Board */}
            <div className="pt-2">
              <NotionKanbanBoard
                columns={NOTION_AFTERSALES_COLUMNS}
                cards={NOTION_AFTERSALES_CARDS}
                selectedCardId={selectedAftersalesCard?.id}
                onSelectCard={(card) => {
                  setSelectedAftersalesCard(card);
                  setIsAftersalesPanelOpen(true);
                }}
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
                <span>Kembali ke Beranda Utama</span>
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
                        📋 Tabel Database
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
                      selectedMonitorId={selectedMonitor?.id}
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
        {/* VIEW: QnA & FAQ NOTION COLLECTION                                         */}
        {/* ========================================================================= */}
        {activeMenuKey === "faq" && (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-[#202020] border border-[#2f2f2f] rounded-xl px-4 py-2.5 text-xs text-[#9b9a97]">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </button>
              <span className="text-[#e0e0e0] font-medium">
                ❓ QNA & GRAYNOTES (FAQ)
              </span>
            </div>

            {/* Notion Header & Icon Block */}
            <div className="space-y-4 pt-2">
              <div className="text-4xl">❓</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#ffffff] tracking-tight">
                QNA & GRAYNOTES (PERTANYAAN SERING DIAJUKAN)
              </h1>

              <div className="space-y-2 text-xs text-[#9b9a97]">
                <p className="font-semibold uppercase tracking-wider text-[#787774]">
                  DATABASE EDUKASI & JAWABAN RESMI
                </p>
                <div className="space-y-1">
                  <span className="font-bold text-[#d4d4d4] uppercase">CATATAN :</span>
                  <ul className="list-disc pl-5 space-y-1 text-[#b4b4b4]">
                    <li>
                      Seluruh ulasan dan panduan disusun independen oleh Joel Gray (@gray1plasma) x GlaciK berdasarkan pengujian laboratorium GTID Tech.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Notion Collection List */}
            <div className="space-y-3 pt-2">
              {FAQ_LIST.map((faq) => {
                const slug = faq.id.replace(/^faq-/, "");
                const subPath = `/guide/faq/${slug}`;

                return (
                  <div
                    key={faq.id}
                    className="p-5 rounded-2xl bg-[#202020] border border-[#2f2f2f] hover:border-[#3f3f3f] transition-all space-y-3 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2a2a2a] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">📄</span>
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                          {faq.question}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#203c2b] text-[#52ba69] uppercase">
                          {faq.category || "FAQ"}
                        </span>
                        {faq.important && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#442c1d] text-[#e07936] uppercase">
                            Penting
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Answer Block */}
                    <div className="text-xs sm:text-sm text-[#d4d4d4] leading-relaxed whitespace-pre-line">
                      <NotionBlockRenderer content={faq.answer} />
                    </div>

                    {/* Footer Actions with Dedicated Sub-Path */}
                    <div className="pt-2 border-t border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <span className="text-[11px] font-mono text-[#787774] truncate">
                        Link: {subPath}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const text = `**[FAQ GRAYPLASMA] ${faq.question}**\n${faq.answer}\n🔗 ${window.location.origin}${subPath}`;
                            navigator.clipboard.writeText(text);
                            alert("Format callback Discord untuk pertanyaan ini telah disalin!");
                          }}
                          className="px-2.5 py-1 rounded bg-[#252525] border border-[#333333] hover:bg-[#2c2c2c] text-[#d4d4d4] hover:text-white flex items-center gap-1.5 transition-colors font-semibold"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#58a6ff]" />
                          <span>Copy Discord Callback</span>
                        </button>

                        <Link
                          href={subPath}
                          className="px-3 py-1 rounded bg-[#2383e2] hover:bg-[#1f75c8] text-white font-bold flex items-center gap-1 transition-colors"
                        >
                          <span>Buka Halaman →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: BANDWIDTH GUIDANCES (NOTION STYLE)                                   */}
        {/* ========================================================================= */}
        {activeMenuKey === "bandwidth-guide" && (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-[#202020] border border-[#2f2f2f] rounded-xl px-4 py-2.5 text-xs text-[#9b9a97]">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </button>
              <span className="text-[#e0e0e0] font-medium">
                🔌 BANDWIDTH GUIDANCE
              </span>
            </div>

            {/* Notion Header & Icon Block */}
            <div className="space-y-4 pt-2">
              <div className="text-4xl">🔌</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#ffffff] tracking-tight">
                BANDWIDTH GUIDANCE: HDMI 2.0 vs 2.1 vs DisplayPort 1.4/2.1
              </h1>

              <div className="space-y-2 text-xs text-[#9b9a97]">
                <p className="font-semibold uppercase tracking-wider text-[#787774]">
                  PANDUAN KONEKTIVITAS & KABEL DISPLAY
                </p>
                <div className="space-y-1">
                  <span className="font-bold text-[#d4d4d4] uppercase">CATATAN :</span>
                  <ul className="list-disc pl-5 space-y-1 text-[#b4b4b4]">
                    <li>
                      Kenapa monitor 1440p 180Hz turun ke 144Hz atau warna turun ke 8-bit saat memakai kabel HDMI 2.0 bawaan.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {BANDWIDTH_GUIDANCES.map((item, idx) => (
                <div key={idx} className="bg-[#202020] border border-[#2f2f2f] rounded-2xl p-6 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="text-emerald-400">⚡</span>
                      <span>{item.interface}</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-[#52ba69] bg-[#203c2b] px-2.5 py-1 rounded">
                      {item.bandwidth}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#d4d4d4] pt-1">
                    <div className="p-3.5 rounded-xl bg-[#191919] border border-[#2a2a2a]">
                      <strong className="text-[#9b9a97] block text-[10px] uppercase">Maksimal Resolusi & Refresh:</strong>
                      <span className="font-bold text-white mt-1 block text-sm">{item.maxResolutionHz}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#191919] border border-[#2a2a2a]">
                      <strong className="text-[#9b9a97] block text-[10px] uppercase">Color Depth & DSC:</strong>
                      <span className="font-bold text-white mt-1 block text-sm">{item.colorDepth}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#9b9a97] leading-relaxed pt-1">
                    {item.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: FORM KRITIK & SARAN                                                 */}
        {/* ========================================================================= */}
        {activeMenuKey === "feedback" && (
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
              <span className="text-xs text-zinc-500">Kritik & Saran</span>
            </div>

            <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Form Kritik & Saran GrayPlasma
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
                  Punya request monitor baru yang ingin dimasukkan ke database, koreksi harga / data pengetesan, atau saran untuk pengembangan website? Sampaikan langsung kepada kami!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
                <a
                  href={CONSULTATION_DATA.feedbackFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/20 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Google Form Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Formulir Kritik & Saran</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Buka dan isi kuesioner Google Form resmi GrayPlasma untuk request monitor atau feedback website.
                  </p>
                </a>

                <a
                  href={CONSULTATION_DATA.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/60 hover:bg-zinc-900 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">Forum Discord GTID</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Saluran Saran & Diskusi</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Sampaikan masukanmu langsung di channel komunitas Discord bersama ribuan enthusiast monitor lainnya.
                  </p>
                </a>

                <a
                  href={CONSULTATION_DATA.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/60 hover:bg-zinc-900 transition-all space-y-2 group sm:col-span-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Direct Chat WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Chat Joel Gray (@gray1plasma)</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Kirim pesan personal via WhatsApp ({CONSULTATION_DATA.whatsapp}) jika menemukan bug atau kesalahan data di website ini.
                  </p>
                </a>
              </div>
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

      {/* Notion Side-Peek / Split View Panel for Monitor Navigation */}
      <MonitorSidePanel
        monitor={selectedMonitor}
        isOpen={Boolean(selectedMonitor)}
        onClose={() => setSelectedMonitor(null)}
      />

      {/* Notion Aftersales Side Panel Drawer */}
      <NotionAftersalesSidePanel
        card={selectedAftersalesCard}
        isOpen={isAftersalesPanelOpen}
        onClose={() => setIsAftersalesPanelOpen(false)}
      />

      {/* Comprehensive Multi-Column Footer */}
      <Footer />
    </div>
  );
}
