// Opens every example in the builder (as a click from the home page does) and compares the preview with the
// rendered PNG; also flags text that leaves the frame or sits on other text.
// node tools/dev/audit-builder.mjs [base-url] [filter]
import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = process.argv[2] || 'http://127.0.0.1:8790/', F = process.argv[3] || '';
const list = JSON.parse(fs.readFileSync(new URL('../examples/templates.json', import.meta.url))).filter(e => e.name.includes(F));
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const out = [];
for (const e of list) {
  const { name, formats, group, ...spec } = e; const f = formats[0];
  const hash = Buffer.from(JSON.stringify({ ...spec, format: f })).toString('base64');
  await p.goto('about:blank'); await p.goto(BASE + 'builder.html#' + hash, { waitUntil: 'networkidle' }); await p.waitForTimeout(1400);
  const r = await p.evaluate(async png => {
    const fr = document.querySelector('#preview > div'), R = fr.getBoundingClientRect();
    // text problems
    const boxes = [...fr.querySelectorAll('.lbx, h1, h2, h3, p, span, b, i, small, div')].filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && getComputedStyle(el).visibility !== 'hidden' && +getComputedStyle(el).opacity > 0.05)
      .map(el => { const rg = document.createRange(); rg.selectNodeContents(el); const q = rg.getBoundingClientRect(); return { el, q, t: el.textContent.trim().slice(0, 24) }; }).filter(o => o.q.width > 2 && o.q.height > 2);
    const clip = boxes.filter(o => o.q.top < R.top - 1 || o.q.left < R.left - 1 || o.q.right > R.right + 1 || o.q.bottom > R.bottom + 1).map(o => o.t);
    const ov = [];
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], c = boxes[j]; if (a.el.contains(c.el) || c.el.contains(a.el)) continue;
      const w = Math.min(a.q.right, c.q.right) - Math.max(a.q.left, c.q.left), h = Math.min(a.q.bottom, c.q.bottom) - Math.max(a.q.top, c.q.top);
      if (w > 3 && h > 3 && w * h > .15 * Math.min(a.q.width * a.q.height, c.q.width * c.q.height)) ov.push(a.t + ' / ' + c.t);
    }
    return { clip: [...new Set(clip)].slice(0, 4), ov: [...new Set(ov)].slice(0, 4), rect: [R.x, R.y, R.width, R.height] };
  }, `downloads/templates/${name}_${f}.png`);
  const shot = await p.screenshot({ clip: { x: r.rect[0], y: r.rect[1], width: r.rect[2], height: r.rect[3] } });
  const diff = await p.evaluate(async ([a, src]) => {
    const load = s => new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = s; });
    try {
      const [A, B] = await Promise.all([load('data:image/png;base64,' + a), load(src)]);
      const W = 54, H = Math.round(54 * B.height / B.width), px = im => { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(im, 0, 0, W, H); return g.getImageData(0, 0, W, H).data; };
      const x = px(A), y = px(B); let s = 0; for (let i = 0; i < x.length; i += 4) s += (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2])) / 3; return +(s / (x.length / 4)).toFixed(1);
    } catch (e) { return -1; }
  }, [shot.toString('base64'), BASE + `downloads/templates/${name}_${f}.png`]);
  const row = { name: name + '_' + f, diff, clip: r.clip, ov: r.ov }; out.push(row);
  if (diff > 18 || r.clip.length || r.ov.length) { console.log(JSON.stringify(row)); fs.writeFileSync(`${process.env.SHOTS || '/tmp'}/aud_${name}_${f}.png`, shot); }
}
fs.writeFileSync(process.env.OUT || '/dev/null', JSON.stringify(out, null, 1));
console.log('checked', out.length);
await b.close();
