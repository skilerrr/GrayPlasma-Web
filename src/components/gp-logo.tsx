import React from "react";

export function GPLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 select-none ${className}`}
      aria-label="GrayPlasma Logo"
    >
      <rect width="36" height="36" rx="18" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ffffff"
        fontFamily="inherit"
        fontSize="14"
        fontWeight="800"
        letterSpacing="-0.04em"
      >
        GP
      </text>
    </svg>
  );
}
