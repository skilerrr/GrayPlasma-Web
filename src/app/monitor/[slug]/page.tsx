import type { Metadata } from "next";
import { MONITORS_DATA } from "@/data/monitors";
import { MonitorDetailClient } from "@/components/monitor-detail-client";

interface MonitorDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return MONITORS_DATA.map((monitor) => ({
    slug: monitor.slug,
  }));
}

export async function generateMetadata({
  params,
}: MonitorDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();

  const monitor = MONITORS_DATA.find((m) => {
    const s = m.slug.toLowerCase();
    const id = m.id.toLowerCase();
    const cleanSlug = decodedSlug.replace(/[^a-z0-9]/g, "");
    if (s === decodedSlug || id === decodedSlug || id === `mon-${decodedSlug}`) return true;
    if (s.replace(/[^a-z0-9]/g, "") === cleanSlug) return true;
    if (id.replace(/[^a-z0-9]/g, "") === cleanSlug) return true;
    if (m.model.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanSlug) return true;
    return false;
  });

  if (!monitor) {
    return {
      title: "Monitor Tidak Ditemukan",
      description: "Data spesifikasi monitor tidak ditemukan di katalog GrayPlasma.",
    };
  }

  const title = `${monitor.fullName} (${monitor.specs.display.refreshRate}Hz ${monitor.specs.display.panelType})`;
  const description = `Hasil pengujian lab GTID & kurasi GrayPlasma untuk ${monitor.fullName}. Harga Rp ${monitor.price.toLocaleString("id-ID")}, panel ${monitor.specs.display.panelType}, tier ${monitor.tier}.`;
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
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();

  const monitor =
    MONITORS_DATA.find((m) => {
      const s = m.slug.toLowerCase();
      const id = m.id.toLowerCase();
      const cleanSlug = decodedSlug.replace(/[^a-z0-9]/g, "");
      if (s === decodedSlug || id === decodedSlug || id === `mon-${decodedSlug}`) return true;
      if (s.replace(/[^a-z0-9]/g, "") === cleanSlug) return true;
      if (id.replace(/[^a-z0-9]/g, "") === cleanSlug) return true;
      if (m.model.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanSlug) return true;
      return false;
    }) || null;

  return (
    <MonitorDetailClient
      initialMonitor={monitor}
      initialMonitors={MONITORS_DATA}
      slug={slug}
    />
  );
}
