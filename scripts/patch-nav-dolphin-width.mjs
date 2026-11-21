import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const mod = await import(new URL('../lib/cappens-markup.ts', import.meta.url).href);
let markup = mod.cappensMarkup;
markup = markup.replace(
  /class="logo-dolphin" src="\/logo-cappens-nav-dolphin\.png" width="\d+" height="\d+"/,
  'class="logo-dolphin" src="/logo-cappens-nav-dolphin.png" width="212" height="264"'
);
const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib/cappens-markup.ts');
fs.writeFileSync(
  file,
  `/** Generated from Cappens Technology.html — do not edit by hand */\nexport const cappensMarkup = ${JSON.stringify(markup)};\n`
);
console.log('Updated nav dolphin width');
