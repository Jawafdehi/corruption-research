"""Corpus data layer for the corruption-research notebook.

**One `dataset/` folder = the single source of truth.** Everything the analysis
rests on lives there and is scoped to the corpus up front; the notebook then
*derives* every result table from it in pandas (no stored result CSVs).

    dataset/
      cases.csv        the corpus — Special Court `-CR-` cases filed in FY2069/70–2082/83
      hearings.csv     deciding hearings for those cases only
      entities.csv     parties for those cases only
      assumptions.csv  external constants (CIAA funnel + 5-yr figures) with sources

These committed files ARE the cache: a normal run reads them instantly with no
API call; only an explicit refresh re-pulls the raw `-CR-` register and rewrites
them. There is no second raw copy on disk (the corpus ≈ the whole register, so a
raw mirror would only duplicate these).

**Corpus.** Special Court criminal register: `court_identifier='special'` AND
`case_number LIKE '%-CR-%'` AND `registration_date_bs` in `[2069-04-01, 2083-04-01)`
(the complete fiscal years BS 2069/70 → 2082/83). The `-CR-` register opens exactly at
the FY2069/70 rollover, so window and register share one boundary. No plaintiff filter:
the register is the definition. A handful of `-CR-` rows are individual-plaintiff
review/contempt petitions (`निर्णय वदर`) — they fall in the `other` case-type bucket and
so are excluded from the "substantive" cut, but they remain in the raw corpus count.

Data source (auto): read committed `dataset/*.csv` → else paginate the live API,
scope to the corpus, and (re)write `dataset/*.csv`.

**Auth is optional.** The dataset is committed, so the normal path — and everything the
notebook does — needs no credentials, no environment, no setup at all. Auth is only
touched when you explicitly ask to *refresh* the snapshot from the live API, and then
it's a browser sign-in: `login()` prints a short code, you approve it at
auth.jawafdehi.org/device on any device, and the resulting token carries your own roles
(`/api/query/` needs `ReadOnly`). Nothing is stored on disk and there is no shared secret.
Set `JAWAFDEHI_JWT` to skip the prompt if you already hold a token (CI, automation).
"""
from __future__ import annotations
import os, re, statistics, time
from pathlib import Path

import pandas as pd
import requests

HERE = Path(__file__).parent
DATA = HERE / "dataset"

# Refresh endpoints. These are public: a public OIDC client (no secret) and the public API host,
# both as published in Jawafdehi's "How to get an API token" guide. None of it is a credential,
# so it's hardcoded — there is nothing for a user to configure, and no refresh is needed to run.
ISS = "https://auth.jawafdehi.org"
CLIENT_ID = "380811001584419184"      # the `jawafdehi-mcp` public app — the one carrying the device-code grant
AUD = "377760393168159088"            # Jawafdehi.org project; the audience the API resolves roles against
API = "https://api.jawafdehi.org/api/query/"
SCOPE = f"openid profile email urn:zitadel:iam:org:project:id:{AUD}:aud"   # the aud URN is what makes roles visible
UA = {"User-Agent": "jawafdehi-notebook/1.0"}   # a default urllib/requests agent gets blocked at the edge
PAGE = 500

LO, HI = "2069-04-01", "2083-04-01"          # the fiscal window [Shrawan 2069, Shrawan 2083)
N_FY = int(HI[:4]) - int(LO[:4])             # 14 complete fiscal years
DECISIONS = ("ठहर", "आंशिक ठहर", "सफाई")     # convicted / partial / acquitted

DEV = str.maketrans("०१२३४५६७८९", "0123456789")
MONTHS = ["Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
          "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"]
FAM = {
    "1_bribery": ("Bribery", "रिसवत / घुस"), "2_fake_credential": ("Fake credential", "नक्कली प्रमाण पत्र"),
    "3_embezzlement": ("Embezzlement", "रकम हिनामिना"), "4_loss_to_govt": ("Loss to government", "हानीनोक्सानी"),
    "5_illicit_enrichment": ("Illicit enrichment", "गैरकानूनी सम्पत्ति"), "6_illegal_benefit": ("Illegal benefit", "गैरकानुनी लाभ"),
    "7_money_laundering": ("Money laundering", "सम्पत्ति शुद्धीकरण"), "8_irregularity": ("Irregularity", "अनियमितता"),
    "9_revenue": ("Revenue leakage", "राजश्व चुहावट"), "10_false_statement": ("False statement", "झुठ्ठा विवरण"),
    "11_forged_document": ("Forged document", "गलत लिखत"), "12_govt_land": ("Govt land misregistration", "सरकारी जग्गा"),
    "13_exam_rigging": ("Exam rigging", "परीक्षा फेरबदल"),
}
DROP_FAM = {"90_procedural_petition", "99_other"}
NON_SUBSTANTIVE = DROP_FAM | {"7_money_laundering"}       # money-laundering is a different statute
RESULT_TABLES = ["corpus_totals", "offense_mix", "outcome_by_charge", "charge_mix_by_year",
                 "filed_by_month", "filed_vs_decided_by_year", "verdict_by_year", "cohorts",
                 "justices", "funnel"]

# The raw Special Court `-CR-` pull (paginated in memory, then scoped to the corpus and committed).
RAW = {
    "cases": ("court_cases", "case_number, case_type, plaintiff, registration_date_bs, case_status",
              "court_identifier='special' AND case_number LIKE '%-CR-%'", "case_number"),
    # `verdict_derived` separates verdicts the court itself published on a cause
    # list from ones READ OUT OF THE JUDGMENT by a model (`extract_verdicts` in
    # the API marks those under extra_data.verdict_extraction). Cases that reached
    # the mirror without ever appearing on a cause list have no scraped
    # disposition, so recovering one is the only way to count them at all — but a
    # conviction rate that silently mixes the two would misrepresent its source.
    # Every headline below is court-sourced only; the derived rows are reported
    # separately and never folded in.
    "hearings": ("court_case_hearings",
                 "case_number, decision_type, judge_names, "
                 "(extra_data->'verdict_extraction' IS NOT NULL) AS verdict_derived",
                 "court_identifier='special' AND case_number LIKE '%-CR-%' AND decision_type IN ('ठहर','आंशिक ठहर','सफाई')",
                 "case_number, decision_type, judge_names"),
    "entities": ("court_case_entities", "case_number, side, name, nes_id",
                 "court_identifier='special' AND case_number LIKE '%-CR-%'", "case_number, side, name, nes_id"),
}

#: What every refreshed table must carry before it is allowed to overwrite the
#: committed dataset. A missing column here is not a crash downstream — pandas
#: and `_transform` both degrade politely — it is a *changed number* with no
#: error, so the check has to happen at the boundary where the data lands.
REQUIRED = {
    "cases": {"case_number", "case_type", "plaintiff", "registration_date_bs", "case_status"},
    "hearings": {"case_number", "decision_type", "judge_names", "verdict_derived"},
    "entities": {"case_number", "side", "name", "nes_id"},
}

# ---------------------------------------------------------------- auth (refresh only) + fetch
# Only ever reached on an explicit refresh. Reading the committed dataset touches none of this.
_tok = {"jwt": None, "exp": 0.0}

def _form(url, data):
    "POST a form to the OIDC endpoint. OAuth reports 'not approved yet' as a 4xx with a JSON body."
    r = requests.post(url, headers=UA, data=data, timeout=30)
    try:
        return r.json()
    except ValueError:
        raise RuntimeError(f"{url} -> {r.status_code} {r.text[:200]}")

def login(timeout=300):
    """Sign in with the OAuth **device flow** and return a bearer JWT.

    Prints a short code; approve it at auth.jawafdehi.org/device on any device (your phone is
    fine — it needn't be this machine). No secret, nothing to configure. You approve as yourself,
    so the token carries YOUR roles: `/api/query/` needs `ReadOnly`, which only an admin grants.
    """
    d = _form(f"{ISS}/oauth/v2/device_authorization", {"client_id": CLIENT_ID, "scope": SCOPE})
    if "device_code" not in d:
        raise RuntimeError(f"device authorization failed: {d}")
    print(f"\n  Go to:  {d['verification_uri']}\n  Code :  {d['user_code']}\n", flush=True)
    interval = d.get("interval", 5)
    deadline = time.monotonic() + min(d.get("expires_in", timeout), timeout)
    while time.monotonic() < deadline:
        time.sleep(interval)
        t = _form(f"{ISS}/oauth/v2/token", {"grant_type": "urn:ietf:params:oauth:grant-type:device_code",
                                            "device_code": d["device_code"], "client_id": CLIENT_ID})
        if "access_token" in t:
            print("Signed in.", flush=True)
            return t["access_token"]
        err = t.get("error")
        if err == "slow_down":
            interval += 5
        elif err != "authorization_pending":
            raise RuntimeError(t.get("error_description") or err or t)
    raise TimeoutError("the code expired before it was approved — run the refresh again")

