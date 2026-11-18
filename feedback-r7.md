# Round 7 feedback (user, chat 2026-11-18) — working checklist

## From the home page into the editor
- [x] A flyer opened from the home page looks the same in the editor (same background, logos and preset): links load through `resolve()`. Before, the editor started from the Second Wind defaults (waves loop, ORIGIN logo).
- [x] Audit of all 216 examples: editor preview vs the rendered PNG, text leaving the frame, text on text (tools/dev/audit-builder.mjs).
- [x] Maze field on any template (was black); MAZE colours picker.
- [x] Just announced follows the background: photo, effect, or framed photo over a loop / colour / MAZE field (Photo + effect used to do nothing).
- [x] Photo never twice: when the background is the photo, a template's own photo frame goes.
- [x] Halloween Night (text animations): rise no longer leaves slivers of the block colour; wipes never cut hanging letters.
- [x] Winter Series line: the serif italic (off-brand Georgia) became a mono label block in the accent.

## Click to edit
- [x] Click any part of the flyer → inspector beside it: edit the words (jumps to the field, line selected), size, padding; logos: swap, size, add, upload, remove; background: change.
- [x] Per-group block padding (`pad`), also in Sizes → Pad −/+, and for boxed logos.

## Uploads
- [x] Uploaded photos, backgrounds, effect sources and logos stay in the browser (IndexedDB), listed as "your uploads", back after reload.

## Shaders, backgrounds, textures
- [x] Looked at the ME refs again: the backgrounds that work there are light and texture, not shapes (FUSE streaks, Four Tet vortex, Rüfüs fog, the holographic glitch sheet, The Works prism blues).
- [x] New light fields (assets/js/fields.js): 20 loops in four families — Light streaks, Prism blue (8), Fog + vortex, Glitch + grain.
- [x] Ten more textures: photocopy, riso grain, line screen, CRT, VHS, grid, paper folds, scratches, stipple, canvas.
- [x] 36 new examples: light fields, prism blues, textures, the MAZE field anywhere, Just announced on any background.

## Open
- [ ] THE MAZE flyers "can still be better": waiting for what to change (no new MAZE references in the folder).
