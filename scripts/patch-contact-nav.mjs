import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'lib', 'cappens-markup.ts');

const mod = await import(pathToFileURL(file).href);
let markup = mod.cappensMarkup;

if (markup.includes('data-contact-modal')) {
  console.log('Contact nav already patched');
  process.exit(0);
}

const desktopNeedle = '<a href="#metodo">Cómo trabajamos</a>\n    </nav>';
const desktopPatch =
  '<a href="#metodo">Cómo trabajamos</a>\n      <a href="#contacto" class="contact-nav-link" data-contact-modal>Contacto</a>\n    </nav>';

const drawerNeedle = '<li><a href="#metodo">Cómo trabajamos</a></li>\n      </ul>';
const drawerPatch =
  '<li><a href="#metodo">Cómo trabajamos</a></li>\n        <li><a href="#contacto" class="contact-nav-link" data-contact-modal>Contacto</a></li>\n      </ul>';

if (!markup.includes(desktopNeedle)) throw new Error('Desktop nav needle not found');
if (!markup.includes(drawerNeedle)) throw new Error('Drawer nav needle not found');

markup = markup.replace(desktopNeedle, desktopPatch).replace(drawerNeedle, drawerPatch);

fs.writeFileSync(
  file,
  `/** Generated from Cappens Technology.html — do not edit by hand */\nexport const cappensMarkup = ${JSON.stringify(markup)};\n`
);
console.log('Patched contact nav links in cappens-markup.ts');
