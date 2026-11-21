import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const mod = await import(new URL('../lib/cappens-markup.ts', import.meta.url).href);
let markup = mod.cappensMarkup;

const fresh = `<a class="logo-link logo-link--text" href="#inicio" aria-label="Cappens, ir al inicio">
      <span class="logo-type">cappens</span>
    </a>`;

const re = /<a class="logo-link[^"]*" href="#inicio" aria-label="Cappens, ir al inicio">[\s\S]*?<\/a>/;
if (!re.test(markup)) throw new Error('logo-link not found');
markup = markup.replace(re, fresh);

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib/cappens-markup.ts');
fs.writeFileSync(
  file,
  `/** Generated from Cappens Technology.html — do not edit by hand */\nexport const cappensMarkup = ${JSON.stringify(markup)};\n`
);
console.log('Nav: solo texto cappens, sin delfín');
