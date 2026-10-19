import { DEFAULT_SITE_HIERARCHY } from "@/data/site-hierarchy";

/**
 * Daftar cabang rute yang memang punya renderer sendiri di
 * `src/app/guide/[...slug]/page.tsx` (katalog, meja, arm, aksesoris, kursi, FAQ,
 * aftersales, dsb). Diambil dari kondisi `firstSlug`/`lastSlug` di file itu.
 */
const STATIC_BRANCHES = new Set([
  "guide",
  "guides",
  "faq",
  "aftersales",
  "aftersales-rma",
  "desk-setup",
  "catalog",
  "recommendations",
  "rekomendasi",
  "monitor",
  "desks",
  "rekomendasi-meja",
  "arms-brackets",
  "arms",
  "brackets",
  "arm-bracket",
  "monitor-arm",
  "accessories",
  "aksesoris",
  "peripherals",
  "chairs",
  "kursi",
  "kursi-ergonomis",
]);

/**
 * True kalau segmen URL pertama memang rute yang dikenal.
 * Dipakai buat mengembalikan 404 asli, bukan halaman placeholder 200.
 */
export function isKnownCategoryRoute(segment: string): boolean {
  let seg = segment;
  try {
    seg = decodeURIComponent(segment);
  } catch {
    /* biarkan apa adanya */
  }
  seg = seg.toLowerCase().trim();
  if (!seg) return false;
  if (STATIC_BRANCHES.has(seg)) return true;

  return DEFAULT_SITE_HIERARCHY.some((node) => {
    const slug = (node.slug || "").toLowerCase();
    const fullPath = (node.fullPath || "").toLowerCase();
    if (slug && slug === seg) return true;
    if (fullPath && fullPath === `/${seg}`) return true;
    if (fullPath && fullPath.endsWith(`/${seg}`)) return true;
    return false;
  });
}

/** Node hierarki yang layak masuk sitemap. */
export function getPublishedHierarchyPaths(): string[] {
  return DEFAULT_SITE_HIERARCHY.filter((node) => node.isPublished !== false)
    .map((node) => node.fullPath)
    .filter((path): path is string => Boolean(path && path.startsWith("/")));
}
