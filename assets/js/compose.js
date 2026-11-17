// Minimal Effort composition system (round 5). Built from the reference folder "ME Refs": every reference became a named
// composition, and every composition is made of the same building blocks, so they can be mixed in the builder:
//   colourway (cw)    what is the field, the text, the label block and the accent
//   label style (ls)  how the text is wrapped: block, tight (no padding), glow, spectrum stripe, soft focus, dots, outline, none
//   background        solid colourway, a loop, a photo, or a photo / upload through an effect (fx.js: gradient map, halftone,
//                     dither, ASCII, pixel, scan lines…)
//   shapes            vector layers: crosshairs, rings, vinyl, the ■, checker, blocks, pixel trail, beams, the giant ME, tickers…
//   font              ABC Normal (default), 403 Quzie (THE MAZE's type) or mono
//   anim              blur in, rise, wipe, type, flicker (CSS; tools/render-anim.mjs records them)
// Text is adaptive: every group sits in a box (data-fit) and shrinks to fit, so one name or twenty both work.
// Templates here: poster (22 compositions), timetable, tour, menu, release, slide (carousels for articles and cases).
import { LOGO } from './logos.js';

export const CW = {
  midnight: { label: 'Midnight', bg: '#14141A', fg: '#F5F6FC', blk: '#14141A', btx: '#F5F6FC', acc: '#B4F152', shp: '#F5F6FC', b2: '#A79BEE', tone: 'dark' },
  ice: { label: 'Ice', bg: '#F5F6FC', fg: '#14141A', blk: '#14141A', btx: '#F5F6FC', acc: '#B4F152', shp: '#14141A', b2: '#A79BEE', tone: 'light' },
  paper: { label: 'Paper grey', bg: '#E4E5EC', fg: '#14141A', blk: '#14141A', btx: '#F5F6FC', acc: '#B4F152', shp: '#14141A', b2: '#8A8C96', tone: 'light' },
  lime: { label: 'Lime', bg: '#B4F152', fg: '#14141A', blk: '#14141A', btx: '#B4F152', acc: '#14141A', shp: '#14141A', b2: '#A79BEE', tone: 'light' },
  lilac: { label: 'Lilac', bg: '#A79BEE', fg: '#14141A', blk: '#14141A', btx: '#A79BEE', acc: '#14141A', shp: '#14141A', b2: '#F5F6FC', tone: 'light' },
  limeblock: { label: 'Lime blocks', bg: '#14141A', fg: '#F5F6FC', blk: '#B4F152', btx: '#14141A', acc: '#B4F152', shp: '#B4F152', b2: '#A79BEE', tone: 'dark' },
  lilacblock: { label: 'Lilac blocks', bg: '#14141A', fg: '#F5F6FC', blk: '#A79BEE', btx: '#14141A', acc: '#B4F152', shp: '#A79BEE', b2: '#B4F152', tone: 'dark' },
  iceblock: { label: 'Ice blocks', bg: '#14141A', fg: '#F5F6FC', blk: '#F5F6FC', btx: '#14141A', acc: '#B4F152', shp: '#F5F6FC', b2: '#B4F152', tone: 'dark' },
  night: { label: 'Lime on Midnight', bg: '#14141A', fg: '#B4F152', blk: '#14141A', btx: '#B4F152', acc: '#B4F152', shp: '#B4F152', b2: '#A79BEE', tone: 'dark' },
  grey: { label: 'Iron grey', bg: '#8A8C96', fg: '#B4F152', blk: '#14141A', btx: '#B4F152', acc: '#B4F152', shp: '#B4F152', b2: '#14141A', tone: 'dark' },
  iron: { label: 'Iron', bg: '#40424D', fg: '#F5F6FC', blk: '#14141A', btx: '#F5F6FC', acc: '#B4F152', shp: '#F5F6FC', b2: '#A79BEE', tone: 'dark' },
  orange: { label: 'MAZE orange', bg: '#FF4A1A', fg: '#14141A', blk: '#5233C9', btx: '#B4F152', acc: '#B4F152', shp: '#14141A', b2: '#9A93E0', tone: 'light' },
  violet: { label: 'MAZE violet', bg: '#5233C9', fg: '#B4F152', blk: '#B4F152', btx: '#14141A', acc: '#B4F152', shp: '#B4F152', b2: '#9A62E8', tone: 'dark' },
};
export const LABEL_STYLES = { block: 'Block', tight: 'Tight (no padding)', glow: 'Glow', stripe: 'Spectrum stripe', dots: 'Halftone dots', soft: 'Soft focus', outline: 'Outline', band: 'Band to the edge', none: 'No block' };
export const FONTS = { normal: 'ABC Normal', quzie: '403 Quzie', 'quzie-c': '403 Quzie Condensed', 'quzie-w': '403 Quzie Wide', mono: 'Mono' };
export const ANIMS = { none: 'Still', blur: 'Blur in', rise: 'Rise', wipe: 'Wipe', type: 'Type', flicker: 'Flicker', drift: 'Drift' };
export const SHAPES = {
  cross: 'Corner crosses', plus: 'Plus scatter', ticks: 'Edge ticks', corners: 'Corner brackets', grid: 'Dotted grid', rings: 'Rings',
  vinyl: 'Vinyl + crosshair', square: 'The ■', checker: 'Checker', blocks: 'Blocks', trail: 'Pixel trail', beam: 'Beams', mark: 'Giant ME',
  ticker: 'Ticker bands', side: 'Side letters', star: 'Star ×', stripe: 'Spectrum strip', halfdots: 'Halftone patches', frame: 'Frame',
};

// ---------------------------------------------------------------- shared bits
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function dp(s) {
  const t = String(s.date || ''), d = (t.match(/\d{1,2}/) || ['1'])[0].padStart(2, '0'), w = (t.match(/[A-Za-z]{3,}/) || ['JAN'])[0].slice(0, 3).toUpperCase();
  const i = Math.max(0, MON.indexOf(w));
  return { d, mon: MON[i], mm: String(i + 1).padStart(2, '0'), month: MONTH[i], dow: s.dow || '' };
}
function rng(seed) { let a = seed >>> 0 || 1; return () => { a ^= a << 13; a ^= a >>> 17; a ^= a << 5; return ((a >>> 0) % 100000) / 100000; }; }
const X = '<svg viewBox="-1 -1 2 2"><path transform="rotate(45)" d="M0-1L.09-.09L1 0L.09.09L0 1L-.09.09L-1 0L-.09-.09Z" fill="currentColor"/></svg>';

let C; // per-render context: { s, W, H, T, B, M, SP, zk, photoSrc, logoRow }
const em = (role, v) => (v * C.zk(role)).toFixed(3) + 'em';
const pb = (t, st = '', c = '') => t ? `<div class="pb ${c}" style="${st}">${esc(t)}</div>` : '';
const ib = (t, st = '', c = '') => t ? `<span class="pb i ${c}" style="${st}">${t}</span>` : '';
const box = (st, html, fit = 'box', extra = '') => `<div class="bx${fit ? ' xfit' : ''} main" ${fit ? `data-fit="${fit}"` : ''} style="${st}" ${extra}>${html}</div>`;
// sparse content grows to fill its box, unless the user set a size step for that group (then sizes are exact)
const grow = (k = 2, role = 'artists') => +(C.s.size?.[role] || 0) ? '' : `data-grow="${k}"`;
const mono = (t, st = '') => t ? `<div class="mn" style="${st}">${esc(t)}</div>` : '';
const names = s => (s.artists || []).filter(a => a && a.name);
const nm = a => a.name + (a.note ? ' ' + a.note : '');
const logo = (pos = 'bc', size) => { const s = C.s; if (s.noLogo || !(s.logos || []).length) return ''; const top = pos[0] === 't'; return C.logoRow({ ...s, logos: s.logos.map(l => ({ ...l, pos: undefined })) }, C.B, pos[1] === 'l' ? 'l' : pos[1] === 'r' ? 'r' : 'c', top ? { top: C.T, size } : { size }); };
const venueLine = s => (s.venue || []).filter(Boolean);
const cta = (st = '') => C.s.ctaOn === false || !C.s.cta ? '' : `<div class="cta2 an" style="${st}">${esc(C.s.cta)}</div>`;