def get_token(force=False):
    "A bearer JWT: $JAWAFDEHI_JWT if set (CI/automation), else the cached one, else a browser sign-in."
    if not force:
        env = os.environ.get("JAWAFDEHI_JWT")
        if env:
            return env
        if _tok["jwt"] and time.time() < _tok["exp"] - 60:
            return _tok["jwt"]
    _tok["jwt"] = login(); _tok["exp"] = time.time() + 3000
    return _tok["jwt"]

def whoami(token=None):
    """Roles carried by the token — `/api/query/` needs `ReadOnly`; `[]` means none were granted.

    The `roles` claim comes back as a mapping for a human's device-flow token but
    as a plain list for a service account's client-credentials token, so accept
    either. Prefer the project-scoped URN claim when present: it is the one the
    API actually resolves roles against, and it is unambiguous about which
    project granted them.
    """
    r = requests.get(f"{ISS}/oidc/v1/userinfo",
                     headers={"Authorization": f"Bearer {token or get_token()}", **UA}, timeout=30)
    r.raise_for_status()
    claims = r.json()
    roles = claims.get(f"urn:zitadel:iam:org:project:{AUD}:roles") or claims.get("roles") or []
    return sorted(roles)   # sorted() over a mapping yields its keys, over a list its items

def _api(sql, tries=5):
    "POST one query; retry transient 5xx/timeouts (pagination is many requests over a rolling backend)."
    last = None
    for i in range(tries):
        try:
            r = requests.post(API, headers={"Authorization": f"Bearer {get_token()}", **UA},
                              json={"query": sql, "timeout_seconds": 50}, timeout=70)
            if r.status_code == 403:
                # 403, not 401: the token is fine, the account just lacks the role. Retrying/re-login
                # cannot fix it, so fail immediately with the actionable message. The role lookup is
                # a nicety — never let it mask the 403 it is explaining.
                try:
                    held = whoami() or "no roles"
                except Exception:
                    held = "could not read /userinfo"
                raise PermissionError(f"403 from the query API: signed in, but this account lacks the "
                                      f"ReadOnly role (holds: {held}). Ask an admin to grant it.")
            if r.status_code in (429, 500, 502, 503, 504):
                last = str(r.status_code); time.sleep(2 * (i + 1)); continue
            r.raise_for_status(); d = r.json()
            return d["columns"], d["rows"]
        except (requests.Timeout, requests.ConnectionError) as e:
            last = type(e).__name__; time.sleep(2 * (i + 1))
    raise RuntimeError(f"API failed after {tries} tries (last: {last})")

def _paginate(spec):
    """Pull one raw table, following pages until short, as a DataFrame.

    Column names come from the API response, not from splitting the SELECT list
    on commas. That shortcut works only while every column is a bare name: the
    moment one is a computed expression it becomes its own header, and any alias
    is lost. It silently mislabelled `verdict_derived` as the whole SQL string —
    so the provenance split downstream found no such column, took its
    "dataset predates the column" branch, and folded model-derived verdicts back
    into the published conviction rate. Exactly the failure the column exists to
    prevent, and invisible in the numbers (45.3% vs 45.1%).
    """
    tbl, cols, where, order = spec
    rows, names, off = [], None, 0
    while True:
        page_cols, page = _api(f"SELECT {cols} FROM {tbl} WHERE {where} ORDER BY {order} LIMIT {PAGE} OFFSET {off}")
        names = names or page_cols
        rows.extend(page)
        if len(page) < PAGE:
            break
        off += PAGE
    return pd.DataFrame(rows, columns=names)

def load_dataset(refresh=False):
    """Return the corpus source tables {cases, hearings, entities}.
    The committed dataset/*.csv ARE the cache: a normal run reads them instantly with no API.
    refresh re-paginates the raw `-CR-` pull, scopes it to the corpus, and rewrites them."""
    files = {n: DATA / f"{n}.csv" for n in ("cases", "hearings", "entities")}
    if not refresh and all(f.exists() for f in files.values()):
        return {n: pd.read_csv(f, dtype=str, keep_default_na=False) for n, f in files.items()}
    raw = {n: _paginate(spec) for n, spec in RAW.items()}       # straight to memory, no raw mirror on disk
    for n, want in REQUIRED.items():
        missing = want - set(raw[n].columns)
        if missing:
            raise RuntimeError(
                f"refusing to overwrite dataset/{n}.csv: the pull is missing {sorted(missing)} "
                f"(got {list(raw[n].columns)}). Fix the query before rewriting the snapshot — "
                f"a missing column changes results silently rather than raising."
            )
    reg = raw["cases"].registration_date_bs.fillna("")          # `-CR-` guaranteed by the pull
    cases = raw["cases"][(reg >= LO) & (reg < HI)].copy()        # apply the fiscal window -> the corpus
    cn = set(cases.case_number)
    out = {"cases": cases,
           "hearings": raw["hearings"][raw["hearings"].case_number.isin(cn)].copy(),
           "entities": raw["entities"][raw["entities"].case_number.isin(cn)].copy()}
    DATA.mkdir(exist_ok=True)
    for n, df in out.items():
        df.to_csv(DATA / f"{n}.csv", index=False)
    # re-read the committed files so a refresh returns frames typed identically to a normal read
    return {n: pd.read_csv(files[n], dtype=str, keep_default_na=False) for n in out}

def load_assumptions():
    return pd.read_csv(DATA / "assumptions.csv")

def load_complaint_disposal():
    """What happened to EVERY complaint on the Commission's books in a year.

    The companion to `load_disposals`, one level up: that one covers only
    complaints that finished a detailed investigation, which is the Commission's
    second filter. This covers the whole workload, so the first filter is visible
    too -- and the first filter is where most complaints actually end.

    `total_complaints` is the year's full workload (carried-in + newly registered),
    which is the denominator the report itself uses for its disposal table. Two
    columns in here count different events and must never be differenced:
    `to_investigation` is complaints SENT to detailed investigation during the
    year; `investigations_completed` is investigations FINISHED during the year,
    which mostly began earlier.
    """
    return pd.read_csv(DATA / "ciaa_complaint_disposal.csv")

def load_disposals():
    """What the Commission decided to do with complaints that COMPLETED a detailed investigation.

    This is the second of the Commission's two filters and the one its own funnel chart does not
    isolate: the first closes complaints at प्रारम्भिक छानबिन (preliminary screening), before anyone
    investigates; this one closes them as तामेली AFTER a full investigation has been carried out.
    One row per fiscal year, transcribed from the decision table (or reconciled Venn figure) printed
    in that year's annual report, with the figure number and report URL on the row.

    Built by `extract_ciaa_series.py`, which parses the decision table out of each report's own
    committed text conversion rather than re-typing it, and refuses to write a series that disagrees
    with the filing counts the reports state in prose. FY2073/74–2081/82; the four earlier years are
    skipped because they report the same material as a subject-area cross-tab with a different row
    vocabulary. `extract_ciaa_series.KNOWN_GAPS` records which year is missing and why.

    `filed` is मुद्दा दायर on the same table. It counts DECISIONS to prosecute in that year, which is
    not the same unit as the court register's filings, so the two are never differenced here.

    The superseded hand-compiled `ciaa_disposals.csv` is kept as a regression check, not as data.
    It is reconciled here on every overlapping year, with one documented correction: it recorded
    2078/79 `filed` as 115, which is the report's "मुद्दा दायर गने मात्र" row. The comparable figure
    is 130, adding the 9 "दायर and सुझाव both" and 6 "दायर and लेखी पठाउने both" decisions — exactly
    the treatment its own तामेली figure already used (559 + 68 + 10 = 637).
    """
    df = pd.read_csv(DATA / "ciaa_investigation_decisions.csv").rename(columns={"total_actions": "total"})
    _reconcile_disposals(df)
    return df


#: Years where the superseded compilation differs from the parsed series, and why. Any OTHER
#: disagreement is a regression and raises.
_DISPOSAL_CORRECTIONS = {("2078/79", "filed"): "counted the 'prosecute only' row, excluding combined decisions",
                         ("2078/79", "total"): "totalled all Commission decisions, not post-investigation actions"}


def _reconcile_disposals(df):
    legacy = pd.read_csv(DATA / "ciaa_disposals.csv").set_index("fy")
    cur = df.set_index("fy")
    drift = [f"{fy} {col}: {legacy.loc[fy, col]} -> {cur.loc[fy, col]}"
             for fy in legacy.index if fy in cur.index
             for col in ("filed", "tameli", "total")
             if legacy.loc[fy, col] != cur.loc[fy, col] and (fy, col) not in _DISPOSAL_CORRECTIONS]
    if drift:
        raise ValueError("parsed disposal series drifted from the committed compilation:\n  " + "\n  ".join(drift))


