import { formatRupiah } from "@/lib/utils";

export interface DeskGuide {
  deskDepth: string;
  recommendedSizes: string;
  viewingDistance: string;
  notes: string;
  monitorArmRecommendation: string;
  isPublished?: boolean;
}

export interface HDRGuide {
  tier: "TRUE HDR" | "DECENT HDR" | "ENTRY / FAKE HDR 400";
  requirements: string;
  contrastRatio: string;
  peakBrightness: string;
  dimmingZones: string;
  verdict: string;
  models: string[];
  isPublished?: boolean;
}

export interface AftersalesBrand {
  brand: string;
  rating: "S" | "A" | "B" | "C" | "WARNING";
  distributor: string;
  warrantyPeriod: string;
  summary: string;
  status: "Sangat Direkomendasikan" | "Bagus & Aman" | "Cukup Standar" | "Perlu Perhatian / Lama";
  points: string[];
  contactUrl?: string;
  claimSystem?: string;
}

export interface GrayNoteItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  details: string[];
  warning?: string;
  recommendation: string;
  isPublished?: boolean;
}

export const ABOUT_NOTION_CONTENT = {
  title: "TENTANG WEBSITE INI & PENULIS",
  subtitle: "Unofficial Website of GrayPlasma's Data Testing",
  author: "Joel Gray (@gray1plasma)",
  collaborator: "@GrayPlasma",
  latarBelakang: `Dimulai dari 2024, penulis (bukan resmi dari Tim GrayPlasma) sadar akan satu hal: Bahwa masih banyak orang yang kesulitan membaca data pengetesan GrayPlasma. Penulis berinisiatif untuk meringkas apa yang sudah GrayPlasma tes, namun masih banyak kekurangan, yakni masih dalam format google docs dan belum mendalami soal Aftersales. Tiba di akhir 2024, penulis berinisiatif untuk mengembangkannya menjadi platform web mandiri, yang awalnya berasal dari ringkasan dokumen, dan meningkatkannya menjadi database terstruktur untuk format kelebihan dan kekurangan setiap monitor. Tak luput juga penulis menambah dan mempelajari kondisi aftersales di tiap brand monitor. Dapat disimpulkan bahwa website ini bisa menjadi jembatan antara orang awam dengan orang yang sudah expert.`,
  biodataPenulis: `Halo semuanya! Perkenalkan nama aku Joel, biasa disingkat El. Sorry ga formal buat perkenalannya. Sebenarnya ini cuma hobi aja sih menulis plus minus, karena kasihan juga masih banyak orang awam yang bingung dengan cara baca data pengetesan GrayPlasma, sembari cari cuan dari affiliate (jujur ga maksa sih, buat belanja melalui link kurasi), cuma kok banyak waktu luang menjawab dan membantu di Discord GrayPlasma? Dikarenakan aku seorang lulusan SMK sedang gap year karena ada persoalan keluarga, sehingga baru berencana masuk kuliah di tahun 2027. Dan aku cuma mau bilang terima kasih yang sudah bertanya dan support melalui belanja menggunakan link affiliate atau memberikan donasi. Dan juga say sorry kalo ada yang nanya melalui Direct Messages Discord namun tidak dijawab.`
};

export const HOW_TO_READ_GLOSSARY = {
  title: "HOW TO READ GrayPlasma GLOSSARY (SDR)",
  subtitle: "Panduan Lengkap Cara Membaca Data Pengetesan Warna, Contrast, & Response Time GrayPlasma",
  sections: [
    {
      title: "1. Standar Akurasi Warna: deITP vs de2000",
      content: `Standar Data pengetesan GrayPlasma biasanya menggunakan deITP (Delta E ITP) yang di mana dapat mendeteksi akurasi warna jauh lebih akurat dibanding de2000. deITP mampu mendeteksi perbedaan warna di kecerahan 0,1 Nits (cd/m²), hal inilah yang menyebabkan deITP sangat ideal untuk pengetesan akurasi warna (khususnya pada monitor dengan kecerahan dinamis).
      
      - Standar Akurasi Warna: Nilai di bawah atau kisaran 5 deITP dianggap akurat bagi mata manusia.
      - Jika sRGB Default tidak akurat (> 7 deITP), maka lihat settingan OSD sRGB / DCI-P3 yang disediakan oleh pabrikan.`
    },
    {
      title: "2. Color Space OSD (sRGB, DCI-P3, AdobeRGB)",
      content: `Setiap monitor menyediakan preset color space di menu OSD:
      - OSD sRGB Akurat: Ideal untuk Website Design, Social Media, dan Programming Frontend / Fullstack.
      - OSD D65-P3 / DCI-P3 Akurat: Ideal untuk editing video profesional, YouTube, dan konten HP.
      - OSD AdobeRGB Akurat: Ideal untuk Desain Percetakan / Printing Offset.
      - Kolom BT 2020: Ditujukan untuk Content Consumption (menonton film & gaming HDR).`
    },
    {
      title: "3. Contrast Ratio & Min/Max Brightness",
      content: `Contrast Ratio berhubungan dengan rentang perbedaan gelap dan terang:
      - Standar Ideal Panel IPS: 1000:1 (Lebih tinggi, lebih baik).
      - Standar Ideal Panel VA: 3000:1.
      - Maximum Brightness: Ideal di atas 300 nits untuk ruangan terang.
      - Minimum Brightness: Ideal di bawah 50 nits untuk pemakaian di ruangan gelap.`
    },
    {
      title: "4. Response Time (Best vs Average) & Refresh Rate",
      content: `Response time adalah seberapa cepat panel merespons perpindahan warna (GtG):
      - Best Response Time: Diraih saat monitor berjalan di refresh rate maksimal.
      - Average Response Time: Rata-rata response time dari 180Hz hingga 60Hz.
      - Overdrive Setting: Hindari level 'Extreme/Fastest' karena akan memicu Inverse Ghosting / Overshoot (corona putih). Gunakan level Medium/Fast untuk motion clarity bersih.`
    }
  ]
};

