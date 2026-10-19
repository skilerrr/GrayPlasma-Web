import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "cyber" | "amber" | "secondary";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          // Variants
          variant === "default" &&
            "bg-gp-ink-800 text-white hover:bg-gp-ink-700 border border-gp-ink-700 hover:border-gp-ink-600 shadow-sm",
          variant === "cyber" &&
            "bg-emerald-500 text-gp-ink-950 font-bold hover:bg-emerald-400 border border-emerald-400/50 shadow-sm active:translate-y-[1px]",
          variant === "amber" &&
            "bg-orange-500 text-gp-ink-950 font-bold hover:bg-orange-400 border border-orange-400/50 shadow-sm active:translate-y-[1px]",
          variant === "outline" &&
            "border border-gp-ink-700 bg-black/40 text-gp-ink-200 hover:bg-gp-ink-800 hover:text-white hover:border-gp-ink-650",
          variant === "ghost" &&
            "text-gp-ink-300 hover:text-white hover:bg-gp-ink-800/60",
          variant === "secondary" &&
            "bg-gp-ink-700/80 text-gp-ink-100 hover:bg-gp-ink-600/80 border border-gp-ink-600/50",
          // Sizes
          size === "sm" && "h-8 px-3 text-xs rounded-md",
          size === "md" && "h-9 px-4 text-sm rounded-lg",
          size === "lg" && "h-11 px-6 text-base rounded-xl",
          size === "icon" && "h-9 w-9 p-0 rounded-lg",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
