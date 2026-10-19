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

export function SubpageNavbar({
  breadcrumbs,
  backLink,
  rightActions,
  maxWidthClass = "max-w-6xl",
}: SubpageNavbarProps) {
  return (
    <nav aria-label="Breadcrumb Navigation" className="border-b border-zinc-800 bg-[#0c0c10]/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3">
      <div className={`${maxWidthClass} mx-auto flex items-center justify-between gap-4`}>
        {/* Left Breadcrumbs Trail */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link
            href="/"
            className="hover:text-white transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider text-zinc-300 hover:text-white flex-shrink-0"
          >
            <GPLogo className="w-5 h-5" />
            <span>BERANDA</span>
          </Link>

          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                <span className="text-zinc-600 select-none">/</span>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors flex items-center gap-1.5 uppercase font-medium text-zinc-400 hover:text-zinc-200"
                  >
                    {item.icon && <span className="inline-flex items-center">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={`flex items-center gap-1.5 uppercase truncate ${
                      isLast
                        ? "text-white font-bold tracking-tight"
                        : "text-zinc-400 font-medium"
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

        {/* Right Actions & Back Button */}
        <div className="flex flex-wrap items-center justify-end gap-2 min-w-0">
          {rightActions}
          {backLink && (
            <Link
              href={backLink.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-mono font-medium text-zinc-300 hover:text-white transition-all flex-shrink-0"
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
