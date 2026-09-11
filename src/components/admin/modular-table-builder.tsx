"use client";

import React, { useState } from "react";
import {
  Table as TableIcon,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  GripVertical,
  FolderPlus,
  Sparkles,
  Download,
  X,
  Check,
  Edit2,
  ChevronRight,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TableColumn {
  id: string;
  label: string;
}

export interface TableRowItem {
  id: string;
  isHeaderGroup: boolean;
  groupTitle?: string;
  cells: Record<string, string>; // columnId -> value
}

interface ModularTableBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTable: (html: string) => void;
  initialPreset?: "desk" | "monitor" | "comparison" | "blank";
}

const PRESET_DESK: { columns: TableColumn[]; rows: TableRowItem[] } = {
  columns: [
    { id: "col_param", label: "Parameter & Fitur" },
    { id: "col_val", label: "Hasil Uji / Spek" },
    { id: "col_tol", label: "Standar Uji GrayPlasma" },
    { id: "col_verdict", label: "Verdict Kelayakan" },
  ],
  rows: [
    {
      id: "grp_1",
      isHeaderGroup: true,
      groupTitle: "// DIMENSI & MATERIAL DAUN MEJA",
      cells: {},
    },
    {
      id: "row_1_1",
      isHeaderGroup: false,
      cells: {
        col_param: "Ketebalan Daun Meja",
        col_val: "2.4 cm (24 mm)",
        col_tol: "Minimal 1.8 cm untuk Arm",
        col_verdict: "SANGAT AMAN (Plywood)",
      },
    },
    {
      id: "row_1_2",
      isHeaderGroup: false,
      cells: {
        col_param: "Material Inti (Core)",
        col_val: "Multiplek / Plywood Full",
        col_tol: "Hindari Particle Board tipis",
        col_verdict: "LULUS UJI KEPADATAN",
      },
    },
    {
      id: "row_1_3",
      isHeaderGroup: false,
      cells: {
        col_param: "Lapisan Permukaan",
        col_val: "HPL Matte Anti-Gores",
        col_tol: "Tahan air & panas cangkir",
        col_verdict: "DURABLE FINISH",
      },
    },
    {
      id: "grp_2",
      isHeaderGroup: true,
      groupTitle: "// KEKUATAN CLAMP MONITOR ARM",
      cells: {},
    },
    {
      id: "row_2_1",
      isHeaderGroup: false,
      cells: {
        col_param: "Uji Jepit Clamp Arm (Single)",
        col_val: "North Bayou H100 (Beban 9kg)",
        col_tol: "Tanpa deformasi plat jepit",
        col_verdict: "STABIL (No Deflection)",
      },
    },
    {
      id: "row_2_2",
      isHeaderGroup: false,
      cells: {
        col_param: "Uji Jepit Clamp Arm (Dual)",
        col_val: "Oximus Hydra ZD1104 (Dual 27\")",
        col_tol: "Disarankan plat protektor EV-06",
        col_verdict: "SANGAT KOKOH",
      },
    },
    {
      id: "grp_3",
      isHeaderGroup: true,
      groupTitle: "// RANGKA KAKI & KESTABILAN",
      cells: {},
    },
    {
      id: "row_3_1",
      isHeaderGroup: false,
      cells: {
        col_param: "Stabilitas Goyang (Tinggi 75cm)",
        col_val: "Goyangan < 2 mm saat mengetik",
        col_tol: "Maksimal toleransi 5 mm",
        col_verdict: "EXCELLENT",
      },
    },
  ],
};

const PRESET_MONITOR: { columns: TableColumn[]; rows: TableRowItem[] } = {
  columns: [
    { id: "col_param", label: "Parameter Display" },
    { id: "col_val", label: "Pengukuran Lab GTID" },
    { id: "col_tol", label: "Toleransi Standar" },
    { id: "col_verdict", label: "Verdict GTID" },
  ],
  rows: [
    {
      id: "grp_m1",
      isHeaderGroup: true,
      groupTitle: "// MOTION CLARITY & RESPONSE TIME",
      cells: {},
    },
    {
      id: "row_m1_1",
      isHeaderGroup: false,
      cells: {
        col_param: "Response Time GtG (Fastest Mode)",
        col_val: "4.8 ms (Overdrive: Fast)",
        col_tol: "Toleransi Baru (5 RGB)",
        col_verdict: "LULUS TANPA OVERSHOOT",
      },
    },
    {
      id: "row_m1_2",
      isHeaderGroup: false,
      cells: {
        col_param: "Input Lag Display (1080p)",
        col_val: "3.2 ms at 180Hz",
        col_tol: "< 5 ms untuk Esport",
        col_verdict: "ESPORT READY",
      },
    },
    {
      id: "grp_m2",
      isHeaderGroup: true,
      groupTitle: "// AKURASI WARNA & KALIBRASI CALMAN",
      cells: {},
    },
    {
      id: "row_m2_1",
      isHeaderGroup: false,
      cells: {
        col_param: "Delta E Rata-rata (sRGB Mode)",
        col_val: "ΔE 1.2 (Sangat Akurat)",
        col_tol: "Target ΔE < 2.0",
        col_verdict: "COLOR ACCURATE OUT OF BOX",
      },
    },
    {
      id: "row_m2_2",
      isHeaderGroup: false,
      cells: {
        col_param: "Contrast Ratio Statis",
        col_val: "1180 : 1 (Peak Black: 0.25 nit)",
        col_tol: "IPS Standar 1000:1",
        col_verdict: "DEEP IPS CONTRAST",
      },
    },
  ],
};

