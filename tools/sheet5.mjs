// Review sheet with hydration (effects + fitting): node tools/sheet5.mjs <out.png> <specs.json | -> [width per tile]
// specs.json: array of specs (each may carry "formats"). Needs the local server on :8790.
import { chromium } from 'playwright';
import fs from 'fs';
const [out, file, tw = '260'] = process.argv.slice(2);
const list = JSON.parse(fs.readFileSync(file === '-' ? 0 : file, 'utf8'));
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1900, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('response', r => r.status() >= 400 && errs.push(r.status() + ' ' + r.url()));
await p.goto('http://127.0.0.1:8790/render.html', { waitUntil: 'networkidle' });
await p.evaluate(async ({ list, tw }) => {
  const { preview } = await import('./assets/js/templates.js'); const { hydrate } = await import('./assets/js/hydrate.js');
  await Promise.all(["800 100px 'ABC Normal'", "100px '403 Quzie'", "100px '403 Quzie Condensed'", "100px '403 Quzie Wide'", "600 20px 'IBM Plex Mono'"].map(f => document.fonts.load(f).catch(() => 0)));
  document.body.innerHTML = '<div id=g style="display:flex;flex-wrap:wrap;gap:10px;background:#555;padding:10px;width:1880px;align-items:flex-start;font:11px monospace;color:#fff"></div>';
  const g = document.getElementById('g');
  for (const e of list) for (const f of (e.formats || [e.format || 'feed'])) { const d = document.createElement('div'); const w = f === 'landscape' ? +tw * 2 : +tw; d.innerHTML = preview({ ...e, format: f }, w, { forExport: true }) + `<div>${(e.name || e.template + ' ' + (e.layout || ''))} · ${f}</div>`; g.append(d); }
  await hydrate(g, { scale: .5, animate: false });
  document.getAnimations().forEach(a => { a.pause(); a.currentTime = 4000; });
  await new Promise(r => setTimeout(r, 1200));
}, { list, tw });
await p.locator('#g').screenshot({ path: out });
console.log(JSON.stringify(errs.slice(0, 10)));
await b.close();
