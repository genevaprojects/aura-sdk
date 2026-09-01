# AURA MCP

An **MCP server** for private compute. Add it to Cursor, Claude, VS Code, or any MCP host. Your agent gets tools. The model never sees the data.

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

```bash
npx -y @aurafhe/mcp
claude mcp add aura -- npx -y @aurafhe/mcp
```

That is the whole install. No SDK. No keys in chat. No localhost.

Zero-config talks to genesis: [`https://api.afhe.io:8443`](https://api.afhe.io:8443/health)

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
@aurafhe/mcp
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
      "args": ["-y", "@aurafhe/mcp"]
    }
  }
}
```

**Claude Code**

```bash
claude mcp add aura -- npx -y @aurafhe/mcp
```

**VS Code Copilot** — `.vscode/mcp.json`:

```json
{
  "servers": {
    "aura": {
      "command": "npx",
      "args": ["-y", "@aurafhe/mcp"]
    }
  }
}
```

**HTTP** (one URL for a team):

```bash
npx -y @aurafhe/mcp --http --port 8787
```

```json
{
  "mcpServers": {
    "aura": { "url": "https://mcp.afhe.io/mcp" }
  }
}
```

Until npm: `npx -y github:aurafhe-official/mcp`  
Fallback: `npx -y github:genevaprojects/aura-sdk`

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
