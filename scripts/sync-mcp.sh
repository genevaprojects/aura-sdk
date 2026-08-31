#!/usr/bin/env bash
# Push this checkout to github.com/aurafhe/mcp (main).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
URL="${AURA_MCP_REMOTE:-https://github.com/aurafhe/mcp.git}"
if git remote get-url aurafhe >/dev/null 2>&1; then
  git remote set-url aurafhe "$URL"
else
  git remote add aurafhe "$URL"
fi
git push -u aurafhe HEAD:main
