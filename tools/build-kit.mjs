// Builds every downloadable in the Minimal Effort kit except logos (build-logos.mjs) and template renders (render.mjs):
// icons, highlight covers, grids + story safe-zone overlay, profile icons, colour tokens (CSS/JSON/ASE), fonts folder,
// email signature, business-card PDFs, and the .zip bundles. Run: node tools/build-kit.mjs
import fs from 'fs';
import path from 'path';
import http from 'http';
import { execFileSync } from 'child_process';
import { chromium } from 'playwright';
import { ICONS, icon } from '../assets/js/templates.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const D = p => { const f = path.join(ROOT, 'downloads', p); fs.mkdirSync(path.dirname(f), { recursive: true }); return f; };
const LOGO = Object.fromEntries(['me-mark', 'wordmark', 'lockup'].map(n => [n, fs.readFileSync(path.join(ROOT, 'assets/logo', n + '.svg'), 'utf8').replace(/<title>.*?<\/title>/, '')]));

// ---------------------------------------------------------------- icons
for (const f of fs.existsSync(D('icons/x').replace('/x', '')) ? fs.readdirSync(D('icons/x').replace('/x', '')) : []) fs.rmSync(path.join(D('icons/x').replace('/x', ''), f));
for (const n of Object.keys(ICONS).filter(n => !['float', 'clinic'].includes(n))) fs.writeFileSync(D(`icons/minimal-effort_icon_${n}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="#14141A">${ICONS[n]}</svg>\n`);

// ---------------------------------------------------------------- colour tokens
const COLOURS = [['Midnight', '#14141A', 'primary'], ['Ice White', '#F5F6FC', 'primary'], ['Lime', '#B4F152', 'primary'], ['Lilac', '#A79BEE', 'primary'], ['Label', '#181D20', 'system'],
  ['Coal', '#1E1E24', 'grey'], ['Iron', '#40424D', 'grey'], ['Graphite', '#6E7180', 'grey'], ['Slate', '#9DA2B3', 'grey'], ['Steel', '#BCBFCC', 'grey'], ['Smoke', '#D3D6E0', 'grey'], ['Cloud', '#EDEFF7', 'grey'],
  ['Cyan', '#2ED0FF', 'spectrum'], ['Yellow', '#F3CE3A', 'spectrum'], ['Orange', '#FF7022', 'spectrum'], ['Red', '#E92E4A', 'spectrum']];
const kebab = s => s.toLowerCase().replace(/\s+/g, '-');
fs.writeFileSync(D('colour/minimal-effort-tokens.css'), `/* Minimal Effort colour + type tokens */\n:root {\n${COLOURS.map(([n, h]) => `  --me-${kebab(n)}: ${h};`).join('\n')}\n  --me-font-display: 'ABC Normal', 'Helvetica Neue', Arial, sans-serif; /* Heavy 800 */\n  --me-font-text: 'Manrope', 'Helvetica Neue', Arial, sans-serif;\n  --me-font-mono: 'IBM Plex Mono', ui-monospace, Menlo, monospace;\n  --me-track-display: -0.031em;\n  --me-margin: 64px; /* at 1080 */\n}\n`);
fs.writeFileSync(D('colour/minimal-effort-tokens.json'), JSON.stringify({ colour: Object.fromEntries(COLOURS.map(([n, h, g]) => [kebab(n), { value: h, group: g }])), font: { display: 'ABC Normal Heavy', text: 'Manrope', mono: 'IBM Plex Mono' }, social: { feed: [1080, 1350], story: [1080, 1920], square: [1080, 1080], margin: 64, storySafeTop: 250, storySafeBottom: 340 } }, null, 2));
// Adobe Swatch Exchange (ASE v1.0, RGB global colours)
{
  const be16 = n => { const b = Buffer.alloc(2); b.writeUInt16BE(n); return b; }, be32 = n => { const b = Buffer.alloc(4); b.writeUInt32BE(n); return b; }, f32 = n => { const b = Buffer.alloc(4); b.writeFloatBE(n); return b; };
  const name = s => { const t = s + '\0'; const b = Buffer.alloc(2 + t.length * 2); b.writeUInt16BE(t.length, 0); for (let i = 0; i < t.length; i++) b.writeUInt16BE(t.charCodeAt(i), 2 + i * 2); return b; };
  const blocks = COLOURS.map(([n, h]) => { const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255); const body = Buffer.concat([name(`ME ${n} ${h}`), Buffer.from('RGB '), f32(r), f32(g), f32(b), be16(0)]); return Buffer.concat([be16(1), be32(body.length), body]); });
  fs.writeFileSync(D('colour/minimal-effort-colours.ase'), Buffer.concat([Buffer.from('ASEF'), be16(1), be16(0), be32(blocks.length), ...blocks]));
}

