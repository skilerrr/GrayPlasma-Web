"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

export interface TableColumnDef<T = any> {
  id: string;
  label: string;
  shortLabel?: string;
  minWidth?: string;
  sortable?: boolean;
  isDefaultVisible: boolean;
  category?: string;
  getValue?: (item: T) => any;
  renderCell: (item: T, index: number) => React.ReactNode;
}

export interface UseDraggableTableOptions<T> {
  storageKey: string;
  columns: TableColumnDef<T>[];
  defaultSortField?: string;
  defaultSortDirection?: "asc" | "desc";
}

export function useDraggableTable<T>({
  storageKey,
  columns,
  defaultSortField,
  defaultSortDirection = "asc",
}: UseDraggableTableOptions<T>) {
  // 1. Column Order State
  const defaultOrder = useMemo(() => columns.map((c) => c.id), [columns]);
  const [columnOrder, setColumnOrder] = useState<string[]>(defaultOrder);

  // 2. Column Visibility State
  const defaultVisibility = useMemo(() => {
    const map: Record<string, boolean> = {};
    columns.forEach((c) => {
      map[c.id] = c.isDefaultVisible;
    });
    return map;
  }, [columns]);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(defaultVisibility);

  // 3. Sorting State
  const [sortField, setSortField] = useState<string | null>(defaultSortField || null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(defaultSortDirection);

  // 4. Drag & Drop State
  const [draggedColId, setDraggedColId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(`gp_table_pref_${storageKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.columnOrder) && parsed.columnOrder.length > 0) {
          // Merge with any new columns that might have been added to definitions
          const validIds = new Set(columns.map((c) => c.id));
          const filtered = parsed.columnOrder.filter((id: string) => validIds.has(id));
          columns.forEach((c) => {
            if (!filtered.includes(c.id)) {
              filtered.push(c.id);
            }
          });
          setColumnOrder(filtered);
        }
        if (parsed.columnVisibility && typeof parsed.columnVisibility === "object") {
          setColumnVisibility((prev) => ({
            ...prev,
            ...parsed.columnVisibility,
          }));
        }
        if (parsed.sortField !== undefined) {
          setSortField(parsed.sortField);
        }
        if (parsed.sortDirection) {
          setSortDirection(parsed.sortDirection);
        }
      }
    } catch (e) {
      console.error("Failed to load table preferences", e);
    }
  }, [storageKey, columns]);

  // Persist preferences helper
  const savePreferences = useCallback(
    (newOrder: string[], newVisibility: Record<string, boolean>, sField: string | null, sDir: "asc" | "desc") => {
      if (typeof window === "undefined") return;
      try {
        const payload = {
          columnOrder: newOrder,
          columnVisibility: newVisibility,
          sortField: sField,
          sortDirection: sDir,
        };
        localStorage.setItem(`gp_table_pref_${storageKey}`, JSON.stringify(payload));
      } catch (e) {
        console.error("Failed to save table preferences", e);
      }
    },
    [storageKey]
  );

  // Handle Sort Toggle
  const handleSort = useCallback(
    (colId: string) => {
      const targetCol = columns.find((c) => c.id === colId);
      if (!targetCol || targetCol.sortable === false) return;

      let nextDir: "asc" | "desc" = "asc";
      let nextField: string | null = colId;

      if (sortField === colId) {
        if (sortDirection === "asc") {
          nextDir = "desc";
        } else {
          // Reset sort
          nextField = null;
          nextDir = "asc";
        }
      }

      setSortField(nextField);
      setSortDirection(nextDir);
      savePreferences(columnOrder, columnVisibility, nextField, nextDir);
    },
    [columns, sortField, sortDirection, columnOrder, columnVisibility, savePreferences]
  );

  // Column Drag Handlers
  const handleColumnDragStart = useCallback((colId: string, e: React.DragEvent) => {
    setDraggedColId(colId);
    e.dataTransfer.setData("text/plain", colId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleColumnDragOver = useCallback((colId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColId(colId);
  }, []);

  const handleColumnDrop = useCallback(
    (targetColId: string) => {
      if (!draggedColId || draggedColId === targetColId) {
        setDraggedColId(null);
        setDragOverColId(null);
        return;
      }

      const copy = [...columnOrder];
      const fromIdx = copy.indexOf(draggedColId);
      const toIdx = copy.indexOf(targetColId);

      if (fromIdx !== -1 && toIdx !== -1) {
        copy.splice(fromIdx, 1);
        copy.splice(toIdx, 0, draggedColId);
        setColumnOrder(copy);
        savePreferences(copy, columnVisibility, sortField, sortDirection);
      }

      setDraggedColId(null);
      setDragOverColId(null);
    },
    [draggedColId, columnOrder, columnVisibility, sortField, sortDirection, savePreferences]
  );

  // Column Visibility Toggle
  const toggleColumnVisibility = useCallback(
    (colId: string) => {
      const updated = {
        ...columnVisibility,
        [colId]: !columnVisibility[colId],
      };
      setColumnVisibility(updated);
      savePreferences(columnOrder, updated, sortField, sortDirection);
    },
    [columnVisibility, columnOrder, sortField, sortDirection, savePreferences]
  );

  // Reorder Column via directional buttons
  const moveColumn = useCallback(
    (colId: string, direction: "left" | "right" | "up" | "down") => {
      const copy = [...columnOrder];
      const currentIdx = copy.indexOf(colId);
      if (currentIdx === -1) return;

      const targetIdx =
        direction === "left" || direction === "up" ? currentIdx - 1 : currentIdx + 1;

      if (targetIdx >= 0 && targetIdx < copy.length) {
        const temp = copy[currentIdx];
        copy[currentIdx] = copy[targetIdx];
        copy[targetIdx] = temp;
        setColumnOrder(copy);
        savePreferences(copy, columnVisibility, sortField, sortDirection);
      }
    },
    [columnOrder, columnVisibility, sortField, sortDirection, savePreferences]
  );

  // Direct Reordering (for Drag & Drop in modal / list)
  const reorderColumn = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      const copy = [...columnOrder];
      const [removed] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, removed);
      setColumnOrder(copy);
      savePreferences(copy, columnVisibility, sortField, sortDirection);
    },
    [columnOrder, columnVisibility, sortField, sortDirection, savePreferences]
  );

  const setColumnOrderDirectly = useCallback(
    (newOrder: string[]) => {
      setColumnOrder(newOrder);
      savePreferences(newOrder, columnVisibility, sortField, sortDirection);
    },
    [columnVisibility, sortField, sortDirection, savePreferences]
  );

  // Bulk Visibility Toggle (Select All / Deselect All)
  const setAllColumnsVisibility = useCallback(
    (visible: boolean) => {
      const updated: Record<string, boolean> = {};
      columns.forEach((c) => {
        updated[c.id] = visible;
      });
      setColumnVisibility(updated);
      savePreferences(columnOrder, updated, sortField, sortDirection);
    },
    [columns, columnOrder, sortField, sortDirection, savePreferences]
  );

  // Reset Columns to Default
  const resetColumns = useCallback(() => {
    setColumnOrder(defaultOrder);
    setColumnVisibility(defaultVisibility);
    setSortField(defaultSortField || null);
    setSortDirection(defaultSortDirection);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`gp_table_pref_${storageKey}`);
    }
  }, [defaultOrder, defaultVisibility, defaultSortField, defaultSortDirection, storageKey]);

  // Compute Active Visible Columns in Current Order
  const visibleColumns = useMemo(() => {
    const colMap = new Map(columns.map((c) => [c.id, c]));
    return columnOrder
      .filter((id) => columnVisibility[id] !== false)
      .map((id) => colMap.get(id))
      .filter((c): c is TableColumnDef<T> => Boolean(c));
  }, [columns, columnOrder, columnVisibility]);

  // Compute Sorted Data
  const getSortedData = useCallback(
    (items: T[]): T[] => {
      if (!sortField) return items;
      const targetCol = columns.find((c) => c.id === sortField);
      if (!targetCol || !targetCol.getValue) return items;

      return [...items].sort((a, b) => {
        const valA = targetCol.getValue!(a);
        const valB = targetCol.getValue!(b);

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        const res = strA.localeCompare(strB, "id", { numeric: true });
        return sortDirection === "asc" ? res : -res;
      });
    },
    [sortField, sortDirection, columns]
  );

  return {
    columns,
    columnOrder,
    columnVisibility,
    visibleColumns,
    sortField,
    sortDirection,
    draggedColId,
    dragOverColId,
    handleSort,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop,
    toggleColumnVisibility,
    moveColumn,
    reorderColumn,
    setColumnOrderDirectly,
    setAllColumnsVisibility,
    resetColumns,
    getSortedData,
  };
}
