import { Monitor } from "@/types/monitor";
import { MONITORS_DATA } from "@/data/monitors";
import {
  DESK_DATABASE,
  PERIPHERALS_DATABASE,
  DeskItem,
  PeripheralItem,
  ChairItem,
  DEFAULT_CHAIRS_DATABASE,
} from "@/data/grayplasma-desk-peripherals";
import {
  AFTERSALES_DATA,
  AftersalesBrand,
  FAQ_LIST,
  FAQItem,
  DESK_GUIDES,
  DeskGuide,
  HDR_GUIDES,
  HDRGuide,
  GRAYNOTES_LIST,
  GrayNoteItem,
  BRANDS_TO_AVOID_DATA,
  AvoidBrandItem,
  BANDWIDTH_GUIDANCES,
  BandwidthGuidance,
  ABOUT_NOTION_CONTENT,
  CONSULTATION_DATA,
  BRAND_ODM_GUIDE,
} from "@/data/grayplasma-content";

export type {
  FAQItem,
  DeskGuide,
  HDRGuide,
  GrayNoteItem,
  AvoidBrandItem,
  BandwidthGuidance,
  ChairItem,
};
import { SiteHierarchyNode } from "@/types/site-hierarchy";
import { DEFAULT_SITE_HIERARCHY } from "@/data/site-hierarchy";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  cachedFetch,
  invalidateCache,
  isTableMissing,
  markTableMissing,
  isMissingRelationError,
} from "@/lib/data-cache";
import { NOTION_AFTERSALES_CARDS } from "@/data/notion-aftersales-board-data";
import { NotionBoardCard } from "@/components/notion-kanban-board";

const STORAGE_KEYS = {
  MONITORS: "gp_db_monitors_v1",
  DESKS: "gp_db_desks_v1",
  PERIPHERALS: "gp_db_peripherals_v1",
  CHAIRS: "gp_db_chairs_v1",
  AFTERSALES: "gp_db_aftersales_v1",
  AFTERSALES_CARDS: "gp_db_aftersales_cards_v1",
  HIERARCHY: "gp_db_hierarchy_v1",
  PAGE_BANNERS: "gp_db_page_banners_v1",
  AD_BANNERS: "gp_db_ad_banners_v1",
  HOMEPAGE_SETTINGS: "gp_db_homepage_settings_v1",
  SITE_SETTINGS: "gp_db_site_settings_v1",
  FAQ_ITEMS: "gp_db_faq_items_v1",
  DESK_GUIDES: "gp_db_desk_guides_v1",
  HDR_GUIDES: "gp_db_hdr_guides_v1",
  GRAYNOTES: "gp_db_graynotes_v1",
  BRANDS_TO_AVOID: "gp_db_brands_to_avoid_v1",
  BANDWIDTH_GUIDES: "gp_db_bandwidth_guides_v1",
  ABOUT_CONTENT: "gp_db_about_content_v1",
  ADMIN_USERS: "gp_db_admin_users_v1",
  ACTIVITY_LOGS: "gp_db_activity_logs_v1",
  CURRENT_ADMIN_SESSION: "gp_current_admin_session",
  LAST_SYNC: "gp_db_last_sync",
};

export interface AdBannerItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: "emerald" | "amber" | "rose" | "cyan" | "violet" | "orange";
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
  targetBlank?: boolean;
  ctaText?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export const DEFAULT_AD_BANNERS: AdBannerItem[] = [
  {
    id: "banner-xiaomi-g24i",
    title: "Xiaomi G24i 180Hz Fast IPS",
    subtitle: "Rekomendasi monitor gaming budget terbaik 2026. Akurasi warna deITP 2.1 dengan panel Fast IPS 180Hz responsif hasil pengujian lab GrayPlasma.",
    badge: "S-TIER BUDGET 2026",
    badgeColor: "emerald",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop",
    linkUrl: "/monitor/xiaomi-g24i-2026-",
    targetBlank: false,
    ctaText: "Cek Data Pengujian",
    isActive: true,
    order: 1,
    createdAt: "2026-08-01",
  },
  {
    id: "banner-aftersales-tier",
    title: "Aftersales & Garansi Brand Monitor",
    subtitle: "Ketahui track record RMA, reputasi distributor resmi, dan kebijakan klaim dead pixel sebelum memutuskan membeli monitor impianmu.",
    badge: "PANDUAN AFTERSALES",
    badgeColor: "amber",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop",
    linkUrl: "/guide/brand/aftersales-rma",
    targetBlank: false,
    ctaText: "Lihat Tier List Brand",
    isActive: true,
    order: 2,
    createdAt: "2026-08-02",
  },
  {
    id: "banner-meja-setup",
    title: "Kurasi Daun Meja & Standing Desk",
    subtitle: "Pilihan meja ergonomis kokoh, solid wood, dan monitor arm anti-goyang untuk setup single maupun dual monitor kamu.",
    badge: "REKOMENDASI SETUP",
    badgeColor: "cyan",
    imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1920&auto=format&fit=crop",
    linkUrl: "/catalog/desks",
    targetBlank: false,
    ctaText: "Jelajahi Meja & Kaki",
    isActive: true,
    order: 3,
    createdAt: "2026-08-03",
  },
  {
    id: "banner-glossary-deitp",
    title: "Standar Kalibrasi deITP & Akurasi Warna",
    subtitle: "Pahami cara membaca laporan pengujian laboratorium GrayPlasma agar tidak tertipu klaim marketing '100% sRGB' palsu.",
    badge: "STANDAR LAB GrayPlasma",
    badgeColor: "violet",
    imageUrl: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=1920&auto=format&fit=crop",
    linkUrl: "/guide/sdr/glossary",
    targetBlank: false,
    ctaText: "Pelajari Glosarium",
    isActive: true,
    order: 4,
    createdAt: "2026-08-04",
  },
];

export interface PageBannerSettings {
  homeBannerUrl?: string;
  homeBannerTitle?: string;
  homeBannerSubtitle?: string;
  guideBannerUrl?: string;
  monitorBannerUrl?: string;
}

export const DEFAULT_BANNER_SETTINGS: PageBannerSettings = {
  homeBannerUrl: "",
  homeBannerTitle: "Katalog & Database Rekomendasi Monitor",
  homeBannerSubtitle: "Kurasi monitor independen oleh tim GrayPlasma (@gray1plasma) dengan pengujian laboratorium GrayPlasma.",
  guideBannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop",
  monitorBannerUrl: "",
};

/**
 * Aksen warna yang boleh dipakai untuk kartu sub-page.
 *
 * PENTING: class di sini HARUS ada di `tailwind.config.ts` safelist. Class
 * yang disimpan di database tidak bisa di-detect Tailwind dari source, jadi
 * nilai arbitrary seperti `text-[#52ba69]` diam-diam tidak pernah jadi CSS.
 * Karena itu admin hanya boleh memilih dari daftar ini.
 */
export const SUBPAGE_CARD_ACCENTS = [
  { id: "mint", label: "Mint", color: "hover:border-gp-mint-50 text-gp-mint-50" },
  { id: "sky", label: "Sky", color: "hover:border-gp-sky text-gp-sky" },
  { id: "ember", label: "Ember", color: "hover:border-gp-ember-50 text-gp-ember-50" },
  { id: "coral", label: "Coral", color: "hover:border-gp-coral-50 text-gp-coral-50" },
  { id: "violet", label: "Violet", color: "hover:border-gp-violet text-gp-violet" },
] as const;

/** Peta hex lama -> kelas token, buat migrasi data yang sudah tersimpan. */
const LEGACY_ACCENT_HEX: Record<string, string> = {
  "#52ba69": "hover:border-gp-mint-50 text-gp-mint-50",
  "#58a6ff": "hover:border-gp-sky text-gp-sky",
  "#d157eb": "hover:border-gp-violet text-gp-violet",
  "#ff9f43": "hover:border-gp-ember-50 text-gp-ember-50",
};

