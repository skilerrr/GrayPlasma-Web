"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Minus,
  Table as TableIcon,
  AlertTriangle,
  Sparkles,
  Image as ImageIcon,
  Columns,
  Eye,
  Edit3,
  Copy,
  Check,
  Upload,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Highlighter,
  Undo2,
  Redo2,
  Plus,
  Trash2,
  ChevronDown,
  X,
  Type,
} from "lucide-react";
import { ModularTableBuilder } from "@/components/admin/modular-table-builder";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";
import { compressImage } from "@/lib/image-compressor";
import { Button } from "@/components/ui/button";

interface NotionRichEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  minHeight?: string;
  placeholder?: string;
  allowImageUpload?: boolean;
}

const TEXT_COLORS = [
  { name: "Default", color: "#ededed" },
  { name: "Abu-Abu", color: "#9b9a97" },
  { name: "Kuning", color: "#f59e0b" },
  { name: "Hijau Neon", color: "#10b981" },
  { name: "Biru", color: "#38bdf8" },
  { name: "Ungu", color: "#c084fc" },
  { name: "Merah Crimson", color: "#ef4444" },
  { name: "Oranye", color: "#f97316" },
  { name: "Pink", color: "#ec4899" },
];

const HIGHLIGHT_COLORS = [
  { name: "Tanpa Sorotan", bg: "transparent", border: "transparent" },
  { name: "Kuning", bg: "rgba(245, 158, 11, 0.25)", border: "rgba(245, 158, 11, 0.5)" },
  { name: "Hijau", bg: "rgba(16, 185, 129, 0.25)", border: "rgba(16, 185, 129, 0.5)" },
  { name: "Biru", bg: "rgba(56, 189, 248, 0.25)", border: "rgba(56, 189, 248, 0.5)" },
  { name: "Ungu", bg: "rgba(192, 132, 252, 0.25)", border: "rgba(192, 132, 252, 0.5)" },
  { name: "Merah", bg: "rgba(239, 68, 68, 0.25)", border: "rgba(239, 68, 68, 0.5)" },
];

const CALLOUT_ICONS = ["💡", "⚠️", "🛡️", "📌", "🚀", "❓", "🎨", "🖥️", "🛒", "🔥"];
const CALLOUT_THEMES = [
  { id: "amber", name: "Amber (Penting)", class: "notion-callout-amber" },
  { id: "emerald", name: "Emerald (Rekomendasi)", class: "notion-callout-emerald" },
  { id: "cyan", name: "Cyan (Lab Info)", class: "notion-callout-cyan" },
  { id: "crimson", name: "Crimson (Peringatan)", class: "notion-callout-crimson" },
  { id: "purple", name: "Purple (Flagship)", class: "notion-callout-purple" },
];

