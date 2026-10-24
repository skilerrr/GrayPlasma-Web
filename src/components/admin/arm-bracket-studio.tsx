"use client";

import React, { useState, useMemo } from "react";
import {
  Wrench,
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  ExternalLink,
  Copy,
  Table as TableIcon,
  LayoutGrid,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
  ChevronRight,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { PeripheralItem, PeripheralCategory } from "@/data/grayplasma-desk-peripherals";
import { DatabaseService } from "@/lib/db-service";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDraggableTable, TableColumnDef } from "@/hooks/use-draggable-table";
import { TableColumnManagerModal } from "@/components/ui/table-column-manager-modal";
import { PeripheralFormModal } from "@/components/admin/peripheral-form-modal";

interface ArmBracketStudioProps {
  peripherals: PeripheralItem[];
  onUpdatePeripherals: (items: PeripheralItem[]) => void;
}

type StudioSubTab = "arms" | "brackets" | "accessories" | "all";
type StatusFilter = "all" | "published" | "draft";

export function ArmBracketStudio({
  peripherals,
  onUpdatePeripherals,
}: ArmBracketStudioProps) {
  const [subTab, setSubTab] = useState<StudioSubTab>("arms");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [notice, setNotice] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PeripheralItem | null>(null);
  const [isColManagerOpen, setIsColManagerOpen] = useState(false);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Helper to categorize item
  const isArm = (p: PeripheralItem) => {
    const cat = (p.category || "").toLowerCase();
    const type = (p.type || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    return (
      cat.includes("arm") ||
      type.includes("arm") ||
      name.includes("arm") ||
      name.includes("p100e") ||
      name.includes("p200e") ||
      name.includes("f80") ||
      name.includes("f100a")
    );
  };

  const isBracket = (p: PeripheralItem) => {
    const cat = (p.category || "").toLowerCase();
    const type = (p.type || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    return (
      (cat.includes("bracket") ||
        type.includes("bracket") ||
        cat.includes("stand") ||
        type.includes("stand") ||
        name.includes("bracket") ||
        name.includes("protektor") ||
        name.includes("ev06") ||
        name.includes("p810") ||
        name.includes("lynx") ||
        name.includes("mount")) &&
      !isArm(p)
    );
  };

  const isAccessory = (p: PeripheralItem) => {
    return !isArm(p) && !isBracket(p);
  };

  // Metrics
  const armItems = useMemo(() => peripherals.filter(isArm), [peripherals]);
  const bracketItems = useMemo(() => peripherals.filter(isBracket), [peripherals]);
  const accessoryItems = useMemo(() => peripherals.filter(isAccessory), [peripherals]);

  const liveCount = useMemo(
    () => peripherals.filter((p) => p.isPublished !== false).length,
    [peripherals]
  );
  const draftCount = peripherals.length - liveCount;

  // Distinct Brands
  const distinctBrands = useMemo(() => {
    const set = new Set<string>();
    peripherals.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [peripherals]);

  // Filtered List
  const filteredItems = useMemo(() => {
    return peripherals.filter((p) => {
      // 1. Tab filter
      if (subTab === "arms" && !isArm(p)) return false;
      if (subTab === "brackets" && !isBracket(p)) return false;
      if (subTab === "accessories" && !isAccessory(p)) return false;

      // 2. Status filter
      const isLive = p.isPublished !== false;
      if (statusFilter === "published" && !isLive) return false;
      if (statusFilter === "draft" && isLive) return false;

      // 3. Brand filter
      if (selectedBrand !== "all" && p.brand !== selectedBrand) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.verdict && p.verdict.toLowerCase().includes(q)) ||
          (p.notes && p.notes.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [peripherals, subTab, statusFilter, selectedBrand, searchQuery]);

  // 1-Click Quick Toggle Visibility
  const handleTogglePublish = async (item: PeripheralItem) => {
    const newStatus = item.isPublished === false ? true : false;
    const updated = { ...item, isPublished: newStatus };
    const newList = await DatabaseService.savePeripheral(updated);
    onUpdatePeripherals(newList);
    showNotice(
      newStatus
        ? `✅ "${item.name}" sekarang AKTIF (Live di website publik).`
        : `⏸️ "${item.name}" sekarang NONAKTIF (Draft / Disembunyikan).`
    );
  };

  // Delete
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus "${name}" dari database?`)) {
      const newList = await DatabaseService.deletePeripheral(id);
      onUpdatePeripherals(newList);
      showNotice(`Produk "${name}" berhasil dihapus.`);
    }
  };

  // Duplicate
  const handleDuplicate = async (item: PeripheralItem) => {
    const dup: PeripheralItem = {
      ...item,
      id: `per-${Date.now()}`,
      name: `${item.name} (Copy)`,
      isPublished: false, // Default copy to draft
    };
    const newList = await DatabaseService.savePeripheral(dup);
    onUpdatePeripherals(newList);
    showNotice(`Duplikat "${dup.name}" berhasil dibuat (Status: Draft).`);
  };

  // Open Create with Pre-filled Type
  const handleStartCreate = (defaultCategory: PeripheralCategory = "Monitor Arm") => {
    let prefilledType = "Monitor Arm";
    let prefilledBrand = "Oximus";
    let prefilledRec = "Monitor 24\" - 27\"";

    if (defaultCategory === "Bracket & Mount") {
      prefilledType = "Bracket Jepit Meja / Stand";
      prefilledRec = "Meja Tipis & Setup Ergonomi";
    } else if (defaultCategory === "Kabel HDMI / DP") {
      prefilledType = "DisplayPort 1.4 / HDMI 2.1";
      prefilledBrand = "Cabletime";
      prefilledRec = "Monitor Gaming 144Hz - 240Hz";
    }

    setEditingItem({
      id: `per-${Date.now()}`,
      name: "",
      category: defaultCategory,
      price: 250000,
      brand: prefilledBrand,
      type: prefilledType,
      versionDetail: "Versi Standar",
      warranty: "1 Tahun Resmi",
      verdict: "Ulasan analisis teknis GrayPlasma...",
      notes: "Catatan kompabilitas atau pemasangan...",
      shopeeUrl: "",
      tokopediaUrl: "",
      tiktokUrl: "",
      recommendedFor: prefilledRec,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  // Save Modal
  const handleSaveModal = async (saved: PeripheralItem) => {
    const newList = await DatabaseService.savePeripheral(saved);
    onUpdatePeripherals(newList);
    showNotice(`Data "${saved.name}" berhasil disimpan.`);
    setIsModalOpen(false);
  };

  // Column Definitions for Draggable Table
  const tableColumns: TableColumnDef<PeripheralItem>[] = useMemo(
    () => [
      {
        id: "status",
        label: "Status Publikasi",
        shortLabel: "STATUS",
        minWidth: "120px",
        isDefaultVisible: true,
        category: "Visibilitas",
        getValue: (p) => (p.isPublished !== false ? 1 : 0),
        renderCell: (p) => {
          const isLive = p.isPublished !== false;
          return (
            <button
              type="button"
              onClick={() => handleTogglePublish(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                isLive
                  ? "bg-hue-emerald-500/10 text-hue-emerald-400 border border-hue-emerald-500/30 hover:bg-hue-emerald-500/20"
                  : "bg-gp-ink-700/80 text-gp-ink-300 border border-gp-ink-600 hover:text-white"
              }`}
              title={isLive ? "Klik untuk jadikan Draft (Sembunyikan)" : "Klik untuk Publikasikan (Aktif)"}
            >
              {isLive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{isLive ? "LIVE" : "DRAFT"}</span>
            </button>
          );
        },
      },
      {
        id: "name",
        label: "Nama Produk & Brand",
        shortLabel: "PRODUK",
        minWidth: "240px",
        isDefaultVisible: true,
        category: "Identitas",
        getValue: (p) => p.name,
        renderCell: (p) => (
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-xs">{p.name}</span>
              {p.brand && (
                <span className="text-3xs font-mono px-1.5 py-0.2 rounded bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-300">
                  {p.brand}
                </span>
              )}
            </div>
            {p.verdict && (
              <p className="text-2xs text-gp-ink-300 line-clamp-1 mt-0.5">{p.verdict}</p>
            )}
          </div>
        ),
      },
      {
        id: "category",
        label: "Kategori Sistem",
        shortLabel: "KATEGORI",
        minWidth: "150px",
        isDefaultVisible: true,
        category: "Identitas",
        getValue: (p) => p.category,
        renderCell: (p) => (
          <span className="px-2 py-0.5 rounded text-3xs font-mono font-bold bg-gp-ink-800 border border-gp-ink-700 text-hue-cyan-400">
            {p.category}
          </span>
        ),
      },
      {
        id: "price",
        label: "Kisaran Harga",
        shortLabel: "HARGA",
        minWidth: "130px",
        isDefaultVisible: true,
        category: "Finansial",
        getValue: (p) => p.price,
        renderCell: (p) => (
          <span className="font-mono font-bold text-xs text-hue-emerald-400">
            {formatRupiah(p.price)}
          </span>
        ),
      },
      {
        id: "type",
        label: "Tipe / Mekanisme",
        shortLabel: "TIPE",
        minWidth: "150px",
        isDefaultVisible: true,
        category: "Spesifikasi",
        getValue: (p) => p.type,
        renderCell: (p) => (
          <span className="text-gp-ink-200 text-xs font-mono">{p.type || "-"}</span>
        ),
      },
      {
        id: "versionDetail",
        label: "Detail / Kapasitas",
        shortLabel: "DETAIL",
        minWidth: "160px",
        isDefaultVisible: true,
        category: "Spesifikasi",
        getValue: (p) => p.versionDetail || "",
        renderCell: (p) => (
          <span className="text-xs text-gp-ink-200">{p.versionDetail || "-"}</span>
        ),
      },
      {
        id: "recommendedFor",
        label: "Rekomendasi Monitor",
        shortLabel: "REKOMENDASI",
        minWidth: "180px",
        isDefaultVisible: true,
        category: "Spesifikasi",
        getValue: (p) => p.recommendedFor || "",
        renderCell: (p) => (
          <span className="text-xs text-hue-amber-300/90 font-mono">
            {p.recommendedFor || "-"}
          </span>
        ),
      },
      {
        id: "warranty",
        label: "Garansi Resmi",
        shortLabel: "GARANSI",
        minWidth: "120px",
        isDefaultVisible: false,
        category: "Purna Jual",
        getValue: (p) => p.warranty || "",
        renderCell: (p) => (
          <span className="text-xs text-gp-ink-300 font-mono">{p.warranty || "Non-Warranty"}</span>
        ),
      },
      {
        id: "links",
        label: "Marketplace Links",
        shortLabel: "BELI",
        minWidth: "130px",
        isDefaultVisible: true,
        category: "Toko",
        renderCell: (p) => (
          <div className="flex items-center gap-1.5">
            {p.shopeeUrl && (
              <a
                href={p.shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded bg-hue-orange-500/10 text-hue-orange-400 hover:bg-hue-orange-500/20 border border-hue-orange-500/30"
                title="Buka Shopee"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
              </a>
            )}
            {p.tokopediaUrl && (
              <a
                href={p.tokopediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded bg-hue-emerald-500/10 text-hue-emerald-400 hover:bg-hue-emerald-500/20 border border-hue-emerald-500/30"
                title="Buka Tokopedia"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {p.tiktokUrl && (
              <a
                href={p.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded bg-hue-cyan-500/10 text-hue-cyan-400 hover:bg-hue-cyan-500/20 border border-hue-cyan-500/30 font-mono text-3xs font-bold px-1.5"
                title="Buka TikTok Shop"
              >
                TT
              </a>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        label: "Aksi Pengelolaan",
        shortLabel: "AKSI",
        minWidth: "120px",
        isDefaultVisible: true,
        category: "Aksi",
        renderCell: (p) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setEditingItem({ ...p });
                setIsModalOpen(true);
              }}
              className="p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 transition-colors"
              title="Edit Data"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleDuplicate(p)}
              className="p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-200 hover:text-hue-cyan-400 hover:bg-gp-ink-700 transition-colors"
              title="Duplikat Item"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(p.id, p.name)}
              className="p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-300 hover:text-hue-rose-400 hover:bg-gp-ink-700 transition-colors"
              title="Hapus Item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    columnOrder,
    columnVisibility,
    visibleColumns,
    toggleColumnVisibility,
    moveColumn,
    reorderColumn,
    setColumnOrderDirectly,
    setAllColumnsVisibility,
    resetColumns,
  } = useDraggableTable({
    storageKey: "admin_arm_bracket_studio",
    columns: tableColumns,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Notice Banner */}
      {notice && (
        <div className="p-3.5 rounded-xl bg-hue-cyan-950/60 border border-hue-cyan-500/40 text-hue-cyan-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-hue-cyan-400" />
            <span className="font-bold">{notice}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-hue-cyan-400 hover:text-white text-xs font-mono"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-hue-cyan-500/10 border border-hue-cyan-500/30 text-hue-cyan-400">
              <Wrench className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Monitor Arm & Bracket Live Studio
            </h2>
          </div>
          <p className="text-xs text-gp-ink-300 pl-10 max-w-2xl">
            Kelola katalog lengan gas-spring, plat protektor bracket meja, stand monitor, dan kabel display dengan kontrol visibilitas independen (Live vs Draft).
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="cyber"
            size="sm"
            onClick={() => handleStartCreate("Monitor Arm")}
            className="text-xs font-bold"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Tambah Arm</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStartCreate("Bracket & Mount")}
            className="text-xs font-bold border border-gp-ink-700 bg-gp-ink-800 text-gp-ink-100 hover:text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Tambah Bracket</span>
          </Button>
        </div>
      </div>

      {/* 4-Col Analytics Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-xl p-3.5 space-y-1">
          <span className="text-3xs font-mono uppercase font-bold text-gp-ink-400">
            🦾 Monitor Arm
          </span>
          <div className="text-xl font-black text-white">
            {armItems.length} <span className="text-xs font-normal text-gp-ink-400">Model</span>
          </div>
          <span className="text-3xs text-hue-emerald-400 font-mono">
            {armItems.filter((a) => a.isPublished !== false).length} Live •{" "}
            {armItems.filter((a) => a.isPublished === false).length} Draft
          </span>
        </div>

        <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-xl p-3.5 space-y-1">
          <span className="text-3xs font-mono uppercase font-bold text-gp-ink-400">
            🗜️ Bracket & Mount
          </span>
          <div className="text-xl font-black text-hue-cyan-400">
            {bracketItems.length} <span className="text-xs font-normal text-gp-ink-400">Model</span>
          </div>
          <span className="text-3xs text-gp-ink-300 font-mono">
            {bracketItems.filter((b) => b.isPublished !== false).length} Live •{" "}
            {bracketItems.filter((b) => b.isPublished === false).length} Draft
          </span>
        </div>

        <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-xl p-3.5 space-y-1">
          <span className="text-3xs font-mono uppercase font-bold text-gp-ink-400">
            🔌 Aksesoris & Kabel
          </span>
          <div className="text-xl font-black text-hue-amber-400">
            {accessoryItems.length} <span className="text-xs font-normal text-gp-ink-400">Item</span>
          </div>
          <span className="text-3xs text-gp-ink-300 font-mono">
            {accessoryItems.filter((c) => c.isPublished !== false).length} Live •{" "}
            {accessoryItems.filter((c) => c.isPublished === false).length} Draft
          </span>
        </div>

        <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-xl p-3.5 space-y-1">
          <span className="text-3xs font-mono uppercase font-bold text-gp-ink-400">
            🌐 Total Publikasi
          </span>
          <div className="text-xl font-black text-hue-emerald-400">
            {liveCount} <span className="text-xs font-normal text-gp-ink-400">/ {peripherals.length}</span>
          </div>
          <span className="text-3xs text-hue-amber-400 font-mono">
            {draftCount} Item Nonaktif (Hidden)
          </span>
        </div>
      </div>

      {/* Sub-Tabs: Arms vs Brackets vs Accessories vs All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gp-ink-700 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSubTab("arms")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              subTab === "arms"
                ? "bg-gp-ink-700 text-hue-cyan-400 border border-hue-cyan-500/40 shadow-sm"
                : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800 border border-transparent"
            }`}
          >
            <span>🦾</span>
            <span>Monitor Arm ({armItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("brackets")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              subTab === "brackets"
                ? "bg-gp-ink-700 text-hue-emerald-400 border border-hue-emerald-500/40 shadow-sm"
                : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800 border border-transparent"
            }`}
          >
            <span>🗜️</span>
            <span>Bracket & Mount ({bracketItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("accessories")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              subTab === "accessories"
                ? "bg-gp-ink-700 text-hue-amber-400 border border-hue-amber-500/40 shadow-sm"
                : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800 border border-transparent"
            }`}
          >
            <span>🔌</span>
            <span>Aksesoris & Kabel ({accessoryItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              subTab === "all"
                ? "bg-gp-ink-700 text-white border border-gp-ink-600 shadow-sm"
                : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800 border border-transparent"
            }`}
          >
            <span>Semua Data ({peripherals.length})</span>
          </button>
        </div>

        {/* View Toggle (Table / Grid) & Column Manager */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsColManagerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gp-ink-800 hover:bg-gp-ink-700 border border-gp-ink-700 text-gp-ink-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-hue-cyan-400" />
            <span>Kelola Kolom</span>
            <span className="text-3xs font-mono px-1 rounded bg-gp-ink-700 text-gp-ink-300">
              {visibleColumns.length}
            </span>
          </button>

          <div className="flex items-center bg-gp-ink-950 border border-gp-ink-700 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "table" ? "bg-gp-ink-700 text-white" : "text-gp-ink-300 hover:text-white"
              }`}
              title="Tampilan Tabel Database"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "grid" ? "bg-gp-ink-700 text-white" : "text-gp-ink-300 hover:text-white"
              }`}
              title="Tampilan Grid Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar: Search, Status, Brand */}
      <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gp-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari model, tipe, catatan..."
              className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-gp-ink-400 focus:outline-none focus:border-hue-cyan-500/50"
            />
          </div>

          {/* Status Filter (All / Live / Draft) */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-1.5 text-xs text-gp-ink-200 font-mono focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="published">🟢 Hanya Aktif (Live)</option>
            <option value="draft">⏸️ Hanya Nonaktif (Draft)</option>
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-3 py-1.5 text-xs text-gp-ink-200 font-mono focus:outline-none"
          >
            <option value="all">Semua Brand</option>
            {distinctBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs font-mono text-gp-ink-400 shrink-0">
          Menampilkan {filteredItems.length} dari {peripherals.length} item
        </span>
      </div>

      {/* VIEW 1: NOTION DATABASE TABLE */}
      {viewMode === "table" && (
        <div className="relative rounded-2xl border border-gp-ink-700 bg-gp-ink-950 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead className="bg-gp-ink-850 text-gp-ink-300 uppercase text-3xs tracking-wider border-b border-gp-ink-700 sticky top-0 z-20">
                <tr>
                  {visibleColumns.map((col) => (
                    <th
                      key={col.id}
                      style={{ minWidth: col.minWidth }}
                      className="py-3 px-3.5 font-bold text-gp-ink-200"
                    >
                      {col.shortLabel || col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gp-ink-800/80">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumns.length}
                      className="py-12 text-center text-gp-ink-400 text-xs"
                    >
                      Tidak ada produk yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => {
                    const isLive = item.isPublished !== false;
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-gp-ink-800/60 transition-colors ${
                          !isLive
                            ? "bg-gp-ink-950/40 opacity-70"
                            : idx % 2 === 0
                            ? "bg-black/30"
                            : "bg-gp-ink-950"
                        }`}
                      >
                        {visibleColumns.map((col) => (
                          <td key={col.id} className="py-3 px-3.5">
                            {col.renderCell(item, idx)}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: GRID CARDS */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((p) => {
            const isLive = p.isPublished !== false;
            return (
              <div
                key={p.id}
                className={`bg-gp-ink-950 border rounded-2xl p-5 space-y-3.5 flex flex-col justify-between transition-colors ${
                  !isLive
                    ? "border-gp-ink-750 opacity-70 bg-gp-ink-950/40"
                    : "border-gp-ink-700 hover:border-hue-cyan-500/40"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-3xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-hue-cyan-500/10 text-hue-cyan-400 border border-hue-cyan-500/30">
                        {p.category}
                      </span>
                      {p.brand && (
                        <span className="text-3xs font-mono px-2 py-0.5 rounded bg-gp-ink-800 text-gp-ink-300 border border-gp-ink-700">
                          {p.brand}
                        </span>
                      )}
                    </div>

                    {/* Quick Status Toggle */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(p)}
                      className={`px-2 py-0.5 rounded text-3xs font-mono font-bold flex items-center gap-1 transition-colors ${
                        isLive
                          ? "bg-hue-emerald-500/15 text-hue-emerald-400 border border-hue-emerald-500/30"
                          : "bg-gp-ink-700 text-gp-ink-300 border border-gp-ink-600"
                      }`}
                      title={isLive ? "Klik untuk nonaktifkan" : "Klik untuk publikasikan"}
                    >
                      {isLive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isLive ? "LIVE" : "DRAFT"}</span>
                    </button>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-white">{p.name}</h4>
                    <div className="text-sm font-mono font-bold text-hue-emerald-400 mt-1">
                      {formatRupiah(p.price)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-2xs bg-gp-ink-800/60 p-2.5 rounded-xl border border-gp-ink-750">
                    <div>
                      <span className="text-gp-ink-400 text-3xs block font-mono">TIPE:</span>
                      <span className="text-gp-ink-100 font-medium truncate block">{p.type}</span>
                    </div>
                    <div>
                      <span className="text-gp-ink-400 text-3xs block font-mono">KAPASITAS / DETAIL:</span>
                      <span className="text-gp-ink-100 font-medium truncate block">
                        {p.versionDetail || "-"}
                      </span>
                    </div>
                  </div>

                  {p.verdict && (
                    <p className="text-xs text-gp-ink-200 leading-relaxed bg-gp-ink-800/40 p-2.5 rounded-xl border border-gp-ink-700/80">
                      {p.verdict}
                    </p>
                  )}
                </div>

                {/* Footer Card: Links & Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-gp-ink-750">
                  <div className="flex items-center gap-1.5">
                    {p.shopeeUrl && (
                      <a
                        href={p.shopeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-hue-orange-500/10 text-hue-orange-400 hover:bg-hue-orange-500/20 border border-hue-orange-500/30 text-xs font-bold flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Shopee</span>
                      </a>
                    )}
                    {p.tokopediaUrl && (
                      <a
                        href={p.tokopediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-hue-emerald-500/10 text-hue-emerald-400 hover:bg-hue-emerald-500/20 border border-hue-emerald-500/30 text-xs font-bold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Tokopedia</span>
                      </a>
                    )}
                    {p.tiktokUrl && (
                      <a
                        href={p.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-hue-cyan-500/10 text-hue-cyan-400 hover:bg-hue-cyan-500/20 border border-hue-cyan-500/30 text-xs font-bold flex items-center gap-1"
                      >
                        <span>TikTok</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem({ ...p });
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-200 hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(p)}
                      className="p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-200 hover:text-hue-cyan-400"
                      title="Duplikat"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-300 hover:text-hue-rose-400"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Modal */}
      <PeripheralFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingItem}
      />

      {/* Column Manager Modal */}
      <TableColumnManagerModal
        isOpen={isColManagerOpen}
        onClose={() => setIsColManagerOpen(false)}
        title="Kolom Tabel Studio Arm & Bracket"
        columns={tableColumns}
        columnOrder={columnOrder}
        columnVisibility={columnVisibility}
        onToggleVisibility={toggleColumnVisibility}
        onMoveColumn={moveColumn}
        onReorderColumn={reorderColumn}
        onSetColumnOrderDirectly={setColumnOrderDirectly}
        onSetAllVisibility={setAllColumnsVisibility}
        onResetColumns={resetColumns}
      />
    </div>
  );
}
