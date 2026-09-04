"use client";

import React from "react";
import {
  RotateCcw,
  SlidersHorizontal,
  Check,
  Zap,
  Layers,
  Maximize,
  Tv,
  Award,
  CircleDollarSign,
  X
} from "lucide-react";
import {
  FilterState,
  PanelType,
  RefreshRateOption,
  ScreenSizeCategory,
  ResolutionCategory,
  TierRating,
  BudgetCategory
} from "@/types/monitor";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";

interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (updater: (prev: FilterState) => FilterState) => void;
  onResetFilters: () => void;
  isMobileDrawerOpen: boolean;
  onCloseMobileDrawer: () => void;
  totalFilteredCount: number;
}

const PANEL_OPTIONS: PanelType[] = ["Fast IPS", "IPS", "OLED", "VA", "Nano IPS"];
const REFRESH_OPTIONS: RefreshRateOption[] = ["100Hz", "144Hz", "165Hz–180Hz", "240Hz+"];
const SCREEN_SIZE_OPTIONS: ScreenSizeCategory[] = ["24\"", "27\"", "32\"", "Ultrawide"];
const RESOLUTION_OPTIONS: ResolutionCategory[] = ["FHD (1080p)", "2K (1440p)", "4K (2160p)"];
const TIER_OPTIONS: TierRating[] = ["S-TIER", "BEST VALUE", "RECOMMENDED", "PASS"];

const BUDGET_PRESETS: { id: BudgetCategory; label: string; range: [number, number] }[] = [
  { id: "under-1.5m", label: "< 1.5 Jt", range: [0, 1500000] },
  { id: "1.5m-3m", label: "1.5 - 3 Jt", range: [1500000, 3000000] },
  { id: "3m-5m", label: "3 - 5 Jt", range: [3000000, 5000000] },
  { id: "5m-plus", label: "5 Jt+", range: [5000000, 25000000] },
];

