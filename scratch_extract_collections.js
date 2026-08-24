const fs = require('fs');

async function extractMonitorsFromCollections() {
  if (!fs.existsSync('scratch_collections_dump.json')) {
    console.log('No collections dump file found.');
    return;
  }
  const collData = JSON.parse(fs.readFileSync('scratch_collections_dump.json', 'utf8'));
  const monitorsExtracted = [];

  for (const [key, obj] of Object.entries(collData)) {
    const coll = obj.collection;
    const schema = coll?.schema || {};
    const res = obj.result;
    const blocks = res?.recordMap?.block || {};
    
    console.log(`Collection Key: ${key} (${coll?.name?.[0]?.[0] || 'Unnamed'})`);
    console.log(`Schema properties:`, Object.keys(schema).map(k => `${schema[k].name} (${schema[k].type})`));
    console.log(`Blocks in result:`, Object.keys(blocks).length);

    Object.values(blocks).forEach(b => {
      const val = b.value?.value || b.value;
      if (val && val.properties) {
        const item = { id: val.id, type: val.type };
        for (const [propKey, propVal] of Object.entries(val.properties)) {
          const propName = schema[propKey]?.name || propKey;
          item[propName] = propVal.map(c => c[0]).join('');
        }
        if (item.Name || item.title || item.Model || item['Tipe Monitor']) {
          monitorsExtracted.push(item);
        }
      }
    });
  }

  console.log(`\nTotal monitor rows extracted: ${monitorsExtracted.length}`);
  fs.writeFileSync('scratch_extracted_monitors.json', JSON.stringify(monitorsExtracted, null, 2));
  if (monitorsExtracted.length > 0) {
    console.log('Sample extracted monitor:', JSON.stringify(monitorsExtracted[0], null, 2));
  }
}

extractMonitorsFromCollections();