export const OLED_DEEP_DIVE = {
  title: "PANDUAN LENGKAP OLED & REKOMENDASI BRAND",
  alasanBrand: `Alasan mengapa OLED yang paling worth it di 2026 HANYA antara ASUS, MSI, dan DELL:
  1. Dell Alienware: Garansi 3 tahun ProSupport Onsite NBD (Next Business Day) teknisi ke rumah + cakupan perlindungan Burn-in jelas tanpa syarat ribet.
  2. ASUS ROG: Menghadirkan Custom Heatsink graphene pendinginan pasif tanpa kipas bising + panel QD-OLED Gen 3 360Hz teruji.
  3. MSI MAG/MPG: Menyertakan fitur OLED Care 2.0 (Pixel Shift, Panel Protect, Boundary Detection) serta harga paling kompetitif di kelasnya.`,
  caraRawat: [
    "Aktifkan 'Auto-hide Taskbar' pada Windows agar bilah tugas tidak diam statis di posisi yang sama berjam-jam.",
    "Gunakan background Desktop bernuansa gelap murni (OLED Pure Black #000000) atau aktifkan Wallpaper Slideshow berkala.",
    "Jangan mencabut kabel power colokan listrik langsung saat selesai digunakan. Biarkan monitor dalam mode Standby agar sistem otomatis menjalankan 'Pixel Refresh' di latar belakang.",
    "Gunakan browser dalam mode Dark Theme dan sembunyikan Bookmark Bar jika sering browsing seharian."
  ],
  toleransiLamaVsBaru: `Perbedaan Data Lama vs Data Baru di Glosarium GrayPlasma:
  Pada standar data pengujian baru, GrayPlasma memperketat batas toleransi Overshoot (maksimal 5%) dan transisi warna sub-pixel pada tingkat kecerahan rendah, sehingga skor response time yang ditampilkan mencerminkan kondisi visual nyata pada gameplay kompetitif.`
};

