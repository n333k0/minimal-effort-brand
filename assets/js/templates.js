// Minimal Effort template engine (round 4). One spec in, one artboard out (real export size).
// Used by the guidelines (index.html), the builder (builder.html) and the renderer (tools/render.mjs).
// Round 4: every text group has a size step (spec.size = { role: -2…+4 }), margins (spec.margin), spacing (spec.spacing) and a
// vertical nudge for the main text (spec.offsetY). Our marks are never boxed by default: they take the colour that reads on the
// background. Templates can have several compositions (TEMPLATES[t].layouts, picked with spec.layout).
import { LOGO, LOGO_META, ICON_RECTS } from './logos.js';

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
  dust: { label: 'Dust', family: 'Texture', still: 'assets/tex/dust.jpg', tone: 'dark' },
  toner: { label: 'Toner', family: 'Texture', still: 'assets/tex/toner.jpg', tone: 'dark' },
  midnight: { label: 'Midnight', family: 'Solid', color: '#14141A', tone: 'dark' },
  limesolid: { label: 'Lime', family: 'Solid', color: '#B4F152', tone: 'light' },
  lilacsolid: { label: 'Lilac', family: 'Solid', color: '#A79BEE', tone: 'light' },
  icesolid: { label: 'Ice', family: 'Solid', color: '#F5F6FC', tone: 'light' },
  photo: { label: 'Photo', family: 'Photo', photo: true, tone: 'dark' },
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
  orange: { label: 'Halloween orange', base: '#FF4A1A', blobs: ['#FFB23E', '#FF7D21', '#E5301A', '#FFC24A'], block: '#9A93E0', alt: null },
  violet: { label: 'Block party violet', base: '#5233C9', blobs: ['#8C6BF2', '#1E1550', '#A980F5', '#3A2A9A'], block: '#9A62E8', alt: '#0D0A18' },
  night: { label: 'Night lime', base: '#14141A', blobs: ['#2F4214', '#2C2560', '#4A3FA0', '#1B2A0E'], block: '#A79BEE', alt: null },
  ice: { label: 'Ice lilac', base: '#E6E8F5', blobs: ['#C9C2F6', '#F5F6FC', '#B9B0F0', '#DDE9C5'], block: '#A79BEE', alt: null, ink: '#14141A' },
};

export const TEMPLATES = {
  lineup: { label: 'Event flyer', formats: ['feed', 'story', 'square', 'landscape'], layouts: LAYOUTS },
  maze: { label: 'THE MAZE flyer', formats: ['feed', 'story', 'square', 'landscape'], layouts: Object.fromEntries(Object.entries(MAZE).map(([k, v]) => [k, v.label])) },
  announce: { label: 'Just announced', formats: ['feed', 'story'] },
  giveaway: { label: 'Ticket giveaway', formats: ['feed', 'story'], layouts: { window: 'Photo window', full: 'Full photo', ticket: 'Ticket' } },
  status: { label: 'Ticket messaging', formats: ['feed', 'story', 'square'], layouts: { low: 'Low', centre: 'Centred', band: 'Band' } },
  calendar: { label: 'Monthly calendar', formats: ['feed', 'story'] },
  system: { label: 'System poster', formats: ['feed', 'story', 'square'], hidden: true },
  hiring: { label: 'Now hiring', formats: ['feed', 'story'], layouts: { object: 'Object', statement: 'Statement', roles: 'Roles list' } },
  cover: { label: 'Statement / carousel', formats: ['feed', 'square', 'story'] },
  highlight: { label: 'Highlight cover', formats: ['story'] },
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
};

