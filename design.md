# Minimal Effort — design decisions (working notes)

## Tokens (measured from Figma "Brand Guidelines and Assets" colour slides — rendered swatches; the HEX labels printed on those slides are template leftovers and WRONG)
- Midnight #14141A (primary dark) · Ice White #F5F6FC · Lime #B4F152 · Lilac #A79BEE
- Flyer label block #181D20 (from Second Wind flyer) · flyer type #F5F5F5 / #F7EBEB
- Secondary (template, use sparingly / event accents): Cyan #2ED0FF, Yellow #F3CE3A, Orange #FF7022, Red #E92E4A (+ tints #D1F5FF #FFF4CA #FFD3BC #FFBAC4)
- Grayscale: #EDEFF7 #D3D6E0 #BCBFCC #9DA2B3 #6E7180 #40424D #1E1E24

## Type
- Display / flyers: ABC Normal Heavy (Dinamo, commercial; files at iCloud 2_Recursos/Recursos 2021/05_Fonts 2021/Abc Normal/). Tight tracking ≈ -0.03em. Do NOT redistribute font files in the packet; site uses them locally for rendering only and links the licence.
- UI / body: Manrope (OFL, Google Fonts) — the guideline template's primary typeface.
- Mono / meta / signatures: Decima Mono in Figma (commercial, not installed) → web substitute IBM Plex Mono / DM Mono.

## Logos (real vectors exported from Figma Components page, file 5ivpRs1FGiZJI7ZJalMTdN, nodes 3:139 mark, 4:282 horizontal, 4:286 vertical) → ref/svg/
1. ME mark (mark.svg) 2. MINIMAL EFFORT wordmark (wordmark.svg) 3. vertical lockup ME + MINIMAL EFFORT (lockup.svg)
4. Condensed / window wordmark: MINIM▢FORT (letters cut by an image window) — build from wordmark paths with a clip window.
Alt marks in ID file (IIIE, roundels) exist; keep to ME as primary.

## Layout reference
RASA World v9 (~/Developer/rasa-world/v9.html, assets/css/rasa9.css, assets/js/page9.js): dark Swiss grid, hairline at 5/12, heavy tight type, tiny labels, goo-melt headings, smoke trail on pointer, pill header, giant split wordmark fixed in corners (→ MINIMAL / EFFORT), accent → lime.

## Content (from ID file copy)
- "We believe cultural impact comes from discernment, not excess."
- "Minimal Effort is a cultural events label that curates music, spaces, and experiences guided by taste, timing, and restraint."
- "Minimal Effort does not mean low quality, lack of care, or disengagement. It means removing everything unnecessary so what matters can speak for itself..."
- "Always at the forefront of culture, but never fighting for attention. The real ones are in the back. Away from the sweat and noise. Minimal by design. Timeless by intention."
- "A different kind of front row." · "Minimal by design." · "Timeless intention."
- Email signature: Cyril Bitar, Founder, CYRIL@MINIMALEFFORT.COM, @MINIMALEFFORTLA (mono, ME mark, dark).

## Animated backgrounds (from flyer work)
iCloud .../MINIMAL EFFORT + SBCLTR/animated/: bgA-waves-take2.mp4, bgB-rainbow-take2.mp4 (+ take1s). Flyer board also has a green/lime gradient and a blue-black waves still → candidates for more loops.

## Higgsfield loop jobs (2026-11-13, MiniMax H3 2K 10s start=end, 20 cr each)
bg03 blue waves 729a77ce-da24-47c5-97b3-8a4f42e5c53e · bg04 spectrum 134aa1e0-9a53-4ad3-a8f5-67253746d08e
bg05 lilac ecfdab64-484f-4022-afcd-7cdd9765ed37 · bg06 lime 80f1f20f-c552-4f78-98b6-de02649e914e
(bg01 waves + bg02 rainbow = flyer loops take 2, in iCloud .../SBCLTR/animated/)

## Image pool chosen (ref/pool, ref/flyerpool)
artists: web8-28_1/2 (woman, orange), web8-28_5 (man, colour shirt), web8-28_7 (moustache, red), id65_32 (green dragon), id65_29 (duo + car)
crowd: id65_28 (red crowd/DJ), id65_26 (check)
mockups: merch_40 tee, merch_37/41 vinyl, tx_cube1 sign, tx_holo1 holo ME, ref/raw/s5_6 phone
posters/textures: ex_poster-damaged-a/b, ex_poster-fluid, ex_poster-gradient, ex_poster-ascii, ex_nowhiring, tx_hiring1 (moss object)

