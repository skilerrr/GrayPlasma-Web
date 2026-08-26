import { Monitor } from "@/types/monitor";
import { MONITORS_DATA } from "@/data/monitors";
import { DESK_DATABASE, PERIPHERALS_DATABASE, DeskItem, PeripheralItem } from "@/data/grayplasma-desk-peripherals";
import { AFTERSALES_DATA, AftersalesBrand } from "@/data/grayplasma-content";
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
  LAST_SYNC: "gp_db_last_sync",
};

export interface PageBannerSettings {
  homeBannerUrl?: string;
  homeBannerTitle?: string;
  homeBannerSubtitle?: string;
  guideBannerUrl?: string;
  monitorBannerUrl?: string;
}

const DEFAULT_BANNER_SETTINGS: PageBannerSettings = {
  homeBannerUrl: "",
  homeBannerTitle: "Katalog & Database Rekomendasi Monitor",
  homeBannerSubtitle: "Kurasi monitor independen kolaborasi Joel Gray (@gray1plasma) x GlaciK dengan pengujian laboratorium GTID Tech.",
  guideBannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop",
  monitorBannerUrl: "",
};

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

    if (existingIndex >= 0) {
      current[existingIndex] = monitor;
    } else {
      current = [monitor, ...current];
    }

    setLocalData(STORAGE_KEYS.MONITORS, current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("monitors").upsert(monitor);
      } catch (err) {
        console.error("Supabase monitor upsert error", err);
      }
    }

    return current;
  }

  static async deleteMonitor(id: string): Promise<Monitor[]> {
    let current = getLocalData<Monitor[]>(STORAGE_KEYS.MONITORS, MONITORS_DATA);
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
    if (idx >= 0) current[idx] = desk;
    else current = [desk, ...current];

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
    if (idx >= 0) current[idx] = item;
    else current = [item, ...current];

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
    if (idx >= 0) current[idx] = brand;
    else current = [brand, ...current];

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
    } else {
      current = [...current, node];
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
    return DEFAULT_SITE_HIERARCHY;
  }

  // ==========================================
  // 6. PAGE BANNER SETTINGS CRUD
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
        console.warn("Supabase banner settings fetch failed, using local storage", err);
      }
    }
    return getLocalData<PageBannerSettings>(STORAGE_KEYS.PAGE_BANNERS, DEFAULT_BANNER_SETTINGS);
  }

  static async saveBannerSettings(settings: PageBannerSettings): Promise<PageBannerSettings> {
    setLocalData(STORAGE_KEYS.PAGE_BANNERS, settings);

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
    return DEFAULT_BANNER_SETTINGS;
  }

  // ==========================================
  // 6. SUPABASE MIGRATION & SEEDING UTILITY
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

CREATE TABLE IF NOT EXISTS public.page_banners (
  id TEXT PRIMARY KEY DEFAULT 'default',
  "homeBannerUrl" TEXT,
  "homeBannerTitle" TEXT,
  "homeBannerSubtitle" TEXT,
  "guideBannerUrl" TEXT,
  "monitorBannerUrl" TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peripherals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aftersales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_banners ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Semua pengunjung bisa baca data)
CREATE POLICY "Public Read Monitors" ON public.monitors FOR SELECT USING (true);
CREATE POLICY "Public Read Hierarchy" ON public.hierarchy FOR SELECT USING (true);
CREATE POLICY "Public Read Desks" ON public.desks FOR SELECT USING (true);
CREATE POLICY "Public Read Peripherals" ON public.peripherals FOR SELECT USING (true);
CREATE POLICY "Public Read Aftersales" ON public.aftersales FOR SELECT USING (true);
CREATE POLICY "Public Read Banners" ON public.page_banners FOR SELECT USING (true);

-- Admin Full Access Policies (Insert, Update, Delete)
CREATE POLICY "Admin Full Access Monitors" ON public.monitors FOR ALL USING (true);
CREATE POLICY "Admin Full Access Hierarchy" ON public.hierarchy FOR ALL USING (true);
CREATE POLICY "Admin Full Access Desks" ON public.desks FOR ALL USING (true);
CREATE POLICY "Admin Full Access Peripherals" ON public.peripherals FOR ALL USING (true);
CREATE POLICY "Admin Full Access Aftersales" ON public.aftersales FOR ALL USING (true);
CREATE POLICY "Admin Full Access Banners" ON public.page_banners FOR ALL USING (true);
`;
  }
}
