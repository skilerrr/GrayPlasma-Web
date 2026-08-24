const fs = require('fs');

async function fetchPage(pageId) {
  const url = 'https://www.notion.so/api/v3/loadPageChunk';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        pageId: pageId,
        limit: 100,
        cursor: { stack: [] },
        chunkNumber: 0,
        verticalColumns: false
      })
    });
    return await res.json();
  } catch(e) {
    console.error('Error fetching', pageId, e.message);
    return null;
  }
}

function extractText(prop) {
  if (!prop || !prop.title) return '';
  return prop.title.map(c => c[0]).join('');
}

async function queryColl(cId, cvId) {
  const url = 'https://www.notion.so/api/v3/queryCollection';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        collection: { id: cId },
        collectionView: { id: cvId },
        loader: {
          type: 'reducer',
          reducers: {
            collection_group_results: { type: 'results', limit: 200 }
          },
          searchQuery: '',
          userTimeZone: 'Asia/Jakarta'
        }
      })
    });
    return await res.json();
  } catch(e) {
    return null;
  }
}

async function run() {
  const pageIds = [
    '3b154d70-2c62-8051-893d-e97807ac1f2f', // Gimmick Meja Gaming / Panduan Meja & Bracket
    '1803b4ee-5e90-805e-a224-c1fb2b4a0033', // ZenKromaT Custom PC Build / Peripherals
    'f6432bf4-470a-42f3-af23-ae8bfa5b83d3', // Old ZenKromaT
    '3b454d70-2c62-80b2-bc22-c7cdd8f650d4', // Plus Minus OLED
    '3b454d70-2c62-80f4-9846-dd264093a519', // Cara Rawat OLED
    '3a854d70-2c62-803c-85ac-e9985217f920', // MSI Asus Dell OLED
    '1b254d70-2c62-80d4-bb75-df867a7dfade', // Data Toleransi Lama vs Baru
    '3bb54d70-2c62-80a7-a0c0-d4001e29966e'  // Consultation Results
  ];

  const results = {};

  for (const pid of pageIds) {
    console.log('Fetching subpage:', pid);
    const data = await fetchPage(pid);
    if (data && data.recordMap) {
      results[pid] = data;
      // check collections inside
      const colls = data.recordMap.collection || {};
      const cvs = data.recordMap.collection_view || {};
      console.log(` - Collections in ${pid}:`, Object.keys(colls).length);
      for (const cid of Object.keys(colls)) {
        const cvid = Object.keys(cvs)[0] || '';
        const cRes = await queryColl(cid, cvid);
        if (cRes) {
          results[`coll_${cid}`] = cRes;
        }
      }
    }
  }

  fs.writeFileSync('scratch_all_subpages_raw.json', JSON.stringify(results, null, 2));
  console.log('Finished fetching all subpages.');
}

run();
