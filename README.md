# Corruption-research notebook — data pack

A Jupyter notebook that is the **deep, section-by-section companion** to **jawafdehi.org/research/corruption-accountability**.
The published page is the lite read (8 sections, 11 charts); `corruption_analysis.ipynb` mirrors all of it and goes further — **~18 interactive Plotly charts** (incl. a combined government/CIAA leadership reference timeline), Nepali-first labels with Devanagari numerals, each section with the numbers spelled out and its caveats attached.
Snapshot: **BS 2083 / 2026-07**. Court: विशेष अदालत (Special Court).

## Run it in one click — Google Colab

**Caseworkers:** open the notebook in Google Colab, then **Runtime → Run all**. It fetches the frozen dataset from this repo, renders every chart, and needs **no install and no credentials**.

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Jawafdehi/corruption-research/blob/main/corruption_analysis.ipynb)

The notebook's first cell bootstraps the environment (installs a couple of packages, fetches `corpus_data.py` + `dataset/`); every cell after it runs against the committed snapshot. Nothing to set up.

The whole thing is built to be **auditable end to end**: one folder of source-of-truth data + a table of external assumptions, and every result is *derived* from those in the notebook — nothing is hand-entered downstream.

```
source data (dataset/*.csv)  +  assumptions (dataset/assumptions.csv)  ──▶  results (derived live in the notebook)
```

## `dataset/` — the single source of truth

Everything the analysis rests on lives in one folder. The three court tables are the **corpus** (already scoped — every row is in-scope, no filtering hidden elsewhere); `assumptions.csv` holds the external constants. There is **no separate raw cache** — these committed files *are* the cache: a normal run reads them instantly with no API call, and only an explicit refresh re-pulls and rewrites them.

```
dataset/
  cases.csv        2,949 rows — the corpus: Special Court `-CR-` cases filed FY2069/70–2082/83
  hearings.csv     2,797 rows — deciding hearings (ठहर/आंशिक ठहर/सफाई) for those cases only, + a `verdict_derived` provenance flag (2,728 court-published + 69 model-derived)
  entities.csv    12,547 rows — parties (defendants/plaintiffs) for those cases only
  assumptions.csv  8 rows    — external CIAA constants (funnel + 5-yr figures) with a source_url each
  leadership.csv   15 rows   — reference: heads of government + CIAA chief commissioners; tenures in AD (BS derived via nepali-datetime)
```

Every file is `-CR-`-only and in-window — no OA petitions, no old `93-<yr>` scheme, nothing out of scope.

## The corpus

```
court_identifier = 'special'
AND case_number LIKE '%-CR-%'                  -- the Special Court criminal register (= the definition)
AND registration_date_bs >= '2069-04-01'       -- Shrawan 1, 2069 = start of FY2069/70
AND registration_date_bs <  '2083-04-01'       -- through end of Ashadh 2083; Shrawan 2083 = new FY, excluded
```

