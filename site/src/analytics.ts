/**
 * Analytics: page views and events, sent to Google Analytics 4 (damo, 11 November: the same
 * property as jawafdehi.org, G-ZDV84KYJDJ; reports split by hostname).
 *
 * One thin wrapper: track(name, params) calls gtag("event", …) when GA is on and does
 * nothing otherwise. The home page's own scripts (public/home/, from the design mockup) call
 * the same function through window.jwTrack.
 *
 * - gtag.js is loaded on page load (no consent banner, damo's decision) only in the launch
 *   build (VITE_JW_LAUNCH=1), only when VITE_GA_ID is set (empty means off), and only on the
 *   public host (VITE_GA_HOSTS, default research.jawafdehi.org): a copy of the launch build
 *   served anywhere else, the review build and local dev send nothing.
 * - Page views are GA's own: the config's first page_view, then Enhanced Measurement's
 *   history-change page views for the report pages' route changes. We never send a manual
 *   page_view, so a route change counts once. The home page's language and view switches
 *   and the drawers' #f= links change only the query or the hash; those are not page views
 *   (see quiet() below).
 * - ?debug_analytics=1: dry run. Nothing is loaded or sent; every event (and each page view
 *   GA would count) is logged to the console and kept in window.__jwEvents, in any build.
 *
 * Params are small and fixed: keys, labels of the site's own buttons and links (≤60
 * characters), paths and hosts. Never personal data or anything a reader typed. GA limits:
 * event names ≤40 characters, ≤25 params per event, values ≤100 characters.
 */
type Val = string | number | boolean;
type Props = Record<string, Val | null | undefined>;
type Gtag = (...a: unknown[]) => void;
type W = Window & { dataLayer?: unknown[]; gtag?: Gtag; jwTrack?: (n: string, p?: Props) => void; __jwEvents?: { name: string; props: Record<string, Val> }[] };
const w = window as W;

const env = import.meta.env;
const GA_ID = ((env.VITE_GA_ID as string | undefined) ?? "").trim();
const HOSTS = ((env.VITE_GA_HOSTS as string | undefined) || "research.jawafdehi.org").split(",").map((h) => h.trim());
const DEBUG = new URLSearchParams(location.search).get("debug_analytics") === "1";
const ON = !DEBUG && env.VITE_JW_LAUNCH === "1" && /^G-[A-Z0-9]+$/.test(GA_ID) && HOSTS.includes(location.hostname);

const lang = () => (document.documentElement.lang === "ne" ? "ne" : "en");
const clip = (s: string, n = 60) => {
  const x = s.replace(/\s+/g, " ").trim();
  return x.length > n ? `${x.slice(0, n - 1)}…` : x;
};

function clean(p: Props = {}): Record<string, Val> {
  const o: Record<string, Val> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v == null || v === "") continue;
    if (Object.keys(o).length >= 25) break;
    o[k] = typeof v === "string" ? clip(v, 100) : v;
  }
  return o;
}

export function track(name: string, props?: Props) {
  const data = clean(props);
  if (DEBUG) {
    (w.__jwEvents ??= []).push({ name, props: data });
    console.info("[analytics]", name, data);
    return;
  }
  if (ON && w.gtag) w.gtag("event", name.slice(0, 40), data);
}

/**
 * Enhanced Measurement counts a page view on every history.pushState / replaceState that
 * changes the query (it ignores the hash). The site changes only the query (?lang=, ?view=)
 * or the hash (#f=<finding>, the menu) when a reader switches language or view or opens a
 * drawer: those are not new pages. So a call that keeps the path goes straight to the
 * browser's own History method, which Enhanced Measurement does not see; a change of path
 * (a report route) goes through its wrapper and counts once. Back and forward between two
 * such entries are not counted either (checked against the live gtag.js, test/analytics.mjs).
 *
 * The property is an accessor, so this stays the outermost wrapper whatever gtag.js
 * assigns to history.pushState later; `depth` stops the loop back through it.
 * (GA's ga-disable-<id> flag does not stop these page views; that was tried first.)
 */
