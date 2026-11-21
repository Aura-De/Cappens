import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib/cappens-markup.ts');
let src = fs.readFileSync(file, 'utf8');
src = src.replace(/\/logo-cappens-nav(?:-[a-z]+)?\.png/g, '/logo-cappens-nav-clean.png');
fs.writeFileSync(file, src);
console.log('Nav img -> /logo-cappens-nav-clean.png');
