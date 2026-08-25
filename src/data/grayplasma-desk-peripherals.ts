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
  category: "Monitor Arm / Bracket" | "Screenbar / Lampu Monitor" | "Mousepad / Deskmat" | "Cable Management" | "Audio & Aksesoris" | "Kabel HDMI / DP";
  price: number;
  brand: string;
  type?: string;
  versionDetail?: string;
  warranty?: string;
  verdict: string;
  notes: string;
  shopeeUrl: string;
  tokopediaUrl?: string;
  tiktokUrl?: string;
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
    id: "per-cabletime-ch24",
    name: "Cabletime CH24 HDMI 2.0",
    category: "Kabel HDMI / DP",
    price: 40000,
    brand: "Cabletime",
    type: "HDMI to HDMI",
    versionDetail: "HDMI 2.0 (18 Gbps)",
    warranty: "2 Tahun",
    verdict: "Kabel HDMI 2.0 budget berkualitas dengan konektor gold plated dan nylon braided.",
    notes: "Mendukung 1080p 240Hz / 1440p 144Hz 8-bit.",
    shopeeUrl: "https://s.shopee.co.id/8DKioNqC9",
    tokopediaUrl: "https://tk.tokopedia.com/zSm6of96p/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...IT2ou/",
    recommendedFor: "Monitor FHD 100-180Hz / Console PS4"
  },
  {
    id: "per-cabletime-minidp",
    name: "Cabletime Mini DisplayPort to DisplayPort 1.4",
    category: "Kabel HDMI / DP",
    price: 89000,
    brand: "Cabletime",
    type: "Mini DP to DisplayPort",
    versionDetail: "DisplayPort 1.4",
    warranty: "2 Tahun",
    verdict: "Kabel penghubung laptop gaming/Mac lawas dengan port Mini DP ke monitor eksternal 144Hz - 240Hz.",
    notes: "Support G-Sync Compatible NVIDIA.",
    shopeeUrl: "https://s.shopee.co.id/2VdLO2wuaG",
    tokopediaUrl: "https://tk.tokopedia.com/zSm6oKxdJ/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...LJRvW/",
    recommendedFor: "Laptop Gaming Mini-DP ke Monitor 144Hz+"
  },
  {
    id: "per-cabletime-ch21",
    name: "Cabletime CH21 HDMI 2.0 (Slim)",
    category: "Kabel HDMI / DP",
    price: 90000,
    brand: "Cabletime",
    type: "HDMI to HDMI",
    versionDetail: "HDMI 2.0 (18 Gbps)",
    warranty: "2 Tahun",
    verdict: "Kabel HDMI 2.0 desain ultra slim, lentur dan mudah diatur di cable management arm.",
    notes: "Diameter kabel tipis 4.5mm sangat fleksibel.",
    shopeeUrl: "https://s.shopee.co.id/3VUaDgjkPB",
    tokopediaUrl: "https://tk.tokopedia.com/zSMm1dth9g/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...owtco/",
    recommendedFor: "Setup Meja Minimalis / Kabel Arm Rapi"
  },
  {
    id: "per-oximus-ev06",
    name: "Oximus EV06 (Protektor Bracket Meja)",
    category: "Monitor Arm / Bracket",
    price: 90000,
    brand: "Oximus",
    type: "Bracket Jepit Meja",
    versionDetail: "Pengaman Daun Meja",
    warranty: "Non-Warranty",
    verdict: "Plat besi penguat clamp monitor arm agar tekanan jepit merata dan tidak merusak daun meja.",
    notes: "Sangat wajib jika daun meja tipis atau berbahan particle board.",
    shopeeUrl: "https://s.shopee.co.id/3LDXAsymG4",
    tokopediaUrl: "https://tk.tokopedia.com/zSQ855REp/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...IsGbM/",
    recommendedFor: "Semua Pengguna Monitor Arm Gas Spring"
  },
  {
    id: "per-cabletime-ch11",
    name: "Cabletime CH11 HDMI 2.1",
    category: "Kabel HDMI / DP",
    price: 95000,
    brand: "Cabletime",
    type: "HDMI to HDMI",
    versionDetail: "HDMI 2.1 (48 Gbps)",
    warranty: "2 Tahun",
    verdict: "Kabel HDMI 2.1 Ultra High Speed 48 Gbps bersertifikasi untuk 4K 120Hz/144Hz dan PS5 / Xbox Series X.",
    notes: "Support eARC, VRR, ALLM, Dynamic HDR.",
    shopeeUrl: "https://s.shopee.co.id/1g3wLxUNxF",
    tokopediaUrl: "https://tk.tokopedia.com/zSM6onuwm/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...V725x/",
    recommendedFor: "Console PS5 & Monitor 4K 144Hz"
  },
  {
    id: "per-cabletime-cd11",
    name: "Cabletime CD11 DisplayPort 1.4",
    category: "Kabel HDMI / DP",
    price: 95000,
    brand: "Cabletime",
    type: "DisplayPort to DisplayPort",
    versionDetail: "DisplayPort 1.4",
    warranty: "2 Tahun",
    verdict: "Kabel DisplayPort 1.4 standar emas PC gaming dengan bandwidth 32.4 Gbps + DSC support.",
    notes: "Mendukung 1440p 240Hz, 4K 144Hz, dan G-Sync penuh.",
    shopeeUrl: "https://s.shopee.co.id/4Vd6oGupj/",
    tokopediaUrl: "https://tk.tokopedia.com/zSm6oGuPj/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...unno3/",
    recommendedFor: "Monitor Gaming 1440p 180-240Hz & Esport"
  },
  {
    id: "per-cabletime-ch14",
    name: "Cabletime CH14 HDMI 2.1 (Slim)",
    category: "Kabel HDMI / DP",
    price: 99000,
    brand: "Cabletime",
    type: "HDMI to HDMI",
    versionDetail: "HDMI 2.1 (48 Gbps)",
    warranty: "2 Tahun",
    verdict: "Kabel HDMI 2.1 slim 48 Gbps lentur untuk setup monitor gaming resolusi tinggi.",
    notes: "Bisa untuk 8K 60Hz atau 4K 144Hz.",
    shopeeUrl: "https://s.shopee.co.id/4Akh0zEN8L",
    tokopediaUrl: "https://tk.tokopedia.com/zSMm1M1kv/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...yoCNr/",
    recommendedFor: "Setup 4K Gaming & Monitor OLED"
  },
  {
    id: "per-lindy-hdmi-black",
    name: "Lindy HDMI 2.1 Black",
    category: "Kabel HDMI / DP",
    price: 110000,
    brand: "Lindy",
    type: "HDMI to HDMI",
    versionDetail: "HDMI 2.1 (48 Gbps)",
    warranty: "2 Tahun",
    verdict: "Brand Jerman terkenal dengan shielding elektromagnetik kuat dan kualitas sinyal tanpa interferensi.",
    notes: "Standar industrial broadcast & high-end audio visual.",
    shopeeUrl: "https://s.shopee.co.id/20cFSBRLaf",
    tokopediaUrl: "https://tk.tokopedia.com/zSm99NeTn/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...bgpUm/",
    recommendedFor: "Setup High-End Studio & Gaming"
  },
  {
    id: "per-cabletime-cd13",
    name: "Cabletime CD13 DisplayPort 2.1",
    category: "Kabel HDMI / DP",
    price: 140000,
    brand: "Cabletime",
    type: "DisplayPort to DisplayPort",
    versionDetail: "DisplayPort 2.1 (UHBR 20 80 Gbps)",
    warranty: "2 Tahun",
    verdict: "Kabel DP 2.1 generasi terbaru dengan kapasitas bandwidth raksasa 80 Gbps.",
    notes: "Future-proof untuk monitor 4K 240Hz uncompressed / OLED Gen 3.",
    shopeeUrl: "https://s.shopee.co.id/9ziAYjR5yi",
    tokopediaUrl: "https://tk.tokopedia.com/zSMm1HdX2/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...8xGKD/",
    recommendedFor: "Monitor Flagship OLED 240Hz - 360Hz"
  },
  {
    id: "per-ugreen-c-to-dp",
    name: "UGreen Type-C to DisplayPort 1.4",
    category: "Kabel HDMI / DP",
    price: 190000,
    brand: "UGreen",
    type: "C to DisplayPort",
    versionDetail: "DisplayPort 1.4",
    warranty: "2 Tahun",
    verdict: "Kabel konverter Type-C Thunderbolt / DisplayPort Alt Mode ke DisplayPort monitor.",
    notes: "Ideal untuk MacBook M1/M2/M3 dan laptop modern yang tidak punya port DP besar.",
    shopeeUrl: "https://s.shopee.co.id/5L895HsWA2",
    tokopediaUrl: "https://tk.tokopedia.com/zUfkdb/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...Ufkdb/",
    recommendedFor: "MacBook & Laptop Gaming Type-C ke Monitor"
  },
  {
    id: "per-lindy-hdmi-anthra",
    name: "Lindy HDMI 2.1 (FRL) Anthra Certified",
    category: "Kabel HDMI / DP",
    price: 200000,
    brand: "Lindy",
    type: "HDMI to HDMI",
    versionDetail: "HDMI 2.1 (48 Gbps)",
    warranty: "2 Tahun",
    verdict: "Kabel HDMI bersertifikasi resmi Ultra High Speed HDMI Forum dengan shielding lapis ganda.",
    notes: "Bebas dari masalah black screen flicker.",
    shopeeUrl: "https://s.shopee.co.id/5AZG430h1e",
    tokopediaUrl: "https://tk.tokopedia.com/zSQ8StKsU/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...Gqksm/",
    recommendedFor: "OLED TV & Flagship 4K Monitor"
  },
  {
    id: "per-oximus-p100e",
    name: "Oximus P100E (Gas Spring Single Arm)",
    category: "Monitor Arm / Bracket",
    price: 240000,
    brand: "Oximus",
    type: "Bracket Jepit Meja (Tiang)",
    versionDetail: "Single Arm (Pegas)",
    warranty: "Non-Warranty",
    verdict: "Monitor arm sistem tiang + pegas gas spring fleksibel buatan brand lokal terpercaya.",
    notes: "Beban maksimal 9kg, VESA 75/100, jepit meja atau grommet.",
    shopeeUrl: "https://s.shopee.co.id/7AKKJOXROP",
    tokopediaUrl: "https://tk.tokopedia.com/zSMm1uqdy/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...SiGum/",
    recommendedFor: "Monitor 24\" - 27\" (AOC 24G4, KOORUI, LG)"
  },
  {
    id: "per-cabletime-cc23",
    name: "Cabletime CC23 C to DP (DP 1.4)",
    category: "Kabel HDMI / DP",
    price: 240000,
    brand: "Cabletime",
    type: "C to DisplayPort",
    versionDetail: "DisplayPort 1.4",
    warranty: "2 Tahun",
    verdict: "Kabel Type-C to DisplayPort 1.4 premium dengan housing aluminium kokoh.",
    notes: "Support 8K 60Hz / 4K 144Hz / 1440p 240Hz + HDR10.",
    shopeeUrl: "https://s.shopee.co.id/7paWxbIWGA",
    tokopediaUrl: "https://tk.tokopedia.com/zSMm1Ag7e/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...xAePg/",
    recommendedFor: "Laptop Gaming & Handheld ROG Ally/Legion Go"
  },
  {
    id: "per-lindy-dp-anthra",
    name: "Lindy DisplayPort 1.4 Anthra",
    category: "Kabel HDMI / DP",
    price: 300000,
    brand: "Lindy",
    type: "DisplayPort to DisplayPort",
    versionDetail: "DisplayPort 1.4",
    warranty: "2 Tahun",
    verdict: "Kabel DP 1.4 premium dengan konduktor tembaga OFC 99.99% bebas oksigen untuk sinyal murni.",
    notes: "Mencegah drop sinyal pada refresh rate ekstrim 240Hz–360Hz.",
    shopeeUrl: "https://s.shopee.co.id/1Y6Lr7MoW",
    tokopediaUrl: "https://tk.tokopedia.com/zSQ89VxrX/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...V3ecZ/",
    recommendedFor: "Esport 240Hz/360Hz & Studio Color Grading"
  },
  {
    id: "per-oximus-p810",
    name: "Oximus P810 Ergonomic Stand",
    category: "Monitor Arm / Bracket",
    price: 400000,
    brand: "Oximus",
    type: "Ergonomic Stand",
    versionDetail: "Single Arm (Pegas)",
    warranty: "Non-Warranty",
    verdict: "Stand monitor meja universal pengganti kaki monitor bawaan yang kaku.",
    notes: "Bisa tilt, swivel, pivot 90 derajat portrait tanpa jepit meja.",
    shopeeUrl: "https://s.shopee.co.id/6KorkC570M",
    tokopediaUrl: "https://tk.tokopedia.com/zSQ8Arral/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...D6Sp1/",
    recommendedFor: "Meja Kaca/Tertutup yang tidak bisa dijepit Arm"
  },
  {
    id: "per-oximus-p200e",
    name: "Oximus P200E Dual Arm Monitor Bracket",
    category: "Monitor Arm / Bracket",
    price: 500000,
    brand: "Oximus",
    type: "Bracket Jepit Meja (Tiang)",
    versionDetail: "Double Arm (Pegas)",
    warranty: "Non-Warranty",
    verdict: "Bracket dua monitor tiang kokoh dengan dua lengan gas spring independen.",
    notes: "Mendukung setup 2 layar 24-27 inci horizontal maupun vertikal.",
    shopeeUrl: "https://s.shopee.co.id/3q734pzPu8",
    tokopediaUrl: "https://tk.tokopedia.com/zSQ8ARJPb/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...Oh1I6/",
    recommendedFor: "Setup 2 Monitor Kerja, Coding, & Streamer"
  },
  {
    id: "per-cabletime-ct40",
    name: "Cabletime CT40 (Thunderbolt 4 / C to C)",
    category: "Kabel HDMI / DP",
    price: 570000,
    brand: "Cabletime",
    type: "C to C Thunderbolt",
    versionDetail: "Thunderbolt 4 (40Gbps)",
    warranty: "2 Tahun",
    verdict: "Kabel Thunderbolt 4 ultra fast 40 Gbps dengan dukungan Power Delivery hingga 100W/240W.",
    notes: "1 kabel untuk transmisi display 8K + data super cepat + charging laptop.",
    shopeeUrl: "https://s.shopee.co.id/9KRzd0yWAW",
    tokopediaUrl: "https://tk.tokopedia.com/zSMm1P2ej/",
    tiktokUrl: "https://vt.tokopedia.com/t/Z...NUke/",
    recommendedFor: "Monitor USB-C Hub & Apple Studio Display"
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
