// The site's sections, shared by the report pages' nav (Layout) and the launch home
// page's "read the full report" links (home/report-links.ts). Kept free of React so the
// home page can import it without pulling in the app.

/**
 * One route per section. The split is deliberate: these pages are written to be
 * lifted into the jawafdehi.org SPA, where the research will be arranged as
 * sections anyway — so each one is already a self-contained page component that
 * reads from `@/data/research-corruption` and takes no props.
 *
 * `label`/`blurb` are the English source copy and are handed to `t()` as the
 * default at the point of use — the same `t("key", "English default")` shape as
 * every other string on the site, so the nav translates through one mechanism
 * rather than a second one. `key` names the pair: `…nav.<key>` / `…nav.<key>Blurb`.
 */
export const SECTIONS = [
  { path: "/", key: "home", label: "Home", blurb: "Where accountability leaks, at a glance" },
  { path: "/highlights", key: "highlights", label: "Highlights", blurb: "What the research found" },
  { path: "/report", key: "report", label: "Report", blurb: "Full report, stage by stage" },
  { path: "/investigation", key: "investigation", label: "Investigation", blurb: "Complaint to charge" },
  { path: "/prosecution", key: "prosecution", label: "Prosecution", blurb: "What gets charged" },
  { path: "/court-outcomes", key: "courtOutcomes", label: "Court outcomes", blurb: "What the court decides" },
  { path: "/appeals", key: "appeals", label: "Appeals", blurb: "What survives the Supreme Court" },
  { path: "/method", key: "method", label: "Method", blurb: "Sources, limits and provenance" },
] as const;
