# AI FHE with Aura

Use this when you want a model to compute on private data without putting that data in the prompt.

## One line

```bash
npx -y @aurafhe/mcp
```

The connector speaks MCP. The coprocessor does the evaluation. The agent only sees handles and, when you allow it, the final plaintext.

```text
Agent  --MCP-->  @aurafhe/mcp  --HTTPS-->  Aura FHE coprocessor
```

## Agent workflow

1. `fhe_status` — fail fast if the coprocessor is down.
2. `fhe_private_eval` — seal inputs, run `add` / `mean` / `mul` / `concat` / …, optionally reveal the answer.
3. Stay on handles (`ct_1`) when the user should not see intermediates.
4. Call `fhe_decrypt` only for the value the user asked to see.

Do not dump raw ciphertext into the chat. The connector already stores it.

## What to compute privately

Good fits:

- aggregates (sum, mean, product) over user numbers
- comparisons and scoring without exposing the scored values
- string joins the model should not reread
- any later private-inference graph you expose as coprocessor ops (`fhe_ops`)

Not the point of this connector:

- key-block plumbing
- inventing a new cryptosystem in the prompt
- asking the user to paste SKB / PKB files into chat

## Ops the agent should name

Friendly names (mapped for you): `add`, `sub`, `mul`, `div`, `mean`, `compare`, `abs`, `concat`, `not`, `xor`, `and`, `or`, plus scientific ops on `float`.

Coprocessor function names still work if you already know them (`AddCipherInt`, …).

## Custody, in one paragraph

The coprocessor can evaluate sealed values without the agent's context window ever holding the plaintext. Decrypt still requires the data owner's secret material on the coprocessor. Keep that material off the model. Details: [KEY_MANAGEMENT.md](KEY_MANAGEMENT.md).
