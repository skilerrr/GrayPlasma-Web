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
        background: "#000000",
        surface: {
          DEFAULT: "#09090b",
          dark: "#050505",
          elevated: "#121215",
          glass: "rgba(13, 13, 16, 0.75)",
        },
        border: {
          DEFAULT: "#27272a",
          subtle: "#18181b",
          glow: "#3f3f46",
        },
        accent: {
          emerald: "#10b981",
          emeraldGlow: "rgba(16, 185, 129, 0.2)",
          amber: "#f59e0b",
          amberGlow: "rgba(245, 158, 11, 0.2)",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
        },
        brand: {
          tokopedia: "#00AA5B",
          shopee: "#EE4D2D",
          blibli: "#0095DA",
        }
      },
      fontFamily: {
        sans: ["var(--font-metropolitan)", "var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["var(--font-metropolitan)", "var(--font-inter)", "sans-serif"],
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
          "100%": { borderColor: "rgba(16, 185, 129, 0.6)" },
        },
      },
      boxShadow: {
        "neon-emerald": "0 0 20px -3px rgba(16, 185, 129, 0.25), 0 0 8px -2px rgba(16, 185, 129, 0.2)",
        "neon-amber": "0 0 20px -3px rgba(245, 158, 11, 0.25), 0 0 8px -2px rgba(245, 158, 11, 0.2)",
        "card-hover": "0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(63, 63, 70, 0.4)",
        "card-active": "0 12px 35px -10px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.4)",
      }
    },
  },
  plugins: [],
};
export default config;
