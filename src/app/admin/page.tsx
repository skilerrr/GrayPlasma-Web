"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tv,
  LayoutGrid,
  ShieldAlert,
  Wrench,
  Database,
  Plus,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Search,
  ExternalLink,
  ArrowLeft,
  Lock,
  Unlock,
  Upload,
  Image as ImageIcon,
  Check,
  Flame,
  AlertTriangle,
  Layers,
  Users,
  Shield,
  Megaphone,
  BookOpen,
  Server,
  FileJson,
  Fingerprint,
  ChevronRight,
  Menu,
  X,
  Eye,
  Award,
  SlidersHorizontal,
} from "lucide-react";
import { Monitor } from "@/types/monitor";
import { DeskItem, PeripheralItem, ChairItem } from "@/data/grayplasma-desk-peripherals";
import { AftersalesBrand } from "@/data/grayplasma-content";
import { SiteHierarchyNode } from "@/types/site-hierarchy";
import {
  DatabaseService,
  PageBannerSettings,
  GlobalSiteSettings,
  HomepageSettings,
  AdminUser,
  DEFAULT_BANNER_SETTINGS,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_HOMEPAGE_SETTINGS,
  DEFAULT_ADMIN_USERS,
} from "@/lib/db-service";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured, signInAdminWithSupabase, signOutAdminFromSupabase, getCurrentSupabaseAdmin, supabase } from "@/lib/supabase";
import { compressImage, formatFileSize, CompressedImageResult } from "@/lib/image-compressor";
import { MonitorFormModal } from "@/components/admin/monitor-form-modal";
import { MonitorLiveStudio } from "@/components/admin/monitor-live-studio";
import { DeskFormModal } from "@/components/admin/desk-form-modal";
import { DeskLiveStudio } from "@/components/admin/desk-live-studio";
import { ArmBracketStudio } from "@/components/admin/arm-bracket-studio";
import { ChairLiveStudio } from "@/components/admin/chair-live-studio";
import { AftersalesFormModal } from "@/components/admin/aftersales-form-modal";
import { HierarchySandboxManager } from "@/components/admin/hierarchy-sandbox-manager";
import { AdminHierarchyManager } from "@/components/admin/admin-hierarchy-manager";
import { SiteElementsManager } from "@/components/admin/site-elements-manager";
import { AdBannerManager } from "@/components/admin/ad-banner-manager";
import { GuidesKnowledgeManager } from "@/components/admin/guides-knowledge-manager";
import { AdminAftersalesKanbanManager } from "@/components/admin/admin-aftersales-kanban-manager";
import { BackupMigrationManager } from "@/components/admin/backup-migration-manager";
import { MonitorSidePanel } from "@/components/monitor-side-panel";
import { Button } from "@/components/ui/button";
import { GPLogo } from "@/components/gp-logo";
import { formatRupiah } from "@/lib/utils";

