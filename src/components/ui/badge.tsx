import * as React from "react";
import { cn } from "@/lib/utils";
import { TierRating } from "@/types/monitor";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "tier-s" | "tier-best-value" | "tier-recommended" | "tier-pass" | "amber" | "outline" | "spec";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors",
        variant === "default" && "bg-gp-ink-800 text-gp-ink-200 border border-gp-ink-700 font-mono text-2xs",
        variant === "tier-s" &&
          "bg-hue-emerald-500/10 text-hue-emerald-400 border border-hue-emerald-500/40 font-mono",
        variant === "tier-best-value" &&
          "bg-hue-emerald-400 text-gp-ink-950 font-bold border border-hue-emerald-300 font-mono",
        variant === "tier-recommended" &&
          "bg-gp-ink-700 text-gp-ink-100 border border-gp-ink-600 font-mono",
        variant === "tier-pass" &&
          "bg-gp-ink-800 text-gp-ink-400 border border-gp-ink-700 font-mono",
        variant === "amber" &&
          "bg-hue-orange-500/10 text-hue-orange-400 border border-hue-orange-500/40 font-mono",
        variant === "outline" &&
          "border border-gp-ink-700 text-gp-ink-300 bg-transparent font-mono",
        variant === "spec" &&
          "bg-gp-ink-800 text-gp-ink-200 border border-gp-ink-700 font-mono normal-case tracking-normal px-2 py-0.5 text-2xs tabular-nums",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TierBadge({ tier }: { tier: TierRating }) {
  const norm = (tier || "").toUpperCase();

  if (norm === "S-TIER" || norm === "TOP TIER") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-hue-emerald-500/10 text-hue-emerald-400 border border-hue-emerald-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-hue-emerald-400" />
        {tier === "TOP TIER" ? "Top Tier" : "S-Tier"}
      </span>
    );
  }
  if (norm === "BEST VALUE" || norm === "VALUE ENTRY") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-semibold bg-hue-teal-500/10 text-hue-teal-300 border border-hue-teal-500/30">
        {tier === "VALUE ENTRY" ? "Value Entry" : "Best Value"}
      </span>
    );
  }
  if (norm === "RECOMMENDED" || norm === "HONORABLE MENTION") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-medium bg-gp-ink-700/80 text-gp-ink-200 border border-gp-ink-600/60">
        {tier === "HONORABLE MENTION" ? "Honorable Mention" : "Recommended"}
      </span>
    );
  }
  if (norm === "TIER DISCONTINUE" || norm === "DISCONTINUE" || norm === "DISCONTINUED") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-gp-ink-800 text-hue-rose-400/90 border border-hue-rose-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-hue-rose-400/80" />
        Discontinue
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-medium bg-gp-ink-800 text-gp-ink-400 border border-gp-ink-700">
      {tier === "NOT RECOMMENDED" ? "Not Recommended" : "Pass Tier"}
    </span>
  );
}