/** Normalisasi nilai `color` kartu: hex lama / class asing -> kelas token valid. */
export function normalizeCardAccent(raw: string | undefined | null): string {
  if (!raw) return SUBPAGE_CARD_ACCENTS[0].color;
  const valid: string[] = SUBPAGE_CARD_ACCENTS.map((a) => a.color);
  if (valid.includes(raw)) return raw;
  const hex = raw.match(/\[?#([0-9a-fA-F]{6})\]?/);
  if (hex) {
    const mapped = LEGACY_ACCENT_HEX["#" + hex[1].toLowerCase()];
    if (mapped) return mapped;
  }
  // class yang tak dikenal (mis. amber-400) -> padanan token terdekat
  if (/amber/.test(raw)) return "hover:border-gp-ember-50 text-gp-ember-50";
  if (/cyan|blue/.test(raw)) return "hover:border-gp-sky text-gp-sky";
  if (/rose|red|pink/.test(raw)) return "hover:border-gp-coral-50 text-gp-coral-50";
  if (/violet|purple/.test(raw)) return "hover:border-gp-violet text-gp-violet";
  return SUBPAGE_CARD_ACCENTS[0].color;
}

export interface SubpageCardItem {
  id: string;
  groupId: string;
  groupTitle: string;
  groupEmoji: string;
  title: string;
  desc: string;
  path: string;
  icon: string;
  color: string;
  order: number;
  isVisible: boolean;
}

export interface HomepageSettings {
  heroCoverUrl: string;
  pageIcon: string;
  pageTitle: string;
  pageSubtitle?: string;
  statusBadge: string;
  disclaimerTitle: string;
  disclaimerPoints: string[];
  disclaimerMarkdown?: string;
  subpageCards: SubpageCardItem[];
  sectionTitles: {
    monitorsTitle: string;
    monitorsSubtitle: string;
    desksTitle: string;
    desksSubtitle: string;
    armsTitle?: string;
    armsSubtitle?: string;
    bracketsTitle?: string;
    bracketsSubtitle?: string;
    peripheralsTitle: string;
    peripheralsSubtitle: string;
    chairsTitle?: string;
    chairsSubtitle?: string;
  };
  sectionVisibility: {
    showMonitors: boolean;
    showDesks: boolean;
    showArms?: boolean;
    showBrackets?: boolean;
    showPeripherals: boolean;
    showChairs?: boolean;
    showAftersales?: boolean;
    showFaq: boolean;
    showGuides?: boolean;
    showConsultation?: boolean;
    showFeedback?: boolean;
  };
}

export const DEFAULT_HOMEPAGE_SUBPAGES: SubpageCardItem[] = [
  // GROUP 1: REKOMENDASI MONITOR// GROUP 2: EVALUASI BRAND & AFTERSALES
  {
    id: "sub-aftersales",
    groupId: "group-1",
    groupTitle: "1. EVALUASI BRAND & AFTERSALES (OEM / ODM LIST)",
    groupEmoji: "🛡️",
    title: "LIST AFTERSALES (BRAND MONITOR OEM)",
    desc: "Database komprehensif sistem klaim garansi, track record RMA distributor resmi, dan tiering brand di Indonesia.",
    path: "/guide/brand/aftersales-rma",
    icon: "🛡️",
    color: "hover:border-gp-mint text-gp-mint",
    order: 5,
    isVisible: true,
  },
  {
    id: "sub-odm",
    groupId: "group-1",
    groupTitle: "1. EVALUASI BRAND & AFTERSALES (OEM / ODM LIST)",
    groupEmoji: "🛡️",
    title: "LIST BRAND MONITOR ODM / OEM LAYAK BELI",
    desc: "Panduan membeli monitor rebadge/ODM (KTC, Titan Army, Xiaomi, Skyworth) dengan risiko minimal dan garansi jelas.",
    path: "/guide/brand/odm-layak-dibeli",
    icon: "⚠️",
    color: "hover:border-gp-ember-50 text-gp-ember-50",
    order: 6,
    isVisible: true,
  },

  // GROUP 3: GLOSARIUM GrayPlasma & KALIBRASI
  {
    id: "sub-glossary",
    groupId: "group-2",
    groupTitle: "2. GLOSARIUM & PANDUAN KALIBRASI WARNA (GRAYPLASMA)",
    groupEmoji: "🎨",
    title: "HOW TO READ GrayPlasma GLOSSARY",
    desc: "Cara membaca skor deITP, Delta E, gamut, dan response time.",
    path: "/guide/sdr/glossary",
    icon: "📄",
    color: "hover:border-gp-sky text-gp-sky",
    order: 7,
    isVisible: true,
  },
  {
    id: "sub-d65-p3",
    groupId: "group-2",
    groupTitle: "2. GLOSARIUM & PANDUAN KALIBRASI WARNA (GRAYPLASMA)",
    groupEmoji: "🎨",
    title: "AKURASI D65-P3 VS UNDERSATURATED",
    desc: "Mengapa monitor Delta E rendah bisa kurang warna di Rec.2020.",
    path: "/guide/warna/akurasi-d65-p3",
    icon: "🎯",
    color: "hover:border-gp-sky text-gp-sky",
    order: 8,
    isVisible: true,
  },
  {
    id: "sub-bandwidth",
    groupId: "group-2",
    groupTitle: "2. GLOSARIUM & PANDUAN KALIBRASI WARNA (GRAYPLASMA)",
    groupEmoji: "🎨",
    title: "BANDWIDTH DP VS HDMI 2.0 / 2.1",
    desc: "Panduan kabel agar monitor tembus refresh rate maksimal tanpa kompresi.",
    path: "/guide/display/bandwidth-dp-hdmi",
    icon: "🔌",
    color: "hover:border-gp-sky text-gp-sky",
    order: 9,
    isVisible: true,
  },
  {
    id: "sub-oled-care",
    groupId: "group-2",
    groupTitle: "2. GLOSARIUM & PANDUAN KALIBRASI WARNA (GRAYPLASMA)",
    groupEmoji: "🎨",
    title: "PERAWATAN MONITOR OLED",
    desc: "Tips pencegahan burn-in, pixel cleaning, dan kebiasaan pemakaian.",
    path: "/guide/oled/perawatan-burn-in",
    icon: "✨",
    color: "hover:border-gp-violet text-gp-violet",
    order: 10,
    isVisible: true,
  },

  // GROUP 4: QNA & GRAYNOTES
  {
    id: "sub-faq-build",
    groupId: "group-3",
    groupTitle: "3. QNA & GRAYNOTES (PERTANYAAN SERING DIAJUKAN)",
    groupEmoji: "❓",
    title: "Build Quality Panel & Ketahanan",
    desc: "Penjelasan umur panel dan dead-lines.",
    path: "/guide/faq/build-quality-panel",
    icon: "❓",
    color: "hover:border-gp-ember-50 text-gp-ember-50",
    order: 11,
    isVisible: true,
  },
  {
    id: "sub-faq-ideal",
    groupId: "group-3",
    groupTitle: "3. QNA & GRAYNOTES (PERTANYAAN SERING DIAJUKAN)",
    groupEmoji: "❓",
    title: "Menentukan Monitor Ideal",
    desc: "3 faktor utama sebelum checkout monitor.",
    path: "/guide/faq/menentukan-monitor-ideal",
    icon: "❓",
    color: "hover:border-gp-ember-50 text-gp-ember-50",
    order: 12,
    isVisible: true,
  },
  {
    id: "sub-faq-luasan",
    groupId: "group-3",
    groupTitle: "3. QNA & GRAYNOTES (PERTANYAAN SERING DIAJUKAN)",
    groupEmoji: "❓",
    title: "Luasan vs Akurasi Warna",
    desc: "Mengapa 100% sRGB belum tentu akurat.",
    path: "/guide/faq/luasan-vs-akurasi-warna",
    icon: "❓",
    color: "hover:border-gp-ember-50 text-gp-ember-50",
    order: 13,
    isVisible: true,
  },
  {
    id: "sub-faq-ips",
    groupId: "group-3",
    groupTitle: "3. QNA & GRAYNOTES (PERTANYAAN SERING DIAJUKAN)",
    groupEmoji: "❓",
    title: "IPS vs VA vs TN di 2026",
    desc: "Perbandingan teknologi panel modern.",
    path: "/guide/faq/ips-vs-va-vs-tn",
    icon: "❓",
    color: "hover:border-gp-ember-50 text-gp-ember-50",
    order: 14,
    isVisible: true,
  },
  {
    id: "sub-faq-skyworth",
    groupId: "group-3",
    groupTitle: "3. QNA & GRAYNOTES (PERTANYAAN SERING DIAJUKAN)",
    groupEmoji: "❓",
    title: "Ikut PO Skyworth Apakah Worth-It?",
    desc: "Kelebihan dan estimasi waktu PO.",
    path: "/guide/faq/skyworth-po",
    icon: "❓",
    color: "hover:border-gp-ember-50 text-gp-ember-50",
    order: 15,
    isVisible: true,
  },
  {
    id: "sub-faq-online",
    groupId: "group-3",
    groupTitle: "3. QNA & GRAYNOTES (PERTANYAAN SERING DIAJUKAN)",
    groupEmoji: "❓",
    title: "Beli Monitor Online Aman",
    desc: "SOP unboxing dan proteksi asuransi kurir.",
    path: "/guide/faq/beli-monitor-online-aman",
    icon: "❓",
    color: "hover:border-gp-ember-50 text-gp-ember-50",
    order: 16,
    isVisible: true,
  },

  // GROUP 5: SETUP MEJA, AUTHOR & CONSULTATION
  {
    id: "sub-meja-ergonomi",
    groupId: "group-4",
    groupTitle: "4. SETUP MEJA, AUTHOR & CONSULTATION",
    groupEmoji: "🪑",
    title: "Panduan Meja & Ergonomi",
    desc: "Ukuran kedalaman meja vs inch monitor & rekomendasi gas spring arm.",
    path: "/guide/setup/meja-ergonomi",
    icon: "🪑",
    color: "hover:border-gp-sky text-gp-sky",
    order: 17,
    isVisible: true,
  },
  {
    id: "sub-about",
    groupId: "group-4",
    groupTitle: "4. SETUP MEJA, AUTHOR & CONSULTATION",
    groupEmoji: "🪑",
    title: "Tentang Penulis (Joel Gray)",
    desc: "Biodata, latar belakang kurasi independen, dan komitmen evaluasi monitor.",
    path: "/guide/about",
    icon: "👤",
    color: "hover:border-gp-mint text-gp-mint",
    order: 18,
    isVisible: true,
  },
  {
    id: "sub-consultation",
    groupId: "group-4",
    groupTitle: "4. SETUP MEJA, AUTHOR & CONSULTATION",
    groupEmoji: "🪑",
    title: "Konsultasi & Support",
    desc: "Konsultasi pemilihan monitor via Discord GrayPlasma / WA dan dukungan donasi.",
    path: "/guide/consultation",
    icon: "🎧",
    color: "hover:border-gp-violet text-gp-violet",
    order: 19,
    isVisible: true,
  },
];

export const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  heroCoverUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop",
  pageIcon: "Tv",
  pageTitle: "GRAYPLASMAID - REKOMENDASI MONITOR",
  statusBadge: "AKAN DILENGKAPI",
  disclaimerTitle: "CATATAN PENTING :",
  disclaimerPoints: [
    "SELURUH LIST YANG ADA DI WEB INI PERLU DITANYAKAN KEMBALI KEPADA PENULIS, dikarenakan perlu mempertimbangkan aspek spesifikasi PC Desktop / Laptop, ukuran meja, dan kebutuhan Anda.",
    "Mulai 15 Agustus 2026, link Tokopedia dan TikTok Shop akan dialihkan jika terjadi error. Jika butuh link khusus, silakan DM Discord GrayPlasma atau WhatsApp 0851-7979-4019 a/n Joel Gray."
  ],
  subpageCards: DEFAULT_HOMEPAGE_SUBPAGES,
  sectionTitles: {
    monitorsTitle: "DATABASE REKOMENDASI MONITOR LENGKAP",
    monitorsSubtitle: "Tabel interaktif & katalog pengujian GrayPlasma (9 monitor per halaman).",
    desksTitle: "DATABASE REKOMENDASI MEJA & SETUP ERGONOMI",
    desksSubtitle: "Tabel kurasi daun meja plywood solid & standing desk elektrik (Klik baris untuk melihat side panel ulasan).",
    armsTitle: "DATABASE REKOMENDASI MONITOR ARM (GAS SPRING)",
    armsSubtitle: "Tabel kurasi lengan gas spring kokoh penahan monitor 24\" - 34\" ultra-fleksibel.",
    bracketsTitle: "DATABASE REKOMENDASI BRACKET & MOUNT ADAPTER",
    bracketsSubtitle: "Tabel plat protektor pelindung daun meja jepit, desk stand universal, & bracket dinding VESA.",
    peripheralsTitle: "DATABASE REKOMENDASI AKSESORIS & KABEL DISPLAY",
    peripheralsSubtitle: "Tabel kurasi kabel DP 1.4/2.1, HDMI 2.1, screenbar, & cable management.",
    chairsTitle: "DATABASE REKOMENDASI KURSI ERGONOMIS & GAMING",
    chairsSubtitle: "Kurasi kursi ergonomis breathable mesh, lumbar support presisi, dan gas lift Class 4.",
  },
  sectionVisibility: {
    showMonitors: true,
    showDesks: true,
    showArms: true,
    showBrackets: true,
    showPeripherals: true,
    showChairs: false, // Default: false (Draft / Staging until officially released)
    showAftersales: true,
    showFaq: true,
    showGuides: true,
    showConsultation: true,
    showFeedback: true,
  },
};


export interface AnnouncementBarSettings {
  isEnabled: boolean;
  text: string;
  badgeText?: string;
  linkText?: string;
  linkUrl?: string;
  themeColor?: "emerald" | "cyan" | "amber" | "rose" | "violet";
}

export interface GlobalSiteSettings {
  brandName: string;
  brandTagline: string;
  copyrightText: string;
  consultation: {
    author: string;
    collaborators: string;
    whatsapp: string;
    whatsappUrl: string;
    tiktok: string;
    tiktokUrl: string;
    discordUrl: string;
    youtubeUrl: string;
    notionUrl: string;
    feedbackFormUrl: string;
    disclaimer: string;
    pricingNote?: string;
    qrisImageUrl?: string;
  };
  announcement: AnnouncementBarSettings;
  themeAccent: "emerald" | "cyan" | "violet" | "amber";
}

export const DEFAULT_SITE_SETTINGS: GlobalSiteSettings = {
  brandName: "GRAYPLASMA ID",
  brandTagline: "Database Pengujian & Kurasi Monitor Independen",
  copyrightText: "© 2024-2026 GrayPlasma ID. Seluruh hak cipta dilindungi.",
  consultation: {
    ...CONSULTATION_DATA,
    pricingNote: "Free Community Discord Consultation & VIP Dedicated Setup Review",
    qrisImageUrl: "",
  },
  announcement: {
    isEnabled: false,
    text: "Update Database Laboratorium GrayPlasma 2026 telah aktif! Cek rekomendasi monitor dan panduan aftersales terbaru.",
    badgeText: "UPDATE",
    linkText: "Buka Panduan",
    linkUrl: "/guide/sdr/glossary",
    themeColor: "emerald",
  },
  themeAccent: "emerald",
};

export type AdminRole = "super_admin" | "lead_reviewer" | "editor" | "contributor";

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  role: AdminRole;
  roleTitle: string;
  avatar: string;
  pinCode: string;
  email?: string;
  bio?: string;
  permissions: string[]; // ["*"] or ["monitors", "guides", "faq", "banners", "settings", "admins"]
  createdAt: string;
  lastLogin?: string;
}

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-grayplasma",
    name: "Grayplasma",
    username: "grayplasma",
    role: "super_admin",
    roleTitle: "Master Administrator",
    avatar: "/gp-logo.png",
    // Password TIDAK lagi disimpan di kode. Autentikasi lewat Supabase Auth.
    pinCode: "",
    email: "grayplasma@grayplasma.id",
    bio: "Master Administrator GrayPlasma.",
    permissions: ["*"],
    createdAt: "2024-01-01",
    lastLogin: "2026-09-17",
  },
];

