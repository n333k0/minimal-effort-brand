// Minimal Effort shader lab: the ME drawn live by WebGL in three looks — GLASS (a glass ME refracting moving brand light),
// PIXEL (the ME in ordered-dither pixels with a scan) and GRIT (the ME in toner noise that eats and rebuilds its edges).
// Every motion is periodic over one loop (uLoop seconds, 10 by default), so a recording of exactly one loop is seamless.
// Used by the guidelines (shader lab section) and by tools/render-shaders.mjs (which renders the background loops).

export const PALETTES = {
  brand: { label: 'Midnight · Lime · Lilac', bg: '#14141A', a: '#B4F152', b: '#A79BEE' },
  lime: { label: 'Lime field', bg: '#B4F152', a: '#14141A', b: '#A79BEE' },
  lilac: { label: 'Lilac field', bg: '#A79BEE', a: '#14141A', b: '#F5F6FC' },
  ice: { label: 'Ice', bg: '#F5F6FC', a: '#14141A', b: '#A79BEE' },
  ember: { label: 'Ember', bg: '#1A0B08', a: '#FF6A2A', b: '#FFD08A' },
  maze: { label: 'MAZE orange', bg: '#FF4A1A', a: '#B4F152', b: '#9A93E0' },
  violet: { label: 'MAZE violet', bg: '#1E1550', a: '#B4F152', b: '#9A62E8' },
  mono: { label: 'Mono', bg: '#0B0B10', a: '#F5F6FC', b: '#8A8C96' },
  acid: { label: 'Acid', bg: '#0B0B10', a: '#B4F152', b: '#2F4214' },
};
// round 5: nine more looks. All periodic in one loop.
export const MODES = { glass: 'Glass', pixel: 'Pixel', grit: 'Grit', chrome: 'Chrome', holo: 'Holo film', halftone: 'Halftone', ripple: 'Ripple', echo: 'Echo tunnel', neon: 'Neon', wave: 'Flag wave', glitch: 'Glitch', melt: 'Melt' };
// the marks the light falls on: our logos, or abstract shapes (the loops use the shapes, so a background never fights
// the flyer's own logo). Shapes keep the brand geometry: the E's three bars, the M's arch, flat round forms.
export const MARKS = { orb: ['Orb', 'shape:orb'], ring: ['Ring', 'shape:ring'], pill: ['Pill', 'shape:pill'], arch: ['Arch', 'shape:arch'], bars: ['Bars', 'shape:bars'], blob: ['Blob', 'shape:blob'], square: ['Square', 'shape:square'],
  me: ['ME', 'assets/logo/me-mark.svg'], wordmark: ['MINIMAL EFFORT', 'assets/logo/wordmark.svg'], mnml: ['MNML EFFRT', 'assets/logo/mnml-effrt.svg'], maze: ['THE MAZE', 'assets/logo/the-maze.svg'] };
