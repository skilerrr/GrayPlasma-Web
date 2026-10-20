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
  ShieldCheck,
  Info,
  Menu,
  Home,
} from "lucide-react";
import { QuickFilterTab } from "@/types/monitor";
import { Button } from "@/components/ui/button";
import { GPLogo } from "@/components/gp-logo";
import { CONSULTATION_DATA } from "@/data/grayplasma-content";
import { NAV_MENU_GROUPS, isNavGroupActive } from "@/data/nav-menu";
import { DatabaseService, GlobalSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/db-service";
import { AnnouncementBar } from "@/components/announcement-bar";
import {
  NavDropdownPanel,
  NavDropdownSection,
  NavDropdownItem,
} from "@/components/nav-dropdown";

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
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({
    catalog: null,
    aftersales: null,
    more: null,
  });
  const [siteSettings, setSiteSettings] = useState<GlobalSiteSettings>(DEFAULT_SITE_SETTINGS);
  const [showChairs, setShowChairs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    if (mobileMenuOpen) setOpenDropdown(null);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleDocumentClick = () => setOpenDropdown(null);
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, []);

  // Escape menutup dropdown yang sedang terbuka.
  useEffect(() => {
    if (!openDropdown) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          return;
        }
        setOpenDropdown(null);
        triggerRefs.current[openDropdown]?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openDropdown, mobileMenuOpen]);

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
  // Active state diturunkan dari definisi menu yang sama, jadi desktop dan
  // mobile tidak bisa berbeda pendapat soal menu mana yang sedang aktif.
  const groupActive = (key: "catalog" | "aftersales" | "more") => {
    const group = NAV_MENU_GROUPS.find((g) => g.key === key);
    return group ? isNavGroupActive(group, currentKey) : false;
  };
  const isCatalogActive = groupActive("catalog");
  const isAftersalesActive = groupActive("aftersales");
  const isMoreActive = groupActive("more");

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
                  <span className="text-gp-orange font-mono">ID</span>
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentKey === "home"
                  ? "bg-gp-ink-700 text-white shadow-sm border border-gp-ink-600"
                  : "text-gp-ink-300 hover:text-gp-ink-100 hover:bg-gp-ink-800"
              }`}
            >
              Beranda
            </Link>

            {/* Menu 1: Rekomendasi Monitor & Meja */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                ref={(el) => { triggerRefs.current.catalog = el; }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "catalog"}
                aria-controls="menu-catalog"
                onClick={() => setOpenDropdown(openDropdown === "catalog" ? null : "catalog")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isCatalogActive
                    ? "bg-gp-ink-700 text-white shadow-sm border border-gp-ink-600"
                    : "text-gp-ink-300 hover:text-gp-ink-100 hover:bg-gp-ink-800"
                }`}
              >
                <Layers className="h-3.5 w-3.5 text-gp-mint-50" />
                <span>Rekomendasi</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === "catalog" ? "rotate-180" : ""}`} />
              </button>

              {openDropdown === "catalog" && (
              <NavDropdownPanel open align="left" id="menu-catalog">
                {NAV_MENU_GROUPS.filter((g) => g.key === "catalog").map((group) => (
                  <React.Fragment key={group.key}>
                    <NavDropdownSection title={group.section} />
                    {group.entries
                      .filter((entry) => !entry.draft || showChairs)
                      .map((entry) => (
                        <NavDropdownItem
                          key={entry.href}
                          href={entry.href}
                          icon={entry.icon}
                          tone={entry.tone}
                          title={entry.label}
                          description={entry.description}
                          badge={entry.href === "/catalog/all" ? String(totalMonitorsCount) : entry.badge}
                          badgeTone={entry.badgeTone}
                          onSelect={() => {
                            if (entry.href === "/catalog/all") onMenuSelect("catalog-all");
                            setOpenDropdown(null);
                          }}
                        />
                      ))}
                    {group.extraSection ? (
                      <>
                        <NavDropdownSection title={group.extraSection.title} divided />
                        {group.extraSection.entries.map((entry) => (
                          <NavDropdownItem
                            key={entry.href}
                            href={entry.href}
                            icon={entry.icon}
                            tone={entry.tone}
                            title={entry.label}
                            description={entry.description}
                            onSelect={() => setOpenDropdown(null)}
                          />
                        ))}
                      </>
                    ) : null}
                  </React.Fragment>
                ))}
              </NavDropdownPanel>
              )}
            </div>

            {/* Menu 2: Aftersales with Submenu */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                ref={(el) => { triggerRefs.current.aftersales = el; }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "aftersales"}
                aria-controls="menu-aftersales"
                onClick={() => setOpenDropdown(openDropdown === "aftersales" ? null : "aftersales")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isAftersalesActive
                    ? "bg-gp-ink-700 text-white shadow-sm border border-gp-ink-600"
                    : "text-gp-ink-300 hover:text-gp-ink-100 hover:bg-gp-ink-800"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5 text-gp-ember-50" />
                <span>Aftersales</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === "aftersales" ? "rotate-180" : ""}`} />
              </button>

              {openDropdown === "aftersales" && (
              <NavDropdownPanel open align="left" id="menu-aftersales">
                {NAV_MENU_GROUPS.filter((g) => g.key === "aftersales").map((group) => (
                  <React.Fragment key={group.key}>
                    <NavDropdownSection title={group.section} />
                    {group.entries
                      .filter((entry) => !entry.draft || showChairs)
                      .map((entry) => (
                        <NavDropdownItem
                          key={entry.href}
                          href={entry.href}
                          icon={entry.icon}
                          tone={entry.tone}
                          title={entry.label}
                          description={entry.description}
                          badge={entry.href === "/catalog/all" ? String(totalMonitorsCount) : entry.badge}
                          badgeTone={entry.badgeTone}
                          onSelect={() => {
                            if (entry.href === "/catalog/all") onMenuSelect("catalog-all");
                            setOpenDropdown(null);
                          }}
                        />
                      ))}
                    {group.extraSection ? (
                      <>
                        <NavDropdownSection title={group.extraSection.title} divided />
                        {group.extraSection.entries.map((entry) => (
                          <NavDropdownItem
                            key={entry.href}
                            href={entry.href}
                            icon={entry.icon}
                            tone={entry.tone}
                            title={entry.label}
                            description={entry.description}
                            onSelect={() => setOpenDropdown(null)}
                          />
                        ))}
                      </>
                    ) : null}
                  </React.Fragment>
                ))}
              </NavDropdownPanel>
              )}
            </div>

            {/* Menu 3: Panduan & Sub-pages */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                ref={(el) => { triggerRefs.current.more = el; }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "more"}
                aria-controls="menu-more"
                onClick={() => setOpenDropdown(openDropdown === "more" ? null : "more")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isMoreActive
                    ? "bg-gp-ink-700 text-white shadow-sm border border-gp-ink-600"
                    : "text-gp-ink-300 hover:text-gp-ink-100 hover:bg-gp-ink-800"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 text-gp-sky-50" />
                <span>Panduan & Info</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === "more" ? "rotate-180" : ""}`} />
              </button>

              {openDropdown === "more" && (
              <NavDropdownPanel open align="right" id="menu-more">
                {NAV_MENU_GROUPS.filter((g) => g.key === "more").map((group) => (
                  <React.Fragment key={group.key}>
                    <NavDropdownSection title={group.section} />
                    {group.entries
                      .filter((entry) => !entry.draft || showChairs)
                      .map((entry) => (
                        <NavDropdownItem
                          key={entry.href}
                          href={entry.href}
                          icon={entry.icon}
                          tone={entry.tone}
                          title={entry.label}
                          description={entry.description}
                          badge={entry.href === "/catalog/all" ? String(totalMonitorsCount) : entry.badge}
                          badgeTone={entry.badgeTone}
                          onSelect={() => {
                            if (entry.href === "/catalog/all") onMenuSelect("catalog-all");
                            setOpenDropdown(null);
                          }}
                        />
                      ))}
                    {group.extraSection ? (
                      <>
                        <NavDropdownSection title={group.extraSection.title} divided />
                        {group.extraSection.entries.map((entry) => (
                          <NavDropdownItem
                            key={entry.href}
                            href={entry.href}
                            icon={entry.icon}
                            tone={entry.tone}
                            title={entry.label}
                            description={entry.description}
                            onSelect={() => setOpenDropdown(null)}
                          />
                        ))}
                      </>
                    ) : null}
                  </React.Fragment>
                ))}
              </NavDropdownPanel>
              )}
            </div>
          </nav>

          {/* Instant Search Bar */}
          <div className="flex-1 min-w-0 max-w-xs sm:max-w-md mx-1 sm:mx-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gp-ink-400 group-focus-within:text-gp-mint-50 transition-colors">
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
              <SlidersHorizontal className="w-3.5 h-3.5 text-gp-mint-50" />
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-gp-mint-50 text-black font-bold text-3xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <a
              href={siteSettings.consultation?.whatsappUrl || CONSULTATION_DATA.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gp-orange/10 border border-gp-orange/30 hover:border-gp-orange text-xs font-semibold text-gp-orange hover:bg-gp-orange hover:text-gp-ink-950 active:translate-y-[1px] transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Tanya Joel</span>
            </a>
          </div>
        </div>

        {/* Mobile Menu — sheet full-screen yang isi-nya PERSIS sama dengan
            dropdown desktop (dari NAV_MENU_GROUPS), bukan daftar datar.
            Sebelumnya mobile cuma punya 9 link datar: katalog meja, aksesoris,
            arm & bracket, dan konsultasi nggak terjangkau dari HP. */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-sheet"
            className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold transition-colors ${
              mobileMenuOpen
                ? "bg-gp-ink-700 text-white"
                : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800"
            }`}
          >
            <Menu className="h-4 w-4 text-gp-mint-50" />
            <span>Menu</span>
            <span className="ml-auto text-3xs font-normal text-gp-ink-400">
              {mobileMenuOpen ? "Tutup" : "Semua halaman"}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-gp-ink-400 transition-transform ${
                mobileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {mobileMenuOpen && (
            <div
              id="mobile-menu-sheet"
              className="max-h-[70vh] overflow-y-auto overscroll-contain border-t border-gp-ink-800 bg-gp-ink-950 px-3 pb-4 pt-2"
            >
              <div className="mb-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors ${
                    currentKey === "home"
                      ? "bg-gp-ink-700 text-white"
                      : "text-gp-ink-200 hover:bg-gp-ink-800"
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gp-mint-50/10 text-gp-mint-50">
                    <Home className="h-4 w-4" />
                  </span>
                  Beranda
                </Link>
              </div>

              {NAV_MENU_GROUPS.map((group) => (
                <div key={group.key} className="mb-2">
                  <NavDropdownSection title={group.section} />
                  {group.entries
                    .filter((entry) => !entry.draft || showChairs)
                    .map((entry) => (
                      <NavDropdownItem
                        key={entry.href}
                        href={entry.href}
                        icon={entry.icon}
                        tone={entry.tone}
                        title={entry.label}
                        description={entry.description}
                        badge={
                          entry.href === "/catalog/all" ? String(totalMonitorsCount) : entry.badge
                        }
                        badgeTone={entry.badgeTone}
                        onSelect={() => {
                          if (entry.href === "/catalog/all") onMenuSelect("catalog-all");
                          setMobileMenuOpen(false);
                        }}
                      />
                    ))}
                  {group.extraSection ? (
                    <>
                      <NavDropdownSection title={group.extraSection.title} divided />
                      {group.extraSection.entries.map((entry) => (
                        <NavDropdownItem
                          key={entry.href}
                          href={entry.href}
                          icon={entry.icon}
                          tone={entry.tone}
                          title={entry.label}
                          description={entry.description}
                          onSelect={() => setMobileMenuOpen(false)}
                        />
                      ))}
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
