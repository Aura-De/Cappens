import { pathToFileURL } from 'url';
import path from 'path';
const mod = await import(pathToFileURL(path.join(process.cwd(), 'lib/cappens-markup.ts')).href);
const h = mod.cappensMarkup.match(/<header[\s\S]*?<\/header>/)[0];
const links = [...h.matchAll(/href="(#[^"]+)"[^>]*>([^<]+)</g)];
console.log(links.map((m) => m[1] + ' -> ' + m[2].trim()));
