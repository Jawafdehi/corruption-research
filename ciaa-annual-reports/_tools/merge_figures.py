#!/usr/bin/env python3
"""Merge a year's figures.part-*.json into figures.json (+ a human-readable figures.md).

For each year folder given (default: all with part files), concatenate the vision-extracted
part files, sort by page, and write:
  <year>/figures/figures.json  structured chart data (the machine artifact)
  <year>/figures/figures.md    a readable per-figure summary with provenance

Usage: python merge_figures.py [year ...]
"""
import json
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent


def dev(n):
    """Render a Western number back with a thousands separator for the .md view."""
    if isinstance(n, float) and n.is_integer():
        n = int(n)
    return f"{n:,}" if isinstance(n, int) else str(n)


def merge_year(figdir: Path):
    parts = sorted(figdir.glob("figures.part-*.json"), key=lambda p: int(p.stem.split("-")[-1]))
    if not parts:
        return None
    pages = []
    report = year = None
    for p in parts:
        d = json.loads(p.read_text())
        report = report or d.get("report")
        year = year or d.get("year")
        pages.extend(d.get("pages", []))
    pages.sort(key=lambda pg: pg.get("page", 0))

    charts = [(pg["page"], f) for pg in pages for f in pg.get("figures", [])]
    n_uncertain = sum(1 for _, f in charts for pt in f.get("data", []) if pt.get("value_estimated"))

    out = {
        "report": report,
        "year": year,
        "method": "vision double-pass over chart-page renders; charts are images likhit cannot convert. Plain ruled tables are recovered in the .likhit.md instead.",
        "n_chart_pages": len(pages),
        "n_charts": len(charts),
        "n_estimated_values": n_uncertain,
        "pages": pages,
    }
    (figdir / "figures.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")

    # readable summary
    lines = [f"# {report} — extracted chart data (FY {year})", "",
             f"{len(charts)} charts across {sum(1 for pg in pages if pg.get('figures'))} pages "
             f"({len(pages)} chart-page renders scanned). {n_uncertain} values read off the axis (estimated).",
             "",
             "Charts are images the likhit text pipeline drops; these were transcribed by a two-pass vision read of the rendered pages. Plain ruled tables live in the `.likhit.md`.",
             ""]
    for page, f in charts:
        lab = f.get("figure_label") or "(uncaptioned)"
        title = f.get("title_ne", "")
        lines.append(f"## p{page} · {lab} — {title}  _( {f.get('chart_type','?')}, {f.get('unit','')} )_")
        vn = f.get("verify_note", "")
        if vn and vn != "ok":
            lines.append(f"> verify: {vn}")
        for pt in f.get("data", []):
            s = f" [{pt['series']}]" if pt.get("series") else ""
            est = " *(est.)*" if pt.get("value_estimated") else ""
            lines.append(f"- {pt.get('label','')}{s}: {dev(pt.get('value'))}{est}")
        if f.get("notes"):
            lines.append(f"- _note: {f['notes']}_")
        lines.append("")
    (figdir / "figures.md").write_text("\n".join(lines), encoding="utf-8")
    return {"year": year, "charts": len(charts), "pages": len(pages), "estimated": n_uncertain}


def main() -> int:
    years = sys.argv[1:]
    figdirs = [BASE / y / "figures" for y in years] if years else \
        sorted({p.parent for p in BASE.glob("*/figures/figures.part-*.json")})
    any_done = False
    for fd in figdirs:
        r = merge_year(fd)
        if r:
            any_done = True
            print(f"{r['year']}: {r['charts']} charts, {r['pages']} pages, {r['estimated']} estimated -> figures.json + figures.md")
    if not any_done:
        print("no part files found")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
