# Encrypted MCP

AURA lets AI use data without ever seeing it. This connector is the access layer.

```text
Agent  --MCP-->  npx @aurafhe/mcp  --HTTPS-->  api.afhe.io:8443
```

Paste the connector. Do not rebuild the model. Do not put secrets in the prompt.

1. `fhe_status` — genesis coprocessor health
2. `fhe_private_eval` — seal, compute on ciphertext, reveal only the answer
3. Keep intermediates as `ct_…` handles

That is the product surface from the AURA deck: **FHE is the moat, MCP is the distribution.**