export function FilterBar({
  filterState,
  onFilterChange,
  onResetFilters,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
  totalFilteredCount,
}: FilterBarProps) {
  // Toggle helpers
  const togglePanel = (panel: PanelType) => {
    onFilterChange((prev) => {
      const exists = prev.panelTypes.includes(panel);
      return {
        ...prev,
        panelTypes: exists
          ? prev.panelTypes.filter((p) => p !== panel)
          : [...prev.panelTypes, panel],
      };
    });
  };

  const toggleRefresh = (rate: RefreshRateOption) => {
    onFilterChange((prev) => {
      const exists = prev.refreshRates.includes(rate);
      return {
        ...prev,
        refreshRates: exists
          ? prev.refreshRates.filter((r) => r !== rate)
          : [...prev.refreshRates, rate],
      };
    });
  };

  const toggleScreenSize = (size: ScreenSizeCategory) => {
    onFilterChange((prev) => {
      const exists = prev.screenSizes.includes(size);
      return {
        ...prev,
        screenSizes: exists
          ? prev.screenSizes.filter((s) => s !== size)
          : [...prev.screenSizes, size],
      };
    });
  };

  const toggleResolution = (res: ResolutionCategory) => {
    onFilterChange((prev) => {
      const exists = prev.resolutions.includes(res);
      return {
        ...prev,
        resolutions: exists
          ? prev.resolutions.filter((r) => r !== res)
          : [...prev.resolutions, res],
      };
    });
  };

  const toggleTier = (tier: TierRating) => {
    onFilterChange((prev) => {
      const exists = prev.tiers.includes(tier);
      return {
        ...prev,
        tiers: exists
          ? prev.tiers.filter((t) => t !== tier)
          : [...prev.tiers, tier],
      };
    });
  };

  const handleBudgetPreset = (preset: typeof BUDGET_PRESETS[0]) => {
    onFilterChange((prev) => {
      const isSelected = prev.budgetPreset === preset.id;
      return {
        ...prev,
        budgetPreset: isSelected ? null : preset.id,
        budgetRange: isSelected ? [0, 25000000] : preset.range,
      };
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxVal = Number(e.target.value);
    onFilterChange((prev) => ({
      ...prev,
      budgetPreset: null,
      budgetRange: [0, maxVal],
    }));
  };

  // Check if any filters are active
  const hasActiveFilters =
    filterState.panelTypes.length > 0 ||
    filterState.refreshRates.length > 0 ||
    filterState.screenSizes.length > 0 ||
    filterState.resolutions.length > 0 ||
    filterState.tiers.length > 0 ||
    filterState.budgetPreset !== null ||
    filterState.budgetRange[1] < 25000000;

  const content = (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-700/80">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            // PARAMETERS & TELEMETRY
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[10px] font-mono font-bold text-zinc-400 hover:text-emerald-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 hover:border-emerald-500 shadow-[1px_1px_0px_#000] flex items-center gap-1 transition-colors group"
          >
            <RotateCcw className="w-3 h-3 group-hover:-rotate-45 transition-transform" />
            <span>[RESET]</span>
          </button>
        )}
      </div>

      {/* 1. Budget Range & Quick Select */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
          <CircleDollarSign className="w-3.5 h-3.5 text-amber-400" />
          <span>[ 01 // BUDGET_MAKSIMAL ]</span>
        </label>
        
        {/* Quick presets */}
        <div className="grid grid-cols-2 gap-1.5">
          {BUDGET_PRESETS.map((preset) => {
            const isSelected = filterState.budgetPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleBudgetPreset(preset)}
                className={`text-xs py-1.5 px-2.5 rounded border font-mono font-bold text-left transition-all flex items-center justify-between shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] ${
                  isSelected
                    ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[2px_2px_0px_#f59e0b]"
                    : "bg-[#0b0b0f] border-zinc-700/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500"
                }`}
              >
                <span>{preset.label}</span>
                {isSelected && <Check className="w-3 h-3 text-amber-400" />}
              </button>
            );
          })}
        </div>

        {/* Range Slider */}
        <div className="pt-2">
          <div className="flex justify-between text-xs text-zinc-400 mb-1.5 font-mono">
            <span>Rp 0</span>
            <span className="text-emerald-400 font-bold">
              {filterState.budgetRange[1] >= 25000000
                ? "[ SEMUA HARGA ]"
                : `≤ ${formatRupiah(filterState.budgetRange[1])}`}
            </span>
          </div>
          <input
            type="range"
            min={1000000}
            max={25000000}
            step={500000}
            value={filterState.budgetRange[1]}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Rating Tier */}
      <div className="space-y-2.5">
        <label className="text-xs font-mono font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span>[ 02 // TIER_REKOMENDASI ]</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TIER_OPTIONS.map((tier) => {
            const isSelected = filterState.tiers.includes(tier);
            return (
              <button
                key={tier}
                onClick={() => toggleTier(tier)}
                className={`text-xs py-1 px-2.5 rounded border font-mono font-bold transition-all shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] ${
                  isSelected
                    ? tier === "S-TIER"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400"
                      : tier === "BEST VALUE"
                      ? "bg-amber-500/20 text-amber-300 border-amber-400"
                      : tier === "RECOMMENDED"
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                      : "bg-rose-500/20 text-rose-300 border-rose-400"
                    : "bg-[#0b0b0f] border-zinc-700/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500"
                }`}
              >
                [ {tier} ]
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Panel Type (Multi-checkbox) */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tipe Panel</span>
        </label>
        <div className="space-y-1.5">
          {PANEL_OPTIONS.map((panel) => {
            const isSelected = filterState.panelTypes.includes(panel);
            return (
              <label
                key={panel}
                onClick={() => togglePanel(panel)}
                className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer select-none transition-all ${
                  isSelected
                    ? "bg-zinc-900 border-emerald-500/50 text-white"
                    : "bg-surface/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                }`}
              >
                <span className="text-xs font-medium">{panel}</span>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-emerald-500 border-emerald-500 text-black"
                      : "border-zinc-700 bg-zinc-900"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Refresh Rate */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Rate</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {REFRESH_OPTIONS.map((rate) => {
            const isSelected = filterState.refreshRates.includes(rate);
            return (
              <button
                key={rate}
                onClick={() => toggleRefresh(rate)}
                className={`text-xs py-1.5 px-2 rounded-lg border font-medium transition-all ${
                  isSelected
                    ? "bg-emerald-500/15 border-emerald-400/70 text-emerald-300 font-semibold"
                    : "bg-surface border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                {rate}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Screen Size */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
          <Maximize className="w-3.5 h-3.5 text-violet-400" />
          <span>Ukuran Layar</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {SCREEN_SIZE_OPTIONS.map((size) => {
            const isSelected = filterState.screenSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleScreenSize(size)}
                className={`text-xs py-1.5 px-2 rounded-lg border font-medium transition-all ${
                  isSelected
                    ? "bg-zinc-100 text-black font-semibold border-white"
                    : "bg-surface border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Resolution */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
          <Tv className="w-3.5 h-3.5 text-rose-400" />
          <span>Resolusi</span>
        </label>
        <div className="space-y-1.5">
          {RESOLUTION_OPTIONS.map((res) => {
            const isSelected = filterState.resolutions.includes(res);
            return (
              <button
                key={res}
                onClick={() => toggleResolution(res)}
                className={`w-full text-xs py-1.5 px-3 rounded-lg border font-medium text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-zinc-100 text-black font-semibold border-white"
                    : "bg-surface border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                <span>{res}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Sticky */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-28 bg-surface-dark border border-zinc-800/90 rounded-2xl p-5 shadow-xl shadow-black/50">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer (Bottom Sheet / Side Sheet) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobileDrawer}
          />
          {/* Sheet Body */}
          <div className="relative z-10 w-full max-h-[85vh] bg-surface-dark border-t border-zinc-800 rounded-t-3xl p-6 overflow-y-auto shadow-2xl flex flex-col">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Filter Rekomendasi
              </h2>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-6">{content}</div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-800 flex gap-3">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={onResetFilters}
                  className="flex-1 text-xs"
                >
                  Reset
                </Button>
              )}
              <Button
                variant="cyber"
                onClick={onCloseMobileDrawer}
                className="flex-1 text-xs font-bold"
              >
                Tampilkan {totalFilteredCount} Monitor
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
