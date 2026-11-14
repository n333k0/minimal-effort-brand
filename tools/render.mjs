// Minimal Effort harness renderer.
//   node tools/render.mjs <spec.json> [--out downloads/renders] [--formats feed,story] [--no-video]
// A spec is one object or an array of objects with the fields in assets/js/templates.js (DEFAULT). Add "name" to set the
// file name. For every spec and format it writes:
//   <name>_<format>.png            the finished still (loop backgrounds use their first frame)
//   <name>_<format>.mp4            if the background is an animated loop: the text composited over the loop (H.264, 10 s)
//   <name>_<format>_overlay.png    the transparent text layer, for editing in other apps
// Needs Google Chrome and ffmpeg on the machine. Serves the folder itself, no other server needed.
import fs from 'fs';
import path from 'path';
import http from 'http';
import { execFileSync } from 'child_process';
import { chromium } from 'playwright';
import { BACKGROUNDS } from '../assets/js/templates.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const file = args.find(a => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--'));
if (!file) { console.error('usage: node tools/render.mjs <spec.json> [--out dir] [--formats feed,story] [--no-video]'); process.exit(1); }
const OUT = path.resolve(opt('out', path.join(ROOT, 'downloads/renders')));
const FORMATS = opt('formats', null)?.split(',');
const NOVIDEO = args.includes('--no-video');
fs.mkdirSync(OUT, { recursive: true });

const SIZE = { feed: [1080, 1350], story: [1080, 1920], square: [1080, 1080], landscape: [1920, 1080] };
const LOOP = Object.fromEntries(Object.entries(BACKGROUNDS).filter(([, b]) => b.loop).map(([k, b]) => [k, b.loop]));
const MASTER = id => path.join(ROOT, 'downloads/backgrounds', `minimal-effort_loop_${id}_master-1440x1920.mp4`);
const CROP = Object.fromEntries(Object.entries(SIZE).map(([k, [w, h]]) => [k, `scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h}`]));

// tiny static server for the kit folder
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const specs = [].concat(JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')));
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ deviceScaleFactor: 1 });
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9_]+/g, '-').replace(/^-|-$/g, '');
const written = [];

async function shot(spec, mode, to) {
  const [w, h] = SIZE[spec.format];
  await page.setViewportSize({ width: w, height: h });
  const b64 = Buffer.from(JSON.stringify(spec), 'utf8').toString('base64');
  await page.goto(`${base}/render.html?mode=${mode}&spec=${encodeURIComponent(b64)}`);
  await page.waitForSelector('body[data-ready="1"]', { timeout: 20000 });
  await page.waitForTimeout(150);
  await page.locator('.ab').screenshot({ path: to, omitBackground: mode === 'overlay' });
}

for (const raw of specs) {
  const formats = FORMATS || [].concat(raw.format || raw.formats || 'feed');
  for (const format of formats) {
    const spec = { ...raw, format }; delete spec.formats;
    const name = slug(raw.name || `${spec.template || 'lineup'}-${spec.bg || ''}`);
    const stem = path.join(OUT, `${name}_${format}`);
    await shot(spec, 'still', stem + '.png'); written.push(stem + '.png');
    const loop = LOOP[spec.bg];
    const src = spec.bg === 'custom' && spec.bgType === 'video' && spec.bgFile ? path.resolve(spec.bgFile) : loop ? MASTER(loop) : null;
    if (src && !NOVIDEO && fs.existsSync(src)) {
      await shot(spec, 'overlay', stem + '_overlay.png'); written.push(stem + '_overlay.png');
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-stream_loop', '-1', '-t', '10', '-i', src, '-i', stem + '_overlay.png', '-filter_complex', `[0]${CROP[format]}[b];[b][1]overlay=0:0:format=auto,format=yuv420p`,
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-r', '24', '-movflags', '+faststart', '-an', stem + '.mp4']);
      written.push(stem + '.mp4');
    }
  }
}
await browser.close(); server.close();
console.log(written.map(f => path.relative(ROOT, f)).join('\n'));