def load_bigo_demanded():
    """Total बिगो claimed across every case the Commission filed, by fiscal year.

    From "कुल बिगो मागदाबी" in each annual report -- the prose sentence where the
    report states it, otherwise that table's own जम्मा row.

    ⚠️ CLAIMED, never upheld and never recovered. The court register carries no amount
    at all, so this figure has no counterpart to be differenced against; it is the
    opening claim and nothing on this site turns it into a loss.

    Seven of the nine years are cross-checked in `extract_ciaa_series`: the case count
    on the बिगो table must equal `filed` from the decisions table, which is printed in
    a different chapter of the same report.
    """
    return pd.read_csv(DATA / "ciaa_bigo_demanded.csv")


def load_sc_fine_ledger():
    """The district courts' fine ledger, all case types, from the Supreme Court annual report.

    Appendix 65(क) grand-total row of each report (FY2075/76-2081/82): the fine ledger
    (लगत), what was disposed of (फछ्‌र्यौट) and what remains. Built from the research
    lane's `recovery/series.csv`, which reconciles each total against the report's own prose.

    ⚠️ NOT a corruption figure and NOT cash. The ledger covers every case type in all 77
    district courts and is never broken down by case type, so no corruption recovery rate
    can be read from it. "Disposed" includes imprisonment served in lieu of payment and
    ledger entries written off, not only money paid. Both columns are stocks carrying
    decades of arrears, not one year's fines.
    """
    return pd.read_csv(DATA / "sc_fine_ledger.csv")


#: The Supreme Court constitutional bench voided rule 30 of the CIAA Rules, 2059 (sting
#: operations funded by the Commission) on this date, in month 10 of FY2077/78.
STING_RULING_BS = "2078-01-08"


def bribery_around_sting_ruling():
    """Bribery filings in the fiscal year of the sting ruling, split at the ruling date.

    Same case universe and charge grouping as `charge_mix_by_year` (petitions and money
    laundering out, `_fam6`), so the counts match the chart. It exists because the fall in
    bribery filings is often read as the ruling's effect, and most of that year's filings
    were registered BEFORE it.
    """
    c = load_dataset()["cases"]
    ct = c.case_type.fillna("")
    cm = c[~ct.str.contains("निवेदन") & ~ct.str.contains("सम्पत्ति शुद्धीकरण")].copy()
    cm = cm[cm.case_type.map(_fam6) == "bribery"]
    fy = _filing_fy(STING_RULING_BS)
    yr = cm[cm.registration_date_bs.map(_filing_fy) == fy]
    before = int((yr.registration_date_bs < STING_RULING_BS).sum())
    return {"rulingBs": STING_RULING_BS, "fy": fy, "filed": int(len(yr)),
            "before": before, "after": int(len(yr)) - before}


def load_investigation_appeal_decisions():
    """Whether the Commission decided to APPEAL a Special Court verdict, by fiscal year.

    From the "आयोगका निर्णयहरूको विवरण" table (पुनरावेदन गने / पुनरावेदन नगने). These are the
    Commission's own decisions, taken at its meetings, so they are the upstream half of the appeal
    story the Supreme Court register shows downstream.

    ⚠️ A decision is not a filing, and the year a decision is taken is not the year the underlying
    verdict was handed down. These counts are NOT a denominator for any appeal-success rate, and
    they are not differenced against the Supreme Court figures anywhere.
    """
    return pd.read_csv(DATA / "ciaa_appeal_decisions.csv")

def load_supreme_appeal_duration():
    """One row per corruption appeal registered at the Supreme Court: when it was
    registered, when it was decided, and the days between.

    Built from the public court-case API (`/api/courtcases/?court=supreme&type=भ्रष्टाचार`),
    which carries `registration_date_ad` and `verdict_date_ad` per case. Only `-CR-`
    numbers are kept: `RV` (review), `CF`/`NF` (writs) and the rest answer a different
    question than "how long did an appeal against a corruption verdict take".

    `days_to_decision` is blank where no verdict date is recorded. Undecided rows are
    KEPT rather than dropped, because the share of a cohort still open is the only way
    to tell whether that cohort's median can be trusted.
    """
    return pd.read_csv(DATA / "supreme_appeal_duration.csv")


#: A cohort is read as settled once this share of its appeals has been decided...
SUPREME_SETTLED_MIN = 0.85
#: ...and once it is big enough that a median means anything.
SUPREME_SETTLED_MIN_N = 20


def supreme_appeal_delay():
    """Time from appeal registered to appeal decided, over the cohorts complete enough
    to carry an honest median.

    ⚠️ RIGHT-CENSORED, and the censoring runs one way. Barely half the registered
    appeals carry a verdict date, and the ones still open are by definition the slow
    ones, so a median taken over decided cases alone UNDERSTATES the wait. Recent
    cohorts are worst affected -- 2025 shows a median under 13 months off five decided
    appeals -- so only years at least SUPREME_SETTLED_MIN decided are used, and the
    site quotes nothing computed outside this function.

    The median is pooled over the settled cohorts' own cases, not averaged across their
    medians: a mean of medians is not a median of anything.
    """
    df = load_supreme_appeal_duration()
    per_year = (
        df.assign(decided=df["days_to_decision"].notna())
        .groupby("registration_year_ad")
        .agg(registered=("case_number", "size"), decided=("decided", "sum"))
        .reset_index()
    )
    per_year["share_decided"] = per_year["decided"] / per_year["registered"]
    settled_years = per_year[
        (per_year["share_decided"] >= SUPREME_SETTLED_MIN)
        & (per_year["registered"] >= SUPREME_SETTLED_MIN_N)
    ]["registration_year_ad"].tolist()

    pool = df[
        df["registration_year_ad"].isin(settled_years) & df["days_to_decision"].notna()
    ]["days_to_decision"]

    by_year = df[df["days_to_decision"].notna()].groupby("registration_year_ad")[
        "days_to_decision"
    ].median()
    slowest = by_year.loc[settled_years].idxmax()

    yrs = lambda d: round(float(d) / 365.25, 2)

    # Mean alongside median, because "median" is a word a general reader skips. They
    # are 0.19 years apart over a near-symmetric distribution (skew 0.31), so the page
    # can say "about four and a half years whichever way you take it" and drop the
    # jargon without swapping in a worse statistic.
    mean_years = yrs(pool.mean())

    # The recent picture, keyed on the year an appeal was DECIDED rather than
    # registered. That cut is not censored -- every appeal with a decision date has a
    # known duration -- so it is the only way to say anything about now. It measures
    # how old the appeals being cleared are, NOT how long one filed today will take,
    # and the page says so.
    decided_rows = df[df["days_to_decision"].notna()].copy()
    decided_rows["decided_year"] = pd.to_datetime(decided_rows["decided_ad"]).dt.year

    def window(lo, hi):
        g = decided_rows[
            (decided_rows["decided_year"] >= lo) & (decided_rows["decided_year"] <= hi)
        ]["days_to_decision"]
        return {"from": lo, "to": hi, "appeals": int(g.size), "medianYears": yrs(g.median())}

    latest_year = int(decided_rows["decided_year"].max())
    recent = window(latest_year - 3, latest_year)
    earlier = window(latest_year - 11, latest_year - 7)

    # The spread, not a trend. Cohort medians bounce around (1.9 years for 2009, 6.3
    # for 2017) and drawing them as a line would assert a direction the series does
    # not have. How long the 1,029 decided appeals actually took does not.
    edges = [(0, 2), (2, 4), (4, 6), (6, 8), (8, 99)]
    years = pool / 365.25
    bands = [
        {
            "from": lo,
            "to": hi,
            "cases": int(((years >= lo) & (years < hi)).sum()),
        }
        for lo, hi in edges
    ]

    return {
        "bands": bands,
        "meanYears": mean_years,
        "recent": recent,
        "earlier": earlier,
        "fromYear": int(min(settled_years)),
        "toYear": int(max(settled_years)),
        "cohorts": len(settled_years),
        "decided": int(pool.size),
        "medianYears": yrs(pool.median()),
        "p75Years": yrs(pool.quantile(0.75)),
        "overSixPct": round(float((pool / 365.25 > 6).mean() * 100), 1),
        "slowestYear": int(slowest),
        "slowestYears": yrs(by_year.loc[slowest]),
        "registeredAll": int(len(df)),
        "withoutVerdict": int(df["days_to_decision"].isna().sum()),
    }


