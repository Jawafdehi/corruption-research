import { useTranslation } from "react-i18next";

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
} from "@/components/layout/Prose";
import { GapCallout } from "@/components/research/GapCallout";
import { TameliTrend } from "@/components/research/TameliTrend";
import { REPORT, tameliPct } from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

export default function Investigation() {
  const { t } = useTranslation();
  const { n, pct1 } = useFormat();
  const { disposals } = REPORT;
  const cd = REPORT.complaintDisposal[0];

  const sentShare = (cd.to_investigation / cd.total_complaints) * 100;
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
                "Of the {{n}} complaints investigated in full, five in six were then set aside",
                { n: n(cd.investigations_completed) },
              )}
            </h3>
            <dl className="mt-4 grid grid-cols-3 gap-3">
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

        </div>

      </Block>

      <Block>
        <Eyebrow>{t("research.corruption.investigation.tameliEyebrow", "After the investigation")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.investigation.tameliTitle",
            "Prosecutions fell by two-thirds while closures rose six-fold",
          )}
        </SectionHeading>
        <Body>
          {t(
            "research.corruption.investigation.tameliBody",
            "Once a complaint has been investigated in full, the Commission's own meeting decides what to do with it: prosecute, advise the agency, write to it, or set it aside as Tameli. Tameli keeps the complaint on record but takes it no further unless new evidence appears. In {{peakFy}} the meeting prosecuted {{peakFiled}} complaints and set aside {{peakTameli}}. In {{lastFy}} it prosecuted {{lastFiled}} and set aside {{lastTameli}}.",
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
            "This was not a gradual drift. It happened between {{peakFy}} and {{afterFy}} — two consecutive years — with closures jumping from {{peakPct}} of decisions to {{afterPct}}, and it has not come back down. Two things in the public record fall inside that window: the post of chief commissioner was vacant for about five months from Bhadra {{vacancyBs}}, and was then filled substantively for the first time since 2073. The reports give no reason for the change, and dates that coincide are not evidence that one caused the other.",
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
            "What the Commission decided to do with each investigated complaint, by year",
          )}
          subtitle={t(
            "research.corruption.investigation.chartSubtitle",
            "Orange bars are complaints set aside, dark bars are cases taken to court. The line is the share set aside.",
          )}
          caption={
            <>
              {t(
                "research.corruption.investigation.chartCaption",
                "Every year's figures come from one table in that year's report, and each is checked against either the table's own printed total or the count the report states in its text. FY2069/70 to 2072/73 are missing because those reports present the same decisions in a different and non-comparable form. 'Taken to court' counts decisions to prosecute, which is not the same thing as a case appearing in the court register.",
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
            "Setting aside a weak case after investigating it is the right call, and these numbers cannot say which is happening here: a Commission that got better at filtering weak complaints early and one that lost its appetite for court would both produce this chart. What the figures do establish is the size of the change, how fast it arrived, and that no closure carries a recorded reason.",
          )}
        </Caveat>

        <GapCallout
          label={t("research.corruption.gap.aLabel", "Accountability gap · Investigation")}
          title={t(
            "research.corruption.gap.aTitle",
            "Thousands of closures, not one published reason",
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          fixLabel={t("research.corruption.gap.fix", "What would close it")}
          shows={t(
            "research.corruption.gap.aEstablishes",
            "In {{fy}} the Commission closed {{tam}} complaints after investigating them in full and prosecuted {{filed}}. Not one closure carries a published reason.",
            { fy: last.fy, tam: n(last.tameli), filed: n(last.filed) },
          )}
          fix={t(
            "research.corruption.gap.aNeeded",
            "A reason recorded against each closed complaint, and a count of closures later reopened. No annual report carries either.",
          )}
        >
          {t(
            "research.corruption.gap.aBody",
            "The first filter stops far more complaints — {{first}} against {{second}} — but it stops them before anyone investigates. The second stops a higher share, {{secondPct}} of everything it sees, after the work has already been done. Neither records a reason.",
            {
              first: n(cd.tameli + cd.tameli_with_advice),
              second: n(cd.inv_tameli),
              secondPct: pct1((cd.inv_tameli / cd.investigations_completed) * 100),
            },
          )}
        </GapCallout>
      </Block>
    </>
  );
}
