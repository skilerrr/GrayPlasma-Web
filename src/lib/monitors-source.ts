import { MONITORS_DATA } from "@/data/monitors";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Monitor } from "@/types/monitor";
import { unstable_cache } from "next/cache";

/**
 * Sumber data halaman detail monitor.
 *
 * Dulu halaman detail cuma baca `MONITORS_DATA` (statis), sementara katalog baca
 * Supabase. Efeknya: monitor yang ditambah lewat admin muncul di katalog tapi
 * halaman detailnya kosong / 404.
 *
 * Sekarang: Supabase dulu (data terbaru dari admin), lalu digabung dengan data
 * statis yang belum ada di DB. Kalau Supabase mati, tetap jalan dari statis.
 */
export async function getMonitorsForDetail(): Promise<Monitor[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("monitors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("[monitors-source] Supabase error, pakai data statis:", error.message);
      } else if (Array.isArray(data) && data.length > 0) {
        const fromDb = data as Monitor[];
        const dbIds = new Set(fromDb.map((monitor) => monitor.id));
        return [...fromDb, ...MONITORS_DATA.filter((monitor) => !dbIds.has(monitor.id))];
      }
    } catch (err) {
      console.warn("[monitors-source] Supabase tidak terjangkau, pakai data statis:", err);
    }
  }

  return MONITORS_DATA;
}

/**
 * Versi server-side (ISR) dari sumber data monitor.
 *
 * `generateMetadata` + render halaman detail sama-sama memanggil
 * `getMonitorsForDetail()`. Tanpa cache, itu 2 query Supabase per request.
 * `unstable_cache` membuat keduanya berbagi 1 hasil, di-cache di server dan
 * di-refresh otomatis mengikuti `revalidate` (60 detik) di page monitor.
 */
export const getMonitorsForDetailCached = unstable_cache(
  async () => getMonitorsForDetail(),
  ["monitors-for-detail"],
  { revalidate: 60, tags: ["monitors"] }
);

/** Pencocokan slug yang toleran: slug, id, `mon-<slug>`, atau model tanpa tanda baca. */
export function findMonitorBySlug(monitors: Monitor[], rawSlug: string): Monitor | null {
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug);
  } catch {
    /* biarkan apa adanya */
  }
  decodedSlug = decodedSlug.toLowerCase().trim();
  const cleanSlug = decodedSlug.replace(/[^a-z0-9]/g, "");

  return (
    monitors.find((monitor) => {
      const slug = (monitor.slug || "").toLowerCase();
      const id = (monitor.id || "").toLowerCase();
      const model = (monitor.model || "").toLowerCase();

      if (slug === decodedSlug || id === decodedSlug || id === `mon-${decodedSlug}`) return true;
      if (slug.replace(/[^a-z0-9]/g, "") === cleanSlug) return true;
      if (id.replace(/[^a-z0-9]/g, "") === cleanSlug) return true;
      if (model.replace(/[^a-z0-9]/g, "") === cleanSlug) return true;
      return false;
    }) || null
  );
}
