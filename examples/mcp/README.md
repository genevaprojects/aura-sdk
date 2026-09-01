# Add AURA as an MCP server

Paste this. Your agent gets private-compute tools. No local server.

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

Until npm: `npx -y github:aurafhe-official/mcp`  
Fallback: `npx -y github:genevaprojects/aura-sdk`

[docs/STORY.md](../../docs/STORY.md) · [docs/LAUNCH.md](../../docs/LAUNCH.md)
