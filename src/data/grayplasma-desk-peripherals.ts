import { formatRupiah } from "@/lib/utils";

export interface DeskItem {
  id: string;
  name: string;
  category: "Daun Meja" | "Meja Standar" | "Meja Elektrik (Standing Desk)" | "Meja L-Shaped" | "Meja Nakas" | "Meja Lesehan";
  keterangan: string[];
  price: number;
  type: string; // "NON L SHAPED" | "L SHAPED"
  catatanBadge?: string; // "ADA (DISARANKAN MEMBACA NYA)"
  description: string;
  notes: string;
  markdownContent?: string;
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
  category: string;
  price: number;
  brand: string;
  type: string;
  versionDetail?: string;
  warranty: string;
  verdict: string;
  notes: string;
  shopeeUrl?: string;
  tokopediaUrl?: string;
  tiktokUrl?: string;
  recommendedFor?: string;
}

export interface ConsultationResultItem {
  id: string;
  clientName: string;
  consultationDate: string;
  gpuOrDevice: string;
  budget: string;
  useCase: string;
  chosenMonitor: string;
  verdictHighlight: string;
  reviewLink?: string;
}

export const GIMMICK_MEJA_GAMING_CONTENT = {
  title: "MENGAPA HINDARI MEJA GAMING BERBENTUK KOTAK RACING DENGAN KETEBALAN < 1.5 CM?",
  contentMarkdown: `# HINDARI MEJA GAMING TIPIS (< 1.5 CM) UNTUK BRACKET MONITOR ARM

> Standar Meja Kokoh GrayPlasma: Minimal Multiplek / Plywood 18-24mm Tahan Clamp Arm Gas-Spring

1. **Risiko Meja Jebol/Melengkung:** Meja gaming particle board murah (MDF tipis 12-15mm) sangat rentan retak saat dijepit monitor arm gas-spring (seperti North Bayou F80/H100/F100A).
2. **Gunakan Daun Meja Plywood HPL / Kayu Solid:** Lebih tahan air, tahan panas, dan kuat menahan beban 2-3 monitor sekaligus.
3. **Gunakan Plat Protektor Bracket (Oximus EV-06 / Steel Plate):** Menyebarkan titik tekanan clamp pada permukaan meja.`
};

export interface IdealSizeItem {
  id: string;
  monitorSize: string; // e.g. "24 INCH" | "24 INCH (DUAL 24 INCH)" | "27 INCH" | "27 INCH (DUAL 24 / 27 INCH)"
  deviceSetup: string; // e.g. "1 MONITOR, PC (DIBAWAH MEJA)"
  minDeskSize: string; // e.g. "120 × 60"
  idealDeskSize: string; // e.g. "120 × 70"
  shape: "NON - L SHAPED" | "L SHAPED";
}