const PRESET_COMPARISON: { columns: TableColumn[]; rows: TableRowItem[] } = {
  columns: [
    { id: "col_feature", label: "Fitur / Komponen" },
    { id: "col_model_a", label: "Model Varian A" },
    { id: "col_model_b", label: "Model Varian B" },
    { id: "col_rec", label: "Rekomendasi GrayPlasma" },
  ],
  rows: [
    {
      id: "grp_c1",
      isHeaderGroup: true,
      groupTitle: "// PERBANDINGAN HARGA & KELAS",
      cells: {},
    },
    {
      id: "row_c1_1",
      isHeaderGroup: false,
      cells: {
        col_feature: "Estimasi Harga Pasar",
        col_model_a: "Rp 1.450.000",
        col_model_b: "Rp 1.850.000",
        col_rec: "Varian A lebih hemat Rp 400rb",
      },
    },
    {
      id: "grp_c2",
      isHeaderGroup: true,
      groupTitle: "// PERBANDINGAN ERGONOMI & BUILD",
      cells: {},
    },
    {
      id: "row_c2_1",
      isHeaderGroup: false,
      cells: {
        col_feature: "Dudukan / Stand Bawaan",
        col_model_a: "Tilt Only (Kemiringan saja)",
        col_model_b: "Height, Pivot, Swivel",
        col_rec: "Pilih B jika tanpa bracket arm",
      },
    },
  ],
};

