// Builder test (Second Wind): + Add label lands above the headliner in the stack; drag it below JAMIIE; pick a spot from the
// Where menu; Alt-drag it free; export the PNG.   node tools/dev/dragtest.mjs <outdir> [base-url] [width height]
import { chromium } from 'playwright';
const OUT = process.argv[2], BASE = process.argv[3] || 'http://127.0.0.1:8790/', VW = +process.argv[4] || 1440, VH = +process.argv[5] || 900;
const spec = { template: 'lineup', layout: 'center', bg: 'waves', format: 'feed' };
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: VW, height: VH }, acceptDownloads: true }); const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.goto(BASE + 'builder.html#' + Buffer.from(JSON.stringify(spec)).toString('base64'), { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
// where the label sits: centre offset from the post's centre, and the blocks right above / below it
const where = () => p.evaluate(() => {
  const ab = document.querySelector('#preview .ab'), A = ab.getBoundingClientRect(), k = A.width / ab.offsetWidth, el = document.querySelector('#preview [data-xli="0"]'); if (!el) return null;
  const r = el.getBoundingClientRect(), all = [...ab.querySelectorAll('.lbx')].filter(e => e !== el).map(e => ({ t: e.textContent.trim().slice(0, 14), r: e.getBoundingClientRect() }));
  const above = all.filter(o => Math.abs(o.r.bottom - r.top) < 1.5).map(o => o.t), below = all.filter(o => Math.abs(o.r.top - r.bottom) < 1.5).map(o => o.t);
  return { centre: +(((r.left + r.right) / 2 - A.left) / k - ab.offsetWidth / 2).toFixed(1), above, below, flow: getComputedStyle(el).position !== 'absolute', saved: JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1))))).extras, where: document.querySelector('[data-xlw="0"]')?.selectedOptions[0]?.textContent };
});
await p.click('#xlAdd'); await p.waitForTimeout(1500);
console.log('1 added    ', JSON.stringify(await where()));
await p.screenshot({ path: `${OUT}/flow_added_${VW}.png` });
const lab = p.locator('#preview [data-xli="0"]'); await lab.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
const drag = async (toX, toY, alt) => {
  const a = await lab.boundingBox(); const fx = a.x + a.width / 2, fy = a.y + a.height / 2;
  if (alt) await p.keyboard.down('Alt');
  await p.mouse.move(fx, fy); await p.mouse.down();
  for (let i = 1; i <= 14; i++) await p.mouse.move(fx + (toX - fx) * i / 14, fy + (toY - fy) * i / 14);
  const g = await p.evaluate(() => [...document.querySelectorAll('.xguide')].filter(g => g.style.display !== 'none').length);
  await p.mouse.up(); if (alt) await p.keyboard.up('Alt'); await p.waitForTimeout(1300); return g;
};
const jam = await p.evaluate(() => { const n = [...document.querySelectorAll('#preview .lbx')].find(e => /JAMIIE/.test(e.textContent)); const r = n.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.bottom + 12 }; });
console.log('2 dragged below JAMIIE, guides', await drag(jam.x - 20, jam.y), JSON.stringify(await where()));
await p.selectOption('[data-xlw="0"]', { index: 4 }); await p.waitForTimeout(1300); // "Above" the 3rd block
console.log('3 picked from menu', JSON.stringify(await where()));
const ab = await p.locator('#preview .ab').boundingBox();
console.log('4 alt-drag free, guides', await drag(ab.x + ab.width * .8, ab.y + ab.height * .15, true), JSON.stringify(await where()));
await p.screenshot({ path: `${OUT}/flow_${VW}.png` });
if (VW > 900) {
  await p.selectOption('[data-xlw="0"]', { index: 8 }); await p.waitForTimeout(1300); // above the 5th block (LEE BURRIDGE)
  console.log('5 back above LEE', JSON.stringify(await where()));
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#bPng')]);
  await dl.saveAs(`${OUT}/flow_export.png`); console.log('exported', dl.suggestedFilename());
}
console.log('errors', JSON.stringify(errs));
await b.close();
