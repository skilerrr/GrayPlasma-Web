"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  PhoneCall,
  Save,
  RotateCcw,
  CheckCircle2,
  Search,
  MessageSquare,
  Shield,
  Layers,
  X,
  AlertTriangle,
  SlidersHorizontal,
  FileText,
} from "lucide-react";
import {
  NotionBoardCard,
  NotionBoardColumn,
} from "@/components/notion-kanban-board";
import { NOTION_AFTERSALES_COLUMNS } from "@/data/notion-aftersales-board-data";
import { DatabaseService } from "@/lib/db-service";
import { NotionRichEditor } from "@/components/admin/notion-rich-editor";
import { ProsConsManager } from "@/components/admin/pros-cons-manager";
import { Button } from "@/components/ui/button";

interface AdminAftersalesKanbanManagerProps {
  onRefresh?: () => void;
}

export function AdminAftersalesKanbanManager({ onRefresh }: AdminAftersalesKanbanManagerProps) {
  const [columns, setColumns] = useState<NotionBoardColumn[]>(NOTION_AFTERSALES_COLUMNS);
  const [cards, setCards] = useState<NotionBoardCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColumnFilter, setSelectedColumnFilter] = useState<string>("all");
  const [notice, setNotice] = useState<string | null>(null);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Partial<NotionBoardCard> | null>(null);
  const [prosText, setProsText] = useState("");
  const [consText, setConsText] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const loaded = await DatabaseService.getAftersalesCards();
      setCards(loaded);
    } catch (e) {
      console.error("Gagal memuat kartu aftersales", e);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
    onRefresh?.();
  };

  const handleOpenAdd = () => {
    setEditingCard({
      id: `brand-${Date.now()}`,
      title: "",
      columnId: "baik",
      tags: [{ label: "BAIK (BARE MINIMUM)", color: "green" }],
      contactUrl: "https://",
      phoneNumber: "-",
      sistemKlaim: "GANTI BARU / SWAP UNIT",
      createdDate: new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
      pros: [],
      cons: [],
      deepDiveTitle: "",
      deepDiveNote: "",
      discordUrl: "",
    });
    setProsText("");
    setConsText("");
    setTagsInput("BAIK, RESMI");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card: NotionBoardCard) => {
    setEditingCard({ ...card });
    setProsText((card.pros || []).join("\n"));
    setConsText((card.cons || []).join("\n"));
    setTagsInput((card.tags || []).map((t) => t.label).join(", "));
    setIsModalOpen(true);
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard || !editingCard.title) {
      alert("Mohon isi judul brand monitor.");
      return;
    }

    const prosList = Array.isArray(editingCard.pros) && editingCard.pros.length > 0
      ? editingCard.pros
      : prosText.split("\n").map((s) => s.trim()).filter(Boolean);
    const consList = Array.isArray(editingCard.cons) && editingCard.cons.length > 0
      ? editingCard.cons
      : consText.split("\n").map((s) => s.trim()).filter(Boolean);
    const parsedTags = tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((label, idx) => ({
        label,
        color: (idx % 2 === 0 ? "green" : "orange") as "green" | "orange" | "blue" | "red" | "gray",
      }));

    const cardToSave: NotionBoardCard = {
      id: editingCard.id || `brand-${Date.now()}`,
      title: editingCard.title,
      columnId: editingCard.columnId || "baik",
      tags: parsedTags.length > 0 ? parsedTags : [{ label: "DISTRIBUTOR RESMI", color: "green" }],
      contactUrl: editingCard.contactUrl,
      phoneNumber: editingCard.phoneNumber,
      sistemKlaim: editingCard.sistemKlaim,
      createdDate: editingCard.createdDate || "September 2026",
      pros: prosList,
      cons: consList,
      deepDiveTitle: editingCard.deepDiveTitle || `KUALITAS AFTERSALES ${editingCard.title}`,
      deepDiveNote: editingCard.deepDiveNote || "",
      discordUrl: editingCard.discordUrl,
    };

    const updated = await DatabaseService.saveAftersalesCard(cardToSave);
    setCards(updated);
    setIsModalOpen(false);
    setEditingCard(null);
    showNotice(`Kartu Aftersales "${cardToSave.title}" berhasil disimpan!`);
  };

  const handleDeleteCard = async (id: string, title: string) => {
    if (confirm(`Hapus evaluasi aftersales untuk "${title}"?`)) {
      const updated = await DatabaseService.deleteAftersalesCard(id);
      setCards(updated);
      showNotice(`Kartu "${title}" telah dihapus.`);
    }
  };

  const handleResetCards = () => {
    if (confirm("Kembalikan seluruh kartu aftersales ke template awal bawaan?")) {
      const defCards = DatabaseService.resetAftersalesCards();
      setCards(defCards);
      showNotice("Data aftersales dikembalikan ke default.");
    }
  };

  const filteredCards = cards.filter((card) => {
    if (selectedColumnFilter !== "all" && card.columnId !== selectedColumnFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        card.title.toLowerCase().includes(q) ||
        card.sistemKlaim?.toLowerCase().includes(q) ||
        card.tags.some((t) => t.label.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {notice && (
        <div className="p-3.5 bg-hue-emerald-950/90 border border-hue-emerald-500/50 rounded-2xl text-xs text-hue-emerald-200 font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-hue-emerald-400 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="bg-gp-ink-900 border border-gp-ink-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gp-ink-700 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hue-amber-500/10 border border-hue-amber-500/30 text-hue-amber-400 text-xs font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Aftersales & RMA Kanban Studio</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Manajemen Evaluasi Brand & Aftersales
            </h3>
            <p className="text-xs text-gp-ink-300 max-w-2xl leading-relaxed">
              Kelola kartu ulasan brand monitor pada papan Kanban publik (/guide/brand/aftersales-rma). Atur sistem klaim, hotline resmi distributor, SLA garansi, dan analisis mendalam.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetCards}
              className="text-xs text-gp-ink-300 hover:text-white border-gp-ink-700"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Reset Default</span>
            </Button>
            <Button
              type="button"
              variant="cyber"
              size="sm"
              onClick={handleOpenAdd}
              className="text-xs font-bold bg-hue-amber-500 text-black hover:bg-hue-amber-400 shadow-md"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>+ Tambah Brand Evaluasi</span>
            </Button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gp-ink-950 p-3 rounded-2xl border border-gp-ink-700">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setSelectedColumnFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedColumnFilter === "all"
                  ? "bg-gp-ink-700 text-white font-bold"
                  : "text-gp-ink-300 hover:text-white"
              }`}
            >
              Semua Kolom ({cards.length})
            </button>
            {columns.map((col) => {
              const colCount = cards.filter((c) => c.columnId === col.id).length;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedColumnFilter(col.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedColumnFilter === col.id
                      ? col.color === "green"
                        ? "bg-gp-mint-900 text-gp-mint font-bold border border-gp-mint/30"
                        : col.color === "red"
                        ? "bg-gp-coral-800 text-gp-coral font-bold border border-gp-coral/30"
                        : "bg-gp-ember-400 text-gp-ember font-bold border border-gp-ember/30"
                      : "text-gp-ink-300 hover:text-white"
                  }`}
                >
                  {col.title} ({colCount})
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gp-ink-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari brand aftersales..."
              className="w-full bg-gp-ink-800 border border-gp-ink-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gp-ink-400 focus:outline-none focus:border-hue-amber-500/60"
            />
          </div>
        </div>

        {/* Kanban Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colCards = filteredCards.filter((c) => c.columnId === col.id);

            return (
              <div key={col.id} className="space-y-3 bg-gp-ink-950/60 border border-gp-ink-700/80 rounded-2xl p-4 min-w-[280px]">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-gp-ink-700">
                  <span
                    className={`text-2xs font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
                      col.color === "green"
                        ? "bg-gp-mint-900 text-gp-mint"
                        : col.color === "red"
                        ? "bg-gp-coral-800 text-gp-coral"
                        : "bg-gp-ember-400 text-gp-ember"
                    }`}
                  >
                    {col.title}
                  </span>
                  <span className="text-xs text-gp-ink-400 font-mono font-bold">{colCards.length}</span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {colCards.map((card) => (
                    <div
                      key={card.id}
                      className="p-3.5 rounded-xl bg-gp-ink-800 border border-gp-ink-700 hover:border-gp-ink-600 transition-colors space-y-2.5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-xs leading-snug">{card.title}</h4>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(card)}
                            className="p-1 rounded-lg hover:bg-gp-ink-700 text-gp-ink-300 hover:text-white"
                            title="Edit Kartu"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCard(card.id, card.title)}
                            className="p-1 rounded-lg hover:bg-gp-ink-700 text-gp-ink-400 hover:text-hue-red-400"
                            title="Hapus"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {card.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-4xs font-bold bg-gp-ink-800 text-gp-ink-200 border border-gp-ink-700"
                          >
                            {t.label}
                          </span>
                        ))}
                      </div>

                      {/* Info Grid */}
                      <div className="text-3xs text-gp-ink-300 space-y-1 font-mono pt-1 border-t border-gp-ink-700/60">
                        {card.sistemKlaim && (
                          <div className="flex items-center justify-between">
                            <span className="text-gp-ink-400">Klaim:</span>
                            <span className="text-hue-emerald-400 font-bold">{card.sistemKlaim}</span>
                          </div>
                        )}
                        {card.phoneNumber && card.phoneNumber !== "Empty" && card.phoneNumber !== "-" && (
                          <div className="flex items-center justify-between">
                            <span className="text-gp-ink-400">Hotline:</span>
                            <span className="text-white">{card.phoneNumber}</span>
                          </div>
                        )}
                      </div>

                      {/* Deep-dive note indicator */}
                      {card.deepDiveNote && (
                        <div className="text-3xs text-hue-amber-400/90 italic flex items-center gap-1 pt-1">
                          <FileText className="w-3 h-3 text-hue-amber-400" />
                          <span>Ulasan mendalam tersedia</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {colCards.length === 0 && (
                    <div className="text-center py-8 text-gp-ink-500 text-xs italic border border-dashed border-gp-ink-700 rounded-xl">
                      Tidak ada kartu pada kolom ini.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AFTERSALES CARD EDIT MODAL WITH WYSIWYG EDITOR                             */}
      {/* ========================================================================= */}
      {isModalOpen && editingCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-gp-ink-900 border border-gp-ink-600/80 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Fixed Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gp-ink-700 bg-gp-ink-850 flex-shrink-0">
              <span className="font-bold text-white text-sm uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-hue-amber-400" />
                <span>{editingCard.title ? `Edit Evaluasi: ${editingCard.title}` : "Tambah Brand Evaluasi Baru"}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCard(null);
                }}
                className="p-1 rounded-lg text-gp-ink-300 hover:text-white hover:bg-gp-ink-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form with Scrollable Body & Fixed Footer */}
            <form onSubmit={handleSaveCard} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-gp-ink-200 block mb-1 font-semibold">Nama Brand & Entitas SC</label>
                    <input
                      type="text"
                      required
                      value={editingCard.title || ""}
                      onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                      placeholder="Contoh: ASUS MONITOR (SC ASTRINDO)"
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-hue-amber-400 placeholder:text-gp-ink-400"
                    />
                  </div>
                  <div>
                    <label className="text-gp-ink-200 block mb-1 font-semibold">Kolom Kategori Kanban</label>
                    <select
                      value={editingCard.columnId || "baik"}
                      onChange={(e) => setEditingCard({ ...editingCard, columnId: e.target.value })}
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-hue-amber-400 font-bold"
                    >
                      <option value="baik">BAIK (BARE MINIMUM) - Hijau</option>
                      <option value="biasa">BIASA SAJA - Abu/Oranye</option>
                      <option value="kurang">KURANG BAIK - Merah</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-gp-ink-200 block mb-1 font-semibold">Sistem Klaim Garansi</label>
                    <input
                      type="text"
                      value={editingCard.sistemKlaim || ""}
                      onChange={(e) => setEditingCard({ ...editingCard, sistemKlaim: e.target.value })}
                      placeholder="Contoh: GANTI BARU / SWAP UNIT"
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2.5 text-hue-emerald-400 font-mono font-semibold focus:outline-none focus:border-hue-amber-400 placeholder:text-gp-ink-400"
                    />
                  </div>
                  <div>
                    <label className="text-gp-ink-200 block mb-1 font-semibold">Nomor Hotline / Telepon</label>
                    <input
                      type="text"
                      value={editingCard.phoneNumber || ""}
                      onChange={(e) => setEditingCard({ ...editingCard, phoneNumber: e.target.value })}
                      placeholder="Contoh: 1500 128"
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-hue-amber-400 placeholder:text-gp-ink-400"
                    />
                  </div>
                  <div>
                    <label className="text-gp-ink-200 block mb-1 font-semibold">Tags (Pisahkan koma)</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="BAIK, ONSITE, 3 TAHUN"
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-hue-amber-400 placeholder:text-gp-ink-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gp-ink-200 block mb-1 font-semibold">URL Portal Service / Serial Checker</label>
                  <input
                    type="text"
                    value={editingCard.contactUrl || ""}
                    onChange={(e) => setEditingCard({ ...editingCard, contactUrl: e.target.value })}
                    placeholder="https://www.asus.com/id/support/..."
                    className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2.5 text-hue-sky-400 font-mono focus:outline-none focus:border-hue-amber-400 placeholder:text-gp-ink-400"
                  />
                </div>

                <ProsConsManager
                  pros={editingCard.pros || []}
                  cons={editingCard.cons || []}
                  onChangePros={(newPros) => {
                    setEditingCard({ ...editingCard, pros: newPros });
                    setProsText(newPros.join("\n"));
                  }}
                  onChangeCons={(newCons) => {
                    setEditingCard({ ...editingCard, cons: newCons });
                    setConsText(newCons.join("\n"));
                  }}
                  title="Kelebihan & Kekurangan Layanan Garansi"
                />

                {/* Rich WYSIWYG Editor for Deep-Dive Analysis */}
                <div>
                  <label className="text-gp-ink-200 block mb-1.5 font-semibold flex items-center justify-between">
                    <span>Ulasan Mendalam & Dokumen Analisis Lab (Visual WYSIWYG):</span>
                    <span className="text-2xs text-hue-amber-400 font-mono font-medium">Tampil pada Side Panel Ulasan</span>
                  </label>
                  <NotionRichEditor
                    value={editingCard.deepDiveNote || ""}
                    onChange={(val) => setEditingCard({ ...editingCard, deepDiveNote: val })}
                    minHeight="min-h-[200px]"
                    placeholder="Tulis ulasan mendalam seputar kebijakan RMA, garansi dead pixel, dan pengalaman pengguna..."
                  />
                </div>
              </div>

              {/* Fixed Footer Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-gp-ink-700 bg-gp-ink-950 flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCard(null);
                  }}
                  className="border-gp-ink-600 text-gp-ink-200 hover:text-white hover:bg-gp-ink-700"
                >
                  Batal
                </Button>
                <Button type="submit" variant="cyber" size="sm" className="bg-hue-amber-500 hover:bg-hue-amber-400 text-black font-bold shadow-lg shadow-hue-amber-500/10">
                  Simpan Kartu Aftersales
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
