import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const partsDir = path.join(__dirname, 'extracted', 'parts');
const names = [
  'svg-defs.html',
  'header.html',
  'hero-before.html',
  'stage.html',
  'main-after.html',
  'footer.html',
];

let markup = '';
for (const name of names) {
  markup += fs.readFileSync(path.join(partsDir, name), 'utf8');
}

const out = path.join(__dirname, '..', 'lib', 'cappens-markup.ts');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(
  out,
  `/** Generated from Cappens Technology.html — do not edit by hand */\nexport const cappensMarkup = ${JSON.stringify(markup)};\n`
);
console.log('Wrote', out, 'length', markup.length);
