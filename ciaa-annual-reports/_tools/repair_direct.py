"""Extract a Nepali PDF through likhit's font-repair strategy DIRECTLY.

The plugin's converter computes this result and can then discard it: when likhit reports
any page as needing OCR it sets force_ocr, and if OCR is unconfigured the candidate
selection can fall back to plain MarkItDown output — which for these reports is legacy-font
garbage. This skips the selection and keeps the repaired text.
"""
import sys, time
from pathlib import Path
from likhit.extractors.font_based import FontBasedStrategy
from likhit.converters.nepali_pdf import _render_structure_aware_markdown

src, out = Path(sys.argv[1]), Path(sys.argv[2])
t = time.time()
doc = FontBasedStrategy().extract_text(str(src))
md = _render_structure_aware_markdown(doc)
out.write_text(md, encoding="utf-8")
dropped = sorted(getattr(doc, "needs_ocr_pages", []) or [])
print(f"wrote {out} chars={len(md):,} secs={time.time()-t:.0f}")
print(f"pages_dropped_as_needing_ocr={len(dropped)} {dropped[:25]}{'...' if len(dropped)>25 else ''}")
