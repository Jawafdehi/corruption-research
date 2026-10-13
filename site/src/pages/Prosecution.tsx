import { useTranslation } from "react-i18next";

import { AccusedPerCase } from "@/components/research/AccusedPerCase";
import { FiledByMonth } from "@/components/research/FiledByMonth";
import { DataNote } from "@/components/research/DataNote";
import { GapCallout } from "@/components/research/GapCallout";
import { CaseLedger } from "@/components/research/CaseLedger";
import { EvidenceTimeline } from "@/components/research/EvidenceTimeline";
import { MethodComparison } from "@/components/research/MethodComparison";
import { ReadingNotes } from "@/components/research/ReadingNotes";
import { ChargeMixByYear } from "@/components/research/ChargeMixByYear";
import {
  Block,
  Body,
  Cite,
  Eyebrow,
  Figure,
  Lede,
  SectionHeading,
  StatRow,
  StatTile,
} from "@/components/layout/Prose";
import { CITATIONS, REPORT } from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

/** The one case where a bench put selective prosecution in a reasoned judgment. */
/** FY2070/71, which records two Tameli decisions taken on cash-flow reasoning — the
 *  method in use before the 2072 ruling. Pinned to the fiscal year rather than to the
 *  series, so a refreshed dataset cannot silently move a citation to another report. */
const CIAA_2070_71 =
  "https://ciaa.gov.np/uploads/publicationsAndReports/MlV2KJ.pdf";
/** नि.नं. ९४३३, नेपाल सरकार वि. हरेकृष्ण भगत — where the Supreme Court applied the
 *  check-period method and declined to engage with the cash-flow objection. */
const NKP_9433 = "https://nkp.gov.np/full_detail/8476";
/** FY2076/77, whose appeal grounds reproduce a charge sheet's own Cash Flow Chart. */
const CIAA_2076_77 =
  "https://ciaa.gov.np/uploads/publicationsAndReports/UOJL53.pdf";

const JALAHARI = {
  analysis: "https://jawafdehi.org/updates/pashupati-jalahari-selective-prosecution",
  case: "https://jawafdehi.org/case/jalahari",
};

