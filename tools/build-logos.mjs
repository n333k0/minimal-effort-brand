// Builds the Minimal Effort logo kit from the master vectors exported from Figma
// (Brand Guidelines file, Components page: 3:139 LOGO MARK, 4:282 LOGO HORIZONTAL, 4:286 LOGO VERTICAL).
// Output: downloads/logos/svg/*.svg (every logo x every colour) and downloads/logos/png/*.png (transparent, 2 sizes),
// plus assets/logo/*.svg used by the site (currentColor versions).
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'ref/svg');
const OUT = path.join(ROOT, 'downloads/logos');
const SITE = path.join(ROOT, 'assets/logo');
for (const d of [OUT + '/svg', OUT + '/png', SITE]) fs.mkdirSync(d, { recursive: true });

const COLORS = { white: '#FFFFFF', 'ice-white': '#F5F6FC', midnight: '#14141A', black: '#000000', lime: '#B4F152', lilac: '#A79BEE' };
const paths = f => [...fs.readFileSync(path.join(SRC, f), 'utf8').matchAll(/<path[^>]*?\sd="([^"]+)"/g)].map(m => m[1]);

const mark = paths('mark.svg');            // 1 path, 874.9 x 422.4
const word = paths('wordmark.svg');        // 13 letters, 3314.2 x 299 (letters y 5.1..293.1)
const lock = paths('lockup.svg');          // 13 letters + mark (index 13), 2009 x 1236.5

// letter index: 0 M 1 I 2 N 3 I 4 M 5 A 6 L | 7 E 8 F 9 F 10 O 11 R 12 T  (bboxes measured with tools/bbox.mjs)
const BOX = { 0: [0, 321.9], 2: [474.2, 258.1], 4: [884.5, 321.9], 6: [1525.3, 190.5], 7: [1809.8, 210.9], 8: [2052.9, 209.6], 9: [2294.4, 209.6], 11: [2833.4, 247.5], 12: [3074.8, 239.4] };
// MNML EFFRT: the wordmark's own letters, re-spaced. Gaps: 47 between letters (the I-N rhythm of the wordmark), the
// wordmark's own pairs where they existed (E-F 32.2, F-F 31.9, R-T -6.1), word space 94 (the L-E space of the wordmark).
function condensed(square) {
  const seq = [[0, 0], [2, 47], [4, 47], [6, 47], ['sq', 94], [7, 94], [8, 32.2], [9, 31.9], [11, 40], [12, -6.1]];
  let x = 0, out = [], first = true;
  for (const [i, gap] of seq) {
    if (i === 'sq') { if (square) { x += gap; out.push(`<rect x="${x.toFixed(1)}" y="5.1" width="288" height="288"/>`); x += 288; } continue; }
    if (!first) x += (i === 7 && !square) ? 94 : gap; first = false;
    const [bx, bw] = BOX[i];
    out.push(`<path transform="translate(${(x - bx).toFixed(1)} 0)" d="${word[i]}"/>`); x += bw;
  }
  return [`0 0 ${x.toFixed(1)} 299`, out];
}
const [cvb, cps] = condensed(false), [svb, sps] = condensed(true);
const LOGOS = {
  'me-mark': ['0 0 874.943 422.417', mark.map(d => `<path d="${d}"/>`)],
  'wordmark': ['0 0 3314.23 299', word.map(d => `<path d="${d}"/>`)],
  'lockup': ['0 0 2009 1236.46', lock.map(d => `<path d="${d}"/>`)],
  'mnml-effrt': [cvb, cps],
  'mnml-effrt-square': [svb, sps],
};

function svg(name, fill) {
  const [vb, els] = LOGOS[name];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="${fill}"><title>Minimal Effort — ${name}</title>${els.join('')}</svg>\n`;
}

// site versions (currentColor)
for (const n of Object.keys(LOGOS)) fs.writeFileSync(path.join(SITE, n + '.svg'), svg(n, 'currentColor'));

// download kit
const files = [];
for (const f of fs.readdirSync(path.join(OUT, 'svg'))) fs.rmSync(path.join(OUT, 'svg', f));
for (const f of fs.readdirSync(path.join(OUT, 'png'))) fs.rmSync(path.join(OUT, 'png', f));
const EXTRA = ['the-maze', 'origin', 'origin-mark', 'sbcltr'];   // event / partner logos, kept as delivered
for (const n of [...Object.keys(LOGOS), ...EXTRA]) for (const [c, hex] of Object.entries(COLORS)) {
  const f = `minimal-effort_${n}_${c}.svg`;
  const s = LOGOS[n] ? svg(n, hex) : fs.readFileSync(path.join(SITE, n + '.svg'), 'utf8').replace('fill="currentColor"', `fill="${hex}"`);
  fs.writeFileSync(path.join(OUT, 'svg', f), s); files.push(f);
}

// PNG renders (transparent) at two widths
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const f of files) {
  const s = fs.readFileSync(path.join(OUT, 'svg', f), 'utf8');
  const [, , w, h] = s.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  for (const W of [1000, 3000]) {
    const H = Math.round(W * h / w);
    await page.setViewportSize({ width: W, height: H });
    await page.setContent(`<html><body style="margin:0;background:transparent">${s.replace('<svg ', `<svg width="${W}" height="${H}" style="display:block" `)}</body></html>`);
    await page.screenshot({ path: path.join(OUT, 'png', f.replace('.svg', `_${W}w.png`)), omitBackground: true });
  }
}
await browser.close();
console.log('logos:', files.length, 'svg,', files.length * 2, 'png');
