import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cappensMarkup } from '../lib/cappens-markup.ts';

const from = 'href="#contacto" class="contact-nav-link" data-contact-modal';
const to = 'href="/contacto" class="contact-nav-link"';

let markup = cappensMarkup;
if (!markup.includes(from) && markup.includes(to)) {
  console.log('Contact nav already points to /contacto');
  process.exit(0);
}
if (!markup.includes(from)) {
  throw new Error('contact nav pattern not found');
}
markup = markup.split(from).join(to);

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'cappens-markup.ts');
fs.writeFileSync(
  file,
  `/** Generated from Cappens Technology.html — do not edit by hand */\nexport const cappensMarkup = ${JSON.stringify(markup)};\n`
);
console.log('Nav contact links now use /contacto');
