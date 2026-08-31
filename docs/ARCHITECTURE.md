# Architecture

```text
AI agent (Cursor, Claude, VS Code, …)
  ↓  MCP  (npx -y @aurafhe/mcp)
Aura FHE connector
  ↓  HTTPS + JSON
Coprocessor
  ↓
Private evaluation engine
```

The connector is the product. Language SDKs in `clients/` are the same protocol for apps that are not MCP hosts. Default network: `https://api.afhe.io:8443`.

## What the agent sees

Tools, not key files:

- `fhe_status` / `fhe_ops`
- `fhe_private_eval` — one-shot private compute
- `fhe_encrypt` / `fhe_compute` / `fhe_decrypt` — multi-step graphs with `ct_…` handles

Handles live in the MCP process. Ciphertext does not have to round-trip through the prompt.

## What the coprocessor sees

The HTTP contract in [PROTOCOL.md](PROTOCOL.md): health, encrypt, decrypt, generic `call`. The connector maps AI op names (`add`, `mean`, `concat`) onto that contract.

## Why the split

- hosts speak MCP
- apps speak the TypeScript / Python / Go / CLI clients
- the coprocessor can change implementation as long as the HTTP contract holds
- AURA wraps the execution path: models and agents speak MCP, this connector
reaches the coprocessor, ciphertext never has to enter the prompt.

Default network: `https://api.afhe.io:8443`.
