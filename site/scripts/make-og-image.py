#!/usr/bin/env python3
"""Render public/og-image.png (1200x630), the share image for "/". Needs Pillow.

Uses the PNG logo from the design workspace and system DejaVu fonts; no browser.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SITE = Path(__file__).resolve().parents[1]
LOGO = Path("/home/julius/Desktop/jawafdehi-meta/work/2026-11-08-research-site-design/options/shared/brand/jawafdehi-logo-navy-for-light-bg.png")
FONTS = Path("/usr/share/fonts/truetype/dejavu")

W, H = 1200, 630
NAVY, RED, PAPER, INK2 = (14, 31, 59), (181, 36, 44), (250, 250, 247), (60, 70, 90)

im = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(im)
logo = Image.open(LOGO).convert("RGBA")
logo = logo.resize((300, round(logo.height * 300 / logo.width)), Image.LANCZOS)
im.paste(logo, (80, 70), logo)

serif = ImageFont.truetype(str(FONTS / "DejaVuSerif-Bold.ttf"), 88)
sans = ImageFont.truetype(str(FONTS / "DejaVuSans.ttf"), 34)
y = 70 + logo.height + 70
d.text((80, y), "Where accountability", font=serif, fill=NAVY)
d.text((80, y + 100), "leaks", font=serif, fill=RED)
d.text((80, y + 230), "Nepal's corruption cases, from complaint to the Supreme Court", font=sans, fill=INK2)
d.rectangle([0, H - 18, W, H], fill=NAVY)
d.rectangle([0, H - 18, 360, H], fill=RED)
d.text((W - 80, H - 60), "research.jawafdehi.org", font=sans, fill=NAVY, anchor="rs")

im.save(SITE / "public/og-image.png", optimize=True)
print("wrote public/og-image.png")
