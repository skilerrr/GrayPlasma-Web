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
  Underline as UnderlineIcon,
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
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronDown,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
  Undo2,
  Redo2,
  Columns,
  Maximize2,
  Minimize2,
  Copy,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Award,
  Layers,
  Clock,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { compressImage } from "@/lib/image-compressor";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";

export interface WordStudioDocument {
  id: string;
  title: string;
  category?: string;
  slug?: string;
  fullPath?: string;
  coverImage?: string;
  description?: string;
  content: string; // HTML or Markdown
  isImportant?: boolean; // For FAQ featured
  isPublished?: boolean; // For Guide published status
  onClickAction?: "route" | "side-panel" | "modal" | "external";
  tags?: string[];
  discordCallbackSummary?: string;
  extraMeta?: Record<string, any>;
}

export interface WordDocsStudioProps {
  isOpen: boolean;
  modeType: "faq" | "guide";
  initialData: WordStudioDocument;
  onSave: (doc: WordStudioDocument) => void;
  onClose: () => void;
  availableCategories?: string[];
}

const TEXT_COLORS = [
  { label: "Putih Standar", value: "#ededed" },
  { label: "GTID Hijau", value: "#00e676" },
  { label: "Aksen Emas", value: "#ffb300" },
  { label: "Tech Cyan", value: "#00d2ff" },
  { label: "Peringatan Merah", value: "#ff2d55" },
  { label: "Abu Muted", value: "#a1a1aa" },
];

const HIGHLIGHT_COLORS = [
  { label: "Tanpa Sorotan", value: "transparent" },
  { label: "Glow Emas", value: "rgba(255, 179, 0, 0.2)" },
  { label: "Glow Hijau", value: "rgba(0, 230, 118, 0.2)" },
  { label: "Glow Cyan", value: "rgba(0, 210, 255, 0.2)" },
  { label: "Glow Merah", value: "rgba(255, 45, 85, 0.2)" },
];

