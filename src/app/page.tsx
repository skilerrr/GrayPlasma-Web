"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
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
  Table,
  Scale,
} from "lucide-react";
import {
  Monitor,
  FilterState,
  QuickFilterTab,
  TierRating,
} from "@/types/monitor";
import { MONITORS_DATA } from "@/data/monitors";
import { DeskRecommendationsView } from "@/components/desk-recommendations-view";
import { DESK_DATABASE, DeskItem } from "@/data/grayplasma-desk-peripherals";
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
import { MonitorComparatorTray } from "@/components/comparator/monitor-comparator-tray";
import { useMonitorComparator } from "@/hooks/use-monitor-comparator";
import {
  NOTION_AFTERSALES_COLUMNS,
  NOTION_AFTERSALES_CARDS,
} from "@/data/notion-aftersales-board-data";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";
import { DeskPeripheralsView } from "@/components/desk-peripherals-view";
import { GPLogo } from "@/components/gp-logo";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { DeskCard } from "@/components/desk-card";
import { PeripheralCard } from "@/components/peripheral-card";
import { DeskSidePanel } from "@/components/desk-side-panel";
import { PeripheralItem } from "@/data/grayplasma-desk-peripherals";
import { PeripheralSidePanel } from "@/components/peripheral-side-panel";
import {
  DatabaseService,
  HomepageSettings,
  DEFAULT_HOMEPAGE_SETTINGS,
} from "@/lib/db-service";

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

