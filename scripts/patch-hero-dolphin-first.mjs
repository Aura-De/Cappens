import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib/cappens-markup.ts');
let src = fs.readFileSync(file, 'utf8');

const heroOpen = src.indexOf('<div class=\\"hero\\">');
if (heroOpen < 0) throw new Error('hero not found');
const servicios = src.indexOf('<section id=\\"servicios\\">', heroOpen);
if (servicios < 0) throw new Error('servicios not found');

const heroInner = src.slice(heroOpen, servicios);
const copyStart = heroInner.indexOf('<div class=\\"copy\\">');
const stageStart = heroInner.indexOf('<div class=\\"stage\\" id=\\"stage\\">');
if (copyStart < 0 || stageStart < 0) throw new Error('copy or stage missing');

const copyBlock = extractBalancedDiv(heroInner, copyStart);
const stageBlock = extractBalancedDiv(heroInner, stageStart);
if (!copyBlock || !stageBlock) throw new Error('could not parse blocks');

const newHero =
  '<div class=\\"hero\\">\\n      ' + stageBlock + '\\n      ' + copyBlock + '\\n    ';
const newSrc = src.slice(0, heroOpen) + newHero + src.slice(servicios);
fs.writeFileSync(file, newSrc);
console.log('Hero reordered: delfín arriba, copy abajo');

function extractBalancedDiv(html, start) {
  const openEnd = html.indexOf('>', start);
  if (openEnd < 0) return null;
  let depth = 1;
  let i = openEnd + 1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', i);
    const nextClose = html.indexOf('</div>', i);
    if (nextClose < 0) return null;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) return html.slice(start, nextClose + 6);
      i = nextClose + 6;
    }
  }
  return null;
}
