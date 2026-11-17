// Minimal Effort background lab: image effects drawn on a canvas (the "upload a picture / GIF / video and get the ASCII" module).
// One function, drawFx(canvas, source, opts, t): cover-fits the source, adjusts it (contrast, brightness, blur, invert) and
// redraws it as a gradient map, duotone, posterize, halftone, dot matrix, ordered dither, ASCII, pixel mosaic, scan lines or
// thermal. t (0..1) animates the cell effects as a seamless loop. No DOM access at import time (the renderer imports it in Node).

// gradient maps: dark → light. Brand colours first (Midnight, Iron, Lilac, Lime, Ice), then THE MAZE colours.
export const GRADS = {
  'lime-lilac': { label: 'Lime × Lilac', stops: ['#14141A', '#3A2E7A', '#A79BEE', '#B4F152', '#F5F6FC'] },
  'lilac': { label: 'Lilac', stops: ['#14141A', '#4A3FA0', '#A79BEE', '#F5F6FC'] },
  'acid': { label: 'Acid lime', stops: ['#0B0B10', '#2F4214', '#B4F152', '#F5F6FC'] },
  'ice': { label: 'Ice', stops: ['#14141A', '#40424D', '#C9C2F6', '#F5F6FC'] },
  'mono': { label: 'Mono', stops: ['#14141A', '#F5F6FC'] },
  'paper': { label: 'Paper (light)', stops: ['#E4E5EC', '#5C5E68'] },
  'toner': { label: 'Toner', stops: ['#14141A', '#14141A', '#8A8C96', '#E6E8F5'] },
  'thermal': { label: 'Thermal', stops: ['#14141A', '#3A2A9A', '#E5301A', '#FFB23E', '#F5F6FC'] },
  'ember': { label: 'Ember (MAZE)', stops: ['#1E1550', '#5233C9', '#FF4A1A', '#FFC24A'] },
  'violet': { label: 'Violet (MAZE)', stops: ['#0D0A18', '#5233C9', '#9A62E8', '#E6E8F5'] },
  'night-lime': { label: 'Night lime', stops: ['#14141A', '#1B2A0E', '#5A7A22', '#B4F152'] },
  'blue': { label: 'Signal blue', stops: ['#0D0A18', '#1C22C9', '#5A7CFF', '#B4F152'] },
  // round 6: more maps, all from the brand and THE MAZE colours
  'chrome': { label: 'Chrome silver', stops: ['#0B0B10', '#4A4C56', '#E6E8F5', '#8A8C96', '#F5F6FC'] },
  'lilac-light': { label: 'Lilac light', stops: ['#F5F6FC', '#C9C2F6', '#A79BEE', '#3A2E7A'] },
  'lime-light': { label: 'Lime light', stops: ['#F5F6FC', '#DDF7B0', '#B4F152', '#2F4214'] },
  'midnight-blue': { label: 'Midnight blue', stops: ['#0B0B10', '#181D3A', '#3A2E7A', '#A79BEE'] },
  'maze-ice': { label: 'Ice (MAZE)', stops: ['#5233C9', '#9A8CF0', '#DCE2F5', '#F5F6FC'] },
  'maze-lime': { label: 'Lime (MAZE)', stops: ['#1E1550', '#5233C9', '#9BE04A', '#D9F7A0'] },
  'ember-glow': { label: 'Ember glow', stops: ['#0B0B10', '#5A1408', '#FF4A1A', '#FFC24A', '#F5F6FC'] },
  'infrared': { label: 'Infrared', stops: ['#0B0B10', '#3A0D2E', '#E5301A', '#B4F152'] },
};
export const FX_MODES = {
  none: 'None', gradmap: 'Gradient map', duotone: 'Duotone', posterize: 'Posterize', halftone: 'Halftone', dots: 'Dot matrix',
  dither: 'Dither', ascii: 'ASCII', glyph: 'Glyphs', pixel: 'Pixel', lines: 'Scan lines', thermal: 'Thermal',
  field: 'Colour field', bloom: 'Bloom',
};
export const FX_DEFAULT = { mode: 'gradmap', grad: 'lime-lilac', cell: 12, contrast: 1.15, brightness: 0, blur: 0, invert: false, grain: .08, chars: '', angle: 45, animate: true, zoom: 1, x: .5, y: .5 };

