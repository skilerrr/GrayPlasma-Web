import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MONITORS_DATA } from "@/data/monitors";
import { MonitorDetailClient } from "@/components/monitor-detail-client";
import { getMonitorsForDetailCached, findMonitorBySlug } from "@/lib/monitors-source";

interface MonitorDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Halaman detail sekarang ikut Supabase (bukan cuma MONITORS_DATA statis).
// Monitor baru yang ditambah lewat admin muncul paling lambat ~1 menit.
export const revalidate = 60;

export async function generateStaticParams() {
  return MONITORS_DATA.map((monitor) => ({
    slug: monitor.slug,
  }));
}

export async function generateMetadata({
  params,
}: MonitorDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const monitors = await getMonitorsForDetailCached();
  const monitor = findMonitorBySlug(monitors, slug);

  if (!monitor) {
    return {
      title: "Monitor Tidak Ditemukan",
      description: "Data spesifikasi monitor tidak ditemukan di katalog GrayPlasma.",
    };
  }

  const display = monitor.specs?.display;
  const specLabel = display
    ? ` (${display.refreshRate}Hz ${display.panelType})`
    : "";
  const title = `${monitor.fullName}${specLabel}`;
  const description = display
    ? `Hasil pengujian lab GrayPlasma & kurasi GrayPlasma untuk ${monitor.fullName}. Harga Rp ${monitor.price.toLocaleString("id-ID")}, panel ${display.panelType}, tier ${monitor.tier}.`
    : `Hasil pengujian lab GrayPlasma & kurasi GrayPlasma untuk ${monitor.fullName}. Harga Rp ${monitor.price.toLocaleString("id-ID")}, tier ${monitor.tier}.`;
  const ogImageUrl = `/api/og/monitor?slug=${encodeURIComponent(monitor.slug)}&format=landscape`;

  return {
    title,
    description,
    openGraph: {
      title: `${monitor.fullName} • Rekomendasi Monitor Indonesia`,
      description,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: monitor.fullName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${monitor.fullName} • Rekomendasi Monitor Indonesia`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function MonitorDetailPage({
  params,
}: MonitorDetailPageProps) {
  const { slug } = await params;

  const monitors = await getMonitorsForDetailCached();
  const monitor = findMonitorBySlug(monitors, slug);

  // Slug yang nggak ada di Supabase maupun data statis = 404 asli,
  // bukan halaman kosong dengan status 200.
  if (!monitor) notFound();

  return (
    <MonitorDetailClient
      initialMonitor={monitor}
      initialMonitors={monitors}
      slug={slug}
    />
  );
}
