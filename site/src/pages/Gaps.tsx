import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import {
  Block,
  Caveat,
  Cite,
  Eyebrow,
  Lede,
  SectionHeading,
  Unknown,
} from "@/components/layout/Prose";
import { CITATIONS, REPORT, decidedClean, tameliPct } from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

/** The jalahari prosecution — the worked example behind the two middle gaps. */
const JALAHARI = {
  case: "https://jawafdehi.org/case/jalahari",
  trial: "https://jawafdehi.org/courtcase/special/080-cr-0047",
  appeal: "https://jawafdehi.org/courtcase/supreme/081-cr-1635",
};

/**
 * One accountability gap. `establishes` is what the record actually shows,
 * `needed` is the document or field that would close it — keeping those two apart
 * is the whole point of the section, so they are separate props rather than prose.
 */
const Gap = ({
  id,
  label,
  title,
  children,
  establishes,
  needed,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
  establishes: string;
  needed: string;
}) => {
  const { t } = useTranslation();
  return (
    <section id={id} className="border-t border-border py-8 first:border-t-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">{label}</p>
      <h3 className="mt-1.5 font-display text-xl font-bold leading-snug text-foreground md:text-2xl">
        {title}
      </h3>
      <div className="mt-3 max-w-3xl text-sm leading-6 text-foreground/80 md:text-base md:leading-7">
        {children}
      </div>
      <dl className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card/40 p-3.5">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("research.corruption.gap.establishes", "What the evidence establishes")}
          </dt>
          <dd className="mt-1.5 text-sm leading-6 text-foreground/85">{establishes}</dd>
        </div>
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3.5">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("research.corruption.gap.needed", "What would close the gap")}
          </dt>
          <dd className="mt-1.5 text-sm leading-6 text-muted-foreground">{needed}</dd>
        </div>
      </dl>
    </section>
  );
};

