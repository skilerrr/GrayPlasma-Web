import type { ReactNode } from "react";
import {
  Tv,
  Layers,
  Wrench,
  Sparkles,
  Armchair,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  BookOpen,
  SlidersHorizontal,
  Ruler,
  LayoutGrid,
  SunMedium,
  FileText,
  Info,
  Heart,
  Headphones,
} from "lucide-react";
import type { DropdownTone } from "@/components/nav-dropdown";

/**
 * Definisi menu navbar — SATU sumber kebenaran untuk desktop (dropdown) dan
 * mobile (menu sheet).
 *
 * Sebelumnya tiap menu ditulis manual di `navbar.tsx`, sehingga versi mobile
 * cuma jadi daftar datar 9 link yang tidak mencerminkan isi dropdown desktop
 * (katalog meja, aksesoris, arm & bracket, konsultasi, dll. nggak terjangkau
 * dari mobile). Sekarang keduanya render dari struktur yang sama.
 */

export interface NavMenuEntry {
  href: string;
  label: string;
  /** Deskripsi singkat — muncul sebagai baris kedua di submenu. */
  description: string;
  icon: ReactNode;
  tone: DropdownTone;
  /** Badge opsional di kanan (jumlah item atau penanda status). */
  badge?: string;
  badgeTone?: "neutral" | "warn";
  /** Item ini belum dipublikasikan (masih draft). */
  draft?: boolean;
}

export interface NavMenuGroup {
  key: "catalog" | "aftersales" | "more";
  label: string;
  icon: ReactNode;
  /** Judul section di dalam dropdown. */
  section: string;
  entries: NavMenuEntry[];
  /** Section tambahan di bawah (mis. "Komunitas & Penulis"). */
  extraSection?: { title: string; entries: NavMenuEntry[] };
}

