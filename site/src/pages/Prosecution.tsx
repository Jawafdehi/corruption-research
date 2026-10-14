import { useTranslation } from "react-i18next";

import { AccusedPerCase } from "@/components/research/AccusedPerCase";
import { FiledByMonth } from "@/components/research/FiledByMonth";
import { DataNote } from "@/components/research/DataNote";
import { GapCallout } from "@/components/research/GapCallout";
import { FigureTable } from "@/components/research/FigureTable";
import {
  GapBody,
  GapPanel,
  GapQuestion,
  GapSection,
  GapStep,
} from "@/components/research/GapSection";
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
/** नि.नं. ९४३३, नेपाल सरकार वि. हरेकृष्ण भगत — where the Supreme Court applied the
 *  check-period method and declined to engage with the cash-flow objection.
 *  FY2070/71 (MlV2KJ.pdf) also records two Tameli decisions taken on cash-flow
 *  reasoning, before the ruling; it is not cited on the page any more. */
const NKP_9433 = "https://nkp.gov.np/full_detail/8476";
/** FY2076/77, whose appeal grounds reproduce a charge sheet's own Cash Flow Chart.
 *  Pinned to the fiscal year rather than to the series, so a refreshed dataset cannot
 *  silently move the citation to a different report. */
const CIAA_2076_77 =
  "https://ciaa.gov.np/uploads/publicationsAndReports/UOJL53.pdf";

const JALAHARI = {
  analysis:
    "https://jawafdehi.org/updates/pashupati-jalahari-selective-prosecution",
  case: "https://jawafdehi.org/case/jalahari",
};

