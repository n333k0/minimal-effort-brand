import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
await p.goto('http://127.0.0.1:8790/render.html', { waitUntil: 'networkidle' });
await p.evaluate(async () => { document.body.innerHTML = ['403 Quzie Condensed','403 Quzie Narrow','403 Quzie','403 Quzie Wide','403 Quzie Expanded'].map(f => `<div style="font:110px/1 '${f}';color:#B4F152;background:#FF4A1A;white-space:nowrap">LEE BURRIDGE <small style="font:14px monospace;color:#000">${f}</small></div>`).join(''); await document.fonts.ready; });
await p.screenshot({ path: process.argv[2] }); await b.close();
