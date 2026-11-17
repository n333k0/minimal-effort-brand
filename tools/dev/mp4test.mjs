// Drives the builder's Export MP4 for a few specs and saves the files.  node tools/dev/mp4test.mjs <outdir>
import fs from 'fs'; import { chromium } from 'playwright';
const OUT = process.argv[2];
const ex = JSON.parse(fs.readFileSync('tools/examples/templates.json', 'utf8'));
const pick = n => { const s = { ...ex.find(e => e.name === n) }; s.format = [].concat(s.formats || 'feed')[0]; delete s.formats; delete s.group; delete s.name; return s; };
const cases = { 'video-loop': pick('second-wind_waves'), 'anim-blur': { ...pick('poster-glow_feed'.replace('_feed', '')), anim: 'blur' }, 'fx-ascii': pick(ex.find(e => e.bg === 'fx' && e.fx?.mode === 'ascii').name) };
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
p.on('console', m => m.type() === 'error' && console.log('console', m.text())); p.on('pageerror', e => console.log('pageerror', e.message));
for (const [k, s] of Object.entries(cases)) {
  const hash = Buffer.from(encodeURIComponent(JSON.stringify(s)).replace(/%([0-9A-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16))), 'latin1').toString('base64');
  await p.goto(`http://127.0.0.1:8790/builder.html#${hash}`); await p.waitForTimeout(2500);
  const t0 = Date.now(); const dl = p.waitForEvent('download', { timeout: 600000 });
  await p.click('#bMp4'); const d = await dl; await d.saveAs(`${OUT}/${k}.mp4`);
  console.log(k, s.template, s.bg, s.format, ((Date.now() - t0) / 1000).toFixed(1) + 's', d.suggestedFilename());
}
await b.close();
