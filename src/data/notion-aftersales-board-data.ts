import { NotionBoardCard, NotionBoardColumn } from "@/components/notion-kanban-board";

export const NOTION_AFTERSALES_COLUMNS: NotionBoardColumn[] = [
  {
    id: "baik",
    title: "BAIK (BARE MINIMUM)",
    color: "green",
    count: 3,
  },
  {
    id: "biasa",
    title: "BIASA SAJA",
    color: "gray",
    count: 2,
  },
  {
    id: "kurang",
    title: "KURANG BAIK",
    color: "red",
    count: 3,
  },
];

export const NOTION_AFTERSALES_CARDS: NotionBoardCard[] = [
  {
    id: "xiaomi",
    title: "XIAOMI MONITOR (SC XIAOMI)",
    columnId: "baik",
    tags: [
      { label: "BAIK (BARE MINIMUM)", color: "green" },
      { label: "TETAPI / DAN DIPERTANYAKAN", color: "orange" },
    ],
    contactUrl: "https://www.mi.co.id/id/support/service-centre/",
    phoneNumber: "Empty",
    sistemKlaim: "GANTI BARU",
    createdDate: "September 29, 2025 8:03 PM",
    deepDiveTitle: "KUALITAS AFTERSALES XIAOMI (MELALUI SERVICE CENTER XIAOMI)",
    pros: [
      "Tergolong Cepat, sekitar kurang dari seminggu proses Claim nya (Melalui Service Center Xiaomi)",
    ],
    cons: [
      "Disarankan menyimpan kelengkapan seperti Dus, Sterofoam di dalam dus, Buku Manual. Karena di beberapa kasus, diperlukan hal itu",
      "Menurut pandangan Penulis: Aftersales Xiaomi tergolong bagus dikarenakan sering dikritik (di-roasting) GrayPlasma, karena selain Produk Monitor, Aftersales Xiaomi tergolong Kurang",
      "Karena alasan di atas, penulis sedikit ragu mengenai masa depan Aftersales Monitor Xiaomi, dan sebaiknya waspada terhadap aftersales 1-3 tahun kedepan",
      "Ada berpotensi tidak dapat full refund jika pemakaian lebih dari 1 Tahun dan jika unit pengganti nya tidak ada",
    ],
    discordUrl: "https://discord.com/channels/856570745726566411/1504823610798379182",
  },
  {
    id: "asus",
    title: "ASUS MONITOR",
    columnId: "baik",
    tags: [
      { label: "BAIK (BARE MINIMUM)", color: "green" },
      { label: "1500 128", color: "gray" },
    ],
    contactUrl: "https://www.asus.com/id/support/callus/",
    phoneNumber: "1500 128",
    sistemKlaim: "SERVICE & SWAP RESMI",
    createdDate: "September 29, 2025 8:03 PM",
    deepDiveTitle: "KUALITAS AFTERSALES ASUS (SERVICE CENTER RESMI)",
    pros: [
      "Service center resmi tersebar di hampir seluruh kota besar di Indonesia",
      "Garansi 3 tahun mencakup sparepart dan panel",
      "Pelacakan status RMA transparan via website MyASUS",
    ],
    cons: [
      "Jika unit monitor tipe flagship / langka, terkadang menunggu pengiriman modul dari pusat",
      "Wajib menyertakan bukti invoice pembelian resmi saat klaim pertama",
    ],
    discordUrl: "https://discord.com/channels/856570745726566411/1504823610798379182",
  },
  {
    id: "msi",
    title: "MSI - MONITOR",
    columnId: "baik",
    tags: [
      { label: "BAIK (BARE MINIMUM)", color: "green" },
    ],
    contactUrl: "https://id.msi.com/page/service-location-new",
    phoneNumber: "Empty",
    sistemKlaim: "SERVICE & SWAP PUSAT",
    createdDate: "September 29, 2025 8:03 PM",
    deepDiveTitle: "KUALITAS AFTERSALES MSI (PT ALFA ARTHA ANDHAYA)",
    pros: [
      "Kualitas monitor sangat solid dan build quality kokoh",
      "Pusat service center di Jakarta & drop point di beberapa daerah",
    ],
    cons: [
      "Waktu RMA rata-rata 2 - 3 minggu jika ada part pengganti",
      "Disarankan simpan kelengkapan dus asli untuk proses retur yang lancar",
    ],
    discordUrl: "https://discord.com/channels/856570745726566411/1504823610798379182",
  },
  {
    id: "dell",
    title: "DELL MONITOR",
    columnId: "biasa",
    tags: [
      { label: "BIASA SAJA", color: "gray" },
      { label: "TETAPI / DAN DIPERTANYAKAN", color: "orange" },
    ],
    contactUrl: "https://www.dell.com/support/home/id-id",
    phoneNumber: "021-1500 858",
    sistemKlaim: "PROSUPPORT ONSITE SERVICE",
    createdDate: "September 29, 2025 8:03 PM",
    deepDiveTitle: "KUALITAS AFTERSALES DELL & ALIENWARE",
    pros: [
      "Layanan teknisi datang ke rumah (Onsite Next Business Day)",
      "Garansi 3 tahun ganti unit tanpa ribet untuk seri Ultrasharp / Alienware",
    ],
    cons: [
      "Memerlukan Service Tag yang valid dan terdaftar distributor resmi Indonesia",
      "Lini budget seri E/SE terkadang memiliki SLA yang berbeda dengan lini UltraSharp",
    ],
    discordUrl: "https://discord.com/channels/856570745726566411/1504823610798379182",
  },
  {
    id: "skyworth",
    title: "SKYWORTH MONITOR",
    columnId: "biasa",
    tags: [
      { label: "BIASA SAJA", color: "gray" },
    ],
    contactUrl: "https://datascrip.com/home/service_center",
    phoneNumber: "Empty",
    sistemKlaim: "DISTRIBUTOR DATASCRIP",
    createdDate: "September 29, 2025 8:03 PM",
    deepDiveTitle: "KUALITAS AFTERSALES SKYWORTH",
    pros: [
      "Didukung jaringan service center Datascrip yang tersebar di beberapa kota",
    ],
    cons: [
      "Ketersediaan modul sparepart bervariasi tergantung umur produk",
    ],
    discordUrl: "https://discord.com/channels/856570745726566411/1504823610798379182",
  },
  {
    id: "gigabyte",
    title: "GIGABYTE MONITOR",
    columnId: "kurang",
    tags: [
      { label: "KURANG BAIK", color: "red" },
      { label: "TETAPI / DAN DIPERTANYAKAN", color: "orange" },
    ],
    contactUrl: "https://www.gigabyte.com/id/Support/Customer/Warranty/Monitor",
    phoneNumber: "Empty",
    sistemKlaim: "DISTRIBUTOR RMA",
    createdDate: "September 29, 2025 8:03 PM",
    deepDiveTitle: "KUALITAS AFTERSALES GIGABYTE (DISTRIBUTOR RESMI)",
    pros: [
      "Fitur visual, tuning overdrive, dan KVM Switch monitor sangat baik",
    ],
    cons: [
      "Proses klaim RMA di beberapa kasus membutuhkan waktu lama dan konfirmasi ketersediaan stok modul pengganti",
      "Perlu konfirmasi ke distributor sebelum mengajukan servis untuk tipe langka",
    ],
    discordUrl: "https://discord.com/channels/856570745726566411/1504823610798379182",
  },
  {
    id: "viewsonic",
    title: "VIEWSONIC MONITOR",
    columnId: "kurang",
    tags: [
      { label: "KURANG BAIK", color: "red" },
    ],
    contactUrl: "https://www.viewsonic.com/id/support/warranty/asp",
    phoneNumber: "Empty",
    sistemKlaim: "DISTRIBUTOR SYNNEX METRODATA",
    createdDate: "September 29, 2025 8:03 PM",
    deepDiveTitle: "KUALITAS AFTERSALES VIEWSONIC",
    pros: [
      "Ada fasilitas pick-up service di kota tertentu",
    ],
    cons: [
      "Waktu tunggu modul panel tertentu terkadang memerlukan masa tunggu pengiriman",
    ],
    discordUrl: "https://discord.com/channels/856570745726566411/1504823610798379182",
  },
  {
    id: "aoc-philips",
    title: "AOC & PHILIPS MONITOR",
    columnId: "kurang",
    tags: [
      { label: "KURANG BAIK", color: "red" },
    ],
    contactUrl: "https://www.aoc.com/id/support",
    phoneNumber: "Empty",
    sistemKlaim: "INDEN SUKU CADANG (3-6 MINGGU)",
    createdDate: "September 29, 2025 8:03 PM",
    deepDiveTitle: "KUALITAS AFTERSALES AOC & PHILIPS (PT MKP)",
    pros: [
      "Kualitas warna dan responsivitas panel IPS sangat memuaskan di rentang harganya",
    ],
    cons: [
      "Pengajuan proses garansi relatif lama, bahkan bisa memakan waktu lebih dari 1 bulan jika suku cadang harus inden",
      "Riwayat masalah panel AOC 24G2 series yang tiba-tiba bergaris",
    ],
    discordUrl: "https://discord.com/channels/856570745726566411/1504823610798379182",
  },
];
