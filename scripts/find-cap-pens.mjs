import { pathToFileURL } from 'url';
import path from 'path';
const mod = await import(pathToFileURL(path.join(process.cwd(), 'lib/cappens-markup.ts')).href);
const s = mod.cappensMarkup;
for (const pat of ['class="name"', 'half cap', 'half pens', 'meaning', 'piece', 'header', 'nav']) {
  console.log(pat, s.includes(pat.replace(' ', ' cap')) ? 'yes' : 'no', s.indexOf(pat));
}
const nameIdx = s.indexOf('class="name"');
if (nameIdx >= 0) console.log('\nname block:\n', s.slice(nameIdx, nameIdx + 800));
