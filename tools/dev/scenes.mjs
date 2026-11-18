// Click through builder scenes and screenshot the preview.  node tools/dev/scenes.mjs outdir [base]
import { chromium } from 'playwright';
const OUT = process.argv[2], BASE = process.argv[3] || 'http://127.0.0.1:8790/';
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
const shot = async n => { await p.waitForTimeout(1600); const r = await p.evaluate(() => { const q = document.querySelector('#preview > div').getBoundingClientRect(); return [q.x, q.y, q.width, q.height]; }); await p.screenshot({ path: `${OUT}/${n}.png`, clip: { x: r[0], y: r[1], width: r[2], height: r[3] } }); };
const fresh = async (h = '') => { await p.goto('about:blank'); await p.goto(BASE + 'builder.html' + h, { waitUntil: 'networkidle' }); await p.waitForTimeout(600); };
const click = sel => p.evaluate(s => document.querySelector(s).click(), sel);
const scenes = {
  mazefield: async () => { await fresh(); await click('#bgs [data-v="maze"]'); },
  announce: async () => { await fresh(); await click('#tpl [data-v="announce"]'); },
  photo: async () => { await fresh(); await click('#bgs [data-v="photo"]'); },
  fx: async () => { await fresh(); await click('#bgs [data-v="fx"]'); },
  fxannounce: async () => { await fresh(); await click('#tpl [data-v="announce"]'); await p.waitForTimeout(300); await click('#bgs [data-v="fx"]'); },
  anloop: async () => { await fresh(); await click('#tpl [data-v="announce"]'); await p.waitForTimeout(300); await click('#bgs [data-v="waves"]'); },
  anmaze: async () => { await fresh(); await click('#tpl [data-v="announce"]'); await p.waitForTimeout(300); await click('#bgs [data-v="maze"]'); },
  posterphoto: async () => { await fresh(); await click('#tpl [data-v="poster"]'); await p.waitForTimeout(300); await click('#bgs [data-v="photo"]'); },
  posterfx: async () => { await fresh(); await click('#tpl [data-v="poster"]'); await p.waitForTimeout(300); await click('#bgs [data-v="fx"]'); },
  posterpick: async () => { await fresh(); await click('#tpl [data-v="poster"]'); await p.waitForTimeout(300); await click('#photos [data-v="party-03"]'); },
  maze: async () => { await fresh(); await click('#tpl [data-v="maze"]'); },
  tour: async () => { await fresh(); await click('#tpl [data-v="tour"]'); },
};
for (const [n, f] of Object.entries(scenes)) { if (process.argv[4] && !process.argv[4].split(',').includes(n)) continue; await f(); await shot(n); }
console.log('errors', JSON.stringify(errs));
await b.close();
