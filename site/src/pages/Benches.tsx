import { useTranslation } from "react-i18next";

import { JusticeSpread } from "@/components/research/JusticeSpread";
import { PipelineHealth, type PipelinePoint } from "@/components/research/PipelineHealth";
import { Block, Body, Caveat, Eyebrow, Figure, Lede, SectionHeading } from "@/components/layout/Prose";
import { REPORT, decidedClean, fyLabel } from "@/data/research-corruption";

const n = (v: number) => v.toLocaleString();

// Mirrors the thresholds in `JusticeSpread`'s `bandColor`. Kept here rather than
// edited into the component so that file stays byte-identical to the SPA's copy;
// the labels are built from these so they cannot describe a band that isn't drawn.
const BAND_HIGH = 55;
const BAND_LOW = 37;

export default function Benches() {
  const { t } = useTranslation();
  const { justiceMinDecisions, justices, outcome, overTime, rates } = REPORT;

  const decided = decidedClean(outcome);
  const courtAvg = rates.convictionPct;
  const justiceDecisions = justices.reduce((s, j) => s + j.decisions, 0);

  const pipeline: PipelinePoint[] = overTime.cohorts.map((c) => {
    const complete = c.fy <= overTime.completeThroughFy;
    return {
      year: c.fy,
      pending: c.pending,
      // A cohort still filling up has a median drawn from whichever of its cases
      // finished first, which biases it short. Drawn as a separate, dashed series
      // so it cannot be read as the same measurement as the settled years.
      monthsSolid: complete ? c.medianMonths : null,
      monthsProvisional: complete ? null : c.medianMonths,
    };
  });

  const settled = overTime.cohorts.filter((c) => c.fy <= overTime.completeThroughFy);
  const slowest = settled.reduce((a, b) => (b.medianMonths > a.medianMonths ? b : a), settled[0]);
  const fastest = settled.reduce((a, b) => (b.medianMonths < a.medianMonths ? b : a), settled[0]);
  const backlog = overTime.cohorts.reduce((s, c) => s + c.pending, 0);

  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.benches.eyebrow", "Who decides, and how fast")}</Eyebrow>
        <SectionHeading>
          {t("research.corruption.benches.title", "Benches differ far more than a single court average suggests")}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.benches.lede",
            "The court's overall rate is {{avg}}%. The benches that make it up range from well above that to well below — a spread wide enough that which panel heard a case is a material fact about its outcome.",
            { avg: Math.round(courtAvg) },
          )}
        </Lede>
      </Block>

      <Block>
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
      </Block>

      <Block>
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
      </Block>
    </>
  );
}
