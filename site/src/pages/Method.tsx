import { useTranslation } from "react-i18next";

import { useFormat } from "@/lib/format";

import { Block, Body, Caveat, Cite, Eyebrow, Figure, Lede, SectionHeading } from "@/components/layout/Prose";
import { CITATIONS, REPORT, fyLabel, tameliPct } from "@/data/research-corruption";


export default function Method() {
  const { t } = useTranslation();
  const { n, pct1, date } = useFormat();
  const { assumptions, corpus, crossCheck, entityResolution, provenance } = REPORT;

  const years = corpus.fiscalYears;
  const divergence =
    crossCheck.ciaaFiledTotal > 0
      ? (Math.abs(crossCheck.registerComparableTotal - crossCheck.ciaaFiledTotal) / crossCheck.ciaaFiledTotal) * 100
      : 0;
  const unexplained = crossCheck.surplusReasons.find((r) => r.unexplained)?.count ?? 0;
  // The offence charts do not share one universe; each is named rather than claiming a
  // single "narrower cut" none of them uses (claims ledger M129).
  const mixUniverse = REPORT.chargeMixByYear.reduce(
    (a, r) => a + r.bribery + r.fake + r.embezzlement + r.benefit + r.loss + r.other,
    0,
  );
  const chargeDecided = REPORT.byCharge.reduce((a, c) => a + c.convicted + c.partial + c.acquitted, 0);

  return (
    <>
      <Block id="overview">
        <Eyebrow>{t("research.corruption.method.eyebrow", "Sources, limits and provenance")}</Eyebrow>
        <SectionHeading>{t("research.corruption.method.title", "How these numbers were produced")}</SectionHeading>
        <Lede>
          {t(
            "research.corruption.method.lede",
            "Everything on this site is counted from two written records: the Special Court's criminal register, and the Commission's own annual reports. Neither is a copy of the other, so where they agree a figure is corroborated twice, and where they diverge the difference can be examined case by case.",
          )}
        </Lede>
      </Block>

      <Block id="corpus">
        <SectionHeading>{t("research.corruption.method.corpusTitle", "What counts as a case here")}</SectionHeading>
        <Body>
          {t(
            // TODO(claims): M128 unverified — 'switched numbering schemes exactly at the start of this
            // window' cannot be checked from the snapshot (pre-window cases are excluded).
            "research.corruption.method.corpusBody",
            "The archive is the Special Court's criminal register across {{n}} complete fiscal years, {{first}} through {{last}} — {{corpus}} cases. The register itself is the definition: there is no filter on who brought the case, because the court switched numbering schemes exactly at the start of this window, which makes the register and the fiscal years share one clean boundary.",
            {
              n: years.length,
              first: fyLabel(years[0]),
              last: fyLabel(years[years.length - 1]),
              corpus: n(corpus.ciaaProsecutions),
            },
          )}
        </Body>
        <Body>
          {t(
            "research.corruption.method.substantiveBody2",
            "Charts about offences do not all count the same cases, so each states its own base. The archive minus {{ml}} money-laundering prosecutions, which are tried here but under a different statute, and {{other}} cases whose charge text could not be classified, leaves {{substantive}}. The charge mix by year counts {{mix}} cases (money laundering and petitions out, unclassified charges kept as “other”); the conviction rate by charge counts the {{chargeDecided}} decided cases with a classified charge, money laundering included; the defendants table counts {{defDecided}} decided cases with at least one accused; and the Prosecution page's headline count is {{exMl}}, money laundering out. Counts of filings, decisions and backlog use the full {{corpus}}, which works out at roughly {{avg}} new cases a year.",
            {
              substantive: n(corpus.substantive),
              ml: n(corpus.moneyLaundering),
              other: n(corpus.otherBucket),
              mix: n(mixUniverse),
              chargeDecided: n(chargeDecided),
              defDecided: n(REPORT.defendants.decidedCases),
              exMl: n(corpus.ciaaProsecutions - corpus.moneyLaundering),
              corpus: n(corpus.ciaaProsecutions),
              avg: corpus.avgFiledPerYear,
            },
          )}
        </Body>
      </Block>

      <Block id="cross-check">
        <SectionHeading>{t("research.corruption.method.crossTitle", "Checking the two records against each other")}</SectionHeading>
        <Body>
          {t(
            "research.corruption.method.crossBody",
            "Across {{years}} fiscal years the Commission's published filing totals and the court's register agree to about {{pct}}% — {{ciaa}} filings against {{register}} comparable register cases. Comparing them requires removing {{excluded}} register cases in streams the Commission does not file at all, such as petitions brought against it.",
            {
              years: crossCheck.yearsCompared,
              pct: divergence.toFixed(1),
              ciaa: n(crossCheck.ciaaFiledTotal),
              register: n(crossCheck.registerComparableTotal),
              excluded: n(crossCheck.nonCiaaStreams),
            },
          )}
        </Body>
        <Body>
          {t(
            "research.corruption.method.crossCase",
            "In the {{examined}} widest-divergence years the comparison was done case by case, because both records name the accused. All {{listed}} cases the Commission says it filed were found in the register. The register additionally holds {{surplus}} the Commission's own filing tables never list, and most of those have a documented explanation.",
            {
              examined: crossCheck.yearsExamined,
              listed: n(crossCheck.ciaaListed),
              surplus: n(crossCheck.registerSurplus),
            },
          )}
        </Body>
        <Figure
          title={t("research.corruption.method.surplusTitle", "Why the register holds cases the reports do not list")}
          subtitle={t("research.corruption.method.surplusSubtitle", "Across the three years examined case by case.")}
          caption={t(
            "research.corruption.method.surplusCaption",
            "{{n}} remain genuinely unexplained. That residual is reported rather than absorbed into one of the other reasons — an unexplained gap is a finding about the records, and rounding it away would hide it.",
            { n: unexplained },
          )}
        >
          <table className="w-full min-w-[26rem] border-collapse text-sm">
            <tbody>
              {crossCheck.surplusReasons.map((r) => (
                <tr key={r.en} className="border-b border-border/60 last:border-0">
                  <th scope="row" className="py-3 pr-4 text-left font-normal text-foreground/85">
                    {t(`research.corruption.method.surplus.${r.en}`, r.en)}
                  </th>
                  <td className="py-3 text-right font-mono font-semibold text-foreground">{n(r.count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Figure>
      </Block>

      <Block id="assumptions">
        <SectionHeading>{t("research.corruption.method.assumptionsTitle", "Figures taken from the Commission's reports")}</SectionHeading>
        <Body>
          {t(
            // TODO(claims): M134 unverified — ciaa_complaints_5yr (107,050 = 148,235 - 41,185) in
            // dataset/assumptions.csv; locate the report page (probably a chart image).
            "research.corruption.method.assumptionsBody",
            "The court's records cannot tell us how many complaints were received or investigated — only the Commission publishes that. Those figures are listed here as explicit inputs, each with the report it came from, and are kept separate from anything measured in the court record.",
          )}
        </Body>
        <Figure
          title={t("research.corruption.method.assumptionsFigure", "External inputs")}
          subtitle={t("research.corruption.method.assumptionsFigureSub", "Everything on this site that is not counted from the court register.")}
        >
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-2 pr-4 font-medium text-muted-foreground">
                  {t("research.corruption.method.colValue", "Value")}
                </th>
                <th scope="col" className="py-2 pr-4 font-medium text-muted-foreground">
                  {t("research.corruption.method.colWhat", "What it measures")}
                </th>
                <th scope="col" className="py-2 font-medium text-muted-foreground">
                  {t("research.corruption.method.colSource", "Source")}
                </th>
              </tr>
            </thead>
            <tbody>
              {assumptions.map((a) => (
                <tr key={a.key} className="border-b border-border/60 last:border-0 align-top">
                  <td className="whitespace-nowrap py-3 pr-4 font-mono font-semibold text-foreground">
                    {n(a.value)}
                    {a.unit && a.unit !== "count" ? (
                      <span className="ml-1 font-sans text-xs font-normal text-muted-foreground">
                        {t(`research.corruption.method.unit.${a.unit}`, a.unit)}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 leading-6 text-foreground/80">
                    {t(`research.corruption.method.assumption.${a.key}`, a.note)}
                  </td>
                  <td className="py-3 leading-6">
                    {a.source_url ? (
                      <Cite href={a.source_url}>{t("research.corruption.method.report", "Report")}</Cite>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Figure>
      </Block>

      <Block id="limits">
        <SectionHeading>{t("research.corruption.method.limitsTitle", "What this cannot tell you")}</SectionHeading>
        <Caveat>
          {t(
            "research.corruption.method.limitsCases",
            "Every figure counts cases, not people. The court records one verdict per case and publishes no outcome for each accused, so a partial conviction cannot be resolved into how many of the accused were convicted. No per-person conviction rate can be derived from this data, and any reporting that implies one is wrong.",
          )}
        </Caveat>
        <Body>
          {t(
            "research.corruption.method.limitsResolution",
            "The archive carries {{rows}} defendant records covering {{distinct}} distinct names. {{resolved}} of the records, carrying {{resolvedNames}} distinct names, are matched to a known person or office. A match means identification only — it is never a statement that the person was convicted.",
            {
              rows: n(entityResolution.defendantRows),
              distinct: n(entityResolution.distinctNames),
              resolved: n(entityResolution.resolved),
              resolvedNames: n(entityResolution.resolvedNames),
            },
          )}
        </Body>
        <Body>
          {t(
            "research.corruption.method.limitsRecovery",
            "No institution publishes what is recovered from corruption judgments, and the court record used here carries no amount, so the final stage of accountability is absent here rather than measured as zero. The Supreme Court's annual report does publish a fine ledger for all district courts every year ({{fy}}: {{pct}} of the ledger recorded as disposed of), but it does not separate corruption cases, and “disposed of” includes imprisonment served in lieu of payment and entries written off, not only money paid. Reasons for closing a complaint at intake are likewise unpublished case by case.",
            {
              fy: REPORT.fineLedger[REPORT.fineLedger.length - 1].fy,
              pct: pct1(REPORT.fineLedger[REPORT.fineLedger.length - 1].disposedPct),
            },
          )}
        </Body>
      </Block>

      <Block id="closure-series">
        <SectionHeading>
          {t("research.corruption.method.disposalsTitle", "The post-investigation closure series")}
        </SectionHeading>
        <Body>
          {t(
            "research.corruption.method.disposalsBody",
            "The Investigation section's closure series is parsed from the decision table in each annual report by a script in the data pack, rather than re-typed, so it can be re-derived and audited. One row per fiscal year, each carrying the table number and the report it came from, so any share can be checked against two numbers printed side by side in one table. On the chart itself, each fiscal year links to its own report.",
          )}
        </Body>
        <Body>
          {t(
            // TODO(claims): M142 unverified — FY2072/73 absent from its own report and the next
            // annex reproducing FY2073/74 totals were not re-checked.
            "research.corruption.method.disposalsLimits",
            "The series runs from FY2073/74 to FY2081/82. Every row is checked against either that table's own printed total or the filing count the report states in its text, and the script refuses to write a series that disagrees with either. FY2069/70 to FY2071/72 are left out because those reports present the same decisions as a subject-area cross-tab with different row labels, which is not the same measurement; FY2072/73 is absent from its own report, and the annex in the following report that claims to carry it reproduces FY2073/74's totals instead. The 'taken to court' column counts decisions to prosecute, which is a different unit from a case appearing in the court register — the two are never differenced.",
          )}
        </Body>
        <div className="chart-scroll mt-6">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">
                  {t("research.corruption.method.colFy", "Fiscal year")}
                </th>
                <th className="py-2 pr-4 text-right font-medium">
                  {t("research.corruption.method.colTameli", "Closed (तामेली)")}
                </th>
                <th className="py-2 pr-4 text-right font-medium">
                  {t("research.corruption.method.colTotal", "All decisions")}
                </th>
                <th className="py-2 pr-4 text-right font-medium">
                  {t("research.corruption.method.colShare", "Share")}
                </th>
                <th className="py-2 font-medium">
                  {t("research.corruption.method.colFigure", "Figure")}
                </th>
              </tr>
            </thead>
            <tbody>
              {REPORT.disposals.map((d) => (
                <tr key={d.fy} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4 font-mono tabular-nums text-foreground">{d.fy}</td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-muted-foreground">
                    {n(d.tameli)}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-muted-foreground">
                    {n(d.total)}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-foreground">
                    {pct1(tameliPct(d))}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    <Cite href={d.source_url}>{d.figure}</Cite>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>

      <Block id="provenance">
        <SectionHeading>{t("research.corruption.method.provenanceTitle", "Provenance")}</SectionHeading>
        <Body>
          {t(
            "research.corruption.method.provenanceBody2",
            "Every count and rate on this site is generated from the published data pack at build time, so the page and the dataset cannot disagree; rebuild it and those numbers follow the data. Some details are written into the text instead: amounts and dates from individual judgments and rulings, such as the cases discussed by name, and dates of appointments.",
          )}
        </Body>
        <Figure
          title={t("research.corruption.method.snapshotTitle", "This build")}
          subtitle={t("research.corruption.method.snapshotSub", "What the figures on this site were derived from.")}
        >
          <table className="w-full min-w-[26rem] border-collapse text-sm">
            <tbody>
              <tr className="border-b border-border/60">
                <th scope="row" className="py-3 pr-4 text-left font-normal text-foreground/85">
                  {t("research.corruption.method.generated", "Page generated")}
                </th>
                <td className="py-3 text-right font-mono text-foreground">{provenance.generatedAt.slice(0, 10)}</td>
              </tr>
              {provenance.commit ? (
                <tr className="border-b border-border/60">
                  <th scope="row" className="py-3 pr-4 text-left font-normal text-foreground/85">
                    {t("research.corruption.method.commit", "Data pack revision")}
                  </th>
                  <td className="py-3 text-right font-mono text-foreground">{provenance.commit}</td>
                </tr>
              ) : null}
              {Object.entries(provenance.dataset).map(([name, meta]) => (
                <tr key={name} className="border-b border-border/60 last:border-0">
                  <th scope="row" className="py-3 pr-4 text-left font-normal capitalize text-foreground/85">
                    {t(`research.corruption.method.dataset.${name}`, name)}
                  </th>
                  <td className="py-3 text-right font-mono text-foreground">
                    {n(meta.rows)}{" "}
                    <span className="font-sans text-xs text-muted-foreground">
                      {t("research.corruption.method.rowsAt", "rows · {{date}}", { date: date(meta.modified) })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Figure>
        <Body>
          {t("research.corruption.method.repo", "The dataset, the derivation code and the notebook behind this site are public: ")}
          <Cite href={CITATIONS.researchPack}>github.com/Jawafdehi/corruption-research</Cite>
          {t("research.corruption.method.repoEnd", ". The underlying court records and Commission reports are published at ")}
          <Cite href={CITATIONS.courtRecords}>jawafdehi.org</Cite>
          {t("research.corruption.method.repoEnd2", ".")}
        </Body>
      </Block>
    </>
  );
}
