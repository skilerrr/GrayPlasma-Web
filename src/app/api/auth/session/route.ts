import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const COOKIE_NAME = "gp_at";

/**
 * Set cookie sesi admin (httpOnly) setelah login Supabase berhasil.
 * Token diverifikasi dulu ke Supabase — cookie nggak bisa dibuat dari token palsu.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { ok: false, error: "Supabase belum terkonfigurasi." },
      { status: 503 }
    );
  }

  let accessToken: string | undefined;
  try {
    const body = await request.json();
    accessToken = typeof body?.access_token === "string" ? body.access_token : undefined;
  } catch {
    return NextResponse.json({ ok: false, error: "Body tidak valid." }, { status: 400 });
  }

  if (!accessToken) {
    return NextResponse.json({ ok: false, error: "Token kosong." }, { status: 400 });
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return NextResponse.json({ ok: false, error: "Token tidak valid." }, { status: 401 });
  }

  const store = await cookies();
  store.set(COOKIE_NAME, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true, user_id: data.user.id });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