def load_appeals():
    """Trial outcome x who appealed x Supreme Court outcome, as counts of CASES.

    An aggregate of a curated trial->appeal mapping that is not itself published: NGM holds trial and
    appeal cases in one table with no foreign key between them, so the pairing had to be built by hand
    and is a v0 dataset. Only the aggregate is shipped, which is enough to reproduce every appeal rate
    quoted in the notebook without republishing provisional per-case pairings.

    `reversed` folds ACQUITTED into REVERSED (both are the lower court's verdict fully overturned);
    `partially_reversed` folds PARTIALLY_UPHELD. `no_outcome_recorded` is NOT "pending" -- Supreme
    disposition enrichment is incomplete, so some decided appeals read blank.
    """
    return pd.read_csv(DATA / "appeals.csv")

def appeal_effect():
    """Everything the appeals section quotes, derived from `dataset/appeals.csv`.

    One implementation so the prose, the funnel and the chart cannot drift apart: the
    notebook's narrative numbers were hardcoded once before and went stale silently.

    ⚠️ A reversal flips the trial outcome, but WHICH WAY depends on who appealed — the
    caption flips on appeal. So every count here is filtered on `appealed_by`, never on
    the verdict alone. Reading `reversed` without that filter inverts the finding on
    roughly a third of the rows.

    Full+partial (the default): a conviction is lost when the convicted person appealed
    and won; one is gained when the commission appealed an acquittal and won, in full or
    in part. Full-only: a partial reversal ALSO costs a full conviction (ठहर -> आंशिक),
    and a commission win on a partial upgrades it to full.
    """
    ap = load_appeals()
    CONV, ACQ = ("ठहर", "आंशिक ठहर"), "सफाई"
    DEF, GOV = "DEFENDANT_PERSON", "CIAA_GOVERNMENT"
    s = lambda df, *c: int(df[list(c)].sum().sum())
    won_by_defendant = ap[ap.trial_outcome.isin(CONV) & (ap.appealed_by == DEF)]
    won_by_commission = ap[(ap.trial_outcome == ACQ) & (ap.appealed_by == GOV)]

    e = {"appeals": int(ap.appeals.sum()),
         "no_outcome": int(ap.no_outcome_recorded.sum()),
         "lost": s(won_by_defendant, "reversed"),
         "gained": s(won_by_commission, "reversed", "partially_reversed"),
         "lost_full": s(ap[(ap.trial_outcome == "ठहर") & (ap.appealed_by == DEF)],
                        "reversed", "partially_reversed"),
         "gained_full": s(ap[(ap.appealed_by == GOV) & (ap.trial_outcome != "ठहर")], "reversed")}
    e["decided"] = e["appeals"] - e["no_outcome"]
    e["net"] = e["gained"] - e["lost"]
    e["net_full"] = e["gained_full"] - e["lost_full"]
    for key, who in (("defendant", DEF), ("commission", GOV)):
        side = ap[ap.appealed_by == who]
        dec = int(side.appeals.sum() - side.no_outcome_recorded.sum())
        e[key] = {"appeals": int(side.appeals.sum()), "decided": dec,
                  "reversed": s(side, "reversed"),
                  "pct": round(s(side, "reversed") / dec * 100, 1) if dec else 0.0,
                  # Full OR partial reversal, so a side can be compared like for like with
                  # `commission_on_acquittals.reversed_incl` below.
                  "reversed_incl": s(side, "reversed", "partially_reversed"),
                  "pct_incl": round(s(side, "reversed", "partially_reversed") / dec * 100, 1) if dec else 0.0}
    # The Commission's appeals AGAINST ACQUITTALS only. `commission` above pools every CIAA
    # appeal, including those against full or partial convictions it thought too light, so its
    # 6 full reversals are not "acquittals overturned". Quote this block whenever the copy says
    # a Commission win turns an acquittal into a conviction.
    acq = won_by_commission
    acq_dec = int(acq.appeals.sum() - acq.no_outcome_recorded.sum())
    e["commission_on_acquittals"] = {
        "appeals": int(acq.appeals.sum()), "decided": acq_dec,
        "reversed": s(acq, "reversed"), "reversed_incl": s(acq, "reversed", "partially_reversed"),
        "pct": round(s(acq, "reversed") / acq_dec * 100, 2) if acq_dec else 0.0,
        "pct_incl": round(s(acq, "reversed", "partially_reversed") / acq_dec * 100, 2) if acq_dec else 0.0,
    }
    return e


# ---------------------------------------------------------------- appeals, per trial (2026-11)
#
# The three files below replace `appeals.csv` as the site's appeal source. They are exported by
# the research lane's `headline/export_site.py` from the appeal table as it stood on 2026-11-03
# (`APPEALS_MASTER.csv`, rewritten 10:42 UTC) and the NGM replica pull of 2026-11-02. They carry
# case numbers, labels, dates and flags only -- no party names.

#: Link grades counted as established (the research lane's `master_rates.py` "firm").
APPEAL_FIRM_GRADES = {"FIRM", "HIGH", "MEDIUM", "CITED", "CONFIRMED", "STRONG"}


def load_supreme_appeals():
    """One row per Supreme Court appeal of a Special Court corruption case: the ORIGIN universe.

    4,430 appeals, selected by where the case came from rather than by the word भ्रष्टाचार in
    the case type (`keyword_universe` marks the 3,177 the keyword would have selected).
    `decided_ad` is NGM's verdict date (pull 2026-11-02); blank means no recorded decision, and
    those rows are kept because they are what censoring is about. `final_outcome` is blank
    unless the appeal has a FINAL outcome (referrals to a larger bench and adjournments are not).
    `trials` lists the linked Special Court trial(s), space-separated.
    """
    return pd.read_csv(DATA / "supreme_appeals.csv", dtype=str, keep_default_na=False)


def load_appeal_trials():
    """One row per (appeal, linked trial), trials registered FY2069/70-2082/83 only.

    `trial_verdict` is the trial's single court-published verdict on the 2026-11-02 pull (blank
    when it has none or more than one). It is NOT the same snapshot as `hearings.csv`
    (2026-10-08), so these trial counts are not a subset of the site's outcome counts.
    `decided` = the appeal has a final outcome (NGM, or the court portal where NGM is blank);
    `full_reversal` = that outcome is REVERSED. Every link grade is kept; rates use the firm ones.
    """
    df = pd.read_csv(DATA / "appeal_trials.csv", dtype=str, keep_default_na=False)
    for c in ("decided", "full_reversal"):
        df[c] = df[c] == "True"
    return df


def load_acquittal_appeal_status():
    """One row per Special Court acquittal (सफाई) in the window: did the government appeal?

    `status` is the strongest evidence found, in order: a linked appeal, the CIAA's own appeal
    register (2022-2026), a reverse search of every Supreme Court -CR- docket, a weak single-name
    match, too recent to judge (verdict under 419 days before the newest Supreme Court
    registration, 2026-09-30), or none found. `ciaa_filed` is False for trials the
    `ciaa-vs-register` comparison lists as not filed by the CIAA (money laundering, other
    agencies, निर्णय बदर petitions).

    ⚠️ "no_appeal_found" is not proof that no appeal exists: NGM may lack dockets, the register
    covers only 2022-2026, and the reverse search misses about 4% of known appeals.
    """
    df = pd.read_csv(DATA / "acquittal_appeal_status.csv", dtype=str, keep_default_na=False)
    df["ciaa_filed"] = df["ciaa_filed"] == "True"
    return df