export default function Gaps() {
  const { t } = useTranslation();
  const { n, pct, pct1 } = useFormat();
  const { appeals, ciaa, disposals, entityResolution, outcome } = REPORT;

  const decided = decidedClean(outcome);
  const last = disposals[disposals.length - 1];
  const untracedPct = appeals.appeals ? (appeals.no_outcome / appeals.appeals) * 100 : 0;

  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.gaps.eyebrow2", "Where the trail breaks")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.gaps.title2",
            "Six places where the paper trail runs out",
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.gaps.lede2",
            "Every gap below points at a specific missing field, document or identifier. None of them is a complaint about governance in general, and where the record cannot settle something we say so instead of filling it in.",
          )}
        </Lede>
      </Block>

      <Block className="mt-8 md:mt-10">
        <Gap
          id="investigation"
          label={t("research.corruption.gap.aLabel", "A · Investigation and closure")}
          title={t(
            "research.corruption.gap.aTitle",
            "Thousands of closures, not one published reason",
          )}
          establishes={t(
            "research.corruption.gap.aEstablishes",
            "In {{fy}}, {{pct}} of the Commission's decisions on fully investigated complaints were closures (तामेली) — up from {{was}} five years earlier. Both figures come from the Commission's own decision tables.",
            { fy: last.fy, pct: pct1(tameliPct(last)), was: pct1(tameliPct(disposals[0])) },
          )}
          needed={t(
            "research.corruption.gap.aNeeded",
            "A reason code per closed complaint, or a count of closures later reopened. Neither appears in any annual report.",
          )}
        >
          {t(
            "research.corruption.gap.aBody",
            "The published figures cannot be tracked from one stage to the next: complaints registered in a year, investigations completed in that year and prosecutions filed in that year are three different sets of cases. So the funnel shows the size of each stage, not the fate of any cohort. What it does establish is that the second filter — closure after a full investigation — is now the larger one, and it is the one with no published reasoning at all.",
          )}{" "}
          <Link to="/investigation" className="text-accent underline underline-offset-4">
            {t("research.corruption.gap.aLink", "See the year-by-year series")}
          </Link>
        </Gap>

        <Gap
          id="selective"
          label={t("research.corruption.gap.bLabel", "B · Selective prosecution")}
          title={t(
            "research.corruption.gap.bTitle",
            "A bench acquitted three men because of who was not charged",
          )}
          establishes={t(
            "research.corruption.gap.bEstablishes",
            "In case 080-CR-0047 the Special Court expressly raised Selective Prosecution, holding that charging only some of those with equal responsibility offends the principle of equal justice, and acquitted all three defendants on 2081/01/18. The Commission appealed on 2081/11/09, arguing the court had intruded on its constitutional prosecutorial discretion. The appeal is pending.",
          )}
          needed={t(
            "research.corruption.gap.bNeeded",
            "A Supreme Court ruling on whether selective charging can ground an acquittal, and a systematic way to identify equally-placed people who were not charged. Neither exists yet, so no rate can be put on this.",
          )}
        >
          {t(
            "research.corruption.gap.bBody",
            "Defendants raise selective prosecution often and it usually goes nowhere, which is why this one matters: the finding came from the bench, in a reasoned judgment. It is also not settled. The Commission says the court walked into territory the constitution reserves for prosecutors, and the Supreme Court has not ruled. We record the question, not an answer to it.",
          )}{" "}
          <Cite href={JALAHARI.case}>
            {t("research.corruption.gap.bCite", "The case, with sources")}
          </Cite>
          {" · "}
          <Cite href={JALAHARI.trial}>
            {t("research.corruption.gap.bCiteTrial", "Trial record 080-CR-0047")}
          </Cite>
          {" · "}
          <Cite href={JALAHARI.appeal}>
            {t("research.corruption.gap.bCiteAppeal", "Appeal 081-CR-1635")}
          </Cite>
          <Caveat>
            {t(
              "research.corruption.gap.bCaveat",
              "One reasoned judgment is not a pattern. An uncharged person, a rejected charge or a party's complaint of bias does not establish selective prosecution, and this site does not count cases as instances of it. Until the Supreme Court rules and a comparable-defendant test exists, this stays a documented single instance.",
            )}
          </Caveat>
        </Gap>

        <Gap
          id="bigo"
          label={t("research.corruption.gap.cLabel", "C · Claimed amounts versus upheld amounts")}
          title={t(
            "research.corruption.gap.cTitle",
            "The charge said 1,491 grams were missing. The court made it 58.",
          )}
          establishes={t(
            "research.corruption.gap.cEstablishes",
            "In 080-CR-0047 the Commission claimed 1,491.718g of gold missing, worth Rs 1,17,01,781.85. The court, after crediting 623g returned to the Commission, 809.33g of other metals and 73.88g of natural loss, put the unexplained difference at roughly 58g.",
          )}
          needed={t(
            "research.corruption.gap.cNeeded",
            "A बिगो field on the case record — claimed and upheld — across the register. The rows this site is built from carry neither, so no claimed-versus-upheld rate can be computed for the corpus.",
          )}
        >
          {t(
            "research.corruption.gap.cBody",
            "That single case is an illustration, not a measurement: it shows how far the two figures can diverge, and it is drawn from one judgment we have read in full. Across the archive the comparison cannot be made at all, because the register rows carry no amount. The Commission publishes an annual damages total — Rs {{bn}} billion demanded in FY2081/82 — and no institution publishes the matching upheld figure, so the two are never subtracted on this site.",
            { bn: ciaa.damagesClaimedYearBn },
          )}
        </Gap>

        <Gap
          id="appeals"
          label={t("research.corruption.gap.dLabel", "D · Appeals and finality")}
          title={t(
            "research.corruption.gap.dTitle",
            "Half the appeals end in silence",
          )}
          establishes={t(
            "research.corruption.gap.dEstablishes",
            "{{no}} of {{total}} established appeals — {{pct}} — carry no recorded outcome. Among those that are decided, defendants obtain a full reversal in {{dpct}} of cases and the Commission in {{cpct}}.",
            {
              no: n(appeals.no_outcome),
              total: n(appeals.appeals),
              pct: pct1(untracedPct),
              dpct: pct1(appeals.defendant.pct),
              cpct: pct1(appeals.commission.pct),
            },
          )}
          needed={t(
            "research.corruption.gap.dNeeded",
            "A foreign key between trial and appeal cases in the court system. Without one, every pairing has to be reconstructed by hand and coverage can never be proved complete.",
          )}
        >
          {t(
            "research.corruption.gap.dBody",
            "Blame the filing system here, not the bench. Trial and appeal cases sit in one table with nothing joining them, so we rebuilt the pairing from the Commission's register, from judgments that name the trial case, and failing both, by matching defendant names. Anything we could not resolve is counted as unknown. It is never counted as a case that went unappealed, and never as a loss.",
          )}{" "}
          <Link to="/appeals" className="text-accent underline underline-offset-4">
            {t("research.corruption.gap.dLink", "See the appeal record")}
          </Link>
        </Gap>

        <Gap
          id="recovery"
          label={t("research.corruption.gap.eLabel", "E · Recovery and enforcement")}
          title={t(
            "research.corruption.gap.eTitle",
            "The money is where the record simply stops",
          )}
          establishes={t(
            "research.corruption.gap.eEstablishes",
            "The Commission publishes damages demanded — Rs {{bn}} billion in FY2081/82. No institution publishes amounts ordered, recovered or outstanding, and the court record carries none of the three.",
            { bn: ciaa.damagesClaimedYearBn },
          )}
          needed={t(
            "research.corruption.gap.eNeeded",
            "A published recovery ledger keyed to case numbers. Until one exists, the final stage of accountability cannot be measured at all.",
          )}
        >
          {t(
            "research.corruption.gap.eBody",
            "Every other stage here has an institution that publishes something about it. This one has none, which is why it is the only stage we cannot put a number against. Read the blank as missing rather than as zero. A finding on बिगो is a legal determination, and no published source says whether a rupee followed it.",
          )}
          <Unknown title={t("research.corruption.gap.eUnknownTitle", "Explicitly unanswerable")}>
            {t(
              "research.corruption.gap.eUnknownBody",
              "What share of court-recognised बिगो has been collected. Any figure offered for this — by anyone — is not derivable from the public record as it currently stands.",
            )}
          </Unknown>
        </Gap>

        <Gap
          id="transparency"
          label={t("research.corruption.gap.fLabel", "F · Data and institutional transparency")}
          title={t(
            "research.corruption.gap.fTitle",
            "The same person is a different name in every file",
          )}
          establishes={t(
            "research.corruption.gap.fEstablishes",
            "The archive holds {{rows}} defendant records over {{distinct}} distinct names, of which {{resolved}} are matched to a known person or office — about {{pct}}. Two of the annual reports in our window print decision bubbles with no reconcilable total, so they are excluded from the closure series rather than estimated.",
            {
              rows: n(entityResolution.defendantRows),
              distinct: n(entityResolution.distinctNames),
              resolved: n(entityResolution.resolved),
              pct: pct((entityResolution.resolved / entityResolution.distinctNames) * 100),
            },
          )}
          needed={t(
            "research.corruption.gap.fNeeded",
            "Stable identifiers for people and offices across charge sheets, judgments and reports, and a fixed set of reporting categories between annual reports.",
          )}
        >
          {t(
            "research.corruption.gap.fBody",
            "Headline comparisons across years are harder than they look: the Commission's own complaint totals vary depending on whether carried-over cases are included, and the categories on its disposal tables are not identical from report to report. Where this site compares two figures, they come from the same table in the same report. Name matching is identification only — a resolved name is never a statement that the person was convicted.",
          )}{" "}
          <Cite href={CITATIONS.dataQuality}>
            {t("research.corruption.gap.fCite", "Coverage and data quality")}
          </Cite>
        </Gap>
      </Block>

      <Block>
        <Caveat>
          {t(
            "research.corruption.gaps.closing",
            "None of the above shows that any institution set out to obscure anything. Most of these gaps are what happens when three bodies keep separate records for their own purposes and nobody is responsible for joining them. That is also why they are fixable: every one names a specific field, document or identifier that does not currently exist. Across {{decided}} decided cases, the thing most often missing is not a judgement — it is the link to what happened next.",
            { decided: n(decided) },
          )}
        </Caveat>
      </Block>
    </>
  );
}
