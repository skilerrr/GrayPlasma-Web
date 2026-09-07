"use client";

import React, { useState } from "react";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Play,
  RotateCcw,
  CheckCircle2,
  FileText,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { SiteHierarchyNode, RouteTriggerAction } from "@/types/site-hierarchy";
import { DatabaseService } from "@/lib/db-service";
import { Button } from "@/components/ui/button";
import { WordDocsStudio, WordStudioDocument } from "@/components/admin/word-docs-studio";

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
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [notice, setNotice] = useState<string | null>(null);

  // Studio Document State
  const [studioDoc, setStudioDoc] = useState<WordStudioDocument>({
    id: "",
    title: "",
    slug: "",
    fullPath: "",
    category: "SDR & Kalibrasi Warna",
    description: "",
    content: "",
    coverImage: "",
    onClickAction: "route",
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
    setStudioDoc({
      id: `guide-${Date.now()}`,
      title: "Judul Panduan Baru",
      slug: "panduan-baru",
      fullPath: "/guide/custom/panduan-baru",
      category: "SDR & Kalibrasi Warna",
      description: "Deskripsi singkat ulasan dan data pengujian laboratorium.",
      content: `<h2>1. Pembahasan Utama Pengujian</h2>
<p>Tulis penjelasan hasil pengukuran sensor di sini dengan format terstruktur, tabel pengujian, atau callout GTID verdict.</p>
<div class="my-5 p-4 rounded-xl border border-amber-500/40 bg-amber-500/5 text-amber-300 flex items-start gap-3.5 notion-callout">
  <div class="px-2 py-0.5 rounded bg-black/40 border border-current font-mono text-[10px] font-bold tracking-wider uppercase flex-shrink-0">
    [VERDICT GTID]
  </div>
  <div class="space-y-1 flex-1">
    <strong class="block font-bold text-sm tracking-tight text-white">GTID Tech Verdict:</strong>
    <p class="text-xs text-zinc-300 leading-relaxed">Tulis ringkasan ulasan atau catatan objektif sebelum pembaca memilih unit ini.</p>
  </div>
</div>
<p><br></p>`,
      onClickAction: "route",
      coverImage: "",
      tags: ["Panduan", "GTID"],
      discordCallbackSummary: "📄 Ulasan Panduan GrayPlasma. Link: https://grayplasma.id/guide/custom/panduan-baru",
      isPublished: true,
    });
    setIsLiveEditorOpen(true);
  };

  const handleStartEdit = (node: SiteHierarchyNode) => {
    setSelectedNode(node);
    setStudioDoc({
      id: node.id,
      title: node.title,
      slug: node.slug,
      fullPath: node.fullPath,
      category: node.category,
      description: node.description,
      content: node.contentMarkdown || "",
      coverImage: node.coverImage || "",
      onClickAction: node.onClickAction || "route",
      tags: node.tags || [],
      isPublished: node.isPublished !== undefined ? node.isPublished : true,
      discordCallbackSummary: node.discordCallbackSummary || "",
    });
    setIsLiveEditorOpen(true);
  };

  const handleSaveFromStudio = async (savedDoc: WordStudioDocument) => {
    if (!savedDoc.title || !savedDoc.slug) {
      alert("Judul dan Slug URL wajib diisi!");
      return;
    }

    const nodeToSave: SiteHierarchyNode = {
      id: selectedNode?.id || savedDoc.id || `guide-${Date.now()}`,
      title: savedDoc.title,
      slug: savedDoc.slug,
      fullPath: savedDoc.fullPath || `/guide/${savedDoc.slug}`,
      category: savedDoc.category || "General",
      description: savedDoc.description || "",
      contentMarkdown: savedDoc.content || "",
      onClickAction: (savedDoc.onClickAction as RouteTriggerAction) || "route",
      coverImage: savedDoc.coverImage || "",
      tags: savedDoc.tags || [],
      order: selectedNode?.order || nodes.length + 1,
      isPublished: savedDoc.isPublished !== undefined ? savedDoc.isPublished : true,
      discordCallbackSummary: savedDoc.discordCallbackSummary || "",
      updatedAt: new Date().toISOString().split("T")[0],
    };

    const updated = await DatabaseService.saveHierarchyNode(nodeToSave);
    onUpdateNodes(updated);
    setIsLiveEditorOpen(false);
    setSelectedNode(null);
    showNotification(`Berhasil menyimpan perubahan untuk dokumen: ${nodeToSave.title}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus rute/halaman ini dari hierarki website?")) {
      const updated = await DatabaseService.deleteHierarchyNode(id);
      onUpdateNodes(updated);
      showNotification("Halaman berhasil dihapus dari hierarki.");
      if (selectedNode?.id === id) {
        setIsLiveEditorOpen(false);
        setSelectedNode(null);
      }
    }
  };

  const filteredNodes =
    filterCategory === "all" ? nodes : nodes.filter((n) => n.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-2 shadow-2xl animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* FULL-PAGE WORD & GOOGLE DOCS STUDIO */}
      {isLiveEditorOpen && (
        <WordDocsStudio
          isOpen={isLiveEditorOpen}
          modeType="guide"
          initialData={studioDoc}
          onSave={handleSaveFromStudio}
          onClose={() => {
            setIsLiveEditorOpen(false);
            setSelectedNode(null);
          }}
          availableCategories={categories}
        />
      )}

      {/* HIERARCHY OVERVIEW TABLE & ACCESS LIST */}
      <div className="space-y-6">
        {/* Top Control Header */}
        <div className="p-6 rounded-2xl bg-[#0c0c11] border border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Page Sandbox & Hierarchy Engine</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              Manajemen Hierarki Rute & Word Studio Panduan
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Tulis dan edit artikel ulasan mendalam menggunakan studio dokumen berstandar Word/Google Docs. Atur sub-path rute publik (/guide/...) dan aksi trigger secara fleksibel.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="cyber"
              size="sm"
              onClick={handleStartCreate}
              className="text-xs font-bold font-mono flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>[ TULIS PANDUAN BARU ]</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (window.confirm("Reset seluruh hierarki panduan ke default template GrayPlasma?")) {
                  const reset = DatabaseService.resetHierarchyToDefault();
                  onUpdateNodes(reset);
                  showNotification("Hierarki berhasil direset ke template default!");
                }
              }}
              className="text-xs text-zinc-400 hover:text-white border-zinc-800"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset Default</span>
            </Button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              filterCategory === "all"
                ? "bg-zinc-800 text-white border border-zinc-700"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
            }`}
          >
            Semua Kategori ({nodes.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/40 font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hierarchy Nodes Table */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c11] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[900px] font-sans">
              <thead className="bg-zinc-900/90 text-zinc-400 uppercase text-[10px] font-mono tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 font-bold text-white min-w-[260px]">Halaman / File Panduan</th>
                  <th className="py-3 px-3 font-bold min-w-[190px]">Sub-Path URL Publik</th>
                  <th className="py-3 px-3 font-bold min-w-[130px]">Trigger Action</th>
                  <th className="py-3 px-3 font-bold min-w-[150px]">Kategori</th>
                  <th className="py-3 px-4 font-bold text-center min-w-[200px]">Aksi Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {filteredNodes.map((node, idx) => {
                  return (
                    <tr
                      key={node.id}
                      className="hover:bg-zinc-900/40 transition-colors group cursor-pointer"
                      onClick={() => handleStartEdit(node)}
                    >
                      <td className="py-3 px-4 text-center font-mono text-zinc-500">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {node.title}
                            </div>
                            <div className="text-[11px] text-zinc-400 line-clamp-1 max-w-sm">
                              {node.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-emerald-400 text-[11px]">
                        {node.fullPath}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                            node.onClickAction === "route"
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                              : node.onClickAction === "side-panel"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : node.onClickAction === "modal"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700"
                          }`}
                        >
                          {node.onClickAction}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-zinc-300 font-medium">
                        {node.category}
                      </td>

                      <td
                        className="py-3 px-4 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Live Edit Button */}
                          <button
                            onClick={() => handleStartEdit(node)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-750 hover:border-cyan-400 text-zinc-200 hover:text-white flex items-center gap-1 text-xs font-mono transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Edit Dokumen</span>
                          </button>

                          {/* Test Trigger Button */}
                          <button
                            onClick={() => onTestTrigger(node)}
                            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-emerald-400"
                            title="Test Buka Rute"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(node.id)}
                            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400"
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
    </div>
  );
}
