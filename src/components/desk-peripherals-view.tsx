"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutGrid,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  Wrench,
  Sparkles,
  Layers,
  ArrowRight,
  Maximize2,
  Tv,
  Search,
  SlidersHorizontal,
  RotateCcw,
  MonitorCheck,
  Disc,
} from "lucide-react";
import {
  DESK_DATABASE,
  PERIPHERALS_DATABASE,
  DEFAULT_CHAIRS_DATABASE,
  GIMMICK_MEJA_GAMING_CONTENT,
  CONSULTATION_RESULTS_DATABASE,
  DeskItem,
  PeripheralItem,
  ChairItem,
} from "@/data/grayplasma-desk-peripherals";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDraggableTable, TableColumnDef } from "@/hooks/use-draggable-table";
import { TableColumnManagerModal } from "@/components/ui/table-column-manager-modal";

interface DeskPeripheralsViewProps {
  desks?: DeskItem[];
  peripherals?: PeripheralItem[];
  chairs?: ChairItem[];
  showChairs?: boolean;
  initialTab?: SubTab;
  hideHeaderCard?: boolean;
}

type SubTab =
  | "meja"
  | "arms"
  | "brackets"
  | "accessories"
  | "kursi"
  | "gimmick"
  | "consultation-packages";

// Default columns for Desk Table
const initialDeskColumns: TableColumnDef<DeskItem>[] = [
  {
    id: "name",
    label: "Nama Produk / Meja",
    isDefaultVisible: true,
    minWidth: "240px",
    category: "Info Dasar",
    renderCell: (d) => (
      <div>
        <span className="font-bold text-white block text-sm">{d.name}</span>
        <span className="text-2xs text-gp-ink-300 mt-0.5 block">{d.description}</span>
      </div>
    ),
  },
  {
    id: "category",
    label: "Kategori",
    isDefaultVisible: true,
    minWidth: "140px",
    category: "Klasifikasi",
    renderCell: (d) => (
      <span className="px-2 py-0.5 rounded bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-200 text-2xs">
        {d.category}
      </span>
    ),
  },
  {
    id: "price",
    label: "Kisaran Harga",
    isDefaultVisible: true,
    minWidth: "130px",
    category: "Harga",
    renderCell: (d) => (
      <span className="font-mono font-bold text-hue-emerald-400 text-xs">
        {formatRupiah(d.price)}
      </span>
    ),
  },
  {
    id: "material",
    label: "Material & Tebal",
    isDefaultVisible: true,
    minWidth: "180px",
    category: "Spesifikasi",
    renderCell: (d) => (
      <div className="text-gp-ink-200">
        <div>{d.specs?.material}</div>
        <span className="text-3xs text-hue-emerald-400 font-semibold">
          Tebal: {d.specs?.thickness}
        </span>
      </div>
    ),
  },
  {
    id: "dimensions",
    label: "Ukuran Dimensi",
    isDefaultVisible: true,
    minWidth: "140px",
    category: "Spesifikasi",
    renderCell: (d) => (
      <span className="text-gp-ink-200 font-mono text-2xs">
        {d.specs?.dimensions}
      </span>
    ),
  },
  {
    id: "arm_support",
    label: "Arm Support",
    isDefaultVisible: true,
    minWidth: "110px",
    category: "Fitur",
    renderCell: () => (
      <span className="inline-flex items-center gap-1 text-3xs font-bold px-2 py-0.5 rounded bg-hue-emerald-500/10 text-hue-emerald-400 border border-hue-emerald-500/30">
        <CheckCircle2 className="w-3 h-3" />
        <span>Aman Jepit</span>
      </span>
    ),
  },
  {
    id: "shopee",
    label: "Link Shopee",
    isDefaultVisible: true,
    minWidth: "130px",
    category: "Marketplace",
    renderCell: (d) => (
      <a
        href={d.shopeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-hue-amber-500/10 border border-hue-amber-500/30 hover:bg-hue-amber-500 hover:text-black text-hue-amber-400 text-xs font-bold transition-colors"
      >
        <ShoppingBag className="w-3 h-3" />
        <span>Shopee</span>
        <ExternalLink className="w-2.5 h-2.5" />
      </a>
    ),
  },
];

// Default columns for Arm / Bracket / Peripheral Table
const initialPeripheralColumns: TableColumnDef<PeripheralItem>[] = [
  {
    id: "name",
    label: "Brand & Model Name",
    isDefaultVisible: true,
    minWidth: "220px",
    category: "Info Dasar",
    renderCell: (p) => (
      <div>
        <span className="font-bold text-white text-sm block">{p.name}</span>
        <span className="text-2xs text-gp-ink-300 mt-0.5 block">{p.verdict}</span>
      </div>
    ),
  },
  {
    id: "price",
    label: "Kisaran Harga*",
    isDefaultVisible: true,
    minWidth: "120px",
    category: "Harga",
    renderCell: (p) => (
      <span className="font-mono font-bold text-hue-emerald-400 text-xs">
        {formatRupiah(p.price)}
      </span>
    ),
  },
  {
    id: "category",
    label: "Kategori / Tipe",
    isDefaultVisible: true,
    minWidth: "140px",
    category: "Klasifikasi",
    renderCell: (p) => (
      <span className="px-2 py-0.5 rounded bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-200 text-2xs">
        {p.type || p.category}
      </span>
    ),
  },
  {
    id: "versionDetail",
    label: "Detail / Spek Beban",
    isDefaultVisible: true,
    minWidth: "160px",
    category: "Spesifikasi",
    renderCell: (p) => (
      <span className="px-2 py-0.5 rounded bg-hue-cyan-950/40 border border-hue-cyan-500/30 text-hue-cyan-300 font-mono text-2xs">
        {p.versionDetail || p.recommendedFor || "-"}
      </span>
    ),
  },
  {
    id: "warranty",
    label: "Garansi",
    isDefaultVisible: true,
    minWidth: "90px",
    category: "Garansi",
    renderCell: (p) => (
      <span className="text-center text-gp-ink-300 text-xs font-mono">
        {p.warranty || "2 Tahun"}
      </span>
    ),
  },
  {
    id: "shopee",
    label: "Shopee",
    isDefaultVisible: true,
    minWidth: "120px",
    category: "Marketplace",
    renderCell: (p) =>
      p.shopeeUrl ? (
        <a
          href={p.shopeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-hue-orange-500/10 border border-hue-orange-500/30 hover:bg-hue-orange-500 hover:text-black text-hue-orange-400 text-xs font-bold transition-colors"
        >
          <ShoppingBag className="w-3 h-3" />
          <span>Shopee</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      ) : (
        <span className="text-gp-ink-500">-</span>
      ),
  },
  {
    id: "tokopedia",
    label: "Tokopedia",
    isDefaultVisible: true,
    minWidth: "120px",
    category: "Marketplace",
    renderCell: (p) =>
      p.tokopediaUrl ? (
        <a
          href={p.tokopediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-hue-emerald-500/10 border border-hue-emerald-500/30 hover:bg-hue-emerald-500 hover:text-black text-hue-emerald-400 text-xs font-bold transition-colors"
        >
          <span>Tokopedia</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      ) : (
        <span className="text-gp-ink-500">-</span>
      ),
  },
  {
    id: "tiktok",
    label: "TikTok Shop",
    isDefaultVisible: true,
    minWidth: "120px",
    category: "Marketplace",
    renderCell: (p) =>
      p.tiktokUrl ? (
        <a
          href={p.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-hue-cyan-500/10 border border-hue-cyan-500/30 hover:bg-hue-cyan-500 hover:text-black text-hue-cyan-400 text-xs font-bold transition-colors"
        >
          <span>TikTok</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      ) : (
        <span className="text-gp-ink-500">-</span>
      ),
  },
];

export function DeskPeripheralsView({
  desks = DESK_DATABASE,
  peripherals = PERIPHERALS_DATABASE,
  chairs = DEFAULT_CHAIRS_DATABASE,
  showChairs = false,
  initialTab,
  hideHeaderCard = false,
}: DeskPeripheralsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>(initialTab || "meja");
  const [chairCategoryFilter, setChairCategoryFilter] = useState<string>("all");
  const [armBracketSubFilter, setArmBracketSubFilter] = useState<"all" | "arm" | "bracket">("all");
  const [deskCategoryFilter, setDeskCategoryFilter] = useState<string>("all");
  const [accessoryCategoryFilter, setAccessoryCategoryFilter] = useState<string>("all");

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  // Search queries
  const [deskSearch, setDeskSearch] = useState("");
  const [peripheralSearch, setPeripheralSearch] = useState("");

  // Column management modals
  const [isDeskColModalOpen, setIsDeskColModalOpen] = useState(false);
  const [isPeriColModalOpen, setIsPeriColModalOpen] = useState(false);

  // Filter published only
  const publishedDesks = useMemo(
    () => desks.filter((d) => d.isPublished !== false),
    [desks]
  );
  const publishedPeripherals = useMemo(
    () => peripherals.filter((p) => p.isPublished !== false),
    [peripherals]
  );
  const publishedChairs = useMemo(
    () => chairs.filter((c) => c.isPublished !== false),
    [chairs]
  );

  // Categorization helpers
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
        name.includes("bracket") ||
        name.includes("vesa") ||
        name.includes("mount") ||
        name.includes("dinding")) &&
      !isArm(p)
    );
  };

  const isAccessory = (p: PeripheralItem) => {
    return !isArm(p) && !isBracket(p);
  };

  const armsList = useMemo(
    () => publishedPeripherals.filter(isArm),
    [publishedPeripherals]
  );
  const bracketsList = useMemo(
    () => publishedPeripherals.filter(isBracket),
    [publishedPeripherals]
  );
  const armsAndBracketsList = useMemo(
    () => publishedPeripherals.filter((p) => isArm(p) || isBracket(p)),
    [publishedPeripherals]
  );
  const accessoriesList = useMemo(
    () => publishedPeripherals.filter(isAccessory),
    [publishedPeripherals]
  );

  // Draggable columns hook
  const deskTable = useDraggableTable<DeskItem>({
    storageKey: "gp_public_desk_table_cols",
    columns: initialDeskColumns,
  });

  const periTable = useDraggableTable<PeripheralItem>({
    storageKey: "gp_public_peripheral_table_cols",
    columns: initialPeripheralColumns,
  });

  // Filtered lists by search and category
  const filteredDesks = useMemo(() => {
    let list = publishedDesks;
    if (deskCategoryFilter !== "all") {
      list = list.filter((d) => d.category.toLowerCase().includes(deskCategoryFilter.toLowerCase()));
    }
    if (!deskSearch.trim()) return list;
    const q = deskSearch.toLowerCase();
    return list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.specs.material.toLowerCase().includes(q) ||
        (d.description || "").toLowerCase().includes(q)
    );
  }, [publishedDesks, deskCategoryFilter, deskSearch]);

  const activePeripheralList = useMemo(() => {
    if (activeSubTab === "arms") {
      if (armBracketSubFilter === "arm") return armsList;
      if (armBracketSubFilter === "bracket") return bracketsList;
      return armsAndBracketsList;
    }
    if (activeSubTab === "brackets") return bracketsList;
    if (activeSubTab === "accessories") {
      if (accessoryCategoryFilter === "all") return accessoriesList;
      return accessoriesList.filter(
        (a) =>
          a.category.toLowerCase().includes(accessoryCategoryFilter.toLowerCase()) ||
          (a.type || "").toLowerCase().includes(accessoryCategoryFilter.toLowerCase())
      );
    }
    return publishedPeripherals;
  }, [
    activeSubTab,
    armBracketSubFilter,
    armsList,
    bracketsList,
    armsAndBracketsList,
    accessoryCategoryFilter,
    accessoriesList,
    publishedPeripherals,
  ]);

  const filteredPeripherals = useMemo(() => {
    if (!peripheralSearch.trim()) return activePeripheralList;
    const q = peripheralSearch.toLowerCase();
    return activePeripheralList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.type || "").toLowerCase().includes(q) ||
        (p.verdict || "").toLowerCase().includes(q) ||
        (p.versionDetail || "").toLowerCase().includes(q)
    );
  }, [activePeripheralList, peripheralSearch]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Info: Conditionally rendered only when hideHeaderCard is false */}
      {!hideHeaderCard && (
        <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hue-cyan-500/10 border border-hue-cyan-500/30 text-hue-cyan-400 text-xs font-bold mb-2">
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Panduan Meja & Peripherals Setup</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Rekomendasi Meja, Bracket, & Peripherals Setup
              </h2>
              <p className="text-xs sm:text-sm text-gp-ink-300 mt-1 max-w-2xl">
                Kurasi meja kokoh tahan jepit monitor arm, gas spring bracket teruji, dan aksesoris setup dari riset forum GrayPlasma.
              </p>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-gp-ink-700 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveSubTab("meja")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex-shrink-0 flex items-center gap-2 ${
                activeSubTab === "meja"
                  ? "bg-gp-ink-700 text-hue-cyan-400 border border-hue-cyan-500/40 shadow-sm"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Daftar Meja ({publishedDesks.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("arms")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex-shrink-0 flex items-center gap-2 ${
                activeSubTab === "arms"
                  ? "bg-gp-ink-700 text-hue-cyan-400 border border-hue-cyan-500/40 shadow-sm"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800"
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Monitor Arm ({armsList.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("brackets")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex-shrink-0 flex items-center gap-2 ${
                activeSubTab === "brackets"
                  ? "bg-gp-ink-700 text-hue-amber-400 border border-hue-amber-500/40 shadow-sm"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800"
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Bracket & Mount ({bracketsList.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("accessories")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex-shrink-0 flex items-center gap-2 ${
                activeSubTab === "accessories"
                  ? "bg-gp-ink-700 text-hue-emerald-400 border border-hue-emerald-500/40 shadow-sm"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Aksesoris & Kabel ({accessoriesList.length})</span>
            </button>

            {showChairs && (
              <button
                onClick={() => setActiveSubTab("kursi")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex-shrink-0 flex items-center gap-2 ${
                  activeSubTab === "kursi"
                    ? "bg-gp-ink-700 text-hue-purple-400 border border-hue-purple-500/40 shadow-sm"
                    : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800"
                }`}
              >
                <span>🪑</span>
                <span>Kursi Ergonomis [Draft] ({publishedChairs.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveSubTab("gimmick")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex-shrink-0 flex items-center gap-2 ${
                activeSubTab === "gimmick"
                  ? "bg-gp-ink-700 text-hue-amber-400 border border-hue-amber-500/40 shadow-sm"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Gimmick Meja Gaming</span>
            </button>

            <button
              onClick={() => setActiveSubTab("consultation-packages")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex-shrink-0 flex items-center gap-2 ${
                activeSubTab === "consultation-packages"
                  ? "bg-gp-ink-700 text-hue-rose-400 border border-hue-rose-500/40 shadow-sm"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Hasil Racikan Setup ({CONSULTATION_RESULTS_DATABASE.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. VIEW: DAFTAR MEJA REKOMENDASI */}
      {activeSubTab === "meja" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gp-ink-950/60 p-3.5 rounded-2xl border border-gp-ink-700/80">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gp-ink-400" />
                <input
                  type="text"
                  placeholder="Cari meja pilihan, bahan, atau ukuran..."
                  value={deskSearch}
                  onChange={(e) => setDeskSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-gp-ink-800 border border-gp-ink-700 text-white placeholder-gp-ink-400 focus:outline-none focus:border-hue-cyan-500 font-mono transition-colors"
                />
                {deskSearch && (
                  <button
                    onClick={() => setDeskSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gp-ink-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Category Pills for Meja */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { id: "all", label: `Semua Meja (${publishedDesks.length})` },
                  { id: "daun meja", label: "Daun Meja Saja" },
                  { id: "standing", label: "Standing Desk Motor" },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setDeskCategoryFilter(pill.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                      deskCategoryFilter === pill.id
                        ? "bg-hue-orange-500/20 text-hue-orange-300 border border-hue-orange-500/40 font-bold"
                        : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-750"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setIsDeskColModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gp-ink-800 hover:bg-gp-ink-750 border border-gp-ink-700 text-xs font-bold text-gp-ink-200 hover:text-white transition-colors"
                title="Atur kolom & urutan tabel meja"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-hue-orange-400" />
                <span>Atur Kolom ({deskTable.visibleColumns.length})</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl border border-gp-ink-700 bg-gp-ink-950 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[950px]">
                <thead className="bg-gp-ink-850 text-gp-ink-300 uppercase text-3xs tracking-wider border-b border-gp-ink-700 sticky top-0 z-20">
                  <tr>
                    {deskTable.visibleColumns.map((col) => (
                      <th
                        key={col.id}
                        className={`py-3 px-3 font-bold ${
                          col.id === "name"
                            ? "text-gp-ink-200 min-w-[240px] px-4"
                            : col.id === "price"
                            ? "text-hue-emerald-400 min-w-[130px]"
                            : col.id === "arm_support" || col.id === "shopee"
                            ? "text-center min-w-[120px]"
                            : "min-w-[140px]"
                        }`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gp-ink-800/80">
                  {filteredDesks.map((d, idx) => (
                    <tr
                      key={d.id}
                      className={`hover:bg-gp-ink-800/60 transition-colors ${
                        idx % 2 === 0 ? "bg-black/40" : "bg-gp-ink-950"
                      }`}
                    >
                      {deskTable.visibleColumns.map((col) => (
                        <td
                          key={col.id}
                          className={`py-3.5 px-3 ${
                            col.id === "name"
                              ? "px-4"
                              : col.id === "arm_support" || col.id === "shopee"
                              ? "text-center"
                              : ""
                          }`}
                        >
                          {col.renderCell(d, idx)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {filteredDesks.length === 0 && (
                    <tr>
                      <td
                        colSpan={deskTable.visibleColumns.length}
                        className="py-12 text-center text-gp-ink-400"
                      >
                        Tidak ada meja yang cocok dengan pencarian &quot;{deskSearch}&quot;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. VIEW: SEPARATED MONITOR ARM, BRACKET, OR ACCESSORIES */}
      {(activeSubTab === "arms" || activeSubTab === "brackets" || activeSubTab === "accessories") && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gp-ink-950/60 p-3.5 rounded-2xl border border-gp-ink-700/80">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gp-ink-400" />
                <input
                  type="text"
                  placeholder={
                    activeSubTab === "arms"
                      ? "Cari monitor arm gas spring / mount..."
                      : activeSubTab === "brackets"
                      ? "Cari bracket dinding / VESA mount..."
                      : "Cari kabel DP, HDMI, screenbar..."
                  }
                  value={peripheralSearch}
                  onChange={(e) => setPeripheralSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-gp-ink-800 border border-gp-ink-700 text-white placeholder-gp-ink-400 focus:outline-none focus:border-hue-cyan-500 font-mono transition-colors"
                />
                {peripheralSearch && (
                  <button
                    onClick={() => setPeripheralSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gp-ink-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Sub-Pills for Arm & Bracket category */}
              {activeSubTab === "arms" && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {[
                    { id: "all", label: `Semua Arm & Mount (${armsAndBracketsList.length})` },
                    { id: "arm", label: `Monitor Arm (${armsList.length})` },
                    { id: "bracket", label: `Bracket & Mount (${bracketsList.length})` },
                  ].map((pill) => (
                    <button
                      key={pill.id}
                      onClick={() => setArmBracketSubFilter(pill.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                        armBracketSubFilter === pill.id
                          ? "bg-hue-cyan-500/20 text-hue-cyan-300 border border-hue-cyan-500/40 font-bold"
                          : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-750"
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-Pills for Accessories category */}
              {activeSubTab === "accessories" && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {[
                    { id: "all", label: `Semua Aksesoris (${accessoriesList.length})` },
                    { id: "kabel", label: "Kabel DP & HDMI" },
                    { id: "bracket", label: "Mount & Protektor" },
                  ].map((pill) => (
                    <button
                      key={pill.id}
                      onClick={() => setAccessoryCategoryFilter(pill.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                        accessoryCategoryFilter === pill.id
                          ? "bg-hue-blue-500/20 text-hue-blue-300 border border-hue-blue-500/40 font-bold"
                          : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-750"
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setIsPeriColModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gp-ink-800 hover:bg-gp-ink-750 border border-gp-ink-700 text-xs font-bold text-gp-ink-200 hover:text-white transition-colors"
                title="Atur kolom & urutan tabel"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-hue-cyan-400" />
                <span>Atur Kolom ({periTable.visibleColumns.length})</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl border border-gp-ink-700 bg-gp-ink-950 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
                <thead className="bg-gp-ink-850 text-gp-ink-300 uppercase text-3xs tracking-wider border-b border-gp-ink-700 sticky top-0 z-20">
                  <tr>
                    {periTable.visibleColumns.map((col) => (
                      <th
                        key={col.id}
                        className={`py-3 px-3 font-bold ${
                          col.id === "name"
                            ? "text-gp-ink-200 min-w-[220px] px-4"
                            : col.id === "price"
                            ? "text-hue-emerald-400 min-w-[120px]"
                            : col.id === "warranty" || col.id === "shopee" || col.id === "tokopedia"
                            ? "text-center min-w-[110px]"
                            : "min-w-[140px]"
                        }`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gp-ink-800/80">
                  {filteredPeripherals.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-gp-ink-800/60 transition-colors ${
                        idx % 2 === 0 ? "bg-black/40" : "bg-gp-ink-950"
                      }`}
                    >
                      {periTable.visibleColumns.map((col) => (
                        <td
                          key={col.id}
                          className={`py-3.5 px-3 ${
                            col.id === "name"
                              ? "px-4"
                              : col.id === "warranty" || col.id === "shopee" || col.id === "tokopedia"
                              ? "text-center"
                              : ""
                          }`}
                        >
                          {col.renderCell(p, idx)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {filteredPeripherals.length === 0 && (
                    <tr>
                      <td
                        colSpan={periTable.visibleColumns.length}
                        className="py-12 text-center text-gp-ink-400"
                      >
                        Tidak ada produk yang cocok dengan pencarian &quot;{peripheralSearch}&quot;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. VIEW: REKOMENDASI KURSI ERGONOMIS & GAMING */}
      {showChairs && activeSubTab === "kursi" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gp-ink-950 border border-gp-ink-700 rounded-2xl p-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>🪑</span>
                <span>Katalog Kurasi Kursi Ergonomis & Gaming</span>
              </h3>
              <p className="text-xs text-gp-ink-300">
                Pilihan kursi dengan struktur penopang tulang belakang ergonomis, armrest 3D/4D, dan sertifikasi hidrolik Class 4 teruji.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {["all", "Ergonomic Full Mesh", "Ergonomic Fabric", "Gaming Ergonomic"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setChairCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                    chairCategoryFilter === cat
                      ? "bg-hue-purple-950/50 text-hue-purple-300 border border-hue-purple-500/50 font-bold"
                      : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800 border border-transparent"
                  }`}
                >
                  {cat === "all" ? "Semua Kategori" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {publishedChairs
              .filter((c) => chairCategoryFilter === "all" || c.category === chairCategoryFilter)
              .map((chair) => (
                <div
                  key={chair.id}
                  className="bg-gp-ink-950 border border-gp-ink-700 hover:border-hue-purple-500/40 rounded-2xl p-6 space-y-4 flex flex-col justify-between transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-3xs font-black uppercase px-2 py-0.5 rounded bg-hue-purple-500/10 text-hue-purple-300 border border-hue-purple-500/30">
                            {chair.category}
                          </span>
                          <span className="text-3xs font-mono px-2 py-0.5 rounded bg-gp-ink-800 text-gp-ink-300 border border-gp-ink-700">
                            {chair.brand}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-white mt-1.5">{chair.name}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-hue-emerald-400 font-mono">
                          {formatRupiah(chair.price)}
                        </div>
                        <span className="text-3xs text-gp-ink-400 block">Estimasi Pasar</span>
                      </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-gp-ink-800/60 p-3.5 rounded-xl border border-gp-ink-750">
                      <div>
                        <span className="text-gp-ink-400 block text-3xs uppercase font-mono font-bold">Lumbar Support:</span>
                        <span className="text-gp-ink-100 font-medium text-2xs line-clamp-2" title={chair.lumbarSupport}>
                          {chair.lumbarSupport}
                        </span>
                      </div>
                      <div>
                        <span className="text-gp-ink-400 block text-3xs uppercase font-mono font-bold">Armrest:</span>
                        <span className="text-gp-ink-100 font-medium text-2xs line-clamp-2" title={chair.armrest}>
                          {chair.armrest}
                        </span>
                      </div>
                      <div>
                        <span className="text-gp-ink-400 block text-3xs uppercase font-mono font-bold">Gas Lift & Recline:</span>
                        <span className="text-gp-ink-100 font-medium text-2xs line-clamp-2" title={`${chair.gasLift} • ${chair.mechanism}`}>
                          {chair.gasLift} ({chair.mechanism})
                        </span>
                      </div>
                      <div>
                        <span className="text-gp-ink-400 block text-3xs uppercase font-mono font-bold">Beban & Tinggi User:</span>
                        <span className="text-gp-ink-100 font-medium text-2xs">
                          {chair.maxWeightCapacity} ({chair.recommendedHeight})
                        </span>
                      </div>
                    </div>

                    {/* Verdict */}
                    {chair.verdict && (
                      <div className="text-xs bg-hue-purple-950/20 border border-hue-purple-500/20 p-3 rounded-xl leading-relaxed">
                        <span className="text-hue-purple-400 font-mono font-bold text-3xs block uppercase mb-0.5">
                          Verdict Ahli GrayPlasma:
                        </span>
                        <p className="text-2xs text-gp-ink-200">{chair.verdict}</p>
                      </div>
                    )}

                    {/* Notes */}
                    {chair.notes && (
                      <p className="text-2xs text-gp-ink-300 italic">
                        💡 {chair.notes}
                      </p>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-gp-ink-750">
                    <span className="text-3xs text-gp-ink-400 font-mono">
                      🛡️ {chair.warranty}
                    </span>
                    <div className="flex items-center gap-2">
                      {chair.shopeeUrl && (
                        <a
                          href={chair.shopeeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-hue-orange-500/10 text-hue-orange-400 border border-hue-orange-500/30 hover:bg-hue-orange-500/20 transition-colors flex items-center gap-1.5 font-bold text-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Shopee</span>
                        </a>
                      )}
                      {chair.tokopediaUrl && (
                        <a
                          href={chair.tokopediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-hue-emerald-500/10 text-hue-emerald-400 border border-hue-emerald-500/30 hover:bg-hue-emerald-500/20 transition-colors flex items-center gap-1.5 font-bold text-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Tokopedia</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. VIEW: GIMMICK MEJA GAMING */}
      {activeSubTab === "gimmick" && (
        <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-gp-ink-700 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hue-amber-500/10 border border-hue-amber-500/30 text-hue-amber-400 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Edukasi Meja & Setup Ergonomi</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              {GIMMICK_MEJA_GAMING_CONTENT.title}
            </h3>
            <p className="text-xs text-gp-ink-300 leading-relaxed">
              {GIMMICK_MEJA_GAMING_CONTENT.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GIMMICK_MEJA_GAMING_CONTENT.poinPenting.map((point, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gp-ink-950 border border-gp-ink-700 text-xs text-gp-ink-200 leading-relaxed space-y-2"
              >
                <div className="flex items-center gap-2 text-hue-amber-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-hue-amber-500/20 flex items-center justify-center text-2xs">
                    {idx + 1}
                  </span>
                  <span>Catatan Penting #{idx + 1}</span>
                </div>
                <p>{point}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-gp-ink-800/80 border border-gp-ink-700 text-xs text-gp-ink-200 flex items-center justify-between">
            <span>Mau konsultasi ukuran meja sebelum beli?</span>
            <Button
              variant="cyber"
              size="sm"
              onClick={() => setActiveSubTab("meja")}
              className="text-xs font-bold"
            >
              Lihat Daftar Meja yang Aman →
            </Button>
          </div>
        </div>
      )}

      {/* 5. VIEW: HASIL KONSULTASI FORUM DISCORD */}
      {activeSubTab === "consultation-packages" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gp-ink-200 uppercase tracking-wider">
              Contoh Paket Racikan Setup Nyata dari Forum Konsultasi Discord GrayPlasma
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CONSULTATION_RESULTS_DATABASE.map((pack) => (
              <div
                key={pack.id}
                className="bg-gp-ink-950 border border-gp-ink-700 hover:border-hue-emerald-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-black uppercase px-2 py-0.5 rounded bg-hue-emerald-500/10 text-hue-emerald-400 border border-hue-emerald-500/30">
                      Budget {formatRupiah(pack.budget)}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white leading-snug">
                    {pack.title}
                  </h4>

                  <div className="space-y-1 text-xs text-gp-ink-300">
                    <div><strong>Target Penggunaan:</strong> {pack.needs}</div>
                    <div><strong>Spek PC / Laptop:</strong> {pack.specs}</div>
                  </div>

                  <div className="pt-2 border-t border-gp-ink-800">
                    <strong className="text-xs text-gp-ink-100 block mb-1.5">Rekomendasi Isi Paket:</strong>
                    <ul className="space-y-1.5">
                      {pack.recommendations.map((rec, i) => (
                        <li key={i} className="text-xs text-gp-ink-200 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-hue-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desk Column Manager Modal */}
      <TableColumnManagerModal
        isOpen={isDeskColModalOpen}
        onClose={() => setIsDeskColModalOpen(false)}
        title="Tabel Database Meja"
        columns={deskTable.columns}
        columnOrder={deskTable.columnOrder}
        columnVisibility={deskTable.columnVisibility}
        onToggleVisibility={deskTable.toggleColumnVisibility}
        onMoveColumn={deskTable.moveColumn}
        onReorderColumn={deskTable.reorderColumn}
        onSetColumnOrderDirectly={deskTable.setColumnOrderDirectly}
        onSetAllVisibility={deskTable.setAllColumnsVisibility}
        onResetColumns={deskTable.resetColumns}
      />

      {/* Peripheral Column Manager Modal */}
      <TableColumnManagerModal
        isOpen={isPeriColModalOpen}
        onClose={() => setIsPeriColModalOpen(false)}
        title="Tabel Monitor Arm, Bracket & Aksesoris"
        columns={periTable.columns}
        columnOrder={periTable.columnOrder}
        columnVisibility={periTable.columnVisibility}
        onToggleVisibility={periTable.toggleColumnVisibility}
        onMoveColumn={periTable.moveColumn}
        onReorderColumn={periTable.reorderColumn}
        onSetColumnOrderDirectly={periTable.setColumnOrderDirectly}
        onSetAllVisibility={periTable.setAllColumnsVisibility}
        onResetColumns={periTable.resetColumns}
      />
    </div>
  );
}
