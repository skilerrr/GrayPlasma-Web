export type TierRating = "S-TIER" | "BEST VALUE" | "RECOMMENDED" | "PASS";

export type PanelType = "IPS" | "Fast IPS" | "VA" | "OLED" | "QD-OLED" | "Nano IPS" | "Fast VA" | "Mini-LED" | "Mini LED IPS" | (string & {});

export type RefreshRateOption = "100Hz" | "144Hz" | "165Hz–180Hz" | "240Hz+";

export type ScreenSizeCategory = "24\"" | "27\"" | "32\"" | "Ultrawide";

export type ResolutionCategory = "FHD (1080p)" | "2K (1440p)" | "4K (2160p)";

export type BudgetCategory = "under-1.5m" | "1.5m-3m" | "3m-5m" | "5m-plus";

export type QuickFilterTab = "all" | "budget" | "esport" | "productivity" | "s-tier" | "oled";

export interface MarketplaceLink {
  marketplace: "Tokopedia" | "Shopee" | "Blibli";
  url: string;
  price: number;
  isAffiliate: boolean;
  storeName: string;
  officialStore: boolean;
  inStock: boolean;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  label?: string;
}

export interface TechnicalSpecs {
  display: {
    size: string;
    resolution: string;
    panelType: PanelType;
    refreshRate: number;
    responseTime: string;
    brightness: string;
    contrastRatio: string;
    colorGamut: string;
    hdr: string;
    viewingAngle: string;
    curvature?: string;
  };
  connectivity: {
    displayPort: string;
    hdmi: string;
    typeC?: string;
    audioJack: boolean;
    usbHub?: string;
  };
  ergonomics: {
    heightAdjustable: boolean;
    heightRange?: string;
    tilt: string;
    swivel: string;
    pivot: boolean;
    vesaMount: string;
  };
  features: {
    syncTech: string; // e.g. FreeSync Premium / G-Sync Compatible
    builtInSpeakers: boolean;
    speakersDetail?: string;
    powerConsumption: string;
    warranty: string;
  };
}

export interface Monitor {
  id: string;
  slug: string;
  brand: string;
  model: string;
  fullName: string;
  tier: TierRating;
  tierDescription?: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  gallery: string[];
  quickSpecs: string[]; // e.g. ["24\"", "Fast IPS", "180Hz", "0.5ms MPRT", "99% sRGB"]
  expertVerdict: string;
  pros: string[];
  cons: string[];
  specs: TechnicalSpecs;
  marketplaces: MarketplaceLink[];
  priceHistory: PriceHistoryPoint[];
  tags: string[];
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  quickTab: QuickFilterTab;
  budgetRange: [number, number];
  budgetPreset: BudgetCategory | null;
  panelTypes: PanelType[];
  refreshRates: RefreshRateOption[];
  screenSizes: ScreenSizeCategory[];
  resolutions: ResolutionCategory[];
  tiers: TierRating[];
  sortBy: "price-asc" | "price-desc" | "tier" | "refresh-desc" | "rating";
}
