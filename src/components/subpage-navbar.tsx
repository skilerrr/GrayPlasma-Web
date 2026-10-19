"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GPLogo } from "@/components/gp-logo";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string | React.ReactNode;
}

export interface SubpageNavbarProps {
  breadcrumbs: BreadcrumbItem[];
  backLink?: {
    href: string;
    label: string;
  };
  rightActions?: React.ReactNode;
  maxWidthClass?: string;
}

// Menu utama — disamakan dengan header beranda biar pengunjung nggak "kehilangan"
// navigasi begitu masuk halaman dalam.
const PRIMARY_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/catalog", label: "Rekomendasi" },
  { href: "/aftersales", label: "Aftersales" },
  { href: "/guides", label: "Panduan" },
];

export function SubpageNavbar({
  breadcrumbs,
  backLink,
  rightActions,
  maxWidthClass = "max-w-6xl",
}: SubpageNavbarProps) {
  return (
    <nav aria-label="Breadcrumb Navigation" className="border-b border-gp-ink-700 bg-gp-ink-950/95 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3">
      <div className={`${maxWidthClass} mx-auto flex items-center justify-between gap-4`}>
        {/* Left Breadcrumbs Trail */}
        <div className="flex items-center gap-2 text-xs text-gp-ink-300 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link
            href="/"
            className="hover:text-white transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider text-gp-ink-200 hover:text-white flex-shrink-0"
          >
            <GPLogo className="w-5 h-5" />
            <span>BERANDA</span>
          </Link>

          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                <span className="text-gp-ink-500 select-none">/</span>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors flex items-center gap-1.5 uppercase font-medium text-gp-ink-300 hover:text-gp-ink-100"
                  >
                    {item.icon && <span className="inline-flex items-center">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={`flex items-center gap-1.5 uppercase truncate ${
                      isLast
                        ? "text-white font-bold tracking-tight"
                        : "text-gp-ink-300 font-medium"
                    }`}
                  >
                    {item.icon && <span className="inline-flex items-center">{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Menu utama (desktop) — biar konsisten dengan header beranda */}
        <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2.5 py-1.5 rounded-lg text-2xs font-bold uppercase tracking-wider text-gp-ink-300 hover:text-white hover:bg-gp-ink-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions & Back Button */}
        <div className="flex flex-wrap items-center justify-end gap-2 min-w-0">
          {rightActions}
          {backLink && (
            <Link
              href={backLink.href}
              className="hidden sm:inline-flex lg:hidden items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gp-ink-800 hover:bg-gp-ink-750 border border-gp-ink-700 text-xs font-mono font-medium text-gp-ink-200 hover:text-white transition-all flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{backLink.label}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
