import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";

import { SECTIONS } from "@/App";
import { Skeleton } from "@/components/ui/skeleton";
import { CITATIONS, REPORT } from "@/data/research-corruption";
import { cn } from "@/lib/utils";

/** Holds space while a lazily-loaded section arrives, so the page does not jump. */
const SectionFallback = () => (
  <div className="space-y-4" aria-busy="true" aria-label="Loading section">
    <Skeleton className="h-9 w-2/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-64 w-full" />
  </div>
);

/** Jump back to the top when the section changes; otherwise a deep scroll carries over. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function SectionNav() {
  return (
    <nav aria-label="Report sections" className="chart-scroll border-b border-border bg-card/60">
      <div className="container flex gap-1 px-4 md:px-6">
        {SECTIONS.map((s) => (
          <NavLink
            key={s.path}
            to={s.path}
            end={s.path === "/"}
            className={({ isActive }) =>
              cn(
                "whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )
            }
          >
            {s.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function Layout() {
  const { dataset, generatedAt } = REPORT.provenance;
  const snapshot = dataset.cases?.modified;

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <header className="border-b border-border">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Jawafdehi Research
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
            Corruption Accountability
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            What happens to a corruption complaint in Nepal — from the Commission's intake desk to a
            verdict at the Special Court, and on to the Supreme Court. Every figure is counted from
            the court's own criminal register and the Commission's published annual reports.
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
            Court register snapshot {snapshot ?? "—"} · page generated{" "}
            {generatedAt.slice(0, 10)}. Every number on this site is derived from the
            published dataset rather than entered by hand.
          </p>
          <p>
            Reproducible data pack and notebook:{" "}
            <a className="underline hover:text-foreground" href={CITATIONS.researchPack}>
              github.com/Jawafdehi/corruption-research
            </a>{" "}
            · Source records:{" "}
            <a className="underline hover:text-foreground" href={CITATIONS.courtRecords}>
              jawafdehi.org
            </a>
          </p>
          <p>
            © Jawafdehi Initiative. Data and text licensed CC BY-NC 4.0. Counts are of{" "}
            <strong className="font-semibold text-foreground">cases, never of people</strong> — the
            court records one verdict per case.
          </p>
        </div>
      </footer>
    </div>
  );
}