export default function Prosecution() {
  const { t, language } = useTranslation();
  const { n, pct, pct1, fy } = useFormat();
  const { byCharge, chargeMixByYear, corpus, defendants } = REPORT;


  // Denominator preserved exactly as the original chart defined it: the sum of the
  // six mix families across all years. This is deliberately larger than the
  // substantive corpus, because unclassifiable matters stay inside `other` rather
  // than being dropped. Changing it would silently change what the chart means.
  const mixTotal = chargeMixByYear.reduce(
    (s, r) => s + r.bribery + r.fake + r.embezzlement + r.benefit + r.loss + r.other,
    0,
  );


  const cdz = REPORT.complaintDisposal[0];
  const bigoDemanded = REPORT.bigoDemanded;
  const bigoTotalBn = bigoDemanded.reduce((a, r) => a + r.rs, 0) / 1e9;

  // When in the year the Commission files. Ashadh is the last month of the Nepali
  // fiscal year, so the peak sitting there is the thing worth asking about.
  const filedByMonth = REPORT.filedByMonth;
  const peakMonth = filedByMonth.reduce((a, b) => (b.mean > a.mean ? b : a));
  const otherMonthMean =
    filedByMonth.filter((m) => m.name !== peakMonth.name).reduce((a, m) => a + m.mean, 0) /
    (filedByMonth.length - 1);

  const charge = (en: string) => byCharge.find((c) => c.en === en);

  // Average defendants and full-conviction rate per offence, joined on the offence
  // name. Both sides already count the same decided cases on the same
  // court-published-verdict rule, so the two columns share a population even though
  // one is a count of people and the other a share of cases.
  // The two ends of the table, so the reading beside it cannot drift from what the
  // rows actually show when the data is refreshed.
  const accusedRows = defendants.byCharge.map((d) => {
    const c = charge(d.en);
    const decidedForCharge = c ? c.convicted + c.partial + c.acquitted : 0;
    return {
      ...d,
      fullPct: decidedForCharge ? (c!.convicted / decidedForCharge) * 100 : 0,
    };
  });
  // Illicit enrichment, the charge whose arithmetic the courts and the Commission
  // disagree about. Decided here means a clean disposition, as everywhere else.
  // Both ends of the defendants table, derived rather than written down, so the
  // reading beside the chart cannot drift from the rows when the data is refreshed.
  const accusedExtremes = (() => {
    const withAvg = accusedRows.map((r) => ({ ...r, avg: r.cases ? r.accused / r.cases : 0 }));
    const sorted = [...withAvg].sort((a, b) => b.avg - a.avg);
    return { most: sorted[0], fewest: sorted[sorted.length - 1] };
  })();

  const ie = charge("Illicit enrichment");
  const ieDecided = ie ? ie.convicted + ie.partial + ie.acquitted : 0;
  // The site's canonical full-only rate. Recomputing it over the byCharge rows gives
  // 45.4% instead of 45.0%, because those rows drop charges that could not be
  // classified -- a second number for the same thing, which is worse than either.
  const fullOnlyAvg = REPORT.rates.convictionFullOnlyPct;

  const mixFirst = chargeMixByYear[0];
  const mixLast = chargeMixByYear[chargeMixByYear.length - 1];
  const fakeShare = (r: typeof mixFirst) => {
    const total = r.bribery + r.fake + r.embezzlement + r.benefit + r.loss + r.other;
    return total ? (r.fake / total) * 100 : 0;
  };

  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.prosecution.eyebrow", "From complaint to court")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.prosecution.title",
            "Which complaints become court cases?",
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.prosecution.lede",
            "In fiscal year {{fy}}, the Commission received {{total}} complaints and filed {{filed}} cases in court, equivalent to {{pct}} of the complaints recorded that year. This section examines the types of cases filed, how filing patterns have changed over time, and the amounts claimed by the Commission.",
            {
              total: n(cdz.total_complaints),
              fy: cdz.fy,
              filed: n(cdz.inv_filed),
              pct: `${((cdz.inv_filed / cdz.total_complaints) * 100).toFixed(2)}%`,
            },
          )}
        </Lede>

        <StatRow>
          <StatTile
            value={n(corpus.ciaaProsecutions - corpus.moneyLaundering)}
            label={t("research.corruption.prosecution.tileCorpus", "Corruption cases filed")}
            note={t("research.corruption.tile.corpusNote", "Over {{years}} fiscal years, excluding money-laundering cases.", {
              years: corpus.fiscalYears.length,
            })}
          />
          <StatTile
            value={n(Math.round(corpus.avgFiledPerYear))}
            label={t("research.corruption.prosecution.tileRate", "Cases filed per year, on average")}
            note={t("research.corruption.prosecution.tileRateNote", "Across the {{years}}-year period.", { years: corpus.fiscalYears.length })}
          />
          <StatTile
            value={`Rs ${bigoTotalBn.toFixed(1)} billion`}
            label={t("research.corruption.prosecution.tileBigo", "Total amount claimed")}
            note={t("research.corruption.prosecution.tileBigoNote", "Across the {{n}} fiscal years for which the Commission reported a total.", {
              n: bigoDemanded.length,
            })}
          />
        </StatRow>
      </Block>

      <Block>
        {/*
          PRESERVED FIGURE — "How the charge mix shifted, by year".
          Same component, same data, same denominator as the original page; only its
          placement and the surrounding text changed. It belongs under Prosecution
          because it measures a prosecutorial decision (what was filed), keyed on the
          filing year — not a court outcome.
        */}
        <Figure
          title={t("research.corruption.mix.title2", "Cases filed by offence type, by year")}
          subtitle={t(
            "research.corruption.mix.subtitle",
            "Number of cases filed in each fiscal year, by offence type.",
          )}
          caption={
            <>
              {t(
                "research.corruption.mix.caption",
                "{{n}} cases, grouped by the fiscal year in which they were filed. Cases that could not be assigned to an offence type are counted under \u201cOther offences\u201d.",
                { n: n(mixTotal) },
              )}{" "}
              <Cite href={CITATIONS.chargeSheets}>
                {t("research.corruption.byCharge.source", "View charge sheets")}
              </Cite>
            </>
          }
        >
          <ChargeMixByYear
            data={chargeMixByYear}
            labels={{
              bribery: t("research.corruption.mix.bribery", "Bribery"),
              fake: t("research.corruption.mix.fake", "Use of fake credentials"),
              embezzlement: t("research.corruption.mix.embezzlement", "Embezzlement"),
              benefit: t("research.corruption.mix.benefit", "Illegal benefit"),
              loss: t("research.corruption.mix.loss", "Loss to government"),
              other: t("research.corruption.mix.other", "Other offences"),
            }}
            percentLabel={t("research.corruption.mix.percent", "Show percentages")}
          />
        </Figure>

        <DataNote
          label={t("research.corruption.note.shows", "What the figures show")}
          stat={t("research.corruption.prosecution.mixStat", "{{first}} \u2192 {{last}}", {
            first: pct(fakeShare(mixFirst)),
            last: pct(fakeShare(mixLast)),
          })}
          statCaption={t(
            "research.corruption.prosecution.mixStatCaption",
            "Share of cases filed involving fake credentials, falling from {{first}} in {{firstFy}} to {{last}} in {{lastFy}}.",
            {
              first: pct(fakeShare(mixFirst)),
              last: pct(fakeShare(mixLast)),
              firstFy: fy(mixFirst.fy),
              lastFy: fy(mixLast.fy),
            },
          )}
        >
          <p>
            {t(
              "research.corruption.prosecution.mixBody",
              "The share of cases involving other offences also changed over this period. The figures show how the mix of cases filed in court shifted over time, but do not establish what caused these changes.",
            )}
          </p>
        </DataNote>
      </Block>


      <Block>
        <Eyebrow>{t("research.corruption.size.eyebrow", "How cases differ")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.size.title",
            "Average number of defendants, by offence type",
          )}
        </SectionHeading>
        <Body>
          {t(
            "research.corruption.size.body",
            "Cases differ in how many people are charged together. This chart compares the average number of defendants per decided case with the share of cases in which the charge was upheld in full.",
          )}
        </Body>

        <div className="mt-6 rounded-lg border border-border bg-[hsl(var(--surface))] p-5 md:p-6">
          <AccusedPerCase
            rows={accusedRows}
            heading={t("research.corruption.size.chartTitle", "Defendants per case, and how often the charge is upheld")}
            subheading={t("research.corruption.size.chartSubtitle", "Decided cases at the Special Court")}
            offenceLabel={t("research.corruption.size.colOffence", "Offence")}
            averageLabel={t("research.corruption.size.colAverage", "Average defendants")}
            averageUnit={t("research.corruption.size.colAverageUnit", "people per case")}
            convictionLabel={t("research.corruption.size.colConviction", "Upheld in full")}
            casesLabel={t("research.corruption.size.colConvictionUnit", "% of decided cases")}
            casesWord={t("research.corruption.size.wordCases", "cases")}
            defendantsWord={t("research.corruption.size.wordDefendants", "defendants")}
            language={language}
          />
        </div>

        <DataNote
          label={t("research.corruption.note.shows", "What the figures show")}
          stat={t("research.corruption.size.noteStat", "{{top}} → {{bottom}}", {
            top: pct(accusedExtremes.most.fullPct),
            bottom: pct(accusedExtremes.fewest.fullPct),
          })}
          statCaption={t(
            "research.corruption.size.noteCaption",
            "Full-conviction rate, from the offence charged against the most people per case ({{topAvg}}) to the one charged against the fewest ({{bottomAvg}}).",
            {
              topAvg: accusedExtremes.most.avg.toFixed(1),
              bottomAvg: accusedExtremes.fewest.avg.toFixed(1),
            },
          )}
        >
          <p>
            {t(
              "research.corruption.size.note1",
              "Offences involving fewer defendants tend to have higher full-conviction rates. The figures show that these two measures vary together, but do not explain why or establish that one causes the other.",
            )}
          </p>
        </DataNote>








        <Figure
          title={t("research.corruption.month.title", "Average cases filed, by Nepali month")}
          subtitle={t(
            "research.corruption.month.subtitle",
            "Across {{years}} complete fiscal years. The whisker is one standard deviation either side; {{peak}} is highlighted.",
            { years: corpus.fiscalYears.length, peak: peakMonth.name },
          )}
        >
          <FiledByMonth
            data={filedByMonth}
            peakMonth={peakMonth.month}
            meanLabel={t("research.corruption.month.mean", "mean filings")}
            sdLabel={t("research.corruption.month.sd", "±1 SD")}
          />
        </Figure>

        <DataNote
          label={t("research.corruption.note.shows", "What the figures show")}
          stat={t("research.corruption.month.stat", "{{v}} cases", {
            v: peakMonth.mean.toFixed(1),
          })}
          statCaption={t(
            "research.corruption.month.statCaption",
            "Average filed in {{peak}}, the final month of Nepal's fiscal year, against {{otherMean}} per month across the other eleven.",
            {
              peak: peakMonth.name,
              otherMean: otherMonthMean.toFixed(1),
            },
          )}
        >
          <p>
            {t(
              "research.corruption.month.body",
              "{{peak}}, the final month of Nepal's fiscal year, sees an average of {{peakMean}} cases filed by the Commission, compared with {{otherMean}} per month during the other eleven months. That is nearly {{morePct}} more than the monthly average for the rest of the year. The figures show a clear concentration of filings at the fiscal year's end, but the available data do not establish why it occurs or whether it is linked to investigation timelines, institutional deadlines or other factors.",
              {
                peak: peakMonth.name,
                peakMean: peakMonth.mean.toFixed(1),
                otherMean: otherMonthMean.toFixed(1),
                morePct: `${Math.round((peakMonth.mean / otherMonthMean - 1) * 100)}%`,
              },
            )}
          </p>
        </DataNote>

        <GapCallout
          label={t("research.corruption.gap.bLabel", "Accountability gap · Prosecution decisions")}
          title={t(
            "research.corruption.gap.bTitle",
            "The Pashupati Jalhari case raised a serious question about selective prosecution",
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          shows={
            <>
              <p>
                {t(
                  "research.corruption.gap.bEstablishes",
                  "In the Pashupati Jalhari case, the Special Court raised concerns about selective prosecution, questioning why some individuals were prosecuted while others considered similarly responsible were left out. The court's observations put the consistency of the CIAA's prosecution decisions under scrutiny. The acquittal should not, however, be attributed to selective prosecution alone.",
                )}
              </p>
              <p className="text-xs">
                <Cite href={JALAHARI.analysis}>
                  {t("research.corruption.gap.bCite", "Read the full analysis")}
                </Cite>
                {" · "}
                <Cite href={JALAHARI.case}>
                  {t("research.corruption.gap.bCiteCase", "Read the full case summary")}
                </Cite>
              </p>
            </>
          }
          questionLabel={t("research.corruption.gap.open", "The open question")}
          question={t(
            "research.corruption.gap.bQuestion",
            "Why does the CIAA prosecute some individuals while leaving others who may be similarly responsible out of the case?",
          )}
        >
          <p>
            {t(
              "research.corruption.gap.bBody",
              "Is this the result of gaps in investigation, differences in the evidence gathered against each individual, or decisions about whom to prosecute that require closer scrutiny? The available record does not establish which explanation applies.",
            )}
          </p>
          <p>
            {t(
              "research.corruption.gap.bBody2",
              "But when a court itself raises concerns about selective prosecution, the reasons for including some individuals and excluding others deserve clear scrutiny. Without a record that allows these decisions to be compared, it is difficult to determine whether differences in prosecution reflect differences in evidence or inconsistent treatment of people in similar positions.",
            )}
          </p>
        </GapCallout>

        <GapCallout
          label={t("research.corruption.gap.gLabel", "Accountability gap · Charge calculation")}
          title={t(
            "research.corruption.gap.gTitle",
            "The Supreme Court settled how illicit enrichment should be assessed. The Commission still builds cases the other way.",
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          shows={
            <>
              <p>
                {t(
                  "research.corruption.gap.gLede",
                  "Two ways of adding up the same facts can reach opposite conclusions about the same official. One judgment shows how narrow the margin can be.",
                )}
              </p>

              {/*
                BLOCK 1 — the arithmetic of decision no. 9433, laid out as arithmetic.
                Figures and the ten per cent rule are quoted from the judgment text at
                nkp.gov.np/full_detail/8476 (paras 47-49), re-checked against the
                original Nepali before publication: जाँच अवधिमा जम्मा रू.७४,५१,४२६।२५,
                रू.६८,४७,५३५।९० वैध मौद्रिक आय, and ८.१० प्रतिशत अर्थात् रू.६,०३,८९०।
                Para 48 is where the court says a difference of up to १० प्रतिशत cannot
                be called अमिल्दो र अस्वाभाविक. It is the court's reasoning in this case,
                not a figure written into the Act, and the caption says so.
              */}
              <CaseLedger
                label={t("research.corruption.ledger.label", "The case")}
                title={t(
                  "research.corruption.ledger.title",
                  "Nepal Government v. Harekrishna Bhagat, decision no. 9433 of 2072",
                )}
                cite={
                  <Cite href={NKP_9433}>
                    {t("research.corruption.gap.gCite", "Read decision no. 9433")}
                  </Cite>
                }
                rows={[
                  {
                    key: "assets",
                    label: t("research.corruption.ledger.assets", "Property held over the check period"),
                    value: t("research.corruption.ledger.assetsV", "Rs 74,51,426"),
                  },
                  {
                    key: "income",
                    op: "−",
                    label: t("research.corruption.ledger.income", "Lawful income for the same period"),
                    value: t("research.corruption.ledger.incomeV", "Rs 68,47,536"),
                  },
                  {
                    key: "gap",
                    op: "=",
                    total: true,
                    label: t("research.corruption.ledger.diff", "Difference the court had to explain"),
                    value: t("research.corruption.ledger.diffV", "Rs 6,03,890"),
                  },
                ]}
                share={8.1}
                shareLabel={t(
                  "research.corruption.ledger.share",
                  "of the property held — the size of the gap, measured against everything the defendant owned",
                )}
                threshold={10}
                thresholdLabel={t(
                  "research.corruption.ledger.threshold",
                  "10% — the point the court used in this case",
                )}
                outcome={t(
                  "research.corruption.ledger.outcome",
                  "The court held that a difference of up to ten per cent between property and income cannot be called disproportionate or unnatural. The acquittal stood. Ten per cent is the court's reasoning in this case, not a figure written into the Act.",
                )}
              />

              {/*
                BLOCK 2 — why the same facts can come out differently. Reduced to the
                single thing that separates the methods: the stretch of time compared.
              */}
              <MethodComparison
                scenario={t(
                  "research.corruption.method.scenario2",
                  "Both methods compare the same two things — property held against income lawfully earned. They differ on one point only.",
                )}
                question={t(
                  "research.corruption.method.question2",
                  "Over what stretch of time do you compare them?",
                )}
                outputArrowLabel={t("research.corruption.method.arrow", "so")}
                methods={[
                  {
                    key: "checkperiod",
                    ruling: true,
                    title: t("research.corruption.method.m1", "Check period"),
                    kicker: t(
                      "research.corruption.method.m1Kicker",
                      "The method the Supreme Court applied and treated as settled",
                    ),
                    inputLabel: t("research.corruption.method.inLabel", "Period compared"),
                    inputValue: t("research.corruption.method.m1InV2", "The whole service, as one"),
                    outputLabel: t("research.corruption.method.outLabel", "Counts as unexplained"),
                    outputValue: t("research.corruption.method.m1OutV2", "The final gap"),
                    body: t(
                      "research.corruption.method.m1Body2",
                      "Everything earned and everything spent across the years in office are totalled once, and the question is whether what is left over is disproportionate. A lean year that is made up later never appears.",
                    ),
                  },
                  {
                    key: "cashflow",
                    title: t("research.corruption.method.m2", "Cash flow"),
                    kicker: t(
                      "research.corruption.method.m2Kicker",
                      "The method the Commission registered the case on",
                    ),
                    inputLabel: t("research.corruption.method.inLabel", "Period compared"),
                    inputValue: t("research.corruption.method.m2InV2", "Year by year, in sequence"),
                    outputLabel: t("research.corruption.method.outLabel", "Counts as unexplained"),
                    outputValue: t("research.corruption.method.m2OutV2", "Every year in deficit"),
                    body: t(
                      "research.corruption.method.m2Body2",
                      "Each year is checked on its own, and a year where spending ran ahead of income is counted as unexplained property even if the totals balance by the end. The shortfalls add up, so this method can produce a large figure from a period the other method finds nothing in.",
                    ),
                  },
                ]}
                footnote={t(
                  "research.corruption.method.note2",
                  "Neither method is named in the Act. The Supreme Court has applied the check period; the Commission has gone on registering cases on cash flow, and no record states which was used in any given charge sheet.",
                )}
              />

              {/*
                BLOCK 3 — the sequence. The FY2076/77 entry is the strongest evidence on
                the page because the same case carries both answers: the Special Court
                found income exceeded expenditure over the whole period and acquitted,
                while the charge sheet's own chart, reproduced in the Commission's appeal
                grounds, totals Rs 2,54,69,887 of property with no source shown.
                Verified in the report's own text (30th annual report, FY2076/77).
              */}
              <EvidenceTimeline
                label={t(
                  "research.corruption.gap.gTimeline",
                  "The method, before and after the ruling",
                )}
                entries={[
                  {
                    key: "before",
                    when: t("research.corruption.gap.gT1When", "FY2070/71 — before the ruling"),
                    kind: t(
                      "research.corruption.gap.gT1Kind",
                      "Two investigations closed because the cash flow never went negative",
                    ),
                    body: t(
                      "research.corruption.gap.gT1Body",
                      "The Commission's own report records two files placed in Tameli, on 2071/3/12 and 2071/3/13, on the stated ground that income exceeded spending and \"at no stage of the cash flow was there a negative position\". The method decided the outcome in the officials' favour.",
                    ),
                  },
                  {
                    key: "ruling",
                    pivot: true,
                    when: t("research.corruption.gap.gT2When", "2072 — Supreme Court"),
                    kind: t(
                      "research.corruption.gap.gT2Kind",
                      "Decision no. 9433 treats the check period as settled",
                    ),
                    body: t(
                      "research.corruption.gap.gT2Body",
                      "The court recorded that the case had been registered on a cash-flow basis while the Special Court had assessed it on a check-period basis. It declined to reopen the question, holding that property is analysed over the check period, and dismissed the appeal.",
                    ),
                  },
                  {
                    key: "after",
                    when: t("research.corruption.gap.gT3When", "FY2076/77 — four years later"),
                    kind: t(
                      "research.corruption.gap.gT3Kind",
                      "A charge sheet's own Cash Flow Chart, printed in the Commission's appeal grounds",
                    ),
                    body: t(
                      "research.corruption.gap.gT3Body",
                      "Appealing the acquittal of Ram Babu Adhikari and Malati Sharma Adhikari, the Commission reproduced the chart the charge sheet was built on — year by year from 2046/47 to 2073/12/31. The Special Court had taken the whole check period as one unit and found that income exceeded expenditure. The chart, read year by year, finds the opposite.",
                    ),
                    stat: t("research.corruption.gap.gT3Stat", "Rs 2,54,69,887"),
                    statCaption: t(
                      "research.corruption.gap.gT3StatCap",
                      "property with no source shown, as totalled by the charge sheet's chart — in the same case the court decided the other way",
                    ),
                  },
                ]}
              />

              <p className="text-xs">
                <Cite href={CIAA_2070_71}>
                  {t("research.corruption.gap.gCite4", "CIAA annual report, FY2070/71")}
                </Cite>
                {" · "}
                <Cite href={CIAA_2076_77}>
                  {t("research.corruption.gap.gCite2", "CIAA annual report, FY2076/77")}
                </Cite>
              </p>

              {/* BLOCK 4 — what the charge looks like once it reaches a verdict. */}
              <ReadingNotes
                label={t("research.corruption.gap.gOutcome", "What the case data shows")}
                notes={[
                  {
                    key: "decided",
                    stat: n(ieDecided),
                    title: t("research.corruption.gap.gO1", "Illicit-enrichment cases decided"),
                    body: t(
                      "research.corruption.gap.gO1Body",
                      "Every case in the archive charged as illicit enrichment that has reached a clear verdict, across the fourteen years.",
                    ),
                  },
                  {
                    key: "acquitted",
                    stat: n(ie ? ie.acquitted : 0),
                    title: t("research.corruption.gap.gO2", "Ended in acquittal"),
                    body: t(
                      "research.corruption.gap.gO2Body",
                      "{{share}} of them — the defendants walked out cleared of the charge.",
                      {
                        share: pct(ieDecided ? ((ie?.acquitted ?? 0) / ieDecided) * 100 : 0),
                      },
                    ),
                  },
                  {
                    key: "full",
                    stat: pct(ieDecided ? ((ie?.convicted ?? 0) / ieDecided) * 100 : 0),
                    title: t("research.corruption.gap.gO3", "Upheld in full"),
                    body: t(
                      "research.corruption.gap.gO3Body",
                      "Against {{avg}} across all offences. The charge does worse in court than the average charge, though it is not the weakest of any.",
                      { avg: pct1(fullOnlyAvg) },
                    ),
                  },
                ]}
                footnote={t(
                  "research.corruption.gap.gOutcomeFoot",
                  "These figures show a difference in outcomes. They do not show that the method caused it: an acquittal can turn on the evidence, the source of funds or anything else, and the archive records a verdict but never the method behind the figure.",
                )}
              />
            </>
          }
          questionLabel={t("research.corruption.gap.open", "The open question")}
          question={t(
            "research.corruption.gap.gQuestion2",
            "How many charge sheets are built on a method the courts will not decide them by?",
          )}
        >
          <p>
            {t(
              "research.corruption.gap.gBody5",
              "Nobody can say. The method behind the amount in a charge sheet is not written down anywhere a reader can reach, so the only way to find out is case by case, from the reports that happen to reprint a chart. Three fields on each case would turn that into something countable:",
            )}
          </p>
          <ul className="ml-4 list-disc space-y-1.5 marker:text-accent">
            <li>{t("research.corruption.gap.gNeed1", "the method used to calculate the amount")}</li>
            <li>{t("research.corruption.gap.gNeed2", "the amount claimed in the charge sheet")}</li>
            <li>{t("research.corruption.gap.gNeed3", "the amount the court upheld")}</li>
          </ul>
        </GapCallout>

        <GapCallout
          label={t("research.corruption.gap.jLabel", "Accountability gap · Financial claims")}
          title={t(
            "research.corruption.gap.jTitle",
            "The Commission claimed Rs {{bn}} billion. How much did courts uphold?",
            { bn: bigoTotalBn.toFixed(1) },
          )}
          stat={`Rs ${bigoTotalBn.toFixed(1)} billion`}
          statCaption={t(
            "research.corruption.gap.jEstablishes",
            "Across the {{n}} fiscal years for which annual reports provide totals, the Commission claimed Rs {{bn}} billion in बिगो, the amount it alleged as loss or unlawful gain in its charge sheets.",
            { n: bigoDemanded.length, bn: bigoTotalBn.toFixed(1) },
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          shows={
            <p>
              {t(
                "research.corruption.gap.jEstablishes2",
                "Three other reports within the {{all}}-year period provide no annual total, and the report for {{missingFy}} has not yet been published. Annual claims ranged from Rs {{lo}} billion to Rs {{hi}} billion, with a small number of large cases potentially driving much of the yearly variation.",
                {
                  all: corpus.fiscalYears.length,
                  missingFy: "2082/83",
                  lo: (Math.min(...bigoDemanded.map((r) => r.rs)) / 1e9).toFixed(1),
                  hi: (Math.max(...bigoDemanded.map((r) => r.rs)) / 1e9).toFixed(1),
                },
              )}
            </p>
          }
          questionLabel={t("research.corruption.gap.open", "The open question")}
          question={t(
            "research.corruption.gap.jQuestion",
            "How much of the amount claimed by the Commission is ultimately upheld by the courts?",
          )}
        >
          <p>
            {t(
              "research.corruption.gap.jBody",
              "The case register does not systematically record the amount claimed alongside the amount upheld in court. A judgment alone also does not provide a consistent basis for comparing these amounts across cases.",
            )}
          </p>
          <p>
            {t(
              "research.corruption.gap.jBody2",
              "One judgment examined in full shows why the distinction matters: the Commission alleged that 1,491.718 grams of gold were missing, and the court found that only a small fraction of that remained unexplained once metal returned, other metals present and natural loss were accounted for. It illustrates how sharply a court's finding can differ from the original claim in a single case, but it does not show how common such differences are.",
            )}
          </p>
          <p>
            {t(
              "research.corruption.gap.jBody3",
              "Without comparable case-level figures for the amount claimed and the amount upheld, the overall difference cannot be measured. Recording both would make it possible to assess how much of the Commission's financial claims withstand judicial scrutiny.",
            )}
          </p>
        </GapCallout>
        <GapCallout
          label={t("research.corruption.gap.kLabel", "Accountability gap · Filing patterns")}
          title={t(
            "research.corruption.gap.kTitle",
            "The Commission files more cases in {{peak}} than in any other month. The reason remains unclear.",
            { peak: peakMonth.name },
          )}
          stat={t("research.corruption.gap.kStat", "{{v}} cases", { v: peakMonth.mean.toFixed(1) })}
          statCaption={t(
            "research.corruption.gap.kEstablishes",
            "The Commission filed an average of {{peakMean}} cases in {{peak}}, the final month of Nepal's fiscal year, compared with {{otherMean}} per month across the other eleven months. That is nearly {{morePct}} more. The pattern is based on {{years}} complete fiscal years, although the number of filings varies considerably from year to year.",
            {
              peak: peakMonth.name,
              peakMean: peakMonth.mean.toFixed(1),
              otherMean: otherMonthMean.toFixed(1),
              morePct: `${Math.round((peakMonth.mean / otherMonthMean - 1) * 100)}%`,
              years: corpus.fiscalYears.length,
            },
          )}
          questionLabel={t("research.corruption.gap.open", "The open question")}
          question={t(
            "research.corruption.gap.kQuestion",
            "Why are so many cases filed in the final month of the fiscal year?",
          )}
        >
          <p>
            {t(
              "research.corruption.gap.kBody",
              "The figures show when cases reach the court, but not what drives the timing. The concentration could reflect investigation schedules, administrative deadlines or other factors, but the published records do not establish which, if any, explains the pattern.",
            )}
          </p>
          <p>
            {t(
              "research.corruption.gap.kBody2",
              "The Commission's annual reports do not explain the year-end increase. Data showing when investigations were completed and prosecution decisions were made would help establish whether the concentration reflects the timing of completed investigations or a pattern in when cases are brought to court.",
            )}
          </p>
        </GapCallout>

      </Block>
    </>
  );
}
