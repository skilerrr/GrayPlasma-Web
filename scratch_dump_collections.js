const fs = require('fs');

async function queryCollection(collectionId, collectionViewId) {
  const url = 'https://www.notion.so/api/v3/queryCollection';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    body: JSON.stringify({
      collection: { id: collectionId },
      collectionView: { id: collectionViewId },
      loader: {
        type: 'reducer',
        reducers: {
          collection_group_results: {
            type: 'results',
            limit: 200
          }
        },
        searchQuery: '',
        userTimeZone: 'Asia/Jakarta'
      }
    })
  });
  return await res.json();
}

async function run() {
  const mainData = JSON.parse(fs.readFileSync('scratch_notion_dump.json', 'utf8'));
  const collections = mainData.recordMap?.collection || {};
  const collectionViews = mainData.recordMap?.collection_view || {};
  
  console.log('Collection keys:', Object.keys(collections));
  console.log('CollectionView keys:', Object.keys(collectionViews));

  const allCollectionData = {};

  for (const cId of Object.keys(collections)) {
    const cObj = collections[cId]?.value?.value || collections[cId]?.value;
    const name = cObj?.name ? cObj.name.map(c => c[0]).join('') : 'Unnamed Collection';
    console.log(`\nQuerying Collection: ${cId} (${name})`);
    
    // Find matching collectionView
    const cvIds = Object.keys(collectionViews);
    for (const cvId of cvIds) {
      try {
        const queryRes = await queryCollection(cId, cvId);
        console.log(` - CollectionView ${cvId}: status ${queryRes ? 'OK' : 'Fail'}`);
        if (queryRes.recordMap) {
          allCollectionData[`${cId}_${cvId}`] = {
            collection: cObj,
            result: queryRes
          };
        }
      } catch(e) {
        console.error(` - Error querying ${cvId}:`, e.message);
      }
    }
  }

  fs.writeFileSync('scratch_collections_dump.json', JSON.stringify(allCollectionData, null, 2));
  console.log('\nSaved collections dump.');
}

run();
