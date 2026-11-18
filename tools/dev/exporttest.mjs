import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' }); const ctx = await b.newContext({ acceptDownloads: true, viewport: { width: 1500, height: 950 } }); const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('http://127.0.0.1:8790/builder.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
await p.click('#tpl [data-v="poster"]'); await p.click('#lay [data-v="portrait"]'); await p.click('#fxm [data-v="ascii"]'); await p.click('#anc [data-v="blur"]'); await p.waitForTimeout(1500);
const [d] = await Promise.all([p.waitForEvent('download', { timeout: 30000 }), p.click('#bPng')]);
await d.saveAs(process.argv[2]); console.log(JSON.stringify(errs)); await b.close();