export default function Prosecution() {
  const { t, language } = useTranslation();
  const { n, pct, pct2, fy } = useFormat();

  // The worked example's round figures. Written through t() rather than concatenated,
  // because "lakh" is a word and Nepali does not put it where English does.
  const lakh = (v: number) =>
    t("research.corruption.calc.lakh", "Rs {{v}} lakh", { v });
  const { byCharge, chargeMixByYear, corpus, defendants } = REPORT;

  // Denominator preserved exactly as the original chart defined it: the sum of the
  // six mix families across all years. This is deliberately larger than the
  // substantive corpus, because unclassifiable matters stay inside `other` rather
  // than being dropped. Changing it would silently change what the chart means.
  const mixTotal = chargeMixByYear.reduce(
    (s, r) =>
      s + r.bribery + r.fake + r.embezzlement + r.benefit + r.loss + r.other,
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
    filedByMonth
      .filter((m) => m.name !== peakMonth.name)
      .reduce((a, m) => a + m.mean, 0) /
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
    const withAvg = accusedRows.map((r) => ({
      ...r,
      avg: r.cases ? r.accused / r.cases : 0,
    }));
    const sorted = [...withAvg].sort((a, b) => b.avg - a.avg);
    return { most: sorted[0], fewest: sorted[sorted.length - 1] };
  })();

  const mixFirst = chargeMixByYear[0];
  const mixLast = chargeMixByYear[chargeMixByYear.length - 1];
  const fakeShare = (r: typeof mixFirst) => {
    const total =
      r.bribery + r.fake + r.embezzlement + r.benefit + r.loss + r.other;
    return total ? (r.fake / total) * 100 : 0;
  };

  return (
    <>
      <Block>
        <Eyebrow>
          {t(
            "research.corruption.prosecution.eyebrow",
            "From complaint to court",
          )}
        </Eyebrow>
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
            label={t(
              "research.corruption.prosecution.tileCorpus",
              "Corruption cases filed",
            )}
            note={t(
              "research.corruption.tile.corpusNote",
              "Over {{years}} fiscal years, excluding money-laundering cases.",
              {
                years: corpus.fiscalYears.length,
              },
            )}
          />
          <StatTile
            value={n(Math.round(corpus.avgFiledPerYear))}
            label={t(
              "research.corruption.prosecution.tileRate",
              "Cases filed per year, on average",
            )}
            note={t(
              "research.corruption.prosecution.tileRateNote",
              "Across the {{years}}-year period.",
              { years: corpus.fiscalYears.length },
            )}
          />
          <StatTile
            value={`Rs ${bigoTotalBn.toFixed(1)} billion`}
            label={t(
              "research.corruption.prosecution.tileBigo",
              "Total amount claimed",
            )}
            note={t(
              "research.corruption.prosecution.tileBigoNote",
              "Across the {{n}} fiscal years for which the Commission reported a total.",
              {
                n: bigoDemanded.length,
              },
            )}
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
          id="charge-mix"
          title={t(
            "research.corruption.mix.title2",
            "Cases filed by offence type, by year",
          )}
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
              fake: t(
                "research.corruption.mix.fake",
                "Use of fake credentials",
              ),
              embezzlement: t(
                "research.corruption.mix.embezzlement",
                "Embezzlement",
              ),
              benefit: t("research.corruption.mix.benefit", "Illegal benefit"),
              loss: t("research.corruption.mix.loss", "Loss to government"),
              other: t("research.corruption.mix.other", "Other offences"),
            }}
            percentLabel={t(
              "research.corruption.mix.percent",
              "Show percentages",
            )}
          />
        </Figure>

        <DataNote
          label={t("research.corruption.note.shows", "What the figures show")}
          stat={t(
            "research.corruption.prosecution.mixStat",
            "{{first}} \u2192 {{last}}",
            {
              first: pct(fakeShare(mixFirst)),
              last: pct(fakeShare(mixLast)),
            },
          )}
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
        <Eyebrow>
          {t("research.corruption.size.eyebrow", "How cases differ")}
        </Eyebrow>
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
            heading={t(
              "research.corruption.size.chartTitle",
              "Defendants per case, and how often the charge is upheld",
            )}
            subheading={t(
              "research.corruption.size.chartSubtitle",
              "Decided cases at the Special Court",
            )}
            offenceLabel={t("research.corruption.size.colOffence", "Offence")}
            averageLabel={t(
              "research.corruption.size.colAverage",
              "Average defendants",
            )}
            averageUnit={t(
              "research.corruption.size.colAverageUnit",
              "people per case",
            )}
            convictionLabel={t(
              "research.corruption.size.colConviction",
              "Upheld in full",
            )}
            casesLabel={t(
              "research.corruption.size.colConvictionUnit",
              "% of decided cases",
            )}
            casesWord={t("research.corruption.size.wordCases", "cases")}
            defendantsWord={t(
              "research.corruption.size.wordDefendants",
              "defendants",
            )}
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
          title={t(
            "research.corruption.month.title",
            "Average cases filed, by Nepali month",
          )}
        >
          <FiledByMonth
            data={filedByMonth}
            peakMonth={peakMonth.month}
            meanLabel={t("research.corruption.month.mean", "mean filings")}
            sdLabel={t("research.corruption.month.sd", "±1 SD")}
            averageLabel={t(
              "research.corruption.month.average",
              "all-month average",
            )}
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
          label={t(
            "research.corruption.gap.bLabel",
            "Accountability gap · Prosecution decisions",
          )}
          title={t(
            "research.corruption.gap.bTitle",
            "The Pashupati Jalhari case raised a serious question about selective prosecution",
          )}
          showsLabel={t(
            "research.corruption.gap.shows",
            "What the record shows",
          )}
          shows={
            <>
              <p>
                {t("research.corruption.gap.bEstablishesA", "In the ")}
                <Cite href={JALAHARI.case}>
                  {t(
                    "research.corruption.gap.bCaseName",
                    "Pashupati Jalhari case",
                  )}
                </Cite>
                {t(
                  "research.corruption.gap.bEstablishesB",
                  ", the Special Court raised concerns about selective prosecution, questioning why some individuals were prosecuted while others considered similarly responsible were left out. The court's observations put the consistency of the CIAA's prosecution decisions under scrutiny. The acquittal should not, however, be attributed to selective prosecution alone.",
                )}
              </p>
              <p className="text-xs">
                <Cite href={JALAHARI.analysis}>
                  {t("research.corruption.gap.bCite", "Read the full analysis")}
                </Cite>
                {" · "}
                <Cite href={JALAHARI.case}>
                  {t(
                    "research.corruption.gap.bCiteCase",
                    "Read the full case summary",
                  )}
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

        {/*
          The charge-calculation gap, in four steps: a worked example that makes the
          two methods arithmetic rather than terminology, the judgment that chose
          between them, the question that leaves open, and the fields that would let
          anyone answer it.

          The worked example is invented, and says so twice — once before the table and
          once in the note under it. The figures in the judgment step are quoted from
          the original Nepali (nkp.gov.np/full_detail/8476, paras 47-49) and re-checked
          against it before publication: रू.७४,५१,४२६ / रू.६८,४७,५३५ / ८.१० प्रतिशत of
          total assets. The ten per cent is para 48's reasoning in that case and is not
          in the Act; the sentence under the table has to keep saying so.
        */}
        <GapSection
          label={t(
            "research.corruption.gap.gLabel",
            "Accountability gap · Charge calculation",
          )}
          title={t(
            "research.corruption.gap.gTitle2",
            "The Supreme Court applied the check-period method. Why does the CIAA still calculate illicit enrichment using cash flow?",
          )}
        >
          <GapBody>
            <p>
              {t(
                "research.corruption.gap.gIntro",
                "The method used to calculate alleged illicit wealth can affect how an official's finances are assessed. The check-period method looks at income and expenditure across the whole period, while the cash-flow method examines whether income covered expenses and property purchases as they occurred. The Supreme Court's decision in Nepal Government v. Harekrishna Bhagat raises a question about the method the CIAA uses when investigating and prosecuting illicit-enrichment cases.",
              )}
            </p>
          </GapBody>

          <GapStep
            first
            heading={t(
              "research.corruption.calc.step1",
              "Two methods, one financial history",
            )}
          >
            <GapBody>
              <p>
                {t(
                  "research.corruption.calc.hypothetical",
                  "The example below is hypothetical. It shows how the same income, expenses and property purchases can produce different results when assessed across the whole period or year by year.",
                )}
              </p>
            </GapBody>

            <FigureTable
              heading={t(
                "research.corruption.calc.factsHeading",
                "An official's finances over two years",
              )}
              rowHeader={t(
                "research.corruption.calc.colActivity",
                "Financial activity",
              )}
              columns={[
                {
                  key: "y1",
                  label: t("research.corruption.calc.year1", "Year 1"),
                },
                {
                  key: "y2",
                  label: t("research.corruption.calc.year2", "Year 2"),
                },
                {
                  key: "total",
                  label: t("research.corruption.calc.total", "Total"),
                },
              ]}
              rows={[
                {
                  key: "income",
                  label: t("research.corruption.calc.income", "Lawful income"),
                  values: [lakh(5), lakh(10), lakh(15)],
                },
                {
                  key: "living",
                  label: t(
                    "research.corruption.calc.living",
                    "Living expenses",
                  ),
                  values: [lakh(2), lakh(2), lakh(4)],
                },
                {
                  key: "property",
                  label: t(
                    "research.corruption.calc.property",
                    "Property purchased",
                  ),
                  values: [lakh(5), lakh(3), lakh(8)],
                },
              ]}
            />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <GapPanel
                number={1}
                title={t("research.corruption.calc.m1", "Check-period method")}
                lead={t(
                  "research.corruption.calc.m1Lead",
                  "Assess the financial position across the entire period.",
                )}
              >
                <FigureTable
                  rowHeader={t(
                    "research.corruption.calc.colCalc",
                    "Calculation",
                  )}
                  columns={[
                    {
                      key: "amount",
                      label: t("research.corruption.calc.colAmount", "Amount"),
                    },
                  ]}
                  rows={[
                    {
                      key: "income",
                      label: t(
                        "research.corruption.calc.m1Income",
                        "Total lawful income",
                      ),
                      values: [lakh(15)],
                    },
                    {
                      key: "living",
                      label: t(
                        "research.corruption.calc.m1Living",
                        "Less: living expenses",
                      ),
                      values: [`− ${lakh(4)}`],
                    },
                    {
                      key: "property",
                      label: t(
                        "research.corruption.calc.m1Property",
                        "Less: property purchased",
                      ),
                      values: [`− ${lakh(8)}`],
                    },
                    {
                      key: "balance",
                      total: true,
                      label: t(
                        "research.corruption.calc.m1Balance",
                        "Overall balance",
                      ),
                      values: [lakh(3)],
                    },
                  ]}
                />
                <p className="mt-3.5 text-sm leading-6 text-foreground/80">
                  {t(
                    "research.corruption.calc.m1Body",
                    "Across both years, total income covers the recorded expenses and property purchases. This calculation shows no overall shortfall.",
                  )}
                </p>
              </GapPanel>

              <GapPanel
                number={2}
                title={t("research.corruption.calc.m2", "Cash-flow method")}
                lead={t(
                  "research.corruption.calc.m2Lead",
                  "Examine income against expenses and property purchases as they occur.",
                )}
              >
                <FigureTable
                  rowHeader={t(
                    "research.corruption.calc.colCalc",
                    "Calculation",
                  )}
                  columns={[
                    {
                      key: "y1",
                      label: t("research.corruption.calc.year1", "Year 1"),
                    },
                    {
                      key: "y2",
                      label: t("research.corruption.calc.year2", "Year 2"),
                    },
                  ]}
                  rows={[
                    {
                      key: "income",
                      label: t(
                        "research.corruption.calc.income",
                        "Lawful income",
                      ),
                      values: [lakh(5), lakh(10)],
                    },
                    {
                      key: "living",
                      label: t(
                        "research.corruption.calc.living",
                        "Living expenses",
                      ),
                      values: [lakh(2), lakh(2)],
                    },
                    {
                      key: "property",
                      label: t(
                        "research.corruption.calc.property",
                        "Property purchased",
                      ),
                      values: [lakh(5), lakh(3)],
                    },
                    {
                      key: "outgoings",
                      sub: true,
                      label: t(
                        "research.corruption.calc.m2Outgoings",
                        "Total expenses and property",
                      ),
                      values: [lakh(7), lakh(5)],
                    },
                    {
                      key: "balance",
                      total: true,
                      label: t(
                        "research.corruption.calc.m2Balance",
                        "Annual balance",
                      ),
                      values: [`− ${lakh(2)}`, `+ ${lakh(5)}`],
                    },
                  ]}
                />
              </GapPanel>
            </div>

            <h5 className="mt-6 font-display text-base font-bold leading-snug text-foreground">
              {t(
                "research.corruption.calc.whyHeading",
                "Why the results look different",
              )}
            </h5>
            <GapBody>
              <p>
                {t(
                  "research.corruption.calc.whyBody",
                  "Year 1 shows expenses and property purchases exceeding that year's income by {{short}}. Year 2 shows a surplus of {{surplus}}. The check-period calculation produces an overall balance of {{balance}}, but the year-by-year calculation identifies an earlier shortfall that requires explanation.",
                  { short: lakh(2), surplus: lakh(5), balance: lakh(3) },
                )}
              </p>
              <p className="italic text-foreground/70">
                {t(
                  "research.corruption.calc.whyCaveat",
                  "This illustration assumes no opening savings, borrowing or other available funds. A shortfall in a cash-flow calculation does not, by itself, establish illicit enrichment. The source and availability of funds and the applicable legal principles must also be considered.",
                )}
              </p>
            </GapBody>
          </GapStep>

          <GapStep
            heading={t(
              "research.corruption.calc.step2",
              "What did the Supreme Court decide?",
            )}
          >
            <div className="mt-4 rounded-lg border border-border bg-[hsl(var(--surface))] px-5 py-4">
              <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t(
                  "research.corruption.calc.caseLabel",
                  "Supreme Court · Decision no. 9433 · 2072",
                )}
              </p>
              <p className="mt-1.5 font-display text-base font-bold italic leading-snug">
                <Cite href={NKP_9433}>
                  {t(
                    "research.corruption.calc.caseName",
                    "Nepal Government v. Harekrishna Bhagat",
                  )}
                </Cite>
              </p>
              <p className="mt-1 text-xs leading-5">
                <Cite href={NKP_9433}>
                  {t(
                    "research.corruption.calc.caseCite",
                    "Read the full judgment",
                  )}
                </Cite>
              </p>
            </div>

            <GapBody>
              <p>
                {t(
                  "research.corruption.calc.caseBody1",
                  "The case brought the difference between the two methods directly before the Supreme Court. The CIAA had registered the case using the cash-flow method, while the Special Court assessed the finances across the check period.",
                )}
              </p>
              <p>
                {t(
                  "research.corruption.calc.caseBody2",
                  "The Supreme Court referred to its earlier decisions applying the check-period approach and proceeded on that basis. Its reasoning was not simply that one method was more practical. The Court treated the check-period approach as established in its previous decisions and assessed the financial position over the relevant period.",
                )}
              </p>
            </GapBody>

            <FigureTable
              heading={t(
                "research.corruption.calc.figuresHeading",
                "The figures considered by the Court",
              )}
              rowHeader={t(
                "research.corruption.calc.colMeasure",
                "Financial measure",
              )}
              columns={[
                {
                  key: "amount",
                  label: t("research.corruption.calc.colAmount", "Amount"),
                },
              ]}
              rows={[
                {
                  key: "assets",
                  label: t("research.corruption.calc.assets", "Property held"),
                  values: [
                    t("research.corruption.calc.assetsV", "Rs 74,51,426"),
                  ],
                },
                {
                  key: "income",
                  label: t("research.corruption.calc.lawful", "Lawful income"),
                  values: [
                    t("research.corruption.calc.lawfulV", "Rs 68,47,536"),
                  ],
                },
                {
                  key: "diff",
                  total: true,
                  label: t("research.corruption.calc.diff", "Difference"),
                  values: [t("research.corruption.calc.diffV", "Rs 6,03,890")],
                },
                {
                  key: "share",
                  label: t(
                    "research.corruption.calc.share",
                    "Difference as a share of property held",
                  ),
                  values: [pct2(8.1)],
                },
              ]}
            />

            <GapBody>
              <p>
                {t(
                  "research.corruption.calc.caseOutcome",
                  "The Court upheld the acquittal, applying its reasoning that a difference within 10% could not be treated as disproportionate or unnatural in the circumstances of this case. This was part of the judgment's case-specific reasoning, not a general statutory threshold.",
                )}
              </p>
            </GapBody>
          </GapStep>

          <GapStep
            heading={t(
              "research.corruption.calc.step3",
              "The accountability gap",
            )}
          >
            <GapQuestion
              label={t(
                "research.corruption.calc.gapLabel",
                "CIAA investigation and prosecution",
              )}
              question={t(
                "research.corruption.calc.gapQuestion",
                "If the Supreme Court applied the check-period approach, why did the CIAA calculate the alleged illicit wealth using cash flow in the first place?",
              )}
            />

            <GapBody>
              <p>
                {t(
                  "research.corruption.calc.gapBody1",
                  "The issue arises at the beginning of the case, when the CIAA investigates an official's finances, calculates the alleged unexplained wealth and decides the amount to claim in its charge sheet.",
                )}
              </p>
              <p>
                {t(
                  "research.corruption.calc.gapBody2",
                  "In Harekrishna Bhagat, the Supreme Court recorded that the CIAA had filed the case using cash flow, while the Special Court assessed the financial position over the check period. The judgment referred to earlier Supreme Court decisions applying the check-period approach.",
                )}
              </p>
              <p>
                {t(
                  "research.corruption.calc.gapBody3",
                  "A later example appears in the CIAA's FY2076/77 annual report. In its appeal concerning Ram Babu Adhikari and Malati Sharma Adhikari, the CIAA reproduced a cash-flow chart covering 2046/47 to 2073/12/31. The chart calculated {{amount}} as property without an established source, while the Special Court had assessed the check period as a whole and found that income exceeded expenditure.",
                  {
                    amount: t(
                      "research.corruption.calc.chartTotal",
                      "Rs 2,54,69,887",
                    ),
                  },
                )}
              </p>
              <p className="text-xs">
                <Cite href={CIAA_2076_77}>
                  {t(
                    "research.corruption.gap.gCite2",
                    "CIAA annual report, FY2076/77",
                  )}
                </Cite>
              </p>
              <p>
                {t(
                  "research.corruption.calc.gapBody4",
                  "The records raise a question about the method the CIAA uses when it initially calculates alleged illicit enrichment and brings a prosecution. They do not establish how frequently cash-flow calculations are used across all cases, or whether every such calculation conflicts with the applicable law and precedent.",
                )}
              </p>
            </GapBody>
          </GapStep>

          <GapStep
            heading={t(
              "research.corruption.calc.step4",
              "What is missing from the public record?",
            )}
          >
            <GapBody>
              <p>
                {t(
                  "research.corruption.calc.missingLead",
                  "To assess the extent of this issue, case records would need to consistently identify:",
                )}
              </p>
            </GapBody>
            <ul className="ml-4 mt-3 max-w-3xl list-disc space-y-1.5 text-sm leading-6 text-foreground/85 marker:text-accent">
              <li>
                {t(
                  "research.corruption.calc.missing1",
                  "The calculation method used by the CIAA during investigation.",
                )}
              </li>
              <li>
                {t(
                  "research.corruption.calc.missing2",
                  "The amount of alleged illicit wealth claimed in the charge sheet.",
                )}
              </li>
              <li>
                {t(
                  "research.corruption.calc.missing3",
                  "Whether the Special Court accepted that calculation or assessed the finances differently.",
                )}
              </li>
              <li>
                {t(
                  "research.corruption.calc.missing4",
                  "The court's reasons for accepting or rejecting the calculation.",
                )}
              </li>
            </ul>
            <GapBody>
              <p>
                {t(
                  "research.corruption.calc.missingEnd",
                  "Without these details across cases, it is difficult to determine how consistently the CIAA's initial calculations follow the approach applied by the courts.",
                )}
              </p>
            </GapBody>
          </GapStep>
        </GapSection>

        <GapCallout
          label={t(
            "research.corruption.gap.jLabel",
            "Accountability gap · Financial claims",
          )}
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
          showsLabel={t(
            "research.corruption.gap.shows",
            "What the record shows",
          )}
          shows={
            <p>
              {t(
                "research.corruption.gap.jEstablishes2",
                "Three other reports within the {{all}}-year period provide no annual total, and the report for {{missingFy}} has not yet been published. Annual claims ranged from Rs {{lo}} billion to Rs {{hi}} billion, with a small number of large cases potentially driving much of the yearly variation.",
                {
                  all: corpus.fiscalYears.length,
                  missingFy: "2082/83",
                  lo: (
                    Math.min(...bigoDemanded.map((r) => r.rs)) / 1e9
                  ).toFixed(1),
                  hi: (
                    Math.max(...bigoDemanded.map((r) => r.rs)) / 1e9
                  ).toFixed(1),
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
          label={t(
            "research.corruption.gap.kLabel",
            "Accountability gap · Filing patterns",
          )}
          title={t(
            "research.corruption.gap.kTitle",
            "The Commission files more cases in {{peak}} than in any other month. The reason remains unclear.",
            { peak: peakMonth.name },
          )}
          stat={t("research.corruption.gap.kStat", "{{v}} cases", {
            v: peakMonth.mean.toFixed(1),
          })}
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
