import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib/cappens-markup.ts');
let src = fs.readFileSync(file, 'utf8');

src = src.replace(/\/logo-cappens-nav-dolphin\.png/g, '/logo-cappens-nav.png');
src = src.replace(
  /width=\\"292\\" height=\\"264\\"/,
  'width=\\"804\\" height=\\"304\\"'
);
src = src.replace(
  /alt=\\"Cappens: delfín de origami\\"/,
  'alt=\\"Cappens: delfín de origami gris junto a la palabra cappens\\"'
);

if (!src.includes('/logo-cappens-nav.png')) throw new Error('Full logo path not applied');
fs.writeFileSync(file, src);
console.log('Nav logo restored to full cappens + delfín PNG');
