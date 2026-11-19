"""Mockups: the identity out in the world — the DJ booth's LED front panel, a bus-shelter lightbox, a wall of wheat-pasted
posters, a billboard, and the phone (the moving ones play on the page). LED wall and talk removed 2026-11-19.
Blank scenes are generated photos (ref/gen5, ref/gen3/phone.png); every logo and poster is our real artwork composited in
code. The blank surface is found by its colour, so people standing in front of a screen stay in front of it.
Writes assets/mock/<name>.jpg (+ downloads/mockups/), and for the moving ones a mask and assets/mock/screens.json, which the
guidelines page uses to lay a live video / ticker over the still.
python3 tools/build-mockups5.py   after tools/render.mjs has rendered the examples into downloads/templates, and the art made
for the mockups:  node tools/render.mjs tools/mock/art.json --out downloads/renders/mock --no-video
(story-size posters, so the 3:5 paper is never cropped at the sides; THE MAZE in the billboard format, 2.44:1)"""
import os, json, subprocess
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
from scipy import ndimage

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.environ.get('MOCK_SRC', 'downloads/templates')
T = lambda n: os.path.join(R, SRC, n + '.png')
MK = lambda n: os.path.join(R, 'downloads/renders/mock', n + '.png')  # tools/mock/art.json
SCREENS = {}

def region(img, seed, tol, hint):
    """mask of the blank surface: pixels close to the colour at the seed, connected to it, inside the hint box"""
    a = np.asarray(img).astype(float); x0, y0, x1, y1 = hint
    sx, sy = seed; ref = np.median(a[sy - 6:sy + 6, sx - 6:sx + 6].reshape(-1, 3), 0)
    d = np.sqrt(((a - ref) ** 2).sum(2)); m = d < tol
    box = np.zeros_like(m); box[y0:y1, x0:x1] = True; m &= box
    lab, n = ndimage.label(m); m = lab == lab[sy, sx]
    m = ndimage.binary_closing(m, iterations=3)
    ys, xs = np.where(m)
    bb = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    # holes inside the box that are not people (glare, noise) are filled; people at the edges stay out
    filled = ndimage.binary_fill_holes(m)
    return filled, bb

