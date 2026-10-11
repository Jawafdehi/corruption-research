import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Highlight, Reveal } from "@/components/highlights/Highlight";
import { ChargeRateBars, type ChargeRate } from "@/components/highlights/ChargeRateBars";
import { DurationBands } from "@/components/highlights/DurationBands";
import {
  ProcessDiagram,
  type DiagramNode,
} from "@/components/highlights/ProcessDiagram";
import { OutcomeSplit, type OutcomeSegment } from "@/components/highlights/OutcomeSplit";
import { AppealAsymmetry, type AppealSide } from "@/components/research/AppealAsymmetry";
import { TameliTrend } from "@/components/research/TameliTrend";
import {
  CITATIONS,
  REPORT,
  decidedClean,
  outcomePct,
  tameliPct,
} from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

/** Charges with too few decided cases for a rate to mean anything are not shown. */
const MIN_DECIDED = 60;

export default function Highlights() {
  const { t } = useTranslation();
  const { n, pct, pct1 } = useFormat();
  const { appeals, byCharge, ciaa, corpus, disposals, outcome, rates } = REPORT;

  const decided = decidedClean(outcome);

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

  // D — how the Supreme Court treated the judgment below it, summed across the
  // trial-outcome rows. "Upheld" counts both an affirmed judgment and an appeal
  // whose claim was rejected: in each the Special Court's decision survives.
  const sumCol = (k: "affirmed" | "claim_denied" | "reversed" | "partially_reversed") =>
    appeals.byTrialOutcome.reduce((acc, r) => acc + r[k], 0);
  const upheld = sumCol("affirmed") + sumCol("claim_denied");
  const overturned = sumCol("reversed");
  const partlyChanged = sumCol("partially_reversed");

  // C — duration, over decided cases only.
  const duration = REPORT.duration;
  const withinTwo = duration.bands
    .slice(0, 2)
    .reduce((acc, b) => acc + b.cases, 0);
  const withinTwoPct = duration.measured ? (withinTwo / duration.measured) * 100 : 0;


  // The route a complaint takes, checked against the अख्तियार दुरुपयोग अनुसन्धान
  // आयोग कार्यविधि, २०७८ and the विशेष अदालत ऐन, २०५९ दफा १७.
  //
  // तामेली exits sit on stages 2, 3 and 5 because the कार्यविधि gives one at each:
  // दफा २१(३) at screening, दफा २२(३)(छ) after the preliminary inquiry, and
  // दफा २५(ग) when the Commission rules on the investigation report. Stage 4 has
  // none of its own; its report goes to stage 5, which is where it can be closed.
  const flowStages: DiagramNode[] = [
    {
      key: "darta",
      title: t("research.corruption.flow.s1Title", "Complaint registration"),
      body: t("research.corruption.flow.s1", "Every complaint the Commission receives is registered."),
    },
    {
      key: "parikshan",
      title: t("research.corruption.flow.s2Title", "Screening"),
      body: t(
        "research.corruption.flow.s2",
        "A screening committee assesses what the complaint is about and recommends what should happen to it. The Commissioner decides.",
      ),
      exit: t("research.corruption.flow.exit", "Tameli"),
    },
    {
      key: "prarambhik",
      title: t("research.corruption.flow.s3Title", "Preliminary inquiry"),
      body: t(
        "research.corruption.flow.s3",
        "Documents are called for, the office concerned is asked to respond, and the available facts are checked.",
      ),
      exit: t("research.corruption.flow.exit", "Tameli"),
    },
    {
      key: "bistrit",
      title: t("research.corruption.flow.s4Title", "Detailed investigation"),
      body: t(
        "research.corruption.flow.s4",
        "If grounds for corruption appear, an investigating officer is appointed and a full investigation goes ahead.",
      ),
    },
    {
      key: "abhiyojan",
      title: t("research.corruption.flow.s5Title", "Prosecution decision"),
      body: t(
        "research.corruption.flow.s5",
        "On the evidence the investigation produced, the Commission decides whether or not to prosecute.",
      ),
      exit: t("research.corruption.flow.exit", "Tameli"),
    },
    {
      key: "adalat",
      title: t("research.corruption.flow.s6Title", "Special Court"),
      body: t(
        "research.corruption.flow.s6",
        "If it decides to prosecute, a charge sheet is filed at the Special Court, which decides the case on the evidence.",
      ),
    },
    {
      key: "punarabedan",
      title: t("research.corruption.flow.s7Title", "Appeal"),
      body: t(
        "research.corruption.flow.s7",
        "A party dissatisfied with the verdict may appeal to the Supreme Court as the law allows.",
      ),
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
              "A complaint to the anti-corruption commission, the CIAA, has to clear several filters before anyone reaches a courtroom, and most never do. The diagram below is the legal route, taken from the Commission's own rules. The findings after it show how many cases actually fall out at each stage, counted from {{cases}} prosecutions in the Special Court register and fourteen years of CIAA annual reports.",
              { cases: n(corpus.ciaaProsecutions) },
            )}
          </p>
        </header>
      </Reveal>

      <Reveal>
        <section className="mt-10 md:mt-12" aria-labelledby="flow-heading">
          <h3 id="flow-heading" className="font-display text-lg font-bold leading-snug md:text-xl">
            {t("research.corruption.flow.title", "How a corruption complaint travels")}
          </h3>
          <div className="mt-6 max-w-4xl">
            <ProcessDiagram
              stages={flowStages}
              labels={{
                start: t("research.corruption.flow.start", "Complaint received"),
                yes: t("research.corruption.flow.yes", "yes"),
                no: t("research.corruption.flow.no", "no"),
                dScreen: t("research.corruption.flow.dScreen", "Taken forward?"),
                dGrounds: t("research.corruption.flow.dGrounds", "Grounds found?"),
                dProsecute: t("research.corruption.flow.dProsecute", "Prosecute?"),
                dAppeal: t("research.corruption.flow.dAppeal", "Appeal lodged?"),
                chargeSheet: t("research.corruption.flow.chargeSheet", "charge sheet filed"),
                exitTitle: t("research.corruption.flow.exit", "Tameli"),
                standsTitle: t("research.corruption.flow.stands", "Verdict stands"),
                srIntro: t(
                  "research.corruption.flow.srIntro",
                  "The route a corruption complaint takes, in order. Steps one to five sit with the Commission; steps six and seven are separate courts.",
                ),
                srExit: t(
                  "research.corruption.flow.srExit",
                  "A complaint may be set aside as Tameli at this stage.",
                ),
              }}
            />
            {/*
              The meaning of तामेली, stated where there is room for both halves of
              it. अनुसूची-११ of the कार्यविधि puts the complaint aside "हाललाई" —
              for the time being — expressly on the footing that it is taken up
              again if further evidence appears. Calling it simply "closed" drops
              the second half and overstates how final it is.
            */}
            <div className="mt-5 max-w-2xl rounded-md border-l-2 border-accent bg-accent/[0.04] px-4 py-3">
              <p className="text-sm leading-6 text-foreground/85">
                <strong className="font-display font-bold text-accent">
                  {t("research.corruption.flow.exit", "Tameli")}
                </strong>{" "}
                {t(
                  "research.corruption.flow.exitMeaning",
                  "means the complaint is set aside for the time being and not closed permanently. The file and its record are kept, and the Commission's own notice states that if further evidence comes to light the matter is dealt with under the law at that time.",
                )}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {t(
                  "research.corruption.flow.exitCite",
                  "CIAA Act 2048, section 19(13); form at Schedule 11 of the 2078 procedure.",
                )}
              </p>
            </div>

          </div>
        </section>
      </Reveal>

      {/* 01 — lead. Widest slot, figure and chart side by side. */}
      <div className="mt-14 md:mt-20">
        <Highlight
          index={1}
          size="lead"
          stat={pct(tameliPct(lastDisposal))}
          statCaption={t(
            "research.corruption.hl.f1Stat",
            "of complaints that finished a full investigation were closed with no charges in {{fy}}. Five years earlier it was {{was}}.",
            { fy: lastDisposal.fy, was: pct(tameliPct(firstDisposal)), wasFy: firstDisposal.fy },
          )}
          headline={t(
            "research.corruption.hl.f1",
            "What happens after a corruption complaint is filed?",
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
        >
          {/*
            The three CIAA stage figures, shown as separate annual totals rather
            than a funnel. They are three different sets of complaints counted in
            the same year, so an arrow between them would assert a progression the
            reports do not support.
          */}
          <div className="mt-6 rounded-lg border border-border bg-[hsl(var(--surface))] p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t("research.corruption.hl.f1StagesTitle", "One year at the CIAA, FY2081/82")}
            </p>
            <dl className="mt-3 grid grid-cols-3 gap-3">
              {[
                {
                  k: "complaints",
                  v: n(ciaa.complaintsYear),
                  l: t("research.corruption.hl.stageComplaints", "complaints received"),
                },
                {
                  k: "investigated",
                  v: n(ciaa.investigatedYear),
                  l: t("research.corruption.hl.stageInvestigated", "full investigations finished"),
                },
                {
                  k: "filed",
                  v: n(ciaa.casesFiledYear),
                  l: t("research.corruption.hl.stageFiled", "cases filed in court"),
                },
              ].map((i) => (
                <div key={i.k}>
                  <dt className="font-mono text-xl font-semibold tabular-nums text-foreground md:text-2xl">
                    {i.v}
                  </dt>
                  <dd className="mt-1 text-xs leading-4 text-muted-foreground">{i.l}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 border-t border-border pt-2.5 text-xs leading-5 text-muted-foreground">
              {t(
                "research.corruption.hl.f1StagesNote",
                "These are three separate annual totals, not one group of complaints followed through. A complaint received this year is rarely investigated this year and almost never prosecuted this year, so these figures cannot be read as a conversion rate.",
              )}
            </p>
          </div>
        </Highlight>
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
            "How many corruption cases end in conviction?",
          )}
          explain={t(
            "research.corruption.hl.f2Body",
            "The Special Court gives one verdict for the whole case: convicted, partly convicted, or acquitted. Partly convicted usually means some of the accused were found guilty and the rest were cleared, and the record does not say which. So a case where ten officials were charged and only the most junior was convicted is recorded exactly like one where all ten were. Every figure here therefore counts cases, not people. A further {{ongoing}} cases are still pending, meaning no verdict yet, and pending is not the same as failed.",
            { ongoing: n(outcome.ongoing) },
          )}
          chart={
            <>
              <OutcomeSplit
                segments={outcomeSegments}
                total={decided}
                totalLabel={t("research.corruption.hl.decidedTotal", "Decided cases")}
              />
              {/* The single rate above is close to meaningless on its own, so the
                  thing that governs it sits in the same highlight rather than a
                  separate one competing for attention. */}
              <div className="mt-7 border-t border-border pt-5">
                <p className="mb-4 text-sm leading-6 text-foreground/80">
                  {t(
                    "research.corruption.hl.f2Charge",
                    "That one rate hides most of the story. What someone is charged with predicts the verdict better than almost anything else. Cases about a fake education certificate end in full conviction {{top}} of the time and supply {{share}} of every full conviction here. Cases about handing someone an unlawful benefit: {{bottom}}. Harder charges are genuinely harder to prove, so a low rate is not by itself evidence that an investigation was poor.",
                    {
                      top: pct(topCharge.fullPct),
                      bottom: pct(bottomCharge.fullPct),
                      share: pct(fakeShareOfFull),
                    },
                  )}
                </p>
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
              </div>
            </>
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
          stat={t("research.corruption.hl.f3cStat", "{{m}} months", {
            m: n(Math.round(duration.median_months)),
          })}
          statCaption={t(
            "research.corruption.hl.f3cCaption",
            "is the median time from filing to verdict for the {{m}} decided cases we could time. Median means half took less, half took more.",
            { m: n(duration.measured) },
          )}
          headline={t(
            "research.corruption.hl.f3c",
            "How long does it take to decide a corruption case?",
          )}
          explain={t(
            "research.corruption.hl.f3cBody",
            "Most decided cases move faster than their reputation suggests: {{within}} of them reached a verdict within two years of being filed. The average is pulled up by a long tail, with {{over}} taking more than three years. One caution on reading this: it measures cases that have already finished. The {{pending}} still waiting for a verdict have no duration yet, and they are the slow ones, so the real time a case takes is longer than these bars show.",
            {
              within: pct1(withinTwoPct),
              over: n(duration.bands[3].cases),
              pending: n(duration.pending),
            },
          )}
          chart={
            <DurationBands
              bands={duration.bands}
              measured={duration.measured}
              median={duration.median_months}
              pending={duration.pending}
              labels={{
                heading: t(
                  "research.corruption.hl.durHeading",
                  "Time from filing to verdict, decided cases only",
                ),
                cumulative: t("research.corruption.hl.durCumulative", "{{pct}} decided within two years", {
                  pct: pct1(withinTwoPct),
                }),
                medianNote: t("research.corruption.hl.durMedian", "Median {{m}} months", {
                  m: n(Math.round(duration.median_months)),
                }),
                pendingNote: t(
                  "research.corruption.hl.durPending",
                  "{{p}} cases still pending are not counted here, because a case that has not ended has no duration yet.",
                  { p: n(duration.pending) },
                ),
              }}
            />
          }
          meta={{
            context: t(
              "research.corruption.hl.f3cCtx",
              "Counted from the date a case was registered to the month its verdict was delivered, over {{m}} of the {{all}} cases where both dates are recorded. Pending cases are excluded, which makes these figures faster than the true picture.",
              { m: n(duration.measured), all: n(corpus.ciaaProsecutions) },
            ),
            source: t("research.corruption.hl.f3cSrc", "Special Court criminal register"),
            sourceHref: CITATIONS.courtRecords,
            to: "/court-outcomes",
            toLabel: t("research.corruption.hl.f3cLink", "Pace and backlog by year"),
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
            "appeals by convicted people succeeded outright. The CIAA, appealing cases it had lost, succeeded {{c}} times.",
            { c: n(appeals.commission.reversed) },
          )}
          headline={t(
            "research.corruption.hl.f4",
            "What happens after the Special Court's verdict?",
          )}
          explain={t(
            "research.corruption.hl.f4Body",
            "Either side can appeal to the Supreme Court, and the two sides fare very differently. Across {{dec}} appeals the Supreme Court has decided, it left the Special Court's verdict standing in {{up}}, overturned it completely in {{ov}}, and changed it in part in {{part}}. Who won depends on who appealed: of {{cd}} CIAA appeals decided, the CIAA overturned the verdict {{c}} times; of {{dd}} appeals by convicted people, {{d}} succeeded. So when the CIAA loses a case that is usually the end of it, and when it wins, the conviction is less secure than it looks. The striped band is a separate problem: for {{pct}} of the appeals we found, no result is recorded anywhere we can reach, because Nepal's courts store a trial and its appeal as two unrelated cases. That is a record-keeping failure, not a comment on the Supreme Court.",
            {
              dec: n(appeals.decided),
              up: n(upheld),
              ov: n(overturned),
              part: n(partlyChanged),
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
                  "Where do the biggest gaps appear?",
                )}
              </h3>
              <p className="mt-4 max-w-prose leading-7 text-foreground/80">
                {t(
                  "research.corruption.hl.f5Body",
                  "Three gaps run across everything above, and the largest is money. When the CIAA files a case it states how much it believes was stolen or lost, a figure called बिगो. If the court agrees, it orders repayment. What happens next is recorded by nobody: not the CIAA, not the courts, not the treasury. There is no public figure for how much was ordered repaid, collected, or still owed. The second gap is that nearly half the appeals cannot be traced to a result. The third is that no closure decision carries a published reason. None of these shows that an institution set out to hide anything. Each is what happens when three bodies keep separate records and nobody is responsible for joining them.",
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
