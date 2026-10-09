import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { AccountabilityFunnel, type FunnelStage } from "@/components/data-quality/AccountabilityFunnel";
import {
  AccountabilityStages,
  type AccountabilityStage,
} from "@/components/research/AccountabilityStages";
import { Block, Body, Caveat, Cite, Eyebrow, Figure, Lede, SectionHeading, StatRow, StatTile } from "@/components/layout/Prose";
import { CITATIONS, FUNNEL_SOURCE, REPORT, decidedClean } from "@/data/research-corruption";

const n = (v: number) => v.toLocaleString();
const pct = (v: number) => `${Math.round(v)}%`;

export default function Overview() {
  const { t } = useTranslation();
  const { ciaa, corpus, funnel, outcome, rates } = REPORT;

  const decided = decidedClean(outcome);
  // Shares of the PREVIOUS stage — the single "% of complaints" denominator cannot
  // show where the drop happens, and the drop is the finding.
  const investigatedShare = (ciaa.investigatedYear / ciaa.complaintsYear) * 100;
  const filedPerInvestigated = Math.round(ciaa.investigatedYear / ciaa.casesFiledYear);
  const convictedStage = funnel.find((s) => s.key === "convicted")?.count ?? 0;

  const stageNote: Record<string, string> = {
    investigated: t(
      "research.corruption.funnel.stage.investigatedNote",
      "only {{pct}}% go to a full investigation",
      { pct: investigatedShare.toFixed(1) },
    ),
    filed: t("research.corruption.funnel.stage.filedNote", "≈1 in {{k}} investigated are prosecuted", {
      k: filedPerInvestigated,
    }),
    convicted: t("research.corruption.funnel.stage.convictedNote", "≈{{pct}}% of prosecutions convict", {
      pct: Math.round(rates.convictionPct),
    }),
  };

  const stageLabel: Record<string, string> = {
    complaints: t("research.corruption.funnel.stage.complaints", "Complaints to the Commission"),
    investigated: t("research.corruption.funnel.stage.investigated", "Complaints fully investigated"),
    filed: t("research.corruption.funnel.stage.filed", "Prosecutions filed"),
    convicted: t("research.corruption.funnel.stage.convicted", "Convictions (est.)"),
  };

  const funnelStages: FunnelStage[] = funnel.map((s) => ({
    key: s.key,
    label: stageLabel[s.key] ?? s.key,
    count: s.count,
    color: "hsl(var(--accent))",
    note: stageNote[s.key],
  }));

  // Where the loss actually happens, stage by stage. Each one names the institution
  // that owns it — an accountability gap with no owner is just a statistic.
  const stages: AccountabilityStage[] = [
    {
      key: "intake",
      owner: t("research.corruption.stage.intake.owner", "Commission for the Investigation of Abuse of Authority"),
      title: t("research.corruption.stage.intake.title", "Screening decides almost everything"),
      body: t(
        "research.corruption.stage.intake.body",
        "Of {{complaints}} complaints registered in a single year, {{investigated}} reached a full investigation — {{pct}}%. Nothing later in the chain can recover a complaint closed here, and the reasons for closure are not published case by case.",
        {
          complaints: n(ciaa.complaintsYear),
          investigated: n(ciaa.investigatedYear),
          pct: investigatedShare.toFixed(1),
        },
      ),
    },
    {
      key: "charging",
      owner: t("research.corruption.stage.charging.owner", "Commission for the Investigation of Abuse of Authority"),
      title: t("research.corruption.stage.charging.title", "What gets charged is not a cross-section"),
      body: t(
        "research.corruption.stage.charging.body",
        "Roughly one in {{k}} fully investigated complaints becomes a prosecution. The charges that do get filed lean heavily towards documentary offences that are straightforward to prove, which lifts the conviction rate without telling you much about large-scale graft.",
        { k: filedPerInvestigated },
      ),
    },
    {
      key: "trial",
      owner: t("research.corruption.stage.trial.owner", "Special Court"),
      title: t("research.corruption.stage.trial.title", "The court decides, one verdict per case"),
      body: t(
        "research.corruption.stage.trial.body",
        "Across {{decided}} cases carrying a clear disposition, {{rate}}% ended in conviction in whole or in part. The court publishes a single verdict per case and no outcome for each accused, so every rate here counts cases, not people.",
        { decided: n(decided), rate: rates.convictionPct },
      ),
    },
    {
      key: "appeal",
      owner: t("research.corruption.stage.appeal.owner", "Supreme Court"),
      title: t("research.corruption.stage.appeal.title", "Convictions are the part that does not hold"),
      body: t(
        "research.corruption.stage.appeal.body",
        "Where an appeal has been decided, convicted people overturn their verdicts far more often than the Commission overturns an acquittal. Acquittals at the Special Court are close to final; its convictions are not.",
      ),
    },
    {
      key: "recovery",
      owner: t("research.corruption.stage.recovery.owner", "Not published by any body"),
      title: t("research.corruption.stage.recovery.title", "Nobody reports what is recovered"),
      body: t(
        "research.corruption.stage.recovery.body",
        "The Commission publishes the damages it claims each year. No institution publishes what was actually recovered afterwards, and the court record does not carry it either — so the final stage of accountability cannot be measured at all.",
      ),
      noData: true,
    },
  ];

  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.overview.eyebrow", "The shape of the problem")}</Eyebrow>
        <SectionHeading>
          {t("research.corruption.overview.title", "Most corruption complaints end before a judge ever sees them")}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.overview.lede",
            "Nepal's anti-corruption system is usually judged by what the courts do. The court is the smallest part of it. In a single reporting year the Commission registered {{complaints}} complaints and filed {{filed}} prosecutions — so the decisive filtering happens long before a courtroom, at a stage nobody can see case by case.",
            { complaints: n(ciaa.complaintsYear), filed: n(ciaa.casesFiledYear) },
          )}
        </Lede>

        <StatRow>
          <StatTile
            value={n(ciaa.complaintsYear)}
            label={t("research.corruption.tile.complaints", "Complaints in one year")}
            note={t("research.corruption.tile.complaintsNote", "new registrations, excluding carried-over backlog")}
          />
          <StatTile
            value={n(ciaa.casesFiledYear)}
            label={t("research.corruption.tile.filed", "Prosecutions filed")}
            note={t("research.corruption.tile.filedNote", "same year, at the Special Court")}
          />
          <StatTile
            value={n(corpus.ciaaProsecutions)}
            label={t("research.corruption.tile.corpus", "Cases in this archive")}
            note={t("research.corruption.tile.corpusNote", "{{years}} complete fiscal years of the criminal register", {
              years: corpus.fiscalYears.length,
            })}
          />
          <StatTile
            tone="accent"
            value={pct(rates.convictionPct)}
            label={t("research.corruption.tile.conviction", "Convicted, in whole or part")}
            note={t("research.corruption.tile.convictionNote", "{{full}}% on the stricter full-conviction test", {
              full: rates.convictionFullOnlyPct,
            })}
          />
        </StatRow>
      </Block>

      <Block>
        <Figure
          title={t("research.corruption.funnel.title", "From complaint to conviction")}
          subtitle={t(
            "research.corruption.funnel.subtitle",
            "One reporting year at the Commission, with the final stage estimated from this archive's conviction rate.",
          )}
          caption={
            <>
              {t(
                "research.corruption.funnel.caption",
                "Complaint, investigation and prosecution counts are the Commission's own published figures. The conviction bar is not a published number — it applies this archive's measured rate to the prosecutions filed, giving roughly {{convicted}} of {{filed}}. Stages are counts of cases, not people.",
                { convicted: n(convictedStage), filed: n(ciaa.casesFiledYear) },
              )}{" "}
              <Cite href={CITATIONS[FUNNEL_SOURCE.complaints]}>
                {t("research.corruption.funnel.source", "Commission annual report")}
              </Cite>
            </>
          }
        >
          <AccountabilityFunnel
            stages={funnelStages}
            denominator={ciaa.complaintsYear}
            isLoading={false}
            ofLabel={(p) => t("research.corruption.funnel.of", "{{pct}} of complaints", { pct: p })}
          />
        </Figure>

        <Caveat>
          {t(
            "research.corruption.overview.caveat",
            "The narrow bottom of this funnel is not, on its own, evidence that the courts are failing. Most of the loss happens at intake, where a complaint is closed without a full investigation. Read the court's own performance on the Outcomes section, where the denominator is cases that actually reached a verdict.",
          )}
        </Caveat>
      </Block>

      <Block>
        <Eyebrow>{t("research.corruption.gaps.eyebrow", "Where it breaks")}</Eyebrow>
        <SectionHeading>{t("research.corruption.gaps.title", "Five stages, five different owners")}</SectionHeading>
        <Body>
          {t(
            "research.corruption.gaps.body",
            "Each stage below is held by a named institution. The last one is held by nobody, which is why it is the only stage this research cannot put a number against.",
          )}
        </Body>
        <div className="mt-8">
          <AccountabilityStages
            stages={stages}
            noDataLabel={t("research.corruption.gaps.noData", "No published data")}
          />
        </div>
        <Body>
          {t("research.corruption.gaps.next", "The sections that follow measure the two stages that can be measured — ")}
          <Link className="underline hover:text-foreground" to="/outcomes">
            {t("research.corruption.gaps.nextOutcomes", "what the court decides")}
          </Link>
          {t("research.corruption.gaps.nextAnd", " and ")}
          <Link className="underline hover:text-foreground" to="/appeals">
            {t("research.corruption.gaps.nextAppeals", "what survives appeal")}
          </Link>
          {t("research.corruption.gaps.nextEnd", ".")}
        </Body>
      </Block>
    </>
  );
}
