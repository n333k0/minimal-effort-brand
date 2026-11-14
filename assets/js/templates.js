// Minimal Effort template engine (round 3). One spec in, one artboard out (real export size).
// Used by the guidelines (index.html), the builder (builder.html) and the renderer (tools/render.mjs).
import { LOGO, LOGO_META, ICON_RECTS } from './logos.js';

export const FORMATS = { feed: [1080, 1350], story: [1080, 1920], square: [1080, 1080], landscape: [1920, 1080] };

// Backgrounds — one family, "liquid light": CHROME (liquid iridescent forms), PRISM (spectrum light), FILM (analog leaks),
// and BRAND LIGHT (Lilac, Lime, the two together). 3 Prism · 3 Film · 3 Brand light, plus 5 Chrome. All loops are 9–10 s and end on their first frame. Plus textures, solids, photo, custom.
const V = (id, label, family, tone = 'dark') => ({ label, family, tone, video: `assets/video/${id}.mp4`, still: `assets/video/${id}.jpg`, loop: id });
export const BACKGROUNDS = {
  waves: V('bg01-waves', 'Waves', 'Chrome'), bluewaves: V('bg03-bluewaves', 'Blue waves', 'Chrome'), bubbles: V('bg07-chrome-bubbles', 'Bubbles', 'Chrome'),
  ribbon: V('bg08-chrome-ribbon', 'Ribbon', 'Chrome'), flow: V('bg09-chrome-flow', 'Flow', 'Chrome'),
  rainbow: V('bg02-rainbow', 'Rainbow', 'Prism'), spectrum: V('bg04-spectrum', 'Spectrum', 'Prism'), bloom: V('bg10-prism-bloom', 'Bloom', 'Prism'),
  holo: V('bg11-holo-film', 'Holo film', 'Film'), leak: V('bg12-film-leak', 'Film leak', 'Film'), ember: V('bg13-film-ember', 'Ember', 'Film'),
  lilac: V('bg05-lilac', 'Lilac beam', 'Brand light'), lime: V('bg06-lime', 'Lime field', 'Brand light', 'light'), glow: V('bg14-brand-glow', 'Lilac × Lime glow', 'Brand light', 'light'),
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

// Events: picking one sets the logo row and the accent. Logos can still be changed freely.
export const EVENTS = {
  'SECOND WIND': { accent: '#B4F152', logos: [{ id: 'origin-mark' }], presenter: 'MNML EFFRT', partner: 'SBCTLR', presents: 'PRESENTS', textColor: '', logoColor: '' },
  'THE MAZE': { accent: '#B4F152', logos: [{ id: 'the-maze', pos: 'tc', scale: 1.5 }, { id: 'me-mark' }], presenter: 'THE MAZE', partner: '', presents: 'PRESENTS', textColor: '#B4F152', logoColor: '#B4F152' },
};
export const LABEL_COLORS = { Black: '#181D20', Lime: '#B4F152', Lilac: '#A79BEE', Ice: '#F5F6FC', None: 'none' };
export const TEXT_COLORS = { White: '#F5F5F5', Midnight: '#14141A', Lime: '#B4F152', Lilac: '#A79BEE' };

export const TEMPLATES = {
  lineup: { label: 'Event flyer', formats: ['feed', 'story', 'square', 'landscape'] },
  announce: { label: 'Just announced', formats: ['feed', 'story'] },
  giveaway: { label: 'Ticket giveaway', formats: ['feed', 'story'] },
  status: { label: 'Ticket messaging', formats: ['feed', 'story', 'square'] },
  calendar: { label: 'Monthly calendar', formats: ['feed', 'story'] },
  system: { label: 'System poster', formats: ['feed', 'story', 'square'], hidden: true },
  hiring: { label: 'Now hiring', formats: ['feed', 'story'] },
  cover: { label: 'Statement / carousel', formats: ['feed', 'square', 'story'] },
  highlight: { label: 'Highlight cover', formats: ['story'] },
};
export const LAYOUTS = { center: 'A · Centred', header: 'B · Header', left: 'C · Left', headliner: 'D · Headliner', split: 'E · Split', bottom: 'F · Bottom' };

export const DEFAULT = {
  template: 'lineup', format: 'feed', layout: 'center', labels: true, bg: 'waves', photo: 'lee-burridge-1',
  accent: '#B4F152', labelColor: '#181D20', textColor: '', dust: false, shade: 0,
  logos: [{ id: 'origin-mark', scale: 1 }], logoSize: 62, logoLabel: true,
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
  role: 'Production assistant', hireBody: 'Load-in, artist care and the details nobody sees.', apply: 'jobs@minimaleffort.com',
  highlight: 'ARTISTS', icon: 'artists', logoColor: '',
  statement: 'A different kind of front row.',
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

// ---------------------------------------------------------------- logos: optical sizing
// Every logo gets the same visual area (size²), corrected by a weight for how dense it reads; scale is the user's override.
const WEIGHT = { 'me-mark': .78, 'mnml-effrt': 1, 'mnml-effrt-square': 1, wordmark: 1, lockup: .9, 'the-maze': .95, 'origin-mark': 1.05, origin: 1, sbcltr: 1.15, 'lee-burridge': .95 };
export function logoBox(l, size) {
  const a = l.aspect || LOGO_META[l.id]?.aspect || 1, k = (l.scale ?? 1) * (WEIGHT[l.id] ?? 1);
  return [size * Math.sqrt(a) * k, size / Math.sqrt(a) * k];
}
// Our marks (ME, MNML EFFRT, MINIMAL EFFORT) sit on a tight black box; venue / partner / event logos (ORIGIN, THE MAZE,
// SBCLTR...) are plain, never boxed. A logo with "pos" (tl tc tr bl bc br) is placed there; the rest go in the template's row.
const OURS = new Set(['me-mark', 'mnml-effrt', 'mnml-effrt-square', 'wordmark', 'lockup']);
function logoItems(s, list, size) {
  return list.map(l => {
    const [w, h] = logoBox(l, size);
    const inner = l.src ? `<img src="${l.src}" alt="">` : (LOGO[l.id] || '');
    const boxed = s.logoLabel !== false && (l.box ?? OURS.has(l.id));
    const pad = boxed ? `padding:${Math.round(h * .24)}px ${Math.round(h * .26)}px` : '';
    return `<span class="lg-w${boxed ? ' boxed' : ''}" style="${pad}"><span class="lg-i" style="width:${w.toFixed(1)}px;height:${h.toFixed(1)}px">${inner}</span></span>`;
  }).join('');
}
const edges = f => ({ top: f === 'story' ? 250 : f === 'landscape' ? 56 : 64, bottom: f === 'story' ? 330 : (f === 'square' || f === 'landscape') ? 56 : 64 });
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
const H = f => FORMATS[f][1];
export function wrapText(t, max) {
  const out = []; let cur = '';
  for (const w of String(t ?? '').split(/\s+/).filter(Boolean)) { if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; }
  if (cur) out.push(cur); return out;
}
// chars that fit a width at a font size (ABC Normal Heavy averages ~.56em a character)
const fit = (px, width = 952) => Math.max(6, Math.floor(width / (px * .56)));
const lbs = (t, px, cls = '', style = '', width) => wrapText(t, fit(px, width)).map(l => lb(l, cls, `font-size:${px}px;${style}`)).join('');
const pres = s => `<div class="lbx t-l" style="white-space:nowrap">${esc(s.presenter)}${s.partner ? `<span class="x">${X_SVG}</span>${esc(s.partner)}` : ''}</div>`;
const arts = (s, big = 't-xl', small = 't-s') => s.artists.map(a => lb(a.name, big) + (a.note ? lb(a.note, small) : '')).join('');
const venue = s => s.venue.filter(Boolean).map(v => lb(v, 't-v')).join('');
const gap = h => `<div style="height:${h}px;flex:none"></div>`;
const techLabel = s => `<div class="tl"><div class="glb">${GLOBE}</div><div><small>Event</small><b>${esc(s.title)}</b></div><div><small>Date</small><b>${esc(s.date)}</b></div><div><small>Time</small><b>${esc(s.time)}</b></div><div class="bar"></div></div>`;

// ---------------------------------------------------------------- templates
function lineup(s) {
  const st = s.format === 'story', ls = s.format === 'landscape', sq = s.format === 'square' || ls, L = s.layout;
  const k = sq ? .82 : 1, z = st ? 'transform:scale(1.2);transform-origin:50% 0;' : '';
  const bottom = edges(s.format).bottom;
  let html = '';
  const dateLine = `${s.date}  –  ${s.time}`;
  if (L === 'header') {
    const hs = Math.min(98, Math.round(1480 / Math.max(10, (s.presenter + s.partner).length + 3)));
    html += `<div class="wide" style="top:${st ? 260 : 40}px;font-size:${hs}px;letter-spacing:-0.035em;line-height:1.02;justify-content:${s.partner ? 'space-between' : 'center'}"><span class="lbx">${esc(s.presenter)}</span>${s.partner ? `<span class="x" style="width:${hs * .62}px;height:${hs * .62}px;margin:0">${X_SVG}</span><span class="lbx">${esc(s.partner)}</span>` : ''}</div>`;
    html += `<div class="stack c" style="top:${st ? 600 : sq ? 250 : 380}px;padding:0 40px;${z}">${lb(s.title, 't-m')}${lb(dateLine, 't-s')}${gap(88 * k)}${arts(s)}${gap(88 * k)}${venue(s)}</div>`;
    html += logoRow(s, bottom);
  } else if (L === 'headliner') {
    const [head, ...rest] = s.artists;
    html += `<div class="stack c" style="top:${st ? 470 : sq ? 110 : 230}px;padding:0 40px;${z}">${pres(s)}${s.presents ? lb(s.presents, 't-xs') : ''}${gap(60 * k)}${lbs(head?.name || '', 150, '', 'line-height:.92;letter-spacing:-0.045em', 900)}${head?.note ? lb(head.note, 't-s') : ''}${gap(40 * k)}${rest.map(a => lb(a.name + (a.note ? ' ' + a.note : ''), 't-l')).join('')}${gap(70 * k)}${lb(s.title, 't-m')}${lb(dateLine, 't-s')}${gap(36)}${venue(s)}</div>`;
    html += logoRow(s, bottom);
  } else if (L === 'split') {
    const top = st ? 300 : sq ? 64 : 120;
    html += `<div class="stack l" style="top:${top}px;left:64px;right:auto;width:440px">${pres(s)}${s.presents ? lb(s.presents, 't-xs') : ''}${gap(56)}${lb(s.title, 't-m')}${lb(dateLine, 't-s')}${gap(56)}${venue(s)}</div>`;
    html += `<div class="stack r" style="top:${top + (sq ? 300 : 420)}px;right:64px;left:auto;width:620px">${s.artists.map(a => lb(a.name, 't-xl') + (a.note ? lb(a.note, 't-s') : '')).join('')}</div>`;
    html += logoRow(s, bottom, 'l');
  } else if (L === 'bottom') {
    html += `<div class="stack l" style="top:auto;bottom:${bottom + 130}px;padding:0 64px">${pres(s)}${s.presents ? lb(s.presents, 't-xs') : ''}${gap(40)}${arts(s)}${gap(40)}${lb(s.title + '  ·  ' + dateLine, 't-s')}${venue(s)}</div>`;
    html += logoRow(s, bottom, 'l');
  } else {
    const align = L === 'left' ? 'l' : 'c', pad = L === 'left' ? 'padding:0 64px' : 'padding:0 40px';
    const tl = (s.logos || []).some(l => l && /^t/.test(l.pos || '')), top = st ? 470 : ls ? (tl ? 190 : 96) : sq ? (tl ? 210 : 120) : (tl ? 330 : 300);
    const zz = st ? `transform:scale(1.2);transform-origin:${L === 'left' ? '64px' : '50%'} 0;` : '';
    html += `<div class="stack ${align}" style="top:${top}px;${pad};${zz}">${pres(s)}${s.presents ? lb(s.presents, 't-xs') : ''}${gap(44 * k)}${lb(s.title, 't-m')}${lb(dateLine, 't-s')}${gap(88 * k)}${arts(s)}${gap(88 * k)}${venue(s)}</div>`;
    html += logoRow(s, bottom, align);
  }
  return html;
}

function announce(s) {
  const st = s.format === 'story', a = s.artists[0] || { name: 'ARTIST' }, bot = st ? 330 : 64;
  const big = a.name.length > 9 ? 132 : 150;
  return `<div class="photo" style="inset:0"><img src="${photoSrc(s.photo)}" alt=""></div>
  <div class="shade" style="background:linear-gradient(180deg,rgba(20,20,26,.35),rgba(20,20,26,0) 22%,rgba(20,20,26,0) 46%,rgba(20,20,26,.82))"></div>
  ${logoRow(s, bot, 'r')}
  <div class="stack l" style="left:64px;right:300px;bottom:${bot}px;top:auto">
    ${s.presenter ? lb(s.presenter + (s.partner ? ' × ' + s.partner : '') + (s.presents ? ' ' + s.presents.toLowerCase() : ''), 't-xs') : ''}
    ${lb(s.title, 't-m')}
    ${lbs(a.name, big, '', 'line-height:.98;letter-spacing:-0.045em', 820)}
    ${a.note ? lb(a.note, 't-s') : ''}
    ${lb(s.date + '  –  ' + s.time, 't-m')}
    ${s.venue.filter(Boolean).slice(0, 3).map(v => lb(v, 't-v')).join('')}
  </div>`;
}

function giveaway(s) {
  const st = s.format === 'story', top = st ? 250 : 64, bot = st ? 330 : 64;
  const px = st ? 120 : 108;
  const prize = wrapText(s.prize, fit(px)).map(l => `<div class="lbx" style="font-size:${px}px;line-height:1;letter-spacing:-0.045em">${esc(l).replace(/\s*×\s*/, ' <span class="acc">×</span> ')}</div>`).join('');
  return `<div class="meta" style="top:${top}px"><span>${esc(s.event)} · ${esc(s.date)}</span><span>Giveaway</span></div>
  <div class="rule" style="top:${top + 50}px"></div>
  <div class="photo" style="left:64px;right:64px;top:${top + 84}px;height:${st ? 720 : 520}px"><img src="${photoSrc(s.photo)}" alt=""></div>
  <div class="stack l" style="left:64px;right:64px;top:${top + (st ? 850 : 640)}px">
    ${prize}
    ${gap(28)}${s.steps.map((t, i) => `<div class="lbx mono" style="font-size:26px;line-height:1.55"><span class="acc">0${i + 1}</span>&nbsp;&nbsp;${esc(t)}</div>`).join('')}
    ${gap(18)}<div class="mono" style="font-size:20px;color:var(--meta);opacity:.85">${esc(s.deadline)}</div>
  </div>
  ${logoRow(s, bot, 'l')}`;
}

function status(s) {
  const st = s.format === 'story', sq = s.format === 'square', top = st ? 250 : 64, bot = st ? 330 : sq ? 56 : 64;
  const words = s.status.split(' '), big = words.length > 2 ? (sq ? 130 : 150) : (sq ? 170 : 200);
  const sold = /SOLD/.test(s.status), hasLogo = (s.logos || []).some(l => l && !l.pos);
  const ctaB = bot + (hasLogo ? (sq ? 100 : 120) : 0);
  return `<div class="meta" style="top:${top}px"><span>${esc(s.event)}</span><span>${esc(s.date)} · ${esc(s.time)}</span></div>
  <div class="rule" style="top:${top + 50}px"></div>
  <div class="stack c" style="top:${top + 60}px;bottom:${ctaB + 84}px;justify-content:center">${words.map(w => `<div class="lbx" style="font-size:${big}px;line-height:.98;letter-spacing:-0.05em">${esc(w)}</div>`).join('')}${lb(s.title + '  ·  ' + s.date, 't-m')}</div>
  <div style="position:absolute;left:0;right:0;bottom:${ctaB}px;display:flex;justify-content:center"><span class="cta ${sold ? '' : 'acc'}">${esc(sold ? 'Join the waitlist' : s.cta)} ${ARROW}</span></div>
  ${logoRow(s, bot)}`;
}

function calendar(s) {
  const st = s.format === 'story', top = st ? 250 : 64, bot = st ? 330 : 64;
  return `<div class="meta" style="top:${top}px"><span>Minimal Effort</span><span>Calendar</span></div>
  <div class="stack l" style="left:64px;right:64px;top:${top + 60}px">${lb(s.month, '', `font-size:${st ? 112 : 96}px;line-height:1;letter-spacing:-0.045em`)}</div>
  <div class="cal" style="top:${top + (st ? 400 : 320)}px">${s.rows.map(r => `<div class="row"><div class="d">${esc(r.d)}<small>${esc(r.w)}</small></div><div class="e">${esc(r.e)}<small>${esc(r.a)}</small></div><div class="v">${esc(r.v)}</div></div>`).join('')}</div>
  <div class="meta" style="bottom:${bot + 10}px;top:auto;align-items:flex-end"><span>${esc(s.cta)} — link in bio</span></div>
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
  const st = s.format === 'story', top = st ? 250 : 64, bot = st ? 330 : 64;
  return `<div class="grid-lines" style="color:var(--meta)"><i style="left:0;right:0;top:0;height:2px"></i><i style="left:0;right:0;bottom:0;height:2px"></i><i style="left:42%;top:0;bottom:0;width:2px"></i><i style="left:42%;right:0;top:46%;height:2px"></i></div>
  <div class="hire-w" style="left:76px;top:${top + 20}px">${lb('NOW')}</div>
  <div class="photo" style="left:42%;right:64px;top:${top}px;height:${st ? 760 : 520}px;background:none"><img src="assets/mock/hiring-object.jpg" style="object-fit:contain;mix-blend-mode:multiply" alt=""></div>
  <div class="hire-w" style="right:76px;top:${st ? 1080 : 640}px">${lb('HIRING')}</div>
  <div style="position:absolute;left:64px;right:64px;top:${st ? 1260 : 820}px;text-align:center;font:500 28px/1.35 var(--mono);text-transform:uppercase;color:var(--meta)">${esc(s.role)}<br><span style="opacity:.8;font-size:22px">${esc(s.hireBody)}</span></div>
  <div style="position:absolute;left:0;right:0;bottom:${bot + 110}px;text-align:center;font:500 22px/1.4 var(--mono);text-transform:uppercase;color:var(--meta)">Apply — ${esc(s.apply)}</div>
  ${logoRow(s, bot)}`;
}

function highlight(s) {
  const ic = s.icon === 'maze-logo' ? `<div class="hl-ico" style="width:300px;height:300px">${LOGO['the-maze']}</div>` : (s.icon && s.icon !== 'none' ? `<div class="hl-ico">${icon(s.icon)}</div>` : '');
  return `<div class="hl-in">${ic || `<div class="hl-t">${esc(s.highlight).replace(/ /, '<br>')}</div>`}</div>`;
}

function cover(s) {
  const st = s.format === 'story', top = st ? 250 : 64, bot = st ? 330 : 64;
  return `${logoRow(s, 0, 'l', { top })}
  <div class="stack l" style="left:64px;right:64px;top:auto;bottom:${bot + 80}px">${lbs(s.statement, s.statement.length > 34 ? 104 : 128, '', 'line-height:1;letter-spacing:-0.045em')}</div>
  <div class="meta" style="top:auto;bottom:${bot}px"><span>${esc(s.handle)}</span><span>${esc(s.event)}</span></div>`;
}

const R = { lineup, announce, giveaway, status, calendar, system, hiring, highlight, cover };
const isLight = c => { const h = String(c || '').replace('#', ''); if (h.length < 6) return false; const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); return (r * .299 + g * .587 + b * .114) > 160; };

// Build the artboard. opts.forExport swaps loops for their stills; opts.textOnly drops the background (overlay for video).
export function render(spec, opts = {}) {
  const s = { ...DEFAULT, ...spec };
  if (!TEMPLATES[s.template]) s.template = 'lineup';
  if (!TEMPLATES[s.template].formats.includes(s.format)) s.format = TEMPLATES[s.template].formats[0];
  if (s.template === 'hiring' && !spec.bg) s.bg = 'limesolid';
  if (s.template === 'hiring' && !spec.photo) s.photo = 'party-01';
  if (s.template === 'calendar' && BACKGROUNDS[s.bg]?.video && spec.shade === undefined) s.shade = 0.5;
  const ev = EVENTS[s.event];
  if (ev) for (const k of ['presenter', 'partner', 'presents', 'textColor', 'logoColor', 'accent']) if (spec[k] === undefined && ev[k] !== undefined) s[k] = ev[k];
  if (!spec.logos) s.logos = s.template === 'announce' ? [{ id: 'me-mark', pos: 'tl' }, ...(ev && s.event !== 'THE MAZE' ? ev.logos : [])]
    : ['giveaway', 'hiring', 'calendar', 'cover', 'system'].includes(s.template) ? [{ id: 'me-mark' }] : (ev?.logos || DEFAULT.logos);
  const bg = background(s, opts), light = bg.tone === 'light';
  const labelOn = s.labels && s.labelColor !== 'none';
  const label = labelOn ? s.labelColor : 'transparent';
  const ink = s.textColor || (labelOn ? (isLight(label) ? '#14141A' : '#F5F5F5') : (light ? '#14141A' : '#F5F5F5'));
  const meta = light ? '#14141A' : '#F5F5F5';
  const logo = s.logoColor || meta;
  const cls = ['ab', labelOn ? 'labels' : '', s.template === 'highlight' ? 'hl' : '', opts.textOnly ? 'no-bg' : ''].join(' ');
  const style = `--acc:${s.accent};--ink:${ink};--label:${label};--meta:${meta};--logo:${logo};color:${ink}`;
  return `<div class="${cls}" data-format="${s.format}" data-template="${s.template}" style="${style}">${bg.html}<div class="layer">${R[s.template](s)}${placedLogos(s)}</div></div>`;
}

export function preview(spec, boxW, opts = {}) {
  const t = TEMPLATES[spec.template] ? spec.template : DEFAULT.template, f = spec.format || DEFAULT.format;
  const fmt = TEMPLATES[t].formats.includes(f) ? f : TEMPLATES[t].formats[0];
  const [w, h] = FORMATS[fmt]; const k = boxW / w;
  return `<div class="ab-fit" style="width:${boxW}px;height:${Math.round(h * k)}px;position:relative;overflow:hidden"><div style="transform:scale(${k});transform-origin:0 0;width:${w}px;height:${h}px">${render({ ...spec, format: fmt }, opts)}</div></div>`;
}
