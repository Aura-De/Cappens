import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const body = fs.readFileSync(path.join(__dirname, 'extracted/body.html'), 'utf8');

const headerStart = body.indexOf('<header class="nav"');
const mainStart = body.indexOf('<main id="inicio">');
const footerStart = body.indexOf('<footer>');

const svgDefs = body.slice(0, headerStart).trim();
const header = body.slice(headerStart, mainStart).trim();
const mainAndFooter = body.slice(mainStart, footerStart).trim();
const footer = body.slice(footerStart).trim();

const stageStart = mainAndFooter.indexOf('<div class="stage" id="stage">');
const stageEnd = mainAndFooter.indexOf('</div>', stageStart) + '</div>'.length;
// stage contains nested divs - find closing of stage by id stage
let depth = 0;
let stageClose = stageStart;
const stageOpenTag = '<div class="stage" id="stage">';
const from = mainAndFooter.indexOf(stageOpenTag);
let i = from;
while (i < mainAndFooter.length) {
  if (mainAndFooter.slice(i, i + 4) === '<div') {
    depth++;
    i += 4;
    continue;
  }
  if (mainAndFooter.slice(i, i + 6) === '</div>') {
    depth--;
    i += 6;
    if (depth === 0) {
      stageClose = i;
      break;
    }
    continue;
  }
  i++;
}

const heroBefore = mainAndFooter.slice(0, from).trim();
const stage = mainAndFooter.slice(from, stageClose).trim();
const mainAfter = mainAndFooter.slice(stageClose).trim();

const out = path.join(__dirname, 'extracted', 'parts');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'svg-defs.html'), svgDefs);
fs.writeFileSync(path.join(out, 'header.html'), header);
fs.writeFileSync(path.join(out, 'hero-before.html'), heroBefore);
fs.writeFileSync(path.join(out, 'stage.html'), stage);
fs.writeFileSync(path.join(out, 'main-after.html'), mainAfter);
fs.writeFileSync(path.join(out, 'footer.html'), footer);

console.log({
  svgDefs: svgDefs.length,
  header: header.length,
  heroBefore: heroBefore.length,
  stage: stage.length,
  mainAfter: mainAfter.length,
  footer: footer.length,
});
