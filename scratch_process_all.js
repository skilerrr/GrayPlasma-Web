const fs = require('fs');

async function processAllNotionData() {
  const collDump = JSON.parse(fs.readFileSync('scratch_collections_dump.json', 'utf8'));
  const sdrDump = JSON.parse(fs.readFileSync('scratch_sdr_monitors.json', 'utf8'));
  const oledDump = JSON.parse(fs.readFileSync('scratch_oled_collection.json', 'utf8'));
  
  const allMonitorsMap = {};

  function processRecordMap(recordMap, categoryName) {
    if (!recordMap || !recordMap.block) return;
    const blocks = recordMap.block;
    const collections = recordMap.collection || {};
    
    Object.values(blocks).forEach(b => {
      const val = b.value?.value || b.value;
      if (val && val.properties && val.type === 'page') {
        const collId = val.parent_id;
        const schema = collections[collId]?.value?.value?.schema || collections[collId]?.value?.schema || sdrDump.schema || {};
        
        const props = {};
        for (const [k, v] of Object.entries(val.properties)) {
          const name = schema[k]?.name || k;
          props[name] = v.map(chunk => chunk[0]).join('');
        }

        const modelName = props['BRAND & MODEL TYPE'] || props['Name'] || props['title'] || '';
        if (modelName && modelName.trim()) {
          allMonitorsMap[val.id] = {
            id: val.id,
            category: categoryName,
            modelName: modelName.trim(),
            rawProps: props,
            format: val.format,
            createdTime: val.created_time
          };
        }
      }
    });
  }

  // Process SDR Reviewed
  processRecordMap(sdrDump, 'SDR GTID Review');

  // Process OLED
  processRecordMap(oledDump.recordMap, 'OLED Monitor');

  // Process all in collections dump
  for (const [key, cData] of Object.entries(collDump)) {
    const cName = cData.collection?.name?.[0]?.[0] || 'SDR Monitor';
    processRecordMap(cData.result?.recordMap, cName);
  }

  const monitorList = Object.values(allMonitorsMap);
  console.log(`Successfully extracted ${monitorList.length} unique monitors across all categories!`);
  
  fs.writeFileSync('scratch_all_extracted_monitors.json', JSON.stringify(monitorList, null, 2));

  // Print sample names
  console.log('\nSample Monitor Names:');
  monitorList.slice(0, 25).forEach((m, idx) => {
    console.log(`${idx + 1}. [${m.category}] ${m.modelName} (Price: ${m.rawProps['Kisaran Harga'] || m.rawProps['RECOMMENDED PRICING'] || '-'})`);
  });
}

processAllNotionData();
