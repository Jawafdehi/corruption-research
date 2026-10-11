#!/usr/bin/env python3
"""Derive the CIAA post-investigation decision series from the annual reports.

    python3 extract_ciaa_series.py     # -> dataset/ciaa_investigation_decisions.csv
                                       # -> dataset/ciaa_appeal_decisions.csv

Reads the committed `ciaa-annual-reports/*/**.likhit.md` conversions rather than
re-typing figures out of a PDF, so the series can be re-derived and audited. Needs
no credentials and makes no network call.

Two tables are pulled, both from परिच्छेद-२ of each report:

1. "विस्तृत अनुसन्धानबाट भएको कारबाही/निर्णयको विवरण" — what the Commission did with
   each complaint *after* a full investigation. These are counts of ACTIONS, not of
   complaints: one complaint can produce two actions (prosecute and also write to the
   department), which is why the total runs above the number of investigations closed.

2. "आयोगका निर्णयहरूको विवरण" — every decision the Commission's meetings took, which
   is where पुनरावेदन गने / पुनरावेदन नगने (to appeal / not to appeal) are recorded.

⚠️ Only FY2073/74 onward is emitted. The 2069/70–2072/73 reports present the same
material as a subject-area cross-tab with a different row vocabulary, so splicing them
onto this series would compare two different things. 2072/73 is absent from its own
report and the annex that claims to carry it in the 2073/74 report reproduces 2073/74's
own totals, so it is not recoverable. See `KNOWN_GAPS`.
"""
from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPORTS = ROOT / "ciaa-annual-reports"
OUT_INV = ROOT / "dataset" / "ciaa_investigation_decisions.csv"
OUT_APP = ROOT / "dataset" / "ciaa_appeal_decisions.csv"

#: Years deliberately not emitted, and why. Printed on every run so the gap is visible.
KNOWN_GAPS = {
    "2069/70": "actions reported only as a subject-area cross-tab; row labels not comparable",
    "2070/71": "no post-investigation action table found in the report",
    "2071/72": "subject-area cross-tab; तामेली column sums to 282 against a printed 281",
    "2072/73": "absent from its own report; the 2073/74 annex labelled 2072/73 repeats 2073/74 totals",
}

#: The report's own source URLs, by fiscal year, from download_manifest.json where present.
_TR = str.maketrans("०१२३४५६७८९", "0123456789")


def _num(cell: str) -> int | None:
    """A count, tolerating the mixed Devanagari/ASCII digits the OCR leaves behind."""
    s = cell.translate(_TR).replace(",", "").strip()
    return int(s) if re.fullmatch(r"\d+", s) else None


def _blocks(text: str) -> list[str]:
    return re.findall(r"```text\n(.*?)\n```", text, re.S)


def _report_urls() -> dict[str, str]:
    """Fiscal year -> the CIAA's own PDF URL, from the download manifest."""
    manifest = json.loads((REPORTS / "download_manifest.json").read_text())
    return {r["fy_bs"]: r["url"] for r in manifest["results"] if r.get("ok")}


def _caption(text: str, block: str) -> str:
    """The तालिका / अनुसूची number printed immediately above a table.

    Cited on the page next to the figure it produced, so a reader can open the report
    at the right table instead of being handed a bare URL to a 300-page PDF.
    """
    # Only the last 400 characters before the table: a caption further away than that
    # belongs to some other table, and a wrong citation is worse than none.
    before = " ".join(text[: text.find(block)].split())[-400:]
    hits = re.findall(r"(?:तालिका|अनुसूची)\s*[-–]?\s*[०-९\d][०-९\d.\-]*", before)
    return hits[-1].strip() if hits else ""


# Row label -> column. Order matters: the first pattern that matches a row wins, so
# "मुद्दा दायर" must be tested before the bare "दायर" that appears in wrapped headers.
_ACTION_ROWS = [
    ("filed", r"मुद्दा दायर"),
    ("advice", r"सुझाव"),
    ("referred", r"लेखी पठा"),
    ("tameli", r"तामेली"),
    ("held", r"मुल्तबी|मुल्तवी|मुलतबी"),
    ("other", r"अन्य"),
]


def _action_table(text: str) -> dict | None:
    """The post-investigation action table, as {column: count}.

    Picks the *shortest* qualifying block. The same figures also appear in a
    ministry-by-ministry annex running to forty-odd rows; the short form is the
    summary table in the chapter body and is the one the report's own prose quotes.
    """
    cands = [
        b for b in _blocks(text)
        if "तामेली" in b and "मुद्दा दायर" in b and re.search(r"कारबाही|निर्णय", b)
        and "मन्त्रालय" not in b  # exclude the ministry-wise annex
    ]
    if not cands:
        return None
    block = min(cands, key=len)
    row: dict = {"all_rows_sum": 0, "_block": block}
    for line in block.splitlines():
        # Pair each label with the next numeric cell to its right, rather than with
        # the last cell on the line. 2073/74 prints the table as two (label, count)
        # column-pairs side by side, so a last-cell rule reads the right-hand half
        # of the table into the left-hand half's labels.
        cells = [c.strip() for c in line.split("|")]
        for i, cell in enumerate(cells):
            value = next((v for v in (_num(c) for c in cells[i + 1:]) if v is not None), None)
            if value is None:
                continue
            if "जम्मा" in cell:
                row.setdefault("stated_total", value)
                continue
            if not re.search(r"[ऀ-ॿ]", cell) or _num(cell) is not None:
                continue  # a number or a blank, not a row label
            row["all_rows_sum"] += value
            for key, pattern in _ACTION_ROWS:
                if re.search(pattern, cell) and key not in row:
                    row[key] = value
                    break
    row.pop("_block_marker", None)
    return row if len(row) > 1 else None


