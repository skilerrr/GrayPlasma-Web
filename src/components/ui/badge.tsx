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
        variant === "default" && "bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono text-[11px]",
        variant === "tier-s" &&
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 font-mono",
        variant === "tier-best-value" &&
          "bg-emerald-400 text-zinc-950 font-bold border border-emerald-300 font-mono",
        variant === "tier-recommended" &&
          "bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono",
        variant === "tier-pass" &&
          "bg-zinc-900 text-zinc-500 border border-zinc-800 font-mono",
        variant === "amber" &&
          "bg-orange-500/10 text-orange-400 border border-orange-500/40 font-mono",
        variant === "outline" &&
          "border border-zinc-800 text-zinc-400 bg-transparent font-mono",
        variant === "spec" &&
          "bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono normal-case tracking-normal px-2 py-0.5 text-[11px] tabular-nums",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TierBadge({ tier }: { tier: TierRating }) {
  if (tier === "S-TIER") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        S-Tier
      </span>
    );
  }
  if (tier === "BEST VALUE") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
        Best Value
      </span>
    );
  }
  if (tier === "RECOMMENDED") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
        Recommended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
      Pass Tier
    </span>
  );
}