// ---------------------------------------------------------------- fonts (open licences only)
for (const f of ['Manrope-variable.ttf', 'OFL-Manrope.txt', 'OFL-IBMPlexMono.txt']) fs.copyFileSync(path.join(ROOT, 'assets/fonts', f), D('fonts/' + f));
if (!fs.existsSync(D('fonts/IBMPlexMono-Medium.ttf'))) execFileSync('curl', ['-sfL', '-o', D('fonts/IBMPlexMono-Medium.ttf'), 'https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/IBMPlexMono-Medium.ttf']);
if (!fs.existsSync(D('fonts/IBMPlexMono-Regular.ttf'))) execFileSync('curl', ['-sfL', '-o', D('fonts/IBMPlexMono-Regular.ttf'), 'https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf']);
fs.writeFileSync(D('fonts/README-fonts.txt'), `Minimal Effort typefaces\n\n1. ABC Normal (Heavy for display, Medium for sub-heads) — Dinamo, commercial.\n   Licence it at https://abcdinamo.com/typefaces/normal before use. Not included in this kit.\n   If it is not available, the fallback for drafts is Helvetica Neue Bold with -3% tracking.\n2. Manrope (400-800) — text, web, captions. SIL Open Font Licence, included.\n3. IBM Plex Mono (400, 500) — labels, dates, venues, signatures. SIL Open Font Licence, included.\n   It stands in for Decima Mono, which the original identity deck used.\n`);

// ---------------------------------------------------------------- email signature
const sigHTML = (img) => `<table cellpadding="0" cellspacing="0" border="0" style="font-family:'IBM Plex Mono',Menlo,Consolas,monospace;font-size:12px;line-height:17px;color:#14141A;border-collapse:collapse"><tr><td style="padding:0 0 6px" colspan="2">Cyril Bitar<br><span style="color:#6B6F7D">Founder</span><br><span style="color:#6B6F7D">+1 (000) 000 0000</span></td></tr><tr><td style="padding:12px 16px 0 0;vertical-align:middle"><img src="${img}" width="48" height="23" alt="ME" style="display:block;border:0"></td><td style="padding:12px 0 0;vertical-align:middle;text-transform:uppercase;font-size:11px;line-height:15px"><a href="mailto:cyril@minimaleffort.com" style="color:#14141A;text-decoration:none">cyril@minimaleffort.com</a><br><a href="https://instagram.com/minimaleffortla" style="color:#14141A;text-decoration:underline">@minimaleffortla</a></td></tr></table>`;
fs.writeFileSync(D('signature/minimal-effort_email-signature.html'), `<!doctype html><html><head><meta charset="utf-8"><title>Minimal Effort email signature</title></head><body style="background:#FFFFFF;padding:40px">\n<!-- The signature has no background: it sits on the mail app. 1. Upload minimal-effort_me-mark-black-96.png (or -white- for dark mode) to the website and replace the src below with its public URL.\n     2. Change name, title and phone. 3. Open this file in a browser, select the signature, copy, paste into Gmail / Apple Mail settings. -->\n${sigHTML('https://YOUR-SITE.com/minimal-effort_me-mark-black-96.png')}\n</body></html>\n`);