export const AFTERSALES_DATA: AftersalesBrand[] = [
  {
    brand: "Dell / Alienware",
    rating: "S",
    distributor: "Dell Official Indonesia",
    warrantyPeriod: "3 Tahun (ProSupport Onsite Service)",
    summary: "Standar emas aftersales di Indonesia. Teknisi langsung datang ke rumah/kantor untuk swap unit baru jika ada kerusakan.",
    status: "Sangat Direkomendasikan",
    contactUrl: "https://www.dell.com/support/home/id-id",
    claimSystem: "GANTI BARU DI TEMPAT (ONSITE NBD)",
    points: [
      "Layanan Onsite Next Business Day di kota besar",
      "Garansi OLED mencakup perlindungan burn-in 3 tahun penuh",
      "Proses klaim paling praktis tanpa perlu bawa monitor ke service center"
    ]
  },
  {
    brand: "LG Electronics",
    rating: "S",
    distributor: "LG Electronics Indonesia",
    warrantyPeriod: "3 Tahun (Panel & Spareparts)",
    summary: "Jaringan service center sangat luas di seluruh Indonesia dengan ketersediaan sparepart relatif siap dan jelas.",
    status: "Sangat Direkomendasikan",
    contactUrl: "https://www.lg.com/id/support/service-center",
    claimSystem: "SERVICE & GANTI MODUL RESMI",
    points: [
      "Service center resmi di hampir seluruh kota di Indonesia",
      "Klaim dead pixel jelas (kebijakan sesuai standar internasional)",
      "Respons hotline dan penanganan teknisi ramah & cepat"
    ]
  },
  {
    brand: "ASUS / ROG / TUF",
    rating: "A",
    distributor: "ASUS Indonesia & PT Sempurna",
    warrantyPeriod: "3 Tahun Penuh",
    summary: "Garansi 3 tahun menyeluruh. Untuk lini ROG OLED sudah ada cakupan burn-in garansi.",
    status: "Bagus & Aman",
    contactUrl: "https://www.asus.com/id/support/service-center/indonesia",
    claimSystem: "GANTI BARU / REPAIR",
    points: [
      "Service center resmi tersebar luas di kota besar",
      "Support online via aplikasi MyASUS",
      "Waktu pengerjaan umumnya 7-14 hari kerja"
    ]
  },
  {
    brand: "ViewSonic",
    rating: "A",
    distributor: "PT Synnex Metrodata / ViewSonic ID",
    warrantyPeriod: "3 Tahun (Termasuk On-site Service)",
    summary: "Salah satu aftersales paling konsisten dengan garansi panel dan on-site service di kota-kota besar.",
    status: "Bagus & Aman",
    contactUrl: "https://www.viewsonic.com/id/support/repair-service/",
    claimSystem: "PICK-UP SERVICE / ONSITE",
    points: [
      "Layanan pick-up service / on-site di area tertentu",
      "Garansi 3 tahun sparepart & panel",
      "Jarang terjadi sengketa klaim cacat produksi"
    ]
  },
  {
    brand: "Xiaomi",
    rating: "B",
    distributor: "Xiaomi Indonesia",
    warrantyPeriod: "3 Tahun",
    summary: "Unit diganti 1-to-1 swap jika ada kerusakan parah di masa awal, namun ketersediaan stok unit pengganti tergantung cabang Xiaomi Exclusive Center.",
    status: "Cukup Standar",
    contactUrl: "https://www.mi.co.id/id/support/service-centre/",
    claimSystem: "1-TO-1 UNIT REPLACEMENT (EXCLUSIVE CENTER)",
    points: [
      "Bisa klaim di Xiaomi Service Center terdekat",
      "Unit rusak sering langsung diganti modul baru",
      "Harus membawa kelengkapan dus saat mengajukan klaim"
    ]
  },
  {
    brand: "MSI",
    rating: "B",
    distributor: "PT Alfa Artha Andhaya (AAA)",
    warrantyPeriod: "3 Tahun",
    summary: "Kualitas produk sangat solid, proses RMA bergantung pada ketersediaan stok sparepart di pusat Jakarta.",
    status: "Cukup Standar",
    contactUrl: "https://id.msi.com/page/service-location-new",
    claimSystem: "SERVICE & SWAP PUSAT",
    points: [
      "Pusat service center di Jakarta & drop point di daerah",
      "Waktu RMA rata-rata 2 - 3 minggu jika ada part pengganti"
    ]
  },
  {
    brand: "AOC / Philips",
    rating: "WARNING",
    distributor: "PT Mega Komputindo Perkasa (MKP)",
    warrantyPeriod: "3 Tahun",
    summary: "Catatan GrayPlasma: Panel dan performa monitor AOC sangat bagus, namun waktu proses service RMA di beberapa kasus memakan waktu lebih dari 1 bulan jika suku cadang harus inden.",
    status: "Perlu Perhatian / Lama",
    claimSystem: "INDEN SUKU CADANG (3-6 MINGGU)",
    points: [
      "Proses pergantian unit atau perbaikan bisa memakan waktu 3 - 6 minggu",
      "Pastikan simpan nota pembelian resmi dan kartu garansi fisik",
      "Pantau update status servis secara aktif ke pihak distributor"
    ]
  },
  {
    brand: "Samsung Monitor",
    rating: "WARNING",
    distributor: "Samsung Electronics Indonesia (SEIN)",
    warrantyPeriod: "1 - 3 Tahun",
    summary: "Sistem klaim dead pixel dan garis layar memerlukan negosiasi, serta waktu perbaikan panel curved sering menunggu kiriman modul.",
    status: "Perlu Perhatian / Lama",
    points: [
      "Wajib periksa dead pixel pada saat pembelian",
      "Service center resmi melimpah, namun ketersediaan panel curved bervariasi"
    ]
  },
  {
    brand: "Koorui / Titan Army / HKC",
    rating: "C",
    distributor: "Distributor Toko / Importir",
    warrantyPeriod: "1 - 2 Tahun",
    summary: "Brand OEM/ODM dengan harga sangat murah. Garansi bergantung pada toko atau distributor impor.",
    status: "Perlu Perhatian / Lama",
    points: [
      "Harga sangat terjangkau, namun QC panel bervariasi",
      "Klaim garansi biasanya dikirim ke drop-point Jakarta"
    ]
  }
];

export interface AvoidBrandItem {
  brand: string;
  category: string;
  issue: string;
  authorNote: string;
  details: string[];
  isPublished?: boolean;
}

