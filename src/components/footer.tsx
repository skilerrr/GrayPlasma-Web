"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tv,
  BookOpen,
  ShieldAlert,
  SlidersHorizontal,
  SunMedium,
  LayoutGrid,
  HelpCircle,
  PhoneCall,
  MessageSquare,
  Send,
  ExternalLink,
  Heart,
  Lock,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { GPLogo } from "@/components/gp-logo";
import { CONSULTATION_DATA } from "@/data/grayplasma-content";
import { DatabaseService, GlobalSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/db-service";

export function Footer() {
  const [siteSettings, setSiteSettings] = useState<GlobalSiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    async function loadSettings() {
      try {
        const s = await DatabaseService.getSiteSettings();
        if (s) setSiteSettings(s);
      } catch (err) {
        console.error("Failed to load footer settings", err);
      }
    }
    loadSettings();
  }, []);

  const consult = siteSettings.consultation || CONSULTATION_DATA;

  return (
    <footer className="border-t border-zinc-800 bg-[#09090b] text-zinc-400 text-xs mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand & Collab Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <GPLogo className="w-10 h-10 flex-shrink-0" />
              <div>
                <span className="font-black text-white text-base tracking-tight uppercase block">
                  {(siteSettings.brandName || "GRAYPLASMA ID").replace(/\s*ID$/i, "")}{" "}
                  <span className="text-orange-500 font-mono">ID</span>
                </span>
                <span className="text-[11px] text-zinc-400">
                  {siteSettings.brandTagline || "Rekomendasi & Kurasi Monitor"}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Database Pengujian & Kurasi Monitor Independen kolaborasi{" "}
              <strong className="text-white">{consult.author || "Joel Gray (@gray1plasma)"}</strong> x{" "}
              <strong className="text-white">{consult.collaborators || "Tim GrayPlasma"}</strong> berdasarkan data pengetesan laboratorium{" "}
              <strong className="text-white">GTID Tech</strong>.
            </p>
          </div>

          {/* Column 2: Katalog & Database (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Katalog Monitor
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Tabel Database Utama
                </Link>
              </li>
              <li>
                <Link href="/guide/sdr/glossary" className="hover:text-emerald-400 transition-colors">
                  List SDR GTID Review
                </Link>
              </li>
              <li>
                <Link href="/guide/oled/panduan-perawatan" className="hover:text-emerald-400 transition-colors">
                  List OLED & Flagship
                </Link>
              </li>
              <li>
                <Link href="/guide/setup/meja-ergonomi" className="hover:text-emerald-400 transition-colors">
                  Rekomendasi Meja & Arm
                </Link>
              </li>
              <li>
                <Link href="/guide/brand/aftersales-rma" className="hover:text-emerald-400 transition-colors">
                  Aftersales Brand Tier List
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Panduan & Sub-Path Guides (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Panduan & Edukasi (/guide/...)</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/guide/sdr/glossary" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>•</span>
                  <span>Cara Baca Delta E (deITP)</span>
                </Link>
              </li>
              <li>
                <Link href="/guide/warna/akurasi-d65-p3" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>•</span>
                  <span>Akurasi D65-P3 vs Rec.2020</span>
                </Link>
              </li>
              <li>
                <Link href="/guide/brand/odm-layak-dibeli" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>•</span>
                  <span>Brand ODM Layak Dibeli?</span>
                </Link>
              </li>
              <li>
                <Link href="/guide/display/bandwidth-dp-hdmi" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>•</span>
                  <span>Bandwidth DP 1.4 vs HDMI 2.1</span>
                </Link>
              </li>
              <li>
                <Link href="/guide/oled/panduan-perawatan" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>•</span>
                  <span>Perawatan OLED & Burn-in</span>
                </Link>
              </li>
              <li>
                <Link href="/guide/faq/toleransi-lama-baru" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>•</span>
                  <span>Toleransi Baru (5 RGB) GTID</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Konsultasi & Komunitas (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Konsultasi & Komunitas</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={consult.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3 h-3 text-emerald-400" />
                  <span>WhatsApp: {consult.whatsapp} ({consult.author?.split(" ")[0] || "Joel Gray"})</span>
                </a>
              </li>
              <li>
                <a
                  href={consult.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3 h-3 text-cyan-400" />
                  <span>Discord Komunitas GTID Official</span>
                </a>
              </li>
              <li>
                <a
                  href={consult.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-400 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3 text-rose-400" />
                  <span>TikTok: {consult.tiktok}</span>
                </a>
              </li>
              <li>
                <a
                  href={consult.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 text-red-400" />
                  <span>YouTube GTID Tech</span>
                </a>
              </li>
              <li className="pt-1">
                <a
                  href={consult.feedbackFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black font-semibold transition-all text-[11px]"
                >
                  <span>Form Kritik & Saran</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-400 space-y-1.5">
          <div className="flex items-center gap-2 text-zinc-300 font-bold text-[11px] uppercase tracking-wider">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Ketentuan & Disclaimer Pengujian</span>
          </div>
          <p className="leading-relaxed text-zinc-400">
            {consult.disclaimer || "Seluruh data dan rekomendasi yang ada di website ini disarikan secara independen untuk membantu calon pembeli memahami data teknis. Selalu tanyakan dan konsultasikan kembali sebelum melakukan pembelian untuk menyesuaikan dengan spesifikasi kartu grafis PC/Laptop, dimensi meja, serta tujuan pemakaian Anda."}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-zinc-500 text-center sm:text-left">
            {siteSettings.copyrightText || "© 2026 GrayPlasma. Hak Cipta materi kurasi milik GrayPlasma. Data pengujian milik GTID Tech."}
          </div>
        </div>
      </div>
    </footer>
  );
}