// ---------------------------------------------------------------- shapes (vector layers)
export function shapes(list, s, ctx) {
  if (ctx) C = ctx;
  const { W, H, T, B, M } = C, R = rng((+s.seed || 7) * 13 + 5);
  const out = [];
  for (const k of list || []) {
    if (k === 'cross') out.push([[M, T], [W - M, T], [M, H - B], [W - M, H - B]].map(([x, y]) => `<path d="M${x - 22} ${y}H${x + 22}M${x} ${y - 22}V${y + 22}"/>`).join(''));
    if (k === 'plus') { let p = ''; for (let i = 0; i < 9; i++) { const cx = 60 + R() * (W - 120), cy = 60 + R() * (H - 120), n = 2 + Math.floor(R() * 4); for (let j = 0; j < n; j++) { const x = cx + (j % 2) * 26, y = cy + Math.floor(j / 2) * 26; p += `<path d="M${x - 7} ${y}H${x + 7}M${x} ${y - 7}V${y + 7}"/>`; } } out.push(p); }
    if (k === 'ticks') { let p = ''; for (const y of [T + 40, H / 2 - 120, H / 2 + 120, H - B - 40]) p += `<rect x="${M - 22}" y="${y}" width="5" height="18" class="f"/><rect x="${W - M + 17}" y="${y}" width="5" height="18" class="f"/>`; out.push(p); }
    if (k === 'corners') { const L = 46; out.push([[M, T, 1, 1], [W - M, T, -1, 1], [M, H - B, 1, -1], [W - M, H - B, -1, -1]].map(([x, y, a, b]) => `<path d="M${x} ${y + b * L}V${y}H${x + a * L}" style="stroke-width:4"/>`).join('')); }
    if (k === 'frame') out.push(`<rect x="${M / 2}" y="${M / 2}" width="${W - M}" height="${H - M}"/>`);
    if (k === 'grid') { let p = ''; const n = 5; for (let i = 0; i <= n; i++) { const x = M + (W - 2 * M) * i / n; p += `<path class="dash" d="M${x} 0V${H}"/>`; } for (const y of [H * .3, H * .38, H * .62, H * .7, H - B + 10]) p += `<path class="dash" d="M0 ${y}H${W}"/>`; out.push(p); }
    if (k === 'rings') out.push(`<circle cx="${W * .5}" cy="${H * .2}" r="${W * .62}"/><circle cx="${W * .18}" cy="${H * .78}" r="${W * .42}"/><circle cx="${W * .92}" cy="${H * .62}" r="${W * .36}"/>`);
    if (k === 'vinyl') { const r = Math.min(W, H) * .4, cx = W / 2, cy = H * .47; out.push(`<circle cx="${cx}" cy="${cy}" r="${r}" style="stroke-width:${r * .1}"/><path d="M${cx - 30} ${cy}H${cx + 30}M${cx} ${cy - 30}V${cy + 30}" style="stroke-width:3"/>`); }
    if (k === 'square') { const z = Math.min(W, H) * .3, x = 0, y = H - z; out.push(`<path class="f" fill-rule="evenodd" d="M${x} ${y}h${z}v${z}h${-z}Z M${x + z * .32} ${y + z * .32}h${z * .36}v${z * .36}h${-z * .36}Z"/>`); }
    if (k === 'checker') { const z = Math.min(W, H) * .15; let p = ''; for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) if ((i + j) % 2 === 0 && !(i === 2 && j === 0)) p += `<rect class="f" x="${i * z}" y="${H - (3 - j) * z}" width="${z}" height="${z}"/>`; out.push(p); }
    if (k === 'blocks') { let p = ''; for (let i = 0; i < 7; i++) { const w = 120 + R() * 360, h = 120 + R() * 420; p += `<rect class="f" x="${R() * (W - w)}" y="${R() * (H - h)}" width="${w}" height="${h}" style="opacity:${(.18 + R() * .35).toFixed(2)}"/>`; } out.push(p); }
    if (k === 'trail') { let p = '', x = W * .25, y = H * .3, z = 9; for (let i = 0; i < 900; i++) { const a = i / 900 * Math.PI * 6 + Math.sin(i * .05) * 2; x += Math.cos(a) * 6 + (R() - .5) * 8; y += Math.sin(a * .7) * 5 + (R() - .5) * 8; x = Math.max(0, Math.min(W, x)); y = Math.max(0, Math.min(H, y)); for (let j = 0; j < 3; j++) if (R() < .6) p += `<rect class="f" x="${Math.round((x + (R() - .5) * 40) / z) * z}" y="${Math.round((y + (R() - .5) * 40) / z) * z}" width="${z}" height="${z}"/>`; } out.push(`<g style="opacity:.75">${p}</g>`); }
    if (k === 'beam') out.push(`<path class="f b2" d="M${W * .28} 0H${W * .44}L${W * .1} ${H}H${-W * .06}Z M${W * .56} 0H${W * .72}L${W * 1.06} ${H}H${W * .9}Z"/>`);
    if (k === 'mark') out.push(`<g class="f b2" transform="translate(${-W * .1} ${H * .12}) scale(${(W * 1.25 / 874.943).toFixed(4)})">${(LOGO['me-mark'] || '').replace(/<svg[^>]*>|<\/svg>|<title>.*?<\/title>/g, '')}</g>`);
    if (k === 'stripe') { let p = ''; const cols = ['#B4F152', '#A79BEE', '#F5F6FC', '#14141A', '#FF4A1A', '#5233C9', '#FFC24A']; for (let x = 0; x < W; x += 6) p += `<rect x="${x}" y="${H - B + 30}" width="${2 + Math.floor(R() * 5)}" height="14" fill="${cols[Math.floor(R() * cols.length)]}"/>`; out.push(p); }
    if (k === 'star') out.push(`<g class="f" transform="translate(${W - M - 40} ${T + 40}) scale(40)"><path transform="rotate(45)" d="M0-1L.09-.09L1 0L.09.09L0 1L-.09.09L-1 0L-.09-.09Z"/></g>`);
    if (k === 'halfdots') { let p = ''; for (let i = 0; i < 5; i++) { const cx = R() * W, cy = R() * H, r = 120 + R() * 200; for (let y = -r; y < r; y += 16) for (let x = -r; x < r; x += 16) { const d = Math.hypot(x, y) / r; if (d < 1) p += `<circle class="f" cx="${(cx + x).toFixed(0)}" cy="${(cy + y).toFixed(0)}" r="${(5 * (1 - d)).toFixed(1)}"/>`; } } out.push(`<g style="opacity:.7">${p}</g>`); }
  }
  const svg = out.length ? `<svg class="shp" viewBox="0 0 ${W} ${H}">${out.join('')}</svg>` : '';
  // HTML shapes: ticker bands, side letters
  let html = '';
  if ((list || []).includes('ticker')) { const t = esc(`${s.title} · ${s.date} · ${(s.venue || [])[0] || ''} · `).repeat(8); html += `<div class="tick top"><div class="tk">${t}</div></div><div class="tick bot"><div class="tk r">${t}</div></div>`; }
  if ((list || []).includes('side')) { const a = (s.sideL || 'MINIMAL').split(''), b = (s.sideR || 'EFFORT').split(''); html += `<div class="side l" style="top:${C.T + 60}px;bottom:${C.B + 60}px">${a.map(c => `<i>${esc(c)}</i>`).join('')}</div><div class="side r" style="top:${C.T + 60}px;bottom:${C.B + 60}px">${b.map(c => `<i>${esc(c)}</i>`).join('')}</div>`; }
  return svg + html;
}

// ---------------------------------------------------------------- poster compositions (one per reference)
// each: [label, reference, preset, layout function]. The preset is the look it was designed with; every part can be changed.
const P = {};
const def = (k, label, ref, preset, fn) => { P[k] = { label, ref, preset, fn }; };

