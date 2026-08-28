"use client";

import { useQueryState, parseAsString, parseAsArrayOf, parseAsInteger } from "nuqs";
import { QuickFilterTab, TierRating, PanelType, RefreshRateOption, ScreenSizeCategory, ResolutionCategory, BudgetCategory } from "@/types/monitor";
import { useMemo, useCallback } from "react";

export function useMonitorFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: true, throttleMs: 300 })
  );

  const [quickTab, setQuickTab] = useQueryState(
    "tab",
    parseAsString.withDefault("all").withOptions({ shallow: true })
  );

  const [panelTypes, setPanelTypes] = useQueryState(
    "panel",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: true })
  );

  const [refreshRates, setRefreshRates] = useQueryState(
    "refresh",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: true })
  );

  const [screenSizes, setScreenSizes] = useQueryState(
    "size",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: true })
  );

  const [resolutions, setResolutions] = useQueryState(
    "res",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: true })
  );

  const [tiers, setTiers] = useQueryState(
    "tier",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: true })
  );

  const [maxBudget, setMaxBudget] = useQueryState(
    "max_budget",
    parseAsInteger.withDefault(25000000).withOptions({ shallow: true })
  );

  const [budgetPreset, setBudgetPreset] = useQueryState(
    "budget_preset",
    parseAsString.withDefault("").withOptions({ shallow: true })
  );

  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsString.withDefault("tier").withOptions({ shallow: true })
  );

  const handleQuickTabChange = useCallback((tab: QuickFilterTab) => {
    setQuickTab(tab);
    if (tab === "all") {
      setTiers([]);
      setPanelTypes([]);
      setBudgetPreset("");
      setMaxBudget(25000000);
    } else if (tab === "s-tier") {
      setTiers(["S-TIER"]);
      setPanelTypes([]);
      setBudgetPreset("");
    } else if (tab === "budget") {
      setBudgetPreset("under-1.5m");
      setMaxBudget(2000000);
      setTiers([]);
    } else if (tab === "esport") {
      setRefreshRates(["240Hz+"]);
      setTiers([]);
    } else if (tab === "productivity") {
      setResolutions(["2K (1440p)"]);
      setTiers([]);
    } else if (tab === "oled") {
      setPanelTypes(["OLED"]);
      setTiers([]);
    }
  }, [setQuickTab, setTiers, setPanelTypes, setBudgetPreset, setMaxBudget, setRefreshRates, setResolutions]);

  const resetAllFilters = useCallback(() => {
    setSearchQuery("");
    setQuickTab("all");
    setPanelTypes([]);
    setRefreshRates([]);
    setScreenSizes([]);
    setResolutions([]);
    setTiers([]);
    setMaxBudget(25000000);
    setBudgetPreset("");
    setSortBy("tier");
  }, [setSearchQuery, setQuickTab, setPanelTypes, setRefreshRates, setScreenSizes, setResolutions, setTiers, setMaxBudget, setBudgetPreset, setSortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (panelTypes.length > 0) count++;
    if (refreshRates.length > 0) count++;
    if (screenSizes.length > 0) count++;
    if (resolutions.length > 0) count++;
    if (tiers.length > 0) count++;
    if (maxBudget < 25000000 || budgetPreset) count++;
    return count;
  }, [searchQuery, panelTypes, refreshRates, screenSizes, resolutions, tiers, maxBudget, budgetPreset]);

  return {
    searchQuery,
    setSearchQuery,
    quickTab: quickTab as QuickFilterTab,
    setQuickTab,
    handleQuickTabChange,
    panelTypes: panelTypes as PanelType[],
    setPanelTypes,
    refreshRates: refreshRates as RefreshRateOption[],
    setRefreshRates,
    screenSizes: screenSizes as ScreenSizeCategory[],
    setScreenSizes,
    resolutions: resolutions as ResolutionCategory[],
    setResolutions,
    tiers: tiers as TierRating[],
    setTiers,
    maxBudget,
    setMaxBudget,
    budgetPreset: (budgetPreset || null) as BudgetCategory | null,
    setBudgetPreset,
    sortBy: sortBy as "price-asc" | "price-desc" | "tier" | "refresh-desc" | "rating",
    setSortBy,
    resetAllFilters,
    activeFilterCount,
  };
}