export const DEFAULT = {
  template: 'lineup', format: 'feed', layout: 'center', labels: true, bg: 'waves', photo: 'lee-burridge-1',
  accent: '#B4F152', labelColor: '#181D20', textColor: '', dust: false, shade: 0,
  logos: [{ id: 'origin-mark', scale: 1 }], logoSize: 62, logoLabel: false,
  size: {}, margin: 64, spacing: 1, offsetY: 0,
  event: 'SECOND WIND', presenter: 'MNML EFFRT', partner: 'SBCTLR', presents: 'PRESENTS',
  title: 'Second Wind', date: 'Jan 2', time: '6pm to 3am',
  artists: [{ name: 'LEE BURRIDGE' }, { name: 'RY X', note: '[DJ SET]' }, { name: 'JAMIIE' }],
  venue: ['613 Imperial Street', 'Arts District Los Angeles', 'Day to Night'],
  status: 'SOLD OUT', cta: 'Get tickets', handle: '@MINIMALEFFORTLA',
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
  subtitle: '', pill: 'IN ORDER OF APPEARANCE', seed: 7,
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
  else if (b.video && !forExport) inner = `<video src="${b.video}" poster="${b.still}" autoplay muted loop playsinline></video>`;
  else if (b.still) inner = `<img src="${b.still}" alt="">`;
  const sh = +s.shade || 0;
  const shade = sh ? `<div class="shade" style="background:linear-gradient(180deg,rgba(10,10,14,${sh}),rgba(10,10,14,${sh * .45}) 45%,rgba(10,10,14,${sh}))"></div>` : '';
  return { html: `<div class="bg" style="background:${b.color || '#14141A'}">${inner}</div>${shade}${s.dust ? '<div class="dust"></div>' : ''}`, tone: b.tone };
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
  for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) { const r = R(); if (on[y][x] && r < .3) on[y][x] = false; else if (!on[y][x] && r > .9) on[y][x] = true; }
  return { on, nx, ny, cx, cy };
}
function maze(s) {
  const W = fw(s), H = fh(s), ls = s.format === 'landscape', st = s.format === 'story', sq = s.format === 'square';
  const P = MAZE[s.layout] || MAZE.orange, c = 125;
  const ox = ls ? -10 : ((W / 2 - c / 2) % c) - c, oy = st ? -60 : -20;
  // the logo block: top centre (left middle on the landscape cover)
  const lx = ls ? 1 : Math.round((W / 2 - c / 2 - ox) / c), ly = ls ? Math.round((H / 2 - c / 2 - oy) / c) : (st ? 4 : 1);
  const g = mazeBlocks(W, H, c, +s.seed || 7);
  g.on[ly][lx] = true;
  let rects = '';
  const R = rng((+s.seed || 7) * 7 + 3);
  for (let y = 0; y < g.ny; y++) for (let x = 0; x < g.nx; x++) if (g.on[y][x]) { const alt = P.alt && R() < .18 && !(x === lx && y === ly); rects += `<rect x="${ox + x * c}" y="${oy + y * c}" width="${c + .5}" height="${c + .5}" fill="${alt ? P.alt : P.block}"${alt ? ' opacity=".9"' : ''}/>`; }
  // colour field: soft blobs (or the chosen photo / loop, blurred and tinted)
  const Rb = rng((+s.seed || 7) * 31 + 11);
  const blobs = P.blobs.map(col => `radial-gradient(${Math.round(260 + Rb() * 380)}px ${Math.round(220 + Rb() * 320)}px at ${Math.round(Rb() * 100)}% ${Math.round(Rb() * 100)}%, ${col}, transparent 70%)`).join(',');
  const own = s.bg === 'maze' || !BACKGROUNDS[s.bg];
  const field = `<div class="mz-field" style="background:${blobs},${P.base};${own ? '' : 'mix-blend-mode:color;opacity:.72'}"></div>`;
  const ink = s.textColor || P.ink || '#B4F152';
  const mz = Math.round(c * .78 * zk('mazelogo'));
  const logo = `<div class="mz-logo" style="left:${ox + lx * c + c / 2 - mz / 2}px;top:${oy + ly * c + c / 2 - mz / 2}px;width:${mz}px;height:${mz}px;color:${s.logoColor || ink}">${LOGO['the-maze']}</div>`;
  const names = s.artists.map(a => { const t = a.name + (a.note ? ' ' + a.note : ''); const base = ls ? 124 : sq ? 104 : 132, px = Math.min(base, (ls ? 1000 : W - 2 * M + 40) / (Math.max(4, t.length) * .6)); return `<div class="mz-n" style="font-size:${px.toFixed(1)}px">${esc(t)}</div>`; }).join('');
  const dateL = Z('date', `<div class="mz-mono" style="font-size:32px">${esc(s.date)},&nbsp;&nbsp;${esc(s.title)}</div>`);
  const sub = s.subtitle ? Z('subtitle', `<div class="mz-n" style="font-size:46px">${esc(s.subtitle)}</div>`) : '';
  const pill = s.pill ? Z('pill', `<div class="mz-pill">${esc(s.pill)}</div>`) : '';
  const [v0, ...vr] = s.venue.filter(Boolean);
  const ven = Z('venue', (v0 ? `<div class="mz-n" style="font-size:44px">${esc(v0)}</div>` : '') + vr.map(v => `<div class="mz-mono" style="font-size:21px;font-family:var(--disp);font-weight:700;letter-spacing:0">${esc(v)}</div>`).join(''));
  let text;
  if (ls) {
    text = `<div class="stack l main" style="left:385px;right:${M}px;top:96px">${dateL}${gap(18)}${sub}${Z('artists', names)}</div>
    <div class="stack l" style="left:385px;top:auto;bottom:${M + 20}px">${pill}</div>
    <div class="stack l" style="left:1010px;top:auto;bottom:${M + 6}px">${ven}</div>`;
  } else {
    const top = st ? 600 : sq ? 262 : 380;
    text = `<div class="stack c main" style="top:${top}px;padding:0 ${M - 24}px">${dateL}${gap(sub ? 10 : 22)}${sub}${gap(sub ? 18 : 0)}${Z('artists', names)}${gap(sq ? 26 : 44)}${pill}${gap(sq ? 30 : st ? 60 : 110)}${ven}</div>`;
  }
  return `<div class="mz">${own ? field : field}<svg class="mz-blocks" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${rects}</svg><div class="mz-grain"></div></div>${logo}<div class="mz-ink" style="color:${ink};--mzc:${ink}">${text}</div>`;
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
  const st = s.format === 'story', sq = s.format === 'square', top = st ? 250 : M, bot = st ? 330 : sq ? 56 : M, L = s.layout;
  const words = s.status.split(' '), big = words.length > 2 ? (sq ? 130 : 150) : (sq ? 170 : 200);
  const sold = /SOLD/.test(s.status), hasLogo = (s.logos || []).some(l => l && !l.pos);
  const ctaB = bot + (hasLogo ? (sq ? 100 : 120) : 0);
  const W = Z('status', words.map(w => `<div class="lbx" style="font-size:${big}px;letter-spacing:-0.05em">${esc(w)}</div>`).join(''));
  const T = Z('title', lb(s.title + '  ·  ' + s.date, 't-m'));
  const cta = `<div style="position:absolute;left:0;right:0;bottom:${ctaB}px;display:flex;justify-content:center"><span class="cta ${sold ? '' : 'acc'}" style="${zs('cta')}">${esc(sold ? 'Join the waitlist' : s.cta)} ${ARROW}</span></div>`;
  const head = `${meta(`top:${top}px`, esc(s.event), `${esc(s.date)} · ${esc(s.time)}`)}<div class="rule" style="top:${top + 40}px"></div>`;
  if (L === 'band') {
    // one Lime band across the middle carries the message
    return `${head}<div class="band main" style="top:50%;transform:translateY(-50%)"><div class="stack c" style="position:relative">${Z('status', lb(s.status, '', `font-size:${big * .62}px;letter-spacing:-0.05em`))}</div></div>
    <div class="stack c" style="top:calc(50% + ${big * .5}px);padding:0 ${M}px">${T}</div>${cta}${logoRow(s, bot)}`;
  }
  const just = L === 'centre' ? 'center' : 'flex-end';
  return `${head}
  <div class="stack c main" style="top:${top + 60}px;bottom:${ctaB + 110}px;justify-content:${just}">${W}${T}</div>
  ${cta}
  ${logoRow(s, bot)}`;
}