export function WordDocsStudio({
  isOpen,
  modeType,
  initialData,
  onSave,
  onClose,
  availableCategories = [],
}: WordDocsStudioProps) {
  const [doc, setDoc] = useState<WordStudioDocument>(initialData);
  const [viewMode, setViewMode] = useState<"document" | "source" | "preview">("document");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Editor references
  const editableRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedRange = useRef<Range | null>(null);

  // Dropdowns & Toolbar Popovers
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRowsInput, setTableRowsInput] = useState(3);
  const [tableColsInput, setTableColsInput] = useState(3);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const [linkTextInput, setLinkTextInput] = useState("");

  // Table In-Canvas Active Context
  const [activeTableElement, setActiveTableElement] = useState<HTMLTableElement | null>(null);
  const [activeTableCell, setActiveTableCell] = useState<HTMLTableCellElement | null>(null);

  // Image Selection Context
  const [selectedImageElement, setSelectedImageElement] = useState<HTMLImageElement | null>(null);

  // Autosave & Stats
  const [lastAutosaveTime, setLastAutosaveTime] = useState<string | null>(null);
  const [hasRestorableDraft, setHasRestorableDraft] = useState(false);
  const [isCompressingImg, setIsCompressingImg] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  // Local storage draft key
  const draftKey = `gp_draft_doc_${doc.id || doc.slug || "temp"}`;

  // Check saved draft on mount
  useEffect(() => {
    if (!isOpen) return;
    setDoc(initialData);

    if (typeof window !== "undefined") {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.content && parsed.content !== initialData.content) {
            setHasRestorableDraft(true);
          }
        } catch {
          // ignore corrupted drafts
        }
      }
    }

    if (editableRef.current) {
      editableRef.current.innerHTML = initialData.content || "<p><br></p>";
    }
  }, [initialData, isOpen, draftKey]);

  // Sync content change handler
  const handleContentChange = useCallback(() => {
    if (!editableRef.current) return;
    isInternalUpdate.current = true;
    const html = editableRef.current.innerHTML;
    setDoc((prev) => ({ ...prev, content: html }));

    // Debounced autosave
    if (typeof window !== "undefined") {
      const payload = {
        title: doc.title,
        content: html,
        timestamp: Date.now(),
      };
      localStorage.setItem(draftKey, JSON.stringify(payload));
      const now = new Date();
      setLastAutosaveTime(
        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
      );
    }
  }, [doc.title, draftKey]);

  // Restore Draft
  const handleRestoreDraft = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.content) {
            setDoc((prev) => ({
              ...prev,
              content: parsed.content,
              title: parsed.title || prev.title,
            }));
            if (editableRef.current) {
              editableRef.current.innerHTML = parsed.content;
            }
            setHasRestorableDraft(false);
          }
        } catch (e) {
          console.error("Gagal membaca draft:", e);
        }
      }
    }
  };

  const handleDiscardDraft = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(draftKey);
    }
    setHasRestorableDraft(false);
  };

  // Selection Preservation Logic
  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreCurrentSelection = () => {
    if (!savedRange.current) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  // Execute formatting command without losing cursor focus
  const execFormat = (cmd: string, val: string | undefined = undefined) => {
    editableRef.current?.focus();
    restoreCurrentSelection();
    document.execCommand(cmd, false, val);
    handleContentChange();
    saveCurrentSelection();
  };

  // Block format
  const applyBlockFormat = (tag: "p" | "h1" | "h2" | "h3" | "blockquote" | "pre") => {
    execFormat("formatBlock", `<${tag}>`);
    setShowHeadingMenu(false);
  };

  // Color actions
  const applyTextColor = (color: string) => {
    execFormat("foreColor", color);
    setShowColorPicker(false);
  };

  const applyHighlightColor = (bg: string) => {
    execFormat("hiliteColor", bg);
    setShowHighlightPicker(false);
  };

  // Insert GTID Callout Card
  const insertGtidCallout = (type: "verdict" | "note" | "warning" | "recommendation") => {
    let iconLabel = "[VERDICT GTID]";
    let titleText = "GTID Tech Verdict:";
    let borderTheme = "border-amber-500/40 bg-amber-500/5 text-amber-300";
    let defaultText = "Tulis kesimpulan pengujian dan rekomendasi objektif di sini...";

    if (type === "note") {
      iconLabel = "[LAB NOTE]";
      titleText = "Catatan Teknis Lab:";
      borderTheme = "border-cyan-500/40 bg-cyan-500/5 text-cyan-300";
      defaultText = "Catatan mengenai akurasi deITP, overdrive, atau sub-pixel rendering...";
    } else if (type === "warning") {
      iconLabel = "[PERINGATAN]";
      titleText = "Peringatan ODM & Garansi:";
      borderTheme = "border-rose-500/40 bg-rose-500/5 text-rose-300";
      defaultText = "Waspadai firmware overdrive generik atau masa tunggu klaim suku cadang...";
    } else if (type === "recommendation") {
      iconLabel = "[S-TIER CHOICE]";
      titleText = "Rekomendasi Utama:";
      borderTheme = "border-emerald-500/40 bg-emerald-500/5 text-emerald-300";
      defaultText = "Unit terbaik di kelas harga ini berdasarkan rasio harga terhadap performa...";
    }

    const html = `
<div class="my-5 p-4 rounded-xl border ${borderTheme} flex items-start gap-3.5 notion-callout" contenteditable="true">
  <div class="px-2 py-0.5 rounded bg-black/40 border border-current font-mono text-[10px] font-bold tracking-wider uppercase flex-shrink-0" contenteditable="false">
    ${iconLabel}
  </div>
  <div class="space-y-1 flex-1">
    <strong class="block font-bold text-sm tracking-tight text-white">${titleText}</strong>
    <p class="text-xs text-zinc-300 leading-relaxed">${defaultText}</p>
  </div>
</div>
<p><br></p>
`;
    execFormat("insertHTML", html);
  };

  // Insert Checklist / Pros Cons Matrix
  const insertProsConsMatrix = () => {
    const html = `
<div class="my-5 p-4 rounded-xl bg-[#0e0e13] border border-zinc-800 space-y-3" contenteditable="true">
  <div class="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider" contenteditable="false">
    <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
    <span>Matriks Kelebihan & Kekurangan</span>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
    <div class="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
      <span class="font-bold text-emerald-400 block font-mono text-[11px]">Kelebihan (+)</span>
      <ul class="space-y-1 text-zinc-300">
        <li>• Keunggulan performa atau akurasi warna 1</li>
        <li>• Keunggulan ergonomi atau kelengkapan port 2</li>
      </ul>
    </div>
    <div class="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-1.5">
      <span class="font-bold text-rose-400 block font-mono text-[11px]">Kekurangan (-)</span>
      <ul class="space-y-1 text-zinc-300">
        <li>• Catatan overshoot atau firmware OSD</li>
        <li>• Ketiadaan stand swivel atau garansi</li>
      </ul>
    </div>
  </div>
</div>
<p><br></p>
`;
    execFormat("insertHTML", html);
  };

  // Insert Interactive Modular Table
  const handleInsertTable = () => {
    const rows = Math.max(1, Math.min(tableRowsInput, 15));
    const cols = Math.max(1, Math.min(tableColsInput, 8));

    let theadCols = "";
    for (let c = 0; c < cols; c++) {
      theadCols += `<th class="p-2.5 border border-zinc-800 bg-zinc-900 text-white font-mono font-bold text-xs">Kolom ${c + 1}</th>`;
    }

    let tbodyRows = "";
    for (let r = 0; r < rows; r++) {
      let cells = "";
      for (let c = 0; c < cols; c++) {
        cells += `<td class="p-2.5 border border-zinc-800 text-zinc-300 text-xs">Data ${r + 1}-${c + 1}</td>`;
      }
      tbodyRows += `<tr class="${r % 2 === 0 ? "bg-zinc-950/40" : "bg-zinc-900/30"}">${cells}</tr>`;
    }

    const html = `
<div class="my-5 overflow-x-auto rounded-xl border border-zinc-800 shadow-sm" contenteditable="true">
  <table class="w-full text-xs border-collapse font-sans">
    <thead>
      <tr>${theadCols}</tr>
    </thead>
    <tbody>
      ${tbodyRows}
    </tbody>
  </table>
</div>
<p><br></p>
`;
    execFormat("insertHTML", html);
    setShowTableModal(false);
  };

  // In-Place Table Actions
  const handleAddTableRow = () => {
    if (!activeTableElement) return;
    const tbody = activeTableElement.querySelector("tbody");
    if (!tbody) return;
    const colCount = activeTableElement.querySelector("thead tr")?.children.length || 3;
    const newRow = document.createElement("tr");
    newRow.className = tbody.children.length % 2 === 0 ? "bg-zinc-950/40" : "bg-zinc-900/30";
    for (let i = 0; i < colCount; i++) {
      const td = document.createElement("td");
      td.className = "p-2.5 border border-zinc-800 text-zinc-300 text-xs";
      td.innerText = "Baris baru";
      newRow.appendChild(td);
    }
    tbody.appendChild(newRow);
    handleContentChange();
  };

  const handleDeleteTableRow = () => {
    if (!activeTableCell || !activeTableElement) return;
    const tr = activeTableCell.closest("tr");
    if (tr && tr.parentElement?.tagName.toLowerCase() === "tbody") {
      tr.remove();
      handleContentChange();
    }
  };

  const handleAddTableColumn = () => {
    if (!activeTableElement) return;
    const theadRow = activeTableElement.querySelector("thead tr");
    if (theadRow) {
      const th = document.createElement("th");
      th.className = "p-2.5 border border-zinc-800 bg-zinc-900 text-white font-mono font-bold text-xs";
      th.innerText = `Kolom Baru`;
      theadRow.appendChild(th);
    }
    const tbodyRows = activeTableElement.querySelectorAll("tbody tr");
    tbodyRows.forEach((row) => {
      const td = document.createElement("td");
      td.className = "p-2.5 border border-zinc-800 text-zinc-300 text-xs";
      td.innerText = "Nilai baru";
      row.appendChild(td);
    });
    handleContentChange();
  };

  const handleDeleteTableColumn = () => {
    if (!activeTableCell || !activeTableElement) return;
    const colIndex = activeTableCell.cellIndex;
    if (colIndex === undefined) return;

    const allRows = activeTableElement.querySelectorAll("tr");
    allRows.forEach((row) => {
      if (row.cells[colIndex]) {
        row.deleteCell(colIndex);
      }
    });
    handleContentChange();
  };

  const handleDeleteEntireTable = () => {
    if (!activeTableElement) return;
    const container = activeTableElement.closest(".overflow-x-auto") || activeTableElement;
    container.remove();
    setActiveTableElement(null);
    setActiveTableCell(null);
    handleContentChange();
  };

  // Image Click Handler inside editor
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // Detect table context
    const cell = target.closest("td, th") as HTMLTableCellElement | null;
    const table = target.closest("table") as HTMLTableElement | null;
    setActiveTableCell(cell);
    setActiveTableElement(table);

    // Detect image context
    if (target.tagName.toLowerCase() === "img") {
      setSelectedImageElement(target as HTMLImageElement);
    } else {
      setSelectedImageElement(null);
    }
  };

  // Set selected image width
  const handleSetImageWidth = (widthPercent: string) => {
    if (!selectedImageElement) return;
    selectedImageElement.style.width = widthPercent;
    selectedImageElement.style.height = "auto";
    selectedImageElement.style.display = "block";
    selectedImageElement.style.margin = widthPercent === "100%" ? "1rem 0" : "1rem auto";
    handleContentChange();
  };

  // Clipboard Paste Image Handler
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          try {
            setIsCompressingImg(true);
            const compressed = await compressImage(blob, 1200, 0.84);
            const imgHtml = `
<figure class="my-4 text-center">
  <img src="${compressed.dataUrl}" alt="Grafik Pengujian Lab GTID" class="rounded-xl border border-zinc-800 shadow-md max-w-full inline-block" style="width: 85%;" />
  <figcaption class="text-[11px] font-mono text-zinc-500 mt-1.5">// Gambar Pengujian Laboratorium GTID Tech</figcaption>
</figure>
<p><br></p>
`;
            execFormat("insertHTML", imgHtml);
          } catch (err) {
            console.error("Gagal memproses gambar:", err);
          } finally {
            setIsCompressingImg(false);
          }
        }
        return;
      }
    }
  };

  // Upload Local Image File Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressingImg(true);
    try {
      const res = await compressImage(file, 1400, 0.85);
      const imgHtml = `
  <figure class="my-4" contenteditable="false">
    <img src="${res.dataUrl}" alt="Lab Test" class="rounded-xl border border-zinc-700 max-w-full h-auto cursor-pointer hover:border-cyan-400 transition-colors" style="width: 100%; display: block;" />
    <figcaption class="text-[11px] font-mono text-zinc-500 mt-1.5">Dokumentasi: ${file.name}</figcaption>
  </figure>
<p><br></p>
`;
      execFormat("insertHTML", imgHtml);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah gambar.");
    } finally {
      setIsCompressingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Insert Link Modal Handler
  const handleApplyLink = () => {
    if (!linkUrlInput.trim()) return;
    restoreCurrentSelection();
    if (linkTextInput.trim()) {
      const linkHtml = `<a href="${linkUrlInput}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline hover:text-cyan-300 font-semibold">${linkTextInput}</a>`;
      execFormat("insertHTML", linkHtml);
    } else {
      execFormat("createLink", linkUrlInput);
    }
    setShowLinkModal(false);
    setLinkUrlInput("");
    setLinkTextInput("");
  };

  // Copy Discord Consultation Callback
  const handleCopyDiscordCallback = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://grayplasma.id";
    const targetUrl = doc.fullPath ? `${origin}${doc.fullPath}` : `${origin}/guide/${doc.slug || ""}`;
    const plainAnswer = doc.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().substring(0, 240);

    const text =
      modeType === "faq"
        ? `**[FAQ GRAYPLASMA] ${doc.title}**\n${plainAnswer}...\n[LINK]: ${targetUrl}`
        : `**[PANDUAN GRAYPLASMA] ${doc.title}**\n${doc.description || plainAnswer}...\n[LINK]: ${targetUrl}`;

    navigator.clipboard.writeText(text);
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  // Live Stats
  const rawText = doc.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = rawText ? rawText.split(" ").length : 0;
  const charCount = rawText.length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 190));

  // Save Document
  const handleSaveClick = () => {
    let finalContent = doc.content;
    if (viewMode === "document" && editableRef.current) {
      finalContent = editableRef.current.innerHTML;
    }
    onSave({
      ...doc,
      content: finalContent,
    });
    // Clear draft once saved
    if (typeof window !== "undefined") {
      localStorage.removeItem(draftKey);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#07070a] text-white flex flex-col font-sans overflow-hidden animate-in fade-in duration-200 ${
        isFullscreen ? "p-0" : ""
      }`}
    >
      {/* 1. TOP HEADER (STATUS & ACTIONS) */}
      <header className="h-16 px-4 sm:px-6 bg-[#0c0c11] border-b border-zinc-800 flex items-center justify-between flex-shrink-0 z-30 shadow-sm">
        {/* Left: Back & Document Meta */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-750 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>

          <div className="h-5 w-[1px] bg-zinc-800 hidden sm:block flex-shrink-0" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold tracking-wider uppercase flex-shrink-0">
              {modeType === "faq" ? "FAQ Knowledgebase" : "Studio Panduan"}
            </span>
            <span className="text-xs text-zinc-300 font-medium hidden md:inline truncate max-w-sm">
              {doc.title || "Dokumen Baru"}
            </span>
          </div>
        </div>

        {/* Center: Word Count & Save Status */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span className="tabular-nums font-semibold text-zinc-300">{wordCount} Kata</span>
          <span>•</span>
          <span className="tabular-nums">{charCount} Karakter</span>
          {lastAutosaveTime && (
            <>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Tersimpan {lastAutosaveTime}</span>
            </>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Copy Discord Summary */}
          <button
            type="button"
            onClick={handleCopyDiscordCallback}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-750 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
            title="Salin callback ringkasan untuk konsultasi Discord"
          >
            {copiedDiscord ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedDiscord ? "Tersalin!" : "Salin Discord"}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs"
            title={isFullscreen ? "Keluar Layar Penuh" : "Mode Layar Penuh"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs border-zinc-750 hover:bg-zinc-900 text-zinc-300"
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="cyber"
            size="sm"
            onClick={handleSaveClick}
            className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono shadow-sm active:translate-y-px"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </Button>
        </div>
      </header>

      {/* DRAFT RESTORATION BANNER */}
      {hasRestorableDraft && (
        <div className="bg-amber-950/80 border-b border-amber-500/40 px-6 py-2 flex items-center justify-between text-xs text-amber-200 z-20 flex-wrap gap-2">
          <div className="flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Ditemukan draf lokal belum tersimpan untuk dokumen ini dari sesi sebelumnya.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
            >
              Pulihkan Draf
            </button>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 text-xs hover:text-white"
            >
              Abaikan
            </button>
          </div>
        </div>
      )}

      {/* 2. FIXED MICROSOFT WORD / GOOGLE DOCS TOOLBAR RIBBON */}
      <div className="bg-[#0e0e14] border-b border-zinc-800 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 flex-wrap flex-shrink-0 z-20 shadow-sm">
        {/* Ribbon Left: Formatting Tools */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* Undo / Redo */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execFormat("undo");
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white"
            title="Batalkan (Undo)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execFormat("redo");
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white"
            title="Ulangi (Redo)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

          {/* Paragraph Style Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHeadingMenu(!showHeadingMenu)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-xs font-semibold text-zinc-200 flex items-center gap-1.5"
            >
              <span>Format Teks</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showHeadingMenu && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#14141c] border border-zinc-700 rounded-xl shadow-2xl py-1 z-50 text-xs font-sans">
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyBlockFormat("p");
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300"
                >
                  Normal Text (Paragraf)
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyBlockFormat("h1");
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-white font-bold text-sm"
                >
                  Judul Utama (H1)
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyBlockFormat("h2");
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-cyan-400 font-bold"
                >
                  Sub Judul Seksi (H2)
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyBlockFormat("h3");
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-amber-400 font-bold text-xs"
                >
                  Sub Seksi Kecil (H3)
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyBlockFormat("blockquote");
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 italic"
                >
                  Kutipan (Blockquote)
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyBlockFormat("pre");
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-emerald-400 font-mono text-[11px]"
                >
                  Blok Kode (Codeblock)
                </button>
              </div>
            )}
          </div>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

          {/* Inline Styling: B, I, U, S */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execFormat("bold");
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Tebal (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execFormat("italic");
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Miring (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execFormat("underline");
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Garis Bawah (Ctrl+U)"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execFormat("strikeThrough");
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Coretan (Strikethrough)"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

          {/* Color & Highlight Pickers */}
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
              <div className="absolute top-full left-0 mt-1 bg-[#14141c] border border-zinc-700 rounded-xl shadow-2xl p-2 z-50 space-y-1 w-40">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      applyTextColor(c.value);
                    }}
                    className="flex items-center gap-2 w-full px-2.5 py-1 rounded text-xs hover:bg-zinc-800 text-left"
                  >
                    <span className="w-3 h-3 rounded-full border border-zinc-600" style={{ backgroundColor: c.value }} />
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
              title="Sorotan Teks (Highlight)"
            >
              <Highlighter className="w-3.5 h-3.5" />
            </button>
            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1 bg-[#14141c] border border-zinc-700 rounded-xl shadow-2xl p-2 z-50 space-y-1 w-44">
                {HIGHLIGHT_COLORS.map((h) => (
                  <button
                    key={h.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      applyHighlightColor(h.value);
                    }}
                    className="flex items-center gap-2 w-full px-2.5 py-1 rounded text-xs hover:bg-zinc-800 text-left"
                  >
                    <span className="w-3.5 h-3.5 rounded border border-zinc-600" style={{ backgroundColor: h.value }} />
                    <span>{h.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

          {/* Text Alignment */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execFormat("justifyLeft");
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Rata Kiri"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execFormat("justifyCenter");
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Rata Tengah"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execFormat("justifyRight");
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Rata Kanan"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execFormat("insertUnorderedList");
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Daftar Poin (Bullet List)"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execFormat("insertOrderedList");
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Daftar Angka (Numbered List)"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

          {/* Inserts: GTID Callouts, Modular Table, Matrix, Image, Link */}
          <button
            type="button"
            onClick={() => insertGtidCallout("verdict")}
            className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1 font-mono"
            title="Sisipkan Callout Box Verdict GTID"
          >
            <span>+ Verdict</span>
          </button>

          <button
            type="button"
            onClick={() => insertGtidCallout("note")}
            className="px-2 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1 font-mono"
            title="Sisipkan Catatan Lab Cyan"
          >
            <span>+ Lab Note</span>
          </button>

          <button
            type="button"
            onClick={() => insertProsConsMatrix()}
            className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 text-xs font-semibold flex items-center gap-1 font-mono"
            title="Sisipkan Matriks Plus Minus"
          >
            <span>+ Matriks Plus/Minus</span>
          </button>

          {/* Table Insert Button */}
          <button
            type="button"
            onClick={() => setShowTableModal(!showTableModal)}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5"
            title="Sisipkan Tabel Modular Baru"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>+ Tabel</span>
          </button>

          {/* Link Insert */}
          <button
            type="button"
            onClick={() => {
              saveCurrentSelection();
              setShowLinkModal(true);
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Sisipkan Tautan (Link)"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          {/* Local Upload Image */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isCompressingImg}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white"
            title="Unggah Gambar Uji Lab (Kompres WebP)"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </div>

        {/* Ribbon Right: View Mode Toggle */}
        <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-0.5 rounded-lg text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode("document")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === "document" ? "bg-emerald-500 text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Dokumen
          </button>
          <button
            type="button"
            onClick={() => setViewMode("source")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === "source" ? "bg-emerald-500 text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            HTML / Kode
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === "preview" ? "bg-emerald-500 text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Web Preview
          </button>
        </div>
      </div>

      {/* 3. TABLE INSERTION MODAL */}
      {showTableModal && (
        <div className="bg-[#121218] border-b border-zinc-800 px-6 py-3 flex items-center gap-4 flex-wrap z-20 text-xs font-mono animate-in slide-in-from-top-2">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <TableIcon className="w-4 h-4" />
            <span>Pembangun Tabel In-Canvas:</span>
          </span>
          <div className="flex items-center gap-2">
            <label className="text-zinc-400">Baris:</label>
            <input
              type="number"
              min={1}
              max={15}
              value={tableRowsInput}
              onChange={(e) => setTableRowsInput(parseInt(e.target.value) || 1)}
              className="w-16 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white text-center"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-zinc-400">Kolom:</label>
            <input
              type="number"
              min={1}
              max={8}
              value={tableColsInput}
              onChange={(e) => setTableColsInput(parseInt(e.target.value) || 1)}
              className="w-16 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white text-center"
            />
          </div>
          <Button type="button" variant="cyber" size="sm" onClick={handleInsertTable} className="text-xs font-bold">
            Buat Tabel
          </Button>
          <button
            type="button"
            onClick={() => setShowTableModal(false)}
            className="text-zinc-400 hover:text-white text-xs"
          >
            Batal
          </button>
        </div>
      )}

      {/* 4. LINK INSERTION MODAL */}
      {showLinkModal && (
        <div className="bg-[#121218] border-b border-zinc-800 px-6 py-3 flex items-center gap-4 flex-wrap z-20 text-xs animate-in slide-in-from-top-2">
          <span className="text-cyan-400 font-bold font-mono flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4" />
            <span>Sisipkan Tautan Web:</span>
          </span>
          <input
            type="text"
            value={linkTextInput}
            onChange={(e) => setLinkTextInput(e.target.value)}
            placeholder="Teks tautan (opsional)..."
            className="w-44 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white text-xs"
          />
          <input
            type="url"
            value={linkUrlInput}
            onChange={(e) => setLinkUrlInput(e.target.value)}
            placeholder="URL Tujuan (https://...)"
            className="w-64 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white text-xs font-mono"
          />
          <Button type="button" variant="cyber" size="sm" onClick={handleApplyLink} className="text-xs font-bold">
            Terapkan Link
          </Button>
          <button
            type="button"
            onClick={() => setShowLinkModal(false)}
            className="text-zinc-400 hover:text-white text-xs"
          >
            Batal
          </button>
        </div>
      )}

      {/* 5. IN-PLACE TABLE CONTROLS (Floats when cursor is inside a table) */}
      {activeTableElement && (
        <div className="bg-[#15151f] border-b border-emerald-500/30 px-6 py-2 flex items-center gap-2 flex-wrap text-xs font-mono z-20 shadow-md animate-in fade-in duration-150">
          <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
            <TableIcon className="w-3.5 h-3.5" />
            <span>AKSI TABEL AKTIF:</span>
          </span>
          <button
            type="button"
            onClick={handleAddTableRow}
            className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white flex items-center gap-1 text-[11px]"
          >
            <Plus className="w-3 h-3 text-emerald-400" />
            <span>+ Baris</span>
          </button>
          <button
            type="button"
            onClick={handleDeleteTableRow}
            className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-rose-400 flex items-center gap-1 text-[11px]"
          >
            <Trash2 className="w-3 h-3 text-rose-400" />
            <span>- Hapus Baris</span>
          </button>
          <div className="h-3 w-[1px] bg-zinc-800 mx-1" />
          <button
            type="button"
            onClick={handleAddTableColumn}
            className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white flex items-center gap-1 text-[11px]"
          >
            <Plus className="w-3 h-3 text-cyan-400" />
            <span>+ Kolom</span>
          </button>
          <button
            type="button"
            onClick={handleDeleteTableColumn}
            className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-rose-400 flex items-center gap-1 text-[11px]"
          >
            <Trash2 className="w-3 h-3 text-rose-400" />
            <span>- Hapus Kolom</span>
          </button>
          <div className="h-3 w-[1px] bg-zinc-800 mx-1" />
          <button
            type="button"
            onClick={handleDeleteEntireTable}
            className="px-2 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-bold flex items-center gap-1 text-[11px]"
          >
            <Trash2 className="w-3 h-3 text-rose-400" />
            <span>Hapus Tabel</span>
          </button>
        </div>
      )}

      {/* 6. IN-PLACE IMAGE RESIZING CONTROLS (Floats when user clicks an image) */}
      {selectedImageElement && (
        <div className="bg-[#15151f] border-b border-cyan-500/30 px-6 py-2 flex items-center gap-3 flex-wrap text-xs font-mono z-20 shadow-md animate-in fade-in duration-150">
          <span className="text-cyan-400 font-bold text-[11px] flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>UKURAN GAMBAR:</span>
          </span>
          <button
            type="button"
            onClick={() => handleSetImageWidth("25%")}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white text-[11px]"
          >
            25% (Kecil)
          </button>
          <button
            type="button"
            onClick={() => handleSetImageWidth("50%")}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white text-[11px]"
          >
            50% (Sedang)
          </button>
          <button
            type="button"
            onClick={() => handleSetImageWidth("75%")}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white text-[11px]"
          >
            75% (Lebar)
          </button>
          <button
            type="button"
            onClick={() => handleSetImageWidth("100%")}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white text-[11px]"
          >
            100% (Penuh)
          </button>
          <button
            type="button"
            onClick={() => {
              selectedImageElement.remove();
              setSelectedImageElement(null);
              handleContentChange();
            }}
            className="px-2 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-[11px]"
          >
            Hapus Gambar
          </button>
        </div>
      )}

      {/* 7. MAIN SCROLLABLE DOCUMENT WORKSPACE */}
      <div className="flex-1 overflow-y-auto bg-[#07070a] p-4 sm:p-8 flex justify-center">
        {/* DOCUMENT VIEW (Word Centered Sheet Layout) */}
        {viewMode === "document" && (
          <div className="w-full max-w-4xl bg-[#0c0c11] border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-12 my-auto flex flex-col space-y-6">
            {/* Document Header Metadata */}
            <div className="space-y-4 pb-6 border-b border-zinc-800">
              {/* Title & Category Row */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                    {modeType === "faq" ? "Pertanyaan FAQ" : "Judul Panduan"}
                  </span>

                  {/* Mode specific tags */}
                  {modeType === "faq" ? (
                    <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={doc.isImportant || false}
                        onChange={(e) => setDoc({ ...doc, isImportant: e.target.checked })}
                        className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 accent-emerald-500"
                      />
                      <span className="font-semibold text-amber-400 font-mono text-[11px]">Featured FAQ</span>
                    </label>
                  ) : (
                    <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={doc.isPublished !== undefined ? doc.isPublished : true}
                        onChange={(e) => setDoc({ ...doc, isPublished: e.target.checked })}
                        className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 accent-emerald-500"
                      />
                      <span className="font-semibold text-emerald-400 font-mono text-[11px]">Publikasikan Rute</span>
                    </label>
                  )}
                </div>

                <input
                  type="text"
                  value={doc.title}
                  onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                  placeholder={modeType === "faq" ? "Masukkan pertanyaan FAQ di sini..." : "Masukkan judul panduan..."}
                  className="w-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 focus:border-emerald-400 rounded-xl px-4 py-3 text-white font-black text-lg sm:text-xl focus:outline-none transition-colors"
                />
              </div>

              {/* Category, Slug & Path Metadata for Guides */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Kategori:</label>
                  <input
                    type="text"
                    value={doc.category || ""}
                    onChange={(e) => setDoc({ ...doc, category: e.target.value })}
                    placeholder="e.g. SDR & Kalibrasi Warna"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {modeType === "guide" && (
                  <>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Slug URL:</label>
                      <input
                        type="text"
                        value={doc.slug || ""}
                        onChange={(e) => {
                          const s = e.target.value.toLowerCase().replace(/\s+/g, "-");
                          setDoc({
                            ...doc,
                            slug: s,
                            fullPath: doc.fullPath?.startsWith("/guide/")
                              ? `/guide/${doc.category?.toLowerCase().replace(/\s+/g, "-") || "general"}/${s}`
                              : `/guide/${s}`,
                          });
                        }}
                        placeholder="glossary"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Sub-Path Publik:</label>
                      <input
                        type="text"
                        value={doc.fullPath || ""}
                        onChange={(e) => setDoc({ ...doc, fullPath: e.target.value })}
                        placeholder="/guide/sdr/glossary"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Guide Cover Image & Short Description */}
              {modeType === "guide" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                      Hero Cover Image URL (Opsional):
                    </label>
                    <input
                      type="text"
                      value={doc.coverImage || ""}
                      onChange={(e) => setDoc({ ...doc, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                      Ringkasan Singkat / Description:
                    </label>
                    <input
                      type="text"
                      value={doc.description || ""}
                      onChange={(e) => setDoc({ ...doc, description: e.target.value })}
                      placeholder="Ringkasan ulasan teknis..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Document Body Label */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                Isi Konten Dokumen
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                Paste gambar (Ctrl+V) atau ketik teks langsung
              </span>
            </div>

            {/* Rich ContentEditable Paper Sheet */}
            <div
              ref={editableRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onInput={handleContentChange}
              onBlur={handleContentChange}
              onMouseUp={saveCurrentSelection}
              onKeyUp={saveCurrentSelection}
              onClick={handleEditorClick}
              onPaste={handlePaste}
              className="notion-prose min-h-[420px] focus:outline-none p-4 rounded-xl bg-zinc-950/30 border border-zinc-850 hover:border-zinc-800 focus:border-zinc-700 transition-colors"
            />
          </div>
        )}

        {/* SOURCE VIEW (HTML Code) */}
        {viewMode === "source" && (
          <div className="w-full max-w-4xl bg-[#0c0c11] border border-zinc-800 rounded-2xl shadow-2xl p-6 my-auto flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
                Kode Sumber (HTML)
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(doc.content);
                  alert("Kode HTML disalin ke clipboard!");
                }}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-750 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Salin Kode</span>
              </button>
            </div>
            <textarea
              rows={22}
              value={doc.content}
              onChange={(e) => setDoc({ ...doc, content: e.target.value })}
              className="w-full bg-[#07070a] border border-zinc-800 rounded-xl p-4 text-zinc-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-emerald-400"
            />
          </div>
        )}

        {/* PREVIEW VIEW (Live Public Render via NotionBlockRenderer) */}
        {viewMode === "preview" && (
          <div className="w-full max-w-4xl bg-[#0c0c11] border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-10 my-auto flex flex-col space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold block mb-1">
                Pratinjau Halaman Publik
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{doc.title}</h2>
              {doc.category && (
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-mono font-bold uppercase">
                  {doc.category}
                </span>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800">
              <NotionBlockRenderer content={doc.content} />
            </div>
          </div>
        )}
      </div>

      {/* 8. BOTTOM FOOTER STATUS BAR */}
      <footer className="h-10 px-4 sm:px-6 bg-[#0c0c11] border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500 z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 font-medium">Word & Docs Studio</span>
          <span>•</span>
          <span className="text-zinc-500">GrayPlasma Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Ctrl+B (Tebal) • Ctrl+I (Miring) • Ctrl+U (Garis Bawah)</span>
          <span className="text-emerald-400 font-medium">Auto-Save Aktif</span>
        </div>
      </footer>
    </div>
  );
}
