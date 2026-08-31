"use client";

import React, { useState, useRef } from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
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
} from "lucide-react";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";
import { compressImage, formatFileSize } from "@/lib/image-compressor";
import { Button } from "@/components/ui/button";

interface NotionRichEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  minHeight?: string;
  placeholder?: string;
  allowImageUpload?: boolean;
}

export function NotionRichEditor({
  value,
  onChange,
  minHeight = "min-h-[350px]",
  placeholder = "Tulis konten artikel atau catatan di sini...",
  allowImageUpload = true,
}: NotionRichEditorProps) {
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");
  const [isCompressing, setIsCompressing] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertTextAtCursor = (before: string, after: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end) || defaultText;

    const replacement = `${before}${selectedText}${after}`;
    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 50);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressed = await compressImage(file, 1200, 0.82);
      insertTextAtCursor(`\n\n![${file.name.replace(/\.[^/.]+$/, "")}](${compressed.dataUrl})\n\n`);
    } catch (err) {
      console.error("Gagal kompres gambar", err);
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyDiscordFormatted = () => {
    const plain = value
      .replace(/^#+\s+/gm, "**")
      .replace(/\*\*/g, "*")
      .substring(0, 1900);
    navigator.clipboard.writeText(plain);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="border border-zinc-800 rounded-2xl bg-zinc-950/80 overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-zinc-900/90 border-b border-zinc-800 text-xs">
        {/* Left Formatting Tools */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertTextAtCursor("# ", "", "Judul Utama H1")}
            title="Heading 1"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor("## ", "", "Subjudul H2")}
            title="Heading 2"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor("### ", "", "Section H3")}
            title="Heading 3"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-zinc-700 mx-1" />

          <button
            type="button"
            onClick={() => insertTextAtCursor("**", "**", "teks tebal")}
            title="Bold"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor("*", "*", "teks miring")}
            title="Italic"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor("`", "`", "kode")}
            title="Inline Code"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-zinc-700 mx-1" />

          <button
            type="button"
            onClick={() => insertTextAtCursor("> ", "", "Kutipan / Catatan Penting")}
            title="Callout Quote"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-cyan-400 hover:text-cyan-300"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor("> [!WARNING]\n> ", "", "Peringatan Cacat Produksi atau Firmware")}
            title="Warning Callout Alert"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-amber-400 hover:text-amber-300"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor("- ", "", "Poin daftar")}
            title="Bullet List"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor("1. ", "", "Langkah pertama")}
            title="Numbered List"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor("\n---\n")}
            title="Horizontal Divider"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTextAtCursor("\n| Kategori | Nilai GTID | Status |\n|---|---|---|\n| sRGB Gamut | 99.8% | Akurat |\n")}
            title="Tabel Notion"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300"
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>

          {allowImageUpload && (
            <>
              <div className="w-[1px] h-4 bg-zinc-700 mx-1" />
              <label
                title="Sisipkan Foto (Otomatis WebP Ringan)"
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-pink-400 hover:text-pink-300 cursor-pointer flex items-center gap-1"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline font-bold">+ Foto WebP</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>

        {/* Right View Switcher & Action Tools */}
        <div className="flex items-center gap-1.5">
          {isCompressing && (
            <span className="text-[10px] text-pink-400 font-bold animate-pulse">
              Mengoptimasi WebP...
            </span>
          )}

          <button
            type="button"
            onClick={copyDiscordFormatted}
            title="Salin Cuplikan untuk Discord"
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold flex items-center gap-1"
          >
            {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-violet-400" />}
            <span className="hidden sm:inline">Discord Text</span>
          </button>

          <div className="flex items-center bg-zinc-950 rounded-lg p-0.5 border border-zinc-800">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`p-1 rounded text-[11px] ${viewMode === "edit" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400"}`}
              title="Hanya Editor"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`p-1 rounded text-[11px] ${viewMode === "split" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400"}`}
              title="Split View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`p-1 rounded text-[11px] ${viewMode === "preview" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400"}`}
              title="Hanya Preview"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Preview Pane */}
      <div className={`grid ${viewMode === "split" ? "grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800" : "grid-cols-1"}`}>
        {/* Editor Area */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className="p-3 bg-zinc-950 flex flex-col">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full bg-transparent text-zinc-200 text-xs font-mono leading-relaxed p-2 focus:outline-none resize-y ${minHeight}`}
            />
          </div>
        )}

        {/* Live Notion Preview Area */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className={`p-4 bg-[#09090b] overflow-y-auto max-h-[550px] ${minHeight}`}>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800/80">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>Live Notion Rendered Output</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {value.length} karakter
              </span>
            </div>
            {value.trim() ? (
              <NotionBlockRenderer content={value} />
            ) : (
              <div className="text-zinc-600 text-xs italic py-8 text-center">
                Belum ada konten. Ketik di editor untuk melihat preview visual instan.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
