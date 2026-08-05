# The CIAA's annual reports against the Special Court's register

Nepal keeps two independent written records of the same event: the CIAA deciding to prosecute a corruption case, and the Special Court opening a docket for it. Neither is a copy of the other. Where they agree, a number is corroborated twice over; where they diverge, one of them is wrong or they are measuring different things — and which of those it is can be settled case by case, because both name the accused.

This directory is that comparison. It backs the "cross-check" section of [jawafdehi.org/research/corruption-accountability](https://jawafdehi.org/research/corruption-accountability).

**Headline.** Over thirteen fiscal years the two records agree to **1.2%** — 2,592 filings the CIAA published against 2,624 comparable register cases, a difference of **32**. The divergence is not spread evenly: across the **eight** years whose reports break filings down by offence, the register runs **+28** ahead in total, and **+22 of that 28 is fake-certificate cases alone**. Checked case by case in the three widest years, **all 254 cases the CIAA says it filed are in the register — not one is missing.** What the register holds instead is **19** fake-certificate cases those years' own filing tables never list.

Two numbers in that paragraph have different scopes, and conflating them is easy: the **32** is all thirteen years, the **28** only the eight with an offence breakdown. An earlier draft put them side by side and added that "every offence the two sources label the same way matches exactly" — which its own arithmetic contradicts, since 28 − 22 leaves 6 sitting outside fake certificates. Fake certificates *dominate* the divergence; they do not exhaust it.

## The two sides

**The register.** Deliberately plain, so it reproduces without judgement calls:

```sql
court_identifier = 'special'
AND case_number LIKE '%-CR-%'
AND registration_date_bs >= '2069-04-01'
AND registration_date_bs <  '2083-04-01'
```

2,949 cases. Verified equivalent to the stricter `^[0-9]{3}-CR-[0-9]+$` — no case number in the window fails to conform — and no row has a null registration date. This is the same corpus as `../dataset/cases.csv`.

**The CIAA side.** Chapter 2 of each annual report enumerates every filing case by case — `प्रतिवादीको नाम`, `आयोगको निर्णय मिति`, `आरोपपत्र दायर मिति`, post and office, `बिगो` — grouped by offence. Earlier passes over this material concluded the reports publish totals only, because these are ruled tables that land in `*.likhit.md` and never in `figures.json`.

## Year by year

`data/by_fiscal_year.csv`. `ngm_ciaa_comparable` = every `-CR-` case that year minus the streams the CIAA does not file (`data/ngm_excluded.csv`, 154 cases: 98 `money_laundering`, filed by the Dept. of Money Laundering Investigation — 93 pure `सम्पत्ति शुद्धीकरण`, 4 mixed `रिसवत(घुस) र सम्पत्ति शुद्धीकरण` dockets and 1 terrorist-financing case; 33 `nirnaya_vadar`, petitions filed *against* the CIAA rather than by it; 23 `other_agency`, offences outside its jurisdiction — forest, narcotics, trafficking, foreign exchange, contempt, offences against the state). No single year differs by more than **7** cases.

That 93 is the same 93 the notebook reports as `money_laundering` in `corpus_totals`, so the two figures are easy to confuse: the notebook's substantive corpus drops those 93, while this exclusion drops 98 — the extra five being the four mixed dockets and the terrorist-financing case, which a `case_type`-contains filter keeps. Both are right; quote the one whose scope you mean.

The three worst years are FY2069/70, FY2071/72 and FY2075/76, all at +7. FY2082/83 has no CIAA figure — the 36th report is unpublished — so it is listed and excluded from totals.

**Two caveats that must travel with this table.**

*The exclusion is marginally over-broad.* The FY2081/82 report's `चित्र २.१९` shows the CIAA filed **two money-laundering cases itself**. Correcting that year alone moves its comparable drift from 2 to 4. The exclusion rests on jurisdiction plus absence from the CIAA's own composition charts, and cannot be tightened further from these two sources alone.

*Where only a total is published, drift is a floor and not a count.* A year reading 0 could be five missing and five extra cancelling.

## The CIAA's own figures disagree with each other — but not where it matters

`data/ciaa_dispersion.json` extracts every filing-trend chart from all thirteen reports. Each year's figure is republished in up to eleven later reports. The three +7 years are **unanimous** — FY2069/70 = 93 ×10, FY2071/72 = 303 ×11, FY2075/76 = 351 ×10, spread 0 — and each year's own composition chart sums exactly to its trend total. So "it is extraction noise" is dead for exactly the years where the gap lives. Genuine dissent exists only at FY2073/74 (154 ×8 / 144 ×2) and FY2076/77 (441 ×8 / 449 ×2).

Two charts must be filtered first or you invent spreads of 73 and 130 out of nothing: the FY2078/79 report's five-year *fake-certificate* subset chart matches on "मुद्दा" + "दायर" but is a category series, and FY2081/82 `चित्र ३.३` has its first two cells shifted (166/144 where every other source reads 93/168).

## Case level, for the three worst years

`data/case_level_summary.csv`, and the joins in `data/drift_<fy>_fakecert.csv`.

| FY | CIAA listed | register `नक्कली प्रमाण पत्र` | Δ | CIAA cases absent from register | register surplus |
|---|---|---|---|---|---|
| 2069/70 | 70 | 79 | +9 | **0** | 10 |
| 2071/72 | 96 | 99 | +3 | **0** | 3 |
| 2075/76 | 88 | 93 | +5 | **0** | 6 |

Per year, `surplus − (CIAA case the register files under another case_type)` closes the published delta exactly: 10−1 = +9, 3−0 = +3, 6−1 = +5. That arithmetic closing is the check that the extraction is complete rather than merely plausible.

**Counting the surplus out of `drift_<fy>_fakecert.csv` takes care.** `NGM_ONLY` rows are one per defendant, so FY2071/72's 5 rows are 4 distinct case numbers, of which 3 carry `नक्कली प्रमाण पत्र` — and 3 is the surplus figure in the table above. Count distinct `ngm_case_number`, then filter on `ngm_case_type`.

### Why the 19 are missing from the CIAA's tables

**Five: the two institutions attribute a filing to different fiscal years, on principle.** The CIAA attributes it to the year of `आयोगको निर्णय मिति`; the court to the year of registration. All five of FY2075/76's Shrawan-registered surplus cases are printed in the **28th (FY2074/75)** report with Ashadh-2075 decision dates and Shrawan-2075 filing dates matching the register's registration date to the day (`075-CR-0005`, `0007`, `0008`, `0009`, `0022`). This accounts for *all* of FY2075/76's +5. An aggregate test that correlates Ashadh *registration* volume against the per-year gap structurally cannot see this, and one such test wrongly ruled the mechanism out.

**Four: the report omits filings its own later report confirms.** Four FY2069/70 surplus cases are absent from the 23rd report but named in the **24th**, under *पुनरावेदन नगरिएका मुद्दाहरू*, each as a `नक्कली शैक्षिक प्रमाणपत्र` case the CIAA charge-sheeted at the Special Court and won: `069-CR-0043`, `069-CR-0044`, `069-CR-0049`, `069-CR-0095`. One CIAA document contradicting another — not an inference from linkage rates.

**One: classification.** `075-CR-0184` is serial 47 of the 29th report's `तालिका २.९` fake-certificate table; the register files it under `झुठ्ठा विवरण पेश गरेको`. Differences run both ways: `069-CR-0019` is CIAA `नक्कली लिखत` and register `गैरकानुनी लाभ`; `071-CR-0147` is register `नक्कली प्रमाण पत्र` and 25th-report *६.३.७ विविध*.

**Nine: unexplained.** `069-CR-0008`, `069-CR-0048`, `069-CR-0065`, `069-CR-0066`, `069-CR-0067`, `069-CR-0096`, `071-CR-0031`, `071-CR-0134`, `075-CR-0307`. Each name was folded and searched across the whole text of all thirteen reports, in full and token by token; all six apparent hits were different people.

## What this supports

For the years before the CIAA began issuing a press release per charge sheet, the annual report's filing table is an **incomplete record of the Commission's own fake-certificate filings, and the court's register is the better count.** For the four cases above that is a finding, not a reading. For the rest it is a well-supported reading.

## Method

**Extraction is visual, not textual.** likhit emits the name column and the date column as separate text runs, so row-level name-to-date pairing is lost — a text parse recovered 36 of 70 rows for FY2069/70 and 66 of 88 for FY2075/76. Render each page with PyMuPDF at `dpi=185` and read the image: row alignment survives. One reader per 2–3 pages returning strict JSON, instructed **not** to normalise or transliterate Devanagari, because the names are the join key.

**Completeness test, and it is not optional.** Serials must run 1..N with no gaps **within each sub-table**, and the number of distinct serials must equal the category total the report publishes about itself — 70, 96, 88. All three matched. A short CIAA side manufactures "surplus" register cases, so a plausible-looking extraction that fails either half corrupts the finding.

Two wrinkles the test has to allow for, both real in this data. FY2069/70's 70 is *two* sub-tables — 69 serials under the fake-certificate heading plus one row from `क. नक्कली लिखत`, carried as `table` in the JSON — so contiguity is per sub-table, not across the file. And a row count can legitimately exceed the serial count: FY2075/76 has 89 rows for 88 serials because serial 75 prints a starred co-defendant on the same docket. That is the same fact as the count-per-case trap below.

Page runs: FY2069/70 PDF pp.34–40, FY2071/72 pp.54–61, FY2075/76 pp.41–49. Locating the sub-table: count board names `पटना`/`विहार` per page (or the Preeti bytes `k6gf`/`ljxf/` where the text layer is legacy-encoded). FY2075/76 words institutions differently and needs the printed-page offset instead (constant 9 there, 22 for FY2069/70).

**Matching** is `ciaa_join.py` — aggressive Devanagari folding plus a four-rule ladder (exact → token-subset → given+surname fuzzy ≥0.70 → whole-string fuzzy ≥0.82), which reaches 69/70, 95/96 and 85/88. The rule that produced each pair is published in `match_rule`, so the rule name doubles as a confidence level.

**The residue is resolved on the DATE, not the name.** In every accepted pair the filing date the report prints equals the register's registration date to the day, and the differing token is a caste alternate that appears nowhere else in that report — so there is no competing candidate. Three pairs were accepted this way (`manual_verified`) and two more are CIAA fake-certificate cases the register files under another offence label (`manual_verified_other_casetype`). All five are labelled, so a reader who rejects the reasoning can drop them and re-derive the totals.

`ciaa_join.py` reproduces the published `match_rule` for all 254 matched pairs exactly, and does **not** match any of the five hand-resolved pairs — which is the point of labelling them.

## Traps

- **`-CR-` case numbers are shared across three tiers of court** and can never be a join key. Of 1,636 distinct numbers printed across the thirteen reports, 1,080 are Special Court, 404 are **Supreme Court** and ~45 are district. Most come from the Supreme Court appeal tables, whose rows carry *two* `-CR-` numbers from two different courts — which is exactly how the conflation arises.
- **`झुठ्ठा विवरण पेश गरेको` is spelled with `ठ्ठ`.** The obvious substring filter (`झुठा`) misses all 44 cases, and at least one of them is a case the CIAA prints in its own fake-certificate table — so the +22 is a floor, not a measurement.
- **Count surplus per CASE, not per defendant row.** `075-CR-0265` carries two accused, printed by the report as one serial with a starred co-defendant; per-row counting invents a missing case.
- **Some conversions are garbled, and a name's absence in those years proves nothing.** Detect them by the scramble markers `दरुु` / `अनसु` / `तनर्` / `ऩ` appearing in the hundreds to thousands; a clean conversion scores under about 25. See [`../ciaa-annual-reports/README.md`](../ciaa-annual-reports/README.md) for which reports are affected — the list has changed, so check it there rather than trusting a copy.
- **On a garbled conversion, search for DIGITS, not words.** Devanagari digits survive the MarkItDown fallback intact while consonant clusters do not: `नियम` comes out as `तनयि`, `स्टिङ` as `ख्स्टङ`, `मुद्दा` as `िद्दु ा`. So anchor on a figure, a rupee amount or a BS date you know is near the passage, then read the surrounding lines and de-garble by eye. This is not hypothetical — a search for `नियम ३०` in the 35th report returned zero and was written up as "the claim cannot be verified from what we hold"; searching `५२.६७`, the success rate printed immediately before it, landed on the passage at once. **A zero-result word search in a garbled file is evidence about the encoding, not about the content.**

## Files

The repo's rule elsewhere is that there are *no result CSVs* — the notebook recomputes everything from the source tables. **`ciaa_*_fakecert.json` are a deliberate exception and are source data, not results:** they are a manual/vision extraction from PDFs and cannot be recomputed from the API. Do not delete them as derived.

| file | role |
|---|---|
| `data/by_fiscal_year.csv` | the year-by-year comparison, both sides |
| `data/ngm_excluded.csv` | the 154 excluded register cases, so the judgement call is auditable |
| `data/case_level_summary.csv` | per-year decomposition of each delta |
| `data/ciaa_<fy>_fakecert.json` | **source data** — the vision extraction of each report's fake-certificate filing table |
| `data/drift_<fy>_fakecert.csv` | the joins: `MATCH` / `CIAA_ONLY` / `NGM_ONLY`, each pair carrying the rule that produced it |
| `data/ciaa_dispersion.json` | every filing-trend chart across all 13 reports, per year |
| `ciaa_join.py` | `fold()` and the match ladder |

**Names are not published here.** The join is on defendant names and both sources publish them — the CIAA in its report tables, the court in its register — but re-publishing them as one combined machine-readable list is a separate decision. The files are keyed on the two public identifiers instead: recover a name from the report table at `ciaa_serial`, or from the case page at `ngm_case_number`.

## Limits

Three of fourteen years and one of roughly thirteen offence families have been checked at case level. Nine cases remain unexplained. Extending the pass to the other ten years needs the four failing likhit conversions fixed first, plus a page-run locator per report. Closing the nine needs a census of court orders for the three years (~700 conversions; sampling is useless at ~2% prevalence) or the FY2075/76 press-release attachments, 337 of which are title-only placeholders.
