import { pathToFileURL } from 'url';

const mod = await import(pathToFileURL(new URL('../lib/cappens-markup.ts', import.meta.url)).href);
const s = mod.cappensMarkup;
const texts = new Set();
for (const m of s.matchAll(/>([^<]{4,120})</g)) {
  const t = m[1].replace(/\\n/g, ' ').trim();
  if (t && !t.startsWith('http') && !/^[0-9.%\s]+$/.test(t)) texts.add(t);
}
console.log([...texts].sort().join('\n'));
