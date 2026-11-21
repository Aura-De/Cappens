import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib/cappens-markup.ts');
let src = fs.readFileSync(file, 'utf8');

const before = (src.match(/<svg class=\\"gem\\"/g) || []).length;
src = src.replace(/<svg class=\\"gem\\"[\s\S]*?<\/svg>/g, '');
src = src.replace(/ class=\\"reveal gemli\\"/g, ' class=\\"reveal\\"');
src = src.replace(/ gemli/g, '');

const after = (src.match(/<svg class=\\"gem\\"/g) || []).length;
if (before === 0) throw new Error('No gem icons found');
fs.writeFileSync(file, src);
console.log(`Removed ${before - after} gem icons (${before} -> ${after})`);
