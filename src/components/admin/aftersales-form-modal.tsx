"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldAlert } from "lucide-react";
import { AftersalesBrand } from "@/data/grayplasma-content";
import { Button } from "@/components/ui/button";

interface AftersalesFormModalProps {
  brand: AftersalesBrand | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (brand: AftersalesBrand) => void;
}

export function AftersalesFormModal({
  brand,
  isOpen,
  onClose,
  onSave,
}: AftersalesFormModalProps) {
  const [formData, setFormData] = useState<AftersalesBrand>({
    brand: "",
    rating: "A",
    distributor: "",
    warrantyPeriod: "3 Tahun",
    summary: "",
    status: "Bagus & Aman",
    points: [""],
    contactUrl: "",
    claimSystem: "",
  });

  useEffect(() => {
    if (brand) {
      setFormData(brand);
    } else {
      setFormData({
        brand: "",
        rating: "A",
        distributor: "",
        warrantyPeriod: "3 Tahun",
        summary: "Layanan aftersales terpercaya di Indonesia.",
        status: "Bagus & Aman",
        points: ["Klaim resmi di service center"],
        contactUrl: "",
        claimSystem: "SERVICE & GANTI PART",
      });
    }
  }, [brand, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand) {
      alert("Mohon isi nama Brand.");
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-gp-ink-900 border border-gp-ink-600/80 rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gp-ink-700 bg-gp-ink-850 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              {brand ? "Edit Aftersales Brand" : "Tambah Aftersales Brand"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gp-ink-300 hover:text-white hover:bg-gp-ink-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form with Scrollable Body & Fixed Footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gp-ink-200 block mb-1 font-semibold">Nama Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Contoh: ASUS, Dell, Xiaomi"
                  className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none placeholder:text-gp-ink-400 font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-gp-ink-200 block mb-1 font-semibold">Tier Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value as AftersalesBrand["rating"] })}
                  className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-bold"
                >
                  <option value="S">Tier S (Onsite / Terbaik)</option>
                  <option value="A">Tier A (Bagus & Aman)</option>
                  <option value="B">Tier B (Standar)</option>
                  <option value="WARNING">Tier WARNING (Lama / Inden)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gp-ink-200 block mb-1 font-semibold">Distributor Resmi</label>
                <input
                  type="text"
                  value={formData.distributor}
                  onChange={(e) => setFormData({ ...formData, distributor: e.target.value })}
                  placeholder="PT Synnex / Distributor Resmi"
                  className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none placeholder:text-gp-ink-400"
                />
              </div>
              <div>
                <label className="text-gp-ink-200 block mb-1 font-semibold">Masa Garansi</label>
                <input
                  type="text"
                  value={formData.warrantyPeriod}
                  onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                  placeholder="3 Tahun Penuh"
                  className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none placeholder:text-gp-ink-400"
                />
              </div>
            </div>

            <div>
              <label className="text-gp-ink-200 block mb-1 font-semibold">Website / Kontak Service Center</label>
              <input
                type="text"
                value={formData.contactUrl || ""}
                onChange={(e) => setFormData({ ...formData, contactUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2.5 text-xs text-sky-400 font-mono focus:border-amber-400 focus:outline-none placeholder:text-gp-ink-400"
              />
            </div>

            <div>
              <label className="text-gp-ink-200 block mb-1 font-semibold">Ringkasan Ulasan Aftersales</label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl p-3 text-xs text-gp-ink-100 focus:border-amber-400 focus:outline-none placeholder:text-gp-ink-400"
              />
            </div>
          </div>

          {/* Fixed Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-gp-ink-700 bg-gp-ink-950 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-gp-ink-600 text-gp-ink-200 hover:text-white hover:bg-gp-ink-700"
            >
              Batal
            </Button>
            <Button type="submit" variant="cyber" size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
              Simpan Data Aftersales
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
