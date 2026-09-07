#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export TERM=xterm-256color
clear
printf '\n'
printf '$ cat mcp.json\n'
cat mcp.json
printf '\n'
printf '$ node connect.mjs\n'
node connect.mjs
printf '\n'
sleep 8
