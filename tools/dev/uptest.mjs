// Uploads survive a reload: upload a photo and a logo, reload, check they are back.  node tools/dev/uptest.mjs [base]
import { chromium } from 'playwright';
const BASE = process.argv[2] || 'http://127.0.0.1:8790/';
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(BASE + 'builder.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
await p.evaluate(() => document.querySelector('#tpl [data-v="announce"]').click()); await p.waitForTimeout(600);
await p.setInputFiles('#phFile', 'assets/img/party-01.jpg');
await p.waitForTimeout(1200);
await p.setInputFiles('#lgFile', 'assets/logo/favicon.svg'); await p.waitForTimeout(1500);
const before = await p.evaluate(() => ({ photo: document.querySelector('#preview .bg img, #preview .photo img')?.src.slice(0, 20), logos: document.querySelectorAll('#preview [data-lgi] img').length, chips: document.querySelectorAll('#photos .chip.mine').length }));
await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
const after = await p.evaluate(() => ({ photo: document.querySelector('#preview .bg img, #preview .photo img')?.src.slice(0, 20), logos: document.querySelectorAll('#preview [data-lgi] img').length, chips: document.querySelectorAll('#photos .chip.mine').length }));
console.log('before', JSON.stringify(before)); console.log('after reload', JSON.stringify(after)); console.log('errors', JSON.stringify(errs));
await b.close();
