#!/usr/bin/env python3
"""Convert a Nepali CIAA report PDF to Markdown with the likhit MarkItDown plugin.

This is the text pipeline: it recovers body text, headings, and text-layer tables.
It CANNOT read chart/graph images or image-only tables — those are handled by the
figure vision pass (see find_figures.py + the per-year vision extraction).

Usage: python convert_likhit.py <input.pdf> <output.md>
"""
import sys
from pathlib import Path
from markitdown import MarkItDown


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: convert_likhit.py <input.pdf> <output.md>", file=sys.stderr)
        return 2
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    md = MarkItDown(enable_plugins=True)  # enable_plugins=True routes Nepali PDFs through likhit
    result = md.convert(str(src))
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(result.text_content, encoding="utf-8")
    print(f"wrote {out} ({len(result.text_content):,} chars)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
