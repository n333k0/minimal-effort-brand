// Minimal Effort brand guidelines — page logic. Effects after RASA World v9: goo headlines that melt as they arrive and
// while scrolling fast, a lime smoke trail over the hero, a pill header. Template previews are drawn live by templates.js.
// Without JS the page is the plain layout in site.css (template previews then fall back to their PNG <noscript> images).
import { preview } from './templates.js?v=20261117c';
import { hydrate } from './hydrate.js?v=20261117c';
import './sections.js?v=20261117c';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const printing = new URLSearchParams(location.search).has('print');
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const o3 = t => 1 - (1 - t) ** 3;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ------------------------------------------------ template previews (data-tpl='{"template":...}') */
// drawn lazily: only previews near the viewport, and their videos pause when they leave it (the page has ~250 previews)
const near = el => { const r = el.getBoundingClientRect(); return printing || (r.bottom > -900 && r.top < innerHeight + 900); };
function drawPreviews() {
  $$('[data-tpl]').forEach(el => {
    const w = Math.round(el.clientWidth); if (!w || el._w === w || !near(el)) return; el._w = w;
    let spec = {}; try { spec = JSON.parse(el.dataset.tpl); } catch (e) { }
    el.innerHTML = preview(spec, w, { forExport: printing || el.hasAttribute('data-still') });
    hydrate(el, { scale: Math.min(1, w / 540), animate: !printing });
    el.querySelectorAll('video').forEach(v => vio.observe(v));
  });
}
const vio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.play?.().catch(() => { }); else e.target.pause?.(); }), { rootMargin: '200px' });
let dq = 0; addEventListener('scroll', () => { if (!dq) { dq = 1; requestAnimationFrame(() => { dq = 0; drawPreviews(); }); } }, { passive: true });
drawPreviews();
let rT; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { $$('[data-tpl]').forEach(e => e._w = 0); drawPreviews(); }, 120); });
document.fonts?.ready.then(() => { $$('[data-tpl]').forEach(e => e._w = 0); drawPreviews(); });

/* ------------------------------------------------ logos: swap CSS-mask placeholders for inline SVG (prints and scales cleanly) */
const LG = { 'lg-mark': 'me-mark', 'lg-word': 'wordmark', 'lg-lock': 'lockup', 'lg-mnml': 'mnml-effrt', 'lg-msq': 'mnml-effrt-square', 'lg-maze': 'the-maze', 'lg-originm': 'origin-mark', 'lg-origin': 'origin', 'lg-sbc': 'sbcltr', 'lg-lb': 'lee-burridge' };
const svgCache = {};
async function inlineLogos() {
  await Promise.all($$('i.lg:not(.inl)').filter(el => !el.style.background).map(async el => {
    const k = Object.keys(LG).find(c => el.classList.contains(c)); if (!k) return;
    const f = LG[k]; svgCache[f] ??= fetch(`assets/logo/${f}.svg`).then(r => r.text()).catch(() => '');
    const t = await svgCache[f]; if (!t) return;
    el.innerHTML = t.replace(/<title>[^<]*<\/title>/, ''); el.classList.add('inl');
  }));
  document.documentElement.dataset.logos = '1';
}
inlineLogos();

