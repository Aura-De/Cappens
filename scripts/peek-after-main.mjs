import { pathToFileURL } from 'url';
import path from 'path';
const mod = await import(pathToFileURL(path.join(process.cwd(), 'lib/cappens-markup.ts')).href);
const i = mod.cappensMarkup.indexOf('</main>');
console.log(mod.cappensMarkup.slice(i, i + 400));
