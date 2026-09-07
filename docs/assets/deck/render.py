#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
W, H = 3200, 1800
PAD = 96
FONT = "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Regular.ttf"
FONT_B = "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf"
BG, CARD, BAR, BORDER = (11, 13, 16), (17, 19, 24), (26, 29, 36), (42, 47, 56)
FG, MUTED, GREEN, BLUE, KEY = (215, 219, 226), (154, 163, 178), (134, 239, 172), (147, 197, 253), (125, 211, 252)


def font(size, bold=False):
    return ImageFont.truetype(FONT_B if bold else FONT, size)


def window(img, box, title):
    x0, y0, x1, y1 = box
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(box, 28, fill=CARD, outline=BORDER, width=2)
    d.line((x0 + 2, y0 + 80, x1 - 2, y0 + 80), fill=BORDER, width=2)
    for i, c in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
        d.ellipse((x0 + 28 + i * 36, y0 + 26, x0 + 48 + i * 36, y0 + 46), fill=c)
    d.text(((x0 + x1) / 2, y0 + 22), title, fill=MUTED, font=font(26), anchor="mt")
    return d


def draw_lines(d, x, y, rows, size=36, lh=56):
    f, fb = font(size), font(size, True)
    for kind, text in rows:
        color = {"p": GREEN, "c": BLUE, "m": MUTED, "ok": GREEN, "k": KEY, "s": GREEN}.get(kind, FG)
        d.text((x, y), text, fill=color, font=fb if kind == "ok" else f)
        y += lh
    return y


def terminal():
    img = Image.new("RGB", (W, H), BG)
    d = window(img, (PAD, PAD, W - PAD, H - PAD), "zsh — mcp host · 7 Sep 2026 05:00 UTC")
    rows = [
        ("p", "dev mcp %  npx -y github:aurafhe-official/mcp"),
        ("m", "# stdio MCP    initialize  aura 0.4.0"),
        ("p", ""),
        ("p", "dev mcp %  node host.mjs"),
        ("m", "→  tools/list"),
        ("fg", "←  fhe_status  fhe_ops  fhe_encrypt  fhe_decrypt  fhe_compute  fhe_private_eval"),
        ("p", ""),
        ("m", "→  tools/call  fhe_status"),
        ("ok", "←  coprocessor  ok    https://api.afhe.io:8443"),
        ("p", ""),
        ("m", "→  tools/call  fhe_private_eval"),
        ("fg", '    { "domain": "int", "op": "add", "values": [25, 17], "reveal": true }'),
        ("ok", "←  plaintext  42"),
        ("p", ""),
        ("m", "# 13s live session   2026-09-07T05:00:39Z → 05:00:52Z"),
    ]
    draw_lines(d, PAD + 56, PAD + 130, rows, 34, 58)
    img.save(HERE / "terminal.png")


def config():
    img = Image.new("RGB", (W, H), BG)
    d = window(img, (PAD, PAD, W - PAD, H - PAD), ".cursor/mcp.json")
    rows = [
        ("fg", "{"),
        ("k", '  "mcpServers": {'),
        ("k", '    "private-compute": {'),
        ("s", '      "command": "npx",'),
        ("s", '      "args": ["-y", "github:aurafhe-official/mcp"]'),
        ("fg", "    }"),
        ("fg", "  }"),
        ("fg", "}"),
        ("p", ""),
        ("m", "// host then calls"),
        ("fg", "{"),
        ("s", '  "name": "fhe_private_eval",'),
        ("k", '  "arguments": {'),
        ("s", '    "domain": "int", "op": "add",'),
        ("fg", '    "values": [25, 17], "reveal": true'),
        ("fg", "  }"),
        ("fg", "}"),
    ]
    draw_lines(d, PAD + 56, PAD + 130, rows, 36, 58)
    img.save(HERE / "config.png")


def integration():
    img = Image.new("RGB", (W, H), BG)
    mid = W // 2
    gap = 20
    left = (PAD, PAD, mid - gap, H - PAD)
    right = (mid + gap, PAD, W - PAD, H - PAD)
    d = window(img, left, ".cursor/mcp.json")
    draw_lines(
        d,
        PAD + 40,
        PAD + 120,
        [
            ("fg", "{"),
            ("k", '  "mcpServers": {'),
            ("k", '    "private-compute": {'),
            ("s", '      "command": "npx",'),
            ("s", '      "args": ["-y",'),
            ("s", '        "github:aurafhe-official/mcp"]'),
            ("fg", "    }"),
            ("fg", "  }"),
            ("fg", "}"),
            ("p", ""),
            ("m", "// tool call"),
            ("fg", "{"),
            ("s", '  "name": "fhe_private_eval",'),
            ("fg", '  "arguments": {'),
            ("s", '    "op": "add", "values": [25, 17],'),
            ("fg", '    "reveal": true'),
            ("fg", "  }"),
            ("fg", "}"),
        ],
        28,
        48,
    )
    d = window(img, right, "zsh · live · 7 Sep 2026")
    draw_lines(
        d,
        mid + gap + 40,
        PAD + 120,
        [
            ("p", "dev mcp %  npx -y github:aurafhe-official/mcp"),
            ("p", ""),
            ("m", "→  initialize"),
            ("fg", "←  aura 0.4.0"),
            ("p", ""),
            ("m", "→  tools/list"),
            ("fg", "←  fhe_status"),
            ("fg", "    fhe_private_eval"),
            ("fg", "    fhe_encrypt / compute / decrypt"),
            ("p", ""),
            ("m", "→  fhe_status"),
            ("ok", "←  coprocessor  ok"),
            ("fg", "    https://api.afhe.io:8443"),
            ("p", ""),
            ("m", "→  fhe_private_eval add [25, 17]"),
            ("ok", "←  plaintext  42"),
            ("p", ""),
            ("m", "# 13s live session"),
        ],
        28,
        48,
    )
    img.save(HERE / "integration.png")


if __name__ == "__main__":
    terminal()
    config()
    integration()
    print("wrote", HERE / "terminal.png")
    print("wrote", HERE / "config.png")
    print("wrote", HERE / "integration.png")
