import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { AccusedPerCase } from "@/components/research/AccusedPerCase";
import { GapCallout } from "@/components/research/GapCallout";
import { ChargeMixByYear } from "@/components/research/ChargeMixByYear";
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
import { CITATIONS, REPORT, fyLabel, outcomePct, verdictYearRates } from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

/** The one case where a bench put selective prosecution in a reasoned judgment. */
/** The FY2078/79 annual report, where the Commission quotes the precedent it is
 *  arguing against. Pinned to the fiscal year rather than to the series, so a
 *  refreshed dataset cannot silently move the citation to a different report. */
const CIAA_2078_79 =
  "https://ciaa.gov.np/uploads/publicationsAndReports/FeK7BV.pdf";

const JALAHARI = {
  case: "https://jawafdehi.org/case/jalahari",
  trial: "https://jawafdehi.org/courtcase/special/080-cr-0047",
  appeal: "https://jawafdehi.org/courtcase/supreme/081-cr-1635",
};

export default function Prosecution() {
  const { t, language } = useTranslation();
  const { n, pct, pct1, fy } = useFormat();
  const { byCharge, chargeMixByYear, ciaa, corpus, defendants, overTime } = REPORT;

  // People-per-case for one offence family, formatted to one decimal in the active
  // locale. Returns an empty string rather than "0.0" when a family is absent, so a
  // missing row reads as a gap in the sentence instead of as a real measurement.
  const ratioLabel = (en: string) => {
    const r = defendants.byCharge.find((c) => c.en === en);
    if (!r || !r.cases) return "";
    return new Intl.NumberFormat(language === "ne" ? "ne-NP" : "en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(r.accused / r.cases);
  };

  // Denominator preserved exactly as the original chart defined it: the sum of the
  // six mix families across all years. This is deliberately larger than the
  // substantive corpus, because unclassifiable matters stay inside `other` rather
  // than being dropped. Changing it would silently change what the chart means.
  const mixTotal = chargeMixByYear.reduce(
    (s, r) => s + r.bribery + r.fake + r.embezzlement + r.benefit + r.loss + r.other,
    0,
  );

  const rates = verdictYearRates(overTime.byVerdictYear);
  const firstRate = rates[0];
  const lastRate = rates[rates.length - 1];

  const charge = (en: string) => byCharge.find((c) => c.en === en);
  // Illicit enrichment, the charge whose arithmetic the courts and the Commission
  // disagree about. Decided here means a clean disposition, as everywhere else.
  const ie = charge("Illicit enrichment");
  const ieDecided = ie ? ie.convicted + ie.partial + ie.acquitted : 0;
  // The site's canonical full-only rate. Recomputing it over the byCharge rows gives
  // 45.4% instead of 45.0%, because those rows drop charges that could not be
  // classified -- a second number for the same thing, which is worse than either.
  const fullOnlyAvg = REPORT.rates.convictionFullOnlyPct;
  const fake = charge("Fake credential");
  const bribery = charge("Bribery");
  const allFull = byCharge.reduce((sum, c) => sum + c.convicted, 0);

  const mixFirst = chargeMixByYear[0];
  const mixLast = chargeMixByYear[chargeMixByYear.length - 1];
  const fakeShare = (r: typeof mixFirst) => {
    const total = r.bribery + r.fake + r.embezzlement + r.benefit + r.loss + r.other;
    return total ? (r.fake / total) * 100 : 0;
  };

  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.prosecution.eyebrow", "What gets charged")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.prosecution.title",
            "The Commission charges what it can prove, and what it can prove is paperwork",
          )}
        </SectionHeading>
        <Lede>
          {t(
            "research.corruption.prosecution.lede",
            "About one in {{k}} investigated complaints becomes a prosecution. Which ones is the most consequential choice in the whole process, because the court record shows the charge predicts the verdict better than almost anything else about a case.",
            { k: Math.round(ciaa.investigatedYear / ciaa.casesFiledYear) },
          )}
        </Lede>

        <StatRow>
          <StatTile
            value={n(corpus.ciaaProsecutions)}
            label={t("research.corruption.prosecution.tileCorpus", "Prosecutions in the archive")}
            note={t("research.corruption.tile.corpusNote", "{{years}} complete fiscal years of the criminal register", {
              years: corpus.fiscalYears.length,
            })}
          />
          <StatTile
            value={n(Math.round(corpus.avgFiledPerYear))}
            label={t("research.corruption.prosecution.tileRate", "Filed per year, on average")}
            note={t("research.corruption.prosecution.tileRateNote", "across the whole window")}
          />
          <StatTile
            value={`Rs ${ciaa.damagesClaimedYearBn}bn`}
            label={t("research.corruption.prosecution.tileBigo", "Damages demanded")}
            note={t("research.corruption.prosecution.tileBigoNote", "बिगो claimed by the Commission, FY2081/82")}
          />
          <StatTile
            tone="accent"
            value={pct(fake ? (fake.convicted / allFull) * 100 : 0)}
            label={t("research.corruption.prosecution.tileFake", "Of all full convictions")}
            note={t("research.corruption.prosecution.tileFakeNote", "come from one charge: fake credentials")}
          />
        </StatRow>
      </Block>

      <Block>
        {/*
          PRESERVED FIGURE — "How the charge mix shifted, by year".
          Same component, same data, same denominator as the original page; only its
          placement and the surrounding text changed. It belongs under Prosecution
          because it measures a prosecutorial decision (what was filed), keyed on the
          filing year — not a court outcome.
        */}
        <Figure
          title={t("research.corruption.mix.title2", "How the charge mix shifted, by year")}
          subtitle={t(
            "research.corruption.mix.subtitle",
            "Share of prosecutions filed each fiscal year, by offence family.",
          )}
          caption={
            <>
              {t(
                "research.corruption.mix.caption",
                "Keyed on the year of filing. These rows cover {{n}} cases — more than the substantive corpus, because the unclassifiable matters stay inside Other rather than being dropped. Illegal benefit is not strictly absent from the early years; it is barely used, which is a different claim.",
                { n: n(mixTotal) },
              )}{" "}
              <Cite href={CITATIONS.chargeSheets}>
                {t("research.corruption.byCharge.source", "Charge sheets")}
              </Cite>
            </>
          }
        >
          <ChargeMixByYear
            data={chargeMixByYear}
            labels={{
              bribery: t("research.corruption.mix.bribery", "Bribery"),
              fake: t("research.corruption.mix.fake", "Fake credential"),
              embezzlement: t("research.corruption.mix.embezzlement", "Embezzlement"),
              benefit: t("research.corruption.mix.benefit", "Illegal benefit"),
              loss: t("research.corruption.mix.loss", "Loss to government"),
              other: t("research.corruption.mix.other", "Other"),
            }}
            percentLabel={t("research.corruption.mix.percent", "share of filings")}
          />
        </Figure>

        <Body>
          {t(
            "research.corruption.prosecution.mixBody",
            "Fake-credential cases — someone producing a forged certificate — were {{firstShare}} of the docket filed in {{firstFy}}. By {{lastFy}} they were {{lastShare}}. Nothing about the underlying offence changed; what changed was what the Commission chose to take to court, after the Supreme Court restricted the sting operations that produced many bribery cases.",
            {
              firstShare: pct(fakeShare(mixFirst)),
              firstFy: fy(mixFirst.fy),
              lastFy: fy(mixLast.fy),
              lastShare: pct(fakeShare(mixLast)),
            },
          )}
        </Body>
      </Block>

      <Block>
        <Eyebrow>{t("research.corruption.prosecution.whyEyebrow", "Why it matters downstream")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.prosecution.whyTitle",
            "When the headline rate fell, the docket had already changed",
          )}
        </SectionHeading>
        <Body>
          {t(
            "research.corruption.prosecution.whyBody",
            "The headline conviction rate fell over the same years that this share collapsed, and these are not two findings. They are one. A reader given only the falling line would reasonably conclude the court had gone soft; the Court outcomes section pulls the two apart.",
            {
              firstYear: fyLabel(firstRate.year),
              firstShare: pct(firstRate.fakeSharePct),
              lastYear: fyLabel(lastRate.year),
              lastShare: pct(lastRate.fakeSharePct),
            },
          )}
        </Body>

        <Body>
          {t(
            "research.corruption.prosecution.easyBody",
            "Bribery is the Commission's largest charge, {{briberyDecided}} decided cases, and it converts at {{briberyPct}} in full. So this is not a body that avoids hard cases. It is one whose published record leaned for years on an offence that convicts almost automatically, and that thinned out.",
            {
              briberyDecided: n(
                bribery ? bribery.convicted + bribery.partial + bribery.acquitted : 0,
              ),
              briberyPct: pct(bribery ? outcomePct(bribery, "convicted") : 0),
            },
          )}
        </Body>

        <p className="mt-6 text-sm">
          <Link
            to="/court-outcomes"
            className="font-medium text-accent underline underline-offset-4 hover:opacity-80"
          >
            {t(
              "research.corruption.prosecution.toOutcomes",
              "See conviction rates by charge, and the trend decomposed →",
            )}
          </Link>
        </p>

        <Caveat>
          {t(
            "research.corruption.prosecution.caveat",
            "An acquittal is not proof that the prosecution was wrong to bring the case, and a low conviction rate for a charge is not by itself evidence of bad investigation. Financial offences are genuinely harder to prove than a forged certificate, and the court record carries the verdict but not the reason for it. What the data supports is the association between charge type and outcome — not a judgement about any individual prosecution.",
          )}
        </Caveat>

        <Unknown title={t("research.corruption.prosecution.unknownTitle", "Not in this dataset")}>
          {t(
            "research.corruption.prosecution.unknownBody",
            "बिगो claimed per case and the amount the court ultimately upheld are not carried in the register rows this site is built from, so no charge on this page can be priced. The Commission publishes an annual damages total, which is why that figure appears above as a single-year number and is never divided across cases. Defendants per case can be counted, and are, in the section below — but the court publishes no outcome for each of them.",
          )}
        </Unknown>
      </Block>

      <Block>
        <Eyebrow>{t("research.corruption.size.eyebrow", "How big a case is")}</Eyebrow>
        <SectionHeading>
          {t(
            "research.corruption.size.title",
            "The charges that convict most reliably are the ones with one defendant",
          )}
        </SectionHeading>
        <Body>
          {t(
            "research.corruption.size.body",
            "Charges do not just differ in how hard they are to prove. They differ in shape. A fake-credential case is one official and one document: {{fakeRatio}} defendants per case on average. A case about granting an unlawful benefit averages {{benefitRatio}}, and the land-registration cases average {{landRatio}} — one docket covering dozens of people at once. The offences at the top of the conviction table are the small ones, and the offences at the bottom are the large ones.",
            {
              fakeRatio: ratioLabel("Fake credential"),
              benefitRatio: ratioLabel("Illegal benefit"),
              landRatio: ratioLabel("Govt land misregistration"),
            },
          )}
        </Body>

        <Figure
          title={t(
            "research.corruption.size.chartTitle",
            "People charged per case, by offence",
          )}
          subtitle={t(
            "research.corruption.size.chartSubtitle",
            "Decided cases at the Special Court. The figure under each bar is people charged over cases decided.",
          )}
          caption={t(
            "research.corruption.size.chartCaption",
            "Counted from the defendant side of the court's own party list, on the same decided cases as the conviction-rate chart. A defendant is a position on a charge sheet rather than a resolved individual, so someone charged in two cases is counted twice.",
          )}
        >
          <AccusedPerCase
            rows={defendants.byCharge}
            perCaseLabel={t("research.corruption.size.perCase", "people per case")}
            language={language}
          />
        </Figure>

        <Body>
          {t(
            "research.corruption.size.body2",
            "This matters for how the headline rate should be read. Because the court issues one verdict per docket, a charge tried one defendant at a time produces a clean conviction or a clean acquittal, while a charge tried forty defendants at a time almost has to produce a partial result. Some of the spread between charges is therefore about case structure rather than about evidence or effort — though the data cannot say how much.",
          )}
        </Body>

        <Caveat>
          {t(
            "research.corruption.size.caveat",
            "Large cases are not evidence of weak prosecution, and prosecuting many defendants together can be the efficient and correct choice where the conduct was collective. The point here is narrower: case size varies enormously by charge, so a rate computed per case is not comparing like with like across offences.",
          )}
        </Caveat>

        <GapCallout
          label={t("research.corruption.gap.bLabel", "Accountability gap · Prosecution")}
          title={t(
            "research.corruption.gap.bTitle",
            "A bench acquitted three men because of who was not charged",
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          fixLabel={t("research.corruption.gap.fix", "What would close it")}
          shows={
            <>
              {t(
                "research.corruption.gap.bEstablishes",
                "In case 080-CR-0047 the Special Court held that charging only some of the people equally responsible offends equal justice, and acquitted all three defendants on 2081/01/18. The Commission appealed on 2081/11/09, saying the court had stepped into a decision the constitution leaves to prosecutors. The appeal is still pending.",
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
            </>
          }
          fix={t(
            "research.corruption.gap.bNeeded",
            "A Supreme Court ruling on whether selective charging can ground an acquittal, and a way to identify equally-placed people who were not charged. Neither exists, so no rate can be put on this.",
          )}
        >
          {t(
            "research.corruption.gap.bCaveat",
            "One judgment is not a pattern. Defendants raise selective prosecution often and it usually goes nowhere; this one matters because the finding came from the bench, with reasons. An uncharged person, a rejected charge or a party's complaint of bias does not establish selective prosecution, and no case on this site is counted as an instance of it.",
          )}
        </GapCallout>

        <GapCallout
          label={t("research.corruption.gap.gLabel", "Accountability gap · Prosecution")}
          title={t(
            "research.corruption.gap.gTitle",
            "The Supreme Court said how to count unexplained wealth. The charge sheets kept counting it another way.",
          )}
          showsLabel={t("research.corruption.gap.shows", "What the record shows")}
          fixLabel={t("research.corruption.gap.fix", "What would close it")}
          shows={
            <>
              {t(
                "research.corruption.gap.gEstablishes",
                "In 2072 the Supreme Court laid down how an illicit-enrichment figure must be worked out: if the source of the money put into buying a property cannot be proved, only that original investment counts as unlawfully acquired — not what the property is worth now. The Commission's own annual report quotes the ruling, and then argues against it.",
              )}{" "}
              <Cite href={CIAA_2078_79}>
                {t("research.corruption.gap.gCite", "CIAA annual report FY2078/79, quoting ने.का.प. २०७२, नि.नं. ९५०५")}
              </Cite>
            </>
          }
          fix={t(
            "research.corruption.gap.gNeeded",
            "The claimed and upheld amount on each case record, and the basis each was calculated on. Without them, nobody outside can tell which charge sheets follow the ruling and which do not.",
          )}
        >
          <>
            <p>
              {t(
                "research.corruption.gap.gBody",
                "Illicit enrichment is one of the hardest charges to make stick. Of {{n}} decided cases, {{acq}} ended in outright acquittal — {{acqPct}} — and only {{conv}} were upheld in full, against a court average of {{avg}}.",
                {
                  n: n(ieDecided),
                  acq: n(ie ? ie.acquitted : 0),
                  acqPct: pct1(ieDecided ? ((ie?.acquitted ?? 0) / ieDecided) * 100 : 0),
                  conv: pct(ieDecided ? ((ie?.convicted ?? 0) / ieDecided) * 100 : 0),
                  avg: pct1(fullOnlyAvg),
                },
              )}
            </p>
            <p className="mt-3">
              {t(
                "research.corruption.gap.gBody2",
                "The annual reports show what the argument is about. Year after year they record the Commission appealing these verdicts on the arithmetic itself — that the court credited income whose source was never shown, that it valued the property at the wrong date, that it set a lower figure than the charge sheet claimed. These are not disputes about whether the official took the money. They are disputes about how to count it.",
              )}
            </p>
            <p className="mt-3">
              {t(
                "research.corruption.gap.gCaveat",
                "What the register cannot show is how often a charge sheet departed from the 2072 ruling, because it carries no amount and no method — only the verdict. So the pattern above is the consequence, and the cause can be read in the judgments one at a time but not counted across them.",
              )}
            </p>
          </>
        </GapCallout>
      </Block>
    </>
  );
}