def('halftone', 'Halftone', '01', { cw: 'paper', ls: 'tight', bg: 'fx', fx: { mode: 'halftone', grad: 'paper', invert: true, cell: 13, contrast: 1.35, grain: 0 }, photo: 'ry-x', shapes: [] }, s => {
  const { W, H, M, T } = C, d = dp(s);
  return logo('tc', 54) + box(`left:${M}px;right:${M}px;top:${H * .4}px;height:${H * .4}px;font-size:100px`,
    `<div style="display:flex;align-items:flex-start;gap:.06em">${pb(s.title, `font-size:${em('title', 1.05)};letter-spacing:-.05em`)}${pb(`${d.d}.${d.mm}`, `font-size:${em('date', .5)};letter-spacing:-.04em`)}</div>
    <div class="col" style="margin-left:24%;margin-top:.02em;font-size:${em('artists', .5)}">${names(s).map(a => pb(nm(a), 'letter-spacing:-.045em')).join('')}</div>
    <div class="col" style="margin:.5em 0 0 24%;font-size:${em('venue', .2)}">${venueLine(s).map(v => pb(v)).join('')}</div>`, 'box', grow(1.6, 'title'));
});
def('square', 'Square', '04 · 31', { cw: 'midnight', ls: 'tight', bg: 'fx', fx: { mode: 'none', grain: .22 }, photo: 'lee-burridge-2', shapes: ['square'], textColor: '#F5F6FC' }, s => {
  const { W, H, M, B } = C, d = dp(s);
  return logo('tc', 54) + box(`left:${W * .2}px;right:${M}px;top:${H * .5}px;height:${H * .2}px;font-size:100px;align-items:flex-end;text-align:right`,
    `${pb(s.time, `font-size:${em('date', .3)}`)}${pb(s.title, `font-size:${em('title', .48)};letter-spacing:-.05em`)}${names(s).map(a => `<div class="nb" style="font-size:${em('artists', .82)}">${esc(nm(a))}</div>`).join('')}`) +
    box(`left:${M}px;right:${W * .3}px;top:${H - Math.min(W, H) * .3 - H * .15}px;height:${H * .14}px;font-size:${(200 * C.zk('date')).toFixed(0)}px`, `<div class="nb" style="letter-spacing:-.06em">${d.d}.${d.mm}</div>`);
});
def('glow', 'Glow stack', '05', { cw: 'lilac', ls: 'glow', bg: 'cw', shapes: ['star', 'stripe'] }, s => {
  const { W, H, M, T, B } = C, d = dp(s), w = String(s.title || '').split(/\s+/);
  const half = Math.ceil(w.length / 2), t1 = w.slice(0, half).join(' '), t2 = w.slice(half).join(' ');
  return mono(venueLine(s)[1] || 'LOS ANGELES, CA', `left:${M}px;top:${T}px`) +
    box(`left:${M}px;right:${M}px;top:${T + 70}px;bottom:${B + 90}px;font-size:100px`,
      `<div class="col" style="font-size:${em('title', 1.6)}">${pb(t1)}${pb(t2)}</div><div style="height:.5em"></div>
      <div class="col" style="font-size:${em('date', 1.3)}">${pb(`${d.d} ${d.month.toUpperCase()}`)}${pb(s.time)}</div><div style="height:.5em"></div>
      <div class="col" style="font-size:${em('artists', 1.1)}">${names(s).map(a => pb(a.name)).join('')}</div>`, 'box', grow(1.8, 'artists')) + mono(s.handle, `left:${M}px;bottom:${B}px`) + logo('br', 50);
});
def('soft', 'Soft focus', '06 · 28', { cw: 'paper', ls: 'soft', bg: 'cw', shapes: [] }, s => {
  const { W, H, M, T, B } = C, d = dp(s);
  return box(`left:${M}px;right:${M}px;top:${T + 60}px;height:${H * .3}px;font-size:100px;align-items:center;text-align:center`,
    `<div class="col c" style="font-size:${em('title', 1)}">${pb(s.presenter)}${pb(`[${s.title}]`)}${pb(`${d.month} ${+d.d}`)}${pb(venueLine(s)[0])}</div>`) +
    `<div class="circles" style="top:${H * .5}px">${(s.presenter || 'ME').replace(/[^A-Z]/gi, '').slice(0, 3).split('').map(c => `<i>${esc(c)}</i>`).join('')}</div>` +
    box(`left:${M}px;right:${M}px;top:${H * .7}px;bottom:${B + 40}px;font-size:100px;align-items:center;text-align:center`,
      `<div class="x2">${X}</div><div class="col c" style="font-size:${em('artists', .5)}">${names(s).map(a => pb(nm(a))).join('')}</div><div class="mn" style="position:static;margin-top:1.4em;font-size:${em('venue', .16)}">${esc(`${d.month} ${+d.d} · ${s.time}`)}</div>`, 'box', grow(1.4));
});
def('corners', 'Corners', '07', { cw: 'iceblock', ls: 'tight', bg: 'glow', shapes: [] }, s => {
  const { W, H, M, T, B } = C, d = dp(s);
  return box(`left:${M}px;width:${W * .45}px;top:${T}px;height:${H * .14}px;font-size:100px`, `<div class="col" style="font-size:${em('presenter', .62)}">${pb(s.presenter.toLowerCase())}${pb(s.title.toLowerCase())}</div>`) +
    box(`right:${M}px;width:${W * .3}px;top:${T}px;height:${H * .2}px;font-size:100px;align-items:flex-end`, `<div class="col r" style="font-size:${em('date', 1.25)}">${pb(d.d)}${pb(d.mm)}</div>`) +
    box(`left:${W * .2}px;right:${M}px;top:${H * .42}px;height:${H * .26}px;font-size:100px;align-items:flex-end;text-align:right`, `<div class="col r" style="font-size:${em('artists', .9)}">${names(s).map(a => pb(a.name, 'letter-spacing:-.05em')).join('')}</div>`, 'box', grow(1.8)) +
    box(`left:${M}px;width:${W * .4}px;bottom:${B}px;height:70px;font-size:100px;justify-content:flex-end`, pb(`START ${s.time.split(' ')[0]}`, `font-size:${em('venue', .44)}`)) +
    box(`right:${M}px;width:${W * .5}px;bottom:${B}px;height:70px;font-size:100px;align-items:flex-end;justify-content:flex-end`, pb(venueLine(s)[0], `font-size:${em('venue', .44)}`));
});
def('stagger', 'Stagger', '08', { cw: 'limeblock', ls: 'block', bg: 'fx', fx: { mode: 'duotone', grad: 'acid', contrast: 1.3, grain: .25 }, photo: 'venue-01', shapes: [] }, s => {
  const { W, H, M, T, B } = C, d = dp(s), st = i => `margin-right:${[0, .9, .3, 1.4, .6][i % 5]}em`;
  return box(`left:${M}px;right:${M}px;top:${T + 30}px;bottom:${B + 130}px;font-size:100px;align-items:flex-end;text-align:right`,
    `${pb(s.title.toUpperCase(), `font-size:${em('title', 1.35)};letter-spacing:-.04em`)}${pb('at ' + (venueLine(s)[0] || ''), `font-size:${em('venue', .5)};${st(1)}`)}
    ${pb(`${d.d}.${d.mm}.${String(new Date().getFullYear()).slice(2)}`, `font-size:${em('date', .7)};${st(2)}`)}
    ${names(s).map((a, i) => pb(a.name.toLowerCase(), `font-size:${em('artists', [.9, 1.15, .75][i % 3])};${st(i + 3)}`)).join('')}
    <div style="height:.25em"></div>${pb('presented by', `font-size:${em('presenter', .26)};margin-right:1.6em`)}${pb(s.presenter.toLowerCase() + (s.partner ? ' × ' + s.partner.toLowerCase() : ''), `font-size:${em('presenter', .5)};margin-right:1em`)}`) + logo('bc', 60);
});
def('card', 'Card', '10', { cw: 'midnight', ls: 'block', bg: 'holo', shapes: [] }, s => {
  const { W, H, M, T } = C, [a0] = names(s);
  return box(`left:${M}px;width:${W * .66}px;top:${H * .3}px;height:${H * .42}px;font-size:100px`,
    `<div class="xcard"><div class="mn s" style="font-size:${em('presenter', .15)}">${esc(s.presenter)} — EST. 2024 → LA</div><div style="font-size:${em('title', .62)};line-height:.95;letter-spacing:-.04em;margin-top:.35em">${esc(s.issue || '017')}<br>${esc(s.title)}<br>${names(s).slice(1).map(a => esc(a.name)).join('<br>')}</div></div>
    ${a0 ? `<div class="xcard sm" style="font-size:${em('artists', .3)}">${esc(nm(a0))}</div>` : ''}`) + logo('bl', 50);
});
def('column', 'Column', '11', { cw: 'midnight', ls: 'block', bg: 'bloom', shapes: ['ticker'] }, s => {
  const { W, H, M, T, B } = C, d = dp(s), [h, ...rest] = names(s);
  return box(`left:${M}px;right:${M}px;top:${T + 90}px;bottom:${B + 90}px;font-size:100px;align-items:center;text-align:center`,
    `${pb(`${d.d}.${d.mm}`, `font-size:${em('date', .7)}`, 'k1 mnb')}${pb(String(new Date().getFullYear()), `font-size:${em('date', .55)}`, 'k2 mnb')}<div style="height:.2em"></div>
    ${h ? pb(h.name, `font-size:${em('artists', 1.05)}`, 'k1') : ''}${pb(s.title, `font-size:${em('title', .95)}`, 'k3')}
    <div class="flow c" style="font-size:${em('artists', .36)};max-width:9em">${rest.map(a => ib(esc(nm(a)))).join('')}</div>
    ${pb(venueLine(s)[0], `font-size:${em('venue', .5)}`, 'k2')}<div style="height:.3em"></div>${pb(s.presenter, `font-size:${em('presenter', .34)}`, 'k4')}`, 'box', grow(1.5));
});
def('datecard', 'Date card', '13 · 16', { cw: 'iceblock', ls: 'block', bg: 'fx', fx: { mode: 'gradmap', grad: 'ice', contrast: 1.2, grain: .2 }, photo: 'venue-01', shapes: ['rings', 'cross'] }, s => {
  const { W, H, M, T, B } = C, d = dp(s);
  return box(`left:${M}px;right:${M}px;top:${T}px;height:${H * .13}px;font-size:100px;align-items:center`, `<div class="nb" data-fit="w" style="font-size:${em('presenter', 1.4)};letter-spacing:-.04em">${esc(s.presenter)}</div>`) +
    box(`left:${M}px;right:${M}px;top:${H * .42}px;height:${H * .2}px;font-size:100px;align-items:center`,
      `<div style="display:flex;align-items:flex-end;gap:.05em"><div class="col r">${pb(s.city || 'Los Angeles', `font-size:${em('venue', .6)}`)}${pb(venueLine(s)[0], `font-size:${em('venue', .28)}`, 'k1')}</div>
      <div class="col">${pb(d.month.toUpperCase(), `font-size:${em('date', .22)}`, 'k2 mn')}${pb(d.d, `font-size:${em('date', 1.25)};letter-spacing:-.05em`, 'k4')}</div></div>`) +
    logo('bl', 50) + mono(s.cta ? `${s.cta} — link in bio` : '', `right:${M}px;bottom:${B}px;text-align:right`);
});
def('collab', 'Collab', '14', { cw: 'lime', ls: 'tight', bg: 'cw', shapes: [], partner: 'SBCTLR' }, s => {
  const { W, H, M, T, B } = C, d = dp(s), pill = t => t ? `<span class="xpill">${esc(t)}</span>` : '';
  return `<div class="pills" style="left:${M}px;top:${T}px">${pill(s.price1 || 'Presale: $25')}${pill(s.price2 || 'General: $35')}</div>` + logo('tr', 48) +
    box(`left:${M}px;right:${M}px;top:${H * .2}px;bottom:${H * .24}px;font-size:100px`,
      `<div class="col" style="width:100%">${pb(s.presenter.toLowerCase().replace('mnml effrt', 'minimal'), `font-size:${em('title', 1.6)};align-self:flex-end;letter-spacing:-.05em`)}${pb(s.presenter.toLowerCase().includes('mnml') ? 'effort' : s.title.toLowerCase(), `font-size:${em('title', 1.6)};letter-spacing:-.05em`)}
      <div style="display:flex;justify-content:space-between;align-items:flex-start;width:100%">${pb(`${d.mm}.${d.d}`, `font-size:${em('date', .5)};margin-left:2.4em`)}${pb('×', `font-size:${em('title', 1.2)}`)}</div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;width:100%">${pb(s.time.split(' ')[0], `font-size:${em('date', .5)}`)}${pb((s.partner || s.title).toLowerCase(), `font-size:${em('title', 1.6)};letter-spacing:-.05em`)}</div></div>`) +
    `<div class="pills" style="left:${M}px;bottom:${B}px;flex-direction:column;align-items:flex-start">${pill(venueLine(s).slice(0, 2).join(', '))}${pill('with ' + names(s).map(a => a.name).join(', '))}</div>`;
});
def('mono', 'Mono + lime', '15', { cw: 'limeblock', ls: 'block', bg: 'fx', fx: { mode: 'gradmap', grad: 'toner', contrast: 1.15, grain: .3 }, photo: 'lee-burridge-3', shapes: ['trail'] }, s => {
  const { W, H, M, T, B } = C, d = dp(s), [h, ...rest] = names(s);
  return box(`left:${M}px;right:${M}px;top:${H * .44}px;height:${H * .3}px;font-size:100px`,
    `${pb(`${d.mon} ${+d.d}`, `font-size:${em('date', .8)}`)}<div style="display:flex;align-items:flex-start;gap:.05em;margin-left:.6em">${h ? pb(h.name, `font-size:${em('artists', 1)}`) : ''}${h?.note ? pb(h.note.replace(/[\[\]]/g, ''), `font-size:${em('artists', .45)}`) : ''}</div>
    <div class="col r" style="align-self:flex-end;margin-top:.3em;font-size:${em('artists', .44)}">${rest.map(a => pb(nm(a))).join('')}</div>`, 'box', grow(1.5)) +
    logo('bc', 52) + `<div class="mn c" style="left:0;right:0;bottom:${C.B - 46}px;color:var(--blk)">${esc(venueLine(s).slice(0, 2).join(' | '))}</div>`;
});
def('gridsheet', 'Grid sheet', '16', { cw: 'ice', ls: 'dots', bg: 'cw', shapes: ['grid'] }, s => {
  const { W, H, M, T, B } = C, d = dp(s), cw = (W - 2 * M) / 5;
  return pb(s.city || 'LOS ANGELES', `position:absolute;left:${M + cw}px;top:${T + 40}px;font-size:${(40 * C.zk('venue')).toFixed(0)}px`, 'k0') +
    box(`left:${M + cw}px;right:${M}px;top:${H * .44}px;height:${H * .16}px;font-size:100px`,
      `<div style="display:flex;align-items:flex-start">${`<div class="col" style="flex:1">${pb(s.title, `font-size:${em('title', .78)};align-self:stretch`)}${pb(venueLine(s)[0], `font-size:${em('venue', .34)};align-self:flex-end`, 'dot2')}</div>`}<div class="col">${pb(d.d, `font-size:${em('date', 1.15)}`, 'k4')}${pb(d.month.toUpperCase(), `font-size:${em('date', .22)};align-self:stretch;text-align:center`, 'k4 mn')}</div></div>`) +
    `<div class="tbar" style="left:${M + cw}px;right:0;bottom:${B}px">${pb(s.cta ? s.cta + ' — link in bio' : s.handle, `font-size:${(28 * C.zk('venue')).toFixed(0)}px`)}</div>` + logo('bl', 46);
});
def('collage', 'Collage', '17', { cw: 'midnight', ls: 'block', bg: 'fx', fx: { mode: 'none', blur: 14, grain: .2 }, photo: 'party-06', shapes: [] }, s => {
  const { W, H, M, T, B } = C, d = dp(s);
  return box(`left:${M}px;right:${M}px;top:${H * .24}px;height:${H * .52}px;font-size:100px;align-items:center;justify-content:center`,
    `<div class="col c clg2" style="font-size:${em('title', 1)}">
      <div class="sqm" style="margin-left:-2.2em">${LOGO['me-mark']}</div>
      ${pb('> ' + (s.tag || 'Second edition'), 'font-size:.26em;align-self:flex-end;margin:-.2em -.4em 0 0', 'k3')}
      ${pb(s.title, 'font-size:1em;letter-spacing:-.05em', 'k3')}
      <div style="display:flex;align-items:flex-start;font-size:.42em;margin-top:-.05em">${pb(names(s)[0]?.name || '', '', 'k1')}${pb(`${d.d} ${d.mon} / ${s.time}`, '', 'k2')}</div>
      ${pb((s.cta || 'Tickets') + ' — link in bio', 'font-size:.24em;align-self:flex-end', 'k1')}
      <i class="ast" style="position:absolute;left:-1.1em;top:1.4em;width:.9em;height:.9em;color:var(--acc)">${X}</i></div>`) +
    `<div class="mn c" style="left:${M}px;right:${M}px;bottom:${B}px;background:var(--blk);color:var(--btx);padding:.3em .4em;width:fit-content;margin:auto">${esc(venueLine(s).join(', '))}</div>`;
});
def('plusgrid', 'Plus grid', '18', { cw: 'night', ls: 'block', bg: 'flow', shapes: ['plus', 'halfdots'] }, s => {
  const { W, H, M, T, B } = C, d = dp(s), [h, ...rest] = names(s);
  return box(`left:${M}px;right:${M}px;top:${T}px;bottom:${B + 30}px;font-size:100px;align-items:center;text-align:center`,
    `${pb(s.title.toUpperCase(), `font-size:${em('title', .95)}`, 'inv')}${pb(`${d.d}.${d.mm}`, `font-size:${em('date', .55)}`)}${pb(s.time, `font-size:${em('date', .26)}`)}<div style="height:.35em"></div>
    ${pb(s.tag || 'OPENING PARTY', `font-size:${em('title', .5)}`)}<div style="height:.3em"></div>${pb('▪ ' + (venueLine(s)[1] || 'MAIN ROOM') + ' ▪', `font-size:${em('venue', .3)}`, 'inv')}
    ${names(s).slice(0, 3).map(a => pb(a.name, `font-size:${em('artists', 1)}`)).join('')}<div style="height:.3em"></div>
    <div class="flow c" style="font-size:${em('artists', .3)}">${names(s).slice(3).map(a => ib(esc(a.name))).join('')}</div><div style="height:.4em"></div>
    ${pb(venueLine(s)[0], `font-size:${em('venue', .5)}`, 'inv')}${pb(venueLine(s)[1], `font-size:${em('venue', .2)}`)}`, 'box', grow(1.6));
});
def('wall', 'Wall', '19', { cw: 'midnight', ls: 'tight', bg: 'fx', fx: { mode: 'pixel', grad: 'thermal', cell: 18, contrast: 1.5, grain: .15 }, photo: 'party-07', shapes: [] }, s => {
  const { W, H, M, T, B } = C, d = dp(s);
  return box(`left:${M}px;right:${M}px;top:${T}px;height:${H * .13}px;font-size:100px`, `<div class="nb" style="font-size:${em('presenter', 1.05)};line-height:.85;letter-spacing:-.04em">${esc(s.presenter)}<br>${esc(s.title)}</div>`) +
    box(`left:${M}px;right:${M}px;top:${T + H * .15}px;bottom:${B + H * .17}px;font-size:100px`, `<div class="flow r" style="font-size:${em('artists', .62)}">${names(s).map((a, i) => ib(esc(a.name) + (a.note ? `<sup>${esc(a.note.replace(/[\[\]]/g, ''))}</sup>` : ''), '', i % 3 === 1 ? 'k1' : '')).join('')}</div>`, 'box', grow(3, 'artists')) +
    box(`right:${M}px;left:${W * .3}px;bottom:${B}px;height:${H * .15}px;font-size:100px;align-items:flex-end;justify-content:flex-end`, `<div class="col r" style="font-size:${em('date', 1.15)}">${pb(`${d.d} ${d.mon.toLowerCase()}`)}${pb(s.time.split(' ')[0])}</div>`) + logo('bl', 52);
});
def('portrait', 'Portrait', '20', { cw: 'night', ls: 'block', bg: 'photo', photo: 'jamiie', shapes: ['cross', 'side'] }, s => {
  const { W, H, M, T, B } = C, d = dp(s), [h] = names(s);
  return box(`left:${M + 40}px;right:${M + 40}px;bottom:${B + 60}px;height:${H * .12}px;font-size:100px;flex-direction:row;align-items:flex-end`,
    `${pb(h ? h.name : s.title, `font-size:${em('artists', 1.3)};letter-spacing:-.05em`, 'k1')}<div class="col" style="font-size:${em('date', .3)}">${pb(`${d.d}. ${d.month} ${new Date().getFullYear()}`)}${pb('Doors ' + s.time.split(' ')[0])}</div>`) +
    `<div class="mn c" style="left:0;right:0;bottom:${B}px">${esc(s.cta || 'Tickets')} at ${esc(s.url || 'minimaleffort.la')}</div>` + logo('tc', 44);
});
def('gallery', 'Gallery', '22', { cw: 'midnight', ls: 'none', bg: 'cw', shapes: [] }, s => {
  const { W, H, M, T, B } = C, d = dp(s), L = W * .16, R = W * .84, top = T + 10, bot = H - B + 30;
  const t = (x) => `font-size:${(19 * C.zk(x)).toFixed(1)}px`;
  return `<div class="rect acc" style="left:${L}px;width:${R - L}px;top:${top}px;height:${bot - top}px"></div>
  <div class="rect pan" style="left:${L + 20}px;width:${(R - L) * .64}px;top:${H * .43}px;height:${H * .14}px"></div>
  <div class="rect pan" style="left:${L + (R - L) * .3}px;width:${(R - L) * .64}px;top:${H * .66}px;height:${bot - H * .66 - 20}px"></div>
  <div class="tiny" style="left:${L + (R - L) * .1}px;top:${H * .43 - 26}px;${t('title')}">${esc(s.statement || 'Most nights are too loud for the music').toUpperCase()}</div>
  <div class="tiny" style="left:${L + 20}px;top:${H * .43 - 2}px;${t('artists')}">${esc(names(s).map(a => a.name).join(' · '))}</div>
  <div class="tiny" style="left:${L + 20}px;top:${H * .57 - 24}px;${t('date')}">${esc(`${d.month.toUpperCase()} ${+d.d} — ${s.time}`)}</div>
  <div class="tiny s" style="left:${L + 20}px;top:${H * .66 + 6}px;width:${(R - L) * .7}px;${t('venue')}">${esc(venueLine(s).join(' · ').toUpperCase())}<br>${esc(s.presenter)} ${s.partner ? '× ' + esc(s.partner) : ''} — A NIGHT FOR LISTENING</div>
  <div class="tiny" style="left:${L + (R - L) * .3 + 10}px;top:${bot - 50}px;${t('title')}">${esc(s.title.toUpperCase())}</div>` + logo('br', 40);
});
def('bands', 'Bands', '25', { cw: 'orange', ls: 'band', bg: 'cw', shapes: [] }, s => {
  const { W, H, M, T, B } = C, d = dp(s);
  return box(`left:0;right:${M}px;top:${T + 30}px;height:${H * .42}px;font-size:100px;--m:${M}px`,
    names(s).map(a => `<div class="mn s" style="position:static;margin-left:${M}px;font-size:${em('artists', .16)};margin-top:.5em">${esc((a.note || 'DJ').replace(/[\[\]]/g, ''))}</div>${pb(a.name.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase()), `font-size:${em('artists', .78)}`)}`).join(''), 'box', grow(2.2)) +
    box(`left:${M}px;width:${W * .5}px;bottom:${B}px;height:${H * .14}px;font-size:100px;justify-content:flex-end`, `<div class="nb a2" style="font-size:${em('date', .7)};letter-spacing:-.04em">${d.mm}.${d.d}<small style="font-size:.3em">${esc((s.dow || 'sat').toLowerCase())}</small></div><div class="rule2"></div><div class="nb a2" style="font-size:${em('venue', .5)};letter-spacing:-.05em">${esc(s.presenter)}</div>`) + logo('br', 48);
});
def('beam', 'Beam', '26', { cw: 'ice', ls: 'block', bg: 'cw', shapes: ['beam'], textColor: '' }, s => {
  const { W, H, M, T, B } = C, d = dp(s);
  return `<div class="bx" style="left:0;right:0;top:${T}px;align-items:center;color:var(--fg)"><div style="width:${(300 * C.zk('presenter')).toFixed(0)}px">${LOGO['me-mark']}</div></div>` +
    box(`left:${M / 2}px;right:${M / 2}px;top:${H * .44}px;height:${H * .16}px;font-size:100px;align-items:center;text-align:center`,
      `${pb(s.title, `font-size:${em('title', 1.15)};letter-spacing:-.05em`, 'k1')}<div style="display:flex;gap:.6em;font-size:${em('date', .32)}">${pb(`${+d.d} ${d.mon} ${new Date().getFullYear()}`, '', 'k3 mn')}${pb(s.time, '', 'k3 mn')}</div>`) +
    `<div class="sqd" style="left:${M}px;top:${T}px"></div><div class="sqd" style="right:${M}px;top:${T}px"></div><div class="sqd" style="left:${M}px;bottom:${B}px"></div><div class="sqd" style="right:${M}px;bottom:${B}px"></div>` +
    `<div class="mn c" style="left:${M * 2}px;right:${M * 2}px;bottom:${B}px;background:var(--blk);color:var(--btx);padding:.4em;width:fit-content;margin:auto">${esc(venueLine(s).join(' - '))}</div>`;
});
def('numbers', 'Numbers', '27', { cw: 'paper', ls: 'tight', bg: 'cw', shapes: [] }, s => {
  const { W, H, M, T, B } = C, d = dp(s), cl = `<div class="cl">${esc(s.presenter)}<br>${esc(`${d.d}–${d.mm} ${d.mon}`)}<br>${esc(s.title)}<br>${esc(venueLine(s)[0] || '')}</div>`;
  const cl2 = `<div class="cl">${names(s).map(a => esc(a.name)).join('<br>')}</div>`;
  return `<div class="clu" style="left:0;top:${T - 40}px">${cl}</div><div class="clu" style="left:${W * .28}px;top:${T + 10}px">${cl2}</div>` +
    box(`left:${W * .38}px;right:${M / 2}px;top:${T + 30}px;height:${H * .15}px;font-size:100px;align-items:flex-end`, pb(`${d.d}  ${d.mm}`, `font-size:${em('date', 1.6)};letter-spacing:-.04em;white-space:pre`, 'k4')) +
    box(`left:${W * .2}px;right:${M}px;top:${T + H * .17}px;height:${H * .5}px;font-size:100px`, `<div class="col" style="font-size:${em('artists', .62)}">${names(s).map(a => pb(a.name, '', 'kg')).join('')}${venueLine(s).slice(0, 2).map(v => pb(v, '', 'kg')).join('')}</div>`, 'box', grow(1.8)) +
    `<div class="clu" style="left:0;top:${H * .78}px">${cl}</div><div class="clu" style="left:${W * .28}px;top:${H * .82}px">${cl2}</div><div class="clu" style="left:${W * .55}px;top:${H * .78}px">${cl}</div>` + logo('br', 46);
});
def('bleed', 'Bleed', '29', { cw: 'paper', ls: 'tight', bg: 'cw', shapes: [] }, s => {
  const { W, H, M, T, B } = C, d = dp(s), [h, ...rest] = names(s);
  const words = venueLine(s).join(' ').split(/\s+/);
  return `<div class="bx" style="left:0;top:${-18 * C.zk('date')}px;font-size:${(120 * C.zk('date')).toFixed(0)}px">${pb(`${(s.dow || 'SAT').toUpperCase()} ${+d.mm}.${+d.d}`, 'letter-spacing:-.04em')}</div>` +
    `<div class="bx" style="right:0;top:0;width:${(170 * C.zk('presenter')).toFixed(0)}px;background:var(--blk);color:var(--btx);padding:22px">${LOGO['me-mark']}</div>` +
    box(`left:${M}px;right:${M}px;top:${H * .38}px;height:${H * .3}px;font-size:100px;align-items:center;text-align:center`,
      names(s).map((a, i) => `<div class="col c" style="margin-top:${i ? '.4em' : 0}">${pb(a.name, `font-size:${em('artists', i ? .62 : .78)};line-height:.84`)}${pb(a.note || venueLine(s)[1] || '', `font-size:${em('venue', .24)}`)}</div>`).join('')) +
    `<div class="spread" style="bottom:${Math.max(18, B - 70)}px">${words.map(w => `<span>${esc(w)}</span>`).join('')}</div><div class="spread s" style="bottom:${Math.max(0, B - 106)}px"><span>Doors ${esc(s.time.split(' ')[0])}</span><span>21+</span></div>`;
});
def('mirror', 'Mirror', '32', { cw: 'limeblock', ls: 'tight', bg: 'fx', fx: { mode: 'duotone', grad: 'blue', contrast: 1.25, grain: .2 }, photo: 'party-04', shapes: ['ticks'], font: 'quzie-c' }, s => {
  const { W, H, M, T, B } = C, d = dp(s);
  const title = `<div class="pb disp" data-fit="w" data-grow="3" style="font-size:${(200 * C.zk('title')).toFixed(0)}px;width:fit-content">${esc(s.title.toUpperCase())}</div>`;
  return `<div class="bx" style="left:${M}px;right:${M}px;top:${T}px">${title}</div>
  <div class="mn" style="left:${M}px;top:${T + 200}px">${esc(`${d.month} ${+d.d}`)}</div><div class="mn" style="right:${M}px;top:${T + 200}px;text-align:right">${esc(venueLine(s)[0] || '')}</div>` +
    box(`left:${M}px;right:${M}px;top:${T + 260}px;height:${H * .36}px;font-size:100px`, `<div class="col disp" style="font-size:${em('artists', .82)}">${names(s).map(a => pb(a.name)).join('')}</div>`) +
    `<div class="mn" style="left:${M}px;bottom:${B + 200}px">${esc(s.cta || 'Tickets')}: ${esc(s.url || 'minimaleffort.la')}</div><div class="mn" style="right:${M}px;bottom:${B + 200}px;text-align:right">${esc(s.presenter)}</div>
  <div class="bx" style="left:${M}px;right:${M}px;bottom:${B}px;transform:rotate(180deg)">${title}</div>`;
});
def('marquee', 'Giant ME', '26 · ME', { cw: 'lime', ls: 'block', bg: 'cw', shapes: ['mark'], textColor: '' }, s => {
  const { W, H, M, T, B } = C, d = dp(s);
  return box(`left:${M}px;right:${M}px;top:${T}px;height:${H * .2}px;font-size:100px`, `<div class="col" style="font-size:${em('title', .9)}">${pb(s.title)}${pb(`${d.mon} ${+d.d} — ${s.time}`, `font-size:.45em`)}</div>`) +
    box(`left:${M}px;right:${M}px;bottom:${B}px;height:${H * .2}px;font-size:100px;justify-content:flex-end;align-items:flex-end;text-align:right`, `<div class="col r" style="font-size:${em('artists', .62)}">${names(s).map(a => pb(nm(a))).join('')}${pb(venueLine(s)[0], 'font-size:.4em')}</div>`);
});
export const POSTER = P;

