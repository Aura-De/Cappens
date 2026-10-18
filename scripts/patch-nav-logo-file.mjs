import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'lib/cappens-markup.ts');
let src = fs.readFileSync(file, 'utf8');

const logoIdx = src.indexOf('logo-link');
if (logoIdx < 0) throw new Error('logo-link not found');
const dataIdx = src.indexOf('data:image/png;base64,', logoIdx);
if (dataIdx < 0) throw new Error('nav logo data URI not found');

const afterBase64 = src.indexOf('\\" width=', dataIdx);
if (afterBase64 < 0) throw new Error('end of nav logo data URI not found');

const before = src.slice(0, dataIdx);
const after = src.slice(afterBase64);
src = `${before}/logo-cappens-nav.png${after}`;
fs.writeFileSync(file, src);
console.log('Patched nav logo to /logo-cappens-nav.png');
