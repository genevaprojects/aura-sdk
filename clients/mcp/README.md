# @aura/fhe-mcp

MCP adapter for ciphertext arithmetic through an Aura FHE coprocessor.

```sh
npm install -g @aura/fhe-mcp
aura-fhe-mcp --config cursor --demo
```

Paste the printed `aura` entry under `mcpServers` in `.cursor/mcp.json` or
`~/.cursor/mcp.json`. Then ask:

> Show me the Aura demo. I am new to FHE; explain each step as we go.

`--config` prints settings; it does not edit your files. Replace `cursor` with
`claude` or `vscode`. The generated command points at this install and
`--demo` (fixed public examples 25, 17, 7.5, 2.5, 2).

```sh
aura-fhe-mcp --check     # HTTPS + advertised operations
aura-fhe-mcp --demo      # stdio MCP server, demo inputs
aura-fhe-mcp --help
```

Default coprocessor: `https://api.afhe.io:8443` (`AURA_COPROCESSOR_URL`).
Demo mode is backend-keyed synthetic data. It demonstrates the connection, not
confidentiality against the compute provider.
