// Minimal Effort template engine (round 4). One spec in, one artboard out (real export size).
// Used by the guidelines (index.html), the builder (builder.html) and the renderer (tools/render.mjs).
// Round 4: every text group has a size step (spec.size = { role: -2…+4 }), margins (spec.margin), spacing (spec.spacing) and a
// vertical nudge for the main text (spec.offsetY). Our marks are never boxed by default: they take the colour that reads on the
// background. Templates can have several compositions (TEMPLATES[t].layouts, picked with spec.layout).
import { LOGO, LOGO_META, ICON_RECTS } from './logos.js';
import { EXT, EXT_ROLES, EXT_DEFAULT, CW, compose, shapes as drawShapes, POSTER, LABEL_STYLES, FONTS, ANIMS, SHAPES } from './compose.js';
export { CW, POSTER, LABEL_STYLES, FONTS, ANIMS, SHAPES };

export const FORMATS = { feed: [1080, 1350], story: [1080, 1920], square: [1080, 1080], landscape: [1920, 1080] };

// Backgrounds — one family, "liquid light": CHROME (liquid iridescent forms), PRISM (spectrum light), FILM (analog leaks),
// BRAND LIGHT (Lilac, Lime, the two together) and SHADER (the ME drawn by WebGL: glass, pixel, grit). All loops are 10 s and end
// on their first frame. Plus textures, solids, photo, custom.
const V = (id, label, family, tone = 'dark') => ({ label, family, tone, video: `assets/video/${id}.mp4`, still: `assets/video/${id}.jpg`, loop: id });
export const BACKGROUNDS = {
  waves: V('bg01-waves', 'Waves', 'Chrome'), bluewaves: V('bg03-bluewaves', 'Blue waves', 'Chrome'), bubbles: V('bg07-chrome-bubbles', 'Bubbles', 'Chrome'),
  ribbon: V('bg08-chrome-ribbon', 'Ribbon', 'Chrome'), flow: V('bg09-chrome-flow', 'Flow', 'Chrome'),
  rainbow: V('bg02-rainbow', 'Rainbow', 'Prism'), spectrum: V('bg04-spectrum', 'Spectrum', 'Prism'), bloom: V('bg10-prism-bloom', 'Bloom', 'Prism'),
  holo: V('bg11-holo-film', 'Holo film', 'Film'), leak: V('bg12-film-leak', 'Film leak', 'Film'), ember: V('bg13-film-ember', 'Ember', 'Film'),
  lilac: V('bg05-lilac', 'Lilac beam', 'Brand light'), lime: V('bg06-lime', 'Lime field', 'Brand light', 'light'), glow: V('bg14-brand-glow', 'Lilac × Lime glow', 'Brand light', 'light'),
  glass: V('bg15-shader-glass', 'Glass ME', 'Shader'), pixel: V('bg16-shader-pixel', 'Pixel ME', 'Shader'), grit: V('bg17-shader-grit', 'Grit ME', 'Shader'),
  chrome: V('bg18-shader-chrome', 'Chrome ME', 'Shader'), holome: V('bg19-shader-holo', 'Holo ME', 'Shader', 'light'), glitch: V('bg20-shader-glitch', 'Glitch ME', 'Shader'), melt: V('bg21-shader-melt', 'Melt ME', 'Shader', 'light'),
  echo: V('bg22-shader-echo', 'Echo ME', 'Shader'), neon: V('bg23-shader-neon', 'Neon ME', 'Shader'), wave: V('bg24-shader-wave', 'Wave ME', 'Shader', 'light'), ripple: V('bg25-shader-ripple', 'Ripple ME', 'Shader'),
  halftone: V('bg26-shader-halftone', 'Halftone ME', 'Shader'), chromemaze: V('bg27-shader-chrome-maze', 'Chrome MAZE', 'Shader', 'light'),
  dust: { label: 'Dust', family: 'Texture', still: 'assets/tex/dust.jpg', tone: 'dark' },
  toner: { label: 'Toner', family: 'Texture', still: 'assets/tex/toner.jpg', tone: 'dark' },
  midnight: { label: 'Midnight', family: 'Solid', color: '#14141A', tone: 'dark' },
  limesolid: { label: 'Lime', family: 'Solid', color: '#B4F152', tone: 'light' },
  lilacsolid: { label: 'Lilac', family: 'Solid', color: '#A79BEE', tone: 'light' },
  icesolid: { label: 'Ice', family: 'Solid', color: '#F5F6FC', tone: 'light' },
  photo: { label: 'Photo', family: 'Photo', photo: true, tone: 'dark' },
  fx: { label: 'Photo + effect', family: 'Effect', fx: true, tone: 'dark' },
  cw: { label: 'Colourway', family: 'Solid', cw: true, tone: 'dark' },
  custom: { label: 'Upload', family: 'Upload', custom: true, tone: 'dark' },
};

export const PHOTOS = {
  'lee-burridge-1': 'assets/img/lee-burridge-1.jpg', 'lee-burridge-2': 'assets/img/lee-burridge-2.jpg', 'lee-burridge-3': 'assets/img/lee-burridge-3.jpg',
  'ry-x': 'assets/img/ry-x.jpg', 'jamiie': 'assets/img/jamiie.jpg',
  'party-01': 'assets/img/party-01.jpg', 'party-02': 'assets/img/party-02.jpg', 'party-03': 'assets/img/party-03.jpg', 'party-04': 'assets/img/party-04.jpg',
  'party-05': 'assets/img/party-05.jpg', 'party-06': 'assets/img/party-06.jpg', 'party-07': 'assets/img/party-07.jpg', 'venue-01': 'assets/img/venue-01.jpg',
  'extra-01': 'assets/img/artist-01.jpg', 'extra-02': 'assets/img/artist-02.jpg', 'extra-03': 'assets/img/artist-03.jpg', 'extra-04': 'assets/img/artist-04.jpg',
};
const photoSrc = p => !p ? PHOTOS['lee-burridge-1'] : (PHOTOS[p] || p);
// objects for the Now hiring post (cut out, transparent PNG)
export const OBJECTS = { radio: 'assets/mock/hire-radio.png', tape: 'assets/mock/hire-tape.png', pass: 'assets/mock/hire-pass.png', headphones: 'assets/mock/hire-headphones.png', case: 'assets/mock/hire-case.png' };

// Events: picking one sets the logo row and the accent. Logos can still be changed freely.
export const EVENTS = {
  'SECOND WIND': { accent: '#B4F152', logos: [{ id: 'origin-mark' }], presenter: 'MNML EFFRT', partner: 'SBCTLR', presents: 'PRESENTS', textColor: '', logoColor: '' },
  'THE MAZE': { accent: '#B4F152', logos: [{ id: 'the-maze', pos: 'tc', scale: 1.5 }, { id: 'me-mark' }], presenter: 'THE MAZE', partner: '', presents: 'PRESENTS', textColor: '#B4F152', logoColor: '#B4F152' },
};
export const LABEL_COLORS = { Black: '#181D20', Lime: '#B4F152', Lilac: '#A79BEE', Ice: '#F5F6FC', None: 'none' };
export const TEXT_COLORS = { White: '#F5F5F5', Midnight: '#14141A', Lime: '#B4F152', Lilac: '#A79BEE' };

export const LAYOUTS = { center: 'A · Centred', header: 'B · Header', left: 'C · Left', headliner: 'D · Headliner', split: 'E · Split', bottom: 'F · Bottom', half: 'G · Half image', window: 'H · Window' };
// THE MAZE palettes, taken from the real MAZE flyers (Halloween at The Train Station, the Arts District block party) + a night one
export const MAZE = {
  orange: { label: 'Halloween orange', base: '#FF4A1A', blobs: ['#FFB23E', '#FF7D21', '#E5301A', '#FFC24A'], block: '#9A93E0', alt: null, grad: ['#C8200F', '#FF4A1A', '#FF8A2A', '#FFC24A'] },
  violet: { label: 'Block party violet', base: '#5233C9', blobs: ['#8C6BF2', '#1E1550', '#A980F5', '#3A2A9A'], block: '#9A62E8', alt: '#0D0A18', grad: ['#1E1550', '#4A2DB8', '#8C6BF2', '#D9C8FF'] },
  night: { label: 'Night lime', base: '#14141A', blobs: ['#2F4214', '#2C2560', '#4A3FA0', '#1B2A0E'], block: '#A79BEE', alt: null, grad: ['#0B0B10', '#1B2A0E', '#2C2560', '#4A3FA0'] },
  ice: { label: 'Ice lilac', base: '#E6E8F5', blobs: ['#C9C2F6', '#F5F6FC', '#B9B0F0', '#DDE9C5'], block: '#A79BEE', alt: null, ink: '#14141A', grad: ['#B9B0F0', '#D9D6F5', '#EEF0F8', '#F5F6FC'] },
  lime: { label: 'Acid lime', base: '#B4F152', blobs: ['#DDF7A8', '#8FD12E', '#C9F57A', '#6FAE1E'], block: '#A79BEE', alt: null, ink: '#14141A', grad: ['#5E9A12', '#8FD12E', '#B4F152', '#E4FBC0'], logoInk: '#B4F152' },
};