// a shape drawn white on transparent, with its aspect ratio
function shapeImg(kind) {
  const asp = { orb: 1, ring: 1, pill: .62, arch: .86, bars: 1.1, blob: 1.2, square: 1 }[kind] || 1, H = 900, W = Math.round(H * asp);
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.fillStyle = '#fff';
  const rr = (X, Y, w, h, r) => { x.beginPath(); x.roundRect(X, Y, w, h, r); x.fill(); };
  if (kind === 'orb') { x.beginPath(); x.arc(W / 2, H / 2, H * .46, 0, Math.PI * 2); x.fill(); }
  else if (kind === 'ring') { x.beginPath(); x.arc(W / 2, H / 2, H * .46, 0, Math.PI * 2); x.arc(W / 2, H / 2, H * .25, 0, Math.PI * 2, true); x.fill('evenodd'); }
  else if (kind === 'pill') rr(W * .04, H * .02, W * .92, H * .96, W * .46);
  else if (kind === 'arch') { const t = W * .3; x.beginPath(); x.moveTo(0, H); x.lineTo(0, W / 2); x.arc(W / 2, W / 2, W / 2, Math.PI, 0); x.lineTo(W, H); x.lineTo(W - t, H); x.lineTo(W - t, W / 2); x.arc(W / 2, W / 2, W / 2 - t, 0, Math.PI, true); x.lineTo(t, H); x.closePath(); x.fill(); }
  else if (kind === 'bars') { const b = H * .26; for (let i = 0; i < 3; i++) rr(0, i * (H - b) / 2, W, b, b * .08); }
  else if (kind === 'blob') { x.beginPath(); const n = 7; for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2, r = .42 + .07 * Math.sin(a * 3 + 1) + .04 * Math.sin(a * 5 + 2); const px = W / 2 + Math.cos(a) * r * H * asp * .95, py = H / 2 + Math.sin(a) * r * H; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.closePath(); x.fill(); }
  else rr(W * .03, H * .03, W * .94, H * .94, H * .1);
  c.asp = asp; return c;
}

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }';
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uPh; uniform sampler2D uMark; uniform vec3 uBg, uA, uB;
uniform float uScale, uGrain, uMode, uCell, uAmt, uAsp;
#define TAU 6.2831853
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 5; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
// loop-safe noise: travel round a circle in noise space once per loop
vec2 orb(float r){ return vec2(cos(uPh * TAU), sin(uPh * TAU)) * r; }
// the mark: r = sharp ME, g = blurred (height for the glass)
vec2 markUV(vec2 fc){ float W = uScale * min(uRes.x, uRes.y * uAsp); vec2 d = (fc - uRes * .5) / vec2(W, W / uAsp); return d + .5; }
vec3 pal(float t){ return .5 + .5 * cos(TAU * (t + vec3(0., .33, .67))); }
vec4 mark(vec2 uv){ if (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) return vec4(0.); return texture2D(uMark, vec2(uv.x, 1. - uv.y)); }
float bayer(vec2 p){ vec2 q = mod(floor(p), 4.); float x = q.x, y = q.y;
  float b = mod(x, 2.) * 2. + mod(y, 2.) * 3. - 2. * mod(x, 2.) * mod(y, 2.);
  float c = mod(floor(x / 2.), 2.) * 2. + mod(floor(y / 2.), 2.) * 3. - 2. * mod(floor(x / 2.), 2.) * mod(floor(y / 2.), 2.);
  return (b * 4. + c + .5) / 16.; }
vec3 light(vec2 q){ // moving brand light (the "liquid light" family): a domain-warped sine field, periodic in uPh
  vec2 w = q * 2.8; float a = uPh * TAU;
  for (int i = 0; i < 5; i++) { float fi = float(i); w += .32 * vec2(sin(w.y * 1.7 + a + fi * 1.1), cos(w.x * 1.9 - a + fi * 1.7)); }
  float n = .5 + .5 * sin(w.x * 1.2 + w.y * .8), m = .5 + .5 * sin(w.x * -.7 + w.y * 1.6 + 2.);
  vec3 c = mix(uBg, uB, smoothstep(.35, .95, n) * .95); c = mix(c, uA, smoothstep(.62, 1., m) * .9); c = mix(c, uBg, smoothstep(.55, .0, n * m) * .5);
  return c; }