export const BRANDS_TO_AVOID_DATA: AvoidBrandItem[] = [
  {
    brand: "AOC dan PHILIPS MONITOR",
    category: "RMA Lambat & Masalah Garis Layar",
    issue: "Pengajuan proses garansi relatif lama, bahkan bisa memakan waktu lebih dari 1 bulan. Aftersales nya kacau. Masalah AOC 24G2 series yang tiba-tiba bergaris.",
    authorNote: "Mempelajari masalah tidak menyelesaikan apa-apa jika tidak ada solusi untuk memecahkan masalah tersebut.",
    details: [
      "Panel AOC 24G4 dan 24G2SP sebenarnya sangat bagus secara warna dan responsivitas.",
      "Namun komplain terbesar dari komunitas adalah lambatnya penggantian unit jika terjadi cacat garis layar.",
      "Solusi: Simpan invoice toko dan hubungi CS MKP secara berkala."
    ]
  },
  {
    brand: "ASROCK? COOLERMASTER?",
    category: "Brand Komponen yang Masuk ke Monitor",
    issue: "Fokus utama bukan di manufaktur display. Sebagian besar lini monitor mereka adalah pesanan ODM dari pihak ketiga.",
    authorNote: "Kurang konsisten dalam tuning overdrive firmware dan minimnya service center display khusus.",
    details: [
      "Tuning firmware OSD seringkali kaku dan opsi overdrive terbatas.",
      "Jaringan perbaikan monitor belum seluas brand display veteran seperti Dell atau LG."
    ]
  },
  {
    brand: "GIGABYTE (BELUM TAHU APAKAH SERIUS MEMPERBAIKI AFTERSALES NYA ATAU TIDAK)",
    category: "Catatan Riwayat Garansi",
    issue: "Monitor Gigabyte seperti M27Q / G24F sempat sangat populer, namun riwayat penanganan RMA di masa lalu sering dikeluhkan.",
    authorNote: "Perlu konfirmasi ketersediaan stok swap sebelum membeli tipe langka.",
    details: [
      "Kualitas visual dan fitur KVM Switch sangat baik.",
      "Pastikan membeli dari distributor resmi PT Synnex Metrodata / Nusantara Jaya Teknologi."
    ]
  },
  {
    brand: "SAMSUNG MONITOR (Panel Curved Budget)",
    category: "Masalah QC Panel Curved & Lepas Lem",
    issue: "Lini monitor lengkung (curved) budget rentan mengalami panel terlepas dari bingkai (bezel separation) akibat panas dan lem melemah setelah pemakaian 1-2 tahun.",
    authorNote: "Hati-hati pada lini Odyssey G3/G5 non-OLED.",
    details: [
      "Odyssey OLED G6/G8 sangat bagus, namun lini budget VA Curved memerlukan ekstra kehati-hatian.",
      "Gunakan di ruangan ber-AC untuk mencegah lem panel memuai."
    ]
  },
  {
    brand: "LG MONITOR (Kebijakan Garansi Tertentu)",
    category: "Syarat Dead Pixel Ambigu",
    issue: "Meskipun aftersales LG tergolong cepat, kebijakan batas jumlah titik dead pixel di nota garansi beberapa seri terkadang menimbulkan perdebatan.",
    authorNote: "Selalu lakukan Dead Pixel Check dalam 1x24 jam.",
    details: [
      "Segera tukar unit di marketplace jika ditemukan dead pixel sebelum masa komplain toko berakhir."
    ]
  },
  {
    brand: "KOORUI & BRAND ODM CHINA MURAH",
    category: "QC dan Umur Pakai Komponen",
    issue: "Monitor ODM murah menghemat biaya pada sirkuit power supply internal dan backlight, sehingga umur pakai komponen lebih pendek.",
    authorNote: "Bagus untuk budget mepet, tapi siapkan mental jika rusak setelah 1-2 tahun.",
    details: [
      "Koorui 24E3 memiliki performa lumayan di harga Rp 1.2 jutaan.",
      "Jangan gunakan kecerahan 100% terus-menerus agar backlight LED tidak cepat redup/panas."
    ]
  },
  {
    brand: "LENOVO MONITOR (Lini Standar Non-Legion)",
    category: "Opsi OSD dan Keterbatasan Stand",
    issue: "Lini Lenovo ThinkVision atau seri D budget seringkali memiliki stand yang tidak bisa diatur ketinggiannya dan tanpa port DisplayPort.",
    authorNote: "Pilih seri Lenovo Legion jika menginginkan tuning gaming yang benar.",
    details: [
      "Seri kantor Lenovo D-series umumnya hanya 75Hz-100Hz dengan color gamut terbatas."
    ]
  }
];

export const BRAND_ODM_GUIDE = {
  title: "BRAND ODM LAYAK DIBELI?",
  subtitle: "Edukasi Mengenai Monitor Hasil Rebrand ODM / OEM di Pasar Indonesia",
  description: "ODM (Original Design Manufacturer) adalah pabrik pihak ketiga di China yang memproduksi monitor secara massal lalu ditempel logo brand lokal/baru. Sebagian brand ODM menawarkan harga murah namun mengorbankan tuning overdrive, akurasi kalibrasi warna, dan garansi jangka panjang.",
  poinPenting: [
    "Brand OEM/ODM Murni: Pabrik membuat desain utuh dan brand hanya menempel stiker logo (minim riset).",
    "Kelemahan Utama: Firmware OSD seringkali generik, overdrive tidak disesuaikan dengan karakteristik panel, dan risiko inverse ghosting tinggi.",
    "Rekomendasi: Jika ingin membeli monitor ODM karena budget murah, prioritaskan brand yang memberikan garansi 3 tahun ganti baru dan sudah di-review response time-nya oleh GrayPlasma."
  ]
};