export const TEMPLATES = {
  lineup: { label: 'Event flyer', formats: ['feed', 'story', 'square', 'landscape'], layouts: LAYOUTS },
  maze: { label: 'THE MAZE flyer', formats: ['feed', 'story', 'square', 'landscape'], layouts: Object.fromEntries(Object.entries(MAZE).map(([k, v]) => [k, v.label])) },
  announce: { label: 'Just announced', formats: ['feed', 'story'] },
  giveaway: { label: 'Ticket giveaway', formats: ['feed', 'story'], layouts: { window: 'Photo window', full: 'Full photo', ticket: 'Ticket' } },
  status: { label: 'Ticket messaging', formats: ['feed', 'story', 'square'], layouts: { low: 'Low', centre: 'Centred', top: 'Top', left: 'Left', band: 'Band, full width', bandhug: 'Band, hugging', full: 'One line, full width' } },
  calendar: { label: 'Monthly calendar', formats: ['feed', 'story'], layouts: { rows: 'Rows', big: 'Big dates', blocks: 'Label blocks', grid: 'Month grid', photo: 'Photo + rows' } },
  system: { label: 'System poster', formats: ['feed', 'story', 'square'], hidden: true },
  hiring: { label: 'Now hiring', formats: ['feed', 'story'], layouts: { object: 'Object', statement: 'Statement', roles: 'Roles list', big: 'Big headline', pass: 'Crew pass' } },
  cover: { label: 'Statement / carousel', formats: ['feed', 'square', 'story'], layouts: { low: 'Low', centre: 'Centred', top: 'Top', quote: 'Quote', split: 'Split photo' } },
  highlight: { label: 'Highlight cover', formats: ['story'] },
  ...Object.fromEntries(Object.entries(EXT).map(([k, v]) => [k, { label: v.label, formats: v.formats, layouts: v.layouts }])),
};
// the text groups of each template that have their own size step (builder: Sizes)
export const ROLES = {
  lineup: { presenter: 'Presenter', title: 'Title + date', artists: 'Artists', venue: 'Venue' },
  maze: { date: 'Date line', subtitle: 'Subtitle', artists: 'Names', pill: 'Pill', venue: 'Venue', mazelogo: 'MAZE logo' },
  announce: { presenter: 'Presenter', title: 'Title', artists: 'Artist', date: 'Date', venue: 'Venue' },
  giveaway: { meta: 'Small text', prize: 'Prize', steps: 'Steps', deadline: 'Deadline' },
  status: { meta: 'Small text', status: 'Message', title: 'Title', cta: 'Button' },
  calendar: { meta: 'Small text', month: 'Month', rows: 'Rows' },
  system: {},
  hiring: { words: 'Headline', role: 'Role(s)', apply: 'Apply line' },
  cover: { statement: 'Statement', meta: 'Small text' },
  highlight: { main: 'Word / icon' },
  ...EXT_ROLES,
};

export const DEFAULT = {
  template: 'lineup', format: 'feed', layout: 'center', labels: true, bg: 'waves', photo: 'lee-burridge-1',
  accent: '#B4F152', labelColor: '#181D20', textColor: '', dust: false, shade: 0, extra: '', extraPos: 'top',
  logos: [{ id: 'origin-mark', scale: 1 }], logoSize: 62, logoLabel: false,
  size: {}, margin: 64, spacing: 1, offsetY: 0,
  event: 'SECOND WIND', presenter: 'MNML EFFRT', partner: 'SBCTLR', presents: 'PRESENTS',
  title: 'Second Wind', date: 'Jan 2', time: '6pm to 3am',
  artists: [{ name: 'LEE BURRIDGE' }, { name: 'RY X', note: '[DJ SET]' }, { name: 'JAMIIE' }],
  venue: ['613 Imperial Street', 'Arts District Los Angeles', 'Day to Night'],
  status: 'SOLD OUT', cta: 'Get tickets', handle: '@MINIMALEFFORTLA', wrap: 'words',
  prize: 'Win 5 × VIP tickets', steps: ['Follow @minimaleffortla', 'Tag two friends', 'Share to your story'], deadline: 'Winners announced Dec 30',
  month: 'September — October',
  rows: [
    { d: 'SEP 06', w: 'SAT', e: 'THE MAZE', a: 'Guy Gerber · Lee Burridge', v: 'Train Station' },
    { d: 'SEP 20', w: 'SAT', e: 'MNML EFFRT', a: 'RY X (DJ set)', v: 'Rooftop, DTLA' },
    { d: 'OCT 04', w: 'SAT', e: 'MNML EFFRT', a: 'Jamiie', v: 'Arts District' },
    { d: 'OCT 31', w: 'FRI', e: 'THE MAZE', a: 'Halloween — to be announced', v: 'Train Station' },
  ],
  hireHead: 'NOW HIRING', role: 'Production assistant', hireBody: 'Load-in, artist care and the details nobody sees.', apply: 'jobs@minimaleffort.com',
  roles: ['Production assistant', 'Door & guest list', 'Artist liaison', 'Photo / video'], object: 'radio',
  highlight: 'ARTISTS', icon: 'artists', logoColor: '',
  statement: 'A different kind of front row.',
  subtitle: '', pill: 'IN ORDER OF APPEARANCE', seed: 7, support: '', pillPos: 'below',
  ...EXT_DEFAULT,
  log: ['> LOADING LINEUP ........ OK', '> SOUND CHECK ........... OK', '> GUEST LIST ............ SYNCED', '> DOORS ................. 6PM', '>>> SYSTEM READY · SEE YOU INSIDE'],
};

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const lb = (s, cls = '', style = '') => `<div class="lbx ${cls}" style="${style}">${esc(s)}</div>`;
export const X_SVG = '<svg viewBox="-1 -1 2 2"><path transform="rotate(45)" d="M0-1L.09-.09L1 0L.09.09L0 1L-.09.09L-1 0L-.09-.09Z" fill="currentColor"/></svg>';
export const ARROW = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const GLOBE = '<svg viewBox="0 0 60 34" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="30" cy="17" rx="28" ry="15"/><ellipse cx="30" cy="17" rx="12" ry="15"/><path d="M2 17h56M6 9h48M6 25h48"/></svg>';
export const ICONS = ICON_RECTS;
export const icon = n => `<svg viewBox="0 0 100 100" fill="currentColor">${ICON_RECTS[n] || ''}</svg>`;
export { LOGO, LOGO_META };

// ---------------------------------------------------------------- per-render state: sizes, spacing, margin
let CUR = DEFAULT, SP = 1, M = 64;
// base scale per group (round 4: on the event flyer the presenter line and the title sit about 40% smaller than the names)
const BASE = { lineup: { presenter: .6, title: .6 } };
const zk = role => (BASE[CUR.template]?.[role] ?? 1) * Math.pow(1.15, +(CUR.size?.[role] || 0));
const zs = role => `zoom:${zk(role).toFixed(4)}`;
// a sized group inside a stack (keeps the stack's alignment)
const Z = (role, html) => html ? `<div class="zr" data-role="${role}" style="${zs(role)}">${html}</div>` : '';
const gap = h => `<div style="height:${(h * SP).toFixed(1)}px;flex:none"></div>`;
const meta = (style, a, b, role = 'meta') => `<div class="meta" style="${style}"><span style="${zs(role)}">${a}</span>${b != null ? `<span style="${zs(role)}">${b}</span>` : ''}</div>`;

