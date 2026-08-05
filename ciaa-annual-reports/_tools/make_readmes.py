#!/usr/bin/env python3
"""Write per-year README.md files and the top-level README.md for the report pack.

Reads inventory.json (report metadata), download_manifest.json (provenance URLs), each
year's .likhit.md and figures/figures.json. Safe to re-run as more years complete.
"""
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
INVENTORY = Path("/home/damo/projects/jawafdehi/corruption-case-db/annual-reports/inventory.json")


def ordinal(n):
    if not isinstance(n, int):
        return str(n)
    suf = "th" if 10 <= n % 100 <= 20 else {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suf}"


def load_inventory():
    inv = json.loads(INVENTORY.read_text())
    by_fy = {}
    for r in inv["reports"]:
        if r.get("is_summary"):
            continue
        by_fy[r["fy_bs"].replace("/", "-")] = r
    return by_fy


def load_urls():
    mf = BASE / "download_manifest.json"
    if not mf.exists():
        return {}
    return {Path(r["dest"]).parent.name: r["url"]
            for r in json.loads(mf.read_text()).get("results", [])}


def year_readme(ydir: Path, meta, url):
    fy = ydir.name
    pdf = next(iter(ydir.glob("*-annual-report-*.pdf")), None)
    md_likhit = next(iter(ydir.glob("*.likhit.md")), None)
    md_plain = next((p for p in ydir.glob("*-annual-report-*.md")
                     if not p.name.endswith(".likhit.md")), None)
    md = md_likhit or md_plain
    converter = "likhit" if md_likhit else ("markitdown" if md_plain else None)
    figs_path = ydir / "figures" / "figures.json"
    figs = json.loads(figs_path.read_text()) if figs_path.exists() else None
    manifest = ydir / "figures" / "figure_pages.json"
    n_candidate = len(json.loads(manifest.read_text())["candidates"]) if manifest.exists() else "?"

    rn = meta["report_num"] if meta else "?"
    L = [f"# {ordinal(rn)} CIAA Annual Report — FY {fy.replace('-', '/')}", ""]
    if meta:
        L.append(f"Fiscal year **BS {meta['fy_bs']}** (AD {meta['fy_ad']}). Commission for the Investigation of Abuse of Authority (अख्तियार दुरुपयोग अनुसन्धान आयोग).")
        L.append("")
    L += ["## Files", ""]
    if pdf:
        L.append(f"- `{pdf.name}` — source PDF" + (f" ([ciaa.gov.np]({url}))" if url else ""))
    if md and converter == "likhit":
        L.append(f"- `{md.name}` — full-report Markdown via **likhit** (Nepali PDF→Markdown with legacy-font repair; recovers body text, headings, and ruled tables). {md.stat().st_size // 1024:,} KB.")
    elif md:
        L.append(f"- `{md.name}` — full-report Markdown via **markitdown**. This report's text layer is already clean Unicode Devanagari, so likhit's font-repair is a no-op and this output is text-equivalent; likhit's full pipeline hung on this born-digital PDF (>90 min), so plain markitdown was used. {md.stat().st_size // 1024:,} KB.")
    L.append(f"- `figures/` — chart data that likhit **cannot** convert (charts/graphs are images).")
    L.append(f"  - `figure_pages.json` — {n_candidate} candidate chart pages the detector found.")
    L.append(f"  - `pages/p*.png` — 300-DPI renders of those pages.")
    if figs:
        L.append(f"  - `figures.json` / `figures.md` — **{figs['n_charts']} charts** transcribed by a two-pass vision read ({figs.get('n_estimated_values', 0)} values estimated off-axis).")
    else:
        L.append(f"  - `figures.json` — _pending vision extraction_.")
    L += ["", "## Method", "",
          "`likhit` is a text/font-extraction pipeline: it recovers prose and the ruled statistical **tables** as Markdown, but silently drops **chart/graph images** (bar, pie, line). Those charts encode numbers only as pixels, so they were rendered to PNG and transcribed by two independent vision reads, reconciled per value. See `../_tools/EXTRACT_SPEC.md`.", ""]
    if figs:
        charts = [(pg["page"], f) for pg in figs["pages"] for f in pg.get("figures", [])]
        if charts:
            L += ["## Charts extracted", ""]
            for page, f in charts:
                lab = f.get("figure_label") or "(uncaptioned)"
                L.append(f"- **p{page}** {lab} — {f.get('title_ne','')} ({f.get('chart_type','?')}, {len(f.get('data',[]))} points)")
            L.append("")
    (ydir / "README.md").write_text("\n".join(L), encoding="utf-8")
    return {"fy": fy, "rn": rn, "converter": converter, "n_charts": figs["n_charts"] if figs else None,
            "n_candidate": n_candidate}


