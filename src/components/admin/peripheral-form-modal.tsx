"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Sparkles, ExternalLink, Tag, DollarSign, Layers, ShieldCheck, HelpCircle, Wrench } from "lucide-react";
import { PeripheralItem } from "@/data/grayplasma-desk-peripherals";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";

interface PeripheralFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PeripheralItem) => void;
  initialData?: PeripheralItem | null;
}

const COMMON_CATEGORIES = [
  "Monitor Arm",
  "Bracket & Mount",
  "Kabel HDMI / DP",
  "Screenbar & Lampu",
  "Cable Management & Tray",
  "Audio Stand & Aksesoris",
  "Lainnya",
];

export function PeripheralFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: PeripheralFormModalProps) {
  const [formData, setFormData] = useState<PeripheralItem>({
    id: "",
    name: "",
    category: "Monitor Arm",
    price: 200000,
    brand: "",
    type: "Gas Spring Arm",
    warranty: "1 Tahun Resmi",
    verdict: "",
    notes: "",
    shopeeUrl: "",
    tokopediaUrl: "",
    tiktokUrl: "",
    recommendedFor: "",
    isPublished: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        isPublished: initialData.isPublished !== undefined ? initialData.isPublished : true,
        tokopediaUrl: initialData.tokopediaUrl || "",
        tiktokUrl: initialData.tiktokUrl || "",
      });
    } else {
      setFormData({
        id: `periph-${Date.now()}`,
        name: "",
        category: "Monitor Arm",
        price: 200000,
        brand: "",
        type: "Gas Spring Arm",
        warranty: "1 Tahun Resmi",
        verdict: "",
        notes: "",
        shopeeUrl: "",
        tokopediaUrl: "",
        tiktokUrl: "",
        recommendedFor: "",
        isPublished: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Nama aksesoris wajib diisi!");
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-hidden">
      <div className="relative w-full max-w-2xl bg-gp-ink-900 border border-gp-ink-600/80 rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gp-ink-700 bg-gp-ink-850 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-hue-cyan-500/10 border border-hue-cyan-500/30 text-hue-cyan-400">
              <Wrench className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {initialData ? "Edit Data Aksesoris / Peripherals" : "Tambah Aksesoris Baru"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gp-ink-300 hover:text-white hover:bg-gp-ink-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form with Scrollable Body & Fixed Footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {/* Status Visibility Toggle */}
            <div className="p-3.5 rounded-xl bg-gp-ink-800/90 border border-gp-ink-700 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Status Visibilitas Produk</span>
                <p className="text-2xs text-gp-ink-300">
                  {formData.isPublished !== false
                    ? "Produk ini AKTIF dan akan langsung tampil di website publik."
                    : "Produk ini NONAKTIF (Draft/Maintenance), hanya bisa dilihat di admin."}
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isPublished !== false}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded border-gp-ink-600 bg-gp-ink-950 text-hue-emerald-500 accent-hue-emerald-500 w-4 h-4"
                />
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    formData.isPublished !== false
                      ? "bg-hue-emerald-500/20 text-hue-emerald-400 border border-hue-emerald-500/40"
                      : "bg-gp-ink-700 text-gp-ink-300 border border-gp-ink-600"
                  }`}
                >
                  {formData.isPublished !== false ? "LIVE (AKTIF)" : "DRAFT (NONAKTIF)"}
                </span>
              </label>
            </div>

            {/* Row 1: Name & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gp-ink-200 block">
                  Nama Aksesoris *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: North Bayou NB F80 Gas Spring"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gp-ink-850 border border-gp-ink-600 text-white text-xs focus:border-hue-cyan-400 focus:outline-none placeholder:text-gp-ink-400 transition-colors font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gp-ink-200 block">
                  Brand / Produsen
                </label>
                <input
                  type="text"
                  value={formData.brand || ""}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Contoh: North Bayou, Baseus, Oximus"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gp-ink-850 border border-gp-ink-600 text-white text-xs focus:border-hue-cyan-400 focus:outline-none placeholder:text-gp-ink-400 transition-colors"
                />
              </div>
            </div>

            {/* Row 2: Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gp-ink-200 block">
                  Kategori Aksesoris
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gp-ink-850 border border-gp-ink-600 text-white text-xs focus:border-hue-cyan-400 focus:outline-none transition-colors"
                >
                  {COMMON_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gp-ink-200 flex items-center justify-between">
                  <span>Harga Estimasi</span>
                  <span className="text-hue-emerald-400 font-mono font-semibold">
                    {formatRupiah(formData.price || 0)}
                  </span>
                </label>
                <input
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gp-ink-850 border border-gp-ink-600 text-white text-xs font-mono focus:border-hue-cyan-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 3: Verdict GrayPlasma / Kurasi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gp-ink-200 block">
                Verdict Kurasi & Catatan Kualitas
              </label>
              <textarea
                rows={2}
                value={formData.verdict || ""}
                onChange={(e) => setFormData({ ...formData, verdict: e.target.value })}
                placeholder="Contoh: Best budget arm 180rb-an. Per gas spring responsif untuk monitor sampai 9kg."
                className="w-full px-3.5 py-2.5 rounded-xl bg-gp-ink-850 border border-gp-ink-600 text-white text-xs focus:border-hue-cyan-400 focus:outline-none placeholder:text-gp-ink-400 transition-colors"
              />
            </div>

            {/* Row 4: Recommended For */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gp-ink-200 block">
                Rekomendasi Skenario Pemakaian
              </label>
              <input
                type="text"
                value={formData.recommendedFor || ""}
                onChange={(e) => setFormData({ ...formData, recommendedFor: e.target.value })}
                placeholder="Contoh: Monitor 24-27 inci, ketebalan daun meja 2-8cm"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gp-ink-850 border border-gp-ink-600 text-white text-xs focus:border-hue-cyan-400 focus:outline-none placeholder:text-gp-ink-400 transition-colors"
              />
            </div>

            {/* Row 5: Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gp-ink-200 block">
                Catatan Teknis Tambahan
              </label>
              <input
                type="text"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Contoh: Termasuk bracket VESA 75x75 & 100x100"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gp-ink-850 border border-gp-ink-600 text-white text-xs focus:border-hue-cyan-400 focus:outline-none placeholder:text-gp-ink-400 transition-colors"
              />
            </div>

            {/* Row 6: Marketplace Links (Shopee, Tokopedia, TikTok) */}
            <div className="space-y-2 p-3.5 rounded-xl bg-gp-ink-950/60 border border-gp-ink-700/80">
              <label className="text-xs font-bold text-gp-ink-200 block">
                Link Pembelian Marketplace
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-3xs font-mono font-bold text-brand-shopee flex items-center gap-1">
                    Shopee URL
                  </span>
                  <input
                    type="url"
                    value={formData.shopeeUrl || ""}
                    onChange={(e) => setFormData({ ...formData, shopeeUrl: e.target.value })}
                    placeholder="https://s.shopee.co.id/..."
                    className="w-full px-3 py-2 rounded-lg bg-gp-ink-850 border border-gp-ink-600 text-white text-2xs focus:border-brand-shopee focus:outline-none placeholder:text-gp-ink-500 transition-colors font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-3xs font-mono font-bold text-hue-emerald-400 flex items-center gap-1">
                    Tokopedia URL
                  </span>
                  <input
                    type="url"
                    value={formData.tokopediaUrl || ""}
                    onChange={(e) => setFormData({ ...formData, tokopediaUrl: e.target.value })}
                    placeholder="https://tk.tokopedia.com/..."
                    className="w-full px-3 py-2 rounded-lg bg-gp-ink-850 border border-gp-ink-600 text-white text-2xs focus:border-hue-emerald-400 focus:outline-none placeholder:text-gp-ink-500 transition-colors font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-3xs font-mono font-bold text-hue-cyan-400 flex items-center gap-1">
                    TikTok Shop URL
                  </span>
                  <input
                    type="url"
                    value={formData.tiktokUrl || ""}
                    onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                    placeholder="https://vt.tiktok.com/..."
                    className="w-full px-3 py-2 rounded-lg bg-gp-ink-850 border border-gp-ink-600 text-white text-2xs focus:border-hue-cyan-400 focus:outline-none placeholder:text-gp-ink-500 transition-colors font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer Actions */}
          <div className="px-6 py-3.5 border-t border-gp-ink-700 bg-gp-ink-950 flex items-center justify-end gap-3 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-gp-ink-600 text-gp-ink-200 hover:text-white hover:bg-gp-ink-700"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="cyber"
              size="sm"
              className="bg-hue-emerald-500 hover:bg-hue-emerald-400 text-black font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Aksesoris</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
