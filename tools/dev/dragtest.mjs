// Builder test: Second Wind, + Add label, drag it onto the artists, check snapping, export the PNG.
//   node tools/dev/dragtest.mjs <outdir> [base-url] [width height]
import { chromium } from 'playwright';
const OUT = process.argv[2], BASE = process.argv[3] || 'http://127.0.0.1:8790/', VW = +process.argv[4] || 1440, VH = +process.argv[5] || 900;
const spec = { template: 'lineup', layout: 'center', bg: 'waves', format: 'feed' };
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: VW, height: VH }, acceptDownloads: true }); const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.goto(BASE + 'builder.html#' + Buffer.from(JSON.stringify(spec)).toString('base64'), { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await p.click('#xlAdd'); await p.waitForTimeout(1500);
const lab = p.locator('#preview [data-xli="0"]'); await lab.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
const a = await lab.boundingBox();
// target: centred above LEE BURRIDGE (the first big name)
const t = await p.evaluate(() => { const n = [...document.querySelectorAll('#preview .lbx')].find(e => /LEE BURRIDGE/.test(e.textContent) && !e.dataset.xli); const r = n.getBoundingClientRect(); return { cx: r.left + r.width / 2, top: r.top }; });
const fromX = a.x + a.width / 2, fromY = a.y + a.height / 2, toX = t.cx + 3, toY = t.top - a.height / 2 - 2; // a few px off: snapping should fix it
await p.mouse.move(fromX, fromY); await p.mouse.down();
for (let i = 1; i <= 12; i++) await p.mouse.move(fromX + (toX - fromX) * i / 12, fromY + (toY - fromY) * i / 12);
const guides = await p.evaluate(() => [...document.querySelectorAll('.xguide')].filter(g => g.style.display !== 'none').length);
await p.mouse.up(); await p.waitForTimeout(1500);
const m = await p.evaluate(() => {
  const ab = document.querySelector('#preview .ab'), A = ab.getBoundingClientRect(), k = A.width / ab.offsetWidth;
  const l = document.querySelector('#preview [data-xli="0"]').getBoundingClientRect();
  const n = [...document.querySelectorAll('#preview .lbx')].find(e => /LEE BURRIDGE/.test(e.textContent) && !e.dataset.xli).getBoundingClientRect();
  return { labelCentreVsPost: +(((l.left + l.right) / 2 - A.left) / k - ab.offsetWidth / 2).toFixed(1), gapToArtist: +((n.top - l.bottom) / k).toFixed(1), field: document.querySelector('[data-xlt="0"]').value, saved: JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1))))).extras, k: +k.toFixed(4), w: +(l.width / k).toFixed(2) };
});
console.log('guides while dragging', guides, JSON.stringify(m));
await p.screenshot({ path: `${OUT}/drag_${VW}.png` });
if (VW > 900) {
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#bPng')]);
  await dl.saveAs(`${OUT}/export.png`); console.log('exported', dl.suggestedFilename());
}
console.log('errors', JSON.stringify(errs));
await b.close();