// ---------------------------------------------------------------- browser renders: highlights, grids, safe zone, profile, signature PNG, cards
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => { const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res); });
await new Promise(r => server.listen(0, '127.0.0.1', r)); const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: 'chrome' }); const page = await browser.newPage();
const HEAD = `<base href="${base}/"><link rel="stylesheet" href="assets/fonts/fonts.css"><link rel="stylesheet" href="assets/css/templates.css"><style>html,body{margin:0;background:transparent}</style>`;
async function png(html, w, h, to, transparent = false) { await page.setViewportSize({ width: w, height: h }); await page.setContent(`<!doctype html><html><head>${HEAD}</head><body>${html}</body></html>`, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); await page.screenshot({ path: to, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } }); }

// highlight covers via the template engine
const HL = [['THE MAZE', 'maze-logo'], ['ARTISTS', 'artists'], ['GALLERY', 'gallery'], ['TICKETS', 'tickets'], ['INFO', 'info'], ['CALENDAR', 'calendar']];
await page.setViewportSize({ width: 1080, height: 1920 });
for (const f of fs.readdirSync(D('highlights/x').replace('/x', ''))) fs.rmSync(path.join(D('highlights/x').replace('/x', ''), f));
for (const [t, ic] of HL) for (const style of ['lime', 'midnight', 'word']) {
  const spec = style === 'lime' ? { template: 'highlight', highlight: t, icon: ic, bg: 'limesolid', labels: false, textColor: '#14141A' }
    : style === 'midnight' ? { template: 'highlight', highlight: t, icon: ic, bg: 'midnight', labels: false, textColor: '#B4F152' }
    : { template: 'highlight', highlight: t, icon: 'none', bg: 'midnight', labels: false, textColor: '#B4F152' };
  await page.goto(`${base}/render.html?mode=still&spec=${encodeURIComponent(Buffer.from(JSON.stringify(spec)).toString('base64'))}`);
  await page.waitForSelector('body[data-ready="1"]');
  await page.locator('.ab').screenshot({ path: D(`highlights/minimal-effort_highlight_${t.toLowerCase().replace(/\s+/g, '-')}_${style}.png`) });
}

