// Render the shader backgrounds (assets/js/shaders.js) as seamless 10 s loops, frame by frame, like the other loops:
//   assets/video/bg15-shader-glass.{mp4,jpg} (site preview, 810x1080) and downloads/backgrounds/..._{master-1440x1920,feed-1080x1350,story-1080x1920}.mp4
// node tools/render-shaders.mjs [glass,pixel,grit]   (needs Google Chrome and ffmpeg)
import fs from 'fs';
import path from 'path';
import http from 'http';
import os from 'os';
import { execFileSync } from 'child_process';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
// grain is kept low here: per-frame noise does not compress (the live lab can add more)
const LOOPS = { glass: ['bg15-shader-glass', { palette: 'brand', scale: .7, grain: .012 }], pixel: ['bg16-shader-pixel', { palette: 'brand', scale: .72, cell: 14, grain: .01 }], grit: ['bg17-shader-grit', { palette: 'brand', scale: .7, grain: .012 }] };
const want = (process.argv[2] || 'glass,pixel,grit').split(',');
const FPS = 24, SEC = 10, W = 1440, H = 1920;

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
    const { mountShader } = await import('/assets/js/shaders.js');
    const c = document.getElementById('c'); c.width = W; c.height = H;
    window.api = await mountShader(c, { mode, ...o });
  }, { mode, o, W, H });
  const N = FPS * SEC;
  for (let i = 0; i < N; i++) {
    const b64 = await page.evaluate(i => { window.api.draw(i / 240); return document.getElementById('c').toDataURL('image/jpeg', .96).split(',')[1]; }, i);
    fs.writeFileSync(path.join(tmp, `f${String(i).padStart(4, '0')}.jpg`), Buffer.from(b64, 'base64'));
  }
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
