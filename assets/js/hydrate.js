// After an artboard is in the page: fit the adaptive text, draw the effect canvases, number the blocks for the animations,
// and keep animated effects moving. Used by the builder, the guidelines page and the renderers.
//   await hydrate(root, { scale })   scale < 1 draws the effects at preview resolution (cheaper)
//   window.__fxTime(t)               draws every live effect at loop time t (0..1) — the frame renderer calls it
import { drawFx, loadSource } from './fx.js?v=20261117e';

const live = new Set();
let raf = 0, frozen = false, last = 0;
const LOOP = 10000;
function tick(now) {
  raf = requestAnimationFrame(tick);
  if (frozen || now - last < 90) return; last = now;
  const t = (now % LOOP) / LOOP;
  for (const c of live) { if (!c.isConnected) { live.delete(c); continue; } if (c._vis === false) continue; try { drawFx(c, c._src, c._o, t); } catch (e) { } }
  if (!live.size) { cancelAnimationFrame(raf); raf = 0; }
}
if (typeof window !== 'undefined') window.__fxTime = t => { frozen = true; for (const c of live) if (c.isConnected) drawFx(c, c._src, c._o, t); };
// Frame stepping for exports: seek a video to a time (wrapping on its length) and wait until that frame is ready.
export function seekTo(v, sec) {
  v.pause(); const d = v.duration || 10, s = ((sec % d) + d) % d;
  if (Math.abs(v.currentTime - s) < 1e-3 && v.readyState >= 2) return Promise.resolve();
  return new Promise(r => { const t = setTimeout(r, 2000); v.addEventListener('seeked', () => { clearTimeout(t); r(); }, { once: true }); v.currentTime = s; });
}
// Draw every effect canvas inside root at loop time t (0..1), seeking video sources first. Leaves the page's live loop alone.
export async function fxFrame(root, t) {
  for (const c of root.querySelectorAll('canvas[data-fx]')) {
    if (!c._src) continue;
    if (c._src.tagName === 'VIDEO') await seekTo(c._src, t * LOOP / 1000);
    try { drawFx(c, c._src, c._o, t); } catch (e) { }
  }
}
const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(es => es.forEach(e => { e.target._vis = e.isIntersecting; })) : null;

// shrink (or grow) text until it fits its box. data-fit="box": the element's own box; data-fit="w": one line as wide as the parent.
export function fit(root) {
  // measure with animations off (a block mid-slide would read as overflow)
  const abs = [...root.querySelectorAll('.ab'), ...(root.matches?.('.ab') ? [root] : [])]; abs.forEach(a => a.setAttribute('data-fitting', ''));
  root.querySelectorAll('[data-fit]').forEach(el => {
    const mode = el.dataset.fit, max = +el.dataset.max || parseFloat(getComputedStyle(el).fontSize), min = +el.dataset.min || 8;
    if (!el.dataset.fs0) el.dataset.fs0 = max;
    const base = +el.dataset.fs0;
    if (mode === 'w') {
      el.style.fontSize = base + 'px';
      // a hung label block may be 2 × its hang wider than the column (letters margin to margin); not inside a .zr group,
      // whose width is the block's own
      const pe = el.parentElement, cs = getComputedStyle(pe), hang = pe.classList.contains('zr') ? 0 : 2 * (+el.dataset.hang || 0);
      const pw = pe.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) + hang; let w = el.scrollWidth; if (!w || !pw) return;
      const k = +el.dataset.ofk || 1, lim = f => Math.max(min, Math.min(base * (+el.dataset.grow || 1), f));
      // fixed-px padding means the width is not proportional to the size: refine with a couple of secant steps
      let f0 = base, w0 = w, f1 = lim(base * pw / w); el.style.fontSize = f1 * k + 'px'; let w1 = el.scrollWidth;
      for (let i = 0; i < 3 && Math.abs(w1 - pw) > .5 && w1 !== w0; i++) { const f2 = lim(f1 + (pw - w1) * (f1 - f0) / (w1 - w0)); f0 = f1; w0 = w1; f1 = f2; el.style.fontSize = f1 * k + 'px'; w1 = el.scrollWidth; }
      return;
    }
    // fits when nothing spills out of the box on any side (flex-end boxes overflow upwards, which scrollHeight misses)
    const ok = () => {
      if (el.scrollWidth > el.clientWidth + 2) return false; // (scrollHeight is not used: trimmed label blocks report glyph overflow)
      const r = el.getBoundingClientRect(), k = r.width / (el.offsetWidth || 1), tol = 2 * k;
      for (const c of el.children) { const q = c.getBoundingClientRect(); if (!q.width && !q.height) continue; if (q.top < r.top - tol || q.bottom > r.bottom + tol || q.left < r.left - tol || q.right > r.right + tol) return false; }
      return true;
    };
    el.style.fontSize = base + 'px';
    let lo = min, hi = base;
    if (ok()) { const g = +el.dataset.grow; if (!g) return; lo = base; hi = base * g; el.style.fontSize = hi + 'px'; if (ok()) return; }
    for (let i = 0; i < 14; i++) { const m = (lo + hi) / 2; el.style.fontSize = m + 'px'; if (ok()) lo = m; else hi = m; }
    el.style.fontSize = lo + 'px';
  });
  abs.forEach(a => a.removeAttribute('data-fitting'));
}

