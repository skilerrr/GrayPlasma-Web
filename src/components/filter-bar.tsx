"use client";

import React, { useEffect } from "react";
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
  X,
  Sparkles,
} from "lucide-react";
import {
  FilterState,
  PanelType,
  RefreshRateOption,
  ScreenSizeCategory,
  ResolutionCategory,
  TierRating,
  BudgetCategory,
} from "@/types/monitor";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";

export interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (updater: (prev: FilterState) => FilterState) => void;
  onResetFilters: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
  totalFilteredCount: number;
}

const PANEL_OPTIONS: PanelType[] = ["Fast IPS", "IPS", "OLED", "VA", "Nano IPS"];
const REFRESH_OPTIONS: RefreshRateOption[] = ["100Hz", "144Hz", "165Hz–180Hz", "240Hz+"];
const SCREEN_SIZE_OPTIONS: ScreenSizeCategory[] = ["24\"", "27\"", "32\"", "Ultrawide"];
const RESOLUTION_OPTIONS: ResolutionCategory[] = ["FHD (1080p)", "2K (1440p)", "4K (2160p)"];
const TIER_OPTIONS: TierRating[] = [
  "TOP TIER",
  "BEST VALUE",
  "VALUE ENTRY",
  "HONORABLE MENTION",
  "RECOMMENDED",
  "NOT RECOMMENDED",
  "TIER Discontinue",
];

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
  isOpen,
  onClose,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
  totalFilteredCount,
}: FilterBarProps) {
  const isModalOpen = isOpen ?? isMobileDrawerOpen ?? false;
  const handleClose = onClose ?? onCloseMobileDrawer ?? (() => {});

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

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

  const hasActiveFilters =
    filterState.panelTypes.length > 0 ||
    filterState.refreshRates.length > 0 ||
    filterState.screenSizes.length > 0 ||
    filterState.resolutions.length > 0 ||
    filterState.tiers.length > 0 ||
    filterState.budgetPreset !== null ||
    filterState.budgetRange[1] < 25000000;

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer / Modal Content Sheet */}
      <div
        className="relative z-10 w-full max-w-lg md:max-w-xl h-full bg-gp-ink-900 border-l border-gp-ink-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-gp-ink-700 flex items-center justify-between bg-gp-ink-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-hue-emerald-500/10 border border-hue-emerald-500/30 text-hue-emerald-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                // PARAMETERS & TELEMETRY
              </h2>
              <p className="text-2xs text-gp-ink-300 font-mono">
                Atur filter & kriteria pencarian monitor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="text-3xs font-mono font-bold text-gp-ink-300 hover:text-hue-emerald-400 px-2.5 py-1 rounded bg-gp-ink-800 border border-gp-ink-600 hover:border-hue-emerald-500 flex items-center gap-1 transition-colors"
                title="Reset semua filter"
              >
                <RotateCcw className="w-3 h-3" />
                <span>[RESET]</span>
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-300 hover:text-white hover:border-gp-ink-600 transition-colors"
              title="Tutup panel (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Options */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-gp-ink-200">
          {/* 1. Budget Range & Quick Select */}
          <div className="space-y-3 bg-gp-ink-850 p-4 rounded-xl border border-gp-ink-700/80">
            <label className="text-xs font-semibold text-gp-ink-100 flex items-center gap-1.5">
              <CircleDollarSign className="w-3.5 h-3.5 text-hue-amber-400" />
              <span>Budget Maksimal</span>
            </label>

            {/* Quick presets */}
            <div className="grid grid-cols-2 gap-1.5">
              {BUDGET_PRESETS.map((preset) => {
                const isSelected = filterState.budgetPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleBudgetPreset(preset)}
                    className={`text-xs py-2 px-3 rounded-lg border font-mono font-bold text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? "bg-hue-amber-500/15 border-hue-amber-500/60 text-hue-amber-300 shadow-tech-subtle"
                        : "bg-gp-ink-950 border-gp-ink-700 text-gp-ink-300 hover:text-gp-ink-100 hover:border-gp-ink-600"
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-hue-amber-400" />}
                  </button>
                );
              })}
            </div>

            {/* Range Slider */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-gp-ink-300 mb-2 font-mono">
                <span>Rp 0</span>
                <span className="text-hue-emerald-400 font-medium bg-hue-emerald-500/10 px-2 py-0.5 rounded border border-hue-emerald-500/30">
                  {filterState.budgetRange[1] >= 25000000
                    ? "Semua Harga"
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
                className="w-full h-1.5 bg-gp-ink-700 rounded-lg appearance-none cursor-pointer accent-hue-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Rating Tier */}
          <div className="space-y-2.5 bg-gp-ink-850 p-4 rounded-xl border border-gp-ink-700/80">
            <label className="text-xs font-semibold text-gp-ink-100 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-hue-emerald-400" />
              <span>Tier Rekomendasi</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {TIER_OPTIONS.map((tier) => {
                const isSelected = filterState.tiers.includes(tier);
                return (
                  <button
                    key={tier}
                    onClick={() => toggleTier(tier)}
                    className={`text-xs py-2 px-3 rounded-lg border font-mono font-bold transition-colors flex items-center justify-between ${
                      isSelected
                        ? tier === "TOP TIER" || tier === "S-TIER"
                          ? "bg-hue-emerald-500/20 text-hue-emerald-300 border-hue-emerald-400 shadow-tech-subtle"
                          : tier === "BEST VALUE" || tier === "VALUE ENTRY"
                          ? "bg-hue-amber-500/20 text-hue-amber-300 border-hue-amber-400 shadow-tech-subtle"
                          : tier === "RECOMMENDED" || tier === "HONORABLE MENTION"
                          ? "bg-hue-cyan-500/20 text-hue-cyan-300 border-hue-cyan-400 shadow-tech-subtle"
                          : tier === "TIER Discontinue" || tier === "DISCONTINUE"
                          ? "bg-gp-ink-800 text-hue-rose-400 border-hue-rose-500 shadow-tech-subtle"
                          : "bg-hue-rose-500/20 text-hue-rose-300 border-hue-rose-400 shadow-tech-subtle"
                        : "bg-gp-ink-950 border-gp-ink-700 text-gp-ink-300 hover:text-gp-ink-100 hover:border-gp-ink-600"
                    }`}
                  >
                    <span>[ {tier} ]</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Panel Type */}
          <div className="space-y-2.5 bg-gp-ink-850 p-4 rounded-xl border border-gp-ink-700/80">
            <label className="text-xs font-semibold text-gp-ink-100 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-hue-cyan-400" />
              <span>Tipe Panel</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PANEL_OPTIONS.map((panel) => {
                const isSelected = filterState.panelTypes.includes(panel);
                return (
                  <button
                    key={panel}
                    onClick={() => togglePanel(panel)}
                    className={`text-xs py-2 px-3 rounded-lg border font-mono font-bold text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? "bg-hue-cyan-500/15 border-hue-cyan-500/60 text-hue-cyan-300 shadow-tech-subtle"
                        : "bg-gp-ink-950 border-gp-ink-700 text-gp-ink-300 hover:text-gp-ink-100 hover:border-gp-ink-600"
                    }`}
                  >
                    <span>{panel}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-hue-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Refresh Rate */}
          <div className="space-y-2.5 bg-gp-ink-850 p-4 rounded-xl border border-gp-ink-700/80">
            <label className="text-xs font-semibold text-gp-ink-100 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-hue-emerald-400" />
              <span>Refresh Rate</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {REFRESH_OPTIONS.map((rate) => {
                const isSelected = filterState.refreshRates.includes(rate);
                return (
                  <button
                    key={rate}
                    onClick={() => toggleRefresh(rate)}
                    className={`text-xs py-2 px-3 rounded-lg border font-mono font-bold text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? "bg-hue-emerald-500/15 border-hue-emerald-500/60 text-hue-emerald-300 shadow-tech-subtle"
                        : "bg-gp-ink-950 border-gp-ink-700 text-gp-ink-300 hover:text-gp-ink-100 hover:border-gp-ink-600"
                    }`}
                  >
                    <span>{rate}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-hue-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Screen Size & Resolution Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Screen Size */}
            <div className="space-y-2.5 bg-gp-ink-850 p-4 rounded-xl border border-gp-ink-700/80">
              <label className="text-xs font-semibold text-gp-ink-100 flex items-center gap-1.5">
                <Maximize className="w-3.5 h-3.5 text-hue-amber-400" />
                <span>Ukuran Layar</span>
              </label>
              <div className="space-y-1.5">
                {SCREEN_SIZE_OPTIONS.map((size) => {
                  const isSelected = filterState.screenSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleScreenSize(size)}
                      className={`w-full text-xs py-1.5 px-3 rounded-lg border font-mono font-bold text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-hue-amber-500/15 border-hue-amber-500/60 text-hue-amber-300"
                          : "bg-gp-ink-950 border-gp-ink-700 text-gp-ink-300 hover:text-gp-ink-100 hover:border-gp-ink-600"
                      }`}
                    >
                      <span>{size}</span>
                      {isSelected && <Check className="w-3 h-3 text-hue-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resolution */}
            <div className="space-y-2.5 bg-gp-ink-850 p-4 rounded-xl border border-gp-ink-700/80">
              <label className="text-xs font-semibold text-gp-ink-100 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-hue-violet-400" />
                <span>Resolusi</span>
              </label>
              <div className="space-y-1.5">
                {RESOLUTION_OPTIONS.map((res) => {
                  const isSelected = filterState.resolutions.includes(res);
                  return (
                    <button
                      key={res}
                      onClick={() => toggleResolution(res)}
                      className={`w-full text-xs py-1.5 px-3 rounded-lg border font-mono font-bold text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-hue-violet-500/15 border-hue-violet-500/60 text-hue-violet-300"
                          : "bg-gp-ink-950 border-gp-ink-700 text-gp-ink-300 hover:text-gp-ink-100 hover:border-gp-ink-600"
                      }`}
                    >
                      <span>{res}</span>
                      {isSelected && <Check className="w-3 h-3 text-hue-violet-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-gp-ink-700 bg-gp-ink-850 flex gap-3">
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onResetFilters}
              className="text-xs font-mono font-bold"
            >
              Reset Semua
            </Button>
          )}
          <Button
            variant="cyber"
            onClick={handleClose}
            className="flex-1 text-xs font-mono font-bold py-2.5"
          >
            Tampilkan {totalFilteredCount} Monitor
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * ActiveFilterPills: Displays removable chips of active filters above full-width table or grid
 */
export function ActiveFilterPills({
  filterState,
  onFilterChange,
  onResetFilters,
  onOpenFilter,
}: {
  filterState: FilterState;
  onFilterChange: (updater: (prev: FilterState) => FilterState) => void;
  onResetFilters: () => void;
  onOpenFilter: () => void;
}) {
  const hasActiveFilters =
    filterState.panelTypes.length > 0 ||
    filterState.refreshRates.length > 0 ||
    filterState.screenSizes.length > 0 ||
    filterState.resolutions.length > 0 ||
    filterState.tiers.length > 0 ||
    filterState.budgetPreset !== null ||
    filterState.budgetRange[1] < 25000000 ||
    Boolean(filterState.searchQuery);

  if (!hasActiveFilters) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap py-2 px-3 rounded-xl bg-gp-ink-998 border border-gp-ink-700/80 text-xs font-mono">
      <span className="text-gp-ink-400 text-2xs uppercase tracking-wider font-bold">
        Filter Aktif:
      </span>

      {/* Budget Pill */}
      {(filterState.budgetPreset || filterState.budgetRange[1] < 25000000) && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-hue-amber-500/10 border border-hue-amber-500/30 text-hue-amber-300 text-2xs">
          <span>
            Budget: ≤ {formatRupiah(filterState.budgetRange[1])}
          </span>
          <button
            onClick={() =>
              onFilterChange((prev) => ({
                ...prev,
                budgetPreset: null,
                budgetRange: [0, 25000000],
              }))
            }
            className="hover:text-white"
            title="Hapus filter budget"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Tiers */}
      {filterState.tiers.map((tier) => (
        <span
          key={tier}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-hue-emerald-500/10 border border-hue-emerald-500/30 text-hue-emerald-300 text-2xs"
        >
          <span>Tier: {tier}</span>
          <button
            onClick={() =>
              onFilterChange((prev) => ({
                ...prev,
                tiers: prev.tiers.filter((t) => t !== tier),
              }))
            }
            className="hover:text-white"
            title={`Hapus filter ${tier}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Panels */}
      {filterState.panelTypes.map((panel) => (
        <span
          key={panel}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-hue-cyan-500/10 border border-hue-cyan-500/30 text-hue-cyan-300 text-2xs"
        >
          <span>{panel}</span>
          <button
            onClick={() =>
              onFilterChange((prev) => ({
                ...prev,
                panelTypes: prev.panelTypes.filter((p) => p !== panel),
              }))
            }
            className="hover:text-white"
            title={`Hapus filter ${panel}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Refresh Rates */}
      {filterState.refreshRates.map((rate) => (
        <span
          key={rate}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-hue-emerald-500/10 border border-hue-emerald-500/30 text-hue-emerald-300 text-2xs"
        >
          <span>{rate}</span>
          <button
            onClick={() =>
              onFilterChange((prev) => ({
                ...prev,
                refreshRates: prev.refreshRates.filter((r) => r !== rate),
              }))
            }
            className="hover:text-white"
            title={`Hapus filter ${rate}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Resolutions */}
      {filterState.resolutions.map((res) => (
        <span
          key={res}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-hue-violet-500/10 border border-hue-violet-500/30 text-hue-violet-300 text-2xs"
        >
          <span>{res}</span>
          <button
            onClick={() =>
              onFilterChange((prev) => ({
                ...prev,
                resolutions: prev.resolutions.filter((r) => r !== res),
              }))
            }
            className="hover:text-white"
            title={`Hapus filter ${res}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Screen Sizes */}
      {filterState.screenSizes.map((size) => (
        <span
          key={size}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-hue-amber-500/10 border border-hue-amber-500/30 text-hue-amber-300 text-2xs"
        >
          <span>{size}</span>
          <button
            onClick={() =>
              onFilterChange((prev) => ({
                ...prev,
                screenSizes: prev.screenSizes.filter((s) => s !== size),
              }))
            }
            className="hover:text-white"
            title={`Hapus filter ${size}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Search Query */}
      {filterState.searchQuery && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-gp-ink-700 border border-gp-ink-600 text-gp-ink-100 text-2xs">
          <span>Cari: &ldquo;{filterState.searchQuery}&rdquo;</span>
          <button
            onClick={() =>
              onFilterChange((prev) => ({ ...prev, searchQuery: "" }))
            }
            className="hover:text-white"
            title="Hapus pencarian"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Edit filter button */}
      <button
        onClick={onOpenFilter}
        className="text-2xs text-gp-ink-300 hover:text-white underline underline-offset-2 ml-1"
      >
        + Edit
      </button>

      {/* Reset All */}
      <button
        onClick={onResetFilters}
        className="text-2xs text-hue-rose-400 hover:text-hue-rose-300 ml-auto font-bold"
      >
        [Reset Semua]
      </button>
    </div>
  );
}
