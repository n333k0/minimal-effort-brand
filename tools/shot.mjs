// Review helper: full-page screenshots of a URL at a given width, cut into viewport-tall tiles.
// node tools/shot.mjs <url> <width> <outdir> [maxTiles]
import { chromium } from 'playwright';
import fs from 'fs';
const [url, w = '1440', out = '/tmp/shots', max = '40'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: +w, height: 900 }, deviceScaleFactor: 1 });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
const sw = await p.evaluate(() => document.documentElement.scrollWidth);
let i = 0;
for (let y = 0; y < H && i < +max; y += 900, i++) {
  await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(2200);
  await p.screenshot({ path: `${out}/t${String(i).padStart(2, '0')}.png` });
}
console.log(JSON.stringify({ height: H, scrollWidth: sw, tiles: i, errors: errs.slice(0, 10) }));
await b.close();
