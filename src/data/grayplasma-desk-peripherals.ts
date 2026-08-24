import { formatRupiah } from "@/lib/utils";

export interface DeskItem {
  id: string;
  name: string;
  category: "Daun Meja" | "Meja Standar" | "Meja Elektrik (Standing Desk)" | "Meja L-Shaped";
  price: number;
  type: string;
  description: string;
  notes: string;
  shopeeUrl: string;
  specs: {
    material: string;
    thickness: string;
    armSupport: boolean;
    dimensions: string;
  };
}

export interface PeripheralItem {
  id: string;
  name: string;
  category: "Monitor Arm / Bracket" | "Screenbar / Lampu Monitor" | "Mousepad / Deskmat" | "Cable Management" | "Audio & Aksesoris";
  price: number;
  brand: string;
  verdict: string;
  notes: string;
  shopeeUrl: string;
  recommendedFor: string;
}

export interface ConsultationResultItem {
  id: string;
  title: string;
  budget: number;
  specs: string;
  needs: string;
  recommendations: string[];
}

export const GIMMICK_MEJA_GAMING_CONTENT = {
  title: "GIMMICK 'MEJA GAMING' & PANDUAN MEMILIH MEJA BENAR",
  subtitle: "Hindari membeli meja tipis berstiker karbon yang mudah melengkung dan tidak kuat dijepit monitor arm!",
  poinPenting: [
    "Meja Gaming Murah (< Rp 700.000) umumnya menggunakan bahan Particle Board / Serbuk Kayu tipis (1.2cm - 1.5cm) yang sangat rapuh. Ketika dipasang Monitor Arm Gas Spring jepit, daun meja berisiko jebol/patah.",
    "Bentuk lekukan 'Ergonomic Curve' di depan meja gaming justru memakan ruang keyboard dan mousepad, serta membuat posisi pergelangan tangan tidak natural.",
    "Pilihlah daun meja berbahan Plywood (Multiplek) tebal minimal 2.5cm - 3cm atau Kayu Solid dengan rangka kaki besi hollow minimal 4x4cm.",
    "Jika budget terbatas (< Rp 700.000), opsi terbaik adalah membeli Daun Meja Plywood custom + Kaki Meja Besi Hollow secara terpisah."
  ]
};

