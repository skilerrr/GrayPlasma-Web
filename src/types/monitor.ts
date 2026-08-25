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

export interface AdditionalStoreLink {
  city: string; // e.g. "SURABAYA", "JAKARTA", "BANDUNG", "ONLINE"
  storeName: string;
  url: string;
  price?: number;
  note?: string;
}

export interface ResponseTimeData {
  toleranceNew?: string; // e.g. "Toleransi Baru (5 RGB)"
  toleranceOld?: string; // e.g. "Toleransi Lama (10 RGB)"
  gtidScore?: string;
  overdriveRecommendation?: string;
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
  recommendedPrice?: number;
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

  // Rich Notion Deep-Dive & Side-Panel Fields (matching user screenshot)
  aspectRatio?: string; // e.g. "16:9 (Wide)", "21:9 (Ultrawide)"
  curvature?: string; // e.g. "None", "1500R", "1800R", "800R"
  displayInputs?: string[]; // e.g. ["HDMI 1.4", "HDMI 2.0"], ["HDMI 2.0", "DP 1.4"]
  panelBitDepth?: string; // e.g. "8 Bit", "8 Bit + FRC", "10 Bit"
  standCapability?: string; // e.g. "Tilt", "HAS (Height, Tilt, Swivel, Pivot)"
  usbHub?: string; // e.g. "None", "USB 3.0 Hub", "USB-C 65W PD"
  marketClass?: string; // e.g. "144Hz+", "100Hz", "240Hz+"
  createdDateText?: string; // e.g. "February 24, 2025 12:24"
  lastUpdatedDate?: string; // e.g. "June 24, 2025"
  linkShopee?: string; // e.g. Shopee URL
  linkTokopedia?: string; // e.g. Tokopedia URL
  linkTiktokShop?: string; // e.g. TikTok Shop URL
  frontImage?: string; // Foto tampak depan monitor (dengan layar/wallpaper)
  rearImage?: string; // Foto tampak belakang monitor (stand & chassis)
  statusReason?: string; // e.g. "TIDAK DISARANKAN LAGI KARENA BANYAK KASUS BERGARIS + DISCONTINUE"
  gtidReviewUrl?: string; // Link video review GTID
  introduction?: string; // Teks pendahuluan ulasan
  bannerImage?: string; // Custom header banner image for the page
  deepDiveTitle?: string; // e.g. "Akurat di D65-P3 tapi kok Undersaturated di D65-P3?"
  deepDiveDescription?: string; // Detailed narrative text / review comparison
  deepDiveNote?: string; // Summary disclaimer note
  calmanCharts?: string[]; // Chart images (DeltaE, CIE Gamut Diagram, etc.)
  accessoriesIncluded?: string[]; // Kelengkapan yang diberi (e.g. ["Kabel Adaptor", "Manual Book", "Kabel HDMI to HDMI"])
  additionalStores?: AdditionalStoreLink[]; // Link Pembelian Tambahan (SURABAYA, JAKARTA, etc.)
  responseTimeData?: ResponseTimeData;
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

export const INITIAL_FILTER_STATE: FilterState = {
  searchQuery: "",
  quickTab: "all",
  budgetRange: [0, 25000000],
  budgetPreset: null,
  panelTypes: [],
  refreshRates: [],
  screenSizes: [],
  resolutions: [],
  tiers: [],
  sortBy: "tier",
};
