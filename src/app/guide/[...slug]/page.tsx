"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Copy,
  Check,
  Share2,
  MessageSquare,
  PhoneCall,
  ExternalLink,
  BookOpen,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  ChevronRight,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  Heart,
  Headphones,
  LayoutGrid,
  Info,
  CheckCircle2,
  Monitor as MonitorIcon,
  Layers,
  FileText,
  User,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { SiteHierarchyNode } from "@/types/site-hierarchy";
import { DEFAULT_SITE_HIERARCHY } from "@/data/site-hierarchy";
import { DatabaseService, GlobalSiteSettings, DEFAULT_SITE_SETTINGS, AvoidBrandItem } from "@/lib/db-service";
import { ABOUT_NOTION_CONTENT } from "@/data/grayplasma-content";
import { AnnouncementBar } from "@/components/announcement-bar";
import { MONITORS_DATA } from "@/data/monitors";
import { Monitor } from "@/types/monitor";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MonitorSidePanel } from "@/components/monitor-side-panel";
import { NotionKanbanBoard, NotionBoardCard } from "@/components/notion-kanban-board";
import { NotionAftersalesSidePanel } from "@/components/notion-aftersales-side-panel";
import {
  NOTION_AFTERSALES_COLUMNS,
  NOTION_AFTERSALES_CARDS,
} from "@/data/notion-aftersales-board-data";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";
import { NotionTableView } from "@/components/notion-table-view";
import { FilterBar, ActiveFilterPills } from "@/components/filter-bar";
import {
  FilterState,
  INITIAL_FILTER_STATE,
  TierRating,
  PanelType,
  RefreshRateOption,
  ScreenSizeCategory,
  ResolutionCategory,
} from "@/types/monitor";
import { CONSULTATION_DATA, FAQ_LIST } from "@/data/grayplasma-content";
import { formatRupiah } from "@/lib/utils";
import { DeskPeripheralsView } from "@/components/desk-peripherals-view";
import {
  DESK_DATABASE,
  PERIPHERALS_DATABASE,
  DEFAULT_CHAIRS_DATABASE,
  DeskItem,
  PeripheralItem,
  ChairItem,
} from "@/data/grayplasma-desk-peripherals";
import { SubpageNavbar, BreadcrumbItem } from "@/components/subpage-navbar";

interface GuideDynamicPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default function GuideDynamicPage({ params }: GuideDynamicPageProps) {
  const resolvedParams = use(params);
  const rawSlug = resolvedParams?.slug || ["sdr", "glossary"];
  const slugParts = Array.isArray(rawSlug) ? rawSlug : [rawSlug];
  const fullPath = `/guide/${slugParts.join("/")}`;
  const firstSlug = slugParts[0] || "";
  const lastSlug = slugParts[slugParts.length - 1] || "";

  const [nodes, setNodes] = useState<SiteHierarchyNode[]>(DEFAULT_SITE_HIERARCHY);
  const [monitors, setMonitors] = useState<Monitor[]>(MONITORS_DATA);
  const [desks, setDesks] = useState<DeskItem[]>(DESK_DATABASE);
  const [peripherals, setPeripherals] = useState<PeripheralItem[]>(PERIPHERALS_DATABASE);
  const [chairs, setChairs] = useState<ChairItem[]>(DEFAULT_CHAIRS_DATABASE);
  const [aftersalesCards, setAftersalesCards] = useState<NotionBoardCard[]>(NOTION_AFTERSALES_CARDS);
  const [faqs, setFaqs] = useState<typeof FAQ_LIST>(FAQ_LIST);
  const [siteSettings, setSiteSettings] = useState<GlobalSiteSettings>(DEFAULT_SITE_SETTINGS);
  const [aboutContent, setAboutContent] = useState(ABOUT_NOTION_CONTENT);
  const [brandsAvoid, setBrandsAvoid] = useState<AvoidBrandItem[]>(DatabaseService.getBrandsToAvoid());
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Filter state for catalog database pages
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Side-panel drawer state for monitor click
  const [selectedMonitorForPanel, setSelectedMonitorForPanel] = useState<Monitor | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // Aftersales side-panel drawer state
  const [selectedAftersalesCard, setSelectedAftersalesCard] = useState<NotionBoardCard | null>(null);
  const [isAftersalesPanelOpen, setIsAftersalesPanelOpen] = useState(false);

