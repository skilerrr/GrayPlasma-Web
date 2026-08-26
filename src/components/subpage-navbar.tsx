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
    <nav aria-label="Breadcrumb Navigation" className="border-b border-[#2f2f2f] bg-[#121212]/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3">
      <div className={`${maxWidthClass} mx-auto flex items-center justify-between gap-4`}>
        {/* Left Breadcrumbs Trail */}
        <div className="flex items-center gap-2 text-xs text-[#9b9a97] overflow-x-auto no-scrollbar whitespace-nowrap">
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
                    className="hover:text-white transition-colors flex items-center gap-1 uppercase font-medium text-zinc-400 hover:text-zinc-200"
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={`flex items-center gap-1 uppercase truncate ${
                      isLast
                        ? "text-white font-bold tracking-normal"
                        : "text-zinc-400 font-medium"
                    }`}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Actions & Back Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {rightActions}
          {backLink && (
            <Link
              href={backLink.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#202020] hover:bg-[#282828] border border-[#2f2f2f] text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-sm flex-shrink-0"
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
