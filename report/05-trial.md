# Stage 6: the Special Court trial

The Special Court tries the cases the CIAA files. Its case records are published on the Supreme Court's website. The trial stage is not where cases wait: of 2,949 corruption cases registered FY2069/70–2082/83, 79 were pending, 77 of them registered in the last two fiscal years (court record, 2026-11-02). The leaks at this stage are in what the public record says about the outcome.

## From the court's public website, nobody can tell which defendants in a case were convicted and which were cleared

The Special Court's case page gives one outcome for the whole case: guilty, partly guilty (आंशिक ठहर) or acquitted. When a case is "partly guilty", the page does not say which defendants were convicted and which were cleared. Only the full written judgment says so. The judgment sits on a separate page behind a CAPTCHA, as a long Nepali legal text, and some judgments have not been uploaded at all. About a third of everyone the CIAA prosecutes (34.3% of defendant entries) is in a partly-guilty case.

**Gap type: A→B.** (A) The court's public case page gives one outcome for a whole case and none for each defendant. Checked on the court's own pages on 2026-11-07, 19:53–20:05 UTC, for five partly-upheld cases. (B) As a result, this research cannot give a conviction rate for each person.

**What a member of the public sees** (checked 2026-11-07):
- **The case page** (Special Court → "CASE PROCESS STATUS"). Opened for five partly-upheld cases: 070-CR-0016, 070-CR-0158, 074-CR-0025, 076-CR-0270 and 078-CR-0085. Every page shows a single status, "फैसला / आंशिक ठहर". None shows an outcome for any defendant, and none links to the judgment. 070-CR-0158, for example, lists about 30 defendants and one outcome.
- **The full judgment** ("फैसला / आदेश को पुर्ण पाठ"). The reader chooses the court, types the case number and solves a CAPTCHA. Four of the five judgments are there, and each names who was convicted and who was cleared, inside a text of up to about 180,000 characters.
- **The missing judgment.** For 076-CR-0270, decided on 2080/11/03, the page still showed "फैसला अपलोड हुन बाँकी" (judgment not yet uploaded), more than two and a half years later.
- **The "DECIDED CASES" page.** It says judgments can be viewed and downloaded there. It returned no rows for any query tried.

**Key figures** (unit: decided cases and defendant entries, not identified people; source: the court record as published, held in this project's copy of 2026-11-02; each defendant entry joined to its case's single published verdict, institutions removed):

| Outcome for the whole case | Cases | Share of cases | Defendant entries | Share of defendant entries |
|---|---:|---:|---:|---:|
| Upheld in full (ठहर) | 1,239 | 45.0% | 1,975 | 22.3% |
| Upheld in part (आंशिक ठहर) | 450 | 16.3% | 3,038 | 34.3% |
| Acquitted (सफाई) | 1,065 | 38.7% | 3,833 | 43.3% |

- 8,846 defendant entries across 2,754 decided cases, from 1 to 249 in a single case.
- 45% of cases end in full conviction, but those cases hold only 22% of the people charged. They are small: about half of all cases have a single defendant.

**What this cannot establish.**
- A conviction rate for each person. Read the table only as cases and defendant entries.
- That a defendant entry is a distinct person. Only about 5% of entries carry an identity code, so someone charged twice counts twice.
- A rate of missing judgments. Five cases were checked by hand; they show what the pages look like. Whether other official sources (for example the law reports, नेपाल कानून पत्रिका) give outcomes for each defendant was not checked.
- An exact share. The defendant lists themselves are incomplete for some cases (next finding). For three of the five cases checked, the court page and this project's copy give different defendant counts (074-CR-0025: 41 against 29; 076-CR-0270: 37 against 25; 078-CR-0085: 52 against 34), so the 34.3% is if anything an undercount.
- One decided case names no defendant (070-CR-0038) and is left out: 2,754 cases here against 2,755 elsewhere.

## The court record's defendant lists are incomplete for early trials, not in general

For cases registered at the Special Court in 2069–2072, the court record often lists only the first-named defendant, sometimes with the court's own shorthand "X and N others" (X समेत N). The full list is only in the judgment. For cases registered from 2073 onward, the record's lists match the judgments in all but one of the cases counted.

**Gap type: A→B, with one B mechanism.** (A) The Special Court's own public case page lists fewer defendants than the judgment. In 87 of the 147 trials where a parser found more defendants in the judgment than this project's copy holds, the court page itself lists fewer, often only the first-named. In 3 it cuts a long list at about 2,000 bytes. Checked against the court's pages fetched on 2026-11-07. (B) The copy this research uses keeps only the first 500 characters of the page's defendant list, so in 8 of those trials it holds fewer names than the page. Effect on this research: counts of people for trials registered 2069–2072.

