import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:8790/index.html', { waitUntil: 'networkidle' });
await p.locator('#gridshow').scrollIntoViewIfNeeded(); await p.waitForTimeout(3000);
console.log(await p.evaluate(() => [...document.querySelectorAll('#gridshow [data-fit]')].slice(0, 8).map(e => [e.closest('.ab').dataset.layout, e.dataset.fs0, e.style.fontSize, e.scrollWidth, e.clientWidth, e.dataset.grow])));
await b.close();