def appeals_per_trial():
    """H1 and H2: what the Supreme Court does to Special Court verdicts, PER TRIAL.

    Each side is counted only against the verdict it can overturn: convicted individuals against
    convictions (ठहर / आंशिक ठहर), the government against acquittals (सफाई). Government appeals
    against convictions (seeking a heavier sentence or a larger बिगो) are a different event and
    are reported separately. Firm links, final outcomes only.

    Unit: the TRIAL (Special Court docket). A trial counts as decided when at least one of its
    appeals from that side has a final outcome, and as reversed when at least one of those ended
    in a full reversal. One label per docket: a judgment that acquits some appellants and upholds
    the rest counts as "at least one full reversal". The per-appellant figure is included only
    because mass trials dominate it -- quote it with that caveat or not at all.
    """
    lt = load_appeal_trials()
    firm = lt[lt.link_grade.isin(APPEAL_FIRM_GRADES) & (lt.trial_verdict != "")]
    conv = firm.trial_verdict.isin(["ठहर", "आंशिक ठहर"])

    def group(mask):
        g = firm[mask].assign(partial=lambda d: d.decided & (d.outcome == "PARTIALLY_REVERSED"))
        per = g.groupby("trial").agg(decided=("decided", "any"), reversed=("full_reversal", "any"),
                                     partial=("partial", "any"))
        dec = per[per.decided]
        rev = int(dec.reversed.sum())
        return {"trials": int(len(per)), "decided": int(len(dec)), "reversed": rev,
                "partialOnly": int((dec.partial & ~dec.reversed).sum()),
                "pct": round(rev / len(dec) * 100, 1) if len(dec) else 0.0}

    person = firm.appellant_side == "person"
    gov = firm.appellant_side == "government"
    pa = firm[person & conv & firm.decided]

    ap = load_supreme_appeals()
    acq = load_acquittal_appeal_status()
    judge = acq[acq.status != "too_recent"]
    none_ = judge[judge.status == "no_appeal_found"]
    return {
        "convictedVsConviction": group(person & conv),
        "governmentVsAcquittal": group(gov & ~conv),
        "governmentVsConviction": group(gov & conv),
        "perAppellant": {"decided": int(pa.appeal.nunique()),
                         "reversed": int(pa[pa.full_reversal].appeal.nunique())},
        "appealsAll": int(len(ap)),
        "appealsNoFinalOutcome": int((ap.final_outcome == "").sum()),
        "acquittals": {
            "all": int(len(acq)),
            "tooRecent": int((acq.status == "too_recent").sum()),
            "judgeable": int(len(judge)),
            "appealed": int(judge.status.str.startswith("appealed").sum()),
            "weak": int((judge.status == "weak_name_match").sum()),
            "noAppeal": int(len(none_)),
            "noAppealPct": round(len(none_) / len(judge) * 100, 1),
            "ciaaFiledJudgeable": int(judge.ciaa_filed.sum()),
            "ciaaFiledNoAppeal": int(none_.ciaa_filed.sum()),
            "ciaaFiledNoAppealPct": round(float(none_.ciaa_filed.sum() / judge.ciaa_filed.sum() * 100), 1),
        },
    }


# ---------------------------------------------------------------- appeal duration, origin universe
#: Censoring date: the NGM pull the verdict dates come from.
APPEAL_CENSOR_AD = "2026-11-02"
#: The fixed registration window of the research card (8.2): the cohorts that are mostly decided.
#: Fixed rather than derived, because on the origin universe the 85%-settled rule is brittle (two
#: cohorts sit just under it) and swings the pooled median between 3.78 and 4.58 years.
APPEAL_WINDOW = (2008, 2018)
#: One trial's co-defendants filed 87 dockets in 2017, all decided on 2023-06-05.
APPEAL_MASS_TRIAL = "069-CR-0025"


def kaplan_meier(days, decided):
    """Product-limit survival curve of time to decision: [(t, S(t))] at each event time.

    `days[i]` is time to decision if `decided[i]`, else time to the censoring date. Kept in exact
    fractions: in floating point S can land a hair above 0.5 where it is exactly 0.5, which moves
    a median by a whole step (the research lane hit this on the 2013-2017 cohort).
    """
    from fractions import Fraction
    ev = sorted(zip(days, decided))
    n, s, i, out = len(ev), Fraction(1), 0, []
    while i < len(ev):
        t = ev[i][0]
        j = i
        while j < len(ev) and ev[j][0] == t:
            j += 1
        d = sum(1 for x in ev[i:j] if x[1])
        if d:
            s *= Fraction(n - d, n)
            out.append((t, s))
        n -= j - i
        i = j
    return out


def km_quantile(days, decided, p=0.5):
    """Smallest t with S(t) <= p; None if survival never gets there (not yet observable).

    Where S sits exactly on p, the midpoint to the next event time (R survival's convention), so
    a fully decided group's KM median equals its ordinary median.
    """
    curve = kaplan_meier(days, decided)
    for k, (t, s) in enumerate(curve):
        if s <= p:
            if s == p and k + 1 < len(curve):
                return (t + curve[k + 1][0]) / 2
            return float(t)
    return None


def km_survival_at(days, decided, t_max):
    curve = [s for t, s in kaplan_meier(days, decided) if t <= t_max]
    return float(curve[-1]) if curve else 1.0


def supreme_appeal_duration_origin():
    """How long the Supreme Court takes to decide a corruption appeal: research card 8.2.

    Unit: appeal DOCKETS (co-defendants appeal on separate dockets, so one trial can weigh dozens
    of times). Measured from registration at the Supreme Court to NGM's verdict date; undecided
    appeals are censored at the 2026-11-02 pull. Window: registered 2008-2018.

    Two medians, because they answer different questions. The median over DECIDED appeals is a
    floor: an appeal still open is by definition a slow one. The Kaplan-Meier median counts the
    undecided too, assuming an open appeal behaves like decided ones of the same age.

    Supersedes `supreme_appeal_delay` (keyword universe, file pulled 2026-10-13) on the site.
    """
    Y = 365.25
    yrs = lambda d: round(float(d) / Y, 2)
    censor = pd.Timestamp(APPEAL_CENSOR_AD)
    ap = load_supreme_appeals()
    ap["reg"] = pd.to_datetime(ap.registered_ad)
    ap["dec"] = pd.to_datetime(ap.decided_ad.replace("", None))
    ap["is_decided"] = ap.dec.notna() & (ap.dec <= censor)
    ap["days"] = (ap.dec.where(ap.is_decided, censor) - ap.reg).dt.days
    ap["cohort"] = ap.reg.dt.year
    lo, hi = APPEAL_WINDOW
    win = ap[ap.cohort.between(lo, hi)]

    def block(df):
        d = df[df.is_decided].days
        km = km_quantile(df.days.tolist(), df.is_decided.tolist())
        return {"appeals": int(len(df)), "decided": int(len(d)),
                "medianYears": yrs(d.median()),
                "kmMedianYears": yrs(km) if km is not None else None,
                "overSixPct": round(float((d / Y > 6).mean() * 100), 1),
                "kmOpenAtSixPct": round(100 * km_survival_at(df.days.tolist(), df.is_decided.tolist(), 6 * Y), 1)}

    mass = win.trials.str.split().map(lambda ts: APPEAL_MASS_TRIAL in ts)
    pool = win[win.is_decided].days / Y
    bands = [{"from": a, "to": b, "cases": int(((pool >= a) & (pool < b)).sum())}
             for a, b in [(0, 2), (2, 4), (4, 6), (6, 8), (8, 99)]]

    dec = ap[ap.is_decided].copy()
    dec["dy"] = dec.dec.dt.year
    last = int(dec.dy.max())

    def window(a, b):
        g = dec[dec.dy.between(a, b)].days
        return {"from": a, "to": b, "appeals": int(g.size), "medianYears": yrs(g.median())}

    return {
        "fromYear": lo, "toYear": hi, "censorDate": APPEAL_CENSOR_AD,
        **block(win),
        "bands": bands,
        "withoutMassTrial": {"dockets": int(mass.sum()), **block(win[~mass])},
        "keywordOnly": block(win[win.keyword_universe == "True"]),
        "bySide": {s: block(win[win.appellant_side == s]) for s in ("person", "government")},
        "earlier": window(last - 11, last - 7),
        "recent": window(last - 3, last),
        "registeredAll": int(len(ap)),
        "withoutVerdict": int((~ap.is_decided).sum()),
    }


#: The figures the research cards print for the files committed in dataset/ (FINDINGS.md H1/H2,
#: 8.2-DURATION.md, RESEARCH-INVENTORY entries 6b/8/9). The site must show exactly these; any
#: drift is a regression (or a dataset refresh that needs the cards regenerated first) and raises.
_RESEARCH_FIGURES = {
    ("convictedVsConviction", "reversed"): 230, ("convictedVsConviction", "decided"): 567,
    ("convictedVsConviction", "pct"): 40.6,
    ("governmentVsAcquittal", "reversed"): 4, ("governmentVsAcquittal", "decided"): 420,
    ("governmentVsAcquittal", "pct"): 1.0,
    ("governmentVsConviction", "reversed"): 8, ("governmentVsConviction", "decided"): 167,
    ("convictedVsConviction", "partialOnly"): 20, ("governmentVsAcquittal", "partialOnly"): 2,
    ("governmentVsConviction", "partialOnly"): 14,
    ("perAppellant", "reversed"): 418, ("perAppellant", "decided"): 925,
    ("appealsAll",): 4430, ("appealsNoFinalOutcome",): 2022,
    ("acquittals", "noAppeal"): 219, ("acquittals", "judgeable"): 1010, ("acquittals", "noAppealPct"): 21.7,
    ("acquittals", "ciaaFiledNoAppeal"): 211, ("acquittals", "ciaaFiledJudgeable"): 979,
    ("acquittals", "ciaaFiledNoAppealPct"): 21.6, ("acquittals", "tooRecent"): 57,
    ("acquittals", "appealed"): 783, ("acquittals", "weak"): 8,
}
_DURATION_FIGURES = {
    ("appeals",): 1521, ("decided",): 1407, ("medianYears",): 3.77, ("kmMedianYears",): 4.10,
    ("overSixPct",): 28.3, ("kmOpenAtSixPct",): 33.7,
    ("withoutMassTrial", "dockets"): 87, ("withoutMassTrial", "medianYears"): 3.58,
    ("withoutMassTrial", "overSixPct"): 23.6, ("withoutMassTrial", "kmMedianYears"): 3.85,
    ("keywordOnly", "medianYears"): 4.57, ("keywordOnly", "kmMedianYears"): 4.93,
    ("bySide", "person", "medianYears"): 4.23, ("bySide", "person", "kmMedianYears"): 4.66,
    ("bySide", "government", "medianYears"): 2.13, ("bySide", "government", "kmMedianYears"): 2.37,
    ("earlier", "medianYears"): 2.08, ("earlier", "appeals"): 676,
    ("recent", "medianYears"): 5.33, ("recent", "appeals"): 1031,
    ("registeredAll",): 4430, ("withoutVerdict",): 2128,
}