const hex = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
function lut(stops, steps = 0) {
  const c = stops.map(hex), out = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    let v = i / 255; if (steps) v = Math.min(1, Math.floor(v * steps) / (steps - 1));
    const f = v * (c.length - 1), k = Math.min(c.length - 2, Math.floor(f)), u = f - k;
    for (let j = 0; j < 3; j++) out[i * 3 + j] = c[k][j] + (c[k + 1][j] - c[k][j]) * u;
  }
  return out;
}
const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21].map(v => (v + .5) / 64);
const hash = (x, y, s) => { let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const TAU = Math.PI * 2;

// luminance of the source, cover-fitted into gw × gh (one sample per cell)
function sample(src, gw, gh, o, W, H) {
  const c = new OffscreenCanvas(gw, gh), x = c.getContext('2d', { willReadFrequently: true });
  const sw = src.videoWidth || src.naturalWidth || src.width, sh = src.videoHeight || src.naturalHeight || src.height;
  if (!sw || !sh) return null;
  const k = Math.max(gw / sw, gh / sh) * (o.zoom || 1), dw = sw * k, dh = sh * k;
  const filt = [];
  if (o.blur) filt.push(`blur(${(o.blur * gw / W).toFixed(2)}px)`);
  x.filter = filt.join(' ') || 'none';
  x.fillStyle = '#000'; x.fillRect(0, 0, gw, gh);
  x.drawImage(src, (gw - dw) * (o.x ?? .5), (gh - dh) * (o.y ?? .5), dw, dh);
  const d = x.getImageData(0, 0, gw, gh).data, L = new Float32Array(gw * gh);
  const ct = o.contrast ?? 1, br = o.brightness ?? 0;
  for (let i = 0, p = 0; i < L.length; i++, p += 4) {
    let v = (d[p] * .299 + d[p + 1] * .587 + d[p + 2] * .114) / 255;
    v = (v - .5) * ct + .5 + br; if (o.invert) v = 1 - v;
    L[i] = v < 0 ? 0 : v > 1 ? 1 : v;
  }
  return L;
}

export function drawFx(canvas, src, opts = {}, t = 0) {
  const o = { ...FX_DEFAULT, ...opts }, W = canvas.width, H = canvas.height, ctx = canvas.getContext('2d');
  const G = o.stops ? { stops: o.stops } : GRADS[o.grad] || GRADS['lime-lilac'], stops = o.mode === 'thermal' ? GRADS.thermal.stops : o.mode === 'duotone' ? [G.stops[0], G.stops[G.stops.length - 1]] : G.stops;
  const dark = stops[0], light = stops[stops.length - 1], T = o.animate ? t : 0;
  const cell = Math.max(3, +o.cell || 12);
  if (o.mode === 'none') {
    const sw = src.videoWidth || src.naturalWidth || src.width, sh = src.videoHeight || src.naturalHeight || src.height; if (!sw) return;
    const k = Math.max(W / sw, H / sh) * (o.zoom || 1), dw = sw * k, dh = sh * k;
    ctx.filter = o.blur ? `blur(${o.blur}px)` : 'none'; ctx.drawImage(src, (W - dw) * (o.x ?? .5), (H - dh) * (o.y ?? .5), dw, dh); ctx.filter = 'none';
    return grain(ctx, W, H, o.grain, T);
  }
  if (o.mode === 'field') {
    // colour field: the source blurred to pure colour and mapped to the palette; it breathes slowly through the loop
    const L = sample(src, W, H, { ...o, blur: Math.max(+o.blur || 0, W * .06), zoom: (o.zoom || 1) * (1.12 + .05 * Math.sin(TAU * T)) }, W, H); if (!L) return;
    return fullMap(ctx, L, W, H, lut(stops), o, T);
  }
  if (o.mode === 'bloom') {
    // bloom: the gradient map, with its own light blurred back over it
    const L = sample(src, W, H, o, W, H); if (!L) return;
    fullMap(ctx, L, W, H, lut(stops), { ...o, grain: 0 }, T);
    ctx.save(); ctx.filter = `blur(${Math.round(W * .03)}px)`; ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .55 + .1 * Math.sin(TAU * T); ctx.drawImage(ctx.canvas, 0, 0); ctx.restore();
    return grain(ctx, W, H, o.grain, T);
  }
  if (['gradmap', 'duotone', 'posterize', 'thermal'].includes(o.mode)) {
    const L = sample(src, W, H, o, W, H); if (!L) return;
    return fullMap(ctx, L, W, H, lut(stops, o.mode === 'posterize' ? 5 : 0), o, T);
  }
  const gw = Math.ceil(W / cell), gh = Math.ceil(H / cell), L = sample(src, gw, gh, o, W, H); if (!L) return;
  ctx.fillStyle = dark; ctx.fillRect(0, 0, W, H);
  const map = lut(stops), col = v => { const i = Math.round(v * 255) * 3; return `rgb(${map[i]},${map[i + 1]},${map[i + 2]})`; };
  if (o.mode === 'pixel') {
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) { const v = L[y * gw + x]; ctx.fillStyle = col(Math.min(1, v + .04 * Math.sin(TAU * (T + x * .07 + y * .05)))); ctx.fillRect(x * cell, y * cell, cell + .5, cell + .5); }
  } else if (o.mode === 'dither') {
    // ordered (Bayer) dither, two colours; the threshold matrix crawls one cell per loop
    const sh = Math.floor(T * 8);
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) { const v = L[y * gw + x], th = BAYER[((y + sh) % 8) * 8 + ((x + sh) % 8)]; if (v > th) { ctx.fillStyle = light; ctx.fillRect(x * cell, y * cell, cell, cell); } }
  } else if (o.mode === 'halftone' || o.mode === 'dots') {
    const a = (o.mode === 'halftone' ? (o.angle ?? 45) : 0) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    ctx.fillStyle = light;
    const R = Math.hypot(W, H), n = Math.ceil(R / cell) + 2, cx = W / 2, cy = H / 2, ph = T * cell;
    for (let j = -n / 2; j < n / 2; j++) for (let i = -n / 2; i < n / 2; i++) {
      const u = i * cell + ph, v = j * cell, x = cx + u * ca - v * sa, y = cy + u * sa + v * ca;
      if (x < -cell || y < -cell || x > W + cell || y > H + cell) continue;
      const gx = Math.min(gw - 1, Math.max(0, Math.floor(x / cell))), gy = Math.min(gh - 1, Math.max(0, Math.floor(y / cell)));
      const l = L[gy * gw + gx];
      if (o.mode === 'halftone') { const r = Math.sqrt(l) * cell * .62; if (r > .4) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); } }
      else { const s = l > .12 ? cell * (l > .6 ? .78 : l > .35 ? .5 : .26) : 0; if (s) { ctx.fillStyle = col(l); ctx.fillRect(x - s / 2, y - s / 2, s, s); } }
    }
  } else if (o.mode === 'lines') {
    // structural mode: horizontal lines whose thickness follows the light, drifting one line per loop
    ctx.fillStyle = light; const off = T * cell;
    for (let y = 0; y < gh + 1; y++) for (let x = 0; x < gw; x++) { const l = L[Math.min(gh - 1, y) * gw + x], th = l * cell * .86; if (th > .5) ctx.fillRect(x * cell, y * cell - off + (cell - th) / 2, cell + .5, th); }
  } else {
    // ASCII / glyphs: one character per cell, picked by brightness; a few cells flicker through the loop
    const set = o.chars || (o.mode === 'glyph' ? ' .·:+x×X#■' : ' .:-=+*ME#@'), N = set.length;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `600 ${Math.round(cell * 1.05)}px 'IBM Plex Mono', ui-monospace, monospace`;
    const step = Math.floor(T * 24);
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      let l = L[y * gw + x]; if (l < .06) continue;
      if (o.animate && hash(x, y, step) < .045) l = Math.max(0, Math.min(1, l + .25 * (hash(y, x, step) - .3)));
      const ch = set[Math.max(0, Math.min(N - 1, Math.floor(l * N)))]; if (!ch || ch === ' ') continue;
      ctx.fillStyle = col(.35 + l * .65); ctx.fillText(ch, x * cell + cell / 2, y * cell + cell / 2 + 1);
    }
  }
  grain(ctx, W, H, o.grain, T);
}

