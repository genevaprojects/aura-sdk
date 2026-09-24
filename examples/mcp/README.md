# MCP — Cursor / Claude / VS Code

From `clients/mcp` after `npm install && npm run build`:

```sh
node dist/index.js --config cursor --demo
```

Copy the printed `aura` entry into your host file and reconnect.

| Host | File | Generator |
|---|---|---|
| Cursor | `.cursor/mcp.json` or `~/.cursor/mcp.json` | `--config cursor --demo` |
| Claude Desktop | `claude_desktop_config.json` | `--config claude --demo` |
| VS Code | `.vscode/mcp.json` | `--config vscode --demo` |

Then ask: *Show me the Aura demo. I am new to FHE; explain each step as we go.*
