# Aura FHE

Private compute for AI agents. One line:

```bash
npx -y @aurafhe/mcp
```

That starts an [MCP](https://modelcontextprotocol.io) connector. Cursor, Claude, VS Code, and any other MCP host can then encrypt values, evaluate them without reading plaintext, and decrypt only the final answer.

```json
{
  "mcpServers": {
    "aura-fhe": {
      "command": "npx",
      "args": ["-y", "@aurafhe/mcp"],
      "env": {
        "AFHE_API_URL": "https://localhost:8443"
      }
    }
  }
}
```

```bash
claude mcp add aura-fhe -- npx -y @aurafhe/mcp
```

Point `AFHE_API_URL` at your Aura FHE coprocessor. That is the whole setup.

---

## Why this exists

Language models should be able to **compute on private data** without the data becoming part of the prompt.

Aura FHE is fully homomorphic evaluation for AI workflows:

1. Seal inputs (`fhe_encrypt` or `fhe_private_eval`)
2. Run math, stats, comparisons, or string ops on sealed values
3. Reveal only the result the user asked for (`reveal: true`)

The model sees short handles (`ct_1`), not plaintext and not giant ciphertext blobs.

## Tools the agent gets

| Tool | Use it for |
|---|---|
| `fhe_status` | Is private compute reachable? |
| `fhe_ops` | Which ops this coprocessor can run |
| `fhe_private_eval` | **Main AI path.** Seal → evaluate → optional reveal |
| `fhe_encrypt` | Keep a sealed value around as `ct_…` |
| `fhe_compute` | Run an op on handles (and optional extra plaintext) |
| `fhe_decrypt` | Reveal a handle when the user asked for the answer |

Example agent call:

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

The coprocessor sees the numbers. The chat transcript does not need to.

## Install on every host

### Cursor

Project file `.cursor/mcp.json` or user file `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "aura-fhe": {
      "command": "npx",
      "args": ["-y", "@aurafhe/mcp"],
      "env": {
        "AFHE_API_URL": "https://localhost:8443"
      }
    }
  }
}
```

### Claude Code / Claude Desktop

```bash
claude mcp add aura-fhe -- npx -y @aurafhe/mcp
```

Same JSON works in Claude Desktop MCP settings.

### VS Code Copilot

```json
{
  "servers": {
    "aura-fhe": {
      "command": "npx",
      "args": ["-y", "@aurafhe/mcp"],
      "env": {
        "AFHE_API_URL": "https://localhost:8443"
      }
    }
  }
}
```

### Remote HTTP (one shared endpoint)

```bash
npx -y @aurafhe/mcp --http --port 8787
```

```json
{
  "mcpServers": {
    "aura-fhe": {
      "url": "http://127.0.0.1:8787/mcp"
    }
  }
}
```

### From this repo before npm publish

```bash
npx -y github:genevaprojects/aura-sdk
```

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `AFHE_API_URL` | `https://localhost:8443` | Coprocessor base URL |
| `AFHE_API_KEY` | — | Optional `Authorization: Bearer` |
| `AFHE_TIMEOUT_MS` | `120000` | Per-request timeout |
| `AFHE_INSECURE_TLS` | localhost only | Set `1` to trust a self-signed cert on a non-local host |

Localhost TLS is trusted automatically so a local coprocessor works without extra flags.

## Language SDKs (optional)

If you are writing an app instead of wiring an agent, the same coprocessor speaks HTTPS+JSON:

```ts
import { connect } from '@aura/fhe-client'

const fhe = await connect()
const sum = await fhe.addInt(await fhe.encryptInt(25), await fhe.encryptInt(17))
console.log(await fhe.decryptInt(sum)) // "42"
```

| Client | Install |
|---|---|
| TypeScript | `npm install @aura/fhe-client` |
| Python | `pip install aura-fhe` |
| Go | `go get github.com/aurafhe/fhe-client/clients/go` |
| CLI | `npm install -g @aura/fhe-cli` |

Walkthrough: [docs/AI_FHE.md](docs/AI_FHE.md) · protocol: [docs/PROTOCOL.md](docs/PROTOCOL.md)

## Develop

```bash
npm install
npm test
npm run inspector
```

`npm run inspector` opens the MCP Inspector against this connector.

## License

MIT
