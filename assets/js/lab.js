// Shader lab on the guidelines page: pick a look, a palette, a format; tweak; export a PNG or record one seamless loop.
import { mountShader, PALETTES, MODES } from './shaders.js';

const root = document.getElementById('lab');
if (root) {
  const SIZES = { feed: [1080, 1350], story: [1080, 1920], square: [1080, 1080], landscape: [1920, 1080] };
  const cv = root.querySelector('canvas'), $ = s => root.querySelector(s);
  const seg = (el, items, key) => { el.innerHTML = Object.entries(items).map(([v, t]) => `<button type="button" class="lab-b" data-v="${v}">${t.label || t}</button>`).join(''); el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; set({ [key]: b.dataset.v }); }); };
  let api, fmt = 'feed';
  const press = () => root.querySelectorAll('[data-k]').forEach(g => g.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === (g.dataset.k === 'format' ? fmt : api?.state[g.dataset.k])))));
  function size() { const [w, h] = SIZES[fmt], k = 720 / Math.max(w, h); cv.width = Math.round(w * k); cv.height = Math.round(h * k); cv.style.aspectRatio = `${w} / ${h}`; }
  function set(o) { if (o.format) { fmt = o.format; size(); delete o.format; } api?.set(o); press(); }
  seg($('[data-k="mode"]'), MODES, 'mode'); seg($('[data-k="palette"]'), PALETTES, 'palette'); seg($('[data-k="format"]'), { feed: 'Feed', story: 'Story', square: 'Square', landscape: 'Landscape' }, 'format');
  root.querySelectorAll('input[type=range]').forEach(r => r.addEventListener('input', () => set({ [r.name]: +r.value })));
  size();
  const io = new IntersectionObserver(async es => {
    if (!es[0].isIntersecting || api) return;
    try { api = await mountShader(cv, { mode: 'glass', palette: 'brand' }); api.play(); press(); }
    catch (e) { root.querySelector('.lab-err').textContent = 'WebGL is not available in this browser.'; }
  }, { rootMargin: '300px' });
  io.observe(cv);
  const save = (url, name) => { const a = document.createElement('a'); a.href = url; a.download = name; a.click(); };
  const name = ext => `minimal-effort_shader_${api.state.mode}_${api.state.palette}_${fmt}.${ext}`;
  // full-size still
  $('.lab-png').addEventListener('click', async () => {
    if (!api) return; const [w, h] = SIZES[fmt], prev = [cv.width, cv.height];
    cv.width = w; cv.height = h; api.draw(0); save(cv.toDataURL('image/png'), name('png')); cv.width = prev[0]; cv.height = prev[1];
  });
  // one loop, recorded from the live canvas at full size
  $('.lab-rec').addEventListener('click', async e => {
    if (!api || !window.MediaRecorder) return; const btn = e.currentTarget; if (btn.disabled) return; btn.disabled = true;
    const [w, h] = SIZES[fmt], prev = [cv.width, cv.height]; cv.width = w; cv.height = h;
    api.stop(); const type = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t));
    const rec = new MediaRecorder(cv.captureStream(30), { mimeType: type, videoBitsPerSecond: 14e6 }), chunks = [];
    rec.ondataavailable = d => chunks.push(d.data);
    const done = new Promise(r => rec.onstop = r);
    const L = api.state.loop / (api.state.speed || 1), t0 = performance.now(); rec.start();
    await new Promise(r => { const f = now => { const t = (now - t0) / 1000; btn.textContent = `Recording ${Math.max(0, L - t).toFixed(1)} s`; if (t >= L) return r(); api.draw(t / L); requestAnimationFrame(f); }; requestAnimationFrame(f); });
    rec.stop(); await done;
    save(URL.createObjectURL(new Blob(chunks, { type })), name(type.includes('mp4') ? 'mp4' : 'webm'));
    cv.width = prev[0]; cv.height = prev[1]; api.play(); btn.disabled = false; btn.textContent = 'Record one loop';
  });
}
