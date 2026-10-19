"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 9,
  onPageChange,
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t border-gp-ink-700/80 text-xs">
      <div className="text-gp-ink-400 font-mono">
        Menampilkan <strong className="text-gp-ink-200 font-bold">{startItem}–{endItem}</strong> dari{" "}
        <strong className="text-gp-ink-200 font-bold">{totalItems}</strong> item (Halaman {currentPage} dari {totalPages})
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => {
            onPageChange(Math.max(1, currentPage - 1));
          }}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-xl bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 font-semibold"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            // Show first page, last page, and pages around current page
            if (
              p === 1 ||
              p === totalPages ||
              (p >= currentPage - 1 && p <= currentPage + 1)
            ) {
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-colors ${
                    currentPage === p
                      ? "bg-emerald-500 text-gp-ink-950 font-bold border border-emerald-400"
                      : "bg-gp-ink-850 border border-gp-ink-700 text-gp-ink-300 hover:text-white hover:border-gp-ink-600"
                  }`}
                >
                  {p}
                </button>
              );
            }

            // Ellipsis
            if (p === currentPage - 2 || p === currentPage + 2) {
              return (
                <span key={p} className="px-1 text-gp-ink-500 font-mono">
                  …
                </span>
              );
            }

            return null;
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => {
            onPageChange(Math.min(totalPages, currentPage + 1));
          }}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-xl bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-200 hover:text-white hover:bg-gp-ink-700 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 font-semibold"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
