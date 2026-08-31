#!/usr/bin/env bash
# Create the public AURA Encrypted MCP surface.
# This script does everything a local machine can. Browser-only steps are printed.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ORG="${AURA_GITHUB_ORG:-aurafhe}"
REPO="${AURA_GITHUB_REPO:-mcp}"
NPM_SCOPE="${AURA_NPM_SCOPE:-aurafhe}"
PKG="@${NPM_SCOPE}/mcp"
API="${AFHE_API_URL:-https://api.afhe.io:8443}"

step() { printf '\n==> %s\n' "$1"; }
ok() { printf '    ok  %s\n' "$1"; }
todo() { printf '    TODO  %s\n' "$1"; }

step "1. Network — genesis coprocessor"
if curl -sk --max-time 8 "$API/health" | grep -q '"ok"'; then
  ok "$API/health"
else
  todo "coprocessor not answering at $API/health"
fi
if curl -sS --max-time 8 "$API/health" >/dev/null 2>&1; then
  ok "TLS on $API is valid"
else
  todo "renew Let's Encrypt on api.afhe.io (cert expired). Until then the MCP still connects."
fi

step "2. GitHub org + repo"
if gh api "orgs/$ORG" >/dev/null 2>&1; then
  ok "org github.com/$ORG exists"
else
  todo "open https://github.com/account/organizations/new"
  printf '        name: %s\n        contact email: gen@afhe.io\n        plan: Free\n' "$ORG"
fi
if gh api "repos/$ORG/$REPO" >/dev/null 2>&1; then
  ok "github.com/$ORG/$REPO exists"
  todo "push this checkout: git remote add aurafhe https://github.com/$ORG/$REPO.git && git push -u aurafhe HEAD:main"
else
  todo "after the org exists, run:"
  printf '        gh repo create %s/%s --public --source %s --remote aurafhe --push\n' "$ORG" "$REPO" "$ROOT"
  printf '        # or transfer this repo:\n'
  printf '        gh api -X POST repos/genevaprojects/aura-sdk/transfer -f new_owner=%s -f new_name=%s\n' "$ORG" "$REPO"
fi

step "3. npm org + publish $PKG"
if npm view "$PKG" version >/dev/null 2>&1; then
  ok "$PKG is on npm $(npm view "$PKG" version)"
else
  todo "create npm org at https://www.npmjs.com/org/create  (name: $NPM_SCOPE, email: gen@afhe.io)"
  todo "then: npm login && cd $ROOT && npm publish --access public"
  todo "or add GitHub secret NPM_TOKEN and run Actions → Publish npm"
fi

step "4. Hosted MCP URL (optional, for paste-a-URL installs)"
todo "DNS  A/CNAME  mcp.afhe.io  →  the box that will run docker compose"
todo "on that box:  cd $ROOT && docker compose -f deploy/compose.yml up -d --build"
printf '        then paste:  {"mcpServers":{"aura":{"url":"https://mcp.afhe.io/mcp"}}}\n'

step "5. Connect (this is what users paste)"
cat <<'JSON'
{
  "mcpServers": {
    "aura": {
      "command": "npx",
      "args": ["-y", "@aurafhe/mcp"]
    }
  }
}
JSON

step "Done"
printf 'Full operator runbook: docs/LAUNCH.md\n'
