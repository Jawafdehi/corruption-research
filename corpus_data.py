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
    full_rate = cv_all / clean if clean else 0.0             # "convicted" = ठहर only (headline)
    incl_rate = (cv_all + pt_all) / clean if clean else 0.0  # + आंशिक ठहर (partial counted as a win)

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
        cv = int(row.get("ठहर", 0)); tot = cv + int(row.get("सफाई", 0)) + int(row.get("आंशिक ठहर", 0))
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
    # conviction floor is DERIVED — our corpus full-conviction rate applied to the CIAA filed count —
    # so nothing here is hand-entered. Bottom bar is full (ठहर) only; the incl.-partial variant is a
    # scalar (below) for annotation. All four stages are counts of CASES / prosecutions, not people.
    a = dict(zip(assumptions.key, assumptions.value))
    filed_n = int(a["funnel_filed"])
    f["funnel"] = pd.DataFrame(
        [["complaints", int(a["funnel_complaints"])], ["investigated", int(a["funnel_investigated"])],
         ["filed", filed_n], ["convicted", round(filed_n * full_rate)]],
        columns=["stage_key", "count"])

    # Headline scalars.
    corpus_all = len(corpus)
    substantive = int((~corpus.family.isin(NON_SUBSTANTIVE)).sum())
    has_status = corpus.case_status.notna() & (corpus.case_status.astype(str).str.strip() != "")
    e = entities.copy()
    e["resolved"] = e.nes_id.fillna("").astype(str).str.strip() != ""
    eg = e.groupby("side").agg(rows=("name", "size"), distinct=("name", "nunique"), resolved=("resolved", "sum"))
    drow = eg.sort_values("rows", ascending=False).iloc[0] if len(eg) else {"rows": 0, "distinct": 0, "resolved": 0}
    ct_rows = [
        ["corpus_in_window", corpus_all], ["substantive", substantive],
        ["money_laundering", int(mix.get("7_money_laundering", 0))],
        ["other_bucket", int(mix.get("99_other", 0))],
        ["avg_filed_per_year", round(corpus_all / N_FY, 1)],
        ["outcome_convicted", cv_all], ["outcome_partial", pt_all], ["outcome_acquitted", aq_all],
        ["outcome_convicted_incl_partial", cv_all + pt_all],
        ["full_conviction_rate_pct", round(full_rate * 100, 1)],
        ["conviction_incl_partial_pct", round(incl_rate * 100, 1)],
        ["funnel_convicted", round(filed_n * full_rate)],
        ["funnel_convicted_incl_partial", round(filed_n * incl_rate)],
        ["outcome_decided", int(corpus.is_decided.sum())],
        ["outcome_ongoing", int((has_status & ~corpus.is_decided).sum())],
        # Verdicts read out of the court's judgment by a model rather than coded
        # by the court. EXCLUDED from every rate above; surfaced so the exclusion
        # is visible and quantified instead of being a silent filter.
        ["verdicts_model_derived_excluded", int(hc_derived.case_number.nunique())],
        ["corpus_defendant_rows", int(drow["rows"])],
        ["corpus_distinct_defendants", int(drow["distinct"])],
        ["corpus_defendants_resolved", int(drow["resolved"])],
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
