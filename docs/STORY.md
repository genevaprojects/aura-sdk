# The AURA story

AI is moving from assistants to agents to transactions to organisations to machines. Each step increases the data it must touch. Today's stack protects data at rest and in transit — then decrypts it the moment a model works on it.

That compute-time gap is the product.

## What AURA does

1. **Encrypt at the owner** — data is sealed before it leaves
2. **Compute on ciphertext** — the coprocessor runs the job without seeing plaintext
3. **Decrypt only at the recipient** — the agent reveals only the answer you asked for

**FHE is the moat. MCP is the distribution.**

Every lab, agent, and tool already speaks MCP. Existing AI migrates in. No rebuild.

```text
LLMs · agents · tools · devices
        ↓  MCP
AURA Encrypted MCP     ← this repository
        ↓  HTTPS
AURA coprocessor network   https://api.afhe.io:8443
```

This repo is the access layer: paste `@aurafhe/mcp` into Cursor, Claude, or VS Code. Language SDKs in `clients/` speak the same HTTP protocol for apps that are not MCP hosts.

## What ships today

Genesis coprocessor (`GET /functions`): encrypt / decrypt, integer and float arithmetic, compare, bitwise, string concat / substring, and scientific ops. The MCP tools wrap that as `fhe_private_eval` (seal → evaluate → optional reveal) and `ct_…` handles so ciphertext never has to enter the prompt.

## What is roadmap

Encrypted retrieval, private SQL, and private inference are on the AURA deck. They are **not** live HTTP endpoints on this coprocessor yet. Do not document them as shipped.

## Who

Mochi Labs Pte. Ltd. · [gen@afhe.io](mailto:gen@afhe.io) · [afhe.io](https://afhe.io) · [docs.afhe.io](https://docs.afhe.io)

Canonical package home: [github.com/aurafhe/mcp](https://github.com/aurafhe/mcp)
