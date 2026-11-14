# Minimal Effort — agent guide (the harness)

You are making social assets for **Minimal Effort**, a Los Angeles cultural events label (THE MAZE, and co-produced nights such as Second Wind).
Everything you make must come from this kit's templates so it stays on brand. Read this file fully before rendering anything.

## What the team will ask you
Plain requests like:
- "THE MAZE flyer: Guy Gerber, Lee Burridge, Deer Jade, The Bitar Brothers, Oct 31, Halloween Night, The Train Station, orange, feed and story." (template `maze`)
- "Just announced post for RY X at Second Wind, Jan 2, use the photo they sent, story."
- "SOLD OUT for Second Wind, rainbow loop, feed + story." · "Ticket giveaway, 5× VIP, Second Wind." · "September–October calendar with these dates: …"
- "Now hiring: production assistant." · "Highlight cover for a new event called NOCTURNE." · "The Second Wind flyer in every size, landscape too."

## How to make it
1. Write a spec (JSON) using the fields below. One object per asset; an array for several.
2. Render: `npm run render -- path/to/spec.json` (writes to `downloads/renders/`), or `node tools/render.mjs spec.json --out <dir> --formats feed,story`.
   - Output per format: `<name>_<format>.png` (still), and for loop backgrounds also `<name>_<format>.mp4` (text over the moving loop) and `<name>_<format>_overlay.png` (transparent text layer).
   - Needs Google Chrome + ffmpeg installed, and `npm install` once (Playwright).
3. **Look at every PNG you produce** before handing it over. Check: no text cut off, nothing in the story unsafe zones (top 250 px / bottom 340 px), names spelled exactly as given, one accent colour only.
4. Hand back the files and a one-line summary per file. If the request needs something the templates cannot do, say so and propose the closest template; do not invent a new layout.

