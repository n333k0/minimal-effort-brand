import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage();
const spec = JSON.parse(process.argv[2]);
await p.goto('http://127.0.0.1:8790/builder.html#' + Buffer.from(JSON.stringify(spec)).toString('base64'), { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const h = await p.evaluate(() => JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1))))));
for (const k of Object.keys(h)) if (JSON.stringify(h[k]) !== JSON.stringify(spec[k]) && k in spec) console.log('CHANGED', k, JSON.stringify(spec[k]), '->', JSON.stringify(h[k]));
console.log('bg', h.bg, await p.evaluate(() => [...document.querySelectorAll('#preview video, #preview img, #preview canvas')].map(v => v.tagName + ' ' + (v.currentSrc || v.src || v.dataset.src || '')).join('\n')));
await b.close();