export const IDEAL_DESK_MONITOR_SIZES: {
  size24: IdealSizeItem[];
  size27: IdealSizeItem[];
} = {
  size24: [
    {
      id: "size24-1",
      monitorSize: "24 INCH",
      deviceSetup: "1 MONITOR, PC (DIBAWAH MEJA)",
      minDeskSize: "120 × 60 cm",
      idealDeskSize: "120 × 70 cm",
      shape: "NON - L SHAPED"
    },
    {
      id: "size24-2",
      monitorSize: "24 INCH",
      deviceSetup: "1 MONITOR, PC (DI ATAS MEJA)",
      minDeskSize: "120 × 60 cm",
      idealDeskSize: "140 × 70 cm",
      shape: "NON - L SHAPED"
    },
    {
      id: "size24-3",
      monitorSize: "24 INCH",
      deviceSetup: "1 MONITOR, LAPTOP",
      minDeskSize: "120 × 60 cm",
      idealDeskSize: "140 × 70 cm",
      shape: "NON - L SHAPED"
    },
    {
      id: "size24-4",
      monitorSize: "24 INCH (DUAL 24 INCH)",
      deviceSetup: "2 MONITOR, LAPTOP",
      minDeskSize: "140 × 60 cm",
      idealDeskSize: "160 × 70 cm",
      shape: "NON - L SHAPED"
    },
    {
      id: "size24-5",
      monitorSize: "24 INCH (DUAL 24 INCH)",
      deviceSetup: "2 MONITOR, PC (DIBAWAH MEJA)",
      minDeskSize: "120 × 60 cm",
      idealDeskSize: "140 × 70 cm",
      shape: "NON - L SHAPED"
    },
    {
      id: "size24-6",
      monitorSize: "24 INCH (DUAL 24 INCH)",
      deviceSetup: "2 MONITOR, PC (DI ATAS MEJA)",
      minDeskSize: "140 × 60 cm",
      idealDeskSize: "160 × 70 cm",
      shape: "NON - L SHAPED"
    }
  ],
  size27: [
    {
      id: "size27-1",
      monitorSize: "27 INCH",
      deviceSetup: "1 MONITOR, PC (DIBAWAH MEJA)",
      minDeskSize: "120 × 70 cm",
      idealDeskSize: "140 × 70 cm",
      shape: "NON - L SHAPED"
    },
    {
      id: "size27-2",
      monitorSize: "27 INCH",
      deviceSetup: "1 MONITOR, PC (DI ATAS MEJA)",
      minDeskSize: "140 × 70 cm",
      idealDeskSize: "140 × 70 cm",
      shape: "NON - L SHAPED"
    },
    {
      id: "size27-3",
      monitorSize: "27 INCH",
      deviceSetup: "1 MONITOR, LAPTOP",
      minDeskSize: "140 × 70 cm",
      idealDeskSize: "140 × 70 cm",
      shape: "NON - L SHAPED"
    },
    {
      id: "size27-4",
      monitorSize: "27 INCH (DUAL 24 / 27 INCH)",
      deviceSetup: "2 MONITOR, PC (DI ATAS MEJA)",
      minDeskSize: "140 × 70 cm",
      idealDeskSize: "160 × 70 cm",
      shape: "NON - L SHAPED"
    },
    {
      id: "size27-5",
      monitorSize: "27 INCH (DUAL 24 / 27 INCH)",
      deviceSetup: "2 MONITOR, PC (DIBAWAH MEJA)",
      minDeskSize: "140 × 70 cm",
      idealDeskSize: "160 × 70 cm",
      shape: "NON - L SHAPED"
    },
    {
      id: "size27-6",
      monitorSize: "27 INCH (DUAL 24 / 27 INCH)",
      deviceSetup: "2 MONITOR, LAPTOP",
      minDeskSize: "140 × 70 cm",
      idealDeskSize: "160 × 70 cm",
      shape: "NON - L SHAPED"
    }
  ]
};

