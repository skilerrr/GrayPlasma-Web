"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Share2,
  Check,
  Copy,
  ExternalLink,
  ChevronDown,
  Package,
  SlidersHorizontal,
  Video,
} from "lucide-react";
import { MONITORS_DATA } from "@/data/monitors";
import { Monitor } from "@/types/monitor";
import { DatabaseService } from "@/lib/db-service";
import { Footer } from "@/components/footer";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { formatRupiah } from "@/lib/utils";
import { SubpageNavbar } from "@/components/subpage-navbar";

interface MonitorDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function MonitorDetailPage({ params }: MonitorDetailPageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [monitors, setMonitors] = useState<Monitor[]>(MONITORS_DATA);
  const [copiedDetails, setCopiedDetails] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const loadedMonitors = await DatabaseService.getMonitors();
        if (loadedMonitors && loadedMonitors.length > 0) {
          setMonitors(loadedMonitors);
        }
      } catch (e) {
        console.error("Failed to load monitors", e);
      }
    }
    load();
  }, []);

  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
  const monitor = monitors.find((m) => {
    const s = m.slug.toLowerCase();
    const id = m.id.toLowerCase();
    const cleanSlug = decodedSlug.replace(/[^a-z0-9]/g, "");
    if (s === decodedSlug || id === decodedSlug || id === `mon-${decodedSlug}`) return true;
    if (s.replace(/[^a-z0-9]/g, "") === cleanSlug) return true;
    if (id.replace(/[^a-z0-9]/g, "") === cleanSlug) return true;
    if (m.model.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanSlug) return true;
    return false;
  });

  const handleCopyDetails = () => {
    if (!monitor) return;
    const targetPrice = monitor.recommendedPrice ? ` (Target: ${formatRupiah(monitor.recommendedPrice)})` : "";
    const responseTime = monitor.responseTimeData?.toleranceNew || monitor.specs.display.responseTime || "-";
    const prosText = monitor.pros && monitor.pros.length > 0 ? monitor.pros.slice(0, 2).join(", ") : "-";
    const detailUrl = typeof window !== "undefined" ? window.location.href : "";

    const text = `[GRAYPLASMA] ${monitor.fullName} (${monitor.tier})
Kisaran Harga: ${formatRupiah(monitor.price)}${targetPrice}
Spesifikasi: ${monitor.specs.display.size} | ${monitor.specs.display.panelType} | ${monitor.specs.display.refreshRate}Hz | ${monitor.specs.display.resolution}
Response Time: ${responseTime}
Poin Utama: ${prosText}
Link Detail: ${detailUrl}`;

    navigator.clipboard.writeText(text);
    setCopiedDetails(true);
    setTimeout(() => setCopiedDetails(false), 2000);
  };

  const handleCopyUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  if (!monitor) {
    return (
      <div className="min-h-screen bg-[#191919] text-[#d4d4d4] flex flex-col font-sans">
        <div className="sticky top-0 z-30 bg-[#191919] border-b border-[#2a2a2a] px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/" className="text-[#9b9a97] hover:text-white flex items-center gap-1.5 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Utama</span>
          </Link>
        </div>
        <main className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 flex-1">
          <div className="text-4xl">🖥️</div>
          <h1 className="text-xl font-bold text-white">Monitor Tidak Ditemukan</h1>
          <p className="text-xs text-[#9b9a97]">
            Monitor dengan slug <code className="text-[#58a6ff]">{slug}</code> tidak terdaftar di database GrayPlasma.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#202020] border border-[#2f2f2f] text-xs font-semibold text-white hover:bg-[#252525] transition-colors"
          >
            ← Kembali ke Katalog Utama
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Front & Rear photos fallback
  const frontPhoto =
    monitor.frontImage ||
    monitor.thumbnail ||
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop";

  const rearPhoto =
    monitor.rearImage ||
    (monitor.gallery && monitor.gallery.length > 1 ? monitor.gallery[1] : null) ||
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop";

  const tokopediaLink = monitor.marketplaces?.find((m) => m.marketplace === "Tokopedia");
  const shopeeLink = monitor.marketplaces?.find((m) => m.marketplace === "Shopee");

  return (
    <div className="min-h-screen bg-[#191919] text-[#d4d4d4] flex flex-col font-sans selection:bg-[#2383e2] selection:text-white">
      {/* Unified Clean Subpage Navbar */}
      <SubpageNavbar
        breadcrumbs={[
          { label: "REKOMENDASI MONITOR", href: "/", icon: "🖥️" },
          { label: monitor.fullName, icon: "🏷️" },
        ]}
        backLink={{
          href: "/",
          label: "Kembali ke Katalog",
        }}
        rightActions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`/api/og/monitor?slug=${monitor.slug}&format=square`, "_blank")}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-gp-orange/15 border border-gp-orange/40 text-gp-orange hover:bg-gp-orange hover:text-black"
              title="Download poster ulasan infografis"
            >
              <span>Export Poster PNG</span>
            </button>

            <button
              onClick={handleCopyDetails}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border ${
                copiedDetails
                  ? "bg-[#203c2b] text-[#52ba69] border-[#52ba69]/40"
                  : "bg-[#202020] border-[#2f2f2f] text-zinc-300 hover:text-white hover:bg-[#282828]"
              }`}
            >
              {copiedDetails ? <Check className="w-3.5 h-3.5 text-[#52ba69]" /> : <Copy className="w-3.5 h-3.5 text-[#58a6ff]" />}
              <span className="hidden sm:inline">{copiedDetails ? "Tersalin!" : "Copy Details"}</span>
            </button>

            <button
              onClick={handleCopyUrl}
              className="p-2 rounded-xl bg-[#202020] border border-[#2f2f2f] text-zinc-400 hover:text-white hover:bg-[#282828] transition-colors"
              title="Salin URL"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-[#52ba69]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        }
      />

      {/* Main Full Page Notion Document */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 w-full space-y-6">
        {/* Title & Icon Header */}
        <div className="space-y-3">
          <div className="text-4xl">🖥️</div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {monitor.fullName}
          </h1>
        </div>

        {/* ========================================================================= */}
        {/* NOTION PROPERTY TABLE (EXACT MATCH 21 PROPERTIES)                         */}
        {/* ========================================================================= */}
        <div className="space-y-1.5 text-xs border-y border-[#2a2a2a] py-3 text-[#9b9a97]">
          {/* 1. Kisaran Harga */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Kisaran Harga</span>
            <span className="col-span-8 font-mono font-bold text-white text-[11px]">
              IDR {monitor.price.toLocaleString("en-US")}
            </span>
          </div>

          {/* 2. Aspect Ratio */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Aspect Ratio</span>
            <div className="col-span-8">
              <span className="px-2 py-0.5 rounded bg-[#1d354a] text-[#58a6ff] text-[11px] font-medium">
                {monitor.aspectRatio || "16:9 (Wide)"}
              </span>
            </div>
          </div>

          {/* 3. Curvature */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Curvature</span>
            <div className="col-span-8">
              <span className="px-2 py-0.5 rounded bg-[#442224] text-[#eb5757] text-[11px] font-medium">
                {monitor.curvature || monitor.specs?.display?.curvature || "None"}
              </span>
            </div>
          </div>

          {/* 4. Display Input */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Display Input</span>
            <div className="col-span-8 flex items-center gap-1.5 flex-wrap">
              {(monitor.displayInputs && monitor.displayInputs.length > 0) ? (
                monitor.displayInputs.map((input, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      idx === 0
                        ? "bg-[#203c2b] text-[#52ba69]"
                        : "bg-[#3b2344] text-[#d157eb]"
                    }`}
                  >
                    {input}
                  </span>
                ))
              ) : (
                <>
                  <span className="px-2 py-0.5 rounded bg-[#203c2b] text-[#52ba69] text-[11px] font-medium">
                    HDMI 1.4
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#3b2344] text-[#d157eb] text-[11px] font-medium">
                    HDMI 2.0
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 5. Panel Bit Depth */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Panel Bit Depth</span>
            <div className="col-span-8">
              <span className="px-2 py-0.5 rounded bg-[#2f2f2f] text-[#d4d4d4] text-[11px] font-medium">
                {monitor.panelBitDepth || "8 Bit"}
              </span>
            </div>
          </div>

          {/* 6. Panel Size */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Panel Size</span>
            <div className="col-span-8">
              <span className="px-2 py-0.5 rounded bg-[#442c1d] text-[#e07936] text-[11px] font-medium">
                {monitor.specs?.display?.size || "24 Inch or 23.8 Inch"}
              </span>
            </div>
          </div>

          {/* 7. Panel Type */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Panel Type</span>
            <div className="col-span-8">
              <span className="px-2 py-0.5 rounded bg-[#2f2f2f] text-[#d4d4d4] text-[11px] font-medium">
                {monitor.specs?.display?.panelType || "IPS"}
              </span>
            </div>
          </div>

          {/* 8. Refresh Rate */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Refresh Rate</span>
            <div className="col-span-8">
              <span className="px-2 py-0.5 rounded bg-[#203c2b] text-[#52ba69] text-[11px] font-medium font-mono">
                {monitor.specs?.display?.refreshRate || 180}Hz
              </span>
            </div>
          </div>

          {/* 9. Resolution (Pixel) */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Resolution (Pixel)</span>
            <div className="col-span-8">
              <span className="px-2 py-0.5 rounded bg-[#442224] text-[#eb5757] text-[11px] font-medium">
                {monitor.specs?.display?.resolution || "1920x1080 (FHD)"}
              </span>
            </div>
          </div>

          {/* 10. Stand Capability */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Stand Capability</span>
            <div className="col-span-8">
              <span className="px-2 py-0.5 rounded bg-[#2f2f2f] text-[#d4d4d4] text-[11px] font-medium">
                {monitor.standCapability || (monitor.specs?.ergonomics?.heightAdjustable ? "HAS (Height, Tilt, Swivel, Pivot)" : "Tilt")}
              </span>
            </div>
          </div>

          {/* 11. USB Hub */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">USB Hub</span>
            <div className="col-span-8">
              <span className="px-2 py-0.5 rounded bg-[#2f2f2f] text-[#d4d4d4] text-[11px] font-medium">
                {monitor.usbHub || monitor.specs?.connectivity?.usbHub || "None"}
              </span>
            </div>
          </div>

          {/* 12. Market Class */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Market Class</span>
            <div className="col-span-8">
              <span className="px-2 py-0.5 rounded bg-[#203c2b] text-[#52ba69] text-[11px] font-medium">
                {monitor.marketClass || (monitor.specs?.display?.refreshRate && monitor.specs.display.refreshRate >= 144 ? "144Hz+" : "100Hz")}
              </span>
            </div>
          </div>

          {/* 13. VESA Mount */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">VESA Mount</span>
            <div className="col-span-8">
              <span className="px-2 py-0.5 rounded bg-[#2f2f2f] text-[#d4d4d4] text-[11px] font-medium">
                {monitor.specs?.ergonomics?.vesaMount || "75x75 mm"}
              </span>
            </div>
          </div>

          {/* 14. Data Response Time */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Data Response Time</span>
            <div className="col-span-8 flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-[#203c2b] text-[#52ba69] text-[11px] font-medium">
                Toleransi Baru
              </span>
              <span className="px-2 py-0.5 rounded bg-[#442224] text-[#eb5757] text-[11px] font-medium">
                Toleransi Lama
              </span>
            </div>
          </div>

          {/* 15. Date Created */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Date Created</span>
            <span className="col-span-8 font-bold text-[#d4d4d4] text-[11px]">
              {monitor.createdDateText || "February 24, 2025 12:24"}
            </span>
          </div>

          {/* 16. LINK TIKTOKSHOP */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">LINK TIKTOKSHOP</span>
            <div className="col-span-8">
              {monitor.linkTiktokShop ? (
                <a href={monitor.linkTiktokShop} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline font-mono text-[11px] inline-flex items-center gap-1">
                  <span>{monitor.linkTiktokShop}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[#787774] italic text-[11px]">Empty</span>
              )}
            </div>
          </div>

          {/* 17. Last Updated */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Last Updated</span>
            <span className="col-span-8 font-bold text-[#d4d4d4] text-[11px]">
              {monitor.lastUpdatedDate || "June 24, 2025"}
            </span>
          </div>

          {/* 18. Link Shopee */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Link Shopee</span>
            <div className="col-span-8">
              {(monitor.linkShopee || shopeeLink?.url) ? (
                <a
                  href={monitor.linkShopee || shopeeLink?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#58a6ff] hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                >
                  <span>{monitor.linkShopee || shopeeLink?.url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[#787774] italic text-[11px]">Empty</span>
              )}
            </div>
          </div>

          {/* 19. LINK TOKOPEDIA */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">LINK TOKOPEDIA</span>
            <div className="col-span-8">
              {(monitor.linkTokopedia || tokopediaLink?.url) ? (
                <a
                  href={monitor.linkTokopedia || tokopediaLink?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#58a6ff] hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                >
                  <span>{monitor.linkTokopedia || tokopediaLink?.url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[#787774] italic text-[11px]">Empty</span>
              )}
            </div>
          </div>

          {/* 20. Tiktok Shop */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">Tiktok Shop</span>
            <div className="col-span-8">
              {monitor.linkTiktokShop ? (
                <a href={monitor.linkTiktokShop} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline font-mono text-[11px] inline-flex items-center gap-1">
                  <span>{monitor.linkTiktokShop}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[#787774] italic text-[11px]">Empty</span>
              )}
            </div>
          </div>

          {/* 21. STATUS */}
          <div className="grid grid-cols-12 items-center gap-2 py-0.5">
            <span className="col-span-4 text-[#787774] font-medium">STATUS</span>
            <div className="col-span-8">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                monitor.tier === "S-TIER"
                  ? "bg-[#203c2b] text-[#52ba69]"
                  : monitor.tier === "BEST VALUE"
                  ? "bg-[#1d354a] text-[#58a6ff]"
                  : monitor.tier === "RECOMMENDED"
                  ? "bg-[#203c2b] text-[#52ba69]"
                  : "bg-[#442224] text-[#eb5757]"
              }`}>
                {monitor.tier}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION FOTO MONITOR (SIDE-BY-SIDE GALLERY)                               */}
        {/* ========================================================================= */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[11px] text-[#787774] uppercase tracking-wider font-semibold">
            <span>Section Foto Monitor (Tampak Depan & Belakang)</span>
            <span className="text-[10px] text-[#58a6ff]">2 Sudut Foto</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Front Photo */}
            <div
              className="group relative aspect-[4/3] rounded-2xl bg-[#202020] border border-[#2f2f2f] hover:border-[#3f3f3f] overflow-hidden transition-all cursor-pointer shadow-sm"
              onClick={() => setSelectedPhoto(frontPhoto)}
            >
              <Image
                src={frontPhoto}
                alt={`${monitor.fullName} - Tampak Depan`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                Depan
              </div>
            </div>

            {/* Rear Photo */}
            <div
              className="group relative aspect-[4/3] rounded-2xl bg-[#202020] border border-[#2f2f2f] hover:border-[#3f3f3f] overflow-hidden transition-all cursor-pointer shadow-sm"
              onClick={() => setSelectedPhoto(rearPhoto)}
            >
              <Image
                src={rearPhoto}
                alt={`${monitor.fullName} - Tampak Belakang`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                Belakang
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VERDICT / WARNING BANNER                                                  */}
        {/* ========================================================================= */}
        {monitor.statusReason ? (
          <div className="p-3.5 rounded-xl bg-[#371e20] border border-[#492224] text-[#eb5757] font-bold text-xs uppercase tracking-wide">
            {monitor.statusReason}
          </div>
        ) : monitor.tier === "PASS" ? (
          <div className="p-3.5 rounded-xl bg-[#371e20] border border-[#492224] text-[#eb5757] font-bold text-xs uppercase tracking-wide">
            TIDAK DISARANKAN LAGI KARENA BANYAK KASUS BERGARIS + DISCONTINUE
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-[#193222] border border-[#203c2b] text-[#52ba69] font-bold text-xs uppercase tracking-wide">
            REKOMENDASI TERBAIK KELAS {monitor.specs.display.resolution} {monitor.specs.display.refreshRate}Hz
          </div>
        )}

        {/* ========================================================================= */}
        {/* PENDAHULUAN & REVIEW NARRATIVE                                            */}
        {/* ========================================================================= */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Pendahuluan
          </h2>

          <p className="text-sm text-[#d4d4d4] leading-relaxed">
            {monitor.introduction ||
              monitor.deepDiveDescription ||
              `${monitor.fullName} merupakan monitor ${monitor.specs.display.size}, ${monitor.specs.display.panelType} ${monitor.specs.display.refreshRate}Hz yang sangat kompetitif di kisaran harga ${formatRupiah(monitor.price)} di pasar Indonesia. Memiliki tuning overdrive yang matang dari pengujian laboratorium GTID Tech.`}
          </p>

          {/* YouTube Embed Card with On-Click Player */}
          <div className="pt-3">
            <YouTubeEmbed
              url={monitor.gtidReviewUrl}
              title={`Review & Ulasan Pengujian GTID: ${monitor.fullName}`}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROS & CONS                                                               */}
        {/* ========================================================================= */}
        <div className="space-y-4 pt-2">
          {/* PROS */}
          <div className="space-y-2">
            <div className="w-full py-1.5 px-3 rounded bg-[#193222] border border-[#203c2b] text-[#52ba69] font-bold text-xs tracking-wider uppercase">
              PROS
            </div>
            <ul className="space-y-1.5 pl-2 text-xs text-[#d4d4d4]">
              {monitor.pros.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#52ba69] mt-0.5">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CONS */}
          <div className="space-y-2 pt-2">
            <div className="w-full py-1.5 px-3 rounded bg-[#371e20] border border-[#492224] text-[#eb5757] font-bold text-xs tracking-wider uppercase">
              CONS
            </div>
            <ul className="space-y-1.5 pl-2 text-xs text-[#d4d4d4]">
              {monitor.cons.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#eb5757] mt-0.5">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KELENGKAPAN BOX                                                           */}
        {/* ========================================================================= */}
        {monitor.accessoriesIncluded && monitor.accessoriesIncluded.length > 0 && (
          <div className="p-5 rounded-2xl bg-[#202020] border border-[#2f2f2f] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <Package className="w-4 h-4 text-[#58a6ff]" />
              <span>Kelengkapan Dalam Dus:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[#b4b4b4]">
              {monitor.accessoriesIncluded.map((acc, i) => (
                <li key={i}>{acc}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SPESIFIKASI TEKNIS                                                        */}
        {/* ========================================================================= */}
        <div className="p-6 rounded-2xl bg-[#202020] border border-[#2f2f2f] space-y-4 text-xs">
          <h3 className="font-bold text-white text-sm">
            📋 Spesifikasi Teknis Lengkap
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#191919] border border-[#2a2a2a]">
              <strong className="text-[#9b9a97] block text-[10px] uppercase">Ukuran Layar:</strong>
              <span className="font-semibold text-white mt-0.5 block">{monitor.specs.display.size}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#191919] border border-[#2a2a2a]">
              <strong className="text-[#9b9a97] block text-[10px] uppercase">Resolusi:</strong>
              <span className="font-semibold text-white mt-0.5 block">{monitor.specs.display.resolution}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#191919] border border-[#2a2a2a]">
              <strong className="text-[#9b9a97] block text-[10px] uppercase">Tipe Panel:</strong>
              <span className="font-semibold text-white mt-0.5 block">{monitor.specs.display.panelType}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#191919] border border-[#2a2a2a]">
              <strong className="text-[#9b9a97] block text-[10px] uppercase">Refresh Rate:</strong>
              <span className="font-semibold text-white mt-0.5 block">{monitor.specs.display.refreshRate}Hz</span>
            </div>
            <div className="p-3 rounded-xl bg-[#191919] border border-[#2a2a2a]">
              <strong className="text-[#9b9a97] block text-[10px] uppercase">VESA Mount:</strong>
              <span className="font-semibold text-white mt-0.5 block">{monitor.specs.ergonomics.vesaMount}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#191919] border border-[#2a2a2a]">
              <strong className="text-[#9b9a97] block text-[10px] uppercase">Garansi Brand:</strong>
              <span className="font-semibold text-white mt-0.5 block">{monitor.specs.features.warranty}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-[600px]">
            <Image
              src={selectedPhoto}
              alt="Preview Full Photo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
