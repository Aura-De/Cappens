import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'lib/cappens-markup.ts');

const mod = await import(new URL('../lib/cappens-markup.ts', import.meta.url).href);
let markup = mod.cappensMarkup;

const oldRe =
  /<a class="logo-link" href="#inicio" aria-label="Cappens, ir al inicio">[\s\S]*?<\/a>/;
const fresh = `<a class="logo-link" href="#inicio" aria-label="Cappens, ir al inicio">
      <img class="logo-dolphin" src="/logo-cappens-nav-dolphin.png" width="292" height="264" alt="">
      <span class="logo-type" aria-hidden="true">cappens</span>
    </a>`;

if (!oldRe.test(markup)) throw new Error('logo-link not found in markup string');
markup = markup.replace(oldRe, fresh);

fs.writeFileSync(
  file,
  `/** Generated from Cappens Technology.html — do not edit by hand */\nexport const cappensMarkup = ${JSON.stringify(markup)};\n`
);
console.log('Nav: delfín más pequeño + texto cappens');