export const DESK_GUIDES: DeskGuide[] = [
  {
    deskDepth: "Kedalaman 50 cm - 55 cm (Meja Sempit)",
    recommendedSizes: "24 Inci (Maksimal)",
    viewingDistance: "45 cm - 55 cm",
    notes: "Hindari monitor 27 inci ke atas karena jarak pandang terlalu dekat sehingga leher harus menoleh dan mata cepat lelah.",
    monitorArmRecommendation: "Wajib pakai Monitor Arm Jepit Meja (North Bayou F80) agar stand bawaan tidak memakan ruang keyboard/mousepad."
  },
  {
    deskDepth: "Kedalaman 60 cm (Standar Meja Kerja/Gaming)",
    recommendedSizes: "24 Inci s/d 27 Inci",
    viewingDistance: "55 cm - 65 cm",
    notes: "Ukuran 27 inci 1440p (2K) adalah titik paling pas (sweetspot) di meja kedalaman 60cm jika didorong agak ke belakang.",
    monitorArmRecommendation: "Sangat direkomendasikan Gas Spring Arm North Bayou F80 atau Oximus Hydra."
  },
  {
    deskDepth: "Kedalaman 70 cm - 80 cm (Meja Luas / Custom)",
    recommendedSizes: "27 Inci, 32 Inci, atau 34 Inci Ultrawide",
    viewingDistance: "70 cm - 90 cm",
    notes: "Sangat ideal untuk monitor 32 inci 4K atau 34 inci Ultrawide 21:9 karena seluruh bidang layar masih masuk dalam bidang pandang periferal mata.",
    monitorArmRecommendation: "North Bayou F100A (Beban berat hingga 12kg) atau Ergotron LX."
  }
];

export const HDR_GUIDES: HDRGuide[] = [
  {
    tier: "TRUE HDR",
    requirements: "OLED (Per-pixel dimming) atau Mini-LED (512+ Local Dimming Zones)",
    contrastRatio: "1.000.000:1 s/d Tak Terhingga",
    peakBrightness: "1000 nits - 1400 nits",
    dimmingZones: "Individual OLED Sub-pixel / 576+ Mini-LED Zones",
    verdict: "HDR Sejati. Visual highlights menyilaukan tanpa ada efek halo / blooming abu-abu di area gelap.",
    models: ["Dell Alienware AW2725DF QD-OLED", "ASUS ROG PG27AQDM OLED", "Samsung Odyssey OLED G6/G8", "AOC Q27G3XMN Mini-LED"]
  },
  {
    tier: "DECENT HDR",
    requirements: "Edge-lit dengan DisplayHDR 600 + Local Dimming Sederhana (8-16 zones)",
    contrastRatio: "3000:1 - 6000:1",
    peakBrightness: "600 nits",
    dimmingZones: "8 s/d 32 Edge Zones",
    verdict: "Cukup lumayan untuk film dan game cinematic, namun masih terdapat sedikit blooming saat ada teks putih di background hitam.",
    models: ["Samsung Odyssey G7 VA 240Hz", "LG 27GP850 (HDR 400 Peak)"]
  },
  {
    tier: "ENTRY / FAKE HDR 400",
    requirements: "DisplayHDR 400 tanpa Local Dimming / Panel SDR Biasa",
    contrastRatio: "1000:1 (IPS Standar)",
    peakBrightness: "250 - 350 nits",
    dimmingZones: "Global Backlight (0 Local Dimming)",
    verdict: "Pemasaran gimik semata. Menyalakan HDR di Windows justru seringkali membuat warna menjadi pudar atau overexposed (terlalu terang keputihan). Disarankan matikan HDR dan gunakan mode SDR standar.",
    models: ["AOC 24G4 (Gunakan SDR)", "Xiaomi G24i (Gunakan SDR)", "KOORUI 24E3", "Gigabyte M27Q"]
  }
];

