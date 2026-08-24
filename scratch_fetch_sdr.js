const fs = require('fs');

async function fetchSDRMonitors() {
  const url = 'https://www.notion.so/api/v3/queryCollection';
  const cId = 'b8a25b9b-09fa-4c57-849c-7521ecfadd9d';
  const cvId = '16854d70-2c62-8092-8476-000c7a8cd755';

  console.log('Querying SDR collection...');
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
          collection_group_results: {
            type: 'results',
            limit: 250
          }
        },
        searchQuery: '',
        userTimeZone: 'Asia/Jakarta'
      }
    })
  });

  const json = await res.json();
  console.log('Got response. RecordMap keys:', Object.keys(json.recordMap || {}));
  const blocks = json.recordMap?.block || {};
  const collection = json.recordMap?.collection?.[cId]?.value?.value || json.recordMap?.collection?.[cId]?.value;
  const schema = collection?.schema || {};

  console.log('Schema properties:', Object.values(schema).map(s => s.name));

  const items = [];
  Object.values(blocks).forEach(b => {
    const val = b.value?.value || b.value;
    if (val && val.properties) {
      const row = { id: val.id };
      for (const [k, v] of Object.entries(val.properties)) {
        const name = schema[k]?.name || k;
        row[name] = v.map(chunk => chunk[0]).join('');
      }
      items.push(row);
    }
  });

  console.log(`Total monitors extracted: ${items.length}`);
  fs.writeFileSync('scratch_sdr_monitors.json', JSON.stringify({ schema, items }, null, 2));
}

fetchSDRMonitors();
