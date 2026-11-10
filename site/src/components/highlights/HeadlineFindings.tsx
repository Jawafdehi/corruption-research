import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import DATA from "@/data/headline-findings.json";
import HOME from "@/data/home-findings.generated.json";

type Finding = { key: string; gap: string; href: string };
type Bilingual = { en: string; ne: string };
type HomeFinding = { headline: Bilingual; explain: Bilingual; caveat: Bilingual | null };

const HOME_FINDINGS = HOME.findings as Record<string, HomeFinding>;
const HOME_GAP = HOME.gap as Record<string, Bilingual>;

/**
 * The plain-language headline findings, for a reader in civil society or government.
 *
 * The words are the home page's, in both languages: `home-findings.generated.json` is built
 * from the home page's own data layers (scripts/home_findings_for_highlights.mjs), which take
 * every number from `headline-findings.json` and report.generated.json. So this list and the
 * home page cannot say different things, and a correction is still made in one place.
 * `headline-findings.json` still decides the grouping, the order and the links.
 */
export function HeadlineFindings() {
  const { t, language } = useTranslation();
  const lang = language === "ne" ? "ne" : "en";

  const home = (key: string) => {
    const h = HOME_FINDINGS[key];
    if (!h) throw new Error(`headline finding ${key}: not in home-findings.generated.json`);
    return h;
  };

  return (
    <section id="headline-findings" className="scroll-mt-6">
      {/* The same launch flag as the home page: the draft line is for the review build only. */}
      {import.meta.env.VITE_JW_LAUNCH === "1" ? null : (
        <p
          role="note"
          className="mb-6 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm text-foreground/90"
        >
          {DATA.status}
        </p>
      )}
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
        {t("research.corruption.hf.eyebrow", "Headline findings")}
      </p>
      <h2 className="font-display text-[1.7rem] font-bold leading-tight tracking-tight text-foreground md:text-[2.25rem]">
        {t("research.corruption.hf.title", "Where accountability leaks, from complaint to recovery")}
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/90 md:text-lg md:leading-8">
        {t(
          "research.corruption.hf.intro",
          "What the institutions' own records show at each stage, in plain words. Each finding links to the detail behind it. These are findings only; the research makes no recommendations.",
        )}
      </p>

      {DATA.stages.map((stage) => (
        <div key={stage.key} className="mt-10">
          <h3 className="border-b border-border pb-2 font-display text-xl font-semibold text-foreground">
            {t(`research.corruption.hf.stage.${stage.key}`, stage.title)}
          </h3>
          <ol className="mt-4 space-y-6">
            {(stage.findings as Finding[]).map((f) => {
              const h = home(f.key);
              return (
                <li key={f.key} id={`finding-${f.key}`} className="max-w-3xl scroll-mt-6">
                  <p className="text-lg font-semibold leading-snug text-foreground">{h.headline[lang]}</p>
                  <p className="mt-1 text-sm leading-6 text-foreground/80 md:text-base md:leading-7">
                    {h.explain[lang]}
                    {h.caveat ? <span className="text-muted-foreground"> {h.caveat[lang]}</span> : null}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {HOME_GAP[f.gap]?.[lang] ?? f.gap}
                    {" · "}
                    <Link
                      to={f.href}
                      className="underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
                    >
                      {t("research.corruption.hf.detail", "The detail")}
                    </Link>
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </section>
  );
}
