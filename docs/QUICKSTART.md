# Quickstart

Private AI compute in one line, then optional language SDKs.

## 1. Connect the MCP connector

```bash
npx -y @aurafhe/mcp
```

Or add it to Cursor / Claude / VS Code. Snippets: [`examples/mcp`](../examples/mcp/).

You need a compatible Aura FHE coprocessor. Default is the hosted network:

```text
https://api.afhe.io:8443
```

```bash
curl -k https://api.afhe.io:8443/health
```

Override with `AFHE_API_URL` only for a local node.

Ask the agent:

> Use Aura FHE to privately add 25 and 17 and tell me the result.

It should call `fhe_private_eval` and return `42`.

---

## 2. Optional: language SDKs

Same coprocessor, for apps that are not MCP hosts.

### TypeScript

```bash
npm install @aura/fhe-client
```

```ts
import { connect } from '@aura/fhe-client'

const fhe = await connect()
const a = await fhe.encryptInt(25)
const b = await fhe.encryptInt(17)
const sum = await fhe.addInt(a, b)

console.log(await fhe.decryptInt(sum)) // "42"
```

### Go

```bash
go get github.com/aurafhe/fhe-client/clients/go
```

```go
c, _ := afhe.Connect(ctx)
a, _ := c.EncryptInt(ctx, "25")
b, _ := c.EncryptInt(ctx, "17")
sum, _ := c.AddInt(ctx, a, b)
pt, _ := c.DecryptInt(ctx, sum)
```

### Python

```bash
pip install aura-fhe
```

```python
from aura_fhe import connect

fhe = connect()
print(fhe.decrypt_int(fhe.add_int(fhe.encrypt_int(25), fhe.encrypt_int(17))))
```

### CLI

```bash
npm install -g @aura/fhe-cli
fhe connect
fhe enc int 25 > a.ct
fhe enc int 17 > b.ct
fhe add int "$(cat a.ct)" "$(cat b.ct)" | fhe dec int
```

---

## 3. Generate and load keys

Recommended keygen profile:

```json
{
  "m": 2,
  "n": 4,
  "q": 2147483647,
  "p": 512,
  "delta": 0.001
}
```

See [KEY_MANAGEMENT.md](KEY_MANAGEMENT.md) for the exact request bodies and
loading flow.

---

## 4. Common pitfalls

### TLS errors on localhost

The SDK auto-trusts self-signed certificates only for `localhost`. If you point
at another host, install a valid certificate or opt into insecure TLS
explicitly.

### Keys not loaded

`connect()` auto-loads:

- `file/skb`
- `file/pkb`
- `file/dictb`

If your files live elsewhere, pass explicit key paths.

### Domain mismatch

Do not mix `int`, `float`, `string`, and `binary` ciphertexts in one operation.

---

## Next steps

- Examples: [`examples/`](../examples/)
- Protocol: [PROTOCOL.md](PROTOCOL.md)
- Key custody: [KEY_MANAGEMENT.md](KEY_MANAGEMENT.md)
- Architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
