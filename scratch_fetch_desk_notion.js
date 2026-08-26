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
    console.error('Error fetching', pageId, e.message);
    return null;
  }
}

async function queryColl(cId, cvId) {
  const url = 'https://www.notion.so/api/v3/queryCollection';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
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

async function main() {
  const pages = [
    { name: 'rekomendasi_meja', id: '32254d70-2c62-801c-9bc5-c52e05556b9b' },
    { name: 'ukuran_ideal', id: '3a554d70-2c62-8038-87ba-c9992e4bd277' }
  ];

  for (const p of pages) {
    console.log('Fetching', p.name);
    const data = await fetchPage(p.id);
    fs.writeFileSync('scratch_' + p.name + '.json', JSON.stringify(data, null, 2));
    if (data && data.recordMap && data.recordMap.collection) {
      for (const cid of Object.keys(data.recordMap.collection)) {
        const cvids = Object.keys(data.recordMap.collection_view || {});
        for (const cvid of cvids) {
          const cRes = await queryColl(cid, cvid);
          if (cRes) {
            fs.writeFileSync('scratch_' + p.name + '_coll_' + cid + '.json', JSON.stringify(cRes, null, 2));
          }
        }
      }
    }
  }
  console.log('Done fetching notion data.');
}

main();
