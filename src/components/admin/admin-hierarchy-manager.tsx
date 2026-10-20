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
    badgeClass: "bg-hue-amber-500/10 text-hue-amber-400 border-hue-amber-500/30",
    desc: "Hak akses penuh ke seluruh database, manajemen anggota tim admin, reset database, dan migrasi Supabase.",
    icon: <Award className="w-3.5 h-3.5 text-hue-amber-400" />,
  },
  lead_reviewer: {
    label: "Lead Reviewer",
    badgeClass: "bg-hue-cyan-500/10 text-hue-cyan-400 border-hue-cyan-500/30",
    desc: "Hak mengelola database monitor live studio, pengujian laboratorium GrayPlasma, kurasi meja, dan aftersales.",
    icon: <ShieldCheck className="w-3.5 h-3.5 text-hue-cyan-400" />,
  },
  editor: {
    label: "Content Editor",
    badgeClass: "bg-hue-emerald-500/10 text-hue-emerald-400 border-hue-emerald-500/30",
    desc: "Hak mengelola artikel panduan (/guide/...), FAQ, banner halaman, dan pengumuman ribbon.",
    icon: <Edit2 className="w-3.5 h-3.5 text-hue-emerald-400" />,
  },
  contributor: {
    label: "Contributor / Tester",
    badgeClass: "bg-hue-violet-500/10 text-hue-violet-400 border-hue-violet-500/30",
    desc: "Hak draft monitor dan input hasil pengetesan sementara.",
    icon: <Users className="w-3.5 h-3.5 text-hue-violet-400" />,
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
    if (confirm("Reset daftar admin ke akun bawaan (Grayplasma Master Admin)?")) {
      const res = DatabaseService.resetAdminUsers();
      onUpdateAdmins(res);
      setLogs(DatabaseService.getActivityLogs());
      showNotice("Daftar admin telah di-reset ke akun bawaan (Grayplasma).");
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
        <div className="p-3 bg-hue-emerald-950/90 border border-hue-emerald-500 rounded-xl text-xs text-hue-emerald-200 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-hue-emerald-400 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header & Subtabs */}
      <div className="bg-gp-ink-998 border border-gp-ink-700 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gp-ink-700 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hue-amber-500/10 border border-hue-amber-500/30 text-hue-amber-400 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Hierarchy & Role-Based Access Control (RBAC)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Manajemen Tim Admin & Hak Akses
            </h3>
            <p className="text-xs text-gp-ink-300 max-w-2xl">
              Atur hierarki admin dan wewenang akun (Super Admin Grayplasma, Reviewer, Editor, Contributor).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetAdmins}
              className="text-xs border-gp-ink-600"
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
        <div className="flex items-center gap-2 border-b border-gp-ink-700 pb-2">
          <button
            onClick={() => setActiveSubTab("team")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === "team"
                ? "bg-gp-ink-700 text-hue-amber-400 border border-hue-amber-500/30"
                : "text-gp-ink-300 hover:text-white"
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
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === "audit"
                ? "bg-gp-ink-700 text-hue-cyan-400 border border-hue-cyan-500/30"
                : "text-gp-ink-300 hover:text-white"
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
              <div className="p-4 rounded-2xl bg-gradient-to-r from-gp-ink-950 via-gp-ink-800 to-gp-ink-950 border border-hue-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative group cursor-pointer flex-shrink-0">
                    <img
                      src={currentAdmin.avatar}
                      alt={currentAdmin.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-hue-amber-500/60 shadow-lg shadow-hue-amber-500/10 group-hover:opacity-75 transition-opacity"
                    />
                    <label
                      title="Ganti Foto Profil Anda"
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-5 h-5 text-hue-amber-400" />
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
                      <span className="text-xs text-hue-amber-400 uppercase font-bold tracking-wider">
                        Sesi Admin Aktif Saat Ini
                      </span>
                      <span className="text-3xs px-2 py-0.5 rounded-full bg-hue-emerald-500/20 text-hue-emerald-400 font-bold border border-hue-emerald-500/30">
                        Online
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white">{currentAdmin.name}</h4>
                    <p className="text-xs text-gp-ink-300">
                      {currentAdmin.roleTitle} (@{currentAdmin.username})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="px-3 py-1.5 rounded-xl bg-gp-ink-800 hover:bg-gp-ink-700 border border-gp-ink-600 text-xs font-semibold text-gp-ink-100 cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-hue-amber-400" />
                    <span>Ganti Foto Profil</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDirectAvatarUpload(e, currentAdmin)}
                      className="hidden"
                    />
                  </label>
                  <div className="text-right hidden md:block">
                    <span className="text-3xs text-gp-ink-400 block">Sandi Akses</span>
                    <span className="text-xs font-mono text-gp-ink-300 font-bold">••••••••</span>
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
                    className={`bg-gp-ink-950 border rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-colors ${
                      isCurrent
                        ? "border-hue-amber-500/50 shadow-lg shadow-hue-amber-500/5 bg-gp-ink-800/40"
                        : "border-gp-ink-700 hover:border-gp-ink-600"
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
                              className="w-11 h-11 rounded-xl object-cover border border-gp-ink-700 group-hover:border-hue-amber-500/50 transition-colors"
                            />
                            <label
                              title="Ganti Foto Profil"
                              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5 text-hue-amber-400" />
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
                            <span className="text-2xs text-gp-ink-300">
                              @{adm.username}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(adm)}
                            title="Edit Akun Admin"
                            className="p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-200 hover:text-hue-emerald-400"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(adm.id, adm.name)}
                            title="Hapus Akun Admin"
                            className="p-1.5 rounded-lg bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-200 hover:text-hue-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Role Badge */}
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-2xs font-bold ${config.badgeClass}`}>
                        {config.icon}
                        <span>{config.label}</span>
                      </div>

                      <p className="text-xs text-gp-ink-300 line-clamp-2 leading-relaxed">
                        {adm.bio || config.desc}
                      </p>

                      {/* Permissions Pills */}
                      <div className="space-y-1 pt-1">
                        <span className="text-3xs text-gp-ink-400 uppercase font-bold tracking-wider">
                          Wewenang & Hak Akses
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {adm.permissions.includes("*") ? (
                            <span className="text-3xs px-2 py-0.5 rounded bg-hue-amber-500/10 text-hue-amber-300 border border-hue-amber-500/30 font-mono font-bold">
                              [SUPER ADMIN - ALL ACCESS]
                            </span>
                          ) : (
                            adm.permissions.map((p) => (
                              <span
                                key={p}
                                className="text-3xs px-1.5 py-0.5 rounded bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-200 font-mono"
                              >
                                {p}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action / Switch Session Button */}
                    <div className="pt-3 border-t border-gp-ink-800 flex items-center justify-between">
                      <div className="text-3xs text-gp-ink-400">
                        Sandi: <span className="font-mono text-gp-ink-300 font-bold">••••••••</span>
                      </div>

                      {!isCurrent ? (
                        <button
                          onClick={() => {
                            onSwitchSession(adm);
                            DatabaseService.setCurrentAdminSession(adm);
                            showNotice(`Berganti ke akun: ${adm.name} (${adm.role})`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-gp-ink-800 hover:bg-gp-ink-700 border border-gp-ink-700 text-xs font-semibold text-gp-ink-200 hover:text-hue-amber-400 transition-colors flex items-center gap-1"
                        >
                          <Fingerprint className="w-3 h-3 text-hue-amber-400" />
                          <span>Ganti Sesi</span>
                        </button>
                      ) : (
                        <span className="text-2xs text-hue-emerald-400 font-bold flex items-center gap-1">
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
                <span className="text-xs text-gp-ink-300">Filter Log:</span>
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="bg-gp-ink-800 border border-gp-ink-700 rounded-xl px-2.5 py-1.5 text-xs text-gp-ink-200 focus:outline-none focus:border-hue-cyan-400"
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
                className="text-xs text-gp-ink-400 hover:text-hue-rose-400 transition-colors"
              >
                Hapus Log Riwayat
              </button>
            </div>

            <div className="bg-gp-ink-950 border border-gp-ink-700 rounded-2xl overflow-hidden divide-y divide-gp-ink-700/60">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-gp-ink-400 italic">
                  Belum ada catatan aktivitas untuk filter ini.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gp-ink-800/40">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl mt-0.5 ${
                        log.action === "create"
                          ? "bg-hue-emerald-500/10 text-hue-emerald-400"
                          : log.action === "delete"
                          ? "bg-hue-rose-500/10 text-hue-rose-400"
                          : log.action === "sync" || log.action === "restore"
                          ? "bg-hue-cyan-500/10 text-hue-cyan-400"
                          : "bg-hue-amber-500/10 text-hue-amber-400"
                      }`}>
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{log.targetName}</span>
                          <span className="text-3xs px-1.5 py-0.5 rounded bg-gp-ink-800 border border-gp-ink-700 text-gp-ink-300 uppercase">
                            {log.targetType}
                          </span>
                        </div>
                        {log.details && (
                          <p className="text-xs text-gp-ink-300 mt-0.5">{log.details}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 text-xs">
                      <span className="text-gp-ink-200 font-bold block">{log.adminName}</span>
                      <span className="text-3xs text-gp-ink-400">{log.timestamp}</span>
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-gp-ink-900 border border-gp-ink-600/80 rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Fixed Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gp-ink-700 bg-gp-ink-850 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-hue-amber-500/10 border border-hue-amber-500/30 text-hue-amber-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingAdmin ? "Edit Anggota Admin" : "Tambah Admin Baru"}
                  </h3>
                  <span className="text-xs text-gp-ink-300">Atur peran dan PIN kredensial</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gp-ink-700 text-gp-ink-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form with Scrollable Body & Fixed Footer */}
            <form onSubmit={handleSaveAdmin} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-gp-ink-200 block mb-1 font-semibold">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Joel Gray"
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-hue-amber-400 placeholder:text-gp-ink-400"
                    />
                  </div>
                  <div>
                    <label className="text-gp-ink-200 block mb-1 font-semibold">Username / Handle</label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="gray1plasma"
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-hue-amber-400 placeholder:text-gp-ink-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gp-ink-200 block mb-1 font-semibold">Email Akun (Digunakan untuk Login) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="collaborator@grayplasma.id"
                    className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-hue-amber-400 font-mono text-xs placeholder:text-gp-ink-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-gp-ink-200 block mb-1 font-semibold">Peran / Role Hierarki</label>
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
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-hue-amber-400"
                    >
                      <option value="super_admin">[SUPER ADMIN] Super Admin (Full Control)</option>
                      <option value="lead_reviewer">[REVIEWER] Lead Reviewer (Lab & Monitor)</option>
                      <option value="editor">[EDITOR] Content Editor (Articles & FAQ)</option>
                      <option value="contributor">[CONTRIBUTOR] Lab Contributor / Tester</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gp-ink-200 block mb-1 font-semibold">PIN Password Masuk</label>
                    <input
                      type="text"
                      required
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      placeholder="PIN / Password"
                      className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-hue-amber-400 font-mono font-bold focus:outline-none focus:border-hue-amber-400 placeholder:text-gp-ink-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gp-ink-200 font-semibold">Foto Profil (Avatar)</label>
                    <label className="text-2xs text-hue-amber-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold">
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
                      className="w-10 h-10 rounded-xl object-cover border border-hue-amber-500/50 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://... atau klik Upload Foto di samping"
                      className="flex-1 bg-gp-ink-850 border border-gp-ink-600 rounded-xl px-3.5 py-2 text-gp-ink-200 focus:outline-none focus:border-hue-amber-400 font-mono text-2xs placeholder:text-gp-ink-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gp-ink-200 block mb-1 font-semibold">Bio Singkat</label>
                  <textarea
                    rows={2}
                    value={formData.bio || ""}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Deskripsi peran dan tanggung jawab admin..."
                    className="w-full bg-gp-ink-850 border border-gp-ink-600 rounded-xl p-2.5 text-gp-ink-100 focus:outline-none focus:border-hue-amber-400 placeholder:text-gp-ink-400"
                  />
                </div>

                {/* Granular Permissions Checklist */}
                <div className="space-y-2 pt-2 border-t border-gp-ink-700">
                  <label className="text-gp-ink-200 font-bold block">
                    Daftar Wewenang Modul (Granular Permissions):
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2.5 bg-gp-ink-850 rounded-xl border border-gp-ink-600">
                    {ALL_AVAILABLE_PERMISSIONS.map((perm) => {
                      const isChecked =
                        formData.permissions.includes("*") || formData.permissions.includes(perm.id);

                      return (
                        <label
                          key={perm.id}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gp-ink-700 cursor-pointer text-2xs text-gp-ink-200 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(perm.id)}
                            className="rounded border-gp-ink-500 bg-gp-ink-700 text-hue-amber-500 focus:ring-0"
                          />
                          <span>{perm.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Fixed Footer Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-gp-ink-700 bg-gp-ink-950 flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="border-gp-ink-600 text-gp-ink-200 hover:text-white hover:bg-gp-ink-700"
                >
                  Batal
                </Button>
                <Button type="submit" variant="cyber" size="sm" className="bg-hue-amber-500 hover:bg-hue-amber-400 text-black font-bold">
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
