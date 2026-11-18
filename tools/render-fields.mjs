// Render the light fields (assets/js/fields.js) as seamless 10 s loops, like tools/render-shaders.mjs does for the shader
// looks: assets/video/<id>.{mp4,jpg} (site preview, 810x1080) and downloads/backgrounds/..._{master,feed,story}.mp4
// node tools/render-fields.mjs [prism-streak,blue-vortex,...]   (all when left out; needs Google Chrome and ffmpeg)
import fs from 'fs';
import path from 'path';
import http from 'http';
import os from 'os';
import { execFileSync } from 'child_process';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
// grain is kept low here: per-frame noise does not compress (the live lab can add more)
// the light fields (assets/js/fields.js): id, label, family, tone, and the field options
export const FIELD_LOOPS = {
  'prism-streak': ['bg28-field-prism-streak', { mode: 'streak', palette: 'fuse' }],
  'blue-streak': ['bg29-field-blue-streak', { mode: 'streak', palette: 'deep-blue' }],
  'lilac-streak': ['bg30-field-lilac-streak', { mode: 'streak', palette: 'lilac' }],
  'ember-streak': ['bg31-field-ember-streak', { mode: 'streak', palette: 'ember' }],
  'ice-streak': ['bg32-field-ice-streak', { mode: 'streak', palette: 'ice-blue' }],
  'prism-blue': ['bg33-field-prism-blue', { mode: 'prism', palette: 'prism-blue' }],
  'prism-deep': ['bg34-field-prism-deep', { mode: 'prism', palette: 'deep-blue', turn: 1.3, seed: .37, flip: true }],
  'prism-lime': ['bg35-field-prism-lime', { mode: 'prism', palette: 'lime-blue', turn: -1, seed: .61 }],
  'lime-vortex': ['bg36-field-lime-vortex', { mode: 'swirl', palette: 'lime' }],
  'blue-vortex': ['bg37-field-blue-vortex', { mode: 'swirl', palette: 'blue-lime', turn: 2.2, flip: true, seed: .4 }],
  'peach-fog': ['bg38-field-peach-fog', { mode: 'fog', palette: 'peach' }],
  'lilac-fog': ['bg39-field-lilac-fog', { mode: 'fog', palette: 'lilac' }],
  'blue-fog': ['bg40-field-blue-fog', { mode: 'fog', palette: 'prism-blue', turn: .8, seed: .43 }],
  'ice-fog': ['bg41-field-ice-fog', { mode: 'fog', palette: 'ice-blue', seed: .19, flip: true }],
  'data-glitch': ['bg42-field-data-glitch', { mode: 'sort', palette: 'holo' }],
  'blue-glitch': ['bg43-field-blue-glitch', { mode: 'sort', palette: 'prism-blue', seed: .23 }],
  'lilac-grain': ['bg44-field-lilac-grain', { mode: 'grain', palette: 'lilac', seed: .53 }],
  'blue-grain': ['bg45-field-blue-grain', { mode: 'grain', palette: 'deep-blue', seed: .29, turn: 2 }],
  'mono-glitch': ['bg46-field-mono-glitch', { mode: 'sort', palette: 'mono', seed: .71, flip: true }],
  'ember-grain': ['bg47-field-ember-grain', { mode: 'grain', palette: 'ember', seed: .83, flip: true }],
};
const LOOPS = FIELD_LOOPS;
const want = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2].split(',') : Object.keys(LOOPS);
// --w 1280 --h 640 --to file.mp4 renders one look at another size to one file (used for the LED-wall mockup)
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = 24, SEC = 10, W = +arg('w', 1440), H = +arg('h', 1920), TO = arg('to', '');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (req.url === '/') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end('<!doctype html><body style="margin:0"><canvas id=c></canvas>'); }
  if (!p.startsWith(ROOT) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=metal', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
await page.goto(`http://127.0.0.1:${server.address().port}/`);

for (const mode of want) {
  const [id, o] = LOOPS[mode];
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'me-shader-'));
  await page.evaluate(async ({ mode, o, W, H }) => {
    const { mountField } = await import('/assets/js/fields.js');
    const c = document.getElementById('c'); c.width = W; c.height = H;
    window.api = await mountField(c, { grain: .035, ...o });
  }, { mode, o, W, H });
  const N = FPS * SEC;
  for (let i = 0; i < N; i++) {
    const b64 = await page.evaluate(i => { window.api.draw(i / 240); return document.getElementById('c').toDataURL('image/jpeg', .96).split(',')[1]; }, i);
    fs.writeFileSync(path.join(tmp, `f${String(i).padStart(4, '0')}.jpg`), Buffer.from(b64, 'base64'));
  }
  if (TO) { execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.jpg'), '-vf', 'format=yuv420p', '-c:v', 'libx264', '-b:v', '1.6M', '-maxrate', '2M', '-bufsize', '4M', '-movflags', '+faststart', '-an', path.resolve(TO)]); fs.rmSync(tmp, { recursive: true, force: true }); console.log('rendered', TO); continue; }
  const dl = p => path.join(ROOT, 'downloads/backgrounds', `minimal-effort_loop_${id}_${p}.mp4`);
  const enc = (vf, out, rate = '6M') => execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.jpg'), '-vf', vf + ',format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-b:v', rate, '-maxrate', rate, '-bufsize', '12M', '-movflags', '+faststart', '-an', out]);
  enc('null', dl('master-1440x1920'), '8M');
  enc('scale=1080:1350:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1350', dl('feed-1080x1350'), '5M');
  enc('scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920', dl('story-1080x1920'), '6M');
  enc('scale=810:1080:flags=lanczos', path.join(ROOT, 'assets/video', id + '.mp4'), '1.2M');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(tmp, 'f0000.jpg'), '-vf', 'scale=810:1080:flags=lanczos', '-q:v', '3', path.join(ROOT, 'assets/video', id + '.jpg')]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('rendered', id);
}
await browser.close(); server.close();
