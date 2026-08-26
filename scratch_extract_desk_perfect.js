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

async function extractFromPage(pageId, name) {
  console.log(`Extracting page ${name} (${pageId})...`);
  const rootData = await fetchPage(pageId);
  const blocks = rootData?.recordMap?.block || {};
  const collections = rootData?.recordMap?.collection || {};
  
  // Find all collections
  const resultCollections = [];
  
  for (const [collId, collObj] of Object.entries(collections)) {
    const collVal = getVal(collObj);
    const schema = collVal?.schema || {};
    const collName = extractPlainText(collVal?.name) || collVal?.id;
    console.log(`Found collection: ${collName} (${collId})`);
    
    // Find views for this collection
    // Query collection
    const url = 'https://www.notion.so/api/v3/queryCollection';
    let blockIds = [];
    try {
      const qRes = await fetch(url, {
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
      blockIds = qData?.result?.reducerResults?.collection_group_results?.blockIds || [];
    } catch(e) {
      console.error('Query collection failed', e);
    }
    
    console.log(`Collection ${collName} has ${blockIds.length} rows`);
    
    const rows = [];
    for (const bid of blockIds) {
      const rowData = await fetchPage(bid);
      const rowBlocks = rowData?.recordMap?.block || {};
      const rowVal = getVal(rowBlocks[bid]);
      if (!rowVal) continue;
      
      const props = {};
      const formattedProps = {};
      for (const [propKey, propVal] of Object.entries(rowVal.properties || {})) {
        const colDef = schema[propKey];
        const colName = colDef?.name || propKey;
        props[colName] = extractPlainText(propVal);
        formattedProps[colName] = extractFormattedText(propVal);
      }
      
      // Get all child blocks / content of this page
      const contentList = [];
      const contentIds = rowVal.content || [];
      for (const cid of contentIds) {
        const cVal = getVal(rowBlocks[cid]);
        if (cVal) {
          contentList.push({
            id: cid,
            type: cVal.type,
            text: extractFormattedText(cVal.properties?.title),
            plainText: extractPlainText(cVal.properties?.title),
            properties: cVal.properties
          });
        }
      }
      
      rows.push({
        id: bid,
        properties: props,
        formattedProps,
        content: contentList
      });
    }
    
    resultCollections.push({
      id: collId,
      name: collName,
      schema,
      rows
    });
  }
  
  // Also collect top-level page blocks that are not inside collections (headers, notes, guides)
  const rootVal = getVal(blocks[pageId]);
  const pageContent = [];
  for (const cid of (rootVal?.content || [])) {
    const cVal = getVal(blocks[cid]);
    if (cVal) {
      pageContent.push({
        id: cid,
        type: cVal.type,
        text: extractFormattedText(cVal.properties?.title),
        plainText: extractPlainText(cVal.properties?.title),
        properties: cVal.properties
      });
    }
  }
  
  return {
    pageId,
    title: extractPlainText(rootVal?.properties?.title),
    pageContent,
    collections: resultCollections
  };
}

async function main() {
  const meja = await extractFromPage('32254d70-2c62-801c-9bc5-c52e05556b9b', 'REKOMENDASI_MEJA');
  const ukuran = await extractFromPage('3a554d70-2c62-8038-87ba-c9992e4bd277', 'UKURAN_IDEAL');
  
  fs.writeFileSync('scratch_perfect_desk_dump.json', JSON.stringify({ meja, ukuran }, null, 2));
  console.log('Saved scratch_perfect_desk_dump.json!');
}

main();
