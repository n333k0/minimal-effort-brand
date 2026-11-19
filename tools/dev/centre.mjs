// Centring audit: renders each example's type layer on transparency (overlay mode) and saves it for ink measurement.
//   node tools/dev/centre.mjs <outdir> [all-formats]
import fs from 'fs'; import { chromium } from 'playwright';
const OUT = process.argv[2], ALL = process.argv[3] === 'all';
const SIZE = { feed: [1080, 1350], story: [1080, 1920], square: [1080, 1080], landscape: [1920, 1080], billboard: [2636, 1080] };
const ex = JSON.parse(fs.readFileSync('tools/examples/templates.json', 'utf8'));
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ deviceScaleFactor: 1 });
for (const s of ex) for (const f of (ALL ? [].concat(s.formats || 'feed') : [[].concat(s.formats || 'feed')[0]])) {
  const [w, h] = SIZE[f]; await p.setViewportSize({ width: w, height: h });
  const spec = { ...s, format: f }; delete spec.formats;
  await p.goto(`http://127.0.0.1:8790/render.html?mode=overlay&spec=${encodeURIComponent(Buffer.from(JSON.stringify(spec)).toString('base64'))}`);
  await p.waitForSelector('body[data-ready="1"]', { timeout: 20000 });
  await p.locator('.ab').screenshot({ path: `${OUT}/${s.name}_${f}.png`, omitBackground: true });
}
await b.close();
