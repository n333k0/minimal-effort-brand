// Export PNG from the builder for a spec; report size.  node tools/dev/exporttest.mjs 'spec-json' out.png [base]
import { chromium } from 'playwright';
const [J, OUT, BASE = 'http://127.0.0.1:8790/'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome' }); const c = await b.newContext({ acceptDownloads: true }); const p = await c.newPage({ viewport: { width: 1440, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(BASE + 'builder.html#' + Buffer.from(J).toString('base64'), { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
const [d] = await Promise.all([p.waitForEvent('download', { timeout: 60000 }), p.click('#bPng')]);
await d.saveAs(OUT); console.log('saved', d.suggestedFilename(), 'errors', JSON.stringify(errs));
await b.close();
