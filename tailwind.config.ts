import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // src/lib & src/data menyimpan string className (mis. field `color` di
    // db-service.ts) yang dirender lewat template -> wajib ikut di-scan,
    // kalau tidak kelasnya tidak pernah jadi CSS.
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Class yang disimpan di DATABASE (bukan di source) tidak bisa di-detect
  // Tailwind karena tidak muncul di file mana pun. Akibatnya class seperti
  // `hover:border-[#52ba69] text-[#52ba69]` -> TIDAK pernah jadi CSS, dan
  // kustomisasi warna dari admin diam-diam mati.
  //
  // Fix: (1) admin hanya boleh menyimpan class dari daftar aman di bawah,
  //      (2) daftar itu di-safelist-kan supaya Pasti ter-generate.
  safelist: [
    // Aksen mint
    "hover:border-gp-mint-50",
    "text-gp-mint-50",
    "hover:bg-gp-mint-50",
    "border-gp-mint-50",
    "bg-gp-mint-50",
    "group-hover:text-gp-mint-50",
    // Aksen sky
    "hover:border-gp-sky",
    "text-gp-sky",
    "hover:bg-gp-sky",
    "border-gp-sky",
    "bg-gp-sky",
    "group-hover:text-gp-sky",
    // Aksen ember
    "hover:border-gp-ember-50",
    "text-gp-ember-50",
    "hover:bg-gp-ember-50",
    "border-gp-ember-50",
    "bg-gp-ember-50",
    "group-hover:text-gp-ember-50",
    // Aksen coral
    "hover:border-gp-coral-50",
    "text-gp-coral-50",
    "hover:bg-gp-coral-50",
    "border-gp-coral-50",
    "bg-gp-coral-50",
    "group-hover:text-gp-coral-50",
    // Aksen violet
    "hover:border-gp-violet",
    "text-gp-violet",
    "hover:bg-gp-violet",
    "border-gp-violet",
    "bg-gp-violet",
    "group-hover:text-gp-violet",
  ],
  theme: {
    extend: {
      screens: {
        // Breakpoint ekstra: di bawah 400px layar terlalu sempit untuk
        // wordmark + search bar berdampingan tanpa overflow.
        xs: "400px",
      },
      colors: {
        background: "rgb(var(--gp-background) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--gp-surface) / <alpha-value>)",
          dark: "rgb(var(--gp-surface-dark) / <alpha-value>)",
          elevated: "rgb(var(--gp-surface-elevated) / <alpha-value>)",
          glass: "rgba(13, 13, 17, 0.85)",
          blueprint: "rgb(var(--gp-surface-blueprint) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--gp-border) / <alpha-value>)",
          subtle: "rgb(var(--gp-border-subtle) / <alpha-value>)",
          glow: "rgb(var(--gp-border-glow) / <alpha-value>)",
          blueprint: "rgb(var(--gp-border-blueprint) / <alpha-value>)",
        },
        /* ==========================================================
         * DESIGN TOKENS — semua warna membaca CSS custom property
         * yang sama didefinisikan di src/app/globals.css (:root).
         * Ubah warna di globals.css -> seluruh situs berubah.
         * ========================================================== */
        gp: {
          bg: "rgb(var(--gp-bg) / <alpha-value>)",
          blueprint: "rgb(var(--gp-blueprint) / <alpha-value>)",
          blueprintCard: "rgb(var(--gp-blueprint-card) / <alpha-value>)",
          blueprintGrid: "rgb(var(--gp-blueprint-grid) / <alpha-value>)",
          orange: "rgb(var(--gp-orange) / <alpha-value>)",
          blue: "rgb(var(--gp-blue) / <alpha-value>)",
          emerald: "rgb(var(--gp-emerald) / <alpha-value>)",
          crimson: "rgb(var(--gp-crimson) / <alpha-value>)",
          amber: "rgb(var(--gp-amber) / <alpha-value>)",
          cyan: "rgb(var(--gp-cyan) / <alpha-value>)",
          paper: "rgb(var(--gp-paper) / <alpha-value>)",
          paperGrid: "rgb(var(--gp-paper-grid) / <alpha-value>)",
          paperInk: "rgb(var(--gp-paper-ink) / <alpha-value>)",
          orangeGlow: "rgba(255, 87, 34, 0.25)",
          blueGlow: "rgba(0, 136, 255, 0.25)",
          emeraldGlow: "rgba(0, 230, 118, 0.25)",
          crimsonGlow: "rgba(255, 45, 85, 0.25)",

          /* Netral: teks terang -> permukaan/border gelap */
          ink: {
            50: "rgb(var(--gp-ink-50) / <alpha-value>)",
            100: "rgb(var(--gp-ink-100) / <alpha-value>)",
            200: "rgb(var(--gp-ink-200) / <alpha-value>)",
            300: "rgb(var(--gp-ink-300) / <alpha-value>)",
            400: "rgb(var(--gp-ink-400) / <alpha-value>)",
            500: "rgb(var(--gp-ink-500) / <alpha-value>)",
            600: "rgb(var(--gp-ink-600) / <alpha-value>)",
            650: "rgb(var(--gp-ink-650) / <alpha-value>)",
            700: "rgb(var(--gp-ink-700) / <alpha-value>)",
            750: "rgb(var(--gp-ink-750) / <alpha-value>)",
            800: "rgb(var(--gp-ink-800) / <alpha-value>)",
            850: "rgb(var(--gp-ink-850) / <alpha-value>)",
            900: "rgb(var(--gp-ink-900) / <alpha-value>)",
            950: "rgb(var(--gp-ink-950) / <alpha-value>)",
            998: "rgb(var(--gp-ink-998) / <alpha-value>)",
          },

          /* Aksen mint */
          mint: {
            DEFAULT: "rgb(var(--gp-mint) / <alpha-value>)",
            50: "rgb(var(--gp-mint-50) / <alpha-value>)",
            200: "rgb(var(--gp-mint-200) / <alpha-value>)",
            300: "rgb(var(--gp-mint-300) / <alpha-value>)",
            400: "rgb(var(--gp-mint-400) / <alpha-value>)",
            500: "rgb(var(--gp-mint-500) / <alpha-value>)",
            600: "rgb(var(--gp-mint-600) / <alpha-value>)",
            700: "rgb(var(--gp-mint-700) / <alpha-value>)",
            800: "rgb(var(--gp-mint-800) / <alpha-value>)",
            900: "rgb(var(--gp-mint-900) / <alpha-value>)",
          },

          /* Aksen sky */
          sky: {
            DEFAULT: "rgb(var(--gp-sky) / <alpha-value>)",
            50: "rgb(var(--gp-sky-50) / <alpha-value>)",
            100: "rgb(var(--gp-sky-100) / <alpha-value>)",
            200: "rgb(var(--gp-sky-200) / <alpha-value>)",
            300: "rgb(var(--gp-sky-300) / <alpha-value>)",
            400: "rgb(var(--gp-sky-400) / <alpha-value>)",
            500: "rgb(var(--gp-sky-500) / <alpha-value>)",
            600: "rgb(var(--gp-sky-600) / <alpha-value>)",
            700: "rgb(var(--gp-sky-700) / <alpha-value>)",
            800: "rgb(var(--gp-sky-800) / <alpha-value>)",
          },

          /* Aksen coral */
          coral: {
            DEFAULT: "rgb(var(--gp-coral) / <alpha-value>)",
            25: "rgb(var(--gp-coral-25) / <alpha-value>)",
            50: "rgb(var(--gp-coral-50) / <alpha-value>)",
            100: "rgb(var(--gp-coral-100) / <alpha-value>)",
            200: "rgb(var(--gp-coral-200) / <alpha-value>)",
            300: "rgb(var(--gp-coral-300) / <alpha-value>)",
            400: "rgb(var(--gp-coral-400) / <alpha-value>)",
            500: "rgb(var(--gp-coral-500) / <alpha-value>)",
            600: "rgb(var(--gp-coral-600) / <alpha-value>)",
            700: "rgb(var(--gp-coral-700) / <alpha-value>)",
            800: "rgb(var(--gp-coral-800) / <alpha-value>)",
          },

          /* Aksen ember */
          ember: {
            DEFAULT: "rgb(var(--gp-ember) / <alpha-value>)",
            50: "rgb(var(--gp-ember-50) / <alpha-value>)",
            100: "rgb(var(--gp-ember-100) / <alpha-value>)",
            200: "rgb(var(--gp-ember-200) / <alpha-value>)",
            300: "rgb(var(--gp-ember-300) / <alpha-value>)",
            400: "rgb(var(--gp-ember-400) / <alpha-value>)",
            500: "rgb(var(--gp-ember-500) / <alpha-value>)",
          },

          /* Aksen violet */
          violet: {
            DEFAULT: "rgb(var(--gp-violet) / <alpha-value>)",
            200: "rgb(var(--gp-violet-200) / <alpha-value>)",
            300: "rgb(var(--gp-violet-300) / <alpha-value>)",
            400: "rgb(var(--gp-violet-400) / <alpha-value>)",
            500: "rgb(var(--gp-violet-500) / <alpha-value>)",
          },
        },
        accent: {
          emerald: "rgb(var(--gp-accent-emerald) / <alpha-value>)",
          amber: "rgb(var(--gp-accent-amber) / <alpha-value>)",
          cyan: "rgb(var(--gp-accent-cyan) / <alpha-value>)",
          violet: "rgb(var(--gp-accent-violet) / <alpha-value>)",
          crimson: "rgb(var(--gp-accent-crimson) / <alpha-value>)",
          orange: "rgb(var(--gp-accent-orange) / <alpha-value>)",
        },
        brand: {
          "tokopedia": "rgb(var(--gp-brand-tokopedia) / <alpha-value>)",
          "shopee": "rgb(var(--gp-brand-shopee) / <alpha-value>)",
          "blibli": "rgb(var(--gp-brand-blibli) / <alpha-value>)",
          "tokopedia-alt": "rgb(var(--gp-brand-tokopedia-alt) / <alpha-value>)",
          "shopee-dark": "rgb(var(--gp-brand-shopee-dark) / <alpha-value>)",
          "youtube": "rgb(var(--gp-brand-youtube) / <alpha-value>)",
        },
      },
      fontSize: {
        // Tanpa line-height eksplisit -> identik dengan text-[Npx] lama.
        "4xs": "0.5625rem",
        "3xs": "0.625rem",
        "2xs": "0.6875rem",
      },
      fontFamily: {
        sans: ["Metropolis", "var(--font-metropolis)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["Metropolis", "var(--font-metropolis)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
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
        "tech-subtle": "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
        "tech-card": "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
        "card-hover": "0 8px 30px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(63, 63, 70, 0.4)",
        "card-active": "0 8px 30px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(16, 185, 129, 0.4)",
        "tray-dock": "0 -8px 32px -4px rgba(0, 0, 0, 0.85), 0 -1px 0 0 rgba(39, 39, 42, 0.8)",
        "neon-gp-orange": "0 1px 3px 0 rgba(0, 0, 0, 0.5)",
        "neon-gp-emerald": "0 1px 3px 0 rgba(0, 0, 0, 0.5)",
        "neon-gp-blue": "0 1px 3px 0 rgba(0, 0, 0, 0.5)",
        "neon-gp-crimson": "0 1px 3px 0 rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
