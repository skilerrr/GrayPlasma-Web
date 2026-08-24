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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#121216]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white uppercase tracking-tight">
              {brand ? "Edit Aftersales Brand" : "Tambah Aftersales Brand"}
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Nama Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Contoh: ASUS, Dell, Xiaomi"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Tier Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value as AftersalesBrand["rating"] })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
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
              <label className="text-[11px] text-zinc-400 block mb-1">Distributor Resmi</label>
              <input
                type="text"
                value={formData.distributor}
                onChange={(e) => setFormData({ ...formData, distributor: e.target.value })}
                placeholder="PT Synnex / Distributor Resmi"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Masa Garansi</label>
              <input
                type="text"
                value={formData.warrantyPeriod}
                onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                placeholder="3 Tahun Penuh"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Website / Kontak Service Center</label>
            <input
              type="text"
              value={formData.contactUrl || ""}
              onChange={(e) => setFormData({ ...formData, contactUrl: e.target.value })}
              placeholder="https://..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Ringkasan Ulasan Aftersales</label>
            <textarea
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="cyber" size="sm" className="font-bold">
              Simpan Data Aftersales
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
