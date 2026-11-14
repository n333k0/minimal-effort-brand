// Minimal Effort guidelines: the opening after the hero. Panels reveal when they enter (IntersectionObserver adds .in), the
// outline band drifts with scroll, and the construction panel is scrubbed by scroll: lines and circles draw, A DIFFERENT KIND
// OF FRONƎ ROW arrives, then the Ǝ (a mirrored E) and the W (the M upside down) leave the words, turn, and meet inside the
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
const SPLIT = 437.5, MW = 874.943, MH = 422.417;
fetch('assets/logo/me-mark.svg').then(r => r.text()).then(t => {
  const body = t.replace(/<title>.*?<\/title>/, '');
  const part = (x, w) => body.replace(/viewBox="[^"]*"/, `viewBox="${x} 0 ${w} ${MH}"`).replace('<svg ', '<svg preserveAspectRatio="none" ');
  const m = $('.op4 .glyph.m'), e = $('.op4 .glyph.e');
  if (m) m.innerHTML = part(0, SPLIT); if (e) e.innerHTML = part(SPLIT, MW - SPLIT);
});

const op4 = $('.op4'), bands = $$('.op [data-drift]');
function frame() {
  const vh = innerHeight, vw = innerWidth;
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
      const MEw = Math.min(sqW * .78, vw * .8), MEh = MEw * MH / MW, halfW = MEw * SPLIT / MW;
      const fly = ease(seg(p, .44, .7));
      const pairs = [['.glyph.m', '.ph.w-g', cx - MEw / 2, halfW, 180], ['.glyph.e', '.ph.e-g', cx - MEw / 2 + halfW, MEw - halfW, -1]];
      const rise = ease(seg(p, .14, .3));
      for (const [g, ph, tx, tw, from] of pairs) {
        const el = $('.op4 ' + g), pl = $('.op4 ' + ph); if (!el || !pl) continue;
        const s = pl.getBoundingClientRect(), ty = cy - MEh / 2;
        const x = lerp(s.left, tx, fly), y = lerp(s.top, ty, fly), w = lerp(s.width, tw, fly), h = lerp(s.height, MEh, fly);
        el.style.width = w + 'px'; el.style.height = h + 'px';
        const turn = from === 180 ? `rotate(${180 * (1 - fly)}deg)` : `scaleX(${lerp(-1, 1, fly)})`;
        el.style.transform = `translate(${x}px, ${y}px) ${turn}`;
        el.style.opacity = rise;
        el.style.filter = `blur(${((1 - rise) * 8).toFixed(1)}px)`;
      }
      const lab = ease(seg(p, .7, .8));
      $$('.op4 .lab2').forEach((l, i) => { l.style.opacity = lab; const x = i ? cx - MEw / 2 + halfW + (MEw - halfW) / 2 : cx - MEw / 2 + halfW / 2; const lw = l.offsetWidth || 190; l.style.left = clamp(x - lw / 2, 8, vw - lw - 8) + 'px'; l.style.top = (cy + MEh / 2 + 22) + 'px'; });
      const deg = $('.op4 .deg'); if (deg) deg.style.opacity = ease(seg(p, .3, .4));
      const vt = $('.op4 .vt'); if (vt) vt.style.opacity = .7 * ease(seg(p, .16, .26)) * (1 - out);
      const cap = $('.op4 .cap4'); if (cap) { const c = ease(seg(p, .84, .94)); cap.style.opacity = c; cap.style.transform = `translate(-50%, ${(1 - c) * 14}px)`; }
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
