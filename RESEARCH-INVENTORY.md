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
validate itself. An earlier version of this paragraph said "29 of 29 figures reproduced
exactly"; that described a smaller, earlier check and is replaced by the Day 5 pass.

**Day 5 recomputation (2026-11-07).** Every figure in entries 1–10, `Tested and not
published`, the headline cards (`headline/FINDINGS.md`) and the stage cards 8.2, 8.3 and
8.5 was recomputed by new code that does not call the code that produced it
(`work/2026-11-01-research/verify/VERIFY.md`): **572 figures checked, 477 exact, 33 equal
after rounding, 57 mismatches, 5 not recomputable or dependent on an automatic reader.**
Most of the mismatches (H1, H2, entries 8 and 9, card 8.5) have one cause: the appeal
table `APPEALS_MASTER.csv` was rewritten on 2026-11-03 at 10:42 UTC, after the headline
figures were generated on 2026-11-02. Following the board's rule to use the appeal links
as they stand (`work/2026-11-01-research/PLAN.md`, decision 17), every appeal figure was
regenerated on the table as it stands; the old figures are listed as superseded. The
other mismatches were errors of counting or wording. All 57 are corrected in this
inventory, the headline cards, the stage cards and the synthesis; each changed entry
carries a dated "Corrected 2026-11-07" line. (The working note `snapshot/DIFF.md` still
carries the old count of 4,431 appeals; it is not a published file.) Entries 11 and 12 were not in the Day 5 pass:
entry 11 quotes `stages/CARD_8.3.md`, itself a second-script cross-check of the verified
8.3 card, and entry 12 was rewritten after the Day 5 pass from the court-page source check (`stages/partylists_source.py`).

**Gap type** (board rule, 2026-11-07). Each entry is labelled:
- **A**, an institutional accountability gap: the system fails to record, publish, act or
  explain. Nothing is labelled A until it has been checked at the original source.
- **B**, a limit of this research: our data, tools, time, sample or agent reading. A B is
  never presented as a failing of the CIAA, the courts or the government.
- **A→B**, both: the institutional failure is the finding, and its effect on our analysis is
  stated as a limitation.

---

## 1. The Commission's post-investigation output inverted in a single year

| | |
|---|---|
| **Stage** | Investigation |
| **Where** | Investigation tab, "The second filter"; Highlights card 01 |
| **Confidence** | Established (measurement) · Suggestive (cause) |
| **Gap type** | **A→B.** (A) The CIAA publishes no count of closures later reopened, and its FY2081/82 report gives its 794 post-investigation closures only two group grounds (754 under one general sentence, 40 illicit-enrichment closures under another; 35th report, checked at source). (B) Without a reason per closure, this research cannot say why the share turned. |

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

**What remains unknown.** Why the share turned. The FY2069/70 and FY2071/72 reports
(23rd, 25th) list each post-investigation closure with the facts found and a reason; the
FY2081/82 report (35th) lists its 794 under two group grounds only. The years between were
not checked closure by closure. No count of closures later reopened is published anywhere.

*Corrected 2026-11-07 (Day 5 verification, `verify/VERIFY.md` D7).* This said that no reason
is recorded against any individual closure. The 23rd and 25th reports do give one per
closure; the 35th gives group grounds.

---

## 2. From the court's public website, nobody can tell which defendants in a case were convicted and which were cleared

| | |
|---|---|
| **Stage** | 6, Special Court trial (the record of its outcome) |
| **Where** | Court outcomes tab, "Cases and people"; Highlights card 02 |
| **Confidence** | Established (the public pages, checked 2026-11-07; the counts, NGM snapshot 2026-11-02) |
| **Gap type** | **A→B.** **A:** the court's public case record gives one outcome for a whole case and not one per defendant, checked on the court's own pages (below). **B:** as a result, this research can't give a conviction rate per person (see "Limitations of this research"). |

**In plain words.** The Special Court's case records are published on the Supreme Court's website. Each case shows one outcome for the whole case: guilty, partly guilty (आंशिक ठहर) or acquitted. When a case is "partly guilty", the page doesn't say which defendants were convicted and which were cleared. Only the full written judgment says that. The judgment sits on a separate page behind a CAPTCHA, in a long Nepali text, and some judgments haven't been uploaded at all. **About a third of everyone the CIAA prosecutes (34.3%) is in such a case.**

**What a member of the public sees (checked 2026-11-07, 19:53–20:05 UTC; screenshots in `stages/public-view/`).**
- **The case page.** It's at supremecourt.gov.np → Special Court → "CASE PROCESS STATUS" (`/special/syspublic.php?d=reports&f=case_details`, page title "मुद्दाको बिस्तृत विवरण"). We opened it for five partly-upheld cases: 070-CR-0016, 070-CR-0158, 074-CR-0025, 076-CR-0270 and 078-CR-0085.
  - Every page shows a single status, "फैसला / आंशिक ठहर".
  - None shows an outcome for any defendant, and none links to the judgment.
  - 070-CR-0158, for example, lists about 30 defendants and one outcome.
- **The full judgment.** It's published on a separate page, "फैसला / आदेश को पुर्ण पाठ" (`supremecourt.gov.np/cp/`). You choose the court, type the case number and solve a CAPTCHA.
  - Four of the five judgments are there, and each names who was convicted and who was cleared, inside a text of up to about 180,000 characters.
  - The fifth, 076-CR-0270, was decided on 2080/11/03 and still shows "फैसला अपलोड हुन बाँकी" (judgment not yet uploaded) more than two and a half years later.
- **The Special Court's "DECIDED CASES" page** (`…f=decided_cases`) says judgments can be viewed and downloaded there, but it returned no rows for any query we tried.

**How many people it affects.** These counts come from the court record as held in NGM (snapshot 2026-11-02), joining defendants to each case's single published verdict, with institutional rows removed. The count is defendant rows, not identified people.

| Verdict for the whole case | Cases | Share of cases | Defendant rows | Share of defendants |
|---|---:|---:|---:|---:|
| ठहर (upheld in full) | 1,239 | 45.0% | 1,975 | 22.3% |
| आंशिक ठहर (upheld in part) | 450 | 16.3% | 3,038 | 34.3% |
| सफाई (acquitted) | 1,065 | 38.7% | 3,833 | 43.3% |

- 8,846 defendant rows across 2,754 decided cases, from 1 to 249 in a single case.
- 45% of cases end in full conviction, but those cases hold only 22% of the people charged, because they are small: about half of all cases have a single defendant.

