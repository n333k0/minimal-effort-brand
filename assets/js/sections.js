// Minimal Effort guidelines v2: builds the data-driven sections (technical labels, icons, compositions, loops, templates,
// highlights, feed) from templates.js and tools/examples/templates.json. Template previews carry data-tpl, which
// site.js draws (and redraws on resize). Every block checks that its container exists, so other pages can import this.
import { preview, icon, ICONS, LAYOUTS, BACKGROUNDS, LOGO } from './templates.js?v=20261118a';
import { hydrate } from './hydrate.js?v=20261118a';

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const attr = o => JSON.stringify(o).replace(/'/g, '&#39;');
const slug = s => s.toLowerCase().replace(/\s+/g, '-');
const GLOBE = '<svg viewBox="0 0 60 34" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="30" cy="17" rx="28" ry="15"/><ellipse cx="30" cy="17" rx="12" ry="15"/><path d="M2 17h56M6 9h48M6 25h48"/></svg>';
// The MP4 downloads are too big for GitHub Pages (1 GB limit), so the live site links them from the release; the kit
// and a local server use the files in downloads/.
const REL = 'https://github.com/n333k0/minimal-effort-brand/releases/download/v1.1/';
const mp4 = path => location.hostname.endsWith('github.io') ? REL + path.split('/').pop() : path;
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

/* ---------------- live mockups: a still with the screen playing on top (tools/build-mockups5.py writes screens.json) */
const lives = $$('.mock-live');
if (lives.length) fetch('assets/mock/screens.json').then(r => r.json()).then(S => lives.forEach(el => {
  const d = S[el.dataset.screen]; if (!d) return;
  const pos = `left:${d.left}%;top:${d.top}%;width:${d.width}%;height:${d.height}%;-webkit-mask-image:url(${d.mask});mask-image:url(${d.mask})`;
  const word = LOGO.wordmark || '';
  const inner = d.video ? `<video src="${d.video}" muted loop playsinline autoplay preload="none"></video>`
    : d.ticker ? `<div class="mk-tick"><div>${`<span class="w">${word}</span>`.repeat(8)}</div></div>`
    : d.slides ? d.slides.map((s, i) => `<img src="${s}" alt="" style="animation-delay:${i * 3}s">`).join('') : '';
  el.style.aspectRatio = d.aspect;
  el.innerHTML = `<img class="mk-base lb-open" src="${d.img}" alt=""><div class="mk-scr${d.slides ? ' slides' : ''}" style="${pos}">${inner}</div>`;
  el.querySelectorAll('video').forEach(v => new IntersectionObserver(es => es[0].isIntersecting ? v.play().catch(() => { }) : v.pause()).observe(v));
})).catch(() => { });

/* ---------------- the grid on eight compositions */
const gs = $('#gridshow');
if (gs) {
  const cols = Array.from({ length: 12 }, (_, i) => `<rect x="${(64 + i * 81.33).toFixed(1)}" y="0" width="57.3" height="1350"/>`).join('');
  const ov = `<svg class="gridov" viewBox="0 0 1080 1350" preserveAspectRatio="none"><g fill="rgba(180,241,82,.13)">${cols}</g><rect x="64" y="64" width="952" height="1222" fill="none" stroke="#B4F152" stroke-width="3"/></svg>`;
  const S = [['C · Left, black blocks', { template: 'lineup', layout: 'left', bg: 'midnight' }], ['A · Centred, on a loop', { template: 'lineup', layout: 'center', bg: 'waves' }], ['F · Bottom, Lime blocks', { template: 'lineup', layout: 'bottom', bg: 'bloom', labelColor: '#B4F152' }], ['Stagger · right edge', { template: 'poster', layout: 'stagger' }],
    ['Wall · tight blocks', { template: 'poster', layout: 'wall' }], ['Grid sheet · halftone dots', { template: 'poster', layout: 'gridsheet' }], ['Bands · to the edge', { template: 'poster', layout: 'bands' }], ['THE MAZE', { template: 'maze', layout: 'orange', date: 'OCT 31', title: 'HALLOWEEN NIGHT', artists: [{ name: 'GUY GERBER' }, { name: 'LEE BURRIDGE' }, { name: 'DEER JADE' }], venue: ['THE TRAIN STATION', '800 N. Alameda St. Los Angeles, CA'] }]];
  gs.innerHTML = S.map(([t, sp]) => `<div class="tp"><div class="card flush gridc" style="aspect-ratio:4/5;position:relative;background:#000;overflow:hidden"><div data-tpl='${attr(sp)}' data-still style="position:absolute;inset:0"></div>${ov}</div><span class="lab">${t}</span></div>`).join('');
  $('#gridToggle')?.addEventListener('click', () => gs.classList.toggle('nogrid'));
}

/* ---------------- backgrounds, grouped by family */
const loops = $('#loops');
if (loops) {
  const fams = {};
  for (const [k, b] of Object.entries(BACKGROUNDS)) if (b.video) (fams[b.family] ??= []).push([k, b]);
  const NOTE = { Chrome: 'Liquid, iridescent forms', Prism: 'Spectrum light', Film: 'Analog leaks and holo film', 'Brand light': 'Lime and Lilac, for light posts', Shader: 'Glass, chrome and light drawn live by WebGL on simple shapes (orb, ring, bars, arch). Make your own in the shader lab below' };
  loops.innerHTML = Object.entries(fams).map(([f, list]) => `<p class="fam-h">${f} · ${NOTE[f] || ''}</p><div class="g" style="--c:${Math.min(5, Math.max(3, list.length))}">${list.map(([k, b]) => {
    const id = b.loop, base = `downloads/backgrounds/minimal-effort_loop_${id}`;
    return `<div class="card flush"><video src="${b.video}" poster="${b.still}" muted loop playsinline autoplay preload="none" style="aspect-ratio:4/5;object-fit:cover;width:100%;display:block"></video><div class="cap"><span class="lab">${b.label}</span><span style="display:flex;gap:6px;flex-wrap:wrap"><a class="dl" href="${mp4(base + '_feed-1080x1350.mp4')}" download>Feed</a><a class="dl" href="${mp4(base + '_story-1080x1920.mp4')}" download>Story</a><a class="dl" href="${mp4(base + '_master-1440x1920.mp4')}" download>2K</a></span></div></div>`;
  }).join('')}</div>`).join('');
}

/* ---------------- social templates, from the example specs (tools/examples/build-examples.mjs writes both files) */
const groups = $('#tpl-groups');
if (groups) {
  Promise.all([fetch('tools/examples/templates.json').then(r => r.json()), fetch('tools/examples/groups.json').then(r => r.json())]).then(([list, G]) => {
    groups.innerHTML = G.map(g => {
      const cells = list.filter(e => e.group === g.id).flatMap(e => e.formats.map(f => {
        const { name, formats, group, ...spec } = e; const moving = !!BACKGROUNDS[spec.bg]?.video || (spec.anim && spec.anim !== 'none') || (spec.bg === 'fx' && ['ascii', 'glyph', 'dither', 'halftone', 'dots', 'lines', 'pixel', 'field', 'bloom'].includes(spec.fx?.mode));
        const file = `downloads/templates/${name}_${f}`;
        return `<div class="tp${f === 'landscape' ? ' wide2' : ''}"><div class="frame" data-tpl='${attr({ ...spec, format: f })}'></div><div class="meta-r"><span class="lab">${name.replace(/_/g, ' · ')} · ${f}</span><span style="display:flex;gap:6px">${moving ? `<a class="dl" href="${mp4(file + '.mp4')}" download>MP4</a>` : ''}<a class="dl" href="${file}.png" download>PNG</a></span></div></div>`;
      }));
      return `<div class="sub"><h3>${g.title}<small>${g.note}</small></h3><div class="body g" style="--c:4;align-items:start">${cells.join('')}</div></div>`;
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

/* ---------------- feed mockup: a grid of thirty posts, stories, a carousel post */
const MZ = { template: 'maze', layout: 'orange', date: 'OCT 31', title: 'HALLOWEEN NIGHT', artists: [{ name: 'GUY GERBER' }, { name: 'LEE BURRIDGE' }, { name: 'DEER JADE' }, { name: 'THE BITAR BROTHERS' }], venue: ['THE TRAIN STATION', '800 N. Alameda St. Los Angeles, CA'] };
const feed = [
  { template: 'announce', photo: 'lee-burridge-1', artists: [{ name: 'LEE BURRIDGE' }] }, { template: 'lineup', bg: 'waves' }, { template: 'calendar', layout: 'big', bg: 'midnight', dust: true },
  { template: 'status', layout: 'band', status: 'TICKETS LIVE', bg: 'chrome' }, { template: 'poster', layout: 'mirror' }, { template: 'cover', bg: 'lilac', car: 1, statement: 'Second Wind. Jan 2.' },
  { ...MZ }, { template: 'poster', layout: 'glow', cw: 'lime' }, { template: 'announce', photo: 'ry-x', artists: [{ name: 'RY X', note: '[DJ SET]' }] },
  { template: 'slide', layout: 'cover', car: 1 }, { template: 'poster', layout: 'wall' }, { template: 'status', layout: 'centre', status: 'SOLD OUT', bg: 'rainbow' },
  { template: 'poster', layout: 'portrait', bg: 'fx', fx: { mode: 'ascii', grad: 'acid', cell: 12 }, photo: 'lee-burridge-1' }, { template: 'hiring', layout: 'object' }, { template: 'poster', layout: 'stagger' },
  { template: 'giveaway', layout: 'ticket', bg: 'limesolid' }, { template: 'poster', layout: 'bands' }, { template: 'cover', layout: 'centre', bg: 'glass', statement: 'Less, but louder.' },
  { template: 'timetable', layout: 'faces' }, { ...MZ, layout: 'violet', seed: 21, date: 'NOV 15', title: '8PM - 2AM', subtitle: 'ARTS DISTRICT BLOCK PARTY', artists: [{ name: 'GUY GERBER' }, { name: 'LEE BURRIDGE' }] }, { template: 'poster', layout: 'collage' },
  { template: 'release', layout: 'vinyl', format: 'feed' }, { template: 'poster', layout: 'soft' }, { template: 'status', layout: 'full', status: 'FINAL RELEASE', bg: 'spectrum' },
  { template: 'poster', layout: 'square' }, { template: 'tour', layout: 'columns', title: 'Minimal Effort', subtitle: 'winter series' }, { template: 'calendar', layout: 'grid', bg: 'midnight' },
  { template: 'poster', layout: 'plusgrid' }, { template: 'menu', layout: 'stagger', title: 'Bar' }, { template: 'poster', layout: 'datecard' },
];
const stories = [
  { template: 'status', format: 'story', layout: 'low', status: 'PRESALE LIVE', bg: 'lilac' }, { template: 'lineup', format: 'story', bg: 'waves' }, { ...MZ, format: 'story' }, { template: 'poster', format: 'story', layout: 'glow', cw: 'lime' },
  { template: 'status', format: 'story', layout: 'bandhug', status: 'TICKETS LIVE', bg: 'holome' }, { template: 'poster', format: 'story', layout: 'mirror' }, { template: 'hiring', format: 'story', layout: 'pass' }, { template: 'giveaway', format: 'story', layout: 'full', bg: 'midnight', photo: 'party-03' },
  { template: 'status', format: 'story', layout: 'full', status: 'FINAL RELEASE', bg: 'neon' }, { template: 'calendar', format: 'story', layout: 'grid', bg: 'midnight' }, { template: 'poster', format: 'story', layout: 'plusgrid' }, { template: 'status', format: 'story', layout: 'centre', status: 'SOLD OUT', bg: 'rainbow' },
];
const post = ['cover', 'text', 'image', 'stats', 'quote', 'list', 'image', 'end'].map((l, i) => ({ template: 'slide', layout: l, format: 'feed', page: `0${i + 1} / 08`, ...(i === 6 ? { photo: 'party-06', caption: 'The terrace at sunrise' } : {}), ...(l === 'image' && i === 2 ? { photo: 'party-03', caption: 'Room one, 1:40am' } : {}) }));
const grid = $('#ig-grid'), hl = $('#ig-hl'), car = $('#carousel');
if (grid) grid.innerHTML = feed.map(s => `<div class="${s.car ? 'car' : ''}" data-f='${attr(s)}'></div>`).join('');
const scr = $('#ig-scr'), sl = $('#ig-slide');
if (scr && sl) { sl.addEventListener('input', () => { scr.scrollTop = (scr.scrollHeight - scr.clientHeight) * sl.value / 1000; }); scr.addEventListener('scroll', () => { sl.value = Math.round(1000 * scr.scrollTop / Math.max(1, scr.scrollHeight - scr.clientHeight)); }); }
// the phone scrolls on its own (data-lenis-prevent lets the wheel reach it; at its end the page carries on), and a mouse
// can drag it like a thumb
if (scr) {
  let y0 = null, t0 = 0, moved = false;
  scr.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button) return; y0 = e.clientY; t0 = scr.scrollTop; moved = false; scr.setPointerCapture(e.pointerId); scr.style.cursor = 'grabbing'; });
  scr.addEventListener('pointermove', e => { if (y0 === null) return; const d = e.clientY - y0; if (Math.abs(d) > 3) moved = true; scr.scrollTop = t0 - d; });
  const end = () => { y0 = null; scr.style.cursor = ''; };
  scr.addEventListener('pointerup', end); scr.addEventListener('pointercancel', end);
  scr.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
}
// thirty more posts: a spread of the page's own examples (feed size), so the grid shows the whole system
if (grid) fetch('tools/examples/templates.json').then(r => r.json()).then(list => {
  const pool = list.filter(e => [].concat(e.formats || 'feed').includes('feed') && !/^carousel-(case|article)-0[2-9]/.test(e.name));
  const step = pool.length / 30, pick = Array.from({ length: 30 }, (_, i) => pool[Math.floor(i * step + step / 2)]).filter(Boolean);
  grid.insertAdjacentHTML('beforeend', pick.map(e => { const { name, formats, group, ...spec } = e; return `<div data-f='${attr({ ...spec, format: 'feed' })}'></div>`; }).join(''));
  dispatchEvent(new Event('scroll'));
}).catch(() => { });
const st = $('#ig-story');
if (st) {
  st.innerHTML = `<div class="bars">${stories.map(() => '<i><b></b></i>').join('')}</div><div class="who"><i>${LOGO['me-mark']}</i>minimaleffortla <span style="opacity:.6;font-weight:500">2h</span></div>` + stories.map((s, i) => `<div class="st-slide${i ? '' : ' on'}" data-f='${attr(s)}' data-story></div>`).join('');
  let k = 0, tm; const ss = $('#st-slide');
  const show = i => { k = (i + stories.length) % stories.length; $$('.st-slide', st).forEach((e, j) => e.classList.toggle('on', j === k)); $$('.bars i', st).forEach((e, j) => { e.className = j < k ? 'done' : j === k ? 'now' : ''; void e.offsetWidth; }); if (ss) ss.value = k; clearTimeout(tm); tm = setTimeout(() => show(k + 1), 4500); };
  ss?.addEventListener('input', () => show(+ss.value)); st.addEventListener('click', e => { show(k + (e.offsetX > st.clientWidth / 2 ? 1 : -1)); e.stopPropagation(); });
  new IntersectionObserver(es => { if (es[0].isIntersecting) show(k); else clearTimeout(tm); }).observe(st);
}
const po = $('#ig-post');
if (po) {
  po.innerHTML = `<div class="ph-h"><i>${LOGO['me-mark']}</i>minimaleffortla</div><div style="overflow:hidden"><div class="track">${post.map(s => `<div data-f='${attr(s)}' style="aspect-ratio:4/5"></div>`).join('')}</div></div><div class="dots">${post.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div><p class="txt"><b>minimaleffortla</b> Second Wind, one night, three rooms. The recap → swipe</p>`;
  const ps = $('#po-slide'), go = i => { $('.track', po).style.transform = `translateX(${-100 * i}%)`; $$('.dots i', po).forEach((d, j) => d.classList.toggle('on', j === i)); };
  ps?.addEventListener('input', () => go(+ps.value));
}
if (hl) hl.innerHTML = HL.slice(0, 6).map(([t, ic]) => `<div><div class="c" data-mini='${attr(hlSpec(t, ic, 'lime'))}'></div>${t.split(' ').pop().slice(0, 9)}</div>`).join('');
if (car) {
  const C = [['carousel-01_cover', 'cover', { bg: 'lilac', statement: 'Second Wind. Jan 2.' }],
    ['carousel-02_lineup', 'lineup', { bg: 'lilac', presents: '' }],
    ['carousel-03_tickets', 'status', { status: 'ON SALE NOW', bg: 'lime' }]];
  car.innerHTML = C.map(([n, t, s], i) => `<div class="tp"><div class="frame" data-tpl='${attr({ template: t, format: 'square', ...s })}'></div><div class="meta-r"><span class="lab">${String(i + 1).padStart(2, '0')} / 03</span><a class="dl" href="downloads/templates/${n}_square.png" download>PNG</a></div></div>`).join('');
}

const PRINT = new URLSearchParams(location.search).has('print');
const near = el => { if (PRINT) return true; const r = (el.closest('.phone') || el).getBoundingClientRect(); return r.bottom > -1200 && r.top < innerHeight + 1200; };
function draw() {
  $$('[data-hl]').forEach(el => { const w = el.clientWidth; if (w && el._w !== w) { el._w = w; crop(el, JSON.parse(el.dataset.hl), w); } });
  $$('[data-f]').forEach(el => { const w = el.clientWidth || el.parentElement?.clientWidth; if (!w || el._w === w || !near(el)) return; el._w = w; el.innerHTML = preview(JSON.parse(el.dataset.f), w); hydrate(el, { scale: Math.min(1, w / 540) }); });
  $$('[data-mini]').forEach(el => { if (!el._w) { el._w = 1; crop(el, JSON.parse(el.dataset.mini), 58); el.firstChild.style.position = 'relative'; } });
}
draw();
addEventListener('scroll', () => { if (!draw._q) { draw._q = 1; requestAnimationFrame(() => { draw._q = 0; draw(); }); } }, { passive: true });
let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { $$('[data-hl],[data-f]').forEach(e => e._w = 0); draw(); }, 140); });
document.fonts?.ready.then(() => { $$('[data-hl],[data-f]').forEach(e => e._w = 0); draw(); });

// click an example → open it in the builder with that spec
const toBuilder = spec => { const { car, ...o } = spec; location.href = 'builder.html#' + btoa(unescape(encodeURIComponent(JSON.stringify(o)))); };
document.addEventListener('click', e => {
  if (e.target.closest('a, button, .lb-open')) return;
  const el = e.target.closest('[data-tpl], [data-f]'); if (!el) return;
  try { toBuilder(JSON.parse(el.dataset.tpl || el.dataset.f)); } catch (err) { }
});
