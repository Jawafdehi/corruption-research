import { useTranslation } from "react-i18next";

import { StatusDonut, type DonutSegment } from "@/components/data-quality/StatusDonut";
import { ConvictionByCharge, type ChargeRow } from "@/components/research/ConvictionByCharge";
import { Block, Body, Caveat, Cite, Eyebrow, Figure, Lede, SectionHeading, StatRow, StatTile } from "@/components/layout/Prose";
import { CITATIONS, REPORT, decidedClean } from "@/data/research-corruption";

const n = (v: number) => v.toLocaleString();

export default function Outcomes() {
  const { t } = useTranslation();
  const { byCharge, outcome, rates, verdictsModelDerivedExcluded } = REPORT;

  const decided = decidedClean(outcome);
  const convPct = (outcome.convicted / decided) * 100;
  const partPct = (outcome.partial / decided) * 100;
  const acqPct = (outcome.acquitted / decided) * 100;

  // Per-charge figures for the prose, derived so they cannot drift from the chart beside them.
  const charge = (en: string) => {
    const c = byCharge.find((x) => x.en === en);
    if (!c) return { pct: 0, pct1: "0.0", share: 0, decided: 0 };
    const d = c.convicted + c.partial + c.acquitted;
    const raw = d ? (c.convicted / d) * 100 : 0;
    return {
      pct: Math.round(raw),
      // One decimal at the low end, where rounding to an integer loses a real distinction.
      pct1: raw.toFixed(1),
      share: Math.round((c.convicted / outcome.convicted) * 100),
      decided: d,
    };
  };
  const fake = charge("Fake credential");
  const bribery = charge("Bribery");

  // What is left once the two charges that carry the court are removed — the honest
  // measure of how the rest of the financial-graft docket actually does.
  const rest = byCharge.reduce(
    (acc, c) => {
      if (c.en === "Fake credential" || c.en === "Bribery") return acc;
      return { cv: acc.cv + c.convicted, dec: acc.dec + c.convicted + c.partial + c.acquitted };
    },
    { cv: 0, dec: 0 },
  );
  const restPct = rest.dec ? Math.round((rest.cv / rest.dec) * 100) : 0;
  const chargeDecidedTotal = byCharge.reduce((s, c) => s + c.convicted + c.partial + c.acquitted, 0);

  const segments: DonutSegment[] = [
    { key: "convicted", label: t("research.corruption.outcome.convicted", "Convicted"), value: outcome.convicted, color: "hsl(var(--primary))" },
    { key: "partial", label: t("research.corruption.outcome.partial", "Partial"), value: outcome.partial, color: "hsl(var(--alert))" },
    { key: "acquitted", label: t("research.corruption.outcome.acquitted", "Acquitted"), value: outcome.acquitted, color: "hsl(var(--accent))" },
  ];

  const chargeRows: ChargeRow[] = byCharge.map((c) => ({
    label: c.en,
    sublabel: c.ne,
    convicted: c.convicted,
    partial: c.partial,
    acquitted: c.acquitted,
  }));

  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.outcomes.eyebrow", "What the court decides")}</Eyebrow>
        <SectionHeading>
          {t("research.corruption.outcomes.title", "A conviction rate that depends on which charge was brought")}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.outcomes.lede",
            "Across {{decided}} cases with a clear verdict, {{rate}}% ended in conviction in whole or in part. That headline hides a much sharper story: the court convicts almost everyone charged with a documentary offence, and far fewer of those charged with the financial graft the system exists to punish.",
            { decided: n(decided), rate: rates.convictionPct },
          )}
        </Lede>

        <StatRow>
          <StatTile value={n(outcome.convicted)} label={t("research.corruption.tile.full", "Full convictions")} note={`${convPct.toFixed(1)}% of decided`} />
          <StatTile value={n(outcome.partial)} label={t("research.corruption.tile.partial", "Partial convictions")} note={`${partPct.toFixed(1)}% of decided`} />
          <StatTile value={n(outcome.acquitted)} label={t("research.corruption.tile.acquitted", "Acquittals")} note={`${acqPct.toFixed(1)}% of decided`} />
          <StatTile value={n(outcome.ongoing)} label={t("research.corruption.tile.ongoing", "Still awaiting a verdict")} note={t("research.corruption.tile.ongoingNote", "open cases in the register")} />
        </StatRow>
      </Block>

      <Block>
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
        <Figure
          title={t("research.corruption.byCharge.title", "Conviction rate by charge")}
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
            "research.corruption.byCharge.body",
            "Fake-credential cases — someone producing a forged certificate — are upheld in full {{fakePct}}% of the time and alone account for about {{fakeShare}}% of every full conviction in this archive. Bribery, the next largest charge, converts at {{briberyPct}}%. Strip those two out and the rest of the docket — embezzlement, loss to the state, illicit enrichment, irregularity — is upheld in full just {{restPct}}% of the time.",
            { fakePct: fake.pct, fakeShare: fake.share, briberyPct: bribery.pct, restPct },
          )}
        </Body>

        <Caveat>
          {t(
            "research.corruption.byCharge.caveat",
            "This is the finding that most changes how the headline should be read. A rising conviction rate can mean the prosecution is getting better, or simply that it charged more of the easy offence that year. The Over time section separates those two explanations rather than leaving the reader to guess.",
          )}
        </Caveat>
      </Block>

      <Block>
        <Body>
          {t(
            "research.corruption.outcomes.derived",
            "{{n}} further cases carry a disposition that was read out of the court's written judgment rather than published on a cause list. Every rate on this site excludes them, and the count is shown here so the exclusion is a visible number rather than a silent filter.",
            { n: verdictsModelDerivedExcluded },
          )}
        </Body>
      </Block>
    </>
  );
}
