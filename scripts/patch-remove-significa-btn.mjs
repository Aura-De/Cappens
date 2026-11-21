import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib/cappens-markup.ts');
let src = fs.readFileSync(file, 'utf8');

const patterns = [
  /<a class=\\"btn line\\" href=\\"#nombre\\">Qué significa Cappens<\/a>\s*/,
  /<a class=\\"btn line\\" href=\\"#nombre\\">[^<]*<\/a>\s*/,
];

let removed = false;
for (const re of patterns) {
  if (re.test(src)) {
    src = src.replace(re, '');
    removed = true;
    break;
  }
}

if (!removed) throw new Error('Button "Qué significa Cappens" not found');
fs.writeFileSync(file, src);
console.log('Removed hero button: Qué significa Cappens');
