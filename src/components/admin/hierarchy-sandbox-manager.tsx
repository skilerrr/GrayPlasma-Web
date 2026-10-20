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
  Eye,
  EyeOff,
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
<p>Tulis penjelasan hasil pengukuran sensor di sini dengan format terstruktur, tabel pengujian, atau callout GrayPlasma verdict.</p>
<div class="my-5 p-4 rounded-xl border border-hue-amber-500/40 bg-hue-amber-500/5 text-hue-amber-300 flex items-start gap-3.5 notion-callout">
  <div class="px-2 py-0.5 rounded bg-black/40 border border-current font-mono text-3xs font-bold tracking-wider uppercase flex-shrink-0">
    [VERDICT GrayPlasma]
  </div>
  <div class="space-y-1 flex-1">
    <strong class="block font-bold text-sm tracking-tight text-white">GrayPlasma Verdict:</strong>
    <p class="text-xs text-gp-ink-200 leading-relaxed">Tulis ringkasan ulasan atau catatan objektif sebelum pembaca memilih unit ini.</p>
  </div>
</div>
<p><br></p>`,
      onClickAction: "route",
      coverImage: "",
      tags: ["Panduan", "GrayPlasma"],
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

  const handleTogglePublish = async (e: React.MouseEvent, node: SiteHierarchyNode) => {
    e.stopPropagation();
    const newStatus = node.isPublished === false ? true : false;
    const nodeToSave: SiteHierarchyNode = {
      ...node,
      isPublished: newStatus,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    const updated = await DatabaseService.saveHierarchyNode(nodeToSave);
    onUpdateNodes(updated);
    showNotification(
      newStatus
        ? `Artikel "${node.title}" telah DIPUBLIKASIKAN (Aktif di website).`
        : `Artikel "${node.title}" telah DISEMBUNYIKAN (Mode Draft publik - tidak tampil di web).`
    );
  };

  const filteredNodes =
    filterCategory === "all" ? nodes : nodes.filter((n) => n.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-hue-emerald-500 text-black font-bold text-xs flex items-center gap-2 shadow-2xl animate-in slide-in-from-bottom-2">
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
        <div className="p-6 rounded-2xl bg-gp-ink-900 border border-gp-ink-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-gp-ink-800 border border-gp-ink-650 text-hue-cyan-400 text-2xs font-mono font-bold">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Hierarki & Rute</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              Manajemen Halaman & Panduan
            </h2>
            <p className="text-xs text-gp-ink-300 max-w-2xl leading-relaxed">
              Kelola dokumen artikel ulasan teknis, panduan edukasi, serta kontrol publikasi rute website publik.
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
              <span>Tulis Panduan Baru</span>
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
              className="text-xs text-gp-ink-300 hover:text-white border-gp-ink-700"
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
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
              filterCategory === "all"
                ? "bg-gp-ink-700 text-white border border-gp-ink-600"
                : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800 border border-transparent"
            }`}
          >
            Semua ({nodes.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? "bg-hue-cyan-950/40 text-hue-cyan-400 border border-hue-cyan-500/40 font-bold"
                  : "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hierarchy Nodes Table */}
        <div className="rounded-2xl border border-gp-ink-700 bg-gp-ink-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[850px] font-sans">
              <thead className="bg-gp-ink-800/90 text-gp-ink-300 uppercase text-3xs font-mono tracking-wider border-b border-gp-ink-700">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 font-bold text-white min-w-[280px]">Halaman / Panduan</th>
                  <th className="py-3 px-3 font-bold min-w-[220px]">URL Publik</th>
                  <th className="py-3 px-3 font-bold min-w-[150px]">Kategori</th>
                  <th className="py-3 px-3 font-bold text-center min-w-[120px]">Status</th>
                  <th className="py-3 px-4 font-bold text-center min-w-[140px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gp-ink-750">
                {filteredNodes.map((node, idx) => {
                  const isLive = node.isPublished !== false;
                  return (
                    <tr
                      key={node.id}
                      className={`hover:bg-gp-ink-800/40 transition-colors group cursor-pointer ${
                        !isLive ? "opacity-75 bg-gp-ink-950/50" : ""
                      }`}
                      onClick={() => handleStartEdit(node)}
                    >
                      <td className="py-3 px-4 text-center font-mono text-gp-ink-400">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <FileText className={`w-4 h-4 flex-shrink-0 ${!isLive ? "text-hue-amber-500" : "text-hue-cyan-400"}`} />
                          <div>
                            <div className="font-bold text-white group-hover:text-hue-cyan-400 transition-colors flex items-center gap-2">
                              <span>{node.title}</span>
                              {!isLive && (
                                <span className="px-1.5 py-0.5 rounded text-4xs font-mono font-bold bg-hue-amber-500/10 text-hue-amber-400 border border-hue-amber-500/30">
                                  Draft
                                </span>
                              )}
                            </div>
                            {node.description && (
                              <div className="text-2xs text-gp-ink-300 line-clamp-1 max-w-sm mt-0.5">
                                {node.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTestTrigger(node);
                          }}
                          className="inline-flex items-center gap-1.5 font-mono font-bold text-hue-emerald-400 hover:text-hue-emerald-300 hover:underline text-2xs transition-colors"
                          title="Buka rute publik"
                        >
                          <span>{node.fullPath}</span>
                          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                        </button>
                      </td>

                      <td className="py-3 px-3 text-gp-ink-200 font-medium">
                        {node.category}
                      </td>

                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleTogglePublish(e, node)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-2xs font-mono font-bold transition-colors border ${
                            isLive
                              ? "bg-hue-emerald-500/10 text-hue-emerald-400 border-hue-emerald-500/30 hover:bg-hue-emerald-500/20"
                              : "bg-gp-ink-800 text-gp-ink-300 border-gp-ink-650 hover:bg-gp-ink-700"
                          }`}
                          title={isLive ? "Klik untuk sembunyikan dari publik" : "Klik untuk tampilkan ke publik"}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isLive ? "bg-hue-emerald-400 animate-pulse" : "bg-gp-ink-400"
                            }`}
                          />
                          <span>{isLive ? "Aktif" : "Draft"}</span>
                        </button>
                      </td>

                      <td
                        className="py-3 px-4 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Live Edit Button */}
                          <button
                            onClick={() => handleStartEdit(node)}
                            className="px-2.5 py-1 rounded bg-gp-ink-800 border border-gp-ink-650 hover:border-hue-cyan-400 text-gp-ink-100 hover:text-white flex items-center gap-1.5 text-xs font-mono transition-colors"
                          >
                            <Edit2 className="w-3 h-3 text-hue-cyan-400" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(node.id)}
                            className="p-1.5 rounded bg-gp-ink-800 border border-gp-ink-700 hover:bg-hue-rose-950/40 text-gp-ink-400 hover:text-hue-rose-400 transition-colors"
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
