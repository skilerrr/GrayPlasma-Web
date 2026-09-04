export type TierRating = "S-TIER" | "BEST VALUE" | "RECOMMENDED" | "PASS";

export type PanelType =
  | "IPS"
  | "Fast IPS"
  | "VA"
  | "Fast VA"
  | "OLED"
  | "QD-OLED"
  | "WOLED"
  | "Nano IPS"
  | "Mini-LED"
  | "Mini LED IPS"
  | (string & {});

export type SubpixelLayout =
  | "RGB Stripe"
  | "BGR Stripe"
  | "QD-OLED Gen 1 (Triangular)"
  | "QD-OLED Gen 2/3 (Improved)"
  | "WOLED (RWBG)"
  | "Unknown";

export type CoatingType =
  | "Matte 3H (Anti-Glare)"
  | "Semi-Glossy (Low Haze)"
  | "True Glossy"
  | "Ultra Low Reflection"
  | "Unknown";

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

export interface VRRSpecs {
  range: string; // e.g. "48Hz – 240Hz"
  lfc: boolean; // Low Framerate Compensation
  certifications: string[]; // e.g. ["G-Sync Compatible", "FreeSync Premium"]
}

export interface OvershootData {
  maxOvershootPercent: number; // e.g. 4.2%
  bestOverdriveMode: string; // e.g. "Level 2 / Fast"
  visualGhostingVerdict: string; // e.g. "Sangat Bersih, Tanpa Inverse Ghosting"
}

export interface LabTestingMatrixRow {
  parameter: string; // e.g. "Response Time (GtG)", "Contrast Ratio", "Color Gamut P3", "Max Nits"
  marketingClaim: string; // e.g. "0.5ms MPRT", "1000:1", "95% P3", "HDR 400"
  gtidResult: string; // e.g. "5.2ms (Toleransi 5 RGB)", "1330:1 Black", "100% P3", "270 nits"
  ratingStatus: "optimal" | "acceptable" | "warning" | "gimmick";
  notes?: string;
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
    subpixelLayout?: SubpixelLayout;
    coatingType?: CoatingType;
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
    vrrSpecs?: VRRSpecs;
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
  overshootPercent?: number;
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
  quickSpecs: string[]; // e.g. ["27\"", "2K 240Hz", "Fast IPS", "100% P3", "1330:1"]
  expertVerdict: string;
  pros: string[];
  cons: string[];
  specs: TechnicalSpecs;
  marketplaces: MarketplaceLink[];
  priceHistory: PriceHistoryPoint[];
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  versionId?: number;

  // Rich Notion Deep-Dive & Side-Panel Fields
  aspectRatio?: string; // e.g. "16:9 (Wide)", "21:9 (Ultrawide)"
  curvature?: string; // e.g. "None", "1500R", "1800R", "800R"
  displayInputs?: string[]; // e.g. ["HDMI 2.1 TMDS", "DP 1.4"]
  panelBitDepth?: string; // e.g. "8 Bit", "8 Bit + FRC", "10 Bit"
  standCapability?: string; // e.g. "Tilt", "HAS (Height, Tilt, Swivel, Pivot)"
  usbHub?: string; // e.g. "None", "USB 3.0 Hub", "USB-C 65W PD"
  marketClass?: string; // e.g. "144Hz+", "100Hz", "240Hz+"
  createdDateText?: string; // e.g. "February 24, 2025 12:24"
  lastUpdatedDate?: string; // e.g. "June 24, 2025"
  linkShopee?: string;
  linkTokopedia?: string;
  linkTiktokShop?: string;
  frontImage?: string;
  rearImage?: string;
  statusReason?: string;
  gtidReviewUrl?: string;
  introduction?: string;
  bannerImage?: string;
  deepDiveTitle?: string;
  deepDiveDescription?: string;
  deepDiveNote?: string;
  calmanCharts?: string[];
  accessoriesIncluded?: string[];
  additionalStores?: AdditionalStoreLink[];
  responseTimeData?: ResponseTimeData;

  // Modern GTID Lab Testing Matrix & Engineering Specs
  subpixelLayout?: SubpixelLayout;
  coatingType?: CoatingType;
  vrrSpecs?: VRRSpecs;
  overshootData?: OvershootData;
  labTestingMatrix?: LabTestingMatrixRow[];
  customVariables?: CustomDataVariable[];
}

export interface CustomDataVariable {
  id: string;
  label: string;
  value: string;
  category?: string;
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
