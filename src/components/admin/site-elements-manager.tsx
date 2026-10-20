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
  Monitor,
  Headphones,
  ShieldAlert,
  HelpCircle,
  BookOpen,
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

      <div className="bg-gp-ink-900 border border-gp-ink-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gp-ink-700 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Sliders className="w-3.5 h-3.5" />
              <span>Full Customization Studio</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Studio Manajemen Homepage & Tampilan
            </h3>
            <p className="text-xs text-gp-ink-300 max-w-2xl leading-relaxed">
              Atur seluruh elemen beranda: Banner hero, page icon, catatan penting disclaimer, 19 kartu navigasi sub-pages, visibilitas section, dan kontak konsultasi.
            </p>
          </div>

          <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2 border-b border-gp-ink-700 pb-3 overflow-x-auto no-scrollbar">
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
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 flex-shrink-0 ${
                  isActive
                    ? "bg-gp-ink-700 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-gp-ink-300 hover:text-white"
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
            <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Monitor className="w-4 h-4 text-gp-ink-300" />
                <span>Cover Banner Hero & Icon Beranda</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="text-gp-ink-300 block text-xs mb-1 font-semibold">Judul Halaman Beranda (H1)</label>
                    <input
                      type="text"
                      value={homepageForm.pageTitle}
                      onChange={(e) => setHomepageForm({ ...homepageForm, pageTitle: e.target.value })}
                      className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gp-ink-300 block text-xs mb-1 font-semibold">Badge Subtitle</label>
                      <input
                        type="text"
                        value={homepageForm.statusBadge}
                        onChange={(e) => setHomepageForm({ ...homepageForm, statusBadge: e.target.value })}
                        className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-xs text-gp-ink-200 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-gp-ink-300 block text-xs mb-1 font-semibold">Icon Emoji Halaman</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={homepageForm.pageIcon}
                          onChange={(e) => setHomepageForm({ ...homepageForm, pageIcon: e.target.value })}
                          className="w-16 text-center text-xl bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-2 py-1 text-white focus:outline-none focus:border-emerald-500"
                        />
                        <div className="flex flex-wrap gap-1">
                          {PAGE_ICONS.map((ic) => (
                            <button
                              key={ic}
                              type="button"
                              onClick={() => setHomepageForm({ ...homepageForm, pageIcon: ic })}
                              className="text-xs p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 hover:border-emerald-500"
                            >
                              {ic}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-gp-ink-300 block text-xs mb-1 font-semibold">URL Cover Banner Hero</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={homepageForm.heroCoverUrl}
                        onChange={(e) => setHomepageForm({ ...homepageForm, heroCoverUrl: e.target.value })}
                        className="flex-1 bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-xs text-gp-ink-200 focus:outline-none focus:border-emerald-500"
                      />
                      <label className="px-3 py-2 rounded-xl bg-gp-ink-700 hover:bg-gp-ink-600 text-xs text-gp-ink-100 font-bold cursor-pointer flex items-center gap-1.5">
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
                <div className="relative rounded-2xl overflow-hidden border border-gp-ink-700 bg-black aspect-[16/9] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={homepageForm.heroCoverUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop"}
                    alt="Cover Preview"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-2xl p-1 bg-black/60 rounded-xl border border-gp-ink-600">
                      {homepageForm.pageIcon}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer / Catatan Penting Callout */}
            <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Kotak Disclaimer & Catatan Penting Beranda</span>
                  </h4>
                  <p className="text-xs text-gp-ink-300">
                    Gunakan editor visual WYSIWYG untuk mengatur catatan yang tampil tepat di bawah judul beranda.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-gp-ink-300 block mb-1 font-semibold">Judul Kotak Catatan</label>
                  <input
                    type="text"
                    value={homepageForm.disclaimerTitle}
                    onChange={(e) => setHomepageForm({ ...homepageForm, disclaimerTitle: e.target.value })}
                    className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-gp-ink-300 block mb-1 font-semibold">
                    Uraian Catatan Penting (Dukungan Visual WYSIWYG):
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-4">
              <div>
                <h4 className="text-sm font-bold text-white">Kelola 19 Kartu Navigasi Sub-Pages Beranda</h4>
                <p className="text-xs text-gp-ink-300">
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
                    groupTitle: "1. EVALUASI BRAND & AFTERSALES (OEM / ODM LIST)",
                    groupEmoji: "🛡️",
                    title: "Kartu Baru",
                    desc: "Deskripsi panduan...",
                    path: "/guide/custom",
                    icon: "📄",
                    color: "hover:border-gp-sky text-gp-sky",
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
                <div key={groupTitle} className="space-y-3 bg-gp-ink-950/60 border border-gp-ink-700/80 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gp-ink-200 uppercase tracking-wider pb-2 border-b border-gp-ink-700">
                    <Layers className="w-4 h-4 text-gp-ink-300" />
                    <span>{groupTitle}</span>
                    <span className="text-3xs text-gp-ink-400 font-mono font-normal">({cards.length} kartu)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className={`p-3.5 rounded-2xl border transition-colors flex flex-col justify-between ${
                          card.isVisible
                            ? "bg-gp-ink-800 border-gp-ink-700 hover:border-gp-ink-600"
                            : "bg-gp-ink-950 border-gp-ink-800 opacity-50"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 font-bold text-white text-xs">
                              <span className="text-base">{card.icon}</span>
                              <span className="truncate max-w-[180px]">{card.title}</span>
                            </div>
                            <span className="text-3xs font-mono text-gp-ink-400">#{card.order}</span>
                          </div>
                          <p className="text-2xs text-gp-ink-300 line-clamp-2 leading-relaxed">
                            {card.desc}
                          </p>
                          <span className="text-3xs font-mono text-emerald-400 truncate block">
                            {card.path}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gp-ink-700/60">
                          <button
                            type="button"
                            onClick={() => toggleCardVisibility(card.id)}
                            className={`p-1 rounded-lg text-xs flex items-center gap-1 font-semibold ${
                              card.isVisible ? "text-emerald-400 hover:bg-emerald-500/10" : "text-gp-ink-400 hover:bg-gp-ink-700"
                            }`}
                            title={card.isVisible ? "Tampil di Beranda" : "Disembunyikan"}
                          >
                            {card.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span className="text-3xs">{card.isVisible ? "Aktif" : "Sembunyi"}</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCard({ ...card });
                                setIsCardModalOpen(true);
                              }}
                              className="p-1 rounded-lg hover:bg-gp-ink-700 text-gp-ink-200 hover:text-white"
                              title="Edit Kartu"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCard(card.id)}
                              className="p-1 rounded-lg hover:bg-gp-ink-700 text-gp-ink-400 hover:text-red-400"
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
            <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Visibilitas & Judul Section di Beranda
              </h4>

              <div className="space-y-4 text-xs">
                {/* Section Monitor */}
                <div className="p-4 bg-gp-ink-800/50 border border-gp-ink-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-gp-ink-300" />
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
                        className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                      />
                      <span className="text-gp-ink-200">Tampilkan</span>
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
                    className="w-full bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-3 py-2 text-white font-bold"
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
                    className="w-full bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-3 py-2 text-gp-ink-300"
                  />
                </div>

                {/* Section Meja */}
                <div className="p-4 bg-gp-ink-800/50 border border-gp-ink-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-gp-ink-300" />
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
                        className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                      />
                      <span className="text-gp-ink-200">Tampilkan</span>
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
                    className="w-full bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-3 py-2 text-white font-bold"
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
                    className="w-full bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-3 py-2 text-gp-ink-300"
                  />
                </div>

                {/* Section Monitor Arm (Gas Spring) */}
                <div className="p-4 bg-gp-ink-800/50 border border-gp-ink-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-base">🦾</span>
                      <span>Section Database Monitor Arm (Gas Spring)</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homepageForm.sectionVisibility.showArms !== false}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            sectionVisibility: { ...homepageForm.sectionVisibility, showArms: e.target.checked },
                          })
                        }
                        className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                      />
                      <span className="text-gp-ink-200">
                        {homepageForm.sectionVisibility.showArms !== false ? "Aktif (Live)" : "Nonaktif (Disabled)"}
                      </span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={homepageForm.sectionTitles.armsTitle || "DATABASE REKOMENDASI MONITOR ARM (GAS SPRING)"}
                    onChange={(e) =>
                      setHomepageForm({
                        ...homepageForm,
                        sectionTitles: { ...homepageForm.sectionTitles, armsTitle: e.target.value },
                      })
                    }
                    placeholder="Judul Section Monitor Arm..."
                    className="w-full bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                  <input
                    type="text"
                    value={homepageForm.sectionTitles.armsSubtitle || "Tabel kurasi lengan gas spring kokoh penahan monitor 24\" - 34\" ultra-fleksibel."}
                    onChange={(e) =>
                      setHomepageForm({
                        ...homepageForm,
                        sectionTitles: { ...homepageForm.sectionTitles, armsSubtitle: e.target.value },
                      })
                    }
                    placeholder="Subjudul Section Monitor Arm..."
                    className="w-full bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-3 py-2 text-gp-ink-300"
                  />
                </div>

                {/* Section Bracket & Mount */}
                <div className="p-4 bg-gp-ink-800/50 border border-gp-ink-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-base">🗜️</span>
                      <span>Section Database Bracket & Mount Adapter</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homepageForm.sectionVisibility.showBrackets !== false}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            sectionVisibility: { ...homepageForm.sectionVisibility, showBrackets: e.target.checked },
                          })
                        }
                        className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                      />
                      <span className="text-gp-ink-200">
                        {homepageForm.sectionVisibility.showBrackets !== false ? "Aktif (Live)" : "Nonaktif (Disabled)"}
                      </span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={homepageForm.sectionTitles.bracketsTitle || "DATABASE REKOMENDASI BRACKET & MOUNT ADAPTER"}
                    onChange={(e) =>
                      setHomepageForm({
                        ...homepageForm,
                        sectionTitles: { ...homepageForm.sectionTitles, bracketsTitle: e.target.value },
                      })
                    }
                    placeholder="Judul Section Bracket..."
                    className="w-full bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                  <input
                    type="text"
                    value={homepageForm.sectionTitles.bracketsSubtitle || "Tabel plat protektor pelindung daun meja jepit, desk stand universal, & bracket dinding VESA."}
                    onChange={(e) =>
                      setHomepageForm({
                        ...homepageForm,
                        sectionTitles: { ...homepageForm.sectionTitles, bracketsSubtitle: e.target.value },
                      })
                    }
                    placeholder="Subjudul Section Bracket..."
                    className="w-full bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-3 py-2 text-gp-ink-300"
                  />
                </div>

                {/* Section Aksesoris & Kabel Peripherals */}
                <div className="p-4 bg-gp-ink-800/50 border border-gp-ink-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-gp-ink-300" />
                      <span>Section Database Aksesoris & Kabel Display</span>
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
                        className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                      />
                      <span className="text-gp-ink-200">
                        {homepageForm.sectionVisibility.showPeripherals ? "Aktif (Live)" : "Nonaktif (Disabled)"}
                      </span>
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
                    className="w-full bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-3 py-2 text-white font-bold"
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
                    className="w-full bg-gp-ink-950 border border-gp-ink-700 rounded-xl px-3 py-2 text-gp-ink-300"
                  />
                </div>

                {/* Section Kursi Ergonomis & Gaming (Staging Q2 2027) */}
                <div className="p-4 bg-gp-ink-800/50 border border-gp-ink-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span>🪑</span>
                      <span>Katalog Kursi Ergonomis & Gaming</span>
                      <span className="px-2 py-0.5 rounded text-4xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        [STAGING / DRAFT Q2 2027]
                      </span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homepageForm.sectionVisibility.showChairs === true}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            sectionVisibility: { ...homepageForm.sectionVisibility, showChairs: e.target.checked },
                          })
                        }
                        className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                      />
                      <span className="text-gp-ink-200">Tampilkan di Publik (Live)</span>
                    </label>
                  </div>
                  <p className="text-xs text-gp-ink-400">
                    Menampilkan tab ulasan rekomendasi kursi ergonomis & gaming di dalam modul Setup Meja & Peripherals. Jika nonaktif, data tetap aman tersimpan di admin dan tidak terlihat oleh publik.
                  </p>
                </div>

                {/* Section Aftersales Kanban */}
                <div className="p-4 bg-gp-ink-800/50 border border-gp-ink-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>Section Aftersales & Garansi Brand Kanban</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homepageForm.sectionVisibility.showAftersales !== false}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            sectionVisibility: { ...homepageForm.sectionVisibility, showAftersales: e.target.checked },
                          })
                        }
                        className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                      />
                      <span className="text-gp-ink-200">Tampilkan</span>
                    </label>
                  </div>
                  <p className="text-xs text-gp-ink-400">Menampilkan Kanban Board evaluasi klaim garansi RMA brand monitor di Indonesia.</p>
                </div>

                {/* Section FAQ & QnA */}
                <div className="p-4 bg-gp-ink-800/50 border border-gp-ink-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      <span>Section Pertanyaan Umum (FAQ & QnA)</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homepageForm.sectionVisibility.showFaq !== false}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            sectionVisibility: { ...homepageForm.sectionVisibility, showFaq: e.target.checked },
                          })
                        }
                        className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                      />
                      <span className="text-gp-ink-200">Tampilkan</span>
                    </label>
                  </div>
                  <p className="text-xs text-gp-ink-400">Menampilkan list jawaban FAQ seputar build quality, overdrive, dan panel.</p>
                </div>

                {/* Section Edukasi & Guides */}
                <div className="p-4 bg-gp-ink-800/50 border border-gp-ink-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>Section Edukasi & Panduan (Desk / HDR / GrayNotes / Bandwidth)</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homepageForm.sectionVisibility.showGuides !== false}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            sectionVisibility: { ...homepageForm.sectionVisibility, showGuides: e.target.checked },
                          })
                        }
                        className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                      />
                      <span className="text-gp-ink-200">Tampilkan</span>
                    </label>
                  </div>
                  <p className="text-xs text-gp-ink-400">Mengontrol visibilitas subpage edukasi teknis monitor dan ergonomi meja.</p>
                </div>

                {/* Section Konsultasi & Kontak */}
                <div className="p-4 bg-gp-ink-800/50 border border-gp-ink-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-emerald-400" />
                      <span>Section Konsultasi Langsung & Dukungan Donasi</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homepageForm.sectionVisibility.showConsultation !== false}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            sectionVisibility: { ...homepageForm.sectionVisibility, showConsultation: e.target.checked },
                          })
                        }
                        className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                      />
                      <span className="text-gp-ink-200">Tampilkan</span>
                    </label>
                  </div>
                  <p className="text-xs text-gp-ink-400">Menampilkan opsi konsultasi WhatsApp/Discord dan Saweria/QRIS apresiasi penulis.</p>
                </div>

                {/* Section Form Feedback & Saran */}
                <div className="p-4 bg-gp-ink-800/50 border border-gp-ink-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-orange-400" />
                      <span>Section Form Kritik & Saran / Request Monitor</span>
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homepageForm.sectionVisibility.showFeedback !== false}
                        onChange={(e) =>
                          setHomepageForm({
                            ...homepageForm,
                            sectionVisibility: { ...homepageForm.sectionVisibility, showFeedback: e.target.checked },
                          })
                        }
                        className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                      />
                      <span className="text-gp-ink-200">Tampilkan</span>
                    </label>
                  </div>
                  <p className="text-xs text-gp-ink-400">Menampilkan tautan Google Form masukan publik dan request pengetesan monitor.</p>
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
            <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-5 space-y-4 text-xs">
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
                    className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                  />
                  <span className="text-gp-ink-200">Aktifkan Pengumuman</span>
                </label>
              </div>

              <div>
                <label className="text-gp-ink-300 block mb-1 font-semibold">Teks Pengumuman</label>
                <input
                  type="text"
                  value={settingsForm.announcement.text}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      announcement: { ...settingsForm.announcement, text: e.target.value },
                    })
                  }
                  className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gp-ink-300 block mb-1 font-semibold">Teks Link Tombol</label>
                  <input
                    type="text"
                    value={settingsForm.announcement.linkText || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcement: { ...settingsForm.announcement, linkText: e.target.value },
                      })
                    }
                    className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gp-ink-300 block mb-1 font-semibold">URL Tujuan</label>
                  <input
                    type="text"
                    value={settingsForm.announcement.linkUrl || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcement: { ...settingsForm.announcement, linkUrl: e.target.value },
                      })
                    }
                    className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-white"
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
            <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-5 space-y-4 text-xs">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kontak Konsultasi & Donasi</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gp-ink-300 block mb-1 font-semibold">WhatsApp Support</label>
                  <input
                    type="text"
                    value={settingsForm.consultation.whatsapp}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        consultation: { ...settingsForm.consultation, whatsapp: e.target.value },
                      })
                    }
                    className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-gp-ink-300 block mb-1 font-semibold">Link Server Discord</label>
                  <input
                    type="text"
                    value={settingsForm.consultation.discordUrl}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        consultation: { ...settingsForm.consultation, discordUrl: e.target.value },
                      })
                    }
                    className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-gp-ink-300 block mb-1 font-semibold">Gambar QRIS Donasi Dukungan</label>
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
                    className="flex-1 bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                  <label className="px-3 py-2 rounded-xl bg-gp-ink-700 hover:bg-gp-ink-600 text-xs text-gp-ink-100 font-bold cursor-pointer flex items-center gap-1.5">
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
          <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-5 space-y-4 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Identitas Brand GrayPlasma</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-gp-ink-300 block mb-1 font-semibold">Nama Brand</label>
                <input
                  type="text"
                  value={settingsForm.brandName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                  className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="text-gp-ink-300 block mb-1 font-semibold">Tagline Website</label>
                <input
                  type="text"
                  value={settingsForm.brandTagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandTagline: e.target.value })}
                  className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-gp-ink-300 block mb-1 font-semibold">Teks Hak Cipta Footer</label>
              <input
                type="text"
                value={settingsForm.copyrightText}
                onChange={(e) => setSettingsForm({ ...settingsForm, copyrightText: e.target.value })}
                className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-2 text-gp-ink-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SUBPAGE CARD EDIT MODAL                                                   */}
      {/* ========================================================================= */}
      {isCardModalOpen && editingCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-gp-ink-900 border border-gp-ink-600/80 rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gp-ink-700 bg-gp-ink-850 flex-shrink-0">
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
                className="p-1 rounded-lg text-gp-ink-300 hover:text-white hover:bg-gp-ink-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                <div className="grid grid-cols-4 gap-2.5">
                  <div className="col-span-1">
                    <label className="text-gp-ink-200 block mb-1 font-semibold">Icon</label>
                    <input
                      type="text"
                      value={editingCard.icon}
                      onChange={(e) => setEditingCard({ ...editingCard, icon: e.target.value })}
                      className="w-full text-center text-lg bg-gp-ink-850 border border-gp-ink-600 rounded-xl p-2 text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-gp-ink-200 block mb-1 font-semibold">Judul Kartu</label>
                    <input
                      type="text"
                      required
                      value={editingCard.title}
                      onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-white font-bold focus:border-emerald-400 focus:outline-none placeholder:text-gp-ink-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gp-ink-200 block mb-1 font-semibold">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    required
                    value={editingCard.desc}
                    onChange={(e) => setEditingCard({ ...editingCard, desc: e.target.value })}
                    className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl p-3 text-gp-ink-100 focus:border-emerald-400 focus:outline-none placeholder:text-gp-ink-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gp-ink-200 block mb-1 font-semibold">Path Rute (/guide/...)</label>
                    <input
                      type="text"
                      required
                      value={editingCard.path}
                      onChange={(e) => setEditingCard({ ...editingCard, path: e.target.value })}
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-emerald-400 font-mono focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gp-ink-200 block mb-1 font-semibold">Grup Kategori</label>
                    <select
                      value={editingCard.groupTitle}
                      onChange={(e) => setEditingCard({ ...editingCard, groupTitle: e.target.value })}
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="1. EVALUASI BRAND & AFTERSALES (OEM / ODM LIST)">1. Evaluasi Brand & Aftersales</option>
                      <option value="2. GLOSARIUM & PANDUAN KALIBRASI WARNA (GRAYPLASMA)">2. Glosarium & Kalibrasi</option>
                      <option value="3. QNA & GRAYNOTES (PERTANYAAN SERING DIAJUKAN)">3. QnA & GrayNotes</option>
                      <option value="4. SETUP MEJA, AUTHOR & CONSULTATION">4. Setup Meja & Support</option>
                      <option value="Custom Lainnya">Custom Lainnya</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fixed Footer Actions */}
              <div className="flex items-center justify-between px-6 py-3.5 border-t border-gp-ink-700 bg-gp-ink-950 flex-shrink-0">
                <label className="flex items-center gap-2 cursor-pointer text-gp-ink-200">
                  <input
                    type="checkbox"
                    checked={editingCard.isVisible}
                    onChange={(e) => setEditingCard({ ...editingCard, isVisible: e.target.checked })}
                    className="rounded border-gp-ink-500 bg-gp-ink-700 text-emerald-500 focus:ring-0"
                  />
                  <span className="text-xs font-semibold">Tampilkan di Beranda</span>
                </label>

                <div className="flex items-center gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsCardModalOpen(false);
                      setEditingCard(null);
                    }}
                    className="border-gp-ink-600 text-gp-ink-200 hover:text-white hover:bg-gp-ink-700"
                  >
                    Batal
                  </Button>
                  <Button type="submit" variant="cyber" size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold">
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
