#!/usr/bin/env bash
# Push this checkout to github.com/aurafhe-official/mcp (main).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
URL="${AURA_MCP_REMOTE:-https://github.com/aurafhe-official/mcp.git}"
if git remote get-url official >/dev/null 2>&1; then
  git remote set-url official "$URL"
else
  git remote add official "$URL"
fi
git push -u official HEAD:main
