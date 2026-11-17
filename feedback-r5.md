# Round 5 feedback (user, chat 2026-11-14) — working checklist

## Opening
- [x] FRONE: the E faces right (the M turned a quarter), sits at cap height; ROW's W lines up too.
- [x] The ME lands centred in the square (tight letter boxes, stage width without the scrollbar).
- [x] MINIMAL / EFFORT descriptions smaller.

## System from ME Refs
- [x] 403 Quzie installed (assets/fonts/quzie, all widths).
- [x] One composition per reference (22 posters) + timetable, tour, menu, mix cover, carousel templates.
- [x] Layers: colourways, label styles (incl. no padding), fonts, vector shapes, photo effects (gradient map, pixel, ASCII…), text animations.
- [x] Adaptive text: one name or twenty.
- [x] Builder: background lab with upload (image / GIF / video → effect), look group, shuffle, button + logo switches.
- [x] Carousels for articles and cases.
- [x] Animated posts (MP4).

## More of everything (second message)
- [x] Ticket messaging: higher and balanced with the button, SOLD OUT centred, button can go, wrapping options, seven compositions, 16 examples.
- [x] More calendar, hiring, statement options; more shader looks + lab options + loops.
- [x] Feed: phone slider with more posts (grid, stories, carousel).
- [x] Every group fills whole rows.

## Third and fourth messages
- [x] Grid: letters flush to the margin; the grid shown on eight compositions with every kind of wrapping and background.
- [x] THE MAZE matches the real flyers.
- [x] Hiring: frame closed on all sides, words flush to the lines, logo left with left text.
- [x] Street mockups (poster run, bus shelter, billboard) and party screens (LED wall, booth, talk, phone) — animated; cube sign removed.

## Follow-ups (2026-11-16)
- [x] Horizontal centring checked on all 238 renders: blocks were centred, but the big names sat 2–6 px right inside their blocks (tight tracking + letter side space). Optical padding added; letters now centred to 0.5 px.
- [x] Full alignment audit (2026-11-17, client check): every line's letters measured against the margins and centre on all 197 layouts. Big type started up to 8 px in from the margin (letter side space grows with size): optical margins added, label-block, menu, bands, covers, hiring and status layouts now land on the margin to 0.7 px. Box-aligned posters keep their box edge; the wall's ragged-left name run is by design.
- [x] Published: commit 6807e9b on main, release v1.1 (kit, PDF, zips, every template/background MP4); live site links the MP4s from the release.
- [x] Black label blocks aligned too (2026-11-17): one padding for every block (7 px), so block edges line up 7 px outside the margin and the letters sit on it; big names get a tight box. Full-width words fill margin to margin.
- [x] Extra labels on any template (A TO Z): + Add label puts it above the headliner IN the text (same alignment and blocks); drag it up/down to slot it before/after any block, or pick from its Where menu; Alt-drag places it freely. Spec `extras[]` (`at`/`side` or `x`/`y`).
- [x] ME construction: mark + MINIMAL/EFFORT text centred as one group inside the inner square; both descriptions three lines; a horizontal line under the 90°.
- [x] Builder: Export MP4 (in the browser, 10 s loop, 24 fps, H.264).

## Final
- [x] Render (360 files + 24 animated MP4s), kit, PDF (80 pages).
- [x] Publish — owner chose to publish with Quzie included (2026-11-17); big MP4s moved to the release for the Pages limit.