export function ModularTableBuilder({
  isOpen,
  onClose,
  onInsertTable,
  initialPreset = "desk",
}: ModularTableBuilderProps) {
  const getInitialState = () => {
    if (initialPreset === "desk") return PRESET_DESK;
    if (initialPreset === "monitor") return PRESET_MONITOR;
    if (initialPreset === "comparison") return PRESET_COMPARISON;
    return {
      columns: [
        { id: "col_1", label: "Kolom 1" },
        { id: "col_2", label: "Kolom 2" },
      ],
      rows: [
        { id: "grp_1", isHeaderGroup: true, groupTitle: "// SEKSI UTAMA", cells: {} },
        { id: "row_1", isHeaderGroup: false, cells: { col_1: "Data 1", col_2: "Data 2" } },
      ],
    };
  };

  const [columns, setColumns] = useState<TableColumn[]>(() => getInitialState().columns);
  const [rows, setRows] = useState<TableRowItem[]>(() => getInitialState().rows);
  const [newColName, setNewColName] = useState("");
  const [isAddingCol, setIsAddingCol] = useState(false);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [dragOverRowIndex, setDragOverRowIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  // Add Column
  const handleAddColumn = () => {
    const trimmed = newColName.trim();
    if (!trimmed) return;
    const colId = `col_${Date.now()}`;
    const newCol: TableColumn = { id: colId, label: trimmed };
    setColumns([...columns, newCol]);
    setNewColName("");
    setIsAddingCol(false);
  };

  // Delete Column
  const handleDeleteColumn = (colId: string) => {
    if (columns.length <= 1) {
      alert("Tabel wajib memiliki minimal 1 kolom.");
      return;
    }
    setColumns(columns.filter((c) => c.id !== colId));
  };

  // Rename Column
  const handleRenameColumn = (colId: string, newLabel: string) => {
    setColumns(columns.map((c) => (c.id === colId ? { ...c, label: newLabel } : c)));
  };

  // Add Hierarchy Group Header
  const handleAddGroupHeader = () => {
    const newRow: TableRowItem = {
      id: `grp_${Date.now()}`,
      isHeaderGroup: true,
      groupTitle: `// SEKSI BARU (${rows.filter((r) => r.isHeaderGroup).length + 1})`,
      cells: {},
    };
    setRows([...rows, newRow]);
  };

  // Add Child Data Row
  const handleAddDataRow = (index?: number) => {
    const defaultCells: Record<string, string> = {};
    columns.forEach((c) => {
      defaultCells[c.id] = "Isi data...";
    });
    const newRow: TableRowItem = {
      id: `row_${Date.now()}`,
      isHeaderGroup: false,
      cells: defaultCells,
    };

    if (index !== undefined && index >= 0) {
      const copy = [...rows];
      copy.splice(index + 1, 0, newRow);
      setRows(copy);
    } else {
      setRows([...rows, newRow]);
    }
  };

  // Move Row
  const handleMoveRow = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === rows.length - 1) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const copy = [...rows];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setRows(copy);
  };

  // Drag and Drop Row Reorder
  const handleRowDrop = (targetIdx: number) => {
    if (draggedRowIndex === null || draggedRowIndex === targetIdx) return;
    const newRows = [...rows];
    const [dragged] = newRows.splice(draggedRowIndex, 1);
    newRows.splice(targetIdx, 0, dragged);
    setRows(newRows);
    setDraggedRowIndex(null);
    setDragOverRowIndex(null);
  };

  // Delete Row
  const handleDeleteRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  // Update Group Title
  const handleUpdateGroupTitle = (id: string, title: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, groupTitle: title } : r)));
  };

  // Update Cell Value
  const handleUpdateCell = (rowId: string, colId: string, value: string) => {
    setRows(
      rows.map((r) => {
        if (r.id === rowId) {
          return {
            ...r,
            cells: {
              ...r.cells,
              [colId]: value,
            },
          };
        }
        return r;
      })
    );
  };

  // Apply Preset
  const handleApplyPreset = (presetKey: "desk" | "monitor" | "comparison" | "blank") => {
    if (presetKey === "desk") {
      setColumns(PRESET_DESK.columns);
      setRows(PRESET_DESK.rows);
    } else if (presetKey === "monitor") {
      setColumns(PRESET_MONITOR.columns);
      setRows(PRESET_MONITOR.rows);
    } else if (presetKey === "comparison") {
      setColumns(PRESET_COMPARISON.columns);
      setRows(PRESET_COMPARISON.rows);
    } else {
      setColumns([
        { id: "c1", label: "Parameter" },
        { id: "c2", label: "Keterangan" },
      ]);
      setRows([
        { id: "g1", isHeaderGroup: true, groupTitle: "// SEKSI UTAMA", cells: {} },
        { id: "r1", isHeaderGroup: false, cells: { c1: "Contoh Fitur", c2: "Contoh Nilai" } },
      ]);
    }
  };

  // Export & Insert HTML
  const handleInsert = () => {
    const colCount = columns.length;
    let html = `
<div class="notion-table-wrapper my-6 overflow-x-auto">
  <table class="notion-visual-table w-full border-collapse rounded-xl overflow-hidden border border-zinc-800 shadow-tech-card text-xs font-sans">
    <thead>
      <tr class="bg-[#050508] border-b-2 border-zinc-700 text-zinc-300 font-mono text-[11px] tracking-wider uppercase">
        ${columns
          .map(
            (c) =>
              `<th class="px-3.5 py-3 text-left font-bold border-r border-zinc-800 last:border-r-0">${c.label}</th>`
          )
          .join("")}
      </tr>
    </thead>
    <tbody class="divide-y divide-zinc-800/80 bg-[#0c0c11]">
`;

    rows.forEach((row) => {
      if (row.isHeaderGroup) {
        html += `
      <tr class="bg-zinc-900/90 border-t-2 border-b border-zinc-700/80">
        <td colspan="${colCount}" class="px-4 py-2 text-[11px] font-mono font-bold tracking-wider text-amber-400 uppercase">
          ${row.groupTitle || "Seksi"}
        </td>
      </tr>
`;
      } else {
        html += `
      <tr class="hover:bg-zinc-800/40 transition-colors">
        ${columns
          .map((col, idx) => {
            const val = row.cells[col.id] || "-";
            const isFirstCol = idx === 0;
            return `
          <td class="px-3.5 py-2.5 border-r border-zinc-800/60 last:border-r-0 ${
            isFirstCol ? "font-semibold text-white" : "text-zinc-300"
          }">
            ${val}
          </td>
`;
          })
          .join("")}
      </tr>
`;
      }
    });

    html += `
    </tbody>
  </table>
</div>
<p><br></p>
`;

    onInsertTable(html);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 font-sans">
      <div className="bg-[#0b0b0f] border border-zinc-800 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="h-16 px-6 bg-[#101017] border-b-2 border-zinc-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <TableIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight font-sans">
                  Modular Table Builder
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Susun kolom teknis kustom dan baris berhierarki untuk ulasan rekomendasi GrayPlasma.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Toolbar & Preset Strips */}
        <div className="px-6 py-3 bg-[#0d0d12] border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 text-xs">
          {/* Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
              Preset Template:
            </span>
            <button
              type="button"
              onClick={() => handleApplyPreset("desk")}
              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 hover:border-amber-500/60 text-amber-300 font-mono text-[11px] font-semibold transition-colors"
            >
              Uji Meja & Arm
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("monitor")}
              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 hover:border-cyan-500/60 text-cyan-300 font-mono text-[11px] font-semibold transition-colors"
            >
              Lab Monitor GTID
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("comparison")}
              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 hover:border-violet-500/60 text-violet-300 font-mono text-[11px] font-semibold transition-colors"
            >
              [Perbandingan Model]
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("blank")}
              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 font-mono text-[11px] font-semibold transition-colors"
            >
              [Kosong]
            </button>
          </div>

          {/* Add Row & Group Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddGroupHeader}
              className="text-xs font-mono font-bold text-amber-400 border-amber-500/40 hover:bg-amber-500/10 flex items-center gap-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Seksi Hierarki</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddDataRow()}
              className="text-xs font-mono font-bold text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Baris Data</span>
            </Button>
          </div>
        </div>

        {/* Main Interactive Table Grid Canvas */}
        <div className="flex-1 overflow-auto p-6 bg-[#07070a]">
          <div className="border border-zinc-800 rounded-xl overflow-hidden shadow-tech-card bg-[#0d0d12]">
            {/* Table Headers (Columns with rename & delete controls) */}
            <div className="bg-[#050508] border-b-2 border-zinc-700 p-2.5 flex items-center justify-between gap-3 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider mr-1">
                  KOLOM ({columns.length}):
                </span>
                {columns.map((col, idx) => (
                  <div
                    key={col.id}
                    className="group relative flex items-center gap-1.5 bg-zinc-900 border border-zinc-750 px-2.5 py-1 rounded-md"
                  >
                    <span className="text-[10px] font-mono text-zinc-500 font-bold">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={col.label}
                      onChange={(e) => handleRenameColumn(col.id, e.target.value)}
                      className="bg-transparent text-white font-mono font-bold text-xs focus:outline-none focus:text-emerald-400 w-28 sm:w-36"
                    />
                    {columns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteColumn(col.id)}
                        className="text-zinc-500 hover:text-rose-400 opacity-60 group-hover:opacity-100 p-0.5"
                        title="Hapus Kolom"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                {isAddingCol ? (
                  <div className="flex items-center gap-1 bg-zinc-900 border border-emerald-500/50 px-2 py-0.5 rounded-md">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Nama Kolom..."
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddColumn();
                        if (e.key === "Escape") setIsAddingCol(false);
                      }}
                      className="bg-transparent text-xs text-white font-mono focus:outline-none w-28"
                    />
                    <button
                      type="button"
                      onClick={handleAddColumn}
                      className="p-1 text-emerald-400 hover:text-emerald-300"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingCol(false)}
                      className="p-1 text-zinc-500 hover:text-zinc-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingCol(true)}
                    className="px-2.5 py-1 rounded bg-zinc-900/80 border border-dashed border-zinc-700 hover:border-emerald-500 text-[11px] font-mono font-semibold text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Kolom Baru</span>
                  </button>
                )}
              </div>
            </div>

            {/* Rows List */}
            <div className="divide-y divide-zinc-800/80">
              {rows.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                  Belum ada baris data. Klik <strong>+ Seksi Hierarki</strong> atau{" "}
                  <strong>+ Baris Data</strong> di atas untuk memulai.
                </div>
              ) : (
                rows.map((row, rIdx) => {
                  const isDragging = draggedRowIndex === rIdx;
                  const isDragOver = dragOverRowIndex === rIdx;

                  if (row.isHeaderGroup) {
                    return (
                      <div
                        key={row.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggedRowIndex(rIdx);
                          e.dataTransfer.setData("text/plain", `${rIdx}`);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (dragOverRowIndex !== rIdx) setDragOverRowIndex(rIdx);
                        }}
                        onDragLeave={() => {
                          if (dragOverRowIndex === rIdx) setDragOverRowIndex(null);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          handleRowDrop(rIdx);
                        }}
                        onDragEnd={() => {
                          setDraggedRowIndex(null);
                          setDragOverRowIndex(null);
                        }}
                        className={`bg-zinc-950 px-4 py-2.5 flex items-center justify-between gap-3 border-t-2 border-b border-amber-500/30 group transition-all ${
                          isDragging
                            ? "opacity-30 border-dashed border-amber-400 bg-amber-950/40"
                            : ""
                        } ${isDragOver ? "border-t-4 border-t-amber-400 bg-amber-950/30 scale-[1.005]" : ""}`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className="cursor-grab active:cursor-grabbing p-1 text-zinc-600 hover:text-amber-400 transition-colors"
                            title="Drag untuk memindahkan urutan seksi ini"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-mono text-amber-500 font-bold">
                            SEKSI:
                          </span>
                          <input
                            type="text"
                            value={row.groupTitle || ""}
                            onChange={(e) => handleUpdateGroupTitle(row.id, e.target.value)}
                            className="bg-transparent text-amber-400 font-mono font-bold text-xs uppercase tracking-wider focus:outline-none focus:text-white flex-1"
                            placeholder="// NAMA SEKSI HIERARKI..."
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleAddDataRow(rIdx)}
                            className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-750 text-emerald-400 hover:border-emerald-500 text-[10px] font-mono font-bold flex items-center gap-1"
                            title="Tambah Baris di Bawah Seksi Ini"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Baris</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveRow(rIdx, "up")}
                            disabled={rIdx === 0}
                            className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
                            title="Geser Naik"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveRow(rIdx, "down")}
                            disabled={rIdx === rows.length - 1}
                            className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
                            title="Geser Turun"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(row.id)}
                            className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400"
                            title="Hapus Seksi"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={row.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggedRowIndex(rIdx);
                        e.dataTransfer.setData("text/plain", `${rIdx}`);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverRowIndex !== rIdx) setDragOverRowIndex(rIdx);
                      }}
                      onDragLeave={() => {
                        if (dragOverRowIndex === rIdx) setDragOverRowIndex(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleRowDrop(rIdx);
                      }}
                      onDragEnd={() => {
                        setDraggedRowIndex(null);
                        setDragOverRowIndex(null);
                      }}
                      className={`px-3 py-2 flex items-center gap-2 hover:bg-zinc-800/30 transition-all group ${
                        isDragging
                          ? "opacity-30 border border-dashed border-emerald-400 bg-emerald-950/40"
                          : ""
                      } ${isDragOver ? "border-t-2 border-t-emerald-400 bg-emerald-950/20" : ""}`}
                    >
                      <div className="flex items-center gap-1 text-zinc-600 font-mono text-[10px]">
                        <div
                          className="cursor-grab active:cursor-grabbing p-1 text-zinc-500 hover:text-emerald-400 transition-colors"
                          title="Drag untuk memindahkan urutan baris ini"
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleMoveRow(rIdx, "up")}
                          disabled={rIdx === 0}
                          className="p-0.5 hover:text-white disabled:opacity-20"
                          title="Geser Naik"
                        >
                          <MoveUp className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveRow(rIdx, "down")}
                          disabled={rIdx === rows.length - 1}
                          className="p-0.5 hover:text-white disabled:opacity-20"
                          title="Geser Turun"
                        >
                          <MoveDown className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      {/* Cells for each column */}
                      <div className="flex-1 grid grid-flow-col auto-cols-fr gap-2 items-center">
                        {columns.map((col, cIdx) => (
                          <div key={col.id} className="relative">
                            <input
                              type="text"
                              value={row.cells[col.id] || ""}
                              onChange={(e) =>
                                handleUpdateCell(row.id, col.id, e.target.value)
                              }
                              placeholder={`Isi ${col.label}...`}
                              className={`w-full bg-zinc-900/90 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 font-sans transition-colors ${
                                cIdx === 0
                                  ? "text-white font-semibold"
                                  : "text-zinc-300"
                              }`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Delete Row Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1 rounded text-zinc-500 hover:text-rose-400 opacity-50 group-hover:opacity-100 transition-opacity"
                        title="Hapus Baris"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="h-16 px-6 bg-[#101017] border-t-2 border-zinc-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span>TOTAL:</span>
            <span className="text-white font-bold">{columns.length} Kolom</span>
            <span>•</span>
            <span className="text-white font-bold">{rows.length} Baris Data & Hierarki</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs border-zinc-700"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="cyber"
              size="sm"
              onClick={handleInsert}
              className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Masukkan Tabel ke Dokumen</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