/* ------------------------------------------------ hero sequence: MNML ■ EFFRT → the square closes → MINIMAL EFFORT → ME */
const seq = $('.seq');
const SQ = { mnmlEnd: 1233.4, sqW: 288, effrt0: 1709.4, effrtW: 1215, full: 2924.4 };
async function buildSeq() {
  if (!seq) return;
  const cond = $('.lg3 .cond', seq); if (!cond) return;
  const t = await fetch('assets/logo/mnml-effrt-square.svg').then(r => r.text()).catch(() => '');
  const body = t.replace(/<title>.*?<\/title>/, '').replace(/<rect[^>]*\/>/, '');
  const part = (x, w) => body.replace(/viewBox="[^"]*"/, `viewBox="${x} 0 ${w} 299"`);
  const get = f => fetch(`assets/logo/${f}.svg`).then(r => r.text()).then(x => x.replace(/<title>.*?<\/title>/, '')).catch(() => '');
  const [w2, w3] = await Promise.all([get('wordmark'), get('me-mark')]);
  const m2 = $('.lg3 .m2', seq), m3 = $('.lg3 .m3', seq); if (m2) m2.innerHTML = w2; if (m3) m3.innerHTML = w3;
  cond.innerHTML = part(0, SQ.mnmlEnd) + `<span class="gap a"></span><span class="sq"><video src="assets/video/bg07-chrome-bubbles.mp4" poster="assets/video/bg07-chrome-bubbles.jpg" autoplay muted loop playsinline></video></span><span class="gap b"></span>` + part(SQ.effrt0, SQ.effrtW);
}
buildSeq();
const segp = (t, a, b) => clamp((t - a) / (b - a));
const ioe = t => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
function seqScene() {
  if (!seq) return;
  const r = seq.getBoundingClientRect(), vh = innerHeight, vw = innerWidth;
  const p = printing ? .5 : clamp(-r.top / Math.max(1, r.height - vh));
  const W = $('.lg3 .cond', seq)?.clientHeight * SQ.full / 299 || 1, u = W / SQ.full;
  // 1 · MNML ■ EFFRT: the square closes
  const close = ioe(segp(p, .05, .16));
  const sqw = SQ.sqW * (1 - close), g = 94 - 47 * close;
  const sq = $('.lg3 .sq', seq); if (sq) sq.style.width = (sqw * u) + 'px';
  $$('.lg3 .gap', seq).forEach(e => { e.style.width = (g * u) + 'px'; e.style.flex = 'none'; });
  // 2 · MINIMAL EFFORT · 3 · ME
  const toWord = ioe(segp(p, .2, .28)), toMark = ioe(segp(p, .34, .42));
  const m1 = $('.lg3 .cond', seq), m2 = $('.lg3 .m2', seq), m3 = $('.lg3 .m3', seq);
  const blur = x => `blur(${(Math.sin(x * Math.PI) * 14).toFixed(1)}px)`;
  if (m1) { m1.style.opacity = 1 - toWord; m1.style.filter = blur(toWord); }
  if (m2) { m2.style.opacity = toWord * (1 - toMark); m2.style.filter = blur(toMark > 0 ? toMark : toWord); }
  // 4 · the ME grows to the width of the MINIMAL EFFORT wordmark below (gutter to gutter), centred on the screen
  const grow = ioe(segp(p, .5, .72));
  const gut = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gut')) || 24;
  const h0 = $('.lg3', seq)?.clientHeight || 1, w0 = h0 * 874.943 / 422.417;
  const target = Math.min((vw - 2 * gut) / w0, (vh * .84) / h0);
  // 5 · the next section rises over the pinned hero; the ME keeps drifting up while it is eaten
  const pEat = (r.height - 2 * vh) / Math.max(1, r.height - vh), eat = clamp((p - pEat) / Math.max(.001, 1 - pEat));
  const lift = printing ? 0 : -eat * vh * .42;
  if (m3) { m3.style.opacity = toMark; m3.style.filter = blur(toMark); m3.style.transform = `translateY(${lift.toFixed(1)}px) scale(${((.9 + .1 * toMark) * lerp(1, target, grow)).toFixed(4)})`; }
  const phase = p < .05 ? 0 : p < .19 ? 1 : p < .33 ? 2 : 3;
  $$('.seq-cap span', seq).forEach((e, i) => e.classList.toggle('on', i === phase));
  const quiet = 1 - ioe(segp(p, .47, .53));
  const cap = $('.seq-cap', seq), lab = $('.seq-lab', seq); if (cap) cap.style.opacity = quiet; if (lab) lab.style.opacity = quiet;
  const mf = $('.seq-mf', seq), dl = $('.seq-dl', seq);
  if (mf) { mf.style.opacity = 1 - ioe(segp(p, .46, .52)); mf.style.pointerEvents = p > .5 ? 'none' : ''; }
  if (dl) { dl.style.opacity = 1 - ioe(segp(p, .52, .56)); dl.style.pointerEvents = p > .55 ? 'none' : ''; }
  document.documentElement.classList.toggle('dl-float', p > .55 || r.bottom < vh * .5);
  const sl = $('.slides', seq); if (sl) sl.style.opacity = 1 - ioe(segp(p, .5, .7));
  $$('.seq-lines i', seq).forEach((l, i) => { l.style.transform = `scaleY(${ioe(segp(p, .6 + i * .03, .76 + i * .03))})`; });
  const bar = $('.seq-bar .track i', seq); if (bar) bar.style.width = (p * 100) + '%';
  const sb = $('.seq-bar', seq); if (sb) sb.style.opacity = 1 - ioe(segp(p, .5, .6));
}
// event slideshow behind the sequence
const slides = $$('.slides img'); let si = 0;
if (slides.length) { slides[0].classList.add('on'); if (!reduced && !printing) setInterval(() => { slides[si].classList.remove('on'); si = (si + 1) % slides.length; slides[si].classList.add('on'); }, 3200); }
// lightbox for posters and mockups
const lbox = document.createElement('div'); lbox.className = 'lightbox'; lbox.innerHTML = '<img alt="">'; document.body.append(lbox);
document.addEventListener('click', e => { const i = e.target.closest('.lb-open'); if (i) { lbox.firstChild.src = i.dataset.full || i.src; lbox.classList.add('on'); } else if (e.target.closest('.lightbox')) lbox.classList.remove('on'); });
addEventListener('keydown', e => e.key === 'Escape' && lbox.classList.remove('on'));

