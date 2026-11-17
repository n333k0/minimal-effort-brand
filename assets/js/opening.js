// Minimal Effort guidelines: the opening after the hero. Panels reveal when they enter (IntersectionObserver adds .in), the
// outline band drifts with scroll, and the construction panel is scrubbed by scroll: lines and circles draw, A DIFFERENT KIND
// OF FRONƎ ROW arrives, then the Ǝ (the M turned) and the W (the E turned) leave the words, rotate back, and meet inside the
// square as the ME. MINIMAL / EFFORT label the halves; 90° holds at the bottom.
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = t => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const lerp = (a, b, t) => a + (b - a) * t;
const printing = new URLSearchParams(location.search).has('print');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18 });
$$('.op[data-in], .op [data-in]').forEach(el => (printing || reduced) ? el.classList.add('in') : io.observe(el));

// the two halves of the ME mark, split between the M and the E
// tight ink boxes of the two letters (the gap between them belongs to neither), from me-mark.svg
const MW = 874.943, MH = 422.417, M_INK = [0, 419.482], E_INK = [453.184, 874.943];
fetch('assets/logo/me-mark.svg').then(r => r.text()).then(t => {
  const body = t.replace(/<title>.*?<\/title>/, '');
  const part = ([a, b]) => body.replace(/viewBox="[^"]*"/, `viewBox="${a} 0 ${b - a} ${MH}"`).replace('<svg ', '<svg preserveAspectRatio="none" ');
  const m = $('.op4 .glyph.m'), e = $('.op4 .glyph.e');
  if (m) m.innerHTML = part(M_INK); if (e) e.innerHTML = part(E_INK);
});

const op4 = $('.op4'), bands = $$('.op [data-drift]');
function frame() {
  const st = $('.op4 .stage'), sr = st ? st.getBoundingClientRect() : { width: innerWidth, height: innerHeight, left: 0 }, vh = innerHeight, vw = sr.width;
  bands.forEach(b => { const r = b.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return; const k = (r.top + r.height / 2 - vh / 2) / vh; b.style.transform = `translate(${(k * (+b.dataset.drift || 30)).toFixed(2)}vw, -50%)`; });
  if (op4) {
    const r = op4.getBoundingClientRect();
    if (printing || (r.bottom > -50 && r.top < vh + 50)) {
      const p = printing ? .9 : clamp(-r.top / Math.max(1, r.height - vh));
      // lines draw in their own windows, then quieten
      $$('.op4 [data-a]').forEach(l => { l.style.strokeDashoffset = 1 - ease(seg(p, +l.dataset.a, +l.dataset.b)); l.style.opacity = 1 - .55 * seg(p, .62, .8); });
      // words rise in, then everything but the two glyphs leaves
      const out = ease(seg(p, .4, .52));
      $$('.op4 .w').forEach((w, i) => { const a = ease(seg(p, .05 + i * .03, .2 + i * .03)); w.style.opacity = a * (1 - out); w.style.transform = `translateY(${(1 - a) * 40}px)`; w.style.filter = `blur(${((1 - a) * 8 + out * 6).toFixed(1)}px)`; });
      // target: the ME inside the construction square (viewBox 1600×900, slice; square 560..1040 × 250..730)
      const k = Math.max(vw / 1600, vh / 900), ox = (vw - 1600 * k) / 2, oy = (vh - 900 * k) / 2;
      const sqW = 480 * k, cx = ox + 800 * k, cy = oy + 490 * k;
      const MEw = Math.min(sqW * .78, vw * .8), MEh = MEw * MH / MW, kk = MEw / MW, x0 = cx - MEw / 2;
      const mX = x0 + M_INK[0] * kk, mW = (M_INK[1] - M_INK[0]) * kk, eX = x0 + E_INK[0] * kk, eW = (E_INK[1] - E_INK[0]) * kk;
      const fly = ease(seg(p, .44, .7));
      // the E of FRONE is the M turned a quarter anticlockwise (it faces right); ROW's W is the E turned a quarter anticlockwise.
      // Both only rotate back a quarter clockwise, into the square.
      const pairs = [['.glyph.m', '.ph.e-g', mX, mW, -90], ['.glyph.e', '.ph.w-g', eX, eW, -90]];
      const rise = ease(seg(p, .14, .3));
      for (const [g, ph, tx, tw, from] of pairs) {
        const el = $('.op4 ' + g), pl = $('.op4 ' + ph); if (!el || !pl) continue;
        const s = pl.getBoundingClientRect();
        // start: the unrotated box is the placeholder with its sides swapped, on the same centre
        const w = lerp(s.height, tw, fly), h = lerp(s.width, MEh, fly);
        const ccx = lerp(s.left + s.width / 2, tx + tw / 2, fly), ccy = lerp(s.top + s.height / 2, cy, fly);
        el.style.width = w + 'px'; el.style.height = h + 'px';
        el.style.transform = `translate(${(ccx - w / 2).toFixed(1)}px, ${(ccy - h / 2).toFixed(1)}px) rotate(${(from * (1 - fly)).toFixed(2)}deg)`;
        el.style.opacity = rise;
        el.style.filter = `blur(${((1 - rise) * 8).toFixed(1)}px)`;
      }
      const lab = ease(seg(p, .7, .8));
      $$('.op4 .lab2').forEach((l, i) => { l.style.opacity = lab; const x = i ? eX + eW / 2 : mX + mW / 2; const lw = l.offsetWidth || 190; l.style.left = clamp(x - lw / 2, 8, vw - lw - 8) + 'px'; l.style.top = (cy + MEh / 2 + 22) + 'px'; });
      const deg = $('.op4 .deg'); if (deg) deg.style.opacity = ease(seg(p, .3, .4));
      const vt = $('.op4 .vt'); if (vt) vt.style.opacity = .7 * ease(seg(p, .16, .26)) * (1 - out);
      const cap = $('.op4 .cap4'); if (cap) { const c = ease(seg(p, .84, .94)); cap.style.opacity = c; cap.style.transform = `translate(-50%, ${(1 - c) * 14}px)`; }
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
