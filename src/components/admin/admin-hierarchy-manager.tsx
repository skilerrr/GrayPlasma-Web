"use client";

import React, { useState, useRef } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Edit2,
  Trash2,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  Users,
  Activity,
  Sparkles,
  Award,
  Fingerprint,
  RotateCcw,
  Check,
  X,
  Clock,
  Search,
  Upload,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import {
  AdminUser,
  AdminRole,
  AdminActivityLog,
  DatabaseService,
  DEFAULT_ADMIN_USERS,
} from "@/lib/db-service";
import { compressImage } from "@/lib/image-compressor";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured, createCollaboratorAccount } from "@/lib/supabase";

interface AdminHierarchyManagerProps {
  admins: AdminUser[];
  currentAdmin: AdminUser | null;
  onUpdateAdmins: (newAdmins: AdminUser[]) => void;
  onSwitchSession: (admin: AdminUser) => void;
}

const ROLE_CONFIG: Record<
  AdminRole,
  { label: string; badgeClass: string; desc: string; icon: React.ReactNode }
> = {
  super_admin: {
    label: "Super Admin (Owner)",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    desc: "Hak akses penuh ke seluruh database, manajemen anggota tim admin, reset database, dan migrasi Supabase.",
    icon: <Award className="w-3.5 h-3.5 text-amber-400" />,
  },
  lead_reviewer: {
    label: "Lead Reviewer",
    badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    desc: "Hak mengelola database monitor live studio, pengujian laboratorium GTID, kurasi meja, dan aftersales.",
    icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />,
  },
  editor: {
    label: "Content Editor",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    desc: "Hak mengelola artikel panduan (/guide/...), FAQ, banner halaman, dan pengumuman ribbon.",
    icon: <Edit2 className="w-3.5 h-3.5 text-emerald-400" />,
  },
  contributor: {
    label: "Contributor / Tester",
    badgeClass: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    desc: "Hak draft monitor dan input hasil pengetesan sementara.",
    icon: <Users className="w-3.5 h-3.5 text-violet-400" />,
  },
};

const ALL_AVAILABLE_PERMISSIONS = [
  { id: "*", label: "Akses Penuh (All Permissions)" },
  { id: "monitors", label: "Database Monitor & Live Studio" },
  { id: "desks", label: "Katalog Meja & Dimensi Ergonomi" },
  { id: "peripherals", label: "Bracket Arm & Peripherals" },
  { id: "aftersales", label: "Evaluasi Brand & Kanban Aftersales" },
  { id: "hierarchy", label: "Hierarki Rute & Sandbox Panduan" },
  { id: "guides", label: "Knowledge Hub & Ulasan Artikel" },
  { id: "faq", label: "FAQ Knowledgebase" },
  { id: "banners", label: "Visual Banners & Cover" },
  { id: "settings", label: "Global Site Settings & Konsultasi" },
  { id: "admins", label: "Manajemen Tim Admin & PIN" },
];

