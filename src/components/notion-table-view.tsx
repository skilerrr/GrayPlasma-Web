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
} from "lucide-react";
import { Monitor, TierRating } from "@/types/monitor";
import { formatRupiah } from "@/lib/utils";

interface NotionTableViewProps {
  monitors: Monitor[];
  selectedMonitorId?: string;
  onSelectMonitor: (monitor: Monitor) => void;
}

export type TableViewTab = "table" | "price" | "size" | "gallery";

export function NotionTableView({
  monitors,
  selectedMonitorId,
  onSelectMonitor,
}: NotionTableViewProps) {
  const [activeTab, setActiveTab] = useState<TableViewTab>("table");
  const [sortField, setSortField] = useState<"price" | "name" | "refresh" | "size">("price");
  const [sortAsc, setSortAsc] = useState(true);

  const sortedMonitors = [...monitors].sort((a, b) => {
    if (sortField === "price") {
      return sortAsc ? a.price - b.price : b.price - a.price;
    }
    if (sortField === "name") {
      return sortAsc
        ? a.fullName.localeCompare(b.fullName)
        : b.fullName.localeCompare(a.fullName);
    }
    if (sortField === "refresh") {
      return sortAsc
        ? a.specs.display.refreshRate - b.specs.display.refreshRate
        : b.specs.display.refreshRate - a.specs.display.refreshRate;
    }
    if (sortField === "size") {
      return sortAsc
        ? a.specs.display.size.localeCompare(b.specs.display.size)
        : b.specs.display.size.localeCompare(a.specs.display.size);
    }
    return 0;
  });

  const handleSort = (field: "price" | "name" | "refresh" | "size") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4 font-sans text-xs text-[#d4d4d4]">
      {/* Title & View Mode Tabs Bar (Exact Notion styling from user screenshot) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🖥️</span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            List SDR Monitor (GTID Review & Database)
          </h2>
        </div>

        {/* Top Notion View Mode Tabs */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 overflow-x-auto no-scrollbar gap-4">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "table"
                  ? "bg-zinc-800 text-white border border-zinc-600 shadow-[2px_2px_0px_#000]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
              }`}
            >
              <Table className="w-3.5 h-3.5 text-emerald-400" />
              <span>[ LIST TABEL ]</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("price");
                setSortField("price");
                setSortAsc(true);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "price"
                  ? "bg-zinc-800 text-white border border-zinc-600 shadow-[2px_2px_0px_#000]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
              }`}
            >
              <List className="w-3.5 h-3.5 text-cyan-400" />
              <span>[ LIST HARGA ]</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("size");
                setSortField("size");
                setSortAsc(true);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "size"
                  ? "bg-zinc-800 text-white border border-zinc-600 shadow-[2px_2px_0px_#000]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
              }`}
            >
              <List className="w-3.5 h-3.5 text-amber-400" />
              <span>[ LIST UKURAN ]</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "gallery"
                  ? "bg-zinc-800 text-white border border-zinc-600 shadow-[2px_2px_0px_#000]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-rose-400" />
              <span>[ GALLERY ]</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-zinc-500 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>[ {monitors.length} MODEL REKOMENDASI AKTIF ]</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: TECH-BRUTALIST NOTION DATABASE TABLE VIEW                         */}
      {/* ========================================================================= */}
      {activeTab === "table" && (
        <div className="rounded-lg border-2 border-zinc-800 bg-[#09090d] overflow-hidden shadow-[3px_3px_0px_#000]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[950px]">
              <thead className="bg-[#050508] text-zinc-300 uppercase text-[10px] font-mono tracking-wider border-b-2 border-zinc-700 sticky top-0 z-20">
                <tr>
                  <th
                    onClick={() => handleSort("price")}
                    className="py-3 px-4 font-bold cursor-pointer hover:text-emerald-400 transition-colors w-[160px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>[ 01 // KISARAN_HARGA ]</span>
                      <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("name")}
                    className="py-3 px-4 font-bold text-zinc-200 cursor-pointer hover:text-cyan-400 transition-colors min-w-[250px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-zinc-500" />
                      <span>[ 02 // BRAND & MODEL ]</span>
                      <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                    </div>
                  </th>

                  <th className="py-3 px-3 font-bold text-zinc-300 min-w-[220px]">
                    [ 03 // GTID_TOLERANSI ]
                  </th>

                  <th
                    onClick={() => handleSort("size")}
                    className="py-3 px-3 font-bold cursor-pointer hover:text-amber-400 transition-colors min-w-[140px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>[ 04 // PANEL_SIZE ]</span>
                      <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                    </div>
                  </th>

                  <th className="py-3 px-3 font-bold min-w-[150px]">
                    [ 05 // RESOLUSI ]
                  </th>

                  <th
                    onClick={() => handleSort("refresh")}
                    className="py-3 px-3 font-bold cursor-pointer hover:text-emerald-400 transition-colors min-w-[110px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>[ 06 // REFRESH ]</span>
                      <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/80">
                {sortedMonitors.map((monitor) => {
                  const isSelected = selectedMonitorId === monitor.id;

                  return (
                    <tr
                      key={monitor.id}
                      onClick={() => onSelectMonitor(monitor)}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#151a24] ring-1 ring-cyan-500/80 ring-inset"
                          : "hover:bg-[#121217]"
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {formatRupiah(monitor.price)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🖥️</span>
                          <span
                            className={`font-bold transition-colors ${
                              isSelected ? "text-cyan-400" : "text-white hover:text-emerald-400"
                            }`}
                          >
                            {monitor.fullName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-[#0b2413] text-[#00e676] border border-[#00e676]/30 text-[10px] font-mono font-bold whitespace-nowrap shadow-[1px_1px_0px_#000]">
                            {monitor.responseTimeData?.toleranceNew || "Toleransi Baru"}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#2b1012] text-[#ff5252] border border-[#ff5252]/30 text-[10px] font-mono font-bold whitespace-nowrap shadow-[1px_1px_0px_#000]">
                            {monitor.responseTimeData?.toleranceOld || "Toleransi Lama"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-zinc-300 font-medium whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700/80 font-mono text-[11px]">
                          {monitor.specs.display.size} {monitor.specs.display.panelType}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-zinc-300 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700/80 text-[11px]">
                          {monitor.specs.display.resolution}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-[#10192b] text-[#38bdf8] border border-[#38bdf8]/30 font-mono font-bold text-[11px] shadow-[1px_1px_0px_#000]">
                          {monitor.specs.display.refreshRate}Hz
                        </span>
                      </td>
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
              title: "💵 Budget Entry Level (< Rp 1.500.000)",
              filter: (m: Monitor) => m.price < 1500000,
              color: "border-emerald-500/40 text-emerald-400",
            },
            {
              title: "💵 Mid-Range Value (Rp 1.500.000 - Rp 3.000.000)",
              filter: (m: Monitor) => m.price >= 1500000 && m.price <= 3000000,
              color: "border-cyan-500/40 text-cyan-400",
            },
            {
              title: "💵 Sweetspot 1440p / 2K (Rp 3.000.000 - Rp 5.000.000)",
              filter: (m: Monitor) => m.price > 3000000 && m.price <= 5000000,
              color: "border-amber-500/40 text-amber-400",
            },
            {
              title: "💵 Enthusiast, 4K & OLED (> Rp 5.000.000)",
              filter: (m: Monitor) => m.price > 5000000,
              color: "border-rose-500/40 text-rose-400",
            },
          ].map((group, idx) => {
            const groupMonitors = sortedMonitors.filter(group.filter);
            if (groupMonitors.length === 0) return null;

            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${group.color}`}>
                    <span>{group.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#252525] text-[10px] text-[#9b9a97] font-mono border border-[#333]">
                      {groupMonitors.length} model
                    </span>
                  </h3>
                </div>

                <div className="rounded-2xl border border-[#2a2a2a] bg-[#191919] overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                      <tbody className="divide-y divide-[#262626]">
                        {groupMonitors.map((monitor) => {
                          const isSelected = selectedMonitorId === monitor.id;
                          return (
                            <tr
                              key={monitor.id}
                              onClick={() => onSelectMonitor(monitor)}
                              className={`cursor-pointer transition-all ${
                                isSelected ? "bg-[#202020] ring-1 ring-[#2383e2] ring-inset" : "hover:bg-[#202020]"
                              }`}
                            >
                              <td className="py-2.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap w-[150px]">
                                {formatRupiah(monitor.price)}
                              </td>
                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2">
                                  <span>🖥️</span>
                                  <span className="font-semibold text-white hover:text-[#58a6ff]">
                                    {monitor.fullName}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-[#9b9a97] whitespace-nowrap">
                                {monitor.specs.display.size} • {monitor.specs.display.panelType} • {monitor.specs.display.refreshRate}Hz
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  monitor.tier === "S-TIER"
                                    ? "bg-[#203c2b] text-[#52ba69]"
                                    : monitor.tier === "BEST VALUE"
                                    ? "bg-[#1d354a] text-[#58a6ff]"
                                    : "bg-[#282828] text-[#9b9a97]"
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
              title: '📐 24 Inch (FHD Budget & Compact Esports)',
              filter: (m: Monitor) => m.specs.display.size.includes("24") || m.specs.display.size.includes("23.8"),
              color: "text-cyan-400",
            },
            {
              title: '📐 27 Inch (Mainstream 1080p & 1440p 2K)',
              filter: (m: Monitor) => m.specs.display.size.includes("27") || m.specs.display.size.includes("26.5"),
              color: "text-emerald-400",
            },
            {
              title: '📐 32 Inch (Large Immersive & 4K Creation)',
              filter: (m: Monitor) => m.specs.display.size.includes("32") || m.specs.display.size.includes("31.5"),
              color: "text-amber-400",
            },
            {
              title: '📐 Ultrawide & Curved (21:9 Productivity)',
              filter: (m: Monitor) => m.specs.display.size.toLowerCase().includes("ultrawide") || m.specs.display.size.includes("34"),
              color: "text-rose-400",
            },
          ].map((group, idx) => {
            const groupMonitors = sortedMonitors.filter(group.filter);
            if (groupMonitors.length === 0) return null;

            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${group.color}`}>
                    <span>{group.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#252525] text-[10px] text-[#9b9a97] font-mono border border-[#333]">
                      {groupMonitors.length} model
                    </span>
                  </h3>
                </div>

                <div className="rounded-2xl border border-[#2a2a2a] bg-[#191919] overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                      <tbody className="divide-y divide-[#262626]">
                        {groupMonitors.map((monitor) => {
                          const isSelected = selectedMonitorId === monitor.id;
                          return (
                            <tr
                              key={monitor.id}
                              onClick={() => onSelectMonitor(monitor)}
                              className={`cursor-pointer transition-all ${
                                isSelected ? "bg-[#202020] ring-1 ring-[#2383e2] ring-inset" : "hover:bg-[#202020]"
                              }`}
                            >
                              <td className="py-2.5 px-4 font-mono font-bold text-white whitespace-nowrap w-[100px]">
                                {monitor.specs.display.size}
                              </td>
                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2">
                                  <span>🖥️</span>
                                  <span className="font-semibold text-white hover:text-[#58a6ff]">
                                    {monitor.fullName}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-emerald-400 whitespace-nowrap">
                                {formatRupiah(monitor.price)}
                              </td>
                              <td className="py-2.5 px-3 text-[#9b9a97] whitespace-nowrap">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMonitors.map((monitor) => {
            const isSelected = selectedMonitorId === monitor.id;
            const photo = monitor.frontImage || monitor.thumbnail || "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop";

            return (
              <div
                key={monitor.id}
                onClick={() => onSelectMonitor(monitor)}
                className={`group cursor-pointer rounded-2xl border transition-all overflow-hidden flex flex-col bg-[#202020] ${
                  isSelected
                    ? "border-[#2383e2] ring-2 ring-[#2383e2]/50 shadow-xl"
                    : "border-[#2f2f2f] hover:border-[#3f3f3f] hover:bg-[#252525]"
                }`}
              >
                {/* Card Thumbnail */}
                <div className="w-full aspect-[16/10] bg-[#151515] relative overflow-hidden">
                  <Image
                    src={photo}
                    alt={monitor.fullName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
                        monitor.tier === "S-TIER"
                          ? "bg-[#203c2b] text-[#52ba69] border border-[#52ba69]/30"
                          : monitor.tier === "BEST VALUE"
                          ? "bg-[#1d354a] text-[#58a6ff] border border-[#58a6ff]/30"
                          : "bg-[#282828] text-[#d4d4d4]"
                      }`}
                    >
                      {monitor.tier}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-[10px] text-[#787774] font-bold uppercase tracking-wider">
                      {monitor.brand}
                    </div>
                    <h4 className="font-bold text-white text-xs line-clamp-1 group-hover:text-[#58a6ff] transition-colors">
                      {monitor.fullName}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-[#2a2a2a] flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {formatRupiah(monitor.price)}
                    </span>
                    <span className="text-[10px] text-[#9b9a97] font-mono">
                      {monitor.specs.display.size} • {monitor.specs.display.refreshRate}Hz
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
