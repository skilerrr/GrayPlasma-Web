"use client";

import React, { useState, useEffect } from "react";
import { X, LayoutGrid, ShoppingBag, Wrench } from "lucide-react";
import { DeskItem, PeripheralItem } from "@/data/grayplasma-desk-peripherals";
import { Button } from "@/components/ui/button";
import { NotionRichEditor } from "@/components/admin/notion-rich-editor";

interface DeskFormModalProps {
  type: "desk" | "peripheral";
  initialDesk?: DeskItem | null;
  initialPeripheral?: PeripheralItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveDesk?: (desk: DeskItem) => void;
  onSavePeripheral?: (peripheral: PeripheralItem) => void;
}

export function DeskFormModal({
  type,
  initialDesk,
  initialPeripheral,
  isOpen,
  onClose,
  onSaveDesk,
  onSavePeripheral,
}: DeskFormModalProps) {
  const [deskData, setDeskData] = useState<Partial<DeskItem>>({
    name: "",
    category: "Meja Standar",
    price: 750000,
    type: "NON L-SHAPED",
    description: "",
    notes: "",
    shopeeUrl: "https://shopee.co.id",
    specs: {
      material: "Plywood / Besi Hollow",
      thickness: "2.5 cm",
      armSupport: true,
      dimensions: "120 x 60 cm",
    },
  });

  const [periphData, setPeriphData] = useState<Partial<PeripheralItem>>({
    name: "",
    category: "Monitor Arm / Bracket",
    price: 250000,
    brand: "North Bayou",
    verdict: "",
    notes: "",
    shopeeUrl: "https://shopee.co.id",
    recommendedFor: "Monitor 24\" - 27\"",
  });

  useEffect(() => {
    if (type === "desk") {
      if (initialDesk) setDeskData(initialDesk);
      else {
        setDeskData({
          id: `desk-${Date.now()}`,
          name: "",
          category: "Meja Standar",
          price: 750000,
          type: "NON L-SHAPED",
          description: "",
          notes: "Kuat dijepit monitor arm.",
          shopeeUrl: "https://shopee.co.id",
          specs: {
            material: "Multiplek / Besi Hollow 4x4",
            thickness: "2.5 cm",
            armSupport: true,
            dimensions: "120 x 60 x 75 cm",
          },
        });
      }
    } else {
      if (initialPeripheral) setPeriphData(initialPeripheral);
      else {
        setPeriphData({
          id: `per-${Date.now()}`,
          name: "",
          category: "Monitor Arm / Bracket",
          price: 250000,
          brand: "North Bayou",
          verdict: "Standar bracket gas spring berkualitas.",
          notes: "Mendukung VESA 75x75 & 100x100.",
          shopeeUrl: "https://shopee.co.id",
          recommendedFor: "Monitor 24\" - 27\"",
        });
      }
    }
  }, [type, initialDesk, initialPeripheral, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "desk" && onSaveDesk) {
      if (!deskData.name || !deskData.price) {
        alert("Mohon isi nama dan harga meja.");
        return;
      }
      onSaveDesk({
        id: deskData.id || `desk-${Date.now()}`,
        name: deskData.name || "Meja",
        category: deskData.category || "Meja Standar",
        keterangan: deskData.keterangan || [],
        price: Number(deskData.price) || 750000,
        type: deskData.type || "NON L-SHAPED",
        catatanBadge: deskData.catatanBadge || "ADA (DISARANKAN MEMBACA NYA)",
        description: deskData.description || "Meja setup kokoh.",
        notes: deskData.notes || "",
        markdownContent: deskData.markdownContent || "",
        shopeeUrl: deskData.shopeeUrl || "https://shopee.co.id",
        specs: (deskData.specs || {
          material: "Plywood HPL",
          thickness: "2.5 cm",
          armSupport: true,
          dimensions: "120 x 70 x 75 cm"
        }) as DeskItem["specs"],
      });
    } else if (type === "peripheral" && onSavePeripheral) {
      if (!periphData.name || !periphData.price) {
        alert("Mohon isi nama dan harga peripheral.");
        return;
      }
      onSavePeripheral({
        id: periphData.id || `per-${Date.now()}`,
        name: periphData.name || "Aksesoris",
        category: periphData.category || "Monitor Arm / Bracket",
        price: Number(periphData.price) || 250000,
        brand: periphData.brand || "Brand",
        type: periphData.type || "Monitor Arm",
        warranty: periphData.warranty || "1 Tahun",
        verdict: periphData.verdict || "Evaluasi GrayPlasma.",
        notes: periphData.notes || "",
        shopeeUrl: periphData.shopeeUrl || "https://shopee.co.id",
        recommendedFor: periphData.recommendedFor || "Monitor 24\" - 27\"",
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-[#0f0f14] border border-zinc-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#121217] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            {type === "desk" ? (
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <LayoutGrid className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Wrench className="w-4 h-4" />
              </div>
            )}
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              {type === "desk" ? "Form Data Rekomendasi Meja" : "Form Data Aksesoris / Arm"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form with Scrollable Body & Fixed Footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {type === "desk" ? (
              <>
                <div>
                  <label className="text-zinc-300 block mb-1 font-semibold">Nama Meja</label>
                  <input
                    type="text"
                    value={deskData.name}
                    onChange={(e) => setDeskData({ ...deskData, name: e.target.value })}
                    placeholder="Contoh: Meja Standar Kaki Hollow Besi 4x4"
                    className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder:text-zinc-500 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Kategori Utama</label>
                    <select
                      value={deskData.category}
                      onChange={(e) => setDeskData({ ...deskData, category: e.target.value as DeskItem["category"] })}
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Meja Standar">Meja Standar</option>
                      <option value="Daun Meja">Daun Meja</option>
                      <option value="Meja Elektrik (Standing Desk)">Meja Elektrik (Standing Desk)</option>
                      <option value="Meja L-Shaped">Meja L-Shaped</option>
                      <option value="Meja Nakas">Meja Nakas</option>
                      <option value="Meja Lesehan">Meja Lesehan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Bentuk Meja</label>
                    <select
                      value={deskData.type || "NON L SHAPED"}
                      onChange={(e) => setDeskData({ ...deskData, type: e.target.value })}
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="NON L SHAPED">NON L SHAPED</option>
                      <option value="L SHAPED">L SHAPED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Kisaran Harga (Rp)</label>
                    <input
                      type="number"
                      value={deskData.price}
                      onChange={(e) => setDeskData({ ...deskData, price: Number(e.target.value) })}
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-mono focus:border-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Keterangan Tag (Pisahkan Koma)</label>
                    <input
                      type="text"
                      value={(deskData.keterangan || []).join(", ")}
                      onChange={(e) =>
                        setDeskData({
                          ...deskData,
                          keterangan: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="DAUN MEJA, KAKI MEJA HOLLOW"
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Material & Ketebalan</label>
                    <input
                      type="text"
                      value={deskData.specs?.material}
                      onChange={(e) =>
                        setDeskData({
                          ...deskData,
                          specs: { ...deskData.specs!, material: e.target.value },
                        })
                      }
                      placeholder="Plywood / Multiplek 3cm"
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Dimensi Ukuran</label>
                    <input
                      type="text"
                      value={deskData.specs?.dimensions}
                      onChange={(e) =>
                        setDeskData({
                          ...deskData,
                          specs: { ...deskData.specs!, dimensions: e.target.value },
                        })
                      }
                      placeholder="120 x 60 x 75 cm"
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-semibold">Link Shopee (Affiliate)</label>
                  <input
                    type="text"
                    value={deskData.shopeeUrl}
                    onChange={(e) => setDeskData({ ...deskData, shopeeUrl: e.target.value })}
                    placeholder="https://shopee.co.id/..."
                    className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-sky-400 font-mono focus:border-cyan-400 focus:outline-none placeholder:text-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-semibold">
                    Ulasan & Catatan Detail Setup Meja (Word/Notion WYSIWYG):
                  </label>
                  <NotionRichEditor
                    value={deskData.markdownContent || deskData.notes || ""}
                    onChange={(val) =>
                      setDeskData({
                        ...deskData,
                        markdownContent: val,
                        notes: val,
                      })
                    }
                    minHeight="min-h-[220px]"
                    placeholder="Tulis ulasan panduan meja, opsi kaki, dan detail ukuran..."
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-zinc-300 block mb-1 font-semibold">Nama Aksesoris / Arm</label>
                  <input
                    type="text"
                    value={periphData.name}
                    onChange={(e) => setPeriphData({ ...periphData, name: e.target.value })}
                    placeholder="Contoh: North Bayou NB F80 Single Arm"
                    className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder:text-zinc-500 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Kategori</label>
                    <select
                      value={periphData.category}
                      onChange={(e) =>
                        setPeriphData({
                          ...periphData,
                          category: e.target.value as PeripheralItem["category"],
                        })
                      }
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Monitor Arm / Bracket">Monitor Arm / Bracket</option>
                      <option value="Screenbar / Lampu Monitor">Screenbar / Lampu Monitor</option>
                      <option value="Mousepad / Deskmat">Mousepad / Deskmat</option>
                      <option value="Cable Management">Cable Management</option>
                      <option value="Audio & Aksesoris">Audio & Aksesoris</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Harga (Rp)</label>
                    <input
                      type="number"
                      value={periphData.price}
                      onChange={(e) => setPeriphData({ ...periphData, price: Number(e.target.value) })}
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-mono focus:border-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Brand</label>
                    <input
                      type="text"
                      value={periphData.brand}
                      onChange={(e) => setPeriphData({ ...periphData, brand: e.target.value })}
                      placeholder="North Bayou, Oximus, Baseus, dll."
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Rekomendasi Penggunaan</label>
                    <input
                      type="text"
                      value={periphData.recommendedFor}
                      onChange={(e) => setPeriphData({ ...periphData, recommendedFor: e.target.value })}
                      placeholder="Monitor 24 - 27 inci"
                      className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-semibold">Link Shopee (Affiliate)</label>
                  <input
                    type="text"
                    value={periphData.shopeeUrl}
                    onChange={(e) => setPeriphData({ ...periphData, shopeeUrl: e.target.value })}
                    placeholder="https://shopee.co.id/..."
                    className="w-full bg-[#14141c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-sky-400 font-mono focus:border-cyan-400 focus:outline-none placeholder:text-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-semibold">Evaluasi / Verdict Singkat</label>
                  <textarea
                    rows={2}
                    value={periphData.verdict}
                    onChange={(e) => setPeriphData({ ...periphData, verdict: e.target.value })}
                    className="w-full bg-[#14141c] border border-zinc-700 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder:text-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-semibold">
                    Catatan Ulasan Lengkap Aksesoris (Word/Notion WYSIWYG):
                  </label>
                  <NotionRichEditor
                    value={periphData.notes || ""}
                    onChange={(val) => setPeriphData({ ...periphData, notes: val })}
                    minHeight="min-h-[200px]"
                    placeholder="Tulis catatan kompabilitas bracket, review pegas, kabel..."
                  />
                </div>
              </>
            )}
          </div>

          {/* Fixed Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-zinc-800 bg-[#0a0a0e] flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              Batal
            </Button>
            <Button type="submit" variant="cyber" size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold">
              Simpan Data
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