function fullMap(ctx, L, W, H, map, o, T) {
  const img = ctx.createImageData(W, H), d = img.data;
  for (let i = 0, p = 0; i < L.length; i++, p += 4) { const k = Math.round(L[i] * 255) * 3; d[p] = map[k]; d[p + 1] = map[k + 1]; d[p + 2] = map[k + 2]; d[p + 3] = 255; }
  ctx.putImageData(img, 0, 0); grain(ctx, W, H, o.grain, T);
}
function grain(ctx, W, H, g, T) {
  if (!g) return;
  const s = 256, c = new OffscreenCanvas(s, s), x = c.getContext('2d'), im = x.createImageData(s, s), seed = Math.floor(T * 12);
  for (let i = 0; i < s * s; i++) { const v = hash(i % s, (i / s) | 0, seed) * 255; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
  x.putImageData(im, 0, 0);
  ctx.save(); ctx.globalAlpha = Math.min(.5, g); ctx.globalCompositeOperation = 'overlay'; ctx.fillStyle = ctx.createPattern(c, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore();
}

// load an image / video / GIF url into an element drawFx can read
export function loadSource(url) {
  return new Promise((res, rej) => {
    if (/\.(mp4|webm|mov)(\?|#|$)/i.test(url) || url.includes('#video')) {
      const v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.crossOrigin = 'anonymous'; v.src = url.replace('#video', '');
      v.addEventListener('loadeddata', () => res(v), { once: true }); v.addEventListener('error', rej, { once: true }); v.play?.().catch(() => { });
    } else { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = rej; i.src = url; }
  });
}