**Why this shape.** The Special Court switched case-number schemes exactly at the FY2069/70 rollover: the old `93-<yr>-<seq>` format ends 2069-03-31 (Ashadh) and the new `<yr>-CR-<seq>` **criminal register** starts 2069-04-03 (Shrawan). So the fiscal window and the `-CR-` register share one boundary — 14 clean fiscal years of one register = **2,949 cases**. No plaintiff filter: the register *is* the definition. (A handful, ~34, are individual-plaintiff `निर्णय वदर` review/contempt petitions that live in `-CR-`; they land in the `other` case-type bucket, so they don't touch the substantive analysis.)

**2,949 vs 2,795.** `corpus_in_window` = 2,949 (all `-CR-` prosecutions). **"Substantive" = 2,795** = the corpus minus **money-laundering (93)** (a different statute, merely tried here) and a small **unclassifiable `other` (61)**, so `2,795 + 93 + 61 = 2,949`. The substantive cut is what the offense-mix / conviction-by-charge / charge-mix charts use; the full 2,949 drives the filed/decided/backlog counts (avg. **~211 cases filed per year**).

**Fiscal-year axis.** By-year charts group by **fiscal year** (`2069/70` … `2082/83`, 14 complete bars). Filing-based series (charge mix, filed, cohorts, backlog) key on the filing FY; verdict-based series (outcome trend, fake/core split) key on the verdict FY — so a case can appear in different bars across charts because they count different **events**. `filed` across the 14 FYs sums to exactly 2,949. Seasonality stays month-grained (each Nepali month gets 14 occurrences).

## Verdict categories & grain (read this before quoting any conviction number)

The court records **one verdict per case** (per docket), coded as one of three dispositions — a mutually-exclusive partition of decided cases. **Every outcome number is a count of cases, not people:**

- **दोषी ठहर** (ṭhahar) — **full conviction**: the charge is upheld.
- **आंशिक ठहर** (āṃśik ṭhahar) — **partial conviction**: upheld *in part*. **This is where a mixed bench lands** — some accused convicted and others acquitted, or conviction on some counts / a reduced amount. There is **no per-defendant verdict** in the data, so we never split a case's defendants into convicted vs. acquitted.
- **सफाई** (saphāī) — **acquittal**: the accused are cleared / case dismissed.

**"Convicted" = full (ठहर) only** is the headline everywhere (a conservative bar); the **incl.-partial** rate is shown alongside. Court-wide that is **45.1% full · 61.3% incl. partial** (1,230 / 442 / 1,056 full / partial / acquittal across the 2,728 cases carrying a clean disposition — a different set from the 2,740 marked decided, not a subset of it: 2,628 are in both, 112 are marked decided but carry no hearing with a `decision_type` (mostly cases from the mirror's latest backfill), and 100 carry a disposition without a फैसला `case_status`). The CIAA's own reported "success rate" (52.67%, an assumption) counts full + partial together. The `entities` table's `nes_id` flag means *matched to the registry* (entity resolution), **not** convicted — don't read it as an outcome.

### Where a verdict comes from — `verdict_derived`

A disposition normally reaches the mirror because the court published it on a daily cause list. Cases that entered the mirror by another route — chiefly the 2026-07 register backfill, which recovered dockets the court had issued but never listed publicly — can be marked decided in `case_status` while carrying **no hearing with a `decision_type` at all**. That is the 112 above, and it is why they count as decided but appear in no outcome chart.

For most of them the court publishes the **full judgment** (faisala), which states the disposition. Those can be recovered by reading it — **69 of the 112 now have been**, leaving 43 still dispositionless in the mirror. Those 43 are not a queue that will drain: the recovery pass has now been run twice over them and each time declined to answer, mostly on very long multi-defendant judgments where the operative clause could not be pinned to a single disposition. A gap is the intended output there. That recovery is a defensible record — it comes from the court's own document and stores the quoted operative clause — but it is **not the court's own coding**, so every such row is flagged:

| `verdict_derived` | meaning |
|---|---|
| `False` | the court published this disposition; scraped from a cause list |
| `True` | read out of the court's judgment by a model (`extract_verdicts`), with the model, the source document and the quoted clause recorded alongside |

**Every rate in this pack is court-sourced only.** `_transform` drops `verdict_derived` rows before computing anything and reports how many it dropped as `verdicts_model_derived_excluded` in `corpus_totals`, so the exclusion is a visible number rather than a silent filter. **69 rows are currently excluded** — what `extract_verdicts` has recovered so far (37 ठहर / 26 सफाई / 6 आंशिक ठहर), which is why the headline has not moved across two recovery passes while the dataset grew.

Datasets pulled before this column existed are treated as all-court-sourced, which they were. That fallback is deliberately generous, so a *refresh* is not allowed to rely on it: `load_dataset` checks the pulled columns against `REQUIRED` and refuses to overwrite the snapshot if `verdict_derived` is absent. It exists because that is precisely how the flag failed once — `_paginate` named columns by splitting the SELECT list on commas, which turned the computed `… AS verdict_derived` into a header of its own raw SQL, the fallback then declared every row court-sourced, and the derived verdicts flowed straight into the published rate (45.3% instead of 45.1%). Nothing raised. A silent one-line drift in a provenance guard is worth a loud check.

## How the data is pulled

The court tables come from Jawafdehi's internal read-only query API — a guarded, `SELECT`-only proxy over the court tables (`court_cases`, `court_case_hearings`, `court_case_entities`), no comments/DML, that **row-caps every result at 500**. You can't `SELECT *` a big table in one shot, so we paginate with flat, guard-legal selects (`LIMIT`/`OFFSET`; the mirror is frozen, so `OFFSET` paging is stable):

- `court_cases` — `WHERE court_identifier='special' AND case_number LIKE '%-CR-%'` → `case_number, case_type, plaintiff, registration_date_bs, case_status`
- `court_case_hearings` — same `+ AND decision_type IN (ठहर, आंशिक ठहर, सफाई)` → `case_number, decision_type, judge_names, (extra_data->'verdict_extraction' IS NOT NULL) AS verdict_derived`
- `court_case_entities` — same `-CR-` filter → `case_number, side, name, nes_id`

`corpus_data.load_dataset()` paginates these into memory, applies the fiscal window, and writes `dataset/{cases,hearings,entities}.csv` (which then serve as the cache — no separate raw copy is kept). `corpus_data._transform()` then derives every result table in pandas — case-grain outcomes use `count(distinct case_number)`, so any duplicate hearing row can never bias a metric.

### Signing in — only to refresh, never to read

**Auth is optional.** The dataset is committed, so reading it — everything the notebook does — needs **no credentials, no environment variables, no setup**. There is nothing to configure and nothing to ask anyone for.

You only sign in to move the snapshot forward, and then it's a browser approval rather than a secret:

```bash
python gen_dataset.py
```

```
  Go to:  https://auth.jawafdehi.org/device
  Code :  LRQT-LRBH
```

Approve it on any device — your phone is fine, it needn't be the machine running the command — and the pull starts. Codes expire after 5 minutes. Nothing is written to disk, and there is no shared secret to distribute or rotate.

You approve as **yourself**, so the token carries your own roles. `POST /api/query/` needs **`ReadOnly`**; a token without it gets a **403, not a 401** — the login worked, the account simply lacks the grant, and only an admin can change that (`corpus_data.whoami()` shows what you hold). See [How to get a Jawafdehi API token](https://paste.jawafdehi.org/s/QONWqWLAvZ) for the same flow in plain curl.

For CI or anything unattended, set `JAWAFDEHI_JWT` to a pre-minted token and the prompt is skipped — device flow needs a human at a browser, so it's the wrong tool for a cron job.

Gotcha: Cloudflare 403s the default `urllib`/`requests` UA — `corpus_data` sends a real `User-Agent`. Verdict dates live inside `case_status` as `फैसला (मिती: YYYY/MM/DD)` in Devanagari digits (the `verdict_*` columns are NULL); parsing lives in `corpus_data`.

## Assumptions (`dataset/assumptions.csv`)

The figures the court records **cannot** give us — CIAA complaint/investigation volumes — are declared here as explicit assumptions, each with a `source_url`. They come from the CIAA annual-report PDFs (converted with **likhit**, the Nepali document→markdown converter; the PDFs + extractions are in `ciaa-annual-reports/`). Only the funnel's top three stages and the 5-year context box use them. The funnel's **bottom stage (convictions) is not an assumption** — it's *derived* live as `corpus full-conviction rate × filed` (≈62 full / ≈84 incl. partial), so nothing in the funnel is hand-entered below the CIAA inputs.

| key | value | note |
|---|---|---|
| `funnel_complaints` / `_investigated` / `_filed` | 28,554 / 947 / 137 | CIAA funnel = new intake, FY2081/82 (workload 37,026 incl. 8,472 carryover) |
| `ciaa_complaints_5yr` / `_filed_5yr` / `_damages_1yr_bn` | ~107,050 / 744 / 6.02 | 5-yr context (complaints = new intake) + reporting-year damages |
| `ciaa_success_rate_pct` | 52.67 | CIAA single-year success FY2081/82 (full + partial; volatile YoY) |

## Results (derived, not stored)

There are **no result CSVs** — the notebook computes them from the source tables every run (instant). What each produces:

| result table | grain | powers | derived from |
|---|---|---|---|
| `corpus_totals` | scalars | KPI tiles | corpus + hearings + entities |
| `offense_mix` | offense family | charge-mix bar | corpus cases by family |
| `outcome_by_charge` | offense family | conviction-by-charge | deciding hearings × family |
| `charge_mix_by_year` | FY × family | charge-mix stacked | filing FY × 6 families |
| `filed_by_month` | Nepali month | seasonality ± SD | per (BS year, month) → mean/SD |
| `filed_vs_decided_by_year` | fiscal year | filed-vs-decided | filing FY + verdict FY |
| `verdict_by_year` | verdict FY | outcome trend + fake/core | deciding hearings by verdict FY |
| `cohorts` | filing FY | time-to-verdict / backlog | filing cohort decided/pending/median |
| `justices` | justice | per-bench conviction | bench split + honorific strip (≥30 decisions) — read the warning below |
| `funnel` | 4 stages | accountability funnel | `assumptions.csv` (top 3) + derived conviction floor |

### `justices` — two things to know before citing it

**It is per-bench, not per-judge.** `judge_names` gives the panel with roles (`अध्यक्ष` presiding, `सदस्य` member) and nothing else, and the court records one verdict per case. There is no per-judge vote anywhere in the data, so a judge who dissented is credited with the panel's outcome exactly as if he had written it. Benches are almost always panels — 3-justice benches decided 2,189 cases, 2-justice 644, single-judge 2 — so nearly every number in this table is a panel property attributed to individuals. It describes the benches a justice sat on, not that justice's effect.

**The name parser is clean on court-published rows and fragile on the model-derived ones.** Names are cut from the text after each `श्री ` marker. On the 2,728 court-published rows that is exact: 41 name buckets, and normalising spelling variants merges none of them. Include the 69 model-derived rows and it degrades to 62 buckets where normalisation yields 48 — one judge scattered across several buckets. Four patterns cause it, and every one of them appears *only* in derived rows, which `_transform` drops before computing anything:

| Pattern | Court-published | Model-derived |
|---|---|---|
| Variant title spelling (`न्यायधीश`, `न्यायाधिश`, `माननिय`) | 0 / 2,728 | 7 / 69 |
| Whole panel with no `अध्यक्ष`/`सदस्य` delimiter | 0 / 2,728 | 9 / 69 |
| Stray parentheses | 0 / 2,728 | 2 / 69 |
| `सिहं` / `ससंह` for `सिंह` | 0 / 2,728 | 2 / 69 |

So the published chart is unaffected today. The trap is that if those derived verdicts are ever promoted into the headline, or upstream re-ingestion fills the NULL `decision_type`s in the same format, the chart degrades silently — the same failure signature as the conviction-rate guard described above: the number moves and nothing raises. The delimiter-less case is now handled (names are taken from every `श्री ` marker, not just the last, or a panel would collapse to its last judge); the other three are not, and normalising them needs care, since folding `सिहं`→`सिंह` blind risks merging two different people.

## Files

```
corruption_analysis.ipynb  the notebook — derive from dataset → 9 sections / ~18 interactive Plotly charts
corpus_data.py             data layer: paginate -CR- pull, scope, derive every table in pandas (source of truth)
build_notebook.py          regenerates the .ipynb (nbformat + Plotly)
gen_dataset.py             CLI: re-paginate the -CR- pull + rewrite dataset/{cases,hearings,entities}.csv
dataset/                   source of truth (cases/hearings/entities/assumptions/leadership) — the files are themselves the cache
ciaa-annual-reports/       CIAA source PDFs + likhit extractions (provenance for the assumptions)
ciaa-vs-register/          the CIAA-reports-vs-court-register cross-check (see below)
.venv-notebook/            dedicated venv (gitignored): pandas, plotly, requests, jupyterlab + jupyterlab-plotly
```

## `ciaa-vs-register/` — checking the two sources against each other

Everything above treats the court register as the record. **[`ciaa-vs-register/`](ciaa-vs-register/README.md)** asks whether it *is* one, by joining the CIAA's own per-case filing tables to the register defendant by defendant.

Over thirteen fiscal years the two agree to **1.2%** (2,592 published filings vs 2,624 comparable register cases), the divergence is almost entirely one offence, and at case level in the three widest years **all 254 cases the CIAA says it filed are in the register** — while the register holds **19** the reports' own filing tables never list. Ten of the 19 have a documented cause, including five that are the two institutions attributing a filing to different fiscal years on principle, and four that one CIAA report omits and the *next* report describes it as having won.

Two things there matter beyond that finding. `ciaa_join.py` holds the Devanagari name folding and the four-rule match ladder, and reproduces the published `match_rule` for all 254 pairs. And the README's **Traps** section is the part to read before reusing any of this — in particular that `-CR-` case numbers are shared across three tiers of court and can never be a join key, and that some conversions are garbled, so a name's absence in those reports proves nothing — with the corollary that on a garbled file you search for Devanagari **digits**, which survive, rather than words, which do not.

This is a separate analysis rather than a notebook section because its source data is a manual/vision extraction from PDFs that cannot be recomputed from the API — the one deliberate exception to the "no result CSVs" rule stated above.

## Run the notebook

```bash
# no credentials, no environment — this reads the committed dataset/
.venv-notebook/bin/jupyter nbconvert --to notebook --execute --inplace \
  corruption_analysis.ipynb --ExecutePreprocessor.kernel_name=jawafdehi-corpus
# or open interactively:  .venv-notebook/bin/jupyter lab corruption_analysis.ipynb
```

Executing in place is also how the **rendered** notebook is produced. `build_notebook.py` only emits the cells — it writes no outputs — so rebuilding and committing without this step would strip every chart from the published notebook.

**Data source is automatic:** committed `dataset/*.csv` → else paginate the live API (sign-in prompt), re-scope, rewrite those same files. So it's **standalone** (the folder carries the data — open and every chart renders with no creds) and **smooth to rerun** (reads `dataset/` instantly). The committed files *are* the cache — there is no second raw copy on disk.

**Timing:** the raw `-CR-` pull is ~2.9k cases + 2.7k hearings + 12k entities (~35 pages of 500). Measured **~37s cold** (a refresh re-paginates), **~0.2s warm** (read `dataset/` + derive). Flip `REFRESH_FROM_API = True` in the notebook (or run `python gen_dataset.py`) to re-pull. `_api` retries transient 5xx/timeouts, so a mid-pull deploy blip won't abort it.

Setup: `uv venv .venv-notebook --python 3.12` + `uv pip install pandas plotly requests nbformat nbconvert ipykernel jupyterlab nepali-datetime kaleido`; kernel `jawafdehi-corpus`. (`kaleido` lets each interactive chart also embed a static PNG so the executed notebook renders on GitHub, which can't display interactive Plotly.) The leadership timeline's BS dates are computed by **nepali-datetime** (`corpus_data.ad_to_bs` / `bs_to_ad`) — `leadership.csv` stores AD only, BS is derived, and the BS x-axis ticks are library-computed (nothing hardcoded). Charts render as interactive Plotly (`application/vnd.plotly.v1+json`) in JupyterLab (the `jupyterlab-plotly` labextension ships with plotly ≥6).

## License

© Jawafdehi Initiative. This repository — the dataset, notebook, code, and CIAA-report extractions — is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**, the same license as the data on jawafdehi.org. You may share and adapt it for **non-commercial** purposes with attribution to **Jawafdehi.org**; see [`LICENSE`](LICENSE) for the full terms. For commercial use, contact inquiry@jawafdehi.org.

The CIAA annual reports under `ciaa-annual-reports/` are public documents of the Government of Nepal (source URLs in `download_manifest.json`); the court records in `dataset/` are public Special Court records.
