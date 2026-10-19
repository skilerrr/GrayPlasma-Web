import React from "react";
import Image from "next/image";

export function GPLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`inline-block flex-shrink-0 select-none relative overflow-hidden rounded-md bg-gp-ink-800 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/gp-logo.png"
        alt="GP"
        className="w-full h-full object-contain"
        onError={(e) => {
          // If image fails, fallback to inline SVG
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}
