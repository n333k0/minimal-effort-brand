// Minimal Effort guidelines v2: builds the data-driven sections (technical labels, icons, compositions, loops, templates,
// highlights, feed) from templates.js and tools/examples/templates.json. Template previews carry data-tpl, which
// site.js draws (and redraws on resize). Every block checks that its container exists, so other pages can import this.
import { preview, icon, ICONS, LAYOUTS, BACKGROUNDS, LOGO } from './templates.js';

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const attr = o => JSON.stringify(o).replace(/'/g, '&#39;');
const slug = s => s.toLowerCase().replace(/\s+/g, '-');
const GLOBE = '<svg viewBox="0 0 60 34" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="30" cy="17" rx="28" ry="15"/><ellipse cx="30" cy="17" rx="12" ry="15"/><path d="M2 17h56M6 9h48M6 25h48"/></svg>';
const corners = '<i class="cnr a"></i><i class="cnr b"></i><i class="cnr c"></i><i class="cnr d"></i>';

/* ---------------- technical labels (molecules) on black and on colour */
const mol = $('#molecules');
if (mol) {
  const m1 = `<div class="mol"><div class="glb">${GLOBE}</div><div><small>Event</small><b>Second Wind</b></div><div><small>Date</small><b>Jan 02</b></div><div><small>Time</small><b>6PM–3AM</b></div><div class="bar"></div></div>`;
  const m2 = `<div class="mol"><div><small>Venue</small><b>The Train Station</b></div><div><small>Doors</small><b>8PM</b></div><div><small>Lat</small><b>34.0407</b></div><div><small>Lon</small><b>−118.2468</b></div></div>`;
  const log = `<div class="mol-log">&gt; LOADING LINEUP ........ <span class="ok">OK</span>\n&gt; LEE BURRIDGE ........... <span class="ok">CONFIRMED</span>\n&gt; RY X [DJ SET] .......... <span class="ok">CONFIRMED</span>\n&gt; TICKETS ................ <span class="ok">ON SALE</span>\n&gt; CAPACITY ............... 97%</div>`;
  const me = `<i class="lg lg-mark" style="width:72px;margin:0 auto 18px"></i>`;
  const T = [
    ['on-mid', 'Neon on black · Lime', m1, '--acc:#B4F152;color:#B4F152'],
    ['on-lime', 'Midnight on Lime', log, ''],
    ['', 'ME on Iron grey', me + m2, 'background:#40424D;color:#F5F6FC'],
    ['on-lilac', 'Midnight on Lilac', m1.replace('Second Wind', 'THE MAZE').replace('Jan 02', 'Oct 31').replace('6PM–3AM', '8PM–4AM'), ''],
  ];
  mol.innerHTML = T.map(([c, h, inner, st]) => `<div class="mol-tile ${c}" style="${st}">${corners}<span class="hd">${h}</span><div>${inner}</div></div>`).join('');
}

/* ---------------- icons: built from the bars of the mark */
const ig = $('#icon-grid');
if (ig) {
  const maze = `<div class="card" style="padding:14px"><div style="aspect-ratio:1;display:grid;place-items:center;color:var(--fg)"><div style="width:44%">${LOGO['the-maze']}</div></div><div class="cap" style="padding:8px 0 0"><span class="lab">the maze</span><a class="dl" href="downloads/logos/svg/minimal-effort_the-maze_white.svg" download>SVG</a></div></div>`;
  ig.innerHTML = maze + Object.keys(ICONS).filter(n => !['float', 'clinic'].includes(n)).map(n => `<div class="card" style="padding:14px"><div style="aspect-ratio:1;display:grid;place-items:center;color:var(--fg)"><div style="width:44%">${icon(n)}</div></div><div class="cap" style="padding:8px 0 0"><span class="lab">${n}</span><a class="dl" href="downloads/icons/minimal-effort_icon_${n}.svg" download>SVG</a></div></div>`).join('');
}

/* ---------------- compositions A–G */
const comps = $('#comps');
if (comps) {
  const USE = { center: 'Default, any lineup', header: 'Co-brands, partner first', left: 'Long lineups, on the margin', headliner: 'One big name', split: 'Date-led, two columns', bottom: 'Image-led, type low', half: 'Half image, half colour, text across both', window: 'A photo window, names inside it' };
  const BG = { center: 'waves', header: 'rainbow', left: 'lilac', headliner: 'bubbles', split: 'flow', bottom: 'bloom', half: 'lime', window: 'ember' };
  const PH = { half: 'lee-burridge-2', window: 'party-02' };
  comps.innerHTML = Object.entries(LAYOUTS).map(([k, v]) => `<div class="tp"><div class="frame" data-tpl='${attr({ template: 'lineup', layout: k, bg: BG[k], ...(PH[k] ? { photo: PH[k] } : {}) })}'></div><div class="meta-r"><h4>${v}</h4><span class="lab">${USE[k]}</span></div></div>`).join('');
}

/* ---------------- backgrounds, grouped by family */
const loops = $('#loops');
if (loops) {
  const fams = {};
  for (const [k, b] of Object.entries(BACKGROUNDS)) if (b.video) (fams[b.family] ??= []).push([k, b]);
  const NOTE = { Chrome: 'Liquid, iridescent forms', Prism: 'Spectrum light', Film: 'Analog leaks and holo film', 'Brand light': 'Lime and Lilac, for light posts', Shader: 'The ME drawn live by WebGL: glass, pixel, grit. Make your own in the shader lab below' };
  loops.innerHTML = Object.entries(fams).map(([f, list]) => `<p class="fam-h">${f} · ${NOTE[f] || ''}</p><div class="g" style="--c:${Math.min(5, Math.max(3, list.length))}">${list.map(([k, b]) => {
    const id = b.loop, base = `downloads/backgrounds/minimal-effort_loop_${id}`;
    return `<div class="card flush"><video src="${b.video}" poster="${b.still}" muted loop playsinline autoplay preload="none" style="aspect-ratio:4/5;object-fit:cover;width:100%;display:block"></video><div class="cap"><span class="lab">${b.label}</span><span style="display:flex;gap:6px;flex-wrap:wrap"><a class="dl" href="${base}_feed-1080x1350.mp4" download>Feed</a><a class="dl" href="${base}_story-1080x1920.mp4" download>Story</a><a class="dl" href="${base}_master-1440x1920.mp4" download>2K</a></span></div></div>`;
  }).join('')}</div>`).join('');
}

/* ---------------- social templates, from the example specs */
const groups = $('#tpl-groups');
if (groups) {
  const G = [
    ['The Second Wind flyer · every size', 'The flyer we made, on the waves loop, adapted to feed 4:5, story 9:16, square 1:1 and landscape 16:9 (event pages, screens). Same words, same blocks, the layout adapts.', n => n === 'second-wind_waves', true],
    ['Lineup · compositions', 'The same night in more compositions and backgrounds, including G · Half image and H · Window. Black label blocks by default, Lime as an option.', n => n.startsWith('lineup-')],
    ['THE MAZE · its own flyer', 'From the real MAZE flyers: maze blocks over a blurred colour field or photo, the MAZE logo sitting in one block, lime names, IN ORDER OF APPEARANCE. Four palettes, every size; try another maze pattern in the builder.', n => n.startsWith('the-maze'), true],
    ['Just announced', 'Real press photos. The ME on top, the venue logo at the bottom, and all the info: night, date, time, place.', n => n.startsWith('announce')],
    ['Ticket giveaway', 'Three compositions: a photo window, a full photo (centred, words low) and a ticket stub. The ME bottom left or centred.', n => n.startsWith('giveaway')],
    ['Ticket messaging', 'Presale live, tickets live, on sale now, final release, sold out. The words sit low, or on a band across the middle; the button at the bottom.', n => n.startsWith('status')],
    ['Monthly calendar', 'One month of nights in one post. Four backgrounds.', n => n.startsWith('calendar')],
    ['Now hiring', 'Three ways to say it: an object (walkie-talkie, flight case, headphones, crew pass, gaffer tape), a statement on a photo, a list of open roles. The ME centred.', n => n.startsWith('hiring')],
    ['Statements', 'Type-led covers. The ME takes the colour that reads on the background, never boxed.', n => n.startsWith('cover')],
  ];
  fetch('tools/examples/templates.json').then(r => r.json()).then(list => {
    groups.innerHTML = G.map(([h, note, test, all]) => {
      const items = list.filter(e => test(e.name));
      const cells = items.flatMap(e => (all ? e.formats : e.formats.filter(f => f !== 'square' || e.formats.length === 1).slice(0, 2)).map(f => {
        const { name, formats, ...spec } = e; const moving = !!BACKGROUNDS[spec.bg]?.video;
        const file = `downloads/templates/${name}_${f}`;
        return `<div class="tp${f === 'landscape' ? ' wide2' : ''}"><div class="frame" data-tpl='${attr({ ...spec, format: f })}'></div><div class="meta-r"><span class="lab">${name.replace(/_/g, ' · ')} · ${f}</span><span style="display:flex;gap:6px">${moving ? `<a class="dl" href="${file}.mp4" download>MP4</a>` : ''}<a class="dl" href="${file}.png" download>PNG</a></span></div></div>`;
      }));
      return `<div class="sub"><h3>${h}<small>${note}</small></h3><div class="body g" style="--c:4;align-items:start">${cells.join('')}</div></div>`;
    }).join('');
    dispatchEvent(new Event('resize'));
  }).catch(() => { });
}

/* ---------------- highlight covers */
const HL = [['THE MAZE', 'maze-logo'], ['ARTISTS', 'artists'], ['GALLERY', 'gallery'], ['TICKETS', 'tickets'], ['INFO', 'info'], ['CALENDAR', 'calendar']];
const hlSpec = (t, ic, style) => style === 'lime' ? { template: 'highlight', format: 'story', highlight: t, icon: ic, bg: 'limesolid', labels: false, textColor: '#14141A' }
  : style === 'midnight' ? { template: 'highlight', format: 'story', highlight: t, icon: ic, bg: 'midnight', labels: false, textColor: '#B4F152' }
    : { template: 'highlight', format: 'story', highlight: t, icon: 'none', bg: 'midnight', labels: false, textColor: '#B4F152' };
const crop = (el, sp, w) => { const k = w / 760; el.innerHTML = `<div style="position:absolute;left:${-160 * k}px;top:${-580 * k}px">${preview(sp, 1080 * k, { forExport: true })}</div>`; };
const hg = $('#hl-grid');
if (hg) hg.innerHTML = ['lime', 'midnight'].flatMap(st => HL.map(([t, ic]) => `<div class="tp"><div class="frame" style="border-radius:50%;aspect-ratio:1;position:relative" data-hl='${attr(hlSpec(t, ic, st))}'></div><div class="meta-r"><span class="lab">${t}</span><a class="dl" href="downloads/highlights/minimal-effort_highlight_${slug(t)}_${st}.png" download>PNG</a></div></div>`)).join('');

/* ---------------- feed mockup + carousel */
const feed = [
  { template: 'announce', photo: 'lee-burridge-1', artists: [{ name: 'LEE BURRIDGE' }] }, { template: 'lineup', bg: 'waves' }, { template: 'calendar', bg: 'midnight', dust: true },
  { template: 'status', status: 'ON SALE NOW', bg: 'lime' }, { template: 'announce', photo: 'ry-x', artists: [{ name: 'RY X', note: '[DJ SET]' }] }, { template: 'cover', bg: 'lilac', car: 1, statement: 'Second Wind. Jan 2.' },
  { template: 'giveaway', bg: 'midnight', dust: true, photo: 'party-03' }, { template: 'maze', layout: 'orange', date: 'OCT 31', title: 'HALLOWEEN NIGHT', artists: [{ name: 'GUY GERBER' }, { name: 'LEE BURRIDGE' }, { name: 'DEER JADE' }, { name: 'THE BITAR BROTHERS' }], venue: ['THE TRAIN STATION', '800 N. Alameda St. Los Angeles, CA'] }, { template: 'status', status: 'SOLD OUT', bg: 'rainbow' },
];
const grid = $('#ig-grid'), hl = $('#ig-hl'), car = $('#carousel');
if (grid) grid.innerHTML = feed.map(s => `<div class="${s.car ? 'car' : ''}" data-f='${attr(s)}'></div>`).join('');
if (hl) hl.innerHTML = HL.slice(0, 6).map(([t, ic]) => `<div><div class="c" data-mini='${attr(hlSpec(t, ic, 'lime'))}'></div>${t.split(' ').pop().slice(0, 9)}</div>`).join('');
if (car) {
  const C = [['carousel-01_cover', 'cover', { bg: 'lilac', statement: 'Second Wind. Jan 2.' }],
    ['carousel-02_lineup', 'lineup', { bg: 'lilac', presents: '' }],
    ['carousel-03_tickets', 'status', { status: 'ON SALE NOW', bg: 'lime' }]];
  car.innerHTML = C.map(([n, t, s], i) => `<div class="tp"><div class="frame" data-tpl='${attr({ template: t, format: 'square', ...s })}'></div><div class="meta-r"><span class="lab">${String(i + 1).padStart(2, '0')} / 03</span><a class="dl" href="downloads/templates/${n}_square.png" download>PNG</a></div></div>`).join('');
}

function draw() {
  $$('[data-hl]').forEach(el => { const w = el.clientWidth; if (w && el._w !== w) { el._w = w; crop(el, JSON.parse(el.dataset.hl), w); } });
  $$('[data-f]').forEach(el => { const w = el.clientWidth; if (w && el._w !== w) { el._w = w; el.innerHTML = preview(JSON.parse(el.dataset.f), w); } });
  $$('[data-mini]').forEach(el => { if (!el._w) { el._w = 1; crop(el, JSON.parse(el.dataset.mini), 58); el.firstChild.style.position = 'relative'; } });
}
draw();
let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { $$('[data-hl],[data-f]').forEach(e => e._w = 0); draw(); }, 140); });
document.fonts?.ready.then(() => { $$('[data-hl],[data-f]').forEach(e => e._w = 0); draw(); });

// click an example → open it in the builder with that spec
const toBuilder = spec => { const { car, ...o } = spec; location.href = 'builder.html#' + btoa(unescape(encodeURIComponent(JSON.stringify(o)))); };
document.addEventListener('click', e => {
  if (e.target.closest('a, button, .lb-open')) return;
  const el = e.target.closest('[data-tpl], [data-f]'); if (!el) return;
  try { toBuilder(JSON.parse(el.dataset.tpl || el.dataset.f)); } catch (err) { }
});
