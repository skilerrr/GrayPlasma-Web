"use client";

import React, { useState } from "react";
import {
  Tv,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Save,
  Check,
  RotateCcw,
  Search,
  ExternalLink,
  ImageIcon,
  Sparkles,
  Eye,
  SlidersHorizontal,
  Youtube,
  AlertTriangle,
  ArrowRight,
  Upload,
  CheckCircle2,
  Table as TableIcon,
  GripVertical,
  FileSpreadsheet,
  ArrowUpDown,
  Download,
} from "lucide-react";
import { Monitor, TierRating } from "@/types/monitor";
import { DatabaseService } from "@/lib/db-service";
import { formatRupiah } from "@/lib/utils";
import { compressImage, formatFileSize, CompressedImageResult } from "@/lib/image-compressor";
import { Button } from "@/components/ui/button";
import { NotionRichEditor } from "@/components/admin/notion-rich-editor";
import { ModularTableBuilder } from "@/components/admin/modular-table-builder";
import { useDraggableTable, TableColumnDef } from "@/hooks/use-draggable-table";
import { TableColumnManagerModal } from "@/components/ui/table-column-manager-modal";
import { WordDocsStudio } from "@/components/admin/word-docs-studio";
import Image from "next/image";

interface MonitorLiveStudioProps {
  monitors: Monitor[];
  onUpdateMonitors: (newMonitors: Monitor[]) => void;
  onPreviewSidePanel: (monitor: Monitor) => void;
}

