"use client";

import React, { useState } from "react";
import {
  Tv,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Save,
  Check,
  RotateCcw,
  Search,
  ExternalLink,
  ImageIcon,
  Sparkles,
  Eye,
  SlidersHorizontal,
  Youtube,
  AlertTriangle,
  ArrowRight,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { Monitor, TierRating } from "@/types/monitor";
import { DatabaseService } from "@/lib/db-service";
import { formatRupiah } from "@/lib/utils";
import { compressImage, formatFileSize, CompressedImageResult } from "@/lib/image-compressor";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MonitorLiveStudioProps {
  monitors: Monitor[];
  onUpdateMonitors: (newMonitors: Monitor[]) => void;
  onPreviewSidePanel: (monitor: Monitor) => void;
}

export function MonitorLiveStudio({
  monitors,
  onUpdateMonitors,
  onPreviewSidePanel,
}: MonitorLiveStudioProps) {
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(
    monitors[0] || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<CompressedImageResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"identity" | "specs" | "review" | "stores">("identity");

  // Form State initialized with selected monitor
  const [formData, setFormData] = useState<Partial<Monitor>>(
    selectedMonitor || {
      brand: "Xiaomi",
      model: "Xiaomi G24i (2024)",
      fullName: "Xiaomi G24i (2024)",
      tier: "BEST VALUE",
      tierDescription: "Rekomendasi Utama Kelas 1080p Fast IPS",
      price: 1550000,
      originalPrice: 1800000,
      recommendedPrice: 1500000,
      aspectRatio: "16:9 (Wide)",
      curvature: "None",
      displayInputs: ["HDMI 1.4", "HDMI 2.0"],
      panelBitDepth: "8 Bit",
      standCapability: "Tilt",
      usbHub: "None",
      marketClass: "144Hz+",
      createdDateText: "February 24, 2025 12:24",
      lastUpdatedDate: "June 24, 2025",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      frontImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      rearImage: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
      quickSpecs: ["24 Inch or 23.8 Inch", "IPS", "180Hz", "1ms GtG"],
      expertVerdict: "Data Pengetesan GTID Tech: Motion clarity sangat baik dan akurasi warna tinggi.",
      pros: ["Panel Fast IPS 180Hz", "Akurasi warna tinggi"],
      cons: ["Stand bawaan tilt only"],
      specs: {
        display: {
          size: "24 Inch or 23.8 Inch",
          resolution: "1920x1080 (FHD)",
          panelType: "IPS",
          refreshRate: 180,
          responseTime: "Toleransi Baru (5 RGB), Toleransi Lama (10 RGB)",
          brightness: "300 nits",
          contrastRatio: "1000:1",
          colorGamut: "99% sRGB / 90% DCI-P3",
          hdr: "HDR10 (Disarankan SDR)",
          viewingAngle: "178° / 178°",
          curvature: "None",
        },
        connectivity: {
          displayPort: "1x DisplayPort 1.4",
          hdmi: "1x HDMI 2.0",
          audioJack: true,
          usbHub: "None",
        },
        ergonomics: {
          heightAdjustable: false,
          tilt: "-5° ~ 15°",
          swivel: "Tidak",
          pivot: false,
          vesaMount: "75x75 mm",
        },
        features: {
          syncTech: "Adaptive-Sync / FreeSync",
          builtInSpeakers: false,
          powerConsumption: "25W",
          warranty: "3 Tahun Garansi Distributor",
        },
      },
      marketplaces: [],
      priceHistory: [],
      tags: ["Fast IPS", "180Hz", "FHD (1080p)"],
      createdAt: new Date().toISOString(),
    }
  );

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSelectMonitor = (mon: Monitor) => {
    setSelectedMonitor(mon);
    setFormData({ ...mon });
    setCompressionStats(null);
  };

  const handleCreateNew = () => {
    const newMon: Monitor = {
      id: `mon-${Date.now()}-new`,
      slug: `monitor-baru-${Date.now()}`,
      brand: "Brand Baru",
      model: "Model Baru 180Hz",
      fullName: "Brand Model Baru 180Hz Fast IPS",
      tier: "RECOMMENDED",
      tierDescription: "Rekomendasi Monitor GrayPlasma",
      price: 1600000,
      originalPrice: 1900000,
      recommendedPrice: 1550000,
      aspectRatio: "16:9 (Wide)",
      curvature: "None",
      displayInputs: ["HDMI 1.4", "HDMI 2.0"],
      panelBitDepth: "8 Bit",
      standCapability: "Tilt",
      usbHub: "None",
      marketClass: "144Hz+",
      createdDateText: "February 24, 2025 12:24",
      lastUpdatedDate: "June 24, 2025",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      frontImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      rearImage: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
      gallery: [],
      quickSpecs: ["24 Inch or 23.8 Inch", "IPS", "180Hz", "1ms GtG"],
      expertVerdict: "Pengujian GTID Tech: Motion clarity sangat baik dan akurasi warna tinggi.",
      pros: ["Panel Fast IPS 180Hz", "Akurasi warna tinggi"],
      cons: ["Stand bawaan tilt only"],
      specs: {
        display: {
          size: "24 Inch or 23.8 Inch",
          resolution: "1920x1080 (FHD)",
          panelType: "IPS",
          refreshRate: 180,
          responseTime: "Toleransi Baru (5 RGB)",
          brightness: "300 nits",
          contrastRatio: "1000:1",
          colorGamut: "99% sRGB",
          hdr: "HDR10",
          viewingAngle: "178° / 178°",
          curvature: "None",
        },
        connectivity: {
          displayPort: "1x DisplayPort 1.4",
          hdmi: "1x HDMI 2.0",
          audioJack: true,
          usbHub: "None",
        },
        ergonomics: {
          heightAdjustable: false,
          tilt: "-5° ~ 15°",
          swivel: "Tidak",
          pivot: false,
          vesaMount: "75x75 mm",
        },
        features: {
          syncTech: "Adaptive-Sync / FreeSync",
          builtInSpeakers: false,
          powerConsumption: "28W",
          warranty: "3 Tahun Garansi Distributor",
        },
      },
      marketplaces: [],
      priceHistory: [],
      tags: ["Fast IPS", "180Hz"],
      createdAt: new Date().toISOString(),
      responseTimeData: {
        toleranceNew: "Toleransi Baru (5 RGB)",
        toleranceOld: "Toleransi Lama (10 RGB)",
      },
    };

    setSelectedMonitor(newMon);
    setFormData(newMon);
    showNotification("Membuat entri monitor baru. Silakan sesuaikan data lalu klik Simpan.");
  };

  const handleDuplicate = async (mon: Monitor) => {
    const duplicated: Monitor = {
      ...mon,
      id: `mon-${Date.now()}-copy`,
      slug: `${mon.slug}-copy-${Date.now().toString().slice(-4)}`,
      fullName: `${mon.fullName} (Copy)`,
      model: `${mon.model} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    const updated = await DatabaseService.saveMonitor(duplicated);
    onUpdateMonitors(updated);
    setSelectedMonitor(duplicated);
    setFormData(duplicated);
    showNotification(`Berhasil menduplikasi: ${duplicated.fullName}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus data monitor ini dari database?")) {
      const updated = await DatabaseService.deleteMonitor(id);
      onUpdateMonitors(updated);
      if (selectedMonitor?.id === id) {
        setSelectedMonitor(updated[0] || null);
        if (updated[0]) setFormData(updated[0]);
      }
      showNotification("Monitor berhasil dihapus!");
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.brand || !formData.fullName || !formData.price) {
      alert("Mohon lengkapi Brand, Nama Monitor, dan Kisaran Harga!");
      return;
    }

    const itemToSave: Monitor = {
      id: formData.id || `mon-${Date.now()}-${formData.model?.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      slug: formData.slug || formData.model?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "monitor",
      brand: formData.brand || "Brand",
      model: formData.model || formData.fullName || "Model",
      fullName: formData.fullName || "Full Name",
      tier: formData.tier || "RECOMMENDED",
      tierDescription: formData.tierDescription || "Rekomendasi GrayPlasma",
      price: Number(formData.price) || 1500000,
      originalPrice: Number(formData.originalPrice) || Math.round(Number(formData.price) * 1.15),
      recommendedPrice: formData.recommendedPrice ? Number(formData.recommendedPrice) : undefined,
      aspectRatio: formData.aspectRatio || "16:9 (Wide)",
      curvature: formData.curvature || "None",
      displayInputs: formData.displayInputs || ["HDMI 1.4", "HDMI 2.0"],
      panelBitDepth: formData.panelBitDepth || "8 Bit",
      standCapability: formData.standCapability || "Tilt",
      usbHub: formData.usbHub || "None",
      marketClass: formData.marketClass || "144Hz+",
      createdDateText: formData.createdDateText || "February 24, 2025 12:24",
      lastUpdatedDate: formData.lastUpdatedDate || "June 24, 2025",
      linkShopee: formData.linkShopee,
      linkTokopedia: formData.linkTokopedia,
      linkTiktokShop: formData.linkTiktokShop,
      thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      frontImage: formData.frontImage || formData.thumbnail,
      rearImage: formData.rearImage,
      gallery: formData.gallery || [formData.thumbnail || ""],
      quickSpecs: [
        formData.specs?.display?.size || "24 Inch or 23.8 Inch",
        formData.specs?.display?.panelType || "IPS",
        `${formData.specs?.display?.refreshRate || 180}Hz`,
        formData.specs?.display?.responseTime || "1ms GtG",
      ],
      expertVerdict: formData.expertVerdict || "Data pengetesan GTID Tech.",
      pros: formData.pros || ["Panel berkualitas", "Refresh rate tinggi"],
      cons: formData.cons || ["Perhatikan setting Overdrive"],
      specs: formData.specs as Monitor["specs"],
      marketplaces: formData.marketplaces || [],
      priceHistory: [{ date: "Rekomendasi GrayPlasma", price: Number(formData.price), label: "Harga Target" }],
      tags: [
        formData.specs?.display?.panelType || "IPS",
        `${formData.specs?.display?.refreshRate || 180}Hz`,
        formData.specs?.display?.resolution || "FHD",
      ],
      statusReason: formData.statusReason,
      gtidReviewUrl: formData.gtidReviewUrl,
      introduction: formData.introduction,
      bannerImage: formData.bannerImage,
      deepDiveTitle: formData.deepDiveTitle,
      deepDiveDescription: formData.deepDiveDescription,
      deepDiveNote: formData.deepDiveNote,
      accessoriesIncluded: formData.accessoriesIncluded,
      additionalStores: formData.additionalStores,
      responseTimeData: formData.responseTimeData,
      createdAt: formData.createdAt || new Date().toISOString(),
    };

    const updated = await DatabaseService.saveMonitor(itemToSave);
    onUpdateMonitors(updated);
    setSelectedMonitor(itemToSave);
    showNotification(`Berhasil menyimpan perubahan data: ${itemToSave.fullName}`);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.82,
        format: "webp",
      });

      setCompressionStats(compressed);
      setFormData((prev) => ({
        ...prev,
        thumbnail: compressed.dataUrl,
        frontImage: compressed.dataUrl,
      }));
    } catch (err) {
      console.error("Image compression error", err);
      alert("Gagal memproses gambar.");
    } finally {
      setIsCompressing(false);
    }
  };

  const filteredMonitors = monitors.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === "all" || m.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      {notice && (
        <div className="fixed top-16 right-6 z-50 bg-[#203c2b] border border-[#52ba69] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#52ba69]" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Studio Header */}
      <div className="p-6 rounded-3xl bg-[#202020] border border-[#2f2f2f] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d354a] border border-[#2383e2]/40 text-[#58a6ff] text-xs font-bold">
            <Tv className="w-3.5 h-3.5" />
            <span>Monitor Studio & Live Specsheet Editor</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Live Database Monitor & Notion Property Studio
          </h2>
          <p className="text-xs text-[#9b9a97] max-w-2xl leading-relaxed">
            Kelola, edit, dan tambah monitor dengan live preview real-time. Semua 21 properti Notion, toleransi data GTID, dan section ulasan tersinkronisasi instan.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="cyber"
            size="sm"
            onClick={handleCreateNew}
            className="text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Monitor Baru</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (window.confirm("Reset seluruh data monitor ke bawaan Notion (55+ model)?")) {
                const reset = DatabaseService.resetMonitorsToDefault();
                onUpdateMonitors(reset);
                setSelectedMonitor(reset[0] || null);
                if (reset[0]) setFormData(reset[0]);
                showNotification("Database monitor direset ke template default!");
              }
            }}
            className="text-xs text-[#9b9a97] hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </Button>
        </div>
      </div>

      {/* Main 3-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* COLUMN 1: MONITOR LIST SELECTOR (3 Cols)                                   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 rounded-2xl bg-[#171717] border border-[#2a2a2a] p-4 space-y-3 shadow-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Daftar Monitor</span>
              <span className="px-2 py-0.5 rounded-full bg-[#252525] text-[#9b9a97] text-[10px] font-mono">
                {monitors.length} Total
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari monitor..."
                className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
              />
            </div>

            {/* Tier Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              {["all", "S-TIER", "BEST VALUE", "RECOMMENDED", "PASS"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap transition-colors ${
                    tierFilter === tier
                      ? "bg-[#252525] text-white border border-[#3f3f3f]"
                      : "text-[#787774] hover:text-[#d4d4d4]"
                  }`}
                >
                  {tier === "all" ? "Semua" : tier}
                </button>
              ))}
            </div>
          </div>

          {/* List items */}
          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredMonitors.map((m) => {
              const isSelected = selectedMonitor?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => handleSelectMonitor(m)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-[#202020] border-[#2383e2] shadow-md"
                      : "bg-[#141414] border-[#262626] hover:border-[#333] hover:bg-[#1a1a1a]"
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] text-[#787774] font-bold uppercase tracking-wider block">
                      {m.brand}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {m.fullName}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#52ba69]">
                      <span>{formatRupiah(m.price)}</span>
                      <span className="text-[#787774]">•</span>
                      <span className="text-[#9b9a97]">{m.specs?.display?.refreshRate}Hz</span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                      m.tier === "S-TIER"
                        ? "bg-[#203c2b] text-[#52ba69]"
                        : m.tier === "BEST VALUE"
                        ? "bg-[#1d354a] text-[#58a6ff]"
                        : m.tier === "RECOMMENDED"
                        ? "bg-[#203c2b] text-[#52ba69]"
                        : "bg-[#442224] text-[#eb5757]"
                    }`}
                  >
                    {m.tier}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 2: LIVE SPEC & PROPERTY EDIT FORM (5 Cols)                         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 rounded-2xl bg-[#171717] border border-[#2a2a2a] p-5 space-y-4 shadow-lg">
          {/* Header Action Row */}
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🖥️</span>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Editor: {formData.fullName || "Monitor"}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              {selectedMonitor && (
                <>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(selectedMonitor)}
                    className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#2c2c2c] text-[#9b9a97] hover:text-[#58a6ff] transition-colors"
                    title="Duplikat Monitor"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMonitor.id)}
                    className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#2c2c2c] text-[#9b9a97] hover:text-rose-400 transition-colors"
                    title="Hapus Monitor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              <Button
                size="sm"
                variant="cyber"
                onClick={handleSave}
                className="text-xs font-bold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </Button>
            </div>
          </div>

          {/* Sub-Tab Navigation */}
          <div className="flex items-center gap-1 bg-[#121212] p-1 rounded-xl border border-[#262626]">
            {[
              { key: "identity", label: "1. Identitas & Harga" },
              { key: "specs", label: "2. 21 Properti Layar" },
              { key: "review", label: "3. Ulasan GTID & Foto" },
              { key: "stores", label: "4. Toko Affiliate" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveSubTab(tab.key as any)}
                className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-colors text-center ${
                  activeSubTab === tab.key
                    ? "bg-[#252525] text-white shadow-sm border border-[#3a3a3a]"
                    : "text-[#787774] hover:text-[#d4d4d4]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content Area */}
          <form onSubmit={handleSave} className="space-y-4 max-h-[640px] overflow-y-auto pr-1 text-xs">
            {/* SUB-TAB 1: IDENTITAS & HARGA */}
            {activeSubTab === "identity" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Brand</label>
                    <input
                      type="text"
                      value={formData.brand || ""}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Xiaomi, AOC, Dell, dll."
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#58a6ff]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Tier / Rekomendasi</label>
                    <select
                      value={formData.tier || "RECOMMENDED"}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value as TierRating })}
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#58a6ff]"
                    >
                      <option value="S-TIER">S-TIER (Terbaik)</option>
                      <option value="BEST VALUE">BEST VALUE (Paling Worth It)</option>
                      <option value="RECOMMENDED">RECOMMENDED (Bagus)</option>
                      <option value="PASS">PASS (Tidak Disarankan)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[#9b9a97] font-medium block mb-1">Nama Lengkap Model</label>
                  <input
                    type="text"
                    value={formData.fullName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value, model: e.target.value })
                    }
                    placeholder="Xiaomi G24i (2024)"
                    className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#58a6ff]"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[#52ba69] font-bold block mb-1">Kisaran Harga (Rp)</label>
                    <input
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-[#202020] border border-[#52ba69]/40 rounded-xl px-3 py-2 text-[#52ba69] font-mono font-bold focus:outline-none focus:border-[#52ba69]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Harga Normal (Rp)</label>
                    <input
                      type="number"
                      value={formData.originalPrice || ""}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-[#d4d4d4] font-mono focus:outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[#58a6ff] font-medium block mb-1">Target Rekomendasi (Rp)</label>
                    <input
                      type="number"
                      value={formData.recommendedPrice || ""}
                      onChange={(e) => setFormData({ ...formData, recommendedPrice: Number(e.target.value) })}
                      placeholder="e.g. 1500000"
                      className="w-full bg-[#202020] border border-[#58a6ff]/40 rounded-xl px-3 py-2 text-[#58a6ff] font-mono focus:outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#9b9a97] font-medium block mb-1">Deskripsi Singkat Tier</label>
                  <textarea
                    rows={2}
                    value={formData.tierDescription || ""}
                    onChange={(e) => setFormData({ ...formData, tierDescription: e.target.value })}
                    placeholder="Rekomendasi GrayPlasma untuk kelas entry esport..."
                    className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>
              </div>
            )}

            {/* SUB-TAB 2: 21 PROPERTI LAYAR NOTION */}
            {activeSubTab === "specs" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Ukuran Layar (Panel Size)</label>
                    <input
                      type="text"
                      value={formData.specs?.display?.size || "24 Inch or 23.8 Inch"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: {
                            ...formData.specs!,
                            display: { ...formData.specs!.display, size: e.target.value },
                          },
                        })
                      }
                      placeholder="24 Inch or 23.8 Inch"
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Panel Type</label>
                    <input
                      type="text"
                      value={formData.specs?.display?.panelType || "IPS"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: {
                            ...formData.specs!,
                            display: { ...formData.specs!.display, panelType: e.target.value },
                          },
                        })
                      }
                      placeholder="IPS / Fast IPS / OLED / VA"
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Resolusi (Pixel)</label>
                    <input
                      type="text"
                      value={formData.specs?.display?.resolution || "1920x1080 (FHD)"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: {
                            ...formData.specs!,
                            display: { ...formData.specs!.display, resolution: e.target.value },
                          },
                        })
                      }
                      placeholder="1920x1080 (FHD)"
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Refresh Rate (Hz)</label>
                    <input
                      type="number"
                      value={formData.specs?.display?.refreshRate || 180}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: {
                            ...formData.specs!,
                            display: { ...formData.specs!.display, refreshRate: Number(e.target.value) },
                          },
                        })
                      }
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Aspect Ratio</label>
                    <input
                      type="text"
                      value={formData.aspectRatio || "16:9 (Wide)"}
                      onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                      placeholder="16:9 (Wide) / 21:9"
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Curvature</label>
                    <input
                      type="text"
                      value={formData.curvature || "None"}
                      onChange={(e) => setFormData({ ...formData, curvature: e.target.value })}
                      placeholder="None / 1500R"
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Panel Bit Depth</label>
                    <input
                      type="text"
                      value={formData.panelBitDepth || "8 Bit"}
                      onChange={(e) => setFormData({ ...formData, panelBitDepth: e.target.value })}
                      placeholder="8 Bit / 10 Bit"
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Market Class</label>
                    <input
                      type="text"
                      value={formData.marketClass || "144Hz+"}
                      onChange={(e) => setFormData({ ...formData, marketClass: e.target.value })}
                      placeholder="144Hz+ / 100Hz"
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Stand Capability</label>
                    <input
                      type="text"
                      value={formData.standCapability || "Tilt"}
                      onChange={(e) => setFormData({ ...formData, standCapability: e.target.value })}
                      placeholder="Tilt / HAS"
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">USB Hub</label>
                    <input
                      type="text"
                      value={formData.usbHub || "None"}
                      onChange={(e) => setFormData({ ...formData, usbHub: e.target.value })}
                      placeholder="None / USB 3.0"
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">VESA Mount</label>
                    <input
                      type="text"
                      value={formData.specs?.ergonomics?.vesaMount || "75x75 mm"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: {
                            ...formData.specs!,
                            ergonomics: { ...formData.specs!.ergonomics, vesaMount: e.target.value },
                          },
                        })
                      }
                      placeholder="75x75 mm / 100x100 mm"
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">Display Inputs (Koma)</label>
                    <input
                      type="text"
                      value={(formData.displayInputs || ["HDMI 1.4", "HDMI 2.0"]).join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayInputs: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="HDMI 1.4, HDMI 2.0"
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[#52ba69] font-medium block mb-1">Toleransi Baru (Data Baru GTID)</label>
                    <input
                      type="text"
                      value={formData.responseTimeData?.toleranceNew || "Toleransi Baru (5 RGB)"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          responseTimeData: {
                            ...formData.responseTimeData,
                            toleranceNew: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-[#202020] border border-[#52ba69]/30 rounded-xl px-3 py-1.5 text-[#52ba69]"
                    />
                  </div>
                  <div>
                    <label className="text-[#eb5757] font-medium block mb-1">Toleransi Lama (Data Lama GTID)</label>
                    <input
                      type="text"
                      value={formData.responseTimeData?.toleranceOld || "Toleransi Lama (10 RGB)"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          responseTimeData: {
                            ...formData.responseTimeData,
                            toleranceOld: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-[#202020] border border-[#eb5757]/30 rounded-xl px-3 py-1.5 text-[#eb5757]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: ULASAN GTID & FOTO */}
            {activeSubTab === "review" && (
              <div className="space-y-3">
                {/* Photo URLs */}
                <div className="p-3 rounded-xl bg-[#121212] border border-[#262626] space-y-2">
                  <span className="text-[10px] font-bold text-white uppercase block">Foto Monitor Depan & Belakang</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[#787774] block mb-0.5">Tampak Depan (URL)</label>
                      <input
                        type="text"
                        value={formData.frontImage || ""}
                        onChange={(e) => setFormData({ ...formData, frontImage: e.target.value, thumbnail: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-[#202020] border border-[#2f2f2f] rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#787774] block mb-0.5">Tampak Belakang (URL)</label>
                      <input
                        type="text"
                        value={formData.rearImage || ""}
                        onChange={(e) => setFormData({ ...formData, rearImage: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-[#202020] border border-[#2f2f2f] rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Video Review URL & Status Banner */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9b9a97] font-medium block mb-1">URL Review YouTube GTID</label>
                    <input
                      type="text"
                      value={formData.gtidReviewUrl || ""}
                      onChange={(e) => setFormData({ ...formData, gtidReviewUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-rose-400 font-medium block mb-1">Status Banner Alert / Catatan Verdict</label>
                    <input
                      type="text"
                      value={formData.statusReason || ""}
                      onChange={(e) => setFormData({ ...formData, statusReason: e.target.value })}
                      placeholder="e.g. TIDAK DISARANKAN KARENA..."
                      className="w-full bg-[#202020] border border-rose-500/30 rounded-xl px-3 py-1.5 text-rose-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#9b9a97] font-medium block mb-1">Paragraf Pendahuluan</label>
                  <textarea
                    rows={2}
                    value={formData.introduction || ""}
                    onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                    placeholder="Ulasan pengantar performa monitor..."
                    className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#9b9a97] font-medium block mb-1">Judul Ulasan Mendalam</label>
                  <input
                    type="text"
                    value={formData.deepDiveTitle || ""}
                    onChange={(e) => setFormData({ ...formData, deepDiveTitle: e.target.value })}
                    placeholder="e.g. Akurat di D65-P3 tapi kok Undersaturated?"
                    className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#9b9a97] font-medium block mb-1">Paragraf Analisis Reviewer</label>
                  <textarea
                    rows={3}
                    value={formData.deepDiveDescription || ""}
                    onChange={(e) => setFormData({ ...formData, deepDiveDescription: e.target.value })}
                    placeholder="Penjelasan detail hasil uji lab..."
                    className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>
            )}

            {/* SUB-TAB 4: TOKO AFFILIATE */}
            {activeSubTab === "stores" && (
              <div className="space-y-3">
                <div>
                  <label className="text-[#58a6ff] font-medium block mb-1">Link Shopee (Direct)</label>
                  <input
                    type="text"
                    value={formData.linkShopee || ""}
                    onChange={(e) => setFormData({ ...formData, linkShopee: e.target.value })}
                    placeholder="https://shopee.co.id/..."
                    className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#58a6ff] font-medium block mb-1">Link Tokopedia (Direct)</label>
                  <input
                    type="text"
                    value={formData.linkTokopedia || ""}
                    onChange={(e) => setFormData({ ...formData, linkTokopedia: e.target.value })}
                    placeholder="https://tokopedia.com/..."
                    className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#58a6ff] font-medium block mb-1">Link TikTok Shop (Direct)</label>
                  <input
                    type="text"
                    value={formData.linkTiktokShop || ""}
                    onChange={(e) => setFormData({ ...formData, linkTiktokShop: e.target.value })}
                    placeholder="https://tiktok.com/..."
                    className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 3: REAL-TIME NOTION SIDE-PEEK PREVIEW (4 Cols)                      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 rounded-2xl bg-[#191919] border border-[#2a2a2a] p-5 space-y-4 shadow-xl overflow-y-auto max-h-[750px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3 text-xs text-[#9b9a97]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#52ba69] animate-pulse" />
              <span className="font-bold text-[#e0e0e0] uppercase tracking-wider text-[10px]">
                Live Side-Peek Preview
              </span>
            </div>
            {selectedMonitor && (
              <button
                type="button"
                onClick={() => onPreviewSidePanel(selectedMonitor)}
                className="text-[10px] text-[#58a6ff] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Buka Panel Penuh</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Title & Icon Header */}
          <div className="space-y-1">
            <div className="text-3xl">🖥️</div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">
              {formData.fullName || "Nama Monitor"}
            </h1>
          </div>

          {/* Notion Property Table (Exact 1:1 format) */}
          <div className="space-y-1.5 text-xs border-y border-[#2a2a2a] py-3 text-[#9b9a97]">
            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Kisaran Harga</span>
              <span className="col-span-7 font-mono font-bold text-white text-[11px]">
                IDR {(formData.price || 0).toLocaleString("en-US")}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Aspect Ratio</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#1d354a] text-[#58a6ff] text-[10px] font-medium">
                  {formData.aspectRatio || "16:9 (Wide)"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Curvature</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#442224] text-[#eb5757] text-[10px] font-medium">
                  {formData.curvature || "None"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Display Input</span>
              <div className="col-span-7 flex items-center gap-1 flex-wrap">
                {(formData.displayInputs || ["HDMI 1.4", "HDMI 2.0"]).map((inp, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      idx === 0 ? "bg-[#203c2b] text-[#52ba69]" : "bg-[#3b2344] text-[#d157eb]"
                    }`}
                  >
                    {inp}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Panel Bit Depth</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#2f2f2f] text-[#d4d4d4] text-[10px] font-medium">
                  {formData.panelBitDepth || "8 Bit"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Panel Size</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#442c1d] text-[#e07936] text-[10px] font-medium">
                  {formData.specs?.display?.size || "24 Inch"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Refresh Rate</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#203c2b] text-[#52ba69] text-[10px] font-mono font-medium">
                  {formData.specs?.display?.refreshRate || 180}Hz
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Resolution</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#442224] text-[#eb5757] text-[10px] font-medium">
                  {formData.specs?.display?.resolution || "1920x1080 (FHD)"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">STATUS</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#203c2b] text-[#52ba69] text-[10px] font-bold">
                  {formData.tier || "RECOMMENDED"}
                </span>
              </div>
            </div>
          </div>

          {/* Photo Gallery Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#787774] uppercase">Section Foto Monitor</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#202020] border border-[#2f2f2f]">
                <img
                  src={formData.frontImage || formData.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop"}
                  alt="Front"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] text-white">
                  Depan
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#202020] border border-[#2f2f2f]">
                <img
                  src={formData.rearImage || formData.thumbnail || "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop"}
                  alt="Rear"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] text-white">
                  Belakang
                </div>
              </div>
            </div>
          </div>

          {/* Video Preview if provided */}
          {formData.gtidReviewUrl && (
            <div className="p-3 rounded-xl bg-[#202020] border border-[#2f2f2f] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-white font-bold">
                <Youtube className="w-4 h-4 text-rose-500" />
                <span>Video Review GTID Terhubung</span>
              </div>
              <p className="text-[10px] text-[#9b9a97] truncate">{formData.gtidReviewUrl}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
