import { notFound } from "next/navigation";
import { isKnownCategoryRoute } from "@/lib/route-guard";

/**
 * Gerbang 404 untuk rute satu segmen (`/kategori-ngawur`, `/apalah`, dst).
 *
 * Dulu semua segmen yang nggak dikenal tetap balik HTTP 200 + halaman
 * placeholder "AKAN DILENGKAPI" — itu soft-404: Google nganggep halaman itu
 * valid, dan pengunjung lihat halaman kosong yang kelihatan resmi.
 *
 * Layout ini jalan di server, jadi status HTTP-nya benar-benar 404.
 */
export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!isKnownCategoryRoute(category)) {
    notFound();
  }

  return <>{children}</>;
}
