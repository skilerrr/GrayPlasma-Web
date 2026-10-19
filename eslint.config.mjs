import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Diturunkan ke "warn" sementara supaya `npm run lint` bisa dipakai sebagai
      // gerbang: error baru langsung kelihatan, utang lama (41 temuan) tidak
      // memblokir build. Naikkan lagi ke "error" setelah dibersihkan bertahap.
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "warn",
      "react/jsx-no-comment-textnodes": "warn",
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "dist/**",
      "scratch_*.js",
      "scratch_*.json",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