export function MonitorLiveStudio({
  monitors,
  onUpdateMonitors,
  onPreviewSidePanel,
}: MonitorLiveStudioProps) {
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(
    monitors[0] || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<CompressedImageResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
  const [isTableBuilderOpen, setIsTableBuilderOpen] = useState(false);
  const [newVarLabel, setNewVarLabel] = useState("");
  const [newVarValue, setNewVarValue] = useState("");
  const [newVarCategory, setNewVarCategory] = useState("Display & Panel");
  const [viewMode, setViewMode] = useState<"excel" | "studio">("excel");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isColManagerOpen, setIsColManagerOpen] = useState(false);
  const [isWordDocsOpen, setIsWordDocsOpen] = useState(false);

  // Helper to convert monitor ulasan & verdict to Notion/Word document HTML
  const getInitialDoc = (mon: Partial<Monitor> | null) => {
    if (!mon) return "<p>Mulai ketik ulasan atau verdict monitor di sini...</p>";
    if (mon.deepDiveDescription && mon.deepDiveDescription.trim().length > 0) {
      return mon.deepDiveDescription;
    }
    let doc = "";
    if (mon.expertVerdict) {
      doc += `<div class="notion-callout notion-callout-amber"><span class="notion-callout-icon">💡</span><div class="notion-callout-content"><strong>GTID Tech Verdict:</strong><br>${mon.expertVerdict}</div></div>`;
    }
    if (mon.introduction) {
      doc += `<h2>Ulasan & Karakteristik Layar</h2><p>${mon.introduction}</p>`;
    }
    if ((mon.pros && mon.pros.length > 0) || (mon.cons && mon.cons.length > 0)) {
      doc += `<h3>Kelebihan & Kekurangan</h3><ul class="notion-task-list">`;
      (mon.pros || []).forEach((p) => {
        doc += `<li class="notion-task-item"><span class="notion-checkbox checked">☑</span><span><strong>[PLUS]</strong> ${p}</span></li>`;
      });
      (mon.cons || []).forEach((c) => {
        doc += `<li class="notion-task-item"><span class="notion-checkbox">☐</span><span><strong>[MINUS]</strong> ${c}</span></li>`;
      });
      doc += `</ul>`;
    }
    return doc || "<p>Mulai ketik ulasan atau verdict monitor di sini...</p>";
  };

  const [docContent, setDocContent] = useState<string>(() => getInitialDoc(selectedMonitor));

  // Form State initialized with selected monitor
  const [formData, setFormData] = useState<Partial<Monitor>>(
    selectedMonitor || {
      brand: "Xiaomi",
      model: "Xiaomi G24i (2024)",
      fullName: "Xiaomi G24i (2024)",
      tier: "BEST VALUE",
      tierDescription: "Rekomendasi Utama Kelas 1080p Fast IPS",
      price: 1550000,
      originalPrice: 1800000,
      recommendedPrice: 1500000,
      aspectRatio: "16:9 (Wide)",
      curvature: "None",
      displayInputs: ["HDMI 1.4", "HDMI 2.0"],
      panelBitDepth: "8 Bit",
      standCapability: "Tilt",
      usbHub: "None",
      marketClass: "144Hz+",
      createdDateText: "February 24, 2025 12:24",
      lastUpdatedDate: "June 24, 2025",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      frontImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      rearImage: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
      quickSpecs: ["24 Inch or 23.8 Inch", "IPS", "180Hz", "1ms GtG"],
      expertVerdict: "Data Pengetesan GTID Tech: Motion clarity sangat baik dan akurasi warna tinggi.",
      pros: ["Panel Fast IPS 180Hz", "Akurasi warna tinggi"],
      cons: ["Stand bawaan tilt only"],
      specs: {
        display: {
          size: "24 Inch or 23.8 Inch",
          resolution: "1920x1080 (FHD)",
          panelType: "IPS",
          refreshRate: 180,
          responseTime: "Toleransi Baru (5 RGB), Toleransi Lama (10 RGB)",
          brightness: "300 nits",
          contrastRatio: "1000:1",
          colorGamut: "99% sRGB / 90% DCI-P3",
          hdr: "HDR10 (Disarankan SDR)",
          viewingAngle: "178° / 178°",
          curvature: "None",
        },
        connectivity: {
          displayPort: "1x DisplayPort 1.4",
          hdmi: "1x HDMI 2.0",
          audioJack: true,
          usbHub: "None",
        },
        ergonomics: {
          heightAdjustable: false,
          tilt: "-5° ~ 15°",
          swivel: "Tidak",
          pivot: false,
          vesaMount: "75x75 mm",
        },
        features: {
          syncTech: "Adaptive-Sync / FreeSync",
          builtInSpeakers: false,
          powerConsumption: "25W",
          warranty: "3 Tahun Garansi Distributor",
        },
      },
      marketplaces: [],
      priceHistory: [],
      tags: ["Fast IPS", "180Hz", "FHD (1080p)"],
      createdAt: new Date().toISOString(),
    }
  );

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSelectMonitor = (mon: Monitor) => {
    setSelectedMonitor(mon);
    setFormData({ ...mon });
    setDocContent(getInitialDoc(mon));
    setCompressionStats(null);
  };

  const handleCreateNew = () => {
    const newMon: Monitor = {
      id: `mon-${Date.now()}-new`,
      slug: `monitor-baru-${Date.now()}`,
      brand: "Brand Baru",
      model: "Model Baru 180Hz",
      fullName: "Brand Model Baru 180Hz Fast IPS",
      tier: "RECOMMENDED",
      tierDescription: "Rekomendasi Monitor GrayPlasma",
      price: 1600000,
      originalPrice: 1900000,
      recommendedPrice: 1550000,
      aspectRatio: "16:9 (Wide)",
      curvature: "None",
      displayInputs: ["HDMI 1.4", "HDMI 2.0"],
      panelBitDepth: "8 Bit",
      standCapability: "Tilt",
      usbHub: "None",
      marketClass: "144Hz+",
      createdDateText: "February 24, 2025 12:24",
      lastUpdatedDate: "June 24, 2025",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      frontImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      rearImage: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
      gallery: [],
      quickSpecs: ["24 Inch or 23.8 Inch", "IPS", "180Hz", "1ms GtG"],
      expertVerdict: "Pengujian GTID Tech: Motion clarity sangat baik dan akurasi warna tinggi.",
      pros: ["Panel Fast IPS 180Hz", "Akurasi warna tinggi"],
      cons: ["Stand bawaan tilt only"],
      specs: {
        display: {
          size: "24 Inch or 23.8 Inch",
          resolution: "1920x1080 (FHD)",
          panelType: "IPS",
          refreshRate: 180,
          responseTime: "Toleransi Baru (5 RGB)",
          brightness: "300 nits",
          contrastRatio: "1000:1",
          colorGamut: "99% sRGB",
          hdr: "HDR10",
          viewingAngle: "178° / 178°",
          curvature: "None",
        },
        connectivity: {
          displayPort: "1x DisplayPort 1.4",
          hdmi: "1x HDMI 2.0",
          audioJack: true,
          usbHub: "None",
        },
        ergonomics: {
          heightAdjustable: false,
          tilt: "-5° ~ 15°",
          swivel: "Tidak",
          pivot: false,
          vesaMount: "75x75 mm",
        },
        features: {
          syncTech: "Adaptive-Sync / FreeSync",
          builtInSpeakers: false,
          powerConsumption: "28W",
          warranty: "3 Tahun Garansi Distributor",
        },
      },
      marketplaces: [],
      priceHistory: [],
      tags: ["Fast IPS", "180Hz"],
      createdAt: new Date().toISOString(),
      responseTimeData: {
        toleranceNew: "Toleransi Baru (5 RGB)",
        toleranceOld: "Toleransi Lama (10 RGB)",
      },
    };

    setSelectedMonitor(newMon);
    setFormData(newMon);
    setDocContent(getInitialDoc(newMon));
    showNotification("Membuat entri monitor baru. Silakan sesuaikan data lalu klik Simpan.");
  };

  const handleDuplicate = async (mon: Monitor) => {
    const duplicated: Monitor = {
      ...mon,
      id: `mon-${Date.now()}-copy`,
      slug: `${mon.slug}-copy-${Date.now().toString().slice(-4)}`,
      fullName: `${mon.fullName} (Copy)`,
      model: `${mon.model} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    const updated = await DatabaseService.saveMonitor(duplicated);
    onUpdateMonitors(updated);
    setSelectedMonitor(duplicated);
    setFormData(duplicated);
    setDocContent(getInitialDoc(duplicated));
    showNotification(`Berhasil menduplikasi: ${duplicated.fullName}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus data monitor ini dari database?")) {
      const updated = await DatabaseService.deleteMonitor(id);
      onUpdateMonitors(updated);
      if (selectedMonitor?.id === id) {
        setSelectedMonitor(updated[0] || null);
        if (updated[0]) {
          setFormData(updated[0]);
          setDocContent(getInitialDoc(updated[0]));
        }
      }
      showNotification("Monitor berhasil dihapus!");
    }
  };

  // Drag and Drop Row Reordering for Excel Table View
  const handleRowDrop = async (targetIdx: number) => {
    if (draggedIndex === null || draggedIndex === targetIdx) return;
    const newMonitors = [...monitors];
    const [moved] = newMonitors.splice(draggedIndex, 1);
    newMonitors.splice(targetIdx, 0, moved);
    const updated = await DatabaseService.reorderMonitors(newMonitors);
    onUpdateMonitors(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    showNotification(`Urutan monitor diperbarui! #${targetIdx + 1}: ${moved.fullName}`);
  };

  // Quick Inline Edit for Price in Excel View
  const handleQuickEditPrice = async (mon: Monitor, newPrice: number) => {
    const updatedMon: Monitor = { ...mon, price: newPrice };
    const list = await DatabaseService.saveMonitor(updatedMon);
    onUpdateMonitors(list);
    showNotification(`Harga ${mon.brand} diubah ke ${formatRupiah(newPrice)}`);
  };

  // Quick Inline Edit for Tier in Excel View
  const handleQuickEditTier = async (mon: Monitor, newTier: TierRating) => {
    const updatedMon: Monitor = { ...mon, tier: newTier };
    const list = await DatabaseService.saveMonitor(updatedMon);
    onUpdateMonitors(list);
    showNotification(`Tier ${mon.brand} diubah ke ${newTier}`);
  };

  // Export CSV format
  const handleExportCSV = () => {
    const headers = ["No", "Brand", "Model", "Harga", "Tier", "Panel", "Size", "Resolusi", "RefreshRate", "ToleransiBaru", "ToleransiLama"];
    const rows = monitors.map((m, idx) => [
      idx + 1,
      `"${(m.brand || '').replace(/"/g, '""')}"`,
      `"${(m.fullName || '').replace(/"/g, '""')}"`,
      m.price,
      `"${m.tier}"`,
      `"${m.specs?.display?.panelType || ''}"`,
      `"${m.specs?.display?.size || ''}"`,
      `"${m.specs?.display?.resolution || ''}"`,
      m.specs?.display?.refreshRate || 0,
      `"${m.responseTimeData?.toleranceNew || ''}"`,
      `"${m.responseTimeData?.toleranceOld || ''}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `grayplasma_monitors_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Data monitor berhasil diekspor ke CSV.");
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.brand || !formData.fullName || !formData.price) {
      alert("Mohon lengkapi Brand, Nama Monitor, dan Kisaran Harga!");
      return;
    }

    const itemToSave: Monitor = {
      id: formData.id || `mon-${Date.now()}-${formData.model?.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      slug: formData.slug || formData.model?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "monitor",
      brand: formData.brand || "Brand",
      model: formData.model || formData.fullName || "Model",
      fullName: formData.fullName || "Full Name",
      tier: formData.tier || "RECOMMENDED",
      tierDescription: formData.tierDescription || "Rekomendasi GrayPlasma",
      price: Number(formData.price) || 1500000,
      originalPrice: Number(formData.originalPrice) || Math.round(Number(formData.price) * 1.15),
      recommendedPrice: formData.recommendedPrice ? Number(formData.recommendedPrice) : undefined,
      aspectRatio: formData.aspectRatio || "16:9 (Wide)",
      curvature: formData.curvature || "None",
      displayInputs: formData.displayInputs || ["HDMI 1.4", "HDMI 2.0"],
      panelBitDepth: formData.panelBitDepth || "8 Bit",
      standCapability: formData.standCapability || "Tilt",
      usbHub: formData.usbHub || "None",
      marketClass: formData.marketClass || "144Hz+",
      createdDateText: formData.createdDateText || "February 24, 2025 12:24",
      lastUpdatedDate: formData.lastUpdatedDate || "June 24, 2025",
      linkShopee: formData.linkShopee,
      linkTokopedia: formData.linkTokopedia,
      linkTiktokShop: formData.linkTiktokShop,
      thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      frontImage: formData.frontImage || formData.thumbnail,
      rearImage: formData.rearImage,
      gallery: formData.gallery || [formData.thumbnail || ""],
      gtidReviewUrl: formData.gtidReviewUrl,
      statusReason: formData.statusReason,
      introduction: formData.introduction,
      deepDiveTitle: formData.deepDiveTitle,
      deepDiveDescription: docContent || formData.deepDiveDescription,
      quickSpecs: [
        formData.specs?.display?.size || "24 Inch or 23.8 Inch",
        formData.specs?.display?.panelType || "IPS",
        `${formData.specs?.display?.refreshRate || 180}Hz`,
        formData.specs?.display?.responseTime || "1ms GtG",
      ],
      expertVerdict: formData.expertVerdict || "Data pengetesan GTID Tech.",
      pros: formData.pros || ["Panel berkualitas", "Refresh rate tinggi"],
      cons: formData.cons || ["Perhatikan setting Overdrive"],
      specs: formData.specs as Monitor["specs"],
      marketplaces: formData.marketplaces || [],
      priceHistory: [{ date: "Rekomendasi GrayPlasma", price: Number(formData.price), label: "Harga Target" }],
      tags: [
        formData.specs?.display?.panelType || "IPS",
        `${formData.specs?.display?.refreshRate || 180}Hz`,
        formData.specs?.display?.resolution || "FHD",
      ],
      bannerImage: formData.bannerImage,
      deepDiveNote: formData.deepDiveNote,
      accessoriesIncluded: formData.accessoriesIncluded,
      additionalStores: formData.additionalStores,
      responseTimeData: formData.responseTimeData,
      customVariables: formData.customVariables || [],
      createdAt: formData.createdAt || new Date().toISOString(),
    };

    const updated = await DatabaseService.saveMonitor(itemToSave);
    onUpdateMonitors(updated);
    setSelectedMonitor(itemToSave);
    showNotification(`Berhasil menyimpan perubahan data: ${itemToSave.fullName}`);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, 1200, 0.82);

      setCompressionStats(compressed);
      setFormData((prev) => ({
        ...prev,
        thumbnail: compressed.dataUrl,
        frontImage: compressed.dataUrl,
      }));
    } catch (err) {
      console.error("Image compression error", err);
      alert("Gagal memproses gambar.");
    } finally {
      setIsCompressing(false);
    }
  };

  const filteredMonitors = monitors.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === "all" || m.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  // Table Column Definitions for Draggable & Sortable Monitor Management
  const monitorColumns = React.useMemo<TableColumnDef<Monitor>[]>(() => [
    {
      id: "price",
      label: "[ 01 // KISARAN HARGA ]",
      shortLabel: "Harga",
      minWidth: "min-w-[170px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Finansial",
      getValue: (m) => m.price,
      renderCell: (m) => (
        <div className="font-mono font-bold text-emerald-400 whitespace-nowrap">
          <input
            type="number"
            defaultValue={m.price}
            onBlur={(e) => {
              const newP = Number(e.target.value);
              if (newP !== m.price && newP >= 0) {
                handleQuickEditPrice(m, newP);
              }
            }}
            className="w-28 bg-zinc-900/80 border border-zinc-750 hover:border-emerald-500 focus:border-emerald-500 rounded-md px-2 py-1 text-xs text-emerald-400 font-mono font-bold focus:outline-none"
          />
        </div>
      ),
    },
    {
      id: "model",
      label: "[ 02 // BRAND & MODEL ]",
      shortLabel: "Brand & Model",
      minWidth: "min-w-[260px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Identitas",
      getValue: (m) => m.fullName,
      renderCell: (m) => (
        <div className="flex items-center gap-2">
          <span className="text-base">🖥️</span>
          <div>
            <div
              onClick={() => {
                setSelectedMonitor(m);
                setFormData(m);
                setDocContent(getInitialDoc(m));
                setViewMode("studio");
              }}
              className="font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors"
              title="Buka di 3-Kolom Studio"
            >
              {m.fullName}
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              {m.brand} • {m.slug}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "tier",
      label: "[ 03 // TIER ]",
      shortLabel: "Tier",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Peringkat",
      getValue: (m) => m.tier,
      renderCell: (m) => (
        <select
          value={m.tier}
          onChange={(e) => handleQuickEditTier(m, e.target.value as TierRating)}
          className="bg-zinc-900 border border-zinc-750 rounded-md px-2 py-1 text-[11px] font-mono font-bold text-amber-300 focus:outline-none cursor-pointer"
        >
          <option value="BEST VALUE">BEST VALUE</option>
          <option value="TOP TIER">TOP TIER</option>
          <option value="VALUE ENTRY">VALUE ENTRY</option>
          <option value="HONORABLE MENTION">HONORABLE MENTION</option>
          <option value="NOT RECOMMENDED">NOT RECOMMENDED</option>
        </select>
      ),
    },
    {
      id: "gtidTolerance",
      label: "[ 04 // GTID TOLERANSI ]",
      shortLabel: "Toleransi GTID",
      minWidth: "min-w-[200px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Uji GTID",
      getValue: (m) => m.responseTimeData?.toleranceNew || "",
      renderCell: (m) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-[#0b2413] text-[#00e676] border border-[#00e676]/30 text-[10px] font-mono font-bold">
            {m.responseTimeData?.toleranceNew || "Toleransi Baru"}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#2b1012] text-[#ff5252] border border-[#ff5252]/30 text-[10px] font-mono font-bold">
            {m.responseTimeData?.toleranceOld || "Toleransi Lama"}
          </span>
        </div>
      ),
    },
    {
      id: "panelSize",
      label: "[ 05 // PANEL & SIZE ]",
      shortLabel: "Panel & Size",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Display",
      getValue: (m) => `${m.specs?.display?.size || ""} ${m.specs?.display?.panelType || ""}`,
      renderCell: (m) => (
        <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-750 font-mono text-[11px] text-zinc-300 whitespace-nowrap">
          {m.specs?.display?.size || "-"} {m.specs?.display?.panelType || ""}
        </span>
      ),
    },
    {
      id: "resolution",
      label: "[ 06 // RESOLUSI ]",
      shortLabel: "Resolusi",
      minWidth: "min-w-[130px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Display",
      getValue: (m) => m.specs?.display?.resolution || "",
      renderCell: (m) => (
        <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-750 font-mono text-[11px] text-zinc-300 whitespace-nowrap">
          {m.specs?.display?.resolution || "FHD"}
        </span>
      ),
    },
    {
      id: "refreshRate",
      label: "[ 07 // REFRESH ]",
      shortLabel: "Refresh",
      minWidth: "min-w-[110px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Display",
      getValue: (m) => m.specs?.display?.refreshRate || 0,
      renderCell: (m) => (
        <span className="px-2 py-0.5 rounded bg-[#10192b] text-[#38bdf8] border border-[#38bdf8]/30 font-mono font-bold text-[11px] whitespace-nowrap">
          {m.specs?.display?.refreshRate || 60}Hz
        </span>
      ),
    },
    {
      id: "customVariables",
      label: "[ 08 // VARIABEL KUSTOM ]",
      shortLabel: "Variabel",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Parameter",
      getValue: (m) => (m.customVariables || []).length,
      renderCell: (m) =>
        m.customVariables && m.customVariables.length > 0 ? (
          <div className="flex items-center gap-1 flex-wrap">
            {m.customVariables.slice(0, 2).map((v) => (
              <span
                key={v.id}
                className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300 text-[9px] font-mono font-bold border border-zinc-700"
                title={`${v.label}: ${v.value}`}
              >
                {v.label}
              </span>
            ))}
            {m.customVariables.length > 2 && (
              <span className="text-[9px] font-mono text-zinc-500">
                +{m.customVariables.length - 2}
              </span>
            )}
          </div>
        ) : (
          <span className="text-zinc-600 font-mono text-[10px]">-</span>
        ),
    },
    {
      id: "subpixel",
      label: "[ 09 // SUBPIXEL LAYOUT ]",
      shortLabel: "Subpixel",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Panel",
      getValue: (m) => m.panelBitDepth || "RGB",
      renderCell: (m) => (
        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-750 font-mono text-[11px] text-zinc-300 whitespace-nowrap">
          {m.panelBitDepth || "Standard RGB"}
        </span>
      ),
    },
    {
      id: "coating",
      label: "[ 10 // COATING LAYAR ]",
      shortLabel: "Coating",
      minWidth: "min-w-[130px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Optik",
      getValue: (m) => m.aspectRatio || "Matte (Anti-Glare)",
      renderCell: (m) => (
        <span className="text-zinc-300 font-mono text-xs whitespace-nowrap">
          Matte 3H (Anti-Glare)
        </span>
      ),
    },
    {
      id: "vrr",
      label: "[ 11 // VRR / SYNC TECH ]",
      shortLabel: "VRR",
      minWidth: "min-w-[150px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Gaming",
      getValue: (m) => m.specs?.features?.syncTech || "Adaptive-Sync",
      renderCell: (m) => (
        <span className="text-cyan-400 font-mono text-[11px] whitespace-nowrap">
          {m.specs?.features?.syncTech || "Adaptive-Sync"}
        </span>
      ),
    },
    {
      id: "colorGamut",
      label: "[ 12 // COLOR GAMUT ]",
      shortLabel: "Gamut",
      minWidth: "min-w-[160px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Warna",
      getValue: (m) => m.specs?.display?.colorGamut || "",
      renderCell: (m) => (
        <span className="text-zinc-300 font-mono text-[11px] whitespace-nowrap">
          {m.specs?.display?.colorGamut || "99% sRGB"}
        </span>
      ),
    },
    {
      id: "ports",
      label: "[ 13 // DISPLAY INPUTS ]",
      shortLabel: "Ports",
      minWidth: "min-w-[170px]",
      sortable: false,
      isDefaultVisible: false,
      category: "Konektivitas",
      getValue: (m) => (m.displayInputs || []).join(", "),
      renderCell: (m) => (
        <span className="text-zinc-400 text-xs truncate max-w-[160px] block" title={(m.displayInputs || []).join(", ")}>
          {(m.displayInputs || []).join(", ") || "HDMI + DP"}
        </span>
      ),
    },
    {
      id: "warranty",
      label: "[ 14 // GARANSI RESMI ]",
      shortLabel: "Garansi",
      minWidth: "min-w-[150px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Purna Jual",
      getValue: (m) => m.specs?.features?.warranty || "",
      renderCell: (m) => (
        <span className="text-emerald-400 font-mono text-[11px] whitespace-nowrap">
          {m.specs?.features?.warranty || "3 Tahun"}
        </span>
      ),
    },
    {
      id: "expertVerdict",
      label: "[ 15 // EXPERT VERDICT GTID ]",
      shortLabel: "Verdict",
      minWidth: "min-w-[220px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Ulasan",
      getValue: (m) => m.expertVerdict || "",
      renderCell: (m) => (
        <span className="text-zinc-300 text-xs line-clamp-2" title={m.expertVerdict}>
          {m.expertVerdict || "-"}
        </span>
      ),
    },
  ], [handleQuickEditPrice, handleQuickEditTier]);

  const tableManager = useDraggableTable<Monitor>({
    storageKey: "monitor_admin_v2",
    columns: monitorColumns,
  });

  const displayMonitors = tableManager.getSortedData(filteredMonitors);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      {notice && (
        <div className="fixed top-16 right-6 z-50 bg-[#203c2b] border border-[#52ba69] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#52ba69]" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Studio Header */}
      <div className="p-6 rounded-3xl bg-[#202020] border border-[#2f2f2f] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d354a] border border-[#2383e2]/40 text-[#58a6ff] text-xs font-bold">
            <Tv className="w-3.5 h-3.5" />
            <span>Monitor Studio & Live Specsheet Editor</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Live Database Monitor & Notion Property Studio
          </h2>
          <p className="text-xs text-[#9b9a97] max-w-2xl leading-relaxed">
            Kelola, edit, dan tambah monitor dengan live preview real-time. Semua 21 properti Notion, toleransi data GTID, dan section ulasan tersinkronisasi instan.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle: Excel Grid vs 3-Column Studio */}
          <div className="flex items-center gap-1 p-1 bg-[#121216] border border-zinc-750 rounded-xl shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode("excel")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "excel"
                  ? "bg-emerald-500 text-black shadow-[2px_2px_0px_#000]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>[ 📊 EXCEL GRID (DRAG & DROP) ]</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("studio")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "studio"
                  ? "bg-cyan-500 text-black shadow-[2px_2px_0px_#000]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>[ 📝 3-KOLOM STUDIO ]</span>
            </button>
          </div>

          <Button
            variant="cyber"
            size="sm"
            onClick={handleCreateNew}
            className="text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Monitor Baru</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (window.confirm("Reset seluruh data monitor ke bawaan Notion (55+ model)?")) {
                const reset = DatabaseService.resetMonitorsToDefault();
                onUpdateMonitors(reset);
                setSelectedMonitor(reset[0] || null);
                if (reset[0]) setFormData(reset[0]);
                showNotification("Database monitor direset ke template default!");
              }
            }}
            className="text-xs text-[#9b9a97] hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </Button>
        </div>
      </div>

      {/* RENDER EXCEL VIEW OR 3-COLUMN STUDIO */}
      {viewMode === "excel" ? (
        <div className="space-y-4 font-sans">
          {/* Excel Controls Bar */}
          <div className="p-4 rounded-2xl bg-[#121217] border-2 border-zinc-800 flex flex-wrap items-center justify-between gap-3 shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari brand, model, panel, resolusi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-750 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Tier Filter */}
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-mono focus:outline-none"
              >
                <option value="all">Semua Tier Rating</option>
                <option value="BEST VALUE">BEST VALUE</option>
                <option value="TOP TIER">TOP TIER</option>
                <option value="VALUE ENTRY">VALUE ENTRY</option>
                <option value="HONORABLE MENTION">HONORABLE MENTION</option>
                <option value="NOT RECOMMENDED">NOT RECOMMENDED</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsColManagerOpen(true)}
                className="text-xs font-mono text-zinc-300 border-zinc-700 hover:border-emerald-500 hover:text-white flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kelola Kolom ({tableManager.visibleColumns.length})</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="text-xs font-mono text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </Button>

              <Button
                type="button"
                variant="cyber"
                size="sm"
                onClick={handleCreateNew}
                className="text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Baris Monitor</span>
              </Button>
            </div>
          </div>

          {/* Drag Hint Banner */}
          <div className="px-4 py-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-300 font-mono">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>MODE EXCEL AKTIF:</strong> Klik header untuk <strong>Sort (Asc/Desc/Reset)</strong>, Drag header kolom untuk <strong>Reorder Kolom</strong>, atau Drag handle <strong>⠿</strong> untuk urutan baris rekomendasi.
              </span>
            </div>
            <span className="text-[11px] text-zinc-400">
              Menampilkan {displayMonitors.length} Monitor {tableManager.sortField && `(Sorted by: ${tableManager.sortField})`}
            </span>
          </div>

          {/* Interactive Excel Spreadsheet Grid */}
          <div className="border-2 border-zinc-800 rounded-2xl overflow-hidden bg-[#0c0c11] shadow-[5px_5px_0px_#000]">
            <div className="overflow-x-auto max-h-[calc(100vh-280px)] no-scrollbar">
              <table className="w-full text-left text-xs border-collapse min-w-[1150px]">
                <thead className="bg-[#050508] text-zinc-300 uppercase text-[10px] font-mono tracking-wider border-b-2 border-zinc-700 sticky top-0 z-20">
                  <tr>
                    <th className="py-3 px-3 w-12 text-center text-zinc-500 font-bold border-r border-zinc-800">[ DRAG ]</th>
                    <th className="py-3 px-3 w-12 text-zinc-500 font-bold border-r border-zinc-800 text-center">[ # ]</th>
                    {tableManager.visibleColumns.map((col) => {
                      const isSorted = tableManager.sortField === col.id;
                      const isDragging = tableManager.draggedColId === col.id;
                      const isOver = tableManager.dragOverColId === col.id;

                      return (
                        <th
                          key={col.id}
                          draggable
                          onDragStart={(e) => tableManager.handleColumnDragStart(col.id, e)}
                          onDragOver={(e) => tableManager.handleColumnDragOver(col.id, e)}
                          onDrop={() => tableManager.handleColumnDrop(col.id)}
                          onClick={() => col.sortable !== false && tableManager.handleSort(col.id)}
                          className={`py-3 px-3 font-mono font-bold text-xs uppercase cursor-pointer select-none transition-colors border-r border-zinc-800 ${
                            col.minWidth || "min-w-[140px]"
                          } ${
                            isDragging
                              ? "opacity-40 bg-emerald-500/20"
                              : isOver
                              ? "border-l-2 border-l-emerald-400 bg-emerald-500/10"
                              : "hover:bg-zinc-800/80"
                          }`}
                          title="Klik untuk sort (Asc/Desc/Reset), atau Drag untuk memindahkan urutan kolom"
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-emerald-400"
                                title="Drag kolom"
                              >
                                <GripVertical className="w-3.5 h-3.5" />
                              </span>
                              <span className="truncate">{col.label}</span>
                            </div>
                            {isSorted ? (
                              <span className="text-emerald-400 font-bold text-[11px] flex-shrink-0">
                                {tableManager.sortDirection === "asc" ? "▲" : "▼"}
                              </span>
                            ) : col.sortable !== false ? (
                              <span className="text-zinc-600 text-[10px] opacity-40 hover:opacity-100 flex-shrink-0">↕</span>
                            ) : null}
                          </div>
                        </th>
                      );
                    })}
                    <th className="py-3 px-4 font-bold min-w-[180px] text-center sticky right-0 bg-[#050508] z-30">[ AKSI ]</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 font-sans">
                  {displayMonitors.map((m, idx) => {
                    const originalIndex = monitors.findIndex((item) => item.id === m.id);
                    const isDragging = draggedIndex === originalIndex;
                    const isDragOver = dragOverIndex === originalIndex;

                    return (
                      <tr
                        key={m.id}
                        draggable={tableManager.sortField === null}
                        onDragStart={(e) => {
                          if (tableManager.sortField !== null) return;
                          setDraggedIndex(originalIndex);
                          e.dataTransfer.setData("text/plain", `${originalIndex}`);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragOver={(e) => {
                          if (tableManager.sortField !== null) return;
                          e.preventDefault();
                          if (dragOverIndex !== originalIndex) setDragOverIndex(originalIndex);
                        }}
                        onDragLeave={() => {
                          if (dragOverIndex === originalIndex) setDragOverIndex(null);
                        }}
                        onDrop={(e) => {
                          if (tableManager.sortField !== null) return;
                          e.preventDefault();
                          handleRowDrop(originalIndex);
                        }}
                        onDragEnd={() => {
                          setDraggedIndex(null);
                          setDragOverIndex(null);
                        }}
                        className={`group transition-all hover:bg-zinc-800/40 ${
                          isDragging ? "opacity-30 border-2 border-dashed border-emerald-400 bg-emerald-950/40" : ""
                        } ${isDragOver ? "border-t-4 border-t-emerald-400 bg-emerald-950/20" : ""}`}
                      >
                        {/* Drag Handle */}
                        <td className="py-2.5 px-3 text-center border-r border-zinc-800/60">
                          <div
                            className={`p-1.5 text-zinc-500 hover:text-emerald-400 transition-colors inline-flex rounded-lg hover:bg-zinc-800 ${
                              tableManager.sortField !== null
                                ? "opacity-30 cursor-not-allowed"
                                : "cursor-grab active:cursor-grabbing"
                            }`}
                            title={
                              tableManager.sortField !== null
                                ? "Reset sorting kolom untuk mengatur urutan baris manual"
                                : "Klik dan geser (drag) untuk memindahkan urutan rekomendasi"
                            }
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                        </td>

                        {/* Row Number */}
                        <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-500 font-bold border-r border-zinc-800/60 text-center">
                          #{idx + 1}
                        </td>

                        {/* Dynamic Draggable & Sortable Columns */}
                        {tableManager.visibleColumns.map((col) => (
                          <td key={col.id} className="py-2.5 px-3 border-r border-zinc-800/60 align-middle">
                            {col.renderCell(m, idx)}
                          </td>
                        ))}

                        {/* Aksi Sticky */}
                        <td className="py-2.5 px-4 sticky right-0 bg-[#0c0c11] group-hover:bg-[#14141c] z-10">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMonitor(m);
                                setFormData(m);
                                setDocContent(getInitialDoc(m));
                                setViewMode("studio");
                              }}
                              className="text-[11px] font-mono font-bold text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/10 h-7 px-2"
                              title="Buka 3-Kolom Studio"
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              <span>Studio</span>
                            </Button>

                            <button
                              type="button"
                              onClick={() => onPreviewSidePanel(m)}
                              className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-400"
                              title="Preview Side Panel"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDuplicate(m)}
                              className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                              title="Duplikat Baris"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(m.id)}
                              className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400"
                              title="Hapus Monitor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Main 3-Column Studio Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* COLUMN 1: MONITOR LIST SELECTOR (3 Cols)                                   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 rounded-2xl bg-[#171717] border border-[#2a2a2a] p-4 space-y-3 shadow-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Daftar Monitor</span>
              <span className="px-2 py-0.5 rounded-full bg-[#252525] text-[#9b9a97] text-[10px] font-mono">
                {monitors.length} Total
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari monitor..."
                className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
              />
            </div>

            {/* Tier Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              {["all", "S-TIER", "BEST VALUE", "RECOMMENDED", "PASS"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap transition-colors ${
                    tierFilter === tier
                      ? "bg-[#252525] text-white border border-[#3f3f3f]"
                      : "text-[#787774] hover:text-[#d4d4d4]"
                  }`}
                >
                  {tier === "all" ? "Semua" : tier}
                </button>
              ))}
            </div>
          </div>

          {/* List items */}
          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredMonitors.map((m) => {
              const isSelected = selectedMonitor?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => handleSelectMonitor(m)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-[#202020] border-[#2383e2] shadow-md"
                      : "bg-[#141414] border-[#262626] hover:border-[#333] hover:bg-[#1a1a1a]"
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] text-[#787774] font-bold uppercase tracking-wider block">
                      {m.brand}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {m.fullName}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#52ba69]">
                      <span>{formatRupiah(m.price)}</span>
                      <span className="text-[#787774]">•</span>
                      <span className="text-[#9b9a97]">{m.specs?.display?.refreshRate}Hz</span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                      m.tier === "S-TIER"
                        ? "bg-[#203c2b] text-[#52ba69]"
                        : m.tier === "BEST VALUE"
                        ? "bg-[#1d354a] text-[#58a6ff]"
                        : m.tier === "RECOMMENDED"
                        ? "bg-[#203c2b] text-[#52ba69]"
                        : "bg-[#442224] text-[#eb5757]"
                    }`}
                  >
                    {m.tier}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 2: NOTION / WORD DOCUMENT-CENTRIC RECOMMENDATION STUDIO (5 Cols)   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 rounded-2xl bg-[#171717] border border-[#2a2a2a] p-5 space-y-4 shadow-lg">
          {/* 1. Header Action Row & Notion Page Title */}
          <div className="space-y-2 border-b border-[#2a2a2a] pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🖥️</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Notion / Word Document Mode
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {selectedMonitor && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(selectedMonitor)}
                      className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#2c2c2c] text-[#9b9a97] hover:text-[#58a6ff] transition-colors"
                      title="Duplikat Monitor"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedMonitor.id)}
                      className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#2c2c2c] text-[#9b9a97] hover:text-rose-400 transition-colors"
                      title="Hapus Monitor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="cyber"
                  onClick={handleSave}
                  className="text-xs font-bold flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-black shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </Button>
              </div>
            </div>

            {/* Notion Big Title Input */}
            <div>
              <input
                type="text"
                value={formData.fullName || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                    model: e.target.value,
                  })
                }
                placeholder="Judul Monitor (contoh: LG UltraGear 27GP850-B)..."
                className="w-full bg-transparent text-base sm:text-lg font-black text-white placeholder-zinc-600 focus:outline-none focus:border-b focus:border-emerald-500 py-1"
                required
              />
            </div>
          </div>

          {/* 2. Compact Notion Properties Block */}
          <div className="bg-[#121214] border border-[#262626] rounded-xl p-3 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#787774] uppercase tracking-wider pb-1 border-b border-[#222]">
              <span>PROPERTI REKOMENDASI (NOTION FIELDS)</span>
              <span className="font-mono text-zinc-500">Auto-Synced</span>
            </div>

            {/* Brand & Tier */}
            <div className="grid grid-cols-12 items-center gap-2">
              <span className="col-span-4 text-[#9b9a97] font-medium flex items-center gap-1">
                <span>🏷️</span>
                <span>Brand</span>
              </span>
              <div className="col-span-8">
                <input
                  type="text"
                  value={formData.brand || ""}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Xiaomi, AOC, LG, Asus..."
                  className="w-full bg-[#1b1b1e] border border-[#2e2e33] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Tier Selector Pills */}
            <div className="grid grid-cols-12 items-center gap-2">
              <span className="col-span-4 text-[#9b9a97] font-medium flex items-center gap-1">
                <span>⭐</span>
                <span>Tier Rekomendasi</span>
              </span>
              <div className="col-span-8 flex items-center gap-1.5 flex-wrap">
                {(["S-TIER", "BEST VALUE", "RECOMMENDED", "PASS"] as TierRating[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, tier: t })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      formData.tier === t
                        ? t === "S-TIER"
                          ? "bg-emerald-500 text-black shadow-sm font-black"
                          : t === "BEST VALUE"
                          ? "bg-amber-500 text-black shadow-sm font-black"
                          : t === "RECOMMENDED"
                          ? "bg-cyan-500 text-black shadow-sm font-black"
                          : "bg-rose-500 text-white shadow-sm font-black"
                        : "bg-[#1b1b1e] text-[#787774] border border-[#2e2e33] hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Harga & Target */}
            <div className="grid grid-cols-12 items-center gap-2">
              <span className="col-span-4 text-[#9b9a97] font-medium flex items-center gap-1">
                <span>💵</span>
                <span>Harga Pasar & Target</span>
              </span>
              <div className="col-span-8 grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[#787774]">Rp</span>
                  <input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="Harga pasar"
                    className="w-full bg-[#1b1b1e] border border-emerald-500/40 rounded-lg pl-6 pr-2 py-1 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[#787774]">Rp</span>
                  <input
                    type="number"
                    value={formData.recommendedPrice || ""}
                    onChange={(e) => setFormData({ ...formData, recommendedPrice: Number(e.target.value) })}
                    placeholder="Target beli"
                    className="w-full bg-[#1b1b1e] border border-cyan-500/40 rounded-lg pl-6 pr-2 py-1 text-xs font-mono font-bold text-cyan-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Toko Affiliate Links */}
            <div className="grid grid-cols-12 items-center gap-2">
              <span className="col-span-4 text-[#9b9a97] font-medium flex items-center gap-1">
                <span>🛒</span>
                <span>Link Toko Affiliate</span>
              </span>
              <div className="col-span-8 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.linkShopee || ""}
                  onChange={(e) => setFormData({ ...formData, linkShopee: e.target.value })}
                  placeholder="URL Shopee..."
                  className="w-full bg-[#1b1b1e] border border-[#2e2e33] rounded-lg px-2 py-1 text-xs text-orange-300 focus:outline-none focus:border-orange-400"
                />
                <input
                  type="text"
                  value={formData.linkTokopedia || ""}
                  onChange={(e) => setFormData({ ...formData, linkTokopedia: e.target.value })}
                  placeholder="URL Tokopedia..."
                  className="w-full bg-[#1b1b1e] border border-[#2e2e33] rounded-lg px-2 py-1 text-xs text-emerald-300 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Video Review GTID */}
            <div className="grid grid-cols-12 items-center gap-2">
              <span className="col-span-4 text-[#9b9a97] font-medium flex items-center gap-1">
                <span>📺</span>
                <span>Review YouTube GTID</span>
              </span>
              <div className="col-span-8">
                <input
                  type="text"
                  value={formData.gtidReviewUrl || ""}
                  onChange={(e) => setFormData({ ...formData, gtidReviewUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-[#1b1b1e] border border-[#2e2e33] rounded-lg px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            {/* Foto Monitor Depan & Belakang with Upload / Paste */}
            <div className="grid grid-cols-12 items-center gap-2 pt-1">
              <span className="col-span-4 text-[#9b9a97] font-medium flex items-center gap-1">
                <span>🖼️</span>
                <span>Foto Depan & Belakang</span>
              </span>
              <div className="col-span-8 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.frontImage || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      frontImage: e.target.value,
                      thumbnail: e.target.value,
                    })
                  }
                  placeholder="Tampak depan (URL / Ctrl+V)"
                  className="w-full bg-[#1b1b1e] border border-[#2e2e33] rounded-lg px-2 py-1 text-[11px] text-zinc-300 focus:outline-none"
                />
                <input
                  type="text"
                  value={formData.rearImage || ""}
                  onChange={(e) => setFormData({ ...formData, rearImage: e.target.value })}
                  placeholder="Tampak belakang (URL / Ctrl+V)"
                  className="w-full bg-[#1b1b1e] border border-[#2e2e33] rounded-lg px-2 py-1 text-[11px] text-zinc-300 focus:outline-none"
                />
              </div>
            </div>

            {/* Collapsible Accordion: 21 Specs & Toleransi GTID */}
            <div className="pt-1.5 border-t border-[#222]">
              <button
                type="button"
                onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#1b1b1e] hover:bg-[#252529] text-zinc-300 hover:text-white transition-colors text-xs font-semibold border border-[#2e2e33]"
              >
                <div className="flex items-center gap-2">
                  <span>⚙️</span>
                  <span>21 Parameter Spesifikasi Layar & Data GTID</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  {isSpecsExpanded ? "▲ [ Tutup Spek ]" : "▼ [ Buka 21 Spek ]"}
                </span>
              </button>

              {isSpecsExpanded && (
                <div className="mt-2 p-3 rounded-xl bg-black/60 border border-[#2a2a2a] space-y-2.5 animate-in fade-in slide-in-from-top-1 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-0.5">Ukuran Panel</label>
                      <input
                        type="text"
                        value={formData.specs?.display?.size || "24 Inch"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specs: {
                              ...formData.specs!,
                              display: { ...formData.specs!.display, size: e.target.value },
                            },
                          })
                        }
                        placeholder="24 Inch or 27 Inch"
                        className="w-full bg-[#171717] border border-[#2a2a2a] rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-0.5">Resolusi</label>
                      <input
                        type="text"
                        value={formData.specs?.display?.resolution || "1920x1080 (FHD)"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specs: {
                              ...formData.specs!,
                              display: { ...formData.specs!.display, resolution: e.target.value },
                            },
                          })
                        }
                        placeholder="1920x1080 (FHD)"
                        className="w-full bg-[#171717] border border-[#2a2a2a] rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-0.5">Tipe Panel</label>
                      <input
                        type="text"
                        value={formData.specs?.display?.panelType || "Fast IPS"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specs: {
                              ...formData.specs!,
                              display: { ...formData.specs!.display, panelType: e.target.value },
                            },
                          })
                        }
                        placeholder="Fast IPS / OLED / VA"
                        className="w-full bg-[#171717] border border-[#2a2a2a] rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-0.5">Refresh Rate (Hz)</label>
                      <input
                        type="number"
                        value={formData.specs?.display?.refreshRate || 180}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specs: {
                              ...formData.specs!,
                              display: { ...formData.specs!.display, refreshRate: Number(e.target.value) },
                            },
                          })
                        }
                        className="w-full bg-[#171717] border border-[#2a2a2a] rounded-lg px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-emerald-400 block mb-0.5">Toleransi Baru (Data Baru GTID)</label>
                      <input
                        type="text"
                        value={formData.responseTimeData?.toleranceNew || "Toleransi Baru (5 RGB)"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            responseTimeData: {
                              ...formData.responseTimeData,
                              toleranceNew: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-[#171717] border border-emerald-500/40 rounded-lg px-2 py-1 text-xs text-emerald-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-rose-400 block mb-0.5">Toleransi Lama (Data Lama GTID)</label>
                      <input
                        type="text"
                        value={formData.responseTimeData?.toleranceOld || "Toleransi Lama (10 RGB)"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            responseTimeData: {
                              ...formData.responseTimeData,
                              toleranceOld: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-[#171717] border border-rose-500/40 rounded-lg px-2 py-1 text-xs text-rose-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-0.5">Aspect Ratio</label>
                      <input
                        type="text"
                        value={formData.aspectRatio || "16:9 (Wide)"}
                        onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                        className="w-full bg-[#171717] border border-[#2a2a2a] rounded-lg px-2 py-1 text-[11px] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-0.5">Curvature</label>
                      <input
                        type="text"
                        value={formData.curvature || "None"}
                        onChange={(e) => setFormData({ ...formData, curvature: e.target.value })}
                        className="w-full bg-[#171717] border border-[#2a2a2a] rounded-lg px-2 py-1 text-[11px] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-0.5">Panel Bit Depth</label>
                      <input
                        type="text"
                        value={formData.panelBitDepth || "8 Bit"}
                        onChange={(e) => setFormData({ ...formData, panelBitDepth: e.target.value })}
                        className="w-full bg-[#171717] border border-[#2a2a2a] rounded-lg px-2 py-1 text-[11px] text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-0.5">Stand Capability</label>
                      <input
                        type="text"
                        value={formData.standCapability || "Tilt"}
                        onChange={(e) => setFormData({ ...formData, standCapability: e.target.value })}
                        placeholder="Tilt / HAS"
                        className="w-full bg-[#171717] border border-[#2a2a2a] rounded-lg px-2 py-1 text-[11px] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-0.5">Display Inputs (Koma)</label>
                      <input
                        type="text"
                        value={(formData.displayInputs || ["HDMI 1.4", "HDMI 2.0"]).join(", ")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            displayInputs: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="HDMI 2.0, DP 1.4"
                        className="w-full bg-[#171717] border border-[#2a2a2a] rounded-lg px-2 py-1 text-[11px] text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2.5. VARIABEL & KOLOM DATA MODULAR MONITOR */}
          <div className="p-4 rounded-xl bg-[#121219] border-2 border-zinc-800 space-y-3 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  [ 📊 VARIABEL & KOLOM DATA MODULAR MONITOR ]
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                {(formData.customVariables || []).length} Variabel Kustom
              </span>
            </div>

            <p className="text-[11px] text-zinc-400">
              Tambahkan variabel/kolom data baru untuk monitor ini (misal: KVM Switch, Type-C 65W PD, Mini-LED 1152 Zones, Coating Layar, dll).
            </p>

            {/* Active Variables List */}
            {(formData.customVariables || []).length > 0 && (
              <div className="space-y-1.5 pt-1">
                {formData.customVariables!.map((v, idx) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between bg-zinc-900 border border-zinc-750 px-3 py-1.5 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] font-mono text-cyan-400 uppercase font-bold">
                        {v.category || "Fitur"}
                      </span>
                      <span className="font-bold text-white font-mono">{v.label}:</span>
                      <span className="text-emerald-400 font-semibold">{v.value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (formData.customVariables || []).filter((_, i) => i !== idx);
                        setFormData({ ...formData, customVariables: updated });
                      }}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                      title="Hapus Variabel Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Variable Form Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-zinc-800/80">
              <input
                type="text"
                placeholder="Nama Variabel / Kolom (e.g. KVM Switch)..."
                value={newVarLabel}
                onChange={(e) => setNewVarLabel(e.target.value)}
                className="sm:col-span-5 bg-zinc-900 border border-zinc-750 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Nilai Data (e.g. Ya (2 PC), 65W PD)..."
                value={newVarValue}
                onChange={(e) => setNewVarValue(e.target.value)}
                className="sm:col-span-4 bg-zinc-900 border border-zinc-750 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-cyan-500"
              />
              <select
                value={newVarCategory}
                onChange={(e) => setNewVarCategory(e.target.value)}
                className="sm:col-span-3 bg-zinc-900 border border-zinc-750 rounded-lg px-2 py-1.5 text-xs text-amber-400 font-mono focus:outline-none"
              >
                <option value="Display & Panel">Display</option>
                <option value="Konektivitas">Port / Colokan</option>
                <option value="Fitur Gaming">Gaming</option>
                <option value="Uji Lab GTID">Lab GTID</option>
                <option value="Ergonomi">Ergonomi</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              {/* Preset Quick Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">PRESET:</span>
                {[
                  { l: "KVM Switch", v: "Support (2 PC)", c: "Fitur Gaming" },
                  { l: "Type-C PD", v: "65W PD + DP Alt", c: "Konektivitas" },
                  { l: "Mini-LED Zones", v: "1152 Zones", c: "Display & Panel" },
                  { l: "Coating Layar", v: "Matte 3H Anti-Glare", c: "Display & Panel" },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const newVar = {
                        id: `var_${Date.now()}_${idx}`,
                        label: p.l,
                        value: p.v,
                        category: p.c,
                      };
                      const updated = [...(formData.customVariables || []), newVar];
                      setFormData({ ...formData, customVariables: updated });
                      showNotification(`Variabel "${p.l}" berhasil ditambahkan.`);
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-750 hover:border-cyan-500/60 text-cyan-300 transition-colors"
                  >
                    + {p.l}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="cyber"
                  size="sm"
                  onClick={() => {
                    if (!newVarLabel.trim() || !newVarValue.trim()) {
                      alert("Harap isi nama variabel dan nilainya.");
                      return;
                    }
                    const newVar = {
                      id: `var_${Date.now()}`,
                      label: newVarLabel.trim(),
                      value: newVarValue.trim(),
                      category: newVarCategory,
                    };
                    const updated = [...(formData.customVariables || []), newVar];
                    setFormData({ ...formData, customVariables: updated });
                    setNewVarLabel("");
                    setNewVarValue("");
                    showNotification(`Variabel "${newVar.label}" berhasil ditambahkan.`);
                  }}
                  className="text-xs font-mono font-bold px-3 py-1 flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Tambah Variabel</span>
                </Button>

                {(formData.customVariables || []).length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const vars = formData.customVariables || [];
                      if (vars.length === 0) return;
                      const tableHtml = `
<div class="notion-table-wrapper my-4 overflow-x-auto">
  <table class="notion-visual-table w-full border-collapse rounded-xl overflow-hidden border border-zinc-800 shadow-[3px_3px_0px_#000] text-xs font-sans">
    <thead>
      <tr class="bg-[#050508] border-b-2 border-zinc-700 text-zinc-300 font-mono text-[11px] tracking-wider uppercase">
        <th class="px-3.5 py-3 text-left font-bold border-r border-zinc-800">[ 01 // KATEGORI ]</th>
        <th class="px-3.5 py-3 text-left font-bold border-r border-zinc-800">[ 02 // PARAMETER / VARIABEL ]</th>
        <th class="px-3.5 py-3 text-left font-bold">[ 03 // NILAI SPESIFIKASI ]</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-zinc-800/80 bg-[#0c0c11]">
      ${vars
        .map(
          (v) => `
      <tr class="hover:bg-zinc-800/40 transition-colors">
        <td class="px-3.5 py-2.5 border-r border-zinc-800/60 font-mono text-cyan-400 font-bold uppercase text-[10px]">${
          v.category || "Spesifikasi"
        }</td>
        <td class="px-3.5 py-2.5 border-r border-zinc-800/60 font-semibold text-white">${
          v.label
        }</td>
        <td class="px-3.5 py-2.5 text-emerald-400 font-mono font-bold">${v.value}</td>
      </tr>`
        )
        .join("")}
    </tbody>
  </table>
</div>
<p><br></p>`;
                      setDocContent((prev) => prev + tableHtml);
                      setFormData((prev) => ({
                        ...prev,
                        deepDiveDescription: (prev.deepDiveDescription || "") + tableHtml,
                      }));
                      showNotification("Tabel variabel berhasil disisipkan ke dokumen ulasan.");
                    }}
                    className="text-xs font-mono text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10 flex items-center gap-1"
                  >
                    <TableIcon className="w-3 h-3" />
                    <span>Sisipkan ke Dokumen</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* 3. Word / Notion Document Canvas (Main Body) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-[11px]">
                <span>📝</span>
                <span>Dokumen Ulasan & Verdict (Word / Notion Canvas)</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const snippet = `<div class="notion-callout notion-callout-amber"><span class="notion-callout-icon">💡</span><div class="notion-callout-content"><strong>GTID Tech Verdict:</strong><br>Motion clarity sangat baik pada toleransi 5 RGB, akurasi warna tinggi di mode sRGB.</div></div><p><br></p>`;
                    setDocContent((prev) => prev + snippet);
                    setFormData((prev) => ({
                      ...prev,
                      deepDiveDescription: (prev.deepDiveDescription || "") + snippet,
                    }));
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 font-semibold transition-colors"
                >
                  + Verdict Callout
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const snippet = `<ul class="notion-task-list"><li class="notion-task-item"><span class="notion-checkbox checked">☑</span><span><strong>[PLUS]</strong> Panel Fast IPS responsif & warna akurat</span></li><li class="notion-task-item"><span class="notion-checkbox">☐</span><span><strong>[MINUS]</strong> Stand bawaan belum height adjustable</span></li></ul><p><br></p>`;
                    setDocContent((prev) => prev + snippet);
                    setFormData((prev) => ({
                      ...prev,
                      deepDiveDescription: (prev.deepDiveDescription || "") + snippet,
                    }));
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 font-semibold transition-colors"
                >
                  + Pros/Cons Checklist
                </button>
                <button
                  type="button"
                  onClick={() => setIsTableBuilderOpen(true)}
                  className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 font-semibold font-mono transition-colors flex items-center gap-1"
                >
                  <TableIcon className="w-3 h-3" />
                  <span>+ Modular Tabel GTID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsWordDocsOpen(true)}
                  className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 font-semibold font-mono transition-colors flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3 h-3" />
                  <span>[ 📝 Word / Docs Canvas ]</span>
                </button>
              </div>
            </div>

            {/* Notion Rich Editor Component (WYSIWYG Word/Notion Canvas) */}
            <div className="border border-[#2a2a2a] rounded-xl overflow-hidden bg-black shadow-inner">
              <NotionRichEditor
                value={docContent}
                onChange={(val) => {
                  setDocContent(val);
                  setFormData((prev) => ({
                    ...prev,
                    deepDiveDescription: val,
                  }));
                }}
                minHeight="min-h-[380px]"
                placeholder="Ketik ulasan, verdict, atau analisis lab di sini layaknya dokumen Word / Notion... (Bisa langsung Ctrl+V paste gambar hasil tes lab)"
                allowImageUpload={true}
              />
            </div>
            <p className="text-[10px] text-[#787774]">
              💡 Tips: Blok teks untuk styling cepat, ketik <kbd className="px-1 py-0.5 rounded bg-[#202020] text-zinc-300">/</kbd> untuk menu cepat, atau tekan <kbd className="px-1 py-0.5 rounded bg-[#202020] text-zinc-300">Ctrl+V</kbd> untuk paste gambar pengujian lab langsung.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 3: REAL-TIME NOTION SIDE-PEEK PREVIEW (4 Cols)                      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 rounded-2xl bg-[#191919] border border-[#2a2a2a] p-5 space-y-4 shadow-xl overflow-y-auto max-h-[750px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3 text-xs text-[#9b9a97]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#52ba69] animate-pulse" />
              <span className="font-bold text-[#e0e0e0] uppercase tracking-wider text-[10px]">
                Live Side-Peek Preview
              </span>
            </div>
            {selectedMonitor && (
              <button
                type="button"
                onClick={() => onPreviewSidePanel(selectedMonitor)}
                className="text-[10px] text-[#58a6ff] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Buka Panel Penuh</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Title & Icon Header */}
          <div className="space-y-1">
            <div className="text-3xl">🖥️</div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">
              {formData.fullName || "Nama Monitor"}
            </h1>
          </div>

          {/* Notion Property Table (Exact 1:1 format) */}
          <div className="space-y-1.5 text-xs border-y border-[#2a2a2a] py-3 text-[#9b9a97]">
            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Kisaran Harga</span>
              <span className="col-span-7 font-mono font-bold text-white text-[11px]">
                IDR {(formData.price || 0).toLocaleString("en-US")}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Aspect Ratio</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#1d354a] text-[#58a6ff] text-[10px] font-medium">
                  {formData.aspectRatio || "16:9 (Wide)"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Curvature</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#442224] text-[#eb5757] text-[10px] font-medium">
                  {formData.curvature || "None"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Display Input</span>
              <div className="col-span-7 flex items-center gap-1 flex-wrap">
                {(formData.displayInputs || ["HDMI 1.4", "HDMI 2.0"]).map((inp, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      idx === 0 ? "bg-[#203c2b] text-[#52ba69]" : "bg-[#3b2344] text-[#d157eb]"
                    }`}
                  >
                    {inp}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Panel Bit Depth</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#2f2f2f] text-[#d4d4d4] text-[10px] font-medium">
                  {formData.panelBitDepth || "8 Bit"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Panel Size</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#442c1d] text-[#e07936] text-[10px] font-medium">
                  {formData.specs?.display?.size || "24 Inch"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Refresh Rate</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#203c2b] text-[#52ba69] text-[10px] font-mono font-medium">
                  {formData.specs?.display?.refreshRate || 180}Hz
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">Resolution</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#442224] text-[#eb5757] text-[10px] font-medium">
                  {formData.specs?.display?.resolution || "1920x1080 (FHD)"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2 py-0.5">
              <span className="col-span-5 text-[#787774] font-medium">STATUS</span>
              <div className="col-span-7">
                <span className="px-2 py-0.5 rounded bg-[#203c2b] text-[#52ba69] text-[10px] font-bold">
                  {formData.tier || "RECOMMENDED"}
                </span>
              </div>
            </div>

            {/* Render Custom Variables in Preview if present */}
            {formData.customVariables && formData.customVariables.length > 0 && (
              <div className="pt-2 border-t border-zinc-800 space-y-1">
                <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  // VARIABEL & FITUR MODULAR:
                </span>
                {formData.customVariables.map((v) => (
                  <div key={v.id} className="grid grid-cols-12 items-center gap-2 py-0.5">
                    <span className="col-span-5 text-zinc-400 font-medium truncate text-[11px]" title={v.label}>
                      {v.label}
                    </span>
                    <div className="col-span-7">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                        {v.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photo Gallery Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#787774] uppercase">Section Foto Monitor</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#202020] border border-[#2f2f2f]">
                <img
                  src={formData.frontImage || formData.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop"}
                  alt="Front"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] text-white">
                  Depan
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#202020] border border-[#2f2f2f]">
                <img
                  src={formData.rearImage || formData.thumbnail || "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop"}
                  alt="Rear"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] text-white">
                  Belakang
                </div>
              </div>
            </div>
          </div>

          {/* Video Preview if provided */}
          {formData.gtidReviewUrl && (
            <div className="p-3 rounded-xl bg-[#202020] border border-[#2f2f2f] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-white font-bold">
                <Youtube className="w-4 h-4 text-rose-500" />
                <span>Video Review GTID Terhubung</span>
              </div>
              <p className="text-[10px] text-[#9b9a97] truncate">{formData.gtidReviewUrl}</p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Modular Table Builder Dialog */}
      <ModularTableBuilder
        isOpen={isTableBuilderOpen}
        onClose={() => setIsTableBuilderOpen(false)}
        onInsertTable={(tableHtml) => {
          setDocContent((prev) => prev + tableHtml);
          setFormData((prev) => ({
            ...prev,
            deepDiveDescription: (prev.deepDiveDescription || "") + tableHtml,
          }));
          showNotification("Tabel modular laboratorium GTID berhasil disisipkan.");
        }}
        initialPreset="monitor"
      />

      {/* Table Column Manager Modal */}
      <TableColumnManagerModal
        isOpen={isColManagerOpen}
        onClose={() => setIsColManagerOpen(false)}
        title="Manajemen Kolom Tabel Monitor"
        columns={tableManager.columns}
        columnOrder={tableManager.columnOrder}
        columnVisibility={tableManager.columnVisibility}
        onToggleVisibility={tableManager.toggleColumnVisibility}
        onMoveColumn={tableManager.moveColumn}
        onResetColumns={tableManager.resetColumns}
      />

      {/* Full Word / Google Docs Canvas Studio */}
      {isWordDocsOpen && (
        <WordDocsStudio
          isOpen={isWordDocsOpen}
          modeType="guide"
          initialData={{
            id: formData.id || `mon-${Date.now()}`,
            title: formData.fullName || "Ulasan Monitor",
            category: formData.tier || "BEST VALUE",
            content: docContent,
            tags: formData.tags || [],
            description: formData.introduction || "",
          }}
          onSave={(savedDoc) => {
            setDocContent(savedDoc.content);
            if (savedDoc.title) {
              setFormData((prev) => ({ ...prev, fullName: savedDoc.title }));
            }
            setIsWordDocsOpen(false);
            showNotification("Dokumen ulasan monitor berhasil diperbarui.");
          }}
          onClose={() => setIsWordDocsOpen(false)}
          availableCategories={["BEST VALUE", "TOP TIER", "VALUE ENTRY", "HONORABLE MENTION", "NOT RECOMMENDED"]}
        />
      )}
    </div>
  );
}
