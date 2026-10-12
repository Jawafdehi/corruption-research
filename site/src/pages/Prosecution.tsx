import { useTranslation } from "react-i18next";

import { AccusedPerCase } from "@/components/research/AccusedPerCase";
import { FiledByMonth } from "@/components/research/FiledByMonth";
import { GapCallout } from "@/components/research/GapCallout";
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
  case: "https://jawafdehi.org/case/jalahari",
  trial: "https://jawafdehi.org/courtcase/special/080-cr-0047",
  appeal: "https://jawafdehi.org/courtcase/supreme/081-cr-1635",
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
        <Eyebrow>{t("research.corruption.prosecution.eyebrow", "What gets charged")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.prosecution.title",
            "Which complaints become court cases, and what the Commission claims they cost",
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.prosecution.lede",
            "Of the {{total}} complaints on the Commission's books in {{fy}}, {{filed}} became cases in court — {{pct}}. This page looks at which complaints make that journey, how the mix has changed, and how much money the Commission says was at stake.",
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
            label={t("research.corruption.prosecution.tileCorpus", "Corruption cases filed in court")}
            note={t("research.corruption.tile.corpusNote", "over {{years}} fiscal years, money laundering excluded", {
              years: corpus.fiscalYears.length,
            })}
          />
          <StatTile
            value={n(Math.round(corpus.avgFiledPerYear))}
            label={t("research.corruption.prosecution.tileRate", "Filed per year, on average")}
            note={t("research.corruption.prosecution.tileRateNote", "across the whole window")}
          />
          <StatTile
            value={`Rs ${bigoTotalBn.toFixed(1)}bn`}
            label={t("research.corruption.prosecution.tileBigo", "Total amount claimed")}
            note={t("research.corruption.prosecution.tileBigoNote", "across the {{n}} fiscal years the Commission reports a total", {
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
                "Cases are grouped by the fiscal year in which they were filed. The chart covers {{n}} cases, including cases that could not be assigned to a specific offence type, which are listed under \u201cOther offences\u201d. Illegal benefit cases appear in some earlier years as well, though in smaller numbers.",
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

        <Body>
          {t(
            "research.corruption.prosecution.mixBody",
            "Cases involving fake credentials accounted for {{firstShare}} of cases filed in {{firstFy}}, compared with {{lastShare}} in {{lastFy}}. Over the same period, the distribution of cases across offence types changed. The figures show how the composition of cases filed in court varied over time.",
            {
              firstShare: pct(fakeShare(mixFirst)),
              firstFy: fy(mixFirst.fy),
              lastFy: fy(mixLast.fy),
              lastShare: pct(fakeShare(mixLast)),
            },
          )}
        </Body>
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
            "Cases differ in how many people are charged together. This chart shows the average number of defendants in decided cases for each offence type at the Special Court.",
          )}
        </Body>

        <Figure
          title={t("research.corruption.size.howToTitle", "How to read this chart")}
          subtitle={t(
            "research.corruption.size.howTo",
            "Two different measurements, side by side. The first column is a count of people: the average number of defendants per decided case. The second is a share of cases: how often that charge was upheld in full. Offences charged against fewer people tend to show higher full-conviction rates, but these figures do not establish why, and neither column explains the other.",
          )}
          caption={t(
            "research.corruption.size.chartCaption",
            "Counted from the defendant side of the court's own party list. A defendant is a position on a charge sheet rather than a resolved individual, so someone charged in two cases is counted twice.",
          )}
        >
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
        </Figure>



        <GapCallout
          label={t("research.corruption.gap.bLabel", "Accountability gap · Prosecution decisions")}
          title={t(
            "research.corruption.gap.bTitle",
            "Can an acquittal turn on who was left out of the charge sheet?",
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          fixLabel={t("research.corruption.gap.unresolved", "What remains unresolved")}
          shows={
            <>
              {t(
                "research.corruption.gap.bEstablishes",
                "In case 080-CR-0047, the Special Court acquitted all three defendants on 2081/01/18, holding that charging only some of the people it considered equally responsible was inconsistent with equal justice. The Commission appealed on 2081/11/09, arguing that the court had intervened in a decision constitutionally entrusted to prosecutors. The appeal remains pending.",
              )}{" "}
              <Cite href={JALAHARI.case}>
                {t("research.corruption.gap.bCite", "The case, with sources")}
              </Cite>
              {" · "}
              <Cite href={JALAHARI.trial}>
                {t("research.corruption.gap.bCiteTrial", "Trial record 080-CR-0047")}
              </Cite>
              {" · "}
              <Cite href={JALAHARI.appeal}>
                {t("research.corruption.gap.bCiteAppeal", "Appeal 081-CR-1635")}
              </Cite>
            </>
          }
          fix={t(
            "research.corruption.gap.bNeeded",
            "The Supreme Court has yet to settle the issue in this pending appeal. Meanwhile, the available records do not identify people who were similarly placed but not charged, making it impossible to measure how often comparable situations arise.",
          )}
        >
          {t(
            "research.corruption.gap.bCaveat",
            "One judgment does not establish a pattern of selective prosecution. An uncharged person, a rejected charge or an allegation of bias is not enough to establish it. This case matters because the Special Court gave reasons for its finding, while the legal question remains unresolved on appeal.",
          )}
        </GapCallout>

        <GapCallout
          label={t("research.corruption.gap.gLabel", "Accountability gap · Charge calculation")}
          title={t(
            "research.corruption.gap.gTitle",
            "The Supreme Court set out how illicit enrichment should be calculated. Can charge sheets be checked against that rule?",
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          fixLabel={t("research.corruption.gap.unresolved", "What remains unresolved")}
          shows={
            <>
              {t(
                "research.corruption.gap.gEstablishes",
                "In 2072, the Supreme Court set out a rule for calculating illicit enrichment: where the source of funds used to acquire property cannot be established, the calculation should be based on the original investment, rather than the property's current value. The Commission's FY2078/79 annual report quotes the ruling and presents a different position on its application.",
              )}{" "}
              <Cite href={CIAA_2078_79}>
                {t("research.corruption.gap.gCite", "CIAA annual report FY2078/79, quoting ने.का.प. २०७२, नि.नं. ९५०५")}
              </Cite>
            </>
          }
          fix={t(
            "research.corruption.gap.gNeeded",
            "The case register does not record both the amount claimed by the Commission and the amount upheld by the court, alongside the method used to calculate each. Without these fields, it is not possible to systematically compare charge sheets with the Supreme Court's ruling.",
          )}
        >
          <>
            <p>
              {t(
                "research.corruption.gap.gBody",
                "Of {{n}} decided illicit-enrichment cases in the dataset, {{acq}} ended in acquittal and {{conv}} were upheld in full, compared with {{avg}} across all offences.",
                {
                  n: n(ieDecided),
                  acq: n(ie ? ie.acquitted : 0),
                  conv: pct(ieDecided ? ((ie?.convicted ?? 0) / ieDecided) * 100 : 0),
                  avg: pct1(fullOnlyAvg),
                },
              )}
            </p>
            <p className="mt-3">
              {t(
                "research.corruption.gap.gBody2",
                "The annual reports document disputes over income, property valuation and the amount alleged. But the available data cannot establish how often the Commission's calculations departed from the ruling, or whether those disputes explain the acquittal rate.",
              )}
            </p>
          </>
        </GapCallout>

        <Figure
          title={t(
            "research.corruption.month.title",
            "Average cases filed, by Nepali month",
          )}
          subtitle={t(
            "research.corruption.month.subtitle",
            "Across {{years}} complete fiscal years. The whisker is one standard deviation either side; {{peak}} is highlighted.",
            { years: corpus.fiscalYears.length, peak: peakMonth.name },
          )}
          caption={t(
            "research.corruption.month.caption",
            "Averaged over {{years}} fiscal years. The spread is wide enough that any single year can look nothing like this shape.",
            { years: corpus.fiscalYears.length },
          )}
        >
          <FiledByMonth
            data={filedByMonth}
            peakMonth={peakMonth.month}
            meanLabel={t("research.corruption.month.mean", "mean filings")}
            sdLabel={t("research.corruption.month.sd", "±1 SD")}
          />
        </Figure>

        <Body>
          {t(
            "research.corruption.month.body",
            "{{peak}}, the final month of Nepal's fiscal year, sees an average of {{peakMean}} cases filed by the Commission, compared with {{otherMean}} in each of the other eleven months — nearly {{morePct}} more than the monthly average for the rest of the year. The figures establish a clear year-end concentration in filings, but do not explain why it occurs. Whether this reflects investigation timelines, institutional deadlines or other factors cannot be determined from the available data.",
            {
              peak: peakMonth.name,
              peakMean: peakMonth.mean.toFixed(1),
              otherMean: otherMonthMean.toFixed(1),
              morePct: `${Math.round((peakMonth.mean / otherMonthMean - 1) * 100)}%`,
            },
          )}
        </Body>

        <GapCallout
          label={t("research.corruption.gap.kLabel", "Accountability gap · Filing patterns")}
          title={t(
            "research.corruption.gap.kTitle",
            "Court filings rise sharply in {{peak}}. The reason is not reported.",
            { peak: peakMonth.name },
          )}
          intro={t(
            "research.corruption.gap.kIntro",
            "The Commission filed an average of {{peakMean}} cases in {{peak}}, the final month of the Nepali fiscal year, compared with {{otherMean}} in each of the other eleven months. The analysis covers {{years}} complete fiscal years. Variation between years is substantial, so the monthly average does not describe every year's pattern.",
            {
              peak: peakMonth.name,
              peakMean: peakMonth.mean.toFixed(1),
              otherMean: otherMonthMean.toFixed(1),
              years: corpus.fiscalYears.length,
            },
          )}
          showsLabel={t("research.corruption.gap.figuresShow", "What the figures show")}
          fixLabel={t("research.corruption.gap.unresolved", "What remains unresolved")}
          shows={t(
            "research.corruption.gap.kEstablishes",
            "Filings are concentrated towards the end of the fiscal year. The data establish when cases are filed, but not why.",
          )}
          fix={t(
            "research.corruption.gap.kNeeded",
            "The published records do not explain whether the concentration reflects investigation timelines, administrative deadlines, case-readiness or other factors. Without information on when investigations were completed and cases were approved for prosecution, the reasons for the year-end increase cannot be distinguished.",
          )}
        />

        <GapCallout
          label={t("research.corruption.gap.iLabel", "Accountability gap · Investigation timelines")}
          title={t(
            "research.corruption.gap.iTitle",
            "The clock starts at filing. The time before prosecution remains unmeasured.",
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          fixLabel={t("research.corruption.gap.measurable", "What would make it measurable")}
          shows={t(
            "research.corruption.gap.iEstablishes",
            "The court register records when a case is filed, but the published data do not provide the date each complaint was registered or how long the investigation took. The time between a complaint and the decision to prosecute therefore cannot be calculated. By contrast, the time from filing to verdict at the Special Court can be measured: the median is 15 months.",
          )}
          fix={t(
            "research.corruption.gap.iNeeded",
            "Recording the complaint registration date and the date of the prosecution decision for each case would allow investigation and decision-making times to be calculated.",
          )}
        >
          {t(
            "research.corruption.gap.iBody",
            "This leaves a significant gap in the accountability record: the duration of court proceedings can be measured, but the time taken before a case reaches court cannot. Without those dates, delays before prosecution cannot be systematically assessed.",
          )}
        </GapCallout>

        <GapCallout
          label={t("research.corruption.gap.jLabel", "Accountability gap · Financial claims")}
          title={t(
            "research.corruption.gap.jTitle",
            "Rs {{bn}} billion claimed. The amount upheld by courts remains untracked.",
            { bn: bigoTotalBn.toFixed(1) },
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          fixLabel={t("research.corruption.gap.unresolved", "What remains unresolved")}
          shows={t(
            "research.corruption.gap.jEstablishes",
            "Across the {{n}} fiscal years for which the annual reports provide a total, the Commission claimed Rs {{bn}} billion in बिगो — the alleged loss or unlawful gain in its charge sheets. Three other reports in the {{all}}-year period provide no annual total, and the {{lastFy}} report has not yet been published. Annual claims varied from Rs {{lo}} billion to Rs {{hi}} billion; a small number of large cases can substantially affect the yearly total.",
            {
              n: bigoDemanded.length,
              bn: bigoTotalBn.toFixed(1),
              all: corpus.fiscalYears.length,
              lastFy: "2082/83",
              lo: (Math.min(...bigoDemanded.map((r) => r.rs)) / 1e9).toFixed(1),
              hi: (Math.max(...bigoDemanded.map((r) => r.rs)) / 1e9).toFixed(1),
            },
          )}
          fix={t(
            "research.corruption.gap.jNeeded",
            "The case register does not systematically record the amount claimed alongside the amount upheld by the court. A verdict alone does not provide a consistent basis for calculating the difference across cases.",
          )}
        >
          {t(
            "research.corruption.gap.jBody",
            "In one judgment examined in full, a claim involving 1,491 grams of gold was reduced to about 58 grams. That example illustrates why claimed and upheld amounts need to be recorded separately, but it does not establish how frequently such reductions occur. Without comparable figures for both amounts, the overall difference between the Commission's claims and court outcomes cannot be measured.",
          )}
        </GapCallout>
      </Block>
    </>
  );
}
