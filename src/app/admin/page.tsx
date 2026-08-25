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
} from "lucide-react";
import { Monitor } from "@/types/monitor";
import { DeskItem, PeripheralItem } from "@/data/grayplasma-desk-peripherals";
import { AftersalesBrand } from "@/data/grayplasma-content";
import { SiteHierarchyNode } from "@/types/site-hierarchy";
import { DatabaseService } from "@/lib/db-service";
import { isSupabaseConfigured } from "@/lib/supabase";
import { compressImage, formatFileSize, CompressedImageResult } from "@/lib/image-compressor";
import { MonitorFormModal } from "@/components/admin/monitor-form-modal";
import { MonitorLiveStudio } from "@/components/admin/monitor-live-studio";
import { DeskFormModal } from "@/components/admin/desk-form-modal";
import { AftersalesFormModal } from "@/components/admin/aftersales-form-modal";
import { HierarchySandboxManager } from "@/components/admin/hierarchy-sandbox-manager";
import { MonitorSidePanel } from "@/components/monitor-side-panel";
import { Button } from "@/components/ui/button";
import { GPLogo } from "@/components/gp-logo";
import { formatRupiah } from "@/lib/utils";

export default function AdminDashboardPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Data states
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [desks, setDesks] = useState<DeskItem[]>([]);
  const [peripherals, setPeripherals] = useState<PeripheralItem[]>([]);
  const [aftersales, setAftersales] = useState<AftersalesBrand[]>([]);
  const [hierarchyNodes, setHierarchyNodes] = useState<SiteHierarchyNode[]>([]);
  const [bannerSettings, setBannerSettings] = useState<any>({
    homeBannerUrl: "",
    homeBannerTitle: "Katalog & Database Rekomendasi Monitor",
    homeBannerSubtitle: "Kurasi monitor independen kolaborasi Joel Gray (@gray1plasma) x GlaciK dengan pengujian laboratorium GTID Tech.",
    guideBannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop",
    monitorBannerUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"hierarchy" | "banners" | "monitors" | "desks" | "peripherals" | "aftersales" | "supabase" | "compressor">("hierarchy");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);
  const [isMonitorModalOpen, setIsMonitorModalOpen] = useState(false);
  const [testSidePanelMonitor, setTestSidePanelMonitor] = useState<Monitor | null>(null);

  const [deskModalType, setDeskModalType] = useState<"desk" | "peripheral">("desk");
  const [selectedDesk, setSelectedDesk] = useState<DeskItem | null>(null);
  const [selectedPeripheral, setSelectedPeripheral] = useState<PeripheralItem | null>(null);
  const [isDeskModalOpen, setIsDeskModalOpen] = useState(false);

  const [selectedAftersales, setSelectedAftersales] = useState<AftersalesBrand | null>(null);
  const [isAftersalesModalOpen, setIsAftersalesModalOpen] = useState(false);

  // Sync notification
  const [syncMessage, setSyncMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Standalone compressor tool state
  const [toolImageStats, setToolImageStats] = useState<CompressedImageResult | null>(null);
  const [toolIsCompressing, setToolIsCompressing] = useState(false);

  useEffect(() => {
    // Check local session
    if (typeof window !== "undefined") {
      const savedAuth = sessionStorage.getItem("gp_admin_auth");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
    }
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [mList, dList, pList, aList, hList, bSettings] = await Promise.all([
        DatabaseService.getMonitors(),
        DatabaseService.getDesks(),
        DatabaseService.getPeripherals(),
        DatabaseService.getAftersales(),
        DatabaseService.getHierarchyNodes(),
        DatabaseService.getBannerSettings(),
      ]);
      setMonitors(mList);
      setDesks(dList);
      setPeripherals(pList);
      setAftersales(aList);
      setHierarchyNodes(hList);
      setBannerSettings(bSettings);
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "grayplasma2026" || pinInput.trim() === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("gp_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("PIN / Master Password salah. Coba: grayplasma2026");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("gp_admin_auth");
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

  const handleDuplicateMonitor = async (item: Monitor) => {
    const duplicate: Monitor = {
      ...item,
      id: `mon-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: `${item.fullName} (Copy)`,
      model: `${item.model} Copy`,
    };
    const updated = await DatabaseService.saveMonitor(duplicate);
    setMonitors(updated);
    showNotice(`Berhasil menduplikasi "${item.fullName}".`);
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

  // Supabase Push
  const handlePushToSupabase = async () => {
    setIsSyncing(true);
    const result = await DatabaseService.pushSeedToSupabase();
    setSyncMessage({ text: result.message, isError: !result.success });
    setIsSyncing(false);
  };

  const handleCopySQL = () => {
    const sql = DatabaseService.generateSQLMigration();
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleResetDefaults = () => {
    if (confirm("Kembalikan seluruh data monitor ke data bawaan asli Notion? (Semua perubahan lokal akan di-reset)")) {
      const reset = DatabaseService.resetMonitorsToDefault();
      setMonitors(reset);
      showNotice("Database monitor telah di-reset ke 55 model bawaan Notion.");
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

  // Filtered monitors list for admin search
  const filteredAdminMonitors = monitors.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return `${m.fullName} ${m.brand} ${m.tier} ${m.specs.display.panelType}`.toLowerCase().includes(q);
  });

  // If not authenticated, render login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
          <GPLogo className="w-14 h-14 mx-auto" />
          <div className="space-y-1">
            <h1 className="text-xl font-black uppercase tracking-tight text-white">
              GRAYPLASMA ADMIN PANEL
            </h1>
            <p className="text-xs text-zinc-400">
              Akses manajemen database monitor, meja, aftersales, dan Supabase.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">PIN / Password Admin</label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN (default: grayplasma2026)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
              {authError && <p className="text-[11px] text-rose-400 mt-1">{authError}</p>}
            </div>

            <Button type="submit" variant="cyber" className="w-full font-bold text-xs">
              <Unlock className="w-4 h-4 mr-1.5" />
              <span>Masuk Admin Panel</span>
            </Button>
          </form>

          <div className="pt-2 border-t border-zinc-900">
            <Link href="/" className="text-xs text-zinc-500 hover:text-emerald-400 flex items-center justify-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>Kembali ke Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-zinc-800/90 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <GPLogo className="w-8 h-8" />
              <span className="font-black text-sm uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                GP<span className="text-emerald-400">ADMIN</span>
              </span>
            </Link>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              CMS v2.0
            </span>

            {/* Supabase Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              <span className="text-zinc-300">
                {isSupabaseConfigured ? "Supabase Live Connected" : "Local Database Mode"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>Lihat Web</span>
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs text-rose-400 border-rose-500/30">
              <Lock className="w-3.5 h-3.5 mr-1" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {syncMessage && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-5 ${
          syncMessage.isError
            ? "bg-rose-950/90 border-rose-500 text-rose-200"
            : "bg-emerald-950/90 border-emerald-500 text-emerald-200"
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{syncMessage.text}</span>
        </div>
      )}

      {/* Main Admin Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full space-y-6">
        {/* Top Analytics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-zinc-400 uppercase font-bold">Total Monitor</span>
            <div className="text-2xl font-black text-white">{monitors.length} Model</div>
            <span className="text-[10px] text-emerald-400">
              {monitors.filter((m) => m.tier === "S-TIER").length} S-Tier • {monitors.filter((m) => m.tier === "BEST VALUE").length} Best Value
            </span>
          </div>

          <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-zinc-400 uppercase font-bold">Katalog Meja</span>
            <div className="text-2xl font-black text-cyan-400">{desks.length} Meja</div>
            <span className="text-[10px] text-zinc-400">Plywood Solid & Standing Desk</span>
          </div>

          <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-zinc-400 uppercase font-bold">Bracket & Peripherals</span>
            <div className="text-2xl font-black text-amber-400">{peripherals.length} Aksesoris</div>
            <span className="text-[10px] text-zinc-400">North Bayou F80/F100A, Screenbar</span>
          </div>

          <div className="bg-surface-dark border border-zinc-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-zinc-400 uppercase font-bold">Aftersales Evaluasi</span>
            <div className="text-2xl font-black text-violet-400">{aftersales.length} Brand</div>
            <span className="text-[10px] text-zinc-400">Dell, LG, Asus, Xiaomi, dll.</span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("hierarchy")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "hierarchy"
                ? "bg-zinc-800 text-cyan-400 border border-cyan-500/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Hierarki & Sandbox ({hierarchyNodes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("banners")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "banners"
                ? "bg-zinc-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Custom Banner Tiap Page</span>
          </button>
          <button
            onClick={() => setActiveTab("monitors")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "monitors"
                ? "bg-zinc-800 text-emerald-400 border border-emerald-500/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Database Monitor ({monitors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("desks")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "desks"
                ? "bg-zinc-800 text-cyan-400 border border-cyan-500/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Katalog Meja ({desks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("peripherals")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "peripherals"
                ? "bg-zinc-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Bracket Arm & Peripherals ({peripherals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("aftersales")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "aftersales"
                ? "bg-zinc-800 text-violet-400 border border-violet-500/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Aftersales Brand ({aftersales.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("supabase")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "supabase"
                ? "bg-zinc-800 text-emerald-400 border border-emerald-500/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase Hub & SQL Sync</span>
          </button>
          <button
            onClick={() => setActiveTab("compressor")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "compressor"
                ? "bg-zinc-800 text-rose-400 border border-rose-500/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>WebP Optimizer Lab</span>
          </button>
        </div>

        {/* 0. HIERARCHY & NOTION SANDBOX TAB */}
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
                const sampleMonitor = monitors[0] || null;
                setTestSidePanelMonitor(sampleMonitor);
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

        {/* 0.5 PAGE BANNERS CUSTOMIZATION TAB */}
        {activeTab === "banners" && (
          <div className="bg-surface-dark border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1 border-b border-zinc-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Page Banner Customizer</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Kustomisasi Banner & Header Tiap Halaman
              </h3>
              <p className="text-xs text-zinc-400 max-w-2xl">
                Ubah cover banner, judul, dan subjudul utama di Beranda, halaman Panduan (/guide/...), serta default header monitor.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await DatabaseService.saveBannerSettings(bannerSettings);
                showNotice("Pengaturan banner halaman berhasil disimpan!");
              }}
              className="space-y-5 text-xs max-w-3xl"
            >
              {/* Home Page Banner */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <h4 className="font-bold text-white uppercase text-xs text-amber-400">
                  1. Banner Halaman Beranda (Home Page)
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-zinc-400 block mb-1">Judul Utama Hero Banner</label>
                    <input
                      type="text"
                      value={bannerSettings.homeBannerTitle || ""}
                      onChange={(e) => setBannerSettings({ ...bannerSettings, homeBannerTitle: e.target.value })}
                      placeholder="Katalog & Database Rekomendasi Monitor"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Subjudul / Deskripsi Hero</label>
                    <textarea
                      rows={2}
                      value={bannerSettings.homeBannerSubtitle || ""}
                      onChange={(e) => setBannerSettings({ ...bannerSettings, homeBannerSubtitle: e.target.value })}
                      placeholder="Kurasi monitor independen..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Background Image URL (Opsional)</label>
                    <input
                      type="text"
                      value={bannerSettings.homeBannerUrl || ""}
                      onChange={(e) => setBannerSettings({ ...bannerSettings, homeBannerUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... (kosongkan jika ingin tema clean dark)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Guide Page Default Banner */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <h4 className="font-bold text-white uppercase text-xs text-cyan-400">
                  2. Default Banner Halaman Panduan (/guide/...)
                </h4>
                <div>
                  <label className="text-zinc-400 block mb-1">Default Cover Image URL untuk Panduan</label>
                  <input
                    type="text"
                    value={bannerSettings.guideBannerUrl || ""}
                    onChange={(e) => setBannerSettings({ ...bannerSettings, guideBannerUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>
              </div>

              {/* Monitor Page Default Banner */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <h4 className="font-bold text-white uppercase text-xs text-emerald-400">
                  3. Default Banner Halaman Monitor (/monitor/[slug])
                </h4>
                <div>
                  <label className="text-zinc-400 block mb-1">Background Banner URL untuk Halaman Monitor</label>
                  <input
                    type="text"
                    value={bannerSettings.monitorBannerUrl || ""}
                    onChange={(e) => setBannerSettings({ ...bannerSettings, monitorBannerUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... (opsional)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-400 text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const res = DatabaseService.resetBannerSettings();
                    setBannerSettings(res);
                    showNotice("Banner dikembalikan ke template default.");
                  }}
                  className="text-xs"
                >
                  Reset Default
                </Button>
                <Button
                  type="submit"
                  variant="cyber"
                  size="sm"
                  className="font-bold flex items-center gap-1.5 text-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Pengaturan Banner</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* 1. MONITORS CRUD & LIVE STUDIO TAB */}
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

        {/* 2. DESKS CRUD TAB */}
        {activeTab === "desks" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-surface-dark border border-zinc-800 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-bold text-white">Daftar Meja Rekomendasi</h3>
                <p className="text-xs text-zinc-400">Kelola katalog daun meja, standing desk, dan spesifikasi ketebalan.</p>
              </div>
              <Button
                variant="cyber"
                size="sm"
                onClick={() => {
                  setDeskModalType("desk");
                  setSelectedDesk(null);
                  setIsDeskModalOpen(true);
                }}
                className="text-xs font-bold"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Tambah Meja Baru</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {desks.map((d) => (
                <div key={d.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold uppercase">
                        {d.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">{d.name}</h4>
                      <div className="text-xs text-emerald-400 font-mono font-bold mt-0.5">
                        {formatRupiah(d.price)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setDeskModalType("desk");
                          setSelectedDesk(d);
                          setIsDeskModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-emerald-400"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDesk(d.id, d.name)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-300 space-y-1 bg-zinc-900/60 p-3 rounded-xl">
                    <div><strong>Material:</strong> {d.specs.material} (Tebal: {d.specs.thickness})</div>
                    <div><strong>Ukuran:</strong> {d.specs.dimensions}</div>
                    <div className="text-zinc-400">{d.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PERIPHERALS CRUD TAB */}
        {activeTab === "peripherals" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-surface-dark border border-zinc-800 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-bold text-white">Katalog Monitor Arm & Peripherals</h3>
                <p className="text-xs text-zinc-400">Kelola bracket gas spring (North Bayou/Oximus), screenbar, dan aksesoris.</p>
              </div>
              <Button
                variant="cyber"
                size="sm"
                onClick={() => {
                  setDeskModalType("peripheral");
                  setSelectedPeripheral(null);
                  setIsDeskModalOpen(true);
                }}
                className="text-xs font-bold"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Tambah Aksesoris</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {peripherals.map((p) => (
                <div key={p.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold uppercase">
                        {p.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">{p.name}</h4>
                      <div className="text-xs text-emerald-400 font-mono font-bold mt-0.5">
                        {formatRupiah(p.price)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setDeskModalType("peripheral");
                          setSelectedPeripheral(p);
                          setIsDeskModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-emerald-400"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePeripheral(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-xl">
                    {p.verdict}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. AFTERSALES CRUD TAB */}
        {activeTab === "aftersales" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-surface-dark border border-zinc-800 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-bold text-white">Evaluasi Aftersales Brand</h3>
                <p className="text-xs text-zinc-400">Kelola tier garansi dan catatan waktu tunggu RMA distributor.</p>
              </div>
              <Button
                variant="cyber"
                size="sm"
                onClick={() => {
                  setSelectedAftersales(null);
                  setIsAftersalesModalOpen(true);
                }}
                className="text-xs font-bold"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Tambah Aftersales Brand</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aftersales.map((b) => (
                <div key={b.brand} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-white">{b.brand}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500 text-black font-bold">
                          Tier {b.rating}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 mt-0.5 block">
                        {b.distributor} • {b.warrantyPeriod}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedAftersales(b);
                          setIsAftersalesModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-emerald-400"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAftersales(b.brand)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-xl">
                    {b.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SUPABASE & DATA SYNC HUB */}
        {activeTab === "supabase" && (
          <div className="space-y-6">
            <div className="bg-surface-dark border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-zinc-800 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Database className="w-3.5 h-3.5" />
                  <span>Supabase Integration Hub</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Status Database & Migrasi Cloud
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                  Situs ini dirancang dengan arsitektur tangguh (dual-mode). Saat ini seluruh data tersimpan secara lokal dan siap di-deploy ke Supabase dalam 1 klik.
                </p>
              </div>

              {/* Status Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <span className="text-[11px] text-zinc-400 uppercase font-bold">Koneksi Supabase</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${isSupabaseConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                    <span className="text-base font-bold text-white">
                      {isSupabaseConfigured ? "Terhubung ke Supabase Cloud" : "Local Persistent Database Active"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {isSupabaseConfigured
                      ? "Setiap operasi Create, Edit, dan Delete otomatis tersinkronisasi ke database PostgreSQL Supabase Anda."
                      : "Untuk menghubungkan ke Supabase, isi file .env.local dengan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY."}
                  </p>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400 uppercase font-bold">1-Click Push / Sync</span>
                    <h4 className="text-sm font-bold text-white mt-1">Kirim Semua Data Lokal ke Supabase</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Mengunggah seluruh {monitors.length} monitor, {desks.length} meja, dan aftersales ke tabel cloud.
                    </p>
                  </div>

                  <Button
                    variant="cyber"
                    size="sm"
                    disabled={!isSupabaseConfigured || isSyncing}
                    onClick={handlePushToSupabase}
                    className="font-bold text-xs w-full"
                  >
                    {isSyncing ? "Sedang Menyinkronkan..." : "Sync All Data to Supabase ➔"}
                  </Button>
                </div>
              </div>

              {/* SQL Migration Exporter */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Skema SQL Migration untuk Supabase</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopySQL}
                    className="text-xs font-bold border-zinc-700"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        <span>Salin Skema SQL</span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-zinc-400">
                  Salin skema di atas dan tempel di menu <strong>Supabase Dashboard ➔ SQL Editor ➔ New Query ➔ Run</strong> untuk membuat tabel `monitors`, `desks`, `peripherals`, `aftersales`, dan storage bucket `gp-assets`.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. WEBP OPTIMIZER LAB */}
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

      {/* Modal Dialogs */}
      <MonitorFormModal
        monitor={selectedMonitor}
        isOpen={isMonitorModalOpen}
        onClose={() => setIsMonitorModalOpen(false)}
        onSave={handleSaveMonitor}
      />

      <DeskFormModal
        type={deskModalType}
        initialDesk={selectedDesk}
        initialPeripheral={selectedPeripheral}
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
