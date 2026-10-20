"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Tv,
  ArrowUpDown,
  Table,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Search,
  GripVertical,
  Monitor as MonitorIcon,
  Type,
  Layers,
} from "lucide-react";
import { Monitor, TierRating } from "@/types/monitor";
import { formatRupiah } from "@/lib/utils";
import { useDraggableTable, TableColumnDef } from "@/hooks/use-draggable-table";
import { TableColumnManagerModal } from "@/components/ui/table-column-manager-modal";

interface NotionTableViewProps {
  monitors: Monitor[];
  selectedMonitorId?: string;
  onSelectMonitor: (monitor: Monitor) => void;
  onOpenFilter?: () => void;
  activeFilterCount?: number;
}

export type TableViewTab = "table" | "price" | "size" | "gallery";

export function NotionTableView({
  monitors,
  selectedMonitorId,
  onSelectMonitor,
  onOpenFilter,
  activeFilterCount = 0,
}: NotionTableViewProps) {
  const [activeTab, setActiveTab] = useState<TableViewTab>("table");
  const [isColManagerOpen, setIsColManagerOpen] = useState(false);

  // Column definitions for public table
  const publicColumns = React.useMemo<TableColumnDef<Monitor>[]>(() => [
    {
      id: "price",
      label: "[ KISARAN HARGA ]",
      shortLabel: "Harga",
      minWidth: "min-w-[160px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Finansial",
      getValue: (m) => m.price,
      renderCell: (m) => (
        <span className="font-mono font-bold text-emerald-400 whitespace-nowrap">
          {formatRupiah(m.price)}
        </span>
      ),
    },
    {
      id: "name",
      label: "[ BRAND & MODEL ]",
      shortLabel: "Brand & Model",
      minWidth: "min-w-[250px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Identitas",
      getValue: (m) => m.fullName,
      renderCell: (m) => (
        <div className="flex items-center gap-2">
          <MonitorIcon className="w-3.5 h-3.5 text-gp-ink-400 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
          <span
            className={`font-bold transition-colors ${
              selectedMonitorId === m.id ? "text-emerald-400" : "text-white hover:text-emerald-400"
            }`}
          >
            {m.fullName}
          </span>
        </div>
      ),
    },
    {
      id: "gpTolerance",
      label: "[ GrayPlasma TOLERANSI ]",
      shortLabel: "Toleransi GrayPlasma",
      minWidth: "min-w-[220px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Uji GrayPlasma",
      getValue: (m) => m.responseTimeData?.toleranceNew || "",
      renderCell: (m) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-gp-mint-200 text-accent-emerald border border-accent-emerald/30 text-3xs font-mono font-bold whitespace-nowrap">
            {m.responseTimeData?.toleranceNew || "Toleransi Baru"}
          </span>
          <span className="px-2 py-0.5 rounded bg-gp-coral-300 text-gp-coral-100 border border-gp-coral-100/30 text-3xs font-mono font-bold whitespace-nowrap">
            {m.responseTimeData?.toleranceOld || "Toleransi Lama"}
          </span>
        </div>
      ),
    },
    {
      id: "panelSize",
      label: "[ PANEL & SIZE ]",
      shortLabel: "Panel & Size",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Display",
      getValue: (m) => `${m.specs.display.size} ${m.specs.display.panelType}`,
      renderCell: (m) => (
        <span className="px-1.5 py-0.5 rounded bg-gp-ink-800 border border-gp-ink-700 font-mono text-2xs whitespace-nowrap">
          {m.specs.display.size} {m.specs.display.panelType}
        </span>
      ),
    },
    {
      id: "resolution",
      label: "[ RESOLUSI ]",
      shortLabel: "Resolusi",
      minWidth: "min-w-[150px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Display",
      getValue: (m) => m.specs.display.resolution,
      renderCell: (m) => (
        <span className="px-1.5 py-0.5 rounded bg-gp-ink-800 border border-gp-ink-700 font-mono text-2xs whitespace-nowrap">
          {m.specs.display.resolution}
        </span>
      ),
    },
    {
      id: "refresh",
      label: "[ REFRESH RATE ]",
      shortLabel: "Refresh",
      minWidth: "min-w-[110px]",
      sortable: true,
      isDefaultVisible: true,
      category: "Display",
      getValue: (m) => m.specs.display.refreshRate,
      renderCell: (m) => (
        <span className="px-2 py-0.5 rounded bg-gp-ink-800 text-emerald-400 border border-gp-ink-700 font-mono font-bold text-2xs tabular-nums whitespace-nowrap">
          {m.specs.display.refreshRate}Hz
        </span>
      ),
    },
    {
      id: "tier",
      label: "[ TIER RATING ]",
      shortLabel: "Tier",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Peringkat",
      getValue: (m) => m.tier,
      renderCell: (m) => (
        <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-3xs font-bold whitespace-nowrap">
          {m.tier}
        </span>
      ),
    },
    {
      id: "subpixel",
      label: "[ SUBPIXEL LAYOUT ]",
      shortLabel: "Subpixel",
      minWidth: "min-w-[130px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Panel",
      getValue: (m) => m.panelBitDepth || "RGB",
      renderCell: (m) => (
        <span className="px-1.5 py-0.5 rounded bg-gp-ink-800 border border-gp-ink-600 font-mono text-2xs whitespace-nowrap">
          {m.panelBitDepth || "Standard RGB"}
        </span>
      ),
    },
    {
      id: "vrr",
      label: "[ VRR / SYNC ]",
      shortLabel: "VRR",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Fitur",
      getValue: (m) => m.specs.features?.syncTech || "Adaptive-Sync",
      renderCell: (m) => (
        <span className="text-cyan-400 font-mono text-2xs whitespace-nowrap">
          {m.specs.features?.syncTech || "Adaptive-Sync"}
        </span>
      ),
    },
    {
      id: "gamut",
      label: "[ COLOR GAMUT ]",
      shortLabel: "Gamut",
      minWidth: "min-w-[150px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Warna",
      getValue: (m) => m.specs.display?.colorGamut || "",
      renderCell: (m) => (
        <span className="text-gp-ink-200 font-mono text-2xs whitespace-nowrap">
          {m.specs.display?.colorGamut || "99% sRGB"}
        </span>
      ),
    },
    {
      id: "warranty",
      label: "[ GARANSI ]",
      shortLabel: "Garansi",
      minWidth: "min-w-[140px]",
      sortable: true,
      isDefaultVisible: false,
      category: "Garansi",
      getValue: (m) => m.specs.features?.warranty || "",
      renderCell: (m) => (
        <span className="text-emerald-400 font-mono text-2xs whitespace-nowrap">
          {m.specs.features?.warranty || "3 Tahun"}
        </span>
      ),
    },
    {
      id: "ports",
      label: "[ PORTS / KONEKSI ]",
      shortLabel: "Ports",
      minWidth: "min-w-[160px]",
      sortable: false,
      isDefaultVisible: false,
      category: "Koneksi",
      getValue: (m) => (m.displayInputs || []).join(", "),
      renderCell: (m) => (
        <span className="text-gp-ink-300 text-xs truncate max-w-[150px] block" title={(m.displayInputs || []).join(", ")}>
          {(m.displayInputs || []).join(", ") || "HDMI + DP"}
        </span>
      ),
    },
  ], [selectedMonitorId]);

  const tableManager = useDraggableTable<Monitor>({
    storageKey: "monitor_public_v2",
    columns: publicColumns,
  });

  const displayMonitors = tableManager.getSortedData(monitors);

  return (
    <div className="space-y-4 font-sans text-xs text-gp-ink-200">
      {/* Title & View Mode Tabs Bar (Exact Notion styling from user screenshot) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded bg-gp-ink-800 border border-gp-ink-700 text-emerald-400">
            <MonitorIcon className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            List SDR Monitor (GrayPlasma Review & Database)
          </h2>
        </div>

        {/* Top Notion View Mode Tabs */}
        <div className="flex items-center justify-between border-b border-gp-ink-700 pb-2 overflow-x-auto no-scrollbar gap-4">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "table"
                  ? "bg-gp-ink-700 text-white border border-gp-ink-600"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800 border border-transparent"
              }`}
            >
              <Table className="w-3.5 h-3.5 text-emerald-400" />
              <span>[ LIST TABEL ]</span>
            </button>

            <button
              onClick={() => setActiveTab("price")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "price"
                  ? "bg-gp-ink-700 text-white border border-gp-ink-600"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800 border border-transparent"
              }`}
            >
              <List className="w-3.5 h-3.5 text-gp-ink-300" />
              <span>[ LIST HARGA ]</span>
            </button>

            <button
              onClick={() => setActiveTab("size")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "size"
                  ? "bg-gp-ink-700 text-white border border-gp-ink-600"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800 border border-transparent"
              }`}
            >
              <List className="w-3.5 h-3.5 text-gp-ink-300" />
              <span>[ LIST UKURAN ]</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "gallery"
                  ? "bg-gp-ink-700 text-white border border-gp-ink-600"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800 border border-transparent"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-gp-ink-300" />
              <span>[ GALLERY ]</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenFilter && (
              <button
                type="button"
                onClick={onOpenFilter}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 border ${
                  activeFilterCount > 0
                    ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-tech-subtle"
                    : "border-gp-ink-650 bg-gp-ink-800 text-gp-ink-200 hover:border-emerald-500 hover:text-white"
                }`}
                title="Buka panel parameter filter"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  [ FILTER {activeFilterCount > 0 ? `(${activeFilterCount})` : ""} ]
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsColManagerOpen(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 border border-gp-ink-650 bg-gp-ink-800 text-gp-ink-200 hover:border-emerald-500 hover:text-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>[ KELOLA KOLOM ({tableManager.visibleColumns.length}) ]</span>
            </button>
            <div className="text-2xs font-mono text-gp-ink-400 hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>[ {monitors.length} MODEL REKOMENDASI AKTIF ]</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: TECH-BRUTALIST NOTION DATABASE TABLE VIEW                         */}
      {/* ========================================================================= */}
      {activeTab === "table" && (
        <div className="rounded-xl border border-gp-ink-700 bg-gp-ink-950 overflow-hidden shadow-tech-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[950px]">
              <thead className="bg-gp-ink-998 text-gp-ink-200 uppercase text-3xs font-mono tracking-wider border-b-2 border-gp-ink-600 sticky top-0 z-20">
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
                        className={`py-3 px-3 font-mono font-bold text-xs uppercase cursor-pointer select-none transition-colors border-r border-gp-ink-700 ${
                          col.minWidth || "min-w-[140px]"
                        } ${
                          isDragging
                            ? "opacity-40 bg-cyan-500/20"
                            : isOver
                            ? "border-l-2 border-l-cyan-400 bg-cyan-500/10"
                            : "hover:bg-gp-ink-700/80"
                        }`}
                        title="Klik untuk sort (Asc/Desc/Reset), atau Drag untuk memindahkan urutan kolom"
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className="cursor-grab active:cursor-grabbing text-gp-ink-400 hover:text-cyan-400"
                              title="Drag kolom"
                            >
                              <GripVertical className="w-3.5 h-3.5" />
                            </span>
                            <span className="truncate">{col.label}</span>
                          </div>
                          {isSorted ? (
                            <span className="text-cyan-400 font-bold text-2xs flex-shrink-0">
                              {tableManager.sortDirection === "asc" ? "▲" : "▼"}
                            </span>
                          ) : col.sortable !== false ? (
                            <span className="text-gp-ink-500 text-3xs opacity-40 hover:opacity-100 flex-shrink-0">↕</span>
                          ) : null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-gp-ink-700/80">
                {displayMonitors.map((monitor, idx) => {
                  const isSelected = selectedMonitorId === monitor.id;

                  return (
                    <tr
                      key={monitor.id}
                      onClick={() => onSelectMonitor(monitor)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-gp-sky-400 ring-1 ring-cyan-500/80 ring-inset"
                          : "hover:bg-gp-ink-850"
                      }`}
                    >
                      {tableManager.visibleColumns.map((col) => (
                        <td key={col.id} className="py-3 px-3 border-r border-gp-ink-700/60 align-middle">
                          {col.renderCell(monitor, idx)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: LIST HARGA (GROUPED BY PRICE BRACKET)                             */}
      {/* ========================================================================= */}
      {activeTab === "price" && (
        <div className="space-y-6">
          {[
            {
              title: "Budget Entry Level (< Rp 1.500.000)",
              filter: (m: Monitor) => m.price < 1500000,
              color: "border-emerald-500/40 text-emerald-400",
            },
            {
              title: "Mid-Range Value (Rp 1.500.000 - Rp 3.000.000)",
              filter: (m: Monitor) => m.price >= 1500000 && m.price <= 3000000,
              color: "border-cyan-500/40 text-cyan-400",
            },
            {
              title: "Sweetspot 1440p / 2K (Rp 3.000.000 - Rp 5.000.000)",
              filter: (m: Monitor) => m.price > 3000000 && m.price <= 5000000,
              color: "border-amber-500/40 text-amber-400",
            },
            {
              title: "Enthusiast, 4K & OLED (> Rp 5.000.000)",
              filter: (m: Monitor) => m.price > 5000000,
              color: "border-rose-500/40 text-rose-400",
            },
          ].map((group, idx) => {
            const groupMonitors = displayMonitors.filter(group.filter);
            if (groupMonitors.length === 0) return null;

            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${group.color}`}>
                    <span>{group.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-gp-ink-700 text-3xs text-gp-ink-300 font-mono border border-gp-ink-650">
                      {groupMonitors.length} model
                    </span>
                  </h3>
                </div>

                <div className="rounded-2xl border border-gp-ink-700 bg-gp-ink-800 overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                      <tbody className="divide-y divide-gp-ink-700">
                        {groupMonitors.map((monitor: Monitor) => {
                          const isSelected = selectedMonitorId === monitor.id;
                          return (
                            <tr
                              key={monitor.id}
                              onClick={() => onSelectMonitor(monitor)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? "bg-gp-ink-750 ring-1 ring-gp-sky-800 ring-inset" : "hover:bg-gp-ink-750"
                              }`}
                            >
                              <td className="py-2.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap w-[150px]">
                                {formatRupiah(monitor.price)}
                              </td>
                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2">
                                  <MonitorIcon className="w-3.5 h-3.5 text-gp-ink-400" />
                                  <span className="font-semibold text-white hover:text-emerald-400">
                                    {monitor.fullName}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-gp-ink-300 whitespace-nowrap">
                                {monitor.specs.display.size} • {monitor.specs.display.panelType} • {monitor.specs.display.refreshRate}Hz
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`text-3xs font-bold px-2 py-0.5 rounded ${
                                  monitor.tier === "S-TIER"
                                    ? "bg-gp-mint-900 text-gp-mint"
                                    : monitor.tier === "BEST VALUE"
                                    ? "bg-gp-sky-600 text-gp-sky"
                                    : "bg-gp-ink-700 text-gp-ink-300"
                                }`}>
                                  {monitor.tier}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: LIST UKURAN (GROUPED BY SCREEN SIZE)                              */}
      {/* ========================================================================= */}
      {activeTab === "size" && (
        <div className="space-y-6">
          {[
            {
              title: '24 Inch (FHD Budget & Compact Esports)',
              filter: (m: Monitor) => m.specs.display.size.includes("24") || m.specs.display.size.includes("23.8"),
              color: "text-cyan-400",
            },
            {
              title: '27 Inch (Mainstream 1080p & 1440p 2K)',
              filter: (m: Monitor) => m.specs.display.size.includes("27") || m.specs.display.size.includes("26.5"),
              color: "text-emerald-400",
            },
            {
              title: '32 Inch (Large Immersive & 4K Creation)',
              filter: (m: Monitor) => m.specs.display.size.includes("32") || m.specs.display.size.includes("31.5"),
              color: "text-amber-400",
            },
            {
              title: 'Ultrawide & Curved (21:9 Productivity)',
              filter: (m: Monitor) => m.specs.display.size.toLowerCase().includes("ultrawide") || m.specs.display.size.includes("34"),
              color: "text-rose-400",
            },
          ].map((group, idx) => {
            const groupMonitors = displayMonitors.filter(group.filter);
            if (groupMonitors.length === 0) return null;

            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${group.color}`}>
                    <span>{group.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-gp-ink-700 text-3xs text-gp-ink-300 font-mono border border-gp-ink-650">
                      {groupMonitors.length} model
                    </span>
                  </h3>
                </div>

                <div className="rounded-2xl border border-gp-ink-700 bg-gp-ink-800 overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                      <tbody className="divide-y divide-gp-ink-700">
                        {groupMonitors.map((monitor: Monitor) => {
                          const isSelected = selectedMonitorId === monitor.id;
                          return (
                            <tr
                              key={monitor.id}
                              onClick={() => onSelectMonitor(monitor)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? "bg-gp-ink-750 ring-1 ring-gp-sky-800 ring-inset" : "hover:bg-gp-ink-750"
                              }`}
                            >
                              <td className="py-2.5 px-4 font-mono font-bold text-white whitespace-nowrap w-[100px]">
                                {monitor.specs.display.size}
                              </td>
                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2">
                                  <MonitorIcon className="w-3.5 h-3.5 text-gp-ink-400" />
                                  <span className="font-semibold text-white hover:text-emerald-400">
                                    {monitor.fullName}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-emerald-400 whitespace-nowrap">
                                {formatRupiah(monitor.price)}
                              </td>
                              <td className="py-2.5 px-3 text-gp-ink-300 whitespace-nowrap">
                                {monitor.specs.display.panelType} • {monitor.specs.display.resolution} • {monitor.specs.display.refreshRate}Hz
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: NOTION GALLERY CARD VIEW                                          */}
      {/* ========================================================================= */}
      {activeTab === "gallery" && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {displayMonitors.map((monitor: Monitor) => {
            const isSelected = selectedMonitorId === monitor.id;
            const photo = monitor.frontImage || monitor.thumbnail || "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop";

            return (
              <div
                key={monitor.id}
                onClick={() => onSelectMonitor(monitor)}
                className={`group cursor-pointer min-w-0 rounded-xl sm:rounded-2xl border transition-colors overflow-hidden flex flex-col bg-gp-ink-750 ${
                  isSelected
                    ? "border-gp-sky-800 ring-2 ring-gp-sky-800/50 shadow-xl"
                    : "border-gp-ink-650 hover:border-gp-ink-600 hover:bg-gp-ink-700"
                }`}
              >
                {/* Card Thumbnail */}
                <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-gp-ink-850 relative overflow-hidden">
                  <Image
                    src={photo}
                    alt={monitor.fullName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-4xs sm:text-3xs font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-sm ${
                        monitor.tier === "S-TIER"
                          ? "bg-gp-mint-900 text-gp-mint border border-gp-mint/30"
                          : monitor.tier === "BEST VALUE"
                          ? "bg-gp-sky-600 text-gp-sky border border-gp-sky/30"
                          : "bg-gp-ink-700 text-gp-ink-200"
                      }`}
                    >
                      {monitor.tier}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-2.5 sm:p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-3xs text-gp-ink-400 font-bold uppercase tracking-wider">
                      {monitor.brand}
                    </div>
                    <h4 className="font-bold text-white text-xs line-clamp-2 sm:line-clamp-1 group-hover:text-gp-sky transition-colors">
                      {monitor.fullName}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-gp-ink-700 flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {formatRupiah(monitor.price)}
                    </span>
                    <span className="text-3xs text-gp-ink-300 font-mono">
                      {monitor.specs.display.size} • {monitor.specs.display.refreshRate}Hz
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Column Manager Modal for Public Table */}
      <TableColumnManagerModal
        isOpen={isColManagerOpen}
        onClose={() => setIsColManagerOpen(false)}
        title="Pengaturan Kolom Tabel Monitor"
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