// ---------------------------------------------------------------- logos: optical sizing
// Every logo gets the same visual area (size²), corrected by a weight for how dense it reads; scale is the user's override.
const WEIGHT = { 'me-mark': .78, 'mnml-effrt': 1, 'mnml-effrt-square': 1, wordmark: 1, lockup: .9, 'the-maze': .95, 'origin-mark': 1.05, origin: 1, sbcltr: 1.15, 'lee-burridge': .95 };
export function logoBox(l, size) {
  const a = l.aspect || LOGO_META[l.id]?.aspect || 1, k = (l.scale ?? 1) * (WEIGHT[l.id] ?? 1);
  return [size * Math.sqrt(a) * k, size / Math.sqrt(a) * k];
}
// Logos are plain by default and take the colour that reads on the background (black on Lime / light, white on dark).
// "Our marks on a black box" (logoLabel: true) puts the ME / MNML EFFRT / MINIMAL EFFORT on a tight black label block.
const OURS = new Set(['me-mark', 'mnml-effrt', 'mnml-effrt-square', 'wordmark', 'lockup']);
function logoItems(s, list, size) {
  return list.map(l => {
    const [w, h] = logoBox(l, size);
    const inner = l.src ? `<img src="${l.src}" alt="">` : (LOGO[l.id] || '');
    const boxed = s.logoLabel === true && (l.box ?? OURS.has(l.id));
    const pad = boxed ? `padding:${Math.round(h * .24)}px ${Math.round(h * .26)}px` : '';
    return `<span class="lg-w${boxed ? ' boxed' : ''}" style="${pad}"><span class="lg-i" style="width:${w.toFixed(1)}px;height:${h.toFixed(1)}px">${inner}</span></span>`;
  }).join('');
}
const edges = f => ({ top: f === 'story' ? 250 : f === 'landscape' ? 56 : M, bottom: f === 'story' ? 330 : (f === 'square' || f === 'landscape') ? 56 : M });
function logoRow(s, y, align = 'c', opts = {}) {
  const list = (s.logos || []).filter(l => l && (l.id || l.src) && !l.pos); if (!list.length) return '';
  const pos = opts.top != null ? `top:${opts.top}px` : `bottom:${y}px`;
  return `<div class="logos ${align === 'l' ? 'l' : align === 'r' ? 'r' : ''}" style="${pos}">${logoItems(s, list, opts.size || s.logoSize || 62)}</div>`;
}
function placedLogos(s) {
  const e = edges(s.format), groups = {};
  (s.logos || []).filter(l => l && (l.id || l.src) && /^[tb][lcr]$/.test(l.pos || '')).forEach(l => (groups[l.pos] ??= []).push(l));
  return Object.entries(groups).map(([p, list]) => `<div class="logos ${p[1] === 'l' ? 'l' : p[1] === 'r' ? 'r' : ''}" style="${p[0] === 't' ? 'top:' + e.top : 'bottom:' + e.bottom}px">${logoItems(s, list, s.logoSize || 62)}</div>`).join('');
}

function background(s, { forExport } = {}) {
  const b = BACKGROUNDS[s.bg] || BACKGROUNDS.midnight;
  let inner = '';
  if (b.photo) inner = `<img src="${photoSrc(s.photo)}" alt="">`;
  else if (b.custom) inner = s.bgType === 'video' && !forExport ? `<video src="${s.bgSrc}" autoplay muted loop playsinline></video>` : (s.bgStill || s.bgSrc ? `<img src="${s.bgStill || s.bgSrc}" alt="">` : '');
  else if (b.fx) { const [W, H] = FORMATS[s.format]; const src = s.fxSrc || photoSrc(s.photo); inner = `<canvas class="fxc" data-fx='${JSON.stringify(s.fx || { mode: 'gradmap' }).replace(/'/g, '&#39;')}' data-src="${src}" data-w="${W}" data-h="${H}" width="${W}" height="${H}"></canvas>`; }
  else if (b.cw) inner = '';
  else if (b.video && !forExport) inner = `<video src="${b.video}" poster="${b.still}" autoplay muted loop playsinline></video>`;
  else if (b.still) inner = `<img src="${b.still}" alt="">`;
  const sh = +s.shade || 0;
  const shade = sh ? `<div class="shade" style="background:linear-gradient(180deg,rgba(10,10,14,${sh}),rgba(10,10,14,${sh * .45}) 45%,rgba(10,10,14,${sh}))"></div>` : '';
  return { html: `<div class="bg" style="background:${b.cw ? (CW[s.cw] || CW.midnight).bg : b.color || '#14141A'}">${inner}</div>${shade}${s.dust ? '<div class="dust"></div>' : ''}`, tone: b.cw ? (CW[s.cw] || CW.midnight).tone : b.fx ? (s.fxTone || 'dark') : b.tone };
}
export function wrapText(t, max) {
  const out = []; let cur = '';
  for (const w of String(t ?? '').split(/\s+/).filter(Boolean)) { if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; }
  if (cur) out.push(cur); return out;
}
// chars that fit a width at a font size (ABC Normal Heavy averages ~.56em a character); role zoom counts
const fit = (px, width = 952) => Math.max(6, Math.floor(width / (px * .56)));
const lbs = (t, px, cls = '', style = '', width, role) => wrapText(t, fit(px * (role ? zk(role) : 1), width)).map(l => lb(l, cls, `font-size:${px}px;${style}`)).join('');
const pres = s => `<div class="lbx t-l" style="white-space:nowrap">${esc(s.presenter)}${s.partner ? `<span class="x">${X_SVG}</span>${esc(s.partner)}` : ''}</div>`;
const arts = (s, big = 't-xl', small = 't-s') => s.artists.map(a => lb(a.name, big) + (a.note ? lb(a.note, small) : '')).join('');
const venue = s => s.venue.filter(Boolean).map(v => lb(v, 't-v')).join('');
const techLabel = s => `<div class="tl"><div class="glb">${GLOBE}</div><div><small>Event</small><b>${esc(s.title)}</b></div><div><small>Date</small><b>${esc(s.date)}</b></div><div><small>Time</small><b>${esc(s.time)}</b></div><div class="bar"></div></div>`;
const fw = s => FORMATS[s.format][0], fh = s => FORMATS[s.format][1];

