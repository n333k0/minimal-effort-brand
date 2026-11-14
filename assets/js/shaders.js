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
};
export const MODES = { glass: 'Glass', pixel: 'Pixel', grit: 'Grit' };

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }';
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uPh; uniform sampler2D uMark; uniform vec3 uBg, uA, uB;
uniform float uScale, uGrain, uMode, uCell;
#define TAU 6.2831853
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 5; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
// loop-safe noise: travel round a circle in noise space once per loop
vec2 orb(float r){ return vec2(cos(uPh * TAU), sin(uPh * TAU)) * r; }
// the mark: r = sharp ME, g = blurred (height for the glass)
vec2 markUV(vec2 fc){ float W = uScale * min(uRes.x, uRes.y * 2.0713); vec2 d = (fc - uRes * .5) / vec2(W, W / 2.0713); return d + .5; }
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
  vec2 uv = markUV(fc); float px = 1. / (uScale * min(uRes.x, uRes.y * 2.0713));
  if (uMode < .5) {
    // GLASS
    float h = mark(uv).g, inside = mark(uv).r;
    float e = px * 10.;
    float hx = mark(uv + vec2(e, 0)).g - mark(uv - vec2(e, 0)).g, hy = mark(uv + vec2(0, e)).g - mark(uv - vec2(0, e)).g;
    vec2 nrm = vec2(hx, hy);
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
  const svg = await fetch(src).then(r => r.text());
  const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/fill="[^"]*"/g, 'fill="#fff"'));
  await img.decode();
  const W = 1024, H = Math.round(W / 2.0713), pad = 40;
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
  x.putImageData(o, 0, 0); return c;
}

export async function mountShader(canvas, opts = {}) {
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false });
  if (!gl) throw new Error('WebGL not available');
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr); gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, await markCanvas(opts.mark));
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
  const U = n => gl.getUniformLocation(pr, n);
  const state = { mode: 'glass', palette: 'brand', scale: .62, grain: .06, cell: 12, loop: 10, speed: 1, ...opts };
  const api = {
    state,
    set(o) { Object.assign(state, o); },
    draw(phase) {
      const P = PALETTES[state.palette] || PALETTES.brand;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U('uRes'), canvas.width, canvas.height); gl.uniform1f(U('uPh'), phase % 1);
      gl.uniform3fv(U('uBg'), hex(P.bg)); gl.uniform3fv(U('uA'), hex(P.a)); gl.uniform3fv(U('uB'), hex(P.b));
      gl.uniform1f(U('uScale'), state.scale); gl.uniform1f(U('uGrain'), state.grain); gl.uniform1f(U('uMode'), Object.keys(MODES).indexOf(state.mode));
      gl.uniform1f(U('uCell'), state.cell * canvas.width / 1080); gl.uniform1i(U('uMark'), 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    play() { let t0 = performance.now(), raf; const f = now => { api.draw(((now - t0) / 1000 * state.speed / state.loop) % 1); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); api.stop = () => cancelAnimationFrame(raf); return api; },
  };
  return api;
}
