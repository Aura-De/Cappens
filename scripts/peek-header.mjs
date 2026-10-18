import { pathToFileURL } from 'url';
import path from 'path';
const mod = await import(pathToFileURL(path.join(process.cwd(), 'lib/cappens-markup.ts')).href);
const h = mod.cappensMarkup.match(/<header[\s\S]*?<\/header>/)[0];
const logo = h.match(/<a class="logo-link"[\s\S]*?<\/a>/)[0];
console.log('logo block length', logo.length);
console.log(logo.replace(/data:image[^"]+/g, 'data:...[truncated]').slice(0, 1200));