// ---------------------------------------------------------------- templates
function lineup(s) {
  const st = s.format === 'story', ls = s.format === 'landscape', sq = s.format === 'square' || ls, L = s.layout;
  const k = sq ? .82 : 1, z = st ? 'transform:scale(1.2);transform-origin:50% 0;' : '';
  const bottom = edges(s.format).bottom, W = fw(s), Hh = fh(s);
  const dateLine = `${s.date}  –  ${s.time}`;
  const P = Z('presenter', pres(s) + (s.presents ? lb(s.presents, 't-xs') : '')), T = Z('title', lb(s.title, 't-m') + lb(dateLine, 't-s')), A = Z('artists', arts(s)), Vn = Z('venue', venue(s));
  let html = '';
  if (L === 'header') {
    const hs = Math.min(98, Math.round(1480 / Math.max(10, (s.presenter + s.partner).length + 3))) * Math.pow(1.15, +(s.size?.presenter || 0));
    html += `<div class="wide" style="top:${st ? 260 : 40}px;left:${M - 24}px;right:${M - 24}px;font-size:${hs}px;letter-spacing:-0.035em;line-height:1.02;justify-content:${s.partner ? 'space-between' : 'center'}"><span class="lbx">${esc(s.presenter)}</span>${s.partner ? `<span class="x" style="width:${hs * .62}px;height:${hs * .62}px;margin:0">${X_SVG}</span><span class="lbx">${esc(s.partner)}</span>` : ''}</div>`;
    html += `<div class="stack c main" style="top:${st ? 600 : sq ? 250 : 380}px;padding:0 ${M - 24}px;${z}">${T}${gap(88 * k)}${A}${gap(88 * k)}${Vn}</div>`;
    html += logoRow(s, bottom);
  } else if (L === 'headliner') {
    const [head, ...rest] = s.artists;
    const HA = Z('artists', lbs(head?.name || '', 150, '', 'letter-spacing:-0.045em', 900, 'artists') + (head?.note ? lb(head.note, 't-s') : '') + gap(40 * k) + rest.map(a => lb(a.name + (a.note ? ' ' + a.note : ''), 't-l')).join(''));
    html += `<div class="stack c main" style="top:${st ? 470 : sq ? 110 : 230}px;padding:0 ${M - 24}px;${z}">${P}${gap(60 * k)}${HA}${gap(70 * k)}${T}${gap(36)}${Vn}</div>`;
    html += logoRow(s, bottom);
  } else if (L === 'split') {
    const top = st ? 300 : sq ? M : 120;
    html += `<div class="stack l main" style="top:${top}px;left:${M}px;right:auto;width:440px">${P}${gap(56)}${T}${gap(56)}${Vn}</div>`;
    html += `<div class="stack r main" style="top:${top + (sq ? 300 : 420)}px;right:${M}px;left:auto;width:620px">${A}</div>`;
    html += logoRow(s, bottom, 'l');
  } else if (L === 'bottom') {
    html += `<div class="stack l main" style="top:auto;bottom:${bottom + 130}px;padding:0 ${M}px">${P}${gap(40)}${A}${gap(40)}${Z('title', lb(s.title + '  ·  ' + dateLine, 't-s'))}${Vn}</div>`;
    html += logoRow(s, bottom, 'l');
  } else if (L === 'half') {
    // the screen divided in half: a photo on one half, the background on the other, the text on top of both
    if (ls) {
      html += `<div class="photo" style="left:0;top:0;bottom:0;width:50%"><img src="${photoSrc(s.photo)}" alt=""></div>`;
      html += `<div class="stack l main" style="left:calc(50% - 120px);right:${M}px;top:0;bottom:0;justify-content:center">${P}${gap(40)}${A}${gap(40)}${T}${gap(24)}${Vn}</div>`;
      html += logoRow(s, bottom, 'r');
    } else {
      const half = Math.round(Hh / 2);
      html += `<div class="photo" style="left:0;right:0;top:0;height:${half}px"><img src="${photoSrc(s.photo)}" alt=""></div>`;
      html += `<div class="stack c" style="top:${edges(s.format).top}px;padding:0 ${M}px">${P}</div>`;
      html += `<div class="stack c main" style="top:0;bottom:0;padding:0 ${M}px;justify-content:center">${A}</div>`;
      html += `<div class="stack c" style="top:auto;bottom:${bottom + (st ? 150 : 120)}px;padding:0 ${M}px">${T}${gap(24)}${Vn}</div>`;
      html += logoRow(s, bottom);
    }
  } else if (L === 'window') {
    // a photo window; the artists sit inside it, bottom left; title, date and venue below
    if (ls) {
      html += `<div class="photo win" style="left:46%;right:${M}px;top:${M}px;bottom:${M}px"><img src="${photoSrc(s.photo)}" alt=""><div class="stack l" style="left:28px;right:28px;top:auto;bottom:28px">${A}</div></div>`;
      html += `<div class="stack l main" style="left:${M}px;width:calc(46% - ${M + 40}px);top:${M}px">${P}${gap(60)}${T}${gap(30)}${Vn}</div>`;
      html += logoRow(s, M, 'l');
    } else {
      const top = edges(s.format).top + (st ? 110 : 96), hW = st ? 900 : sq ? 520 : 700;
      html += `<div class="stack l" style="top:${edges(s.format).top}px;padding:0 ${M}px">${P}</div>`;
      html += `<div class="photo win main" style="left:${M}px;right:${M}px;top:${top}px;height:${hW}px"><img src="${photoSrc(s.photo)}" alt=""><div class="stack l" style="left:28px;right:28px;top:auto;bottom:28px">${A}</div></div>`;
      html += `<div class="stack l main" style="left:${M}px;right:${M}px;top:${top + hW + 28 * SP}px">${T}${gap(16)}${Vn}</div>`;
      html += logoRow(s, bottom, 'r');
    }
  } else {
    const align = L === 'left' ? 'l' : 'c', pad = L === 'left' ? `padding:0 ${M}px` : `padding:0 ${M - 24}px`;
    const tl = (s.logos || []).some(l => l && /^t/.test(l.pos || '')), top = st ? 470 : ls ? (tl ? 190 : 96) : sq ? (tl ? 210 : 120) : (tl ? 330 : 300);
    const zz = st ? `transform:scale(1.2);transform-origin:${L === 'left' ? M + 'px' : '50%'} 0;` : '';
    html += `<div class="stack ${align} main" style="top:${top}px;${pad};${zz}">${P}${gap(44 * k)}${T}${gap(88 * k)}${A}${gap(88 * k)}${Vn}</div>`;
    html += logoRow(s, bottom, align);
  }
  return html;
}

// THE MAZE: its own flyer, after the real ones — maze blocks over a blurred colour field (or a blurred photo / loop), the MAZE
// square logo sitting in one block, a mono date line, big lime names, IN ORDER OF APPEARANCE, the venue.
function rng(seed) { let a = seed >>> 0 || 1; return () => { a ^= a << 13; a ^= a >>> 17; a ^= a << 5; return ((a >>> 0) % 100000) / 100000; }; }
function mazeBlocks(W, H, c, seed, logoCell) {
  const nx = Math.ceil(W / c) + 2, ny = Math.ceil(H / c) + 2, R = rng(seed * 9301 + 49297);
  const on = Array.from({ length: ny }, () => Array(nx).fill(false));
  // carve a maze on the odd cells (depth first), corridors one block wide
  const cx = Math.floor((nx - 1) / 2), cy = Math.floor((ny - 1) / 2), seen = new Set(), st = [[1, 1]]; on[1][1] = true; seen.add('1,1');
  while (st.length) {
    const [x, y] = st[st.length - 1];
    const nb = [[2, 0], [-2, 0], [0, 2], [0, -2]].map(([dx, dy]) => [x + dx, y + dy, dx, dy]).filter(([a, b]) => a > 0 && b > 0 && a < nx - 1 && b < ny - 1 && !seen.has(a + ',' + b));
    if (!nb.length) { st.pop(); continue; }
    const [a, b, dx, dy] = nb[Math.floor(R() * nb.length)];
    on[y + dy / 2][x + dx / 2] = true; on[b][a] = true; seen.add(a + ',' + b); st.push([a, b]);
  }
  // loosen it so it reads as a pattern, not a puzzle
  for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) { const r = R(); if (on[y][x] && r < .12) on[y][x] = false; else if (!on[y][x] && r > .78) on[y][x] = true; }
  return { on, nx, ny, cx, cy };
}
function maze(s) {
  const W = fw(s), H = fh(s), ls = s.format === 'landscape', st = s.format === 'story', sq = s.format === 'square';
  const P = MAZE[s.layout] || MAZE.orange, c = 140;
  const ox = ls ? -10 : ((W / 2 - c / 2) % c) - c, oy = st ? -60 : -20;
  // the logo block: top centre (left middle on the landscape cover)
  const lx = ls ? 1 : Math.round((W / 2 - c / 2 - ox) / c), ly = ls ? Math.round((H / 2 - c / 2 - oy) / c) : (st ? 4 : 1);
  const g = mazeBlocks(W, H, c, +s.seed || 7);
  g.on[ly][lx] = true;
  let rects = '';
  const R = rng((+s.seed || 7) * 7 + 3);
  for (let y = 0; y < g.ny; y++) for (let x = 0; x < g.nx; x++) if (g.on[y][x]) { const alt = P.alt && R() < .18 && !(x === lx && y === ly); rects += `<rect x="${ox + x * c - .5}" y="${oy + y * c - .5}" width="${c + 1.5}" height="${c + 1.5}" fill="${alt ? P.alt : P.block}"${alt ? ' opacity=".9"' : ''}/>`; }
  // colour field: soft blobs (or the chosen photo / loop, blurred and tinted)
  const Rb = rng((+s.seed || 7) * 31 + 11);
  const blobs = P.blobs.map(col => `radial-gradient(${Math.round(260 + Rb() * 380)}px ${Math.round(220 + Rb() * 320)}px at ${Math.round(Rb() * 100)}% ${Math.round(Rb() * 100)}%, ${col}, transparent 70%)`).join(',');
  const own = s.bg === 'maze' || !BACKGROUNDS[s.bg];
  // the field, as on the real flyers: a photo blurred to colour, gradient-mapped to the palette, with heavy grain
  const fxo = JSON.stringify({ mode: 'gradmap', grad: 'custom', stops: P.grad, blur: 34, contrast: 1.25, grain: .38, zoom: 1.15 });
  const field = own && s.mazeField !== 'blobs' ? `<canvas class="fxc mz-field" data-fx='${fxo}' data-src="${photoSrc(s.mazePhoto || s.photo || 'party-05')}" data-w="${W}" data-h="${H}" width="${W}" height="${H}" style="background:${P.base}"></canvas>`
    : `<div class="mz-field" style="background:${blobs},${P.base};${own ? '' : 'mix-blend-mode:color;opacity:.72'}"></div>`;
  const ink = s.textColor || P.ink || '#B4F152';
  const mz = Math.round(c * .78 * zk('mazelogo'));
  const logo = `<div class="mz-logo" style="left:${ox + lx * c + c / 2 - mz / 2}px;top:${oy + ly * c + c / 2 - mz / 2}px;width:${mz}px;height:${mz}px;color:${s.logoColor || ink}">${LOGO['the-maze']}</div>`;
  const names = s.artists.map(a => { const t = a.name + (a.note ? ' ' + a.note : ''); const base = ls ? 130 : sq ? 128 : 165, px = Math.min(base, (ls ? 1000 : W - 2 * M + 40) / (Math.max(4, t.length) * .42)); return `<div class="mz-n" style="font-size:${px.toFixed(1)}px">${esc(t)}</div>`; }).join('');
  const support = s.support ? Z('artists', `<div class="mz-mono" style="font-size:32px">SUPPORT BY:&nbsp;&nbsp;${esc(s.support)}</div>`) : '';
  const dateL = Z('date', `<div class="mz-mono" style="font-size:32px">${esc(s.date)},&nbsp;&nbsp;${esc(s.title)}</div>`);
  const sub = s.subtitle ? Z('subtitle', `<div class="mz-n" style="font-size:46px">${esc(s.subtitle)}</div>`) : '';
  const pill = s.pill ? Z('pill', `<div class="mz-pill">${esc(s.pill)}</div>`) : '';
  const [v0, ...vr] = s.venue.filter(Boolean);
  const ven = Z('venue', (v0 ? `<div class="mz-n" style="font-size:48px">${esc(v0)}</div>` : '') + vr.map(v => `<div class="mz-mono" style="font-size:21px;font-family:var(--disp);font-weight:700;letter-spacing:0">${esc(v)}</div>`).join(''));
  let text;
  if (ls) {
    text = `<div class="stack l main" style="left:385px;right:${M}px;top:96px">${dateL}${gap(18)}${sub}${Z('artists', names)}</div>
    <div class="stack l" style="left:385px;top:auto;bottom:${M + 20}px">${pill}</div>
    <div class="stack l" style="left:1010px;top:auto;bottom:${M + 6}px">${ven}</div>`;
  } else {
    const top = st ? 600 : sq ? 250 : 390, above = s.pillPos === 'above';
    text = `<div class="stack c main" style="top:${top}px;padding:0 ${M - 24}px">${dateL}${gap(sub ? 10 : 22)}${sub}${gap(sub ? 18 : 0)}${above ? pill + gap(24) : ''}${Z('artists', names)}${support ? gap(26) + support : ''}${above ? '' : gap(sq ? 26 : 34) + pill}${gap(sq ? 30 : st ? 70 : 90)}${ven}</div>`;
  }
  return `<div class="mz">${own ? field : field}<svg class="mz-blocks" shape-rendering="crispEdges" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${rects}</svg><div class="mz-grain"></div></div>${logo}<div class="mz-ink" style="color:${ink};--mzc:${ink}">${text}</div>`;
}

