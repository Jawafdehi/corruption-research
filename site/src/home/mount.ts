import { HOME_MARKUP } from "./markup.generated";
import { HOME_VERSION } from "./version.generated";
import { mountReportLinks } from "./report-links";

/**
 * Boot the launch home page on "/".
 *
 * The page is the design mockup's own files, served as-is from public/home/ (copied
 * there by scripts/sync-home.sh, never edited here). Those scripts are classic IIFEs
 * that read window.JW, find their elements by id, and install document-level
 * listeners, so they run exactly once per page load, in order, as plain <script>
 * tags, after their stylesheets have applied (app.js measures the layout on load).
 */
const asset = (name: string) => `${import.meta.env.BASE_URL}home/${name}?v=${HOME_VERSION}`;

const STYLES = ["base.css", "app.css"];
const SCRIPTS = ["findings.js", "copy.js", "ne.js", "evidence.js", "ui.js", "app.js"];

function addStyle(name: string) {
  return new Promise<void>((resolve) => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = asset(name);
    l.onload = l.onerror = () => resolve();
    document.head.append(l);
  });
}

function addScript(name: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = asset(name);
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`home: could not load ${name}`));
    document.body.append(s);
  });
}

export async function mountHome() {
  // Links into the old home page's Highlights cards (/#finding-…) now live on /highlights.
  const h = window.location.hash;
  if (h === "#headline-findings" || h.startsWith("#finding-")) {
    window.location.replace(`${import.meta.env.BASE_URL}highlights${window.location.search}${h}`);
    return;
  }

  document.getElementById("root")?.remove();
  document.body.insertAdjacentHTML("afterbegin", HOME_MARKUP);
  mountReportLinks();

  // The one launch flag: VITE_JW_LAUNCH=1 (npm run build:launch) drops the "draft" line and
  // the "draft" in citations. JW_IN_SITE makes evidence links stay on this site.
  const w = window as unknown as { JW_LAUNCH?: boolean; JW_IN_SITE?: boolean; JW_BASE?: string };
  w.JW_BASE = import.meta.env.BASE_URL;
  w.JW_LAUNCH = import.meta.env.VITE_JW_LAUNCH === "1";
  w.JW_IN_SITE = true;

  await Promise.all(STYLES.map(addStyle));
  // async=false keeps execution in insertion order while the files download in parallel.
  await Promise.all(SCRIPTS.map(addScript));
}