The human alternative is `builder.html` (open it from a local server: `npm run serve`, then http://localhost:8790/builder.html). Its "Copy spec" button produces exactly this JSON.

## Spec fields (defaults in `assets/js/templates.js` → `DEFAULT`)
| field | values | notes |
|---|---|---|
| `name` | string | file name stem, e.g. `the-maze_oct-31` |
| `template` | `lineup` `maze` `announce` `giveaway` `status` `calendar` `hiring` `cover` `highlight` | see the examples in `tools/examples/templates.json` |
| `formats` / `format` | `feed` (1080×1350) · `story` (1080×1920) · `square` (1080×1080) · `landscape` (1920×1080, lineup and maze) | not every template has every format |
| `layout` | lineup: `center` A · `header` B (co-brands) · `left` C (long lineups) · `headliner` D (one big name) · `split` E (date-led) · `bottom` F (image-led) · `half` G (half image, text across) · `window` H (photo window). maze: `orange` `violet` `night` `ice`. giveaway: `window` `full` `ticket`. status: `low` `centre` `band`. hiring: `object` `statement` `roles` | the composition of that template |
| `size` | `{"artists":2,"title":-1}` | size step per text group, 15% a step (groups per template: `ROLES` in templates.js) |
| `margin`, `spacing`, `offsetY` | 64 · 1 · 0 | side margin in px, multiplier for the gaps between groups, move the main text up (−) / down (+) in px |
| `labels` | true / false | label block behind every line. On by default; off only on calm backgrounds |
| `labelColor` | `#181D20` Black (default) · `#B4F152` Lime · `#A79BEE` Lilac · `#F5F6FC` Ice | text flips to Midnight on light labels |
| `textColor` | `""` (auto) · `#F5F5F5` · `#14141A` · `#B4F152` · `#A79BEE` | leave empty unless asked; never Ice or Lime on Lilac |
| `accent` | `#B4F152` Lime · `#A79BEE` Lilac · `#F5F6FC` Ice | the × star, step numbers, small marks. THE MAZE / Second Wind = Lime |
| `event` | `SECOND WIND` · `THE MAZE` · or any name | presets: SECOND WIND = MNML EFFRT × SBCTLR PRESENTS, ORIGIN logo at the bottom. THE MAZE = a party: THE MAZE PRESENTS, THE MAZE logo on top, every line in Lime (`textColor`/`logoColor` #B4F152), the ME at the bottom. Second Wind is not THE MAZE |
| `logos` | `[{"id":"origin-mark"}]`, ids: `me-mark` `mnml-effrt` `mnml-effrt-square` `wordmark` `lockup` `the-maze` `origin` `origin-mark` `sbcltr` `lee-burridge`; or `{"src":"assets/logo-extra/x.svg","aspect":2.4}` | several allowed; each takes `"scale"` (0.5–1.6) and `"pos"`: `tl` `tc` `tr` `bl` `bc` `br` (no pos = the template's logo row). Defaults: Just announced = ME top left + ORIGIN at the bottom; giveaway / hiring / calendar / cover = ME |
| `logoSize` | 40–100 (default 62) | logos are sized optically: same visual weight whatever their shape |
| `logoLabel` | true / false | default **false**: every logo is plain and takes the colour that reads on the background (Midnight on Lime / light, white on dark). `true` puts our marks only on a tight black box. Venue / partner / event logos are never boxed |
| `bg` | Chrome: `waves` `bluewaves` `bubbles` `ribbon` `flow` · Prism: `rainbow` `spectrum` `bloom` · Film: `holo` `leak` `ember` · Brand light: `lilac` `lime` `glow` · Shader: `glass` `pixel` `grit` · maze only: `maze` (its own colour field) · Texture: `dust` `toner` · Solid: `midnight` `limesolid` `lilacsolid` `icesolid` · `photo` · `custom` | the 17 loops also produce MP4. In `maze` a photo or loop is blurred and tinted under the blocks |
| `bgType`, `bgFile` | `"video"` / `"image"`, path to the file | with `bg:"custom"`: your own background (a video loops for 10 s in the MP4) |
| `photo` | `lee-burridge-1..3` `ry-x` `jamiie` `party-01..07` `venue-01` `extra-01..04`, or a path | announce, giveaway, `bg:"photo"`. Real press photos for artists, party photos for giveaways |
| `presenter` / `partner` / `presents` | `MNML EFFRT` / `SBCTLR` / `PRESENTS` | partner empty = no × co-brand |
| `title`, `date`, `time` | `Second Wind`, `Jan 2`, `6pm to 3am` | "Jan 2" style; announce posts always show the date |
| `artists` | `[{"name":"LEE BURRIDGE"},{"name":"RY X","note":"[DJ SET]"}]` | names UPPERCASE; notes in [brackets]; as many as fit |
| `venue` | `["613 Imperial Street","Arts District Los Angeles","Day to Night"]` | up to 3 lines |
| `status` | `SOLD OUT` `PRESALE LIVE` `TICKETS LIVE` `ON SALE NOW` `FINAL RELEASE` `LAST TICKETS` `DOORS OPEN` | status template |
| `cta` | `Get tickets` · `Link in bio` · `Presale — link in bio` · `Join the waitlist` · `RSVP` | only these words |
| `prize`, `steps[3]`, `deadline` | `Win 5 × VIP tickets` | giveaway; exactly three steps |
| `month`, `rows[]` | `{"d":"SEP 06","w":"SAT","e":"THE MAZE","a":"Guy Gerber · Lee Burridge","v":"Train Station"}` | calendar; ≤6 rows feed, ≤8 story |
| `hireHead`, `role`, `hireBody`, `roles[]`, `object`, `apply` | `NOW HIRING` `WE'RE HIRING` `JOIN THE CREW` `CREW CALL`; object `radio` `case` `headphones` `pass` `tape` | hiring |
| `subtitle`, `pill`, `seed` | `ARTS DISTRICT BLOCK PARTY`, `IN ORDER OF APPEARANCE`, 1–60 | maze: line under the date, the pill, the maze pattern. In maze `date` + `title` make the mono line (`OCT 31,  HALLOWEEN NIGHT`), the first `venue` line is big |
| `highlight`, `icon` | title; icon `maze-logo` (THE MAZE) or `artists gallery tickets calendar pin clock music info arrow plus play link star waitlist`, or `none` (word only) | story format |
| `statement`, `handle` | cover / carousel slide 1 | |
| `shade` | 0–0.8 | darkens the background |
| `dust` | true / false | dust texture over solid backgrounds |

## Adding a new artist photo
Save it as `assets/img/<slug>.jpg` (4:5 or taller, ≥1400 px wide, head in the top third), add one line to `PHOTOS` in
`assets/js/templates.js`, then use `"photo": "<slug>"`. Use the artist's approved press photo only; never generate faces.

## Making a new animated background
Loops are made with Higgsfield (model MiniMax H3, 2K, 10 s, aspect 3:4) with **the same still as start frame and end frame**,
prompt: "Seamless looping ambient background… very slow, smooth, calm motion. Locked-off static camera, no zoom, no pan,
no cuts. No text, no objects, no people. The last frame returns exactly to the first frame." Then check the seam (first vs
last frame PSNR ≥ 30 dB; if lower, crossfade the last second into the first), and export `assets/video/<id>.mp4` (810×1080),
`assets/video/<id>.jpg` (first frame) and `downloads/backgrounds/minimal-effort_loop_<id>_master-1440x1920.mp4`.
Shader loops instead come from `assets/js/shaders.js`: `node tools/render-shaders.mjs glass,pixel,grit` (free, local). Register a loop in `BACKGROUNDS` (templates.js) with its family (Chrome, Prism, Film, Brand light or Shader); the renderer picks it up from there. A new loop must look like it belongs to one of those families. Paid generation needs the owner's go-ahead.

## Brand rules you must not break
- Type: ABC Normal Heavy for display (tracked in), IBM Plex Mono uppercase for labels, Manrope for long text. Never anything else.
- Colour: Midnight #14141A, Ice White #F5F6FC, Lime #B4F152, Lilac #A79BEE. One accent per piece. No white or Lime text on Lilac.
- Logos: three of ours, all in `assets/logo/`: the **ME** mark, **MINIMAL EFFORT** (wordmark) and **MNML EFFRT** (condensed, with or without its square). Event and partner logos (THE MAZE, ORIGIN, SBCLTR) only as given. Don't stretch, don't rotate, no shadows or glows. On white or Ice the wordmark is black. The old bar mark (IIIE) is retired.
- Label blocks hug their words: one block per line, never stretched to full width; stacked lines touch; the text sits in the middle with the same padding on all four sides.
- THE MAZE has its own flyer (`maze`): don't dress a Minimal Effort lineup as THE MAZE. Its display type is 403 Quzie when installed, Saira Stencil One otherwise.
- Copy: names, dates, places. No exclamation marks, no emoji, no hype words.
- FLOAT and Clinic are on hold until their logos exist: don't make posts for them.
- Motion: backgrounds move, type holds still. No new text animation without asking.
- Story safe zones: nothing important in the top 250 px or bottom 340 px.

## Files
- `index.html` — the brand guidelines (open via `npm run serve`). Every example on it opens in the builder when clicked. `downloads/minimal-effort-brand-guidelines.pdf` — same, as PDF.
- `builder.html` — template builder. `render.html` — render surface used by the CLI.
- `assets/js/templates.js` — the template engine (single source of truth). `assets/css/templates.css` — template styles.
- `tools/render.mjs` — PNG/MP4 renderer. `tools/build-logos.mjs`, `tools/build-kit.mjs` — rebuild downloads. `tools/examples/*.json` — example specs.
- `downloads/` — every asset, also zipped.
