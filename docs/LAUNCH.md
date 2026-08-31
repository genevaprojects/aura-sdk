# Launch AURA Encrypted MCP

One sitting. Create the org, the package, the hosted URL, and the user paste block.

The product users see:

```json
{
  "mcpServers": {
    "aura": {
      "command": "npx",
      "args": ["-y", "@aurafhe/mcp"]
    }
  }
}
```

That process calls genesis compute at `https://api.afhe.io:8443`.

Run the checker anytime:

```bash
bash scripts/launch.sh
```

---

## 0 · What you will own when this is done

| Surface | Value |
|---|---|
| GitHub org | `https://github.com/aurafhe` |
| Repo | `https://github.com/aurafhe/mcp` |
| npm | `@aurafhe/mcp` |
| Coprocessor | `https://api.afhe.io:8443` (already live) |
| Hosted MCP (optional) | `https://mcp.afhe.io/mcp` |
| User paste | the JSON above |

This Cloud Agent cannot create a GitHub org or publish npm. You can. The commands below are copy-paste.

---

## 1 · GitHub org `aurafhe`

1. Sign in as the account that should own AURA (`gen@afhe.io`).
2. Open [Create a new organization](https://github.com/account/organizations/new).
3. Fill:

   - Organization name: `aurafhe`
   - Contact email: `gen@afhe.io`
   - Plan: **Free**

4. Skip inviting people. Finish.

Verify:

```bash
gh auth login
gh api orgs/aurafhe --jq .login
```

---

## 2 · Repo `aurafhe/mcp`

If the empty `aurafhe/mcp` repo already exists (Create repository, no README):

```bash
git remote add aurafhe https://github.com/aurafhe/mcp.git
git push -u aurafhe HEAD:main
```

Or create it from this checkout:

```bash
gh repo create aurafhe/mcp --public --source . --remote aurafhe --push
```

Or transfer the current repo (keeps issues/stars if any):

```bash
gh api -X POST repos/genevaprojects/aura-sdk/transfer \
  -f new_owner=aurafhe \
  -f new_name=mcp
```

Add Actions secrets on `aurafhe/mcp`:

| Secret | Used for |
|---|---|
| `NPM_TOKEN` | Publish `@aurafhe/mcp` |

Create a granular npm token: https://www.npmjs.com/settings/~/tokens → **Granular Access Token** → permission **Publish** on `@aurafhe/mcp`.

---

## 3 · npm org `@aurafhe` and first publish

1. Sign in at [npmjs.com](https://www.npmjs.com) with `gen@afhe.io`.
2. Create the org: [Create organization](https://www.npmjs.com/org/create) — name `aurafhe`.
3. On your laptop:

```bash
npm login
cd /path/to/aura-sdk
npm test
npm publish --access public
```

Or, with `NPM_TOKEN` on the GitHub repo: **Actions → Publish npm → Run workflow**.

Confirm:

```bash
npm view @aurafhe/mcp version
npx -y @aurafhe/mcp
```

---

## 4 · TLS on the coprocessor (`api.afhe.io`)

The genesis node answers `/health`, but the Let's Encrypt cert expired **28 Aug 2026**. Renew it on the coprocessor host:

```bash
sudo certbot certonly --nginx -d api.afhe.io
# or
sudo certbot certonly --standalone -d api.afhe.io
sudo systemctl reload nginx   # or whatever terminates TLS
```

Check:

```bash
bash scripts/check-network.sh
curl -sS https://api.afhe.io:8443/health
```

Until that cert is valid, this MCP still connects (genesis TLS is trusted). Renew anyway.

---

## 5 · Optional hosted URL `https://mcp.afhe.io/mcp`

For teams that paste a URL instead of `npx`:

**DNS** (wherever `afhe.io` is hosted — Vercel/Cloudflare):

| Name | Type | Value |
|---|---|---|
| `mcp` | A or CNAME | the VM / load balancer |

**On that box:**

```bash
git clone https://github.com/aurafhe/mcp.git
cd mcp
npm ci && npm run build
docker compose -f deploy/compose.yml up -d --build
curl -sS https://mcp.afhe.io/healthz
```

Caddy in `deploy/Caddyfile` issues the certificate.

Users then paste:

```json
{
  "mcpServers": {
    "aura": { "url": "https://mcp.afhe.io/mcp" }
  }
}
```

---

## 6 · Give this to users (the whole product)

**Cursor** — `.cursor/mcp.json` or `~/.cursor/mcp.json`  
**Claude** — `claude mcp add aura -- npx -y @aurafhe/mcp`  
**VS Code** — `.vscode/mcp.json` as `servers.aura`

Same JSON:

```json
{
  "mcpServers": {
    "aura": {
      "command": "npx",
      "args": ["-y", "@aurafhe/mcp"]
    }
  }
}
```

Snippets live in `examples/mcp/`.

---

## 7 · Order (do not skip)

1. Org `aurafhe`
2. Repo `aurafhe/mcp` + `NPM_TOKEN`
3. npm org + `npm publish`
4. Renew `api.afhe.io` cert
5. (Optional) `mcp.afhe.io`

The coprocessor is already running. MCP is the missing public door.
