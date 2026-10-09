import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";

// Split per route. The charting library is most of the bundle and the landing
// section does not use it, so loading it with the first chart rather than with
// the page keeps the opening view light. The Suspense boundary lives inside
// `Layout`, around the outlet, so the header and section nav stay on screen
// while a section's chunk arrives.
const Overview = lazy(() => import("@/pages/Overview"));
const Outcomes = lazy(() => import("@/pages/Outcomes"));
const OverTime = lazy(() => import("@/pages/OverTime"));
const Benches = lazy(() => import("@/pages/Benches"));
const Appeals = lazy(() => import("@/pages/Appeals"));
const Method = lazy(() => import("@/pages/Method"));

/**
 * One route per section. The split is deliberate: these pages are written to be
 * lifted into the jawafdehi.org SPA, where the research will be arranged as
 * sections anyway — so each one is already a self-contained page component that
 * reads from `@/data/research-corruption` and takes no props.
 */
export const SECTIONS = [
  { path: "/", label: "Overview", blurb: "Where accountability is lost" },
  { path: "/outcomes", label: "Outcomes", blurb: "What the court decides" },
  { path: "/over-time", label: "Over time", blurb: "How the docket moved" },
  { path: "/benches", label: "Benches", blurb: "Who decides, and how fast" },
  { path: "/appeals", label: "Appeals", blurb: "What survives the Supreme Court" },
  { path: "/method", label: "Method", blurb: "Sources, limits and provenance" },
] as const;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="outcomes" element={<Outcomes />} />
        <Route path="over-time" element={<OverTime />} />
        <Route path="benches" element={<Benches />} />
        <Route path="appeals" element={<Appeals />} />
        <Route path="method" element={<Method />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
