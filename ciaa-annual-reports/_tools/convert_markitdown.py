#!/usr/bin/env python3
"""Convert a born-digital (clean-Unicode) CIAA report PDF to Markdown with plain MarkItDown.

Used ONLY for reports whose text layer is already clean Unicode Devanagari, where likhit's
font-repair is a no-op — so this output is text-equivalent to likhit. (likhit's full plugin
pipeline hangs pathologically on these particular image-heavy born-digital PDFs.) Legacy-font
reports, where the text layer is Latin gibberish, MUST use likhit instead (convert_likhit.py).

Usage: python convert_markitdown.py <input.pdf> <output.md>
"""
import sys
from pathlib import Path
from markitdown import MarkItDown


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: convert_markitdown.py <input.pdf> <output.md>", file=sys.stderr)
        return 2
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    md = MarkItDown(enable_plugins=False)  # plain converter; no likhit (not needed for Unicode)
    result = md.convert(str(src))
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(result.text_content, encoding="utf-8")
    print(f"wrote {out} ({len(result.text_content):,} chars)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
