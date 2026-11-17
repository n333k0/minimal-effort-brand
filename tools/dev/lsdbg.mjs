import fs from 'fs'; import { chromium } from 'playwright';
const ex = JSON.parse(fs.readFileSync('tools/examples/templates.json', 'utf8')).find(s => s.name === 'second-wind_waves');
const spec = { ...ex, format: 'feed' }; delete spec.formats;
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await p.goto(`http://127.0.0.1:8790/render.html?mode=overlay&spec=${encodeURIComponent(Buffer.from(JSON.stringify(spec)).toString('base64'))}`);
await p.waitForSelector('body[data-ready="1"]');
console.log(await p.evaluate(() => [...document.querySelectorAll('.lbx')].map(el => { const cs = getComputedStyle(el); const c = document.createElement('canvas').getContext('2d'); c.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; c.letterSpacing = cs.letterSpacing; const t = el.textContent.trim(); const m = c.measureText(t); const r = document.createRange(); r.selectNodeContents(el); const rr = r.getBoundingClientRect(); return [JSON.stringify(el.textContent), el.children.length, cs.fontSize, cs.letterSpacing, cs.paddingLeft, cs.paddingRight, el.clientWidth, Math.round(rr.width), Math.round(m.width), Math.round(m.actualBoundingBoxLeft), Math.round(m.actualBoundingBoxRight), c.font].join(' | '); }).join('\n')));
await b.close();
