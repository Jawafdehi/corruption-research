import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  Block,
  Caveat,
  Finding,
  Lede,
  ScopeBar,
  SectionHeading,
  Unknown,
} from "@/components/layout/Prose";
import {
  CITATIONS,
  REPORT,
  decidedClean,
  outcomePct,
  tameliPct,
} from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

/** Shared link style for the "see the evidence" line under each finding. */
const Evidence = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="font-medium text-accent underline underline-offset-4 hover:opacity-80">
    {children}
  </Link>
);

export default function Highlights() {
  const { t } = useTranslation();
  const { n, pct, pct1, fy } = useFormat();
  const { appeals, byCharge, ciaa, corpus, disposals, outcome, rates } = REPORT;

  const decided = decidedClean(outcome);

  // Finding 1 — the Commission's second filter. First and last row of the series
  // we could verify; both shares divide two numbers printed in one table.
  const firstDisposal = disposals[0];
  const lastDisposal = disposals[disposals.length - 1];

  // Finding 2 — the charge decides the verdict. Both rows are substantial enough
  // to quote; the sub-30 rows are excluded from the chart for the same reason.
  const charge = (en: string) => byCharge.find((c) => c.en === en);
  const fake = charge("Fake credential");
  const benefit = charge("Illegal benefit");
  const fakeFullPct = fake ? outcomePct(fake, "convicted") : 0;
  const benefitFullPct = benefit ? outcomePct(benefit, "convicted") : 0;
  const allFull = byCharge.reduce((sum, c) => sum + c.convicted, 0);
  const fakeShareOfFull = allFull && fake ? (fake.convicted / allFull) * 100 : 0;

  // Finding 4 — the tracing gap. Share of established appeals with no outcome in
  // the record, which is a limit of the record, not a finding about the courts.
  const untracedPct = appeals.appeals ? (appeals.no_outcome / appeals.appeals) * 100 : 0;

  const firstFy = corpus.fiscalYears[0];
  const lastFy = corpus.fiscalYears[corpus.fiscalYears.length - 1];

  return (
    <>
      <Block>
        <SectionHeading>
          {t(
            "research.corruption.highlights.title",
            "Most corruption complaints die quietly. The convictions are mostly forged certificates.",
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.highlights.lede",
            "Two institutions keep records about the same cases and neither reads the other's. We put them side by side. Five things fell out that are hard to see when you read either one alone.",
          )}
        </Lede>

        <ScopeBar
          items={[
            {
              label: t("research.corruption.scope.period", "Period"),
              value: `${fy(firstFy)}–${fy(lastFy)}`,
            },
            {
              label: t("research.corruption.scope.court", "Court"),
              value: t("research.corruption.scope.courtValue", "Special Court"),
            },
            {
              label: t("research.corruption.scope.cases", "Prosecutions"),
              value: n(corpus.ciaaProsecutions),
            },
            {
              label: t("research.corruption.scope.decided", "With a verdict"),
              value: n(decided),
            },
            {
              label: t("research.corruption.scope.unit", "Unit"),
              value: t("research.corruption.scope.unitValue", "cases, not people"),
            },
          ]}
        />
      </Block>

      <Block className="mt-10 md:mt-12">
        {/*
          Ordered by how much each finding changes what a reader should do, not by
          how large the number is. The two filters come first because everything
          downstream is conditioned on them.
        */}
        <Finding
          stat={pct(tameliPct(lastDisposal))}
          statNote={t(
            "research.corruption.highlights.f1Note",
            "of finished investigations end in a filing cabinet ({{fy}}). In {{wasFy}} it was {{was}}.",
            {
              fy: lastDisposal.fy,
              was: pct(tameliPct(firstDisposal)),
              wasFy: firstDisposal.fy,
            },
          )}
          headline={t(
            "research.corruption.highlights.f1",
            "The Commission shelves most of what it investigates",
          )}
          meaning={t(
            "research.corruption.highlights.f1Body",
            "Everyone knows the front desk turns away almost everything. This is the filter after that one. These complaints survived screening, got a full investigation, and were then closed as तामेली. That share roughly tripled in five years while the number of prosecutions stayed flat. The Commission publishes the totals and not one reason, so nobody outside it can tell whether the cases were weak or the decisions were.",
          )}
          action={
            <Evidence to="/investigation">
              {t("research.corruption.highlights.f1Link", "See the year-by-year series →")}
            </Evidence>
          }
        />

        <Finding
          stat={pct(fakeFullPct)}
          statNote={t(
            "research.corruption.highlights.f2Note",
            "of forged-certificate cases convict in full. For rigging a decision in someone's favour: {{b}}.",
            { b: pct(benefitFullPct) },
          )}
          headline={t(
            "research.corruption.highlights.f2",
            "Paper crimes convict. Money crimes mostly don't.",
          )}
          meaning={t(
            "research.corruption.highlights.f2Body",
            "Fake academic certificates are the easiest corruption case in Nepal to prove, and they alone supply {{share}} of every full conviction in this archive. The offences the Commission was built for do far worse. So when the national conviction rate moves, the first thing to check is what was being charged that year, not what the judges were thinking.",
            { share: pct(fakeShareOfFull) },
          )}
          action={
            <Evidence to="/prosecution">
              {t("research.corruption.highlights.f2Link", "See charges and outcomes →")}
            </Evidence>
          }
        />

        <Finding
          stat={`${n(appeals.defendant.reversed)} vs ${n(appeals.commission.reversed)}`}
          statNote={t(
            "research.corruption.highlights.f3Note",
            "full reversals won by convicted defendants, against {{c}} won by the Commission",
            { c: n(appeals.commission.reversed) },
          )}
          headline={t(
            "research.corruption.highlights.f3",
            "The Commission has won {{c}} appeals",
            { c: n(appeals.commission.reversed) },
          )}
          meaning={t(
            "research.corruption.highlights.f3Body",
            "{{c}}, out of {{cd}} decided appeals it brought, most of them against acquittals. Convicted defendants, over {{dd}} decided appeals, won {{d}}. Put plainly: when the Commission loses at trial that is usually the end of it, and when it wins, the win is a lot shakier than the verdict makes it look.",
            {
              c: n(appeals.commission.reversed),
              d: n(appeals.defendant.reversed),
              dd: n(appeals.defendant.decided),
              cd: n(appeals.commission.decided),
            },
          )}
          action={
            <Evidence to="/appeals">
              {t("research.corruption.highlights.f3Link", "See the appeal record →")}
            </Evidence>
          }
        />

        <Finding
          stat={pct(untracedPct)}
          statNote={t(
            "research.corruption.highlights.f4Note",
            "of the appeals we found simply stop: {{no}} of {{total}} have no outcome recorded anywhere",
            { no: n(appeals.no_outcome), total: n(appeals.appeals) },
          )}
          headline={t(
            "research.corruption.highlights.f4",
            "Half the appeals go dark",
          )}
          meaning={t(
            "research.corruption.highlights.f4Body",
            "Nepal's courts file a trial and its appeal as two unrelated cases with nothing joining them, so we rebuilt the links by hand. Nearly half end in silence. That is a failure of record-keeping and says nothing about the Supreme Court. A case with no appeal on record is one we cannot follow, not one that was never appealed.",
          )}
          action={
            <Evidence to="/gaps">
              {t("research.corruption.highlights.f4Link", "See what cannot be traced →")}
            </Evidence>
          }
        />

        <Finding
          stat={t("research.corruption.highlights.f5Stat", "Not published")}
          statNote={t(
            "research.corruption.highlights.f5Note",
            "is how much of the Rs {{bn}}bn claimed in {{fy}} any institution says it got back",
            { bn: ciaa.damagesClaimedYearBn, fy: "2081/82" },
          )}
          headline={t(
            "research.corruption.highlights.f5",
            "Nobody publishes what gets recovered",
          )}
          meaning={t(
            "research.corruption.highlights.f5Body",
            "The Commission reports what it demands every year. No institution reports what came back, and the court record does not carry it either. बिगो is a figure written in a judgment; whether anyone collected it is a separate question that nothing public answers.",
          )}
          action={
            <Evidence to="/gaps">
              {t("research.corruption.highlights.f5Link", "See the recovery gap →")}
            </Evidence>
          }
        />
      </Block>

      <Block>
        <Caveat>
          {t(
            "research.corruption.highlights.readThis",
            "Read every rate on this site as a rate of cases, not of people. The court publishes one verdict per case and no outcome for each accused, so a case where one junior official was convicted and everyone senior was cleared is counted exactly like any other conviction. {{conv}} of {{dec}} decided cases ended in conviction in whole or in part; the stricter full-only figure is {{full}}. Both are reported everywhere on this site, because the record cannot choose between them.",
            {
              conv: pct1(rates.convictionPct),
              dec: n(decided),
              full: pct1(rates.convictionFullOnlyPct),
            },
          )}
        </Caveat>

        <Unknown
          title={t(
            "research.corruption.highlights.unknownTitle",
            "What this research cannot tell you",
          )}
        >
          {t(
            "research.corruption.highlights.unknownBody",
            "Why any individual complaint was closed; how many people — as opposed to cases — were convicted; whether a single rupee of any judgment was collected. None of these are published case by case by any institution, so they are absent here rather than estimated.",
          )}
        </Unknown>

        <p className="mt-8 text-sm leading-6 text-muted-foreground">
          {t(
            "research.corruption.highlights.method",
            "Every figure is generated from the published data pack at build time, so this page and the dataset cannot disagree.",
          )}{" "}
          <Link
            to="/method"
            className="underline decoration-dotted underline-offset-2 hover:text-foreground"
          >
            {t("research.corruption.highlights.methodLink", "How these numbers were produced")}
          </Link>
          {" · "}
          <a
            href={CITATIONS.researchPack}
            className="underline decoration-dotted underline-offset-2 hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            {t("research.corruption.highlights.repoLink", "The dataset and the code")}
          </a>
        </p>
      </Block>
    </>
  );
}