def cover(im, w, h):
    k = max(w / im.width, h / im.height); im = im.resize((max(w, round(im.width * k)), max(h, round(im.height * k))), Image.LANCZOS)
    return im.crop(((im.width - w) // 2, (im.height - h) // 2, (im.width - w) // 2 + w, (im.height - h) // 2 + h))

def shading(img, bb, blur=30):
    c = img.crop(bb).convert('L'); a = np.asarray(c).astype(float) + 1; b = np.asarray(c.filter(ImageFilter.GaussianBlur(blur))).astype(float) + 1
    return np.clip(a / b, .6, 1.3)[..., None]

def put(base, art, mask, bb, paper=False, glow=0.0, dim=1.0):
    x0, y0, x1, y1 = bb; w, h = x1 - x0, y1 - y0
    art = cover(art.convert('RGB'), w, h)
    A = np.asarray(art).astype(float) * dim
    if paper: A = A * shading(base, bb)
    mk = Image.fromarray((mask[y0:y1, x0:x1] * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(.8))
    al = np.asarray(mk).astype(float)[..., None] / 255
    B = np.asarray(base).astype(float)
    B[y0:y1, x0:x1] = B[y0:y1, x0:x1] * (1 - al) + A * al
    out = Image.fromarray(np.clip(B, 0, 255).astype('uint8'))
    if glow:  # light from the screen spilling onto the room
        g = Image.new('RGB', out.size, 0); g.paste(art.resize((w, h)), (x0, y0)); g = g.filter(ImageFilter.GaussianBlur(w * .06))
        out = Image.fromarray(np.clip(np.asarray(out).astype(float) + np.asarray(g).astype(float) * glow * (1 - np.asarray(mask, float)[..., None]), 0, 255).astype('uint8'))
    return out, mk

def save(im, name):
    im = im.convert('RGB'); im.save(os.path.join(R, 'assets/mock', name + '.jpg'), quality=88)
    os.makedirs(os.path.join(R, 'downloads/mockups'), exist_ok=True); im.save(os.path.join(R, 'downloads/mockups', 'minimal-effort_' + name + '.jpg'), quality=92)
    print('wrote', name, im.size)

def screen(name, img, bb, mk, **extra):
    """the moving overlay: where it sits (in % of the image) and its mask"""
    mk.save(os.path.join(R, 'assets/mock', name + '-mask.png'))
    W, H = img.size; x0, y0, x1, y1 = bb
    SCREENS[name] = {'img': f'assets/mock/{name}.jpg', 'mask': f'assets/mock/{name}-mask.png', 'aspect': f'{W} / {H}', 'left': round(100 * x0 / W, 3), 'top': round(100 * y0 / H, 3), 'width': round(100 * (x1 - x0) / W, 3), 'height': round(100 * (y1 - y0) / H, 3), **extra}

def frame(mp4, t=3.0):
    tmp = os.path.join(R, 'ref/gen5/_f.png'); subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', mp4, '-frames:v', '1', tmp], check=True)
    im = Image.open(tmp).convert('RGB'); os.remove(tmp); return im

def small(src, dst, w):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', f'scale={w}:-2:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-b:v', '1.1M', '-maxrate', '1.4M', '-bufsize', '3M', '-movflags', '+faststart', '-an', os.path.join(R, dst)], check=True)

G = lambda n: Image.open(os.path.join(R, 'ref/gen5', n + '.png')).convert('RGB')

# DJ booth: the front panel is an LED screen playing the Prism blue light field with the ME mark (Lime) centred on it, the
# panel's own pixel grid kept, its light spilling into the haze and onto the floor. The page plays the loop on it.
im = G('booth'); A = np.asarray(im).astype(float); lum = A.mean(2); sat = A.max(2) - A.min(2)
pm = (lum > 120) & (sat < 30); pm[:255] = False; pm[640:] = False; ys, xs = np.where(pm)
bb = (int(np.percentile(xs, .2)), int(np.percentile(ys, .2)), int(np.percentile(xs, 99.8)) + 1, int(np.percentile(ys, 99.8)) + 1)
x0, y0, x1, y1 = bb; w, h = x1 - x0, y1 - y0
m = np.zeros(lum.shape, bool); m[y0:y1, x0:x1] = True
pan = lum[y0:y1, x0:x1]; grid = np.clip(pan / (np.asarray(Image.fromarray(pan.astype('uint8')).filter(ImageFilter.GaussianBlur(6))).astype(float) + 1), .78, 1.18)
Image.fromarray((np.clip(grid / 1.18, 0, 1) * 255).astype('uint8')).save(os.path.join(R, 'ref/gen5/_grid.png'))
LOOP = os.path.join(R, 'downloads/backgrounds/minimal-effort_loop_bg33-field-prism-blue_master-1440x1920.mp4')
mark = Image.open(os.path.join(R, 'downloads/logos/png/minimal-effort_me-mark_lime_3000w.png')).convert('RGBA')
mh = round(h * .46); mark = mark.resize((round(mark.width * mh / mark.height), mh), Image.LANCZOS)
ma = np.asarray(mark)[..., 3]; mys, mxs = np.where(ma > 40)  # centred by its ink
mpos = (round(w / 2 - (mxs.min() + mxs.max()) / 2), round(h / 2 - (mys.min() + mys.max()) / 2))
mark.save(os.path.join(R, 'ref/gen5/_mark.png'))
def band(fr):  # the middle band of the portrait loop, at the panel's shape
    bh = round(fr.width * h / w); top = (fr.height - bh) // 2; return fr.crop((0, top, fr.width, top + bh)).resize((w, h), Image.LANCZOS)
panel = band(frame(LOOP, 3.0)); panel.paste(mark, mpos, mark)
P = np.asarray(panel).astype(float) * grid[..., None] * 1.04
out = A.copy(); out[y0:y1, x0:x1] = P; o = Image.fromarray(np.clip(out, 0, 255).astype('uint8'))
g = Image.new('RGB', o.size, 0); g.paste(panel, (x0, y0)); g = np.asarray(g.filter(ImageFilter.GaussianBlur(70))).astype(float)
rf = Image.new('RGB', o.size, 0); rf.paste(panel.transpose(Image.FLIP_TOP_BOTTOM).resize((w, round(h * .7))).filter(ImageFilter.GaussianBlur(14)), (x0, y1 + 14))
yy = np.arange(lum.shape[0]); fade = (np.clip(1 - (yy - (y1 + 14)) / (h * .7), 0, 1) ** 2 * (yy > y1 + 10))[:, None, None]
O = np.asarray(o).astype(float) + (~m[..., None]) * (g * .42 + np.asarray(rf).astype(float) * fade * .28 * (.35 + lum[..., None] / 255))
out = Image.fromarray(np.clip(O, 0, 255).astype('uint8'))
mk = Image.new('L', (w, h), 255)
# the moving panel: loop band + mark + the LED grid, 10 s
vh = h - h % 2; vw = w - w % 2
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', LOOP, '-i', os.path.join(R, 'ref/gen5/_mark.png'), '-i', os.path.join(R, 'ref/gen5/_grid.png'), '-filter_complex',
  f"[0]crop=iw:round(iw*{h}/{w}):0:(ih-round(iw*{h}/{w}))/2,scale={w}:{h}:flags=lanczos,format=gbrp[b];[b][1]overlay={mpos[0]}:{mpos[1]}:format=gbrp[c];[2]format=gbrp[gr];[c][gr]blend=all_mode=multiply,eq=brightness=.03:contrast=1.02,scale={vw}:{vh},format=yuv420p",
  '-t', '10', '-c:v', 'libx264', '-b:v', '1.4M', '-maxrate', '1.8M', '-bufsize', '3.5M', '-movflags', '+faststart', '-an', os.path.join(R, 'assets/mock/booth.mp4')], check=True)
for f in ('_grid.png', '_mark.png'): os.remove(os.path.join(R, 'ref/gen5', f))
save(out, 'booth'); screen('booth', out, bb, mk, video='assets/mock/booth.mp4')

# bus shelter: the lineup in the lightbox (Headliner layout, the names read from across the street)
im = G('shelter'); m, bb = region(im, (448, 680), 40, (280, 400, 620, 960))
out, mk = put(im, Image.open(T('lineup-d_bubbles_story')), m, bb, glow=.3)
small(os.path.join(R, SRC, 'lineup-d_bubbles_story.mp4'), 'assets/mock/shelter.mp4', 540)
save(out, 'shelter'); screen('shelter', out, bb, mk, video='assets/mock/shelter.mp4')

# the poster wall: eight posters wheat-pasted in a row
im = G('wall'); a = np.asarray(im).astype(float); lum = a.mean(2); sat = a.max(2) - a.min(2)
paper = (lum > 168) & (sat < 26); paper[:150] = False; paper[440:] = False
lab, n = ndimage.label(ndimage.binary_opening(paper, iterations=2)); sizes = ndimage.sum(paper, lab, range(1, n + 1))
keep = [i + 1 for i in np.argsort(sizes)[::-1][:8]]
boxes = sorted([(ndimage.find_objects((lab == k).astype(int))[0], k) for k in keep], key=lambda b: b[0][1].start)
posters = [MK('mock-wall_' + p + '_story') for p in ['poster-mirror', 'poster-glow', 'the-maze_halloween', 'poster-wall', 'second-wind_waves', 'poster-stagger', 'poster-bands', 'poster-collage']]
out = im
for (sl, k), p in zip(boxes, posters):
    bb = (sl[1].start, sl[0].start, sl[1].stop, sl[0].stop)
    mm = ndimage.binary_fill_holes(lab == k) | ((lab == 0) & (lum < 168) & False)
    # the walker stays in front: the poster only goes where the paper is
    mm = np.zeros_like(paper); mm[bb[1]:bb[3], bb[0]:bb[2]] = paper[bb[1]:bb[3], bb[0]:bb[2]] | ndimage.binary_fill_holes(lab == k)[bb[1]:bb[3], bb[0]:bb[2]] & (sat[bb[1]:bb[3], bb[0]:bb[2]] < 40)
    out, _ = put(out, Image.open(p), mm, bb, paper=True, dim=.97)
save(out, 'posters')

# billboard: THE MAZE in its billboard format (2.44:1, the board's own shape), centred
im = G('billboard'); m, bb = region(im, (595, 345), 40, (200, 160, 1000, 520))
out, mk = put(im, Image.open(MK('mock-billboard_the-maze_billboard')), m, bb, glow=.15)
save(out, 'billboard')

# phone: the Second Wind story playing on the screen
ph0 = Image.open(os.path.join(R, 'ref/gen3/phone.png')).convert('RGB')
# widened to 4:3 so it sits in a row with the other screens: the sides are the same club, blurred
EX = (round(ph0.height * 4 / 3) - ph0.width) // 2
ph = ph0.resize((ph0.width + 2 * EX, ph0.width + 2 * EX)).filter(ImageFilter.GaussianBlur(28)).crop((0, EX, ph0.width + 2 * EX, EX + ph0.height))
fe = Image.new('L', ph0.size, 255); dr = ImageDraw.Draw(fe)
for i in range(80): dr.line([(i, 0), (i, ph0.height)], fill=int(255 * i / 80)); dr.line([(ph0.width - 1 - i, 0), (ph0.width - 1 - i, ph0.height)], fill=int(255 * i / 80))
ph.paste(ph0, (EX, 0), fe); a = np.asarray(ph).astype(int)
dark = a.max(2) < 30; box = (317 + EX, 57, 721 + EX, 942); sub = dark[box[1]:box[3], box[0]:box[2]]
cols = np.where(sub.mean(0) > .85)[0]; rows = np.where(sub.mean(1) > .85)[0]
bb = (box[0] + cols.min() + 9, box[1] + rows.min() + 9, box[0] + cols.max() - 9, box[1] + rows.max() - 9)
w, h = bb[2] - bb[0], bb[3] - bb[1]; m = np.zeros(dark.shape, bool)
mk = Image.new('L', (w, h), 0); ImageDraw.Draw(mk).rounded_rectangle((0, 0, w - 1, h - 1), radius=int(w * .11), fill=255)
m[bb[1]:bb[3], bb[0]:bb[2]] = np.asarray(mk) > 127
out, mk = put(ph, Image.open(T('second-wind_waves_story')), m, bb)
small(os.path.join(R, SRC, 'second-wind_waves_story.mp4'), 'assets/mock/phone.mp4', 480)
save(out, 'phone'); screen('phone', out, bb, mk, video='assets/mock/phone.mp4')

json.dump(SCREENS, open(os.path.join(R, 'assets/mock/screens.json'), 'w'), indent=1)
print('screens', list(SCREENS))
