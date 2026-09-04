"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Save,
  Check,
  X,
  Sparkles,
  Table as TableIcon,
  HelpCircle,
  Eye,
  Code,
  FileText,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Palette,
  Highlighter,
  MessageSquare,
  AlertCircle,
  Info,
  CheckCircle2,
  ChevronDown,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModularTableBuilder } from "@/components/admin/modular-table-builder";
import { compressImage } from "@/lib/image-compressor";

export interface WordDocumentData {
  id?: string;
  title: string;
  category?: string;
  tags?: string[];
  isImportant?: boolean;
  content: string; // HTML or Markdown
  extraMeta?: Record<string, any>;
}

interface WordFullpageEditorProps {
  isOpen: boolean;
  documentTypeLabel?: string; // e.g. "FAQ KNOWLEDGEBASE" | "GUIDE ARTICLE" | "EDUKASI MEJA"
  initialData: WordDocumentData;
  onSave: (doc: WordDocumentData) => void;
  onClose: () => void;
}

const TEXT_COLORS = [
  { label: "Putih (Default)", value: "#ffffff" },
  { label: "Emerald (GTID Hijau)", value: "#10b981" },
  { label: "Amber (Aksen Emas)", value: "#f59e0b" },
  { label: "Cyan (Biru Langit)", value: "#06b6d4" },
  { label: "Rose (Peringatan)", value: "#f43f5e" },
  { label: "Zinc (Abu Muted)", value: "#a1a1aa" },
];

const HIGHLIGHT_COLORS = [
  { label: "Tanpa Highlight", value: "transparent" },
  { label: "Emerald Glow", value: "rgba(16, 185, 129, 0.2)" },
  { label: "Amber Glow", value: "rgba(245, 158, 11, 0.2)" },
  { label: "Cyan Glow", value: "rgba(6, 182, 212, 0.2)" },
  { label: "Rose Glow", value: "rgba(244, 63, 94, 0.2)" },
];