def reconcile_research_figures(per_trial=None, duration=None):
    """Raise if the site's appeal and duration figures differ from the research cards.

    Also self-checks the Kaplan-Meier code: on a group with every appeal decided it must return
    the ordinary median.
    """
    per_trial = per_trial or appeals_per_trial()
    duration = duration or supreme_appeal_duration_origin()
    drift = []
    for figures, source in ((_RESEARCH_FIGURES, per_trial), (_DURATION_FIGURES, duration)):
        for path, want in figures.items():
            got = source
            for k in path:
                got = got[k]
            if got != want:
                drift.append(f"{'.'.join(path)}: card {want}, computed {got}")
    for days in ([5, 1, 3], [4, 1, 3, 2], [7, 7, 2, 9, 9, 1]):
        if km_quantile(days, [True] * len(days)) != float(pd.Series(days).median()):
            drift.append(f"kaplan_meier self-check failed on {days}")
    if drift:
        raise ValueError("appeal figures drifted from the research cards:\n  " + "\n  ".join(drift))


def ad_to_bs(ad):
    "AD 'YYYY-MM-DD' -> BS 'YYYY-MM-DD', via the nepali_datetime calendar library."
    import datetime, nepali_datetime
    y, m, d = map(int, ad.split("-"))
    b = nepali_datetime.date.from_datetime_date(datetime.date(y, m, d))
    return f"{b.year:04d}-{b.month:02d}-{b.day:02d}"

def bs_to_ad(bs):
    "BS 'YYYY-MM-DD' -> datetime.date (AD), via the nepali_datetime calendar library."
    import nepali_datetime
    y, m, d = map(int, bs.split("-"))
    return nepali_datetime.date(y, m, d).to_datetime_date()

def load_leadership():
    "Reference context: heads of government + CIAA chief commissioners. AD is the source; BS is derived."
    df = pd.read_csv(DATA / "leadership.csv", dtype=str, keep_default_na=False)
    df["start_bs"] = df.start_ad.map(ad_to_bs)
    df["end_bs"] = df.end_ad.map(ad_to_bs)
    return df

# ---------------------------------------------------------------- helpers
def _family(ct):
    "Offense family from free-text case_type. Order = first match wins."
    ct = ct or ""
    if "रिसवत" in ct: return "1_bribery"
    if "नक्कली प्रमाण" in ct: return "2_fake_credential"
    if "हिनामिना" in ct or "हिनामीना" in ct: return "3_embezzlement"
    if "हानीनोक्सानी" in ct: return "4_loss_to_govt"
    if "गैरकानूनी सम्पत्ति" in ct or "गैरकानुनी सम्पत्ति" in ct: return "5_illicit_enrichment"
    if "गैरकानुनी लाभ" in ct: return "6_illegal_benefit"
    if "सम्पत्ति शुद्धीकरण" in ct: return "7_money_laundering"
    if "अनियमित" in ct: return "8_irregularity"
    if "राजश्" in ct: return "9_revenue"
    if "झुठ्ठा विवरण" in ct or "गलत प्रतिवेदन" in ct: return "10_false_statement"
    if "गलत लिखत" in ct: return "11_forged_document"
    if "सरकारी जग्गा" in ct or "जग्गाधनि" in ct: return "12_govt_land"
    if "परिक्षाको परिणाम" in ct or "प्रश्‍नपत्र" in ct or "प्रश्नपत्र" in ct: return "13_exam_rigging"
    if "निवेदन" in ct: return "90_procedural_petition"
    return "99_other"

def _fam6(ct):
    "Six-way charge grouping for the by-year mix (petitions + money-laundering pre-excluded upstream)."
    ct = ct or ""
    if "रिसवत" in ct: return "bribery"
    if "नक्कली प्रमाण" in ct: return "fake"
    if "हिनामिना" in ct or "हिनामीना" in ct: return "embezzlement"
    if "गैरकानुनी लाभ" in ct: return "benefit"
    if "हानीनोक्सानी" in ct: return "loss"
    return "other"

def _filing_fy(reg):
    "registration_date_bs 'YYYY-MM-DD' -> fiscal-year label 'YYYY/YY' (Shrawan=04 starts the FY)."
    y, m = int(reg[:4]), reg[5:7]
    s = y if m >= "04" else y - 1
    return f"{s}/{(s + 1) % 100:02d}"

def _verdict_ym(case_status):
    "Verdict (year, month) ints from 'फैसला (मिती: YYYY/MM/DD)' Devanagari digits; else (None, None)."
    m = re.search(r"मिती: ([०-९]{4})/([०-९]{2})", case_status or "")
    return (int(m.group(1).translate(DEV)), int(m.group(2).translate(DEV))) if m else (None, None)

def vfy(y, m):
    "Fiscal-year label from a verdict (year, month) pair; None if missing/NaN/non-numeric."
    try:
        y, m = int(y), int(m)
    except (TypeError, ValueError):
        return None
    s = y if m >= 4 else y - 1
    return f"{s}/{(s + 1) % 100:02d}"

