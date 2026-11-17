// One still per shader loop (the LOOPS of tools/render-shaders.mjs) at a small size, for checking marks before a full render.
//   node tools/dev/shaderstill.mjs <out.png>   (needs the local server on :8790)
import fs from 'fs'; import { chromium } from 'playwright';
const src = fs.readFileSync('tools/render-shaders.mjs', 'utf8'), LOOPS = eval('(' + src.match(/const LOOPS = (\{[\s\S]*?\});\n/)[1] + ')');
const b = await chromium.launch({ channel: 'chrome', args: ['--use-angle=metal', '--ignore-gpu-blocklist'] }); const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.goto('http://127.0.0.1:8790/render.html');
await p.evaluate(async L => {
  const { mountShader } = await import('/assets/js/shaders.js?' + Date.now());
  document.body.innerHTML = '<div id=g style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;background:#fff"></div>'; const g = document.getElementById('g');
  for (const [mode, [id, o]] of Object.entries(L)) { const c = document.createElement('canvas'); c.width = 270; c.height = 360; c.style.width = '100%'; g.append(c); const api = await mountShader(c, { mode: mode.split('-')[0], ...o }); api.draw(.3); }
}, LOOPS);
await p.waitForTimeout(500); await p.locator('#g').screenshot({ path: process.argv[2] }); await b.close();
