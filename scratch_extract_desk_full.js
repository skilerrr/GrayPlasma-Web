const fs = require('fs');

async function fetchPage(pageId) {
  const url = 'https://www.notion.so/api/v3/loadPageChunk';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
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
    return null;
  }
}

function getText(prop) {
  if (!prop) return '';
  if (Array.isArray(prop)) {
    return prop.map(c => c[0]).join('');
  }
  return String(prop);
}

async function inspectAll() {
  const files = [
    { name: 'rekomendasi_meja', path: 'scratch_rekomendasi_meja_coll_34f54d70-2c62-80ce-86ba-000bc329a852.json' },
    { name: 'ukuran_24', path: 'scratch_ukuran_ideal_coll_32954d70-2c62-80be-b287-000b04213761.json' },
    { name: 'ukuran_27', path: 'scratch_ukuran_ideal_coll_32d54d70-2c62-815a-8296-000ba9eb8d2d.json' }
  ];

  const fullResults = {};

  for (const f of files) {
    if (!fs.existsSync(f.path)) continue;
    const cData = JSON.parse(fs.readFileSync(f.path, 'utf8'));
    const recMap = cData.recordMap || {};
    const coll = Object.values(recMap.collection || {})[0]?.value;
    const schema = coll?.schema || {};
    const blocks = recMap.block || {};

    const items = [];

    for (const [id, b] of Object.entries(blocks)) {
      const val = b.value;
      if (!val || val.type !== 'page') continue;

      const props = {};
      for (const [k, v] of Object.entries(val.properties || {})) {
        const colName = schema[k]?.name || k;
        props[colName] = getText(v);
      }

      // Fetch page body content
      console.log('Fetching body for row:', id, props['NAMA TOKO'] || props['UKURAN MONITOR'] || props['title'] || id);
      const rowPage = await fetchPage(id);
      const rowBlocks = rowPage?.recordMap?.block || {};
      
      const bodyTexts = [];
      for (const [rbId, rb] of Object.entries(rowBlocks)) {
        if (rbId === id) continue;
        const rbVal = rb.value;
        if (rbVal && rbVal.properties && rbVal.properties.title) {
          bodyTexts.push({
            type: rbVal.type,
            text: getText(rbVal.properties.title),
            raw: rbVal.properties.title
          });
        }
      }

      items.push({
        id,
        properties: props,
        body: bodyTexts
      });
    }

    fullResults[f.name] = {
      collectionName: coll?.name ? getText(coll.name) : f.name,
      schema,
      items
    };
  }

  fs.writeFileSync('scratch_desk_full_extracted.json', JSON.stringify(fullResults, null, 2));
  console.log('Saved scratch_desk_full_extracted.json successfully!');
}

inspectAll();
