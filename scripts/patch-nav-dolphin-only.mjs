import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib/cappens-markup.ts');
let src = fs.readFileSync(file, 'utf8');
src = src.replace(/\/logo-cappens-nav\.png/g, '/logo-cappens-nav-dolphin.png');
src = src.replace(/width=\\"292\\" height=\\"304\\"/, 'width=\\"292\\" height=\\"264\\"');
fs.writeFileSync(file, src);
console.log('Nav logo -> logo-cappens-nav-dolphin.png');