// Optical padding for label blocks. Tight (negative) letter-spacing is also taken off after the last letter, and letters
// start and end with different side space (an R starts further in than an X ends), so a block centred by its box shows
// its words 2–6 px right of centre. Measure the real letter ink and set the right padding so the ink has the same space on
// both sides (in em, so it scales with the fit). Blocks with icons inside only get the tracking back.
let mctx = null;
export function balanceTracking(root) {
  mctx ||= document.createElement('canvas').getContext('2d');
  root.querySelectorAll('.ab.x5 .pb').forEach(el => { // label blocks (.lbx) are set by labelBoxes
    if (el.dataset.lsc) return;
    const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize); if (!fs || el.offsetWidth === 0) return;
    const ls = parseFloat(cs.letterSpacing) || 0, pl = parseFloat(cs.paddingLeft), pr = parseFloat(cs.paddingRight);
    let txt = el.textContent.replace(/\s+/g, ' ').trim();
    let next = ls < 0 ? pr - ls : pr;
    const rg = document.createRange(); rg.selectNodeContents(el);
    const oneLine = new Set([...rg.getClientRects()].map(r => Math.round(r.top))).size === 1;
    if (!el.children.length && txt && oneLine) {
      if (cs.textTransform === 'uppercase') txt = txt.toUpperCase();
      // only the first and last letters decide the side space; the trailing letter-spacing is added after the last one
      mctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const a = mctx.measureText(txt[0]), z = mctx.measureText(txt[txt.length - 1]);
      const lsb = -a.actualBoundingBoxLeft, rsb = z.width - z.actualBoundingBoxRight + ls;
      next = Math.max(0, pl + lsb - rsb);
    }
    if (Math.abs(next - pr) < .5) return;
    el.style.paddingRight = (next / fs).toFixed(4) + 'em'; el.dataset.lsc = '1';
  });
}

