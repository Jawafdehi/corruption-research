#!/usr/bin/env python3
"""Find and render candidate figure/chart pages in a CIAA report PDF.

likhit's text pipeline silently drops chart/graph images (raster AND vector) and
any table that is itself an image. This script locates the pages that likely carry
such visual data and renders them to high-DPI PNGs so a vision model can read the
numbers off them.

We target CHARTS/GRAPHS specifically, not ruled data tables: likhit recovers the ruled
statistical tables as Markdown text (verified against the FY2069/70 report), so those are
NOT figure-vision work. Bar/pie/line charts, by contrast, are drawn as dense vector art
(hundreds-to-thousands of curve/fill ops) or embedded as raster images, and likhit drops them.

Calibration (FY2069/70): ruled-table pages carry <= ~47 curve ops (decorative header boxes),
while real chart pages carry 248-3778 curve ops and/or many colored fills. Thresholds below
separate the two cleanly.

Detection signals (a page is a candidate if ANY fire):
  * caption   — Devanagari/English figure-or-chart caption text on the page
                (चित्र / चार्ट / ग्राफ / रेखाचित्र / आरेख / Figure / Chart / Graph)
  * curves    — >= CURVE_MIN Bezier/quad curve ops on the page (pie arcs, line charts)
  * colored   — >= COLOR_MIN filled shapes in a non-black/gray colour (chart bars/slices)
  * raster    — a single embedded raster image covering >= COVER of the page
                (charts/figures pasted in as images)

Output:
  <outdir>/pages/p<NNN>.png   one 300-DPI render per candidate page (1-based, zero-padded)
  <outdir>/figure_pages.json  manifest: per candidate page, the signals + caption text

Usage: python find_figures.py <input.pdf> <outdir> [--dpi 300] [--cover 0.10]
"""
import json
import re
import sys
from pathlib import Path

import fitz  # PyMuPDF

# Caption tokens. \b-style boundaries don't work across Devanagari in `re`, so we
# anchor on the token plus a nearby number/purna-viram to avoid matching surnames
# like चित्रकार or compounds like पार्श्वचित्र that carry no figure data.
CAPTION_RE = re.compile(
    r"(?:चित्र|चार्ट|ग्राफ|रेखाचित्र|आरेख)\s*(?:नं\.?|न\.|संख्या|सङ्ख्या|:)?\s*[\d०-९]"
    r"|\b(?:Figure|Fig\.?|Chart|Graph)\s*[\dIVX]"
    ,
    re.IGNORECASE,
)


CURVE_MIN = 80   # ruled tables <= ~47; real charts >= 248
COLOR_MIN = 4    # distinctly-coloured filled shapes (bars/pie slices)


def _is_colored(fill) -> bool:
    """True if a fill colour is a real colour (not black/white/gray)."""
    if fill is None or len(fill) != 3:
        return False
    r, g, b = fill
    if max(r, g, b) < 0.15:          # black-ish
        return False
    spread = max(abs(r - g), abs(g - b), abs(r - b))
    return spread > 0.12             # some hue -> coloured


def page_signals(page: fitz.Page, cover_thresh: float):
    sig = {}

    # --- caption text (works on Unicode reports; garbled legacy fonts just miss) ---
    text = page.get_text("text")
    caps = []
    for m in CAPTION_RE.finditer(text):
        s = max(0, m.start() - 4)
        e = min(len(text), m.end() + 40)
        caps.append(text[s:e].replace("\n", " ").strip())
    if caps:
        sig["caption"] = caps[:8]

    # --- raster image coverage (charts/figures pasted as images) ---
    page_area = abs(page.rect.width * page.rect.height) or 1.0
    max_cover = 0.0
    for img in page.get_images(full=True):
        xref = img[0]
        for rect in page.get_image_rects(xref):
            cover = abs(rect.width * rect.height) / page_area
            max_cover = max(max_cover, cover)
    if max_cover >= cover_thresh:
        sig["raster_cover"] = round(max_cover, 3)

    # --- vector chart signature: curve density + coloured fills ---
    try:
        drawings = page.get_drawings()
    except Exception:
        drawings = []
    curves = 0
    colored = 0
    for d in drawings:
        if _is_colored(d.get("fill")):
            colored += 1
        for it in d.get("items", []):
            if it[0] in ("c", "qu"):
                curves += 1
    if curves >= CURVE_MIN:
        sig["curves"] = curves
    if colored >= COLOR_MIN:
        sig["colored_fills"] = colored

    return sig


def main() -> int:
    args = sys.argv[1:]
    if len(args) < 2:
        print("usage: find_figures.py <input.pdf> <outdir> [--dpi N] [--cover F]", file=sys.stderr)
        return 2
    src, outdir = Path(args[0]), Path(args[1])
    dpi = 300
    cover = 0.10
    if "--dpi" in args:
        dpi = int(args[args.index("--dpi") + 1])
    if "--cover" in args:
        cover = float(args[args.index("--cover") + 1])

    pages_dir = outdir / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(str(src))
    manifest = {"pdf": str(src), "page_count": doc.page_count, "dpi": dpi,
                "cover_thresh": cover, "candidates": []}

    for i in range(doc.page_count):
        page = doc[i]
        sig = page_signals(page, cover)
        if not sig:
            continue
        pno = i + 1  # 1-based
        png = pages_dir / f"p{pno:03d}.png"
        pix = page.get_pixmap(dpi=dpi)
        pix.save(str(png))
        manifest["candidates"].append({
            "page": pno,
            "png": str(png.relative_to(outdir)),
            "signals": sig,
        })

    (outdir / "figure_pages.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{src.name}: {len(manifest['candidates'])}/{doc.page_count} candidate pages -> {pages_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
