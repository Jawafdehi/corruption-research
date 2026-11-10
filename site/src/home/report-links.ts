import { SECTIONS } from "@/sections";
import "./report-links.css";

/**
 * "Read the full report": links from the launch home page into the report pages.
 *
 * The home page (public/home/, synced from the design mockup) shares the site header
 * (home/site-header.js) with the report pages; this block, at the end of the page, is the
 * second way into the rest of the site, with a line on what each section holds. It sits just before the page's footer inside #app and follows the page's language
 * through <html lang>, which the page's own toggle sets.
 *
 * Plain <a href>s, deliberately: each report page is a full page load into the React
 * app, which leaves the home page's scripts and listeners behind.
 */
// Nepali labels. "appeals", "method" and the aria label are copied from locales/ne.ts
// (research.corruption.nav.*); that catalogue is not imported because it is 70 kB and
// this page needs eight strings. The rest have no entry there yet. Like ne.ts, these
// are unreviewed.
const NE: Record<string, [string, string]> = {
  highlights: ["मुख्य निष्कर्ष", ""],
  report: ["प्रतिवेदन", "पूरा प्रतिवेदन, चरण-चरण"],
  investigation: ["अनुसन्धान", ""],
  prosecution: ["अभियोजन", ""],
  courtOutcomes: ["अदालतको फैसला", ""],
  appeals: ["पुनरावेदन", "सर्वोच्चमा के टिक्छ"],
  method: ["विधि", "स्रोत, सीमा र प्रमाण"],
};
const COPY = {
  heading: { en: "Read the full report", ne: "पूरा प्रतिवेदन पढ्नुहोस्" },
  aria: { en: "Report sections", ne: "प्रतिवेदनका खण्डहरू" },
};

// The report pages keep their language in a different key from the home page.
const SPA_LANG_KEY = "jawafdehi.research.lang";

const lang = (): "en" | "ne" => (document.documentElement.lang === "ne" ? "ne" : "en");
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function render(nav: HTMLElement) {
  const l = lang();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const items = SECTIONS.filter((s) => s.path !== "/").map((s) => {
    const [label, blurb] = l === "ne" ? (NE[s.key] ?? [s.label, ""]) : [s.label, s.blurb];
    return `<li><a href="${base}${s.path}"${l === "ne" ? ' lang="ne"' : ""}><b>${esc(label)}</b>${blurb ? `<span>${esc(blurb)}</span>` : ""}</a></li>`;
  });
  nav.setAttribute("aria-label", COPY.aria[l]);
  nav.innerHTML = `<div class="in"><h2>${esc(COPY.heading[l])}</h2><ul>${items.join("")}</ul></div>`;
}

/** A language chosen on the home page carries over to the report pages. */
function rememberLang() {
  try {
    window.localStorage.setItem(SPA_LANG_KEY, lang());
  } catch {
    // Storage blocked: the report pages just open in their own default language.
  }
}

export function mountReportLinks() {
  const nav = document.createElement("nav");
  nav.className = "jw-reportlinks";
  const foot = document.querySelector("footer[data-brandfoot]");
  if (foot) foot.before(nav);
  else (document.getElementById("app") ?? document.body).append(nav);
  render(nav);
  let last = lang();
  new MutationObserver(() => {
    if (lang() === last) return;
    last = lang();
    render(nav);
    rememberLang();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });
}
