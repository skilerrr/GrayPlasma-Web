/**
 * Seed Supabase dari data statis repo (monitors, desks, peripherals, aftersales,
 * hierarchy, FAQ, site settings).
 *
 * Jalankan:  npx tsx scripts/seed-supabase.mts
 *
 * Kenapa ada: tombol "Sync" di admin cuma mendorong 4 tabel (monitor/meja/
 * peripheral/aftersales). Skrip ini menambah hierarki, FAQ, dan settings supaya
 * database cloud benar-benar sama dengan yang tampil di situs.
 *
 * Login pakai akun admin Supabase (default: grayplasma@grayplasma.local).
 * Password bisa di-override lewat env SEED_ADMIN_PASSWORD.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { MONITORS_DATA } from "../src/data/monitors.ts";
import {
  DESK_DATABASE,
  PERIPHERALS_DATABASE,
} from "../src/data/grayplasma-desk-peripherals.ts";
import { AFTERSALES_DATA, FAQ_LIST } from "../src/data/grayplasma-content.ts";
import { DEFAULT_SITE_HIERARCHY } from "../src/data/site-hierarchy.ts";
import { NOTION_AFTERSALES_CARDS } from "../src/data/notion-aftersales-board-data.ts";
import {
  DEFAULT_AD_BANNERS,
  DEFAULT_BANNER_SETTINGS,
  DEFAULT_HOMEPAGE_SETTINGS,
  DEFAULT_SITE_SETTINGS,
} from "../src/lib/db-service.ts";

const root = resolve(import.meta.dirname, "..");

function loadEnv(): Record<string, string> {
  const raw = readFileSync(resolve(root, ".env.local"), "utf8");
  const out: Record<string, string> = {};
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

/** Ambil daftar kolom tiap tabel dari supabase_schema.sql supaya payload tidak
 *  pernah mengirim kolom yang tidak ada (PostgREST menolak seluruh batch). */
function tableColumns(): Record<string, string[]> {
  const sql = readFileSync(resolve(root, "supabase_schema.sql"), "utf8");
  const blocks = [
    ...sql.matchAll(/CREATE TABLE IF NOT EXISTS public\.(\w+)\s*\(([\s\S]*?)\n\);/g),
  ];
  const map: Record<string, string[]> = {};
  for (const [, table, body] of blocks) {
    const cols: string[] = [];
    for (const line of body.split("\n")) {
      const clean = line.trim().replace(/,$/, "");
      if (!clean || clean.startsWith("--")) continue;
      if (/^(CONSTRAINT|PRIMARY|UNIQUE|FOREIGN|CHECK)\b/i.test(clean)) continue;
      const m = clean.match(/^"?([A-Za-z_][A-Za-z0-9_]*)"?\s+\w/);
      if (m) cols.push(m[1]);
    }
    map[table] = cols;
  }
  return map;
}

const env = loadEnv();
const BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = env.SEED_ADMIN_EMAIL ?? "grayplasma@grayplasma.local";
const ADMIN_PASSWORD = env.SEED_ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  throw new Error(
    "SEED_ADMIN_PASSWORD belum di-set di .env.local. Password admin tidak lagi " +
      "di-hardcode di repo — isi sendiri di .env.local (baris SEED_ADMIN_PASSWORD=...)."
  );
}

if (!BASE || !ANON) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL / ANON_KEY tidak ada di .env.local");
}

const cols = tableColumns();

async function login(): Promise<string> {
  const res = await fetch(`${BASE}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON, "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const body = (await res.json()) as { access_token?: string; msg?: string };
  if (!res.ok || !body.access_token) {
    throw new Error(`Login admin gagal (${res.status}): ${body.msg ?? JSON.stringify(body)}`);
  }
  return body.access_token;
}

async function upsert(
  token: string,
  table: string,
  rows: Record<string, unknown>[],
  conflict: string
): Promise<{ ok: number; fail: number; error?: string }> {
  const allowed = cols[table] ?? [];
  if (!allowed.length) return { ok: 0, fail: rows.length, error: `tabel ${table} tidak ada di schema` };

  const clean = rows.map((row) => {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(row)) if (allowed.includes(key)) out[key] = row[key];
    return out;
  });

  // PostgREST menuntut semua objek dalam satu batch punya kunci identik.
  // Data statis tidak seragam (field opsional sering hilang), jadi samakan
  // ke union kunci lalu isi yang kosong dengan null.
  const union = new Set<string>();
  for (const row of clean) for (const key of Object.keys(row)) union.add(key);
  const keys = [...union];
  const normalized = clean.map((row) => {
    const out: Record<string, unknown> = {};
    for (const key of keys) out[key] = key in row ? row[key] : null;
    return out;
  });

  let ok = 0;
  let fail = 0;
  let error: string | undefined;

  for (let i = 0; i < normalized.length; i += 25) {
    const batch = normalized.slice(i, i + 25);
    const res = await fetch(`${BASE}/rest/v1/${table}?on_conflict=${conflict}`, {
      method: "POST",
      headers: {
        apikey: ANON,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(batch),
    });
    if (res.ok) {
      ok += batch.length;
    } else {
      fail += batch.length;
      error ??= `${res.status}: ${(await res.text()).slice(0, 300)}`;
    }
  }
  return { ok, fail, error };
}

const token = await login();
console.log(`✓ login sebagai ${ADMIN_EMAIL}\n`);

const jobs: Array<[string, Record<string, unknown>[], string]> = [
  ["monitors", MONITORS_DATA as unknown as Record<string, unknown>[], "id"],
  ["desks", DESK_DATABASE as unknown as Record<string, unknown>[], "id"],
  ["peripherals", PERIPHERALS_DATABASE as unknown as Record<string, unknown>[], "id"],
  ["aftersales", AFTERSALES_DATA as unknown as Record<string, unknown>[], "brand"],
  [
    "aftersales_cards",
    // Kolom `brand` NOT NULL di skema, tapi objek kartu tidak punya field itu
    // (kode admin pun upsert mentah → error 23502 yang ditelan try/catch).
    // Di sini kita isi dari `title` supaya seeding tidak gagal.
    NOTION_AFTERSALES_CARDS.map((card) => ({
      ...(card as unknown as Record<string, unknown>),
      brand: (card as unknown as { brand?: string }).brand ?? card.title,
    })),
    "id",
  ],
  ["hierarchy_nodes", DEFAULT_SITE_HIERARCHY as unknown as Record<string, unknown>[], "id"],
  ["faq_items", FAQ_LIST as unknown as Record<string, unknown>[], "id"],
  [
    "site_settings",
    [
      { key: "global_site_config", value: DEFAULT_SITE_SETTINGS },
      { key: "page_banners", value: DEFAULT_BANNER_SETTINGS },
      { key: "homepage_settings", value: DEFAULT_HOMEPAGE_SETTINGS },
      { key: "ad_banners", value: DEFAULT_AD_BANNERS },
    ],
    "key",
  ],
];

let totalOk = 0;
let totalFail = 0;
for (const [table, rows, conflict] of jobs) {
  const r = await upsert(token, table, rows, conflict);
  totalOk += r.ok;
  totalFail += r.fail;
  const status = r.fail === 0 ? "✓" : "✗";
  console.log(`${status} ${table.padEnd(17)} ${r.ok}/${rows.length}${r.error ? `  → ${r.error}` : ""}`);
}

console.log(`\nTotal: ${totalOk} baris masuk, ${totalFail} gagal.`);
process.exit(totalFail === 0 ? 0 : 1);
