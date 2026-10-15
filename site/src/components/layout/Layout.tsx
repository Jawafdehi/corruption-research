import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { SECTIONS } from "@/App";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Skeleton } from "@/components/ui/skeleton";
import { CITATIONS, REPORT } from "@/data/research-corruption";
import { cn } from "@/lib/utils";

/** Holds space while a lazily-loaded section arrives, so the page does not jump. */
const SectionFallback = () => {
  const { t } = useTranslation();
  return (
    <div
      className="space-y-4"
      aria-busy="true"
      aria-label={t("research.corruption.loading", "Loading section")}
    >
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};

/**
 * Jump back to the top when the section changes; otherwise a deep scroll carries over.
 *
 * A `#fragment` overrides that and scrolls to the named element instead, which is what
 * the Highlights cards link through. The element is polled rather than read once: the
 * route is a lazy chunk and the charts mount after their data resolves, so on a cold
 * navigation the target does not exist yet at the moment this effect first runs.
 */
function ScrollToTarget() {
  const { pathname, hash } = useLocation();

  // The braces are load-bearing: an effect's return value IS its cleanup function, so a
  // concise arrow body here would hand React whatever window.scrollTo returns. Browsers
  // return undefined, but extensions and smooth-scroll polyfills override scrollTo and
  // some return a value — React then calls it as cleanup on the next navigation and the
  // whole app unmounts into a blank page. Never return a value from an effect you do not
  // mean as cleanup. This version does return one, deliberately: clearTimeout for the
  // polling below, which is what a cleanup is actually for.
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let timer = 0;
    let tries = 0;

    const find = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: "start" });
        return;
      }
      // ~2s of waiting, then give up and behave like a plain navigation rather than
      // leaving the reader wherever the previous page happened to be scrolled to.
      if (tries++ > 40) {
        window.scrollTo(0, 0);
        return;
      }
      timer = window.setTimeout(find, 50);
    };

    find();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

function SectionNav() {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("research.corruption.nav.aria", "Report sections")}
      className="chart-scroll border-b border-border bg-card/60"
    >
      <div className="container flex gap-1 px-4 md:px-6">
        {SECTIONS.map((s) => (
          <NavLink
            key={s.path}
            to={s.path}
            end={s.path === "/"}
            title={t(`research.corruption.nav.${s.key}Blurb`, s.blurb)}
            className={({ isActive }) =>
              cn(
                "whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )
            }
          >
            {t(`research.corruption.nav.${s.key}`, s.label)}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function Layout() {
  const { t } = useTranslation();
  const { dataset, generatedAt } = REPORT.provenance;
  const snapshot = dataset.cases?.modified;

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTarget />
      {/* The wordmark gets its own band. Sharing a line with the title made the
          logo read as part of the headline rather than as whose publication this is. */}
      <div className="border-b border-border bg-[hsl(var(--surface))]">
        <div className="container flex items-center justify-between gap-4 px-4 py-3 md:px-6">
          <a
            href="https://jawafdehi.org"
            className="inline-flex items-center gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <img
              src="/assets/logo.svg"
              alt={t("research.corruption.site.logoAlt", "Jawafdehi")}
              className="h-7 w-auto md:h-8"
            />
            <span className="border-l border-border pl-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t("research.corruption.site.eyebrow2", "Research")}
            </span>
          </a>
          <LanguageToggle />
        </div>
      </div>

      <header className="border-b border-border">
        <div className="container px-4 py-7 md:px-6 md:py-9">
          <h1 className="max-w-4xl font-display text-2xl font-bold leading-tight tracking-tight md:text-[2rem]">
            {t(
              "research.corruption.site.title2",
              "How Nepal's accountability system works, and where it leaks",
            )}
          </h1>
          {/* What is in the research, not what Jawafdehi is — that is the section
              below. A reader arriving here wants to know what they can find out. */}
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            {t(
              "research.corruption.site.lede4",
              "Fourteen years of CIAA and court records, read together: how far a corruption complaint gets, how long each stage takes, what the courts do with the cases that reach them, and which decisions along the way are made without a published reason.",
            )}
          </p>
        </div>
      </header>

      <SectionNav />

      <main className="container flex-1 px-4 py-8 md:px-6 md:py-12">
        <Suspense fallback={<SectionFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t border-border bg-card/60">
        <div className="container space-y-2 px-4 py-8 text-xs leading-5 text-muted-foreground md:px-6">
          <p>
            {t(
              "research.corruption.footer.snapshot",
              "Court register snapshot {{snapshot}} · page generated {{generated}}. Every number on this site is derived from the published dataset rather than entered by hand.",
              {
                snapshot: snapshot ?? "—",
                generated: generatedAt.slice(0, 10),
              },
            )}
          </p>
          <p>
            {t(
              "research.corruption.footer.pack",
              "Reproducible data pack and notebook:",
            )}{" "}
            <a
              className="underline hover:text-foreground"
              href={CITATIONS.researchPack}
            >
              github.com/Jawafdehi/corruption-research
            </a>{" "}
            · {t("research.corruption.footer.records", "Source records:")}{" "}
            <a
              className="underline hover:text-foreground"
              href={CITATIONS.courtRecords}
            >
              jawafdehi.org
            </a>
          </p>
          {/* Split around the <strong> so the emphasis survives translation. */}
          <p>
            {t(
              "research.corruption.footer.licence",
              "© Jawafdehi Initiative. Data and text licensed CC BY-NC 4.0. Counts are of",
            )}{" "}
            <strong className="font-semibold text-foreground">
              {t(
                "research.corruption.footer.casesNotPeople",
                "cases, never of people",
              )}
            </strong>{" "}
            {t(
              "research.corruption.footer.licenceEnd",
              "— the court records one verdict per case.",
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}
