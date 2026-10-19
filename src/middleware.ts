import { NextResponse, type NextRequest } from "next/server";

/**
 * P0 FIX — gerbang /admin.
 *
 * Middleware ini HANYA gerbang UX/SEO (biar UI admin nggak ke-render buat
 * orang yang belum login). Otorisasi data yang sebenarnya tetap dipegang
 * RLS Supabase + Supabase Auth session di client.
 *
 * Cookie `gp_at` berisi access token (httpOnly) yang di-set oleh
 * /api/auth/session setelah login Supabase berhasil.
 */

const COOKIE_NAME = "gp_at";

function jwtExpiryMs(token: string): number | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Halaman login sendiri harus selalu bisa diakses.
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const expiry = token ? jwtExpiryMs(token) : null;
  const valid = Boolean(token && expiry && expiry > Date.now());

  if (!valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