export interface AdminActivityLog {
  id: string;
  adminName: string;
  adminRole: string;
  action: "create" | "update" | "delete" | "sync" | "reset" | "restore";
  targetType: "monitor" | "desk" | "peripheral" | "chair" | "aftersales" | "hierarchy" | "faq" | "guide" | "settings" | "admin" | "banner";
  targetName: string;
  timestamp: string;
  details?: string;
}

export const INITIAL_ACTIVITY_LOGS: AdminActivityLog[] = [
  {
    id: "log-init-1",
    adminName: "Joel Gray",
    adminRole: "Super Admin",
    action: "update",
    targetType: "settings",
    targetName: "Sistem Master Workspace",
    timestamp: "2026-08-31 14:00",
    details: "Inisialisasi sistem manajemen komprehensif Katalog Interaktif dan Hierarki Admin RBAC.",
  },
  {
    id: "log-init-2",
    adminName: "Grayplasma",
    adminRole: "Lead Reviewer",
    action: "update",
    targetType: "monitor",
    targetName: "55 Model Database Monitor",
    timestamp: "2026-08-30 19:45",
    details: "Verifikasi kelengkapan nilai akurasi warna deITP dan response time GrayPlasma.",
  },
];

// Helper for local storage access
function getLocalData<T>(key: string, defaultData: T): T {
  if (typeof window === "undefined") return defaultData;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultData;
  } catch (e) {
    console.error("Local storage read error", e);
    return defaultData;
  }
}

function setLocalData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage write error", e);
  }
}

export class DatabaseService {
  // ==========================================
  // 0. ACTIVITY LOGGING
  // ==========================================
  static logActivity(
    action: AdminActivityLog["action"],
    targetType: AdminActivityLog["targetType"],
    targetName: string,
    details?: string,
    adminOverride?: { name: string; role: string }
  ): AdminActivityLog[] {
    const logs = getLocalData<AdminActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
    const currentAdmin = adminOverride || DatabaseService.getCurrentAdminSession() || {
      name: "Super Admin",
      role: "super_admin",
    };

    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      adminName: currentAdmin.name,
      adminRole: currentAdmin.role,
      action,
      targetType,
      targetName,
      timestamp: new Date().toLocaleString("id-ID"),
      details,
    };

