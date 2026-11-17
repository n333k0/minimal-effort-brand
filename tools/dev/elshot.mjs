// node tools/dev/elshot.mjs <url> <selector> <out.png> [width]
import { chromium } from 'playwright';
const [url, sel, out, w = '1440'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: +w, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const l = p.locator(sel).first(); await l.scrollIntoViewIfNeeded(); await p.waitForTimeout(2500);
await l.screenshot({ path: out }); console.log(JSON.stringify(errs)); await b.close();
