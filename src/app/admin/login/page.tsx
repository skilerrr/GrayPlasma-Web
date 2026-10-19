"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Unlock } from "lucide-react";
import { isSupabaseConfigured, signInAdminWithSupabase, supabase } from "@/lib/supabase";

/**
 * Halaman login admin.
 *
 * Satu-satunya jalur masuk: Supabase Auth (username/email + password).
 * Nggak ada password hardcoded, nggak ada bypass, nggak ada fallback
 * "kalau kosong berarti super admin".
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Kalau sudah ada sesi Supabase yang masih hidup, langsung lempar ke /admin.
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isSupabaseConfigured || !supabase) {
        if (alive) setIsCheckingSession(false);
        return;
      }
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (token && alive) {
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: token }),
          });
          router.replace("/admin");
          return;
        }
      } catch {
        /* diamkan, tampilkan form */
      }
      if (alive) setIsCheckingSession(false);
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isBusy) return;
    setError("");

    if (!isSupabaseConfigured || !supabase) {
      setError(
        "Supabase belum aktif di environment ini. Admin dimatikan sampai NEXT_PUBLIC_SUPABASE_URL & ANON_KEY tersedia."
      );
      return;
    }

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();
    if (!cleanUsername || !cleanPassword) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setIsBusy(true);
    try {
      const result = await signInAdminWithSupabase(cleanUsername, cleanPassword);
      if (result.error || !result.profile) {
        setError(result.error || "Username atau password salah.");
        return;
      }

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setError("Sesi Supabase gagal dibuat. Coba lagi.");
        return;
      }

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token }),
      });
      if (!response.ok) {
        setError("Gagal membuat sesi server. Cek log server.");
        return;
      }

      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gp-ink-998 flex items-center justify-center p-4 relative font-sans">
      <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />

      <div className="max-w-md w-full bg-gp-ink-900 border border-gp-ink-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10">
        <div className="space-y-3 text-center border-b border-gp-ink-700 pb-5">
          <div className="flex items-center justify-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-gp-ink-800 border border-gp-ink-650 text-emerald-400 font-mono text-3xs font-bold uppercase tracking-wider">
              Admin Security
            </span>
          </div>

          <div className="w-12 h-12 rounded-xl bg-gp-ink-800 border border-gp-ink-650 text-emerald-400 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
              GrayPlasma Admin Workspace
            </h2>
            <p className="text-xs text-gp-ink-300 mt-1">
              Masuk pakai akun Supabase yang terdaftar sebagai admin.
            </p>
          </div>
        </div>

        {isCheckingSession ? (
          <p className="text-xs font-mono text-gp-ink-400 text-center py-6">
            Memeriksa sesi...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-2xs font-mono font-bold text-gp-ink-300 uppercase tracking-wider">
                Username Admin
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="grayplasma"
                className="w-full bg-gp-ink-800 border border-gp-ink-650 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gp-ink-400 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                autoFocus
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-2xs font-mono font-bold text-gp-ink-300 uppercase tracking-wider">
                Kata Sandi / Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full bg-gp-ink-800 border border-gp-ink-650 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gp-ink-400 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
              />
              {error && (
                <p className="text-xs text-rose-400 pt-1 text-center font-medium">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-black font-bold uppercase tracking-wider text-xs py-4 rounded-xl font-mono flex items-center justify-center gap-2 transition-colors"
            >
              <Unlock className="w-4 h-4" />
              <span>{isBusy ? "Memverifikasi..." : "Verifikasi Masuk"}</span>
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-xs text-gp-ink-400 hover:text-gp-ink-200 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda Katalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
