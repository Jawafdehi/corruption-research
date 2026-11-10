import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";
import { HomeReload } from "@/home/HomeReload";

export { SECTIONS } from "@/sections";

// Split per route. The charting library is most of the bundle and the landing
// section does not use it, so loading it with the first chart rather than with
// the page keeps the opening view light. The Suspense boundary lives inside
// `Layout`, around the outlet, so the header and section nav stay on screen
// while a section's chunk arrives.
const Highlights = lazy(() => import("@/pages/Highlights"));
const Report = lazy(() => import("@/pages/Report"));
const Investigation = lazy(() => import("@/pages/Investigation"));
const Prosecution = lazy(() => import("@/pages/Prosecution"));
const CourtOutcomes = lazy(() => import("@/pages/CourtOutcomes"));
const Appeals = lazy(() => import("@/pages/Appeals"));
const Method = lazy(() => import("@/pages/Method"));
const Privacy = lazy(() => import("@/pages/Privacy"));


export default function App() {
  return (
    <Routes>
      {/* "/" is the launch home page. It is not a React page: main.tsx boots it on a
          full page load, so an in-app navigation to "/" reloads into it. */}
      <Route index element={<HomeReload />} />
      <Route element={<Layout />}>
        <Route path="highlights" element={<Highlights />} />
        <Route path="report" element={<Report />} />
        <Route path="investigation" element={<Investigation />} />
        <Route path="prosecution" element={<Prosecution />} />
        <Route path="court-outcomes" element={<CourtOutcomes />} />
        <Route path="appeals" element={<Appeals />} />
        <Route path="method" element={<Method />} />
        <Route path="privacy" element={<Privacy />} />
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