function announce(s) {
  const st = s.format === 'story', a = s.artists[0] || { name: 'ARTIST' }, bot = st ? 330 : M;
  const big = a.name.length > 9 ? 132 : 150;
  return `<div class="photo" style="inset:0"><img src="${photoSrc(s.photo)}" alt=""></div>
  <div class="shade" style="background:linear-gradient(180deg,rgba(20,20,26,.35),rgba(20,20,26,0) 22%,rgba(20,20,26,0) 46%,rgba(20,20,26,.82))"></div>
  ${logoRow(s, bot, 'r')}
  <div class="stack l main" style="left:${M}px;right:300px;bottom:${bot}px;top:auto">
    ${s.presenter ? Z('presenter', lb(s.presenter + (s.partner ? ' × ' + s.partner : '') + (s.presents ? ' ' + s.presents.toLowerCase() : ''), 't-xs')) : ''}
    ${Z('title', lb(s.title, 't-m'))}
    ${Z('artists', lbs(a.name, big, '', 'letter-spacing:-0.045em', 820, 'artists') + (a.note ? lb(a.note, 't-s') : ''))}
    ${Z('date', lb(s.date + '  –  ' + s.time, 't-m'))}
    ${Z('venue', s.venue.filter(Boolean).slice(0, 3).map(v => lb(v, 't-v')).join(''))}
  </div>`;
}

function prizeBlocks(s, px, width) {
  return wrapText(s.prize, fit(px * zk('prize'), width)).map(l => `<div class="lbx" style="font-size:${px}px;letter-spacing:-0.045em">${esc(l).replace(/\s*×\s*/, ' <span class="acc">×</span> ')}</div>`).join('');
}
const steps = s => s.steps.map((t, i) => `<div class="lbx mono" style="font-size:26px"><span class="acc">0${i + 1}</span>&nbsp;&nbsp;${esc(t)}</div>`).join('');
function giveaway(s) {
  const st = s.format === 'story', top = st ? 250 : M, bot = st ? 330 : M, L = s.layout;
  const px = st ? 120 : 108;
  if (L === 'full') {
    // the photo fills the frame, centred; the words sit low
    return `<div class="photo" style="inset:0"><img src="${photoSrc(s.photo)}" style="object-position:50% 50%" alt=""></div>
    <div class="shade" style="background:linear-gradient(180deg,rgba(20,20,26,.45),rgba(20,20,26,0) 26%,rgba(20,20,26,.1) 50%,rgba(20,20,26,.85))"></div>
    ${meta(`top:${top}px`, `${esc(s.event)} · ${esc(s.date)}`, 'Giveaway')}
    <div class="stack l main" style="left:${M}px;right:${M}px;top:auto;bottom:${bot + 110}px">
      ${Z('prize', prizeBlocks(s, px, 952))}${gap(26)}${Z('steps', steps(s))}${gap(16)}${Z('deadline', `<div class="mono" style="font-size:18px;color:var(--meta);opacity:.85">${esc(s.deadline)}</div>`)}
    </div>
    ${logoRow(s, bot, 'l')}`;
  }
  if (L === 'ticket') {
    // a ticket: the prize printed on a stub with notches and a perforation
    const tH = st ? 640 : 520, tTop = st ? 560 : 250;
    return `${meta(`top:${top}px`, `${esc(s.event)} · ${esc(s.date)}`, 'Giveaway')}
    <div class="ticket main" style="left:${M}px;right:${M}px;top:${tTop}px;height:${tH}px">
      <div class="tk-main"><div class="mono tk-k" style="${zs('meta')}">Admit ${esc((s.prize.match(/\d+/) || ['2'])[0])} · ${esc(s.title)}</div>
        <div style="${zs('prize')}">${wrapText(s.prize, fit(px * .82 * zk('prize'), 640)).map(l => `<div class="tk-p" style="font-size:${Math.round(px * .82)}px">${esc(l).replace(/\s*×\s*/, ' <span class="acc">×</span> ')}</div>`).join('')}</div>
        <div class="mono tk-k" style="${zs('meta')}">${esc(s.date)} · ${esc(s.time)} · ${esc(s.venue[0] || '')}</div></div>
      <div class="tk-stub"><span class="mono" style="${zs('meta')}">No. 0102</span></div>
    </div>
    <div class="stack l" style="left:${M}px;right:${M}px;top:${tTop + tH + 40 * SP}px">${Z('steps', steps(s))}${gap(14)}${Z('deadline', `<div class="mono" style="font-size:18px;color:var(--meta);opacity:.85">${esc(s.deadline)}</div>`)}</div>
    ${logoRow(s, bot)}`;
  }
  return `${meta(`top:${top}px`, `${esc(s.event)} · ${esc(s.date)}`, 'Giveaway')}
  <div class="rule" style="top:${top + 40}px"></div>
  <div class="photo" style="left:${M}px;right:${M}px;top:${top + 70}px;height:${st ? 720 : 500}px"><img src="${photoSrc(s.photo)}" style="object-position:50% 50%" alt=""></div>
  <div class="stack l main" style="left:${M}px;right:${M}px;top:${top + (st ? 840 : 620)}px">
    ${Z('prize', prizeBlocks(s, px, 952))}
    ${gap(28)}${Z('steps', steps(s))}
    ${gap(18)}${Z('deadline', `<div class="mono" style="font-size:18px;color:var(--meta);opacity:.85">${esc(s.deadline)}</div>`)}
  </div>
  ${logoRow(s, bot, 'l')}`;
}