# ---------------------------------------------------------------- transforms
def _transform(cases, hearings, entities, assumptions):
    """Derive every result table from the corpus source tables (all pandas)."""
    corpus = cases.copy()
    corpus["family"] = corpus.case_type.map(_family)
    corpus["filing_fy"] = corpus.registration_date_bs.map(_filing_fy)
    corpus["is_decided"] = corpus.case_status.fillna("").str.startswith("फैसला")
    vym = list(corpus.case_status.map(_verdict_ym))
    corpus["vyear"] = [t[0] for t in vym]
    corpus["vmonth"] = [t[1] for t in vym]
    corpus["verdict_fy"] = [vfy(t[0], t[1]) for t in vym]
    hc = hearings.merge(corpus[["case_number", "case_type", "family", "verdict_fy"]], on="case_number", how="inner")

    # Split court-published verdicts from model-derived ones and keep ONLY the
    # former in `hc`, which every chart below is built from. A derived verdict is
    # a defensible record — it is read from the court's own judgment and carries
    # the quoted clause — but it is not the court's coding, so it must not enter a
    # published rate silently. `verdict_derived` is absent from datasets pulled
    # before the column existed; treat that as "all court-sourced", which it was.
    if "verdict_derived" in hc.columns:
        _derived_mask = hc.verdict_derived.astype(str).str.lower().isin(("true", "t", "1"))
    else:
        _derived_mask = pd.Series(False, index=hc.index)
    hc_derived = hc[_derived_mask].copy()
    hc = hc[~_derived_mask].copy()

    # Case-grain dispositions. The court records ONE verdict per docket, so the three buckets are a
    # mutually-exclusive partition of decided cases (no per-defendant outcome exists in the data — a
    # mixed bench where some accused are convicted and others acquitted is coded आंशिक ठहर). These are
    # CASE counts, never defendant counts.
    dispo = hc.groupby("decision_type").case_number.nunique().to_dict()
    cv_all, pt_all, aq_all = dispo.get("ठहर", 0), dispo.get("आंशिक ठहर", 0), dispo.get("सफाई", 0)
    clean = cv_all + pt_all + aq_all
    # "Convicted" = ठहर + आंशिक ठहर is the DEFAULT (and the CIAA's own definition, so our rate is
    # comparable to its published "success rate"). full_rate is the conservative variant, reported
    # alongside everywhere and never on its own.
    incl_rate = (cv_all + pt_all) / clean if clean else 0.0  # headline: convicted
    full_rate = cv_all / clean if clean else 0.0             # secondary: ठहर only

    f = {}

    mix = corpus.family.value_counts().to_dict()
    f["offense_mix"] = pd.DataFrame(
        sorted(([*FAM[k], mix.get(k, 0)] for k in FAM if k not in DROP_FAM), key=lambda r: -r[2]),
        columns=["offense_en", "offense_ne", "count"])

    disp_by_fam = hc.groupby(["family", "decision_type"])["case_number"].nunique().unstack(fill_value=0)
    oc = []
    for k in FAM:
        if k in DROP_FAM:
            continue
        row = disp_by_fam.loc[k] if k in disp_by_fam.index else {}
        cv, aq, pt = int(row.get("ठहर", 0)), int(row.get("सफाई", 0)), int(row.get("आंशिक ठहर", 0))
        tot = cv + aq + pt
        oc.append(([*FAM[k], cv, pt, aq], cv / tot if tot else 0))
    f["outcome_by_charge"] = pd.DataFrame([r for r, _ in sorted(oc, key=lambda x: -x[1])],
        columns=["charge_en", "charge_ne", "convicted", "partial", "acquitted"])

    # ------------------------------------------------------------ defendant grain
    #
    # Every rate above counts CASES. A case is not a person: the register carries one
    # verdict per docket but anywhere from one to 249 accused under it. Counting the
    # accused as well as the dockets is what makes the case-grain rates interpretable,
    # because the two grains do not move together -- the charges that convict most
    # reliably are also the ones tried one defendant at a time.
    #
    # These are defendant ROWS (positions on a charge sheet), not resolved people. Only
    # ~5% of entity rows carry an `nes_id`, so the same individual charged in two cases
    # counts twice and cannot be deduplicated without guessing from names, which collide
    # heavily in Nepali. A row is one accusation, which is the honest unit here.
    INSTITUTIONAL = {"नेपाल सरकार", "अ.दु.अ.आ."}  # the prosecutor, mis-filed on the defence side
    acc = entities[(entities.side == "defendant") & (~entities.name.isin(INSTITUTIONAL))]
    per_case = acc.groupby("case_number").size().rename("accused")

    # Inner join on `hc`, so the defendant grain inherits the same exclusions as every
    # case-grain rate: court-published verdicts only, model-derived ones left out.
    verdict_of = hc.drop_duplicates("case_number").set_index("case_number").decision_type
    dgrain = pd.concat([per_case, verdict_of.rename("verdict")], axis=1, join="inner")
    dgrain = dgrain.join(corpus.set_index("case_number").family)

    by_verdict = dgrain.groupby("verdict").agg(cases=("accused", "size"), accused=("accused", "sum"))
    f["defendants_by_verdict"] = (
        by_verdict.reindex(list(DECISIONS)).fillna(0).astype(int)
        .rename_axis("verdict").reset_index())

    # Accused per case by charge family -- the mechanism behind the charge-rate spread
    # already on the Prosecution page: fake-credential cases are one-defendant documentary
    # cases, illegal-benefit cases are large multi-accused ones.
    dfam = dgrain.groupby("family").agg(cases=("accused", "size"), accused=("accused", "sum"))
    f["defendants_by_charge"] = pd.DataFrame(
        [[*FAM[k], int(dfam.loc[k, "cases"]), int(dfam.loc[k, "accused"])]
         for k in FAM if k not in DROP_FAM and k in dfam.index],
        columns=["charge_en", "charge_ne", "cases", "accused"])

    f["defendant_summary"] = pd.DataFrame([{
        "accused_rows": int(len(acc)),
        "distinct_names": int(acc.name.nunique()),
        "largest_case": int(per_case.max()),
        "single_accused_cases_pct": round(100 * (per_case == 1).mean(), 1),
        "accused_in_decided": int(dgrain.accused.sum()),
        "decided_cases": int(len(dgrain)),
    }])

    fams = ["bribery", "fake", "embezzlement", "benefit", "loss", "other"]
    ct = corpus.case_type.fillna("")
    cm = corpus[~ct.str.contains("निवेदन") & ~ct.str.contains("सम्पत्ति शुद्धीकरण")].copy()
    cm["fam6"] = cm.case_type.map(_fam6)
    byyr = {}
    for (fyv, fam), n in cm.groupby(["filing_fy", "fam6"]).size().items():
        byyr.setdefault(fyv, {x: 0 for x in fams})[fam] = int(n)
    f["charge_mix_by_year"] = pd.DataFrame(
        [[fyv, *[byyr[fyv][x] for x in fams]] for fyv in sorted(byyr)], columns=["fiscal_year", *fams])

    cell = corpus.groupby([corpus.registration_date_bs.str[:4], corpus.registration_date_bs.str[5:7]]).size().to_dict()
    fy = list(range(2069, 2083))
    mrows = []
    for mi in range(1, 13):
        mm = f"{mi:02d}"
        years = [str(y + 1) for y in fy] if mi <= 3 else [str(y) for y in fy]
        vals = [cell.get((y, mm), 0) for y in years]
        mrows.append([mi, MONTHS[mi - 1], round(statistics.mean(vals), 1), round(statistics.stdev(vals), 1)])
    f["filed_by_month"] = pd.DataFrame(mrows, columns=["month_index", "month_name", "mean", "sd"])

    filed = corpus.groupby("filing_fy").size().to_dict()
    decided = corpus[corpus.is_decided & corpus.verdict_fy.notna()].groupby("verdict_fy").size().to_dict()
    yrs = sorted(y for y in set(filed) | set(decided) if "/" in str(y))
    f["filed_vs_decided_by_year"] = pd.DataFrame(
        [[y, filed.get(y, 0), decided.get(y, 0)] for y in yrs], columns=["fiscal_year", "filed", "decided"])

    hcd = hc[hc.verdict_fy.notna()].copy()
    hcd["is_fake"] = hcd.case_type.fillna("").str.contains("नक्कली प्रमाण")
    vd = {}
    for fyv, grp in hcd.groupby("verdict_fy"):
        vd[fyv] = [grp[grp.decision_type == "ठहर"].case_number.nunique(),
                   grp[grp.decision_type == "आंशिक ठहर"].case_number.nunique(),
                   grp[grp.decision_type == "सफाई"].case_number.nunique(),
                   grp[grp.is_fake & (grp.decision_type == "ठहर")].case_number.nunique(),
                   grp[grp.is_fake].case_number.nunique()]
    f["verdict_by_year"] = pd.DataFrame([[k, *vd[k]] for k in sorted(vd)],
        columns=["fiscal_year", "convicted", "partial", "acquitted", "fake_convicted", "fake_disposed"])

    coh = corpus[corpus.registration_date_bs.str.match(r"^\d{4}-\d{2}-")].copy()
    coh["reg_m"] = coh.registration_date_bs.str[:4].astype(int) * 12 + coh.registration_date_bs.str[5:7].astype(int)
    crows = []
    for fyv, grp in coh.groupby("filing_fy"):
        dec = grp[grp.is_decided & grp.vyear.notna()]
        months = [(int(y) * 12 + int(m)) - rm for y, m, rm in zip(dec.vyear, dec.vmonth, dec.reg_m)]
        med = round(statistics.median(months), 1) if months else 0.0
        pend = grp.case_status.notna() & (grp.case_status.astype(str).str.strip() != "") & ~grp.is_decided
        crows.append([fyv, int(grp.is_decided.sum()), int(pend.sum()), med])
    f["cohorts"] = pd.DataFrame(sorted(r for r in crows if r[0] and "/" in str(r[0])),
        columns=["fiscal_year", "decided", "pending", "median_months"])

    # How long a DECIDED case took, filing to verdict, across the whole corpus.
    #
    # Decided cases only, and that is a real limitation rather than a tidy-up: a case
    # still open has no duration yet, so the slowest matters are precisely the ones
    # missing from this distribution. It therefore describes cases that finished, NOT
    # how long a case filed today should be expected to take, and the pending count is
    # carried alongside so the exclusion stays visible.
    all_months = []
    for y, m, rm in zip(coh[coh.is_decided & coh.vyear.notna()].vyear,
                        coh[coh.is_decided & coh.vyear.notna()].vmonth,
                        coh[coh.is_decided & coh.vyear.notna()].reg_m):
        d = (int(y) * 12 + int(m)) - rm
        if d >= 0:                      # a verdict dated before filing is a bad row, not a fast case
            all_months.append(d)
    pend_total = int((coh.case_status.notna()
                      & (coh.case_status.astype(str).str.strip() != "")
                      & ~coh.is_decided).sum())
    buckets = [("within 1 year", lambda d: d <= 12),
               ("1 to 2 years", lambda d: 12 < d <= 24),
               ("2 to 3 years", lambda d: 24 < d <= 36),
               ("over 3 years", lambda d: d > 36)]
    f["duration"] = pd.DataFrame(
        [[label, sum(1 for d in all_months if test(d))] for label, test in buckets],
        columns=["band", "cases"])
    f["duration_summary"] = pd.DataFrame([[
        len(all_months),
        round(statistics.median(all_months), 1) if all_months else 0.0,
        pend_total,
    ]], columns=["measured", "median_months", "pending"])

    hcj = hc[hc.judge_names.fillna("").str.len() > 0]
    pb = hcj.groupby(["judge_names", "decision_type"])["case_number"].nunique().unstack(fill_value=0)
    # Honorifics must come off as whole TOKENS, never as substrings. The court writes each bench member
    # as "<role> माननीय न्यायाधीश [डा. ]श्री <name>", so "श्री " is a reliable start-of-name marker —
    # and that trailing whitespace is load-bearing. A bare "श्री" replace also matches inside a name
    # that begins with it, which is how श्रीकान्त पौडेल came to be published as "कान्त पौडेल".
    #
    # Split on EVERY marker, not just the last one. Most benches are already split into one fragment
    # per member by the अध्यक्ष/सदस्य roles, but some carry the whole panel with no role delimiter at
    # all — and for those, keeping only the text after the final marker silently keeps the last judge
    # and drops the rest. Those panels are currently confined to the model-derived rows that
    # `verdict_derived` filters out above (0 of 2,728 court-published rows, 9 of 69 derived), so this
    # is about not leaving a trap armed for whenever that changes: a wrong name is visible, a quietly
    # missing judge is not.
    #
    # TITLE is the fallback for a fragment carrying no श्री marker. Every alternative is anchored —
    # dotted forms keep their dot, bare श्री needs following whitespace — so none can bite into a
    # name; an unanchored "डा" would turn पुडासैनी into "पु सैनी", the same defect mirrored.
    TITLE = re.compile(r"माननीय|न्यायाधीश|प्र\.क्षे\.न्या\.|डा\.|मा\.|श्री(?=\s)|श्री$")
    TRAILING_TITLE = re.compile(r"(?:माननीय|न्यायाधीश|प्र\.क्षे\.न्या\.|डा\.|मा\.|\s)+$")
    jt = {}
    for bench, row in pb.iterrows():
        # convicted = ठहर + आंशिक ठहर, matching the headline definition; a per-justice rate on a
        # different definition from the court average it is plotted against would be unreadable.
        cv = int(row.get("ठहर", 0)) + int(row.get("आंशिक ठहर", 0))
        tot = cv + int(row.get("सफाई", 0))
        for frag in re.split(r"अध्यक्ष|सदस्य|\n", str(bench)):
            parts = re.split(r"श्री\s+", frag)
            # parts[0] is whatever preceded the first marker (the honorific run, or the entire
            # fragment when no marker is present) — a name only ever follows a marker.
            names = [TRAILING_TITLE.sub("", p) for p in parts[1:]] if len(parts) > 1 else [TITLE.sub(" ", frag)]
            for nm in names:
                nm = re.sub(r"\s+", " ", nm).strip(" .\t")
                if len(nm) < 4:
                    continue
                d = jt.setdefault(nm, [0, 0]); d[0] += tot; d[1] += cv
    f["justices"] = pd.DataFrame(
        sorted(([nm, d[0], round(d[1] / d[0] * 100, 1)] for nm, d in jt.items() if d[0] >= 30), key=lambda r: -r[2]),
        columns=["justice", "decisions", "conviction_pct"])

    # Accountability funnel. Top three stages are CIAA annual-report actuals (assumptions table); the
    # conviction bar is DERIVED — our corpus conviction rate applied to the CIAA filed count — so
    # nothing here is hand-entered. Bottom bar is convicted (ठहर + आंशिक ठहर); the full-only variant
    # is a scalar (below) for annotation. All four stages are counts of CASES / prosecutions, not people.
    a = dict(zip(assumptions.key, assumptions.value))
    filed_n = int(a["funnel_filed"])
    f["funnel"] = pd.DataFrame(
        [["complaints", int(a["funnel_complaints"])], ["investigated", int(a["funnel_investigated"])],
         ["filed", filed_n], ["convicted", round(filed_n * incl_rate)]],
        columns=["stage_key", "count"])

    # Headline scalars.
    corpus_all = len(corpus)
    substantive = int((~corpus.family.isin(NON_SUBSTANTIVE)).sum())
    has_status = corpus.case_status.notna() & (corpus.case_status.astype(str).str.strip() != "")
    e = entities.copy()
    e["resolved"] = e.nes_id.fillna("").astype(str).str.strip() != ""
    e["resolved_name"] = e.name.where(e.resolved)
    # `resolved` counts RECORDS carrying an nes_id; `resolved_names` counts the distinct names among
    # them. Quote the records figure against records and the names figure against names -- dividing
    # resolved records by distinct names mixes the two units.
    eg = e.groupby("side").agg(rows=("name", "size"), distinct=("name", "nunique"), resolved=("resolved", "sum"),
                               resolved_names=("resolved_name", "nunique"))
    drow = eg.sort_values("rows", ascending=False).iloc[0] if len(eg) else {
        "rows": 0, "distinct": 0, "resolved": 0, "resolved_names": 0}
    ct_rows = [
        ["corpus_in_window", corpus_all], ["substantive", substantive],
        ["money_laundering", int(mix.get("7_money_laundering", 0))],
        ["other_bucket", int(mix.get("99_other", 0))],
        ["avg_filed_per_year", round(corpus_all / N_FY, 1)],
        ["outcome_convicted", cv_all], ["outcome_partial", pt_all], ["outcome_acquitted", aq_all],
        ["outcome_convicted_incl_partial", cv_all + pt_all],
        # The unqualified name carries the DEFAULT definition (ठहर + आंशिक ठहर); the full-only
        # variant is explicitly suffixed. Named the other way round until 2026-10, when the default
        # changed — a consumer reading `funnel_convicted` then silently got the conservative figure.
        ["conviction_rate_pct", round(incl_rate * 100, 1)],
        ["conviction_rate_full_only_pct", round(full_rate * 100, 1)],
        ["funnel_convicted", round(filed_n * incl_rate)],
        ["funnel_convicted_full_only", round(filed_n * full_rate)],
        ["outcome_decided", int(corpus.is_decided.sum())],
        ["outcome_ongoing", int((has_status & ~corpus.is_decided).sum())],
        # Verdicts read out of the court's judgment by a model rather than coded
        # by the court. EXCLUDED from every rate above; surfaced so the exclusion
        # is visible and quantified instead of being a silent filter.
        ["verdicts_model_derived_excluded", int(hc_derived.case_number.nunique())],
        # Cases the register marks फैसला but for which it publishes no disposition at
        # all -- not even one a model could read. They carry no hearing row, so they
        # are invisible to every rate here and, unlike the model-derived ones above,
        # there is nothing to exclude: the outcome simply is not recorded anywhere.
        ["verdicts_no_disposition", int(
            len(set(corpus[corpus.is_decided].case_number) - set(hc.case_number) - set(hc_derived.case_number)))],
        ["corpus_defendant_rows", int(drow["rows"])],
        ["corpus_distinct_defendants", int(drow["distinct"])],
        ["corpus_defendants_resolved", int(drow["resolved"])],
        ["corpus_defendants_resolved_names", int(drow["resolved_names"])],
    ]
    # object dtype so integer counts stay ints (avoid "2,880.0") next to the one float (avg/year)
    f["corpus_totals"] = pd.DataFrame({"metric": [r[0] for r in ct_rows],
                                       "value": pd.array([r[1] for r in ct_rows], dtype=object)})
    return f

