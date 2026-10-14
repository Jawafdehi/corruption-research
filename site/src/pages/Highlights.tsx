import { useTranslation } from "react-i18next";

import { Highlight, Reveal } from "@/components/highlights/Highlight";
import { MiniTrend, type TrendPoint } from "@/components/highlights/MiniTrend";
import { RouteMap, type RouteStep } from "@/components/highlights/RouteMap";
import {
  OutcomeSplit,
  type OutcomeSegment,
} from "@/components/highlights/OutcomeSplit";
import {
  AppealAsymmetry,
  type AppealSide,
} from "@/components/research/AppealAsymmetry";
import { TameliByYear } from "@/components/highlights/TameliByYear";
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
  const { n, pct, pct1 } = useFormat();
  const {
    appeals,
    byCharge,
    chargeMixByYear,
    ciaa,
    disposals,
    outcome,
    overTime,
    rates,
  } = REPORT;
  /** The 35th annual report's own screening table — the only year it is published. */
  const cd = REPORT.complaintDisposal[0];
  const supremeDelay = REPORT.supremeDelay;

  /**
   * Published Jawafdehi pages behind the route insights. Each was checked to resolve
   * before being used; a stage links to the page that carries its own evidence, never
   * to a general index standing in for one.
   */
  const JAWAFDEHI = {
    sting: "https://jawafdehi.org/updates/sting-operation/",
    jalahari:
      "https://jawafdehi.org/updates/pashupati-jalahari-selective-prosecution/",
    courtcases: "https://jawafdehi.org/courtcases/",
  } as const;

  const decided = decidedClean(outcome);

  // 01 — the Commission's second filter, and the year it turned over. The peak is
  // derived rather than written down so the card cannot drift when a report is added.
  const peak = disposals.reduce((a, b) => (b.filed > a.filed ? b : a));
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

  // The strongest charge by full-conviction rate, volume-filtered so the rate the card
  // quotes cannot rest on a handful of cases. Only the top row is read now; the bars
  // that used the whole list moved out of this card.
  const topCharge = byCharge
    .map((c) => ({
      label: c.en,
      fullPct: outcomePct(c, "convicted"),
      decided: c.convicted + c.partial + c.acquitted,
    }))
    .filter((r) => r.decided >= MIN_DECIDED)
    .sort((a, b) => b.fullPct - a.fullPct)[0];

  /*
   * 03 — the share of each year's filings that were fake-certificate cases.
   *
   * The card used to lead on the 90% conviction rate alone. That rate is real, but
   * fake-certificate cases were most of the docket in the first year and a small part
   * of it in the last, so a reader meeting 90% with no dates attached takes a finding
   * about the early 2070s for a description of the court today.
   */
  const mixTotal = (r: (typeof chargeMixByYear)[number]) =>
    r.bribery + r.fake + r.embezzlement + r.benefit + r.loss + r.other;
  const fakeShare: TrendPoint[] = chargeMixByYear.map((r) => ({
    label: fyLabel(r.fy),
    value: mixTotal(r) ? (r.fake / mixTotal(r)) * 100 : 0,
  }));
  const fakeFirst = chargeMixByYear[0];
  const fakeLast = chargeMixByYear[chargeMixByYear.length - 1];
  const shareOf = (r: typeof fakeFirst) =>
    mixTotal(r) ? (r.fake / mixTotal(r)) * 100 : 0;
  // The year the share recovered most after the collapse, derived rather than typed,
  // so the sentence about the rebound cannot outlive the shape of the data.
  const lowIdx = chargeMixByYear.reduce(
    (lo, r, i) => (shareOf(r) < shareOf(chargeMixByYear[lo]) ? i : lo),
    0,
  );
  const rebound = chargeMixByYear
    .slice(lowIdx)
    .reduce(
      (hi, r) => (shareOf(r) > shareOf(hi) ? r : hi),
      chargeMixByYear[lowIdx],
    );

  /*
   * 04 — median months to verdict for each filing cohort.
   *
   * Cohorts past completeThroughFy are still open, so their medians are drawn only
   * from the cases that have already finished and will rise as the slow ones land.
   * They are marked provisional and drawn dashed rather than dropped, because the
   * reader can see for themselves that the series does not stop at the settled years.
   */
  const cohortPoints: TrendPoint[] = overTime.cohorts.map((c) => ({
    label: fyLabel(c.fy),
    value: c.medianMonths,
    provisional: c.fy > overTime.completeThroughFy,
  }));
  const settledCohorts = overTime.cohorts.filter(
    (c) => c.fy <= overTime.completeThroughFy,
  );
  const slowestCohort = settledCohorts.reduce((a, b) =>
    b.medianMonths > a.medianMonths ? b : a,
  );
  const latestSettled = settledCohorts[settledCohorts.length - 1];
  const slowestIdx = overTime.cohorts.findIndex(
    (c) => c.fy === slowestCohort.fy,
  );
  const latestIdx = overTime.cohorts.findIndex(
    (c) => c.fy === latestSettled.fy,
  );

  // 04 — appeals, drawn over every established appeal so the untraced share shows.
  const appealSides: AppealSide[] = [
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
  const untracedPct = appeals.appeals
    ? (appeals.no_outcome / appeals.appeals) * 100
    : 0;

  // D — how the Supreme Court treated the judgment below it, summed across the

  // C — duration, over decided cases only.
  const duration = REPORT.duration;

  // The route a complaint takes, checked against the अख्तियार दुरुपयोग अनुसन्धान
  // आयोग कार्यविधि, २०७८ and the विशेष अदालत ऐन, २०५९ दफा १७.
  //
  // तामेली exits sit on stages 2, 3 and 5 because the कार्यविधि gives one at each:
  // दफा २१(३) at screening, दफा २२(३)(छ) after the preliminary inquiry, and
  // दफा २५(ग) when the Commission rules on the investigation report. Stage 4 has
  // none of its own; its report goes to stage 5, which is where it can be closed.
  /*
   * The route a complaint takes, checked against the अख्तियार दुरुपयोग अनुसन्धान आयोग
   * कार्यविधि, २०७८ and the विशेष अदालत ऐन, २०५९ दफा १७.
   *
   * तामेली exits sit after screening (दफा २१(३)), after the preliminary inquiry
   * (दफा २२(३)(छ)) and on the investigation report (दफा २५(ग)). Stage 4 has no exit
   * of its own: its report goes to stage 5, which is where it can be closed. The
   * appeal is conditional, so it too is a branch — a verdict nobody appeals stands.
   *
   * Stage 8 is separate from stage 7 on purpose. Lodging an appeal and receiving a
   * decision on it are different events years apart, and the whole finding at the
   * bottom of this figure is the distance between them.
   *
   * An insight is attached only where the record carries one. Stage 3 has none:
   * the annual reports publish no figure for preliminary inquiries as a class, so
   * anything said here would be invented.
   */
  const routeSteps: RouteStep[] = [
    {
      kind: "stage",
      key: "darta",
      n: 1,
      title: t("research.corruption.flow.s1Title", "Complaint registration"),
      insight: {
        kind: "gap",
        title: t(
          "research.corruption.route.i1Title",
          "The totals are published. The individual complaint is not.",
        ),
        body: t(
          "research.corruption.route.i1Body",
          "The Commission had {{all}} complaints on its books in {{fy}} — {{carried}} carried over and {{fresh}} newly registered. What it publishes is the yearly total: no public record shows where any one complaint has got to.",
          {
            all: n(cd.total_complaints),
            fy: cd.fy,
            carried: n(cd.carried_in),
            fresh: n(cd.registered_new),
          },
        ),
        href: CITATIONS.ciaa35,
        linkLabel: t(
          "research.corruption.route.i1Link",
          "CIAA annual report, {{fy}}",
          {
            fy: cd.fy,
          },
        ),
      },
    },
    {
      kind: "stage",
      key: "parikshan",
      n: 2,
      title: t("research.corruption.flow.s2Title", "Screening"),
      insight: {
        kind: "gap",
        title: t(
          "research.corruption.route.i2Title",
          "Tameli is where most complaints end",
        ),
        body: t(
          "research.corruption.route.i2Body",
          "In {{fy}}, {{pct}} of the complaints the Commission dealt with were placed in Tameli. The reports give the yearly count, never the reason in any single case — so how a complaint came to be set aside cannot be checked from outside.",
          { fy: lastDisposal.fy, pct: pct1(tameliPct(lastDisposal)) },
        ),
        href: "/investigation#tameli-by-year",
        linkLabel: t(
          "research.corruption.route.i2Link",
          "Tameli, year by year",
        ),
      },
    },
    {
      kind: "decision",
      key: "d-screen",
      label: t("research.corruption.flow.dScreen", "Taken forward?"),
      exit: {
        label: t("research.corruption.flow.exit", "Tameli"),
        tone: "tameli",
      },
    },
    {
      kind: "stage",
      key: "prarambhik",
      n: 3,
      title: t("research.corruption.flow.s3Title", "Preliminary inquiry"),
    },
    {
      kind: "decision",
      key: "d-grounds",
      label: t("research.corruption.flow.dGrounds", "Grounds found?"),
      exit: {
        label: t("research.corruption.flow.exit", "Tameli"),
        tone: "tameli",
      },
    },
    {
      kind: "stage",
      key: "bistrit",
      n: 4,
      title: t("research.corruption.flow.s4Title", "Detailed investigation"),
      insight: {
        kind: "finding",
        title: t(
          "research.corruption.route.i4Title",
          "What counts as investigating, and what does not",
        ),
        body: t(
          "research.corruption.route.i4Body",
          "Ruling on a sting operation, the Supreme Court described investigation as gathering evidence of what happened — not producing what had not. Four years later the method was written back into the Act.",
        ),
        href: JAWAFDEHI.sting,
        linkLabel: t(
          "research.corruption.route.i4Link",
          "The sting operation ruling",
        ),
      },
    },
    {
      kind: "stage",
      key: "abhiyojan",
      n: 5,
      title: t("research.corruption.flow.s5Title", "Prosecution decision"),
      exit: {
        label: t("research.corruption.flow.exit", "Tameli"),
        tone: "tameli",
      },
      insight: {
        kind: "finding",
        title: t(
          "research.corruption.route.i5Title",
          "A court asked why some were charged and others were not",
        ),
        body: t(
          "research.corruption.route.i5Body",
          "In the Pashupatinath Jalahari case the Special Court raised selective prosecution — who the charge sheet named, and who it left out. No published record lets that question be asked across cases.",
        ),
        href: JAWAFDEHI.jalahari,
        linkLabel: t(
          "research.corruption.route.i5Link",
          "Selective prosecution in the Jalahari case",
        ),
      },
    },
    {
      kind: "stage",
      key: "adalat",
      n: 6,
      court: true,
      title: t("research.corruption.flow.s6Title", "Special Court"),
      insight: {
        kind: "finding",
        title: t(
          "research.corruption.route.i6Title",
          "The charge decides the verdict",
        ),
        body: t(
          "research.corruption.route.i6Body",
          "Across {{d}} decided cases, {{rate}} ended in conviction in whole or in part. But the rate swings with the offence: fake-certificate charges are upheld in full about {{top}} of the time, and for everything else combined the figure is far lower.",
          {
            d: n(decided),
            rate: pct1(rates.convictionPct),
            top: pct(topCharge.fullPct),
          },
        ),
        href: "/court-outcomes#how-cases-end",
        linkLabel: t(
          "research.corruption.route.i6Link",
          "What the court decides",
        ),
      },
    },
    {
      kind: "decision",
      key: "d-appeal",
      label: t("research.corruption.flow.dAppeal", "Appeal lodged?"),
      exit: {
        label: t("research.corruption.flow.stands", "Verdict stands"),
        tone: "stands",
      },
    },
    {
      kind: "stage",
      key: "punarabedan",
      n: 7,
      court: true,
      title: t("research.corruption.flow.s7Title", "Supreme Court appeal"),
      insight: {
        kind: "finding",
        title: t(
          "research.corruption.route.i7Title",
          "The two sides do not fare alike",
        ),
        body: t(
          "research.corruption.route.i7Body",
          "Of the convicted people's appeals that have been decided, {{dp}} succeeded. Of the Commission's, {{cp}}. Set against that, {{untraced}} of all appeals traced carry no recorded outcome at all.",
          {
            dp: pct1(appeals.defendant.pct),
            cp: pct1(appeals.commission.pct),
            untraced: pct1(untracedPct),
          },
        ),
        href: "/appeals#appeal-asymmetry",
        linkLabel: t("research.corruption.route.i7Link", "The appeal record"),
      },
    },
    {
      kind: "stage",
      key: "sarbochha",
      n: 8,
      court: true,
      title: t(
        "research.corruption.flow.s8Title",
        "Decision of the Supreme Court",
      ),
      figure: {
        value: t("research.corruption.route.s8Figure", "{{y}} years", {
          y: supremeDelay.medianYears.toFixed(1),
        }),
        label: t(
          "research.corruption.route.s8FigureLabel",
          "typical wait from appeal lodged to appeal decided",
        ),
      },
      insight: {
        kind: "finding",
        title: t(
          "research.corruption.route.i8Title",
          "More than a third of appeals take over six years",
        ),
        body: t(
          "research.corruption.route.i8Body",
          "Across {{n}} corruption appeals registered at the Supreme Court between {{from}} and {{to}} and since decided, the median wait was {{median}} years; {{over}} took more than six, and the {{slowest}} intake ran to {{slowestYears}} years. Later years are left out because too few of their appeals have been decided to measure — and {{open}} of the {{all}} appeals registered carry no recorded decision at all, so the real wait can only be longer than this.",
          {
            n: n(supremeDelay.decided),
            from: supremeDelay.fromYear,
            to: supremeDelay.toYear,
            median: supremeDelay.medianYears.toFixed(1),
            over: pct1(supremeDelay.overSixPct),
            slowest: supremeDelay.slowestYear,
            slowestYears: supremeDelay.slowestYears.toFixed(1),
            open: n(supremeDelay.withoutVerdict),
            all: n(supremeDelay.registeredAll),
          },
        ),
        href: JAWAFDEHI.courtcases,
        linkLabel: t(
          "research.corruption.route.i8Link",
          "Supreme Court case records",
        ),
      },
    },
  ];

  return (
    <div className="theme-editorial -mx-4 bg-background px-4 py-8 text-foreground md:-mx-6 md:px-6 md:py-10">
      <Reveal>
        <header className="max-w-3xl">
          <h2 className="mt-3 font-display text-[1.9rem] font-bold leading-[1.1] tracking-tight md:text-[2.75rem]">
            {t(
              "research.corruption.hl.title",
              "How a corruption case moves, and where it stops",
            )}
          </h2>
        </header>
      </Reveal>

      <Reveal>
        <section
          className="mt-2 md:mt-4"
          aria-label={t(
            "research.corruption.flow.title",
            "How a corruption complaint travels",
          )}
        >
          {/* Same frame as a finding card, minus the link: it is a figure, not a
              click-through, so it does not get the hover or the stretched anchor. */}
          <div className="mt-3 rounded-lg border border-border bg-[hsl(var(--surface))] p-5 md:p-6">
            {/* Held to the same measure as the note below it: at full width the rail
                stranded every label on the left of an empty page. */}
            <div className="mx-auto max-w-2xl">
              <RouteMap
                steps={routeSteps}
                labels={{
                  yes: t("research.corruption.flow.yes", "yes"),
                  no: t("research.corruption.flow.no", "no"),
                  insightOpen: t(
                    "research.corruption.route.open",
                    "Show the research on this stage",
                  ),
                  insightClose: t(
                    "research.corruption.route.close",
                    "Hide the research on this stage",
                  ),
                  finding: t(
                    "research.corruption.route.finding",
                    "What the record shows",
                  ),
                  gap: t(
                    "research.corruption.route.gap",
                    "What the record cannot answer",
                  ),
                  srIntro: t(
                    "research.corruption.route.srIntro",
                    "The route a corruption complaint takes, in order. Stages one to five sit with the Commission; stages six to eight are courts. Not every complaint reaches every stage: it can be set aside as Tameli at screening, after the preliminary inquiry, or when the Commission rules on the investigation report, and a verdict nobody appeals stands. Stages with research behind them carry a button that opens it.",
                  ),
                }}
              />
            </div>
            {/*
              The meaning of तामेली, stated where there is room for both halves of
              it. अनुसूची-११ of the कार्यविधि puts the complaint aside "हाललाई" —
              for the time being — expressly on the footing that it is taken up
              again if further evidence appears. Calling it simply "closed" drops
              the second half and overstates how final it is.
            */}
            <div className="mx-auto mt-4 max-w-2xl rounded-md border border-accent/40 bg-accent/[0.04] px-5 py-4 text-center">
              <p className="text-sm leading-6 text-foreground/85">
                <strong className="font-display font-bold text-accent">
                  {t("research.corruption.flow.exit", "Tameli")}
                </strong>{" "}
                {t(
                  "research.corruption.flow.exitMeaning",
                  "means the complaint is set aside for the time being. The file and its record are kept, and if further evidence comes to light the matter is dealt with under the law at that time. Hence, Tameli does not mean the case is settled permanently.",
                )}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {t(
                  "research.corruption.flow.exitCite",
                  "CIAA Act 2048, section 19(13).",
                )}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Row pairing, deliberately: 01 beside 02, 03 beside 04, 05 beside 06. A grid
          holds each row to its tallest card, so the shorter one leaves 100-150px
          under it -- the cost of keeping the numbered pairs together. Two flowing
          columns remove that space but reorder the reading to 01-02-03 down the left
          and 04-05-06 down the right, which is the worse trade on a numbered set. */}
      <div className="mt-8 grid items-start gap-6 md:mt-10 lg:grid-cols-2 lg:gap-8">
        <Highlight
          index={1}
          stat={pct1(tameliPct(lastDisposal))}
          statCaption={t(
            "research.corruption.hl.f1Stat",
            "of the decisions the CIAA took on fully investigated complaints in {{lastFy}} were Tameli, compared with {{peakPct}} in {{peakFy}}.",
            {
              lastFy: lastDisposal.fy,
              peakFy: peak.fy,
              peakPct: pct1(tameliPct(peak)),
            },
          )}
          headline={t(
            "research.corruption.hl.f1",
            "Most complaints are dropped long before a court sees them",
          )}
          chart={
            // A table, not the trend chart that carries the same series on the
            // Investigation tab. Here the reader wants to look a year up; there they
            // want the shape of the change. Same nine rows, read two ways.
            <TameliByYear
              rows={disposals}
              yearLabel={t("research.corruption.hl.f1Year", "Fiscal year")}
              investigatedLabel={t(
                "research.corruption.hl.f1Inv",
                "Investigated",
              )}
              courtLabel={t("research.corruption.hl.f1Court", "To court")}
              holdLabel={t("research.corruption.hl.f1Hold", "Tameli")}
              shareLabel={t("research.corruption.hl.f1Share", "Tameli %")}
            />
          }
          meta={{
            source: t("research.corruption.hl.f1Src", "CIAA annual reports"),
            sourceHref: CITATIONS.ciaaReports,
            to: "/investigation#tameli-by-year",
            toLabel: t(
              "research.corruption.hl.f1Link",
              "The year-by-year series",
            ),
          }}
        >
          {/*
            The three CIAA stage figures, shown as separate annual totals rather
            than a funnel. They are three different sets of complaints counted in
            the same year, so an arrow between them would assert a progression the
            reports do not support.
          */}
        </Highlight>

        <Highlight
          index={2}
          stat={pct1(rates.convictionPct)}
          statCaption={t(
            "research.corruption.hl.f2Stat",
            "of {{d}} decided cases ended in conviction, full or partial. Full convictions alone: {{full}}.",
            { d: n(decided), full: pct1(rates.convictionFullOnlyPct) },
          )}
          headline={t(
            "research.corruption.hl.f2",
            "How many corruption cases end in conviction?",
          )}
          chart={
            <OutcomeSplit
              segments={outcomeSegments}
              total={decided}
              totalLabel={t(
                "research.corruption.hl.decidedTotal",
                "Decided cases",
              )}
            />
          }
          meta={{
            source: t("research.corruption.hl.f2Src", "Special Court register"),
            sourceHref: CITATIONS.courtRecords,
            to: "/court-outcomes#how-cases-end",
            toLabel: t("research.corruption.hl.f2Link", "Outcomes in full"),
          }}
        />

        <Highlight
          index={3}
          stat={t("research.corruption.hl.f3Stat2", "{{first}} → {{last}}", {
            first: pct(shareOf(fakeFirst)),
            last: pct(shareOf(fakeLast)),
          })}
          statCaption={t(
            "research.corruption.hl.f3Caption2",
            "Share of all cases filed that were fake-certificate cases, in {{firstYear}} and in {{lastYear}}. The count fell too, from {{firstN}} cases to {{lastN}}.",
            {
              firstYear: fyLabel(fakeFirst.fy),
              lastYear: fyLabel(fakeLast.fy),
              firstN: n(fakeFirst.fake),
              lastN: n(fakeLast.fake),
            },
          )}
          headline={t(
            "research.corruption.hl.f3b",
            "Fake certificates once filled the docket. They no longer do.",
          )}
          explain={t(
            "research.corruption.hl.f3Body2",
            "These cases are upheld in full about {{conv}} of the time, the highest rate of any charge, which is why they carry so much of the conviction figure for the early years. The fall is not a straight line — the share rose again in {{bumpYear}} before dropping back — so read {{first}} as the shape of one period, not of the whole record.",
            {
              conv: pct(topCharge.fullPct),
              bumpYear: fyLabel(rebound.fy),
              first: pct(shareOf(fakeFirst)),
            },
          )}
          chart={
            <MiniTrend
              points={fakeShare}
              format={(v) => pct(v)}
              highlight={[0, fakeShare.length - 1]}
              ariaLabel={t(
                "research.corruption.hl.f3Aria",
                "Fake-certificate cases as a share of all cases filed, by fiscal year",
              )}
            />
          }
          meta={{
            source: t("research.corruption.hl.f3Src", "Charge sheets"),
            sourceHref: CITATIONS.chargeSheets,
            to: "/prosecution#charge-mix",
            toLabel: t(
              "research.corruption.hl.f3Link2",
              "The charge mix, year by year",
            ),
          }}
        />

        <Highlight
          index={4}
          stat={t(
            "research.corruption.hl.f3cStat2",
            "{{slow}} → {{fast}} months",
            {
              slow: n(Math.round(slowestCohort.medianMonths)),
              fast: n(Math.round(latestSettled.medianMonths)),
            },
          )}
          statCaption={t(
            "research.corruption.hl.f3cCaption2",
            "Median time from filing to verdict for cases filed in {{slowYear}}, the slowest year, against {{fastYear}} — the most recent year whose cases have essentially all been decided.",
            {
              slowYear: fyLabel(slowestCohort.fy),
              fastYear: fyLabel(latestSettled.fy),
            },
          )}
          headline={t(
            "research.corruption.hl.f3c2",
            "Cases are reaching a verdict faster than the overall median suggests",
          )}
          explain={t(
            "research.corruption.hl.f3cBody2",
            "Across all {{m}} decided cases the median is {{med}} months. That number covers fourteen years at once, so it describes the record rather than the Court's recent pace. The last two years are drawn dashed because they are still open: their medians count only the cases that have already finished, and they will rise as the slower ones land.",
            {
              m: n(duration.measured),
              med: n(Math.round(duration.median_months)),
            },
          )}
          chart={
            <MiniTrend
              points={cohortPoints}
              format={(v) =>
                t("research.corruption.hl.durMonths", "{{v}} mo", {
                  v: Math.round(v),
                })
              }
              reference={{
                value: duration.median_months,
                label: t(
                  "research.corruption.hl.durMedian",
                  "all-years median {{m}} mo",
                  {
                    m: n(Math.round(duration.median_months)),
                  },
                ),
              }}
              highlight={[slowestIdx, latestIdx]}
              ariaLabel={t(
                "research.corruption.hl.f3cAria",
                "Median months from filing to verdict, by the fiscal year the case was filed",
              )}
            />
          }
          meta={{
            source: t(
              "research.corruption.hl.f3cSrc",
              "Special Court register",
            ),
            sourceHref: CITATIONS.courtRecords,
            to: "/court-outcomes#pace-and-backlog",
            toLabel: t(
              "research.corruption.hl.f3cLink",
              "Pace and backlog by year",
            ),
          }}
        />

        <Highlight
          index={5}
          stat={n(appeals.defendant.reversed)}
          statCaption={t(
            "research.corruption.hl.f4Stat",
            "convicted people had their convictions overturned on appeal. The CIAA succeeded in overturning just {{c}} acquittals.",
            { c: n(appeals.commission.reversed) },
          )}
          headline={t(
            "research.corruption.hl.f4",
            "A conviction is far easier to overturn than an acquittal",
          )}
          explain={t(
            "research.corruption.hl.f4Body",
            "Of the {{dd}} decided appeals filed by convicted people, {{d}} ({{dpct}}) succeeded. By comparison, the CIAA succeeded in just {{c}} of its {{cd}} decided appeals ({{cpct}}). In simple terms, convicted people were much more likely to win their appeals than the CIAA was to overturn an acquittal. There is also a major gap in the records: no outcome could be found for {{pct}} of the appeals traced. These missing records make it harder to assess the full picture.",
            {
              c: n(appeals.commission.reversed),
              cd: n(appeals.commission.decided),
              cpct: pct1(
                appeals.commission.decided
                  ? (appeals.commission.reversed / appeals.commission.decided) *
                      100
                  : 0,
              ),
              d: n(appeals.defendant.reversed),
              dd: n(appeals.defendant.decided),
              dpct: pct1(
                appeals.defendant.decided
                  ? (appeals.defendant.reversed / appeals.defendant.decided) *
                      100
                  : 0,
              ),
              pct: pct1(untracedPct),
            },
          )}
          chart={
            <div className="mt-2">
              <AppealAsymmetry
                sides={appealSides}
                wonLabel={t("research.corruption.appeals.won", "succeeded of")}
                ofDecidedLabel={t(
                  "research.corruption.appeals.ofDecided",
                  "{{won}} of {{decided}} decided appeals succeeded",
                )}
                untraced={{
                  missing: appeals.no_outcome,
                  total: appeals.appeals,
                }}
                untracedLabel={t(
                  "research.corruption.appeals.untraced",
                  "Not counted above: {{missing}} of the {{total}} appeals traced ({{pct}}) have no recorded outcome.",
                )}
              />
            </div>
          }
          meta={{
            source: t("research.corruption.hl.f4Src", "Supreme Court records"),
            sourceHref: CITATIONS.courtRecords,
            to: "/appeals#appeal-asymmetry",
            toLabel: t("research.corruption.hl.f4Link", "The appeal record"),
          }}
        />

        <Highlight
          index={6}
          stat={t("research.corruption.hl.f5Stat", "Not published")}
          statCaption={t(
            "research.corruption.hl.f5Caption",
            "The CIAA said Rs {{bn}} billion was taken in 2081/82. No institution reports how much was recovered.",
            { bn: ciaa.damagesClaimedYearBn },
          )}
          headline={t(
            "research.corruption.hl.f5",
            "No one tracks whether the money is ever returned",
          )}
          explain={t(
            "research.corruption.hl.f5Body",
            "When the CIAA files a case it names the sum it says was taken, and the court can order it repaid. After that the trail stops: neither the CIAA, nor the courts, nor the treasury publish what was actually collected. The blank means unknown, not zero.",
          )}
          meta={{
            source: t(
              "research.corruption.hl.f5Src",
              "CIAA annual report; no recovery source exists",
            ),
            to: "/appeals#recovery-gap",
            toLabel: t("research.corruption.hl.f5Link", "The recovery gap"),
          }}
        />
      </div>
    </div>
  );
}
