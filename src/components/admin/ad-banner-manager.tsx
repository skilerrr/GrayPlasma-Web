"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  Upload,
  Save,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  X,
  Play,
} from "lucide-react";
import { AdBannerItem, DatabaseService, DEFAULT_AD_BANNERS } from "@/lib/db-service";
import { compressImage } from "@/lib/image-compressor";
import { BannerCarousel } from "@/components/banner-carousel";
import { Button } from "@/components/ui/button";

const PRESET_PAGES = [
  { label: "Katalog: Semua Monitor", url: "/catalog/all" },
  { label: "Detail: Xiaomi G24i 180Hz (S-Tier)", url: "/monitor/xiaomi-g24i-2026-" },
  { label: "Katalog: Rekomendasi Meja + Setup", url: "/catalog/desks" },
  { label: "Panduan: Aftersales Brand & RMA Tier List", url: "/guide/brand/aftersales-rma" },
  { label: "Panduan: Glosarium deITP & Akurasi GTID", url: "/guide/sdr/glossary" },
  { label: "Panduan: Meja Ergonomis & Monitor Arm", url: "/guide/setup/meja-ergonomi" },
  { label: "Panduan: OLED Care & Burn-in", url: "/guide/oled/perawatan-burn-in" },
  { label: "Panduan: Bandwidth DP 1.4 vs HDMI 2.1", url: "/guide/display/bandwidth-dp-hdmi" },
  { label: "Panduan: QnA & FAQ Monitor", url: "/guide/faq" },
  { label: "Halaman: Konsultasi Joel Gray", url: "/guide/consultation/konsultasi-joel-gray" },
];

