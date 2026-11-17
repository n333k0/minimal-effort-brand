// Renders example specs (by name from templates.json, with overrides) to PNG through render.html.
//   node tools/dev/shot1.mjs <outdir> '<json: [{"name":"announce_lee-burridge","extra":"A TO Z"}, ...]>'
import fs from 'fs'; import { chromium } from 'playwright';
const OUT = process.argv[2], list = JSON.parse(process.argv[3]);
const SIZE = { feed: [1080, 1350], story: [1080, 1920], square: [1080, 1080], landscape: [1920, 1080] };
const ex = JSON.parse(fs.readFileSync('tools/examples/templates.json', 'utf8'));
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ deviceScaleFactor: 1 });
for (const o of list) {
  const base = ex.find(e => e.name === o.name) || {}; const f = o.format || [].concat(base.formats || 'feed')[0];
  const spec = { ...base, ...o, format: f }; delete spec.formats; const [w, h] = SIZE[f];
  await p.setViewportSize({ width: w, height: h });
  await p.goto(`http://127.0.0.1:8790/render.html?spec=${encodeURIComponent(Buffer.from(JSON.stringify(spec)).toString('base64'))}`);
  await p.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
  const file = `${OUT}/${o.out || o.name}.png`; await p.locator('.ab').screenshot({ path: file }); console.log(file);
}
await b.close();
