import { useTranslation } from "react-i18next";

import { Block, Body, Caveat, Eyebrow, Figure, Lede, SectionHeading, StatRow, StatTile } from "@/components/layout/Prose";
import { REPORT, decidedClean } from "@/data/research-corruption";

const n = (v: number) => v.toLocaleString();
const pct1 = (v: number) => `${v.toFixed(1)}%`;

export default function Appeals() {
  const { t } = useTranslation();
  const { appeals, outcome } = REPORT;

  const decided = decidedClean(outcome);
  const convictedTrial = outcome.convicted + outcome.partial;

  // Only appeals that have actually been decided move a rate. The undecided ones are
  // shown as a gap, never projected into the headline.
  const afterIncl = ((convictedTrial + appeals.net) / decided) * 100;
  const afterFull = ((outcome.convicted + appeals.net_full) / decided) * 100;
  const trialIncl = (convictedTrial / decided) * 100;
  const trialFull = (outcome.convicted / decided) * 100;
  const undecidedShare = (appeals.no_outcome / appeals.appeals) * 100;

  const sides = [
    {
      key: "defendant",
      who: t("research.corruption.appeals.whoDefendant", "The convicted person"),
      ...appeals.defendant,
    },
    {
      key: "commission",
      who: t("research.corruption.appeals.whoCommission", "The Commission"),
      ...appeals.commission,
    },
  ];

  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.appeals.eyebrow", "What survives the Supreme Court")}</Eyebrow>
        <SectionHeading>
          {t("research.corruption.appeals.title", "The Special Court's acquittals are close to final. Its convictions are not.")}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.appeals.lede",
            "A verdict at the Special Court is not the end of a case. {{appeals}} of these trials have an established Supreme Court appeal, and the two sides fare very differently when they get there — which means the trial-court conviction rate overstates how much accountability actually sticks.",
            { appeals: n(appeals.appeals) },
          )}
        </Lede>

        <StatRow>
          <StatTile value={n(appeals.appeals)} label={t("research.corruption.appeals.tileTotal", "Appeals established")} note={t("research.corruption.appeals.tileTotalNote", "a floor, not a complete count")} />
          <StatTile value={n(appeals.decided)} label={t("research.corruption.appeals.tileDecided", "Appeals decided")} note={t("research.corruption.appeals.tileDecidedNote", "the only ones that move a rate")} />
          <StatTile tone="accent" value={pct1(appeals.defendant.pct)} label={t("research.corruption.appeals.tileDefendant", "Defendant appeals won")} note={t("research.corruption.appeals.tileDefendantNote", "full reversals, of decided")} />
          <StatTile value={pct1(appeals.commission.pct)} label={t("research.corruption.appeals.tileCommission", "Commission appeals won")} note={t("research.corruption.appeals.tileCommissionNote", "full reversals, of decided")} />
        </StatRow>
      </Block>

      <Block>
        <Figure
          title={t("research.corruption.appeals.tableTitle", "Who appeals, and who wins")}
          subtitle={t("research.corruption.appeals.tableSubtitle", "Full reversals as a share of appeals that have been decided.")}
          caption={t(
            "research.corruption.appeals.tableCaption",
            "Direction matters: a reversal means the opposite thing depending on who brought the appeal. Where the convicted person appeals, a reversal clears them; where the Commission appeals an acquittal, a reversal convicts. Appeals with no recorded outcome are excluded from these rates rather than counted as losses.",
          )}
        >
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-2 pr-4 font-medium text-muted-foreground">
                  {t("research.corruption.appeals.colWho", "Appealed by")}
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-medium text-muted-foreground">
                  {t("research.corruption.appeals.colFiled", "Appeals")}
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-medium text-muted-foreground">
                  {t("research.corruption.appeals.colDecided", "Decided")}
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-medium text-muted-foreground">
                  {t("research.corruption.appeals.colReversed", "Full reversals")}
                </th>
                <th scope="col" className="py-2 text-right font-medium text-muted-foreground">
                  {t("research.corruption.appeals.colRate", "Rate")}
                </th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {sides.map((s) => (
                <tr key={s.key} className="border-b border-border/60">
                  <th scope="row" className="py-3 pr-4 text-left font-sans font-medium text-foreground">
                    {s.who}
                  </th>
                  <td className="py-3 pr-4 text-right text-muted-foreground">{n(s.appeals)}</td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">{n(s.decided)}</td>
                  <td className="py-3 pr-4 text-right text-foreground">{n(s.reversed)}</td>
                  <td className="py-3 text-right font-semibold text-foreground">{pct1(s.pct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Figure>

        <Body>
          {t(
            "research.corruption.appeals.body",
            "Across {{cDecided}} decided appeals the Commission obtained a full reversal {{cRev}} times. Convicted people, across {{dDecided}}, did so {{dRev}} times. Put plainly: when the Commission loses at trial, that is usually the end of it; when it wins, the verdict is considerably less secure than it looks.",
            {
              cDecided: n(appeals.commission.decided),
              cRev: n(appeals.commission.reversed),
              dDecided: n(appeals.defendant.decided),
              dRev: n(appeals.defendant.reversed),
            },
          )}
        </Body>
      </Block>

      <Block>
        <Figure
          title={t("research.corruption.appeals.effectTitle", "The conviction rate, before and after appeal")}
          subtitle={t(
            "research.corruption.appeals.effectSubtitle",
            "Applying only the appeals already decided — nothing is projected onto the ones still outstanding.",
          )}
          caption={t(
            "research.corruption.appeals.effectCaption",
            "{{lost}} convictions were lost on appeal and {{gained}} acquittals were overturned into convictions, a net change of {{net}} cases. Both rows use the same denominator as the trial-court figures, so they are directly comparable.",
            { lost: n(appeals.lost), gained: n(appeals.gained), net: n(appeals.net) },
          )}
        >
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-2 pr-4 font-medium text-muted-foreground">
                  {t("research.corruption.appeals.colMeasure", "Measure")}
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-medium text-muted-foreground">
                  {t("research.corruption.appeals.colTrial", "At trial")}
                </th>
                <th scope="col" className="py-2 text-right font-medium text-muted-foreground">
                  {t("research.corruption.appeals.colAfter", "After appeals decided")}
                </th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-b border-border/60">
                <th scope="row" className="py-3 pr-4 text-left font-sans font-medium text-foreground">
                  {t("research.corruption.appeals.rowIncl", "Convicted, in whole or part")}
                </th>
                <td className="py-3 pr-4 text-right text-muted-foreground">{pct1(trialIncl)}</td>
                <td className="py-3 text-right font-semibold text-foreground">{pct1(afterIncl)}</td>
              </tr>
              <tr>
                <th scope="row" className="py-3 pr-4 text-left font-sans font-medium text-foreground">
                  {t("research.corruption.appeals.rowFull", "Convicted in full")}
                </th>
                <td className="py-3 pr-4 text-right text-muted-foreground">{pct1(trialFull)}</td>
                <td className="py-3 text-right font-semibold text-foreground">{pct1(afterFull)}</td>
              </tr>
            </tbody>
          </table>
        </Figure>

        <Caveat>
          {t(
            "research.corruption.appeals.caveat",
            "This is a floor on the eventual effect, not a settled number. {{no}} of the {{total}} mapped appeals — {{pct}}% — carry no recorded outcome yet, and the figures above simply leave them out. A blank is also not a finding: where no appeal is recorded it means none has been established, not that none exists.",
            { no: n(appeals.no_outcome), total: n(appeals.appeals), pct: Math.round(undecidedShare) },
          )}
        </Caveat>

        <Body>
          {t(
            "research.corruption.appeals.mapping",
            "Trial and appeal cases are stored without any link between them, so the pairing had to be built — from the Commission's own register where it prints both case numbers, from Supreme Court judgments naming the trial case, and otherwise by matching defendant names. It is a curated first version, audited at roughly 98% precision on a sample, and the direction of every reversal was checked three separate ways before any figure here was published.",
          )}
        </Body>
      </Block>
    </>
  );
}
