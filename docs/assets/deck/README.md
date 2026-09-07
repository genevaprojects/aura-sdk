# Deck frames (no brand lockup)

Recorded against the live coprocessor. Regenerate:

```bash
node docs/assets/deck/run-session.mjs --github
bash docs/assets/deck/screenshot.sh
```

Drop the PNGs into the slide.

- `hello.png` — live encrypt 40 + encrypt 2 + add + decrypt → 42 (same layout as the mockup)
- `integration.png` — config + terminal
- `terminal.png` / `config.png` — singles

```bash
node docs/assets/deck/run-hello.mjs
python3 docs/assets/deck/render-hello.py
```
