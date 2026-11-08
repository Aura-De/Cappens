import { pathToFileURL } from 'url';
import path from 'path';
const mod = await import(pathToFileURL(path.join(process.cwd(), 'lib/cappens-markup.ts')).href);
for (const m of mod.cappensMarkup.matchAll(/<a[^>]*class="[^"]*btn[^"]*"[^>]*>[\s\S]*?<\/a>/g)) {
  console.log(m[0].replace(/\s+/g, ' ').slice(0, 200));
}
