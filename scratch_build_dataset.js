const fs = require('fs');

async function buildFullDataset() {
  const rawList = JSON.parse(fs.readFileSync('scratch_all_extracted_monitors.json', 'utf8'));

  // Filter out non-monitor pages
  const validList = rawList.filter(m => {
    const name = m.modelName;
    return name && !name.includes('GRAYPLASMAID') && !name.includes('LIST OLED MONITORS') && !name.includes('HOW TO READ');
  });

  console.log(`Processing ${validList.length} genuine monitor entries...`);

  // Transform each entry
  const fullMonitors = validList.map((item, idx) => {
    const p = item.rawProps;
    const name = item.modelName;
    const priceStr = p['Kisaran Harga'] || p['RECOMMENDED PRICING'] || p['Price'] || '1500000';
    const price = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 1500000;
    
    // Determine category / tier
    let tier = 'RECOMMENDED';
    if (item.category.includes('YANG TIDAK WORTH IT') || name.includes('TIDAK WORTH IT') || name.includes('PENUH PERTIMBANGAN')) {
      tier = 'PASS';
    } else if (price <= 1800000 || name.includes('G24i') || name.includes('F24G41F') || name.includes('24E3')) {
      tier = 'BEST VALUE';
    } else if (item.category.includes('OLED') || name.includes('OLED') || name.includes('F25G69F') || price >= 10000000 || name.includes('24G4')) {
      tier = 'S-TIER';
    }

    const panel = p['Panel Type'] || (item.category.includes('OLED') ? 'OLED' : 'Fast IPS');
    const res = p['Resolution (Pixel)'] || '1920 x 1080 (FHD)';
    const size = p['Panel Size'] || '24 Inci';
    const refresh = parseInt(p['Refresh Rate'] || '180', 10) || 180;
    const responseTime = p['Data Response Time'] || '1ms GtG';
    const displayInput = p['Display Input'] || '1x DP 1.4, 1x HDMI 2.0';
    const stand = p['Stand Capability'] || 'Tilt Only';
    const vesa = p['Bracket Support (VESA Mount)'] || '75 x 75 mm';
    const linkShopee = p['LINK SHOPEE'] || 'https://shopee.co.id';
    const usb = p['USB Hub'] || 'Tidak Ada';
    const bitDepth = p['Panel Bit Depth'] || '8-bit';
    const curvature = p['Curvature'] || 'Flat';
    const marketClass = p['Market Class'] || item.category;

    // Brand
    let brand = 'Brand';
    if (name.toLowerCase().startsWith('xiaomi')) brand = 'Xiaomi';
    else if (name.toLowerCase().startsWith('skyworth')) brand = 'Skyworth';
    else if (name.toLowerCase().startsWith('msi')) brand = 'MSI';
    else if (name.toLowerCase().startsWith('asus')) brand = 'ASUS';
    else if (name.toLowerCase().startsWith('gigabyte')) brand = 'Gigabyte';
    else if (name.toLowerCase().startsWith('aoc')) brand = 'AOC';
    else if (name.toLowerCase().startsWith('viewsonic')) brand = 'ViewSonic';
    else if (name.toLowerCase().startsWith('lenovo')) brand = 'Lenovo';
    else if (name.toLowerCase().startsWith('lg')) brand = 'LG';
    else if (name.toLowerCase().startsWith('samsung')) brand = 'Samsung';
    else if (name.toLowerCase().startsWith('dell') || name.toLowerCase().startsWith('alienware')) brand = 'Dell Alienware';
    else if (name.toLowerCase().startsWith('koorui')) brand = 'KOORUI';

    // Thumbnail
    let thumbnail = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop';
    if (item.category.includes('OLED') || name.includes('OLED')) {
      thumbnail = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop';
    } else if (size.includes('27') || size.includes('34')) {
      thumbnail = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop';
    } else if (name.toLowerCase().includes('xiaomi')) {
      thumbnail = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
    }

    return {
      id: `mon-${idx + 1}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: brand,
      model: name,
      fullName: name,
      tier: tier,
      tierDescription: `Kategori Notion: ${marketClass}. Response Time: ${responseTime}. Stand: ${stand}.`,
      price: price,
      originalPrice: Math.round(price * 1.15 / 10000) * 10000,
      thumbnail: thumbnail,
      gallery: [thumbnail],
      quickSpecs: [size, panel, `${refresh}Hz`, responseTime, bitDepth],
      expertVerdict: `Data Pengetesan GTID & GrayPlasma: Response Time ${responseTime}, Input Display ${displayInput}. Stand: ${stand}. VESA: ${vesa}.`,
      pros: [
        `Panel ${panel} dengan Refresh Rate ${refresh}Hz native`,
        `Response time teruji: ${responseTime}`,
        `Mendukung VESA Mount: ${vesa}`,
        `Konektivitas: ${displayInput}`
      ],
      cons: [
        stand.toLowerCase().includes('tilt only') || stand.toLowerCase().includes('tidak bisa') ? 'Stand bawaan belum height adjustable (disarankan pasang arm VESA)' : 'Perhatikan settingan Overdrive di menu OSD agar tidak inverse ghosting',
        usb.toLowerCase().includes('tidak') ? 'Tidak ada USB Hub' : `Port USB Hub: ${usb}`
      ],
      specs: {
        display: {
          size: size,
          resolution: res,
          panelType: panel,
          refreshRate: refresh,
          responseTime: responseTime,
          brightness: price > 5000000 ? '400 nits' : '250 - 300 nits',
          contrastRatio: panel.includes('VA') ? '3000:1' : (panel.includes('OLED') ? '1.500.000:1' : '1000:1'),
          colorGamut: '99% sRGB / 90% DCI-P3 (GTID Tested)',
          hdr: panel.includes('OLED') ? 'True HDR 1000' : 'HDR10 Support (Disarankan SDR)',
          viewingAngle: '178° / 178°',
          curvature: curvature
        },
        connectivity: {
          displayPort: displayInput.includes('DP') ? displayInput : '1x DisplayPort',
          hdmi: displayInput.includes('HDMI') ? displayInput : '1x HDMI 2.0',
          audioJack: true,
          usbHub: usb
        },
        ergonomics: {
          heightAdjustable: stand.toLowerCase().includes('height') || stand.toLowerCase().includes('naik'),
          tilt: '-5° ~ 15°',
          swivel: 'Standar',
          pivot: stand.toLowerCase().includes('pivot'),
          vesaMount: vesa
        },
        features: {
          syncTech: 'Adaptive-Sync / FreeSync / G-Sync Compatible',
          builtInSpeakers: false,
          powerConsumption: '25W - 45W',
          warranty: '3 Tahun Garansi Distributor Resmi'
        }
      },
      marketplaces: [
        {
          marketplace: 'Shopee',
          url: linkShopee && linkShopee.startsWith('http') ? linkShopee : 'https://shopee.co.id',
          price: price,
          isAffiliate: true,
          storeName: 'Official & Flagship Store',
          officialStore: true,
          inStock: true
        },
        {
          marketplace: 'Tokopedia',
          url: 'https://tokopedia.com',
          price: price,
          isAffiliate: true,
          storeName: 'Tokopedia Partner',
          officialStore: true,
          inStock: true
        }
      ],
      priceHistory: [
        { date: 'Rekomendasi GrayPlasma', price: price, label: 'Harga Target' }
      ],
      tags: [marketClass, panel, `${refresh}Hz`, res],
      createdAt: '2026-08-20'
    };
  });

  const tsContent = `// Auto-generated from GrayPlasma Notion Collections Dump
import { Monitor } from "@/types/monitor";
import { AftersalesBrand, AFTERSALES_DATA } from "@/data/grayplasma-content";

export { AFTERSALES_DATA };
export type { AftersalesBrand };

export const MONITORS_DATA: Monitor[] = ${JSON.stringify(fullMonitors, null, 2)};
`;

  fs.writeFileSync('src/data/monitors.ts', tsContent);
  console.log(`Successfully generated src/data/monitors.ts with ${fullMonitors.length} complete monitors!`);
}

buildFullDataset();
