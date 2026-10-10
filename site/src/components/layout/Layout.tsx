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

/** Jump back to the top when the section changes; otherwise a deep scroll carries over. */
function ScrollToTop() {
  const { pathname } = useLocation();
  // Block body on purpose: a concise arrow would return whatever `scrollTo`
  // returns, and React treats a non-undefined return as the cleanup function.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
      <ScrollToTop />
      <header className="border-b border-border">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {t("research.corruption.site.eyebrow", "Jawafdehi Research")}
            </p>
            <LanguageToggle />
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
            {t("research.corruption.site.title", "Where Nepal's corruption accountability actually leaks")}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {t(
              "research.corruption.site.lede",
              "Thousands of complaints. Hundreds of prosecutions. Years of court proceedings. But how many cases actually lead to convictions, how many end in acquittals, and how many remain unresolved? Following cases from the CIAA to the Special Court and Supreme Court, this research identifies where the gaps lie at each stage of Nepal's corruption accountability system.",
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
              { snapshot: snapshot ?? "—", generated: generatedAt.slice(0, 10) },
            )}
          </p>
          <p>
            {t("research.corruption.footer.pack", "Reproducible data pack and notebook:")}{" "}
            <a className="underline hover:text-foreground" href={CITATIONS.researchPack}>
              github.com/Jawafdehi/corruption-research
            </a>{" "}
            · {t("research.corruption.footer.records", "Source records:")}{" "}
            <a className="underline hover:text-foreground" href={CITATIONS.courtRecords}>
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
              {t("research.corruption.footer.casesNotPeople", "cases, never of people")}
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
