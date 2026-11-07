import { useTranslation } from "react-i18next";

import { useFormat } from "@/lib/format";

import {
  AppealAsymmetry,
  type AppealSide,
} from "@/components/research/AppealAsymmetry";
import { AppealDecisions } from "@/components/research/AppealDecisions";
import { GapCallout } from "@/components/research/GapCallout";
import {
  Block,
  Body,
  Caveat,
  Cite,
  Eyebrow,
  Figure,
  Lede,
  Ref,
  SectionHeading,
  StatRow,
  StatTile,
  Unknown,
} from "@/components/layout/Prose";
import { CITATIONS, REPORT } from "@/data/research-corruption";

export default function Appeals() {
  const { t } = useTranslation();
  const { n, pct1 } = useFormat();
  const { appeals, ciaa, supremeDelay } = REPORT;
  /** All-case district-court fine ledger, latest year (Supreme Court annual report). */
  const fineLast = REPORT.fineLedger[REPORT.fineLedger.length - 1];

  // The Commission's own appeal/decline decisions, from the annual reports. Kept
  // entirely separate from the Supreme Court figures: a decision has no denominator
  // here, so these are only ever reported as counts and a share of each other.
  const ciaaDecisions = appeals.ciaaDecisions;
  const decisionTotals = ciaaDecisions.reduce(
    (a, r) => ({
      appealed: a.appealed + r.appealed,
      notAppealed: a.notAppealed + r.notAppealed,
      minAppealed: Math.min(a.minAppealed, r.appealed),
      maxAppealed: Math.max(a.maxAppealed, r.appealed),
    }),
    { appealed: 0, notAppealed: 0, minAppealed: Infinity, maxAppealed: 0 },
  );
  const declinedTotal = decisionTotals.appealed + decisionTotals.notAppealed;
  const declinedPct = declinedTotal
    ? (decisionTotals.notAppealed / declinedTotal) * 100
    : 0;

  // Per trial (H1): each side counted only against the verdict it can overturn — the
  // convicted against convictions, the Commission against acquittals. Its appeals against
  // convictions (for a heavier sentence or a larger बिगो) are a different event, shown
  // as a third row. Firm links, final outcomes only; trials, not people.
  const defendant = appeals.convictedVsConviction;
  const ciaaOnAcq = appeals.governmentVsAcquittal;
  const ciaaOnConv = appeals.governmentVsConviction;
  const acq = appeals.acquittals;

  // Share of registered appeals with no final outcome yet. Surfaced before the rates,
  // not after, so the per-trial pair is read as the decided minority.
  const untracedPct = appeals.appealsAll
    ? (appeals.appealsNoFinalOutcome / appeals.appealsAll) * 100
    : 0;

  const asymSides: AppealSide[] = [
    {
      key: "defendant",
      who: t(
        "research.corruption.appeals.whoDefendant",
        "The convicted person",
      ),
      stake: t(
        "research.corruption.appeals.stakeDefendant",
        "a win clears them",
      ),
      appeals: defendant.trials,
      decided: defendant.decided,
      reversed: defendant.reversed,
    },
    {
      key: "commission",
      who: t(
        "research.corruption.appeals.whoCommissionAcq",
        "The Commission, against an acquittal",
      ),
      stake: t(
        "research.corruption.appeals.stakeCommission",
        "a win converts an acquittal into a conviction",
      ),
      appeals: ciaaOnAcq.trials,
      decided: ciaaOnAcq.decided,
      reversed: ciaaOnAcq.reversed,
    },
  ];

  const sides = [
    {
      key: "defendant",
      who: t(
        "research.corruption.appeals.whoDefendantConv",
        "The convicted person, against a conviction",
      ),
      ...defendant,
    },
    {
      key: "commissionAcq",
      who: t(
        "research.corruption.appeals.whoCommissionAcq",
        "The Commission, against an acquittal",
      ),
      ...ciaaOnAcq,
    },
    {
      key: "commissionConv",
      who: t(
        "research.corruption.appeals.whoCommissionConv",
        "The Commission, against a conviction (for a heavier outcome)",
      ),
      ...ciaaOnConv,
    },
  ];

  return (
    <>
      <Block>
        <Eyebrow>
          {t(
            "research.corruption.appeals.eyebrow",
            "What survives the Supreme Court",
          )}
        </Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.appeals.title",
            "The Special Court's acquittals are close to final. Its convictions are not.",
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.appeals.lede2",
            "A verdict at the Special Court is not the end of a case. {{appeals}} Supreme Court appeals come from Special Court corruption trials. Co-defendants appeal on separate dockets, so the rates below count trials, not appeals or people. The two sides fare very differently when they get there — which means the trial-court conviction rate overstates how much accountability actually sticks.",
            { appeals: n(appeals.appealsAll) },
          )}
        </Lede>

        <StatRow>
          <StatTile
            value={n(appeals.appealsAll)}
            label={t(
              "research.corruption.appeals.tileTotal2",
              "Appeals registered",
            )}
            note={t(
              "research.corruption.appeals.tileTotalNote2",
              "from Special Court corruption trials",
            )}
          />
          <StatTile
            value={n(defendant.decided + ciaaOnAcq.decided)}
            label={t(
              "research.corruption.appeals.tileDecided2",
              "Trials with a decided appeal",
            )}
            note={t(
              "research.corruption.appeals.tileDecidedNote",
              "the only ones that move a rate",
            )}
          />
          <StatTile
            tone="accent"
            value={pct1(defendant.pct)}
            label={t(
              "research.corruption.appeals.tileDefendant2",
              "Convictions overturned",
            )}
            note={t(
              "research.corruption.appeals.tileDefendantNote2",
              "in full, of decided trials appealed by the convicted",
            )}
          />
          <StatTile
            value={pct1(ciaaOnAcq.pct)}
            label={t(
              "research.corruption.appeals.tileCommission2",
              "Acquittals overturned",
            )}
            note={t(
              "research.corruption.appeals.tileCommissionNote2",
              "in full, of decided trials the Commission appealed",
            )}
          />
        </StatRow>

        <Unknown
          title={t(
            "research.corruption.appeals.tracingTitle2",
            "Read every rate below against this: {{pct}} of these appeals have no final outcome yet",
            { pct: pct1(untracedPct) },
          )}
        >
          {t(
            "research.corruption.appeals.tracingBody2",
            "{{no}} of {{total}} registered appeals carry no final outcome in the records used here (pull of {{censor}}), so every rate below is computed over trials whose appeal has one. Most are still pending; some may have been decided without the outcome reaching the records. Referrals to a larger bench and adjournments are not counted as outcomes.",
            {
              no: n(appeals.appealsNoFinalOutcome),
              total: n(appeals.appealsAll),
              censor: supremeDelay.censorDate,
            },
          )}
        </Unknown>
      </Block>

      <Block>
        <Figure
          id="appeal-asymmetry"
          title={t(
            "research.corruption.appeals.asymTitle",
            "Every appeal each side brought, and how far it got",
          )}
          subtitle={t(
            "research.corruption.appeals.asymSubtitle2",
            "Each bar is one side's trials with an appeal on record, not just the decided ones. The hatched band is the part of the record that stops.",
          )}
          caption={t(
            "research.corruption.appeals.asymCaption2",
            "A full reversal means opposite things on the two rows, which is the point of splitting them: when the convicted person wins they walk, and when the Commission wins an acquittal becomes a conviction. Rates underneath are computed over decided trials only. Counts are of trials, never of people.",
          )}
        >
          <AppealAsymmetry
            sides={asymSides}
            wonLabel={t("research.corruption.appeals.won", "succeeded of")}
            ofDecidedLabel={t(
              "research.corruption.appeals.ofDecidedTrials",
              "{{won}} of {{decided}} decided trials ended in a full reversal",
            )}
            untraced={{
              missing: appeals.appealsNoFinalOutcome,
              total: appeals.appealsAll,
            }}
            untracedLabel={t(
              "research.corruption.appeals.untraced2",
              "Not counted above: {{missing}} of the {{total}} appeals registered ({{pct}}) have no final outcome yet.",
            )}
          />
        </Figure>
      </Block>

      <Block>
        <Figure
          title={t(
            "research.corruption.appeals.tableTitle",
            "Who appeals, and who wins",
          )}
          subtitle={t(
            "research.corruption.appeals.tableSubtitle2",
            "Full reversals as a share of trials whose appeal has been decided.",
          )}
          caption={t(
            "research.corruption.appeals.tableCaption2",
            "Direction matters: a reversal means the opposite thing depending on who brought the appeal. Where the convicted person appeals, a reversal clears them; where the Commission appeals an acquittal, a reversal convicts. The Commission's appeals against convictions seek a heavier outcome and are shown separately. A trial counts as reversed when at least one of its decided appeals ended in a full reversal. Trials with no final outcome are excluded rather than counted as losses. Counts are of trials, not of people.",
          )}
        >
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th
                  scope="col"
                  className="py-2 pr-4 font-medium text-muted-foreground"
                >
                  {t("research.corruption.appeals.colWho", "Appealed by")}
                </th>
                <th
                  scope="col"
                  className="py-2 pr-4 text-right font-medium text-muted-foreground"
                >
                  {t("research.corruption.appeals.colTrials", "Trials appealed")}
                </th>
                <th
                  scope="col"
                  className="py-2 pr-4 text-right font-medium text-muted-foreground"
                >
                  {t("research.corruption.appeals.colDecided", "Decided")}
                </th>
                <th
                  scope="col"
                  className="py-2 pr-4 text-right font-medium text-muted-foreground"
                >
                  {t(
                    "research.corruption.appeals.colReversed",
                    "Full reversals",
                  )}
                </th>
                <th
                  scope="col"
                  className="py-2 text-right font-medium text-muted-foreground"
                >
                  {t("research.corruption.appeals.colRate", "Rate")}
                </th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {sides.map((s) => (
                <tr key={s.key} className="border-b border-border/60">
                  <th
                    scope="row"
                    className="py-3 pr-4 text-left font-sans font-medium text-foreground"
                  >
                    {s.who}
                  </th>
                  <td className="py-3 pr-4 text-right text-muted-foreground">
                    {n(s.trials)}
                  </td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">
                    {n(s.decided)}
                  </td>
                  <td className="py-3 pr-4 text-right text-foreground">
                    {n(s.reversed)}
                  </td>
                  <td className="py-3 text-right font-semibold text-foreground">
                    {pct1(s.pct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Figure>

        <Body>
          {t(
            "research.corruption.appeals.body2",
            "Against acquittals, {{aRev}} of {{aDecided}} trials with a decided Commission appeal ended in a full reversal, {{aRevIncl}} counting partial reversals. The convicted, across {{dDecided}} trials with a decided appeal, won a full reversal in {{dRev}}. And about one acquittal in five never reaches the Supreme Court at all: for {{noAppeal}} of the {{judgeable}} acquittals old enough to judge ({{noPct}}), no government appeal was found. Put plainly: when the Commission loses at trial, that is usually the end of it; when it wins, the verdict is considerably less secure than it looks.",
            {
              aRev: n(ciaaOnAcq.reversed),
              aDecided: n(ciaaOnAcq.decided),
              aRevIncl: n(ciaaOnAcq.reversed + ciaaOnAcq.partialOnly),
              dDecided: n(defendant.decided),
              dRev: n(defendant.reversed),
              noAppeal: n(acq.noAppeal),
              judgeable: n(acq.judgeable),
              noPct: pct1(acq.noAppealPct),
            },
          )}
        </Body>
      </Block>

      {/*
        How long the appeal itself takes. It sits here rather than with the win rates
        because it answers a different question — not who prevails, but when anyone
        finds out. Figures come from corpus_data.supreme_appeal_duration_origin
        (registered 2008-2018, origin universe), with the Kaplan-Meier median beside
        the decided-only one, which is a floor.
      */}
      <Block id="appeal-duration">
        <Eyebrow>
          {t(
            "research.corruption.delay.eyebrow",
            "How long the last stage takes",
          )}
        </Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.delay.title",
            "An appeal takes a median of {{median}} years to be decided",
            { median: supremeDelay.medianYears.toFixed(1) },
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.delay.lede3",
            "Measured from the day an appeal is registered at the Supreme Court to the day it is decided — not from the complaint, and not from the trial. Of {{n}} corruption appeals registered between {{from}} and {{to}} that have since been decided, half took at least {{median}} years to resolve, and {{over}} took more than six. Counting the appeals still open as well, the median is about {{km}} years. An appeal by a convicted person takes longer, a median of {{person}} years; one by the Commission, {{gov}}.",
            {
              n: n(supremeDelay.decided),
              from: supremeDelay.fromYear,
              to: supremeDelay.toYear,
              median: supremeDelay.medianYears.toFixed(1),
              over: pct1(supremeDelay.overSixPct),
              km: (supremeDelay.kmMedianYears ?? supremeDelay.medianYears).toFixed(1),
              person: supremeDelay.bySide.person.medianYears.toFixed(1),
              gov: supremeDelay.bySide.government.medianYears.toFixed(1),
            },
          )}
        </Lede>

        <Body>
          {t(
            "research.corruption.delay.trend2",
            "The wait has been getting longer, not shorter. Appeals decided between {{eFrom}} and {{eTo}} had been waiting a median of {{eMed}} years; those decided between {{rFrom}} and {{rTo}} had been waiting {{rMed}}. Keyed on the year of decision rather than of registration — the one window that is not cut short by appeals still outstanding, since every appeal with a decision date has a known duration. It measures how old the appeals now being cleared are, not how long one filed today will take. The stage before it has moved the other way: time to a Special Court verdict has been falling.",
            {
              eFrom: supremeDelay.earlier.from,
              eTo: supremeDelay.earlier.to,
              eMed: supremeDelay.earlier.medianYears.toFixed(1),
              rFrom: supremeDelay.recent.from,
              rTo: supremeDelay.recent.to,
              rMed: supremeDelay.recent.medianYears.toFixed(1),
            },
          )}{" "}
          <Ref to="/court-outcomes#pace-and-backlog">
            {t(
              "research.corruption.delay.trendRef",
              "Pace at the Special Court",
            )}
          </Ref>
        </Body>

        <StatRow>
          <StatTile
            value={t("research.corruption.delay.tileMedian", "{{v}} yr", {
              v: supremeDelay.medianYears.toFixed(1),
            })}
            label={t(
              "research.corruption.delay.tileMedianLabel",
              "Median wait",
            )}
            note={t(
              "research.corruption.delay.tileMedianNote",
              "half of appeals took longer",
            )}
          />
          <StatTile
            value={pct1(supremeDelay.overSixPct)}
            label={t(
              "research.corruption.delay.tileOverLabel",
              "Took more than six years",
            )}
            note={t(
              "research.corruption.delay.tileOverNote",
              "of the {{n}} decided appeals",
              {
                n: n(supremeDelay.decided),
              },
            )}
          />
          <StatTile
            value={n(supremeDelay.withoutVerdict)}
            label={t(
              "research.corruption.delay.tileOpenLabel",
              "No recorded decision",
            )}
            note={t(
              "research.corruption.delay.tileOpenNote",
              "of {{all}} appeals registered",
              {
                all: n(supremeDelay.registeredAll),
              },
            )}
          />
        </StatRow>

        <Caveat>
          {t(
            "research.corruption.delay.caveat2",
            "The decided-only median is a floor: an appeal still open is by definition a slow one. The Kaplan-Meier median of {{km}} years counts the open appeals too, assuming they behave like decided ones of the same age. Registration years after {{to}} are excluded because too few of their appeals have been decided. Counts are of appeal dockets, and co-defendants file separately: one trial ({{mass}}) filed {{dockets}} dockets decided on a single day; without it the median is {{without}} years.",
            {
              km: (supremeDelay.kmMedianYears ?? supremeDelay.medianYears).toFixed(1),
              to: supremeDelay.toYear,
              mass: supremeDelay.withoutMassTrial.trial,
              dockets: n(supremeDelay.withoutMassTrial.dockets),
              without: supremeDelay.withoutMassTrial.medianYears.toFixed(1),
            },
          )}
        </Caveat>
      </Block>

      <Block>
        <Eyebrow>
          {t(
            "research.corruption.appealDecisions.eyebrow",
            "Before the appeal exists",
          )}
        </Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.appealDecisions.title",
            "The Commission decides whether a loss gets appealed at all, and often decides not to",
          )}
        </SectionHeading>
        <Body>
          {t(
            "research.corruption.appealDecisions.body",
            "Everything above counts appeals that were filed. But a verdict only reaches the Supreme Court if the Commission's own meeting votes to take it there, and that meeting records both answers. Across the {{years}} fiscal years where the annual reports print the decision table, it voted to appeal {{yes}} times and voted not to appeal {{no}} times — declining in {{noPct}} of the decisions it took.",
            {
              years: n(ciaaDecisions.length),
              yes: n(decisionTotals.appealed),
              no: n(decisionTotals.notAppealed),
              noPct: pct1(declinedPct),
            },
          )}
        </Body>

        <Figure
          title={t(
            "research.corruption.appealDecisions.chartTitle",
            "The Commission's own decisions on whether to appeal, by fiscal year",
          )}
          subtitle={t(
            "research.corruption.appealDecisions.chartSubtitle",
            "Decisions recorded at Commission meetings. Above the line: appeal. Below: do not appeal.",
          )}
          caption={
            <>
              {t(
                // TODO(claims): M121 unverified — 'no reason ... and no case number' is an absence claim
                // across seven reports, not checked report by report.
                "research.corruption.appealDecisions.chartCaption",
                "A decision is not a filing, and the year a decision is taken is not the year the verdict was handed down, so these counts are never divided into the Supreme Court figures above and no success rate is built from them. The reports print no reason for any individual decision not to appeal, and no case number, so a declined appeal cannot be traced to the verdict it concerned.",
              )}{" "}
              {ciaaDecisions.map((d, i) => (
                <span key={d.fy}>
                  {i > 0 ? " · " : ""}
                  {d.fy}
                </span>
              ))}
            </>
          }
        >
          <AppealDecisions
            rows={ciaaDecisions}
            appealedLabel={t(
              "research.corruption.appealDecisions.yes",
              "Decided to appeal",
            )}
            declinedLabel={t(
              "research.corruption.appealDecisions.no",
              "Decided not to appeal",
            )}
          />
        </Figure>

        <Body>
          {t(
            "research.corruption.appealDecisions.body2",
            "The two series move independently. Decisions to appeal swing from {{min}} in one year to {{max}} in another, while decisions to decline, between {{minNo}} and {{maxNo}}, vary somewhat less. A reader should resist the obvious inference: the reports do not say how many eligible verdicts there were in any year, so a low appeal count may mean the Commission lost less, declined more, or simply met less often.",
            {
              min: n(decisionTotals.minAppealed),
              max: n(decisionTotals.maxAppealed),
              minNo: n(Math.min(...ciaaDecisions.map((r) => r.notAppealed))),
              maxNo: n(Math.max(...ciaaDecisions.map((r) => r.notAppealed))),
            },
          )}
        </Body>

        <Unknown
          title={t(
            "research.corruption.appealDecisions.unknownTitle",
            "What would make this readable",
          )}
        >
          {t(
            "research.corruption.appealDecisions.unknownBody",
            "The number of verdicts eligible for appeal in each year, which would turn these counts into a rate, and a reason recorded against each decision not to appeal. Neither appears in any annual report. Without them, the clearest statement the evidence supports is that declining to appeal is a routine outcome rather than a rare one.",
          )}
        </Unknown>

        <GapCallout
          label={t(
            "research.corruption.gap.dLabel",
            "Accountability gap · Appeals",
          )}
          title={t(
            "research.corruption.gap.dTitle2",
            "Nearly half the appeals registered have no final outcome yet",
          )}
          showsLabel={t(
            "research.corruption.gap.shows",
            "What the record shows",
          )}
          questionLabel={t("research.corruption.gap.open", "The open question")}
          question={t(
            "research.corruption.gap.dQuestion",
            "What happened to the appeals that carry no recorded outcome?",
          )}
          shows={t(
            "research.corruption.gap.dEstablishes2",
            "{{no}} of the {{total}} appeals registered — {{pct}} — carry no final outcome in the records used here. Most are still pending; Supreme Court records may hold one for some of them.",
            {
              no: n(appeals.appealsNoFinalOutcome),
              total: n(appeals.appealsAll),
              pct: pct1(untracedPct),
            },
          )}
        >
          {t(
            "research.corruption.gap.dBody",
            "Part of the gap comes from how the records are kept, not from the bench. Trial and appeal cases sit in one table with nothing joining them, so the pairing was rebuilt from the Commission's register, from judgments naming the trial case, and failing both, by matching defendant names. Anything unresolved is counted as unknown — never as a case nobody appealed, and never as a loss.",
          )}
          <p>
            {t(
              "research.corruption.gap.dNeeded",
              "A link between a trial case and its appeal in the court system. Without one, every pairing has to be rebuilt by hand and coverage can never be proved complete.",
            )}
          </p>
        </GapCallout>

        <div id="recovery-gap" className="scroll-mt-6">
          <GapCallout
            label={t(
              "research.corruption.gap.eLabel",
              "Accountability gap · Recovery",
            )}
            title={t(
              "research.corruption.gap.eTitle",
              "The money is where the record simply stops",
            )}
            showsLabel={t(
              "research.corruption.gap.shows",
              "What the record shows",
            )}
            questionLabel={t(
              "research.corruption.gap.open",
              "The open question",
            )}
            question={t(
              "research.corruption.gap.eQuestion",
              "How much of the money a court orders repaid is ever collected?",
            )}
            shows={t(
              "research.corruption.gap.eEstablishes2",
              "The Commission publishes what it demands — Rs {{bn}} billion in FY2081/82. The Supreme Court's annual report publishes the district courts' fine ledger for all case types every year — in {{fy}}, Rs {{disposed}} billion of a Rs {{ledger}} billion ledger recorded as disposed of ({{pct}}) — but nothing for corruption cases on their own. No institution publishes what is recovered from corruption judgments, and the court record used here carries no amount.",
              {
                bn: ciaa.damagesClaimedYearBn,
                fy: fineLast.fy,
                disposed: (fineLast.disposedRs / 1e9).toFixed(3),
                ledger: (fineLast.ledgerRs / 1e9).toFixed(3),
                pct: pct1(fineLast.disposedPct),
              },
            )}
          >
            <>
              {t(
                "research.corruption.gap.eBody2",
                "Every other stage has an institution that publishes something about corruption cases in particular. This one has only the all-case ledger, which does not separate corruption from other cases, and whose “disposed of” column counts imprisonment served in lieu of payment and entries written off as well as money paid. A finding on बिगो is a legal determination; no published source says whether a rupee followed it in a corruption case. Read the blank as missing, not as zero.",
              )}{" "}
              <Cite href={CITATIONS.ciaaReports}>
                {t("research.corruption.gap.eCite", "CIAA annual reports")}
              </Cite>{" "}
              <Cite href={fineLast.sourceUrl}>
                {t(
                  "research.corruption.gap.eCiteSc",
                  "Supreme Court annual report, {{fy}}, appendix 65(क)",
                  { fy: fineLast.fy },
                )}
              </Cite>
            </>
            <p>
              {t(
                "research.corruption.gap.eNeeded",
                "A published recovery ledger keyed to case numbers. Until one exists the last stage of accountability cannot be measured at all.",
              )}
            </p>
          </GapCallout>
        </div>
      </Block>
    </>
  );
}
