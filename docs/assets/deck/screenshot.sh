#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
python3 "$HERE/render.py"
if [ "${1:-}" != "" ] && [ "$1" != "$HERE" ]; then
  mkdir -p "$1"
  cp "$HERE/integration.png" "$HERE/terminal.png" "$HERE/config.png" "$1/"
fi