function calendar(s) {
  const st = s.format === 'story', top = st ? 250 : M, bot = st ? 330 : M;
  return `${meta(`top:${top}px`, 'Minimal Effort', 'Calendar')}
  <div class="stack l main" style="left:${M}px;right:${M}px;top:${top + 50}px">${Z('month', lb(s.month, '', `font-size:${st ? 112 : 96}px;letter-spacing:-0.045em`))}</div>
  <div class="cal main" style="top:${top + (st ? 400 : 320)}px;${zs('rows')}">${s.rows.map(r => `<div class="row"><div class="d">${esc(r.d)}<small>${esc(r.w)}</small></div><div class="e">${esc(r.e)}<small>${esc(r.a)}</small></div><div class="v">${esc(r.v)}</div></div>`).join('')}</div>
  ${meta(`bottom:${bot + 10}px;top:auto;align-items:flex-end`, `${esc(s.cta)} — link in bio`)}
  ${logoRow(s, bot, 'r')}`;
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
  const st = s.format === 'story', top = st ? 250 : M, bot = st ? 330 : M, L = s.layout;
  const [w1, ...wr] = String(s.hireHead || 'NOW HIRING').split(' '), w2 = wr.join(' ');
  const applyL = `<div class="mono" style="font-size:20px;color:var(--meta);${zs('apply')}">Apply — ${esc(s.apply)}</div>`;
  if (L === 'statement') {
    // a full photo, the headline in label blocks, the roles under it
    return `<div class="photo" style="inset:0"><img src="${photoSrc(s.photo)}" style="object-position:50% 50%" alt=""></div>
    <div class="shade" style="background:linear-gradient(180deg,rgba(20,20,26,.4),rgba(20,20,26,.1) 35%,rgba(20,20,26,.78))"></div>
    ${meta(`top:${top}px`, 'Minimal Effort', 'Crew')}
    <div class="stack l main" style="left:${M}px;right:${M}px;top:auto;bottom:${bot + 130}px">
      ${Z('words', lbs(s.hireHead, st ? 150 : 140, '', 'letter-spacing:-0.05em', 952, 'words'))}${gap(30)}
      ${Z('role', (s.roles || [s.role]).filter(Boolean).map(r => lb(r, 't-m')).join(''))}${gap(22)}${applyL}
    </div>
    ${logoRow(s, bot)}`;
  }
  if (L === 'roles') {
    // the open roles as a numbered list
    return `${meta(`top:${top}px`, 'Minimal Effort', 'Open roles')}
    <div class="stack l main" style="left:${M}px;right:${M}px;top:${top + 70}px">${Z('words', lbs(s.hireHead, st ? 140 : 124, '', 'letter-spacing:-0.05em', 952, 'words'))}</div>
    <div class="cal roles" style="top:${top + (st ? 520 : 400)}px;${zs('role')}">${(s.roles || [s.role]).filter(Boolean).map((r, i) => `<div class="row"><div class="d">0${i + 1}</div><div class="e">${esc(r)}</div><div class="v">Apply</div></div>`).join('')}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:${bot + 120}px;text-align:center">${applyL}</div>
    ${logoRow(s, bot)}`;
  }
  const obj = OBJECTS[s.object] || s.object || OBJECTS.radio;
  return `<div class="grid-lines" style="color:var(--meta)"><i style="left:0;right:0;top:0;height:2px"></i><i style="left:0;right:0;bottom:0;height:2px"></i><i style="left:42%;top:0;bottom:0;width:2px"></i><i style="left:42%;right:0;top:46%;height:2px"></i></div>
  <div class="hire-w" style="left:${M + 12}px;top:${top + 20}px;${zs('words')}">${lb(w1)}</div>
  <div class="photo" style="left:42%;right:${M}px;top:${top}px;height:${st ? 760 : 520}px;background:none"><img src="${obj}" style="object-fit:contain" alt=""></div>
  ${w2 ? `<div class="hire-w" style="right:${M + 12}px;top:${st ? 1080 : 640}px;${zs('words')}">${lb(w2)}</div>` : ''}
  <div class="main" style="position:absolute;left:${M}px;right:${M}px;top:${st ? 1260 : 820}px;text-align:center;font:500 28px/1.35 var(--mono);text-transform:uppercase;color:var(--meta);${zs('role')}">${esc(s.role)}<br><span style="opacity:.8;font-size:22px">${esc(s.hireBody)}</span></div>
  <div style="position:absolute;left:0;right:0;bottom:${bot + 110}px;display:flex;justify-content:center">${applyL}</div>
  ${logoRow(s, bot)}`;
}