function quiet() {
  let depth = 0;
  for (const m of ["pushState", "replaceState"] as const) {
    const native = History.prototype[m];
    let inner: History["pushState"] = native;
    const samePath = (url: unknown) => {
      if (url == null) return true;
      try { return new URL(String(url), location.href).pathname === location.pathname; } catch { return true; }
    };
    const wrapped = function (this: History, ...a: Parameters<History["pushState"]>) {
      if (depth || samePath(a[2])) return native.apply(this, a);
      depth++;
      try { return inner.apply(this, a); } finally { depth--; }
    };
    Object.defineProperty(history, m, { configurable: true, get: () => wrapped, set: (f: History["pushState"]) => { inner = f; } });
  }
}

function loadGA() {
  quiet();
  w.dataLayer = w.dataLayer || [];
  // gtag must push the literal `arguments` object (as on jawafdehi.org, src/lib/ga.ts).
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID, { anonymize_ip: true });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.append(s);
}

/* ---------- clicks: one listener for every button and link on every page ---------- */
const AREAS: [string, string][] = [
  [".jw-drawer", "drawer"],
  ["#jw-hd-sheet", "menu"],
  [".jw-hd", "header"],
  ["footer, [data-brandfoot]", "footer"],
  ["#leaks", "leaks"],
  [".jw-reportlinks", "report"],
  ["#end", "end"],
  [".card, .row3", "card"],
  ["#intro", "intro"],
];
function areaOf(el: Element) {
  for (const [sel, name] of AREAS) if (el.closest(sel)) return name;
  if (el.closest("#mid")) return document.body.dataset.page === "pipe" ? "pipeline" : "funnel";
  if (el.closest("main")) return "report";
  return "page";
}
const REPORT_PATHS = /^\/(highlights|report|investigation|prosecution|court-outcomes|appeals|method|privacy)(\/|$)/;
const viewName = (v?: string) => (v === "pipe" ? "pipeline" : v === "live" ? "funnel" : v);
const findingInHash = () => location.hash.match(/^#f=(\w+)/)?.[1];

function onClick(e: MouseEvent) {
  const el = (e.target as Element | null)?.closest?.("a[href], button, [role='button'], summary");
  if (!el) return;
  const area = areaOf(el);
  const label = clip((el as HTMLElement).innerText || el.getAttribute("aria-label") || "");
  const page = location.pathname;
  let href: string | undefined;
  if (el instanceof HTMLAnchorElement) {
    const u = new URL(el.href, location.href);
    if (u.protocol === "mailto:" || u.protocol === "tel:") href = u.protocol.slice(0, -1);
    else if (u.origin === location.origin) href = u.pathname;
    else {
      href = u.host;
      // GA's own outbound "click" (link_domain, link_url, outbound) is sent by Enhanced
      // Measurement; sending it here too would count each one twice. The dry run shows it.
      if (DEBUG) track("click", { link_domain: u.host, link_url: `${u.origin}${u.pathname}`, outbound: true, sent_by: "enhanced_measurement" });
    }
    // From the home page into the report pages ("Read the full report", drawers' links).
    if (page === "/" && u.origin === location.origin && REPORT_PATHS.test(u.pathname)) track("report_click", { href: u.pathname, area });
    // A finding's drawer, to its section of the full report.
    const k = el.closest(".jw-drawer") && findingInHash();
    if (k) track("learn_more", { finding: k, href: u.pathname });
  }
  // Every click on a button or link, with where it is on the page.
  track("ui_click", { label, href, area, lang: lang() });

  // Read the state before the page's own handlers change it (this listener runs first).
  const b = el as HTMLElement;
  if (b.matches("button[data-lang]") && b.dataset.lang !== lang()) track("lang_switch", { from: lang(), to: b.dataset.lang });
  if (b.matches("button[data-view]")) {
    const from = document.querySelector<HTMLElement>("button[data-view][aria-pressed='true']")?.dataset.view;
    if (from && from !== b.dataset.view) track("view_switch", { from: viewName(from), to: viewName(b.dataset.view) });
  }
  if (b.matches(".jw-hd-menu") && b.getAttribute("aria-expanded") !== "true") track("menu_open", {});
  const act = b.closest(".jw-drawer") && b.dataset.a;
  if (act) {
    const k = findingInHash();
    // GA's recommended "share", with how the finding was shared.
    const method = { link: "copy_link", cite: "copy_citation", share: "native_share" }[act];
    if (method) track("share", { method, content_type: "finding", item_id: k, finding: k });
  }
}

/* ---------- home page: how far down the reader gets ---------- */
function scrollDepth() {
  const seen = new Set<number>();
  let raf = 0;
  const check = () => {
    raf = 0;
    const de = document.documentElement, h = de.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    const p = (window.scrollY / h) * 100;
    for (const d of [25, 50, 75, 100]) if (p >= d - (d === 100 ? 1 : 0) && !seen.has(d)) { seen.add(d); track("scroll_depth", { percent: d, lang: lang() }); }
  };
  window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(check); }, { passive: true });
}

