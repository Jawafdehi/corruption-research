#!/usr/bin/env python3
"""Derive the dashboard's data file from `dataset/` — the single source of truth.

    python gen_site_data.py            # -> site/src/data/report.generated.json

Reads the committed CSVs through `corpus_data.build_frames()`; needs no credentials
and makes no API call. Every figure the dashboard renders is produced here, so the
site carries no hand-entered number and cannot drift from the data it describes.

`corpus_data` stays the only place a result is defined. The dashboard is a view.
"""
from __future__ import annotations

import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd

import corpus_data as cd

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "site" / "src" / "data" / "report.generated.json"
XCHECK = ROOT / "ciaa-vs-register" / "data"

#: Fiscal-year labels are "2069/70"; the charts key on the start year as an int.
def _fy(label: str) -> int:
    return int(str(label).split("/")[0])


def _num(v):
    "Keep whole numbers as ints so the UI never renders '2,949.0'."
    f = float(v)
    return int(f) if f.is_integer() else round(f, 2)


def _rows(df: pd.DataFrame, **rename) -> list[dict]:
    out = df.rename(columns=rename).to_dict("records")
    return [{k: (_num(v) if isinstance(v, (int, float)) else v) for k, v in r.items()} for r in out]


def _cross_check() -> dict:
    """The CIAA-reports-vs-register comparison.

    Its inputs are a manual/vision extraction from report PDFs that cannot be
    recomputed from the API, so they live as CSVs rather than in `corpus_data`.
    Counted here rather than copied, so the totals cannot drift from their basis.
    """
    # Both files carry TOTAL / PCT_OF_CIAA summary rows under the same column as the
    # years. Select the years by shape (`NNNN/NN`) and re-add the totals ourselves, or a
    # summary row gets counted as a fiscal year and silently doubles every total.
    is_fy = lambda s: s.astype(str).str.match(r"\d{4}/\d{2}$")

    by_fy = pd.read_csv(XCHECK / "by_fiscal_year.csv")
    cmp_rows = by_fy[is_fy(by_fy.fiscal_year)].dropna(subset=["ciaa_filed"])
    agreement = [
        {"fy": _fy(r.fiscal_year), "ciaaFiled": int(r.ciaa_filed), "registerComparable": int(r.ngm_ciaa_comparable)}
        for r in cmp_rows.itertuples()
    ]

    case = pd.read_csv(XCHECK / "case_level_summary.csv")
    years = case[is_fy(case.fy)]
    excluded = pd.read_csv(XCHECK / "ngm_excluded.csv")

    surplus = [
        ("Counted in the previous year's report", "surplus_prior_year_report", False),
        ("Omitted, but confirmed by a later report", "surplus_named_in_later_report", False),
        ("Recorded under a different offence label", "surplus_reclassified_same_report", False),
        ("Still unexplained", "surplus_unexplained", True),
    ]
    return {
        "sourceAgreement": agreement,
        "yearsCompared": len(agreement),
        "ciaaFiledTotal": int(cmp_rows.ciaa_filed.sum()),
        "registerComparableTotal": int(cmp_rows.ngm_ciaa_comparable.sum()),
        "nonCiaaStreams": int(len(excluded)),
        "nonCiaaStreamSplit": [
            {"key": k, "count": int(v)} for k, v in excluded.excluded_as.value_counts().items()
        ],
        "yearsExamined": int(len(years)),
        "ciaaListed": int(years.ciaa_listed.sum()),
        "foundInRegister": int(years.ciaa_listed.sum() - years.ciaa_cases_absent_from_register.sum()),
        "registerSurplus": int(years.register_surplus.sum()),
        "surplusReasons": [
            {"en": label, "count": int(years[col].sum()), **({"unexplained": True} if flag else {})}
            for label, col, flag in surplus
            if col in years.columns
        ],
    }


def _provenance() -> dict:
    "What the reader needs to judge how current this is."
    try:
        sha = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"], cwd=ROOT, capture_output=True, text=True, timeout=10
        ).stdout.strip()
    except Exception:
        sha = ""
    files = {}
    for name in ("cases", "hearings", "entities", "appeals"):
        p = ROOT / "dataset" / f"{name}.csv"
        if p.exists():
            files[name] = {
                "rows": int(len(pd.read_csv(p))),
                "modified": datetime.fromtimestamp(p.stat().st_mtime, timezone.utc).strftime("%Y-%m-%d"),
            }
    return {"generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"), "commit": sha, "dataset": files}


