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
import { FilterBar, ActiveFilterPills } from "@/components/filter-bar";
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
import { PeripheralItem, ChairItem, DEFAULT_CHAIRS_DATABASE } from "@/data/grayplasma-desk-peripherals";
import { PeripheralSidePanel } from "@/components/peripheral-side-panel";
import { BannerCarousel } from "@/components/banner-carousel";
import {
  DatabaseService,
  HomepageSettings,
  DEFAULT_HOMEPAGE_SETTINGS,
  AdBannerItem,
  DEFAULT_AD_BANNERS,
  GlobalSiteSettings,
  DEFAULT_SITE_SETTINGS,
} from "@/lib/db-service";
import { AnnouncementBar } from "@/components/announcement-bar";

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


/**
 * Pecah string aksen kartu ("hover:border-gp-sky text-gp-sky") jadi dua bagian:
 *  - `border` -> dipasang di elemen <Link> (efek hover border)
 *  - `text`   -> dipasang di elemen dalam (efek hover teks & ikon)
 *
 * Kalau class-nya utuh dipasang di <Link>, warnanya hanya kena di <Link>
 * sendiri; teks di dalam tetap `text-white` sehingga efek hover-nya nggak
 * kelihatan. Ini bug yang pernah ada.
 */
function cardAccent(raw: string | undefined): { border: string; text: string } {
  const parts = (raw || "").split(" ").filter(Boolean);
  const border = parts.find((c) => c.startsWith("hover:border-"));
  const text = parts.find((c) => c.startsWith("text-"));
  return {
    // Tanpa aksen -> hover border netral, tanpa perubahan warna teks.
    border: border ?? "hover:border-gp-ink-600",
    text: text ? `group-hover:${text}` : "",
  };
}

