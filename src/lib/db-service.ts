import { Monitor } from "@/types/monitor";
import { MONITORS_DATA } from "@/data/monitors";
import { DESK_DATABASE, PERIPHERALS_DATABASE, DeskItem, PeripheralItem } from "@/data/grayplasma-desk-peripherals";
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
};
import { SiteHierarchyNode } from "@/types/site-hierarchy";
import { DEFAULT_SITE_HIERARCHY } from "@/data/site-hierarchy";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const STORAGE_KEYS = {
  MONITORS: "gp_db_monitors_v1",
  DESKS: "gp_db_desks_v1",
  PERIPHERALS: "gp_db_peripherals_v1",
  AFTERSALES: "gp_db_aftersales_v1",
  HIERARCHY: "gp_db_hierarchy_v1",
  PAGE_BANNERS: "gp_db_page_banners_v1",
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
  homeBannerSubtitle: "Kurasi monitor independen kolaborasi Joel Gray (@gray1plasma) x GlaciK dengan pengujian laboratorium GTID Tech.",
  guideBannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop",
  monitorBannerUrl: "",
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
  copyrightText: "© 2024-2026 GrayPlasma ID x GTID Tech. Seluruh hak cipta dilindungi.",
  consultation: {
    ...CONSULTATION_DATA,
    pricingNote: "Free Community Discord Consultation & VIP Dedicated Setup Review",
    qrisImageUrl: "",
  },
  announcement: {
    isEnabled: true,
    text: "🔥 Update Database Laboratorium GTID 2026 telah aktif! Cek rekomendasi monitor dan panduan aftersales terbaru.",
    badgeText: "UPDATE 2026",
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
    id: "admin-joel",
    name: "Joel Gray",
    username: "gray1plasma",
    role: "super_admin",
    roleTitle: "Founder & Master Admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    pinCode: "grayplasma2026",
    email: "joel@grayplasma.id",
    bio: "Penggagas dan kurator database ulasan independen GrayPlasma.",
    permissions: ["*"],
    createdAt: "2024-01-01",
    lastLogin: "2026-08-31",
  },
  {
    id: "admin-glacik",
    name: "GlaciK",
    username: "glacik",
    role: "lead_reviewer",
    roleTitle: "Lead Reviewer & Data Analyst",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    pinCode: "glacik2026",
    email: "glacik@grayplasma.id",
    bio: "Ko-kurator dan analis hasil pengujian lab GTID Tech.",
    permissions: ["monitors", "desks", "peripherals", "aftersales", "guides", "faq"],
    createdAt: "2024-06-01",
    lastLogin: "2026-08-30",
  },
  {
    id: "admin-editor",
    name: "Content Moderator",
    username: "editor",
    role: "editor",
    roleTitle: "Content & Community Editor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    pinCode: "editor2026",
    email: "editor@grayplasma.id",
    bio: "Editor artikel edukasi, FAQ, dan banner.",
    permissions: ["guides", "faq", "banners", "settings"],
    createdAt: "2025-01-15",
    lastLogin: "2026-08-28",
  },
];

