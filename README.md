# Minimal Effort — Brand Guidelines & Asset Kit

**Open the guidelines:** run `npm run serve` in this folder and open http://localhost:8790 (the page uses ES modules, so it needs
a local server rather than double-clicking). The same content is in `downloads/minimal-effort-brand-guidelines.pdf`.

Earlier rounds are kept in `versions/` (not linked from the site).

**Make a flyer:** http://localhost:8790/builder.html — pick a template, type the details, export PNG. For the moving MP4,
press *Copy spec*, save it as `spec.json` here and run `npm run render -- spec.json`.

**Ask an agent:** hand this folder to Claude Code (or another coding agent) and ask in plain words; it follows `AGENTS.md`.

## Setup (once)
- Google Chrome and ffmpeg (`brew install ffmpeg`)
- Node 20+, then `npm install`

## Rebuild
- `node tools/build-logos.mjs` — logo SVG/PNG kit from the Figma masters in `ref/svg/`
- `node tools/render.mjs tools/examples/templates.json --out downloads/templates` — template examples
- `node tools/build-kit.mjs` — icons, highlight covers, grids, colour tokens, fonts, signature, business cards, zips
- `python3 tools/build-mockups.py` — tee, cube sign, phone and street mockups (exact logo composited on photos)
- `node tools/render-shaders.mjs` — the three WebGL shader loops (Glass, Pixel, Grit ME); `python3 tools/cutout-objects.py` — hiring objects
- `node tools/build-pdf.mjs` — the PDF (with the page served on :8790)
- `sh tools/pack.sh` — the full kit .zip

## Fonts
ABC Normal is a commercial typeface by Dinamo; the web files in `assets/fonts/` render these pages only. Licence it before
using it in other work. Manrope and IBM Plex Mono are open-licence and included in `downloads/fonts/`.
THE MAZE flyers use 403 Quzie on the originals (commercial, not bundled): install it and the `maze` template uses it;
otherwise Saira Stencil One (SIL OFL, in `assets/fonts/`) stands in.