function CatalogPageContent() {
  const [monitorsData, setMonitorsData] = useState<Monitor[]>(MONITORS_DATA);
  const [desksData, setDesksData] = useState<DeskItem[]>(DESK_DATABASE);
  const [peripheralsData, setPeripheralsData] = useState<PeripheralItem[]>(PERIPHERALS_DATABASE);
  const [chairsData, setChairsData] = useState<ChairItem[]>(DEFAULT_CHAIRS_DATABASE);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [aftersalesCards, setAftersalesCards] = useState<NotionBoardCard[]>(NOTION_AFTERSALES_CARDS);
  const [faqs, setFaqs] = useState<typeof FAQ_LIST>(FAQ_LIST);
  const [deskGuides, setDeskGuides] = useState<typeof DESK_GUIDES>(DESK_GUIDES);
  const [hdrGuides, setHdrGuides] = useState<typeof HDR_GUIDES>(HDR_GUIDES);
  const [graynotes, setGraynotes] = useState<typeof GRAYNOTES_LIST>(GRAYNOTES_LIST);
  const [bandwidthGuides, setBandwidthGuides] = useState<typeof BANDWIDTH_GUIDANCES>(BANDWIDTH_GUIDANCES);
  const [siteSettings, setSiteSettings] = useState<GlobalSiteSettings>(DEFAULT_SITE_SETTINGS);
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);
  const [selectedDesk, setSelectedDesk] = useState<DeskItem | null>(null);
  const [selectedPeripheralForPanel, setSelectedPeripheralForPanel] = useState<PeripheralItem | null>(null);
  const [isPeripheralPanelOpen, setIsPeripheralPanelOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuKey, setActiveMenuKey] = useState<NavMenuKey | "home">("home");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

  // Default to gallery/grid view for first-time visitors, while remembering user preference
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("gp_monitor_view_mode");
      if (savedMode === "table" || savedMode === "grid") {
        setViewMode(savedMode);
      }
    } catch (e) {
      // ignore localStorage errors (e.g. incognito/SSR)
    }
  }, []);

  const handleSetViewMode = (mode: "table" | "grid") => {
    setViewMode(mode);
    try {
      localStorage.setItem("gp_monitor_view_mode", mode);
    } catch (e) {
      // ignore
    }
  };
  const comparator = useMonitorComparator(monitorsData);
  // Pagination & Filter States for Homepage Databases
  const [monitorPage, setMonitorPage] = useState(1);
  const [deskPage, setDeskPage] = useState(1);
  const [deskCategory, setDeskCategory] = useState<string>("all");
  const [deskSearch, setDeskSearch] = useState<string>("");

  // Arm & Bracket States
  const [armBracketPage, setArmBracketPage] = useState(1);
  const [armBracketFilter, setArmBracketFilter] = useState<string>("all");
  const [armBracketSearch, setArmBracketSearch] = useState<string>("");

  // Accessory States
  const [accessoryPage, setAccessoryPage] = useState(1);
  const [accessoryCategory, setAccessoryCategory] = useState<string>("all");
  const [accessorySearch, setAccessorySearch] = useState<string>("");

  // Chair States
  const [chairPage, setChairPage] = useState(1);
  const [chairCategory, setChairCategory] = useState<string>("all");
  const [chairSearch, setChairSearch] = useState<string>("");

  const [bannerSettings, setBannerSettings] = useState<any>({
    homeBannerUrl: "",
    homeBannerTitle: "Katalog & Database Rekomendasi Monitor",
    homeBannerSubtitle: "Kurasi monitor independen oleh tim GrayPlasma (@gray1plasma) dengan pengujian laboratorium GrayPlasma.",
  });
  const [adBanners, setAdBanners] = useState<AdBannerItem[]>(DEFAULT_AD_BANNERS);
  const [selectedAftersalesCard, setSelectedAftersalesCard] = useState<NotionBoardCard | null>(null);
  const [isAftersalesPanelOpen, setIsAftersalesPanelOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedMonitors, loadedBanners, loadedDesks, loadedHp, loadedPeriphs, loadedCards, loadedAdBanners, loadedSiteSettings, loadedChairs] = await Promise.all([
          DatabaseService.getMonitors(),
          DatabaseService.getBannerSettings(),
          DatabaseService.getDesks(),
          DatabaseService.getHomepageSettings(),
          DatabaseService.getPeripherals(),
          DatabaseService.getAftersalesCards(),
          DatabaseService.getAdBanners(),
          DatabaseService.getSiteSettings(),
          DatabaseService.getChairsAsync(),
        ]);
        if (loadedMonitors && loadedMonitors.length > 0) {
          setMonitorsData(loadedMonitors.filter((m) => m.isPublished !== false));
        }
        if (loadedBanners) setBannerSettings(loadedBanners);
        if (loadedDesks && loadedDesks.length > 0) {
          setDesksData(loadedDesks.filter((d) => d.isPublished !== false));
        } else {
          setDesksData(DESK_DATABASE);
        }
        if (loadedHp) {
          setHomepageSettings({
            ...loadedHp,
            sectionVisibility: {
              ...loadedHp.sectionVisibility,
              showMonitors: loadedHp.sectionVisibility?.showMonitors ?? true,
              showDesks: loadedHp.sectionVisibility?.showDesks ?? true,
              showArms: loadedHp.sectionVisibility?.showArms ?? true,
              showBrackets: loadedHp.sectionVisibility?.showBrackets ?? true,
              showPeripherals: loadedHp.sectionVisibility?.showPeripherals ?? true,
              showChairs: Boolean(loadedHp.sectionVisibility?.showChairs),
            },
          });
        }
        if (loadedPeriphs && loadedPeriphs.length > 0) {
          setPeripheralsData(loadedPeriphs.filter((p) => p.isPublished !== false));
        } else {
          setPeripheralsData(PERIPHERALS_DATABASE);
        }
        if (loadedCards && loadedCards.length > 0) setAftersalesCards(loadedCards);
        if (loadedAdBanners && loadedAdBanners.length > 0) setAdBanners(loadedAdBanners);
        if (loadedSiteSettings) setSiteSettings(loadedSiteSettings);
        if (loadedChairs && loadedChairs.length > 0) {
          const pubChairs = loadedChairs.filter((c) => c.isPublished !== false);
          setChairsData(pubChairs.length > 0 ? pubChairs : DEFAULT_CHAIRS_DATABASE);
        } else {
          setChairsData(DEFAULT_CHAIRS_DATABASE);
        }
        const loadedFaqs = DatabaseService.getFAQ();
        if (loadedFaqs && loadedFaqs.length > 0) setFaqs(loadedFaqs.filter((f) => f.isPublished !== false));
        const loadedDeskGuides = DatabaseService.getDeskGuides();
        if (loadedDeskGuides && loadedDeskGuides.length > 0) setDeskGuides(loadedDeskGuides.filter((g) => g.isPublished !== false));
        const loadedHdrGuides = DatabaseService.getHDRGuides();
        if (loadedHdrGuides && loadedHdrGuides.length > 0) setHdrGuides(loadedHdrGuides.filter((g) => g.isPublished !== false));
        const loadedGraynotes = DatabaseService.getGrayNotes();
        if (loadedGraynotes && loadedGraynotes.length > 0) setGraynotes(loadedGraynotes.filter((g) => g.isPublished !== false));
        const loadedBandwidths = DatabaseService.getBandwidthGuides();
        if (loadedBandwidths && loadedBandwidths.length > 0) setBandwidthGuides(loadedBandwidths.filter((g) => g.isPublished !== false));
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
        const tierWeights: Record<string, number> = {
          "TOP TIER": 5,
          "S-TIER": 5,
          "BEST VALUE": 4,
          "VALUE ENTRY": 3,
          "RECOMMENDED": 3,
          "HONORABLE MENTION": 2,
          "NOT RECOMMENDED": 1,
          "PASS": 1,
          "TIER Discontinue": 0,
          "DISCONTINUE": 0,
        };
        return (tierWeights[b.tier] || 0) - (tierWeights[a.tier] || 0);
      }
      return 0;
    });
  }, [filterState, monitorsData]);

  const ITEMS_PER_PAGE = 9;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.panelTypes.length > 0) count += filterState.panelTypes.length;
    if (filterState.refreshRates.length > 0) count += filterState.refreshRates.length;
    if (filterState.screenSizes.length > 0) count += filterState.screenSizes.length;
    if (filterState.resolutions.length > 0) count += filterState.resolutions.length;
    if (filterState.tiers.length > 0) count += filterState.tiers.length;
    if (filterState.budgetPreset !== null || filterState.budgetRange[1] < 25000000) count += 1;
    if (filterState.searchQuery) count += 1;
    return count;
  }, [filterState]);

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

  // Categorization helpers
  const isArm = (p: PeripheralItem) => {
    const cat = (p.category || "").toLowerCase();
    const type = (p.type || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    return (
      cat.includes("arm") ||
      type.includes("arm") ||
      name.includes("arm") ||
      name.includes("p100e") ||
      name.includes("p200e") ||
      name.includes("f80") ||
      name.includes("f100a")
    );
  };

  const isBracket = (p: PeripheralItem) => {
    const cat = (p.category || "").toLowerCase();
    const type = (p.type || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    return (
      (cat.includes("bracket") ||
        type.includes("bracket") ||
        name.includes("bracket") ||
        name.includes("vesa") ||
        name.includes("mount") ||
        name.includes("dinding")) &&
      !isArm(p)
    );
  };

  const isArmOrBracket = (p: PeripheralItem) => isArm(p) || isBracket(p);

  // 1. Arm & Bracket List
  const armsBracketsData = useMemo(() => {
    return peripheralsData.filter((p) => {
      if (!isArmOrBracket(p)) return false;
      if (homepageSettings.sectionVisibility?.showArms === false && isArm(p)) return false;
      if (homepageSettings.sectionVisibility?.showBrackets === false && isBracket(p)) return false;
      return true;
    });
  }, [peripheralsData, homepageSettings.sectionVisibility]);

  const armBracketCategories = [
    { id: "all", label: "Semua Arm & Bracket" },
    { id: "arm", label: "Monitor Arm (Gas Spring)" },
    { id: "bracket", label: "Bracket & VESA Mount" },
  ];

  const filteredArmsBrackets = useMemo(() => {
    return armsBracketsData.filter((p) => {
      if (armBracketSearch.trim()) {
        const q = armBracketSearch.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q) ||
          (p.verdict || "").toLowerCase().includes(q);
        if (!match) return false;
      }
      if (armBracketFilter === "arm" && !isArm(p)) return false;
      if (armBracketFilter === "bracket" && !isBracket(p)) return false;
      return true;
    });
  }, [armsBracketsData, armBracketSearch, armBracketFilter]);

  const totalArmBracketPages = Math.max(1, Math.ceil(filteredArmsBrackets.length / ITEMS_PER_PAGE));
  const paginatedArmsBrackets = useMemo(() => {
    const start = (armBracketPage - 1) * ITEMS_PER_PAGE;
    return filteredArmsBrackets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArmsBrackets, armBracketPage]);

  // 2. Accessories List (Non-Arm, Non-Bracket)
  const accessoriesData = useMemo(() => {
    return peripheralsData.filter((p) => {
      if (isArmOrBracket(p)) return false;
      if (homepageSettings.sectionVisibility?.showPeripherals === false) return false;
      return true;
    });
  }, [peripheralsData, homepageSettings.sectionVisibility]);

  const accessoryCategories = [
    { id: "all", label: "Semua Aksesoris" },
    { id: "Screenbar / Lampu", label: "Screenbar / Lampu" },
    { id: "Cable Management", label: "Kabel & Cable Mgmt" },
    { id: "Stand / Riser", label: "Stand / Riser" },
    { id: "Audio", label: "Audio & Headset" },
  ];

  const filteredAccessories = useMemo(() => {
    return accessoriesData.filter((p) => {
      if (accessorySearch.trim()) {
        const q = accessorySearch.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q) ||
          (p.verdict || "").toLowerCase().includes(q);
        if (!match) return false;
      }
      if (accessoryCategory !== "all") {
        const cat = (p.category || "").toLowerCase();
        const type = (p.type || "").toLowerCase();
        if (!cat.includes(accessoryCategory.toLowerCase()) && !type.includes(accessoryCategory.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [accessoriesData, accessorySearch, accessoryCategory]);

  const totalAccessoryPages = Math.max(1, Math.ceil(filteredAccessories.length / ITEMS_PER_PAGE));
  const paginatedAccessories = useMemo(() => {
    const start = (accessoryPage - 1) * ITEMS_PER_PAGE;
    return filteredAccessories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAccessories, accessoryPage]);

  // Filtered & Paginated Chairs (Ergonomic & Gaming - Q2 2027)
  const chairCategories = [
    { id: "all", label: "Semua Kursi" },
    { id: "Ergonomic Full Mesh", label: "Full Mesh" },
    { id: "Ergonomic Fabric", label: "Fabric / Busa" },
    { id: "Gaming Ergonomic", label: "Gaming Ergonomic" },
    { id: "Office Mid-Back", label: "Office Mid-Back" },
  ];

  const filteredChairs = useMemo(() => {
    return chairsData
      .filter((c) => c.isPublished !== false)
      .filter((c) => {
        if (chairSearch.trim()) {
          const q = chairSearch.toLowerCase();
          const match =
            c.name.toLowerCase().includes(q) ||
            c.brand.toLowerCase().includes(q) ||
            c.verdict?.toLowerCase().includes(q) ||
            c.lumbarSupport?.toLowerCase().includes(q);
          if (!match) return false;
        }
        if (chairCategory !== "all" && !c.category.toLowerCase().includes(chairCategory.toLowerCase())) {
          return false;
        }
        return true;
      });
  }, [chairsData, chairSearch, chairCategory]);

  const totalChairPages = Math.max(1, Math.ceil(filteredChairs.length / ITEMS_PER_PAGE));
  const paginatedChairs = useMemo(() => {
    const start = (chairPage - 1) * ITEMS_PER_PAGE;
    return filteredChairs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredChairs, chairPage]);

  // Featured top picks
  const featuredMonitors = useMemo(() => {
    return monitorsData.filter((m) => m.tier === "S-TIER" || m.tier === "BEST VALUE").slice(0, 6);
  }, [monitorsData]);
  const isCatalog = activeMenuKey.startsWith("catalog");
  const consult = siteSettings.consultation || CONSULTATION_DATA;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-hue-emerald-500 selection:text-black font-sans">
      <AnnouncementBar settings={siteSettings?.announcement} />
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

      {/* Edge-to-Edge Full-Width Ad Banner Carousel */}
      <BannerCarousel banners={adBanners} intervalMs={5000} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-8">
        {/* ========================================================================= */}
        {/* SECTION 1: TITLE BLOCK & DISCLAIMER                                       */}
        {/* ========================================================================= */}
        <section className="space-y-6 gp-reveal">
          <div className="space-y-4">
            {/* Title & Notion-style Page Icon */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gp-ink-800 border border-gp-ink-700 flex items-center justify-center text-gp-ink-200 flex-shrink-0 shadow-tech-card">
                <Tv className="w-6 h-6 text-gp-ink-200" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  {homepageSettings.pageTitle || "GRAYPLASMA DATABASE & REKOMENDASI"}
                </h1>
                <p className="text-xs text-gp-ink-300 mt-1 max-w-3xl font-sans">
                  {homepageSettings.pageSubtitle || "Kurasi monitor gaming, standing desk, & setup kerja terbaik di Indonesia."}
                </p>
              </div>
            </div>

            {/* Tech-Brutalist Callout / Disclaimer Box */}
            <div className="p-4 sm:p-5 rounded-lg border-l-4 border-l-amber-400 border-y border-r border-gp-ink-700 bg-gp-ink-900 text-xs text-gp-ink-200 space-y-2.5 shadow-tech-subtle">
              <div className="flex items-center gap-2 font-mono font-bold text-hue-amber-400 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-hue-amber-400" />
                <span>// {homepageSettings.disclaimerTitle || "CATATAN PENTING & STANDAR PENGUJIAN :"}</span>
              </div>
              {homepageSettings.disclaimerMarkdown ? (
                <NotionBlockRenderer content={homepageSettings.disclaimerMarkdown} />
              ) : (
                <ul className="list-disc pl-5 space-y-1.5 text-gp-ink-200 leading-relaxed font-sans">
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
        <section className="space-y-8 gp-reveal">
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
              <div className="flex items-center gap-2 text-xs font-bold text-gp-ink-200 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-gp-mint-50" />
                <span>{groupTitle}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {groupData.cards.map((card) => (
                  <Link
                    key={card.id}
                    href={card.path}
                    className={`p-3.5 rounded-lg bg-gp-ink-950 border border-gp-ink-700 transition-colors space-y-1.5 group block shadow-tech-card ${
                      cardAccent(card.color).border
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 font-bold text-white text-xs transition-colors ${
                        cardAccent(card.color).text
                      }`}
                    >
                      <FileText
                        className={`w-3.5 h-3.5 text-gp-ink-400 transition-colors flex-shrink-0 ${
                          cardAccent(card.color).text
                        }`}
                      />
                      <span className="truncate">{card.title}</span>
                    </div>
                    <p className="text-2xs text-gp-ink-300 line-clamp-2 leading-relaxed font-sans">
                      {card.desc}
                    </p>
                    <span className="text-3xs font-mono text-gp-ink-400 block pt-0.5 group-hover:text-hue-emerald-400">
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
        {(activeMenuKey === "home"
          ? homepageSettings.sectionVisibility?.showMonitors !== false
          : isCatalog) && (
          <section id="database-monitors" className="space-y-6 pt-12 border-t border-gp-ink-700 animate-in fade-in duration-200 gp-reveal">
            {/* Database Header Title & View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-hue-emerald-500/10 border border-hue-emerald-500/25 text-hue-emerald-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    01
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {homepageSettings.sectionTitles?.monitorsTitle || "Database Rekomendasi Monitor"}
                  </h2>
                </div>
                <p className="text-xs text-gp-ink-300 font-sans pl-9">
                  {homepageSettings.sectionTitles?.monitorsSubtitle || "Tabel interaktif & kurasi monitor hasil pengujian laboratorium GrayPlasma."}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* On-click Trigger to Open Monitor Database in Separate Page */}
                <Link
                  href="/catalog/all"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border bg-hue-emerald-500/10 hover:bg-hue-emerald-500/20 border-hue-emerald-500/30 text-hue-emerald-400 hover:text-hue-emerald-300"
                  title="Buka Database Rekomendasi Monitor di Halaman Terpisah"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Halaman Terpisah</span>
                </Link>

                {/* Parameter & Filter Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                    activeFilterCount > 0
                      ? "bg-hue-emerald-500/15 border-hue-emerald-500/50 text-hue-emerald-300"
                      : "bg-gp-ink-800 border-gp-ink-700 text-gp-ink-200 hover:text-white hover:border-gp-ink-600"
                  }`}
                  title="Buka panel parameter & filter"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-hue-emerald-400" />
                  <span>Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
                </button>

                {/* View Mode Segmented Control */}
                <div className="flex items-center p-0.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700">
                  <button
                    type="button"
                    onClick={() => handleSetViewMode("grid")}
                    className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      viewMode === "grid"
                        ? "bg-gp-ink-700 text-white shadow-sm font-semibold"
                        : "text-gp-ink-300 hover:text-white"
                    }`}
                    title="Tampilan Galeri"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Galeri</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetViewMode("table")}
                    className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      viewMode === "table"
                        ? "bg-gp-ink-700 text-white shadow-sm font-semibold"
                        : "text-gp-ink-300 hover:text-white"
                    }`}
                    title="Tampilan Tabel"
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>Tabel</span>
                  </button>
                </div>

                <span className="px-2.5 py-1 rounded-full border border-gp-ink-700 bg-gp-ink-800 text-xs text-gp-ink-200 font-medium">
                  {filteredMonitors.length} Monitor
                </span>
              </div>
            </div>

            {/* Active Filter Chips */}
            <ActiveFilterPills
              filterState={filterState}
              onFilterChange={setFilterState}
              onResetFilters={handleResetFilters}
              onOpenFilter={() => setIsMobileDrawerOpen(true)}
            />

            {/* Main Content - Full 100% Width */}
            <div className="w-full min-w-0 space-y-6">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 animate-in fade-in duration-200">
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
                    onOpenFilter={() => setIsMobileDrawerOpen(true)}
                    activeFilterCount={activeFilterCount}
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

            {/* FilterBar as Slide-Over Modal */}
            <FilterBar
              filterState={filterState}
              onFilterChange={setFilterState}
              onResetFilters={handleResetFilters}
              isOpen={isMobileDrawerOpen}
              onClose={() => setIsMobileDrawerOpen(false)}
              totalFilteredCount={filteredMonitors.length}
            />
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: DATABASE REKOMENDASI MEJA & ERGONOMI (TABEL & 9 PER PAGE)      */}
        {/* ========================================================================= */}
        {activeMenuKey === "home" &&
          homepageSettings.sectionVisibility?.showDesks !== false && (
            <section id="database-desks" className="space-y-6 pt-12 border-t border-gp-ink-700 animate-in fade-in duration-200 gp-reveal">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-hue-orange-500/10 border border-hue-orange-500/25 text-hue-orange-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    02
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {homepageSettings.sectionTitles?.desksTitle || "Database Rekomendasi Meja & Setup Ergonomi"}
                  </h2>
                </div>
                <p className="text-xs text-gp-ink-300 font-sans pl-9">
                  {homepageSettings.sectionTitles?.desksSubtitle || "Tabel kurasi daun meja plywood solid & standing desk elektrik (Klik baris untuk melihat ulasan)."}
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
                <span className="px-2.5 py-1 rounded-full border border-gp-ink-700 bg-gp-ink-800 text-xs text-gp-ink-200 font-medium">
                  {filteredDesks.length} Pilihan Meja
                </span>
                <Link
                  href="/catalog/desks"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border bg-hue-orange-500/10 hover:bg-hue-orange-500/20 border-hue-orange-500/30 text-hue-orange-400 hover:text-hue-orange-300"
                  title="Buka Database Rekomendasi Meja di Halaman Terpisah"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Halaman Terpisah</span>
                </Link>
              </div>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gp-ink-900 p-2.5 rounded-xl border border-gp-ink-700">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {deskCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setDeskCategory(cat.id);
                      setDeskPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      deskCategory === cat.id
                        ? "bg-gp-ink-50 text-black font-semibold shadow-sm"
                        : "bg-gp-ink-850 text-gp-ink-300 hover:text-white border border-gp-ink-700"
                    }`}
                  >
                    {cat.label}
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
                className="px-3.5 py-1.5 rounded-lg bg-gp-ink-850 border border-gp-ink-700 text-xs text-white placeholder-gp-ink-400 focus:outline-none focus:border-gp-ink-400 w-full sm:w-56"
              />
            </div>

            {/* Desks Table View */}
            <div className="relative rounded-xl border border-gp-ink-700 bg-gp-ink-950 overflow-hidden shadow-tech-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                  <thead className="bg-gp-ink-998 text-gp-ink-200 uppercase text-3xs font-mono tracking-wider border-b-2 border-gp-ink-600 select-none">
                    <tr>
                      <th className="py-3 px-4 min-w-[220px] text-white">[ NAMA MEJA & MODEL ]</th>
                      <th className="py-3 px-3 min-w-[180px]">[ KATEGORI ]</th>
                      <th className="py-3 px-3 min-w-[140px]">[ TIPE & BENTUK ]</th>
                      <th className="py-3 px-3 min-w-[160px]">[ STATUS CATATAN ]</th>
                      <th className="py-3 px-4 min-w-[140px] text-right font-mono text-hue-emerald-400">[ ESTIMASI BUDGET ]</th>
                      <th className="py-3 px-3 text-center min-w-[110px]">[ AKSI ]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gp-ink-700/80 font-sans">
                    {paginatedDesks.map((desk, idx) => (
                      <tr
                        key={desk.id || idx}
                        onClick={() => setSelectedDesk(desk)}
                        className={`group cursor-pointer hover:bg-gp-ink-750 transition-colors ${
                          idx % 2 === 0 ? "bg-gp-ink-850" : "bg-gp-ink-850"
                        }`}
                      >
                        <td className="py-3.5 px-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <span className="text-base text-gp-ink-400 group-hover:text-hue-amber-400 transition-colors">📄</span>
                            <span className="group-hover:text-hue-amber-400 transition-colors">{desk.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1">
                            {(desk.keterangan || [desk.category]).map((tag, tIdx) => (
                              <span key={tIdx} className="px-2 py-0.5 rounded text-3xs font-bold bg-gp-ink-700 text-gp-ink-200 border border-gp-ink-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded text-3xs font-bold bg-gp-ink-800 text-gp-ink-300 border border-gp-ink-700">
                            {desk.type || "NON L SHAPED"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded text-3xs font-bold bg-hue-emerald-500/10 text-hue-emerald-400 border border-hue-emerald-500/25">
                            {desk.catatanBadge || "ADA (BACA PANDUAN)"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-hue-emerald-400 tabular-nums">
                          {desk.price > 0 ? formatRupiah(desk.price) : "Custom"}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDesk(desk);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-gp-ink-700 hover:bg-gp-ink-600 text-gp-ink-100 text-2xs font-semibold transition-colors"
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
        {/* SECTION 5A: DATABASE REKOMENDASI ARM & BRACKET (TABEL & 9 PER PAGE)       */}
        {/* ========================================================================= */}
        {activeMenuKey === "home" &&
          (homepageSettings.sectionVisibility?.showArms !== false ||
            homepageSettings.sectionVisibility?.showBrackets !== false) && (
            <section
              id="database-arms-brackets"
              className="gp-reveal space-y-6 pt-12 border-t border-gp-ink-700 animate-in fade-in duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-hue-cyan-500/10 border border-hue-cyan-500/25 text-hue-cyan-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      03
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
                      <span>Database Rekomendasi Arm & Bracket</span>
                      <span className="px-2 py-0.5 rounded text-3xs font-mono font-bold bg-hue-cyan-500/10 text-hue-cyan-400 border border-hue-cyan-500/25">
                        GAS SPRING & MOUNT
                      </span>
                    </h2>
                  </div>
                  <p className="text-xs text-gp-ink-300 font-sans pl-9">
                    Kurasi bracket monitor gas spring, desk mount, dinding, dan VESA adapter teruji kuat menahan beban monitor.
                  </p>
                </div>

              <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
                <span className="px-2.5 py-1 rounded-full border border-gp-ink-700 bg-gp-ink-800 text-xs text-gp-ink-200 font-medium">
                  {filteredArmsBrackets.length} Arm & Bracket
                </span>
                <Link
                  href="/catalog/arms-brackets"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border bg-hue-cyan-500/10 hover:bg-hue-cyan-500/20 border-hue-cyan-500/30 text-hue-cyan-400 hover:text-hue-cyan-300"
                  title="Buka Database Arm & Bracket di Halaman Terpisah"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Halaman Terpisah</span>
                </Link>
              </div>
              </div>

              {/* Category Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gp-ink-950 p-2.5 rounded-xl border border-gp-ink-700">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {armBracketCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setArmBracketFilter(cat.id);
                        setArmBracketPage(1);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        armBracketFilter === cat.id
                          ? "bg-hue-cyan-500 text-black font-semibold shadow-sm"
                          : "bg-gp-ink-850 text-gp-ink-300 hover:text-white border border-gp-ink-700"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={armBracketSearch}
                  onChange={(e) => {
                    setArmBracketSearch(e.target.value);
                    setArmBracketPage(1);
                  }}
                  placeholder="Cari arm atau bracket..."
                  className="px-3.5 py-1.5 rounded-lg bg-gp-ink-850 border border-gp-ink-700 text-xs text-white placeholder-gp-ink-400 focus:outline-none focus:border-hue-cyan-500 w-full sm:w-56"
                />
              </div>

              {/* Arm & Bracket Table View */}
              <div className="relative rounded-xl border border-gp-ink-700 bg-gp-ink-950 overflow-hidden shadow-tech-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                    <thead className="bg-gp-ink-998 text-gp-ink-200 uppercase text-3xs font-mono tracking-wider border-b-2 border-gp-ink-600 select-none">
                      <tr>
                        <th className="py-3 px-4 min-w-[240px] text-white">[ NAMA MODEL & ARM ]</th>
                        <th className="py-3 px-3 min-w-[160px]">[ TIPE BRACKET ]</th>
                        <th className="py-3 px-3 min-w-[130px]">[ BRAND ]</th>
                        <th className="py-3 px-3 min-w-[160px]">[ SPESIFIKASI & GARANSI ]</th>
                        <th className="py-3 px-4 min-w-[140px] text-right font-mono text-hue-cyan-400">[ KISARAN HARGA ]</th>
                        <th className="py-3 px-3 text-center min-w-[140px]">[ AKSI ]</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gp-ink-700/80 font-sans">
                      {paginatedArmsBrackets.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gp-ink-400">
                            Tidak ada arm atau bracket yang sesuai dengan pencarian.
                          </td>
                        </tr>
                      ) : (
                        paginatedArmsBrackets.map((item, idx) => {
                          const buyUrl = item.shopeeUrl || item.tokopediaUrl || item.tiktokUrl;
                          const platform = item.shopeeUrl ? "Shopee" : item.tokopediaUrl ? "Tokopedia" : item.tiktokUrl ? "TikTok" : "Marketplace";
                          const isArmItem = isArm(item);
                          return (
                            <tr
                              key={item.id || idx}
                              onClick={() => {
                                setSelectedPeripheralForPanel(item);
                                setIsPeripheralPanelOpen(true);
                              }}
                              className={`hover:bg-gp-ink-750 cursor-pointer transition-colors group ${
                                idx % 2 === 0 ? "bg-gp-ink-850" : "bg-gp-ink-850"
                              }`}
                            >
                              <td className="py-3.5 px-4 font-bold text-white">
                                <div className="flex items-center gap-2">
                                  <span className="text-base group-hover:scale-110 transition-transform">
                                    {isArmItem ? "🦾" : "📐"}
                                  </span>
                                  <span className="group-hover:text-hue-cyan-400 transition-colors">{item.name}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-3xs font-bold ${
                                    isArmItem
                                      ? "bg-hue-cyan-500/10 text-hue-cyan-400 border border-hue-cyan-500/25"
                                      : "bg-hue-amber-500/10 text-hue-amber-400 border border-hue-amber-500/25"
                                  }`}
                                >
                                  {item.type || item.category}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 font-semibold text-gp-ink-200">{item.brand}</td>
                              <td className="py-3.5 px-3 text-gp-ink-300 font-mono text-2xs">
                                {item.warranty ? `Garansi ${item.warranty}` : item.recommendedFor || "VESA Compatible"}
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
                                    className="px-2.5 py-1 rounded-lg bg-gp-ink-700 hover:bg-gp-ink-600 text-gp-ink-100 text-2xs font-semibold transition-colors"
                                  >
                                    Detail →
                                  </button>
                                  {buyUrl && (
                                    <a
                                      href={buyUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-shopee/15 hover:bg-brand-shopee border border-brand-shopee/40 text-brand-shopee hover:text-white text-2xs font-bold transition-colors"
                                    >
                                      <ShoppingBag className="w-3 h-3" />
                                      <span>{platform}</span>
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Arm & Bracket Pagination */}
              <PaginationBar
                currentPage={armBracketPage}
                totalPages={totalArmBracketPages}
                totalItems={filteredArmsBrackets.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setArmBracketPage}
              />
            </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5B: DATABASE REKOMENDASI AKSESORIS SETUP (TABEL & 9 PER PAGE)     */}
        {/* ========================================================================= */}
        {activeMenuKey === "home" &&
          homepageSettings.sectionVisibility?.showPeripherals !== false && (
            <section
              id="database-accessories"
              className="gp-reveal space-y-6 pt-12 border-t border-gp-ink-700 animate-in fade-in duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-hue-blue-500/10 border border-hue-blue-500/25 text-hue-blue-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      04
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
                      <span>Database Rekomendasi Aksesoris Setup</span>
                      <span className="px-2 py-0.5 rounded text-3xs font-mono font-bold bg-hue-blue-500/10 text-hue-blue-400 border border-hue-blue-500/25">
                        SCREENBAR, KABEL, STAND & AUDIO
                      </span>
                    </h2>
                  </div>
                  <p className="text-xs text-gp-ink-300 font-sans pl-9">
                    Tabel kurasi screenbar anti-glare, kabel HDMI 2.1 / DP 1.4, cable management tray, dan audio setup.
                  </p>
                </div>

              <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
                <span className="px-2.5 py-1 rounded-full border border-gp-ink-700 bg-gp-ink-800 text-xs text-gp-ink-200 font-medium">
                  {filteredAccessories.length} Aksesoris
                </span>
                <Link
                  href="/catalog/accessories"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border bg-hue-blue-500/10 hover:bg-hue-blue-500/20 border-hue-blue-500/30 text-hue-blue-400 hover:text-hue-blue-300"
                  title="Buka Database Aksesoris di Halaman Terpisah"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Halaman Terpisah</span>
                </Link>
              </div>
              </div>

              {/* Category Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gp-ink-950 p-2.5 rounded-xl border border-gp-ink-700">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {accessoryCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setAccessoryCategory(cat.id);
                        setAccessoryPage(1);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        accessoryCategory === cat.id
                          ? "bg-hue-blue-500 text-white font-semibold shadow-sm"
                          : "bg-gp-ink-850 text-gp-ink-300 hover:text-white border border-gp-ink-700"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={accessorySearch}
                  onChange={(e) => {
                    setAccessorySearch(e.target.value);
                    setAccessoryPage(1);
                  }}
                  placeholder="Cari aksesoris setup..."
                  className="px-3.5 py-1.5 rounded-lg bg-gp-ink-850 border border-gp-ink-700 text-xs text-white placeholder-gp-ink-400 focus:outline-none focus:border-hue-blue-500 w-full sm:w-56"
                />
              </div>

              {/* Accessories Table View */}
              <div className="relative rounded-xl border border-gp-ink-700 bg-gp-ink-950 overflow-hidden shadow-tech-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                    <thead className="bg-gp-ink-998 text-gp-ink-200 uppercase text-3xs font-mono tracking-wider border-b-2 border-gp-ink-600 select-none">
                      <tr>
                        <th className="py-3 px-4 min-w-[220px] text-white">[ NAMA AKSESORIS ]</th>
                        <th className="py-3 px-3 min-w-[160px]">[ KATEGORI ]</th>
                        <th className="py-3 px-3 min-w-[130px]">[ BRAND ]</th>
                        <th className="py-3 px-3 min-w-[150px]">[ GARANSI & SPEK ]</th>
                        <th className="py-3 px-4 min-w-[140px] text-right font-mono text-hue-blue-400">[ KISARAN HARGA ]</th>
                        <th className="py-3 px-3 text-center min-w-[140px]">[ AKSI ]</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gp-ink-700/80 font-sans">
                      {paginatedAccessories.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gp-ink-400">
                            Tidak ada aksesoris yang sesuai dengan pencarian.
                          </td>
                        </tr>
                      ) : (
                        paginatedAccessories.map((item, idx) => {
                          const buyUrl = item.shopeeUrl || item.tokopediaUrl || item.tiktokUrl;
                          const platform = item.shopeeUrl ? "Shopee" : item.tokopediaUrl ? "Tokopedia" : item.tiktokUrl ? "TikTok" : "Marketplace";
                          const itemIcon = (() => {
                            const c = ((item.category || "") + " " + (item.type || "") + " " + item.name).toLowerCase();
                            if (c.includes("screenbar") || c.includes("lampu")) return "💡";
                            if (c.includes("kabel") || c.includes("cable") || c.includes("hdmi") || c.includes("dp")) return "🔌";
                            if (c.includes("audio") || c.includes("headset") || c.includes("speaker")) return "🎧";
                            if (c.includes("stand") || c.includes("riser")) return "📦";
                            return "⚡";
                          })();
                          return (
                            <tr
                              key={item.id || idx}
                              onClick={() => {
                                setSelectedPeripheralForPanel(item);
                                setIsPeripheralPanelOpen(true);
                              }}
                              className={`hover:bg-gp-ink-750 cursor-pointer transition-colors group ${
                                idx % 2 === 0 ? "bg-gp-ink-850" : "bg-gp-ink-850"
                              }`}
                            >
                              <td className="py-3.5 px-4 font-bold text-white">
                                <div className="flex items-center gap-2">
                                  <span className="text-base group-hover:scale-110 transition-transform">{itemIcon}</span>
                                  <span className="group-hover:text-hue-blue-400 transition-colors">{item.name}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-3">
                                <span className="px-2 py-0.5 rounded text-3xs font-bold bg-hue-blue-500/10 text-hue-blue-400 border border-hue-blue-500/25">
                                  {item.category}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 font-semibold text-gp-ink-200">{item.brand}</td>
                              <td className="py-3.5 px-3 text-gp-ink-300 font-mono text-2xs">
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
                                    className="px-2.5 py-1 rounded-lg bg-gp-ink-700 hover:bg-gp-ink-600 text-gp-ink-100 text-2xs font-semibold transition-colors"
                                  >
                                    Detail →
                                  </button>
                                  {buyUrl && (
                                    <a
                                      href={buyUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-shopee/15 hover:bg-brand-shopee border border-brand-shopee/40 text-brand-shopee hover:text-white text-2xs font-bold transition-colors"
                                    >
                                      <ShoppingBag className="w-3 h-3" />
                                      <span>{platform}</span>
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Accessories Pagination */}
              <PaginationBar
                currentPage={accessoryPage}
                totalPages={totalAccessoryPages}
                totalItems={filteredAccessories.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setAccessoryPage}
              />
            </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: DATABASE REKOMENDASI KURSI ERGONOMIS & GAMING [DRAFT Q2 2027]   */}
        {/* ========================================================================= */}
        {activeMenuKey === "home" &&
          Boolean(homepageSettings.sectionVisibility?.showChairs) === true && (
            <section
              id="database-chairs"
              className="gp-reveal space-y-6 pt-12 border-t border-gp-ink-700 animate-in fade-in duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-hue-purple-500/10 border border-hue-purple-500/25 text-hue-purple-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      05
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
                      <span>{homepageSettings.sectionTitles?.chairsTitle || "Database Rekomendasi Kursi Ergonomis & Gaming"}</span>
                      <span className="px-2 py-0.5 rounded text-3xs font-mono font-bold bg-hue-purple-500/20 text-hue-purple-300 border border-hue-purple-500/40">
                        [ DRAFT / STAGING CATALOG ]
                      </span>
                    </h2>
                  </div>
                  <p className="text-xs text-gp-ink-300 font-sans pl-9">
                    {homepageSettings.sectionTitles?.chairsSubtitle ||
                      "Kurasi kursi ergonomis breathable mesh, lumbar support presisi, dan gas lift Class 4."}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
                  <span className="px-2.5 py-1 rounded-full border border-gp-ink-700 bg-gp-ink-800 text-xs text-gp-ink-200 font-medium">
                    {filteredChairs.length} Pilihan Kursi (Draft)
                  </span>
                  <Link
                    href="/catalog/chairs"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border bg-hue-purple-500/10 hover:bg-hue-purple-500/20 border-hue-purple-500/30 text-hue-purple-400 hover:text-hue-purple-300"
                    title="Buka Database Rekomendasi Kursi di Halaman Terpisah"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka di Halaman Terpisah</span>
                  </Link>
                </div>
              </div>

              {/* Staging Notice Alert */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-hue-purple-950/30 border border-hue-purple-800/40 text-xs text-hue-purple-200">
                <AlertTriangle className="w-4 h-4 text-hue-purple-400 shrink-0" />
                <p>
                  <strong>Draft Notice:</strong> Katalog kursi ini merupakan kurasi eksperimental tahap awal dari riset komunitas GrayPlasma. Peluncuran database resmi dijadwalkan pada Q2 2027 setelah pengujian laboratorium komprehensif.
                </p>
              </div>

              {/* Category Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gp-ink-950 p-2.5 rounded-xl border border-gp-ink-700">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {chairCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setChairCategory(cat.id);
                        setChairPage(1);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        chairCategory === cat.id
                          ? "bg-gp-ink-50 text-black font-semibold shadow-sm"
                          : "bg-gp-ink-850 text-gp-ink-300 hover:text-white border border-gp-ink-700"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={chairSearch}
                  onChange={(e) => {
                    setChairSearch(e.target.value);
                    setChairPage(1);
                  }}
                  placeholder="Cari kursi ergonomis..."
                  className="px-3.5 py-1.5 rounded-lg bg-gp-ink-850 border border-gp-ink-700 text-xs text-white placeholder-gp-ink-400 focus:outline-none focus:border-hue-purple-500 w-full sm:w-56"
                />
              </div>

              {/* Chairs Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedChairs.map((chair) => {
                  return (
                    <div
                      key={chair.id}
                      className="p-5 rounded-2xl bg-gp-ink-900 border border-gp-ink-700/90 hover:border-hue-purple-500/40 transition-colors flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-3xs font-mono font-bold uppercase tracking-wider text-hue-purple-400 bg-hue-purple-500/10 px-2 py-0.5 rounded border border-hue-purple-500/20">
                              {chair.brand} • {chair.category}
                            </span>
                            <h3 className="text-base font-black text-white group-hover:text-hue-purple-300 transition-colors mt-1">
                              {chair.name}
                            </h3>
                          </div>
                          <span className="text-xs font-mono font-bold text-white tabular-nums bg-gp-ink-800 px-2.5 py-1 rounded border border-gp-ink-700 shrink-0">
                            {chair.price > 0 ? formatRupiah(chair.price) : "Cek Toko"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-2xs font-mono">
                          <div className="bg-gp-ink-800/80 px-2 py-1 rounded border border-gp-ink-700/80 text-gp-ink-200 truncate">
                            <span className="text-gp-ink-400">Lumbar:</span> {chair.lumbarSupport}
                          </div>
                          <div className="bg-gp-ink-800/80 px-2 py-1 rounded border border-gp-ink-700/80 text-gp-ink-200 truncate">
                            <span className="text-gp-ink-400">Armrest:</span> {chair.armrest}
                          </div>
                          <div className="bg-gp-ink-800/80 px-2 py-1 rounded border border-gp-ink-700/80 text-gp-ink-200 truncate">
                            <span className="text-gp-ink-400">Gaslift:</span> {chair.gasLift}
                          </div>
                          <div className="bg-gp-ink-800/80 px-2 py-1 rounded border border-gp-ink-700/80 text-gp-ink-200 truncate">
                            <span className="text-gp-ink-400">Max Beban:</span> {chair.maxWeightCapacity}
                          </div>
                        </div>

                        {chair.verdict && (
                          <p className="text-xs text-gp-ink-300 leading-relaxed bg-gp-ink-950/60 p-2.5 rounded-xl border border-gp-ink-700/60">
                            💡 <strong className="text-gp-ink-200">GrayPlasma Verdict:</strong> {chair.verdict}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gp-ink-800 flex items-center justify-between gap-2">
                        <span className="text-3xs text-gp-ink-400">{chair.recommendedHeight}</span>
                        <div className="flex items-center gap-1.5">
                          {chair.shopeeUrl && (
                            <a
                              href={chair.shopeeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-hue-orange-500/10 hover:bg-hue-orange-500/20 text-hue-orange-400 border border-hue-orange-500/30 text-2xs font-bold transition-colors"
                            >
                              Shopee
                            </a>
                          )}
                          {chair.tokopediaUrl && (
                            <a
                              href={chair.tokopediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-hue-emerald-500/10 hover:bg-hue-emerald-500/20 text-hue-emerald-400 border border-hue-emerald-500/30 text-2xs font-bold transition-colors"
                            >
                              Tokopedia
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chairs Pagination */}
              <PaginationBar
                currentPage={chairPage}
                totalPages={totalChairPages}
                totalItems={filteredChairs.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setChairPage}
              />
            </section>
        )}


        {/* ========================================================================= */}
        {/* VIEW: LIST AFTERSALES (AUTHENTIC NOTION KANBAN BOARD)                     */}
        {/* ========================================================================= */}
        {activeMenuKey === "aftersales-tier" && (
          homepageSettings.sectionVisibility.showAftersales === false ? (
            <div className="max-w-4xl mx-auto my-12 p-8 rounded-2xl bg-gp-ink-900 border border-hue-amber-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-hue-amber-500/10 border border-hue-amber-500/30 text-hue-amber-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white uppercase tracking-tight">[ // BOARD AFTERSALES SEDANG DIARSIPKAN SEMENTARA ]</h2>
              <p className="text-xs text-gp-ink-300 max-w-md mx-auto">Section evaluasi aftersales brand saat ini dinonaktifkan oleh tim admin untuk peninjauan kebijakan RMA.</p>
              <button onClick={() => setActiveMenuKey("home")} className="px-4 py-2 rounded-xl bg-gp-ink-700 hover:bg-gp-ink-600 text-xs text-white font-bold transition-colors">Kembali ke Beranda</button>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
              {/* Breadcrumb */}
              <div className="flex items-center justify-between bg-gp-ink-750 border border-gp-ink-650 rounded-xl px-4 py-2.5 text-xs text-gp-ink-300">
                <button
                  onClick={() => setActiveMenuKey("home")}
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Beranda</span>
                </button>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-hue-amber-400" />
                  LIST AFTERSALES (BRAND MONITOR OEM)
                </span>
              </div>

              {/* Notion Header & Icon Block */}
              <div className="space-y-4 pt-2">
                <div className="p-2.5 rounded-xl bg-gp-ink-800 border border-gp-ink-700 w-fit text-hue-amber-400">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  LIST AFTERSALES (BRAND MONITOR OEM)
                </h1>

                {/* Subtitle / Catatan Section (Exact match to Image 2) */}
                <div className="space-y-2 text-xs text-gp-ink-300">
                  <p className="font-semibold uppercase tracking-wider text-gp-ink-400">
                    AKAN DILENGKAPI
                  </p>
                  <div className="space-y-1">
                    <span className="font-bold text-gp-ink-200 uppercase">CATATAN :</span>
                    <ul className="list-disc pl-5 space-y-1 text-gp-ink-300">
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
          )
        )}

        {/* ========================================================================= */}
        {/* VIEW: TENTANG WEBSITE INI & PENULIS (ABOUT NOTION PAGE)                    */}
        {/* ========================================================================= */}
        {activeMenuKey === "about" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-gp-ink-300 hover:text-hue-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama</span>
              </button>
              <span className="text-xs text-gp-ink-400">Tentang Penulis</span>
            </div>

            <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-gp-ink-700 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hue-violet-500/10 border border-hue-violet-500/30 text-hue-violet-400 text-xs font-bold">
                  <User className="w-3.5 h-3.5" />
                  <span>Profil & Cerita Penulis</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  {ABOUT_NOTION_CONTENT.title}
                </h2>
                <p className="text-xs text-gp-ink-300">{ABOUT_NOTION_CONTENT.subtitle}</p>
              </div>

              {/* Part 1: Latar Belakang */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-hue-emerald-400 uppercase tracking-wider">
                  PART 1 | LATAR BELAKANG
                </h3>
                <div className="bg-gp-ink-950 p-5 rounded-2xl border border-gp-ink-700 text-xs text-gp-ink-200 leading-relaxed space-y-3">
                  <h4 className="font-bold text-white">1.1 WEBSITE GRAYPLASMA</h4>
                  <p>{ABOUT_NOTION_CONTENT.latarBelakang}</p>
                </div>
              </div>

              {/* Part 2: Penulis Joel Gray */}
              <div className="space-y-3">
                <div className="bg-gp-ink-950 p-5 rounded-2xl border border-gp-ink-700 text-xs text-gp-ink-200 leading-relaxed space-y-3">
                  <h4 className="font-bold text-white">1.2 PENULIS (Joel Gray / El)</h4>
                  <p>{ABOUT_NOTION_CONTENT.biodataPenulis}</p>
                </div>
              </div>

              {/* Collaborators Box */}
              <div className="p-4 rounded-xl bg-gp-ink-800 border border-gp-ink-700 text-xs flex items-center justify-between">
                <div>
                  <span className="text-gp-ink-300 block text-3xs uppercase font-bold">Hasil Kerjasama:</span>
                  <span className="font-bold text-white">@GrayPlasma • Data Pengujian GTID</span>
                </div>
                <a
                  href={consult.youtubeUrl || CONSULTATION_DATA.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-hue-red-500/10 border border-hue-red-500/30 text-hue-red-400 hover:bg-hue-red-500/20 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>YouTube GrayPlasma</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: HOW TO READ GrayPlasma GLOSSARY                                           */}
        {/* ========================================================================= */}
        {activeMenuKey === "glossary" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-gp-ink-300 hover:text-hue-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama</span>
              </button>
              <span className="text-xs text-gp-ink-400">How to Read Glossary</span>
            </div>

            <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-gp-ink-700 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hue-cyan-500/10 border border-hue-cyan-500/30 text-hue-cyan-400 text-xs font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Data Pengetesan GrayPlasma</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  {HOW_TO_READ_GLOSSARY.title}
                </h2>
                <p className="text-xs text-gp-ink-300">{HOW_TO_READ_GLOSSARY.subtitle}</p>
              </div>

              {/* Sections */}
              <div className="space-y-5">
                {HOW_TO_READ_GLOSSARY.sections.map((sec, idx) => (
                  <div key={idx} className="bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-5 space-y-3">
                    <h3 className="text-sm font-bold text-hue-emerald-400 uppercase tracking-wider">
                      {sec.title}
                    </h3>
                    <div className="text-xs text-gp-ink-200 leading-relaxed whitespace-pre-line">
                      {sec.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Case Study Box */}
              <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-hue-amber-400 uppercase tracking-wider">
                  Contoh Studi Kasus: Skyworth H27G30Q & Acer EK251Q Ebi
                </h3>
                <div className="text-xs text-gp-ink-200 leading-relaxed space-y-2">
                  <p>
                    - <strong>Skyworth H27G30Q:</strong> Pada glosarium tertulis OSD sRGB 4.87 deITP, namun di video review 5.75 deITP karena kolom tersebut diisi preset Rec.709.
                  </p>
                  <p>
                    - <strong>Acer EK251Q Ebi:</strong> Data sRGB akurat tapi tidak nyaman dipakai harian karena fitur Ultra Sharpness dipaksa selalu On.
                  </p>
                  <p className="text-hue-emerald-400 font-bold pt-1">
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
            <div className="flex items-center justify-between bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-gp-ink-300 hover:text-hue-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama</span>
              </button>
              <span className="text-xs text-gp-ink-400">Support & Donasi</span>
            </div>

            <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-6 sm:p-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-hue-rose-500/10 border border-hue-rose-500/30 text-hue-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Support & Donasi Penulis
                </h2>
                <p className="text-xs text-gp-ink-300 max-w-md mx-auto leading-relaxed">
                  Jika panduan dan kurasi monitor ini membantu Anda dalam memilih monitor idaman, Anda dapat memberikan apresiasi melalui QRIS / Saweria.
                </p>
              </div>

              {/* QRIS Placeholder Container */}
              <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-6 max-w-sm mx-auto space-y-4">
                <div className="w-48 h-48 bg-gp-ink-800 border border-gp-ink-600 rounded-xl mx-auto flex flex-col items-center justify-center text-center p-4">
                  <QrCode className="w-16 h-16 text-hue-emerald-400 mb-2" />
                  <span className="text-xs font-bold text-white">QRIS All Payment</span>
                  <span className="text-3xs text-gp-ink-400">Gopay / OVO / Dana / BCA</span>
                </div>
                <div className="text-xs text-gp-ink-200">
                  <strong>Saweria GrayPlasma:</strong> saweria.co/grayplasma
                </div>
              </div>

              {/* Business Inquiries */}
              <div className="p-4 rounded-xl bg-gp-ink-950 border border-gp-ink-700 text-xs text-gp-ink-200 max-w-md mx-auto">
                <strong className="text-white block mb-1">Business Inquiries & Konsultasi:</strong>
                <span>WhatsApp: {consult.whatsapp || CONSULTATION_DATA.whatsapp} (a.n Joel Gray)</span>
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
            <div className="flex items-center justify-between bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-gp-ink-300 hover:text-hue-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama</span>
              </button>

              <span className="text-xs text-gp-ink-400">
                {activeMenuKey === "catalog-1080p" && "Kategori: 1080p (FHD)"}
                {activeMenuKey === "catalog-1440p" && "Kategori: 1440p (2K)"}
                {activeMenuKey === "catalog-oled" && "Kategori: OLED & Flagship"}
                {activeMenuKey === "catalog-4k" && "Kategori: 4K UHD"}
                {activeMenuKey === "catalog-all" && "Semua Rekomendasi"}
              </span>
            </div>

            {/* Active Filter Chips */}
            <ActiveFilterPills
              filterState={filterState}
              onFilterChange={setFilterState}
              onResetFilters={handleResetFilters}
              onOpenFilter={() => setIsMobileDrawerOpen(true)}
            />

            <section className="w-full min-w-0 space-y-6">
              {/* Results Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-bold text-white">
                    Menampilkan {filteredMonitors.length} Model Monitor
                  </span>
                  {filterState.searchQuery && (
                    <span className="text-xs text-gp-ink-300">
                      untuk &ldquo;<span className="text-hue-emerald-400">{filterState.searchQuery}</span>&rdquo;
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
                  {/* Parameter & Telemetry Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-1.5 border ${
                      activeFilterCount > 0
                        ? "bg-hue-emerald-500/15 border-hue-emerald-500/60 text-hue-emerald-300 shadow-tech-subtle"
                        : "bg-gp-ink-800 border-gp-ink-700 text-gp-ink-200 hover:text-white hover:border-gp-ink-600"
                    }`}
                    title="Buka panel parameter filter"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-hue-emerald-400" />
                    <span>[ PARAMETER & FILTER {activeFilterCount > 0 ? `(${activeFilterCount})` : ""} ]</span>
                  </button>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gp-ink-800 border border-gp-ink-700 rounded-xl p-0.5">
                    <button
                      type="button"
                      onClick={() => handleSetViewMode("grid")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        viewMode === "grid"
                          ? "bg-gp-ink-700 text-hue-emerald-400 shadow-sm"
                          : "text-gp-ink-300 hover:text-white"
                      }`}
                    >
                      🔲 Galeri Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetViewMode("table")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        viewMode === "table"
                          ? "bg-gp-ink-700 text-hue-emerald-400 shadow-sm"
                          : "text-gp-ink-300 hover:text-white"
                      }`}
                    >
                      📋 Tabel Database
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-gp-ink-400" />
                    <select
                      value={filterState.sortBy}
                      onChange={(e) =>
                        setFilterState((prev) => ({
                          ...prev,
                          sortBy: e.target.value as FilterState["sortBy"],
                        }))
                      }
                      className="bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-hue-emerald-500 cursor-pointer"
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
                      className="bg-gp-ink-950 border border-gp-ink-800 rounded-2xl p-5 space-y-4 animate-pulse"
                    >
                      <div className="w-full aspect-[16/10] bg-gp-ink-800 rounded-xl" />
                      <div className="w-3/4 h-5 bg-gp-ink-800 rounded" />
                      <div className="w-full h-9 bg-gp-ink-800 rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : filteredMonitors.length > 0 ? (
                viewMode === "table" ? (
                  <NotionTableView
                    monitors={filteredMonitors}
                    selectedMonitorId={selectedMonitor?.id}
                    onSelectMonitor={(m) => setSelectedMonitor(m)}
                    onOpenFilter={() => setIsMobileDrawerOpen(true)}
                    activeFilterCount={activeFilterCount}
                  />
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5">
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
                <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 my-6">
                  <SearchX className="w-10 h-10 text-gp-ink-400" />
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">
                      Tidak Ditemukan Monitor yang Cocok
                    </h3>
                    <p className="text-xs text-gp-ink-300">
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

            {/* FilterBar as Modal */}
            <FilterBar
              filterState={filterState}
              onFilterChange={setFilterState}
              onResetFilters={handleResetFilters}
              isOpen={isMobileDrawerOpen}
              onClose={() => setIsMobileDrawerOpen(false)}
              totalFilteredCount={filteredMonitors.length}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: REKOMENDASI MEJA, SETUP, & PERIPHERALS                              */}
        {/* ========================================================================= */}
        {activeMenuKey === "desk-guide" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-gp-ink-300 hover:text-hue-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama</span>
              </button>
              <span className="text-xs text-gp-ink-400">Panduan Meja & Peripherals</span>
            </div>

            {/* Ergonomic Depth Guide Cards */}
            <div className="space-y-4">
              <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <LayoutGrid className="w-5 h-5 text-hue-amber-400" />
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">
                    Panduan Ukuran Meja vs Ukuran Monitor (Ergonomi Jarak Pandang)
                  </h2>
                </div>
                <p className="text-xs text-gp-ink-300 leading-relaxed max-w-3xl">
                  Banyak orang salah membeli monitor 27 atau 32 inci pada meja berkedalaman sempit (50cm) sehingga mata cepat lelah dan leher pegal. Berikut panduan perhitungannya:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {deskGuides.filter(g => g.isPublished !== false).map((guide, idx) => (
                  <div
                    key={idx}
                    className="bg-gp-ink-950 border border-gp-ink-700/90 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <span className="text-3xs font-black uppercase tracking-wider text-hue-emerald-400 bg-hue-emerald-500/10 px-2 py-0.5 rounded border border-hue-emerald-500/30">
                        {guide.recommendedSizes}
                      </span>
                      <h3 className="text-base font-black text-white">{guide.deskDepth}</h3>
                      <div className="text-xs text-gp-ink-300">
                        <strong>Jarak Pandang Ideal:</strong> {guide.viewingDistance}
                      </div>
                      <p className="text-xs text-gp-ink-200 leading-relaxed bg-gp-ink-800/60 p-3 rounded-xl border border-gp-ink-700/80">
                        {guide.notes}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gp-ink-800 text-xs text-gp-ink-300">
                      <strong className="text-gp-ink-100 block mb-1">Rekomendasi Arm:</strong>
                      <span>{guide.monitorArmRecommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Desk & Peripherals Database Tables (Notion Collection) */}
            <DeskPeripheralsView
              desks={desksData}
              peripherals={peripheralsData}
              chairs={chairsData}
              showChairs={homepageSettings.sectionVisibility.showChairs ?? false}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: TRUE HDR VS FAKE HDR 400                                            */}
        {/* ========================================================================= */}
        {activeMenuKey === "hdr-guide" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-gp-ink-300 hover:text-hue-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama</span>
              </button>
              <span className="text-xs text-gp-ink-400">Monitor HDR Guide</span>
            </div>

            <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-2">
                <SunMedium className="w-5 h-5 text-hue-rose-400" />
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  Edukasi Monitor HDR: True HDR vs Fake DisplayHDR 400
                </h2>
              </div>
              <p className="text-xs text-gp-ink-300 leading-relaxed max-w-3xl">
                Banyak monitor murah mencantumkan label &ldquo;HDR10&rdquo; atau &ldquo;DisplayHDR 400&rdquo; sebagai gimik marketing. Tanpa teknologi Local Dimming atau panel OLED, menyalakan HDR di Windows justru merusak akurasi warna.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {hdrGuides.filter(h => h.isPublished !== false).map((hdr, idx) => (
                <div
                  key={idx}
                  className={`bg-gp-ink-950 border rounded-2xl p-5 space-y-4 flex flex-col justify-between ${hdr.tier === "TRUE HDR"
                      ? "border-hue-emerald-500/50 shadow-tech-card"
                      : hdr.tier === "DECENT HDR"
                        ? "border-hue-amber-500/40"
                        : "border-gp-ink-700"
                    }`}
                >
                  <div className="space-y-3">
                    <span
                      className={`text-3xs font-black px-2 py-0.5 rounded uppercase tracking-wider ${hdr.tier === "TRUE HDR"
                          ? "bg-hue-emerald-500 text-black"
                          : hdr.tier === "DECENT HDR"
                            ? "bg-hue-amber-500 text-black"
                            : "bg-gp-ink-700 text-gp-ink-300"
                        }`}
                    >
                      {hdr.tier}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug">{hdr.requirements}</h3>

                    <div className="space-y-1.5 text-xs text-gp-ink-300">
                      <div><strong>Peak Brightness:</strong> {hdr.peakBrightness}</div>
                      <div><strong>Dimming Zones:</strong> {hdr.dimmingZones}</div>
                      <div><strong>Kontras:</strong> {hdr.contrastRatio}</div>
                    </div>

                    <p className="text-xs text-gp-ink-200 leading-relaxed bg-gp-ink-800/60 p-3 rounded-xl border border-gp-ink-700/80">
                      {hdr.verdict}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gp-ink-800 text-xs">
                    <strong className="text-gp-ink-300 block mb-1">Contoh Monitor:</strong>
                    <div className="space-y-1">
                      {hdr.models.map((m, i) => (
                        <div key={i} className="text-gp-ink-200 flex items-center gap-1.5 text-2xs">
                          <span className="w-1 h-1 bg-hue-emerald-400 rounded-full" />
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
            <div className="flex items-center justify-between bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-gp-ink-300 hover:text-hue-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama</span>
              </button>
              <span className="text-xs text-gp-ink-400">GrayNotes Teknis</span>
            </div>

            <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-2">
                <BookOpen className="w-5 h-5 text-hue-cyan-400" />
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  GrayNotes: Catatan Teknis & Pengujian Monitor
                </h2>
              </div>
              <p className="text-xs text-gp-ink-300 leading-relaxed max-w-3xl">
                Rangkuman materi penting seputar port DisplayPort vs HDMI, cara membaca response time GrayPlasma, proteksi OLED, dan kebijakan klaim dead pixel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {graynotes.filter(n => n.isPublished !== false).map((note) => (
                <div key={note.id} className="bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-3xs font-black uppercase text-hue-cyan-400 bg-hue-cyan-500/10 px-2 py-0.5 rounded border border-hue-cyan-500/30">
                      {note.category}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white">{note.title}</h3>

                  <p className="text-xs text-gp-ink-200 leading-relaxed bg-gp-ink-800/60 p-3 rounded-xl border border-gp-ink-700/80">
                    {note.summary}
                  </p>

                  <ul className="space-y-1.5">
                    {note.details.map((d, idx) => (
                      <li key={idx} className="text-xs text-gp-ink-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-hue-cyan-400 mt-1.5 flex-shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  {note.warning && (
                    <div className="p-2.5 rounded-xl bg-hue-rose-500/10 border border-hue-rose-500/30 text-hue-rose-300 text-xs">
                      {note.warning}
                    </div>
                  )}

                  <div className="pt-2 border-t border-gp-ink-800 text-xs text-hue-emerald-400">
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
            <div className="flex items-center justify-between bg-gp-ink-750 border border-gp-ink-650 rounded-xl px-4 py-2.5 text-xs text-gp-ink-300">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </button>
              <span className="text-gp-ink-100 font-medium">
                ❓ QNA & GRAYNOTES (FAQ)
              </span>
            </div>

            {/* Notion Header & Icon Block */}
            <div className="space-y-4 pt-2">
              <div className="text-4xl">❓</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                QNA & GRAYNOTES (PERTANYAAN SERING DIAJUKAN)
              </h1>

              <div className="space-y-2 text-xs text-gp-ink-300">
                <p className="font-semibold uppercase tracking-wider text-gp-ink-400">
                  DATABASE EDUKASI & JAWABAN RESMI
                </p>
                <div className="space-y-1">
                  <span className="font-bold text-gp-ink-200 uppercase">CATATAN :</span>
                  <ul className="list-disc pl-5 space-y-1 text-gp-ink-300">
                    <li>
                      Seluruh ulasan dan panduan disusun independen oleh GrayPlasma (@gray1plasma) berdasarkan pengujian laboratorium GrayPlasma.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Notion Collection List */}
            <div className="space-y-3 pt-2">
              {(faqs.length > 0 ? faqs : FAQ_LIST).filter(f => f.isPublished !== false).map((faq) => {
                const slug = faq.id.replace(/^faq-/, "");
                const subPath = `/guide/faq/${slug}`;

                return (
                  <div
                    key={faq.id}
                    className="p-5 rounded-2xl bg-gp-ink-750 border border-gp-ink-650 hover:border-gp-ink-600 transition-colors space-y-3 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gp-ink-700 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">📄</span>
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                          {faq.question}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-3xs font-bold px-2 py-0.5 rounded bg-gp-mint-900 text-gp-mint uppercase">
                          {faq.category || "FAQ"}
                        </span>
                        {faq.important && (
                          <span className="text-3xs font-bold px-2 py-0.5 rounded bg-gp-ember-400 text-gp-ember uppercase">
                            Penting
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Answer Block */}
                    <div className="text-xs sm:text-sm text-gp-ink-200 leading-relaxed whitespace-pre-line">
                      <NotionBlockRenderer content={faq.answer} />
                    </div>

                    {/* Footer Actions with Dedicated Sub-Path */}
                    <div className="pt-2 border-t border-gp-ink-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <span className="text-2xs font-mono text-gp-ink-400 truncate">
                        Link: {subPath}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const text = `**[FAQ GRAYPLASMA] ${faq.question}**\n${faq.answer}\n🔗 ${window.location.origin}${subPath}`;
                            navigator.clipboard.writeText(text);
                            alert("Format callback Discord untuk pertanyaan ini telah disalin!");
                          }}
                          className="px-2.5 py-1 rounded bg-gp-ink-700 border border-gp-ink-650 hover:bg-gp-ink-650 text-gp-ink-200 hover:text-white flex items-center gap-1.5 transition-colors font-semibold"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-gp-sky" />
                          <span>Copy Discord Callback</span>
                        </button>

                        <Link
                          href={subPath}
                          className="px-3 py-1 rounded bg-gp-sky-800 hover:bg-gp-sky-700 text-white font-bold flex items-center gap-1 transition-colors"
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
            <div className="flex items-center justify-between bg-gp-ink-750 border border-gp-ink-650 rounded-xl px-4 py-2.5 text-xs text-gp-ink-300">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="hover:text-white flex items-center gap-1.5 transition-colors font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama</span>
              </button>
              <span className="text-white font-medium">🪑 REKOMENDASI MEJA</span>
            </div>

            <DeskRecommendationsView desks={desksData} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: BANDWIDTH GUIDANCES (NOTION STYLE)                                   */}
        {/* ========================================================================= */}
        {activeMenuKey === "bandwidth-guide" && (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between bg-gp-ink-750 border border-gp-ink-650 rounded-xl px-4 py-2.5 text-xs text-gp-ink-300">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </button>
              <span className="text-gp-ink-100 font-medium">
                🔌 BANDWIDTH GUIDANCE
              </span>
            </div>

            {/* Notion Header & Icon Block */}
            <div className="space-y-4 pt-2">
              <div className="text-4xl">🔌</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                BANDWIDTH GUIDANCE: HDMI 2.0 vs 2.1 vs DisplayPort 1.4/2.1
              </h1>

              <div className="space-y-2 text-xs text-gp-ink-300">
                <p className="font-semibold uppercase tracking-wider text-gp-ink-400">
                  PANDUAN KONEKTIVITAS & KABEL DISPLAY
                </p>
                <div className="space-y-1">
                  <span className="font-bold text-gp-ink-200 uppercase">CATATAN :</span>
                  <ul className="list-disc pl-5 space-y-1 text-gp-ink-300">
                    <li>
                      Kenapa monitor 1440p 180Hz turun ke 144Hz atau warna turun ke 8-bit saat memakai kabel HDMI 2.0 bawaan.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {bandwidthGuides.filter(b => b.isPublished !== false).map((item, idx) => (
                <div key={idx} className="bg-gp-ink-750 border border-gp-ink-650 rounded-2xl p-6 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="text-hue-emerald-400">⚡</span>
                      <span>{item.interface}</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-gp-mint bg-gp-mint-900 px-2.5 py-1 rounded">
                      {item.bandwidth}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gp-ink-200 pt-1">
                    <div className="p-3.5 rounded-xl bg-gp-ink-800 border border-gp-ink-700">
                      <strong className="text-gp-ink-300 block text-3xs uppercase">Maksimal Resolusi & Refresh:</strong>
                      <span className="font-bold text-white mt-1 block text-sm">{item.maxResolutionHz}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gp-ink-800 border border-gp-ink-700">
                      <strong className="text-gp-ink-300 block text-3xs uppercase">Color Depth & DSC:</strong>
                      <span className="font-bold text-white mt-1 block text-sm">{item.colorDepth}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gp-ink-300 leading-relaxed pt-1">
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
            <div className="flex items-center justify-between bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-gp-ink-300 hover:text-hue-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama</span>
              </button>
              <span className="text-xs text-gp-ink-400">Kritik & Saran</span>
            </div>

            <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-6 sm:p-8 space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-hue-amber-500/10 border border-hue-amber-500/30 text-hue-amber-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Form Kritik & Saran GrayPlasma
                </h2>
                <p className="text-xs sm:text-sm text-gp-ink-300 max-w-xl mx-auto leading-relaxed">
                  Punya request monitor baru yang ingin dimasukkan ke database, koreksi harga / data pengetesan, atau saran untuk pengembangan website? Sampaikan langsung kepada kami!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
                <a
                  href={consult.feedbackFormUrl || CONSULTATION_DATA.feedbackFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-hue-amber-500/10 border border-hue-amber-500/30 hover:border-hue-amber-500 hover:bg-hue-amber-500/20 transition-colors space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-hue-amber-400">Google Form Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gp-ink-400 group-hover:text-hue-amber-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Formulir Kritik & Saran</h4>
                  <p className="text-xs text-gp-ink-300 leading-relaxed">
                    Buka dan isi kuesioner Google Form resmi GrayPlasma untuk request monitor atau feedback website.
                  </p>
                </a>

                <a
                  href={consult.discordUrl || CONSULTATION_DATA.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-gp-ink-950 border border-gp-ink-700 hover:border-hue-cyan-500/60 hover:bg-gp-ink-800 transition-colors space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-hue-cyan-400">Forum Discord GrayPlasma</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gp-ink-400 group-hover:text-hue-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Saluran Saran & Diskusi</h4>
                  <p className="text-xs text-gp-ink-300 leading-relaxed">
                    Sampaikan masukanmu langsung di channel komunitas Discord bersama ribuan enthusiast monitor lainnya.
                  </p>
                </a>

                <a
                  href={consult.whatsappUrl || CONSULTATION_DATA.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-gp-ink-950 border border-gp-ink-700 hover:border-hue-emerald-500/60 hover:bg-gp-ink-800 transition-colors space-y-2 group sm:col-span-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-hue-emerald-400">Direct Chat WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gp-ink-400 group-hover:text-hue-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Chat Joel Gray (@gray1plasma)</h4>
                  <p className="text-xs text-gp-ink-300 leading-relaxed">
                    Kirim pesan personal via WhatsApp ({consult.whatsapp || CONSULTATION_DATA.whatsapp}) jika menemukan bug atau kesalahan data di website ini.
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
            <div className="flex items-center justify-between bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-4 py-2.5">
              <button
                onClick={() => setActiveMenuKey("home")}
                className="text-xs font-bold text-gp-ink-300 hover:text-hue-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama</span>
              </button>
              <span className="text-xs text-gp-ink-400">Kontak & Konsultasi</span>
            </div>

            <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-6 sm:p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-hue-emerald-500/10 border border-hue-emerald-500/30 text-hue-emerald-400 flex items-center justify-center mx-auto">
                <Headphones className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Konsultasi Rekomendasi Monitor (Joel Gray)
              </h2>
              <p className="text-xs sm:text-sm text-gp-ink-300 max-w-xl mx-auto leading-relaxed">
                Bingung memilih monitor yang cocok untuk spesifikasi PC, ukuran meja, dan anggaran Anda? Hubungi langsung via WhatsApp atau Discord.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* WhatsApp */}
              <a
                href={consult.whatsappUrl || CONSULTATION_DATA.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-gp-ink-950 border border-gp-ink-700 hover:border-hue-emerald-500/60 hover:bg-gp-ink-800 transition-colors text-center space-y-2 group"
              >
                <PhoneCall className="w-6 h-6 text-hue-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-white">WhatsApp Langsung</h3>
                <p className="text-xs text-gp-ink-300 font-mono">{consult.whatsapp || CONSULTATION_DATA.whatsapp}</p>
                <span className="text-2xs font-bold text-hue-emerald-400 block pt-1">Chat Sekarang →</span>
              </a>

              {/* TikTok */}
              <a
                href={consult.tiktokUrl || CONSULTATION_DATA.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-gp-ink-950 border border-gp-ink-700 hover:border-hue-rose-500/60 hover:bg-gp-ink-800 transition-colors text-center space-y-2 group"
              >
                <Send className="w-6 h-6 text-hue-rose-400 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-white">TikTok</h3>
                <p className="text-xs text-gp-ink-300">{consult.tiktok || CONSULTATION_DATA.tiktok}</p>
                <span className="text-2xs font-bold text-hue-rose-400 block pt-1">Follow & Tanya di Live →</span>
              </a>

              {/* Discord */}
              <a
                href={consult.discordUrl || CONSULTATION_DATA.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-gp-ink-950 border border-gp-ink-700 hover:border-hue-cyan-500/60 hover:bg-gp-ink-800 transition-colors text-center space-y-2 group"
              >
                <MessageSquare className="w-6 h-6 text-hue-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-white">Discord Community</h3>
                <p className="text-xs text-gp-ink-300">GrayPlasma</p>
                <span className="text-2xs font-bold text-hue-cyan-400 block pt-1">Join Server →</span>
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
          <div className="p-3 rounded-2xl bg-gp-ink-800 border border-gp-ink-700 text-hue-emerald-400 animate-pulse">
            <Tv className="w-8 h-8" />
          </div>
          <p className="text-xs font-mono font-bold text-hue-emerald-400 uppercase tracking-widest">
            Memuat Katalog GrayPlasma...
          </p>
        </div>
      }
    >
      <CatalogPageContent />
    </Suspense>
  );
}