function status(s) {
  // round 5: the message sits in the balance between the header and the button (no longer at the very bottom); the button can be
  // switched off (ctaOn: false); the words can be one block per word or one line (wrap); seven compositions.
  const st = s.format === 'story', sq = s.format === 'square', W = fw(s), H = fh(s), top = st ? 250 : M, bot = st ? 330 : sq ? 56 : M, L = s.layout;
  const sold = /SOLD/.test(s.status), hasLogo = (s.logos || []).some(l => l && !l.pos), ctaOn = s.ctaOn !== false;
  const ctaB = bot + (hasLogo ? (sq ? 100 : 120) : 0), ctaTop = H - ctaB - 84;
  const free0 = top + 60, free1 = ctaOn ? ctaTop - 40 : H - (hasLogo ? bot + 100 : bot);
  const line = s.wrap === 'line', words = line ? [s.status] : s.status.split(' ');
  const big = (line ? (sq ? 120 : 132) : words.length > 2 ? (sq ? 130 : 150) : (sq ? 170 : 200));
  const blocks = words.map(w => `<div class="lbx" style="font-size:${big}px;letter-spacing:-0.05em;white-space:nowrap">${esc(w)}</div>`).join('');
  const Wd = Z('status', blocks), T = Z('title', lb(s.title + '  ·  ' + s.date, 't-m'));
  const cta = ctaOn ? `<div style="position:absolute;left:0;right:0;bottom:${ctaB}px;display:flex;justify-content:${L === 'left' ? 'flex-start' : 'center'};padding:0 ${M}px"><span class="cta ${sold ? '' : 'acc'}" style="${zs('cta')}">${esc(sold ? (s.ctaSold || 'Join the waitlist') : s.cta)} ${ARROW}</span></div>` : '';
  const head = `${meta(`top:${top}px`, esc(s.event), `${esc(s.date)} · ${esc(s.time)}`)}<div class="rule" style="top:${top + 40}px"></div>`;
  const logoAlign = L === 'left' ? 'l' : 'c';
  const mid = (free0 + free1) / 2;
  if (L === 'band' || L === 'bandhug') {
    // one Lime band across the middle (full width, or hugging the words) carries the message
    const hug = L === 'bandhug';
    return `${head}<div class="band main${hug ? ' hug' : ''}" style="top:${mid}px;transform:translateY(-50%)"><div class="stack c" style="position:relative">${Z('status', lb(s.status, '', `font-size:${big * .62}px;letter-spacing:-0.05em;white-space:nowrap`))}</div></div>
    <div class="stack c" style="top:${mid + big * .5 + 10}px;padding:0 ${M}px">${T}</div>${cta}${logoRow(s, bot)}`;
  }
  if (L === 'full') {
    // the message as wide as the frame, one line, the title under it
    return `${head}<div class="stack c main" style="top:${free0}px;height:${free1 - free0}px;justify-content:center;padding:0 ${M}px"><div class="lbx" data-fit="w" data-grow="4" style="font-size:${big * .6}px;letter-spacing:-0.055em;white-space:nowrap">${esc(s.status)}</div>${gap(16)}${T}</div>${cta}${logoRow(s, bot)}`;
  }
  const just = { centre: 'center', low: 'flex-end', top: 'flex-start', left: 'center' }[L] || 'center';
  // low sits a little above the button (a fifth of the free space), centre is the optical middle of the whole post
  const y0 = L === 'centre' ? 0 : free0, y1 = L === 'centre' ? H - 0 : free1 - (L === 'low' ? (free1 - free0) * .16 : 0);
  return `${head}
  <div class="stack ${L === 'left' ? 'l' : 'c'} main" style="top:${y0}px;height:${y1 - y0}px;justify-content:${just};${L === 'left' ? `padding:0 ${M}px` : ''}">${Wd}${T}</div>
  ${cta}
  ${logoRow(s, bot, logoAlign)}`;
}

