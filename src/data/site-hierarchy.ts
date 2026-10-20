import { SiteHierarchyNode, SiteCategoryGroup } from "@/types/site-hierarchy";

export const DEFAULT_SITE_HIERARCHY: SiteHierarchyNode[] = [
  {
    id: "guide-sdr-glossary",
    title: "HOW TO READ GrayPlasma GLOSSARY (SDR)",
    slug: "glossary",
    fullPath: "/guide/sdr/glossary",
    category: "SDR & Kalibrasi Warna",
    icon: "BookOpen",
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    description: "Panduan lengkap membaca deITP, Delta E, Color Gamut sRGB vs DCI-P3, Contrast Ratio, dan Response Time GrayPlasma.",
    contentMarkdown: `# HOW TO READ GrayPlasma GLOSSARY (SDR)

> Panduan Lengkap Cara Membaca Data Pengetesan Warna, Contrast, & Response Time Laboratorium GrayPlasma

---

## 1. Standar Akurasi Warna: deITP vs de2000
Standar Data pengetesan GrayPlasma menggunakan **deITP (Delta E ITP)** yang mampu mendeteksi perbedaan akurasi warna di tingkat kecerahan sangat rendah (0.1 cd/m²).

- **Skor di bawah 5 deITP:** Dianggap akurat secara kasat mata bagi mata manusia.
- **Skor di atas 7 deITP:** Dianggap memiliki deviasi warna tampak, disarankan beralih ke profil kalibrasi OSD sRGB bawaan pabrik.

---

## 2. Color Space OSD (sRGB, DCI-P3, AdobeRGB)
- **OSD sRGB Akurat:** Paling ideal untuk Website Design, Social Media, dan Programming Frontend.
- **OSD D65-P3 / DCI-P3 Akurat:** Ideal untuk Video Editing, YouTube, dan konten smartphone modern.
- **OSD AdobeRGB:** Ideal untuk Desain Percetakan / Printing Offset.
- **BT 2020:** Ditujukan untuk Content Consumption (menonton film & gaming HDR).

---

## 3. Contrast Ratio & Response Time
- **Ideal IPS:** 1000:1 s/d 1300:1 (Contrast tinggi membuat warna hitam lebih pekat).
- **Overdrive Setting:** Hindari level *Extreme/Fastest* karena akan memicu Inverse Ghosting (overshoot corona putih). Gunakan level *Medium* atau *Fast*.`,
    onClickAction: "route",
    tags: ["Glossary", "deITP", "sRGB", "DCI-P3", "Response Time"],
    order: 1,
    isPublished: true,
    discordCallbackSummary: "📄 Panduan Cara Baca Glosarium GrayPlasma: Nilai deITP < 5 = Akurat. Gunakan OSD sRGB untuk konten web/editing standar. Link: https://grayplasma.id/guide/sdr/glossary",
    updatedAt: "2026-08-25"
  },
  {
    id: "guide-d65-p3-undersaturated",
    title: "Akurat di D65-P3 tapi kok Undersaturated di D65-P3?",
    slug: "akurasi-d65-p3",
    fullPath: "/guide/warna/akurasi-d65-p3",
    category: "SDR & Kalibrasi Warna",
    icon: "Sparkles",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    description: "Penjelasan mengapa sebuah monitor bisa memiliki nilai Delta E rendah namun tetap kehilangan saturasi warna di ujung spektrum Rec.2020.",
    contentMarkdown: `# Akurat di D65-P3 tapi kok Undersaturated di D65-P3?

> Mengapa monitor bisa akurat secara Delta E namun tetap kehilangan saturasi warna di ujung spektrum?

Yap benar, ini bisa saja terjadi! Hal ini terbukti pada monitor seperti **H24G30F 180Hz** dan **MSI MAG 245F X24** yang sudah GrayPlasma uji.

## Mengapa hal ini bisa terjadi?
Skyworth memiliki **~62% Rec. 2020**, sehingga terdapat sekitar **~8-10% kehilangan Warna P3 di ujung Spektrum Warna**.
Sedangkan pada **MSI MAG 245F X24**, di ujung spektrum warna sedikit lebih terbatas dibanding H24G30F 180Hz, yakni hanya **~59% Rec. 2020**.

## Kesimpulan Pengujian:
> **Warna yang bisa dicakup oleh panel akan tetap akurat**, namun hanya pada bagian spektrum yang sanggup dicapai oleh hardware panel tersebut. Jika ada hal yang kurang jelas, selalu tanyakan ke Joel Gray sebelum checkout!`,
    onClickAction: "side-panel",
    tags: ["D65-P3", "Rec.2020", "MSI 245F", "Skyworth", "Gamut Coverage"],
    order: 2,
    isPublished: true,
    discordCallbackSummary: "🎯 Penjelasan D65-P3 Undersaturated: Panel tetap akurat pada gamut yang sanggup dicapai (~59-62% Rec.2020), namun kehilangan warna di ujung spektrum terluar. Link: https://grayplasma.id/guide/warna/akurasi-d65-p3",
    updatedAt: "2026-08-25"
  },
  {
    id: "guide-brand-odm",
    title: "BRAND ODM LAYAK DIBELI?",
    slug: "odm-layak-dibeli",
    fullPath: "/guide/brand/odm-layak-dibeli",
    category: "Brand & Aftersales",
    icon: "AlertTriangle",
    coverImage: "https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=1200&auto=format&fit=crop",
    description: "Edukasi mengenai monitor hasil rebrand OEM/ODM di pasar Indonesia dan risiko firmware generik.",
    contentMarkdown: `# BRAND ODM LAYAK DIBELI?

> Mengupas sistem manufaktur ODM (Original Design Manufacturer) di monitor gaming Indonesia.

## Apa itu Monitor ODM?
ODM adalah pabrik manufaktur pihak ketiga di China yang memproduksi monitor secara massal, kemudian ditempelkan logo brand lokal atau brand baru.

## Kelemahan Utama Monitor ODM:
1. **Firmware OSD Generik:** Overdrive tidak dikalibrasi sesuai sifat sub-pixel panel, sehingga rawan *inverse ghosting* atau *black smearing*.
2. **Kualitas Backlight & Komponen Daya:** Modul power supply internal seringkali disederhanakan untuk menekan harga jual.
3. **Lama Waktu Klaim Garansi:** Jika terjadi kerusakan garis layar, suku cadang sering harus menunggu inden kontainer dari luar negeri.

## Rekomendasi GrayPlasma:
> Jika memilih monitor ODM karena keterbatasan anggaran, utamakan brand yang menyediakan garansi ganti unit 3 tahun dan sudah lolos pengetesan Response Time GrayPlasma.`,
    onClickAction: "route",
    tags: ["ODM", "OEM", "Kualitas", "Firmware", "Garansi"],
    order: 3,
    isPublished: true,
    discordCallbackSummary: "⚠️ Panduan Monitor ODM/OEM: Waspadai firmware overdrive generik dan masa inden RMA. Cek list brand aman di: https://grayplasma.id/guide/brand/odm-layak-dibeli",
    updatedAt: "2026-08-25"
  },
  {
    id: "guide-aftersales-tier",
    title: "LIST AFTERSALES (BRAND MONITOR OEM)",
    slug: "aftersales-rma",
    fullPath: "/guide/brand/aftersales-rma",
    category: "Brand & Aftersales",
    icon: "ShieldAlert",
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
    description: "Rating dan rekam jejak aftersales brand monitor di Indonesia: Xiaomi, ASUS, MSI, Dell, Skyworth, Gigabyte, ViewSonic, AOC.",
    contentMarkdown: `# LIST AFTERSALES (BRAND MONITOR OEM)

AKAN DILENGKAPI

CATATAN :
- PENULIS TIDAK BERTANGGUNG JAWAB JIKA BRAND ANDA TERSINGGUNG DENGAN TULISAN DIBAWAH`,
    onClickAction: "route",
    tags: ["Aftersales", "Garansi", "RMA", "Dell", "LG", "ASUS", "Xiaomi"],
    order: 4,
    isPublished: true,
    discordCallbackSummary: "🛡️ Database Aftersales Brand Monitor: Dell Onsite S-Tier, ASUS/ViewSonic Garansi 3 Tahun, Xiaomi Tukar Unit. Cek rincian di: https://grayplasma.id/guide/brand/aftersales-rma",
    updatedAt: "2026-08-25"
  },
  {
    id: "guide-display-bandwidth",
    title: "BANDWIDTH GUIDANCE: HDMI 2.0 vs 2.1 vs DisplayPort 1.4/2.1",
    slug: "bandwidth-dp-hdmi",
    fullPath: "/guide/display/bandwidth-dp-hdmi",
    category: "Konektivitas & Bandwidth",
    icon: "SlidersHorizontal",
    coverImage: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=1200&auto=format&fit=crop",
    description: "Kenapa monitor 1440p 180Hz turun ke 144Hz atau warna turun ke 8-bit saat memakai kabel HDMI 2.0 bawaan.",
    contentMarkdown: `# BANDWIDTH GUIDANCE: HDMI 2.0 vs 2.1 vs DisplayPort 1.4/2.1

AKAN DILENGKAPI

CATATAN :
- PENULIS TIDAK BERTANGGUNG JAWAB JIKA BRAND ANDA TERSINGGUNG DENGAN TULISAN DIBAWAH
- Kenapa monitor 1440p 180Hz turun ke 144Hz atau warna turun ke 8-bit saat memakai kabel HDMI 2.0 bawaan.

---

## Bandwidth Kabel Display: Mengapa Kabel Sangat Menentukan?

Banyak pengguna monitor 1440p 180Hz–240Hz mengalami masalah refresh rate terkunci atau warna turun menjadi 8-bit YCbCr 4:2:2 akibat salah menggunakan port atau kabel.

### 1. HDMI 2.0 (Bandwidth: 18.0 Gbps | Data: 14.4 Gbps)
- **Maksimal:** 1080p 240Hz / 1440p 144Hz 8-bit SDR.
- **Catatan:** Pada 1440p 180Hz, HDMI 2.0 tidak sanggup menjalankan 10-bit RGB penuh tanpa kompresi warna.

### 2. DisplayPort 1.4 HBR3 (Bandwidth: 32.4 Gbps | Data: 25.92 Gbps)
- **Maksimal:** 1440p 240Hz+ / 4K 120Hz Native (4K 240Hz via DSC).
- **Catatan:** Standar emas untuk PC gaming NVIDIA & AMD. Wajib dipakai agar fitur *G-Sync Compatible* aktif.

### 3. HDMI 2.1 FRL (Bandwidth: 48.0 Gbps | Data: 42.6 Gbps)
- **Maksimal:** 4K 144Hz+ Native / 8K 60Hz 10-bit / 12-bit Full RGB 4:4:4.

### 4. DisplayPort 2.1 UHBR (Bandwidth hingga 80 Gbps)
- Standar masa depan untuk monitor flagship OLED generasi terbaru tanpa perlu kompresi DSC.`,
    onClickAction: "route",
    tags: ["Bandwidth", "HDMI 2.0", "HDMI 2.1", "DisplayPort 1.4", "DisplayPort 2.1"],
    order: 5,
    isPublished: true,
    discordCallbackSummary: "🔌 Bandwidth Guidance: HDMI 2.0 mentok di 1440p 144Hz 8-bit. Untuk 1440p 180Hz 10-bit & G-Sync, WAJIB gunakan DisplayPort 1.4. Link: https://grayplasma.id/guide/display/bandwidth-dp-hdmi",
    updatedAt: "2026-08-25"
  },
  {
    id: "guide-oled-care",
    title: "PANDUAN LENGKAP OLED & REKOMENDASI BRAND",
    slug: "perawatan-burn-in",
    fullPath: "/guide/oled/perawatan-burn-in",
    category: "OLED & HDR Flagship",
    icon: "SunMedium",
    coverImage: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop",
    description: "Cara merawat panel QD-OLED / WOLED, mencegah burn-in, dan alasan mengapa hanya ASUS, MSI, dan Dell yang paling direkomendasikan.",
    contentMarkdown: `# PANDUAN LENGKAP OLED & REKOMENDASI BRAND

> Ketahanan panel QD-OLED Gen 3, penanganan burn-in, dan garansi resmi distributor.

## Mengapa OLED yang Paling Worth-It Hanya ASUS, MSI, dan DELL?
1. **Dell Alienware:** Garansi 3 tahun ProSupport Onsite NBD (Next Business Day) teknisi ke rumah + cakupan perlindungan Burn-in jelas tanpa syarat berbelit.
2. **ASUS ROG:** Menghadirkan Custom Heatsink graphene pendinginan pasif tanpa kipas bising + panel QD-OLED Gen 3 360Hz teruji.
3. **MSI MAG/MPG:** Menyertakan fitur OLED Care 2.0 (Pixel Shift, Panel Protect, Boundary Detection) serta harga paling kompetitif di kelasnya.

## 4 Tips Wajib Merawat Monitor OLED:
1. Aktifkan **Auto-hide Taskbar** pada Windows agar bilah tugas tidak diam statis di posisi yang sama berjam-jam.
2. Gunakan background Desktop bernuansa gelap murni (*OLED Pure Black #000000*) atau aktifkan Wallpaper Slideshow berkala.
3. **Jangan mencabut kabel power colokan listrik langsung** saat selesai digunakan. Biarkan monitor dalam mode Standby agar sistem otomatis menjalankan *Pixel Refresh* di latar belakang.
4. Gunakan browser dalam mode Dark Theme dan sembunyikan Bookmark Bar jika sering browsing seharian.`,
    onClickAction: "route",
    tags: ["OLED", "QD-OLED", "Burn-in", "Alienware", "ASUS ROG", "MSI"],
    order: 6,
    isPublished: true,
    discordCallbackSummary: "✨ Panduan OLED: Auto-hide taskbar + standby mode saat off untuk Pixel Refresh. Garansi burn-in terbaik: Dell Alienware & ASUS ROG. Link: https://grayplasma.id/guide/oled/perawatan-burn-in",
    updatedAt: "2026-08-25"
  },
  {
    id: "guide-setup-desk",
    title: "REKOMENDASI MEJA & BRACKET MONITOR ARM",
    slug: "meja-ergonomi",
    fullPath: "/guide/setup/meja-ergonomi",
    category: "Setup Meja & Ergonomi",
    icon: "LayoutGrid",
    coverImage: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1200&auto=format&fit=crop",
    description: "Kesesuaian kedalaman meja kerja (50cm vs 60cm vs 80cm) terhadap jarak pandang mata dan rekomendasi monitor arm North Bayou.",
    contentMarkdown: `# REKOMENDASI MEJA & BRACKET MONITOR ARM

> Panduan ergonomi jarak pandang mata, kedalaman meja kerja, dan pemilihan bracket gas-spring.

## 1. Meja Kedalaman 50cm (Kompak / Minimalis)
- **Jarak Pandang Ideal:** 45 - 55 cm
- **Ukuran Layar Maksimal:** **24 Inci**
- **Catatan:** Wajib gunakan monitor arm gas spring (North Bayou F80) agar kaki monitor bawaan tidak memakan ruang keyboard.

## 2. Meja Kedalaman 60cm (Standar Paling Ideal)
- **Jarak Pandang Ideal:** 55 - 70 cm
- **Ukuran Layar Sweetspot:** **24 Inci s/d 27 Inci (1440p / 1080p)**
- **Rekomendasi Arm:** North Bayou F80 / H100.

## 3. Meja Kedalaman 75 - 80cm (Meja Luas / Studio)
- **Jarak Pandang Ideal:** 75 - 90 cm
- **Ukuran Layar:** **27 Inci, 32 Inci 4K, atau 34 Inci Ultrawide 21:9**
- **Rekomendasi Arm:** North Bayou F100A (Beban berat hingga 12kg) atau Ergotron LX.`,
    onClickAction: "route",
    tags: ["Meja", "Monitor Arm", "North Bayou F80", "Ergonomi", "Jarak Pandang"],
    order: 7,
    isPublished: true,
    discordCallbackSummary: "🪑 Panduan Ukuran Meja vs Monitor: Meja 50cm maksimal 24\", meja 60cm sweetspot 27\" 1440p + arm gas spring F80. Link: https://grayplasma.id/guide/setup/meja-ergonomi",
    updatedAt: "2026-08-25"
  },
  {
    id: "guide-ukuran-meja-ideal",
    title: "UKURAN MEJA DAN MONITOR YANG IDEAL",
    slug: "ukuran-meja-monitor-ideal",
    fullPath: "/guide/setup/ukuran-meja-monitor-ideal",
    category: "Setup Meja & Ergonomi",
    icon: "Ruler",
    coverImage: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1200&auto=format&fit=crop",
    description: "Matriks ukuran meja (minimum cm vs ideal cm) untuk monitor 24 inci & 27 inci, laptop, serta penempatan PC di atas vs bawah meja.",
    contentMarkdown: `# UKURAN MEJA DAN MONITOR YANG IDEAL

> Panduan Matriks Dimensi Meja Kerja Berdasarkan Ukuran Layar Monitor & Penempatan PC

---

## 1. Matriks Gambaran Kasar (24 Inch)
- **1 Monitor + PC Di Bawah Meja:** Min 120 × 60 cm | Ideal **120 × 70 cm**
- **1 Monitor + PC Di Atas Meja:** Min 120 × 60 cm | Ideal **140 × 70 cm**
- **1 Monitor + Laptop:** Min 120 × 60 cm | Ideal **140 × 70 cm**
- **2 Monitor + Laptop:** Min 140 × 60 cm | Ideal **160 × 70 cm**
- **2 Monitor + PC Di Bawah Meja:** Min 120 × 60 cm | Ideal **140 × 70 cm**
- **2 Monitor + PC Di Atas Meja:** Min 140 × 60 cm | Ideal **160 × 70 cm**

---

## 2. Matriks Gambaran Kasar (27 Inch)
- **1 Monitor + PC Di Bawah Meja:** Min 120 × 70 cm | Ideal **140 × 70 cm**
- **1 Monitor + PC Di Atas Meja:** Min 140 × 70 cm | Ideal **140 × 70 cm**
- **1 Monitor + Laptop:** Min 140 × 70 cm | Ideal **140 × 70 cm**
- **2 Monitor + PC Di Atas Meja:** Min 140 × 70 cm | Ideal **160 × 70 cm**
- **2 Monitor + PC Di Bawah Meja:** Min 140 × 70 cm | Ideal **160 × 70 cm**
- **2 Monitor + Laptop:** Min 140 × 70 cm | Ideal **160 × 70 cm**`,
    onClickAction: "route",
    tags: ["Ukuran Meja", "24 Inch", "27 Inch", "Dual Monitor", "Ergonomi"],
    order: 8,
    isPublished: true,
    discordCallbackSummary: "📐 Panduan Ukuran Meja & Monitor Ideal: 24\" minimal 120x60 (ideal 140x70), 27\" minimal 140x70 (ideal 160x70). Link: https://grayplasma.id/guide/setup/ukuran-meja-monitor-ideal",
    updatedAt: "2026-08-26"
  },
  {
    id: "guide-rekomendasi-meja-kaki",
    title: "REKOMENDASI MEJA + KAKI",
    slug: "rekomendasi-meja",
    fullPath: "/catalog/desks",
    category: "Setup Meja & Ergonomi",
    icon: "LayoutGrid",
    coverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
    description: "Daftar 10 rekomendasi daun meja custom multiplek HPL, meja hollow standar, standing desk elektrik, dan meja nakas.",
    contentMarkdown: `# REKOMENDASI MEJA + KAKI

> Kurasi 10 Meja Kokoh Standar GrayPlasma (Tahan Jepit Monitor Arm)

Kunjungi halaman katalog meja di: [/catalog/desks](/catalog/desks)`,
    onClickAction: "route",
    tags: ["Meja", "Daun Meja", "Standing Desk", "Meja Hollow", "Meja Nakas"],
    order: 9,
    isPublished: true,
    discordCallbackSummary: "🪑 Rekomendasi Meja + Kaki: 10 pilihan daun meja multiplek HPL & standing desk elektrik tahan jepit arm. Link: https://grayplasma.id/catalog/desks",
    updatedAt: "2026-08-26"
  },

  // ==========================================
  // INDIVIDUAL FAQ NOTION PAGES (DEDICATED)
  // ==========================================
  {
    id: "faq-build-quality",
    title: "BUILD QUALITY PANEL NGARUH(?)",
    slug: "build-quality-panel",
    fullPath: "/guide/faq/build-quality-panel",
    category: "FAQ & Glosarium",
    icon: "HelpCircle",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    description: "Pengaruh ketebalan lapisan polarizer, kualitas lem panel, dan modul backlight terhadap umur pakai monitor.",
    contentMarkdown: `# BUILD QUALITY PANEL NGARUH(?)

> Jawaban ulasan independen dari Joel Gray mengenai ketahanan fisik dan umur pakai panel monitor.

## Apakah Build Quality Panel Mempengaruhi Umur Pakai?

**Sangat ngaruh!** Ketebalan lapisan polarizer, kualitas lem panel, serta modul backlight menentukan seberapa awet monitor terhadap masalah garis horizontal/vertikal (*dead lines*) dan *backlight bleed* yang parah setelah 1-2 tahun pemakaian.

### Faktor Kritis dalam Kualitas Panel:
1. **Grade Panel (Grade A+ vs Rejek ODM):** Brand tier atas umumnya menggunakan panel grade A+ dengan Quality Control ketat tanpa cacat subpixel.
2. **Kualitas Lem Bezel (Terutama Panel Curved):** Monitor lengkung budget sering mengalami panel terlepas dari frame setelah 1 tahun akibat lem memuai karena panas.
3. **Sirkuit Power Supply Internal:** Komponen kapasitor berkualitas menjaga voltase stabil sehingga backlight LED tidak cepat redup.`,
    onClickAction: "route",
    tags: ["FAQ", "Build Quality", "Panel", "Dead Lines", "Backlight Bleed"],
    order: 8,
    isPublished: true,
    discordCallbackSummary: "❓ FAQ: Build Quality Panel sangat berpengaruh pada ketahanan dead-lines dan backlight bleed 1-2 tahun pemakaian. Link: https://grayplasma.id/guide/faq/build-quality-panel",
    updatedAt: "2026-08-25"
  },
  {
    id: "faq-ideal-monitor",
    title: "MENENTUKAN MONITOR YANG IDEAL",
    slug: "menentukan-monitor-ideal",
    fullPath: "/guide/faq/menentukan-monitor-ideal",
    category: "FAQ & Glosarium",
    icon: "HelpCircle",
    coverImage: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1200&auto=format&fit=crop",
    description: "3 faktor utama menentukan monitor ideal: ukuran meja, kemampuan GPU, dan tujuan penggunaan.",
    contentMarkdown: `# MENENTUKAN MONITOR YANG IDEAL

> Formula praktis menentukan monitor terbaik berdasarkan spesifikasi PC dan ruang kerja.

## 3 Faktor Penentu Monitor Ideal:

1. **Jarak Pandang vs Ukuran Meja:**
   - Meja kedalaman 50-60cm: Paling pas layar **24 inci FHD** atau **27 inci 1440p**.
   - Meja kedalaman 75-80cm: Pas untuk **32 inci 4K** atau **34 inci Ultrawide**.

2. **Kemampuan Spesifikasi GPU / Kartu Grafis:**
   - GPU Entry (GTX 1650, RX 6500, RTX 3050): Tetap gunakan **1080p 180Hz**.
   - GPU Midrange (RTX 4060, RX 6700 XT, RTX 3070+): Wajib naik ke **1440p 180Hz**.
   - GPU High-End (RTX 4070 Ti, RTX 4080, RX 7900 XTX): Sangat ideal untuk **4K 144Hz** atau **OLED 240Hz/360Hz**.

3. **Kebutuhan Utama:**
   - **Esport FPS (Valorant/CS2):** Utamakan panel Fast IPS dengan Response Time GtG tercepat + Refresh Rate tinggi.
   - **Video Editing / Desain:** Utamakan panel IPS dengan akurasi warna sRGB & D65-P3 dengan Delta E < 3.`,
    onClickAction: "route",
    tags: ["FAQ", "Monitor Ideal", "GPU Matching", "Resolusi", "Esport vs Editing"],
    order: 9,
    isPublished: true,
    discordCallbackSummary: "❓ FAQ: Menentukan monitor ideal bergantung pada 3 faktor (ukuran meja, spesifikasi GPU, dan kebutuhan utama). Link: https://grayplasma.id/guide/faq/menentukan-monitor-ideal",
    updatedAt: "2026-08-25"
  },
  {
    id: "faq-luasan-vs-akurasi",
    title: "LUASAN ≠ AKURASI (WARNA)",
    slug: "luasan-vs-akurasi-warna",
    fullPath: "/guide/faq/luasan-vs-akurasi-warna",
    category: "FAQ & Glosarium",
    icon: "HelpCircle",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    description: "Perbedaan mendasar antara Gamut Volume (Luasan Warna) dengan Delta E (Ketepatan Warna).",
    contentMarkdown: `# LUASAN ≠ AKURASI (WARNA)

> Mengapa angka 120% sRGB pada brosur belum tentu berarti warnanya akurat?

## Luasan Gamut vs Akurasi Delta E

**Luasan Gamut** (seperti 120% sRGB / 95% DCI-P3) HANYA menunjukkan seberapa lebar cakupan volume warna yang mampu diproduksi layar, **BUKAN ketepatan warnanya!**

- Jika monitor punya gamut luas (125% sRGB) tetapi nilai **Delta E > 7**, maka warna kulit manusia atau warna logo produk akan terlihat kemerahan/kehijauan (*oversaturated*) secara berlebihan dan tidak natural.
- **Akurasi diukur dari Delta E (deITP / de2000 < 3 - 5):** Semakin kecil nilai Delta E, semakin persis warna di layar dengan standar warna asli di dunia nyata.`,
    onClickAction: "route",
    tags: ["FAQ", "Akurasi Warna", "Luasan Gamut", "Delta E", "sRGB vs DCI-P3"],
    order: 10,
    isPublished: true,
    discordCallbackSummary: "🎨 FAQ: Luasan Gamut ≠ Akurasi Warna. Luasan hanya kapasitas volume, sedangkan akurasi diukur dari skor Delta E (< 3-5). Link: https://grayplasma.id/guide/faq/luasan-vs-akurasi-warna",
    updatedAt: "2026-08-25"
  },
  {
    id: "faq-ips-va-tn",
    title: "IPS, VA, TN? MANA YANG LEBIH BAIK?",
    slug: "ips-vs-va-vs-tn",
    fullPath: "/guide/faq/ips-vs-va-vs-tn",
    category: "FAQ & Glosarium",
    icon: "HelpCircle",
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    description: "Perbandingan karakter panel IPS (Fast IPS), VA (High Contrast), dan TN di tahun 2026.",
    contentMarkdown: `# IPS, VA, TN? MANA YANG LEBIH BAIK?

> Memilih tipe panel yang sesuai dengan preferensi visual dan kondisi pencahayaan ruangan.

## Perbandingan Karakteristik Panel:

### 1. Panel IPS (Fast IPS) — Pilihan Terbaik 90% Pengguna
- **Kelebihan:** Warna konsisten dari segala sudut pandang, transisi pixel cepat tanpa *black smearing*, ideal untuk gaming esport dan editing.
- **Kekurangan:** Contrast ratio standar (~1000:1), warna hitam di ruangan gelap terlihat agak abu-abu gelap (*IPS Glow*).

### 2. Panel VA — Terbaik untuk Menonton Film di Ruangan Gelap
- **Kelebihan:** Contrast ratio tinggi (~3000:1 s/d 4000:1), warna hitam pekat dan memuaskan.
- **Kekurangan:** Rentan terjadi *black smearing* (bayangan gelap saat objek bergerak cepat pada game bertempo tinggi).

### 3. Panel TN — Sudah Ditinggalkan di 2026
- **Kelebihan:** Dulu tercepat untuk esport zaman 144Hz pertama.
- **Kekurangan:** Sudut pandang buruk (warna bergeser jika dilihat dari samping/atas) dan reproduksi warna pudar.`,
    onClickAction: "route",
    tags: ["FAQ", "IPS", "VA", "TN", "Panel Comparison"],
    order: 11,
    isPublished: true,
    discordCallbackSummary: "🖥️ FAQ: IPS terbaik untuk esport & editing; VA terbaik untuk kontras film di ruangan gelap; TN sudah tidak direkomendasikan di 2026. Link: https://grayplasma.id/guide/faq/ips-vs-va-vs-tn",
    updatedAt: "2026-08-25"
  },
  {
    id: "faq-skyworth-po",
    title: "BANG, SKYWORTH SERING PRE-ORDER (PO). BAIKNYA IKUT ATAU JANGAN?",
    slug: "skyworth-po",
    fullPath: "/guide/faq/skyworth-po",
    category: "FAQ & Glosarium",
    icon: "HelpCircle",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    description: "Pertimbangan mengikuti batch Pre-Order resmi monitor Skyworth di marketplace.",
    contentMarkdown: `# BANG, SKYWORTH SERING PRE-ORDER (PO). BAIKNYA IKUT ATAU JANGAN?

> Tips aman mengikuti program Pre-Order resmi monitor Skyworth batch distributor Indonesia.

## Rekomendasi Mengikuti PO Skyworth:

Jika Anda **tidak buru-buru butuh monitor dalam hitungan hari**, ikut PO batch resmi Skyworth sangat menguntungkan karena:
- Harga promo PO jauh lebih murah (seringkali selisih 200-400 ribu rupiah dibanding harga reguler).
- Sering mendapatkan bonus kabel DisplayPort kualitas tinggi atau bracket monitor arm.

### Syarat Wajib Saat Ikut PO:
1. Pastikan checkout di **Official Store Skyworth Indonesia** di Tokopedia / Shopee.
2. Periksa estimasi tanggal pengiriman yang tertera pada deskripsi produk.
3. Simpan invoice transaksi sebagai bukti klaim garansi resmi PT Skyworth Indonesia 3 tahun.`,
    onClickAction: "route",
    tags: ["FAQ", "Skyworth", "Pre Order", "Garansi", "Tips Belanja"],
    order: 12,
    isPublished: true,
    discordCallbackSummary: "📦 FAQ: Ikut PO Skyworth sangat worth-it jika tidak buru-buru karena harga jauh lebih murah dan garansi 3 tahun resmi. Link: https://grayplasma.id/guide/faq/skyworth-po",
    updatedAt: "2026-08-25"
  },
  {
    id: "faq-beli-online-aman",
    title: "BELI MONITOR ONLINE AMAN?",
    slug: "beli-monitor-online-aman",
    fullPath: "/guide/faq/beli-monitor-online-aman",
    category: "FAQ & Glosarium",
    icon: "HelpCircle",
    coverImage: "https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=1200&auto=format&fit=crop",
    description: "3 SOP wajib saat membeli monitor secara online agar terhindar dari sengketa barang cacat/rusak.",
    contentMarkdown: `# BELI MONITOR ONLINE AMAN?

> Panduan SOP belanja monitor gaming online dengan proteksi asuransi pengiriman penuh.

## 3 Syarat Wajib Belanja Monitor Online Aman:

1. **Beli di Official Store atau Toko Power Merchant / Star+ Terpercaya:**
   - Memastikan unit berasal dari jalur distributor resmi Indonesia dengan nota pembelian yang valid untuk klaim servis.

2. **Wajib Centang Asuransi Pengiriman & Tambahan Packing Kayu / Bubble:**
   - Terutama untuk pengiriman luar pulau Jawa, asuransi melindungi Anda dari risiko panel pecah saat transit ekspedisi.

3. **Rekam Video Unboxing Utuh Tanpa Jeda:**
   - Mulai dari paket masih tersegel rapi di semua sisi, proses buka dus, hingga monitor dicolokkan ke listrik dan dites layar nyala (*Dead Pixel Test*). Video ini adalah syarat mutlak tukar unit 100% di marketplace jika terjadi kerusakan awal.`,
    onClickAction: "route",
    tags: ["FAQ", "Belanja Online", "Asuransi", "Video Unboxing", "Garansi Toko"],
    order: 13,
    isPublished: true,
    discordCallbackSummary: "🛡️ FAQ: Belanja monitor online aman dengan 3 syarat (Official Store, Asuransi Pengiriman, dan Video Unboxing utuh). Link: https://grayplasma.id/guide/faq/beli-monitor-online-aman",
    updatedAt: "2026-08-25"
  }
];