type AdminActiveTab =
  | "hierarchy"
  | "elements"
  | "banners"
  | "monitors"
  | "desks"
  | "peripherals"
  | "chairs"
  | "aftersales"
  | "knowledge"
  | "admins"
  | "backup"
  | "compressor";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication state (Multi-Account)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  // Data states
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [desks, setDesks] = useState<DeskItem[]>([]);
  const [peripherals, setPeripherals] = useState<PeripheralItem[]>([]);
  const [chairs, setChairs] = useState<ChairItem[]>([]);
  const [aftersales, setAftersales] = useState<AftersalesBrand[]>([]);
  const [hierarchyNodes, setHierarchyNodes] = useState<SiteHierarchyNode[]>([]);
  const [bannerSettings, setBannerSettings] = useState<PageBannerSettings>(DEFAULT_BANNER_SETTINGS);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [siteSettings, setSiteSettings] = useState<GlobalSiteSettings>(DEFAULT_SITE_SETTINGS);
  const [admins, setAdmins] = useState<AdminUser[]>(DEFAULT_ADMIN_USERS);
  const [isLoading, setIsLoading] = useState(true);

  // Active Tab & Navigation
  const [activeTab, setActiveTab] = useState<AdminActiveTab>("hierarchy");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);
  const [isMonitorModalOpen, setIsMonitorModalOpen] = useState(false);
  const [testSidePanelMonitor, setTestSidePanelMonitor] = useState<Monitor | null>(null);

  const [selectedDesk, setSelectedDesk] = useState<DeskItem | null>(null);
  const [isDeskModalOpen, setIsDeskModalOpen] = useState(false);

  const [selectedAftersales, setSelectedAftersales] = useState<AftersalesBrand | null>(null);
  const [isAftersalesModalOpen, setIsAftersalesModalOpen] = useState(false);

  // Sync notification
  const [syncMessage, setSyncMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Standalone compressor tool state
  const [toolImageStats, setToolImageStats] = useState<CompressedImageResult | null>(null);
  const [toolIsCompressing, setToolIsCompressing] = useState(false);

  useEffect(() => {
    let alive = true;

    const bootstrap = async () => {
      // P0 FIX: sesi diverifikasi ke Supabase, bukan dari sessionStorage lokal.
      if (!isSupabaseConfigured) {
        if (alive) router.replace("/admin/login");
        return;
      }

      const profile = await getCurrentSupabaseAdmin();
      if (!alive) return;

      if (!profile || !profile.is_active) {
        router.replace("/admin/login");
        return;
      }

      const adminUser: AdminUser = {
        id: profile.id,
        name: profile.name,
        username: profile.username || profile.email.split("@")[0],
        role: profile.role,
        roleTitle: profile.role_title || "Administrator",
        avatar: profile.avatar || "/gp-logo.png",
        pinCode: "",
        email: profile.email,
        bio: profile.bio,
        permissions: profile.permissions || ["*"],
        createdAt: profile.created_at?.substring(0, 10) || "2026-01-01",
        lastLogin: new Date().toISOString().substring(0, 10),
      };

      DatabaseService.setCurrentAdminSession(adminUser);
      setCurrentAdmin(adminUser);
      setIsAuthenticated(true);
      await loadAllData();
    };

    bootstrap();

    // Sinkronkan cookie middleware tiap Supabase refresh token.
    const subscription = supabase?.auth.onAuthStateChange(async (event, session) => {
      if (event === "TOKEN_REFRESHED" && session?.access_token) {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: session.access_token }),
        });
      }
      if (event === "SIGNED_OUT") {
        router.replace("/admin/login");
      }
    });

    return () => {
      alive = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, [router]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [mList, dList, pList, aList, hList, bSettings, sSettings, cList, hpSettings] = await Promise.all([
        DatabaseService.getMonitors(),
        DatabaseService.getDesks(),
        DatabaseService.getPeripherals(),
        DatabaseService.getAftersales(),
        DatabaseService.getHierarchyNodes(),
        DatabaseService.getBannerSettings(),
        DatabaseService.getSiteSettings(),
        DatabaseService.getChairsAsync(),
        DatabaseService.getHomepageSettings(),
      ]);
      setMonitors(mList);
      setDesks(dList);
      setPeripherals(pList);
      setAftersales(aList);
      setHierarchyNodes(hList);
      setBannerSettings(bSettings);
      setSiteSettings(sSettings);
      setChairs(cList);
      if (hpSettings) setHomepageSettings(hpSettings);
      setAdmins(DatabaseService.getAdminUsers());
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutAdminFromSupabase();
    // Hapus cookie sesi middleware juga, bukan cuma state lokal.
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
    } catch {
      /* diabaikan */
    }
    setIsAuthenticated(false);
    DatabaseService.setCurrentAdminSession(null);
    setCurrentAdmin(null);
    router.replace("/admin/login");
  };

  // Monitor Actions
  const handleSaveMonitor = async (item: Monitor) => {
    const updated = await DatabaseService.saveMonitor(item);
    setMonitors(updated);
    showNotice(`Monitor "${item.fullName}" berhasil disimpan.`);
  };

  const handleDeleteMonitor = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus monitor "${name}"?`)) {
      const updated = await DatabaseService.deleteMonitor(id);
      setMonitors(updated);
      showNotice(`Monitor "${name}" telah dihapus.`);
    }
  };

  // Desk Actions
  const handleSaveDesk = async (item: DeskItem) => {
    const updated = await DatabaseService.saveDesk(item);
    setDesks(updated);
    showNotice(`Data meja "${item.name}" berhasil disimpan.`);
  };

  const handleDeleteDesk = async (id: string, name: string) => {
    if (confirm(`Hapus data meja "${name}"?`)) {
      const updated = await DatabaseService.deleteDesk(id);
      setDesks(updated);
      showNotice(`Data meja "${name}" telah dihapus.`);
    }
  };

  // Peripheral Actions
  const handleSavePeripheral = async (item: PeripheralItem) => {
    const updated = await DatabaseService.savePeripheral(item);
    setPeripherals(updated);
    showNotice(`Data aksesoris "${item.name}" berhasil disimpan.`);
  };

  const handleDeletePeripheral = async (id: string, name: string) => {
    if (confirm(`Hapus aksesoris "${name}"?`)) {
      const updated = await DatabaseService.deletePeripheral(id);
      setPeripherals(updated);
      showNotice(`Data aksesoris "${name}" telah dihapus.`);
    }
  };

  // Aftersales Actions
  const handleSaveAftersales = async (item: AftersalesBrand) => {
    const updated = await DatabaseService.saveAftersales(item);
    setAftersales(updated);
    showNotice(`Data aftersales "${item.brand}" berhasil disimpan.`);
  };

  const handleDeleteAftersales = async (brandName: string) => {
    if (confirm(`Hapus data aftersales brand "${brandName}"?`)) {
      const updated = await DatabaseService.deleteAftersales(brandName);
      setAftersales(updated);
      showNotice(`Data aftersales "${brandName}" telah dihapus.`);
    }
  };

  const handleSidebarAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentAdmin) return;
    try {
      const res = await compressImage(file, 400, 0.85);
      const updatedUser: AdminUser = { ...currentAdmin, avatar: res.dataUrl };
      const updatedList = DatabaseService.saveAdminUser(updatedUser);
      setAdmins(updatedList);
      setCurrentAdmin(updatedUser);
      DatabaseService.setCurrentAdminSession(updatedUser);
      showNotice("Foto profil berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah foto profil.");
    }
  };

  const showNotice = (text: string) => {
    setSyncMessage({ text });
    setTimeout(() => setSyncMessage(null), 3500);
  };

  // Standalone compressor test
  const handleToolImageCompress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setToolIsCompressing(true);
    try {
      const res = await compressImage(file, 1200, 0.8);
      setToolImageStats(res);
    } catch (err) {
      console.error(err);
    } finally {
      setToolIsCompressing(false);
    }
  };

  // Middleware + pengecekan sesi Supabase yang jadi gerbang; ini cuma tampilan sementara.
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center gap-3 font-mono text-xs text-zinc-400">
        <div className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-center text-emerald-400">
          <Lock className="w-4 h-4" />
        </div>
        <p className="uppercase tracking-wider">Memeriksa sesi admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-white flex font-sans">
      {/* 1. LEFT NOTION-STYLE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#09090b] border-r border-zinc-800/90 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
          {/* Workspace Brand Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <GPLogo className="w-7 h-7 flex-shrink-0" />
              <div>
                <span className="font-black text-xs uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors block">
                  GP<span className="text-emerald-400">ADMIN</span>
                </span>
                <span className="text-[9px] text-zinc-400 block -mt-0.5">Admin Panel</span>
              </div>
            </Link>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Logged In Admin Profile Card */}
          {currentAdmin && (
            <div className="p-3 mx-3 my-2 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-2.5 group">
              <div className="relative cursor-pointer flex-shrink-0">
                <img
                  src={currentAdmin.avatar}
                  alt={currentAdmin.name}
                  className="w-9 h-9 rounded-lg object-cover border border-amber-500/40 group-hover:border-amber-400 transition-colors"
                />
                <label
                  title="Ganti Foto Profil Anda"
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSidebarAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="overflow-hidden flex-1">
                <span className="text-xs font-bold text-white block truncate">
                  {currentAdmin.name}
                </span>
                <span className="text-[10px] text-amber-400 block truncate font-medium">
                  {currentAdmin.roleTitle}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Sections */}
          <div className="px-3 py-2 space-y-4 text-xs">
            {/* Section 1: HIERARCHY & ROUTING */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-zinc-500 px-2 uppercase tracking-widest">
                Workspace & Hierarki
              </span>
              <button
                onClick={() => {
                  setActiveTab("hierarchy");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors ${
                  activeTab === "hierarchy"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className={`w-4 h-4 ${activeTab === "hierarchy" ? "text-white" : "text-zinc-400"}`} />
                  <span>Hierarki & Rute</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{hierarchyNodes.length}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("elements");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors ${
                  activeTab === "elements"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Megaphone className={`w-4 h-4 ${activeTab === "elements" ? "text-white" : "text-zinc-400"}`} />
                  <span>Elemen Beranda & Banners</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Live
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("banners");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors ${
                  activeTab === "banners"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className={`w-4 h-4 ${activeTab === "banners" ? "text-emerald-400" : "text-zinc-400"}`} />
                  <span>Ad Banners Slider</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">5s</span>
              </button>
            </div>

            {/* Section 2: DATABASES */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-zinc-500 px-2 uppercase tracking-widest">
                Databases (Katalog)
              </span>
              <button
                onClick={() => {
                  setActiveTab("monitors");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors ${
                  activeTab === "monitors"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tv className={`w-4 h-4 ${activeTab === "monitors" ? "text-emerald-400" : "text-zinc-400"}`} />
                  <span>Monitor Live Studio</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{monitors.length}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("desks");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors ${
                  activeTab === "desks"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid className={`w-4 h-4 ${activeTab === "desks" ? "text-orange-400" : "text-zinc-400"}`} />
                  <span>Katalog Meja</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{desks.length}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("peripherals");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors ${
                  activeTab === "peripherals"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Wrench className={`w-4 h-4 ${activeTab === "peripherals" ? "text-cyan-400" : "text-zinc-400"}`} />
                  <span>Arm & Bracket Studio</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{peripherals.length}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("chairs");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors ${
                  activeTab === "chairs"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm leading-none">🪑</span>
                  <span>Kursi Ergonomis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      homepageSettings.sectionVisibility?.showChairs
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {homepageSettings.sectionVisibility?.showChairs ? "Live" : "Draft"}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">{chairs.length}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("aftersales");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors ${
                  activeTab === "aftersales"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className={`w-4 h-4 ${activeTab === "aftersales" ? "text-amber-400" : "text-zinc-400"}`} />
                  <span>Aftersales & Kanban</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{aftersales.length}</span>
              </button>
            </div>

            {/* Section 3: KNOWLEDGE & GUIDES */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-zinc-500 px-2 uppercase tracking-widest">
                Knowledge & Edukasi
              </span>
              <button
                onClick={() => {
                  setActiveTab("knowledge");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors ${
                  activeTab === "knowledge"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className={`w-4 h-4 ${activeTab === "knowledge" ? "text-white" : "text-zinc-400"}`} />
                  <span>Knowledge Hub & FAQ</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">7 Submodul</span>
              </button>
            </div>

            {/* Section 4: TEAM & SECURITY */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-zinc-500 px-2 uppercase tracking-widest">
                Security & Team
              </span>
              <button
                onClick={() => {
                  setActiveTab("admins");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors ${
                  activeTab === "admins"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${activeTab === "admins" ? "text-white" : "text-zinc-400"}`} />
                  <span>Hierarki Admin (RBAC)</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{admins.length}</span>
              </button>
            </div>

            {/* Section 5: SYSTEM & CLOUD */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-zinc-500 px-2 uppercase tracking-widest">
                Cloud & Utility
              </span>
              <button
                onClick={() => {
                  setActiveTab("backup");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors ${
                  activeTab === "backup"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Server className={`w-4 h-4 ${activeTab === "backup" ? "text-white" : "text-zinc-400"}`} />
                  <span>Backup & Supabase Sync</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">JSON</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("compressor");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors ${
                  activeTab === "compressor"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${activeTab === "compressor" ? "text-white" : "text-zinc-400"}`} />
                  <span>WebP Optimizer Lab</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer Actions */}
        <div className="p-3 border-t border-zinc-800 flex items-center justify-between gap-2">
          <Link href="/" className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Lihat Web</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs text-rose-400 border-rose-500/30"
          >
            <Lock className="w-3.5 h-3.5 mr-1" />
            <span>Keluar</span>
          </Button>
        </div>
      </aside>

      {/* 2. RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-40 bg-[#070709]/90 backdrop-blur-xl border-b border-zinc-800 px-4 sm:px-8 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 lg:hidden"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500 hidden sm:inline">Workspace</span>
                <ChevronRight className="w-3 h-3 text-zinc-600 hidden sm:inline" />
                <span className="text-white font-bold capitalize">
                  {activeTab === "hierarchy" && "Hierarki Rute & Sandbox"}
                  {activeTab === "elements" && "Visual Elements & Banners"}
                  {activeTab === "monitors" && "Monitor Live Studio Database"}
                  {activeTab === "desks" && "Katalog Meja & Ergonomi"}
                  {activeTab === "peripherals" && "Arm & Bracket Studio"}
                  {activeTab === "aftersales" && "Evaluasi Aftersales Brand"}
                  {activeTab === "knowledge" && "Knowledge Hub & FAQ"}
                  {activeTab === "admins" && "Hierarki Admin (RBAC)"}
                  {activeTab === "backup" && "Backup JSON & Supabase"}
                  {activeTab === "compressor" && "WebP Optimizer Lab"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Supabase Status Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px]">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSupabaseConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                  }`}
                />
                <span className="text-zinc-300">
                  {isSupabaseConfigured ? "Supabase Cloud Live" : "Local Persistent DB"}
                </span>
              </div>

              <Link href="/">
                <Button variant="outline" size="sm" className="text-xs font-semibold hidden sm:flex">
                  <Eye className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                  <span>Preview Live Web</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Notification Toast */}
        {syncMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-5 ${
              syncMessage.isError
                ? "bg-rose-950/90 border-rose-500 text-rose-200"
                : "bg-emerald-950/90 border-emerald-500 text-emerald-200"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{syncMessage.text}</span>
          </div>
        )}

        {/* Main Content Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full space-y-6">
          {/* Top Analytics Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase font-bold">Total Monitor</span>
              <div className="text-2xl font-black text-white">{monitors.length} Model</div>
              <span className="text-[10px] text-emerald-400">
                {monitors.filter((m) => m.tier === "S-TIER").length} S-Tier • {monitors.filter((m) => m.tier === "BEST VALUE").length} Best Value
              </span>
            </div>

            <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase font-bold">Meja, Arm & Bracket</span>
              <div className="text-2xl font-black text-cyan-400">{desks.length + peripherals.length + chairs.length} Item</div>
              <span className="text-[10px] text-zinc-400">
                {desks.length} Meja • {peripherals.filter(p => (p.category || "").toLowerCase().includes("arm") || (p.name || "").toLowerCase().includes("arm")).length} Arm • {peripherals.filter(p => (p.category || "").toLowerCase().includes("bracket") || (p.name || "").toLowerCase().includes("bracket")).length} Bracket • {chairs.length} Kursi
              </span>
            </div>

            <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase font-bold">Hierarki Rute</span>
              <div className="text-2xl font-black text-amber-400">{hierarchyNodes.length} Subpage</div>
              <span className="text-[10px] text-zinc-400">Panduan SDR, HDR, Desk, ODM</span>
            </div>

            <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase font-bold">Tim Admin & RBAC</span>
              <div className="text-2xl font-black text-violet-400">{admins.length} Anggota</div>
              <span className="text-[10px] text-zinc-400">Super Admin, Reviewer, Editor</span>
            </div>
          </div>

          {/* TAB CONTENTS */}

          {/* 1. HIERARCHY SANDBOX */}
          {activeTab === "hierarchy" && (
            <HierarchySandboxManager
              nodes={hierarchyNodes}
              onUpdateNodes={(updated) => {
                setHierarchyNodes(updated);
                showNotice("Hierarki website & panduan berhasil diperbarui!");
              }}
              onTestTrigger={(node) => {
                if (node.onClickAction === "route") {
                  window.open(node.fullPath, "_blank");
                } else if (node.onClickAction === "side-panel") {
                  setTestSidePanelMonitor(monitors[0] || null);
                  showNotice(`⚡ Triggered Side-Panel Preview untuk ${node.title}`);
                } else if (node.onClickAction === "modal") {
                  setSelectedMonitor(monitors[0] || null);
                  setIsMonitorModalOpen(true);
                  showNotice(`⚡ Triggered Modal Preview untuk ${node.title}`);
                } else if (node.onClickAction === "external" && node.externalUrl) {
                  window.open(node.externalUrl, "_blank");
                } else {
                  window.open(node.fullPath, "_blank");
                }
              }}
            />
          )}

          {/* 2. SITE ELEMENTS & BANNERS */}
          {activeTab === "elements" && (
            <SiteElementsManager
              siteSettings={siteSettings}
              bannerSettings={bannerSettings}
              onUpdateSiteSettings={(newSettings) => setSiteSettings(newSettings)}
              onUpdateBannerSettings={(newBanners) => setBannerSettings(newBanners)}
            />
          )}

          {/* 2B. AD BANNERS SLIDER MANAGER */}
          {activeTab === "banners" && (
            <AdBannerManager />
          )}

          {/* 3. MONITOR LIVE STUDIO */}
          {activeTab === "monitors" && (
            <MonitorLiveStudio
              monitors={monitors}
              onUpdateMonitors={(newMonitors) => {
                setMonitors(newMonitors);
                showNotice("Database monitor berhasil diperbarui.");
              }}
              onPreviewSidePanel={(mon) => setTestSidePanelMonitor(mon)}
            />
          )}

          {/* 4. DESKS LIVE STUDIO */}
          {activeTab === "desks" && (
            <DeskLiveStudio
              desks={desks}
              onUpdateDesks={(newDesks) => {
                setDesks(newDesks);
                showNotice("Database ulasan & rekomendasi meja berhasil diperbarui.");
              }}
            />
          )}

          {/* 5. ARM & BRACKET STUDIO */}
          {activeTab === "peripherals" && (
            <ArmBracketStudio
              peripherals={peripherals}
              onUpdatePeripherals={(updated) => setPeripherals(updated)}
            />
          )}

          {/* 5B. CHAIRS LIVE STUDIO (STAGING Q2 2027) */}
          {activeTab === "chairs" && (
            <ChairLiveStudio
              chairs={chairs}
              onUpdateChairs={(updated) => setChairs(updated)}
              homepageSettings={homepageSettings}
              onUpdateHomepageSettings={(newHp) => setHomepageSettings(newHp)}
            />
          )}

          {/* 6. AFTERSALES BRAND KANBAN STUDIO */}
          {activeTab === "aftersales" && (
            <AdminAftersalesKanbanManager onRefresh={loadAllData} />
          )}

          {/* 7. KNOWLEDGE HUB */}
          {activeTab === "knowledge" && <GuidesKnowledgeManager onRefresh={loadAllData} />}

          {/* 8. ADMIN HIERARCHY & RBAC */}
          {activeTab === "admins" && (
            <AdminHierarchyManager
              admins={admins}
              currentAdmin={currentAdmin}
              onUpdateAdmins={(newAdmins) => setAdmins(newAdmins)}
              onSwitchSession={(adm) => setCurrentAdmin(adm)}
            />
          )}

          {/* 9. BACKUP & SUPABASE SYNC */}
          {activeTab === "backup" && <BackupMigrationManager onRefreshAll={loadAllData} />}

          {/* 10. WEBP OPTIMIZER LAB */}
          {activeTab === "compressor" && (
            <div className="bg-surface-dark border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-zinc-800 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>WebP Client-Side Image Optimizer</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Uji Coba Kompresi Gambar & Penekanan Storage Usage
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                  Coba upload file foto resolusi tinggi (5MB - 10MB) dan lihat bagaimana kompresor otomatis meresize dimensi dan mengonversinya menjadi file WebP super ringan (&lt; 80KB) tanpa mengorbankan ketajaman gambar.
                </p>
              </div>

              <div className="max-w-xl mx-auto space-y-4 text-center">
                <label className="border-2 border-dashed border-zinc-700 hover:border-emerald-500 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-950/60 group">
                  <Upload className="w-10 h-10 text-zinc-500 group-hover:text-emerald-400 mb-2 transition-colors" />
                  <span className="text-sm font-bold text-white">Pilih File Foto untuk Uji Kompresi</span>
                  <span className="text-xs text-zinc-500 mt-1">Mendukung format PNG, JPG, JPEG, BMP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleToolImageCompress}
                    className="hidden"
                  />
                </label>

                {toolIsCompressing && (
                  <div className="text-xs text-emerald-400 font-bold animate-pulse">
                    Sedang melakukan resizing & konversi WebP...
                  </div>
                )}

                {toolImageStats && (
                  <div className="bg-zinc-950 border border-emerald-500/40 rounded-2xl p-5 text-left space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={toolImageStats.dataUrl}
                        alt="Output"
                        className="w-24 h-24 object-cover rounded-xl border border-zinc-800 flex-shrink-0"
                      />
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-white block">Hasil Optimasi WebP</span>
                        <div className="text-zinc-400">
                          Ukuran Asli: <span className="line-through text-rose-400">{formatFileSize(toolImageStats.originalSize)}</span>
                        </div>
                        <div className="text-emerald-400 font-bold text-sm">
                          Ukuran WebP: {formatFileSize(toolImageStats.compressedSize)} (-{toolImageStats.savedPercentage}%)
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          Dimensi baru: {toolImageStats.width} x {toolImageStats.height} px
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Dialogs */}
      <MonitorFormModal
        monitor={selectedMonitor}
        isOpen={isMonitorModalOpen}
        onClose={() => setIsMonitorModalOpen(false)}
        onSave={handleSaveMonitor}
      />

      <DeskFormModal
        type="desk"
        initialDesk={selectedDesk}
        isOpen={isDeskModalOpen}
        onClose={() => setIsDeskModalOpen(false)}
        onSaveDesk={handleSaveDesk}
        onSavePeripheral={handleSavePeripheral}
      />

      <AftersalesFormModal
        brand={selectedAftersales}
        isOpen={isAftersalesModalOpen}
        onClose={() => setIsAftersalesModalOpen(false)}
        onSave={handleSaveAftersales}
      />

      {/* Monitor Side Panel Test Preview */}
      <MonitorSidePanel
        monitor={testSidePanelMonitor}
        isOpen={Boolean(testSidePanelMonitor)}
        onClose={() => setTestSidePanelMonitor(null)}
      />
    </div>
  );
}
