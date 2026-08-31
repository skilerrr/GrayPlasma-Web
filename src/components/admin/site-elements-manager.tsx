"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Megaphone,
  Image as ImageIcon,
  MessageSquare,
  PhoneCall,
  Save,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Shield,
  Layers,
  Palette,
  QrCode,
  Globe,
  Upload,
} from "lucide-react";
import {
  GlobalSiteSettings,
  PageBannerSettings,
  DatabaseService,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_BANNER_SETTINGS,
} from "@/lib/db-service";
import { compressImage } from "@/lib/image-compressor";
import { Button } from "@/components/ui/button";

interface SiteElementsManagerProps {
  siteSettings: GlobalSiteSettings;
  bannerSettings: PageBannerSettings;
  onUpdateSiteSettings: (newSettings: GlobalSiteSettings) => void;
  onUpdateBannerSettings: (newBanners: PageBannerSettings) => void;
}

export function SiteElementsManager({
  siteSettings,
  bannerSettings,
  onUpdateSiteSettings,
  onUpdateBannerSettings,
}: SiteElementsManagerProps) {
  const [activeTab, setActiveTab] = useState<"announcement" | "banners" | "consultation" | "brand">("announcement");
  const [settingsForm, setSettingsForm] = useState<GlobalSiteSettings>({ ...siteSettings });
  const [bannerForm, setBannerForm] = useState<PageBannerSettings>({ ...bannerSettings });
  const [notice, setNotice] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = await DatabaseService.saveSiteSettings(settingsForm);
    const updatedBanners = await DatabaseService.saveBannerSettings(bannerForm);
    onUpdateSiteSettings(updatedSettings);
    onUpdateBannerSettings(updatedBanners);
    showNotice("Seluruh konfigurasi elemen visual & kontak berhasil disimpan!");
  };

  const handleResetToDefault = () => {
    if (confirm("Kembalikan seluruh pengaturan visual & kontak ke template bawaan?")) {
      const defSettings = DatabaseService.resetSiteSettings();
      const defBanners = DatabaseService.resetBannerSettings();
      setSettingsForm(defSettings);
      setBannerForm(defBanners);
      onUpdateSiteSettings(defSettings);
      onUpdateBannerSettings(defBanners);
      showNotice("Pengaturan visual dikembalikan ke default.");
    }
  };

  const handleUploadBanner = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "homeBannerUrl" | "guideBannerUrl" | "monitorBannerUrl" | "qrisImageUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressed = await compressImage(file, 1600, 0.85);
      if (field === "qrisImageUrl") {
        setSettingsForm({
          ...settingsForm,
          consultation: { ...settingsForm.consultation, qrisImageUrl: compressed.dataUrl },
        });
      } else {
        setBannerForm({ ...bannerForm, [field]: compressed.dataUrl });
      }
      showNotice("Gambar berhasil dioptimasi WebP dan disematkan!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-xs text-emerald-200 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="bg-surface-dark border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Elements & Customizer Hub</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Kustomisasi Seluruh Elemen Website
            </h3>
            <p className="text-xs text-zinc-400 max-w-2xl">
              Atur Announcement Ribbon, Hero Banners, nomor WhatsApp konsultasi, tautan Discord/TikTok, serta teks legal disclaimer.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetToDefault}
              className="text-xs border-zinc-700"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset Default</span>
            </Button>
            <Button
              type="button"
              variant="cyber"
              size="sm"
              onClick={handleSaveAll}
              className="text-xs font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </Button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("announcement")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "announcement"
                ? "bg-zinc-800 text-amber-400 border border-amber-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Announcement Bar</span>
          </button>
          <button
            onClick={() => setActiveTab("banners")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "banners"
                ? "bg-zinc-800 text-cyan-400 border border-cyan-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Hero & Page Banners</span>
          </button>
          <button
            onClick={() => setActiveTab("consultation")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "consultation"
                ? "bg-zinc-800 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Konsultasi, VIP & Sosmed</span>
          </button>
          <button
            onClick={() => setActiveTab("brand")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "brand"
                ? "bg-zinc-800 text-violet-400 border border-violet-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Branding & Disclaimer</span>
          </button>
        </div>

        {/* 1. ANNOUNCEMENT BAR TAB */}
        {activeTab === "announcement" && (
          <div className="space-y-6 max-w-3xl">
            {/* Live Preview Box */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Live Preview Pita Pengumuman (Tampil di bagian paling atas website)
              </span>
              {settingsForm.announcement.isEnabled ? (
                <div className="w-full bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-950 border-y border-emerald-500/30 px-4 py-2 text-xs flex items-center justify-between gap-3 text-emerald-200">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px] border border-emerald-500/40">
                      {settingsForm.announcement.badgeText || "INFO"}
                    </span>
                    <span className="font-medium text-xs truncate">
                      {settingsForm.announcement.text}
                    </span>
                  </div>
                  {settingsForm.announcement.linkText && (
                    <span className="text-emerald-400 underline font-bold text-[11px] flex-shrink-0">
                      {settingsForm.announcement.linkText} ➔
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-500 italic text-center">
                  Announcement Bar sedang DINONAKTIFKAN.
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-white flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.announcement.isEnabled}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcement: { ...settingsForm.announcement, isEnabled: e.target.checked },
                      })
                    }
                    className="rounded border-zinc-700 bg-zinc-900 text-emerald-500"
                  />
                  <span>Aktifkan Announcement Ribbon di Navbar</span>
                </label>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Teks Pengumuman</label>
                <textarea
                  rows={2}
                  value={settingsForm.announcement.text}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      announcement: { ...settingsForm.announcement, text: e.target.value },
                    })
                  }
                  placeholder="Ketik teks pengumuman penting..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Badge Pill Text</label>
                  <input
                    type="text"
                    value={settingsForm.announcement.badgeText || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcement: { ...settingsForm.announcement, badgeText: e.target.value },
                      })
                    }
                    placeholder="UPDATE 2026"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Teks Tombol Link</label>
                  <input
                    type="text"
                    value={settingsForm.announcement.linkText || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcement: { ...settingsForm.announcement, linkText: e.target.value },
                      })
                    }
                    placeholder="Buka Panduan"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">URL Tujuan</label>
                  <input
                    type="text"
                    value={settingsForm.announcement.linkUrl || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcement: { ...settingsForm.announcement, linkUrl: e.target.value },
                      })
                    }
                    placeholder="/guide/sdr/glossary"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. HERO & PAGE BANNERS TAB */}
        {activeTab === "banners" && (
          <div className="space-y-6 max-w-3xl text-xs">
            {/* Home Hero Banner */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <h4 className="font-bold text-amber-400 uppercase text-xs">
                1. Hero Banner Halaman Beranda (Home Page)
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Judul Utama Hero Banner</label>
                  <input
                    type="text"
                    value={bannerForm.homeBannerTitle || ""}
                    onChange={(e) => setBannerForm({ ...bannerForm, homeBannerTitle: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Subjudul / Deskripsi Kurasi</label>
                  <textarea
                    rows={2}
                    value={bannerForm.homeBannerSubtitle || ""}
                    onChange={(e) => setBannerForm({ ...bannerForm, homeBannerSubtitle: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-400">Background Image URL (Opsional)</label>
                    <label className="text-[11px] text-amber-400 hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload & WebP Compress</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadBanner(e, "homeBannerUrl")}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={bannerForm.homeBannerUrl || ""}
                    onChange={(e) => setBannerForm({ ...bannerForm, homeBannerUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... (atau kosongkan untuk clean dark)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Guides Banner */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <h4 className="font-bold text-cyan-400 uppercase text-xs">
                2. Default Cover Halaman Panduan (/guide/...)
              </h4>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-400">Default Cover Image URL untuk Panduan</label>
                  <label className="text-[11px] text-cyan-400 hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload & WebP Compress</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadBanner(e, "guideBannerUrl")}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={bannerForm.guideBannerUrl || ""}
                  onChange={(e) => setBannerForm({ ...bannerForm, guideBannerUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Monitor Banner */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <h4 className="font-bold text-emerald-400 uppercase text-xs">
                3. Default Cover Halaman Monitor (/monitor/[slug])
              </h4>
              <div>
                <label className="text-zinc-400 block mb-1">Background Banner URL untuk Halaman Monitor</label>
                <input
                  type="text"
                  value={bannerForm.monitorBannerUrl || ""}
                  onChange={(e) => setBannerForm({ ...bannerForm, monitorBannerUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. VIP CONSULTATION & SOCIAL LINKS TAB */}
        {activeTab === "consultation" && (
          <div className="space-y-6 max-w-3xl text-xs">
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <h4 className="font-bold text-emerald-400 uppercase text-xs">
                Informasi Konsultasi WhatsApp & Komunitas Discord
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Nomor WhatsApp Konsultasi</label>
                  <input
                    type="text"
                    value={settingsForm.consultation.whatsapp}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        consultation: { ...settingsForm.consultation, whatsapp: e.target.value },
                      })
                    }
                    placeholder="0851-7979-4019"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Link WhatsApp Direct</label>
                  <input
                    type="text"
                    value={settingsForm.consultation.whatsappUrl}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        consultation: { ...settingsForm.consultation, whatsappUrl: e.target.value },
                      })
                    }
                    placeholder="https://wa.me/6285179794019"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Link Server Discord GTID</label>
                  <input
                    type="text"
                    value={settingsForm.consultation.discordUrl}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        consultation: { ...settingsForm.consultation, discordUrl: e.target.value },
                      })
                    }
                    placeholder="https://discord.gg/joingtid"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Link TikTok Creator</label>
                  <input
                    type="text"
                    value={settingsForm.consultation.tiktokUrl}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        consultation: { ...settingsForm.consultation, tiktokUrl: e.target.value },
                      })
                    }
                    placeholder="https://www.tiktok.com/@gray1plasma"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Link YouTube Channel GTID Tech</label>
                  <input
                    type="text"
                    value={settingsForm.consultation.youtubeUrl}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        consultation: { ...settingsForm.consultation, youtubeUrl: e.target.value },
                      })
                    }
                    placeholder="https://www.youtube.com/c/GTiDtech/videos"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Link Google Feedback Form</label>
                  <input
                    type="text"
                    value={settingsForm.consultation.feedbackFormUrl}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        consultation: { ...settingsForm.consultation, feedbackFormUrl: e.target.value },
                      })
                    }
                    placeholder="https://docs.google.com/forms/..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Teks Disclaimer Konsultasi Notion</label>
                <textarea
                  rows={4}
                  value={settingsForm.consultation.disclaimer}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      consultation: { ...settingsForm.consultation, disclaimer: e.target.value },
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-emerald-400 font-mono leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. BRANDING & DISCLAIMER TAB */}
        {activeTab === "brand" && (
          <div className="space-y-6 max-w-3xl text-xs">
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <h4 className="font-bold text-violet-400 uppercase text-xs">
                Nama Brand & Teks Footer Hak Cipta
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Nama Brand Website</label>
                  <input
                    type="text"
                    value={settingsForm.brandName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                    placeholder="GRAYPLASMA ID"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Tagline Singkat</label>
                  <input
                    type="text"
                    value={settingsForm.brandTagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandTagline: e.target.value })}
                    placeholder="Database Pengujian & Kurasi Monitor Independen"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Teks Copyright Footer</label>
                <input
                  type="text"
                  value={settingsForm.copyrightText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, copyrightText: e.target.value })}
                  placeholder="© 2024-2026 GrayPlasma ID x GTID Tech. Seluruh hak cipta dilindungi."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
