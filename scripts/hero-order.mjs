import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const src = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib/cappens-markup.ts'), 'utf8');
const heroStart = src.indexOf('class=\\"hero\\"');
const heroChunk = src.slice(heroStart, heroStart + 25000);
const copy = heroChunk.indexOf('class=\\"copy\\"');
const stage = heroChunk.indexOf('id=\\"stage\\"');
console.log({ copy, stage, first: copy < stage ? 'copy' : 'stage' });
