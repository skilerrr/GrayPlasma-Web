"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Play,
  ExternalLink,
  BookOpen,
  Check,
  Sparkles,
  SlidersHorizontal,
  FolderTree,
  FileCode,
  Globe,
  Share2,
  MessageSquare,
  Eye,
  CheckCircle2,
  Save,
  RotateCcw,
  Heading1,
  Heading2,
  Heading3,
  List,
  Quote,
  Code,
  Bold,
  X,
  ArrowLeft,
  Tv,
} from "lucide-react";
import { SiteHierarchyNode, RouteTriggerAction } from "@/types/site-hierarchy";
import { DatabaseService } from "@/lib/db-service";
import { NotionBlockRenderer } from "@/components/notion-block-renderer";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HierarchySandboxManagerProps {
  nodes: SiteHierarchyNode[];
  onUpdateNodes: (newNodes: SiteHierarchyNode[]) => void;
  onTestTrigger: (node: SiteHierarchyNode) => void;
}

export function HierarchySandboxManager({
  nodes,
  onUpdateNodes,
  onTestTrigger,
}: HierarchySandboxManagerProps) {
  const [selectedNode, setSelectedNode] = useState<SiteHierarchyNode | null>(null);
  const [isLiveEditorOpen, setIsLiveEditorOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [notice, setNotice] = useState<string | null>(null);

  // Form / Live Editor State
  const [formData, setFormData] = useState<Partial<SiteHierarchyNode>>({
    title: "",
    slug: "",
    fullPath: "",
    category: "SDR & Kalibrasi Warna",
    description: "",
    contentMarkdown: "",
    onClickAction: "route",
    externalUrl: "",
    tags: [],
    discordCallbackSummary: "",
    isPublished: true,
  });

  const categories = Array.from(new Set(nodes.map((n) => n.category)));

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleStartCreate = () => {
    setSelectedNode(null);
    setFormData({
      id: `guide-${Date.now()}`,
      title: "Judul Panduan Baru",
      slug: "panduan-baru",
      fullPath: "/guide/custom/panduan-baru",
      category: "SDR & Kalibrasi Warna",
      description: "Deskripsi singkat ulasan dan data pengujian.",
      contentMarkdown: `# JUDUL PANDUAN

> Catatan penting ulasan teknis independen GrayPlasma x GTID Tech.

---

## 1. Pembahasan Utama
Tulis penjelasan data pengetesan di sini dengan **format tebal**, \`kode\`, atau list poin:
- Poin evaluasi 1
- Poin evaluasi 2

---

## 2. Kesimpulan & Rekomendasi
> Selalu tanyakan ke Joel Gray di Discord sebelum checkout!`,
      onClickAction: "route",
      externalUrl: "",
      tags: ["Panduan", "GTID"],
      discordCallbackSummary: "📄 Ulasan Panduan GrayPlasma. Link: https://grayplasma.id/guide/custom/panduan-baru",
      isPublished: true,
      order: nodes.length + 1,
      updatedAt: new Date().toISOString().split("T")[0],
    });
    setIsLiveEditorOpen(true);
  };

  const handleStartEdit = (node: SiteHierarchyNode) => {
    setSelectedNode(node);
    setFormData({ ...node });
    setIsLiveEditorOpen(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.slug) {
      alert("Judul dan Slug wajib diisi!");
      return;
    }

    const nodeToSave: SiteHierarchyNode = {
      id: selectedNode?.id || formData.id || `guide-${Date.now()}`,
      title: formData.title || "Untitled",
      slug: formData.slug || "untitled",
      fullPath: formData.fullPath || `/guide/${formData.slug}`,
      category: formData.category || "General",
      description: formData.description || "",
      contentMarkdown: formData.contentMarkdown || "",
      onClickAction: formData.onClickAction || "route",
      externalUrl: formData.externalUrl || "",
      coverImage: formData.coverImage || "",
      tags: formData.tags || [],
      order: formData.order || nodes.length + 1,
      isPublished: formData.isPublished !== undefined ? formData.isPublished : true,
      discordCallbackSummary: formData.discordCallbackSummary || "",
      updatedAt: new Date().toISOString().split("T")[0],
    };

    const updated = await DatabaseService.saveHierarchyNode(nodeToSave);
    onUpdateNodes(updated);
    showNotification(`Berhasil menyimpan perubahan untuk: ${nodeToSave.title}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus rute/halaman ini dari hierarki website?")) {
      const updated = await DatabaseService.deleteHierarchyNode(id);
      onUpdateNodes(updated);
      showNotification("Halaman berhasil dihapus dari hierarki.");
      if (selectedNode?.id === id) {
        setIsLiveEditorOpen(false);
      }
    }
  };

  const handleInsertMarkdownSnippet = (snippet: string) => {
    setFormData((prev) => ({
      ...prev,
      contentMarkdown: (prev.contentMarkdown || "") + "\n" + snippet,
    }));
  };

  const filteredNodes =
    filterCategory === "all" ? nodes : nodes.filter((n) => n.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-2 shadow-2xl animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: LIVE NOTION STUDIO & SPLIT PREVIEW EDITOR                        */}
      {/* ========================================================================= */}
      {isLiveEditorOpen ? (
        <div className="bg-[#191919] border border-[#2f2f2f] rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[800px]">
          {/* Studio Header Toolbar */}
          <div className="px-6 py-4 border-b border-[#2f2f2f] bg-[#202020] flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiveEditorOpen(false)}
                className="p-2 rounded-xl bg-[#252525] border border-[#333333] text-[#9b9a97] hover:text-white hover:bg-[#2c2c2c] transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Daftar Hierarki</span>
              </button>

              <div className="hidden sm:block">
                <span className="text-xs font-bold text-[#e0e0e0] flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span>Live Page Studio: {selectedNode ? "Edit Mode" : "New Page"}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (formData.fullPath) {
                    window.open(formData.fullPath, "_blank");
                  }
                }}
                className="text-xs flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-[#52ba69]" />
                <span>Test Buka Halaman</span>
              </Button>

              <Button
                variant="cyber"
                size="sm"
                onClick={() => handleSave()}
                className="text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </Button>
            </div>
          </div>

          {/* 2-Column Split Studio: Left = Editor, Right = Real Notion Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-[#2f2f2f]">
            {/* LEFT COLUMN: Controls & Raw Markdown Editor (5 Cols) */}
            <div className="lg:col-span-5 p-6 space-y-4 overflow-y-auto max-h-[850px] text-xs bg-[#191919]">
              <div className="space-y-1">
                <label className="text-[#9b9a97] font-bold uppercase text-[10px] tracking-wider">
                  Judul Halaman:
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. HOW TO READ GTID GLOSSARY"
                  className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#9b9a97] font-bold uppercase text-[10px]">Kategori:</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="SDR & Kalibrasi Warna"
                    className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#9b9a97] font-bold uppercase text-[10px]">Slug:</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      const s = e.target.value;
                      setFormData({
                        ...formData,
                        slug: s,
                        fullPath: formData.fullPath?.startsWith("/guide/") ? `/guide/${formData.category?.toLowerCase().replace(/\s+/g, "-")}/${s}` : formData.fullPath,
                      });
                    }}
                    placeholder="glossary"
                    className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#9b9a97] font-bold uppercase text-[10px]">
                  Sub-Path URL (/abcd/abcd):
                </label>
                <input
                  type="text"
                  value={formData.fullPath}
                  onChange={(e) => setFormData({ ...formData, fullPath: e.target.value })}
                  placeholder="/guide/sdr/glossary"
                  className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-[#52ba69] font-mono font-bold focus:outline-none focus:border-[#52ba69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#9b9a97] font-bold uppercase text-[10px]">Trigger Action:</label>
                  <select
                    value={formData.onClickAction}
                    onChange={(e) =>
                      setFormData({ ...formData, onClickAction: e.target.value as RouteTriggerAction })
                    }
                    className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#58a6ff]"
                  >
                    <option value="route">route (Buka Halaman Penuh)</option>
                    <option value="side-panel">side-panel (Buka Side-Peek Drawer)</option>
                    <option value="modal">modal (Modal Popup)</option>
                    <option value="external">external (External URL)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#9b9a97] font-bold uppercase text-[10px]">Cover Banner Image:</label>
                  <input
                    type="text"
                    value={formData.coverImage || ""}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>
              </div>

              {/* Description / Summary */}
              <div className="space-y-1">
                <label className="text-[#9b9a97] font-bold uppercase text-[10px]">Deskripsi Singkat:</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ringkasan ulasan..."
                  className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              {/* Markdown Content with Quick Format Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#2f2f2f]">
                <div className="flex items-center justify-between">
                  <label className="text-[#e0e0e0] font-bold uppercase text-[10px] tracking-wider">
                    Konten Halaman (Markdown):
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdownSnippet("## Heading 2")}
                      className="p-1 rounded bg-[#202020] hover:bg-[#2c2c2c] text-[#9b9a97] hover:text-white"
                      title="Heading 2"
                    >
                      <Heading2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdownSnippet("### Heading 3")}
                      className="p-1 rounded bg-[#202020] hover:bg-[#2c2c2c] text-[#9b9a97] hover:text-white"
                      title="Heading 3"
                    >
                      <Heading3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdownSnippet("- Poin catatan ulasan")}
                      className="p-1 rounded bg-[#202020] hover:bg-[#2c2c2c] text-[#9b9a97] hover:text-white"
                      title="Bullet List"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdownSnippet("> Catatan penting / Callout")}
                      className="p-1 rounded bg-[#202020] hover:bg-[#2c2c2c] text-[#9b9a97] hover:text-white"
                      title="Callout Box"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdownSnippet("---")}
                      className="p-1 rounded bg-[#202020] hover:bg-[#2c2c2c] text-[#9b9a97] hover:text-white"
                      title="Divider Line"
                    >
                      <span>—</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={14}
                  value={formData.contentMarkdown}
                  onChange={(e) => setFormData({ ...formData, contentMarkdown: e.target.value })}
                  placeholder="## Heading 2\n\nTulis ulasan di sini..."
                  className="w-full bg-[#121212] border border-[#2f2f2f] rounded-2xl p-4 text-[#e0e0e0] font-mono text-xs focus:outline-none focus:border-[#58a6ff] leading-relaxed shadow-inner"
                />
              </div>

              {/* Discord Callback Summary Textarea */}
              <div className="space-y-1 pt-2">
                <label className="text-[#58a6ff] font-bold uppercase text-[10px] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Discord Callback Quick Text:</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.discordCallbackSummary}
                  onChange={(e) => setFormData({ ...formData, discordCallbackSummary: e.target.value })}
                  placeholder="Teks ringkas yang siap dipaste ke Discord..."
                  className="w-full bg-[#202020] border border-[#2f2f2f] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#58a6ff]"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: REAL-TIME NOTION LIVE PREVIEW (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 bg-[#191919] overflow-y-auto max-h-[850px] space-y-6">
              {/* Preview Status Banner */}
              <div className="flex items-center justify-between pb-3 border-b border-[#2f2f2f] text-xs text-[#9b9a97]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#52ba69] animate-pulse" />
                  <span className="font-bold text-[#e0e0e0] uppercase tracking-wider text-[10px]">
                    Live Page Rendering Preview
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#787774]">{formData.fullPath}</span>
              </div>

              {/* Page Breadcrumbs */}
              <div className="flex items-center gap-1.5 text-xs text-[#9b9a97]">
                <span>🖥️</span>
                <span>GRAYPLASMAID - REKOMENDASI MONITOR</span>
                <span>/</span>
                <span className="text-white font-medium truncate">
                  {formData.title || "Untitled Page"}
                </span>
              </div>

              {/* Cover Banner if provided */}
              {formData.coverImage && (
                <div className="relative w-full h-40 sm:h-52 rounded-2xl overflow-hidden border border-[#2f2f2f] bg-[#202020]">
                  <Image
                    src={formData.coverImage}
                    alt="Cover"
                    fill
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#191919] via-transparent to-transparent" />
                </div>
              )}

              {/* Page Icon & Title */}
              <div className="space-y-3">
                <div className="text-3xl sm:text-4xl">🖥️</div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {formData.title || "Judul Halaman"}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#203c2b] text-[#52ba69]">
                    {formData.category || "General"}
                  </span>
                  <span className="text-[10px] font-mono text-[#9b9a97]">
                    Trigger: {formData.onClickAction}
                  </span>
                </div>
              </div>

              {/* Page Blocks Live Rendered */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#202020] border border-[#2f2f2f] shadow-sm">
                <NotionBlockRenderer content={formData.contentMarkdown} />
              </div>

              {/* Callback Preview */}
              {formData.discordCallbackSummary && (
                <div className="p-4 rounded-xl bg-[#202020] border border-[#2f2f2f] flex items-start gap-3 text-xs">
                  <MessageSquare className="w-4 h-4 text-[#58a6ff] flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-white uppercase text-[10px] tracking-wider">
                      Preview Salinan Details:
                    </span>
                    <p className="text-[#d4d4d4] font-mono text-[11px] leading-relaxed">
                      {formData.discordCallbackSummary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: HIERARCHY OVERVIEW TABLE & FAST ACCESS                            */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Top Control Header */}
          <div className="p-6 rounded-3xl bg-[#202020] border border-[#2f2f2f] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d354a] border border-[#2383e2]/40 text-[#58a6ff] text-xs font-bold">
                <FolderTree className="w-3.5 h-3.5" />
                <span>Page Sandbox & Hierarchy Engine</span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Manajemen Hierarki Rute & Live Page Studio
              </h2>
              <p className="text-xs text-[#9b9a97] max-w-2xl leading-relaxed">
                Edit konten panduan secara live dengan preview real-time, atur sub-path URL (/abcd/abcd), dan sesuaikan trigger on-click.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="cyber"
                size="sm"
                onClick={handleStartCreate}
                className="text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Buka Live Page Studio</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm("Reset seluruh hierarki ke default template GrayPlasma?")) {
                    const reset = DatabaseService.resetHierarchyToDefault();
                    onUpdateNodes(reset);
                    showNotification("Hierarki berhasil direset ke template default!");
                  }
                }}
                className="text-xs text-[#9b9a97] hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </Button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCategory === "all"
                  ? "bg-[#252525] text-white border border-[#3f3f3f]"
                  : "text-[#9b9a97] hover:text-white hover:bg-[#202020]"
              }`}
            >
              Semua Kategori ({nodes.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? "bg-[#1d354a] text-[#58a6ff] border border-[#2383e2]/40"
                    : "text-[#9b9a97] hover:text-white hover:bg-[#202020] border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Hierarchy Nodes Table */}
          <div className="rounded-2xl border border-[#2f2f2f] bg-[#191919] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                <thead className="bg-[#202020] text-[#9b9a97] uppercase text-[10px] tracking-wider border-b border-[#2f2f2f]">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4 font-bold text-white min-w-[260px]">Halaman / File Panduan</th>
                    <th className="py-3.5 px-3 font-bold min-w-[190px]">Sub-Path URL (/abcd/abcd)</th>
                    <th className="py-3.5 px-3 font-bold min-w-[130px]">Trigger Action</th>
                    <th className="py-3.5 px-3 font-bold min-w-[150px]">Kategori</th>
                    <th className="py-3.5 px-4 font-bold text-center min-w-[200px]">Aksi & Live Editor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {filteredNodes.map((node, idx) => {
                    const isCopied = copiedId === node.id;

                    return (
                      <tr
                        key={node.id}
                        className="hover:bg-[#202020] transition-colors group cursor-pointer"
                        onClick={() => handleStartEdit(node)}
                      >
                        <td className="py-3.5 px-4 text-center font-mono text-[#787774]">
                          {idx + 1}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">🖥️</span>
                            <div>
                              <div className="font-bold text-white group-hover:text-[#58a6ff] transition-colors">
                                {node.title}
                              </div>
                              <div className="text-[11px] text-[#9b9a97] line-clamp-1 max-w-sm">
                                {node.description}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-mono font-bold text-[#52ba69] text-[11px]">
                          {node.fullPath}
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              node.onClickAction === "route"
                                ? "bg-[#1d354a] text-[#58a6ff]"
                                : node.onClickAction === "side-panel"
                                ? "bg-[#203c2b] text-[#52ba69]"
                                : node.onClickAction === "modal"
                                ? "bg-[#442c1d] text-[#e07936]"
                                : "bg-[#2f2f2f] text-[#9b9a97]"
                            }`}
                          >
                            {node.onClickAction}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-[#d4d4d4] font-medium">
                          {node.category}
                        </td>

                        <td
                          className="py-3.5 px-4 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Live Edit Button */}
                            <button
                              onClick={() => handleStartEdit(node)}
                              className="px-2.5 py-1 rounded-lg bg-[#252525] border border-[#333333] hover:border-[#58a6ff] text-[#e0e0e0] hover:text-white flex items-center gap-1 text-xs transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-[#58a6ff]" />
                              <span>Live Edit</span>
                            </button>

                            {/* Test Trigger Button */}
                            <button
                              onClick={() => onTestTrigger(node)}
                              className="p-1.5 rounded-lg bg-[#252525] border border-[#333333] hover:bg-[#2c2c2c] text-[#52ba69]"
                              title="Test Trigger Action"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(node.id)}
                              className="p-1.5 rounded-lg bg-[#252525] border border-[#333333] hover:bg-[#371e20] text-[#787774] hover:text-[#eb5757]"
                              title="Hapus Halaman"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