/* ------------------------------------------------ videos play only while on screen */
if ('IntersectionObserver' in window) {
  const vo = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { v.play?.().catch(() => { }); } else v.pause?.(); }), { rootMargin: '200px' });
  const watch = () => $$('video').forEach(v => { if (!v._w) { v._w = 1; v.muted = true; vo.observe(v); } });
  watch(); new MutationObserver(watch).observe(document.body, { childList: true, subtree: true });
}

/* ------------------------------------------------ copy buttons + swatches */
document.addEventListener('click', async e => {
  const c = e.target.closest('[data-copy]'); if (!c) return;
  e.preventDefault();
  const v = c.dataset.copy === '#sig' ? $('#sig').innerHTML : c.dataset.copy;
  try {
    if (c.dataset.copy === '#sig' && window.ClipboardItem) await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([v], { type: 'text/html' }), 'text/plain': new Blob([$('#sig').innerText], { type: 'text/plain' }) })]);
    else await navigator.clipboard.writeText(v);
    const t = c.dataset.label || c.textContent; c.dataset.label = t; c.textContent = 'Copied'; setTimeout(() => c.textContent = t, 1200);
  } catch (err) { }
});

/* ------------------------------------------------ header + menu */
let lenis = null;
if (!reduced && !printing && window.Lenis) {
  lenis = new window.Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'); const t = id.length > 1 && $(id); if (!t) return; e.preventDefault(); setMenu(false); lenis.scrollTo(t, { offset: -70, duration: 1.4 }); }));
}
const header = $('.site-header'), burger = $('.burger-btn'), navLinks = $$('.d-nav a'), navT = navLinks.map(a => $(a.getAttribute('href')));
function setMenu(open) { if (!header) return; header.toggleAttribute('data-menu', open); burger?.setAttribute('aria-expanded', String(open)); if (burger) burger.textContent = open ? 'Close' : 'Menu'; open ? lenis?.stop() : lenis?.start(); }
burger?.addEventListener('click', () => setMenu(!header.hasAttribute('data-menu')));
$$('.m-nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => e.key === 'Escape' && header?.hasAttribute('data-menu') && setMenu(false));
function onHeader() {
  header?.toggleAttribute('data-scrolled', scrollY > 24);
  let cur = -1; navT.forEach((t, i) => { if (t) { const r = t.getBoundingClientRect(); if (r.top <= innerHeight * .4 && r.bottom > innerHeight * .4) cur = i; } });
  navLinks.forEach((a, i) => a.toggleAttribute('aria-current', i === cur));
}

/* ------------------------------------------------ goo: words melt as they arrive and set when they rest */
const defs = $('.defs defs'), SVGNS = 'http://www.w3.org/2000/svg';
const goos = (reduced || printing || !defs) ? [] : $$('.goo').map((el, i) => {
  const f = document.createElementNS(SVGNS, 'filter');
  f.setAttribute('id', 'goo-' + i); f.setAttribute('x', '-20%'); f.setAttribute('y', '-60%'); f.setAttribute('width', '140%'); f.setAttribute('height', '220%');
  const b = document.createElementNS(SVGNS, 'feGaussianBlur'); b.setAttribute('in', 'SourceGraphic'); b.setAttribute('stdDeviation', '0'); b.setAttribute('result', 'b');
  const m = document.createElementNS(SVGNS, 'feColorMatrix'); m.setAttribute('in', 'b'); m.setAttribute('mode', 'matrix'); m.setAttribute('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9');
  f.append(b, m); defs.append(f);
  return { el, blur: b, id: 'goo-' + i, r: 0, seen: el.dataset.goo === 'load', t0: performance.now() + (el.dataset.goo === 'load' ? 250 : 0), cur: -1 };
});
let lastY = scrollY, vel = 0;
function gooScene(now, dt) {
  const dy = scrollY - lastY; lastY = scrollY;
  vel = lerp(vel, Math.abs(dy) / Math.max(dt, .001), 1 - Math.exp(-dt * 8));
  const H = innerHeight;
  goos.forEach(g => {
    const rc = g.el.getBoundingClientRect(); const inView = rc.bottom > 0 && rc.top < H;
    if (!g.seen && rc.top < H * .88 && rc.bottom > 0) { g.seen = true; g.t0 = now; }
    if (g.seen && g.r < 1) g.r = clamp((now - g.t0) / 1700);
    const fs = parseFloat(getComputedStyle(g.el).fontSize) || 40;
    const melt = g.seen ? (1 - o3(g.r)) * fs * .26 : fs * .26;
    const flow = Math.min(fs * .1, vel * .005 * fs / 60);
    const q = Math.round((inView ? Math.max(melt, flow) : 0) * 10) / 10;
    if (q !== g.cur) { g.cur = q; if (q > .15) { g.blur.setAttribute('stdDeviation', String(q)); g.el.style.filter = `url(#${g.id})`; } else g.el.style.filter = ''; }
    g.el.style.opacity = g.seen ? String(clamp(g.r * 3)) : (inView ? '0' : '');
  });
}

/* ------------------------------------------------ smoke over the hero, in lime */
const smoke = $('.smoke'), hero = $('.seq-pin') || $('.hero'), sctx = (!reduced && !printing) ? smoke?.getContext('2d') : null;
const puffs = []; const sp = { x: -1, y: -1, px: -1, py: -1, on: false };
hero?.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); sp.x = e.clientX - r.left; sp.y = e.clientY - r.top; sp.on = true; });
hero?.addEventListener('pointerleave', () => { sp.on = false; sp.px = -1; });
function smokeScene(dt) {
  if (!sctx) return;
  const r = hero.getBoundingClientRect(); if (r.bottom < 0) return;
  const dpr = Math.min(devicePixelRatio || 1, 1.5), W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
  if (smoke.width !== W || smoke.height !== H) { smoke.width = W; smoke.height = H; }
  if (sp.on) {
    if (sp.px < 0) { sp.px = sp.x; sp.py = sp.y; }
    const d = Math.hypot(sp.x - sp.px, sp.y - sp.py), n = Math.min(10, Math.ceil(d / 10));
    for (let i = 0; i < n; i++) { const t = (i + 1) / n; puffs.push({ x: lerp(sp.px, sp.x, t), y: lerp(sp.py, sp.y, t), vx: (sp.x - sp.px) * .8 + (Math.random() - .5) * 30, vy: (sp.y - sp.py) * .8 - 20 - Math.random() * 20, r: 20 + Math.random() * 18, a: .8, life: 0 }); }
    sp.px = sp.x; sp.py = sp.y;
  }
  if (Math.random() < dt * 5) puffs.push({ x: r.width * (.2 + Math.random() * .6), y: r.height * (.94 + Math.random() * .08), vx: (Math.random() - .5) * 16, vy: -28 - Math.random() * 22, r: 40 + Math.random() * 40, a: .16, life: 0 });
  sctx.setTransform(dpr, 0, 0, dpr, 0, 0); sctx.clearRect(0, 0, r.width, r.height); sctx.globalCompositeOperation = 'lighter';
  for (let i = puffs.length - 1; i >= 0; i--) {
    const p = puffs[i]; p.life += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .96; p.vy *= .985; p.r += dt * 44;
    const k = 1 - p.life / 2.3; if (k <= 0) { puffs.splice(i, 1); continue; }
    const g = sctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    g.addColorStop(0, `rgba(196, 245, 120, ${p.a * k * .42})`); g.addColorStop(.5, `rgba(170, 230, 80, ${p.a * k * .16})`); g.addColorStop(1, 'rgba(150, 220, 60, 0)');
    sctx.fillStyle = g; sctx.beginPath(); sctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); sctx.fill();
  }
  if (puffs.length > 500) puffs.splice(0, puffs.length - 500);
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  lenis?.raf(now); onHeader(); gooScene(now, dt); smokeScene(dt); seqScene();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
