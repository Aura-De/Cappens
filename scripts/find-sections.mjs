import { pathToFileURL } from 'url';
import path from 'path';
const mod = await import(pathToFileURL(path.join(process.cwd(), 'lib/cappens-markup.ts')).href);
const s = mod.cappensMarkup;
const idx = s.lastIndexOf('<section', s.indexOf('class="name"'));
console.log(s.slice(idx, idx + 400));
