/**
 * Cache layer untuk data Supabase.
 *
 * Masalah yang diselesaikan:
 *  1. 7 request `site_settings` per page load (4 key x 3 komponen yang memanggil).
 *     -> Sekarang 1 request: semua key diambil dalam satu query `.in("key", [...])`.
 *  2. Navigasi ulang = fetch ulang semua tabel dari nol.
 *     -> Sekarang: cache TTL di memory + sessionStorage, stale-while-revalidate.
 *  3. Komponen berbeda memanggil getter yang sama bersamaan.
 *     -> Sekarang: in-flight dedup, jadi 1 request dipakai bersama.
 *  4. Tabel yang belum ada (mis. `chairs`) di-query tiap load dan selalu 404.
 *     -> Sekarang: 404 dicatat, request berikutnya dilewati.
 *
 * Stale-while-revalidate: data basi dikembalikan INSTAN, lalu di-refresh di
 * background. Jadi navigasi subsequent terasa instan tanpa pernah menampilkan
 * data yang lebih tua dari TTL.
 */

type CacheEntry<T> = {
  value: T;
  /** epoch ms kapan data ini di-cache */
  storedAt: number;
  /** true kalau ada refresh yang sedang jalan */
  revalidating?: boolean;
};

type Envelope = {
  storedAt: number;
  value: unknown;
};

const DEFAULT_TTL_MS = 60_000;
const SESSION_PREFIX = "gp_cache_v1:";

/** Memori cache. Hilang saat tab ditutup — itu wajar, sessionStorage yang tahan. */
const memory = new Map<string, CacheEntry<unknown>>();
/** In-flight promise per key, untuk dedup request bersamaan. */
const inflight = new Map<string, Promise<unknown>>();
/** Tabel yang hasil fetch-nya 404 (belum dibuat di Supabase). */
const missingTables = new Set<string>();

function sessionKey(key: string): string {
  return SESSION_PREFIX + key;
}

function readSession<T>(key: string): CacheEntry<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(sessionKey(key));
    if (!raw) return null;
    const env = JSON.parse(raw) as Envelope;
    if (typeof env?.storedAt !== "number") return null;
    return { value: env.value as T, storedAt: env.storedAt };
  } catch {
    return null;
  }
}

function writeSession(key: string, entry: CacheEntry<unknown>): void {
  if (typeof window === "undefined") return;
  try {
    const env: Envelope = { storedAt: entry.storedAt, value: entry.value };
    window.sessionStorage.setItem(sessionKey(key), JSON.stringify(env));
  } catch {
    // Kuota penuh atau private mode -> cache memory tetap jalan
  }
}

function dropSession(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(sessionKey(key));
  } catch {
    /* ignore */
  }
}

/** Cache miss -> jalankan loader, lalu simpan hasilnya. */
async function loadAndStore<T>(
  key: string,
  loader: () => Promise<T>
): Promise<T> {
  try {
    const value = await loader();
    const entry: CacheEntry<T> = { value, storedAt: Date.now() };
    memory.set(key, entry);
    writeSession(key, entry);
    return value;
  } catch (err) {
    // Hapus cache yang gagal di-refresh supaya load berikutnya mencoba lagi.
    memory.delete(key);
    dropSession(key);
    throw err;
  }
}

/**
 * Ambil data dengan cache TTL + dedup + stale-while-revalidate.
 *
 * - Cache fresh  -> langsung return, tanpa network.
 * - Cache basi   -> return data basi INSTAN, refresh di background.
 * - Cache kosong -> tunggu network (tapi request yang sama dipakai bersama).
 */
export async function cachedFetch<T>(
  key: string,
  loader: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<T> {
  const now = Date.now();

  const mem = memory.get(key) as CacheEntry<T> | undefined;
  const hit = mem ?? readSession<T>(key);

  if (hit) {
    const age = now - hit.storedAt;
    if (age < ttlMs) {
      return hit.value;
    }
    // Basi: kembalikan sekarang, refresh di belakang.
    if (!hit.revalidating) {
      const entry = hit as CacheEntry<T>;
      entry.revalidating = true;
      void loadAndStore(key, loader)
        .catch(() => {
          /* biarkan data basi dipakai */
        })
        .finally(() => {
          entry.revalidating = false;
        });
    }
    return hit.value;
  }

  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const p = loadAndStore(key, loader).finally(() => {
    inflight.delete(key);
  });
  inflight.set(key, p);
  return p;
}

/** Buang cache untuk satu key, atau semua key dengan prefix tertentu. */
export function invalidateCache(keyOrPrefix?: string): void {
  if (!keyOrPrefix) {
    memory.clear();
    inflight.clear();
    if (typeof window !== "undefined") {
      try {
        const keys: string[] = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const k = window.sessionStorage.key(i);
          if (k && k.startsWith(SESSION_PREFIX)) keys.push(k);
        }
        keys.forEach((k) => window.sessionStorage.removeItem(k));
        localStorage.setItem("gp_cache_invalidated", Date.now().toString());
      } catch {
        /* ignore */
      }
    }
    return;
  }

  memory.delete(keyOrPrefix);
  dropSession(keyOrPrefix);
  for (const key of Array.from(memory.keys())) {
    if (key.startsWith(keyOrPrefix)) {
      memory.delete(key);
      dropSession(key);
    }
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("gp_cache_invalidated", `${keyOrPrefix}:${Date.now()}`);
    } catch {
      /* ignore */
    }
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "gp_cache_invalidated" && e.newValue) {
      memory.clear();
      inflight.clear();
      try {
        const keys: string[] = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const k = window.sessionStorage.key(i);
          if (k && k.startsWith(SESSION_PREFIX)) keys.push(k);
        }
        keys.forEach((k) => window.sessionStorage.removeItem(k));
      } catch {
        /* ignore */
      }
    }
  });
}

/** Tandai tabel sebagai belum ada di Supabase supaya tidak di-query lagi. */
export function markTableMissing(table: string): void {
  missingTables.add(table);
}

export function isTableMissing(table: string): boolean {
  return missingTables.has(table);
}

/** Error Supabase yang menandakan tabel/kolom tidak ada. */
export function isMissingRelationError(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  const message = String((error as { message?: string } | null)?.message ?? "").toLowerCase();
  return (
    code === "PGRST205" ||
    code === "PGRST202" ||
    code === "42P01" ||
    message.includes("could not find the table") ||
    message.includes("does not exist")
  );
}
