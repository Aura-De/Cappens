import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'lib', 'cappens-markup.ts');

const mod = await import(pathToFileURL(file).href);
let markup = mod.cappensMarkup;

const techSvg = /<svg class="tech"[\s\S]*?<\/svg>/;
if (techSvg.test(markup)) {
  markup = markup.replace(techSvg, '');
  console.log('Removed TECHNOLOGY svg from nav logo');
} else {
  console.log('TECHNOLOGY svg not found (already removed?)');
}

markup = markup.replace(
  'aria-label="Cappens Technology, ir al inicio"',
  'aria-label="Cappens, ir al inicio"'
);

fs.writeFileSync(
  file,
  `/** Generated from Cappens Technology.html — do not edit by hand */\nexport const cappensMarkup = ${JSON.stringify(markup)};\n`
);
console.log('Updated cappens-markup.ts');