**Why it matters.** For a third of the people prosecuted for corruption, the court's public record cannot answer the simplest question: was this person convicted? The answer exists, inside judgments the public has to find one by one, and for some cases it isn't published at all.

**What it cannot establish (B: our limits).**
- **No conviction rate per person** can be computed from the public record. This is the A finding's effect on our analysis. Read the table only as cases and defendant rows.
- **A defendant row is an accusation, not a resolved individual.** Only about 5% of rows carry an identity code, so someone charged twice counts twice.
- **Five cases were checked by hand.** They show what the pages look like, not a rate. Whether some other official source gives per-defendant outcomes (for example the law reports, नेपाल कानून पत्रिका) wasn't checked.
- **The defendant lists themselves are incomplete in some court pages and in NGM.** See entry 12. For three of the five checked cases, the court page and NGM give different defendant counts (074-CR-0025: 41 vs 29; 076-CR-0270: 37 vs 25; 078-CR-0085: 52 vs 34), so the 34.3% is if anything an undercount.
- **One decided case names no defendant** (`070-CR-0038`) and is excluded: 2,754 here against 2,755 elsewhere.

*Reframed 2026-11-07 (board, damo): the finding is now stated from what a member of the public can see on the court's website, and checked there, rather than from our dataset. The figures are unchanged.*

---

## 3. Charges that convict reliably are the ones with one defendant

| | |
|---|---|
| **Stage** | Prosecution |
| **Where** | Prosecution tab, "How big a case is" |
| **Confidence** | Established (measurement) · Suggestive (mechanism) |
| **Gap type** | **B.** A measurement, not an institutional gap. What it cannot separate (case structure against difficulty of proof) is a limit of this research. |

**Result.** People charged per decided case, by offence:

| Offence | People / cases | Per case | Full-conviction rate |
|---|---:|---:|---:|
| Govt land misregistration | 1,098 / 41 | 26.8 | 12% |
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

*Corrected 2026-11-07 (Day 5 verification, `verify/VERIFY.md` E3.01).* The full-conviction
rate for government land was shown as "—". It is computable from the same data: 5 of 41
decided cases (12%; 26 partly upheld, 10 acquitted).

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
| **Gap type** | **A→B.** (A) No reason and no case number is published for any decision not to appeal (all seven CIAA annual reports FY2075/76–2081/82, checked at source). (B) This research cannot turn the decisions into a rate; entry 9 measures the acquittal side from the court record instead. |

**Source.** The "आयोगका निर्णयहरूको विवरण" table, rows पुनरावेदन गने / पुनरावेदन नगने,
FY2075/76–2081/82 → `dataset/ciaa_appeal_decisions.csv`.

**Result.** Across seven fiscal years: **802** decisions to appeal, **327** decisions
not to appeal — declining in **29.0%** of the decisions taken. Appeal decisions swing
from 20 in one year to 255 in another; declines stay far steadier (7–76).

**Why it matters.** Everything else on the Appeals tab counts appeals that were filed.
This is the filter *before* that: a Special Court loss only reaches the Supreme Court if
the Commission votes to take it there, and it routinely votes not to.

**What it cannot establish.** A decision is not a filing, and the year of the decision is
not the year of the verdict. The reports print how many judgments the CIAA received each
year (204 in FY2075/76, 113 in FY2077/78), and some years split them by verdict (FY2077/78:
81 of 113 convicted; FY2080/81: 45 in full and 107 in part of 233; FY2081/82: 87 in full and
120 in part of 393). That is the CIAA's own count, not the court register's, and it is not
given every year, so **no success or appeal rate is built from this column**, and it is
never divided into the Supreme Court figures. No reason and no case number is recorded
against any decision not to appeal.

*Corrected 2026-11-07 (Day 5 verification, `verify/VERIFY.md` D8).* This said there is no
published count of verdicts eligible for appeal. The reports do print judgments received,
split by verdict in some years; the conclusion (no rate) stands, for the reasons above.

---

## 5. Correction: FY2078/79 prosecution decisions were undercounted

| | |
|---|---|
| **Stage** | Investigation (data correction) |
| **Confidence** | Established |
| **Gap type** | **B.** An error in this project's own dataset, now corrected. The report printed the right figure. |

`dataset/ciaa_disposals.csv` recorded FY2078/79 `filed` as **115**, which is the
report's "मुद्दा दायर गने मात्र" (prosecute-only) row. The comparable figure is **130**,
adding the 9 "prosecute and advise" and 6 "prosecute and refer" decisions — exactly the
treatment its own तामेली figure already used (559 + 68 + 10 = 637).

Confirmed two ways: तालिका २.१० of the FY2078/79 report prints 130 and 637 directly, and
the combined-decision rows of तालिका २.११ reconcile to both. `corpus_data._reconcile_disposals`
now checks the parsed series against the superseded compilation on every load and raises
on any disagreement other than this one documented correction.

*Changed 2026-11-07: gap-type label added (board rule, PLAN.md decision 13). No figure changed; the Day 5 recomputation found no mismatch in this entry.*

---

## 6. Illicit enrichment: the courts and the Commission disagree on the arithmetic

| | |
|---|---|
| **Stage** | Prosecution (consequence visible in Court outcomes) |
| **Where** | Prosecution tab |
| **Confidence** | Established (the ruling, the dispute, the outcome rates) · the per-case link is **not** measurable |
| **Gap type** | **B.** The dispute between the courts and the CIAA is the finding. That the per-case link cannot be counted is a limit of the data this research holds: NGM carries no method or amount field. Whether the courts' own records carry them has not been checked at source, so this is not labelled A. |

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
appealing the 2076/2/2 acquittal of two defendants, the
charge sheet's *"आय व्ययको प्रवाह विवरण (Cash Flow Chart)"* running 2046/47 →
2073/12/31 and totalling रू.२,५४,६९,८८७ of property with no source shown — in a case
the Special Court decided by taking *"समग्र जाँच अवधिको एकीकृत रूपमा"* and finding
income exceeded expenditure. Same facts, two methods, opposite answers.

**Earlier draft corrected.** An earlier version of this entry sourced the finding to
नि.नं. ९५०५ via the FY2078/79 report and said the phrase "cash flow method" appears
in no available source. Both are wrong: a search across all thirteen converted reports
finds cash-flow reasoning in **five**: FY2069/70 (two Tameli decisions, 2070/2/7 and
2070/2/27, using "नगद प्रवाह" and the same "कुनै चरणमा ऋणात्मक अवस्था नदेखिएको"
reasoning), FY2070/71, FY2075/76 (an appeal ground, "आय व्ययको प्रवाह विवरण"),
FY2076/77 and FY2077/78 (an appeal ground, "CASH FLOW CHART").

