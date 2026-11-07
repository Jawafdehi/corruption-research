import { Link } from "react-router-dom";

import DATA from "@/data/headline-findings.json";
import { REPORT } from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

type Finding = {
  key: string;
  headline: string;
  explain: string;
  figures?: Record<string, string>;
  generated?: string[];
  gap: string;
  caveat?: string;
  source: string;
  href: string;
};

/** What each gap label means, said once for a reader who has not met the scheme. */
const GAP_LABEL: Record<string, string> = {
  A: "Gap in the system",
  "A→B": "Gap in the system, which also limits this research",
};

/**
 * The plain-language headline findings, for a reader in civil society or government.
 *
 * Every number comes from data, never from the text: `headline-findings.json` holds the
 * sentences with {{placeholders}} and the hand-checked figures, and the appeal figures
 * come from report.generated.json, which gen_site_data.py reconciles against the research
 * cards. A correction is made in one of those two files and flows through here.
 */
export function HeadlineFindings() {
  const { n, pct1 } = useFormat();
  const { appeals, supremeDelay } = REPORT;

  // The figures generated from the dataset, by the finding that uses them.
  const generated: Record<string, Record<string, string>> = {
    oneWay: {
      defRev: n(appeals.convictedVsConviction.reversed),
      defDec: n(appeals.convictedVsConviction.decided),
      govRev: n(appeals.governmentVsAcquittal.reversed),
      govDec: n(appeals.governmentVsAcquittal.decided),
    },
    notAppealed: {
      none: n(appeals.acquittals.noAppeal),
      judgeable: n(appeals.acquittals.judgeable),
      pct: pct1(appeals.acquittals.noAppealPct),
    },
    duration: {
      from: String(supremeDelay.fromYear),
      to: String(supremeDelay.toYear),
      km: (supremeDelay.kmMedianYears ?? supremeDelay.medianYears).toFixed(1),
      over6: pct1(supremeDelay.overSixPct),
      person: (
        supremeDelay.bySide.person.kmMedianYears ??
        supremeDelay.bySide.person.medianYears
      ).toFixed(1),
    },
  };

  const fill = (f: Finding) => {
    const values = { ...f.figures, ...generated[f.key] };
    return f.explain.replace(/\{\{(\w+)\}\}/g, (_, k: string) => {
      if (!(k in values)) throw new Error(`headline finding ${f.key}: no figure for {{${k}}}`);
      return values[k];
    });
  };

  return (
    <section id="headline-findings" className="scroll-mt-6">
      <p
        role="note"
        className="mb-6 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm text-foreground/90"
      >
        {DATA.status}
      </p>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
        Headline findings
      </p>
      <h2 className="font-display text-[1.7rem] font-bold leading-tight tracking-tight text-foreground md:text-[2.25rem]">
        Where accountability leaks, from complaint to recovery
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/90 md:text-lg md:leading-8">
        What the institutions' own records show at each stage, in plain words. Each finding links
        to the detail behind it. These are findings only; the research makes no recommendations.
      </p>

      {DATA.stages.map((stage) => (
        <div key={stage.key} className="mt-10">
          <h3 className="border-b border-border pb-2 font-display text-xl font-semibold text-foreground">
            {stage.title}
          </h3>
          <ol className="mt-4 space-y-6">
            {(stage.findings as Finding[]).map((f) => (
              <li key={f.key} id={`finding-${f.key}`} className="max-w-3xl scroll-mt-6">
                <p className="text-lg font-semibold leading-snug text-foreground">{f.headline}</p>
                <p className="mt-1 text-sm leading-6 text-foreground/80 md:text-base md:leading-7">
                  {fill(f)}
                  {f.caveat ? <span className="text-muted-foreground"> {f.caveat}</span> : null}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {GAP_LABEL[f.gap] ?? f.gap}
                  {" · "}
                  <Link
                    to={f.href}
                    className="underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
                  >
                    The detail
                  </Link>
                </p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
