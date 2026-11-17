import { chromium } from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path';
const ROOT = process.cwd();
const server = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (q.url === '/') { r.writeHead(200, { 'content-type': 'text/html' }); return r.end('<body style="margin:0;background:#333"><div id=g style="display:flex;flex-wrap:wrap;gap:6px"></div>'); } if (!fs.existsSync(p)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : p.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream' }); fs.createReadStream(p).pipe(r); });
await new Promise(r => server.listen(0, '127.0.0.1', r));
const b = await chromium.launch({ channel: 'chrome', args: ['--use-angle=metal', '--ignore-gpu-blocklist'] }); const pg = await b.newPage({ viewport: { width: 1500, height: 900 } });
const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => m.type() === 'error' && errs.push(m.text()));
await pg.goto(`http://127.0.0.1:${server.address().port}/`);
await pg.evaluate(async () => {
  const { mountShader, MODES } = await import('/assets/js/shaders.js');
  const pals = ['brand', 'lime', 'ice', 'maze', 'violet', 'mono', 'acid', 'lilac', 'brand', 'ember', 'brand', 'lime'];
  let i = 0;
  for (const m of Object.keys(MODES)) { const c = document.createElement('canvas'); c.width = 240; c.height = 300; document.getElementById('g').append(c); const a = await mountShader(c, { mode: m, palette: pals[i++ % pals.length], scale: .7, cell: 10 }); a.draw(.3); }
  for (const mk of ['wordmark', 'mnml', 'maze']) { const c = document.createElement('canvas'); c.width = 240; c.height = 300; document.getElementById('g').append(c); const a = await mountShader(c, { mode: 'chrome', mark: mk, palette: 'brand', scale: .8 }); a.draw(.3); }
});
await pg.waitForTimeout(500); await pg.screenshot({ path: process.argv[2] }); console.log(JSON.stringify(errs)); await b.close(); server.close();
