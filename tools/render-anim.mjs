// Records the moving posts as seamless 10 s MP4s: text animations (spec.anim) and moving effect backgrounds (fx ASCII,
// dither, halftone…). Frame by frame, so every frame is exact and the loop closes.
//   node tools/render-anim.mjs <specs.json> [--out downloads/templates] [--only name1,name2]
// Specs over a loop background: the type is recorded on transparency and laid over the loop's master file.
import fs from 'fs';
import path from 'path';
import os from 'os';
import http from 'http';
import { execFileSync } from 'child_process';
import { chromium } from 'playwright';
import { BACKGROUNDS } from '../assets/js/templates.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const file = args[0], OUT = path.resolve(opt('out', path.join(ROOT, 'downloads/templates'))), ONLY = opt('only', '')?.split(',').filter(Boolean);
const FPS = 24, SEC = 10, N = FPS * SEC;
const SIZE = { feed: [1080, 1350], story: [1080, 1920], square: [1080, 1080], landscape: [1920, 1080], billboard: [2636, 1080] };
const CELL = ['ascii', 'glyph', 'dither', 'halftone', 'dots', 'lines', 'pixel', 'field', 'bloom'];
export const moving = s => (s.anim && s.anim !== 'none') || (s.bg === 'fx' && CELL.includes(s.fx?.mode) && s.fx?.animate !== false);

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.json': 'application/json' };
const server = http.createServer((req, res) => { const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0])); if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res); });
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: 'chrome' }); const page = await browser.newPage({ deviceScaleFactor: 1 });
const specs = [].concat(JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'))).filter(s => moving(s) && (!ONLY?.length || ONLY.includes(s.name)));
fs.mkdirSync(OUT, { recursive: true });
for (const raw of specs) for (const format of [].concat(raw.formats || raw.format || 'feed')) {
  const spec = { ...raw, format }; delete spec.formats;
  const loop = BACKGROUNDS[spec.bg]?.loop, over = !!loop;
  const [w, h] = SIZE[format]; await page.setViewportSize({ width: w, height: h });
  const b64 = Buffer.from(JSON.stringify(spec), 'utf8').toString('base64');
  await page.goto(`${base}/render.html?mode=${over ? 'anim-overlay' : 'anim'}&spec=${encodeURIComponent(b64)}`);
  await page.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'me-anim-')), el = page.locator('.ab');
  for (let i = 0; i < N; i++) {
    await page.evaluate(i => { document.getAnimations().forEach(a => { a.pause(); a.currentTime = i / 24 * 1000; }); window.__fxTime?.(i / 240); }, i);
    await el.screenshot({ path: path.join(tmp, `f${String(i).padStart(4, '0')}.${over ? 'png' : 'jpg'}`), omitBackground: over, type: over ? 'png' : 'jpeg', quality: over ? undefined : 92 });
  }
  const out = path.join(OUT, `${raw.name}_${format}.mp4`);
  const crop = `scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h}`;
  if (over) execFileSync('ffmpeg', ['-v', 'error', '-y', '-stream_loop', '-1', '-t', String(SEC), '-i', path.join(ROOT, 'downloads/backgrounds', `minimal-effort_loop_${loop}_master-1440x1920.mp4`), '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.png'), '-filter_complex', `[0]${crop},fps=${FPS}[b];[b][1]overlay=0:0:format=auto,format=yuv420p`, '-c:v', 'libx264', '-preset', 'medium', '-b:v', '6M', '-maxrate', '8M', '-bufsize', '12M', '-movflags', '+faststart', '-an', out]);
  else execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.jpg'), '-vf', 'format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-b:v', '6M', '-maxrate', '8M', '-bufsize', '12M', '-movflags', '+faststart', '-an', out]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('anim', path.relative(ROOT, out));
}
await browser.close(); server.close();
