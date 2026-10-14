import { useTranslation } from "react-i18next";

import { StatusDonut, type DonutSegment } from "@/components/data-quality/StatusDonut";
import { ConvictionByCharge, type ChargeRow } from "@/components/research/ConvictionByCharge";
import { KeyFinding } from "@/components/research/KeyFinding";
import { GapCallout } from "@/components/research/GapCallout";
import { FiledDecidedTrend } from "@/components/research/FiledDecidedTrend";
import { PipelineHealth, type PipelinePoint } from "@/components/research/PipelineHealth";
import { ReadingNotes } from "@/components/research/ReadingNotes";
import { RateTrend, type RatePoint } from "@/components/research/RateTrend";
import {
  Block,
  Caveat,
  Cite,
  Eyebrow,
  Figure,
  Lede,
  SectionHeading,
  StatRow,
  StatTile,
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

export default function CourtOutcomes() {
  const { t, language } = useTranslation();
  const { n, pct, pct1 } = useFormat();
  const {
    byCharge,


    outcome,
    overTime,
    rates,
    trend,
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
  // The cohort still carrying most of that backlog, named so the figure is not left
  // looking like a court-wide pile-up when it is mostly the newest year.
  const heaviestPending = overTime.cohorts.reduce(
    (a, b) => (b.pending > a.pending ? b : a),
    overTime.cohorts[0],
  );
  const firstProvisional = overTime.cohorts.find((c) => c.fy > overTime.completeThroughFy);

  // Peaks on the two lines below, read off the series rather than typed in.
  const peakOf = (series: readonly number[]) => {
    let at = 0;
    series.forEach((v, i) => {
      if (v > series[at]) at = i;
    });
    return { fy: trend.years[at], value: series[at] };
  };
  const peakFiled = peakOf(trend.filed);
  const peakDecided = peakOf(trend.decided);
  const filedTotal = trend.filed.reduce((s, v) => s + v, 0);
  const decidedTotal = trend.decided.reduce((s, v) => s + v, 0);
  const peakLagYears = peakDecided.fy - peakFiled.fy;



  return (
    <>
      <Block id="how-cases-end">
        <Eyebrow>{t("research.corruption.outcomes.eyebrow", "What the court decides")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.outcomes.title",
            "One conviction rate can hide very different outcomes",
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.outcomes.lede2",
            "Across {{decided}} cases with a clear verdict, {{rate}} resulted in conviction in whole or in part, while {{full}} resulted in full conviction. But these overall figures hide major differences between offences. Courts uphold some types of charges in nearly 90% of cases, while others succeed in only about 20%. A single conviction rate does not show these differences.",
            { decided: n(decided), rate: pct1(rates.convictionPct), full: pct1(rates.convictionFullOnlyPct) },
          )}
        </Lede>

        <StatRow>
          <StatTile value={n(outcome.convicted)} label={t("research.corruption.tile.full", "Full convictions")} note={ofDecided(convPct)} />
          <StatTile value={n(outcome.partial)} label={t("research.corruption.tile.partial", "Partial convictions")} note={ofDecided(partPct)} />
          <StatTile value={n(outcome.acquitted)} label={t("research.corruption.tile.acquitted", "Acquittals")} note={ofDecided(acqPct)} />
          <StatTile value={n(outcome.ongoing)} label={t("research.corruption.tile.ongoing", "Still awaiting a verdict")} note={t("research.corruption.tile.ongoingNote", "cases the register marks as still running")} />
        </StatRow>

        <Figure
          title={t("research.corruption.donut.title", "How decided cases end")}
          subtitle={t(
            "research.corruption.donut.subtitle",
            "The court codes one verdict per case as upheld, upheld in part, or cleared. The three are mutually exclusive.",
          )}
          caption={t(
            "research.corruption.donut.caption",
            "A partial conviction is some accused convicted and others cleared, or conviction on some counts only. This site therefore reports a full-only rate and a full-plus-partial rate side by side, and never picks one silently.",
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
            "Conviction depends on the charge",
          )}
          subtitle={t(
            "research.corruption.byCharge.subtitle",
            "Decided cases per offence family, split by outcome and sorted by how often the charge is upheld in full.",
          )}
          caption={
            <>
              {t(
                "research.corruption.byCharge.caption",
                "Each bar is one offence type, split into the three outcomes a court can record. Rates are per case, never per accused. Covers {{n}} of the {{clean}} decided cases; the rest carry charge text that could not be classified.",
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

        <KeyFinding
          label={t("research.corruption.byCharge.keyLabel", "The finding")}
          stats={[
            {
              value: pct(fake.pct),
              caption: t("research.corruption.byCharge.keyFake", "of fake-credential cases upheld in full — the highest of any charge"),
            },
            {
              value: pct(bribery.pct),
              caption: t("research.corruption.byCharge.keyBribery", "of bribery cases, the next largest category, across {{n}} decided cases", {
                n: n(bribery.decided),
              }),
            },
            {
              value: pct(restPct),
              caption: t("research.corruption.byCharge.keyRest", "for every other offence combined"),
            },
          ]}
        >
          <p>
            {t(
              "research.corruption.byCharge.body2",
              "Fake-credential cases also account for about {{fakeShare}} of all full convictions in the dataset. For all other offences combined — including embezzlement, loss to the state, illicit enrichment and irregularities — the full-conviction rate drops to {{restPct}}.",
              { fakeShare: pct(fake.share), restPct: pct(restPct) },
            )}
          </p>
        </KeyFinding>

      </Block>


      <Block>
        <Eyebrow>{t("research.corruption.overTime.eyebrow", "How the docket moved")}</Eyebrow>
        <SectionHeading>
          {t("research.corruption.overTime.title", "The overall conviction rate changed as the mix of charges changed")}
        </SectionHeading>

        <Figure
          title={t("research.corruption.rateTrend.title", "Outcome rates by verdict year")}
          subtitle={t(
            "research.corruption.rateTrend.subtitle",
            "Full-conviction and acquittal rates, with the same conviction rate recomputed after removing fake-credential cases.",
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

        <Caveat>
          {t(
            "research.corruption.overTime.caveat",
            "The most recent fiscal years are incomplete by construction: cases filed recently have had less time to reach a verdict, so their rates sit on small numbers and will move. Treat the final bars on every chart here as provisional.",
          )}
        </Caveat>
      </Block>

      <Block id="pace-and-backlog">
        <Eyebrow>{t("research.corruption.pace.eyebrow", "Pace and backlog")}</Eyebrow>
        <SectionHeading>
          {t("research.corruption.pace.title", "How long a case takes, and what is still waiting")}
        </SectionHeading>

        <Figure
          title={t(
            "research.corruption.pipeline.title",
            "Cases still awaiting a verdict, and median time to decision",
          )}
          subtitle={t(
            "research.corruption.pipeline.subtitle",
            "By the fiscal year a case was filed: bars are cases still awaiting a verdict, the line is the median months to decision.",
          )}
        >
          <PipelineHealth
            data={pipeline}
            monthsLabel={t("research.corruption.pipeline.months", "median months to verdict")}
            backlogLabel={t("research.corruption.pipeline.backlog", "still awaiting a verdict")}
            provisionalLabel={t("research.corruption.pipeline.provisional", "provisional")}
          />
        </Figure>

        {/*
          The three things that used to be one paragraph: how far the pace swings, why
          the newest bars cannot be taken at face value, and where the waiting cases
          actually sit. Split and numbered so each can be read on its own.
        */}
        <ReadingNotes
          label={t("research.corruption.reading", "Reading the chart")}
          notes={[
            {
              key: "spread",
              stat: t("research.corruption.pipeline.n1Stat", "{{fast}} → {{slow}} months", {
                fast: Math.round(fastest.medianMonths),
                slow: Math.round(slowest.medianMonths),
              }),
              title: t("research.corruption.pipeline.n1Title", "The wait is not the same from year to year"),
              body: t(
                "research.corruption.pipeline.n1Body",
                "Among cohorts that have essentially finished, the median ran from about {{fast}} months for cases filed in {{fastYear}} to about {{slow}} months for {{slowYear}} — the same court taking {{times}} times as long depending on when a case arrived.",
                {
                  fast: Math.round(fastest.medianMonths),
                  fastYear: fyLabel(fastest.fy),
                  slow: Math.round(slowest.medianMonths),
                  slowYear: fyLabel(slowest.fy),
                  times: n(Math.round(slowest.medianMonths / fastest.medianMonths)),
                },
              ),
            },
            {
              key: "provisional",
              stat: firstProvisional
                ? t("research.corruption.pipeline.n2Stat", "{{year}} onward", {
                    year: fyLabel(firstProvisional.fy),
                  })
                : undefined,
              title: t("research.corruption.pipeline.n2Title", "The newest bars will get worse, not better"),
              body: t(
                "research.corruption.pipeline.n2Body",
                "Cohorts after {{complete}} are still open, and their medians count only the cases that have already finished. The slow ones are missing from the average because they have not ended yet, so these years look faster than they will turn out to be. They are drawn dashed for that reason.",
                { complete: fyLabel(overTime.completeThroughFy) },
              ),
            },
            {
              key: "backlog",
              stat: n(backlog),
              title: t("research.corruption.pipeline.n3Title", "Cases still without a verdict"),
              body: t(
                "research.corruption.pipeline.n3Body",
                "{{backlog}} cases across every cohort are still waiting, and {{heavy}} of them were filed in {{heavyYear}}. The older cohorts have emptied out; what is left is recent.",
                {
                  backlog: n(backlog),
                  heavy: n(heaviestPending.pending),
                  heavyYear: fyLabel(heaviestPending.fy),
                },
              ),
            },
          ]}
        />

        <Figure
          title={t("research.corruption.trend.title", "Cases filed and cases decided")}
        >
          <FiledDecidedTrend
            years={trend.years}
            filed={trend.filed}
            decided={trend.decided}
            filedLabel={t("research.corruption.trend.filed", "Filed")}
            decidedLabel={t("research.corruption.trend.decided", "Decided")}
          />
        </Figure>

        {/*
          Without this the chart is a puzzle: two lines that never meet, over the same
          years, and no stated reason why they should not. They count different events
          about the same cases, and the lag between the peaks is the delay itself.
        */}
        <ReadingNotes
          label={t("research.corruption.reading", "Reading the chart")}
          notes={[
            {
              key: "filed",
              stat: n(filedTotal),
              title: t("research.corruption.trend.n1Title", "What the filing line counts"),
              body: t(
                "research.corruption.trend.n1Body",
                "Cases placed before the Special Court in the year they were registered. Over the fourteen years it adds up to all {{filed}} prosecutions in the archive.",
                { filed: n(filedTotal) },
              ),
            },
            {
              key: "decided",
              stat: n(decidedTotal),
              title: t("research.corruption.trend.n2Title", "What the decision line counts"),
              body: t(
                "research.corruption.trend.n2Body",
                "Verdicts delivered in that year, whatever year the case arrived. A case filed in one year and decided three years later sits at two different points on the chart, so the lines are not meant to meet.",
              ),
            },
            {
              key: "lag",
              stat: t("research.corruption.trend.n3Stat", "{{lag}} years", { lag: n(peakLagYears) }),
              title: t("research.corruption.trend.n3Title", "The decisions peak well after the filings"),
              body: t(
                "research.corruption.trend.n3Body",
                "Filings peaked at {{filed}} in {{filedYear}}; decisions peaked at {{decided}} in {{decidedYear}}. That distance is the backlog working its way through — the same delay the medians above measure, seen on a calendar.",
                {
                  filed: n(peakFiled.value),
                  filedYear: fyLabel(peakFiled.fy),
                  decided: n(peakDecided.value),
                  decidedYear: fyLabel(peakDecided.fy),
                },
              ),
            },
          ]}
          footnote={t(
            "research.corruption.trend.foot",
            "Filings are keyed on the year of registration, decisions on the year the verdict landed.",
          )}
        />


        <GapCallout
          label={t("research.corruption.gap.cLabel", "Accountability gap · Court outcomes")}
          title={t(
            "research.corruption.gap.cTitle",
            "The amount alleged is not always the amount established in court",
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          shows={
            <p>
              {t(
                "research.corruption.gap.cEstablishes",
                "In the Pashupatinath Jalahari case (080-CR-0047), the Commission alleged that 1,491.718 grams of gold were missing. The case illustrates why the amount alleged in a charge sheet must be distinguished from what a court establishes through evidence. An allegation is not a judicial finding, and the amount claimed cannot automatically be treated as an amount proven in court.",
              )}
            </p>
          }
          questionLabel={t("research.corruption.gap.open", "The open question")}
          question={t(
            "research.corruption.gap.cQuestion",
            "How often do the amounts alleged by the Commission differ from the amounts upheld by courts?",
          )}
        >
          <p>
            {t(
              "research.corruption.gap.cBody",
              "This is one case, not a measurement of the wider archive. It illustrates why the amount alleged and the amount established in court should be tracked separately, but it cannot show how often or by how much they differ across corruption cases.",
            )}
          </p>
          <p>
            {t(
              "research.corruption.gap.cBody2",
              "The Commission reported Rs {{bn}} billion in claimed बिगो for FY2081/82. The published data examined here does not provide a comparable total for the amounts upheld by courts. Without matching figures for both, the gap cannot be measured across cases or years. Recording both the amount claimed and the amount upheld in each case would make that comparison possible.",
              { bn: REPORT.ciaa.damagesClaimedYearBn },
            )}
          </p>
        </GapCallout>

        <GapCallout
          label={t("research.corruption.gap.fLabel", "Accountability gap · Records")}
          title={t(
            "research.corruption.gap.fTitle",
            "The number of defendant records is not the number of people prosecuted",
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          shows={
            <p>
              {t(
                "research.corruption.gap.fEstablishes",
                "The archive contains {{rows}} defendant records under {{distinct}} distinct names. Only {{resolved}} names, about {{pct}}, are linked to a known person or office.",
                {
                  rows: n(REPORT.entityResolution.defendantRows),
                  distinct: n(REPORT.entityResolution.distinctNames),
                  resolved: n(REPORT.entityResolution.resolved),
                  pct: pct((REPORT.entityResolution.resolved / REPORT.entityResolution.distinctNames) * 100),
                },
              )}
            </p>
          }
          questionLabel={t("research.corruption.gap.open", "The open question")}
          question={t(
            "research.corruption.gap.fQuestion",
            "How many individuals have been prosecuted in more than one case?",
          )}
        >
          <p>
            {t(
              "research.corruption.gap.fBody",
              "The archive counts defendant records, not verified individuals. The same person may appear in several cases, while different people may share the same name. Names may also be spelled differently across charge sheets and judgments. Without reliable identification, merging records could wrongly treat different people as one person, or count the same person more than once.",
            )}
          </p>
          <p>
            {t(
              "research.corruption.gap.fBody2",
              "For this reason, the archive does not currently identify repeat defendants. A name match alone would not establish identity, and identifying someone in a case does not mean that person was convicted.",
            )}
          </p>
          <p>
            <strong className="font-semibold text-foreground">
              {t("research.corruption.gap.fNeededLabel", "What is needed. ")}
            </strong>
            {t(
              "research.corruption.gap.fNeeded",
              "A reliable, consistent identifier for each person or office, recorded across charge sheets, judgments and annual reports. This would help establish when the same person appears in multiple cases without relying on name similarity alone.",
            )}{" "}
            <Cite href={CITATIONS.dataQuality}>
              {t("research.corruption.gap.fCite", "Coverage and data quality")}
            </Cite>
          </p>
        </GapCallout>
      </Block>
    </>
  );
}