export const GRAYNOTES_LIST: GrayNoteItem[] = [
  {
    id: "note-dp-hdmi",
    title: "DisplayPort 1.4 vs HDMI 2.0 / 2.1 TMDS",
    category: "DisplayPort vs HDMI",
    summary: "Banyak pengguna monitor 1440p 180Hz–240Hz salah menggunakan kabel HDMI sehingga refresh rate terkunci atau warna turun ke 8-bit YCbCr422.",
    details: [
      "HDMI 2.0 hanya memiliki bandwidth ~14.4 Gbps. Pada 1440p, ia mentok di 144Hz 8-bit tanpa HDR.",
      "DisplayPort 1.4 memiliki bandwidth 25.92 Gbps + dukungan DSC (Display Stream Compression) untuk menjalankan 1440p 240Hz–360Hz pada 10-bit RGB penuh.",
      "G-Sync Compatible NVIDIA seringkali HANYA berjalan melalui kabel DisplayPort, tidak bisa via HDMI standar."
    ],
    warning: "Jangan gunakan konverter HDMI to DP murah non-aktif karena akan membatasi refresh rate ke 60Hz.",
    recommendation: "Gunakan kabel DisplayPort 1.4 bawaan monitor yang dicolok langsung ke port GPU (bukan port motherboard)."
  },
  {
    id: "note-grayplasma-testing",
    title: "Cara Membaca Data Pengetesan Response Time & Ghosting GrayPlasma",
    category: "Response Time & Ghosting",
    summary: "Angka '1ms' atau '0.5ms' di kotak monitor hanyalah klaim marketing MPRT (strobing). Response Time asli yang diuji alat GrayPlasma adalah GtG (Gray to Gray).",
    details: [
      "Response Time ideal di 180Hz adalah di bawah 5.5ms GtG rata-rata di semua transisi warna.",
      "Overdrive Setting: Di menu OSD monitor, JANGAN selalu pilih level 'Fastest' / 'Extreme' karena akan menyebabkan Inverse Ghosting (Corona/Pixel Overshoot bergaris putih).",
      "Pilih overdrive level 'Medium' atau 'Fast' untuk mendapatkan motion clarity paling bersih tanpa artefak."
    ],
    recommendation: "Pada AOC 24G4: Set Overdrive ke 'Medium'. Pada Xiaomi G24i: Set Overdrive ke 'Fast'."
  },
  {
    id: "note-oled-warranty",
    title: "Panduan Perawatan OLED & Batasan Garansi Brand",
    category: "OLED Care & Warranty",
    summary: "Panel QD-OLED dan WOLED generasi terbaru memiliki ketahanan jauh lebih baik, namun ada tips penting agar awet bertahun-tahun.",
    details: [
      "Sembunyikan Windows Taskbar (Auto-hide Taskbar) dan gunakan Desktop wallpaper hitam / slideshow.",
      "Selalu biarkan monitor dalam mode Standby saat PC dimatikan agar fitur Pixel Refresh otomatis berjalan di latar belakang.",
      "Perhatikan syarat garansi: Dell Alienware & ASUS ROG memberikan garansi Burn-in 3 tahun. Sebagian brand lain menerapkan batasan maksimal jam pakai harian."
    ],
    recommendation: "Jika budget mencukupi, Dell Alienware AW2725DF adalah pilihan paling tenang berkat garansi Dell ProSupport Onsite."
  },
  {
    id: "note-dead-pixel",
    title: "Standar Kebijakan Klaim Dead Pixel & Garansi Panel",
    category: "Dead Pixel Policy",
    summary: "Pahami standar ISO 9241-307 tentang dead pixel agar tidak kecewa saat mengajukan komplain ke toko atau distributor.",
    details: [
      "Sebagian besar brand distributor menetapkan minimal 3 s/d 5 titik dead pixel (atau 1 bright subpixel di area tengah) untuk disetujui pergantian unit baru.",
      "Lakukan unboxing dan pengetesan 'Dead Pixel Test' (layar full merah, hijau, biru, hitam, putih) dalam 1x24 jam pertama.",
      "Manfaatkan masa garansi toko (biasanya 3-7 hari ganti baru di marketplace) jika menemukan cacat fisik pada saat unboxing."
    ],
    recommendation: "Beli di Official Store Tokopedia/Shopee/Blibli terpercaya untuk perlindungan asuransi pengiriman dan proteksi barang."
  }
];

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  important?: boolean;
  isPublished?: boolean;
}

export interface BandwidthGuidance {
  interface: string;
  bandwidth: string;
  maxResolutionHz: string;
  colorDepth: string;
  dscSupport: string;
  notes: string;
  isPublished?: boolean;
}

export const BANDWIDTH_GUIDANCES: BandwidthGuidance[] = [
  {
    interface: "HDMI 2.0",
    bandwidth: "18.0 Gbps (Data Rate: 14.4 Gbps)",
    maxResolutionHz: "1080p 240Hz / 1440p 144Hz / 4K 60Hz",
    colorDepth: "8-bit RGB (10-bit butuh Chroma Subsampling YCbCr 4:2:2)",
    dscSupport: "Tidak Didukung",
    notes: "Kabel bawaan HDMI 2.0 sering membuat monitor 1440p 180Hz turun ke 144Hz atau warna turun ke 8-bit. Tidak disarankan untuk monitor 1440p high-refresh."
  },
  {
    interface: "HDMI 2.1 FRL (Fixed Rate Link)",
    bandwidth: "48.0 Gbps (Data Rate: 42.6 Gbps)",
    maxResolutionHz: "4K 144Hz+ Native / 8K 60Hz",
    colorDepth: "10-bit / 12-bit Full RGB 4:4:4",
    dscSupport: "Didukung (DSC 1.2a)",
    notes: "Standar terbaru untuk console PS5/Xbox Series X dan monitor 4K 144Hz+. Hati-hati dengan penamaan HDMI 2.1 TMDS (rebranded HDMI 2.0)."
  },
  {
    interface: "DisplayPort 1.4 (HBR3)",
    bandwidth: "32.4 Gbps (Data Rate: 25.92 Gbps)",
    maxResolutionHz: "1440p 240Hz+ / 4K 120Hz Native (4K 240Hz via DSC)",
    colorDepth: "10-bit RGB 4:4:4 dengan DSC",
    dscSupport: "Didukung (DSC 1.2a)",
    notes: "Koneksi standar emas untuk PC gaming. Wajib digunakan jika ingin mengaktifkan G-Sync Compatible NVIDIA dan refresh rate maksimal."
  },
  {
    interface: "DisplayPort 2.1 (UHBR10 / UHBR20)",
    bandwidth: "Up to 80.0 Gbps",
    maxResolutionHz: "4K 240Hz+ Uncompressed / 8K 165Hz",
    colorDepth: "10-bit / 12-bit RGB Native",
    dscSupport: "Didukung",
    notes: "Standar masa depan untuk monitor flagship OLED / GPU generasi terbaru (Radeon RX 7000 series, RTX 50 series)."
  }
];

