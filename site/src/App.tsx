import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";

// Split per route. The charting library is most of the bundle and the landing
// section does not use it, so loading it with the first chart rather than with
// the page keeps the opening view light. The Suspense boundary lives inside
// `Layout`, around the outlet, so the header and section nav stay on screen
// while a section's chunk arrives.
const Highlights = lazy(() => import("@/pages/Highlights"));
const Investigation = lazy(() => import("@/pages/Investigation"));
const Prosecution = lazy(() => import("@/pages/Prosecution"));
const CourtOutcomes = lazy(() => import("@/pages/CourtOutcomes"));
const Appeals = lazy(() => import("@/pages/Appeals"));
const Method = lazy(() => import("@/pages/Method"));

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
  { path: "/", key: "highlights", label: "Highlights", blurb: "What the research found" },
  { path: "/investigation", key: "investigation", label: "Investigation", blurb: "Complaint to charge" },
  { path: "/prosecution", key: "prosecution", label: "Prosecution", blurb: "What gets charged" },
  { path: "/court-outcomes", key: "courtOutcomes", label: "Court outcomes", blurb: "What the court decides" },
  { path: "/appeals", key: "appeals", label: "Appeals", blurb: "What survives the Supreme Court" },
  { path: "/method", key: "method", label: "Method", blurb: "Sources, limits and provenance" },
] as const;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Highlights />} />
        <Route path="investigation" element={<Investigation />} />
        <Route path="prosecution" element={<Prosecution />} />
        <Route path="court-outcomes" element={<CourtOutcomes />} />
        <Route path="appeals" element={<Appeals />} />
        <Route path="method" element={<Method />} />
        {/* The pre-redesign paths, kept so existing links and bookmarks still land.
            /gaps is among them now: its six findings moved into the stage each one
            belongs to, so the nearest thing to the old page is the stage list itself. */}
        <Route path="gaps" element={<Navigate to="/investigation" replace />} />
        <Route path="outcomes" element={<Navigate to="/court-outcomes" replace />} />
        <Route path="over-time" element={<Navigate to="/court-outcomes" replace />} />
        <Route path="benches" element={<Navigate to="/court-outcomes" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
