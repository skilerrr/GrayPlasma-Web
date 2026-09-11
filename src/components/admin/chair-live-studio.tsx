"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Search,
  ExternalLink,
  Sparkles,
  Eye,
  EyeOff,
  Edit2,
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
  Activity,
  Layers,
  SlidersHorizontal,
  Info,
  Check,
  X,
} from "lucide-react";
import { ChairItem } from "@/data/grayplasma-desk-peripherals";
import { DatabaseService, HomepageSettings } from "@/lib/db-service";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChairLiveStudioProps {
  chairs: ChairItem[];
  onUpdateChairs: (newChairs: ChairItem[]) => void;
  homepageSettings: HomepageSettings;
  onUpdateHomepageSettings: (newSettings: HomepageSettings) => void;
}

const CHAIR_CATEGORIES: ChairItem["category"][] = [
  "Ergonomic Full Mesh",
  "Ergonomic Fabric",
  "Gaming Ergonomic",
  "Office Mid-Back",
  "Lainnya",
];

export function ChairLiveStudio({
  chairs,
  onUpdateChairs,
  homepageSettings,
  onUpdateHomepageSettings,
}: ChairLiveStudioProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [notice, setNotice] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChair, setEditingChair] = useState<ChairItem | null>(null);

  // Master Public Visibility State
  const isMasterLive = Boolean(homepageSettings.sectionVisibility?.showChairs);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Toggle Master Public Visibility Switch
  const handleToggleMasterVisibility = async () => {
    const newStatus = !isMasterLive;
    const updatedSettings: HomepageSettings = {
      ...homepageSettings,
      sectionVisibility: {
        ...homepageSettings.sectionVisibility,
        showChairs: newStatus,
      },
    };

    const saved = await DatabaseService.saveHomepageSettings(updatedSettings);
    onUpdateHomepageSettings(saved);
    showNotice(
      newStatus
        ? "🟢 KATALOG KURSI TELAH LIVE DI PUBLIK! Pengunjung sekarang dapat melihat tab Kursi di beranda."
        : "🟡 KATALOG KURSI MASUK MODE STAGING (DISEMBUNYIKAN DARI PUBLIK). Pengunjung tidak akan melihat tab Kursi."
    );
  };

  // 1-Click Quick Toggle Publish per Chair
  const handleToggleChairPublish = async (chair: ChairItem) => {
    const newStatus = chair.isPublished === false ? true : false;
    const updatedChair: ChairItem = {
      ...chair,
      isPublished: newStatus,
    };

    const updatedList = await DatabaseService.saveChair(updatedChair);
    onUpdateChairs(updatedList);
    showNotice(
      newStatus
        ? `Kursi "${chair.name}" siap terbit (Status: Live).`
        : `Kursi "${chair.name}" masuk draft (Status: Staging / Hide).`
    );
  };

  // Delete Chair
  const handleDeleteChair = async (id: string, name: string) => {
    if (window.confirm(`Hapus rekomendasi kursi "${name}" dari database?`)) {
      const updatedList = await DatabaseService.deleteChair(id);
      onUpdateChairs(updatedList);
      showNotice(`Kursi "${name}" berhasil dihapus.`);
    }
  };

  // Reset to Default Template
  const handleResetDefault = () => {
    if (window.confirm("Reset seluruh katalog kursi ke template rekomendasi bawaan GrayPlasma?")) {
      const reset = DatabaseService.resetChairsToDefault();
      onUpdateChairs(reset);
      showNotice("Katalog kursi berhasil direset ke template bawaan.");
    }
  };

  // Open Create Modal
  const handleStartCreate = () => {
    setEditingChair({
      id: `chair-${Date.now()}`,
      name: "",
      brand: "",
      category: "Ergonomic Full Mesh",
      price: 2500000,
      lumbarSupport: "Dynamic 3D Auto-Tuning Lumbar Support",
      armrest: "3D Adjustable (Up-Down, Forward-Back, Pivot)",
      mechanism: "Multi-Lock Synchronous Tilt 90°-135°",
      gasLift: "Class 4 TÜV & BIFMA Certified",
      material: "High Elastic Breathable Mesh",
      recommendedHeight: "160 cm - 185 cm",
      maxWeightCapacity: "125 kg",
      warranty: "2 Tahun Garansi Resmi Mekanisme",
      verdict: "Kelebihan & analisis teknis GrayPlasma...",
      notes: "Catatan ergonomi...",
      shopeeUrl: "",
      tokopediaUrl: "",
      isPublished: false, // Default staging
      order: chairs.length + 1,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleStartEdit = (chair: ChairItem) => {
    setEditingChair({ ...chair });
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChair) return;

    const updatedList = await DatabaseService.saveChair(editingChair);
    onUpdateChairs(updatedList);
    setIsModalOpen(false);
    setEditingChair(null);
    showNotice(`Rekomendasi kursi "${editingChair.name}" berhasil disimpan.`);
  };

  // Filtered Chairs
  const filteredChairs = chairs.filter((chair) => {
    const matchesCategory = categoryFilter === "all" || chair.category === categoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      `${chair.name} ${chair.brand} ${chair.material} ${chair.verdict}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 shadow-2xl animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0c0c11] border border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
            <span>🪑</span>
            <span>ERGONOMIC & GAMING CHAIR STUDIO (Q2 2027)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            Manajemen & Kurasi Kursi Ergonomis
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Susun dan cicil riset ulasan kursi ergonomis dari sekarang dalam mode staging aman. Atur mekanisme lumbar, armrest 3D/4D, gas lift Class 4, dan status publikasi per item.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Master Public Toggle Button */}
          <button
            type="button"
            onClick={handleToggleMasterVisibility}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all shadow-sm ${
              isMasterLive
                ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/25"
                : "bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25"
            }`}
            title="Klik untuk mengubah status visibilitas katalog kursi di halaman publik"
          >
            {isMasterLive ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Publik: LIVE (Aktif di Web)</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Publik: STAGING (Tersembunyi)</span>
              </>
            )}
          </button>

          <Button
            variant="cyber"
            size="sm"
            onClick={handleStartCreate}
            className="text-xs font-bold font-mono flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>[ TAMBAH KURSI ]</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefault}
            className="text-xs text-zinc-400 hover:text-white border-zinc-800"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Reset Default</span>
          </Button>
        </div>
      </div>

      {/* Master Staging Status Banner */}
      <div
        className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isMasterLive
            ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
            : "bg-amber-950/30 border-amber-500/40 text-amber-200"
        }`}
      >
        <div className="flex items-start gap-2.5">
          <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isMasterLive ? "text-emerald-400" : "text-amber-400"}`} />
          <div className="space-y-0.5">
            <span className="font-black uppercase tracking-wider block text-[11px]">
              {isMasterLive ? "Status Katalog: Terbuka untuk Publik (Live)" : "Status Katalog: Mode Staging Aman (Tersembunyi dari Publik)"}
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {isMasterLive
                ? "Pengunjung website saat ini DAPAT melihat tab 'Kursi Ergonomis & Gaming' di seksi Setup Meja & Peripherals."
                : "Pengunjung website saat ini TIDAK DAPAT melihat tab 'Kursi'. Anda bebas mencicil input data ulasan dan link toko dari sekarang menjelang peluncuran resmi Q2 2027."}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleMasterVisibility}
          className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] border whitespace-nowrap transition-colors ${
            isMasterLive
              ? "bg-emerald-500 text-black border-emerald-400 hover:bg-emerald-400"
              : "bg-amber-500 text-black border-amber-400 hover:bg-amber-400"
          }`}
        >
          {isMasterLive ? "Ubah ke Mode Staging (Hide)" : "Buka ke Publik Sekarang (Live)"}
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kursi, brand, atau bahan..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
              categoryFilter === "all"
                ? "bg-zinc-800 text-white border border-zinc-700"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
            }`}
          >
            Semua ({chairs.length})
          </button>
          {CHAIR_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/40 font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Chairs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChairs.map((chair) => {
          const isItemLive = chair.isPublished !== false;
          return (
            <div
              key={chair.id}
              className={`bg-zinc-950 border rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all ${
                !isItemLive
                  ? "border-amber-500/30 opacity-80 bg-zinc-950/60"
                  : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-cyan-400 border border-zinc-800 font-mono font-bold uppercase">
                        {chair.category}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono">
                        {chair.brand}
                      </span>

                      {/* 1-Click Status Pill */}
                      <button
                        type="button"
                        onClick={() => handleToggleChairPublish(chair)}
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 border transition-colors ${
                          isItemLive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                        }`}
                        title={
                          isItemLive
                            ? "Klik untuk sembunyikan kursi ini ke Mode Staging/Draft"
                            : "Klik untuk aktifkan kursi ini (Publish)"
                        }
                      >
                        {isItemLive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{isItemLive ? "Live" : "Draft / Staging"}</span>
                      </button>
                    </div>

                    <h3 className="text-base font-black text-white">{chair.name}</h3>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-400 font-mono">
                      {formatRupiah(chair.price)}
                    </div>
                  </div>
                </div>

                {/* Specs Technical Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-mono font-bold">Lumbar Support:</span>
                    <span className="text-zinc-200 font-medium text-[11px] line-clamp-1" title={chair.lumbarSupport}>
                      {chair.lumbarSupport}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-mono font-bold">Armrest:</span>
                    <span className="text-zinc-200 font-medium text-[11px] line-clamp-1" title={chair.armrest}>
                      {chair.armrest}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-mono font-bold">Gas Lift & Mekanisme:</span>
                    <span className="text-zinc-200 font-medium text-[11px] line-clamp-1" title={`${chair.gasLift} | ${chair.mechanism}`}>
                      {chair.gasLift}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-mono font-bold">Beban & Tinggi User:</span>
                    <span className="text-zinc-200 font-medium text-[11px]">
                      {chair.maxWeightCapacity} ({chair.recommendedHeight})
                    </span>
                  </div>
                </div>

                {/* Verdict Box */}
                {chair.verdict && (
                  <div className="text-xs text-zinc-300 bg-cyan-950/20 border border-cyan-500/20 p-3 rounded-xl leading-relaxed">
                    <span className="text-cyan-400 font-mono font-bold text-[10px] block uppercase mb-0.5">
                      Verdict GrayPlasma:
                    </span>
                    <p className="text-[11px] text-zinc-300">{chair.verdict}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-850">
                <div className="flex items-center gap-2 text-[11px]">
                  {chair.shopeeUrl && (
                    <a
                      href={chair.shopeeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-colors flex items-center gap-1 font-mono text-[10px]"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Shopee</span>
                    </a>
                  )}
                  {chair.tokopediaUrl && (
                    <a
                      href={chair.tokopediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors flex items-center gap-1 font-mono text-[10px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Tokopedia</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Quick Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleChairPublish(chair)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isItemLive
                        ? "bg-zinc-900 border-zinc-800 hover:bg-amber-950/40 text-zinc-400 hover:text-amber-400"
                        : "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-emerald-500/20 hover:text-emerald-300"
                    }`}
                    title={isItemLive ? "Sembunyikan ke Staging" : "Terbitkan ke Live"}
                  >
                    {isItemLive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleStartEdit(chair)}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-cyan-400"
                    title="Edit Spesifikasi Kursi"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteChair(chair.id, chair.name)}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-rose-400"
                    title="Hapus Kursi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingChair && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-[#0f0f14] border border-zinc-700/80 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Fixed Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#121217] flex-shrink-0">
              <h3 className="text-base font-bold text-white uppercase tracking-tight">
                {chairs.some((c) => c.id === editingChair.id)
                  ? "Edit Rekomendasi Kursi Ergonomis"
                  : "Tambah Rekomendasi Kursi Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form with Scrollable Body & Fixed Footer */}
            <form onSubmit={handleSaveModal} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                {/* Row 1: Nama & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Nama Kursi / Tipe Lengkap</label>
                    <input
                      type="text"
                      required
                      value={editingChair.name}
                      onChange={(e) => setEditingChair({ ...editingChair, name: e.target.value })}
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white font-bold focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Brand Pabrikan</label>
                    <input
                      type="text"
                      required
                      value={editingChair.brand}
                      onChange={(e) => setEditingChair({ ...editingChair, brand: e.target.value })}
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                {/* Row 2: Kategori & Harga */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Kategori Kursi</label>
                    <select
                      value={editingChair.category}
                      onChange={(e) =>
                        setEditingChair({
                          ...editingChair,
                          category: e.target.value as ChairItem["category"],
                        })
                      }
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                    >
                      {CHAIR_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Estimasi Harga (IDR)</label>
                    <input
                      type="number"
                      required
                      value={editingChair.price}
                      onChange={(e) => setEditingChair({ ...editingChair, price: Number(e.target.value) })}
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Row 3: Lumbar Support & Armrest */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Mekanisme Lumbar Support</label>
                    <input
                      type="text"
                      required
                      value={editingChair.lumbarSupport}
                      onChange={(e) => setEditingChair({ ...editingChair, lumbarSupport: e.target.value })}
                      placeholder="Contoh: Dynamic Self-Adaptive 3D Lumbar"
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Tipe Armrest</label>
                    <input
                      type="text"
                      required
                      value={editingChair.armrest}
                      onChange={(e) => setEditingChair({ ...editingChair, armrest: e.target.value })}
                      placeholder="Contoh: 3D Adjustable / Flip-Up 90°"
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                {/* Row 4: Recline Mechanism & Gas Lift */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Mekanisme Recline / Tilt</label>
                    <input
                      type="text"
                      required
                      value={editingChair.mechanism}
                      onChange={(e) => setEditingChair({ ...editingChair, mechanism: e.target.value })}
                      placeholder="Contoh: Multi-Lock Synchro Tilt 110°-138°"
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Kelas Gas Lift Hidrolik</label>
                    <input
                      type="text"
                      required
                      value={editingChair.gasLift}
                      onChange={(e) => setEditingChair({ ...editingChair, gasLift: e.target.value })}
                      placeholder="Contoh: Class 4 TÜV Certified / Class 3"
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                {/* Row 5: Bahan & Batas Beban */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Bahan Dudukan / Sandaran</label>
                    <input
                      type="text"
                      value={editingChair.material}
                      onChange={(e) => setEditingChair({ ...editingChair, material: e.target.value })}
                      placeholder="Contoh: High Elastic Wintex Mesh"
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Tinggi Badan Ideal</label>
                    <input
                      type="text"
                      value={editingChair.recommendedHeight}
                      onChange={(e) => setEditingChair({ ...editingChair, recommendedHeight: e.target.value })}
                      placeholder="Contoh: 160 cm - 185 cm"
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Beban Maksimal</label>
                    <input
                      type="text"
                      value={editingChair.maxWeightCapacity}
                      onChange={(e) => setEditingChair({ ...editingChair, maxWeightCapacity: e.target.value })}
                      placeholder="Contoh: 130 kg"
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                {/* Row 6: Garansi & Link Belanja */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Garansi Resmi</label>
                    <input
                      type="text"
                      value={editingChair.warranty}
                      onChange={(e) => setEditingChair({ ...editingChair, warranty: e.target.value })}
                      placeholder="Contoh: 2 Tahun Sparepart & Hidrolik"
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Link Shopee</label>
                    <input
                      type="url"
                      value={editingChair.shopeeUrl || ""}
                      onChange={(e) => setEditingChair({ ...editingChair, shopeeUrl: e.target.value })}
                      placeholder="https://shopee.co.id/..."
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Link Tokopedia</label>
                    <input
                      type="url"
                      value={editingChair.tokopediaUrl || ""}
                      onChange={(e) => setEditingChair({ ...editingChair, tokopediaUrl: e.target.value })}
                      placeholder="https://tokopedia.com/..."
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                {/* Row 7: Verdict & Catatan Teknis */}
                <div>
                  <label className="text-zinc-300 block mb-1 font-semibold">Verdict & Ulasan Ahli GrayPlasma</label>
                  <textarea
                    rows={2}
                    value={editingChair.verdict}
                    onChange={(e) => setEditingChair({ ...editingChair, verdict: e.target.value })}
                    placeholder="Kelebihan utama dan pertimbangan sebelum membeli..."
                    className="w-full bg-[#14141c] border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 leading-relaxed placeholder:text-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-semibold">Catatan Tambahan (Kelemahan / Adaptasi)</label>
                  <textarea
                    rows={2}
                    value={editingChair.notes}
                    onChange={(e) => setEditingChair({ ...editingChair, notes: e.target.value })}
                    placeholder="Misal: Dudukan mesh agak keras di awal, butuh waktu adaptasi..."
                    className="w-full bg-[#14141c] border border-zinc-700 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-cyan-400 leading-relaxed placeholder:text-zinc-500"
                  />
                </div>

                {/* Status Publish Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-[#14141c] border border-zinc-700 p-3 rounded-xl">
                    <input
                      type="checkbox"
                      checked={editingChair.isPublished !== false}
                      onChange={(e) => setEditingChair({ ...editingChair, isPublished: e.target.checked })}
                      className="rounded border-zinc-600 bg-zinc-800 text-cyan-500 focus:ring-cyan-500 w-4 h-4"
                    />
                    <div>
                      <span className="text-white text-xs font-bold block">Status: Siap Terbit (Live)</span>
                      <span className="text-zinc-400 text-[11px]">
                        Jika tidak dicentang, kursi ini tetap tersimpan di database sebagai Mode Staging (Draft).
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Fixed Footer Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-zinc-800 bg-[#0a0a0e] flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="cyber"
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Rekomendasi Kursi</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