export const NAV_MENU_GROUPS: NavMenuGroup[] = [
  {
    key: "catalog",
    label: "Rekomendasi",
    icon: <Layers className="h-3.5 w-3.5" />,
    section: "Katalog Rekomendasi",
    entries: [
      {
        href: "/catalog/all",
        label: "Rekomendasi Monitor",
        description: "Semua model hasil kurasi & tes lab",
        icon: <Tv className="h-4 w-4" />,
        tone: "mint",
        badge: "55", // diganti runtime oleh totalMonitorsCount
        badgeTone: "neutral",
      },
      {
        href: "/catalog/desks",
        label: "Rekomendasi Meja + Kaki",
        description: "Daun meja, standing desk, & arm",
        icon: <Layers className="h-4 w-4" />,
        tone: "ember",
        badge: "10 Meja",
      },
      {
        href: "/catalog/arms-brackets",
        label: "Arm & Bracket Monitor",
        description: "Gas spring arm & mount adapter",
        icon: <Wrench className="h-4 w-4" />,
        tone: "sky",
        badge: "Arm & Mount",
      },
      {
        href: "/catalog/accessories",
        label: "Aksesoris Setup",
        description: "Screenbar, kabel, & cable mgmt",
        icon: <Sparkles className="h-4 w-4" />,
        tone: "violet",
        badge: "Aksesoris",
      },
      {
        href: "/catalog/chairs",
        label: "Kursi Ergonomis",
        description: "Kurasi mesh lumbar & gas lift",
        icon: <Armchair className="h-4 w-4" />,
        tone: "coral",
        badge: "DRAFT",
        badgeTone: "warn",
        draft: true,
      },
    ],
  },
  {
    key: "aftersales",
    label: "Aftersales",
    icon: <ShieldAlert className="h-3.5 w-3.5" />,
    section: "Aftersales & Garansi Brand",
    entries: [
      {
        href: "/guide/brand/aftersales-rma",
        label: "Aftersales Brand Tier List",
        description: "Tier layanan & garansi per brand",
        icon: <ShieldCheck className="h-4 w-4" />,
        tone: "mint",
      },
      {
        href: "/guide/brand/odm-layak-dibeli",
        label: "Brand ODM Layak Dibeli?",
        description: "ODM, white-label, & reborn monitor",
        icon: <ShieldAlert className="h-4 w-4" />,
        tone: "ember",
      },
    ],
  },
  {
    key: "more",
    label: "Panduan & Info",
    icon: <BookOpen className="h-3.5 w-3.5" />,
    section: "Panduan & Edukasi",
    entries: [
      {
        href: "/guide/faq",
        label: "QnA & FAQ Section",
        description: "Pertanyaan umum & jawaban testing lab",
        icon: <HelpCircle className="h-4 w-4" />,
        tone: "ember",
      },
      {
        href: "/guide/sdr/glossary",
        label: "How to Read GrayPlasma Glossary",
        description: "Istilah teknis & cara membacanya",
        icon: <BookOpen className="h-4 w-4" />,
        tone: "mint",
      },
      {
        href: "/guide/display/bandwidth-dp-hdmi",
        label: "Bandwidth DP 1.4 vs HDMI 2.1",
        description: "DP 1.4 vs HDMI 2.1, mana yang perlu",
        icon: <SlidersHorizontal className="h-4 w-4" />,
        tone: "coral",
      },
      {
        href: "/guide/setup/ukuran-meja-monitor-ideal",
        label: "Ukuran Meja & Monitor Ideal",
        description: "Ukuran meja ideal per ukuran monitor",
        icon: <Ruler className="h-4 w-4" />,
        tone: "ember",
      },
      {
        href: "/guide/setup/meja-ergonomi",
        label: "Rekomendasi Meja & Monitor Arm",
        description: "Rekomendasi meja & monitor arm ergonomis",
        icon: <LayoutGrid className="h-4 w-4" />,
        tone: "sky",
      },
      {
        href: "/guide/oled/perawatan-burn-in",
        label: "Panduan Lengkap OLED & Burn-in",
        description: "Pencegahan burn-in &Panel OLED",
        icon: <SunMedium className="h-4 w-4" />,
        tone: "coral",
      },
      {
        href: "/guide/warna/akurasi-d65-p3",
        label: "D65-P3 Undersaturated Guide",
        description: "Panduan akurasi warna D65-P3 & under-saturated",
        icon: <FileText className="h-4 w-4" />,
        tone: "sky",
      },
    ],
    extraSection: {
      title: "Komunitas & Penulis",
      entries: [
        {
          href: "/guide/about/tentang-penulis",
          label: "Tentang Website & Penulis",
          description: "Profil GrayPlasma & Joel Gray",
          icon: <Info className="h-4 w-4" />,
          tone: "violet",
        },
        {
          href: "/guide/support/donasi-penulis",
          label: "Support & Donasi Penulis",
          description: "Dukung penulisan & pengembangan konten",
          icon: <Heart className="h-4 w-4" />,
          tone: "coral",
        },
        {
          href: "/guide/consultation/konsultasi-joel-gray",
          label: "Konsultasi WA / Discord",
          description: "Tanya langsung lewat WA atau Discord",
          icon: <Headphones className="h-4 w-4" />,
          tone: "mint",
        },
      ],
    },
  },
];

/** Link yang aktif untuk menu aktif — dipakai untuk menyorot state. */
export function isNavGroupActive(group: NavMenuGroup, currentKey: string): boolean {
  if (group.key === "catalog") return currentKey.startsWith("catalog");
  if (group.key === "aftersales") return currentKey.startsWith("aftersales");
  return (
    currentKey === "desk-guide" ||
    currentKey === "hdr-guide" ||
    currentKey === "graynotes-all" ||
    currentKey === "faq" ||
    currentKey === "bandwidth-guide" ||
    currentKey === "feedback" ||
    currentKey === "glossary" ||
    currentKey === "about" ||
    currentKey === "support-donasi" ||
    currentKey === "consultation"
  );
}
