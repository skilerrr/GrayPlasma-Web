const fs = require('fs');

async function fetchPage(pageId) {
  const url = 'https://www.notion.so/api/v3/loadPageChunk';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
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

function getVal(obj) {
  if (!obj) return null;
  return obj.value?.value || obj.value || obj;
}

async function extractFullDeskDatabase() {
  const rootData = await fetchPage('32254d70-2c62-801c-9bc5-c52e05556b9b');
  const collId = '34f54d70-2c62-80ce-86ba-000bc329a852';
  
  const qRes = await fetch('https://www.notion.so/api/v3/queryCollection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    body: JSON.stringify({
      collection: { id: collId },
      collectionView: { id: Object.keys(rootData?.recordMap?.collection_view || {})[0] || '' },
      loader: {
        type: 'reducer',
        reducers: { collection_group_results: { type: 'results', limit: 200 } },
        searchQuery: '',
        userTimeZone: 'Asia/Jakarta'
      }
    })
  });
  const qData = await qRes.json();
  const blockIds = qData?.result?.reducerResults?.collection_group_results?.blockIds || [];

  const deskItems = [];

  for (const bid of blockIds) {
    const rowData = await fetchPage(bid);
    const blocks = rowData?.recordMap?.block || {};
    const rootRow = getVal(blocks[bid]);
    if (!rootRow) continue;

    const props = rootRow.properties || {};
    const title = extractPlainText(props.title);
    const harga = parseInt(extractPlainText(props.Tbgs) || '0', 10);
    const shape = extractPlainText(props.ksKk); // "NON L SHAPED" or "L SHAPED"
    const keterangan = extractPlainText(props['xKK;']); // "DAUN MEJA", "DAUN MEJA,KAKI MEJA HOLLOW", etc.
    const catatanProp = extractPlainText(props.AQpZ);
    const shopeeUrl = extractPlainText(props.gxGr);

    // Render all blocks inside this page in order of appearance
    const bodyLines = [];
    for (const [k, v] of Object.entries(blocks)) {
      if (k === bid) continue;
      const b = getVal(v);
      if (!b || !b.properties) continue;
      const text = extractFormattedText(b.properties.title);
      if (!text && b.type !== 'image' && b.type !== 'divider') continue;

      if (b.type === 'header') {
        bodyLines.push(`## ${text}`);
      } else if (b.type === 'sub_header') {
        bodyLines.push(`### ${text}`);
      } else if (b.type === 'sub_sub_header') {
        bodyLines.push(`#### ${text}`);
      } else if (b.type === 'bulleted_list') {
        bodyLines.push(`- ${text}`);
      } else if (b.type === 'numbered_list') {
        bodyLines.push(`1. ${text}`);
      } else if (b.type === 'callout') {
        bodyLines.push(`> 💡 ${text}`);
      } else if (b.type === 'image') {
        bodyLines.push(`![Gambar Meja](${b.format?.display_source || ''})`);
      } else {
        bodyLines.push(text);
      }
    }

    deskItems.push({
      id: bid,
      namaToko: title,
      keterangan: keterangan ? keterangan.split(',') : [],
      lShaped: shape,
      catatanBadge: catatanProp,
      kisaranHarga: harga,
      shopeeUrl: shopeeUrl || '',
      markdownContent: bodyLines.join('\n\n')
    });
  }

  return deskItems;
}

async function extractIdealSizeGuides() {
  const rootData = await fetchPage('3a554d70-2c62-8038-87ba-c9992e4bd277');
  const collections = rootData?.recordMap?.collection || {};
  
  const results = {};

  for (const [collId, collObj] of Object.entries(collections)) {
    const collVal = getVal(collObj);
    const collName = extractPlainText(collVal?.name);
    const schema = collVal?.schema || {};

    const qRes = await fetch('https://www.notion.so/api/v3/queryCollection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      body: JSON.stringify({
        collection: { id: collId },
        collectionView: { id: Object.keys(rootData?.recordMap?.collection_view || {})[0] || '' },
        loader: {
          type: 'reducer',
          reducers: { collection_group_results: { type: 'results', limit: 200 } },
          searchQuery: '',
          userTimeZone: 'Asia/Jakarta'
        }
      })
    });
    const qData = await qRes.json();
    const blockIds = qData?.result?.reducerResults?.collection_group_results?.blockIds || [];

    const rows = [];
    for (const bid of blockIds) {
      const rowData = await fetchPage(bid);
      const blocks = rowData?.recordMap?.block || {};
      const rootRow = getVal(blocks[bid]);
      if (!rootRow) continue;

      const props = {};
      for (const [k, v] of Object.entries(rootRow.properties || {})) {
        const colDef = schema[k];
        const colName = colDef?.name || k;
        props[colName] = extractPlainText(v);
      }
      rows.push({ id: bid, ...props });
    }

    results[collName] = rows;
  }

  return results;
}

async function run() {
  console.log('Extracting desk database...');
  const desks = await extractFullDeskDatabase();
  console.log('Extracting ideal size guides...');
  const idealSizes = await extractIdealSizeGuides();

  fs.writeFileSync('scratch_desks_and_guides_final.json', JSON.stringify({
    desks,
    idealSizes
  }, null, 2));

  console.log('Finished writing scratch_desks_and_guides_final.json!');
}

run();
