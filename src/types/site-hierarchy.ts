export type RouteTriggerAction = "route" | "side-panel" | "modal" | "external";

export interface SiteHierarchyNode {
  id: string;
  title: string;
  slug: string;
  fullPath: string; // e.g. "/guide/sdr/glossary" or "/guide/warna/akurasi-d65-p3"
  category: string;
  icon?: string;
  coverImage?: string;
  description: string;
  contentMarkdown?: string;
  onClickAction: RouteTriggerAction;
  externalUrl?: string;
  targetId?: string; // e.g. linked monitor ID or modal key
  tags: string[];
  order: number;
  isPublished: boolean;
  discordCallbackSummary?: string; // Quick preview text to copy-paste into Discord consultations
  updatedAt: string;
}

export interface SiteCategoryGroup {
  id: string;
  name: string;
  icon: string;
  description: string;
  badge?: string;
  routes: SiteHierarchyNode[];
}