def main():
    inv = load_inventory()
    urls = load_urls()
    rows = []
    for ydir in sorted(BASE.glob("[12]*-[0-9]*")):
        if not ydir.is_dir():
            continue
        if (ydir / "NOT_YET_PUBLISHED.md").exists():
            rows.append({"fy": ydir.name, "rn": 36, "placeholder": True})
            continue
        rows.append(year_readme(ydir, inv.get(ydir.name), urls.get(ydir.name)))

    # top-level README
    T = ["# CIAA annual reports — markdown (likhit) + chart data (vision)", "",
         "Machine-readable copies of the **CIAA annual reports** for fiscal years **BS 2069/70 → 2082/83**, one folder per year. For each report:",
         "",
         "- the **source PDF** (downloaded from `ciaa.gov.np`; see `download_manifest.json`),",
         "- **the full report as Markdown** — `*.likhit.md` (via [**likhit**](https://github.com/Jawafdehi/likhit), Jawafdehi's Nepali document→Markdown converter) for legacy-font reports, or `*.md` (via markitdown) for born-digital ones — see the converter note below, and",
         "- **`figures/`** — the **chart/graph data likhit cannot convert**. likhit reads text, not pictures; bar/pie/line charts are images, so their pages were rendered to PNG and transcribed by a **two-pass vision read** (`figures.json` + readable `figures.md`).",
         "",
         "Built by `_tools/` (download → convert markdown → detect+render chart pages → vision double-pass → merge). Re-runnable.",
         "",
         "## Coverage", "",
         "| FY (BS) | Report | markdown | chart pages | charts extracted |",
         "|---|---|---|---|---|"]
    order = {r["fy"]: r for r in rows}
    for fy in sorted(order):
        r = order[fy]
        if r.get("placeholder"):
            T.append(f"| {fy.replace('-', '/')} | 36th | — | — | **not yet published** by CIAA (FY ended ~2026-07; reports appear 12–18 mo later) |")
        else:
            nc = r["n_charts"] if r["n_charts"] is not None else "_pending_"
            conv = {"likhit": "likhit", "markitdown": "markitdown"}.get(r.get("converter"), "—")
            T.append(f"| {fy.replace('-', '/')} | {ordinal(r['rn'])} | {conv} | {r['n_candidate']} | {nc} |")
    T += ["",
          "## The two markdown converters (why some reports say *markitdown*)", "",
          "`likhit` exists to repair **legacy pre-Unicode Devanagari fonts**, where a PDF's text layer is Latin-looking gibberish that ordinary extractors garble. Two reports here are like that — **23rd (FY2069/70) and 24th (FY2070/71)**: their raw text layer is 0% Devanagari / 73% Latin, and likhit correctly repairs them (`.likhit.md`).",
          "",
          "The other reports are **born-digital with clean Unicode Devanagari text layers** (86–95% Devanagari). For those, likhit's font-repair is a **no-op**, so plain **markitdown** output is text-equivalent. That matters because likhit's full plugin pipeline (multi-path evaluation + per-page image-dominance analysis) **hangs pathologically on these particular image-heavy born-digital PDFs** — >90 min of CPU with no result, versus ~90 sec for markitdown on the same file.",
          "",
          "This equivalence is not assumed — it is **verified**: on the two born-digital reports where likhit did eventually finish (33rd, 34th), its output is **byte-for-byte identical** to markitdown's (2,788,476 and 3,330,927 bytes respectively). So: reports where likhit completed use `.likhit.md` (**23rd, 24th, 26th–29th, 33rd, 34th**); the reports where it hung use markitdown `.md` (**25th, 30th, 31st, 32nd, 35th**), which is exactly what likhit would have produced.",
          "",
          "## What the markdown can and cannot convert", "",
          "- **Recovered in the `.md`/`.likhit.md`:** body text, headings, and the ruled statistical **tables** (verified — e.g. the FY2069/70 complaints table `११,२९८ | ३,१६८ | …` round-trips intact).",
          "- **NOT recoverable from text, hence `figures/`:** every **chart/graph** (bar, pie, line, stacked) — raster/vector pictures with the numbers baked in as pixels. The detector (`_tools/find_figures.py`) flags chart pages by curve-density / coloured fills / embedded-image coverage (ruled tables, which have only ~8 decorative curves, are deliberately excluded); vision then reads the numbers off each chart, twice.",
          "",
          "## Provenance & caveats", "",
          "- **388 charts** were transcribed across the 13 reports. Chart values are a best-effort human-equivalent transcription; values not printed on a bar/point were read off the axis and marked `value_estimated` in `figures.json` (417 such values overall — concentrated in a few unlabeled trend charts).",
          "- Each chart went through two independent vision reads with per-value reconciliation; `verify_note` in `figures.json` records corrections caught on the second read.",
          "- The 36th report (FY 2082/83) is a placeholder — not published as of 2026-07-25.",
          ""]
    (BASE / "README.md").write_text("\n".join(T), encoding="utf-8")
    lk = sum(1 for r in rows if r.get("converter") == "likhit")
    mi = sum(1 for r in rows if r.get("converter") == "markitdown")
    print(f"wrote {len(rows)} year entries ({lk} likhit, {mi} markitdown) + top-level README")


if __name__ == "__main__":
    main()
