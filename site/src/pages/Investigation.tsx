import { useTranslation } from "react-i18next";

import {
  Block,
  Body,
  Eyebrow,
  Figure,
  Lede,
  SectionHeading,
  StatRow,
  StatTile,
} from "@/components/layout/Prose";
import { ClosingAnalysis } from "@/components/research/ClosingAnalysis";
import { TameliTrend } from "@/components/research/TameliTrend";
import { REPORT, tameliPct } from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

export default function Investigation() {
  const { t } = useTranslation();
  const { n, pct1 } = useFormat();
  const { disposals } = REPORT;
  const cd = REPORT.complaintDisposal[0];

  const sentShare = (cd.to_investigation / cd.total_complaints) * 100;
  // What the whole page adds up to: Tameli at both filters, against the year's own
  // total. The two are different populations and are never chained into a rate, but
  // they are both outcomes for complaints on the same year's books, so adding them is
  // a count of complaints -- not a conversion.
  // Both of the report's Tameli rows over the year's own total. One population, one
  // denominator -- not the two filters added together, which mixes two.
  const tameliShareOfBooks =
    ((cd.tameli + cd.tameli_with_advice) / cd.total_complaints) * 100;
  // NOTE on the third tile: its 137 is deliberately NOT given as a share of the 37,026.
  // Those cases came out of the 947 investigations FINISHED this year, which is a
  // different population from the 927 sent for investigation this year. Dividing one
  // into the other would read as a survival rate for a single batch of complaints, and
  // the reports do not support that. The base is named instead.

  const last = disposals[disposals.length - 1];
  // The turn is the finding, so it is derived rather than written down: the year the
  // Commission decided to prosecute most, and the year right after it. Taking the peak
  // from the data means the copy cannot drift when another report is added.
  const peak = disposals.reduce((a, b) => (b.filed > a.filed ? b : a));
  const afterPeak = disposals[disposals.indexOf(peak) + 1] ?? last;




  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.investigation.eyebrow", "Complaint to charge")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.investigation.title",
            "Where corruption complaints stop before they reach a court",
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.investigation.lede",
            "In {{fy}} the Commission had {{total}} corruption complaints on its books, and sent {{sent}} of them for a full investigation. This page follows what happened to the rest, and to the ones it did investigate. Complaints are stopped at two separate points — soon after they arrive, and again after a full investigation — and this looks at how many stop at each, and what the published record says about why.",
            { fy: cd.fy, total: n(cd.total_complaints), sent: n(cd.to_investigation) },
          )}
        </Lede>

        <StatRow>
          <StatTile
            value={n(cd.total_complaints)}
            label={t("research.corruption.tile.complaints", "Complaints on the Commission's books")}
            note={t("research.corruption.tile.complaintsNote", "{{carried}} carried over, {{fresh}} newly registered, {{fy}}", {
              carried: n(cd.carried_in),
              fresh: n(cd.registered_new),
              fy: cd.fy,
            })}
          />
          <StatTile
            value={n(cd.to_investigation)}
            label={t("research.corruption.investigation.tileInvestigated", "Sent for a full investigation")}
            note={t("research.corruption.investigation.tileInvestigatedNote", "{{pct}} of those complaints", {
              pct: pct1(sentShare),
            })}
          />
          <StatTile
            value={n(cd.inv_filed)}
            label={t("research.corruption.tile.filed", "Taken to court")}
            note={t("research.corruption.tile.filedNote", "of the {{done}} investigations completed that year", {
              done: n(cd.investigations_completed),
            })}
          />
          <StatTile
            tone="accent"
            value={n(last.tameli)}
            label={t("research.corruption.investigation.tileTameli", "Investigated, then kept in Tameli")}
            note={t("research.corruption.investigation.tileTameliNote", "{{pct}} of the decisions taken after a full investigation, {{fy}}", {
              pct: pct1(tameliPct(last)),
              fy: last.fy,
            })}
          />
        </StatRow>


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
            <h3 className="font-display text-lg font-bold leading-snug text-foreground md:text-xl">
              {t(
                "research.corruption.hl.cdTitle",
                "One complaint in forty is sent for a full investigation",
              )}
            </h3>
            <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-accent md:text-3xl">
              {n(cd.total_complaints)}
            </p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {t(
                "research.corruption.hl.cdTotal",
                "{{carried}} complaints carried over from the previous year, and {{fresh}} new complaints registered during the year.",
                { fy: cd.fy, carried: n(cd.carried_in), fresh: n(cd.registered_new) },
              )}
            </p>

            <ul className="mt-5 space-y-2.5">
              {[
                {
                  k: "tameli",
                  v: cd.tameli + cd.tameli_with_advice,
                  l: t("research.corruption.hl.cdTameli", "kept in Tameli"),
                  hot: true,
                  // The report prints these as two rows. Both are Tameli decisions, so
                  // they are one row here -- with the split named, because a reader
                  // checking against the table will otherwise find neither figure.
                  sub: t(
                    "research.corruption.hl.cdTameliSplit",
                    "{{alone}} outright, {{advice}} with advice to the agency",
                    { alone: n(cd.tameli), advice: n(cd.tameli_with_advice) },
                  ),
                },
                { k: "other", v: cd.other_action, l: t("research.corruption.hl.cdOther", "other action") },
                { k: "inv", v: cd.to_investigation, l: t("research.corruption.hl.cdInv", "sent to detailed investigation") },
                { k: "pending", v: cd.pending_out, l: t("research.corruption.hl.cdPending", "still pending, carried to the next year") },
              ].map((r: { k: string; v: number; l: string; hot?: boolean; sub?: string }) => (
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
                  {r.sub ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.sub}</p>
                  ) : null}
                  <div className="mt-1 h-2 w-full rounded-sm bg-foreground/[0.07]">
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
            <h3 className="font-display text-lg font-bold leading-snug text-foreground md:text-xl">
              {t(
                "research.corruption.hl.cdInvTitle",
                "Of the {{n}} complaints investigated in full, five in six were then kept in Tameli",
                { n: n(cd.investigations_completed) },
              )}
            </h3>
            <dl className="mt-4 grid grid-cols-3 gap-3">
              {[
                { k: "filed", v: cd.inv_filed, l: t("research.corruption.hl.cdFiled", "taken to court") },
                { k: "tameli", v: cd.inv_tameli, l: t("research.corruption.hl.cdInvTameli", "kept in Tameli"), hot: true },
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

        </div>

      </Block>

      <Block>
        <Eyebrow>{t("research.corruption.investigation.tameliEyebrow", "After the investigation")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.investigation.tameliTitle",
            "Prosecutions fell sharply as Tameli decisions increased",
          )}
        </SectionHeading>
        <Body>
          {t(
            "research.corruption.investigation.tameliBody",
            "After a full investigation, the Commission decides whether to file a case in court, recommend action to the relevant agency, write to the agency, or place the complaint under Tameli. A Tameli decision keeps a complaint on record but suspends further action unless new evidence or information emerges.",
          )}
        </Body>
        <Body>
          {t(
            "research.corruption.investigation.tameliCounts",
            "In {{peakFy}}, the Commission decided to prosecute {{peakFiled}} complaints and place {{peakTameli}} under Tameli. By {{lastFy}}, prosecutions had fallen to {{lastFiled}}, while Tameli decisions had risen to {{lastTameli}}.",
            {
              peakFy: peak.fy,
              peakFiled: n(peak.filed),
              peakTameli: n(peak.tameli),
              lastFy: last.fy,
              lastFiled: n(last.filed),
              lastTameli: n(last.tameli),
            },
          )}
        </Body>
        <Body>
          {t(
            "research.corruption.investigation.tameliStep",
            "The shift happened quickly. Between {{peakFy}} and {{afterFy}}, the share of decisions resulting in Tameli rose from {{peakPct}} to {{afterPct}}. It remained high in the years that followed.",
            {
              peakFy: peak.fy,
              afterFy: afterPeak.fy,
              peakPct: pct1(tameliPct(peak)),
              afterPct: pct1(tameliPct(afterPeak)),
            },
          )}
        </Body>
        <Body>
          {t(
            "research.corruption.investigation.tameliLeadership",
            "Two developments in the public record fall within this period. The chief commissioner's post was vacant for about five months from Bhadra {{vacancyBs}}, before a new chief commissioner was appointed — the first substantive appointment since 2073. The available reports do not explain why the Commission's decisions changed, and the timing alone does not establish that the leadership change caused the shift.",
            { vacancyBs: "2077" },
          )}
        </Body>

        <Figure
          title={t(
            "research.corruption.investigation.chartTitle",
            "What the Commission decided to do with each investigated complaint, by year",
          )}
        >
          <TameliTrend
            rows={disposals}
            tameliLabel={t("research.corruption.investigation.seriesTameli", "Kept in Tameli")}
            filedLabel={t("research.corruption.investigation.seriesFiled", "Taken to court")}
            shareLabel={t("research.corruption.investigation.seriesShare", "Share set aside")}
            linkTitle={t(
              "research.corruption.investigation.chartLinkTitle",
              "Open the {{fy}} annual report",
            )}
          />
        </Figure>

        <ClosingAnalysis
          headline={t(
            "research.corruption.investigation.closeHeadline",
            "Nearly half of every complaint ends in Tameli, and not one of those decisions carries a reason",
          )}
          stat={pct1(tameliShareOfBooks)}
          statCaption={t(
            "research.corruption.investigation.closeStat",
            "of the {{total}} complaints on the Commission's books in {{fy}} were kept in Tameli — {{alone}} outright and {{advice}} with advice to the agency. After a full investigation the share is higher still, {{after}}.",
            {
              total: n(cd.total_complaints),
              fy: cd.fy,
              alone: n(cd.tameli),
              advice: n(cd.tameli_with_advice),
              after: pct1((cd.inv_tameli / cd.investigations_completed) * 100),
            },
          )}
          questionLabel={t("research.corruption.investigation.closeQLabel", "The open question")}
          question={t(
            "research.corruption.investigation.closeQ",
            "What justified setting aside so many?",
          )}
        >
          <p>
            {t(
              "research.corruption.investigation.closeA1",
              "Tameli is not a failure in itself. The Commission has to be able to close complaints that fall outside its jurisdiction, that carry no usable evidence, or that have no basis to go further. The figures cannot tell us how many of these were that — because the published record stops exactly where the justification would begin.",
            )}
          </p>
          <p>
            {t(
              "research.corruption.investigation.closeA2",
              "The reports count these decisions to the last complaint and explain not one of them. Nor do they say how many were ever revived, and Tameli is reversible when new evidence appears — so a count of revivals would show whether these files are being parked or simply cleared. No report has published one.",
            )}
          </p>
        </ClosingAnalysis>
      </Block>
    </>
  );
}
