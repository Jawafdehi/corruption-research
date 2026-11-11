// Share cards (Open Graph / Twitter), 1200 x 630: writes og/build/<name>.html, one self-contained page
// per card (fonts and logo inlined, so the renderer needs no server), and og/cards.json, the head
// text for every route (title, description, image alt), used by og/heads.mjs after `vite build`.
//
// Same approach as justice.jawafdehi.org (services/justice-performance-summary/site/og_cards.py):
// paper page, the Jawafdehi logo with the sub-brand lockup ("जवाफदेही | अनुसन्धान RESEARCH"),
// a crimson kicker, a navy title and one figure. Every figure and sentence comes from the home
// page's data and copy layers (public/home/findings.js, copy.js, ne.js, evidence.js, app.js);
// nothing here is typed by hand except the labels in L below, which are in NEPALI.md.
//
//   node og/cards.mjs            then  python3 og/render_neo.py   (PNGs into public/og/)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import vm from "node:vm";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOME = join(SITE, "public/home");
const OUT = join(SITE, "og/build");
mkdirSync(OUT, { recursive: true });

// --- data and copy, exactly as the home page reads them ---------------------------------------
const ctx = { window: {}, console };
for (const f of ["findings.js", "copy.js", "ne.js", "evidence.js"]) vm.runInNewContext(readFileSync(join(HOME, f), "utf8"), ctx);
const JW = ctx.window.JW, F = JW.funnel, V = F.values;
const APP = readFileSync(join(HOME, "app.js"), "utf8");
const tpl = (start) => { const m = APP.match(new RegExp('"(' + start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '[^"]*)"')); if (!m) throw new Error("app.js: no template starting " + start); return m[1]; };
const DEV = "०१२३४५६७८९", dev = (s) => String(s).replace(/[0-9]/g, (d) => DEV[d]);
const fill = (s, ne) => s.replace(/\{(\w+)\}/g, (_, k) => { if (!(k in V)) throw new Error("no value " + k); return ne ? dev(V[k]) : V[k]; });
const by = (k) => { const f = JW.findings.find((x) => x.key === k); if (!f || !f.ev) throw new Error("finding " + k + " has no evidence sentence"); return f; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const N = (x, ne) => (ne ? dev(Number(x).toLocaleString("en-IN")) : Number(x).toLocaleString("en-US"));

const S = F.stages.filter((s) => s.count != null); // complaint → … → convictions that stand
const stands = F.split[F.split.length - 1];
if (stands.count !== S[S.length - 1].count) throw new Error("end count and last stage differ");

// Card labels (not sentences). The stage labels are the no-JavaScript block's, shortened.
const L = {
  kicker: { en: "Corruption in Nepal", ne: "नेपालमा भ्रष्टाचार" },
  title: { en: "Where accountability leaks", ne: "जवाफदेहिता कहाँ चुहिन्छ" },
  stage: {
    complaints: { en: "complaints to the CIAA", ne: "अख्तियारमा उजुरी" },
    investigated: { en: "sent for full investigation", ne: "विस्तृत अनुसन्धानमा पठाइएका" },
    charged: { en: "cases filed in court", ne: "अदालतमा दायर मुद्दा" },
    special: { en: "cases with a conviction", ne: "कसुर ठहर भएका मुद्दा" },
    supreme: { en: "convictions that stand", ne: "कायम रहने कसुर ठहर" },
  },
  // The end figure sits alone in the centre, so it still reads when a feed crops the card to a square.
  end: { en: "of complaints end in a conviction that stands after the Supreme Court", ne: "उजुरीमा मात्र सर्वोच्च अदालतपछि पनि कसुर ठहर कायम रहन्छ।" },
  note: {
    en: `CIAA figures for ${V.fy}. ≈ estimated from court records of cases filed since ${V.courtFrom}.`,
    ne: `अख्तियारका अंक आ.व. ${dev(V.fy)} का। ≈ भएका अंक ${dev(V.courtFrom)} देखि दायर मुद्दाका अदालती अभिलेखबाट निकालिएको अनुमान।`,
  },
};

// --- shared head: fonts, colours, the lockup ---------------------------------------------------
const FS = join(SITE, "node_modules/@fontsource");
const font = (fam, file, weight, range) =>
  `@font-face{font-family:"${fam}";src:url(data:font/woff2;base64,${readFileSync(join(FS, file)).toString("base64")}) format("woff2");font-weight:${weight};${range ? "unicode-range:" + range + ";" : ""}}`;
const DEVR = "U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+25CC,U+A830-A839,U+A8E0-A8FF";
const FONTS = [
  font("Vesper Libre", "vesper-libre/files/vesper-libre-latin-500-normal.woff2", 500),
  font("Vesper Libre", "vesper-libre/files/vesper-libre-devanagari-500-normal.woff2", 500, DEVR),
  font("IBM Plex Mono", "ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2", 500),
  font("Noto Sans Devanagari", "noto-sans-devanagari/files/noto-sans-devanagari-latin-400-normal.woff2", 400),
  font("Noto Sans Devanagari", "noto-sans-devanagari/files/noto-sans-devanagari-latin-600-normal.woff2", 600),
  font("Noto Sans Devanagari", "noto-sans-devanagari/files/noto-sans-devanagari-devanagari-400-normal.woff2", 400, DEVR),
  font("Noto Sans Devanagari", "noto-sans-devanagari/files/noto-sans-devanagari-devanagari-600-normal.woff2", 600, DEVR),
].join("\n");
const LOGO = readFileSync(join(HOME, "brand/jawafdehi-logo-navy-for-light-bg.svg")).toString("base64");

const HEAD = `<meta charset="utf-8"><style>${FONTS}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{position:relative;background:#FAFAF7;color:#1F2A37;font-family:"Noto Sans Devanagari",sans-serif;-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.lockup{position:absolute;left:64px;top:44px;display:flex;align-items:center;gap:20px;height:60px}
.lockup img{height:60px;width:auto;display:block}
.lockup .bar{width:5px;height:50px;background:#B5242C}
.lockup .sub{display:flex;flex-direction:column;justify-content:center;color:#0E1F3B;line-height:1}
.lockup .sub .ne{font-size:34px;font-weight:600;line-height:1.05}
.lockup .sub .en{font-size:15px;font-weight:600;letter-spacing:.38em;margin-top:4px}
.kicker{position:absolute;right:64px;top:58px;font-size:26px;line-height:1.3;color:#B5242C;text-align:right}
.title{font-family:"Vesper Libre",serif;font-weight:500;color:#0E1F3B;line-height:1.12}
:lang(ne) .title,.title:lang(ne){line-height:1.35}
.fig{font-family:"IBM Plex Mono",monospace;font-weight:500;color:#0E1F3B;white-space:nowrap}
.lede{font-size:30px;line-height:1.35;color:#1F2A37}
.lede b,.end b{color:#B5242C;font-weight:600}
.note{font-size:24px;line-height:1.3;color:#4B5563}
.rule{position:absolute;left:0;right:0;bottom:0;height:14px;background:#0E1F3B}
.rule::after{content:"";position:absolute;left:0;top:0;bottom:0;width:300px;background:#B5242C}
</style>`;
const lockup = `<div class="lockup"><img src="data:image/svg+xml;base64,${LOGO}" alt=""><span class="bar"></span><span class="sub"><span class="ne" lang="ne">अनुसन्धान</span><span class="en">RESEARCH</span></span></div>`;

// --- the home card: the funnel from the data ------------------------------------------------------
// Heights follow log(count) between the first and the last stage, with a floor, as on the page
// (every stage stays visible and the narrowing reads at a glance); the counts carry the scale.
function funnelSvg() {
  const W = 1072, H = 84, n = S.length, col = W / n, hi = Math.log(S[0].count), lo = Math.log(S[n - 1].count);
  const h = S.map((s) => (0.2 + 0.8 * (Math.log(s.count) - lo) / (hi - lo)) * H);
  const COL = { ciaa: "#1F3A68", court: "#2E4E3F" };
  let shapes = "", drops = "";
  S.forEach((s, i) => {
    const x0 = i * col + 5, x1 = (i + 1) * col - 5, hn = i < n - 1 ? h[i + 1] : h[i] * 0.8;
    shapes += `<path d="M${x0} ${(H - h[i]) / 2}L${x1} ${(H - hn) / 2}L${x1} ${(H + hn) / 2}L${x0} ${(H + h[i]) / 2}Z" fill="${COL[s.inst] || COL.court}"/>`;
    if (i < n - 1) { const cx = (i + 1) * col, y = (H + h[i + 1]) / 2 + 6; // a leak drips between stages
      drops += `<path d="M${cx} ${y}c0 0-7 9-7 13a7 7 0 0 0 14 0c0-4-7-13-7-13z" fill="#B5242C"/>`; }
  });
  const y = (H + h[1]) / 2 + 30;
  return `<svg width="${W}" height="${y}" viewBox="0 0 ${W} ${y}" aria-hidden="true">${shapes}${drops}</svg>`;
}
function homeCard(ne) {
  const lang = ne ? "ne" : "en", t = (o) => o[lang];
  const cols = S.map((s) => `<div class="c"><div class="fig">${s.est ? "≈" : ""}${N(s.count, ne)}</div><div class="k">${esc(t(L.stage[s.key]))}</div></div>`).join("");
  return `<!doctype html><html lang="${lang}"><head>${HEAD}<style>
.wrap{position:absolute;left:64px;right:64px;top:126px;bottom:30px;display:flex;flex-direction:column;align-items:center;text-align:center}
.title{font-size:${ne ? 60 : 62}px;white-space:nowrap;margin-bottom:12px}
.cols{align-self:stretch;display:grid;grid-template-columns:repeat(${S.length},1fr);margin-top:-6px}
.cols .fig{font-size:38px;line-height:1.1}
:lang(ne) .cols .fig{font-family:"Noto Sans Devanagari",sans-serif;font-weight:600;font-size:38px;line-height:1.25}
.cols .k{font-size:24px;line-height:1.22;color:#4B5563;margin:2px 8px 0}
.pct{font-family:"IBM Plex Mono",monospace;font-weight:500;font-size:84px;line-height:1;color:#B5242C;margin-top:auto}
:lang(ne) .pct{font-family:"Noto Sans Devanagari",sans-serif;font-weight:600;font-size:80px;line-height:1.1}
.end{font-size:27px;line-height:1.3;color:#0E1F3B;margin-top:2px}
.note{margin-top:2px}
</style></head><body>${lockup}
<p class="kicker">${esc(t(L.kicker))}${ne ? "" : ` / <span lang="ne">${esc(L.kicker.ne)}</span>`}</p>
<div class="wrap" data-box>
<h1 class="title">${esc(t(L.title))}</h1>
<div class="funnel">${funnelSvg()}</div>
<div class="cols">${cols}</div>
<p class="pct">≈${ne ? dev(F.end.pct.en) : F.end.pct.en}</p>
<p class="end">${esc(t(L.end))}</p>
<p class="note">${esc(t(L.note))}</p>
</div>
<div class="rule"></div></body></html>`;
}

// --- one card per report page: section, a headline, one figure with its sentence ----------------
const hl = (s, fig) => esc(s).replace(esc(fig), `<b>${esc(fig)}</b>`);
const finding = (k) => { const f = by(k); return { title: f.headline.en, fig: f.ev.fig_en, line: f.ev.en }; };
const endLine = tpl("Of the {complaints} complaints");
const PAGES = [
  { path: "/highlights", section: ["Highlights", "मुख्य निष्कर्ष"], title: "What the research found",
    fig: String(JW.findings.length), line: `${JW.findings.length} gaps in accountability, from the first complaint to the money recovered, each with its evidence.` },
  { path: "/report", section: ["Full report", "पूरा प्रतिवेदन"], title: "The full report, stage by stage",
    fig: F.end.pct.en, line: fill(endLine) },
  { path: "/investigation", section: ["Investigation", "अनुसन्धान"], ...finding("shelved") },
  { path: "/prosecution", section: ["Prosecution", "अभियोजन"], ...finding("afterInvestigation") },
  { path: "/court-outcomes", section: ["Court outcomes", "अदालतको फैसला"], ...finding("lossRate") },
  { path: "/appeals", section: ["Appeals", "पुनरावेदन"], ...finding("oneWay") },
  { path: "/method", section: ["Method", "विधि"], title: "Sources, limits and how we counted",
    fig: V.courtYears, unit: "years", line: fill(tpl("The estimate is based on court records of every CIAA case")) },
  { path: "/privacy", section: ["Privacy", "गोपनीयता"], title: "Privacy",
    fig: null, line: "This site counts cases, not people. It does not name any defendant, complainant, witness or judge." },
];
// The privacy line is the /privacy page's own sentence; fail the build if that page changes it.
if (!readFileSync(join(SITE, "src/pages/Privacy.tsx"), "utf8").includes(PAGES[7].line)) throw new Error("privacy line no longer on /privacy");
for (const p of PAGES) if (p.fig && !p.line.includes(p.fig)) throw new Error(`${p.path}: figure ${p.fig} not in its sentence`);

function pageCard(p) {
  return `<!doctype html><html lang="en"><head>${HEAD}<style>
.wrap{position:absolute;left:64px;right:64px;top:142px;bottom:44px;display:flex;flex-direction:column}
.sec{font-size:26px;line-height:1.3;color:#4B5563;margin-bottom:10px}
.sec b{color:#0E1F3B;font-weight:600}
.title{font-size:48px}
.row{display:flex;align-items:center;gap:40px;margin-top:auto;margin-bottom:auto;padding-top:24px}
.row .fig{font-size:${p.fig && p.fig.length > 6 ? 72 : 104}px;line-height:1;color:#B5242C}
.row .fig.words{font-family:"Noto Sans Devanagari",sans-serif;font-weight:600;font-size:80px}
.row .unit{font-size:30px;line-height:1.2;color:#B5242C;text-align:center}
.row .lede{flex:1}
</style></head><body>${lockup}
<p class="kicker">${esc(L.title.en)} / <span lang="ne">${esc(L.title.ne)}</span></p>
<div class="wrap" data-box>
<p class="sec"><b>${esc(p.section[0])}</b> / <span lang="ne">${esc(p.section[1])}</span></p>
<h1 class="title">${esc(p.title)}</h1>
<div class="row">${p.fig ? `<div class="big"><div class="fig${/[a-z]/i.test(p.fig) ? " words" : ""}">${esc(p.fig)}</div>${p.unit ? `<div class="unit">${esc(p.unit)}</div>` : ""}</div>` : ""}<p class="lede">${p.fig ? hl(p.line, p.fig) : esc(p.line)}</p></div>
</div>
<div class="rule"></div></body></html>`;
}

// --- write the pages and the head text ------------------------------------------------------------
const homeDesc = fill(endLine);
const cards = [
  { file: "home.png", html: homeCard(false), path: "/", title: `${L.title.en} · Jawafdehi Initiative`, description: homeDesc,
    alt: `Jawafdehi Initiative, “Where accountability leaks”: a funnel from ${N(S[0].count)} complaints to the CIAA in ${V.fy} down to about ${N(stands.count)} convictions that stand, ${F.end.pct.en}.` },
  { file: "home-ne.png", html: homeCard(true), path: null, lang: "ne", title: `${L.title.ne} · जवाफदेही इनिशिएटिभ`, description: fill(tpl("आ.व. {fy} मा अख्तियारमा दर्ता भएका {complaints} उजुरीमध्ये"), true),
    alt: `जवाफदेही इनिशिएटिभ, “जवाफदेहिता कहाँ चुहिन्छ”: ${dev(V.fy)} मा अख्तियारमा परेका ${N(S[0].count, 1)} उजुरीदेखि करिब ${N(stands.count, 1)} कायम रहने कसुर ठहरसम्मको फनेल, ${dev(F.end.pct.en)}।` },
  ...PAGES.map((p) => ({ file: p.path.slice(1) + ".png", html: pageCard(p), path: p.path,
    title: `${p.section[0]} · ${L.title.en} · Jawafdehi Initiative`, description: p.line,
    alt: `Jawafdehi Initiative, “${L.title.en}”, ${p.section[0]}: ${p.title}.${p.fig ? " " + p.line : ""}` })),
];
for (const c of cards) writeFileSync(join(OUT, c.file.replace(/\.png$/, ".html")), c.html);
// "html" is a hash of the card's page: og/render_neo.py records it per PNG, and og/heads.mjs stops
// the build if a PNG was rendered from an older page (a figure changed and the card wasn't redrawn).
const sha = (s) => createHash("sha1").update(s).digest("hex").slice(0, 12);
writeFileSync(join(SITE, "og/cards.json"), JSON.stringify(cards.map(({ html, ...c }) => ({ ...c, html: sha(html) })), null, 1) + "\n");
console.log("og: wrote", cards.length, "cards:", cards.map((c) => c.file).join(", "));
