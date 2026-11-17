// After an artboard is in the page: fit the adaptive text, draw the effect canvases, number the blocks for the animations,
// and keep animated effects moving. Used by the builder, the guidelines page and the renderers.
//   await hydrate(root, { scale })   scale < 1 draws the effects at preview resolution (cheaper)
//   window.__fxTime(t)               draws every live effect at loop time t (0..1) — the frame renderer calls it
import { drawFx, loadSource } from './fx.js';

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
      const pe = el.parentElement, cs = getComputedStyle(pe), pw = pe.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), w = el.scrollWidth; if (!w || !pw) return;
      el.style.fontSize = Math.max(min, Math.min(base * (+el.dataset.grow || 1), base * pw / w)) + 'px';
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
  root.querySelectorAll('.ab .lbx, .ab.x5 .pb').forEach(el => {
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

export async function hydrate(root, { scale = 1, animate = true } = {}) {
  if (!root) return;
  // blocks get an index for staggered animations
  root.querySelectorAll('.ab[data-anim]').forEach(ab => [...ab.querySelectorAll('.pb, .lbx, .an')].forEach((b, i) => b.style.setProperty('--i', i)));
  // load the faces the artboards use before measuring (fonts.ready alone can resolve before a new face starts loading)
  if (document.fonts) { await Promise.all(["800 100px 'ABC Normal'", "500 20px 'IBM Plex Mono'", "100px '403 Quzie'", "100px '403 Quzie Condensed'", "100px '403 Quzie Wide'"].map(f => document.fonts.load(f).catch(() => 0))); await document.fonts.ready; }
  balanceTracking(root);
  fit(root);
  const cvs = [...root.querySelectorAll('canvas[data-fx]')];
  await Promise.all(cvs.map(async c => {
    const o = JSON.parse(c.dataset.fx), src = await loadSource(c.dataset.src).catch(() => null); if (!src) return;
    const k = Math.min(1, scale);
    c.width = Math.round(+c.dataset.w * k); c.height = Math.round(+c.dataset.h * k);
    const oo = { ...o, cell: (o.cell || 12) * k, blur: (o.blur || 0) * k };
    c._src = src; c._o = oo;
    drawFx(c, src, oo, 0);
    const moving = animate && (src.tagName === 'VIDEO' || c.dataset.src.includes('#gif') || (o.animate !== false && ['ascii', 'glyph', 'dither', 'halftone', 'dots', 'lines', 'pixel'].includes(o.mode)));
    if (moving) { live.add(c); io?.observe(c); if (!raf && !frozen) raf = requestAnimationFrame(tick); }
  }));
}
