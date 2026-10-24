"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Video, ExternalLink } from "lucide-react";

interface YouTubeEmbedProps {
  url?: string;
  videoId?: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({
  url,
  videoId,
  title = "Review & Pengetesan Laboratorium GrayPlasma",
  className = "",
}: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract video ID from URL if not directly passed
  let resolvedId = videoId;
  const isExplicitNA = url && (url.trim().toUpperCase() === "N/A" || url.trim() === "-");

  if (!resolvedId && url && !isExplicitNA) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      resolvedId = match[1];
    }
  }

  // Jika tidak ada video review atau status N/A, tampilkan empty state card yang jelas
  if (!resolvedId) {
    return (
      <div className={`space-y-2 font-sans ${className}`}>
        <div className="flex items-center gap-1.5 font-bold text-gp-ink-400 uppercase text-2xs tracking-wider">
          <Video className="w-3.5 h-3.5 text-gp-ink-500" />
          <span>Status Review: Belum Tersedia (N/A)</span>
        </div>
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gp-ink-900/60 border border-dashed border-gp-ink-700/70 text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gp-ink-800 flex items-center justify-center text-gp-ink-400">
            <Video className="w-5 h-5 text-gp-ink-500" />
          </div>
          <div className="text-xs font-bold text-gp-ink-200">Video Review Belum Tersedia</div>
          <p className="text-2xs text-gp-ink-400 max-w-sm">
            Monitor ini belum diuji atau belum ada video review resmi di kanal YouTube GrayPlasma. Seluruh data spesifikasi saat ini merujuk pada lembar spesifikasi resmi pabrikan.
          </p>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${resolvedId}?autoplay=1&rel=0`;
  const thumbnailUrl = `https://img.youtube.com/vi/${resolvedId}/hqdefault.jpg`;
  const directWatchUrl = url || `https://www.youtube.com/watch?v=${resolvedId}`;

  return (
    <div className={`space-y-2 font-sans ${className}`}>
      <div className="flex items-center justify-between text-xs text-gp-ink-300">
        <div className="flex items-center gap-1.5 font-bold text-white uppercase text-2xs tracking-wider">
          <Video className="w-3.5 h-3.5 text-gp-coral-100" />
          <span>{title}</span>
        </div>
        <a
          href={directWatchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gp-sky hover:underline text-2xs inline-flex items-center gap-1"
        >
          <span>Buka di YouTube</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="relative aspect-video w-full rounded-2xl bg-gp-ink-850 border border-gp-ink-650 overflow-hidden group shadow-md">
        {isPlaying ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div
            onClick={() => setIsPlaying(true)}
            className="relative w-full h-full cursor-pointer flex items-center justify-center"
          >
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Red YouTube Play Button with Ripple */}
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-brand-youtube text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>

            {/* Bottom Title Bar */}
            <div className="absolute bottom-3 left-4 right-4 z-10 text-left">
              <span className="text-xs font-bold text-white line-clamp-1 drop-shadow-md">
                ▶ Klik untuk Menonton Ulasan & Pengujian GrayPlasma
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
