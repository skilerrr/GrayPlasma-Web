const fs = require('fs');

function parseNotionPage(jsonPath) {
  if (!fs.existsSync(jsonPath)) return null;
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const blocks = data?.recordMap?.block || {};
  const collections = data?.recordMap?.collection || {};
  
  console.log(`=== Parsing ${jsonPath} ===`);
  console.log('Total blocks:', Object.keys(blocks).length);
  console.log('Total collections:', Object.keys(collections).length);

  for (const [id, c] of Object.entries(collections)) {
    console.log('Collection:', id, c.value?.name);
    console.log('Schema:', JSON.stringify(c.value?.schema, null, 2));
  }

  // Look for rows / blocks
  const rows = [];
  for (const [id, b] of Object.entries(blocks)) {
    const val = b.value;
    if (val && val.type === 'page' && val.parent_table === 'collection') {
      rows.push({
        id,
        properties: val.properties
      });
    }
  }
  console.log('Found collection rows in page:', rows.length);
}

parseNotionPage('scratch_rekomendasi_meja.json');
parseNotionPage('scratch_ukuran_ideal.json');

// Check any collection dumps
const files = fs.readdirSync('.');
for (const f of files) {
  if (f.startsWith('scratch_rekomendasi_meja_coll_') || f.startsWith('scratch_ukuran_ideal_coll_')) {
    console.log('=== Collection file:', f);
    const cData = JSON.parse(fs.readFileSync(f, 'utf8'));
    const recMap = cData.recordMap || {};
    const blocks = recMap.block || {};
    console.log('Rows in collection view:', Object.keys(blocks).length);
    for (const [id, b] of Object.entries(blocks)) {
      if (b.value?.properties) {
        console.log(`Row [${id}]:`, JSON.stringify(b.value.properties));
      }
    }
  }
}
