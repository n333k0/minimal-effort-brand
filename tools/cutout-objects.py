# Cut the hiring objects (ref/gen4/*.png, studio shots on flat grey) out of their background: fit the grey as a smooth plane
# from the border, key by colour distance, keep soft shadows, crop. Writes assets/mock/hire-<name>.png (transparent).
import numpy as np, sys
from PIL import Image, ImageFilter
for n in ['radio', 'tape', 'pass', 'headphones', 'case']:
    im = np.asarray(Image.open(f'ref/gen4/{n}.png').convert('RGB')).astype(np.float32)
    H, W, _ = im.shape
    yy, xx = np.mgrid[0:H, 0:W]
    b = np.zeros((H, W), bool); b[:12] = b[-12:] = True; b[:, :12] = b[:, -12:] = True
    A = np.stack([xx[b], yy[b], xx[b] * yy[b], xx[b] ** 2, yy[b] ** 2, np.ones(b.sum())], 1)
    bg = np.zeros_like(im)
    F = np.stack([xx, yy, xx * yy, xx ** 2, yy ** 2, np.ones_like(xx)], -1).astype(np.float32)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A, im[..., c][b], rcond=None); bg[..., c] = F @ coef
    d = np.sqrt(((im - bg) ** 2).sum(-1))
    a = np.clip((d - 10) / 34, 0, 1)
    a = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(3))).astype(np.float32) / 255
    # un-mix the grey from semi-transparent edge pixels
    rgb = np.where(a[..., None] > .02, (im - bg * (1 - a[..., None])) / np.maximum(a[..., None], .02), 0)
    out = np.dstack([np.clip(rgb, 0, 255), a * 255]).astype(np.uint8)
    img = Image.fromarray(out, 'RGBA'); bb = img.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox()
    pad = 20; bb = (max(0, bb[0] - pad), max(0, bb[1] - pad), min(W, bb[2] + pad), min(H, bb[3] + pad))
    img.crop(bb).save(f'assets/mock/hire-{n}.png', optimize=True)
    print(n, bb)
