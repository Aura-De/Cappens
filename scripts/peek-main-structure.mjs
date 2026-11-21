import { pathToFileURL } from 'url';
import path from 'path';
const mod = await import(pathToFileURL(path.join(process.cwd(), 'lib/cappens-markup.ts')).href);
const s = mod.cappensMarkup;
const main = s.match(/<main[\s\S]*?<\/main>/)?.[0] ?? 'no main';
// strip svg noise
const short = main
  .replace(/<svg[\s\S]*?<\/svg>/g, '[svg]')
  .replace(/<pattern[\s\S]*?<\/pattern>/g, '');
const chunks = short.split(/(?=<section|<div id="inicio"|class="hero")/);
chunks.forEach((c, i) => console.log(`---${i}---`, c.slice(0, 280).replace(/\s+/g, ' ')));