// grids
const gridSVG = (w, h) => { let r = ''; const cw = (w - 128 - 11 * 24) / 12; for (let i = 0; i < 12; i++) r += `<rect x="${64 + i * (cw + 24)}" y="64" width="${cw}" height="${h - 128}" fill="rgba(180,241,82,.16)"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${r}<rect x="64" y="64" width="${w - 128}" height="${h - 128}" fill="none" stroke="#B4F152" stroke-width="3"/></svg>`; };
await png(gridSVG(1080, 1350), 1080, 1350, D('layout/minimal-effort_grid_feed-1080x1350.png'), true);
await png(gridSVG(1080, 1080), 1080, 1080, D('layout/minimal-effort_grid_square-1080x1080.png'), true);
await png(gridSVG(1080, 1920), 1080, 1920, D('layout/minimal-effort_grid_story-1080x1920.png'), true);
await png(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" font-family="IBM Plex Mono" font-size="26"><defs><pattern id="h" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="24" fill="rgba(233,46,74,.55)"/></pattern></defs><rect width="1080" height="250" fill="url(#h)"/><rect y="1580" width="1080" height="340" fill="url(#h)"/><rect y="250" width="64" height="1330" fill="rgba(233,46,74,.28)"/><rect x="1016" y="250" width="64" height="1330" fill="rgba(233,46,74,.28)"/><rect x="64" y="250" width="952" height="1330" fill="none" stroke="#B4F152" stroke-width="3"/><text x="540" y="140" text-anchor="middle" fill="#fff">UNSAFE · TOP 250 PX</text><text x="540" y="1760" text-anchor="middle" fill="#fff">UNSAFE · BOTTOM 340 PX</text><text x="540" y="290" text-anchor="middle" fill="#B4F152">SAFE AREA 952 × 1330</text></svg>`, 1080, 1920, D('layout/minimal-effort_story-safe-zone_overlay.png'), true);

// profile pictures (circle-safe: the mark spans 56% of the width)
const prof = (bg, fg) => `<div style="width:1080px;height:1080px;background:${bg};display:grid;place-items:center;color:${fg}"><div style="width:430px">${LOGO['me-mark']}</div></div>`;
for (const [n, bg, fg] of [['lime', '#B4F152', '#14141A'], ['midnight', '#14141A', '#B4F152'], ['lilac', '#A79BEE', '#14141A'], ['ice', '#F5F6FC', '#14141A']]) await png(prof(bg, fg), 1080, 1080, D(`logos/profile/minimal-effort_profile_${n}.png`));
// signature logo (white, 96 px wide @2x of 48)
await png(`<div style="width:96px;color:#F5F6FC">${LOGO['me-mark']}</div>`, 96, 46, D('signature/minimal-effort_me-mark-white-96.png'), true);
await png(`<div style="width:96px;color:#14141A">${LOGO['me-mark']}</div>`, 96, 46, D('signature/minimal-effort_me-mark-black-96.png'), true);

// business cards → PDF, 3.5x2in + 0.125in bleed, front + back
const card = (bg, fg, mk) => `<!doctype html><html><head>${HEAD}<style>@page{size:3.75in 2.25in;margin:0}body{margin:0}.p{width:3.75in;height:2.25in;background:${bg};color:${fg};position:relative;overflow:hidden;page-break-after:always;font-family:'IBM Plex Mono',monospace}.in{position:absolute;inset:.125in;padding:.22in}.f{display:grid;place-items:center}.f div{width:1.3in;color:${mk}}.b .t{display:flex;justify-content:space-between}.b .w{width:1.55in}.b .r{font:500 6.6pt/1.35 'IBM Plex Mono';text-transform:uppercase;text-align:right}.b .c{position:absolute;left:.22in;bottom:.22in;font:500 6.6pt/1.5 'IBM Plex Mono';text-transform:uppercase;display:grid;grid-template-columns:auto 1fr;gap:0 .16in}</style></head><body>
<div class="p"><div class="in f"><div>${LOGO['me-mark']}</div></div></div>
<div class="p"><div class="in b"><div class="t"><div class="w">${LOGO.wordmark}</div><div class="r">Cyril Bitar<br>Founder</div></div><div class="c"><span>E.</span><span>cyril@minimaleffort.com</span><span>I.</span><span>@minimaleffortla</span><span>W.</span><span>minimaleffort.com</span></div></div></div></body></html>`;
for (const [n, bg, fg, mk] of [['midnight', '#14141A', '#B4F152', '#B4F152'], ['lime', '#B4F152', '#14141A', '#A79BEE']]) {
  await page.setContent(card(bg, fg, mk), { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: D(`print/minimal-effort_business-card_${n}.pdf`), width: '3.75in', height: '2.25in', printBackground: true });
}
await browser.close(); server.close();

// ---------------------------------------------------------------- zips
const zip = (name, ...dirs) => { const out = D(name); if (fs.existsSync(out)) fs.rmSync(out); execFileSync('zip', ['-qr', '-X', out, ...dirs], { cwd: path.join(ROOT, 'downloads') }); };
const zipIn = (sub, name) => { const out = D(`${sub}/${name}`); if (fs.existsSync(out)) fs.rmSync(out); execFileSync('zip', ['-qj', '-X', out, ...fs.readdirSync(D(sub + '/x').replace('/x', '')).filter(f => !f.endsWith('.zip')).map(f => path.join(ROOT, 'downloads', sub, f))]); };
zipIn('icons', 'minimal-effort-icons.zip');
zipIn('highlights', 'minimal-effort-highlight-covers.zip');
zip('minimal-effort_logos.zip', 'logos');
zip('minimal-effort_colour.zip', 'colour');
zip('minimal-effort_fonts.zip', 'fonts');
zip('minimal-effort_backgrounds.zip', 'backgrounds');
if (fs.existsSync(D('templates/x').replace('/x', ''))) zip('minimal-effort_templates.zip', 'templates');
zip('minimal-effort_graphics.zip', 'textures', 'icons', 'highlights', 'layout', 'mockups', 'print', 'signature');
zip('minimal-effort_photos.zip', 'photos');
console.log('kit built');
