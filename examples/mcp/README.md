# Connect AURA

Paste this. It uses the hosted coprocessor. No local server.

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
claude mcp add aura -- npx -y @aurafhe/mcp
```

Until npm publish: `npx -y github:aurafhe/mcp` (fallback: `npx -y github:genevaprojects/aura-sdk`)

Story: [docs/STORY.md](../../docs/STORY.md). Launch: [docs/LAUNCH.md](../../docs/LAUNCH.md)