# ---------------------------------------------------------------- public API
def build_frames(refresh=False, strict=None):
    """Return {table: DataFrame} for every result table + `assumptions`, plus _elapsed / _source.

    `strict` defaults to `refresh`: an explicit refresh that fails RAISES (a "rebuild" that
    quietly kept the old snapshot is worse than an error), while an ordinary read still falls
    back to the committed dataset and records the reason in `_source`.
    """
    if strict is None:
        strict = refresh
    try:
        t0 = time.time()
        ds = load_dataset(refresh=refresh)
        assumptions = load_assumptions()
        frames = _transform(ds["cases"], ds["hearings"], ds["entities"], assumptions)
        frames["assumptions"] = assumptions
        frames["_elapsed"] = time.time() - t0
        frames["_source"] = "dataset" if not refresh else "api paginate (refresh)"
    except Exception as e:  # last resort: the committed source tables
        if strict:
            raise
        ds = load_dataset(refresh=False)
        assumptions = load_assumptions()
        frames = _transform(ds["cases"], ds["hearings"], ds["entities"], assumptions)
        frames["assumptions"] = assumptions
        frames["_elapsed"] = 0.0
        frames["_source"] = f"dataset (after {type(e).__name__}: {e})"
    frames["leadership"] = load_leadership()
    return frames
