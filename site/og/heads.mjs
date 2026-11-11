// Share tags for every route, as static HTML, so link previews (WhatsApp, Facebook, X, LinkedIn),
// whose crawlers don't run JavaScript, see each page's own title, description and card.
//
//   node og/heads.mjs dist        after `vite build`: rewrites dist/index.html's <!--og--> block for
//                                 "/" and writes dist/<route>.html for every report page. Cloudflare's
//                                 assets serve /appeals from appeals.html (a 200, no redirect); the
//                                 SPA then runs as on any other path.
//   node og/heads.mjs --source    the same block in site/index.html, so dev and review builds match.
//
// The tags come from og/cards.json (written by og/cards.mjs from the page's data). Each image URL
// carries ?v=<hash of the PNG>, so a changed card is fetched again. The build stops if a card PNG
// is missing or was rendered from an older version of its page (og/render_neo.py records which).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://research.jawafdehi.org";
const cards = JSON.parse(readFileSync(join(SITE, "og/cards.json"), "utf8"));
const rendered = JSON.parse(readFileSync(join(SITE, "og/rendered.json"), "utf8"));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

for (const c of cards) {
  if (!existsSync(join(SITE, "public/og", c.file))) throw new Error(`og: public/og/${c.file} is missing; run python3 og/render_neo.py`);
  if (rendered[c.file] !== c.html) throw new Error(`og: public/og/${c.file} was rendered from an older card; run python3 og/render_neo.py ${c.file.replace(/\.png$/, "")}`);
}
const ver = (file) => createHash("sha1").update(readFileSync(join(SITE, "public/og", file))).digest("hex").slice(0, 8);

function block(c) {
  const url = ORIGIN + (c.path === "/" ? "/" : c.path), img = `${ORIGIN}/og/${c.file}?v=${ver(c.file)}`;
  return `<!--og-->
    <title>${esc(c.title)}</title>
    <meta name="description" content="${esc(c.description)}" />
    <link rel="canonical" href="${url}" />
    <meta name="theme-color" content="#0e1f3b" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:site_name" content="Jawafdehi Initiative" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(c.title)}" />
    <meta property="og:description" content="${esc(c.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${img}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(c.alt)}" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:locale:alternate" content="ne_NP" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@jawafdehi" />
    <meta name="twitter:title" content="${esc(c.title)}" />
    <meta name="twitter:description" content="${esc(c.description)}" />
    <meta name="twitter:image" content="${img}" />
    <meta name="twitter:image:alt" content="${esc(c.alt)}" />
    <!--/og-->`;
}
const RE = /<!--og-->[\s\S]*?<!--\/og-->/;
const put = (html, c) => { if (!RE.test(html)) throw new Error("og: no <!--og--> block in index.html"); return html.replace(RE, block(c)); };

const home = cards.find((c) => c.path === "/");
if (process.argv[2] === "--source") {
  const p = join(SITE, "index.html");
  writeFileSync(p, put(readFileSync(p, "utf8"), home));
  console.log("og: index.html head updated");
} else {
  const out = resolve(SITE, process.argv[2] || "dist");
  const shell = readFileSync(join(out, "index.html"), "utf8");
  const routes = cards.filter((c) => c.path);
  for (const c of routes) writeFileSync(join(out, c.path === "/" ? "index.html" : c.path.slice(1) + ".html"), put(shell, c));
  console.log(`og: share tags for ${routes.length} routes in ${out}`);
}
