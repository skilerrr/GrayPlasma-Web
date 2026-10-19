"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, X, ArrowRight } from "lucide-react";
import { AnnouncementBarSettings } from "@/lib/db-service";

interface AnnouncementBarProps {
  settings?: AnnouncementBarSettings;
}

const THEME_STYLES = {
  emerald: {
    bg: "bg-gradient-to-r from-emerald-950 via-gp-mint-400 to-emerald-950 border-emerald-500/30 text-emerald-300",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    button: "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40",
  },
  cyan: {
    bg: "bg-gradient-to-r from-cyan-950 via-gp-sky-200 to-cyan-950 border-cyan-500/30 text-cyan-300",
    badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    button: "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-500/40",
  },
  amber: {
    bg: "bg-gradient-to-r from-amber-950 via-gp-ember-200 to-amber-950 border-amber-500/30 text-amber-300",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    button: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40",
  },
  rose: {
    bg: "bg-gradient-to-r from-rose-950 via-gp-coral-400 to-rose-950 border-rose-500/30 text-rose-300",
    badge: "bg-rose-500/20 text-rose-400 border-rose-500/40",
    button: "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40",
  },
  violet: {
    bg: "bg-gradient-to-r from-violet-950 via-gp-violet-200 to-violet-950 border-violet-500/30 text-violet-300",
    badge: "bg-violet-500/20 text-violet-400 border-violet-500/40",
    button: "bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border-violet-500/40",
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
      className={`relative z-40 border-b px-4 py-2 text-xs font-sans transition-all duration-300 ${theme.bg}`}
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
