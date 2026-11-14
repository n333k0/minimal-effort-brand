"""Vectorise the raster partner/event logos (ORIGIN, SBCTLR, Lee Burridge) into single-colour SVGs (fill=currentColor)
and normalise THE MAZE logo from its Illustrator file. Output: assets/logo/<name>.svg. Run: python3 -I tools/trace-logos.py"""
import os, re
import numpy as np
from PIL import Image
import potrace

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = lambda *p: os.path.join(ROOT, *p)

def trace(src, name, mode, width=1600, crop=None):
    im = Image.open(src).convert("RGBA")
    if crop: im = im.crop((0, 0, im.width, int(im.height * crop)))
    a = np.asarray(im).astype(float)
    if mode == "alpha":          # logo drawn in any colour on transparency
        ink = a[..., 3] > 128
    else:                        # dark logo on white
        lum = (a[..., 0] * .299 + a[..., 1] * .587 + a[..., 2] * .114) * (a[..., 3] / 255) + 255 * (1 - a[..., 3] / 255)
        ink = lum < 128
    ys, xs = np.where(ink); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    ink = ink[y0:y1, x0:x1]
    h, w = ink.shape; k = width / w
    small = Image.fromarray((ink * 255).astype("uint8")).resize((width, max(1, round(h * k))), Image.LANCZOS)
    bm = potrace.Bitmap(np.asarray(small) < 128)
    path = bm.trace(turdsize=6, alphamax=1.0, opticurve=True, opttolerance=0.2)
    d = []
    for c in path:
        s = c.start_point; d.append(f"M{s.x:.1f} {s.y:.1f}")
        for seg in c.segments:
            if seg.is_corner: d.append(f"L{seg.c.x:.1f} {seg.c.y:.1f}L{seg.end_point.x:.1f} {seg.end_point.y:.1f}")
            else: d.append(f"C{seg.c1.x:.1f} {seg.c1.y:.1f} {seg.c2.x:.1f} {seg.c2.y:.1f} {seg.end_point.x:.1f} {seg.end_point.y:.1f}")
        d.append("Z")
    W, H = small.size
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" fill="currentColor"><title>{name}</title><path fill-rule="evenodd" d="{"".join(d)}"/></svg>\n'
    open(R("assets/logo", name + ".svg"), "w").write(svg)
    print(name, W, H, len(svg))

trace(R("ref/r2/ORIGIN_LOGO_PRIMARY_LOGOMARK_BOLD.png"), "origin", "alpha")
trace(R("ref/r2/ORIGIN_LOGO_PRIMARY_LOGOMARK_BOLD.png"), "origin-mark", "alpha", 1000, crop=0.6)
trace(R("ref/r2/SBCLTR-Black-PNG-(1).png"), "sbcltr", "alpha", 2000)
trace(R("ref/r2/lee-burridge-logo.png"), "lee-burridge", "alpha", 2000)

# THE MAZE: keep the Illustrator vectors, recolour to currentColor
s = open(R("ref/ai/maze-p0.svg")).read()
paths = re.findall(r"<path[^>]*/>", s)
body = "".join(p.replace('fill="#010101"', "") for p in paths)
open(R("assets/logo/the-maze.svg"), "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1065.42 1065.41" fill="currentColor"><title>the-maze</title>{body}</svg>\n')
print("the-maze ok")
