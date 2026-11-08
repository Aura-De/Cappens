import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const mod = await import(new URL('../lib/cappens-markup.ts', import.meta.url).href);
const text = mod.cappensMarkup.replace(/<[^>]+>/g, '\n').replace(/\s+/g, ' ').trim();
const parts = [...new Set(text.split(/\n|\. /).map((s) => s.trim()).filter((s) => s.length > 8 && s.length < 120))];
console.log(parts.slice(0, 40).join('\n'));
