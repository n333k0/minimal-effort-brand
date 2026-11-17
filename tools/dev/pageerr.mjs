// Page errors + horizontal overflow at 1440/390 and the builder.  node tools/dev/pageerr.mjs [base-url]
import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
for (const [u, w] of [['index.html', 1440], ['index.html', 390], ['builder.html', 1440]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto((process.argv[2] || 'http://127.0.0.1:8790/') + u, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  for (let y = 0; y < 60000 && u === 'index.html'; y += 1200) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(40); }
  await p.waitForTimeout(1200);
  console.log(u, w, 'scrollWidth', await p.evaluate(() => document.documentElement.scrollWidth), 'errors', JSON.stringify(errs.slice(0, 5)));
  await p.close();
}
await b.close();
