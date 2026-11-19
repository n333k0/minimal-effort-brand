// Screenshot a section of the guidelines page (after its live parts load).  node tools/dev/secshot.mjs '#applications' out.png [width] [base]
import { chromium } from 'playwright';
const [SEL, OUT, Wd = '1440', BASE = 'http://127.0.0.1:8790/'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: +Wd, height: 1000 } });
await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' });
await p.evaluate(s => document.querySelector(s).scrollIntoView(), SEL); await p.waitForTimeout(1500);
for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 500); await p.waitForTimeout(250); }
await p.evaluate(s => document.querySelector(s).scrollIntoView(), SEL); await p.waitForTimeout(2500);
const el = await p.$(SEL); await el.screenshot({ path: OUT });
await b.close();
