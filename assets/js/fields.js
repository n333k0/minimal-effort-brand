// Minimal Effort light fields: shapeless, textural backgrounds drawn by WebGL, taken from the ME reference posters —
// STREAK (an anamorphic prism streak with a chromatic split, like FUSE / Kilimanjaro), SWIRL (a zoom-blur vortex, like the
// Four Tet poster), FOG (soft colour fog with grain, like the Rüfüs residency), SORT (pixel-sorted glitch bands, like the
// holographic system sheet), PRISM (refracted light shards in a deep field, like The Works) and GRAIN (a film-grain
// gradient with dust). No logo, no hard shape: light and texture only, so a field never fights the flyer's type.
// Every motion is periodic over one loop (phase 0..1), so a recording of one loop is seamless. Same API as shaders.js.
// Rendered to loops by tools/render-fields.mjs.

export const FIELD_PALETTES = {
  'prism-blue': { bg: '#03061A', a: '#2B5BFF', b: '#7FD8FF', c: '#F5F6FC' },
  'deep-blue': { bg: '#020414', a: '#1B2FD6', b: '#6E7CFF', c: '#B9F0FF' },
  'ice-blue': { bg: '#BFD2F2', a: '#F5F6FC', b: '#4F7BFF', c: '#A79BEE' },
  'blue-lime': { bg: '#040A1E', a: '#2E57F5', b: '#B4F152', c: '#F5F6FC' },
  'lime-blue': { bg: '#030820', a: '#B4F152', b: '#3D6BFF', c: '#F2FFD6' },
  fuse: { bg: '#07070B', a: '#5DE0E6', b: '#FFB04A', c: '#F5F6FC' },
  lime: { bg: '#0A1205', a: '#B4F152', b: '#3E7A12', c: '#F2FFD6' },
  lilac: { bg: '#2A2150', a: '#A79BEE', b: '#FFC6B0', c: '#F5F6FC' },
  peach: { bg: '#E9DCEB', a: '#F7B9A2', b: '#A79BEE', c: '#F5F6FC' },
  holo: { bg: '#0B0B10', a: '#7FE0FF', b: '#FF7AE0', c: '#B4F152' },
  ember: { bg: '#120604', a: '#FF5A1F', b: '#FFC46B', c: '#FFF1DE' },
  mono: { bg: '#0B0B10', a: '#8A8C96', b: '#F5F6FC', c: '#F5F6FC' },
};
export const FIELD_MODES = { streak: 'Prism streak', swirl: 'Zoom swirl', fog: 'Colour fog', sort: 'Pixel sort', prism: 'Prism shards', grain: 'Film grain' };

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }';
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uPh, uMode, uGrain, uAmt, uSeed, uTurn, uFlip;
uniform vec3 uBg, uA, uB, uC;
#define TAU 6.2831853
// seed 0: the original hash (the first loops were rendered with it). A seed: an exact integer hash (the simplex-noise
// permute, mod 289) on a lattice moved by whole cells — the float hash broke into tiles when shifted
float h21(vec2 p){
  if (uSeed == 0.) { p = fract(p * vec2(123.34, 456.21) + uSeed); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  vec2 q = mod(floor(p) + floor(uSeed * 100.) * vec2(7., 13.), 289.) + fract(p);
  float h = mod((q.x * 34. + 1.) * q.x, 289.); h = mod(((h + q.y) * 34. + 1.) * (h + q.y), 289.);
  return fract(h / 41. + h * .0137);
}
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 6; i++) { s += a * vn(p); p = p * 2.02 + 13.7; a *= .5; } return s; }
// loop-safe travel: a circle in noise space, once per loop
vec2 orb(float r){ return vec2(cos(uPh * TAU), sin(uPh * TAU)) * r; }
vec2 orb2(float r, float k){ return vec2(cos(uPh * TAU * k + 1.3), sin(uPh * TAU * k + 1.3)) * r; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
// a smooth colour ramp through the palette: bg -> a -> b -> c
vec3 ramp(float t){ t = clamp(t, 0., 1.); return t < .45 ? mix(uBg, uA, smoothstep(0., .45, t)) : t < .8 ? mix(uA, uB, smoothstep(.45, .8, t)) : mix(uB, uC, smoothstep(.8, 1., t)); }

// a spectrum for dispersion fringes (t 0..1 across the fringe)
vec3 spec(float t){ return clamp(abs(mod(t * 6. + vec3(0., 4., 2.), 6.) - 3.) - 1., 0., 1.); }
float ridge(vec2 p){ float n = fbm(p); return pow(1. - abs(2. * n - 1.), 5.); }

// STREAK: wide anamorphic washes of light, several deep, smeared sideways, with colour fringes that open up away from
// the core — the whole frame is light, not one line
vec3 streak(vec2 q){
  vec2 p = rot(-.38) * q;
  vec3 col = uBg;
  float wash = fbm(vec2(p.x * .35, p.y * 2.6) + orb(.7));                    // the smeared ground everything sits in
  col += mix(uA, uB, fbm(vec2(p.x * .25, p.y * 1.2) - orb(.5))) * pow(wash, 2.2) * .9;
  for (int i = 0; i < 4; i++) {
    float fi = float(i), wv = .2 + .5 * h21(vec2(fi, 1.)), off = (fi - 1.5) * .42 + .1 * sin(uPh * TAU + fi * 1.7);
    float y = p.y + .14 * sin(p.x * (1.1 + fi * .3) + uPh * TAU * (mod(fi, 2.) < .5 ? 1. : -1.) + fi) - off;
    float tex = fbm(vec2(p.x * .5 + fi * 3., y * 7.) + orb2(.8, 1.));
    float body = exp(-pow(y / (wv * .5), 2.)) * (.35 + .9 * tex);
    vec3 fr = spec(.5 + y / wv * .9 + .1 * tex);                                 // a rainbow edge across the streak
    col += (mix(uA, uC, exp(-pow(y / (wv * .12), 2.))) * .8 + fr * .35) * body * (i == 1 ? 1.1 : .55);
  }
  return col;
}
// SWIRL: a zoom-blurred vortex filling the frame — streaks running round and out from a point off centre
vec3 swirl(vec2 q){
  vec2 c = q - vec2(.18, .12) - .06 * vec2(sin(uPh * TAU), cos(uPh * TAU));
  float r = length(c), a = atan(c.y, c.x), tw = a + 1.1 * log(r + .1) - uPh * TAU;
  float v = 0.;
  vec2 cy = vec2(cos(tw), sin(tw));                                            // continuous all the way round (no seam)
  for (int i = 0; i < 7; i++) v += fbm(cy * 1.8 + vec2(r * .9 + float(i) * .11, float(i) * .07) + orb(.35));   // zoom blur: the same streak at a few radii
  v /= 7.;
  float rays = fbm(vec2(cos(tw), sin(tw)) * 9. + r * 1.5 + orb2(.6, 1.));
  v = (v - .32) * 1.05 + rays * .12 + .32 * exp(-r * 2.2) + .08;                       // contrast; brighter towards the eye, never a blob
  return ramp(clamp(v, 0., .9));
}
// FOG: big soft clouds of colour moving slowly, like an out-of-focus photo
vec3 fog(vec2 q){
  vec2 w = q * 1.1; w += .5 * vec2(fbm(w + orb(.7)), fbm(w + 4.1 - orb(.7)));
  float n = fbm(w * .9 + orb2(.4, 1.)), m = fbm(w * .7 + 7.3 - orb(.5));
  vec3 col = mix(uBg, uA, smoothstep(.3, .75, n));
  col = mix(col, uB, smoothstep(.45, .8, m) * .85);
  col = mix(col, uC, smoothstep(.62, .9, n * m * 1.7) * .6);
  return col;
}
// SORT: a dark holographic field, cut into horizontal bands of different heights; some bands are pulled sideways and
// smeared along the row (pixel sorting), with the colour channels slightly apart
vec3 sortF(vec2 uv){
  float rows = 54.; float band = floor(uv.y * rows);
  float grp = floor(uv.y * 7. + h21(vec2(band, 5.)) * .6);
  float k = h21(vec2(grp, 7.)), on = step(.38, k);
  float shift = on * (h21(vec2(grp, 2.)) - .5) * .7 * sin(uPh * TAU + k * TAU);
  vec2 p = vec2(uv.x + shift, uv.y);
  float sm = on * h21(vec2(band, 11.)) * .5;                                    // how far this row smears
  vec2 base = vec2(mix(p.x, floor(p.x * 6.) / 6., sm), p.y) * vec2(1.6, 2.4);
  float r = fbm(base + vec2(.02, 0.) + orb(.8)), g = fbm(base + orb(.8)), b = fbm(base - vec2(.025, 0.) + orb(.8));
  vec3 col = vec3(ramp(smoothstep(.22, .8, r)).r, ramp(smoothstep(.22, .8, g)).g, ramp(smoothstep(.22, .8, b)).b);
  col = mix(col, mix(uA, uB, fract(p.x * .8 + uv.y * .3 + uPh)), on * .25);
  col *= .82 + .18 * step(.5, h21(vec2(band, 3.)));                             // scan-banding
  return col;
}
// PRISM: light through a prism — a few wide, soft beams with spectral fringes and caustic ripples, over a deep field
vec3 prism(vec2 q){
  vec3 col = uBg * (1. + .35 * fbm(q * 1.2 + orb(.4)));
  float L = dot(uBg, vec3(.3, .55, .15)), gain = mix(1., .32, smoothstep(.3, .8, L));   // on a light field the light is gentler
  for (int i = 0; i < 3; i++) {
    float fi = float(i), ang = -.55 + fi * .5 + .1 * sin(uPh * TAU + fi * 2.);
    vec2 d = rot(ang) * q; float pos = (fi - 1.) * .55 + .25 * sin(uPh * TAU * (fi == 1. ? -1. : 1.) + fi * 2.1);
    float w = .28 + .18 * h21(vec2(fi, 4.)), y = (d.y - pos) / w;
    float beam = exp(-y * y * 2.2) * (.55 + .6 * fbm(vec2(d.x * .6, d.y * 4.) + orb2(.5, 1.) + fi));
    vec3 fr = mix(uA, spec(.55 + y * .35), smoothstep(.2, 1., abs(y)));        // core in the palette, spectral edges
    col += fr * beam * .55 * gain;
    float cau = pow(1. - abs(2. * fbm(vec2(d.x * .7, d.y * 1.6) + orb(.6) + fi * 5.) - 1.), 3.);   // soft caustic ripples
    col += uC * cau * exp(-y * y * 3.) * .22 * gain;
  }
  col += uB * .22 * gain * exp(-length(q - vec2(.15, -.05)) * 1.8);
  return col;
}
// GRAIN: a slow two-colour gradient with heavy film grain, dust and the odd scratch
vec3 grainF(vec2 q, vec2 fc){
  float n = fbm(q * .8 + orb(.45));
  vec3 col = mix(uBg, uA, smoothstep(.2, .85, n + q.y * .25));
  col = mix(col, uB, smoothstep(.55, .95, fbm(q * 1.4 - orb(.6))) * .6);
  float f = floor(uPh * 240.);
  float dust = 0.;
  float scratch = step(.997, h21(vec2(floor(fc.x / 1.5), f))) * smoothstep(.0, .3, h21(vec2(f, 9.)) - .7);
  return col + uC * (dust + scratch * .5);
}
void main(){
  vec2 fc = gl_FragCoord.xy, uv = fc / uRes, q = (fc - .5 * uRes) / min(uRes.x, uRes.y) * 2.;
  q = rot(uTurn) * q; if (uFlip > .5) { q.x = -q.x; uv.x = 1. - uv.x; }   // each loop its own composition
  vec3 col;
  if (uMode < .5) col = streak(q);
  else if (uMode < 1.5) col = swirl(q);
  else if (uMode < 2.5) col = fog(q);
  else if (uMode < 3.5) col = sortF(uv);
  else if (uMode < 4.5) col = prism(q);
  else col = grainF(q, fc);
  // on a light field, light is added gently (else it burns to white)
  float L = dot(uBg, vec3(.3, .55, .15)); if (L > .5 && uMode < 4.5 && (uMode < 1.5 || uMode > 3.5)) col = uBg + (col - uBg) * .4;
  // film grain on every look (the reference posters are all printed, never clean digital gradients)
  float g = h21(fc + floor(uPh * 240.) * 3.17) - .5;
  col += g * uGrain * (uMode > 4.5 ? 2.2 : 1.);
  col *= 1. - .22 * pow(length(uv - .5) * 1.25, 2.4);                 // a soft vignette
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
}`;

const hex = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };

export async function mountField(canvas, opts = {}) {
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false });
  if (!gl) throw new Error('WebGL not available');
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr); gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);
  const state = { mode: 'streak', palette: 'prism-blue', grain: .07, seed: 0, loop: 10, speed: 1, ...opts };
  const api = {
    state,
    set(o) { Object.assign(state, o); },
    draw(phase) {
      const P = FIELD_PALETTES[state.palette] || FIELD_PALETTES['prism-blue'];
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U('uRes'), canvas.width, canvas.height); gl.uniform1f(U('uPh'), phase % 1);
      gl.uniform3fv(U('uBg'), hex(P.bg)); gl.uniform3fv(U('uA'), hex(P.a)); gl.uniform3fv(U('uB'), hex(P.b)); gl.uniform3fv(U('uC'), hex(P.c));
      gl.uniform1f(U('uMode'), Object.keys(FIELD_MODES).indexOf(state.mode)); gl.uniform1f(U('uGrain'), state.grain); gl.uniform1f(U('uSeed'), state.seed || 0); gl.uniform1f(U('uTurn'), state.turn || 0); gl.uniform1f(U('uFlip'), state.flip ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    play() { let t0 = performance.now(), raf; const f = now => { api.draw(((now - t0) / 1000 * state.speed / state.loop) % 1); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); api.stop = () => cancelAnimationFrame(raf); },
  };
  return api;
}
