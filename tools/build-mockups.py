"""Merch, signage, phone and street mockups (round 3). The mark is composited from the exact logo PNGs onto blank
Higgsfield photos (ref/gen3), so the M and the E are always the real geometry. Street = the real Second Wind flyer.
python3 tools/build-mockups.py   →  assets/mock/{tee,sign-cube,phone,street-01}.jpg + downloads/mockups/"""
import os, subprocess, shutil
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = lambda n: Image.open(os.path.join(R, 'ref/gen3', n + '.png')).convert('RGB')
LOGO = os.path.join(R, 'downloads/logos/png/minimal-effort_me-mark_{}_3000w.png')
# the Second Wind flyer as it runs now (RY X (DJ) billing, 2026-11-19); the env var points it at another video
FLYER = os.environ.get('SECOND_WIND_FLYER', os.path.join(R, 'downloads/templates/second-wind_waves_feed.mp4'))

def mark(colour, width):
    im = Image.open(LOGO.format(colour)).convert('RGBA')
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)

def shading(base, box, blur=40):
    """luminance of the surface divided by its local mean: keeps folds, grain and light falloff"""
    crop = np.asarray(base.crop(box).convert('L')).astype(float) + 1
    mean = np.asarray(base.crop(box).convert('L').filter(ImageFilter.GaussianBlur(blur))).astype(float) + 1
    return np.clip(crop / mean, .55, 1.35)[..., None]

def put(base, art, xy, strength=1.0, shade=True, blur=40):
    """composite art (RGBA) at xy, modulated by the surface shading"""
    x, y = xy; box = (x, y, x + art.width, y + art.height)
    b = np.asarray(base.crop(box)).astype(float)
    a = np.asarray(art).astype(float); alpha = a[..., 3:4] / 255 * strength
    col = a[..., :3] * (shading(base, box, blur) if shade else 1)
    out = b * (1 - alpha) + col * alpha
    base.paste(Image.fromarray(np.clip(out, 0, 255).astype('uint8')), box[:2])
    return base

def save(im, name, out=None):
    im = im.convert('RGB')
    im.save(os.path.join(R, 'assets/mock', name + '.jpg'), quality=90)
    os.makedirs(os.path.join(R, 'downloads/mockups'), exist_ok=True)
    im.save(os.path.join(R, 'downloads/mockups', 'minimal-effort_' + name + '.jpg'), quality=92)
    print('wrote', name, im.size)

# tee: white ME printed on the chest
tee = G('tee'); m = mark('white', 250)
m.putalpha(Image.fromarray((np.asarray(m.getchannel('A')).astype(float) * .93).astype('uint8')))
save(put(tee, m, (512 - 125, 262), blur=18), 'tee')

# cube sign: Midnight ME on the lime face (face 184..840 x 168..844)
cube = G('cube'); fx0, fx1, fy0, fy1 = 184, 840, 168, 844
m = mark('midnight', int((fx1 - fx0) * .62))
save(put(cube, m, ((fx0 + fx1) // 2 - m.width // 2, (fy0 + fy1) // 2 - m.height // 2), blur=60), 'sign-cube')

# phone: the screen shows the ME, Midnight on Lime
ph = G('phone'); a = np.asarray(ph).astype(int)
dark = a.max(2) < 30; box = (317, 57, 721, 942)
sub = dark[box[1]:box[3], box[0]:box[2]]
cols = np.where(sub.mean(0) > .85)[0]; rows = np.where(sub.mean(1) > .85)[0]
sx0, sx1, sy0, sy1 = box[0] + cols.min() + 9, box[0] + cols.max() - 9, box[1] + rows.min() + 9, box[1] + rows.max() - 9
W, H = sx1 - sx0, sy1 - sy0
scr = Image.new('RGBA', (W, H), (180, 241, 82, 255)); mm = mark('midnight', int(W * .6))
scr.alpha_composite(mm, (W // 2 - mm.width // 2, H // 2 - mm.height // 2))
mask = Image.new('L', (W, H), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, W - 1, H - 1), radius=int(W * .11), fill=255)
scr.putalpha(mask)
save(put(ph, scr, (sx0, sy0), shade=False), 'phone')
print('phone screen', sx0, sx1, sy0, sy1)

# street: the real Second Wind flyer (waves, ORIGIN at the bottom) pasted on the wall's blank paper
tmp = os.path.join(R, 'ref/gen3/_flyer.png')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '2', '-i', FLYER, '-frames:v', '1', tmp], check=True)
wall = G('wall'); px0, px1, py0, py1 = 248, 700, 196, 856
fl = Image.open(tmp).convert('RGBA'); w = px1 - px0 - 18; fl = fl.resize((w, round(fl.height * w / fl.width)), Image.LANCZOS)
fl.putalpha(Image.fromarray((np.asarray(fl.getchannel('A')).astype(float) * .97).astype('uint8')))
y = (py0 + py1) // 2 - fl.height // 2
save(put(wall, fl, (px0 + 9, y), blur=14), 'street-01')
os.remove(tmp)