export const DESK_DATABASE: DeskItem[] = [
  {
    id: "desk-1",
    name: "Daun Meja Custom Plywood / Multiplek Solid",
    category: "Daun Meja",
    price: 700000,
    type: "NON L-SHAPED (Custom Size)",
    description: "Daun meja multiplek tebal 3cm dengan finishing HPL anti gores & anti air. Sangat kuat dijepit monitor arm dual monitor.",
    notes: "Rekomendasi terbaik jika ingin merakit meja custom kuat tanpa takut jebol oleh clamp bracket.",
    shopeeUrl: "https://s.shopee.co.id/9KeR1yvvAu",
    specs: {
      material: "Multiplek / Plywood Grade A + HPL Taco",
      thickness: "3.0 cm (Sangat Tebal & Kuat)",
      armSupport: true,
      dimensions: "120x60cm / 140x70cm / 160x80cm"
    }
  },
  {
    id: "desk-2",
    name: "Meja Standar Kaki Hollow Besi 4x4 (Tanpa Laci)",
    category: "Meja Standar",
    price: 750000,
    type: "NON L-SHAPED",
    description: "Meja minimalis rangka besi hollow galvanis kokoh dengan daun meja multiplek tebal 2.5cm.",
    notes: "Kokoh, tidak goyang saat mengetik atau menggerakkan mouse secara agresif.",
    shopeeUrl: "https://s.shopee.co.id/9KeR1yvvAu",
    specs: {
      material: "Rangka Besi Hollow 4x4 + Daun Plywood",
      thickness: "2.5 cm",
      armSupport: true,
      dimensions: "120 x 60 x 75 cm"
    }
  },
  {
    id: "desk-3",
    name: "Meja Minimalis Heavy Duty 140x70",
    category: "Meja Standar",
    price: 950000,
    type: "NON L-SHAPED",
    description: "Meja kedalaman 70cm ideal untuk monitor 27 inci s/d 32 inci dengan ruang keyboard leluasa.",
    notes: "Kedalaman 70cm adalah sweetspot terbaik untuk jarak pandang monitor 2K / 4K.",
    shopeeUrl: "https://s.shopee.co.id/9KeR1yvvAu",
    specs: {
      material: "Rangka Besi Kotak + Plywood HPL",
      thickness: "3.0 cm",
      armSupport: true,
      dimensions: "140 x 70 x 75 cm"
    }
  },
  {
    id: "desk-4",
    name: "Meja Elektrik Standing Desk Single Motor",
    category: "Meja Elektrik (Standing Desk)",
    price: 2499000,
    type: "Adjustable Height (70cm - 118cm)",
    description: "Meja hidrolik elektrik dengan memory preset tinggi duduk & berdiri. Mencegah sakit pinggang.",
    notes: "Mampu menahan beban hingga 80kg (1-2 monitor + PC + audio speaker).",
    shopeeUrl: "https://s.shopee.co.id/9KeR1yvvAu",
    specs: {
      material: "Steel Frame Motorized + Solid Top",
      thickness: "2.5 cm",
      armSupport: true,
      dimensions: "120 x 60 cm"
    }
  },
  {
    id: "desk-5",
    name: "Meja Elektrik Dual Motor Heavy Duty 160x80",
    category: "Meja Elektrik (Standing Desk)",
    price: 3899000,
    type: "Dual Motor Ultra Smooth",
    description: "Standing desk dual motor dengan beban maksimal 120kg, anti-collision sensor, dan 4 memory height presets.",
    notes: "Pilihan flagship para kreator dan programmer setup multi-monitor.",
    shopeeUrl: "https://s.shopee.co.id/9KeR1yvvAu",
    specs: {
      material: "Dual Motor Steel Frame + Daun 160x80cm",
      thickness: "3.0 cm",
      armSupport: true,
      dimensions: "160 x 80 x 65-125 cm"
    }
  }
];

export const PERIPHERALS_DATABASE: PeripheralItem[] = [
  {
    id: "per-1",
    name: "North Bayou NB F80 (Gas Spring Single Arm)",
    category: "Monitor Arm / Bracket",
    price: 215000,
    brand: "North Bayou",
    verdict: "Standar emas monitor arm budget terbaik di Indonesia. Mampu menahan monitor 17\" s/d 30\" (beban 2-9 kg).",
    notes: "Mendukung VESA 75x75 & 100x100. Pemasangan clamp jepit meja atau grommet lubang meja.",
    shopeeUrl: "https://shopee.co.id",
    recommendedFor: "Monitor 24\" s/d 27\" (AOC 24G4, Xiaomi G24i, LG 27GP850)"
  },
  {
    id: "per-2",
    name: "North Bayou NB F100A (Heavy Duty Gas Spring Arm)",
    category: "Monitor Arm / Bracket",
    price: 375000,
    brand: "North Bayou",
    verdict: "Monitor arm heavy duty dengan jangkauan lebih panjang dan kapasitas beban hingga 12 kg.",
    notes: "Sangat direkomendasikan untuk monitor 32\" 4K, 34\" Ultrawide, atau monitor dengan stand berat.",
    shopeeUrl: "https://shopee.co.id",
    recommendedFor: "Monitor 32\" s/d 35\" Ultrawide & OLED Flagship"
  },
  {
    id: "per-3",
    name: "Oximus Hydra YD100 / Dual Arm",
    category: "Monitor Arm / Bracket",
    price: 340000,
    brand: "Oximus",
    verdict: "Monitor arm lokal bergaransi resmi dengan build quality kokoh dan manajemen kabel rapi.",
    notes: "Tersedia varian single arm dan dual arm untuk setup produktivitas.",
    shopeeUrl: "https://shopee.co.id",
    recommendedFor: "Setup 2 Monitor Kerja / Streaming"
  },
  {
    id: "per-4",
    name: "Baseus / Xiaomi Screenbar Monitor Light",
    category: "Screenbar / Lampu Monitor",
    price: 350000,
    brand: "Baseus / Xiaomi",
    verdict: "Lampu monitor asimetris yang menerangi area meja tanpa membuat silau atau pantulan di layar kaca monitor.",
    notes: "Sangat membantu mengurangi ketegangan mata (eye strain) saat bekerja malam hari.",
    shopeeUrl: "https://shopee.co.id",
    recommendedFor: "Semua jenis setup meja gaming & coding malam hari"
  },
  {
    id: "per-5",
    name: "Desk Mat / Mousepad Cordura 900x400x4mm",
    category: "Mousepad / Deskmat",
    price: 135000,
    brand: "Local Craft / Cordura",
    verdict: "Bahan tahan air, jahitan tepi rapi (stitched edge), dan base karet anti slip.",
    notes: "Melindungi permukaan meja dan memberikan tracking mouse gaming konsisten.",
    shopeeUrl: "https://shopee.co.id",
    recommendedFor: "Setup meja 120cm s/d 160cm"
  },
  {
    id: "per-6",
    name: "Under Desk Cable Management Tray",
    category: "Cable Management",
    price: 85000,
    brand: "Universal Steel Clamp",
    verdict: "Rak gantung besi jepit bawah meja untuk menaruh stop kontak colokan dan kabel adaptor tanpa melubangi meja.",
    notes: "Setup menjadi bersih dan bebas dari kabel berserakan di lantai.",
    shopeeUrl: "https://shopee.co.id",
    recommendedFor: "Semua meja kerja & gaming"
  }
];

