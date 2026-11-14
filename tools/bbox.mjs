import { chromium } from 'playwright';
import fs from 'fs';
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage();
for (const f of process.argv.slice(2)) {
  await p.setContent(fs.readFileSync(f, 'utf8'));
  const r = await p.evaluate(() => [...document.querySelectorAll('path')].map(e => { const b = e.getBBox(); return [b.x, b.y, b.width, b.height].map(v => +v.toFixed(1)); }));
  console.log(f, JSON.stringify(r));
}
await b.close();
