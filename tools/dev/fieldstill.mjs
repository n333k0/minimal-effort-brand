// Stills of the light fields (assets/js/fields.js).  node tools/dev/fieldstill.mjs out.png 'mode:palette,mode:palette,...' [phase]
import { chromium } from 'playwright';
import fs from 'fs';
const [OUT, LIST, PH = '0.3'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', args: ['--use-angle=metal', '--ignore-gpu-blocklist'] }); const p = await b.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('http://127.0.0.1:8790/tools/');
const data = await p.evaluate(async ({ LIST, PH }) => {
  const { mountField } = await import('/assets/js/fields.js?' + Date.now());
  const out = [];
  for (const it of LIST.split(',')) { const [mode, palette, seed = 0, turn = 0, flip = ''] = it.split(':'); const c = document.createElement('canvas'); c.width = 432; c.height = 540;
    const api = await mountField(c, { mode, palette, seed: +seed, turn: +turn, flip: !!flip }); api.draw(+PH); out.push(c.toDataURL('image/png')); }
  const W = 432, H = 540, n = out.length, cols = Math.min(n, 6), rows = Math.ceil(n / cols), sheet = document.createElement('canvas'); sheet.width = cols * W; sheet.height = rows * H; const g = sheet.getContext('2d');
  for (let i = 0; i < n; i++) { const im = new Image(); im.src = out[i]; await im.decode(); g.drawImage(im, (i % cols) * W, Math.floor(i / cols) * H); g.fillStyle = '#fff'; g.font = '16px monospace'; g.fillText(LIST.split(',')[i], (i % cols) * W + 8, Math.floor(i / cols) * H + 22); }
  return sheet.toDataURL('image/png').split(',')[1];
}, { LIST, PH });
fs.writeFileSync(OUT, Buffer.from(data, 'base64')); console.log('errors', JSON.stringify(errs));
await b.close();
