import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const source =
  process.argv[2] ||
  'c:/Users/Usuario/Downloads/Cappens Technology.html';

const s = fs.readFileSync(source, 'utf8');

const cssStart = s.indexOf('  /* Layout: franja de papel');
const cssEnd = s.indexOf('</style>', cssStart);
const css = s.slice(cssStart, cssEnd).trim();

const afterCss = cssEnd + '</style>'.length;
const scriptStart = s.lastIndexOf('<script>');
const bodyHtml = s.slice(afterCss, scriptStart).trim();

const script = s
  .slice(scriptStart + '<script>'.length, s.lastIndexOf('</script>'))
  .trim();

const outDir = path.join(root, 'scripts', 'extracted');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(root, 'app', 'globals.css'), css + '\n');
fs.writeFileSync(path.join(outDir, 'body.html'), bodyHtml);
fs.writeFileSync(path.join(outDir, 'legacy-script.js'), script);

console.log('Wrote globals.css, body.html, legacy-script.js');
console.log('css', css.length, 'body', bodyHtml.length, 'script', script.length);