const BADGE_COLORS: Array<{ id: AdBannerItem["badgeColor"]; label: string; class: string }> = [
  { id: "emerald", label: "Emerald (Hijau)", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" },
  { id: "amber", label: "Amber (Kuning)", class: "bg-amber-500/20 text-amber-400 border-amber-500/40" },
  { id: "cyan", label: "Cyan (Biru Muda)", class: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40" },
  { id: "rose", label: "Rose (Merah)", class: "bg-rose-500/20 text-rose-400 border-rose-500/40" },
  { id: "violet", label: "Violet (Ungu)", class: "bg-violet-500/20 text-violet-400 border-violet-500/40" },
  { id: "orange", label: "Orange (Oranye)", class: "bg-orange-500/20 text-orange-400 border-orange-500/40" },
];

export function AdBannerManager() {
  const [banners, setBanners] = useState<AdBannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Edit/Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdBannerItem | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const data = await DatabaseService.getAdBanners();
      setBanners(data);
    } catch (e) {
      console.error("Failed to load ad banners", e);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleOpenAdd = () => {
    const newBanner: AdBannerItem = {
      id: `banner-${Date.now()}`,
      title: "",
      subtitle: "",
      badge: "FEATURED",
      badgeColor: "emerald",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop",
      linkUrl: "/catalog/all",
      targetBlank: false,
      ctaText: "Lihat Selengkapnya",
      isActive: true,
      order: banners.length + 1,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setEditingBanner(newBanner);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: AdBannerItem) => {
    setEditingBanner({ ...banner });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    if (!editingBanner.title.trim()) {
      alert("Judul banner wajib diisi!");
      return;
    }
    if (!editingBanner.imageUrl.trim()) {
      alert("URL gambar banner wajib diisi!");
      return;
    }
    if (!editingBanner.linkUrl.trim()) {
      alert("Target URL halaman trigger wajib diisi!");
      return;
    }

    const updated = await DatabaseService.saveAdBanner(editingBanner);
    setBanners(updated);
    setIsModalOpen(false);
    setEditingBanner(null);
    showNotification(`Banner "${editingBanner.title}" berhasil disimpan!`);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Hapus banner "${title}" dari rotasi?`)) {
      const updated = await DatabaseService.deleteAdBanner(id);
      setBanners(updated);
      showNotification(`Banner "${title}" berhasil dihapus.`);
    }
  };

  const handleToggleActive = async (banner: AdBannerItem) => {
    const updatedBanner = { ...banner, isActive: !banner.isActive };
    const updatedList = await DatabaseService.saveAdBanner(updatedBanner);
    setBanners(updatedList);
    showNotification(`Status banner "${banner.title}" diubah.`);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const [moved] = newBanners.splice(index, 1);
    newBanners.splice(targetIndex, 0, moved);

    const reordered = await DatabaseService.reorderAdBanners(newBanners);
    setBanners(reordered);
    showNotification("Urutan banner diperbarui.");
  };

  const handleResetToDefault = () => {
    if (confirm("Kembalikan seluruh daftar Ad Banner ke preset kurasi bawaan?")) {
      const def = DatabaseService.resetAdBannersToDefault();
      setBanners(def);
      showNotification("Daftar banner dikembalikan ke default.");
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingBanner) return;

    setIsCompressing(true);
    try {
      const result = await compressImage(file, 1920, 0.85);
      setEditingBanner({
        ...editingBanner,
        imageUrl: result.dataUrl,
      });
      showNotification(`Gambar dioptimasi WebP (${(result.compressedSize / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.error("Upload error", err);
      alert("Gagal memproses gambar.");
    } finally {
      setIsCompressing(false);
    }
  };

  const activeCount = banners.filter((b) => b.isActive).length;

  return (
    <div className="space-y-8 font-sans">
      {notice && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl text-xs text-emerald-200 font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header Studio */}
      <div className="bg-gp-ink-900 border border-gp-ink-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gp-ink-700 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Megaphone className="w-3.5 h-3.5" />
              <span>Edge-to-Edge Like-Ad Carousel</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Manajemen Ad Banner Beranda
            </h3>
            <p className="text-xs text-gp-ink-300 max-w-2xl leading-relaxed">
              Atur banner iklan full-width yang membentang dari ujung kiri ke kanan di beranda. Mendukung rotasi otomatis 5 detik, gesture swipe sentuh/mouse, dan trigger navigasi ke halaman target.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="text-xs border-gp-ink-700 text-gp-ink-200 hover:text-white"
            >
              {showLivePreview ? <EyeOff className="w-3.5 h-3.5 mr-1.5" /> : <Eye className="w-3.5 h-3.5 mr-1.5" />}
              <span>{showLivePreview ? "Tutup Preview" : "Lihat Preview"}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetToDefault}
              className="text-xs text-gp-ink-300 hover:text-white border-gp-ink-700"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Reset Bawaan</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleOpenAdd}
              className="text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 shadow-md"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>Tambah Banner Baru</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-gp-ink-950 border border-gp-ink-750">
            <span className="text-3xs font-mono text-gp-ink-400 block uppercase">Total Banner</span>
            <span className="text-xl font-bold font-mono text-white">{banners.length}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-gp-ink-950 border border-gp-ink-750">
            <span className="text-3xs font-mono text-gp-ink-400 block uppercase">Aktif di Beranda</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{activeCount} Slide</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-gp-ink-950 border border-gp-ink-750">
            <span className="text-3xs font-mono text-gp-ink-400 block uppercase">Interval Auto-Slide</span>
            <span className="text-xl font-bold font-mono text-cyan-400">5 Detik</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-gp-ink-950 border border-gp-ink-750">
            <span className="text-3xs font-mono text-gp-ink-400 block uppercase">Swipe Gestures</span>
            <span className="text-xl font-bold font-mono text-orange-400">Aktif (Touch/Drag)</span>
          </div>
        </div>
      </div>

      {/* Live Preview Simulator */}
      {showLivePreview && activeCount > 0 && (
        <div className="bg-gp-ink-900 border border-gp-ink-700 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gp-ink-200">
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Simulator: Tampilan Beranda Full-Width</span>
            </div>
            <span className="text-3xs font-mono text-gp-ink-400">
              *Geser atau klik CTA untuk menguji interaktivitas
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gp-ink-700">
            <BannerCarousel banners={banners} intervalMs={5000} />
          </div>
        </div>
      )}

      {/* Banner List */}
      <div className="bg-gp-ink-900 border border-gp-ink-700 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-gp-ink-700 pb-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Daftar Slide Banner</span>
            <span className="text-xs font-mono font-normal text-gp-ink-400">
              (Urutan tampil dari atas ke bawah)
            </span>
          </h4>
          <span className="text-xs text-gp-ink-300 font-mono">
            {banners.length} Item
          </span>
        </div>

        {banners.length === 0 ? (
          <div className="p-12 text-center text-gp-ink-400 text-xs space-y-2">
            <Megaphone className="w-8 h-8 mx-auto opacity-40 text-gp-ink-500" />
            <p>Belum ada banner aktif. Klik "Tambah Banner Baru" di atas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  banner.isActive
                    ? "bg-gp-ink-900 border-gp-ink-700 hover:border-gp-ink-600"
                    : "bg-gp-ink-950/50 border-gp-ink-800 opacity-60"
                }`}
              >
                {/* Left: Thumbnail & Content */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-1 rounded hover:bg-gp-ink-700 text-gp-ink-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Geser ke atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === banners.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-1 rounded hover:bg-gp-ink-700 text-gp-ink-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Geser ke bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-28 h-16 sm:w-36 sm:h-20 rounded-xl overflow-hidden border border-gp-ink-700 flex-shrink-0 bg-gp-ink-800">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-gp-ink-700 text-gp-ink-300">
                        #{index + 1}
                      </span>
                      {banner.badge && (
                        <span className="text-3xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {banner.badge}
                        </span>
                      )}
                      <span className="text-3xs font-mono text-gp-ink-400 flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-gp-ink-400" />
                        <span className="truncate max-w-[180px] sm:max-w-xs">{banner.linkUrl}</span>
                        {banner.targetBlank && <ExternalLink className="w-2.5 h-2.5 text-gp-ink-500" />}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white truncate">{banner.title}</h5>
                    {banner.subtitle && (
                      <p className="text-xs text-gp-ink-300 truncate max-w-lg">{banner.subtitle}</p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-1.5 border ${
                      banner.isActive
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                        : "bg-gp-ink-750 text-gp-ink-400 border-gp-ink-700 hover:text-gp-ink-200"
                    }`}
                  >
                    {banner.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{banner.isActive ? "Aktif" : "Nonaktif"}</span>
                  </button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(banner)}
                    className="text-xs border-gp-ink-700 text-gp-ink-200 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(banner.id, banner.title)}
                    className="text-xs border-gp-ink-700 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialog Form (Create / Edit) */}
      {isModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-gp-ink-900 border border-gp-ink-600/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gp-ink-700 bg-gp-ink-850 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    {editingBanner.createdAt ? "Edit Ad Banner" : "Tambah Ad Banner"}
                  </h3>
                  <p className="text-xs text-gp-ink-300">
                    Konfigurasi visual, headline, target link, dan tombol trigger navigasi.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gp-ink-300 hover:text-white hover:bg-gp-ink-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form with Scrollable Body & Fixed Footer */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-gp-ink-200 font-bold block">
                    Judul Utama Banner (Heading) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBanner.title}
                    onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                    placeholder="Contoh: Xiaomi G24i 180Hz Fast IPS"
                    className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2.5 text-white placeholder-gp-ink-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-gp-ink-200 font-bold block">
                    Deskripsi Singkat (Subtitle)
                  </label>
                  <textarea
                    rows={2}
                    value={editingBanner.subtitle || ""}
                    onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                    placeholder="Contoh: Rekomendasi monitor gaming budget terbaik dengan akurasi deITP 2.1 teruji di lab GTID."
                    className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-white placeholder-gp-ink-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Badge & Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gp-ink-200 font-bold block">Teks Badge Tag</label>
                    <input
                      type="text"
                      value={editingBanner.badge || ""}
                      onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                      placeholder="Contoh: S-TIER BUDGET 2026"
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-white placeholder-gp-ink-400 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-gp-ink-200 font-bold block">Warna Badge</label>
                    <select
                      value={editingBanner.badgeColor || "emerald"}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          badgeColor: e.target.value as AdBannerItem["badgeColor"],
                        })
                      }
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-400"
                    >
                      {BADGE_COLORS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image URL & Upload */}
                <div className="space-y-1.5">
                  <label className="text-gp-ink-200 font-bold block">
                    Gambar Banner (Landscape 1920x600 atau 1600x500 disarankan) <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={editingBanner.imageUrl}
                      onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... atau upload file"
                      className="flex-1 bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-white placeholder-gp-ink-400 focus:outline-none focus:border-emerald-400"
                    />
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-gp-ink-700 hover:bg-gp-ink-600 border border-gp-ink-600 font-bold text-gp-ink-100 flex items-center gap-1.5 flex-shrink-0 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isCompressing ? "Proses..." : "Upload WebP"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        disabled={isCompressing}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {editingBanner.imageUrl && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gp-ink-600 mt-2 bg-gp-ink-800">
                      <Image
                        src={editingBanner.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Target Trigger Link & Preset */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-gp-ink-200 font-bold block">
                      Target URL Trigger Halaman <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-3xs font-mono text-gp-ink-300">
                      (Internal: /monitor/... atau eksternal: https://...)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={editingBanner.linkUrl}
                      onChange={(e) => setEditingBanner({ ...editingBanner, linkUrl: e.target.value })}
                      placeholder="/monitor/xiaomi-g24i-2026- atau /catalog/all"
                      className="flex-1 bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-white placeholder-gp-ink-400 focus:outline-none focus:border-emerald-400 font-mono text-xs"
                    />
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setEditingBanner({ ...editingBanner, linkUrl: e.target.value });
                        }
                      }}
                      className="bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3 py-2 text-gp-ink-200 hover:text-white text-xs max-w-[140px] truncate focus:border-emerald-400"
                    >
                      <option value="">Pilih Preset...</option>
                      {PRESET_PAGES.map((p) => (
                        <option key={p.url} value={p.url}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CTA Button Text & Target Blank */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gp-ink-200 font-bold block">Teks Tombol CTA</label>
                    <input
                      type="text"
                      value={editingBanner.ctaText || "Lihat Selengkapnya"}
                      onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                      placeholder="Contoh: Cek Data Pengujian"
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-white placeholder-gp-ink-400 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gp-ink-200 font-bold block">Opsi Tautan</label>
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-gp-ink-850 border border-gp-ink-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingBanner.targetBlank || false}
                        onChange={(e) =>
                          setEditingBanner({ ...editingBanner, targetBlank: e.target.checked })
                        }
                        className="rounded border-gp-ink-500 bg-gp-ink-700 text-emerald-500 focus:ring-0"
                      />
                      <span className="text-gp-ink-200">Buka di Tab Baru (target="_blank")</span>
                    </label>
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingBanner.isActive}
                      onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.checked })}
                      className="rounded border-gp-ink-500 bg-gp-ink-700 text-emerald-500 focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-white block">Aktifkan Slide di Beranda</span>
                      <span className="text-2xs text-gp-ink-200">
                        Jika dicentang, banner akan langsung tampil di rotasi carousel beranda tiap 5 detik.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Fixed Footer Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-gp-ink-700 bg-gp-ink-950 flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="border-gp-ink-600 text-gp-ink-200 hover:text-white hover:bg-gp-ink-700"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="cyber"
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Banner</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
