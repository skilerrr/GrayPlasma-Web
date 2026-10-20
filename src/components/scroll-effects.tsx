"use client";

import React, { useEffect } from "react";

/**
 * Efek scroll yang murah.
 *
 * - Reveal-on-scroll: SATU IntersectionObserver dipakai untuk semua elemen
 *   ber-kelas `gp-reveal`. Observer-nya di-disconnect setelah semua elemen
 *   terlihat, jadi tidak ada scroll listener yang jalan terus.
 * - Elemen yang mount belakangan (data Supabase, hasil filter) picked up oleh
 *   SATU MutationObserver, bukan observer per elemen.
 * - Fail-safe: setelah 2.5s semua elemen yang masih tersembunyi otomatis
 *   ditunjukkan, jadi konten tidak pernah terkunci kalau observer gagal.
 * - Progress bar: pakai `animation-timeline: scroll()` CSS (0 listener JS).
 *   Kalau browser tidak mendukung, bar disembunyikan (bukan fallback mahal).
 *
 * Semua animasi hanya menyentuh `transform` & `opacity` -> diproses di
 * compositor GPU, tidak memicu layout, tidak menambah RAM signifikan.
 */
export function ScrollEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Kalau user minta reduced motion, langsung tampilkan tanpa animasi.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealed = new WeakSet<Element>();

    const show = (el: Element) => {
      if (revealed.has(el)) return;
      revealed.add(el);
      el.classList.add("gp-reveal-visible");
    };

    const showAll = () => {
      document
        .querySelectorAll<HTMLElement>(".gp-reveal")
        .forEach((n) => show(n));
    };

    if (reduced) {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          observer.unobserve(entry.target);
        }
      },
      // Mulai sedikit sebelum elemen masuk viewport supaya animasi jalan
      // saat user masih scroll ke sana, bukan setelah.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    const scan = (root: ParentNode) => {
      root.querySelectorAll?.(".gp-reveal").forEach((n) => {
        if (!revealed.has(n)) observer.observe(n);
      });
    };

    scan(document);

    // Node yang mount belakangan (SSR shell -> data async) ikut ter-observe.
    const mutation = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.classList.contains("gp-reveal")) observer.observe(node);
          else scan(node);
        });
      }
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    // Fail-safe: jangan pernah kunci konten.
    const failsafe = window.setTimeout(showAll, 2500);

    return () => {
      observer.disconnect();
      mutation.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
