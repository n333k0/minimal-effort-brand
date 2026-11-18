// Frames of a spec's text animation at given times (s).  node tools/dev/animseq.mjs out-prefix 'spec-json' t1,t2,... [base]
import { chromium } from 'playwright';
import fs from 'fs';
const [OUT, J, TS, BASE = 'http://127.0.0.1:8790/'] = process.argv.slice(2), spec = JSON.parse(J);
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto(BASE + 'builder.html#' + Buffer.from(JSON.stringify(spec)).toString('base64'), { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
const r = await p.evaluate(() => { const q = document.querySelector('#preview > div').getBoundingClientRect(); return { x: q.x, y: q.y, width: q.width, height: q.height }; });
for (const t of TS.split(',')) { await p.evaluate(t => document.getAnimations().forEach(a => { a.pause(); a.currentTime = t * 1000; }), +t); await p.waitForTimeout(120); fs.writeFileSync(`${OUT}_${t}.png`, await p.screenshot({ clip: r })); }
await b.close();
