# Corruption Accountability — dashboard

The browsable companion to the research pack in this repo. Same findings as the
notebook, arranged as six sections you can link to, published to GitHub Pages at
**https://research.jawafdehi.org**

It holds **no figures of its own**. Every number is derived from `../dataset/` by
`../gen_site_data.py` and written to `src/data/report.generated.json` at build time,
so the page and the dataset cannot disagree — regenerate rather than edit.

```
dataset/*.csv  ──▶  corpus_data.build_frames()  ──▶  report.generated.json  ──▶  the dashboard
```

## Run it locally

```bash
npm install
npm run data     # derive report.generated.json from ../dataset (needs ../.venv-notebook or pandas)
npm run dev      # http://localhost:5173
```

`npm run data` is only needed after the dataset changes — the generated file is
committed, so a fresh clone runs with `npm install && npm run dev` alone.

### Share a local preview over Cloudflare

```bash
npm run dev          # leave running
npm run tunnel       # in a second shell
```

`cloudflared` prints a `https://<random>.trycloudflare.com` URL that proxies to the
dev server, with hot reload intact. It is a **quick tunnel**: no Cloudflare account,
no API token, no DNS record, and nothing to clean up afterwards — close the process
and the URL dies. The URL is different every run, which is the point; it is for
showing work in progress, not for hosting.

Vite rejects unknown `Host` headers, so `server.allowedHosts` carries
`.trycloudflare.com`. That applies to the dev server only.

> The tunnel makes whatever is on port 5173 reachable by anyone holding the link.
> Treat it as public while it is running.

## Build

```bash
npm run build     # type-check, then build to dist/
npm run preview
```

The site is served at the root of its own domain, so the default base of `/` is
correct everywhere and `BASE_PATH` is not set. It would be needed again — as
`/corruption-research/` — only if the custom domain were dropped and the site fell
back to the `jawafdehi.github.io` project sub-path, where a root-based build 404s on
every asset.

Pages has no SPA rewrite, so a deep link like `/over-time` would 404. The build
writes `404.html` as a copy of `index.html` (and a `.nojekyll`) to hand those
requests back to the app — see `githubPagesFallback` in `vite.config.ts`.

## The custom domain

`research.jawafdehi.org` is a `CNAME` to `jawafdehi.github.io`, declared in the infra
repo at `terraform/cloudflare/dns.tf` (`cname_research`) — not clicked in by hand.

Two things hold it together, and both are easy to break:

- **`public/CNAME`** carries the domain into every build. Pages reads it on each
  deploy; a build without it resets the site to the github.io sub-path.
- **The record is deliberately not proxied** (grey cloud). GitHub issues the TLS
  certificate for this domain itself and cannot complete that validation through the
  Cloudflare proxy. Turning the orange cloud on before the certificate exists leaves
  the host with broken HTTPS. It can be proxied afterwards if the caching is wanted.

## Publishing

`.github/workflows/pages.yml` runs on a push to `main` that touches the dataset, the
derivation code or this directory. It **regenerates the data file from `dataset/`**
rather than trusting the committed copy, then type-checks, builds and deploys. So
what is published is always derived from the dataset at that commit.

Enabling it once, in the repo settings: **Pages → Build and deployment → Source →
GitHub Actions**.

## Moving these pages into the jawafdehi.org SPA

This is built to be lifted, not rewritten. It deliberately mirrors the main SPA:
React 18, Vite, TypeScript, Tailwind 3, recharts, the `@/` alias, and the same design
tokens in `src/index.css`.

- `src/components/research/*` and `src/components/data-quality/*` are **byte-identical
  copies** of the SPA's components. Nothing to port.
- `src/pages/*` call the real `react-i18next` API — `t("key", "English default")` —
  even though this site is English-only. `vite.config.ts` aliases `react-i18next` to
  a small shim in `src/lib/i18n-shim.ts`. **Drop the alias** (in `vite.config.ts` and
  `tsconfig.json`) and the imports resolve to the real library; the keys are already
  in place and the English defaults become the fallbacks they already are.
- `src/data/research-corruption.ts` exports the same names and types as the SPA's
  module of that name. Only its first lines differ: here `REPORT` is generated, there
  it is a baked literal.

So the move is: copy `src/pages/*`, keep the data module that suits the destination,
and delete the alias.

## Sections

| Route | What it covers |
|---|---|
| `/` | The funnel from complaint to conviction, and who owns each stage where it leaks |
| `/outcomes` | How decided cases end, and why the charge brought predicts the outcome |
| `/over-time` | Charge mix, outcome trend, filing pace and seasonality |
| `/benches` | Conviction rate by justice (bench-grain) and time-to-verdict by cohort |
| `/appeals` | What survives the Supreme Court, and how far it moves the rate |
| `/method` | Corpus definition, the cross-check against the Commission's reports, limits, provenance |

## Rules the copy has to keep

- **Every figure counts cases, not people.** The court records one verdict per case
  and publishes no per-accused outcome, so a per-person conviction rate does not
  exist in this data and must never be implied.
- **Say which conviction definition you are using** — full only, or full plus
  partial. The two answer different questions and the record cannot choose between
  them.
- **The per-justice chart is bench-grain.** Every panel member is credited with the
  panel's outcome. It describes the benches a justice sat on, never that justice's
  own record.
- **Cite in-platform materials**, never external news.
- **Never name internal systems in public copy.** It is "court records from Nepal's
  judiciary", not the pipeline's internal name.