*Corrected 2026-11-07 (Day 5 verification, `verify/VERIFY.md` E6.07).* This said FY2070/71
and FY2076/77 only, and not FY2069/70. The earlier search missed the Nepali "नगद प्रवाह"
and the upper-case "CASH FLOW". The 24th report (FY2070/71) also has a third cash-flow
Tameli (2070/4/17), so the two files cited above are a subset.

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
| **Gap type** | **A** (the court's own delay, from its own registration and decision dates) · **B** (ours): censoring, the choice of universe. |

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

**Mean and median agree, so the jargon can go.** Over the settled cohorts the mean is
4.35 years against a median of 4.53 — 0.19 years apart, on a near-symmetric
distribution (skew 0.31). The site therefore says "half took at least 4.5 years" and
gives the average alongside, rather than leaning on a word most readers skip.

**The recent trend, and why it is keyed on the decision year.** Registration cohorts
after 2018 are too censored to carry a trend. Keying on the year an appeal was
*decided* is not censored at all — every appeal with a decision date has a known
duration — and it shows the wait growing: appeals decided 2015–2019 had been waiting a
median of **1.83 years** (n=481); those decided 2023–2026 had been waiting **5.41**
(n=804). ⚠️ This measures how old the appeals being cleared are, NOT how long an appeal
filed today will take: a year in which the court works through a backlog of old cases
shows a long wait by construction. The page states that limit wherever it quotes the
figure. Year by year the series is noisy (2023: 6.28, 2024: 6.05, 2025: 2.80,
2026: 5.18), which is why it is reported as two multi-year blocks and not a line.

**The spread, not a trend.** Cohort medians swing between 1.7 years (2015) and 6.3
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
it is (entry 11 now does).

**Regenerated 2026-11-07 (gap 8.2).** Cards: `work/2026-11-01-research/stages/8.2-DURATION.md` (main), and `CARD_8.2.md` with `durations.py`, an independent cross-check by a second script. Both reproduce every figure above exactly on the committed file (pulled 2026-10-13).

- **Same universe, 2026-11-02 pull:** 1,064 decided in 2008–2018; median 4.57 y, mean 4.40, upper quartile 6.29, 34.5% over six years, slowest cohort 2017 at 6.26 y. The change comes from 201 appeals newly carrying the भ्रष्टाचार case type, not from new decisions.
- **Origin universe** (`APPEALS_MASTER.csv`, the one entry 8 uses; 4,430 appeals), fixed window 2008–2018: 1,521 registered and 1,407 with an NGM verdict date. **Median 3.77 y, 28.3% over six years; Kaplan–Meier median, counting the undecided, 4.10 y.** Reproduced by both scripts. The keyword selection overstated the wait, because the appeals it missed (fake certificate, bribery and others) are decided faster. The fixed window is used because the 85%-settled rule is brittle on this universe: it swings the median between 3.78 and 4.58 y.
- **One judgment moves the keyword headline.** 87 dockets of one forest-felling trial (`069-CR-0025`), all registered in 2017 and all decided on 2023-06-05, are what make 2017 the "slowest intake".
- **Censoring by cohort (Kaplan–Meier, origin universe):** 3.76 y for appeals registered 2013–2017 and **5.46 y for 2018–2020**.

*Corrected 2026-11-07 (Day 5 verification, `verify/VERIFY.md` E6b.17, E6b.R02, E6b.R12, D9).* (1) The fastest settled cohort is 2015 at 1.71 years, not 2009 at 1.9: 2009 is 3.03 years (n=27) on the committed file; 1.9 is its value in the origin universe. (2) The committed duration file was pulled on 2026-10-13 (git 70e3e27), not 2026-10-08; 2026-10-08 is the refresh of the other court files. The figures are unaffected. (3) The Kaplan–Meier median for 2013–2017 is 3.76 years. `durations.py` printed 3.77 because it tests S(t) ≤ 0.5 in floating point and skips the step where S is exactly 0.5.
- **Who appealed** (2008–2018): appeals by convicted individuals take a median of 4.23 y (Kaplan–Meier 4.66), the government's 2.13 y (2.37).

---

## 6c. The screening figure this site used to get wrong

| | |
|---|---|
| **Stage** | Screening (stage 2 of the route figure) |
| **Where** | Highlights tab, the complaint-route figure |
| **Confidence** | Established for FY2081/82 · a 13-year series, FY2069/70–2081/82, is in `work/2026-11-01-research/stages/1-3-SCREENING.md` |
| **Gap type** | **A→B.** (A) The CIAA reports screening and preliminary inquiry as one column in all 13 reports, and gives no reason for any complaint filed away at this stage (checked at source, `stages/1-3-SCREENING.md`). (B) This research cannot separate the two stages or say why the share moves. |

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
2 and 3 together and the site says so. Every report from FY2069/70 to FY2081/82 prints
the same table, and each year reconciles to its own disposed and carried-forward totals,
so a series exists (`stages/1-3-SCREENING.md`). `to_investigation` (927,
sent) and `investigations_completed` (947, finished) are different events in the same
year and must never be differenced.

*Corrected 2026-11-07 (Day 5 verification, `verify/VERIFY.md` E6c.08, D5, D12).* This said
only the 35th report publishes the table in a form that parses, so there is no series. All
13 reports print it as a table, and the 13-year series is in `stages/1-3-SCREENING.md`.

---

## 7. A bench's conviction rate cannot be checked against review

| | |
|---|---|
| **Stage** | Court outcomes |
| **Where** | Court outcomes tab, after the per-justice chart |
| **Confidence** | Established as a gap — the measurement itself is **not currently possible** |
| **Gap type** | **B.** The block is in this project's own published data: `dataset/appeals.csv` is an aggregate, and the rebuilt per-appeal links (entry 8) have not yet been joined to benches. Whether the court's public record carries the trial number on each appeal has not been checked at source, so this is not labelled A. |

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

*Changed 2026-11-07: gap-type label added (board rule, PLAN.md decision 13). No figure changed; the Day 5 recomputation found no mismatch in this entry.*

---

## 8. What the Supreme Court does to Special Court verdicts: the appeal links rebuilt from documents

| | |
|---|---|
| **Stage** | Appeals |
| **Where** | Not yet on the site. The Appeals tab currently shows the 2026-09 mapping's figure (36.6% / 1.1%), which this entry confirms and extends. |
| **Confidence** | Established (the asymmetry, per trial) · Suggestive (the per-appellant rate, see below) |
| **Gap type** | **B, with one A→B input.** The rates rest on this project's own links (graded, probabilistic) and on NGM's coverage of older trials; those limits are ours. The one institutional gap that limits them, incomplete party lists on the court's own page (first-named only for many 2069–2072 trials; long lists cut at 40–50 names in any year), is entry 12 (A→B); NGM's 500-character cut on top of it is ours (B). |

**Question.** When a Special Court corruption verdict is appealed, how often does the Supreme Court overturn it, and does that depend on who appealed?

**Source.**

- NGM Supreme Court and Special Court records (read-only replica, 2026-11-01).
- The Special Court's own judgments: 2,664 texts, archived locally in `work/2026-11-01-research/special-judgments/` with a sha256 manifest.
- Supreme Court judgment texts and public case pages (supremecourt.gov.np).
- CIAA press-release attachments listing its appeals (the parallel `link-confidence/` audit).

Working folder: `jawafdehi-meta/work/2026-11-01-research/appeal-linking/`. The one table is `APPEALS_MASTER.csv`; the figures come from `master_rates.py`.

**Method.**

**1. Universe by origin, not keyword.** 4,430 Supreme Court appeals of Special Court corruption cases. Selecting by the word भ्रष्टाचार missed 258 already-mapped appeals filed under other case types (fake certificate, money laundering, embezzlement) and two spelling variants. Those appeals are almost all lost by the person appealing, so the narrow selection inflates the individuals' reversal rate: 43.0% (178 of 414 trials) on the current table, against 40.6% on the origin universe (`verify/verify_entry8.py`). (It was 44.6% on the older link set where it was first measured.)

**2. Each appeal linked to its trial by tested rules.** No rule was used before its accuracy was measured on appeals whose trial was already known.

| rule | measured precision |
|---|---|
| Supreme Court judgment cites the trial | 96% agreement with the mapping |
| names + date window | 98% |
| "heard together" groups on the court's case page | 97–98% |
| full Special Court judgment, ≥2 appellants named | 99.5% |
| full Special Court judgment, sole judgment naming the appellant | 98.2% |
| full judgment + ≥2 co-heard appeals | 98.6% |

The full Special Court judgments matter because, for trials registered 2069–2072, the court website often records only the first-named defendant (a source limitation NGM inherits). One trial lists 31 defendants against 87 appeal dockets. *Qualified 2026-11-07 by entry 12: the court page lists only the first-named defendant mainly for trials registered 2069–2072, and cuts every list at about 40–50 names in any year; NGM then keeps only the first 500 characters (`069-CR-0025`: 47 names on the court page, 31 in NGM).*

**3. Errors found and corrected.**

- A same-person swap (Madan Prasad Gupta, convicted in 6 trials).
- 17 links contradicted by the CIAA appeal register and confirmed by the full judgment; 23 same-day sibling trials recorded as sets.
- 10 of the 2026-09 mapping's 46 REVIEW links replaced.
- 3 name-based links replaced and 15 downgraded where the appellant is not named in the linked trial's judgment.

All are in `CORRECTIONS.csv` with their evidence.

**4. No review bucket.** Every appeal ends as firm (3,304), probable (331), a set of sibling trials (69), or unlinkable with a recorded reason (726), as the table stands after the link-confidence merge of 2026-11-03:

- 610: trial predates NGM's coverage;
- 81: trial not in NGM;
- 23: named equally in unrelated trials;
- 12: other (6 with no named parties, 5 not from the Special Court, 1 not attempted).

**5. Outcomes.** NGM's `verdict_type`. For 160 appeals the court portal shows as decided but NGM leaves blank, the outcome comes from the portal's judgment row (`portal_outcomes.csv`). Only final outcomes count as decided; referrals to a full or special bench and adjournments do not.

**Result.** Trials registered 2069/70–2082/83, firm links, final outcomes; `APPEALS_MASTER.csv` as it stands (rewritten 2026-11-03 10:42 UTC). **Corrected 2026-11-02:** each side is counted only against the verdict it can overturn: individuals against convictions, the government against acquittals (`work/2026-11-01-research/headline/`). The earlier pooled figures (40.2% / 2.0%) mixed in government appeals against convictions and person appeals linked to acquittals.

| appealed by | against | unit | decided | ≥1 full reversal | rate |
|---|---|---|---:|---:|---:|
| convicted individual | conviction | trial | 567 | 230 | **40.6%** |
| CIAA / government | acquittal | trial | 420 | 4 | **1.0%** |
| CIAA / government | conviction (seeking more) | trial | 167 | 8 | 4.8% (separate) |
| convicted individual | conviction | appellant | 925 | 418 | 45.2% (mass trials dominate; secondary only; distinct appeal dockets in `headline/data/label_check.csv`, written by `label_check.py`) |

Robust to link grade, outcome source and mass trials (38.6–40.9% vs 0.5–1.1%). Checked against the judgments' own closing orders: 183 of 185 readable "reversed" trials order at least one acquittal. Of 277 readable judgments on government appeals against acquittals (277 trials), 276 uphold the acquittal and one partly reverses it (`076-CR-1505`, which NGM labels partly reversed); none fully reverses it. On the 2026-09 mapping alone, the pooled code gives 36.4% / 1.1%, the site's 36.6% / 1.1% to within two appeals of label drift.

**Verification.** Every rule's precision was measured on held-out known links before use. The 2026-09 mapping was audited against the full judgments: 1,568 of 1,598 checkable links (98.1%) name the appellant in the linked trial. The rate tables were recomputed from `APPEALS_MASTER.csv` alone.

**Why it matters.** It is the clearest single fact about what happens after a conviction. Roughly two in five convictions that an individual appeals lose at least one defendant at the Supreme Court. Acquittals the CIAA appeals almost never turn into convictions.

**What it cannot establish.**

- **The unit changes the number.** Per appellant, mass trials dominate. In one irregular forest-felling trial (`069-CR-0025`) 86 appellants were all reversed. The per-trial figure is the headline; the per-appellant figure is quoted only with that caveat.
- **2,022 of the 4,430 appeals have no final outcome** (1,890 were shown as pending on the court's case pages when fetched on 2026-11-02/03; the rest are referred to a larger bench, adjourned, or lack a record). Rates describe decided appeals only. The undecided are not a random subset: older and harder cases decide later.
- **A reversal is not innocence.** It can rest on procedure, evidence or the limitation period. This measures outcomes, not why.
- **Destroyed files.** 1,440 corruption appeals pending on 9 Sep 2025 are flagged by the court as having had their file destroyed in the arson. Their eventual outcomes may differ, which is covered separately in `work/2026-11-02-destroyed-files/`.
- **Links are probabilistic.** Firm rules run 97–99.5% precise, so a few dozen of 3,304 firm links are expected to be wrong. Grades travel with every link.

*Corrected 2026-11-07 (Day 5 verification, `verify/VERIFY.md` HL1.01–HL1.03, HL1.09, HL1.18, E8.02, E8.04, E8.08, E8.09, E8.11, E8.15, E8.17; PLAN.md decision 17).* The rates were regenerated on the appeal table as it stands. It was rewritten on 2026-11-03, after the figures were first generated on 2026-11-02. Superseded: 230/565 = 40.7%, 4/423 = 0.9%, 8/168, per appellant 868/403 = 46.4%, robustness 38.7–41.0%, link grades 2,806 / 838 / 62 / 725 (11 other). The method did not change, and the headline holds. Also corrected: 4,430 appeals, not 4,431 (the old count included the header line); 1,890 pending, not 1,821 (the master's status column is blank for 69 pending appeals); 31 defendants on the record for `069-CR-0025`, not 32; and the label check, which said all 276 readable government-appeal judgments uphold the acquittal. 276 was the number of trials, not judgments, and one judgment partly reverses.

---

## 9. About one Special Court acquittal in five has no government appeal on record

| | |
|---|---|
| **Stage** | Appeal lodged (the CIAA's decision whether to appeal) |
| **Where** | Not yet on the site. Complements entry 4, which counts the CIAA's decisions but has no denominator. |
| **Confidence** | Established (the count, by validated evidence rules) · Suggestive (the offence and size pattern) |
| **Gap type** | **A→B.** (A) No case-level record of a decision not to appeal is published: no case number and no reason (CIAA annual reports FY2075/76–2081/82, entry 4, checked at source). (B) So this research has to infer "not appealed" from the absence of an appeal, which NGM's coverage and the register's 2022–2026 span limit (below). |

**Question.** Of Special Court acquittals, how many did the government not appeal?

**Source and method.** 1,067 trials in the window whose single court-published verdict is सफाई (NGM replica, 2026-11-02). An acquittal counts as appealed if any of three sources shows it:
- a government appeal linked in `APPEALS_MASTER.csv` as it stands (764);
- the CIAA's own appeal register (10 more);
- a reverse search of all 33,342 Supreme Court `-CR-` dockets for a government appeal naming the trial's defendants, registered within 730 days of the verdict (9 more). On the known cases this rule finds 96% of the real appeals (732 of 764), and 99.1% of what it finds is right (737 of 744).

57 verdicts too recent to judge are set aside. Folder: `work/2026-11-01-research/headline/` (`FINDINGS.md`, scripts listed in its `README.md`).

**Result.** About one acquittal in five: **219 of 1,010 judgeable acquittals (21.7%) have no government appeal in any source**; counting only the trials the CIAA filed, **211 of 979 (21.6%)**. 8 more have only a weak match. They are concentrated:
- **by offence:** fake credential 75% (42 of 56);
- **by amount:** no बिगो claimed 37%, against 0 of 10 at Rs 10 crore or more;
- **by trial size:** single-defendant trials 29%, against 11% at six or more defendants.

The बिगो claimed in the 219 charge sheets is Rs 48.9 crore (141 of them carry an amount). For verdicts of FY2075/76–2081/82 the method finds 154 unappealed acquittals, against the CIAA's own 327 decisions not to appeal (all verdict kinds, by decision year): consistent, not identical.

**Why it matters.** It gives entry 4 a denominator. With entry 8 (the government wins 1.0% of its appeals against acquittals), it shows an acquittal at the Special Court is in practice final.

**What it cannot establish.**
- "No appeal found" is not proof of no appeal (NGM coverage of Supreme Court dockets; the register covers only 2022–2026).
- Not appealing can be correct; eight of these judgments are in the legal check (stratum F).
- No reason is recorded for any decision not to appeal.

**Superseded:** "314 of 1,067 (29.4%)" (2026-11-02 draft) used only the linked appeals and counted recent verdicts as unappealed.

*Corrected 2026-11-07 (Day 5 verification, `verify/VERIFY.md` HL2.02–HL2.19, D4; PLAN.md decision 17).* Regenerated on the appeal table as it stands, which was rewritten on 2026-11-03 after these figures were first generated. 12 acquittals gained a linked government appeal and one (`079-CR-0006`) lost it. Superseded: 225 of 1,009 (22.3%), sources 753 / 14 / 9, 58 too recent, six-or-more defendants 13%, Rs 53.8 crore (146 with an amount), 159 in FY2075/76–2081/82. Added: the CIAA-filed-only figure. 8 of the 219 and 31 of the 1,010 are not CIAA-filed: money laundering, other agencies' cases and निर्णय बदर petitions. The headline, about one in five, does not change.

---

## 10. The courts publish a fine ledger every year, but not for corruption, and "disposed" is not cash

| | |
|---|---|
| **Stage** | Judgment execution and recovery (stage 9) |
| **Where** | Not yet on the site. Corrects the site's claim that no institution reports what is recovered. |
| **Confidence** | **Established**: the all-case fine and imprisonment ledger, FY2075/76–2081/82. **Suggestive**: that the jump after FY2079/80 comes from one or two courts' one-off disposals. **Hypothesis**: any recovery rate for corruption judgments (published by no one) and the 1.6% government-बिगो figure (press only). |
| **Gap type** | **A→B.** **A:** the courts publish no fine, बिगो or confiscation ledger for corruption judgments, and do not split "disposed" into cash, imprisonment in lieu and write-off; checked at source in all seven annual reports and the CIAA reports. **B (its effect on us):** no recovery rate for corruption judgments can be computed (see Limitations). **B (our own limits):** the 1.6% बिगो figure is from the press, not a primary table; the ledger's breaks between years are the source's own defect, reported as found. |

**Question.** After a court orders a fine, बिगो or imprisonment, how much is collected or served? Does any institution publish this, and does it break out corruption cases?

**Source.** The Supreme Court annual report (सर्वोच्च अदालत वार्षिक प्रतिवेदन, supremecourt.gov.np/web/yearlyreps), FY2075/76–2081/82: the prose section and summary table 1.16 on judgment execution, and Appendix 65(क) (fines) and 65(ख) (imprisonment), which list each district court's opening balance, new entries, total, disposals and remainder. Downloaded with sha256 in `work/2026-11-01-research/recovery/sources/`; parsed by `recovery/extract.py` → `recovery/series.csv`. Source map: `recovery/SOURCES.md`.

**Method.** Every Appendix 65(क) row parsed; the grand-total row must equal the figures printed in the prose or summary table, to the paisa, in all seven years. Opening + new = total, disposed + remaining = total, and each year's opening against the previous year's closing are tested. Shares are recomputed from rupee amounts.

**Result.** All case types, all 77 district courts:

| FY | Fine ledger | Disposed | Share | Remaining | Imprisonment served |
|---|---:|---:|---:|---:|---:|
| 2075/76 | Rs 15.825 bn | 3.922 bn | 24.78% | 11.903 bn | 33.49% |
| 2076/77 | 16.992 bn | 2.515 bn | 14.80% | 14.477 bn | 26.55% |
| 2077/78 | 18.223 bn | 1.912 bn | 10.49% | 16.312 bn | 29.27% |
| 2078/79 | 20.032 bn | 2.284 bn | 11.40% | 17.748 bn | 31.64% |
| 2079/80 | 21.734 bn | 2.336 bn | 10.75% | 19.398 bn | 29.68% |
| 2080/81 | 44.503 bn | 12.384 bn | 27.83% (recomputed; not printed) | 32.120 bn | 33.19% (recomputed) |
| 2081/82 | 46.526 bn | 14.686 bn | 31.56% | 31.839 bn | 31.54% |

The press figure "31.6% of fines recovered in FY2081/82" is the Supreme Court's own number and is verified.

**The headline rate turns on one or two courts.** Kathmandu District Court, where Special Court fines are sent for ledgering, collected 4.5–5.8% a year in FY2077/78–2079/80. In FY2080/81 it added Rs 9.569 bn of new entries and disposed of Rs 9.511 bn in the same year: 38% of all new entries nationally and 77% of all disposals. In FY2081/82, Kathmandu and Syangja account for 78% of all disposals; Syangja disposed of Rs 4.118 bn of a Rs 4.296 bn ledger. The other district courts, without those two, disposed of:

| FY | other district courts' share |
|---|---:|
| 2075/76 | 29.95% |
| 2076/77 | 16.84% |
| 2077/78 | 16.14% |
| 2078/79 | 16.17% |
| 2079/80 | 14.62% |
| 2080/81 | **11.06%** |
| 2081/82 | 23.26%; **11.76%** also without Syangja |

The national jump after FY2079/80 is therefore not a rise in collection across the courts. Outside the one or two courts with large one-off disposals, the share disposed **fell**, from about 16% to about 11–12%.

*Corrected 2026-11-07 (JAW-17).* The draft card set the FY2080/81 rate without Kathmandu (11.06%) beside the national rate with Kathmandu for FY2077/78–2079/80 (10.5–11.4%), and called them "the same level". On a like-for-like basis, without Kathmandu, those years were 14.6–16.2% (`recovery/series.csv`, `other_courts_fine_disposed_pct_recomputed`).

**"Disposed" is not "collected".** One breakdown exists, in the FY2075/76 report (p55), and only for that year's special execution campaign: of Rs 397.4 m of fines disposed, Rs 69.7 m (**17.5%**) was cash; Rs 327.7 m was imprisonment served in lieu of payment. A ledger entry can also be written off (लगत कट्टा) on acquittal on appeal, death or old age. No other year divides disposals by type.

**Verification and the source's own defects.** The grand totals reconcile with the printed figures in all seven years. But the ledger is not continuous: the opening balance differs from the previous year's closing balance every year, by up to **+Rs 409.5 m** (FY2078/79) and −Rs 204.6 m (FY2079/80). FY2075/76's printed total is off by Rs 562,000 against opening + new. FY2081/82's imprisonment served + outstanding exceeds the printed total by about 265.6 years.

**Corruption: not published by anyone.** Appendix 65 is by district court only, never by case type. Neither the Special Court section nor its appendices report a fine, बिगो or confiscation ledger. The CIAA's annual reports FY2069/70–2081/82 carry no judgment-execution table; their "असुलउपर" figures are administrative recoveries before trial. The CIAA's charge sheets demanded Rs 40.75 bn of बिगो over ten years (`dataset/ciaa_bigo_demanded.csv`); no public document says how much a court ordered or was then collected. The only government-बिगो figure is in the press (Ratopati, 26 Asar 2083; Naya Patrika, 8 Shrawan 2083), attributed to the Judgment Execution Directorate, for FY2082/83 to end-Jestha: a ledger of Rs 2.3732 bn, of which **1.60%** was recovered. The Directorate's website publishes no statistics. The request for the primary table is in `stages/RTI.md`.

**Why it matters.** The site's statement that nobody reports recovery is wrong as stated and must be corrected. The leak is real and narrower in evidence than it looks: Rs 31.8 bn of fines and about 121,000 years of imprisonment were outstanding at the end of FY2081/82, across all case types; for corruption specifically, the last stage of accountability is unmeasured.

**What it cannot establish.**
- Any recovery rate for corruption judgments.
- Whether the FY2080/81–2081/82 jump is cash, imprisonment in lieu, or write-offs.
- A flow by year of judgment: ledger and disposals are cumulative stocks that include arrears going back decades, so the share is not "of fines imposed this year, X% was paid".
- Anything about confiscated assets.

---

## 11. Why appeals take years: three listings in four end without the appeal being taken up

| | |
|---|---|
| **Stage** | Appeal decided (stage 8) |
| **Where** | Not yet on the site. Explains entry 6b. |
| **Confidence** | **Established**: the shares, read from the court's own status codes. **Suggestive**: that court capacity, not the parties, is the main cause. **Not measured**: why a bench "cannot hear" a case, or how long each day's list was. |
| **Gap type** | **A.** The Supreme Court lists appeals that its benches do not take up, and records no reason when a bench "cannot hear" one. Read from the court's own public case pages. **B (our limits):** pages cover appeals numbered `070-CR-` onward only, and the listing history is taken as published. |

**Question.** Entry 6b shows a corruption appeal takes about four and a half years. Where does the time go?

**Source and method.** The Supreme Court's public case page for each appeal records every cause-list listing: date, bench and the court's status code. The pages were cached on 2026-11-02 and 2026-11-03 in `work/2026-11-01-research/appeal-linking/sc_detail/`; the analysis is `stages/hearings.py` and the card `stages/CARD_8.3.md`. The universe is the appeals in `APPEALS_MASTER.csv` numbered `070-CR-` onward: 3,733 of 3,747 (99.6%) have a page, with **27,873 listings**. Earlier numbers are excluded, because only selected samples of them were fetched. Each listing is classed by the court's code:
- not reached: हेर्न नभ्याइने;
- bench cannot hear: हेर्न नमिल्ने;
- no bench sat: बेन्च नबसेको;
- adjourned: स्थगीत;
- taken up: decided, an order, part-heard, or reserved.

**Result.**
- **77.1% of listings were not taken up** (21,476 of 27,855):
  - not reached, **40.5%**;
  - adjourned, 18.9%;
  - bench cannot hear, 14.3%;
  - no bench sat, 3.0%;
  - judgment date moved, 0.3%.

  The court-side codes together are **58.2%**. Of the adjournments, 78.9% were requested by a party or its lawyer (the record often does not say which side), 9.0% were for a linked case and 5.9% were requested by the government attorney's office.
- **A decided appeal** (1,843): a median of **8 listings**, of which 6 were not taken up. 78.1% of all listings before a decision were wasted; only 8.6% of appeals were decided without one. Median times:
  - 8.4 months from registration to the first listing;
  - 36.9 months from the first listing to the decision;
  - **2.0 months between listings**.

  Each listing that is not taken up typically costs about two months.
- **Who appealed.** Individuals' appeals were listed a median of 12 times before a decision, the government's 4 times. The wasted share is similar (78.9% vs 75.2%).
- **The mix changed.** Adjournments were 22–40% of listings in FY2072/73–2078/79 and 6–10% in FY2079/80–2081/82. They rose again to 12.0% in FY2082/83 and 23.7% in the part-year FY2083/84. "Not reached" rose to 50–56% in FY2079/80–2080/81.
- **Never heard.** Of the 1,890 appeals pending on the court's pages, **730 (38.6%) have never been listed**: 235 registered in 2081, 340 in 2082, 141 in 2083 and 14 earlier. 466 of them were registered more than 12 months before the fetch, and the median is 15.7 months. 459 of the 730 carry the arson "file destroyed" flag, which is covered separately (gap 8.4). *Corrected 2026-11-07 (Day 5, D2):* this line said 1,821 running and 725 never listed. That count used the appeal table's portal-status column, which is blank for 69 appeals whose page says चलिरहेको; the figures are now taken from the pages themselves (`stages/8.3-HEARINGS.md`).

**Verification.** The portal's decision dates equal NGM's verdict dates to the day for all 1,669 appeals that carry both. Deduplicating appeals heard together (1,437 distinct hearing lists) gives 78.1% not taken up, against 77.1%.

**Why it matters.** It answers "why years". The hearings are not long. About three listings in four do not become hearings, and each costs about two months. Most of the lost listings are on the court's side: the bench did not reach the case, could not hear it, or did not sit.

**What it cannot establish.**
- Why a bench "cannot hear" a case: no reason is recorded.
- How many cases each bench was given per day, or how many benches sat.
- Whether an adjournment request was justified.
- Whether the portal's listing history is complete. The decision dates check out; earlier rows cannot be checked.

---

## 12. Long party lists are cut twice: on the court's own page, then again in NGM

| | |
|---|---|
| **Stage** | Special Court trial (stage 6) |
| **Where** | Not on the site. Qualifies the source-limitation statement in entry 8 and item 5 of "What would most improve this research". |
| **Confidence** | **Established**: both length cuts (every trial that could hit them was checked against the court page) and "first-named only" on the court page for trials registered 2069–2072 (hand-checked). **Suggestive**: court-page shortfalls in trials registered 2073 onward (mostly parser-only, spot checks mixed). **Not here**: the overall rate across all trials, which comes from the JAW-15 judgment parser (`stages/partylists/`). |
| **Gap type** | **A** and **B**, each checked at the Special Court's own public case page (fetched 2026-11-07, `stages/sp_detail/`). **A:** the court page lists only the first-named defendant (mostly 2069–2072 trials), and cuts every long list at about 1,970 bytes (40–52 names). **B:** NGM keeps only the first 500 characters of the page's defendant list. Effect on this research (**A→B**): per-person counts from NGM undercount early trials and every mass trial. |

**Question.** It has been stated (entry 8, `appeal-linking/README.md`) that the court website, and so NGM, records only part of each trial's party list. Where is the list cut: on the court's own page, or inside NGM?

**Source and method.**
- **Trials checked (148).** Every trial where a judgment parser (`stages/rosters.py` with its hand check `rosters_check.csv`, or the JAW-15 parser `stages/partylists/`, frozen as `stages/sp_detail/trials_frozen_2026-11-07.csv`) finds more defendants in the judgment than NGM holds. Also every trial whose NGM defendant names join to 440 characters or more.
- **Three counts per trial:** the judgment, the court's public case page (the page NGM scrapes), and NGM (`snapshot/2026-11-02/entities.csv`, distinct names). The analysis is `stages/partylists_source.py`; the card is `stages/CARD_6.3.md`. Parser-only shortfalls were spot-checked against the judgment text (`stages/partylists_source_spotcheck.csv`).

**Result.**

| mechanism | gap type | trials | defendants left out |
|---|---|---:|---:|
| Court page lists only some defendants, often the first-named only | A | 103 (84 registered 2069–2072) | 147 in the 24 hand-checked |
| Court page cuts the list at ~1,970 bytes (40–52 names) | A | 11 | 638 in the 8 with a judgment count |
| NGM keeps the first 500 characters of the page's list | B | 16 | 151 |
| NGM holds the full list although the page is cut (entity-linked) | — | 3 | 0 |

- **First-named only (A).** 71 of the 84 trials registered 2069–2072 show one name on the court page, often in the court's own form "X समेत N" ("X and N others"), e.g. `071-CR-0028` "रामदत्त भट्ट समेत ३३" against 33 in the judgment. Every hand-checked or spot-checked case of this kind is real. For trials registered 2073 onward there are 19 such trials, 18 resting only on a parser. 2 are confirmed (`075-CR-0195`, 7 in the judgment and 1 on the page; `075-CR-0285`, 10 and 9), and 2 of the 4 spot-checked are parser over-counts.
- **The court page's length cut (A).** The defendant list on the court page stops at 1,966–1,982 bytes, whatever the trial's size. All 11 are mass trials registered between 2069 and 2082, so this is **not** an early-trial problem. Examples: `076-CR-0270`, 173 in the judgment and 40 on the page; `080-CR-0098`, 245 and 46.
- **NGM's own cut (B).** In 15 trials the court page has more names than NGM. In every one, NGM's list stops at exactly 499–500 characters (names joined with ", "), often mid-name, losing 151 names. One more trial is short by one name with no length cause. NGM's cut hits trials whose court page is complete (`079-CR-0044`, 37 on the page and 33 in NGM). It also stacks on the court's cut: `076-CR-0270` goes from 173 to 40 to 25.
- **Curated exceptions.** For `080-CR-0098`, `080-CR-0111` and `080-CR-0112`, NGM holds the full list from the judgment (248, 185 and 172), every name linked to a Jawafdehi entity.

**Why it matters.** It corrects a limitation this research had been stating both too broadly and too narrowly. Short lists of a few names are mostly a 2069–2072 problem. Lists of more than about 40 defendants are cut in every year, first by the court and then by NGM. One of the three mechanisms is ours and fixable without the court: re-scrape the full defendant list.

**What it cannot establish.**
- The overall share of trials with a short list. That figure comes from the JAW-15 parser.
- Trials no parser flags (no countable party block, or no judgment text). A first-named-only page there would not be caught.
- Court-page shortfalls in trials registered 2073 onward, beyond the two confirmed.
- Whether NGM's 500-character cut is in the scraper or the database column. Either way it is a limit of ours (B).

*Corrected 2026-11-07 (Day 5 verification, `verify/VERIFY.md` E8.17).* NGM holds 31 defendants for `069-CR-0025`, not 32. *Rewritten 2026-11-07 (JAW-17) after the source check.* The earlier title, "incomplete for early trials, not in general", was wrong for large trials. Its count (25 of 1,015 parsed trials, 13.8% for 2069–2072) covered only trials with a countable opening block, and missed most large trials. `069-CR-0025` (31 in NGM against about 87 appellants) is cut by both: 47 names on the court page, then NGM's 500 characters.

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
| Repeat defendants: 779 names appear in more than one case, 38 in five or more (*corrected 2026-11-07, `verify/VERIFY.md` T.01–T.02: 781 and 40 counted the prosecutor's names, नेपाल सरकार and अ.दु.अ.आ., as repeat defendants*) | Identity resolution covers ~5% of rows. Nepali names collide heavily, so a name-matched "repeat offender" count would be a guess presented as a measurement. |
| Special Court backlog | Measured and found to be *small*: 2,870 of 2,949 cases decided, 79 pending, 77 of them registered in the last two fiscal years (FY2081/82–2082/83); the other 2 are FY2072/73 cases with a blank status (*corrected 2026-11-07, `verify/VERIFY.md` T.05: this said 75*). Does not support a backlog finding; the delay in this system is not at trial. Worth saying somewhere eventually. |
| Extending the CIAA series before FY2073/74 | FY2069/70–2071/72 report the same material as a subject-area cross-tab with different row labels; FY2072/73 is absent from its own report and the annex claiming to carry it reproduces FY2073/74's totals. Recorded in `extract_ciaa_series.KNOWN_GAPS`. |
| Per-defendant appeal outcomes | The aggregate appeal table is case-grain only. Entry 8 now gives a per-appellant rate from the rebuilt links, but it is dominated by a few mass trials, so it is reported only beside the per-trial figure, never alone. |

---

## What would most improve this research

Each item is tagged with its gap type: **A** institutional, **B** a limit of this research,
**A→B** both (see the top of this file).

1. **[A→B] A per-defendant outcome field on the court record.** (A) The court record gives
   one verdict per docket (entry 2; label provisional until entry 2 is reframed). (B) Would
   convert 9,552 accusations into a countable population of people and make a genuine
   per-person conviction rate possible for the first time. This is the single
   highest-value gap.
2. **[A→B] A reason recorded against each तामेली decision**, and a count of closures later
   reopened. (A) The FY2081/82 report gives two group grounds for its 794 closures and no
   report counts reopened closures (entry 1). (B) Without either, the largest shift in the
   pipeline cannot be interpreted.
3. **[A→B] A count of verdicts eligible for appeal each year.** (A) The CIAA's reports give
   judgments received, split by verdict in some years only (entry 4). (B) Would turn the
   appeal/decline column into a rate.
4. **[B] Authenticated access to `ngm_query_judicial`.** Case-level Supreme Court records
   would allow trial→appeal linkage to be rebuilt from the register rather than curated
   by hand, which is what currently caps the appeals analysis. *Partly addressed (entry 8):
   the links were rebuilt from the Special Court judgments and CIAA registers, but they live
   in a CSV. Writing them into NGM (`work/2026-11-01-research/ngm-update/PLAN.md`) would make
   them reproducible from the database.*
5. **Complete party lists.** *Measured at the source (entry 12).* Split by type:
   - **[A] At the source.** The Special Court's own case page often lists only the
     first-named defendant for trials registered 2069–2072 (84 of 103 such trials found),
     and cuts every list at about 1,970 bytes (40–52 names) in any year (11 mass trials).
   - **[B] In our pipeline.** NGM keeps only the first 500 characters of the page's
     defendant list (15 trials, 151 names). Fix: re-scrape the full list. Still open on our
     side: party lists parsed from the judgments written into NGM (as was done by hand for
     `080-CR-0098`, `-0111`, `-0112`).
6. **[B] NGM's Supreme Court outcome enrichment re-run** for the 238 appeals whose court page
   says फैसला (decided) but which have no verdict date in NGM. 160 of them already take
   their outcome from the portal in `APPEALS_MASTER.csv`, 107 of those a final one
   (`appeal-linking/portal_outcomes.csv`; `verify/VERIFY.md` D3). The court publishes the
   decision; the gap is in the data this research uses.

*Corrected 2026-11-07 (Day 5 verification).* Gap types added to every item; item 3 now
reflects that the CIAA does print judgments received (`verify/VERIFY.md` D8); item 5 split
into its institutional and pipeline parts; item 6 updated from 160 to the 238 appeals
found by the page-level check (D3; both counts are right on their own definitions).