export const DEFAULT_CATEGORY_GROUPS: SiteCategoryGroup[] = [
  {
    id: "cat-sdr-warna",
    name: "SDR & Kalibrasi Warna",
    icon: "BookOpen",
    description: "Panduan deITP, Delta E, akurasi D65-P3 vs sRGB, dan pembacaan grafik Calman.",
    badge: "Edukasi",
    routes: DEFAULT_SITE_HIERARCHY.filter((n) => n.category === "SDR & Kalibrasi Warna")
  },
  {
    id: "cat-brand-aftersales",
    name: "Brand & Aftersales",
    icon: "ShieldAlert",
    description: "Analisis manufaktur ODM, rekam jejak garansi distributor, dan prosedur RMA.",
    badge: "Penting",
    routes: DEFAULT_SITE_HIERARCHY.filter((n) => n.category === "Brand & Aftersales")
  },
  {
    id: "cat-display-bandwidth",
    name: "Konektivitas & Bandwidth",
    icon: "SlidersHorizontal",
    description: "Perbandingan kabel HDMI 2.0 vs 2.1, DisplayPort 1.4 vs 2.1, dan DSC.",
    badge: "Hardware",
    routes: DEFAULT_SITE_HIERARCHY.filter((n) => n.category === "Konektivitas & Bandwidth")
  },
  {
    id: "cat-oled-hdr",
    name: "OLED & HDR Flagship",
    icon: "SunMedium",
    description: "Perawatan panel QD-OLED / WOLED, pixel refresh, dan true HDR vs fake HDR 400.",
    badge: "Flagship",
    routes: DEFAULT_SITE_HIERARCHY.filter((n) => n.category === "OLED & HDR Flagship")
  },
  {
    id: "cat-setup-ergonomi",
    name: "Setup Meja & Ergonomi",
    icon: "LayoutGrid",
    description: "Kesesuaian kedalaman meja kerja, jarak pandang mata, dan bracket monitor arm.",
    badge: "Setup",
    routes: DEFAULT_SITE_HIERARCHY.filter((n) => n.category === "Setup Meja & Ergonomi")
  },
  {
    id: "cat-faq-glosarium",
    name: "FAQ & Glosarium",
    icon: "HelpCircle",
    description: "Tanya jawab seputar data pengetesan laboratorium GrayPlasma dan kurasi GrayPlasma.",
    badge: "QnA",
    routes: DEFAULT_SITE_HIERARCHY.filter((n) => n.category === "FAQ & Glosarium")
  }
];
