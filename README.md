# Minimal Effort — Brand Guidelines & Asset Kit

**Open the guidelines:** run `npm run serve` in this folder and open http://localhost:8790 (the page uses ES modules, so it needs
a local server rather than double-clicking). The same content is in `downloads/minimal-effort-brand-guidelines.pdf`.

Earlier rounds are kept in `versions/` (not linked from the site).

**Make a flyer:** http://localhost:8790/builder.html — pick a template, type the details, export PNG or MP4 (the MP4 is
recorded in the browser: Chrome, Edge or Safari 17+). For many at once, press *Copy spec*, save it as `spec.json` here and run `npm run render -- spec.json`.

**Ask an agent:** hand this folder to Claude Code (or another coding agent) and ask in plain words; it follows `AGENTS.md`.

## Setup (once)
- Google Chrome and ffmpeg (`brew install ffmpeg`)
- Node 20+, then `npm install`

## Rebuild
- `node tools/build-logos.mjs` — logo SVG/PNG kit from the Figma masters in `ref/svg/`
- `node tools/examples/build-examples.mjs` — writes the example specs + groups (checks every group fills whole rows of four)
- `node tools/render.mjs tools/examples/templates.json --out downloads/templates` — template examples (PNG, MP4 over loops)
- `node tools/render-anim.mjs tools/examples/templates.json --out downloads/templates` — MP4s of animated type and moving effects
- `node tools/build-kit.mjs` — icons, highlight covers, grids, colour tokens, fonts, signature, business cards, zips
- `python3 tools/build-mockups.py` — tee and the single street poster; `python3 tools/build-mockups5.py` — DJ booth, bus shelter, poster run, billboard, phone (needs the template renders and `node tools/render.mjs tools/mock/art.json --out downloads/renders/mock --no-video`)
- `node tools/render-fields.mjs [prism-blue,…]` — the light fields (20 shapeless loops from the references: streaks, prism blues, fog, vortex, glitch, grain)
- `node tools/render-shaders.mjs [glass,chrome,…]` — the WebGL shader loops (13 looks); `python3 tools/cutout-objects.py` — hiring objects
- `node tools/build-pdf.mjs` — the PDF (with the page served on :8790)
- `sh tools/pack.sh` — the full kit .zip
- Publishing: GitHub Pages has a 1 GB limit, so the big zips and every MP4 in `downloads/templates` and `downloads/backgrounds` are git-ignored and uploaded to the GitHub release (v1.1); `assets/js/sections.js` links the MP4 buttons there when the site runs on github.io.

## Fonts
ABC Normal is a commercial typeface by Dinamo; the web files in `assets/fonts/` render these pages only. Licence it before
using it in other work. Manrope and IBM Plex Mono are open-licence and included in `downloads/fonts/`.
THE MAZE flyers use 403 Quzie (403TF, commercial): web files in `assets/fonts/quzie/` render these pages; they are not in
the downloadable font zip. Without them Saira Stencil One (SIL OFL) stands in.
