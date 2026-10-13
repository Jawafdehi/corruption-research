import { useTranslation } from "react-i18next";

import { AccusedPerCase } from "@/components/research/AccusedPerCase";
import { FiledByMonth } from "@/components/research/FiledByMonth";
import { DataNote } from "@/components/research/DataNote";
import { GapCallout } from "@/components/research/GapCallout";
import { MethodComparison } from "@/components/research/MethodComparison";
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
/** The FY2078/79 annual report, where the Commission quotes the precedent it is
 *  arguing against. Pinned to the fiscal year rather than to the series, so a
 *  refreshed dataset cannot silently move the citation to a different report. */
const CIAA_2078_79 =
  "https://ciaa.gov.np/uploads/publicationsAndReports/FeK7BV.pdf";

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
            "The Supreme Court drew a line between a property's purchase price and its later value. No record lets anyone check a charge sheet against it.",
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          shows={
            <>
              <p>
                {t(
                  "research.corruption.gap.gEstablishes",
                  "In Nepal Kanoon Patrika 2072, volume 12, decision no. 9505, the Supreme Court set out a principle for illicit-enrichment cases: where the source of the money invested to acquire property cannot be established, the unexplained amount may extend to that original investment, but not automatically to the property's subsequent increase in value.",
                )}
              </p>
              <p>
                {t(
                  "research.corruption.gap.gEstablishes2",
                  "The CIAA's FY2078/79 annual report quotes this principle in its grounds for appealing an acquittal, arguing that the Special Court's decision to acquit was contrary to it. The Commission cites the rule in support of its own case, not against it; the dispute in that appeal is over whether the court assessed the defendant's lawful income separately for each date of acquisition, and where the burden of proof lies under section 20(1) of the Prevention of Corruption Act, 2059.",
                )}{" "}
                <Cite href={CIAA_2078_79}>
                  {t("research.corruption.gap.gCite", "Read the CIAA annual report, FY2078/79")}
                </Cite>
              </p>

              <MethodComparison
                scenario={t(
                  "research.corruption.method.scenario",
                  "Suppose a public official buys a plot of land in 2065 for Rs 20 lakh. By the time the case is investigated, the land is worth Rs 1 crore.",
                )}
                question={t(
                  "research.corruption.method.question",
                  "If the official cannot establish the legitimate source of the money used to buy the land, what amount can be treated as illegally acquired?",
                )}
                outputArrowLabel={t(
                  "research.corruption.method.arrow",
                  "would be treated as unexplained",
                )}
                methods={[
                  {
                    key: "original",
                    ruling: true,
                    title: t("research.corruption.method.m1", "Method 1: Original investment"),
                    kicker: t(
                      "research.corruption.method.m1Kicker",
                      "What the Supreme Court's principle allows to be treated as unexplained",
                    ),
                    inputLabel: t("research.corruption.method.m1In", "Original purchase price"),
                    inputValue: t("research.corruption.method.m1InV", "Rs 20 lakh"),
                    outputLabel: t("research.corruption.method.outLabel", "Amount potentially unexplained"),
                    outputValue: t("research.corruption.method.m1OutV", "Rs 20 lakh"),
                    body: t(
                      "research.corruption.method.m1Body",
                      "The calculation focuses on the amount originally invested in acquiring the property. If the source of that investment cannot be established, the unexplained amount is the original investment, not the later increase in the property's value.",
                    ),
                  },
                  {
                    key: "current",
                    title: t("research.corruption.method.m2", "Method 2: Current property value"),
                    kicker: t(
                      "research.corruption.method.m2Kicker",
                      "The calculation the principle rules out, which would include the rise in value since purchase",
                    ),
                    inputLabel: t("research.corruption.method.m2In", "Current market value"),
                    inputValue: t("research.corruption.method.m2InV", "Rs 1 crore"),
                    outputLabel: t("research.corruption.method.outLabel", "Amount potentially unexplained"),
                    outputValue: t("research.corruption.method.m2OutV", "Rs 1 crore"),
                    body: t(
                      "research.corruption.method.m2Body",
                      "This would count the property's present value, including the Rs 80 lakh increase since purchase. Under the principle quoted in the CIAA's report, that increase should not be treated as illegally acquired merely because the source of the original investment was unproven.",
                    ),
                  },
                ]}
                illustrativeNote={t(
                  "research.corruption.method.note",
                  "The figures above are illustrative only, not amounts from an actual case. They also simplify the calculation: the actual legal assessment depends on the property, the evidence and the applicable law.",
                )}
              />
            </>
          }
          questionLabel={t("research.corruption.gap.open", "The open question")}
          question={t(
            "research.corruption.gap.gQuestion",
            "How are the amounts in charge sheets calculated, and how far do they sit from the amounts courts uphold?",
          )}
        >
          <p>
            {t(
              "research.corruption.gap.gBody",
              "The case register does not record, side by side, the amount claimed by the CIAA, the amount upheld by the court, and the basis each was calculated on. Without those fields it is not possible to check how any charge sheet applied the principle, or to measure the distance between what was claimed and what was upheld. Nothing in the published record shows the Commission valuing property at its current worth — where the reports describe its own method, as in FY2069/70, it fixes the amount on the value at the time of acquisition.",
            )}
          </p>
          <p>
            {t(
              "research.corruption.gap.gBody2",
              "Of {{n}} decided illicit-enrichment cases in the dataset, {{acq}} ended in acquittal. The charge was upheld in full in {{conv}} of cases, compared with {{avg}} across all offences. These figures show a difference in outcomes, but they do not explain it. An acquittal does not by itself establish that the property was valued incorrectly, and a difference between the amount claimed and the amount upheld does not necessarily mean the calculation method was wrong.",
              {
                n: n(ieDecided),
                acq: n(ie ? ie.acquitted : 0),
                conv: pct(ieDecided ? ((ie?.convicted ?? 0) / ieDecided) * 100 : 0),
                avg: pct1(fullOnlyAvg),
              },
            )}
          </p>
          <p>
            {t(
              "research.corruption.gap.gBody3",
              "The annual reports do document repeated disputes over income, property valuation and the amount alleged, with both sides invoking the valuation rules. What the data cannot show is how those disputes were resolved across cases, how large the differences were, or whether they contributed to the acquittal rate. A case-level record of the original investment, the property's value at the relevant stages, the amount claimed, the amount upheld and the court's reasons for any reduction would make that comparison possible.",
            )}
          </p>
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
              "One judgment examined in full shows why the distinction matters: a claim involving 1,491 grams of gold was reduced to about 58 grams. This illustrates how sharply a court's finding can differ from the original claim in an individual case, but it does not show how common such reductions are.",
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
