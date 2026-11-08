import { pathToFileURL } from 'url';
const mod = await import(pathToFileURL(new URL('../lib/cappens-markup.ts', import.meta.url)).href);
const i = mod.cappensMarkup.indexOf('id="servicios"');
console.log(mod.cappensMarkup.slice(i, i + 600));