export function NotionRichEditor({
  value,
  onChange,
  minHeight = "min-h-[320px]",
  placeholder = "Ketik ulasan atau catatan di sini... (Ketik '/' untuk menu cepat Notion)",
  allowImageUpload = true,
}: NotionRichEditorProps) {
  const [viewMode, setViewMode] = useState<"visual" | "code" | "preview">("visual");
  const [isCompressing, setIsCompressing] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Popups & Palettes
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showCalloutModal, setShowCalloutModal] = useState(false);
  const [selectedCalloutIcon, setSelectedCalloutIcon] = useState("💡");
  const [selectedCalloutTheme, setSelectedCalloutTheme] = useState("amber");
  const [calloutText, setCalloutText] = useState("");
  const [isModularTableOpen, setIsModularTableOpen] = useState(false);

  // Slash command
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });

  // Floating Selection Bubble
  const [bubblePos, setBubblePos] = useState<{ top: number; left: number; visible: boolean }>({
    top: 0,
    left: 0,
    visible: false,
  });

  const editableRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInternalUpdate = useRef(false);

  // Format initial content if it's pure markdown into HTML for contentEditable
  const convertInitialContent = useCallback((raw: string): string => {
    if (!raw) return "<p><br></p>";
    // If already contains HTML paragraph or tags, return as is
    if (/<\s*(p|h[1-6]|div|table|ul|ol|blockquote)\b[^>]*>/i.test(raw)) {
      return raw;
    }
    // Simple conversion of basic markdown lines to HTML
    return raw
      .split("\n")
      .map((line) => {
        if (!line.trim()) return "<p><br></p>";
        if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
        if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
        if (line.startsWith("### ")) return `<h3>${line.slice(4)}</h3>`;
        if (line.startsWith("> ")) return `<blockquote>${line.slice(2)}</blockquote>`;
        if (line.startsWith("- ")) return `<ul><li>${line.slice(2)}</li></ul>`;
        if (line === "---") return "<hr>";
        return `<p>${line}</p>`;
      })
      .join("");
  }, []);

  // Sync external value to contentEditable when not editing internally
  useEffect(() => {
    if (editableRef.current && !isInternalUpdate.current) {
      const targetHtml = convertInitialContent(value);
      if (editableRef.current.innerHTML !== targetHtml) {
        editableRef.current.innerHTML = targetHtml;
      }
    }
    isInternalUpdate.current = false;
  }, [value, convertInitialContent]);

  // Handle content changes
  const handleContentChange = () => {
    if (!editableRef.current) return;
    isInternalUpdate.current = true;
    const html = editableRef.current.innerHTML;
    onChange(html);
  };

  // Execute standard formatting commands
  const execCmd = (cmd: string, val: string | undefined = undefined) => {
    document.execCommand(cmd, false, val);
    editableRef.current?.focus();
    handleContentChange();
  };

  // Block format
  const formatBlock = (tag: "p" | "h1" | "h2" | "h3" | "blockquote" | "pre") => {
    execCmd("formatBlock", `<${tag}>`);
  };

  // Color actions
  const applyTextColor = (color: string) => {
    execCmd("foreColor", color);
    setShowTextColorPicker(false);
  };

  const applyHighlightColor = (bg: string) => {
    execCmd("hiliteColor", bg);
    setShowHighlightPicker(false);
  };

  // Insert Custom Callout Block
  const insertCallout = () => {
    if (!editableRef.current) return;
    const themeObj = CALLOUT_THEMES.find((t) => t.id === selectedCalloutTheme) || CALLOUT_THEMES[0];
    const calloutHtml = `
      <div class="notion-callout ${themeObj.class}" contenteditable="true">
        <span class="notion-callout-icon" contenteditable="false">${selectedCalloutIcon}</span>
        <div class="notion-callout-body">
          <p>${calloutText || "Tulis catatan penting di sini..."}</p>
        </div>
      </div>
      <p><br></p>
    `;
    document.execCommand("insertHTML", false, calloutHtml);
    handleContentChange();
    setShowCalloutModal(false);
    setCalloutText("");
  };

  // Insert Table Block
  const insertTable = () => {
    const tableHtml = `
      <table class="notion-visual-table" border="1">
        <thead>
          <tr>
            <th>Parameter / Fitur</th>
            <th>Hasil Uji Lab GTID</th>
            <th>Verdict / Catatan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Response Time (GtG)</td>
            <td>5.2ms (Toleransi 5 RGB)</td>
            <td>Motion clarity sangat tajam</td>
          </tr>
          <tr>
            <td>Akurasi Warna</td>
            <td>deITP < 4.5</td>
            <td>Warna natural tanpa kalibrasi ulang</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `;
    document.execCommand("insertHTML", false, tableHtml);
    handleContentChange();
  };

  // Table Helpers: Add Row
  const addTableRow = () => {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;
    const node = selection.anchorNode instanceof HTMLElement ? selection.anchorNode : selection.anchorNode.parentElement;
    const table = node?.closest("table");
    if (!table) {
      alert("Letakkan kursor di dalam tabel terlebih dahulu!");
      return;
    }
    const tbody = table.querySelector("tbody") || table;
    const sampleRow = tbody.querySelector("tr");
    const colCount = sampleRow ? sampleRow.children.length : 3;
    const newRow = document.createElement("tr");
    for (let i = 0; i < colCount; i++) {
      const td = document.createElement("td");
      td.innerHTML = "Isi data...";
      newRow.appendChild(td);
    }
    tbody.appendChild(newRow);
    handleContentChange();
  };

  // Table Helpers: Add Column
  const addTableColumn = () => {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;
    const node = selection.anchorNode instanceof HTMLElement ? selection.anchorNode : selection.anchorNode.parentElement;
    const table = node?.closest("table");
    if (!table) {
      alert("Letakkan kursor di dalam tabel terlebih dahulu!");
      return;
    }
    const ths = table.querySelectorAll("thead tr");
    ths.forEach((tr) => {
      const th = document.createElement("th");
      th.innerHTML = "Kolom Baru";
      tr.appendChild(th);
    });
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((tr) => {
      const td = document.createElement("td");
      td.innerHTML = "-";
      tr.appendChild(td);
    });
    handleContentChange();
  };

  // Insert Checklist Item
  const insertChecklist = () => {
    const taskHtml = `
      <ul class="notion-task-list">
        <li>
          <input type="checkbox" />
          <span>Langkah atau verifikasi checklist baru</span>
        </li>
      </ul>
      <p><br></p>
    `;
    document.execCommand("insertHTML", false, taskHtml);
    handleContentChange();
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressed = await compressImage(file, 1200, 0.82);
      const imgHtml = `
        <div style="text-align: center; margin: 1.25rem 0;">
          <img src="${compressed.dataUrl}" alt="${file.name.replace(/\.[^/.]+$/, "")}" style="max-width: 100%; border-radius: 0.875rem; border: 1px solid #27272a; display: inline-block;" />
          <p style="font-size: 0.75rem; color: #71717a; font-style: italic; margin-top: 0.35rem;">${file.name}</p>
        </div>
        <p><br></p>
      `;
      document.execCommand("insertHTML", false, imgHtml);
      handleContentChange();
    } catch (err) {
      console.error("Gagal kompres gambar", err);
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Floating Bubble & Slash Command Detection
  const handleKeyUp = (e: React.KeyboardEvent) => {
    handleContentChange();

    // 1. Detect Slash Command '/'
    if (e.key === "/") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0).cloneRange();
        const rect = range.getBoundingClientRect();
        setSlashMenuPos({
          top: rect.bottom + window.scrollY + 8,
          left: Math.max(16, rect.left + window.scrollX),
        });
        setShowSlashMenu(true);
      }
    } else if (e.key === "Escape" || e.key === "Enter") {
      setShowSlashMenu(false);
    }

    // 2. Detect text selection for Floating Bubble
    updateBubblePosition();
  };

  const updateBubblePosition = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setBubblePos((prev) => ({ ...prev, visible: false }));
      return;
    }
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0) {
      setBubblePos((prev) => ({ ...prev, visible: false }));
      return;
    }
    setBubblePos({
      top: rect.top - 48,
      left: Math.max(16, rect.left + rect.width / 2 - 140),
      visible: true,
    });
  };

  const copyDiscordFormatted = () => {
    if (!editableRef.current) return;
    const plain = editableRef.current.innerText.substring(0, 1900);
    navigator.clipboard.writeText(plain);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="border border-zinc-800 rounded-2xl bg-zinc-950 overflow-hidden flex flex-col relative shadow-xl font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP WORD/NOTION RIBBON TOOLBAR                                         */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#121216] border-b border-zinc-800 text-xs select-none">
        {/* Left Formatting Tools */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings Dropdown */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 mr-1">
            <button
              type="button"
              onClick={() => formatBlock("p")}
              title="Normal Paragraph"
              className="px-2 py-1 rounded text-[11px] font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => formatBlock("h1")}
              title="Heading 1"
              className="p-1.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <Heading1 className="w-3.5 h-3.5 text-cyan-400" />
            </button>
            <button
              type="button"
              onClick={() => formatBlock("h2")}
              title="Heading 2"
              className="p-1.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <Heading2 className="w-3.5 h-3.5 text-blue-400" />
            </button>
            <button
              type="button"
              onClick={() => formatBlock("h3")}
              title="Heading 3"
              className="p-1.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <Heading3 className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />

          {/* Inline Text Styling (Word Pure) */}
          <button
            type="button"
            onClick={() => execCmd("bold")}
            title="Tebal / Bold (Ctrl+B)"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-200 hover:text-white"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("italic")}
            title="Miring / Italic (Ctrl+I)"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-200 hover:text-white"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("underline")}
            title="Garis Bawah / Underline (Ctrl+U)"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-200 hover:text-white"
          >
            <UnderlineIcon className="w-3.5 h-3.5 text-emerald-400" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("strikeThrough")}
            title="Coret / Strikethrough"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />

          {/* Text Color Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowTextColorPicker(!showTextColorPicker);
                setShowHighlightPicker(false);
              }}
              title="Warna Teks"
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-0.5"
            >
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            {showTextColorPicker && (
              <div className="absolute top-full left-0 mt-1.5 bg-[#18181f] border border-zinc-700 rounded-xl p-2 z-50 shadow-2xl w-44 space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 px-1 block uppercase tracking-wider">
                  Warna Teks
                </span>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => applyTextColor(c.color)}
                      className="p-1.5 rounded-lg hover:bg-zinc-800 flex items-center gap-1 text-[11px] text-zinc-300"
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Background Highlight Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowTextColorPicker(false);
              }}
              title="Sorotan Background (Highlight)"
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-0.5"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-400" />
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1.5 bg-[#18181f] border border-zinc-700 rounded-xl p-2 z-50 shadow-2xl w-44 space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 px-1 block uppercase tracking-wider">
                  Sorotan Teks
                </span>
                <div className="grid grid-cols-2 gap-1 pt-1">
                  {HIGHLIGHT_COLORS.map((h) => (
                    <button
                      key={h.name}
                      type="button"
                      onClick={() => applyHighlightColor(h.bg)}
                      className="p-1.5 rounded-lg hover:bg-zinc-800 flex items-center gap-1.5 text-[11px] text-zinc-300"
                    >
                      <span
                        className="w-3 h-3 rounded border flex-shrink-0"
                        style={{ backgroundColor: h.bg, borderColor: h.border }}
                      />
                      <span className="truncate">{h.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />

          {/* Lists & Alignment */}
          <button
            type="button"
            onClick={() => execCmd("insertUnorderedList")}
            title="Bulleted List"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("insertOrderedList")}
            title="Numbered List"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={insertChecklist}
            title="Checklist / Task List"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />

          {/* Notion Callout Box Button */}
          <button
            type="button"
            onClick={() => setShowCalloutModal(true)}
            title="Sisipkan Notion Callout Box"
            className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-[11px] font-bold flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>+ Callout</span>
          </button>

          {/* Visual Table Builder Button */}
          <button
            type="button"
            onClick={() => setIsModularTableOpen(true)}
            title="Buka Pembangun Tabel Modular - Buat Kolom & Baris Bebas"
            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 text-[11px] font-bold flex items-center gap-1.5 shadow-sm"
          >
            <TableIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Tabel Modular</span>
          </button>

          {/* Quote & Code Blocks */}
          <button
            type="button"
            onClick={() => formatBlock("blockquote")}
            title="Quote Block"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-blue-400 hover:text-blue-300"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => formatBlock("pre")}
            title="Code Block"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("insertHorizontalRule")}
            title="Divider Line"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Image Upload */}
          {allowImageUpload && (
            <label
              title="Sisipkan Foto (Otomatis WebP Ringan)"
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-pink-400 hover:text-pink-300 cursor-pointer flex items-center gap-1"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}

          {/* Hyperlink */}
          <button
            type="button"
            onClick={() => {
              const url = prompt("Masukkan Link URL (misal: https://tokopedia.com):");
              if (url) execCmd("createLink", url);
            }}
            title="Sisipkan Link (URL)"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-sky-400 hover:text-sky-300"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Tools: Undo/Redo, Discord, View Mode Switcher */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => execCmd("undo")}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("redo")}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={copyDiscordFormatted}
            title="Salin Teks Bersih untuk Discord"
            className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold flex items-center gap-1"
          >
            {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-violet-400" />}
            <span className="hidden sm:inline">Discord</span>
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("visual")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                viewMode === "visual"
                  ? "bg-emerald-500 text-black font-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Visual Mode (Pure Word/Notion WYSIWYG)"
            >
              Visual
            </button>
            <button
              type="button"
              onClick={() => setViewMode("code")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                viewMode === "code" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
              }`}
              title="Source Code / HTML / Markdown"
            >
              Source
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                viewMode === "preview" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
              }`}
              title="Tampilan Akhir di Sisi Pengunjung"
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CALLOUT INSERTION MODAL                                                */}
      {/* ========================================================================= */}
      {showCalloutModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Buat Notion Callout Box</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCalloutModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Icon Selector */}
              <div>
                <label className="text-zinc-400 block mb-1.5 font-semibold">Pilih Icon Emoji:</label>
                <div className="flex flex-wrap gap-1.5">
                  {CALLOUT_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedCalloutIcon(icon)}
                      className={`text-lg p-1.5 rounded-xl border transition-all ${
                        selectedCalloutIcon === icon
                          ? "bg-zinc-800 border-amber-500 scale-110 shadow-sm"
                          : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Tint Selector */}
              <div>
                <label className="text-zinc-400 block mb-1.5 font-semibold">Aksen Warna Box:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CALLOUT_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedCalloutTheme(theme.id)}
                      className={`p-2 rounded-xl border text-left text-[11px] font-bold transition-all ${
                        selectedCalloutTheme === theme.id
                          ? "border-white bg-zinc-800 text-white"
                          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Isi Catatan Callout:</label>
                <textarea
                  rows={3}
                  value={calloutText}
                  onChange={(e) => setCalloutText(e.target.value)}
                  placeholder="Contoh: Overdrive level Extreme memicu overshoot 24%. Disarankan tetap di Normal."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 leading-relaxed text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCalloutModal(false)}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="cyber"
                  size="sm"
                  onClick={insertCallout}
                  className="font-bold bg-amber-500 hover:bg-amber-400 text-black"
                >
                  Sisipkan ke Dokumen
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FLOATING BUBBLE TOOLBAR (SELECTION)                                     */}
      {/* ========================================================================= */}
      {bubblePos.visible && viewMode === "visual" && (
        <div
          style={{ top: `${bubblePos.top}px`, left: `${bubblePos.left}px` }}
          className="fixed z-50 bg-[#18181f]/95 backdrop-blur-md border border-zinc-700 rounded-xl px-2 py-1 flex items-center gap-1 shadow-2xl animate-in fade-in zoom-in-95"
        >
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd("bold");
            }}
            title="Bold"
            className="p-1 rounded hover:bg-zinc-800 text-white"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd("italic");
            }}
            title="Italic"
            className="p-1 rounded hover:bg-zinc-800 text-white"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd("underline");
            }}
            title="Underline"
            className="p-1 rounded hover:bg-zinc-800 text-emerald-400"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd("strikeThrough");
            }}
            title="Strikethrough"
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3 bg-zinc-700 mx-0.5" />
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              applyHighlightColor("rgba(245, 158, 11, 0.25)");
            }}
            title="Yellow Highlight"
            className="p-1 rounded hover:bg-zinc-800 text-amber-400"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. NOTION SLASH COMMAND DROPDOWN ('/')                                     */}
      {/* ========================================================================= */}
      {showSlashMenu && viewMode === "visual" && (
        <div
          style={{ top: `${slashMenuPos.top}px`, left: `${slashMenuPos.left}px` }}
          className="fixed z-50 bg-[#18181f] border border-zinc-700 rounded-2xl p-2 w-64 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 text-xs"
        >
          <div className="px-2 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
            Blok Konten Dasar
          </div>
          <button
            type="button"
            onClick={() => {
              formatBlock("h1");
              setShowSlashMenu(false);
            }}
            className="w-full text-left p-1.5 rounded-lg hover:bg-zinc-800 flex items-center gap-2 text-white"
          >
            <Heading1 className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="font-bold block">Heading 1</span>
              <span className="text-[10px] text-zinc-400">Judul bab utama</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              formatBlock("h2");
              setShowSlashMenu(false);
            }}
            className="w-full text-left p-1.5 rounded-lg hover:bg-zinc-800 flex items-center gap-2 text-white"
          >
            <Heading2 className="w-4 h-4 text-blue-400" />
            <div>
              <span className="font-bold block">Heading 2</span>
              <span className="text-[10px] text-zinc-400">Subjudul section</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              formatBlock("h3");
              setShowSlashMenu(false);
            }}
            className="w-full text-left p-1.5 rounded-lg hover:bg-zinc-800 flex items-center gap-2 text-white"
          >
            <Heading3 className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="font-bold block">Heading 3</span>
              <span className="text-[10px] text-zinc-400">Poin sub-section</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              execCmd("insertUnorderedList");
              setShowSlashMenu(false);
            }}
            className="w-full text-left p-1.5 rounded-lg hover:bg-zinc-800 flex items-center gap-2 text-white"
          >
            <List className="w-4 h-4 text-zinc-300" />
            <div>
              <span className="font-bold block">Bulleted List</span>
              <span className="text-[10px] text-zinc-400">Daftar butir biasa</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              insertChecklist();
              setShowSlashMenu(false);
            }}
            className="w-full text-left p-1.5 rounded-lg hover:bg-zinc-800 flex items-center gap-2 text-emerald-400"
          >
            <CheckSquare className="w-4 h-4" />
            <div>
              <span className="font-bold block">Checklist Task</span>
              <span className="text-[10px] text-zinc-400">Daftar ceklist centang</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowSlashMenu(false);
              setShowCalloutModal(true);
            }}
            className="w-full text-left p-1.5 rounded-lg hover:bg-zinc-800 flex items-center gap-2 text-amber-400"
          >
            <AlertTriangle className="w-4 h-4" />
            <div>
              <span className="font-bold block">Notion Callout</span>
              <span className="text-[10px] text-zinc-400">Kotak peringatan / highlight</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              insertTable();
              setShowSlashMenu(false);
            }}
            className="w-full text-left p-1.5 rounded-lg hover:bg-zinc-800 flex items-center gap-2 text-emerald-400"
          >
            <TableIcon className="w-4 h-4" />
            <div>
              <span className="font-bold block">Visual Table</span>
              <span className="text-[10px] text-zinc-400">Tabel data interaktif</span>
            </div>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MAIN EDITING SURFACE (CONTENTEDITABLE / SOURCE / PREVIEW)              */}
      {/* ========================================================================= */}
      {viewMode === "visual" && (
        <div className="p-3 sm:p-4 bg-[#09090e] min-h-[260px] overflow-y-auto relative">
          {/* Visual Placeholder when content is empty */}
          {(!value || value === "<p><br></p>" || value.trim() === "") && (
            <div className="absolute top-7 left-7 pointer-events-none text-xs text-zinc-500 font-sans select-none">
              {placeholder}
            </div>
          )}
          <div
            ref={editableRef}
            contentEditable
            onInput={handleContentChange}
            onKeyUp={handleKeyUp}
            onMouseUp={updateBubblePosition}
            data-placeholder={placeholder}
            className={`notion-prose focus:outline-none w-full leading-relaxed p-4 rounded-xl bg-[#0e0e14] border border-zinc-750 focus:border-zinc-600 text-zinc-200 transition-colors shadow-inner ${minHeight}`}
            style={{ minHeight: "220px" }}
          />
        </div>
      )}

      {viewMode === "code" && (
        <div className="p-3 bg-[#09090e] flex flex-col">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ketik kode HTML / Markdown mentah di sini..."
            className={`w-full bg-[#0e0e14] border border-zinc-750 rounded-xl text-emerald-400 text-xs font-mono leading-relaxed p-3 focus:outline-none focus:border-emerald-500 resize-y ${minHeight}`}
          />
        </div>
      )}

      {viewMode === "preview" && (
        <div className={`p-5 sm:p-7 bg-[#09090e] overflow-y-auto max-h-[600px] ${minHeight}`}>
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-zinc-750">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Rendered Notion View (Sisi Pengunjung)</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {value.length} karakter
            </span>
          </div>
          {value.trim() ? (
            <div className="p-4 rounded-xl bg-[#0e0e14] border border-zinc-800">
              <NotionBlockRenderer content={value} />
            </div>
          ) : (
            <div className="text-zinc-500 text-xs italic py-8 text-center bg-[#0e0e14] rounded-xl border border-zinc-800">
              Belum ada konten untuk ditampilkan.
            </div>
          )}
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="px-4 py-2.5 bg-[#0e0e14] border-t border-zinc-750 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <div className="flex items-center gap-3">
          <span>Mode: <strong className="text-zinc-200 uppercase">{viewMode}</strong></span>
          <span>Tip: Ketik <strong>&quot;/&quot;</strong> untuk menu blok Notion</span>
        </div>
        <div>
          {isCompressing ? (
            <span className="text-pink-400 font-bold animate-pulse">Mengoptimasi WebP...</span>
          ) : (
            <span className="text-emerald-400 font-semibold">Tersinkronisasi</span>
          )}
        </div>
      </div>

      {/* Modular Table Builder Dialog */}
      <ModularTableBuilder
        isOpen={isModularTableOpen}
        onClose={() => setIsModularTableOpen(false)}
        onInsertTable={(tableHtml) => {
          editableRef.current?.focus();
          document.execCommand("insertHTML", false, tableHtml);
          handleContentChange();
        }}
        initialPreset="monitor"
      />
    </div>
  );
}
