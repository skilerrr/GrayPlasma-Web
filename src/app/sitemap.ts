import type { MetadataRoute } from "next";
import { getPublishedHierarchyPaths } from "@/lib/route-guard";
import { getMonitorsForDetail } from "@/lib/monitors-source";

// Sitemap di-generate ulang tiap jam supaya monitor baru dari admin ikut ke-index
// tanpa harus nunggu deploy.
export const revalidate = 3600;

const PRIORITY_BY_PREFIX: Array<[string, number]> = [
  ["/guide", 0.7],
  ["/aftersales", 0.8],
  ["/faq", 0.7],
  ["/desk-setup", 0.7],
  ["/catalog", 0.8],
  ["/recommendations", 0.8],
];

function priorityFor(path: string): number {
  const match = PRIORITY_BY_PREFIX.find(([prefix]) => path.startsWith(prefix));
  return match ? match[1] : 0.6;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://grayplasma-web.vercel.app";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: "daily", priority: 1.0 },
    {
      url: `${baseUrl}/guide/setup/ukuran-meja-monitor-ideal`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${baseUrl}/aftersales`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/desk-setup`, lastModified, changeFrequency: "weekly", priority: 0.7 },
  ];

  // Semua node hierarki yang publish. Dulu cuma 6 rute statis + monitor yang masuk,
  // padahal puluhan halaman guide/desk/aftersales ada dan nggak pernah ke-index.
  const hierarchyRoutes: MetadataRoute.Sitemap = getPublishedHierarchyPaths()
    .filter((path) => path !== "/")
    .map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: priorityFor(path),
    }));

  const monitorRoutes: MetadataRoute.Sitemap = (await getMonitorsForDetail()).map((monitor) => ({
    url: `${baseUrl}/monitor/${encodeURIComponent(monitor.slug)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Buang duplikat: hierarki bisa punya fullPath yang sama dengan rute statis.
  const seen = new Set<string>();
  return [...staticRoutes, ...hierarchyRoutes, ...monitorRoutes].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
