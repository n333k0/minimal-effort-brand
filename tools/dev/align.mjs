// Alignment audit: renders every example and lists near-misses, edges that are 1–8 px off another edge or the centre line.
// Text without its own block is measured by its letters (ink, from the glyph bounds), blocks/images/logos by their box.
//   node tools/dev/align.mjs <out.json> [all-formats]     (needs the local server on :8790)
import fs from 'fs'; import { chromium } from 'playwright';
const OUT = process.argv[2], ALL = process.argv[3] === 'all';
const SIZE = { feed: [1080, 1350], story: [1080, 1920], square: [1080, 1080], landscape: [1920, 1080], billboard: [2636, 1080] };
const ex = JSON.parse(fs.readFileSync('tools/examples/templates.json', 'utf8'));
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ deviceScaleFactor: 1 });
const res = [];
for (const s of ex) for (const f of (ALL ? [].concat(s.formats || 'feed') : [[].concat(s.formats || 'feed')[0]])) {
  const [w, h] = SIZE[f]; await p.setViewportSize({ width: w, height: h });
  const spec = { ...s, format: f }; delete spec.formats;
  await p.goto(`http://127.0.0.1:8790/render.html?mode=overlay&spec=${encodeURIComponent(Buffer.from(JSON.stringify(spec)).toString('base64'))}`);
  await p.waitForSelector('body[data-ready="1"]', { timeout: 20000 });
  const items = await p.evaluate(async () => {
    const ab = document.querySelector('.ab'), A = ab.getBoundingClientRect(), W = A.width, H = A.height;
    const ctx = document.createElement('canvas').getContext('2d'), out = [];
    const visible = el => { for (let e = el; e && e !== ab.parentElement; e = e.parentElement) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity < .05) return false; } return true; };
    const rotated = el => { for (let e = el; e && e !== ab; e = e.parentElement) { const t = getComputedStyle(e).transform; if (t && t !== 'none') { const m = new DOMMatrix(t); if (Math.abs(m.b) > 1e-3 || Math.abs(m.c) > 1e-3) return true; } } return false; };
    const filled = e => { const c = getComputedStyle(e); return (c.backgroundColor && !/rgba\(.*,\s*0\)|transparent/.test(c.backgroundColor)) || (c.backgroundImage && c.backgroundImage !== 'none'); };
    const boxed = el => { for (let e = el; e && e !== ab; e = e.parentElement) { const r = e.getBoundingClientRect(); if (filled(e) && r.width < W * .9) return e; } return null; };
    const name = el => (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : el.tagName.toLowerCase());
    const seenBox = new Set();
    // boxes: filled blocks, images, logos
    ab.querySelectorAll('*').forEach(el => {
      if (!visible(el) || rotated(el)) return;
      const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || (r.width > W * .9 && r.height > H * .5)) return;
      if (el.closest('svg') && el.closest('svg') !== el) return; // parts of a drawing
      const media = /^(img|svg|canvas|video)$/i.test(el.tagName);
      if (!(filled(el) || media)) return;
      seenBox.add(el);
      out.push({ k: 'box', n: name(el), t: (el.textContent || '').trim().slice(0, 24), l: r.left - A.left, r: r.right - A.left, y: r.top - A.top, h: r.height });
    });
    // text lines without their own block: measure the letters
    // canvas only measures with faces that are loaded; a missing weight silently falls back to another font
    const fonts = new Set(); for (const e of ab.querySelectorAll('*')) { const c = getComputedStyle(e); fonts.add(`${c.fontStyle} ${c.fontWeight} ${c.fontSize} ${c.fontFamily}`); }
    await Promise.all([...fonts].map(f => document.fonts.load(f).catch(() => 0)));
    const walker = document.createTreeWalker(ab, NodeFilter.SHOW_TEXT);
    const lines = new Map();
    for (let tn; (tn = walker.nextNode());) {
      const el = tn.parentElement; if (!tn.data.trim() || !visible(el) || rotated(el)) continue; const bx = !!boxed(el);
      const cs = getComputedStyle(el); ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const up = cs.textTransform === 'uppercase';
      for (let i = 0; i < tn.data.length; i++) {
        let ch = tn.data[i]; if (!ch.trim()) continue; if (up) ch = ch.toUpperCase();
        const rg = document.createRange(); rg.setStart(tn, i); rg.setEnd(tn, i + 1); const q = rg.getClientRects()[0]; if (!q || !q.width) continue;
        const m = ctx.measureText(ch), z = el.currentCSSZoom || 1, il = q.left - A.left - m.actualBoundingBoxLeft * z, ir = q.left - A.left + m.actualBoundingBoxRight * z; // rects are zoomed, the font size is not
        // one line = same block element + same baseline row
        const blk = el.closest('div,p,h1,h2,h3,li,span.line') || el, key = blk;
        let L = lines.get(key); if (!L) lines.set(key, L = new Map());
        const row = Math.round(q.top - A.top), k2 = [...L.keys()].find(y => Math.abs(y - row) < q.height * .5) ?? row;
        const o = L.get(k2) || { bx, l: 1e9, r: -1e9, y: row, h: q.height, t: '', n: name(blk), fs: parseFloat(cs.fontSize), ta: getComputedStyle(blk).textAlign };
        o.l = Math.min(o.l, il); o.r = Math.max(o.r, ir); o.t += ch; L.set(k2, o);
      }
    }
    for (const L of lines.values()) for (const o of L.values()) out.push({ k: 'ink', ...o, t: o.t.slice(0, 24) });
    return { W, H, items: out };
  });
  res.push({ name: s.name, format: f, layout: s.layout, template: s.template, ...items });
}
await b.close();
fs.writeFileSync(OUT, JSON.stringify(res));
console.log('wrote', res.length, 'artboards');
