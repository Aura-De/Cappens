import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const mod = await import(new URL('../lib/cappens-markup.ts', import.meta.url).href);
const m = mod.cappensMarkup.match(/<img src="data:image\/png;base64,[^"]+"[^>]*>/);
console.log(m ? m[0].replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/, 'BASE64') : 'NOT FOUND');
