"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Info,
  Tv,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  ArrowUpDown,
  ShoppingBag,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { Monitor, TierRating } from "@/types/monitor";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NotionTableViewProps {
  monitors: Monitor[];
  onSelectMonitor: (monitor: Monitor) => void;
}

export type TableCategoryTab =
  | "all"
  | "gtid-reviewed"
  | "non-reviewed"
  | "not-worth-it"
  | "oled";

export function NotionTableView({
  monitors,
  onSelectMonitor,
}: NotionTableViewProps) {
  const [activeTab, setActiveTab] = useState<TableCategoryTab>("all");
  const [sortField, setSortField] = useState<"price" | "refresh" | "name" | "tier">("tier");
  const [sortAsc, setSortAsc] = useState(true);

  const filteredByTab = monitors.filter((m) => {
    if (activeTab === "all") return true;
    const desc = m.tierDescription || "";
    const panel = m.specs?.display?.panelType || "";
    if (activeTab === "gtid-reviewed") {
      return !desc.includes("TIDAK WORTH IT") && !panel.includes("OLED");
    }
    if (activeTab === "non-reviewed") {
      return desc.includes("Non-Review");
    }
    if (activeTab === "not-worth-it") {
      return m.tier === "PASS" || desc.includes("TIDAK WORTH IT");
    }
    if (activeTab === "oled") {
      return panel.toLowerCase().includes("oled");
    }
    return true;
  });

  const sortedMonitors = [...filteredByTab].sort((a, b) => {
    if (sortField === "price") {
      return sortAsc ? a.price - b.price : b.price - a.price;
    }
    if (sortField === "refresh") {
      return sortAsc
        ? a.specs.display.refreshRate - b.specs.display.refreshRate
        : b.specs.display.refreshRate - a.specs.display.refreshRate;
    }
    if (sortField === "name") {
      return sortAsc
        ? a.fullName.localeCompare(b.fullName)
        : b.fullName.localeCompare(a.fullName);
    }
    if (sortField === "tier") {
      const weights: Record<TierRating, number> = {
        "S-TIER": 4,
        "BEST VALUE": 3,
        "RECOMMENDED": 2,
        "PASS": 1,
      };
      return sortAsc
        ? (weights[b.tier] || 0) - (weights[a.tier] || 0)
        : (weights[a.tier] || 0) - (weights[b.tier] || 0);
    }
    return 0;
  });

  const handleSort = (field: "price" | "refresh" | "name" | "tier") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Database Tabs (Exact Notion Collection Views) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === "all"
                ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <span>📋 Semua Monitor ({monitors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("gtid-reviewed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === "gtid-reviewed"
                ? "bg-zinc-800 text-emerald-400 border border-emerald-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <span>🟢 SDR GTID Reviewed</span>
          </button>
          <button
            onClick={() => setActiveTab("oled")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === "oled"
                ? "bg-zinc-800 text-cyan-400 border border-cyan-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <span>⚡ List OLED Monitors</span>
          </button>
          <button
            onClick={() => setActiveTab("not-worth-it")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === "not-worth-it"
                ? "bg-zinc-800 text-rose-400 border border-rose-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <span>⚠️ Tidak Worth It</span>
          </button>
        </div>

        <div className="text-[11px] text-zinc-500 hidden sm:block">
          Klik baris monitor untuk melihat ulasan & spek lengkap
        </div>
      </div>

      {/* Notion Wide Scrollable Table Container */}
      <div className="relative rounded-2xl border border-zinc-800 bg-[#09090b] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[1300px]">
            {/* Table Header */}
            <thead className="bg-[#121215] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800 sticky top-0 z-20">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="py-3 px-4 font-bold text-zinc-300 sticky left-0 z-30 bg-[#121215] border-r border-zinc-800/80 cursor-pointer hover:text-white transition-colors min-w-[260px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>BRAND & MODEL TYPE</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("tier")}
                  className="py-3 px-3 font-bold cursor-pointer hover:text-white transition-colors min-w-[120px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>TIER / VALUE</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("price")}
                  className="py-3 px-4 font-bold cursor-pointer hover:text-white transition-colors min-w-[150px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>KISARAN HARGA</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="py-3 px-3 font-bold min-w-[130px]">RESOLUSI</th>
                <th className="py-3 px-3 font-bold min-w-[90px]">UKURAN</th>
                <th className="py-3 px-3 font-bold min-w-[100px]">PANEL</th>
                <th
                  onClick={() => handleSort("refresh")}
                  className="py-3 px-3 font-bold cursor-pointer hover:text-white transition-colors min-w-[100px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>REFRESH</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="py-3 px-3 font-bold text-cyan-400 min-w-[150px]">
                  RESPONSE TIME (GTID)
                </th>
                <th className="py-3 px-3 font-bold min-w-[180px]">DISPLAY INPUT</th>
                <th className="py-3 px-3 font-bold min-w-[140px]">STAND CAPABILITY</th>
                <th className="py-3 px-3 font-bold min-w-[120px]">VESA MOUNT</th>
                <th className="py-3 px-4 font-bold text-center min-w-[140px]">BELI / SHOPEE</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-zinc-900/80">
              {sortedMonitors.map((m, idx) => {
                const shopeeLink = m.marketplaces.find((mk) => mk.marketplace === "Shopee")?.url || "https://shopee.co.id";
                const isPass = m.tier === "PASS";
                const isSTier = m.tier === "S-TIER";
                const isBestValue = m.tier === "BEST VALUE";

                return (
                  <tr
                    key={m.id}
                    onClick={() => onSelectMonitor(m)}
                    className={`group hover:bg-zinc-900/60 transition-colors cursor-pointer ${
                      idx % 2 === 0 ? "bg-black/40" : "bg-[#09090b]"
                    } ${isPass ? "opacity-75 bg-rose-950/5 hover:opacity-100" : ""}`}
                  >
                    {/* Sticky Brand & Model Type */}
                    <td className="py-3.5 px-4 sticky left-0 z-10 bg-[#09090b] group-hover:bg-zinc-900 border-r border-zinc-800/80">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 flex-shrink-0 group-hover:border-emerald-500/50 transition-colors">
                          <Tv className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-white group-hover:text-emerald-400 transition-colors block truncate max-w-[200px]">
                            {m.fullName}
                          </span>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">
                            {m.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tier / Rating */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded border inline-block ${
                          isSTier
                            ? "bg-emerald-500 text-black border-emerald-400"
                            : isBestValue
                            ? "bg-amber-500 text-black border-amber-400"
                            : isPass
                            ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                            : "bg-zinc-800 text-zinc-300 border-zinc-700"
                        }`}
                      >
                        {m.tier}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-white text-xs">
                        {formatRupiah(m.price)}
                      </span>
                    </td>

                    {/* Resolution */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-zinc-300">
                      {m.specs.display.resolution}
                    </td>

                    {/* Panel Size */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-zinc-300">
                      {m.specs.display.size}
                    </td>

                    {/* Panel Type */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          m.specs.display.panelType.includes("OLED")
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                            : "bg-zinc-900 text-zinc-300 border border-zinc-800"
                        }`}
                      >
                        {m.specs.display.panelType}
                      </span>
                    </td>

                    {/* Refresh Rate */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono font-semibold text-zinc-200">
                      {m.specs.display.refreshRate} Hz
                    </td>

                    {/* Response Time */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-cyan-400 font-mono text-[11px]">
                      {m.specs.display.responseTime}
                    </td>

                    {/* Display Input */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-zinc-400 text-[11px] max-w-[200px] truncate">
                      {m.specs.connectivity.displayPort}, {m.specs.connectivity.hdmi}
                    </td>

                    {/* Stand Capability */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-zinc-400 text-[11px]">
                      {m.specs.ergonomics.heightAdjustable ? "Height + Tilt" : "Tilt Only"}
                    </td>

                    {/* VESA Mount */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-zinc-400 text-[11px]">
                      {m.specs.ergonomics.vesaMount}
                    </td>

                    {/* Buy CTA / Link Shopee */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <a
                          href={shopeeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 hover:text-black text-amber-400 text-[11px] font-bold transition-all"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Shopee</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>

                        <button
                          onClick={() => onSelectMonitor(m)}
                          className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                          title="Lihat Detail Ulasan"
                        >
                          <Eye className="w-3.5 h-3.5" />
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
  );
}