// Optical margins. Letters (not block edges) sit on the margin, but every letter carries its own side space, and it grows
// with the size: a 150 px N starts 8 px in while 34 px text starts at 0.5 px, so a left stack looks ragged. Shift each
// line by its first (or last) letter's side space, in em so it follows the fit. Covers the hung label blocks of left and
// right stacks and unboxed text that sits against its container's edge; boxed poster blocks keep their box edge.
const SIDE = el => { const c = getComputedStyle(el); return { c, fs: parseFloat(c.fontSize) }; };
function oneLine(el) { const rg = document.createRange(); rg.selectNodeContents(el); return new Set([...rg.getClientRects()].map(r => Math.round(r.top))).size === 1; }
function bearings(el, c) {
  let txt = el.textContent.replace(/\s+/g, ' ').trim(); if (!txt) return null;
  if (c.textTransform === 'uppercase') txt = txt.toUpperCase();
  mctx ||= document.createElement('canvas').getContext('2d');
  mctx.font = `${c.fontStyle} ${c.fontWeight} ${c.fontSize} ${c.fontFamily}`;
  const a = mctx.measureText(txt[0]), z = mctx.measureText(txt[txt.length - 1]);
  return { lsb: -a.actualBoundingBoxLeft, rsb: z.width - z.actualBoundingBoxRight };
}
// how far the last line's letters drop below the baseline (p, g, y, j, q…). Blocks are trimmed to the baseline, so a
// descender would hang out of its block; the block gets that much more room at the bottom, only when it has one.
function descent(el, c) {
  let txt = el.textContent.replace(/[ \t]+/g, ' ').trim().split('\n').pop().trim(); if (!txt) return 0;
  if (c.textTransform === 'uppercase') txt = txt.toUpperCase();
  mctx ||= document.createElement('canvas').getContext('2d');
  mctx.font = `${c.fontStyle} ${c.fontWeight} ${c.fontSize} ${c.fontFamily}`;
  const d = mctx.measureText(txt).actualBoundingBoxDescent, fs = parseFloat(c.fontSize);
  return d > fs * .06 ? d : 0;
}
export function deepenForDescenders(root) {
  root.querySelectorAll('.ab.x5 .pb').forEach(el => {
    if (!el.offsetWidth) return; el.style.paddingBottom = '';
    const c = getComputedStyle(el), d = descent(el, c); if (d) el.style.paddingBottom = (parseFloat(c.paddingBottom) + d).toFixed(2) + 'px';
  });
}
const textEdges = el => { const n = [...el.childNodes].filter(n => n.nodeType !== 3 || n.data.trim()); return { first: n[0]?.nodeType === 3, last: n[n.length - 1]?.nodeType === 3 }; };
export function opticalMargins(root) {
  const set = (el, px, fs) => { if (Math.abs(px) < .5) return; el.style.translate = `${(px / fs).toFixed(4)}em 0`; el.dataset.om = '1'; };
  // (1. label blocks: labelBoxes sets their padding and hang)
  const ab0 = [...root.querySelectorAll('.ab'), ...(root.matches?.('.ab') ? [root] : [])];
  const filled = e => { const c = getComputedStyle(e); return !/rgba\(.*,\s*0\)|transparent/.test(c.backgroundColor) || c.backgroundImage !== 'none' || parseFloat(c.borderLeftWidth) > 0 || parseFloat(c.outlineWidth) > 0 && c.outlineStyle !== 'none'; };
  const flat = (el, ab) => { for (let e = el; e && e !== ab; e = e.parentElement) { const t = getComputedStyle(e); if (t.rotate !== 'none' || (t.transform !== 'none' && !/^matrix\([^,]+, 0, 0,/.test(t.transform))) return false; } return true; };
  const edgeOf = (el) => {
    const p = el.parentElement, pc = getComputedStyle(p), r = el.getBoundingClientRect(), q = p.getBoundingClientRect(), k = q.width / (p.offsetWidth || 1);
    const pL = q.left + (parseFloat(pc.borderLeftWidth) + parseFloat(pc.paddingLeft)) * k, pR = q.right - (parseFloat(pc.borderRightWidth) + parseFloat(pc.paddingRight)) * k;
    // a block pushed in by its own margin (bands put the DJ labels on the margin that way) counts as on that edge,
    // unless equal margins on both sides centre it
    const ec = getComputedStyle(el), ml = parseFloat(ec.marginLeft), mr = parseFloat(ec.marginRight), sym = Math.abs(ml - mr) < 1;
    return { r, atL: Math.abs(r.left - pL) < 1 || (!sym && ml > 0 && Math.abs(r.left - pL - ml * k) < 1), atR: Math.abs(r.right - pR) < 1 || (!sym && mr > 0 && Math.abs(r.right - pR + mr * k) < 1) };
  };
  // 2. poster blocks: an invisible block (no fill) puts its letters on the line; a filled block that bleeds off the
  //    artboard edge (bands) puts its letters on the margin. Filled blocks inside the page keep their box edge.
  for (const ab of ab0) {
    const A = ab.getBoundingClientRect();
    ab.querySelectorAll('.pb').forEach(el => {
      if (el.dataset.om || !el.offsetWidth || !oneLine(el) || !flat(el, ab)) return;
      const te = textEdges(el), { c, fs } = SIDE(el), b = bearings(el, c); if (!b) return;
      const { r, atL, atR } = edgeOf(el), pl = parseFloat(c.paddingLeft), pr = parseFloat(c.paddingRight), ls = parseFloat(c.letterSpacing) || 0;
      const bleedL = r.left - A.left < 1, bleedR = A.right - r.right < 1, shown = filled(el);
      if (!shown) { // the box is invisible: move the whole block so the letters sit where the box edge was
        if (atL && !atR && te.first) set(el, -(pl + b.lsb), fs);
        else if (atR && !atL && te.last) set(el, pr + b.rsb + ls, fs);
      } else if (bleedL && !bleedR && te.first && Math.abs(b.lsb) >= .5) { el.style.textIndent = `${(-b.lsb / fs).toFixed(4)}em`; el.dataset.om = '1'; }
      else if (bleedR && !bleedL && te.last && Math.abs(b.rsb + ls) >= .5) { el.style.paddingRight = `${(Math.max(0, pr - b.rsb - ls) / fs).toFixed(4)}em`; el.dataset.om = '1'; }
    });
  }
  // 3. unboxed text against its container's left or right edge
  for (const ab of ab0) {
    const A = ab.getBoundingClientRect();
    ab.querySelectorAll('*').forEach(el => {
      if (el.dataset.om || el.closest('svg') || !el.offsetWidth) return;
      const te = textEdges(el); if (!te.first && !te.last) return;
      if (!flat(el, ab)) return;
      for (let e = el; e && e !== ab; e = e.parentElement) if (filled(e) && e.getBoundingClientRect().width < A.width * .9) return;
      const { c, fs } = SIDE(el); if (c.translate !== 'none' || parseFloat(c.paddingLeft) > .5 || parseFloat(c.paddingRight) > .5) return;
      const { atL, atR } = edgeOf(el), ta = c.textAlign;
      const side = atL && atR ? (ta === 'left' || ta === 'start' ? 'l' : ta === 'right' || ta === 'end' ? 'r' : '') : atL ? 'l' : atR ? 'r' : '';
      if (!side || (side === 'l' && !te.first) || (side === 'r' && !te.last)) return;
      const b = bearings(el, c); if (!b) return;
      const single = oneLine(el), ls = parseFloat(c.letterSpacing) || 0;
      // a line sized to fill the width: grow it a touch so the letters (not the line box) touch both margins
      if (el.dataset.fit === 'w' && single && atL && atR) {
        const w = el.offsetWidth, gap = b.lsb + b.rsb + ls, k = w / (w - gap); if (!(k > 1 && k < 1.08)) return;
        el.dataset.ofk = k.toFixed(4); el.style.fontSize = fs * k + 'px'; set(el, -b.lsb * k, fs * k); return;
      }
      if (side === 'l') { if (single) set(el, -b.lsb, fs); else if (c.display !== 'inline' && Math.abs(b.lsb) >= .5) { el.style.textIndent = `${(-b.lsb / fs).toFixed(4)}em`; el.dataset.om = '1'; } }
      else if (single) set(el, b.rsb + ls, fs);
    });
  }
}

// Label blocks: one padding for every block on the artboard (7 px on a 1080 post, whatever the text size), less each
// block's own first / last letter side space, so the letters AND the block edges line up, and big names get a tight box.
// In left / right stacks every block hangs out by that same padding: letters on the margin, block edges 7 px outside it.
// Run before and after the fit (the side space follows the final size).
const LPAD = 7;
export function labelBoxes(root) {
  root.querySelectorAll('.ab .lbx').forEach(el => {
    if (!el.offsetWidth) return;
    const ab = el.closest('.ab'), z = (el.currentCSSZoom || 1) / (ab.currentCSSZoom || 1);
    const c = getComputedStyle(el), fs = parseFloat(c.fontSize), ls = parseFloat(c.letterSpacing) || 0;
    const te = textEdges(el), b = bearings(el, c) || { lsb: 0, rsb: 0 }, lsb = te.first ? b.lsb : 0, rsb = te.last ? b.rsb + ls : 0;
    const side = (L, R) => { el.style.paddingLeft = Math.max(0, L).toFixed(2) + 'px'; el.style.paddingRight = Math.max(0, R).toFixed(2) + 'px'; el.style.textIndent = L < 0 ? L.toFixed(2) + 'px' : ''; };
    // words on a band: the band is the box; only centre the letters (equal space both sides), keep the band's height
    if (el.closest('.band')) { const B = .17 * fs; side(B - lsb, B - rsb); return; }
    const P = LPAD * Math.min(ab.offsetWidth, ab.offsetHeight) / 1080 / z; // in the block's own (zoomed) px
    const py = Math.min(.2 * fs, 1.3 * P);
    el.style.paddingTop = py.toFixed(2) + 'px'; el.style.paddingBottom = (py + descent(el, c)).toFixed(2) + 'px';
    side(P - lsb, P - rsb); // a huge first letter has more side space than the padding: text-indent takes the rest
    const p = el.parentElement, st = p?.classList.contains('stack') ? p : p?.classList.contains('zr') && p.parentElement?.classList.contains('stack') ? p.parentElement : null;
    el.dataset.hang = st ? P.toFixed(2) : '0'; // fit (data-fit="w") makes such a block 2P wider than its column: letters margin to margin
    if (st && el.dataset.fit === 'w' && !p.classList.contains('zr')) el.style.maxWidth = 'none'; // (.lbx caps itself at 100%)
    if (st?.classList.contains('l')) el.style.left = -P.toFixed(2) + 'px';
    else if (st?.classList.contains('r')) el.style.left = P.toFixed(2) + 'px';
    else if (st?.classList.contains('c') && el.dataset.fit === 'w') el.style.margin = `0 ${-P.toFixed(2)}px`; // centred overflow, both sides
  });
}

// Extra label (spec.extra, e.g. "A TO Z"; a new line is a new block) on any template, in the post's own label style.
// data-extra-pos: top / bottom of the main text, or a corner (tl tr bl br).
export const XL_SIZE = { s: 27, m: 34, l: 44, xl: 80 };
// the blocks an extra label can sit before / after, in reading order (extras themselves excluded)
// the "main" block a new label goes above: the headliner's block (first artist) if there is one, else the biggest block
export function xlMain(blocks, name) {
  const n = String(name || '').trim().toLowerCase(), j = n ? blocks.findIndex(b => b.textContent.toLowerCase().includes(n)) : -1;
  return j >= 0 ? j : blocks.reduce((m, b, i) => b.offsetHeight > blocks[m].offsetHeight + .5 ? i : m, 0);
}
export const xlBlocks = ab => [...ab.querySelectorAll(ab.classList.contains('x5') ? '.pb' : '.lbx')].filter(b => !b.closest('[data-xli], [data-xl]') && !b.closest('svg'));
function extraLabels(root) {
  // free labels (spec.extras): each one absolutely placed, dragged in the builder
  root.querySelectorAll('.ab[data-xls]').forEach(ab => {
    if (ab.querySelector('[data-xli]')) return;
    let list = []; try { list = JSON.parse(ab.dataset.xls); } catch (e) { return; }
    const x5 = ab.classList.contains('x5'), W = ab.offsetWidth, H = ab.offsetHeight, M = parseFloat(getComputedStyle(ab).getPropertyValue('--m')) || 64;
    const P = LPAD * Math.min(W, H) / 1080, layer = ab.querySelector('.layer') || ab;
    const blocks = xlBlocks(ab); // the post's own blocks, before any label goes in (the order labels refer to)
    list.forEach((e, i) => {
      const t = String(e?.t ?? '').trim(); if (!t) return;
      const d = document.createElement('div');
      d.className = x5 ? 'pb' : 'lbx'; d.dataset.xli = i; d.textContent = t;
      const fs = `font-size:${+e.px > 0 ? +e.px : XL_SIZE[e.size] || XL_SIZE.s}px;white-space:nowrap;${x5 ? '' : 'letter-spacing:-0.035em;line-height:1.2;'}`;
      if ((Number.isInteger(e.at) || e.at === 'main') && blocks.length) {
        // space above / below (post px) pushes it away from its neighbours; side margins stay as the stack sets them
        const gap = `${+e.gapT ? `margin-top:${+e.gapT}px;` : ''}${+e.gapB ? `margin-bottom:${+e.gapB}px;` : ''}`;
        // in the flow: before or after one of the post's blocks, so it takes that stack's alignment, padding and hang
        // ('main' = the biggest block, e.g. the headliner)
        const at = e.at === 'main' ? xlMain(blocks, ab.dataset.xmain) : e.at;
        const b = blocks[Math.min(Math.max(0, at), blocks.length - 1)];
        d.style.cssText = fs + gap; if (e.side === 'after' || e.at >= blocks.length) b.after(d); else b.before(d);
        return;
      }
      const x = Number.isFinite(+e.x) && e.x !== null ? +e.x : M - P, y = Number.isFinite(+e.y) && e.y !== null ? +e.y : H * .3 + i * 60;
      d.style.cssText = `position:absolute;left:${x}px;top:${y}px;margin:0;z-index:6;${fs}`;
      layer.append(d);
    });
  });
  root.querySelectorAll('.ab[data-extra]').forEach(ab => {
    if (ab.querySelector('[data-xl]')) return;
    const lines = ab.dataset.extra.split('\n').map(t => t.trim()).filter(Boolean); if (!lines.length) return;
    const x5 = ab.classList.contains('x5'), pos = ab.dataset.extraPos || 'top';
    const mk = t => { const d = document.createElement('div'); d.className = x5 ? 'pb' : 'lbx t-s'; if (x5) d.style.fontSize = '.3em'; d.dataset.xl = '1'; d.textContent = t; return d; };
    const blocks = lines.map(mk);
    if (pos === 'top' || pos === 'bottom') {
      const hosts = [...ab.querySelectorAll(x5 ? '.bx' : '.stack.main')].filter(h => h.offsetWidth && h.textContent.trim());
      const host = pos === 'top' ? hosts[0] : hosts[hosts.length - 1];
      if (host) { if (pos === 'top') host.prepend(...blocks); else host.append(...blocks); return; }
    }
    const [v, h] = pos.length === 2 ? pos : 'tr', m = 'var(--m, 64px)';
    const w = document.createElement('div');
    w.className = x5 ? 'col' + (h === 'r' ? ' r' : '') : 'stack ' + h; w.dataset.xl = '1';
    w.style.cssText = `position:absolute;${v === 't' ? 'top' : 'bottom'}:${m};${h === 'l' ? 'left' : 'right'}:${m};${x5 ? 'font-size:100px;' : 'left:auto;right:auto;' + (h === 'l' ? `left:${m};` : `right:${m};`)}`;
    w.append(...blocks); (ab.querySelector('.layer') || ab).append(w);
  });
}

export async function hydrate(root, { scale = 1, animate = true } = {}) {
  if (!root) return;
  // blocks get an index for staggered animations
  root.querySelectorAll('.ab[data-anim]').forEach(ab => [...ab.querySelectorAll('.pb, .lbx, .an')].forEach((b, i) => b.style.setProperty('--i', i)));
  // load the faces the artboards use before measuring (fonts.ready alone can resolve before a new face starts loading)
  if (document.fonts) { await Promise.all(["800 100px 'ABC Normal'", "500 20px 'IBM Plex Mono'", "100px '403 Quzie'", "100px '403 Quzie Condensed'", "100px '403 Quzie Wide'"].map(f => document.fonts.load(f).catch(() => 0))); await document.fonts.ready; }
  extraLabels(root);
  labelBoxes(root);
  balanceTracking(root);
  fit(root);
  labelBoxes(root); fit(root); labelBoxes(root); // the side space follows the fitted size; a second pass settles it
  deepenForDescenders(root);
  opticalMargins(root); // after the fit: it measures where each line ends up (the shifts are in em, so later fits keep them)
  const cvs = [...root.querySelectorAll('canvas[data-fx]')];
  await Promise.all(cvs.map(async c => {
    const o = JSON.parse(c.dataset.fx), src = await loadSource(c.dataset.src).catch(() => null); if (!src) return;
    const k = Math.min(1, scale);
    c.width = Math.round(+c.dataset.w * k); c.height = Math.round(+c.dataset.h * k);
    const oo = { ...o, cell: (o.cell || 12) * k, blur: (o.blur || 0) * k };
    c._src = src; c._o = oo;
    drawFx(c, src, oo, 0);
    const moving = animate && (src.tagName === 'VIDEO' || c.dataset.src.includes('#gif') || (o.animate !== false && ['ascii', 'glyph', 'dither', 'halftone', 'dots', 'lines', 'pixel', 'field', 'bloom'].includes(o.mode)));
    if (moving) { live.add(c); io?.observe(c); if (!raf && !frozen) raf = requestAnimationFrame(tick); }
  }));
}
