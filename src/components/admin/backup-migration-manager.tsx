"use client";

import React, { useState } from "react";
import {
  Download,
  Upload,
  Database,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  FileCode,
  ShieldAlert,
  Server,
  Cloud,
  FileJson,
} from "lucide-react";
import { DatabaseService } from "@/lib/db-service";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface BackupMigrationManagerProps {
  onRefreshAll: () => void;
}

export function BackupMigrationManager({ onRefreshAll }: BackupMigrationManagerProps) {
  const [syncStatus, setSyncStatus] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [restoreNotice, setRestoreNotice] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const jsonStr = DatabaseService.exportFullDatabaseJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grayplasma_full_database_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSyncNotice("Berhasil mengunduh Full JSON Snapshot Backup!");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;
      if (confirm("Yakin ingin memulihkan seluruh database dari file JSON ini? Seluruh data lokal akan digantikan dengan isi backup.")) {
        const res = DatabaseService.importFullDatabaseJSON(content);
        if (res.success) {
          showSyncNotice(res.message);
          onRefreshAll();
        } else {
          showSyncNotice(res.message, true);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handlePushSupabase = async () => {
    setIsSyncing(true);
    const result = await DatabaseService.pushSeedToSupabase();
    showSyncNotice(result.message, !result.success);
    setIsSyncing(false);
  };

  const handleCopySQL = () => {
    const sql = DatabaseService.generateSQLMigration();
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const showSyncNotice = (text: string, isError = false) => {
    setSyncStatus({ text, isError });
    setTimeout(() => setSyncStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      {syncStatus && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 shadow-xl ${
            syncStatus.isError
              ? "bg-rose-950/90 border-rose-500 text-rose-200"
              : "bg-emerald-950/90 border-emerald-500 text-emerald-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{syncStatus.text}</span>
        </div>
      )}

      <div className="bg-surface-dark border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2 border-b border-zinc-800 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <Server className="w-3.5 h-3.5" />
            <span>Database Backup, Cloud Sync & Migrations</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Pencadangan Penuh & Integrasi Supabase Cloud
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
            Amankan seluruh basis data website Anda dalam 1 file JSON snapshot, pulihkan kapan saja, atau sinkronisasikan langsung ke cloud database Supabase.
          </p>
        </div>

        {/* 1. Full JSON Backup & Restore Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Download className="w-4 h-4" />
                <h4 className="text-sm font-bold text-white uppercase">
                  1-Click Full Database Backup (Export JSON)
                </h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Unduh seluruh dataset: 55+ Monitor, 10 Meja, 15 Aksesoris, Evaluasi Aftersales, Seluruh Hierarki Panduan, FAQ, Pengaturan Kontak, dan Akun Admin ke dalam 1 file JSON terenkapsulasi.
              </p>
            </div>

            <Button
              type="button"
              variant="cyber"
              size="sm"
              onClick={handleDownloadBackup}
              className="w-full font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <FileJson className="w-4 h-4" />
              <span>Download Full Backup (.json)</span>
            </Button>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Upload className="w-4 h-4" />
                <h4 className="text-sm font-bold text-white uppercase">
                  1-Click Restore Database (Import JSON)
                </h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Unggah file JSON hasil backup sebelumnya untuk memulihkan seluruh struktur situs, data spesifikasi monitor, dan konfigurasi tanpa kehilangan format.
              </p>
            </div>

            <label className="w-full cursor-pointer">
              <div className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 text-center flex items-center justify-center gap-1.5 transition-colors">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Pilih File Backup JSON untuk Restore</span>
              </div>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 2. Supabase Integration & Push Sync */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <Cloud className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white uppercase">
                Supabase Cloud Live Synchronization
              </h4>
            </div>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                isSupabaseConfigured
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              {isSupabaseConfigured ? "Supabase Live Connected" : "Local Database Mode"}
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {isSupabaseConfigured
              ? "Kredensial Supabase terdeteksi aktif. Anda dapat mengirimkan seluruh snapshot lokal saat ini ke cloud database hanya dengan menekan tombol sinkronisasi di bawah."
              : "Untuk mengaktifkan Supabase, masukkan kredensial URL dan Anon Key pada file `.env.local`."}
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="cyber"
              size="sm"
              disabled={!isSupabaseConfigured || isSyncing}
              onClick={handlePushSupabase}
              className="text-xs font-bold"
            >
              {isSyncing ? "Menyinkronkan ke Supabase..." : "Sync All Tables to Supabase Cloud ➔"}
            </Button>
          </div>
        </div>

        {/* 3. SQL Migration Generator */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-violet-400 font-bold">
              <FileCode className="w-4 h-4" />
              <span className="text-white">Skema SQL Migrasi Supabase</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopySQL}
              className="text-xs border-zinc-700"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  <span>Salin Skema SQL</span>
                </>
              )}
            </Button>
          </div>
          <p className="text-zinc-400">
            Salin skema SQL dan jalankan di <strong>Supabase Dashboard ➔ SQL Editor ➔ Run</strong> untuk membuat tabel `monitors`, `hierarchy`, `desks`, `peripherals`, `aftersales`, dan `site_settings`.
          </p>
        </div>
      </div>
    </div>
  );
}
