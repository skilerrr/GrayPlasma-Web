import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GPLogo } from "@/components/gp-logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <GPLogo className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-4xl font-black uppercase tracking-tight">404 - Halaman Tidak Ditemukan</h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Halaman atau menu rekomendasi yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button variant="cyber" size="sm" className="font-bold text-xs">
              Kembali ke Rekomendasi Monitor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
