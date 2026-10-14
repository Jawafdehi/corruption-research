# Research inventory — findings added in this round

Internal working record, not a page on the site. One entry per finding added or
corrected, with the evidence behind it, where it sits, and what it cannot establish.

Confidence is one of:

- **Established** — reproduced directly from a primary source, with the arithmetic
  checked against a second number printed by that same source.
- **Suggestive** — the measurement is sound but the interpretation has more than one
  available explanation and the data cannot choose between them.
- **Hypothesis** — recorded because it is worth testing, not presented on the site.

Every figure below was recomputed from `dataset/*.csv` and the committed annual
reports by a script that does **not** import `corpus_data`, so the pipeline cannot
validate itself. 29 of 29 figures reproduced exactly.

---

## 1. The Commission's post-investigation output inverted in a single year

| | |
|---|---|
| **Stage** | Investigation |
| **Where** | Investigation tab, "The second filter"; Highlights card 01 |
| **Confidence** | Established (measurement) · Suggestive (cause) |

**Question.** Of the complaints the CIAA investigates in full, what share does it
prosecute and what share does it shelve, and has that changed?

**Source.** The "विस्तृत अनुसन्धानबाट भएको कारबाही/निर्णयको विवरण" table in each CIAA
annual report, FY2073/74–2081/82, parsed from the committed `.likhit.md` conversions by
`extract_ciaa_series.py` → `dataset/ciaa_investigation_decisions.csv`.

**Method.** Counts of *actions* taken after a completed detailed investigation.
Denominator is the table's own printed जम्मा where it prints one, otherwise the sum of
its own rows. No figure is combined across reports.

**Result.** Decisions to prosecute peaked at **441** in FY2076/77 against **124**
shelved — तामेली was 16.4% of actions. By FY2081/82 it was **137** prosecuted against
**794** shelved, तामेली at **75.1%**. The turn happens between FY2076/77 and FY2077/78,
two consecutive years (16.4% → 54.1%), and has not reversed.

**Verification.** Five of the nine years reconcile against the table's own printed
जम्मा. Five reconcile against filing counts the reports state in prose, including one
sentence in the FY2076/77 report that lists the whole run: *"आयोगले आर्थिक वर्ष २०७२।७३
मा १४४, २०७३।७४ मा १५४, २०७४।७५ मा १९४, २०७५।७६ मा ३५१ हुँदै 2076।77 मा 441 वटा मुद्दा
दायर गरेको छ।"* `extract_ciaa_series.py` refuses to write a series that disagrees with it.

**Why it matters.** This is the single largest shift anywhere in the pipeline, it sits
at the stage with the least public visibility, and the existing five-year series on the
site began after the peak — so the site previously showed the second half of a reversal
as though it were a trend.

**What might explain it.** Two documented facts fall inside the window: the post of
chief commissioner was vacant for roughly five months from Bhadra 2077, and was then
filled substantively for the first time since 2073 (`dataset/leadership.csv`). Stated on
the site as coincident dates and explicitly not as a cause. A genuine improvement in
early screening would produce the same chart.

**What remains unknown.** No reason is recorded against any individual closure, and no
count of closures later reopened is published anywhere.

---

## 2. Cases are not people, and the two grains disagree sharply

| | |
|---|---|
| **Stage** | Court outcomes (consequences visible in Prosecution) |
| **Where** | Court outcomes tab, "Cases and people"; Highlights card 02 |
| **Confidence** | Established |

**Question.** The conviction rate counts dockets. How many people sit behind those
dockets, and does counting people change the picture?

**Source.** `dataset/entities.csv` (defendant side) joined to `dataset/hearings.csv`
on the same court-published-verdict filter every other rate on the site uses.

**Method.** Defendant rows per case, grouped by the case's verdict. Institutional rows
(`नेपाल सरकार`, `अ.दु.अ.आ.` — the prosecutor, mis-filed on the defence side; 24 rows)
removed.

**Result.** **8,846** people are named as defendants across **2,754** decided cases,
from one apiece to **249** in a single case.

| Verdict | Cases | Share of cases | People | Share of people |
|---|---:|---:|---:|---:|
| ठहर — upheld in full | 1,239 | 45.0% | 1,975 | 22.3% |
| आंशिक ठहर — upheld in part | 450 | 16.3% | 3,038 | 34.3% |
| सफाई — acquitted | 1,065 | 38.7% | 3,833 | 43.3% |

**Why it matters.** 45% of cases end in full conviction, but those cases hold only 22%
of the people charged, because they are small — about half of all cases have a single
defendant. And **34.3% of everyone prosecuted sits in a case the court upheld only in
part**, where the record states one verdict for the whole docket and no outcome per
defendant. For roughly a third of the people prosecuted, the public record does not say
whether they were convicted.