function highlight(s) {
  const ic = s.icon === 'maze-logo' ? `<div class="hl-ico" style="width:300px;height:300px">${LOGO['the-maze']}</div>` : (s.icon && s.icon !== 'none' ? `<div class="hl-ico">${icon(s.icon)}</div>` : '');
  return `<div class="hl-in"><div style="${zs('main')}">${ic || `<div class="hl-t">${esc(s.highlight).replace(/ /, '<br>')}</div>`}</div></div>`;
}

function cover(s) {
  const st = s.format === 'story', top = st ? 250 : M, bot = st ? 330 : M;
  return `${logoRow(s, 0, 'l', { top })}
  <div class="stack l main" style="left:${M}px;right:${M}px;top:auto;bottom:${bot + 60}px">${Z('statement', lbs(s.statement, s.statement.length > 34 ? 104 : 128, '', 'letter-spacing:-0.045em', 952, 'statement'))}</div>
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
  if (s.template === 'hiring' && !spec.bg) s.bg = s.layout === 'statement' ? 'photo' : s.layout === 'roles' ? 'lilacsolid' : 'limesolid';
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
  CUR = s; SP = +s.spacing || 1; M = Math.round(+s.margin || 64);
  const b = s.template === 'maze' && s.bg === 'maze' ? { html: '', tone: MAZE[s.layout]?.ink ? 'light' : 'dark' } : background(s, opts), light = b.tone === 'light';
  const labelOn = s.labels && s.labelColor !== 'none';
  const label = labelOn ? s.labelColor : 'transparent';
  const ink = s.textColor || (labelOn ? (isLight(label) ? '#14141A' : '#F5F5F5') : (light ? '#14141A' : '#F5F5F5'));
  const metaC = light ? '#14141A' : '#F5F5F5';
  const logo = s.logoColor || metaC;
  const cls = ['ab', labelOn ? 'labels' : '', s.template === 'highlight' ? 'hl' : '', s.template === 'maze' && s.bg !== 'maze' ? 'mz-blur' : '', opts.textOnly ? 'no-bg' : ''].join(' ');
  const style = `--acc:${s.accent};--ink:${ink};--label:${label};--meta:${metaC};--logo:${logo};--m:${M}px;--oy:${+s.offsetY || 0}px;color:${ink}`;
  return `<div class="${cls}" data-format="${s.format}" data-template="${s.template}" style="${style}">${b.html}<div class="layer">${RENDER[s.template](s)}${placedLogos(s)}</div></div>`;
}

export function preview(spec, boxW, opts = {}) {
  const t = TEMPLATES[spec.template] ? spec.template : DEFAULT.template, f = spec.format || DEFAULT.format;
  const fmt = TEMPLATES[t].formats.includes(f) ? f : TEMPLATES[t].formats[0];
  const [w, h] = FORMATS[fmt]; const k = boxW / w;
  return `<div class="ab-fit" style="width:${boxW}px;height:${Math.round(h * k)}px;position:relative;overflow:hidden"><div style="transform:scale(${k});transform-origin:0 0;width:${w}px;height:${h}px">${render({ ...spec, format: fmt }, opts)}</div></div>`;
}
