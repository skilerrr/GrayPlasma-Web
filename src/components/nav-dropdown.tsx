"use client";

import Link from "next/link";
import React from "react";

/**
 * Submenu primitives.
 *
 * Semua dropdown di navbar (Rekomendasi / Aftersales / Panduan & Info) memakai
 * komponen ini, jadi anatomi visualnya dijamin identik:
 *
 *   Panel    : lebar, padding, border, radius, shadow, max-height, scroll
 *   Section  : uppercase micro-label + divider opsional
 *   Item     : icon chip + judul + deskripsi + badge opsional
 *
 * Token warna chip diambil dari design token (gp-*), bukan palette Tailwind
 * mentah, supaya warna aksen di seluruh submenu berasal dari satu sumber.
 */

export type DropdownTone = "mint" | "sky" | "ember" | "coral" | "violet";

const TONE_CHIP: Record<DropdownTone, string> = {
  mint: "bg-gp-mint-50/10 text-gp-mint-50",
  sky: "bg-gp-sky-50/10 text-gp-sky-50",
  ember: "bg-gp-ember-50/10 text-gp-ember-50",
  coral: "bg-gp-coral-50/10 text-gp-coral-50",
  violet: "bg-gp-violet/10 text-gp-violet",
};

export interface NavDropdownPanelProps {
  open: boolean;
  align?: "left" | "right";
  id?: string;
  children: React.ReactNode;
}

/** Panel dropdown — seragam untuk semua menu. */
export function NavDropdownPanel({
  open,
  align = "left",
  id,
  children,
}: NavDropdownPanelProps) {
  if (!open) return null;

  return (
    <div
      id={id}
      role="menu"
      aria-label="Submenu"
      className={[
        "absolute top-full mt-2 w-72 rounded-xl border border-gp-ink-650 bg-gp-ink-750 p-2",
        "shadow-2xl z-50 space-y-1 animate-in fade-in zoom-in-95",
        "max-h-[min(80vh,560px)] overflow-y-auto overscroll-contain",
        align === "right" ? "right-0" : "left-0",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export interface NavDropdownSectionProps {
  title: string;
  /** Tambah garis pemisah di atas section (dipakai section kedua). */
  divided?: boolean;
}

/** Judul section di dalam dropdown. */
export function NavDropdownSection({ title, divided }: NavDropdownSectionProps) {
  return (
    <div
      className={[
        "px-2.5 py-1.5 text-3xs font-bold uppercase leading-snug tracking-wider text-gp-ink-300",
        divided ? "mt-1.5 border-t border-gp-ink-650 pt-2.5" : "",
      ].join(" ")}
    >
      {title}
    </div>
  );
}

export interface NavDropdownItemProps {
  href: string;
  icon: React.ReactNode;
  tone?: DropdownTone;
  title: string;
  description?: string;
  /** Badge kecil di kanan — dipakai untuk jumlah item atau penanda status. */
  badge?: string;
  badgeTone?: "neutral" | "warn";
  onSelect?: () => void;
  /** Nomor urutan untuk navigasi keyboard (1..9). */
  shortcut?: number;
}

const BADGE_NEUTRAL =
  "border border-gp-ink-700 bg-gp-ink-800 font-mono text-gp-ink-300";
const BADGE_WARN =
  "border border-gp-ember-100/40 bg-gp-ember-100/20 font-bold text-gp-ember-50";

/** Satu baris menu di dalam dropdown. */
export function NavDropdownItem({
  href,
  icon,
  tone = "mint",
  title,
  description,
  badge,
  badgeTone = "neutral",
  onSelect,
  shortcut,
}: NavDropdownItemProps) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onSelect}
      tabIndex={-1}
      data-dropdown-shortcut={shortcut}
      className="group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-gp-ink-700 focus-visible:bg-gp-ink-700 focus-visible:outline-none"
    >
      <span
        className={[
          "mt-px flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md",
          "transition-colors",
          TONE_CHIP[tone],
        ].join(" ")}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold leading-snug text-gp-ink-100 transition-colors group-hover:text-white">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-3xs leading-snug text-gp-ink-300">
            {description}
          </span>
        ) : null}
      </span>

      {badge ? (
        <span
          className={[
            "mt-px flex-shrink-0 self-start rounded px-1.5 py-0.5 text-4xs",
            badgeTone === "warn" ? BADGE_WARN : BADGE_NEUTRAL,
          ].join(" ")}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