def _appeal_decisions(text: str) -> dict:
    """पुनरावेदन गने / पुनरावेदन नगने from the Commission-decisions table.

    Tested negative-first: "पुनरावेदन नगने" contains "पुनरावेदन गने" as a substring
    under loose matching, so checking the affirmative first would swallow both.
    """
    out: dict = {}
    for block in _blocks(text):
        if "पुनरावेदन" not in block:
            continue
        for line in block.splitlines():
            value = _num(line.split("|")[-1])
            if value is None:
                continue
            if re.search(r"पुनरावेदन\s*न\s*ग(र)?ने", line):
                out.setdefault("not_appealed", value)
            elif re.search(r"पुनरावेदन\s*ग(र)?ने", line):
                out.setdefault("appealed", value)
    return out


def _fy(folder: Path) -> str:
    start, end = folder.name.split("-")
    return f"{start}/{end}"


def main() -> None:
    inv_rows, app_rows = [], []
    urls = _report_urls()
    for folder in sorted(REPORTS.glob("20*-*")):
        files = list(folder.glob("*.likhit.md"))
        if not files:
            continue
        fy = _fy(folder)
        if fy in KNOWN_GAPS:
            continue
        text = files[0].read_text(errors="ignore")

        action = _action_table(text)
        if action:
            counts = {k: action.get(k) for k, _ in _ACTION_ROWS}
            stated = action.get("stated_total")
            # 2073/74 breaks the actions out into ten categories, not six, so the six
            # tracked columns do not sum to the table's total. Carry the full sum over
            # every row so `tracked / total_actions` stays an honest share.
            total = stated if stated is not None else action["all_rows_sum"]
            note = ("Row counts reconciled against the table's own printed जम्मा."
                    if stated is not None else
                    "Table prints no जम्मा; the total is the sum of its own rows.")
            if fy == "2078/79":
                note += (" `filed` is 130 = 115 prosecute-only + 9 prosecute-and-advise"
                         " + 6 prosecute-and-refer, matching the treatment तामेली already gets.")
            inv_rows.append({
                "fy": fy, **counts,
                "total_actions": total,
                "tracked_sum": sum(v for v in counts.values() if v is not None),
                "all_rows_sum": action["all_rows_sum"],
                "printed_total": stated if stated is not None else "",
                "figure": _caption(text, action["_block"]),
                "source_url": urls.get(fy, ""),
                "note": note,
                "source": files[0].relative_to(ROOT).as_posix(),
            })

        appeal = _appeal_decisions(text)
        if appeal:
            app_rows.append({
                "fy": fy,
                "figure": _caption(text, next(b for b in _blocks(text) if "पुनरावेदन" in b)),
                "source_url": urls.get(fy, ""),
                "appealed": appeal.get("appealed"),
                "not_appealed": appeal.get("not_appealed"),
                "source": files[0].relative_to(ROOT).as_posix(),
            })

    for path, rows in ((OUT_INV, inv_rows), (OUT_APP, app_rows)):
        with path.open("w", newline="", encoding="utf-8") as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows[0]))
            w.writeheader()
            w.writerows(rows)
        print(f"wrote {path.relative_to(ROOT)}  ({len(rows)} fiscal years)")

    _validate(inv_rows)
    for fy, why in KNOWN_GAPS.items():
        print(f"  skipped {fy}: {why}")


#: Prosecution counts the reports state in prose, independently of the table this script
#: parses. The 2076/77 report lists the whole run in one sentence (परिच्छेद-५): "आयोगले
#: आर्थिक वर्ष २०७२।७३ मा १४४, २०७३।७४ मा १५४, २०७४।७५ मा १९४, २०७५।७६ मा ३५१ हुँदै
#: 2076।77 मा 441 वटा मुद्दा दायर गरेको छ।" If a parse ever drifts, this catches it.
PROSE_FILED = {
    "2073/74": 154, "2074/75": 194, "2075/76": 351, "2076/77": 441, "2081/82": 137,
}


def _validate(rows: list[dict]) -> None:
    """Fail loudly rather than publish a series that has silently drifted."""
    by_fy = {r["fy"]: r for r in rows}
    bad = [
        f"{fy}: parsed {by_fy[fy]['filed']}, report prose says {want}"
        for fy, want in PROSE_FILED.items() if fy in by_fy and by_fy[fy]["filed"] != want
    ]
    if bad:
        raise SystemExit("filing counts disagree with the reports' own prose:\n  " + "\n  ".join(bad))

    printed = [r for r in rows if r["printed_total"] != ""]
    mismatched = [r["fy"] for r in printed if r["printed_total"] != r["all_rows_sum"]]
    if mismatched:
        raise SystemExit(f"row sums do not reach the printed जम्मा for: {mismatched}")

    print(f"  filing counts matching the reports' prose: {len(PROSE_FILED)}/{len(PROSE_FILED)}")
    print(f"  row sums matching the printed जम्मा: {len(printed) - len(mismatched)}/{len(printed)}")


if __name__ == "__main__":
    main()
