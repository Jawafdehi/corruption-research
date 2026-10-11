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
} from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

/** Charges with too few decided cases for a rate to mean anything are not shown. */
const MIN_DECIDED = 60;

export default function Highlights() {
  const { t } = useTranslation();
  const { n, pct, pct1 } = useFormat();
  const { appeals, byCharge, ciaa, disposals, outcome, rates } = REPORT;

  const decided = decidedClean(outcome);

  // 01 — the Commission's second filter.
  const cd = REPORT.complaintDisposal[0];

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
      title: t("research.corruption.flow.s7Title", "Supreme Court appeal"),
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
          <h2 className="mt-3 font-display text-[1.9rem] font-bold leading-[1.1] tracking-tight md:text-[2.75rem]">
            {t(
              "research.corruption.hl.title",
              "How a corruption case moves, and where it stops",
            )}
          </h2>
        </header>
      </Reveal>

      <Reveal>
        <section className="mt-2 md:mt-4" aria-label={t("research.corruption.flow.title", "How a corruption complaint travels")}>
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

      {/* Four findings, one shape each. */}
      <div className="mt-10 grid gap-6 md:mt-12 lg:grid-cols-2 lg:gap-8">
        <Highlight
          index={1}
          stat={pct1(((cd.tameli + cd.tameli_with_advice) / cd.total_complaints) * 100)}
          statCaption={t(
            "research.corruption.hl.f1Stat",
            "of the {{total}} complaints on the Commission's books in {{fy}} were set aside as Tameli, without a case being filed",
            { total: n(cd.total_complaints), fy: cd.fy },
          )}
          headline={t(
            "research.corruption.hl.f1",
            "Most corruption complaints end before a judge ever sees them",
          )}
          explain={t(
            "research.corruption.hl.f1Body",
            "Of the {{done}} investigations finished that year, {{tam}} still ended in Tameli and only {{filed}} reached a courtroom. The Commission never publishes why.",
            {
              done: n(cd.investigations_completed),
              tam: n(cd.inv_tameli),
              filed: n(cd.inv_filed),
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
            source: t("research.corruption.hl.f1Src", "CIAA annual reports"),
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
        </Highlight>

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
            "One verdict covers the whole case, so a partial conviction could mean one junior official convicted and everyone senior cleared. These count cases, never people.",
            { ongoing: n(outcome.ongoing) },
          )}
          chart={
            <OutcomeSplit
              segments={outcomeSegments}
              total={decided}
              totalLabel={t("research.corruption.hl.decidedTotal", "Decided cases")}
            />
          }
          meta={{
            source: t("research.corruption.hl.f2Src", "Special Court register"),
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
            "What you are charged with decides the verdict",
          )}
          explain={t(
            "research.corruption.hl.f3Body",
            "Fake certificate cases supply {{share}} of every full conviction here. Harder charges are genuinely harder to prove, so a low rate is not by itself evidence of a poor investigation.",
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
            source: t("research.corruption.hl.f3Src", "Charge sheets"),
            sourceHref: CITATIONS.chargeSheets,
            to: "/prosecution",
            toLabel: t("research.corruption.hl.f3Link", "What gets charged"),
          }}
        />

        <Highlight
          index={4}
          stat={t("research.corruption.hl.f3cStat", "{{m}} months", {
            m: n(Math.round(duration.median_months)),
          })}
          statCaption={t(
            "research.corruption.hl.f3cCaption",
            "median from filing to Special Court verdict, over {{m}} decided cases. Half took less, half more.",
            { m: n(duration.measured) },
          )}
          headline={t(
            "research.corruption.hl.f3c",
            "How long does the Special Court take to decide a case?",
          )}
          explain={t(
            "research.corruption.hl.f3cBody",
            "{{within}} are decided within two years. But this counts only cases that finished; the {{pending}} still waiting are the slow ones, so the true figure is longer.",
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
            source: t("research.corruption.hl.f3cSrc", "Special Court register"),
            sourceHref: CITATIONS.courtRecords,
            to: "/court-outcomes",
            toLabel: t("research.corruption.hl.f3cLink", "Pace and backlog by year"),
          }}
        />

        <Highlight
          index={5}
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
            "Convicted people win {{d}} of {{dd}} decided appeals. The CIAA wins {{c}} of {{cd}}. A striped band marks the {{pct}} with no recorded result at all.",
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
            source: t("research.corruption.hl.f4Src", "Supreme Court records"),
            sourceHref: CITATIONS.courtRecords,
            to: "/appeals",
            toLabel: t("research.corruption.hl.f4Link", "The appeal record"),
          }}
        />

        <Highlight
          index={6}
          stat={t("research.corruption.hl.f5Stat", "Not published")}
          statCaption={t(
            "research.corruption.hl.f5Caption",
            "The CIAA said Rs {{bn}} billion was stolen or lost in 2081/82. No institution publishes how much came back.",
            { bn: ciaa.damagesClaimedYearBn },
          )}
          headline={t(
            "research.corruption.hl.f5",
            "Nobody records whether the money ever comes back",
          )}
          explain={t(
            "research.corruption.hl.f5Body",
            "बिगो is the amount the CIAA says was taken. If the court agrees it orders repayment, and from there nobody records anything: not the CIAA, not the courts, not the treasury. Read the blank as missing, not as zero.",
          )}
          meta={{
            source: t("research.corruption.hl.f5Src", "CIAA annual report; no recovery source exists"),
            to: "/gaps",
            toLabel: t("research.corruption.hl.f5Link", "The recovery gap"),
          }}
        />
      </div>

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
