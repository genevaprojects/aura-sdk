# MCP host snippets

Drop one of these into your AI host. Replace the URL if your coprocessor is not local.

## Cursor — `.cursor/mcp.json` or `~/.cursor/mcp.json`

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

## Claude Code

```bash
claude mcp add aura-fhe -- npx -y @aurafhe/mcp
```

## VS Code Copilot — `.vscode/mcp.json`

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

## HTTP

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
