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
            "Five things the record shows about corruption accountability in Nepal",
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.highlights.lede",
            "Jawafdehi read the Special Court's criminal register and the Commission's annual reports against each other, case by case. Each finding below is counted from those records, and each one links to the working behind it.",
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
            "of completed investigations closed without charge, {{fy}} — up from {{was}} in {{wasFy}}",
            {
              fy: lastDisposal.fy,
              was: pct(tameliPct(firstDisposal)),
              wasFy: firstDisposal.fy,
            },
          )}
          headline={t(
            "research.corruption.highlights.f1",
            "Most complaints now end after the Commission has already investigated them",
          )}
          meaning={t(
            "research.corruption.highlights.f1Body",
            "These are not complaints screened out at the desk — they completed a full investigation and were then filed away as तामेली. The share closed this way roughly tripled in five years while prosecutions stayed flat. The reports publish the totals but not the reasons, so the record cannot say whether the cases were weak or the decisions were.",
          )}
          action={
            <Evidence to="/investigation">
              {t("research.corruption.highlights.f1Link", "See the year-by-year series →")}
            </Evidence>
          }
        />

        <Finding
          stat={`${pct(fakeFullPct)} / ${pct(benefitFullPct)}`}
          statNote={t(
            "research.corruption.highlights.f2Note",
            "full-conviction rate: fake credentials vs. illegal benefit",
          )}
          headline={t(
            "research.corruption.highlights.f2",
            "What a defendant is charged with predicts the verdict better than anything else",
          )}
          meaning={t(
            "research.corruption.highlights.f2Body",
            "Producing a forged certificate is upheld in full about nine times in ten and supplies {{share}} of every full conviction in the archive. The financial offences the Commission exists to punish convict far less often. A conviction rate that moves can therefore mean the charge mix changed, not that the court did.",
            { share: pct(fakeShareOfFull) },
          )}
          action={
            <Evidence to="/prosecution">
              {t("research.corruption.highlights.f2Link", "See charges and outcomes →")}
            </Evidence>
          }
        />

        <Finding
          stat={`${pct1(appeals.defendant.pct)} / ${pct1(appeals.commission.pct)}`}
          statNote={t(
            "research.corruption.highlights.f3Note",
            "of decided appeals fully reversed: defendants vs. the Commission",
          )}
          headline={t(
            "research.corruption.highlights.f3",
            "Appeals run almost entirely one way",
          )}
          meaning={t(
            "research.corruption.highlights.f3Body",
            "Convicted people who appeal overturn their verdict in full in {{d}} of {{dd}} decided appeals. The Commission, appealing acquittals, has done so {{c}} times in {{cd}}. An acquittal at the Special Court is close to final; a conviction is considerably less secure than it looks.",
            {
              d: n(appeals.defendant.reversed),
              dd: n(appeals.defendant.decided),
              c: n(appeals.commission.reversed),
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
            "of established appeals carry no recorded outcome ({{no}} of {{total}})",
            { no: n(appeals.no_outcome), total: n(appeals.appeals) },
          )}
          headline={t(
            "research.corruption.highlights.f4",
            "For nearly half of appeals, the trail stops before the end",
          )}
          meaning={t(
            "research.corruption.highlights.f4Body",
            "This is a gap in what can be traced, not a finding about the Supreme Court. Trial and appeal cases are stored with no link between them, so the pairing had to be reconstructed. Where no outcome is recorded we count it as unknown — never as a loss, and never as proof that no appeal exists.",
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
            "money actually recovered, against Rs {{bn}}bn claimed in {{fy}}",
            { bn: ciaa.damagesClaimedYearBn, fy: "2081/82" },
          )}
          headline={t(
            "research.corruption.highlights.f5",
            "The last stage of accountability is not measured by anyone",
          )}
          meaning={t(
            "research.corruption.highlights.f5Body",
            "The Commission publishes the damages it demands each year. No institution publishes what was recovered afterwards, and the court record does not carry it. A court finding on बिगो is not the same event as money returning to the treasury, and nothing in the public record connects the two.",
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