export interface AdminActivityLog {
  id: string;
  adminName: string;
  adminRole: string;
  action: "create" | "update" | "delete" | "sync" | "reset" | "restore";
  targetType: "monitor" | "desk" | "peripheral" | "aftersales" | "hierarchy" | "faq" | "guide" | "settings" | "admin" | "banner";
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
    details: "Inisialisasi sistem manajemen komprehensif Notion-style dan Hierarki Admin RBAC.",
  },
  {
    id: "log-init-2",
    adminName: "GlaciK",
    adminRole: "Lead Reviewer",
    action: "update",
    targetType: "monitor",
    targetName: "55 Model Database Monitor",
    timestamp: "2026-08-30 19:45",
    details: "Verifikasi kelengkapan nilai akurasi warna deITP dan response time GTID.",
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
    return getLocalData<AdminUser | null>(STORAGE_KEYS.CURRENT_ADMIN_SESSION, DEFAULT_ADMIN_USERS[0]);
  }

  // ==========================================
  // 1. MONITORS CRUD
  // ==========================================
  static async getMonitors(): Promise<Monitor[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("monitors")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data as Monitor[];
        }
      } catch (err) {
        console.warn("Supabase fetch failed, using local storage", err);
      }
    }
    return getLocalData<Monitor[]>(STORAGE_KEYS.MONITORS, MONITORS_DATA);
  }

  static async saveMonitor(monitor: Monitor): Promise<Monitor[]> {
    let current = getLocalData<Monitor[]>(STORAGE_KEYS.MONITORS, MONITORS_DATA);
    const existingIndex = current.findIndex((m) => m.id === monitor.id);

    const updatedMonitor: Monitor = {
      ...monitor,
      updatedAt: new Date().toISOString(),
      versionId: (monitor.versionId || 1) + 1,
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
        await supabase.from("monitors").upsert(updatedMonitor);
      } catch (err) {
        console.error("Supabase monitor upsert error", err);
      }
    }

    return current;
  }

  static async deleteMonitor(id: string): Promise<Monitor[]> {
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

  static resetMonitorsToDefault(): Monitor[] {
    setLocalData(STORAGE_KEYS.MONITORS, MONITORS_DATA);
    DatabaseService.logActivity("reset", "monitor", "55 Monitor Bawaan", "Reset monitor ke default Notion.");
    return MONITORS_DATA;
  }

  // ==========================================
  // 2. DESKS CRUD
  // ==========================================
  static async getDesks(): Promise<DeskItem[]> {
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
  }

  static async saveDesk(desk: DeskItem): Promise<DeskItem[]> {
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

  static resetDesksToDefault(): DeskItem[] {
    setLocalData(STORAGE_KEYS.DESKS, DESK_DATABASE);
    DatabaseService.logActivity("reset", "desk", "Katalog Meja", "Reset meja ke default.");
    return DESK_DATABASE;
  }

  // ==========================================
  // 3. PERIPHERALS CRUD
  // ==========================================
  static async getPeripherals(): Promise<PeripheralItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("peripherals").select("*");
        if (!error && data && data.length > 0) return data as PeripheralItem[];
      } catch (err) {
        console.warn("Supabase peripheral fetch failed", err);
      }
    }
    return getLocalData<PeripheralItem[]>(STORAGE_KEYS.PERIPHERALS, PERIPHERALS_DATABASE);
  }

  static async savePeripheral(item: PeripheralItem): Promise<PeripheralItem[]> {
    let current = getLocalData<PeripheralItem[]>(STORAGE_KEYS.PERIPHERALS, PERIPHERALS_DATABASE);
    const idx = current.findIndex((p) => p.id === item.id);
    if (idx >= 0) {
      current[idx] = item;
      DatabaseService.logActivity("update", "peripheral", item.name);
    } else {
      current = [item, ...current];
      DatabaseService.logActivity("create", "peripheral", item.name);
    }

    setLocalData(STORAGE_KEYS.PERIPHERALS, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("peripherals").upsert(item);
      } catch (err) {
        console.error("Supabase peripheral upsert error", err);
      }
    }
    return current;
  }

  static async deletePeripheral(id: string): Promise<PeripheralItem[]> {
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
  }

  static async saveHierarchyNode(node: SiteHierarchyNode): Promise<SiteHierarchyNode[]> {
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
  static async getSiteSettings(): Promise<GlobalSiteSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .eq("key", "global_site_config")
          .single();

        if (!error && data && data.value) {
          return data.value as GlobalSiteSettings;
        }
      } catch (err) {
        console.warn("Supabase site settings fetch failed", err);
      }
    }
    return getLocalData<GlobalSiteSettings>(STORAGE_KEYS.SITE_SETTINGS, DEFAULT_SITE_SETTINGS);
  }

  static async saveSiteSettings(settings: GlobalSiteSettings): Promise<GlobalSiteSettings> {
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
    setLocalData(STORAGE_KEYS.SITE_SETTINGS, DEFAULT_SITE_SETTINGS);
    DatabaseService.logActivity("reset", "settings", "Konfigurasi Global", "Reset ke default setting.");
    return DEFAULT_SITE_SETTINGS;
  }

  // ==========================================
  // 7. PAGE BANNER SETTINGS
  // ==========================================
  static async getBannerSettings(): Promise<PageBannerSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .eq("key", "page_banners")
          .single();

        if (!error && data && data.value) {
          return data.value as PageBannerSettings;
        }
      } catch (err) {
        console.warn("Supabase banner settings fetch failed", err);
      }
    }
    return getLocalData<PageBannerSettings>(STORAGE_KEYS.PAGE_BANNERS, DEFAULT_BANNER_SETTINGS);
  }

  static async saveBannerSettings(settings: PageBannerSettings): Promise<PageBannerSettings> {
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
    setLocalData(STORAGE_KEYS.PAGE_BANNERS, DEFAULT_BANNER_SETTINGS);
    DatabaseService.logActivity("reset", "banner", "Banners", "Reset banner ke default.");
    return DEFAULT_BANNER_SETTINGS;
  }

  // ==========================================
  // 8. FAQ KNOWLEDGEBASE CRUD
  // ==========================================
  static getFAQ(): FAQItem[] {
    return getLocalData<FAQItem[]>(STORAGE_KEYS.FAQ_ITEMS, FAQ_LIST);
  }

  static saveFAQ(item: FAQItem): FAQItem[] {
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
    return current;
  }

  static deleteFAQ(id: string): FAQItem[] {
    let current = getLocalData<FAQItem[]>(STORAGE_KEYS.FAQ_ITEMS, FAQ_LIST);
    const target = current.find((f) => f.id === id);
    if (target) DatabaseService.logActivity("delete", "faq", target.question);
    current = current.filter((f) => f.id !== id);
    setLocalData(STORAGE_KEYS.FAQ_ITEMS, current);
    return current;
  }

  static resetFAQ(): FAQItem[] {
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
      hierarchy: getLocalData(STORAGE_KEYS.HIERARCHY, DEFAULT_SITE_HIERARCHY),
      pageBanners: getLocalData(STORAGE_KEYS.PAGE_BANNERS, DEFAULT_BANNER_SETTINGS),
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
      if (data.hierarchy) setLocalData(STORAGE_KEYS.HIERARCHY, data.hierarchy);
      if (data.pageBanners) setLocalData(STORAGE_KEYS.PAGE_BANNERS, data.pageBanners);
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
        await supabase.from("monitors").upsert(monitors);
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
