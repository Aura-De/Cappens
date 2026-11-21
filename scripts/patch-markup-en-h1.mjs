import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cappensMarkup } from '../lib/cappens-markup.ts';

const esH1 = cappensMarkup.match(/<h1[\s\S]*?<\/h1>/)[0];
const enH1 = `<h1 aria-label="Software and artificial intelligence built with capability and thought.">
          <span class="w" aria-hidden="true" style="--i:0">Software</span>
          <span class="w" aria-hidden="true" style="--i:1">and</span>
          <span class="w" aria-hidden="true" style="--i:2">artificial</span>
          <span class="w" aria-hidden="true" style="--i:3">intelligence</span>
          <span class="w" aria-hidden="true" style="--i:4">built</span>
          <span class="w" aria-hidden="true" style="--i:5">with</span>
          <span class="w" aria-hidden="true" style="--i:6">capability</span>
          <span class="w" aria-hidden="true" style="--i:7">and</span>
          <span class="w" aria-hidden="true" style="--i:8">thought.</span>
        </h1>`;

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'messages', 'markup-en.json');
const pairs = JSON.parse(fs.readFileSync(file, 'utf8'));
const extra = [
  [esH1, enH1],
  ['aria-label="Principal"', 'aria-label="Main"'],
  ['aria-label="Abrir menú"', 'aria-label="Open menu"'],
];
const merged = [
  ...extra,
  ...pairs.filter((p) => p[0] !== esH1 && p[0] !== 'aria-label="Principal"' && p[0] !== 'aria-label="Abrir menú"'),
];
fs.writeFileSync(file, `${JSON.stringify(merged, null, 2)}\n`);
console.log('markup-en.json:', merged.length, 'pairs');