void main(){
  vec2 fc = gl_FragCoord.xy, q = fc / uRes.y; vec3 col;
  vec2 uv = markUV(fc); float px = 1. / (uScale * min(uRes.x, uRes.y * uAsp));
  float e = px * 10.; vec2 nrm = vec2(mark(uv + vec2(e, 0)).g - mark(uv - vec2(e, 0)).g, mark(uv + vec2(0, e)).g - mark(uv - vec2(0, e)).g);
  if (uMode < .5) {
    // GLASS
    float h = mark(uv).g;
    float body = smoothstep(.05, .5, h);
    vec3 base = light(q) * .7;
    vec2 off = nrm * 1.1 + (q - .5) * .12 * body;
    vec3 refr = vec3(light(q * .8 + off * 1.0).r, light(q * .8 + off * 1.15).g, light(q * .8 + off * 1.3).b);
    vec3 L = normalize(vec3(cos(uPh * TAU) * .7, sin(uPh * TAU) * .7, .9));
    float spec = pow(max(0., dot(normalize(vec3(nrm * 4., 1.)), L)), 60.);
    float fres = smoothstep(.0, .6, length(nrm) * 3.);
    col = mix(base, refr * 1.08 + .03, body);
    col += (spec * 1.5 + fres * .38) * body;
    col += uA * fres * body * .12;
  } else if (uMode < 1.5) {
    // PIXEL: the ME on a pixel grid, ordered dither, a scan travelling down once per loop
    vec2 cell = floor(fc / uCell) * uCell + uCell * .5;
    vec2 cuv = markUV(cell); float m = mark(cuv).g;
    float scan = fract(cell.y / uRes.y + uPh); scan = smoothstep(.0, .08, scan) * (1. - smoothstep(.08, .22, scan));
    float fld = smoothstep(.45, .8, fbm(cell / uRes.y * 3. + orb(.7)));
    float v = clamp(m * 1.25 + fld * (1. - m) * .4 + scan * .55, 0., 1.);
    float d = bayer(fc / uCell);
    float on = step(d, v), hi = step(d, v - .45);
    col = mix(uBg, uB, on); col = mix(col, uA, hi);
    vec2 g = fract(fc / uCell); col *= .86 + .14 * step(.12, g.x) * step(.12, g.y);
  } else if (uMode > 2.5 && uMode < 3.5) {
    // CHROME: liquid metal, a studio of light bands sliding across the letters
    float h = mark(uv).g, body = smoothstep(.05, .45, h); vec2 n2 = nrm * 3.2 * uAmt;
    float t = n2.y * 2.4 + n2.x * 1.1 + q.y * 1.4 + .6 * sin(uPh * TAU + q.x * 2.);
    vec3 metal = mix(vec3(.05), vec3(1.), smoothstep(-.2, .9, sin(t * 6.)));
    metal = mix(metal, uB, .3 * (.5 + .5 * sin(t * 2. + 1.))); metal += uA * pow(max(0., sin(t * 3. - uPh * TAU)), 24.) * .8;
    col = mix(uBg + light(q) * .06, metal, body);
  } else if (uMode > 3.5 && uMode < 4.5) {
    // HOLO FILM: thin-film rainbow on a glass ME over a pale field
    float h = mark(uv).g, body = smoothstep(.05, .45, h);
    vec3 film = pal(h * 1.4 + dot(nrm, vec2(2., 1.2)) * uAmt + uPh + q.y * .3);
    film = mix(film, vec3(1.), .35); float spec = pow(max(0., dot(normalize(vec3(nrm * 4., 1.)), normalize(vec3(cos(uPh * TAU), sin(uPh * TAU), 1.)))), 40.);
    col = mix(uBg * .96 + pal(q.x * .3 + uPh) * .04, film + spec, body);
  } else if (uMode > 4.5 && uMode < 5.5) {
    // HALFTONE: the ME as a rotated dot screen breathing with the light
    vec2 r = mat2(.7071, -.7071, .7071, .7071) * fc; vec2 cell = (floor(r / uCell) + .5) * uCell; vec2 back = mat2(.7071, .7071, -.7071, .7071) * cell;
    float m = mark(markUV(back)).g, l = dot(light(back / uRes.y), vec3(.33));
    float v = clamp(m * (.85 + .15 * sin(uPh * TAU)) + l * .25 * (1. - m), 0., 1.);
    float d = length(r - cell) / uCell;
    col = mix(uBg, mix(uB, uA, step(.5, m)), 1. - smoothstep(v * .62 - .04, v * .62 + .04, d));
  } else if (uMode > 5.5 && uMode < 6.5) {
    // RIPPLE: rings travel out from the centre and bend the ME
    vec2 c = (fc - uRes * .5) / uRes.y; float r = length(c);
    float w = sin(r * 38. - uPh * TAU * 3.) * .012 * uAmt / (r + .25);
    vec2 uv2 = markUV(fc + normalize(c + 1e-4) * w * uRes.y);
    float m = mark(uv2).r; float ring = .5 + .5 * sin(r * 38. - uPh * TAU * 3.);
    col = mix(uBg, uB, ring * .18 * smoothstep(.9, .1, r)); col = mix(col, uA, m);
  } else if (uMode > 6.5 && uMode < 7.5) {
    // ECHO TUNNEL: the ME repeats inward, every copy zooming one step per loop
    col = uBg;
    for (int i = 0; i < 9; i++) { float fi = float(i), k = fract((fi + uPh) / 9.); float z = .12 + k * k * 2.6;
      vec2 u2 = (uv - .5) / z + .5; float m = mark(u2).r * smoothstep(1., .75, k) * smoothstep(.0, .12, k);
      col = mix(col, mod(fi, 2.) < .5 ? uA : uB, m); }
  } else if (uMode > 7.5 && uMode < 8.5) {
    // NEON: a tube along the letters' outline, glowing, with a stutter twice a loop
    float g = mark(uv).b; float tube = 1. - smoothstep(.06, .2, abs(g - .5));
    float glow = exp(-abs(g - .5) * 3.5) * .9; float st = step(.06, abs(fract(uPh * 2.) - .3)) * .7 + .3;
    col = uBg + uA * (tube * 1.2 + glow * .5) * st + uB * glow * .25 * (1. - st);
  } else if (uMode > 8.5 && uMode < 9.5) {
    // FLAG WAVE: the ME as cloth, its shadow copy in the second colour
    vec2 u2 = uv; u2.y += sin(u2.x * TAU * 1.5 + uPh * TAU) * .06 * uAmt; u2.x += sin(u2.y * TAU + uPh * TAU) * .02 * uAmt;
    float m = mark(u2).r, sh = mark(u2 + vec2(-.02, .04)).r, shade = .85 + .15 * sin(u2.x * TAU * 1.5 + uPh * TAU + 1.2);
    col = mix(uBg, uB, sh * (1. - m)); col = mix(col, uA * shade, m);
  } else if (uMode > 9.5 && uMode < 10.5) {
    // GLITCH: horizontal slices slip and the channels split, a few times a loop
    float row = floor(fc.y / (uRes.y / 26.)), tk = floor(uPh * 16.); float on = step(.62, h21(vec2(row, tk)));
    float off = (h21(vec2(row * 1.7, tk + 3.)) - .5) * .22 * on * uAmt;
    float r = mark(uv + vec2(off + .008 * uAmt, 0)).r, g = mark(uv + vec2(off, 0)).r, b = mark(uv + vec2(off - .008 * uAmt, 0)).r;
    col = mix(uBg, uA, g); col.r = mix(col.r, uB.r, r * (1. - g)); col.b = mix(col.b, uB.b, b * (1. - g));
    col += step(.985, h21(vec2(floor(fc.x / 3.), row + tk))) * on * .5;
  } else if (uMode > 10.5 && uMode < 11.5) {
    // MELT: the letters drip down and pull back up once a loop
    float drip = pow(fbm(vec2(uv.x * 7., 3.)), 2.2) * (.5 - .5 * cos(uPh * TAU)) * .7 * uAmt;
    vec2 u2 = vec2(uv.x, uv.y + drip * smoothstep(.0, 1., 1. - uv.y));
    float m = 0.; for (int i = 0; i < 6; i++) m = max(m, mark(u2 + vec2(0., float(i) * drip * .08)).r);
    col = mix(uBg, uA, m); col = mix(col, uB, mark(uv).r * (1. - m) * .5);
  } else {
    // GRIT: toner noise; the ME's edges are eaten and rebuilt
    float m = mark(uv).b;
    vec2 gq = fc / uRes.y;
    float n = fbm(gq * 24. + orb(1.6)) * .75 + h21(floor(fc / 1.5) + floor(uPh * 48.)) * .25;
    float eat = 1.05 + .5 * sin(uPh * TAU);
    float ink = step(.5, m + (n - .5) * eat);
    float tone = .5 + .5 * sin(gq.x * 3.1 + 1.7 * sin(gq.y * 2.3 + uPh * TAU) + uPh * TAU);
    float speck = step(.982, h21(floor(fc / 2.) + floor(uPh * 24.) * 1.7)) * step(.45, tone);
    col = mix(uBg, uA, ink); col = mix(col, uB, speck * (1. - ink));
    col = mix(col, col * (.78 + .3 * tone), .6);
  }
  float gr = (h21(fc + fract(uPh * 37.) * 911.) - .5) * uGrain; col += gr;
  float vig = smoothstep(1.25, .35, length((fc - uRes * .5) / uRes.y)); col *= mix(.82, 1., vig);
  gl_FragColor = vec4(col, 1.);
}`;

const hex = h => { const n = parseInt(h.replace('#', ''), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };

// the ME as a texture: red = sharp, green = blurred height
async function markCanvas(src = 'assets/logo/me-mark.svg') {
  let img, asp;
  if (src.startsWith('shape:')) { img = shapeImg(src.slice(6)); asp = img.asp; }
  else {
    const svg = await fetch(src).then(r => r.text());
    const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1]?.split(/[\s,]+/).map(Number); asp = vb ? vb[2] / vb[3] : 2.0713;
    img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/fill="[^"]*"/g, 'fill="#fff"'));
    await img.decode();
  }
  const W = 1024, H = Math.round(W / asp), pad = 40;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const sharp = document.createElement('canvas'); sharp.width = W; sharp.height = H; const sx = sharp.getContext('2d');
  sx.fillStyle = '#000'; sx.fillRect(0, 0, W, H); sx.drawImage(img, pad, pad * H / W, W - 2 * pad, H - 2 * pad * H / W);
  x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
  x.globalCompositeOperation = 'lighter';
  const blur = document.createElement('canvas'); blur.width = W; blur.height = H; const bx = blur.getContext('2d');
  bx.filter = 'blur(22px)'; bx.drawImage(sharp, 0, 0); bx.filter = 'none';
  // keep the blur inside the letters so the glass edge is rounded, not haloed
  bx.globalCompositeOperation = 'multiply'; bx.drawImage(sharp, 0, 0);
  const a = sx.getImageData(0, 0, W, H), b = bx.getImageData(0, 0, W, H), o = x.createImageData(W, H);
  const heavy = document.createElement('canvas'); heavy.width = W; heavy.height = H; const hx = heavy.getContext('2d');
  hx.filter = 'blur(9px)'; hx.drawImage(sharp, 0, 0); const hv = hx.getImageData(0, 0, W, H);
  for (let i = 0; i < a.data.length; i += 4) { o.data[i] = a.data[i]; o.data[i + 1] = Math.min(255, b.data[i] * 1.6); o.data[i + 2] = hv.data[i]; o.data[i + 3] = 255; }
  x.putImageData(o, 0, 0); c.asp = asp; return c;
}

export async function mountShader(canvas, opts = {}) {
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false });
  if (!gl) throw new Error('WebGL not available');
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr); gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  let asp = 2.0713;
  const load = async key => { const m = await markCanvas((MARKS[key] || MARKS.me)[1]); asp = m.asp; gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, m); };
  await load(opts.mark || 'me');
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
  const U = n => gl.getUniformLocation(pr, n);
  const state = { mode: 'glass', palette: 'brand', scale: .62, grain: .06, cell: 12, loop: 10, speed: 1, amt: 1, mark: 'me', ...opts };
  const api = {
    state,
    set(o) { const m = o.mark && o.mark !== state.mark; Object.assign(state, o); if (m) return load(state.mark); },
    draw(phase) {
      const P = PALETTES[state.palette] || PALETTES.brand;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U('uRes'), canvas.width, canvas.height); gl.uniform1f(U('uPh'), phase % 1);
      gl.uniform3fv(U('uBg'), hex(P.bg)); gl.uniform3fv(U('uA'), hex(P.a)); gl.uniform3fv(U('uB'), hex(P.b));
      gl.uniform1f(U('uScale'), state.scale); gl.uniform1f(U('uGrain'), state.grain); gl.uniform1f(U('uMode'), Object.keys(MODES).indexOf(state.mode));
      gl.uniform1f(U('uCell'), state.cell * canvas.width / 1080); gl.uniform1i(U('uMark'), 0); gl.uniform1f(U('uAmt'), state.amt ?? 1); gl.uniform1f(U('uAsp'), asp);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    play() { let t0 = performance.now(), raf; const f = now => { api.draw(((now - t0) / 1000 * state.speed / state.loop) % 1); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); api.stop = () => cancelAnimationFrame(raf); return api; },
  };
  return api;
}
