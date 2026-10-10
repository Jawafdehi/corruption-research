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
              "Most corruption complaints die quietly. The convictions are mostly forged certificates.",
            )}
          </h2>
          <p className="mt-5 text-base leading-7 text-foreground/75 md:text-[1.0625rem] md:leading-8">
            {t(
              "research.corruption.hl.lede",
              "Two institutions keep records about the same cases and neither reads the other's. We put {{cases}} prosecutions from the Special Court register beside fourteen years of the Commission's annual reports. Four findings fell out that are hard to see in either record alone, and one thing neither of them records at all.",
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
            "of finished investigations were shelved in {{fy}}, against {{was}} in {{wasFy}}",
            { fy: lastDisposal.fy, was: pct(tameliPct(firstDisposal)), wasFy: firstDisposal.fy },
          )}
          headline={t(
            "research.corruption.hl.f1",
            "The Commission shelves most of what it investigates",
          )}
          explain={t(
            "research.corruption.hl.f1Body",
            "That almost nothing survives the Commission's front desk is well known. This is the filter after that one. These complaints were screened in, fully investigated, and then closed as तामेली rather than charged. The share closed that way roughly tripled in five years while decisions to prosecute barely moved. The reports publish the totals and not a single reason, so nobody outside the Commission can test whether the cases were weak or the decisions were.",
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
              "Decisions on complaints that completed a detailed investigation, {{first}} to {{last}}. Each year's share divides two numbers printed in one table of one report. Two years in the window print no reconcilable total and are left out rather than estimated.",
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
            "convicted in whole or in part, of {{d}} cases with a clear verdict. On the stricter full-only test, {{full}}.",
            { d: n(decided), full: pct1(rates.convictionFullOnlyPct) },
          )}
          headline={t(
            "research.corruption.hl.f2",
            "One verdict per case, and no way to count the people behind it",
          )}
          explain={t(
            "research.corruption.hl.f2Body",
            "The court publishes one disposition per case and no outcome for each accused. A partial conviction, where one junior official was convicted and everyone senior walked, is recorded exactly like any other. Every rate here is therefore a rate of cases, never of people. {{ongoing}} are still waiting for a verdict; the slowest settled filing cohort, {{slowFy}}, took a median of about {{slow}} months to reach one.",
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
              "{{d}} of {{all}} prosecutions carry a disposition the cause list records cleanly. A further {{excl}} were read out of written judgments and are excluded from every rate here.",
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
          stat={`${pct(topCharge.fullPct)} / ${pct(bottomCharge.fullPct)}`}
          statCaption={t(
            "research.corruption.hl.f3Stat",
            "upheld in full: {{top}}, against {{bottom}}",
            { top: topCharge.label.toLowerCase(), bottom: bottomCharge.label.toLowerCase() },
          )}
          headline={t(
            "research.corruption.hl.f3",
            "Paper crimes convict. Money crimes mostly don't.",
          )}
          explain={t(
            "research.corruption.hl.f3Body",
            "A forged academic certificate is the easiest corruption case in Nepal to prove, and those cases alone supply {{share}} of every full conviction in this archive. The financial offences the Commission was built for do far worse. That does not establish that the harder cases were badly investigated: they are genuinely harder to prove, and the register carries the verdict but never the reason for it.",
            { share: pct(fakeShareOfFull) },
          )}
          chart={
            <ChargeRateBars
              rows={chargeRows}
              avgPct={fullOnlyAvg}
              rateLabel={t(
                "research.corruption.hl.f3Rate",
                "Upheld in full, as a share of that charge's decided cases",
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
              "Offence families with at least {{min}} decided cases; smaller ones turn on a handful of verdicts. Money laundering keeps its own row because it is tried here under a separate statute. Rates are per case, never per accused.",
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
          stat={`${n(appeals.defendant.reversed)} vs ${n(appeals.commission.reversed)}`}
          statCaption={t(
            "research.corruption.hl.f4Stat",
            "appeals won outright by convicted defendants, against {{c}} won by the Commission",
            { c: n(appeals.commission.reversed) },
          )}
          headline={t("research.corruption.hl.f4", "The Commission has won {{c}} appeals", {
            c: n(appeals.commission.reversed),
          })}
          explain={t(
            "research.corruption.hl.f4Body",
            "Over {{cd}} decided appeals it brought, most of them against acquittals, the Commission obtained a full reversal {{c}} times. Convicted defendants, over {{dd}}, won {{d}}. An acquittal at the Special Court is close to permanent; a conviction is a good deal shakier than the verdict makes it look. The hatched band carries the second finding: {{pct}} of the appeals we traced stop without any recorded outcome, which is a filing failure and says nothing about how the Supreme Court decides.",
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
              "{{total}} appeals tied back to prosecutions in this archive; rates are over the {{dec}} with a recorded outcome. Trial and appeal cases are stored with no link between them, so the pairing was rebuilt by hand. A case with no appeal on record is one we cannot follow, never one that nobody appealed.",
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
                  "by any institution: how much of the Rs {{bn}} billion claimed in FY2081/82 was ever recovered",
                  { bn: ciaa.damagesClaimedYearBn },
                )}
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold leading-snug md:text-2xl">
                {t(
                  "research.corruption.hl.f5",
                  "The last stage has no chart because it has no data",
                )}
              </h3>
              <p className="mt-4 max-w-prose leading-7 text-foreground/80">
                {t(
                  "research.corruption.hl.f5Body",
                  "The Commission reports the damages it demands each year. No institution reports what came back, and the court record does not carry it either. बिगो is a figure written into a judgment; whether anyone collected it is a separate question, and nothing in the public record answers it. Every other stage on this page has an institution that publishes something. This one has none, which is why it is the only stage we cannot put a number against. Read the blank as missing, not as zero.",
                )}
              </p>
              <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                {t(
                  "research.corruption.hl.f5Ctx",
                  "Damages demanded is the Commission's own published figure for one fiscal year. No comparable figure for amounts ordered, recovered or outstanding exists in any source this research covers.",
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
            "Every figure here is generated from the published data pack when the page is built, so this page and the dataset cannot disagree. Complaints, investigations, prosecutions, verdicts and appeals are counted separately and never merged into one population.",
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
