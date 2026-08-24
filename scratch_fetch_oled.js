const fs = require('fs');

async function fetchOLED() {
  const pageUrl = 'https://www.notion.so/api/v3/loadPageChunk';
  const pageRes = await fetch(pageUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    body: JSON.stringify({
      pageId: '19054d70-2c62-80f0-859a-d75c00381b5e',
      limit: 100,
      cursor: { stack: [] },
      chunkNumber: 0,
      verticalColumns: false
    })
  });
  const pageData = await pageRes.json();
  fs.writeFileSync('scratch_oled_page.json', JSON.stringify(pageData, null, 2));

  const colls = pageData.recordMap?.collection || {};
  const collViews = pageData.recordMap?.collection_view || {};
  console.log('OLED Collections:', Object.keys(colls));
  console.log('OLED CollectionViews:', Object.keys(collViews));

  for (const cId of Object.keys(colls)) {
    const cvId = Object.keys(collViews)[0];
    const qUrl = 'https://www.notion.so/api/v3/queryCollection';
    const qRes = await fetch(qUrl, {
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
            collection_group_results: { type: 'results', limit: 100 }
          },
          searchQuery: '',
          userTimeZone: 'Asia/Jakarta'
        }
      })
    });
    const qData = await qRes.json();
    fs.writeFileSync('scratch_oled_collection.json', JSON.stringify(qData, null, 2));
    console.log('OLED Collection fetched.');
  }
}

fetchOLED();
