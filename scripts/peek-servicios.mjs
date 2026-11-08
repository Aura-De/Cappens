import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const src = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib/cappens-markup.ts'), 'utf8');
const i = src.indexOf('id=\\"servicios\\"');
const chunk = src.slice(i, i + 8000);
const cleaned = chunk.replace(/<svg[\s\S]*?<\/svg>/g, '[svg]');
console.log(cleaned.slice(0, 3500));
