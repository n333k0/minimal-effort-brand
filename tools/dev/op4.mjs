// Checks the ME construction panel: the mark + MINIMAL/EFFORT labels as one group against the inner square, at a few sizes.
//   node tools/dev/op4.mjs <outdir> [base-url]
import { chromium } from 'playwright';
const OUT = process.argv[2], BASE = process.argv[3] || 'http://127.0.0.1:8790/';
const b = await chromium.launch({ channel: 'chrome' });
for (const [w, h] of [[1440, 900], [1280, 720], [1920, 1080], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => { const s = document.querySelector('.op4'); scrollTo(0, s.offsetTop + (s.offsetHeight - innerHeight) * .97); });
  await p.waitForTimeout(1500);
  const m = await p.evaluate(() => {
    const sq = document.querySelectorAll('.op4 svg.ln rect')[1].getBoundingClientRect();
    const els = [...document.querySelectorAll('.op4 .glyph svg, .op4 .lab2')].map(e => e.getBoundingClientRect());
    const g = { l: Math.min(...els.map(r => r.left)), r: Math.max(...els.map(r => r.right)), t: Math.min(...els.map(r => r.top)), b: Math.max(...els.map(r => r.bottom)) };
    const labs = [...document.querySelectorAll('.op4 .lab2')].map(e => [Math.round(e.offsetHeight), e.getClientRects().length]);
    return { square: [sq.left, sq.right, sq.top, sq.bottom].map(Math.round), group: [g.l, g.r, g.t, g.b].map(Math.round),
      dx: +((g.l + g.r) / 2 - (sq.left + sq.right) / 2).toFixed(1), dy: +((g.t + g.b) / 2 - (sq.top + sq.bottom) / 2).toFixed(1),
      inside: g.l >= sq.left && g.r <= sq.right && g.t >= sq.top && g.b <= sq.bottom, labs, sw: document.documentElement.scrollWidth };
  });
  console.log(w + 'x' + h, JSON.stringify(m));
  await p.screenshot({ path: `${OUT}/op4_${w}.png` });
  await p.close();
}
await b.close();
