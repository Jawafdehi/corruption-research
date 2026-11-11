#!/usr/bin/env python3
"""The site's icons, from the official Jawafdehi mark (the same mark as jawafdehi.org):

- public/favicon.svg: the mark's own paths, cut from the press-kit logo (public/home/brand/...svg)
- public/favicon.ico (16, 32, 48), apple-touch-icon.png (180), icon-192.png, icon-512.png and
  icon-maskable-512.png (the mark inside the maskable safe zone), from the press-kit mark PNG,
  on the site's paper colour.

    python3 og/icons.py   (needs Pillow; the press-kit PNG is read from the meta repo)
"""
import re
from pathlib import Path

from PIL import Image

SITE = Path(__file__).resolve().parents[1]
PUB = SITE / "public"
LOGO_SVG = PUB / "home/brand/jawafdehi-logo-navy-for-light-bg.svg"
MARK_PNG = Path("/home/julius/Desktop/jawafdehi-meta/services/jawafdehi-frontend/public/press-kit/logo/jawafdehi-mark-square-transparent.png")
PAPER = (250, 250, 247)

# The logo's first eight paths are the mark (x 37-225, y 24-266 in its 1161 x 270 box; measured
# with getBBox); the ninth is the word "जवाफदेही".
paths = re.findall(r"<path\b[^>]*/>", LOGO_SVG.read_text(), re.S)
assert len(paths) == 9, f"expected 9 paths in the logo, found {len(paths)}"
(PUB / "favicon.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 20 250 250" width="32" height="32">'
    "<title>Jawafdehi</title>" + "".join(paths[:8]) + "</svg>\n")


def on_paper(size, scale):
    """The mark at `scale` of the icon's width, centred on paper."""
    mark = Image.open(MARK_PNG).convert("RGBA")
    box = mark.getbbox()
    mark = mark.crop(box)
    s = round(size * scale)
    w, h = mark.size
    mark = mark.resize((round(s * w / max(w, h)), round(s * h / max(w, h))), Image.LANCZOS)
    im = Image.new("RGBA", (size, size), PAPER + (255,))
    im.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    return im.convert("RGB")


on_paper(180, 0.78).save(PUB / "apple-touch-icon.png", optimize=True)
on_paper(192, 0.8).save(PUB / "icon-192.png", optimize=True)
on_paper(512, 0.8).save(PUB / "icon-512.png", optimize=True)
on_paper(512, 0.6).save(PUB / "icon-maskable-512.png", optimize=True)  # inside the 80% safe circle
on_paper(48, 0.9).save(PUB / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("icons: favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png")
