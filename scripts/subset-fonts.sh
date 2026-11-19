#!/bin/sh
# Rebuilds the Google Sans WOFF2 files in assets/fonts/ from the original TTFs
# (kept in git history: assets/fonts/static/*.ttf before fix/sitemap-storm-seo).
#
# Subset: Latin + Latin Extended (Uzbek Latin oʻ/gʻ = U+02BB, ’ = U+2019),
# Cyrillic + Cyrillic Supplement (Uzbek Ў Қ Ғ Ҳ), general punctuation,
# currency, №/™, arrows. ~2 MB TTF → ~40-60 KB WOFF2 per weight.
#
# Requires fonttools + brotli:  pip install fonttools brotli
# Usage: scripts/subset-fonts.sh <dir-with-GoogleSans-*.ttf>
set -e
SRC=${1:?usage: subset-fonts.sh <dir-with-ttfs>}
OUT=$(dirname "$0")/../assets/fonts
UNICODES="U+0000-00FF,U+0100-024F,U+0259,U+02B0-02FF,U+0300-036F,U+0400-04FF,U+0500-052F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2100-214F,U+2190-21FF,U+2212,U+2215,U+FEFF,U+FFFD"
for w in Regular Medium SemiBold Bold; do
  pyftsubset "$SRC/GoogleSans-$w.ttf" \
    --unicodes="$UNICODES" \
    --layout-features='*' \
    --flavor=woff2 \
    --output-file="$OUT/GoogleSans-$w.woff2"
done
ls -la "$OUT"/*.woff2
