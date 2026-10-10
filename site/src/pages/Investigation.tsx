import { useTranslation } from "react-i18next";

import { AccountabilityFunnel, type FunnelStage } from "@/components/data-quality/AccountabilityFunnel";
import {
  Block,
  Body,
  Caveat,
  Cite,
  Eyebrow,
  Figure,
  Lede,
  SectionHeading,
  StatRow,
  StatTile,
  Unknown,
} from "@/components/layout/Prose";
import { TameliTrend } from "@/components/research/TameliTrend";
import { CITATIONS, FUNNEL_SOURCE, REPORT, tameliPct } from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

export default function Investigation() {
  const { t } = useTranslation();
  const { n, pct, pct1 } = useFormat();
  const { ciaa, disposals, funnel } = REPORT;

  const investigatedShare = (ciaa.investigatedYear / ciaa.complaintsYear) * 100;
  const filedPerInvestigated = Math.round(ciaa.investigatedYear / ciaa.casesFiledYear);

  const first = disposals[0];
  const last = disposals[disposals.length - 1];

  const stageLabel: Record<string, string> = {
    complaints: t("research.corruption.funnel.stage.complaints", "Complaints to the Commission"),
    investigated: t("research.corruption.funnel.stage.investigated", "Complaints fully investigated"),
    filed: t("research.corruption.funnel.stage.filed", "Prosecutions filed"),
    convicted: t("research.corruption.funnel.stage.convicted", "Convictions (est.)"),
  };

  const stageNote: Record<string, string> = {
    investigated: t(
      "research.corruption.funnel.stage.investigatedNote",
      "only {{pct}}% go to a full investigation",
      { pct: investigatedShare.toFixed(1) },
    ),
    filed: t("research.corruption.funnel.stage.filedNote", "≈1 in {{k}} investigated are prosecuted", {
      k: filedPerInvestigated,
    }),
  };

  const funnelStages: FunnelStage[] = funnel.map((s) => ({
    key: s.key,
    label: stageLabel[s.key] ?? s.key,
    count: s.count,
    color: "hsl(var(--accent))",
    note: stageNote[s.key],
  }));

  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.investigation.eyebrow", "Complaint to charge")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.investigation.title",
            "The Commission filters twice, and the second filter is the one nobody sees",
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.investigation.lede",
            "Almost every complaint is closed at the front desk, before anyone investigates it. That much is well known. What the annual reports also show — but never put on one chart — is that a large and growing share of the complaints that do get a full investigation are then closed too.",
          )}
        </Lede>

        <StatRow>
          <StatTile
            value={n(ciaa.complaintsYear)}
            label={t("research.corruption.tile.complaints", "Complaints in one year")}
            note={t("research.corruption.tile.complaintsNote", "new registrations, excluding carried-over backlog")}
          />
          <StatTile
            value={n(ciaa.investigatedYear)}
            label={t("research.corruption.investigation.tileInvestigated", "Full investigations completed")}
            note={t("research.corruption.investigation.tileInvestigatedNote", "{{pct}}% of complaints registered", {
              pct: investigatedShare.toFixed(1),
            })}
          />
          <StatTile
            value={n(ciaa.casesFiledYear)}
            label={t("research.corruption.tile.filed", "Prosecutions filed")}
            note={t("research.corruption.tile.filedNote", "same year, at the Special Court")}
          />
          <StatTile
            tone="accent"
            value={pct(tameliPct(last))}
            label={t("research.corruption.investigation.tileTameli", "Investigated, then closed")}
            note={t("research.corruption.investigation.tileTameliNote", "तामेली as a share of decisions, {{fy}}", {
              fy: last.fy,
            })}
          />
        </StatRow>

        <Figure
          title={t("research.corruption.funnel.title", "From complaint to conviction")}
          subtitle={t(
            "research.corruption.funnel.subtitle",
            "One reporting year at the Commission, with the final stage estimated from this archive's conviction rate.",
          )}
          caption={
            <>
              {t(
                "research.corruption.funnel.caption2",
                "Complaint, investigation and prosecution counts are the Commission's own published figures for FY2081/82. The conviction bar is not a published number — it applies this archive's measured rate to the prosecutions filed. Stages are counts of cases, not people, and the four bars are not one cohort followed through: a complaint registered this year is not the complaint prosecuted this year.",
              )}{" "}
              <Cite href={CITATIONS[FUNNEL_SOURCE.complaints]}>
                {t("research.corruption.funnel.source", "Commission annual report")}
              </Cite>
            </>
          }
        >
          <AccountabilityFunnel
            stages={funnelStages}
            isLoading={false}
            ofLabel={(p) => t("research.corruption.funnel.of", "{{pct}} of complaints", { pct: p })}
          />
        </Figure>

        <Caveat>
          {t(
            "research.corruption.investigation.cohortCaveat",
            "These four numbers describe one reporting year, not one set of complaints. A complaint registered in a year is rarely investigated and never prosecuted in that same year, so the bars cannot be read as survival rates for a single cohort. They show the scale of each stage's throughput — which is the only thing the published data supports.",
          )}
        </Caveat>
      </Block>

      <Block>
        <Eyebrow>{t("research.corruption.investigation.tameliEyebrow", "The second filter")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.investigation.tameliTitle",
            "Closure after investigation went from one in five to seven in ten",
          )}
        </SectionHeading>
        <Body>
          {t(
            "research.corruption.investigation.tameliBody",
            "Once a complaint survives screening and is fully investigated, the Commission's own meeting decides what to do with it: prosecute, advise the agency, write to it, or close it as तामेली. In {{firstFy}} it closed {{firstPct}} of those decisions. By {{lastFy}} it closed {{lastPct}} — while the number of decisions to prosecute barely moved.",
            {
              firstFy: first.fy,
              firstPct: pct1(tameliPct(first)),
              lastFy: last.fy,
              lastPct: pct1(tameliPct(last)),
            },
          )}
        </Body>

        <Figure
          title={t(
            "research.corruption.investigation.chartTitle",
            "After a full investigation, how often the Commission closes the file",
          )}
          subtitle={t(
            "research.corruption.investigation.chartSubtitle",
            "Decisions taken on complaints that completed a detailed investigation, by fiscal year. Bars are counts; the line is तामेली as a share of all decisions that year.",
          )}
          caption={
            <>
              {t(
                "research.corruption.investigation.chartCaption",
                "Each year's share divides two numbers printed in the same table of the same annual report, so no figure is combined across sources. Years where the report prints the decision bubbles without a reconcilable total are left out rather than derived — the gap is in the reporting. 'Prosecute' counts decisions to file, which is not the same unit as a case appearing in the court register, so the two are never subtracted from one another.",
              )}{" "}
              {disposals.map((d, i) => (
                <span key={d.fy}>
                  {i > 0 ? " · " : ""}
                  <Cite href={d.source_url}>
                    {d.fy} {d.figure}
                  </Cite>
                </span>
              ))}
            </>
          }
        >
          <TameliTrend
            rows={disposals}
            tameliLabel={t("research.corruption.investigation.seriesTameli", "Closed (तामेली)")}
            filedLabel={t("research.corruption.investigation.seriesFiled", "Prosecute")}
            shareLabel={t("research.corruption.investigation.seriesShare", "Share closed")}
          />
        </Figure>

        <Caveat>
          {t(
            "research.corruption.investigation.tameliCaveat",
            "A rising closure rate is not by itself evidence of wrongdoing. Closing a weak case after investigating it is the correct outcome, and a Commission that prosecuted everything it investigated would be doing something worse. What the record does establish is the scale and the direction of the change — and that the reports give no case-by-case reason for any of it, so nobody outside the Commission can test whether the cases were weak or the decisions were.",
          )}
        </Caveat>

        <Unknown
          title={t("research.corruption.investigation.unknownTitle", "What would settle this")}
        >
          {t(
            "research.corruption.investigation.unknownBody",
            "A published reason code per closed complaint, or the number of closures later reopened. Neither exists in the annual reports. Until one does, the share above is the strongest statement the public record supports.",
          )}
        </Unknown>
      </Block>
    </>
  );
}