export const FAQ_LIST: FAQItem[] = [
  {
    id: "faq-build-quality",
    question: "BUILD QUALITY PANEL NGARUH(?)",
    answer: "Sangat ngaruh! Ketebalan lapisan polarizer, kualitas lem panel, serta modul backlight menentukan seberapa awet monitor terhadap masalah garis horizontal/vertikal (dead lines) dan backlight bleed yang parah setelah 1-2 tahun pemakaian. Brand tier atas umumnya menggunakan panel grade A+ dengan Quality Control lebih ketat.",
    category: "Panel & Kualitas"
  },
  {
    id: "faq-ideal-monitor",
    question: "MENENTUKAN MONITOR YANG IDEAL",
    answer: "Monitor ideal ditentukan oleh 3 faktor: (1) Jarak pandang vs ukuran meja (meja kedalaman 60cm paling pas 24-27 inci), (2) Kemampuan spesifikasi kartu grafis / GPU (jangan paksakan 1440p jika VGA hanya GTX 1650/RX 6500), dan (3) Kebutuhan utama (esport fps butuh refresh tinggi + motion clarity, editing butuh sRGB/DCI-P3 akurat).",
    category: "Panduan Memilih",
    important: true
  },
  {
    id: "faq-optimal-settings",
    question: "OPTIMAL SETTINGS GUIDELINE",
    answer: "Untuk hampir semua monitor gaming: (1) Atur Overdrive ke level 'Medium' atau 'Fast' (hindari Fastest/Extreme agar tidak ada inverse ghosting), (2) Gunakan Preset sRGB / User Color D65 untuk akurasi warna natural, (3) Matikan fitur MPRT / 1ms Black Frame Insertion jika membuat layar redup atau flicker.",
    category: "Setting OSD"
  },
  {
    id: "faq-laptop-gaming",
    question: "LAPTOP GAMING = GIMMICK",
    answer: "Layar bawaan laptop gaming budget (di bawah 15 juta) seringkali memiliki akurasi warna rendah (hanya 45% NTSC / 62% sRGB) dan response time lambat (di atas 15-20ms) sehingga visual berbayang. Menghubungkan laptop ke monitor eksternal IPS 100% sRGB via DisplayPort/Type-C akan meningkatkan performa visual dan ergonomi secara drastis.",
    category: "Laptop & Setup"
  },
  {
    id: "faq-grayplasma-hz-tinggi",
    question: "GrayPlasma lebih menyarankan Hz tinggi dibanding cuma FHD 100-144Hz, gimana dong?",
    answer: "Di tahun 2026, selisih harga monitor 100Hz dengan 180Hz sudah sangat tipis (hanya selisih 100-200 ribu rupiah). Membeli 180Hz memberikan kelancaran (fluidity) gerakan kursor dan animasi yang jauh lebih responsif, serta panel 180Hz modern umumnya memiliki tuning Overdrive yang jauh lebih matang dibanding panel murah 100Hz.",
    category: "Refresh Rate"
  },
  {
    id: "faq-toleransi-lama-baru",
    question: "BANG ITU DATA LAMA (Toleransi lama) VS (Toleransi Baru) DATA BARU, ITU APAAN YA BANG?",
    answer: "Pada standar data pengujian baru di Glosarium GrayPlasma, batas toleransi Overshoot (inverse ghosting) diperketat maksimal di bawah 5% pada semua transisi warna. Jadi monitor yang di data lama tercatat 1ms bisa saja di data baru menjadi 4ms karena diuji pada overdrive yang bebas ghosting putih.",
    category: "Glosarium GrayPlasma",
    important: true
  },
  {
    id: "faq-luasan-vs-akurasi",
    question: "LUASAN ≠ AKURASI (WARNA)",
    answer: "Luasan Gamut (seperti 120% sRGB / 95% DCI-P3) HANYA menunjukkan seberapa lebar cakupan warna yang mampu diproduksi layar, BUKAN ketepatan warnanya! Jika monitor punya gamut luas tapi Delta E-nya di atas 7, maka warna kulit manusia atau warna logo bisa terlihat kemerahan/kehijauan (oversaturated) secara berlebihan. Akurasi diukur dari Delta E (deITP/de2000 < 3-5).",
    category: "Warna & Kalibrasi"
  },
  {
    id: "faq-skyworth-po",
    question: "BANG, SKYWORTH SERING (PO) PRE ORDER. BAIKNYA IKUT PO ATAU JANGAN?",
    answer: "Jika tidak buru-buru butuh monitor, ikut PO batch resmi Skyworth sangat menguntungkan karena harganya jauh lebih murah dan sering dapat bonus bracket/kabel. Namun pastikan membeli di toko resmi dengan estimasi kirim yang jelas dan garansi PT Skyworth Indonesia 3 tahun.",
    category: "Pembelian & Brand"
  },
  {
    id: "faq-ips-va-tn",
    question: "IPS, VA, TN? MANA YANG LEBIH BAIK?",
    answer: "1. IPS: Pilihan terbaik untuk 90% pengguna karena warna konsisten dari segala sudut dan response time cepat tanpa black smearing.\n2. VA: Cocok untuk menonton film di ruangan gelap berkat kontras tinggi (3000:1), namun rentan ghosting bayangan hitam pada objek gelap.\n3. TN: Sudah ditinggalkan di 2026 karena sudut pandang buruk dan warna pudar.",
    category: "Tipe Panel"
  },
  {
    id: "faq-main-fhd-di-2k",
    question: "BANG, KALO PAKE MONITOR 2K, MAIN DI FHD AMAN GA YA?",
    answer: "Bisa, namun tampilan akan sedikit lebih buram (soft/blurry) dibanding monitor FHD asli karena 1440p tidak terbagi genap menjadi 1080p (skala non-integer 1.33x). Solusinya di game adalah gunakan resolusi native 1440p lalu aktifkan DLSS / FSR pada mode Quality/Balanced agar FPS tetap tinggi namun gambar tetap tajam.",
    category: "Resolusi"
  },
  {
    id: "faq-beli-online-aman",
    question: "BELI MONITOR ONLINE AMAN?",
    answer: "Aman dengan 3 syarat wajib: (1) Beli di Official Store atau toko bintang 5 terpercaya, (2) Wajib centang Asuransi Pengiriman dan Bubble Wrap Kayu tambahan jika luar pulau, (3) Lakukan video unboxing utuh tanpa jeda dari paket tersegel sampai monitor menyala dan tes dead pixel.",
    category: "Belanja Online"
  },
  {
    id: "faq-100-srgb-1ms-gimmick",
    question: "100% sRGB / DCI-P3 & 1ms MPRT GIMMICK?",
    answer: "Ya, 1ms MPRT adalah klaim strobing yang membuat layar berkedip dan redup. Response time nyata panel IPS rata-rata adalah 3-7ms GtG. Jangan jadikan tulisan '1ms' di dus sebagai acuan tunggal; periksa data pengetesan GtG asli di tabel database kami.",
    category: "Gimmick Marketing"
  },
  {
    id: "faq-logo-grayplasma",
    question: "KOK BANYAK LOGO GP (GRAYPLASMA?)",
    answer: "Logo GP menandakan kurasi catatan dan anotasi khusus yang ditambahkan oleh Joel Gray (@gray1plasma) oleh tim GrayPlasma untuk melengkapi dan menyederhanakan data mentah pengetesan laboratorium GrayPlasma.",
    category: "Tentang GP"
  }
];