    const updated = [newLog, ...logs.slice(0, 99)]; // Keep latest 100 logs
    setLocalData(STORAGE_KEYS.ACTIVITY_LOGS, updated);
    return updated;
  }

  static getActivityLogs(): AdminActivityLog[] {
    return getLocalData<AdminActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
  }

  static clearActivityLogs(): AdminActivityLog[] {
    setLocalData(STORAGE_KEYS.ACTIVITY_LOGS, []);
    return [];
  }

  // ==========================================
  // 0.1 ADMIN HIERARCHY & USERS (RBAC)
  // ==========================================
  static getAdminUsers(): AdminUser[] {
    const list = getLocalData<AdminUser[]>(STORAGE_KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS);
    // Ensure old default admins (Joel, Glacik, Editor) are purged and only grayplasma is active
    const hasGrayplasma = list.some((u) => u.username?.toLowerCase() === "grayplasma");
    const hasOldAdmins = list.some((u) => u.id === "admin-joel" || u.username === "gray1plasma" || u.id === "admin-glacik" || u.id === "admin-editor");
    if (!hasGrayplasma || hasOldAdmins) {
      setLocalData(STORAGE_KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS);
      return DEFAULT_ADMIN_USERS;
    }
    return list;
  }

  static async getAdminUsersAsync(): Promise<AdminUser[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("admin_profiles")
          .select("*")
          .order("created_at", { ascending: true });
        if (!error && data && data.length > 0) {
          const mapped: AdminUser[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            username: d.email?.split("@")[0] || d.name.toLowerCase().replace(/\s+/g, ""),
            role: d.role || "editor",
            roleTitle: d.role_title || "Collaborator",
            avatar: d.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
            pinCode: "",
            email: d.email,
            bio: d.bio,
            permissions: d.permissions || ["guides", "faq"],
            createdAt: d.created_at?.substring(0, 10) || "2026-01-01",
            lastLogin: d.last_login?.substring(0, 10) || "2026-08-30",
          }));
          setLocalData(STORAGE_KEYS.ADMIN_USERS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn("Supabase admin_profiles fetch failed, using local", err);
      }
    }
    return getLocalData<AdminUser[]>(STORAGE_KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS);
  }

  static saveAdminUser(user: AdminUser): AdminUser[] {
    let current = getLocalData<AdminUser[]>(STORAGE_KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS);
    const idx = current.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      current[idx] = user;
      DatabaseService.logActivity("update", "admin", user.name, `Memperbarui profil admin & peran: ${user.role}`);
    } else {
      current = [...current, user];
      DatabaseService.logActivity("create", "admin", user.name, `Menambahkan anggota admin baru: ${user.role}`);
    }
    setLocalData(STORAGE_KEYS.ADMIN_USERS, current);

    if (isSupabaseConfigured && supabase) {
      supabase.from("admin_profiles").upsert({
        id: user.id.length === 36 ? user.id : undefined, // only UUIDs for Supabase
        name: user.name,
        email: user.email,
        role: user.role,
        role_title: user.roleTitle,
        avatar: user.avatar,
        bio: user.bio,
        permissions: user.permissions,
        is_active: true,
      }).then(({ error }) => {
        if (error) console.error("Supabase admin profile upsert error", error);
      });
    }

    return current;
  }

  static deleteAdminUser(id: string): AdminUser[] {
    let current = getLocalData<AdminUser[]>(STORAGE_KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS);
    const target = current.find((u) => u.id === id);
    if (target) {
      DatabaseService.logActivity("delete", "admin", target.name, `Menghapus akun admin ${target.username}`);
    }
    current = current.filter((u) => u.id !== id);
    setLocalData(STORAGE_KEYS.ADMIN_USERS, current);
    return current;
  }

  static resetAdminUsers(): AdminUser[] {
    setLocalData(STORAGE_KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS);
    DatabaseService.logActivity("reset", "admin", "Seluruh Tim Admin", "Reset tim admin ke anggota bawaan.");
    return DEFAULT_ADMIN_USERS;
  }

  static setCurrentAdminSession(admin: AdminUser | null): void {
    if (typeof window === "undefined") return;
    if (admin) {
      setLocalData(STORAGE_KEYS.CURRENT_ADMIN_SESSION, admin);
      sessionStorage.setItem("gp_admin_auth", "true");
      sessionStorage.setItem("gp_admin_role", admin.role);
      sessionStorage.setItem("gp_admin_name", admin.name);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN_SESSION);
      sessionStorage.removeItem("gp_admin_auth");
      sessionStorage.removeItem("gp_admin_role");
      sessionStorage.removeItem("gp_admin_name");
    }
  }

  static getCurrentAdminSession(): AdminUser | null {
    // P0 FIX: tidak ada lagi fallback ke super admin default.
    // Kalau tidak ada sesi tersimpan, hasilnya null — bukan "dianggap super admin".
    const session = getLocalData<AdminUser | null>(STORAGE_KEYS.CURRENT_ADMIN_SESSION, null);
    return session ?? null;
  }

  /**
   * Normalisasi field monitor:
   * - Nama kolom DB lama `gtidReviewUrl` -> `reviewUrl`.
   * - Sinkronisasi 2 arah antara kolom link affiliate (`linkShopee`, `linkTokopedia`)
   *   dengan array `marketplaces` JSONB agar sinkron di semua komponen (halaman utama & admin).
   */
  static normalizeMonitor<T extends Record<string, any>>(row: T): T {
    if (!row) return row;
    const out = { ...row } as any;
    if (!out.reviewUrl && out.gtidReviewUrl) out.reviewUrl = out.gtidReviewUrl;
    delete out.gtidReviewUrl;

    const marketplaces = Array.isArray(out.marketplaces) ? [...out.marketplaces] : [];

    // Sync Shopee link
    const shopeeIdx = marketplaces.findIndex(
      (m: any) => m.marketplace?.toLowerCase() === "shopee"
    );
    if (out.linkShopee && typeof out.linkShopee === "string" && out.linkShopee.trim() !== "") {
      const trimmed = out.linkShopee.trim();
      if (shopeeIdx >= 0) {
        marketplaces[shopeeIdx] = { ...marketplaces[shopeeIdx], url: trimmed };
      } else {
        marketplaces.push({ marketplace: "Shopee", url: trimmed, price: Number(out.price) || 0, isAffiliate: true });
      }
    } else if (shopeeIdx >= 0 && marketplaces[shopeeIdx]?.url) {
      out.linkShopee = marketplaces[shopeeIdx].url;
    }

    // Sync Tokopedia link
    const topedIdx = marketplaces.findIndex(
      (m: any) => m.marketplace?.toLowerCase() === "tokopedia"
    );
    if (out.linkTokopedia && typeof out.linkTokopedia === "string" && out.linkTokopedia.trim() !== "") {
      const trimmed = out.linkTokopedia.trim();
      if (topedIdx >= 0) {
        marketplaces[topedIdx] = { ...marketplaces[topedIdx], url: trimmed };
      } else {
        marketplaces.push({ marketplace: "Tokopedia", url: trimmed, price: Number(out.price) || 0, isAffiliate: true });
      }
    } else if (topedIdx >= 0 && marketplaces[topedIdx]?.url) {
      out.linkTokopedia = marketplaces[topedIdx].url;
    }

    out.marketplaces = marketplaces;
    return out as T;
  }

  /**
   * Siapkan payload upsert monitor yang aman untuk kedua skema DB:
   * - kalau kolom `reviewUrl` sudah ada (setelah ALTER TABLE) -> pakai itu
   * - kalau belum (masih `gtidReviewUrl`) -> pakai kolom lama
   * Deteksi dilakukan dari respons error PostgREST (PGRST204 = unknown column).
   */
  private static async upsertMonitorRow(row: Record<string, unknown>): Promise<void> {
    if (!supabase) return;
    invalidateCache("monitors");
    const base = { ...row } as Record<string, unknown> & { gtidReviewUrl?: string; reviewUrl?: string };
    delete base.reviewUrl;
    const legacy = { ...base, gtidReviewUrl: base.gtidReviewUrl ?? row.reviewUrl ?? null };
    delete legacy.reviewUrl;
    const modern = { ...base, reviewUrl: row.reviewUrl ?? base.gtidReviewUrl ?? null };
    delete modern.gtidReviewUrl;

    let res = await supabase.from("monitors").upsert(modern as never);
    if (res.error && /gtidReviewUrl|reviewUrl/i.test(res.error.message)) {
      res = await supabase.from("monitors").upsert(legacy as never);
    }
    if (res.error) console.error("Supabase monitor upsert error", res.error);
  }

  // ==========================================
  // 1. MONITORS CRUD
  // ==========================================
  static async getMonitors(): Promise<Monitor[]> {
    return cachedFetch("monitors", async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("monitors")
            .select("*")
            .order("created_at", { ascending: false });

          if (!error && data && data.length > 0) {
            return (data as (Monitor & { gtidReviewUrl?: string })[]).map((m) =>
              DatabaseService.normalizeMonitor(m)
            ) as Monitor[];
          }
        } catch (err) {
          console.warn("Supabase fetch failed, using local storage", err);
        }
      }
      const local = getLocalData<Monitor[]>(STORAGE_KEYS.MONITORS, MONITORS_DATA);
      return local.map((m) => DatabaseService.normalizeMonitor(m));
    }, 45000);
  }

  static async saveMonitor(monitor: Monitor): Promise<Monitor[]> {
    invalidateCache("monitors");
    const normalized = DatabaseService.normalizeMonitor(monitor);
    let current = getLocalData<Monitor[]>(STORAGE_KEYS.MONITORS, MONITORS_DATA);
    const existingIndex = current.findIndex((m) => m.id === normalized.id);

    const updatedMonitor: Monitor = {
      ...normalized,
      updatedAt: new Date().toISOString(),
      versionId: (normalized.versionId || 1) + 1,
    };

    if (existingIndex >= 0) {
      current[existingIndex] = updatedMonitor;
      DatabaseService.logActivity("update", "monitor", monitor.fullName, `Update harga/spek: Tier ${monitor.tier}`);
    } else {
      current = [updatedMonitor, ...current];
      DatabaseService.logActivity("create", "monitor", monitor.fullName, `Menambah monitor baru: ${monitor.brand}`);
    }

    setLocalData(STORAGE_KEYS.MONITORS, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await DatabaseService.upsertMonitorRow(updatedMonitor as unknown as Record<string, unknown>);
      } catch (err) {
        console.error("Supabase monitor upsert error", err);
      }
    }

    return current;
  }

  static async deleteMonitor(id: string): Promise<Monitor[]> {
    invalidateCache("monitors");
    let current = getLocalData<Monitor[]>(STORAGE_KEYS.MONITORS, MONITORS_DATA);
    const target = current.find((m) => m.id === id);
    if (target) {
      DatabaseService.logActivity("delete", "monitor", target.fullName, "Menghapus monitor dari database.");
    }
    current = current.filter((m) => m.id !== id);
    setLocalData(STORAGE_KEYS.MONITORS, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("monitors").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase monitor delete error", err);
      }
    }

    return current;
  }

  static async reorderMonitors(newOrder: Monitor[]): Promise<Monitor[]> {
    setLocalData(STORAGE_KEYS.MONITORS, newOrder);
    DatabaseService.logActivity("update", "monitor", "Urutan Database", `Mengatur ulang urutan ${newOrder.length} monitor via drag-and-drop.`);
    return newOrder;
  }

  static resetMonitorsToDefault(): Monitor[] {
    setLocalData(STORAGE_KEYS.MONITORS, MONITORS_DATA);
    DatabaseService.logActivity("reset", "monitor", "55 Monitor Bawaan", "Reset monitor ke database default.");
    return MONITORS_DATA;
  }

  // ==========================================
  // 2. DESKS CRUD
  // ==========================================
  static async getDesks(): Promise<DeskItem[]> {
    return cachedFetch("desks", async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from("desks").select("*");
          if (!error && data && data.length > 0) {
            return data as DeskItem[];
          }
        } catch (err) {
          console.warn("Supabase desk fetch failed", err);
        }
      }
      return getLocalData<DeskItem[]>(STORAGE_KEYS.DESKS, DESK_DATABASE);
    }, 120000);
  }

  static async saveDesk(desk: DeskItem): Promise<DeskItem[]> {
    invalidateCache("desks");
    let current = getLocalData<DeskItem[]>(STORAGE_KEYS.DESKS, DESK_DATABASE);
    const idx = current.findIndex((d) => d.id === desk.id);
    if (idx >= 0) {
      current[idx] = desk;
      DatabaseService.logActivity("update", "desk", desk.name);
    } else {
      current = [desk, ...current];
      DatabaseService.logActivity("create", "desk", desk.name);
    }

    setLocalData(STORAGE_KEYS.DESKS, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("desks").upsert(desk);
      } catch (err) {
        console.error("Supabase desk upsert error", err);
      }
    }
    return current;
  }

  static async deleteDesk(id: string): Promise<DeskItem[]> {
    invalidateCache("desks");
    let current = getLocalData<DeskItem[]>(STORAGE_KEYS.DESKS, DESK_DATABASE);
    const target = current.find((d) => d.id === id);
    if (target) DatabaseService.logActivity("delete", "desk", target.name);
    current = current.filter((d) => d.id !== id);
    setLocalData(STORAGE_KEYS.DESKS, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("desks").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase desk delete error", err);
      }
    }
    return current;
  }

  static async reorderDesks(newOrder: DeskItem[]): Promise<DeskItem[]> {
    setLocalData(STORAGE_KEYS.DESKS, newOrder);
    DatabaseService.logActivity("update", "desk", "Urutan Meja", `Mengatur ulang urutan ${newOrder.length} meja via drag-and-drop.`);
    return newOrder;
  }

  static resetDesksToDefault(): DeskItem[] {
    setLocalData(STORAGE_KEYS.DESKS, DESK_DATABASE);
    DatabaseService.logActivity("reset", "desk", "Katalog Meja", "Reset meja ke default.");
    return DESK_DATABASE;
  }

  // ==========================================
  // 3. PERIPHERALS CRUD
  // ==========================================
  static normalizePeripheral(row: any): PeripheralItem {
    if (!row) return row;
    const out = { ...row };
    if (!out.shopeeUrl && out.shopee_url) out.shopeeUrl = out.shopee_url;
    if (!out.tokopediaUrl && out.tokopedia_url) out.tokopediaUrl = out.tokopedia_url;
    if (!out.tiktokUrl && out.tiktok_url) out.tiktokUrl = out.tiktok_url;
    if (out.shopeeUrl) out.shopeeUrl = out.shopeeUrl.trim();
    if (out.tokopediaUrl) out.tokopediaUrl = out.tokopediaUrl.trim();
    if (out.tiktokUrl) out.tiktokUrl = out.tiktokUrl.trim();
    return out as PeripheralItem;
  }

  static async getPeripherals(): Promise<PeripheralItem[]> {
    return cachedFetch("peripherals", async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from("peripherals").select("*");
          if (!error && data && data.length > 0) {
            return (data as any[]).map((p) => DatabaseService.normalizePeripheral(p));
          }
        } catch (err) {
          console.warn("Supabase peripheral fetch failed", err);
        }
      }
      const local = getLocalData<PeripheralItem[]>(STORAGE_KEYS.PERIPHERALS, PERIPHERALS_DATABASE);
      return local.map((p) => DatabaseService.normalizePeripheral(p));
    }, 120000);
  }

  static async savePeripheral(item: PeripheralItem): Promise<PeripheralItem[]> {
    invalidateCache("peripherals");
    const normalized = DatabaseService.normalizePeripheral(item);
    let current = getLocalData<PeripheralItem[]>(STORAGE_KEYS.PERIPHERALS, PERIPHERALS_DATABASE);
    const idx = current.findIndex((p) => p.id === normalized.id);
    if (idx >= 0) {
      current[idx] = normalized;
      DatabaseService.logActivity("update", "peripheral", normalized.name);
    } else {
      current = [normalized, ...current];
      DatabaseService.logActivity("create", "peripheral", normalized.name);
    }

    setLocalData(STORAGE_KEYS.PERIPHERALS, current);

    if (isSupabaseConfigured && supabase) {
      try {
        const payload: any = {
          ...normalized,
          shopeeUrl: normalized.shopeeUrl || null,
          tokopediaUrl: normalized.tokopediaUrl || null,
          tiktokUrl: normalized.tiktokUrl || null,
        };
        const res = await supabase.from("peripherals").upsert(payload);
        if (res.error && /column.*does not exist|PGRST204/i.test(res.error.message)) {
          // Fallback ke snake_case kolom jika schema database memakai snake_case
          const snakePayload: any = {
            ...normalized,
            shopee_url: normalized.shopeeUrl || null,
            tokopedia_url: normalized.tokopediaUrl || null,
            tiktok_url: normalized.tiktokUrl || null,
          };
          delete snakePayload.shopeeUrl;
          delete snakePayload.tokopediaUrl;
          delete snakePayload.tiktokUrl;
          await supabase.from("peripherals").upsert(snakePayload);
        }
      } catch (err) {
        console.error("Supabase peripheral upsert error", err);
      }
    }
    return current;
  }

  static async deletePeripheral(id: string): Promise<PeripheralItem[]> {
    invalidateCache("peripherals");
    let current = getLocalData<PeripheralItem[]>(STORAGE_KEYS.PERIPHERALS, PERIPHERALS_DATABASE);
    const target = current.find((p) => p.id === id);
    if (target) DatabaseService.logActivity("delete", "peripheral", target.name);
    current = current.filter((p) => p.id !== id);
    setLocalData(STORAGE_KEYS.PERIPHERALS, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("peripherals").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase peripheral delete error", err);
      }
    }
    return current;
  }

  // ==========================================
  // 3B. CHAIRS CRUD (Staging & Ergonomic Manager)
  // ==========================================
  static getChairs(): ChairItem[] {
    return getLocalData<ChairItem[]>(STORAGE_KEYS.CHAIRS, DEFAULT_CHAIRS_DATABASE);
  }

  static async getChairsAsync(): Promise<ChairItem[]> {
    return cachedFetch("chairs", async () => {
      if (isSupabaseConfigured && supabase && !isTableMissing("chairs")) {
        try {
          const { data, error } = await supabase.from("chairs").select("*");
          if (isMissingRelationError(error)) {
            // Tabel `chairs` belum dibuat di Supabase. Sekali catat, lalu skip.
            markTableMissing("chairs");
            return getLocalData<ChairItem[]>(STORAGE_KEYS.CHAIRS, DEFAULT_CHAIRS_DATABASE);
          }
          if (!error && data && data.length > 0) return data as ChairItem[];
        } catch (err) {
          console.warn("Supabase chair fetch failed", err);
        }
      }
      return getLocalData<ChairItem[]>(STORAGE_KEYS.CHAIRS, DEFAULT_CHAIRS_DATABASE);
    }, 300000);
  }

  static async saveChair(item: ChairItem): Promise<ChairItem[]> {
    invalidateCache("chairs");
    let current = getLocalData<ChairItem[]>(STORAGE_KEYS.CHAIRS, DEFAULT_CHAIRS_DATABASE);
    const idx = current.findIndex((c) => c.id === item.id);
    if (idx >= 0) {
      current[idx] = item;
      DatabaseService.logActivity("update", "chair", item.name);
    } else {
      current = [item, ...current];
      DatabaseService.logActivity("create", "chair", item.name);
    }
    setLocalData(STORAGE_KEYS.CHAIRS, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("chairs").upsert(item);
      } catch (err) {
        console.error("Supabase chair upsert error", err);
      }
    }
    return current;
  }

  static async saveAllChairs(chairs: ChairItem[]): Promise<ChairItem[]> {
    invalidateCache("chairs");
    setLocalData(STORAGE_KEYS.CHAIRS, chairs);
    DatabaseService.logActivity("update", "chair", "Katalog Kursi", `Memperbarui ${chairs.length} data kursi.`);
    return chairs;
  }

  static async deleteChair(id: string): Promise<ChairItem[]> {
    invalidateCache("chairs");
    let current = getLocalData<ChairItem[]>(STORAGE_KEYS.CHAIRS, DEFAULT_CHAIRS_DATABASE);
    const target = current.find((c) => c.id === id);
    if (target) DatabaseService.logActivity("delete", "chair", target.name);
    current = current.filter((c) => c.id !== id);
    setLocalData(STORAGE_KEYS.CHAIRS, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("chairs").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase chair delete error", err);
      }
    }
    return current;
  }

  static resetChairsToDefault(): ChairItem[] {
    setLocalData(STORAGE_KEYS.CHAIRS, DEFAULT_CHAIRS_DATABASE);
    DatabaseService.logActivity("reset", "chair", "Template Kursi", "Reset katalog kursi ke default template.");
    return DEFAULT_CHAIRS_DATABASE;
  }

  // ==========================================
  // 4. AFTERSALES CRUD
  // ==========================================
  static async getAftersales(): Promise<AftersalesBrand[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("aftersales").select("*");
        if (!error && data && data.length > 0) return data as AftersalesBrand[];
      } catch (err) {
        console.warn("Supabase aftersales fetch failed", err);
      }
    }
    return getLocalData<AftersalesBrand[]>(STORAGE_KEYS.AFTERSALES, AFTERSALES_DATA);
  }

  static async saveAftersales(brand: AftersalesBrand): Promise<AftersalesBrand[]> {
    let current = getLocalData<AftersalesBrand[]>(STORAGE_KEYS.AFTERSALES, AFTERSALES_DATA);
    const idx = current.findIndex((b) => b.brand === brand.brand);
    if (idx >= 0) {
      current[idx] = brand;
      DatabaseService.logActivity("update", "aftersales", brand.brand);
    } else {
      current = [brand, ...current];
      DatabaseService.logActivity("create", "aftersales", brand.brand);
    }

    setLocalData(STORAGE_KEYS.AFTERSALES, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("aftersales").upsert(brand);
      } catch (err) {
        console.error("Supabase aftersales upsert error", err);
      }
    }
    return current;
  }

  static async deleteAftersales(brandName: string): Promise<AftersalesBrand[]> {
    let current = getLocalData<AftersalesBrand[]>(STORAGE_KEYS.AFTERSALES, AFTERSALES_DATA);
    DatabaseService.logActivity("delete", "aftersales", brandName);
    current = current.filter((b) => b.brand !== brandName);
    setLocalData(STORAGE_KEYS.AFTERSALES, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("aftersales").delete().eq("brand", brandName);
      } catch (err) {
        console.error("Supabase aftersales delete error", err);
      }
    }
    return current;
  }

  // ==========================================
  // 5. SITE HIERARCHY & GUIDES CRUD
  // ==========================================
  static async getHierarchyNodes(): Promise<SiteHierarchyNode[]> {
    return cachedFetch("hierarchy_nodes", async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("hierarchy_nodes")
            .select("*")
            .order("order", { ascending: true });
          if (!error && data && data.length > 0) {
            return data as SiteHierarchyNode[];
          }
        } catch (err) {
          console.warn("Supabase hierarchy fetch failed", err);
        }
      }
      return getLocalData<SiteHierarchyNode[]>(STORAGE_KEYS.HIERARCHY, DEFAULT_SITE_HIERARCHY);
    }, 300000);
  }

  static async saveHierarchyNode(node: SiteHierarchyNode): Promise<SiteHierarchyNode[]> {
    invalidateCache("hierarchy_nodes");
    let current = getLocalData<SiteHierarchyNode[]>(STORAGE_KEYS.HIERARCHY, DEFAULT_SITE_HIERARCHY);
    const existingIndex = current.findIndex((n) => n.id === node.id);

    if (existingIndex >= 0) {
      current[existingIndex] = node;
      DatabaseService.logActivity("update", "hierarchy", node.title, `Path: ${node.fullPath}`);
    } else {
      current = [...current, node];
      DatabaseService.logActivity("create", "hierarchy", node.title, `Path: ${node.fullPath}`);
    }

    setLocalData(STORAGE_KEYS.HIERARCHY, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("hierarchy_nodes").upsert(node);
      } catch (err) {
        console.error("Supabase hierarchy upsert error", err);
      }
    }

    return current;
  }

  static async deleteHierarchyNode(id: string): Promise<SiteHierarchyNode[]> {
    invalidateCache("hierarchy_nodes");
    let current = getLocalData<SiteHierarchyNode[]>(STORAGE_KEYS.HIERARCHY, DEFAULT_SITE_HIERARCHY);
    const target = current.find((n) => n.id === id);
    if (target) DatabaseService.logActivity("delete", "hierarchy", target.title);
    current = current.filter((n) => n.id !== id);
    setLocalData(STORAGE_KEYS.HIERARCHY, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("hierarchy_nodes").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase hierarchy delete error", err);
      }
    }
    return current;
  }

  static resetHierarchyToDefault(): SiteHierarchyNode[] {
    setLocalData(STORAGE_KEYS.HIERARCHY, DEFAULT_SITE_HIERARCHY);
    DatabaseService.logActivity("reset", "hierarchy", "Hierarki Website", "Reset rute & panduan ke default.");
    return DEFAULT_SITE_HIERARCHY;
  }

  // ==========================================
  // 6. GLOBAL SITE SETTINGS & ANNOUNCEMENT BAR
  // ==========================================
  /**
   * Semua key `site_settings` diambil dalam SATU request.
   *
   * Sebelumnya tiap getter (global_site_config, page_banners, homepage_settings,
   * ad_banners) issuing request `.eq("key", ...)` sendiri-sendiri, dan dipanggil
   * dari 3 komponen sekaligus -> 7 request per page load. Sekarang 1.
   */
  private static async fetchSiteSettingsMap(): Promise<Record<string, unknown>> {
    return cachedFetch("site_settings:all", async () => {
        if (isSupabaseConfigured && supabase) {
          try {
            const { data, error } = await supabase
              .from("site_settings")
              .select("key,value")
              .in(
                "key",
                ["global_site_config", "page_banners", "homepage_settings", "ad_banners"]
              );
            if (!error && data && data.length > 0) {
              const map: Record<string, unknown> = {};
              for (const row of data as { key: string; value: unknown }[]) {
                map[row.key] = row.value;
              }
              return map;
            }
          } catch (err) {
            console.warn("Supabase site settings fetch failed", err);
          }
        }
        // Fallback: rakit dari localStorage per key.
        return {
          global_site_config: getLocalData<GlobalSiteSettings>(
            STORAGE_KEYS.SITE_SETTINGS,
            DEFAULT_SITE_SETTINGS
          ),
          page_banners: getLocalData<PageBannerSettings>(
            STORAGE_KEYS.PAGE_BANNERS,
            DEFAULT_BANNER_SETTINGS
          ),
          homepage_settings: getLocalData<HomepageSettings>(
            STORAGE_KEYS.HOMEPAGE_SETTINGS,
            DEFAULT_HOMEPAGE_SETTINGS
          ),
          ad_banners: getLocalData<AdBannerItem[]>(STORAGE_KEYS.AD_BANNERS, DEFAULT_AD_BANNERS),
        } satisfies Record<string, unknown>;
      });
    }

    static async getSiteSettings(): Promise<GlobalSiteSettings> {
      const map = await DatabaseService.fetchSiteSettingsMap();
      const value = map.global_site_config as GlobalSiteSettings | undefined;
      if (value) return value;
      return getLocalData<GlobalSiteSettings>(STORAGE_KEYS.SITE_SETTINGS, DEFAULT_SITE_SETTINGS);
    }

    static async getBannerSettings(): Promise<PageBannerSettings> {
      const map = await DatabaseService.fetchSiteSettingsMap();
      const value = map.page_banners as PageBannerSettings | undefined;
      if (value) return value;
      return getLocalData<PageBannerSettings>(STORAGE_KEYS.PAGE_BANNERS, DEFAULT_BANNER_SETTINGS);
    }

    static async getHomepageSettings(): Promise<HomepageSettings> {
      const map = await DatabaseService.fetchSiteSettingsMap();
      const value = map.homepage_settings as HomepageSettings | undefined;
      if (value) {
        // Normalisasi aksen kartu: nilai hex lama tidak pernah jadi CSS
        // (Tailwind cuma bisa mendeteksi class yang ada di source).
        if (Array.isArray(value.subpageCards)) {
          return {
            ...value,
            subpageCards: value.subpageCards.map((c) => ({
              ...c,
              color: normalizeCardAccent(c.color),
            })),
          };
        }
        return value;
      }
      return getLocalData<HomepageSettings>(
        STORAGE_KEYS.HOMEPAGE_SETTINGS,
        DEFAULT_HOMEPAGE_SETTINGS
      );
    }

    static async getAdBanners(): Promise<AdBannerItem[]> {
      const map = await DatabaseService.fetchSiteSettingsMap();
      const value = map.ad_banners as AdBannerItem[] | undefined;
      if (Array.isArray(value)) {
        return [...value].sort((a, b) => a.order - b.order);
      }
      const local = getLocalData<AdBannerItem[]>(STORAGE_KEYS.AD_BANNERS, DEFAULT_AD_BANNERS);
      return [...local].sort((a, b) => a.order - b.order);
    }

    static async saveSiteSettings(settings: GlobalSiteSettings): Promise<GlobalSiteSettings> {
    invalidateCache("site_settings:all");
    setLocalData(STORAGE_KEYS.SITE_SETTINGS, settings);
    DatabaseService.logActivity("update", "settings", "Konfigurasi Global Website", "Simpan info konsultasi, kontak, dan announcement bar.");

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("site_settings").upsert({
          key: "global_site_config",
          value: settings,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Supabase site settings upsert error", err);
      }
    }

    return settings;
  }

  static resetSiteSettings(): GlobalSiteSettings {
    invalidateCache("site_settings:all");
    setLocalData(STORAGE_KEYS.SITE_SETTINGS, DEFAULT_SITE_SETTINGS);
    DatabaseService.logActivity("reset", "settings", "Konfigurasi Global", "Reset ke default setting.");
    return DEFAULT_SITE_SETTINGS;
  }

  // ==========================================
  // 7. PAGE BANNER SETTINGS
  // ==========================================
  static async saveBannerSettings(settings: PageBannerSettings): Promise<PageBannerSettings> {
    invalidateCache("site_settings:all");
    setLocalData(STORAGE_KEYS.PAGE_BANNERS, settings);
    DatabaseService.logActivity("update", "banner", "Header Banners", "Update cover & judul banner.");

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("site_settings").upsert({
          key: "page_banners",
          value: settings,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Supabase banner settings upsert error", err);
      }
    }

    return settings;
  }

  static resetBannerSettings(): PageBannerSettings {
    invalidateCache("site_settings:all");
    setLocalData(STORAGE_KEYS.PAGE_BANNERS, DEFAULT_BANNER_SETTINGS);
    DatabaseService.logActivity("reset", "banner", "Banners", "Reset banner ke default.");
    return DEFAULT_BANNER_SETTINGS;
  }

  // ==========================================
  // 7B. HOMEPAGE SETTINGS & SUBPAGES CRUD
  // ==========================================
  static async saveHomepageSettings(settings: HomepageSettings): Promise<HomepageSettings> {
    invalidateCache("site_settings:all");
    setLocalData(STORAGE_KEYS.HOMEPAGE_SETTINGS, settings);
    DatabaseService.logActivity("update", "settings", "Homepage Settings", "Update hero, disclaimer, dan kartu navigasi beranda.");

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("site_settings").upsert({
          key: "homepage_settings",
          value: settings,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Supabase homepage settings upsert error", err);
      }
    }

    return settings;
  }

  static resetHomepageSettings(): HomepageSettings {
    invalidateCache("site_settings:all");
    setLocalData(STORAGE_KEYS.HOMEPAGE_SETTINGS, DEFAULT_HOMEPAGE_SETTINGS);
    DatabaseService.logActivity("reset", "settings", "Homepage Settings", "Reset konfigurasi beranda ke default.");
    return DEFAULT_HOMEPAGE_SETTINGS;
  }

  // ==========================================
  // 7B.2 AD BANNERS SLIDER (FULL-WIDTH ADS)
  // ==========================================

  static async saveAdBanner(banner: AdBannerItem): Promise<AdBannerItem[]> {
    invalidateCache("site_settings:all");
      let current = getLocalData<AdBannerItem[]>(STORAGE_KEYS.AD_BANNERS, DEFAULT_AD_BANNERS);
      const existingIndex = current.findIndex((b) => b.id === banner.id);
      if (existingIndex >= 0) {
        current[existingIndex] = { ...banner };
        DatabaseService.logActivity("update", "banner", banner.title, `Target: ${banner.linkUrl}`);
      } else {
        current = [...current, { ...banner }];
        DatabaseService.logActivity("create", "banner", banner.title, `Target: ${banner.linkUrl}`);
      }
      current.sort((a, b) => a.order - b.order);
      setLocalData(STORAGE_KEYS.AD_BANNERS, current);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("site_settings").upsert({
            key: "ad_banners",
            value: current,
            updated_at: new Date().toISOString(),
          });
        } catch (err) {
          console.error("Supabase ad banners upsert error", err);
        }
      }
      return current;
    }

    static async deleteAdBanner(id: string): Promise<AdBannerItem[]> {
    invalidateCache("site_settings:all");
      let current = getLocalData<AdBannerItem[]>(STORAGE_KEYS.AD_BANNERS, DEFAULT_AD_BANNERS);
      const target = current.find((b) => b.id === id);
      if (target) DatabaseService.logActivity("delete", "banner", target.title);
      current = current.filter((b) => b.id !== id);
      setLocalData(STORAGE_KEYS.AD_BANNERS, current);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("site_settings").upsert({
            key: "ad_banners",
            value: current,
            updated_at: new Date().toISOString(),
          });
        } catch (err) {
          console.error("Supabase ad banners sync error", err);
        }
      }
      return current;
    }

    static async reorderAdBanners(banners: AdBannerItem[]): Promise<AdBannerItem[]> {
    invalidateCache("site_settings:all");
      const updated = banners.map((b, idx) => ({ ...b, order: idx + 1 }));
      setLocalData(STORAGE_KEYS.AD_BANNERS, updated);
      DatabaseService.logActivity("update", "banner", "Urutan Ad Banner", "Perbarui susunan banner beranda.");

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("site_settings").upsert({
            key: "ad_banners",
            value: updated,
            updated_at: new Date().toISOString(),
          });
        } catch (err) {
          console.error("Supabase ad banners reorder sync error", err);
        }
      }
      return updated;
    }

    static resetAdBannersToDefault(): AdBannerItem[] {
    invalidateCache("site_settings:all");
      setLocalData(STORAGE_KEYS.AD_BANNERS, DEFAULT_AD_BANNERS);
      DatabaseService.logActivity("reset", "banner", "Ad Banners", "Kembalikan banner ke default.");
      return DEFAULT_AD_BANNERS;
    }

    // ==========================================
    // 7C. AFTERSALES KANBAN CARDS CRUD
    // ==========================================
    static async getAftersalesCards(): Promise<NotionBoardCard[]> {
      return cachedFetch("aftersales_cards", async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("aftersales_cards")
            .select("*");
          if (!error && data && data.length > 0) {
            return data as NotionBoardCard[];
          }
        } catch (err) {
          console.warn("Supabase aftersales cards fetch failed", err);
        }
      }
      return getLocalData<NotionBoardCard[]>(STORAGE_KEYS.AFTERSALES_CARDS, NOTION_AFTERSALES_CARDS);
    }, 120000);
  }

  static async saveAftersalesCard(card: NotionBoardCard): Promise<NotionBoardCard[]> {
    invalidateCache("aftersales_cards");
    let current = getLocalData<NotionBoardCard[]>(STORAGE_KEYS.AFTERSALES_CARDS, NOTION_AFTERSALES_CARDS);
    const idx = current.findIndex((c) => c.id === card.id);
    if (idx >= 0) {
      current[idx] = card;
      DatabaseService.logActivity("update", "aftersales", card.title, `Kolom: ${card.columnId}`);
    } else {
      current = [card, ...current];
      DatabaseService.logActivity("create", "aftersales", card.title, `Kolom: ${card.columnId}`);
    }

    setLocalData(STORAGE_KEYS.AFTERSALES_CARDS, current);

    if (isSupabaseConfigured && supabase) {
      try {
        const payload: any = {
          ...card,
          brand: (card as any).brand || card.title || card.id,
        };
        await supabase.from("aftersales_cards").upsert(payload);
      } catch (err) {
        console.error("Supabase aftersales card upsert error", err);
      }
    }

    return current;
  }

  static async deleteAftersalesCard(cardId: string): Promise<NotionBoardCard[]> {
    invalidateCache("aftersales_cards");
    let current = getLocalData<NotionBoardCard[]>(STORAGE_KEYS.AFTERSALES_CARDS, NOTION_AFTERSALES_CARDS);
    const target = current.find((c) => c.id === cardId);
    if (target) {
      DatabaseService.logActivity("delete", "aftersales", target.title);
    }
    current = current.filter((c) => c.id !== cardId);
    setLocalData(STORAGE_KEYS.AFTERSALES_CARDS, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("aftersales_cards").delete().eq("id", cardId);
      } catch (err) {
        console.error("Supabase aftersales card delete error", err);
      }
    }

    return current;
  }

  static async saveAftersalesCards(cards: NotionBoardCard[]): Promise<NotionBoardCard[]> {
    invalidateCache("aftersales_cards");
    setLocalData(STORAGE_KEYS.AFTERSALES_CARDS, cards);
    DatabaseService.logActivity("update", "aftersales", "Semua Kartu Kanban Aftersales", `Total: ${cards.length} kartu`);
    return cards;
  }

  static resetAftersalesCards(): NotionBoardCard[] {
    setLocalData(STORAGE_KEYS.AFTERSALES_CARDS, NOTION_AFTERSALES_CARDS);
    DatabaseService.logActivity("reset", "aftersales", "Aftersales Kanban Cards", "Reset kartu aftersales ke default.");
    return NOTION_AFTERSALES_CARDS;
  }


  // ==========================================
  // 8. FAQ KNOWLEDGEBASE CRUD
  // ==========================================
  static getFAQ(): FAQItem[] {
    return getLocalData<FAQItem[]>(STORAGE_KEYS.FAQ_ITEMS, FAQ_LIST);
  }

  static async getFAQAsync(): Promise<FAQItem[]> {
    return cachedFetch("faq_items", async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("faq_items")
            .select("*")
            .order("order", { ascending: true });
          if (!error && data && data.length > 0) {
            setLocalData(STORAGE_KEYS.FAQ_ITEMS, data);
            return data as FAQItem[];
          }
        } catch (err) {
          console.warn("Supabase FAQ fetch failed, fallback to local", err);
        }
      }
      return getLocalData<FAQItem[]>(STORAGE_KEYS.FAQ_ITEMS, FAQ_LIST);
    }, 300000);
  }

  static saveFAQ(item: FAQItem): FAQItem[] {
    invalidateCache("faq_items");
    let current = getLocalData<FAQItem[]>(STORAGE_KEYS.FAQ_ITEMS, FAQ_LIST);
    const idx = current.findIndex((f) => f.id === item.id);
    if (idx >= 0) {
      current[idx] = item;
      DatabaseService.logActivity("update", "faq", item.question);
    } else {
      current = [item, ...current];
      DatabaseService.logActivity("create", "faq", item.question);
    }
    setLocalData(STORAGE_KEYS.FAQ_ITEMS, current);

    if (isSupabaseConfigured && supabase) {
      supabase.from("faq_items").upsert(item).then(({ error }) => {
        if (error) console.error("Supabase FAQ upsert error", error);
      });
    }

    return current;
  }

  static deleteFAQ(id: string): FAQItem[] {
    invalidateCache("faq_items");
    let current = getLocalData<FAQItem[]>(STORAGE_KEYS.FAQ_ITEMS, FAQ_LIST);
    const target = current.find((f) => f.id === id);
    if (target) DatabaseService.logActivity("delete", "faq", target.question);
    current = current.filter((f) => f.id !== id);
    setLocalData(STORAGE_KEYS.FAQ_ITEMS, current);

    if (isSupabaseConfigured && supabase) {
      supabase.from("faq_items").delete().eq("id", id).then(({ error }) => {
        if (error) console.error("Supabase FAQ delete error", error);
      });
    }

    return current;
  }

  static resetFAQ(): FAQItem[] {
    invalidateCache("faq_items");
    setLocalData(STORAGE_KEYS.FAQ_ITEMS, FAQ_LIST);
    DatabaseService.logActivity("reset", "faq", "Daftar FAQ", "Reset FAQ ke default.");
    return FAQ_LIST;
  }

  // ==========================================
  // 9. KNOWLEDGE BASE ARTICLES & GUIDES CRUD
  // ==========================================
  static getDeskGuides(): DeskGuide[] {
    return getLocalData<DeskGuide[]>(STORAGE_KEYS.DESK_GUIDES, DESK_GUIDES);
  }
  static saveDeskGuides(guides: DeskGuide[]): DeskGuide[] {
    setLocalData(STORAGE_KEYS.DESK_GUIDES, guides);
    DatabaseService.logActivity("update", "guide", "Pedoman Ukuran Meja & Ergonomi");
    return guides;
  }

  static getHDRGuides(): HDRGuide[] {
    return getLocalData<HDRGuide[]>(STORAGE_KEYS.HDR_GUIDES, HDR_GUIDES);
  }
  static saveHDRGuides(guides: HDRGuide[]): HDRGuide[] {
    setLocalData(STORAGE_KEYS.HDR_GUIDES, guides);
    DatabaseService.logActivity("update", "guide", "Klasifikasi HDR & OLED Tiers");
    return guides;
  }

  static getGrayNotes(): GrayNoteItem[] {
    return getLocalData<GrayNoteItem[]>(STORAGE_KEYS.GRAYNOTES, GRAYNOTES_LIST);
  }
  static saveGrayNotes(notes: GrayNoteItem[]): GrayNoteItem[] {
    setLocalData(STORAGE_KEYS.GRAYNOTES, notes);
    DatabaseService.logActivity("update", "guide", "GrayNotes Technical Library");
    return notes;
  }

  static getBrandsToAvoid(): AvoidBrandItem[] {
    return getLocalData<AvoidBrandItem[]>(STORAGE_KEYS.BRANDS_TO_AVOID, BRANDS_TO_AVOID_DATA);
  }
  static saveBrandsToAvoid(items: AvoidBrandItem[]): AvoidBrandItem[] {
    setLocalData(STORAGE_KEYS.BRANDS_TO_AVOID, items);
    DatabaseService.logActivity("update", "guide", "Catatan Waspada Brand & ODM");
    return items;
  }

  static getBandwidthGuides(): BandwidthGuidance[] {
    return getLocalData<BandwidthGuidance[]>(STORAGE_KEYS.BANDWIDTH_GUIDES, BANDWIDTH_GUIDANCES);
  }
  static saveBandwidthGuides(guides: BandwidthGuidance[]): BandwidthGuidance[] {
    setLocalData(STORAGE_KEYS.BANDWIDTH_GUIDES, guides);
    DatabaseService.logActivity("update", "guide", "DisplayPort & HDMI Bandwidth Matrix");
    return guides;
  }

  static getAboutContent(): typeof ABOUT_NOTION_CONTENT {
    return getLocalData(STORAGE_KEYS.ABOUT_CONTENT, ABOUT_NOTION_CONTENT);
  }
  static saveAboutContent(content: typeof ABOUT_NOTION_CONTENT): typeof ABOUT_NOTION_CONTENT {
    setLocalData(STORAGE_KEYS.ABOUT_CONTENT, content);
    DatabaseService.logActivity("update", "guide", "Tentang Website & Profil Joel Gray");
    return content;
  }

  // ==========================================
  // 10. FULL 1-CLICK BACKUP & RESTORE (JSON)
  // ==========================================
  static exportFullDatabaseJSON(): string {
    const fullBackup = {
      version: "2.0.0",
      exportDate: new Date().toISOString(),
      monitors: getLocalData(STORAGE_KEYS.MONITORS, MONITORS_DATA),
      desks: getLocalData(STORAGE_KEYS.DESKS, DESK_DATABASE),
      peripherals: getLocalData(STORAGE_KEYS.PERIPHERALS, PERIPHERALS_DATABASE),
      aftersales: getLocalData(STORAGE_KEYS.AFTERSALES, AFTERSALES_DATA),
      aftersalesCards: getLocalData(STORAGE_KEYS.AFTERSALES_CARDS, NOTION_AFTERSALES_CARDS),
      hierarchy: getLocalData(STORAGE_KEYS.HIERARCHY, DEFAULT_SITE_HIERARCHY),
      pageBanners: getLocalData(STORAGE_KEYS.PAGE_BANNERS, DEFAULT_BANNER_SETTINGS),
      homepageSettings: getLocalData(STORAGE_KEYS.HOMEPAGE_SETTINGS, DEFAULT_HOMEPAGE_SETTINGS),
      siteSettings: getLocalData(STORAGE_KEYS.SITE_SETTINGS, DEFAULT_SITE_SETTINGS),
      faqItems: getLocalData(STORAGE_KEYS.FAQ_ITEMS, FAQ_LIST),
      deskGuides: getLocalData(STORAGE_KEYS.DESK_GUIDES, DESK_GUIDES),
      hdrGuides: getLocalData(STORAGE_KEYS.HDR_GUIDES, HDR_GUIDES),
      graynotes: getLocalData(STORAGE_KEYS.GRAYNOTES, GRAYNOTES_LIST),
      brandsToAvoid: getLocalData(STORAGE_KEYS.BRANDS_TO_AVOID, BRANDS_TO_AVOID_DATA),
      bandwidthGuides: getLocalData(STORAGE_KEYS.BANDWIDTH_GUIDES, BANDWIDTH_GUIDANCES),
      aboutContent: getLocalData(STORAGE_KEYS.ABOUT_CONTENT, ABOUT_NOTION_CONTENT),
      adminUsers: getLocalData(STORAGE_KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS),
      activityLogs: getLocalData(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS),
    };
    DatabaseService.logActivity("sync", "settings", "Full Backup JSON Export", "Mengekspor seluruh basis data website.");
    return JSON.stringify(fullBackup, null, 2);
  }

  static importFullDatabaseJSON(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data.monitors || !Array.isArray(data.monitors)) {
        return { success: false, message: "Format file JSON tidak valid (monitors missing)." };
      }

      if (data.monitors) setLocalData(STORAGE_KEYS.MONITORS, data.monitors);
      if (data.desks) setLocalData(STORAGE_KEYS.DESKS, data.desks);
      if (data.peripherals) setLocalData(STORAGE_KEYS.PERIPHERALS, data.peripherals);
      if (data.aftersales) setLocalData(STORAGE_KEYS.AFTERSALES, data.aftersales);
      if (data.aftersalesCards) setLocalData(STORAGE_KEYS.AFTERSALES_CARDS, data.aftersalesCards);
      if (data.hierarchy) setLocalData(STORAGE_KEYS.HIERARCHY, data.hierarchy);
      if (data.pageBanners) setLocalData(STORAGE_KEYS.PAGE_BANNERS, data.pageBanners);
      if (data.homepageSettings) setLocalData(STORAGE_KEYS.HOMEPAGE_SETTINGS, data.homepageSettings);
      if (data.siteSettings) setLocalData(STORAGE_KEYS.SITE_SETTINGS, data.siteSettings);
      if (data.faqItems) setLocalData(STORAGE_KEYS.FAQ_ITEMS, data.faqItems);
      if (data.deskGuides) setLocalData(STORAGE_KEYS.DESK_GUIDES, data.deskGuides);
      if (data.hdrGuides) setLocalData(STORAGE_KEYS.HDR_GUIDES, data.hdrGuides);
      if (data.graynotes) setLocalData(STORAGE_KEYS.GRAYNOTES, data.graynotes);
      if (data.brandsToAvoid) setLocalData(STORAGE_KEYS.BRANDS_TO_AVOID, data.brandsToAvoid);
      if (data.bandwidthGuides) setLocalData(STORAGE_KEYS.BANDWIDTH_GUIDES, data.bandwidthGuides);
      if (data.aboutContent) setLocalData(STORAGE_KEYS.ABOUT_CONTENT, data.aboutContent);
      if (data.adminUsers) setLocalData(STORAGE_KEYS.ADMIN_USERS, data.adminUsers);

      DatabaseService.logActivity("restore", "settings", "Full Backup JSON Restore", `Berhasil memulihkan ${data.monitors.length} monitor dan seluruh pengaturan.`);

      return {
        success: true,
        message: `Berhasil memulihkan database: ${data.monitors.length} monitor, ${data.desks?.length || 0} meja, ${data.faqItems?.length || 0} FAQ, dan seluruh hierarki!`,
      };
    } catch (e: any) {
      return { success: false, message: `Gagal membaca file JSON: ${e.message || e}` };
    }
  }

  // ==========================================
  // 11. SUPABASE MIGRATION & SEEDING UTILITY
  // ==========================================
  static async pushSeedToSupabase(): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        message: "Supabase credentials not configured in environment variables.",
      };
    }

    try {
      const monitors = getLocalData<Monitor[]>(STORAGE_KEYS.MONITORS, MONITORS_DATA);
      const desks = getLocalData<DeskItem[]>(STORAGE_KEYS.DESKS, DESK_DATABASE);
      const peripherals = getLocalData<PeripheralItem[]>(STORAGE_KEYS.PERIPHERALS, PERIPHERALS_DATABASE);
      const aftersales = getLocalData<AftersalesBrand[]>(STORAGE_KEYS.AFTERSALES, AFTERSALES_DATA);

      if (monitors.length > 0) {
        for (const m of monitors) {
          await DatabaseService.upsertMonitorRow(m as unknown as Record<string, unknown>);
        }
      }
      if (desks.length > 0) {
        await supabase.from("desks").upsert(desks);
      }
      if (peripherals.length > 0) {
        await supabase.from("peripherals").upsert(peripherals);
      }
      if (aftersales.length > 0) {
        await supabase.from("aftersales").upsert(aftersales);
      }

      setLocalData(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      DatabaseService.logActivity("sync", "settings", "Supabase Cloud Sync", "Pushed all local database tables to Supabase.");

      return {
        success: true,
        message: `Berhasil sinkronisasi ${monitors.length} monitor, ${desks.length} meja, ${peripherals.length} peripherals, dan ${aftersales.length} aftersales ke Supabase!`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Gagal sinkronisasi ke Supabase: ${err.message || err}`,
      };
    }
  }

  static generateSQLMigration(): string {
    return `-- SQL Migration & Schema Setup for Supabase
-- Run this script in your Supabase Project -> SQL Editor -> New Query -> Run

CREATE TABLE IF NOT EXISTS public.monitors (
  id TEXT PRIMARY KEY,
  slug TEXT,
  brand TEXT,
  model TEXT,
  "fullName" TEXT,
  tier TEXT,
  "tierDescription" TEXT,
  price NUMERIC,
  "originalPrice" NUMERIC,
  "recommendedPrice" NUMERIC,
  "aspectRatio" TEXT,
  curvature TEXT,
  "displayInputs" JSONB,
  "panelBitDepth" TEXT,
  "standCapability" TEXT,
  "usbHub" TEXT,
  "marketClass" TEXT,
  "createdDateText" TEXT,
  "lastUpdatedDate" TEXT,
  "linkShopee" TEXT,
  "linkTokopedia" TEXT,
  "linkTiktokShop" TEXT,
  thumbnail TEXT,
  "frontImage" TEXT,
  "rearImage" TEXT,
  gallery JSONB,
  "quickSpecs" JSONB,
  "expertVerdict" TEXT,
  "statusReason" TEXT,
  "gtidReviewUrl" TEXT,
  introduction TEXT,
  "bannerImage" TEXT,
  "deepDiveTitle" TEXT,
  "deepDiveDescription" TEXT,
  "deepDiveNote" TEXT,
  "accessoriesIncluded" JSONB,
  "additionalStores" JSONB,
  "responseTimeData" JSONB,
  pros JSONB,
  cons JSONB,
  specs JSONB,
  marketplaces JSONB,
  "priceHistory" JSONB,
  tags JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hierarchy (
  id TEXT PRIMARY KEY,
  title TEXT,
  slug TEXT,
  "fullPath" TEXT,
  category TEXT,
  description TEXT,
  "contentMarkdown" TEXT,
  "onClickAction" TEXT,
  "externalUrl" TEXT,
  "coverImage" TEXT,
  tags JSONB,
  "order" NUMERIC,
  "isPublished" BOOLEAN DEFAULT true,
  "discordCallbackSummary" TEXT,
  "updatedAt" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.desks (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  keterangan JSONB,
  price NUMERIC,
  type TEXT,
  "catatanBadge" TEXT,
  description TEXT,
  notes TEXT,
  "markdownContent" TEXT,
  "shopeeUrl" TEXT,
  specs JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.peripherals (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  price NUMERIC,
  brand TEXT,
  verdict TEXT,
  notes TEXT,
  "shopeeUrl" TEXT,
  "recommendedFor" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.aftersales (
  brand TEXT PRIMARY KEY,
  rating TEXT,
  distributor TEXT,
  "warrantyPeriod" TEXT,
  summary TEXT,
  status TEXT,
  points JSONB,
  "contactUrl" TEXT,
  "claimSystem" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peripherals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aftersales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Monitors" ON public.monitors FOR SELECT USING (true);
CREATE POLICY "Public Read Hierarchy" ON public.hierarchy FOR SELECT USING (true);
CREATE POLICY "Public Read Desks" ON public.desks FOR SELECT USING (true);
CREATE POLICY "Public Read Peripherals" ON public.peripherals FOR SELECT USING (true);
CREATE POLICY "Public Read Aftersales" ON public.aftersales FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);

-- Admin Full Access Policies
CREATE POLICY "Admin Full Access Monitors" ON public.monitors FOR ALL USING (true);
CREATE POLICY "Admin Full Access Hierarchy" ON public.hierarchy FOR ALL USING (true);
CREATE POLICY "Admin Full Access Desks" ON public.desks FOR ALL USING (true);
CREATE POLICY "Admin Full Access Peripherals" ON public.peripherals FOR ALL USING (true);
CREATE POLICY "Admin Full Access Aftersales" ON public.aftersales FOR ALL USING (true);
CREATE POLICY "Admin Full Access Settings" ON public.site_settings FOR ALL USING (true);
`;
  }
}
