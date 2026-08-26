const fs = require('fs');

async function syncRecordValues(requests) {
  const url = 'https://www.notion.so/api/v3/syncRecordValues';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: JSON.stringify({ requests })
    });
    return await res.json();
  } catch(e) {
    console.error('Error syncing:', e.message);
    return null;
  }
}

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

function extractFormattedText(prop) {
  if (!prop) return '';
  if (Array.isArray(prop)) {
    return prop.map(chunk => {
      let text = chunk[0];
      if (chunk[1]) {
        chunk[1].forEach(fmt => {
          if (fmt[0] === 'a') text = `[${text}](${fmt[1]})`;
          if (fmt[0] === 'b') text = `**${text}**`;
          if (fmt[0] === 'i') text = `*${text}*`;
          if (fmt[0] === 'c') text = `\`${text}\``;
        });
      }
      return text;
    }).join('');
  }
  return String(prop);
}

function extractPlainText(prop) {
  if (!prop) return '';
  if (Array.isArray(prop)) {
    return prop.map(chunk => chunk[0]).join('');
  }
  return String(prop);
}

async function processCollection(collFile, name) {
  const data = JSON.parse(fs.readFileSync(collFile, 'utf8'));
  const blockIds = data.result?.reducerResults?.collection_group_results?.blockIds || [];
  console.log(`Processing ${name}, blockIds count:`, blockIds.length);

  // Sync record values for blocks
  const reqs = blockIds.map(id => ({ table: 'block', id }));
  const synced = await syncRecordValues(reqs);
  const blockMap = synced?.recordMap?.block || {};

  // Also get collection schema
  const collId = data.collectionIds?.[0] || Object.keys(data.recordMap?.collection || {})[0];
  let schema = data.recordMap?.collection?.[collId]?.value?.schema;
  if (!schema) {
    const sColl = await syncRecordValues([{ table: 'collection', id: collId }]);
    schema = sColl?.recordMap?.collection?.[collId]?.value?.schema || {};
  }

  const rows = [];
  for (const bid of blockIds) {
    const bVal = blockMap[bid]?.value;
    if (!bVal) continue;

    const props = {};
    const formattedProps = {};
    for (const [k, v] of Object.entries(bVal.properties || {})) {
      const colName = schema[k]?.name || k;
      props[colName] = extractPlainText(v);
      formattedProps[colName] = extractFormattedText(v);
    }

    // Now fetch page content inside this row
    console.log(`Fetching body for: ${props['NAMA TOKO'] || props['UKURAN MONITOR'] || props['title'] || bid}`);
    const rowPage = await fetchPage(bid);
    const rowBlocks = rowPage?.recordMap?.block || {};

    const contentBlocks = [];
    const contentIds = bVal.content || [];
    for (const cid of contentIds) {
      const cb = rowBlocks[cid]?.value;
      if (cb) {
        contentBlocks.push({
          type: cb.type,
          text: extractFormattedText(cb.properties?.title),
          plainText: extractPlainText(cb.properties?.title),
          properties: cb.properties
        });
      }
    }

    rows.push({
      id: bid,
      properties: props,
      formattedProps,
      content: contentBlocks
    });
  }

  return { name, schema, rows };
}

async function main() {
  const mejaColl = await processCollection('scratch_rekomendasi_meja_coll_34f54d70-2c62-80ce-86ba-000bc329a852.json', 'REKOMENDASI_MEJA');
  const size24Coll = await processCollection('scratch_ukuran_ideal_coll_32954d70-2c62-80be-b287-000b04213761.json', 'UKURAN_24_INCH');
  const size27Coll = await processCollection('scratch_ukuran_ideal_coll_32d54d70-2c62-815a-8296-000ba9eb8d2d.json', 'UKURAN_27_INCH');

  fs.writeFileSync('scratch_extracted_desk_and_guide.json', JSON.stringify({
    meja: mejaColl,
    size24: size24Coll,
    size27: size27Coll
  }, null, 2));

  console.log('Done extracting all data!');
}

main();