function calendar(s) {
  // round 5: five compositions — rows (the original), big dates, label blocks, month grid, photo + rows
  const st = s.format === 'story', top = st ? 250 : M, bot = st ? 330 : M, L = s.layout, W = fw(s), H = fh(s);
  const head = `${meta(`top:${top}px`, 'Minimal Effort', 'Calendar')}`;
  const foot = `${s.ctaOn === false ? '' : meta(`bottom:${bot + 10}px;top:auto;align-items:flex-end`, `${esc(s.cta)} — link in bio`)}${logoRow(s, bot, 'r')}`;
  const month = (px) => `<div class="stack l main" style="left:${M}px;right:${M}px;top:${top + 50}px">${Z('month', lb(s.month, '', `font-size:${px}px;letter-spacing:-0.045em`))}</div>`;
  if (L === 'big') {
    // one row per night: the day huge, the night and the artists beside it
    return `${head}${month(st ? 96 : 80)}<div class="bx fit main" data-fit="box" data-grow="1.6" style="position:absolute;left:${M}px;right:${M}px;top:${top + (st ? 260 : 210)}px;bottom:${bot + 80}px;font-size:100px;display:flex;flex-direction:column;gap:.18em;${zs('rows')}">${s.rows.map(r => `<div class="calbig"><b>${esc((r.d.match(/\d+/) || [''])[0])}</b><div><small>${esc(r.d.replace(/\d+/, '').trim())} · ${esc(r.w)}</small><span>${esc(r.e)}</span><small>${esc(r.a)} — ${esc(r.v)}</small></div></div>`).join('')}</div>${foot}`;
  }
  if (L === 'blocks') {
    // the month as a lineup: every night a label block, the artists under it
    return `${head}${month(st ? 112 : 96)}<div class="stack l main" style="left:${M}px;right:${M}px;top:${top + (st ? 300 : 250)}px">${Z('rows', s.rows.map(r => lb(`${r.d} — ${r.e}`, 't-l') + lb(`${r.a} · ${r.v}`, 't-s') + gap(18)).join(''))}</div>${foot}`;
  }
  if (L === 'grid') {
    // a month grid: seven columns, the nights filled in Lime
    const m = (s.rows[0]?.d || 'SEP').slice(0, 3).toUpperCase(), mi = Math.max(0, ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].indexOf(m));
    const y = new Date().getFullYear(), first = new Date(y, mi, 1).getDay(), days = new Date(y, mi + 1, 0).getDate();
    const on = new Map(s.rows.filter(r => r.d.toUpperCase().startsWith(m)).map(r => [+(r.d.match(/\d+/) || [0])[0], r]));
    const cells = Array.from({ length: first }, () => '<i></i>').join('') + Array.from({ length: days }, (_, i) => { const r = on.get(i + 1); return `<i class="${r ? 'on' : ''}"><b>${i + 1}</b>${r ? `<small>${esc(r.e)}</small>` : ''}</i>`; }).join('');
    return `${head}${month(st ? 112 : 96)}<div class="calgrid main" style="left:${M}px;right:${M}px;top:${top + (st ? 300 : 230)}px;${zs('rows')}"><div class="wd">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<span>${d}</span>`).join('')}</div><div class="cells">${cells}</div></div>
    <div class="cal main" style="top:${top + (st ? 1060 : 860)}px;font-size:.6em;${zs('rows')}">${s.rows.filter(r => on.has(+(r.d.match(/\d+/) || [0])[0])).slice(0, 2).map(r => `<div class="row" style="padding:12px 0"><div class="d" style="font-size:28px">${esc(r.d)}</div><div class="e" style="font-size:28px">${esc(r.e)}<small>${esc(r.a)}</small></div><div class="v">${esc(r.v)}</div></div>`).join('')}</div>${foot}`;
  }
  if (L === 'photo') {
    const ph = st ? 620 : 420;
    return `${head}<div class="photo" style="left:${M}px;right:${M}px;top:${top + 40}px;height:${ph}px"><img src="${photoSrc(s.photo)}" alt=""><div class="stack l" style="left:24px;right:24px;top:auto;bottom:24px">${Z('month', lb(s.month, '', 'font-size:64px;letter-spacing:-0.045em'))}</div></div>
    <div class="cal main" style="top:${top + ph + 70}px;${zs('rows')}">${s.rows.map(r => `<div class="row" style="padding:16px 0 18px"><div class="d" style="font-size:38px">${esc(r.d)}<small>${esc(r.w)}</small></div><div class="e" style="font-size:38px">${esc(r.e)}<small>${esc(r.a)}</small></div><div class="v">${esc(r.v)}</div></div>`).join('')}</div>${foot}`;
  }
  return `${head}
  <div class="stack l main" style="left:${M}px;right:${M}px;top:${top + 50}px">${Z('month', lb(s.month, '', `font-size:${st ? 112 : 96}px;letter-spacing:-0.045em`))}</div>
  <div class="cal main" style="top:${top + (st ? 400 : 320)}px;${zs('rows')}">${s.rows.map(r => `<div class="row"><div class="d">${esc(r.d)}<small>${esc(r.w)}</small></div><div class="e">${esc(r.e)}<small>${esc(r.a)}</small></div><div class="v">${esc(r.v)}</div></div>`).join('')}</div>
  ${foot}`;
}

function system(s) {
  const st = s.format === 'story', sq = s.format === 'square', top = st ? 250 : 56, bot = st ? 330 : 56;
  const ph = sq ? 300 : 360;
  return `<div style="position:absolute;left:56px;right:56px;top:${top}px;color:var(--meta)">${LOGO.wordmark}</div>
  <div class="photo" style="left:50%;top:${top + (sq ? 200 : 260)}px;width:${ph}px;height:${ph}px;transform:translateX(-50%)"><img src="${photoSrc(s.photo)}" alt=""><i style="position:absolute;right:${ph * .14}px;bottom:${ph * .2}px;width:${ph * .16}px;height:${ph * .16}px;background:var(--acc)"></i></div>
  <div style="position:absolute;left:0;right:0;top:${top + (sq ? 540 : 680)}px;display:flex;justify-content:center"><div class="log ${s.labels ? 'lbx' : ''}" style="padding:12px 20px">${s.log.map(l => esc(l).replace(/(OK|SYNCED|READY)/, '<span class="ok">$1</span>')).join('\n')}</div></div>
  <div style="position:absolute;left:0;right:0;bottom:${bot + 110}px;display:flex;justify-content:center">${techLabel(s)}</div>
  ${logoRow(s, bot)}`;
}

function hiring(s) {
  const st = s.format === 'story', top = st ? 250 : M, bot = st ? 330 : M, L = s.layout, W = fw(s), H = fh(s);
  const [w1, ...wr] = String(s.hireHead || 'NOW HIRING').split(' '), w2 = wr.join(' ');
  const applyL = `<div class="mono" style="font-size:20px;color:var(--meta);${zs('apply')}">Apply — ${esc(s.apply)}</div>`;
  const roles = (s.roles || [s.role]).filter(Boolean);
  if (L === 'statement') {
    // a full photo, the headline in label blocks, the roles under it; everything (logo too) on the left
    return `<div class="photo" style="inset:0"><img src="${photoSrc(s.photo)}" style="object-position:50% 50%" alt=""></div>
    <div class="shade" style="background:linear-gradient(180deg,rgba(20,20,26,.4),rgba(20,20,26,.1) 35%,rgba(20,20,26,.78))"></div>
    ${meta(`top:${top}px`, 'Minimal Effort', 'Crew')}
    <div class="stack l main" style="left:${M}px;right:${M}px;top:auto;bottom:${bot + 130}px">
      ${Z('words', lbs(s.hireHead, st ? 150 : 140, '', 'letter-spacing:-0.05em', 952, 'words'))}${gap(30)}
      ${Z('role', roles.map(r => lb(r, 't-m')).join(''))}${gap(22)}${applyL}
    </div>
    ${logoRow(s, bot, 'l')}`;
  }
  if (L === 'roles') {
    // the open roles as a numbered list, flush to the margins; logo on the left with the list
    return `${meta(`top:${top}px`, 'Minimal Effort', 'Open roles')}
    <div class="stack l main" style="left:${M}px;right:${M}px;top:${top + 70}px">${Z('words', lbs(s.hireHead, st ? 140 : 124, '', 'letter-spacing:-0.05em', 952, 'words'))}</div>
    <div class="cal roles" style="top:${top + (st ? 520 : 400)}px;${zs('role')}">${roles.map((r, i) => `<div class="row"><div class="d">0${i + 1}</div><div class="e">${esc(r)}</div><div class="v">Apply</div></div>`).join('')}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:${bot + 120}px">${applyL}</div>
    ${logoRow(s, bot, 'l')}`;
  }
  if (L === 'big') {
    // the headline as big as the post: one word per line, as wide as the margins
    return `${meta(`top:${top}px`, 'Minimal Effort', 'Crew')}<div class="rule" style="top:${top + 40}px"></div>
    <div class="stack l main" style="left:${M}px;right:${M}px;top:${top + 70}px">${String(s.hireHead).split(' ').map(w => `<div class="lbx" data-fit="w" data-grow="4" style="font-size:${180 * zk('words')}px;letter-spacing:-0.06em;white-space:nowrap">${esc(w)}</div>`).join('')}</div>
    <div class="stack l main" style="left:${M}px;right:${M}px;top:auto;bottom:${bot + 120}px">${Z('role', roles.map(r => lb(r, 't-m')).join(''))}${gap(18)}${applyL}</div>
    ${logoRow(s, bot, 'l')}`;
  }
  if (L === 'pass') {
    // a crew pass: the headline printed on a lanyard card
    const cw = st ? 760 : 640, ch = st ? 1040 : 860, cx = (W - cw) / 2, cy = st ? 420 : (H - ch) / 2 + 20;
    return `${meta(`top:${top}px`, 'Minimal Effort', 'Crew')}
    <div class="lanyard" style="left:${W / 2 - 40}px;top:0;height:${cy + 40}px"></div>
    <div class="pass main" style="left:${cx}px;top:${cy}px;width:${cw}px;height:${ch}px">
      <div class="pass-h"><span>CREW</span><span>ALL ACCESS</span></div><div class="pass-hole"></div>
      <div style="${zs('words')}">${String(s.hireHead).split(' ').map(w => `<div class="pass-w">${esc(w)}</div>`).join('')}</div>
      <div class="pass-r" style="${zs('role')}">${roles.slice(0, 4).map(r => `<span>${esc(r)}</span>`).join('')}</div>
      <div class="pass-f"><span class="pass-me">${LOGO['me-mark']}</span><span>${esc(s.apply)}</span></div>
    </div>`;
  }
  // object: a frame with all four sides; NOW sits flush in the top-left corner, HIRING flush under the right-hand line,
  // the object in the top-right cell, the role bottom-left; the logo on the left with the text
  const obj = OBJECTS[s.object] || s.object || OBJECTS.radio;
  const fT = top, fB = st ? bot + 110 : bot + 100, fH = H - fT - fB, vx = 0.42, hy = st ? .5 : .52;
  const wPx = 118 * zk('words');
  return `<div class="hframe" style="left:${M}px;right:${M}px;top:${fT}px;bottom:${fB}px;color:var(--meta)"><i class="t"></i><i class="b"></i><i class="l"></i><i class="r"></i><i class="v" style="left:${vx * 100}%"></i><i class="h" style="left:${vx * 100}%;top:${hy * 100}%"></i>
    <div class="hire-w2" style="left:0;top:0;font-size:${wPx}px">${lb(w1)}</div>
    ${w2 ? `<div class="hire-w2" style="right:0;top:calc(${hy * 100}% + 0px);font-size:${wPx}px">${lb(w2)}</div>` : ''}
    <div class="hire-o" style="left:calc(${vx * 100}% + 24px);right:24px;top:24px;height:calc(${hy * 100}% - 48px)"><img src="${obj}" alt=""></div>
    <div class="hire-t main" style="left:18px;width:calc(${vx * 100}% - 36px);bottom:18px;${zs('role')}"><b>${esc(s.role)}</b><span>${esc(s.hireBody)}</span></div>
    <div class="hire-a" style="left:calc(${vx * 100}% + 18px);right:18px;bottom:18px">${applyL}</div>
  </div>
  ${logoRow(s, bot, 'l')}`;
}

function highlight(s) {
  const ic = s.icon === 'maze-logo' ? `<div class="hl-ico" style="width:300px;height:300px">${LOGO['the-maze']}</div>` : (s.icon && s.icon !== 'none' ? `<div class="hl-ico">${icon(s.icon)}</div>` : '');
  return `<div class="hl-in"><div style="${zs('main')}">${ic || `<div class="hl-t">${esc(s.highlight).replace(/ /, '<br>')}</div>`}</div></div>`;
}

function cover(s) {
  // statements: five compositions — low (the original), centre, top, quote, split photo
  const st = s.format === 'story', top = st ? 250 : M, bot = st ? 330 : M, L = s.layout, H = fh(s);
  const px = s.statement.length > 34 ? 104 : 128;
  const words = Z('statement', lbs(s.statement, px, '', 'letter-spacing:-0.045em', 952, 'statement'));
  if (L === 'centre') return `${logoRow(s, 0, 'c', { top })}<div class="stack c main" style="left:${M}px;right:${M}px;top:0;bottom:0;justify-content:center">${words}</div>${meta(`top:auto;bottom:${bot}px`, esc(s.handle), esc(s.event))}`;
  if (L === 'top') return `<div class="stack l main" style="left:${M}px;right:${M}px;top:${top}px">${words}</div>${meta(`top:auto;bottom:${bot}px`, esc(s.handle), esc(s.event))}${logoRow(s, bot + 50, 'l')}`;
  if (L === 'quote') return `<div class="qmark" style="left:${M - 6}px;top:${top - 30}px">“</div><div class="stack l main" style="left:${M}px;right:${M}px;top:${top + 220}px">${words}${gap(30)}<div class="mono" style="font-size:22px;color:var(--meta)">— ${esc(s.by || 'Minimal Effort')}</div></div>${logoRow(s, bot, 'l')}`;
  if (L === 'split') return `<div class="photo" style="left:0;right:0;top:0;height:${H / 2}px"><img src="${photoSrc(s.photo)}" alt=""></div><div class="stack l main" style="left:${M}px;right:${M}px;top:${H / 2 + 40}px">${words}</div>${meta(`top:auto;bottom:${bot}px`, esc(s.handle), esc(s.event))}${logoRow(s, 0, 'r', { top })}`;
  return `${logoRow(s, 0, 'l', { top })}
  <div class="stack l main" style="left:${M}px;right:${M}px;top:auto;bottom:${bot + 60}px">${words}</div>
  ${meta(`top:auto;bottom:${bot}px`, esc(s.handle), esc(s.event))}`;
}

const RENDER = { lineup, maze, announce, giveaway, status, calendar, system, hiring, highlight, cover };
const isLight = c => { const h = String(c || '').replace('#', ''); if (h.length < 6) return false; const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); return (r * .299 + g * .587 + b * .114) > 160; };

// Build the artboard. opts.forExport swaps loops for their stills; opts.textOnly drops the background (overlay for video).
export function render(spec, opts = {}) {
  const s = { ...DEFAULT, ...spec };
  if (!TEMPLATES[s.template]) s.template = 'lineup';
  const T = TEMPLATES[s.template];
  if (!T.formats.includes(s.format)) s.format = T.formats[0];
  if (T.layouts && !T.layouts[s.layout]) s.layout = Object.keys(T.layouts)[0];
  if (s.template === 'hiring' && !spec.bg) s.bg = s.layout === 'statement' ? 'photo' : s.layout === 'roles' ? 'lilacsolid' : s.layout === 'big' ? 'midnight' : s.layout === 'pass' ? 'lilacsolid' : 'limesolid';
  if (s.template === 'hiring' && !spec.photo) s.photo = 'party-05';
  if (s.template === 'giveaway' && s.layout === 'ticket' && !spec.bg) s.bg = 'limesolid';
  if (s.template === 'maze' && !spec.bg) s.bg = 'maze';
  if (s.template === 'maze' && !spec.labels) s.labels = false;
  if (s.template === 'calendar' && BACKGROUNDS[s.bg]?.video && spec.shade === undefined) s.shade = 0.5;
  const ev = EVENTS[s.event];
  if (ev && s.template !== 'maze') for (const k of ['presenter', 'partner', 'presents', 'textColor', 'logoColor', 'accent']) if (spec[k] === undefined && ev[k] !== undefined) s[k] = ev[k];
  if (!spec.logos) s.logos = s.template === 'announce' ? [{ id: 'me-mark', pos: 'tl' }, ...(ev && s.event !== 'THE MAZE' ? ev.logos : [])]
    : s.template === 'maze' ? []
    : ['giveaway', 'hiring', 'calendar', 'cover', 'system'].includes(s.template) ? [{ id: 'me-mark' }] : (ev?.logos || DEFAULT.logos);
  const X = EXT[s.template];
  if (X) {
    const pre = X.preset(s) || {};
    for (const [k, v] of Object.entries(pre)) if (spec[k] === undefined || spec[k] === null || spec[k] === '') s[k] = v;
    if (!spec.logos) s.logos = [{ id: 'me-mark' }];
    if (!CW[s.cw]) s.cw = 'midnight';
    if (!s.shapes) s.shapes = [];
  }
  if (s.noLogo) s.logos = [];
  CUR = s; SP = +s.spacing || 1; M = Math.round(+s.margin || 64);
  if (X) return renderExt(s, opts);
  const b = s.template === 'maze' && s.bg === 'maze' ? { html: '', tone: MAZE[s.layout]?.ink ? 'light' : 'dark' } : background(s, opts), light = b.tone === 'light';
  const labelOn = s.labels && s.labelColor !== 'none';
  const label = labelOn ? s.labelColor : 'transparent';
  const ink = s.textColor || (labelOn ? (isLight(label) ? '#14141A' : '#F5F5F5') : (light ? '#14141A' : '#F5F5F5'));
  const metaC = light ? '#14141A' : '#F5F5F5';
  const logo = s.logoColor || metaC;
  const cls = ['ab', labelOn ? 'labels' : '', s.template === 'highlight' ? 'hl' : '', s.template === 'maze' && s.bg !== 'maze' ? 'mz-blur' : '', opts.textOnly ? 'no-bg' : ''].join(' ');
  const style = `--acc:${s.accent};--ink:${ink};--label:${label};--meta:${metaC};--logo:${logo};--m:${M}px;--oy:${+s.offsetY || 0}px;color:${ink}`;
  const an = s.anim && s.anim !== 'none' ? s.anim : '';
  return `<div class="${cls}${an ? ' an-' + an : ''}" data-format="${s.format}" data-template="${s.template}"${an ? ` data-anim="${an}"` : ''}${xtra(s)} style="${style}">${b.html}<div class="layer">${RENDER[s.template](s)}${placedLogos(s)}</div></div>`;
}

// extra label on any template (hydrate.js draws it in the post's own label style): spec.extra = "A TO Z", extraPos = top | bottom | tl | tr | bl | br
// extras = [{ t: "A TO Z", x, y, size: s|m|l|xl }]: free labels at x / y (the block's top-left, in post px), dragged in the builder
const xtra = s => (String(s.extra ?? '').trim() ? ` data-extra="${esc(String(s.extra).trim())}" data-extra-pos="${esc(s.extraPos || 'top')}"` : '')
  + ((s.extras || []).some(e => String(e?.t ?? '').trim()) ? ` data-xls="${esc(JSON.stringify(s.extras))}" data-xmain="${esc(s.artists?.[0]?.name || '')}"` : '');

// round 5 templates (compose.js): colourway, label style, font, shapes, effects, animation
function renderExt(s, opts) {
  const c = CW[s.cw], [W, H] = FORMATS[s.format], e = edges(s.format);
  const b = background(s, opts);
  const fg = s.textColor || c.fg, logo = s.logoColor || (b.tone === 'light' || s.bg === 'cw' && c.tone === 'light' ? '#14141A' : (s.bg === 'cw' ? c.fg : '#F5F5F5'));
  const vars = `--bgc:${c.bg};--fg:${fg};--blk:${c.blk};--btx:${c.btx};--acc:${c.acc};--shp:${s.shapeColor || c.shp};--b2:${c.b2};--a2:${s.accent2 || c.acc};--ink:${fg};--label:${c.blk};--meta:${fg};--logo:${logo};--m:${M}px;--oy:${+s.offsetY || 0}px;--sp:${SP};color:${fg}`;
  const ctx = { s, W, H, T: e.top, B: e.bottom, M, SP, zk, photoSrc, logoRow, photos: PHOTOS };
  const cls = ['ab', 'x5', 'ls-' + (s.ls || 'block'), 'ff-' + (s.font || 'normal'), s.anim && s.anim !== 'none' ? 'an-' + s.anim : '', opts.textOnly ? 'no-bg' : ''].join(' ');
  return `<div class="${cls}" data-format="${s.format}" data-template="${s.template}" data-layout="${s.layout}"${s.anim && s.anim !== 'none' ? ` data-anim="${s.anim}"` : ''}${xtra(s)} style="${vars}">${b.html}<div class="layer">${drawShapes(s.shapes, s, ctx)}${compose(s, ctx)}${placedLogos(s)}</div></div>`;
}

export function preview(spec, boxW, opts = {}) {
  const t = TEMPLATES[spec.template] ? spec.template : DEFAULT.template, f = spec.format || DEFAULT.format;
  const fmt = TEMPLATES[t].formats.includes(f) ? f : TEMPLATES[t].formats[0];
  const [w, h] = FORMATS[fmt]; const k = boxW / w;
  return `<div class="ab-fit" style="width:${boxW}px;height:${Math.round(h * k)}px;position:relative;overflow:hidden"><div style="transform:scale(${k});transform-origin:0 0;width:${w}px;height:${h}px">${render({ ...spec, format: fmt }, opts)}</div></div>`;
}
