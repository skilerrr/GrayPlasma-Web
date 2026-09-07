"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  X,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Check,
  GripVertical,
  Columns,
  Sparkles,
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
  onMoveColumn: (colId: string, direction: "up" | "down") => void;
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
  onResetColumns,
}: TableColumnManagerModalProps<T>) {
  if (!isOpen) return null;

  const colMap = new Map(columns.map((c) => [c.id, c]));
  const orderedColumns = columnOrder
    .map((id) => colMap.get(id))
    .filter((c): c is TableColumnDef<T> => Boolean(c));

  const visibleCount = orderedColumns.filter((c) => columnVisibility[c.id] !== false).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-in fade-in duration-150">
      <div className="bg-[#0c0c11] border border-zinc-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#111116] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Columns className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">{title}</h3>
              <p className="text-[11px] font-mono text-zinc-400">
                {visibleCount} dari {columns.length} kolom aktif ditampilkan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tip Banner */}
        <div className="px-6 py-2.5 bg-zinc-900/60 border-b border-zinc-850 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
          <span className="text-cyan-400 font-bold">INFO:</span>
          <span>Centang kolom yang ingin dilihat dan gunakan tombol panah untuk mengatur urutan tabel.</span>
        </div>

        {/* Scrollable Column List */}
        <div className="p-6 overflow-y-auto space-y-2 divide-y divide-zinc-850">
          {orderedColumns.map((col, idx) => {
            const isVisible = columnVisibility[col.id] !== false;
            const isFirst = idx === 0;
            const isLast = idx === orderedColumns.length - 1;

            return (
              <div
                key={col.id}
                className={`pt-2 first:pt-0 flex items-center justify-between gap-3 p-2.5 rounded-xl transition-colors ${
                  isVisible ? "bg-zinc-900/40 hover:bg-zinc-900/80" : "bg-zinc-950/40 opacity-60"
                }`}
              >
                {/* Left: Checkbox & Label */}
                <label className="flex items-center gap-3 flex-1 cursor-pointer select-none min-w-0">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => onToggleVisibility(col.id)}
                    className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 accent-emerald-500 w-4 h-4"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">{col.label}</span>
                    {col.category && (
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                        // {col.category}
                      </span>
                    )}
                  </div>
                </label>

                {/* Right: Reorder Up/Down Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => onMoveColumn(col.id, "up")}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400"
                    title="Pindah ke Atas (Kiri Tabel)"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => onMoveColumn(col.id, "down")}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400"
                    title="Pindah ke Bawah (Kanan Tabel)"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-[#111116] flex items-center justify-between flex-shrink-0 text-xs">
          <button
            type="button"
            onClick={() => {
              if (confirm("Kembalikan susunan kolom tabel ke pengaturan awal?")) {
                onResetColumns();
              }
            }}
            className="text-zinc-400 hover:text-white flex items-center gap-1.5 font-mono text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </button>

          <Button type="button" variant="cyber" size="sm" onClick={onClose} className="font-bold text-xs font-mono">
            Selesai & Terapkan
          </Button>
        </div>
      </div>
    </div>
  );
}
