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
      <div className="flex items-center justify-between border-b border-[#2f2f2f] pb-2 text-xs text-[#9b9a97]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#e0e0e0] flex items-center gap-1.5">
            <span>KUALITAS AFTERSALES / BRAND</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#9b9a97]">
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
                  className={`text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
                    column.color === "green"
                      ? "bg-[#203c2b] text-[#52ba69]"
                      : column.color === "orange"
                      ? "bg-[#442c1d] text-[#e07936]"
                      : column.color === "red"
                      ? "bg-[#492224] text-[#eb5757]"
                      : "bg-[#2f2f2f] text-[#9b9a97]"
                  }`}
                >
                  {column.title}
                </span>
                <span className="text-xs text-[#9b9a97] font-mono">
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
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer shadow-sm ${
                        isSelected
                          ? "bg-[#182638] border-[#2383e2] shadow-[0_0_0_1px_#2383e2]"
                          : "bg-[#202020] hover:bg-[#252525] border-[#2f2f2f] hover:border-[#3f3f3f]"
                      }`}
                    >
                      {/* Card Title & Icon */}
                      <div className="flex items-start gap-2 mb-2.5">
                        <span className="text-xs text-[#9b9a97] mt-0.5 flex-shrink-0">
                          🖥️
                        </span>
                        <h4
                          className={`text-xs font-bold leading-tight ${
                            isSelected ? "text-[#58a6ff]" : "text-[#ffffff]"
                          }`}
                        >
                          {card.title}
                        </h4>
                      </div>

                      {/* Card Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {card.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              tag.color === "green"
                                ? "bg-[#203c2b] text-[#52ba69]"
                                : tag.color === "orange"
                                ? "bg-[#442c1d] text-[#e07936]"
                                : tag.color === "blue"
                                ? "bg-[#1d354a] text-[#4d97d9]"
                                : tag.color === "red"
                                ? "bg-[#492224] text-[#eb5757]"
                                : "bg-[#2f2f2f] text-[#9b9a97]"
                            }`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>

                      {/* Contact URL Link Preview if any */}
                      {card.contactUrl && (
                        <div className="text-[10px] text-[#787774] truncate font-mono pt-1 border-t border-[#2a2a2a]">
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
