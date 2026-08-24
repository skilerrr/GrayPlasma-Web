import React from "react";

export function GPLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div
      className={`relative rounded-full bg-zinc-950 border border-zinc-700/80 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105 ${className}`}
    >
      <span className="text-white font-black tracking-tighter text-sm sm:text-base font-sans select-none">
        GP
      </span>
    </div>
  );
}
