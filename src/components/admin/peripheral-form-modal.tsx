"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Sparkles, ExternalLink, Tag, DollarSign, Layers, ShieldCheck, HelpCircle } from "lucide-react";
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
  "Monitor Arm Gas Spring",
  "Dual Monitor Arm",
  "Screenbar Lightbar",
  "Cable Management & Tray",
  "Desk Mat & Wrist Rest",
  "Speaker & Audio Stand",
  "Hub & Docking Station",
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
    category: "Monitor Arm Gas Spring",
    price: 200000,
    brand: "",
    type: "Monitor Arm",
    warranty: "1 Tahun Resmi",
    verdict: "",
    notes: "",
    shopeeUrl: "",
    recommendedFor: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: `periph-${Date.now()}`,
        name: "",
        category: "Monitor Arm Gas Spring",
        price: 200000,
        brand: "",
        type: "Monitor Arm",
        warranty: "1 Tahun Resmi",
        verdict: "",
        notes: "",
        shopeeUrl: "",
        recommendedFor: "",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0d0d11] border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-300 my-8">
        {/* HUD Top Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-bold tracking-wider">
              [SYS//PERIPHERAL_EDITOR]
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {initialData ? "Edit Data Aksesoris / Peripherals" : "Tambah Aksesoris Baru"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Nama Aksesoris *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: North Bayou NB F80 Gas Spring"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Brand / Produsen
              </label>
              <input
                type="text"
                value={formData.brand || ""}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Contoh: North Bayou, Baseus, Oximus"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Kategori Aksesoris
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
              >
                {COMMON_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Harga Estimasi</span>
                <span className="text-emerald-400 font-normal">
                  {formatRupiah(formData.price || 0)}
                </span>
              </label>
              <input
                type="number"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Verdict GTID / Kurasi */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Verdict Kurasi & Catatan Kualitas
            </label>
            <textarea
              rows={2}
              value={formData.verdict || ""}
              onChange={(e) => setFormData({ ...formData, verdict: e.target.value })}
              placeholder="Contoh: Best budget arm 180rb-an. Per gas spring responsif untuk monitor sampai 9kg."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Row 4: Recommended For */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Rekomendasi Skenario Pemakaian
            </label>
            <input
              type="text"
              value={formData.recommendedFor || ""}
              onChange={(e) => setFormData({ ...formData, recommendedFor: e.target.value })}
              placeholder="Contoh: Monitor 24-27 inci, ketebalan daun meja 2-8cm"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Row 5: Notes & Marketplace Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Catatan Teknis Tambahan
              </label>
              <input
                type="text"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Contoh: Termasuk bracket VESA 75x75 & 100x100"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Link Marketplace (Shopee / Tokopedia)
              </label>
              <input
                type="url"
                value={formData.shopeeUrl || ""}
                onChange={(e) => setFormData({ ...formData, shopeeUrl: e.target.value })}
                placeholder="https://shopee.co.id/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white text-xs focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold font-mono tracking-wider flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>[SIMPAN_AKSESORIS]</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
