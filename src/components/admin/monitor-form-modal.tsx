"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Sparkles,
  CheckCircle2,
  Trash2,
  Plus,
  Tv,
  Image as ImageIcon,
  DollarSign,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Monitor, TierRating } from "@/types/monitor";
import { compressImage, formatFileSize, CompressedImageResult } from "@/lib/image-compressor";
import { uploadImageToSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface MonitorFormModalProps {
  monitor: Monitor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (monitor: Monitor) => void;
}

export function MonitorFormModal({
  monitor,
  isOpen,
  onClose,
  onSave,
}: MonitorFormModalProps) {
  const [formData, setFormData] = useState<Partial<Monitor>>({
    brand: "Xiaomi",
    model: "",
    fullName: "",
    tier: "RECOMMENDED",
    tierDescription: "",
    price: 1800000,
    originalPrice: 2100000,
    thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    gallery: [],
    quickSpecs: ["24\"", "Fast IPS", "180Hz", "1ms GtG"],
    expertVerdict: "",
    pros: ["Fast IPS 180Hz", "Delta E < 2"],
    cons: ["Stand bawaan tilt only"],
    specs: {
      display: {
        size: "24 Inci",
        resolution: "1920 x 1080 (FHD)",
        panelType: "Fast IPS",
        refreshRate: 180,
        responseTime: "1ms GtG",
        brightness: "300 nits",
        contrastRatio: "1000:1",
        colorGamut: "99% sRGB",
        hdr: "HDR10 (Disarankan SDR)",
        viewingAngle: "178° / 178°",
        curvature: "Flat",
      },
      connectivity: {
        displayPort: "1x DisplayPort 1.4",
        hdmi: "1x HDMI 2.0",
        audioJack: true,
        usbHub: "Tidak Ada",
      },
      ergonomics: {
        heightAdjustable: false,
        tilt: "-5° ~ 15°",
        swivel: "Tidak",
        pivot: false,
        vesaMount: "75 x 75 mm",
      },
      features: {
        syncTech: "Adaptive-Sync / FreeSync",
        builtInSpeakers: false,
        powerConsumption: "28W",
        warranty: "3 Tahun Garansi Distributor",
      },
    },
    marketplaces: [
      {
        marketplace: "Shopee",
        url: "https://shopee.co.id",
        price: 1800000,
        isAffiliate: true,
        storeName: "Official Store",
        officialStore: true,
        inStock: true,
      },
      {
        marketplace: "Tokopedia",
        url: "https://tokopedia.com",
        price: 1800000,
        isAffiliate: true,
        storeName: "Official Store",
        officialStore: true,
        inStock: true,
      },
    ],
    tags: ["Fast IPS", "180Hz", "FHD (1080p)"],
  });

  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<CompressedImageResult | null>(null);

  useEffect(() => {
    if (monitor) {
      setFormData(monitor);
    } else {
      setFormData({
        id: `mon-${Date.now()}`,
        brand: "Xiaomi",
        model: "New Monitor",
        fullName: "Xiaomi New Monitor 180Hz",
        tier: "RECOMMENDED",
        tierDescription: "Rekomendasi GrayPlasma",
        price: 1800000,
        originalPrice: 2100000,
        thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
        gallery: [],
        quickSpecs: ["24\"", "Fast IPS", "180Hz", "1ms GtG"],
        expertVerdict: "Pengujian GTID Tech: Motion clarity sangat baik dan akurasi warna tinggi.",
        pros: ["Fast IPS 180Hz", "Akurasi warna tinggi"],
        cons: ["Stand bawaan tilt only"],
        specs: {
          display: {
            size: "24 Inci",
            resolution: "1920 x 1080 (FHD)",
            panelType: "Fast IPS",
            refreshRate: 180,
            responseTime: "1ms GtG",
            brightness: "300 nits",
            contrastRatio: "1000:1",
            colorGamut: "99% sRGB",
            hdr: "HDR10",
            viewingAngle: "178° / 178°",
            curvature: "Flat",
          },
          connectivity: {
            displayPort: "1x DisplayPort 1.4",
            hdmi: "1x HDMI 2.0",
            audioJack: true,
            usbHub: "Tidak Ada",
          },
          ergonomics: {
            heightAdjustable: false,
            tilt: "-5° ~ 15°",
            swivel: "Tidak",
            pivot: false,
            vesaMount: "75 x 75 mm",
          },
          features: {
            syncTech: "Adaptive-Sync / FreeSync",
            builtInSpeakers: false,
            powerConsumption: "28W",
            warranty: "3 Tahun Garansi Distributor",
          },
        },
        marketplaces: [
          {
            marketplace: "Shopee",
            url: "https://shopee.co.id",
            price: 1800000,
            isAffiliate: true,
            storeName: "Official Store",
            officialStore: true,
            inStock: true,
          },
        ],
        tags: ["Fast IPS", "180Hz", "FHD (1080p)"],
      });
    }
    setCompressionStats(null);
  }, [monitor, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      // 1. Client-Side WebP Compression & Resizing
      const compressed = await compressImage(file, 1200, 0.8);
      setCompressionStats(compressed);

      // 2. Upload to Supabase if configured
      if (isSupabaseConfigured) {
        const uploaded = await uploadImageToSupabase(compressed.file, "monitors");
        if (uploaded) {
          setFormData((prev) => ({
            ...prev,
            thumbnail: uploaded.url,
            gallery: [uploaded.url],
          }));
          return;
        }
      }

      // Fallback: Use Compressed WebP DataURL
      setFormData((prev) => ({
        ...prev,
        thumbnail: compressed.dataUrl,
        gallery: [compressed.dataUrl],
      }));
    } catch (err) {
      console.error("Image processing error", err);
      alert("Gagal memproses gambar. Pastikan format file berupa JPG/PNG/WebP.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.brand || !formData.price) {
      alert("Mohon lengkapi Brand, Nama Monitor, dan Harga.");
      return;
    }

    const finalItem: Monitor = {
      id: formData.id || `mon-${Date.now()}-${formData.model?.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      slug: formData.slug || formData.model?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "monitor",
      brand: formData.brand || "Brand",
      model: formData.model || formData.fullName || "Model",
      fullName: formData.fullName || "Full Name",
      tier: formData.tier || "RECOMMENDED",
      tierDescription: formData.tierDescription || "Rekomendasi GrayPlasma",
      price: Number(formData.price) || 1500000,
      originalPrice: Number(formData.originalPrice) || Math.round(Number(formData.price) * 1.15),
      thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
      gallery: formData.gallery || [formData.thumbnail || ""],
      quickSpecs: [
        formData.specs?.display?.size || "24 Inci",
        formData.specs?.display?.panelType || "Fast IPS",
        `${formData.specs?.display?.refreshRate || 180}Hz`,
        formData.specs?.display?.responseTime || "1ms GtG",
      ],
      expertVerdict: formData.expertVerdict || "Data pengetesan GTID Tech.",
      pros: formData.pros || ["Panel berkualitas", "Refresh rate tinggi"],
      cons: formData.cons || ["Perhatikan setting Overdrive"],
      specs: formData.specs as Monitor["specs"],
      marketplaces: formData.marketplaces as Monitor["marketplaces"],
      priceHistory: [{ date: "Rekomendasi GrayPlasma", price: Number(formData.price), label: "Harga Target" }],
      tags: [
        formData.specs?.display?.panelType || "Fast IPS",
        `${formData.specs?.display?.refreshRate || 180}Hz`,
        formData.specs?.display?.resolution || "FHD",
      ],
      createdAt: formData.createdAt || new Date().toISOString(),
    };

    onSave(finalItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#121216]">
          <div className="flex items-center gap-2.5">
            <Tv className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-white uppercase tracking-tight">
              {monitor ? "Edit Data Monitor" : "Tambah Monitor Baru"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* 1. Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              1. Identitas & Tier Rating
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Xiaomi, AOC, Dell, MSI, dll."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] text-zinc-400 block mb-1">Nama Lengkap Model</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value, model: e.target.value })}
                  placeholder="Contoh: Xiaomi G24i 180Hz Fast IPS"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Tier / Rekomendasi</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value as TierRating })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="S-TIER">S-TIER (Terbaik)</option>
                  <option value="BEST VALUE">BEST VALUE (Paling Worth It)</option>
                  <option value="RECOMMENDED">RECOMMENDED (Bagus)</option>
                  <option value="PASS">PASS (Tidak Worth It)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Kisaran Harga Target (Rp)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Harga Asli / Normal (Rp)</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 2. Image Uploader with WebP Compression */}
          <div className="space-y-3 pt-4 border-t border-zinc-800/80">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>2. Foto Monitor & Auto WebP Optimizer</span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Auto-Compressed to WebP (&lt; 80KB)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              {/* Preview Box */}
              <div className="w-28 h-24 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                {formData.thumbnail ? (
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-zinc-600" />
                )}
                {isCompressing && (
                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                    Compressing...
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="space-y-2 flex-1 w-full">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih / Drop File Gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-zinc-400">
                  Format gambar apa saja (PNG, JPG, HEIC) otomatis dikompresi & di-downscale ke format WebP ringan.
                </p>

                {/* Compression Stats Badge */}
                {compressionStats && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-[11px] text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>
                      {formatFileSize(compressionStats.originalSize)} ➔{" "}
                      <strong>{formatFileSize(compressionStats.compressedSize)}</strong>{" "}
                      ({compressionStats.savedPercentage}% lebih ringan!)
                    </span>
                  </div>
                )}

                {/* Image URL fallback input */}
                <div>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="Atau masukkan Direct Image URL..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Specs Details */}
          <div className="space-y-3 pt-4 border-t border-zinc-800/80">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              3. Spesifikasi Layar & Data GTID
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Resolusi</label>
                <input
                  type="text"
                  value={formData.specs?.display?.resolution}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: {
                        ...formData.specs!,
                        display: { ...formData.specs!.display, resolution: e.target.value },
                      },
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Ukuran Layar</label>
                <input
                  type="text"
                  value={formData.specs?.display?.size}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: {
                        ...formData.specs!,
                        display: { ...formData.specs!.display, size: e.target.value },
                      },
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Tipe Panel</label>
                <input
                  type="text"
                  value={formData.specs?.display?.panelType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: {
                        ...formData.specs!,
                        display: { ...formData.specs!.display, panelType: e.target.value as any },
                      },
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Refresh Rate (Hz)</label>
                <input
                  type="number"
                  value={formData.specs?.display?.refreshRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: {
                        ...formData.specs!,
                        display: { ...formData.specs!.display, refreshRate: Number(e.target.value) },
                      },
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Response Time (GTID Tested)</label>
                <input
                  type="text"
                  value={formData.specs?.display?.responseTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: {
                        ...formData.specs!,
                        display: { ...formData.specs!.display, responseTime: e.target.value },
                      },
                    })
                  }
                  placeholder="Contoh: 1ms GtG / 3.4ms di 180Hz"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono text-cyan-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Stand Capability</label>
                <input
                  type="text"
                  value={formData.specs?.ergonomics?.heightAdjustable ? "Height Adjustable + Tilt" : "Tilt Only"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: {
                        ...formData.specs!,
                        ergonomics: {
                          ...formData.specs!.ergonomics,
                          heightAdjustable: e.target.value.toLowerCase().includes("height"),
                        },
                      },
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">VESA Mount</label>
                <input
                  type="text"
                  value={formData.specs?.ergonomics?.vesaMount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: {
                        ...formData.specs!,
                        ergonomics: {
                          ...formData.specs!.ergonomics,
                          vesaMount: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* 4. Shopee & Marketplace Affiliate Link */}
          <div className="space-y-3 pt-4 border-t border-zinc-800/80">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              4. Link Pembelian & Toko Affiliate
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Link Shopee (Affiliate)</label>
                <input
                  type="text"
                  value={formData.marketplaces?.[0]?.url || ""}
                  onChange={(e) => {
                    const mkps = [...(formData.marketplaces || [])];
                    if (mkps[0]) mkps[0].url = e.target.value;
                    setFormData({ ...formData, marketplaces: mkps });
                  }}
                  placeholder="https://shopee.co.id/..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Link Tokopedia (Opsional)</label>
                <input
                  type="text"
                  value={formData.marketplaces?.[1]?.url || ""}
                  onChange={(e) => {
                    const mkps = [...(formData.marketplaces || [])];
                    if (mkps[1]) mkps[1].url = e.target.value;
                    else mkps.push({ marketplace: "Tokopedia", url: e.target.value, price: formData.price || 0, isAffiliate: true, storeName: "Official", officialStore: true, inStock: true });
                    setFormData({ ...formData, marketplaces: mkps });
                  }}
                  placeholder="https://tokopedia.com/..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* 5. Verdict & Notes */}
          <div className="space-y-2 pt-4 border-t border-zinc-800/80">
            <label className="text-[11px] text-zinc-400 block">Evaluasi Singkat GrayPlasma / GTID Verdict</label>
            <textarea
              rows={2}
              value={formData.expertVerdict}
              onChange={(e) => setFormData({ ...formData, expertVerdict: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="cyber" size="sm" className="font-bold">
              Simpan Data Monitor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
