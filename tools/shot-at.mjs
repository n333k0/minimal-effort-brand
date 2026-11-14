// Review helper: screenshots at given scroll positions (px or "sel:frac" = fraction through an element).
// node tools/shot-at.mjs <url> <width> <height> <outdir> pos1 pos2 ...
import { chromium } from 'playwright';
import fs from 'fs';
const [url, w, h, out, ...pos] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
let i = 0;
for (const q of pos) {
  const y = await p.evaluate(q => { if (!q.includes(':')) return +q; const [s, f] = q.split(':'); const el = document.querySelector(s); const r = el.getBoundingClientRect(); return scrollY + r.top + (r.height - innerHeight) * +f; }, q);
  await p.evaluate(y => { window.scrollTo(0, y); }, y); await p.waitForTimeout(2600);
  await p.screenshot({ path: `${out}/p${String(i++).padStart(2, '0')}.png` });
}
console.log(JSON.stringify({ errors: errs.slice(0, 8), sw: await p.evaluate(() => document.documentElement.scrollWidth) }));
await b.close();
