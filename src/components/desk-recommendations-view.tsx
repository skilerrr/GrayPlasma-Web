"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  ExternalLink,
  ShoppingBag,
  Ruler,
  Info,
  ChevronRight,
  X,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Maximize2,
  Sparkles,
  GripVertical,
  Monitor,
  Layers,
  FileText,
  Clock,
} from "lucide-react";
import { DeskItem, DESK_DATABASE } from "@/data/grayplasma-desk-peripherals";
import { formatRupiah } from "@/lib/utils";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";
import { Button } from "@/components/ui/button";
import { useDraggableTable, TableColumnDef } from "@/hooks/use-draggable-table";
import { TableColumnManagerModal } from "@/components/ui/table-column-manager-modal";

interface DeskRecommendationsViewProps {
  desks?: DeskItem[];
  isAdmin?: boolean;
  onEditDesk?: (desk: DeskItem) => void;
  onDeleteDesk?: (id: string) => void;
  onAddDesk?: () => void;
}

export function DeskRecommendationsView({
  desks = DESK_DATABASE,
  isAdmin = false,
  onEditDesk,
  onDeleteDesk,
  onAddDesk,
}: DeskRecommendationsViewProps) {
  const [selectedDesk, setSelectedDesk] = useState<DeskItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedShape, setSelectedShape] = useState<string>("all");
  const [isColManagerOpen, setIsColManagerOpen] = useState(false);

  const categories = [
    { id: "all", label: "Semua Meja" },
    { id: "Daun Meja", label: "Daun Meja Saja" },
    { id: "Meja Standar", label: "Meja Standar (Hollow)" },
    { id: "Meja Elektrik (Standing Desk)", label: "Meja Elektrik (Standing)" },
    { id: "Meja L-Shaped", label: "L-Shaped ($$$)" },
    { id: "Meja Nakas", label: "Meja Nakas" },
    { id: "Meja Lesehan", label: "Meja Lesehan" },
  ];

  const filteredDesks = desks.filter((desk) => {
    const matchesSearch =
      desk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desk.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desk.keterangan?.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      desk.category === selectedCategory ||
      desk.keterangan?.includes(selectedCategory.toUpperCase());

    const matchesShape =
      selectedShape === "all" ||
      (selectedShape === "L SHAPED" && desk.type?.includes("L SHAPED") && !desk.type?.includes("NON")) ||
      (selectedShape === "NON L SHAPED" && (desk.type?.includes("NON") || !desk.type?.includes("L SHAPED")));

    return matchesSearch && matchesCategory && matchesShape;
  });

  const getTagColor = (tag: string) => {
    const t = tag.toUpperCase();
    if (t.includes("DAUN MEJA")) return "bg-gp-ember-300 text-gp-ember-100 border-gp-ember-100/30";
    if (t.includes("HOLLOW")) return "bg-gp-ink-700 text-gp-ink-200 border-gp-ink-600";
    if (t.includes("ELEKTRIK")) return "bg-gp-mint-600 text-gp-mint-50 border-gp-mint-50/30";
    if (t.includes("LACI") || t.includes("NAKAS")) return "bg-indigo-900 text-indigo-300 border-indigo-300/30";
    if (t.includes("TACOSHEET") || t.includes("PLYWOOD")) return "bg-gp-coral-600 text-gp-coral-50 border-gp-coral-50/30";
    return "bg-gp-sky-500 text-blue-300 border-blue-500/30";
  };

  const publicDeskColumns = React.useMemo<TableColumnDef<DeskItem>[]>(() => [
    {
      id: "name",
      label: "[ NAMA TOKO & MEJA ]",
      shortLabel: "Nama Meja",
      minWidth: "min-w-[240px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Identitas",
      getValue: (d) => d.name,
      renderCell: (desk) => (
        <div className="flex items-center gap-2.5">
          <FileText className="w-3.5 h-3.5 text-gp-ink-400 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
          <span className="underline-offset-4 group-hover:underline font-bold text-sm text-white">
            {desk.name}
          </span>
        </div>
      ),
    },
    {
      id: "keterangan",
      label: "[ KETERANGAN ]",
      shortLabel: "Keterangan",
      minWidth: "min-w-[200px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Klasifikasi",
      getValue: (d) => d.category,
      renderCell: (desk) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {(desk.keterangan && desk.keterangan.length > 0
            ? desk.keterangan
            : [desk.category]
          ).map((tag, tIdx) => (
            <span
              key={tIdx}
              className={`px-2 py-0.5 rounded text-3xs font-mono font-bold border uppercase tracking-wider ${getTagColor(
                tag
              )}`}
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "type",
      label: "[ BENTUK & TIPE ]",
      shortLabel: "Tipe",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Bentuk",
      getValue: (d) => d.type || "NON L SHAPED",
      renderCell: (desk) => (
        <span
          className={`px-2 py-0.5 rounded text-3xs font-mono font-bold uppercase tracking-wider whitespace-nowrap ${
            desk.type?.includes("NON") || !desk.type?.includes("L SHAPED")
              ? "bg-gp-ink-750 text-gp-ink-200 border border-gp-ink-600"
              : "bg-gp-violet-300 text-purple-300 border border-purple-500/40"
          }`}
        >
          {desk.type || "NON L SHAPED"}
        </span>
      ),
    },
    {
      id: "catatanBadge",
      label: "[ CATATAN GTID ]",
      shortLabel: "Catatan",
      minWidth: "min-w-[180px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Status",
      getValue: (d) => d.catatanBadge || "",
      renderCell: (desk) => (
        <span className="px-2 py-0.5 rounded text-3xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{desk.catatanBadge || "ADA CATATAN"}</span>
        </span>
      ),
    },
    {
      id: "price",
      label: "[ KISARAN HARGA ]",
      shortLabel: "Harga",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Finansial",
      getValue: (d) => d.price,
      renderCell: (desk) => (
        <span className="font-mono font-bold text-xs text-emerald-400 whitespace-nowrap tabular-nums">
          {desk.price > 0 ? `IDR ${desk.price.toLocaleString("id-ID")}` : "IDR 0 (Custom)"}
        </span>
      ),
    },
    {
      id: "material",
      label: "[ MATERIAL & TEBAL ]",
      shortLabel: "Material",
      minWidth: "min-w-[150px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Spesifikasi",
      getValue: (d) => `${d.specs?.material || ""} ${d.specs?.thickness || ""}`,
      renderCell: (desk) => (
        <div className="font-mono text-xs text-gp-ink-200 whitespace-nowrap">
          <div>{desk.specs?.material || "-"}</div>
          <div className="text-3xs text-gp-ink-400">Tebal: {desk.specs?.thickness || "-"}</div>
        </div>
      ),
    },
    {
      id: "dimensions",
      label: "[ DIMENSI MEJA ]",
      shortLabel: "Dimensi",
      minWidth: "min-w-[130px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Spesifikasi",
      getValue: (d) => d.specs?.dimensions || "",
      renderCell: (desk) => (
        <span className="font-mono text-xs text-gp-ink-200 whitespace-nowrap tabular-nums">
          {desk.specs?.dimensions || "-"}
        </span>
      ),
    },
    {
      id: "armSupport",
      label: "[ MONITOR ARM CLAMP ]",
      shortLabel: "Arm Support",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Uji GTID",
      getValue: (d) => (d.specs?.armSupport ? 1 : 0),
      renderCell: (desk) => (
        <span
          className={`px-2 py-0.5 rounded text-3xs font-mono font-bold border whitespace-nowrap ${
            desk.specs?.armSupport
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-orange-500/10 text-orange-400 border-orange-500/30"
          }`}
        >
          {desk.specs?.armSupport ? "[✓ LOLOS CLAMP]" : "[! PERLU PLAT]"}
        </span>
      ),
    },
  ], []);

  const tableManager = useDraggableTable<DeskItem>({
    storageKey: "desk_public_v2",
    columns: publicDeskColumns,
  });

  const displayDesks = tableManager.getSortedData(filteredDesks);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. NOTION-STYLE PAGE HEADER */}
      <div className="bg-gp-ink-800 border border-gp-ink-650 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gp-ink-300 font-mono flex-wrap">
          <Monitor className="w-3.5 h-3.5 text-gp-ink-400" />
          <Link href="/" className="hover:text-white transition-colors">GRAYPLASMAID // MONITOR</Link>
          <span className="text-gp-ink-500">/</span>
          <span className="text-white font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-orange-400" />
            REKOMENDASI MEJA
          </span>
        </div>

        {/* Page Title & Intro */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>SUB-PAGE REKOMENDASI MONITOR</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            REKOMENDASI MEJA + KAKI
          </h1>

          <p className="text-xs sm:text-sm text-gp-ink-300 leading-relaxed max-w-4xl">
            Seperti biasa, mencari sebuah produk itu mudah, namun mencari produk yang ideal sesuai kebutuhan itu sulit, seperti Monitor, dan bahkan meja yang digunakan untuk meletakkan Monitor. Halaman ini akan membahas penting nya memilih meja yang ideal dan ukuran nya, biar pas ada monitor, nyaman dipakai, tidak terlalu dekat atau terlalu jauh dari sisi jarak pandang.
          </p>
        </div>

        {/* Action Link to Guide Ukuran Ideal */}
        <div className="pt-2 border-t border-gp-ink-650 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/guide/setup/ukuran-meja-monitor-ideal"
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-400 transition-colors font-bold text-xs sm:text-sm group shadow-sm"
          >
            <Ruler className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>[ GUIDELINE // UKURAN MEJA & MONITOR IDEAL ]</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {isAdmin && onAddDesk && (
            <Button
              onClick={onAddDesk}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold gap-2 px-4 py-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Meja Baru</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="space-y-3 bg-gp-ink-800 border border-gp-ink-650 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gp-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama toko, daun meja, hollow, elektrik, nakas..."
              className="w-full bg-gp-ink-850 border border-gp-ink-650 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-gp-ink-500 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gp-ink-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Shape Selector */}
          <div className="flex items-center gap-1.5 bg-gp-ink-850 p-1 rounded-xl border border-gp-ink-650 text-xs">
            <button
              onClick={() => setSelectedShape("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedShape === "all" ? "bg-gp-ink-700 text-white" : "text-gp-ink-300 hover:text-gp-ink-100"
              }`}
            >
              Semua Bentuk
            </button>
            <button
              onClick={() => setSelectedShape("NON L SHAPED")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedShape === "NON L SHAPED" ? "bg-gp-ink-700 text-cyan-400" : "text-gp-ink-300 hover:text-gp-ink-100"
              }`}
            >
              Non L-Shaped
            </button>
            <button
              onClick={() => setSelectedShape("L SHAPED")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedShape === "L SHAPED" ? "bg-gp-ink-700 text-purple-400" : "text-gp-ink-300 hover:text-gp-ink-100"
              }`}
            >
              L-Shaped
            </button>
          </div>
        </div>

        {/* Category Pills & Column Manager */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-gp-ink-650/60">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-sm"
                    : "bg-gp-ink-750 border border-gp-ink-650 text-gp-ink-300 hover:text-white hover:bg-gp-ink-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsColManagerOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-gp-ink-600 bg-gp-ink-750 text-gp-ink-200 hover:text-white hover:border-emerald-500 transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>[ KELOLA KOLOM ({tableManager.visibleColumns.length}) ]</span>
          </button>
        </div>
      </div>

      {/* 3. NOTION-STYLE DATABASE TABLE */}
      <div className="relative rounded-2xl border border-gp-ink-650 bg-gp-ink-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[950px]">
            <thead className="bg-gp-ink-750 text-gp-ink-300 uppercase text-2xs font-bold tracking-wider border-b border-gp-ink-650 select-none sticky top-0 z-20">
              <tr>
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
                      className={`py-3 px-3 font-mono font-bold text-xs uppercase cursor-pointer select-none transition-colors border-r border-gp-ink-650 ${
                        col.minWidth || "min-w-[140px]"
                      } ${
                        isDragging
                          ? "opacity-40 bg-emerald-500/20"
                          : isOver
                          ? "border-l-2 border-l-emerald-400 bg-emerald-500/10"
                          : "hover:bg-gp-ink-700"
                      }`}
                      title="Klik untuk sort (Asc/Desc/Reset), atau Drag untuk memindahkan urutan kolom"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="cursor-grab active:cursor-grabbing text-gp-ink-400 hover:text-emerald-400"
                            title="Drag kolom"
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </span>
                          <span className="truncate">{col.label}</span>
                        </div>
                        {isSorted ? (
                          <span className="text-emerald-400 font-bold text-2xs flex-shrink-0">
                            {tableManager.sortDirection === "asc" ? "▲" : "▼"}
                          </span>
                        ) : col.sortable !== false ? (
                          <span className="text-gp-ink-500 text-3xs opacity-40 hover:opacity-100 flex-shrink-0">↕</span>
                        ) : null}
                      </div>
                    </th>
                  );
                })}
                <th className="py-3 px-3 text-center min-w-[120px] bg-gp-ink-750">AKSI / DETAIL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gp-ink-700">
              {displayDesks.map((desk, idx) => (
                <tr
                  key={desk.id || idx}
                  onClick={() => setSelectedDesk(desk)}
                  className={`group cursor-pointer hover:bg-gp-ink-750 transition-colors ${
                    idx % 2 === 0 ? "bg-gp-ink-800" : "bg-gp-ink-800"
                  }`}
                >
                  {tableManager.visibleColumns.map((col) => (
                    <td key={col.id} className="py-3.5 px-3 border-r border-gp-ink-700 align-middle">
                      {col.renderCell(desk, idx)}
                    </td>
                  ))}

                  {/* Action */}
                  <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedDesk(desk)}
                        className="px-2.5 py-1 rounded-lg bg-gp-ink-700 hover:bg-emerald-500/20 text-gp-ink-200 hover:text-emerald-400 text-2xs font-semibold transition-colors flex items-center gap-1"
                        title="Buka Catatan Lengkap"
                      >
                        <span>Buka</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      {desk.shopeeUrl && (
                        <a
                          href={desk.shopeeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs transition-colors"
                          title="Beli di Shopee"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {isAdmin && onEditDesk && (
                        <button
                          onClick={() => onEditDesk(desk)}
                          className="p-1 rounded-lg bg-gp-ink-700 hover:bg-gp-ink-600 text-gp-ink-200 text-xs"
                          title="Edit Meja"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isAdmin && onDeleteDesk && (
                        <button
                          onClick={() => onDeleteDesk(desk.id)}
                          className="p-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 text-xs"
                          title="Hapus Meja"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {displayDesks.length === 0 && (
          <div className="p-12 text-center space-y-2">
            <Info className="w-8 h-8 text-gp-ink-500 mx-auto" />
            <p className="text-sm text-gp-ink-300 font-medium">Tidak ada data meja yang sesuai dengan filter.</p>
          </div>
        )}
      </div>

      {/* 4. NOTION-STYLE SIDE PANEL DRAWER FOR DESK DETAILS */}
      {selectedDesk && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
          onClick={() => setSelectedDesk(null)}
        >
          <div
            className="w-full max-w-2xl bg-gp-ink-800 border-l border-gp-ink-650 h-full overflow-y-auto shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top Header */}
            <div className="sticky top-0 z-20 bg-gp-ink-800/95 backdrop-blur-md px-6 py-4 border-b border-gp-ink-650 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gp-ink-300">
                <Layers className="w-4 h-4 text-orange-400" />
                <span className="truncate max-w-[280px] font-bold text-white uppercase tracking-tight">
                  {selectedDesk.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedDesk.shopeeUrl && (
                  <a
                    href={selectedDesk.shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold transition-colors shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Beli di Shopee</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedDesk(null)}
                  className="p-1.5 rounded-xl bg-gp-ink-750 hover:bg-gp-ink-700 text-gp-ink-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="p-6 sm:p-8 space-y-6 flex-1">
              {/* Title & Page Icon */}
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-gp-ink-800 border border-gp-ink-700 w-fit">
                  <Layers className="w-8 h-8 text-gp-ink-200" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {selectedDesk.name}
                </h2>
              </div>

              {/* Notion-style Properties Table */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-gp-ink-750 border border-gp-ink-650 text-xs">
                {/* L Shaped */}
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gp-ink-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gp-ink-300" />
                    <span>L SHAPED ATAU NON...</span>
                  </span>
                  <div className="col-span-2">
                    <span className="px-2 py-0.5 rounded text-2xs font-bold bg-gp-ink-700 text-white border border-gp-ink-600">
                      {selectedDesk.type || "NON L SHAPED"}
                    </span>
                  </div>
                </div>

                {/* Catatan Status */}
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gp-ink-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-gp-ink-300" />
                    <span>CATATAN</span>
                  </span>
                  <div className="col-span-2">
                    <span className="px-2 py-0.5 rounded text-2xs font-bold bg-gp-mint-600 text-gp-mint-50 border border-gp-mint-50/40">
                      {selectedDesk.catatanBadge || "ADA (DISARANKAN MEMBACA NYA)"}
                    </span>
                  </div>
                </div>

                {/* Keterangan */}
                <div className="grid grid-cols-3 gap-2 items-start">
                  <span className="text-gp-ink-300 flex items-center gap-1.5 pt-1">
                    <span>:=</span>
                    <span>KETERANGAN</span>
                  </span>
                  <div className="col-span-2 flex flex-wrap gap-1.5">
                    {(selectedDesk.keterangan || [selectedDesk.category]).map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded text-3xs font-bold border uppercase tracking-wider ${getTagColor(
                          tag
                        )}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Kisaran Harga */}
                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gp-ink-300 flex items-center gap-1.5">
                    <span>#</span>
                    <span>KISARAN HARGA</span>
                  </span>
                  <div className="col-span-2 font-mono font-bold text-emerald-400 text-sm">
                    {selectedDesk.price > 0 ? `IDR ${selectedDesk.price.toLocaleString("id-ID")}` : "Custom"}
                  </div>
                </div>

                {/* Specs quick info */}
                {selectedDesk.specs && (
                  <div className="grid grid-cols-3 gap-2 items-center pt-2 border-t border-gp-ink-650">
                    <span className="text-gp-ink-300">DIMENSI / BAHAN</span>
                    <div className="col-span-2 text-gp-ink-200 font-mono text-2xs">
                      {selectedDesk.specs.dimensions} • {selectedDesk.specs.material} (Tebal: {selectedDesk.specs.thickness})
                    </div>
                  </div>
                )}
              </div>

              {/* Render Full Rich Markdown Content */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gp-ink-750 border border-gp-ink-650 space-y-4">
                {selectedDesk.markdownContent ? (
                  <NotionBlockRenderer content={selectedDesk.markdownContent} />
                ) : (
                  <div className="space-y-4 text-xs text-gp-ink-200 leading-relaxed">
                    <p className="font-semibold text-white">{selectedDesk.description}</p>
                    {selectedDesk.notes && (
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                        <span className="font-bold block mb-1">Catatan GrayPlasma:</span>
                        <span>{selectedDesk.notes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Quick Jump to Ideal Size Guide */}
              <div className="p-4 rounded-2xl bg-gp-ink-750 border border-gp-ink-650 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-white block">Bingung memilih ukuran meja?</span>
                  <span className="text-2xs text-gp-ink-300 block">
                    Cek panduan ukuran meja 24" vs 27" dengan PC di atas vs bawah meja.
                  </span>
                </div>
                <Link
                  href="/guide/setup/ukuran-meja-monitor-ideal"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold whitespace-nowrap transition-colors"
                >
                  Buka Panduan Ukuran →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Column Manager Modal for Public Desk Table */}
      <TableColumnManagerModal
        isOpen={isColManagerOpen}
        onClose={() => setIsColManagerOpen(false)}
        title="Pengaturan Kolom Tabel Meja"
        columns={tableManager.columns}
        columnOrder={tableManager.columnOrder}
        columnVisibility={tableManager.columnVisibility}
        onToggleVisibility={tableManager.toggleColumnVisibility}
        onMoveColumn={tableManager.moveColumn}
        onReorderColumn={tableManager.reorderColumn}
        onSetColumnOrderDirectly={tableManager.setColumnOrderDirectly}
        onSetAllVisibility={tableManager.setAllColumnsVisibility}
        onResetColumns={tableManager.resetColumns}
      />
    </div>
  );
}
