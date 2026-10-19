"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  Save,
  RotateCcw,
  Search,
  ExternalLink,
  Sparkles,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Table as TableIcon,
  ShoppingBag,
  Ruler,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  FileSpreadsheet,
  Download,
  Edit2,
  Layers,
} from "lucide-react";
import { DeskItem } from "@/data/grayplasma-desk-peripherals";
import { DatabaseService } from "@/lib/db-service";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NotionRichEditor } from "@/components/admin/notion-rich-editor";
import { ModularTableBuilder } from "@/components/admin/modular-table-builder";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";
import { useDraggableTable, TableColumnDef } from "@/hooks/use-draggable-table";
import { TableColumnManagerModal } from "@/components/ui/table-column-manager-modal";
import { WordDocsStudio } from "@/components/admin/word-docs-studio";

interface DeskLiveStudioProps {
  desks: DeskItem[];
  onUpdateDesks: (newDesks: DeskItem[]) => void;
  onPreviewSidePanel?: (desk: DeskItem) => void;
}

const DESK_CATEGORIES: DeskItem["category"][] = [
  "Daun Meja",
  "Meja Standar",
  "Meja Elektrik (Standing Desk)",
  "Meja L-Shaped",
  "Meja Nakas",
  "Meja Lesehan",
];

export function DeskLiveStudio({
  desks,
  onUpdateDesks,
  onPreviewSidePanel,
}: DeskLiveStudioProps) {
  const [selectedDesk, setSelectedDesk] = useState<DeskItem | null>(desks[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [notice, setNotice] = useState<string | null>(null);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
  const [isTableBuilderOpen, setIsTableBuilderOpen] = useState(false);
  const [newVarLabel, setNewVarLabel] = useState("");
  const [newVarValue, setNewVarValue] = useState("");
  const [newVarCategory, setNewVarCategory] = useState("Material & Frame");
  const [viewMode, setViewMode] = useState<"excel" | "studio">("excel");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isColManagerOpen, setIsColManagerOpen] = useState(false);
  const [isWordDocsOpen, setIsWordDocsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Helper to convert desk review to document HTML
  const getInitialDoc = (desk: Partial<DeskItem> | null) => {
    if (!desk) return "<p>Mulai ketik ulasan, uji ketebalan meja, atau verdict kelayakan arm gas-spring di sini...</p>";
    if (desk.markdownContent && desk.markdownContent.trim().length > 0) {
      return desk.markdownContent;
    }
    let doc = "";
    if (desk.notes) {
      doc += `<div class="notion-callout notion-callout-amber"><span class="notion-callout-icon font-mono font-bold text-xs">[NOTE]</span><div class="notion-callout-content"><strong>Catatan Penting GrayPlasma:</strong><br>${desk.notes}</div></div>`;
    }
    if (desk.description) {
      doc += `<h2>Karakteristik & Uji Kekuatan Daun Meja</h2><p>${desk.description}</p>`;
    }
    doc += `<h3>Uji Kelayakan Jepit Bracket Arm Gas-Spring</h3>`;
    if (desk.specs?.armSupport) {
      doc += `<p><strong>[LOLOS CLAMP]</strong> Daun meja berbahan <strong>${desk.specs.material}</strong> dengan ketebalan <strong>${desk.specs.thickness}</strong> telah lolos verifikasi uji clamp arm tanpa memerlukan plat protektor tambahan.</p>`;
    } else {
      doc += `<p><strong>[PERHATIAN]</strong> Ketebalan atau material meja ini disarankan menggunakan <em>Steel Protector Plate (seperti Oximus EV-06)</em> untuk mencegah retak pada titik tumpu jepit.</p>`;
    }
    return doc;
  };

  const [docContent, setDocContent] = useState<string>(() => getInitialDoc(selectedDesk));

  // Form State for Active Desk
  const [formData, setFormData] = useState<Partial<DeskItem>>(
    selectedDesk || {
      name: "Meja Rekomendasi Baru",
      category: "Daun Meja",
      keterangan: ["Daun Meja", "Multiplek"],
      price: 450000,
      type: "NON L SHAPED",
      catatanBadge: "ADA (DISARANKAN MEMBACA NYA)",
      description: "Daun meja multiplek berkualitas tinggi tahan clamp monitor arm.",
      notes: "Gunakan ketebalan minimal 18mm untuk bracket arm dual monitor.",
      shopeeUrl: "https://shopee.co.id",
      specs: {
        material: "Multiplek / Plywood Full HPL",
        thickness: "2.4 cm (24 mm)",
        armSupport: true,
        dimensions: "120 x 60 cm",
      },
    }
  );

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  // Switch Selected Desk
  const handleSelectDesk = (d: DeskItem) => {
    setSelectedDesk(d);
    setFormData(d);
    setDocContent(getInitialDoc(d));
  };

  // Create New Desk
  const handleCreateNew = () => {
    const newDesk: DeskItem = {
      id: `desk-${Date.now()}`,
      name: "Meja Baru (Kustom / Rekomendasi)",
      category: "Daun Meja",
      keterangan: ["Daun Meja", "Custom"],
      price: 500000,
      type: "NON L SHAPED",
      catatanBadge: "ADA (DISARANKAN MEMBACA NYA)",
      description: "Deskripsi ulasan ulasan dan pengujian meja.",
      notes: "Catatan penting untuk pembaca ulasan.",
      shopeeUrl: "",
      specs: {
        material: "Multiplek Full Plywood HPL",
        thickness: "2.4 cm",
        armSupport: true,
        dimensions: "120 x 60 cm",
      },
      markdownContent: "",
    };
    setSelectedDesk(newDesk);
    setFormData(newDesk);
    setDocContent(getInitialDoc(newDesk));
    showNotification("Draft meja baru siap disunting.");
  };

  // Duplicate Desk
  const handleDuplicate = async () => {
    if (!formData.name) return;
    const duplicated: DeskItem = {
      ...(formData as DeskItem),
      id: `desk-${Date.now()}`,
      name: `${formData.name} (Salinan)`,
    };
    const updated = await DatabaseService.saveDesk(duplicated);
    onUpdateDesks(updated);
    setSelectedDesk(duplicated);
    setFormData(duplicated);
    showNotification(`Meja "${duplicated.name}" berhasil diduplikat.`);
  };

  // Delete Desk
  const handleDelete = async () => {
    if (!selectedDesk) return;
    if (confirm(`Yakin ingin menghapus rekomendasi meja "${formData.name}"?`)) {
      const updated = await DatabaseService.deleteDesk(selectedDesk.id);
      onUpdateDesks(updated);
      setSelectedDesk(updated[0] || null);
      if (updated[0]) {
        setFormData(updated[0]);
        setDocContent(getInitialDoc(updated[0]));
      }
      showNotification("Data meja telah dihapus.");
    }
  };

  // Save Desk
  const handleSave = async () => {
    if (!formData.name?.trim()) {
      alert("Nama meja wajib diisi.");
      return;
    }

    const itemToSave: DeskItem = {
      id: formData.id || `desk-${Date.now()}`,
      name: formData.name,
      category: formData.category || "Daun Meja",
      keterangan: formData.keterangan || [formData.category || "Daun Meja"],
      price: Number(formData.price) || 0,
      type: formData.type || "NON L SHAPED",
      catatanBadge: formData.catatanBadge || "ADA (DISARANKAN MEMBACA NYA)",
      description: formData.description || "",
      notes: formData.notes || "",
      shopeeUrl: formData.shopeeUrl || "",
      specs: {
        material: formData.specs?.material || "Multiplek / Plywood",
        thickness: formData.specs?.thickness || "2.4 cm",
        armSupport: formData.specs?.armSupport ?? true,
        dimensions: formData.specs?.dimensions || "120 x 60 cm",
      },
      markdownContent: docContent,
      customVariables: formData.customVariables || [],
    };

    const updatedList = await DatabaseService.saveDesk(itemToSave);
    onUpdateDesks(updatedList);
    setSelectedDesk(itemToSave);
    setFormData(itemToSave);
    showNotification(`Data meja "${itemToSave.name}" berhasil disimpan.`);
  };

  // Drag and Drop Row Reordering for Desks
  const handleRowDrop = async (targetIdx: number) => {
    if (draggedIndex === null || draggedIndex === targetIdx) return;
    const newDesks = [...desks];
    const [moved] = newDesks.splice(draggedIndex, 1);
    newDesks.splice(targetIdx, 0, moved);
    const updated = await DatabaseService.reorderDesks(newDesks);
    onUpdateDesks(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    showNotification(`Urutan meja diperbarui! #${targetIdx + 1}: ${moved.name}`);
  };

  // Quick edit price in Excel view
  const handleQuickEditPrice = async (desk: DeskItem, newPrice: number) => {
    const updated: DeskItem = { ...desk, price: newPrice };
    const list = await DatabaseService.saveDesk(updated);
    onUpdateDesks(list);
    showNotification(`Harga meja ${desk.name} diubah ke ${formatRupiah(newPrice)}`);
  };

  // Quick edit arm support
  const handleQuickEditArmSupport = async (desk: DeskItem, armSupport: boolean) => {
    const updated: DeskItem = {
      ...desk,
      specs: { ...desk.specs, armSupport },
    };
    const list = await DatabaseService.saveDesk(updated);
    onUpdateDesks(list);
    showNotification(`Status arm support "${desk.name}" diperbarui.`);
  };

  // Export CSV format
  const handleExportCSV = () => {
    const headers = ["No", "Nama", "Kategori", "Harga", "Tipe", "Bahan", "Tebal", "Dimensi", "ArmSupport", "ShopeeUrl"];
    const rows = desks.map((d, idx) => [
      idx + 1,
      `"${(d.name || '').replace(/"/g, '""')}"`,
      `"${d.category}"`,
      d.price,
      `"${d.type || ''}"`,
      `"${d.specs?.material || ''}"`,
      `"${d.specs?.thickness || ''}"`,
      `"${d.specs?.dimensions || ''}"`,
      d.specs?.armSupport ? "Lolos" : "Perlu Plat",
      `"${d.shopeeUrl || ''}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `grayplasma_desks_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Data meja berhasil diekspor ke CSV.");
  };

  // 1-Click Quick Toggle Visibility for Desks
  const handleToggleDeskPublish = (desk: DeskItem) => {
    const newStatus = desk.isPublished === false ? true : false;
    const updated = desks.map((d) => (d.id === desk.id ? { ...d, isPublished: newStatus } : d));
    onUpdateDesks(updated);
    showNotification(
      newStatus
        ? `✅ Meja "${desk.name}" sekarang AKTIF (Live di website publik).`
        : `⏸️ Meja "${desk.name}" masuk DRAFT (Disembunyikan dari publik).`
    );
  };

  // Filtered desks
  const filteredDesks = desks.filter((d) => {
    const isLive = d.isPublished !== false;
    if (statusFilter === "published" && !isLive) return false;
    if (statusFilter === "draft" && isLive) return false;

    const matchesSearch =
      !searchQuery.trim() ||
      `${d.name} ${d.category} ${d.specs?.material || ""} ${d.specs?.dimensions || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Table Column Definitions for Draggable & Sortable Table Management
  const deskColumns = React.useMemo<TableColumnDef<DeskItem>[]>(() => [
    {
      id: "status",
      label: "Status Publikasi",
      shortLabel: "STATUS",
      minWidth: "min-w-[120px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Visibilitas",
      getValue: (d) => (d.isPublished !== false ? 1 : 0),
      renderCell: (d) => {
        const isLive = d.isPublished !== false;
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleDeskPublish(d);
            }}
            className={`px-2.5 py-1 rounded-lg text-3xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              isLive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
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
      id: "price",
      label: "Harga",
      shortLabel: "Harga",
      minWidth: "min-w-[170px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Finansial",
      getValue: (d) => d.price,
      renderCell: (d) => (
        <div className="font-mono font-bold text-emerald-400 whitespace-nowrap">
          <input
            type="number"
            defaultValue={d.price}
            onBlur={(e) => {
              const newP = Number(e.target.value);
              if (newP !== d.price && newP >= 0) {
                handleQuickEditPrice(d, newP);
              }
            }}
            className="w-28 bg-gp-ink-800/80 border border-gp-ink-650 hover:border-emerald-500 focus:border-emerald-500 rounded px-2 py-1 text-xs text-emerald-400 font-mono font-bold focus:outline-none"
          />
        </div>
      ),
    },
    {
      id: "name",
      label: "Nama Meja",
      shortLabel: "Nama Meja",
      minWidth: "min-w-[260px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Identitas",
      getValue: (d) => d.name,
      renderCell: (d) => (
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gp-ink-300 shrink-0" />
          <div>
            <div
              onClick={() => {
                setSelectedDesk(d);
                setFormData(d);
                setDocContent(getInitialDoc(d));
                setViewMode("studio");
              }}
              className="font-bold text-white hover:text-orange-400 cursor-pointer transition-colors"
              title="Buka di Detail Studio"
            >
              {d.name}
            </div>
            <span className="text-3xs font-mono text-gp-ink-400">
              {d.category} • {d.specs?.dimensions || "120x60"}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "category",
      label: "Kategori",
      shortLabel: "Kategori",
      minWidth: "min-w-[150px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Klasifikasi",
      getValue: (d) => d.category,
      renderCell: (d) => (
        <span className="px-2 py-0.5 rounded text-3xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 whitespace-nowrap">
          {d.category}
        </span>
      ),
    },
    {
      id: "type",
      label: "Tipe",
      shortLabel: "Tipe",
      minWidth: "min-w-[130px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Bentuk",
      getValue: (d) => d.type || "NON L SHAPED",
      renderCell: (d) => (
        <span className="px-1.5 py-0.5 rounded bg-gp-ink-800 border border-gp-ink-650 font-mono text-2xs text-gp-ink-200 whitespace-nowrap">
          {d.type || "NON L SHAPED"}
        </span>
      ),
    },
    {
      id: "material",
      label: "Bahan & Tebal",
      shortLabel: "Material",
      minWidth: "min-w-[160px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Spesifikasi",
      getValue: (d) => `${d.specs?.material || ""} ${d.specs?.thickness || ""}`,
      renderCell: (d) => (
        <div className="font-mono text-2xs text-gp-ink-200 whitespace-nowrap">
          <div>{d.specs?.material || "-"}</div>
          <div className="text-3xs text-gp-ink-400">Tebal: {d.specs?.thickness || "-"}</div>
        </div>
      ),
    },
    {
      id: "dimensions",
      label: "Dimensi",
      shortLabel: "Dimensi",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Spesifikasi",
      getValue: (d) => d.specs?.dimensions || "",
      renderCell: (d) => (
        <span className="font-mono text-gp-ink-200 text-2xs whitespace-nowrap">
          {d.specs?.dimensions || "-"}
        </span>
      ),
    },
    {
      id: "armSupport",
      label: "Arm Support",
      shortLabel: "Arm Support",
      minWidth: "min-w-[150px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Uji GTID",
      getValue: (d) => (d.specs?.armSupport ? 1 : 0),
      renderCell: (d) => (
        <button
          type="button"
          onClick={() => handleQuickEditArmSupport(d, !(d.specs?.armSupport ?? true))}
          className={`px-2 py-0.5 rounded text-3xs font-mono font-bold border transition-colors whitespace-nowrap ${
            d.specs?.armSupport
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
              : "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25"
          }`}
          title="Klik untuk ubah status kelayakan clamp arm"
        >
          {d.specs?.armSupport ? "✓ LOLOS CLAMP" : "! PERLU PLAT"}
        </button>
      ),
    },
    {
      id: "customVariables",
      label: "Variabel Kustom",
      shortLabel: "Variabel",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Parameter",
      getValue: (d) => (d.customVariables || []).length,
      renderCell: (d) =>
        d.customVariables && d.customVariables.length > 0 ? (
          <div className="flex items-center gap-1 flex-wrap">
            {d.customVariables.slice(0, 2).map((v) => (
              <span
                key={v.id}
                className="px-1.5 py-0.5 rounded bg-gp-ink-700 text-amber-300 text-4xs font-mono font-bold border border-gp-ink-600"
                title={`${v.label}: ${v.value}`}
              >
                {v.label}
              </span>
            ))}
            {d.customVariables.length > 2 && (
              <span className="text-4xs font-mono text-gp-ink-400">
                +{d.customVariables.length - 2}
              </span>
            )}
          </div>
        ) : (
          <span className="text-gp-ink-500 font-mono text-3xs">-</span>
        ),
    },
    {
      id: "notes",
      label: "Catatan Reviewer",
      shortLabel: "Catatan",
      minWidth: "min-w-[200px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Ulasan",
      getValue: (d) => d.notes || "",
      renderCell: (d) => (
        <span className="text-gp-ink-200 text-xs line-clamp-2" title={d.notes}>
          {d.notes || "-"}
        </span>
      ),
    },
    {
      id: "description",
      label: "Deskripsi Singkat",
      shortLabel: "Deskripsi",
      minWidth: "min-w-[220px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Ulasan",
      getValue: (d) => d.description || "",
      renderCell: (d) => (
        <span className="text-gp-ink-300 text-xs line-clamp-2" title={d.description}>
          {d.description || "-"}
        </span>
      ),
    },
    {
      id: "shopeeUrl",
      label: "Link Marketplace",
      shortLabel: "Marketplace",
      minWidth: "min-w-[150px]",
      sortable: false,
      isDefaultVisible: false,
      category: "Marketplace",
      getValue: (d) => d.shopeeUrl || "",
      renderCell: (d) =>
        d.shopeeUrl ? (
          <a
            href={d.shopeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 text-3xs font-mono hover:bg-orange-500/20"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Shopee</span>
          </a>
        ) : (
          <span className="text-gp-ink-500 font-mono text-3xs">-</span>
        ),
    },
  ], [handleQuickEditPrice, handleQuickEditArmSupport]);

  // Draggable Table Hook for Desk Management
  const tableManager = useDraggableTable<DeskItem>({
    storageKey: "desk_admin_v2",
    columns: deskColumns,
  });

  const displayDesks = tableManager.getSortedData(filteredDesks);

  return (
    <div className="space-y-4 font-sans text-white">
      {/* Toast Notice */}
      {notice && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-xs text-emerald-200 font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Studio Header */}
      <div className="p-5 rounded-2xl bg-gp-ink-850 border border-gp-ink-650 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <TableIcon className="w-3.5 h-3.5" />
            <span>Katalog Meja, Daun Meja & Standing Desk Studio</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Live Database Rekomendasi Meja & Uji Arm Gas-Spring
          </h2>
          <p className="text-xs text-gp-ink-300 max-w-2xl leading-relaxed">
            Kelola rekomendasi meja dengan tampilan Excel Spreadsheet (Drag & Drop) atau 3-Kolom Studio.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-gp-ink-900 border border-gp-ink-700 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode("excel")}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === "excel"
                  ? "bg-gp-ink-50 text-black shadow-tech-card"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-750"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Tabel Data (Grid)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("studio")}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === "studio"
                  ? "bg-gp-ink-50 text-black shadow-tech-card"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-750"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Detail Studio</span>
            </button>
          </div>

          <Button
            type="button"
            variant="cyber"
            size="sm"
            onClick={handleCreateNew}
            className="text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Meja Baru</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (window.confirm("Reset data meja ke daftar default?")) {
                const reset = DatabaseService.resetDesksToDefault();
                onUpdateDesks(reset);
                setSelectedDesk(reset[0] || null);
                if (reset[0]) {
                  setFormData(reset[0]);
                  setDocContent(getInitialDoc(reset[0]));
                }
                showNotification("Database meja direset ke template bawaan.");
              }
            }}
            className="text-xs text-gp-ink-300 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* RENDER EXCEL VIEW OR 3-COLUMN STUDIO */}
      {viewMode === "excel" ? (
        <div className="space-y-4 font-sans">
          {/* Excel Controls Bar */}
          <div className="p-4 rounded-xl bg-gp-ink-850 border border-gp-ink-700 flex flex-wrap items-center justify-between gap-3 shadow-tech-card">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gp-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama meja, material, dimensi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-gp-ink-800 border border-gp-ink-650 text-xs text-white placeholder-gp-ink-400 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-gp-ink-800 border border-gp-ink-650 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-mono focus:outline-none"
              >
                <option value="all">Semua Kategori Meja</option>
                {DESK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Status Visibility Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "published" | "draft")}
                className="bg-gp-ink-800 border border-gp-ink-650 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-mono focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="published">🟢 Hanya Aktif (Live)</option>
                <option value="draft">⏸️ Hanya Nonaktif (Draft)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsColManagerOpen(true)}
                className="text-xs font-mono text-gp-ink-200 border-gp-ink-600 hover:border-amber-500 hover:text-white flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Kelola Kolom ({tableManager.visibleColumns.length})</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="text-xs font-mono text-amber-400 border-amber-500/40 hover:bg-amber-500/10 flex items-center gap-1.5"
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
                <span>+ Tambah Baris Meja</span>
              </Button>
            </div>
          </div>

          {/* Drag Hint Banner */}
          <div className="px-4 py-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-amber-300 font-mono">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-amber-400" />
              <span>
                <strong>MODE EXCEL AKTIF:</strong> Klik header untuk <strong>Sort (Asc/Desc/Reset)</strong>, Drag header kolom untuk <strong>Reorder Kolom</strong>, atau Drag handle <strong>⠿</strong> untuk urutan baris meja.
              </span>
            </div>
            <span className="text-2xs text-gp-ink-300">
              Menampilkan {displayDesks.length} Meja {tableManager.sortField && `(Sorted by: ${tableManager.sortField})`}
            </span>
          </div>

          {/* Interactive Excel Spreadsheet Grid */}
          <div className="border border-gp-ink-700 rounded-xl overflow-hidden bg-gp-ink-900 shadow-tech-card">
            <div className="overflow-x-auto max-h-[calc(100vh-280px)] no-scrollbar">
              <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
                <thead className="bg-gp-ink-998 text-gp-ink-200 uppercase text-3xs font-mono tracking-wider border-b-2 border-gp-ink-600 sticky top-0 z-20">
                  <tr>
                    <th className="py-3 px-3 w-12 text-center text-gp-ink-400 font-bold border-r border-gp-ink-700">Order</th>
                    <th className="py-3 px-3 w-12 text-gp-ink-400 font-bold border-r border-gp-ink-700 text-center">#</th>
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
                          className={`py-3 px-3 font-mono font-bold text-xs uppercase cursor-pointer select-none transition-colors border-r border-gp-ink-700 ${
                            col.minWidth || "min-w-[140px]"
                          } ${
                            isDragging
                              ? "opacity-40 bg-amber-500/20"
                              : isOver
                              ? "border-l-2 border-l-amber-400 bg-amber-500/10"
                              : "hover:bg-gp-ink-700/80"
                          }`}
                          title="Klik untuk sort (Asc/Desc/Reset), atau Drag untuk memindahkan urutan kolom"
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className="cursor-grab active:cursor-grabbing text-gp-ink-400 hover:text-amber-400"
                                title="Drag kolom"
                              >
                                <GripVertical className="w-3.5 h-3.5" />
                              </span>
                              <span className="truncate">{col.label}</span>
                            </div>
                            {isSorted ? (
                              <span className="text-amber-400 font-bold text-2xs flex-shrink-0">
                                {tableManager.sortDirection === "asc" ? "▲" : "▼"}
                              </span>
                            ) : col.sortable !== false ? (
                              <span className="text-gp-ink-500 text-3xs opacity-40 hover:opacity-100 flex-shrink-0">↕</span>
                            ) : null}
                          </div>
                        </th>
                      );
                    })}
                    <th className="py-3 px-4 font-bold min-w-[180px] text-center sticky right-0 bg-gp-ink-998 z-30">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gp-ink-700/80 font-sans">
                  {displayDesks.map((d, idx) => {
                    const originalIndex = desks.findIndex((item) => item.id === d.id);
                    const isDragging = draggedIndex === originalIndex;
                    const isDragOver = dragOverIndex === originalIndex;

                    return (
                      <tr
                        key={d.id}
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
                        className={`group transition-colors hover:bg-gp-ink-700/40 ${
                          isDragging ? "opacity-30 border-2 border-dashed border-amber-400 bg-amber-950/40" : ""
                        } ${isDragOver ? "border-t-4 border-t-amber-400 bg-amber-950/20" : ""}`}
                      >
                        {/* Drag Handle */}
                        <td className="py-2.5 px-3 text-center border-r border-gp-ink-700/60">
                          <div
                            className={`p-1.5 text-gp-ink-400 hover:text-amber-400 transition-colors inline-flex rounded-lg hover:bg-gp-ink-700 ${
                              tableManager.sortField !== null
                                ? "opacity-30 cursor-not-allowed"
                                : "cursor-grab active:cursor-grabbing"
                            }`}
                            title={
                              tableManager.sortField !== null
                                ? "Reset sorting kolom untuk mengatur urutan baris manual"
                                : "Klik dan geser (drag) untuk memindahkan urutan meja"
                            }
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                        </td>

                        {/* Row Number */}
                        <td className="py-2.5 px-3 font-mono text-2xs text-gp-ink-400 font-bold border-r border-gp-ink-700/60 text-center">
                          #{idx + 1}
                        </td>

                        {/* Dynamic Draggable & Sortable Columns */}
                        {tableManager.visibleColumns.map((col) => (
                          <td key={col.id} className="py-2.5 px-3 border-r border-gp-ink-700/60 align-middle">
                            {col.renderCell(d, idx)}
                          </td>
                        ))}

                        {/* Aksi Sticky */}
                        <td className="py-2.5 px-4 sticky right-0 bg-gp-ink-900 group-hover:bg-gp-ink-850 z-10">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDesk(d);
                                setFormData(d);
                                setDocContent(getInitialDoc(d));
                                setViewMode("studio");
                              }}
                              className="text-2xs font-mono font-bold text-amber-400 border-amber-500/40 hover:bg-amber-500/10 h-7 px-2"
                              title="Buka 3-Kolom Studio"
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              <span>Studio</span>
                            </Button>

                            {onPreviewSidePanel && (
                              <button
                                type="button"
                                onClick={() => onPreviewSidePanel(d)}
                                className="p-1 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-300 hover:text-emerald-400"
                                title="Preview Side Panel"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDuplicate()}
                              className="p-1 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-300 hover:text-white"
                              title="Duplikat Meja"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete()}
                              className="p-1 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-400 hover:text-rose-400"
                              title="Hapus Meja"
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
        /* 3-COLUMN STUDIO LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ============================================================ */}
        {/* COLUMN 1: DESK SELECTOR & SEARCH SIDEBAR (lg:col-span-3) */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 bg-gp-ink-900 border border-gp-ink-700 rounded-xl p-4 space-y-3.5 shadow-tech-card">
          {/* Header Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-gp-ink-300 uppercase tracking-wider">
              // DAFTAR MEJA ({filteredDesks.length})
            </span>
            <Button
              type="button"
              variant="cyber"
              size="sm"
              onClick={handleCreateNew}
              className="text-2xs font-bold py-1 px-2.5 flex items-center gap-1 font-mono"
            >
              <Plus className="w-3 h-3" />
              <span>+ Baru</span>
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gp-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, ukuran, material..."
              className="w-full bg-gp-ink-800 border border-gp-ink-650 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gp-ink-400 focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1 pb-1">
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className={`px-2 py-0.5 rounded text-3xs font-mono font-bold uppercase transition-colors ${
                categoryFilter === "all"
                  ? "bg-amber-500 text-black"
                  : "bg-gp-ink-800 text-gp-ink-300 hover:text-white"
              }`}
            >
              Semua
            </button>
            {DESK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded text-3xs font-mono font-bold uppercase transition-colors truncate max-w-[120px] ${
                  categoryFilter === cat
                    ? "bg-amber-500 text-black"
                    : "bg-gp-ink-800 text-gp-ink-300 hover:text-white"
                }`}
                title={cat}
              >
                {cat.replace("Meja Elektrik (Standing Desk)", "Standing Desk")}
              </button>
            ))}
          </div>

          {/* Desk Items List */}
          <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto no-scrollbar pr-1">
            {filteredDesks.length === 0 ? (
              <div className="p-4 text-center text-xs text-gp-ink-400 font-mono">
                Tidak ada meja yang sesuai pencarian.
              </div>
            ) : (
              filteredDesks.map((d) => {
                const isSelected = selectedDesk?.id === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => handleSelectDesk(d)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-150 border text-left ${
                      isSelected
                        ? "bg-gp-ink-800 border-gp-ink-400 shadow-tech-card"
                        : "bg-gp-ink-950 border-gp-ink-700 hover:border-gp-ink-600 hover:bg-gp-ink-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-4xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {d.category}
                      </span>
                      <span className="text-3xs font-mono text-gp-ink-400">
                        {d.specs?.dimensions || "Custom"}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-orange-400">
                      {d.name}
                    </h4>

                    <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-gp-ink-700/60">
                      <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                        {d.price > 0 ? formatRupiah(d.price) : "Custom Size"}
                      </span>
                      <span
                        className={`text-4xs font-mono font-bold ${
                          d.specs?.armSupport ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {d.specs?.armSupport ? "[ARM OK]" : "[CEK TEBAL]"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Reset Action */}
          <div className="pt-2 border-t border-gp-ink-700">
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset seluruh data meja ke 10 model rekomendasi bawaan?")) {
                  const res = DatabaseService.resetDesksToDefault();
                  onUpdateDesks(res);
                  setSelectedDesk(res[0]);
                  setFormData(res[0]);
                  setDocContent(getInitialDoc(res[0]));
                  showNotification("Database meja telah di-reset ke 10 model bawaan.");
                }
              }}
              className="w-full py-1.5 rounded-lg bg-gp-ink-800 hover:bg-gp-ink-750 border border-gp-ink-700 text-2xs font-mono text-gp-ink-300 hover:text-gp-ink-100 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset ke 10 Model Bawaan</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 2: NOTION / WORD DOCUMENT STUDIO CANVAS (lg:col-span-5) */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 bg-gp-ink-900 border border-gp-ink-700 rounded-xl p-5 space-y-5 shadow-tech-card">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between border-b border-gp-ink-700 pb-3 gap-2">
            <span className="text-3xs font-mono font-bold text-gp-ink-400 uppercase tracking-wider">
              // WORKSPACE // NOTION_CANVAS
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDuplicate}
                className="p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-200 hover:text-orange-400 text-xs flex items-center gap-1"
                title="Duplikat Meja Ini"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="text-2xs hidden sm:inline">Duplikat</span>
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-300 hover:text-rose-400 text-xs flex items-center gap-1"
                title="Hapus Meja"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-2xs hidden sm:inline">Hapus</span>
              </button>
              <Button
                type="button"
                variant="cyber"
                size="sm"
                onClick={handleSave}
                className="text-xs font-bold font-mono px-3.5 py-1.5 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Meja</span>
              </Button>
            </div>
          </div>

          {/* 1. Large Notion Document Page Title */}
          <div className="space-y-1">
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="# Nama Meja Rekomendasi..."
              className="w-full bg-transparent text-lg sm:text-xl font-black text-white placeholder-gp-ink-500 focus:outline-none focus:border-b border-amber-500 tracking-tight leading-snug py-1"
            />
          </div>

          {/* 2. Notion Properties Block (Compact Key-Value Matrix) */}
          <div className="p-3.5 rounded-xl bg-gp-ink-850 border border-gp-ink-700 space-y-2.5 text-xs font-sans">
            <span className="text-3xs font-mono font-bold text-gp-ink-400 uppercase tracking-widest block">
              // PROPERTI_NOTION
            </span>

            {/* Category & Type */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-4 text-gp-ink-300 font-mono text-2xs">Kategori:</span>
              <div className="col-span-8">
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as DeskItem["category"],
                    })
                  }
                  className="w-full bg-gp-ink-800 border border-gp-ink-650 rounded-lg px-2.5 py-1 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                >
                  {DESK_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shape / Type */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-4 text-gp-ink-300 font-mono text-2xs">Bentuk / Tipe:</span>
              <div className="col-span-8 flex gap-1.5">
                {["NON L SHAPED", "L SHAPED"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t })}
                    className={`flex-1 py-1 rounded text-3xs font-mono font-bold border transition-colors ${
                      formData.type === t
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                        : "bg-gp-ink-800 text-gp-ink-300 border-gp-ink-700"
                    }`}
                  >
                    [ {t} ]
                  </button>
                ))}
              </div>
            </div>

            {/* Price Input */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-4 text-gp-ink-300 font-mono text-2xs">Harga (Rp):</span>
              <div className="col-span-8 flex items-center gap-2">
                <input
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-36 bg-gp-ink-800 border border-gp-ink-650 rounded-lg px-2.5 py-1 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
                <span className="text-2xs font-mono text-gp-ink-300">
                  {formatRupiah(formData.price || 0)}
                </span>
              </div>
            </div>

            {/* Dimensions & Thickness */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-4 text-gp-ink-300 font-mono text-2xs">Dimensi (P x L):</span>
              <div className="col-span-8 flex gap-2">
                <input
                  type="text"
                  value={formData.specs?.dimensions || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: {
                        ...(formData.specs as any),
                        dimensions: e.target.value,
                      },
                    })
                  }
                  placeholder="120 x 60 cm"
                  className="flex-1 bg-gp-ink-800 border border-gp-ink-650 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  value={formData.specs?.thickness || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: {
                        ...(formData.specs as any),
                        thickness: e.target.value,
                      },
                    })
                  }
                  placeholder="Tebal: 2.4 cm"
                  className="w-28 bg-gp-ink-800 border border-gp-ink-650 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Arm Support Toggle */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-4 text-gp-ink-300 font-mono text-2xs">Dukungan Arm:</span>
              <div className="col-span-8 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.specs?.armSupport ?? true}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: {
                          ...(formData.specs as any),
                          armSupport: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-gp-ink-600 bg-gp-ink-800 text-emerald-500"
                  />
                  <span
                    className={
                      formData.specs?.armSupport ? "text-emerald-400 font-bold" : "text-gp-ink-300"
                    }
                  >
                    {formData.specs?.armSupport
                      ? "✓ Lolos Clamp Arm Gas-Spring"
                      : "✕ Perlu Plat Protektor Tambahan"}
                  </span>
                </label>
              </div>
            </div>

            {/* Material */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-4 text-gp-ink-300 font-mono text-2xs">Material:</span>
              <div className="col-span-8">
                <input
                  type="text"
                  value={formData.specs?.material || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: {
                        ...(formData.specs as any),
                        material: e.target.value,
                      },
                    })
                  }
                  placeholder="Multiplek / Plywood Full HPL, Kayu Solid..."
                  className="w-full bg-gp-ink-800 border border-gp-ink-650 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Shopee URL */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-4 text-gp-ink-300 font-mono text-2xs">Link Shopee:</span>
              <div className="col-span-8 flex gap-1.5">
                <input
                  type="text"
                  value={formData.shopeeUrl || ""}
                  onChange={(e) => setFormData({ ...formData, shopeeUrl: e.target.value })}
                  placeholder="https://shopee.co.id/..."
                  className="flex-1 bg-gp-ink-800 border border-gp-ink-650 rounded-lg px-2.5 py-1 text-xs text-orange-400 font-mono focus:outline-none focus:border-orange-500 truncate"
                />
                {formData.shopeeUrl && (
                  <a
                    href={formData.shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-300 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 3. Collapsible Specifications Drawer */}
          <div className="border border-gp-ink-700 rounded-xl overflow-hidden bg-gp-ink-900">
            <button
              type="button"
              onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
              className="w-full px-4 py-2.5 bg-gp-ink-800/90 hover:bg-gp-ink-750 flex items-center justify-between text-xs font-mono font-bold text-gp-ink-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gp-ink-300" />
                <span>Parameter Detail & Catatan Meja</span>
              </div>
              {isSpecsExpanded ? (
                <ChevronUp className="w-4 h-4 text-gp-ink-300" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gp-ink-300" />
              )}
            </button>

            {isSpecsExpanded && (
              <div className="p-4 space-y-3 text-xs border-t border-gp-ink-700">
                <div>
                  <label className="text-3xs font-mono text-gp-ink-300 uppercase block mb-1">
                    Ringkasan Singkat (Description):
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ringkasan singkat ulasan meja..."
                    className="w-full bg-gp-ink-800 border border-gp-ink-650 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div>
                  <label className="text-3xs font-mono text-gp-ink-300 uppercase block mb-1">
                    Catatan Penting Reviewer (Notes):
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Catatan ulasan meja..."
                    className="w-full bg-gp-ink-800 border border-gp-ink-650 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div>
                  <label className="text-3xs font-mono text-gp-ink-300 uppercase block mb-1">
                    Badge Status Catatan:
                  </label>
                  <input
                    type="text"
                    value={formData.catatanBadge || ""}
                    onChange={(e) => setFormData({ ...formData, catatanBadge: e.target.value })}
                    placeholder="ADA (DISARANKAN MEMBACA NYA)"
                    className="w-full bg-gp-ink-800 border border-gp-ink-650 rounded-lg px-2.5 py-1 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. Modular Table Builder Trigger */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gp-ink-800/80 border border-gp-ink-700 text-xs">
            <div>
              <span className="font-bold text-white block">Tabel Spesifikasi Modular</span>
              <span className="text-2xs text-gp-ink-300">
                Susun matriks hierarki pengujian meja (ketebalan, goyangan, motor).
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTableBuilderOpen(true)}
              className="text-xs font-mono text-amber-400 border-amber-500/40 hover:bg-amber-500/10 flex items-center gap-1.5"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>+ Susun Tabel Modular</span>
            </Button>
          </div>

          {/* 4.5. VARIABEL & KOLOM DATA MODULAR MEJA */}
          <div className="p-4 rounded-xl bg-gp-ink-850 border border-gp-ink-700 space-y-3 shadow-tech-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  [ VARIABEL & KOLOM DATA MODULAR MEJA ]
                </span>
              </div>
              <span className="text-3xs font-mono text-gp-ink-400">
                {(formData.customVariables || []).length} Variabel Kustom
              </span>
            </div>

            <p className="text-2xs text-gp-ink-300">
              Tambahkan variabel atau parameter pengujian kustom untuk meja ini (misal: Beban Motor, Kecepatan Naik/Turun, Lebar Kaki, dll).
            </p>

            {/* Active Variables List */}
            {(formData.customVariables || []).length > 0 && (
              <div className="space-y-1.5 pt-1">
                {formData.customVariables!.map((v, idx) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between bg-gp-ink-800 border border-gp-ink-650 px-3 py-1.5 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="px-1.5 py-0.5 rounded bg-gp-ink-700 text-4xs font-mono text-amber-400 uppercase font-bold">
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
                      className="text-gp-ink-400 hover:text-rose-400 p-1"
                      title="Hapus Variabel Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Variable Form Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-gp-ink-700/80">
              <input
                type="text"
                placeholder="Nama Variabel / Kolom (e.g. Beban Maks Motor)..."
                value={newVarLabel}
                onChange={(e) => setNewVarLabel(e.target.value)}
                className="sm:col-span-5 bg-gp-ink-800 border border-gp-ink-650 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gp-ink-400 font-mono focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Nilai Data (e.g. 80 kg, 25mm/s)..."
                value={newVarValue}
                onChange={(e) => setNewVarValue(e.target.value)}
                className="sm:col-span-4 bg-gp-ink-800 border border-gp-ink-650 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gp-ink-400 font-mono focus:outline-none focus:border-amber-500"
              />
              <select
                value={newVarCategory}
                onChange={(e) => setNewVarCategory(e.target.value)}
                className="sm:col-span-3 bg-gp-ink-800 border border-gp-ink-650 rounded-lg px-2 py-1.5 text-xs text-amber-400 font-mono focus:outline-none"
              >
                <option value="Material & Frame">Rangka & Kayu</option>
                <option value="Motor Standing">Motor Elektrik</option>
                <option value="Clamp Arm">Uji Bracket Arm</option>
                <option value="Ergonomi">Dimensi Ergonomi</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              {/* Preset Quick Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-4xs font-mono text-gp-ink-400 font-bold uppercase">PRESET:</span>
                {[
                  { l: "Beban Maksimal", v: "100 kg (Dual Motor)", c: "Motor Standing" },
                  { l: "Kecepatan Naik", v: "30 mm/detik", c: "Motor Standing" },
                  { l: "Tebal Besi Hollow", v: "1.5 mm Tebal", c: "Material & Frame" },
                  { l: "Garansi Rangka", v: "2 Tahun Garansi Resmi", c: "Material & Frame" },
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
                    className="text-3xs font-mono px-2 py-0.5 rounded bg-gp-ink-800 border border-gp-ink-650 hover:border-amber-500/60 text-amber-300 transition-colors"
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
  <table class="notion-visual-table w-full border-collapse rounded-xl overflow-hidden border border-gp-ink-700 shadow-tech-card text-xs font-sans">
    <thead>
      <tr class="bg-gp-ink-998 border-b-2 border-gp-ink-600 text-gp-ink-200 font-mono text-2xs tracking-wider uppercase">
        <th class="px-3.5 py-3 text-left font-bold border-r border-gp-ink-700">[ 01 // KATEGORI ]</th>
        <th class="px-3.5 py-3 text-left font-bold border-r border-gp-ink-700">[ 02 // PARAMETER / VARIABEL ]</th>
        <th class="px-3.5 py-3 text-left font-bold">[ 03 // NILAI SPESIFIKASI ]</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gp-ink-700/80 bg-gp-ink-900">
      ${vars
        .map(
          (v) => `
      <tr class="hover:bg-gp-ink-700/40 transition-colors">
        <td class="px-3.5 py-2.5 border-r border-gp-ink-700/60 font-mono text-amber-400 font-bold uppercase text-3xs">${
          v.category || "Spesifikasi"
        }</td>
        <td class="px-3.5 py-2.5 border-r border-gp-ink-700/60 font-semibold text-white">${
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
                      showNotification("Tabel variabel berhasil disisipkan ke ulasan meja.");
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

          {/* 5. Document Canvas Editor (NotionRichEditor / WordDocsStudio) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-3xs font-mono font-bold text-gp-ink-300 uppercase tracking-wider block">
                // DOKUMEN ULASAN MEJA (WORD / NOTION CANVAS):
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsWordDocsOpen(true)}
                className="text-xs font-mono font-bold text-gp-ink-200 border-gp-ink-700 hover:bg-gp-ink-700 flex items-center gap-1.5 h-7 px-2.5"
              >
                <FileSpreadsheet className="w-3 h-3" />
                <span>[ BUKA DI WORD / DOCS STUDIO ]</span>
              </Button>
            </div>
            <NotionRichEditor
              value={docContent}
              onChange={(val) => setDocContent(val)}
              minHeight="min-h-[360px]"
              placeholder="Tulis ulasan teknis ulasan meja, uji goyangan saat mengetik, dan kompatibilitas bracket monitor arm..."
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 3: REAL-TIME LIVE SIDE-PEEK PREVIEW (lg:col-span-4) */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 bg-gp-ink-850 border border-gp-ink-700 rounded-xl p-5 space-y-4 shadow-tech-card sticky top-4">
          <div className="flex items-center justify-between border-b border-gp-ink-700 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                [ LIVE_SIDE_PANEL_PREVIEW ]
              </span>
            </div>
            <span className="text-3xs font-mono text-gp-ink-400">REALTIME SYNC</span>
          </div>

          {/* Simulated Side-Panel Drawer Container */}
          <div className="rounded-xl border border-gp-ink-700 bg-gp-ink-800 p-5 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto no-scrollbar">
            {/* Drawer Top Bar */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-gp-ink-700">
              <div className="flex items-center gap-2 truncate">
                <Layers className="w-4 h-4 text-gp-ink-300 shrink-0" />
                <span className="font-bold text-white text-xs truncate">
                  {formData.name || "Nama Meja"}
                </span>
              </div>
              {formData.shopeeUrl && (
                <span className="px-2 py-0.5 rounded bg-brand-shopee/20 text-brand-shopee font-bold text-3xs flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3" />
                  <span>Shopee</span>
                </span>
              )}
            </div>

            {/* Title & Desc */}
            <div>
              <h3 className="text-base font-black text-white leading-snug">
                {formData.name || "Nama Meja"}
              </h3>
              {formData.description && (
                <p className="text-xs text-gp-ink-300 mt-1 leading-relaxed">
                  {formData.description}
                </p>
              )}
            </div>

            {/* Properties Matrix */}
            <div className="p-3 rounded-xl bg-gp-ink-850 border border-gp-ink-700/80 space-y-2 text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-gp-ink-400">Bentuk / Tipe</span>
                <span className="px-2 py-0.5 rounded text-3xs font-bold bg-gp-ink-800 text-gp-ink-100 border border-gp-ink-700">
                  {formData.type || "NON L SHAPED"}
                </span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-gp-ink-400">Status Catatan</span>
                <span className="px-2 py-0.5 rounded text-3xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {formData.catatanBadge || "ADA"}
                </span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-gp-ink-400">Kategori</span>
                <span className="px-2 py-0.5 rounded text-3xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {formData.category}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-gp-ink-700/60">
                <span className="text-gp-ink-400">Kisaran Harga</span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  {formData.price && formData.price > 0
                    ? formatRupiah(formData.price)
                    : "Custom Size"}
                </span>
              </div>
            </div>

            {/* Spek Box */}
            <div className="p-3 rounded-xl bg-gp-ink-800/60 border border-gp-ink-700 space-y-1 text-xs">
              <div className="text-gp-ink-200">
                <strong>Material:</strong> {formData.specs?.material || "-"} (Tebal:{" "}
                {formData.specs?.thickness || "-"})
              </div>
              <div className="text-gp-ink-200">
                <strong>Dimensi:</strong> {formData.specs?.dimensions || "-"}
              </div>
              <div className="text-gp-ink-200">
                <strong>Arm Gas-Spring:</strong>{" "}
                {formData.specs?.armSupport ? (
                  <span className="text-emerald-400 font-mono font-bold">Aman Dijepit (Clamp OK)</span>
                ) : (
                  <span className="text-amber-400 font-mono font-bold">Perlu Plat Tambahan</span>
                )}
              </div>
            </div>

            {/* Custom Modular Variables Badges */}
            {(formData.customVariables || []).length > 0 && (
              <div className="p-3 rounded-xl bg-gp-ink-800/60 border border-gp-ink-700 space-y-1.5 text-xs">
                <span className="text-3xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  Variabel & Parameter Modular:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {formData.customVariables!.map((v) => (
                    <div
                      key={v.id}
                      className="flex justify-between items-center text-2xs bg-gp-ink-950/60 px-2.5 py-1 rounded-lg border border-gp-ink-700"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-4xs font-mono font-bold text-amber-400 uppercase bg-gp-ink-700 px-1 rounded">
                          {v.category || "Fitur"}
                        </span>
                        <span className="text-gp-ink-300">{v.label}:</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">{v.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Ulasan Markdown / HTML Renderer */}
            <div className="pt-2 border-t border-gp-ink-700">
              <span className="text-3xs font-mono font-bold text-gp-ink-400 uppercase tracking-wider block mb-2">
                Ulasan & Verdict:
              </span>
              <div
                dangerouslySetInnerHTML={{ __html: docContent }}
                className="prose prose-invert prose-xs max-w-none text-gp-ink-200 leading-relaxed text-xs space-y-2"
              />
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Modular Table Builder Dialog */}
      <ModularTableBuilder
        isOpen={isTableBuilderOpen}
        onClose={() => setIsTableBuilderOpen(false)}
        onInsertTable={(tableHtml) => {
          setDocContent((prev) => prev + tableHtml);
          showNotification("Tabel modular berhasil disisipkan ke dokumen ulasan meja.");
        }}
        initialPreset="desk"
      />

      {/* Table Column Manager Modal */}
      <TableColumnManagerModal
        isOpen={isColManagerOpen}
        onClose={() => setIsColManagerOpen(false)}
        title="Manajemen Kolom Tabel Meja"
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

      {/* Full Word / Google Docs Canvas Studio */}
      {isWordDocsOpen && (
        <WordDocsStudio
          isOpen={isWordDocsOpen}
          modeType="guide"
          initialData={{
            id: formData.id || `desk-${Date.now()}`,
            title: formData.name || "Ulasan Meja",
            category: formData.category || "Daun Meja",
            content: docContent,
            tags: formData.keterangan || [],
            description: formData.description || "",
          }}
          onSave={(savedDoc) => {
            setDocContent(savedDoc.content);
            if (savedDoc.title) {
              setFormData((prev) => ({ ...prev, name: savedDoc.title }));
            }
            setIsWordDocsOpen(false);
            showNotification("Dokumen ulasan meja berhasil diperbarui.");
          }}
          onClose={() => setIsWordDocsOpen(false)}
          availableCategories={DESK_CATEGORIES}
        />
      )}
    </div>
  );
}
