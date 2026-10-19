"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import { AdBannerItem } from "@/lib/db-service";

interface BannerCarouselProps {
  banners: AdBannerItem[];
  intervalMs?: number;
  className?: string;
}

export function BannerCarousel({
  banners,
  intervalMs = 5000,
  className = "",
}: BannerCarouselProps) {
  const router = useRouter();
  const activeBanners = banners.filter((b) => b.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragProgress, setDragProgress] = useState(0); // for visual drag feedback
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const pointerDownTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-slide effect
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused || isDragging) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeBanners.length, intervalMs, isPaused, isDragging]);

  // Keep index within bounds if active banners change
  useEffect(() => {
    if (currentIndex >= activeBanners.length && activeBanners.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeBanners.length, currentIndex]);

  const handleNext = useCallback(() => {
    if (activeBanners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const handlePrev = useCallback(() => {
    if (activeBanners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  // Handle banner click/trigger
  const handleBannerClick = useCallback(
    (banner: AdBannerItem) => {
      if (!banner.linkUrl) return;
      if (banner.targetBlank || banner.linkUrl.startsWith("http")) {
        window.open(banner.linkUrl, "_blank", "noopener,noreferrer");
      } else {
        router.push(banner.linkUrl);
      }
    },
    [router]
  );

  // Pointer / Touch drag gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only capture left clicks / primary touches
    if (e.button !== 0) return;
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    pointerDownTimeRef.current = Date.now();
    setIsDragging(true);
    setDragProgress(0);

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    currentXRef.current = e.clientX;
    const delta = currentXRef.current - startXRef.current;
    setDragProgress(delta);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }

    const delta = currentXRef.current - startXRef.current;
    const elapsed = Date.now() - pointerDownTimeRef.current;
    setDragProgress(0);

    // Swipe Threshold: dragged more than 50px OR fast flick (> 30px in < 250ms)
    const isFlick = elapsed < 250 && Math.abs(delta) > 30;
    if (delta < -50 || (isFlick && delta < 0)) {
      handleNext();
    } else if (delta > 50 || (isFlick && delta > 0)) {
      handlePrev();
    } else if (Math.abs(delta) < 10) {
      // Considered a clean tap/click -> trigger link navigation
      const currentBanner = activeBanners[currentIndex];
      if (currentBanner) {
        handleBannerClick(currentBanner);
      }
    }
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragProgress(0);
  };

  if (activeBanners.length === 0) {
    return null;
  }

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const getBadgeColorClasses = (color?: string) => {
    switch (color) {
      case "amber":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "rose":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30";
      case "cyan":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      case "violet":
        return "bg-violet-500/15 text-violet-400 border-violet-500/30";
      case "orange":
        return "bg-orange-500/15 text-orange-400 border-orange-500/30";
      case "emerald":
      default:
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
  };

  const getDotColorClasses = (color?: string) => {
    switch (color) {
      case "amber":
        return "bg-amber-400";
      case "rose":
        return "bg-rose-400";
      case "cyan":
        return "bg-cyan-400";
      case "violet":
        return "bg-violet-400";
      case "orange":
        return "bg-orange-400";
      case "emerald":
      default:
        return "bg-emerald-400";
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-black select-none group border-b border-gp-ink-750 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Interactive Drag/Swipe Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="relative w-full h-[270px] sm:h-[350px] md:h-[400px] lg:h-[450px] cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image with Parallax / Drag effect */}
              <div
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={{
                  transform: isActive && isDragging ? `translateX(${dragProgress * 0.3}px)` : "translateX(0)",
                }}
              >
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  draggable={false}
                />
              </div>

              {/* Multi-Layered Cinematic Dark Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-gp-ink-998 via-gp-ink-998/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-gp-ink-998" />

              {/* Slide Content Overlay */}
              <div className="relative h-full max-w-7xl mx-auto pl-14 pr-14 sm:pl-20 sm:pr-20 lg:pl-24 lg:pr-24 flex flex-col justify-end pb-8 sm:pb-12 md:pb-14">
                <div
                  className="max-w-3xl space-y-3 sm:space-y-4 transition-transform duration-300"
                  style={{
                    transform: isActive && isDragging ? `translateX(${dragProgress * 0.5}px)` : "translateX(0)",
                  }}
                >
                  {/* Badge & Sponsor Tag */}
                  <div className="flex items-center gap-2.5">
                    {banner.badge && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-2xs sm:text-xs font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${getBadgeColorClasses(
                          banner.badgeColor
                        )}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full animate-pulse ${getDotColorClasses(
                            banner.badgeColor
                          )}`}
                        />
                        <span>{banner.badge}</span>
                      </span>
                    )}
                    <span className="text-3xs font-mono text-gp-ink-300 uppercase tracking-widest px-2 py-0.5 rounded bg-black/60 border border-gp-ink-700">
                      FEATURED
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-md">
                    {banner.title}
                  </h2>

                  {/* Description Subtitle */}
                  {banner.subtitle && (
                    <p className="text-xs sm:text-sm md:text-base text-gp-ink-200 max-w-2xl line-clamp-2 leading-relaxed font-medium drop-shadow">
                      {banner.subtitle}
                    </p>
                  )}

                  {/* CTA Trigger Button */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBannerClick(banner);
                      }}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white text-black hover:bg-gp-ink-100 font-bold text-xs sm:text-sm shadow-xl active:scale-[0.98] transition-all group/btn"
                    >
                      <span>{banner.ctaText || "Lihat Selengkapnya"}</span>
                      {banner.targetBlank ? (
                        <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      )}
                    </button>
                    <span className="text-2xs font-mono text-gp-ink-300 hidden sm:inline-flex items-center">
                      <span>Swipe atau geser</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls: Previous / Next Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xl opacity-80 hover:opacity-100 hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xl opacity-80 hover:opacity-100 hover:scale-105"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Bottom Progress Bar & Pagination Indicators */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2 pointer-events-auto">
          {activeBanners.map((b, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={b.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`relative h-1.5 sm:h-2 rounded-full overflow-hidden transition-colors duration-300 ${
                  isActive ? "w-8 sm:w-12 bg-gp-ink-600" : "w-2 bg-gp-ink-700 hover:bg-gp-ink-600"
                }`}
              >
                {isActive && (
                  <div
                    key={`progress-${currentIndex}-${isPaused}`}
                    className={`h-full bg-emerald-400 rounded-full ${
                      isPaused ? "" : "animate-banner-progress"
                    }`}
                    style={{
                      animationDuration: `${intervalMs}ms`,
                      animationPlayState: isPaused ? "paused" : "running",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
