import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const mod = await import(pathToFileURL(path.join(root, 'lib/cappens-markup.ts')).href);
const markup = mod.cappensMarkup;

const m = markup.match(/<img src="(data:image\/png;base64,[^"]+)"[^>]*alt="[^"]*Cappens[^"]*"/);
if (!m) throw new Error('Nav logo PNG not found in markup');
const b64 = m[1].replace(/^data:image\/png;base64,/, '');
const out = path.join(root, 'public', 'cappens-nav-logo.raw.png');
fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.writeFileSync(out, Buffer.from(b64, 'base64'));
console.log('Wrote', out, 'bytes', fs.statSync(out).size);
