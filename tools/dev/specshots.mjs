// Screenshot the builder preview for several specs into one sheet.  node tools/dev/specshots.mjs out.png '[spec,...]' [cols] [base]
import { chromium } from 'playwright';
import fs from 'fs';
const [OUT, J, COLS = '5', BASE = 'http://127.0.0.1:8790/'] = process.argv.slice(2), specs = JSON.parse(J);
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const shots = [];
for (const s of specs) { await p.goto('about:blank'); await p.goto(BASE + 'builder.html#' + Buffer.from(JSON.stringify(s)).toString('base64'), { waitUntil: 'networkidle' }); await p.waitForTimeout(1400);
  const r = await p.evaluate(() => { const q = document.querySelector('#preview > div').getBoundingClientRect(); return { x: q.x, y: q.y, width: q.width, height: q.height }; }); shots.push((await p.screenshot({ clip: r })).toString('base64')); }
await p.evaluate(W => { window.__W = W; }, process.env.W || 360);
const sheet = await p.evaluate(async ({ shots, cols, labels }) => { const ims = await Promise.all(shots.map(s => { const i = new Image(); i.src = 'data:image/png;base64,' + s; return i.decode().then(() => i); }));
  const w = +(window.__W || 360), h = Math.round(w * ims[0].height / ims[0].width), c = document.createElement('canvas'); c.width = cols * w; c.height = Math.ceil(ims.length / cols) * h; const g = c.getContext('2d');
  ims.forEach((im, i) => { g.drawImage(im, (i % cols) * w, Math.floor(i / cols) * h, w, h); g.fillStyle = '#B4F152'; g.font = 'bold 15px monospace'; g.fillText(labels[i], (i % cols) * w + 8, Math.floor(i / cols) * h + 20); });
  return c.toDataURL('image/jpeg', .88).split(',')[1]; }, { shots, cols: +COLS, labels: specs.map(s => s._l || s.tex || s.bg || s.template) });
fs.writeFileSync(OUT, Buffer.from(sheet, 'base64')); await b.close();
