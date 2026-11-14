#!/bin/sh
# Packs the whole kit (guidelines site, builder, harness, assets, downloads) into downloads/minimal-effort-brand-kit.zip.
# Leaves out node_modules, the Figma reference dump (ref/) and the zips inside downloads/ (they would double the size).
set -e
cd "$(dirname "$0")/.."
OUT=downloads/minimal-effort-brand-kit.zip
[ -f "$OUT" ] && mv "$OUT" "$OUT.old"
zip -qr -X "$OUT" index.html builder.html render.html README.md AGENTS.md package.json package-lock.json assets tools downloads \
  -x "downloads/*.zip" -x "downloads/*/*.zip" -x "downloads/renders/*" -x "*.DS_Store" -x "*.old"
[ -f "$OUT.old" ] && mv "$OUT.old" "$HOME/.Trash/minimal-effort-brand-kit.previous.zip" || true
ls -lh "$OUT"
