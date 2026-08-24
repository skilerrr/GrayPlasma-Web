const fs = require('fs');

async function fetchPage(pageId) {
  const url = 'https://www.notion.so/api/v3/loadPageChunk';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
}

function extractTextFromProperties(prop) {
  if (!prop || !prop.title) return '';
  return prop.title.map(chunk => {
    let text = chunk[0];
    if (chunk[1]) {
      // formatting like link or bold
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

async function run() {
  const mainData = JSON.parse(fs.readFileSync('scratch_notion_dump.json', 'utf8'));
  const allBlocksMap = {};

  function addBlocks(recordMap) {
    if (!recordMap || !recordMap.block) return;
    Object.values(recordMap.block).forEach(b => {
      const val = b.value?.value || b.value;
      if (val && val.id) {
        allBlocksMap[val.id] = val;
      }
    });
  }

  addBlocks(mainData.recordMap);

  // Find subpages
  const rootBlocks = Object.values(allBlocksMap);
  const subpages = rootBlocks.filter(b => b.type === 'page' && b.id !== '4120d434-aa85-47d1-a362-6f9049b99c4e');

  for (const sp of subpages) {
    console.log('Fetching subpage:', sp.id);
    try {
      const spData = await fetchPage(sp.id);
      addBlocks(spData.recordMap);
    } catch(e) {
      console.error('Error fetching', sp.id, e.message);
    }
  }

  // Also query collections if any
  const collections = mainData.recordMap?.collection || {};
  console.log('Collections count:', Object.keys(collections).length);

  // Write full blocks
  fs.writeFileSync('scratch_all_blocks.json', JSON.stringify(allBlocksMap, null, 2));

  // Build markdown representation of main page
  function renderBlock(id, depth = 0) {
    const b = allBlocksMap[id];
    if (!b) return '';
    const indent = '  '.repeat(depth);
    const text = extractTextFromProperties(b.properties);
    let output = '';

    switch (b.type) {
      case 'header':
        output += `\n# ${text}\n`;
        break;
      case 'sub_header':
        output += `\n## ${text}\n`;
        break;
      case 'sub_sub_header':
        output += `\n### ${text}\n`;
        break;
      case 'text':
        output += `${text ? text + '\n' : '\n'}`;
        break;
      case 'bulleted_list':
        output += `- ${text}\n`;
        break;
      case 'numbered_list':
        output += `1. ${text}\n`;
        break;
      case 'to_do':
        const checked = b.properties?.checked?.[0]?.[0] === 'Yes' ? '[x]' : '[ ]';
        output += `- ${checked} ${text}\n`;
        break;
      case 'toggle':
        output += `\n<details><summary>${text || 'Toggle'}</summary>\n`;
        break;
      case 'callout':
        const icon = b.format?.page_icon || '💡';
        output += `\n> ${icon} **Callout**: ${text}\n`;
        break;
      case 'quote':
        output += `\n> ${text}\n`;
        break;
      case 'divider':
        output += `\n---\n`;
        break;
      case 'page':
        const pageIcon = b.format?.page_icon || '📄';
        output += `\n📄 **Page**: [${pageIcon} ${text || 'Untitled'}](id:${b.id})\n`;
        break;
      case 'image':
        const src = b.properties?.source?.[0]?.[0] || b.format?.display_source || '';
        output += `\n![Image](${src})\n`;
        break;
      case 'column_list':
      case 'column':
        break;
      default:
        if (text) output += `[${b.type}] ${text}\n`;
    }

    if (b.content && b.content.length > 0) {
      b.content.forEach(childId => {
        output += renderBlock(childId, depth + 1);
      });
    }

    if (b.type === 'toggle') {
      output += `</details>\n`;
    }

    return output;
  }

  const mainPageMarkdown = renderBlock('4120d434-aa85-47d1-a362-6f9049b99c4e');
  fs.writeFileSync('scratch_notion_content_full.md', mainPageMarkdown);
  console.log('Finished dumping markdown, length:', mainPageMarkdown.length);
}

run();
