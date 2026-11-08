import { pathToFileURL } from 'url';
import path from 'path';
const mod = await import(pathToFileURL(path.join(process.cwd(), 'lib/cappens-markup.ts')).href);
const ids = [...mod.cappensMarkup.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]);
const classes = [...mod.cappensMarkup.matchAll(/<section[^>]*class="([^"]+)"/g)].map((m) => m[1]);
console.log('section ids:', ids);
console.log('section classes:', [...new Set(classes)]);
