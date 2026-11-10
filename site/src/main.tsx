// Two entry points behind one index.html.
//
// "/" is the launch home page: the vanilla HTML/CSS/JS page from the design work
// (copied in by scripts/sync-home.sh), mounted by home/mount.ts. It owns the whole
// viewport and its own header and footer, and loads neither React nor the site's
// Tailwind stylesheet, so neither can restyle it.
//
// Every other path is the report: the React app in spa.tsx, unchanged.
// Both use the self-hosted fonts in fonts.ts.
import "./fonts";

const base = import.meta.env.BASE_URL;
const path = window.location.pathname;
const isHome = path === base || path === base.replace(/\/$/, "") || path === `${base}index.html`;

if (isHome) {
  void import("./home/mount").then((m) => m.mountHome());
} else {
  void import("./spa");
}

export {};
