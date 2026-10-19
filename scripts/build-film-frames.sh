#!/usr/bin/env bash
# Builds the /process film frame sets from the 481 source frames in public/process/frames.
#   d/ every second frame, unchanged 1280x720 (landscape screens)
#   m/ the same frames cropped to the centre 540x720 (portrait screens only show the middle)
set -euo pipefail
src=public/process/frames
out=public/process/film
mkdir -p "$out/d" "$out/m"
for ((i = 0; i <= 240; i++)); do
  from=$(printf '%s/f_%04d.webp' "$src" $((i * 2)))
  name=$(printf 'f_%03d.webp' "$i")
  cp "$from" "$out/d/$name"
  ffmpeg -v error -y -i "$from" -vf 'crop=540:720' -c:v libwebp -quality 82 -compression_level 6 "$out/m/$name"
done