## Build status (keep updated)
- DONE logos: tools/build-logos.mjs → downloads/logos (30 svg + 60 png), assets/logo/*.svg, assets/js/logos.js
- DONE fonts: assets/fonts (ABC Normal woff2 local-only, Manrope var + OFL, IBM Plex Mono + OFL), fonts.css
- DONE images: assets/img artist-01..05 + crowd-01; assets/mock (tee, vinyl, signs, phone, posters, now-hiring, hiring-object); assets/tex (dust, dot-matrix, spectrum, blue-waves, lilac-beam, lime-field, me-bars-*)
- DONE loops: assets/video/bg01..bg06 (.mp4 810x1080 + .jpg still); downloads/backgrounds (master, feed, story); bg03/bg04 crossfade-fixed
- DONE assets/css/templates.css + assets/js/templates.js (render(spec), preview(spec,w), templates: lineup(center|header|left), announce, giveaway, status, calendar, hiring, highlight, cover)
- DONE site.css/site.js (v9 port, lime), index.html (14 sections), builder.html (tested: fields, PNG export), render.html + tools/render.mjs (PNG/overlay/MP4 tested), tools/examples/templates.json, tools/build-kit.mjs (icons, highlights, grids, safe-zone, profile, tokens css/json/ase, fonts, signature, business-card PDFs, zips), AGENTS.md, README.md
- DONE 2026-11-13: template renders (78 files), kit zips, 390px check (no overflow, 2-up grids), PDF 38 pp, links 183/0 missing, full kit zip 369 MB (tested standalone render), GBrain + native memory saved
- OPEN: feed/carousel set needs owner input; ME website comps not found in Figma (website section is our design); email signature logo needs hosting; Higgsfield credits used this session 160 (~273 left)

## Round 2 (feedback-r2.md) — loop jobs 2026-11-13 (120 cr)
bg07 chrome-bubbles 4c729e5f-1449-4b1e-88c9-09ae76c98047 · bg08 chrome-ribbon 261a9a17-b3bc-4c38-8a43-b44d37612ac5 · bg09 chrome-flow 1d05ad3d-fa2b-4bd0-9922-dafccaaa9a7b
bg10 prism-bloom afc40376-94fd-4d73-9bc4-462a135f8a22 · bg11 holo-film 790217f3-cdd5-465e-9f68-263fb565ebe5 · bg12 film-leak 62cce6b7-a3d1-467f-8493-7f2cfbdc5ab7
Background system = "liquid light": CHROME (waves, bluewaves, bubbles, ribbon, flow) · PRISM (rainbow, spectrum, prism-bloom) · FILM (holo-film, film-leak) · BRAND LIGHT variations (lilac beam, lime field).
New assets in ref/r2: lee/ryx/jamiie photos (Downloads), ORIGIN + SBCLTR logo PNGs, IG Logo.jpg (lime ME on black), ME Rebranding textures.
THE MAZE logo source: ".../Minimal Effort + The Maze/Halloween bloc party/Maze Logo.ai" (MA/ZE square). Lee Burridge press shots: ".../Video/LB Assets/Press Shots 2024|2025".
Image jobs (r2): upscale ryx 59519eb8-c024-418c-80ec-3d1938459e64 · upscale jamiie e76e655e-d09a-4a7c-a5aa-6eb7e88795d2 · tee f0f0dc1a-e8af-4686-8148-92ed7dde7bb3 · cube c32b7756-f08e-4413-92ac-f41319b653bc · phone a7ec283f-0545-4c6d-b302-cc993b5dfa3a · street 2dc68766-2eb7-4e75-9d45-b6aa31ec6c34, d7336978-f0d7-4922-a941-1eb2c9d0bedf, 128c10c6-97ca-4a3c-9cd4-a646dfbdbaaf
- r2 DONE: logos (mnml-effrt, mnml-effrt-square, the-maze, origin, origin-mark, sbcltr, lee-burridge traced) → assets/logo + assets/js/logos.js (LOGO, LOGO_META, ICON_RECTS = ME-morphology icon set); 6 new loops bg07-bg12 encoded; photos lee-burridge-1..3, ry-x, jamiie (upscaled), party-01..07, venue-01; mockups tee/sign-cube/phone with ME mark (old IIIE gone), street-01..03; vinyl/holo/poster-gradient removed (old logo / not ours).
- r2 TODO: templates.js rewrite (touching label blocks, logo row w/ optical sizing, label/text colours, new layouts headliner/split/bottom/frame, system poster, hiring redesign, custom bg), builder, index.html v2 (hero sequence + fixes), v3.html (Figma intro), PDF cover, re-render, verify, pack.

## Build status — round 2 (2026-11-14)
- `index.html` = v2 (round-2 fixes), `v3.html` = v2 + the animated opening from Figma "Brand Guidelines 2" / Slide 16:9 - 5 (built by `tools/build-v3.py`), `v1.html` = round-1 archive running on `versions/` (banner; retired downloads hidden). Header pill switches versions.
- v2 hero: pinned sequence MNML ■ EFFRT (loop in the square) → square closes → MINIMAL EFFORT → ME over the party-photo slideshow + lime smoke.
- Data-driven sections in `assets/js/sections.js` (technical labels, icons, compositions A–G, 12 loops by family, 31 template examples, highlights, feed, carousel). Lightbox on posters/mockups.
- v3 opening: `assets/css/v3.css`, `assets/js/v3.js`: reveals on enter, outline bands drift, construction panel scrubbed by scroll (lines/circles draw, A DIFFERENT KIND OF FRONƎ ROW, MINIMAL / EFFORT halves + 90°, halves join into ME), lockup + TIME TO CELEBRATE card.
- PDF: print-only cover (lime ME, BRAND GUIDELINES., November 2026, on #08090B) and "Thanks" back page; 46 pages.
- Checks: `tools/check-dom-links.mjs` (rendered pages) → index 272 / v3 273 links, 0 missing. 390 px: no horizontal scroll. v1 has 49 dead links by design (retired assets), hidden.
- Open: the three ID-exploration posters are shown as-is, not redrawn in brand colours.

## Round 3 (feedback-r3.md, 2026-11-14)
- One site only: `index.html`. v1 / v3 and their scripts moved to `versions/archive/` (not linked). Header note: "Brand Guidelines / by Remoto Labs".
- Hero (`site.js` seqScene, `.seq` 640vh): MNML ■ EFFRT → square closes → MINIMAL EFFORT → ME (box 2.3× cap so the ME never covers the label/caption), CTAs, then the ME grows ~2× to the centre, Make a flyer leaves, Download the kit becomes `.float-dl` (fixed bottom right), left / middle / right lines draw (no top line). No "Minimal by design" headline.
- Opening (`assets/css/opening.css`, `assets/js/opening.js`), all on Midnight: MINIMAL EFFORT + arc + quote + TIMELESS INTENTION + manifesto → construction: A DIFFERENT KIND OF FRONƎ ROW; the Ǝ (E-half mirrored) and the W (M-half rotated 180°) fly into the square and become the ME; MINIMAL / EFFORT labels; 90° at the bottom. TIME TO CELEBRATE removed.
- Templates (`templates.js` r3): one label block per line (`wrapText`/`lbs`); our marks boxed tight (#181D20, padding ≈ .25 × logo height), venue/partner/event logos plain (`--logo` = `logoColor` or meta); per-logo `pos` (tl tc tr bl bc br) via `placedLogos`; EVENTS = SECOND WIND, THE MAZE (THE MAZE PRESENTS, maze logo top ×1.5, Lime text + logo, ME bottom); FLOAT/Clinic removed; layout G removed; `landscape` 1920×1080 for lineup; announce = ME top left + ORIGIN plain bottom right, all info; giveaway ME bottom left; status centred, title touching, CTA bottom, logo below; round-1 hiring restored; system poster hidden.
- Loops added (Higgsfield MiniMax H3 2K 10 s, 20 cr each): bg13-film-ember (job 22723330-5c2b-4a36-aad8-6deb79072ab5, seam 38 dB), bg14-brand-glow (job f978e69f-307c-4480-b1a9-78ec4e4dbe16, seam 45 dB). Stills: 3f01c6dc…, 2457f7f9….
- Texture: toner (fcb7c170…) replaces dot matrix. Mockups rebuilt by `tools/build-mockups.py` (exact logo PNG composited on blank photos: tee b4443f1d…, cube 5735dbb8…, phone 9599c6fb…, wall 26a828d3…); street = the real Second Wind flyer (final-waves.mp4 frame, ORIGIN at the bottom); street-02/03 removed.
- Site: posters removed except the disc poster, shown with a technical label; email signature transparent (black logo PNG + white for dark mode); smaller business-card type; examples open in the builder on click.
