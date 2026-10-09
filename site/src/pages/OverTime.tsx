import { useTranslation } from "react-i18next";

import { ChargeMixByYear } from "@/components/research/ChargeMixByYear";
import { FiledByMonth } from "@/components/research/FiledByMonth";
import { FiledDecidedTrend } from "@/components/research/FiledDecidedTrend";
import { RateTrend, type RatePoint } from "@/components/research/RateTrend";
import { Block, Body, Caveat, Eyebrow, Figure, Lede, SectionHeading } from "@/components/layout/Prose";
import { REPORT, fyLabel, verdictYearRates } from "@/data/research-corruption";

const n = (v: number) => v.toLocaleString();

export default function OverTime() {
  const { t } = useTranslation();
  const { chargeMixByYear, corpus, filedByMonth, overTime, trend } = REPORT;

  const rates = verdictYearRates(overTime.byVerdictYear);
  const ratePoints: RatePoint[] = rates.map((r) => ({
    year: r.year,
    convPct: r.convPct,
    acqPct: r.acqPct,
    coreConvPct: r.coreConvPct,
    fakeSharePct: r.fakeSharePct,
  }));

  const mixTotal = chargeMixByYear.reduce(
    (s, r) => s + r.bribery + r.fake + r.embezzlement + r.benefit + r.loss + r.other,
    0,
  );
  const peak = filedByMonth.reduce((a, b) => (b.mean > a.mean ? b : a), filedByMonth[0]);
  const trough = filedByMonth.reduce((a, b) => (b.mean < a.mean ? b : a), filedByMonth[0]);
  const first = rates[0];
  const last = rates[rates.length - 1];

  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.overTime.eyebrow", "How the docket moved")}</Eyebrow>
        <SectionHeading>
          {t("research.corruption.overTime.title", "The conviction rate moved because the charges changed")}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.overTime.lede",
            "Read on its own, the outcome trend looks like a court becoming less willing to convict. It is mostly something duller and more important: the mix of charges arriving at the court shifted away from the documentary offence that almost always convicts.",
          )}
        </Lede>
      </Block>

      <Block>
        <Figure
          title={t("research.corruption.rateTrend.title", "Outcome rates by verdict year")}
          subtitle={t(
            "research.corruption.rateTrend.subtitle",
            "Full-conviction and acquittal rates, with the same conviction rate recomputed after removing fake-credential cases.",
          )}
          caption={t(
            "research.corruption.rateTrend.caption",
            "Keyed on the fiscal year the verdict was delivered, not the year the case was filed — so a single case appears in a different bar here than on the filing charts below. The dashed line is the rate once documentary fake-credential cases are taken out; the gap between the two lines is how much of the headline those cases were carrying.",
          )}
        >
          <RateTrend
            data={ratePoints}
            series={[
              { key: "convPct", label: t("research.corruption.rateTrend.conv", "Full conviction"), color: "hsl(var(--primary))" },
              { key: "acqPct", label: t("research.corruption.rateTrend.acq", "Acquittal"), color: "hsl(var(--accent))" },
              {
                key: "coreConvPct",
                label: t("research.corruption.rateTrend.core", "Full conviction, excluding fake credential"),
                color: "hsl(var(--primary))",
                dashed: true,
              },
            ]}
          />
        </Figure>
        <Body>
          {t(
            "research.corruption.rateTrend.body",
            "In {{firstYear}} fake-credential cases were {{firstShare}}% of everything the court decided. By {{lastYear}} they were {{lastShare}}%. A rate that falls while the easy charge disappears from the docket is not the same finding as a court that has grown reluctant to convict, and should not be reported as one.",
            {
              firstYear: fyLabel(first.year),
              firstShare: Math.round(first.fakeSharePct),
              lastYear: fyLabel(last.year),
              lastShare: Math.round(last.fakeSharePct),
            },
          )}
        </Body>
      </Block>

      <Block>
        <Figure
          title={t("research.corruption.mix.title", "What the Commission charged, year by year")}
          subtitle={t("research.corruption.mix.subtitle", "Share of prosecutions filed each fiscal year, by offence family.")}
          caption={t(
            "research.corruption.mix.caption",
            "Keyed on the year of filing. These rows cover {{n}} cases — more than the substantive corpus, because the unclassifiable matters stay inside Other rather than being dropped. Illegal benefit is not strictly absent from the early years; it is barely used, which is a different claim.",
            { n: n(mixTotal) },
          )}
        >
          <ChargeMixByYear
            data={chargeMixByYear}
            labels={{
              bribery: t("research.corruption.mix.bribery", "Bribery"),
              fake: t("research.corruption.mix.fake", "Fake credential"),
              embezzlement: t("research.corruption.mix.embezzlement", "Embezzlement"),
              benefit: t("research.corruption.mix.benefit", "Illegal benefit"),
              loss: t("research.corruption.mix.loss", "Loss to government"),
              other: t("research.corruption.mix.other", "Other"),
            }}
            percentLabel={t("research.corruption.mix.percent", "share of filings")}
          />
        </Figure>
      </Block>

      <Block>
        <Figure
          title={t("research.corruption.trend.title", "Cases filed and cases decided")}
          subtitle={t(
            "research.corruption.trend.subtitle",
            "Filings keyed on the year of registration; decisions on the year the verdict landed.",
          )}
          caption={t(
            "research.corruption.trend.caption",
            "The two lines count different events, so they are not expected to meet in any given year — a case filed in one year is commonly decided two or three years later. Filings across the {{years}} fiscal years sum to the full {{corpus}}-case archive.",
            { years: corpus.fiscalYears.length, corpus: n(corpus.ciaaProsecutions) },
          )}
        >
          <FiledDecidedTrend
            years={trend.years}
            filed={trend.filed}
            decided={trend.decided}
            filedLabel={t("research.corruption.trend.filed", "Filed")}
            decidedLabel={t("research.corruption.trend.decided", "Decided")}
          />
        </Figure>
      </Block>

      <Block>
        <Figure
          title={t("research.corruption.month.title", "When in the year cases get filed")}
          subtitle={t("research.corruption.month.subtitle", "Mean cases filed per Nepali month, with one standard deviation either side.")}
          caption={t(
            "research.corruption.month.caption",
            "Averaged across complete fiscal years. Filings peak in {{peak}} at the close of the fiscal year and fall away in {{trough}} during the festival period. The spread is wide enough that a single year can look nothing like this shape.",
            { peak: peak.name, trough: trough.name },
          )}
        >
          <FiledByMonth
            data={filedByMonth}
            peakMonth={peak.month}
            meanLabel={t("research.corruption.month.mean", "mean filings")}
            sdLabel={t("research.corruption.month.sd", "±1 SD")}
          />
        </Figure>

        <Caveat>
          {t(
            "research.corruption.overTime.caveat",
            "The most recent fiscal years are incomplete by construction: cases filed recently have had less time to reach a verdict, so their rates sit on small numbers and will move. Treat the final bars on every chart here as provisional.",
          )}
        </Caveat>
      </Block>
    </>
  );
}
