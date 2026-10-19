import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'lib/cappens-markup.ts');
let src = fs.readFileSync(file, 'utf8');

// Remove "El nombre" nav links (desktop + drawer)
src = src.replace(/<a href=\\"#nombre\\">El nombre<\/a>\s*/g, '');

// Remove entire #nombre section
const sectionRe = /<section id=\\"nombre\\">[\s\S]*?<\/section>\s*/;
if (!sectionRe.test(src)) throw new Error('section #nombre not found');
src = src.replace(sectionRe, '');

// Nav logo: dolphin only
src = src.replace(
  /alt=\\"Cappens: delfín de origami gris junto a la palabra cappens\\"/,
  'alt=\\"Cappens: delfín de origami\\"'
);
src = src.replace(
  /aria-label=\\"Cappens, ir al inicio\\"/,
  'aria-label=\\"Cappens, ir al inicio\\"'
);
src = src.replace(/width=\\"804\\" height=\\"304\\"/, 'width=\\"292\\" height=\\"304\\"');

fs.writeFileSync(file, src);
console.log('Removed #nombre section and nav links; updated logo dimensions.');
