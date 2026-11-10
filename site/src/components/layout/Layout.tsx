import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { SECTIONS } from "@/sections";
import { UnreviewedBadge } from "@/components/layout/LanguageToggle";
import { Skeleton } from "@/components/ui/skeleton";
// The site header and footer: the same component as on the home page (copied in from the
// design mockup by scripts/sync-home.sh). It sets window.JWHeader.
import "@/home/site-header.js";
import "@/home/site-header.css";
import { CITATIONS, REPORT } from "@/data/research-corruption";

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

/**
 * "<page> · Where accountability leaks · Jawafdehi Initiative", in the active language,
 * so a report page reads as part of the same publication as the home page in a tab,
 * a bookmark or a shared link.
 */
function DocumentTitle() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const section = SECTIONS.find((s) => s.path !== "/" && pathname.startsWith(s.path));

  useEffect(() => {
    const parts = [
      t("research.corruption.doc.title", "Where accountability leaks"),
      t("research.corruption.doc.site", "Jawafdehi Initiative"),
    ];
    if (section) parts.unshift(t(`research.corruption.nav.${section.key}`, section.label));
    document.title = parts.join(" · ");
  }, [t, section]);

  return null;
}

type HeaderApi = {
  mount: (el: HTMLElement, o: { lang: string; path: string; base: string; inSite: boolean; onLang: (l: string) => void }) => void;
  TAGLINE: string;
};
const headerApi = () => (window as unknown as { JWHeader: HeaderApi }).JWHeader;

/**
 * The site header: logo and name, the report sections, English | नेपाली. On phones the
 * sections sit behind a ☰ button (a full-screen sheet); the language toggle stays visible.
 * It is the home page's own header component (home/site-header.js), mounted here, so every
 * page of the site has the same header.
 */
function SiteHeader() {
  const ref = useRef<HTMLElement>(null);
  const { i18n, language } = useTranslation();
  const { pathname } = useLocation();
  useEffect(() => {
    if (!ref.current) return;
    headerApi().mount(ref.current, {
      lang: language,
      path: pathname,
      base: import.meta.env.BASE_URL,
      inSite: true,
      onLang: (l) => void i18n.changeLanguage(l as "en" | "ne"),
    });
  }, [i18n, language, pathname]);
  return <header ref={ref} className="jw-hd" />;
}

export function Layout() {
  const { t } = useTranslation();
  const { dataset, generatedAt } = REPORT.provenance;
  const snapshot = dataset.cases?.modified;

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTarget />
      <DocumentTitle />
      <SiteHeader />
      <UnreviewedBadge />

      <header className="border-b border-border">
        <div className="container px-4 py-7 md:px-6 md:py-9">
          <h1 className="max-w-4xl font-display text-2xl font-bold leading-tight tracking-tight md:text-[2rem]">
            {t(
              "research.corruption.site.title2",
              "How Nepal's accountability system works, and where it leaks",
            )}
          </h1>
        </div>
      </header>

      <main className="container flex-1 px-4 py-8 md:px-6 md:py-12">
        <Suspense fallback={<SectionFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="jw-foot">
        <div className="in">
          <img
            src={`${import.meta.env.BASE_URL}home/brand/jawafdehi-logo-white-for-dark-bg.svg`}
            alt={t("research.corruption.doc.site", "Jawafdehi Initiative")}
            width={75}
            height={34}
          />
          <div>
            <p className="tag" lang="ne">
              {headerApi().TAGLINE}
            </p>
            <small>
              {t(
                "research.corruption.footer.byline",
                "A research report by Jawafdehi Initiative · jawafdehi.org",
              )}
            </small>
            <small>
              {t(
                "research.corruption.footer.snapshot",
                "Court register snapshot {{snapshot}} · page generated {{generated}}. Every number on this site is derived from the published dataset rather than entered by hand.",
                {
                  snapshot: snapshot ?? "—",
                  generated: generatedAt.slice(0, 10),
                },
              )}
            </small>
            <small>
              {t(
                "research.corruption.footer.pack",
                "Reproducible data pack and notebook:",
              )}{" "}
              <a className="underline" href={CITATIONS.researchPack}>
                github.com/Jawafdehi/corruption-research
              </a>{" "}
              · {t("research.corruption.footer.records", "Source records:")}{" "}
              <a className="underline" href={CITATIONS.courtRecords}>
                jawafdehi.org
              </a>
            </small>
            {/* Split around the <strong> so the emphasis survives translation. */}
            <small>
              {t(
                "research.corruption.footer.licence",
                "© Jawafdehi Initiative. Data and text licensed CC BY-NC 4.0. Counts are of",
              )}{" "}
              <strong className="font-semibold text-white">
                {t(
                  "research.corruption.footer.casesNotPeople",
                  "cases, never of people",
                )}
              </strong>{" "}
              {t(
                "research.corruption.footer.licenceEnd",
                "— the court records one verdict per case.",
              )}
            </small>
          </div>
        </div>
      </footer>
    </div>
  );
}
