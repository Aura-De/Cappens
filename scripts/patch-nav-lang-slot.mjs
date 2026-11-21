import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const mod = await import(new URL('../lib/cappens-markup.ts', import.meta.url).href);
let markup = mod.cappensMarkup;
if (markup.includes('lang-switch-mount')) {
  console.log('lang-switch-mount already present');
  process.exit(0);
}

const re = /<nav class="links"[^>]*>/;
if (!re.test(markup)) throw new Error('nav links not found');
markup = markup.replace(
  re,
  '<div id="lang-switch-mount" class="lang-switch-slot"></div>\n    <nav class="links" aria-label="Principal">'
);

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib/cappens-markup.ts');
fs.writeFileSync(
  file,
  `/** Generated from Cappens Technology.html — do not edit by hand */\nexport const cappensMarkup = ${JSON.stringify(markup)};\n`
);
console.log('Inserted lang-switch-mount in nav');