def build() -> dict:
    f = cd.build_frames()
    totals = {r.metric: _num(r.value) for r in f["corpus_totals"].itertuples()}
    a = {r.key: _num(r.value) for r in f["assumptions"].itertuples()}

    cohorts = _rows(f["cohorts"].assign(fy=f["cohorts"].fiscal_year.map(_fy)).drop(columns=["fiscal_year"]),
                    median_months="medianMonths")
    # A cohort is "complete" while nothing from it is still pending; the first year that
    # still has pending cases ends the run. Derived, so it tracks the data year to year.
    complete_through = max((c["fy"] for c in cohorts if c["pending"] == 0), default=0)

    trend = f["filed_vs_decided_by_year"]
    verdict = f["verdict_by_year"]
    mix = f["charge_mix_by_year"]

    report = {
        "provenance": _provenance(),
        "corpus": {
            "ciaaProsecutions": totals["corpus_in_window"],
            "substantive": totals["substantive"],
            "moneyLaundering": totals["money_laundering"],
            "otherBucket": totals["other_bucket"],
            "avgFiledPerYear": totals["avg_filed_per_year"],
            "fiscalYears": [_fy(x) for x in trend.fiscal_year],
        },
        "outcome": {
            "convicted": totals["outcome_convicted"],
            "partial": totals["outcome_partial"],
            "acquitted": totals["outcome_acquitted"],
            "decided": totals["outcome_decided"],
            "ongoing": totals["outcome_ongoing"],
        },
        "rates": {
            "convictionPct": totals["conviction_rate_pct"],
            "convictionFullOnlyPct": totals["conviction_rate_full_only_pct"],
        },
        "verdictsModelDerivedExcluded": totals["verdicts_model_derived_excluded"],
        "byCharge": _rows(f["outcome_by_charge"], charge_en="en", charge_ne="ne"),
        "justiceMinDecisions": 30,
        "justices": _rows(f["justices"], justice="name", decisions="decisions", conviction_pct="convPct"),
        "trend": {
            "years": [_fy(x) for x in trend.fiscal_year],
            "filed": [int(x) for x in trend.filed],
            "decided": [int(x) for x in trend.decided],
        },
        "chargeMixByYear": _rows(mix.assign(fy=mix.fiscal_year.map(_fy)).drop(columns=["fiscal_year"])),
        "filedByMonth": _rows(f["filed_by_month"], month_index="month", month_name="name"),
        "funnel": _rows(f["funnel"], stage_key="key", count="count"),
        "ciaa": {
            "complaintsYear": a.get("funnel_complaints"),
            "casesFiledYear": a.get("funnel_filed"),
            "investigatedYear": a.get("funnel_investigated"),
            "successRatePct": a.get("ciaa_success_rate_pct"),
            "damagesClaimedYearBn": a.get("ciaa_damages_1yr_bn"),
            "complaints5yr": a.get("ciaa_complaints_5yr"),
            "casesFiled5yr": a.get("ciaa_filed_5yr"),
        },
        "entityResolution": {
            "defendantRows": totals["corpus_defendant_rows"],
            "distinctNames": totals["corpus_distinct_defendants"],
            "resolved": totals["corpus_defendants_resolved"],
        },
        "overTime": {
            "byVerdictYear": _rows(
                verdict.assign(fy=verdict.fiscal_year.map(_fy)).drop(columns=["fiscal_year"]),
                fake_convicted="fakeConv", fake_disposed="fakeDisp",
            ),
            "cohorts": cohorts,
            "completeThroughFy": complete_through,
        },
        "appeals": {**cd.appeal_effect(), "byTrialOutcome": _rows(cd.load_appeals())},
        "crossCheck": _cross_check(),
        "assumptions": _rows(f["assumptions"]),
        "leadership": _rows(f["leadership"]),
    }
    return report


def main() -> None:
    report = build()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    c = report["corpus"]
    print(f"wrote {OUT.relative_to(ROOT)}")
    print(f"  corpus {c['ciaaProsecutions']} cases · {len(report['justices'])} benches · "
          f"{len(report['trend']['years'])} fiscal years")


if __name__ == "__main__":
    main()
