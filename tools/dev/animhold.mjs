// Screenshot a spec mid-hold (5 s) with and without its text animation.  node tools/dev/animhold.mjs out.png 'spec-json' [base]
import { chromium } from 'playwright';
const [OUT, J, BASE = 'http://127.0.0.1:8790/'] = process.argv.slice(2), spec = JSON.parse(J);
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const go = async s => { await p.goto('about:blank'); await p.goto(BASE + 'builder.html#' + Buffer.from(JSON.stringify(s)).toString('base64'), { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  await p.evaluate(() => document.getAnimations().forEach(a => { a.pause(); a.currentTime = 5000; })); await p.waitForTimeout(200);
  const r = await p.evaluate(() => { const q = document.querySelector('#preview > div').getBoundingClientRect(); return { x: q.x, y: q.y, width: q.width, height: q.height }; }); return p.screenshot({ clip: r }); };
const fs = await import('fs'); const a = await go(spec), c = await go({ ...spec, anim: 'none' });
fs.writeFileSync(OUT.replace('.png', '_anim.png'), a); fs.writeFileSync(OUT.replace('.png', '_still.png'), c);
await b.close();
