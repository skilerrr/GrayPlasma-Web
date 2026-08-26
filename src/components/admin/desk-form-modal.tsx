"use client";

import React, { useState, useEffect } from "react";
import { X, LayoutGrid, ShoppingBag, Wrench } from "lucide-react";
import { DeskItem, PeripheralItem } from "@/data/grayplasma-desk-peripherals";
import { Button } from "@/components/ui/button";

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#121216]">
          <div className="flex items-center gap-2">
            {type === "desk" ? (
              <LayoutGrid className="w-5 h-5 text-cyan-400" />
            ) : (
              <Wrench className="w-5 h-5 text-emerald-400" />
            )}
            <h3 className="text-base font-black text-white uppercase tracking-tight">
              {type === "desk" ? "Form Data Meja" : "Form Data Peripherals / Arm"}
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {type === "desk" ? (
            <>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Nama Meja</label>
                <input
                  type="text"
                  value={deskData.name}
                  onChange={(e) => setDeskData({ ...deskData, name: e.target.value })}
                  placeholder="Contoh: Meja Standar Kaki Hollow Besi 4x4"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Kategori Utama</label>
                  <select
                    value={deskData.category}
                    onChange={(e) => setDeskData({ ...deskData, category: e.target.value as DeskItem["category"] })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
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
                  <label className="text-[11px] text-zinc-400 block mb-1">Bentuk Meja</label>
                  <select
                    value={deskData.type || "NON L SHAPED"}
                    onChange={(e) => setDeskData({ ...deskData, type: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="NON L SHAPED">NON L SHAPED</option>
                    <option value="L SHAPED">L SHAPED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Kisaran Harga (Rp)</label>
                  <input
                    type="number"
                    value={deskData.price}
                    onChange={(e) => setDeskData({ ...deskData, price: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Keterangan Tag (Pisahkan Koma)</label>
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
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Material & Ketebalan</label>
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
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Dimensi Ukuran</label>
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
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Link Shopee (Affiliate)</label>
                <input
                  type="text"
                  value={deskData.shopeeUrl}
                  onChange={(e) => setDeskData({ ...deskData, shopeeUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">
                  Konten Markdown / Panduan Detail (Support Ctrl+V Paste Gambar)
                </label>
                <textarea
                  rows={5}
                  value={deskData.markdownContent || deskData.notes || ""}
                  onChange={(e) =>
                    setDeskData({
                      ...deskData,
                      markdownContent: e.target.value,
                      notes: e.target.value,
                    })
                  }
                  onPaste={async (e) => {
                    const { handleClipboardImagePaste } = await import("@/lib/image-compressor");
                    await handleClipboardImagePaste(e, {
                      folder: "desks",
                      onSuccess: (snippet) => {
                        const target = e.currentTarget;
                        const start = target.selectionStart || 0;
                        const end = target.selectionEnd || 0;
                        const curr = deskData.markdownContent || "";
                        const updated = curr.substring(0, start) + snippet + curr.substring(end);
                        setDeskData({ ...deskData, markdownContent: updated });
                      },
                    });
                  }}
                  placeholder="### Rincian & Link Komponen Meja...\n(Bisa langsung Ctrl+V paste gambar)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono leading-relaxed"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Nama Aksesoris / Arm</label>
                <input
                  type="text"
                  value={periphData.name}
                  onChange={(e) => setPeriphData({ ...periphData, name: e.target.value })}
                  placeholder="Contoh: North Bayou NB F80 Single Arm"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Kategori</label>
                  <select
                    value={periphData.category}
                    onChange={(e) =>
                      setPeriphData({
                        ...periphData,
                        category: e.target.value as PeripheralItem["category"],
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Monitor Arm / Bracket">Monitor Arm / Bracket</option>
                    <option value="Screenbar / Lampu Monitor">Screenbar / Lampu Monitor</option>
                    <option value="Mousepad / Deskmat">Mousepad / Deskmat</option>
                    <option value="Cable Management">Cable Management</option>
                    <option value="Audio & Aksesoris">Audio & Aksesoris</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={periphData.price}
                    onChange={(e) => setPeriphData({ ...periphData, price: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={periphData.brand}
                    onChange={(e) => setPeriphData({ ...periphData, brand: e.target.value })}
                    placeholder="North Bayou, Oximus, Baseus, dll."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Rekomendasi Penggunaan</label>
                  <input
                    type="text"
                    value={periphData.recommendedFor}
                    onChange={(e) => setPeriphData({ ...periphData, recommendedFor: e.target.value })}
                    placeholder="Monitor 24 - 27 inci"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Link Shopee (Affiliate)</label>
                <input
                  type="text"
                  value={periphData.shopeeUrl}
                  onChange={(e) => setPeriphData({ ...periphData, shopeeUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Evaluasi / Verdict</label>
                <textarea
                  rows={2}
                  value={periphData.verdict}
                  onChange={(e) => setPeriphData({ ...periphData, verdict: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="cyber" size="sm" className="font-bold">
              Simpan Data
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