  const [showChairs, setShowChairs] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [loadedNodes, loadedMonitors, loadedDesks, loadedCards, loadedSettings, loadedPeriphs, loadedChairs, loadedHp] = await Promise.all([
          DatabaseService.getHierarchyNodes(),
          DatabaseService.getMonitors(),
          DatabaseService.getDesks(),
          DatabaseService.getAftersalesCards(),
          DatabaseService.getSiteSettings(),
          DatabaseService.getPeripherals(),
          DatabaseService.getChairsAsync(),
          DatabaseService.getHomepageSettings(),
        ]);
        if (loadedNodes && loadedNodes.length > 0) setNodes(loadedNodes);
        if (loadedMonitors && loadedMonitors.length > 0) setMonitors(loadedMonitors);
        if (loadedDesks && loadedDesks.length > 0) setDesks(loadedDesks.filter((d) => d.isPublished !== false));
        if (loadedCards && loadedCards.length > 0) setAftersalesCards(loadedCards);
        if (loadedSettings) setSiteSettings(loadedSettings);
        if (loadedPeriphs && loadedPeriphs.length > 0) setPeripherals(loadedPeriphs.filter((p) => p.isPublished !== false));
        if (loadedChairs && loadedChairs.length > 0) {
          const pubChairs = loadedChairs.filter((c) => c.isPublished !== false);
          setChairs(pubChairs.length > 0 ? pubChairs : DEFAULT_CHAIRS_DATABASE);
        }
        if (loadedHp?.sectionVisibility) {
          setShowChairs(Boolean(loadedHp.sectionVisibility.showChairs));
        }

        const loadedFaqs = await DatabaseService.getFAQAsync();
        if (loadedFaqs && loadedFaqs.length > 0) setFaqs(loadedFaqs.filter((f) => f.isPublished !== false));

        const loadedAbout = DatabaseService.getAboutContent();
        if (loadedAbout) setAboutContent(loadedAbout);