/* ---------- report pages: each <h2> section that comes into view, once per page view ---------- */
// A stable id for a heading, the same in English and Nepali: its own anchor id, else the
// nearest enclosing anchor id, numbered when that block holds more than one <h2> (the
// report's markdown parts). Never the heading's text, which changes with the language.
function sectionId(h: Element): string {
  if (h.id) return h.id;
  const box = h.parentElement?.closest("main [id]");
  if (!box) return `h2-${Array.from(document.querySelectorAll<Element>("main h2")).indexOf(h) + 1}`;
  const n = Array.from(box.querySelectorAll<Element>("h2")).indexOf(h);
  return n > 0 ? `${box.id}-${n + 1}` : box.id;
}

function sectionViews() {
  let path = "", seen = new Set<string>(), watched = new WeakSet<Element>();
  const see = (h: Element) => {
    io.unobserve(h);
    const id = sectionId(h);
    if (!id || seen.has(id)) return;
    seen.add(id);
    track("section_view", { section: id, lang: lang() });
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) see(e.target); }), { rootMargin: "0px 0px -30% 0px" });
  let t = 0;
  const scan = () => {
    t = 0;
    if (location.pathname !== path) { path = location.pathname; seen = new Set(); watched = new WeakSet(); io.disconnect(); }
    document.querySelectorAll("main h2").forEach((h) => { if (!watched.has(h)) { watched.add(h); io.observe(h); } });
  };
  new MutationObserver(() => { if (!t) t = window.setTimeout(scan, 250); }).observe(document.body, { childList: true, subtree: true });
  // A section at the very end of a page may never reach the upper 70% of the screen: at the
  // bottom of the page, every heading on screen counts.
  let r2 = 0;
  window.addEventListener("scroll", () => {
    if (r2) return;
    r2 = requestAnimationFrame(() => {
      r2 = 0;
      if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 4) return;
      document.querySelectorAll("main h2").forEach((h) => { if (h.getBoundingClientRect().top < window.innerHeight) see(h); });
    });
  }, { passive: true });
  window.addEventListener("popstate", () => window.setTimeout(scan, 250));
  scan();
}

/* ---------- dry run: show the page views GA would count (a change of path) ---------- */
function debugPageViews() {
  let last = "";
  const pv = () => { if (location.pathname !== last) { last = location.pathname; track("pageview", { path: last, lang: lang() }); } };
  for (const m of ["pushState", "replaceState"] as const) {
    const orig = history[m].bind(history);
    history[m] = (...a: Parameters<History["pushState"]>) => { orig(...a); pv(); };
  }
  window.addEventListener("popstate", pv);
  pv();
}

export function initAnalytics(isHome: boolean) {
  w.jwTrack = track;
  if (DEBUG) debugPageViews();
  // Written so that a build without VITE_GA_ID drops loadGA(), and Google's address with it.
  if (import.meta.env.VITE_GA_ID && ON) loadGA();
  if (!DEBUG && !ON) return; // off: no listeners at all
  document.addEventListener("click", onClick, true);
  if (isHome) scrollDepth();
  else sectionViews();
}
