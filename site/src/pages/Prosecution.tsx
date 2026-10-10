import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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

export default function Prosecution() {
  const { t } = useTranslation();
  const { n, pct, fy } = useFormat();
  const { byCharge, chargeMixByYear, ciaa, corpus, overTime } = REPORT;

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
            "In {{firstYear}} fake-credential cases were {{firstShare}} of everything the court decided. By {{lastYear}} they were {{lastShare}}. The headline conviction rate fell over the same years, and these are not two findings. They are one. A reader given only the falling line would reasonably conclude the court had gone soft; the Court outcomes section pulls the two apart.",
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
            "बिगो claimed per case, the number of defendants per charge, and the amount the court ultimately upheld are not carried in the register rows this site is built from. The Commission publishes an annual damages total, which is why that figure appears above as a single-year number and is never divided across cases.",
          )}
        </Unknown>
      </Block>
    </>
  );
}