// ---------------------------------------------------------------- other new templates
const slots = s => s.slots?.length ? s.slots : names(s).map((a, i) => ({ t: `${String(20 + i).padStart(2, '0')}:00`, n: nm(a), st: i % 2 ? 'Terrace' : 'Main room' }));
const TT = {
  rows: s => { const { W, H, M, T, B } = C, d = dp(s); return box(`left:${M}px;right:${M}px;top:${T + 20}px;height:${H * .2}px;font-size:100px`, `<div class="nb a2" style="font-size:${em('title', 1.15)};line-height:.92;letter-spacing:-.04em">${d.month}<small class="it">${esc(s.dow || 'Saturday')}</small><br>${d.d}</div>`) +
    box(`left:${M}px;right:${M}px;top:${H * .44}px;height:${H * .4 - B * .3}px;font-size:100px`, `<div class="tt">${slots(s).map(r => `<div class="r" style="font-size:${em('rows', .42)}"><b>${esc(r.t)}</b><span>${esc(r.n)}</span><i class="xpill2">${esc(r.st)}</i></div>`).join('')}</div>`, 'box', grow(1.8, 'rows')) +
    `<div class="tz" style="left:${M}px;bottom:${B}px">PST</div>` + logo('br', 50); },
  faces: s => { const { W, H, M, T, B } = C, ph = Object.values(C.photos); return box(`left:${M}px;right:${M}px;top:${T}px;height:${H * .16}px;font-size:100px;align-items:center;text-align:center`, `<div class="mn a2" style="position:static;font-size:${em('presenter', .2)}">${esc(s.presenter)} ${s.partner ? '× ' + esc(s.partner) : ''}</div><div class="nb a2 disp" style="font-size:${em('title', .95)}">${esc(s.title.toUpperCase())}</div><div class="nb a2" style="font-size:${em('title', .34)}">${esc(dp(s).month.toUpperCase())} ${new Date().getFullYear()}</div>`) +
    box(`left:${M}px;right:${M}px;top:${T + H * .18}px;bottom:${B + 60}px;font-size:100px;align-items:center`, `<div class="faces">${slots(s).map((r, i) => `<div class="f" style="font-size:${em('rows', .55)};margin-left:${[0, 1.2, .5, 1.6, .2][i % 5]}em"><img src="${r.ph || ph[(i * 3 + 1) % ph.length]}" alt=""><span class="pb disp">${esc(r.n)}</span><span class="pb s">${esc(r.st)}<br>${esc(r.t)}</span></div>`).join('')}</div>`, 'box', grow(2, 'rows')) +
    `<div class="mn c" style="left:0;right:0;bottom:${B}px;color:var(--a2)">${esc(venueLine(s).join(' · '))}</div>`; },
  big: s => { const { W, H, M, T, B } = C; return box(`left:${M}px;right:${M}px;top:${T}px;bottom:${B + 80}px;font-size:100px`, `${pb(s.title + ' — set times', `font-size:${em('title', .4)}`)}<div style="height:.3em"></div>${slots(s).map(r => `<div style="display:flex;align-items:flex-start;gap:.1em;font-size:${em('rows', .9)}">${pb(r.t, 'font-variant-numeric:tabular-nums;letter-spacing:-.04em', 'k4')}${pb(r.n, 'font-size:.5em')}</div>`).join('')}`, 'box', grow(1.8, 'rows')) + logo('bl', 50); },
};
const DATES = s => s.dates?.length ? s.dates : [{ c: 'Los Angeles', v: 'The Train Station', d: 'OCT 31' }, { c: 'Los Angeles', v: '613 Imperial St', d: 'JAN 02' }, { c: 'San Diego', v: 'Rooftop', d: 'JAN 16' }, { c: 'Mexico City', v: 'Terraza', d: 'FEB 06' }, { c: 'Tulum', v: 'Jungle', d: 'FEB 13' }, { c: 'New York', v: 'Warehouse', d: 'MAR 06' }];
const TOUR = {
  columns: s => { const { W, H, M, T, B } = C; return box(`left:${M}px;right:${M}px;top:${T}px;height:${H * .14}px;font-size:100px`, `<div class="nb disp" data-fit="w" style="font-size:${em('title', 1.6)}">${esc(s.title.toUpperCase())}</div><div class="nb hand" style="font-size:${em('title', .5)};align-self:flex-end">${esc(s.subtitle || 'winter series')}</div>`) +
    box(`left:${M}px;right:${M}px;top:${T + H * .17}px;bottom:${B + 40}px;font-size:100px`, `<div class="dlist">${DATES(s).map(r => { const d = dp({ date: r.d }); return `<div class="dr" style="font-size:${em('rows', .42)}"><div class="col">${pb(r.c, 'font-size:.9em')}${pb(r.v, 'font-size:.36em;align-self:flex-end', 'k1')}</div><div class="col">${pb(d.d, 'font-size:1.25em;letter-spacing:-.05em', 'k4')}${pb(d.month.toUpperCase(), 'font-size:.24em;align-self:stretch;text-align:center', 'k4 mn')}</div></div>`; }).join('')}</div>`, 'box', grow(2, 'rows')) + logo('bl', 46) + mono(`${s.cta || 'Tickets'} — link in bio`, `right:${M}px;bottom:${B}px`); },
  residency: s => { const { W, H, M, T, B } = C; return box(`left:${M}px;right:${M}px;top:${H * .3}px;height:${H * .22}px;font-size:100px`, `<div class="col" style="font-size:${em('title', .78)}">${pb(s.presenter)}${pb(s.title, 'margin-left:1.4em')}${pb((s.subtitle || 'Residency').toUpperCase(), 'margin-left:.6em')}</div>`) +
    box(`left:${M}px;right:${M}px;top:${H * .58}px;bottom:${B + 60}px;font-size:100px`, `<div class="g2">${DATES(s).map(r => `<div class="col" style="font-size:${em('rows', .3)}">${pb(r.d)}${pb(r.v)}</div>`).join('')}</div>`, 'box', grow(2, 'rows')) + logo('bc', 48); },
  date: s => P.datecard.fn(s),
};
const MENU0 = [{ p: '16', n: 'MNML SPRITZ', k: 'signature' }, { p: '16', n: 'SECOND WIND', k: 'signature, mezcal' }, { p: '14', n: 'LIME HIGHBALL', k: 'signature' }, { p: '10', n: 'HEINEKEN', k: 'beer' }, { p: '10', n: 'MODELO', k: 'beer' }, { p: '12', n: 'EVERY SHOT', k: '' }, { p: '180', n: 'CHAMPAGNE', k: 'bottle' }, { p: '160', n: 'CASAMIGOS', k: 'bottle' }, { p: '6', n: 'WATER', k: 'free refill' }];
const MENU = {
  stagger: s => { const { W, H, M, T, B } = C, m = s.menu?.length ? s.menu : MENU0; return box(`left:${M}px;right:${M}px;top:${T + 30}px;bottom:${B + 80}px;font-size:100px;align-items:center`, `<div class="menu">${m.map((r, i) => `<div class="mr" style="font-size:${em('rows', .3)};margin-left:${[0, 1, 2, 3, 1.5, .5, 2.5, 3.5, 2][i % 9]}em"><span class="pb">${esc(r.p)}</span><span class="pb">${esc(r.n)}${r.k ? `<sup>(${esc(r.k.toUpperCase())})</sup>` : ''}</span></div>`).join('')}</div>`, 'box', grow(1.8, 'rows')) + logo('bc', 54); },
  list: s => { const { W, H, M, T, B } = C, m = s.menu?.length ? s.menu : MENU0; return box(`left:${M}px;right:${M}px;top:${T}px;height:${H * .12}px;font-size:100px`, pb(s.title || 'Bar', `font-size:${em('title', 1.2)}`)) + box(`left:${M}px;right:${M}px;top:${T + H * .14}px;bottom:${B + 80}px;font-size:100px`, `<div class="tt">${m.map(r => `<div class="r" style="font-size:${em('rows', .32)}"><span>${esc(r.n)}<small> ${esc(r.k)}</small></span><b>${esc(r.p)}</b></div>`).join('')}</div>`, 'box', grow(1.6, 'rows')) + logo('bl', 50); },
};
const REL = {
  vinyl: s => { const { W, H, M, T, B } = C, y = String(s.year || new Date().getFullYear()); return `<div class="side-strip"></div><div class="mn" style="left:${M}px;top:${M / 2}px;font:800 40px/1 var(--disp);text-transform:none;letter-spacing:-.04em">${esc(s.relTitle || 'releases & reissues')}</div>
    <div class="yr" style="left:${M}px;top:${H * .1}px">${y.slice(0, 2)}</div><div class="yr" style="right:${M}px;top:${H * .1}px">${y.slice(2)}</div>
    <div class="yr o" style="right:${M}px;bottom:${M * 1.6 + 90}px">#${esc(s.relNo || '04')}</div><div class="bx" style="right:${M / 2}px;bottom:${M / 2}px;font-size:${(120 * C.zk('title')).toFixed(0)}px">${pb((s.relKind || 'PLAYLIST').toUpperCase(), 'letter-spacing:-.05em', 'k4')}</div>`; },
  sleeve: s => { const { W, H, M, T, B } = C; return box(`left:${M}px;right:${M}px;top:${M}px;height:${H * .2}px;font-size:100px`, `<div class="nb" style="font-size:${em('title', 1.2)};line-height:.85;letter-spacing:-.05em">ME/${esc(s.relNo || '04')}</div><div class="mn" style="position:static;font-size:${em('title', .18)}">${esc(s.relKind || 'Mix series')} — ${esc(names(s)[0]?.name || '')}</div>`) +
    `<div class="mn" style="left:${M}px;bottom:${M}px">${esc(s.presenter)} RADIO</div><div class="mn" style="right:${M}px;bottom:${M}px;text-align:right">${esc(s.relLen || '62:14')}</div>`; },
};
const SL = {
  cover: s => { const { W, H, M, T, B } = C; return `<div class="mn" style="left:${M}px;top:${T}px">${esc(s.kicker || 'Case study')}</div><div class="mn" style="right:${M}px;top:${T}px;text-align:right">${esc(s.page || '01 / 06')}</div>` +
    box(`left:${M}px;right:${M}px;bottom:${B + 60}px;height:${H * .42}px;font-size:100px;justify-content:flex-end`, `<div class="col" style="font-size:${em('title', 1.15)};letter-spacing:-.045em">${String(s.head || 'Second Wind: one night, three rooms').split(/\n/).map(l => pb(l)).join('')}</div>`) + logo('bl', 46) + `<div class="mn" style="right:${M}px;bottom:${B}px;text-align:right">Swipe →</div>`; },
  text: s => { const { W, H, M, T, B } = C; return `<div class="mn" style="left:${M}px;top:${T}px">${esc(s.kicker || 'Case study')}</div><div class="mn" style="right:${M}px;top:${T}px;text-align:right">${esc(s.page || '02 / 06')}</div>` +
    box(`left:${M}px;right:${M}px;top:${T + 70}px;height:${H * .16}px;font-size:100px`, pb(s.head || 'The brief', `font-size:${em('title', .8)};letter-spacing:-.04em`)) +
    box(`left:${M}px;right:${M}px;top:${T + 70 + H * .2}px;bottom:${B + 80}px;font-size:100px`, `<p class="body" style="font-size:${em('body', .36)}">${esc(s.body || '')}</p>`, 'box', grow(1.5, 'body')) + logo('bl', 40); },
  quote: s => { const { W, H, M, T, B } = C; return `<div class="qm" style="left:${M}px;top:${T}px">“</div>` + box(`left:${M}px;right:${M}px;top:${T + 140}px;bottom:${B + 160}px;font-size:100px;justify-content:center`, `<div class="nb" style="font-size:${em('quote', .82)};line-height:.98;letter-spacing:-.04em;white-space:normal">${esc(s.quote || '')}</div>`, 'box', grow(1.6, 'quote')) +
    `<div class="mn" style="left:${M}px;bottom:${B + 70}px">— ${esc(s.by || '')}</div>` + logo('br', 40); },
  image: s => { const { W, H, M, T, B } = C; return `<div class="photo" style="left:${M}px;right:${M}px;top:${T}px;height:${H - T - B - 130}px"><img src="${C.photoSrc(s.photo)}" alt=""></div>` + `<div class="cap3" style="left:${M}px;right:${M}px;bottom:${B}px">${pb(s.caption || s.head || '', `font-size:${(30 * C.zk('body')).toFixed(0)}px`)}<span class="mn" style="position:static">${esc(s.page || '03 / 06')}</span></div>`; },
  stats: s => { const { W, H, M, T, B } = C, st = s.stats?.length ? s.stats : [{ n: '1,400', l: 'people through the door' }, { n: '11h', l: 'of music, 6pm to 5am' }, { n: '3', l: 'rooms, one sound system each' }, { n: '0', l: 'phones on the dance floor' }]; return `<div class="mn" style="left:${M}px;top:${T}px">${esc(s.kicker || 'In numbers')}</div>` +
    box(`left:${M}px;right:${M}px;top:${T + 60}px;bottom:${B + 60}px;font-size:100px`, `<div class="stats">${st.map(x => `<div class="st" style="font-size:${em('title', .9)}">${pb(x.n, 'letter-spacing:-.05em')}<span class="mn" style="position:static;font-size:.2em">${esc(x.l)}</span></div>`).join('')}</div>`, 'box', grow(1.6, 'title')) + logo('bl', 40); },
  list: s => { const { W, H, M, T, B } = C, it = s.items?.length ? s.items : ['Book the room before the artist', 'One light, warm, low', 'No VIP tables on the floor', 'Doors close when it is full']; return `<div class="mn" style="left:${M}px;top:${T}px">${esc(s.kicker || 'How we do it')}</div>` +
    box(`left:${M}px;right:${M}px;top:${T + 60}px;bottom:${B + 60}px;font-size:100px`, `<div class="tt">${it.map((t, i) => `<div class="r" style="font-size:${em('body', .42)}"><b class="mn2">${String(i + 1).padStart(2, '0')}</b><span>${esc(t)}</span></div>`).join('')}</div>`, 'box', grow(1.6, 'body')) + logo('bl', 40); },
  end: s => { const { W, H, M, T, B } = C; return `<div class="bx" style="left:0;right:0;top:${H * .32}px;align-items:center;color:var(--fg)"><div style="width:${(420 * C.zk('title')).toFixed(0)}px">${LOGO['me-mark']}</div></div>` +
    `<div class="mn c" style="left:0;right:0;top:${H * .32 + 240}px">${esc(s.handle)} · minimaleffort.la</div>` + (s.ctaOn === false ? '' : `<div class="bx" style="left:0;right:0;bottom:${B + 40}px;align-items:center">${cta()}</div>`); },
};

