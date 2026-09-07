#!/usr/bin/env python3
"""Deck frame in the user's mockup layout, filled with a live MCP session."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
FONT = "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Regular.ttf"
FONT_B = "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf"
BG = (13, 13, 13)
DOLLAR = (94, 168, 176)
CMD = (214, 214, 212)
DIM = (130, 130, 128)
ORANGE = (241, 167, 79)


def f(size, bold=False):
    return ImageFont.truetype(FONT_B if bold else FONT, size)


def draw(path, w, h, scale):
    img = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(img)
    x, y = int(72 * scale), int(80 * scale)
    body = f(int(36 * scale))
    dollar = f(int(36 * scale), True)
    dim = f(int(32 * scale))
    lh = int(58 * scale)

    def line(prompt, rest, color=CMD):
        nonlocal y
        if prompt:
            d.text((x, y), "$", fill=DOLLAR, font=dollar)
            d.text((x + int(40 * scale), y), rest, fill=color, font=body)
        else:
            d.text((x + int(40 * scale), y), rest, fill=color, font=dim)
        y += lh

    line(True, "npx -y github:aurafhe-official/mcp")
    line(False, "genesis endpoint connected")
    line(False, "https://api.afhe.io:8443")
    y += int(18 * scale)
    line(True, "fhe_encrypt 40")
    line(False, "ct_1")
    line(True, "fhe_encrypt 2")
    line(False, "ct_2")
    y += int(8 * scale)
    line(True, "fhe_compute add ct_1 ct_2 | fhe_decrypt")
    y += int(28 * scale)
    d.text((x, y), "42", fill=ORANGE, font=f(int(132 * scale), True))
    img.save(path)
    print("wrote", path)


if __name__ == "__main__":
    draw(HERE / "hello.png", 3200, 1800, 1.35)
    draw(HERE / "hello_square.png", 1600, 1400, 1.0)
