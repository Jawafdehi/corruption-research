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
  const cd = REPORT.complaintDisposal[0];

  const investigatedShare = (ciaa.investigatedYear / ciaa.complaintsYear) * 100;
  const filedPerInvestigated = Math.round(ciaa.investigatedYear / ciaa.casesFiledYear);

  const last = disposals[disposals.length - 1];
  // The turn is the finding, so it is derived rather than written down: the year the
  // Commission decided to prosecute most, and the year right after it. Taking the peak
  // from the data means the copy cannot drift when another report is added.
  const peak = disposals.reduce((a, b) => (b.filed > a.filed ? b : a));
  const afterPeak = disposals[disposals.indexOf(peak) + 1] ?? last;

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
            "There are two filters, and the second one is invisible",
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.investigation.lede",
            "That almost nothing survives the front desk is well known. The annual reports also carry a second number, scattered across tables and never drawn as a series: what happens to the complaints that do get investigated. Most of them are now closed too.",
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

        {/* The year's whole workload, divided on the report's own denominators.
            Moved here from Highlights: it is the Investigation story in full, and
            a highlight should point at it rather than contain it. */}
        <div className="mt-6 space-y-4">
          {/*
            Both of the Commission's filters, in one place and on the report's
            own denominators. The first row divides the year's whole workload
            (तालिका २.१४); the second is the outcome of investigations finished
            that year (बुँदा १३). They are separate events and are kept apart.
          */}
          <div className="rounded-lg border border-border bg-[hsl(var(--surface))] p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t(
                "research.corruption.hl.cdTitle",
                "Every complaint on the Commission's books, FY2081/82",
              )}
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums md:text-3xl">
              {n(cd.total_complaints)}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("research.corruption.hl.cdTotal", "{{carried}} carried over + {{fresh}} newly registered", {
                carried: n(cd.carried_in),
                fresh: n(cd.registered_new),
              })}
            </p>

            <ul className="mt-4 space-y-2">
              {[
                { k: "tameli", v: cd.tameli + cd.tameli_with_advice, l: t("research.corruption.hl.cdTameli", "set aside as Tameli"), hot: true },
                { k: "other", v: cd.other_action, l: t("research.corruption.hl.cdOther", "other action") },
                { k: "inv", v: cd.to_investigation, l: t("research.corruption.hl.cdInv", "sent to detailed investigation") },
                { k: "pending", v: cd.pending_out, l: t("research.corruption.hl.cdPending", "still pending, carried to the next year") },
              ].map((r) => (
                <li key={r.k}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className={r.hot ? "font-medium text-accent" : "text-foreground/80"}>
                      {r.l}
                    </span>
                    <span className="shrink-0 font-mono tabular-nums">
                      {n(r.v)}
                      <span className={r.hot ? "ml-2 font-semibold text-accent" : "ml-2 text-muted-foreground"}>
                        {pct1((r.v / cd.total_complaints) * 100)}
                      </span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-sm bg-foreground/[0.07]">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${(r.v / cd.total_complaints) * 100}%`,
                        backgroundColor: r.hot ? "hsl(var(--accent))" : "hsl(var(--foreground) / 0.35)",
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-[hsl(var(--surface))] p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t(
                "research.corruption.hl.cdInvTitle",
                "And of the {{n}} detailed investigations finished that year",
                { n: n(cd.investigations_completed) },
              )}
            </p>
            <dl className="mt-3 grid grid-cols-3 gap-3">
              {[
                { k: "filed", v: cd.inv_filed, l: t("research.corruption.hl.cdFiled", "taken to court") },
                { k: "tameli", v: cd.inv_tameli, l: t("research.corruption.hl.cdInvTameli", "set aside as Tameli"), hot: true },
                { k: "held", v: cd.inv_held, l: t("research.corruption.hl.cdHeld", "held in abeyance") },
              ].map((r) => (
                <div key={r.k}>
                  <dt
                    className="font-mono text-xl font-semibold tabular-nums md:text-2xl"
                    style={r.hot ? { color: "hsl(var(--accent))" } : undefined}
                  >
                    {n(r.v)}
                    <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                      {pct1((r.v / cd.investigations_completed) * 100)}
                    </span>
                  </dt>
                  <dd className="mt-1 text-xs leading-4 text-muted-foreground">{r.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="text-xs leading-5 text-muted-foreground">
            {t(
              "research.corruption.hl.cdNote",
              "Both blocks are one fiscal year from one report, each divided by its own total. They are not a single cohort followed through: the investigations finished this year mostly began in earlier ones, so the two must not be chained into a conversion rate.",
            )}
          </p>
        </div>

      </Block>

      <Block>
        <Eyebrow>{t("research.corruption.investigation.tameliEyebrow", "The second filter")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.investigation.tameliTitle",
            "The Commission went from prosecuting most of what it investigated to shelving most of it",
          )}
        </SectionHeading>
        <Body>
          {t(
            "research.corruption.investigation.tameliBody",
            "A complaint that survives screening and gets investigated goes to the Commission's own meeting, which can prosecute it, advise the agency, write to it, or shelve it as तामेली — set it aside without charges. In {{peakFy}} the meeting prosecuted {{peakFiled}} complaints and shelved {{peakTameli}}. In {{lastFy}} it prosecuted {{lastFiled}} and shelved {{lastTameli}}. Shelving went from {{peakPct}} of its decisions to {{lastPct}}.",
            {
              peakFy: peak.fy,
              peakFiled: n(peak.filed),
              peakTameli: n(peak.tameli),
              lastFy: last.fy,
              lastFiled: n(last.filed),
              lastTameli: n(last.tameli),
              peakPct: pct1(tameliPct(peak)),
              lastPct: pct1(tameliPct(last)),
            },
          )}
        </Body>
        <Body>
          {t(
            "research.corruption.investigation.tameliStep",
            "The change is not a drift. It happens between {{peakFy}} and {{afterFy}}, two consecutive years, with shelving jumping from {{peakPct}} to {{afterPct}}. It has not come back down since. Two things in the public record fall inside that window: the post of chief commissioner sat vacant for about five months from Bhadra {{vacancyBs}}, and it was then filled substantively for the first time since 2073. The reports give no reason for the change, and the coincidence of dates is not evidence that one caused the other.",
            {
              peakFy: peak.fy,
              afterFy: afterPeak.fy,
              peakPct: pct1(tameliPct(peak)),
              afterPct: pct1(tameliPct(afterPeak)),
              vacancyBs: "2077",
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
                "Each year's share divides two numbers printed in the same table of the same annual report, so no figure is combined across sources. Five of the nine years are checked against the table's own printed total and five against the filing counts the reports state in prose. Fiscal years 2069/70 to 2072/73 are missing because those reports present the same decisions as a subject-area cross-tab with different row labels; splicing them on would compare two different things. 'Prosecute' counts decisions to file, which is not the same unit as a case appearing in the court register, so the two are never subtracted from one another.",
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
            "Shelving a weak case after investigating it is the right call, and a Commission that prosecuted everything it touched would be a worse one. The number alone cannot tell you which of those is happening here: a Commission that got better at screening weak complaints early and one that lost its appetite for court both produce this chart. What the figures do establish is the size of the change, how fast it arrived, and that the reports attach no reason to a single one of these closures.",
          )}
        </Caveat>

        <Unknown
          title={t("research.corruption.investigation.unknownTitle", "What would settle this")}
        >
          {t(
            "research.corruption.investigation.unknownBody",
            "A reason attached to each closure, or a count of closures later reopened. The annual reports carry neither. Until one of them appears, the share above is as far as the public record goes.",
          )}
        </Unknown>
      </Block>
    </>
  );
}
