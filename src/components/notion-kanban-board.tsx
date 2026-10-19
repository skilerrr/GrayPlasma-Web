"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Plus,
  Tv,
} from "lucide-react";

export interface NotionBoardCard {
  id: string;
  title: string;
  columnId: string;
  tags: { label: string; color: "green" | "orange" | "blue" | "red" | "gray" }[];
  contactUrl?: string;
  phoneNumber?: string;
  sistemKlaim?: string;
  createdDate?: string;
  pros?: string[];
  cons?: string[];
  deepDiveTitle?: string;
  deepDiveNote?: string;
  discordUrl?: string;
}

export interface NotionBoardColumn {
  id: string;
  title: string;
  color: "green" | "gray" | "orange" | "red";
  count: number;
}

interface NotionKanbanBoardProps {
  columns: NotionBoardColumn[];
  cards: NotionBoardCard[];
  selectedCardId?: string | null;
  onSelectCard: (card: NotionBoardCard) => void;
}

export function NotionKanbanBoard({
  columns,
  cards,
  selectedCardId,
  onSelectCard,
}: NotionKanbanBoardProps) {
  return (
    <div className="space-y-4">
      {/* Notion Board Header Toolbar */}
      <div className="flex items-center justify-between border-b border-gp-ink-650 pb-2 text-xs text-gp-ink-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gp-ink-100 flex items-center gap-1.5">
            <span>KUALITAS AFTERSALES / BRAND</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gp-ink-300">
          <button className="hover:text-white flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="hover:text-white flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort</span>
          </button>
          <button className="hover:text-white flex items-center gap-1">
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notion Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const colCards = cards.filter((c) => c.columnId === column.id);

          return (
            <div key={column.id} className="space-y-3 min-w-[280px]">
              {/* Column Header Pill */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xs font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
                    column.color === "green"
                      ? "bg-gp-mint-900 text-gp-mint"
                      : column.color === "orange"
                      ? "bg-gp-ember-400 text-gp-ember"
                      : column.color === "red"
                      ? "bg-gp-coral-800 text-gp-coral"
                      : "bg-gp-ink-650 text-gp-ink-300"
                  }`}
                >
                  {column.title}
                </span>
                <span className="text-xs text-gp-ink-300 font-mono">
                  {colCards.length}
                </span>
              </div>

              {/* Cards List in this Column */}
              <div className="space-y-2.5">
                {colCards.map((card) => {
                  const isSelected = selectedCardId === card.id;

                  return (
                    <div
                      key={card.id}
                      onClick={() => onSelectCard(card)}
                      className={`p-3.5 rounded-lg border transition-colors cursor-pointer shadow-tech-card ${
                        isSelected
                          ? "bg-gp-ink-800 border-gp-ink-400"
                          : "bg-gp-ink-750 hover:bg-gp-ink-700 border-gp-ink-650 hover:border-gp-ink-600"
                      }`}
                    >
                      {/* Card Title & Icon */}
                      <div className="flex items-start gap-2 mb-2.5">
                        <span className="text-gp-ink-300 mt-0.5 flex-shrink-0">
                          <Tv className="w-3.5 h-3.5" />
                        </span>
                        <h4
                          className={`text-xs font-bold leading-tight ${
                            isSelected ? "text-orange-400" : "text-white"
                          }`}
                        >
                          {card.title}
                        </h4>
                      </div>

                      {/* Card Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {(card.tags ?? []).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-3xs font-semibold px-2 py-0.5 rounded ${
                              tag.color === "green"
                                ? "bg-gp-mint-900 text-gp-mint"
                                : tag.color === "orange"
                                ? "bg-gp-ember-400 text-gp-ember"
                                : tag.color === "blue"
                                ? "bg-gp-sky-600 text-gp-sky-100"
                                : tag.color === "red"
                                ? "bg-gp-coral-800 text-gp-coral"
                                : "bg-gp-ink-650 text-gp-ink-300"
                            }`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>

                      {/* Contact URL Link Preview if any */}
                      {card.contactUrl && (
                        <div className="text-3xs text-gp-ink-400 truncate font-mono pt-1 border-t border-gp-ink-700">
                          {card.contactUrl}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