export const CONSULTATION_DATA = {
  author: "Joel Gray (@gray1plasma)",
  collaborators: "Tim GrayPlasma & Data Pengujian GrayPlasma",
  whatsapp: "0851-7979-4019",
  whatsappUrl: "https://wa.me/6285179794019",
  tiktok: "@gray1plasma",
  tiktokUrl: "https://www.tiktok.com/@gray1plasma",
  discordUrl: "https://discord.gg/joingtid",
  youtubeUrl: "https://www.youtube.com/c/GTiDtech/videos",
  notionUrl: "https://grayplasma.notion.site/GRAYPLASMAID-REKOMENDASI-MONITOR-4120d434aa8547d1a3626f9049b99c4e",
  feedbackFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeMGUEruo05yP4fjQAKttC-gRXk0VFXsud9XupfOgzX38JIpw/viewform",
  disclaimer: "DISCLAIMER : SELURUH LIST YANG ADA DI WEBSITE KATALOG INI PERLU DITANYAKAN KEMBALI KEPADA PENULIS, DIKARENAKAN PERLU MEMPERTIMBANGKAN ASPEK SEPERTI SPESIFIKASI PC DESKTOP ATAU LAPTOP, UKURAN MEJA, DAN KEBUTUHAN NYA SEPERTI APA, DSB.\n\nMULAI 15 AGUSTUS 2026, LINK TOKOPEDIA DAN TIKTOKSHOP AKAN DIHAPUS, DIKARENAKAN TERKADANG ERROR. JIKA INGIN MEMINTA LINK TOKOPEDIA DAN TIKTOKSHOP, DM DISCORD GRAYPLASMA ATAU TIKTOK @GRAY1PLASMA ATAU BERTANYA MELALUI WHATSAPP 0851-7979-4019 A/N JOEL GRAY (RESPON LEBIH CEPAT DISCORD)"
};

