# AURA Encrypted MCP

The encrypted compute network for AI. **MCP is the distribution.**

Paste this into Cursor, Claude, VS Code, or any MCP host. It talks to the AURA coprocessor. The model never sees the data.

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

That is the whole install. No localhost, no SDK rebuild, no key files in chat.

Default network: [`https://api.afhe.io:8443`](https://api.afhe.io:8443/health)

To stand up the GitHub org, npm package, TLS, and hosted URL, follow **[docs/LAUNCH.md](docs/LAUNCH.md)** or run `bash scripts/launch.sh`.


---

## The story

AI is moving from assistants to agents to machines. Every step increases the data it must touch. Today's stack protects data at rest and in transit — then **decrypts it the moment a model works on it**.

AURA closes that gap:

1. **Encrypt at the owner** — data is sealed before it leaves
2. **Compute on ciphertext** — the coprocessor runs the job without seeing plaintext
3. **Decrypt only at the recipient** — the agent reveals only the answer you asked for

FHE is the moat. MCP is how every lab, agent, and tool already speaks. AURA sits in the middle: encrypted retrieval, SQL, inference, and private math on the same coprocessor the SDK already uses.

```text
LLMs · agents · tools · devices
        ↓  MCP
AURA Encrypted MCP     ← this package
        ↓  HTTPS
AURA coprocessor network
```

Existing AI migrates in. No rebuild.

---

## What the agent can do

| Tool | Role |
|---|---|
| `fhe_status` | Is the AURA network reachable? |
| `fhe_ops` | Operations the coprocessor will run on ciphertext |
| `fhe_private_eval` | **Main path.** Seal → evaluate → optional reveal |
| `fhe_encrypt` / `fhe_compute` / `fhe_decrypt` | Multi-step graphs with `ct_…` handles |

The model holds handles, not secrets. Ciphertext never has to enter the prompt.

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

## Hosts

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

**Hosted HTTP** (one URL for a team or product):

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

Point `mcp.afhe.io` at that process when you terminate TLS in front of it.

Until `@aurafhe/mcp` is on npm:

```bash
npx -y github:genevaprojects/aura-sdk
```

Canonical repo: [github.com/aurafhe/mcp](https://github.com/aurafhe/mcp)

---

## Environment (optional)

Zero config hits genesis compute. Override only when you must:

| Variable | Default | Purpose |
|---|---|---|
| `AFHE_API_URL` | `https://api.afhe.io:8443` | Coprocessor |
| `AFHE_API_KEY` | — | Bearer token if the node requires it |
| `AFHE_TIMEOUT_MS` | `120000` | Per-request timeout |
| `AFHE_INSECURE_TLS` | genesis + localhost | Set `0` to require a valid certificate |

---

## Language SDKs

Same coprocessor, for apps that are not MCP hosts. See [`clients/`](clients/).

Docs: [docs.afhe.io](https://docs.afhe.io) · [docs/AI_FHE.md](docs/AI_FHE.md)

## License

MIT · Mochi Labs · [gen@afhe.io](mailto:gen@afhe.io)
