import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        surface: {
          DEFAULT: "#0d0d11",
          dark: "#08080a",
          elevated: "#12131a",
          glass: "rgba(13, 13, 17, 0.85)",
          blueprint: "#12131a",
        },
        border: {
          DEFAULT: "#27272a",
          subtle: "#18181b",
          glow: "#3f3f46",
          blueprint: "#1f202b",
        },
        gp: {
          bg: "#09090b",
          blueprint: "#0d0d11",
          blueprintCard: "#12131a",
          blueprintGrid: "#1f202b",
          orange: "#ff5722",
          orangeGlow: "rgba(255, 87, 34, 0.25)",
          blue: "#0088ff",
          blueGlow: "rgba(0, 136, 255, 0.25)",
          emerald: "#00e676",
          emeraldGlow: "rgba(0, 230, 118, 0.25)",
          crimson: "#ff2d55",
          crimsonGlow: "rgba(255, 45, 85, 0.25)",
          amber: "#ffb300",
          cyan: "#00d2ff",
          paper: "#f8f9fa",
          paperGrid: "#e5e7eb",
          paperInk: "#18181b",
        },
        accent: {
          emerald: "#00e676",
          emeraldGlow: "rgba(0, 230, 118, 0.2)",
          amber: "#ffb300",
          amberGlow: "rgba(255, 179, 0, 0.2)",
          cyan: "#00d2ff",
          violet: "#8b5cf6",
          crimson: "#ff2d55",
          orange: "#ff5722",
        },
        brand: {
          tokopedia: "#00AA5B",
          shopee: "#EE4D2D",
          blibli: "#0095DA",
        },
      },
      fontFamily: {
        sans: ["var(--font-metropolitan)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["var(--font-metropolitan)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-border": "glowBorder 2s ease-in-out infinite alternate",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        glowBorder: {
          "0%": { borderColor: "rgba(39, 39, 42, 0.8)" },
          "100%": { borderColor: "rgba(0, 230, 118, 0.6)" },
        },
      },
      boxShadow: {
        "neon-gp-orange": "0 0 25px -4px rgba(255, 87, 34, 0.35), 0 0 10px -2px rgba(255, 87, 34, 0.25)",
        "neon-gp-blue": "0 0 25px -4px rgba(0, 136, 255, 0.35), 0 0 10px -2px rgba(0, 136, 255, 0.25)",
        "neon-gp-emerald": "0 0 25px -4px rgba(0, 230, 118, 0.35), 0 0 10px -2px rgba(0, 230, 118, 0.25)",
        "neon-gp-crimson": "0 0 25px -4px rgba(255, 45, 85, 0.35), 0 0 10px -2px rgba(255, 45, 85, 0.25)",
        "card-hover": "0 12px 36px -10px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(63, 63, 70, 0.5)",
        "card-active": "0 14px 40px -10px rgba(0, 230, 118, 0.2), 0 0 0 1px rgba(0, 230, 118, 0.5)",
        "tray-dock": "0 -10px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(39, 39, 42, 0.8)",
      },
    },
  },
  plugins: [],
};

export default config;