export function WordFullpageEditor({
  isOpen,
  documentTypeLabel = "FAQ KNOWLEDGEBASE",
  initialData,
  onSave,
  onClose,
}: WordFullpageEditorProps) {
  const [doc, setDoc] = useState<WordDocumentData>(initialData);
  const [mode, setMode] = useState<"visual" | "source" | "split">("visual");

  // Rich text editable ref
  const editableRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  // Dropdown states
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [isTableBuilderOpen, setIsTableBuilderOpen] = useState(false);

  // Image Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressingImg, setIsCompressingImg] = useState(false);

  // Sync initial content on open
  useEffect(() => {
    setDoc(initialData);
    if (editableRef.current) {
      editableRef.current.innerHTML = initialData.content || "";
    }
  }, [initialData, isOpen]);

  // Handle content updates
  const handleContentChange = useCallback(() => {
    if (!editableRef.current) return;
    isInternalUpdate.current = true;
    const html = editableRef.current.innerHTML;
    setDoc((prev) => ({ ...prev, content: html }));
  }, []);

  // Format execution
  const execCmd = (cmd: string, val: string | undefined = undefined) => {
    document.execCommand(cmd, false, val);
    editableRef.current?.focus();
    handleContentChange();
  };

  // Block format
  const formatBlock = (tag: "p" | "h1" | "h2" | "h3" | "blockquote") => {
    execCmd("formatBlock", `<${tag}>`);
    setShowHeadingMenu(false);
  };

  // Color actions
  const applyTextColor = (color: string) => {
    execCmd("foreColor", color);
    setShowColorPicker(false);
  };

  const applyHighlightColor = (bg: string) => {
    execCmd("hiliteColor", bg);
    setShowHighlightPicker(false);
  };

  // Insert Callout Box
  const insertCallout = (type: "verdict" | "note" | "warning") => {
    let icon = "💡";
    let themeClass = "border-amber-500/50 bg-amber-500/10 text-amber-300";
    let title = "GTID Tech Verdict:";
    if (type === "warning") {
      icon = "⚠️";
      themeClass = "border-rose-500/50 bg-rose-500/10 text-rose-300";
      title = "Peringatan Penting:";
    } else if (type === "note") {
      icon = "📌";
      themeClass = "border-cyan-500/50 bg-cyan-500/10 text-cyan-300";
      title = "Catatan Teknis:";
    }

    const html = `
<div class="notion-callout my-4 p-4 rounded-xl border ${themeClass} flex items-start gap-3" contenteditable="true">
  <span class="text-xl flex-shrink-0" contenteditable="false">${icon}</span>
  <div class="space-y-1 flex-1">
    <strong class="block font-bold text-sm tracking-tight">${title}</strong>
    <p class="text-xs text-zinc-300 leading-relaxed">Tulis ulasan ringkasan ulasan atau catatan penting di sini...</p>
  </div>
</div>
<p><br></p>
`;
    execCmd("insertHTML", html);
  };

  // Insert Checklist / Pros Cons
  const insertProsCons = () => {
    const html = `
<div class="my-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
  <h4 class="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">// KELEBIHAN & KEKURANGAN:</h4>
  <ul class="space-y-1.5 text-xs text-zinc-200">
    <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">☑ [PLUS]</span> <span>Keunggulan poin ulasan 1</span></li>
    <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">☑ [PLUS]</span> <span>Keunggulan poin ulasan 2</span></li>
    <li class="flex items-center gap-2"><span class="text-rose-400 font-bold">☒ [MINUS]</span> <span>Poin kekurangan atau catatan</span></li>
  </ul>
</div>
<p><br></p>
`;
    execCmd("insertHTML", html);
  };

  // Direct clipboard image paste handler
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          try {
            const compressed = await compressImage(blob, 1000, 0.82);
            const imgHtml = `<p><img src="${compressed.dataUrl}" alt="Uji Lab GTID" class="rounded-xl border border-zinc-800 max-w-full my-4 shadow-lg" /></p><p><br></p>`;
            document.execCommand("insertHTML", false, imgHtml);
            handleContentChange();
          } catch (err) {
            console.error(err);
          }
        }
        return;
      }
    }
  };

  // Handle local image file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressingImg(true);
    try {
      const res = await compressImage(file, 1200, 0.85);
      const imgHtml = `<p><img src="${res.dataUrl}" alt="Grafik Uji" class="rounded-xl border border-zinc-800 max-w-full my-4 shadow-lg" /></p><p><br></p>`;
      document.execCommand("insertHTML", false, imgHtml);
      handleContentChange();
    } catch (err) {
      console.error(err);
      alert("Gagal memproses gambar.");
    } finally {
      setIsCompressingImg(false);
    }
  };

  // Word Count Stats
  const rawText = doc.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = rawText ? rawText.split(" ").length : 0;
  const charCount = rawText.length;
  const readingTimeMin = Math.ceil(wordCount / 180);

  // Save handler
  const handleSaveClick = () => {
    let finalContent = doc.content;
    if (mode === "visual" && editableRef.current) {
      finalContent = editableRef.current.innerHTML;
    }
    onSave({
      ...doc,
      content: finalContent,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07070a] text-white flex flex-col font-sans overflow-hidden animate-in fade-in duration-200">
      {/* 1. TOP HEADER BAR */}
      <header className="h-16 px-4 sm:px-6 bg-[#0c0c11] border-b border-zinc-800 flex items-center justify-between flex-shrink-0 z-30">
        {/* Left: Back & Document Metadata */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-750 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-[2px_2px_0px_#000]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ ← KEMBALI ]</span>
          </button>

          <div className="h-5 w-[1px] bg-zinc-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold tracking-widest uppercase">
              [ {documentTypeLabel} ]
            </span>
            <span className="text-xs text-zinc-400 font-mono hidden md:inline truncate max-w-xs">
              // {doc.title || "Dokumen Baru"}
            </span>
          </div>
        </div>

        {/* Center: Live Stats & Indicator */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Word Studio Active</span>
          </span>
          <span>•</span>
          <span>{wordCount} Kata</span>
          <span>•</span>
          <span>{charCount} Karakter</span>
          <span>•</span>
          <span>±{readingTimeMin} mnt baca</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs border-zinc-700 hover:bg-zinc-900 text-zinc-300"
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="cyber"
            size="sm"
            onClick={handleSaveClick}
            className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Save className="w-3.5 h-3.5" />
            <span>[ 💾 SIMPAN DOKUMEN ]</span>
          </Button>
        </div>
      </header>

      {/* 2. FIXED MICROSOFT WORD / GOOGLE DOCS TOOLBAR RIBBON */}
      <div className="bg-[#0e0e14] border-b-2 border-zinc-800 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 flex-wrap flex-shrink-0 z-20 shadow-md">
        {/* Ribbon Left: Formatting Tools */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Paragraph Style Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHeadingMenu(!showHeadingMenu)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-xs font-semibold text-zinc-200 flex items-center gap-1.5"
            >
              <span>Gaya Teks</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showHeadingMenu && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-[#14141c] border border-zinc-700 rounded-xl shadow-2xl py-1 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => formatBlock("p")}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300"
                >
                  Normal Text (Paragraf)
                </button>
                <button
                  type="button"
                  onClick={() => formatBlock("h1")}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-white font-bold text-sm"
                >
                  Judul Utama (H1)
                </button>
                <button
                  type="button"
                  onClick={() => formatBlock("h2")}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-emerald-400 font-bold"
                >
                  Sub Judul (H2)
                </button>
                <button
                  type="button"
                  onClick={() => formatBlock("h3")}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-cyan-400 font-bold text-xs"
                >
                  Seksi Kecil (H3)
                </button>
                <button
                  type="button"
                  onClick={() => formatBlock("blockquote")}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-amber-400 italic"
                >
                  Kutipan (Quote)
                </button>
              </div>
            )}
          </div>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

          {/* Inline Styling: B, I, U, S */}
          <button
            type="button"
            onClick={() => execCmd("bold")}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Tebal (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("italic")}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Miring (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("underline")}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Garis Bawah (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("strikeThrough")}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Coret"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

          {/* Color Pickers */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-emerald-400"
              title="Warna Teks"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-[#14141c] border border-zinc-700 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => applyTextColor(c.value)}
                    className="flex items-center gap-2 w-full px-2.5 py-1 rounded text-xs hover:bg-zinc-800 text-left"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-zinc-600"
                      style={{ backgroundColor: c.value }}
                    />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHighlightPicker(!showHighlightPicker)}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-amber-400"
              title="Highlight Teks"
            >
              <Highlighter className="w-3.5 h-3.5" />
            </button>
            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1 bg-[#14141c] border border-zinc-700 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                {HIGHLIGHT_COLORS.map((h) => (
                  <button
                    key={h.value}
                    type="button"
                    onClick={() => applyHighlightColor(h.value)}
                    className="flex items-center gap-2 w-full px-2.5 py-1 rounded text-xs hover:bg-zinc-800 text-left"
                  >
                    <span
                      className="w-3 h-3 rounded border border-zinc-600"
                      style={{ backgroundColor: h.value }}
                    />
                    <span>{h.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => execCmd("insertUnorderedList")}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("insertOrderedList")}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

          {/* Inserts: Callout, Modular Table, Images */}
          <button
            type="button"
            onClick={() => insertCallout("verdict")}
            className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1"
            title="Sisipkan Callout Box Verdict"
          >
            <span>💡 + Callout</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTableBuilderOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm"
            title="Buka Pembangun Tabel Modular Berhierarki"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>+ Modular Tabel</span>
          </button>

          <button
            type="button"
            onClick={() => insertProsCons()}
            className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 text-xs font-semibold flex items-center gap-1"
            title="Daftar Plus Minus"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Plus/Minus</span>
          </button>

          {/* Local Upload Image */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isCompressingImg}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Unggah Gambar Uji Lab"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Ribbon Right: View Mode Toggle */}
        <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-0.5 rounded-lg text-xs font-mono">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === "visual"
                ? "bg-emerald-500 text-black font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Visual (Word)
          </button>
          <button
            type="button"
            onClick={() => setMode("source")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === "source"
                ? "bg-emerald-500 text-black font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            HTML / Source
          </button>
        </div>
      </div>

      {/* 3. MAIN SCROLLABLE DOCUMENT WORKSPACE */}
      <div className="flex-1 overflow-y-auto bg-[#07070a] p-4 sm:p-8 flex justify-center">
        {/* Document Paper Container */}
        <div className="w-full max-w-4xl bg-[#0c0c11] border-2 border-zinc-800 rounded-2xl shadow-[6px_6px_0px_#000] p-6 sm:p-12 my-auto flex flex-col space-y-6">
          {/* Document Title Input */}
          <div className="space-y-3 pb-5 border-b border-zinc-800">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                // JUDUL DOKUMEN / PERTANYAAN:
              </span>
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={doc.isImportant || false}
                  onChange={(e) => setDoc({ ...doc, isImportant: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-900 text-emerald-500"
                />
                <span>Highlight / Rekomendasi Utama</span>
              </label>
            </div>

            <input
              type="text"
              required
              value={doc.title}
              onChange={(e) => setDoc({ ...doc, title: e.target.value })}
              placeholder="Ketik judul pertanyaan FAQ atau artikel ulasan di sini..."
              className="w-full bg-transparent text-xl sm:text-2xl font-black text-white placeholder-zinc-600 focus:outline-none tracking-tight leading-snug"
            />

            {/* Category Strip */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">
                KATEGORI:
              </span>
              <input
                type="text"
                value={doc.category || ""}
                onChange={(e) => setDoc({ ...doc, category: e.target.value })}
                placeholder="Misal: Refresh Rate, Ergonomi, Panel..."
                className="bg-zinc-900 border border-zinc-750 px-2.5 py-1 rounded-md text-xs text-emerald-400 font-mono font-semibold focus:outline-none focus:border-emerald-500 w-64"
              />
            </div>
          </div>

          {/* Canvas Body (Visual vs Source Mode) */}
          <div className="flex-1 min-h-[420px]">
            {mode === "visual" ? (
              <div
                ref={editableRef}
                contentEditable
                onInput={handleContentChange}
                onPaste={handlePaste}
                className="prose prose-invert max-w-none min-h-[420px] focus:outline-none text-zinc-200 text-sm sm:text-base leading-relaxed space-y-4"
              />
            ) : (
              <textarea
                value={doc.content}
                onChange={(e) => {
                  const val = e.target.value;
                  setDoc((prev) => ({ ...prev, content: val }));
                  if (editableRef.current) editableRef.current.innerHTML = val;
                }}
                className="w-full h-full min-h-[420px] bg-zinc-950 font-mono text-xs text-emerald-300 p-4 rounded-xl border border-zinc-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                placeholder="Sumber HTML / Markdown..."
              />
            )}
          </div>

          {/* Footer tips */}
          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>💡 Tips: Tekan Ctrl+V untuk paste screenshot grafik ulasan lab secara langsung.</span>
            <span>GrayPlasma Word Studio</span>
          </div>
        </div>
      </div>

      {/* Modular Table Builder Modal */}
      <ModularTableBuilder
        isOpen={isTableBuilderOpen}
        onClose={() => setIsTableBuilderOpen(false)}
        onInsertTable={(tableHtml) => {
          execCmd("insertHTML", tableHtml);
        }}
        initialPreset={
          documentTypeLabel.toLowerCase().includes("meja") ? "desk" : "monitor"
        }
      />
    </div>
  );
}