export const CONSULTATION_RESULTS_DATABASE: ConsultationResultItem[] = [
  {
    id: "cons-1",
    title: "Paket Setup 25 Jt (Include Monitor OLED, Arm, & Meja)",
    budget: 25000000,
    specs: "PC Desktop Intel i7 / Ryzen 7 + RTX 4070 Super / 5060 Ti 16GB",
    needs: "Office, Game AAA, Motion Graphics, Competitive FPS",
    recommendations: [
      "Monitor: Dell Alienware AW2725DF (360Hz QD-OLED Gen 3) atau ASUS ROG PG27AQDM",
      "Monitor Arm: North Bayou F100A Heavy Duty",
      "Meja: Meja Elektrik Standing Desk 140x70 Plywood 3cm",
      "Aksesoris: Screenbar Lampu Asimetris + Cable Management Tray"
    ]
  },
  {
    id: "cons-2",
    title: "Paket Setup ~17 Jt (Include 2 Monitor, Meja, & Dual Arm)",
    budget: 17000000,
    specs: "PC / Laptop RTX 4060 + Mac Mini M2/M3",
    needs: "Software Development, Frontend / Fullstack Coding, Multitasking",
    recommendations: [
      "Monitor Utama: LG 27GP850-B (1440p 180Hz Nano IPS) / MSI MAG 274QRF-QD",
      "Monitor Sekunder: AOC 24G4 (1080p Fast IPS Mode Portrait)",
      "Bracket: Oximus Dual Arm Gas Spring",
      "Meja: Meja Besi Hollow 160x80 Tebal 3cm"
    ]
  },
  {
    id: "cons-3",
    title: "Paket Setup ~5-7 Jt (Include 1 Monitor 2K, Meja Kokoh, & Arm)",
    budget: 6500000,
    specs: "Laptop Gaming / PC Entry-Mid Level (RTX 3060 / RX 6600)",
    needs: "Gaming Esport, Kerja Harian, Mahasiswa / WFH",
    recommendations: [
      "Monitor: Xiaomi G24i (1080p 180Hz Delta E < 2) atau AOC 24G4 (Rp 1.6M - Rp 1.8M)",
      "Monitor Arm: North Bayou F80 Gas Spring (Rp 215k)",
      "Meja: Meja Minimalis Hollow 120x60 Plywood Solid (Rp 750k)",
      "Kabel: DisplayPort 1.4 VESA Certified (Rp 85k)"
    ]
  }
];
