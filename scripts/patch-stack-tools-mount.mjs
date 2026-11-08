import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cappensMarkup } from '../lib/cappens-markup.ts';

const mountOnly = '<div id="stack-tools-mount"></div>';

let markup = cappensMarkup;
if (markup.includes('id="stack-tools-mount"') && !markup.includes('class="stack-tools reveal"')) {
  console.log('stack-tools mount already set');
  process.exit(0);
}

const re = /<div class="stack-tools[\s\S]*?<\/div>\s*(?=\s*<\/section>\s*\n\s*<section id="metodo">)/;
if (!re.test(markup)) {
  if (markup.includes(mountOnly)) {
    console.log('mount placeholder only');
    process.exit(0);
  }
  throw new Error('stack-tools block not found');
}

markup = markup.replace(re, `${mountOnly}\n      `);

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'cappens-markup.ts');
fs.writeFileSync(
  file,
  `/** Generated from Cappens Technology.html — do not edit by hand */\nexport const cappensMarkup = ${JSON.stringify(markup)};\n`
);
console.log('Replaced stack-tools HTML with React mount point');