export const DESK_DATABASE: DeskItem[] = [
  {
    id: "desk-daun-meja-saja",
    name: "DAUN MEJA SAJA",
    category: "Daun Meja",
    keterangan: ["DAUN MEJA"],
    price: 700000,
    type: "NON L SHAPED",
    catatanBadge: "ADA (DISARANKAN MEMBACA NYA)",
    description: "Daun meja multiplek solid custom pilihan (Woody Star HPL / Tacosheet / Kayu Mahoni).",
    notes: "Minimum requirement meja yang ideal dipakaikan bracket jepit (Oximus P100E atau P200E).",
    markdownContent: `### Untuk Ukuran 120-140 x 60-70 cm (Tanpa Laci)

#### Catatan Penting:
- **INI ADALAH MINIMUM REQUIREMENT MEJA YANG IDEAL DIPAKAIKAN BRACKET JEPIT (Oximus P100E atau P200E)**
- Buat Daun meja (Kecuali FJL Jati), saran langsung pakai **laminating HPL**, karena dari segi bahan lebih tebal dan kokoh dibanding Tacosheet *(Tacosheet masih oke, tapi kurang tahan panas ketika ada cangkir berisi air panas di atas daun meja).*
- Untuk daun meja woodystar, jika ingin 70-80 cm dari sisi lebar, disarankan chat seller terlebih dahulu untuk request ukuran custom.

---

#### Pilihan Daun Meja Rekomendasi:
1. **Daun Meja Tipe Plywood HPL (Woody Star)**: [Buka Link Shopee](https://s.shopee.co.id/9KeR1yvvAu)
2. **(ATAU) Tipe Plywood Tacosheet (Woody Star)**: [Buka Link Shopee](https://s.shopee.co.id/7pqQX2E2Sf) *(Pilih ketebalan 3 cm)*
3. **(ATAU) Daun Meja Kayu Mahoni (Hiasan Dinding 89)**: [Buka Link Shopee](https://s.shopee.co.id/BRe7qnpkU) *(Pilih lebar 60 cm atau lebih, request custom panjang 140 cm)*`,
    shopeeUrl: "https://s.shopee.co.id/9KeR1yvvAu",
    specs: {
      material: "Plywood HPL / Kayu Mahoni / Tacosheet 3cm",
      thickness: "3.0 cm (Kuat Jepit Arm)",
      armSupport: true,
      dimensions: "120-140 x 60-70 cm"
    }
  },
  {
    id: "desk-meja-standar-1",
    name: "MEJA STANDAR 1 (TANPA LACI)",
    category: "Meja Standar",
    keterangan: ["DAUN MEJA", "KAKI MEJA HOLLOW"],
    price: 700000,
    type: "NON L SHAPED",
    catatanBadge: "ADA (DISARANKAN MEMBACA NYA)",
    description: "Kombinasi daun meja custom solid + Kaki Meja Hollow Model V (Burhan Las).",
    notes: "Disarankan mengambil tinggi kaki 70 cm dan beli 2 pcs (karena harga per 1 pcs).",
    markdownContent: `### Untuk Ukuran 120-140 x 60-70 cm (Tanpa Laci)

#### Catatan Penting:
- **INI ADALAH MINIMUM REQUIREMENT MEJA YANG IDEAL DIPAKAIKAN BRACKET JEPIT (Oximus P100E atau P200E)**
- Buat Daun meja (Kecuali FJL Jati), saran langsung pakai **laminating HPL** agar tahan panas dan kokoh.
- Disarankan kaki meja mengambil tinggi 70 cm, dan lebar menyesuaikan daun meja.
- Harga Kaki meja yang tertera adalah 1 pcs, bukan sepasang, jadi wajib beli 2 pcs.
- *Catatan kestabilan:* Daun meja 160 x 70 dengan kaki ini agak goyang jika tidak disenderkan ke dinding. Jika ingin daun 160cm, pilih Meja Standar 2.

---

#### Komponen Pembelian:
- **Daun Meja Plywood HPL (Woody Star)**: [Buka Link Shopee](https://s.shopee.co.id/9KeR1yvvAu)
- **(ATAU) Tipe Plywood Tacosheet 3cm**: [Buka Link Shopee](https://s.shopee.co.id/7pqQX2E2Sf)
- **(ATAU) Daun Kayu Mahoni**: [Buka Link Shopee](https://s.shopee.co.id/BRe7qnpkU)
- **+ Kaki Meja Model V (Burhan Las)**: [Buka Link Shopee](https://s.shopee.co.id/LjkxfO137)

**Estimasi Budget:** Rp 600.000 – Rp 800.000`,
    shopeeUrl: "https://s.shopee.co.id/9KeR1yvvAu",
    specs: {
      material: "Plywood HPL + Kaki Besi Hollow Model V",
      thickness: "3.0 cm",
      armSupport: true,
      dimensions: "120-140 x 60-70 cm"
    }
  },
  {
    id: "desk-meja-standar-2",
    name: "MEJA STANDAR 2 (TANPA LACI)",
    category: "Meja Standar",
    keterangan: ["DAUN MEJA", "KAKI MEJA HOLLOW"],
    price: 1000000,
    type: "NON L SHAPED",
    catatanBadge: "ADA (DISARANKAN MEMBACA NYA)",
    description: "Kombinasi Daun Meja HPL / FJL Jati + Kaki Meja T Kokoh Heavy Duty dari Segaris.ID.",
    notes: "Sangat stabil untuk daun meja 140cm s/d 160cm. Kurangi 20cm dari ukuran daun meja untuk kaki meja.",
    markdownContent: `### Untuk Ukuran 120-160 x 60-70 cm

#### Catatan Penting:
- Untuk daun meja ukuran 160 cm, ambil tipe kaki meja ukuran 140 cm.
- Untuk daun meja 140 cm, pilih tipe kaki meja 120 cm. Daun meja 120 cm pilih kaki meja 100 cm *(kurangi 20 cm dari ukuran daun meja).*
- Buat Daun meja disarankan memakai laminating HPL atau **FJL Kayu Jati** (Finishing tebal 3-4 cm).
- *Catatan pemasangan FJL Jati:* Wajib menggunakan bor listrik saat memasang baut karena kayunya sangat padat dan keras.

---

#### Komponen Pembelian:
- **Daun Meja Plywood HPL (Woody Star)**: [Buka Link Shopee](https://s.shopee.co.id/9KeR1yvvAu)
- **(ATAU) FJL Kayu Jati (Rumah Kayu Official, 3-4cm finishing)**: [Buka Link Shopee](https://s.shopee.co.id/Lkkyktg5m)
- **(ATAU) Daun Kayu Mahoni (Hiasan Dinding 89)**: [Buka Link Shopee](https://s.shopee.co.id/BRe7qnpkU)
- **+ Kaki Meja T (Segaris.ID, Pre-Order)**: [Buka Link Shopee](https://s.shopee.co.id/6L1y6fOp6m)

**Estimasi Budget:** Rp 900.000 – Rp 1.200.000`,
    shopeeUrl: "https://s.shopee.co.id/4LGBJg6u69",
    specs: {
      material: "Multiplek HPL / FJL Jati + Rangka Besi T Segaris",
      thickness: "3.0 - 4.0 cm",
      armSupport: true,
      dimensions: "120-160 x 60-70 cm"
    }
  },
  {
    id: "desk-meja-elektrik-1",
    name: "MEJA ELEKTRIK 1",
    category: "Meja Elektrik (Standing Desk)",
    keterangan: ["DAUN MEJA", "KAKI MEJA ELEKTRIK"],
    price: 1700000,
    type: "NON L SHAPED",
    catatanBadge: "ADA (DISARANKAN MEMBACA NYA)",
    description: "Paket Meja Elektrik Single Motor XPANSE 1 Set (Daun Meja + Kaki Elektrik).",
    notes: "Pilih ukuran 140x60 dengan opsi kayu Upgrade agar lebih tebal saat dijepit arm.",
    markdownContent: `### Meja Elektrik Single Motor 1 Set (XPANSE)

*Jika ingin 1 set lengkap (Daun Meja + Kaki Meja tanpa link terpisah)*

#### Catatan Penting:
- **Pilih ukuran 140 x 60 cm**, karena ukuran di bawah itu cukup tanggung untuk setup PC/Laptop + Monitor.
- Untuk kayu, **wajib pilih opsi UPGRADE** karena bahannya lebih tebal dan kokoh dibanding varian standar.
- Jika ingin memasang bracket monitor arm jepit tipe Oximus P100e atau sejenisnya, disarankan memakai adapter penguat **EV06**: [Link Shopee EV06](https://s.shopee.co.id/6L3ShUvFyA)

---

#### Link Pembelian:
- **Daun Meja + Kaki Meja Single Motor XPANSE**: [Buka Link Shopee](https://s.shopee.co.id/3qKZPDHDG7)

**Estimasi Budget:** Rp 1.500.000 – Rp 1.800.000`,
    shopeeUrl: "https://s.shopee.co.id/2g8Ksj9qMQ",
    specs: {
      material: "Steel Motorized Frame + Top Upgrade",
      thickness: "2.5 cm",
      armSupport: true,
      dimensions: "140 x 60 x 70-118 cm"
    }
  },
  {
    id: "desk-meja-elektrik-2",
    name: "MEJA ELEKTRIK 2",
    category: "Meja Elektrik (Standing Desk)",
    keterangan: ["DAUN MEJA", "KAKI MEJA ELEKTRIK"],
    price: 1700000,
    type: "NON L SHAPED",
    catatanBadge: "ADA (DISARANKAN MEMBACA NYA)",
    description: "Custom Racikan: Daun Meja HPL/Jati + Kaki Elektrik Oxihom T1 (Kaki Only).",
    notes: "Solusi bagi yang ingin standing desk kokoh tanpa daun meja MDF bawaan yang rentan jebol.",
    markdownContent: `### Custom Standing Desk (Kaki Oxihom T1 + Daun Custom Plywood HPL / FJL Jati)

*Jika skeptis dengan kualitas daun meja bundle bawaan pabrik (MDF)*

#### Catatan Penting:
- Daun meja bundle bawaan Oxihom T1 berbahan MDF (serbuk kayu press) yang kurang kuat menahan tekanan clamp bracket monitor arm.
- Menggunakan Daun Meja Custom Plywood HPL tebal 3cm atau FJL Jati 3-4cm memberikan ketahanan maksimal seumur hidup.
- Untuk FJL Jati, gunakan bor saat pemasangan skrup rangka kaki.

---

#### Komponen Pembelian:
- **Daun Meja Plywood HPL (Woody Star, 140-160cm)**: [Buka Link Shopee](https://s.shopee.co.id/9KeR1yvvAu)
- **(ATAU) FJL Kayu Jati 3-4cm (Rumah Kayu Official)**: [Buka Link Shopee](https://s.shopee.co.id/Lkkyktg5m)
- **(ATAU) Daun Kayu Mahoni (Hiasan Dinding 89)**: [Buka Link Shopee](https://s.shopee.co.id/BRe7qnpkU)
- **+ Kaki Meja Oxihom T1 (Tipe Kaki Only - Hitam/Putih)**: [Buka Link Shopee](https://s.shopee.co.id/70J9UCjAJT)

**Estimasi Budget:** Rp 1.500.000 – Rp 1.800.000`,
    shopeeUrl: "https://s.shopee.co.id/2g8Ksj9qMQ",
    specs: {
      material: "Plywood HPL / FJL Jati 3cm + Kaki Motor Oxihom T1",
      thickness: "3.0 - 4.0 cm",
      armSupport: true,
      dimensions: "140-160 x 60-70 cm"
    }
  },
  {
    id: "desk-meja-elektrik-3",
    name: "MEJA ELEKTRIK 3",
    category: "Meja Elektrik (Standing Desk)",
    keterangan: ["DAUN MEJA", "KAKI MEJA ELEKTRIK"],
    price: 3000000,
    type: "NON L SHAPED",
    catatanBadge: "ADA (DISARANKAN MEMBACA NYA)",
    description: "Standing Desk Dual Motor Flagship Oxihom FL40 + Daun Meja 140x70 / 160x80.",
    notes: "Pilihan paling kokoh, dual motor sangat stabil, garansi resmi 2 tahun, beban hingga 120kg.",
    markdownContent: `### Meja Elektrik Dual Motor Oxihom FL40 + Daun Meja 140-180 cm

*Setup impian kreator & power-user: Dual Motor Ultra Smooth dengan kapasitas beban tinggi*

#### Catatan Penting:
- Ukuran minimal daun meja ideal adalah **140 x 70 cm** dan maksimal **180 x 80 cm**.
- Kaki meja **Oxihom FL40 (Dual Motor)** memiliki sertifikasi garansi 2 tahun dan sangat stabil di ketinggian maksimal tanpa goyang.
- Telah diuji dan direkomendasikan langsung oleh member Discord GTID.

---

#### Komponen Pembelian:
- **Daun Meja Plywood HPL (Woody Star)**: [Buka Link Shopee](https://s.shopee.co.id/9KeR1yvvAu)
- **(ATAU) FJL Kayu Jati (Rumah Kayu Official, 3-4cm tebal)**: [Buka Link Shopee](https://s.shopee.co.id/Lkkyktg5m)
- **(ATAU) Daun Kayu Mahoni 150cm**: [Buka Link Shopee](https://s.shopee.co.id/BRe7qnpkU)
- **+ Kaki Meja Dual Motor Oxihom FL40 (Garansi 2 Tahun)**: [Buka Link Shopee](https://s.shopee.co.id/5L9NC8l84j)

**Testimoni Discord:**
[Lihat Review Member Discord GTID](https://discord.com/channels/856570745726566411/1417101046479847565/1473011994402488582)`,
    shopeeUrl: "https://s.shopee.co.id/LjkxfO137",
    specs: {
      material: "Oxihom FL40 Dual Motor + Plywood HPL / FJL Jati",
      thickness: "3.0 - 4.0 cm",
      armSupport: true,
      dimensions: "140-180 x 70-80 cm"
    }
  },
  {
    id: "desk-meja-elektrik-4-lshaped",
    name: "MEJA ELEKTRIK 4 (L SHAPED, $$$)",
    category: "Meja L-Shaped",
    keterangan: ["DAUN MEJA", "KAKI MEJA ELEKTRIK"],
    price: 8900000,
    type: "L SHAPED",
    catatanBadge: "ADA (DISARANKAN MEMBACA NYA)",
    description: "UDESK PRO MAX Triple Motor Standing Desk L-Shaped (Garansi 3 Tahun).",
    notes: "Setup sudut L-Shaped kelas premium dengan 3 motor penggerak dan kapasitas beban hingga 180kg.",
    markdownContent: `### UDESK PRO MAX (TRIPLE MOTOR, 3 YEARS WARRANTY)

*Setup sudut L-Shaped terbaik untuk produktivitas multi-monitor tanpa kompromi*

#### Denah & Dimensi Daun Meja:
Karena bentuknya L-Shaped, ukuran daun meja cukup kompleks dan disarankan memesan custom ke pengrajin kayu solid (Rumah Kayu Official).

#### Komponen Pembelian:
- **Daun Meja L-Shaped FJL Kayu Jati (Rumah Kayu Official)**:
  *(Pilih ketebalan 3-4 cm dan sudah finishing. Chat seller untuk deal harga sesuai denah daun meja L-Shaped)*
  [Buka Link Shopee Kayu](https://s.shopee.co.id/Lkkyktg5m)
- **+ Kaki Meja UDesk Pro Max (Triple Motor)**:
  [Buka Link Shopee UDesk](https://s.shopee.co.id/1LfBwolxd0)`,
    shopeeUrl: "https://s.shopee.co.id/1LfBwolxd0",
    specs: {
      material: "UDesk Triple Motor Frame + FJL Jati L-Shape",
      thickness: "3.5 cm",
      armSupport: true,
      dimensions: "Custom L-Shaped (160-200 x 120-140 cm)"
    }
  },
  {
    id: "desk-meja-nakas-1",
    name: "MEJA NAKAS 1",
    category: "Meja Nakas",
    keterangan: ["MEJA + LACI (NAKAS)", "PLYWOOD (TACOSHEET)"],
    price: 1250000,
    type: "NON L-SHAPED",
    catatanBadge: "ADA (DISARANKAN MEMBACA NYA)",
    description: "Meja kerja dengan laci nakas penyimpanan terintegrasi ukuran 160-180 x 70 cm.",
    notes: "Laminating Tacosheet, disarankan hindari meletakkan cangkir air panas langsung tanpa tatakan.",
    markdownContent: `### Meja Kerja dengan Laci Nakas (Galaxy Furniture Jepara)

*Ukuran 160 – 180 cm x 70 cm*

#### Catatan:
- Laminating meja masih menggunakan **TACOSHEET**, jadi disarankan selalu gunakan coaster / tatakan cangkir saat meletakkan minuman panas di atas meja agar lapisan tidak bergelombang.

---

#### Link Pembelian:
- **Meja Nakas Galaxy Furniture Jepara**: [Buka Link Shopee](https://s.shopee.co.id/8pjMXZTOMv)`,
    shopeeUrl: "https://s.shopee.co.id/9UyFYcSz4d",
    specs: {
      material: "Plywood Tacosheet + Drawer Nakas",
      thickness: "2.5 cm",
      armSupport: true,
      dimensions: "160-180 x 70 x 75 cm"
    }
  },
  {
    id: "desk-meja-nakas-2",
    name: "MEJA NAKAS 2 (UKURAN BESAR, TBC)",
    category: "Meja Nakas",
    keterangan: ["MEJA + LACI (NAKAS)", "PLYWOOD (TACOSHEET)"],
    price: 1650000,
    type: "NON L-SHAPED",
    catatanBadge: "ADA (DISARANKAN MEMBACA NYA)",
    description: "Meja Nakas Panjang 180-200 cm x lebar 60-70 cm untuk setup ekstra lega.",
    notes: "Pilih lebar minimal 60cm, jika ingin 70cm silakan chat seller untuk penyesuaian harga.",
    markdownContent: `### Meja Nakas Ukuran Besar (Galaxy Furniture Jepara)

*Ukuran 180 – 200 x 60 cm*

#### Catatan:
- Pilih ukuran lebar minimal 60 cm *(di bawah 60 cm terlalu sempit untuk meletakkan monitor dan keyboard).*
- Jika ingin lebar meja 70 cm, disarankan chat seller terlebih dahulu untuk kesepakatan harga custom.

---

#### Link Pembelian:
- **Ukuran 200 x 60 cm (Galaxy Furniture Jepara)**: [Buka Link Shopee](https://s.shopee.co.id/3VjeYBMsj6)`,
    shopeeUrl: "https://s.shopee.co.id/3VjeYBMsj6",
    specs: {
      material: "Plywood Tacosheet + Nakas Besar",
      thickness: "2.5 cm",
      armSupport: true,
      dimensions: "180-200 x 60-70 x 75 cm"
    }
  },
  {
    id: "desk-meja-lesehan-1",
    name: "MEJA LESEHAN 1",
    category: "Meja Lesehan",
    keterangan: ["MEJA + LACI (NAKAS)", "KAKI MEJA HOLLOW"],
    price: 450000,
    type: "NON L-SHAPED",
    catatanBadge: "ADA (DISARANKAN MEMBACA NYA)",
    description: "Meja kerja lesehan minimalis ukuran 120 x 60 cm dengan pilihan tinggi 32cm atau 45cm.",
    notes: "Tidak disarankan memakai Bracket Jepit karena kaki kecil dan berisiko jatuh.",
    markdownContent: `### Meja Kerja Lesehan 120 x 60 cm

#### Catatan:
- **Peringatan Bracket:** Tidak disarankan menggunakan Bracket Monitor Arm Jepit pada meja lesehan ini karena diameter kaki meja yang kecil dan terdapat risiko kestabilan/jatuh.

---

#### Link Pembelian:
- **Pilihan Tinggi 32 cm**: [Buka Link Shopee](https://s.shopee.co.id/4fvOPqdRau)
- **Pilihan Tinggi 45 cm**: [Buka Link Shopee](https://s.shopee.co.id/2gAK2LFwNZ)`,
    shopeeUrl: "https://s.shopee.co.id/4fvOPqdRau",
    specs: {
      material: "Plywood + Kaki Hollow Lesehan",
      thickness: "2.0 cm",
      armSupport: false,
      dimensions: "120 x 60 x 32/45 cm"
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
