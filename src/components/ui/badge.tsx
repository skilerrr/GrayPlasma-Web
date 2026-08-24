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
        variant === "default" && "bg-zinc-800 text-zinc-300 border border-zinc-700",
        variant === "tier-s" &&
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
        variant === "tier-best-value" &&
          "bg-emerald-400 text-black font-black border border-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.4)]",
        variant === "tier-recommended" &&
          "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
        variant === "tier-pass" &&
          "bg-rose-500/10 text-rose-400 border border-rose-500/30",
        variant === "amber" &&
          "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
        variant === "outline" &&
          "border border-zinc-800 text-zinc-400 bg-transparent",
        variant === "spec" &&
          "bg-zinc-900/90 text-zinc-300 border border-zinc-800 font-normal normal-case tracking-normal px-2 py-0.5 text-[11px]",
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
      <Badge variant="tier-s" className="font-extrabold text-[10px] tracking-widest gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block mr-0.5" />
        S-TIER
      </Badge>
    );
  }
  if (tier === "BEST VALUE") {
    return (
      <Badge variant="tier-best-value" className="font-black text-[10px] tracking-widest bg-emerald-400 text-zinc-950">
        ★ BEST VALUE
      </Badge>
    );
  }
  if (tier === "RECOMMENDED") {
    return (
      <Badge variant="tier-recommended" className="font-bold text-[10px] tracking-wider">
        RECOMMENDED
      </Badge>
    );
  }
  return (
    <Badge variant="tier-pass" className="font-bold text-[10px] tracking-wider">
      PASS TIER
    </Badge>
  );
}
