# 24th CIAA Annual Report — FY 2070/71

Fiscal year **BS 2070/71** (AD 2013/14). Commission for the Investigation of Abuse of Authority (अख्तियार दुरुपयोग अनुसन्धान आयोग).

## Files

- `24th-annual-report-2070-71.pdf` — source PDF ([ciaa.gov.np](https://ciaa.gov.np/uploads/publicationsAndReports/MlV2KJ.pdf))
- `24th-annual-report-2070-71.likhit.md` — full-report Markdown via **likhit** (Nepali PDF→Markdown with legacy-font repair; recovers body text, headings, and ruled tables). 6,540 KB.
- `figures/` — chart data that likhit **cannot** convert (charts/graphs are images).
  - `figure_pages.json` — 13 candidate chart pages the detector found.
  - `pages/p*.png` — 300-DPI renders of those pages.
  - `figures.json` / `figures.md` — **6 charts** transcribed by a two-pass vision read (8 values estimated off-axis).

## Method

`likhit` is a text/font-extraction pipeline: it recovers prose and the ruled statistical **tables** as Markdown, but silently drops **chart/graph images** (bar, pie, line). Those charts encode numbers only as pixels, so they were rendered to PNG and transcribed by two independent vision reads, reconciled per value. See `../_tools/EXTRACT_SPEC.md`.

## Charts extracted

- **p862** अनुसूची-९ (१) — आ.व. २०७०/७१ मा उजुरी फछ्र्यौट र जिम्मेवारी सरेको विवरण (pie, 2 points)
- **p862** अनुसूची-९ (२) — आ.व.२०७०/७१ को विस्तृत अनुसन्धानतर्फको अभियोजन र अन्य कारबाहीको विवरण (pie, 9 points)
- **p863** अनुसूची-१० (१) — आ.व. २०७०/७१ मा विशेष अदालतमा दायर भएका जम्मा १६८ मुद्दाहरूको किसिम (pie, 8 points)
- **p863** अनुसूची-१० (२) — आ.व. २०७०/७१ मा मुद्दा जितहारको स्थिति (bar, 3 points)
- **p864** अनुसूची-११ — आयोगबाट आ.व.२०७०/७१ मा भएका निर्णयहरूको विस्तृत अनुसन्धानको क्षेत्रगत विवरण (radar, 8 points)
- **p865** अनुसूची-१२ — आ.व. २०४८/४९ देखि आ.व. २०७०/७१ सम्म परेका उजुरीहरू तथा फछ्र्यौटको तुलनात्मक विवरण (line, 46 points)
