#!/usr/bin/env python3
"""Download the CIAA annual-report PDFs for FY 2069/70 -> 2082/83 into per-year folders.

Source of truth for URLs is the scraped inventory.json in corruption-case-db. We pull the
full annual reports (not the executive-summary variants) for report numbers 23..36. The 36th
(FY 2082/83) is not published yet, so it gets a placeholder folder with a NOTES file.

Downloads go to <base>/<fy-folder>/<ordinal>-annual-report-<fy-folder>.pdf where fy-folder is
the fiscal year with the slash turned into a dash, e.g. 2069/70 -> 2069-70.
"""
import json
import subprocess
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
INVENTORY = Path("/home/damo/projects/jawafdehi/corruption-case-db/annual-reports/inventory.json")
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
FY_LO, FY_HI = 23, 36  # report numbers to cover (FY 2069/70 .. 2082/83)


def ordinal(n: int) -> str:
    if 10 <= n % 100 <= 20:
        suf = "th"
    else:
        suf = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suf}"


def fy_folder(fy_bs: str) -> str:
    return fy_bs.replace("/", "-")


def download(url: str, dest: Path) -> tuple[bool, str]:
    dest.parent.mkdir(parents=True, exist_ok=True)
    r = subprocess.run(
        ["curl", "-fsSL", "-A", UA, "--retry", "3", "--retry-delay", "2",
         "-m", "300", "-o", str(dest), url],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        return False, f"curl rc={r.returncode}: {r.stderr.strip()[:200]}"
    if not dest.exists() or dest.stat().st_size < 100_000:
        return False, f"file too small ({dest.stat().st_size if dest.exists() else 0} bytes)"
    with open(dest, "rb") as fh:
        head = fh.read(5)
    if head[:4] != b"%PDF":
        return False, f"not a PDF (magic={head!r})"
    return True, f"{dest.stat().st_size:,} bytes"


def main() -> int:
    inv = json.loads(INVENTORY.read_text())
    # Pick full reports (skip is_summary) for report_num in range, newest first.
    wanted = [r for r in inv["reports"]
              if FY_LO <= r["report_num"] <= FY_HI and not r.get("is_summary")]
    seen = set()
    results = []
    for rep in sorted(wanted, key=lambda r: r["report_num"]):
        n = rep["report_num"]
        if n in seen:
            continue
        seen.add(n)
        folder = BASE / fy_folder(rep["fy_bs"])
        dest = folder / f"{ordinal(n)}-annual-report-{fy_folder(rep['fy_bs'])}.pdf"
        ok, msg = download(rep["url"], dest)
        results.append({"report_num": n, "fy_bs": rep["fy_bs"], "url": rep["url"],
                        "dest": str(dest.relative_to(BASE)), "ok": ok, "detail": msg})
        print(f"[{'OK ' if ok else 'FAIL'}] {ordinal(n):>4} {rep['fy_bs']}  {msg}")

    # 36th (FY 2082/83) placeholder if not present in inventory.
    if not any(r["report_num"] == 36 for r in results):
        ph = BASE / "2082-83"
        ph.mkdir(parents=True, exist_ok=True)
        (ph / "NOT_YET_PUBLISHED.md").write_text(
            "# 36th CIAA Annual Report — FY 2082/83\n\n"
            "Not published as of 2026-07-25. FY 2082/83 ended ~mid-July 2026; CIAA historically\n"
            "publishes its annual report 12-18 months later (the 35th, for FY 2081/82, was posted\n"
            "2025-11). Re-run the downloader once it appears at https://ciaa.gov.np/publications/7\n",
            encoding="utf-8")
        print("[NOTE] 36th 2082/83  placeholder written (not yet published)")

    (BASE / "download_manifest.json").write_text(
        json.dumps({"source": inv["source"], "user_agent": UA, "results": results},
                   ensure_ascii=False, indent=2), encoding="utf-8")
    fails = [r for r in results if not r["ok"]]
    print(f"\n{len(results) - len(fails)}/{len(results)} downloaded; manifest -> download_manifest.json")
    return 1 if fails else 0


if __name__ == "__main__":
    raise SystemExit(main())
