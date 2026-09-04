"use client";

import React, { useState } from "react";
import {
  BookOpen,
  HelpCircle,
  SunMedium,
  Layers,
  ShieldAlert,
  SlidersHorizontal,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  Search,
  Check,
  X,
  User,
  Heart,
  FileText,
  Flame,
  AlertTriangle,
} from "lucide-react";
import {
  FAQItem,
  DeskGuide,
  HDRGuide,
  GrayNoteItem,
  AvoidBrandItem,
  BandwidthGuidance,
  DatabaseService,
} from "@/lib/db-service";
import { NotionRichEditor } from "@/components/admin/notion-rich-editor";
import { WordFullpageEditor } from "@/components/admin/word-fullpage-editor";
import { Button } from "@/components/ui/button";

interface GuidesKnowledgeManagerProps {
  onRefresh?: () => void;
}

export function GuidesKnowledgeManager({ onRefresh }: GuidesKnowledgeManagerProps) {
  const [activeTab, setActiveTab] = useState<
    "faq" | "desk_guide" | "hdr_guide" | "graynotes" | "brands_avoid" | "bandwidth" | "about"
  >("faq");

  // Local data states
  const [faqList, setFaqList] = useState<FAQItem[]>(DatabaseService.getFAQ());
  const [deskGuides, setDeskGuides] = useState<DeskGuide[]>(DatabaseService.getDeskGuides());
  const [hdrGuides, setHdrGuides] = useState<HDRGuide[]>(DatabaseService.getHDRGuides());
  const [graynotes, setGraynotes] = useState<GrayNoteItem[]>(DatabaseService.getGrayNotes());
  const [brandsAvoid, setBrandsAvoid] = useState<AvoidBrandItem[]>(DatabaseService.getBrandsToAvoid());
  const [bandwidths, setBandwidths] = useState<BandwidthGuidance[]>(DatabaseService.getBandwidthGuides());
  const [aboutContent, setAboutContent] = useState(DatabaseService.getAboutContent());

  const [notice, setNotice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  const [editingDeskGuide, setEditingDeskGuide] = useState<DeskGuide | null>(null);
  const [editingDeskIndex, setEditingDeskIndex] = useState<number | null>(null);

  const [editingHdrGuide, setEditingHdrGuide] = useState<HDRGuide | null>(null);
  const [editingHdrIndex, setEditingHdrIndex] = useState<number | null>(null);

  const [editingGraynote, setEditingGraynote] = useState<GrayNoteItem | null>(null);
  const [isGraynoteModalOpen, setIsGraynoteModalOpen] = useState(false);

  const [editingAvoidBrand, setEditingAvoidBrand] = useState<AvoidBrandItem | null>(null);
  const [isAvoidModalOpen, setIsAvoidModalOpen] = useState(false);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
    onRefresh?.();
  };

  // 1. FAQ Actions
  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    const updated = DatabaseService.saveFAQ(editingFaq);
    setFaqList(updated);
    setIsFaqModalOpen(false);
    showNotice(`FAQ "${editingFaq.question.substring(0, 30)}..." disimpan.`);
  };

  const handleDeleteFaq = (id: string) => {
    if (confirm("Hapus pertanyaan FAQ ini?")) {
      const updated = DatabaseService.deleteFAQ(id);
      setFaqList(updated);
      showNotice("FAQ dihapus.");
    }
  };

  // 2. Desk Guides Actions
  const handleSaveDeskGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeskGuide || editingDeskIndex === null) return;
    const copy = [...deskGuides];
    if (editingDeskIndex >= 0) copy[editingDeskIndex] = editingDeskGuide;
    else copy.push(editingDeskGuide);
    DatabaseService.saveDeskGuides(copy);
    setDeskGuides(copy);
    setEditingDeskGuide(null);
    setEditingDeskIndex(null);
    showNotice("Pedoman ukuran meja berhasil disimpan.");
  };

  // 3. HDR Guides Actions
  const handleSaveHdrGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHdrGuide || editingHdrIndex === null) return;
    const copy = [...hdrGuides];
    if (editingHdrIndex >= 0) copy[editingHdrIndex] = editingHdrGuide;
    else copy.push(editingHdrGuide);
    DatabaseService.saveHDRGuides(copy);
    setHdrGuides(copy);
    setEditingHdrGuide(null);
    setEditingHdrIndex(null);
    showNotice("Klasifikasi tier HDR berhasil disimpan.");
  };

  // 4. GrayNotes Actions
  const handleSaveGraynote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGraynote) return;
    const copy = [...graynotes];
    const idx = copy.findIndex((g) => g.id === editingGraynote.id);
    if (idx >= 0) copy[idx] = editingGraynote;
    else copy.push(editingGraynote);
    DatabaseService.saveGrayNotes(copy);
    setGraynotes(copy);
    setIsGraynoteModalOpen(false);
    showNotice(`GrayNote "${editingGraynote.title}" disimpan.`);
  };

  const handleDeleteGraynote = (id: string) => {
    if (confirm("Hapus catatan teknis GrayNote ini?")) {
      const copy = graynotes.filter((g) => g.id !== id);
      DatabaseService.saveGrayNotes(copy);
      setGraynotes(copy);
      showNotice("GrayNote dihapus.");
    }
  };

  // 5. Avoid Brands Actions
  const handleSaveAvoidBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAvoidBrand) return;
    const copy = [...brandsAvoid];
    const idx = copy.findIndex((b) => b.brand === editingAvoidBrand.brand);
    if (idx >= 0) copy[idx] = editingAvoidBrand;
    else copy.push(editingAvoidBrand);
    DatabaseService.saveBrandsToAvoid(copy);
    setBrandsAvoid(copy);
    setIsAvoidModalOpen(false);
    showNotice(`Catatan waspada brand "${editingAvoidBrand.brand}" disimpan.`);
  };

  const handleDeleteAvoidBrand = (brand: string) => {
    if (confirm(`Hapus catatan waspada brand "${brand}"?`)) {
      const copy = brandsAvoid.filter((b) => b.brand !== brand);
      DatabaseService.saveBrandsToAvoid(copy);
      setBrandsAvoid(copy);
      showNotice("Catatan brand dihapus.");
    }
  };

  // 6. About Content Actions
  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    DatabaseService.saveAboutContent(aboutContent);
    showNotice("Profil Joel Gray & latar belakang website disimpan.");
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-xs text-emerald-200 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="bg-surface-dark border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Knowledge Hub & Notion Articles</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Pusat Edukasi & Artikel Panduan
            </h3>
            <p className="text-xs text-zinc-400 max-w-2xl">
              Kelola FAQ lengkap, panduan ukuran meja & jarak pandang, klasifikasi HDR, GrayNotes tips teknis, catatan waspada brand ODM, dan profil penulis.
            </p>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "faq"
                ? "bg-zinc-800 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ Knowledgebase ({faqList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("desk_guide")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "desk_guide"
                ? "bg-zinc-800 text-cyan-400 border border-cyan-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Panduan Meja & Jarak ({deskGuides.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("hdr_guide")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "hdr_guide"
                ? "bg-zinc-800 text-amber-400 border border-amber-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <SunMedium className="w-3.5 h-3.5" />
            <span>HDR & OLED Tiers ({hdrGuides.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("graynotes")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "graynotes"
                ? "bg-zinc-800 text-pink-400 border border-pink-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>GrayNotes Library ({graynotes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("brands_avoid")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "brands_avoid"
                ? "bg-zinc-800 text-rose-400 border border-rose-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Brands to Avoid ({brandsAvoid.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("bandwidth")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "bandwidth"
                ? "bg-zinc-800 text-violet-400 border border-violet-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kabel & Bandwidth ({bandwidths.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === "about"
                ? "bg-zinc-800 text-yellow-400 border border-yellow-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Tentang & Profil Penulis</span>
          </button>
        </div>

        {/* 1. FAQ KNOWLEDGEBASE TAB */}
        {activeTab === "faq" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari pertanyaan FAQ..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm("Reset FAQ ke daftar bawaan?")) {
                      const res = DatabaseService.resetFAQ();
                      setFaqList(res);
                      showNotice("FAQ di-reset ke default.");
                    }
                  }}
                  className="text-xs border-zinc-700"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  <span>Reset FAQ</span>
                </Button>
                <Button
                  variant="cyber"
                  size="sm"
                  onClick={() => {
                    setEditingFaq({
                      id: `faq-${Date.now()}`,
                      question: "",
                      answer: "",
                      category: "Panduan Memilih",
                      important: false,
                    });
                    setIsFaqModalOpen(true);
                  }}
                  className="text-xs font-bold"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Tambah Pertanyaan FAQ</span>
                </Button>
              </div>
            </div>

            {/* FAQ List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqList
                .filter(
                  (f) =>
                    !searchQuery.trim() ||
                    `${f.question} ${f.answer} ${f.category || ""}`
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 font-bold uppercase">
                            {faq.category || "General"}
                          </span>
                          {faq.important && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                              ★ Featured
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingFaq(faq);
                              setIsFaqModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-emerald-400"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-black text-white">{faq.question}</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-xl">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 2. DESK DEPTH GUIDES TAB */}
        {activeTab === "desk_guide" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <div>
                <h4 className="text-sm font-bold text-white">Tabel Pedoman Ukuran Meja & Ergonomi</h4>
                <p className="text-xs text-zinc-400">Atur rentang kedalaman meja, ukuran monitor ideal, dan rekomendasi bracket gas spring.</p>
              </div>
              <Button
                variant="cyber"
                size="sm"
                onClick={() => {
                  setEditingDeskIndex(-1);
                  setEditingDeskGuide({
                    deskDepth: "Kedalaman Baru",
                    recommendedSizes: "24 Inci s/d 27 Inci",
                    viewingDistance: "50 cm - 60 cm",
                    notes: "Catatan ergonomi...",
                    monitorArmRecommendation: "North Bayou F80",
                  });
                }}
                className="text-xs font-bold"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Tambah Pedoman Meja</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deskGuides.map((guide, idx) => (
                <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-black text-cyan-400">{guide.deskDepth}</h4>
                    <button
                      onClick={() => {
                        setEditingDeskIndex(idx);
                        setEditingDeskGuide({ ...guide });
                      }}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-cyan-400"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-zinc-300 space-y-2 bg-zinc-900/60 p-3 rounded-xl">
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Ukuran Layar:</span>
                      <span className="text-white font-semibold">{guide.recommendedSizes}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Jarak Pandang:</span>
                      <span className="text-white font-semibold">{guide.viewingDistance}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Rekomendasi Arm:</span>
                      <span className="text-emerald-400 font-semibold">{guide.monitorArmRecommendation}</span>
                    </div>
                    <div className="text-zinc-400 pt-1 border-t border-zinc-800">{guide.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. HDR & OLED TIERS TAB */}
        {activeTab === "hdr_guide" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <div>
                <h4 className="text-sm font-bold text-white">Klasifikasi Tingkatan HDR & OLED</h4>
                <p className="text-xs text-zinc-400">Edukasi True HDR vs Decent HDR vs Fake HDR 400.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hdrGuides.map((hdr, idx) => (
                <div key={hdr.tier} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-black ${
                      hdr.tier === "TRUE HDR"
                        ? "bg-amber-500 text-black"
                        : hdr.tier === "DECENT HDR"
                        ? "bg-cyan-500 text-black"
                        : "bg-zinc-800 text-zinc-400"
                    }`}>
                      {hdr.tier}
                    </span>
                    <button
                      onClick={() => {
                        setEditingHdrIndex(idx);
                        setEditingHdrGuide({ ...hdr });
                      }}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-zinc-300 space-y-2 bg-zinc-900/60 p-3 rounded-xl">
                    <div><strong>Syarat:</strong> {hdr.requirements}</div>
                    <div><strong>Contrast:</strong> {hdr.contrastRatio}</div>
                    <div><strong>Brightness:</strong> {hdr.peakBrightness}</div>
                    <div><strong>Verdict:</strong> {hdr.verdict}</div>
                    <div><strong>Contoh:</strong> {hdr.models.join(", ")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. GRAYNOTES TECHNICAL LIBRARY TAB */}
        {activeTab === "graynotes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <div>
                <h4 className="text-sm font-bold text-white">GrayNotes Technical Library</h4>
                <p className="text-xs text-zinc-400">Catatan mendalam seputar Overdrive, DisplayPort, OLED Care, dan Dead Pixel.</p>
              </div>
              <Button
                variant="cyber"
                size="sm"
                onClick={() => {
                  setEditingGraynote({
                    id: `note-${Date.now()}`,
                    title: "",
                    category: "DisplayPort vs HDMI",
                    summary: "",
                    details: ["Poin 1", "Poin 2"],
                    warning: "",
                    recommendation: "",
                  });
                  setIsGraynoteModalOpen(true);
                }}
                className="text-xs font-bold"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Tambah GrayNote Baru</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {graynotes.map((gn) => (
                <div key={gn.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/30 font-bold uppercase">
                        {gn.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{gn.title}</h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingGraynote(gn);
                          setIsGraynoteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-pink-400"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGraynote(gn.id)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-xl">
                    {gn.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. BRANDS TO AVOID TAB */}
        {activeTab === "brands_avoid" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <div>
                <h4 className="text-sm font-bold text-white">Daftar Catatan Brand Waspada & ODM</h4>
                <p className="text-xs text-zinc-400">Edukasi transparansi mengenai kelemahan produk dan histori RMA.</p>
              </div>
              <Button
                variant="cyber"
                size="sm"
                onClick={() => {
                  setEditingAvoidBrand({
                    brand: "",
                    category: "Catatan Kualitas",
                    issue: "",
                    authorNote: "",
                    details: ["Poin 1"],
                  });
                  setIsAvoidModalOpen(true);
                }}
                className="text-xs font-bold"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Tambah Catatan Brand</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brandsAvoid.map((ba) => (
                <div key={ba.brand} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold uppercase">
                        {ba.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{ba.brand}</h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingAvoidBrand(ba);
                          setIsAvoidModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-rose-400"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAvoidBrand(ba.brand)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-xl">
                    {ba.issue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. CABLE & BANDWIDTH TAB */}
        {activeTab === "bandwidth" && (
          <div className="space-y-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <h4 className="text-sm font-bold text-white">Tabel Interface DisplayPort & HDMI Matrix</h4>
              <p className="text-xs text-zinc-400">Data teknis bandwidth transmisi dan kompresi DSC.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bandwidths.map((bw) => (
                <div key={bw.interface} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-2 text-xs">
                  <h4 className="text-sm font-black text-violet-400">{bw.interface}</h4>
                  <div className="text-zinc-300 space-y-1 bg-zinc-900/60 p-3 rounded-xl">
                    <div><strong>Bandwidth:</strong> {bw.bandwidth}</div>
                    <div><strong>Resolusi Maksimal:</strong> {bw.maxResolutionHz}</div>
                    <div><strong>Color Depth:</strong> {bw.colorDepth}</div>
                    <div><strong>Dukungan DSC:</strong> {bw.dscSupport}</div>
                    <div className="text-zinc-400 pt-1">{bw.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. ABOUT & AUTHOR STORY TAB */}
        {activeTab === "about" && (
          <form onSubmit={handleSaveAbout} className="space-y-4 max-w-3xl text-xs">
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <h4 className="font-bold text-yellow-400 uppercase text-xs">
                Tentang Website & Profil Joel Gray
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Judul Halaman</label>
                  <input
                    type="text"
                    value={aboutContent.title}
                    onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Penulis Utama</label>
                  <input
                    type="text"
                    value={aboutContent.author}
                    onChange={(e) => setAboutContent({ ...aboutContent, author: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Latar Belakang Proyek</label>
                <textarea
                  rows={4}
                  value={aboutContent.latarBelakang}
                  onChange={(e) => setAboutContent({ ...aboutContent, latarBelakang: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-yellow-400 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Biodata & Cerita Penulis (Joel Gray)</label>
                <textarea
                  rows={4}
                  value={aboutContent.biodataPenulis}
                  onChange={(e) => setAboutContent({ ...aboutContent, biodataPenulis: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-yellow-400 leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="cyber" size="sm" className="font-bold flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Profil & Cerita</span>
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Full-Page Word Editor for FAQ */}
      {isFaqModalOpen && editingFaq && (
        <WordFullpageEditor
          isOpen={isFaqModalOpen}
          documentTypeLabel="FAQ KNOWLEDGEBASE"
          initialData={{
            id: editingFaq.id,
            title: editingFaq.question,
            category: editingFaq.category || "Panduan Memilih",
            isImportant: editingFaq.important || false,
            content: editingFaq.answer,
          }}
          onSave={(savedDoc) => {
            const updatedFaq: FAQItem = {
              id: savedDoc.id || editingFaq.id,
              question: savedDoc.title,
              category: savedDoc.category || "General",
              important: savedDoc.isImportant || false,
              answer: savedDoc.content,
            };
            const updated = DatabaseService.saveFAQ(updatedFaq);
            setFaqList(updated);
            setIsFaqModalOpen(false);
            setEditingFaq(null);
            showNotice(`FAQ "${updatedFaq.question.substring(0, 30)}..." berhasil disimpan.`);
          }}
          onClose={() => {
            setIsFaqModalOpen(false);
            setEditingFaq(null);
          }}
        />
      )}

      {/* Desk Guide Modal */}
      {editingDeskGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-base font-bold text-white">Edit Pedoman Ukuran Meja</h3>
            <form onSubmit={handleSaveDeskGuide} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Rentang Kedalaman Meja</label>
                <input
                  type="text"
                  required
                  value={editingDeskGuide.deskDepth}
                  onChange={(e) => setEditingDeskGuide({ ...editingDeskGuide, deskDepth: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-cyan-400 font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Rekomendasi Ukuran Monitor</label>
                <input
                  type="text"
                  required
                  value={editingDeskGuide.recommendedSizes}
                  onChange={(e) => setEditingDeskGuide({ ...editingDeskGuide, recommendedSizes: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Jarak Pandang Ideal</label>
                <input
                  type="text"
                  required
                  value={editingDeskGuide.viewingDistance}
                  onChange={(e) => setEditingDeskGuide({ ...editingDeskGuide, viewingDistance: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Rekomendasi Monitor Arm</label>
                <input
                  type="text"
                  value={editingDeskGuide.monitorArmRecommendation}
                  onChange={(e) => setEditingDeskGuide({ ...editingDeskGuide, monitorArmRecommendation: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-emerald-400 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Catatan</label>
                <textarea
                  rows={2}
                  value={editingDeskGuide.notes}
                  onChange={(e) => setEditingDeskGuide({ ...editingDeskGuide, notes: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingDeskGuide(null)}>
                  Batal
                </Button>
                <Button type="submit" variant="cyber" size="sm" className="font-bold">
                  Simpan Pedoman
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HDR Guide Modal */}
      {editingHdrGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-base font-bold text-white">Edit Klasifikasi HDR</h3>
            <form onSubmit={handleSaveHdrGuide} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Nama Tier HDR</label>
                <input
                  type="text"
                  disabled
                  value={editingHdrGuide.tier}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-amber-400 font-black"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Syarat Panel / Local Dimming</label>
                <input
                  type="text"
                  value={editingHdrGuide.requirements}
                  onChange={(e) => setEditingHdrGuide({ ...editingHdrGuide, requirements: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Contrast Ratio</label>
                <input
                  type="text"
                  value={editingHdrGuide.contrastRatio}
                  onChange={(e) => setEditingHdrGuide({ ...editingHdrGuide, contrastRatio: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Peak Brightness</label>
                <input
                  type="text"
                  value={editingHdrGuide.peakBrightness}
                  onChange={(e) => setEditingHdrGuide({ ...editingHdrGuide, peakBrightness: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Verdict Ulasan</label>
                <textarea
                  rows={2}
                  value={editingHdrGuide.verdict}
                  onChange={(e) => setEditingHdrGuide({ ...editingHdrGuide, verdict: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingHdrGuide(null)}>
                  Batal
                </Button>
                <Button type="submit" variant="cyber" size="sm" className="font-bold">
                  Simpan Tier HDR
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-Page Word Editor for GrayNote */}
      {isGraynoteModalOpen && editingGraynote && (
        <WordFullpageEditor
          isOpen={isGraynoteModalOpen}
          documentTypeLabel="GRAYNOTE TECHNICAL ARTICLE"
          initialData={{
            id: editingGraynote.id,
            title: editingGraynote.title,
            category: editingGraynote.category || "DisplayPort vs HDMI",
            content: editingGraynote.summary,
          }}
          onSave={(savedDoc) => {
            const updatedGn: GrayNoteItem = {
              id: savedDoc.id || editingGraynote.id,
              title: savedDoc.title,
              category: savedDoc.category || "DisplayPort vs HDMI",
              summary: savedDoc.content,
              details: editingGraynote.details || [],
              warning: editingGraynote.warning || "",
              recommendation: editingGraynote.recommendation || "",
            };
            const copy = [...graynotes];
            const idx = copy.findIndex((g) => g.id === updatedGn.id);
            if (idx >= 0) copy[idx] = updatedGn;
            else copy.push(updatedGn);
            DatabaseService.saveGrayNotes(copy);
            setGraynotes(copy);
            setIsGraynoteModalOpen(false);
            setEditingGraynote(null);
            showNotice(`GrayNote "${updatedGn.title}" berhasil disimpan.`);
          }}
          onClose={() => {
            setIsGraynoteModalOpen(false);
            setEditingGraynote(null);
          }}
        />
      )}

      {/* Avoid Brand Modal */}
      {isAvoidModalOpen && editingAvoidBrand && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-base font-bold text-white">Edit Catatan Brand Waspada</h3>
            <form onSubmit={handleSaveAvoidBrand} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Nama Brand / Seri</label>
                <input
                  type="text"
                  required
                  value={editingAvoidBrand.brand}
                  onChange={(e) => setEditingAvoidBrand({ ...editingAvoidBrand, brand: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-rose-400 font-bold focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Kategori Masalah</label>
                <input
                  type="text"
                  value={editingAvoidBrand.category}
                  onChange={(e) => setEditingAvoidBrand({ ...editingAvoidBrand, category: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Poin Isu / Masalah Utama</label>
                <textarea
                  rows={2}
                  value={editingAvoidBrand.issue}
                  onChange={(e) => setEditingAvoidBrand({ ...editingAvoidBrand, issue: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAvoidModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="cyber" size="sm" className="font-bold">
                  Simpan Catatan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
