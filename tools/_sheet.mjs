// quick review sheet: renders example specs (stills) side by side into one PNG
import { chromium } from 'playwright';
const [out, ...names] = process.argv.slice(2);
const list = JSON.parse((await import('fs')).readFileSync('tools/examples/templates.json', 'utf8')).filter(e => !names.length || names.some(n => e.name.startsWith(n)));
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1800, height: 1000 } });
await p.goto('http://127.0.0.1:8790/render.html', { waitUntil: 'networkidle' });
await p.evaluate(async list => {
  const { preview } = await import('./assets/js/templates.js');
  document.body.innerHTML = '<div id=g style="display:flex;flex-wrap:wrap;gap:8px;background:#777;padding:8px;width:1784px"></div>';
  const g = document.getElementById('g');
  for (const e of list) for (const f of e.formats) { const d = document.createElement('div'); d.innerHTML = preview({ ...e, format: f }, f === 'landscape' ? 420 : 210, { forExport: true }); g.append(d); }
  await document.fonts.ready; await new Promise(r => setTimeout(r, 1500));
}, list);
await p.locator('#g').screenshot({ path: out });
await b.close();
