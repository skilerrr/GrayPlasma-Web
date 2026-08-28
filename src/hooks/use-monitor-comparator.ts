"use client";

import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { useCallback, useState } from "react";
import { Monitor } from "@/types/monitor";

export function useMonitorComparator(allMonitors: Monitor[] = []) {
  const [compareSlugs, setCompareSlugs] = useQueryState(
    "compare",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: true })
  );

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const pinnedMonitors = (allMonitors || []).filter((m) =>
    compareSlugs.includes(m.slug || m.id)
  );

  const isPinned = useCallback(
    (monitor: Monitor) => {
      const key = monitor.slug || monitor.id;
      return compareSlugs.includes(key);
    },
    [compareSlugs]
  );

  const togglePin = useCallback(
    (monitor: Monitor) => {
      const key = monitor.slug || monitor.id;
      setCompareSlugs((prev) => {
        if (prev.includes(key)) {
          return prev.filter((k) => k !== key);
        }
        if (prev.length >= 3) {
          // Replace oldest pin or limit to 3
          return [...prev.slice(1), key];
        }
        return [...prev, key];
      });
    },
    [setCompareSlugs]
  );

  const removePin = useCallback(
    (key: string) => {
      setCompareSlugs((prev) => prev.filter((k) => k !== key));
    },
    [setCompareSlugs]
  );

  const clearAllPins = useCallback(() => {
    setCompareSlugs([]);
    setIsCompareModalOpen(false);
  }, [setCompareSlugs]);

  return {
    compareSlugs,
    pinnedMonitors,
    isPinned,
    togglePin,
    removePin,
    clearAllPins,
    isCompareModalOpen,
    setIsCompareModalOpen,
  };
}
