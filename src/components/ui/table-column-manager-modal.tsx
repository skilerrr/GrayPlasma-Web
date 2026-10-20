"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Check,
  CheckCheck,
  GripVertical,
  Columns,
  Search,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableColumnDef } from "@/hooks/use-draggable-table";

interface TableColumnManagerModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  columns: TableColumnDef<T>[];
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  onToggleVisibility: (colId: string) => void;
  onMoveColumn?: (colId: string, direction: "up" | "down") => void;
  onReorderColumn?: (fromIndex: number, toIndex: number) => void;
  onSetColumnOrderDirectly?: (newOrder: string[]) => void;
  onSetAllVisibility?: (visible: boolean) => void;
  onResetColumns: () => void;
}

export function TableColumnManagerModal<T>({
  isOpen,
  onClose,
  title = "Manajemen Kolom & Susunan Data",
  columns,
  columnOrder,
  columnVisibility,
  onToggleVisibility,
  onMoveColumn,
  onReorderColumn,
  onSetColumnOrderDirectly,
  onSetAllVisibility,
  onResetColumns,
}: TableColumnManagerModalProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const colMap = new Map(columns.map((c) => [c.id, c]));
  const orderedColumns = columnOrder
    .map((id) => colMap.get(id))
    .filter((c): c is TableColumnDef<T> => Boolean(c));

  // Filtered by search query if any
  const filteredColumns = orderedColumns.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.label.toLowerCase().includes(q) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      c.id.toLowerCase().includes(q)
    );
  });

  const visibleCount = orderedColumns.filter((c) => columnVisibility[c.id] !== false).length;

  // Handle Drag & Drop inside Modal
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    setDragOverIdx(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    if (onReorderColumn) {
      onReorderColumn(draggedIdx, targetIndex);
    } else if (onSetColumnOrderDirectly) {
      const copy = [...columnOrder];
      const [removed] = copy.splice(draggedIdx, 1);
      copy.splice(targetIndex, 0, removed);
      onSetColumnOrderDirectly(copy);
    } else if (onMoveColumn) {
      // Fallback: move step by step
      const step = targetIndex > draggedIdx ? "down" : "up";
      const times = Math.abs(targetIndex - draggedIdx);
      const colId = columnOrder[draggedIdx];
      for (let i = 0; i < times; i++) {
        onMoveColumn(colId, step);
      }
    }

    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (onSetAllVisibility) {
      onSetAllVisibility(true);
    } else {
      columns.forEach((c) => {
        if (columnVisibility[c.id] === false) {
          onToggleVisibility(c.id);
        }
      });
    }
  };

  const handleDeselectAll = () => {
    if (onSetAllVisibility) {
      onSetAllVisibility(false);
    } else {
      columns.forEach((c) => {
        if (columnVisibility[c.id] !== false) {
          onToggleVisibility(c.id);
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 font-sans animate-in fade-in duration-150">
      <div className="bg-gp-ink-900 border border-gp-ink-600/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gp-ink-700 flex items-center justify-between bg-gp-ink-850 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-hue-emerald-500/10 border border-hue-emerald-500/30 text-hue-emerald-400">
              <Columns className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>{title}</span>
                <span className="px-2 py-0.5 rounded-full text-3xs font-mono bg-gp-ink-700 text-hue-emerald-400 border border-gp-ink-600">
                  {visibleCount}/{columns.length} Aktif
                </span>
              </h3>
              <p className="text-xs text-gp-ink-300 mt-0.5">
                Tarik handle bar untuk atur urutan kolom, atau aktifkan/sembunyikan kolom tabel.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search & Quick Actions */}
        <div className="px-6 py-3 bg-gp-ink-900 border-b border-gp-ink-700/80 space-y-2.5 flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-gp-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kolom (cth: Harga, Material, Panel, Status)..."
              className="w-full bg-gp-ink-950 border border-gp-ink-700 rounded-xl pl-9 pr-8 py-1.5 text-xs text-gp-ink-100 placeholder:text-gp-ink-500 focus:outline-none focus:border-hue-emerald-500/60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gp-ink-400 hover:text-white text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-2.5 py-1 rounded-lg bg-gp-ink-800 hover:bg-gp-ink-700 border border-gp-ink-700 text-hue-emerald-400 hover:text-hue-emerald-300 font-medium text-2xs flex items-center gap-1.5 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Pilih Semua</span>
              </button>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="px-2.5 py-1 rounded-lg bg-gp-ink-800 hover:bg-gp-ink-700 border border-gp-ink-700 text-gp-ink-300 hover:text-gp-ink-200 font-medium text-2xs flex items-center gap-1.5 transition-colors"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Sembunyikan Semua</span>
              </button>
            </div>

            <span className="text-2xs font-mono text-gp-ink-400 hidden sm:inline-block">
              Tip: Drag & drop untuk atur posisi
            </span>
          </div>
        </div>

        {/* Scrollable Column List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-1.5 divide-y divide-transparent">
          {filteredColumns.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-xs text-gp-ink-400">Tidak ada kolom yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-xs text-hue-emerald-400"
              >
                Hapus Pencarian
              </Button>
            </div>
          ) : (
            filteredColumns.map((col, idx) => {
              const originalIndex = orderedColumns.findIndex((c) => c.id === col.id);
              const isVisible = columnVisibility[col.id] !== false;
              const isDragging = draggedIdx === originalIndex;
              const isOver = dragOverIdx === originalIndex;

              return (
                <div
                  key={col.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, originalIndex)}
                  onDragOver={(e) => handleDragOver(e, originalIndex)}
                  onDrop={(e) => handleDrop(e, originalIndex)}
                  onDragEnd={() => {
                    setDraggedIdx(null);
                    setDragOverIdx(null);
                  }}
                  className={`group relative flex items-center justify-between gap-3 p-2.5 rounded-xl border transition-all select-none cursor-grab active:cursor-grabbing ${
                    isOver
                      ? "border-hue-emerald-500 bg-hue-emerald-500/10 shadow-lg"
                      : isDragging
                      ? "opacity-40 border-gp-ink-600 bg-gp-ink-800"
                      : isVisible
                      ? "bg-gp-ink-800/60 border-gp-ink-700/80 hover:bg-gp-ink-800 hover:border-gp-ink-600"
                      : "bg-gp-ink-950/40 border-gp-ink-800 opacity-60 hover:opacity-90"
                  }`}
                >
                  {/* Left: Drag Handle, Number, Checkbox & Info */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div
                      className="p-1 rounded text-gp-ink-500 group-hover:text-gp-ink-200 transition-colors"
                      title="Tarik untuk memindahkan urutan"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <span className="w-5 text-3xs font-mono font-bold text-gp-ink-400 text-center">
                      #{originalIndex + 1}
                    </span>

                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => onToggleVisibility(col.id)}
                      className="rounded border-gp-ink-600 bg-gp-ink-800 text-hue-emerald-500 accent-hue-emerald-500 w-4 h-4 cursor-pointer"
                    />

                    <div
                      onClick={() => onToggleVisibility(col.id)}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold truncate block ${
                            isVisible ? "text-white" : "text-gp-ink-400 line-through"
                          }`}
                        >
                          {col.label}
                        </span>
                        {col.category && (
                          <span className="text-4xs font-mono px-1.5 py-0.5 rounded bg-gp-ink-950 border border-gp-ink-700 text-gp-ink-300 uppercase tracking-wider shrink-0">
                            {col.category}
                          </span>
                        )}
                      </div>
                      {col.shortLabel && col.shortLabel !== col.label && (
                        <span className="text-3xs font-mono text-gp-ink-400 block truncate">
                          Header: {col.shortLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Eye Toggle & Fallback Move Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleVisibility(col.id)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        isVisible
                          ? "bg-hue-emerald-500/10 text-hue-emerald-400 border-hue-emerald-500/30 hover:bg-hue-emerald-500/20"
                          : "bg-gp-ink-800 text-gp-ink-400 border-gp-ink-700 hover:text-gp-ink-200"
                      }`}
                      title={isVisible ? "Klik untuk sembunyikan" : "Klik untuk tampilkan"}
                    >
                      {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    {onMoveColumn && (
                      <div className="flex items-center">
                        <button
                          type="button"
                          disabled={originalIndex === 0}
                          onClick={() => onMoveColumn(col.id, "up")}
                          className="p-1.5 rounded-l-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-300 hover:text-white disabled:opacity-20 disabled:hover:text-gp-ink-300"
                          title="Pindah Naik"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={originalIndex === orderedColumns.length - 1}
                          onClick={() => onMoveColumn(col.id, "down")}
                          className="p-1.5 rounded-r-lg bg-gp-ink-800 border border-l-0 border-gp-ink-700 text-gp-ink-300 hover:text-white disabled:opacity-20 disabled:hover:text-gp-ink-300"
                          title="Pindah Turun"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gp-ink-700 bg-gp-ink-850 flex items-center justify-between flex-shrink-0 text-xs">
          <button
            type="button"
            onClick={() => {
              if (confirm("Kembalikan susunan kolom tabel ke pengaturan awal?")) {
                onResetColumns();
              }
            }}
            className="text-gp-ink-300 hover:text-hue-rose-400 flex items-center gap-1.5 font-mono text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </button>

          <Button
            type="button"
            variant="cyber"
            size="sm"
            onClick={onClose}
            className="font-bold text-xs font-mono px-5"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            <span>Selesai & Terapkan</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
