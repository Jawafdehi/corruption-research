#!/usr/bin/env python3
"""Split each available year's chart pages into extraction chunks of <= SIZE pages.

Prints a JSON array of chunk specs. Each chunk becomes one vision subagent.
  {chunk_id, year, report, part, out, pages: [{page, png}, ...]}

Usage: python make_chunks.py [--size 14] [--years 2069-70,2070-71,...]
"""
import json
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent


def main() -> int:
    args = sys.argv[1:]
    size = 14
    only = None
    if "--size" in args:
        size = int(args[args.index("--size") + 1])
    if "--years" in args:
        only = set(args[args.index("--years") + 1].split(","))

    chunks = []
    for manifest in sorted(BASE.glob("*/figures/figure_pages.json")):
        year = manifest.parent.parent.name
        if only and year not in only:
            continue
        m = json.loads(manifest.read_text())
        report = Path(m["pdf"]).stem
        pages = [{"page": c["page"], "png": str((manifest.parent / c["png"]).resolve())}
                 for c in m["candidates"]]
        for k, i in enumerate(range(0, len(pages), size)):
            part = k + 1
            chunks.append({
                "chunk_id": f"{year}-{part}",
                "year": year,
                "report": report,
                "part": part,
                "out": str(manifest.parent / f"figures.part-{part}.json"),
                "pages": pages[i:i + size],
            })
    print(json.dumps(chunks, ensure_ascii=False))
    n_pages = sum(len(c["pages"]) for c in chunks)
    print(f"{len(chunks)} chunks, {n_pages} pages", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
