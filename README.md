# AURA MCP

An **MCP server** for private compute. Add it to Cursor, Claude, VS Code, or any MCP host. Your agent gets tools. The model never sees the data.

```json
{
  "mcpServers": {
    "aura": {
      "command": "npx",
      "args": ["-y", "github:aurafhe-official/mcp"]
    }
  }
}
```

```bash
npx -y github:aurafhe-official/mcp
claude mcp add aura -- npx -y github:aurafhe-official/mcp
```

That is the whole install. No SDK. No keys in chat. No localhost. Works before npm publish.

Zero-config talks to genesis: [`https://api.afhe.io:8443`](https://api.afhe.io:8443/health)

After `npm publish`, the same paste with `@aurafhe/mcp` also works.

---

## Why this MCP

Agents already speak **tools**. AURA is one more MCP server: the host seals inputs, the network computes, the agent only receives handles (`ct_…`) or the final answer.

1. **Encrypt at the owner**
2. **Compute on ciphertext**
3. **Decrypt only at the recipient**

Existing agents migrate in. No rebuild. Story: [docs/STORY.md](docs/STORY.md).

```text
Cursor · Claude · VS Code · any MCP host
        ↓  MCP tools
github:aurafhe-official/mcp
        ↓  HTTPS
AURA network
```

---

## Tools

| Tool | What the agent uses it for |
|---|---|
| `fhe_status` | Is this MCP online? |
| `fhe_ops` | Which private ops can I call? |
| `fhe_private_eval` | **Main tool.** Seal → run → optional reveal |
| `fhe_encrypt` / `fhe_compute` / `fhe_decrypt` | Multi-step graphs with `ct_…` handles |

Live ops: add, mean, compare, concat, scientific. Retrieval, SQL, and inference are roadmap.

```json
{
  "name": "fhe_private_eval",
  "arguments": {
    "domain": "int",
    "op": "mean",
    "values": [81, 94, 73],
    "reveal": true
  }
}
```

---

## Add to a host

**Cursor** — `.cursor/mcp.json` or `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "aura": {
      "command": "npx",
      "args": ["-y", "github:aurafhe-official/mcp"]
    }
  }
}
```

**Claude Code**

```bash
claude mcp add aura -- npx -y github:aurafhe-official/mcp
```

**Claude Desktop** — `claude_desktop_config.json` (same `mcpServers` block as Cursor).

**VS Code Copilot** — `.vscode/mcp.json`:

```json
{
  "servers": {
    "aura": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "github:aurafhe-official/mcp"]
    }
  }
}
```

**HTTP** (one URL for a team):

```bash
npx -y github:aurafhe-official/mcp --http --port 8787
```

```json
{
  "mcpServers": {
    "aura": { "url": "https://mcp.afhe.io/mcp" }
  }
}
```

Canonical repo: [github.com/aurafhe-official/mcp](https://github.com/aurafhe-official/mcp)

---

## Environment (optional)

| Variable | Default | Purpose |
|---|---|---|
| `AFHE_API_URL` | `https://api.afhe.io:8443` | Backend for this MCP |
| `AFHE_API_KEY` | — | Bearer token if required |
| `AFHE_TIMEOUT_MS` | `120000` | Per-request timeout |
| `AFHE_INSECURE_TLS` | genesis + localhost | Set `0` to require a valid certificate |

Apps that are not MCP hosts: [`clients/`](clients/). Docs: [docs.afhe.io](https://docs.afhe.io)

MIT · Mochi Labs · [gen@afhe.io](mailto:gen@afhe.io)
