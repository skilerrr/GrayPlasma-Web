const fs = require('fs');

function parseSubpages() {
  const raw = JSON.parse(fs.readFileSync('scratch_all_subpages_raw.json', 'utf8'));

  const summaries = {};

  for (const [key, data] of Object.entries(raw)) {
    const blocks = data.recordMap?.block || {};
    const colls = data.recordMap?.collection || {};
    
    const blockList = Object.values(blocks).map(b => b.value?.value || b.value).filter(Boolean);
    const textLines = [];
    const tableRows = [];

    blockList.forEach(b => {
      let title = '';
      if (b.properties && b.properties.title) {
        title = b.properties.title.map(c => c[0]).join('');
      }
      if (b.type === 'page') {
        textLines.push(`### [PAGE] ${title} (${b.id})`);
      } else if (b.type === 'header' || b.type === 'sub_header') {
        textLines.push(`## ${title}`);
      } else if (b.type === 'callout') {
        textLines.push(`> [CALLOUT] ${title}`);
      } else if (b.type === 'bulleted_list') {
        textLines.push(`- ${title}`);
      } else if (title) {
        textLines.push(title);
      }

      // Check table properties
      if (b.properties && b.type === 'page' && b.parent_table === 'collection') {
        const row = { id: b.id };
        const schema = colls[b.parent_id]?.value?.value?.schema || colls[b.parent_id]?.value?.schema || {};
        for (const [pk, pv] of Object.entries(b.properties)) {
          const pName = schema[pk]?.name || pk;
          row[pName] = pv.map(c => c[0]).join('');
        }
        tableRows.push(row);
      }
    });

    summaries[key] = {
      text: textLines.join('\n'),
      tableRows: tableRows
    };
  }

  fs.writeFileSync('scratch_subpages_parsed.json', JSON.stringify(summaries, null, 2));
  console.log('Parsed subpages written to scratch_subpages_parsed.json');
}

parseSubpages();
