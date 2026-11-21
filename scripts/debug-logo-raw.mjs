import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib/cappens-markup.ts');
const src = fs.readFileSync(file, 'utf8');
const i = src.indexOf('logo-link');
console.log(JSON.stringify(src.slice(i, i + 120)));