function CatalogPageContent() {
  const [monitorsData, setMonitorsData] = useState<Monitor[]>(MONITORS_DATA);
  const [desksData, setDesksData] = useState<DeskItem[]>(DESK_DATABASE);
  const [peripheralsData, setPeripheralsData] = useState<PeripheralItem[]>(PERIPHERALS_DATABASE);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [aftersalesCards, setAftersalesCards] = useState<NotionBoardCard[]>(NOTION_AFTERSALES_CARDS);
  const [faqs, setFaqs] = useState<typeof FAQ_LIST>(FAQ_LIST);
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);
  const [selectedDesk, setSelectedDesk] = useState<DeskItem | null>(null);
  const [selectedPeripheralForPanel, setSelectedPeripheralForPanel] = useState<PeripheralItem | null>(null);
  const [isPeripheralPanelOpen, setIsPeripheralPanelOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuKey, setActiveMenuKey] = useState<NavMenuKey | "home">("home");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const comparator = useMonitorComparator(monitorsData);
  
  // Pagination & Filter States for Homepage Databases
  const [monitorPage, setMonitorPage] = useState(1);
  const [deskPage, setDeskPage] = useState(1);
  const [deskCategory, setDeskCategory] = useState<string>("all");
  const [deskSearch, setDeskSearch] = useState<string>("");
  const [peripheralPage, setPeripheralPage] = useState(1);
  const [peripheralCategory, setPeripheralCategory] = useState<string>("all");
  const [peripheralSearch, setPeripheralSearch] = useState<string>("");

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
        const [loadedMonitors, loadedBanners, loadedDesks, loadedHp, loadedPeriphs, loadedCards] = await Promise.all([
          DatabaseService.getMonitors(),
          DatabaseService.getBannerSettings(),
          DatabaseService.getDesks(),
          DatabaseService.getHomepageSettings(),
          DatabaseService.getPeripherals(),
          DatabaseService.getAftersalesCards(),
        ]);
        setMonitorsData(loadedMonitors);
        if (loadedBanners) setBannerSettings(loadedBanners);
        if (loadedDesks && loadedDesks.length > 0) setDesksData(loadedDesks);
        if (loadedHp) setHomepageSettings(loadedHp);
        if (loadedPeriphs && loadedPeriphs.length > 0) setPeripheralsData(loadedPeriphs);
        if (loadedCards && loadedCards.length > 0) setAftersalesCards(loadedCards);
        const loadedFaqs = DatabaseService.getFAQ();
        if (loadedFaqs && loadedFaqs.length > 0) setFaqs(loadedFaqs);
      } catch (e) {
        console.error("Failed to load dynamic data", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Reset monitor page to 1 on filter changes
  useEffect(() => {
    setMonitorPage(1);
  }, [filterState]);

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

  const ITEMS_PER_PAGE = 9;

  // Paginated Monitors
  const totalMonitorPages = Math.max(1, Math.ceil(filteredMonitors.length / ITEMS_PER_PAGE));
  const paginatedMonitors = useMemo(() => {
    const start = (monitorPage - 1) * ITEMS_PER_PAGE;
    return filteredMonitors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMonitors, monitorPage]);

  // Filtered & Paginated Desks
  const deskCategories = [
    { id: "all", label: "Semua Meja" },
    { id: "Daun Meja", label: "Daun Meja" },
    { id: "Meja Standar", label: "Meja Standar" },
    { id: "Meja Elektrik (Standing Desk)", label: "Meja Elektrik" },
    { id: "Meja L-Shaped", label: "L-Shaped" },
    { id: "Meja Nakas", label: "Nakas" },
    { id: "Meja Lesehan", label: "Lesehan" },
  ];

  const filteredDesks = useMemo(() => {
    return desksData.filter((d) => {
      if (deskSearch.trim()) {
        const q = deskSearch.toLowerCase();
        const match =
          d.name.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.specs.material?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (deskCategory !== "all" && d.category !== deskCategory) return false;
      return true;
    });
  }, [desksData, deskSearch, deskCategory]);

  const totalDeskPages = Math.max(1, Math.ceil(filteredDesks.length / ITEMS_PER_PAGE));
  const paginatedDesks = useMemo(() => {
    const start = (deskPage - 1) * ITEMS_PER_PAGE;
    return filteredDesks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDesks, deskPage]);

  // Filtered & Paginated Peripherals
  const peripheralCategories = [
    { id: "all", label: "Semua Aksesoris" },
    { id: "Bracket / Monitor Arm", label: "Monitor Arm" },
    { id: "Cable Management", label: "Cable Management" },
    { id: "Screenbar / Lampu", label: "Screenbar / Lampu" },
    { id: "Stand / Riser", label: "Stand / Riser" },
    { id: "Audio", label: "Audio & Headset" },
  ];

  const filteredPeripherals = useMemo(() => {
    return peripheralsData.filter((p) => {
      if (peripheralSearch.trim()) {
        const q = peripheralSearch.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.verdict?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (peripheralCategory !== "all" && !p.category.toLowerCase().includes(peripheralCategory.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [peripheralsData, peripheralSearch, peripheralCategory]);

  const totalPeripheralPages = Math.max(1, Math.ceil(filteredPeripherals.length / ITEMS_PER_PAGE));
  const paginatedPeripherals = useMemo(() => {
    const start = (peripheralPage - 1) * ITEMS_PER_PAGE;
    return filteredPeripherals.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPeripherals, peripheralPage]);

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-8">
        {/* ========================================================================= */}
        {/* SECTION 1: TECH-BRUTALIST HUD HERO COVER & TITLE BLOCK                    */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          {/* Notion Hero Cover Banner with HUD framing */}
          <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden border-2 border-zinc-800 bg-[#09090d] shadow-[3px_3px_0px_#000]">
            <Image
              src={
                homepageSettings.heroCoverUrl ||
                bannerSettings.homeBannerUrl ||
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop"
              }
              alt="GrayPlasma Banner"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-transparent to-transparent" />

            {/* Corner Tech Telemetry */}
            <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center gap-2 font-mono text-[10px] text-emerald-400 bg-black/80 border border-zinc-700 px-2.5 py-1 rounded shadow-[2px_2px_0px_#000]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>[ GP_SYS // CORE_CATALOG_2026 ]</span>
            </div>
          </div>

          {/* Notion Page Icon & Header */}
          <div className="space-y-4 -mt-14 relative z-10 px-2 sm:px-4">
            <div className="text-4xl sm:text-5xl p-2.5 rounded-xl bg-[#0b0b0f] border-2 border-zinc-700 w-fit shadow-[3px_3px_0px_#000]">
              {homepageSettings.pageIcon || "🖥️"}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 px-2 py-0.5 rounded">
                  [ STATUS: REKOMENDASI_RESMI ]
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-[10px] font-mono text-zinc-400">GTID_STANDARDIZED</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {homepageSettings.pageTitle || "GRAYPLASMAID - REKOMENDASI MONITOR"}
              </h1>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                {homepageSettings.statusBadge || "[ AKAN_DILENGKAPI_SECARA_BERKALA ]"}
              </p>
            </div>

            {/* Tech-Brutalist Callout / Disclaimer Box */}
            <div className="p-4 sm:p-5 rounded-lg border-l-4 border-l-amber-400 border-y border-r border-zinc-800 bg-[#0c0c11] text-xs text-zinc-300 space-y-2.5 shadow-[3px_3px_0px_#000]">
              <div className="flex items-center gap-2 font-mono font-bold text-amber-400 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>// {homepageSettings.disclaimerTitle || "CATATAN PENTING & STANDAR PENGUJIAN :"}</span>
              </div>
              {homepageSettings.disclaimerMarkdown ? (
                <NotionBlockRenderer content={homepageSettings.disclaimerMarkdown} />
              ) : (
                <ul className="list-disc pl-5 space-y-1.5 text-zinc-300 leading-relaxed font-sans">
                  {(homepageSettings.disclaimerPoints || []).map((point, idx) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: point }} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: SUB-PAGES HIERARCHY GRID (TECH-BRUTALIST CARDS)                */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          {Object.entries(
            homepageSettings.subpageCards
              .filter((c) => c.isVisible)
              .reduce((acc, card) => {
                const groupKey = card.groupTitle || "Lainnya";
                if (!acc[groupKey]) acc[groupKey] = { emoji: card.groupEmoji || "📂", cards: [] };
                acc[groupKey].cards.push(card);
                return acc;
              }, {} as Record<string, { emoji: string; cards: typeof homepageSettings.subpageCards }>)
          ).map(([groupTitle, groupData]) => (
            <div key={groupTitle} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                <span>{groupData.emoji}</span>
                <span>[ // {groupTitle.toUpperCase()} ]</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {groupData.cards.map((card) => (
                  <Link
                    key={card.id}
                    href={card.path}
                    className={`p-3.5 rounded-lg bg-[#09090d] border border-zinc-800 transition-all space-y-1.5 group block shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_rgba(0,230,118,0.25)] hover:border-emerald-500/80 hover:-translate-y-0.5 ${
                      card.color || "hover:border-emerald-500 text-emerald-400"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-white text-xs group-hover:text-emerald-400 transition-colors">
                      <span>{card.icon}</span>
                      <span className="truncate">{card.title}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                      {card.desc}
                    </p>
                    <span className="text-[10px] font-mono text-zinc-500 block pt-0.5 group-hover:text-emerald-400">
                      {card.path} →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: DATABASE REKOMENDASI MONITOR (9 ITEMS PER PAGE)                */}
        {/* ========================================================================= */}
        {(activeMenuKey === "home" ? homepageSettings.sectionVisibility.showMonitors : isCatalog) && (
          <section className="space-y-6 pt-10 border-t border-zinc-800 animate-in fade-in duration-200">
            {/* Database Header Title & View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🖥️</span>
                  <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                    [ 01 // {homepageSettings.sectionTitles?.monitorsTitle || "DATABASE REKOMENDASI MONITOR"} ]
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 font-sans">
                  {homepageSettings.sectionTitles?.monitorsSubtitle || "Tabel interaktif & katalog pengujian GTID Tech (9 monitor per halaman)."}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-[#09090d] p-1 rounded-lg border border-zinc-700 shadow-[2px_2px_0px_#000]">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      viewMode === "grid"
                        ? "bg-emerald-500 text-black shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>[ GRID ]</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      viewMode === "table"
                        ? "bg-zinc-800 text-white shadow-sm border border-zinc-600"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>[ TABEL ]</span>
                  </button>
                </div>

                <span className="px-3 py-1 rounded border border-emerald-500/40 bg-emerald-500/10 text-xs font-mono text-emerald-400 font-bold shadow-[2px_2px_0px_#000]">
                  [ {filteredMonitors.length} MODEL ]
                </span>
              </div>
            </div>

            {/* Core 2-Column Database Layout: Left FilterBar + Right Content */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Left Sidebar Filter Section */}
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

              {/* Right Main Content */}
              <div className="flex-1 w-full min-w-0 space-y-6">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4.5 animate-in fade-in duration-200">
                    {paginatedMonitors.map((monitor) => (
                      <MonitorCard
                        key={monitor.id}
                        monitor={monitor}
                        onSelectMonitor={(m) => setSelectedMonitor(m)}
                        onCompareToggle={(m) => comparator.togglePin(m)}
                        isCompared={comparator.isPinned(monitor)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <NotionTableView
                      monitors={paginatedMonitors}
                      selectedMonitorId={selectedMonitor?.id}
                      onSelectMonitor={(m) => setSelectedMonitor(m)}
                    />
                  </div>
                )}

                {/* Monitor Pagination Bar (Active for both Grid and Table view) */}
                <PaginationBar
                  currentPage={monitorPage}
                  totalPages={totalMonitorPages}
                  totalItems={filteredMonitors.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setMonitorPage}
                />
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: DATABASE REKOMENDASI MEJA & ERGONOMI (TABEL & 9 PER PAGE)      */}
        {/* ========================================================================= */}
        {activeMenuKey === "home" && homepageSettings.sectionVisibility.showDesks && (
          <section className="space-y-6 pt-12 border-t border-zinc-800 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪑</span>
                  <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                    [ 02 // {homepageSettings.sectionTitles?.desksTitle || "DATABASE REKOMENDASI MEJA & SETUP ERGONOMI"} ]
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 font-sans">
                  {homepageSettings.sectionTitles?.desksSubtitle || "Tabel kurasi daun meja plywood solid & standing desk elektrik (Klik baris untuk melihat side panel ulasan)."}
                </p>
              </div>

              <span className="px-3 py-1 rounded border border-amber-500/40 bg-amber-500/10 text-xs font-mono text-amber-400 font-bold self-start sm:self-auto shadow-[2px_2px_0px_#000]">
                [ {filteredDesks.length} PILIHAN MEJA ]
              </span>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#09090d] p-3 rounded-lg border border-zinc-700/80 shadow-[2px_2px_0px_#000]">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {deskCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setDeskCategory(cat.id);
                      setDeskPage(1);
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold whitespace-nowrap transition-all shadow-[1px_1px_0px_#000] ${
                      deskCategory === cat.id
                        ? "bg-amber-500 text-black font-black"
                        : "bg-[#141419] text-zinc-400 hover:text-white border border-zinc-700"
                    }`}
                  >
                    [ {cat.label} ]
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={deskSearch}
                onChange={(e) => {
                  setDeskSearch(e.target.value);
                  setDeskPage(1);
                }}
                placeholder="Cari meja..."
                className="px-3.5 py-1.5 rounded-lg bg-[#141419] border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 w-full sm:w-56 shadow-inner"
              />
            </div>

            {/* Desks Table View */}
            <div className="relative rounded-lg border-2 border-zinc-800 bg-[#09090d] overflow-hidden shadow-[3px_3px_0px_#000]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                  <thead className="bg-[#050508] text-zinc-300 uppercase text-[10px] font-mono tracking-wider border-b-2 border-zinc-700 select-none">
                    <tr>
                      <th className="py-3 px-4 min-w-[220px] text-white">[ 01 // NAMA_MEJA_MODEL ]</th>
                      <th className="py-3 px-3 min-w-[180px]">[ 02 // KATEGORI ]</th>
                      <th className="py-3 px-3 min-w-[140px]">[ 03 // TIPE_BENTUK ]</th>
                      <th className="py-3 px-3 min-w-[160px]">[ 04 // STATUS_CATATAN ]</th>
                      <th className="py-3 px-4 min-w-[140px] text-right font-mono text-emerald-400">[ ESTIMASI_BUDGET ]</th>
                      <th className="py-3 px-3 text-center min-w-[110px]">[ AKSI ]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 font-sans">
                    {paginatedDesks.map((desk, idx) => (
                      <tr
                        key={desk.id || idx}
                        onClick={() => setSelectedDesk(desk)}
                        className={`group cursor-pointer hover:bg-[#1c1c24] transition-colors ${
                          idx % 2 === 0 ? "bg-[#141418]" : "bg-[#16161c]"
                        }`}
                      >
                        <td className="py-3.5 px-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <span className="text-base text-zinc-500 group-hover:text-amber-400 transition-colors">📄</span>
                            <span className="group-hover:text-amber-400 transition-colors">{desk.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1">
                            {(desk.keterangan || [desk.category]).map((tag, tIdx) => (
                              <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#262630] text-zinc-300 border border-zinc-700">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-900 text-zinc-400 border border-zinc-800">
                            {desk.type || "NON L SHAPED"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                            {desk.catatanBadge || "ADA (BACA PANDUAN)"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 tabular-nums">
                          {desk.price > 0 ? formatRupiah(desk.price) : "Custom"}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDesk(desk);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold transition-colors"
                          >
                            Detail →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Desk Pagination Bar */}
            <PaginationBar
              currentPage={deskPage}
              totalPages={totalDeskPages}
              totalItems={filteredDesks.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setDeskPage}
            />
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: DATABASE REKOMENDASI AKSESORIS & PERIPHERALS (TABEL & 9 PER P)  */}
        {/* ========================================================================= */}
        {activeMenuKey === "home" && homepageSettings.sectionVisibility.showPeripherals && (
          <section className="space-y-6 pt-12 border-t border-zinc-800 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎧</span>
                  <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                    [ 03 // {homepageSettings.sectionTitles?.peripheralsTitle || "DATABASE REKOMENDASI AKSESORIS & PERIPHERALS"} ]
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 font-sans">
                  {homepageSettings.sectionTitles?.peripheralsSubtitle || "Tabel kurasi bracket gas spring arm, screenbar lightbar, & cable management."}
                </p>
              </div>

              <span className="px-3 py-1 rounded border border-cyan-500/40 bg-cyan-500/10 text-xs font-mono text-cyan-400 font-bold self-start sm:self-auto shadow-[2px_2px_0px_#000]">
                [ {filteredPeripherals.length} AKSESORIS ]
              </span>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#09090d] p-3 rounded-lg border border-zinc-700/80 shadow-[2px_2px_0px_#000]">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {peripheralCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setPeripheralCategory(cat.id);
                      setPeripheralPage(1);
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold whitespace-nowrap transition-all shadow-[1px_1px_0px_#000] ${
                      peripheralCategory === cat.id
                        ? "bg-cyan-400 text-black font-black"
                        : "bg-[#141419] text-zinc-400 hover:text-white border border-zinc-700"
                    }`}
                  >
                    [ {cat.label} ]
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={peripheralSearch}
                onChange={(e) => {
                  setPeripheralSearch(e.target.value);
                  setPeripheralPage(1);
                }}
                placeholder="Cari aksesoris..."
                className="px-3.5 py-1.5 rounded-lg bg-[#141419] border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 w-full sm:w-56 shadow-inner"
              />
            </div>

            {/* Peripherals Table View */}
            <div className="relative rounded-lg border-2 border-zinc-800 bg-[#09090d] overflow-hidden shadow-[3px_3px_0px_#000]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                  <thead className="bg-[#050508] text-zinc-300 uppercase text-[10px] font-mono tracking-wider border-b-2 border-zinc-700 select-none">
                    <tr>
                      <th className="py-3 px-4 min-w-[220px] text-white">[ 01 // NAMA_AKSESORIS ]</th>
                      <th className="py-3 px-3 min-w-[160px]">[ 02 // KATEGORI ]</th>
                      <th className="py-3 px-3 min-w-[130px]">[ 03 // BRAND ]</th>
                      <th className="py-3 px-3 min-w-[140px]">[ 04 // GARANSI_SPEK ]</th>
                      <th className="py-3 px-4 min-w-[140px] text-right font-mono text-cyan-400">[ KISARAN_HARGA ]</th>
                      <th className="py-3 px-3 text-center min-w-[130px]">[ AKSI ]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 font-sans">
                    {paginatedPeripherals.map((item, idx) => {
                      const buyUrl = item.shopeeUrl || item.tokopediaUrl || item.tiktokUrl;
                      const platform = item.shopeeUrl ? "Shopee" : item.tokopediaUrl ? "Tokopedia" : item.tiktokUrl ? "TikTok" : "Marketplace";
                      return (
                        <tr
                          key={item.id || idx}
                          onClick={() => {
                            setSelectedPeripheralForPanel(item);
                            setIsPeripheralPanelOpen(true);
                          }}
                          className={`hover:bg-[#1c1c24] cursor-pointer transition-colors group ${
                            idx % 2 === 0 ? "bg-[#141418]" : "bg-[#16161c]"
                          }`}
                        >
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span className="text-base text-zinc-500 group-hover:text-cyan-400 transition-colors">🎧</span>
                              <span className="group-hover:text-cyan-400 transition-colors">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/25">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-zinc-300">
                            {item.brand}
                          </td>
                          <td className="py-3.5 px-3 text-zinc-400 font-mono text-[11px]">
                            {item.warranty ? `Garansi ${item.warranty}` : item.type}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-white tabular-nums">
                            {item.price > 0 ? formatRupiah(item.price) : "Cek Toko"}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPeripheralForPanel(item);
                                  setIsPeripheralPanelOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold transition-colors"
                              >
                                Detail →
                              </button>
                              {buyUrl && (
                                <a
                                  href={buyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ee4d2d]/15 hover:bg-[#ee4d2d] border border-[#ee4d2d]/40 text-[#ee4d2d] hover:text-white text-[11px] font-bold transition-all"
                                >
                                  <ShoppingBag className="w-3 h-3" />
                                  <span>{platform}</span>
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Peripheral Pagination Bar */}
            <PaginationBar
              currentPage={peripheralPage}
              totalPages={totalPeripheralPages}
              totalItems={filteredPeripherals.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setPeripheralPage}
            />
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
                cards={aftersalesCards}
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
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === "table"
                            ? "bg-zinc-800 text-emerald-400 shadow-sm"
                            : "text-zinc-400 hover:text-white"
                          }`}
                      >
                        📋 Tabel Database
                      </button>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === "grid"
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
                  className={`bg-zinc-950/90 border rounded-2xl p-5 space-y-3 transition-all ${brand.rating === "S"
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
                          className={`text-[10px] font-black px-2 py-0.5 rounded ${brand.rating === "S"
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
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${brand.status === "Sangat Direkomendasikan"
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
                  className={`bg-zinc-950 border rounded-2xl p-5 space-y-4 flex flex-col justify-between ${hdr.tier === "TRUE HDR"
                      ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : hdr.tier === "DECENT HDR"
                        ? "border-amber-500/40"
                        : "border-zinc-800"
                    }`}
                >
                  <div className="space-y-3">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${hdr.tier === "TRUE HDR"
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
              {(faqs.length > 0 ? faqs : FAQ_LIST).map((faq) => {
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
        {/* VIEW: REKOMENDASI MEJA + KAKI (NOTION STYLE)                              */}
        {/* ========================================================================= */}
        {activeMenuKey === "desk-guide" && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between bg-[#202020] border border-[#2f2f2f] rounded-xl px-4 py-2.5 text-xs text-[#9b9a97]">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="hover:text-white flex items-center gap-1.5 transition-colors font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama</span>
              </button>
              <span className="text-white font-medium">🪑 REKOMENDASI MEJA</span>
            </div>

            <DeskRecommendationsView />
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

      {/* Notion Side-Peek Drawer for Desk Navigation */}
      <DeskSidePanel
        desk={selectedDesk}
        isOpen={Boolean(selectedDesk)}
        onClose={() => setSelectedDesk(null)}
      />

      {/* Notion Aftersales Side Panel Drawer */}
      <NotionAftersalesSidePanel
        card={selectedAftersalesCard}
        isOpen={isAftersalesPanelOpen}
        onClose={() => setIsAftersalesPanelOpen(false)}
      />

      {/* Notion Peripheral Side Panel Drawer */}
      <PeripheralSidePanel
        peripheral={selectedPeripheralForPanel}
        isOpen={isPeripheralPanelOpen}
        onClose={() => setIsPeripheralPanelOpen(false)}
      />

      {/* Floating Bottom Head-to-Head Monitor Comparator Tray */}
      <MonitorComparatorTray
        pinnedMonitors={comparator.pinnedMonitors}
        onRemovePin={comparator.removePin}
        onClearAll={comparator.clearAllPins}
        isOpen={comparator.isCompareModalOpen}
        onOpenChange={comparator.setIsCompareModalOpen}
      />

      {/* Comprehensive Multi-Column Footer */}
      <Footer />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-3 font-sans">
          <div className="text-3xl animate-bounce">🖥️</div>
          <p className="text-xs font-mono font-bold text-gp-emerald uppercase tracking-widest">
            Memuat Katalog GrayPlasma...
          </p>
        </div>
      }
    >
      <CatalogPageContent />
    </Suspense>
  );
}
