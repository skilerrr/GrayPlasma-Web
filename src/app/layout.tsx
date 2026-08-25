import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const metropolitan = Montserrat({
  subsets: ["latin"],
  variable: "--font-metropolitan",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "GRAYPLASMA • Rekomendasi Monitor Indonesia",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${metropolitan.variable} dark`}>
      <body className="bg-black text-white antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