**Key figures** (unit: trials; source: the Special Court's full judgments against the court record held on 2026-11-02; every mismatch checked by hand):

| Trials counted | Court record leaves out at least one defendant |
|---|---:|
| All counted: 1,015 | 25 (2.5%) |
| Registered 2069–2072: 174 | 24 (13.8%) |
| Registered 2073 onward: 841 | 1 (0.1%) |

- The 25 omissions add up to at least 148 defendants. Examples: 071-CR-0028, 33 in the judgment and 1 on the record; 071-CR-0062, 15 and 1.
- In 21 of the 25 the record lists only the first-named defendant.
- Where the record lists two or more defendants it is almost always complete.
- 21 of 483 counted trials that the record lists with one defendant (4.3%) really have more.
- Of 40 trials where the judgment appeared to name more defendants than the record, 25 were confirmed by hand and 15 were counting artefacts (joint judgments, the plaintiff or an officer counted as a defendant, same-name defendants).

**What this cannot establish.**
- The 1,549 trials whose judgment has no countable opening list of defendants. They contain more trials listed with one defendant (55.4% against 47.6%), so the rate there could differ.
- Trials without a judgment text, including the largest example: one forest-felling trial (069-CR-0025) with 31 defendants on the record and 87 appeals at the Supreme Court.
- For trials outside the source check, whether a gap arises on the court website or in this project's copy of it. Where it was checked, it is mostly the court page.

## When the court acquits, it usually says the charge was not proved, or was not a crime. Sometimes it says the CIAA charged selectively

We read the court's own reasons in a random sample of 42 acquittal judgments, spread across the years since 2069/70. 31 state a ground in the part we read:
- in 13, the court said only that the evidence did not prove the charge;
- in 11, it said the act charged was not the offence charged: no loss to the state was shown (4), no bad intent was shown (4), or the CIAA charged the wrong offence or its own records contradicted the charge (3);
- in 5, it named a flaw in how the CIAA investigated or checked the facts. In three of these, the CIAA measured the work or tested the material one and a half to six years after the event;
- in 2, the 2021 ruling that money handed over in a CIAA sting cannot be used as evidence decided the case.

None of the 31 blames the trial itself.

**Selective prosecution.** We read every judgment where the words for it appear: 57 leads in 1,424 judgments. In **12**, the court itself said the CIAA had charged some people and left out others who did the same thing, or had charged those who carried out a decision but not those who made it, and relied on that in clearing defendants. In 4 more it found this but decided on other grounds. The 12 include:
- the wide-body aircraft purchase (080-CR-0145). The court wrote that charging "some and not others (pick and choose)" among the negotiating sub-committee "is discriminatory in itself and against the principle of equality";
- the Pashupatinath Jalahari gold case (080-CR-0047): "something like selective prosecution … against the principle of equality and of fair investigation";
- the Rs 10 polymer banknote case (075-CR-0134).

**Gap type: A→B, with evidence.** (A) The CIAA publishes no review of why it loses at trial, and no reason when it leaves people out of a charge sheet. A citizen can find the court's reasons only by reading each judgment. (B) The shares come from a sample of 31 judgments read by an agent, not by a lawyer. The 12 selective-prosecution judgments are a minimum, because the search can miss other wordings.

**Key figures** (unit: trials; Special Court judgments for the 1,424 acquittals and partial acquittals with a text; verdicts from the court record held on 2026-11-02):

| Ground the court gives (31 judgments read) | Trials | Where the court places the failure |
|---|---:|---|
| Evidence does not prove the charge | 13 | Not attributed |
| No bad intent / no loss / wrong offence charged | 11 | The charge |
| Flaw in the investigation, or the CIAA's check overturned at trial | 5 | CIAA investigation |
| The 2021 sting-evidence ruling | 2 | The law |
| Fault in the trial | 0 | The court |

**What this cannot establish.**
- A rate for all acquittals. Read the shares as "in the judgments we read".
- Every ground in a judgment. Only the closing reasoning was read and the main ground coded; 10 of the 42 showed no ground in the part read.
- A legal opinion. This is an agent's reading. The quoted passages are kept so a lawyer can check them.
- Judgments without a text (126 of 1,550 trials).

## Not measured here

Whether a Special Court bench's decisions hold up on appeal could not be measured with the data this research publishes. This is a limit of this research (B), described in "Limitations of this research".
