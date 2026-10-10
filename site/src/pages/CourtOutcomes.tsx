import { useTranslation } from "react-i18next";

import { StatusDonut, type DonutSegment } from "@/components/data-quality/StatusDonut";
import { ConvictionByCharge, type ChargeRow } from "@/components/research/ConvictionByCharge";
import { FiledByMonth } from "@/components/research/FiledByMonth";
import { FiledDecidedTrend } from "@/components/research/FiledDecidedTrend";
import { JusticeSpread } from "@/components/research/JusticeSpread";
import { PipelineHealth, type PipelinePoint } from "@/components/research/PipelineHealth";
import { RateTrend, type RatePoint } from "@/components/research/RateTrend";
import {
  Block,
  Body,
  Caveat,
  Cite,
  Eyebrow,
  Figure,
  Lede,
  SectionHeading,
  StatRow,
  StatTile,
  Unknown,
} from "@/components/layout/Prose";
import {
  CITATIONS,
  REPORT,
  decidedClean,
  fyLabel,
  outcomePct,
  verdictYearRates,
} from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

/** Band thresholds for the bench chart — preserved from the original page. */
const BAND_HIGH = 55;
const BAND_LOW = 37;

export default function CourtOutcomes() {
  const { t, language } = useTranslation();
  const { n, pct, pct1 } = useFormat();
  const {
    byCharge,
    corpus,
    filedByMonth,
    justiceMinDecisions,
    justices,
    outcome,
    overTime,
    rates,
    trend,
    verdictsModelDerivedExcluded,
  } = REPORT;

  const decided = decidedClean(outcome);
  const convPct = (outcome.convicted / decided) * 100;
  const partPct = (outcome.partial / decided) * 100;
  const acqPct = (outcome.acquitted / decided) * 100;
  const ofDecided = (v: number) =>
    t("research.corruption.tile.ofDecided", "{{pct}} of decided", { pct: pct1(v) });

  const charge = (en: string) => {
    const c = byCharge.find((x) => x.en === en);
    if (!c) return { pct: 0, share: 0, decided: 0 };
    const d = c.convicted + c.partial + c.acquitted;
    return {
      pct: outcomePct(c, "convicted"),
      share: (c.convicted / outcome.convicted) * 100,
      decided: d,
    };
  };
  const fake = charge("Fake credential");
  const bribery = charge("Bribery");

  // What is left once the two charges that carry the court are removed.
  const rest = byCharge.reduce(
    (acc, c) => {
      if (c.en === "Fake credential" || c.en === "Bribery") return acc;
      return { cv: acc.cv + c.convicted, dec: acc.dec + c.convicted + c.partial + c.acquitted };
    },
    { cv: 0, dec: 0 },
  );
  const restPct = rest.dec ? (rest.cv / rest.dec) * 100 : 0;
  const chargeDecidedTotal = byCharge.reduce((s, c) => s + c.convicted + c.partial + c.acquitted, 0);

  const segments: DonutSegment[] = [
    { key: "convicted", label: t("research.corruption.outcome.convicted", "Convicted"), value: outcome.convicted, color: "hsl(var(--primary))" },
    { key: "partial", label: t("research.corruption.outcome.partial", "Partial"), value: outcome.partial, color: "hsl(var(--alert))" },
    { key: "acquitted", label: t("research.corruption.outcome.acquitted", "Acquitted"), value: outcome.acquitted, color: "hsl(var(--accent))" },
  ];

  const chargeRows: ChargeRow[] = byCharge.map((c) => ({
    label: language === "ne" ? c.ne : c.en,
    sublabel: language === "ne" ? c.en : c.ne,
    convicted: c.convicted,
    partial: c.partial,
    acquitted: c.acquitted,
  }));

  const yearRates = verdictYearRates(overTime.byVerdictYear);
  const ratePoints: RatePoint[] = yearRates.map((r) => ({
    year: r.year,
    convPct: r.convPct,
    acqPct: r.acqPct,
    coreConvPct: r.coreConvPct,
    fakeSharePct: r.fakeSharePct,
  }));

  const pipeline: PipelinePoint[] = overTime.cohorts.map((c) => {
    const complete = c.fy <= overTime.completeThroughFy;
    return {
      year: c.fy,
      pending: c.pending,
      monthsSolid: complete ? c.medianMonths : null,
      monthsProvisional: complete ? null : c.medianMonths,
    };
  });
  const settled = overTime.cohorts.filter((c) => c.fy <= overTime.completeThroughFy);
  const slowest = settled.reduce((a, b) => (b.medianMonths > a.medianMonths ? b : a), settled[0]);
  const fastest = settled.reduce((a, b) => (b.medianMonths < a.medianMonths ? b : a), settled[0]);
  const backlog = overTime.cohorts.reduce((s, c) => s + c.pending, 0);

  const courtAvg = rates.convictionPct;
  const justiceDecisions = justices.reduce((s, j) => s + j.decisions, 0);

  const peak = filedByMonth.reduce((a, b) => (b.mean > a.mean ? b : a), filedByMonth[0]);
  const trough = filedByMonth.reduce((a, b) => (b.mean < a.mean ? b : a), filedByMonth[0]);

  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.outcomes.eyebrow", "What the court decides")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.outcomes.title",
            "One number, two completely different stories inside it",
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.outcomes.lede2",
            "Across {{decided}} cases with a clear verdict, {{rate}} ended in conviction in whole or in part, {{full}} in full. Quoted alone that number is close to meaningless, because it averages an offence the court upholds nine times in ten with offences it upholds one time in five.",
            { decided: n(decided), rate: pct1(rates.convictionPct), full: pct1(rates.convictionFullOnlyPct) },
          )}
        </Lede>

        <StatRow>
          <StatTile value={n(outcome.convicted)} label={t("research.corruption.tile.full", "Full convictions")} note={ofDecided(convPct)} />
          <StatTile value={n(outcome.partial)} label={t("research.corruption.tile.partial", "Partial convictions")} note={ofDecided(partPct)} />
          <StatTile value={n(outcome.acquitted)} label={t("research.corruption.tile.acquitted", "Acquittals")} note={ofDecided(acqPct)} />
          <StatTile value={n(outcome.ongoing)} label={t("research.corruption.tile.ongoing", "Still awaiting a verdict")} note={t("research.corruption.tile.ongoingNote", "open cases in the register")} />
        </StatRow>

        <Figure
          title={t("research.corruption.donut.title", "How decided cases end")}
          subtitle={t(
            "research.corruption.donut.subtitle",
            "The court codes one verdict per case as upheld, upheld in part, or cleared. The three are mutually exclusive.",
          )}
          caption={t(
            "research.corruption.donut.caption",
            "A partial conviction is where a mixed bench lands — some accused convicted and others cleared, or conviction on some counts only. Because no per-accused outcome is published anywhere, a partial cannot be resolved into how many people were actually convicted. That is why this site reports both a full-only rate and a full-plus-partial rate and never picks one silently.",
          )}
        >
          <StatusDonut
            segments={segments}
            centerValue={n(decided)}
            centerLabel={t("research.corruption.donut.center", "decided cases")}
          />
        </Figure>
      </Block>

      <Block>
        {/*
          PRESERVED FIGURE — "Conviction depends overwhelmingly on what was charged".
          Same component, same rows, same denominator and the same per-case (never
          per-accused) rule as the original page. Only its placement and the prose
          around it changed; it sits here, immediately after the headline rate, because
          this is the chart that tells you how to read that rate.
        */}
        <Figure
          title={t(
            "research.corruption.byCharge.title2",
            "Conviction depends overwhelmingly on what was charged",
          )}
          subtitle={t(
            "research.corruption.byCharge.subtitle",
            "Decided cases per offence family, split by outcome and sorted by how often the charge is upheld in full.",
          )}
          caption={
            <>
              {t(
                "research.corruption.byCharge.caption",
                "Covers {{n}} of the {{clean}} cases with a clear verdict; the rest carry charge text that could not be classified. Money laundering keeps its own row even though it sits outside the substantive corpus, because it is prosecuted under a separate statute. Every rate is per case, never per accused.",
                { n: n(chargeDecidedTotal), clean: n(decided) },
              )}{" "}
              <Cite href={CITATIONS.chargeSheets}>
                {t("research.corruption.byCharge.source", "Charge sheets")}
              </Cite>
            </>
          }
        >
          <ConvictionByCharge
            rows={chargeRows}
            avgPct={convPct}
            seriesLabels={{
              convicted: t("research.corruption.outcome.convicted", "Convicted"),
              partial: t("research.corruption.outcome.partial", "Partial"),
              acquitted: t("research.corruption.outcome.acquitted", "Acquitted"),
            }}
            avgLabel={t("research.corruption.byCharge.avg", "court avg {{pct}}%", { pct: Math.round(convPct) })}
          />
        </Figure>

        <Body>
          {t(
            "research.corruption.byCharge.body2",
            "Fake-credential cases are upheld in full {{fakePct}} of the time and alone account for about {{fakeShare}} of every full conviction here. Bribery, the next largest charge, converts at {{briberyPct}} across {{briberyDecided}} decided cases. Strip those two out and the rest of the docket — embezzlement, loss to the state, illicit enrichment, irregularity — is upheld in full just {{restPct}} of the time.",
            {
              fakePct: pct(fake.pct),
              fakeShare: pct(fake.share),
              briberyPct: pct(bribery.pct),
              briberyDecided: n(bribery.decided),
              restPct: pct(restPct),
            },
          )}
        </Body>

        <Caveat>
          {t(
            "research.corruption.outcomes.derived",
            "{{n}} further cases carry a disposition that was read out of the court's written judgment rather than published on a cause list. Every rate on this site excludes them, and the count is shown here so the exclusion is a visible number rather than a silent filter.",
            { n: n(verdictsModelDerivedExcluded) },
          )}
        </Caveat>
      </Block>

      <Block>
        <Eyebrow>{t("research.corruption.overTime.eyebrow", "How the docket moved")}</Eyebrow>
        <SectionHeading>
          {t("research.corruption.overTime.title", "The conviction rate moved because the charges changed")}
        </SectionHeading>

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
            "research.corruption.rateTrend.body2",
            "The dashed line answers the question the solid line raises. Take the documentary cases out and the rest of the docket does not collapse the same way. The headline fell mostly because the easy charge left, not because the court hardened against serious graft.",
          )}
        </Body>

        <Caveat>
          {t(
            "research.corruption.overTime.caveat",
            "The most recent fiscal years are incomplete by construction: cases filed recently have had less time to reach a verdict, so their rates sit on small numbers and will move. Treat the final bars on every chart here as provisional.",
          )}
        </Caveat>
      </Block>

      <Block>
        <Eyebrow>{t("research.corruption.pace.eyebrow", "Pace and backlog")}</Eyebrow>
        <SectionHeading>
          {t("research.corruption.pace.title", "How long a case takes, and what is still waiting")}
        </SectionHeading>

        <Figure
          title={t("research.corruption.pipeline.title", "How long a case takes, and what is still waiting")}
          subtitle={t(
            "research.corruption.pipeline.subtitle",
            "By the fiscal year a case was filed: bars are cases still awaiting a verdict, the line is the median months to decision.",
          )}
          caption={t(
            "research.corruption.pipeline.caption",
            "Cohorts through {{complete}} are essentially fully adjudicated, so their medians are settled. Later cohorts are still open and shown dashed: their medians are drawn only from the cases that have already finished, which makes them look faster than they will turn out to be.",
            { complete: fyLabel(overTime.completeThroughFy) },
          )}
        >
          <PipelineHealth
            data={pipeline}
            monthsLabel={t("research.corruption.pipeline.months", "median months to verdict")}
            backlogLabel={t("research.corruption.pipeline.backlog", "still awaiting a verdict")}
            provisionalLabel={t("research.corruption.pipeline.provisional", "provisional")}
          />
        </Figure>

        <Body>
          {t(
            "research.corruption.pipeline.body",
            "Among the settled cohorts the median ran from about {{fast}} months for cases filed in {{fastYear}} to about {{slow}} months for {{slowYear}}. {{backlog}} cases across all cohorts are still waiting.",
            {
              fast: Math.round(fastest.medianMonths),
              fastYear: fyLabel(fastest.fy),
              slow: Math.round(slowest.medianMonths),
              slowYear: fyLabel(slowest.fy),
              backlog: n(backlog),
            },
          )}
        </Body>

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

        <Figure
          title={t("research.corruption.month.title", "When in the year cases get filed")}
          subtitle={t(
            "research.corruption.month.subtitle",
            "Mean cases filed per Nepali month, with one standard deviation either side.",
          )}
          caption={t(
            "research.corruption.month.caption",
            "Averaged across complete fiscal years. Filings peak in {{peak}} at the close of the fiscal year and fall away in {{trough}} during the festival period. The spread is wide enough that a single year can look nothing like this shape.",
            { peak: peak.name, trough: trough.name },
          )}
        >
          <FiledByMonth
            data={filedByMonth}
            meanLabel={t("research.corruption.month.mean", "mean filings")}
            sdLabel={t("research.corruption.month.sd", "±1 SD")}
          />
        </Figure>
      </Block>

      <Block>
        <Eyebrow>{t("research.corruption.benches.eyebrow", "Who decides")}</Eyebrow>
        <SectionHeading>
          {t("research.corruption.benches.title2", "Which panel you draw is a material fact about your case")}
        </SectionHeading>
        <Body>
          {t(
            "research.corruption.benches.lede",
            "The court's overall rate is {{avg}}%. The benches that make it up range from well above that to well below — a spread wide enough that which panel heard a case is a material fact about its outcome.",
            { avg: Math.round(courtAvg) },
          )}
        </Body>

        <Figure
          title={t("research.corruption.justice.title", "Conviction rate by justice")}
          subtitle={t(
            "research.corruption.justice.subtitle",
            "Each dot is a justice; its size is how many decisions they sat on. Position is the rate across those benches.",
          )}
          caption={t(
            "research.corruption.justice.caption",
            "Justices who sat on at least {{min}} decided cases — {{n}} of them; below that a rate turns on a handful of verdicts and means very little. Because every member of a panel is credited with the panel's outcome, these {{n}} justices are credited with {{decisions}} decisions between them, far more than the {{cases}} cases those decisions came from.",
            {
              min: justiceMinDecisions,
              n: justices.length,
              decisions: n(justiceDecisions),
              cases: n(decided),
            },
          )}
        >
          <JusticeSpread
            justices={justices}
            avgPct={courtAvg}
            bandLabels={{
              high: t("research.corruption.justice.bandHigh", "Convicts more (>{{pct}}%)", { pct: BAND_HIGH }),
              mid: t("research.corruption.justice.bandMid", "Near average"),
              low: t("research.corruption.justice.bandLow", "Acquits more (<{{pct}}%)", { pct: BAND_LOW }),
            }}
            avgLabel={t("research.corruption.justice.avgLine", "court avg {{pct}}%", { pct: Math.round(courtAvg) })}
          />
        </Figure>

        <Caveat>
          {t(
            "research.corruption.justice.caveat",
            "This is a property of benches, not of judges. The court records one verdict per case and no individual vote, so a justice who dissented is credited with the panel's outcome exactly as if they had written it. Almost every case here was heard by a panel of two or three. Read this as the benches a justice sat on — never as that justice's own record, and never as a measure of how they rule.",
          )}
        </Caveat>

        <Unknown title={t("research.corruption.outcomes.unknownTitle", "Not in the court record")}>
          {t(
            "research.corruption.outcomes.unknownBody",
            "How much of the बिगो the Commission claimed was actually upheld, and how many individual defendants were convicted in a case recorded as a partial. The register carries one verdict per case and no amount, so neither can be derived from it — they are absent here rather than estimated at zero.",
          )}
        </Unknown>
      </Block>
    </>
  );
}