        const loadedBrands = DatabaseService.getBrandsToAvoid();
        if (loadedBrands && loadedBrands.length > 0) setBrandsAvoid(loadedBrands.filter((b) => b.isPublished !== false));
      } catch (e) {
        console.error("Failed to load guide data", e);
      }
    }
    load();
  }, []);

  // 1. Check if this is a monitor deep-dive: /guide/monitor/[slug]
  const isMonitorRoute = firstSlug === "monitor" || slugParts.includes("monitor");
  const targetMonitorSlug = isMonitorRoute ? lastSlug : "";
  const matchedMonitor = monitors.find(
    (m) => m.slug === targetMonitorSlug || m.id === targetMonitorSlug
  );

  // Peripheral & Hardware Categories
  const isDeskPage =
    lastSlug === "desks" ||
    firstSlug === "desks" ||
    lastSlug === "rekomendasi-meja" ||
    firstSlug === "rekomendasi-meja" ||
    fullPath.includes("/catalog/desks");

  const isArmBracketPage =
    lastSlug === "arms-brackets" ||
    lastSlug === "arms" ||
    lastSlug === "brackets" ||
    lastSlug === "arm-bracket" ||
    lastSlug === "monitor-arm" ||
    fullPath.includes("/catalog/arms-brackets");

  const isAccessoriesPage =
    lastSlug === "accessories" ||
    lastSlug === "aksesoris" ||
    lastSlug === "peripherals" ||
    fullPath.includes("/catalog/accessories");

  const isChairsPage =
    lastSlug === "chairs" ||
    lastSlug === "kursi" ||
    lastSlug === "kursi-ergonomis" ||
    fullPath.includes("/catalog/chairs");

  // 2. Check if this is a catalog recommendation category (Monitors only)
  const isCatalogPage =
    (firstSlug === "catalog" ||
      slugParts.includes("catalog") ||
      firstSlug === "recommendations" ||
      firstSlug === "rekomendasi") &&
    !isDeskPage &&
    !isArmBracketPage &&
    !isAccessoriesPage &&
    !isChairsPage;

  const filteredCatalogMonitors = useMemo(() => {
    return monitors.filter((m) => {
      // Base category filter
      if (isCatalogPage) {
        if (lastSlug === "1080p") {
          if (!m.specs.display.resolution.includes("1080") && !m.specs.display.resolution.includes("FHD")) return false;
        } else if (lastSlug === "1440p") {
          if (!m.specs.display.resolution.includes("1440") && !m.specs.display.resolution.includes("2K") && !m.specs.display.resolution.includes("QHD")) return false;
        } else if (lastSlug === "oled") {
          if (!m.specs.display.panelType.toLowerCase().includes("oled")) return false;
        } else if (lastSlug === "4k") {
          if (!m.specs.display.resolution.includes("4K") && !m.specs.display.resolution.includes("3840")) return false;
        }
      }

      // FilterBar states
      if (filterState.searchQuery.trim()) {
        const query = filterState.searchQuery.toLowerCase();
        const searchableText = `${m.fullName} ${m.brand} ${m.model} ${m.specs.display.panelType} ${m.specs.display.refreshRate}Hz ${m.tags.join(" ")} ${m.tier}`.toLowerCase();
        if (!searchableText.includes(query)) return false;
      }

      if (m.price > filterState.budgetRange[1]) return false;

      if (filterState.panelTypes.length > 0) {
        const hasMatchingPanel = filterState.panelTypes.some((p) =>
          m.specs.display.panelType.toLowerCase().includes(p.toLowerCase())
        );
        if (!hasMatchingPanel) return false;
      }

      if (filterState.refreshRates.length > 0) {
        const rate = m.specs.display.refreshRate;
        const matchesRate = filterState.refreshRates.some((opt) => {
          if (opt === "100Hz") return rate <= 100;
          if (opt === "144Hz") return rate === 144;
          if (opt === "165Hz–180Hz") return rate >= 165 && rate <= 180;
          if (opt === "240Hz+") return rate >= 240;
          return false;
        });
        if (!matchesRate) return false;
      }

      if (filterState.screenSizes.length > 0) {
        const sizeStr = m.specs.display.size.toLowerCase();
        const matchesSize = filterState.screenSizes.some((opt) => {
          if (opt === '24"') return sizeStr.includes("23.") || sizeStr.includes("24");
          if (opt === '27"') return sizeStr.includes("26.") || sizeStr.includes("27");
          if (opt === '32"') return sizeStr.includes("32");
          if (opt === "Ultrawide") return sizeStr.includes("ultrawide") || sizeStr.includes("34");
          return false;
        });
        if (!matchesSize) return false;
      }

      if (filterState.resolutions.length > 0) {
        const resStr = m.specs.display.resolution.toLowerCase();
        const matchesRes = filterState.resolutions.some((opt) => {
          if (opt === "FHD (1080p)") return resStr.includes("1080") || resStr.includes("fhd");
          if (opt === "2K (1440p)") return resStr.includes("1440") || resStr.includes("2k");
          if (opt === "4K (2160p)") return resStr.includes("2160") || resStr.includes("4k");
          return false;
        });
        if (!matchesRes) return false;
      }

      if (filterState.tiers.length > 0) {
        if (!filterState.tiers.includes(m.tier)) return false;
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
  }, [monitors, isCatalogPage, lastSlug, filterState]);

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

  // 3. Check if this matches a site hierarchy guide node
  const matchedNode = nodes.find((n) => {
    if (n.fullPath === fullPath) return true;
    if (n.slug === lastSlug) return true;
    if (n.fullPath.endsWith(lastSlug)) return true;
    return false;
  });

  const isAftersalesPage =
    lastSlug.includes("aftersales") ||
    firstSlug.includes("aftersales") ||
    fullPath.includes("aftersales") ||
    lastSlug === "aftersales-rma";

  const isFAQIndexPage =
    (firstSlug === "faq" && slugParts.length === 1) ||
    (lastSlug === "faq" && slugParts.length <= 2);

  const isAboutPage =
    lastSlug === "tentang-penulis" ||
    lastSlug === "about" ||
    firstSlug === "about";

  const isSupportPage =
    lastSlug === "donasi-penulis" ||
    lastSlug === "support" ||
    firstSlug === "support";

  const isConsultationPage =
    lastSlug === "konsultasi-joel-gray" ||
    lastSlug === "consultation" ||
    firstSlug === "consultation";

  const isBrandsAvoidPage =
    lastSlug === "odm-layak-dibeli" ||
    lastSlug === "brands-to-avoid" ||
    (firstSlug === "brand" && slugParts.includes("odm"));

  const pageTitle = isDeskPage
    ? "REKOMENDASI MEJA + KAKI (GRAYPLASMA)"
    : isArmBracketPage
    ? "DATABASE REKOMENDASI MONITOR ARM & BRACKET"
    : isAccessoriesPage
    ? "DATABASE REKOMENDASI AKSESORIS SETUP"
    : isChairsPage
    ? "DATABASE REKOMENDASI KURSI ERGONOMIS & GAMING [DRAFT]"
    : isCatalogPage
    ? lastSlug === "1080p"
      ? "REKOMENDASI MONITOR 1080P (FHD BUDGET & ESPORT)"
      : lastSlug === "1440p"
      ? "REKOMENDASI MONITOR 1440P (2K SWEETSPOT)"
      : lastSlug === "oled"
      ? "REKOMENDASI MONITOR OLED & FLAGSHIP TIER"
      : lastSlug === "4k"
      ? "REKOMENDASI MONITOR 4K UHD & CREATOR SPECIAL"
      : "KATALOG & DATABASE REKOMENDASI MONITOR"
    : isAftersalesPage
    ? "LIST AFTERSALES (BRAND MONITOR OEM)"
    : isFAQIndexPage
    ? "QNA & GRAYNOTES (PERTANYAAN SERING DIAJUKAN)"
    : isAboutPage
    ? "TENTANG WEBSITE & PENULIS (GRAYPLASMA)"
    : isSupportPage
    ? "SUPPORT & DONASI PENULIS"
    : isConsultationPage
    ? "KONSULTASI JOEL GRAY (@GRAY1PLASMA)"
    : matchedMonitor
    ? `${matchedMonitor.fullName}`
    : matchedNode?.title || `Panduan: ${slugParts.join(" / ")}`;

  const handleCopyDiscord = () => {
    const text = typeof window !== "undefined" ? `[GRAYPLASMA] ${pageTitle}\nLink: ${window.location.href}` : pageTitle;
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

  const handleSelectAftersalesCard = (card: NotionBoardCard) => {
    setSelectedAftersalesCard(card);
    setIsAftersalesPanelOpen(true);
  };

  const subpageBreadcrumbs: BreadcrumbItem[] = isDeskPage
    ? [
        { label: "KATALOG & DATABASE", href: "/", icon: <Layers className="w-3.5 h-3.5 text-orange-400" /> },
        { label: "REKOMENDASI MEJA + KAKI", icon: <FileText className="w-3.5 h-3.5 text-zinc-400" /> },
      ]
    : isArmBracketPage
    ? [
        { label: "KATALOG & DATABASE", href: "/", icon: <Wrench className="w-3.5 h-3.5 text-cyan-400" /> },
        { label: "ARM & BRACKET MONITOR", icon: <FileText className="w-3.5 h-3.5 text-zinc-400" /> },
      ]
    : isAccessoriesPage
    ? [
        { label: "KATALOG & DATABASE", href: "/", icon: <Sparkles className="w-3.5 h-3.5 text-blue-400" /> },
        { label: "AKSESORIS SETUP", icon: <FileText className="w-3.5 h-3.5 text-zinc-400" /> },
      ]
    : isChairsPage
    ? [
        { label: "KATALOG & DATABASE", href: "/", icon: <LayoutGrid className="w-3.5 h-3.5 text-purple-400" /> },
        { label: "KURSI ERGONOMIS", icon: <FileText className="w-3.5 h-3.5 text-zinc-400" /> },
      ]
    : isAftersalesPage
    ? [{ label: "AFTERSALES BRAND MONITOR", icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> }]
    : isCatalogPage
    ? [
        { label: "KATALOG MONITOR", href: "/", icon: <MonitorIcon className="w-3.5 h-3.5 text-emerald-400" /> },
        { label: pageTitle, icon: <FileText className="w-3.5 h-3.5 text-zinc-400" /> },
      ]
    : matchedMonitor
    ? [
        { label: "REKOMENDASI MONITOR", href: "/", icon: <MonitorIcon className="w-3.5 h-3.5 text-emerald-400" /> },
        { label: matchedMonitor.fullName, icon: <Search className="w-3.5 h-3.5 text-zinc-400" /> },
      ]
    : slugParts.length > 1
    ? [
        { label: slugParts[0].toUpperCase(), href: `/guide/${slugParts[0]}`, icon: <BookOpen className="w-3.5 h-3.5 text-zinc-400" /> },
        { label: matchedNode?.title || pageTitle, icon: <FileText className="w-3.5 h-3.5 text-zinc-400" /> },
      ]
    : [{ label: matchedNode?.title || pageTitle, icon: isFAQIndexPage ? <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> : <FileText className="w-3.5 h-3.5 text-zinc-400" /> }];

  return (
    <div className="min-h-screen bg-[#191919] text-[#d4d4d4] flex flex-col font-sans selection:bg-[#2383e2] selection:text-white">
      <AnnouncementBar settings={siteSettings?.announcement} />
      {/* Unified Clean Subpage Navbar */}
      <SubpageNavbar
        breadcrumbs={subpageBreadcrumbs}
        backLink={{
          href: "/",
          label: "Kembali ke Beranda",
        }}
        rightActions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyUrl}
              className="p-2 rounded-xl bg-[#202020] border border-[#2f2f2f] text-zinc-400 hover:text-white hover:bg-[#282828] transition-colors"
              title="Salin URL"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-[#52ba69]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        }
      />

      {/* Main Notion Page Container */}
      <main className="transition-all duration-300 px-4 sm:px-8 md:px-12 py-8 sm:py-12 flex-1 w-full space-y-8 max-w-6xl mx-auto">
        {/* Notion Hero Cover Banner */}
        <div className="relative w-full h-48 sm:h-60 rounded-3xl overflow-hidden border border-[#2f2f2f] bg-[#202020] mb-2 shadow-2xl">
          <Image
            src={
              matchedNode?.coverImage ||
              "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop"
            }
            alt="Page Hero Banner"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191919] via-transparent to-transparent" />
        </div>

        {/* Notion Page Icon & Header (Overlapping Cover) */}
        <div className="space-y-4 -mt-12 relative z-10 px-2 sm:px-4">
          <div className="p-3 rounded-2xl bg-[#121216] border border-zinc-800 w-fit shadow-2xl">
            {isFAQIndexPage ? (
              <HelpCircle className="w-8 h-8 text-amber-400" />
            ) : isAftersalesPage ? (
              <ShieldAlert className="w-8 h-8 text-amber-400" />
            ) : isAboutPage ? (
              <User className="w-8 h-8 text-zinc-300" />
            ) : isSupportPage ? (
              <Heart className="w-8 h-8 text-rose-400" />
            ) : isConsultationPage ? (
              <Headphones className="w-8 h-8 text-emerald-400" />
            ) : isDeskPage ? (
              <Layers className="w-8 h-8 text-orange-400" />
            ) : isArmBracketPage ? (
              <Wrench className="w-8 h-8 text-cyan-400" />
            ) : isAccessoriesPage ? (
              <Sparkles className="w-8 h-8 text-blue-400" />
            ) : isChairsPage ? (
              <span className="text-3xl leading-none">🪑</span>
            ) : (
              <MonitorIcon className="w-8 h-8 text-emerald-400" />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight uppercase">
            {pageTitle}
          </h1>

          {/* Subtitle / Catatan Section (Exact match to Notion) */}
          {isDeskPage ? (
            <div className="space-y-1 text-xs text-zinc-400 pt-1">
              <p className="font-medium text-zinc-300">
                Database kurasi rekomendasi daun meja, standing desk motorized, dan kaki meja kokoh anti getar & tahan jepit monitor arm.
              </p>
            </div>
          ) : isArmBracketPage ? (
            <div className="space-y-1 text-xs text-zinc-400 pt-1">
              <p className="font-medium text-zinc-300">
                Database rekomendasi gas spring monitor arm, bracket dinding/tiang, dan VESA mount adapter teruji tahan beban dan stabil.
              </p>
            </div>
          ) : isAccessoriesPage ? (
            <div className="space-y-1 text-xs text-zinc-400 pt-1">
              <p className="font-medium text-zinc-300">
                Database rekomendasi aksesoris setup: monitor lightbar / screenbar, kabel DP & HDMI bersertifikasi, dan manajemen kabel.
              </p>
            </div>
          ) : isChairsPage ? (
            <div className="space-y-1 text-xs text-zinc-400 pt-1">
              <p className="font-medium text-purple-300/90">
                Database kurasi kursi ergonomis dan gaming dengan struktur penopang lumbar teruji dan hidrolik Class 4 [Draft Database].
              </p>
            </div>
          ) : isCatalogPage ? (
            <div className="space-y-1 text-xs text-zinc-400 pt-1">
              <p className="font-medium text-zinc-300">
                Database kurasi rekomendasi monitor hasil pengujian, tes lab, dan riset panel GrayPlasma.
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-xs text-[#9b9a97] pt-2">
              <p className="font-semibold uppercase tracking-wider text-[#787774]">
                AKAN DILENGKAPI
              </p>
              <div className="space-y-1">
                <span className="font-bold text-[#d4d4d4] uppercase">CATATAN :</span>
                <ul className="list-disc pl-5 space-y-1 text-[#b4b4b4]">
                  <li>
                    PENULIS TIDAK BERTANGGUNG JAWAB JIKA BRAND ANDA TERSINGGUNG DENGAN TULISAN DIBAWAH
                  </li>
                  {matchedNode?.description && (
                    <li>{matchedNode.description}</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CHECK: UNPUBLISHED / ARCHIVED DRAFT PAGE NOTICE                           */}
        {/* ========================================================================= */}
        {matchedNode && matchedNode.isPublished === false ? (
          <div className="my-12 p-8 rounded-2xl bg-[#202025] border border-amber-500/40 text-center space-y-4 max-w-2xl mx-auto shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">
              [ // PANDUAN INI SEDANG DIARSIPKAN SEMENTARA ]
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-lg mx-auto">
              Halaman ulasan &ldquo;{matchedNode.title}&rdquo; saat ini dinonaktifkan oleh tim admin GrayPlasma untuk pembaruan data atau pengujian laboratorium berkala.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda Katalog</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
        {/* ========================================================================= */}
        {/* CASE 0: CATALOG RECOMMENDATION DATABASE TABLE WITH LEFT FILTERBAR         */}
        {/* ========================================================================= */}
        {isDeskPage ? (
          <div className="pt-2">
            <DeskPeripheralsView desks={desks} peripherals={peripherals} chairs={chairs} showChairs={false} hideHeaderCard={true} initialTab="meja" />
          </div>
        ) : isArmBracketPage ? (
          <div className="pt-2">
            <DeskPeripheralsView desks={desks} peripherals={peripherals} chairs={chairs} showChairs={false} hideHeaderCard={true} initialTab="arms" />
          </div>
        ) : isAccessoriesPage ? (
          <div className="pt-2">
            <DeskPeripheralsView desks={desks} peripherals={peripherals} chairs={chairs} showChairs={false} hideHeaderCard={true} initialTab="accessories" />
          </div>
        ) : isChairsPage ? (
          showChairs ? (
            <div className="pt-2">
              <DeskPeripheralsView desks={desks} peripherals={peripherals} chairs={chairs} showChairs={true} hideHeaderCard={true} initialTab="kursi" />
            </div>
          ) : (
            <div className="my-12 p-8 rounded-2xl bg-[#202025] border border-purple-500/40 text-center space-y-4 max-w-2xl mx-auto shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto text-2xl">
                🪑
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                [ // KATALOG KURSI MASIH BERSTATUS DRAFT / STAGING ]
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-lg mx-auto">
                Katalog rekomendasi kursi ergonomis saat ini masih dalam tahap kurasi dan pengujian internal tim GrayPlasma. Akses publik akan dibuka secara resmi setelah status draft dilepas di Admin Studio.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-bold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Beranda Katalog</span>
                </Link>
              </div>
            </div>
          )
        ) : isCatalogPage ? (
          <div className="space-y-4 pt-2 w-full">
            {/* Top Toolbar: Filter Trigger & Counter */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
                  activeFilterCount > 0
                    ? "bg-emerald-500/15 border-emerald-500/60 text-emerald-300 shadow-tech-subtle"
                    : "bg-[#12131a] border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
              </button>

              <span className="text-xs text-zinc-400 font-medium">
                {filteredCatalogMonitors.length} Model Ditemukan
              </span>
            </div>

            {/* Active Filter Chips */}
            <ActiveFilterPills
              filterState={filterState}
              onFilterChange={setFilterState}
              onResetFilters={() => setFilterState(INITIAL_FILTER_STATE)}
              onOpenFilter={() => setIsMobileFilterOpen(true)}
            />

            {/* Right Main Database Table - FULL 100% WIDTH */}
            <div className="w-full min-w-0">
              <NotionTableView
                monitors={filteredCatalogMonitors}
                selectedMonitorId={selectedMonitorForPanel?.id}
                onSelectMonitor={(m) => {
                  setSelectedMonitorForPanel(m);
                  setIsSidePanelOpen(true);
                }}
                onOpenFilter={() => setIsMobileFilterOpen(true)}
                activeFilterCount={activeFilterCount}
              />
            </div>

            {/* FilterBar as Modal */}
            <FilterBar
              filterState={filterState}
              onFilterChange={setFilterState}
              onResetFilters={() => setFilterState(INITIAL_FILTER_STATE)}
              isOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
              totalFilteredCount={filteredCatalogMonitors.length}
            />
          </div>
        ) : isAftersalesPage ? (
          <div className="pt-4">
            <NotionKanbanBoard
              columns={NOTION_AFTERSALES_COLUMNS}
              cards={aftersalesCards}
              selectedCardId={selectedAftersalesCard?.id}
              onSelectCard={handleSelectAftersalesCard}
            />
          </div>
        ) : isFAQIndexPage ? (
          /* ========================================================================= */
          /* CASE 2: FAQ NOTION COLLECTION LIST INDEX                                  */
          /* ========================================================================= */
          <div className="space-y-4 pt-2">
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
        ) : isBrandsAvoidPage ? (
          /* ========================================================================= */
          /* CASE 2.5: BRANDS TO AVOID / ODM MONITOR LIST                              */
          /* ========================================================================= */
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-[#202020] border border-[#2f2f2f] text-xs text-[#b4b4b4] leading-relaxed">
              <strong className="text-white block mb-1">Catatan Independen GrayPlasma:</strong>
              Daftar brand berikut memiliki catatan riwayat terkait firmware overdrive generik ODM, modul daya internal, atau waktu inden servis klaim garansi di Indonesia.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brandsAvoid.filter(b => b.isPublished !== false).map((brand, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#202020] border border-[#2f2f2f] space-y-3 shadow-sm">
                  <div className="flex items-center justify-between gap-2 border-b border-[#2a2a2a] pb-2">
                    <h3 className="font-bold text-white text-sm">{brand.brand}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {brand.category}
                    </span>
                  </div>
                  <div className="text-xs text-rose-300 bg-rose-950/20 p-2.5 rounded-xl border border-rose-500/30 font-medium">
                    ⚠️ {brand.issue}
                  </div>
                  <p className="text-xs text-[#d4d4d4] leading-relaxed">
                    <strong>Evaluasi Joel:</strong> {brand.authorNote}
                  </p>
                  {brand.details && brand.details.length > 0 && (
                    <ul className="space-y-1 text-xs text-[#9b9a97] list-disc pl-4 pt-1">
                      {brand.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : isAboutPage ? (
          /* ========================================================================= */
          /* CASE 3: ABOUT NOTION PAGE (DYNAMIC)                                       */
          /* ========================================================================= */
          <div className="p-6 sm:p-8 rounded-2xl bg-[#202020] border border-[#2f2f2f] space-y-6">
            <NotionBlockRenderer
              content={
                matchedNode?.contentMarkdown ||
                `# ${aboutContent?.title || "TENTANG GRAYPLASMAID & JOEL GRAY"}

> ${aboutContent?.subtitle || "Platform independen kurasi rekomendasi monitor & analisis data pengujian laboratorium GTID Tech."}

---

## Siapa di Balik GrayPlasma?
- **${aboutContent?.author || "Joel Gray (@gray1plasma)"}:** Penulis & Kurator Utama Rekomendasi Monitor. Meninjau unit berdasarkan ergonomi, build quality, dan kebutuhan nyata pengguna.
- **Tim GrayPlasma:** Pengembang Web & Database Engine.
- **GTID Tech:** Sumber data pengujian laboratorium independen (Akurasi deITP Calman, Response Time GTG, Motion Clarity).

---

## Latar Belakang Riset & Kurasi:
${aboutContent?.latarBelakang || "Dimulai dari 2024, inisiatif merangkum data pengetesan GTID agar mudah dipahami masyarakat luas."}

---

## Catatan Penulis:
${aboutContent?.biodataPenulis || "Terima kasih atas seluruh dukungan komunitas yang membuat panduan ini tetap independen!"}`
              }
            />
          </div>
        ) : isSupportPage ? (
          /* ========================================================================= */
          /* CASE 4: SUPPORT & DONASI PAGE (DYNAMIC)                                   */
          /* ========================================================================= */
          <div className="p-6 sm:p-8 rounded-2xl bg-[#202020] border border-[#2f2f2f] space-y-6">
            <NotionBlockRenderer
              content={
                matchedNode?.contentMarkdown ||
                `# SUPPORT & DONASI PENULIS

> Dukung kelangsungan riset independen, pengujian unit monitor baru, dan pengembangan website GrayPlasma.

---

## Cara Memberikan Dukungan:
1. **Saweria / Trakteer:** Dukung langsung melalui donasi sukarela untuk dana pengujian unit monitor baru.
2. **Follow Komunitas & Social Media:**
   - TikTok: [${siteSettings.consultation?.tiktok || "@gray1plasma"}](${siteSettings.consultation?.tiktokUrl || "https://www.tiktok.com/@gray1plasma"})
   - Discord: [${siteSettings.consultation?.discordUrl || "discord.gg/joingtid"}](${siteSettings.consultation?.discordUrl || "https://discord.gg/joingtid"})
   - YouTube: [GTiD Tech](${siteSettings.consultation?.youtubeUrl || "https://www.youtube.com/c/GTiDtech/videos"})

> Terima kasih atas seluruh dukungan komunitas yang membuat panduan ini tetap independen dan bebas sponsor!`
              }
            />
          </div>
        ) : isConsultationPage ? (
          /* ========================================================================= */
          /* CASE 5: KONSULTASI PAGE (DYNAMIC)                                         */
          /* ========================================================================= */
          <div className="p-6 sm:p-8 rounded-2xl bg-[#202020] border border-[#2f2f2f] space-y-6">
            <NotionBlockRenderer
              content={
                matchedNode?.contentMarkdown ||
                `# KONSULTASI PEMILIHAN MONITOR DENGAN ${siteSettings.consultation?.author || "JOEL GRAY (@GRAY1PLASMA)"}

> Dapatkan saran pemilihan monitor terbaik yang disesuaikan dengan spek GPU PC, ukuran meja, dan anggaran Anda.

---

## Kontak Resmi Konsultasi:
- **WhatsApp:** [${siteSettings.consultation?.whatsapp || "0851-7979-4019"}](${siteSettings.consultation?.whatsappUrl || "https://wa.me/6285179794019"}) (a.n Joel Gray)
- **Discord:** [${siteSettings.consultation?.discordUrl || "discord.gg/joingtid"}](${siteSettings.consultation?.discordUrl || "https://discord.gg/joingtid"}) (Respon Lebih Cepat)
- **TikTok:** [${siteSettings.consultation?.tiktok || "@gray1plasma"}](${siteSettings.consultation?.tiktokUrl || "https://www.tiktok.com/@gray1plasma"})

---

## Informasi yang Perlu Disiapkan Sebelum Konsultasi:
1. Spesifikasi PC / Laptop (Model GPU & CPU).
2. Kedalaman meja kerja (50cm, 60cm, atau 80cm).
3. Kebutuhan utama (Game FPS kompetitif, Editing video, atau Browsing santai).
4. Anggaran maksimal.

---

## Catatan Penting:
${siteSettings.consultation?.disclaimer || "Seluruh konsultasi disesuaikan dengan kebutuhan pribadi dan spesifikasi perangkat Anda."}`
              }
            />
          </div>
        ) : matchedMonitor ? (
          /* ========================================================================= */
          /* CASE 6: MONITOR DETAIL / DEEP DIVE                                        */
          /* ========================================================================= */
          <div className="space-y-6 pt-2">
            <div className="p-6 rounded-2xl bg-[#202020] border border-[#2f2f2f] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#52ba69] bg-[#203c2b] px-2.5 py-0.5 rounded">
                  {matchedMonitor.tier}
                </span>
                <span className="text-lg font-bold text-white font-mono">
                  {formatRupiah(matchedMonitor.price)}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white">
                {matchedMonitor.deepDiveTitle || "Ulasan & Analisis GTID"}
              </h2>

              <p className="text-xs text-[#d4d4d4] leading-relaxed">
                {matchedMonitor.deepDiveDescription || matchedMonitor.expertVerdict}
              </p>

              <div className="pt-4 border-t border-[#2f2f2f] flex justify-end">
                <button
                  onClick={() => setSelectedMonitorForPanel(matchedMonitor)}
                  className="px-4 py-2 rounded-lg bg-[#2383e2] hover:bg-[#1f75c8] text-white text-xs font-bold transition-colors"
                >
                  Buka di Side Panel Notion →
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CASE 7: GENERAL NOTION ARTICLE & FAQ ITEM                                 */
          /* ========================================================================= */
          <article className="space-y-6 pt-2">
            {matchedNode?.contentMarkdown ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#202020] border border-[#2f2f2f] shadow-sm">
                <NotionBlockRenderer content={matchedNode.contentMarkdown} />
              </div>
            ) : (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#202020] border border-[#2f2f2f]">
                <h2 className="text-xl font-bold text-white mb-2">
                  {matchedNode?.title || "Informasi Panduan"}
                </h2>
                <p className="text-xs text-[#9b9a97] leading-relaxed">
                  {matchedNode?.description || "Panduan teknis dan ulasan independen GrayPlasma x GTID Tech."}
                </p>
              </div>
            )}

            {/* Quick Discord Callback Preview Box */}
            <div className="p-4 rounded-xl bg-[#202020] border border-[#2f2f2f] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#9b9a97]">
                <MessageSquare className="w-4 h-4 text-[#58a6ff]" />
                <span>Format callback Discord untuk panduan ini siap disalin:</span>
              </div>
              <button
                onClick={handleCopyDiscord}
                className="px-3 py-1.5 rounded bg-[#252525] border border-[#333333] hover:bg-[#2c2c2c] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                {copiedDiscord ? <Check className="w-3.5 h-3.5 text-[#52ba69]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDiscord ? "Tersalin!" : "Salin Callback Discord"}</span>
              </button>
            </div>
          </article>
        )}
        </>
        )}
      </main>

      {/* Notion Side Panel for Monitors */}
      <MonitorSidePanel
        monitor={selectedMonitorForPanel}
        isOpen={Boolean(selectedMonitorForPanel)}
        onClose={() => setSelectedMonitorForPanel(null)}
      />

      {/* Notion Aftersales Side-Peek Drawer */}
      <NotionAftersalesSidePanel
        card={selectedAftersalesCard}
        isOpen={isAftersalesPanelOpen}
        onClose={() => setIsAftersalesPanelOpen(false)}
      />

      <Footer />
    </div>
  );
}