**What it cannot establish.** This is **not** a per-person conviction rate and must
never be presented as one. The written judgment names who was convicted; the structured
record does not. A defendant row is an accusation, not a resolved individual — only
about 5% of entity rows carry an identity code, so someone charged twice counts twice.

**Limitations.** One decided case (`070-CR-0038`) names no defendant and is excluded,
which is why this chart's case total is 2,754 against 2,755 elsewhere. Stated in the
chart caption rather than silently reconciled.

---

## 3. Charges that convict reliably are the ones with one defendant

| | |
|---|---|
| **Stage** | Prosecution |
| **Where** | Prosecution tab, "How big a case is" |
| **Confidence** | Established (measurement) · Suggestive (mechanism) |

**Result.** People charged per decided case, by offence:

| Offence | People / cases | Per case | Full-conviction rate |
|---|---:|---:|---:|
| Govt land misregistration | 1,098 / 41 | 26.8 | — |
| Illegal benefit | 999 / 135 | 7.4 | 4% |
| Loss to government | 972 / 167 | 5.8 | 19% |
| Bribery | 1,469 / 915 | 1.6 | 47% |
| Fake credential | 642 / 634 | **1.0** | **90%** |

**Why it matters.** This is a *mechanism* for the charge-outcome spread the site already
reported. Because the court issues one verdict per docket, a charge tried one defendant
at a time yields a clean conviction or acquittal, while a charge tried forty defendants
at a time nearly has to yield a partial result. Some of the spread between charges is
about case structure rather than evidence or effort.

**What it cannot establish.** How much of the spread is structure and how much is
difficulty of proof. Large cases are not evidence of weak prosecution; trying collective
conduct together can be the correct choice.

**Correction made.** The Prosecution tab previously stated that the number of defendants
per charge is "not carried in the register rows this site is built from". It is, and the
sentence has been corrected.

---

## 4. The Commission declines to appeal in roughly three decisions in ten

| | |
|---|---|
| **Stage** | Appeals |
| **Where** | Appeals tab, "Before the appeal exists" |
| **Confidence** | Established (counts) · the rate is **not** computable |

**Source.** The "आयोगका निर्णयहरूको विवरण" table, rows पुनरावेदन गने / पुनरावेदन नगने,
FY2075/76–2081/82 → `dataset/ciaa_appeal_decisions.csv`.

**Result.** Across seven fiscal years: **802** decisions to appeal, **327** decisions
not to appeal — declining in **29.0%** of the decisions taken. Appeal decisions swing
from 20 in one year to 255 in another; declines stay far steadier (7–76).

**Why it matters.** Everything else on the Appeals tab counts appeals that were filed.
This is the filter *before* that: a Special Court loss only reaches the Supreme Court if
the Commission votes to take it there, and it routinely votes not to.

**What it cannot establish.** A decision is not a filing, and the year of the decision is
not the year of the verdict. There is no published count of verdicts eligible for appeal,
so **no success or appeal rate can be built from this column**, and it is never divided
into the Supreme Court figures. No reason and no case number is recorded against any
decision not to appeal.

---

## 5. Correction: FY2078/79 prosecution decisions were undercounted

| | |
|---|---|
| **Stage** | Investigation (data correction) |
| **Confidence** | Established |

`dataset/ciaa_disposals.csv` recorded FY2078/79 `filed` as **115**, which is the
report's "मुद्दा दायर गने मात्र" (prosecute-only) row. The comparable figure is **130**,
adding the 9 "prosecute and advise" and 6 "prosecute and refer" decisions — exactly the
treatment its own तामेली figure already used (559 + 68 + 10 = 637).

Confirmed two ways: तालिका २.१० of the FY2078/79 report prints 130 and 637 directly, and
the combined-decision rows of तालिका २.११ reconcile to both. `corpus_data._reconcile_disposals`
now checks the parsed series against the superseded compilation on every load and raises
on any disagreement other than this one documented correction.

---

## 6. Illicit enrichment: the courts and the Commission disagree on the arithmetic

| | |
|---|---|
| **Stage** | Prosecution (consequence visible in Court outcomes) |
| **Where** | Prosecution tab |
| **Confidence** | Established (the ruling, the dispute, the outcome rates) · the per-case link is **not** measurable |

