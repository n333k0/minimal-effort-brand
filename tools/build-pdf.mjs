// Prints the guidelines (index.html?print=1) to downloads/minimal-effort-brand-guidelines.pdf, landscape 1600x1000 pages.
// Needs the folder served on :8790 (npm run serve) or pass a base URL: node tools/build-pdf.mjs http://127.0.0.1:8790
import { chromium } from 'playwright';
import path from 'path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const base = process.argv[2] || 'http://127.0.0.1:8790';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.emulateMedia({ media: 'print' });
await p.goto(`${base}/index.html?print=1`, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
// make sure every video shows its poster frame and every preview is drawn
await p.evaluate(async () => {
  document.querySelectorAll('video').forEach(v => { const img = document.createElement('img'); img.src = v.poster; img.style.cssText = v.style.cssText; img.className = v.className; img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover'; v.replaceWith(img); });
  await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
});
await p.waitForFunction(() => document.documentElement.dataset.logos === '1', null, { timeout: 15000 });
await p.waitForTimeout(1500);
await p.pdf({ path: path.join(ROOT, 'downloads/minimal-effort-brand-guidelines.pdf'), width: '1600px', height: '1000px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await b.close();
console.log('pdf written');
