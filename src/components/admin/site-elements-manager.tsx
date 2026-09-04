"use client";

import React, { useState, useEffect } from "react";
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
  LayoutGrid,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import {
  GlobalSiteSettings,
  PageBannerSettings,
  HomepageSettings,
  SubpageCardItem,
  DEFAULT_HOMEPAGE_SETTINGS,
  DatabaseService,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_BANNER_SETTINGS,
} from "@/lib/db-service";
import { compressImage } from "@/lib/image-compressor";
import { NotionRichEditor } from "@/components/admin/notion-rich-editor";
import { Button } from "@/components/ui/button";

interface SiteElementsManagerProps {
  siteSettings: GlobalSiteSettings;
  bannerSettings: PageBannerSettings;
  onUpdateSiteSettings: (newSettings: GlobalSiteSettings) => void;
  onUpdateBannerSettings: (newBanners: PageBannerSettings) => void;
  onRefresh?: () => void;
}

const PAGE_ICONS = ["🖥️", "⚡", "🛡️", "🚀", "🎯", "✨", "📊", "💡", "🎮", "🔍"];

export function SiteElementsManager({
  siteSettings,
  bannerSettings,
  onUpdateSiteSettings,
  onUpdateBannerSettings,
  onRefresh,
}: SiteElementsManagerProps) {
  const [activeTab, setActiveTab] = useState<
    "homepage" | "subpages" | "sections" | "announcement" | "consultation" | "brand"
  >("homepage");

  const [settingsForm, setSettingsForm] = useState<GlobalSiteSettings>({ ...siteSettings });
  const [bannerForm, setBannerForm] = useState<PageBannerSettings>({ ...bannerSettings });
  const [homepageForm, setHomepageForm] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [notice, setNotice] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Subpage Card Edit Modal
  const [editingCard, setEditingCard] = useState<SubpageCardItem | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  useEffect(() => {
    async function loadHomepage() {
      const hp = await DatabaseService.getHomepageSettings();
      if (hp) setHomepageForm(hp);
    }
    loadHomepage();
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
    onRefresh?.();
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = await DatabaseService.saveSiteSettings(settingsForm);
    const updatedBanners = await DatabaseService.saveBannerSettings(bannerForm);
    const updatedHomepage = await DatabaseService.saveHomepageSettings(homepageForm);
    onUpdateSiteSettings(updatedSettings);
    onUpdateBannerSettings(updatedBanners);
    setHomepageForm(updatedHomepage);
    showNotice("Seluruh konfigurasi Homepage, Elemen Visual, & Kontak berhasil disimpan!");
  };

  const handleResetToDefault = () => {
    if (confirm("Kembalikan seluruh pengaturan Homepage dan Kontak ke template bawaan?")) {
      const defSettings = DatabaseService.resetSiteSettings();
      const defBanners = DatabaseService.resetBannerSettings();
      const defHp = DatabaseService.resetHomepageSettings();
      setSettingsForm(defSettings);
      setBannerForm(defBanners);
      setHomepageForm(defHp);
      onUpdateSiteSettings(defSettings);
      onUpdateBannerSettings(defBanners);
      showNotice("Pengaturan dikembalikan ke default.");
    }
  };

  const handleUploadBanner = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "homeBannerUrl" | "guideBannerUrl" | "monitorBannerUrl" | "qrisImageUrl" | "heroCoverUrl"
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
      } else if (field === "heroCoverUrl") {
        setHomepageForm({ ...homepageForm, heroCoverUrl: compressed.dataUrl });
        setBannerForm({ ...bannerForm, homeBannerUrl: compressed.dataUrl });
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

  // Subpage card actions
  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    const cards = [...homepageForm.subpageCards];
    const idx = cards.findIndex((c) => c.id === editingCard.id);
    if (idx >= 0) {
      cards[idx] = editingCard;
    } else {
      cards.push(editingCard);
    }
    const updated = { ...homepageForm, subpageCards: cards };
    setHomepageForm(updated);
    DatabaseService.saveHomepageSettings(updated);
    setIsCardModalOpen(false);
    setEditingCard(null);
    showNotice(`Kartu "${editingCard.title}" berhasil diperbarui!`);
  };

  const toggleCardVisibility = (cardId: string) => {
    const cards = homepageForm.subpageCards.map((c) =>
      c.id === cardId ? { ...c, isVisible: !c.isVisible } : c
    );
    const updated = { ...homepageForm, subpageCards: cards };
    setHomepageForm(updated);
    DatabaseService.saveHomepageSettings(updated);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm("Hapus kartu navigasi ini dari beranda?")) {
      const cards = homepageForm.subpageCards.filter((c) => c.id !== cardId);
      const updated = { ...homepageForm, subpageCards: cards };
      setHomepageForm(updated);
      DatabaseService.saveHomepageSettings(updated);
      showNotice("Kartu navigasi dihapus.");
    }
  };

  // Group subpage cards
  const groupedCards = homepageForm.subpageCards.reduce((acc, card) => {
    const groupName = card.groupTitle || "Lainnya";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(card);
    return acc;
  }, {} as Record<string, SubpageCardItem[]>);

  return (
    <div className="space-y-6 font-sans">
      {notice && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl text-xs text-emerald-200 font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="bg-[#101014] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Sliders className="w-3.5 h-3.5" />
              <span>Full Customization Studio</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Studio Manajemen Homepage & Tampilan
            </h3>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Atur seluruh elemen beranda: Banner hero, page icon, catatan penting disclaimer, 19 kartu navigasi sub-pages, visibilitas section, dan kontak konsultasi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetToDefault}
              className="text-xs text-zinc-400 hover:text-white border-zinc-800"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Reset Bawaan</span>
            </Button>
            <Button
              type="button"
              variant="cyber"
              size="sm"
              onClick={handleSaveAll}
              className="text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 shadow-md"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              <span>Simpan Semua Perubahan</span>
            </Button>
          </div>
        </div>

        {/* Studio Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: "homepage", label: "Hero & Disclaimer Beranda", icon: LayoutGrid },
            { id: "subpages", label: `Kartu Sub-Pages (${homepageForm.subpageCards.length})`, icon: Layers },
            { id: "sections", label: "Visibilitas & Judul Section", icon: Sliders },
            { id: "announcement", label: "Running Announcement Bar", icon: Megaphone },
            { id: "consultation", label: "Kontak & QRIS Donasi", icon: PhoneCall },
            { id: "brand", label: "Identitas Brand", icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                  isActive
                    ? "bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* TAB 1: HOMEPAGE HERO COVER, ICON & DISCLAIMER CALLOUT                 */}
        {/* ===================================================================== */}
        {activeTab === "homepage" && (
          <div className="space-y-6">
            {/* Hero Cover & Icon */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>🖥️</span>
                <span>Cover Banner Hero & Icon Beranda</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="text-zinc-400 block text-xs mb-1 font-semibold">Judul Halaman Beranda (H1)</label>
                    <input
                      type="text"
                      value={homepageForm.pageTitle}
                      onChange={(e) => setHomepageForm({ ...homepageForm, pageTitle: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block text-xs mb-1 font-semibold">Badge Subtitle</label>
                      <input
                        type="text"
                        value={homepageForm.statusBadge}
                        onChange={(e) => setHomepageForm({ ...homepageForm, statusBadge: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block text-xs mb-1 font-semibold">Icon Emoji Halaman</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={homepageForm.pageIcon}
                          onChange={(e) => setHomepageForm({ ...homepageForm, pageIcon: e.target.value })}
                          className="w-16 text-center text-xl bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-1 text-white focus:outline-none focus:border-emerald-500"
                        />
                        <div className="flex flex-wrap gap-1">
                          {PAGE_ICONS.map((ic) => (
                            <button
                              key={ic}
                              type="button"
                              onClick={() => setHomepageForm({ ...homepageForm, pageIcon: ic })}
                              className="text-xs p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500"
                            >
                              {ic}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block text-xs mb-1 font-semibold">URL Cover Banner Hero</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={homepageForm.heroCoverUrl}
                        onChange={(e) => setHomepageForm({ ...homepageForm, heroCoverUrl: e.target.value })}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
                      />
                      <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-bold cursor-pointer flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-pink-400" />
                        <span>Upload WebP</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadBanner(e, "heroCoverUrl")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Banner Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-black h-40 sm:h-auto flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={homepageForm.heroCoverUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop"}
                    alt="Cover Preview"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-2xl p-1 bg-black/60 rounded-xl border border-zinc-700">
                      {homepageForm.pageIcon}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer / Catatan Penting Callout */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Kotak Disclaimer & Catatan Penting Beranda</span>
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Gunakan editor visual WYSIWYG untuk mengatur catatan yang tampil tepat di bawah judul beranda.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Judul Kotak Catatan</label>
                  <input
                    type="text"
                    value={homepageForm.disclaimerTitle}
                    onChange={(e) => setHomepageForm({ ...homepageForm, disclaimerTitle: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">
                    Uraian Catatan Penting (Dukungan Penuh Visual Word/Notion):
                  </label>
                  <NotionRichEditor
                    value={
                      homepageForm.disclaimerMarkdown ||
                      homepageForm.disclaimerPoints.map((p) => `- ${p}`).join("\n")
                    }
                    onChange={(val) => setHomepageForm({ ...homepageForm, disclaimerMarkdown: val })}
                    minHeight="min-h-[220px]"
                    placeholder="Tulis butir-butir disclaimer atau peringatan untuk pengunjung..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: SUBPAGE NAVIGATION CARDS BUILDER (19 CARDS)                     */}
        {/* ===================================================================== */}
        {activeTab === "subpages" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <div>
                <h4 className="text-sm font-bold text-white">Kelola 19 Kartu Navigasi Sub-Pages Beranda</h4>
                <p className="text-xs text-zinc-400">
                  Ubah judul, deskripsi, icon, URL, atau sembunyikan kartu yang belum ingin dipublikasikan.
                </p>
              </div>
              <Button
                type="button"
                variant="cyber"
                size="sm"
                onClick={() => {
                  setEditingCard({
                    id: `sub-custom-${Date.now()}`,
                    groupId: "group-1",
                    groupTitle: "1. REKOMENDASI MONITOR PILIHAN UTAMA",
                    groupEmoji: "🌟",
                    title: "Kartu Baru",
                    desc: "Deskripsi panduan...",
                    path: "/guide/custom",
                    icon: "📄",
                    color: "hover:border-[#58a6ff] text-[#58a6ff]",
                    order: homepageForm.subpageCards.length + 1,
                    isVisible: true,
                  });
                  setIsCardModalOpen(true);
                }}
                className="text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Tambah Kartu Baru</span>
              </Button>
            </div>

            {/* List by Groups */}
            <div className="space-y-6">
              {Object.entries(groupedCards).map(([groupTitle, cards]) => (
                <div key={groupTitle} className="space-y-3 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider pb-2 border-b border-zinc-800">
                    <span>📂</span>
                    <span>{groupTitle}</span>
                    <span className="text-[10px] text-zinc-500 font-mono font-normal">({cards.length} kartu)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          card.isVisible
                            ? "bg-[#18181f] border-zinc-800 hover:border-zinc-700"
                            : "bg-zinc-950 border-zinc-900 opacity-50"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 font-bold text-white text-xs">
                              <span className="text-base">{card.icon}</span>
                              <span className="truncate max-w-[180px]">{card.title}</span>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500">#{card.order}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                            {card.desc}
                          </p>
                          <span className="text-[10px] font-mono text-emerald-400 truncate block">
                            {card.path}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-zinc-800/60">
                          <button
                            type="button"
                            onClick={() => toggleCardVisibility(card.id)}
                            className={`p-1 rounded-lg text-xs flex items-center gap-1 font-semibold ${
                              card.isVisible ? "text-emerald-400 hover:bg-emerald-500/10" : "text-zinc-500 hover:bg-zinc-800"
                            }`}
                            title={card.isVisible ? "Tampil di Beranda" : "Disembunyikan"}
                          >
                            {card.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span className="text-[10px]">{card.isVisible ? "Aktif" : "Sembunyi"}</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCard({ ...card });
                                setIsCardModalOpen(true);
                              }}
                              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white"
                              title="Edit Kartu"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCard(card.id)}
                              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400"
                              title="Hapus Kartu"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: SECTION VISIBILITY & TITLES                                    */}
        {/* ===================================================================== */}
        {activeTab === "sections" && (
          <div className="space-y-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Visibilitas & Judul Section di Beranda
              </h4>

              <div className="space-y-4 text-xs">
                {/* Section Monitor */}
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span>🖥️</span>
                      <span>Section Database Monitor</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homepageForm.sectionVisibility.showMonitors}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            sectionVisibility: { ...homepageForm.sectionVisibility, showMonitors: e.target.checked },
                          })
                        }
                        className="rounded border-zinc-700 bg-zinc-900 text-emerald-500"
                      />
                      <span className="text-zinc-300">Tampilkan</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={homepageForm.sectionTitles.monitorsTitle}
                    onChange={(e) =>
                      setHomepageForm({
                        ...homepageForm,
                        sectionTitles: { ...homepageForm.sectionTitles, monitorsTitle: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                  <input
                    type="text"
                    value={homepageForm.sectionTitles.monitorsSubtitle}
                    onChange={(e) =>
                      setHomepageForm({
                        ...homepageForm,
                        sectionTitles: { ...homepageForm.sectionTitles, monitorsSubtitle: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400"
                  />
                </div>

                {/* Section Meja */}
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span>🪑</span>
                      <span>Section Database Meja</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homepageForm.sectionVisibility.showDesks}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            sectionVisibility: { ...homepageForm.sectionVisibility, showDesks: e.target.checked },
                          })
                        }
                        className="rounded border-zinc-700 bg-zinc-900 text-emerald-500"
                      />
                      <span className="text-zinc-300">Tampilkan</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={homepageForm.sectionTitles.desksTitle}
                    onChange={(e) =>
                      setHomepageForm({
                        ...homepageForm,
                        sectionTitles: { ...homepageForm.sectionTitles, desksTitle: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                  <input
                    type="text"
                    value={homepageForm.sectionTitles.desksSubtitle}
                    onChange={(e) =>
                      setHomepageForm({
                        ...homepageForm,
                        sectionTitles: { ...homepageForm.sectionTitles, desksSubtitle: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400"
                  />
                </div>

                {/* Section Peripherals */}
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span>🎧</span>
                      <span>Section Database Aksesoris & Peripherals</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homepageForm.sectionVisibility.showPeripherals}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            sectionVisibility: { ...homepageForm.sectionVisibility, showPeripherals: e.target.checked },
                          })
                        }
                        className="rounded border-zinc-700 bg-zinc-900 text-emerald-500"
                      />
                      <span className="text-zinc-300">Tampilkan</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={homepageForm.sectionTitles.peripheralsTitle}
                    onChange={(e) =>
                      setHomepageForm({
                        ...homepageForm,
                        sectionTitles: { ...homepageForm.sectionTitles, peripheralsTitle: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                  <input
                    type="text"
                    value={homepageForm.sectionTitles.peripheralsSubtitle}
                    onChange={(e) =>
                      setHomepageForm({
                        ...homepageForm,
                        sectionTitles: { ...homepageForm.sectionTitles, peripheralsSubtitle: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: RUNNING ANNOUNCEMENT BAR                                       */}
        {/* ===================================================================== */}
        {activeTab === "announcement" && (
          <div className="space-y-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Running Announcement Bar</span>
                <label className="flex items-center gap-2 cursor-pointer">
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
                  <span className="text-zinc-300">Aktifkan Pengumuman</span>
                </label>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Teks Pengumuman</label>
                <input
                  type="text"
                  value={settingsForm.announcement.text}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      announcement: { ...settingsForm.announcement, text: e.target.value },
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Teks Link Tombol</label>
                  <input
                    type="text"
                    value={settingsForm.announcement.linkText || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcement: { ...settingsForm.announcement, linkText: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">URL Tujuan</label>
                  <input
                    type="text"
                    value={settingsForm.announcement.linkUrl || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcement: { ...settingsForm.announcement, linkUrl: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 5: KONSULTASI & QRIS DONASI                                       */}
        {/* ===================================================================== */}
        {activeTab === "consultation" && (
          <div className="space-y-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4 text-xs">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kontak Konsultasi & Donasi</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">WhatsApp Support</label>
                  <input
                    type="text"
                    value={settingsForm.consultation.whatsapp}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        consultation: { ...settingsForm.consultation, whatsapp: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Link Server Discord</label>
                  <input
                    type="text"
                    value={settingsForm.consultation.discordUrl}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        consultation: { ...settingsForm.consultation, discordUrl: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Gambar QRIS Donasi Dukungan</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={settingsForm.consultation.qrisImageUrl || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        consultation: { ...settingsForm.consultation, qrisImageUrl: e.target.value },
                      })
                    }
                    placeholder="URL gambar QRIS..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                  <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-bold cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-pink-400" />
                    <span>Upload QRIS WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadBanner(e, "qrisImageUrl")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 6: IDENTITAS BRAND                                                */}
        {/* ===================================================================== */}
        {activeTab === "brand" && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Identitas Brand GrayPlasma</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Nama Brand</label>
                <input
                  type="text"
                  value={settingsForm.brandName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Tagline Website</label>
                <input
                  type="text"
                  value={settingsForm.brandTagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandTagline: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-semibold">Teks Hak Cipta Footer</label>
              <input
                type="text"
                value={settingsForm.copyrightText}
                onChange={(e) => setSettingsForm({ ...settingsForm, copyrightText: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SUBPAGE CARD EDIT MODAL                                                   */}
      {/* ========================================================================= */}
      {isCardModalOpen && editingCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="font-bold text-white text-sm uppercase flex items-center gap-2">
                <span>{editingCard.icon}</span>
                <span>Edit Kartu Navigasi Sub-Page</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsCardModalOpen(false);
                  setEditingCard(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-3 text-xs">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <label className="text-zinc-400 block mb-1 font-semibold">Icon</label>
                  <input
                    type="text"
                    value={editingCard.icon}
                    onChange={(e) => setEditingCard({ ...editingCard, icon: e.target.value })}
                    className="w-full text-center text-lg bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-zinc-400 block mb-1 font-semibold">Judul Kartu</label>
                  <input
                    type="text"
                    required
                    value={editingCard.title}
                    onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  required
                  value={editingCard.desc}
                  onChange={(e) => setEditingCard({ ...editingCard, desc: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Path Rute (/guide/...)</label>
                  <input
                    type="text"
                    required
                    value={editingCard.path}
                    onChange={(e) => setEditingCard({ ...editingCard, path: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Grup Kategori</label>
                  <select
                    value={editingCard.groupTitle}
                    onChange={(e) => setEditingCard({ ...editingCard, groupTitle: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="1. REKOMENDASI MONITOR PILIHAN UTAMA">1. Rekomendasi Monitor</option>
                    <option value="2. EVALUASI BRAND & AFTERSALES (OEM / ODM LIST)">2. Evaluasi Brand & Aftersales</option>
                    <option value="3. GLOSARIUM & PANDUAN KALIBRASI WARNA (GTID TECH)">3. Glosarium & Kalibrasi</option>
                    <option value="4. QNA & GRAYNOTES (PERTANYAAN SERING DIAJUKAN)">4. QnA & GrayNotes</option>
                    <option value="5. SETUP MEJA, AUTHOR & CONSULTATION">5. Setup Meja & Support</option>
                    <option value="Custom Lainnya">Custom Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editingCard.isVisible}
                    onChange={(e) => setEditingCard({ ...editingCard, isVisible: e.target.checked })}
                    className="rounded border-zinc-700 bg-zinc-900 text-emerald-500"
                  />
                  <span>Tampilkan di Beranda</span>
                </label>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsCardModalOpen(false);
                      setEditingCard(null);
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit" variant="cyber" size="sm" className="bg-emerald-500 text-black font-bold">
                    Simpan Kartu
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
