#!/usr/bin/env python3
"""Assemble the flat chart-page work-list from every year's figure_pages.json.

Emits JSON to stdout: a list of {year, report, page, png, signals}. This is fed to the
vision double-pass fan-out (Workflow args). png is an ABSOLUTE path so subagents can Read it.
"""
import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent


def main() -> int:
    work = []
    for manifest in sorted(BASE.glob("*/figures/figure_pages.json")):
        year = manifest.parent.parent.name          # e.g. 2069-70
        m = json.loads(manifest.read_text())
        report = Path(m["pdf"]).stem                 # e.g. 23rd-annual-report-2069-70
        for c in m["candidates"]:
            work.append({
                "year": year,
                "report": report,
                "page": c["page"],                   # 1-based PDF page
                "png": str((manifest.parent / c["png"]).resolve()),
                "signals": c["signals"],
            })
    work.sort(key=lambda w: (w["year"], w["page"]))
    print(json.dumps(work, ensure_ascii=False))
    # human summary to stderr
    import sys, collections
    by_year = collections.Counter(w["year"] for w in work)
    print(f"total chart pages: {len(work)} across {len(by_year)} years", file=sys.stderr)
    for y, n in sorted(by_year.items()):
        print(f"  {y}: {n}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
