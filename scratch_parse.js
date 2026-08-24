const fs = require('fs');

async function parseNotion() {
  const data = JSON.parse(fs.readFileSync('scratch_notion_dump.json', 'utf8'));
  const rawBlocks = Object.values(data.recordMap.block || {}).map(b => b.value?.value || b.value).filter(Boolean);

  console.log('Total blocks:', rawBlocks.length);
  
  const subpages = [];
  const images = [];
  const textBlocks = [];

  rawBlocks.forEach((b, i) => {
    const type = b.type;
    let title = '';
    if (b.properties && b.properties.title) {
      title = b.properties.title.map(chunk => chunk[0]).join('');
    }
    let src = '';
    if (b.properties && b.properties.source) {
      src = b.properties.source[0][0];
    } else if (b.format && b.format.display_source) {
      src = b.format.display_source;
    }

    if (type === 'page' && b.id !== '4120d434-aa85-47d1-a362-6f9049b99c4e') {
      subpages.push({ id: b.id, title });
    }
    if (type === 'image') {
      images.push({ id: b.id, src, format: b.format });
    }
    textBlocks.push({ id: b.id, type, title, src, properties: b.properties, format: b.format, content: b.content });
  });

  console.log('Subpages (' + subpages.length + '):');
  subpages.forEach(p => console.log(' - ' + p.id + ': ' + p.title));

  console.log('\nImages (' + images.length + '):');
  images.forEach(img => console.log(' - ' + img.id + ': ' + img.src));

  fs.writeFileSync('scratch_parsed_summary.json', JSON.stringify({ subpages, images, textBlocks }, null, 2));
}

parseNotion();
