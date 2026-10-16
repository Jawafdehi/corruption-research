import { useTranslation } from "react-i18next";

import { Highlight, Reveal } from "@/components/highlights/Highlight";
import { MiniTrend, type TrendPoint } from "@/components/highlights/MiniTrend";
import { AboutResearch } from "@/components/highlights/AboutResearch";
import { DurationSpread } from "@/components/highlights/DurationSpread";
import {
  RouteMap,
  type RouteLabels,
  type RoutePhase,
} from "@/components/highlights/RouteMap";
import { RouteOval } from "@/components/highlights/RouteOval";
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
  const { n, pct, pct1, pct2 } = useFormat();
  const {
    appeals,
    byCharge,
    chargeMixByYear,
    ciaa,
    corpus,
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
    home: "https://jawafdehi.org",
    cases: "https://jawafdehi.org/cases",
    jalahariCase: "https://jawafdehi.org/case/jalahari/",
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

  /*
   * What the Commission did about the cases it lost outright, and what came of it.
   * From the acquittal row of byTrialOutcome rather than the all-appeals totals,
   * because the question is specifically about appealing a loss.
   */
  const acqRow = appeals.byTrialOutcome.find(
    (r) => r.trial_outcome === "सफाई" && r.appealed_by === "CIAA_GOVERNMENT",
  );
  const ciaaAcqAppeals = acqRow?.appeals ?? 0;
  const ciaaAcqWon =
    (acqRow?.reversed ?? 0) + (acqRow?.partially_reversed ?? 0);
  const ciaaAcqDecided = acqRow
    ? acqRow.appeals - acqRow.no_outcome_recorded
    : 0;
  const ciaaAcqShare = outcome.acquitted
    ? (ciaaAcqAppeals / outcome.acquitted) * 100
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
   * (दफा २२(३)(छ)) and on the investigation report (दफा २५(ग)). Stage 4 has no exit of
   * its own: its report goes to stage 5, which is where it can be closed. The appeal is
   * conditional, so a verdict nobody appeals stands.
   *
   * Stages 7 and 8 are separate because lodging an appeal and getting a decision on it
   * are different events years apart, and that distance is itself a finding.
   *
   * An insight is attached only where the record carries one. Stage 3 has none: the
   * annual reports publish no figure for preliminary inquiries as a class.
   */
  /*
   * What Tameli is, attached to the first chip that says the word rather than printed
   * under the whole figure. अनुसूची-११ of the कार्यविधि puts the complaint aside
   * "हाललाई" — for the time being — expressly so it can be taken up again, so calling
   * it "closed" overstates how final it is. The second half is what the record then
   * shows about that promise: nothing.
   */
  const tameliNote = (
    <>
      <p>
        <strong className="font-display font-bold text-accent">
          {t("research.corruption.flow.exit", "Tameli")}
        </strong>{" "}
        {t(
          "research.corruption.flow.tameliDef2",
          "means putting a complaint aside for now. The file is kept, and the complaint can be looked at again if new evidence comes up. So, Tameli does not mean the matter is permanently closed.",
        )}
      </p>
      <p className="mt-2">
        {t(
          "research.corruption.flow.tameliLost2",
          "The problem is that people cannot see what happens after that. The CIAA does not publish the reasons for individual Tameli decisions or how many complaints are later reopened. Once a complaint goes to Tameli, people outside the Commission have no clear way to find out whether it was looked at again or what happened to it.",
        )}
      </p>
      <p className="mt-1.5 text-[0.68rem] text-muted-foreground">
        {t(
          "research.corruption.flow.tameliCite",
          "CIAA Act 2048, section 19(13).",
        )}
      </p>
    </>
  );

  const routePhases: RoutePhase[] = [
    {
      key: "ciaa",
      tone: "commission",
      label: t("research.corruption.route.pCiaa2", "CIAA"),
      steps: [
        {
          key: "darta",
          n: 1,
          title: t(
            "research.corruption.flow.s1Title3",
            "A corruption complaint is filed",
          ),
          insight: {
            kind: "gap",
            title: t(
              "research.corruption.route.i1Title4",
              "Complainants cannot track the status of their complaints",
            ),
            body: (
              <p>
                {t(
                  "research.corruption.route.i1Body4",
                  "The Commission receives complaints online, by phone and by email. In {{fy}}, it had {{all}} complaints on record. But a person who files a complaint cannot publicly check what happened to it through a complaint-tracking system. The Commission publishes the total number of complaints received each year, not the status of individual complaints. Those seeking information can file a right-to-information request, but this is a general legal process, not a way to track a complaint. Public records do not show whether complainants receive updates through other means.",
                  { all: n(cd.total_complaints), fy: cd.fy },
                )}
              </p>
            ),
            href: "/investigation#tameli-by-year",
            linkLabel: t(
              "research.corruption.route.i1Link2",
              "What happens to complaints after they are filed",
            ),
          },
        },
        {
          key: "parikshan",
          n: 2,
          title: t(
            "research.corruption.flow.s2Title2",
            "The CIAA screens the complaint",
          ),
          exit: {
            condition: t(
              "research.corruption.flow.cScreen",
              "If it is not taken forward",
            ),
            label: t("research.corruption.flow.exit", "Tameli"),
            tone: "tameli",
            noteTitle: t("research.corruption.flow.exit", "Tameli"),
            note: tameliNote,
          },
        },
        {
          key: "prarambhik",
          n: 3,
          title: t(
            "research.corruption.flow.s3Title2",
            "The CIAA conducts a preliminary inquiry",
          ),
          /*
           * The split sits HERE, not on screening. तालिका २.१४ of the 35th report
           * counts what the Commission disposed of before any detailed investigation,
           * and the column that matters — 927 sent on — is the output of the
           * preliminary inquiry, not of screening. The table does not separate the two
           * stages, so one insight covers both and the caption says so. Putting it on
           * screening implied the 3.1% was decided one stage earlier than it is.
           *
           * NOT the 75.1% this card showed before either: that is तालिका २.१५,
           * तामेली after a detailed investigation finishes — a third stage again.
           */
          split: {
            total: cd.disposed,
            parts: [
              {
                key: "tameli",
                tone: "out",
                value: cd.tameli + cd.tameli_with_advice,
                share: pct1(
                  ((cd.tameli + cd.tameli_with_advice) / cd.disposed) * 100,
                ),
                label: t(
                  "research.corruption.route.splitTameli3",
                  "Placed in Tameli: {{n}} complaints",
                  { n: n(cd.tameli + cd.tameli_with_advice) },
                ),
              },
              {
                key: "other",
                tone: "other",
                value: cd.other_action,
                share: pct1((cd.other_action / cd.disposed) * 100),
                label: t(
                  "research.corruption.route.splitOther3",
                  "Other action taken: {{n}} complaints",
                  { n: n(cd.other_action) },
                ),
              },
              {
                key: "on",
                tone: "on",
                value: cd.to_investigation,
                share: pct1((cd.to_investigation / cd.disposed) * 100),
                label: t(
                  "research.corruption.route.splitOn3",
                  "Sent for detailed investigation: {{n}} complaints",
                  { n: n(cd.to_investigation) },
                ),
              },
            ],
            caption: t(
              "research.corruption.route.splitCaption3",
              "Of the {{n}} complaints the Commission dealt with in {{fy}} before a detailed investigation, nearly six in ten were placed in Tameli, while only about three in every hundred moved to a detailed investigation. These figures come from Table 2.14 of the Commission's 35th annual report, which does not distinguish between initial screening and preliminary inquiry.",
              { n: n(cd.disposed), fy: cd.fy },
            ),
          },
          exit: {
            condition: t(
              "research.corruption.flow.cGrounds",
              "If no grounds are found",
            ),
            label: t("research.corruption.flow.exit", "Tameli"),
            tone: "tameli",
          },
          insight: {
            kind: "gap",
            title: t(
              "research.corruption.route.i2Title5",
              "Six in ten complaints are placed in Tameli, but no reasons are given for these decisions",
            ),
            body: (
              <p>
                {t(
                  "research.corruption.route.i2Body5",
                  "The CIAA report shows how many complaints were closed without further investigation, but not why each complaint was closed. Some complaints may lack evidence, fall outside the CIAA's legal authority, or have no clear basis. But the public cannot see which reasons applied to which complaints. This makes it difficult to know whether the CIAA followed the law and treated similar complaints in the same way.",
                )}
              </p>
            ),
            href: "/investigation#tameli-by-year",
            linkLabel: t(
              "research.corruption.route.i2Link2",
              "See how many complaints were placed in Tameli each year",
            ),
          },
        },
        {
          key: "bistrit",
          n: 4,
          title: t(
            "research.corruption.flow.s4Title2",
            "The CIAA carries out a detailed investigation",
          ),
          insight: {
            kind: "finding",
            title: t(
              "research.corruption.route.i4Title4",
              "The continuing controversy over CIAA sting operations",
            ),
            body: (
              <>
                <p>
                  {t(
                    "research.corruption.route.i4BodyA",
                    "An investigation is meant to find out what happened, not to create the circumstances for an offence. In a sting operation, the Commission itself supplied the bribe money. This raised a basic question: was it uncovering an offence that had already taken place, or creating the situation in which the offence was recorded?",
                  )}
                </p>
                <p>
                  {t("research.corruption.route.i4BodyB1", "On 2078/01/08, ")}
                  <a href={JAWAFDEHI.sting} target="_blank" rel="noreferrer">
                    {t(
                      "research.corruption.route.i4Ruling",
                      "the Supreme Court struck down the rule the Commission had relied on",
                    )}
                  </a>
                  {t(
                    "research.corruption.route.i4BodyB2",
                    ". The Court made clear that an investigation must establish what actually happened, not create an event that would not otherwise have occurred. Section 62(d) has since brought sting operations into the Act itself. But putting the power into law does not, by itself, settle the deeper question the Court's ruling raised: can the state create the circumstances of an offence and then prosecute someone for it?",
                  )}
                </p>
              </>
            ),
            href: "/investigation#sting-operation",
            linkLabel: t(
              "research.corruption.route.i4Link2",
              "See what happened to bribery cases after the ruling",
            ),
          },
        },
        {
          key: "abhiyojan",
          n: 5,
          title: t(
            "research.corruption.flow.s5Title2",
            "The CIAA decides whether to prosecute",
          ),
          exit: {
            condition: t(
              "research.corruption.flow.cProsecute",
              "If the CIAA decides not to prosecute",
            ),
            label: t("research.corruption.flow.exit", "Tameli"),
            tone: "tameli",
          },
          insight: {
            kind: "finding",
            title: t(
              "research.corruption.route.i5Title4",
              "Selective prosecution: why some are charged and others are left out",
            ),
            body: (
              <p>
                {t(
                  "research.corruption.route.i5BodyA",
                  "When the Commission investigates a corruption case, it must decide who to charge based on the evidence against each person. Sometimes, some people are charged while others involved in the same case are not. That alone does not mean selective prosecution, because the evidence against each person may be different. The concern is whether there are clear reasons for charging some people and leaving others out, and whether those reasons can be examined. In the ",
                )}
                <a
                  href={JAWAFDEHI.jalahariCase}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t(
                    "research.corruption.route.i5Case",
                    "Pashupatinath Jalahari case",
                  )}
                </a>
                {t(
                  "research.corruption.route.i5BodyB2",
                  ", the Special Court itself questioned why some people were named in the charge sheet while others were left out. ",
                )}
                <a href={JAWAFDEHI.jalahari} target="_blank" rel="noreferrer">
                  {t(
                    "research.corruption.route.i5Analysis",
                    "Our analysis of that judgment",
                  )}
                </a>
                {t(
                  "research.corruption.route.i5BodyC",
                  " sets out who was charged and who was not. Yet there is no publicly available record that allows people to examine this pattern across corruption cases and see whether similar decisions are being made consistently.",
                )}
              </p>
            ),
            href: "/prosecution#charge-mix",
            linkLabel: t(
              "research.corruption.route.i5Link2",
              "See which charges the CIAA brings",
            ),
          },
        },
      ],
    },
    {
      key: "special",
      tone: "court",
      label: t("research.corruption.route.pSpecial", "Special Court"),
      steps: [
        {
          key: "adalat",
          n: 6,
          title: t(
            "research.corruption.flow.s6Title3",
            "The Special Court hears the case and delivers a verdict",
          ),
          exit: {
            condition: t(
              "research.corruption.flow.cAppeal",
              "If neither party appeals",
            ),
            label: t("research.corruption.flow.stands", "Verdict stands"),
            tone: "stands",
          },
          insight: {
            kind: "finding",
            title: t(
              "research.corruption.route.i6Title4",
              "Extensive state powers, but how strong are the cases?",
            ),
            body: (
              <>
                <p>
                  {t(
                    "research.corruption.route.i6BodyC",
                    "The CIAA has constitutional authority, investigative powers and state resources behind it. Yet, of the {{d}} cases with a clear verdict, only {{full}} ended in full conviction. Another {{part}} ended in partial conviction, while {{acq}} ended in acquittal. More than half, therefore, did not result in full conviction.",
                    {
                      d: n(decided),
                      full: pct1((outcome.convicted / decided) * 100),
                      part: pct1((outcome.partial / decided) * 100),
                      acq: pct1((outcome.acquitted / decided) * 100),
                    },
                  )}
                </p>
                <p>
                  {t(
                    "research.corruption.route.i6BodyD",
                    "These figures raise an important question about the strength of the cases the Commission brings to court. When a constitutional body has the power to investigate, gather evidence and prosecute, its cases should be built on solid evidence. The figures do not prove that every acquittal resulted from a weak investigation. But when more than half of decided cases fall short of full conviction, the reasons deserve serious scrutiny. Without records explaining why cases end in acquittal or partial conviction, the public cannot tell whether the problem lies in the investigation, the charges filed or other factors.",
                  )}
                </p>
                <p>
                  {t(
                    "research.corruption.route.i6BodyE",
                    "The consequences are not limited to the courtroom. A person accused of corruption may spend years facing legal proceedings, financial strain and damage to their reputation. Even after acquittal, the social stigma of being accused may remain. The state must be able to investigate and prosecute corruption, but that power also carries a responsibility to bring well-founded cases. The public should be able to examine whether that responsibility is being met.",
                  )}
                </p>
              </>
            ),
            gapNote: (
              <p>
                {t(
                  "research.corruption.route.i6Gap4",
                  "Of the {{all}} complaints on the Commission's books in {{fy}}, {{filed}} were filed in court — {{pct}}. Of the cases a court has decided, {{less}} did not end in full conviction. Not every complaint should lead to a prosecution, and an acquittal does not prove the Commission was wrong to bring the case. But very few complaints become cases, and more than half of the cases that do fall short of a full conviction. The published record gives no reason for either — not why a complaint was dropped, and not why a case failed — so there is no way to tell where corruption prosecution is breaking down.",
                  {
                    all: n(cd.total_complaints),
                    fy: cd.fy,
                    filed: n(cd.inv_filed),
                    pct: pct2((cd.inv_filed / cd.total_complaints) * 100),
                    less: pct1(
                      ((outcome.partial + outcome.acquitted) / decided) * 100,
                    ),
                  },
                )}
              </p>
            ),
            href: "/court-outcomes#how-cases-end",
            linkLabel: t(
              "research.corruption.route.i6Link2",
              "Explore the court's verdicts and conviction rates",
            ),
          },
        },
      ],
    },
    {
      key: "supreme",
      tone: "court",
      label: t("research.corruption.route.pSupreme", "Supreme Court"),
      steps: [
        {
          key: "punarabedan",
          n: 7,
          title: t(
            "research.corruption.flow.s7Title3",
            "Either party appeals to the Supreme Court",
          ),
          insight: {
            kind: "finding",
            title: t(
              "research.corruption.route.i7Title6",
              "The CIAA appeals most acquittals, but rarely changes the outcome",
            ),
            body: (
              <>
                <p>
                  {t(
                    "research.corruption.route.i7BodyA",
                    "The CIAA appealed {{share}} of the acquittals against it, filing {{n}} appeals. But of the {{decided}} appeals that have been decided, only {{won}} resulted in a different verdict — {{pctWon}} of them. By contrast, {{dp}} of decided appeals filed by convicted people resulted in a change to their convictions.",
                    {
                      share: pct1(ciaaAcqShare),
                      n: n(ciaaAcqAppeals),
                      decided: n(ciaaAcqDecided),
                      won: n(ciaaAcqWon),
                      pctWon: pct2((ciaaAcqWon / ciaaAcqDecided) * 100),
                      dp: pct1(appeals.defendant.pct),
                    },
                  )}
                </p>
                <p>
                  {t(
                    "research.corruption.route.i7BodyB",
                    "An appeal is not without cost. It takes time and public money for the CIAA to pursue a case, and time for the Supreme Court to hear it. The people involved may also have to wait longer for the case to end. The CIAA must be able to challenge acquittals when it believes a court has made a mistake. But when only {{won}} out of {{decided}} decided appeals have changed the verdict, it is reasonable to ask whether these appeals are being pursued on strong enough grounds, and whether public resources are being used effectively.",
                    { won: n(ciaaAcqWon), decided: n(ciaaAcqDecided) },
                  )}
                </p>
              </>
            ),
            gapNote: (
              <p>
                {t(
                  "research.corruption.route.i7Gap",
                  "There is an important limit to these figures: {{untraced}} of appeals have no outcome we could trace in the available records. The findings therefore cover only appeals with known outcomes.",
                  { untraced: pct1(untracedPct) },
                )}
              </p>
            ),
            href: "/appeals#appeal-asymmetry",
            linkLabel: t(
              "research.corruption.route.i7Link2",
              "See what happens when the CIAA challenges an acquittal",
            ),
          },
        },
        {
          key: "sarbochha",
          n: 8,
          title: t(
            "research.corruption.flow.s8Title2",
            "The Supreme Court decides the appeal",
          ),
          insight: {
            kind: "finding",
            title: t(
              "research.corruption.route.i8Title4",
              "Corruption appeals can take years to resolve",
            ),
            body: (
              <>
                <p>
                  {t(
                    "research.corruption.route.i8BodyA2",
                    "Of the {{n}} corruption appeals registered at the Supreme Court between {{from}} and {{to}} that have since been decided, half took at least {{median}} years to resolve. More than one in three took over six years. The average waiting time was {{mean}} years.",
                    {
                      n: n(supremeDelay.decided),
                      from: supremeDelay.fromYear,
                      to: supremeDelay.toYear,
                      median: supremeDelay.medianYears.toFixed(1),
                      mean: supremeDelay.meanYears.toFixed(1),
                    },
                  )}
                </p>
                {/*
                  The recent cut is keyed on the year an appeal was DECIDED, which is
                  the only window that is not censored: every appeal with a decision
                  date has a known duration. It measures how old the appeals being
                  cleared are, not how long one filed today will take.
                */}
                <p>
                  {t(
                    "research.corruption.route.i8BodyB2",
                    "The wait has also grown longer in recent years. Appeals decided between {{eFrom}} and {{eTo}} had been waiting a median of {{eMed}} years, while those decided between {{rFrom}} and {{rTo}} had been waiting {{rMed}} years. This means the appeals being decided more recently had already spent much longer waiting for a decision. It does not mean every new appeal will take that long.",
                    {
                      eFrom: supremeDelay.earlier.from,
                      eTo: supremeDelay.earlier.to,
                      eMed: supremeDelay.earlier.medianYears.toFixed(1),
                      rFrom: supremeDelay.recent.from,
                      rTo: supremeDelay.recent.to,
                      rMed: supremeDelay.recent.medianYears.toFixed(1),
                    },
                  )}
                </p>
              </>
            ),
            gapNote: (
              <p>
                {t(
                  "research.corruption.route.i8Gap2",
                  "These figures cover only appeals that have been decided. Of the {{all}} appeals registered, {{open}} have no recorded decision. More recent registration years are also excluded from the waiting-time comparison because too few appeals from those years have been decided to give a reliable picture. The actual waiting time for all appeals, including those still pending, may therefore be different.",
                  {
                    open: n(supremeDelay.withoutVerdict),
                    all: n(supremeDelay.registeredAll),
                  },
                )}
              </p>
            ),
            href: "/appeals#appeal-duration",
            linkLabel: t(
              "research.corruption.route.i8Link2",
              "See how long Supreme Court appeals take to resolve",
            ),
          },
        },
      ],
    },
  ];

  /** One label set, shared by the oval and the vertical view. */
  const routeLabels: RouteLabels = {
    no: t("research.corruption.flow.no", "no"),
    open: t(
      "research.corruption.route.open",
      "Show the research on this stage",
    ),
    close: t(
      "research.corruption.route.close",
      "Hide the research on this stage",
    ),
    ovalCentre: t(
      "research.corruption.route.ovalCentre2",
      "A complaint's journey",
    ),
    ovalHint: t(
      "research.corruption.route.ovalHint2",
      "Select a stage to see what the records show and what they don't.",
    ),
    finding: t("research.corruption.route.finding", "What the record shows"),
    gap: t("research.corruption.route.gap", "What the record cannot answer"),
    srIntro: t(
      "research.corruption.route.srIntro",
      "The route a corruption complaint takes, in order. Stages one to five sit with the Commission; stages six to eight are courts. Not every complaint reaches every stage: it can be set aside as Tameli at screening, after the preliminary inquiry, or when the Commission rules on the investigation report, and a verdict nobody appeals stands. Stages with research behind them carry a button that opens it.",
    ),
  };

  return (
    <div className="theme-editorial -mx-4 bg-background px-4 py-8 text-foreground md:-mx-6 md:px-6 md:py-10">
      <Reveal>
        <AboutResearch
          label={t("research.corruption.about.label2", "About Jawafdehi")}
          facts={[
            {
              key: "years",
              value: t("research.corruption.about.fYears", "{{n}} years", {
                n: n(corpus.fiscalYears.length),
              }),
              label: t(
                "research.corruption.about.fYearsLabel",
                "of CIAA and court records, {{from}} to {{to}}",
                {
                  from: fyLabel(corpus.fiscalYears[0]),
                  to: fyLabel(
                    corpus.fiscalYears[corpus.fiscalYears.length - 1],
                  ),
                },
              ),
            },
            {
              key: "cases",
              value: n(corpus.ciaaProsecutions),
              label: t(
                "research.corruption.about.fCases",
                "prosecutions followed from filing to final appeal",
              ),
            },
            {
              key: "appeals",
              value: n(supremeDelay.registeredAll),
              label: t(
                "research.corruption.about.fAppeals",
                "Supreme Court corruption appeals measured",
              ),
            },
            {
              key: "open",
              value: t("research.corruption.about.fOpen", "Open"),
              label: t(
                "research.corruption.about.fOpenLabel",
                "every figure traced to a public source you can check",
              ),
            },
          ]}
        >
          <p>
            {t("research.corruption.about.b1a", "Jawafdehi is an ")}
            <a href={JAWAFDEHI.home} target="_blank" rel="noreferrer">
              {t("research.corruption.about.b1Portal", "open data portal")}
            </a>
            {t(
              "research.corruption.about.b1b",
              " that makes Nepal's corruption cases easier for everyone to find and understand. It brings scattered information into one place, with ",
            )}
            <a href={JAWAFDEHI.cases} target="_blank" rel="noreferrer">
              {t("research.corruption.about.b1Cases", "simple case summaries")}
            </a>
            {t(
              "research.corruption.about.b1c",
              " that help people understand what happened without having to go through hundreds of pages of court documents. Built around the spirit of Nepal's 2082 Gen Z movement, Jawafdehi aims to make accountability more accessible to the public.",
            )}
          </p>
          <p>
            {t(
              "research.corruption.about.b2a",
              "Beyond documenting individual cases, Jawafdehi also looks at the bigger picture. Through this research, we seek to discover and rediscover gaps in Nepal's accountability system by studying 14 years of records from the ",
            )}
            <a href={CITATIONS.ciaaReports} target="_blank" rel="noreferrer">
              {t("research.corruption.about.b2Ciaa", "CIAA's annual reports")}
            </a>
            {t("research.corruption.about.b2b", ", the ")}
            <a href={CITATIONS.courtRecords} target="_blank" rel="noreferrer">
              {t(
                "research.corruption.about.b2Court",
                "Supreme Court and Special Court registers",
              )}
            </a>
            {t(
              "research.corruption.about.b2c",
              " and other sources. We look at how corruption complaints move through the system, how long cases take to resolve, and what the available records reveal about the strengths and gaps in the accountability process. Where information is missing, we highlight those gaps rather than make assumptions — and every figure on this page can be ",
            )}
            <a href={CITATIONS.researchPack} target="_blank" rel="noreferrer">
              {t(
                "research.corruption.about.b2Pack",
                "recomputed from the published data and code",
              )}
            </a>
            {t("research.corruption.about.b2d", ".")}
          </p>
          <p>
            {t(
              "research.corruption.about.a3",
              "This work brings together people from different fields, including legal experts, law students, technology professionals, software engineers, retired bureaucrats and journalists. Our aim is to make public records easier to access, understand and examine, so that anyone can explore the evidence and draw their own conclusions.",
            )}
          </p>
        </AboutResearch>
      </Reveal>

      <Reveal>
        <header className="mx-auto mt-10 max-w-3xl text-center md:mt-14">
          <h2 className="font-display text-[1.9rem] font-bold leading-[1.1] tracking-tight md:text-[2.75rem]">
            {t(
              "research.corruption.hl.title2",
              "How a corruption complaint moves, and where it stops",
            )}
          </h2>
          <p className="mt-4 text-left text-sm leading-7 text-muted-foreground md:text-center">
            {t(
              "research.corruption.hl.intro2",
              "This research follows corruption cases through Nepal's accountability system, from the CIAA's investigations to Special Court verdicts and appeals at the Supreme Court. By bringing together records from each stage, it examines how cases are handled, how they end, how long they take, and where important gaps remain in the public record.",
            )}
          </p>
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
            {/* An ellipse cannot be read on a phone, so the vertical version is not
                a fallback: it is the better layout at that width. */}
            <div className="hidden md:block">
              <RouteOval phases={routePhases} labels={routeLabels} />
            </div>
            <div className="mx-auto max-w-2xl md:hidden">
              <RouteMap phases={routePhases} labels={routeLabels} />
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

        {/*
          07 — the wait at the last stage. The route figure deliberately keeps this
          number behind a click, because a large figure in the middle of a process
          diagram reads as the length of the whole process. Here it is the point of
          the card, so it leads.
        */}
        <Highlight
          index={7}
          stat={t("research.corruption.hl.f6Stat", "{{v}} years", {
            v: supremeDelay.medianYears.toFixed(1),
          })}
          statCaption={t(
            "research.corruption.hl.f6Caption2",
            "Half of decided appeals took at least this long, from the day the appeal is registered at the Supreme Court to the day it is decided — not the length of the whole case.",
          )}
          headline={t(
            "research.corruption.hl.f6",
            "Winning at the Special Court is not the end. The appeal takes years.",
          )}
          explain={t(
            "research.corruption.hl.f6Body2",
            "Of {{n}} corruption appeals registered between {{from}} and {{to}} that have since been decided, half took at least {{median}} years and {{over}} took more than six; the average is {{mean}} years. And the wait is growing: appeals decided in {{rFrom}}–{{rTo}} had been waiting a median of {{rMed}} years against {{eMed}} for those decided in {{eFrom}}–{{eTo}}. The figures are a floor — {{open}} of the {{all}} appeals registered carry no recorded decision at all.",
            {
              n: n(supremeDelay.decided),
              from: supremeDelay.fromYear,
              to: supremeDelay.toYear,
              median: supremeDelay.medianYears.toFixed(1),
              over: pct1(supremeDelay.overSixPct),
              mean: supremeDelay.meanYears.toFixed(1),
              rFrom: supremeDelay.recent.from,
              rTo: supremeDelay.recent.to,
              rMed: supremeDelay.recent.medianYears.toFixed(1),
              eFrom: supremeDelay.earlier.from,
              eTo: supremeDelay.earlier.to,
              eMed: supremeDelay.earlier.medianYears.toFixed(1),
              open: n(supremeDelay.withoutVerdict),
              all: n(supremeDelay.registeredAll),
            },
          )}
          chart={
            <DurationSpread
              bands={supremeDelay.bands}
              total={supremeDelay.decided}
              bandLabel={(from, to) =>
                t("research.corruption.hl.f6Band", "{{from}}–{{to}} yr", {
                  from,
                  to,
                })
              }
              openEndLabel={(from) =>
                t("research.corruption.hl.f6BandOpen", "{{from}} yr +", {
                  from,
                })
              }
              caption={t(
                "research.corruption.hl.f6SpreadCaption",
                "How long each of the {{n}} decided appeals took. The wait is not clustered around the median: the two largest groups are the quickest and the six-to-eight-year band.",
                { n: n(supremeDelay.decided) },
              )}
            />
          }
          meta={{
            source: t(
              "research.corruption.hl.f6Src",
              "Supreme Court case records",
            ),
            sourceHref: CITATIONS.courtRecords,
            to: "/appeals#appeal-duration",
            toLabel: t(
              "research.corruption.hl.f6Link",
              "How long an appeal takes",
            ),
          }}
        />
      </div>
    </div>
  );
}