export function AdminHierarchyManager({
  admins,
  currentAdmin,
  onUpdateAdmins,
  onSwitchSession,
}: AdminHierarchyManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"team" | "audit">("team");
  const [logs, setLogs] = useState<AdminActivityLog[]>(DatabaseService.getActivityLogs());
  const [logFilter, setLogFilter] = useState<string>("all");
  const [notice, setNotice] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<AdminUser>({
    id: "",
    name: "",
    username: "",
    role: "editor",
    roleTitle: "",
    avatar: "",
    pinCode: "",
    email: "",
    bio: "",
    permissions: ["guides", "faq"],
    createdAt: new Date().toISOString().split("T")[0],
  });

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleAvatarUploadForForm = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await compressImage(file, 400, 0.85);
      setFormData((prev) => ({ ...prev, avatar: res.dataUrl }));
      showNotice("Foto profil berhasil diunggah dan dioptimasi WebP!");
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah foto profil.");
    }
  };

  const handleDirectAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetAdmin: AdminUser) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await compressImage(file, 400, 0.85);
      const updatedUser: AdminUser = { ...targetAdmin, avatar: res.dataUrl };
      const updatedList = DatabaseService.saveAdminUser(updatedUser);
      onUpdateAdmins(updatedList);
      if (currentAdmin?.id === targetAdmin.id) {
        onSwitchSession(updatedUser);
        DatabaseService.setCurrentAdminSession(updatedUser);
      }
      setLogs(DatabaseService.getActivityLogs());
      showNotice(`Foto profil ${targetAdmin.name} berhasil diperbarui!`);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah foto profil.");
    }
  };

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setFormData({
      id: `admin-${Date.now()}`,
      name: "",
      username: "",
      role: "editor",
      roleTitle: "Content Editor",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      pinCode: "gp" + Math.floor(1000 + Math.random() * 9000),
      email: "",
      bio: "",
      permissions: ["guides", "faq"],
      createdAt: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingAdmin(user);
    setFormData({ ...user });
    setIsModalOpen(true);
  };

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = (formData.email || "").trim();
    if (!formData.name.trim() || !cleanEmail || !formData.pinCode.trim()) {
      alert("Nama, Email, dan Password/PIN wajib diisi!");
      return;
    }

    // If creating a brand new admin and Supabase is configured, create the real account
    if (isSupabaseConfigured && !editingAdmin) {
      const res = await createCollaboratorAccount({
        email: cleanEmail,
        password: formData.pinCode,
        name: formData.name,
        role: formData.role,
        roleTitle: formData.roleTitle,
        permissions: formData.permissions,
      });
      if (!res.success) {
        alert(`Perhatian Supabase: ${res.message}\nAkun tetap disimpan ke cache lokal.`);
      } else {
        showNotice(res.message);
      }
    }

    const updated = DatabaseService.saveAdminUser(formData);
    onUpdateAdmins(updated);
    if (currentAdmin?.id === formData.id) {
      onSwitchSession(formData);
      DatabaseService.setCurrentAdminSession(formData);
    }
    setLogs(DatabaseService.getActivityLogs());
    setIsModalOpen(false);
    showNotice(`Admin "${formData.name}" berhasil disimpan!`);
  };

  const handleDeleteAdmin = (id: string, name: string) => {
    if (admins.length <= 1) {
      alert("Tidak dapat menghapus admin terakhir!");
      return;
    }
    if (confirm(`Yakin ingin menghapus akses admin "${name}"?`)) {
      const updated = DatabaseService.deleteAdminUser(id);
      onUpdateAdmins(updated);
      setLogs(DatabaseService.getActivityLogs());
      showNotice(`Admin "${name}" telah dihapus.`);
    }
  };

  const handleResetAdmins = () => {
    if (confirm("Reset seluruh daftar admin ke tim bawaan (Joel Gray, GlaciK, Editor)?")) {
      const res = DatabaseService.resetAdminUsers();
      onUpdateAdmins(res);
      setLogs(DatabaseService.getActivityLogs());
      showNotice("Daftar admin telah di-reset ke akun bawaan.");
    }
  };

  const togglePermission = (permId: string) => {
    if (permId === "*") {
      setFormData({
        ...formData,
        permissions: formData.permissions.includes("*") ? [] : ["*"],
      });
      return;
    }

    let updated = [...formData.permissions.filter((p) => p !== "*")];
    if (updated.includes(permId)) {
      updated = updated.filter((p) => p !== permId);
    } else {
      updated.push(permId);
    }
    setFormData({ ...formData, permissions: updated });
  };

  const filteredLogs = logs.filter((l) => {
    if (logFilter === "all") return true;
    return l.targetType === logFilter || l.action === logFilter;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {notice && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-xs text-emerald-200 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header & Subtabs */}
      <div className="bg-surface-dark border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Hierarchy & Role-Based Access Control (RBAC)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Manajemen Tim Admin & Hak Akses
            </h3>
            <p className="text-xs text-zinc-400 max-w-2xl">
              Atur hierarki admin dari Super Admin (Joel Gray), Lead Reviewer (GlaciK), hingga Content Editor dan Contributor. Setiap anggota memiliki PIN dan wewenang khusus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetAdmins}
              className="text-xs border-zinc-700"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset Tim</span>
            </Button>
            <Button
              variant="cyber"
              size="sm"
              onClick={handleOpenAdd}
              className="text-xs font-bold"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              <span>Tambah Admin Baru</span>
            </Button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <button
            onClick={() => setActiveSubTab("team")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "team"
                ? "bg-zinc-800 text-amber-400 border border-amber-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Anggota Tim ({admins.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab("audit");
              setLogs(DatabaseService.getActivityLogs());
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "audit"
                ? "bg-zinc-800 text-cyan-400 border border-cyan-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Audit Trail & Activity Log ({logs.length})</span>
          </button>
        </div>

        {/* 1. TEAM HIERARCHY CARDS */}
        {activeSubTab === "team" && (
          <div className="space-y-6">
            {/* Current Active Session Indicator */}
            {currentAdmin && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative group cursor-pointer flex-shrink-0">
                    <img
                      src={currentAdmin.avatar}
                      alt={currentAdmin.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/60 shadow-lg shadow-amber-500/10 group-hover:opacity-75 transition-opacity"
                    />
                    <label
                      title="Ganti Foto Profil Anda"
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-5 h-5 text-amber-400" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleDirectAvatarUpload(e, currentAdmin)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">
                        Sesi Admin Aktif Saat Ini
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                        Online
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white">{currentAdmin.name}</h4>
                    <p className="text-xs text-zinc-400">
                      {currentAdmin.roleTitle} (@{currentAdmin.username})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ganti Foto Profil</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDirectAvatarUpload(e, currentAdmin)}
                      className="hidden"
                    />
                  </label>
                  <div className="text-right hidden md:block">
                    <span className="text-[10px] text-zinc-500 block">PIN Akses</span>
                    <span className="text-xs font-mono text-zinc-300 font-bold">•••••• ({currentAdmin.pinCode})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {admins.map((adm) => {
                const config = ROLE_CONFIG[adm.role] || ROLE_CONFIG.editor;
                const isCurrent = currentAdmin?.id === adm.id;

                return (
                  <div
                    key={adm.id}
                    className={`bg-zinc-950 border rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all ${
                      isCurrent
                        ? "border-amber-500/50 shadow-lg shadow-amber-500/5 bg-zinc-900/40"
                        : "border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative group cursor-pointer flex-shrink-0">
                            <img
                              src={adm.avatar}
                              alt={adm.name}
                              className="w-11 h-11 rounded-xl object-cover border border-zinc-800 group-hover:border-amber-500/50 transition-colors"
                            />
                            <label
                              title="Ganti Foto Profil"
                              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5 text-amber-400" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleDirectAvatarUpload(e, adm)}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white leading-tight">
                              {adm.name}
                            </h4>
                            <span className="text-[11px] text-zinc-400">
                              @{adm.username}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(adm)}
                            title="Edit Akun Admin"
                            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-emerald-400"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(adm.id, adm.name)}
                            title="Hapus Akun Admin"
                            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Role Badge */}
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${config.badgeClass}`}>
                        {config.icon}
                        <span>{config.label}</span>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {adm.bio || config.desc}
                      </p>

                      {/* Permissions Pills */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                          Wewenang & Hak Akses
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {adm.permissions.includes("*") ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                              ★ Full Super Admin
                            </span>
                          ) : (
                            adm.permissions.map((p) => (
                              <span
                                key={p}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono"
                              >
                                {p}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action / Switch Session Button */}
                    <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
                      <div className="text-[10px] text-zinc-500">
                        PIN: <span className="font-mono text-zinc-400 font-bold">{adm.pinCode}</span>
                      </div>

                      {!isCurrent ? (
                        <button
                          onClick={() => {
                            onSwitchSession(adm);
                            DatabaseService.setCurrentAdminSession(adm);
                            showNotice(`Berganti ke akun: ${adm.name} (${adm.role})`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-amber-400 transition-colors flex items-center gap-1"
                        >
                          <Fingerprint className="w-3 h-3 text-amber-400" />
                          <span>Ganti Sesi</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Akun Aktif</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. ACTIVITY AUDIT TRAIL */}
        {activeSubTab === "audit" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Filter Log:</span>
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">Semua Aksi & Modul</option>
                  <option value="monitor">Monitor</option>
                  <option value="desk">Meja & Aksesoris</option>
                  <option value="aftersales">Aftersales</option>
                  <option value="hierarchy">Hierarki & Panduan</option>
                  <option value="settings">Settings & Banner</option>
                  <option value="admin">Admin Users</option>
                </select>
              </div>

              <button
                onClick={() => {
                  if (confirm("Bersihkan seluruh riwayat audit log?")) {
                    const cleared = DatabaseService.clearActivityLogs();
                    setLogs(cleared);
                    showNotice("Audit log dibersihkan.");
                  }
                }}
                className="text-xs text-zinc-500 hover:text-rose-400 transition-colors"
              >
                Hapus Log Riwayat
              </button>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/60">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 italic">
                  Belum ada catatan aktivitas untuk filter ini.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-zinc-900/40">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl mt-0.5 ${
                        log.action === "create"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : log.action === "delete"
                          ? "bg-rose-500/10 text-rose-400"
                          : log.action === "sync" || log.action === "restore"
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{log.targetName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase">
                            {log.targetType}
                          </span>
                        </div>
                        {log.details && (
                          <p className="text-xs text-zinc-400 mt-0.5">{log.details}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 text-xs">
                      <span className="text-zinc-300 font-bold block">{log.adminName}</span>
                      <span className="text-[10px] text-zinc-500">{log.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Admin Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingAdmin ? "Edit Anggota Admin" : "Tambah Admin Baru"}
                  </h3>
                  <span className="text-xs text-zinc-400">Atur peran dan PIN kredensial</span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Joel Gray"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Username / Handle</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="gray1plasma"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Email Akun (Digunakan untuk Login) *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="collaborator@grayplasma.id"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Peran / Role Hierarki</label>
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      const newRole = e.target.value as AdminRole;
                      let roleTitle = "Content Editor";
                      let perms = ["guides", "faq"];
                      if (newRole === "super_admin") {
                        roleTitle = "Super Admin (Owner)";
                        perms = ["*"];
                      } else if (newRole === "lead_reviewer") {
                        roleTitle = "Lead Reviewer & Data Analyst";
                        perms = ["monitors", "desks", "peripherals", "aftersales", "guides"];
                      } else if (newRole === "contributor") {
                        roleTitle = "Lab Contributor";
                        perms = ["monitors"];
                      }
                      setFormData({ ...formData, role: newRole, roleTitle, permissions: perms });
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="super_admin">👑 Super Admin (Full Control)</option>
                    <option value="lead_reviewer">🛡️ Lead Reviewer (Lab & Monitor)</option>
                    <option value="editor">✍️ Content Editor (Articles & FAQ)</option>
                    <option value="contributor">🧪 Lab Contributor / Tester</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">PIN Password Masuk</label>
                  <input
                    type="text"
                    required
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    placeholder="PIN / Password"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-400">Foto Profil (Avatar)</label>
                  <label className="text-[11px] text-amber-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                    <Upload className="w-3 h-3" />
                    <span>Upload Foto Sendiri (WebP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUploadForForm}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={formData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"}
                    alt="Preview"
                    className="w-10 h-10 rounded-xl object-cover border border-amber-500/50 flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://... atau klik Upload Foto di samping"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Bio Singkat</label>
                <textarea
                  rows={2}
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Deskripsi peran dan tanggung jawab admin..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Granular Permissions Checklist */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="text-zinc-400 font-bold block">
                  Daftar Wewenang Modul (Granular Permissions):
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                  {ALL_AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked =
                      formData.permissions.includes("*") || formData.permissions.includes(perm.id);

                    return (
                      <label
                        key={perm.id}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-900 cursor-pointer text-[11px] text-zinc-300"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(perm.id)}
                          className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0"
                        />
                        <span>{perm.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="cyber" size="sm" className="font-bold">
                  Simpan Admin
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