**The ruling.** नेपाल सरकार वि. हरेकृष्ण भगत, नि.नं. ९४३३, २०७२
([nkp.gov.np/full_detail/8476](https://nkp.gov.np/full_detail/8476)). Para 11 records
that the case was registered on a Cash Flow basis while the Special Court assessed it
on a Check Period basis, and declines to reopen the question: *"Check period को
आधारमा सम्पत्तिको विश्लेषण गरी न्याय निरूपण गर्ने गरिएको हुँदा"*.

**The arithmetic, re-checked against the judgment's own text before publication.**
Para 47: assets over the check period रू.७४,५१,४२६।२५ against lawful income
रू.६८,४७,५३५।९०. Para 49: *"कूल सम्पत्तिको बिगो र आयमा ८.१० प्रतिशत अर्थात्
रू.६,०३,८९०।३४ अन्तर"* — the percentage is of **total assets**, not of income (of
income it would be 8.82%). Para 48 is the threshold: *"सम्पत्तिको बिगो र आयको फरक
रकम १० प्रतिशतसम्म न्यून हुनुलाई अमिल्दो र अस्वाभाविक भन्न मिल्दैन"*. The acquittal
stood. **Ten per cent is this court's reasoning in this case and is not in the Act**;
the site says so in the caption under the figure, and that caveat must survive any
later edit of the block.

**The method is still in use — three dated records, all from the Commission's own
annual reports.** Before the ruling, the FY2070/71 report (24th) records two files
placed in Tameli on 2071/3/12 and 2071/3/13 on the ground that income exceeded
spending and *"क्यासफ्लोको कुनै चरणमा ऋणात्मक अवस्था पनि नदेखिएको"*. Four years
after it, the FY2076/77 report (30th) reproduces, in the Commission's own grounds for
appealing the 2076/2/2 acquittal of Ram Babu Adhikari and Malati Sharma Adhikari, the
charge sheet's *"आय व्ययको प्रवाह विवरण (Cash Flow Chart)"* running 2046/47 →
2073/12/31 and totalling रू.२,५४,६९,८८७ of property with no source shown — in a case
the Special Court decided by taking *"समग्र जाँच अवधिको एकीकृत रूपमा"* and finding
income exceeded expenditure. Same facts, two methods, opposite answers.

**Earlier draft corrected.** An earlier version of this entry sourced the finding to
नि.नं. ९५०५ via the FY2078/79 report and said the phrase "cash flow method" appears
in no available source. Both are wrong: a grep across all thirteen converted reports
finds cash-flow reasoning in **FY2070/71 and FY2076/77 only** — not FY2069/70, which
an intermediate draft also claimed.

**Outcome.** Illicit enrichment is upheld in full in 19 of 95 decided cases (20.0%)
against a court average of 45.0%, and ends in outright acquittal 59 times (62.1%).

**What this does NOT establish.** That the method caused the outcome, or how many
charge sheets use it. The register carries no amount and no method, only the verdict,
so this can be read in judgments and reports one at a time but not counted across
them. The three fields that would make it countable — method, amount claimed, amount
upheld — are what the gap on the page asks for.

---

## 6b. How long the Supreme Court takes to decide a corruption appeal

| | |
|---|---|
| **Stage** | Supreme Court decision (stage 8 of the route figure) |
| **Where** | Highlights tab, the complaint-route figure |
| **Confidence** | Established for the settled cohorts · **right-censored, and the censoring runs one way** |

**Source.** The public court-case API, `/api/courtcases/?court=supreme&type=भ्रष्टाचार`,
which carries `registration_date_ad` and `verdict_date_ad` per case. Pulled 2026-10-13;
the per-case rows are committed as `dataset/supreme_appeal_duration.csv` so the figure
can be recomputed rather than taken on trust. Only `-CR-` numbers are kept (2,976 of
3,239): `RV` reviews and `CF`/`NF` writs answer a different question than "how long did
an appeal against a corruption verdict take".

**What is measured.** Appeal registered at the Supreme Court → that appeal decided.
Not the trial, and not the whole journey from complaint.

**The finding.** Over the 11 registration years 2008–2018 — the cohorts at least 85%
decided — **the median wait is 4.53 years** across 1,029 decided appeals. The upper
quartile is 6.29 years, **34.4% took more than six years**, and the slowest intake,
2017, ran to a 6.27-year median.

**The six-year figure, tested.** A standing claim that an appealed case takes
"approximately six years" to be decided is **not supported as a typical wait**: the
median over settled cohorts is about four and a half years, not six. Six years is
roughly the **upper quartile**, and it is the median for the 2017 intake specifically.
The site therefore shows 4.5 years as the headline and states the over-six share
separately. Reporting six as the norm would overstate the record by about 18 months.

**The spread, not a trend.** Cohort medians swing between 1.9 years (2009) and 6.3
(2017) with no direction, so the site draws the distribution instead: of the 1,029
decided appeals, 305 took under two years, 159 two to four, 211 four to six, 286 six to
eight and 68 over eight. The two largest groups are the fastest band and the
six-to-eight-year band, which is why the median alone reads as more typical than it is.

**What this does NOT establish.** 1,462 of the 2,976 registered appeals carry no
verdict date at all, and an appeal still open is by definition a slow one, so every
figure here is a **floor**. Cohorts after 2018 are excluded for the same reason — the
2025 intake shows a median under 13 months off five decided appeals, which measures
how long the fast ones take and nothing else. The 85% threshold is a judgement call
and lives in `corpus_data.SUPREME_SETTLED_MIN`. Nothing here says why the wait is what
it is.

---

## 6c. The screening figure this site used to get wrong

| | |
|---|---|
| **Stage** | Screening (stage 2 of the route figure) |
| **Where** | Highlights tab, the complaint-route figure |
| **Confidence** | Established for FY2081/82 · one year only |

**The error, recorded.** The route figure's screening stage quoted **75.1% to Tameli**.
That figure is `794/1057` from **तालिका २.१५** — तामेली as a share of decisions taken
*after* a detailed investigation finishes. It describes a different stage from the one
it was attached to, and overstated the screening rate by about fifteen points.

**The right table is तालिका २.१४**, which covers what the Commission disposed of before
any detailed investigation. For FY2081/82, of **29,703** complaints disposed of:
**17,130 Tameli + 586 Tameli with advice = 17,716 (59.6%)**, **11,060 other action
(37.2%)**, **927 on to detailed investigation (3.1%)**. A further 7,323 of the 37,026 on
the books were carried into the next year.

**What this does NOT establish.** तालिका २.१४ does not separate screening from the
preliminary inquiry — the two are one column of outcomes — so the figure covers stages
2 and 3 together and the site says so. Only the 35th report publishes this table in a
form that parses, so there is no series: one year, no trend. `to_investigation` (927,
sent) and `investigations_completed` (947, finished) are different events in the same
year and must never be differenced.

---

## 7. A bench's conviction rate cannot be checked against review

| | |
|---|---|
| **Stage** | Court outcomes |
| **Where** | Court outcomes tab, after the per-justice chart |
| **Confidence** | Established as a gap — the measurement itself is **not currently possible** |

**The better question.** Comparing Special Court justices by their own conviction and
acquittal rates is weak: a bench hearing mostly documentary fake-certificate cases
will convict more often than one hearing contested financial cases, whatever either
does. The question worth asking is how often a bench's decisions survived appeal.

**Why it cannot be built here.** The trial side is complete — all 2,755 decided cases
carry their bench, and 39 justices clear the 30-decision threshold. The appeal side is
shipped as an aggregate only: `dataset/appeals.csv` is five rows keyed by trial outcome
× appellant, with no case number on any of them. 1,797 appeals are established and not
one can be traced back to the bench whose decision it challenged.

**What would close it.** The trial case number on each appeal record — one column.
A per-case pairing was built upstream (see gap D) but only the aggregate is published,
because the pairings are provisional. `ngm_query_judicial`, which would allow the join
to be rebuilt, is not available without authentication.

**This is now stated on the site** rather than left as an unstated limitation, because
a chart that invites a performance reading needs to say what it cannot support.

---

## Also fixed

- **`--court` was undefined outside the Highlights theme.** Any chart using the court
  green on another tab rendered that band transparent. Promoted to `:root` and registered
  in the Tailwind config.
- **`NaN` in generated JSON.** A blank cell in a source CSV was emitted as the bare token
  `NaN`, which is not valid JSON and broke the TypeScript import. Now emitted as `null`,
  so a gap in a source table stays a visible gap instead of becoming a zero.

---

## Tested and not published

| Hypothesis | Why not published |
|---|---|
| Repeat defendants: 781 names appear in more than one case, 40 in five or more | Identity resolution covers ~5% of rows. Nepali names collide heavily, so a name-matched "repeat offender" count would be a guess presented as a measurement. |
| Special Court backlog | Measured and found to be *small*: 2,870 of 2,949 cases decided, 79 pending, 75 of them registered in the last two fiscal years. Does not support a backlog finding; the delay in this system is not at trial. Worth saying somewhere eventually. |
| Extending the CIAA series before FY2073/74 | FY2069/70–2071/72 report the same material as a subject-area cross-tab with different row labels; FY2072/73 is absent from its own report and the annex claiming to carry it reproduces FY2073/74's totals. Recorded in `extract_ciaa_series.KNOWN_GAPS`. |
| Per-defendant appeal outcomes | The aggregate appeal table is case-grain only, and 45.6% of mapped appeals carry no recorded outcome. |

---

## What would most improve this research

1. **A per-defendant outcome field on the court record.** Would convert 9,552
   accusations into a countable population of people and make a genuine per-person
   conviction rate possible for the first time. This is the single highest-value gap.
2. **A reason recorded against each तामेली decision**, and a count of closures later
   reopened. Without either, the largest shift in the pipeline cannot be interpreted.
3. **A count of verdicts eligible for appeal each year.** Would turn the appeal/decline
   column into a rate.
4. **Authenticated access to `ngm_query_judicial`.** Case-level Supreme Court records
   would allow trial→appeal linkage to be rebuilt from the register rather than curated
   by hand, which is what currently caps the appeals analysis.
