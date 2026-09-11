import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://grayplasma-web.vercel.app"
  ),
  title: {
    default: "GRAYPLASMA • Rekomendasi Monitor Indonesia",
    template: "%s | GRAYPLASMA",
  },
  description:
    "Katalog kurasi dan rekomendasi monitor gaming dan produktivitas terpercaya oleh GRAYPLASMAID. Data pengujian GTID, panduan spesifikasi, perbandingan aftersales distributor, dan harga termurah.",
  keywords: [
    "grayplasma rekomendasi monitor",
    "grayplasma monitor",
    "monitor gaming indonesia",
    "gtid monitor",
    "rekomendasi monitor budget",
    "monitor 180hz",
    "aoc 24g4",
    "xiaomi g24i",
    "alienware oled",
  ],
  authors: [{ name: "GrayPlasmaID" }],
  icons: {
    icon: "/icon",
    apple: "/icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="bg-black text-white antialiased min-h-screen font-sans">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
