// Checks every link and media source in the rendered page (including the ones sections.js writes at runtime).
// node tools/check-dom-links.mjs [page ...]   (needs the folder served on :8790)
import { chromium } from 'playwright';
const base = 'http://127.0.0.1:8790/';
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['index.html', 'v3.html', 'v1.html', 'builder.html'];
const b = await chromium.launch({ channel: 'chrome' });
let bad = 0;
for (const pg of pages) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + pg, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  const urls = await p.evaluate(() => [...new Set([...document.querySelectorAll('a[href],img[src],video[src],video[poster],source[src],link[href]')]
    .flatMap(e => [e.getAttribute('href'), e.getAttribute('src'), e.getAttribute('poster')]).filter(Boolean)
    .filter(u => !/^(https?:|mailto:|#|data:|blob:|javascript:)/.test(u)).map(u => new URL(u, location.href).href))]);
  const miss = [];
  for (const u of urls) { const r = await p.request.fetch(u, { method: 'HEAD' }).catch(() => null); if (!r || r.status() >= 400) miss.push(u.replace(base, '')); }
  bad += miss.length;
  console.log(`${pg}: ${urls.length} checked, ${miss.length} missing${miss.length ? '\n  ' + miss.join('\n  ') : ''}`);
  await p.close();
}
await b.close();
process.exit(bad ? 1 : 0);