export const EXT = {
  poster: { label: 'Poster · from the references', formats: ['feed', 'story', 'square', 'landscape'], layouts: Object.fromEntries(Object.entries(P).map(([k, v]) => [k, `${v.label} · ${v.ref}`])), fn: s => P[s.layout].fn(s), preset: s => P[s.layout]?.preset },
  timetable: { label: 'Timetable', formats: ['feed', 'story', 'square'], layouts: { rows: 'Rows', faces: 'Faces', big: 'Big times' }, fn: s => TT[s.layout](s),
    preset: s => ({ rows: { cw: 'grey', ls: 'none', bg: 'cw', shapes: [] }, faces: { cw: 'midnight', ls: 'block', bg: 'cw', shapes: [], font: 'quzie-w', accent2: '#B4F152' }, big: { cw: 'limeblock', ls: 'tight', bg: 'fx', fx: { mode: 'dither', grad: 'night-lime', cell: 6, contrast: 1.3 }, photo: 'party-01', shapes: [] } })[s.layout] },
  tour: { label: 'Tour / series dates', formats: ['feed', 'story', 'square'], layouts: { columns: 'Columns · 12', residency: 'Residency · 28', date: 'One date · 13' }, fn: s => TOUR[s.layout](s),
    preset: s => ({ columns: { cw: 'iceblock', ls: 'block', bg: 'fx', fx: { mode: 'gradmap', grad: 'ice', contrast: 1.2, grain: .25 }, photo: 'party-05', shapes: ['rings', 'plus'], font: 'quzie-w' }, residency: { cw: 'iceblock', ls: 'tight', bg: 'fx', fx: { mode: 'none', blur: 40, grain: .25 }, photo: 'party-04', shapes: [] }, date: P.datecard.preset })[s.layout] },
  menu: { label: 'Bar menu', formats: ['feed', 'story', 'square'], layouts: { stagger: 'Stagger · 03', list: 'List' }, fn: s => MENU[s.layout](s),
    preset: s => ({ stagger: { cw: 'iceblock', ls: 'tight', bg: 'cw', shapes: [] }, list: { cw: 'lime', ls: 'none', bg: 'cw', shapes: [] } })[s.layout] },
  release: { label: 'Mix / playlist cover', formats: ['square', 'feed', 'story'], layouts: { vinyl: 'Vinyl · 02', sleeve: 'Sleeve' }, fn: s => REL[s.layout](s),
    preset: s => ({ vinyl: { cw: 'paper', ls: 'tight', bg: 'cw', shapes: ['vinyl'] }, sleeve: { cw: 'midnight', ls: 'none', bg: 'fx', fx: { mode: 'ascii', grad: 'acid', cell: 14, contrast: 1.4 }, photo: 'lee-burridge-1', shapes: [] } })[s.layout] },
  slide: { label: 'Carousel · article / case', formats: ['feed', 'square', 'story'], layouts: { cover: 'Cover', text: 'Text', quote: 'Quote', image: 'Image', stats: 'Numbers', list: 'List', end: 'End card' }, fn: s => SL[s.layout](s),
    preset: s => ({ cover: { cw: 'midnight', ls: 'block', bg: 'fx', fx: { mode: 'gradmap', grad: 'lime-lilac', contrast: 1.1 }, photo: 'party-02', shapes: [] }, text: { cw: 'ice', ls: 'none', bg: 'cw', shapes: [] }, quote: { cw: 'lilac', ls: 'none', bg: 'cw', shapes: [] }, image: { cw: 'midnight', ls: 'block', bg: 'cw', shapes: [] }, stats: { cw: 'lime', ls: 'none', bg: 'cw', shapes: [] }, list: { cw: 'iron', ls: 'none', bg: 'cw', shapes: [] }, end: { cw: 'midnight', ls: 'none', bg: 'lilac', shapes: [] } })[s.layout] },
};
export const EXT_ROLES = {
  poster: { presenter: 'Presenter', title: 'Title', date: 'Date', artists: 'Names', venue: 'Venue' },
  timetable: { title: 'Heading', rows: 'Rows', presenter: 'Presenter' }, tour: { title: 'Title', rows: 'Dates' }, menu: { title: 'Title', rows: 'Rows' },
  release: { title: 'Title' }, slide: { title: 'Headline', body: 'Body', quote: 'Quote' },
};
export const EXT_DEFAULT = {
  cw: '', ls: '', shapes: null, fx: null, font: '', anim: 'none', ctaOn: true, noLogo: false, tag: 'Opening party', dow: 'Fri', issue: '017',
  slots: [], dates: [], menu: [], relNo: '04', relKind: 'Playlist', relTitle: 'releases & reissues',
  kicker: 'Case study', head: 'Second Wind:\none night,\nthree rooms', body: 'An old printworks in the Arts District, one long table of sound, and the lights down low. We built the night around three artists who play long sets, and left everything else out: no screens, no VIP tables on the floor, no hosts on a microphone.', quote: 'The best nights feel like nobody planned them. Somebody always did.', by: 'Minimal Effort', caption: '613 Imperial Street, 4:12am', page: '',
};

// called by templates.js render(): sets the per-render context, returns { html, vars, cls, fx }
export function compose(s, ctx) {
  C = ctx;
  return EXT[s.template].fn(s);
}
