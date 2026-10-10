import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Highlight, Reveal } from "@/components/highlights/Highlight";
import { ChargeRateBars, type ChargeRate } from "@/components/highlights/ChargeRateBars";
import { OutcomeSplit, type OutcomeSegment } from "@/components/highlights/OutcomeSplit";
import { AppealAsymmetry, type AppealSide } from "@/components/research/AppealAsymmetry";
import { TameliTrend } from "@/components/research/TameliTrend";
import {
  CITATIONS,
  REPORT,
  decidedClean,
  fyLabel,
  outcomePct,
  tameliPct,
} from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

/** Charges with too few decided cases for a rate to mean anything are not shown. */
const MIN_DECIDED = 60;

export default function Highlights() {
  const { t } = useTranslation();
  const { n, pct, pct1, fy } = useFormat();
  const { appeals, byCharge, ciaa, corpus, disposals, outcome, overTime, rates } = REPORT;

  const decided = decidedClean(outcome);
  const period = `${fy(corpus.fiscalYears[0])}–${fy(corpus.fiscalYears[corpus.fiscalYears.length - 1])}`;

  // 01 — the Commission's second filter.
  const firstDisposal = disposals[0];
  const lastDisposal = disposals[disposals.length - 1];

  // 02 — what the court decides, over the cases carrying a clean disposition.
  const outcomeSegments: OutcomeSegment[] = [
    {
      key: "convicted",
      label: t("research.corruption.outcome.convicted", "Convicted"),
      term: "ठहर",
      value: outcome.convicted,
      definition: t(
        "research.corruption.hl.defConvicted",
        "The charge is upheld in full. A count of cases, not of people.",
      ),
      fill: "hsl(var(--accent))",
    },
    {
      key: "partial",
      label: t("research.corruption.hl.partial", "Partly convicted"),
      term: "आंशिक ठहर",
      value: outcome.partial,
      definition: t(
        "research.corruption.hl.defPartial",
        "Upheld in part: some accused convicted and others cleared, or conviction on some counts only. The record does not say which.",
      ),
      fill: "hsl(var(--accent) / 0.55)",
    },
    {
      key: "acquitted",
      label: t("research.corruption.outcome.acquitted", "Acquitted"),
      term: "सफाई",
      value: outcome.acquitted,
      definition: t(
        "research.corruption.hl.defAcquitted",
        "The accused are cleared. An acquittal is not evidence that the investigation failed.",
      ),
      fill: "hsl(var(--foreground) / 0.38)",
    },
  ];

  // Slowest settled filing cohort. Deliberately NOT a min-to-max range: the most
  // recent cohorts' medians are drawn only from the cases that have already
  // finished, which biases them short, so the low end of such a range would be an
  // artefact of incomplete data rather than a finding about the court's pace.
  const settled = overTime.cohorts.filter((c) => c.fy <= overTime.completeThroughFy);
  const slowest = settled.reduce((a, b) => (b.medianMonths > a.medianMonths ? b : a), settled[0]);

  // 03 — conviction by charge, volume-filtered so no rate rests on a handful.
  const chargeRows: ChargeRate[] = byCharge
    .map((c) => ({
      key: c.en,
      label: c.en,
      term: c.ne,
      fullPct: outcomePct(c, "convicted"),
      convicted: c.convicted,
      decided: c.convicted + c.partial + c.acquitted,
    }))
    .filter((r) => r.decided >= MIN_DECIDED)
    .sort((a, b) => b.fullPct - a.fullPct);

  const fullOnlyAvg = decided ? (outcome.convicted / decided) * 100 : 0;
  const topCharge = chargeRows[0];
  const bottomCharge = chargeRows[chargeRows.length - 1];
  const allFull = byCharge.reduce((s, c) => s + c.convicted, 0);
  const fakeShareOfFull = allFull
    ? ((byCharge.find((c) => c.en === "Fake credential")?.convicted ?? 0) / allFull) * 100
    : 0;

  // 04 — appeals, drawn over every established appeal so the untraced share shows.
  const appealSides: AppealSide[] = [
    {
      key: "defendant",
      who: t("research.corruption.appeals.whoDefendant", "The convicted person"),
      stake: t("research.corruption.appeals.stakeDefendant", "a win clears them"),
      appeals: appeals.defendant.appeals,
      decided: appeals.defendant.decided,
      reversed: appeals.defendant.reversed,
    },
    {
      key: "commission",
      who: t("research.corruption.appeals.whoCommission", "The Commission"),
      stake: t(
        "research.corruption.appeals.stakeCommission",
        "a win converts an acquittal into a conviction",
      ),
      appeals: appeals.commission.appeals,
      decided: appeals.commission.decided,
      reversed: appeals.commission.reversed,
    },
  ];
  const untracedPct = appeals.appeals ? (appeals.no_outcome / appeals.appeals) * 100 : 0;

  const scope = [
    { k: "period", label: t("research.corruption.scope.period", "Period"), v: period },
    {
      k: "court",
      label: t("research.corruption.scope.court", "Court"),
      v: t("research.corruption.scope.courtValue", "Special Court"),
    },
    {
      k: "cases",
      label: t("research.corruption.scope.cases", "Prosecutions"),
      v: n(corpus.ciaaProsecutions),
    },
    {
      k: "decided",
      label: t("research.corruption.scope.decided", "With a clear verdict"),
      v: n(decided),
    },
  ];

  return (
    <div className="theme-editorial -mx-4 bg-background px-4 py-10 text-foreground md:-mx-6 md:px-6 md:py-14">
      <Reveal>
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            {t("research.corruption.hl.eyebrow", "The findings")}
          </p>
          <h2 className="mt-3 font-display text-[1.9rem] font-bold leading-[1.1] tracking-tight md:text-[2.75rem]">
            {t(
              "research.corruption.hl.title",
              "How a corruption case moves, and where it stops",
            )}
          </h2>
          <p className="mt-5 text-base leading-7 text-foreground/75 md:text-[1.0625rem] md:leading-8">
            {t(
              "research.corruption.hl.lede",
              "Every corruption case in Nepal takes the same route. Someone files a complaint with the anti-corruption commission, the CIAA. The CIAA decides whether to investigate, and if it finds enough, it files the case at the Special Court. Whoever loses there can appeal to the Supreme Court. We followed {{cases}} cases along that route, using the court's own register and fourteen years of CIAA annual reports. Below is where the cases fall out, stage by stage.",
              { cases: n(corpus.ciaaProsecutions) },
            )}
          </p>
          <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-y border-border py-4">
            {scope.map((i) => (
              <div key={i.k}>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{i.label}</dt>
                <dd className="mt-1 font-mono text-sm font-medium tabular-nums">{i.v}</dd>
              </div>
            ))}
          </dl>
        </header>
      </Reveal>

      {/* 01 — lead. Widest slot, figure and chart side by side. */}
      <div className="mt-14 md:mt-20">
        <Highlight
          index={1}
          size="lead"
          stat={pct(tameliPct(lastDisposal))}
          statCaption={t(
            "research.corruption.hl.f1Stat",
            "of fully investigated complaints were closed with no charges in {{fy}}. Five years earlier it was {{was}}.",
            { fy: lastDisposal.fy, was: pct(tameliPct(firstDisposal)), wasFy: firstDisposal.fy },
          )}
          headline={t(
            "research.corruption.hl.f1",
            "The CIAA closes most complaints even after it has investigated them",
          )}
          explain={t(
            "research.corruption.hl.f1Body",
            "A complaint goes through two filters, not one. The first is a quick screening that rejects almost everything, and that part is well known. The second is what this chart shows. These complaints passed the screening and were properly investigated. At that point the CIAA decides to either file a case in court or close the file. Closing it is called तामेली, which means no charges and no court. In {{wasFy}} the CIAA closed {{was}} of these investigated complaints. By {{fy}} it was closing {{pct}}, while the number it sent to court barely moved. The CIAA publishes how many it closes but never why it closed any particular one, so nobody outside it can check whether the cases were weak or the decisions were.",
            {
              wasFy: firstDisposal.fy,
              was: pct(tameliPct(firstDisposal)),
              fy: lastDisposal.fy,
              pct: pct(tameliPct(lastDisposal)),
            },
          )}
          chart={
            // Minimum chart width exceeds a phone viewport, so it scrolls inside
            // its own box rather than widening the page.
            <div className="chart-scroll">
              <TameliTrend
                rows={disposals}
                tameliLabel={t("research.corruption.investigation.seriesTameli", "Closed (तामेली)")}
                filedLabel={t("research.corruption.investigation.seriesFiled", "Prosecute")}
                shareLabel={t("research.corruption.investigation.seriesShare", "Share closed")}
              />
            </div>
          }
          meta={{
            context: t(
              "research.corruption.hl.f1Ctx",
              "Covers only complaints that finished a full investigation, in the five years {{first}} to {{last}}. Each percentage comes from two numbers printed in the same table of the same report. Two years are missing because those reports do not print a usable total, and we left them out rather than guess.",
              { first: firstDisposal.fy, last: lastDisposal.fy },
            ),
            source: t("research.corruption.hl.f1Src", "CIAA annual reports, 29th to 34th"),
            sourceHref: CITATIONS.ciaaReports,
            to: "/investigation",
            toLabel: t("research.corruption.hl.f1Link", "The year-by-year series"),
          }}
        />
      </div>

      {/* 02 and 03 — paired supporting findings. */}
      <div className="mt-14 grid gap-6 md:mt-16 lg:grid-cols-2 lg:gap-8">
        <Highlight
          index={2}
          stat={pct1(rates.convictionPct)}
          statCaption={t(
            "research.corruption.hl.f2Stat",
            "of {{d}} decided cases ended in a conviction, either full or partial. Counting only full convictions, {{full}}.",
            { d: n(decided), full: pct1(rates.convictionFullOnlyPct) },
          )}
          headline={t(
            "research.corruption.hl.f2",
            "The court convicts in six of every ten cases, but nobody can say how many people",
          )}
          explain={t(
            "research.corruption.hl.f2Body",
            "The Special Court gives one verdict for the whole case: guilty, partly guilty, or not guilty. Partly guilty usually means some of the accused were convicted and the rest were cleared, or that one person was convicted on some charges but not others. The record does not say which. So a case where ten officials were charged and only the most junior was convicted looks identical to a case where all ten were. That is why every number here counts cases and not people, and why no one can produce a per-person conviction rate from this data. {{ongoing}} cases are still waiting for a verdict. Cases filed in {{slowFy}} were the slowest, taking about {{slow}} months on average to be decided.",
            {
              ongoing: n(outcome.ongoing),
              slow: n(Math.round(slowest.medianMonths)),
              slowFy: fyLabel(slowest.fy),
            },
          )}
          chart={
            <OutcomeSplit
              segments={outcomeSegments}
              total={decided}
              totalLabel={t("research.corruption.hl.decidedTotal", "Decided cases")}
            />
          }
          meta={{
            context: t(
              "research.corruption.hl.f2Ctx",
              "{{d}} of the {{all}} cases have a verdict the court recorded clearly. Another {{excl}} verdicts had to be read out of written judgments rather than the court's own list, so we leave them out of every percentage on this site.",
              {
                d: n(decided),
                all: n(corpus.ciaaProsecutions),
                excl: n(REPORT.verdictsModelDerivedExcluded),
              },
            ),
            source: t("research.corruption.hl.f2Src", "Special Court criminal register"),
            sourceHref: CITATIONS.courtRecords,
            to: "/court-outcomes",
            toLabel: t("research.corruption.hl.f2Link", "Outcomes in full"),
          }}
        />

        <Highlight
          index={3}
          stat={pct(topCharge.fullPct)}
          statCaption={t(
            "research.corruption.hl.f3Stat",
            "of fake education certificate cases end in full conviction. For cases about handing someone an unlawful benefit, {{bottomPct}}.",
            { bottomPct: pct(bottomCharge.fullPct) },
          )}
          headline={t(
            "research.corruption.hl.f3",
            "A forged certificate almost always ends in conviction. Cases about money often do not.",
          )}
          explain={t(
            "research.corruption.hl.f3Body",
            "Corruption charges are not equally easy to prove. Showing that someone used a fake education certificate to get a government job takes one document. Showing that an official rigged a contract or took public money means reconstructing what happened, often years later and from incomplete paperwork. The court record follows that difficulty closely. Fake certificate cases alone account for {{share}} of every full conviction in this archive. This does not prove the harder cases were badly investigated. It shows they are harder, and the court record gives a verdict but never a reason.",
            { share: pct(fakeShareOfFull) },
          )}
          chart={
            <ChargeRateBars
              rows={chargeRows}
              avgPct={fullOnlyAvg}
              rateLabel={t(
                "research.corruption.hl.f3Rate",
                "Share of decided cases ending in a full conviction, by type of charge",
              )}
              avgLabel={t(
                "research.corruption.hl.f3Avg",
                "Court average, full convictions only: {{pct}}",
                { pct: pct1(fullOnlyAvg) },
              )}
            />
          }
          meta={{
            context: t(
              "research.corruption.hl.f3Ctx",
              "Only charge types with at least {{min}} decided cases are shown, because a rate built on a few verdicts means little. Money laundering has its own row because it is tried at this court under a different law. Each percentage counts cases, not accused people.",
              { min: n(MIN_DECIDED) },
            ),
            source: t("research.corruption.hl.f3Src", "Charge sheets and the court register"),
            sourceHref: CITATIONS.chargeSheets,
            to: "/prosecution",
            toLabel: t("research.corruption.hl.f3Link", "What gets charged"),
          }}
        />
      </div>

      {/* 04 — full width: the chart needs the room and the finding earns it. */}
      <div className="mt-14 md:mt-16">
        <Highlight
          index={4}
          size="full"
          stat={n(appeals.defendant.reversed)}
          statCaption={t(
            "research.corruption.hl.f4Stat",
            "convicted people have had their verdict overturned on appeal. The CIAA has managed it {{c}} times.",
            { c: n(appeals.commission.reversed) },
          )}
          headline={t(
            "research.corruption.hl.f4",
            "When the CIAA loses a case, it almost never wins it back on appeal",
          )}
          explain={t(
            "research.corruption.hl.f4Body",
            "Either side can appeal a Special Court verdict to the Supreme Court, and the two sides fare very differently. The Supreme Court has decided {{cd}} appeals brought by the CIAA, mostly against people the Special Court had cleared. The CIAA won {{c}} of them outright. Of {{dd}} appeals by convicted people, {{d}} won outright. In plain terms: when the CIAA loses a case that is usually the end of it, and when it wins, the conviction is much less secure than it looks. The striped part of each bar is a separate problem. For {{pct}} of the appeals we found, no outcome is recorded anywhere we can reach. Nepal's courts store a trial and its appeal as two unrelated cases with nothing linking them, so we had to match them by hand. That is a record-keeping failure and says nothing about how the Supreme Court decides.",
            {
              c: n(appeals.commission.reversed),
              cd: n(appeals.commission.decided),
              d: n(appeals.defendant.reversed),
              dd: n(appeals.defendant.decided),
              pct: pct1(untracedPct),
            },
          )}
          chart={
            <div className="mt-2">
              <AppealAsymmetry
                sides={appealSides}
                wonLabel={t("research.corruption.appeals.won", "won outright")}
                otherLabel={t("research.corruption.appeals.otherDecided", "decided")}
                unknownLabel={t("research.corruption.appeals.noOutcome", "no outcome recorded")}
              />
            </div>
          }
          meta={{
            context: t(
              "research.corruption.hl.f4Ctx",
              "{{total}} appeals that we could tie back to a case in this archive. All percentages use only the {{dec}} appeals with a recorded result. If no appeal shows up for a case, it means we could not find one, not that nobody appealed.",
              { total: n(appeals.appeals), dec: n(appeals.decided) },
            ),
            source: t("research.corruption.hl.f4Src", "Supreme Court records, curated pairing"),
            sourceHref: CITATIONS.courtRecords,
            to: "/appeals",
            toLabel: t("research.corruption.hl.f4Link", "The appeal record"),
          }}
        />
      </div>

      {/* 05 — no chart on purpose: there is no data to draw. */}
      <Reveal>
        <section className="mt-14 border-t-2 border-foreground/80 pt-8 md:mt-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">05</span>
                <div aria-hidden="true" className="h-[3px] w-14 rounded-full bg-foreground/25" />
              </div>
              <p className="mt-6 font-display text-4xl font-bold leading-none tracking-tight md:text-5xl">
                {t("research.corruption.hl.f5Stat", "Not published")}
              </p>
              <p className="mt-3 max-w-xs text-sm leading-5 text-muted-foreground">
                {t(
                  "research.corruption.hl.f5Caption",
                  "The CIAA said Rs {{bn}} billion was stolen or lost in 2081/82. No institution publishes how much of it came back.",
                  { bn: ciaa.damagesClaimedYearBn },
                )}
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold leading-snug md:text-2xl">
                {t(
                  "research.corruption.hl.f5",
                  "Nobody records whether the money ever comes back",
                )}
              </h3>
              <p className="mt-4 max-w-prose leading-7 text-foreground/80">
                {t(
                  "research.corruption.hl.f5Body",
                  "When the CIAA files a corruption case it states how much money it believes was stolen or lost. This figure is called बिगो. If the court agrees, it orders the money repaid. What happens after that is recorded by nobody: not the CIAA, not the courts, not the treasury. There is no public figure for how much was ordered repaid, how much was actually collected, or how much is still outstanding. Every other stage on this page has some institution publishing something about it. This one has none. So the blank above does not mean nothing was recovered. It means nobody can say.",
                )}
              </p>
              <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                {t(
                  "research.corruption.hl.f5Ctx",
                  "The Rs {{bn}} billion is the CIAA's own published figure for a single year. No matching figure for money ordered repaid, collected or still owed exists in any source this research covers.",
                  { bn: ciaa.damagesClaimedYearBn },
                )}{" "}
                <Link
                  to="/gaps"
                  className="font-medium text-accent underline underline-offset-4 hover:opacity-80"
                >
                  {t("research.corruption.hl.f5Link", "The recovery gap")}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <p className="mt-12 max-w-3xl border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
          {t(
            "research.corruption.hl.footer",
            "Every number on this page is produced from the published dataset when the page is built, so the page cannot drift from the data behind it. Complaints, investigations, court cases, verdicts and appeals are counted separately and never added together, because they are different things counted at different times.",
          )}{" "}
          <Link
            to="/method"
            className="underline decoration-dotted underline-offset-2 hover:text-foreground"
          >
            {t("research.corruption.hl.methodLink", "How these numbers were produced")}
          </Link>
          {" · "}
          <a
            href={CITATIONS.researchPack}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:text-foreground"
          >
            {t("research.corruption.hl.repoLink", "The dataset and the code")}
          </a>
        </p>
      </Reveal>
    </div>
  );
}
