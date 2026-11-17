import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://127.0.0.1:8790/index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
for (let y = 0; y < 60000; y += 800) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(60); }
await p.waitForTimeout(1500);
console.log(await p.evaluate(() => { const W = document.documentElement.clientWidth, out = []; document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.right > W + 1 && r.width > 0 && !e.closest('.ab') && getComputedStyle(e).position !== 'fixed') out.push([e.tagName, e.className.toString().slice(0, 40), Math.round(r.right), e.closest('section')?.id]); }); return [document.documentElement.scrollWidth, out.slice(0, 15)]; }));
await b.close();
