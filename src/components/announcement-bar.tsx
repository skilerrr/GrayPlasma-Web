"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, X, ArrowRight } from "lucide-react";
import { AnnouncementBarSettings } from "@/lib/db-service";

interface AnnouncementBarProps {
  settings?: AnnouncementBarSettings;
}

/**
 * Tema announcement bar.
 *
 * Warna diambil dari design token (gp-*), bukan palette Tailwind mentah,
 * supaya semua warna aksen di situs berasal dari satu sumber kebenaran.
 * `gp.<family>-<shade>`:
 *   50/100 = aksen terang (teks & border), 200+ = permukaan gelap.
 */
const THEME_STYLES = {
  emerald: {
    bg: "bg-gradient-to-r from-gp-mint-900 via-gp-mint-400 to-gp-mint-900 border-gp-mint-50/30 text-gp-mint-50",
    badge: "bg-gp-mint-50/20 text-gp-mint-50 border-gp-mint-50/40",
    button: "bg-gp-mint-50/20 hover:bg-gp-mint-50/30 text-gp-mint-50 border-gp-mint-50/40",
  },
  cyan: {
    bg: "bg-gradient-to-r from-gp-sky-800 via-gp-sky-200 to-gp-sky-800 border-gp-sky-50/30 text-gp-sky-50",
    badge: "bg-gp-sky-50/20 text-gp-sky-50 border-gp-sky-50/40",
    button: "bg-gp-sky-50/20 hover:bg-gp-sky-50/30 text-gp-sky-50 border-gp-sky-50/40",
  },
  amber: {
    bg: "bg-gradient-to-r from-gp-ember-500 via-gp-ember-200 to-gp-ember-500 border-gp-ember-50/30 text-gp-ember-50",
    badge: "bg-gp-ember-50/20 text-gp-ember-50 border-gp-ember-50/40",
    button: "bg-gp-ember-50/20 hover:bg-gp-ember-50/30 text-gp-ember-50 border-gp-ember-50/40",
  },
  rose: {
    bg: "bg-gradient-to-r from-gp-coral-800 via-gp-coral-400 to-gp-coral-800 border-gp-coral-50/30 text-gp-coral-50",
    badge: "bg-gp-coral-50/20 text-gp-coral-50 border-gp-coral-50/40",
    button: "bg-gp-coral-50/20 hover:bg-gp-coral-50/30 text-gp-coral-50 border-gp-coral-50/40",
  },
  violet: {
    bg: "bg-gradient-to-r from-gp-violet-500 via-gp-violet-200 to-gp-violet-500 border-gp-violet/30 text-gp-violet",
    badge: "bg-gp-violet/20 text-gp-violet border-gp-violet/40",
    button: "bg-gp-violet/20 hover:bg-gp-violet/30 text-gp-violet border-gp-violet/40",
  },
};

export function AnnouncementBar({ settings }: AnnouncementBarProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem("gp_announcement_dismissed");
      if (dismissed === "true") {
        setIsDismissed(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  if (!settings || !settings.isEnabled || !settings.text || isDismissed) {
    return null;
  }

  const themeKey = settings.themeColor || "emerald";
  const theme = THEME_STYLES[themeKey] || THEME_STYLES.emerald;

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("gp_announcement_dismissed", "true");
    } catch {
      // Ignore
    }
  };

  return (
    <aside
      aria-label="Pengumuman Penting"
      className={`relative z-40 border-b px-4 py-2 text-xs font-sans transition-colors duration-300 ${theme.bg}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
          {settings.badgeText ? (
            <span
              className={`px-2 py-0.5 rounded-full border font-mono font-bold text-3xs tracking-wider uppercase flex-shrink-0 ${theme.badge}`}
            >
              {settings.badgeText}
            </span>
          ) : (
            <span className="p-1 rounded-full bg-white/10 flex-shrink-0">
              <Megaphone className="w-3.5 h-3.5" />
            </span>
          )}

          <p className="truncate text-xs text-white font-medium">
            {settings.text}
          </p>

          {settings.linkUrl && settings.linkText && (
            <Link
              href={settings.linkUrl}
              className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-2xs font-semibold transition-colors flex-shrink-0 ${theme.button}`}
            >
              <span>{settings.linkText}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg text-gp-ink-300 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          title="Tutup pengumuman"
          aria-label="Tutup pengumuman"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
