"use client";

import React, { useEffect, useState } from "react";
import { GPLogo } from "@/components/gp-logo";

const STORAGE_KEY = "gp-intro-seen";

/**
 * Intro transisi untuk akses pertama kali ke link utama.
 *
 * - Tampil SEKALI per sesi browser (sessionStorage) -> user tidak kesal
 *   karena harus lihat tiap reload, tapi tetap dapat "first impression".
 * - Murni CSS animation (opacity + transform) -> tidak menambah layout work.
 * - Otomatis hilang setelah ~750ms, tidak pernah menghalangi interaksi
 *   (pointer-events-none, dan dihapus dari DOM setelah selesai).
 */
export function FirstVisitIntro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Safari private mode: sessionStorage bisa throw -> tetap tampilkan sekali.
      seen = false;
    }

    if (seen) return;

    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* noop */
    }

    // Delay sedikit biar paint pertama selesai dulu (avoid flash).
    const raf = requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(() => setVisible(false), 850);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="gp-intro-overlay" aria-hidden="true">
      <div className="gp-intro-inner flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-gp-ink-900 border border-gp-ink-700 flex items-center justify-center shadow-tech-card">
          <GPLogo className="w-9 h-9" />
        </div>
        <span className="text-sm font-black tracking-tight text-white uppercase">
          GrayPlasma<span className="text-orange-500 font-mono">ID</span>
        </span>
        <span className="text-3xs font-mono text-gp-ink-500 uppercase tracking-widest">
          Kurasi &amp; Database Monitor
        </span>
      </div>
    </div>
  );
}
